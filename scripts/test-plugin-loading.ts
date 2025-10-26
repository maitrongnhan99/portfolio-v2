#!/usr/bin/env tsx

// Test if Vercel Blob plugin is properly configured
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

console.log("🔧 Environment Variables Check:");
console.log(`- BLOB_READ_WRITE_TOKEN: ${process.env.BLOB_READ_WRITE_TOKEN ? "✅ Set (" + process.env.BLOB_READ_WRITE_TOKEN.substring(0, 10) + "...)" : "❌ Missing"}`);
console.log(`- Token length: ${process.env.BLOB_READ_WRITE_TOKEN?.length || 0} characters`);

// Test the plugin conditional loading
const shouldLoadPlugin = !!process.env.BLOB_READ_WRITE_TOKEN;
console.log(`\n🔌 Plugin Loading Check:`);
console.log(`- Should load Vercel Blob plugin: ${shouldLoadPlugin ? "✅ Yes" : "❌ No"}`);

if (shouldLoadPlugin) {
  try {
    const { vercelBlobStorage } = await import("@payloadcms/storage-vercel-blob");
    console.log("✅ Vercel Blob Storage package imported successfully");
    
    // Test plugin configuration
    const pluginConfig = vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    
    console.log("✅ Plugin configuration created successfully");
    console.log(`- Plugin name: ${pluginConfig.name}`);
    
  } catch (error) {
    console.error("❌ Error importing or configuring plugin:", error);
  }
} else {
  console.log("❌ Plugin will not load - BLOB_READ_WRITE_TOKEN is missing");
}