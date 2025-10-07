import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import KnowledgeChunk from "@/models/KnowledgeChunk";
import AuditLog from "@/models/AuditLog";
import connectToDatabase from "@/lib/mongodb";

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