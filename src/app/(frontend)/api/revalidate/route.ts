import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route para revalidação manual de cache
 * 
 * Uso:
 * POST /api/revalidate
 * Body: { "path": "/noticias/meu-post", "secret": "seu-secret" }
 * 
 * Ou com tag:
 * Body: { "tag": "posts-sitemap", "secret": "seu-secret" }
 * 
 * Ou revalidar tudo:
 * Body: { "all": true, "secret": "seu-secret" }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { path, tag, all, secret } = body

    // Verificar secret de autenticação
    const revalidateSecret = process.env.REVALIDATE_SECRET
    
    if (!revalidateSecret) {
      return NextResponse.json(
        { error: 'REVALIDATE_SECRET não configurado no servidor' },
        { status: 500 }
      )
    }

    if (secret !== revalidateSecret) {
      return NextResponse.json(
        { error: 'Secret inválido' },
        { status: 401 }
      )
    }

    // Revalidar tudo
    if (all) {
      revalidatePath('/', 'layout')
      revalidateTag('pages-sitemap')
      revalidateTag('posts-sitemap')
      revalidateTag('authors-sitemap')
      
      return NextResponse.json({
        revalidated: true,
        message: 'Todo o cache foi revalidado',
        timestamp: Date.now(),
      })
    }

    // Revalidar por tag
    if (tag) {
      revalidateTag(tag)
      
      return NextResponse.json({
        revalidated: true,
        tag,
        timestamp: Date.now(),
      })
    }

    // Revalidar por path
    if (path) {
      revalidatePath(path)
      
      return NextResponse.json({
        revalidated: true,
        path,
        timestamp: Date.now(),
      })
    }

    return NextResponse.json(
      { error: 'Forneça "path", "tag" ou "all" no body da requisição' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: String(error) },
      { status: 500 }
    )
  }
}

// GET para verificar se a rota está funcionando
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    message: 'Rota de revalidação ativa. Use POST para revalidar cache.',
    usage: {
      path: 'POST com { "path": "/sua-pagina", "secret": "seu-secret" }',
      tag: 'POST com { "tag": "posts-sitemap", "secret": "seu-secret" }',
      all: 'POST com { "all": true, "secret": "seu-secret" }',
    },
  })
}
