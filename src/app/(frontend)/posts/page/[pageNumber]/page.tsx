import type { Metadata } from 'next/types'

import { ArticleListItem } from '@/components/ArticleListItem'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 15,
    page: sanitizedPageNumber,
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
    <div className="pb-16 pt-8">
      <div className="container mb-6">
        <h1 className="text-foreground text-2xl font-bold">Publicacoes</h1>
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
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Publicacoes - Pagina ${pageNumber || ''} | PORTAL LINEUP`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
