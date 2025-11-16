"use client";

import { ProjectGallery } from "@/components/common/project/project-gallery";
import { ProjectSidebar } from "@/components/common/project/project-sidebar";
import ScrollReveal from "@/components/common/scroll-reveal";
import { TechnologyBadges } from "@/components/common/technology-badges";
import { Button } from "@/components/ui/button";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
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
      className="min-h-screen bg-navy relative pt-20 pb-16"
      style={{ backgroundColor: "#0b192f" }}
    >
      <div className="container px-4 md:px-6 relative z-10">
        <div className="mb-8">
          <Button
            data-testid="project-back-button"
            variant="ghost"
            size="sm"
            asChild
            className="mb-6 rounded-full hover:bg-navy/80"
          >
            <Link
              href="/#projects"
              className="flex items-center gap-2 text-slate-300 hover:text-slate-100"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          <motion.h1
            data-testid="project-title"
            className="text-3xl md:text-4xl font-bold mb-4 text-slate-100"
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
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-slate-200">
                    Overview
                  </h2>
                  <div className="prose dark:prose-invert max-w-none text-slate-300">
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
                          <div className="[&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1 [&_li]:text-slate-300 [&_p]:text-slate-300 [&_p]:mb-4 [&_h1]:text-slate-200 [&_h2]:text-slate-200 [&_h3]:text-slate-200 [&_h4]:text-slate-200 [&_h5]:text-slate-200 [&_h6]:text-slate-200">
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
                  <div data-testid="project-features">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-200">
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
                            <span className="text-primary">•</span>
                            <span className="text-slate-300">{feature}</span>
                          </motion.li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {project.challenges && (
                  <div data-testid="project-challenges">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-200">
                      Challenges
                    </h2>

                    <div className="mt-4 text-slate-300 whitespace-pre-wrap">
                      {typeof project.challenges === "string" ? (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: project.challenges,
                          }}
                        />
                      ) : (
                        <div className="[&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1 [&_li]:text-slate-300 [&_p]:text-slate-300 [&_p]:mb-4 [&_h1]:text-slate-200 [&_h2]:text-slate-200 [&_h3]:text-slate-200 [&_h4]:text-slate-200 [&_h5]:text-slate-200 [&_h6]:text-slate-200">
                          <RichText
                            data={project.challenges as SerializedEditorState}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {project.solutions && (
                  <div data-testid="project-solutions">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-200">
                      Solutions
                    </h2>

                    <div className="mt-4 text-slate-300">
                      {typeof project.solutions === "string" ? (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: project.solutions,
                          }}
                        />
                      ) : (
                        <div className="[&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1 [&_li]:text-slate-300 [&_p]:text-slate-300 [&_p]:mb-4 [&_h1]:text-slate-200 [&_h2]:text-slate-200 [&_h3]:text-slate-200 [&_h4]:text-slate-200 [&_h5]:text-slate-200 [&_h6]:text-slate-200">
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
      </div>

      <ShootingStars />
      <StarsBackground />
    </main>
  );
};

export { ProjectClientContent };
