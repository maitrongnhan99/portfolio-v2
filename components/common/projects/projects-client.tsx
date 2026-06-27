"use client";

import { Container } from "@/components/ui/container";
import { Project } from "@/lib/data-service";
import { FC, useState } from "react";
import ScrollReveal from "../scroll-reveal";
import { ProjectCard } from "./project-card";
import { ProjectCategories } from "./project-categories";
import { ProjectHeader } from "./project-header";

interface ProjectsClientProps {
  projects: Project[];
}

const ProjectsClient: FC<ProjectsClientProps> = ({ projects }) => {
  const categories = ["All", "Frontend", "FullStack", "Backend"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <section
      id="projects"
      className="relative py-24 bg-canvas-white dark:bg-canvas-light overflow-hidden"
    >
      <Container>
        <ProjectHeader />

        <ProjectCategories
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="space-y-12 md:space-y-24">
          {filteredProjects.map((project, index) => (
            <ScrollReveal
              key={project.id}
              delay={0.1 * index}
              direction="up"
            >
              <ProjectCard project={project} reversed={index % 2 === 1} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
};

export { ProjectsClient };
