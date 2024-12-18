"use client";

import { GameProvider, useGameContext } from "./game-context";
import React, { useEffect, useState } from "react";

import { GameScreen } from "./game-screen";

const Game: React.FC = () => {
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "localhost"
    ) {
      setDebugMode(true);
    }
  }, []);

  const {
    gameState,
    characterState,
    score,
    showCountdown,
    countdown,
    isSettingsOpen,
    audioState,
    toggleMusic,
    toggleSound,
    updateMusicVolume,
    updateSoundVolume,
    startGame,
    jump,
    handleKeyDown,
    gameLoop,
    gameLoopRef,
    characterRef,
    obstacleRefs,
    audioRef,
    toggleSettings,
    selectedCharacter,
    setSelectedCharacter,
  } = useGameContext();

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState, gameLoop, gameLoopRef]);

  useEffect(() => {
    const { musicOn, soundOn, musicVolume, soundVolume } = audioState;

    Object.values(audioRef.current).forEach((audio) => {
      if (audio) {
        audio.volume =
          (audio === audioRef.current.background ? musicVolume : soundVolume) /
          100;
        audio.muted =
          audio === audioRef.current.background ? !musicOn : !soundOn;
      }
    });

    if (gameState === "playing" && musicOn && audioRef.current.background) {
      audioRef.current.background
        .play()
        .catch((error) =>
          console.error("Error playing background music:", error),
        );
    } else if (audioRef.current.background) {
      audioRef.current.background.pause();
    }
  }, [audioState, gameState, audioRef]);

  const handleStartGame = () => {
    if (selectedCharacter) {
      startGame();
    }
  };

  const handlePlayAgain = () => {
    startGame();
  };

  return (
    <div
      className="flex flex-col items-center w-full mx-auto px-4 gap-6 select-none touch-none"
      style={{
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <GameScreen
        characterState={characterState}
        score={score}
        gameState={gameState}
        selectedCharacter={selectedCharacter}
        setSelectedCharacter={setSelectedCharacter}
        startGame={handleStartGame}
        showCountdown={showCountdown}
        countdown={countdown}
        onPlayAgain={handlePlayAgain}
        onJump={jump}
        debugMode={debugMode}
        isSettingsOpen={isSettingsOpen}
        toggleSettings={toggleSettings}
        audioState={audioState}
        toggleMusic={toggleMusic}
        toggleSound={toggleSound}
        updateMusicVolume={updateMusicVolume}
        updateSoundVolume={updateSoundVolume}
        characterRef={characterRef}
        obstacleRefs={obstacleRefs}
      />
    </div>
  );
};

export const NinjaRunner: React.FC = () => (
  <GameProvider>
    <Game />
  </GameProvider>
);
