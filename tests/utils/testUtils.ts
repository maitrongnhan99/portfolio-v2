import { KnowledgeChunkData } from '@/lib/knowledge-data';
import { RetrievedChunk } from '@/services/vectorStore';

/**
 * Generate a mock embedding vector
 * @param dimensions - Number of dimensions (default: 768)
 * @param seed - Seed for deterministic generation
 * @returns Array of random numbers representing an embedding
 */
export function generateMockEmbedding(dimensions: number = 768, seed: number = 1): number[] {
  const embedding: number[] = [];
  let random = seed;
  
  for (let i = 0; i < dimensions; i++) {
    // Simple linear congruential generator for deterministic randomness
    random = (random * 9301 + 49297) % 233280;
    embedding.push((random / 233280) * 2 - 1); // Normalize to [-1, 1]
  }
  
  return embedding;
}

/**
 * Generate test knowledge chunks
 * @param count - Number of chunks to generate
 * @returns Array of knowledge chunk data
 */
export function generateMockKnowledgeChunks(count: number = 5): KnowledgeChunkData[] {
  const categories = ['personal', 'skills', 'experience', 'projects', 'education', 'contact'] as const;
  const chunks: KnowledgeChunkData[] = [];
  
  for (let i = 0; i < count; i++) {
    chunks.push({
      content: `Test knowledge chunk ${i + 1}. This contains information about testing and development.`,
      category: categories[i % categories.length],
      priority: (i % 3 + 1) as 1 | 2 | 3,
      tags: [`tag${i}`, `test`, `mock`],
      source: `test_source_${i}`
    });
  }
  
  return chunks;
}

/**
 * Generate mock retrieved chunks with embeddings and scores
 * @param count - Number of chunks to generate
 * @param baseScore - Base score for similarity
 * @returns Array of retrieved chunks
 */
export function generateMockRetrievedChunks(count: number = 3, baseScore: number = 0.8): RetrievedChunk[] {
  const chunks: RetrievedChunk[] = [];
  const mockKnowledge = generateMockKnowledgeChunks(count);
  
  for (let i = 0; i < count; i++) {
    const chunk = mockKnowledge[i];
    chunks.push({
      content: chunk.content,
      metadata: {
        category: chunk.category,
        priority: chunk.priority,
        tags: chunk.tags,
        source: chunk.source,
        lastUpdated: new Date()
      },
      score: baseScore - (i * 0.1), // Decreasing scores
      _id: `mock_id_${i}`
    });
  }
  
  return chunks;
}

/**
 * Create a mock Gemini API response
 * @param text - Response text
 * @returns Mock API response structure
 */
export function createMockGeminiResponse(text: string) {
  return {
    response: {
      text: () => text,
      candidates: [{
        content: {
          parts: [{ text }]
        }
      }]
    }
  };
}

/**
 * Create a mock embedding response
 * @param dimensions - Embedding dimensions
 * @param seed - Seed for deterministic generation
 * @returns Mock embedding response
 */
export function createMockEmbeddingResponse(dimensions: number = 768, seed: number = 1) {
  return {
    embedding: {
      values: generateMockEmbedding(dimensions, seed)
    }
  };
}

/**
 * Generate test queries for different categories
 * @returns Object with categorized test queries
 */
export function getTestQueries() {
  return {
    skills: [
      "What programming languages do you know?",
      "Tell me about your technical skills",
      "What frameworks do you use?",
      "Do you know React?"
    ],
    experience: [
      "What is your work experience?",
      "Tell me about your previous jobs",
      "What companies have you worked for?",
      "How many years of experience do you have?"
    ],
    projects: [
      "What projects have you built?",
      "Show me your portfolio",
      "What applications have you created?",
      "Tell me about your recent work"
    ],
    personal: [
      "Who are you?",
      "Tell me about yourself",
      "What's your background?",
      "What are your interests?"
    ],
    contact: [
      "How can I contact you?",
      "What's your email?",
      "Are you available for hire?",
      "How do I reach you?"
    ],
    education: [
      "What's your educational background?",
      "Where did you study?",
      "What did you learn?",
      "Do you have any certifications?"
    ]
  };
}

/**
 * Generate performance test data
 * @param queryCount - Number of queries to generate
 * @returns Array of test queries for performance testing
 */
export function generatePerformanceTestQueries(queryCount: number = 10): string[] {
  const baseQueries = Object.values(getTestQueries()).flat();
  const queries: string[] = [];
  
  for (let i = 0; i < queryCount; i++) {
    const baseQuery = baseQueries[i % baseQueries.length];
    queries.push(`${baseQuery} (test ${i + 1})`);
  }
  
  return queries;
}

/**
 * Mock timer for performance testing
 */
export class MockTimer {
  private startTime: number = 0;
  
  start(): void {
    this.startTime = Date.now();
  }
  
  end(): number {
    return Date.now() - this.startTime;
  }
  
  static async measureAsync<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const timer = new MockTimer();
    timer.start();
    const result = await fn();
    const duration = timer.end();
    return { result, duration };
  }
}

/**
 * Create a test database name for isolation
 * @param testName - Name of the test
 * @returns Unique database name
 */
export function createTestDbName(testName: string): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `test_${testName}_${timestamp}_${randomSuffix}`.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Wait for a specified amount of time
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Assert that a value is within an expected range
 * @param value - Value to check
 * @param min - Minimum expected value
 * @param max - Maximum expected value
 * @param message - Error message
 */
export function assertWithinRange(value: number, min: number, max: number, message?: string): void {
  if (value < min || value > max) {
    throw new Error(message || `Expected ${value} to be within range ${min}-${max}`);
  }
}

/**
 * Create mock environment for testing
 * @param overrides - Environment variable overrides
 * @returns Function to restore original environment
 */
export function mockEnvironment(overrides: Record<string, string>): () => void {
  const originalEnv = { ...process.env };
  
  Object.entries(overrides).forEach(([key, value]) => {
    process.env[key] = value;
  });
  
  return () => {
    process.env = originalEnv;
  };
}

/**
 * Validate that an object has the expected shape of a knowledge chunk
 * @param chunk - Object to validate
 * @returns Boolean indicating if the chunk is valid
 */
export function isValidKnowledgeChunk(chunk: any): boolean {
  return (
    typeof chunk === 'object' &&
    typeof chunk.content === 'string' &&
    Array.isArray(chunk.embedding) &&
    chunk.embedding.length === 768 &&
    typeof chunk.metadata === 'object' &&
    ['personal', 'skills', 'experience', 'projects', 'education', 'contact'].includes(chunk.metadata.category) &&
    [1, 2, 3].includes(chunk.metadata.priority) &&
    Array.isArray(chunk.metadata.tags) &&
    typeof chunk.metadata.source === 'string'
  );
}

/**
 * Validate that an object has the expected shape of a retrieved chunk
 * @param chunk - Object to validate
 * @returns Boolean indicating if the chunk is valid
 */
export function isValidRetrievedChunk(chunk: any): boolean {
  return (
    typeof chunk === 'object' &&
    typeof chunk.content === 'string' &&
    typeof chunk.score === 'number' &&
    chunk.score >= 0 &&
    chunk.score <= 1 &&
    typeof chunk.metadata === 'object' &&
    ['personal', 'skills', 'experience', 'projects', 'education', 'contact'].includes(chunk.metadata.category)
  );
}