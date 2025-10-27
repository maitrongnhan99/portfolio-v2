import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import connectToDatabase from "@/lib/mongodb";
import KnowledgeChunk from "@/models/KnowledgeChunk";
import { Collection } from "mongodb";

/**
 * LangChain MongoDB Atlas Vector Store
 * Provides integration between LangChain and MongoDB Atlas Vector Search
 */
export class LangChainVectorStore {
  private embeddings: GoogleGenerativeAIEmbeddings;
  private vectorStore: MongoDBAtlasVectorSearch | null = null;
  private collection: Collection | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }

    // Initialize Google Generative AI embeddings
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: apiKey,
      model: "text-embedding-004",
    });
  }

  /**
   * Initialize the vector store connection
   */
  private async initialize(): Promise<void> {
    if (this.vectorStore && this.collection) {
      return; // Already initialized
    }

    try {
      const mongoose = await connectToDatabase();

      // Get the native MongoDB collection
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error("MongoDB database connection not available");
      }

      this.collection = db.collection("knowledgechunks") as any;

      // Initialize LangChain MongoDB Atlas Vector Search
      this.vectorStore = new MongoDBAtlasVectorSearch(this.embeddings, {
        collection: this.collection as any,
        indexName: "knowledge_vector_index",
        textKey: "content",
        embeddingKey: "embedding",
      });

      console.log("✅ LangChain vector store initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing LangChain vector store:", error);
      throw error;
    }
  }

  /**
   * Get the initialized vector store
   */
  async getVectorStore(): Promise<MongoDBAtlasVectorSearch> {
    await this.initialize();
    if (!this.vectorStore) {
      throw new Error("Vector store not initialized");
    }
    return this.vectorStore;
  }

  /**
   * Get the embeddings instance
   */
  getEmbeddings(): GoogleGenerativeAIEmbeddings {
    return this.embeddings;
  }

  /**
   * Add documents to the vector store
   * @param documents - Array of documents with content and metadata
   */
  async addDocuments(
    documents: Array<{
      content: string;
      metadata: {
        category: string;
        priority: number;
        tags: string[];
        source: string;
      };
    }>
  ): Promise<void> {
    try {
      await this.initialize();

      if (!this.vectorStore) {
        throw new Error("Vector store not initialized");
      }

      // Convert to LangChain Document format
      const langchainDocs = documents.map((doc) => ({
        pageContent: doc.content,
        metadata: {
          ...doc.metadata,
          lastUpdated: new Date(),
        },
      }));

      // Add documents using LangChain's method
      await this.vectorStore.addDocuments(langchainDocs);

      console.log(`✅ Added ${documents.length} documents to LangChain vector store`);
    } catch (error) {
      console.error("❌ Error adding documents to LangChain vector store:", error);
      throw error;
    }
  }

  /**
   * Perform similarity search
   * @param query - Search query
   * @param k - Number of results to return
   * @param filter - Optional metadata filter
   */
  async similaritySearch(
    query: string,
    k: number = 3,
    filter?: Record<string, any>
  ) {
    try {
      await this.initialize();

      if (!this.vectorStore) {
        throw new Error("Vector store not initialized");
      }

      // Perform similarity search with optional filter
      const results = await this.vectorStore.similaritySearchWithScore(
        query,
        k,
        filter
      );

      console.log(`✅ Found ${results.length} similar documents`);

      // Transform results to match existing interface
      return results.map(([doc, score]) => ({
        content: doc.pageContent,
        metadata: doc.metadata as any,
        score: score,
      }));
    } catch (error) {
      console.error("❌ Error performing similarity search:", error);
      throw error;
    }
  }

  /**
   * Create a retriever for use in LangChain chains
   * @param options - Retriever options
   */
  async asRetriever(options?: {
    k?: number;
    filter?: Record<string, any>;
    searchType?: "similarity" | "mmr";
    searchKwargs?: Record<string, any>;
  }) {
    await this.initialize();

    if (!this.vectorStore) {
      throw new Error("Vector store not initialized");
    }

    return this.vectorStore.asRetriever({
      k: options?.k ?? 3,
      filter: options?.filter,
      searchType: options?.searchType ?? "similarity",
      ...options?.searchKwargs,
    });
  }

  /**
   * Clear all documents from the vector store
   */
  async clearAll(): Promise<number> {
    try {
      await connectToDatabase();
      const result = await KnowledgeChunk.deleteMany({});
      console.log(`🗑️ Cleared ${result.deletedCount} documents from vector store`);
      return result.deletedCount;
    } catch (error) {
      console.error("❌ Error clearing vector store:", error);
      throw error;
    }
  }

  /**
   * Get document count
   */
  async getDocumentCount(): Promise<number> {
    try {
      await connectToDatabase();
      const count = await KnowledgeChunk.countDocuments();
      return count;
    } catch (error) {
      console.error("❌ Error getting document count:", error);
      return 0;
    }
  }
}

// Export a singleton instance
let vectorStoreInstance: LangChainVectorStore | null = null;

export function getLangChainVectorStore(): LangChainVectorStore {
  if (!vectorStoreInstance) {
    vectorStoreInstance = new LangChainVectorStore();
  }
  return vectorStoreInstance;
}
