import { describe, test, expect, jest, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { MockTimer, generatePerformanceTestQueries, mockEnvironment } from '../utils/testUtils';
import { MockEmbeddingService, MockPerformanceMonitor } from '../utils/mockServices';
import SmartRetriever from '@/services/retriever';
import EmbeddingService from '@/services/embeddingService';
import MongoVectorStore from '@/services/vectorStore';

// Mock the dependencies for performance testing
jest.mock('@/services/embeddingService');
jest.mock('@/services/vectorStore');

describe('Performance Tests', () => {
  let aiService: SmartRetriever;
  let mockEmbeddingService: MockEmbeddingService;
  let performanceMonitor: MockPerformanceMonitor;
  let restoreEnv: () => void;

  beforeAll(() => {
    // Setup test environment
    restoreEnv = mockEnvironment({
      GEMINI_API_KEY: 'test-api-key',
      MONGODB_CONNECTION_STRING: 'mongodb://test'
    });

    performanceMonitor = new MockPerformanceMonitor();
  });

  afterAll(() => {
    restoreEnv();
  });

  beforeEach(() => {
    // Create optimized mock services for performance testing
    mockEmbeddingService = new MockEmbeddingService();
    
    // Mock EmbeddingService with fast responses
    (EmbeddingService as jest.MockedClass<typeof EmbeddingService>).mockImplementation(() => ({
      generateEmbedding: jest.fn().mockImplementation(async (text: string) => {
        // Simulate fast embedding generation (10-50ms)
        await new Promise(resolve => setTimeout(resolve, Math.random() * 40 + 10));
        return mockEmbeddingService.generateEmbedding(text);
      }),
      batchGenerateEmbeddings: jest.fn().mockImplementation(async (texts: string[]) => {
        // Simulate batch processing with realistic timing
        await new Promise(resolve => setTimeout(resolve, texts.length * 30));
        return mockEmbeddingService.batchGenerateEmbeddings(texts);
      })
    }) as any);

    // Mock VectorStore with realistic response times
    (MongoVectorStore as jest.MockedClass<typeof MongoVectorStore>).mockImplementation(() => ({
      similaritySearch: jest.fn().mockImplementation(async () => {
        // Simulate database query time (50-200ms)
        await new Promise(resolve => setTimeout(resolve, Math.random() * 150 + 50));
        return [
          { content: 'Mock result 1', metadata: { category: 'skills', priority: 1 }, score: 0.9 },
          { content: 'Mock result 2', metadata: { category: 'experience', priority: 2 }, score: 0.8 },
          { content: 'Mock result 3', metadata: { category: 'projects', priority: 1 }, score: 0.7 }
        ];
      }),
      getByCategory: jest.fn().mockImplementation(async (category) => {
        // Simulate category query time (30-100ms)
        await new Promise(resolve => setTimeout(resolve, Math.random() * 70 + 30));
        return [
          { content: `Mock ${category} result`, metadata: { category, priority: 1 }, score: 1.0 }
        ];
      })
    }) as any);

    aiService = new SmartRetriever();
    performanceMonitor.clear();
  });

  describe('Response Time Tests', () => {
    test('should respond within 2 seconds for single query', async () => {
      const query = "What is your experience with React?";
      
      performanceMonitor.mark('query-start');
      const start = Date.now();
      
      const result = await aiService.retrieve(query);
      
      const duration = Date.now() - start;
      performanceMonitor.mark('query-end');
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(duration).toBeLessThan(2000); // Must complete within 2 seconds
      
      console.log(`Query completed in ${duration}ms`);
    });

    test('should respond within 1.5 seconds for skills queries', async () => {
      const queries = [
        "What programming languages do you know?",
        "Tell me about your React skills",
        "What frameworks do you use?",
        "Do you know TypeScript?"
      ];

      for (const query of queries) {
        const start = Date.now();
        
        const result = await aiService.retrieve(query);
        
        const duration = Date.now() - start;
        
        expect(result).toBeDefined();
        expect(duration).toBeLessThan(1500); // Faster for category-specific queries
        
        console.log(`Skills query "${query}" completed in ${duration}ms`);
      }
    });

    test('should respond within 1 second for cached/optimized queries', async () => {
      // Simulate optimized queries that should be faster
      const optimizedQueries = [
        "Who are you?",
        "How can I contact you?",
        "What's your name?"
      ];

      for (const query of optimizedQueries) {
        const { result, duration } = await MockTimer.measureAsync(() => 
          aiService.retrieve(query)
        );

        expect(result).toBeDefined();
        expect(duration).toBeLessThan(1000); // Very fast for simple queries
      }
    });

    test('should maintain performance with complex queries', async () => {
      const complexQueries = [
        "Tell me about your experience with React, Node.js, TypeScript, and MongoDB in large-scale applications",
        "What projects have you built using modern web technologies like Next.js, GraphQL, and cloud services?",
        "How do you approach full-stack development with microservices architecture and CI/CD pipelines?"
      ];

      for (const query of complexQueries) {
        const start = Date.now();
        
        const result = await aiService.retrieve(query);
        
        const duration = Date.now() - start;
        
        expect(result).toBeDefined();
        expect(duration).toBeLessThan(2500); // Allow slightly more time for complex queries
        
        console.log(`Complex query completed in ${duration}ms`);
      }
    });
  });

  describe('Concurrent Request Tests', () => {
    test('should handle concurrent requests efficiently', async () => {
      const queries = [
        "What are your skills?",
        "Tell me about your projects",
        "What's your experience?",
        "How can I contact you?",
        "What technologies do you know?"
      ];
      
      const start = Date.now();
      performanceMonitor.mark('concurrent-start');
      
      const promises = queries.map((query, i) => 
        aiService.retrieve(query).then(result => ({ query, result, index: i }))
      );
      
      const responses = await Promise.all(promises);
      
      const duration = Date.now() - start;
      performanceMonitor.mark('concurrent-end');
      
      expect(responses.length).toBe(5);
      responses.forEach(({ result, query }) => {
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });
      
      // All 5 concurrent requests should complete within 5 seconds
      expect(duration).toBeLessThan(5000);
      
      console.log(`5 concurrent queries completed in ${duration}ms`);
      console.log(`Average per query: ${Math.round(duration / 5)}ms`);
    });

    test('should handle high concurrency load', async () => {
      const queries = generatePerformanceTestQueries(10);
      
      const start = Date.now();
      
      const promises = queries.map((query, i) => 
        aiService.retrieve(query, { k: 2 }) // Limit results for faster processing
          .then(result => ({ success: true, index: i, result }))
          .catch(error => ({ success: false, index: i, error: error.message }))
      );
      
      const responses = await Promise.all(promises);
      
      const duration = Date.now() - start;
      const successful = responses.filter(r => r.success).length;
      
      expect(successful).toBeGreaterThanOrEqual(8); // At least 80% success rate
      expect(duration).toBeLessThan(8000); // 10 concurrent requests within 8 seconds
      
      console.log(`${successful}/10 concurrent queries succeeded in ${duration}ms`);
    });

    test('should maintain response quality under concurrent load', async () => {
      const queries = [
        "What React skills do you have?",
        "Tell me about your Node.js projects",
        "What's your TypeScript experience?",
        "How do you handle MongoDB databases?",
        "What Next.js features do you use?"
      ];
      
      const promises = queries.map(async (query) => {
        const result = await aiService.retrieve(query);
        return {
          query,
          result,
          hasResults: result.length > 0,
          avgScore: result.reduce((sum, chunk) => sum + chunk.score, 0) / result.length
        };
      });
      
      const responses = await Promise.all(promises);
      
      responses.forEach(({ query, hasResults, avgScore }) => {
        expect(hasResults).toBe(true);
        expect(avgScore).toBeGreaterThan(0.5); // Maintain quality threshold
      });
    });
  });

  describe('Memory and Resource Usage', () => {
    test('should not leak memory during repeated operations', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Perform multiple operations
      for (let i = 0; i < 20; i++) {
        await aiService.retrieve(`Test query ${i}`);
        
        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
      
      console.log(`Memory increase: ${Math.round(memoryIncrease / 1024 / 1024)}MB`);
    });

    test('should handle resource cleanup properly', async () => {
      // Simulate rapid creation and cleanup
      const queries = generatePerformanceTestQueries(15);
      
      for (const query of queries) {
        const retriever = new SmartRetriever();
        await retriever.retrieve(query, { k: 1 });
        // Service should be eligible for garbage collection
      }
      
      // Test should complete without resource exhaustion
      expect(true).toBe(true);
    });
  });

  describe('Throughput Tests', () => {
    test('should achieve minimum throughput requirements', async () => {
      const queries = generatePerformanceTestQueries(20);
      const startTime = Date.now();
      
      // Process queries in batches of 5
      const batchSize = 5;
      const batches = [];
      
      for (let i = 0; i < queries.length; i += batchSize) {
        batches.push(queries.slice(i, i + batchSize));
      }
      
      let totalProcessed = 0;
      
      for (const batch of batches) {
        const batchPromises = batch.map(query => aiService.retrieve(query));
        await Promise.all(batchPromises);
        totalProcessed += batch.length;
      }
      
      const totalTime = Date.now() - startTime;
      const throughput = (totalProcessed / totalTime) * 1000; // queries per second
      
      expect(totalProcessed).toBe(20);
      expect(throughput).toBeGreaterThan(2); // At least 2 queries per second
      
      console.log(`Throughput: ${throughput.toFixed(2)} queries/second`);
    });

    test('should maintain consistent performance over time', async () => {
      const measurements: number[] = [];
      
      // Take 10 measurements over time
      for (let i = 0; i < 10; i++) {
        const start = Date.now();
        await aiService.retrieve(`Performance test ${i}`);
        const duration = Date.now() - start;
        measurements.push(duration);
        
        // Small delay between measurements
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const avgDuration = measurements.reduce((sum, d) => sum + d, 0) / measurements.length;
      const maxDuration = Math.max(...measurements);
      const minDuration = Math.min(...measurements);
      
      // Performance should be consistent (max shouldn't be more than 3x min)
      expect(maxDuration).toBeLessThan(minDuration * 3);
      expect(avgDuration).toBeLessThan(2000);
      
      console.log(`Performance consistency: avg=${avgDuration.toFixed(0)}ms, min=${minDuration}ms, max=${maxDuration}ms`);
    });
  });

  describe('Error Recovery Performance', () => {
    test('should recover quickly from transient failures', async () => {
      // Mock a service that fails every 3rd call
      let callCount = 0;
      const mockService = new MockEmbeddingService({ shouldFailAfterCalls: 3 });
      
      (EmbeddingService as jest.MockedClass<typeof EmbeddingService>).mockImplementation(() => ({
        generateEmbedding: jest.fn().mockImplementation(async (text: string) => {
          callCount++;
          if (callCount % 3 === 0) {
            throw new Error('Transient failure');
          }
          await new Promise(resolve => setTimeout(resolve, 50));
          return mockService.generateEmbedding(text);
        })
      }) as any);
      
      const testRetriever = new SmartRetriever();
      const queries = ['Query 1', 'Query 2', 'Query 3', 'Query 4', 'Query 5'];
      
      let successCount = 0;
      let totalTime = 0;
      
      for (const query of queries) {
        const start = Date.now();
        try {
          await testRetriever.retrieve(query);
          successCount++;
        } catch (error) {
          // Expected for some queries
        }
        totalTime += Date.now() - start;
      }
      
      // Should handle failures gracefully and maintain reasonable performance
      expect(successCount).toBeGreaterThanOrEqual(3); // At least 60% success
      expect(totalTime / queries.length).toBeLessThan(3000); // Average under 3 seconds
    });
  });

  describe('Performance Regression Tests', () => {
    test('should maintain baseline performance', async () => {
      // Baseline performance test - update these values based on your requirements
      const baselineQueries = [
        "What are your skills?",
        "Tell me about your projects",
        "What's your experience?"
      ];
      
      const durations: number[] = [];
      
      for (const query of baselineQueries) {
        const start = Date.now();
        await aiService.retrieve(query);
        durations.push(Date.now() - start);
      }
      
      const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      
      // Baseline: average query should complete within 1.5 seconds
      expect(avgDuration).toBeLessThan(1500);
      
      console.log(`Baseline performance: ${avgDuration.toFixed(0)}ms average`);
    });

    test('should not degrade with repeated use', async () => {
      const query = "What technologies do you know?";
      const measurements: number[] = [];
      
      // Run the same query 15 times
      for (let i = 0; i < 15; i++) {
        const start = Date.now();
        await aiService.retrieve(query);
        measurements.push(Date.now() - start);
      }
      
      // Compare first 5 vs last 5 measurements
      const firstFive = measurements.slice(0, 5);
      const lastFive = measurements.slice(-5);
      
      const firstAvg = firstFive.reduce((sum, d) => sum + d, 0) / firstFive.length;
      const lastAvg = lastFive.reduce((sum, d) => sum + d, 0) / lastFive.length;
      
      // Performance shouldn't degrade by more than 50%
      expect(lastAvg).toBeLessThan(firstAvg * 1.5);
      
      console.log(`Performance stability: first=${firstAvg.toFixed(0)}ms, last=${lastAvg.toFixed(0)}ms`);
    });
  });
});