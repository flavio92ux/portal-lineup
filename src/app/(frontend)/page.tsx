import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { HeroGrid } from '@/components/HeroGrid'
import { ArticleListItem } from '@/components/ArticleListItem'
import { Pagination } from '@/components/Pagination'

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
    limit: 15,
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

  const heroPosts = heroPostsResult.docs
  const latestPosts = latestPostsResult.docs

  return (
    <div className="pb-16">
      {/* Hero Grid */}
      <section className="container mb-8">
        <HeroGrid posts={heroPosts} />
      </section>

      {/* Divider */}
      <div className="container">
        <p className="text-muted-foreground mb-6 text-sm font-semibold">Últimas Notícias</p>
      </div>

      {/* Article List */}
      <section className="container">
        <div className="flex flex-col gap-2">
          {latestPosts.map((post) => (
            <ArticleListItem key={post.slug} post={post} />
          ))}
        </div>

        {latestPostsResult.totalPages > 1 && latestPostsResult.page && (
          <Pagination page={latestPostsResult.page} totalPages={latestPostsResult.totalPages} />
        )}
      </section>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'DIAL RADIO - Portal de Noticias',
    description: 'DIAL RADIO - As principais noticias sobre radio e TV do Brasil.',
  }
}
