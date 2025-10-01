"use client";

import type { Game } from "@workspace/ui/lib/types";
import { GAMES } from "@workspace/ui/lib/games-data";
import { Card } from "@workspace/ui/components/card";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Games() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const searchedGame = GAMES.filter((game) =>
    game.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-accent-foreground/80">All Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
        {searchedGame.map((game, index) => (
          <GameCard key={index} game={game} />
        ))}
      </div>
    </div>
  );
}

export function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/${game.href}`}>
      <Card className="overflow-hidden relative transition-transform duration-300 ease-in-out hover:border-primary p-0 ">
        <Image
          src={game.imageUrl}
          alt={game.name}
          width={700}
          height={400}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          className="w-full h-[300px] object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />

        <h3 className="p-4 absolute bottom-0 left-0 right-0 z-20 text-xl font-semibold text-white">
          {game.name}
        </h3>
      </Card>
    </Link>
  );
}
