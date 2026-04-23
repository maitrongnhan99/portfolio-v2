import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const secret = searchParams.get('secret')
  const path = searchParams.get('path')
  const tagsParam = searchParams.get('tags')

  // Validate secret
  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { success: false, message: 'Invalid or missing secret' },
      { status: 401 }
    )
  }

  // Check if at least one revalidation target is provided
  if (!path && !tagsParam) {
    return NextResponse.json(
      { success: false, message: 'Either path or tags parameter is required' },
      { status: 400 }
    )
  }

  try {
    const revalidated: { paths?: string[]; tags?: string[] } = {}

    // Revalidate path if provided
    if (path) {
      revalidatePath(path)
      revalidated.paths = [path]
    }

    // Revalidate tags if provided
    if (tagsParam) {
      const tags = tagsParam.split(',').map(tag => tag.trim()).filter(Boolean)
      
      if (tags.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Invalid tags parameter - no valid tags found' },
          { status: 400 }
        )
      }

      tags.forEach(tag => revalidateTag(tag, 'max'))
      revalidated.tags = tags
    }

    return NextResponse.json({
      success: true,
      message: 'Cache revalidated successfully',
      revalidated
    })

  } catch (error) {
    console.error('Error revalidating cache:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to revalidate cache',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}