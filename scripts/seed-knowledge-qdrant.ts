#!/usr/bin/env tsx

import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), '.env.local') });

import { getQdrantVectorStore } from '../services/qdrant-vector-store';
import { knowledgeBase } from '../lib/knowledge-data';

/**
 * Seed script to populate the Qdrant vector database with knowledge data
 */
async function seedQdrantKnowledgeDatabase() {
  console.log('🌱 Seeding Qdrant Knowledge Database...\n');

  try {
    // Initialize Qdrant vector store
    console.log('1️⃣ Initializing Qdrant vector store...');
    const vectorStore = getQdrantVectorStore();
    await vectorStore.getVectorStore(); // This will initialize the connection
    console.log('✅ Qdrant vector store initialized successfully');

    // Clear existing data
    console.log('\n2️⃣ Clearing existing knowledge data...');
    const deletedCount = await vectorStore.clearAll();
    console.log(`🗑️ Removed ${deletedCount} existing documents`);

    // Add documents to Qdrant vector store
    console.log('\n3️⃣ Adding documents to Qdrant vector store...');
    
    const documentsToAdd = knowledgeBase.map(item => ({
      content: item.content,
      metadata: {
        category: item.category,
        priority: item.priority,
        tags: item.tags,
        source: item.source,
      }
    }));

    await vectorStore.addDocuments(documentsToAdd);
    console.log(`✅ Successfully added ${documentsToAdd.length} documents to Qdrant`);

    // Verify data
    console.log('\n4️⃣ Verifying inserted data...');
    const totalCount = await vectorStore.getDocumentCount();
    console.log(`📊 Total documents in Qdrant: ${totalCount}`);

    // Get collection info
    console.log('\n5️⃣ Collection information:');
    const collectionInfo = await vectorStore.getCollectionInfo();
    console.log(`   Collection: ${collectionInfo.config?.params?.vectors?.size || 'unknown'} dimensions`);
    console.log(`   Distance: ${collectionInfo.config?.params?.vectors?.distance || 'unknown'}`);
    console.log(`   Points: ${collectionInfo.points_count || 0}`);

    // Test similarity search
    console.log('\n6️⃣ Testing similarity search...');
    const testQuery = "What are Mai's skills?";
    const searchResults = await vectorStore.similaritySearch(testQuery, 3);
    
    console.log(`   Query: "${testQuery}"`);
    console.log(`   Results: ${searchResults.length} documents found`);
    
    searchResults.forEach((result, index) => {
      console.log(`   ${index + 1}. Score: ${result.score.toFixed(4)}`);
      console.log(`      Category: ${result.metadata.category}`);
      console.log(`      Content: ${result.content.substring(0, 100)}...`);
    });

    console.log('\n🎉 Qdrant knowledge database seeding completed successfully!');
    console.log('💡 All documents are now embedded and ready for vector search!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    // Clean up
    const vectorStore = getQdrantVectorStore();
    await vectorStore.cleanup();
    process.exit(0);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const shouldClear = args.includes('--clear');

if (shouldClear) {
  console.log('⚠️ Clear-only mode: removing all data without seeding new data\n');
  
  getQdrantVectorStore().clearAll()
    .then((deletedCount) => {
      console.log(`🗑️ Cleared ${deletedCount} documents from Qdrant`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Clear operation failed:', error);
      process.exit(1);
    });
} else {
  // Run the seeding
  seedQdrantKnowledgeDatabase();
}