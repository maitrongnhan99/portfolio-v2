import { KnowledgeChunkData } from "@/lib/knowledge-data";
import connectToDatabase from "@/lib/mongodb";
import KnowledgeChunk from "@/models/KnowledgeChunk";
import { EmbeddingService } from "./embeddingService";

export interface RetrievedChunk {
  content: string;
  metadata: {
    category:
      | "personal"
      | "skills"
      | "experience"
      | "projects"
      | "education"
      | "contact";
    priority: 1 | 2 | 3;
    tags: string[];
    source: string;
    lastUpdated: Date;
  };
  score: number;
  _id?: string;
}

export interface VectorSearchOptions {
  k?: number;
  threshold?: number;
  filter?: any;
  includeEmbedding?: boolean;
}

export class MongoVectorStore {
  private embeddingService: EmbeddingService;

  constructor() {
    this.embeddingService = new EmbeddingService();
  }

  /**
   * Generate embedding for a single text
   * @param text - Text to generate embedding for
   * @returns Promise<number[]> - Embedding vector
   */
  async generateEmbedding(text: string): Promise<number[]> {
    return this.embeddingService.generateEmbedding(text);
  }

  /**
   * Add documents to the vector store with embeddings
   * @param chunks - Array of knowledge chunk data
   */
  async addDocuments(chunks: KnowledgeChunkData[]): Promise<void> {
    try {
      await connectToDatabase();

      console.log(`Processing ${chunks.length} documents for embedding...`);

      for (const chunk of chunks) {
        try {
          // Generate embedding for the content
          const embedding = await this.embeddingService.generateEmbedding(
            chunk.content
          );

          // Create knowledge chunk document
          const knowledgeChunk = new KnowledgeChunk({
            content: chunk.content,
            embedding: embedding,
            metadata: {
              category: chunk.category,
              priority: chunk.priority,
              tags: chunk.tags,
              source: chunk.source,
              lastUpdated: new Date(),
            },
          });

          // Save to database
          await knowledgeChunk.save();
          console.log(`✓ Added document: ${chunk.content.substring(0, 50)}...`);

          // Small delay to respect rate limits
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (error) {
          console.error(
            `Error processing chunk: ${chunk.content.substring(0, 50)}...`,
            error
          );
          throw error;
        }
      }

      console.log(
        `Successfully added ${chunks.length} documents to vector store`
      );
    } catch (error) {
      console.error("Error adding documents to vector store:", error);
      throw new Error(
        `Failed to add documents: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Perform vector similarity search using MongoDB Atlas Vector Search
   * @param queryEmbedding - Query embedding vector
   * @param options - Search options
   * @returns Promise<RetrievedChunk[]> - Array of similar chunks with scores
   */
  async similaritySearch(
    queryEmbedding: number[],
    options: VectorSearchOptions = {}
  ): Promise<RetrievedChunk[]> {
    try {
      await connectToDatabase();

      const { k = 3, threshold = 0.6, filter = {} } = options;

      // MongoDB Atlas Vector Search aggregation pipeline
      const pipeline: any[] = [
        {
          $vectorSearch: {
            index: "knowledge_vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: k * 10,
            limit: k,
            filter: filter,
          },
        },
        {
          $project: {
            content: 1,
            metadata: 1,
            score: { $meta: "vectorSearchScore" },
            ...(options.includeEmbedding ? { embedding: 1 } : {}),
          },
        },
        {
          $match: {
            score: { $gte: threshold },
          },
        },
      ];

      const results = await KnowledgeChunk.aggregate(pipeline);

      // Transform results to RetrievedChunk format
      const retrievedChunks: RetrievedChunk[] = results.map((result: any) => ({
        content: result.content,
        metadata: result.metadata,
        score: result.score,
        _id: result._id?.toString(),
      }));

      console.log(
        `Vector search returned ${retrievedChunks.length} results above threshold ${threshold}`
      );

      return retrievedChunks;
    } catch (error) {
      console.error("Error performing vector similarity search:", error);
      
      // Log specific error details for debugging
      if (error instanceof Error) {
        if (error.message.includes('$vectorSearch')) {
          console.error('❌ Vector search stage not recognized - Index may not exist or be properly configured');
          console.error('   Index name expected: knowledge_vector_index');
          console.error('   Make sure the index is created in MongoDB Atlas with the correct name');
        } else if (error.message.includes('pipeline')) {
          console.error('❌ Aggregation pipeline error - Check MongoDB version and Atlas tier');
        } else if (error.message.includes('embedding')) {
          console.error('❌ Embedding field error - Check if documents have embedding field');
        }
        console.error('   Full error:', error.message);
      }

      // Fallback to text search if vector search fails
      console.log("Falling back to text search...");
      return this.fallbackTextSearch(queryEmbedding, options);
    }
  }

  /**
   * Fallback text search when vector search is unavailable
   * @param queryEmbedding - Not used in text search, but kept for interface consistency
   * @param options - Search options
   * @returns Promise<RetrievedChunk[]> - Array of chunks from text search
   */
  private async fallbackTextSearch(
    queryEmbedding: number[],
    options: VectorSearchOptions = {}
  ): Promise<RetrievedChunk[]> {
    try {
      const { k = 3, filter = {} } = options;

      // Use MongoDB text search as fallback
      const results = await KnowledgeChunk.find(
        {
          $text: { $search: "general knowledge" }, // Generic search
          ...filter,
        },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" }, "metadata.priority": 1 })
        .limit(k);

      const retrievedChunks: RetrievedChunk[] = results.map((result: any) => ({
        content: result.content,
        metadata: result.metadata,
        score: 0.5, // Default score for fallback
        _id: result._id?.toString(),
      }));

      console.log(
        `Fallback text search returned ${retrievedChunks.length} results`
      );

      return retrievedChunks;
    } catch (error) {
      console.error("Error in fallback text search:", error);
      return [];
    }
  }

  /**
   * Get all documents from a specific category
   * @param category - Category to filter by
   * @param limit - Maximum number of documents to return
   * @returns Promise<RetrievedChunk[]> - Array of chunks from the category
   */
  async getByCategory(
    category:
      | "personal"
      | "skills"
      | "experience"
      | "projects"
      | "education"
      | "contact",
    limit: number = 10
  ): Promise<RetrievedChunk[]> {
    try {
      await connectToDatabase();

      const results = await KnowledgeChunk.find({
        "metadata.category": category,
      })
        .sort({ "metadata.priority": 1, createdAt: -1 })
        .limit(limit);

      const retrievedChunks: RetrievedChunk[] = results.map((result: any) => ({
        content: result.content,
        metadata: result.metadata,
        score: 1.0, // Max score for category-specific queries
        _id: result._id?.toString(),
      }));

      return retrievedChunks;
    } catch (error) {
      console.error("Error getting documents by category:", error);
      return [];
    }
  }

  /**
   * Clear all documents from the vector store
   * @returns Promise<number> - Number of documents deleted
   */
  async clearAll(): Promise<number> {
    try {
      await connectToDatabase();
      const result = await KnowledgeChunk.deleteMany({});
      console.log(`Cleared ${result.deletedCount} documents from vector store`);
      return result.deletedCount;
    } catch (error) {
      console.error("Error clearing vector store:", error);
      throw new Error(
        `Failed to clear vector store: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get total count of documents in the vector store
   * @returns Promise<number> - Total number of documents
   */
  async getDocumentCount(): Promise<number> {
    try {
      await connectToDatabase();
      const count = await KnowledgeChunk.countDocuments();
      return count;
    } catch (error) {
      console.error("Error getting document count:", error);
      return 0;
    }
  }
}

