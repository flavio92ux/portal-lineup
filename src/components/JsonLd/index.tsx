import type { Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

type NewsArticleJsonLdProps = {
  post: Post
  postType: 'news' | 'column' | 'post'
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
