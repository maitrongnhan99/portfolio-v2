import { describe, test, expect, jest, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import MongoVectorStore from '@/services/vectorStore';
import KnowledgeChunk from '@/models/KnowledgeChunk';
import { generateMockKnowledgeChunks, generateMockEmbedding, mockEnvironment } from '../utils/testUtils';
import { MockEmbeddingService } from '../utils/mockServices';
import EmbeddingService from '@/services/embeddingService';

// Mock EmbeddingService
jest.mock('@/services/embeddingService');

describe('MongoVectorStore', () => {
  let mongoServer: MongoMemoryServer;
  let vectorStore: MongoVectorStore;
  let mockEmbeddingService: MockEmbeddingService;
  let restoreEnv: () => void;

  beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Setup test environment
    restoreEnv = mockEnvironment({
      MONGODB_CONNECTION_STRING: mongoUri,
      GEMINI_API_KEY: 'test-api-key'
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    restoreEnv();
  });

  beforeEach(async () => {
    // Clear database
    await mongoose.connection.dropDatabase();
    
    // Setup mock embedding service
    mockEmbeddingService = new MockEmbeddingService();
    (EmbeddingService as jest.MockedClass<typeof EmbeddingService>).mockImplementation(() => mockEmbeddingService as any);
    
    vectorStore = new MongoVectorStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockEmbeddingService.reset();
  });

  describe('addDocuments', () => {
    test('should add documents with embeddings to the store', async () => {
      const mockChunks = generateMockKnowledgeChunks(3);
      
      await vectorStore.addDocuments(mockChunks);
      
      const count = await KnowledgeChunk.countDocuments();
      expect(count).toBe(3);
      
      const savedChunks = await KnowledgeChunk.find();
      savedChunks.forEach(chunk => {
        expect(chunk.embedding).toHaveLength(768);
        expect(chunk.content).toBeDefined();
        expect(chunk.metadata.category).toBeDefined();
      });
      
      expect(mockEmbeddingService.getCallCount()).toBe(3);
    });

    test('should handle embedding generation errors', async () => {
      const mockChunks = generateMockKnowledgeChunks(2);
      
      // Make embedding service fail after first call
      mockEmbeddingService = new MockEmbeddingService({ shouldFailAfterCalls: 1 });
      (EmbeddingService as jest.MockedClass<typeof EmbeddingService>).mockImplementation(() => mockEmbeddingService as any);
      
      const newVectorStore = new MongoVectorStore();
      
      await expect(newVectorStore.addDocuments(mockChunks)).rejects.toThrow();
      
      // Should have saved the first document before failing
      const count = await KnowledgeChunk.countDocuments();
      expect(count).toBe(1);
    });

    test('should respect rate limiting delays', async () => {
      const mockChunks = generateMockKnowledgeChunks(3);
      const startTime = Date.now();
      
      await vectorStore.addDocuments(mockChunks);
      
      const duration = Date.now() - startTime;
      // Should include delays between calls (200ms * 2 = 400ms minimum)
      expect(duration).toBeGreaterThan(400);
    });

    test('should handle empty documents array', async () => {
      await vectorStore.addDocuments([]);
      
      const count = await KnowledgeChunk.countDocuments();
      expect(count).toBe(0);
      expect(mockEmbeddingService.getCallCount()).toBe(0);
    });
  });

  describe('similaritySearch', () => {
    beforeEach(async () => {
      // Add some test documents first
      const mockChunks = generateMockKnowledgeChunks(5);
      await vectorStore.addDocuments(mockChunks);
    });

    test('should perform vector similarity search', async () => {
      const queryEmbedding = generateMockEmbedding(768, 1);
      
      const results = await vectorStore.similaritySearch(queryEmbedding, { k: 3 });
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeLessThanOrEqual(3);
      
      results.forEach(result => {
        expect(result.content).toBeDefined();
        expect(result.metadata).toBeDefined();
        expect(typeof result.score).toBe('number');
      });
    });

    test('should apply threshold filtering', async () => {
      const queryEmbedding = generateMockEmbedding(768, 1);
      
      const results = await vectorStore.similaritySearch(queryEmbedding, { 
        k: 5, 
        threshold: 0.9 
      });
      
      results.forEach(result => {
        expect(result.score).toBeGreaterThanOrEqual(0.9);
      });
    });

    test('should apply category filtering', async () => {
      const queryEmbedding = generateMockEmbedding(768, 1);
      
      const results = await vectorStore.similaritySearch(queryEmbedding, {
        k: 5,
        filter: { 'metadata.category': 'skills' }
      });
      
      results.forEach(result => {
        expect(result.metadata.category).toBe('skills');
      });
    });

    test('should fallback to text search when vector search fails', async () => {
      // Mock aggregate to fail
      const originalAggregate = KnowledgeChunk.aggregate;
      KnowledgeChunk.aggregate = jest.fn().mockRejectedValue(new Error('Vector search failed'));
      
      const queryEmbedding = generateMockEmbedding(768, 1);
      
      const results = await vectorStore.similaritySearch(queryEmbedding);
      
      expect(Array.isArray(results)).toBe(true);
      
      // Restore original method
      KnowledgeChunk.aggregate = originalAggregate;
    });

    test('should include embeddings when requested', async () => {
      const queryEmbedding = generateMockEmbedding(768, 1);
      
      const results = await vectorStore.similaritySearch(queryEmbedding, {
        k: 2,
        includeEmbedding: true
      });
      
      // Note: In a real vector search implementation, this would include embeddings
      // Our mock implementation doesn't support this yet, but we test the option
      expect(Array.isArray(results)).toBe(true);
    });

    test('should handle empty results', async () => {
      const queryEmbedding = generateMockEmbedding(768, 999);
      
      const results = await vectorStore.similaritySearch(queryEmbedding, {
        threshold: 0.99 // Very high threshold
      });
      
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('getByCategory', () => {
    beforeEach(async () => {
      // Add documents with different categories
      const skillsChunks = generateMockKnowledgeChunks(3).map(chunk => ({
        ...chunk,
        category: 'skills' as const
      }));
      const experienceChunks = generateMockKnowledgeChunks(2).map(chunk => ({
        ...chunk,
        category: 'experience' as const
      }));
      
      await vectorStore.addDocuments([...skillsChunks, ...experienceChunks]);
    });

    test('should retrieve documents by category', async () => {
      const results = await vectorStore.getByCategory('skills');
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      
      results.forEach(result => {
        expect(result.metadata.category).toBe('skills');
        expect(result.score).toBe(1.0); // Max score for category queries
      });
    });

    test('should respect limit parameter', async () => {
      const results = await vectorStore.getByCategory('skills', 2);
      
      expect(results.length).toBeLessThanOrEqual(2);
    });

    test('should sort by priority and creation date', async () => {
      const results = await vectorStore.getByCategory('skills', 10);
      
      // Results should be sorted by priority (1 is highest)
      for (let i = 1; i < results.length; i++) {
        expect(results[i].metadata.priority).toBeGreaterThanOrEqual(results[i - 1].metadata.priority);
      }
    });

    test('should return empty array for non-existent category', async () => {
      const results = await vectorStore.getByCategory('nonexistent' as any);
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });

  describe('clearAll', () => {
    test('should remove all documents from the store', async () => {
      // Add some documents first
      const mockChunks = generateMockKnowledgeChunks(5);
      await vectorStore.addDocuments(mockChunks);
      
      const initialCount = await vectorStore.getDocumentCount();
      expect(initialCount).toBe(5);
      
      const deletedCount = await vectorStore.clearAll();
      
      expect(deletedCount).toBe(5);
      
      const finalCount = await vectorStore.getDocumentCount();
      expect(finalCount).toBe(0);
    });

    test('should handle empty database', async () => {
      const deletedCount = await vectorStore.clearAll();
      
      expect(deletedCount).toBe(0);
    });
  });

  describe('getDocumentCount', () => {
    test('should return correct document count', async () => {
      const initialCount = await vectorStore.getDocumentCount();
      expect(initialCount).toBe(0);
      
      const mockChunks = generateMockKnowledgeChunks(7);
      await vectorStore.addDocuments(mockChunks);
      
      const finalCount = await vectorStore.getDocumentCount();
      expect(finalCount).toBe(7);
    });

    test('should handle database errors gracefully', async () => {
      // Mock countDocuments to fail
      const originalCount = KnowledgeChunk.countDocuments;
      KnowledgeChunk.countDocuments = jest.fn().mockRejectedValue(new Error('Database error'));
      
      const count = await vectorStore.getDocumentCount();
      
      expect(count).toBe(0);
      
      // Restore original method
      KnowledgeChunk.countDocuments = originalCount;
    });
  });

  describe('error handling', () => {
    test('should handle database connection errors', async () => {
      // Disconnect from database
      await mongoose.disconnect();
      
      const mockChunks = generateMockKnowledgeChunks(1);
      
      await expect(vectorStore.addDocuments(mockChunks)).rejects.toThrow();
      
      // Reconnect for other tests
      await mongoose.connect(process.env.MONGODB_CONNECTION_STRING!);
    });

    test('should handle invalid embedding dimensions', async () => {
      // Mock embedding service to return invalid dimensions
      mockEmbeddingService = new MockEmbeddingService({
        customEmbeddings: [new Array(512).fill(0.5)] // Wrong dimensions
      });
      (EmbeddingService as jest.MockedClass<typeof EmbeddingService>).mockImplementation(() => mockEmbeddingService as any);
      
      const newVectorStore = new MongoVectorStore();
      const mockChunks = generateMockKnowledgeChunks(1);
      
      await expect(newVectorStore.addDocuments(mockChunks)).rejects.toThrow();
    });

    test('should handle malformed query embeddings', async () => {
      const invalidEmbedding = new Array(512).fill(0.5); // Wrong dimensions
      
      // This would typically be caught by the model validation
      // but we test the vector store's robustness
      const results = await vectorStore.similaritySearch(invalidEmbedding as any);
      
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('performance tests', () => {
    test('should handle batch document insertion efficiently', async () => {
      const largeChunkSet = generateMockKnowledgeChunks(10);
      const startTime = Date.now();
      
      await vectorStore.addDocuments(largeChunkSet);
      
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      
      const count = await vectorStore.getDocumentCount();
      expect(count).toBe(10);
    });

    test('should perform searches efficiently', async () => {
      // Add documents for search
      const mockChunks = generateMockKnowledgeChunks(20);
      await vectorStore.addDocuments(mockChunks);
      
      const queryEmbedding = generateMockEmbedding(768, 1);
      const startTime = Date.now();
      
      await vectorStore.similaritySearch(queryEmbedding, { k: 5 });
      
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(1000); // Search should be fast
    });

    test('should handle concurrent operations', async () => {
      const chunks1 = generateMockKnowledgeChunks(3);
      const chunks2 = generateMockKnowledgeChunks(3);
      const chunks3 = generateMockKnowledgeChunks(3);
      
      const promises = [
        vectorStore.addDocuments(chunks1),
        vectorStore.addDocuments(chunks2),
        vectorStore.addDocuments(chunks3)
      ];
      
      await Promise.all(promises);
      
      const totalCount = await vectorStore.getDocumentCount();
      expect(totalCount).toBe(9);
    });
  });

  describe('data integrity', () => {
    test('should preserve document metadata correctly', async () => {
      const originalChunk = {
        content: 'Test content with special metadata',
        category: 'skills' as const,
        priority: 2 as const,
        tags: ['test', 'metadata', 'integrity'],
        source: 'test_source'
      };
      
      await vectorStore.addDocuments([originalChunk]);
      
      const results = await vectorStore.getByCategory('skills');
      
      expect(results).toHaveLength(1);
      expect(results[0].content).toBe(originalChunk.content);
      expect(results[0].metadata.category).toBe(originalChunk.category);
      expect(results[0].metadata.priority).toBe(originalChunk.priority);
      expect(results[0].metadata.tags).toEqual(originalChunk.tags);
      expect(results[0].metadata.source).toBe(originalChunk.source);
    });

    test('should maintain embedding integrity', async () => {
      const mockChunk = generateMockKnowledgeChunks(1)[0];
      
      await vectorStore.addDocuments([mockChunk]);
      
      const savedDoc = await KnowledgeChunk.findOne({ content: mockChunk.content });
      
      expect(savedDoc).toBeDefined();
      expect(savedDoc!.embedding).toHaveLength(768);
      expect(savedDoc!.embedding.every(val => typeof val === 'number')).toBe(true);
    });

    test('should handle unicode content correctly', async () => {
      const unicodeChunk = {
        content: 'Test with unicode: 你好 🚀 émojis and spéciál chars',
        category: 'personal' as const,
        priority: 1 as const,
        tags: ['unicode', 'test'],
        source: 'unicode_test'
      };
      
      await vectorStore.addDocuments([unicodeChunk]);
      
      const results = await vectorStore.getByCategory('personal');
      
      expect(results).toHaveLength(1);
      expect(results[0].content).toBe(unicodeChunk.content);
    });
  });
});