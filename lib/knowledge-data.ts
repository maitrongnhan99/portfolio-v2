// Structured knowledge base for RAG system
// This data will be processed into embeddings and stored in MongoDB

export interface KnowledgeChunkData {
  content: string;
  category: 'personal' | 'skills' | 'experience' | 'projects' | 'education' | 'contact';
  priority: 1 | 2 | 3;
  tags: string[];
  source: string;
}

export const knowledgeBase: KnowledgeChunkData[] = [
  // Personal Information
  {
    content: "Mai Trọng Nhân is a FullStack Developer based in Vietnam, specializing in building exceptional digital experiences with modern web technologies.",
    category: "personal",
    priority: 1,
    tags: ["name", "location", "role", "fullstack", "developer"],
    source: "personal_profile"
  },
  {
    content: "Mai is currently focused on building accessible, human-centered products using React, Next.js, NestJS, MongoDB and PostgreSQL.",
    category: "personal",
    priority: 1,
    tags: ["focus", "accessible", "human-centered", "react", "nextjs", "nestjs"],
    source: "personal_profile"
  },

  // Technical Skills - Frontend
  {
    content: "Mai has extensive frontend development expertise including React, Next.js, TypeScript, Tailwind CSS, HTML5, CSS3, and JavaScript.",
    category: "skills",
    priority: 1,
    tags: ["frontend", "react", "nextjs", "typescript", "tailwind", "html", "css", "javascript"],
    source: "technical_skills"
  },
  {
    content: "Mai specializes in React ecosystem development with deep knowledge of hooks, context, state management, and modern React patterns including React 19 features.",
    category: "skills",
    priority: 1,
    tags: ["react", "hooks", "context", "state-management", "react19"],
    source: "technical_skills"
  },
  {
    content: "Mai is expert in Next.js including App Router, Server Components, API Routes, SSR, SSG, and performance optimization techniques.",
    category: "skills",
    priority: 1,
    tags: ["nextjs", "app-router", "server-components", "api-routes", "ssr", "ssg", "performance"],
    source: "technical_skills"
  },

  // Technical Skills - Backend
  {
    content: "Mai has strong backend development skills with Node.js, NestJS, Express.js, RESTful APIs, and GraphQL implementation experience.",
    category: "skills",
    priority: 1,
    tags: ["backend", "nodejs", "nestjs", "express", "rest-api", "graphql"],
    source: "technical_skills"
  },
  {
    content: "Mai is experienced with database technologies including MongoDB, PostgreSQL, and MySQL for both relational and document-based data storage.",
    category: "skills",
    priority: 1,
    tags: ["database", "mongodb", "postgresql", "mysql", "relational", "document-database"],
    source: "technical_skills"
  },

  // Technical Skills - Tools & DevOps
  {
    content: "Mai uses modern development tools including Git for version control, Docker for containerization, and cloud platforms like AWS, Vercel, and Netlify for deployment.",
    category: "skills",
    priority: 2,
    tags: ["tools", "git", "docker", "aws", "vercel", "netlify", "deployment", "devops"],
    source: "technical_skills"
  },
  {
    content: "Mai has experience with mobile app development using React Native for cross-platform mobile applications.",
    category: "skills",
    priority: 2,
    tags: ["mobile", "react-native", "cross-platform", "mobile-apps"],
    source: "technical_skills"
  },

  // Work Experience
  {
    content: "Mai currently works as a FullStack Developer (2023 - Present), building scalable web applications and mobile apps using modern technologies.",
    category: "experience",
    priority: 1,
    tags: ["current-role", "fullstack", "scalable", "web-apps", "mobile-apps", "2023"],
    source: "work_experience"
  },
  {
    content: "Previously, Mai worked as a Frontend Developer (2022 - 2023), specializing in React and Next.js development for enterprise applications.",
    category: "experience",
    priority: 2,
    tags: ["previous-role", "frontend", "react", "nextjs", "enterprise", "2022"],
    source: "work_experience"
  },
  {
    content: "Mai has experience building scalable architectures, implementing CI/CD pipelines, and working with microservices patterns.",
    category: "experience",
    priority: 2,
    tags: ["scalable-architecture", "cicd", "microservices", "enterprise"],
    source: "work_experience"
  },

  // Projects
  {
    content: "Mai built a Spotify Connected App - a comprehensive video course teaching Spotify Web API integration with React and Express, demonstrating full-stack development skills.",
    category: "projects",
    priority: 1,
    tags: ["spotify", "api-integration", "react", "express", "course", "fullstack"],
    source: "portfolio_projects"
  },
  {
    content: "Mai created a Spotify Profile web application for visualizing personalized Spotify data and music preferences, deployed on Heroku with React frontend.",
    category: "projects",
    priority: 1,
    tags: ["spotify", "data-visualization", "react", "heroku", "music", "preferences"],
    source: "portfolio_projects"
  },
  {
    content: "Mai developed the Halcyon Theme - a minimal dark blue theme for VS Code, Sublime Text, Atom, and iTerm, showing attention to developer experience and design.",
    category: "projects",
    priority: 2,
    tags: ["theme", "vscode", "sublime", "atom", "iterm", "design", "developer-tools"],
    source: "portfolio_projects"
  },
  {
    content: "Mai built a modern portfolio website using Next.js, React, TypeScript, and Tailwind CSS, featuring responsive design and optimal performance.",
    category: "projects",
    priority: 1,
    tags: ["portfolio", "nextjs", "react", "typescript", "tailwind", "responsive", "performance"],
    source: "portfolio_projects"
  },
  {
    content: "Mai developed an AI Assistant feature with RAG (Retrieval-Augmented Generation) system using Google Gemini and MongoDB Atlas Vector Search for intelligent responses.",
    category: "projects",
    priority: 1,
    tags: ["ai", "rag", "gemini", "mongodb", "vector-search", "intelligent", "assistant"],
    source: "portfolio_projects"
  },

  // Education & Learning
  {
    content: "Mai is primarily self-taught and has built expertise through hands-on projects, continuous learning, and staying up-to-date with the latest technologies in web development.",
    category: "education",
    priority: 2,
    tags: ["self-taught", "hands-on", "continuous-learning", "latest-technologies"],
    source: "education_background"
  },
  {
    content: "Mai actively follows modern web development trends, best practices, and contributes to open-source projects to stay current with industry standards.",
    category: "education",
    priority: 3,
    tags: ["trends", "best-practices", "open-source", "industry-standards"],
    source: "education_background"
  },

  // Interests & Values
  {
    content: "Mai is passionate about Web Development, Mobile Development, UI/UX Design, Open Source contributions, and Technology Innovation.",
    category: "personal",
    priority: 2,
    tags: ["passion", "web-development", "mobile-development", "ui-ux", "open-source", "innovation"],
    source: "interests"
  },
  {
    content: "Mai focuses on creating technology that makes a positive impact and believes in building accessible, inclusive digital experiences for all users.",
    category: "personal",
    priority: 2,
    tags: ["positive-impact", "accessible", "inclusive", "digital-experiences"],
    source: "values"
  },

  // Contact & Availability
  {
    content: "Mai can be reached through the portfolio website at maitrongnhan.dev, GitHub at github.com/maitrongnhan99, or LinkedIn at linkedin.com/in/maitrongnhan.",
    category: "contact",
    priority: 1,
    tags: ["contact", "website", "github", "linkedin", "social-links"],
    source: "contact_info"
  },
  {
    content: "Mai is always interested in discussing exciting opportunities including full-time positions, freelance projects, and collaborations.",
    category: "contact",
    priority: 1,
    tags: ["opportunities", "full-time", "freelance", "collaborations", "available"],
    source: "availability"
  },
  {
    content: "Mai works remotely and is open to both local Vietnam opportunities and international remote positions.",
    category: "contact",
    priority: 2,
    tags: ["remote", "vietnam", "international", "flexible", "location"],
    source: "work_preferences"
  },

  // Specializations & Expertise
  {
    content: "Mai specializes in building modern monorepo architectures using tools like Turborepo, component libraries with shadcn/ui, and implementing CI/CD pipelines.",
    category: "skills",
    priority: 2,
    tags: ["monorepo", "turborepo", "component-libraries", "shadcn", "cicd"],
    source: "specializations"
  },
  {
    content: "Mai has expertise in performance optimization, SEO implementation, accessibility compliance, and creating responsive designs that work across all devices.",
    category: "skills",
    priority: 2,
    tags: ["performance", "seo", "accessibility", "responsive", "cross-device"],
    source: "specializations"
  },
  {
    content: "Mai is experienced with testing frameworks, code quality tools, and implementing best practices for maintainable, scalable codebases.",
    category: "skills",
    priority: 2,
    tags: ["testing", "code-quality", "best-practices", "maintainable", "scalable"],
    source: "specializations"
  }
];

export default knowledgeBase;