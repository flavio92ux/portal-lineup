import React from 'react'

import { HeroGrid, HeroPostData } from '@/components/HeroGrid'
import { ArticleListItem, ArticleListItemData } from '@/components/ArticleListItem'
import { ReviewListItem, ReviewListItemData } from '@/components/ReviewListItem'
import { Pagination } from '@/components/Pagination'

type ListItem =
  | { kind: 'post'; data: ArticleListItemData }
  | { kind: 'review'; data: ReviewListItemData }

export type PostsListingProps = {
  heroPosts: HeroPostData[]
  latestPosts: ArticleListItemData[]
  latestReviews?: ReviewListItemData[]
  sectionTitle: string
  currentPage?: number
  totalPages?: number
}

export const PostsListing: React.FC<PostsListingProps> = ({
  heroPosts,
  latestPosts,
  latestReviews = [],
  sectionTitle,
  currentPage,
  totalPages,
}) => {
  // Merge posts (skipping first 3 that appear in hero) and reviews into a
  // single chronological list, sorted by publishedAt descending.
  const postItems: ListItem[] = latestPosts
    .slice(3)
    .map((p) => ({ kind: 'post', data: p }))

  const reviewItems: ListItem[] = latestReviews.map((r) => ({ kind: 'review', data: r }))

  const mergedItems = [...postItems, ...reviewItems].sort((a, b) => {
    const dateA = a.data.publishedAt ? new Date(a.data.publishedAt).getTime() : 0
    const dateB = b.data.publishedAt ? new Date(b.data.publishedAt).getTime() : 0
    return dateB - dateA
  })

  return (
    <div className="pb-16">
      <h1 className="hidden text-balance text-lg font-bold leading-tight text-white md:text-xl lg:text-2xl">
        Portal Lineup - As principais notícias, análises e colunas sobre rádio e TV do Brasil.
      </h1>

      {/* Hero Grid */}
      {heroPosts.length > 0 && (
        <section className="container mb-8">
          <HeroGrid posts={heroPosts} />
        </section>
      )}

      {/* Divider */}
      <div className="container">
        <p className="text-muted-foreground mb-6 text-sm font-semibold">{sectionTitle}</p>
      </div>

      {/* Article + Review List merged */}
      <section className="container">
        <div className="flex flex-col gap-2">
          {mergedItems.map((item) =>
            item.kind === 'review' ? (
              <ReviewListItem key={`review-${item.data.slug}`} review={item.data} />
            ) : (
              <ArticleListItem key={`post-${item.data.slug}`} post={item.data} />
            ),
          )}
        </div>

        {totalPages && totalPages > 1 && currentPage && (
          <Pagination page={currentPage} totalPages={totalPages} />
        )}
      </section>
    </div>
  )
}
