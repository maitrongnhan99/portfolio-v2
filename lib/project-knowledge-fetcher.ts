import { getProjects, checkPayloadHealth, getDataSource } from "./script-data-service";
import { processProjectsToKnowledge } from "./project-knowledge-utils";
import type { KnowledgeChunkData } from "./knowledge/types";
import type { Project } from "./data-service-types";

/**
 * Enhanced project knowledge fetcher for the seed script
 * Handles both PayloadCMS and static data sources with proper error handling
 */

export interface ProjectKnowledgeFetchResult {
  success: boolean;
  chunks: KnowledgeChunkData[];
  source: string;
  projectCount: number;
  chunkCount: number;
  errors: string[];
}

/**
 * Fetch and process project knowledge from available data source
 */
export async function fetchProjectsKnowledge(): Promise<ProjectKnowledgeFetchResult> {
  const result: ProjectKnowledgeFetchResult = {
    success: false,
    chunks: [],
    source: "",
    projectCount: 0,
    chunkCount: 0,
    errors: [],
  };

  try {
    console.log("🔍 Checking data source availability...");
    
    // Check PayloadCMS health
    const healthCheck = await checkPayloadHealth();
    result.source = healthCheck.source;
    
    if (!healthCheck.available && healthCheck.error) {
      result.errors.push(`PayloadCMS unavailable: ${healthCheck.error}`);
      console.warn(`⚠️ PayloadCMS issue: ${healthCheck.error}`);
    }

    console.log(`📊 Data source: ${result.source}`);

    // Fetch projects
    console.log("📥 Fetching projects data...");
    const projects = await getProjects();
    
    if (!projects || projects.length === 0) {
      result.errors.push("No projects found in data source");
      console.warn("⚠️ No projects found");
      return result;
    }

    result.projectCount = projects.length;
    console.log(`📚 Found ${projects.length} projects`);

    // Filter for published projects if using PayloadCMS
    const publishedProjects = projects.filter(project => {
      if (result.source.includes("Payload CMS")) {
        return project.status === "published";
      }
      // For static data, assume all projects are "published"
      return true;
    });

    if (publishedProjects.length !== projects.length) {
      console.log(`📝 Filtered to ${publishedProjects.length} published projects`);
    }

    // Validate projects before processing
    const validProjects = publishedProjects.filter(project => {
      if (!project.title || !project.slug || !project.description) {
        result.errors.push(`Project ${project.id || 'unknown'} missing required fields`);
        return false;
      }
      return true;
    });

    if (validProjects.length !== publishedProjects.length) {
      console.warn(`⚠️ ${publishedProjects.length - validProjects.length} projects failed validation`);
    }

    // Process projects to knowledge chunks
    console.log("⚙️ Processing projects to knowledge chunks...");
    const projectChunks = processProjectsToKnowledge(validProjects);
    
    result.chunks = projectChunks;
    result.chunkCount = projectChunks.length;
    result.success = true;

    console.log(`✅ Successfully processed ${validProjects.length} projects into ${projectChunks.length} knowledge chunks`);

    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    result.errors.push(`Failed to fetch project knowledge: ${errorMessage}`);
    console.error("❌ Error fetching project knowledge:", error);
    
    return result;
  }
}

/**
 * Get sample project for testing knowledge generation
 */
export async function fetchSampleProjectKnowledge(projectSlug?: string): Promise<ProjectKnowledgeFetchResult> {
  const result: ProjectKnowledgeFetchResult = {
    success: false,
    chunks: [],
    source: "",
    projectCount: 0,
    chunkCount: 0,
    errors: [],
  };

  try {
    console.log(`🧪 Fetching sample project knowledge${projectSlug ? ` for: ${projectSlug}` : ''}...`);
    
    const projects = await getProjects();
    result.source = getDataSource();
    
    let targetProject: Project | undefined;
    
    if (projectSlug) {
      targetProject = projects.find(p => p.slug === projectSlug);
      if (!targetProject) {
        result.errors.push(`Project with slug '${projectSlug}' not found`);
        return result;
      }
    } else {
      // Get first published project
      targetProject = projects.find(p => !p.status || p.status === "published");
      if (!targetProject) {
        result.errors.push("No published projects found for sampling");
        return result;
      }
    }

    console.log(`📋 Processing sample project: ${targetProject.title}`);
    
    const chunks = processProjectsToKnowledge([targetProject]);
    
    result.projectCount = 1;
    result.chunks = chunks;
    result.chunkCount = chunks.length;
    result.success = true;
    
    console.log(`✅ Generated ${chunks.length} knowledge chunks for sample project`);
    
    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    result.errors.push(`Failed to fetch sample project knowledge: ${errorMessage}`);
    console.error("❌ Error fetching sample project knowledge:", error);
    
    return result;
  }
}

/**
 * Get knowledge statistics without processing all data
 */
export async function getProjectKnowledgeStats(): Promise<{
  totalProjects: number;
  publishedProjects: number;
  dataSource: string;
  estimatedChunks: number;
}> {
  try {
    const projects = await getProjects();
    const publishedProjects = projects.filter(p => !p.status || p.status === "published");
    
    // Estimate chunks (average 2-4 chunks per project)
    const estimatedChunks = publishedProjects.length * 3;
    
    return {
      totalProjects: projects.length,
      publishedProjects: publishedProjects.length,
      dataSource: getDataSource(),
      estimatedChunks,
    };
  } catch (error) {
    console.error("Error getting project knowledge stats:", error);
    return {
      totalProjects: 0,
      publishedProjects: 0,
      dataSource: "unavailable",
      estimatedChunks: 0,
    };
  }
}