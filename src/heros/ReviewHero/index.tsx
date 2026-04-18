import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'
import Link from 'next/link'

import type { Review } from '@/payload-types'

import { Media } from '@/components/Media'
import { ShareBar } from '@/components/ShareBar'
import { getServerSideURL } from '@/utilities/getURL'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Nota ${rating} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-5 w-5 ${star <= rating ? 'text-yellow-400' : 'text-muted-foreground/30'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-foreground ml-2 text-sm font-semibold">{rating}/5</span>
    </div>
  )
}

function ProsConsList({
  items,
  type,
}: {
  items: Array<{ text: string }> | null | undefined
  type: 'pros' | 'cons'
}) {
  if (!items || items.length === 0) return null

  const isPros = type === 'pros'
  const title = isPros ? 'Pontos Positivos' : 'Pontos Negativos'

  return (
    <div
      className={`rounded-lg border p-4 ${
        isPros
          ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30'
          : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30'
      }`}
    >
      <h3
        className={`mb-3 flex items-center gap-2 text-sm font-semibold ${
          isPros ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
        }`}
      >
        {isPros ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className={`flex items-start gap-2 text-sm ${
              isPros ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
            }`}
          >
            <span
              className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                isPros ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            {item.text}
          </li>
        ))}
      </ul>
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
    pros,
    cons,
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

      {/* Product Info + Rating */}
      <div className="bg-secondary/50 mb-6 flex flex-col gap-4 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {productImage && (
            <div className="bg-background relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
              <Media fill imgClassName="object-contain" resource={productImage} />
            </div>
          )}
          <div>
            <p className="text-foreground text-sm font-semibold">{product?.name}</p>
            <p className="text-muted-foreground text-xs">{product?.brand}</p>
          </div>
        </div>
        <StarRating rating={rating || 0} />
      </div>

      {/* Date */}
      {publishedAt && (
        <p className="text-muted-foreground mb-6 text-xs">
          {'Publicado em '}
          <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
        </p>
      )}

      {/* Hero Image */}
      {heroImage && typeof heroImage !== 'string' && typeof heroImage !== 'number' && (
        <div className="bg-secondary relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
          <Media fill priority imgClassName="object-cover" resource={heroImage} />
        </div>
      )}

      {/* Pros and Cons */}
      {((pros && pros.length > 0) || (cons && cons.length > 0)) && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <ProsConsList items={pros} type="pros" />
          <ProsConsList items={cons} type="cons" />
        </div>
      )}

      {/* Author and Share Bar */}
      <div className="border-border mb-6 flex flex-col gap-4 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Author */}
        {hasAuthors && (
          <p className="text-sm font-semibold">
            {'De Portal Lineup: '}
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
                      className="hover:underline"
                    >
                      <span className="text-blue-500 underline">{author.name}</span>
                    </Link>
                  ) : (
                    <span>{author.name}</span>
                  )}
                  {separator}
                </span>
              )
            })}
          </p>
        )}

        {/* Share Bar */}
        <ShareBar url={fullUrl} title={title} description={meta?.description || subtitle || ''} />
      </div>
    </div>
  )
}
