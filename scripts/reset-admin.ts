#!/usr/bin/env npx tsx

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from multiple sources
const envPaths = [
  path.join(process.cwd(), '.env.local'),
  path.join(process.cwd(), '.env'),
];

envPaths.forEach(envPath => {
  dotenv.config({ path: envPath, override: false });
});

// Debug: Show what we loaded
console.log('Environment loading debug:');
console.log('- Current working directory:', process.cwd());
console.log('- Looking for .env files at:', envPaths);
console.log('- PAYLOAD_SECRET found:', !!process.env.PAYLOAD_SECRET);
console.log('- MONGODB_CONNECTION_STRING found:', !!process.env.MONGODB_CONNECTION_STRING);

import config from '../payload.config';
import { getPayload } from 'payload';

async function resetAdmin() {
  try {
    console.log('🔄 Resetting admin configuration...');
    console.log('PAYLOAD_SECRET exists:', !!process.env.PAYLOAD_SECRET);
    console.log('PAYLOAD_SECRET length:', process.env.PAYLOAD_SECRET?.length || 0);
    console.log('MONGODB_CONNECTION_STRING exists:', !!process.env.MONGODB_CONNECTION_STRING);
    
    // Ensure we have the required environment variables
    if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 32) {
      console.error('❌ PAYLOAD_SECRET is missing or too short (must be at least 32 characters)');
      console.log('Current PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET || 'undefined');
      process.exit(1);
    }
    
    if (!process.env.MONGODB_CONNECTION_STRING) {
      console.error('❌ MONGODB_CONNECTION_STRING is missing');
      process.exit(1);
    }
    
    const payload = await getPayload({ config });
    
    // Step 1: Clear all existing users
    console.log('\n🧹 Step 1: Clearing existing users...');
    const allUsers = await payload.find({
      collection: 'users',
      limit: 1000,
    });
    
    console.log(`📊 Found ${allUsers.docs.length} users to delete`);
    
    let deletedCount = 0;
    for (const user of allUsers.docs) {
      try {
        await payload.delete({
          collection: 'users',
          id: user.id,
        });
        deletedCount++;
        console.log(`🗑️  Deleted user: ${user.email}`);
      } catch (error) {
        console.error(`❌ Failed to delete user ${user.email}:`, error);
      }
    }
    
    console.log(`✅ Deleted ${deletedCount} users`);
    
    // Step 2: Create new admin user
    console.log('\n👤 Step 2: Creating new admin user...');
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
    
    const admin = await payload.create({
      collection: 'users',
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      },
    });
    
    console.log('\n🎉 Admin reset completed successfully!');
    console.log('═══════════════════════════════════');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🌐 Admin URL: http://localhost:3000/admin');
    console.log('═══════════════════════════════════');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error resetting admin:', error);
  } finally {
    process.exit(0);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  resetAdmin();
}