// src\pages\arcade\index.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import { games } from "@/components/games";

export default function Arcade() {
  return (
    <div className="container mx-auto min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Arcade Games</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <Link href={`/arcade/${game.id}`} key={game.id}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>
                  {game.icon} {game.title}
                </CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <img className="rounded" src={game.image} alt={game.title} />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
