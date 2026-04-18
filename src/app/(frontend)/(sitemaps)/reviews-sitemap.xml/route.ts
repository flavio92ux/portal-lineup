import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getReviewsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    let SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    // Ensure SITE_URL has https:// protocol
    if (!SITE_URL.startsWith('http://') && !SITE_URL.startsWith('https://')) {
      SITE_URL = `https://${SITE_URL}`
    }

    const results = await payload.find({
      collection: 'reviews',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
      ? results.docs
          .filter((review) => Boolean(review?.slug))
          .map((review) => ({
            loc: `${SITE_URL}/reviews/${review.slug}`,
            lastmod: review.updatedAt || dateFallback,
          }))
      : []

    return sitemap
  },
  ['reviews-sitemap'],
  {
    tags: ['reviews-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getReviewsSitemap()

  return getServerSideSitemap(sitemap)
}
