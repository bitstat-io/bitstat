import { useCallback, useEffect, useState } from "react";
import {
  fetchGames,
  createGame,
  type GameT,
} from "@/actions/games";
import { toast } from "sonner";

interface UseGamesState {
  games: GameT[];
  loading: boolean;
}

export function useGames() {
  const [state, setState] = useState<UseGamesState>({
    games: [],
    loading: true,
  });

  const loadGames = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const result = await fetchGames();
    if (result.error) {
      toast.error(result.message);
    }
    setState({
      games: result.error ? [] : result.data,
      loading: false,
    });
  }, []);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const handleCreate = useCallback(
    async (slug: string, name: string, gameType: string, imageUrl?: string) => {
      const result = await createGame(slug, name, gameType, imageUrl);
      if (result.error) {
        toast.error(result.message);
        return false;
      }

      toast.success("Game created successfully");
      await loadGames();
      return true;
    },
    [loadGames]
  );

  return {
    ...state,
    handleCreate,
    refresh: loadGames,
  };
}
