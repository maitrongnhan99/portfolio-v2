# AI Assistant Setup Guide

This guide covers the complete setup process for the RAG-powered AI assistant feature in the portfolio.

## Overview

The AI assistant uses:
- **Google Gemini API** for embeddings and chat completion
- **MongoDB Atlas Vector Search** for semantic search
- **RAG (Retrieval-Augmented Generation)** for accurate responses

## Prerequisites

1. **MongoDB Atlas Account** (free tier works)
2. **Google AI Studio Account** for Gemini API key
3. **Node.js 18+** and **pnpm** installed

## Step 1: Environment Setup

Create `.env.local` file with:

```bash
# MongoDB Atlas connection string
MONGODB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/database-name

# Google Gemini API key
GEMINI_API_KEY=your-gemini-api-key

# Telegram bot token (for contact form)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
```

## Step 2: Install Dependencies

```bash
pnpm install
```

## Step 3: Seed Knowledge Base

Run the seeding script to populate MongoDB with embeddings:

```bash
npx tsx scripts/seed-knowledge-fixed.ts
```

This will:
- Connect to MongoDB
- Generate embeddings for 27 knowledge chunks
- Store them with metadata for filtering

To clear and reseed:
```bash
npx tsx scripts/seed-knowledge-fixed.ts --clear
```

## Step 4: Create Vector Search Index

1. **Log into MongoDB Atlas**
   - Go to [cloud.mongodb.com](https://cloud.mongodb.com)
   - Navigate to your cluster

2. **Create Vector Search Index**
   - Click "Atlas Search" → "Create Search Index"
   - Choose "Atlas Vector Search"
   - Select database: `personal-brain` (or your database name)
   - Select collection: `knowledgechunks`

3. **Index Configuration**
   Use this JSON configuration:

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

4. **Index Name**
   - Set name to: `knowledge_vector_index`
   - Click "Create Search Index"
   - Wait 2-5 minutes for index to build

## Step 5: Verify Setup

Run verification scripts:

```bash
# Comprehensive vector DB verification
npx tsx scripts/verify-vector-db.ts

# Test vector search functionality
npx tsx scripts/test-vector-search.ts

# Check system status via API
curl http://localhost:3000/api/ai-assistant/status | jq .
```

## Step 6: Test the AI Assistant

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Navigate to: http://localhost:3000/ask-me

3. Test queries:
   - "What are Mai's technical skills?"
   - "Tell me about Mai's projects"
   - "How can I contact Mai?"

## Monitoring & Debugging

### Status Endpoint
Check system health at: `/api/ai-assistant/status`

```bash
curl http://localhost:3000/api/ai-assistant/status
```

Returns:
- Component statuses (database, embeddings, vector search, retriever)
- Statistics (document count, categories, embeddings)
- Recommendations for fixing issues

### Check Vector DB Status
```bash
curl http://localhost:3000/api/vector-db-status
```

### Server Logs
The chat API logs detailed information:
- ✅ Successful vector search retrievals
- ⚠️ Fallback usage with reasons
- ❌ Errors with specific causes

## Troubleshooting

### "Vector search index not found"
- Ensure index name is exactly `knowledge_vector_index`
- Check index status is "Active" in MongoDB Atlas
- Wait 2-5 minutes after creation

### "Path 'metadata.category' needs to be indexed"
- Update index to include filter fields (see Step 4)
- Delete and recreate index with correct configuration

### "IP whitelist" errors
- Go to MongoDB Atlas → Network Access
- Add your current IP or `0.0.0.0/0` for development

### Fallback mode active
- Check `/api/ai-assistant/status` for specific issues
- Verify all environment variables are set
- Ensure MongoDB connection is working

## How It Works

1. **User Query** → AI Assistant receives question
2. **Intent Detection** → Analyzes query category (skills, projects, etc.)
3. **Embedding Generation** → Creates 768-dim vector using Gemini
4. **Vector Search** → Finds similar knowledge chunks in MongoDB
5. **Reranking** → Sorts results by relevance and metadata
6. **Context Building** → Combines top chunks for AI context
7. **Response Generation** → Gemini generates answer with sources
8. **Fallback** → Uses hardcoded knowledge if DB unavailable

## Features

- **Semantic Search**: Understands query meaning, not just keywords
- **Category Filtering**: Targets specific knowledge areas
- **Hybrid Search**: Combines vector and category-based retrieval
- **Smart Fallback**: Works even without database connection
- **Source Attribution**: Shows which knowledge chunks were used
- **Streaming Support**: Real-time response generation
- **Error Recovery**: Graceful degradation with detailed logging

## Production Considerations

1. **IP Whitelisting**: Use specific IPs in production
2. **Index Monitoring**: Set up Atlas alerts for index health
3. **Rate Limiting**: Implement API rate limits
4. **Caching**: Consider caching embeddings for common queries
5. **Security**: Keep API keys secure, use environment variables
6. **Backup**: Regular MongoDB backups for knowledge base

## Extending the System

To add more knowledge:
1. Edit `lib/knowledge-data.ts`
2. Add new chunks with appropriate categories
3. Run `npx tsx scripts/seed-knowledge-fixed.ts --clear`
4. Test with relevant queries

## Support

- Check logs for detailed error messages
- Use status endpoints for system health
- Fallback ensures basic functionality always works
- Vector search enhances but isn't required