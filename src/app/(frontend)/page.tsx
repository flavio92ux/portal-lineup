import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { PostsListing } from '@/components/PostsListing'

export const dynamic = 'force-static'
export const revalidate = 600

const postSelectFields = {
  versal: true,
  title: true,
  subtitle: true,
  slug: true,
  type: true,
  heroImage: true,
  categories: true,
  publishedAt: true,
  meta: true,
  authors: true,
  populatedAuthors: true,
} as const

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
    select: postSelectFields,
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
    select: postSelectFields,
  })

  return (
    <PostsListing
      heroPosts={heroPostsResult.docs}
      latestPosts={latestPostsResult.docs}
      sectionTitle="Últimas Publicações"
      currentPage={latestPostsResult.page}
      totalPages={latestPostsResult.totalPages}
    />
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Portal Lineup - Portal de Noticias',
    description: 'Portal Lineup - As principais noticias sobre radio e TV do Brasil.',
  }
}
