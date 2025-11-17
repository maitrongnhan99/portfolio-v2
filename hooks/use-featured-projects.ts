import { Project } from "@/lib/data-service-types";
import { useQuery } from "@tanstack/react-query";

interface ProjectsApiResponse {
  projects: Project[];
}

interface UseFeaturedProjectsOptions {
  limit?: number;
  enabled?: boolean;
}

async function fetchFeaturedProjects(limit: number = 3): Promise<Project[]> {
  const response = await fetch(`/api/projects?limit=${limit}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
  }
  
  const data: ProjectsApiResponse = await response.json();
  return data.projects;
}

export function useFeaturedProjects(options: UseFeaturedProjectsOptions = {}) {
  const { limit = 3, enabled = true } = options;
  
  return useQuery({
    queryKey: ["featured-projects", limit],
    queryFn: () => fetchFeaturedProjects(limit),
    enabled,
    // Cache for 5 minutes before considering stale
    staleTime: 5 * 60 * 1000,
    // Keep in cache for 10 minutes
    gcTime: 10 * 60 * 1000,
    // Retry failed requests twice
    retry: 2,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
    // Refetch on reconnect
    refetchOnReconnect: true,
  });
}