"use server";

import { getAuthHeaders, API_URL } from "@/lib/api";

export type GameT = {
  id: string;
  slug: string;
  name: string;
  game_type: string;
  image_url?: string | null;
  created_at: string;
};

export async function fetchGames(): Promise<{
  error: boolean;
  message: string;
  data: GameT[];
}> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/v1/dashboard/games`, { headers });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: true,
        message:
          body?.error?.message || `Failed to fetch games (${res.status})`,
        data: [],
      };
    }

    const body = await res.json();
    return { error: false, message: "", data: body.games ?? [] };
  } catch (err) {
    return {
      error: true,
      message: err instanceof Error ? err.message : "Failed to fetch games",
      data: [],
    };
  }
}

export async function createGame(
  slug: string,
  name: string,
  gameType: string,
  imageUrl?: string,
): Promise<{ error: boolean; message: string; data: GameT | null }> {
  try {
    const headers = await getAuthHeaders();
    const payload: Record<string, string> = { slug, name, game_type: gameType };
    if (imageUrl) payload.image_url = imageUrl;
    const res = await fetch(`${API_URL}/v1/dashboard/games`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: true,
        message:
          body?.error?.message || `Failed to create game (${res.status})`,
        data: null,
      };
    }

    const data = await res.json();
    return { error: false, message: "", data };
  } catch (err) {
    return {
      error: true,
      message: err instanceof Error ? err.message : "Failed to create game",
      data: null,
    };
  }
}

export async function updateGame(
  gameSlug: string,
  updates: { name?: string; game_type?: string; image_url?: string },
): Promise<{ error: boolean; message: string; data: GameT | null }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/v1/dashboard/games/${gameSlug}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: true,
        message:
          body?.error?.message || `Failed to update game (${res.status})`,
        data: null,
      };
    }

    const data = await res.json();
    return { error: false, message: "", data };
  } catch (err) {
    return {
      error: true,
      message: err instanceof Error ? err.message : "Failed to update game",
      data: null,
    };
  }
}

export async function publishGame(
  gameSlug: string,
  env: string,
): Promise<{ error: boolean; message: string }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${API_URL}/v1/dashboard/games/${gameSlug}/publish`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({ env }),
      },
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: true,
        message:
          body?.error?.message || `Failed to publish game (${res.status})`,
      };
    }

    return { error: false, message: "" };
  } catch (err) {
    return {
      error: true,
      message: err instanceof Error ? err.message : "Failed to publish game",
    };
  }
}

export async function unpublishGame(
  gameSlug: string,
  env: string,
): Promise<{ error: boolean; message: string }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${API_URL}/v1/dashboard/games/${gameSlug}/unpublish`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({ env }),
      },
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: true,
        message:
          body?.error?.message || `Failed to unpublish game (${res.status})`,
      };
    }

    return { error: false, message: "" };
  } catch (err) {
    return {
      error: true,
      message: err instanceof Error ? err.message : "Failed to unpublish game",
    };
  }
}
