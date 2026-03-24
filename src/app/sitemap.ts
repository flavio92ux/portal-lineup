import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const serverUrl = getServerSideURL()
  const payload = await getPayload({ config: configPromise })

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: serverUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${serverUrl}/noticias`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${serverUrl}/colunas`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${serverUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // Fetch all published posts
  const postsResult = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 1000,
    overrideAccess: false,
    where: {
      _status: { equals: 'published' },
    },
    select: {
      slug: true,
      type: true,
      updatedAt: true,
    },
  })

  const postPages: MetadataRoute.Sitemap = postsResult.docs.map((post) => {
    const postPath =
      post.type === 'coluna'
        ? `/colunas/${post.slug}`
        : post.type === 'noticia'
          ? `/noticias/${post.slug}`
          : `/posts/${post.slug}`

    return {
      url: `${serverUrl}${postPath}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  })

  // Fetch all authors
  const authorsResult = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 100,
    overrideAccess: false,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const authorPages: MetadataRoute.Sitemap = authorsResult.docs
    .filter((author) => author.slug)
    .map((author) => ({
      url: `${serverUrl}/autor/${author.slug}`,
      lastModified: author.updatedAt ? new Date(author.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

  return [...staticPages, ...postPages, ...authorPages]
}
