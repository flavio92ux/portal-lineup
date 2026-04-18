import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Review } from '../../../payload-types'
import { getReviewUrl } from '@/utilities/getReviewUrl'
import {
  createRemoteRevalidateHook,
  createRemoteRevalidateDeleteHook,
} from '../../../utilities/hooks/createRemoteRevalidateHook'

export const revalidateReview: CollectionAfterChangeHook<Review> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = getReviewUrl(doc)

      payload.logger.info(`Revalidating review at path: ${path}`)

      revalidatePath(path)
      revalidateTag('reviews-sitemap', 'max')

      // Also revalidate listing pages
      revalidatePath('/')
      revalidatePath('/reviews')
    }

    // If the review was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = getReviewUrl(previousDoc)

      payload.logger.info(`Revalidating old review at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('reviews-sitemap', 'max')

      // Also revalidate listing pages
      revalidatePath('/')
      revalidatePath('/reviews')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Review> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = getReviewUrl(doc)

    revalidatePath(path)
    revalidateTag('reviews-sitemap', 'max')

    // Also revalidate listing pages
    revalidatePath('/')
    revalidatePath('/reviews')
  }

  return doc
}

// Hooks remotos para revalidacao em producao
const getReviewPaths = (doc: Review): string[] => {
  const path = getReviewUrl(doc)
  return [path, '/reviews-sitemap', '/', '/reviews']
}

export const revalidateReviewRemote = createRemoteRevalidateHook(getReviewPaths)
export const revalidateReviewDeleteRemote = createRemoteRevalidateDeleteHook(getReviewPaths)
