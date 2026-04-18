import type { Post, Review } from '@/payload-types'
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

  // Extract keywords from meta
  const keywords =
    post.meta && 'keywords' in post.meta && Array.isArray(post.meta.keywords)
      ? (post.meta.keywords as string[]).join(', ')
      : null

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
    ...(keywords ? { keywords } : {}),
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

type ProductReviewJsonLdProps = {
  review: Review
}

export function ProductReviewJsonLd({ review }: ProductReviewJsonLdProps) {
  const serverUrl = getServerSideURL()
  const reviewUrl = `${serverUrl}/reviews/${review.slug}`

  // Product image
  const productImage =
    review.product?.image && typeof review.product.image === 'object' && 'url' in review.product.image
      ? review.product.image
      : null

  const heroImage =
    review.heroImage && typeof review.heroImage === 'object' && 'url' in review.heroImage
      ? review.heroImage
      : null

  const productImageUrl =
    productImage?.sizes?.og?.url ||
    productImage?.url ||
    heroImage?.sizes?.og?.url ||
    heroImage?.url ||
    `${serverUrl}/web-app-manifest-512x512.png`

  // Authors
  const authors =
    review.populatedAuthors
      ?.filter((a) => a.name)
      .map((a) => ({
        '@type': 'Person',
        name: a.name,
        ...(a.slug ? { url: `${serverUrl}/autor/${a.slug}` } : {}),
      })) || []

  const authorForReview =
    authors.length > 0 ? authors[0] : { '@type': 'Organization', name: 'Portal Lineup' }

  // Build positiveNotes ItemList
  const positiveNotes =
    review.pros && review.pros.length > 0
      ? {
          '@type': 'ItemList',
          itemListElement: review.pros.map((pro, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: pro.text,
          })),
        }
      : undefined

  // Build negativeNotes ItemList
  const negativeNotes =
    review.cons && review.cons.length > 0
      ? {
          '@type': 'ItemList',
          itemListElement: review.cons.map((con, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: con.text,
          })),
        }
      : undefined

  // Extract article body from content
  const articleBody = review.content?.root
    ? extractTextFromNode(review.content.root).replace(/\s+/g, ' ').trim()
    : ''

  // Build offers object when price or affiliateUrl are present
  const offersData = review.offers
  const hasOffers = offersData && (offersData.price != null || offersData.affiliateUrl)
  const offersSchema = hasOffers
    ? {
        '@type': 'Offer',
        availability: `https://schema.org/${offersData.availability ?? 'InStock'}`,
        priceCurrency: 'BRL',
        ...(offersData.price != null
          ? { price: String(offersData.price.toFixed(2)) }
          : {}),
        ...(offersData.affiliateUrl ? { url: offersData.affiliateUrl } : {}),
      }
    : undefined

  // Product schema with embedded Review
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: review.product?.name || review.title,
    image: [productImageUrl],
    description: review.product?.description || review.subtitle || '',
    brand: {
      '@type': 'Brand',
      name: review.product?.brand || 'N/A',
    },
    ...(offersSchema ? { offers: offersSchema } : {}),
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(review.rating || 0),
        bestRating: '5',
        worstRating: '1',
      },
      author: authorForReview,
      datePublished: review.publishedAt || review.createdAt,
      reviewBody: articleBody.slice(0, 500) || undefined,
      ...(positiveNotes ? { positiveNotes } : {}),
      ...(negativeNotes ? { negativeNotes } : {}),
    },
  }

  // BreadcrumbList
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
        name: 'Reviews',
        item: `${serverUrl}/reviews`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: review.title,
        item: reviewUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
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
    alternateName: 'Portal Lineup',
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
