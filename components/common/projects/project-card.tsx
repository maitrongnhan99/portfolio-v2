"use client";

import { TechnologyBadges } from "@/components/common/technology-badges";
import { Project } from "@/lib/data-service";
import { StarIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { ProjectLinks } from "./project-links";

interface ProjectCardProps {
  project: Project;
  reversed?: boolean;
}

const ProjectCard: FC<ProjectCardProps> = ({ project, reversed = false }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`flex flex-col gap-6 md:gap-10 ${
          reversed ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        <Link
          href={`/project/${project.slug}`}
          className="md:w-2/5 relative"
        >
          <div className="aspect-[4/3] relative overflow-hidden rounded-2xl">
            <Image
              src={
                imageError
                  ? "/placeholder.svg"
                  : project.image || "/placeholder.svg"
              }
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
          </div>
        </Link>

        <div className="md:w-3/5">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl md:text-2xl font-light text-text-primary group-hover:text-text-muted transition-colors">
              <Link
                href={`/project/${project.slug}`}
                className="flex items-center gap-2"
              >
                {project.title}
              </Link>
            </h3>

            {project.stars && (
              <div className="flex items-center text-text-secondary text-sm">
                <StarIcon className="h-3.5 w-3.5 mr-1 fill-text-secondary text-text-secondary" />
                {project.stars.toLocaleString()}
              </div>
            )}
          </div>

          <p className="text-text-secondary mb-4">{project.description}</p>

          <TechnologyBadges
            technologies={project.technologies}
            variant="outline"
            className="mb-4"
          />

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
