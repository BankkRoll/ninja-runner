"use client";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";

type ShareCardProps = {
  username: string;
  score: number;
  screenshot: string | null;
};

export const ShareCard: React.FC<ShareCardProps> = ({
  username,
  score,
  screenshot,
}) => {
  const [buttonText, setButtonText] = useState("Share");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleShare = async () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 1200;
      canvas.height = 630;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = screenshot || "/arcade/azaleas-runner/images/azaleas-dodger-preview-img.png";

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.font = "bold 48px Inter, system-ui, sans-serif";
      ctx.fillText("Player:", 200, canvas.height / 2 - 60);
      ctx.font = "64px Inter, system-ui, sans-serif";
      ctx.fillText(username, 200, canvas.height / 2 + 20);

      ctx.textAlign = "right";
      ctx.font = "bold 48px Inter, system-ui, sans-serif";
      ctx.fillText("Score:", canvas.width - 200, canvas.height / 2 - 60);
      ctx.font = "64px Inter, system-ui, sans-serif";
      ctx.fillText(score.toString(), canvas.width - 200, canvas.height / 2 + 20);

      ctx.font = "36px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Play now at: crashtestjoyride.com", canvas.width / 2, canvas.height - 50);

      if (isMobile) {
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "game-score.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setButtonText("Saved!");
      } else {
        const blob = await new Promise<Blob>((resolve) => canvas.toBlob((blob) => resolve(blob!)));
        const data = [new ClipboardItem({ [blob.type]: blob })];
        await navigator.clipboard.write(data);
        setButtonText("Copied!");
      }

      setTimeout(() => setButtonText(isMobile ? "Save" : "Share"), 2000);
    } catch (error) {
      console.error("Error sharing:", error);
      setButtonText("Error");
      setTimeout(() => setButtonText(isMobile ? "Save" : "Share"), 2000);
    }
  };

  return (
    <div className="relative overflow-hidden w-full md:min-w-96 h-full min-h-64 max-w-6xl mx-auto mb-4 rounded-xl border">
      <img
        src={screenshot || "/arcade/azaleas-runner/images/azaleas-dodger-preview-img.png"}
        alt="Share background"
        className="absolute inset-0 w-full h-full object-cover object-left"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/30 flex flex-col items-center justify-center text-white p-8">
        <div className="w-full flex justify-center gap-24 items-center mb-8">
          <div className="text-left">
            <h4 className="text-xl font-semibold mb-2">Player:</h4>
            <h3 className="text-2xl font-bold max-w-[50%]">{username}</h3>
          </div>
          <div className="text-right">
            <h4 className="text-xl font-semibold mb-2">Score:</h4>
            <p className="text-2xl font-bold flex items-center justify-end">{score}</p>
          </div>
        </div>
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <p className="text-xs font-medium text-gray-300">
            Play now at: <span className="font-bold text-white">crashtestjoyride.com</span>
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-1 right-1"
          onClick={handleShare}
        >
          {isMobile ? "Save" : buttonText}
        </Button>
      </div>
    </div>
  );
};

