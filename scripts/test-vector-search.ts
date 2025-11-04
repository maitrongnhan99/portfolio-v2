#!/usr/bin/env tsx

import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), '.env.local') });

import connectToDatabase from '../lib/mongodb';
import KnowledgeChunk from '../models/KnowledgeChunk';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Test vector search functionality
 */
async function testVectorSearch() {
  console.log('🔍 Testing Vector Search...\n');

  try {
    // Connect to database
    console.log('1️⃣ Connecting to database...');
    await connectToDatabase();
    console.log('✅ Database connected successfully');

    // Check data
    console.log('\n2️⃣ Checking data...');
    const totalDocs = await KnowledgeChunk.countDocuments();
    console.log(`📊 Total documents: ${totalDocs}`);

    const sampleDoc = await KnowledgeChunk.findOne().select('content embedding').lean();
    if (sampleDoc) {
      console.log(`📄 Sample document content: ${sampleDoc.content.substring(0, 80)}...`);
      console.log(`🧮 Has embedding: ${!!sampleDoc.embedding}`);
      console.log(`🧮 Embedding dimensions: ${sampleDoc.embedding?.length || 0}`);
    }

    // Test vector search
    if (totalDocs > 0) {
      console.log('\n3️⃣ Testing vector search...');
      await testSearch("What technologies does Mai work with?");
      await testSearch("Tell me about Mai's projects");
      await testSearch("What is Mai's contact information?");
    }

    console.log('\n🎉 Vector search testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

async function testSearch(query: string) {
  console.log(`\n🔍 Searching: "${query}"`);
  
  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    
    // Generate query embedding
    const result = await model.embedContent(query);
    const queryEmbedding = result.embedding.values;
    console.log(`   Generated query embedding: ${queryEmbedding.length} dimensions`);

    // Test MongoDB aggregation pipeline for vector search
    const pipeline = [
      {
        $vectorSearch: {
          index: "knowleges_vector_index",
          path: "embedding", 
          queryVector: queryEmbedding,
          numCandidates: 10,
          limit: 3,
        },
      },
      {
        $project: {
          content: 1,
          'metadata.category': 1,
          'metadata.tags': 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ];

    const searchResults = await KnowledgeChunk.aggregate(pipeline);
    
    if (searchResults.length > 0) {
      console.log(`   ✅ Found ${searchResults.length} results:`);
      searchResults.forEach((doc, index) => {
        console.log(`   ${index + 1}. Score: ${doc.score?.toFixed(4) || 'N/A'}`);
        console.log(`      Category: ${doc.metadata?.category || 'Unknown'}`);
        console.log(`      Content: ${doc.content.substring(0, 80)}...`);
      });
    } else {
      console.log('   ⚠️ No results found');
    }

  } catch (error) {
    console.error(`   ❌ Search failed:`, error);
    
    if (error instanceof Error && error.message.includes('$vectorSearch')) {
      console.log('   💡 This indicates the vector search index is not configured in MongoDB Atlas');
      console.log('   💡 You need to create a search index named "knowleges_vector_index"');
    }
  }
}

// Run the test
testVectorSearch();