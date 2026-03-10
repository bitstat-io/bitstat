"use client";

import Link from "next/link";
import { type GameT } from "@/actions/games";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { IconDeviceGamepad2 } from "@tabler/icons-react";

export function GameCard({ game }: { game: GameT }) {
  return (
    <Link href={`/dashboard/games/${game.slug}`}>
      <Card className="h-full transition-colors hover:bg-muted/50 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-secondary overflow-hidden">
                {game.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={game.cover_image_url}
                    alt={game.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <IconDeviceGamepad2 className="size-4" />
                )}
              </div>
              <div>
                <CardTitle className="text-base">{game.name}</CardTitle>
                <CardDescription className="text-xs font-mono">
                  {game.slug}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Badge variant="secondary">{game.game_type ?? "Unspecified"}</Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(game.created_at).toLocaleDateString()}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
