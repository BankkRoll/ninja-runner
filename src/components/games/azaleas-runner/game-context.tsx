import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { createClient } from "@/utils/supabase/component";
import { useMediaQuery } from "@/hooks/use-media-query";

export type RiderState =
  | "running"
  | "jumping"
  | "sliding"
  | "standing"
  | "falling";
type Obstacle = { id: string; isLow: boolean; position: number };
type HighScore = { username: string; score: number; created_at: string };
export type GameState = "init" | "ready" | "playing" | "paused" | "gameOver";
type HitBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  top?: number;
};

type AudioState = {
  musicOn: boolean;
  soundOn: boolean;
  musicVolume: number;
  soundVolume: number;
};

type GameContextType = {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  riderState: RiderState;
  setRiderState: React.Dispatch<React.SetStateAction<RiderState>>;
  obstacles: Obstacle[];
  setObstacles: React.Dispatch<React.SetStateAction<Obstacle[]>>;
  highScore: number;
  setHighScore: React.Dispatch<React.SetStateAction<number>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  gameTime: number;
  setGameTime: React.Dispatch<React.SetStateAction<number>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  isUsernameValid: boolean;
  setIsUsernameValid: React.Dispatch<React.SetStateAction<boolean>>;
  countdown: number;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  showCountdown: boolean;
  setShowCountdown: React.Dispatch<React.SetStateAction<boolean>>;
  obstacleGenerationInterval: number;
  setObstacleGenerationInterval: React.Dispatch<React.SetStateAction<number>>;
  debugMode: boolean;
  riderHitBox: HitBox;
  setRiderHitBox: React.Dispatch<React.SetStateAction<HitBox>>;
  obstacleHitBoxes: HitBox[];
  setObstacleHitBoxes: React.Dispatch<React.SetStateAction<HitBox[]>>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isScoreSubmitted: boolean;
  setIsScoreSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  fetchScores: () => Promise<void>;
  checkUsername: (username: string) => Promise<void>;
  submitScore: () => Promise<void>;
  toggleMusic: () => void;
  toggleSettings: () => void;
  toggleSound: () => void;
  updateMusicVolume: (volume: number) => void;
  updateSoundVolume: (volume: number) => void;
  audioState: AudioState;
  setAudioState: React.Dispatch<React.SetStateAction<AudioState>>;
  top10Daily: HighScore[];
  setTop10Daily: React.Dispatch<React.SetStateAction<HighScore[]>>;
  top10AllTime: HighScore[];
  setTop10AllTime: React.Dispatch<React.SetStateAction<HighScore[]>>;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  addObstacle: () => void;
  updateObstacles: (deltaTime: number) => void;
  updateObstacleGeneration: (currentTime: number) => void;
  jump: () => void;
  slide: () => void;
  unslide: () => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleKeyUp: (event: KeyboardEvent) => void;
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
  riderRef: React.RefObject<HTMLDivElement>;
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
  const [riderState, setRiderState] = useState<RiderState>("standing");
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [highScore, setHighScore] = useState(0);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [top10AllTime, setTop10AllTime] = useState<HighScore[]>([]);
  const [top10Daily, setTop10Daily] = useState<HighScore[]>([]);
  const [username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const [obstacleGenerationInterval, setObstacleGenerationInterval] =
    useState(1600);
  const [debugMode] = useState(false);
  const [riderHitBox, setRiderHitBox] = useState<HitBox>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [obstacleHitBoxes, setObstacleHitBoxes] = useState<HitBox[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScoreSubmitted, setIsScoreSubmitted] = useState(false);
  const [audioState, setAudioState] = useState<AudioState>({
    musicOn: true,
    soundOn: true,
    musicVolume: 50,
    soundVolume: 50,
  });

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
  const riderRef = useRef<HTMLDivElement>(null);
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

  const supabase = createClient();

  const fetchScores = useCallback(async () => {
    try {
      const { data: allTimeData, error: allTimeError } = await supabase
        .from("azalea_runner_scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(10);

      const { data: dailyData, error: dailyError } = await supabase
        .from("azalea_runner_scores")
        .select("*")
        .gte(
          "created_at",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        )
        .order("score", { ascending: false })
        .limit(10);

      if (allTimeError) throw allTimeError;
      if (dailyError) throw dailyError;

      setTop10AllTime(allTimeData || []);
      setTop10Daily(dailyData || []);

      if (allTimeData && allTimeData.length > 0) {
        setHighScore(allTimeData[0].score);
      }
    } catch (error) {
      console.error("Error fetching scores:", error);
    }
  }, [supabase]);

  const checkUsername = useCallback(
    async (username: string) => {
      if (username.length < 3) {
        setIsUsernameValid(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("azalea_runner_scores")
          .select("username")
          .eq("username", username);

        if (error) {
          console.error("Error checking username:", error);
          setIsUsernameValid(false);
        } else {
          // If data is null or empty array, the username is available
          setIsUsernameValid(data === null || data.length === 0);
        }
      } catch (error) {
        console.error("Error checking username:", error);
        setIsUsernameValid(false);
      }
    },
    [supabase],
  );

  const submitScore = useCallback(async () => {
    if (score > 0 && !isScoreSubmitted) {
      try {
        const { error } = await supabase
          .from("azalea_runner_scores")
          .insert({ username, score });

        if (error) throw error;

        setIsScoreSubmitted(true);
        await fetchScores();
      } catch (error) {
        console.error("Error submitting score:", error);
        throw error; // Rethrow the error so it can be handled in the UI
      }
    }
  }, [score, username, isScoreSubmitted, supabase, fetchScores]);

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
    return isDesktop ? baseTime : baseTime * 1.2;
  }, [isDesktop]);

  const jump = useCallback(() => {
    if (gameState !== "playing" || !isGroundedRef.current || isSettingsOpen)
      return;

    isGroundedRef.current = false;
    isJumpingRef.current = true;
    setRiderState("jumping");
    if (audioState.soundOn && audioRef.current.jump) {
      audioRef.current.jump
        .play()
        .catch((error) => console.error("Error playing audio:", error));
    }

    const jumpTime = getJumpTime();

    jumpTimeoutRef.current = setTimeout(() => {
      setRiderState("falling");

      setTimeout(() => {
        setRiderState("running");
        isJumpingRef.current = false;
        isGroundedRef.current = true;
      }, jumpTime * 150);
    }, jumpTime * 275);
  }, [
    gameState,
    setRiderState,
    isSettingsOpen,
    audioState.soundOn,
    getJumpTime,
  ]);

  const slide = useCallback(() => {
    if (
      gameState !== "playing" ||
      isJumpingRef.current ||
      !isGroundedRef.current
    )
      return;
    setRiderState("sliding");
  }, [gameState, setRiderState]);

  const unslide = useCallback(() => {
    if (gameState !== "playing") return;
    setRiderState(
      isJumpingRef.current
        ? "jumping"
        : isGroundedRef.current
          ? "running"
          : "falling",
    );
  }, [gameState, setRiderState]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (gameState !== "playing") return;

      switch (event.key.toLowerCase()) {
        case "w":
        case "arrowup":
          jump();
          break;
        case "s":
        case "arrowdown":
          slide();
          break;
      }
    },
    [gameState, jump, slide],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (gameState !== "playing") return;

      if (
        event.key.toLowerCase() === "s" ||
        event.key.toLowerCase() === "arrowdown"
      ) {
        unslide();
      }
    },
    [gameState, unslide],
  );

  const checkCollision = useCallback(() => {
    if (!riderRef.current) return false;

    const riderRect = riderRef.current.getBoundingClientRect();
    const riderCenter = {
      x: riderRect.left + riderRect.width / 2,
      y: riderRect.top + riderRect.height / 2,
    };

    // Adjust the rider's hitbox to be taller
    const riderHitboxHeight = riderRect.height;
    const riderHitboxWidth = isDesktop ? riderRect.width : riderRect.width / 2;

    for (let i = 0; i < obstacles.length; i++) {
      const obstacleRef = obstacleRefs.current[i];
      if (!obstacleRef) continue;

      const obstacleRect = obstacleRef.getBoundingClientRect();
      const obstacleCenter = {
        x: obstacleRect.left + obstacleRect.width / 2,
        y: obstacleRect.top + obstacleRect.height / 2,
      };

      // Calculate the distance between centers
      const dx = riderCenter.x - obstacleCenter.x;
      const dy = riderCenter.y - obstacleCenter.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Calculate the minimum distance required for collision
      const minDistance = (riderHitboxWidth + obstacleRect.width) / 1.5;

      // Check for collision
      if (distance < minDistance) {
        // For sliding state, adjust the vertical collision check
        if (riderState === "sliding") {
          const slidingHitboxHeight = riderHitboxHeight * 0.5; // Reduce height when sliding
          const adjustedRiderTop =
            riderRect.top + (riderRect.height - slidingHitboxHeight);
          if (
            adjustedRiderTop < obstacleRect.bottom &&
            adjustedRiderTop + slidingHitboxHeight > obstacleRect.top
          ) {
            return true;
          }
        } else {
          // For other states, use the full hitbox height
          const riderTop =
            riderRect.top - (riderHitboxHeight - riderRect.height) / 2;
          if (
            riderTop < obstacleRect.bottom &&
            riderTop + riderHitboxHeight > obstacleRect.top
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }, [obstacles, riderState]);

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
    setRiderState("standing");
  }, [setGameState, setRiderState, setObstacleGenerationInterval]);

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return;

    const currentTime = performance.now();
    const deltaTime = currentTime - lastUpdateTimeRef.current;
    lastUpdateTimeRef.current = currentTime;

    // Update game time
    const elapsedTime =
      currentTime - gameStartTimeRef.current - totalPausedTimeRef.current;
    setGameTime(Math.floor(elapsedTime / 1000));

    // Update score every 100ms
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
    setGameTime,
  ]);

  const pauseGame = useCallback(() => {
    if (gameState === "playing") {
      setGameState("paused");
      setRiderState("standing");
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      pauseStartTimeRef.current = performance.now();
      if (audioRef.current.background) {
        audioRef.current.background.pause();
      }
    }
  }, [gameState, setGameState, setRiderState]);

  const resumeGame = useCallback(() => {
    if (gameState === "paused") {
      setGameState("playing");
      setRiderState("running");
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
    setRiderState,
    setIsSettingsOpen,
    audioState.musicOn,
    gameLoop,
  ]);

  const toggleSettings = useCallback(() => {
    if (isSettingsOpen) {
      // If settings are open, close them and resume the game
      setIsSettingsOpen(false);
      if (gameState === "paused") {
        resumeGame();
      }
    } else {
      // If settings are closed, open them and pause the game
      setIsSettingsOpen(true);
      if (gameState === "playing") {
        pauseGame();
      }
    }
  }, [gameState, pauseGame, resumeGame, isSettingsOpen]);

  const startGame = useCallback(() => {
    if (!isUsernameValid) return;

    setShowCountdown(true);
    setCountdown(3);
    setGameState("ready");

    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          setShowCountdown(false);
          setGameState("playing");
          setRiderState("running");
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
          setIsScoreSubmitted(false);

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
    isUsernameValid,
    setShowCountdown,
    setCountdown,
    setGameState,
    setRiderState,
    setScore,
    setObstacles,
    setObstacleGenerationInterval,
    audioState.musicOn,
    setIsScoreSubmitted,
    gameLoop,
  ]);

  useEffect(() => {
    const setupAudio = () => {
      audioRef.current.jump = new Audio(
        "/arcade/azaleas-runner/sounds/jump_sound.mp3",
      );
      audioRef.current.endGame = new Audio(
        "/arcade/azaleas-runner/sounds/end_game_sound.mp3",
      );
      audioRef.current.background = new Audio(
        "/arcade/azaleas-runner/sounds/music_zapsplat_easy_cheesy.mp3",
      );

      if (audioRef.current.background) {
        audioRef.current.background.loop = true;
      }
    };

    setupAudio();
    fetchScores();

    return () => {
      Object.values(audioRef.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
      setShowCountdown(false);
    };
  }, [fetchScores, setShowCountdown]);

  // Update the useEffect for hitbox calculations
  useEffect(() => {
    const updateHitBoxes = () => {
      const rider = document.getElementById(riderState + "Rider");
      if (rider) {
        const riderRect = rider.getBoundingClientRect();
        const riderImage = rider.querySelector("img");
        if (riderImage) {
          const imageRect = riderImage.getBoundingClientRect();
          let hitboxWidth, hitboxHeight, hitboxLeft, hitboxTop;

          if (riderState === "sliding") {
            hitboxWidth = imageRect.width * 0.8;
            hitboxHeight = imageRect.height * 0.5;
            hitboxLeft = (imageRect.width - hitboxWidth) / 2;
            hitboxTop = imageRect.height - hitboxHeight;
          } else {
            hitboxWidth = imageRect.width * 0.5;
            hitboxHeight = imageRect.height * 0.8;
            hitboxLeft = (imageRect.width - hitboxWidth) / 2;
            hitboxTop = (imageRect.height - hitboxHeight) / 2;
          }

          setRiderHitBox({
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
  }, [riderState, obstacles, setRiderHitBox, setObstacleHitBoxes]);

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
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const value = {
    gameState,
    setGameState,
    riderState,
    setRiderState,
    obstacles,
    setObstacles,
    highScore,
    setHighScore,
    score,
    setScore,
    gameTime,
    setGameTime,
    username,
    setUsername,
    isUsernameValid,
    setIsUsernameValid,
    countdown,
    setCountdown,
    showCountdown,
    setShowCountdown,
    obstacleGenerationInterval,
    setObstacleGenerationInterval,
    debugMode,
    riderHitBox,
    setRiderHitBox,
    obstacleHitBoxes,
    setObstacleHitBoxes,
    isSettingsOpen,
    setIsSettingsOpen,
    isScoreSubmitted,
    setIsScoreSubmitted,
    fetchScores,
    checkUsername,
    submitScore,
    toggleMusic,
    toggleSettings,
    toggleSound,
    updateMusicVolume,
    updateSoundVolume,
    audioState,
    setAudioState,
    top10Daily,
    setTop10Daily,
    top10AllTime,
    setTop10AllTime,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    addObstacle,
    updateObstacles,
    updateObstacleGeneration,
    jump,
    slide,
    unslide,
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
    riderRef,
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
