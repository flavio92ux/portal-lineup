import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getPostsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'posts',
      overrideAccess: false,
      draft: false,
      depth: 1,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        type: true,
        updatedAt: true,
        authors: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
      ? results.docs
          .filter((post) => Boolean(post?.slug))
          .map((post) => {
            let loc: string

            if (post.type === 'column') {
              // For columns, build /autor/[author-slug]/[post-slug]
              const author = post.authors?.[0]
              const authorSlug =
                typeof author === 'object' && author !== null
                  ? (author as any).slug
                  : null
              loc = authorSlug
                ? `${SITE_URL}/autor/${authorSlug}/${post.slug}`
                : `${SITE_URL}/posts/${post.slug}`
            } else {
              loc = `${SITE_URL}/noticias/${post.slug}`
            }

            return {
              loc,
              lastmod: post.updatedAt || dateFallback,
            }
          })
      : []

    return sitemap
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPostsSitemap()

  return getServerSideSitemap(sitemap)
}
