import { PayloadRequest, CollectionSlug } from 'payload'

type Props = {
  collection: CollectionSlug
  slug: string
  req: PayloadRequest
  postType?: 'news' | 'column'
}

export const generatePreviewPath = ({ collection, slug, postType }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  // Determine the path based on collection and post type
  let path: string
  if (collection === 'posts') {
    path = postType === 'column' ? `/colunas/${encodedSlug}` : `/noticias/${encodedSlug}`
  } else if (collection === 'pages') {
    path = `/${encodedSlug}`
  } else {
    path = `/${collection}/${encodedSlug}`
  }

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    collection,
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
