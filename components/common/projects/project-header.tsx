"use client";

import { FC } from "react";
import ScrollReveal from "../scroll-reveal";

const ProjectHeader: FC = () => {
  return (
    <ScrollReveal>
      <div className="flex flex-col items-center text-center mb-16">
        <p className="font-mono text-primary mb-2 text-sm">03. My Work</p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-lighter mb-6">
          Some Things I've Built
        </h2>
      </div>
    </ScrollReveal>
  );
};

export { ProjectHeader };
