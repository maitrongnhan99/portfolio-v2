/**
 * Test script to validate Payload CMS setup
 * Run with: pnpm tsx scripts/test-payload.ts
 */

import config from "../payload.config";
import { getPayload } from "payload";

async function testPayloadSetup() {
  console.log("🧪 Testing Payload CMS Setup...\n");

  // Test 1: Check environment variables
  console.log("1. Environment Variables:");
  console.log("   PAYLOAD_ENABLED:", process.env.PAYLOAD_ENABLED);
  console.log(
    "   MONGODB_CONNECTION_STRING:",
    process.env.MONGODB_CONNECTION_STRING ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "   PAYLOAD_SECRET:",
    process.env.PAYLOAD_SECRET ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "   NEXT_PUBLIC_SERVER_URL:",
    process.env.NEXT_PUBLIC_SERVER_URL || "Not set"
  );
  console.log();

  // Test 2: Check Payload configuration
  console.log("2. Payload Configuration:");
  try {
    console.log("   ✅ Payload config imports successfully");
    console.log("   Collections:", (await config).collections.map(c => c.slug).join(", "));
    console.log("   Database adapter:", (await config).db ? "✅ Configured" : "❌ Missing");
    console.log("   Editor:", (await config).editor ? "✅ Configured" : "❌ Missing");
  } catch (error) {
    console.log(
      "   ❌ Payload config error:",
      error instanceof Error ? error.message : error
    );
  }
  console.log();

  // Test 3: Check if we can connect to Payload
  if (process.env.PAYLOAD_ENABLED === "true" && process.env.MONGODB_CONNECTION_STRING && process.env.PAYLOAD_SECRET) {
    console.log("3. Payload Connection Test:");
    try {
      const payload = await getPayload({ config });
      console.log("   ✅ Successfully connected to Payload");
      
      // Test collection access
      const collections = await payload.find({
        collection: "projects",
        limit: 1,
      });
      console.log("   ✅ Projects collection accessible");
      console.log("   Project count in database:", collections.totalDocs);
      
    } catch (error) {
      console.log(
        "   ❌ Payload connection failed:",
        error instanceof Error ? error.message : error
      );
    }
  } else {
    console.log("3. Payload Connection Test:");
    console.log("   ⚠️  Skipped - Payload not fully configured or disabled");
  }
  console.log();

  // Test 4: TypeScript paths
  console.log("4. TypeScript Integration:");
  try {
    await import("@payload-config");
    console.log("   ✅ @payload-config alias works");
  } catch (error) {
    console.log(
      "   ❌ @payload-config alias failed:",
      error instanceof Error ? error.message : error
    );
  }
  console.log();

  console.log("🎯 Test Summary:");
  if (process.env.PAYLOAD_ENABLED === "true") {
    console.log("   • Payload CMS is enabled");
    console.log("   • Make sure to run `pnpm dev` to start the development server");
    console.log("   • Access the admin panel at http://localhost:3000/admin");
  } else {
    console.log("   • Payload CMS is disabled, using static data");
  }
  
  console.log("\n✨ Next steps:");
  console.log("   1. Run migration: pnpm run migrate:payload");
  console.log("   2. Start dev server: pnpm dev");
  console.log("   3. Visit /admin to create content");
  console.log("   4. Check health endpoint: /api/health/payload");
}

// Run the tests
if (import.meta.url === `file://${process.argv[1]}`) {
  testPayloadSetup()
    .then(() => {
      console.log("\n✅ Test completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Test failed:", error);
      process.exit(1);
    });
}