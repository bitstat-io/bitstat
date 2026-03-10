"use client";

import { useMemo } from "react";
import { useScoring } from "@/hooks/use-scoring";
import { type ScoringRulePayloadT } from "@/actions/scoring";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  IconBolt,
  IconLoader2,
  IconPlayerPause,
  IconRestore,
  IconSparkles,
} from "@tabler/icons-react";

const FPS_TEMPLATES: Array<{
  name: string;
  description: string;
  payload: ScoringRulePayloadT;
  sampleEvent: Record<string, unknown>;
}> = [
  {
    name: "Arcade FPS",
    description: "Fast, aggressive scoring with heavy reward for combat output.",
    payload: {
      weights: {
        default: { score: 1 },
        category: {
          combat: {
            kills: 10,
            assists: 4,
            headshots: 3,
            damage: 0.02,
          },
          objective: {
            captures: 20,
          },
        },
        event: {
          match_complete: {
            wins: 80,
            mvp: 40,
          },
        },
      },
    },
    sampleEvent: {
      category: "combat",
      event_id: "match_complete",
      event_properties: {
        kills: 12,
        assists: 5,
        headshots: 3,
        damage: 1840,
        wins: 1,
      },
    },
  },
  {
    name: "Tactical FPS",
    description: "Balances fragging with round wins and objective execution.",
    payload: {
      weights: {
        default: { score: 1 },
        category: {
          combat: {
            kills: 8,
            assists: 3,
            first_bloods: 8,
          },
          objective: {
            plants: 20,
            defuses: 20,
            captures: 15,
          },
          round: {
            round_wins: 18,
          },
        },
        event: {
          match_complete: {
            wins: 100,
            mvp: 50,
          },
        },
      },
    },
    sampleEvent: {
      category: "objective",
      event_id: "match_complete",
      event_properties: {
        kills: 18,
        assists: 6,
        plants: 2,
        defuses: 1,
        round_wins: 13,
        wins: 1,
      },
    },
  },
  {
    name: "Battle Royale",
    description: "Prioritizes survival placement, kills, and final victory.",
    payload: {
      weights: {
        default: { score: 1 },
        category: {
          combat: {
            kills: 12,
            knockdowns: 5,
            assists: 4,
          },
          survival: {
            placement_points: 2,
            revives: 8,
          },
        },
        event: {
          match_complete: {
            wins: 150,
            top_10: 20,
          },
        },
      },
    },
    sampleEvent: {
      category: "survival",
      event_id: "match_complete",
      event_properties: {
        kills: 7,
        knockdowns: 9,
        revives: 1,
        placement_points: 35,
        top_10: 1,
        wins: 1,
      },
    },
  },
];

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function formatRule(value: ScoringRulePayloadT) {
  return JSON.stringify(value, null, 2);
}

function buildPreviewLines(payload: ScoringRulePayloadT | null) {
  if (!payload) return [];

  const lines: string[] = [];
  const defaults = payload.weights.default ?? {};
  const categories = payload.weights.category ?? {};
  const events = payload.weights.event ?? {};

  Object.entries(defaults).forEach(([metric, weight]) => {
    lines.push(`Default: ${metric} = ${weight}`);
  });

  Object.entries(categories).forEach(([category, metrics]) => {
    Object.entries(metrics).forEach(([metric, weight]) => {
      lines.push(`Category ${category}: ${metric} = ${weight}`);
    });
  });

  Object.entries(events).forEach(([eventId, metrics]) => {
    Object.entries(metrics).forEach(([metric, weight]) => {
      lines.push(`Event ${eventId}: ${metric} = ${weight}`);
    });
  });

  return lines.slice(0, 12);
}

export default function DashboardScoringPage() {
  const {
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
  } = useScoring();

  const parsedEditor = useMemo(() => {
    try {
      return JSON.parse(editorValue) as ScoringRulePayloadT;
    } catch {
      return null;
    }
  }, [editorValue]);

  const previewLines = useMemo(
    () => buildPreviewLines(parsedEditor),
    [parsedEditor]
  );

  if (loadingGames) {
    return (
      <div className="flex items-center justify-center py-16">
        <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="px-4 py-6 md:px-6">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Create a game before editing scoring</CardTitle>
            <CardDescription>
              Scoring rules are versioned per game. Start by creating a game in
              the Games page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-4 md:px-6 md:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Scoring Rules
          </h1>
          <p className="text-sm text-muted-foreground">
            Version and activate per-game score weights used during ingest.
          </p>
        </div>
        <div className="w-full max-w-xs space-y-2">
          <Label htmlFor="scoring-game">Game</Label>
          <Select value={selectedGameSlug} onValueChange={selectGame}>
            <SelectTrigger id="scoring-game">
              <SelectValue placeholder="Select a game" />
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Focused game</CardDescription>
            <CardTitle>{selectedGame?.name ?? "No game selected"}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active version</CardDescription>
            <CardTitle>{rule?.active ? `v${rule.version}` : "None"}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Stored versions</CardDescription>
            <CardTitle>{versions.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Status</CardDescription>
            <CardTitle>{rule?.active ? "Active" : "Inactive"}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>How scoring works</CardTitle>
            <CardDescription>
              Keep the rule model simple: the backend multiplies numeric event
              properties by the weights you define here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-2">
              <p className="font-medium">Evaluation order</p>
              <p className="text-muted-foreground">
                `event` overrides `category`, which overrides `default`.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">What the SDK must send</p>
              <p className="text-muted-foreground">
                Only numeric values inside `event_properties` can contribute to
                score. If you want to reward kills, plants, wins, or revives,
                the client must send those exact numeric fields.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Good FPS setup</p>
              <p className="text-muted-foreground">
                Reward both combat and objective play. Pure kill-only scoring
                usually creates a bad leaderboard for team shooters.
              </p>
            </div>
            <div className="rounded-lg border bg-muted/20 p-3">
              <p className="font-medium">Common metric mapping</p>
              <div className="mt-2 space-y-1 text-muted-foreground">
                <p>`kills` for fragging</p>
                <p>`assists` for support value</p>
                <p>`plants`, `defuses`, `captures` for objectives</p>
                <p>`wins` or `round_wins` for match outcome</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>FPS starter templates</CardTitle>
            <CardDescription>
              Load a baseline, then tune the numbers for your game’s pacing and
              objectives.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {FPS_TEMPLATES.map((template) => (
              <div key={template.name} className="rounded-xl border p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{template.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditorValue(formatRule(template.payload))}
                  >
                    Load template
                  </Button>
                </div>
                <div className="mt-3 rounded-lg border bg-muted/20 p-3">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Sample ingest event
                  </p>
                  <pre className="overflow-auto text-xs">
                    {JSON.stringify(template.sampleEvent, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Rule editor</CardTitle>
            <CardDescription>
              Edit raw JSON weights. Save a new version or replace the active
              rule set.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={editorValue}
              onChange={(event) => setEditorValue(event.target.value)}
              spellCheck={false}
              className="min-h-[420px] w-full rounded-xl border bg-muted/20 p-4 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={resetEditor}
                disabled={loadingRule || Boolean(savingMode) || deactivating}
              >
                <IconRestore className="size-4" />
                Reset to current
              </Button>
              <Button
                onClick={() => void handleSave("create")}
                disabled={loadingRule || Boolean(savingMode) || deactivating}
              >
                {savingMode === "create" ? (
                  <IconLoader2 className="size-4 animate-spin" />
                ) : (
                  <IconSparkles className="size-4" />
                )}
                Save new version
              </Button>
              <Button
                variant="outline"
                onClick={() => void handleSave("replace")}
                disabled={loadingRule || Boolean(savingMode) || deactivating}
              >
                {savingMode === "replace" ? (
                  <IconLoader2 className="size-4 animate-spin" />
                ) : (
                  <IconBolt className="size-4" />
                )}
                Replace active
              </Button>
              <Button
                variant="outline"
                onClick={() => void handleDeactivate()}
                disabled={loadingRule || Boolean(savingMode) || deactivating}
              >
                {deactivating ? (
                  <IconLoader2 className="size-4 animate-spin" />
                ) : (
                  <IconPlayerPause className="size-4" />
                )}
                Deactivate
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Editor preview</CardTitle>
              <CardDescription>
                A readable summary of what the current JSON means.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!parsedEditor ? (
                <p className="text-sm text-destructive">
                  JSON is currently invalid, so the preview cannot be generated.
                </p>
              ) : previewLines.length > 0 ? (
                <div className="space-y-3">
                  {previewLines.map((line) => (
                    <div
                      key={line}
                      className="rounded-lg border bg-muted/20 p-3 text-sm"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Add weights to `default`, `category`, or `event` to generate a
                  preview.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current stored payload</CardTitle>
              <CardDescription>
                The active version currently stored for{" "}
                {selectedGame?.name ?? "this game"}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRule ? (
                <div className="flex items-center justify-center py-12">
                  <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : rule ? (
                <div className="space-y-3">
                  <Badge>Version {rule.version}</Badge>
                  <pre className="max-h-[340px] overflow-auto rounded-xl border bg-muted/20 p-4 text-xs">
                    {JSON.stringify(rule.rules, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No active scoring rules yet. Save a template or your own JSON
                  to create the first version.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Version history</CardTitle>
          <CardDescription>
            Activate a previous version or inspect when each rule set changed.
          </CardDescription>
        </CardHeader>
        <CardContent className="rounded-md border p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No scoring versions saved yet.
                  </TableCell>
                </TableRow>
              ) : (
                versions.map((version) => (
                  <TableRow key={version.version}>
                    <TableCell className="font-medium">
                      v{version.version}
                    </TableCell>
                    <TableCell>
                      <Badge variant={version.active ? "default" : "outline"}>
                        {version.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(version.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={version.active || activatingVersion !== null}
                        onClick={() =>
                          void handleActivateVersion(version.version)
                        }
                      >
                        {activatingVersion === version.version && (
                          <IconLoader2 className="size-4 animate-spin" />
                        )}
                        Activate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
