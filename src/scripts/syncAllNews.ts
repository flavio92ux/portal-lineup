import type { Payload } from 'payload'
import { syncDialRadioNews } from '../lib/importers/dialradio/syncDialRadioNews'
import { syncTudoRadioNews } from '../lib/importers/tudoradio/syncTudoRadioNews'

/**
 * Script executável via CLI do Payload para sincronizar todas as fontes:
 * Ex: pnpm payload run ./src/scripts/syncAllNews.ts
 */
export default async function run({ payload }: { payload: Payload }) {
  payload.logger.info('Iniciando rotina de sincronização unificada (Dial Rádio + Tudo Rádio)...')

  payload.logger.info('--- 1/2 Sincronizando Dial Rádio ---')
  const dialReport = await syncDialRadioNews(payload, { limit: 10, forceDraft: false })

  payload.logger.info('--- 2/2 Sincronizando Tudo Rádio ---')
  const tudoReport = await syncTudoRadioNews(payload, { limit: 10, forceDraft: false })

  const totalImported = dialReport.importedCount + tudoReport.importedCount
  const totalSkipped = dialReport.skippedCount + tudoReport.skippedCount
  const totalErrors = dialReport.errorCount + tudoReport.errorCount

  payload.logger.info(
    `Relatório Final: ${totalImported} notícias importadas, ${totalSkipped} já existentes, ${totalErrors} erros.`,
  )

  return { dialradio: dialReport, tudoradio: tudoReport }
}
