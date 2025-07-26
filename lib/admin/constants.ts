export const KNOWLEDGE_CATEGORIES = [
  { value: "personal", label: "Personal", color: "bg-blue-500", textColor: "text-blue-600" },
  { value: "skills", label: "Skills", color: "bg-green-500", textColor: "text-green-600" },
  { value: "experience", label: "Experience", color: "bg-purple-500", textColor: "text-purple-600" },
  { value: "projects", label: "Projects", color: "bg-orange-500", textColor: "text-orange-600" },
  { value: "education", label: "Education", color: "bg-indigo-500", textColor: "text-indigo-600" },
  { value: "achievements", label: "Achievements", color: "bg-yellow-500", textColor: "text-yellow-600" },
  { value: "contact", label: "Contact", color: "bg-pink-500", textColor: "text-pink-600" },
  { value: "other", label: "Other", color: "bg-gray-500", textColor: "text-gray-600" },
] as const;

export const KNOWLEDGE_PRIORITIES = [
  { value: 1, label: "Low", color: "bg-gray-500", variant: "secondary" },
  { value: 2, label: "Medium", color: "bg-yellow-500", variant: "warning" },
  { value: 3, label: "High", color: "bg-red-500", variant: "destructive" },
] as const;

export const ITEMS_PER_PAGE = 10;

export const API_ENDPOINTS = {
  knowledge: "/api/admin/knowledge",
  stats: "/api/admin/stats",
} as const;

export const ROUTES = {
  admin: "/admin",
  adminAssistant: "/admin/assistant",
  adminLogin: "/admin/login",
} as const;

export type KnowledgeCategory = typeof KNOWLEDGE_CATEGORIES[number]["value"];
export type KnowledgePriority = typeof KNOWLEDGE_PRIORITIES[number]["value"];
export type PriorityLevel = 1 | 2 | 3;