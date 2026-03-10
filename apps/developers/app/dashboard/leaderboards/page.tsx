"use client";

import Image from "next/image";
import { useLeaderboards } from "@/hooks/use-leaderboards";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  IconCrown,
  IconDeviceGamepad2,
  IconLoader2,
  IconTargetArrow,
  IconTrophy,
} from "@tabler/icons-react";

const LIMIT_OPTIONS = [10, 25, 50, 100];

function formatScore(score: number) {
  return Number.isInteger(score)
    ? score.toLocaleString()
    : score.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function DashboardLeaderboardsPage() {
  const {
    games,
    selectedGame,
    selectedGameSlug,
    env,
    window,
    limit,
    leaderboard,
    loadingGames,
    loadingLeaderboard,
    setSelectedGameSlug,
    setEnv,
    setWindow,
    setLimit,
  } = useLeaderboards();

  if (loadingGames) {
    return (
      <div className="flex items-center justify-center py-16">
        <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="px-4 py-6 md:px-6">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Create a game before checking leaderboards</CardTitle>
            <CardDescription>
              Leaderboards need a published game and ingested scores.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const topEntry = leaderboard?.entries[0] ?? null;
  const secondEntry = leaderboard?.entries[1] ?? null;
  const thirdEntry = leaderboard?.entries[2] ?? null;

  return (
    <div className="flex flex-col gap-6 px-4 py-4 md:px-6 md:py-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Leaderboards</h1>
        <p className="text-sm text-muted-foreground">
          Inspect the public ranking for each game across dev and prod windows.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Choose a game, environment, and ranking window.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="leaderboard-game">Game</Label>
            <Select value={selectedGameSlug} onValueChange={setSelectedGameSlug}>
              <SelectTrigger id="leaderboard-game">
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                {games.map((game) => (
                  <SelectItem key={game.slug} value={game.slug}>
                    {game.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leaderboard-env">Environment</Label>
            <Select value={env} onValueChange={(value) => void setEnv(value as "dev" | "prod")}>
              <SelectTrigger id="leaderboard-env">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prod">Prod</SelectItem>
                <SelectItem value="dev">Dev</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leaderboard-window">Window</Label>
            <Select
              value={window}
              onValueChange={(value) =>
                void setWindow(value as "all" | "1d" | "7d" | "30d")
              }
            >
              <SelectTrigger id="leaderboard-window">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="1d">1 day</SelectItem>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leaderboard-limit">Limit</Label>
            <Select
              value={String(limit)}
              onValueChange={(value) => void setLimit(Number(value))}
            >
              <SelectTrigger id="leaderboard-limit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LIMIT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    Top {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard table</CardTitle>
            <CardDescription>
              {selectedGame?.name} in {env} across the {window} window.
            </CardDescription>
          </CardHeader>
          <CardContent className="rounded-md border p-0">
            {loadingLeaderboard ? (
              <div className="flex items-center justify-center py-16">
                <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : !leaderboard ? (
              <div className="px-6 py-12 text-sm text-muted-foreground">
                No leaderboard available yet for this game and environment.
              </div>
            ) : leaderboard.entries.length === 0 ? (
              <div className="px-6 py-12 text-sm text-muted-foreground">
                No scores yet. Start ingesting events to populate rankings.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.entries.map((entry) => (
                    <TableRow key={`${entry.rank}-${entry.user_id}`}>
                      <TableCell className="font-medium">#{entry.rank}</TableCell>
                      <TableCell className="font-mono">{entry.user_id}</TableCell>
                      <TableCell className="text-right">
                        {formatScore(entry.score)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Game snapshot</CardTitle>
              <CardDescription>
                Current public leaderboard target.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedGame ? (
                <div className="flex flex-col gap-4">
                  <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
                    {selectedGame.cover_image_url ? (
                      <Image
                        src={selectedGame.cover_image_url}
                        alt={selectedGame.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <IconDeviceGamepad2 className="size-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">{selectedGame.name}</p>
                      <Badge variant="secondary">
                        {selectedGame.game_type ?? "Unspecified"}
                      </Badge>
                    </div>
                    <p className="font-mono text-sm text-muted-foreground">
                      {selectedGame.slug}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={env === "prod" ? "default" : "outline"}>
                      Prod
                    </Badge>
                    <Badge variant={env === "dev" ? "default" : "outline"}>
                      Dev
                    </Badge>
                    <Badge variant="outline">Window {window}</Badge>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a game to inspect its leaderboard.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top players</CardTitle>
              <CardDescription>
                Quick read of the current front-runners.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingLeaderboard ? (
                <div className="flex items-center justify-center py-12">
                  <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : !topEntry ? (
                <p className="text-sm text-muted-foreground">
                  No ranked players available yet.
                </p>
              ) : (
                <>
                  <div className="rounded-xl border p-4">
                    <div className="flex items-center gap-2">
                      <IconCrown className="size-5 text-amber-500" />
                      <p className="font-medium">Leader</p>
                    </div>
                    <p className="mt-2 font-mono text-sm">{topEntry.user_id}</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {formatScore(topEntry.score)}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border p-4">
                      <div className="flex items-center gap-2">
                        <IconTrophy className="size-4 text-slate-500" />
                        <p className="font-medium">Second</p>
                      </div>
                      <p className="mt-2 font-mono text-sm">
                        {secondEntry?.user_id ?? "N/A"}
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {secondEntry ? formatScore(secondEntry.score) : "-"}
                      </p>
                    </div>
                    <div className="rounded-xl border p-4">
                      <div className="flex items-center gap-2">
                        <IconTargetArrow className="size-4 text-orange-500" />
                        <p className="font-medium">Third</p>
                      </div>
                      <p className="mt-2 font-mono text-sm">
                        {thirdEntry?.user_id ?? "N/A"}
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {thirdEntry ? formatScore(thirdEntry.score) : "-"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
