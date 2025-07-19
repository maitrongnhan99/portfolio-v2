import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import KnowledgeChunk from '@/models/KnowledgeChunk';
import SmartRetriever from '@/services/retriever';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface SystemStatus {
  status: 'healthy' | 'degraded' | 'error';
  timestamp: string;
  components: {
    database: {
      status: 'connected' | 'disconnected' | 'error';
      message?: string;
    };
    embeddings: {
      status: 'available' | 'unavailable' | 'error';
      model?: string;
      message?: string;
    };
    vectorSearch: {
      status: 'working' | 'not_configured' | 'error';
      indexName?: string;
      message?: string;
    };
    retriever: {
      status: 'working' | 'fallback' | 'error';
      lastMethod?: string;
      message?: string;
    };
  };
  statistics: {
    totalDocuments: number;
    documentsByCategory: Record<string, number>;
    hasEmbeddings: boolean;
    averageEmbeddingDimensions?: number;
  };
  recommendations: string[];
}

export async function GET(): Promise<NextResponse<SystemStatus>> {
  const status: SystemStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    components: {
      database: { status: 'disconnected' },
      embeddings: { status: 'unavailable' },
      vectorSearch: { status: 'not_configured' },
      retriever: { status: 'error' },
    },
    statistics: {
      totalDocuments: 0,
      documentsByCategory: {},
      hasEmbeddings: false,
    },
    recommendations: [],
  };

  // Check database connection
  try {
    await connectToDatabase();
    status.components.database.status = 'connected';
    
    // Get statistics
    status.statistics.totalDocuments = await KnowledgeChunk.countDocuments();
    
    if (status.statistics.totalDocuments > 0) {
      // Count by category
      const categories = ['personal', 'skills', 'experience', 'projects', 'education', 'contact'];
      for (const category of categories) {
        const count = await KnowledgeChunk.countDocuments({ 'metadata.category': category });
        if (count > 0) {
          status.statistics.documentsByCategory[category] = count;
        }
      }
      
      // Check embeddings
      const sampleWithEmbedding = await KnowledgeChunk.findOne({ 
        embedding: { $exists: true, $ne: null } 
      }).select('embedding');
      
      if (sampleWithEmbedding && sampleWithEmbedding.embedding) {
        status.statistics.hasEmbeddings = true;
        status.statistics.averageEmbeddingDimensions = sampleWithEmbedding.embedding.length;
      }
    }
  } catch (error) {
    status.components.database.status = 'error';
    status.components.database.message = error instanceof Error ? error.message : 'Unknown error';
    
    if (error instanceof Error && error.message.includes('whitelist')) {
      status.recommendations.push('Add your IP address to MongoDB Atlas whitelist');
    }
  }

  // Check embedding service
  try {
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
      
      // Test embedding generation
      const result = await model.embedContent("test");
      if (result.embedding.values.length === 768) {
        status.components.embeddings.status = 'available';
        status.components.embeddings.model = 'text-embedding-004';
      }
    } else {
      status.components.embeddings.status = 'unavailable';
      status.components.embeddings.message = 'GEMINI_API_KEY not configured';
      status.recommendations.push('Add GEMINI_API_KEY to environment variables');
    }
  } catch (error) {
    status.components.embeddings.status = 'error';
    status.components.embeddings.message = error instanceof Error ? error.message : 'Unknown error';
  }

  // Check vector search
  if (status.components.database.status === 'connected' && status.statistics.hasEmbeddings) {
    try {
      const retriever = new SmartRetriever();
      const results = await retriever.retrieve("test query", { k: 1, threshold: 0 });
      
      if (results.length > 0) {
        status.components.vectorSearch.status = 'working';
        status.components.vectorSearch.indexName = 'knowledge_vector_index';
      } else {
        status.components.vectorSearch.status = 'not_configured';
        status.components.vectorSearch.message = 'No results returned - index may not be configured';
      }
    } catch (error) {
      status.components.vectorSearch.status = 'error';
      
      if (error instanceof Error) {
        if (error.message.includes('$vectorSearch')) {
          status.components.vectorSearch.message = 'Vector search index not found';
          status.recommendations.push('Create vector search index "knowledge_vector_index" in MongoDB Atlas');
        } else if (error.message.includes('needs to be indexed')) {
          status.components.vectorSearch.message = 'Metadata fields not indexed';
          status.recommendations.push('Update vector search index to include metadata.category and metadata.priority as filters');
        } else {
          status.components.vectorSearch.message = error.message;
        }
      }
    }
  }

  // Check retriever
  if (status.components.embeddings.status === 'available') {
    try {
      const retriever = new SmartRetriever();
      const results = await retriever.retrieve("What are Mai's skills?", { k: 3 });
      
      if (results.length > 0) {
        if (status.components.vectorSearch.status === 'working') {
          status.components.retriever.status = 'working';
          status.components.retriever.lastMethod = 'vector_search';
        } else {
          status.components.retriever.status = 'fallback';
          status.components.retriever.lastMethod = 'fallback_mode';
        }
      }
    } catch (error) {
      status.components.retriever.status = 'fallback';
      status.components.retriever.message = 'Using fallback knowledge base';
    }
  }

  // Determine overall status
  const componentStatuses = Object.values(status.components);
  if (componentStatuses.every(c => c.status === 'working' || c.status === 'connected' || c.status === 'available')) {
    status.status = 'healthy';
  } else if (componentStatuses.some(c => c.status === 'error' || c.status === 'disconnected')) {
    status.status = 'degraded';
  } else {
    status.status = 'degraded';
  }

  // Add general recommendations
  if (status.statistics.totalDocuments === 0) {
    status.recommendations.push('Seed the database with knowledge chunks: npx tsx scripts/seed-knowledge-fixed.ts');
  }
  
  if (!status.statistics.hasEmbeddings && status.statistics.totalDocuments > 0) {
    status.recommendations.push('Regenerate embeddings for existing documents');
  }

  return NextResponse.json(status);
}