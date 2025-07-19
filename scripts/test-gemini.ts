import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function testGemini() {
  console.log('Testing Gemini API...');
  console.log('API Key:', GEMINI_API_KEY?.substring(0, 10) + '...' + GEMINI_API_KEY?.slice(-4));
  
  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    process.exit(1);
  }
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Test text generation
    console.log('Testing text generation...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say "Hello from Gemini!" in exactly 3 words.');
    const response = await result.response;
    console.log('✅ Generated text:', response.text());
    
    // Test embedding
    console.log('Testing embedding generation...');
    const embeddingModel = genAI.getGenerativeModel({ model: 'embedding-001' });
    const embeddingResult = await embeddingModel.embedContent('Test embedding');
    console.log('✅ Generated embedding with', embeddingResult.embedding.values.length, 'dimensions');
    
    // Test streaming
    console.log('Testing streaming...');
    const streamResult = await model.generateContentStream('Count from 1 to 3');
    let streamedText = '';
    for await (const chunk of streamResult.stream) {
      streamedText += chunk.text();
    }
    console.log('✅ Streamed response:', streamedText.trim());
    
    console.log('✅ All Gemini API tests passed!');
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', error);
    process.exit(1);
  }
}

testGemini();