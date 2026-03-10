"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useLiveOverview } from "@/hooks/use-live-overview";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart";
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
  IconActivityHeartbeat,
  IconBolt,
  IconDeviceGamepad2,
  IconKey,
  IconLoader2,
  IconPlayerPause,
  IconRefresh,
  IconSettingsAutomation,
  IconTargetArrow,
  IconWaveSine,
} from "@tabler/icons-react";

const RANGE_OPTIONS = [
  { label: "Last 5 minutes", value: "5m" },
  { label: "Last hour", value: "1h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
] as const;

const METRIC_OPTIONS = [
  { label: "Events", value: "events" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Errors", value: "errors" },
  { label: "Matches", value: "matches" },
  { label: "Sessions", value: "sessions" },
  { label: "Purchases", value: "purchases" },
  { label: "IAP", value: "iap" },
] as const;

const chartConfig = {
  events: { label: "Events", color: "hsl(195 95% 52%)" },
  accepted: { label: "Accepted", color: "hsl(142 72% 46%)" },
  rejected: { label: "Rejected", color: "hsl(32 95% 44%)" },
  errors: { label: "Errors", color: "hsl(0 84% 60%)" },
  matches: { label: "Matches", color: "hsl(280 65% 60%)" },
  sessions: { label: "Sessions", color: "hsl(215 90% 58%)" },
  purchases: { label: "Purchases", color: "hsl(30 90% 55%)" },
  iap: { label: "IAP", color: "hsl(158 64% 45%)" },
} satisfies ChartConfig;

function buildChartData(
  traffic: Array<{
    ts: string;
    events: number;
    accepted: number;
    rejected: number;
    errors: number;
    matches: number;
    sessions: number;
    purchases: number;
    iap: number;
  }>,
  range: "5m" | "1h" | "24h" | "7d",
) {
  const smoothedTraffic =
    range === "5m" ? bucketTraffic(traffic, 15_000) : traffic;

  return smoothedTraffic.map((point) => ({
    ...point,
    label: new Date(point.ts).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: range === "24h" || range === "7d" ? undefined : "numeric",
      minute: range === "5m" || range === "1h" ? "2-digit" : undefined,
      second: range === "5m" ? "2-digit" : undefined,
    }),
  }));
}

function bucketTraffic(
  traffic: Array<{
    ts: string;
    events: number;
    accepted: number;
    rejected: number;
    errors: number;
    matches: number;
    sessions: number;
    purchases: number;
    iap: number;
  }>,
  bucketMs: number,
) {
  const buckets = new Map<
    number,
    {
      ts: string;
      events: number;
      accepted: number;
      rejected: number;
      errors: number;
      matches: number;
      sessions: number;
      purchases: number;
      iap: number;
      count: number;
    }
  >();

  for (const point of traffic) {
    const bucketTs = Math.floor(new Date(point.ts).getTime() / bucketMs) * bucketMs;
    const existing = buckets.get(bucketTs);

    if (existing) {
      existing.events += point.events;
      existing.accepted += point.accepted;
      existing.rejected += point.rejected;
      existing.errors += point.errors;
      existing.matches += point.matches;
      existing.sessions += point.sessions;
      existing.purchases += point.purchases;
      existing.iap += point.iap;
      existing.count += 1;
      continue;
    }

    buckets.set(bucketTs, {
      ts: new Date(bucketTs).toISOString(),
      events: point.events,
      accepted: point.accepted,
      rejected: point.rejected,
      errors: point.errors,
      matches: point.matches,
      sessions: point.sessions,
      purchases: point.purchases,
      iap: point.iap,
      count: 1,
    });
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([, bucket]) => ({
      ts: bucket.ts,
      events: bucket.events,
      accepted: bucket.accepted,
      rejected: bucket.rejected,
      errors: bucket.errors,
      matches: bucket.matches,
      sessions: bucket.sessions,
      purchases: bucket.purchases,
      iap: bucket.iap,
    }));
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function formatCompact(value: number) {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat(undefined, {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000 ? 1 : 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(value > 0 && value < 0.1 ? 2 : 1)}%`;
}

function hasAnyScope(scopes: string[], required: string[]) {
  return required.some((scope) => scopes.includes(scope));
}

export default function Dashboard() {
  const [selectedMetric, setSelectedMetric] =
    useState<(typeof METRIC_OPTIONS)[number]["value"]>("events");
  const {
    games,
    selectedGame,
    selectedGameSlug,
    env,
    range,
    overview,
    activeKeys,
    scoringRule,
    scoringVersions,
    loadingGames,
    loadingOverview,
    loadingSidebarData,
    live,
    selectGame,
    setEnv,
    setRange,
    toggleLive,
    refresh,
  } = useLiveOverview();

  const chartData = useMemo(
    () => buildChartData(overview?.traffic ?? [], range),
    [overview?.traffic, range],
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
            <CardTitle>Start with your first game</CardTitle>
            <CardDescription>
              Create a game, issue an ingest key, and start sending events
              before the live dashboard becomes useful.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/games">Create a game</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeIngestKey = activeKeys.some((key) =>
    hasAnyScope(key.scopes, ["ingest"]),
  );
  const activeReadKey = activeKeys.some((key) =>
    hasAnyScope(key.scopes, ["read", "admin"]),
  );

  const readinessItems = [
    {
      label: "Cover image uploaded",
      done: Boolean(selectedGame?.cover_image_url),
      hint: selectedGame?.cover_image_url
        ? "Ready for publish and public listing."
        : "Upload artwork before publishing.",
    },
    {
      label: "Publish state",
      done:
        env === "prod"
          ? Boolean(selectedGame?.is_published_prod)
          : Boolean(selectedGame?.is_published_dev),
      hint:
        env === "prod"
          ? selectedGame?.is_published_prod
            ? "Live in production."
            : "Still private in prod."
          : selectedGame?.is_published_dev
            ? "Live in development."
            : "Still private in dev.",
    },
    {
      label: "Ingest key available",
      done: activeIngestKey,
      hint: activeIngestKey
        ? "Event writes can authenticate."
        : "Create at least one ingest key.",
    },
    {
      label: "Read/admin key available",
      done: activeReadKey,
      hint: activeReadKey
        ? "Operational reads are covered."
        : "Create a read or admin key.",
    },
    {
      label: "Scoring configured",
      done: Boolean(scoringRule?.active),
      hint: scoringRule?.active
        ? `Active version v${scoringRule.version}.`
        : "No active scoring rule yet.",
    },
  ];

  const summaryCards = overview
    ? [
        {
          label: "Events",
          value: formatCompact(overview.summary.events),
          detail: `${formatCompact(overview.summary.eventsPerSec)}/sec avg over range`,
          icon: IconWaveSine,
        },
        {
          label: "Accepted",
          value: formatCompact(overview.summary.accepted),
          detail: `${formatPercent(overview.summary.rejectRate)} reject rate`,
          icon: IconBolt,
        },
        {
          label: "Errors",
          value: formatCompact(overview.summary.errors),
          detail: `${formatPercent(overview.summary.errorRate)} error rate`,
          icon: IconActivityHeartbeat,
        },
        {
          label: "Unique players",
          value: formatCompact(overview.summary.uniquePlayers),
          detail: `${formatCompact(overview.summary.sessions)} sessions`,
          icon: IconTargetArrow,
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6 px-4 py-4 md:px-6 md:py-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Live Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time telemetry for a single owned game, powered by the new
            owner-safe overview and stream endpoints.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="space-y-2">
            <Label htmlFor="overview-game">Game</Label>
            <Select value={selectedGameSlug} onValueChange={selectGame}>
              <SelectTrigger id="overview-game" className="w-[220px]">
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
          <div className="space-y-2">
            <Label htmlFor="overview-env">Environment</Label>
            <Select
              value={env}
              onValueChange={(value) => void setEnv(value as "dev" | "prod")}
            >
              <SelectTrigger id="overview-env" className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prod">Prod</SelectItem>
                <SelectItem value="dev">Dev</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="overview-range">Range</Label>
            <Select
              value={range}
              onValueChange={(value) =>
                void setRange(value as "5m" | "1h" | "24h" | "7d")
              }
            >
              <SelectTrigger id="overview-range" className="w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RANGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant={live ? "default" : "outline"}
              onClick={toggleLive}
              className="self-end"
            >
              {live ? (
                <IconBolt className="size-4" />
              ) : (
                <IconPlayerPause className="size-4" />
              )}
              {live ? "Live" : "Paused"}
            </Button>
            <Button
              variant="outline"
              onClick={() => void refresh()}
              className="self-end"
            >
              <IconRefresh className="size-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {overview ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <CardDescription>{card.label}</CardDescription>
                  <CardTitle className="text-3xl">{card.value}</CardTitle>
                </div>
                <div className="rounded-md border bg-muted/30 p-2">
                  <card.icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{card.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <CardTitle>Traffic</CardTitle>
              <CardDescription>
                {overview?.updatedAt
                  ? `Last updated ${formatDateTime(overview.updatedAt)}`
                  : "Waiting for telemetry"}
              </CardDescription>
            </div>
            <div className="w-full max-w-[180px] space-y-2">
              <Label htmlFor="overview-metric">Metric</Label>
              <Select
                value={selectedMetric}
                onValueChange={(value) =>
                  setSelectedMetric(
                    value as (typeof METRIC_OPTIONS)[number]["value"],
                  )
                }
              >
                <SelectTrigger id="overview-metric">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METRIC_OPTIONS.map((metric) => (
                    <SelectItem key={metric.value} value={metric.value}>
                      {metric.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loadingOverview ? (
              <div className="flex items-center justify-center py-16">
                <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : !overview || chartData.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                No dashboard traffic yet for this game and environment.
              </div>
            ) : (
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[360px] w-full"
              >
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id={`fill-${selectedMetric}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={`var(--color-${selectedMetric})`}
                        stopOpacity={0.9}
                      />
                      <stop
                        offset="95%"
                        stopColor={`var(--color-${selectedMetric})`}
                        stopOpacity={0.08}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    minTickGap={28}
                  />
                  <YAxis tickLine={false} axisLine={false} width={48} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke={`var(--color-${selectedMetric})`}
                    fill={`url(#fill-${selectedMetric})`}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Game focus</CardTitle>
              <CardDescription>
                Current owner scope for telemetry and operational actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedGame ? (
                <div className="space-y-4">
                  <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
                    {selectedGame.cover_image_url ? (
                      <Image
                        src={selectedGame.cover_image_url}
                        alt={selectedGame.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <IconDeviceGamepad2 className="size-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">{selectedGame.name}</p>
                      <Badge variant="secondary">
                        {selectedGame.game_type ?? "Unspecified"}
                      </Badge>
                    </div>
                    <p className="font-mono text-sm text-muted-foreground">
                      {selectedGame.slug}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={env === "prod" ? "default" : "outline"}>
                      Prod
                    </Badge>
                    <Badge variant={env === "dev" ? "default" : "outline"}>
                      Dev
                    </Badge>
                    <Badge variant={live ? "default" : "outline"}>
                      {live ? "Streaming" : "Manual"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link href={`/dashboard/games/${selectedGame.slug}`}>
                        Open game
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/dashboard/api">Manage keys</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/dashboard/players">Inspect players</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a game to inspect its live overview.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational readiness</CardTitle>
              <CardDescription>
                Checks that still matter even with live telemetry enabled.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingSidebarData ? (
                <div className="flex items-center justify-center py-12">
                  <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                readinessItems.map((item) => (
                  <div key={item.label} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">{item.label}</p>
                      <Badge variant={item.done ? "default" : "outline"}>
                        {item.done ? "Ready" : "Missing"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.hint}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent events</CardTitle>
            <CardDescription>
              Latest accepted events seen in the selected owner scope.
            </CardDescription>
          </CardHeader>
          <CardContent className="rounded-md border p-0">
            {loadingOverview ? (
              <div className="flex items-center justify-center py-16">
                <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : !overview || overview.recentEvents.length === 0 ? (
              <div className="px-6 py-12 text-sm text-muted-foreground">
                No recent events recorded yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Region</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overview.recentEvents.map((event, index) => (
                    <TableRow key={`${event.ts}-${event.user_id}-${index}`}>
                      <TableCell>{formatDateTime(event.ts)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{event.event_id}</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {event.game_slug}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {event.user_id}
                      </TableCell>
                      <TableCell>{event.platform ?? "-"}</TableCell>
                      <TableCell>{event.region ?? "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Top players</CardTitle>
              <CardDescription>
                Highest scores inside the selected game scope.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingOverview ? (
                <div className="flex items-center justify-center py-12">
                  <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : !overview || overview.topPlayers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No ranked players available yet.
                </p>
              ) : (
                overview.topPlayers.map((player, index) => (
                  <div
                    key={`${player.user_id}-${index}`}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">#{index + 1}</p>
                      <p className="font-mono text-sm text-muted-foreground">
                        {player.user_id}
                      </p>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatCompact(player.score)}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rejected events</CardTitle>
              <CardDescription>
                Fast way to spot schema issues or client mistakes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingOverview ? (
                <div className="flex items-center justify-center py-12">
                  <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : !overview || overview.recentRejected.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No rejected events in this window.
                </p>
              ) : (
                overview.recentRejected.map((event, index) => (
                  <div
                    key={`${event.ts}-${event.reason}-${index}`}
                    className="rounded-lg border p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="outline">{event.reason}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(event.ts)}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <p>event: {event.event_id ?? "-"}</p>
                      <p>user: {event.user_id ?? "-"}</p>
                      <p>category: {event.category ?? "-"}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key and scoring snapshot</CardTitle>
              <CardDescription>
                Current security and scoring state for this game.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconKey className="size-4" />
                  <span className="text-xs">Active keys</span>
                </div>
                <p className="mt-2 text-xl font-semibold">{activeKeys.length}</p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconSettingsAutomation className="size-4" />
                  <span className="text-xs">Scoring</span>
                </div>
                <p className="mt-2 text-xl font-semibold">
                  {scoringRule?.active ? `v${scoringRule.version}` : "Off"}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconDeviceGamepad2 className="size-4" />
                  <span className="text-xs">Versions</span>
                </div>
                <p className="mt-2 text-xl font-semibold">
                  {scoringVersions.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
