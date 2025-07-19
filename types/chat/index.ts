export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: "message" | "suggestions";
  sources?: Array<{
    content: string;
    category: string;
    score: number;
  }>;
  isStreaming?: boolean;
  streamingComplete?: boolean;
}

export interface ConversationMetadata {
  conversationStartTime: Date | null;
  topicsExplored: string[];
  userMessageCount: number;
}

export interface StreamingState {
  isStreaming: boolean;
  streamingMessageId: string | null;
}

export interface ScrollState {
  isAtBottom: boolean;
  userHasScrolled: boolean;
  showScrollButton: boolean;
}

export interface ChatSettings {
  useStreaming: boolean;
  autoSave: boolean;
}

export interface TopicKeywords {
  [key: string]: string[];
}

export const TOPIC_KEYWORDS: TopicKeywords = {
  skills: [
    "skill",
    "technology",
    "programming",
    "language",
    "framework",
    "tech",
    "code",
    "development",
  ],
  experience: [
    "experience",
    "work",
    "job",
    "career",
    "role",
    "company",
    "professional",
  ],
  projects: [
    "project",
    "portfolio",
    "build",
    "created",
    "developed",
    "application",
    "website",
  ],
  education: [
    "education",
    "study",
    "learn",
    "course",
    "university",
    "degree",
    "background",
  ],
  contact: [
    "contact",
    "reach",
    "email",
    "phone",
    "hire",
    "available",
    "connect",
  ],
  personal: [
    "personal",
    "about",
    "yourself",
    "background",
    "story",
    "interests",
  ],
};