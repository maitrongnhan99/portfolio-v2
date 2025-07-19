#!/usr/bin/env npx tsx

import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

// Load environment
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Import after env is loaded
import KnowledgeChunk from '../models/KnowledgeChunk';

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING!);
    console.log('✅ Connected to MongoDB');
    
    // Get statistics
    const totalCount = await KnowledgeChunk.countDocuments();
    console.log(`\n📊 Total knowledge chunks: ${totalCount}`);
    
    // Count by category
    const categories = ['personal', 'skills', 'experience', 'projects', 'education', 'contact'];
    console.log('\n📂 Chunks by category:');
    for (const category of categories) {
      const count = await KnowledgeChunk.countDocuments({ 'metadata.category': category });
      console.log(`  - ${category}: ${count}`);
    }
    
    // Sample verification
    console.log('\n🔍 Sample chunks:');
    const samples = await KnowledgeChunk.find().limit(3);
    samples.forEach((chunk, i) => {
      console.log(`\n${i + 1}. ${chunk.content.substring(0, 60)}...`);
      console.log(`   Category: ${chunk.metadata.category}`);
      console.log(`   Priority: ${chunk.metadata.priority}`);
      console.log(`   Tags: ${chunk.metadata.tags.join(', ')}`);
      console.log(`   Embedding size: ${chunk.embedding.length} dimensions`);
    });
    
    await mongoose.connection.close();
    console.log('\n✅ Verification complete');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verify();