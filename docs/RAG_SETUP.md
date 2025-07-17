# RAG AI Assistant Setup Guide

This guide covers the setup and configuration of the RAG (Retrieval-Augmented Generation) AI Assistant system for the portfolio website.

## Overview

The RAG system transforms the basic pattern-matching AI assistant into a sophisticated knowledge retrieval system using:
- **Google Gemini** for text embeddings and response generation
- **MongoDB Atlas Vector Search** for semantic similarity search
- **Smart Retrieval** with category detection and reranking
- **Contextual Responses** based on retrieved knowledge

## Prerequisites

### 1. Google AI API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for use in environment variables

### 2. MongoDB Atlas Setup
1. Create a [MongoDB Atlas](https://cloud.mongodb.com/) account
2. Create a new cluster (M0 free tier is sufficient for development)
3. Create a database user with read/write permissions
4. Get your connection string
5. **Important**: Create a Vector Search Index (see below)

### 3. MongoDB Atlas Vector Search Index
Create a vector search index named `knowledge_vector_index` with this configuration:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 768,
      "similarity": "cosine"
    },
    {
      "type": "filter", 
      "path": "metadata.category"
    },
    {
      "type": "filter", 
      "path": "metadata.priority"
    }
  ]
}
```

**Steps to create the index:**
1. In MongoDB Atlas, go to your cluster
2. Click "Search" tab
3. Click "Create Search Index"
4. Choose "JSON Editor"
5. Select your database and `knowledgechunks` collection
6. Paste the JSON configuration above
7. Name the index: `knowledge_vector_index`
8. Click "Next" and "Create Search Index"

## Environment Setup

### 1. Environment Variables
Add these variables to your `.env.local` file:

```bash
# Google AI (Gemini) API Key
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Atlas Connection String
MONGODB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Existing variables
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### 2. Dependencies
All required dependencies are already included in `package.json`:
- `@google/generative-ai` - Gemini API integration
- `mongodb` - MongoDB driver
- `mongoose` - MongoDB ODM
- `tsx` - TypeScript execution
- `dotenv` - Environment variable loading

## Database Population

### 1. Seed the Knowledge Base
Run the seeding script to populate your MongoDB database with knowledge chunks and embeddings:

```bash
# Seed with existing data preservation
pnpm run seed-knowledge

# Clear existing data and seed fresh
pnpm run seed-knowledge:clear
```

The seeding process will:
1. Validate environment variables
2. Generate embeddings for each knowledge chunk using Gemini
3. Store chunks with embeddings in MongoDB
4. Process in batches to respect API rate limits
5. Verify the seeding was successful

### 2. Monitor Progress
The seeding script provides detailed progress information:
- Batch processing status
- Individual document processing
- Category distribution verification
- Total document count validation

Expected output:
```
🚀 Starting knowledge base seeding...
✅ Environment variables validated
📚 Processing 25 knowledge chunks in batches of 5...
📦 Processing batch 1/5 (5 items)...
   1. [personal] Mai Trọng Nhân is a FullStack Developer based in Vietnam...
✅ Batch 1 completed successfully
...
✅ Knowledge base seeding completed successfully!
📊 Total documents in knowledge base: 25
```

## System Architecture

### Core Components

1. **EmbeddingService** (`services/embeddingService.ts`)
   - Generates 768-dimension embeddings using Google's text-embedding-004
   - Handles batch processing and rate limiting
   - Includes utility functions for similarity calculations

2. **MongoVectorStore** (`services/vectorStore.ts`)
   - Manages vector storage and retrieval in MongoDB Atlas
   - Implements vector similarity search using aggregation pipelines
   - Provides fallback text search when vector search fails

3. **SmartRetriever** (`services/retriever.ts`)
   - Analyzes query intent and detects categories
   - Performs semantic search with intelligent filtering
   - Reranks results based on relevance and priority

4. **Chat API** (`app/api/ai-assistant/chat/route.ts`)
   - Handles chat requests with full RAG pipeline
   - Integrates retrieval with Gemini response generation
   - Provides fallback responses when services are unavailable

### Knowledge Base Structure

Knowledge chunks are stored with this schema:
```typescript
{
  content: string;           // The actual knowledge text
  embedding: number[];       // 768-dimension vector from Gemini
  metadata: {
    category: string;        // personal, skills, experience, projects, education, contact
    priority: number;        // 1 (high), 2 (medium), 3 (low)
    tags: string[];         // Searchable keywords
    source: string;         // Source identifier
    lastUpdated: Date;      // Update timestamp
  }
}
```

## Usage

### 1. Frontend Integration
The AI assistant automatically uses the new RAG system. The chat interface at `/ask-me` will:
- Send user messages to `/api/ai-assistant/chat`
- Display RAG-powered responses
- Handle error states gracefully with fallbacks

### 2. API Usage
You can also use the chat API directly:

```typescript
const response = await fetch('/api/ai-assistant/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "What are Mai's technical skills?",
    conversationHistory: [] // Optional context
  })
});

const data = await response.json();
console.log(data.response); // AI-generated response
console.log(data.sources);  // Source knowledge chunks
```

## Configuration

### Retrieval Parameters
Adjust these parameters in the retriever for different behaviors:

```typescript
const relevantChunks = await retriever.retrieve(query, {
  k: 3,                    // Number of chunks to retrieve
  threshold: 0.6,          // Minimum similarity score
  useIntent: true,         // Enable category detection
  rerankResults: true      // Enable intelligent reranking
});
```

### Response Generation
Modify the system prompt in the chat API to change response style:
- Adjust tone and personality
- Add specific instructions
- Include additional context formatting

## Monitoring and Optimization

### 1. Performance Monitoring
- Monitor API response times
- Track embedding generation costs
- Watch MongoDB Atlas performance metrics

### 2. Quality Assessment
- Review chat logs for response quality
- Test with various question types
- Gather user feedback on relevance

### 3. Optimization Opportunities
- Adjust similarity thresholds based on performance
- Fine-tune reranking weights
- Add more knowledge chunks for better coverage
- Implement caching for frequently asked questions

## Troubleshooting

### Common Issues

1. **Vector Search Not Working**
   - Verify the MongoDB Atlas Vector Search index is created correctly
   - Check index name matches `knowledge_vector_index`
   - Ensure embeddings are 768 dimensions

2. **API Rate Limiting**
   - Increase delays in seeding script
   - Implement exponential backoff
   - Consider upgrading Gemini API tier

3. **Poor Response Quality**
   - Review knowledge base content for accuracy
   - Adjust similarity thresholds
   - Improve reranking algorithm weights

4. **MongoDB Connection Issues**
   - Verify connection string format
   - Check database user permissions
   - Ensure IP address is whitelisted

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG=true
```

This will provide detailed logs for:
- Query intent detection
- Retrieval process
- Embedding generation
- Response generation

## Extending the System

### Adding New Knowledge
1. Update `lib/knowledge-data.ts` with new chunks
2. Run `pnpm run seed-knowledge` to add embeddings
3. Test with relevant queries

### Custom Categories
1. Add new categories to the schema in `models/KnowledgeChunk.ts`
2. Update category detection in `services/retriever.ts`
3. Add category-specific handling in the chat API

### Advanced Features
- Implement conversation memory
- Add multi-language support
- Create admin interface for knowledge management
- Add analytics and usage tracking

## Security Considerations

1. **API Key Protection**
   - Never commit API keys to version control
   - Use environment variables only
   - Rotate keys regularly

2. **Input Validation**
   - Sanitize user inputs
   - Implement rate limiting
   - Add CORS protection

3. **Database Security**
   - Use least-privilege database users
   - Enable MongoDB Atlas security features
   - Monitor access logs

---

For additional support or questions about the RAG system, refer to the main project documentation or create an issue in the repository.