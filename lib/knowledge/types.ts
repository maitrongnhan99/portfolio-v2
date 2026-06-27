// Shared types for the RAG knowledge base.
//
// Hand-authored static knowledge now lives as Markdown in `content/knowledge/*.md`
// and is parsed into `KnowledgeChunkData` by `markdown-loader.ts`. Project knowledge
// is generated dynamically (see `project-knowledge-utils.ts`). Both share this shape.

export type KnowledgeCategory =
  | "personal"
  | "skills"
  | "experience"
  | "projects"
  | "project-technologies"
  | "project-challenges"
  | "project-solutions"
  | "education"
  | "contact";

export type KnowledgePriority = 1 | 2 | 3;

/**
 * Discriminates how a Qdrant point was produced so the two seeding paths
 * (incremental static sync vs. full project re-seed) never clobber each other.
 * Note: `dataSource: "static"` is NOT safe for this - project chunks built from
 * static project data also carry it.
 */
export type KnowledgeKind = "static-knowledge" | "project";

export interface KnowledgeChunkData {
  content: string;
  category: KnowledgeCategory;
  priority: KnowledgePriority;
  tags: string[];
  source: string;
  // Enhanced metadata for project-specific knowledge
  projectSlug?: string;
  projectCategory?: string;
  dataSource?: "static" | "payload-cms";
  lastUpdated?: string;
}
