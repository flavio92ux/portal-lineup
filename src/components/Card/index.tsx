'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { getPostUrl } from '@/utilities/getPostUrl'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'type'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title, type } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = doc ? getPostUrl(doc) : '/'

  return (
    <article
      className={cn(
        'bg-card border-border hover:bg-secondary/50 group overflow-hidden rounded-lg border transition-colors hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="bg-secondary relative aspect-video w-full">
        {!metaImage && <div className="bg-secondary h-full w-full" />}
        {metaImage && typeof metaImage !== 'string' && (
          <Media
            fill
            imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
            resource={metaImage}
            size="33vw"
          />
        )}
      </div>
      <div className="p-3">
        {titleToUse && (
          <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-sm font-semibold leading-snug transition-colors">
            <Link href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        )}
        {sanitizedDescription && (
          <p className="text-muted-foreground mt-1.5 line-clamp-3 text-xs leading-relaxed">
            {sanitizedDescription}
          </p>
        )}
        {showCategories && hasCategories && (
          <div className="text-primary mt-2 text-[10px] font-semibold uppercase tracking-wider">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const categoryTitle = category.title || 'Untitled'
                const isLast = index === categories.length - 1
                return (
                  <Fragment key={index}>
                    {categoryTitle}
                    {!isLast && <Fragment>{', '}</Fragment>}
                  </Fragment>
                )
              }
              return null
            })}
          </div>
        )}
      </div>
    </article>
  )
}
