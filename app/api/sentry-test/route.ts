import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const testType = request.nextUrl.searchParams.get("type") || "basic";

  try {
    switch (testType) {
      case "basic":
        // Test basic server error
        throw new Error("Test API Error - This is a basic test error");

      case "async":
        // Test async error
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error("Test Async Error - This async error occurred"));
          }, 100);
        });
        break;

      case "reference":
        // Test reference error
        // @ts-ignore - Intentional error for testing
        const obj = null;
        (obj as any).nonExistentMethod();
        break;

      default:
        return NextResponse.json(
          {
            message: "Invalid test type. Use ?type=basic, ?type=async, or ?type=reference",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    // Error will be logged to console in development
    console.error("API Test Error:", error);
    throw error;
  }
}

export async function POST() {
  // Test POST method error
  throw new Error("Test POST Error - This is a test error for POST requests");
}