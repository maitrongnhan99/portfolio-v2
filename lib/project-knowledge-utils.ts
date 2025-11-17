import type { Project } from "./data-service-types";
import type { KnowledgeChunkData } from "./knowledge-data";

/**
 * Utility functions for processing project data into knowledge chunks
 * for the vector database and AI assistant
 */

/**
 * Interface for PayloadCMS lexical editor nodes
 */
interface LexicalNode {
  type?: string;
  text?: string;
  children?: LexicalNode[];
}

interface LexicalRoot {
  root?: {
    children?: LexicalNode[];
  };
}

/**
 * Convert rich text content to plain text for embedding
 * This handles PayloadCMS's lexical editor output
 */
export function convertRichTextToPlainText(richText: unknown): string {
  if (!richText) return "";
  
  // If it's already a string, return it
  if (typeof richText === "string") {
    return richText;
  }

  // Handle PayloadCMS lexical format
  const lexicalContent = richText as LexicalRoot;
  if (lexicalContent.root?.children) {
    return extractTextFromLexical(lexicalContent.root.children);
  }

  // Handle other formats by stringifying and cleaning
  return JSON.stringify(richText)
    .replace(/[{}[\]"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract plain text from PayloadCMS lexical format
 */
function extractTextFromLexical(children: LexicalNode[]): string {
  if (!Array.isArray(children)) return "";

  return children
    .map((child) => {
      // Text nodes
      if (child.text) {
        return child.text;
      }
      
      // Nested children
      if (child.children) {
        return extractTextFromLexical(child.children);
      }
      
      return "";
    })
    .filter(Boolean)
    .join(" ");
}

/**
 * Generate project overview knowledge chunk
 */
export function createProjectOverviewChunk(project: Project): KnowledgeChunkData {
  const techList = project.technologies.join(", ");
  const featuresList = project.features?.join(", ") || "";
  
  const content = [
    `${project.title} is a ${project.category} project built with ${techList}.`,
    project.description,
    featuresList ? `Key features include: ${featuresList}.` : "",
    project.liveUrl ? `Live URL: ${project.liveUrl}` : "",
    project.githubUrl ? `GitHub: ${project.githubUrl}` : "",
    `Project completed: ${project.date}`,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    content,
    category: "projects",
    priority: 1,
    tags: [
      "project-overview",
      project.category.toLowerCase(),
      ...project.technologies.map(tech => tech.toLowerCase()),
      project.slug,
    ],
    source: `project_${project.slug}_overview`,
    projectSlug: project.slug,
    projectCategory: project.category,
    dataSource: "payload-cms",
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Generate technical details knowledge chunk
 */
export function createTechnicalDetailsChunk(project: Project): KnowledgeChunkData | null {
  const longDescription = project.longDescription 
    ? convertRichTextToPlainText(project.longDescription)
    : "";
    
  if (!longDescription.trim()) {
    return null; // Skip if no technical details available
  }

  const content = [
    `Technical details for ${project.title}:`,
    longDescription,
    `Technologies used: ${project.technologies.join(", ")}`,
    project.features?.length ? `Features: ${project.features.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    content,
    category: "project-technologies",
    priority: 1,
    tags: [
      "technical-details",
      "implementation",
      project.category.toLowerCase(),
      ...project.technologies.map(tech => tech.toLowerCase()),
      project.slug,
    ],
    source: `project_${project.slug}_technical`,
    projectSlug: project.slug,
    projectCategory: project.category,
    dataSource: "payload-cms",
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Generate challenges knowledge chunk
 */
export function createChallengesChunk(project: Project): KnowledgeChunkData | null {
  const challenges = project.challenges 
    ? convertRichTextToPlainText(project.challenges)
    : "";
    
  if (!challenges.trim()) {
    return null; // Skip if no challenges documented
  }

  const content = [
    `Challenges faced in ${project.title} project:`,
    challenges,
    `Project type: ${project.category}`,
    `Technologies involved: ${project.technologies.join(", ")}`,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    content,
    category: "project-challenges",
    priority: 2,
    tags: [
      "challenges",
      "problems",
      "troubleshooting",
      project.category.toLowerCase(),
      ...project.technologies.map(tech => tech.toLowerCase()),
      project.slug,
    ],
    source: `project_${project.slug}_challenges`,
    projectSlug: project.slug,
    projectCategory: project.category,
    dataSource: "payload-cms",
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Generate solutions knowledge chunk
 */
export function createSolutionsChunk(project: Project): KnowledgeChunkData | null {
  const solutions = project.solutions 
    ? convertRichTextToPlainText(project.solutions)
    : "";
    
  if (!solutions.trim()) {
    return null; // Skip if no solutions documented
  }

  const content = [
    `Solutions and approaches used in ${project.title} project:`,
    solutions,
    `Project type: ${project.category}`,
    `Technologies used: ${project.technologies.join(", ")}`,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    content,
    category: "project-solutions",
    priority: 2,
    tags: [
      "solutions",
      "approaches",
      "implementation",
      project.category.toLowerCase(),
      ...project.technologies.map(tech => tech.toLowerCase()),
      project.slug,
    ],
    source: `project_${project.slug}_solutions`,
    projectSlug: project.slug,
    projectCategory: project.category,
    dataSource: "payload-cms",
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Generate gallery and media knowledge chunk
 */
export function createGalleryChunk(project: Project): KnowledgeChunkData | null {
  if (!project.gallery || project.gallery.length === 0) {
    return null; // Skip if no gallery
  }

  const content = [
    `${project.title} includes ${project.gallery.length} gallery images showcasing the project.`,
    `Project type: ${project.category}`,
    `Main features demonstrated: ${project.features?.join(", ") || "various features"}`,
    `Technologies showcased: ${project.technologies.join(", ")}`,
    project.liveUrl ? `Live demonstration available at: ${project.liveUrl}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    content,
    category: "projects",
    priority: 3,
    tags: [
      "gallery",
      "visuals",
      "demonstration",
      project.category.toLowerCase(),
      ...project.technologies.map(tech => tech.toLowerCase()),
      project.slug,
    ],
    source: `project_${project.slug}_gallery`,
    projectSlug: project.slug,
    projectCategory: project.category,
    dataSource: "payload-cms",
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Process a single project into multiple knowledge chunks
 */
export function processProjectToKnowledgeChunks(project: Project): KnowledgeChunkData[] {
  const chunks: KnowledgeChunkData[] = [];

  // Always create overview chunk
  chunks.push(createProjectOverviewChunk(project));

  // Add technical details if available
  const technicalChunk = createTechnicalDetailsChunk(project);
  if (technicalChunk) {
    chunks.push(technicalChunk);
  }

  // Add challenges if documented
  const challengesChunk = createChallengesChunk(project);
  if (challengesChunk) {
    chunks.push(challengesChunk);
  }

  // Add solutions if documented
  const solutionsChunk = createSolutionsChunk(project);
  if (solutionsChunk) {
    chunks.push(solutionsChunk);
  }

  // Add gallery if available
  const galleryChunk = createGalleryChunk(project);
  if (galleryChunk) {
    chunks.push(galleryChunk);
  }

  return chunks;
}

/**
 * Validate project data before processing
 */
export function validateProjectForKnowledge(project: Project): boolean {
  // Basic validation
  if (!project.title || !project.slug || !project.description) {
    console.warn(`Project ${project.id} missing required fields for knowledge generation`);
    return false;
  }

  // Check if project is published (if status field exists)
  if (project.status && project.status !== "published") {
    console.log(`Skipping project ${project.slug} - status: ${project.status}`);
    return false;
  }

  return true;
}

/**
 * Process multiple projects into knowledge chunks
 */
export function processProjectsToKnowledge(projects: Project[]): KnowledgeChunkData[] {
  const allChunks: KnowledgeChunkData[] = [];
  let processedCount = 0;
  let skippedCount = 0;

  for (const project of projects) {
    if (!validateProjectForKnowledge(project)) {
      skippedCount++;
      continue;
    }

    try {
      const projectChunks = processProjectToKnowledgeChunks(project);
      allChunks.push(...projectChunks);
      processedCount++;
      
      console.log(`✅ Processed project: ${project.title} (${projectChunks.length} chunks)`);
    } catch (error) {
      console.error(`❌ Error processing project ${project.title}:`, error);
      skippedCount++;
    }
  }

  console.log(`📊 Project processing summary: ${processedCount} processed, ${skippedCount} skipped, ${allChunks.length} total chunks`);
  return allChunks;
}