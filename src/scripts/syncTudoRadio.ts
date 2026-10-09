import type { Payload } from 'payload'
import { syncTudoRadioNews } from '../lib/importers/tudoradio/syncTudoRadioNews'

/**
 * Script executável via CLI do Payload:
 * Ex: pnpm payload run ./src/scripts/syncTudoRadio.ts
 */
export default async function run({ payload }: { payload: Payload }) {
  payload.logger.info('Iniciando rotina de sincronização Tudo Rádio via script...')
  const report = await syncTudoRadioNews(payload, { limit: 10, forceDraft: false })
  payload.logger.info(
    `Relatório: ${report.importedCount} notícias importadas, ${report.skippedCount} já existentes, ${report.errorCount} erros.`,
  )
  return report
}
