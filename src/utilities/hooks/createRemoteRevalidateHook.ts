import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Hook genérico para revalidar cache via API remota
 * Útil em produção para invalidar cache em ambientes serverless
 */
export const createRemoteRevalidateHook =
  (pathsOrPathGetter: string[] | ((doc: any) => string[])): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req: { payload } }) => {
    try {
      const paths =
        typeof pathsOrPathGetter === 'function' ? pathsOrPathGetter(doc) : pathsOrPathGetter

      // Não revalida se o documento tem controle de estado e não está publicado
      if (doc._status && doc._status !== 'published') {
        return doc
      }

      const secret = process.env.REVALIDATE_SECRET
      if (!secret) {
        payload.logger.warn('REVALIDATE_SECRET não definido, pulando revalidação remota')
        return doc
      }

      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

      const response = await fetch(`${baseUrl}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret,
          paths,
          type: 'path',
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        payload.logger.error(`Erro ao revalidar cache remoto: ${error}`)
      } else {
        payload.logger.info(`Cache revalidado com sucesso para: ${paths.join(', ')}`)
      }
    } catch (error) {
      payload.logger.error(`Erro ao chamar API de revalidação: ${error}`)
    }

    return doc
  }

export const createRemoteRevalidateDeleteHook =
  (pathsOrPathGetter: string[] | ((doc: any) => string[])): CollectionAfterDeleteHook =>
  async ({ doc, req: { payload } }) => {
    try {
      const paths =
        typeof pathsOrPathGetter === 'function' ? pathsOrPathGetter(doc) : pathsOrPathGetter

      const secret = process.env.REVALIDATE_SECRET
      if (!secret) {
        payload.logger.warn('REVALIDATE_SECRET não definido, pulando revalidação remota')
        return doc
      }

      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

      const response = await fetch(`${baseUrl}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret,
          paths,
          type: 'path',
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        payload.logger.error(`Erro ao revalidar cache remoto: ${error}`)
      } else {
        payload.logger.info(`Cache revalidado com sucesso para: ${paths.join(', ')}`)
      }
    } catch (error) {
      payload.logger.error(`Erro ao chamar API de revalidação: ${error}`)
    }

    return doc
  }
