import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { headline, heroImage, populatedAuthors, publishedAt, subtitle, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="container max-w-[48rem] mx-auto">
      {/* Versal (Headline) */}
      {headline && (
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {headline}
          </span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground mb-2 text-balance">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-base md:text-lg text-muted-foreground mb-4 text-pretty">
          {subtitle}
        </p>
      )}

      {/* Date */}
      {publishedAt && (
        <p className="text-xs text-muted-foreground mb-6">
          {'Publicado em '}
          <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
        </p>
      )}

      {/* Hero Image */}
      {heroImage && typeof heroImage !== 'string' && typeof heroImage !== 'number' && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6 bg-secondary">
          <Media fill priority imgClassName="object-cover" resource={heroImage} />
        </div>
      )}

      {/* Author */}
      {hasAuthors && (
        <div className="py-4 border-b border-border mb-6">
          <p className="text-sm text-primary font-semibold">
            {'Do portal DIAL RADIO: '}
            {formatAuthors(populatedAuthors)}
          </p>
        </div>
      )}
    </div>
  )
}
