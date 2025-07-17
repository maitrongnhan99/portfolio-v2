import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/ai-assistant/chat/route';
import { createMockHttpRequest, MockEmbeddingService, createMockGeminiAI } from '../utils/mockServices';
import { generateMockRetrievedChunks, mockEnvironment } from '../utils/testUtils';
import SmartRetriever from '@/services/retriever';

// Mock dependencies
jest.mock('@/services/retriever');
jest.mock('@google/generative-ai');

describe('Chat API Integration Tests', () => {
  let restoreEnv: () => void;
  let mockRetriever: jest.Mocked<SmartRetriever>;
  let mockGemini: ReturnType<typeof createMockGeminiAI>;

  beforeEach(() => {
    // Setup test environment
    restoreEnv = mockEnvironment({
      GEMINI_API_KEY: 'test-api-key',
      MONGODB_CONNECTION_STRING: 'mongodb://test'
    });

    // Create mock services
    mockGemini = createMockGeminiAI();
    
    // Mock SmartRetriever
    mockRetriever = {
      retrieve: jest.fn(),
      hybridSearch: jest.fn(),
      getContextByCategory: jest.fn()
    } as any;

    (SmartRetriever as jest.MockedClass<typeof SmartRetriever>).mockImplementation(() => mockRetriever);

    // Setup default mock responses
    mockRetriever.retrieve.mockResolvedValue(generateMockRetrievedChunks(3));
    
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    GoogleGenerativeAI.mockImplementation(() => mockGemini.mockGenAI);
  });

  afterEach(() => {
    restoreEnv();
    jest.clearAllMocks();
  });

  describe('POST /api/ai-assistant/chat', () => {
    test('should handle valid chat request successfully', async () => {
      const requestBody = {
        message: "What are your React skills?",
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
      expect(typeof data.response).toBe('string');
      expect(data.response.length).toBeGreaterThan(0);
      expect(data.sources).toBeDefined();
      expect(Array.isArray(data.sources)).toBe(true);
      expect(mockRetriever.retrieve).toHaveBeenCalledWith(
        requestBody.message,
        expect.objectContaining({
          k: 3,
          threshold: 0.6,
          useIntent: true,
          rerankResults: true
        })
      );
    });

    test('should include conversation history in system prompt', async () => {
      const requestBody = {
        message: "Tell me more about that",
        conversationHistory: [
          { role: 'user' as const, content: 'What are your skills?' },
          { role: 'assistant' as const, content: 'I have React and Node.js skills' }
        ]
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
      expect(mockGemini.mockGenerateContent).toHaveBeenCalled();
      
      // Check that conversation history was included in the prompt
      const generateCall = mockGemini.mockGenerateContent.mock.calls[0];
      const systemPrompt = generateCall[0][0].text;
      expect(systemPrompt).toContain('CONVERSATION CONTEXT');
    });

    test('should handle empty message with error', async () => {
      const requestBody = { message: "", conversationHistory: [] };

      const request = new NextRequest('http://localhost:3000/api/ai-assistant/chat', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'content-type': 'application/json' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Message cannot be empty');
    });

    test('should handle whitespace-only message with error', async () => {
      const requestBody = { message: "   \n\t   ", conversationHistory: [] };

      const request = new NextRequest('http://localhost:3000/api/ai-assistant/chat', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'content-type': 'application/json' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Message cannot be empty');
    });

    test('should handle missing GEMINI_API_KEY with fallback response', async () => {
      // Test with missing API key
      const restoreEnvNoKey = mockEnvironment({
        MONGODB_CONNECTION_STRING: 'mongodb://test'
        // No GEMINI_API_KEY
      });

      const requestBody = {
        message: "What are your skills?",
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
      expect(data.response).toContain('Based on'); // Fallback response pattern
      
      restoreEnvNoKey();
    });

    test('should handle Gemini API errors with fallback', async () => {
      mockGemini.mockGenerateContent.mockRejectedValueOnce(new Error('Gemini API Error'));

      const requestBody = {
        message: "What technologies do you know?",
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

    test('should handle retrieval errors gracefully', async () => {
      mockRetriever.retrieve.mockRejectedValueOnce(new Error('Retrieval failed'));

      const requestBody = {
        message: "What are your projects?",
        conversationHistory: []
      };

      const request = new NextRequest('http://localhost:3000/api/ai-assistant/chat', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'content-type': 'application/json' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });

    test('should limit conversation history to last 4 messages', async () => {
      const longHistory = [
        { role: 'user' as const, content: 'Message 1' },
        { role: 'assistant' as const, content: 'Response 1' },
        { role: 'user' as const, content: 'Message 2' },
        { role: 'assistant' as const, content: 'Response 2' },
        { role: 'user' as const, content: 'Message 3' },
        { role: 'assistant' as const, content: 'Response 3' },
        { role: 'user' as const, content: 'Message 4' },
        { role: 'assistant' as const, content: 'Response 4' }
      ];

      const requestBody = {
        message: "Current message",
        conversationHistory: longHistory
      };

      const request = new NextRequest('http://localhost:3000/api/ai-assistant/chat', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'content-type': 'application/json' }
      });

      const response = await POST(request);
      
      expect(response.status).toBe(200);
      expect(mockGemini.mockGenerateContent).toHaveBeenCalled();
      
      // Check that only last 4 messages were included
      const generateCall = mockGemini.mockGenerateContent.mock.calls[0];
      const systemPrompt = generateCall[0][0].text;
      expect(systemPrompt).toContain('Message 2');
      expect(systemPrompt).not.toContain('Message 1');
    });

    test('should include source information in response', async () => {
      const mockChunks = generateMockRetrievedChunks(2, 0.8);
      mockRetriever.retrieve.mockResolvedValueOnce(mockChunks);

      const requestBody = {
        message: "What are your skills?",
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
      expect(data.sources).toHaveLength(2);
      
      data.sources.forEach((source: any) => {
        expect(source.content).toBeDefined();
        expect(source.category).toBeDefined();
        expect(typeof source.score).toBe('number');
        expect(source.score).toBeGreaterThan(0);
        expect(source.score).toBeLessThanOrEqual(1);
      });
    });

    test('should truncate long source content', async () => {
      const longContent = 'A'.repeat(300);
      const mockChunk = generateMockRetrievedChunks(1)[0];
      mockChunk.content = longContent;
      
      mockRetriever.retrieve.mockResolvedValueOnce([mockChunk]);

      const requestBody = {
        message: "Test long content",
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
      expect(data.sources[0].content.length).toBeLessThanOrEqual(203); // 200 + "..."
      expect(data.sources[0].content).toContain('...');
    });

    test('should handle malformed JSON request', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai-assistant/chat', {
        method: 'POST',
        body: 'invalid json {',
        headers: { 'content-type': 'application/json' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });

    test('should handle missing request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai-assistant/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });

  describe('GET /api/ai-assistant/chat', () => {
    test('should return API information', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('AI Assistant Chat API is running');
      expect(data.endpoints).toBeDefined();
      expect(data.endpoints.POST).toBe('Send a message to the AI assistant');
    });
  });

  describe('Fallback Response Generation', () => {
    test('should generate appropriate skills fallback response', async () => {
      // Test with no API key to trigger fallback
      const restoreEnvNoKey = mockEnvironment({
        MONGODB_CONNECTION_STRING: 'mongodb://test'
      });

      const skillsChunk = generateMockRetrievedChunks(1)[0];
      skillsChunk.metadata.category = 'skills';
      skillsChunk.content = 'Mai has expertise in React, Node.js, and TypeScript';
      
      mockRetriever.retrieve.mockResolvedValueOnce([skillsChunk]);

      const requestBody = {
        message: "What programming skills do you have?",
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
      expect(data.response).toContain('technical background');
      expect(data.response).toContain(skillsChunk.content);
      
      restoreEnvNoKey();
    });

    test('should generate appropriate projects fallback response', async () => {
      const restoreEnvNoKey = mockEnvironment({
        MONGODB_CONNECTION_STRING: 'mongodb://test'
      });

      const projectsChunk = generateMockRetrievedChunks(1)[0];
      projectsChunk.metadata.category = 'projects';
      
      mockRetriever.retrieve.mockResolvedValueOnce([projectsChunk]);

      const requestBody = {
        message: "What projects have you built?",
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
      expect(data.response).toContain('projects');
      
      restoreEnvNoKey();
    });

    test('should generate greeting fallback for hello messages', async () => {
      const restoreEnvNoKey = mockEnvironment({
        MONGODB_CONNECTION_STRING: 'mongodb://test'
      });

      mockRetriever.retrieve.mockResolvedValueOnce([]);

      const requestBody = {
        message: "Hello there!",
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
      expect(data.response).toContain('Hello');
      expect(data.response).toContain('AI assistant');
      
      restoreEnvNoKey();
    });

    test('should generate generic fallback for unknown queries', async () => {
      const restoreEnvNoKey = mockEnvironment({
        MONGODB_CONNECTION_STRING: 'mongodb://test'
      });

      mockRetriever.retrieve.mockResolvedValueOnce([]);

      const requestBody = {
        message: "Random unknown question",
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
      expect(data.response).toContain('Skills & Technologies');
      expect(data.response).toContain('Professional Experience');
      expect(data.response).toContain('Projects');
      
      restoreEnvNoKey();
    });
  });

  describe('Performance Tests', () => {
    test('should respond within 2 seconds', async () => {
      const requestBody = {
        message: "What is your experience with React?",
        conversationHistory: []
      };

      const request = new NextRequest('http://localhost:3000/api/ai-assistant/chat', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'content-type': 'application/json' }
      });

      const start = Date.now();
      const response = await POST(request);
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(2000);
    });

    test('should handle concurrent requests', async () => {
      const queries = [
        "What are your skills?",
        "Tell me about your projects",
        "What's your experience?",
        "How can I contact you?",
        "What technologies do you know?"
      ];

      const start = Date.now();
      const promises = queries.map((message, i) => {
        const request = new NextRequest('http://localhost:3000/api/ai-assistant/chat', {
          method: 'POST',
          body: JSON.stringify({ message, conversationHistory: [] }),
          headers: { 'content-type': 'application/json' }
        });
        return POST(request);
      });

      const responses = await Promise.all(promises);
      const duration = Date.now() - start;

      expect(responses.length).toBe(5);
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
      expect(duration).toBeLessThan(5000); // All should complete within 5 seconds
    });
  });

  describe('Edge Cases', () => {
    test('should handle very long messages', async () => {
      const longMessage = 'Tell me about your skills. '.repeat(100);
      
      const requestBody = {
        message: longMessage,
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
    });

    test('should handle special characters in message', async () => {
      const specialMessage = "What's your experience with @React & Node.js?! 🚀 测试";
      
      const requestBody = {
        message: specialMessage,
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
    });

    test('should handle null/undefined values in conversation history', async () => {
      const requestBody = {
        message: "Test message",
        conversationHistory: [
          { role: 'user' as const, content: 'Valid message' },
          null as any,
          { role: 'assistant' as const, content: 'Valid response' },
          undefined as any
        ]
      };

      const request = new NextRequest('http://localhost:3000/api/ai-assistant/chat', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'content-type': 'application/json' }
      });

      const response = await POST(request);
      
      // Should handle gracefully without crashing
      expect([200, 500]).toContain(response.status);
    });
  });
});