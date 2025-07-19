import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testChatAPI() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('Testing Chat API...');
  console.log('MongoDB:', process.env.MONGODB_CONNECTION_STRING ? '✅ Configured' : '❌ Not found');
  console.log('Gemini:', process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not found');
  console.log('');
  
  try {
    console.log('Sending test message to chat API...');
    const response = await fetch(`${baseUrl}/api/ai-assistant/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'What is Mai\'s primary programming language?',
        stream: false
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Chat API Response:', data.response);
    
    if (data.sources) {
      console.log('✅ Sources found:', data.sources.length);
      data.sources.forEach((source: any, index: number) => {
        console.log(`  ${index + 1}. [${source.category}] ${source.content.substring(0, 50)}...`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\nMake sure the development server is running: pnpm run dev');
  }
}

testChatAPI();