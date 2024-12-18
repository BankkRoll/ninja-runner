import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import React from "react";
import { motion } from "framer-motion";

type GameOverScreenProps = {
  score: number;
  onPlayAgain: () => void;
};

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  onPlayAgain,
}) => {
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
          <p className="text-center text-xl">Your Score: {score}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onPlayAgain} className="w-full">
            Play Again
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
