import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const event: AnalyticsEvent = await request.json();

    // Validate the event data
    if (!event.event || !event.category || !event.action) {
      return NextResponse.json(
        { error: 'Invalid event data' },
        { status: 400 }
      );
    }

    // Log the event (in production, send to analytics service)
    console.log('Analytics Event Received:', {
      event: event.event,
      category: event.category,
      action: event.action,
      label: event.label,
      value: event.value,
      url: event.url,
      timestamp: new Date(event.timestamp).toISOString(),
    });

    // Example: Send to Google Analytics 4
    if (process.env.GA_MEASUREMENT_ID && process.env.GA_API_SECRET) {
      try {
        await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
          method: 'POST',
          body: JSON.stringify({
            client_id: 'anonymous', // You might want to generate a proper client ID
            events: [{
              name: event.event,
              params: {
                event_category: event.category,
                event_action: event.action,
                event_label: event.label,
                value: event.value,
                page_location: event.url,
              }
            }]
          })
        });
      } catch (error) {
        console.error('Failed to send to Google Analytics:', error);
      }
    }

    // Example: Send to custom analytics database
    // await saveEventToDatabase(event);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing analytics event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Analytics events endpoint',
    endpoints: {
      POST: 'Submit analytics events'
    }
  });
}
