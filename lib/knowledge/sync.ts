import { contentHash, deterministicUuid } from "./content-hash";
import { loadStaticKnowledge } from "./markdown-loader";
import type { KnowledgeKind } from "./types";

/**
 * Incremental content-hash sync for static (Markdown-authored) knowledge.
 *
 * Instead of wiping and re-embedding everything, we compare each chunk's content
 * hash against what's already stored in Qdrant and only embed new/changed chunks,
 * then prune chunks that were deleted from the Markdown. Static and project points
 * are kept separate via `metadata.kind`.
 */

export const STATIC_KIND: KnowledgeKind = "static-knowledge";

interface DiffCurrent {
  chunkId: string;
  contentHash: string;
}

interface DiffExisting {
  chunkId: string;
  contentHash: string;
  pointId: string;
}

export interface DiffResult<T extends DiffCurrent> {
  toUpsert: T[]; // new + changed
  unchanged: T[];
  toDeletePointIds: string[];
}

/**
 * Pure diff planner - no I/O, fully unit-testable.
 * Classifies current chunks against what already exists in the store.
 */
export function diffKnowledge<T extends DiffCurrent>(
  current: T[],
  existing: DiffExisting[]
): DiffResult<T> {
  const existingByChunkId = new Map<string, DiffExisting>();
  for (const e of existing) {
    existingByChunkId.set(e.chunkId, e);
  }
  const currentChunkIds = new Set(current.map((c) => c.chunkId));

  const toUpsert: T[] = [];
  const unchanged: T[] = [];

  for (const chunk of current) {
    const match = existingByChunkId.get(chunk.chunkId);
    if (!match || match.contentHash !== chunk.contentHash) {
      toUpsert.push(chunk);
    } else {
      unchanged.push(chunk);
    }
  }

  const toDeletePointIds = existing
    .filter((e) => !currentChunkIds.has(e.chunkId))
    .map((e) => e.pointId);

  return { toUpsert, unchanged, toDeletePointIds };
}

// Minimal structural contract over the vector store so sync stays decoupled
// (and mockable in tests). QdrantVectorStoreService satisfies this.
export interface KnowledgeVectorStore {
  initialize(): Promise<void>;
  listAll(
    filter?: Record<string, unknown>
  ): Promise<Array<{ id: string | number; payload: Record<string, unknown> | null }>>;
  upsertDocuments(
    docs: Array<{ id: string; content: string; metadata: Record<string, unknown> }>
  ): Promise<void>;
  deleteByIds(ids: Array<string | number>): Promise<void>;
}

export interface SyncOptions {
  dryRun?: boolean;
  /** Delete points whose chunks were removed from Markdown. Default true. */
  prune?: boolean;
  contentDir?: string;
}

export interface SyncReport {
  total: number;
  created: number;
  changed: number;
  unchanged: number;
  deleted: number;
  embedded: number;
  dryRun: boolean;
}

const STATIC_KIND_FILTER = {
  must: [{ key: "metadata.kind", match: { value: STATIC_KIND } }],
};

/**
 * Load Markdown chunks, diff against Qdrant, and apply the minimal set of
 * embeds/deletes. Returns a report; performs no writes when `dryRun` is set.
 */
export async function syncStaticKnowledge(
  store: KnowledgeVectorStore,
  options: SyncOptions = {}
): Promise<SyncReport> {
  const { dryRun = false, prune = true, contentDir } = options;

  const loaded = loadStaticKnowledge(contentDir);
  const current = loaded.map((chunk) => ({
    chunkId: chunk.id,
    pointId: deterministicUuid(chunk.id),
    contentHash: contentHash(chunk),
    chunk,
  }));

  await store.initialize();

  const existingRaw = await store.listAll(STATIC_KIND_FILTER);
  const existing: DiffExisting[] = existingRaw.map((point) => {
    const metadata = ((point.payload?.metadata ?? {}) as Record<string, unknown>);
    return {
      pointId: String(point.id),
      chunkId: String(metadata.chunkId ?? ""),
      contentHash: String(metadata.contentHash ?? ""),
    };
  });

  const diff = diffKnowledge(current, existing);

  // How many of the upserts are new vs. changed (purely for reporting).
  const existingChunkIds = new Set(existing.map((e) => e.chunkId));
  const created = diff.toUpsert.filter((c) => !existingChunkIds.has(c.chunkId)).length;
  const changed = diff.toUpsert.length - created;

  const report: SyncReport = {
    total: current.length,
    created,
    changed,
    unchanged: diff.unchanged.length,
    deleted: prune ? diff.toDeletePointIds.length : 0,
    embedded: dryRun ? 0 : diff.toUpsert.length,
    dryRun,
  };

  if (dryRun) {
    return report;
  }

  if (diff.toUpsert.length > 0) {
    const docs = diff.toUpsert.map(({ chunk, pointId, contentHash: hash }) => ({
      id: pointId,
      content: chunk.content,
      metadata: {
        category: chunk.category,
        priority: chunk.priority,
        tags: chunk.tags,
        source: chunk.source,
        kind: STATIC_KIND,
        chunkId: chunk.id,
        contentHash: hash,
        dataSource: "static" as const,
      },
    }));
    await store.upsertDocuments(docs);
  }

  if (prune && diff.toDeletePointIds.length > 0) {
    await store.deleteByIds(diff.toDeletePointIds);
  }

  return report;
}
