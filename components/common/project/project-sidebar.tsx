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
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">
            Project Details
          </h3>

          <div className="space-y-4">
            {project.date && (
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-slate-300">
                  {dayjs(project.date).format("DD-MM-YYYY")}
                </span>
              </div>
            )}

            {project.category && (
              <div className="flex items-center gap-2">
                <TagIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-slate-300">
                  {project.category}
                </span>
              </div>
            )}

            <div className="pt-4 space-y-3">
              {project.liveUrl && (
                <Button
                  asChild
                  className="w-full rounded-lg flex items-center gap-2 text-white"
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
                  className="w-full rounded-lg flex items-center gap-2 text-white"
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
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 shadow-sm mt-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-slate-200">
              Related Projects
            </h3>
            <div className="space-y-3">
              {project.relatedProjects.map((related: any) => (
                <Link
                  key={related.slug}
                  href={`/project/${related.slug}`}
                  className="block"
                >
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-700/50 transition-colors">
                    <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={related.image || "/placeholder.svg"}
                        alt={related.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">
                        {related.title}
                      </h4>
                      <p className="text-xs text-slate-400">
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
