import { projectsData } from './projects-data';

export interface PersonSchema {
  '@context': string;
  '@type': 'Person';
  '@id': string;
  name: string;
  url: string;
  jobTitle: string;
  image?: string;
  sameAs: string[];
  alumniOf?: {
    '@type': 'EducationalOrganization';
    name: string;
    sameAs?: string;
  };
  worksFor?: {
    '@type': 'Organization';
    name: string;
  };
  knowsAbout: string[];
  address?: {
    '@type': 'PostalAddress';
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  email?: string;
  telephone?: string;
}

export interface WebSiteSchema {
  '@context': string;
  '@type': 'WebSite';
  '@id': string;
  url: string;
  name: string;
  description: string;
  publisher: {
    '@id': string;
  };
  inLanguage: string;
}

export interface CreativeWorkSchema {
  '@type': 'CreativeWork';
  '@id': string;
  name: string;
  author: {
    '@id': string;
  };
  url: string;
  description: string;
  keywords: string;
  mainEntityOfPage?: string;
  image?: string;
  dateCreated?: string;
  hasPart?: Array<{
    '@type': 'SoftwareApplication';
    name: string;
    applicationCategory: string;
    operatingSystem: string;
    programmingLanguage: string[];
    codeRepository?: string;
  }>;
}

export interface HomePageSchema {
  '@context': string;
  '@graph': Array<PersonSchema | WebSiteSchema | CreativeWorkSchema>;
}

export interface OfferSchema {
  '@type': 'Offer';
  price?: string;
  priceCurrency?: string;
  availability?: string;
  url?: string;
}

export interface AggregateRatingSchema {
  '@type': 'AggregateRating';
  ratingValue: string;
  reviewCount: string;
  bestRating?: string;
  worstRating?: string;
}

export interface SoftwareApplicationSchema {
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  author: {
    '@type': 'Person';
    name: string;
    url: string;
    sameAs?: string[];
  };
  offers?: OfferSchema;
  aggregateRating?: AggregateRatingSchema;
  screenshot?: string[];
  datePublished?: string;
  softwareVersion?: string;
  downloadUrl?: string;
  fileSize?: string;
  softwareRequirements?: string;
  url?: string;
  image?: string;
  keywords?: string;
  programmingLanguage?: string[];
}

export interface ProjectPageSchema {
  '@context': string;
  '@type': 'WebPage';
  url: string;
  name: string;
  description: string;
  mainEntity: SoftwareApplicationSchema;
}

export interface SearchActionSchema {
  '@type': 'SearchAction';
  target: {
    '@type': 'EntryPoint';
    urlTemplate: string;
  };
  'query-input': string;
}

export interface AskMeApplicationSchema {
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  applicationCategory: string;
  browserRequirements: string;
  operatingSystem: string;
  about: {
    '@type': 'Person';
    '@id': string;
  };
  provider: {
    '@id': string;
  };
  potentialAction?: SearchActionSchema;
  url?: string;
  image?: string;
  datePublished?: string;
  softwareVersion?: string;
  featureList?: string[];
}

export interface AskMePageSchema {
  '@context': string;
  '@type': 'WebPage';
  url: string;
  name: string;
  description?: string;
  mainEntity: AskMeApplicationSchema;
}

export function generateHomePageSchema(): HomePageSchema {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maitrongnhan.com';
  
  const personSchema: PersonSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/#person`,
    name: 'Mai Trọng Nhân',
    url: baseUrl,
    jobTitle: 'FullStack Developer',
    image: `${baseUrl}/profile-photo.jpg`, // TODO: Add actual profile photo
    sameAs: [
      'https://github.com/maitrongnhan99',
      'https://linkedin.com/in/maitrongnhan', // TODO: Update with actual LinkedIn
      'https://instagram.com/maitrongnhan', // TODO: Update with actual Instagram
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Your University', // TODO: Add actual university
      sameAs: 'https://www.university-website.edu', // TODO: Add actual university website
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Your Company', // TODO: Add if employed
    },
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Express',
      'MongoDB',
      'PostgreSQL',
      'Docker',
      'Kubernetes',
      'AWS',
      'CI/CD',
      'Git',
      'GraphQL',
      'REST APIs',
      'Tailwind CSS',
      'Framer Motion',
      'Python',
      'Django',
      'Machine Learning',
      'Agile Methodologies',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Your City', // TODO: Add actual city
      addressRegion: 'Your State/Region', // TODO: Add actual state/region
      addressCountry: 'Vietnam', // TODO: Confirm country
    },
    email: 'mailto:your.email@example.com', // TODO: Add actual email
    telephone: '+84-XXX-XXX-XXXX', // TODO: Add actual phone if desired
  };

  const websiteSchema: WebSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Mai Trọng Nhân | FullStack Developer Portfolio',
    description: 'Portfolio website showcasing my skills and projects as a FullStack developer',
    publisher: {
      '@id': `${baseUrl}/#person`,
    },
    inLanguage: 'en-US',
  };

  // Add featured projects (first 3 projects)
  const featuredProjects: CreativeWorkSchema[] = projectsData.slice(0, 3).map((project) => ({
    '@type': 'CreativeWork',
    '@id': `${baseUrl}/project/${project.slug}`,
    name: project.title,
    author: {
      '@id': `${baseUrl}/#person`,
    },
    url: `${baseUrl}/project/${project.slug}`,
    description: project.description,
    keywords: project.technologies.join(', '),
    mainEntityOfPage: `${baseUrl}/project/${project.slug}`,
    image: project.image ? `${baseUrl}${project.image}` : undefined,
    dateCreated: project.date,
    hasPart: [
      {
        '@type': 'SoftwareApplication',
        name: project.title,
        applicationCategory: 'WebApplication',
        operatingSystem: 'Cross-platform',
        programmingLanguage: project.technologies,
        codeRepository: project.githubUrl,
      },
    ],
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [personSchema as any, websiteSchema as any, ...featuredProjects as any],
  };
}

function mapCategoryToApplicationCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'FullStack': 'WebApplication',
    'Frontend': 'WebApplication',
    'Backend': 'ServerApplication',
    'Mobile': 'MobileApplication',
    'Desktop': 'DesktopApplication',
    'API': 'WebAPI',
    'Library': 'SoftwareLibrary',
    'Tool': 'UtilitiesApplication',
  };
  
  return categoryMap[category] || 'WebApplication';
}

export function generateProjectPageSchema(project: any): ProjectPageSchema {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maitrongnhan.com';
  
  const screenshots = project.gallery?.map((img: string) => 
    img.startsWith('http') ? img : `${baseUrl}${img}`
  ) || [];
  
  // Add main image as first screenshot if not in gallery
  if (project.image && !screenshots.includes(`${baseUrl}${project.image}`)) {
    screenshots.unshift(project.image.startsWith('http') ? project.image : `${baseUrl}${project.image}`);
  }
  
  const softwareApplication: SoftwareApplicationSchema = {
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.longDescription || project.description,
    applicationCategory: mapCategoryToApplicationCategory(project.category),
    operatingSystem: 'Windows, macOS, Linux', // TODO: Get from project data
    author: {
      '@type': 'Person',
      name: 'Mai Trọng Nhân',
      url: baseUrl,
      sameAs: [
        'https://github.com/maitrongnhan99',
        'https://linkedin.com/in/maitrongnhan', // TODO: Update with actual LinkedIn
      ],
    },
    screenshot: screenshots,
    datePublished: project.date,
    url: project.liveUrl,
    image: project.image ? `${baseUrl}${project.image}` : undefined,
    keywords: project.technologies.join(', '),
    programmingLanguage: project.technologies,
    // Optional fields - add when available
    softwareVersion: project.version, // TODO: Add to project data
    downloadUrl: project.downloadUrl, // TODO: Add if applicable
    fileSize: project.fileSize, // TODO: Add if applicable
    softwareRequirements: project.requirements, // TODO: Add if applicable
    offers: project.price ? {
      '@type': 'Offer',
      price: project.price,
      priceCurrency: project.priceCurrency || 'USD',
      availability: 'https://schema.org/InStock',
      url: project.liveUrl,
    } : undefined,
    aggregateRating: project.rating ? {
      '@type': 'AggregateRating',
      ratingValue: project.rating.value,
      reviewCount: project.rating.count,
      bestRating: '5',
      worstRating: '1',
    } : undefined,
  };
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: `${baseUrl}/project/${project.slug}`,
    name: `${project.title} - Mai Trọng Nhân Portfolio`,
    description: project.description,
    mainEntity: softwareApplication,
  };
}

export function generateAskMePageSchema(): AskMePageSchema {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maitrongnhan.com';
  
  const askMeApplication: AskMeApplicationSchema = {
    '@type': 'SoftwareApplication',
    name: 'AI-Powered Assistant for Mai Trọng Nhân',
    description: 'An interactive AI chatbot built with a RAG (Retrieval-Augmented Generation) system to answer questions about the skills, experience, and projects of Mai Trọng Nhân. Ask anything about my career, technical expertise, or portfolio.',
    applicationCategory: 'BusinessApplication',
    browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
    operatingSystem: 'Platform Independent',
    about: {
      '@type': 'Person',
      '@id': `${baseUrl}/#person`,
    },
    provider: {
      '@id': `${baseUrl}/#person`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/ask-me?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    url: `${baseUrl}/ask-me`,
    image: `${baseUrl}/ask-me-preview.png`, // TODO: Add preview image
    datePublished: '2024-01-01', // TODO: Update with actual launch date
    softwareVersion: '1.0.0', // TODO: Update version as needed
    featureList: [
      'Real-time AI responses about portfolio and experience',
      'Contextual understanding of technical skills',
      'Interactive conversation with memory',
      'Source citations from portfolio content',
      'Natural language understanding',
      'Streaming responses for better UX',
      'Conversation history and search',
      'Auto-save functionality',
    ],
  };
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: `${baseUrl}/ask-me`,
    name: 'Ask Me Anything: An Interactive AI Assistant for Mai Trọng Nhân',
    description: 'Chat with an AI assistant to learn about Mai Trọng Nhân\'s background, skills, projects, and professional experience. Get instant answers about my technical expertise and career journey.',
    mainEntity: askMeApplication,
  };
}