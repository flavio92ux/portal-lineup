const VERCEL_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : null

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  VERCEL_URL ||
  'https://example.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [
    '/posts-sitemap.xml',
    '/pages-sitemap.xml',
    '/authors-sitemap.xml',
    '/reviews-sitemap.xml',
    '/posts/*',
    '/noticias/*',
    '/autor/*',
    '/reviews/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/posts-sitemap.xml`,
      `${SITE_URL}/authors-sitemap.xml`,
      `${SITE_URL}/reviews-sitemap.xml`,
    ],
  },
}
