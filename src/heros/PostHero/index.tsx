import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="container max-w-[48rem] mx-auto">
      {/* Category Tags */}
      {categories && categories.length > 0 && (
        <div className="flex gap-2 mb-4">
          {categories.map((category, index) => {
            if (typeof category === 'object' && category !== null) {
              return (
                <span
                  key={index}
                  className="text-xs font-bold uppercase tracking-wider text-primary"
                >
                  {category.title}
                </span>
              )
            }
            return null
          })}
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground mb-3 text-balance">
        {title}
      </h1>

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
