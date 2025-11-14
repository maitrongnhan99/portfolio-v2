import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

interface LexicalTextNode {
  detail: number;
  format: number;
  mode: string;
  style: string;
  text: string;
  type: string;
  version: number;
}

interface LexicalParagraphNode {
  children: LexicalTextNode[];
  direction: string;
  format: string;
  indent: number;
  type: string;
  version: number;
}

interface LexicalRootNode {
  children: LexicalParagraphNode[];
  direction: string;
  format: string;
  indent: number;
  type: string;
  version: number;
}

interface LexicalDocument {
  root: LexicalRootNode;
}

function convertTextToLexical(text: string): LexicalDocument {
  if (!text || text.trim() === '') {
    return {
      root: {
        children: [],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1
      }
    };
  }

  // Split text by double line breaks to create paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim() !== '');
  
  const lexicalParagraphs: LexicalParagraphNode[] = paragraphs.map(paragraph => {
    // Clean up the paragraph text but preserve single line breaks
    const cleanText = paragraph.trim().replace(/\n/g, ' ');
    
    return {
      children: [{
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text: cleanText,
        type: 'text',
        version: 1
      }],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'paragraph',
      version: 1
    };
  });

  return {
    root: {
      children: lexicalParagraphs,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1
    }
  };
}

async function migrateChallengesData() {
  try {
    console.log('Connected to database');

    // Get all projects with challenge data
    const result = await sql`
      SELECT id, challenges FROM projects WHERE challenges IS NOT NULL AND challenges != ''
    `;

    console.log(`Found ${result.rows.length} projects with challenge data to convert`);

    for (const row of result.rows) {
      const { id, challenges } = row;
      console.log(`Converting project ${id}...`);
      
      // Convert text to Lexical format
      const lexicalData = convertTextToLexical(challenges);
      
      // Update the project with converted data
      await sql`
        UPDATE projects SET challenges = ${JSON.stringify(lexicalData)} WHERE id = ${id}
      `;
      
      console.log(`✅ Converted project ${id}`);
    }

    // Also handle version table if it exists and has data
    const versionResult = await sql`
      SELECT id, version_challenges FROM _projects_v WHERE version_challenges IS NOT NULL AND version_challenges != ''
    `;

    console.log(`Found ${versionResult.rows.length} project versions with challenge data to convert`);

    for (const row of versionResult.rows) {
      const { id, version_challenges } = row;
      console.log(`Converting project version ${id}...`);
      
      // Convert text to Lexical format
      const lexicalData = convertTextToLexical(version_challenges);
      
      // Update the project version with converted data
      await sql`
        UPDATE _projects_v SET version_challenges = ${JSON.stringify(lexicalData)} WHERE id = ${id}
      `;
      
      console.log(`✅ Converted project version ${id}`);
    }

    console.log('✅ All challenge data converted successfully!');

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

// Run the migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateChallengesData()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { migrateChallengesData, convertTextToLexical };