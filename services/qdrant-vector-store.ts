import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantClient } from "@qdrant/js-client-rest";

/**
 * Qdrant Vector Store Service
 * Provides integration between LangChain and Qdrant for vector search
 */
export class QdrantVectorStoreService {
  private embeddings: OpenAIEmbeddings;
  private vectorStore: QdrantVectorStore | null = null;
  private qdrantClient: QdrantClient | null = null;
  private collectionName = "portfolio_knowledge";

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }

    // Initialize OpenAI embeddings with 768 dimensions to match Qdrant collection
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: apiKey,
      modelName: "text-embedding-3-small",
      dimensions: 768,
    });
  }

  /**
   * Initialize the Qdrant vector store connection
   */
  private async initialize(): Promise<void> {
    if (this.vectorStore && this.qdrantClient) {
      return; // Already initialized
    }

    try {
      console.log("🔄 Initializing Qdrant vector store...");
      
      // Get Qdrant configuration from environment
      const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";
      const qdrantApiKey = process.env.QDRANT_API_KEY;
      
      console.log(`🔗 Connecting to Qdrant at: ${qdrantUrl}`);

      // Create Qdrant client
      this.qdrantClient = new QdrantClient({
        url: qdrantUrl,
        apiKey: qdrantApiKey,
      });

      console.log("✅ Qdrant client connected");

      // Check if collection exists, create if not
      await this.ensureCollection();

      // Initialize LangChain Qdrant Vector Store
      this.vectorStore = await QdrantVectorStore.fromExistingCollection(
        this.embeddings,
        {
          client: this.qdrantClient,
          collectionName: this.collectionName,
        }
      );

      console.log("✅ Qdrant vector store initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing Qdrant vector store:", error);
      // Clean up on error
      if (this.qdrantClient) {
        this.qdrantClient = null;
      }
      throw error;
    }
  }

  /**
   * Ensure the collection exists with proper configuration
   */
  private async ensureCollection(): Promise<void> {
    if (!this.qdrantClient) {
      throw new Error("Qdrant client not initialized");
    }

    try {
      // Check if collection exists
      const collections = await this.qdrantClient.getCollections();
      const collectionExists = collections.collections?.some(
        collection => collection.name === this.collectionName
      );

      if (!collectionExists) {
        console.log(`🏗️ Creating collection: ${this.collectionName}`);
        
        // Create collection with proper vector configuration
        await this.qdrantClient.createCollection(this.collectionName, {
          vectors: {
            size: 768, // text-embedding-3-small with 768 dimensions
            distance: "Cosine",
          },
          optimizers_config: {
            default_segment_number: 2,
          },
          replication_factor: 1,
        });

        console.log(`✅ Collection '${this.collectionName}' created successfully`);
      } else {
        console.log(`📍 Collection '${this.collectionName}' already exists`);
      }

      // Verify the collection by getting its info
      const collectionInfo = await this.qdrantClient.getCollection(this.collectionName);
      console.log(`🔍 Collection verification: ${collectionInfo.points_count || 0} points found`);
    } catch (error) {
      console.error("❌ Error ensuring collection:", error);
      throw error;
    }
  }

  /**
   * Clean up Qdrant client connection
   */
  async cleanup(): Promise<void> {
    if (this.qdrantClient) {
      try {
        // Qdrant client doesn't need explicit cleanup
        console.log("🧹 Qdrant client connection cleaned up");
      } catch (error) {
        console.error("Error cleaning up Qdrant client:", error);
      } finally {
        this.qdrantClient = null;
        this.vectorStore = null;
      }
    }
  }

  /**
   * Get the initialized vector store
   */
  async getVectorStore(): Promise<QdrantVectorStore> {
    await this.initialize();
    if (!this.vectorStore) {
      throw new Error("Vector store not initialized");
    }
    return this.vectorStore;
  }

  /**
   * Get the embeddings instance
   */
  getEmbeddings(): OpenAIEmbeddings {
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
          lastUpdated: new Date().toISOString(),
        },
      }));

      // Add documents using LangChain's method
      await this.vectorStore.addDocuments(langchainDocs);

      console.log(`✅ Added ${documents.length} documents to Qdrant vector store`);
    } catch (error) {
      console.error("❌ Error adding documents to Qdrant vector store:", error);
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
      await this.initialize();

      if (!this.qdrantClient) {
        throw new Error("Qdrant client not initialized");
      }

      // Get current point count
      const collectionInfo = await this.qdrantClient.getCollection(this.collectionName);
      const pointCount = collectionInfo.points_count || 0;

      // Delete all points in the collection
      await this.qdrantClient.delete(this.collectionName, {
        filter: {},
      });

      console.log(`🗑️ Cleared ${pointCount} documents from Qdrant vector store`);
      return pointCount;
    } catch (error) {
      console.error("❌ Error clearing Qdrant vector store:", error);
      throw error;
    }
  }

  /**
   * Get document count
   */
  async getDocumentCount(): Promise<number> {
    try {
      await this.initialize();

      if (!this.qdrantClient) {
        throw new Error("Qdrant client not initialized");
      }

      const collectionInfo = await this.qdrantClient.getCollection(this.collectionName);
      return collectionInfo.points_count || 0;
    } catch (error) {
      console.error("❌ Error getting document count:", error);
      return 0;
    }
  }

  /**
   * Get collection info for debugging
   */
  async getCollectionInfo() {
    try {
      await this.initialize();

      if (!this.qdrantClient) {
        throw new Error("Qdrant client not initialized");
      }

      return await this.qdrantClient.getCollection(this.collectionName);
    } catch (error) {
      console.error("❌ Error getting collection info:", error);
      throw error;
    }
  }
}

// Export a singleton instance
let vectorStoreInstance: QdrantVectorStoreService | null = null;

export function getQdrantVectorStore(): QdrantVectorStoreService {
  if (!vectorStoreInstance) {
    vectorStoreInstance = new QdrantVectorStoreService();
  }
  return vectorStoreInstance;
}