// Types for our data that can be shared between client and server
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
  date: string;
  liveUrl?: string;
  githubUrl?: string;
  stars?: number;
  downloads?: number;
  gallery?: string[];
  relatedProjects?: Array<{
    slug: string;
    title: string;
    image: string;
    category: string;
  }>;
  featured?: boolean;
  status?: "draft" | "review" | "published" | "archived";
}