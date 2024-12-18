import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import React from "react";
import { SettingsMenuProps } from "./types";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
      >
        <Card className="w-full max-w-md bg-card/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
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
                  className={`w-5 h-5 ${
                    audioState.musicOn
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
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
            </div>
            <div className="space-y-4">
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
                  className={`w-5 h-5 ${
                    audioState.soundOn
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
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
            </div>
            <Button
              onClick={onClose}
              className="w-full py-4 text-lg font-bold mt-4"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  },
);
