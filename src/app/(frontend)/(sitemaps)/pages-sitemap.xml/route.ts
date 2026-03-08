import { getServerSideSitemap } from 'next-sitemap'
import { unstable_cache } from 'next/cache'

const getGeneralSitemap = unstable_cache(
  async () => {
    let SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'
    
    // Ensure SITE_URL has https:// protocol
    if (!SITE_URL.startsWith('http://') && !SITE_URL.startsWith('https://')) {
      SITE_URL = `https://${SITE_URL}`
    }

    const dateFallback = new Date().toISOString()

    const sitemap = [
      {
        loc: `${SITE_URL}/`,
        lastmod: dateFallback,
        changefreq: 'daily' as const,
        priority: 1.0,
      },
      {
        loc: `${SITE_URL}/posts`,
        lastmod: dateFallback,
        changefreq: 'daily' as const,
        priority: 0.8,
      },
      {
        loc: `${SITE_URL}/search`,
        lastmod: dateFallback,
        changefreq: 'weekly' as const,
        priority: 0.5,
      },
    ]

    return sitemap
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getGeneralSitemap()

  return getServerSideSitemap(sitemap)
}
