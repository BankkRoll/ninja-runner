import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

export type CharacterState = "idle" | "running" | "jumping";
type Obstacle = { id: string; isLow: boolean; position: number };
export type GameState = "init" | "ready" | "playing" | "paused" | "gameOver";
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

type GameContextType = {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  characterState: CharacterState;
  setCharacterState: React.Dispatch<React.SetStateAction<CharacterState>>;
  obstacles: Obstacle[];
  setObstacles: React.Dispatch<React.SetStateAction<Obstacle[]>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  countdown: number;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  showCountdown: boolean;
  setShowCountdown: React.Dispatch<React.SetStateAction<boolean>>;
  obstacleGenerationInterval: number;
  setObstacleGenerationInterval: React.Dispatch<React.SetStateAction<number>>;
  debugMode: boolean;
  characterHitBox: HitBox;
  setCharacterHitBox: React.Dispatch<React.SetStateAction<HitBox>>;
  obstacleHitBoxes: HitBox[];
  setObstacleHitBoxes: React.Dispatch<React.SetStateAction<HitBox[]>>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMusic: () => void;
  toggleSettings: () => void;
  toggleSound: () => void;
  updateMusicVolume: (volume: number) => void;
  updateSoundVolume: (volume: number) => void;
  audioState: AudioState;
  setAudioState: React.Dispatch<React.SetStateAction<AudioState>>;
  selectedCharacter: Character | null;
  setSelectedCharacter: React.Dispatch<React.SetStateAction<Character | null>>;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  addObstacle: () => void;
  updateObstacles: (deltaTime: number) => void;
  updateObstacleGeneration: (currentTime: number) => void;
  jump: () => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  checkCollision: () => boolean;
  gameLoop: () => void;
  getJumpTime: () => number;
  isDesktop: boolean;
  gameLoopRef: React.MutableRefObject<number | null>;
  jumpTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  obstacleTimeoutsRef: React.MutableRefObject<NodeJS.Timeout[]>;
  isJumpingRef: React.MutableRefObject<boolean>;
  slideQueuedRef: React.MutableRefObject<boolean>;
  blockSpeedRef: React.MutableRefObject<number>;
  lastObstacleTimeRef: React.MutableRefObject<number>;
  gameStartTimeRef: React.MutableRefObject<number>;
  lastUpdateTimeRef: React.MutableRefObject<number>;
  isGroundedRef: React.MutableRefObject<boolean>;
  pauseStartTimeRef: React.MutableRefObject<number | null>;
  totalPausedTimeRef: React.MutableRefObject<number>;
  characterRef: React.RefObject<HTMLDivElement>;
  obstacleRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  audioRef: React.MutableRefObject<{
    jump: HTMLAudioElement | null;
    endGame: HTMLAudioElement | null;
    background: HTMLAudioElement | null;
  }>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>("init");
  const [characterState, setCharacterState] = useState<CharacterState>("idle");
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const [obstacleGenerationInterval, setObstacleGenerationInterval] =
    useState(2000);
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
  const blockSpeedRef = useRef(2500);
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

  const isDesktop = useMediaQuery("(min-width: 768px)");

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
          Math.max(prevInterval * 0.995, 600),
        );
      }
    },
    [obstacleGenerationInterval, addObstacle],
  );

  const getJumpTime = useCallback(() => {
    const baseTime = Math.max(Math.min(blockSpeedRef.current / 3000, 0.8), 1);
    return isDesktop ? baseTime : baseTime;
  }, [isDesktop]);

  const jump = useCallback(() => {
    if (gameState !== "playing" || !isGroundedRef.current || isSettingsOpen)
      return;

    isGroundedRef.current = false;
    isJumpingRef.current = true;
    setCharacterState("jumping");
    if (audioState.soundOn && audioRef.current.jump) {
      audioRef.current.jump
        .play()
        .catch((error) => console.error("Error playing audio:", error));
    }

    const jumpTime = getJumpTime();

    jumpTimeoutRef.current = setTimeout(() => {
      setCharacterState("running");
      isJumpingRef.current = false;
      isGroundedRef.current = true;
    }, jumpTime * 1000);
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
          jump();
          break;
      }
    },
    [gameState, jump],
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
  }, [obstacles, characterState, isDesktop]);

  const endGame = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current);
    obstacleTimeoutsRef.current.forEach(clearTimeout);
    obstacleTimeoutsRef.current = [];
    setObstacleGenerationInterval(2000);
    lastObstacleTimeRef.current = 0;
    gameStartTimeRef.current = 0;
    lastUpdateTimeRef.current = 0;
    totalPausedTimeRef.current = 0;

    if (audioRef.current.background) {
      audioRef.current.background.pause();
      audioRef.current.background.currentTime = 0;
    }

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
      if (audioState.soundOn && audioRef.current.endGame) {
        audioRef.current.endGame
          .play()
          .catch((error) => console.error("Error playing audio:", error));
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
      if (audioRef.current.background) {
        audioRef.current.background.pause();
      }
    }
  }, [gameState, setGameState, setCharacterState]);

  const resumeGame = useCallback(() => {
    if (gameState === "paused") {
      setGameState("playing");
      setCharacterState("running");
      setIsSettingsOpen(false);
      if (audioRef.current.background && audioState.musicOn) {
        audioRef.current.background
          .play()
          .catch((error) => console.error("Error playing audio:", error));
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
    setCountdown(3);
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
          setObstacleGenerationInterval(2000);
          lastObstacleTimeRef.current = 0;
          gameStartTimeRef.current = performance.now();
          lastUpdateTimeRef.current = gameStartTimeRef.current;
          totalPausedTimeRef.current = 0;
          blockSpeedRef.current = 2500;
          isJumpingRef.current = false;
          slideQueuedRef.current = false;
          isGroundedRef.current = true;

          if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
          if (audioRef.current.background && audioState.musicOn) {
            audioRef.current.background
              .play()
              .catch((error) => console.error("Error playing audio:", error));
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

  useEffect(() => {
    const setupAudio = () => {
      audioRef.current.jump = new Audio(
        "/games/ninja-runner/sounds/jump_sound.mp3",
      );
      audioRef.current.endGame = new Audio(
        "/games/ninja-runner/sounds/end_game_sound.mp3",
      );
      audioRef.current.background = new Audio(
        "/games/ninja-runner/sounds/background_music.mp3",
      );

      if (audioRef.current.background) {
        audioRef.current.background.loop = true;
      }
    };

    setupAudio();

    return () => {
      Object.values(audioRef.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
      setShowCountdown(false);
    };
  }, [setShowCountdown]);

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
    const { musicOn, soundOn, musicVolume, soundVolume } = audioState;

    if (audioRef.current.background) {
      audioRef.current.background.volume = musicVolume / 100;
      audioRef.current.background.muted = !musicOn;
    }

    if (audioRef.current.jump) {
      audioRef.current.jump.volume = soundVolume / 100;
      audioRef.current.jump.muted = !soundOn;
    }

    if (audioRef.current.endGame) {
      audioRef.current.endGame.volume = soundVolume / 100;
      audioRef.current.endGame.muted = !soundOn;
    }
  }, [audioState]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const value = {
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
