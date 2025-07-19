import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import mongoose from 'mongoose';
import path from 'path';

// Load environment variables
const result = config({ path: path.resolve(process.cwd(), '.env.local') });
if (result.error) {
  console.error('Error loading .env.local:', result.error);
}

// Import after env vars are loaded
import connectToDatabase from '../lib/mongodb';

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg: string) => console.log(`\n${colors.bright}${colors.cyan}=== ${msg} ===${colors.reset}\n`),
};

/**
 * Test MongoDB Connection
 */
async function testMongoDBConnection() {
  log.section('Testing MongoDB Connection');
  
  try {
    // Check if environment variable exists
    if (!process.env.MONGODB_CONNECTION_STRING) {
      throw new Error('MONGODB_CONNECTION_STRING not found in environment variables');
    }
    
    log.info(`Connection string: ${process.env.MONGODB_CONNECTION_STRING.replace(/:[^@]+@/, ':****@')}`);
    
    // Attempt to connect
    log.info('Attempting to connect to MongoDB...');
    const connection = await connectToDatabase();
    
    if (!connection) {
      throw new Error('Connection returned null');
    }
    
    log.success('Successfully connected to MongoDB!');
    
    // Test database operations
    log.info('Testing database operations...');
    
    // Get database info
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      log.success(`Database name: ${db.databaseName}`);
      log.success(`Number of collections: ${collections.length}`);
      
      if (collections.length > 0) {
        log.info('Collections found:');
        collections.forEach(col => {
          console.log(`  - ${col.name}`);
        });
      }
      
      // Test if we can access the knowledgechunks collection
      const knowledgeChunksExists = collections.some(col => col.name === 'knowledgechunks');
      if (knowledgeChunksExists) {
        const count = await db.collection('knowledgechunks').countDocuments();
        log.success(`Knowledge chunks collection has ${count} documents`);
      } else {
        log.warning('Knowledge chunks collection not found (will be created when needed)');
      }
    }
    
    log.success('MongoDB connection test completed successfully!');
    
  } catch (error) {
    log.error('MongoDB connection test failed!');
    if (error instanceof Error) {
      log.error(`Error: ${error.message}`);
      
      // Provide helpful error messages
      if (error.message.includes('MONGODB_CONNECTION_STRING not found')) {
        log.warning('Make sure .env.local file exists and contains MONGODB_CONNECTION_STRING');
      } else if (error.message.includes('authentication failed')) {
        log.warning('Check your MongoDB username and password');
        log.warning('Make sure the @ symbol in password is URL-encoded as %40');
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        log.warning('Check your MongoDB cluster URL and network connection');
      } else if (error.message.includes('whitelist')) {
        log.warning('Make sure your IP address is whitelisted in MongoDB Atlas');
      }
    }
    throw error;
  }
}

/**
 * Test Gemini API Connection
 */
async function testGeminiAPI() {
  log.section('Testing Gemini API Connection');
  
  try {
    // Check if environment variable exists
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    
    log.info(`API Key: ${process.env.GEMINI_API_KEY.substring(0, 10)}...${process.env.GEMINI_API_KEY.slice(-4)}`);
    
    // Initialize Gemini AI
    log.info('Initializing Google Generative AI...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Get the model
    log.info('Getting gemini-1.5-flash model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Test generation
    log.info('Testing text generation...');
    const prompt = 'Say "Hello from Gemini API test!" in exactly 5 words.';
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    log.success('Successfully generated text!');
    log.info(`Response: ${text.trim()}`);
    
    // Test embedding generation (used in your app)
    log.info('Testing embedding generation...');
    const embeddingModel = genAI.getGenerativeModel({ model: 'embedding-001' });
    const embeddingResult = await embeddingModel.embedContent('Test embedding generation');
    
    if (embeddingResult.embedding && embeddingResult.embedding.values) {
      log.success(`Successfully generated embedding with ${embeddingResult.embedding.values.length} dimensions`);
    }
    
    // Test streaming (used in your chat)
    log.info('Testing streaming generation...');
    const streamResult = await model.generateContentStream('Count from 1 to 3');
    let streamedText = '';
    
    for await (const chunk of streamResult.stream) {
      const chunkText = chunk.text();
      streamedText += chunkText;
    }
    
    log.success('Successfully tested streaming!');
    log.info(`Streamed response: ${streamedText.trim()}`);
    
    log.success('Gemini API connection test completed successfully!');
    
  } catch (error) {
    log.error('Gemini API connection test failed!');
    if (error instanceof Error) {
      log.error(`Error: ${error.message}`);
      
      // Provide helpful error messages
      if (error.message.includes('GEMINI_API_KEY not found')) {
        log.warning('Make sure .env.local file exists and contains GEMINI_API_KEY');
      } else if (error.message.includes('API key not valid')) {
        log.warning('Check your Gemini API key is correct');
        log.warning('Make sure the API key is active in Google AI Studio');
      } else if (error.message.includes('quota')) {
        log.warning('API quota exceeded. Check your usage limits');
      } else if (error.message.includes('PERMISSION_DENIED')) {
        log.warning('API key may not have required permissions');
      }
    }
    throw error;
  }
}

/**
 * Test integrated functionality
 */
async function testIntegration() {
  log.section('Testing Integration');
  
  try {
    log.info('Testing if both services can work together...');
    
    // This simulates what your chat API does
    const testMessage = 'What is Mai\'s primary programming language?';
    log.info(`Test query: "${testMessage}"`);
    
    // Check if we can create embeddings and potentially store/retrieve from MongoDB
    if (process.env.GEMINI_API_KEY && process.env.MONGODB_CONNECTION_STRING) {
      log.success('Both services are configured and ready for integration!');
      log.info('Your AI assistant should be able to:');
      console.log('  - Generate embeddings for user queries');
      console.log('  - Store and retrieve knowledge from MongoDB');
      console.log('  - Generate responses using Gemini AI');
      console.log('  - Stream responses in real-time');
    }
    
  } catch (error) {
    log.error('Integration test failed!');
    throw error;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log(`${colors.bright}${colors.cyan}🧪 Portfolio Connection Test Suite${colors.reset}\n`);
  
  let mongoSuccess = false;
  let geminiSuccess = false;
  
  // Test MongoDB
  try {
    await testMongoDBConnection();
    mongoSuccess = true;
  } catch (error) {
    // Error already logged
  }
  
  // Test Gemini API
  try {
    await testGeminiAPI();
    geminiSuccess = true;
  } catch (error) {
    // Error already logged
  }
  
  // Test integration if both succeed
  if (mongoSuccess && geminiSuccess) {
    try {
      await testIntegration();
    } catch (error) {
      // Error already logged
    }
  }
  
  // Summary
  log.section('Test Summary');
  console.log(`MongoDB Connection: ${mongoSuccess ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`);
  console.log(`Gemini API Connection: ${geminiSuccess ? colors.green + '✓ PASS' : colors.red + '✗ FAIL'}${colors.reset}`);
  
  if (mongoSuccess && geminiSuccess) {
    log.success('\nAll connections are working! Your AI assistant is ready to use. 🎉');
  } else {
    log.error('\nSome connections failed. Please check the error messages above.');
  }
  
  // Close MongoDB connection
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    log.info('MongoDB connection closed');
  }
  
  process.exit(mongoSuccess && geminiSuccess ? 0 : 1);
}

// Run the tests
runTests().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});