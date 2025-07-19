#!/usr/bin/env npx tsx

/**
 * Vector Database Verification Script
 * 
 * This script checks the status of your MongoDB vector database setup
 * and helps diagnose common issues.
 */

import * as dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
console.log('🔧 Loading environment from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env.local:', result.error);
  process.exit(1);
}

// Import after env vars are loaded
import KnowledgeChunk from '../models/KnowledgeChunk';
import connectToDatabase from '../lib/mongodb';

class VectorDBVerifier {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
  }

  async checkEnvironment() {
    console.log('\n📋 Environment Check:');
    console.log('─'.repeat(50));
    
    const checks = [
      { name: 'MONGODB_CONNECTION_STRING', value: process.env.MONGODB_CONNECTION_STRING },
      { name: 'GEMINI_API_KEY', value: process.env.GEMINI_API_KEY }
    ];

    let allGood = true;
    for (const check of checks) {
      if (check.value) {
        console.log(`✅ ${check.name}: Found`);
        if (check.name === 'MONGODB_CONNECTION_STRING') {
          // Extract and display connection info safely
          const match = check.value.match(/mongodb\+srv:\/\/([^:]+):.*@([^/]+)/);
          if (match) {
            console.log(`   User: ${match[1]}`);
            console.log(`   Cluster: ${match[2]}`);
          }
        }
      } else {
        console.log(`❌ ${check.name}: Missing`);
        allGood = false;
      }
    }

    return allGood;
  }

  async checkConnection() {
    console.log('\n🔌 MongoDB Connection Test:');
    console.log('─'.repeat(50));

    try {
      await connectToDatabase();
      console.log('✅ Connected to MongoDB successfully');
      
      const dbName = mongoose.connection.db?.databaseName;
      const host = mongoose.connection.host;
      console.log(`📍 Database: ${dbName}`);
      console.log(`🌐 Host: ${host}`);
      
      return true;
    } catch (error) {
      console.error('❌ Connection failed:', error instanceof Error ? error.message : error);
      
      if (error instanceof Error && error.message.includes('whitelist')) {
        console.log('\n⚠️  IP Whitelisting Issue Detected!');
        console.log('   1. Go to MongoDB Atlas dashboard');
        console.log('   2. Navigate to Network Access');
        console.log('   3. Add your current IP or use 0.0.0.0/0 for development');
      }
      
      return false;
    }
  }

  async checkData() {
    console.log('\n📊 Data Check:');
    console.log('─'.repeat(50));

    try {
      const totalCount = await KnowledgeChunk.countDocuments();
      console.log(`📈 Total documents: ${totalCount}`);

      if (totalCount === 0) {
        console.log('⚠️  No documents found! You need to seed the database.');
        console.log('   Run: pnpm seed-knowledge');
        return false;
      }

      // Check documents by category
      const categories = ['personal', 'skills', 'experience', 'projects', 'education', 'contact'];
      console.log('\n📁 Documents by category:');
      
      for (const category of categories) {
        const count = await KnowledgeChunk.countDocuments({ 'metadata.category': category });
        console.log(`   ${category}: ${count}`);
      }

      // Check a sample document
      const sample = await KnowledgeChunk.findOne();
      if (sample) {
        console.log('\n🔍 Sample document:');
        console.log(`   Content: "${sample.content.substring(0, 60)}..."`);
        console.log(`   Category: ${sample.metadata.category}`);
        console.log(`   Embedding dimensions: ${sample.embedding?.length || 0}`);
        console.log(`   Has embedding: ${sample.embedding && sample.embedding.length === 768 ? '✅' : '❌'}`);
      }

      return totalCount > 0;
    } catch (error) {
      console.error('❌ Data check failed:', error instanceof Error ? error.message : error);
      return false;
    }
  }

  async checkVectorSearch() {
    console.log('\n🔍 Vector Search Test:');
    console.log('─'.repeat(50));

    if (!this.genAI) {
      console.log('⚠️  Gemini API key not found, skipping vector search test');
      return false;
    }

    try {
      // Generate a test embedding
      console.log('🔄 Generating test embedding...');
      const model = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
      const result = await model.embedContent("What are Mai's technical skills?");
      const testEmbedding = result.embedding.values;
      
      console.log(`✅ Test embedding generated (${testEmbedding.length} dimensions)`);

      // Try vector search
      console.log('\n🔄 Testing vector search...');
      const pipeline = [
        {
          $vectorSearch: {
            index: "knowledge_vector_index",
            path: "embedding",
            queryVector: testEmbedding,
            numCandidates: 10,
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

      const results = await KnowledgeChunk.aggregate(pipeline);
      
      if (results.length > 0) {
        console.log(`✅ Vector search returned ${results.length} results`);
        console.log('\n📄 Top results:');
        results.forEach((result, index) => {
          console.log(`\n   ${index + 1}. Score: ${result.score.toFixed(4)}`);
          console.log(`      Category: ${result.metadata.category}`);
          console.log(`      Content: "${result.content.substring(0, 60)}..."`);
        });
        return true;
      } else {
        console.log('❌ Vector search returned no results');
        console.log('\n⚠️  Possible issues:');
        console.log('   1. Vector index "knowledge_vector_index" not created in Atlas');
        console.log('   2. Index is still building (can take a few minutes)');
        console.log('   3. Documents don\'t have embeddings');
        return false;
      }
    } catch (error) {
      console.error('❌ Vector search test failed:', error instanceof Error ? error.message : error);
      
      if (error instanceof Error && error.message.includes('$vectorSearch')) {
        console.log('\n⚠️  Vector Search Not Available!');
        console.log('   This could mean:');
        console.log('   1. You\'re not using MongoDB Atlas (vector search is Atlas-only)');
        console.log('   2. Your Atlas cluster doesn\'t support vector search');
        console.log('   3. The vector search index hasn\'t been created');
        console.log('\n📚 To create the index in Atlas:');
        console.log('   1. Go to your cluster in MongoDB Atlas');
        console.log('   2. Click on "Search" tab');
        console.log('   3. Create a new index with these settings:');
        console.log('      - Name: knowledge_vector_index');
        console.log('      - Type: Vector Search');
        console.log('      - Field: embedding (vector, 768 dimensions, cosine)');
      }
      
      return false;
    }
  }

  async testFallback() {
    console.log('\n🔄 Testing Fallback Text Search:');
    console.log('─'.repeat(50));

    try {
      const results = await KnowledgeChunk.find({
        $text: { $search: "skills experience" }
      })
      .limit(3)
      .select('content metadata');

      if (results.length > 0) {
        console.log(`✅ Text search returned ${results.length} results`);
        return true;
      } else {
        console.log('⚠️  Text search returned no results');
        console.log('   Text index may not be created');
        return false;
      }
    } catch (error) {
      console.error('❌ Text search failed:', error instanceof Error ? error.message : error);
      return false;
    }
  }

  async runAllChecks() {
    console.log('🚀 MongoDB Vector Database Verification Tool');
    console.log('='.repeat(50));

    const results = {
      environment: await this.checkEnvironment(),
      connection: false,
      data: false,
      vectorSearch: false,
      textSearch: false,
    };

    if (!results.environment) {
      console.log('\n❌ Environment setup incomplete. Please check your .env.local file.');
      return results;
    }

    results.connection = await this.checkConnection();
    if (!results.connection) {
      console.log('\n❌ Cannot connect to MongoDB. Fix connection issues first.');
      return results;
    }

    results.data = await this.checkData();
    if (results.data) {
      results.vectorSearch = await this.checkVectorSearch();
      results.textSearch = await this.testFallback();
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log('─'.repeat(50));
    console.log(`Environment:    ${results.environment ? '✅' : '❌'}`);
    console.log(`Connection:     ${results.connection ? '✅' : '❌'}`);
    console.log(`Data:           ${results.data ? '✅' : '❌'}`);
    console.log(`Vector Search:  ${results.vectorSearch ? '✅' : '❌'}`);
    console.log(`Text Search:    ${results.textSearch ? '✅' : '❌'}`);

    const allGood = Object.values(results).every(v => v);
    if (allGood) {
      console.log('\n✅ All checks passed! Your vector database is ready.');
    } else {
      console.log('\n⚠️  Some checks failed. Please address the issues above.');
    }

    return results;
  }

  async close() {
    await mongoose.connection.close();
    console.log('\n👋 Connection closed');
  }
}

// Main execution
async function main() {
  const verifier = new VectorDBVerifier();
  
  try {
    await verifier.runAllChecks();
  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
  } finally {
    await verifier.close();
  }
}

// Run the verification
main().catch(console.error);