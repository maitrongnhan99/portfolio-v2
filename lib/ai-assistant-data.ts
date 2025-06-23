// Personal information database for AI assistant responses
export const personalInfo = {
  name: "Mai Trọng Nhân",
  role: "FullStack Developer",
  location: "Vietnam",
  email: "your.email@example.com", // Replace with actual email
  
  bio: "I'm a FullStack developer specializing in building exceptional digital experiences. Currently, I'm focused on building accessible, human-centered products using React, Next.js, NestJS, MongoDB and PostgreSQL.",
  
  skills: {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "JavaScript"],
    backend: ["Node.js", "NestJS", "Express.js", "RESTful APIs", "GraphQL"],
    databases: ["MongoDB", "PostgreSQL", "MySQL"],
    tools: ["Git", "Docker", "AWS", "Vercel", "Netlify"],
    mobile: ["React Native", "Mobile App Development"]
  },
  
  experience: [
    {
      role: "FullStack Developer",
      company: "Current Position",
      period: "2023 - Present",
      description: "Building scalable web applications and mobile apps using modern technologies"
    },
    {
      role: "Frontend Developer",
      company: "Previous Company",
      period: "2022 - 2023",
      description: "Specialized in React and Next.js development for enterprise applications"
    }
  ],
  
  projects: [
    {
      name: "Spotify Connected App",
      description: "Video course teaching Spotify Web API integration with React and Express",
      technologies: ["React", "Express", "Spotify API", "Node.js"]
    },
    {
      name: "Spotify Profile",
      description: "Web app for visualizing personalized Spotify data and music preferences",
      technologies: ["React", "Express", "Spotify API", "Heroku"]
    },
    {
      name: "Halcyon Theme",
      description: "Minimal dark blue theme for VS Code, Sublime Text, Atom, and iTerm",
      technologies: ["VS Code", "Sublime Text", "Atom", "iTerm"]
    },
    {
      name: "Portfolio Website",
      description: "Personal portfolio built with Next.js and modern web technologies",
      technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"]
    }
  ],
  
  interests: ["Web Development", "Mobile Development", "UI/UX Design", "Open Source", "Technology Innovation"],
  
  socialLinks: {
    github: "https://github.com/maitrongnhan99",
    linkedin: "https://www.linkedin.com/in/maitrongnhan/",
    website: "https://maitrongnhan.dev"
  }
};

// AI response patterns and logic
export const generateAIResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  // Greeting responses
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return `Hello! I'm Mai Trọng Nhân's AI assistant. I can help you learn more about Mai's background, skills, experience, and projects. What would you like to know?`;
  }
  
  // Name related questions
  if (message.includes('name') || message.includes('who are you') || message.includes('introduce')) {
    return `My name is ${personalInfo.name}. I'm a ${personalInfo.role} based in ${personalInfo.location}. ${personalInfo.bio}`;
  }
  
  // Skills related questions
  if (message.includes('skill') || message.includes('technology') || message.includes('tech stack')) {
    const frontendSkills = personalInfo.skills.frontend.join(', ');
    const backendSkills = personalInfo.skills.backend.join(', ');
    const databases = personalInfo.skills.databases.join(', ');
    
    return `I have expertise in various technologies:
    
**Frontend:** ${frontendSkills}
**Backend:** ${backendSkills}
**Databases:** ${databases}
**Mobile:** ${personalInfo.skills.mobile.join(', ')}

I'm passionate about creating full-stack applications with modern, scalable architectures.`;
  }
  
  // Experience related questions
  if (message.includes('experience') || message.includes('work') || message.includes('job') || message.includes('career')) {
    const experienceList = personalInfo.experience.map(exp => 
      `• **${exp.role}** at ${exp.company} (${exp.period}): ${exp.description}`
    ).join('\n');
    
    return `Here's my professional experience:

${experienceList}

I've been focusing on building accessible, user-centered products using modern web technologies.`;
  }
  
  // Projects related questions
  if (message.includes('project') || message.includes('portfolio') || message.includes('work') || message.includes('built')) {
    const projectList = personalInfo.projects.map(project => 
      `• **${project.name}**: ${project.description} (${project.technologies.join(', ')})`
    ).join('\n');
    
    return `Here are some of my notable projects:

${projectList}

Each project demonstrates different aspects of full-stack development and my commitment to quality code.`;
  }
  
  // Contact related questions
  if (message.includes('contact') || message.includes('email') || message.includes('reach') || message.includes('hire')) {
    return `You can reach me through:
    
• **Website:** ${personalInfo.socialLinks.website}
• **GitHub:** ${personalInfo.socialLinks.github}
• **LinkedIn:** ${personalInfo.socialLinks.linkedin}

I'm always open to discussing new opportunities and interesting projects!`;
  }
  
  // Location related questions
  if (message.includes('location') || message.includes('where') || message.includes('based')) {
    return `I'm currently based in ${personalInfo.location}. I work remotely and am open to both local and international opportunities.`;
  }
  
  // Education related questions
  if (message.includes('education') || message.includes('study') || message.includes('university') || message.includes('degree')) {
    return `I'm primarily self-taught and have built my expertise through hands-on projects, continuous learning, and staying up-to-date with the latest technologies in web development.`;
  }
  
  // Interests related questions
  if (message.includes('interest') || message.includes('hobby') || message.includes('passion')) {
    return `My interests include: ${personalInfo.interests.join(', ')}. I'm passionate about creating technology that makes a positive impact and continuously learning new development techniques.`;
  }
  
  // Availability related questions
  if (message.includes('available') || message.includes('freelance') || message.includes('open to work')) {
    return `I'm always interested in discussing exciting opportunities! Whether it's full-time positions, freelance projects, or collaborations, feel free to reach out through my contact information.`;
  }
  
  // Default response for unmatched questions
  return `That's an interesting question! While I can share information about Mai's professional background, skills, experience, and projects, I might not have specific details about that topic. 

You can ask me about:
• Technical skills and expertise
• Work experience and career background
• Projects and portfolio
• Contact information
• Education and interests

What would you like to know more about?`;
};