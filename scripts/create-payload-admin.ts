#!/usr/bin/env npx tsx

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import config from '../payload.config';
import { getPayload } from 'payload';

async function createPayloadAdmin() {
  try {
    console.log('🚀 Creating Payload admin user...');
    console.log('PAYLOAD_SECRET exists:', !!process.env.PAYLOAD_SECRET);
    console.log('MONGODB_CONNECTION_STRING exists:', !!process.env.MONGODB_CONNECTION_STRING);
    
    const payload = await getPayload({ config });
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
    
    // Check if admin already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: adminEmail,
        },
      },
    });
    
    if (existingUsers.docs.length > 0) {
      console.log('✅ Admin user already exists');
      console.log('Email:', adminEmail);
      return;
    }
    
    // Create admin user
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
    
    console.log('✅ Payload admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🌐 Access admin at: http://localhost:3000/admin');
    console.log('⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating Payload admin:', error);
  } finally {
    process.exit(0);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createPayloadAdmin();
}