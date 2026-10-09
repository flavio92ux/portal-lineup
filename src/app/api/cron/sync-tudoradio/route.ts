import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { syncTudoRadioNews } from '@/lib/importers/tudoradio/syncTudoRadioNews'

export const maxDuration = 120
export const dynamic = 'force-dynamic'

async function isAuthorized(req: NextRequest, payload: any): Promise<boolean> {
  const secret = process.env.CRON_SECRET

  const authHeader = req.headers.get('authorization')
  if (secret && authHeader === `Bearer ${secret}`) {
    return true
  }

  const querySecret = req.nextUrl.searchParams.get('secret')
  if (secret && querySecret === secret) {
    return true
  }

  if (!secret && process.env.NODE_ENV !== 'production') {
    return true
  }

  try {
    const requestHeaders = await headers()
    const { user } = await payload.auth({ headers: requestHeaders })
    if (user) {
      return true
    }
  } catch {
    // Não autenticado
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
  const limit = limitParam ? parseInt(limitParam, 10) : 10
  const forceDraft = draftParam === 'true'

  try {
    const report = await syncTudoRadioNews(payload, { limit, forceDraft })
    return NextResponse.json(report)
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    payload.logger.error(`[Cron Sync TudoRadio] Erro fatal: ${msg}`)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return GET(req)
}
