'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'rounded-lg overflow-hidden bg-card border border-border hover:cursor-pointer group transition-colors hover:bg-secondary/50',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full aspect-video bg-secondary">
        {!metaImage && <div className="w-full h-full bg-secondary" />}
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
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        )}
        {sanitizedDescription && (
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-3 leading-relaxed">
            {sanitizedDescription}
          </p>
        )}
        {showCategories && hasCategories && (
          <div className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
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
