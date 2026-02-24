import React from 'react'
import Link from 'next/link'

import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'

export type HeroPostData = Pick<
  Post,
  'slug' | 'title' | 'meta' | 'categories' | 'publishedAt' | 'heroImage' | 'type' | 'populatedAuthors'
>

function getPostHref(post: HeroPostData) {
  if (post.type === 'column') {
    const authorSlug = post.populatedAuthors?.[0]?.slug
    if (authorSlug) return `/autor/${authorSlug}/${post.slug}`
  }
  return `/noticias/${post.slug}`
}

export const HeroGrid: React.FC<{ posts: HeroPostData[] }> = ({ posts }) => {
  if (!posts || posts.length === 0) return null

  const mainPost = posts[0]
  const sidePosts = posts.slice(1, 3)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
      {/* Main Featured Post */}
      <Link
        href={getPostHref(mainPost)}
        className="lg:col-span-3 relative rounded-xl overflow-hidden group min-h-[16rem] lg:min-h-[22rem] flex items-end"
      >
        {mainPost.heroImage && typeof mainPost.heroImage !== 'string' && typeof mainPost.heroImage !== 'number' && (
          <Media
            fill
            priority
            imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
            resource={mainPost.heroImage}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 p-5 lg:p-6">
          {mainPost.categories && mainPost.categories.length > 0 && (
            <div className="flex gap-2 mb-2">
              {mainPost.categories.map((cat, i) =>
                typeof cat === 'object' && cat !== null ? (
                  <span
                    key={i}
                    className="text-[10px] font-bold uppercase tracking-wider bg-primary px-2 py-0.5 rounded text-primary-foreground"
                  >
                    {cat.title}
                  </span>
                ) : null,
              )}
            </div>
          )}
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold leading-tight text-white text-balance">
            {mainPost.title}
          </h2>
          {mainPost.meta?.description && (
            <p className="text-xs text-white/70 mt-2 line-clamp-2 max-w-lg">
              {mainPost.meta.description}
            </p>
          )}
        </div>
      </Link>

      {/* Side Posts */}
      <div className="lg:col-span-2 flex flex-col gap-3">
        {sidePosts.map((post) => (
          <Link
            key={post.slug}
            href={getPostHref(post)}
            className="relative rounded-xl overflow-hidden group flex-1 min-h-[10rem] flex items-end"
          >
            {post.heroImage && typeof post.heroImage !== 'string' && typeof post.heroImage !== 'number' && (
              <Media
                fill
                imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                resource={post.heroImage}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10 p-4">
              {post.categories && post.categories.length > 0 && (
                <div className="flex gap-2 mb-1.5">
                  {post.categories.map((cat, i) =>
                    typeof cat === 'object' && cat !== null ? (
                      <span
                        key={i}
                        className="text-[10px] font-bold uppercase tracking-wider bg-primary px-2 py-0.5 rounded text-primary-foreground"
                      >
                        {cat.title}
                      </span>
                    ) : null,
                  )}
                </div>
              )}
              <h3 className="text-sm md:text-base font-bold leading-snug text-white text-balance">
                {post.title}
              </h3>
              {post.meta?.description && (
                <p className="text-[11px] text-white/60 mt-1 line-clamp-2">
                  {post.meta.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
