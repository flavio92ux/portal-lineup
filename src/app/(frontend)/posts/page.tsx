import type { Metadata } from 'next/types'

import { ArticleListItem } from '@/components/ArticleListItem'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 15,
    overrideAccess: false,
    sort: '-publishedAt',
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

  return (
    <div className="pt-8 pb-16">
      <div className="container mb-6">
        <h1 className="text-2xl font-bold text-foreground">Todas as Publicacoes</h1>
      </div>

      <div className="container mb-4">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={15}
          totalDocs={posts.totalDocs}
        />
      </div>

      <div className="container">
        <div className="flex flex-col">
          {posts.docs.map((post) => (
            <ArticleListItem key={post.slug} post={post} />
          ))}
        </div>
      </div>

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Publicacoes | DIAL RADIO',
  }
}
