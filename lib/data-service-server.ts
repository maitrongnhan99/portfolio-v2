import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import "server-only";
import {
  normalizeGallery,
  type GalleryImage,
  type Project,
} from "./data-service-types";
import { projectsData } from "./projects-data";

// Check if Payload CMS is enabled and available
const isPayloadEnabled = (): boolean => {
  return process.env.PAYLOAD_ENABLED === "true";
};

// Helper function to extract the best image URL from Payload image objects
const getImageUrl = (imageField: any): string => {
  if (!imageField) {
    return "/placeholder.svg"; // Fallback to placeholder
  }

  // If it's already a string, return it
  if (typeof imageField === "string") {
    return imageField;
  }

  // If it's an object, prefer publicUrl, then url, then filename with base path
  if (typeof imageField === "object") {
    // First priority: direct publicUrl from the hook, but fix the path if needed
    if (imageField.publicUrl) {
      // Remove /media/ prefix if it exists in the publicUrl
      return imageField.publicUrl.replace("/media/", "/");
    }

    // Second priority: construct correct Vercel Blob URL from filename
    if (imageField.filename) {
      const blobDomain =
        "https://xiaw58us2q2emqf3.public.blob.vercel-storage.com";
      return `${blobDomain}/${imageField.filename}`;
    }

    // Third priority: standard url field (fallback to local API)
    if (imageField.url) {
      return imageField.url;
    }
  }

  // Fallback to placeholder if we can't determine the URL
  return "/placeholder.svg";
};

const getProjectsFromPayload = async (): Promise<Project[]> => {
  try {
    const payload = await getPayload({ config });

    const response = await payload.find({
      collection: "projects",
      where: {
        status: {
          equals: "published",
        },
      },
      sort: "-date",
      limit: 100,
    });

    return response.docs.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      description: doc.description,
      longDescription: doc.longDescription,
      image: getImageUrl(doc.image),
      category: doc.category,
      technologies: doc.technologies?.map((tech: any) => tech.technology) || [],
      features: doc.features?.map((feature: any) => feature.feature) || [],
      challenges: doc.challenges,
      solutions: doc.solutions,
      date: doc.date,
      liveUrl: doc.liveUrl,
      githubUrl: doc.githubUrl,
      gallery:
        doc.gallery?.map(
          (item: any): GalleryImage => ({
            src: getImageUrl(item.image),
            caption: item.caption ?? undefined,
            alt: item.caption ?? undefined,
          })
        ) ?? [],
      featured: doc.featured || false,
      status: doc.status,
    }));
  } catch (error) {
    console.error("Error fetching projects from Payload:", error);
    throw error;
  }
};

const getProjectsFromStatic = (): Promise<Project[]> => {
  return Promise.resolve(
    projectsData.map((project) => ({
      ...project,
      gallery: normalizeGallery(project.gallery),
      technologies: project.technologies || [],
      featured: false,
      status: "published" as const,
    }))
  );
};

export const getProjects = cache(async (): Promise<Project[]> => {
  if (!isPayloadEnabled()) {
    return getProjectsFromStatic();
  }

  try {
    return await getProjectsFromPayload();
  } catch (error) {
    console.warn(
      "Payload CMS unavailable, falling back to static data:",
      error
    );
    return getProjectsFromStatic();
  }
});

export const getProjectBySlug = async (
  slug: string
): Promise<Project | null> => {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) || null;
};

export const getFeaturedProjects = async (): Promise<Project[]> => {
  const projects = await getProjects();
  return projects.filter((project) => project.featured);
};

export const getProjectsByCategory = async (
  category: string
): Promise<Project[]> => {
  const projects = await getProjects();
  return projects.filter(
    (project) => project.category.toLowerCase() === category.toLowerCase()
  );
};

export const getRecentProjects = async (
  limit: number = 6
): Promise<Project[]> => {
  const projects = await getProjects();
  return projects
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

export const getDataSource = (): string => {
  return isPayloadEnabled() ? "Payload CMS" : "Static Data";
};

// Health check for Payload CMS
export const checkPayloadHealth = async (): Promise<{
  available: boolean;
  source: string;
  error?: string;
}> => {
  if (!isPayloadEnabled()) {
    return {
      available: false,
      source: "Static Data",
      error: "Payload CMS is disabled",
    };
  }

  try {
    const payload = await getPayload({ config });
    await payload.find({
      collection: "projects",
      limit: 1,
    });

    return {
      available: true,
      source: "Payload CMS",
    };
  } catch (error) {
    return {
      available: false,
      source: "Static Data (Fallback)",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export type { GalleryImage, Project };
