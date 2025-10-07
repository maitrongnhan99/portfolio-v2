import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import KnowledgeChunk from '@/models/KnowledgeChunk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  const diagnostics = {
    environment: {
      hasMongoUri: false,
      hasGeminiKey: false,
    },
    connection: {
      status: 'unknown',
      error: null as string | null,
      database: null as string | null,
    },
    data: {
      totalDocuments: 0,
      byCategory: {} as Record<string, number>,
      hasEmbeddings: false,
      sampleDocument: null as any,
    },
    vectorSearch: {
      available: false,
      error: null as string | null,
      testResults: 0,
    },
    recommendations: [] as string[],
  };

  // Check environment
  diagnostics.environment.hasMongoUri = !!process.env.MONGODB_CONNECTION_STRING;
  diagnostics.environment.hasGeminiKey = !!process.env.GEMINI_API_KEY;

  if (!diagnostics.environment.hasMongoUri) {
    diagnostics.recommendations.push('Add MONGODB_CONNECTION_STRING to .env.local');
  }
  if (!diagnostics.environment.hasGeminiKey) {
    diagnostics.recommendations.push('Add GEMINI_API_KEY to .env.local');
  }

  // Check connection
  try {
    await connectToDatabase();
    diagnostics.connection.status = 'connected';
    diagnostics.connection.database = KnowledgeChunk.db?.name || 'unknown';
  } catch (error) {
    diagnostics.connection.status = 'failed';
    diagnostics.connection.error = error instanceof Error ? error.message : 'Unknown error';
    
    if (error instanceof Error && error.message.includes('whitelist')) {
      diagnostics.recommendations.push('Add your IP address to MongoDB Atlas whitelist');
    }
    
    return NextResponse.json(diagnostics, { status: 500 });
  }

  // Check data
  try {
    diagnostics.data.totalDocuments = await KnowledgeChunk.countDocuments();
    
    if (diagnostics.data.totalDocuments === 0) {
      diagnostics.recommendations.push('Run "pnpm seed-knowledge" to populate the database');
    } else {
      // Count by category
      const categories = ['personal', 'skills', 'experience', 'projects', 'education', 'contact'];
      for (const category of categories) {
        diagnostics.data.byCategory[category] = await KnowledgeChunk.countDocuments({ 
          'metadata.category': category 
        });
      }

      // Check sample document
      const sample = await KnowledgeChunk.findOne().select('-embedding');
      if (sample) {
        diagnostics.data.sampleDocument = {
          id: sample._id,
          content: sample.content.substring(0, 100) + '...',
          category: sample.metadata.category,
          hasEmbedding: !!sample.embedding && sample.embedding.length === 768,
        };
        diagnostics.data.hasEmbeddings = !!sample.embedding && sample.embedding.length === 768;
      }
    }
  } catch (error) {
    console.error('Data check error:', error);
  }

  // Test vector search
  if (diagnostics.environment.hasGeminiKey && diagnostics.data.totalDocuments > 0) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
      
      // Generate test embedding
      const result = await model.embedContent("test query");
      const testEmbedding = result.embedding.values;

      // Try vector search
      const pipeline = [
        {
          $vectorSearch: {
            index: "knowledge_vector_index",
            path: "embedding",
            queryVector: testEmbedding,
            numCandidates: 10,
            limit: 3,
          },
        },
        {
          $project: {
            score: { $meta: "vectorSearchScore" },
          },
        },
      ];

      const results = await KnowledgeChunk.aggregate(pipeline);
      diagnostics.vectorSearch.available = true;
      diagnostics.vectorSearch.testResults = results.length;
      
      if (results.length === 0) {
        diagnostics.recommendations.push('Vector search index may not be properly configured');
      }
    } catch (error) {
      diagnostics.vectorSearch.available = false;
      diagnostics.vectorSearch.error = error instanceof Error ? error.message : 'Unknown error';
      
      if (error instanceof Error && error.message.includes('$vectorSearch')) {
        diagnostics.recommendations.push(
          'Create vector search index "knowledge_vector_index" in MongoDB Atlas'
        );
      }
    }
  }

  // Overall status
  const status = 
    diagnostics.connection.status === 'connected' &&
    diagnostics.data.totalDocuments > 0 &&
    diagnostics.vectorSearch.available
      ? 'healthy'
      : 'issues';

  return NextResponse.json({
    status,
    diagnostics,
    timestamp: new Date().toISOString(),
  });
}