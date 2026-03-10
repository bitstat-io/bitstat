import Link from "next/link";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

const quickStart = [
  {
    title: "1. Create your game",
    body: "Pick a lowercase slug, a public-facing name, and an optional game type. The dashboard stores metadata through owner-authenticated routes.",
    href: "/dashboard/games",
    cta: "Open Games",
  },
  {
    title: "2. Upload cover art",
    body: "Artwork is uploaded to Supabase Storage by the dashboard, then the resulting public URL is saved as cover_image_url on the game.",
    href: "/dashboard/games",
    cta: "Manage artwork",
  },
  {
    title: "3. Create the right API keys",
    body: "Use ingest keys for writing events. Use read or admin keys for stats, scoring reads, and secured operational endpoints.",
    href: "/dashboard/api",
    cta: "Manage keys",
  },
  {
    title: "4. Configure scoring",
    body: "Scoring is applied during ingest. Rules multiply numeric event_properties and can be versioned, activated, or replaced per game.",
    href: "/dashboard/scoring",
    cta: "Open scoring",
  },
  {
    title: "5. Publish dev or prod",
    body: "Leaderboards only become public after you publish a game in the selected environment. Dev and prod publication are separate.",
    href: "/dashboard/games",
    cta: "Publish game",
  },
  {
    title: "6. Send events and inspect ranking",
    body: "Post batches to /v1/events/batch with an ingest key, then verify scores from the public leaderboard page in this dashboard.",
    href: "/dashboard/leaderboards",
    cta: "View leaderboards",
  },
];

const authRows = [
  {
    auth: "Public",
    header: "No auth",
    endpoints: "GET /v1/health, GET /v1/games, public leaderboards",
    useCase: "Client-facing discovery and ranking reads",
  },
  {
    auth: "Owner dashboard",
    header: "Authorization: Bearer <Supabase access token>",
    endpoints:
      "GET/POST/PUT /v1/dashboard/games, game publish, game update, API key management, scoring routes",
    useCase: "Authenticated owner actions from the developers app",
  },
  {
    auth: "API key",
    header: "X-API-Key: <key> or Authorization: Bearer <key>",
    endpoints:
      "POST /v1/events/batch, GET /v1/games/:slug/stats, scoring reads/writes, GET /v1/dashboard/overview",
    useCase: "Game-server or secure operational access",
  },
];

const scopeRows = [
  {
    scope: "ingest",
    access: "POST /v1/events/batch",
    note: "Required for event ingestion. A valid key without ingest scope will return 403.",
  },
  {
    scope: "read",
    access: "GET stats, GET scoring rules, GET scoring versions, GET /v1/dashboard/overview",
    note: "Use for secure reads without allowing writes.",
  },
  {
    scope: "admin",
    access: "All read routes plus scoring create/replace/activate/deactivate",
    note: "Use sparingly. This is the mutating operational scope.",
  },
];

const eventRows = [
  ["user_id", "Yes", "Stable player identifier used in stats and leaderboards.", '"player_17"'],
  ["session_id", "Yes", "Session identifier for grouping play sessions.", '"session_20260310_1"'],
  ["client_ts", "Yes", "Unix timestamp in seconds.", "1773082744"],
  ["category", "Yes", "Lowercase 2-50 chars matching ^[a-z0-9_-]{2,50}$.", '"combat"'],
  ["event_id", "Yes", "Specific event name inside the category.", '"match_complete"'],
  ["event_properties", "Yes", "JSON object. Numeric fields here are what scoring can multiply.", '{ "kills": 12 }'],
  ["v", "No", "Optional schema/app version.", "1"],
  ["game_type", "No", "Optional metadata such as fps or moba.", '"fps"'],
  ["platform", "No", "One of pc, console, mobile.", '"pc"'],
  ["region", "No", "One of na, eu, apac, latam.", '"na"'],
];

const commonMistakes = [
  "Using an API key without ingest scope for /v1/events/batch. The backend returns 403 even if the key is otherwise valid.",
  "Sending region values outside na, eu, apac, or latam. Invalid values are rejected during schema validation.",
  "Expecting the scoring system to read arbitrary text fields. Only numeric values in event_properties contribute to score.",
  "Publishing without a cover image. The owner publish route blocks this until cover_image_url is set.",
  "Mixing dev and prod. API keys are environment-scoped and public leaderboards are published separately per environment.",
  "Using uppercase or spaced category names. Categories must stay lowercase and slug-like.",
  "Assuming the dashboard overview endpoint is owner-JWT based. The current backend overview route is API-key scoped.",
];

const ingestExample = `{
  "events": [
    {
      "user_id": "player_42",
      "session_id": "session_20260310_1",
      "client_ts": 1773082744,
      "v": 1,
      "category": "combat",
      "event_id": "match_complete",
      "game_type": "fps",
      "platform": "pc",
      "region": "na",
      "event_properties": {
        "kills": 18,
        "damage": 2410,
        "assists": 6,
        "headshots": 4,
        "wins": 1,
        "mvp": 1
      }
    }
  ]
}`;

const scoringExample = `{
  "weights": {
    "default": {
      "score": 1
    },
    "category": {
      "combat": {
        "kills": 10,
        "damage": 0.02,
        "assists": 4,
        "headshots": 3
      },
      "objective": {
        "captures": 20
      }
    },
    "event": {
      "match_complete": {
        "mvp": 40,
        "wins": 80
      }
    }
  }
}`;

const leaderboardRules = [
  "Prod public leaderboard: GET /v1/games/:gameSlug/leaderboards",
  "Dev public leaderboard: GET /v1/games/dev/:gameSlug/leaderboards",
  "Supported windows: all, 1d, 7d, 30d",
  "Use limit=1..100 depending on how many ranks you want returned",
  "If the game is not published in that environment, public reads will not behave the way you expect",
];

export default function DashboardDocsPage() {
  return (
    <div className="flex flex-col gap-6 px-4 py-4 md:px-6 md:py-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary">BitStat Docs</Badge>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Developer Guide
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              This page is the operational guide for integrating a game with
              BitStat from the developers dashboard. It is based on the current
              backend contract in this repo: owner JWT for dashboard actions,
              API keys for ingest and secure reads, and public leaderboards only
              after publish.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/games">Games</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/api">API Keys</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/scoring">Scoring</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/leaderboards">Leaderboards</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quickStart.map((step) => (
          <Card key={step.title}>
            <CardHeader>
              <CardTitle className="text-base">{step.title}</CardTitle>
              <CardDescription>{step.body}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link href={step.href}>{step.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Auth model</CardTitle>
            <CardDescription>
              BitStat has three access modes. Confusing these is the fastest
              way to get 401, 403, or unexpected empty results.
            </CardDescription>
          </CardHeader>
          <CardContent className="rounded-md border p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mode</TableHead>
                  <TableHead>Header</TableHead>
                  <TableHead>Used for</TableHead>
                  <TableHead>Typical endpoints</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {authRows.map((row) => (
                  <TableRow key={row.auth}>
                    <TableCell className="font-medium">{row.auth}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {row.header}
                    </TableCell>
                    <TableCell>{row.useCase}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.endpoints}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scope cheat sheet</CardTitle>
            <CardDescription>
              API keys are not interchangeable. Scope is enforced per route.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {scopeRows.map((row) => (
              <div key={row.scope} className="rounded-xl border p-4">
                <div className="flex items-center gap-2">
                  <Badge>{row.scope}</Badge>
                  <p className="font-medium">{row.access}</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{row.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Ingest contract</CardTitle>
            <CardDescription>
              Events are posted to <span className="font-mono">POST /v1/events/batch</span>.
              The batch route requires an API key with <span className="font-mono">ingest</span> scope.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border bg-muted/20 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Example request body
              </p>
              <pre className="overflow-auto text-xs">{ingestExample}</pre>
            </div>
            <div className="rounded-md border p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Meaning</TableHead>
                    <TableHead>Example</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventRows.map(([field, required, meaning, example]) => (
                    <TableRow key={field}>
                      <TableCell className="font-mono text-xs">{field}</TableCell>
                      <TableCell>{required}</TableCell>
                      <TableCell>{meaning}</TableCell>
                      <TableCell className="font-mono text-xs">{example}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How scoring actually works</CardTitle>
            <CardDescription>
              The scoring engine is simple on purpose. It only multiplies
              numeric fields you send in <span className="font-mono">event_properties</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-xl border p-4">
              <p className="font-medium">Evaluation order</p>
              <p className="mt-2 text-muted-foreground">
                <span className="font-mono">event</span> overrides{" "}
                <span className="font-mono">category</span>, which overrides{" "}
                <span className="font-mono">default</span>.
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="font-medium">What the client must send</p>
              <p className="mt-2 text-muted-foreground">
                If your rules mention <span className="font-mono">kills</span>,{" "}
                <span className="font-mono">damage</span>,{" "}
                <span className="font-mono">wins</span>, or{" "}
                <span className="font-mono">captures</span>, those exact keys
                must appear as numbers in the event payload.
              </p>
            </div>
            <div className="rounded-xl border bg-muted/20 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Example rule payload
              </p>
              <pre className="overflow-auto text-xs">{scoringExample}</pre>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Publishing and visibility</CardTitle>
            <CardDescription>
              Dev and prod are separate publish targets. Being created is not
              the same as being public.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-xl border p-4">
              A game can exist privately in the owner dashboard without being
              publicly queryable.
            </div>
            <div className="rounded-xl border p-4">
              The owner publish route requires a cover image. The dashboard
              therefore uploads artwork first, stores{" "}
              <span className="font-mono">cover_image_url</span>, and only then
              allows publish.
            </div>
            <div className="rounded-xl border p-4">
              Dev and prod publish state are stored independently. You can test
              privately in dev without exposing prod.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leaderboards</CardTitle>
            <CardDescription>
              Public ranking is read by game slug and environment, not by owner
              identity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboardRules.map((rule) => (
              <div key={rule} className="rounded-xl border p-4 text-sm">
                {rule}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Common mistakes</CardTitle>
          <CardDescription>
            These are the errors most likely to block integration even when the
            app and dashboard look correct.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {commonMistakes.map((item) => (
            <div key={item} className="rounded-xl border p-4 text-sm">
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
