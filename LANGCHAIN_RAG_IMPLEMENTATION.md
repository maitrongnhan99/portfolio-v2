# LangChain RAG Implementation with Qdrant

This document describes the LangChain.js integration with Qdrant vector database for the portfolio chatbot's RAG (Retrieval-Augmented Generation) system.

## Overview

The chatbot uses LangChain.js with Qdrant vector database to provide:

- **Superior vector search** - Purpose-built vector database for optimal performance
- **Better scalability** - Modular architecture with reusable components
- **Improved conversation memory** - Built-in conversation history management
- **Advanced retrieval** - LangChain's optimized retrieval chains with Qdrant
- **Streaming support** - Real-time response streaming
- **Production-ready** - Clean, maintainable codebase

## Architecture

### Components

1. **Qdrant Vector Store** (`services/qdrant-vector-store.ts`)
   - Integrates Qdrant vector database with LangChain's `QdrantVectorStore`
   - Uses Google Generative AI embeddings (text-embedding-004, 768 dimensions)
   - Provides document addition, similarity search, and retriever creation
   - Optimized for high-performance vector operations

2. **LangChain RAG Service** (`services/langchain-rag-service.ts`)
   - Implements conversational RAG using LangChain chains with Qdrant
   - Manages conversation history and context
   - Supports both streaming and non-streaming responses
   - Uses Google Gemini 1.5 Flash for response generation

3. **API Routes**
   - `/api/ai-assistant/chat` - Main chat endpoint (LangChain-powered)

## Installation

The required packages are already installed:

```bash
pnpm add @langchain/core @langchain/community @langchain/google-genai @langchain/qdrant @qdrant/js-client-rest langchain
```

## Configuration

### Environment Variables

```env
# Required
GEMINI_API_KEY=your_gemini_api_key

# Qdrant Configuration
QDRANT_URL=http://localhost:6333  # For local instance
QDRANT_API_KEY=your_qdrant_api_key  # Optional for local, required for cloud
```

### Qdrant Setup

1. **Local Development**: Run Qdrant locally using Docker:

   ```bash
   docker run -p 6333:6333 qdrant/qdrant
   ```

2. **Cloud Deployment**: Use Qdrant Cloud or deploy to your preferred cloud provider

3. **Collection Configuration**:
   - Collection name: `portfolio_knowledge`
   - Vector dimensions: 768 (text-embedding-004)
   - Distance metric: Cosine similarity
   - Auto-created on first use

## Usage

### Basic Query (No History)

```typescript
import { getLangChainRAGService } from '@/services/langchain-rag-service';

const ragService = getLangChainRAGService();
const result = await ragService.query("What are Mai's skills?");

console.log(result.response);
console.log(result.sources);
```

### Conversational Query (With History)

```typescript
import { getLangChainRAGService } from '@/services/langchain-rag-service';

const ragService = getLangChainRAGService();
const history = [
  { role: 'user', content: 'Tell me about Mai' },
  { role: 'assistant', content: 'Mai is a full-stack developer...' }
];

const result = await ragService.queryWithHistory(
  "What projects has he worked on?",
  history
);
```

### Streaming Responses

```typescript
import { getLangChainRAGService } from '@/services/langchain-rag-service';

const ragService = getLangChainRAGService();
const stream = ragService.queryStream("Tell me about Mai's experience", history);

for await (const chunk of stream) {
  if (chunk.type === 'chunk') {
    process.stdout.write(chunk.content);
  } else if (chunk.type === 'sources') {
    console.log('Sources:', chunk.sources);
  }
}
```

### API Request

```bash
# Non-streaming request
curl -X POST http://localhost:3000/api/ai-assistant/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are Mai'\''s skills?",
    "conversationHistory": [],
    "stream": false
  }'

# Streaming request
curl -X POST http://localhost:3000/api/ai-assistant/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about Mai'\''s projects",
    "conversationHistory": [],
    "stream": true
  }'
```

## Key Features

### 1. Conversational Memory

LangChain maintains conversation context automatically:

```typescript
const history = [
  { role: 'user', content: 'What technologies does Mai use?' },
  { role: 'assistant', content: 'Mai uses React, Node.js, TypeScript...' },
  { role: 'user', content: 'Which one is he most experienced with?' }
];

// LangChain understands "one" refers to the technologies mentioned earlier
const result = await ragService.queryWithHistory(lastQuestion, history);
```

### 2. Advanced Retrieval

LangChain's Qdrant retriever supports:

- **Similarity search** - High-performance vector-based semantic search
- **MMR (Maximum Marginal Relevance)** - Diverse result selection
- **Metadata filtering** - Advanced category-based filtering with Qdrant
- **Cosine similarity** - Optimized distance calculations

```typescript
const retriever = await vectorStore.asRetriever({
  k: 5,
  searchType: 'mmr',
  filter: { 'metadata.category': 'skills' }
});
```

### 3. Streaming Support

Real-time response generation with LangChain:

```typescript
async function* queryStream(question: string, history: ConversationMessage[]) {
  const stream = await chain.stream({ question, history });

  for await (const chunk of stream) {
    yield { type: 'chunk', content: chunk };
  }

  yield { type: 'done' };
}
```

### 4. Error Handling

Robust error handling with user-friendly messages:

```typescript
try {
  const result = await ragService.queryWithHistory(message, history);
  return NextResponse.json({ response: result.response, sources: result.sources });
} catch (error) {
  console.error('Error in chat:', error);
  return NextResponse.json({
    response: 'I apologize, but I encountered an issue...',
    error: error instanceof Error ? error.message : 'Unknown error'
  }, { status: 500 });
}
```

## Performance Considerations

### Caching

LangChain and Qdrant provide caching:

- Embeddings for similar queries (LangChain)
- Vector store connections (reused)
- Model instances (cached)
- Vector search results (Qdrant internal caching)

### Rate Limiting

Built-in rate limiting for:

- Google Gemini API calls
- Embedding generation
- Qdrant API requests

### Connection Pooling

Qdrant connection pooling is handled by:

- Qdrant client connection management
- LangChain's built-in connection reuse
- Persistent HTTP connections

## Benefits of LangChain with Qdrant

| Aspect | Benefit |
|--------|---------|
| Vector Search | High-performance vector search with `QdrantVectorStore` |
| Embeddings | Managed by `GoogleGenerativeAIEmbeddings` |
| Conversation Memory | Built-in conversation history management |
| Streaming | Native LangChain streaming chains |
| Error Handling | Robust error handling with clear messages |
| Extensibility | Modular chains for easy enhancement |
| Maintainability | Cleaner, more readable codebase |
| Performance | Purpose-built vector database optimized for speed |

### Data Format

LangChain with Qdrant uses:

- Vector embeddings: 768 dimensions (text-embedding-004)
- Qdrant collection: `portfolio_knowledge`
- Distance metric: Cosine similarity

### Metadata Structure

```typescript
{
  category: 'skills' | 'experience' | 'projects' | 'education' | 'contact' | 'personal',
  priority: 1 | 2 | 3,
  tags: string[],
  source: string,
  lastUpdated: Date
}
```

## Troubleshooting

### Issue: Vector store not initialized

**Error**: `Vector store not initialized`

**Solution**: Ensure Qdrant connection is established before using the vector store.

```typescript
const vectorStore = getQdrantVectorStore();
await vectorStore.getVectorStore(); // This initializes the connection
```

### Issue: Embedding dimension mismatch

**Error**: `Invalid embedding dimensions: expected 768, got X`

**Solution**: Ensure you're using the correct embedding model:

```typescript
const embeddings = new GoogleGenerativeAIEmbeddings({
  modelName: "text-embedding-004", // Must be this model
});
```

### Issue: Rate limiting errors

**Error**: `429 Too Many Requests`

**Solution**: Implement exponential backoff or reduce request frequency.

### Issue: Qdrant connection failed

**Error**: `Connection to Qdrant failed`

**Solution**:

1. Ensure Qdrant is running (locally or cloud)
2. Check `QDRANT_URL` environment variable
3. Verify API key if using Qdrant Cloud
4. For local development:

   ```bash
   docker run -p 6333:6333 qdrant/qdrant
   ```

## Future Enhancements

1. **Advanced Memory Management**
   - Use `ConversationSummaryMemory` for longer conversations
   - Implement semantic memory for better context retention

2. **Multi-Modal Support**
   - Add support for image embeddings
   - Enable file upload and analysis

3. **Custom Chains**
   - Create specialized chains for different query types
   - Implement agent-based routing

4. **Evaluation & Monitoring**
   - Add LangSmith integration for tracing
   - Implement custom evaluators for response quality

## Resources

- [LangChain.js Documentation](https://js.langchain.com/docs/)
- [LangChain RAG Tutorial](https://js.langchain.com/docs/tutorials/rag/)
- [LangChain Qdrant Integration](https://js.langchain.com/docs/integrations/vectorstores/qdrant/)
- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [Google Gemini API](https://ai.google.dev/docs)

## Support

For issues or questions:

1. Check the documentation above
2. Review the code comments in the implementation files
3. Open an issue on the GitHub repository
