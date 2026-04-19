import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import RichText from '@/components/RichText'
import { ReviewHero } from '@/heros/ReviewHero'
import { ReviewVerdict } from '@/components/ReviewVerdict'
import { generateReviewMeta } from '@/utilities/generateReviewMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ProductReviewJsonLd } from '@/components/JsonLd'
import { Comments } from '@/components/Comments'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const reviews = await payload.find({
    collection: 'reviews',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return reviews.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ReviewPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/reviews/' + decodedSlug
  const review = await queryReviewBySlug({ slug: decodedSlug })

  if (!review) return <PayloadRedirects url={url} />

  return (
    <article>
      <ProductReviewJsonLd review={review} />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <p className="lg:leading-16 container mx-auto mb-3 font-sans text-3xl font-bold lg:mb-4 lg:text-6xl">
        {review.title}
      </p>

      <ReviewHero review={review} />

      <div className="container mx-auto">
        <RichText className="" data={review.content} enableGutter={false} />

        {/* 3. CARD DE VEREDITO FINAL - Pros/Cons + CTA */}
        <ReviewVerdict review={review} />

        {/* Related Reviews */}
        {review.relatedReviews && review.relatedReviews.length > 0 && (
          <div className="border-border mt-12 border-t pt-8">
            <h3 className="text-foreground mb-6 text-base font-semibold">Outros Reviews</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {review.relatedReviews
                .filter((r) => typeof r === 'object')
                .map((relatedReview, index) => (
                  <ReviewCard key={index} review={relatedReview} />
                ))}
            </div>
          </div>
        )}

        <Comments postId={String(review.id)} postType="reviews" />
      </div>
    </article>
  )
}

// Simple Review Card component for related reviews
function ReviewCard({ review }: { review: any }) {
  const heroImage =
    review.heroImage && typeof review.heroImage === 'object' ? review.heroImage : null

  return (
    <a
      href={`/reviews/${review.slug}`}
      className="bg-card border-border hover:bg-secondary/50 group overflow-hidden rounded-lg border transition-colors"
    >
      <div className="bg-secondary relative aspect-video w-full">
        {heroImage && (
          <img
            src={heroImage.sizes?.thumbnail?.url || heroImage.url}
            alt={review.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-3">
        <h4 className="text-foreground group-hover:text-primary line-clamp-2 text-sm font-semibold leading-snug transition-colors">
          {review.title}
        </h4>
        {review.rating && (
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`h-3 w-3 ${star <= review.rating ? 'text-yellow-400' : 'text-muted-foreground/30'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}
      </div>
    </a>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const review = await queryReviewBySlug({ slug: decodedSlug })

  return generateReviewMeta({ doc: review })
}

const queryReviewBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'reviews',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: { equals: slug },
    },
  })

  return result.docs?.[0] || null
})
