"use client";

import { FC } from "react";
import { AiOutlineHighlight } from "react-icons/ai";
import {
  FaAws,
  FaCloud,
  FaCode,
  FaCss3Alt,
  FaDatabase,
  FaDocker,
  FaFigma,
  FaGitAlt,
  FaHtml5,
  FaLinux,
  FaNodeJs,
  FaPalette,
  FaPython,
  FaReact,
  FaShapes,
  FaTools,
} from "react-icons/fa";
import { GiWireframeGlobe } from "react-icons/gi";
import { GoWorkflow } from "react-icons/go";
import { LuBrainCircuit, LuLayoutDashboard } from "react-icons/lu";
import { MdAnimation, MdMovie } from "react-icons/md";
import {
  SiFirebase,
  SiGraphql,
  SiJest,
  SiKubernetes,
  SiMongodb,
  SiNextdotjs,
  SiPostgresql,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
  SiWebpack,
} from "react-icons/si";
import { TbApi, TbBrandVscode, TbVectorTriangle } from "react-icons/tb";
import { Container } from "@/components/ui/container";
import { GlowingEffect } from "../ui/glowing-effect";
import ScrollReveal from "./scroll-reveal";

interface Skill {
  name: string;
  icon: React.ElementType;
  iconColor?: string;
}

interface SkillCategory {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  skills: Skill[];
}

const skillsData: SkillCategory[] = [
  {
    title: "Frontend Development",
    icon: FaCode,
    iconColor: "#d97706",
    skills: [
      { name: "React", icon: FaReact, iconColor: "#149eca" },
      { name: "Next.js", icon: SiNextdotjs, iconColor: "#4f46e5" },
      { name: "TypeScript", icon: SiTypescript, iconColor: "#3178c6" },
      { name: "Tailwind CSS", icon: SiTailwindcss, iconColor: "#06b6d4" },
      { name: "HTML5", icon: FaHtml5, iconColor: "#e34f26" },
      { name: "CSS3", icon: FaCss3Alt, iconColor: "#1572b6" },
    ],
  },
  {
    title: "Backend Development",
    icon: FaDatabase,
    iconColor: "#4169e1",
    skills: [
      { name: "Node.js", icon: FaNodeJs, iconColor: "#339933" },
      { name: "Python", icon: FaPython, iconColor: "#3776ab" },
      { name: "PostgreSQL", icon: SiPostgresql, iconColor: "#4169e1" },
      { name: "MongoDB", icon: SiMongodb, iconColor: "#47a248" },
      { name: "REST APIs", icon: TbApi, iconColor: "#8b5cf6" },
      { name: "GraphQL", icon: SiGraphql, iconColor: "#e10098" },
    ],
  },
  {
    title: "UI/UX Design",
    icon: FaPalette,
    iconColor: "#9b6b43",
    skills: [
      { name: "Figma", icon: FaFigma, iconColor: "#f24e1e" },
      { name: "Responsive Design", icon: LuLayoutDashboard, iconColor: "#0f766e" },
      { name: "Wireframing", icon: GiWireframeGlobe, iconColor: "#64748b" },
      { name: "Prototyping", icon: AiOutlineHighlight, iconColor: "#b45309" },
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: FaCloud,
    iconColor: "#2496ed",
    skills: [
      { name: "AWS", icon: FaAws, iconColor: "#ff9900" },
      { name: "Docker", icon: FaDocker, iconColor: "#2496ed" },
      { name: "CI/CD", icon: GoWorkflow, iconColor: "#0f766e" },
      { name: "Kubernetes", icon: SiKubernetes, iconColor: "#326ce5" },
      { name: "Git", icon: FaGitAlt, iconColor: "#f05032" },
      { name: "Linux", icon: FaLinux, iconColor: "#f59e0b" },
    ],
  },
  {
    title: "Tools & Technologies",
    icon: FaTools,
    iconColor: "#b45309",
    skills: [
      { name: "VS Code", icon: TbBrandVscode, iconColor: "#007acc" },
      { name: "Jest", icon: SiJest, iconColor: "#c21325" },
      { name: "Webpack", icon: SiWebpack, iconColor: "#1c78c0" },
      { name: "Redux", icon: SiRedux, iconColor: "#764abc" },
      { name: "Firebase", icon: SiFirebase, iconColor: "#f57c00" },
      { name: "Vercel", icon: SiVercel, iconColor: "#4f46e5" },
      { name: "Vite", icon: SiVite, iconColor: "#646cff" },
    ],
  },
  {
    title: "Creative Skills",
    icon: LuBrainCircuit, // Using a different icon as FaCreativeCommonsShare might not fit
    iconColor: "#b45309",
    skills: [
      { name: "UI Animation", icon: MdAnimation, iconColor: "#7c3aed" },
      { name: "SVG Animation", icon: TbVectorTriangle, iconColor: "#0f766e" },
      { name: "3D Modeling", icon: FaShapes, iconColor: "#9b6b43" }, // Using FaShapes as a placeholder
      { name: "Motion Graphics", icon: MdMovie, iconColor: "#b45309" },
    ],
  },
];

const Skills: FC = () => {
  return (
    <section
      id="skills"
      className="relative py-24 bg-canvas-white dark:bg-canvas-light overflow-hidden"
    >
      <Container className="my-4 space-y-4 rounded-section bg-[color-mix(in_srgb,hsl(var(--canvas-light))_25%,hsl(var(--canvas-white)))] p-4 sm:p-6 md:p-8 lg:p-12 shadow-inset-border dark:bg-canvas-light">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center mb-16">
            <p className="font-mono text-text-muted mb-2 text-sm">
              <span className="text-logo-blue">02.</span> My Skills
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-text-primary mb-6">
              Technologies I&apos;ve Used
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillsData.map((category, index) => (
              <div
                key={index}
                className="relative rounded-card border border-borderLight bg-canvas-white p-6 shadow-card transition-shadow duration-200 hover:shadow-warm-lift dark:bg-canvas-warm"
              >
                <div className="flex items-center mb-4">
                  <category.icon className="text-2xl mr-3" style={{ color: category.iconColor }} />
                  <h3 className="text-xl font-medium text-text-primary">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="group flex items-center rounded-pill border border-borderSubtle bg-canvas-white px-3 py-1 text-sm text-text-secondary transition-colors duration-200 hover:border-borderLight hover:bg-canvas-warm dark:bg-canvas-light"
                    >
                      <skill.icon
                        className="mr-1.5 text-text-muted transition-opacity duration-200 group-hover:opacity-90"
                        style={skill.iconColor ? { color: skill.iconColor } : undefined}
                      />
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
};

export { Skills };
