import { KNOWLEDGE_CATEGORIES, KNOWLEDGE_PRIORITIES, type KnowledgeCategory, type KnowledgePriority, type ActionType } from "./constants";

export const getCategoryConfig = (category: string) => {
  return KNOWLEDGE_CATEGORIES.find(c => c.value === category) || KNOWLEDGE_CATEGORIES[KNOWLEDGE_CATEGORIES.length - 1];
};

export const getPriorityConfig = (priority: number | string) => {
  const priorityNum = typeof priority === "string" ? parseInt(priority, 10) : priority;
  return KNOWLEDGE_PRIORITIES.find(p => p.value === priorityNum) || KNOWLEDGE_PRIORITIES[0];
};

export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const truncateText = (text: string, maxLength: number = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const generatePaginationRange = (currentPage: number, totalPages: number) => {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l: number | undefined;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i);
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  });

  return rangeWithDots;
};

export const getActionColor = (action: ActionType): string => {
  switch (action) {
    case "create":
      return "text-green-600";
    case "update":
      return "text-blue-600";
    case "delete":
      return "text-red-600";
    case "view":
      return "text-gray-600";
    case "export":
      return "text-purple-600";
    case "import":
      return "text-orange-600";
    default:
      return "text-gray-600";
  }
};