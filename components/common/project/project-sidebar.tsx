"use client";

import ScrollReveal from "@/components/common/scroll-reveal";
import { Button } from "@/components/ui/button";
import { sanitizeUrl } from "@/lib/validation";
import {
  CalendarIcon,
  GithubLogoIcon as Github,
  LinkIcon,
  TagIcon,
} from "@phosphor-icons/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

interface ProjectSidebarProps {
  project: any;
  className?: string;
}

export const ProjectSidebar: FC<ProjectSidebarProps> = ({
  project,
  className = "",
}) => {
  return (
    <div className={`sticky top-24 ${className}`}>
      <ScrollReveal direction="right">
        <div className="bg-canvas-white rounded-card border border-borderLight p-6 shadow-outline-ring">
          <h3 className="text-xl font-light mb-4 text-text-primary">
            Project Details
          </h3>

          <div className="space-y-4">
            {project.date && (
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-text-muted" />
                <span className="text-sm text-text-secondary">
                  {dayjs(project.date).format("DD-MM-YYYY")}
                </span>
              </div>
            )}

            {project.category && (
              <div className="flex items-center gap-2">
                <TagIcon className="h-4 w-4 text-text-muted" />
                <span className="text-sm text-text-secondary">
                  {project.category}
                </span>
              </div>
            )}

            <div className="pt-4 space-y-3">
              {project.liveUrl && (
                <Button
                  asChild
                  className="w-full rounded-pill flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-card"
                  data-testid="project-demo-link"
                >
                  <Link href={sanitizeUrl(project.liveUrl)} target="_blank">
                    <LinkIcon className="h-4 w-4" />
                    View Live Demo
                  </Link>
                </Button>
              )}

              {project.githubUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-pill flex items-center gap-2 border-borderLight bg-canvas-white text-text-primary hover:bg-canvas-light"
                  data-testid="project-github-link"
                >
                  <Link href={sanitizeUrl(project.githubUrl)} target="_blank">
                    <Github className="h-4 w-4" />
                    View Source Code
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {project.relatedProjects && project.relatedProjects.length > 0 && (
        <ScrollReveal direction="right" delay={0.1}>
          <div
            data-testid="related-projects"
            className="bg-canvas-white rounded-card border border-borderLight p-6 shadow-outline-ring mt-6"
          >
            <h3 className="text-lg font-light mb-4 text-text-primary">
              Related Projects
            </h3>
            <div className="space-y-3">
              {project.relatedProjects.map((related: any) => (
                <Link
                  key={related.slug}
                  href={`/project/${related.slug}`}
                  className="block"
                >
                  <div className="flex items-center gap-3 p-2 rounded-comfortable hover:bg-canvas-light transition-colors">
                    <div className="relative w-12 h-12 rounded overflow-hidden shrink-0">
                      <Image
                        src={related.image || "/placeholder.svg"}
                        alt={related.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">
                        {related.title}
                      </h4>
                      <p className="text-xs text-text-muted">
                        {related.category}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
};
