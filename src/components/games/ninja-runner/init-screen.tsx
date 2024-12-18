import { ArrowRight, Gamepad2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";

type Character = "ninja" | "frog" | "pink";

type InitScreenProps = {
  selectedCharacter: Character | null;
  setSelectedCharacter: React.Dispatch<React.SetStateAction<Character | null>>;
  startGame: () => void;
};

export const InitScreen: React.FC<InitScreenProps> = ({
  selectedCharacter,
  setSelectedCharacter,
  startGame,
}) => {
  const characters: Character[] = ["ninja", "frog", "pink"];

  useEffect(() => {
    if (!selectedCharacter) {
      setSelectedCharacter("ninja");
    }
  }, [selectedCharacter, setSelectedCharacter]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-95">
      <Card className="flex flex-col items-center justify-center w-full max-w-md bg-card/90">
        <CardHeader>
          <CardTitle className="text-xl md:text-3xl font-bold text-center flex items-center justify-center gap-2">
            <Gamepad2 className="w-8 h-8" />
            Ninja Runner
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
                    src={`/game/characters/${character}-idle.gif`}
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
            className="w-full py-6 text-lg font-bold"
          >
            Start Game
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
