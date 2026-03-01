import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // No R2/Vercel, o staticDir é usado apenas como um fallback ou prefixo
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    mimeTypes: ['image/*', 'image/svg+xml'],
    formatOptions: {
      format: 'webp', // Força a conversão de todos os uploads para WebP
      options: {
        quality: 80,
      },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        formatOptions: { format: 'webp', options: { quality: 70 } },
      },
      {
        name: 'avatar',
        width: 150,
        height: 150,
        crop: 'center',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'small',
        width: 480,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'medium',
        width: 768,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'large',
        width: 1024,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'xlarge',
        width: 1440,
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'card',
        width: 400,
        height: 300,
        crop: 'center',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'hero',
        width: 1920,
        height: 400,
        crop: 'center',
        formatOptions: { format: 'webp', options: { quality: 88 } },
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: { format: 'webp' },
      },
    ],
  },
}
