"use server";

import { API_URL, getAuthHeaders } from "@/lib/api";

export type ScoringRulePayloadT = {
  weights: {
    default?: Record<string, number>;
    category?: Record<string, Record<string, number>>;
    event?: Record<string, Record<string, number>>;
  };
};

export type ScoringRuleT = {
  gameSlug: string;
  version: number;
  rules: ScoringRulePayloadT;
  active: boolean;
};

export type ScoringRuleVersionT = {
  version: number;
  active: boolean;
  created_at: string;
};

type Result<T> = {
  error: boolean;
  message: string;
  data: T;
};

export async function fetchScoringRule(
  gameSlug: string
): Promise<Result<ScoringRuleT | null>> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/v1/games/${gameSlug}/scoring-rules`, {
      headers,
    });

    if (res.status === 404) {
      return { error: false, message: "", data: null };
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: true,
        message:
          body?.error?.message ||
          `Failed to fetch scoring rule (${res.status})`,
        data: null,
      };
    }

    const data = await res.json();
    return { error: false, message: "", data };
  } catch (err) {
    return {
      error: true,
      message:
        err instanceof Error ? err.message : "Failed to fetch scoring rule",
      data: null,
    };
  }
}

export async function fetchScoringRuleVersions(
  gameSlug: string
): Promise<Result<ScoringRuleVersionT[]>> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${API_URL}/v1/games/${gameSlug}/scoring-rules/versions`,
      { headers }
    );

    if (res.status === 404) {
      return { error: false, message: "", data: [] };
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: true,
        message:
          body?.error?.message ||
          `Failed to fetch scoring versions (${res.status})`,
        data: [],
      };
    }

    const data = await res.json();
    return { error: false, message: "", data: data.versions ?? [] };
  } catch (err) {
    return {
      error: true,
      message:
        err instanceof Error
          ? err.message
          : "Failed to fetch scoring versions",
      data: [],
    };
  }
}

export async function createScoringRule(
  gameSlug: string,
  payload: ScoringRulePayloadT
): Promise<Result<ScoringRuleT | null>> {
  return mutateScoringRule("POST", gameSlug, payload);
}

export async function replaceScoringRule(
  gameSlug: string,
  payload: ScoringRulePayloadT
): Promise<Result<ScoringRuleT | null>> {
  return mutateScoringRule("PUT", gameSlug, payload);
}

async function mutateScoringRule(
  method: "POST" | "PUT",
  gameSlug: string,
  payload: ScoringRulePayloadT
): Promise<Result<ScoringRuleT | null>> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/v1/games/${gameSlug}/scoring-rules`, {
      method,
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: true,
        message:
          body?.error?.message ||
          `Failed to save scoring rule (${res.status})`,
        data: null,
      };
    }

    const data = await res.json();
    return { error: false, message: "", data };
  } catch (err) {
    return {
      error: true,
      message:
        err instanceof Error ? err.message : "Failed to save scoring rule",
      data: null,
    };
  }
}

export async function activateScoringRuleVersion(
  gameSlug: string,
  version: number
): Promise<Result<ScoringRuleT | null>> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${API_URL}/v1/games/${gameSlug}/scoring-rules/versions/${version}/activate`,
      {
        method: "PUT",
        headers,
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: true,
        message:
          body?.error?.message ||
          `Failed to activate scoring version (${res.status})`,
        data: null,
      };
    }

    const data = await res.json();
    return { error: false, message: "", data };
  } catch (err) {
    return {
      error: true,
      message:
        err instanceof Error
          ? err.message
          : "Failed to activate scoring version",
      data: null,
    };
  }
}

export async function deactivateScoringRules(
  gameSlug: string
): Promise<Result<{ gameSlug: string; active: false } | null>> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/v1/games/${gameSlug}/scoring-rules`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error: true,
        message:
          body?.error?.message ||
          `Failed to deactivate scoring rules (${res.status})`,
        data: null,
      };
    }

    const data = await res.json();
    return { error: false, message: "", data };
  } catch (err) {
    return {
      error: true,
      message:
        err instanceof Error
          ? err.message
          : "Failed to deactivate scoring rules",
      data: null,
    };
  }
}
