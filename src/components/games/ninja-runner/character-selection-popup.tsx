import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Character, CharacterSelectionPopupProps } from "./types";

import { Button } from "@/components/ui/button";
import React from "react";

const characters: Character[] = ["frog", "ninja", "pink"];

export const CharacterSelectionPopup: React.FC<
  CharacterSelectionPopupProps
> = ({ isOpen, onClose, onSelectCharacter, currentCharacter }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="w-full max-w-md p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-card/90 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Select Your Character
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex justify-center gap-4">
                {characters.map((character) => (
                  <motion.div
                    key={character}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => onSelectCharacter(character)}
                      className={`h-24 w-24 p-1 rounded-xl overflow-hidden ${
                        currentCharacter === character
                          ? "ring-2 ring-primary shadow-lg"
                          : ""
                      }`}
                      variant="outline"
                    >
                      <img
                        src={`/game/characters/${character}-${
                          currentCharacter === character ? "running" : "idle"
                        }.gif`}
                        alt={`${character} character`}
                        className="w-full h-full object-cover"
                      />
                    </Button>
                  </motion.div>
                ))}
              </div>
              <Button onClick={onClose} className="mt-4">
                Close
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
