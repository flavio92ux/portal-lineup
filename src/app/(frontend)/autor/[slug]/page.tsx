import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CollectionArchive } from '@/components/CollectionArchive'
import { getServerSideURL } from '@/utilities/getURL'
import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const users = await payload.find({
    collection: 'users',
    limit: 1000,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return users.docs.filter((user) => user.slug).map((user) => ({ slug: user.slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const socialIcons: Record<string, string> = {
  twitter: 'X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  website: 'Site',
}

export default async function AutorPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const author = await queryAuthorBySlug({ slug: decodedSlug })

  if (!author) return notFound()

  const payload = await getPayload({ config: configPromise })

  const authorPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 20,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      and: [{ _status: { equals: 'published' } }, { authors: { contains: author.id } }],
    },
    select: {
      title: true,
      slug: true,
      type: true,
      categories: true,
      meta: true,
    },
  })

  const socials = (author as any).socials as Array<{ platform: string; url: string }> | undefined

  return (
    <div className="pb-24 pt-24">
      <PageClient />

      {/* Author Profile Header */}
      <section className="container mb-16">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-8 md:flex-row">
          {/* Avatar */}
          <div className="shrink-0">
            {(author as any).avatar && typeof (author as any).avatar !== 'string' ? (
              <div className="border-primary/20 h-32 w-32 overflow-hidden rounded-full border-4">
                <Media
                  resource={(author as any).avatar}
                  imgClassName="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-muted border-primary/20 flex h-32 w-32 items-center justify-center rounded-full border-4">
                <span className="text-muted-foreground text-4xl font-bold">
                  {author.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">{author.name}</h1>

            {(author as any).bio && (
              <div className="mb-6">
                <RichText
                  data={(author as any).bio}
                  enableGutter={false}
                  className="prose-sm max-w-none"
                />
              </div>
            )}

            {/* Social Links */}
            {socials && socials.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted hover:bg-primary hover:text-primary-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                  >
                    {socialIcons[social.platform] || social.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Author's Posts */}
      <section>
        <div className="container mb-8">
          <h2 className="text-2xl font-bold">{'Publicações de ' + (author.name || 'Autor')}</h2>
        </div>
        {authorPosts.docs.length > 0 ? (
          <CollectionArchive posts={authorPosts.docs} />
        ) : (
          <div className="container">
            <p className="text-muted-foreground">Nenhuma publicacao encontrada.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const author = await queryAuthorBySlug({ slug: decodedSlug })

  if (!author) {
    return {
      title: 'Autor nao encontrado | Lineup Brasil',
    }
  }

  const serverURL = getServerSideURL()

  return {
    title: `${author.name} | Lineup Brasil`,
    description: `Perfil e publicacoes de ${author.name} no Lineup Brasil.`,
    openGraph: {
      title: `${author.name} | Lineup Brasil`,
      description: `Perfil e publicacoes de ${author.name} no Lineup Brasil.`,
      url: `${serverURL}/autor/${slug}`,
      siteName: 'Lineup Brasil',
      ...((author as any).avatar && typeof (author as any).avatar === 'object'
        ? {
            images: [
              {
                url: (author as any).avatar.url
                  ? `${serverURL}${(author as any).avatar.url}`
                  : `${serverURL}/og-image.png`,
              },
            ],
          }
        : {}),
    },
  }
}

const queryAuthorBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'users',
    limit: 1,
    pagination: false,
    where: {
      slug: { equals: slug },
    },
  })

  return result.docs?.[0] || null
})
