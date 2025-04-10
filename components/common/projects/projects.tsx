"use client";

import { projectsData } from "@/lib/projects-data";
import { FC, useState } from "react";
import { Spotlight } from "../../ui/spotlight-new";
import ScrollReveal from "../scroll-reveal";
import { ProjectCard } from "./project-card";
import { ProjectCategories } from "./project-categories";
import { ProjectHeader } from "./project-header";

const Projects: FC = () => {
  const categories = ["All", "Frontend", "FullStack", "Backend"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projectsData
      : projectsData.filter((project) => project.category === activeCategory);

  return (
    <section id="projects" className="relative py-32 bg-navy overflow-hidden">
      <Spotlight />

      <div className="container px-4 md:px-6 max-w-5xl mx-auto">
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
              direction={index % 2 === 0 ? "left" : "right"}
            >
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Projects };
