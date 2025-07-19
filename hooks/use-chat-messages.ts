import { useState, useCallback } from "react";
import { Message, StreamingState, TOPIC_KEYWORDS } from "@/types/chat";
import { RetryManager } from "@/lib/retry-utils";

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingState, setStreamingState] = useState<StreamingState>({
    isStreaming: false,
    streamingMessageId: null,
  });

  const detectTopic = (message: string): string | null => {
    const lowerMessage = message.toLowerCase();
    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return topic;
      }
    }
    return null;
  };

  const addUserMessage = useCallback((text: string): Message => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
      type: "message",
    };

    setMessages((prev) => [...prev, userMessage]);
    return userMessage;
  }, []);

  const handleStreamingMessage = useCallback(async (text: string, conversationHistory: Array<{ role: "user" | "assistant"; content: string }>) => {
    setStreamingState({
      isStreaming: true,
      streamingMessageId: null,
    });
    setIsTyping(false);

    // Create AI message placeholder for streaming
    const aiMessageId = (Date.now() + 1).toString();
    const initialAiMessage: Message = {
      id: aiMessageId,
      text: "",
      isUser: false,
      timestamp: new Date(),
      type: "message",
      isStreaming: true,
      streamingComplete: false,
    };

    setMessages((prev) => [...prev, initialAiMessage]);
    setStreamingState({
      isStreaming: true,
      streamingMessageId: aiMessageId,
    });

    try {
      // Call the streaming API with retry logic
      const response = await RetryManager.retryFetch(
        "/api/ai-assistant/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            conversationHistory,
            stream: true,
          }),
        },
        {
          maxAttempts: 3,
          initialDelay: 1000,
          onRetry: (error, attempt) => {
            console.log(
              `Retrying streaming request (attempt ${attempt}):`,
              error.message
            );
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body received");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let sources: Array<{ content: string; category: string; score: number }> = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "chunk" && data.content) {
                accumulatedText += data.content;

                // Update the message with accumulated text
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, text: accumulatedText }
                      : msg
                  )
                );
              } else if (data.type === "sources" && data.sources) {
                sources = data.sources;
              } else if (data.type === "done") {
                // Mark streaming as complete
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? {
                          ...msg,
                          text:
                            accumulatedText ||
                            "I apologize, but I couldn't generate a proper response. Please try rephrasing your question.",
                          isStreaming: false,
                          streamingComplete: true,
                          sources: sources,
                        }
                      : msg
                  )
                );
                break;
              } else if (data.type === "error") {
                throw new Error(data.error || "Streaming error occurred");
              }
            } catch (parseError) {
              console.error("Error parsing streaming data:", parseError);
              // Continue processing other lines
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in streaming message:", error);

      // Update the message with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                text: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment. In the meantime, you can browse Mai's portfolio or contact information directly.",
                isStreaming: false,
                streamingComplete: true,
              }
            : msg
        )
      );
    } finally {
      setStreamingState({
        isStreaming: false,
        streamingMessageId: null,
      });
    }
  }, []);

  const handleNonStreamingMessage = useCallback(async (text: string, conversationHistory: Array<{ role: "user" | "assistant"; content: string }>) => {
    setIsTyping(true);

    try {
      // Call the non-streaming API with retry logic
      const response = await RetryManager.retryFetch(
        "/api/ai-assistant/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            conversationHistory,
            stream: false,
          }),
        },
        {
          maxAttempts: 3,
          initialDelay: 1000,
          onRetry: (error, attempt) => {
            console.log(
              `Retrying non-streaming request (attempt ${attempt}):`,
              error.message
            );
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Create AI message with RAG response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          data.response ||
          "I apologize, but I couldn't generate a proper response. Please try rephrasing your question.",
        isUser: false,
        timestamp: new Date(),
        type: "message",
        sources: data.sources || [],
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Fallback error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment. In the meantime, you can browse Mai's portfolio or contact information directly.",
        isUser: false,
        timestamp: new Date(),
        type: "message",
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, errorMessage]);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
    setStreamingState({
      isStreaming: false,
      streamingMessageId: null,
    });
  }, []);

  const loadMessages = useCallback((newMessages: Message[]) => {
    setMessages(newMessages);
  }, []);

  return {
    messages,
    isTyping,
    streamingState,
    addUserMessage,
    handleStreamingMessage,
    handleNonStreamingMessage,
    detectTopic,
    clearMessages,
    loadMessages,
  };
}