import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'
import { getPostUrl } from '@/utilities/getPostUrl'
import {
  createRemoteRevalidateHook,
  createRemoteRevalidateDeleteHook,
} from '../../../utilities/hooks/createRemoteRevalidateHook'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = getPostUrl(doc)

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidateTag('posts-sitemap')
      
      // Also revalidate listing pages
      revalidatePath('/')
      revalidatePath('/noticias')
      revalidatePath('/colunas')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = getPostUrl(previousDoc)

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('posts-sitemap')
      
      // Also revalidate listing pages
      revalidatePath('/')
      revalidatePath('/noticias')
      revalidatePath('/colunas')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = getPostUrl(doc)

    revalidatePath(path)
    revalidateTag('posts-sitemap')
    
    // Also revalidate listing pages
    revalidatePath('/')
    revalidatePath('/noticias')
    revalidatePath('/colunas')
  }

  return doc
}

// Hooks remotos para revalidação em produção
const getPostPaths = (doc: Post): string[] => {
  const path = getPostUrl(doc)
  return [path, '/posts-sitemap', '/', '/noticias', '/colunas']
}

export const revalidatePostRemote = createRemoteRevalidateHook(getPostPaths)
export const revalidatePostDeleteRemote = createRemoteRevalidateDeleteHook(getPostPaths)
