#!/usr/bin/env npx tsx

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import config from '../payload.config';
import { getPayload } from 'payload';

async function clearAdminUsers() {
  try {
    console.log('🧹 Clearing all admin users...');
    console.log('PAYLOAD_SECRET exists:', !!process.env.PAYLOAD_SECRET);
    console.log('MONGODB_CONNECTION_STRING exists:', !!process.env.MONGODB_CONNECTION_STRING);
    
    const payload = await getPayload({ config });
    
    // Find all users
    const allUsers = await payload.find({
      collection: 'users',
      limit: 1000, // Set a high limit to get all users
    });
    
    console.log(`📊 Found ${allUsers.docs.length} users to delete`);
    
    if (allUsers.docs.length === 0) {
      console.log('✅ No users found to delete');
      return;
    }
    
    // Delete all users
    let deletedCount = 0;
    for (const user of allUsers.docs) {
      try {
        await payload.delete({
          collection: 'users',
          id: user.id,
        });
        deletedCount++;
        console.log(`🗑️  Deleted user: ${user.email} (${user.firstName} ${user.lastName})`);
      } catch (error) {
        console.error(`❌ Failed to delete user ${user.email}:`, error);
      }
    }
    
    console.log(`✅ Successfully deleted ${deletedCount} out of ${allUsers.docs.length} users`);
    console.log('🔄 You can now create a new admin user using:');
    console.log('   npx tsx scripts/create-payload-admin.ts');
    console.log('   or');
    console.log('   pnpm tsx scripts/create-payload-admin.ts');
    
  } catch (error) {
    console.error('❌ Error clearing admin users:', error);
  } finally {
    process.exit(0);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  clearAdminUsers();
}