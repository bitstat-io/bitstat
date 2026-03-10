import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchGames, type GameT } from "@/actions/games";
import {
  activateScoringRuleVersion,
  createScoringRule,
  deactivateScoringRules,
  fetchScoringRule,
  fetchScoringRuleVersions,
  replaceScoringRule,
  type ScoringRulePayloadT,
  type ScoringRuleT,
  type ScoringRuleVersionT,
} from "@/actions/scoring";
import { toast } from "sonner";

const EMPTY_RULE_TEMPLATE = {
  weights: {
    default: {
      score: 1,
    },
    category: {},
    event: {},
  },
};

function formatRule(value: ScoringRulePayloadT) {
  return JSON.stringify(value, null, 2);
}

export function useScoring() {
  const [games, setGames] = useState<GameT[]>([]);
  const [selectedGameSlug, setSelectedGameSlug] = useState("");
  const [rule, setRule] = useState<ScoringRuleT | null>(null);
  const [versions, setVersions] = useState<ScoringRuleVersionT[]>([]);
  const [editorValue, setEditorValue] = useState(formatRule(EMPTY_RULE_TEMPLATE));
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingRule, setLoadingRule] = useState(false);
  const [savingMode, setSavingMode] = useState<"create" | "replace" | null>(null);
  const [activatingVersion, setActivatingVersion] = useState<number | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  const loadRuleData = useCallback(async (gameSlug: string) => {
    setLoadingRule(true);
    const [ruleResult, versionsResult] = await Promise.all([
      fetchScoringRule(gameSlug),
      fetchScoringRuleVersions(gameSlug),
    ]);

    if (ruleResult.error) {
      toast.error(ruleResult.message);
    }
    if (versionsResult.error) {
      toast.error(versionsResult.message);
    }

    const nextRule = ruleResult.error ? null : ruleResult.data;
    setRule(nextRule);
    setVersions(versionsResult.error ? [] : versionsResult.data);
    setEditorValue(
      formatRule(nextRule?.rules ?? EMPTY_RULE_TEMPLATE)
    );
    setLoadingRule(false);
  }, []);

  useEffect(() => {
    (async () => {
      const result = await fetchGames();
      if (result.error) {
        toast.error(result.message);
        setLoadingGames(false);
        return;
      }

      const firstSlug = result.data[0]?.slug ?? "";
      setGames(result.data);
      setSelectedGameSlug(firstSlug);
      setLoadingGames(false);

      if (firstSlug) {
        await loadRuleData(firstSlug);
      }
    })();
  }, [loadRuleData]);

  const selectedGame = useMemo(
    () => games.find((game) => game.slug === selectedGameSlug) ?? null,
    [games, selectedGameSlug]
  );

  const selectGame = useCallback(
    async (gameSlug: string) => {
      setSelectedGameSlug(gameSlug);
      await loadRuleData(gameSlug);
    },
    [loadRuleData]
  );

  const parseEditor = useCallback(() => {
    try {
      const parsed = JSON.parse(editorValue) as ScoringRulePayloadT;
      if (!parsed || typeof parsed !== "object" || !("weights" in parsed)) {
        throw new Error("Missing top-level weights object.");
      }
      return parsed;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Invalid scoring rule JSON."
      );
      return null;
    }
  }, [editorValue]);

  const handleSave = useCallback(
    async (mode: "create" | "replace") => {
      if (!selectedGameSlug) return false;

      const payload = parseEditor();
      if (!payload) return false;

      setSavingMode(mode);
      const result =
        mode === "create"
          ? await createScoringRule(selectedGameSlug, payload)
          : await replaceScoringRule(selectedGameSlug, payload);

      if (result.error) {
        toast.error(result.message);
        setSavingMode(null);
        return false;
      }

      toast.success(
        mode === "create"
          ? "Scoring rules saved as a new version."
          : "Active scoring rules replaced."
      );
      await loadRuleData(selectedGameSlug);
      setSavingMode(null);
      return true;
    },
    [loadRuleData, parseEditor, selectedGameSlug]
  );

  const handleActivateVersion = useCallback(
    async (version: number) => {
      if (!selectedGameSlug) return false;

      setActivatingVersion(version);
      const result = await activateScoringRuleVersion(selectedGameSlug, version);
      if (result.error) {
        toast.error(result.message);
        setActivatingVersion(null);
        return false;
      }

      toast.success(`Activated scoring rule version ${version}.`);
      await loadRuleData(selectedGameSlug);
      setActivatingVersion(null);
      return true;
    },
    [loadRuleData, selectedGameSlug]
  );

  const handleDeactivate = useCallback(async () => {
    if (!selectedGameSlug) return false;

    setDeactivating(true);
    const result = await deactivateScoringRules(selectedGameSlug);
    if (result.error) {
      toast.error(result.message);
      setDeactivating(false);
      return false;
    }

    toast.success("Scoring rules deactivated.");
    await loadRuleData(selectedGameSlug);
    setDeactivating(false);
    return true;
  }, [loadRuleData, selectedGameSlug]);

  const resetEditor = useCallback(() => {
    setEditorValue(formatRule(rule?.rules ?? EMPTY_RULE_TEMPLATE));
  }, [rule]);

  return {
    games,
    selectedGame,
    selectedGameSlug,
    rule,
    versions,
    editorValue,
    loadingGames,
    loadingRule,
    savingMode,
    activatingVersion,
    deactivating,
    selectGame,
    setEditorValue,
    handleSave,
    handleActivateVersion,
    handleDeactivate,
    resetEditor,
  };
}
