import { NextRequest, NextResponse } from "next/server";
import {
  getOpenAIRAGService,
  type ConversationMessage,
} from "@/services/langchain-rag-service";
import { chatRequestSchema, validateRequest } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "ai-assistant-chat",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateRequest(chatRequestSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const {
      message,
      conversationHistory = [],
      stream = false,
    } = validation.data;
    const ragService = getOpenAIRAGService();

    if (stream) {
      const encoder = new TextEncoder();

      const customReadable = new ReadableStream({
        async start(controller) {
          try {
            const streamGenerator = ragService.queryStream(
              message,
              conversationHistory as ConversationMessage[]
            );

            for await (const chunk of streamGenerator) {
              const data = `data: ${JSON.stringify(chunk)}\n\n`;
              controller.enqueue(encoder.encode(data));
            }

            controller.close();
          } catch (error) {
            console.error("Error in streaming response:", error);
            const errorData = {
              type: "error",
              error: error instanceof Error ? error.message : "Unknown error",
            };
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`)
            );
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
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
