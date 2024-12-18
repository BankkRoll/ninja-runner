"use client";

import { GameProvider, useGameContext } from "./game-context";
import React, { useEffect, useState } from "react";

import { GameScreen } from "./game-screen";
import { Leaderboard } from "./leaderboard";

const Game: React.FC = () => {
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    // Check if the app is running on localhost
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "localhost"
    ) {
      setDebugMode(true);
    }
  }, []);

  const {
    gameState,
    riderState,
    highScore,
    score,
    gameTime,
    username,
    isUsernameValid,
    countdown,
    showCountdown,
    riderHitBox,
    isSettingsOpen,
    isScoreSubmitted,
    top10Daily,
    top10AllTime,
    audioState,
    toggleMusic,
    toggleSound,
    updateMusicVolume,
    updateSoundVolume,
    startGame,
    jump,
    slide,
    unslide,
    handleKeyDown,
    handleKeyUp,
    gameLoop,
    gameLoopRef,
    riderRef,
    obstacleRefs,
    audioRef,
    toggleSettings,
    submitScore,
    fetchScores,
  } = useGameContext();

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

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
    if (isUsernameValid) {
      startGame();
    }
  };

  const handlePlayAgain = () => {
    startGame();
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto px-4 gap-6">
      <GameScreen
        riderState={riderState}
        allTimeHighScore={highScore}
        score={score}
        gameState={gameState}
        username={username}
        isUsernameValid={isUsernameValid}
        startGame={handleStartGame}
        showCountdown={showCountdown}
        countdown={countdown}
        onPlayAgain={handlePlayAgain}
        onJump={jump}
        onSlide={slide}
        onUnslide={unslide}
        debugMode={debugMode}
        riderHitBox={riderHitBox}
        isScoreSubmitted={isScoreSubmitted}
        submitScore={submitScore}
        isSettingsOpen={isSettingsOpen}
        toggleSettings={toggleSettings}
        audioState={audioState}
        toggleMusic={toggleMusic}
        toggleSound={toggleSound}
        updateMusicVolume={updateMusicVolume}
        updateSoundVolume={updateSoundVolume}
        riderRef={riderRef}
        obstacleRefs={obstacleRefs}
        cumulativeGameTime={gameTime}
      />
      <Leaderboard top10Daily={top10Daily} top10AllTime={top10AllTime} />
    </div>
  );
};

export const AzaleaRunner: React.FC = () => (
  <GameProvider>
    <Game />
  </GameProvider>
);
