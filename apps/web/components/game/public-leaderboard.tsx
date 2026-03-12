"use client";

import type { PublicLeaderboard, LeaderboardWindow } from "@/lib/games";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

const WINDOWS: LeaderboardWindow[] = ["all", "1d", "7d", "30d"];

function formatWindowLabel(window: LeaderboardWindow) {
  return window === "all" ? "All time" : window;
}

export function PublicLeaderboardView({
  leaderboard,
  selectedWindow,
}: {
  leaderboard: PublicLeaderboard;
  selectedWindow: LeaderboardWindow;
}) {
  return (
    <div className="container mx-auto min-h-screen max-w-6xl border-x">
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Link>
          <div className="flex flex-wrap gap-2">
            {WINDOWS.map((window) => (
              <Button
                key={window}
                asChild
                variant={selectedWindow === window ? "default" : "outline"}
                size="sm"
              >
                <Link
                  href={`/${leaderboard.game.slug}?window=${window}`}
                  prefetch={false}
                >
                  {formatWindowLabel(window)}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="relative h-56 w-full bg-muted">
            <Image
              src={leaderboard.game.cover_image_url || "/window.svg"}
              alt={leaderboard.game.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.18em] opacity-80">
                Public Leaderboard
              </p>
              <h1 className="text-3xl font-semibold">{leaderboard.game.name}</h1>
              <p className="text-sm opacity-80">
                Window: {formatWindowLabel(selectedWindow)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Players</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {leaderboard.entries.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">
                No leaderboard entries yet for this game.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="px-6 py-3 font-medium">Rank</th>
                      <th className="px-6 py-3 font-medium">Player</th>
                      <th className="px-6 py-3 font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.entries.map((entry) => (
                      <tr
                        key={`${entry.user_id}-${entry.rank}`}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="px-6 py-4 font-medium">{entry.rank}</td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-foreground">
                            {entry.user_id}
                          </span>
                        </td>
                        <td className="px-6 py-4">{Math.floor(entry.score).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
