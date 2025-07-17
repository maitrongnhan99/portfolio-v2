"use client";

import { motion } from "framer-motion";
import { LampContainer } from "../ui/lamp";
import { CodeEditor } from "./code-editor";
import ScrollReveal from "./scroll-reveal";

export default function About() {
  return (
    <LampContainer className="py-12 rounded-none md:rounded-md">
      <section id="about" className="relative overflow-hidden">
        <div className="container pt-96 px-4 md:px-6 relative z-10">
          <ScrollReveal>
            <div className="flex flex-col gap-4 items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter text-slate-lighter">
                About Me
              </h2>
              <motion.div
                className="w-20 h-1 bg-primary rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <h3 className="text-2xl font-semibold mb-4 text-slate-lighter">
                Who I Am
              </h3>
              <p className="text-muted-foreground mb-6">
                I&apos;m a passionate FullStack Developer with expertise in modern
                web technologies. With a strong foundation in both frontend and
                backend development, I create seamless, responsive, and
                user-friendly applications.
              </p>
              <p className="text-muted-foreground">
                My journey in web development started 5 years ago, and since
                then, I&apos;ve worked on various projects ranging from small
                business websites to complex enterprise applications. I&apos;m
                constantly learning and adapting to new technologies to deliver
                the best solutions.
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
    </LampContainer>
  );
}
