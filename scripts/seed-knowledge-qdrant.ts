#!/usr/bin/env tsx

import { getQdrantVectorStore } from '../services/qdrant-vector-store';
import { loadStaticKnowledge } from '../lib/knowledge/markdown-loader';
import { syncStaticKnowledge } from '../lib/knowledge/sync';
import { fetchProjectsKnowledge, getProjectKnowledgeStats } from '../lib/project-knowledge-fetcher';

const PROJECT_KIND_FILTER = {
  must: [{ key: 'metadata.kind', match: { value: 'project' } }],
};

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
 * Incrementally sync the hand-authored static knowledge (Markdown -> Qdrant).
 * Only new/changed chunks are embedded; removed chunks are pruned.
 */
async function syncStatic() {
  console.log('\n4️⃣ Syncing static knowledge (incremental)...');
  const vectorStore = getQdrantVectorStore();
  const report = await syncStaticKnowledge(vectorStore);
  console.log(
    `✅ Static sync: ${report.created} new, ${report.changed} changed, ` +
    `${report.unchanged} unchanged, ${report.deleted} pruned ` +
    `(${report.embedded} embedded of ${report.total} total)`
  );
  return report;
}

/**
 * Refresh project knowledge. Project points are replaced wholesale, but scoped
 * to `metadata.kind = "project"` so the static knowledge is never touched.
 */
async function seedProjects(projectsOnly: boolean): Promise<boolean> {
  console.log('\n5️⃣ Fetching and processing project knowledge...');
  const vectorStore = getQdrantVectorStore();
  const projectResult = await fetchProjectsKnowledge();

  if (!projectResult.success) {
    console.warn('⚠️ Project knowledge fetch issues:');
    projectResult.errors.forEach(error => console.warn(`   - ${error}`));
    if (projectsOnly) {
      throw new Error('Projects-only mode failed: No project knowledge available');
    }
    console.log('📝 Continuing without refreshing project knowledge...');
    return false;
  }

  console.log(`📚 Processed ${projectResult.projectCount} projects from ${projectResult.source}`);

  // Replace only project points, leaving static knowledge intact.
  console.log('🗑️ Clearing existing project points...');
  await vectorStore.deleteByFilter(PROJECT_KIND_FILTER);

  const documentsToAdd = projectResult.chunks.map(item => ({
    content: item.content,
    metadata: {
      category: item.category,
      priority: item.priority,
      tags: item.tags,
      source: item.source,
      kind: 'project' as const,
      projectSlug: item.projectSlug,
      projectCategory: item.projectCategory,
      dataSource: item.dataSource,
    },
  }));

  await vectorStore.addDocuments(documentsToAdd);
  console.log(`✅ Added ${documentsToAdd.length} project knowledge chunks`);
  return true;
}

/**
 * Seed script: incremental static sync + project refresh.
 */
async function seedQdrantKnowledgeDatabase(options: { staticOnly?: boolean; projectsOnly?: boolean } = {}) {
  console.log('🌱 Seeding Enhanced Qdrant Knowledge Database...\n');
  let exitCode = 0;

  try {
    console.log('0️⃣ Validating environment...');
    validateEnvironment();

    console.log('1️⃣ Initializing Qdrant vector store...');
    const vectorStore = getQdrantVectorStore();
    await vectorStore.initialize();
    console.log('✅ Qdrant vector store initialized successfully');

    console.log('\n2️⃣ Checking project knowledge availability...');
    const projectStats = await getProjectKnowledgeStats();
    const staticChunks = loadStaticKnowledge();
    console.log(`📊 Project Stats: ${projectStats.publishedProjects} published projects from ${projectStats.dataSource}`);
    console.log(`📈 Estimated total knowledge chunks: ${staticChunks.length + projectStats.estimatedChunks}`);

    if (!options.projectsOnly) {
      await syncStatic();
    } else {
      console.log('\n4️⃣ Skipping static knowledge (projects-only mode)');
    }

    if (!options.staticOnly) {
      await seedProjects(Boolean(options.projectsOnly));
    } else {
      console.log('\n5️⃣ Skipping project knowledge (static-only mode)');
    }

    console.log('\n7️⃣ Verifying inserted data...');
    const totalCount = await vectorStore.getDocumentCount();
    console.log(`📊 Total documents in Qdrant: ${totalCount}`);

    console.log('\n8️⃣ Collection information:');
    const collectionInfo = await vectorStore.getCollectionInfo();
    console.log(`   Collection: ${collectionInfo.config?.params?.vectors?.size || 'unknown'} dimensions`);
    console.log(`   Distance: ${collectionInfo.config?.params?.vectors?.distance || 'unknown'}`);
    console.log(`   Points: ${collectionInfo.points_count || 0}`);

    console.log('\n9️⃣ Testing similarity searches...');

    const skillQuery = "What are Mai's skills?";
    const skillResults = await vectorStore.similaritySearch(skillQuery, 2);
    console.log(`\n   Query 1: "${skillQuery}"`);
    console.log(`   Results: ${skillResults.length} documents found`);
    skillResults.forEach((result, index) => {
      console.log(`   ${index + 1}. Score: ${result.score.toFixed(4)} | Category: ${result.metadata.category}`);
      console.log(`      Kind: ${result.metadata.kind} | Content: ${result.content.substring(0, 80)}...`);
    });

    const projectQuery = "Tell me about Mai's projects";
    const projectResults = await vectorStore.similaritySearch(projectQuery, 2);
    console.log(`\n   Query 2: "${projectQuery}"`);
    console.log(`   Results: ${projectResults.length} documents found`);
    projectResults.forEach((result, index) => {
      console.log(`   ${index + 1}. Score: ${result.score.toFixed(4)} | Category: ${result.metadata.category}`);
      console.log(`      Kind: ${result.metadata.kind} | Project: ${result.metadata.projectSlug || 'N/A'}`);
      console.log(`      Content: ${result.content.substring(0, 80)}...`);
    });

    console.log('\n🎉 Qdrant knowledge database seeding completed successfully!');
    console.log('💡 All documents are now embedded and ready for vector search!');

  } catch (error) {
    exitCode = 1;
    console.error('❌ Seeding failed:', error);
    console.error('🔍 Error details:', error instanceof Error ? error.message : 'Unknown error');

    console.log('\n🛠️ Troubleshooting tips:');
    console.log('   - Check your environment variables (.env.local)');
    console.log('   - Verify Qdrant service is running and accessible');
    console.log('   - Ensure PayloadCMS database is accessible');
    console.log('   - Check network connectivity for OpenAI API');
  } finally {
    try {
      console.log('\n🧹 Cleaning up resources...');
      await getQdrantVectorStore().cleanup();
      console.log('✅ Resource cleanup completed');
    } catch (cleanupError) {
      console.error('⚠️ Cleanup error (non-critical):', cleanupError);
    }

    process.exit(exitCode);
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
  seedQdrantKnowledgeDatabase({ staticOnly, projectsOnly });
}

/**
 * Dry run to analyze knowledge without seeding (no embeddings, no writes).
 */
async function dryRunKnowledgeAnalysis() {
  console.log('📊 Analyzing knowledge sources...\n');

  // Static knowledge analysis (pure, no connection required).
  const staticChunks = loadStaticKnowledge();
  console.log('📚 Static Knowledge Analysis:');
  console.log(`   Total static chunks: ${staticChunks.length}`);

  const staticCategories = staticChunks.reduce((acc, chunk) => {
    acc[chunk.category] = (acc[chunk.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(staticCategories).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} chunks`);
  });

  // Live incremental diff against Qdrant (read-only). Degrades gracefully if the
  // vector store is unreachable so static/project analysis still runs.
  console.log('\n🔄 Static sync plan (vs. current Qdrant state):');
  try {
    const report = await syncStaticKnowledge(getQdrantVectorStore(), { dryRun: true });
    console.log(
      `   ${report.created} new, ${report.changed} changed, ` +
      `${report.unchanged} unchanged, ${report.deleted} would be pruned`
    );
  } catch (error) {
    console.warn(`   ⚠️ Could not compute live diff: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Project knowledge analysis.
  console.log('\n🏗️ Project Knowledge Analysis:');
  const projectStats = await getProjectKnowledgeStats();
  console.log(`   Data source: ${projectStats.dataSource}`);
  console.log(`   Total projects: ${projectStats.totalProjects}`);
  console.log(`   Published projects: ${projectStats.publishedProjects}`);
  console.log(`   Estimated chunks: ${projectStats.estimatedChunks}`);

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

  const totalEstimated = staticChunks.length + (projectResult.success ? projectResult.chunkCount : 0);
  console.log(`\n📈 Total estimated knowledge chunks: ${totalEstimated}`);
}
