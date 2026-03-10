import { notFound } from "next/navigation";
import {
  getPublicLeaderboard,
  type LeaderboardWindow,
} from "@/lib/games";
import { PublicLeaderboardView } from "@/components/game/public-leaderboard";

const VALID_WINDOWS: LeaderboardWindow[] = ["all", "1d", "7d", "30d"];

function toWindow(value: string | undefined): LeaderboardWindow {
  if (value && VALID_WINDOWS.includes(value as LeaderboardWindow)) {
    return value as LeaderboardWindow;
  }

  return "all";
}

export default async function GameLeaderboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ gameSlug: string }>;
  searchParams: Promise<{ window?: string }>;
}) {
  const { gameSlug } = await params;
  const { window } = await searchParams;
  const selectedWindow = toWindow(window);
  const leaderboard = await getPublicLeaderboard(gameSlug, selectedWindow, 50);

  if (!leaderboard) {
    notFound();
  }

  return (
    <PublicLeaderboardView
      leaderboard={leaderboard}
      selectedWindow={selectedWindow}
    />
  );
}
