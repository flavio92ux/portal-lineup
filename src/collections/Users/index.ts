import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultPopulate: {
    name: true,
    slug: true,
    avatar: true,
    bio: true,
  },
  admin: {
    defaultColumns: ['name', 'email', 'slug'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    ...slugField({
      fieldToUse: 'name',
      overrides: {
        admin: {
          position: 'sidebar',
          condition: (data, siblingData, { operation }) => operation !== 'create',
        },
      },
    }),
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Foto de perfil do redator',
        condition: (data, siblingData, { operation }) => operation !== 'create',
      },
    },
    {
      name: 'bio',
      type: 'richText',
      admin: {
        description: 'Biografia do redator',
        condition: (data, siblingData, { operation }) => operation !== 'create',
      },
    },
    {
      name: 'socials',
      type: 'array',
      label: 'Redes Sociais',
      labels: {
        singular: 'Rede Social',
        plural: 'Redes Sociais',
      },
      admin: {
        condition: (data, siblingData, { operation }) => operation !== 'create',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Website', value: 'website' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },
  ],
  timestamps: true,
}
