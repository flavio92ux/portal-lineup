import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'

import { Media } from '@/components/Media'

export const dynamic = 'force-static'
export const revalidate = 600

const reviewSelectFields = {
  title: true,
  slug: true,
  heroImage: true,
  categories: true,
  publishedAt: true,
  meta: true,
  authors: true,
  populatedAuthors: true,
  product: true,
  rating: true,
} as const

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= rating ? 'text-yellow-400' : 'text-muted-foreground/30'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: any }) {
  const heroImage =
    review.heroImage && typeof review.heroImage === 'object' ? review.heroImage : null

  return (
    <Link
      href={`/reviews/${review.slug}`}
      className="bg-card border-border hover:bg-secondary/50 group overflow-hidden rounded-lg border transition-colors"
    >
      <div className="bg-secondary relative aspect-video w-full overflow-hidden">
        {heroImage && (
          <Media
            fill
            imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
            resource={heroImage}
            size="33vw"
          />
        )}
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          {review.product?.brand && (
            <span className="text-primary text-[10px] font-semibold uppercase tracking-wider">
              {review.product.brand}
            </span>
          )}
          {review.rating && <StarRating rating={review.rating} />}
        </div>
        <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-sm font-semibold leading-snug transition-colors">
          {review.title}
        </h3>
        {review.product?.name && (
          <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">{review.product.name}</p>
        )}
      </div>
    </Link>
  )
}

function FeaturedReviewCard({ review }: { review: any }) {
  const heroImage =
    review.heroImage && typeof review.heroImage === 'object' ? review.heroImage : null

  return (
    <Link
      href={`/reviews/${review.slug}`}
      className="bg-card border-border hover:bg-secondary/50 group overflow-hidden rounded-lg border transition-colors md:col-span-2 md:row-span-2"
    >
      <div className="bg-secondary relative aspect-video w-full overflow-hidden md:aspect-[16/10]">
        {heroImage && (
          <Media
            fill
            priority
            imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
            resource={heroImage}
            size="66vw"
          />
        )}
        {/* Overlay with rating */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating || 0} size="md" />
            <span className="text-sm font-semibold text-white">{review.rating}/5</span>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6">
        {review.product?.brand && (
          <span className="text-primary mb-2 block text-xs font-semibold uppercase tracking-wider">
            {review.product.brand}
          </span>
        )}
        <h2 className="text-foreground group-hover:text-primary mb-2 text-balance text-lg font-bold leading-tight transition-colors md:text-xl">
          {review.title}
        </h2>
        {review.product?.name && (
          <p className="text-muted-foreground text-sm">{review.product.name}</p>
        )}
        {review.meta?.description && (
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
            {review.meta.description}
          </p>
        )}
      </div>
    </Link>
  )
}

export default async function ReviewsPage() {
  const payload = await getPayload({ config: configPromise })

  const reviewsResult = await payload.find({
    collection: 'reviews',
    depth: 1,
    limit: 20,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      _status: { equals: 'published' },
    },
    select: reviewSelectFields,
  })

  const reviews = reviewsResult.docs
  const featuredReview = reviews[0]
  const otherReviews = reviews.slice(1)

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="container mb-8">
        <h1 className="text-foreground mb-2 text-2xl font-bold md:text-3xl">Reviews</h1>
        <p className="text-muted-foreground">
          Analises detalhadas de produtos com notas e avaliacoes
        </p>
      </div>

      {/* Featured + Grid */}
      {reviews.length > 0 && (
        <section className="container">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featuredReview && <FeaturedReviewCard review={featuredReview} />}
            {otherReviews.map((review) => (
              <ReviewCard key={review.slug} review={review} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {reviews.length === 0 && (
        <div className="container">
          <div className="bg-secondary/50 rounded-lg py-16 text-center">
            <p className="text-muted-foreground">Nenhum review publicado ainda.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Reviews - PORTAL LINEUP',
    description:
      'Reviews e avaliacoes de produtos com analises detalhadas, notas e pros e contras.',
  }
}
