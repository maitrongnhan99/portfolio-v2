import { z } from 'zod';

export const knowledgeSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters").max(5000),
  category: z.enum(['personal', 'skills', 'experience', 'projects', 'education', 'contact']),
  priority: z.number().int().min(1).max(3),
  tags: z.array(z.string()).max(10),
  source: z.string().min(1).max(100),
});

export function validateKnowledgeInput(data: unknown) {
  return knowledgeSchema.safeParse(data);
}