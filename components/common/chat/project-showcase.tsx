"use client";

import { useFeaturedProjects } from "@/hooks/use-featured-projects";
import {
  ArrowUpRightIcon,
  FolderNotchIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface ProjectShowcaseProps {
  onSendMessage: (message: string) => void;
  isVisible: boolean;
}

export const ProjectShowcase: FC<ProjectShowcaseProps> = ({
  onSendMessage,
  isVisible,
}) => {
  const {
    data: featuredProjects = [],
    isLoading,
    error,
  } = useFeaturedProjects({
    limit: 3,
    enabled: isVisible,
  });

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Show loading skeleton while fetching
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6 flex gap-3"
      >
        <div className="shrink-0 w-8 h-8 rounded-full bg-canvas-warm border border-borderSubtle shadow-inset-border flex items-center justify-center">
          <FolderNotchIcon className="w-4 h-4 text-text-muted" />
        </div>
        <div className="flex-1">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <SparkleIcon className="w-4 h-4 text-text-muted" />
              <h3 className="text-sm font-medium text-text-primary">
                Featured Projects
              </h3>
            </div>
            <p className="text-xs text-text-secondary">
              Loading featured projects...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-card border border-borderSubtle bg-canvas-near backdrop-blur-xs overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-secondary"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-secondary rounded"></div>
                  <div className="h-10 bg-secondary rounded"></div>
                  <div className="flex gap-1">
                    <div className="h-6 w-12 bg-secondary rounded-full"></div>
                    <div className="h-6 w-16 bg-secondary rounded-full"></div>
                    <div className="h-6 w-14 bg-secondary rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Show error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6 flex gap-3"
      >
        <div className="shrink-0 w-8 h-8 rounded-full bg-canvas-warm border border-borderSubtle shadow-inset-border flex items-center justify-center">
          <FolderNotchIcon className="w-4 h-4 text-text-muted" />
        </div>
        <div className="flex-1">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <SparkleIcon className="w-4 h-4 text-text-muted" />
              <h3 className="text-sm font-medium text-text-primary">
                Featured Projects
              </h3>
            </div>
            <p className="text-xs text-text-secondary">
              Failed to load projects. Please try again later.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Don't render if no projects
  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6 flex gap-3"
    >
      <div className="shrink-0 w-8 h-8 rounded-full bg-canvas-warm border border-borderSubtle shadow-inset-border flex items-center justify-center">
        <FolderNotchIcon className="w-4 h-4 text-text-muted" />
      </div>

      <div className="flex-1">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <SparkleIcon className="w-4 h-4 text-text-muted" />
            <h3 className="text-sm font-medium text-text-primary">
              Featured Projects
            </h3>
          </div>
          <p className="text-xs text-text-secondary">
            Explore Mai&apos;s previous work. Ask about a project or jump
            straight to the full case study.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: index * 0.08 }}
              className="group rounded-card border border-borderSubtle bg-canvas-near backdrop-blur-xs overflow-hidden flex flex-col shadow-outline-ring"
            >
              <button
                type="button"
                onClick={() =>
                  onSendMessage(
                    `Tell me more about the ${project.title} project and the problems it solves.`
                  )
                }
                className="w-full text-left focus:outline-hidden flex-1"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background via-background/35 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wide text-text-muted">
                    Ask about this project →
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-text-primary transition-colors">
                      {project.title}
                    </h4>
                    <ArrowUpRightIcon className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary transition-colors" />
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed min-h-12">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] uppercase tracking-wide text-text-muted bg-canvas-warm border border-borderSubtle rounded-full px-2 py-1"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </button>

              <div className="flex items-center justify-between border-t border-borderSubtle bg-canvas-light px-3 py-2 text-[11px] text-text-secondary">
                <span>View the full breakdown</span>
                <Link
                  href={`/project/${project.slug}`}
                  className="inline-flex items-center gap-1 text-text-primary hover:text-text-muted transition-colors"
                >
                  View
                  <ArrowUpRightIcon className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
