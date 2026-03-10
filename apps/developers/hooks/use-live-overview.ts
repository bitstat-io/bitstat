import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { fetchGames, type GameT } from "@/actions/games";
import {
  fetchApiKeys,
  type ApiKeyT,
} from "@/actions/api-keys";
import {
  fetchScoringRule,
  fetchScoringRuleVersions,
  type ScoringRuleT,
  type ScoringRuleVersionT,
} from "@/actions/scoring";
import {
  fetchOwnedDashboardOverview,
  type DashboardEnvT,
  type DashboardOverviewT,
  type DashboardRangeT,
} from "@/actions/dashboard";

type LiveOverviewState = {
  games: GameT[];
  selectedGameSlug: string;
  env: DashboardEnvT;
  range: DashboardRangeT;
  overview: DashboardOverviewT | null;
  keys: ApiKeyT[];
  scoringRule: ScoringRuleT | null;
  scoringVersions: ScoringRuleVersionT[];
  loadingGames: boolean;
  loadingOverview: boolean;
  loadingSidebarData: boolean;
  live: boolean;
};

export function useLiveOverview() {
  const [state, setState] = useState<LiveOverviewState>({
    games: [],
    selectedGameSlug: "",
    env: "prod",
    range: "1h",
    overview: null,
    keys: [],
    scoringRule: null,
    scoringVersions: [],
    loadingGames: true,
    loadingOverview: false,
    loadingSidebarData: false,
    live: true,
  });

  const loadSidebarData = useCallback(async (gameSlug: string) => {
    setState((current) => ({ ...current, loadingSidebarData: true }));
    const [keysResult, scoringResult, versionsResult] = await Promise.all([
      fetchApiKeys(gameSlug),
      fetchScoringRule(gameSlug),
      fetchScoringRuleVersions(gameSlug),
    ]);

    if (keysResult.error) toast.error(keysResult.message);
    if (scoringResult.error) toast.error(scoringResult.message);
    if (versionsResult.error) toast.error(versionsResult.message);

    setState((current) => ({
      ...current,
      keys: keysResult.error ? [] : keysResult.data,
      scoringRule: scoringResult.error ? null : scoringResult.data,
      scoringVersions: versionsResult.error ? [] : versionsResult.data,
      loadingSidebarData: false,
    }));
  }, []);

  const loadOverview = useCallback(
    async (gameSlug: string, env: DashboardEnvT, range: DashboardRangeT) => {
      setState((current) => ({ ...current, loadingOverview: true }));
      const result = await fetchOwnedDashboardOverview(gameSlug, env, range);
      if (result.error) {
        toast.error(result.message);
      }

      setState((current) => ({
        ...current,
        overview: result.error ? null : result.data,
        loadingOverview: false,
      }));
    },
    [],
  );

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

      if (firstSlug) {
        await Promise.all([
          loadOverview(firstSlug, "prod", "1h"),
          loadSidebarData(firstSlug),
        ]);
      }
    })();
  }, [loadOverview, loadSidebarData]);

  useEffect(() => {
    if (!state.live || !state.selectedGameSlug) return;

    const params = new URLSearchParams({
      gameSlug: state.selectedGameSlug,
      env: state.env,
      range: state.range,
    });

    const source = new EventSource(`/api/dashboard/stream?${params.toString()}`);

    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as DashboardOverviewT;
        setState((current) => ({
          ...current,
          overview: payload,
          loadingOverview: false,
        }));
      } catch {
        toast.error("Failed to parse live dashboard update.");
      }
    };

    source.onerror = () => {
      source.close();
      setState((current) => ({ ...current, live: false }));
      toast.error("Live stream disconnected. Switched back to manual refresh.");
    };

    return () => {
      source.close();
    };
  }, [state.env, state.live, state.range, state.selectedGameSlug]);

  const selectGame = useCallback(
    async (selectedGameSlug: string) => {
      setState((current) => ({ ...current, selectedGameSlug }));
      await Promise.all([
        loadOverview(selectedGameSlug, state.env, state.range),
        loadSidebarData(selectedGameSlug),
      ]);
    },
    [loadOverview, loadSidebarData, state.env, state.range],
  );

  const setEnv = useCallback(
    async (env: DashboardEnvT) => {
      setState((current) => ({ ...current, env }));
      if (!state.selectedGameSlug) return;
      await loadOverview(state.selectedGameSlug, env, state.range);
    },
    [loadOverview, state.range, state.selectedGameSlug],
  );

  const setRange = useCallback(
    async (range: DashboardRangeT) => {
      setState((current) => ({ ...current, range }));
      if (!state.selectedGameSlug) return;
      await loadOverview(state.selectedGameSlug, state.env, range);
    },
    [loadOverview, state.env, state.selectedGameSlug],
  );

  const toggleLive = useCallback(() => {
    setState((current) => ({ ...current, live: !current.live }));
  }, []);

  const refresh = useCallback(async () => {
    if (!state.selectedGameSlug) return;
    await loadOverview(state.selectedGameSlug, state.env, state.range);
  }, [loadOverview, state.env, state.range, state.selectedGameSlug]);

  const selectedGame = useMemo(
    () =>
      state.games.find((game) => game.slug === state.selectedGameSlug) ?? null,
    [state.games, state.selectedGameSlug],
  );

  const activeKeys = useMemo(
    () => state.keys.filter((key) => !key.revoked_at),
    [state.keys],
  );

  return {
    ...state,
    selectedGame,
    activeKeys,
    selectGame,
    setEnv,
    setRange,
    toggleLive,
    refresh,
  };
}
