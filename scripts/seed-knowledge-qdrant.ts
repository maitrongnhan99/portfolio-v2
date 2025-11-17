#!/usr/bin/env tsx

import { getQdrantVectorStore } from '../services/qdrant-vector-store';
import { knowledgeBase } from '../lib/knowledge-data';
import { fetchProjectsKnowledge, getProjectKnowledgeStats } from '../lib/project-knowledge-fetcher';
import type { KnowledgeChunkData } from '../lib/knowledge-data';

/**
 * Validate required environment variables
 */
function validateEnvironment() {
  const required = [
    'OPENAI_API_KEY',
    'QDRANT_URL',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // Validate OPENAI_API_KEY format
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && !apiKey.startsWith('sk-')) {
    console.warn('⚠️ OPENAI_API_KEY may not be in the expected format');
  }
  
  console.log('✅ Environment validation passed');
}

/**
 * Enhanced seed script to populate the Qdrant vector database with both static and project knowledge
 */
async function seedQdrantKnowledgeDatabase(options: { staticOnly?: boolean; projectsOnly?: boolean } = {}) {
  console.log('🌱 Seeding Enhanced Qdrant Knowledge Database...\n');

  try {
    // Validate environment variables
    console.log('0️⃣ Validating environment...');
    validateEnvironment();

    // Initialize Qdrant vector store
    console.log('1️⃣ Initializing Qdrant vector store...');
    const vectorStore = getQdrantVectorStore();
    await vectorStore.getVectorStore(); // This will initialize the connection
    console.log('✅ Qdrant vector store initialized successfully');

    // Get project knowledge statistics
    console.log('\n2️⃣ Checking project knowledge availability...');
    const projectStats = await getProjectKnowledgeStats();
    console.log(`📊 Project Stats: ${projectStats.publishedProjects} published projects from ${projectStats.dataSource}`);
    console.log(`📈 Estimated total knowledge chunks: ${knowledgeBase.length + projectStats.estimatedChunks}`);

    // Clear existing data
    console.log('\n3️⃣ Clearing existing knowledge data...');
    const deletedCount = await vectorStore.clearAll();
    console.log(`🗑️ Removed ${deletedCount} existing documents`);

    // Prepare all knowledge chunks
    const allKnowledgeChunks: KnowledgeChunkData[] = [];

    // Add static knowledge base (unless projects-only)
    if (!options.projectsOnly) {
      console.log('\n4️⃣ Processing static knowledge base...');
      const staticChunks = knowledgeBase.map(item => ({
        ...item,
        dataSource: 'static' as const,
        lastUpdated: new Date().toISOString(),
      }));
      allKnowledgeChunks.push(...staticChunks);
      console.log(`✅ Added ${staticChunks.length} static knowledge chunks`);
    } else {
      console.log('\n4️⃣ Skipping static knowledge (projects-only mode)');
    }

    // Add project knowledge (unless static-only)
    if (!options.staticOnly) {
      console.log('\n5️⃣ Fetching and processing project knowledge...');
      const projectResult = await fetchProjectsKnowledge();
      
      if (projectResult.success) {
        allKnowledgeChunks.push(...projectResult.chunks);
        console.log(`✅ Added ${projectResult.chunks.length} project knowledge chunks`);
        console.log(`📚 Processed ${projectResult.projectCount} projects from ${projectResult.source}`);
      } else {
        console.warn('⚠️ Project knowledge fetch issues:');
        projectResult.errors.forEach(error => console.warn(`   - ${error}`));
        if (options.projectsOnly) {
          throw new Error('Projects-only mode failed: No project knowledge available');
        }
        console.log('📝 Continuing with static knowledge only...');
      }
    } else {
      console.log('\n5️⃣ Skipping project knowledge (static-only mode)');
    }

    // Validate that we have some knowledge to add
    if (allKnowledgeChunks.length === 0) {
      throw new Error('No knowledge chunks to add to the database');
    }

    // Convert to vector store format
    console.log('\n6️⃣ Adding all documents to Qdrant vector store...');
    
    const documentsToAdd = allKnowledgeChunks.map(item => ({
      content: item.content,
      metadata: {
        category: item.category,
        priority: item.priority,
        tags: item.tags,
        source: item.source,
        projectSlug: item.projectSlug,
        projectCategory: item.projectCategory,
        dataSource: item.dataSource,
        lastUpdated: item.lastUpdated,
      }
    }));

    await vectorStore.addDocuments(documentsToAdd);
    console.log(`✅ Successfully added ${documentsToAdd.length} total documents to Qdrant`);
    
    // Log summary
    const staticCount = documentsToAdd.filter(d => d.metadata.dataSource === 'static').length;
    const projectCount = documentsToAdd.filter(d => d.metadata.dataSource === 'payload-cms').length;
    console.log(`📋 Summary: ${staticCount} static + ${projectCount} project = ${documentsToAdd.length} total chunks`);

    // Verify data
    console.log('\n7️⃣ Verifying inserted data...');
    const totalCount = await vectorStore.getDocumentCount();
    console.log(`📊 Total documents in Qdrant: ${totalCount}`);

    // Get collection info
    console.log('\n8️⃣ Collection information:');
    const collectionInfo = await vectorStore.getCollectionInfo();
    console.log(`   Collection: ${collectionInfo.config?.params?.vectors?.size || 'unknown'} dimensions`);
    console.log(`   Distance: ${collectionInfo.config?.params?.vectors?.distance || 'unknown'}`);
    console.log(`   Points: ${collectionInfo.points_count || 0}`);

    // Test similarity search for different types of content
    console.log('\n9️⃣ Testing similarity searches...');
    
    // Test 1: Personal skills
    const skillQuery = "What are Mai's skills?";
    const skillResults = await vectorStore.similaritySearch(skillQuery, 2);
    console.log(`\n   Query 1: "${skillQuery}"`);
    console.log(`   Results: ${skillResults.length} documents found`);
    skillResults.forEach((result, index) => {
      console.log(`   ${index + 1}. Score: ${result.score.toFixed(4)} | Category: ${result.metadata.category}`);
      console.log(`      Source: ${result.metadata.dataSource} | Content: ${result.content.substring(0, 80)}...`);
    });

    // Test 2: Project knowledge
    const projectQuery = "Tell me about Mai's projects";
    const projectResults = await vectorStore.similaritySearch(projectQuery, 2);
    console.log(`\n   Query 2: "${projectQuery}"`);
    console.log(`   Results: ${projectResults.length} documents found`);
    projectResults.forEach((result, index) => {
      console.log(`   ${index + 1}. Score: ${result.score.toFixed(4)} | Category: ${result.metadata.category}`);
      console.log(`      Source: ${result.metadata.dataSource} | Project: ${result.metadata.projectSlug || 'N/A'}`);
      console.log(`      Content: ${result.content.substring(0, 80)}...`);
    });

    console.log('\n🎉 Qdrant knowledge database seeding completed successfully!');
    console.log('💡 All documents are now embedded and ready for vector search!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    console.error('🔍 Error details:', error instanceof Error ? error.message : 'Unknown error');
    
    // Log troubleshooting tips
    console.log('\n🛠️ Troubleshooting tips:');
    console.log('   - Check your environment variables (.env.local)');
    console.log('   - Verify Qdrant service is running and accessible');
    console.log('   - Ensure PayloadCMS database is accessible');
    console.log('   - Check network connectivity for OpenAI API');
    
    process.exit(1);
  } finally {
    // Clean up resources
    try {
      console.log('\n🧹 Cleaning up resources...');
      const vectorStore = getQdrantVectorStore();
      await vectorStore.cleanup();
      console.log('✅ Resource cleanup completed');
    } catch (cleanupError) {
      console.error('⚠️ Cleanup error (non-critical):', cleanupError);
    }
    
    process.exit(0);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const shouldClear = args.includes('--clear');
const staticOnly = args.includes('--static-only');
const projectsOnly = args.includes('--projects-only');
const dryRun = args.includes('--dry-run');

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
} else if (dryRun) {
  console.log('🧪 Dry run mode: analyzing knowledge without seeding\n');
  
  dryRunKnowledgeAnalysis()
    .then(() => {
      console.log('\n✅ Dry run completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Dry run failed:', error);
      process.exit(1);
    });
} else {
  // Run the seeding with options
  const options = {
    staticOnly,
    projectsOnly,
  };
  
  seedQdrantKnowledgeDatabase(options);
}

/**
 * Dry run to analyze knowledge without seeding
 */
async function dryRunKnowledgeAnalysis() {
  console.log('📊 Analyzing knowledge sources...\n');
  
  try {
    // Analyze static knowledge
    console.log('📚 Static Knowledge Analysis:');
    console.log(`   Total static chunks: ${knowledgeBase.length}`);
    
    const staticCategories = knowledgeBase.reduce((acc, chunk) => {
      acc[chunk.category] = (acc[chunk.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(staticCategories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} chunks`);
    });
    
    // Analyze project knowledge
    console.log('\n🏗️ Project Knowledge Analysis:');
    const projectStats = await getProjectKnowledgeStats();
    console.log(`   Data source: ${projectStats.dataSource}`);
    console.log(`   Total projects: ${projectStats.totalProjects}`);
    console.log(`   Published projects: ${projectStats.publishedProjects}`);
    console.log(`   Estimated chunks: ${projectStats.estimatedChunks}`);
    
    // Test fetch without processing
    console.log('\n🔍 Testing project knowledge fetch...');
    const projectResult = await fetchProjectsKnowledge();
    if (projectResult.success) {
      console.log(`   ✅ Successfully processed ${projectResult.projectCount} projects`);
      console.log(`   📋 Generated ${projectResult.chunkCount} knowledge chunks`);
      
      const projectCategories = projectResult.chunks.reduce((acc, chunk) => {
        acc[chunk.category] = (acc[chunk.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('   Project chunk categories:');
      Object.entries(projectCategories).forEach(([category, count]) => {
        console.log(`     ${category}: ${count} chunks`);
      });
      
    } else {
      console.log('   ❌ Project knowledge fetch failed:');
      projectResult.errors.forEach(error => console.log(`     - ${error}`));
    }
    
    // Total summary
    const totalEstimated = knowledgeBase.length + (projectResult.success ? projectResult.chunkCount : 0);
    console.log(`\n📈 Total estimated knowledge chunks: ${totalEstimated}`);
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    throw error;
  }
}