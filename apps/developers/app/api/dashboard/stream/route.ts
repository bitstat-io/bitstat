import { NextRequest } from "next/server";
import { API_URL } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const gameSlug = request.nextUrl.searchParams.get("gameSlug");
  const env = request.nextUrl.searchParams.get("env") ?? "prod";
  const range = request.nextUrl.searchParams.get("range") ?? "5m";

  if (!gameSlug) {
    return new Response("Missing gameSlug", { status: 400 });
  }

  const params = new URLSearchParams({ env, range });
  const upstream = await fetch(
    `${API_URL}/v1/dashboard/games/${gameSlug}/stream?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: "no-store",
    },
  );

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "Stream unavailable");
    return new Response(text, { status: upstream.status || 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
