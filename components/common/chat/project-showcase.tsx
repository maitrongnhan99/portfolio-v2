"use client";

import { projectsData } from "@/lib/projects-data";
import { ArrowUpRightIcon, FolderNotchIcon, SparkleIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

interface ProjectShowcaseProps {
  onSendMessage: (message: string) => void;
  isVisible: boolean;
}

export const ProjectShowcase = ({ onSendMessage, isVisible }: ProjectShowcaseProps) => {
  const featuredProjects = useMemo(() => projectsData.slice(0, 3), []);

  if (!isVisible || featuredProjects.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6 flex gap-3"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
        <FolderNotchIcon className="w-4 h-4 text-primary" />
      </div>

      <div className="flex-1">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <SparkleIcon className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-slate-lighter">Featured Projects</h3>
          </div>
          <p className="text-xs text-slate/70">
            Explore Mai&apos;s previous work. Ask about a project or jump straight to the full case study.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: index * 0.08 }}
              className="group rounded-xl border border-navy-lighter/60 bg-navy/40 backdrop-blur-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() =>
                  onSendMessage(`Tell me more about the ${project.title} project and the problems it solves.`)
                }
                className="w-full text-left focus:outline-none"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wide text-slate/80">
                    Ask about this project →
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-lighter group-hover:text-primary transition-colors">
                      {project.title}
                    </h4>
                    <ArrowUpRightIcon className="w-3.5 h-3.5 text-slate/50 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs text-slate/70 leading-relaxed min-h-[3rem]">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] uppercase tracking-wide text-slate/60 bg-navy-light/60 border border-navy-lighter/60 rounded-full px-2 py-1"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </button>

              <div className="flex items-center justify-between border-t border-navy-lighter/50 bg-navy/60 px-3 py-2 text-[11px] text-slate/70">
                <span>View the full breakdown</span>
                <Link
                  href={`/project/${project.slug}`}
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
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
