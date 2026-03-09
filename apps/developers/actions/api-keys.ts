"use server";

import { getAuthHeaders, API_URL } from "@/lib/api";


export type ApiKeyT = {
  id: string;
  env: string;
  scopes: string[];
  key_prefix: string;
  created_at: string;
  revoked_at: string | null;
};

export type CreatedApiKeyT = ApiKeyT & {
  key: string;
};

export async function fetchApiKeys(
  gameSlug: string
): Promise<{ error: boolean; message: string; data: ApiKeyT[] }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${API_URL}/v1/dashboard/games/${gameSlug}/api-keys`,
      { headers }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: true,
        message:
          body?.error?.message || `Failed to fetch API keys (${res.status})`,
        data: [],
      };
    }

    const body = await res.json();
    return { error: false, message: "", data: body.keys ?? [] };
  } catch (err) {
    return {
      error: true,
      message: err instanceof Error ? err.message : "Failed to fetch API keys",
      data: [],
    };
  }
}

export async function createApiKey(
  gameSlug: string,
  env: string,
  scopes: string[]
): Promise<{ error: boolean; message: string; data: CreatedApiKeyT | null }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${API_URL}/v1/dashboard/games/${gameSlug}/api-keys`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ env, scopes }),
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: true,
        message:
          body?.error?.message || `Failed to create API key (${res.status})`,
        data: null,
      };
    }

    const data = await res.json();
    return { error: false, message: "", data };
  } catch (err) {
    return {
      error: true,
      message: err instanceof Error ? err.message : "Failed to create API key",
      data: null,
    };
  }
}

export async function revokeApiKey(
  gameSlug: string,
  keyId: string
): Promise<{ error: boolean; message: string }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${API_URL}/v1/dashboard/games/${gameSlug}/api-keys/${keyId}`,
      { method: "DELETE", headers }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: true,
        message:
          body?.error?.message || `Failed to revoke API key (${res.status})`,
      };
    }

    return { error: false, message: "" };
  } catch (err) {
    return {
      error: true,
      message: err instanceof Error ? err.message : "Failed to revoke API key",
    };
  }
}
