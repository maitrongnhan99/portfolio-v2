"use client";

import { motion } from "framer-motion";
import { TechLogo } from "./tech-logo";

export default function HeroTechShowcase() {
  const technologies = [
    {
      name: "Next.js",
      logo: "/placeholder.svg?text=Next.js&width=80&height=80",
      darkLogo:
        "/placeholder.svg?text=Next.js&width=80&height=80&fontColor=ffffff",
    },
    {
      name: "React",
      logo: "/placeholder.svg?text=React&width=80&height=80",
      darkLogo:
        "/placeholder.svg?text=React&width=80&height=80&fontColor=ffffff",
    },
    {
      name: "TypeScript",
      logo: "/placeholder.svg?text=TS&width=80&height=80",
      darkLogo: "/placeholder.svg?text=TS&width=80&height=80&fontColor=ffffff",
    },
    {
      name: "TailwindCSS",
      logo: "/placeholder.svg?text=Tailwind&width=80&height=80",
      darkLogo:
        "/placeholder.svg?text=Tailwind&width=80&height=80&fontColor=ffffff",
    },
    {
      name: "PostgreSQL",
      logo: "/placeholder.svg?text=Postgres&width=80&height=80",
      darkLogo:
        "/placeholder.svg?text=Postgres&width=80&height=80&fontColor=ffffff",
    },
  ];

  return (
    <motion.div
      className="flex flex-wrap justify-center gap-6 md:gap-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      {technologies.map((tech, index) => (
        <TechLogo
          key={tech.name}
          name={tech.name}
          logo={tech.logo}
          darkLogo={tech.darkLogo}
          delay={0.2 + index * 0.1}
        />
      ))}
    </motion.div>
  );
}
