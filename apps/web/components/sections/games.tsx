import type { Game } from "@workspace/ui/lib/types";
import { GAMES } from "@workspace/ui/lib/games-data";
import { Card } from "@workspace/ui/components/card";
import Image from "next/image";
import Link from "next/link";

export default function Games() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {GAMES.map((game, index) => (
        <GameCard key={index} game={game} />
      ))}
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
          className="w-full h-[500px] object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />

        <h3 className="p-4 absolute bottom-0 left-0 right-0 z-20 text-xl font-semibold text-white">
          {game.name}
        </h3>
      </Card>
    </Link>
  );
}
