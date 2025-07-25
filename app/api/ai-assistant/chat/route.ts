import SmartRetriever from '@/services/retriever';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

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
        let relevantChunks: any[] = [];
        let usingFallback = false;
        let retrievalMethod = 'vector_search';
        
        try {
          const retriever = new SmartRetriever();
          relevantChunks = await retriever.retrieve(message, {
            k: 3,
            threshold: 0.6,
            useIntent: true,
            rerankResults: true
          });
          
          if (relevantChunks.length > 0) {
            console.log(`✅ Retrieved ${relevantChunks.length} relevant knowledge chunks from vector database`);
            console.log(`   Categories: ${[...new Set(relevantChunks.map(c => c.metadata.category))].join(', ')}`);
            console.log(`   Average score: ${(relevantChunks.reduce((sum, c) => sum + c.score, 0) / relevantChunks.length).toFixed(3)}`);
          } else {
            console.log('⚠️  Vector search returned no results, falling back to knowledge base');
            usingFallback = true;
            retrievalMethod = 'fallback_empty_results';
            relevantChunks = getFallbackKnowledge(message);
          }
        } catch (error) {
          console.error('❌ RAG retrieval failed, using fallback knowledge:', error);
          usingFallback = true;
          
          // Log specific error type for debugging
          if (error instanceof Error) {
            if (error.message.includes('whitelist')) {
              console.error('🔒 MongoDB IP whitelisting issue detected');
              retrievalMethod = 'fallback_ip_whitelist';
            } else if (error.message.includes('$vectorSearch')) {
              console.error('🔍 Vector search index not available');
              retrievalMethod = 'fallback_no_index';
            } else if (error.message.includes('ECONNREFUSED')) {
              console.error('🔌 MongoDB connection refused');
              retrievalMethod = 'fallback_connection_refused';
            } else if (error.message.includes('needs to be indexed')) {
              console.error('📑 Metadata fields need to be indexed');
              retrievalMethod = 'fallback_metadata_not_indexed';
            } else {
              retrievalMethod = 'fallback_unknown_error';
            }
          }
          
          // Fallback to hardcoded knowledge when database is unavailable
          relevantChunks = getFallbackKnowledge(message);
          console.log(`⚠️  Using fallback knowledge (${relevantChunks.length} chunks) - Method: ${retrievalMethod}`);
        }

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
  let relevantChunks: any[] = [];
  let usingFallback = false;
  let retrievalMethod = 'vector_search';
  
  try {
    const retriever = new SmartRetriever();
    relevantChunks = await retriever.retrieve(message, {
      k: 3,
      threshold: 0.6,
      useIntent: true,
      rerankResults: true
    });
    
    if (relevantChunks.length > 0) {
      console.log(`✅ Retrieved ${relevantChunks.length} relevant knowledge chunks from vector database`);
      console.log(`   Categories: ${[...new Set(relevantChunks.map(c => c.metadata.category))].join(', ')}`);
      console.log(`   Average score: ${(relevantChunks.reduce((sum, c) => sum + c.score, 0) / relevantChunks.length).toFixed(3)}`);
    } else {
      console.log('⚠️  Vector search returned no results, falling back to knowledge base');
      usingFallback = true;
      retrievalMethod = 'fallback_empty_results';
      relevantChunks = getFallbackKnowledge(message);
    }
  } catch (error) {
    console.error('❌ RAG retrieval failed, using fallback knowledge:', error);
    usingFallback = true;
    
    // Log specific error type for debugging
    if (error instanceof Error) {
      if (error.message.includes('whitelist')) {
        console.error('🔒 MongoDB IP whitelisting issue detected');
        retrievalMethod = 'fallback_ip_whitelist';
      } else if (error.message.includes('$vectorSearch')) {
        console.error('🔍 Vector search index not available');
        retrievalMethod = 'fallback_no_index';
      } else if (error.message.includes('ECONNREFUSED')) {
        console.error('🔌 MongoDB connection refused');
        retrievalMethod = 'fallback_connection_refused';
      } else if (error.message.includes('needs to be indexed')) {
        console.error('📑 Metadata fields need to be indexed');
        retrievalMethod = 'fallback_metadata_not_indexed';
      } else {
        retrievalMethod = 'fallback_unknown_error';
      }
    }
    
    // Fallback to hardcoded knowledge when database is unavailable
    relevantChunks = getFallbackKnowledge(message);
    console.log(`⚠️  Using fallback knowledge (${relevantChunks.length} chunks) - Method: ${retrievalMethod}`);
  }

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
 * Get fallback knowledge when database is unavailable
 */
function getFallbackKnowledge(message: string): any[] {
  const messageLower = message.toLowerCase();
  
  const fallbackData = [
    // Personal/Introduction
    {
      content: "Mai Trọng Nhân is a Full Stack Developer based in Vietnam, specializing in building exceptional digital experiences. Focused on creating accessible, human-centered products that solve real-world problems.",
      metadata: { category: 'personal', priority: 1, tags: ['introduction', 'developer', 'vietnam'] },
      score: 0.9
    },
    // Skills - Frontend
    {
      content: "Mai has extensive frontend development expertise including React, Next.js, TypeScript, Tailwind CSS, and modern CSS frameworks. Experienced in building responsive, performant user interfaces with attention to UX/UI design principles.",
      metadata: { category: 'skills', priority: 1, tags: ['react', 'nextjs', 'typescript', 'frontend'] },
      score: 0.9
    },
    // Skills - Backend
    {
      content: "Mai has strong backend development skills with Node.js, NestJS, Express, and Python. Experienced in building RESTful APIs, GraphQL services, microservices architecture, and real-time applications with WebSockets.",
      metadata: { category: 'skills', priority: 1, tags: ['nodejs', 'backend', 'api', 'microservices'] },
      score: 0.9
    },
    // Skills - Full Stack
    {
      content: "Skills include: Frontend (React, Next.js, TypeScript, Tailwind CSS), Backend (Node.js, Express, NestJS), Databases (MongoDB, PostgreSQL), DevOps (Docker, AWS, CI/CD), and AI/ML integration with tools like LangChain and RAG systems.",
      metadata: { category: 'skills', priority: 1, tags: ['frontend', 'backend', 'fullstack', 'devops'] },
      score: 0.9
    },
    // Experience
    {
      content: "Mai currently works as a FullStack Developer (2023 - Present), building scalable web applications and leading development of key features. Previously worked as a Frontend Developer (2022 - 2023), specializing in React and modern web technologies.",
      metadata: { category: 'experience', priority: 1, tags: ['professional', 'fullstack', 'current'] },
      score: 0.8
    },
    // Projects - Portfolio
    {
      content: "Mai built a modern portfolio website using Next.js 15, React 19, TypeScript, and Tailwind CSS. Features include dark/light theme switching, animated UI elements with Framer Motion, contact form with Telegram integration, and an AI assistant powered by RAG.",
      metadata: { category: 'projects', priority: 1, tags: ['portfolio', 'nextjs', 'ai'] },
      score: 0.8
    },
    // Projects - AI
    {
      content: "Mai developed an AI Assistant feature with RAG (Retrieval-Augmented Generation) system using Google Gemini API, MongoDB Atlas Vector Search, and semantic embeddings. The system provides intelligent responses about Mai's background and expertise.",
      metadata: { category: 'projects', priority: 1, tags: ['ai', 'rag', 'gemini', 'mongodb'] },
      score: 0.8
    },
    // Contact
    {
      content: "Mai can be reached through the portfolio website at maitrongnhan.dev, GitHub at github.com/maitrongnhan99, email at maitrongnhan.work@gmail.com, or LinkedIn. Always interested in discussing exciting opportunities and collaborations.",
      metadata: { category: 'contact', priority: 1, tags: ['email', 'linkedin', 'github', 'website'] },
      score: 0.9
    },
    // Education/Learning
    {
      content: "Mai is primarily self-taught and has built expertise through hands-on projects, online courses, and continuous learning. Actively follows modern web development trends, best practices, and contributes to open-source projects.",
      metadata: { category: 'education', priority: 2, tags: ['self-taught', 'learning', 'opensource'] },
      score: 0.7
    }
  ];
  
  // Enhanced keyword matching with scoring
  const scores = new Map<any, number>();
  
  fallbackData.forEach(chunk => {
    let score = 0;
    const content = chunk.content.toLowerCase();
    const tags = chunk.metadata.tags.join(' ').toLowerCase();
    
    // Direct category match
    if (messageLower.includes(chunk.metadata.category)) {
      score += 3;
    }
    
    // Content relevance
    const words = messageLower.split(/\s+/);
    words.forEach(word => {
      if (word.length > 2) {
        if (content.includes(word)) score += 2;
        if (tags.includes(word)) score += 1;
      }
    });
    
    // Specific keyword boosts
    if (messageLower.includes('skill') && chunk.metadata.category === 'skills') score += 2;
    if (messageLower.includes('experience') && chunk.metadata.category === 'experience') score += 2;
    if (messageLower.includes('project') && chunk.metadata.category === 'projects') score += 2;
    if (messageLower.includes('contact') && chunk.metadata.category === 'contact') score += 2;
    if ((messageLower.includes('who') || messageLower.includes('about')) && chunk.metadata.category === 'personal') score += 2;
    
    scores.set(chunk, score);
  });
  
  // Sort by score and return top results
  const sorted = fallbackData.sort((a, b) => (scores.get(b) || 0) - (scores.get(a) || 0));
  const topChunks = sorted.slice(0, 3);
  
  // If no good matches, return diverse set
  if (topChunks.every(chunk => (scores.get(chunk) || 0) === 0)) {
    return [
      fallbackData.find(c => c.metadata.category === 'personal'),
      fallbackData.find(c => c.metadata.category === 'skills'),
      fallbackData.find(c => c.metadata.category === 'contact')
    ].filter(Boolean);
  }
  
  return topChunks;
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