import { EmbeddingService } from './embeddingService';
import { MongoVectorStore, RetrievedChunk, VectorSearchOptions } from './vectorStore';

export interface QueryIntent {
  category: string | null;
  keywords: string[];
  priority: 'high' | 'medium' | 'low';
  confidence: number;
}

export interface RetrievalOptions {
  k?: number;
  threshold?: number;
  useIntent?: boolean;
  rerankResults?: boolean;
}

export class SmartRetriever {
  private vectorStore: MongoVectorStore;
  private embeddingService: EmbeddingService;

  constructor() {
    this.vectorStore = new MongoVectorStore();
    this.embeddingService = new EmbeddingService();
  }

  /**
   * Main retrieval method that combines query analysis, vector search, and reranking
   * @param query - User query string
   * @param options - Retrieval options
   * @returns Promise<RetrievedChunk[]> - Array of relevant chunks
   */
  async retrieve(query: string, options: RetrievalOptions = {}): Promise<RetrievedChunk[]> {
    try {
      const { k = 3, threshold = 0.65, useIntent = true, rerankResults = true } = options;

      console.log(`Retrieving knowledge for query: "${query}"`);

      // Step 1: Analyze query intent
      const intent = useIntent ? this.detectQueryIntent(query) : null;
      console.log('Query intent:', intent);

      // Step 2: Generate query embedding
      const queryEmbedding = await this.embeddingService.generateEmbedding(query);

      // Step 3: Prepare search options
      const searchOptions: VectorSearchOptions = {
        k: k * 2, // Get more results for better reranking
        threshold: threshold * 0.8, // Lower threshold for more candidates
      };

      // Add category filter if intent is detected
      if (intent && intent.category && intent.confidence > 0.6) {
        searchOptions.filter = { "metadata.category": intent.category };
        console.log(`Filtering by category: ${intent.category}`);
      }

      // Step 4: Perform vector search
      let chunks = await this.vectorStore.similaritySearch(queryEmbedding, searchOptions);

      // Step 5: Fallback to category-based search if no results
      if (chunks.length === 0 && intent?.category) {
        console.log('No vector results, falling back to category search');
        chunks = await this.vectorStore.getByCategory(
          intent.category as any,
          k
        );
      }

      // Step 6: Rerank results if enabled
      if (rerankResults && chunks.length > 0) {
        chunks = this.rerank(chunks, query, intent);
      }

      // Step 7: Limit to requested number of results
      const finalResults = chunks.slice(0, k);

      console.log(`Retrieved ${finalResults.length} chunks for query`);
      return finalResults;

    } catch (error) {
      console.error('Error in retrieval:', error);
      throw new Error(`Retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Detect query intent and categorize the query
   * @param query - User query string
   * @returns QueryIntent - Detected intent information
   */
  private detectQueryIntent(query: string): QueryIntent {
    const queryLower = query.toLowerCase();
    
    // Define category keywords with weights
    const categoryKeywords = {
      'skills': {
        keywords: ['skill', 'technology', 'tech stack', 'framework', 'programming', 'language', 'tool', 'development', 'coding', 'frontend', 'backend', 'database'],
        weight: 1.0
      },
      'experience': {
        keywords: ['experience', 'work', 'job', 'career', 'position', 'role', 'employment', 'professional', 'background', 'history'],
        weight: 1.0
      },
      'projects': {
        keywords: ['project', 'built', 'created', 'developed', 'portfolio', 'app', 'application', 'website', 'build', 'made'],
        weight: 1.0
      },
      'education': {
        keywords: ['education', 'degree', 'university', 'study', 'learn', 'course', 'training', 'school', 'academic'],
        weight: 0.8
      },
      'contact': {
        keywords: ['contact', 'reach', 'email', 'phone', 'hire', 'available', 'linkedin', 'github', 'social'],
        weight: 1.0
      },
      'personal': {
        keywords: ['who', 'about', 'name', 'bio', 'introduction', 'personal', 'background', 'interests', 'passion'],
        weight: 0.9
      }
    };

    let bestMatch: { category: string; score: number; keywords: string[] } = {
      category: '',
      score: 0,
      keywords: []
    };

    // Calculate scores for each category
    for (const [category, data] of Object.entries(categoryKeywords)) {
      let score = 0;
      const matchedKeywords: string[] = [];

      for (const keyword of data.keywords) {
        if (queryLower.includes(keyword)) {
          score += data.weight;
          matchedKeywords.push(keyword);
        }
      }

      // Boost score for exact matches
      if (queryLower === category || queryLower.includes(`about ${category}`)) {
        score += 2.0;
      }

      if (score > bestMatch.score) {
        bestMatch = { category, score, keywords: matchedKeywords };
      }
    }

    // Determine priority based on query urgency indicators
    let priority: 'high' | 'medium' | 'low' = 'medium';
    
    if (queryLower.includes('urgent') || queryLower.includes('asap') || queryLower.includes('immediately')) {
      priority = 'high';
    } else if (queryLower.includes('when') || queryLower.includes('how') || queryLower.includes('what')) {
      priority = 'high';
    } else if (queryLower.includes('maybe') || queryLower.includes('perhaps') || queryLower.includes('might')) {
      priority = 'low';
    }

    // Calculate confidence based on score and query length
    const confidence = Math.min(bestMatch.score / 2.0, 1.0);
    
    return {
      category: bestMatch.score > 0.5 ? bestMatch.category : null,
      keywords: bestMatch.keywords,
      priority,
      confidence
    };
  }

  /**
   * Rerank retrieved chunks based on relevance and priority
   * @param chunks - Retrieved chunks from vector search
   * @param query - Original query
   * @param intent - Detected query intent
   * @returns RetrievedChunk[] - Reranked chunks
   */
  private rerank(chunks: RetrievedChunk[], query: string, intent: QueryIntent | null): RetrievedChunk[] {
    const queryLower = query.toLowerCase();

    return chunks.map(chunk => {
      let finalScore = chunk.score;

      // Priority boost: Higher priority content gets higher scores
      const priorityBoost = 0.1 * (4 - chunk.metadata.priority);
      finalScore += priorityBoost;

      // Category match boost
      if (intent?.category && chunk.metadata.category === intent.category) {
        finalScore += 0.15;
      }

      // Keyword match boost
      if (intent?.keywords) {
        const contentLower = chunk.content.toLowerCase();
        const keywordMatches = intent.keywords.filter(keyword => 
          contentLower.includes(keyword)
        ).length;
        
        if (keywordMatches > 0) {
          finalScore += 0.1 * keywordMatches;
        }
      }

      // Direct query term matches
      const queryTerms = queryLower.split(/\s+/).filter(term => term.length > 2);
      const contentLower = chunk.content.toLowerCase();
      const termMatches = queryTerms.filter(term => contentLower.includes(term)).length;
      
      if (termMatches > 0) {
        finalScore += 0.05 * termMatches;
      }

      // Tag relevance boost
      if (chunk.metadata.tags && chunk.metadata.tags.length > 0) {
        const tagMatches = chunk.metadata.tags.filter(tag => 
          queryLower.includes(tag.toLowerCase())
        ).length;
        
        if (tagMatches > 0) {
          finalScore += 0.08 * tagMatches;
        }
      }

      // Recency boost for certain categories
      if (['projects', 'experience'].includes(chunk.metadata.category)) {
        const daysSinceUpdate = Math.floor(
          (Date.now() - new Date(chunk.metadata.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceUpdate < 30) {
          finalScore += 0.05;
        }
      }

      return {
        ...chunk,
        score: Math.min(finalScore, 1.0) // Cap at 1.0
      };
    }).sort((a, b) => b.score - a.score);
  }

  /**
   * Get relevant context for a specific category
   * @param category - Category to retrieve context for
   * @param limit - Maximum number of chunks to return
   * @returns Promise<RetrievedChunk[]> - Relevant chunks for the category
   */
  async getContextByCategory(
    category: 'personal' | 'skills' | 'experience' | 'projects' | 'education' | 'contact',
    limit: number = 5
  ): Promise<RetrievedChunk[]> {
    try {
      const chunks = await this.vectorStore.getByCategory(category, limit);
      return chunks.sort((a, b) => a.metadata.priority - b.metadata.priority);
    } catch (error) {
      console.error(`Error getting context for category ${category}:`, error);
      return [];
    }
  }

  /**
   * Hybrid search combining vector similarity and keyword matching
   * @param query - User query
   * @param options - Search options
   * @returns Promise<RetrievedChunk[]> - Combined search results
   */
  async hybridSearch(query: string, options: RetrievalOptions = {}): Promise<RetrievedChunk[]> {
    try {
      const { k = 3 } = options;

      // Get vector search results
      const vectorResults = await this.retrieve(query, { ...options, k: Math.ceil(k * 0.7) });

      // Get category-based results
      const intent = this.detectQueryIntent(query);
      const categoryResults = intent?.category 
        ? await this.getContextByCategory(intent.category as any, Math.ceil(k * 0.3))
        : [];

      // Combine and deduplicate results
      const combined = [...vectorResults];
      const existingIds = new Set(vectorResults.map(chunk => chunk._id).filter(Boolean));

      for (const chunk of categoryResults) {
        if (!existingIds.has(chunk._id)) {
          combined.push(chunk);
        }
      }

      // Sort by score and limit results
      return combined
        .sort((a, b) => b.score - a.score)
        .slice(0, k);

    } catch (error) {
      console.error('Error in hybrid search:', error);
      return this.retrieve(query, options); // Fallback to regular retrieval
    }
  }
}

