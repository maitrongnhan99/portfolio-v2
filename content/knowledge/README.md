# Knowledge base (RAG source of truth)

These Markdown files are the hand-authored knowledge that powers the portfolio AI
assistant. They are parsed, embedded, and stored in Qdrant for retrieval. **Editing
a file here and re-running the sync is all it takes to update what the assistant
knows about Nhan.**

> Auto-generated **project** knowledge (built from the projects data source) is a
> separate path and is **not** stored here. See `lib/project-knowledge-*.ts`.

---

## File layout

- **One file per category.** The filename (without `.md`) is the category, so
  `skills.md` → category `skills`. Valid categories: `personal`, `skills`,
  `experience`, `projects`, `education`, `contact`.
- Any non-category `.md` (like this README) is ignored by the loader.

## Chunk format

Each `##` heading is one knowledge chunk:

```markdown
## Frontend expertise
- priority: 1
- tags: frontend, react, nextjs, typescript
- source: technical_skills

Nhan has extensive frontend development expertise including React, Next.js...
```

- **Heading** → the chunk's stable id (`category/heading-slug`). Keep it unique
  within the file and avoid renaming it casually: renaming changes the id, which
  re-embeds the chunk as new + prunes the old one.
- **Metadata bullets** (the leading `- key: value` lines):
  - `priority` — `1`, `2`, or `3` (defaults to `2`). 1 = highest.
  - `tags` — comma-separated keywords.
  - `source` — short origin label (defaults to the heading slug).
- **Body** — everything after the metadata block is the chunk content that gets
  embedded. Keep it to a focused paragraph.

---

## Prerequisites

The sync needs two things in your environment (loaded from `.env` via `dotenvx`):

| Variable         | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `OPENAI_API_KEY` | Generates embeddings (`text-embedding-3-small`, 768-dim). |
| `QDRANT_URL`     | Qdrant endpoint (e.g. `http://localhost:6333`). |
| `QDRANT_API_KEY` | Only if your Qdrant instance requires auth. |

**Running Qdrant locally:**

```bash
docker run -p 6333:6333 qdrant/qdrant
```

A `dry-run` only needs to read; an actual sync needs both a reachable Qdrant and a
valid OpenAI key.

---

## How to update the knowledge base

1. **Edit the Markdown.** Add, change, or remove `##` chunks in the relevant
   category file (e.g. add a new skill to `skills.md`).
2. **Preview the change** — see exactly what will be embedded/pruned, with no
   writes and no OpenAI cost:
   ```bash
   pnpm seed-knowledge:dry-run
   ```
   Look for the `Static sync plan` line, e.g. `1 new, 0 changed, 48 unchanged, 0 would be pruned`.
3. **Apply the sync:**
   ```bash
   pnpm seed-knowledge:static   # static knowledge only
   # or
   pnpm seed-knowledge          # static knowledge + refresh project knowledge
   ```
   The sync is **incremental and content-hash based**: only new or edited chunks
   are re-embedded, and chunks you deleted from Markdown are pruned from Qdrant.
   Unchanged chunks are skipped — so editing one term costs one embedding, not the
   whole base.
4. **Verify** (optional) the collection and a sample query:
   ```bash
   pnpm test-qdrant
   ```

### Command reference

| Command                       | What it does                                                        |
| ----------------------------- | ------------------------------------------------------------------- |
| `pnpm seed-knowledge:dry-run` | Preview the diff + stats. No embeddings, no writes.                 |
| `pnpm seed-knowledge:static`  | Incrementally sync **only** this static knowledge.                  |
| `pnpm seed-knowledge`         | Sync static knowledge **and** refresh project knowledge.            |
| `pnpm seed-knowledge:projects`| Refresh **only** project knowledge (leaves static knowledge alone). |
| `pnpm seed-knowledge:clear`   | Wipe **everything** in the collection (full reset).                 |
| `pnpm test-qdrant`            | Sanity-check the collection and run a sample similarity search.     |

---

## How it works (under the hood)

- `lib/knowledge/markdown-loader.ts` parses these files into chunks.
- `lib/knowledge/content-hash.ts` gives each chunk a **stable id** (mapped to a
  deterministic Qdrant point id) and a **content hash** for change detection.
- `lib/knowledge/sync.ts` diffs the Markdown against what's already in Qdrant and
  applies the minimal set of embeds/deletes.
- Static vs. project points are kept separate via `metadata.kind`
  (`static-knowledge` vs `project`), so the two sync paths never clobber each other.
- Entry point: `scripts/seed-knowledge-qdrant.ts`.

## Troubleshooting

- **`Missing required environment variables`** — set `OPENAI_API_KEY` and
  `QDRANT_URL` in `.env`.
- **`Error ensuring collection: ApiError: Not Found` / connection errors** —
  Qdrant isn't reachable at `QDRANT_URL`. Start it (see Prerequisites) or fix the
  URL. `dry-run` will warn and continue; a real sync will fail.
- **`Duplicate knowledge chunk id ...`** — two `##` headings in the same file slug
  to the same id. Make the headings unique within that file.
- **A chunk didn't update** — confirm you edited the **body/metadata** (a hash
  change), then re-run the dry-run to see it listed as `changed`.
