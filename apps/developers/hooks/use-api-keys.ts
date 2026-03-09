import { useCallback, useEffect, useState } from "react";
import { fetchGames, type GameT } from "@/actions/games";
import {
  fetchApiKeys,
  createApiKey,
  revokeApiKey,
  type ApiKeyT,
  type CreatedApiKeyT,
} from "@/actions/api-keys";
import { toast } from "sonner";

interface UseApiKeysState {
  games: GameT[];
  selectedGame: string;
  keys: ApiKeyT[];
  loadingGames: boolean;
  loadingKeys: boolean;
  revealedKey: CreatedApiKeyT | null;
  revoking: string | null;
}

export function useApiKeys() {
  const [state, setState] = useState<UseApiKeysState>({
    games: [],
    selectedGame: "",
    keys: [],
    loadingGames: true,
    loadingKeys: false,
    revealedKey: null,
    revoking: null,
  });

  const loadKeys = useCallback(async (gameSlug: string) => {
    setState((s) => ({ ...s, loadingKeys: true }));
    const result = await fetchApiKeys(gameSlug);
    if (result.error) {
      toast.error(result.message);
    }
    setState((s) => ({
      ...s,
      keys: result.error ? s.keys : result.data,
      loadingKeys: false,
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
      const firstSlug =
        result.data.length > 0 ? result.data[0]!.slug : "";
      setState((s) => ({
        ...s,
        games: result.data,
        selectedGame: firstSlug,
        loadingGames: false,
      }));
    })();
  }, []);

  useEffect(() => {
    if (state.selectedGame) {
      loadKeys(state.selectedGame);
    }
  }, [state.selectedGame, loadKeys]);

  const selectGame = useCallback((slug: string) => {
    setState((s) => ({ ...s, selectedGame: slug, revealedKey: null }));
  }, []);

  const handleCreate = useCallback(
    async (env: string, scopes: string[]) => {
      if (!state.selectedGame || scopes.length === 0) return false;

      const result = await createApiKey(state.selectedGame, env, scopes);
      if (result.error) {
        toast.error(result.message);
        return false;
      }

      setState((s) => ({ ...s, revealedKey: result.data }));
      await loadKeys(state.selectedGame);
      toast.success("API key created successfully");
      return true;
    },
    [state.selectedGame, loadKeys]
  );

  const handleRevoke = useCallback(
    async (keyId: string) => {
      if (!state.selectedGame) return;

      setState((s) => ({ ...s, revoking: keyId }));
      const result = await revokeApiKey(state.selectedGame, keyId);
      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success("API key revoked");
        await loadKeys(state.selectedGame);
        setState((s) => ({
          ...s,
          revealedKey: s.revealedKey?.id === keyId ? null : s.revealedKey,
        }));
      }
      setState((s) => ({ ...s, revoking: null }));
    },
    [state.selectedGame, loadKeys]
  );

  const activeKeys = state.keys.filter((k) => !k.revoked_at);
  const revokedKeys = state.keys.filter((k) => k.revoked_at);

  return {
    ...state,
    activeKeys,
    revokedKeys,
    selectGame,
    handleCreate,
    handleRevoke,
  };
}
