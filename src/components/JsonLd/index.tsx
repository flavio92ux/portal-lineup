import type { Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

type NewsArticleJsonLdProps = {
  post: Post
  postType: 'news' | 'column' | 'post'
}

type HomePageJsonLdProps = {
  posts: Array<{
    title: string
    slug: string
    heroImage?: {
      url?: string | null
      sizes?: {
        og?: { url?: string | null } | null
      } | null
    } | null
  }>
}

function extractTextFromNode(node: any): string {
  if (!node) return ''
  if (node.type === 'text') {
    return node.text || ''
  }
  if (Array.isArray(node.children)) {
    return node.children.map((child: any) => extractTextFromNode(child)).join(' ')
  }
  return ''
}

export function NewsArticleJsonLd({ post, postType }: NewsArticleJsonLdProps) {
  const serverUrl = getServerSideURL()

  const postPath =
    postType === 'column'
      ? `/colunas/${post.slug}`
      : postType === 'news'
        ? `/noticias/${post.slug}`
        : `/posts/${post.slug}`

  const postUrl = `${serverUrl}${postPath}`

  const heroImage =
    post.heroImage && typeof post.heroImage === 'object' && 'url' in post.heroImage
      ? post.heroImage
      : null

  const imageUrl =
    heroImage?.sizes?.og?.url || heroImage?.url || `${serverUrl}/web-app-manifest-512x512.png`

  const authors =
    post.populatedAuthors
      ?.filter((a) => a.name)
      .map((a) => ({
        '@type': 'Person',
        name: a.name,
        ...(a.slug ? { url: `${serverUrl}/autor/${a.slug}` } : {}),
      })) || []

  // BreadcrumbList
  const sectionLabel =
    postType === 'column' ? 'Colunas' : postType === 'news' ? 'Notícias' : 'Posts'
  const sectionPath =
    postType === 'column' ? '/colunas' : postType === 'news' ? '/noticias' : '/posts'

  const articleBody = post.content?.root
    ? extractTextFromNode(post.content.root).replace(/\s+/g, ' ').trim()
    : ''

  const categories =
    post.categories
      ?.map((c) => (typeof c === 'object' && c !== null && 'title' in c ? c.title : null))
      .filter(Boolean)
      .join(', ') || sectionLabel

  const newsArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    ...(post.subtitle ? { description: post.subtitle } : {}),
    image: [imageUrl],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: authors.length > 0 ? authors : [{ '@type': 'Organization', name: 'Portal Lineup' }],
    publisher: {
      '@type': 'Organization',
      name: 'Portal Lineup',
      logo: {
        '@type': 'ImageObject',
        url: `${serverUrl}/web-app-manifest-512x512.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
    ...(categories ? { articleSection: categories } : {}),
    ...(articleBody ? { articleBody } : {}),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: serverUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: sectionLabel,
        item: `${serverUrl}${sectionPath}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}

export function HomePageJsonLd({ posts }: HomePageJsonLdProps) {
  const serverUrl = getServerSideURL()

  // WebPage schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${serverUrl}/#webpage`,
    url: serverUrl,
    name: 'Portal Lineup - Portal de Notícias sobre Rádio e TV do Brasil',
    description:
      'Portal Lineup - As principais notícias, análises e colunas sobre rádio e TV do Brasil. Cobertura completa do mercado de comunicação brasileiro.',
    isPartOf: {
      '@id': `${serverUrl}/#website`,
    },
    publisher: {
      '@id': `${serverUrl}/#organization`,
    },
    inLanguage: 'pt-BR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${serverUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // NewsMediaOrganization schema
  const newsMediaOrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    '@id': `${serverUrl}/#organization`,
    name: 'Portal Lineup',
    alternateName: 'Lineup Brasil',
    url: serverUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${serverUrl}/web-app-manifest-512x512.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      'https://twitter.com/portallineup',
      'https://instagram.com/portallineup',
      'https://facebook.com/portallineup',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contato@portal-lineup.site',
      availableLanguage: ['Portuguese'],
    },
    publishingPrinciples: `${serverUrl}/sobre`,
    foundingDate: '2026',
    description:
      'Portal de notícias especializado em cobertura do mercado de rádio e televisão brasileiro.',
  }

  // WebSite schema
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${serverUrl}/#website`,
    url: serverUrl,
    name: 'Portal Lineup',
    description:
      'Portal de notícias sobre rádio e TV do Brasil com as principais notícias, análises e colunas.',
    publisher: {
      '@id': `${serverUrl}/#organization`,
    },
    inLanguage: 'pt-BR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${serverUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // ItemList schema for posts
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Últimas Notícias',
    description: 'As últimas notícias sobre rádio e TV do Brasil',
    numberOfItems: posts.length,
    itemListElement: posts.slice(0, 10).map((post, index) => {
      const heroImage = post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null
      const imageUrl =
        heroImage?.sizes?.og?.url || heroImage?.url || `${serverUrl}/web-app-manifest-512x512.png`

      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `${serverUrl}/noticias/${post.slug}`,
        name: post.title,
        image: imageUrl,
      }
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsMediaOrganizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </>
  )
}
