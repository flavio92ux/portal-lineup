import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    where: {
      type: { equals: 'column' },
    },
    select: {
      slug: true,
      authors: true,
    },
    depth: 1,
  })

  const params: Array<{ slug: string; 'post-slug': string }> = []

  for (const post of posts.docs) {
    if (post.authors && post.authors.length > 0) {
      const author = post.authors[0]
      const authorSlug =
        typeof author === 'object' && author !== null
          ? (author as any).slug
          : null

      if (authorSlug && post.slug) {
        params.push({
          slug: authorSlug,
          'post-slug': post.slug,
        })
      }
    }
  }

  return params
}

type Args = {
  params: Promise<{
    slug?: string
    'post-slug'?: string
  }>
}

export default async function ColunaPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug: authorSlug = '', 'post-slug': postSlug = '' } = await paramsPromise
  const decodedPostSlug = decodeURIComponent(postSlug)
  const decodedAuthorSlug = decodeURIComponent(authorSlug)
  const url = `/autor/${decodedAuthorSlug}/${decodedPostSlug}`
  const post = await queryColumnBySlug({ slug: decodedPostSlug })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { 'post-slug': postSlug = '' } = await paramsPromise
  const decodedPostSlug = decodeURIComponent(postSlug)
  const post = await queryColumnBySlug({ slug: decodedPostSlug })

  return generateMeta({ doc: post })
}

const queryColumnBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: { equals: slug },
      type: { equals: 'column' },
    },
  })

  return result.docs?.[0] || null
})
