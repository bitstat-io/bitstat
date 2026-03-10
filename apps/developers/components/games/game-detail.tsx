"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  IconArrowLeft,
  IconDeviceGamepad2,
  IconLoader2,
} from "@tabler/icons-react";
import { useGameDetail } from "@/hooks/use-game-detail";
import { EditGameDialog } from "@/components/games/edit-game-dialog";
import { PublishControls } from "@/components/games/publish-controls";
import { Badge } from "@workspace/ui/components/badge";
import Image from "next/image";
import Link from "next/link";

export function GameDetail({ gameSlug }: { gameSlug: string }) {
  const {
    game,
    loading,
    publishing,
    handleUpdate,
    handlePublish,
    handleUnpublish,
  } = useGameDetail(gameSlug);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">Game not found.</p>
        <Link
          href="/dashboard/games"
          className="text-sm text-primary hover:underline mt-2"
        >
          Back to games
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 md:px-6 py-4 md:py-6">
      {/* Back + Header */}
      <div>
        <Link
          href="/dashboard/games"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-3"
        >
          <IconArrowLeft className="size-3.5" />
          Back to games
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex size-12 items-center justify-center rounded-lg bg-secondary overflow-hidden shrink-0">
              {game.cover_image_url ? (
                <Image
                  src={game.cover_image_url}
                  alt={game.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <IconDeviceGamepad2 className="size-6" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {game.name}
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                {game.slug}
              </p>
            </div>
          </div>
          <EditGameDialog game={game} onUpdate={handleUpdate} />
        </div>
      </div>

      {/* Game Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Game Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            {game.cover_image_url && (
              <div className="relative shrink-0 size-24 rounded-lg bg-secondary overflow-hidden">
                <Image
                  src={game.cover_image_url}
                  alt={game.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 flex-1">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <Badge variant="secondary">
                  {game.game_type ?? "Unspecified"}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="text-sm">
                  {new Date(game.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Slug</p>
                <p className="text-sm font-mono">{game.slug}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publish Controls */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight mb-3">
          Publishing
        </h2>
        <PublishControls
          publishing={publishing}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
        />
      </div>
    </div>
  );
}
