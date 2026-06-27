import { readFileSync, readdirSync } from "fs";
import path from "path";
import { chunkId } from "./content-hash";
import type {
  KnowledgeCategory,
  KnowledgeChunkData,
  KnowledgePriority,
} from "./types";

/**
 * Loads hand-authored static knowledge from `content/knowledge/*.md`.
 *
 * Format (one file per category - filename is the category):
 *
 *   ## Frontend expertise
 *   - priority: 1
 *   - tags: frontend, react, nextjs
 *   - source: technical_skills
 *
 *   Nhan has extensive frontend development expertise...
 *
 * Each `##` heading is one chunk; its heading becomes the stable chunk id.
 * A leading run of `- key: value` bullets is the metadata; the rest is content.
 */

const DEFAULT_CONTENT_DIR = path.resolve(process.cwd(), "content/knowledge");

const VALID_CATEGORIES: ReadonlySet<string> = new Set<KnowledgeCategory>([
  "personal",
  "skills",
  "experience",
  "projects",
  "project-technologies",
  "project-challenges",
  "project-solutions",
  "education",
  "contact",
]);

const BULLET_RE = /^\s*-\s*([A-Za-z_]+)\s*:\s*(.+)$/;

export interface LoadedKnowledgeChunk extends KnowledgeChunkData {
  /** Stable id derived from category + heading slug, e.g. `skills/frontend-expertise`. */
  id: string;
  /** Original heading text (for diagnostics). */
  heading: string;
}

function toPriority(raw: string | undefined): KnowledgePriority {
  const n = raw ? parseInt(raw, 10) : NaN;
  return n === 1 || n === 3 ? n : 2;
}

function parseTags(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Strip an optional leading YAML frontmatter block (`--- ... ---`). Category is
 * taken from the filename, so frontmatter is tolerated but not required.
 */
function stripFrontmatter(text: string): string {
  if (!text.startsWith("---")) return text;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return text;
  const after = text.indexOf("\n", end + 1);
  return after === -1 ? "" : text.slice(after + 1);
}

/**
 * Parse a single category file body into chunks.
 */
export function parseKnowledgeMarkdown(
  category: KnowledgeCategory,
  raw: string
): LoadedKnowledgeChunk[] {
  const body = stripFrontmatter(raw);
  const lines = body.split("\n");

  // Find section boundaries (lines starting with "## ").
  const sections: { heading: string; lines: string[] }[] = [];
  let current: { heading: string; lines: string[] } | null = null;

  for (const line of lines) {
    const headingMatch = /^##\s+(.+?)\s*$/.exec(line);
    if (headingMatch) {
      current = { heading: headingMatch[1], lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  }

  const chunks: LoadedKnowledgeChunk[] = [];

  for (const section of sections) {
    const meta: Record<string, string> = {};
    let i = 0;

    // Skip leading blank lines, then consume the contiguous bullet metadata block.
    while (i < section.lines.length && section.lines[i].trim() === "") i++;
    while (i < section.lines.length) {
      const match = BULLET_RE.exec(section.lines[i]);
      if (!match) break;
      meta[match[1].toLowerCase()] = match[2].trim();
      i++;
    }

    const content = section.lines.slice(i).join("\n").trim();
    if (!content) {
      console.warn(
        `⚠️ Skipping empty chunk "${section.heading}" in ${category}.md`
      );
      continue;
    }

    chunks.push({
      id: chunkId(category, section.heading),
      heading: section.heading,
      content,
      category,
      priority: toPriority(meta.priority),
      tags: parseTags(meta.tags),
      source: meta.source || chunkId(category, section.heading).split("/")[1],
    });
  }

  return chunks;
}

/**
 * Load and parse every `*.md` knowledge file in the content directory.
 * Throws on duplicate chunk ids so collisions can't silently drop content.
 */
export function loadStaticKnowledge(
  contentDir: string = DEFAULT_CONTENT_DIR
): LoadedKnowledgeChunk[] {
  const files = readdirSync(contentDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const all: LoadedKnowledgeChunk[] = [];
  const seen = new Set<string>();

  for (const file of files) {
    const category = path.basename(file, ".md");
    if (!VALID_CATEGORIES.has(category)) {
      // README.md and any non-category file are ignored.
      continue;
    }

    const raw = readFileSync(path.join(contentDir, file), "utf8");
    const chunks = parseKnowledgeMarkdown(category as KnowledgeCategory, raw);

    for (const chunk of chunks) {
      if (seen.has(chunk.id)) {
        throw new Error(
          `Duplicate knowledge chunk id "${chunk.id}" (heading "${chunk.heading}" in ${file}). Headings must be unique within a category.`
        );
      }
      seen.add(chunk.id);
      all.push(chunk);
    }
  }

  return all;
}
