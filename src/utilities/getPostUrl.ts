import type { Post } from '@/payload-types'

type PostWithTypeAndSlug = Pick<Post, 'type' | 'slug'>

/**
 * Returns the URL path for a post based on its type
 * - News posts: /noticias/[slug]
 * - Column posts: /colunas/[slug]
 */
export function getPostUrl(post: PostWithTypeAndSlug): string {
  if (post.type === 'column') {
    return `/colunas/${post.slug}`
  }
  return `/noticias/${post.slug}`
}
