import { ProjectClientContent } from "@/components/common/project/project-client-content";
import { ProjectStructuredData } from "@/components/common/seo/project-structured-data";
import { getProjects, getProjectBySlug } from "@/lib/data-service-server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Fallback to empty array - pages will be generated on-demand
    return [];
  }
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://maitrongnhan.com";

  return {
    title: `${project.title} - Mai Trọng Nhân Portfolio`,
    description: project.description,
    keywords: [
      ...project.technologies,
      "portfolio",
      "project",
      project.category,
      "Mai Trọng Nhân",
    ],
    authors: [{ name: "Mai Trọng Nhân" }],
    creator: "Mai Trọng Nhân",
    publisher: "Mai Trọng Nhân",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.description,
      url: `${baseUrl}/project/${project.slug}`,
      siteName: "Mai Trọng Nhân Portfolio",
      images: project.image
        ? [
            {
              url: project.image.startsWith("http")
                ? project.image
                : `${baseUrl}${project.image}`,
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : undefined,
      locale: "en_US",
      publishedTime: project.date,
      authors: ["Mai Trọng Nhân"],
      tags: project.technologies,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      creator: "@maitrongnhan",
      images: project.image
        ? [
            project.image.startsWith("http")
              ? project.image
              : `${baseUrl}${project.image}`,
          ]
        : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/project/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <ProjectStructuredData project={project} />
      <ProjectClientContent project={project} />
    </>
  );
}
