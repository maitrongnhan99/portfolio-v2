import { NextRequest, NextResponse } from 'next/server';
import { getLangChainRAGService } from '@/services/langchain-rag-service';

interface ChatRequest {
  message: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  stream?: boolean;
}

interface ChatResponse {
  response: string;
  sources?: Array<{
    content: string;
    category: string;
    score: number;
  }>;
  error?: string;
}

interface StreamData {
  type: 'chunk' | 'sources' | 'done' | 'error';
  content?: string;
  sources?: Array<{
    content: string;
    category: string;
    score: number;
  }>;
  error?: string;
}

/**
 * LangChain-powered chat API endpoint
 * This provides an improved RAG implementation using LangChain.js
 */
export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse> | Response> {
  try {
    const body = await request.json();

    // Import validation here to avoid IDE issues
    const { chatRequestSchema, validateRequest, sanitizeString } = await import('@/lib/validation');

    // Validate request body
    const validation = validateRequest(chatRequestSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { response: '', error: validation.error },
        { status: 400 }
      );
    }

    const { message, conversationHistory = [], stream = false } = validation.data;

    // Sanitize the message
    const sanitizedMessage = sanitizeString(message);

    // Route to streaming or non-streaming handler
    if (stream) {
      return handleStreamingChat(sanitizedMessage, conversationHistory);
    } else {
      return handleNonStreamingChat(sanitizedMessage, conversationHistory);
    }

  } catch (error) {
    console.error('Error in LangChain chat API:', error);

    return NextResponse.json(
      {
        response: '',
        error: 'I apologize, but I encountered an issue processing your request. Please try again or ask a different question.'
      },
      { status: 500 }
    );
  }
}

/**
 * Handle streaming chat responses using LangChain
 */
async function handleStreamingChat(
  message: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<Response> {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        console.log(`🚀 [LangChain] Processing streaming chat message: "${message}"`);

        // Initialize LangChain RAG service
        const ragService = getLangChainRAGService();

        // Stream the response using LangChain
        const streamGenerator = ragService.queryStream(message, conversationHistory);

        for await (const chunk of streamGenerator) {
          if (chunk.type === 'chunk' && chunk.content) {
            const data: StreamData = { type: 'chunk', content: chunk.content };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          } else if (chunk.type === 'sources' && chunk.sources) {
            const data: StreamData = { type: 'sources', sources: chunk.sources };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          } else if (chunk.type === 'done') {
            const data: StreamData = { type: 'done' };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          }
        }

        console.log(`✅ [LangChain] Streaming response completed successfully`);

      } catch (error) {
        console.error('❌ [LangChain] Error in streaming chat:', error);

        const errorData: StreamData = {
          type: 'error',
          error: 'I apologize, but I encountered an issue processing your request. Please try again or ask a different question.'
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * Handle non-streaming chat responses using LangChain
 */
async function handleNonStreamingChat(
  message: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<NextResponse<ChatResponse>> {
  try {
    console.log(`🚀 [LangChain] Processing non-streaming chat message: "${message}"`);

    // Initialize LangChain RAG service
    const ragService = getLangChainRAGService();

    // Query with conversation history
    const result = await ragService.queryWithHistory(message, conversationHistory);

    console.log(`✅ [LangChain] Generated response with ${result.sources.length} sources`);

    return NextResponse.json({
      response: result.response,
      sources: result.sources
    });

  } catch (error) {
    console.error('❌ [LangChain] Error in non-streaming chat:', error);

    return NextResponse.json(
      {
        response: 'I apologize, but I encountered an issue processing your request. Please try again or ask a different question.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: 'LangChain AI Assistant Chat API is running',
    endpoints: {
      POST: 'Send a message to the LangChain-powered AI assistant'
    },
    features: [
      'Conversational memory with LangChain',
      'RAG with MongoDB Atlas Vector Search',
      'Streaming and non-streaming responses',
      'Google Gemini integration'
    ]
  });
}
