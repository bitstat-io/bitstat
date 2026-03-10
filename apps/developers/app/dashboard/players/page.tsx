"use client";

import { useMemo } from "react";
import { usePlayerStats } from "@/hooks/use-player-stats";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
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
  IconLoader2,
  IconSearch,
  IconTargetArrow,
  IconUser,
} from "@tabler/icons-react";

function formatValue(value: string) {
  const number = Number(value);
  if (Number.isFinite(number)) {
    return number.toLocaleString(undefined, {
      maximumFractionDigits: Number.isInteger(number) ? 0 : 2,
    });
  }
  return value;
}

export default function DashboardPlayersPage() {
  const {
    games,
    selectedGame,
    selectedGameSlug,
    env,
    userId,
    stats,
    loadingGames,
    loadingStats,
    setSelectedGameSlug,
    setEnv,
    setUserId,
    search,
  } = usePlayerStats();

  const sortedStats = useMemo(() => {
    const entries = Object.entries(stats?.stats ?? {});
    return entries.sort(([aKey, aValue], [bKey, bValue]) => {
      const aNumber = Number(aValue);
      const bNumber = Number(bValue);
      const aIsNumber = Number.isFinite(aNumber);
      const bIsNumber = Number.isFinite(bNumber);

      if (aIsNumber && bIsNumber) return bNumber - aNumber;
      if (aIsNumber) return -1;
      if (bIsNumber) return 1;
      return aKey.localeCompare(bKey);
    });
  }, [stats]);

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
            <CardTitle>Create a game before checking player stats</CardTitle>
            <CardDescription>
              The player inspector reads per-user aggregates scoped to an owned
              game.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-4 md:px-6 md:py-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Players</h1>
        <p className="text-sm text-muted-foreground">
          Inspect aggregated stats for a specific user without leaving the owner
          dashboard.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Player lookup</CardTitle>
          <CardDescription>
            Query the new owner-safe player stats endpoint for one player at a
            time.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1fr_180px_220px_auto]">
          <div className="space-y-2">
            <Label htmlFor="player-user-id">Player ID</Label>
            <Input
              id="player-user-id"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              placeholder="player_1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="player-env">Environment</Label>
            <Select
              value={env}
              onValueChange={(value) => setEnv(value as "dev" | "prod")}
            >
              <SelectTrigger id="player-env">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prod">Prod</SelectItem>
                <SelectItem value="dev">Dev</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="player-game">Game</Label>
            <Select value={selectedGameSlug} onValueChange={setSelectedGameSlug}>
              <SelectTrigger id="player-game">
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
          <Button
            className="self-end"
            onClick={() => void search()}
            disabled={loadingStats || !selectedGameSlug || !userId.trim()}
          >
            {loadingStats ? (
              <IconLoader2 className="size-4 animate-spin" />
            ) : (
              <IconSearch className="size-4" />
            )}
            Search
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Focused game</CardDescription>
            <CardTitle>{selectedGame?.name ?? "No game selected"}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Player</CardDescription>
            <CardTitle className="font-mono text-lg">
              {stats?.user_id ?? userId}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Environment</CardDescription>
            <CardTitle>{env.toUpperCase()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Tracked stats</CardDescription>
            <CardTitle>{sortedStats.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>Quick read</CardTitle>
            <CardDescription>
              Highest-value counters from the current player payload.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingStats ? (
              <div className="flex items-center justify-center py-12">
                <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : !stats ? (
              <p className="text-sm text-muted-foreground">
                Search for a player to inspect their aggregated metrics.
              </p>
            ) : sortedStats.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No stored stats for this player yet.
              </p>
            ) : (
              sortedStats.slice(0, 6).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="rounded-md border bg-muted/30 p-2">
                      {key === "events" ? (
                        <IconTargetArrow className="size-4" />
                      ) : (
                        <IconUser className="size-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{key}</p>
                      <p className="text-xs text-muted-foreground">
                        Aggregated from ingested events
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{formatValue(value)}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All player stats</CardTitle>
            <CardDescription>
              Raw stat map stored for the selected player and environment.
            </CardDescription>
          </CardHeader>
          <CardContent className="rounded-md border p-0">
            {loadingStats ? (
              <div className="flex items-center justify-center py-16">
                <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : !stats ? (
              <div className="px-6 py-12 text-sm text-muted-foreground">
                No lookup has been run yet.
              </div>
            ) : sortedStats.length === 0 ? (
              <div className="px-6 py-12 text-sm text-muted-foreground">
                This player has no stored stats yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStats.map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatValue(value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
