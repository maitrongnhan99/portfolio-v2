// This file contains the data for all projects

export const projectsData = [
  {
    id: 1,
    title: "Build a Spotify Connected App",
    slug: "spotify-connected-app",
    description:
      "Video course that teaches how to build a web app with the Spotify Web API. Topics covered include the principles of REST APIs, user auth flows, Node, Express, React, Styled Components, and more.",
    longDescription:
      "This comprehensive video course provides a step-by-step guide to building a fully functional web application that connects with the Spotify API. You'll learn how to authenticate users, fetch data from external APIs, build a robust backend with Node.js and Express, and create an interactive frontend with React.",
    image: "/placeholder.svg?height=400&width=600",
    category: "FullStack",
    technologies: ["React", "Express", "Spotify API", "Node.js"],
    features: [
      "User authentication with Spotify OAuth",
      "Fetch and display user's playlists and listening history",
      "Create and modify playlists",
      "Search for artists, albums, and tracks",
      "Responsive design for all devices",
      "Server-side API handling with Express",
    ],
    challenges:
      "One of the main challenges was implementing the OAuth flow securely while maintaining a good user experience. I solved this by creating a robust authentication system that handles token refresh and secure storage.",
    date: "January 2023",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/yourusername/project",
    gallery: [
      "/placeholder.svg?height=300&width=600&text=Course+Overview",
      "/placeholder.svg?height=300&width=600&text=API+Integration",
      "/placeholder.svg?height=300&width=600&text=Authentication+Flow",
      "/placeholder.svg?height=300&width=600&text=Final+Application",
    ],
    relatedProjects: [
      {
        slug: "spotify-profile",
        title: "Spotify Profile",
        image: "/placeholder.svg?height=400&width=600",
        category: "Frontend",
      },
    ],
  },
  {
    id: 2,
    title: "Spotify Profile",
    slug: "spotify-profile",
    description:
      "Web app for visualizing personalized Spotify data. View your top artists, top tracks, recently played tracks, and detailed audio information about each track. Create and save new playlists of recommended tracks based on your existing playlists and more.",
    longDescription:
      "This application leverages the Spotify Web API to provide users with insights about their listening habits. The app features a clean, intuitive interface that allows users to explore their music taste in depth, with visualizations of their top artists, tracks, and listening patterns.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Frontend",
    technologies: ["React", "Express", "Spotify API", "Heroku"],
    features: [
      "Personalized dashboard of Spotify listening data",
      "Interactive visualizations of music preferences",
      "Audio feature analysis of favorite tracks",
      "Playlist generation based on listening habits",
      "Recently played tracks history",
      "Detailed artist and track information",
    ],
    challenges:
      "Creating meaningful visualizations from complex API data was challenging. I implemented custom data processing functions to transform the raw API responses into useful insights that users can easily understand.",
    date: "March 2023",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/yourusername/project",
    stars: 676,
    gallery: [
      "/placeholder.svg?height=300&width=600&text=Dashboard",
      "/placeholder.svg?height=300&width=600&text=Artist+View",
      "/placeholder.svg?height=300&width=600&text=Track+Analysis",
      "/placeholder.svg?height=300&width=600&text=Playlist+Generator",
    ],
    relatedProjects: [
      {
        slug: "spotify-connected-app",
        title: "Build a Spotify Connected App",
        image: "/placeholder.svg?height=400&width=600",
        category: "FullStack",
      },
    ],
  },
  {
    id: 3,
    title: "Halcyon Theme",
    slug: "halcyon-theme",
    description: "Minimal dark blue theme for VS Code, Sublime Text, Atom, iTerm, and more.",
    longDescription:
      "Halcyon is a minimal, dark blue theme for VS Code, Sublime Text, Atom, iTerm, and more. It's designed to be easy on the eyes with carefully selected colors that provide good contrast and readability for long coding sessions.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Frontend",
    technologies: ["VS Code", "Sublime Text", "Atom", "iTerm"],
    features: [
      "Optimized for front-end development",
      "Carefully selected syntax highlighting",
      "Custom UI theme elements",
      "Multiple editor support",
      "Regular updates and maintenance",
      "Community-driven improvements",
    ],
    challenges:
      "Creating a consistent experience across different editors and terminals was challenging due to their different theming systems. I developed a custom build process that generates the appropriate theme files for each platform from a single source of truth.",
    date: "May 2023",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/yourusername/project",
    downloads: 100000,
    gallery: [
      "/placeholder.svg?height=300&width=600&text=VS+Code+Preview",
      "/placeholder.svg?height=300&width=600&text=Sublime+Text+Preview",
      "/placeholder.svg?height=300&width=600&text=Atom+Preview",
      "/placeholder.svg?height=300&width=600&text=iTerm+Preview",
    ],
  },
  {
    id: 4,
    title: "Portfolio Website (v4)",
    slug: "portfolio-website-v4",
    description: "An old portfolio site built with Gatsby with 6k+ stars and 3k+ forks",
    longDescription:
      "The fourth iteration of my personal website built with Gatsby. This portfolio showcases my projects, skills, and experience in a clean, minimalist design. The site features smooth animations, responsive design, and optimized performance.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Frontend",
    technologies: ["Gatsby", "Styled Components", "Netlify"],
    features: [
      "Fast, static site generation with Gatsby",
      "Responsive design for all device sizes",
      "Dark mode support",
      "Optimized images and assets",
      "Integration with GitHub API for project data",
      "Custom animations and transitions",
    ],
    challenges:
      "Balancing performance with aesthetics was a key challenge. I implemented code splitting, lazy loading, and optimized assets to ensure fast load times while maintaining the visual design.",
    date: "July 2023",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/yourusername/project",
    stars: 7811,
    gallery: [
      "/placeholder.svg?height=300&width=600&text=Home+Page",
      "/placeholder.svg?height=300&width=600&text=Projects+Section",
      "/placeholder.svg?height=300&width=600&text=About+Section",
      "/placeholder.svg?height=300&width=600&text=Contact+Form",
    ],
  },
]

