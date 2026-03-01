import React from 'react'

import { HeroGrid, HeroPostData } from '@/components/HeroGrid'
import { ArticleListItem, ArticleListItemData } from '@/components/ArticleListItem'
import { Pagination } from '@/components/Pagination'

export type PostsListingProps = {
  heroPosts: HeroPostData[]
  latestPosts: ArticleListItemData[]
  sectionTitle: string
  currentPage?: number
  totalPages?: number
}

export const PostsListing: React.FC<PostsListingProps> = ({
  heroPosts,
  latestPosts,
  sectionTitle,
  currentPage,
  totalPages,
}) => {
  return (
    <div className="pb-16">
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

      {/* Article List */}
      <section className="container">
        <div className="flex flex-col gap-2">
          {latestPosts.map((post) => (
            <ArticleListItem key={post.slug} post={post} />
          ))}
        </div>

        {totalPages && totalPages > 1 && currentPage && (
          <Pagination page={currentPage} totalPages={totalPages} />
        )}
      </section>
    </div>
  )
}
