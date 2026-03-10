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

const API_URL = (
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
)
  ?.replace(/\/+$/, "");

function normalizeGameKey(value: string) {
  return value.trim().toLowerCase();
}

function getStaticHrefByName(name: string) {
  return (
    GAMES.find((game) => normalizeGameKey(game.name) === normalizeGameKey(name))
      ?.href ?? "#"
  );
}

export type LeaderboardWindow = "all" | "1d" | "7d" | "30d";

export type PublicLeaderboard = {
  game: {
    slug: string;
    name: string;
    game_type: string | null;
    cover_image_url: string | null;
  };
  window: LeaderboardWindow;
  entries: Array<{
    rank: number;
    user_id: string;
    score: number;
  }>;
};

export async function getPublicLeaderboard(
  gameSlug: string,
  window: LeaderboardWindow = "all",
  limit = 50,
) {
  if (!API_URL) {
    console.warn("apps/web: missing API_URL or NEXT_PUBLIC_API_URL, cannot fetch leaderboard");
    return null;
  }

  try {
    const params = new URLSearchParams({
      window,
      limit: String(limit),
    });
    const response = await fetch(
      `${API_URL}/v1/games/${gameSlug}/leaderboards?${params.toString()}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(
        `apps/web: failed to fetch leaderboard for ${gameSlug} (${response.status} ${response.statusText})`,
      );
      return null;
    }

    return (await response.json()) as PublicLeaderboard;
  } catch (error) {
    console.error(`apps/web: failed to fetch leaderboard for ${gameSlug}`, error);
    return null;
  }
}

export async function getMergedGames() {
  const staticGames = [...GAMES];

  if (!API_URL) {
    console.warn("apps/web: missing API_URL or NEXT_PUBLIC_API_URL, using static games only");
    return staticGames;
  }

  try {
    const response = await fetch(`${API_URL}/v1/games`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `apps/web: failed to fetch public games (${response.status} ${response.statusText})`,
      );
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
        href: game.game_slug || getStaticHrefByName(game.name),
        name: game.name,
        description: "",
        category: game.game_type ?? "",
        imageUrl: game.cover_image_url ?? "/window.svg",
      });
    }

    return [...staticGames, ...dynamicGames];
  } catch (error) {
    console.error("apps/web: failed to fetch public games", error);
    return staticGames;
  }
}
