"use client";

import { Container } from "@/components/ui/container";
import { CodeEditor } from "./code-editor";
import ScrollReveal from "./scroll-reveal";

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-canvas-white dark:bg-canvas-light py-24"
    >
      <Container className="relative z-10">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center mb-16">
              <p className="font-mono text-text-muted mb-2 text-sm">
                <span className="text-logo-blue">01.</span> About me
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-text-primary mb-6">
                Who am I
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <ScrollReveal direction="up" className="min-w-0">
              <p className="text-lg text-text-secondary mb-6 tracking-body">
                I&apos;m an AI Applied Engineer and Full Stack Engineer with 5
                years of experience shipping seamless, responsive products end
                to end - from frontend to backend.
              </p>
              <p className="text-lg text-text-secondary tracking-body">
                I bring AI into real products: integrating LLMs with the OpenAI
                and Claude SDKs and LangChain, and building RAG systems and
                AI-powered experiences that are practical, reliable, and
                genuinely useful.
              </p>
            </ScrollReveal>

            <div className="min-w-0">
              <CodeEditor
                profile={{
                  name: "Mai Trọng Nhân",
                  title: "AI Applied Engineer",
                  skills: ["React", "Next.js", "NestJS", "MongoDB", "PostgreSQL", "OpenAI SDK", "LangChain", "RAG"],
                  hardWorker: true,
                  quickLearner: true,
                  problemSolver: true,
                  yearsOfExperience: 5,
                }}
              />
            </div>
          </div>
      </Container>
    </section>
  );
}
