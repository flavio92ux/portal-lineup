import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getAuthorsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 1000,
      pagination: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
      ? results.docs
          .filter((user) => Boolean(user?.slug))
          .map((user) => ({
            loc: `${SITE_URL}/autor/${user.slug}`,
            lastmod: user.updatedAt || dateFallback,
          }))
      : []

    return sitemap
  },
  ['authors-sitemap'],
  {
    tags: ['authors-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getAuthorsSitemap()

  return getServerSideSitemap(sitemap)
}
