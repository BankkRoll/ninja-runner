import { ArrowRight, Gamepad2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Character, InitScreenProps } from "./types";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";

export const InitScreen: React.FC<InitScreenProps> = ({
  selectedCharacter,
  setSelectedCharacter,
  startGame,
}) => {
  const characters: Character[] = ["frog", "ninja", "pink"];

  useEffect(() => {
    if (!selectedCharacter) {
      setSelectedCharacter("frog");
    }
  }, [selectedCharacter, setSelectedCharacter]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-card/90 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-3xl font-bold text-center flex items-center justify-center gap-2">
            <Gamepad2 className="w-8 h-8" />
            Ninja Jump
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-center">
              Select Your Character
            </h2>
            <div className="flex justify-center gap-4">
              {characters.map((character) => (
                <Button
                  key={character}
                  onClick={() => setSelectedCharacter(character)}
                  className={`h-24 w-24 p-1 ${
                    selectedCharacter === character ? "ring-2 ring-primary" : ""
                  }`}
                  variant="outline"
                >
                  <img
                    src={
                      selectedCharacter === character
                        ? `/game/characters/${character}-running.gif`
                        : `/game/characters/${character}-idle.gif`
                    }
                    alt={`${character} character`}
                    className="w-full h-full object-top object-cover"
                  />
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="w-full">
          <Button
            onClick={startGame}
            disabled={!selectedCharacter}
            className="w-full py-6 text-lg"
          >
            Start Game
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
