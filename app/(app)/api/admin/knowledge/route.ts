import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import KnowledgeChunk from "@/models/KnowledgeChunk";
import connectToDatabase from "@/lib/mongodb";
import { knowledgeSchema } from "@/lib/admin/validators";
import { MongoVectorStore } from "@/services/vectorStore";
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
      .select("-embedding") // Exclude embeddings from list view
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

    // Generate embedding
    const vectorStore = new MongoVectorStore();
    const embedding = await vectorStore.generateEmbedding(content);

    // Create knowledge chunk
    const chunk = new KnowledgeChunk({
      content,
      embedding,
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
      chunk: {
        ...chunk.toObject(),
        embedding: undefined // Don't return embedding in response
      },
    });
  } catch (error) {
    console.error("Error creating knowledge chunk:", error);
    return NextResponse.json(
      { error: "Failed to create knowledge chunk" },
      { status: 500 }
    );
  }
}