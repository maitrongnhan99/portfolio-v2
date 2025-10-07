# Admin Assistant Implementation Plan

## Overview

This document outlines the implementation plan for creating an admin interface at `/admin/assistant` to manage the AI assistant's knowledge base. The system will use NextAuth for authentication and provide full CRUD operations for knowledge chunks with automatic vector embedding generation.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Implementation Checklist](#implementation-checklist)
3. [Phase 1: NextAuth Setup](#phase-1-nextauth-setup)
4. [Phase 2: Database Schema Updates](#phase-2-database-schema-updates)
5. [Phase 3: Admin Authentication](#phase-3-admin-authentication)
6. [Phase 4: API Routes](#phase-4-api-routes)
7. [Phase 5: Admin UI Components](#phase-5-admin-ui-components)
8. [Phase 6: Knowledge Management Features](#phase-6-knowledge-management-features)
9. [Phase 7: Testing](#phase-7-testing)
10. [Security Considerations](#security-considerations)
11. [Deployment](#deployment)

## Architecture Overview

### Tech Stack

- **Authentication**: NextAuth.js (Auth.js)
- **Database**: MongoDB (existing)
- **Vector Store**: MongoDB Atlas Vector Search (existing)
- **Embeddings**: Google Generative AI (existing)
- **UI Framework**: React + TypeScript + Tailwind CSS
- **API**: Next.js API Routes

### Directory Structure

```
app/
├── admin/
│   ├── layout.tsx              # Protected admin layout
│   ├── login/
│   │   └── page.tsx           # Admin login page
│   └── assistant/
│       ├── page.tsx           # Main dashboard
│       ├── loading.tsx        # Loading state
│       └── error.tsx          # Error boundary
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts       # NextAuth configuration
│   └── admin/
│       ├── knowledge/
│       │   ├── route.ts       # GET (list) & POST (create)
│       │   └── [id]/
│       │       └── route.ts   # GET, PUT, DELETE operations
│       ├── stats/
│       │   └── route.ts       # Analytics endpoint
│       └── seed/
│           └── route.ts       # Bulk import endpoint

components/
├── admin/
│   ├── auth/
│   │   ├── login-form.tsx     # Login component
│   │   ├── auth-guard.tsx     # Route protection HOC
│   │   └── session-provider.tsx # NextAuth session wrapper
│   ├── knowledge/
│   │   ├── knowledge-table.tsx # Data table
│   │   ├── knowledge-form.tsx  # Add/Edit form
│   │   ├── knowledge-filters.tsx # Search & filters
│   │   └── knowledge-stats.tsx # Analytics cards
│   └── layout/
│       ├── admin-header.tsx    # Admin navigation
│       └── admin-sidebar.tsx   # Side navigation

lib/
├── auth/
│   ├── auth-options.ts        # NextAuth configuration
│   ├── auth-helpers.ts        # Auth utility functions
│   └── middleware.ts          # Route protection
├── admin/
│   ├── knowledge-service.ts   # Business logic
│   └── validators.ts          # Input validation

models/
├── User.ts                    # Admin user model
└── AuditLog.ts               # Activity tracking
```

## Implementation Checklist

### Phase 1: NextAuth Setup ⏳

- [ ] Install NextAuth dependencies
- [ ] Create auth configuration
- [ ] Set up environment variables
- [ ] Create User model for admins
- [ ] Configure session strategy

### Phase 2: Database Schema ⏳

- [ ] Update KnowledgeChunk model
- [ ] Create User model
- [ ] Create AuditLog model
- [ ] Add indexes for performance
- [ ] Create admin user seed script

### Phase 3: Authentication ⏳

- [ ] Create login page UI
- [ ] Implement credentials provider
- [ ] Add session management
- [ ] Create auth middleware
- [ ] Add logout functionality

### Phase 4: API Routes ⏳

- [ ] Knowledge CRUD endpoints
- [ ] Stats/Analytics endpoint
- [ ] Bulk operations endpoint
- [ ] Add rate limiting
- [ ] Implement error handling

### Phase 5: UI Components ⏳

- [ ] Admin layout wrapper
- [ ] Knowledge data table
- [ ] Add/Edit form modal
- [ ] Filter components
- [ ] Statistics dashboard

### Phase 6: Features ⏳

- [ ] Real-time search
- [ ] Batch operations
- [ ] Export/Import functionality
- [ ] Activity logging
- [ ] Embedding regeneration

### Phase 7: Testing ⏳

- [ ] Unit tests for API routes
- [ ] Integration tests
- [ ] E2E tests for workflows
- [ ] Performance testing
- [ ] Security testing

## Phase 1: NextAuth Setup

### 1.1 Install Dependencies

```bash
pnpm add next-auth @auth/mongodb-adapter bcryptjs
pnpm add -D @types/bcryptjs
```

### 1.2 Environment Variables

Add to `.env.local`:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here # Generate with: openssl rand -base64 32

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password
```

### 1.3 Create NextAuth Configuration

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

Create `lib/auth/auth-options.ts`:

```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectToDatabase();
        const user = await User.findOne({ 
          email: credentials.email,
          role: "admin" 
        });

        if (!user || !await bcrypt.compare(credentials.password, user.password)) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  }
};
```

## Phase 2: Database Schema Updates

### 2.1 User Model

Create `models/User.ts`:

```typescript
import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: Date,
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

const User: Model<IUser> = 
  mongoose.models.User || 
  mongoose.model<IUser>('User', UserSchema);

export default User;
```

### 2.2 Update KnowledgeChunk Model

Add these fields to existing model:

```typescript
// In models/KnowledgeChunk.ts, add to schema:
createdBy: {
  type: Schema.Types.ObjectId,
  ref: 'User',
  required: true,
},
modifiedBy: {
  type: Schema.Types.ObjectId,
  ref: 'User',
},
isActive: {
  type: Boolean,
  default: true,
},
version: {
  type: Number,
  default: 1,
},
queryCount: {
  type: Number,
  default: 0,
},
```

### 2.3 AuditLog Model

Create `models/AuditLog.ts`:

```typescript
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  resource: string;
  resourceId?: mongoose.Types.ObjectId;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    enum: ['create', 'update', 'delete', 'login', 'logout'],
    required: true,
  },
  resource: {
    type: String,
    required: true,
  },
  resourceId: {
    type: Schema.Types.ObjectId,
  },
  details: Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

// Indexes
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ resource: 1, action: 1 });

const AuditLog: Model<IAuditLog> = 
  mongoose.models.AuditLog || 
  mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
```

### 2.4 Admin User Seed Script

Create `scripts/seed-admin.ts`:

```typescript
#!/usr/bin/env npx tsx

import dotenv from 'dotenv';
import path from 'path';
import { connectToDatabase } from '../lib/mongodb';
import User from '../models/User';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function seedAdmin() {
  try {
    await connectToDatabase();
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isActive: true,
    });
    
    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    process.exit();
  }
}

seedAdmin();
```

## Phase 3: Admin Authentication

### 3.1 Auth Middleware

Create `lib/auth/middleware.ts`:

```typescript
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  
  return session;
}

export async function getAuthSession() {
  return await getServerSession(authOptions);
}
```

### 3.2 Login Page

Create `app/admin/login/page.tsx`:

```typescript
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LockClosedIcon } from "@heroicons/react/24/outline";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/admin/assistant");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <div className="w-full max-w-md">
        <div className="bg-navy-light rounded-lg shadow-xl p-8 border border-navy-lighter">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <LockClosedIcon className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-8 text-slate-lighter">
            Admin Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

### 3.3 Protected Admin Layout

Create `app/admin/layout.tsx`:

```typescript
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/middleware";
import AdminHeader from "@/components/admin/layout/admin-header";
import AdminSidebar from "@/components/admin/layout/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session || session.user?.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={session.user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

## Phase 4: API Routes

### 4.1 Knowledge CRUD Routes

Create `app/api/admin/knowledge/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import KnowledgeChunk from "@/models/KnowledgeChunk";
import { connectToDatabase } from "@/lib/mongodb";
import { knowledgeSchema } from "@/lib/admin/validators";
import MongoVectorStore from "@/services/vectorStore";
import AuditLog from "@/models/AuditLog";

// GET /api/admin/knowledge - List all knowledge chunks
export async function GET(request: NextRequest) {
  const authResponse = await requireAuth();
  if (authResponse instanceof NextResponse) return authResponse;

  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") === "asc" ? 1 : -1;

    // Build query
    const query: any = { isActive: true };
    if (category) query["metadata.category"] = category;
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: "i" } },
        { "metadata.tags": { $in: [new RegExp(search, "i")] } }
      ];
    }

    // Execute query
    const total = await KnowledgeChunk.countDocuments(query);
    const chunks = await KnowledgeChunk
      .find(query)
      .populate("createdBy", "name email")
      .populate("modifiedBy", "name email")
      .sort({ [sortBy]: order })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    return NextResponse.json({
      chunks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching knowledge chunks:", error);
    return NextResponse.json(
      { error: "Failed to fetch knowledge chunks" },
      { status: 500 }
    );
  }
}

// POST /api/admin/knowledge - Create new knowledge chunk
export async function POST(request: NextRequest) {
  const authResponse = await requireAuth();
  if (authResponse instanceof NextResponse) return authResponse;
  const session = authResponse;

  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validate input
    const validation = knowledgeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error },
        { status: 400 }
      );
    }

    const { content, category, priority, tags, source } = validation.data;

    // Create knowledge chunk
    const chunk = new KnowledgeChunk({
      content,
      embedding: [], // Will be generated below
      metadata: {
        category,
        priority,
        tags,
        source,
        lastUpdated: new Date(),
      },
      createdBy: session.user.id,
      isActive: true,
      version: 1,
      queryCount: 0,
    });

    // Generate embedding
    const vectorStore = new MongoVectorStore();
    await vectorStore.addDocuments([{
      content,
      category,
      priority,
      tags,
      source,
    }]);

    // Save chunk
    await chunk.save();

    // Log activity
    await AuditLog.create({
      userId: session.user.id,
      action: "create",
      resource: "knowledge",
      resourceId: chunk._id,
      details: { category, tags },
    });

    return NextResponse.json({
      message: "Knowledge chunk created successfully",
      chunk,
    });
  } catch (error) {
    console.error("Error creating knowledge chunk:", error);
    return NextResponse.json(
      { error: "Failed to create knowledge chunk" },
      { status: 500 }
    );
  }
}
```

Create `app/api/admin/knowledge/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import KnowledgeChunk from "@/models/KnowledgeChunk";
import { connectToDatabase } from "@/lib/mongodb";
import { knowledgeSchema } from "@/lib/admin/validators";
import EmbeddingService from "@/services/embeddingService";
import AuditLog from "@/models/AuditLog";

// GET /api/admin/knowledge/[id] - Get single chunk
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResponse = await requireAuth();
  if (authResponse instanceof NextResponse) return authResponse;

  try {
    await connectToDatabase();
    
    const chunk = await KnowledgeChunk
      .findById(params.id)
      .populate("createdBy", "name email")
      .populate("modifiedBy", "name email");

    if (!chunk || !chunk.isActive) {
      return NextResponse.json(
        { error: "Knowledge chunk not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ chunk });
  } catch (error) {
    console.error("Error fetching knowledge chunk:", error);
    return NextResponse.json(
      { error: "Failed to fetch knowledge chunk" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/knowledge/[id] - Update chunk
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResponse = await requireAuth();
  if (authResponse instanceof NextResponse) return authResponse;
  const session = authResponse;

  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validate input
    const validation = knowledgeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error },
        { status: 400 }
      );
    }

    const chunk = await KnowledgeChunk.findById(params.id);
    if (!chunk || !chunk.isActive) {
      return NextResponse.json(
        { error: "Knowledge chunk not found" },
        { status: 404 }
      );
    }

    // Store old content for comparison
    const oldContent = chunk.content;
    
    // Update fields
    chunk.content = validation.data.content;
    chunk.metadata = {
      ...chunk.metadata,
      ...validation.data,
      lastUpdated: new Date(),
    };
    chunk.modifiedBy = session.user.id;
    chunk.version += 1;

    // Regenerate embedding if content changed
    if (oldContent !== validation.data.content) {
      const embeddingService = new EmbeddingService();
      chunk.embedding = await embeddingService.generateEmbedding(
        validation.data.content
      );
    }

    await chunk.save();

    // Log activity
    await AuditLog.create({
      userId: session.user.id,
      action: "update",
      resource: "knowledge",
      resourceId: chunk._id,
      details: { 
        version: chunk.version,
        contentChanged: oldContent !== validation.data.content 
      },
    });

    return NextResponse.json({
      message: "Knowledge chunk updated successfully",
      chunk,
    });
  } catch (error) {
    console.error("Error updating knowledge chunk:", error);
    return NextResponse.json(
      { error: "Failed to update knowledge chunk" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/knowledge/[id] - Soft delete chunk
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResponse = await requireAuth();
  if (authResponse instanceof NextResponse) return authResponse;
  const session = authResponse;

  try {
    await connectToDatabase();
    
    const chunk = await KnowledgeChunk.findById(params.id);
    if (!chunk || !chunk.isActive) {
      return NextResponse.json(
        { error: "Knowledge chunk not found" },
        { status: 404 }
      );
    }

    // Soft delete
    chunk.isActive = false;
    chunk.modifiedBy = session.user.id;
    await chunk.save();

    // Log activity
    await AuditLog.create({
      userId: session.user.id,
      action: "delete",
      resource: "knowledge",
      resourceId: chunk._id,
      details: { category: chunk.metadata.category },
    });

    return NextResponse.json({
      message: "Knowledge chunk deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting knowledge chunk:", error);
    return NextResponse.json(
      { error: "Failed to delete knowledge chunk" },
      { status: 500 }
    );
  }
}
```

### 4.2 Statistics API

Create `app/api/admin/stats/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import KnowledgeChunk from "@/models/KnowledgeChunk";
import AuditLog from "@/models/AuditLog";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const authResponse = await requireAuth();
  if (authResponse instanceof NextResponse) return authResponse;

  try {
    await connectToDatabase();

    // Get category distribution
    const categoryStats = await KnowledgeChunk.aggregate([
      { $match: { isActive: true } },
      { $group: { 
        _id: "$metadata.category", 
        count: { $sum: 1 },
        totalQueries: { $sum: "$queryCount" }
      }},
      { $sort: { count: -1 } }
    ]);

    // Get recent activity
    const recentActivity = await AuditLog
      .find({ resource: "knowledge" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get totals
    const totalChunks = await KnowledgeChunk.countDocuments({ isActive: true });
    const totalQueries = await KnowledgeChunk.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: "$queryCount" } } }
    ]);

    // Get top queried chunks
    const topQueried = await KnowledgeChunk
      .find({ isActive: true, queryCount: { $gt: 0 } })
      .sort({ queryCount: -1 })
      .limit(5)
      .select("content metadata.category queryCount")
      .lean();

    return NextResponse.json({
      categoryStats,
      recentActivity,
      totals: {
        chunks: totalChunks,
        queries: totalQueries[0]?.total || 0,
        categories: categoryStats.length,
      },
      topQueried,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
```

## Phase 5: Admin UI Components

### 5.1 Knowledge Table Component

Create `components/admin/knowledge/knowledge-table.tsx`:

```typescript
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Eye,
  RefreshCw 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface KnowledgeChunk {
  _id: string;
  content: string;
  metadata: {
    category: string;
    priority: number;
    tags: string[];
    source: string;
    lastUpdated: string;
  };
  createdBy: {
    name: string;
    email: string;
  };
  queryCount: number;
  version: number;
}

interface KnowledgeTableProps {
  chunks: KnowledgeChunk[];
  onEdit: (chunk: KnowledgeChunk) => void;
  onDelete: (id: string) => void;
  onRegenerateEmbedding: (id: string) => void;
}

export function KnowledgeTable({
  chunks,
  onEdit,
  onDelete,
  onRegenerateEmbedding,
}: KnowledgeTableProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      personal: "bg-blue-500",
      skills: "bg-green-500",
      experience: "bg-purple-500",
      projects: "bg-orange-500",
      education: "bg-yellow-500",
      contact: "bg-pink-500",
    };
    return colors[category as keyof typeof colors] || "bg-gray-500";
  };

  const getPriorityLabel = (priority: number) => {
    const labels = {
      1: { text: "High", color: "destructive" },
      2: { text: "Medium", color: "secondary" },
      3: { text: "Low", color: "outline" },
    };
    return labels[priority as keyof typeof labels] || labels[2];
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Content</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Queries</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Version</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chunks.map((chunk) => (
            <TableRow key={chunk._id}>
              <TableCell className="max-w-[400px]">
                <p className="truncate">{chunk.content}</p>
              </TableCell>
              <TableCell>
                <Badge className={getCategoryColor(chunk.metadata.category)}>
                  {chunk.metadata.category}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityLabel(chunk.metadata.priority).color as any}>
                  {getPriorityLabel(chunk.metadata.priority).text}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {chunk.metadata.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {chunk.metadata.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{chunk.metadata.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{chunk.queryCount}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(chunk.metadata.lastUpdated), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{chunk.createdBy.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {chunk.createdBy.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>v{chunk.version}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(chunk)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onRegenerateEmbedding(chunk._id)}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate Embedding
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(chunk._id)}
                      className="text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### 5.2 Knowledge Form Component

Create `components/admin/knowledge/knowledge-form.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const knowledgeSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.enum(["personal", "skills", "experience", "projects", "education", "contact"]),
  priority: z.number().min(1).max(3),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  source: z.string().min(1, "Source is required"),
});

type KnowledgeFormData = z.infer<typeof knowledgeSchema>;

interface KnowledgeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: KnowledgeFormData) => Promise<void>;
  initialData?: Partial<KnowledgeFormData>;
  mode: "create" | "edit";
}

export function KnowledgeForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: KnowledgeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const form = useForm<KnowledgeFormData>({
    resolver: zodResolver(knowledgeSchema),
    defaultValues: {
      content: "",
      category: "personal",
      priority: 2,
      tags: [],
      source: "manual_entry",
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        content: initialData.content || "",
        category: initialData.category || "personal",
        priority: initialData.priority || 2,
        tags: initialData.tags || [],
        source: initialData.source || "manual_entry",
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: KnowledgeFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags");
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Knowledge" : "Edit Knowledge"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add new knowledge to the AI assistant's knowledge base."
              : "Update existing knowledge in the AI assistant's knowledge base."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the knowledge content..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The main content that will be used by the AI assistant.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="skills">Skills</SelectItem>
                        <SelectItem value="experience">Experience</SelectItem>
                        <SelectItem value="projects">Projects</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="contact">Contact</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">High</SelectItem>
                        <SelectItem value="2">Medium</SelectItem>
                        <SelectItem value="3">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={addTag}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                            <button
                              type="button"
                              className="ml-1 hover:text-destructive"
                              onClick={() => removeTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Tags help categorize and search for knowledge.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., resume, portfolio, manual_entry"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The origin or source of this knowledge.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                  ? "Create"
                  : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

## Phase 6: Main Admin Page

Create `app/admin/assistant/page.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";
import { Plus, RefreshCw, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KnowledgeTable } from "@/components/admin/knowledge/knowledge-table";
import { KnowledgeForm } from "@/components/admin/knowledge/knowledge-form";
import { KnowledgeStats } from "@/components/admin/knowledge/knowledge-stats";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminAssistantPage() {
  const { toast } = useToast();
  const [chunks, setChunks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedChunk, setSelectedChunk] = useState(null);
  
  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [page, setPage] = useState(1);

  // Fetch knowledge chunks
  const fetchChunks = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(category && { category }),
        sortBy,
      });

      const response = await fetch(`/api/admin/knowledge?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setChunks(data.chunks);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch knowledge chunks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchChunks();
    fetchStats();
  }, [search, category, sortBy, page]);

  // Handle create
  const handleCreate = () => {
    setFormMode("create");
    setSelectedChunk(null);
    setFormOpen(true);
  };

  // Handle edit
  const handleEdit = (chunk: any) => {
    setFormMode("edit");
    setSelectedChunk(chunk);
    setFormOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (data: any) => {
    try {
      const url = formMode === "create" 
        ? "/api/admin/knowledge"
        : `/api/admin/knowledge/${selectedChunk._id}`;
      
      const method = formMode === "create" ? "POST" : "PUT";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Knowledge ${formMode === "create" ? "created" : "updated"} successfully`,
        });
        fetchChunks();
        fetchStats();
      } else {
        throw new Error("Failed to save knowledge");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${formMode} knowledge`,
        variant: "destructive",
      });
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this knowledge chunk?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/knowledge/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Knowledge deleted successfully",
        });
        fetchChunks();
        fetchStats();
      } else {
        throw new Error("Failed to delete knowledge");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete knowledge",
        variant: "destructive",
      });
    }
  };

  // Handle regenerate embedding
  const handleRegenerateEmbedding = async (id: string) => {
    toast({
      title: "Regenerating",
      description: "Regenerating embedding for knowledge chunk...",
    });
    // Implementation would go here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Management</h1>
          <p className="text-muted-foreground">
            Manage the AI assistant's knowledge base
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Knowledge
          </Button>
        </div>
      </div>

      <Tabs defaultValue="knowledge" className="space-y-4">
        <TabsList>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Search knowledge..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="skills">Skills</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="metadata.lastUpdated">Updated Date</SelectItem>
                    <SelectItem value="queryCount">Query Count</SelectItem>
                    <SelectItem value="metadata.priority">Priority</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fetchChunks()}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">Loading...</div>
              ) : (
                <KnowledgeTable
                  chunks={chunks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onRegenerateEmbedding={handleRegenerateEmbedding}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {stats && <KnowledgeStats stats={stats} />}
        </TabsContent>
      </Tabs>

      {/* Knowledge Form Modal */}
      <KnowledgeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedChunk?.metadata ? {
          content: selectedChunk.content,
          category: selectedChunk.metadata.category,
          priority: selectedChunk.metadata.priority,
          tags: selectedChunk.metadata.tags,
          source: selectedChunk.metadata.source,
        } : undefined}
        mode={formMode}
      />
    </div>
  );
}
```

## Phase 7: Testing

### 7.1 API Route Tests

Create `tests/api/admin/knowledge.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { GET, POST } from '@/app/api/admin/knowledge/route';

describe('/api/admin/knowledge', () => {
  beforeEach(() => {
    // Mock auth
    jest.mock('@/lib/auth/middleware', () => ({
      requireAuth: jest.fn().mockResolvedValue({ user: { id: '123', role: 'admin' } })
    }));
  });

  describe('GET', () => {
    it('should return knowledge chunks with pagination', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { page: '1', limit: '10' },
      });

      await GET(req);

      expect(res._getStatusCode()).toBe(200);
      const json = JSON.parse(res._getData());
      expect(json).toHaveProperty('chunks');
      expect(json).toHaveProperty('pagination');
    });
  });

  describe('POST', () => {
    it('should create a new knowledge chunk', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          content: 'Test knowledge content',
          category: 'skills',
          priority: 2,
          tags: ['test', 'development'],
          source: 'test',
        },
      });

      await POST(req);

      expect(res._getStatusCode()).toBe(200);
      const json = JSON.parse(res._getData());
      expect(json).toHaveProperty('message');
      expect(json).toHaveProperty('chunk');
    });
  });
});
```

### 7.2 E2E Test Example

Create `tests/e2e/admin-knowledge.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Admin Knowledge Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/admin/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'test-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/assistant');
  });

  test('should create new knowledge chunk', async ({ page }) => {
    // Click add button
    await page.click('button:has-text("Add Knowledge")');
    
    // Fill form
    await page.fill('textarea[name="content"]', 'Test knowledge content for E2E test');
    await page.selectOption('select[name="category"]', 'skills');
    await page.selectOption('select[name="priority"]', '2');
    
    // Add tags
    await page.fill('input[placeholder="Add a tag..."]', 'test-tag');
    await page.click('button:has-text("Add")');
    
    // Submit
    await page.click('button:has-text("Create")');
    
    // Verify success
    await expect(page.locator('text=Knowledge created successfully')).toBeVisible();
    await expect(page.locator('text=Test knowledge content for E2E test')).toBeVisible();
  });

  test('should filter knowledge by category', async ({ page }) => {
    // Select category filter
    await page.selectOption('select[aria-label="Category filter"]', 'skills');
    
    // Verify filtered results
    await expect(page.locator('tbody tr')).toHaveCount(5); // Assuming 5 skills entries
    await expect(page.locator('text=skills').first()).toBeVisible();
  });

  test('should edit existing knowledge', async ({ page }) => {
    // Click edit on first row
    await page.click('tbody tr:first-child button[aria-label="Open menu"]');
    await page.click('text=Edit');
    
    // Update content
    await page.fill('textarea[name="content"]', 'Updated knowledge content');
    
    // Submit
    await page.click('button:has-text("Update")');
    
    // Verify success
    await expect(page.locator('text=Knowledge updated successfully')).toBeVisible();
    await expect(page.locator('text=Updated knowledge content')).toBeVisible();
  });
});
```

## Security Considerations

### 1. Authentication Security

- Use strong password hashing (bcrypt with salt rounds >= 10)
- Implement rate limiting on login attempts
- Add CAPTCHA after failed attempts
- Use secure session cookies with httpOnly, secure, sameSite flags
- Implement session timeout

### 2. Authorization

- Verify admin role on every protected route
- Use middleware for consistent auth checks
- Implement RBAC for future role expansion

### 3. Input Validation

- Validate all inputs with Zod schemas
- Sanitize content before storage
- Escape content when displaying
- Implement file upload restrictions

### 4. API Security

- Add rate limiting per IP/user
- Implement CORS properly
- Use CSRF tokens for state-changing operations
- Log all admin actions for audit trail

### 5. Database Security

- Use MongoDB connection with SSL
- Implement field-level encryption for sensitive data
- Regular backups of knowledge base
- Monitor for unusual query patterns

## Deployment Considerations

### 1. Environment Variables

```env
# Production settings
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate-strong-secret>
MONGODB_CONNECTION_STRING=<production-mongodb-url>
GEMINI_API_KEY=<production-api-key>
```

### 2. Build Optimization

```json
// package.json scripts
{
  "build:admin": "next build && npm run seed:admin",
  "start:production": "next start -p $PORT"
}
```

### 3. Monitoring

- Set up error tracking (Sentry)
- Monitor API response times
- Track embedding generation costs
- Monitor MongoDB Atlas usage

### 4. Backup Strategy

- Daily automated backups of MongoDB
- Export knowledge base regularly
- Version control for knowledge updates

## Next Steps

1. **Implement user management** - Add/remove admin users
2. **Add bulk operations** - Import/export CSV/JSON
3. **Implement versioning** - Track knowledge history
4. **Add review workflow** - Approve changes before live
5. **Create API documentation** - OpenAPI/Swagger docs
6. **Add performance metrics** - Track query performance
7. **Implement caching** - Redis for frequently accessed data
8. **Add real-time updates** - WebSocket for live changes

## Conclusion

This implementation plan provides a complete admin interface for managing your AI assistant's knowledge base with:

- Secure authentication using NextAuth
- Full CRUD operations for knowledge management
- Real-time embedding generation
- Analytics and monitoring
- Comprehensive testing strategy
- Production-ready security measures

The modular architecture allows for easy extension and maintenance as your requirements grow.
