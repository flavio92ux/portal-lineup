import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import {
  createRemoteRevalidateHook,
  createRemoteRevalidateDeleteHook,
} from '../../../utilities/hooks/createRemoteRevalidateHook'

export const revalidateUser: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc.slug) {
      const path = `/autor/${doc.slug}`

      payload.logger.info(`Revalidating user at path: ${path}`)

      revalidatePath(path)
      revalidateTag('authors-sitemap', 'max')

      // Se o slug mudou, revalida o antigo também
      if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
        const oldPath = `/autor/${previousDoc.slug}`
        payload.logger.info(`Revalidating old user at path: ${oldPath}`)
        revalidatePath(oldPath)
      }
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    if (doc.slug) {
      const path = `/autor/${doc.slug}`

      revalidatePath(path)
      revalidateTag('authors-sitemap', 'max')
    }
  }

  return doc
}

// Hooks remotos para revalidação em produção
const getUserPaths = (doc: any): string[] => {
  const paths: string[] = []

  if (doc.slug) {
    paths.push(`/autor/${doc.slug}`)
    paths.push('/authors-sitemap')
  }

  return paths
}

export const revalidateUserRemote = createRemoteRevalidateHook(getUserPaths)
export const revalidateUserDeleteRemote = createRemoteRevalidateDeleteHook(getUserPaths)
