// src\pages\arcade\[game].tsx

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

import { games } from "@/components/games";
import { useRouter } from "next/router";

export default function GamePage() {
  const router = useRouter();
  const { game } = router.query;
  const [GameComponent, setGameComponent] =
    useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (game) {
      const gameData = games.find((g) => g.id === game);
      if (gameData) {
        setGameComponent(() => gameData.game);
      } else {
        console.error("Game not found");
        router.push("/arcade");
      }
    }
  }, [game, router]);

  if (!GameComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="md:container mx-auto min-h-screen py-12 md:p-8">
      <GameComponent />
    </div>
  );
}
