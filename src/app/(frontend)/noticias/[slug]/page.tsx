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
      type: { equals: 'news' },
    },
    select: {
      slug: true,
    },
  })

  return posts.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function NoticiaPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/noticias/' + decodedSlug
  const post = await queryNewsBySlug({ slug: decodedSlug })

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
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryNewsBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryNewsBySlug = cache(async ({ slug }: { slug: string }) => {
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
      type: { equals: 'news' },
    },
  })

  return result.docs?.[0] || null
})
