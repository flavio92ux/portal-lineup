import type { Review } from '@/payload-types'

type ReviewWithSlug = Pick<Review, 'slug'>

/**
 * Returns the URL path for a review
 * Reviews are always at /reviews/[slug]
 */
export function getReviewUrl(review: ReviewWithSlug): string {
  return `/reviews/${review.slug}`
}
