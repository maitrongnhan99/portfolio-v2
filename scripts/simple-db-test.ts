#!/usr/bin/env tsx

import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), '.env.local') });

import connectToDatabase from '../lib/mongodb';
import KnowledgeChunk from '../models/KnowledgeChunk';
import { MongoClient } from 'mongodb';

/**
 * Simple test script to verify MongoDB connection and fetch sample data
 */
async function testDatabaseConnection() {
  console.log('🧪 Testing Database Connection...\n');

  try {
    // Test 1: Mongoose Connection
    console.log('1️⃣ Testing Mongoose Connection...');
    await connectToDatabase();
    console.log('✅ Mongoose connection successful');
    
    // Test 2: Check environment variables
    console.log('\n2️⃣ Checking Environment Variables...');
    const hasMongoUri = !!process.env.MONGODB_CONNECTION_STRING;
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    console.log(`📊 MONGODB_CONNECTION_STRING: ${hasMongoUri ? '✅ Set' : '❌ Missing'}`);
    console.log(`📊 GEMINI_API_KEY: ${hasGeminiKey ? '✅ Set' : '❌ Missing'}`);

    // Test 3: Check documents count using Mongoose
    console.log('\n3️⃣ Checking existing documents...');
    const totalDocs = await KnowledgeChunk.countDocuments();
    console.log(`📊 Total documents in database: ${totalDocs}`);
    
    // Test 4: Fetch sample documents using Mongoose
    if (totalDocs > 0) {
      console.log('\n4️⃣ Fetching sample documents...');
      const sampleDocs = await KnowledgeChunk.find({})
        .limit(3)
        .select('content metadata.category metadata.tags')
        .lean();

      console.log(`📚 Found ${sampleDocs.length} sample documents:`);
      sampleDocs.forEach((doc, index) => {
        console.log(`\n   ${index + 1}. Category: ${doc.metadata.category}`);
        console.log(`      Tags: ${doc.metadata.tags?.join(', ') || 'No tags'}`);
        console.log(`      Content: ${doc.content.substring(0, 100)}...`);
      });

      // Check for embeddings
      const docsWithEmbeddings = await KnowledgeChunk.countDocuments({
        embedding: { $exists: true, $ne: null }
      });
      console.log(`\n🧮 Documents with embeddings: ${docsWithEmbeddings}`);
    } else {
      console.log('\n📭 No documents found in the database');
      console.log('💡 Consider running seed scripts to populate data');
    }

    // Test 5: Test native MongoDB connection
    console.log('\n5️⃣ Testing Native MongoDB Connection...');
    await testNativeConnection();

    console.log('\n🎉 All basic database tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

/**
 * Test native MongoDB connection separately
 */
async function testNativeConnection() {
  const mongoConnectionString = process.env.MONGODB_CONNECTION_STRING;
  if (!mongoConnectionString) {
    console.log('❌ No MongoDB connection string found');
    return;
  }

  let client: MongoClient | null = null;
  try {
    client = new MongoClient(mongoConnectionString);
    await client.connect();
    console.log('✅ Native MongoDB client connected');

    const db = client.db();
    console.log(`📍 Database name: ${db.databaseName}`);

    const collection = db.collection('knowledgechunks');
    const count = await collection.countDocuments();
    console.log(`📊 Documents in knowledgechunks collection: ${count}`);

    // Test collection exists and is accessible
    const collectionNames = await db.listCollections().toArray();
    const hasKnowledgeChunks = collectionNames.some(col => col.name === 'knowledgechunks');
    console.log(`📂 knowledgechunks collection exists: ${hasKnowledgeChunks ? '✅ Yes' : '❌ No'}`);

    // Sample document from native client
    if (count > 0) {
      const sampleDoc = await collection.findOne({}, { projection: { content: 1, 'metadata.category': 1 } });
      if (sampleDoc) {
        console.log(`📄 Sample document from native client:`);
        console.log(`   Category: ${sampleDoc.metadata?.category || 'Unknown'}`);
        console.log(`   Content: ${sampleDoc.content?.substring(0, 80) || 'No content'}...`);
      }
    }

  } catch (error) {
    console.error('❌ Native MongoDB connection failed:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🧹 Native MongoDB client connection closed');
    }
  }
}

// Run the test
testDatabaseConnection();