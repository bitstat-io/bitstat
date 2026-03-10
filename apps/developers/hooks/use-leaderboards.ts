import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchGames, type GameT } from "@/actions/games";
import {
  fetchLeaderboard,
  type LeaderboardT,
} from "@/actions/leaderboards";
import { toast } from "sonner";

type LeaderboardWindowT = "all" | "1d" | "7d" | "30d";
type LeaderboardEnvT = "dev" | "prod";

type LeaderboardState = {
  games: GameT[];
  selectedGameSlug: string;
  env: LeaderboardEnvT;
  window: LeaderboardWindowT;
  limit: number;
  leaderboard: LeaderboardT | null;
  loadingGames: boolean;
  loadingLeaderboard: boolean;
};

export function useLeaderboards() {
  const [state, setState] = useState<LeaderboardState>({
    games: [],
    selectedGameSlug: "",
    env: "prod",
    window: "7d",
    limit: 25,
    leaderboard: null,
    loadingGames: true,
    loadingLeaderboard: false,
  });

  const loadLeaderboard = useCallback(
    async (
      gameSlug: string,
      env: LeaderboardEnvT,
      window: LeaderboardWindowT,
      limit: number,
    ) => {
      setState((s) => ({ ...s, loadingLeaderboard: true }));

      const result = await fetchLeaderboard(gameSlug, env, window, limit);
      if (result.error) {
        toast.error(result.message);
      }

      setState((s) => ({
        ...s,
        leaderboard: result.error ? null : result.data,
        loadingLeaderboard: false,
      }));
    },
    [],
  );

  useEffect(() => {
    (async () => {
      const result = await fetchGames();
      if (result.error) {
        toast.error(result.message);
        setState((s) => ({ ...s, loadingGames: false }));
        return;
      }

      const firstSlug = result.data[0]?.slug ?? "";
      setState((s) => ({
        ...s,
        games: result.data,
        selectedGameSlug: firstSlug,
        loadingGames: false,
      }));

      if (firstSlug) {
        await loadLeaderboard(firstSlug, "prod", "7d", 25);
      }
    })();
  }, [loadLeaderboard]);

  const setSelectedGameSlug = useCallback(
    async (selectedGameSlug: string) => {
      setState((s) => ({ ...s, selectedGameSlug }));
      await loadLeaderboard(
        selectedGameSlug,
        state.env,
        state.window,
        state.limit,
      );
    },
    [loadLeaderboard, state.env, state.limit, state.window],
  );

  const setEnv = useCallback(
    async (env: LeaderboardEnvT) => {
      setState((s) => ({ ...s, env }));
      if (!state.selectedGameSlug) return;
      await loadLeaderboard(state.selectedGameSlug, env, state.window, state.limit);
    },
    [loadLeaderboard, state.limit, state.selectedGameSlug, state.window],
  );

  const setWindow = useCallback(
    async (window: LeaderboardWindowT) => {
      setState((s) => ({ ...s, window }));
      if (!state.selectedGameSlug) return;
      await loadLeaderboard(state.selectedGameSlug, state.env, window, state.limit);
    },
    [loadLeaderboard, state.env, state.limit, state.selectedGameSlug],
  );

  const setLimit = useCallback(
    async (limit: number) => {
      setState((s) => ({ ...s, limit }));
      if (!state.selectedGameSlug) return;
      await loadLeaderboard(state.selectedGameSlug, state.env, state.window, limit);
    },
    [loadLeaderboard, state.env, state.selectedGameSlug, state.window],
  );

  const selectedGame = useMemo(
    () => state.games.find((game) => game.slug === state.selectedGameSlug) ?? null,
    [state.games, state.selectedGameSlug],
  );

  return {
    ...state,
    selectedGame,
    setSelectedGameSlug,
    setEnv,
    setWindow,
    setLimit,
  };
}

