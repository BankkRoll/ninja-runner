// src/components/games/index.tsx

import dynamic from "next/dynamic";

export const games = [
  {
    id: "azaleas-runner", // Game ID ( slug )
    title: "Azalea's Runner", // Game title
    description: "Run endless as fast as you can, dodging the obstacles!",
    icon: "🌸",
    image: "/arcade/azaleas-runner/images/azaleas-dodger-preview.gif",
    game: dynamic(() =>
      import("./azaleas-runner").then((mod) => mod.AzaleaRunner),
    ),
  },
  // Add more games here
];
