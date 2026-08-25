import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Não autorizado. Token de revalidação inválido.' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const path = body.path || '/'
    const tag = body.tag

    if (tag) {
      revalidateTag(tag, {})
    } else {
      revalidatePath(path)
    }

    return NextResponse.json({
      revalidated: true,
      path,
      tag: tag || null,
      now: Date.now(),
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Erro ao revalidar cache.', details: err.message },
      { status: 500 }
    )
  }
}
