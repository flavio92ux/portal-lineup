import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'
import Link from 'next/link'

import type { Review } from '@/payload-types'

import { Media } from '@/components/Media'
import { ShareBar } from '@/components/ShareBar'
import { getServerSideURL } from '@/utilities/getURL'

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl font-bold',
  }

  return (
    <div className="flex items-center gap-1" aria-label={`Nota ${rating} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating)
        const partial = !filled && star === Math.ceil(rating) && rating % 1 !== 0
        const fillPercent = partial ? (rating % 1) * 100 : 0

        return (
          <div key={star} className="relative">
            {/* Background star (empty) */}
            <svg
              className={`${sizeClasses[size]} text-muted-foreground/30`}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {/* Foreground star (filled or partial) */}
            {(filled || partial) && (
              <svg
                className={`${sizeClasses[size]} absolute inset-0 text-yellow-400`}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
                style={partial ? { clipPath: `inset(0 ${100 - fillPercent}% 0 0)` } : undefined}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
          </div>
        )
      })}
      <span className={`text-foreground ml-2 font-semibold ${textSizeClasses[size]}`}>
        {rating.toFixed(1)}/5
      </span>
    </div>
  )
}

export const ReviewHero: React.FC<{
  review: Review
}> = ({ review }) => {
  const {
    headline,
    heroImage,
    populatedAuthors,
    publishedAt,
    subtitle,
    title,
    slug,
    meta,
    product,
    rating,
  } = review

  const baseUrl = getServerSideURL()
  const reviewPath = `/reviews/${slug}`
  const fullUrl = `${baseUrl}${reviewPath}`

  const validAuthors = populatedAuthors?.filter((author) => author.name) || []
  const hasAuthors = validAuthors.length > 0

  const productImage =
    product?.image && typeof product.image === 'object' && 'url' in product.image
      ? product.image
      : null

  return (
    <div className="container mx-auto max-w-3xl">
      {/* Versal (Headline) */}
      {headline && (
        <div className="mb-4">
          <span className="text-primary text-xs font-bold uppercase tracking-wider">
            {headline}
          </span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-foreground mb-2 text-balance text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <h2 className="text-muted-foreground mb-4 text-pretty text-base md:text-lg">{subtitle}</h2>
      )}

      {/* 1. SCOREBOX COMPACTO NO TOPO */}
      <div className="bg-card border-border mb-6 flex items-center gap-4 rounded-xl border p-4 shadow-sm">
        {/* Product Image */}
        {productImage && (
          <div className="bg-secondary relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
            <Media fill imgClassName="object-contain" resource={productImage} />
          </div>
        )}
        {/* Product Info */}
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-foreground text-base font-semibold">{product?.name || title}</p>
          {product?.brand && (
            <p className="text-muted-foreground text-sm">{product.brand}</p>
          )}
        </div>
        {/* Rating Badge */}
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={rating || 0} size="md" />
        </div>
      </div>

      {/* Date and Author Row */}
      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {/* Author */}
        {hasAuthors && (
          <p className="text-muted-foreground">
            {'Por '}
            {validAuthors.map((author, index) => {
              const isLast = index === validAuthors.length - 1
              const isPenultimate = index === validAuthors.length - 2
              const hasSlug = Boolean(author.slug)
              const separator = isLast ? '' : isPenultimate ? ' e ' : ', '

              return (
                <span key={author.id || index}>
                  {hasSlug ? (
                    <Link
                      title={author.name || 'link do autor'}
                      href={`/autor/${author.slug}`}
                      className="text-primary hover:underline"
                    >
                      {author.name}
                    </Link>
                  ) : (
                    <span className="text-foreground">{author.name}</span>
                  )}
                  {separator}
                </span>
              )
            })}
          </p>
        )}

        {/* Date */}
        {publishedAt && (
          <p className="text-muted-foreground">
            <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
          </p>
        )}

        {/* Share Bar */}
        <div className="ml-auto">
          <ShareBar url={fullUrl} title={title} description={meta?.description || subtitle || ''} />
        </div>
      </div>

      {/* Hero Image */}
      {heroImage && typeof heroImage !== 'string' && typeof heroImage !== 'number' && (
        <div className="bg-secondary relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
          <Media fill priority imgClassName="object-cover" resource={heroImage} />
        </div>
      )}
    </div>
  )
}
