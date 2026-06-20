"use client";

import { CodeEditor } from "./code-editor";
import ScrollReveal from "./scroll-reveal";

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-canvas-light py-24 border-b border-borderSubtle"
    >
      <div className="container px-4 md:px-6 relative z-10">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center mb-16">
              <p className="font-mono text-text-muted mb-2 text-sm">01. About</p>
              <h2 className="text-3xl md:text-4xl font-light text-text-primary mb-6">
                About Me
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <h3 className="text-2xl font-light mb-4 text-text-primary">
                Who I Am
              </h3>
              <p className="text-text-secondary mb-6 tracking-body">
                I&apos;m a passionate FullStack Developer with expertise in modern
                web technologies. With a strong foundation in both frontend and
                backend development, I create seamless, responsive, and
                user-friendly applications.
              </p>
              <p className="text-text-secondary mb-6 tracking-body">
                My journey in web development started 5 years ago, and since
                then, I&apos;ve worked on various projects ranging from small
                business websites to complex enterprise applications. I&apos;m
                constantly learning and adapting to new technologies to deliver
                the best solutions.
              </p>
              <p className="text-text-secondary mb-6 tracking-body">
                I&apos;m particularly passionate about integrating AI technologies
                into modern applications. I integrate LLMs and SDKs like OpenAI SDK,
                Claude SDK, and other cutting-edge AI tools to provide intelligent
                features for projects. From implementing chatbot functions to building
                RAG systems and AI-powered user experiences, I bridge the gap between
                traditional web development and the exciting world of artificial intelligence.
              </p>
              <p className="text-text-secondary tracking-body">
                My approach to AI integration focuses on creating practical,
                user-centric solutions that enhance functionality while maintaining
                performance and reliability. I stay at the forefront of AI developments,
                continuously exploring new models, APIs, and techniques to deliver
                innovative digital experiences that truly make a difference.
              </p>
            </ScrollReveal>

            <CodeEditor
              profile={{
                name: "Mai Trọng Nhân",
                title: "FullStack Developer",
                skills: ["React", "Next.js", "NestJS", "MongoDB", "PostgreSQL"],
                hardWorker: true,
                quickLearner: true,
                problemSolver: true,
                yearsOfExperience: 5,
              }}
            />
          </div>
      </div>
    </section>
  );
}
