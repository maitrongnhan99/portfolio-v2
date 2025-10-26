#!/usr/bin/env tsx

import { getPayload } from "payload";
import configPromise from "../payload.config";

async function testPayloadMedia() {
  try {
    console.log("🔄 Initializing Payload...");
    const payload = await getPayload({
      config: configPromise,
    });

    console.log("✅ Payload initialized successfully");

    // Check if media collection exists
    const collections = payload.config.collections;
    const mediaCollection = collections.find((col) => col.slug === "media");

    if (mediaCollection) {
      console.log("✅ Media collection found");
      console.log("📊 Media collection config:");
      console.log(`- Upload enabled: ${!!mediaCollection.upload}`);
      console.log(`- Disable local storage: ${mediaCollection.upload?.disableLocalStorage}`);
      console.log(`- MIME types: ${mediaCollection.upload?.mimeTypes?.join(", ")}`);
      console.log(`- Image sizes: ${mediaCollection.upload?.imageSizes?.length || 0} sizes`);
    } else {
      console.log("❌ Media collection not found");
    }

    // Check Vercel Blob Storage plugin
    const blobPlugin = payload.config.plugins?.find((plugin: any) => 
      plugin.name?.includes("vercel-blob") || 
      plugin.constructor?.name?.includes("vercelBlob")
    );

    if (blobPlugin) {
      console.log("✅ Vercel Blob Storage plugin found");
    } else {
      console.log("❌ Vercel Blob Storage plugin not found");
    }

    // Check environment variables
    console.log("🔧 Environment check:");
    console.log(`- BLOB_READ_WRITE_TOKEN: ${process.env.BLOB_READ_WRITE_TOKEN ? "✅ Set" : "❌ Missing"}`);
    console.log(`- MONGODB_CONNECTION_STRING: ${process.env.MONGODB_CONNECTION_STRING ? "✅ Set" : "❌ Missing"}`);
    console.log(`- PAYLOAD_SECRET: ${process.env.PAYLOAD_SECRET ? "✅ Set" : "❌ Missing"}`);

    console.log("🎉 Test completed successfully");
    
  } catch (error) {
    console.error("❌ Error testing Payload media:", error);
  }
}

testPayloadMedia();