import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import EmbeddingService from '@/services/embeddingService';
import { createMockGeminiAI, MockEmbeddingService } from '../utils/mockServices';
import { generateMockEmbedding, mockEnvironment } from '../utils/testUtils';

// Mock the Google Generative AI module
jest.mock('@google/generative-ai', () => {
  const { createMockGeminiAI } = require('../utils/mockServices');
  const mockGemini = createMockGeminiAI();
  
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => mockGemini.mockGenAI)
  };
});

describe('EmbeddingService', () => {
  let embeddingService: EmbeddingService;
  let restoreEnv: () => void;
  let mockGemini: ReturnType<typeof createMockGeminiAI>;

  beforeEach(() => {
    // Setup test environment
    restoreEnv = mockEnvironment({
      GEMINI_API_KEY: 'test-api-key'
    });

    // Create fresh mocks
    mockGemini = createMockGeminiAI();
    
    // Mock the GoogleGenerativeAI constructor
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    GoogleGenerativeAI.mockImplementation(() => mockGemini.mockGenAI);

    embeddingService = new EmbeddingService();
  });

  afterEach(() => {
    restoreEnv();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should throw error when GEMINI_API_KEY is not set', () => {
      const restoreEnvEmpty = mockEnvironment({ GEMINI_API_KEY: '' });
      
      expect(() => {
        new EmbeddingService();
      }).toThrow('Please define the GEMINI_API_KEY environment variable inside .env.local');
      
      restoreEnvEmpty();
    });

    test('should initialize successfully with valid API key', () => {
      expect(() => {
        new EmbeddingService();
      }).not.toThrow();
    });
  });

  describe('generateEmbedding', () => {
    test('should generate valid embedding for text', async () => {
      const testText = 'This is a test text for embedding generation';
      
      const embedding = await embeddingService.generateEmbedding(testText);
      
      expect(embedding).toBeValidEmbedding();
      expect(embedding).toHaveLength(768);
      expect(mockGemini.mockEmbedContent).toHaveBeenCalledWith(testText);
    });

    test('should throw error for empty text', async () => {
      await expect(embeddingService.generateEmbedding('')).rejects.toThrow('Text cannot be empty');
      await expect(embeddingService.generateEmbedding('   ')).rejects.toThrow('Text cannot be empty');
    });

    test('should throw error for null or undefined text', async () => {
      await expect(embeddingService.generateEmbedding(null as any)).rejects.toThrow('Text cannot be empty');
      await expect(embeddingService.generateEmbedding(undefined as any)).rejects.toThrow('Text cannot be empty');
    });

    test('should handle API errors gracefully', async () => {
      mockGemini.mockEmbedContent.mockRejectedValueOnce(new Error('API Error'));
      
      await expect(embeddingService.generateEmbedding('test text')).rejects.toThrow('Failed to generate embedding: API Error');
    });

    test('should validate embedding dimensions', async () => {
      // Mock invalid embedding response
      mockGemini.mockEmbedContent.mockResolvedValueOnce({
        embedding: { values: new Array(100).fill(0.5) } // Wrong dimensions
      });
      
      await expect(embeddingService.generateEmbedding('test text')).rejects.toThrow('Invalid embedding dimensions: expected 768, got 100');
    });

    test('should handle missing embedding values', async () => {
      mockGemini.mockEmbedContent.mockResolvedValueOnce({
        embedding: {} // Missing values
      });
      
      await expect(embeddingService.generateEmbedding('test text')).rejects.toThrow('Failed to generate embedding: No embedding values returned');
    });
  });

  describe('batchGenerateEmbeddings', () => {
    test('should generate embeddings for multiple texts', async () => {
      const texts = ['Text 1', 'Text 2', 'Text 3'];
      
      const embeddings = await embeddingService.batchGenerateEmbeddings(texts);
      
      expect(embeddings).toHaveLength(3);
      embeddings.forEach(embedding => {
        expect(embedding).toBeValidEmbedding();
      });
      expect(mockGemini.mockEmbedContent).toHaveBeenCalledTimes(3);
    });

    test('should filter out empty texts', async () => {
      const texts = ['Valid text', '', '   ', 'Another valid text'];
      
      const embeddings = await embeddingService.batchGenerateEmbeddings(texts);
      
      expect(embeddings).toHaveLength(2);
      expect(mockGemini.mockEmbedContent).toHaveBeenCalledTimes(2);
      expect(mockGemini.mockEmbedContent).toHaveBeenCalledWith('Valid text');
      expect(mockGemini.mockEmbedContent).toHaveBeenCalledWith('Another valid text');
    });

    test('should throw error for empty texts array', async () => {
      await expect(embeddingService.batchGenerateEmbeddings([])).rejects.toThrow('Texts array cannot be empty');
    });

    test('should throw error when no valid texts provided', async () => {
      await expect(embeddingService.batchGenerateEmbeddings(['', '   ', null as any])).rejects.toThrow('No valid texts provided');
    });

    test('should handle partial failures in batch processing', async () => {
      const texts = ['Text 1', 'Text 2', 'Text 3'];
      
      // Make the second call fail
      mockGemini.mockEmbedContent
        .mockResolvedValueOnce({ embedding: { values: generateMockEmbedding() } })
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce({ embedding: { values: generateMockEmbedding() } });
      
      await expect(embeddingService.batchGenerateEmbeddings(texts)).rejects.toThrow('Failed to generate batch embeddings');
    });

    test('should respect rate limiting with delays', async () => {
      const texts = ['Text 1', 'Text 2'];
      const startTime = Date.now();
      
      await embeddingService.batchGenerateEmbeddings(texts);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should include at least one 100ms delay between calls
      expect(duration).toBeGreaterThan(100);
    });
  });

  describe('calculateCosineSimilarity', () => {
    test('should calculate similarity between identical embeddings', () => {
      const embedding1 = generateMockEmbedding(768, 1);
      const embedding2 = generateMockEmbedding(768, 1);
      
      const similarity = EmbeddingService.calculateCosineSimilarity(embedding1, embedding2);
      
      expect(similarity).toBeCloseTo(1.0, 5);
    });

    test('should calculate similarity between different embeddings', () => {
      const embedding1 = generateMockEmbedding(768, 1);
      const embedding2 = generateMockEmbedding(768, 2);
      
      const similarity = EmbeddingService.calculateCosineSimilarity(embedding1, embedding2);
      
      expect(similarity).toBeWithinRange(-1, 1);
      expect(similarity).not.toBe(1.0);
    });

    test('should handle zero vectors', () => {
      const zeroEmbedding = new Array(768).fill(0);
      const normalEmbedding = generateMockEmbedding(768, 1);
      
      const similarity = EmbeddingService.calculateCosineSimilarity(zeroEmbedding, normalEmbedding);
      
      expect(similarity).toBe(0);
    });

    test('should throw error for mismatched dimensions', () => {
      const embedding1 = generateMockEmbedding(768, 1);
      const embedding2 = generateMockEmbedding(512, 1);
      
      expect(() => {
        EmbeddingService.calculateCosineSimilarity(embedding1, embedding2);
      }).toThrow('Embeddings must have the same dimensions');
    });

    test('should be symmetric', () => {
      const embedding1 = generateMockEmbedding(768, 1);
      const embedding2 = generateMockEmbedding(768, 2);
      
      const similarity1 = EmbeddingService.calculateCosineSimilarity(embedding1, embedding2);
      const similarity2 = EmbeddingService.calculateCosineSimilarity(embedding2, embedding1);
      
      expect(similarity1).toBeCloseTo(similarity2, 10);
    });
  });

  describe('normalizeEmbedding', () => {
    test('should normalize a vector to unit length', () => {
      const embedding = [3, 4, 0]; // Length = 5
      
      const normalized = EmbeddingService.normalizeEmbedding(embedding);
      
      expect(normalized).toEqual([0.6, 0.8, 0]);
      
      // Check unit length
      const length = Math.sqrt(normalized.reduce((sum, val) => sum + val * val, 0));
      expect(length).toBeCloseTo(1.0, 10);
    });

    test('should handle zero vector', () => {
      const zeroEmbedding = [0, 0, 0];
      
      const normalized = EmbeddingService.normalizeEmbedding(zeroEmbedding);
      
      expect(normalized).toEqual([0, 0, 0]);
    });

    test('should preserve already normalized vectors', () => {
      const unitVector = [1, 0, 0];
      
      const normalized = EmbeddingService.normalizeEmbedding(unitVector);
      
      expect(normalized).toEqual([1, 0, 0]);
    });

    test('should work with realistic embeddings', () => {
      const embedding = generateMockEmbedding(768, 1);
      
      const normalized = EmbeddingService.normalizeEmbedding(embedding);
      
      expect(normalized).toHaveLength(768);
      
      // Check unit length
      const length = Math.sqrt(normalized.reduce((sum, val) => sum + val * val, 0));
      expect(length).toBeCloseTo(1.0, 10);
    });
  });

  describe('performance tests', () => {
    test('should generate embedding within reasonable time', async () => {
      const startTime = Date.now();
      
      await embeddingService.generateEmbedding('Performance test text');
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle concurrent embedding generation', async () => {
      const texts = ['Text 1', 'Text 2', 'Text 3', 'Text 4', 'Text 5'];
      const startTime = Date.now();
      
      const promises = texts.map(text => embeddingService.generateEmbedding(text));
      const embeddings = await Promise.all(promises);
      
      const duration = Date.now() - startTime;
      
      expect(embeddings).toHaveLength(5);
      embeddings.forEach(embedding => {
        expect(embedding).toBeValidEmbedding();
      });
      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });

  describe('edge cases', () => {
    test('should handle very long text', async () => {
      const longText = 'A'.repeat(10000);
      
      const embedding = await embeddingService.generateEmbedding(longText);
      
      expect(embedding).toBeValidEmbedding();
    });

    test('should handle text with special characters', async () => {
      const specialText = 'Hello 世界 🌍 @#$%^&*()_+{}|:"<>?';
      
      const embedding = await embeddingService.generateEmbedding(specialText);
      
      expect(embedding).toBeValidEmbedding();
    });

    test('should handle whitespace-only text after trimming', async () => {
      await expect(embeddingService.generateEmbedding('   \n\t   ')).rejects.toThrow('Text cannot be empty');
    });
  });
});

describe('MockEmbeddingService', () => {
  test('should provide consistent mock embeddings', async () => {
    const mockService = new MockEmbeddingService();
    
    const embedding1 = await mockService.generateEmbedding('test text');
    const embedding2 = await mockService.generateEmbedding('test text');
    
    expect(embedding1).toEqual(embedding2);
    expect(embedding1).toBeValidEmbedding();
  });

  test('should simulate failures after specified calls', async () => {
    const mockService = new MockEmbeddingService({ shouldFailAfterCalls: 2 });
    
    await mockService.generateEmbedding('text 1');
    await mockService.generateEmbedding('text 2');
    
    await expect(mockService.generateEmbedding('text 3')).rejects.toThrow('Mock embedding service failure');
  });

  test('should use custom embeddings when provided', async () => {
    const customEmbedding = generateMockEmbedding(768, 999);
    const mockService = new MockEmbeddingService({ 
      customEmbeddings: [customEmbedding] 
    });
    
    const result = await mockService.generateEmbedding('test');
    
    expect(result).toEqual(customEmbedding);
  });

  test('should track call count correctly', async () => {
    const mockService = new MockEmbeddingService();
    
    expect(mockService.getCallCount()).toBe(0);
    
    await mockService.generateEmbedding('text 1');
    expect(mockService.getCallCount()).toBe(1);
    
    await mockService.batchGenerateEmbeddings(['text 2', 'text 3']);
    expect(mockService.getCallCount()).toBe(3);
    
    mockService.reset();
    expect(mockService.getCallCount()).toBe(0);
  });
});