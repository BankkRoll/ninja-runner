"use client";

import * as React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme(); // Only keeping light/dark
  const [currentTheme, setCurrentTheme] = React.useState<string>(
    theme || "light",
  );

  const handleToggle = () => {
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    setCurrentTheme(nextTheme);
  };

  if (!currentTheme) {
    // Prevent mismatched initial render
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggle}
            className="relative flex items-center justify-center"
          >
            <AnimatePresence initial={false} mode="wait">
              {currentTheme === "light" && (
                <motion.div
                  key="light"
                  initial={{ opacity: 0, rotate: -90, scale: 0 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute"
                >
                  <SunIcon className="h-[1.2rem] w-[1.2rem]" />
                </motion.div>
              )}
              {currentTheme === "dark" && (
                <motion.div
                  key="dark"
                  initial={{ opacity: 0, rotate: -90, scale: 0 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute"
                >
                  <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={10}>
          {currentTheme === "light" && <p>Light Mode</p>}
          {currentTheme === "dark" && <p>Dark Mode</p>}
          <TooltipArrow className="fill-primary" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
