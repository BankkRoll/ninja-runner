"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal, Star, Trophy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type HighScore = { username: string; score: number; created_at: string };

type LeaderboardProps = {
  top10Daily: HighScore[];
  top10AllTime: HighScore[];
};

const emojis = ["🥇", "🥈", "🥉"];

export const Leaderboard: React.FC<LeaderboardProps> = ({
  top10Daily,
  top10AllTime,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const renderLeaderboard = (title: string, data: HighScore[]) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[50px] ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
              : data.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">{index + 1}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {entry.username}
                        {index < 3 && (
                          <Badge variant="outline" className="ml-2">
                            {emojis[index]}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{entry.score}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full space-y-6 md:space-y-0 md:flex md:gap-6">
      {renderLeaderboard("Last 24 Hour High Scores", top10Daily)}
      {renderLeaderboard("All-Time High Scores", top10AllTime)}
    </div>
  );
};
