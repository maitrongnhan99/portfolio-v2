# LangChain RAG Implementation

This document describes the LangChain.js integration for the portfolio chatbot's RAG (Retrieval-Augmented Generation) system.

## Overview

The chatbot has been enhanced with LangChain.js to provide:
- **Better scalability** - Modular architecture with reusable components
- **Improved conversation memory** - Built-in conversation history management
- **Advanced retrieval** - LangChain's optimized retrieval chains
- **Streaming support** - Real-time response streaming
- **Fallback mechanism** - Automatic fallback to original implementation

## Architecture

### Components

1. **LangChain Vector Store** (`services/langchain-vector-store.ts`)
   - Wraps MongoDB Atlas Vector Search with LangChain's `MongoDBAtlasVectorSearch`
   - Uses Google Generative AI embeddings (text-embedding-004)
   - Provides document addition, similarity search, and retriever creation

2. **LangChain RAG Service** (`services/langchain-rag-service.ts`)
   - Implements conversational RAG using LangChain chains
   - Manages conversation history and context
   - Supports both streaming and non-streaming responses
   - Uses Google Gemini 1.5 Flash for response generation

3. **API Routes**
   - `/api/ai-assistant/chat` - Main chat endpoint (uses LangChain by default)
   - `/api/ai-assistant/chat-langchain` - Dedicated LangChain endpoint

## Installation

The required packages are already installed:

```bash
pnpm add @langchain/core @langchain/community @langchain/google-genai @langchain/mongodb langchain
```

## Configuration

### Environment Variables

```env
# Required
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_atlas_uri

# Optional
USE_LANGCHAIN=true  # Enable/disable LangChain (default: true)
```

### MongoDB Atlas Setup

1. Create a MongoDB Atlas Vector Search index named `knowledge_vector_index`
2. Configure the index with:
   - Vector field: `embedding`
   - Dimensions: 768
   - Similarity: cosine

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
# Using LangChain (default)
curl -X POST http://localhost:3000/api/ai-assistant/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are Mai'\''s skills?",
    "conversationHistory": [],
    "stream": false
  }'

# Disable LangChain for a specific request
curl -X POST http://localhost:3000/api/ai-assistant/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are Mai'\''s skills?",
    "conversationHistory": [],
    "stream": false,
    "useLangChain": false
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

LangChain's retriever supports:
- **Similarity search** - Vector-based semantic search
- **MMR (Maximum Marginal Relevance)** - Diverse result selection
- **Metadata filtering** - Category-based filtering

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

### 4. Fallback Mechanism

Automatic fallback to original implementation on errors:

```typescript
try {
  // Try LangChain
  return await handleLangChainNonStreamingChat(message, history);
} catch (error) {
  // Fallback to original
  console.log('⚠️  Falling back to original RAG implementation');
  return await handleNonStreamingChat(message, history);
}
```

## Performance Considerations

### Caching

LangChain automatically caches:
- Embeddings for similar queries
- Vector store connections
- Model instances

### Rate Limiting

Built-in rate limiting for:
- Google Gemini API calls
- Embedding generation
- MongoDB queries

### Connection Pooling

MongoDB connection pooling is handled by:
- Mongoose connection management
- LangChain's built-in connection reuse

## Comparison: Original vs LangChain

| Feature | Original | LangChain |
|---------|----------|-----------|
| Vector Search | Custom MongoDB aggregation | `MongoDBAtlasVectorSearch` |
| Embeddings | Direct Gemini API calls | `GoogleGenerativeAIEmbeddings` |
| Conversation Memory | Manual history management | Built-in `BufferMemory` |
| Streaming | Custom SSE implementation | LangChain streaming chains |
| Error Handling | Custom error handling | Built-in retry logic |
| Extensibility | Tightly coupled | Modular chains |

## Migration Notes

### Backward Compatibility

The implementation maintains backward compatibility:
- Original endpoints still work
- Can toggle between implementations using `useLangChain` flag
- Automatic fallback on LangChain errors

### Data Format

LangChain uses the same data format:
- Vector embeddings: 768 dimensions
- MongoDB collection: `knowledgechunks`
- Index: `knowledge_vector_index`

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

**Solution**: Ensure MongoDB connection is established before using the vector store.

```typescript
await connectToDatabase();
const vectorStore = await getLangChainVectorStore().getVectorStore();
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
- [MongoDB Atlas Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/)
- [Google Gemini API](https://ai.google.dev/docs)

## Support

For issues or questions:
1. Check the documentation above
2. Review the code comments in the implementation files
3. Open an issue on the GitHub repository
