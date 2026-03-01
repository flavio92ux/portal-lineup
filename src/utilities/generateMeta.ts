import type { Metadata } from 'next'

import type { Media, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc:
    | Partial<Post>
    | {
        slug?: string | null
        heroImage?: (number | null) | Media
        meta?: {
          title?: string | null
          description?: string | null
          image?: (number | null) | Media
        }
      }
    | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.heroImage)

  const title = doc?.meta?.title ? doc?.meta?.title + ' | Lineup Brasil' : 'Lineup Brasil'

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
