"use client";

import { useApiKeys } from "@/hooks/use-api-keys";
import { PageHeader } from "@/components/api/page-header";
import { KeyRevealCard } from "@/components/api/key-reveal-card";
import { CreateKeyDialog } from "@/components/api/create-key-dialog";
import { KeyRow } from "@/components/api/key-row";
import { EmptyState } from "@/components/api/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Label } from "@workspace/ui/components/label";
import { IconLoader2 } from "@tabler/icons-react";

export default function DashboardAPIPage() {
  const {
    games,
    selectedGame,
    loadingGames,
    loadingKeys,
    keys,
    revealedKey,
    revoking,
    selectGame,
    handleCreate,
    handleRevoke,
  } = useApiKeys();

  const selectedGameName =
    games.find((g) => g.slug === selectedGame)?.name ?? "";

  return (
    <div className="flex flex-col gap-6 px-4 md:px-6 py-4 md:py-6">
      <PageHeader />

      {/* Game Selector + Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="game-select" className="text-sm font-medium shrink-0">
            Game
          </Label>
          <Select
            value={selectedGame}
            onValueChange={selectGame}
            disabled={loadingGames}
          >
            <SelectTrigger className="w-[200px]" id="game-select">
              <SelectValue
                placeholder={loadingGames ? "Loading..." : "Select a game"}
              />
            </SelectTrigger>
            <SelectContent>
              {games.map((game) => (
                <SelectItem key={game.slug} value={game.slug}>
                  {game.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CreateKeyDialog
          gameName={selectedGameName}
          disabled={!selectedGame || loadingGames}
          onCreate={handleCreate}
        />
      </div>

      {/* Revealed Key */}
      {revealedKey && <KeyRevealCard apiKey={revealedKey} />}

      {/* Keys Table */}
      {!selectedGame ? (
        <EmptyState
          message={
            loadingGames
              ? "Loading games..."
              : games.length === 0
                ? "No games found. Create a game first to manage API keys."
                : "Select a game to view its API keys."
          }
        />
      ) : loadingKeys ? (
        <div className="flex items-center justify-center py-12">
          <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : keys.length === 0 ? (
        <EmptyState message="No API keys yet. Create one to get started." />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Prefix</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((apiKey) => (
                <KeyRow
                  key={apiKey.id}
                  apiKey={apiKey}
                  revoking={revoking}
                  onRevoke={handleRevoke}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
