import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'
import Link from 'next/link'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { headline, heroImage, populatedAuthors, publishedAt, subtitle, title } = post

  const validAuthors = populatedAuthors?.filter((author) => author.name) || []
  const hasAuthors = validAuthors.length > 0

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
        <p className="text-muted-foreground mb-4 text-pretty text-base md:text-lg">{subtitle}</p>
      )}

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

      {/* Author */}
      {hasAuthors && (
        <div className="border-border mb-6 border-b py-4">
          <p className="text-primary text-sm font-semibold">
            {'De Portal Lineup: '}
            {validAuthors.map((author, index) => {
              const isLast = index === validAuthors.length - 1
              const isPenultimate = index === validAuthors.length - 2
              const hasSlug = Boolean(author.slug)

              const separator = isLast ? '' : isPenultimate ? ' e ' : ', '

              return (
                <span key={author.id || index}>
                  {hasSlug ? (
                    <Link href={`/autor/${author.slug}`} className="hover:underline">
                      {author.name}
                    </Link>
                  ) : (
                    <span>{author.name}</span>
                  )}
                  {separator}
                </span>
              )
            })}
          </p>
        </div>
      )}
    </div>
  )
}
