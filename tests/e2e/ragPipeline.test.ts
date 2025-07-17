import { describe, test, expect, jest, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import SmartRetriever from '@/services/retriever';
import MongoVectorStore from '@/services/vectorStore';
import EmbeddingService from '@/services/embeddingService';
import { POST } from '@/app/api/ai-assistant/chat/route';
import { NextRequest } from 'next/server';
import { generateMockKnowledgeChunks, mockEnvironment } from '../utils/testUtils';
import { MockEmbeddingService, createMockGeminiAI } from '../utils/mockServices';
import knowledgeBase from '@/lib/knowledge-data';

// Mock external dependencies but use real internal logic
jest.mock('@/services/embeddingService');
jest.mock('@google/generative-ai');

describe('End-to-End RAG Pipeline Tests', () => {
  let mongoServer: MongoMemoryServer;
  let restoreEnv: () => void;
  let mockEmbeddingService: MockEmbeddingService;
  let mockGemini: ReturnType<typeof createMockGeminiAI>;

  beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Setup test environment
    restoreEnv = mockEnvironment({
      MONGODB_CONNECTION_STRING: mongoUri,
      GEMINI_API_KEY: 'test-api-key'
    });

    // Setup mocks
    mockEmbeddingService = new MockEmbeddingService();
    mockGemini = createMockGeminiAI();

    (EmbeddingService as jest.MockedClass<typeof EmbeddingService>).mockImplementation(() => mockEmbeddingService as any);
    
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    GoogleGenerativeAI.mockImplementation(() => mockGemini.mockGenAI);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    restoreEnv();
  });

  beforeEach(async () => {
    // Clear database
    await mongoose.connection.dropDatabase();
    jest.clearAllMocks();
    mockEmbeddingService.reset();
  });

  describe('Complete RAG Workflow', () => {
    test('should execute full RAG pipeline from knowledge ingestion to response generation', async () => {
      // Step 1: Ingest knowledge base
      const vectorStore = new MongoVectorStore();
      const testKnowledge = generateMockKnowledgeChunks(10);
      
      await vectorStore.addDocuments(testKnowledge);
      
      const documentCount = await vectorStore.getDocumentCount();
      expect(documentCount).toBe(10);

      // Step 2: Test retrieval
      const retriever = new SmartRetriever();
      const query = "What are your React skills?";
      
      const retrievedChunks = await retriever.retrieve(query, {
        k: 3,
        threshold: 0.6,
        useIntent: true,
        rerankResults: true
      });

      expect(retrievedChunks).toBeDefined();
      expect(Array.isArray(retrievedChunks)).toBe(true);
      expect(retrievedChunks.length).toBeGreaterThan(0);

      // Step 3: Test full API response
      const requestBody = {
        message: query,
        conversationHistory: []
      };

      const request = new NextRequest('http://localhost:3000/api/ai-assistant/chat', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'content-type': 'application/json' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.response).toBeDefined();
      expect(data.sources).toBeDefined();
      expect(data.sources.length).toBeGreaterThan(0);
    });

    test('should handle different query categories correctly', async () => {
      // Ingest diverse knowledge
      const vectorStore = new MongoVectorStore();
      const skillsKnowledge = generateMockKnowledgeChunks(3).map(chunk => ({
        ...chunk,
        category: 'skills' as const,
        content: 'React, TypeScript, Node.js development skills'
      }));
      const projectsKnowledge = generateMockKnowledgeChunks(3).map(chunk => ({
        ...chunk,
        category: 'projects' as const,
        content: 'Portfolio website, e-commerce app, chat application'
      }));

      await vectorStore.addDocuments([...skillsKnowledge, ...projectsKnowledge]);

      const retriever = new SmartRetriever();

      // Test skills query
      const skillsResults = await retriever.retrieve("What programming languages do you know?");
      expect(skillsResults.some(chunk => chunk.metadata.category === 'skills')).toBe(true);

      // Test projects query
      const projectsResults = await retriever.retrieve("What have you built?");
      expect(projectsResults.length).toBeGreaterThan(0);

      // Test category-specific retrieval
      const skillsCategory = await retriever.getContextByCategory('skills');
      expect(skillsCategory.every(chunk => chunk.metadata.category === 'skills')).toBe(true);
    });

    test('should maintain context across conversation', async () => {
      // Setup knowledge base
      const vectorStore = new MongoVectorStore();
      await vectorStore.addDocuments(generateMockKnowledgeChunks(5));

      const conversationHistory = [
        { role: 'user' as const, content: 'What are your skills?' },
        { role: 'assistant' as const, content: 'I have React and Node.js skills' },
        { role: 'user' as const, content: 'Tell me more about React' }
      ];

      const requestBody = {
        message: "How many years of React experience do you have?",
        conversationHistory
      };

      const request = new NextRequest('http://localhost:3000/api/ai-assistant/chat', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'content-type': 'application/json' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.response).toBeDefined();
      
      // Verify that conversation context was included
      expect(mockGemini.mockGenerateContent).toHaveBeenCalled();
      const generateCall = mockGemini.mockGenerateContent.mock.calls[0];
      const systemPrompt = generateCall[0][0].text;
      expect(systemPrompt).toContain('CONVERSATION CONTEXT');
      expect(systemPrompt).toContain('React');
    });

    test('should prioritize high-relevance content', async () => {
      const vectorStore = new MongoVectorStore();
      
      // Add content with different priorities
      const highPriorityChunk = {
        content: 'Expert React developer with 5+ years experience',
        category: 'skills' as const,
        priority: 1 as const,
        tags: ['react', 'expert', 'javascript'],
        source: 'primary_skills'
      };
      
      const lowPriorityChunk = {
        content: 'Occasionally uses React for small projects',
        category: 'skills' as const,
        priority: 3 as const,
        tags: ['react', 'basic'],
        source: 'secondary_skills'
      };

      await vectorStore.addDocuments([highPriorityChunk, lowPriorityChunk]);

      const retriever = new SmartRetriever();
      const results = await retriever.retrieve("Tell me about your React expertise", {
        k: 2,
        rerankResults: true
      });

      expect(results.length).toBeGreaterThan(0);
      // High priority content should be ranked higher after reranking
      expect(results[0].metadata.priority).toBeLessThanOrEqual(results[results.length - 1].metadata.priority);
    });
  });

  describe('Error Recovery and Fallbacks', () => {
    test('should fallback gracefully when vector search fails', async () => {
      const vectorStore = new MongoVectorStore();
      await vectorStore.addDocuments(generateMockKnowledgeChunks(3));

      // Mock vector search to fail but category search to succeed
      const originalAggregate = mongoose.connection.collection('knowledgechunks').aggregate;
      mongoose.connection.collection('knowledgechunks').aggregate = jest.fn()
        .mockRejectedValue(new Error('Vector search unavailable'));

      const retriever = new SmartRetriever();
      const results = await retriever.retrieve("What are your skills?");

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);

      // Restore
      mongoose.connection.collection('knowledgechunks').aggregate = originalAggregate;
    });

    test('should provide meaningful responses when no knowledge is found', async () => {
      // Empty knowledge base
      const retriever = new SmartRetriever();
      const results = await retriever.retrieve("Tell me about quantum computing");

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);

      // Test API response with no relevant knowledge
      const requestBody = {
        message: "Tell me about quantum computing",
        conversationHistory: []
      };

      const request = new NextRequest('http://localhost:3000/api/ai-assistant/chat', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'content-type': 'application/json' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.response).toBeDefined();
      expect(data.response.length).toBeGreaterThan(0);
    });

    test('should handle embedding service failures gracefully', async () => {
      const vectorStore = new MongoVectorStore();
      await vectorStore.addDocuments(generateMockKnowledgeChunks(3));

      // Make embedding service fail for queries but not for stored data
      const failingEmbeddingService = new MockEmbeddingService({ shouldFailAfterCalls: 3 });
      (EmbeddingService as jest.MockedClass<typeof EmbeddingService>).mockImplementation(() => failingEmbeddingService as any);

      const retriever = new SmartRetriever();
      
      await expect(retriever.retrieve("What are your skills?")).rejects.toThrow();
    });
  });

  describe('Performance and Scalability', () => {
    test('should handle large knowledge base efficiently', async () => {
      const vectorStore = new MongoVectorStore();
      const largeKnowledgeSet = generateMockKnowledgeChunks(50);
      
      const startTime = Date.now();
      await vectorStore.addDocuments(largeKnowledgeSet);
      const ingestionTime = Date.now() - startTime;

      expect(ingestionTime).toBeLessThan(30000); // Should complete within 30 seconds

      const count = await vectorStore.getDocumentCount();
      expect(count).toBe(50);

      // Test retrieval performance
      const retriever = new SmartRetriever();
      const queryStart = Date.now();
      const results = await retriever.retrieve("What are your skills?", { k: 5 });
      const queryTime = Date.now() - queryStart;

      expect(queryTime).toBeLessThan(3000); // Should retrieve within 3 seconds
      expect(results.length).toBeGreaterThan(0);
    });

    test('should maintain quality with concurrent requests', async () => {
      const vectorStore = new MongoVectorStore();
      await vectorStore.addDocuments(generateMockKnowledgeChunks(20));

      const queries = [
        "What are your React skills?",
        "Tell me about your projects",
        "What's your experience with TypeScript?",
        "How do you handle databases?",
        "What's your development process?"
      ];

      const retriever = new SmartRetriever();
      const startTime = Date.now();
      
      const promises = queries.map(query => retriever.retrieve(query, { k: 3 }));
      const results = await Promise.all(promises);
      
      const totalTime = Date.now() - startTime;

      expect(results.length).toBe(5);
      results.forEach(result => {
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });
      expect(totalTime).toBeLessThan(8000); // All concurrent queries within 8 seconds
    });

    test('should optimize for frequently asked questions', async () => {
      const vectorStore = new MongoVectorStore();
      await vectorStore.addDocuments(generateMockKnowledgeChunks(10));

      const retriever = new SmartRetriever();
      const commonQuery = "What are your technical skills?";

      // First query (potentially slower due to cold start)
      const firstStart = Date.now();
      const firstResult = await retriever.retrieve(commonQuery);
      const firstDuration = Date.now() - firstStart;

      // Repeated queries (should benefit from any caching/optimization)
      const secondStart = Date.now();
      const secondResult = await retriever.retrieve(commonQuery);
      const secondDuration = Date.now() - secondStart;

      expect(firstResult).toBeDefined();
      expect(secondResult).toBeDefined();
      
      // Performance should be consistent or improve
      expect(secondDuration).toBeLessThanOrEqual(firstDuration * 1.5);
    });
  });

  describe('Data Integrity and Consistency', () => {
    test('should maintain data consistency across operations', async () => {
      const vectorStore = new MongoVectorStore();
      const originalChunks = generateMockKnowledgeChunks(5);
      
      await vectorStore.addDocuments(originalChunks);

      const retriever = new SmartRetriever();
      const results = await retriever.retrieve("test query");

      // Verify retrieved data matches original data structure
      results.forEach(result => {
        expect(result.content).toBeDefined();
        expect(result.metadata).toBeDefined();
        expect(['personal', 'skills', 'experience', 'projects', 'education', 'contact'])
          .toContain(result.metadata.category);
        expect([1, 2, 3]).toContain(result.metadata.priority);
        expect(Array.isArray(result.metadata.tags)).toBe(true);
        expect(typeof result.metadata.source).toBe('string');
      });
    });

    test('should handle unicode and special characters correctly', async () => {
      const vectorStore = new MongoVectorStore();
      const unicodeChunk = {
        content: 'Experience with internationalization: 你好世界 🌍 émojis and spéciál châractérs',
        category: 'skills' as const,
        priority: 1 as const,
        tags: ['i18n', 'unicode', 'international'],
        source: 'unicode_test'
      };

      await vectorStore.addDocuments([unicodeChunk]);

      const retriever = new SmartRetriever();
      const results = await retriever.retrieve("internationalization experience");

      expect(results.length).toBeGreaterThan(0);
      const foundChunk = results.find(r => r.content.includes('你好世界'));
      expect(foundChunk).toBeDefined();
      expect(foundChunk!.content).toContain('🌍');
      expect(foundChunk!.content).toContain('émojis');
    });

    test('should preserve embedding quality after round-trip', async () => {
      const vectorStore = new MongoVectorStore();
      const testChunk = generateMockKnowledgeChunks(1)[0];
      
      await vectorStore.addDocuments([testChunk]);

      // Verify the embedding was stored correctly
      const KnowledgeChunk = require('@/models/KnowledgeChunk').default;
      const storedChunk = await KnowledgeChunk.findOne({ content: testChunk.content });

      expect(storedChunk).toBeDefined();
      expect(storedChunk.embedding).toHaveLength(768);
      expect(storedChunk.embedding.every((val: number) => typeof val === 'number')).toBe(true);
      expect(storedChunk.embedding.every((val: number) => !isNaN(val))).toBe(true);
    });
  });

  describe('Real-world Scenarios', () => {
    test('should handle typical user conversation flow', async () => {
      const vectorStore = new MongoVectorStore();
      
      // Use subset of real knowledge base for more realistic testing
      const realWorldKnowledge = [
        {
          content: "I have 5+ years of React development experience, specializing in hooks, context, and performance optimization",
          category: 'skills' as const,
          priority: 1 as const,
          tags: ['react', 'javascript', 'frontend'],
          source: 'skills_profile'
        },
        {
          content: "Built a modern e-commerce platform using Next.js, Stripe, and MongoDB with real-time inventory management",
          category: 'projects' as const,
          priority: 1 as const,
          tags: ['nextjs', 'ecommerce', 'stripe', 'mongodb'],
          source: 'project_portfolio'
        }
      ];

      await vectorStore.addDocuments(realWorldKnowledge);

      // Simulate typical conversation flow
      const conversationSteps = [
        {
          message: "Hi, what can you tell me about yourself?",
          expectCategories: ['personal', 'skills']
        },
        {
          message: "What's your experience with React?",
          expectCategories: ['skills'],
          expectContent: ['React', 'hooks', 'performance']
        },
        {
          message: "Have you built any e-commerce projects?",
          expectCategories: ['projects'],
          expectContent: ['e-commerce', 'Next.js', 'Stripe']
        }
      ];

      for (const step of conversationSteps) {
        const requestBody = {
          message: step.message,
          conversationHistory: []
        };

        const request = new NextRequest('http://localhost:3000/api/ai-assistant/chat', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: { 'content-type': 'application/json' }
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.response).toBeDefined();
        expect(data.sources).toBeDefined();

        if (step.expectContent) {
          const responseText = data.response.toLowerCase();
          step.expectContent.forEach(content => {
            expect(responseText).toContain(content.toLowerCase());
          });
        }
      }
    });

    test('should provide contextually relevant follow-up suggestions', async () => {
      const vectorStore = new MongoVectorStore();
      await vectorStore.addDocuments(generateMockKnowledgeChunks(15));

      const requestBody = {
        message: "What programming languages do you know?",
        conversationHistory: []
      };

      const request = new NextRequest('http://localhost:3000/api/ai-assistant/chat', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'content-type': 'application/json' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.response).toBeDefined();
      
      // Response should be helpful and relevant
      const responseText = data.response.toLowerCase();
      expect(responseText.length).toBeGreaterThan(50); // Substantial response
      expect(data.sources.length).toBeGreaterThan(0); // Based on knowledge sources
    });
  });
});