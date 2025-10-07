import { projectsData } from "./projects-data";
import type { Project } from "./data-service-types";

// Client-safe data service that only uses static data
// For server-side Payload CMS functionality, use data-service-server.ts

// Get projects from static data (client-safe)
export const getProjects = async (): Promise<Project[]> => {
  return Promise.resolve(
    projectsData.map((project) => ({
      ...project,
      technologies: project.technologies || [],
      featured: false,
      status: "published" as const,
    }))
  );
};

// Get a single project by slug
export const getProjectBySlug = async (
  slug: string
): Promise<Project | null> => {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) || null;
};

// Get featured projects
export const getFeaturedProjects = async (): Promise<Project[]> => {
  const projects = await getProjects();
  return projects.filter((project) => project.featured);
};

// Get projects by category
export const getProjectsByCategory = async (
  category: string
): Promise<Project[]> => {
  const projects = await getProjects();
  return projects.filter(
    (project) => project.category.toLowerCase() === category.toLowerCase()
  );
};

// Get recent projects
export const getRecentProjects = async (
  limit: number = 6
): Promise<Project[]> => {
  const projects = await getProjects();
  return projects
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

// Data source information for debugging (client-safe)
export const getDataSource = (): string => {
  return "Static Data";
};

// Export types for use elsewhere
export type { Project };
