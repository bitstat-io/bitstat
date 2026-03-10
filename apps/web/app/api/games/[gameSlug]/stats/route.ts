const API_URL = (
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
)
  ?.replace(/\/+$/, "");

type StatsKeyMap = Record<string, string>;

function readStatsKeyMap(): StatsKeyMap {
  const raw = process.env.GAME_READ_API_KEYS_JSON;

  if (!raw?.trim()) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] =>
          typeof entry[0] === "string" &&
          typeof entry[1] === "string" &&
          entry[1].trim().length > 0,
      ),
    );
  } catch {
    return {};
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ gameSlug: string }> },
) {
  const { gameSlug } = await context.params;
  const userId = new URL(request.url).searchParams.get("user_id")?.trim();

  if (!userId) {
    return Response.json(
      { error: { code: "BAD_REQUEST", message: "user_id is required." } },
      { status: 400 },
    );
  }

  if (!API_URL) {
    return Response.json(
      { error: { code: "BAD_CONFIG", message: "API_URL is not configured." } },
      { status: 500 },
    );
  }

  const apiKey = readStatsKeyMap()[gameSlug];

  if (!apiKey) {
    return Response.json(
      {
        error: {
          code: "STATS_NOT_CONFIGURED",
          message: `Player stats are not configured for ${gameSlug}.`,
        },
      },
      { status: 501 },
    );
  }

  const params = new URLSearchParams({ user_id: userId });
  const upstream = await fetch(
    `${API_URL}/v1/games/${gameSlug}/stats?${params.toString()}`,
    {
      headers: {
        "X-API-Key": apiKey,
      },
      cache: "no-store",
    },
  );

  const text = await upstream.text();

  try {
    return Response.json(JSON.parse(text), { status: upstream.status });
  } catch {
    return Response.json(
      {
        error: {
          code: "BAD_UPSTREAM_RESPONSE",
          message: text || "Unexpected stats response.",
        },
      },
      { status: upstream.status || 502 },
    );
  }
}
