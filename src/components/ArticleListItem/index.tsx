import React from 'react'
import Link from 'next/link'

import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'

export type ArticleListItemData = Pick<
  Post,
  'slug' | 'title' | 'meta' | 'categories' | 'publishedAt' | 'heroImage' | 'type' | 'populatedAuthors'
>

function getPostHref(post: ArticleListItemData) {
  if (post.type === 'column') {
    const authorSlug = post.populatedAuthors?.[0]?.slug
    if (authorSlug) return `/autor/${authorSlug}/${post.slug}`
  }
  return `/noticias/${post.slug}`
}

export const ArticleListItem: React.FC<{ post: ArticleListItemData }> = ({ post }) => {
  const { title, meta, publishedAt, heroImage } = post
  const description = meta?.description
  const metaImage = meta?.image

  const imageSource = heroImage || metaImage

  return (
    <Link
      href={getPostHref(post)}
      className="flex gap-4 py-5 border-b border-border group hover:bg-secondary/30 transition-colors px-4 -mx-4 rounded-lg"
    >
      {/* Thumbnail */}
      <div className="relative w-28 h-20 md:w-36 md:h-24 rounded-lg overflow-hidden shrink-0 bg-secondary">
        {imageSource && typeof imageSource !== 'number' && typeof imageSource !== 'string' ? (
          <Media
            fill
            imgClassName="object-cover"
            resource={imageSource as Post['heroImage']}
          />
        ) : (
          <div className="w-full h-full bg-secondary" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <h3 className="text-sm md:text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        {publishedAt && (
          <p className="text-[11px] text-muted-foreground mt-2">
            {'Publicado em: '}
            {formatDateTime(publishedAt)}
          </p>
        )}
      </div>
    </Link>
  )
}
