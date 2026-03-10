"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  IconLoader2,
  IconPlayerPause,
  IconPlayerPlay,
  IconRefresh,
  IconTerminal2,
} from "@tabler/icons-react";
import { toast } from "sonner";

type Region = "na" | "eu" | "apac" | "latam";
type Platform = "pc" | "console" | "mobile";

type BatchLog = {
  key: string;
  batch: number;
  at: string;
  status: "ok" | "error";
  httpStatus: number;
  accepted: number;
  rejected: number;
  errors: number;
  message: string;
};

const REGION_OPTIONS: Region[] = ["na", "eu", "apac", "latam"];
const PLATFORM_OPTIONS: Platform[] = ["pc", "console", "mobile"];

function clampRate(value: string) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(Math.max(number, 0), 1);
}

function toggleValue<T extends string>(items: T[], value: T) {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}

function createLogKey() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function DashboardTestPage() {
  const [apiKey, setApiKey] = useState("");
  const [batchSize, setBatchSize] = useState("25");
  const [playerCount, setPlayerCount] = useState("200");
  const [delayMs, setDelayMs] = useState("500");
  const [sessionStartRate, setSessionStartRate] = useState("0.1");
  const [matchCompleteRate, setMatchCompleteRate] = useState("0.15");
  const [objectiveRate, setObjectiveRate] = useState("0.2");
  const [regions, setRegions] = useState<Region[]>(["na", "eu", "apac", "latam"]);
  const [platforms, setPlatforms] = useState<Platform[]>(["pc", "console"]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [logs, setLogs] = useState<BatchLog[]>([]);
  const [batchNumber, setBatchNumber] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    runningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const totals = useMemo(
    () =>
      logs.reduce(
        (acc, log) => {
          acc.accepted += log.accepted;
          acc.rejected += log.rejected;
          acc.errors += log.errors;
          return acc;
        },
        { accepted: 0, rejected: 0, errors: 0 },
      ),
    [logs],
  );

  async function sendBatch() {
    setIsSending(true);

    const response = await fetch("/api/test-generator/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey,
        batchSize: Number(batchSize),
        playerCount: Number(playerCount),
        regions,
        platforms,
        sessionStartRate: clampRate(sessionStartRate),
        matchCompleteRate: clampRate(matchCompleteRate),
        objectiveRate: clampRate(objectiveRate),
      }),
    });

    const body = (await response.json().catch(() => ({}))) as {
      response?: { accepted?: number; rejected?: number; errors?: number; error?: { message?: string } };
      error?: { message?: string };
      raw?: string;
    };

    setBatchNumber((current) => current + 1);

    const accepted = Number(body.response?.accepted ?? 0);
    const rejected = Number(body.response?.rejected ?? 0);
    const errors = Number(body.response?.errors ?? 0);
    const nextBatch = batchNumber + 1;
    const message =
      body.response?.error?.message ||
      body.error?.message ||
      body.raw ||
      (response.ok ? "Batch sent." : "Batch failed.");

    setLogs((current) => [
      {
        key: createLogKey(),
        batch: nextBatch,
        at: new Date().toLocaleTimeString(),
        status: response.ok ? "ok" : "error" as "ok" | "error",
        httpStatus: response.status,
        accepted,
        rejected,
        errors,
        message,
      },
      ...current,
    ].slice(0, 40));

    if (!response.ok) {
      toast.error(message);
    }

    setIsSending(false);

    if (runningRef.current) {
      timerRef.current = setTimeout(() => {
        void sendBatch();
      }, Math.max(Number(delayMs) || 0, 0));
    }
  }

  function handleStart() {
    if (!apiKey.trim()) {
      toast.error("API key is required.");
      return;
    }
    if (regions.length === 0) {
      toast.error("Select at least one region.");
      return;
    }
    if (platforms.length === 0) {
      toast.error("Select at least one platform.");
      return;
    }

    setIsRunning(true);
    void sendBatch();
  }

  function handleStop() {
    setIsRunning(false);
    runningRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function handleSingleBatch() {
    if (!apiKey.trim()) {
      toast.error("API key is required.");
      return;
    }
    void sendBatch();
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-4 md:px-6 md:py-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Ingest Simulator
        </h1>
        <p className="text-sm text-muted-foreground">
          Browser-controlled load testing for ingest. This rebuilds the Python
          generator inside the dashboard with editable API key and run settings.
        </p>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>How to use this safely</CardTitle>
          <CardDescription>
            This generator runs from the open browser tab. If you close or
            refresh this page, the loop stops. Keep this tab open while the
            test is running, and use another tab to watch the live dashboard or
            leaderboards update.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
        <CardHeader>
          <CardTitle>Simulator settings</CardTitle>
          <CardDescription>
            Configure the same FPS-style synthetic traffic profile without
            touching the Python script. Batch size is capped at 500 by the
            backend.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="test-api-key">API key</Label>
              <Input
                id="test-api-key"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="Paste an ingest key"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="test-batch-size">Batch size</Label>
                <Input
                  id="test-batch-size"
                  type="number"
                  value={batchSize}
                  onChange={(event) => setBatchSize(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Max 500 events per request.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-player-count">Players</Label>
                <Input
                  id="test-player-count"
                  type="number"
                  value={playerCount}
                  onChange={(event) => setPlayerCount(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-delay">Delay (ms)</Label>
                <Input
                  id="test-delay"
                  type="number"
                  value={delayMs}
                  onChange={(event) => setDelayMs(event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="test-session-rate">Session start rate</Label>
                <Input
                  id="test-session-rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={sessionStartRate}
                  onChange={(event) => setSessionStartRate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-match-rate">Match complete rate</Label>
                <Input
                  id="test-match-rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={matchCompleteRate}
                  onChange={(event) => setMatchCompleteRate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-objective-rate">Objective rate</Label>
                <Input
                  id="test-objective-rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={objectiveRate}
                  onChange={(event) => setObjectiveRate(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Regions</Label>
              <div className="flex flex-wrap gap-2">
                {REGION_OPTIONS.map((region) => (
                  <Button
                    key={region}
                    type="button"
                    variant={regions.includes(region) ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setRegions((current) => toggleValue(current, region))
                    }
                  >
                    {region}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORM_OPTIONS.map((platform) => (
                  <Button
                    key={platform}
                    type="button"
                    variant={platforms.includes(platform) ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setPlatforms((current) => toggleValue(current, platform))
                    }
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleStart} disabled={isRunning || isSending}>
                {isSending && isRunning ? (
                  <IconLoader2 className="size-4 animate-spin" />
                ) : (
                  <IconPlayerPlay className="size-4" />
                )}
                Start loop
              </Button>
              <Button
                variant="outline"
                onClick={handleStop}
                disabled={!isRunning && !isSending}
              >
                <IconPlayerPause className="size-4" />
                Stop
              </Button>
              <Button
                variant="outline"
                onClick={handleSingleBatch}
                disabled={isSending}
              >
                <IconTerminal2 className="size-4" />
                Send one batch
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setLogs([]);
                  setBatchNumber(0);
                }}
                disabled={isSending}
              >
                <IconRefresh className="size-4" />
                Clear log
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Run snapshot</CardTitle>
              <CardDescription>
                Live totals for the current browser-driven test run.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="mt-2 text-lg font-semibold">
                  {isRunning ? "Running" : "Idle"}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Batches sent</p>
                <p className="mt-2 text-lg font-semibold">{batchNumber}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Accepted</p>
                <p className="mt-2 text-lg font-semibold">{totals.accepted}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Rejected</p>
                <p className="mt-2 text-lg font-semibold">{totals.rejected}</p>
              </div>
              <div className="rounded-lg border p-3 sm:col-span-2">
                <p className="text-xs text-muted-foreground">Errors</p>
                <p className="mt-2 text-lg font-semibold">{totals.errors}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile notes</CardTitle>
              <CardDescription>
                What this test emits on each batch.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-lg border p-3">
                Combat events emit `kills`, `damage`, `assists`, and `headshots`.
              </div>
              <div className="rounded-lg border p-3">
                Objective events emit `captures`.
              </div>
              <div className="rounded-lg border p-3">
                Match complete emits `wins` and `mvp`.
              </div>
              <div className="rounded-lg border p-3">
                Session metrics only move when `session_start` is emitted.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batch log</CardTitle>
          <CardDescription>
            Response history from the test route. Newest batch appears first.
          </CardDescription>
        </CardHeader>
        <CardContent className="rounded-md border p-0">
          {logs.length === 0 ? (
            <div className="px-6 py-12 text-sm text-muted-foreground">
              No test batches sent yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>HTTP</TableHead>
                  <TableHead>Accepted</TableHead>
                  <TableHead>Rejected</TableHead>
                  <TableHead>Errors</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.key}>
                    <TableCell className="font-medium">#{log.batch}</TableCell>
                    <TableCell>{log.at}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === "ok" ? "default" : "outline"}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.httpStatus}</TableCell>
                    <TableCell>{log.accepted}</TableCell>
                    <TableCell>{log.rejected}</TableCell>
                    <TableCell>{log.errors}</TableCell>
                    <TableCell className="max-w-[380px] truncate">
                      {log.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
