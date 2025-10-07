import { Project } from "@/lib/data-service-server";
import { ProjectsClient } from "./projects-client";

interface ProjectsServerProps {
  projects: Project[];
}

export function ProjectsServer({ projects }: ProjectsServerProps) {
  return <ProjectsClient projects={projects} />;
}