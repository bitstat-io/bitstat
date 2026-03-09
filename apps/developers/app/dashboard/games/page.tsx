"use client";

import { useGames } from "@/hooks/use-games";
import { GameCard } from "@/components/games/game-card";
import { CreateGameDialog } from "@/components/games/create-game-dialog";
import { IconDeviceGamepad2, IconLoader2 } from "@tabler/icons-react";

export default function DashboardGamesPage() {
  const { games, loading, handleCreate } = useGames();

  return (
    <div className="flex flex-col gap-6 px-4 md:px-6 py-4 md:py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Games</h1>
          <p className="text-sm text-muted-foreground">
            Manage your games, API keys, and publishing status.
          </p>
        </div>
        <CreateGameDialog onCreate={handleCreate} />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : games.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconDeviceGamepad2 className="size-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            No games yet. Create your first game to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
