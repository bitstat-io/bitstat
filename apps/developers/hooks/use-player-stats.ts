import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { fetchGames, type GameT } from "@/actions/games";
import {
  fetchOwnedPlayerStats,
  type PlayerStatsT,
} from "@/actions/player-stats";
import type { DashboardEnvT } from "@/actions/dashboard";

type PlayerStatsState = {
  games: GameT[];
  selectedGameSlug: string;
  env: DashboardEnvT;
  userId: string;
  stats: PlayerStatsT | null;
  loadingGames: boolean;
  loadingStats: boolean;
};

export function usePlayerStats() {
  const [state, setState] = useState<PlayerStatsState>({
    games: [],
    selectedGameSlug: "",
    env: "prod",
    userId: "player_1",
    stats: null,
    loadingGames: true,
    loadingStats: false,
  });

  useEffect(() => {
    void (async () => {
      const result = await fetchGames();
      if (result.error) {
        toast.error(result.message);
        setState((current) => ({ ...current, loadingGames: false }));
        return;
      }

      const firstSlug = result.data[0]?.slug ?? "";
      setState((current) => ({
        ...current,
        games: result.data,
        selectedGameSlug: firstSlug,
        loadingGames: false,
      }));
    })();
  }, []);

  const search = useCallback(
    async (
      gameSlug: string = state.selectedGameSlug,
      userId: string = state.userId,
      env: DashboardEnvT = state.env,
    ) => {
      if (!gameSlug || !userId.trim()) return false;

      setState((current) => ({ ...current, loadingStats: true }));
      const result = await fetchOwnedPlayerStats(gameSlug, userId.trim(), env);
      if (result.error) {
        toast.error(result.message);
      }

      setState((current) => ({
        ...current,
        stats: result.error ? null : result.data,
        loadingStats: false,
      }));

      return !result.error;
    },
    [state.env, state.selectedGameSlug, state.userId],
  );

  const selectedGame = useMemo(
    () =>
      state.games.find((game) => game.slug === state.selectedGameSlug) ?? null,
    [state.games, state.selectedGameSlug],
  );

  return {
    ...state,
    selectedGame,
    setSelectedGameSlug: (selectedGameSlug: string) =>
      setState((current) => ({ ...current, selectedGameSlug })),
    setEnv: (env: DashboardEnvT) =>
      setState((current) => ({ ...current, env })),
    setUserId: (userId: string) =>
      setState((current) => ({ ...current, userId })),
    search,
  };
}
