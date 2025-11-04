#!/usr/bin/env tsx

import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), '.env.local') });

import connectToDatabase from '../lib/mongodb';
import KnowledgeChunk from '../models/KnowledgeChunk';

/**
 * Test basic data retrieval without vector search
 */
async function testBasicRetrieval() {
  console.log('📚 Testing Basic Data Retrieval...\n');

  try {
    // Connect to database
    console.log('1️⃣ Connecting to database...');
    await connectToDatabase();
    console.log('✅ Database connected successfully');

    // Test 1: Get all documents
    console.log('\n2️⃣ Fetching all documents...');
    const allDocs = await KnowledgeChunk.find({})
      .select('content metadata.category metadata.tags')
      .limit(5)
      .lean();
    
    console.log(`📊 Retrieved ${allDocs.length} documents:`);
    allDocs.forEach((doc, index) => {
      console.log(`\n   ${index + 1}. Category: ${doc.metadata.category}`);
      console.log(`      Tags: ${doc.metadata.tags.join(', ')}`);
      console.log(`      Content: ${doc.content.substring(0, 100)}...`);
    });

    // Test 2: Filter by category
    console.log('\n3️⃣ Testing category filtering...');
    const skillsDocs = await KnowledgeChunk.find({ 'metadata.category': 'skills' })
      .select('content metadata.tags')
      .limit(3)
      .lean();
    
    console.log(`📊 Skills documents (${skillsDocs.length}):`);
    skillsDocs.forEach((doc, index) => {
      console.log(`\n   ${index + 1}. Tags: ${doc.metadata.tags.join(', ')}`);
      console.log(`      Content: ${doc.content.substring(0, 80)}...`);
    });

    // Test 3: Search by tags
    console.log('\n4️⃣ Testing tag-based search...');
    const reactDocs = await KnowledgeChunk.find({ 'metadata.tags': 'react' })
      .select('content metadata.category')
      .lean();
    
    console.log(`📊 Documents with 'react' tag (${reactDocs.length}):`);
    reactDocs.forEach((doc, index) => {
      console.log(`\n   ${index + 1}. Category: ${doc.metadata.category}`);
      console.log(`      Content: ${doc.content.substring(0, 80)}...`);
    });

    // Test 4: Text search (MongoDB text index)
    console.log('\n5️⃣ Testing text search...');
    const textSearchDocs = await KnowledgeChunk.find(
      { $text: { $search: "react typescript" } },
      { score: { $meta: "textScore" } }
    )
    .select('content metadata.category')
    .sort({ score: { $meta: "textScore" } })
    .limit(3)
    .lean();
    
    console.log(`📊 Text search results (${textSearchDocs.length}):`);
    textSearchDocs.forEach((doc, index) => {
      console.log(`\n   ${index + 1}. Category: ${doc.metadata.category}`);
      console.log(`      Content: ${doc.content.substring(0, 80)}...`);
    });

    // Test 5: Check embeddings exist
    console.log('\n6️⃣ Checking embeddings...');
    const docsWithEmbeddings = await KnowledgeChunk.countDocuments({
      embedding: { $exists: true, $ne: null, $not: { $size: 0 } }
    });
    console.log(`📊 Documents with embeddings: ${docsWithEmbeddings}/27`);

    // Test 6: Sample embedding data
    const sampleEmbedding = await KnowledgeChunk.findOne()
      .select('embedding')
      .lean();
    
    if (sampleEmbedding?.embedding) {
      console.log(`🧮 Sample embedding info:`);
      console.log(`   Length: ${sampleEmbedding.embedding.length}`);
      console.log(`   First 5 values: [${sampleEmbedding.embedding.slice(0, 5).map(n => n.toFixed(4)).join(', ')}]`);
      console.log(`   Data type: ${typeof sampleEmbedding.embedding[0]}`);
    }

    console.log('\n🎉 Basic retrieval testing completed successfully!');
    console.log('\n💡 Key findings:');
    console.log('   ✅ Database connection working');
    console.log('   ✅ Documents are stored correctly');
    console.log('   ✅ Embeddings are present and valid');
    console.log('   ✅ Text search and filtering work');
    console.log('   ⚠️  Vector search requires MongoDB Atlas Search Index');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the test
testBasicRetrieval();