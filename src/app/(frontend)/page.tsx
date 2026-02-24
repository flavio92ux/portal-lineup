import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'

import { Media } from '@/components/Media'
import { CollectionArchive } from '@/components/CollectionArchive'
import { formatDateTime } from '@/utilities/formatDateTime'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const heroPostsResult = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 3,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      _status: { equals: 'published' },
    },
    select: {
      title: true,
      slug: true,
      type: true,
      heroImage: true,
      categories: true,
      publishedAt: true,
      meta: true,
      authors: true,
      populatedAuthors: true,
    },
  })

  const latestPostsResult = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      _status: { equals: 'published' },
    },
    select: {
      title: true,
      slug: true,
      type: true,
      categories: true,
      meta: true,
    },
  })

  const heroPosts = heroPostsResult.docs
  const latestPosts = latestPostsResult.docs
  const mainHero = heroPosts[0]
  const sideHeroes = heroPosts.slice(1)

  function getPostHref(post: { type?: string | null; slug?: string | null; populatedAuthors?: any[] | null }) {
    if (post.type === 'column') {
      const authorSlug = post.populatedAuthors?.[0]?.slug
      if (authorSlug) return `/autor/${authorSlug}/${post.slug}`
    }
    return `/noticias/${post.slug}`
  }

  return (
    <div className="pt-20 pb-24">
      {/* Hero Section */}
      {mainHero && (
        <section className="container mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Main Hero */}
            <Link
              href={getPostHref(mainHero)}
              className="lg:col-span-2 relative rounded-xl overflow-hidden group min-h-[24rem] lg:min-h-[28rem] flex items-end"
            >
              {mainHero.heroImage && typeof mainHero.heroImage !== 'string' && (
                <Media
                  fill
                  priority
                  imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                  resource={mainHero.heroImage}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative z-10 p-6 lg:p-8 text-white">
                {mainHero.categories && mainHero.categories.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {mainHero.categories.map((cat, i) => (
                      typeof cat === 'object' && cat !== null && (
                        <span
                          key={i}
                          className="text-xs font-semibold uppercase tracking-wider bg-primary/90 px-2.5 py-1 rounded"
                        >
                          {cat.title}
                        </span>
                      )
                    ))}
                    {mainHero.type === 'column' && (
                      <span className="text-xs font-semibold uppercase tracking-wider bg-accent/90 px-2.5 py-1 rounded">
                        Coluna
                      </span>
                    )}
                  </div>
                )}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-balance">
                  {mainHero.title}
                </h2>
                {mainHero.publishedAt && (
                  <p className="text-sm text-white/70 mt-3">
                    {formatDateTime(mainHero.publishedAt)}
                  </p>
                )}
              </div>
            </Link>

            {/* Side Heroes */}
            <div className="flex flex-col gap-4 lg:gap-6">
              {sideHeroes.map((post, index) => (
                <Link
                  key={post.slug}
                  href={getPostHref(post)}
                  className="relative rounded-xl overflow-hidden group flex-1 min-h-[12rem] flex items-end"
                >
                  {post.heroImage && typeof post.heroImage !== 'string' && (
                    <Media
                      fill
                      priority={index === 0}
                      imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                      resource={post.heroImage}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="relative z-10 p-4 lg:p-5 text-white">
                    {post.type === 'column' && (
                      <span className="text-xs font-semibold uppercase tracking-wider bg-accent/90 px-2 py-0.5 rounded mb-2 inline-block">
                        Coluna
                      </span>
                    )}
                    <h3 className="text-lg lg:text-xl font-bold leading-snug text-balance">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section>
        <div className="container mb-8">
          <h2 className="text-2xl font-bold">Ultimas Publicacoes</h2>
        </div>
        <CollectionArchive posts={latestPosts} />
      </section>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Lineup Brasil - Portal de Noticias',
    description:
      'Lineup Brasil - As principais noticias, colunas e analises dos melhores redatores do Brasil.',
  }
}
