import type { Metadata } from 'next'

import type { Media, Review, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

interface ImageData {
  url: string
  width?: number
  height?: number
  alt?: string
}

const getImageData = (image?: Media | Config['db']['defaultIDType'] | null): ImageData => {
  const serverUrl = getServerSideURL()

  const defaultImage: ImageData = {
    url: serverUrl + '/web-app-manifest-512x512.png',
    width: 1200,
    height: 630,
  }

  if (image && typeof image === 'object' && 'url' in image) {
    const ogSize = image.sizes?.og

    if (ogSize?.url) {
      return {
        url: ogSize.url,
        width: ogSize.width || 1200,
        height: ogSize.height || 630,
        alt: image.alt || undefined,
      }
    }

    return {
      url: image.url || defaultImage.url,
      width: image.width || 1200,
      height: image.height || 630,
      alt: image.alt || undefined,
    }
  }

  return defaultImage
}

export const generateReviewMeta = async (args: {
  doc: Partial<Review> | null
}): Promise<Metadata> => {
  const { doc } = args
  const serverUrl = getServerSideURL()

  const imageData = getImageData(doc?.heroImage as Media | null)
  const title = doc?.meta?.title ? doc?.meta?.title : 'Portal Lineup'
  const description = doc?.meta?.description || ''
  const keywords = doc?.meta?.keywords || []

  // Build the canonical URL for reviews
  let canonicalUrl = serverUrl
  if (doc?.slug) {
    canonicalUrl = `${serverUrl}/reviews/${doc.slug}`
  }

  // Get author names for article metadata
  const authors =
    (doc as Partial<Review>)?.populatedAuthors
      ?.filter((author) => author?.name)
      .map((author) => author.name as string) || []

  return {
    title,
    description,
    ...(keywords.length > 0 && { keywords }),
    openGraph: mergeOpenGraph({
      type: 'article',
      description,
      images: [
        {
          url: imageData.url,
          width: imageData.width,
          height: imageData.height,
          alt: imageData.alt || title,
        },
      ],
      title,
      url: canonicalUrl,
      ...(doc?.publishedAt && { publishedTime: doc.publishedAt }),
      ...(authors.length > 0 && { authors }),
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageData.url],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}
