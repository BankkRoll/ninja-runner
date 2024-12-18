"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CharacterState, GameState, useGameContext } from "./game-context";
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

type Character = "ninja" | "frog" | "pink";

type GameScreenProps = {
  characterState: CharacterState;
  score: number;
  gameState: GameState;
  selectedCharacter: Character | null;
  setSelectedCharacter: React.Dispatch<React.SetStateAction<Character | null>>;
  startGame: () => void;
  showCountdown: boolean;
  countdown: number;
  onPlayAgain: () => void;
  onJump: () => void;
  debugMode: boolean;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
  audioState: AudioState;
  toggleMusic: () => void;
  toggleSound: () => void;
  updateMusicVolume: (volume: number) => void;
  updateSoundVolume: (volume: number) => void;
  characterRef: React.RefObject<HTMLDivElement>;
  obstacleRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
};

export const GameScreen: React.FC<GameScreenProps> = React.memo(
  ({
    characterState,
    score,
    gameState,
    selectedCharacter,
    setSelectedCharacter,
    startGame,
    showCountdown,
    countdown,
    onPlayAgain,
    onJump,
    debugMode,
    isSettingsOpen,
    toggleSettings,
    audioState,
    toggleMusic,
    toggleSound,
    updateMusicVolume,
    updateSoundVolume,
    characterRef,
    obstacleRefs,
  }) => {
    const { obstacles } = useGameContext();

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const characterImageSrc = useMemo(() => {
      if (isSettingsOpen || gameState === "paused") {
        return `/game/characters/${selectedCharacter}-idle.gif`;
      }
      switch (characterState) {
        case "running":
          return `/game/characters/${selectedCharacter}-running.gif`;
        case "jumping":
          return `/game/characters/${selectedCharacter}-idle.gif`;
        default:
          return `/game/characters/${selectedCharacter}-idle.gif`;
      }
    }, [characterState, isSettingsOpen, gameState, selectedCharacter]);

    const getHitboxDimensions = (state: CharacterState) => {
      const baseWidth = 25
      const baseHeight = isDesktop ? 40 : 40;

      switch (state) {
        case "jumping":
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

    const hitboxDimensions = getHitboxDimensions(characterState);

    return (
      <Card className="relative w-full h-[400px] md:h-[580px] overflow-hidden">
        <CardContent className="p-0">
          {/* Background Image */}
          <div className="absolute inset-x-0 bottom-0">
            <img
              src="/game/background.jpg"
              alt="Background"
              className="w-full h-[400px] md:h-[580px] object-cover"
            />
          </div>

          {/* Score and Settings */}
          <div>
            <div className="absolute top-0 left-0 right-0 w-full bg-black bg-opacity-50 p-2 flex justify-between items-center text-white text-sm md:text-xl font-mono">
              <span>Score: {score.toString().padStart(8, "0")}</span>
              <Button size="icon" variant="ghost" onClick={toggleSettings}>
                <Settings className="w-4 h-4" />
              </Button>
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

          {/* Character Container */}
          <motion.div
            className="absolute left-4 bottom-[15px] md:bottom-[50px]"
            animate={{
              y: characterState === "jumping" ? (isDesktop ? -80 : -50) : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            {/* Character Image */}
            <div className="relative">
              <img
                src={characterImageSrc}
                alt="Character"
                className={`h-36 w-auto object-cover  ${
                  isSettingsOpen ? "opacity-50" : ""
                }`}
              />

              {/* Precise Hitbox */}
              <div
                ref={characterRef}
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
                  bottom: 90,
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
                    ? "180px"
                    : "100px"
                  : isDesktop
                    ? "110px"
                    : "150px",
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
                  src="/game/ninja-runner/images/obstacle.png"
                  alt="Obstacle"
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
                    width: isDesktop ? "30px" : "20px",
                    height: isDesktop ? "30px" : "20px",
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
                selectedCharacter={selectedCharacter}
                setSelectedCharacter={setSelectedCharacter}
                startGame={startGame}
              />
            )}

            {gameState === "gameOver" && (
              <GameOverScreen score={score} onPlayAgain={onPlayAgain} />
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
