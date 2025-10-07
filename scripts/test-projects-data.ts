import dotenv from "dotenv";
import config from "@payload-config";
import { getPayload } from "payload";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function testProjectsData() {
  console.log("🧪 Testing Projects Data Fetching...");
  
  try {
    const payload = await getPayload({ config });
    console.log("✅ Connected to Payload CMS");
    
    const response = await payload.find({
      collection: "projects",
      where: {
        status: {
          equals: "published",
        },
      },
      sort: "-date",
      limit: 100,
    });
    
    console.log(`✅ Successfully fetched ${response.docs.length} projects:`);
    
    response.docs.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (${project.category}) - ${project.status}`);
    });
    
    console.log("\n🎯 Test completed successfully!");
    
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
  }
}

// Run the test
testProjectsData();