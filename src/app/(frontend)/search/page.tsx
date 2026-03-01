import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      type: true,
      title: true,
      slug: true,
      heroImage: true,
      categories: true,
      meta: true,
      authors: true,
      publishedAt: true,
    },
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pb-16 pt-8">
      <PageClient />
      <div className="container mb-8">
        <h1 className="text-foreground mb-6 text-2xl font-bold">Buscar</h1>
        <div className="max-w-[40rem]">
          <Search />
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as any[]} />
      ) : (
        <div className="text-muted-foreground container text-sm">Nenhum resultado encontrado.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Buscar | DIAL RADIO',
  }
}
