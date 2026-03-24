import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import { notFound } from 'next/navigation'
import { Mail, Instagram, Linkedin, Twitter, Youtube, Link2, Facebook } from 'lucide-react'

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

const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase()
  if (p === 'twitter' || p === 'x') return <Twitter className="h-8 w-8" />
  if (p === 'instagram') return <Instagram className="h-8 w-8" />
  if (p === 'linkedin') return <Linkedin className="h-8 w-8" />
  if (p === 'youtube') return <Youtube className="h-8 w-8" />
  if (p === 'facebook') return <Facebook className="h-8 w-8" />
  if (p === 'website' || p === 'site') return <Link2 className="h-8 w-8" />
  return <Mail className="h-8 w-8" />
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
      heroImage: true,
      publishedAt: true,
      authors: true,
      populatedAuthors: true,
    },
  })

  const socials = (author as any).socials as Array<{ platform: string; url: string }> | undefined

  return (
    <div className="pb-24">
      <PageClient />

      {/* Author Profile Header */}
      <section className="container mb-16 flex justify-center lg:block">
        <div className="max-w-4xl">
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-4 md:items-start md:gap-x-8 md:gap-y-2">
            {/* Avatar */}
            <div className="col-start-1 col-end-2 row-start-1 row-end-2 self-center md:row-span-2 md:self-start">
              {(author as any).avatar && typeof (author as any).avatar !== 'string' ? (
                <div className="h-24 w-24 overflow-hidden rounded-full md:h-40 md:w-40">
                  <Media
                    resource={(author as any).avatar}
                    imgClassName="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="bg-muted flex h-24 w-24 items-center justify-center rounded-full md:h-40 md:w-40">
                  <span className="text-muted-foreground text-3xl font-bold md:text-5xl">
                    {author.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
              )}
            </div>

            {/* Name */}
            <div className="col-start-2 col-end-3 row-start-1 row-end-2 self-center md:mt-4 md:self-end">
              <h1 className="text-primary text-2xl font-bold md:text-4xl lg:text-5xl">
                {author.name}
              </h1>
            </div>

            {/* Bio */}
            {(author as any).bio && (
              <div className="col-span-2 mt-2 md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3 md:mt-0">
                <RichText
                  data={(author as any).bio}
                  enableGutter={false}
                  className="text-muted-foreground prose-sm md:prose-base max-w-none"
                />
              </div>
            )}
          </div>

          {/* Social Links */}
          {socials && socials.length > 0 && (
            <div className="border-border mt-8 border-t pt-8">
              <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                    title={social.platform}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Author's Posts */}
      <section className="container">
        <div className="container mb-8">
          <h2 className="text-2xl font-bold">{'Publicações de ' + (author.name || 'Autor')}</h2>
        </div>
        {authorPosts.docs.length > 0 ? (
          <CollectionArchive posts={authorPosts.docs} />
        ) : (
          <div className="container">
            <p className="text-muted-foreground">Nenhuma publicação encontrada.</p>
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
      title: 'Autor não encontrado',
    }
  }

  const serverURL = getServerSideURL()

  return {
    title: `${author.name} | Portal Lineup`,
    description: `Perfil e publicações de ${author.name} no Portal Lineup.`,
    openGraph: {
      title: `${author.name} | Portal Lineup`,
      description: `Perfil e publicações de ${author.name} no Portal Lineup.`,
      url: `${serverURL}/autor/${slug}`,
      siteName: 'Portal Lineup',
      ...((author as any).avatar && typeof (author as any).avatar === 'object'
        ? {
            images: [
              {
                url: (author as any).avatar.url
                  ? `${(author as any).avatar.url}`
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
