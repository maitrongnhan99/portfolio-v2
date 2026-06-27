import { describe, it, expect } from "vitest";
import { diffKnowledge } from "@/lib/knowledge/sync";

const current = (chunkId: string, contentHash: string) => ({ chunkId, contentHash });
const existing = (chunkId: string, contentHash: string, pointId: string) => ({
  chunkId,
  contentHash,
  pointId,
});

describe("diffKnowledge", () => {
  it("treats chunks with no existing match as upserts (new)", () => {
    const result = diffKnowledge([current("a", "h1")], []);
    expect(result.toUpsert.map((c) => c.chunkId)).toEqual(["a"]);
    expect(result.unchanged).toEqual([]);
    expect(result.toDeletePointIds).toEqual([]);
  });

  it("treats chunks with a differing hash as upserts (changed)", () => {
    const result = diffKnowledge(
      [current("a", "h2")],
      [existing("a", "h1", "uuid-a")]
    );
    expect(result.toUpsert.map((c) => c.chunkId)).toEqual(["a"]);
    expect(result.unchanged).toEqual([]);
  });

  it("treats chunks with a matching hash as unchanged", () => {
    const result = diffKnowledge(
      [current("a", "h1")],
      [existing("a", "h1", "uuid-a")]
    );
    expect(result.toUpsert).toEqual([]);
    expect(result.unchanged.map((c) => c.chunkId)).toEqual(["a"]);
  });

  it("marks existing points absent from current as deletions", () => {
    const result = diffKnowledge(
      [current("a", "h1")],
      [existing("a", "h1", "uuid-a"), existing("b", "h9", "uuid-b")]
    );
    expect(result.toDeletePointIds).toEqual(["uuid-b"]);
    expect(result.unchanged.map((c) => c.chunkId)).toEqual(["a"]);
  });

  it("handles a mixed batch of new, changed, unchanged, and deleted", () => {
    const result = diffKnowledge(
      [current("keep", "h1"), current("edit", "h2-new"), current("new", "h3")],
      [
        existing("keep", "h1", "uuid-keep"),
        existing("edit", "h2-old", "uuid-edit"),
        existing("gone", "h4", "uuid-gone"),
      ]
    );

    expect(result.toUpsert.map((c) => c.chunkId).sort()).toEqual(["edit", "new"]);
    expect(result.unchanged.map((c) => c.chunkId)).toEqual(["keep"]);
    expect(result.toDeletePointIds).toEqual(["uuid-gone"]);
  });
});
