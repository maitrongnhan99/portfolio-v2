import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

async function testMongoDB() {
  console.log('Testing MongoDB connection...');
  console.log('Connection string:', MONGODB_CONNECTION_STRING?.replace(/:[^@]+@/, ':****@'));
  
  if (!MONGODB_CONNECTION_STRING) {
    console.error('❌ MONGODB_CONNECTION_STRING not found in environment variables');
    process.exit(1);
  }
  
  try {
    await mongoose.connect(MONGODB_CONNECTION_STRING);
    console.log('✅ Successfully connected to MongoDB!');
    
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      console.log(`✅ Database name: ${db.databaseName}`);
      console.log(`✅ Number of collections: ${collections.length}`);
      
      if (collections.length > 0) {
        console.log('Collections:');
        collections.forEach(col => {
          console.log(`  - ${col.name}`);
        });
      }
    }
    
    await mongoose.connection.close();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

testMongoDB();