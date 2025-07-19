"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowUpRightIcon, StarIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { ProjectLinks } from "./project-links";

interface ProjectCardProps {
  project: {
    id: number;
    slug: string;
    title: string;
    description: string;
    image: string;
    category: string;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
    stars?: number;
    downloads?: number;
  };
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <Link
          href={`/project/${project.slug}`}
          className="block md:w-2/5 relative overflow-hidden rounded-lg border border-navy-lighter"
        >
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-navy/80 opacity-40 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>
        </Link>

        <div className="md:w-3/5">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl md:text-2xl font-bold text-slate-lighter group-hover:text-primary transition-colors">
              <Link
                href={`/project/${project.slug}`}
                className="flex items-center gap-2"
              >
                {project.title}
                <ArrowUpRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </h3>

            {project.stars && (
              <div className="flex items-center text-slate text-sm">
                <StarIcon className="h-3.5 w-3.5 mr-1 fill-slate text-slate" />
                {project.stars.toLocaleString()}
              </div>
            )}
          </div>

          <p className="text-slate mb-4">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="bg-navy-light border-navy-lighter text-slate-light px-3 py-1"
              >
                {tech}
              </Badge>
            ))}
          </div>

          <ProjectLinks
            liveUrl={project.liveUrl}
            githubUrl={project.githubUrl}
            downloads={project.downloads}
          />
        </div>
      </div>
    </motion.div>
  );
};

export { ProjectCard };
