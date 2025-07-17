#!/usr/bin/env npx tsx

/**
 * Knowledge Base Seeding Script
 * 
 * This script populates the MongoDB Atlas database with knowledge chunks
 * and their corresponding embeddings for the RAG AI assistant.
 * 
 * Usage:
 * 1. Ensure environment variables are set in .env.local
 * 2. Run: npx tsx scripts/seed-knowledge.ts
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import MongoVectorStore from '../services/vectorStore';
import knowledgeBase from '../lib/knowledge-data';

interface SeedOptions {
  clearExisting?: boolean;
  batchSize?: number;
  verbose?: boolean;
}

class KnowledgeSeeder {
  private vectorStore: MongoVectorStore;

  constructor() {
    this.vectorStore = new MongoVectorStore();
  }

  /**
   * Main seeding function
   */
  async seed(options: SeedOptions = {}): Promise<void> {
    const {
      clearExisting = false,
      batchSize = 5,
      verbose = true
    } = options;

    try {
      console.log('🚀 Starting knowledge base seeding...\n');

      // Check environment variables
      await this.checkEnvironment();

      // Clear existing data if requested
      if (clearExisting) {
        await this.clearExistingData();
      }

      // Check if data already exists
      const existingCount = await this.vectorStore.getDocumentCount();
      if (existingCount > 0 && !clearExisting) {
        console.log(`📊 Found ${existingCount} existing documents in knowledge base`);
        const shouldContinue = await this.promptUser('Do you want to add more documents? (y/n): ');
        if (!shouldContinue) {
          console.log('❌ Seeding cancelled');
          return;
        }
      }

      // Process knowledge base in batches
      await this.processKnowledgeInBatches(batchSize, verbose);

      // Verify seeding
      await this.verifySeed();

      console.log('\n✅ Knowledge base seeding completed successfully!');
      console.log('\n📝 Next steps:');
      console.log('1. Verify MongoDB Atlas Vector Search index is created');
      console.log('2. Test the AI assistant at /ask-me');
      console.log('3. Monitor API responses and adjust thresholds if needed');

    } catch (error) {
      console.error('❌ Error during seeding:', error);
      process.exit(1);
    }
  }

  /**
   * Check required environment variables
   */
  private async checkEnvironment(): Promise<void> {
    const required = ['GEMINI_API_KEY', 'MONGODB_CONNECTION_STRING'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:');
      missing.forEach(key => console.error(`   - ${key}`));
      console.error('\nPlease add these to your .env.local file');
      process.exit(1);
    }

    console.log('✅ Environment variables validated');
  }

  /**
   * Clear existing knowledge base
   */
  private async clearExistingData(): Promise<void> {
    console.log('🗑️  Clearing existing knowledge base...');
    const deletedCount = await this.vectorStore.clearAll();
    console.log(`✅ Cleared ${deletedCount} existing documents\n`);
  }

  /**
   * Process knowledge base in batches to avoid rate limiting
   */
  private async processKnowledgeInBatches(batchSize: number, verbose: boolean): Promise<void> {
    console.log(`📚 Processing ${knowledgeBase.length} knowledge chunks in batches of ${batchSize}...\n`);

    for (let i = 0; i < knowledgeBase.length; i += batchSize) {
      const batch = knowledgeBase.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(knowledgeBase.length / batchSize);

      console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);

      if (verbose) {
        batch.forEach((item, index) => {
          console.log(`   ${i + index + 1}. [${item.category}] ${item.content.substring(0, 80)}...`);
        });
      }

      try {
        await this.vectorStore.addDocuments(batch);
        console.log(`✅ Batch ${batchNumber} completed successfully\n`);

        // Add delay between batches to respect rate limits
        if (i + batchSize < knowledgeBase.length) {
          console.log('⏳ Waiting 2 seconds before next batch...\n');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`❌ Error in batch ${batchNumber}:`, error);
        throw error;
      }
    }
  }

  /**
   * Verify the seeding was successful
   */
  private async verifySeed(): Promise<void> {
    console.log('\n🔍 Verifying seeding results...');

    const totalCount = await this.vectorStore.getDocumentCount();
    console.log(`📊 Total documents in knowledge base: ${totalCount}`);

    // Test by category
    const categories = ['personal', 'skills', 'experience', 'projects', 'education', 'contact'];
    
    console.log('\n📋 Documents by category:');
    for (const category of categories) {
      try {
        const chunks = await this.vectorStore.getByCategory(category as any, 5);
        console.log(`   ${category}: ${chunks.length} documents`);
      } catch (error) {
        console.log(`   ${category}: Error retrieving (${error})`);
      }
    }

    if (totalCount !== knowledgeBase.length) {
      console.warn(`⚠️  Warning: Expected ${knowledgeBase.length} documents, but found ${totalCount}`);
    } else {
      console.log('✅ Document count matches expected');
    }
  }

  /**
   * Simple user prompt for CLI interaction
   */
  private async promptUser(question: string): Promise<boolean> {
    // In a real implementation, you might use readline
    // For this script, we'll default to yes for automation
    console.log(question + ' (defaulting to yes for automation)');
    return true;
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  
  const options: SeedOptions = {
    clearExisting: args.includes('--clear'),
    batchSize: 5,
    verbose: !args.includes('--quiet')
  };

  if (args.includes('--help')) {
    console.log(`
Usage: npx tsx scripts/seed-knowledge.ts [options]

Options:
  --clear    Clear existing knowledge base before seeding
  --quiet    Reduce output verbosity
  --help     Show this help message

Examples:
  npx tsx scripts/seed-knowledge.ts
  npx tsx scripts/seed-knowledge.ts --clear
  npx tsx scripts/seed-knowledge.ts --clear --quiet
`);
    return;
  }

  const seeder = new KnowledgeSeeder();
  await seeder.seed(options);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

export default KnowledgeSeeder;