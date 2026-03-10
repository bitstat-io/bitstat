"use server";

import { API_URL, getAuthHeaders } from "@/lib/api";
import type { DashboardEnvT } from "@/actions/dashboard";

export type PlayerStatsT = {
  gameSlug: string;
  user_id: string;
  stats: Record<string, string>;
};

type Result<T> = {
  error: boolean;
  message: string;
  data: T;
};

export async function fetchOwnedPlayerStats(
  gameSlug: string,
  userId: string,
  env: DashboardEnvT,
): Promise<Result<PlayerStatsT | null>> {
  try {
    const headers = await getAuthHeaders();
    const params = new URLSearchParams({
      user_id: userId,
      env,
    });

    const res = await fetch(
      `${API_URL}/v1/dashboard/games/${gameSlug}/stats?${params.toString()}`,
      {
        headers,
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: true,
        message:
          body?.error?.message || `Failed to fetch player stats (${res.status})`,
        data: null,
      };
    }

    const data = (await res.json()) as PlayerStatsT;
    return { error: false, message: "", data };
  } catch (err) {
    return {
      error: true,
      message:
        err instanceof Error ? err.message : "Failed to fetch player stats",
      data: null,
    };
  }
}
