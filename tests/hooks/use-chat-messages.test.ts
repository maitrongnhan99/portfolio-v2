import { useChatMessages } from "@/hooks/use-chat-messages";
import { RetryManager } from "@/lib/retry-utils";
import { Message } from "@/types/chat";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the RetryManager
vi.mock("@/lib/retry-utils", () => ({
  RetryManager: {
    retryFetch: vi.fn(),
  },
}));

// Mock fetch globally
global.fetch = vi.fn();

describe("useChatMessages", () => {
  // Mock console.error to suppress expected error logs
  const originalConsoleError = console.error;

  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for cleaner test output
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore original console.error
    console.error = originalConsoleError;
  });

  describe("initial state", () => {
    it("should have empty messages and correct initial states", () => {
      const { result } = renderHook(() => useChatMessages());

      expect(result.current.messages).toEqual([]);
      expect(result.current.isTyping).toBe(false);
      expect(result.current.streamingState).toEqual({
        isStreaming: false,
        streamingMessageId: null,
      });
    });
  });

  describe("detectTopic", () => {
    it("should detect skills topic", () => {
      const { result } = renderHook(() => useChatMessages());

      const topic = result.current.detectTopic(
        "What programming languages do you know?"
      );
      expect(topic).toBe("skills");
    });

    it("should detect experience topic", () => {
      const { result } = renderHook(() => useChatMessages());

      const topic = result.current.detectTopic(
        "Tell me about your work experience"
      );
      expect(topic).toBe("experience");
    });

    it("should detect projects topic", () => {
      const { result } = renderHook(() => useChatMessages());

      const topic = result.current.detectTopic("What projects have you built?");
      expect(topic).toBe("projects");
    });

    it("should return null for unrelated topics", () => {
      const { result } = renderHook(() => useChatMessages());

      const topic = result.current.detectTopic("Hello, how are you?");
      expect(topic).toBeNull();
    });

    it("should be case insensitive", () => {
      const { result } = renderHook(() => useChatMessages());

      const topic1 = result.current.detectTopic("TELL ME ABOUT YOUR SKILLS");
      const topic2 = result.current.detectTopic("tell me about your skills");

      expect(topic1).toBe("skills");
      expect(topic2).toBe("skills");
    });
  });

  describe("addUserMessage", () => {
    it("should add a user message to the messages array", () => {
      const { result } = renderHook(() => useChatMessages());

      act(() => {
        const message = result.current.addUserMessage("Hello!");

        expect(message).toMatchObject({
          text: "Hello!",
          isUser: true,
          type: "message",
        });
        expect(message.id).toBeDefined();
        expect(message.timestamp).toBeInstanceOf(Date);
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].text).toBe("Hello!");
      expect(result.current.messages[0].isUser).toBe(true);
    });

    it("should generate unique IDs for messages", async () => {
      const { result } = renderHook(() => useChatMessages());

      act(() => {
        result.current.addUserMessage("First message");
      });

      // Add small delay to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));

      act(() => {
        result.current.addUserMessage("Second message");
      });

      expect(result.current.messages[0].id).not.toBe(
        result.current.messages[1].id
      );
    });
  });

  describe("handleNonStreamingMessage", () => {
    it("should handle successful non-streaming response", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          response: "AI response",
          sources: [{ content: "Source 1", category: "test", score: 0.9 }],
        }),
      };

      vi.mocked(RetryManager.retryFetch).mockResolvedValue(mockResponse as any);

      const { result } = renderHook(() => useChatMessages());

      await act(async () => {
        await result.current.handleNonStreamingMessage("Test message", []);
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(1);
        expect(result.current.messages[0].text).toBe("AI response");
        expect(result.current.messages[0].isUser).toBe(false);
        expect(result.current.messages[0].sources).toEqual([
          { content: "Source 1", category: "test", score: 0.9 },
        ]);
      });

      expect(result.current.isTyping).toBe(false);
    });

    it("should handle API error response", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          error: "API Error",
        }),
      };

      vi.mocked(RetryManager.retryFetch).mockResolvedValue(mockResponse as any);

      const { result } = renderHook(() => useChatMessages());

      await act(async () => {
        await result.current.handleNonStreamingMessage("Test message", []);
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(1);
        expect(result.current.messages[0].text).toContain(
          "experiencing some technical difficulties"
        );
        expect(result.current.messages[0].isUser).toBe(false);
      });

      // Verify that console.error was called with the expected error
      expect(console.error).toHaveBeenCalledWith(
        "Error sending message:",
        expect.any(Error)
      );
    });

    it("should handle HTTP error", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      };

      vi.mocked(RetryManager.retryFetch).mockResolvedValue(mockResponse as any);

      const { result } = renderHook(() => useChatMessages());

      await act(async () => {
        await result.current.handleNonStreamingMessage("Test message", []);
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(1);
        expect(result.current.messages[0].text).toContain(
          "experiencing some technical difficulties"
        );
      });
    });

    it("should handle network error", async () => {
      vi.mocked(RetryManager.retryFetch).mockRejectedValue(
        new Error("Network error")
      );

      const { result } = renderHook(() => useChatMessages());

      await act(async () => {
        await result.current.handleNonStreamingMessage("Test message", []);
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(1);
        expect(result.current.messages[0].text).toContain(
          "experiencing some technical difficulties"
        );
      });
    });

    it("should set isTyping during request", async () => {
      let resolvePromise: any;
      const mockPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      const mockResponse = {
        ok: true,
        json: vi.fn().mockReturnValue(mockPromise),
      };

      vi.mocked(RetryManager.retryFetch).mockResolvedValue(mockResponse as any);

      const { result } = renderHook(() => useChatMessages());

      expect(result.current.isTyping).toBe(false);

      // Start the async operation without awaiting
      act(() => {
        result.current.handleNonStreamingMessage("Test", []);
      });

      // Check isTyping is true while request is in progress
      expect(result.current.isTyping).toBe(true);

      // Resolve the promise
      resolvePromise({ response: "Test" });

      // Wait for the hook to update
      await waitFor(() => {
        expect(result.current.isTyping).toBe(false);
      });
    });
  });

  describe("handleStreamingMessage", () => {
    it("should handle successful streaming response", async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            new TextEncoder().encode(
              'data: {"type":"chunk","content":"Hello"}\n'
            )
          );
          controller.enqueue(
            new TextEncoder().encode(
              'data: {"type":"chunk","content":" world"}\n'
            )
          );
          controller.enqueue(
            new TextEncoder().encode(
              'data: {"type":"sources","sources":[{"content":"Source","category":"test","score":0.9}]}\n'
            )
          );
          controller.enqueue(
            new TextEncoder().encode('data: {"type":"done"}\n')
          );
          controller.close();
        },
      });

      const mockResponse = {
        ok: true,
        body: mockStream,
      };

      vi.mocked(RetryManager.retryFetch).mockResolvedValue(mockResponse as any);

      const { result } = renderHook(() => useChatMessages());

      await act(async () => {
        await result.current.handleStreamingMessage("Test message", []);
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(1);
        expect(result.current.messages[0].text).toBe("Hello world");
        expect(result.current.messages[0].isUser).toBe(false);
        expect(result.current.messages[0].isStreaming).toBe(false);
        expect(result.current.messages[0].streamingComplete).toBe(true);
        expect(result.current.messages[0].sources).toEqual([
          { content: "Source", category: "test", score: 0.9 },
        ]);
      });

      expect(result.current.streamingState.isStreaming).toBe(false);
    });

    it("should handle streaming error", async () => {
      // Simulate a network error during streaming
      vi.mocked(RetryManager.retryFetch).mockRejectedValue(
        new Error("Network error during streaming")
      );

      const { result } = renderHook(() => useChatMessages());

      await act(async () => {
        await result.current.handleStreamingMessage("Test message", []);
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(1);
        expect(result.current.messages[0].text).toContain(
          "experiencing some technical difficulties"
        );
        expect(result.current.messages[0].isStreaming).toBe(false);
        expect(result.current.messages[0].streamingComplete).toBe(true);
      });
    });

    it("should handle missing response body", async () => {
      const mockResponse = {
        ok: true,
        body: null,
      };

      vi.mocked(RetryManager.retryFetch).mockResolvedValue(mockResponse as any);

      const { result } = renderHook(() => useChatMessages());

      await act(async () => {
        await result.current.handleStreamingMessage("Test message", []);
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(1);
        expect(result.current.messages[0].text).toContain(
          "experiencing some technical difficulties"
        );
      });
    });

    it("should update streaming state during streaming", async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            new TextEncoder().encode(
              'data: {"type":"chunk","content":"Test"}\n'
            )
          );
          controller.enqueue(
            new TextEncoder().encode('data: {"type":"done"}\n')
          );
          controller.close();
        },
      });

      const mockResponse = {
        ok: true,
        body: mockStream,
      };

      vi.mocked(RetryManager.retryFetch).mockResolvedValue(mockResponse as any);

      const { result } = renderHook(() => useChatMessages());

      // Check initial state
      expect(result.current.streamingState.isStreaming).toBe(false);

      // Start streaming
      await act(async () => {
        await result.current.handleStreamingMessage("Test", []);
      });

      // Check final streaming state
      await waitFor(() => {
        expect(result.current.streamingState.isStreaming).toBe(false);
        expect(result.current.messages).toHaveLength(1);
        expect(result.current.messages[0].text).toBe("Test");
      });
    });
  });

  describe("clearMessages", () => {
    it("should clear all messages and reset states", async () => {
      const { result } = renderHook(() => useChatMessages());

      // Add some messages first
      act(() => {
        result.current.addUserMessage("Message 1");
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(1);
      });

      act(() => {
        result.current.addUserMessage("Message 2");
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(2);
      });

      // Clear messages
      act(() => {
        result.current.clearMessages();
      });

      await waitFor(() => {
        expect(result.current.messages).toEqual([]);
        expect(result.current.isTyping).toBe(false);
        expect(result.current.streamingState).toEqual({
          isStreaming: false,
          streamingMessageId: null,
        });
      });
    });
  });

  describe("loadMessages", () => {
    it("should load messages into state", async () => {
      const { result } = renderHook(() => useChatMessages());

      const messagesToLoad: Message[] = [
        {
          id: "1",
          text: "Loaded message 1",
          isUser: true,
          timestamp: new Date(),
          type: "message",
        },
        {
          id: "2",
          text: "Loaded message 2",
          isUser: false,
          timestamp: new Date(),
          type: "message",
        },
      ];

      act(() => {
        result.current.loadMessages(messagesToLoad);
      });

      await waitFor(() => {
        expect(result.current.messages).toEqual(messagesToLoad);
      });
    });

    it("should replace existing messages", async () => {
      const { result } = renderHook(() => useChatMessages());

      // Add initial message
      act(() => {
        result.current.addUserMessage("Initial message");
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(1);
      });

      const newMessages: Message[] = [
        {
          id: "new1",
          text: "New message",
          isUser: true,
          timestamp: new Date(),
          type: "message",
        },
      ];

      act(() => {
        result.current.loadMessages(newMessages);
      });

      await waitFor(() => {
        expect(result.current.messages).toEqual(newMessages);
        expect(result.current.messages).toHaveLength(1);
        expect(result.current.messages[0].text).toBe("New message");
      });
    });
  });
});
