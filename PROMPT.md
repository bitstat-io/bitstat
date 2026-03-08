<!-- Re-write the feature section when using this prompt -->

# Bitstat Feature Prompt Template

You are an expert Next.js / TypeScript developer working inside a Turborepo monorepo called **Bitstat** — a Web3 gaming analytics platform. Before writing any code, you MUST read the full system context below, then ask me clarifying questions. Do not begin implementation until I confirm your plan.

## System Context

### Stack

| Layer      | Technology                                    | Version         |
| ---------- | --------------------------------------------- | --------------- |
| Monorepo   | Turborepo + pnpm                              | 2.8.14 / 10.4.1 |
| Framework  | Next.js (App Router)                          | 16.1.6          |
| UI Library | React                                         | 19.2.4          |
| Language   | TypeScript (strict, noUncheckedIndexedAccess) | 5.9.3           |
| CSS        | Tailwind CSS v4 via @tailwindcss/postcss      | 4.1.11          |
| Components | Radix UI + shadcn/ui (New York style)         | latest          |
| Variants   | class-variance-authority (cva)                | 0.7.1           |
| Charts     | Recharts                                      | 2.15.4          |
| Validation | Zod                                           | 3.25+           |
| Theming    | next-themes (class strategy, OKLCH tokens)    | 0.4.6           |
| Icons      | Lucide React + @tabler/icons-react            | latest          |
| Animation  | framer-motion + gsap                          | latest          |
| HTTP       | axios (server-side)                           | latest          |
| Scroll     | react-intersection-observer                   | latest          |

### Monorepo Structure

```
/
├── apps/
│   ├── web/                          # Main gaming analytics portal (port 3000)
│   │   ├── app/
│   │   │   ├── layout.tsx            # Root layout: Providers + Header
│   │   │   ├── page.tsx              # Home: Hero + Games + Footer
│   │   │   ├── api/                  # Route Handlers
│   │   │   │   └── axie-infinity/route.ts
│   │   │   └── axie-infinity/page.tsx
│   │   ├── components/
│   │   │   ├── providers.tsx         # ThemeProvider ("use client")
│   │   │   ├── search-bar.tsx
│   │   │   └── sections/            # Page-level sections
│   │   │       ├── header.tsx
│   │   │       ├── hero.tsx
│   │   │       ├── games.tsx
│   │   │       └── footer.tsx
│   │   ├── lib/                     # App-specific utilities (empty)
│   │   └── hooks/                   # App-specific hooks (empty)
│   │
│   └── developers/                  # Developer / API docs portal (port 3001)
│       ├── app/
│       │   ├── layout.tsx           # Root layout: Providers (no global Header)
│       │   ├── page.tsx             # Landing page
│       │   └── dashboard/
│       │       ├── layout.tsx       # SidebarProvider + AppSidebar + SiteHeader
│       │       └── page.tsx         # Dashboard with charts
│       └── components/
│           ├── providers.tsx
│           ├── prism.tsx
│           ├── sections/
│           └── demo/
│
├── packages/
│   ├── ui/                          # Shared component library (@workspace/ui)
│   │   ├── src/
│   │   │   ├── components/          # shadcn/ui + custom (.tsx)
│   │   │   ├── hooks/               # Shared hooks (.ts)
│   │   │   ├── lib/
│   │   │   │   ├── utils.ts         # cn(), getPageTitle(), getBackgroundImage()
│   │   │   │   ├── types.ts         # Shared TypeScript types
│   │   │   │   └── games-data.tsx   # Static game catalog
│   │   │   └── styles/
│   │   │       └── globals.css      # Tailwind v4 imports, OKLCH theme tokens
│   │   └── postcss.config.mjs
│   ├── eslint-config/               # base.js, next.js, react-internal.js
│   └── typescript-config/           # base.json, nextjs.json, react-library.json
```

### Import Conventions — Follow Exactly

```tsx
// Shared UI components
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

// Shared utilities
import { cn } from "@workspace/ui/lib/utils";

// Shared types
import type { Game, NavItemsProps } from "@workspace/ui/lib/types";

// Shared hooks
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

// Shared styles (layout.tsx only)
import "@workspace/ui/globals.css";

// App-local imports
import Header from "@/components/sections/header";
import { Providers } from "@/components/providers";
```

Package exports map (packages/ui/package.json):

- `"./globals.css"` → `./src/styles/globals.css`
- `"./postcss.config"` → `./postcss.config.mjs`
- `"./lib/*"` → `./src/lib/*.ts`
- `"./components/*"` → `./src/components/*.tsx`
- `"./hooks/*"` → `./src/hooks/*.ts`

### Component Authoring Patterns

1. **shadcn/ui components**: function declarations (not arrow), `React.ComponentProps<"element">` for typing, `data-slot` attributes, `cn()` for class merging, **named exports** (not default).

2. **Page section components**: default exports, `"use client"` only when genuinely needed.

3. **Server Components are the default.** Only add `"use client"` when the component requires client-side interactivity.

4. **Providers**: `"use client"`, wraps `NextThemesProvider` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`, `enableColorScheme`.

5. **Layouts**: Always Server Components. Web app root layout includes `<Header />`; developers app does not.

### Styling Rules

- Tailwind v4 utility classes. No arbitrary values when a design token exists.
- Semantic color tokens: `text-foreground`, `bg-background`, `text-muted-foreground`, `bg-muted`, `text-primary`, `bg-primary`, `border-border`, etc.
- Dark mode via `.dark` class (next-themes). Use `dark:` variant for overrides.
- OKLCH color space for all theme tokens (defined in `globals.css` `:root` and `.dark`).
- Border radius via `--radius` CSS variable (0.65rem base).
- Always use `cn()` for conditional/merged classes.

### Existing API Route Pattern

Reference: `apps/web/app/api/axie-infinity/route.ts`

```tsx
import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  // ... parse params
  try {
    const response = await axios.get(EXTERNAL_URL, { headers, params });
    return NextResponse.json({
      success: true,
      data: response.data,
      pagination: { offset, limit, total, hasMore },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { success: false, error: "...", status: error.response?.status },
        { status: error.response?.status ?? 500 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

### State Management Pattern

- `useState` with single state object for related state
- `useCallback` for memoized async functions
- `Suspense` boundaries at the page level for components using `useSearchParams`
- No global state library — local state + props

### What Does NOT Exist Yet

- No server actions (`"use server"`)
- No middleware (`middleware.ts`)
- No authentication
- No database / ORM
- No testing framework
- No CI/CD pipeline

You may need to set these up from scratch. Justify your choices.

---

## Decision Frameworks

### Where Does Code Go?

| Scenario                           | Location                                               |
| ---------------------------------- | ------------------------------------------------------ |
| UI component used by multiple apps | `packages/ui/src/components/{name}.tsx`                |
| React hook used by multiple apps   | `packages/ui/src/hooks/{name}.ts`                      |
| Shared utility function            | `packages/ui/src/lib/utils.ts` (or new file in `lib/`) |
| Shared TypeScript types            | `packages/ui/src/lib/types.ts`                         |
| Shared static data                 | `packages/ui/src/lib/{name}.tsx`                       |
| Component specific to one app      | `apps/{app}/components/{name}.tsx`                     |
| Page section component             | `apps/{app}/components/sections/{name}.tsx`            |
| App-specific hook                  | `apps/{app}/hooks/{name}.ts`                           |
| App-specific utility               | `apps/{app}/lib/{name}.ts`                             |
| API route handler                  | `apps/{app}/app/api/{resource}/route.ts`               |
| Page                               | `apps/{app}/app/{route}/page.tsx`                      |
| Layout                             | `apps/{app}/app/{route}/layout.tsx`                    |

### API Route vs Server Action

| Use API Route when...                                               | Use Server Action when...                                        |
| ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| External clients need to call it                                    | Only called from your own React components                       |
| Fine-grained HTTP control needed (status codes, headers, streaming) | Simple form submission or data mutation                          |
| Proxying an external API                                            | Progressive enhancement desired (works without JS)               |
| GET requests for data fetching                                      | Mutations tied to a form or button                               |
| Webhook endpoints                                                   | Revalidation after mutation (`revalidatePath` / `revalidateTag`) |

If creating a server action:

- Place in `apps/{app}/app/{route}/actions.ts` (co-located) or `apps/{app}/lib/actions.ts` (shared across routes)
- `"use server"` at the top of the file
- Validate all inputs with Zod
- Return typed results: `{ success: true, data }` or `{ success: false, error }` — never throw

### "use client" — Do I Need It?

**Add it** if the component uses:

- `useState`, `useEffect`, `useReducer`, `useRef`, `useCallback`, `useMemo`
- Browser APIs (`window`, `document`, `localStorage`)
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Client libraries (framer-motion, gsap, recharts, `useSearchParams`, `useRouter`)

**Do NOT add it** if the component:

- Only receives props and renders JSX
- Only uses `async`/`await` for data fetching
- Only imports other Server Components

### Installing Dependencies

| Needed by...        | Command                                 |
| ------------------- | --------------------------------------- |
| Shared UI package   | `pnpm add {pkg} --filter @workspace/ui` |
| Web app only        | `pnpm add {pkg} --filter web`           |
| Developers app only | `pnpm add {pkg} --filter developers`    |
| Root-level tooling  | `pnpm add -D {pkg} -w`                  |

New files in `packages/ui/src/components/`, `src/hooks/`, or `src/lib/` are auto-exported via wildcard — no manual `package.json` update needed.

### Environment Variables

- **Server-only secrets**: add to `apps/{app}/.env.local` (no `NEXT_PUBLIC_` prefix)
- **Client-accessible values**: use `NEXT_PUBLIC_` prefix
- Always update `.env.sample` with empty placeholder
- Access in API routes / server components: `process.env.VAR_NAME`

---

## Feature Request

Add Supabase authentication to the Bitstat monorepo with login, signup, and logout functionality.

### Scope

- **Both apps** (web + developers) need auth support
- Users should be able to sign up with email/password, log in, and log out
- Show authenticated state in the header (user avatar or login button)
- Protect the `/dashboard` route in the developers app (redirect to login if unauthenticated)

### Architecture Decisions (already researched — follow these)

**Use `@supabase/ssr`** (NOT the deprecated `@supabase/auth-helpers-nextjs`):

- Install `@supabase/supabase-js` and `@supabase/ssr` in each app that needs auth

**Use Server Actions for auth mutations** (login, signup, logout) — NOT API routes:

- Auth actions are form-based mutations — exactly what server actions are designed for
- Progressive enhancement: forms work without JavaScript
- No external clients need to call these endpoints
- This is the pattern Supabase's own official Next.js docs recommend

**Three Supabase client types required:**

1. **Browser client** (`lib/supabase/client.ts`) — uses `createBrowserClient()` for client components
2. **Server client** (`lib/supabase/server.ts`) — uses `createServerClient()` with `getAll()`/`setAll()` cookie methods for server components, server actions, and route handlers
3. **Middleware** (`middleware.ts` at app root) — refreshes auth tokens on every request

**Critical rules:**

- Use ONLY `getAll()` and `setAll()` cookie methods (never individual `get`/`set`/`remove`)
- Always call `supabase.auth.getUser()` on the server to validate sessions (never `getSession()` — it doesn't revalidate the token)
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (both need `NEXT_PUBLIC_` prefix because the browser client needs them)

**Turborepo placement:**

- `lib/supabase/` (client.ts, server.ts, middleware.ts) goes **per-app** — NOT in packages/ui — because it depends on app-specific cookies and middleware
- Shared auth UI components (login form, user avatar dropdown) go in `packages/ui/src/components/` if used by both apps
- Each app needs its own `middleware.ts` at the app root
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `turbo.json` global env or build inputs

### Auth Pages & Routes

- `/login` — login form (email + password), link to signup
- `/signup` — signup form (email + password), link to login
- `/auth/callback` — route handler for OAuth/email confirmation callbacks
- Server action file for login, signup, logout actions (co-located or in `lib/actions.ts`)

### What I Already Have Set Up

- A Supabase project (I have the URL and anon key ready)
- No existing auth, middleware, or database code in the repo

---

## Your Instructions

Before writing ANY code, follow this workflow:

### 1. Confirm Understanding

Restate the feature in your own words. Specify which app(s) it affects.

### 2. Ask Clarifying Questions

Ask about anything ambiguous. Common questions:

- Which app(s) does this affect? (web, developers, or both)
- Does this need new environment variables?
- Does this require new dependencies?
- Should any component be shared (`packages/ui`) vs app-specific?
- Are there design/UX preferences (specific shadcn components, animations)?
- Does this integrate with an external API? What auth mechanism?
- Does this need loading/error states?

### 3. Propose a Plan

Before coding, outline:

- **Files to create** (full paths)
- **Files to modify** (full paths + description of changes)
- **Dependencies to install** (exact `pnpm add` commands)
- **Environment variables** needed
- **Architectural rationale** for every decision (API route vs server action, shared vs app-specific, client vs server component)

### 4. Wait for My Approval

Do not write code until I say go.

### 5. Implement Incrementally

When approved, implement in this order:

1. Types (`packages/ui/src/lib/types.ts` or app-local)
2. Shared utilities / hooks
3. Shared UI components
4. API routes or server actions
5. Page components and layouts
6. Wire everything together
7. Update `.env.sample` if needed

### 6. Post-Implementation Checklist

After implementation, verify:

- [ ] All imports follow `@workspace/ui/*` and `@/*` conventions
- [ ] `"use client"` only on components that genuinely need it
- [ ] `cn()` used for all className merging
- [ ] Semantic color tokens used (no hardcoded colors)
- [ ] Types properly defined (no `any`)
- [ ] API responses follow `{ success, data, error }` pattern
- [ ] Zod validation on all external inputs
- [ ] Loading and error states handled
- [ ] Dark mode works (semantic tokens, `dark:` variant where needed)
- [ ] Responsive design considered (mobile-first)
- [ ] `.env.sample` updated for any new env vars
- [ ] No secrets exposed to client (no `NEXT_PUBLIC_` for API keys)
