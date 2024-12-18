import {
  AudioState,
  Character,
  CharacterState,
  GameContextType,
  GameState,
  HitBox,
  Obstacle,
} from "./types";
import {
  COUNTDOWN_DURATION,
  DESKTOP_BREAKPOINT,
  INITIAL_BLOCK_SPEED,
  INITIAL_OBSTACLE_GENERATION_INTERVAL,
  JUMP_COOLDOWN,
  JUMP_DURATION,
  MIN_OBSTACLE_GENERATION_INTERVAL,
  OBSTACLE_GENERATION_DECREASE_RATE,
} from "./constants";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { audioManager } from "./audio-manager";
import { useMediaQuery } from "@/hooks/use-media-query";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>("init");
  const [characterState, setCharacterState] = useState<CharacterState>("idle");
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [showCountdown, setShowCountdown] = useState(false);
  const [obstacleGenerationInterval, setObstacleGenerationInterval] = useState(
    INITIAL_OBSTACLE_GENERATION_INTERVAL,
  );
  const [debugMode] = useState(false);
  const [characterHitBox, setCharacterHitBox] = useState<HitBox>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [obstacleHitBoxes, setObstacleHitBoxes] = useState<HitBox[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [audioState, setAudioState] = useState<AudioState>({
    musicOn: true,
    soundOn: true,
    musicVolume: 50,
    soundVolume: 50,
  });
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );

  const gameLoopRef = useRef<number | null>(null);
  const jumpTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const obstacleTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isJumpingRef = useRef(false);
  const slideQueuedRef = useRef(false);
  const blockSpeedRef = useRef(INITIAL_BLOCK_SPEED);
  const lastObstacleTimeRef = useRef(0);
  const gameStartTimeRef = useRef(0);
  const lastUpdateTimeRef = useRef(0);
  const isGroundedRef = useRef(true);
  const pauseStartTimeRef = useRef<number | null>(null);
  const totalPausedTimeRef = useRef(0);
  const characterRef = useRef<HTMLDivElement>(null);
  const obstacleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const audioRef = useRef<{
    jump: HTMLAudioElement | null;
    endGame: HTMLAudioElement | null;
    background: HTMLAudioElement | null;
  }>({
    jump: null,
    endGame: null,
    background: null,
  });

  const isDesktop = useMediaQuery(`(min-width: ${DESKTOP_BREAKPOINT}px)`);

  const toggleMusic = useCallback(() => {
    setAudioState((prev) => ({ ...prev, musicOn: !prev.musicOn }));
  }, []);

  const toggleSound = useCallback(() => {
    setAudioState((prev) => ({ ...prev, soundOn: !prev.soundOn }));
  }, []);

  const updateMusicVolume = useCallback((volume: number) => {
    setAudioState((prev) => ({ ...prev, musicVolume: volume }));
  }, []);

  const updateSoundVolume = useCallback((volume: number) => {
    setAudioState((prev) => ({ ...prev, soundVolume: volume }));
  }, []);

  const addObstacle = useCallback(() => {
    const newObstacle = {
      id: Math.random().toString(36).substr(2, 9),
      isLow: Math.random() < 0.67,
      position: -10,
    };
    setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);
  }, []);

  const updateObstacles = useCallback(
    (deltaTime: number) => {
      if (gameState === "playing") {
        setObstacles((prevObstacles) => {
          const updatedObstacles = prevObstacles
            .map((obs) => ({
              ...obs,
              position: obs.position + (0.5 * deltaTime) / 16.67,
            }))
            .filter((obs) => obs.position < 110);
          return updatedObstacles;
        });
      }
    },
    [gameState],
  );

  const updateObstacleGeneration = useCallback(
    (currentTime: number) => {
      if (
        currentTime - lastObstacleTimeRef.current >
        obstacleGenerationInterval
      ) {
        addObstacle();
        lastObstacleTimeRef.current = currentTime;
        setObstacleGenerationInterval((prevInterval) =>
          Math.max(
            prevInterval * OBSTACLE_GENERATION_DECREASE_RATE,
            MIN_OBSTACLE_GENERATION_INTERVAL,
          ),
        );
      }
    },
    [obstacleGenerationInterval, addObstacle],
  );

  const getJumpTime = useCallback(() => {
    return JUMP_DURATION / 1000;
  }, []);

  const jump = useCallback(() => {
    if (gameState !== "playing" || isSettingsOpen) return;

    if (isGroundedRef.current) {
      isGroundedRef.current = false;
      isJumpingRef.current = true;
      setCharacterState("jumping");
      if (audioState.soundOn) {
        audioManager.playJump(audioRef);
      }

      const jumpTime = getJumpTime();

      jumpTimeoutRef.current = setTimeout(() => {
        setCharacterState("running");
        isJumpingRef.current = false;

        setTimeout(() => {
          isGroundedRef.current = true;
        }, JUMP_COOLDOWN);
      }, jumpTime * 1000);
    }
  }, [
    gameState,
    setCharacterState,
    isSettingsOpen,
    audioState.soundOn,
    getJumpTime,
  ]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (gameState !== "playing") return;

      switch (event.key.toLowerCase()) {
        case "w":
        case "arrowup":
        case " ":
          if (!event.repeat) {
            jump();
          }
          break;
      }
    },
    [gameState, jump],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (gameState !== "playing") return;

      switch (event.key.toLowerCase()) {
        case "w":
        case "arrowup":
        case " ":
          isGroundedRef.current = true;
          break;
      }
    },
    [gameState],
  );

  const checkCollision = useCallback(() => {
    if (!characterRef.current) return false;

    const characterRect = characterRef.current.getBoundingClientRect();
    const characterCenter = {
      x: characterRect.left + characterRect.width / 2,
      y: characterRect.top + characterRect.height / 2,
    };

    const characterHitboxHeight = characterRect.height * 0.5;
    const characterHitboxWidth = isDesktop
      ? characterRect.width * 0.5
      : characterRect.width * 0.25;

    for (let i = 0; i < obstacles.length; i++) {
      const obstacleRef = obstacleRefs.current[i];
      if (!obstacleRef) continue;

      const obstacleRect = obstacleRef.getBoundingClientRect();
      const obstacleCenter = {
        x: obstacleRect.left + obstacleRect.width / 2,
        y: obstacleRect.top + obstacleRect.height / 2,
      };

      const dx = characterCenter.x - obstacleCenter.x;
      const dy = characterCenter.y - obstacleCenter.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const minDistance = (characterHitboxWidth + obstacleRect.width) / 2;

      if (distance < minDistance) {
        const characterTop =
          characterRect.top +
          (characterRect.height - characterHitboxHeight) / 2;
        if (
          characterTop < obstacleRect.bottom &&
          characterTop + characterHitboxHeight > obstacleRect.top
        ) {
          return true;
        }
      }
    }

    return false;
  }, [obstacles, isDesktop]);

  const endGame = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current);
    obstacleTimeoutsRef.current.forEach(clearTimeout);
    obstacleTimeoutsRef.current = [];
    setObstacleGenerationInterval(INITIAL_OBSTACLE_GENERATION_INTERVAL);
    lastObstacleTimeRef.current = 0;
    gameStartTimeRef.current = 0;
    lastUpdateTimeRef.current = 0;
    totalPausedTimeRef.current = 0;

    audioManager.stopBackground(audioRef);

    setGameState("gameOver");
    setCharacterState("idle");
  }, [setGameState, setCharacterState, setObstacleGenerationInterval]);

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return;

    const currentTime = performance.now();
    const deltaTime = currentTime - lastUpdateTimeRef.current;
    lastUpdateTimeRef.current = currentTime;

    const elapsedTime =
      currentTime - gameStartTimeRef.current - totalPausedTimeRef.current;

    if (elapsedTime % 100 < deltaTime) {
      setScore((prevScore) => prevScore + 1);
    }

    updateObstacles(deltaTime);
    updateObstacleGeneration(elapsedTime);

    if (checkCollision()) {
      if (audioState.soundOn) {
        audioManager.playEndGame(audioRef);
      }
      endGame();
      return;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [
    gameState,
    setScore,
    updateObstacles,
    updateObstacleGeneration,
    checkCollision,
    audioState.soundOn,
    endGame,
  ]);

  const pauseGame = useCallback(() => {
    if (gameState === "playing") {
      setGameState("paused");
      setCharacterState("idle");
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      pauseStartTimeRef.current = performance.now();
      audioManager.pauseBackground(audioRef);
    }
  }, [gameState, setGameState, setCharacterState]);

  const resumeGame = useCallback(() => {
    if (gameState === "paused") {
      setGameState("playing");
      setCharacterState("running");
      setIsSettingsOpen(false);
      if (audioState.musicOn) {
        audioManager.playBackground(audioRef);
      }
      if (pauseStartTimeRef.current !== null) {
        const pauseDuration = performance.now() - pauseStartTimeRef.current;
        totalPausedTimeRef.current += pauseDuration;
        lastUpdateTimeRef.current = performance.now();
        pauseStartTimeRef.current = null;
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [
    gameState,
    setGameState,
    setCharacterState,
    setIsSettingsOpen,
    audioState.musicOn,
    gameLoop,
  ]);

  const toggleSettings = useCallback(() => {
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
      if (gameState === "paused") {
        resumeGame();
      }
    } else {
      setIsSettingsOpen(true);
      if (gameState === "playing") {
        pauseGame();
      }
    }
  }, [gameState, pauseGame, resumeGame, isSettingsOpen]);

  const startGame = useCallback(() => {
    if (!selectedCharacter) return;

    setShowCountdown(true);
    setCountdown(COUNTDOWN_DURATION);
    setGameState("ready");

    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          setShowCountdown(false);
          setGameState("playing");
          setCharacterState("running");
          setScore(0);
          setObstacles([]);
          setObstacleGenerationInterval(INITIAL_OBSTACLE_GENERATION_INTERVAL);
          lastObstacleTimeRef.current = 0;
          gameStartTimeRef.current = performance.now();
          lastUpdateTimeRef.current = gameStartTimeRef.current;
          totalPausedTimeRef.current = 0;
          blockSpeedRef.current = INITIAL_BLOCK_SPEED;
          isJumpingRef.current = false;
          slideQueuedRef.current = false;
          isGroundedRef.current = true;

          if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
          if (audioState.musicOn) {
            audioManager.playBackground(audioRef);
          }
          gameLoopRef.current = requestAnimationFrame(gameLoop);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  }, [
    selectedCharacter,
    setShowCountdown,
    setCountdown,
    setGameState,
    setCharacterState,
    setScore,
    setObstacles,
    setObstacleGenerationInterval,
    audioState.musicOn,
    gameLoop,
  ]);

  const onChangeCharacter = useCallback((character: Character) => {
    setSelectedCharacter(character);
  }, []);

  useEffect(() => {
    audioManager.updateVolumes(audioState, audioRef);
  }, [audioState]);

  useEffect(() => {
    const updateHitBoxes = () => {
      const character = document.getElementById(characterState + "Character");
      if (character) {
        const characterRect = character.getBoundingClientRect();
        const characterImage = character.querySelector("img");
        if (characterImage) {
          const imageRect = characterImage.getBoundingClientRect();
          let hitboxWidth, hitboxHeight, hitboxLeft, hitboxTop;

          hitboxWidth = imageRect.width;
          hitboxHeight = imageRect.height;
          hitboxLeft = (imageRect.width - hitboxWidth) / 2;
          hitboxTop = (imageRect.height - hitboxHeight) / 2;

          setCharacterHitBox({
            x: hitboxLeft,
            y: hitboxTop,
            width: hitboxWidth,
            height: hitboxHeight,
          });
        }
      }

      const newObstacleHitBoxes = obstacles.map((obs) => {
        const obstacle = document.getElementById(
          `${obs.isLow ? "low" : "high"}Obstacle${obs.id}`,
        );
        if (obstacle) {
          const obstacleRect = obstacle.getBoundingClientRect();
          const obstacleImage = obstacle.querySelector("img");
          if (obstacleImage) {
            const imageRect = obstacleImage.getBoundingClientRect();
            const hitboxWidth = imageRect.width * 0.8;
            const hitboxHeight = imageRect.height * 0.8;
            return {
              x: (imageRect.width - hitboxWidth) / 2,
              y: (imageRect.height - hitboxHeight) / 2,
              width: hitboxWidth,
              height: hitboxHeight,
            };
          }
        }
        return { x: 0, y: 0, width: 0, height: 0 };
      });
      setObstacleHitBoxes(newObstacleHitBoxes);
    };

    updateHitBoxes();
    window.addEventListener("resize", updateHitBoxes);
    return () => window.removeEventListener("resize", updateHitBoxes);
  }, [characterState, obstacles, setCharacterHitBox, setObstacleHitBoxes]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const value: GameContextType = {
    gameState,
    setGameState,
    characterState,
    setCharacterState,
    obstacles,
    setObstacles,
    score,
    setScore,
    countdown,
    setCountdown,
    showCountdown,
    setShowCountdown,
    obstacleGenerationInterval,
    setObstacleGenerationInterval,
    debugMode,
    characterHitBox,
    setCharacterHitBox,
    obstacleHitBoxes,
    setObstacleHitBoxes,
    isSettingsOpen,
    setIsSettingsOpen,
    toggleMusic,
    toggleSettings,
    toggleSound,
    updateMusicVolume,
    updateSoundVolume,
    audioState,
    setAudioState,
    selectedCharacter,
    setSelectedCharacter,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    addObstacle,
    updateObstacles,
    updateObstacleGeneration,
    jump,
    handleKeyDown,
    handleKeyUp,
    checkCollision,
    gameLoop,
    getJumpTime,
    isDesktop,
    gameLoopRef,
    jumpTimeoutRef,
    obstacleTimeoutsRef,
    isJumpingRef,
    slideQueuedRef,
    blockSpeedRef,
    lastObstacleTimeRef,
    gameStartTimeRef,
    lastUpdateTimeRef,
    isGroundedRef,
    pauseStartTimeRef,
    totalPausedTimeRef,
    characterRef,
    obstacleRefs,
    audioRef,
    onChangeCharacter,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
