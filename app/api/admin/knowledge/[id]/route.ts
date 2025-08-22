import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import KnowledgeChunk from "@/models/KnowledgeChunk";
import connectToDatabase from "@/lib/mongodb";
import { knowledgeSchema } from "@/lib/admin/validators";
import MongoVectorStore from "@/services/vectorStore";
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
      .populate("modifiedBy", "name email")
      .select("-embedding"); // Exclude embedding from response

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
      category: validation.data.category,
      priority: validation.data.priority,
      tags: validation.data.tags,
      source: validation.data.source,
      lastUpdated: new Date(),
    };
    chunk.modifiedBy = session.user.id;
    chunk.version += 1;

    // Regenerate embedding if content changed
    if (oldContent !== validation.data.content) {
      const vectorStore = new MongoVectorStore();
      chunk.embedding = await vectorStore.generateEmbedding(validation.data.content);
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
      chunk: {
        ...chunk.toObject(),
        embedding: undefined // Don't return embedding in response
      },
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