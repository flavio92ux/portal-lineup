import React from 'react'
import type { Review } from '@/payload-types'
import { Media } from '@/components/Media'

function StarRating({ rating, size = 'lg' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  }

  return (
    <div className="flex items-center gap-1" aria-label={`Nota ${rating} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating)
        const partial = !filled && star === Math.ceil(rating) && rating % 1 !== 0
        const fillPercent = partial ? (rating % 1) * 100 : 0

        return (
          <div key={star} className="relative">
            <svg
              className={`${sizeClasses[size]} text-muted-foreground/30`}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {(filled || partial) && (
              <svg
                className={`${sizeClasses[size]} absolute inset-0 text-yellow-400`}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
                style={partial ? { clipPath: `inset(0 ${100 - fillPercent}% 0 0)` } : undefined}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ProsConsList({
  items,
  type,
}: {
  items: Array<{ text: string }> | null | undefined
  type: 'pros' | 'cons'
}) {
  if (!items || items.length === 0) return null

  const isPros = type === 'pros'
  const title = isPros ? 'Pontos Positivos' : 'Pontos Negativos'

  return (
    <div
      className={`rounded-lg border p-4 ${
        isPros
          ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30'
          : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30'
      }`}
    >
      <h4
        className={`mb-3 flex items-center gap-2 text-sm font-semibold ${
          isPros ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
        }`}
      >
        {isPros ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className={`flex items-start gap-2 text-sm ${
              isPros ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
            }`}
          >
            <span
              className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                isPros ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

type ReviewVerdictProps = {
  review: Review
}

export const ReviewVerdict: React.FC<ReviewVerdictProps> = ({ review }) => {
  const { title, product, rating, pros, cons, offers } = review

  const productImage =
    product?.image && typeof product.image === 'object' && 'url' in product.image
      ? product.image
      : null

  const hasProsCons = (pros && pros.length > 0) || (cons && cons.length > 0)
  const hasOffer = offers?.price != null || offers?.affiliateUrl

  if (!hasProsCons && !hasOffer) return null

  // Format price to BRL
  const formattedPrice =
    offers?.price != null
      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(offers.price)
      : null

  // Format last verified date
  const lastVerifiedDate = review.updatedAt
    ? new Date(review.updatedAt).toLocaleDateString('pt-BR')
    : new Date(review.createdAt).toLocaleDateString('pt-BR')

  return (
    <div className="bg-card border-border mt-10 overflow-hidden rounded-xl border shadow-sm">
      {/* Header */}
      <div className="bg-secondary/50 border-border border-b px-6 py-4">
        <h3 className="text-foreground text-lg font-bold">Veredito Final</h3>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Product + Rating Summary */}
        <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
          {/* Product Image */}
          {productImage && (
            <div className="bg-secondary relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
              <Media fill imgClassName="object-contain" resource={productImage} />
            </div>
          )}

          {/* Product Info + Rating */}
          <div className="flex flex-1 flex-col items-center gap-2 text-center sm:items-start sm:text-left">
            <p className="text-foreground text-lg font-semibold">{product?.name || title}</p>
            {product?.brand && <p className="text-muted-foreground text-sm">{product.brand}</p>}
          </div>

          {/* Big Rating Display */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-foreground text-4xl font-bold">{(rating || 0).toFixed(1)}</div>
            <StarRating rating={rating || 0} size="md" />
          </div>
        </div>

        {/* Pros and Cons */}
        {hasProsCons && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <ProsConsList items={pros} type="pros" />
            <ProsConsList items={cons} type="cons" />
          </div>
        )}

        {/* CTA - Price / Affiliate Link */}
        {hasOffer && (
          <div className="border-border flex flex-col gap-4 border-t pt-6">
            {/* Price Display - Reduced prominence */}
            {formattedPrice && (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">
                    Faixa de preço encontrada
                  </p>
                  <p className="text-foreground text-xl font-semibold">{formattedPrice}</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Verificado em {lastVerifiedDate}
                  </p>
                </div>

                {/* Affiliate Button - Outline style for secondary prominence */}
                {offers?.affiliateUrl && (
                  <a
                    href={offers.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="border-primary text-primary hover:bg-primary/5 inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors flex-shrink-0"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Consultar Ofertas
                  </a>
                )}
              </div>
            )}

            {/* Affiliate Disclaimer */}
            <p className="text-muted-foreground text-xs leading-relaxed border-t border-border pt-3">
              Este link pode gerar uma pequena comissão para o Portal Lineup, sem custo adicional para você. Isso ajuda a manter nossos testes independentes.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
