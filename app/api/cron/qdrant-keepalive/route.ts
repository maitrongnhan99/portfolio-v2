import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const COLLECTION_NAME = 'portfolio_knowledge'

/**
 * GET /api/cron/qdrant-keepalive
 *
 * Pings the Qdrant Cloud cluster once per day (via Vercel Cron) so the
 * free-tier cluster never hits the ~1-week inactivity-suspension threshold.
 *
 * Any authenticated read resets Qdrant's idle timer, so a single GET to the
 * collection-info endpoint is enough.
 *
 * Auth: Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` automatically.
 * Reject all other callers with 401.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  // ---- Auth ----------------------------------------------------------------
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  // ---- Ping ----------------------------------------------------------------
  const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333'
  const qdrantApiKey = process.env.QDRANT_API_KEY

  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (qdrantApiKey) {
      headers['api-key'] = qdrantApiKey
    }

    const res = await fetch(
      `${qdrantUrl}/collections/${COLLECTION_NAME}`,
      { headers }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error(`[qdrant-keepalive] Qdrant returned ${res.status}: ${text}`)
      return NextResponse.json(
        { success: false, message: `Qdrant responded with ${res.status}` },
        { status: 502 }
      )
    }

    const data = await res.json() as { result?: { points_count?: number } }
    const points = data?.result?.points_count ?? null

    return NextResponse.json({
      success: true,
      collection: COLLECTION_NAME,
      points,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[qdrant-keepalive] Failed to reach Qdrant:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to reach Qdrant',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
