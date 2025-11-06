import { NextRequest, NextResponse } from "next/server";
import { getLangChainRAGService, ConversationMessage } from "@/services/langchain-rag-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/ai-assistant/chat
 * Health check endpoint for connection status
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "ai-assistant-chat"
  });
}

/**
 * POST /api/ai-assistant/chat
 * Handle chat requests with RAG
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [], stream = false } = body;

    // Validate input
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Validate conversation history format
    if (!Array.isArray(conversationHistory)) {
      return NextResponse.json(
        { error: "conversationHistory must be an array" },
        { status: 400 }
      );
    }

    // Get RAG service instance
    const ragService = getLangChainRAGService();

    // Handle streaming response
    if (stream) {
      const encoder = new TextEncoder();

      const customReadable = new ReadableStream({
        async start(controller) {
          try {
            // Stream the response
            const streamGenerator = ragService.queryStream(
              message,
              conversationHistory as ConversationMessage[]
            );

            for await (const chunk of streamGenerator) {
              const data = `data: ${JSON.stringify(chunk)}\n\n`;
              controller.enqueue(encoder.encode(data));
            }

            // Send final done signal
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (error) {
            console.error("Error in streaming response:", error);
            const errorData = {
              type: "error",
              error: error instanceof Error ? error.message : "Unknown error",
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
            controller.close();
          }
        },
      });

      return new NextResponse(customReadable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Handle non-streaming response
    const response = await ragService.queryWithHistory(
      message,
      conversationHistory as ConversationMessage[]
    );

    return NextResponse.json({
      success: true,
      response: response.response,
      sources: response.sources,
    });
  } catch (error) {
    console.error("Error in chat API:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
