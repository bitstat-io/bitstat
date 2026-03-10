import { createClient } from "@/lib/supabase/server";

type Region = "na" | "eu" | "apac" | "latam";
type Platform = "pc" | "console" | "mobile";

type GeneratorRequest = {
  apiKey: string;
  batchSize: number;
  playerCount: number;
  regions: Region[];
  platforms: Platform[];
  sessionStartRate: number;
  matchCompleteRate: number;
  objectiveRate: number;
};

const REGIONS: Region[] = ["na", "eu", "apac", "latam"];
const PLATFORMS: Platform[] = ["pc", "console", "mobile"];
const API_URL = process.env.API_URL?.replace(/\/+$/, "");

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function pickOne<T>(values: T[]) {
  const value = values[Math.floor(Math.random() * values.length)];
  if (value === undefined) {
    throw new Error("Cannot pick from an empty collection.");
  }
  return value;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeRequest(body: unknown): GeneratorRequest | null {
  if (!body || typeof body !== "object") return null;
  const input = body as Record<string, unknown>;

  const apiKey =
    typeof input.apiKey === "string" ? input.apiKey.trim() : "";
  const batchSize = Number(input.batchSize);
  const playerCount = Number(input.playerCount);
  const sessionStartRate = Number(input.sessionStartRate);
  const matchCompleteRate = Number(input.matchCompleteRate);
  const objectiveRate = Number(input.objectiveRate);
  const regions = Array.isArray(input.regions)
    ? input.regions.filter((value): value is Region =>
        typeof value === "string" && REGIONS.includes(value as Region),
      )
    : [];
  const platforms = Array.isArray(input.platforms)
    ? input.platforms.filter((value): value is Platform =>
        typeof value === "string" && PLATFORMS.includes(value as Platform),
      )
    : [];

  if (!apiKey || !Number.isFinite(batchSize) || !Number.isFinite(playerCount)) {
    return null;
  }

  return {
    apiKey,
    batchSize: clamp(Math.trunc(batchSize), 1, 500),
    playerCount: clamp(Math.trunc(playerCount), 1, 5000),
    regions: regions.length > 0 ? regions : REGIONS,
    platforms: platforms.length > 0 ? platforms : ["pc", "console"],
    sessionStartRate: clamp(sessionStartRate, 0, 1),
    matchCompleteRate: clamp(matchCompleteRate, 0, 1),
    objectiveRate: clamp(objectiveRate, 0, 1),
  };
}

function randomEvent(
  playerId: string,
  regions: Region[],
  platforms: Platform[],
  sessionStartRate: number,
  matchCompleteRate: number,
  objectiveRate: number,
) {
  const now = Math.floor(Date.now() / 1000);
  const sessionId = `session-${playerId}-${randomInt(1, 50)}`;
  const region = pickOne(regions);
  const platform = pickOne(platforms);
  const roll = Math.random();

  if (roll < sessionStartRate) {
    return {
      user_id: playerId,
      session_id: sessionId,
      client_ts: now,
      v: 1,
      category: "session",
      event_id: "session_start",
      game_type: "fps",
      platform,
      region,
      event_properties: {},
    };
  }

  if (roll < sessionStartRate + objectiveRate) {
    return {
      user_id: playerId,
      session_id: sessionId,
      client_ts: now,
      v: 1,
      category: "objective",
      event_id: pickOne(["objective_tick", "capture_progress", "zone_control"]),
      game_type: "fps",
      platform,
      region,
      event_properties: {
        captures: randomInt(1, 3),
      },
    };
  }

  if (roll < sessionStartRate + objectiveRate + matchCompleteRate) {
    return {
      user_id: playerId,
      session_id: sessionId,
      client_ts: now,
      v: 1,
      category: pickOne(["combat", "objective"]),
      event_id: "match_complete",
      game_type: "fps",
      platform,
      region,
      event_properties: {
        mvp: randomInt(0, 1),
        wins: randomInt(0, 1),
      },
    };
  }

  return {
    user_id: playerId,
    session_id: sessionId,
    client_ts: now,
    v: 1,
    category: "combat",
    event_id: pickOne(["gunfight", "round_skirmish", "teamfight", "combat_tick"]),
    game_type: "fps",
    platform,
    region,
    event_properties: {
      kills: randomInt(0, 6),
      damage: randomFloat(100, 2400),
      assists: randomInt(0, 4),
      headshots: randomInt(0, 4),
    },
  };
}

function buildPayload(config: GeneratorRequest) {
  const players = Array.from(
    { length: config.playerCount },
    (_, index) => `player_${index + 1}`,
  );

  return {
    events: Array.from({ length: config.batchSize }, () =>
      randomEvent(
        pickOne(players),
        config.regions,
        config.platforms,
        config.sessionStartRate,
        config.matchCompleteRate,
        config.objectiveRate,
      ),
    ),
  };
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return Response.json(
        { error: { code: "UNAUTHORIZED", message: "Not authenticated." } },
        { status: 401 },
      );
    }

    if (!API_URL) {
      return Response.json(
        { error: { code: "BAD_CONFIG", message: "API_URL is not configured." } },
        { status: 500 },
      );
    }

    const body = await request.json().catch(() => null);
    const config = normalizeRequest(body);
    if (!config) {
      return Response.json(
        { error: { code: "BAD_REQUEST", message: "Invalid generator request." } },
        { status: 400 },
      );
    }

    const payload = buildPayload(config);
    const upstream = await fetch(`${API_URL}/v1/events/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": config.apiKey,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await upstream.text();
    let parsed: unknown = null;

    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }

    return Response.json(
      {
        request: {
          batchSize: config.batchSize,
          playerCount: config.playerCount,
          regions: config.regions,
          platforms: config.platforms,
          sessionStartRate: config.sessionStartRate,
          matchCompleteRate: config.matchCompleteRate,
          objectiveRate: config.objectiveRate,
        },
        response: parsed,
        raw: parsed ? undefined : text,
      },
      { status: upstream.status },
    );
  } catch (error) {
    return Response.json(
      {
        error: {
          code: "UPSTREAM_REQUEST_FAILED",
          message:
            error instanceof Error
              ? error.message
              : "Failed to reach ingest API.",
        },
      },
      { status: 502 },
    );
  }
}
