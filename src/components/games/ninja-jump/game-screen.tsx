"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CharacterState, GameScreenProps } from "./types";
import { DESKTOP_BREAKPOINT, IMAGES } from "./constants";
import React, { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { CountdownOverlay } from "./countdown-overlay";
import { GameOverScreen } from "./game-over-screen";
import { InitScreen } from "./init-screen";
import { Settings } from "lucide-react";
import { SettingsMenu } from "./settings-menu";
import { useGameContext } from "./game-context";
import { useMediaQuery } from "@/hooks/use-media-query";

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
    onChangeCharacter,
  }) => {
    const { obstacles } = useGameContext();

    const isDesktop = useMediaQuery(`(min-width: ${DESKTOP_BREAKPOINT}px)`);

    const characterImageSrc = useMemo(() => {
      if (isSettingsOpen || gameState === "paused") {
        return IMAGES.CHARACTER.IDLE(selectedCharacter!);
      }
      switch (characterState) {
        case "running":
          return IMAGES.CHARACTER.RUNNING(selectedCharacter!);
        case "jumping":
          return IMAGES.CHARACTER.IDLE(selectedCharacter!);
        default:
          return IMAGES.CHARACTER.IDLE(selectedCharacter!);
      }
    }, [characterState, isSettingsOpen, gameState, selectedCharacter]);

    const getHitboxDimensions = (state: CharacterState) => {
      const baseWidth = isDesktop ? 35 : 25;
      const baseHeight = isDesktop ? 60 : 40;

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
          <div className="absolute inset-x-0 bottom-0">
            <img
              src={IMAGES.BACKGROUND}
              alt="Background"
              className="w-full h-[400px] md:h-[580px] object-cover"
            />
          </div>

          <div>
            <div className="absolute top-0 left-0 right-0 w-full bg-black bg-opacity-50 p-2 flex justify-between items-center text-white text-sm md:text-xl font-mono">
              <span>Score: {score.toString().padStart(8, "0")}</span>
              <Button size="icon" variant="ghost" onClick={toggleSettings}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>

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
                onTouchEnd={(e) => {
                  e.preventDefault();
                  if (characterRef.current) {
                    characterRef.current.dataset.grounded = "true";
                  }
                }}
                onTouchCancel={(e) => {
                  e.preventDefault();
                  if (characterRef.current) {
                    characterRef.current.dataset.grounded = "true";
                  }
                }}
                onDragStart={(e) => e.preventDefault()}
                disabled={isSettingsOpen}
                aria-label="Jump"
              >
                <span className="pointer-events-none">Jump</span>
              </Button>
            </div>
          </div>

          <motion.div
            className="absolute left-4 bottom-[90px] md:bottom-[120px]"
            animate={{
              y: characterState === "jumping" ? (isDesktop ? -80 : -50) : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <div className="relative">
              <img
                src={characterImageSrc}
                alt="Character"
                className={`h-16 md:h-24 w-auto object-cover  ${
                  isSettingsOpen ? "opacity-50" : ""
                }`}
              />

              <div
                ref={characterRef}
                className={`absolute ${
                  debugMode ? "border-4 bg-red-500/50 border-red-500" : ""
                }`}
                style={{
                  width: hitboxDimensions.width,
                  height: hitboxDimensions.height,
                  left: "50%",
                  right: "50%",
                  transform: "translateX(-50%)",
                  borderRadius: hitboxDimensions.width / 2,
                  bottom: isDesktop ? 10 : 5,
                  pointerEvents: "none",
                }}
              />
            </div>
          </motion.div>

          {obstacles.map((obstacle, index) => (
            <motion.div
              key={obstacle.id}
              className="absolute w-8 h-8"
              style={{
                right: `${obstacle.position}%`,
                bottom: obstacle.isLow
                  ? isDesktop
                    ? "150px"
                    : "90px"
                  : isDesktop
                    ? "125px"
                    : "100px",
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: isSettingsOpen ? 0.5 : 1,
                scale: 1,
                transition: { duration: 0.2 },
              }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <div className="relative w-full h-full">
                <img
                  src={IMAGES.OBSTACLE}
                  alt="Obstacle"
                  className="w-full h-full object-contain"
                />

                <div
                  ref={(el) => {
                    if (obstacleRefs.current) {
                      obstacleRefs.current[index] = el;
                    }
                  }}
                  className={`absolute ${
                    debugMode ? "border-4 bg-red-500/50 border-red-500" : ""
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

          <AnimatePresence>
            {gameState === "init" && (
              <InitScreen
                selectedCharacter={selectedCharacter}
                setSelectedCharacter={setSelectedCharacter}
                startGame={startGame}
              />
            )}

            {gameState === "gameOver" && (
              <GameOverScreen
                score={score}
                onPlayAgain={onPlayAgain}
                onChangeCharacter={onChangeCharacter}
                currentCharacter={selectedCharacter!}
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

          {showCountdown && <CountdownOverlay countdown={countdown} />}
        </CardContent>
      </Card>
    );
  },
);
