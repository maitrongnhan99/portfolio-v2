import { describe, it, expect, vi } from "vitest";
import {
  parseKnowledgeMarkdown,
  loadStaticKnowledge,
} from "@/lib/knowledge/markdown-loader";

describe("parseKnowledgeMarkdown", () => {
  it("parses heading, metadata bullets, and content into a chunk", () => {
    const md = `# Skills

## Frontend expertise
- priority: 1
- tags: frontend, react, nextjs
- source: technical_skills

Nhan has extensive frontend development expertise.`;

    const chunks = parseKnowledgeMarkdown("skills", md);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toMatchObject({
      id: "skills/frontend-expertise",
      heading: "Frontend expertise",
      category: "skills",
      priority: 1,
      tags: ["frontend", "react", "nextjs"],
      source: "technical_skills",
      content: "Nhan has extensive frontend development expertise.",
    });
  });

  it("splits multiple chunks in one file", () => {
    const md = `## One
- priority: 1

First chunk.

## Two
- priority: 3

Second chunk.`;

    const chunks = parseKnowledgeMarkdown("personal", md);
    expect(chunks.map((c) => c.id)).toEqual(["personal/one", "personal/two"]);
    expect(chunks[1].content).toBe("Second chunk.");
  });

  it("defaults priority to 2 and tags to empty when omitted", () => {
    const md = `## Bare chunk

Just content, no metadata.`;
    const [chunk] = parseKnowledgeMarkdown("contact", md);
    expect(chunk.priority).toBe(2);
    expect(chunk.tags).toEqual([]);
  });

  it("defaults source to the heading slug when omitted", () => {
    const md = `## Open to opportunities

Available for work.`;
    const [chunk] = parseKnowledgeMarkdown("contact", md);
    expect(chunk.source).toBe("open-to-opportunities");
  });

  it("preserves multi-paragraph content after the metadata block", () => {
    const md = `## Story
- tags: a, b

Paragraph one.

Paragraph two.`;
    const [chunk] = parseKnowledgeMarkdown("personal", md);
    expect(chunk.content).toBe("Paragraph one.\n\nParagraph two.");
  });

  it("skips a section with no content", () => {
    const md = `## Empty
- priority: 1

## Real
- priority: 1

Has content.`;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const chunks = parseKnowledgeMarkdown("personal", md);
    expect(chunks.map((c) => c.heading)).toEqual(["Real"]);
    warn.mockRestore();
  });

  it("tolerates an optional leading frontmatter block", () => {
    const md = `---
category: skills
---

## React ecosystem
- priority: 1

Deep React knowledge.`;
    const chunks = parseKnowledgeMarkdown("skills", md);
    expect(chunks).toHaveLength(1);
    expect(chunks[0].id).toBe("skills/react-ecosystem");
  });
});

describe("loadStaticKnowledge (real content)", () => {
  it("loads all hand-authored chunks with unique ids", () => {
    const chunks = loadStaticKnowledge();
    expect(chunks.length).toBeGreaterThan(0);

    const ids = new Set(chunks.map((c) => c.id));
    expect(ids.size).toBe(chunks.length);

    // every chunk has non-empty content and a valid category-prefixed id
    for (const chunk of chunks) {
      expect(chunk.content.length).toBeGreaterThan(0);
      expect(chunk.id.startsWith(`${chunk.category}/`)).toBe(true);
    }
  });
});
