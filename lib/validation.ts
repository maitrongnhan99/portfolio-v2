import { z } from 'zod';

// Chat API validation schemas
export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message too long (max 1000 characters)')
    .trim(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(2000),
      })
    )
    .max(50, 'Conversation history too long')
    .optional(),
  stream: z.boolean().optional().default(false),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email too long'),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject too long'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message too long'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Rate limiting validation
export const rateLimitSchema = z.object({
  ip: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/, "Invalid IP address"),
  endpoint: z.string(),
  timestamp: z.number(),
});

// API response schemas
export const apiErrorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.record(z.string(), z.any()).optional(),
});

export const chatResponseSchema = z.object({
  response: z.string(),
  sources: z
    .array(
      z.object({
        content: z.string(),
        category: z.string(),
        score: z.number().min(0).max(1),
      })
    )
    .optional(),
  error: z.string().optional(),
});

// Validation helper functions
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Invalid input data' };
  }
}

// Sanitization helpers
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/data:/gi, '') // Remove data: protocols
    .replace(/vbscript:/gi, '') // Remove vbscript: protocols
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

// URL validation and sanitization
const SAFE_URL_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

export function isValidUrl(url: string | null | undefined): boolean {
  // Handle null, undefined, or empty strings
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false;
  }
  
  try {
    const parsedUrl = new URL(url);
    return SAFE_URL_PROTOCOLS.includes(parsedUrl.protocol);
  } catch {
    // If it's not a valid URL, check if it's a relative path
    return url.startsWith('/') || url.startsWith('#');
  }
}

export function sanitizeUrl(url: string | null | undefined): string {
  // Handle null, undefined, or empty strings
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return '#';
  }
  
  // First check if it's a valid and safe URL
  if (!isValidUrl(url)) {
    // Return safe fallback for any invalid URL
    return '#';
  }
  
  return url;
}

// URL validation schema for Zod
export const urlSchema = z.string().refine(
  (url) => isValidUrl(url),
  {
    message: 'Invalid or unsafe URL. Only HTTP(S), mailto, tel, and relative URLs are allowed.',
  }
);

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// Wedding RSVP validation schema
export const rsvpSchema = z.object({
  name: z.string().trim().min(1).max(80),
  attending: z.enum(['yes', 'no']),
  guests: z.number().int().min(1).max(20).default(1),
  message: z.string().trim().max(500).optional(),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

// Wedding guest wish validation schema
export const wishSchema = z.object({
  name: z.string().trim().min(1).max(80),
  message: z.string().trim().min(1).max(500),
  avatar: z.string().max(8).optional(),
});

export type WishInput = z.infer<typeof wishSchema>;

// Input length limits
export const INPUT_LIMITS = {
  MESSAGE_MIN: 1,
  MESSAGE_MAX: 1000,
  CONVERSATION_HISTORY_MAX: 50,
  NAME_MIN: 2,
  NAME_MAX: 100,
  EMAIL_MAX: 255,
  SUBJECT_MIN: 5,
  SUBJECT_MAX: 200,
  CONTACT_MESSAGE_MIN: 10,
  CONTACT_MESSAGE_MAX: 2000,
} as const;
