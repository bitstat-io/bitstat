"use server";

import { API_URL, getAuthHeaders } from "@/lib/api";

export type DashboardRangeT = "5m" | "1h" | "24h" | "7d";
export type DashboardEnvT = "dev" | "prod";

export type DashboardTrafficPointT = {
  ts: string;
  events: number;
  accepted: number;
  rejected: number;
  errors: number;
  matches: number;
  sessions: number;
  purchases: number;
  iap: number;
};

export type DashboardEventLogT = {
  ts: string;
  game_id: string;
  game_slug: string;
  event_id: string;
  user_id: string;
  game_type: string | null;
  platform: string | null;
  region: string | null;
};

export type DashboardRejectLogT = {
  ts: string;
  reason: string;
  event_id?: string;
  game_id?: string;
  user_id?: string;
  game_slug?: string;
  tenant_id?: string;
  category?: string;
  client_ts?: number;
};

export type DashboardOverviewT = {
  range: DashboardRangeT;
  updatedAt: string;
  summary: {
    events: number;
    accepted: number;
    rejected: number;
    errors: number;
    uniquePlayers: number;
    errorRate: number;
    rejectRate: number;
    matches: number;
    sessions: number;
    purchases: number;
    iap: number;
    eventsPerSec: number;
  };
  recentEvents: DashboardEventLogT[];
  recentRejected: DashboardRejectLogT[];
  traffic: DashboardTrafficPointT[];
  topGames: Array<{ game_id: string; events: number; iap: number }>;
  topPlayers: Array<{ user_id: string; score: number }>;
};

type Result<T> = {
  error: boolean;
  message: string;
  data: T;
};

export async function fetchOwnedDashboardOverview(
  gameSlug: string,
  env: DashboardEnvT,
  range: DashboardRangeT,
): Promise<Result<DashboardOverviewT | null>> {
  try {
    const headers = await getAuthHeaders();
    const params = new URLSearchParams({ env, range });
    const res = await fetch(
      `${API_URL}/v1/dashboard/games/${gameSlug}/overview?${params.toString()}`,
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
          body?.error?.message ||
          `Failed to fetch dashboard overview (${res.status})`,
        data: null,
      };
    }

    const data = (await res.json()) as DashboardOverviewT;
    return { error: false, message: "", data };
  } catch (err) {
    return {
      error: true,
      message:
        err instanceof Error
          ? err.message
          : "Failed to fetch dashboard overview",
      data: null,
    };
  }
}
