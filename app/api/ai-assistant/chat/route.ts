import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import SmartRetriever from '@/services/retriever';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize GenAI only when API key is available
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

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

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse> | Response> {
  try {
    const body = await request.json() as ChatRequest;
    const { message, conversationHistory = [], stream = false } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { response: '', error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    // Route to streaming or non-streaming handler
    if (stream) {
      return handleStreamingChat(message, conversationHistory);
    } else {
      return handleNonStreamingChat(message, conversationHistory);
    }

  } catch (error) {
    console.error('Error in chat API:', error);
    
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
 * Handle streaming chat responses using Server-Sent Events
 */
async function handleStreamingChat(
  message: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<Response> {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        console.log(`Processing streaming chat message: "${message}"`);

        // Step 1: Retrieve relevant knowledge using RAG
        const retriever = new SmartRetriever();
        const relevantChunks = await retriever.retrieve(message, {
          k: 3,
          threshold: 0.6,
          useIntent: true,
          rerankResults: true
        });

        console.log(`Retrieved ${relevantChunks.length} relevant knowledge chunks`);

        // Step 2: Build context from retrieved knowledge
        const contextParts = relevantChunks.map((chunk, index) => 
          `[${index + 1}] ${chunk.content}`
        ).join('\n\n');

        // Step 3: Create system prompt with context
        const systemPrompt = `You are Mai Trọng Nhân's AI assistant. Your role is to provide helpful and accurate information about Mai based on the knowledge provided below.

KNOWLEDGE BASE:
${contextParts}

INSTRUCTIONS:
- Answer questions about Mai's background, skills, experience, projects, and contact information
- Use only the information provided in the knowledge base above
- Be conversational and friendly, but professional
- If you don't have specific information to answer a question, suggest asking about topics you do know about
- Keep responses concise but informative
- Use markdown formatting for better readability when appropriate
- Always refer to Mai in third person (e.g., "Mai has experience in..." not "I have experience in...")

CONVERSATION CONTEXT:
${conversationHistory.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Please respond to the user's question about Mai Trọng Nhân.`;

        // Step 4: Generate streaming response using Gemini
        if (!genAI) {
          // Fallback response when API key is not available
          const fallbackResponse = generateFallbackResponse(message, relevantChunks);
          
          // Stream the fallback response word by word
          const words = fallbackResponse.split(' ');
          for (const word of words) {
            const data: StreamData = { type: 'chunk', content: word + ' ' };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for streaming effect
          }
        } else {
          try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await model.generateContentStream([
              { text: systemPrompt },
              { text: `User question: ${message}` }
            ]);

            // Stream the response chunks
            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              if (chunkText) {
                const data: StreamData = { type: 'chunk', content: chunkText };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
              }
            }
          } catch (error) {
            console.error('Error generating streaming response with Gemini:', error);
            
            // Stream fallback response on error
            const fallbackResponse = generateFallbackResponse(message, relevantChunks);
            const words = fallbackResponse.split(' ');
            for (const word of words) {
              const data: StreamData = { type: 'chunk', content: word + ' ' };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
              await new Promise(resolve => setTimeout(resolve, 50));
            }
          }
        }

        // Send sources information
        const sources = relevantChunks.map(chunk => ({
          content: chunk.content.substring(0, 200) + (chunk.content.length > 200 ? '...' : ''),
          category: chunk.metadata.category,
          score: Math.round(chunk.score * 100) / 100
        }));

        const sourcesData: StreamData = { type: 'sources', sources };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(sourcesData)}\n\n`));

        // Send completion signal
        const doneData: StreamData = { type: 'done' };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(doneData)}\n\n`));

        console.log(`Streaming response completed successfully`);

      } catch (error) {
        console.error('Error in streaming chat:', error);
        
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
 * Handle non-streaming chat responses (original implementation)
 */
async function handleNonStreamingChat(
  message: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<NextResponse<ChatResponse>> {
  console.log(`Processing non-streaming chat message: "${message}"`);

  // Step 1: Retrieve relevant knowledge using RAG
  const retriever = new SmartRetriever();
  const relevantChunks = await retriever.retrieve(message, {
    k: 3,
    threshold: 0.6,
    useIntent: true,
    rerankResults: true
  });

  console.log(`Retrieved ${relevantChunks.length} relevant knowledge chunks`);

  // Step 2: Build context from retrieved knowledge
  const contextParts = relevantChunks.map((chunk, index) => 
    `[${index + 1}] ${chunk.content}`
  ).join('\n\n');

  // Step 3: Create system prompt with context
  const systemPrompt = `You are Mai Trọng Nhân's AI assistant. Your role is to provide helpful and accurate information about Mai based on the knowledge provided below.

KNOWLEDGE BASE:
${contextParts}

INSTRUCTIONS:
- Answer questions about Mai's background, skills, experience, projects, and contact information
- Use only the information provided in the knowledge base above
- Be conversational and friendly, but professional
- If you don't have specific information to answer a question, suggest asking about topics you do know about
- Keep responses concise but informative
- Use markdown formatting for better readability when appropriate
- Always refer to Mai in third person (e.g., "Mai has experience in..." not "I have experience in...")

CONVERSATION CONTEXT:
${conversationHistory.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Please respond to the user's question about Mai Trọng Nhân.`;

  // Step 4: Generate response using Gemini
  let response: string;

  if (!genAI) {
    // Fallback response when API key is not available
    response = generateFallbackResponse(message, relevantChunks);
  } else {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent([
        { text: systemPrompt },
        { text: `User question: ${message}` }
      ]);

      response = result.response.text();
    } catch (error) {
      console.error('Error generating response with Gemini:', error);
      response = generateFallbackResponse(message, relevantChunks);
    }
  }

  // Step 5: Prepare sources for transparency
  const sources = relevantChunks.map(chunk => ({
    content: chunk.content.substring(0, 200) + (chunk.content.length > 200 ? '...' : ''),
    category: chunk.metadata.category,
    score: Math.round(chunk.score * 100) / 100
  }));

  console.log(`Generated non-streaming response successfully`);

  return NextResponse.json({
    response: response.trim(),
    sources
  });
}

/**
 * Generate a fallback response when AI service is unavailable
 */
function generateFallbackResponse(message: string, relevantChunks: any[]): string {
  const messageLower = message.toLowerCase();

  // Use retrieved knowledge to generate response
  if (relevantChunks.length > 0) {
    const topChunk = relevantChunks[0];
    
    // Simple response generation based on category
    switch (topChunk.metadata.category) {
      case 'skills':
        return `Based on Mai's technical background: ${topChunk.content}

Would you like to know more about any specific technology or skill?`;

      case 'experience':
        return `Regarding Mai's professional experience: ${topChunk.content}

Feel free to ask about specific roles or projects Mai has worked on.`;

      case 'projects':
        return `About Mai's projects: ${topChunk.content}

Would you like to learn more about the technologies used or other projects?`;

      case 'contact':
        return `For contacting Mai: ${topChunk.content}

Mai is always open to discussing new opportunities and collaborations.`;

      case 'personal':
        return `About Mai: ${topChunk.content}

Is there anything specific you'd like to know about Mai's background or interests?`;

      case 'education':
        return `Regarding Mai's education and learning: ${topChunk.content}

Mai believes in continuous learning and staying updated with the latest technologies.`;

      default:
        return topChunk.content;
    }
  }

  // Generic fallback when no relevant knowledge is found
  if (messageLower.includes('hello') || messageLower.includes('hi')) {
    return `Hello! I'm Mai Trọng Nhân's AI assistant. I can help you learn about Mai's background, skills, experience, and projects. What would you like to know?`;
  }

  return `I'd be happy to help you learn about Mai Trọng Nhân! I can provide information about:

• **Skills & Technologies** - React, Next.js, TypeScript, Node.js, and more
• **Professional Experience** - Work history and career background  
• **Projects** - Portfolio projects and notable work
• **Contact Information** - How to reach Mai for opportunities
• **Background** - Personal interests and professional journey

What would you like to know more about?`;
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ 
    message: 'AI Assistant Chat API is running',
    endpoints: {
      POST: 'Send a message to the AI assistant'
    }
  });
}