#!/usr/bin/env tsx

import { getPayload } from "payload";
import configPromise from "../payload.config";

async function testDirectUrls() {
  try {
    console.log("🔄 Testing PayloadCMS direct URL implementation...");
    
    const payload = await getPayload({
      config: configPromise,
    });

    console.log("✅ Payload initialized successfully");

    // Fetch media documents to test the publicUrl field
    console.log("🔍 Fetching media documents...");
    
    const mediaResult = await payload.find({
      collection: "media",
      limit: 5, // Get first 5 media items
    });

    console.log(`📊 Found ${mediaResult.docs.length} media documents`);

    if (mediaResult.docs.length === 0) {
      console.log("ℹ️  No media documents found. Upload some files through PayloadCMS admin to test.");
      return;
    }

    // Test each media document
    mediaResult.docs.forEach((doc, index) => {
      console.log(`\n📄 Media Document ${index + 1}:`);
      console.log(`- ID: ${doc.id}`);
      console.log(`- Filename: ${doc.filename || "N/A"}`);
      console.log(`- Original URL: ${doc.url || "N/A"}`);
      console.log(`- Direct URL (publicUrl): ${doc.publicUrl || "N/A"}`);
      console.log(`- Alt text: ${doc.alt || "N/A"}`);

      // Validate the publicUrl format
      if (doc.publicUrl) {
        const expectedDomain = "https://xiaw58us2q2emqf3.public.blob.vercel-storage.com";
        const expectedPrefix = "/media/";
        
        if (doc.publicUrl.startsWith(expectedDomain + expectedPrefix)) {
          console.log("✅ Direct URL format is correct");
        } else {
          console.log("❌ Direct URL format is incorrect");
          console.log(`   Expected to start with: ${expectedDomain}${expectedPrefix}`);
        }
      } else {
        console.log("❌ No publicUrl generated");
      }
    });

    // Test if we can access one of the direct URLs
    if (mediaResult.docs.length > 0 && mediaResult.docs[0].publicUrl) {
      console.log(`\n🌐 Testing direct URL accessibility...`);
      const testUrl = mediaResult.docs[0].publicUrl;
      console.log(`Testing URL: ${testUrl}`);
      
      try {
        const response = await fetch(testUrl, { method: 'HEAD' });
        if (response.ok) {
          console.log("✅ Direct URL is accessible");
          console.log(`- Status: ${response.status}`);
          console.log(`- Content-Type: ${response.headers.get('content-type')}`);
        } else {
          console.log(`❌ Direct URL returned ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ Error accessing direct URL: ${error.message}`);
      }
    }

    console.log("\n🎉 Direct URL test completed");
    
  } catch (error) {
    console.error("❌ Error testing direct URLs:", error);
  }
}

testDirectUrls();