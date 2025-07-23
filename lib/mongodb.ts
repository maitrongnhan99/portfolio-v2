import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<typeof mongoose> {
  const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
  
  if (!MONGODB_CONNECTION_STRING) {
    throw new Error('Please define the MONGODB_CONNECTION_STRING environment variable inside .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // MongoDB Atlas connection options
      retryWrites: true,
      w: 'majority' as const,
      // Timeouts
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      // Connection pool
      maxPoolSize: 10,
      minPoolSize: 5,
    };

    cached.promise = mongoose.connect(MONGODB_CONNECTION_STRING, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      console.log(`📍 Database: ${mongoose.connection.db?.databaseName}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;