// Structured knowledge base for RAG system
// This data will be processed into embeddings and stored in MongoDB

export interface KnowledgeChunkData {
  content: string;
  category:
    | "personal"
    | "skills"
    | "experience"
    | "projects"
    | "education"
    | "contact";
  priority: 1 | 2 | 3;
  tags: string[];
  source: string;
}

export const knowledgeBase: KnowledgeChunkData[] = [
  // Personal Information
  {
    content:
      "Nhan (Mai Trọng Nhân) is a FullStack Developer based in Vietnam, specializing in building exceptional digital experiences with modern web technologies.",
    category: "personal",
    priority: 1,
    tags: ["name", "location", "role", "fullstack", "developer"],
    source: "personal_profile",
  },
  {
    content:
      "Nhan is currently focused on building accessible, human-centered products using React, Next.js, NestJS, MongoDB and PostgreSQL.",
    category: "personal",
    priority: 1,
    tags: [
      "focus",
      "accessible",
      "human-centered",
      "react",
      "nextjs",
      "nestjs",
    ],
    source: "personal_profile",
  },

  // Technical Skills - Frontend
  {
    content:
      "Nhan has extensive frontend development expertise including React, Next.js, TypeScript, Tailwind CSS, HTML5, CSS3, and JavaScript.",
    category: "skills",
    priority: 1,
    tags: [
      "frontend",
      "react",
      "nextjs",
      "typescript",
      "tailwind",
      "html",
      "css",
      "javascript",
    ],
    source: "technical_skills",
  },
  {
    content:
      "Nhan specializes in React ecosystem development with deep knowledge of hooks, context, state management, and modern React patterns including React 19 features.",
    category: "skills",
    priority: 1,
    tags: ["react", "hooks", "context", "state-management", "react19"],
    source: "technical_skills",
  },
  {
    content:
      "Nhan is expert in Next.js including App Router, Server Components, API Routes, SSR, SSG, and performance optimization techniques.",
    category: "skills",
    priority: 1,
    tags: [
      "nextjs",
      "app-router",
      "server-components",
      "api-routes",
      "ssr",
      "ssg",
      "performance",
    ],
    source: "technical_skills",
  },

  // Technical Skills - Backend
  {
    content:
      "Nhan has strong backend development skills with Node.js, NestJS, Express.js, RESTful APIs, and GraphQL implementation experience.",
    category: "skills",
    priority: 1,
    tags: ["backend", "nodejs", "nestjs", "express", "rest-api", "graphql"],
    source: "technical_skills",
  },
  {
    content:
      "Nhan is experienced with database technologies including MongoDB, PostgreSQL, and MySQL for both relational and document-based data storage.",
    category: "skills",
    priority: 1,
    tags: [
      "database",
      "mongodb",
      "postgresql",
      "mysql",
      "relational",
      "document-database",
    ],
    source: "technical_skills",
  },

  // Technical Skills - Tools & DevOps
  {
    content:
      "Nhan uses modern development tools including Git for version control, Docker for containerization, and cloud platforms like AWS, Vercel, and Netlify for deployment.",
    category: "skills",
    priority: 2,
    tags: [
      "tools",
      "git",
      "docker",
      "aws",
      "vercel",
      "netlify",
      "deployment",
      "devops",
    ],
    source: "technical_skills",
  },
  {
    content:
      "Nhan has experience with mobile app development using React Native for cross-platform mobile applications.",
    category: "skills",
    priority: 2,
    tags: ["mobile", "react-native", "cross-platform", "mobile-apps"],
    source: "technical_skills",
  },

  // Work Experience
  {
    content:
      "Nhan currently works as a FullStack Developer (2023 - Present), building scalable web applications and mobile apps using modern technologies.",
    category: "experience",
    priority: 1,
    tags: [
      "current-role",
      "fullstack",
      "scalable",
      "web-apps",
      "mobile-apps",
      "2023",
    ],
    source: "work_experience",
  },
  {
    content:
      "Previously, Mai worked as a Frontend Developer (2022 - 2023), specializing in React and Next.js development for enterprise applications.",
    category: "experience",
    priority: 2,
    tags: [
      "previous-role",
      "frontend",
      "react",
      "nextjs",
      "enterprise",
      "2022",
    ],
    source: "work_experience",
  },
  {
    content:
      "Nhan has experience building scalable architectures, implementing CI/CD pipelines, and working with microservices patterns.",
    category: "experience",
    priority: 2,
    tags: ["scalable-architecture", "cicd", "microservices", "enterprise"],
    source: "work_experience",
  },

  // Education & Learning
  {
    content:
      "Nhan is primarily self-taught and has built expertise through hands-on projects, continuous learning, and staying up-to-date with the latest technologies in web development.",
    category: "education",
    priority: 2,
    tags: [
      "self-taught",
      "hands-on",
      "continuous-learning",
      "latest-technologies",
    ],
    source: "education_background",
  },
  {
    content:
      "Nhan actively follows modern web development trends, best practices, and contributes to open-source projects to stay current with industry standards.",
    category: "education",
    priority: 3,
    tags: ["trends", "best-practices", "open-source", "industry-standards"],
    source: "education_background",
  },

  // Interests & Values
  {
    content:
      "Nhan is passionate about Web Development, Mobile Development, UI/UX Design, Open Source contributions, and Technology Innovation.",
    category: "personal",
    priority: 2,
    tags: [
      "passion",
      "web-development",
      "mobile-development",
      "ui-ux",
      "open-source",
      "innovation",
    ],
    source: "interests",
  },
  {
    content:
      "Nhan focuses on creating technology that makes a positive impact and believes in building accessible, inclusive digital experiences for all users.",
    category: "personal",
    priority: 2,
    tags: ["positive-impact", "accessible", "inclusive", "digital-experiences"],
    source: "values",
  },

  // Contact & Availability
  {
    content:
      "Nhan can be reached through the portfolio website at maitrongnhan.dev, GitHub at github.com/maitrongnhan99, or LinkedIn at linkedin.com/in/maitrongnhan.",
    category: "contact",
    priority: 1,
    tags: ["contact", "website", "github", "linkedin", "social-links"],
    source: "contact_info",
  },
  {
    content:
      "Nhan is always interested in discussing exciting opportunities including full-time positions, freelance projects, and collaborations.",
    category: "contact",
    priority: 1,
    tags: [
      "opportunities",
      "full-time",
      "freelance",
      "collaborations",
      "available",
    ],
    source: "availability",
  },
  {
    content:
      "Nhan works remotely and is open to both local Vietnam opportunities and international remote positions.",
    category: "contact",
    priority: 2,
    tags: ["remote", "vietnam", "international", "flexible", "location"],
    source: "work_preferences",
  },

  // Specializations & Expertise
  {
    content:
      "Nhan specializes in building modern monorepo architectures using tools like Turborepo, component libraries with shadcn/ui, and implementing CI/CD pipelines.",
    category: "skills",
    priority: 2,
    tags: ["monorepo", "turborepo", "component-libraries", "shadcn", "cicd"],
    source: "specializations",
  },
  {
    content:
      "Nhan has expertise in performance optimization, SEO implementation, accessibility compliance, and creating responsive designs that work across all devices.",
    category: "skills",
    priority: 2,
    tags: ["performance", "seo", "accessibility", "responsive", "cross-device"],
    source: "specializations",
  },
  {
    content:
      "Nhan is experienced with testing frameworks, code quality tools, and implementing best practices for maintainable, scalable codebases.",
    category: "skills",
    priority: 2,
    tags: [
      "testing",
      "code-quality",
      "best-practices",
      "maintainable",
      "scalable",
    ],
    source: "specializations",
  },

  // Personal Journey & Background (Enhanced)
  {
    content:
      "Nhan's interest in programming began with curiosity about how websites, applications, and systems were built - understanding how small units of logic come together to create full digital products. This curiosity evolved into a passion for solving problems using code, understanding system architecture, and building user-centric applications.",
    category: "personal",
    priority: 1,
    tags: ["journey", "curiosity", "problem-solving", "system-architecture", "user-centric"],
    source: "personal_journey",
  },
  {
    content:
      "Nhan's personal philosophy about software development emphasizes maintainable, scalable, performance-driven, and user-centric code. Clean code, predictable patterns, strong documentation, and long-term maintainability are key principles applied across all projects.",
    category: "personal",
    priority: 1,
    tags: ["philosophy", "maintainable", "scalable", "clean-code", "documentation"],
    source: "coding_philosophy",
  },
  {
    content:
      "Nhan's career goals for the next 2-3 years include advancing to a senior full-stack engineer role, strengthening architectural decision-making, contributing to large-scale products, growing into technical leadership, and building AI-powered SaaS products for real-world users.",
    category: "personal",
    priority: 1,
    tags: ["career-goals", "senior-engineer", "technical-leadership", "ai-powered", "saas"],
    source: "career_goals",
  },
  {
    content:
      "Nhan is most excited about solving complex full-stack problems including offline-first systems, real-time communication, scalable architectures, mobile-web synchronization, and AI-powered automation. Projects requiring both deep technical engineering and strong product thinking are particularly appealing.",
    category: "personal",
    priority: 1,
    tags: ["complex-problems", "offline-first", "real-time", "mobile-web-sync", "ai-automation"],
    source: "interests",
  },

  // Detailed Work Experience (Enhanced)
  {
    content:
      "Nhan currently works at an EdTech company (IELTS training & exam preparation) as a Full-Stack Engineer and Team Lead since December 2022. The company has ~20 developers and focuses on educational technology and IELTS test preparation.",
    category: "experience",
    priority: 1,
    tags: ["current-company", "edtech", "ielts", "team-lead", "december-2022"],
    source: "work_experience_detailed",
  },
  {
    content:
      "In 2024, Mai was promoted to Team Lead & Project Manager, leading a team of 5 developers. Responsibilities include technical leadership, architecture decisions, mentoring junior developers, reviewing pull requests, and ensuring delivery quality and timelines.",
    category: "experience",
    priority: 1,
    tags: ["promotion", "team-lead", "project-manager", "mentoring", "architecture-decisions"],
    source: "leadership_experience",
  },
  {
    content:
      "Nhan's major achievements include building multiple large-scale web and mobile applications, successfully launching a platform that reached 20,000 visitors in the first two months, and creating an internal mobile chat application that improved communication quality and removed dependency on third-party tools.",
    category: "experience",
    priority: 1,
    tags: ["achievements", "large-scale", "20k-visitors", "mobile-chat", "internal-tools"],
    source: "work_achievements",
  },
  {
    content:
      "Nhan's most challenging technical project involved designing an offline-first database system for a mobile chat application using RxDB (web) and WatermelonDB (mobile), requiring custom synchronization with WebSockets, delta synchronization, conflict resolution, and multi-database architecture.",
    category: "experience",
    priority: 1,
    tags: ["offline-first", "rxdb", "watermelondb", "websockets", "delta-sync", "conflict-resolution"],
    source: "technical_challenges",
  },

  // Education Background (Enhanced)
  {
    content:
      "Nhan studied Computer Science at the University of Science, Vietnam National University (HCMC) for a Bachelor's degree. Official certification is pending due to COVID-related delays, but the educational foundation was completed.",
    category: "education",
    priority: 1,
    tags: ["university", "computer-science", "vietnam-national-university", "hcmc", "bachelor"],
    source: "formal_education",
  },
  {
    content:
      "Nhan has completed multiple certifications from FreeCodeCamp, Udemy, and Coursera covering Product Management, Frontend Development, Backend Development, and UI/UX Design, demonstrating commitment to continuous learning across the full-stack spectrum.",
    category: "education",
    priority: 2,
    tags: ["certifications", "freecodecamp", "udemy", "coursera", "product-management", "ui-ux"],
    source: "certifications",
  },
  {
    content:
      "Nhan stays updated through continuous learning, reading engineering publications, experimenting with new frameworks, contributing to technical communities, and following modern full-stack ecosystem changes, especially React, Next.js, AI tooling, and distributed systems.",
    category: "education",
    priority: 2,
    tags: ["continuous-learning", "engineering-publications", "react", "nextjs", "ai-tooling", "distributed-systems"],
    source: "learning_approach",
  },
  {
    content:
      "Nhan recommends learning resources including freeCodeCamp, Kent C. Dodds (React), Frontend Masters, Fireship, System Design Primer, and Daily.dev for staying current with modern engineering practices and technologies.",
    category: "education",
    priority: 3,
    tags: ["learning-resources", "kent-c-dodds", "frontend-masters", "fireship", "system-design", "daily-dev"],
    source: "recommended_resources",
  },

  // Working Style & Communication (Enhanced)
  {
    content:
      "Nhan prefers structured communication using clear, concise messages, diagrams, and well-defined requirements. Communication style adapts based on audience - technical depth for developers, clarity and simplicity for non-technical stakeholders.",
    category: "personal",
    priority: 2,
    tags: ["communication", "structured", "clear-messages", "diagrams", "audience-adaptation"],
    source: "communication_style",
  },
  {
    content:
      "Nhan's problem-solving approach involves analyzing problem context, breaking it down into smaller components, validating assumptions, and experimenting with prototypes or proofs of concept, prioritizing long-term maintainability over short-term fixes.",
    category: "personal",
    priority: 2,
    tags: ["problem-solving", "analysis", "prototypes", "proof-of-concept", "long-term-maintainability"],
    source: "problem_solving",
  },
  {
    content:
      "Nhan manages productivity through task prioritization, sprint planning, asynchronous communication, and focused work intervals. For remote work, relies on clear documentation, stable workflows, and consistent communication patterns.",
    category: "personal",
    priority: 2,
    tags: ["productivity", "task-prioritization", "sprint-planning", "remote-work", "documentation"],
    source: "work_style",
  },
  {
    content:
      "Nhan uses development tools including Git/GitHub/GitLab, Jira/Linear, Docker, Vercel/AWS/Railway, VSCode/Cursor, Turborepo/PNPM, and testing frameworks like React Testing Library and Vitest for efficient development workflows.",
    category: "skills",
    priority: 2,
    tags: ["git", "jira", "linear", "docker", "vscode", "cursor", "turborepo", "vitest"],
    source: "development_tools",
  },

  // Technical Preferences & Methodologies (Enhanced)
  {
    content:
      "Nhan prefers modern JavaScript/TypeScript ecosystems including React, Next.js, NestJS, PostgreSQL, MongoDB, RxDB, and React Native due to their flexibility, ecosystem maturity, and strong community support.",
    category: "skills",
    priority: 1,
    tags: ["javascript", "typescript", "react", "nestjs", "postgresql", "rxdb", "ecosystem"],
    source: "tech_preferences",
  },
  {
    content:
      "Nhan works primarily with Agile and Scrum methodologies, using sprint cycles, backlog grooming, and iterative delivery with continuous integration and deployment practices.",
    category: "skills",
    priority: 2,
    tags: ["agile", "scrum", "sprint-cycles", "backlog-grooming", "iterative-delivery", "ci-cd"],
    source: "methodologies",
  },
  {
    content:
      "Nhan believes AI and LLM tooling are becoming essential for productivity and automation. Serverless architecture is highly effective for modern scalable applications, while micro-frontends have value in large enterprise systems but require careful governance.",
    category: "personal",
    priority: 2,
    tags: ["ai", "llm", "automation", "serverless", "micro-frontends", "enterprise", "governance"],
    source: "tech_opinions",
  },
  {
    content:
      "Nhan follows essential coding principles including SOLID, DRY, clean architecture, type safety, modularity, performance-driven design, and writing predictable, testable code with strong documentation.",
    category: "skills",
    priority: 1,
    tags: ["solid", "dry", "clean-architecture", "type-safety", "modularity", "testable-code"],
    source: "coding_principles",
  },

  // Complex Project Architecture (Enhanced)
  {
    content:
      "Nhan's most complex project architecture involved building a cross-platform chat system using Next.js + NestJS backend, RxDB (web), WatermelonDB (mobile), WebSockets for real-time sync, delta-based synchronization, IndexedDB & SQLite for local storage, and server-side conflict resolution pipeline.",
    category: "projects",
    priority: 1,
    tags: ["cross-platform", "chat-system", "rxdb", "watermelondb", "websockets", "delta-sync", "conflict-resolution"],
    source: "complex_architecture",
  },
  {
    content:
      "Nhan's internal chat application gained strong adoption among sales teams and managers, while a new public-facing application reached 20,000 visitors in the first 2 months, validating the scalability and performance of the architecture decisions.",
    category: "projects",
    priority: 2,
    tags: ["user-adoption", "20k-visitors", "scalability", "performance", "validation"],
    source: "project_metrics",
  },
  {
    content:
      "Nhan's performance optimization approach focuses on edge caching (Vercel, Cloudflare), Server Components & streaming, database indexing, API response optimization, static rendering, client-side memoization, virtualization, and load testing with monitoring.",
    category: "skills",
    priority: 2,
    tags: ["edge-caching", "server-components", "streaming", "database-indexing", "memoization", "load-testing"],
    source: "performance_optimization",
  },
  {
    content:
      "Nhan implements comprehensive testing strategies including unit testing with Vitest/Jest, integration testing, E2E testing with Playwright, mocking external services, and CI-based test pipelines for reliable software delivery.",
    category: "skills",
    priority: 2,
    tags: ["unit-testing", "vitest", "jest", "integration-testing", "playwright", "e2e", "ci-pipelines"],
    source: "testing_strategies",
  },

  // Community & Industry Engagement (Enhanced)
  {
    content:
      "Nhan is an active member of Daily.dev, where Nhan reads, shares, and contributes articles about modern technologies. Also participates in online developer communities and discussions about engineering best practices.",
    category: "personal",
    priority: 3,
    tags: ["daily-dev", "community", "articles", "engineering-practices", "modern-technologies"],
    source: "community_involvement",
  },
  {
    content:
      "Nhan follows modern engineering sources including Daily.dev, Kent C. Dodds, Theo Browne (t3.gg), Fireship, and various frontend engineering blogs to stay current with industry trends and best practices.",
    category: "education",
    priority: 3,
    tags: ["daily-dev", "kent-c-dodds", "theo-browne", "t3gg", "fireship", "industry-trends"],
    source: "industry_sources",
  },
  {
    content:
      "Nhan's advice for new developers emphasizes mastering fundamentals, building real projects, staying consistent with learning, understanding system design early, focusing on delivering real value to users, and developing curiosity, communication skills, and discipline for long-term growth.",
    category: "personal",
    priority: 3,
    tags: ["advice", "fundamentals", "real-projects", "system-design", "user-value", "long-term-growth"],
    source: "developer_advice",
  },
];
