import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { PostsListing } from '@/components/PostsListing'
import { HomePageJsonLd } from '@/components/JsonLd'
import { getServerSideURL } from '@/utilities/getURL'

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

  const allPosts = [...heroPostsResult.docs, ...latestPostsResult.docs].map((post) => ({
    title: post.title,
    slug: post.slug,
    heroImage:
      post.heroImage && typeof post.heroImage === 'object'
        ? {
            url: post.heroImage.url,
            sizes: post.heroImage.sizes,
          }
        : null,
  }))

  return (
    <>
      <HomePageJsonLd posts={allPosts} />
      <PostsListing
        heroPosts={heroPostsResult.docs}
        latestPosts={latestPostsResult.docs}
        sectionTitle="Últimas Publicações"
        currentPage={latestPostsResult.page}
        totalPages={latestPostsResult.totalPages}
      />
    </>
  )
}

export function generateMetadata(): Metadata {
  const serverUrl = getServerSideURL()

  return {
    title: 'Portal Lineup - Portal de Notícias sobre Rádio e TV do Brasil',
    description:
      'Portal Lineup - As principais notícias, análises e colunas sobre rádio e TV do Brasil. Cobertura completa do mercado de comunicação brasileiro.',
    keywords: [
      'notícias rádio',
      'notícias tv',
      'televisão brasileira',
      'rádio brasil',
      'mídia brasileira',
      'comunicação',
      'jornalismo',
      'portal lineup',
      'bastidores tv',
      'audiência',
    ],
    alternates: {
      canonical: serverUrl,
    },
    openGraph: {
      title: 'Portal Lineup - Portal de Notícias sobre Rádio e TV do Brasil',
      description:
        'As principais notícias, análises e colunas sobre rádio e TV do Brasil. Cobertura completa do mercado de comunicação brasileiro.',
      url: serverUrl,
      siteName: 'Portal Lineup',
      locale: 'pt_BR',
      type: 'website',
      images: [
        {
          url: `${serverUrl}/web-app-manifest-512x512.png`,
          width: 512,
          height: 512,
          alt: 'Portal Lineup - Portal de Notícias',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Portal Lineup - Portal de Notícias sobre Rádio e TV do Brasil',
      description:
        'As principais notícias, análises e colunas sobre rádio e TV do Brasil.',
      site: '@portallineup',
      creator: '@portallineup',
      images: [`${serverUrl}/web-app-manifest-512x512.png`],
    },
  }
}
