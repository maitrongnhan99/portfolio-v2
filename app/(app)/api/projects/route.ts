import { getProjects } from "@/lib/data-service-server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const categoryParam = searchParams.get("category");
    const featuredParam = searchParams.get("featured");

    // Parse limit parameter
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    if (limit && (isNaN(limit) || limit < 1)) {
      return NextResponse.json(
        { error: "Invalid limit parameter. Must be a positive integer." },
        { status: 400 }
      );
    }

    // Fetch all projects from the data service
    let projects = await getProjects();

    // Filter by featured if requested
    if (featuredParam === "true") {
      projects = projects.filter((project) => project.featured);
    }

    // Filter by category if specified
    if (categoryParam) {
      projects = projects.filter(
        (project) =>
          project.category.toLowerCase() === categoryParam.toLowerCase()
      );
    }

    // Apply limit if specified
    if (limit) {
      projects = projects.slice(0, limit);
    }

    // Set cache headers for better performance
    const headers = new Headers({
      "Content-Type": "application/json",
      // Cache for 5 minutes, revalidate in background
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      // Allow CORS for development
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    return new NextResponse(JSON.stringify({ projects }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch projects",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}