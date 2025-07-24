import { NextRequest, NextResponse } from 'next/server';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  userAgent: string;
}

export async function POST(request: NextRequest) {
  try {
    const metric: PerformanceMetric = await request.json();

    // Validate the metric data
    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      );
    }

    // In production, you would send this to your analytics service
    // For now, we'll just log it
    console.log('Performance Metric Received:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      url: metric.url,
      timestamp: new Date(metric.timestamp).toISOString(),
    });

    // Example: Send to Google Analytics 4
    if (process.env.GA_MEASUREMENT_ID && process.env.GA_API_SECRET) {
      try {
        await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
          method: 'POST',
          body: JSON.stringify({
            client_id: 'anonymous', // You might want to generate a proper client ID
            events: [{
              name: 'web_vitals',
              params: {
                metric_name: metric.name,
                metric_value: metric.value,
                metric_rating: metric.rating,
                page_location: metric.url,
              }
            }]
          })
        });
      } catch (error) {
        console.error('Failed to send to Google Analytics:', error);
      }
    }

    // Example: Send to custom analytics database
    // await saveMetricToDatabase(metric);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing performance metric:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Performance analytics endpoint',
    endpoints: {
      POST: 'Submit performance metrics'
    }
  });
}
