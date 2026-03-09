import { useCallback, useEffect, useState } from "react";
import {
  fetchGames,
  updateGame,
  publishGame,
  unpublishGame,
  type GameT,
} from "@/actions/games";
import {
  fetchApiKeys,
  createApiKey,
  revokeApiKey,
  type ApiKeyT,
  type CreatedApiKeyT,
} from "@/actions/api-keys";
import { toast } from "sonner";

interface UseGameDetailState {
  game: GameT | null;
  keys: ApiKeyT[];
  loading: boolean;
  loadingKeys: boolean;
  revealedKey: CreatedApiKeyT | null;
  revoking: string | null;
  publishing: string | null;
}

export function useGameDetail(gameSlug: string) {
  const [state, setState] = useState<UseGameDetailState>({
    game: null,
    keys: [],
    loading: true,
    loadingKeys: true,
    revealedKey: null,
    revoking: null,
    publishing: null,
  });

  const loadGame = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const result = await fetchGames();
    if (result.error) {
      toast.error(result.message);
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    const game = result.data.find((g) => g.slug === gameSlug) ?? null;
    setState((s) => ({ ...s, game, loading: false }));
  }, [gameSlug]);

  const loadKeys = useCallback(async () => {
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
  }, [gameSlug]);

  useEffect(() => {
    loadGame();
    loadKeys();
  }, [loadGame, loadKeys]);

  const handleUpdate = useCallback(
    async (updates: { name?: string; game_type?: string; image_url?: string }) => {
      const result = await updateGame(gameSlug, updates);
      if (result.error) {
        toast.error(result.message);
        return false;
      }
      toast.success("Game updated successfully");
      await loadGame();
      return true;
    },
    [gameSlug, loadGame]
  );

  const handlePublish = useCallback(
    async (env: string) => {
      setState((s) => ({ ...s, publishing: `publish-${env}` }));
      const result = await publishGame(gameSlug, env);
      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success(`Published to ${env}`);
      }
      setState((s) => ({ ...s, publishing: null }));
      return !result.error;
    },
    [gameSlug]
  );

  const handleUnpublish = useCallback(
    async (env: string) => {
      setState((s) => ({ ...s, publishing: `unpublish-${env}` }));
      const result = await unpublishGame(gameSlug, env);
      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success(`Unpublished from ${env}`);
      }
      setState((s) => ({ ...s, publishing: null }));
      return !result.error;
    },
    [gameSlug]
  );

  const handleCreateKey = useCallback(
    async (env: string, scopes: string[]) => {
      if (scopes.length === 0) return false;

      const result = await createApiKey(gameSlug, env, scopes);
      if (result.error) {
        toast.error(result.message);
        return false;
      }

      setState((s) => ({ ...s, revealedKey: result.data }));
      await loadKeys();
      toast.success("API key created successfully");
      return true;
    },
    [gameSlug, loadKeys]
  );

  const handleRevokeKey = useCallback(
    async (keyId: string) => {
      setState((s) => ({ ...s, revoking: keyId }));
      const result = await revokeApiKey(gameSlug, keyId);
      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success("API key revoked");
        await loadKeys();
        setState((s) => ({
          ...s,
          revealedKey: s.revealedKey?.id === keyId ? null : s.revealedKey,
        }));
      }
      setState((s) => ({ ...s, revoking: null }));
    },
    [gameSlug, loadKeys]
  );

  const activeKeys = state.keys.filter((k) => !k.revoked_at);
  const revokedKeys = state.keys.filter((k) => k.revoked_at);

  return {
    ...state,
    activeKeys,
    revokedKeys,
    handleUpdate,
    handlePublish,
    handleUnpublish,
    handleCreateKey,
    handleRevokeKey,
  };
}
