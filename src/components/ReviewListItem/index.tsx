import React from 'react'
import Link from 'next/link'

import type { Review } from '@/payload-types'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'

export type ReviewListItemData = Pick<
  Review,
  'slug' | 'title' | 'meta' | 'publishedAt' | 'heroImage' | 'rating' | 'product'
>

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const partial = rating % 1
  const empty = 5 - Math.ceil(rating)

  return (
    <span className="flex items-center gap-0.5" aria-label={`Nota ${rating} de 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <svg
          key={`full-${i}`}
          className="text-primary h-3 w-3 fill-current"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {partial > 0 && (
        <svg
          key="partial"
          className="text-primary h-3 w-3"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="partial-home">
              <stop offset={`${partial * 100}%`} stopColor="currentColor" />
              <stop offset={`${partial * 100}%`} stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#partial-home)"
            stroke="currentColor"
            strokeWidth="0.5"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg
          key={`empty-${i}`}
          className="text-muted-foreground/30 h-3 w-3 fill-current"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-muted-foreground ml-1 text-[11px] font-medium">{rating.toFixed(1)}</span>
    </span>
  )
}

export const ReviewListItem: React.FC<{ review: ReviewListItemData }> = ({ review }) => {
  const { title, meta, publishedAt, heroImage, rating, product, slug } = review
  const description = meta?.description
  const href = `/reviews/${slug}`

  const imageSource =
    product?.image && typeof product.image === 'object' ? product.image : heroImage

  return (
    <Link
      href={href}
      title={title}
      className="border-border hover:bg-secondary/30 group -mx-4 flex gap-4 rounded-lg border-b px-4 py-5 transition-colors"
    >
      {/* Thumbnail */}
      <div className="bg-secondary relative h-20 w-28 shrink-0 overflow-hidden rounded-lg md:h-24 md:w-36">
        {imageSource && typeof imageSource !== 'number' && typeof imageSource !== 'string' ? (
          <Media fill imgClassName="object-cover" resource={imageSource as Review['heroImage']} />
        ) : (
          <div className="bg-secondary h-full w-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {/* Badge */}
        <span className="text-primary mb-1 text-[10px] font-bold uppercase tracking-wider">
          Review
          {product?.brand ? ` · ${product.brand}` : ''}
        </span>

        <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-sm font-semibold leading-snug transition-colors md:text-base">
          {title}
        </h3>

        {description && (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed md:text-sm">
            {description}
          </p>
        )}

        <div className="mt-2 flex items-center gap-3">
          {typeof rating === 'number' && <StarRating rating={rating} />}
          {publishedAt && (
            <p className="text-muted-foreground text-[11px]">{formatDateTime(publishedAt)}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
