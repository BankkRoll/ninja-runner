import { ArrowRight, Trophy, UserPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { CharacterSelectionPopup } from "./character-selection-popup";
import { GameOverScreenProps } from "./types";
import { motion } from "framer-motion";

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  onPlayAgain,
  onChangeCharacter,
  currentCharacter,
}) => {
  const [isCharacterSelectionOpen, setIsCharacterSelectionOpen] =
    useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <Card className="w-full max-w-md bg-card/90 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex flex-col items-center gap-2">
            <Trophy className="w-12 h-12 text-yellow-500" />
            Game Over
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-xl font-semibold">Your Score</p>
            <p className="text-4xl font-bold text-primary">
              {score.toString().padStart(8, "0")}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={onPlayAgain}
            className="w-full py-6 text-lg font-bold"
          >
            Play Again
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            onClick={() => setIsCharacterSelectionOpen(true)}
            variant="outline"
            className="w-full py-4 text-lg font-bold"
          >
            Change Character
            <UserPlus className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>

      <CharacterSelectionPopup
        isOpen={isCharacterSelectionOpen}
        onClose={() => setIsCharacterSelectionOpen(false)}
        onSelectCharacter={(character) => {
          onChangeCharacter(character);
          setIsCharacterSelectionOpen(false);
        }}
        currentCharacter={currentCharacter}
      />
    </motion.div>
  );
};
