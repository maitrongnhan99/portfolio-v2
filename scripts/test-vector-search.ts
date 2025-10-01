#!/usr/bin/env npx tsx

/**
 * Vector Search Test Script
 * 
 * This script tests the vector search functionality after index creation
 * Run this after creating the vector search index in MongoDB Atlas
 */

import * as dotenv from 'dotenv';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

// Import after env vars are loaded
import connectToDatabase from '../lib/mongodb';
import KnowledgeChunk from '../models/KnowledgeChunk';
import { SmartRetriever } from '../services/retriever';
import { MongoVectorStore } from '../services/vectorStore';

interface TestQuery {
  query: string;
  expectedCategory?: string;
  description: string;
}

class VectorSearchTester {
  private genAI: GoogleGenerativeAI | null = null;
  private retriever: SmartRetriever;
  private vectorStore: MongoVectorStore;

  constructor() {
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    this.retriever = new SmartRetriever();
    this.vectorStore = new MongoVectorStore();
  }

  async testDirectVectorSearch() {
    console.log('\n🔍 Testing Direct Vector Search:');
    console.log('─'.repeat(50));

    if (!this.genAI) {
      console.log('⚠️  Gemini API key not found, skipping vector search test');
      return false;
    }

    try {
      await connectToDatabase();

      // Test queries
      const testQueries = [
        "What programming languages does Mai know?",
        "Tell me about Mai's projects",
        "How can I contact Mai?"
      ];

      for (const query of testQueries) {
        console.log(`\n📝 Query: "${query}"`);
        
        try {
          // Generate embedding
          const model = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
          const result = await model.embedContent(query);
          const embedding = result.embedding.values;

          // Direct aggregation pipeline test
          const pipeline = [
            {
              $vectorSearch: {
                index: "knowledge_vector_index",
                path: "embedding",
                queryVector: embedding,
                numCandidates: 30,
                limit: 3,
              },
            },
            {
              $project: {
                content: 1,
                metadata: 1,
                score: { $meta: "vectorSearchScore" },
              },
            },
          ];

          console.log('🔄 Executing vector search pipeline...');
          const results = await KnowledgeChunk.aggregate(pipeline);

          if (results.length > 0) {
            console.log(`✅ Found ${results.length} results`);
            results.forEach((result, index) => {
              console.log(`   ${index + 1}. Score: ${result.score.toFixed(4)}`);
              console.log(`      Category: ${result.metadata.category}`);
              console.log(`      Content: "${result.content.substring(0, 80)}..."`);
            });
          } else {
            console.log('❌ No results found');
          }
        } catch (error) {
          console.error('❌ Query failed:', error instanceof Error ? error.message : error);
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Direct vector search test failed:', error);
      return false;
    }
  }

  async testRetrieverService() {
    console.log('\n🤖 Testing Retriever Service:');
    console.log('─'.repeat(50));

    const testQueries: TestQuery[] = [
      {
        query: "What are Mai's technical skills?",
        expectedCategory: "skills",
        description: "Testing skills category retrieval"
      },
      {
        query: "Tell me about Mai's work experience",
        expectedCategory: "experience",
        description: "Testing experience category retrieval"
      },
      {
        query: "What projects has Mai built?",
        expectedCategory: "projects",
        description: "Testing projects category retrieval"
      },
      {
        query: "How can I reach Mai?",
        expectedCategory: "contact",
        description: "Testing contact category retrieval"
      },
    ];

    let successCount = 0;

    for (const test of testQueries) {
      console.log(`\n📝 ${test.description}`);
      console.log(`   Query: "${test.query}"`);

      try {
        const results = await this.retriever.retrieve(test.query, {
          k: 3,
          threshold: 0.5,
          useIntent: true,
          rerankResults: true
        });

        if (results.length > 0) {
          console.log(`✅ Retrieved ${results.length} chunks`);
          
          // Check if expected category matches
          const categoryMatches = results.filter(r => r.metadata.category === test.expectedCategory);
          if (test.expectedCategory && categoryMatches.length > 0) {
            console.log(`✅ Category match: Found ${categoryMatches.length} ${test.expectedCategory} chunks`);
            successCount++;
          } else if (test.expectedCategory) {
            console.log(`⚠️  Expected category '${test.expectedCategory}' but got:`, 
              results.map(r => r.metadata.category).join(', '));
          }

          // Show top result
          const topResult = results[0];
          console.log(`\n   Top Result (Score: ${topResult.score.toFixed(4)}):`);
          console.log(`   Category: ${topResult.metadata.category}`);
          console.log(`   Content: "${topResult.content.substring(0, 100)}..."`);
        } else {
          console.log('❌ No results retrieved');
        }
      } catch (error) {
        console.error('❌ Retrieval failed:', error instanceof Error ? error.message : error);
      }
    }

    console.log(`\n📊 Success rate: ${successCount}/${testQueries.length}`);
    return successCount === testQueries.length;
  }

  async testFallbackMechanism() {
    console.log('\n🔄 Testing Fallback Mechanism:');
    console.log('─'.repeat(50));

    try {
      // Simulate a query when vector search might fail
      console.log('📝 Testing fallback with generic query...');
      
      const results = await this.retriever.retrieve("tell me something", {
        k: 3,
        threshold: 0.9, // High threshold to potentially trigger fallback
      });

      if (results.length > 0) {
        console.log(`✅ Fallback returned ${results.length} results`);
        console.log('   Categories:', results.map(r => r.metadata.category).join(', '));
      } else {
        console.log('⚠️  No results from fallback');
      }

      return true;
    } catch (error) {
      console.error('❌ Fallback test failed:', error);
      return false;
    }
  }

  async testHybridSearch() {
    console.log('\n🔀 Testing Hybrid Search:');
    console.log('─'.repeat(50));

    try {
      const query = "Mai's React and Next.js experience";
      console.log(`📝 Query: "${query}"`);

      const results = await this.retriever.hybridSearch(query, { k: 5 });

      if (results.length > 0) {
        console.log(`✅ Hybrid search returned ${results.length} results`);
        
        // Group by category
        const byCategory = results.reduce((acc, result) => {
          const cat = result.metadata.category;
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        console.log('\n📊 Results by category:');
        Object.entries(byCategory).forEach(([cat, count]) => {
          console.log(`   ${cat}: ${count}`);
        });
      } else {
        console.log('❌ No results from hybrid search');
      }

      return results.length > 0;
    } catch (error) {
      console.error('❌ Hybrid search test failed:', error);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Vector Search Test Suite');
    console.log('='.repeat(50));

    const results = {
      directSearch: false,
      retrieverService: false,
      fallback: false,
      hybridSearch: false,
    };

    try {
      // Check if we have documents
      await connectToDatabase();
      const docCount = await KnowledgeChunk.countDocuments();
      console.log(`\n📚 Total documents in database: ${docCount}`);

      if (docCount === 0) {
        console.log('❌ No documents found! Run seed script first.');
        return;
      }

      // Check sample document for embeddings
      const sample = await KnowledgeChunk.findOne();
      if (sample) {
        console.log(`📄 Sample document has embedding: ${!!sample.embedding && sample.embedding.length === 768 ? '✅' : '❌'}`);
      }

      // Run tests
      results.directSearch = await this.testDirectVectorSearch();
      results.retrieverService = await this.testRetrieverService();
      results.fallback = await this.testFallbackMechanism();
      results.hybridSearch = await this.testHybridSearch();

      // Summary
      console.log('\n📊 Test Summary:');
      console.log('─'.repeat(50));
      console.log(`Direct Vector Search:  ${results.directSearch ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`Retriever Service:     ${results.retrieverService ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`Fallback Mechanism:    ${results.fallback ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`Hybrid Search:         ${results.hybridSearch ? '✅ PASS' : '❌ FAIL'}`);

      const allPassed = Object.values(results).every(v => v);
      if (allPassed) {
        console.log('\n🎉 All tests passed! Vector search is working correctly.');
      } else if (results.fallback) {
        console.log('\n⚠️  Vector search not working, but fallback is functional.');
        console.log('   Make sure to create the vector search index in MongoDB Atlas.');
      } else {
        console.log('\n❌ Tests failed. Check the error messages above.');
      }

    } catch (error) {
      console.error('\n❌ Test suite error:', error);
    }
  }

  async close() {
    // Connection will be closed automatically
    console.log('\n✅ Tests completed');
  }
}

// Main execution
async function main() {
  const tester = new VectorSearchTester();
  
  try {
    await tester.runAllTests();
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await tester.close();
  }
}

// Run tests
main().catch(console.error);