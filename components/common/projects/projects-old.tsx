"use client";

import { Project, getProjects } from "@/lib/data-service";
import { FC, useState, useEffect } from "react";
import { Spotlight } from "../../ui/spotlight-new";
import ScrollReveal from "../scroll-reveal";
import { ProjectCard } from "./project-card";
import { ProjectCategories } from "./project-categories";
import { ProjectHeader } from "./project-header";

const Projects: FC = () => {
  const categories = ["All", "Frontend", "FullStack", "Backend"];
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await getProjects();
        setProjects(projectsData);
        setError(null);
      } catch (err) {
        setError('Failed to load projects');
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  if (loading) {
    return (
      <section id="projects" className="relative py-32 bg-navy overflow-hidden">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-lg">Loading projects...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="relative py-32 bg-navy overflow-hidden">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-400 text-lg">{error}</div>
          </div>
        </div>
      </section>
    );
  }

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
