import type { FieldHook } from 'payload'

const format = (val: string): string =>
  val
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove non-alphanumeric chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-/, '') // Remove leading hyphen
    .replace(/-$/, '') // Remove trailing hyphen

export const formatSlug =
  (fallback: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === 'string') {
      return format(value)
    }

    if (operation === 'create' || !data?.slug) {
      const fallbackData = data?.[fallback] || originalDoc?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return format(fallbackData)
      }
    }

    return value
  }
