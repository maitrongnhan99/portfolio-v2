import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import dotenv from "dotenv";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";
import {
  createPasswordResetEmail,
  createVerificationEmail,
} from "./lib/email-templates";

// Load environment variables
dotenv.config({ path: ".env.local" });

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  // Editor used by rich text fields
  editor: lexicalEditor(),

  // Database adapter
  db: mongooseAdapter({
    url: process.env.MONGODB_CONNECTION_STRING || "",
  }),

  // Server URL configuration
  serverURL:
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.SERVER_URL ||
    "http://localhost:3000",

  // Secret for JWT tokens and general encryption
  secret: (() => {
    const secret = process.env.PAYLOAD_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error("PAYLOAD_SECRET must be at least 32 characters long");
    }
    return secret;
  })(),

  // Collections
  collections: [
    // Projects Collection with Workflow
    {
      slug: "projects",
      admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "category", "status", "updatedAt"],
        group: "Content",
      },
      versions: {
        drafts: true,
        maxPerDoc: 10,
      },
      access: {
        read: () => true, // Public read access
        create: ({ req: { user } }) => !!user, // Only authenticated users can create
        update: ({ req: { user } }) => {
          if (!user) return false;
          if (user.role === "admin") return true;
          return true; // Editors can update non-published content
        },
        delete: ({ req: { user } }) => user?.role === "admin",
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          admin: {
            description: "The main title of the project",
          },
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          admin: {
            position: "sidebar",
            description: "URL-friendly version of the title",
          },
        },
        {
          name: "description",
          type: "textarea",
          required: true,
          admin: {
            description: "Short description displayed in project cards",
          },
        },
        {
          name: "longDescription",
          type: "richText",
          admin: {
            description: "Detailed description of the project",
          },
        },
        {
          name: "category",
          type: "select",
          required: true,
          options: [
            { label: "Full Stack", value: "FullStack" },
            { label: "Frontend", value: "Frontend" },
            { label: "Backend", value: "Backend" },
            { label: "Mobile App", value: "Mobile" },
            { label: "API", value: "API" },
            { label: "Tool", value: "Tool" },
          ],
          admin: {
            position: "sidebar",
          },
        },
        {
          name: "technologies",
          type: "array",
          required: true,
          minRows: 1,
          fields: [
            {
              name: "technology",
              type: "text",
              required: true,
            },
          ],
          admin: {
            description: "Technologies used in this project",
          },
        },
        {
          name: "features",
          type: "array",
          fields: [
            {
              name: "feature",
              type: "text",
              required: true,
            },
          ],
          admin: {
            description: "Key features of the project",
          },
        },
        {
          name: "challenges",
          type: "textarea",
          admin: {
            description: "Challenges faced and how they were solved",
          },
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "Main project image",
          },
        },
        {
          name: "gallery",
          type: "array",
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "caption",
              type: "text",
            },
          ],
          admin: {
            description: "Additional project images",
          },
        },
        {
          name: "liveUrl",
          type: "text",
          admin: {
            description: "URL to the live project",
          },
        },
        {
          name: "githubUrl",
          type: "text",
          admin: {
            description: "GitHub repository URL",
          },
        },
        {
          name: "date",
          type: "date",
          required: true,
          admin: {
            position: "sidebar",
            description: "Project completion date",
          },
        },
        {
          name: "featured",
          type: "checkbox",
          defaultValue: false,
          admin: {
            position: "sidebar",
            description: "Show this project on the homepage",
          },
        },
        // Workflow fields
        {
          name: "status",
          type: "select",
          required: true,
          defaultValue: "draft",
          options: [
            { label: "Draft", value: "draft" },
            { label: "In Review", value: "review" },
            { label: "Published", value: "published" },
            { label: "Archived", value: "archived" },
          ],
          admin: {
            position: "sidebar",
            description: "Current status of the project",
          },
        },
        {
          name: "reviewedBy",
          type: "relationship",
          relationTo: "users",
          admin: {
            position: "sidebar",
            condition: (data) =>
              data.status === "review" || data.status === "published",
          },
        },
        {
          name: "reviewNotes",
          type: "textarea",
          admin: {
            condition: (data) => data.status === "review",
            description: "Notes from the reviewer",
          },
        },
        {
          name: "publishedAt",
          type: "date",
          admin: {
            position: "sidebar",
            condition: (data) => data.status === "published",
          },
        },
        // SEO fields
        {
          name: "metaTitle",
          type: "text",
          admin: {
            description: "Override the page title for SEO",
          },
        },
        {
          name: "metaDescription",
          type: "textarea",
          admin: {
            description: "Description for search engines",
          },
        },
      ],
    },

    // Media Collection with Cloud Storage
    {
      slug: "media",
      admin: {
        group: "Media",
      },
      upload: {
        mimeTypes: ["image/*", "video/*", "application/pdf"],
        imageSizes: [
          {
            name: "thumbnail",
            width: 300,
            height: 300,
            position: "centre",
          },
          {
            name: "medium",
            width: 800,
            height: 600,
            position: "centre",
          },
          {
            name: "large",
            width: 1200,
            height: 900,
            position: "centre",
          },
          {
            name: "og",
            width: 1200,
            height: 630,
            position: "centre",
          },
        ],
      },
      fields: [
        {
          name: "alt",
          type: "text",
          required: true,
          admin: {
            description: "Alternative text for accessibility",
          },
        },
        {
          name: "caption",
          type: "text",
          admin: {
            description: "Caption displayed with the image",
          },
        },
        {
          name: "usage",
          type: "select",
          options: [
            { label: "Project Image", value: "project" },
            { label: "Profile Image", value: "profile" },
            { label: "General Use", value: "general" },
            { label: "Gallery", value: "gallery" },
          ],
          admin: {
            description: "How this media is being used",
          },
        },
      ],
    },

    // Users Collection with Role-based Access
    {
      slug: "users",
      auth: {
        verify: {
          generateEmailHTML: (args) => {
            if (!args || !args.token || !args.user) {
              throw new Error("Missing token or user for email verification");
            }
            return createVerificationEmail(args.user, args.token);
          },
          generateEmailSubject: () =>
            `Welcome to Portfolio CMS - Please verify your email`,
        },
        forgotPassword: {
          generateEmailHTML: (args) => {
            if (!args || !args.token || !args.user) {
              throw new Error("Missing token or user for password reset");
            }
            return createPasswordResetEmail(args.user, args.token);
          },
          generateEmailSubject: () => `Portfolio CMS - Password Reset Request`,
        },
      },
      admin: {
        useAsTitle: "email",
        group: "Admin",
      },
      access: {
        create: ({ req: { user } }) => user?.role === "admin",
        read: ({ req: { user } }) => !!user,
        update: ({ req: { user }, id }) => {
          if (user?.role === "admin") return true;
          return user?.id === id;
        },
        delete: ({ req: { user } }) => user?.role === "admin",
      },
      fields: [
        {
          name: "firstName",
          type: "text",
          required: true,
        },
        {
          name: "lastName",
          type: "text",
          required: true,
        },
        {
          name: "role",
          type: "select",
          required: true,
          defaultValue: "editor",
          options: [
            { label: "Admin", value: "admin" },
            { label: "Editor", value: "editor" },
            { label: "Reviewer", value: "reviewer" },
          ],
          access: {
            update: ({ req: { user } }) => user?.role === "admin",
          },
          admin: {
            description: "User role determines access permissions",
          },
        },
        {
          name: "avatar",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "Profile picture",
          },
        },
      ],
    },
  ],

  // Global settings
  globals: [
    {
      slug: "settings",
      admin: {
        group: "Settings",
      },
      fields: [
        {
          name: "siteName",
          type: "text",
          required: true,
          defaultValue: "Portfolio",
        },
        {
          name: "siteDescription",
          type: "textarea",
          required: true,
        },
        {
          name: "siteUrl",
          type: "text",
          required: true,
        },
        {
          name: "enablePayload",
          type: "checkbox",
          defaultValue: true,
          admin: {
            description: "Enable Payload CMS or fallback to static data",
          },
        },
      ],
    },
  ],

  // Admin configuration
  admin: {
    user: "users",
    meta: {
      titleSuffix: "- Portfolio CMS",
    },
    components: {
      // Custom components can be added here
    },
  },

  // Plugins
  plugins: [
    // Cloud storage plugin for S3
    ...(process.env.S3_BUCKET
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: "media",
              },
            },
            bucket: process.env.S3_BUCKET!,
            config: {
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
              },
              region: process.env.S3_REGION!,
            },
          }),
        ]
      : []),
  ],

  // TypeScript configuration
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  // Sharp for image processing
  sharp,

  // CORS configuration for Next.js
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"].filter(
    Boolean
  ),

  // CSRF configuration
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"].filter(
    Boolean
  ),

  // Note: Global hooks removed - collection-specific hooks should be used instead

  // Email configuration with Resend
  email: resendAdapter({
    defaultFromAddress:
      process.env.FROM_EMAIL ||
      process.env.ADMIN_EMAIL ||
      "noreply@example.com",
    defaultFromName: process.env.FROM_NAME || "Portfolio CMS",
    apiKey: process.env.RESEND_API_KEY || "",
  }),
});
