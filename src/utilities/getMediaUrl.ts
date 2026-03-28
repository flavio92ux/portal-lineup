import { getClientSideURL } from '@/utilities/getURL'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @returns Properly formatted URL
 * 
 * NOTE: Cache tags have been removed to reduce Image Optimization cache writes.
 * The R2 storage already handles cache invalidation server-side.
 */
export const getMediaUrl = (url: string | null | undefined): string => {
  if (!url) return ''

  // Check if URL already has http/https protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // Otherwise prepend client-side URL
  const baseUrl = getClientSideURL()
  return `${baseUrl}${url}`
}
