import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowRight, Gamepad2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { motion } from "framer-motion";

type InitScreenProps = {
  username: string;
  setUsername: (username: string) => void;
  isUsernameValid: boolean;
  checkUsername: (username: string) => void;
  startGame: () => void;
};

export const InitScreen: React.FC<InitScreenProps> = ({
  username,
  setUsername,
  isUsernameValid,
  checkUsername,
  startGame,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <Card className="flex flex-col items-center justify-center w-full h-full bg-card/90">
        <CardHeader>
          <CardTitle className="text-xl md:text-3xl font-bold text-center flex items-center justify-center gap-2">
            <img
              src="/arcade/azaleas-runner/images/azalea.png"
              alt="Azaleas Runner Icon"
              className="w-8 h-8"
            />
            Azaleas Runner
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                checkUsername(e.target.value);
              }}
              placeholder="Enter your username"
              className="w-full"
            />
            {!isUsernameValid && username.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="pt-1">
                  Username is taken or invalid
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="space-y-2">
            <Label>Controls</Label>
            <div className="hidden md:grid grid-cols-2 gap-2">
              <div className="flex items-center justify-center p-2 bg-muted rounded-md">
                <kbd className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-background border border-input rounded-md">
                  W
                </kbd>
                <span className="ml-2 text-sm">Jump</span>
              </div>
              <div className="flex items-center justify-center p-2 bg-muted rounded-md">
                <kbd className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-background border border-input rounded-md">
                  S
                </kbd>
                <span className="ml-2 text-sm">Slide</span>
              </div>
            </div>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Tip</AlertTitle>
            <AlertDescription className="md:hidden">
              Use on-screen buttons to jump and slide on mobile devices.
            </AlertDescription>
            <AlertDescription className="hidden md:block">
              Use W to jump and S to slide.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="w-full max-w-sm">
          <Button
            onClick={startGame}
            disabled={!isUsernameValid}
            className="w-full py-6 text-lg font-bold"
          >
            Start Game
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
