export async function GET() {
  let SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'https://example.com'

  // Ensure SITE_URL has https:// protocol
  if (!SITE_URL.startsWith('http://') && !SITE_URL.startsWith('https://')) {
    SITE_URL = `https://${SITE_URL}`
  }

  const now = new Date().toISOString()

  const sitemaps = [
    `${SITE_URL}/pages-sitemap.xml`,
    `${SITE_URL}/posts-sitemap.xml`,
    `${SITE_URL}/authors-sitemap.xml`,
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (loc) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
  )
  .join('\n')}
</sitemapindex>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
