"use client";

import AnimatedGradient from "@/components/common/animated-gradient";
import ScrollReveal from "@/components/common/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sanitizeUrl } from "@/lib/validation";
import {
  ArrowLeftIcon,
  CalendarIcon,
  GithubLogoIcon as Github,
  LinkIcon,
  TagIcon,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

interface ProjectClientContentProps {
  project: any;
}

const ProjectClientContent: FC<ProjectClientContentProps> = ({ project }) => {
  return (
    <main data-testid="project-page" className="relative pt-20 pb-16">
      <AnimatedGradient className="opacity-80" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="mb-8">
          <Button
            data-testid="project-back-button"
            variant="ghost"
            size="sm"
            asChild
            className="mb-6 rounded-full"
          >
            <Link href="/#projects" className="flex items-center gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          <motion.h1
            data-testid="project-title"
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {project.title}
          </motion.h1>

          <div data-testid="project-tech-badges" className="flex flex-wrap gap-3 mb-6">
            {project.technologies.map((tech: string) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <ScrollReveal>
              <div data-testid="project-gallery" className="relative aspect-video overflow-hidden rounded-xl border mb-8">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{project.description}</p>
                    {project.longDescription && (
                      <p className="mt-4">{project.longDescription}</p>
                    )}
                  </div>
                </div>

                {project.features && (
                  <div data-testid="project-features">
                    <h2 className="text-2xl font-semibold mb-4">
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
                            <span className="text-primary mt-1">•</span>
                            <span>{feature}</span>
                          </motion.li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {project.challenges && (
                  <div data-testid="project-challenges">
                    <h2 className="text-2xl font-semibold mb-4">
                      Challenges & Solutions
                    </h2>
                    <p>{project.challenges}</p>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {project.gallery && project.gallery.length > 0 && (
              <ScrollReveal delay={0.2}>
                <div className="mt-12">
                  <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.gallery.map((image: string, index: number) => (
                      <motion.div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden border"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${project.title} screenshot ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

          <div>
            <div className="sticky top-24">
              <ScrollReveal direction="right">
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">
                    Project Details
                  </h3>

                  <div className="space-y-4">
                    {project.date && (
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{project.date}</span>
                      </div>
                    )}

                    {project.category && (
                      <div className="flex items-center gap-2">
                        <TagIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{project.category}</span>
                      </div>
                    )}

                    <div className="pt-4 space-y-3">
                      <Button asChild className="w-full" data-testid="project-demo-link">
                        <Link href={sanitizeUrl(project.liveUrl)} target="_blank">
                          <LinkIcon className="mr-2 h-4 w-4" />
                          View Live Demo
                        </Link>
                      </Button>

                      <Button asChild variant="outline" className="w-full" data-testid="project-github-link">
                        <Link href={sanitizeUrl(project.githubUrl)} target="_blank">
                          <Github className="mr-2 h-4 w-4" />
                          View Source Code
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {project.relatedProjects &&
                project.relatedProjects.length > 0 && (
                  <ScrollReveal direction="right" delay={0.1}>
                    <div data-testid="related-projects" className="bg-card rounded-xl border p-6 shadow-sm mt-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Related Projects
                      </h3>
                      <div className="space-y-3">
                        {project.relatedProjects.map((related: any) => (
                          <Link
                            key={related.slug}
                            href={`/project/${related.slug}`}
                            className="block"
                          >
                            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                              <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={related.image || "/placeholder.svg"}
                                  alt={related.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">
                                  {related.title}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {related.category}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export { ProjectClientContent };