"use client";

import { ProjectGallery } from "@/components/common/project/project-gallery";
import { ProjectSidebar } from "@/components/common/project/project-sidebar";
import ScrollReveal from "@/components/common/scroll-reveal";
import { TechnologyBadges } from "@/components/common/technology-badges";
import { Button } from "@/components/ui/button";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import Link from "next/link";
import type { FC } from "react";

interface ProjectClientContentProps {
  project: any;
}

const ProjectClientContent: FC<ProjectClientContentProps> = ({ project }) => {
  return (
    <main
      data-testid="project-page"
      className="min-h-screen bg-canvas-white text-text-primary relative pt-20 pb-16"
    >
      <Container className="relative z-10">
        <div className="mb-8">
          <Button
            data-testid="project-back-button"
            variant="ghost"
            size="sm"
            asChild
            className="mb-6 rounded-pill border border-borderLight bg-canvas-white hover:bg-canvas-light"
          >
            <Link
              href="/#projects"
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          <motion.h1
            data-testid="project-title"
            className="text-display-section md:text-4xl font-light mb-4 text-text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {project.title}
          </motion.h1>

          <TechnologyBadges
            technologies={project.technologies}
            variant="secondary"
            className="mb-6"
            animated
            testId="project-tech-badges"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <ScrollReveal delay={0.1}>
              <div className="space-y-6">
                <div className="rounded-card bg-canvas-light border border-borderSubtle p-6 shadow-inset-border">
                  <h2 className="text-2xl font-light mb-4 text-text-primary">
                    Overview
                  </h2>
                  <div className="max-w-none text-text-secondary">
                    <p>{project.description}</p>
                    {project.longDescription && (
                      <div className="mt-4 whitespace-pre-wrap">
                        {typeof project.longDescription === "string" ? (
                          <p
                            dangerouslySetInnerHTML={{
                              __html: project.longDescription,
                            }}
                          />
                        ) : (
                          <div className="[&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1 [&_li]:text-text-secondary [&_p]:text-text-secondary [&_p]:mb-4 [&_h1]:text-text-primary [&_h2]:text-text-primary [&_h3]:text-text-primary [&_h4]:text-text-primary [&_h5]:text-text-primary [&_h6]:text-text-primary">
                            <RichText
                              data={
                                project.longDescription as SerializedEditorState
                              }
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <ProjectGallery
                  gallery={project.gallery}
                  projectTitle={project.title}
                />

                {project.features && (
                  <div
                    data-testid="project-features"
                    className="rounded-card bg-canvas-light border border-borderSubtle p-6 shadow-inset-border"
                  >
                    <h2 className="text-2xl font-light mb-4 text-text-primary">
                      Key Features
                    </h2>
                    <ul className="space-y-2">
                      {project.features.map(
                        (feature: string, index: number) => (
                          <motion.li
                            key={index}
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.5 }}
                          >
                            <span className="text-text-muted">•</span>
                            <span className="text-text-secondary">{feature}</span>
                          </motion.li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {project.challenges && (
                  <div
                    data-testid="project-challenges"
                    className="rounded-card bg-canvas-light border border-borderSubtle p-6 shadow-inset-border"
                  >
                    <h2 className="text-2xl font-light mb-4 text-text-primary">
                      Challenges
                    </h2>

                    <div className="mt-4 text-text-secondary whitespace-pre-wrap">
                      {typeof project.challenges === "string" ? (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: project.challenges,
                          }}
                        />
                      ) : (
                        <div className="[&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1 [&_li]:text-text-secondary [&_p]:text-text-secondary [&_p]:mb-4 [&_h1]:text-text-primary [&_h2]:text-text-primary [&_h3]:text-text-primary [&_h4]:text-text-primary [&_h5]:text-text-primary [&_h6]:text-text-primary">
                          <RichText
                            data={project.challenges as SerializedEditorState}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {project.solutions && (
                  <div
                    data-testid="project-solutions"
                    className="rounded-card bg-canvas-light border border-borderSubtle p-6 shadow-inset-border"
                  >
                    <h2 className="text-2xl font-light mb-4 text-text-primary">
                      Solutions
                    </h2>

                    <div className="mt-4 text-text-secondary">
                      {typeof project.solutions === "string" ? (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: project.solutions,
                          }}
                        />
                      ) : (
                        <div className="[&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1 [&_li]:text-text-secondary [&_p]:text-text-secondary [&_p]:mb-4 [&_h1]:text-text-primary [&_h2]:text-text-primary [&_h3]:text-text-primary [&_h4]:text-text-primary [&_h5]:text-text-primary [&_h6]:text-text-primary">
                          <RichText
                            data={project.solutions as SerializedEditorState}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>

          <div className="relative">
            <ProjectSidebar project={project} />
          </div>
        </div>
      </Container>
    </main>
  );
};

export { ProjectClientContent };
