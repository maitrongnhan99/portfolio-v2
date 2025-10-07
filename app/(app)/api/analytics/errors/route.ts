import { NextRequest, NextResponse } from 'next/server';

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  timestamp: number;
  userAgent: string;
  userId?: string;
  context?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const errorReport: ErrorReport = await request.json();

    // Validate the error data
    if (!errorReport.message || !errorReport.url) {
      return NextResponse.json(
        { error: 'Invalid error data' },
        { status: 400 }
      );
    }

    // Log the error (in production, send to error monitoring service)
    console.error('Client Error Reported:', {
      message: errorReport.message,
      url: errorReport.url,
      timestamp: new Date(errorReport.timestamp).toISOString(),
      userAgent: errorReport.userAgent,
      stack: errorReport.stack,
      context: errorReport.context,
    });

    // Here you could send to external error monitoring services
    // For now, we just log to console

    // Example: Send to custom error tracking
    // await saveErrorToDatabase(errorReport);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing error report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Error analytics endpoint',
    endpoints: {
      POST: 'Submit error reports'
    }
  });
}
