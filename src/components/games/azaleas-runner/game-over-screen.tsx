"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { ShareCard } from "./share-card";
import { motion } from "framer-motion";

type GameOverScreenProps = {
  score: number;
  allTimeHighScore: number;
  onPlayAgain: () => void;
  isScoreSubmitted: boolean;
  submitScore: () => Promise<void>;
  username: string;
  screenshot: string | null;
};

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  allTimeHighScore,
  onPlayAgain,
  isScoreSubmitted,
  submitScore,
  username,
  screenshot,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmitScore = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await submitScore();
      setIsSubmitting(false);
    } catch (error) {
      setSubmitError("Failed to submit score. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Game Over
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {score > allTimeHighScore && (
            <p className="text-green-500 text-center font-bold">
              New all-time high score!
            </p>
          )}
          {isScoreSubmitted && (
            <p className="text-green-500 text-center">
              Score submitted successfully!
            </p>
          )}
          {submitError && (
            <p className="text-red-500 text-center">{submitError}</p>
          )}
          <ShareCard
            username={username}
            score={score}
            screenshot={screenshot}
          />
        </CardContent>
        <CardFooter className="flex flex-row items-center gap-2">
          {!isScoreSubmitted && (
            <Button
              onClick={handleSubmitScore}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit Score"}
            </Button>
          )}
          <Button onClick={onPlayAgain} className="w-full">
            Play Again
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
