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
    <article className="pt-8 pb-16">
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="container max-w-[48rem] mx-auto">
        <RichText className="prose-sm md:prose dark:prose-invert max-w-none" data={post.content} enableGutter={false} />
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-base font-semibold text-foreground mb-6">Leia tambem</h3>
            <RelatedPosts
              className="!p-0"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          </div>
        )}
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
