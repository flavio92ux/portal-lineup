import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { secret, paths, type } = body

    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json({ message: 'Missing or invalid paths' }, { status: 400 })
    }

    const revalidatedPaths: string[] = []

    for (const p of paths) {
      if (type === 'tag') {
        revalidateTag(p, 'max')
      } else {
        revalidatePath(p)
      }
      revalidatedPaths.push(p)
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      paths: revalidatedPaths,
      type: type || 'path',
    })
  } catch (err: any) {
    return NextResponse.json({ message: 'Error revalidating', error: err.message }, { status: 500 })
  }
}
