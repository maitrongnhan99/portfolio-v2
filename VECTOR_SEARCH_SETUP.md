# MongoDB Atlas Vector Search Setup Guide

## Current Status
✅ **Knowledge chunks loaded**: 27 documents  
✅ **Embeddings generated**: All documents have 768-dimensional embeddings  
❌ **Vector search index**: Not created yet (required for RAG to work)

## Create Vector Search Index

1. **Log into MongoDB Atlas**
   - Go to [cloud.mongodb.com](https://cloud.mongodb.com)
   - Navigate to your cluster: `cluster0.chell7l.mongodb.net`

2. **Navigate to Search**
   - Click on your cluster name
   - Select the "Atlas Search" tab (or "Search" in newer UI)

3. **Create Search Index**
   - Click "Create Search Index"
   - Choose "Atlas Vector Search" (not Atlas Search)
   - Select your database: `personal-brain`
   - Select your collection: `knowledgechunks`

4. **Index Configuration**
   MongoDB Atlas now uses a simplified syntax. Use this exact JSON configuration that includes both vector and metadata fields:

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

   **Important**: The filter fields are required for category-based filtering to work properly.

   **Alternative format** (if you see a different interface):
   ```json
   {
     "mappings": {
       "dynamic": true,
       "fields": {
         "embedding": {
           "dimensions": 768,
           "similarity": "cosine",
           "type": "knnVector"
         },
         "metadata": {
           "type": "document",
           "fields": {
             "category": {
               "type": "token"
             },
             "priority": {
               "type": "number"
             }
           }
         }
       }
     }
   }
   ```

5. **Index Name**
   - Set the index name to exactly: `knowledge_vector_index`
   - This name must match what's in your code

6. **Create and Wait**
   - Click "Create Search Index"
   - Wait 2-5 minutes for the index to build
   - Status will change from "Building" to "Active"

## Verify Setup

After the index is active, run:
```bash
npx tsx scripts/verify-vector-db.ts
```

You should see:
- ✅ Vector Search: Working
- ✅ Test results: 3 documents returned

## Testing the AI Assistant

Once verified, test your AI assistant at `/ask-me`:
- Ask: "What are Mai's technical skills?"
- Ask: "Tell me about Mai's projects"
- Ask: "How can I contact Mai?"

The assistant should now use RAG to retrieve relevant knowledge from the vector database instead of falling back to hardcoded responses.

## Troubleshooting

If vector search still doesn't work:
1. Ensure index name is exactly `knowledge_vector_index`
2. Check that index status is "Active" not "Building"
3. Verify you selected the correct database and collection
4. Run `npx tsx scripts/verify-vector-db.ts` to diagnose issues

## Optional: Text Search Index

For fallback text search, create another index:
1. Create a new "Search Index"
2. Use "Visual Editor"
3. Select all text fields
4. Name it `text_search_index`