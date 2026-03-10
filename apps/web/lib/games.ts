import type { Game } from "@workspace/ui/lib/types";
import { GAMES } from "@workspace/ui/lib/games-data";

type PublicGameResponse = {
  games?: Array<{
    game_slug: string;
    name: string;
    game_type: string | null;
    cover_image_url: string | null;
  }>;
};

const API_URL = process.env.API_URL?.replace(/\/+$/, "");

function normalizeGameKey(value: string) {
  return value.trim().toLowerCase();
}

function getStaticHrefByName(name: string) {
  return (
    GAMES.find((game) => normalizeGameKey(game.name) === normalizeGameKey(name))
      ?.href ?? "#"
  );
}

export async function getMergedGames() {
  const staticGames = [...GAMES];

  if (!API_URL) {
    return staticGames;
  }

  try {
    const response = await fetch(`${API_URL}/v1/games`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return staticGames;
    }

    const body = (await response.json()) as PublicGameResponse;
    const existingKeys = new Set(
      staticGames.map((game) => normalizeGameKey(game.name)),
    );

    const dynamicGames: Game[] = [];

    for (const game of body.games ?? []) {
      const key = normalizeGameKey(game.name);

      if (existingKeys.has(key)) {
        continue;
      }

      existingKeys.add(key);
      dynamicGames.push({
        href: getStaticHrefByName(game.name),
        name: game.name,
        description: "",
        category: game.game_type ?? "",
        imageUrl: game.cover_image_url ?? "/window.svg",
      });
    }

    return [...staticGames, ...dynamicGames];
  } catch {
    return staticGames;
  }
}
