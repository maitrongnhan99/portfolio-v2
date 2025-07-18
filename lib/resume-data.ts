export interface ResumeData {
  // Header Section
  personalInfo: {
    name: string;
    title: string;
    contacts: {
      email: string;
      location: string;
    };
    links: {
      linkedin: string;
      github: string;
      portfolio: string;
    };
  };
  
  // 🧑‍💻 Summary Section
  summary: {
    content: string;
    yearsOfExperience: number;
    coreSkills: string[];
    goal?: string;
  };
  
  // 🛠️ Tech Stack Section
  techStack: {
    languages: string[];
    frontend: string[];
    backend: string[];
    database: string[];
    devOps: string[];
    testing: string[];
    other?: string[];
  };
  
  // 🏢 Experience Section
  experience: Array<{
    position: string;
    company: string;
    location: string;
    duration: string;
    current?: boolean;
    bullets: Array<{
      description: string;
      impact?: string;
      technologies?: string[];
    }>;
  }>;
  
  // 📂 Projects Section
  projects: Array<{
    name: string;
    emoji?: string;
    description: string;
    technologies: string[];
    links: {
      github?: string;
      live?: string;
      npm?: string;
    };
  }>;
  
  // 📜 Education Section
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    duration: string;
    gpa?: string;
    honors?: string[];
  }>;
  
  // 🧾 Certifications Section
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
    link?: string;
  }>;
  
  // 🧰 Languages Section
  languages: Array<{
    language: string;
    proficiency: string;
    certification?: string;
  }>;
}

export const resumeData: ResumeData = {
  personalInfo: {
    name: "Mai Trọng Nhân",
    title: "Fullstack Developer",
    contacts: {
      email: "maitrongnhan.dev@gmail.com",
      location: "HCMC, Vietnam"
    },
    links: {
      linkedin: "https://linkedin.com/in/maitrongnhan",
      github: "https://github.com/maitrongnhan99",
      portfolio: "https://maitrongnhan.dev"
    }
  },
  
  summary: {
    content: "Fullstack Developer with 3+ years of experience building scalable web applications using React, Next.js, and Node.js. Proven ability to deliver high-quality, maintainable code in fast-paced environments. Seeking to contribute to impactful projects in innovative tech companies.",
    yearsOfExperience: 3,
    coreSkills: ["React", "Next.js", "Node.js", "TypeScript"],
    goal: "Contributing to impactful projects in innovative tech companies"
  },
  
  techStack: {
    languages: ["JavaScript", "TypeScript", "Python", "HTML/CSS"],
    frontend: ["React", "Next.js", "TailwindCSS", "Framer Motion", "Redux"],
    backend: ["Node.js", "Express.js", "NestJS", "GraphQL", "REST APIs"],
    database: ["MongoDB", "PostgreSQL", "Redis", "Prisma"],
    devOps: ["Docker", "GitHub Actions", "Vercel", "AWS", "Linux"],
    testing: ["Jest", "Cypress", "Vitest", "React Testing Library"]
  },
  
  experience: [
    {
      position: "Frontend Developer",
      company: "Freelance",
      location: "HCMC, Vietnam",
      duration: "Jan 2022 – Present",
      current: true,
      bullets: [
        {
          description: "Developed and maintained modern web applications using React, Next.js, and TypeScript",
          impact: "100%",
          technologies: ["React", "Next.js", "TypeScript"]
        },
        {
          description: "Built responsive, mobile-first designs with TailwindCSS and implemented smooth animations",
          technologies: ["TailwindCSS", "Framer Motion"]
        },
        {
          description: "Integrated RESTful APIs and GraphQL endpoints to create dynamic, data-driven applications",
          technologies: ["REST APIs", "GraphQL", "Apollo Client"]
        },
        {
          description: "Collaborated with clients to deliver projects on time and within budget requirements"
        }
      ]
    },
    {
      position: "Junior Developer",
      company: "Local Tech Company",
      location: "HCMC, Vietnam",
      duration: "Jun 2021 – Dec 2021",
      bullets: [
        {
          description: "Contributed to team projects using React and Node.js for web development",
          technologies: ["React", "Node.js"]
        },
        {
          description: "Participated in code reviews and learned best practices for clean, maintainable code"
        },
        {
          description: "Assisted with testing and debugging to ensure application quality"
        }
      ]
    }
  ],
  
  projects: [
    {
      name: "Personal Portfolio Website",
      emoji: "🎨",
      description: "Modern portfolio website built with Next.js 15, React 19, and TailwindCSS featuring dark mode, responsive design, and smooth animations.",
      technologies: ["Next.js", "React", "TypeScript", "TailwindCSS", "Framer Motion"],
      links: {
        github: "https://github.com/maitrongnhan99/portfolio-v2",
        live: "https://maitrongnhan.dev"
      }
    },
    {
      name: "AI Assistant Chat Interface",
      emoji: "🤖",
      description: "RAG-powered AI assistant with conversation history, search functionality, and export capabilities using Gemini API.",
      technologies: ["React", "Next.js", "TypeScript", "MongoDB", "Gemini API"],
      links: {
        github: "https://github.com/maitrongnhan99/portfolio-v2"
      }
    },
    {
      name: "E-commerce Dashboard",
      emoji: "📊",
      description: "Full-stack e-commerce management system with inventory tracking, order management, and analytics.",
      technologies: ["React", "Node.js", "MongoDB", "Express.js", "Chart.js"],
      links: {
        github: "https://github.com/maitrongnhan99"
      }
    }
  ],
  
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Science and Technology",
      location: "HCMC, Vietnam",
      duration: "2018–2022",
      gpa: "3.6/4.0"
    }
  ],
  
  certifications: [
    {
      name: "React Developer Certification",
      issuer: "Meta",
      date: "2023",
      link: "https://coursera.org/verify/certificate"
    },
    {
      name: "JavaScript Algorithms and Data Structures",
      issuer: "freeCodeCamp",
      date: "2022",
      link: "https://freecodecamp.org/certification"
    }
  ],
  
  languages: [
    {
      language: "Vietnamese",
      proficiency: "Native"
    },
    {
      language: "English",
      proficiency: "Professional working proficiency",
      certification: "TOEIC 850"
    }
  ]
};

export const actionVerbs = [
  "Developed", "Built", "Implemented", "Created", "Designed", "Optimized",
  "Improved", "Integrated", "Delivered", "Collaborated", "Maintained", "Enhanced"
];

export const formatTechnology = (tech: string) => `**${tech}**`;

export const formatDuration = (duration: string) => {
  return duration.replace("Present", "**Present**");
};

export const formatImpact = (impact: string) => `**${impact}**`;