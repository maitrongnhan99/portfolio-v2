import dotenv from "dotenv";
import config from "@payload-config";
import { getPayload } from "payload";
import { projectsData } from "../lib/projects-data";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Migration script to transfer static data to Payload CMS
async function migrateProjects() {
  console.log("Starting migration to Payload CMS...");
  
  // Debug environment variables
  console.log("Environment check:");
  console.log("PAYLOAD_SECRET:", process.env.PAYLOAD_SECRET ? "Set" : "Missing");
  console.log("MONGODB_CONNECTION_STRING:", process.env.MONGODB_CONNECTION_STRING ? "Set" : "Missing");
  console.log("PAYLOAD_ENABLED:", process.env.PAYLOAD_ENABLED);

  try {
    // Initialize Payload
    const payload = await getPayload({ config });
    console.log("✅ Connected to Payload CMS");

    // Check if projects already exist
    const existingProjects = await payload.find({
      collection: "projects",
      limit: 1,
    });

    if (existingProjects.totalDocs > 0) {
      console.log("⚠️  Projects already exist in Payload CMS");
      console.log("   Would you like to proceed? This will add new projects.");
      console.log("   Set FORCE_MIGRATION=true to proceed anyway.");

      if (process.env.FORCE_MIGRATION !== "true") {
        console.log("🛑 Migration cancelled");
        return;
      }
    }

    // Create a default media item for projects without images
    let defaultImage: any = null;
    try {
      const defaultImageResponse = await payload.find({
        collection: "media",
        where: {
          alt: { equals: "Default Project Image" },
        },
        limit: 1,
      });

      if (defaultImageResponse.docs.length === 0) {
        console.log("📸 Creating default project image...");
        // Note: In a real migration, you'd upload actual image files
        // For now, we'll create a placeholder media entry
        defaultImage = await payload.create({
          collection: "media",
          data: {
            alt: "Default Project Image",
            caption: "Placeholder image for projects",
            usage: "project",
          },
          filePath: "./public/placeholder.svg", // This would be a real file path
        });
      } else {
        defaultImage = defaultImageResponse.docs[0];
      }
    } catch (error) {
      console.log("⚠️  Could not create default image, continuing without it");
    }

    // Create initial admin user if none exists
    const existingUsers = await payload.find({
      collection: "users",
      limit: 1,
    });

    if (existingUsers.totalDocs === 0) {
      console.log("👤 Creating initial admin user...");
      const adminUser = await payload.create({
        collection: "users",
        data: {
          email: process.env.ADMIN_EMAIL || "admin@example.com",
          password: process.env.ADMIN_PASSWORD || "admin123",
          firstName: "Admin",
          lastName: "User",
          role: "admin",
        },
      });
      console.log(`✅ Created admin user: ${adminUser.email}`);
    }

    // Migrate each project
    console.log(`📊 Migrating ${projectsData.length} projects...`);

    for (const [index, project] of projectsData.entries()) {
      try {
        console.log(
          `   Processing ${index + 1}/${projectsData.length}: ${project.title}`
        );

        // Check if project already exists
        const existingProject = await payload.find({
          collection: "projects",
          where: {
            slug: { equals: project.slug },
          },
          limit: 1,
        });

        if (existingProject.docs.length > 0) {
          console.log(`   ⏭️  Skipping ${project.title} (already exists)`);
          continue;
        }

        // Transform the data to match Payload schema
        const payloadProject = {
          title: project.title,
          slug: project.slug,
          description: project.description,
          // longDescription: project.longDescription || project.description, // TODO: Convert to Lexical format
          category: project.category as "FullStack" | "Frontend" | "Backend" | "Mobile" | "API" | "Tool",
          technologies: project.technologies.map((tech) => ({
            technology: tech,
          })),
          features: project.features?.map((feature) => ({ feature })) || [],
          challenges: project.challenges || "",
          image: defaultImage?.id || null, // Use default image for now
          gallery: [], // Gallery images would need to be uploaded separately
          liveUrl: project.liveUrl || "",
          githubUrl: project.githubUrl || "",
          date: project.date,
          featured: false, // Set manually later
          status: "published" as const,
          publishedAt: project.date,
          metaTitle: project.title,
          metaDescription: project.description,
        };

        // Create the project in Payload
        const createdProject = await payload.create({
          collection: "projects",
          data: payloadProject,
        });

        console.log(`   ✅ Created: ${createdProject.title}`);
      } catch (error) {
        console.error(`   ❌ Error migrating ${project.title}:`, error);
      }
    }

    // Create initial site settings
    try {
      const existingSettings = await payload.findGlobal({
        slug: "settings",
      });

      if (!existingSettings?.siteName) {
        console.log("⚙️  Creating initial site settings...");
        await payload.updateGlobal({
          slug: "settings",
          data: {
            siteName: "Portfolio",
            siteDescription:
              "A modern portfolio showcasing web development projects",
            siteUrl:
              process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
            enablePayload: true,
          },
        });
        console.log("✅ Site settings created");
      }
    } catch (error) {
      console.error("❌ Error creating site settings:", error);
    }

    console.log("\n🎉 Migration completed successfully!");
    console.log("📝 Next steps:");
    console.log("   1. Visit /admin to access the Payload CMS admin panel");
    console.log("   2. Upload actual images for your projects");
    console.log("   3. Review and update project content as needed");
    console.log("   4. Set featured projects");
    console.log("   5. Configure cloud storage if desired");
  } catch (error) {
    console.error("💥 Migration failed:", error);
    process.exit(1);
  }
}

// Run the migration
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateProjects()
    .then(() => {
      console.log("Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration script failed:", error);
      process.exit(1);
    });
}

export { migrateProjects };
