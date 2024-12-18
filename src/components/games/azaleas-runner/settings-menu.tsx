import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import React from "react";
import { Slider } from "@/components/ui/slider";

type AudioState = {
  musicOn: boolean;
  soundOn: boolean;
  musicVolume: number;
  soundVolume: number;
};

type SettingsMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  audioState: AudioState;
  toggleMusic: () => void;
  toggleSound: () => void;
  updateMusicVolume: (volume: number) => void;
  updateSoundVolume: (volume: number) => void;
};

export const SettingsMenu: React.FC<SettingsMenuProps> = React.memo(
  ({
    isOpen,
    onClose,
    audioState,
    toggleMusic,
    toggleSound,
    updateMusicVolume,
    updateSoundVolume,
  }) => {
    if (!isOpen) return null;

    return (
      <Card className="w-full max-sm:h-full max-w-md bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="music"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Music</span>
                <Button
                  size="icon"
                  variant={audioState.musicOn ? "default" : "outline"}
                  onClick={toggleMusic}
                  className="transition-colors duration-200"
                >
                  {audioState.musicOn ? (
                    <Music className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Volume2
                  className={`w-5 h-5 ${audioState.musicOn ? "text-primary" : "text-muted-foreground"}`}
                />
                <Slider
                  value={[audioState.musicOn ? audioState.musicVolume : 0]}
                  onValueChange={(value) => updateMusicVolume(value[0])}
                  max={100}
                  step={1}
                  disabled={!audioState.musicOn}
                  className={`flex-grow ${!audioState.musicOn && "opacity-50"}`}
                />
              </div>
            </motion.div>

            <motion.div
              key="sound"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Sound Effects</span>
                <Button
                  size="icon"
                  variant={audioState.soundOn ? "default" : "outline"}
                  onClick={toggleSound}
                  className="transition-colors duration-200"
                >
                  {audioState.soundOn ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Volume2
                  className={`w-5 h-5 ${audioState.soundOn ? "text-primary" : "text-muted-foreground"}`}
                />
                <Slider
                  value={[audioState.soundOn ? audioState.soundVolume : 0]}
                  onValueChange={(value) => updateSoundVolume(value[0])}
                  max={100}
                  step={1}
                  disabled={!audioState.soundOn}
                  className={`flex-grow ${!audioState.soundOn && "opacity-50"}`}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="pt-4"
          >
            <Button onClick={onClose} className="w-full py-2 text-lg font-bold">
              Close
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  },
);

SettingsMenu.displayName = "SettingsMenu";
