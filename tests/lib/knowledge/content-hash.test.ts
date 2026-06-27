import { describe, it, expect } from "vitest";
import {
  slugify,
  chunkId,
  deterministicUuid,
  contentHash,
} from "@/lib/knowledge/content-hash";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const baseChunk = {
  content: "Nhan builds with React and Next.js.",
  category: "skills" as const,
  priority: 1 as const,
  tags: ["react", "nextjs"],
  source: "technical_skills",
};

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Frontend Expertise")).toBe("frontend-expertise");
  });

  it("strips punctuation and collapses separators", () => {
    expect(slugify("  AI / LLM, & more!  ")).toBe("ai-llm-more");
  });
});

describe("chunkId", () => {
  it("combines category and heading slug", () => {
    expect(chunkId("skills", "Frontend Expertise")).toBe("skills/frontend-expertise");
  });
});

describe("deterministicUuid", () => {
  it("produces a valid RFC-4122-shaped UUID", () => {
    const uuid = deterministicUuid("skills/frontend-expertise");
    expect(uuid).toMatch(UUID_RE);
  });

  it("is stable for the same key", () => {
    expect(deterministicUuid("skills/react-ecosystem")).toBe(
      deterministicUuid("skills/react-ecosystem")
    );
  });

  it("differs for different keys", () => {
    expect(deterministicUuid("skills/a")).not.toBe(deterministicUuid("skills/b"));
  });
});

describe("contentHash", () => {
  it("is stable across calls", () => {
    expect(contentHash(baseChunk)).toBe(contentHash(baseChunk));
  });

  it("ignores tag order", () => {
    const reordered = { ...baseChunk, tags: ["nextjs", "react"] };
    expect(contentHash(reordered)).toBe(contentHash(baseChunk));
  });

  it("changes when content changes", () => {
    const edited = { ...baseChunk, content: "Nhan builds with React, Next.js, and NestJS." };
    expect(contentHash(edited)).not.toBe(contentHash(baseChunk));
  });

  it("changes when priority or source changes", () => {
    expect(contentHash({ ...baseChunk, priority: 2 })).not.toBe(contentHash(baseChunk));
    expect(contentHash({ ...baseChunk, source: "specializations" })).not.toBe(
      contentHash(baseChunk)
    );
  });
});
