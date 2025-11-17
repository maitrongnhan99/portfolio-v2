#!/usr/bin/env tsx

import { QdrantClient } from "@qdrant/js-client-rest";

/**
 * Migration script to recreate Qdrant collection with correct vector dimensions
 * Run this after changing vector dimensions in the codebase
 */
async function migrateVectorDimensions() {
  console.log('🔄 Migrating vector dimensions from 1536 to 768...\n');

  let qdrantClient: QdrantClient | null = null;

  try {
    // Initialize Qdrant client
    console.log('1️⃣ Connecting to Qdrant...');
    const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";
    const qdrantApiKey = process.env.QDRANT_API_KEY;
    
    qdrantClient = new QdrantClient({
      url: qdrantUrl,
      apiKey: qdrantApiKey,
    });

    console.log(`✅ Connected to Qdrant at: ${qdrantUrl}`);

    const collectionName = "portfolio_knowledge";

    // Check if collection exists
    console.log('\n2️⃣ Checking existing collection...');
    const collections = await qdrantClient.getCollections();
    const collectionExists = collections.collections?.some(
      collection => collection.name === collectionName
    );

    if (collectionExists) {
      console.log(`📍 Collection '${collectionName}' exists`);
      
      // Get collection info to check current dimensions
      const collectionInfo = await qdrantClient.getCollection(collectionName);
      const currentDimensions = collectionInfo.config?.params?.vectors?.size;
      console.log(`   Current dimensions: ${currentDimensions}`);

      if (currentDimensions === 1536) {
        console.log('\n3️⃣ Deleting existing collection with 1536 dimensions...');
        await qdrantClient.deleteCollection(collectionName);
        console.log(`🗑️ Deleted collection '${collectionName}'`);
      } else if (currentDimensions === 768) {
        console.log('✅ Collection already has correct dimensions (768). No migration needed.');
        return;
      } else {
        console.log(`⚠️ Unexpected dimensions: ${currentDimensions}. Proceeding with recreation...`);
        await qdrantClient.deleteCollection(collectionName);
        console.log(`🗑️ Deleted collection '${collectionName}'`);
      }
    } else {
      console.log(`📍 Collection '${collectionName}' does not exist`);
    }

    // Create new collection with 768 dimensions
    console.log('\n4️⃣ Creating new collection with 768 dimensions...');
    await qdrantClient.createCollection(collectionName, {
      vectors: {
        size: 768, // New dimension size
        distance: "Cosine",
      },
      optimizers_config: {
        default_segment_number: 2,
      },
      replication_factor: 1,
    });

    console.log(`✅ Created collection '${collectionName}' with 768 dimensions`);

    // Verify the new collection
    const newCollectionInfo = await qdrantClient.getCollection(collectionName);
    const newDimensions = newCollectionInfo.config?.params?.vectors?.size;
    console.log(`🔍 Verified new collection dimensions: ${newDimensions}`);

    console.log('\n🎉 Migration completed successfully!');
    console.log('💡 Next steps:');
    console.log('   - Run the seeding script: pnpm seed-knowledge');
    console.log('   - This will populate the collection with new 768-dimensional embeddings');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Cleanup is not needed for Qdrant client
    if (qdrantClient) {
      console.log('\n🧹 Migration cleanup completed');
    }
  }
}

// Run the migration
if (require.main === module) {
  migrateVectorDimensions()
    .then(() => {
      console.log('\n✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateVectorDimensions };