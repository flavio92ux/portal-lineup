import React from 'react'
import Link from 'next/link'

import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import { getPostUrl } from '@/utilities/getPostUrl'

export type ArticleListItemData = Pick<
  Post,
  | 'slug'
  | 'title'
  | 'meta'
  | 'categories'
  | 'publishedAt'
  | 'heroImage'
  | 'type'
  | 'populatedAuthors'
>

export const ArticleListItem: React.FC<{ post: ArticleListItemData }> = ({ post }) => {
  const { title, meta, publishedAt, heroImage } = post
  const description = meta?.description

  const imageSource = heroImage

  return (
    <Link
      href={getPostUrl(post)}
      className="border-border hover:bg-secondary/30 group -mx-4 flex gap-4 rounded-lg border-b px-4 py-5 transition-colors"
    >
      {/* Thumbnail */}
      <div className="bg-secondary relative h-20 w-28 shrink-0 overflow-hidden rounded-lg md:h-24 md:w-36">
        {imageSource && typeof imageSource !== 'number' && typeof imageSource !== 'string' ? (
          <Media fill imgClassName="object-cover" resource={imageSource as Post['heroImage']} />
        ) : (
          <div className="bg-secondary h-full w-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-sm font-semibold leading-snug transition-colors md:text-base">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed md:text-sm">
            {description}
          </p>
        )}
        {publishedAt && (
          <p className="text-muted-foreground mt-2 text-[11px]">
            {'Publicado em: '}
            {formatDateTime(publishedAt)}
          </p>
        )}
      </div>
    </Link>
  )
}
