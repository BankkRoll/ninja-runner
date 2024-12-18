"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { GameState, useGameContext } from "./game-context";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { CountdownOverlay } from "./countdown-overlay";
import { GameOverScreen } from "./game-over-screen";
import { InitScreen } from "./init-screen";
import { Settings } from "lucide-react";
import { SettingsMenu } from "./settings-menu";
import html2canvas from "html2canvas";
import { useMediaQuery } from "@/hooks/use-media-query";

type HitBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type AudioState = {
  musicOn: boolean;
  soundOn: boolean;
  musicVolume: number;
  soundVolume: number;
};

type GameScreenProps = {
  riderState: string;
  allTimeHighScore: number;
  score: number;
  gameState: GameState;
  username: string;
  isUsernameValid: boolean;
  startGame: () => void;
  showCountdown: boolean;
  countdown: number;
  onPlayAgain: () => void;
  onJump: () => void;
  onSlide: () => void;
  onUnslide: () => void;
  debugMode: boolean;
  riderHitBox: HitBox;
  isScoreSubmitted: boolean;
  submitScore: () => Promise<void>;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
  audioState: AudioState;
  toggleMusic: () => void;
  toggleSound: () => void;
  updateMusicVolume: (volume: number) => void;
  updateSoundVolume: (volume: number) => void;
  riderRef: React.RefObject<HTMLDivElement>;
  obstacleRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  cumulativeGameTime: number;
};

export const GameScreen: React.FC<GameScreenProps> = React.memo(
  ({
    riderState,
    allTimeHighScore,
    score,
    gameState,
    username,
    isUsernameValid,
    startGame,
    showCountdown,
    countdown,
    onPlayAgain,
    onJump,
    onSlide,
    onUnslide,
    debugMode,
    riderHitBox,
    isScoreSubmitted,
    submitScore,
    isSettingsOpen,
    toggleSettings,
    audioState,
    toggleMusic,
    toggleSound,
    updateMusicVolume,
    updateSoundVolume,
    riderRef,
    obstacleRefs,
    cumulativeGameTime,
  }) => {
    const { setUsername, obstacles, checkUsername } = useGameContext();

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const riderImageSrc = useMemo(() => {
      if (isSettingsOpen || gameState === "paused") {
        return "/arcade/azaleas-runner/images/runningrider_stand.png";
      }
      switch (riderState) {
        case "running":
          return "/arcade/azaleas-runner/images/runningrider.gif";
        case "jumping":
          return "/arcade/azaleas-runner/images/runningrider_jump.png";
        case "falling":
          return "/arcade/azaleas-runner/images/runningrider_stand.png";
        case "sliding":
          return "/arcade/azaleas-runner/images/runningrider_slide.png";
        default:
          return "/arcade/azaleas-runner/images/runningrider_stand.png";
      }
    }, [riderState, isSettingsOpen, gameState]);

    // Calculate precise hitbox dimensions based on rider state
    const getHitboxDimensions = (state: string) => {
      const baseWidth = isDesktop ? 40 : 30;
      const baseHeight = isDesktop ? 160 : 80;

      switch (state) {
        case "sliding":
          return {
            width: baseHeight,
            height: baseWidth,
          };
        case "jumping":
        case "falling": 
          return {
            width: baseWidth * 0.8,
            height: baseHeight * 0.9,
          };
        default:
          return {
            width: baseWidth,
            height: baseHeight,
          };
      }
    };

    const hitboxDimensions = getHitboxDimensions(riderState);

    const gameScreenRef = useRef<HTMLDivElement>(null);
    const excludeFromScreenshotRef = useRef<HTMLDivElement>(null);
    const [screenshot, setScreenshot] = useState<string | null>(null);

    const captureScreenshot = useCallback(async () => {
      if (gameScreenRef.current && excludeFromScreenshotRef.current) {
        // Hide elements before capturing
        excludeFromScreenshotRef.current.style.visibility = "hidden";

        const canvas = await html2canvas(gameScreenRef.current);
        setScreenshot(canvas.toDataURL());

        // Show elements after capturing
        excludeFromScreenshotRef.current.style.visibility = "visible";
      }
    }, []);

    useEffect(() => {
      if (gameState === "gameOver") {
        captureScreenshot();
      }
    }, [gameState, captureScreenshot]);

    return (
      <Card
        className="relative w-full h-[500px] md:h-[600px] overflow-hidden"
        ref={gameScreenRef}
      >
        <CardContent className="p-0">
          {/* Background Image */}
          <div className="absolute inset-x-0 bottom-0">
            <img
              src="/arcade/azaleas-runner/images/runningrider_bg.png"
              alt="Azalea"
              className="w-full h-[500px] md:h-[600px] object-bottom object-cover"
            />
          </div>

          {/* Score and Settings */}
          <div ref={excludeFromScreenshotRef}>
            <div className="absolute top-0 left-0 w-full bg-black bg-opacity-50 p-2 flex justify-between items-center text-white text-sm md:text-xl font-mono">
              <span>High: {allTimeHighScore.toString().padStart(8, "0")}</span>
              <div className="space-x-2 flex items-center">
                <span>Score: {score.toString().padStart(8, "0")}</span>
                <Button size="icon" variant="ghost" onClick={toggleSettings}>
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Mobile Controls */}
            <div
              className="md:hidden absolute bottom-2 left-2 right-2 flex justify-between select-none touch-none"
              style={{
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                userSelect: "none",
                touchAction: "none",
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <Button
                variant="secondary"
                className="bg-secondary/20 border border-secondary/20 rounded-full w-24 h-24 text-lg font-bold touch-none select-none"
                onTouchStart={(e) => {
                  e.preventDefault();
                  onSlide();
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  onUnslide();
                }}
                onDragStart={(e) => e.preventDefault()}
                disabled={isSettingsOpen}
                aria-label="Slide"
              >
                <span className="pointer-events-none">Slide</span>
              </Button>

              <Button
                variant="secondary"
                className="bg-secondary/20 border border-secondary/20 rounded-full w-24 h-24 text-lg font-bold touch-none select-none"
                onTouchStart={(e) => {
                  e.preventDefault();
                  onJump();
                }}
                onTouchEnd={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                disabled={isSettingsOpen}
                aria-label="Jump"
              >
                <span className="pointer-events-none">Jump</span>
              </Button>
            </div>
          </div>

          {/* Rider Container */}
          <motion.div
            className="absolute left-4 bottom-[120px] md:bottom-[150px]"
            animate={{
              y:
                riderState === "jumping"
                  ? isDesktop
                    ? -120
                    : -60
                  : riderState === "falling"
                    ? 0
                    : 0,
              x: riderState === "sliding" ? (isDesktop ? 10 : 5) : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration:
                riderState === "jumping" || riderState === "falling"
                  ? 1.8
                  : 0.5,
            }}
          >
            {/* Rider Image */}
            <div className="relative">
              <img
                src={riderImageSrc}
                alt="Runner"
                className={`h-24 md:h-auto ${
                  isSettingsOpen ? "opacity-50" : ""
                }`}
              />

              {/* Precise Hitbox */}
              <div
                ref={riderRef}
                className={`absolute ${
                  debugMode ? "border-4 border-green-500" : ""
                }`}
                style={{
                  width: hitboxDimensions.width,
                  height: hitboxDimensions.height,
                  left: "50%",
                  right: "50%",
                  transform: "translateX(-50%)",
                  borderRadius: hitboxDimensions.width / 2,
                  bottom: 0,
                  pointerEvents: "none",
                }}
              />
            </div>
          </motion.div>

          {/* Obstacles */}
          {obstacles.map((obstacle, index) => (
            <motion.div
              key={obstacle.id}
              className="absolute w-8 h-8 md:w-16 md:h-16"
              style={{
                right: `${obstacle.position}%`,
                bottom: obstacle.isLow
                  ? isDesktop
                    ? "150px"
                    : "120px"
                  : isDesktop
                    ? "250px"
                    : "170px",
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: isSettingsOpen ? 0.5 : 1,
                scale: 1,
                transition: { duration: 0.2 },
              }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              {/* Obstacle Image */}
              <div className="relative w-full h-full">
                <img
                  src="/arcade/azaleas-runner/images/azalea.png"
                  alt="Azalea Obstacle"
                  className="w-full h-full object-contain"
                />

                {/* Precise Obstacle Hitbox */}
                <div
                  ref={(el) => {
                    if (obstacleRefs.current) {
                      obstacleRefs.current[index] = el;
                    }
                  }}
                  className={`absolute ${
                    debugMode ? "border-4 border-green-500" : ""
                  }`}
                  style={{
                    width: isDesktop ? "50px" : "30px",
                    height: isDesktop ? "50px" : "30px",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    borderRadius: "50%",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </motion.div>
          ))}

          {/* Game State Screens */}
          <AnimatePresence>
            {gameState === "init" && (
              <InitScreen
                username={username}
                setUsername={setUsername}
                isUsernameValid={isUsernameValid}
                checkUsername={checkUsername}
                startGame={startGame}
              />
            )}

            {gameState === "gameOver" && (
              <GameOverScreen
                score={score}
                allTimeHighScore={allTimeHighScore}
                onPlayAgain={onPlayAgain}
                isScoreSubmitted={isScoreSubmitted}
                submitScore={submitScore}
                username={username}
                screenshot={screenshot}
              />
            )}

            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              >
                <SettingsMenu
                  isOpen={isSettingsOpen}
                  onClose={toggleSettings}
                  audioState={audioState}
                  toggleMusic={toggleMusic}
                  toggleSound={toggleSound}
                  updateMusicVolume={updateMusicVolume}
                  updateSoundVolume={updateSoundVolume}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Countdown Overlay */}
          {showCountdown && <CountdownOverlay countdown={countdown} />}
        </CardContent>
      </Card>
    );
  },
);

GameScreen.displayName = "GameScreen";
