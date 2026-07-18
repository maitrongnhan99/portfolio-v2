// Types for our data that can be shared between client and server
export interface GalleryImage {
  src: string;
  caption?: string;
  alt?: string;
}

export function normalizeGalleryItem(item: string | GalleryImage): GalleryImage {
  if (typeof item === "string") {
    return { src: item };
  }
  return item;
}

export function normalizeGallery(
  gallery: (string | GalleryImage)[] | undefined
): GalleryImage[] {
  if (!gallery) return [];
  return gallery.map(normalizeGalleryItem);
}

export interface Project {
  id: number | string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  image: string;
  category: string;
  technologies: string[];
  features?: string[];
  challenges?: string;
  solutions?: string;
  date: string;
  liveUrl?: string;
  githubUrl?: string;
  stars?: number;
  downloads?: number;
  gallery?: GalleryImage[];
  relatedProjects?: Array<{
    slug: string;
    title: string;
    image: string;
    category: string;
  }>;
  featured?: boolean;
  status?: "draft" | "review" | "published" | "archived";
}