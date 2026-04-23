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
import { GlowingEffect } from "../ui/glowing-effect";
import ScrollReveal from "./scroll-reveal";

interface Skill {
  name: string;
  icon: React.ElementType;
}

interface SkillCategory {
  title: string;
  icon: React.ElementType;
  skills: Skill[];
}

const skillsData: SkillCategory[] = [
  {
    title: "Frontend Development",
    icon: FaCode,
    skills: [
      { name: "React", icon: FaReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "TypeScript", icon: SiTypescript },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "HTML5", icon: FaHtml5 },
      { name: "CSS3", icon: FaCss3Alt },
    ],
  },
  {
    title: "Backend Development",
    icon: FaDatabase,
    skills: [
      { name: "Node.js", icon: FaNodeJs },
      { name: "Python", icon: FaPython },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "MongoDB", icon: SiMongodb },
      { name: "REST APIs", icon: TbApi },
      { name: "GraphQL", icon: SiGraphql },
    ],
  },
  {
    title: "UI/UX Design",
    icon: FaPalette,
    skills: [
      { name: "Figma", icon: FaFigma },
      { name: "Responsive Design", icon: LuLayoutDashboard },
      { name: "Wireframing", icon: GiWireframeGlobe },
      { name: "Prototyping", icon: AiOutlineHighlight },
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: FaCloud,
    skills: [
      { name: "AWS", icon: FaAws },
      { name: "Docker", icon: FaDocker },
      { name: "CI/CD", icon: GoWorkflow },
      { name: "Kubernetes", icon: SiKubernetes },
      { name: "Git", icon: FaGitAlt },
      { name: "Linux", icon: FaLinux },
    ],
  },
  {
    title: "Tools & Technologies",
    icon: FaTools,
    skills: [
      { name: "VS Code", icon: TbBrandVscode },
      { name: "Jest", icon: SiJest },
      { name: "Webpack", icon: SiWebpack },
      { name: "Redux", icon: SiRedux },
      { name: "Firebase", icon: SiFirebase },
      { name: "Vercel", icon: SiVercel },
      { name: "Vite", icon: SiVite },
    ],
  },
  {
    title: "Creative Skills",
    icon: LuBrainCircuit, // Using a different icon as FaCreativeCommonsShare might not fit
    skills: [
      { name: "UI Animation", icon: MdAnimation },
      { name: "SVG Animation", icon: TbVectorTriangle },
      { name: "3D Modeling", icon: FaShapes }, // Using FaShapes as a placeholder
      { name: "Motion Graphics", icon: MdMovie },
    ],
  },
];

const Skills: FC = () => {
  return (
    <section
      id="skills"
      className="relative py-24 bg-canvas-white overflow-hidden border-b border-borderSubtle"
    >
      <div className="container px-4 md:px-6 mx-auto my-4 p-12 space-y-4 rounded-section bg-canvas-light shadow-inset-border">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center mb-16">
            <p className="font-mono text-text-muted mb-2 text-sm">02. My Skills</p>
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
                className="bg-canvas-white p-6 rounded-card shadow-outline-ring border border-borderLight relative"
              >
                <div className="flex items-center mb-4">
                  <category.icon className="text-2xl text-text-muted mr-3" />
                  <h3 className="text-xl font-medium text-text-primary">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="flex items-center bg-canvas-light text-text-secondary px-3 py-1 rounded-pill text-sm border border-borderSubtle"
                    >
                      <skill.icon className="mr-1.5 text-text-muted" />
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
      </div>
    </section>
  );
};

export { Skills };
