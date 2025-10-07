import { checkPayloadHealth, getDataSource } from '@/lib/data-service-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const health = await checkPayloadHealth()
    const dataSource = getDataSource()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: health.available ? 'healthy' : 'degraded',
      payload: {
        available: health.available,
        source: health.source,
        error: health.error,
      },
      dataSource,
      message: health.available 
        ? 'Payload CMS is operational' 
        : `Payload CMS unavailable: ${health.error}. Using fallback data.`,
    })
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        status: 'error',
        payload: {
          available: false,
          source: 'Unknown',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        dataSource: 'Static Data (Error Fallback)',
        message: 'Health check failed',
      },
      { status: 500 }
    )
  }
}