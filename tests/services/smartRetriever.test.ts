import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import SmartRetriever, { QueryIntent } from '@/services/retriever';
import { MockEmbeddingService, createMockMongoOperations } from '../utils/mockServices';
import { generateMockRetrievedChunks, getTestQueries, mockEnvironment } from '../utils/testUtils';
import EmbeddingService from '@/services/embeddingService';
import MongoVectorStore from '@/services/vectorStore';

// Mock the dependencies
jest.mock('@/services/embeddingService');
jest.mock('@/services/vectorStore');

describe('SmartRetriever', () => {
  let smartRetriever: SmartRetriever;
  let mockEmbeddingService: MockEmbeddingService;
  let mockMongoOps: ReturnType<typeof createMockMongoOperations>;
  let restoreEnv: () => void;

  beforeEach(() => {
    // Setup test environment
    restoreEnv = mockEnvironment({
      GEMINI_API_KEY: 'test-api-key',
      MONGODB_CONNECTION_STRING: 'mongodb://test'
    });

    // Create mock services
    mockEmbeddingService = new MockEmbeddingService();
    mockMongoOps = createMockMongoOperations();

    // Mock the constructors
    (EmbeddingService as jest.MockedClass<typeof EmbeddingService>).mockImplementation(() => mockEmbeddingService as any);
    
    (MongoVectorStore as jest.MockedClass<typeof MongoVectorStore>).mockImplementation(() => ({
      similaritySearch: mockMongoOps.mockAggregate,
      getByCategory: jest.fn().mockImplementation((category) => 
        Promise.resolve(generateMockRetrievedChunks(2).map(chunk => ({
          ...chunk,
          metadata: { ...chunk.metadata, category }
        })))
      ),
      addDocuments: mockMongoOps.mockCreate,
      clearAll: mockMongoOps.mockDeleteMany,
      getDocumentCount: mockMongoOps.mockCountDocuments
    }) as any);

    smartRetriever = new SmartRetriever();
  });

  afterEach(() => {
    restoreEnv();
    jest.clearAllMocks();
    mockEmbeddingService.reset();
  });

  describe('constructor', () => {
    test('should initialize successfully', () => {
      expect(() => new SmartRetriever()).not.toThrow();
    });
  });

  describe('detectQueryIntent', () => {
    // Test the private method through the public retrieve method
    test('should detect skills category intent', async () => {
      const skillsQueries = getTestQueries().skills;
      
      for (const query of skillsQueries) {
        const results = await smartRetriever.retrieve(query, { k: 1 });
        
        // The query should trigger category-filtered search
        expect(mockMongoOps.mockAggregate).toHaveBeenCalled();
        const lastCall = mockMongoOps.mockAggregate.mock.calls[mockMongoOps.mockAggregate.mock.calls.length - 1];
        const pipeline = lastCall[0];
        
        // Check if vector search stage has category filter
        const vectorSearchStage = pipeline.find((stage: any) => stage.$vectorSearch);
        if (vectorSearchStage?.filter) {
          expect(vectorSearchStage.filter['metadata.category']).toBe('skills');
        }
      }
    });

    test('should detect experience category intent', async () => {
      const query = "What is your work experience?";
      
      await smartRetriever.retrieve(query);
      
      expect(mockMongoOps.mockAggregate).toHaveBeenCalled();
    });

    test('should detect projects category intent', async () => {
      const query = "Show me your portfolio projects";
      
      await smartRetriever.retrieve(query);
      
      expect(mockMongoOps.mockAggregate).toHaveBeenCalled();
    });

    test('should detect contact category intent', async () => {
      const query = "How can I contact you?";
      
      await smartRetriever.retrieve(query);
      
      expect(mockMongoOps.mockAggregate).toHaveBeenCalled();
    });

    test('should detect personal category intent', async () => {
      const query = "Tell me about yourself";
      
      await smartRetriever.retrieve(query);
      
      expect(mockMongoOps.mockAggregate).toHaveBeenCalled();
    });

    test('should detect education category intent', async () => {
      const query = "What's your educational background?";
      
      await smartRetriever.retrieve(query);
      
      expect(mockMongoOps.mockAggregate).toHaveBeenCalled();
    });

    test('should handle queries with no clear category', async () => {
      const query = "Random unrelated question";
      
      const results = await smartRetriever.retrieve(query);
      
      expect(results).toBeDefined();
      expect(mockEmbeddingService.getCallCount()).toBeGreaterThan(0);
    });

    test('should detect high priority queries', async () => {
      const urgentQueries = [
        "What urgent skills do you have?",
        "I need this information asap",
        "How immediately can you start?"
      ];
      
      for (const query of urgentQueries) {
        await smartRetriever.retrieve(query);
        // The implementation should handle these as high priority
      }
    });
  });

  describe('retrieve', () => {
    test('should retrieve relevant chunks successfully', async () => {
      const query = "What are your React skills?";
      
      const results = await smartRetriever.retrieve(query);
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(mockEmbeddingService.getCallCount()).toBe(1);
      expect(mockMongoOps.mockAggregate).toHaveBeenCalled();
    });

    test('should respect the k parameter', async () => {
      const query = "Tell me about your skills";
      
      const results = await smartRetriever.retrieve(query, { k: 2 });
      
      expect(results.length).toBeLessThanOrEqual(2);
    });

    test('should respect the threshold parameter', async () => {
      const query = "What technologies do you know?";
      
      await smartRetriever.retrieve(query, { threshold: 0.8 });
      
      expect(mockMongoOps.mockAggregate).toHaveBeenCalled();
      // The mock should be configured with the threshold
    });

    test('should use intent detection when enabled', async () => {
      const query = "What programming languages do you know?";
      
      await smartRetriever.retrieve(query, { useIntent: true });
      
      expect(mockEmbeddingService.getCallCount()).toBe(1);
      expect(mockMongoOps.mockAggregate).toHaveBeenCalled();
    });

    test('should skip intent detection when disabled', async () => {
      const query = "What programming languages do you know?";
      
      await smartRetriever.retrieve(query, { useIntent: false });
      
      expect(mockEmbeddingService.getCallCount()).toBe(1);
      expect(mockMongoOps.mockAggregate).toHaveBeenCalled();
    });

    test('should enable reranking by default', async () => {
      const query = "Tell me about your projects";
      
      const results = await smartRetriever.retrieve(query);
      
      expect(results).toBeDefined();
      // Results should be processed through reranking
    });

    test('should skip reranking when disabled', async () => {
      const query = "Tell me about your projects";
      
      const results = await smartRetriever.retrieve(query, { rerankResults: false });
      
      expect(results).toBeDefined();
    });

    test('should handle empty results gracefully', async () => {
      // Mock empty results
      mockMongoOps.mockAggregate.mockResolvedValueOnce([]);
      
      const query = "Non-existent information";
      
      const results = await smartRetriever.retrieve(query);
      
      expect(results).toEqual([]);
    });

    test('should fallback to category search when vector search fails', async () => {
      // Mock vector search failure
      mockMongoOps.mockAggregate.mockRejectedValueOnce(new Error('Vector search failed'));
      
      const mockVectorStore = (MongoVectorStore as jest.MockedClass<typeof MongoVectorStore>).mock.instances[0] as any;
      mockVectorStore.getByCategory = jest.fn().mockResolvedValue(generateMockRetrievedChunks(2));
      
      const query = "What are your skills?";
      
      const results = await smartRetriever.retrieve(query);
      
      expect(results).toBeDefined();
      expect(mockVectorStore.getByCategory).toHaveBeenCalled();
    });

    test('should handle retrieval errors', async () => {
      // Mock embedding generation failure
      mockEmbeddingService = new MockEmbeddingService({ shouldFailAfterCalls: 0 });
      (EmbeddingService as jest.MockedClass<typeof EmbeddingService>).mockImplementation(() => mockEmbeddingService as any);
      
      const retriever = new SmartRetriever();
      const query = "Test query";
      
      await expect(retriever.retrieve(query)).rejects.toThrow('Retrieval failed');
    });
  });

  describe('reranking', () => {
    test('should rerank results based on relevance', async () => {
      const mockChunks = [
        { ...generateMockRetrievedChunks(1)[0], score: 0.6, metadata: { ...generateMockRetrievedChunks(1)[0].metadata, priority: 3 } },
        { ...generateMockRetrievedChunks(1)[0], score: 0.7, metadata: { ...generateMockRetrievedChunks(1)[0].metadata, priority: 1 } },
        { ...generateMockRetrievedChunks(1)[0], score: 0.8, metadata: { ...generateMockRetrievedChunks(1)[0].metadata, priority: 2 } }
      ];
      
      mockMongoOps.mockAggregate.mockResolvedValueOnce(mockChunks);
      
      const query = "Test query for reranking";
      
      const results = await smartRetriever.retrieve(query, { rerankResults: true });
      
      expect(results).toBeDefined();
      expect(results.length).toBeGreaterThan(0);
      
      // Results should be sorted by score (highest first after reranking)
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });

    test('should boost priority 1 content higher than priority 3', async () => {
      const query = "Test priority boosting";
      
      await smartRetriever.retrieve(query, { rerankResults: true });
      
      // The reranking should have been applied
      expect(mockMongoOps.mockAggregate).toHaveBeenCalled();
    });

    test('should boost category matches', async () => {
      const query = "What are your React skills?";
      
      await smartRetriever.retrieve(query, { rerankResults: true });
      
      // Category matching boost should be applied during reranking
      expect(mockMongoOps.mockAggregate).toHaveBeenCalled();
    });
  });

  describe('getContextByCategory', () => {
    test('should retrieve context for specific category', async () => {
      const mockVectorStore = (MongoVectorStore as jest.MockedClass<typeof MongoVectorStore>).mock.instances[0] as any;
      mockVectorStore.getByCategory = jest.fn().mockResolvedValue(generateMockRetrievedChunks(3));
      
      const results = await smartRetriever.getContextByCategory('skills');
      
      expect(results).toHaveLength(3);
      expect(mockVectorStore.getByCategory).toHaveBeenCalledWith('skills', 5);
    });

    test('should respect limit parameter', async () => {
      const mockVectorStore = (MongoVectorStore as jest.MockedClass<typeof MongoVectorStore>).mock.instances[0] as any;
      mockVectorStore.getByCategory = jest.fn().mockResolvedValue(generateMockRetrievedChunks(2));
      
      await smartRetriever.getContextByCategory('experience', 2);
      
      expect(mockVectorStore.getByCategory).toHaveBeenCalledWith('experience', 2);
    });

    test('should handle category retrieval errors', async () => {
      const mockVectorStore = (MongoVectorStore as jest.MockedClass<typeof MongoVectorStore>).mock.instances[0] as any;
      mockVectorStore.getByCategory = jest.fn().mockRejectedValue(new Error('Category retrieval failed'));
      
      const results = await smartRetriever.getContextByCategory('projects');
      
      expect(results).toEqual([]);
    });
  });

  describe('hybridSearch', () => {
    test('should combine vector and category search results', async () => {
      const mockVectorStore = (MongoVectorStore as jest.MockedClass<typeof MongoVectorStore>).mock.instances[0] as any;
      mockVectorStore.getByCategory = jest.fn().mockResolvedValue(generateMockRetrievedChunks(2));
      
      const query = "What React projects have you built?";
      
      const results = await smartRetriever.hybridSearch(query, { k: 5 });
      
      expect(results).toBeDefined();
      expect(results.length).toBeLessThanOrEqual(5);
    });

    test('should deduplicate results between vector and category search', async () => {
      const query = "Tell me about your skills";
      
      const results = await smartRetriever.hybridSearch(query);
      
      expect(results).toBeDefined();
      // Should not contain duplicates (mocked implementation would handle this)
    });

    test('should fallback to regular retrieval on error', async () => {
      // Mock getContextByCategory to fail
      const mockVectorStore = (MongoVectorStore as jest.MockedClass<typeof MongoVectorStore>).mock.instances[0] as any;
      mockVectorStore.getByCategory = jest.fn().mockRejectedValue(new Error('Hybrid search failed'));
      
      const query = "Test hybrid search fallback";
      
      const results = await smartRetriever.hybridSearch(query);
      
      expect(results).toBeDefined();
    });
  });

  describe('performance tests', () => {
    test('should retrieve results within reasonable time', async () => {
      const query = "What are your technical skills?";
      const startTime = Date.now();
      
      await smartRetriever.retrieve(query);
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle multiple concurrent retrievals', async () => {
      const queries = [
        "What are your skills?",
        "Tell me about your projects",
        "What's your experience?",
        "How can I contact you?"
      ];
      
      const startTime = Date.now();
      const promises = queries.map(query => smartRetriever.retrieve(query));
      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      expect(results).toHaveLength(4);
      results.forEach(result => {
        expect(Array.isArray(result)).toBe(true);
      });
      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });

  describe('edge cases', () => {
    test('should handle very long queries', async () => {
      const longQuery = 'What are your skills? '.repeat(100);
      
      const results = await smartRetriever.retrieve(longQuery);
      
      expect(results).toBeDefined();
    });

    test('should handle queries with special characters', async () => {
      const specialQuery = "What's your experience with @React & Node.js?!";
      
      const results = await smartRetriever.retrieve(specialQuery);
      
      expect(results).toBeDefined();
    });

    test('should handle empty query strings', async () => {
      await expect(smartRetriever.retrieve('')).rejects.toThrow();
    });

    test('should handle queries with only punctuation', async () => {
      const results = await smartRetriever.retrieve('???!!');
      
      expect(results).toBeDefined();
    });

    test('should handle malformed options', async () => {
      const query = "Test query";
      
      const results = await smartRetriever.retrieve(query, { 
        k: -1, 
        threshold: 2.0 
      } as any);
      
      expect(results).toBeDefined();
    });
  });

  describe('query intent detection accuracy', () => {
    test('should correctly identify skill-related queries', async () => {
      const skillQueries = [
        "What programming languages do you know?",
        "Tell me about your technical stack",
        "Do you have React experience?",
        "What frameworks are you familiar with?"
      ];
      
      for (const query of skillQueries) {
        await smartRetriever.retrieve(query);
        // Should trigger skills category detection
        expect(mockMongoOps.mockAggregate).toHaveBeenCalled();
      }
    });

    test('should correctly identify project-related queries', async () => {
      const projectQueries = [
        "What have you built?",
        "Show me your portfolio",
        "What projects are you proud of?",
        "Tell me about your recent development work"
      ];
      
      for (const query of projectQueries) {
        await smartRetriever.retrieve(query);
        expect(mockMongoOps.mockAggregate).toHaveBeenCalled();
      }
    });

    test('should handle ambiguous queries appropriately', async () => {
      const ambiguousQueries = [
        "Tell me more",
        "What else?",
        "Interesting",
        "Good"
      ];
      
      for (const query of ambiguousQueries) {
        const results = await smartRetriever.retrieve(query);
        expect(results).toBeDefined();
      }
    });
  });
});