import React from 'react'
import Link from 'next/link'

import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { getPostUrl } from '@/utilities/getPostUrl'

export type HeroPostData = Pick<
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

export const HeroGrid: React.FC<{ posts: HeroPostData[] }> = ({ posts }) => {
  if (!posts || posts.length === 0) return null

  const mainPost = posts[0]
  const sidePosts = posts.slice(1, 3)

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
      {/* Main Featured Post */}
      <Link
        href={getPostUrl(mainPost)}
        className="lg:min-h-88 group relative flex min-h-64 items-end overflow-hidden rounded-xl lg:col-span-3"
      >
        {mainPost.heroImage &&
          typeof mainPost.heroImage !== 'string' &&
          typeof mainPost.heroImage !== 'number' && (
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
            <div className="mb-2 flex gap-2">
              {mainPost.categories.map((cat, i) =>
                typeof cat === 'object' && cat !== null ? (
                  <span
                    key={i}
                    className="bg-primary text-primary-foreground rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  >
                    {cat.title}
                  </span>
                ) : null,
              )}
            </div>
          )}
          <h2 className="text-balance text-lg font-bold leading-tight text-white md:text-xl lg:text-2xl">
            {mainPost.title}
          </h2>
          {mainPost.meta?.description && (
            <p className="mt-2 line-clamp-2 max-w-lg text-xs text-white/70">
              {mainPost.meta.description}
            </p>
          )}
        </div>
      </Link>

      {/* Side Posts */}
      <div className="flex flex-col gap-3 lg:col-span-2">
        {sidePosts.map((post) => (
          <Link
            key={post.slug}
            href={getPostUrl(post)}
            className="group relative flex min-h-[10rem] flex-1 items-end overflow-hidden rounded-xl"
          >
            {post.heroImage &&
              typeof post.heroImage !== 'string' &&
              typeof post.heroImage !== 'number' && (
                <Media
                  fill
                  imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                  resource={post.heroImage}
                />
              )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10 p-4">
              {post.categories && post.categories.length > 0 && (
                <div className="mb-1.5 flex gap-2">
                  {post.categories.map((cat, i) =>
                    typeof cat === 'object' && cat !== null ? (
                      <span
                        key={i}
                        className="bg-primary text-primary-foreground rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      >
                        {cat.title}
                      </span>
                    ) : null,
                  )}
                </div>
              )}
              <h3 className="text-balance text-sm font-bold leading-snug text-white md:text-base">
                {post.title}
              </h3>
              {post.meta?.description && (
                <p className="mt-1 line-clamp-2 text-[11px] text-white/60">
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
