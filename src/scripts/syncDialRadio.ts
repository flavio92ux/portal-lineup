import type { Payload } from 'payload'
import { syncDialRadioNews } from '../lib/importers/dialradio/syncDialRadioNews'

/**
 * Script executável via CLI do Payload:
 * Ex: pnpm payload run ./src/scripts/syncDialRadio.ts
 */
export default async function run({ payload }: { payload: Payload }) {
  payload.logger.info('Iniciando rotina de sincronização Dial Rádio via script...')
  const report = await syncDialRadioNews(payload, { limit: 15, forceDraft: false })
  payload.logger.info(
    `Relatório: ${report.importedCount} notícias importadas, ${report.skippedCount} já existentes, ${report.errorCount} erros.`,
  )
  return report
}
