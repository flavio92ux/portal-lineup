import type { Field } from 'payload'
import { formatSlug } from '@/utilities/formatSlug'
import deepMerge from '@/utilities/deepMerge'

type SlugFieldOptions = {
  fieldToUse?: string
  overrides?: Partial<Field>
}

export const slugField = ({ fieldToUse = 'title', overrides = {} }: SlugFieldOptions = {}): Field =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'slug',
      type: 'text',
      index: true,
      label: 'Slug',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToUse)],
      },
    },
    overrides,
  )
