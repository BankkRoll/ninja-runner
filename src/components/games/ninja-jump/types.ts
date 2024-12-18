import React from "react";

export interface AudioState {
  musicOn: boolean;
  soundOn: boolean;
  musicVolume: number;
  soundVolume: number;
}

export type CharacterState = "idle" | "running" | "jumping";

export type GameState = "init" | "ready" | "playing" | "paused" | "gameOver";

export type Character = "ninja" | "frog" | "pink";

export interface Obstacle {
  id: string;
  isLow: boolean;
  position: number;
}

export interface HitBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CountdownOverlayProps {
  countdown: number;
}

export interface GameOverScreenProps {
  score: number;
  onPlayAgain: () => void;
  onChangeCharacter: (character: Character) => void;
  currentCharacter: Character;
}

export interface CharacterSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter: (character: Character) => void;
  currentCharacter: Character;
}

export interface InitScreenProps {
  selectedCharacter: Character | null;
  setSelectedCharacter: React.Dispatch<React.SetStateAction<Character | null>>;
  startGame: () => void;
}

export interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  audioState: AudioState;
  toggleMusic: () => void;
  toggleSound: () => void;
  updateMusicVolume: (volume: number) => void;
  updateSoundVolume: (volume: number) => void;
}

export interface GameScreenProps {
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
  onChangeCharacter: (character: Character) => void;
}

export interface GameContextType {
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
  characterRef: React.RefObject<HTMLDivElement>;
  obstacleRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  audioRef: React.MutableRefObject<{
    jump: HTMLAudioElement | null;
    endGame: HTMLAudioElement | null;
    background: HTMLAudioElement | null;
  }>;
  onChangeCharacter: (character: Character) => void;
}
