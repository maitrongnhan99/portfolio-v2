import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const testType = request.nextUrl.searchParams.get("type") || "server";

  try {
    switch (testType) {
      case "server":
        // Test server-side error
        throw new Error("Test Sentry Server Error - This is a test error for Sentry integration");
        
      case "async":
        // Test async error
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error("Test Sentry Async Error - This async error should be caught by Sentry"));
          }, 100);
        });
        break;
        
      case "reference":
        // Test reference error
        // @ts-ignore - Intentional error for testing
        const obj = null;
        obj.nonExistentMethod();
        break;
        
      case "custom":
        // Test custom error with context
        const customError = new Error("Test Sentry Custom Error with Context");
        // @ts-ignore - Adding custom properties for Sentry
        customError.customData = {
          testType: "custom",
          timestamp: new Date().toISOString(),
          userId: "test-user-123",
        };
        throw customError;
        
      default:
        return NextResponse.json({
          message: "Invalid test type. Use ?type=server, ?type=async, ?type=reference, or ?type=custom",
        }, { status: 400 });
    }
  } catch (error) {
    // In production, this will be caught by Sentry automatically
    // In development, we'll see it in the console
    throw error;
  }
}

// Test Edge Runtime error
export async function POST() {
  // This will test edge runtime error handling
  throw new Error("Test Sentry Edge Runtime Error - This is a test error for Edge runtime");
}