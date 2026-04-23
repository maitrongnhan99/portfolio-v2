"use client";

import { FC } from "react";
import ScrollReveal from "../scroll-reveal";

const ProjectHeader: FC = () => {
  return (
    <ScrollReveal>
      <div className="flex flex-col items-center text-center mb-16">
        <p className="font-mono text-text-muted mb-2 text-sm">03. My Work</p>
        <h2 className="text-3xl md:text-4xl font-light text-text-primary mb-6">
          Some Things I&apos;ve Built
        </h2>
      </div>
    </ScrollReveal>
  );
};

export { ProjectHeader };
