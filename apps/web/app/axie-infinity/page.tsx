"use client";

import { AxieLeaderboardState } from "@workspace/ui/lib/types";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { IconLoader2 } from "@tabler/icons-react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

export default function AxieLeaderboard() {
  const ITEMS_PER_PAGE = 50;
  const [state, setState] = useState<AxieLeaderboardState>({
    data: [],
    loading: false,
    loadingMore: false,
    hasMore: true,
    offset: 0,
    total: null,
  });

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Initial data fetch
  const fetchData = async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      data: [],
      offset: 0,
      hasMore: true,
      total: null,
    }));

    try {
      const response = await fetch(
        `/api/axie-infinity?offset=0&limit=${ITEMS_PER_PAGE}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch leaderboard");
      }

      const items = result.data._items || [];
      const metadata = result.data._metadata;

      setState((prev) => ({
        ...prev,
        data: items,
        offset: ITEMS_PER_PAGE,
        hasMore: metadata?.hasNext || false,
        total: metadata?.total || null,
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        hasMore: false,
      }));
    }
  };

  // Load more data for pagination
  const loadMore = useCallback(async () => {
    if (state.loadingMore || !state.hasMore || state.loading) return;

    setState((prev) => ({ ...prev, loadingMore: true }));

    try {
      const response = await fetch(
        `/api/axie-infinity?offset=${state.offset}&limit=${ITEMS_PER_PAGE}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch more data: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch more data");
      }

      const newItems = result.data._items || [];
      const metadata = result.data._metadata;

      setState((prev) => ({
        ...prev,
        data: [...prev.data, ...newItems],
        offset: prev.offset + ITEMS_PER_PAGE,
        hasMore: metadata?.hasNext || false,
        total: metadata?.total || prev.total,
        loadingMore: false,
      }));
    } catch (error) {
      console.error("Error loading more data:", error);
      setState((prev) => ({
        ...prev,
        hasMore: false,
        loadingMore: false,
      }));
    }
  }, [state.offset, state.loadingMore, state.hasMore, state.loading]);

  // Trigger loadMore when the sentinel element is in view
  useEffect(() => {
    if (inView && state.hasMore && !state.loadingMore && !state.loading) {
      loadMore();
    }
  }, [inView, state.hasMore, state.loadingMore, state.loading, loadMore]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="border container mx-auto space-y-20 min-h-screen">
      <div className="animate-in fade-in duration-500">
        {/* Header */}

        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between ">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Games
            </Link>
            <Button
              onClick={fetchData}
              disabled={state.loading || state.loadingMore}
              variant="ghost"
              size="sm"
              className="hover:rotate-180 text-muted-foreground transition-transform duration-300"
            >
              {state.loading ? (
                <IconLoader2 className="animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex flex-col justify-center items-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground text-balance">
              Axie Infinity Leaderboard
            </h1>

            <p className="text-muted-foreground text-pretty">
              Axie Infinity is a virtual world filled with cute, formidable
              creatures known as Axies.
            </p>
            <div className="flex items-center text-xs font-mono text-muted-foreground pt-4">
              {state.data.length > 0 && (
                <span>
                  Showing {state.data.length} players{" "}
                  {state.total &&
                    `of ${state.total.toLocaleString()} total`}{" "}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Full Leaderboard */}
        <Card className="overflow-hidden p-0 rounded-none border-0 bg-transparent">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-t border-border sticky top-0 z-10">
                  <tr className="text-left">
                    <th className="px-6 py-3 text-sm font-medium text-muted-foreground">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-muted-foreground">
                      Player
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-muted-foreground">
                      VSTAR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {state.loading && state.data.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8">
                        <IconLoader2 className="animate-spin mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">
                          Loading leaderboard...
                        </p>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {state.data.map((player, index) => (
                        <tr
                          key={`${player.userID}-${index}`}
                          className={`border-b border-border hover:bg-muted/50 transition-all duration-200 `}
                          style={{
                            animationDelay: `${Math.min(index, 20) * 50}ms`,
                          }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {player.topRank === 1 ? (
                                <span>🥇</span>
                              ) : player.topRank === 2 ? (
                                <span>🥈</span>
                              ) : player.topRank === 3 ? (
                                <span>🥉</span>
                              ) : (
                                <span className="pl-1">{player.topRank}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
                              {player.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
                              {player.vstar.toLocaleString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>

              {/* Loading indicator and infinite scroll trigger */}
              {!state.loading && (
                <div ref={loadMoreRef} className="py-8 text-center">
                  {state.loadingMore && (
                    <div className="flex items-center justify-center gap-2">
                      <IconLoader2 className="animate-spin h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Loading more players...
                      </span>
                    </div>
                  )}
                  {!state.hasMore && state.data.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      You've reached the end of the leaderboard
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
