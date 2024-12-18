import { AudioState } from "./types";
import { SOUNDS } from "./constants";

class AudioManager {
  private createAudio(src: string): HTMLAudioElement | null {
    if (typeof window !== "undefined" && window.Audio) {
      return new Audio(src);
    }
    return null;
  }

  playJump(
    audioRef: React.MutableRefObject<{ jump: HTMLAudioElement | null }>,
  ) {
    if (!audioRef.current.jump) {
      audioRef.current.jump = this.createAudio(SOUNDS.JUMP);
    }
    audioRef.current.jump
      ?.play()
      .catch((error) => console.error("Error playing jump sound:", error));
  }

  playEndGame(
    audioRef: React.MutableRefObject<{ endGame: HTMLAudioElement | null }>,
  ) {
    if (!audioRef.current.endGame) {
      audioRef.current.endGame = this.createAudio(SOUNDS.END_GAME);
    }
    audioRef.current.endGame
      ?.play()
      .catch((error) => console.error("Error playing end game sound:", error));
  }

  playBackground(
    audioRef: React.MutableRefObject<{ background: HTMLAudioElement | null }>,
  ) {
    if (!audioRef.current.background) {
      audioRef.current.background = this.createAudio(SOUNDS.BACKGROUND);
      if (audioRef.current.background) {
        audioRef.current.background.loop = true;
      }
    }
    audioRef.current.background
      ?.play()
      .catch((error) =>
        console.error("Error playing background music:", error),
      );
  }

  pauseBackground(
    audioRef: React.MutableRefObject<{ background: HTMLAudioElement | null }>,
  ) {
    audioRef.current.background?.pause();
  }

  stopBackground(
    audioRef: React.MutableRefObject<{ background: HTMLAudioElement | null }>,
  ) {
    if (audioRef.current.background) {
      audioRef.current.background.pause();
      audioRef.current.background.currentTime = 0;
    }
  }

  updateVolumes(
    audioState: AudioState,
    audioRef: React.MutableRefObject<{
      jump: HTMLAudioElement | null;
      endGame: HTMLAudioElement | null;
      background: HTMLAudioElement | null;
    }>,
  ) {
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
  }
}

export const audioManager = new AudioManager();
