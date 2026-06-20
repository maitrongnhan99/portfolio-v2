# GEMINI.md

This file provides guidance when working with code in this repository. It mirrors `CLAUDE.md` / `AGENTS.md`; keep the three in sync when architecture or commands change.

## Project Overview

A Next.js App Router portfolio site with two major runtime surfaces:
- the public site under `app/(app)`
- an embedded Payload CMS admin/API surface under `app/(payload)`

It also ships an AI assistant ("Ask Me") backed by LangChain + Qdrant (RAG), and a project data layer that runs from static files or from Payload depending on environment. Built with React 19, TypeScript, and Tailwind CSS. Package manager is **pnpm**.

## Development Commands

```bash
# Install dependencies
pnpm install

# Run the dev server on port 3000
pnpm dev

# Production build / start
pnpm build   # runs `next build --webpack` — this repo opts OUT of Turbopack for builds
pnpm start

# Lint and type-check
pnpm lint          # flat config: eslint.config.js
pnpm type-check    # tsc --noEmit

# Tests (Vitest + jsdom)
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm test:unit          # tests/services tests/utils
pnpm test:integration   # tests/api
pnpm vitest tests/lib/chat-utils.test.ts   # single file
pnpm vitest -t "chat utils"                # single test by name

# Payload CLI, knowledge-base seeding, data migration
pnpm payload
pnpm seed-knowledge        # + :dry-run / :clear / :static / :projects
pnpm migrate:payload
```

Most runtime scripts are wrapped in `dotenvx run -- ...`, so local env setup matters before `dev`, `build`, `start`, and the data scripts.

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **CMS**: Payload 3 (Postgres via `@payloadcms/db-vercel-postgres`, Vercel Blob storage)
- **AI / RAG**: LangChain + OpenAI SDK + Qdrant vector store
- **UI**: Radix UI primitives (shadcn-style), Tailwind CSS, Framer Motion / Motion
- **Data/Forms**: TanStack Query, React Hook Form + Zod

### Route Groups
- `app/(app)` — public website, resume pages, AI assistant UI, most API routes.
- `app/(payload)` — Payload admin (`/admin`) and Payload-backed API / GraphQL endpoints.
- `app/api/ai-assistant/chat/route.ts` and `app/api/revalidate/route.ts` are top-level, outside both groups.

Check which route group owns a page first — the public site and Payload admin have separate layouts and concerns.

### Project Data Flow: Static Fallback vs Payload CMS
- `lib/projects-data.ts` — static source of truth, used when CMS is disabled/unavailable.
- `lib/data-service-server.ts` — server data layer; checks `PAYLOAD_ENABLED` and fetches from Payload, else falls back to static. Prefer this in server components/routes.
- `lib/data-service.ts` — client-safe static-only version. Client code must not import server-only Payload access.

### AI Assistant / RAG Stack
- UI under `app/(app)/(ai-assistant)` plus the homepage chat widget.
- API entrypoint `app/api/ai-assistant/chat/route.ts` (supports JSON and streaming SSE).
- Orchestration in `services/langchain-rag-service.ts`; vector store in `services/qdrant-vector-store.ts`.
- Knowledge sources under `lib/*knowledge*` and `scripts/seed-knowledge-qdrant.ts`.
If chat behavior is wrong, inspect the route, the LangChain service, and the Qdrant setup together.

### Key Directories
- `app/`: App Router pages and API routes (route groups above)
- `components/`: `common/` for features, `ui/` for primitives
- `lib/`: data services, utilities, knowledge prep
- `services/`: AI/RAG orchestration and vector store
- `constants/`: static data and configs
- `hooks/`, `contexts/`, `providers/`: client infra

### Styling & Design System
- Tailwind CSS (`tailwind.config.ts`) with two global stylesheets — `app/(app)/globals.css` is the one imported by the public layout; `styles/globals.css` also exists. Confirm which an import targets before editing tokens.
- The design language is ElevenLabs-inspired and codified in `DESIGN.md` — **read it before meaningful UI changes** and do not introduce a parallel style language. Dark/light theme via `next-themes`.

### Versioning
Releases use semantic-release (`.releaserc.json`) driven by Conventional Commits on `main`; `change:` and `refactor:` types bump a patch. Commit messages must follow Conventional Commits.

## Environment Variables
Key vars: `PAYLOAD_ENABLED`, `POSTGRES_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL` / `SERVER_URL`, `BLOB_READ_WRITE_TOKEN`, `TELEGRAM_BOT_TOKEN`, `OPENAI_API_KEY`. Features degrade gracefully when Payload is disabled, but Payload admin, media, AI chat/embeddings, and Telegram notifications require their backing vars.
