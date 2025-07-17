import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export class EmbeddingService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!GEMINI_API_KEY) {
      throw new Error('Please define the GEMINI_API_KEY environment variable inside .env.local');
    }
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }

  /**
   * Generate embedding for a single text using Google's text-embedding-004 model
   * @param text - The text to generate embedding for
   * @returns Promise<number[]> - Array of 768 dimensions
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty');
      }

      const model = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
      
      const result = await model.embedContent(text);
      
      if (!result.embedding || !result.embedding.values) {
        throw new Error('Failed to generate embedding: No embedding values returned');
      }

      const embedding = result.embedding.values;
      
      // Validate embedding dimensions
      if (embedding.length !== 768) {
        throw new Error(`Invalid embedding dimensions: expected 768, got ${embedding.length}`);
      }

      return embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   * @param texts - Array of texts to generate embeddings for
   * @returns Promise<number[][]> - Array of embedding arrays
   */
  async batchGenerateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      if (!texts || texts.length === 0) {
        throw new Error('Texts array cannot be empty');
      }

      // Filter out empty texts
      const validTexts = texts.filter(text => text && text.trim().length > 0);
      
      if (validTexts.length === 0) {
        throw new Error('No valid texts provided');
      }

      // Process embeddings sequentially to avoid rate limiting
      const embeddings: number[][] = [];
      
      for (const text of validTexts) {
        const embedding = await this.generateEmbedding(text);
        embeddings.push(embedding);
        
        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return embeddings;
    } catch (error) {
      console.error('Error generating batch embeddings:', error);
      throw new Error(`Failed to generate batch embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate cosine similarity between two embeddings
   * @param embedding1 - First embedding vector
   * @param embedding2 - Second embedding vector
   * @returns number - Cosine similarity score between -1 and 1
   */
  static calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same dimensions');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  /**
   * Normalize embedding vector
   * @param embedding - Embedding vector to normalize
   * @returns number[] - Normalized embedding vector
   */
  static normalizeEmbedding(embedding: number[]): number[] {
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return norm === 0 ? embedding : embedding.map(val => val / norm);
  }
}

export default EmbeddingService;