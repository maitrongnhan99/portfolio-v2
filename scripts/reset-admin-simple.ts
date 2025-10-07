#!/usr/bin/env npx tsx

// Set environment variables directly to avoid loading issues
process.env.PAYLOAD_SECRET = "Pqrp2IvedEpjTPGPiE7RSd3Wki8NgtYlm7GJ3QpJjYL";
process.env.MONGODB_CONNECTION_STRING = "mongodb://localhost:27017/portfolio";
process.env.NEXT_PUBLIC_SERVER_URL = "http://localhost:3000";
process.env.SERVER_URL = "http://localhost:3000";

import config from '../payload.config';
import { getPayload } from 'payload';

async function resetAdminSimple() {
  try {
    console.log('🔄 Resetting admin configuration (Simple Version)...');
    console.log('PAYLOAD_SECRET set:', !!process.env.PAYLOAD_SECRET);
    console.log('MONGODB_CONNECTION_STRING set:', !!process.env.MONGODB_CONNECTION_STRING);
    
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
    
    const adminEmail = 'mainhan.nm30@gmail.com';
    const adminPassword = 'maitrongnhan99';
    
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
  resetAdminSimple();
}