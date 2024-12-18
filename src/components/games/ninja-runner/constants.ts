import { Character } from "./types";

export const GAME_TITLE = "Ninja Runner";

export const CHARACTERS: Character[] = ["ninja", "frog", "pink"];

export const INITIAL_OBSTACLE_GENERATION_INTERVAL = 2000;
export const MIN_OBSTACLE_GENERATION_INTERVAL = 200;
export const OBSTACLE_GENERATION_DECREASE_RATE = 0.98;

export const JUMP_DURATION = 300;
export const JUMP_COOLDOWN = 50;

export const INITIAL_BLOCK_SPEED = 2800;

export const COUNTDOWN_DURATION = 3;

export const DESKTOP_BREAKPOINT = 768;

export const IMAGES = {
  BACKGROUND: "/game/background.jpg",
  OBSTACLE: "/game/objects/saw.png",
  CHARACTER: {
    IDLE: (character: Character) => `/game/characters/${character}-idle.gif`,
    RUNNING: (character: Character) =>
      `/game/characters/${character}-running.gif`,
  },
};

export const SOUNDS = {
  JUMP: "/game/sounds/jump.mp3",
  END_GAME: "/game/sounds/end.mp3",
  BACKGROUND: "/game/sounds/background.mp3",
};
