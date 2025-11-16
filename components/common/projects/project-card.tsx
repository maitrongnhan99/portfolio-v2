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
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <Link
          href={`/project/${project.slug}`}
          className="block md:w-2/5 relative overflow-hidden"
        >
          <div className="aspect-video h-full relative overflow-hidden">
            <Image
              src={
                imageError
                  ? "/placeholder.svg"
                  : project.image || "/placeholder.svg"
              }
              alt={project.title}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
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
