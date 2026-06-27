# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

This repository is a Next.js App Router portfolio site with two major runtime surfaces:
- the public site under `app/(app)`
- an embedded Payload CMS admin/API surface under `app/(payload)`

It also includes an AI assistant backed by LangChain + Qdrant and a project data layer that can run from static files or from Payload, depending on environment.

## Development Commands

```bash
# Install dependencies
pnpm install

# Run the app locally on port 3000
pnpm dev

# Production build / start
pnpm build
pnpm start

# Lint and type-check
pnpm lint
pnpm type-check

# Run all tests
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm test:ci
pnpm test:ci:coverage

# Run targeted test groups
pnpm test:unit
pnpm test:integration
pnpm test:performance
pnpm test:e2e

# Run a single Vitest file
pnpm vitest tests/lib/chat-utils.test.ts

# Run a single test by name
pnpm vitest -t "chat utils"

# Payload admin / local Payload CLI
pnpm payload

# Knowledge-base / vector scripts
pnpm seed-knowledge
pnpm seed-knowledge:dry-run
pnpm seed-knowledge:clear
pnpm seed-knowledge:static
pnpm seed-knowledge:projects
pnpm test-qdrant
pnpm migrate-vector-dimensions

# Data migration scripts
pnpm migrate:payload
pnpm migrate:payload:force
```

Notes:
- Most runtime scripts are wrapped in `dotenvx run -- ...`, so local env setup matters before `dev`, `build`, `start`, and the data scripts.
- Vitest is configured through `vitest.config.mjs`; CI uses `vitest.config.ci.mjs` with lower coverage thresholds.

## High-Level Architecture

### Route Groups

The app is intentionally split by route group:
- `app/(app)` contains the public website, resume pages, AI assistant UI, and most API routes.
- `app/(payload)` mounts Payload admin and Payload-backed API / GraphQL endpoints.
- `app/api/ai-assistant/chat/route.ts` and `app/api/revalidate/route.ts` live outside those groups as top-level API endpoints.

When tracing behavior, check which route group owns the page first; the public site and Payload admin have separate layouts and concerns.

### Root Layout and Client Infrastructure

`app/(app)/layout.tsx` is the main public-site shell. It wires together:
- theme handling via `next-themes`
- React Query via `providers/query-provider.tsx`
- the site navbar, toaster, global error boundary, fonts, and Vercel Speed Insights

If a feature needs app-wide client state, caching, or shared UI chrome, start there.

### Public Site Composition

The homepage in `app/(app)/page.tsx` composes feature sections (`Hero`, `About`, `Skills`, `ProjectsServer`, `Contact`, `Footer`) and fetches projects server-side before rendering.

Project detail pages live under `app/(app)/project/[slug]/page.tsx`. Resume pages are under `app/(app)/resume`.

### Project Data Flow: Static Fallback vs Payload CMS

Project content has a dual-source architecture:
- `lib/projects-data.ts` is the static source of truth used when CMS is disabled or unavailable.
- `lib/data-service-server.ts` is the server-side data layer. It checks `PAYLOAD_ENABLED`; if true, it fetches published projects from Payload, otherwise it falls back to static data.
- `lib/data-service.ts` is the client-safe static-only version. Use it in code that must stay browser-safe.

This distinction matters:
- server components and server routes should prefer `data-service-server.ts`
- client code must not import server-only Payload access

### Payload CMS Integration

Payload is configured in `payload.config.ts` and integrated into Next via `next.config.js` using `withPayload(...)`.

Current Payload setup includes:
- Postgres via `@payloadcms/db-vercel-postgres`
- Vercel Blob storage for media uploads
- a `projects` collection with workflow/status fields and drafts enabled
- a `media` collection for uploaded assets

Payload admin is mounted at `/admin`, and Payload API / GraphQL routes are exposed through `app/(payload)/api/...`.

### AI Assistant / RAG Stack

The portfolio chatbot is not just a UI widget; it has its own retrieval stack:
- public UI lives in the AI assistant pages/components under `app/(app)/(ai-assistant)` and homepage widget usage
- API entrypoint is `app/api/ai-assistant/chat/route.ts`
- orchestration lives in `services/langchain-rag-service.ts`
- vector-store support lives in `services/qdrant-vector-store.ts` and related embedding services
- hand-authored static knowledge lives as Markdown in `content/knowledge/*.md` (one file per category; see that folder's README), loaded/parsed by `lib/knowledge/*` and synced by `scripts/seed-knowledge-qdrant.ts`
- the seed script does an **incremental content-hash sync** for static knowledge (only new/changed chunks are re-embedded; removed chunks are pruned) — static vs. project points are kept separate via `metadata.kind`
- dynamic project knowledge is still generated from the projects data source via `lib/project-knowledge-*.ts`

The chat route supports both standard JSON responses and streaming SSE responses. If chat behavior is wrong, inspect the route, the LangChain service, and the Qdrant setup together.

### API Surfaces

There are multiple API categories in this repo:
- public site endpoints under `app/(app)/api/*` (`contact`, `projects`, analytics, Telegram, health checks)
- top-level AI and revalidation endpoints under `app/api/*`
- Payload-managed endpoints under `app/(payload)/api/*`

Do not assume all APIs share the same runtime path or implementation style.

### Styling and UI System

The site uses Tailwind CSS with shared styles in `styles/` plus UI primitives in `components/ui/`. Public feature components live mostly in `components/common/`.

Animations use Framer Motion / Motion. Theme switching is handled centrally through the public app layout.

### Testing Shape

Tests run on Vitest + jsdom, with setup in `tests/setup.ts`.

Current test coverage is strongest around component, hook, context, and lib behavior. The configured include paths also target `services/**/*` and `app/api/**/*`, so server-side code can be covered there too.

Useful conventions:
- general test glob: `tests/**/*.test.ts(x)`
- component tests also exist under `components/**/__tests__/**/*.test.tsx`
- base coverage thresholds in `vitest.config.mjs` are 70%
- CI thresholds in `vitest.config.ci.mjs` are 50/50/60/60

## UI Design Rule

- Whenever you create or modify UI in this repository, you must match the project design system defined in `DESIGN.md`.
- Read `DESIGN.md` before implementing meaningful UI changes, and use it as the source of truth for visual language, typography, colors, spacing, shadows, component styling, and responsive behavior.
- Do not ship default-looking Tailwind/shadcn UI when `DESIGN.md` specifies a more intentional treatment.
- If a requested UI change conflicts with `DESIGN.md`, ask before proceeding rather than improvising a different design direction.

## Configuration Notes

- Package manager is `pnpm`, not Yarn.
- The repo currently uses Next.js `16.2.4` and React `19.2.x`.
- Path alias `@/*` resolves from the repo root.
- `next.config.js` contains important image remote patterns, security headers, and Payload integration.
- `middleware.ts` currently only matches `/dashboard/:path*` and injects an `x-pathname` header.

## Environment Variables

Important variables referenced directly by the app include:
- `PAYLOAD_ENABLED`
- `POSTGRES_URL`
- `PAYLOAD_SECRET`
- `NEXT_PUBLIC_SERVER_URL` / `SERVER_URL`
- `BLOB_READ_WRITE_TOKEN`
- `TELEGRAM_BOT_TOKEN`
- `OPENAI_API_KEY`

Some features degrade gracefully when Payload is disabled, but others (Payload admin, media, AI embeddings/chat, Telegram notifications) require their backing env vars to be present.

## Suggested Improvements To The Previous AGENTS.md

The previous file had useful high-level intent, but several details were stale or too broad for current work:
- it described the repo as Next.js 15, while `package.json` is now on Next.js 16
- it referenced `next.config.mjs`, but the active config is `next.config.js`
- it omitted the Vitest workflow and single-test commands
- it did not explain the split between `app/(app)`, `app/(payload)`, and top-level API routes
- it did not document the dual project-data path (static fallback vs Payload)
- it did not capture the AI assistant / LangChain / Qdrant architecture, which is one of the main non-obvious systems in this repo
