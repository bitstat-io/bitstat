import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchGames, type GameT } from "@/actions/games";
import { fetchApiKeys, type ApiKeyT } from "@/actions/api-keys";
import {
  fetchScoringRule,
  fetchScoringRuleVersions,
  type ScoringRuleT,
  type ScoringRuleVersionT,
} from "@/actions/scoring";
import { toast } from "sonner";

type DashboardOverviewState = {
  games: GameT[];
  selectedGameSlug: string;
  keys: ApiKeyT[];
  scoringRule: ScoringRuleT | null;
  scoringVersions: ScoringRuleVersionT[];
  loadingGames: boolean;
  loadingDetails: boolean;
};

export function useDashboardOverview() {
  const [state, setState] = useState<DashboardOverviewState>({
    games: [],
    selectedGameSlug: "",
    keys: [],
    scoringRule: null,
    scoringVersions: [],
    loadingGames: true,
    loadingDetails: false,
  });

  const loadDetails = useCallback(async (gameSlug: string) => {
    setState((s) => ({ ...s, loadingDetails: true }));
    const [keysResult, scoringResult, versionsResult] = await Promise.all([
      fetchApiKeys(gameSlug),
      fetchScoringRule(gameSlug),
      fetchScoringRuleVersions(gameSlug),
    ]);

    if (keysResult.error) {
      toast.error(keysResult.message);
    }
    if (scoringResult.error) {
      toast.error(scoringResult.message);
    }
    if (versionsResult.error) {
      toast.error(versionsResult.message);
    }

    setState((s) => ({
      ...s,
      keys: keysResult.error ? [] : keysResult.data,
      scoringRule: scoringResult.error ? null : scoringResult.data,
      scoringVersions: versionsResult.error ? [] : versionsResult.data,
      loadingDetails: false,
    }));
  }, []);

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
        await loadDetails(firstSlug);
      }
    })();
  }, [loadDetails]);

  const selectGame = useCallback(
    async (gameSlug: string) => {
      setState((s) => ({ ...s, selectedGameSlug: gameSlug }));
      await loadDetails(gameSlug);
    },
    [loadDetails]
  );

  const selectedGame = useMemo(
    () => state.games.find((game) => game.slug === state.selectedGameSlug) ?? null,
    [state.games, state.selectedGameSlug]
  );

  const activeKeys = useMemo(
    () => state.keys.filter((key) => !key.revoked_at),
    [state.keys]
  );

  return {
    ...state,
    selectedGame,
    activeKeys,
    selectGame,
  };
}

