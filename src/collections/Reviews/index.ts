import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { YouTubeEmbed } from '../../blocks/YouTubeEmbed/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from '../Posts/hooks/populateAuthors'
import {
  revalidateDelete,
  revalidateReview,
  revalidateReviewRemote,
  revalidateReviewDeleteRemote,
} from './hooks/revalidateReview'

import {
  MetaDescriptionField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'

export const Reviews: CollectionConfig<'reviews'> = {
  slug: 'reviews',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    authors: true,
    heroImage: true,
    product: true,
    rating: true,
    pros: true,
    cons: true,
    meta: {
      description: true,
      keywords: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'product', 'rating', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'reviews',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'reviews',
        req,
      }),
    useAsTitle: 'title',
  },
  labels: {
    singular: 'Review',
    plural: 'Reviews',
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      label: 'Versal',
      admin: {
        description: 'Texto curto de destaque para chamar atencao do leitor',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Titulo',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitulo',
      admin: {
        description: 'Texto complementar ao titulo principal',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      label: 'Imagem de Capa',
      relationTo: 'media',
      admin: {
        description:
          'Esta imagem tambem sera utilizada como imagem SEO para compartilhamento em redes sociais',
      },
    },
    // Product Group
    {
      name: 'product',
      type: 'group',
      label: 'Produto Avaliado',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nome do Produto',
          required: true,
        },
        {
          name: 'brand',
          type: 'text',
          label: 'Marca',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          label: 'Imagem do Produto',
          relationTo: 'media',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descricao Curta',
          admin: {
            description: 'Descricao breve do produto para SEO',
          },
        },
      ],
    },
    // Offers Group
    {
      name: 'offers',
      type: 'group',
      label: 'Oferta / Preco',
      admin: {
        description:
          'Preencha para adicionar dados de oferta ao schema do produto (ajuda a ocupar mais espaco visual na busca do Google)',
      },
      fields: [
        {
          name: 'price',
          type: 'number',
          label: 'Preco (R$)',
          min: 0,
          admin: {
            description: 'Preco medio ou sugerido do produto',
            step: 0.01,
          },
        },
        {
          name: 'affiliateUrl',
          type: 'text',
          label: 'Link de Afiliado / Compra',
          admin: {
            description: 'URL para compra ou link de afiliado (opcional)',
          },
        },
        {
          name: 'availability',
          type: 'select',
          label: 'Disponibilidade',
          defaultValue: 'InStock',
          options: [
            { label: 'Em Estoque', value: 'InStock' },
            { label: 'Fora de Estoque', value: 'OutOfStock' },
            { label: 'Pre-venda', value: 'PreOrder' },
            { label: 'Descontinuado', value: 'Discontinued' },
          ],
          admin: {
            description: 'Status de disponibilidade do produto',
          },
        },
      ],
    },
    // Rating
    {
      name: 'rating',
      type: 'number',
      label: 'Nota Geral',
      required: true,
      min: 1,
      max: 5,
      admin: {
        position: 'sidebar',
        description: 'Nota de 1.0 a 5.0 (ex: 4.5, 3.7)',
        step: 0.1,
      },
    },
    // Pros
    {
      name: 'pros',
      type: 'array',
      label: 'Pontos Positivos',
      labels: {
        singular: 'Pro',
        plural: 'Pros',
      },
      minRows: 1,
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Ponto Positivo',
          required: true,
        },
      ],
    },
    // Cons
    {
      name: 'cons',
      type: 'array',
      label: 'Pontos Negativos',
      labels: {
        singular: 'Con',
        plural: 'Cons',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Ponto Negativo',
          required: true,
        },
      ],
    },
    // Content
    {
      type: 'ui',
      name: 'contentLabel',
      admin: {
        components: {
          Field: '/components/ContentSectionLabel',
        },
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            BlocksFeature({ blocks: [Banner, Code, MediaBlock, YouTubeEmbed] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      label: false,
      required: true,
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      label: 'Posts Relacionados',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'posts',
    },
    {
      name: 'relatedReviews',
      type: 'relationship',
      label: 'Reviews Relacionados',
      admin: {
        position: 'sidebar',
      },
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
      hasMany: true,
      relationTo: 'reviews',
    },
    {
      name: 'categories',
      type: 'relationship',
      label: 'Categorias',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        OverviewField({
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
          imagePath: 'heroImage',
        }),
        MetaTitleField({
          hasGenerateFn: true,
          overrides: {
            label: 'Titulo SEO',
          },
        }),
        MetaDescriptionField({
          hasGenerateFn: true,
          overrides: {
            label: 'Descricao SEO',
          },
        }),
        {
          name: 'keywords',
          type: 'text',
          label: 'Tags/Keywords',
          hasMany: true,
          admin: {
            components: {
              Field: '@/fields/tags/TagSuggestionsField#TagSuggestionsField',
            },
          },
        },
        PreviewField({
          hasGenerateFn: true,
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
        }),
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publicado em',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
        description:
          'Data de publicacao. Se nao informada, sera preenchida automaticamente ao publicar.',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value, operation }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            if (operation === 'create' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      label: 'Autores',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titulo',
      required: true,
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Versal',
      admin: {
        description: 'Pequeno texto acima do titulo (ex: "Review", "Premium")',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitulo',
    },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'slug',
          type: 'text',
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidateReview, revalidateReviewRemote],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete, revalidateReviewDeleteRemote],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 2000,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
