"use client";

import {
  ArrowLeftIcon,
  CalendarIcon,
  GithubLogoIcon as Github,
  LinkIcon,
  TagIcon,
} from "@phosphor-icons/react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { TechnologyBadges } from "@/components/common/technology-badges";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { GalleryImage } from "@/lib/data-service-types";
import { sanitizeUrl } from "@/lib/validation";

interface ProjectHeroProps {
  project: {
    title: string;
    description: string;
    image: string;
    category: string;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
    date?: string;
    stars?: number;
    downloads?: number;
    gallery?: GalleryImage[];
  };
}

const PLACEHOLDER_IMAGE = "/placeholder.svg?height=400&width=600";

const formatDate = (date: string): string => {
  try {
    const parsed = dayjs(date);
    if (!parsed.isValid()) {
      return date;
    }
    return parsed.format("MMM YYYY");
  } catch {
    return date;
  }
};

export const ProjectHero: FC<ProjectHeroProps> = ({ project }) => {
  const hasImage = Boolean(project.image) && project.image !== PLACEHOLDER_IMAGE;
  const hasCta = Boolean(project.liveUrl) || Boolean(project.githubUrl);

  return (
    <section className="pt-20 pb-4 bg-canvas-white">
      <Container>
        <Link
          href="/#projects"
          data-testid="project-back-button"
          className="inline-flex items-center gap-2 rounded-pill border border-borderLight bg-canvas-white px-4 py-2 text-sm text-text-secondary hover:bg-canvas-light hover:text-text-primary transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mt-6">
          <div>
            <span className="block font-mono text-xs tracking-widest uppercase text-text-muted mb-4">
              {project.category}
            </span>

            <motion.h1
              data-testid="project-title"
              className="text-3xl md:text-4xl lg:text-5xl font-light leading-snug mb-5 text-text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {project.title}
            </motion.h1>

            <p className="text-text-secondary text-base leading-relaxed mb-6 max-w-prose">
              {project.description}
            </p>

            <TechnologyBadges
              technologies={project.technologies}
              variant="secondary"
              animated
              testId="project-tech-badges"
            />

            {hasCta && (
              <div className="flex flex-wrap gap-3 mt-6">
                {project.liveUrl && (
                  <Button
                    asChild
                    className="rounded-pill bg-text-primary text-canvas-white hover:bg-text-primary/90 shadow-card"
                  >
                    <Link
                      href={sanitizeUrl(project.liveUrl)}
                      target="_blank"
                      className="flex items-center gap-2"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Live Demo
                    </Link>
                  </Button>
                )}

                {project.githubUrl && (
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-pill border-borderLight bg-canvas-white text-text-primary hover:bg-canvas-light shadow-outline-ring"
                  >
                    <Link
                      href={sanitizeUrl(project.githubUrl)}
                      target="_blank"
                      className="flex items-center gap-2"
                    >
                      <Github className="h-4 w-4" />
                      Source
                    </Link>
                  </Button>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-5 pt-5 border-t border-borderSubtle mt-6 text-sm text-text-muted">
              {project.date && (
                <span className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {formatDate(project.date)}
                </span>
              )}

              {project.category && (
                <span className="flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  {project.category}
                </span>
              )}

              {project.stars != null && (
                <span className="flex items-center gap-2">
                  <span aria-hidden>★</span>
                  {project.stars.toLocaleString()} stars
                </span>
              )}

              {project.downloads != null && (
                <span className="flex items-center gap-2">
                  <span aria-hidden>↓</span>
                  {project.downloads.toLocaleString()} downloads
                </span>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            <div className="relative aspect-[16/9] rounded-featured overflow-hidden border border-borderLight shadow-card bg-canvas-light">
              {hasImage ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-canvas-warm flex items-center justify-center rounded-featured">
                  <span className="font-mono text-xs tracking-widest text-text-muted uppercase">
                    Project Preview
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
