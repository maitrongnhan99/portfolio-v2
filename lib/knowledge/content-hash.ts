import { createHash } from "crypto";
import type { KnowledgeChunkData } from "./types";

/**
 * Stable identity + change detection for static knowledge chunks.
 *
 * Each chunk gets a stable string id (`category/heading-slug`) which maps to a
 * deterministic UUID used as the Qdrant point id, so re-syncing overwrites the
 * same point in place instead of creating duplicates. A content hash over the
 * chunk's meaningful fields lets the sync skip unchanged chunks (no re-embed).
 */

// Fixed namespace so deterministic UUIDs are stable across runs/machines.
const UUID_NAMESPACE = "portfolio-knowledge:v1";

/**
 * Turn arbitrary heading text into a url-safe slug used in the chunk id.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Stable, human-readable id for a chunk, e.g. `skills/frontend-expertise`.
 */
export function chunkId(category: string, headingOrSlug: string): string {
  return `${category}/${slugify(headingOrSlug)}`;
}

/**
 * Derive a deterministic RFC-4122-shaped UUID (v5-style, SHA-1 based) from a
 * stable key. Qdrant requires point ids to be unsigned ints or UUID strings, so
 * we map our string `chunkId` onto a stable UUID. Same key → same UUID.
 */
export function deterministicUuid(key: string): string {
  const hash = createHash("sha1")
    .update(`${UUID_NAMESPACE}:${key}`)
    .digest("hex");

  // Build 8-4-4-4-12 from the first 32 hex chars, forcing version (5) and
  // variant (RFC 4122) nibbles so the result is a valid UUID.
  const bytes = hash.slice(0, 32).split("");
  bytes[12] = "5"; // version
  const variantNibble = parseInt(bytes[16], 16);
  bytes[16] = ((variantNibble & 0x3) | 0x8).toString(16); // variant 10xx

  const hex = bytes.join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

/**
 * Content hash over the fields that change embeddings or stored metadata.
 * Tags are sorted so reordering them is not treated as a change.
 */
export function contentHash(
  chunk: Pick<KnowledgeChunkData, "content" | "category" | "priority" | "tags" | "source">
): string {
  const canonical = JSON.stringify({
    content: chunk.content.trim(),
    category: chunk.category,
    priority: chunk.priority,
    source: chunk.source,
    tags: [...chunk.tags].map((t) => t.trim()).sort(),
  });

  return createHash("sha256").update(canonical).digest("hex");
}
