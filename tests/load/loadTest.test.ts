import { describe, test, expect, jest, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { MockTimer, generatePerformanceTestQueries, mockEnvironment } from '../utils/testUtils';
import { MockEmbeddingService, MockPerformanceMonitor, MockRateLimiter } from '../utils/mockServices';
import SmartRetriever from '@/services/retriever';
import EmbeddingService from '@/services/embeddingService';
import MongoVectorStore from '@/services/vectorStore';

// Mock dependencies for load testing
jest.mock('@/services/embeddingService');
jest.mock('@/services/vectorStore');

describe('Load Testing and Stress Tests', () => {
  let aiService: SmartRetriever;
  let performanceMonitor: MockPerformanceMonitor;
  let rateLimiter: MockRateLimiter;
  let restoreEnv: () => void;

  beforeAll(() => {
    restoreEnv = mockEnvironment({
      GEMINI_API_KEY: 'test-api-key',
      MONGODB_CONNECTION_STRING: 'mongodb://test'
    });

    performanceMonitor = new MockPerformanceMonitor();
    rateLimiter = new MockRateLimiter(60000, 100); // 100 requests per minute
  });

  afterAll(() => {
    restoreEnv();
  });

  beforeEach(() => {
    // Setup optimized mocks for load testing
    const mockEmbeddingService = new MockEmbeddingService();
    
    (EmbeddingService as jest.MockedClass<typeof EmbeddingService>).mockImplementation(() => ({
      generateEmbedding: jest.fn().mockImplementation(async (text: string) => {
        // Simulate realistic API latency (20-100ms)
        const latency = Math.random() * 80 + 20;
        await new Promise(resolve => setTimeout(resolve, latency));
        return mockEmbeddingService.generateEmbedding(text);
      })
    }) as any);

    (MongoVectorStore as jest.MockedClass<typeof MongoVectorStore>).mockImplementation(() => ({
      similaritySearch: jest.fn().mockImplementation(async () => {
        // Simulate database query latency (10-150ms)
        const latency = Math.random() * 140 + 10;
        await new Promise(resolve => setTimeout(resolve, latency));
        return [
          { content: 'Result 1', metadata: { category: 'skills', priority: 1 }, score: 0.9 },
          { content: 'Result 2', metadata: { category: 'experience', priority: 2 }, score: 0.8 },
          { content: 'Result 3', metadata: { category: 'projects', priority: 1 }, score: 0.7 }
        ];
      }),
      getByCategory: jest.fn().mockImplementation(async () => {
        const latency = Math.random() * 50 + 10;
        await new Promise(resolve => setTimeout(resolve, latency));
        return [{ content: 'Category result', metadata: { category: 'skills', priority: 1 }, score: 1.0 }];
      })
    }) as any);

    aiService = new SmartRetriever();
    performanceMonitor.clear();
    rateLimiter.reset();
  });

  describe('High Volume Load Tests', () => {
    test('should handle 50 concurrent requests efficiently', async () => {
      const queries = generatePerformanceTestQueries(50);
      
      performanceMonitor.mark('load-test-start');
      const startTime = Date.now();
      
      const promises = queries.map(async (query, index) => {
        try {
          const queryStart = Date.now();
          const result = await aiService.retrieve(query, { k: 2 });
          const queryDuration = Date.now() - queryStart;
          
          return {
            index,
            success: true,
            duration: queryDuration,
            resultCount: result.length
          };
        } catch (error) {
          return {
            index,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            duration: 0,
            resultCount: 0
          };
        }
      });

      const results = await Promise.all(promises);
      const totalDuration = Date.now() - startTime;
      performanceMonitor.mark('load-test-end');

      // Analyze results
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      const avgDuration = successful.reduce((sum, r) => sum + r.duration, 0) / successful.length;
      const maxDuration = Math.max(...successful.map(r => r.duration));
      const minDuration = Math.min(...successful.map(r => r.duration));
      const throughput = (successful.length / totalDuration) * 1000; // requests per second

      // Assertions
      expect(successful.length).toBeGreaterThanOrEqual(45); // At least 90% success rate
      expect(avgDuration).toBeLessThan(3000); // Average under 3 seconds
      expect(maxDuration).toBeLessThan(8000); // No request over 8 seconds
      expect(throughput).toBeGreaterThan(5); // At least 5 requests per second

      console.log(`Load Test Results:`);
      console.log(`  Total Requests: ${queries.length}`);
      console.log(`  Successful: ${successful.length} (${Math.round(successful.length/queries.length*100)}%)`);
      console.log(`  Failed: ${failed.length}`);
      console.log(`  Average Duration: ${Math.round(avgDuration)}ms`);
      console.log(`  Min/Max Duration: ${minDuration}ms / ${maxDuration}ms`);
      console.log(`  Throughput: ${throughput.toFixed(2)} req/sec`);
    });

    test('should handle sustained load over time', async () => {
      const duration = 10000; // 10 seconds
      const interval = 200; // New request every 200ms
      const expectedRequests = Math.floor(duration / interval);
      
      const results: Array<{ timestamp: number; duration: number; success: boolean }> = [];
      const startTime = Date.now();
      
      // Generate sustained load
      const loadPromise = new Promise<void>((resolve) => {
        const intervalId = setInterval(async () => {
          const requestStart = Date.now();
          
          if (Date.now() - startTime >= duration) {
            clearInterval(intervalId);
            resolve();
            return;
          }

          try {
            await aiService.retrieve('Sustained load test query', { k: 1 });
            results.push({
              timestamp: Date.now(),
              duration: Date.now() - requestStart,
              success: true
            });
          } catch (error) {
            results.push({
              timestamp: Date.now(),
              duration: Date.now() - requestStart,
              success: false
            });
          }
        }, interval);
      });

      await loadPromise;
      
      // Analyze sustained performance
      const successful = results.filter(r => r.success);
      const avgDuration = successful.reduce((sum, r) => sum + r.duration, 0) / successful.length;
      const successRate = successful.length / results.length;

      // Check for performance degradation over time
      const firstHalf = successful.slice(0, Math.floor(successful.length / 2));
      const secondHalf = successful.slice(Math.floor(successful.length / 2));
      
      const firstHalfAvg = firstHalf.reduce((sum, r) => sum + r.duration, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, r) => sum + r.duration, 0) / secondHalf.length;

      expect(successRate).toBeGreaterThan(0.85); // 85% success rate
      expect(avgDuration).toBeLessThan(2000); // Average under 2 seconds
      expect(secondHalfAvg).toBeLessThan(firstHalfAvg * 1.5); // No significant degradation

      console.log(`Sustained Load Results:`);
      console.log(`  Duration: ${duration}ms`);
      console.log(`  Total Requests: ${results.length}`);
      console.log(`  Success Rate: ${Math.round(successRate * 100)}%`);
      console.log(`  Average Duration: ${Math.round(avgDuration)}ms`);
      console.log(`  Performance Degradation: ${Math.round((secondHalfAvg/firstHalfAvg - 1) * 100)}%`);
    });

    test('should handle burst traffic patterns', async () => {
      const bursts = [
        { size: 10, delay: 0 },
        { size: 20, delay: 1000 },
        { size: 30, delay: 2000 },
        { size: 15, delay: 3000 },
        { size: 5, delay: 4000 }
      ];

      const allResults: Array<{ burst: number; success: boolean; duration: number }> = [];

      for (let burstIndex = 0; burstIndex < bursts.length; burstIndex++) {
        const burst = bursts[burstIndex];
        
        // Wait for burst timing
        if (burst.delay > 0) {
          await new Promise(resolve => setTimeout(resolve, burst.delay));
        }

        // Execute burst
        const burstPromises = Array.from({ length: burst.size }, async (_, i) => {
          const startTime = Date.now();
          try {
            await aiService.retrieve(`Burst ${burstIndex} query ${i}`, { k: 2 });
            return {
              burst: burstIndex,
              success: true,
              duration: Date.now() - startTime
            };
          } catch (error) {
            return {
              burst: burstIndex,
              success: false,
              duration: Date.now() - startTime
            };
          }
        });

        const burstResults = await Promise.all(burstPromises);
        allResults.push(...burstResults);

        console.log(`Burst ${burstIndex}: ${burst.size} requests, ${burstResults.filter(r => r.success).length} successful`);
      }

      // Analyze burst performance
      const totalRequests = allResults.length;
      const successfulRequests = allResults.filter(r => r.success).length;
      const overallSuccessRate = successfulRequests / totalRequests;

      // Check each burst performance
      bursts.forEach((burst, index) => {
        const burstResults = allResults.filter(r => r.burst === index);
        const burstSuccessRate = burstResults.filter(r => r.success).length / burstResults.length;
        expect(burstSuccessRate).toBeGreaterThan(0.8); // Each burst should have >80% success
      });

      expect(overallSuccessRate).toBeGreaterThan(0.85); // Overall 85% success rate
      expect(totalRequests).toBe(bursts.reduce((sum, b) => sum + b.size, 0));

      console.log(`Burst Traffic Results:`);
      console.log(`  Total Requests: ${totalRequests}`);
      console.log(`  Overall Success Rate: ${Math.round(overallSuccessRate * 100)}%`);
    });
  });

  describe('Resource Exhaustion Tests', () => {
    test('should handle memory pressure gracefully', async () => {
      const initialMemory = process.memoryUsage();
      const largeQueries: string[] = [];

      // Generate large queries to test memory handling
      for (let i = 0; i < 100; i++) {
        largeQueries.push(`Large query ${i}: ${'test '.repeat(100)}`);
      }

      let memoryPeak = initialMemory.heapUsed;
      const results: boolean[] = [];

      for (const query of largeQueries) {
        try {
          await aiService.retrieve(query, { k: 1 });
          results.push(true);
          
          const currentMemory = process.memoryUsage().heapUsed;
          memoryPeak = Math.max(memoryPeak, currentMemory);
          
          // Force garbage collection if available
          if (global.gc) {
            global.gc();
          }
        } catch (error) {
          results.push(false);
        }
      }

      const successRate = results.filter(r => r).length / results.length;
      const memoryIncrease = memoryPeak - initialMemory.heapUsed;

      expect(successRate).toBeGreaterThan(0.9); // 90% success under memory pressure
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024); // Less than 100MB increase

      console.log(`Memory Pressure Test:`);
      console.log(`  Success Rate: ${Math.round(successRate * 100)}%`);
      console.log(`  Memory Increase: ${Math.round(memoryIncrease / 1024 / 1024)}MB`);
    });

    test('should handle rate limiting appropriately', async () => {
      // Test with aggressive rate limiting
      const strictLimiter = new MockRateLimiter(10000, 5); // 5 requests per 10 seconds
      
      const requests = Array.from({ length: 10 }, (_, i) => i);
      const results: Array<{ index: number; allowed: boolean; timestamp: number }> = [];

      for (const index of requests) {
        const allowed = await strictLimiter.checkLimit();
        results.push({
          index,
          allowed,
          timestamp: Date.now()
        });

        if (allowed) {
          try {
            await aiService.retrieve(`Rate limited query ${index}`, { k: 1 });
          } catch (error) {
            // Expected under rate limiting
          }
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const allowedRequests = results.filter(r => r.allowed).length;
      const blockedRequests = results.filter(r => !r.allowed).length;

      expect(allowedRequests).toBeLessThanOrEqual(5); // Respects rate limit
      expect(blockedRequests).toBeGreaterThan(0); // Some requests blocked
      expect(allowedRequests + blockedRequests).toBe(10);

      console.log(`Rate Limiting Test:`);
      console.log(`  Allowed: ${allowedRequests}`);
      console.log(`  Blocked: ${blockedRequests}`);
    });

    test('should recover from temporary service failures', async () => {
      let failureCount = 0;
      const maxFailures = 5;
      
      // Mock intermittent failures
      const failingEmbeddingService = new MockEmbeddingService();
      (EmbeddingService as jest.MockedClass<typeof EmbeddingService>).mockImplementation(() => ({
        generateEmbedding: jest.fn().mockImplementation(async (text: string) => {
          failureCount++;
          
          // Fail every 3rd request
          if (failureCount % 3 === 0 && failureCount <= maxFailures * 3) {
            throw new Error('Temporary service failure');
          }
          
          await new Promise(resolve => setTimeout(resolve, 50));
          return failingEmbeddingService.generateEmbedding(text);
        })
      }) as any);

      const testRetriever = new SmartRetriever();
      const queries = generatePerformanceTestQueries(20);
      const results: Array<{ success: boolean; retryCount?: number }> = [];

      for (const query of queries) {
        let success = false;
        let retryCount = 0;
        const maxRetries = 3;

        while (!success && retryCount < maxRetries) {
          try {
            await testRetriever.retrieve(query, { k: 1 });
            success = true;
          } catch (error) {
            retryCount++;
            if (retryCount < maxRetries) {
              // Exponential backoff
              await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, retryCount)));
            }
          }
        }

        results.push({ success, retryCount });
      }

      const successCount = results.filter(r => r.success).length;
      const avgRetries = results.reduce((sum, r) => sum + (r.retryCount || 0), 0) / results.length;

      expect(successCount).toBeGreaterThanOrEqual(15); // At least 75% eventual success
      expect(avgRetries).toBeLessThan(2); // Reasonable retry count

      console.log(`Failure Recovery Test:`);
      console.log(`  Total Queries: ${queries.length}`);
      console.log(`  Successful: ${successCount}`);
      console.log(`  Average Retries: ${avgRetries.toFixed(2)}`);
    });
  });

  describe('Performance Regression Detection', () => {
    test('should maintain baseline performance under load', async () => {
      // Establish baseline
      const baselineQueries = ['Query 1', 'Query 2', 'Query 3'];
      const baselineDurations: number[] = [];

      for (const query of baselineQueries) {
        const start = Date.now();
        await aiService.retrieve(query, { k: 2 });
        baselineDurations.push(Date.now() - start);
      }

      const baselineAvg = baselineDurations.reduce((sum, d) => sum + d, 0) / baselineDurations.length;

      // Test under load
      const loadQueries = generatePerformanceTestQueries(30);
      const loadPromises = loadQueries.map(query => aiService.retrieve(query, { k: 2 }));
      
      // Measure performance while under load
      const loadTestDurations: number[] = [];
      for (const query of baselineQueries) {
        const start = Date.now();
        await aiService.retrieve(query, { k: 2 });
        loadTestDurations.push(Date.now() - start);
      }

      await Promise.all(loadPromises);

      const loadTestAvg = loadTestDurations.reduce((sum, d) => sum + d, 0) / loadTestDurations.length;
      const performanceRatio = loadTestAvg / baselineAvg;

      // Performance shouldn't degrade by more than 100% under load
      expect(performanceRatio).toBeLessThan(2.0);

      console.log(`Performance Regression Test:`);
      console.log(`  Baseline Average: ${Math.round(baselineAvg)}ms`);
      console.log(`  Under Load Average: ${Math.round(loadTestAvg)}ms`);
      console.log(`  Performance Ratio: ${performanceRatio.toFixed(2)}x`);
    });

    test('should scale linearly with request complexity', async () => {
      const complexityLevels = [
        { k: 1, label: 'Simple' },
        { k: 3, label: 'Medium' },
        { k: 5, label: 'Complex' }
      ];

      const results = [];

      for (const level of complexityLevels) {
        const durations: number[] = [];
        
        for (let i = 0; i < 5; i++) {
          const start = Date.now();
          await aiService.retrieve(`Complexity test ${level.label} ${i}`, { k: level.k });
          durations.push(Date.now() - start);
        }

        const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
        results.push({ level: level.label, k: level.k, avgDuration });
      }

      // Performance should scale reasonably with complexity
      const simpleAvg = results.find(r => r.label === 'Simple')!.avgDuration;
      const complexAvg = results.find(r => r.label === 'Complex')!.avgDuration;
      const scalingRatio = complexAvg / simpleAvg;

      expect(scalingRatio).toBeLessThan(3.0); // Complex shouldn't be more than 3x slower

      console.log(`Scaling Test Results:`);
      results.forEach(result => {
        console.log(`  ${result.level} (k=${result.k}): ${Math.round(result.avgDuration)}ms`);
      });
      console.log(`  Scaling Ratio: ${scalingRatio.toFixed(2)}x`);
    });
  });
});