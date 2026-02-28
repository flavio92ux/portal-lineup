import type { CheckboxField, TextField } from 'payload'
import { formatSlug } from '@/utilities/formatSlug'
import deepMerge from '@/utilities/deepMerge'

type SlugFieldOptions = {
  fieldToUse?: string
  overrides?: Partial<TextField>
}

export const slugField = ({
  fieldToUse = 'title',
  overrides = {},
}: SlugFieldOptions = {}): [TextField, CheckboxField] => {
  const checkBoxField: CheckboxField = {
    name: 'slugLock',
    type: 'checkbox',
    defaultValue: true,
    admin: {
      hidden: true,
      position: 'sidebar',
    },
  }

  // Separate admin overrides to preserve components
  const { admin: adminOverrides, ...restOverrides } = overrides

  const slugFieldConfig: TextField = deepMerge<TextField, Partial<TextField>>(
    {
      name: 'slug',
      type: 'text',
      index: true,
      label: 'Slug',
      admin: {
        position: 'sidebar',
        ...adminOverrides,
        components: {
          Field: {
            path: '@/fields/slug/SlugComponent#SlugComponent',
            clientProps: {
              fieldToUse,
              checkboxFieldPath: 'slugLock',
            },
          },
        },
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToUse)],
      },
    },
    restOverrides,
  )

  return [slugFieldConfig, checkBoxField]
}
