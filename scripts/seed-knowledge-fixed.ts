#!/usr/bin/env npx tsx

/**
 * Fixed Knowledge Base Seeding Script
 * 
 * This script properly loads environment variables and seeds the MongoDB
 * database with knowledge chunks and their embeddings.
 */

import * as dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables FIRST
const envPath = path.resolve(process.cwd(), '.env.local');
console.log('Loading environment from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env.local:', result.error);
  process.exit(1);
}

// Verify environment variables are loaded
console.log('Environment check:');
console.log('  MongoDB:', process.env.MONGODB_CONNECTION_STRING ? '✅ Found' : '❌ Missing');
console.log('  Gemini:', process.env.GEMINI_API_KEY ? '✅ Found' : '❌ Missing');
console.log('');

if (!process.env.MONGODB_CONNECTION_STRING || !process.env.GEMINI_API_KEY) {
  console.error('❌ Missing required environment variables!');
  process.exit(1);
}

// Now import modules that depend on environment variables
import knowledgeBase from '../lib/knowledge-data';
import KnowledgeChunk from '../models/KnowledgeChunk';

interface SeedOptions {
  clearExisting?: boolean;
  batchSize?: number;
  delayBetweenBatches?: number;
}

class KnowledgeSeeder {
  private genAI: GoogleGenerativeAI;
  private embeddingModel: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.embeddingModel = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
  }

  async connectDB() {
    try {
      await mongoose.connect(process.env.MONGODB_CONNECTION_STRING!);
      console.log('✅ Connected to MongoDB');
      
      const db = mongoose.connection.db;
      if (db) {
        console.log(`✅ Database: ${db.databaseName}`);
      }
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const result = await this.embeddingModel.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('❌ Embedding generation failed:', error);
      throw error;
    }
  }

  async seed(options: SeedOptions = {}) {
    const {
      clearExisting = false,
      batchSize = 5,
      delayBetweenBatches = 2000, // 2 seconds between batches to avoid rate limits
    } = options;

    try {
      console.log('🚀 Starting knowledge base seeding...\n');

      // Connect to MongoDB
      await this.connectDB();

      // Clear existing data if requested
      if (clearExisting) {
        console.log('🗑️  Clearing existing knowledge chunks...');
        const deleteResult = await KnowledgeChunk.deleteMany({});
        console.log(`✅ Deleted ${deleteResult.deletedCount} existing chunks\n`);
      } else {
        const existingCount = await KnowledgeChunk.countDocuments();
        if (existingCount > 0) {
          console.log(`ℹ️  Found ${existingCount} existing chunks (use --clear to remove)\n`);
        }
      }

      // Process knowledge chunks
      console.log(`📚 Processing ${knowledgeBase.length} knowledge chunks...`);
      console.log(`📦 Batch size: ${batchSize}, Delay: ${delayBetweenBatches}ms\n`);

      let successCount = 0;
      let errorCount = 0;

      // Process in batches
      for (let i = 0; i < knowledgeBase.length; i += batchSize) {
        const batch = knowledgeBase.slice(i, i + batchSize);
        const batchNumber = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(knowledgeBase.length / batchSize);

        console.log(`\n📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);

        for (let j = 0; j < batch.length; j++) {
          const chunk = batch[j];
          const globalIndex = i + j + 1;

          try {
            console.log(`  ${globalIndex}. [${chunk.category}] ${chunk.content.substring(0, 60)}...`);

            // Generate embedding
            const embedding = await this.generateEmbedding(chunk.content);

            // Create knowledge chunk document
            const knowledgeChunk = new KnowledgeChunk({
              content: chunk.content,
              embedding: embedding,
              metadata: {
                category: chunk.category,
                priority: chunk.priority,
                tags: chunk.tags,
                source: chunk.source,
                lastUpdated: new Date(),
              },
            });

            // Save to MongoDB
            await knowledgeChunk.save();
            successCount++;
            console.log(`     ✅ Embedded and saved (${embedding.length} dimensions)`);

          } catch (error) {
            errorCount++;
            console.error(`     ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        // Delay between batches to avoid rate limits
        if (i + batchSize < knowledgeBase.length) {
          console.log(`\n⏳ Waiting ${delayBetweenBatches}ms before next batch...`);
          await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
      }

      // Summary
      console.log('\n' + '='.repeat(50));
      console.log('📊 Seeding Summary:');
      console.log(`  ✅ Successfully embedded: ${successCount}/${knowledgeBase.length}`);
      console.log(`  ❌ Failed: ${errorCount}/${knowledgeBase.length}`);
      
      // Check final count in database
      const finalCount = await KnowledgeChunk.countDocuments();
      console.log(`  📚 Total chunks in database: ${finalCount}`);
      console.log('='.repeat(50) + '\n');

      if (successCount === knowledgeBase.length) {
        console.log('🎉 All knowledge chunks successfully embedded and stored!');
      } else if (errorCount > 0) {
        console.log('⚠️  Some chunks failed. You may want to run the script again.');
      }

    } catch (error) {
      console.error('\n❌ Fatal error during seeding:', error);
      throw error;
    }
  }

  async verifyIndex() {
    console.log('\n🔍 Verifying MongoDB Atlas Vector Search Index...');
    console.log('ℹ️  Note: Vector search index must be created manually in MongoDB Atlas');
    console.log('    Index name: knowledge_vector_index');
    console.log('    Field: embedding (vector, 768 dimensions, cosine similarity)');
    console.log('    Filters: metadata.category, metadata.priority');
    
    // Test a sample query
    try {
      const testChunk = await KnowledgeChunk.findOne();
      if (testChunk) {
        console.log('\n✅ Sample chunk found:');
        console.log(`  Content: ${testChunk.content.substring(0, 60)}...`);
        console.log(`  Category: ${testChunk.metadata.category}`);
        console.log(`  Embedding dimensions: ${testChunk.embedding.length}`);
      }
    } catch (error) {
      console.error('❌ Error verifying data:', error);
    }
  }

  async close() {
    await mongoose.connection.close();
    console.log('\n✅ MongoDB connection closed');
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const options: SeedOptions = {
    clearExisting: args.includes('--clear'),
    batchSize: 5,
    delayBetweenBatches: 2000,
  };

  if (args.includes('--help')) {
    console.log('Usage: npx tsx scripts/seed-knowledge-fixed.ts [options]');
    console.log('Options:');
    console.log('  --clear    Clear existing knowledge chunks before seeding');
    console.log('  --help     Show this help message');
    return;
  }

  const seeder = new KnowledgeSeeder();

  try {
    await seeder.seed(options);
    await seeder.verifyIndex();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await seeder.close();
  }
}

// Run the script
main().catch(console.error);