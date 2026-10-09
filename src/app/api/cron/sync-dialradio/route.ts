import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { syncDialRadioNews } from '@/lib/importers/dialradio/syncDialRadioNews'
import { syncTudoRadioNews } from '@/lib/importers/tudoradio/syncTudoRadioNews'

export const maxDuration = 120 // Permite até 2 minutos de execução para downloads e importações
export const dynamic = 'force-dynamic'

/**
 * Valida a autorização da requisição cron.
 * Aceita:
 * 1. Header `Authorization: Bearer <CRON_SECRET>`
 * 2. Query param `?secret=<CRON_SECRET>`
 * 3. Usuário autenticado no painel admin
 */
async function isAuthorized(req: NextRequest, payload: any): Promise<boolean> {
  const secret = process.env.CRON_SECRET

  // 1. Verificação por Bearer token
  const authHeader = req.headers.get('authorization')
  if (secret && authHeader === `Bearer ${secret}`) {
    return true
  }

  // 2. Verificação por Query Param
  const querySecret = req.nextUrl.searchParams.get('secret')
  if (secret && querySecret === secret) {
    return true
  }

  // 3. Se não houver segredo configurado no .env, permite em ambiente de desenvolvimento
  if (!secret && process.env.NODE_ENV !== 'production') {
    return true
  }

  // 4. Verificação de usuário autenticado
  try {
    const requestHeaders = await headers()
    const { user } = await payload.auth({ headers: requestHeaders })
    if (user) {
      return true
    }
  } catch {
    // Se falhar a autenticação por cookie, segue para não autorizado
  }

  return false
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const payload = await getPayload({ config })

  const authorized = await isAuthorized(req, payload)
  if (!authorized) {
    return NextResponse.json(
      {
        error: 'Não autorizado. Envie o Bearer token ou o parâmetro ?secret= correspondente a CRON_SECRET.',
      },
      { status: 401 },
    )
  }

  const limitParam = req.nextUrl.searchParams.get('limit')
  const draftParam = req.nextUrl.searchParams.get('draft')
  const sourceParam = (req.nextUrl.searchParams.get('source') || 'all').toLowerCase()
  const limit = limitParam ? parseInt(limitParam, 10) : 10
  const forceDraft = draftParam === 'true'

  const startedAt = new Date().toISOString()

  try {
    if (sourceParam === 'dialradio') {
      const dialReport = await syncDialRadioNews(payload, { limit, forceDraft })
      return NextResponse.json(dialReport)
    }

    if (sourceParam === 'tudoradio') {
      const tudoReport = await syncTudoRadioNews(payload, { limit, forceDraft })
      return NextResponse.json(tudoReport)
    }

    // Execução conjunta padrão (mesma cron rodando Dial Rádio + Tudo Rádio)
    payload.logger.info('[Cron Sync News] Executando rotina para Dial Rádio e Tudo Rádio...')
    const dialReport = await syncDialRadioNews(payload, { limit, forceDraft })
    const tudoReport = await syncTudoRadioNews(payload, { limit, forceDraft })

    const finishedAt = new Date().toISOString()

    return NextResponse.json({
      success: dialReport.success && tudoReport.success,
      source: 'all',
      totalImported: dialReport.importedCount + tudoReport.importedCount,
      totalSkipped: dialReport.skippedCount + tudoReport.skippedCount,
      totalErrors: dialReport.errorCount + tudoReport.errorCount,
      dialradio: dialReport,
      tudoradio: tudoReport,
      startedAt,
      finishedAt,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    payload.logger.error(`[Cron Sync News] Erro fatal: ${msg}`)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return GET(req)
}

