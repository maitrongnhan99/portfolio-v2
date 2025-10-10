import { vi } from 'vitest';
import { generateMockEmbedding, createMockEmbeddingResponse, createMockGeminiResponse } from './testUtils';

/**
 * Mock implementation of EmbeddingService for testing
 */
export class MockEmbeddingService {
  private callCount = 0;
  private shouldFailAfterCalls?: number;
  private customEmbeddings?: number[][];

  constructor(options?: { 
    shouldFailAfterCalls?: number;
    customEmbeddings?: number[][];
  }) {
    this.shouldFailAfterCalls = options?.shouldFailAfterCalls;
    this.customEmbeddings = options?.customEmbeddings;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    this.callCount++;
    
    if (this.shouldFailAfterCalls && this.callCount > this.shouldFailAfterCalls) {
      throw new Error('Mock embedding service failure');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    // Return custom embedding if provided, otherwise generate based on text
    if (this.customEmbeddings && this.customEmbeddings[this.callCount - 1]) {
      return this.customEmbeddings[this.callCount - 1];
    }

    // Generate deterministic embedding based on text content
    const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return generateMockEmbedding(768, seed);
  }

  async batchGenerateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    
    for (const text of texts) {
      const embedding = await this.generateEmbedding(text);
      embeddings.push(embedding);
    }
    
    return embeddings;
  }

  static calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same dimensions');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  getCallCount(): number {
    return this.callCount;
  }

  reset(): void {
    this.callCount = 0;
  }
}

/**
 * Mock Google Generative AI for testing
 */
export function createMockGeminiAI() {
  const mockEmbedContent = vi.fn();
  const mockGenerateContent = vi.fn();

  const mockModel = {
    embedContent: mockEmbedContent,
    generateContent: mockGenerateContent
  };

  const mockGenAI = {
    getGenerativeModel: vi.fn().mockReturnValue(mockModel)
  };

  // Setup default responses
  mockEmbedContent.mockImplementation((text: string) => {
    const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Promise.resolve(createMockEmbeddingResponse(768, seed));
  });

  mockGenerateContent.mockImplementation((parts: any[]) => {
    const userMessage = parts.find(part => part.text && !part.text.includes('KNOWLEDGE BASE'));
    const query = userMessage?.text || 'test query';
    return Promise.resolve(createMockGeminiResponse(`Mock response for: ${query}`));
  });

  return {
    mockGenAI,
    mockModel,
    mockEmbedContent,
    mockGenerateContent
  };
}

/**
 * Mock MongoDB operations for testing
 */
export function createMockMongoOperations() {
  const mockDocuments: any[] = [];
  
  const mockAggregate = vi.fn().mockImplementation((pipeline: any[]) => {
    // Simulate vector search aggregation
    const vectorSearchStage = pipeline.find(stage => stage.$vectorSearch);
    if (vectorSearchStage) {
      // Return mock results with scores
      return Promise.resolve([
        { content: 'Mock result 1', metadata: { category: 'skills', priority: 1 }, score: 0.9 },
        { content: 'Mock result 2', metadata: { category: 'experience', priority: 2 }, score: 0.8 },
        { content: 'Mock result 3', metadata: { category: 'projects', priority: 1 }, score: 0.7 }
      ]);
    }
    return Promise.resolve([]);
  });

  const mockFind = vi.fn().mockImplementation((filter: any) => {
    // Simulate filtering by category
    if (filter['metadata.category']) {
      return {
        sort: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([
          { 
            content: `Mock ${filter['metadata.category']} content`,
            metadata: { 
              category: filter['metadata.category'],
              priority: 1,
              tags: ['test'],
              source: 'test'
            }
          }
        ])
      };
    }
    return {
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue(mockDocuments)
    };
  });

  const mockCreate = vi.fn().mockImplementation((doc: any) => {
    mockDocuments.push({ ...doc, _id: `mock_id_${mockDocuments.length}` });
    return Promise.resolve(doc);
  });

  const mockDeleteMany = vi.fn().mockImplementation(() => {
    const deletedCount = mockDocuments.length;
    mockDocuments.length = 0;
    return Promise.resolve({ deletedCount });
  });

  const mockCountDocuments = vi.fn().mockImplementation(() => {
    return Promise.resolve(mockDocuments.length);
  });

  const mockSave = vi.fn().mockImplementation(function(this: any) {
    if (!this._id) {
      this._id = `mock_id_${mockDocuments.length}`;
      mockDocuments.push(this);
    }
    return Promise.resolve(this);
  });

  return {
    mockDocuments,
    mockAggregate,
    mockFind,
    mockCreate,
    mockDeleteMany,
    mockCountDocuments,
    mockSave,
    clearMockDocuments: () => { mockDocuments.length = 0; }
  };
}

/**
 * Mock HTTP requests for API testing
 */
export function createMockHttpRequest(body: any = {}, headers: any = {}) {
  return {
    json: vi.fn().mockResolvedValue(body),
    headers: {
      'content-type': 'application/json',
      ...headers
    }
  };
}

/**
 * Mock HTTP response for API testing
 */
export function createMockHttpResponse() {
  const mockJson = vi.fn();
  const mockStatus = vi.fn().mockReturnValue({ json: mockJson });
  
  return {
    json: mockJson,
    status: mockStatus,
    mockJson,
    mockStatus
  };
}

/**
 * Performance monitoring mock
 */
export class MockPerformanceMonitor {
  private measurements: Array<{ name: string; duration: number; timestamp: number }> = [];

  mark(name: string): void {
    this.measurements.push({
      name,
      duration: 0,
      timestamp: Date.now()
    });
  }

  measure(name: string, startMark: string): number {
    const start = this.measurements.find(m => m.name === startMark);
    if (!start) {
      throw new Error(`Start mark '${startMark}' not found`);
    }

    const duration = Date.now() - start.timestamp;
    this.measurements.push({
      name,
      duration,
      timestamp: Date.now()
    });

    return duration;
  }

  getMeasurements(): Array<{ name: string; duration: number; timestamp: number }> {
    return [...this.measurements];
  }

  clear(): void {
    this.measurements.length = 0;
  }

  getAverageDuration(measurementName: string): number {
    const measurements = this.measurements.filter(m => m.name === measurementName);
    if (measurements.length === 0) return 0;
    
    const total = measurements.reduce((sum, m) => sum + m.duration, 0);
    return total / measurements.length;
  }
}

/**
 * Rate limiting mock for testing API limits
 */
export class MockRateLimiter {
  private requests: number[] = [];
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  async checkLimit(): Promise<boolean> {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);
    
    // Check if we're at the limit
    if (this.requests.length >= this.maxRequests) {
      return false; // Rate limited
    }
    
    // Add current request
    this.requests.push(now);
    return true; // Request allowed
  }

  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }

  reset(): void {
    this.requests.length = 0;
  }
}

const mockServices = {
  MockEmbeddingService,
  createMockGeminiAI,
  createMockMongoOperations,
  createMockHttpRequest,
  createMockHttpResponse,
  MockPerformanceMonitor,
  MockRateLimiter
};

export default mockServices;