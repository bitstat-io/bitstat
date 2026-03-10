"use server";

import { API_URL } from "@/lib/api";

export type LeaderboardEntryT = {
  rank: number;
  user_id: string;
  score: number;
};

export type LeaderboardGameT = {
  slug: string;
  name: string;
  game_type: string | null;
  cover_image_url: string | null;
};

export type LeaderboardT = {
  game: LeaderboardGameT;
  window: "all" | "1d" | "7d" | "30d";
  entries: LeaderboardEntryT[];
};

export async function fetchLeaderboard(
  gameSlug: string,
  env: "dev" | "prod",
  window: "all" | "1d" | "7d" | "30d",
  limit: number,
): Promise<{ error: boolean; message: string; data: LeaderboardT | null }> {
  try {
    const path =
      env === "dev"
        ? `/v1/games/dev/${gameSlug}/leaderboards`
        : `/v1/games/${gameSlug}/leaderboards`;

    const params = new URLSearchParams({
      window,
      limit: String(limit),
    });

    const res = await fetch(`${API_URL}${path}?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: true,
        message:
          body?.error?.message ||
          `Failed to fetch leaderboard (${res.status})`,
        data: null,
      };
    }

    const data = await res.json();
    return { error: false, message: "", data };
  } catch (err) {
    return {
      error: true,
      message:
        err instanceof Error ? err.message : "Failed to fetch leaderboard",
      data: null,
    };
  }
}
