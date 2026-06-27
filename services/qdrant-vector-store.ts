import { QdrantClient } from "@qdrant/js-client-rest";
import { randomUUID } from "crypto";
import { EmbeddingService } from "./embeddingService";

/**
 * Qdrant Vector Store Service
 *
 * Talks to Qdrant directly via @qdrant/js-client-rest and generates embeddings
 * with the OpenAI SDK (EmbeddingService). Payload schema is { content, metadata },
 * matching the layout previously written by LangChain's QdrantVectorStore so existing
 * collections remain readable without a re-seed.
 */

const VECTOR_SIZE = 768; // text-embedding-3-small @ 768 dims (compatible with database)
const DEFAULT_SEARCH_LIMIT = 3;
const DEBUG = process.env.QDRANT_DEBUG === "true";

function debugLog(...args: unknown[]): void {
  if (DEBUG) {
    console.log(...args);
  }
}

interface DocumentMetadata {
  category: string;
  priority: number;
  tags: string[];
  source: string;
  [key: string]: unknown;
}

interface SimilaritySearchResult {
  content: string;
  metadata: Record<string, unknown>;
  score: number;
}

interface DocumentPayload {
  content: string;
  metadata: Record<string, unknown>;
}

export class QdrantVectorStoreService {
  private embeddings: EmbeddingService;
  private qdrantClient: QdrantClient | null = null;
  private collectionName = "portfolio_knowledge";

  constructor() {
    // EmbeddingService validates OPENAI_API_KEY presence in its own constructor.
    this.embeddings = new EmbeddingService();
  }

  /**
   * Initialize the Qdrant client connection and ensure the collection exists.
   */
  async initialize(): Promise<void> {
    if (this.qdrantClient) {
      return; // Already initialized
    }

    try {
      debugLog("🔄 Initializing Qdrant vector store...");

      const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";
      const qdrantApiKey = process.env.QDRANT_API_KEY;

      debugLog(`🔗 Connecting to Qdrant at: ${qdrantUrl}`);

      this.qdrantClient = new QdrantClient({
        url: qdrantUrl,
        apiKey: qdrantApiKey,
      });

      await this.ensureCollection();

      debugLog("✅ Qdrant vector store initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing Qdrant vector store:", error);
      this.qdrantClient = null;
      throw error;
    }
  }

  private getClient(): QdrantClient {
    if (!this.qdrantClient) {
      throw new Error("Qdrant client not initialized");
    }
    return this.qdrantClient;
  }

  /**
   * Ensure the collection exists with proper configuration
   */
  private async ensureCollection(): Promise<void> {
    const client = this.getClient();

    try {
      const collections = await client.getCollections();
      const collectionExists = collections.collections?.some(
        (collection) => collection.name === this.collectionName
      );

      if (!collectionExists) {
        debugLog(`🏗️ Creating collection: ${this.collectionName}`);

        await client.createCollection(this.collectionName, {
          vectors: {
            size: VECTOR_SIZE,
            distance: "Cosine",
          },
          optimizers_config: {
            default_segment_number: 2,
          },
          replication_factor: 1,
        });

        debugLog(`✅ Collection '${this.collectionName}' created successfully`);
      } else {
        debugLog(`📍 Collection '${this.collectionName}' already exists`);
      }

      const collectionInfo = await client.getCollection(this.collectionName);
      debugLog(
        `🔍 Collection verification: ${collectionInfo.points_count || 0} points found`
      );
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
      // Qdrant REST client holds no persistent connection to close.
      this.qdrantClient = null;
      debugLog("🧹 Qdrant client connection cleaned up");
    }
  }

  /**
   * Add documents to the vector store
   * @param documents - Array of documents with content and metadata
   */
  async addDocuments(
    documents: Array<{
      content: string;
      metadata: DocumentMetadata;
    }>
  ): Promise<void> {
    try {
      await this.initialize();
      const client = this.getClient();

      if (documents.length === 0) {
        return;
      }

      const vectors = await this.embeddings.batchGenerateEmbeddings(
        documents.map((doc) => doc.content)
      );

      const lastUpdated = new Date().toISOString();
      const points = documents.map((doc, index) => ({
        id: randomUUID(),
        vector: vectors[index],
        payload: {
          content: doc.content,
          metadata: {
            ...doc.metadata,
            lastUpdated,
          },
        } satisfies DocumentPayload,
      }));

      await client.upsert(this.collectionName, {
        wait: true,
        points,
      });

      debugLog(`✅ Added ${documents.length} documents to Qdrant vector store`);
    } catch (error) {
      console.error("❌ Error adding documents to Qdrant vector store:", error);
      throw error;
    }
  }

  /**
   * Upsert documents with explicit, caller-provided point ids.
   *
   * Unlike addDocuments (which assigns a fresh random UUID per call), this lets
   * the incremental sync pass deterministic ids so re-syncing a chunk overwrites
   * the same point in place instead of creating duplicates.
   */
  async upsertDocuments(
    documents: Array<{
      id: string;
      content: string;
      metadata: Record<string, unknown>;
    }>
  ): Promise<void> {
    try {
      await this.initialize();
      const client = this.getClient();

      if (documents.length === 0) {
        return;
      }

      const vectors = await this.embeddings.batchGenerateEmbeddings(
        documents.map((doc) => doc.content)
      );

      const lastUpdated = new Date().toISOString();
      const points = documents.map((doc, index) => ({
        id: doc.id,
        vector: vectors[index],
        payload: {
          content: doc.content,
          metadata: {
            ...doc.metadata,
            lastUpdated,
          },
        } satisfies DocumentPayload,
      }));

      await client.upsert(this.collectionName, {
        wait: true,
        points,
      });

      debugLog(`✅ Upserted ${documents.length} documents to Qdrant vector store`);
    } catch (error) {
      console.error("❌ Error upserting documents to Qdrant vector store:", error);
      throw error;
    }
  }

  /**
   * List all points (optionally filtered), paginating via scroll. Returns ids
   * and payloads so the sync can diff stored content hashes. Vectors are omitted.
   */
  async listAll(
    filter?: Record<string, unknown>
  ): Promise<Array<{ id: string | number; payload: Record<string, unknown> | null }>> {
    try {
      await this.initialize();
      const client = this.getClient();

      const results: Array<{
        id: string | number;
        payload: Record<string, unknown> | null;
      }> = [];
      let offset: string | number | undefined | null = undefined;

      do {
        const page = await client.scroll(this.collectionName, {
          filter: filter as any,
          with_payload: true,
          with_vector: false,
          limit: 100,
          offset: offset ?? undefined,
        });

        for (const point of page.points) {
          results.push({
            id: point.id,
            payload: (point.payload ?? null) as Record<string, unknown> | null,
          });
        }

        offset = page.next_page_offset as string | number | null | undefined;
      } while (offset !== null && offset !== undefined);

      debugLog(`✅ Listed ${results.length} points from Qdrant vector store`);
      return results;
    } catch (error) {
      console.error("❌ Error listing points from Qdrant vector store:", error);
      throw error;
    }
  }

  /**
   * Delete points by explicit ids.
   */
  async deleteByIds(ids: Array<string | number>): Promise<void> {
    try {
      if (ids.length === 0) {
        return;
      }
      await this.initialize();
      const client = this.getClient();

      await client.delete(this.collectionName, {
        wait: true,
        points: ids,
      });

      debugLog(`🗑️ Deleted ${ids.length} points from Qdrant vector store`);
    } catch (error) {
      console.error("❌ Error deleting points from Qdrant vector store:", error);
      throw error;
    }
  }

  /**
   * Delete all points matching a payload filter. Used to refresh a single class
   * of points (e.g. project chunks) without wiping the whole collection.
   */
  async deleteByFilter(filter: Record<string, unknown>): Promise<void> {
    try {
      await this.initialize();
      const client = this.getClient();

      await client.delete(this.collectionName, {
        wait: true,
        filter: filter as any,
      });

      debugLog("🗑️ Deleted points matching filter from Qdrant vector store");
    } catch (error) {
      console.error("❌ Error deleting points by filter from Qdrant vector store:", error);
      throw error;
    }
  }

  /**
   * Perform similarity search
   * @param query - Search query
   * @param k - Number of results to return
   * @param filter - Optional Qdrant payload filter
   */
  async similaritySearch(
    query: string,
    k: number = DEFAULT_SEARCH_LIMIT,
    filter?: Record<string, any>
  ): Promise<SimilaritySearchResult[]> {
    try {
      await this.initialize();
      const client = this.getClient();

      const queryVector = await this.embeddings.generateEmbedding(query);

      const results = await client.search(this.collectionName, {
        vector: queryVector,
        limit: k,
        filter: filter as any,
        with_payload: true,
      });

      debugLog(`✅ Found ${results.length} similar documents`);

      return results.map((point) => {
        const payload = (point.payload ?? {}) as Partial<DocumentPayload>;
        return {
          content: payload.content ?? "",
          metadata: payload.metadata ?? {},
          score: point.score ?? 0,
        };
      });
    } catch (error) {
      console.error("❌ Error performing similarity search:", error);
      throw error;
    }
  }

  /**
   * Clear all documents from the vector store
   */
  async clearAll(): Promise<number> {
    try {
      await this.initialize();
      const client = this.getClient();

      const collectionInfo = await client.getCollection(this.collectionName);
      const pointCount = collectionInfo.points_count || 0;

      // Delete all points by recreating the collection's data via an empty filter match.
      await client.delete(this.collectionName, {
        wait: true,
        filter: {},
      });

      debugLog(`🗑️ Cleared ${pointCount} documents from Qdrant vector store`);
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
      const client = this.getClient();

      const collectionInfo = await client.getCollection(this.collectionName);
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
    await this.initialize();
    const client = this.getClient();

    return client.getCollection(this.collectionName);
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
