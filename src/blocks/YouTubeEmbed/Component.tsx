import React from 'react'
import { cn } from '@/utilities/ui'

export type YouTubeEmbedBlockProps = {
  url: string
  caption?: string | null
  blockType: 'youtubeEmbed'
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null

  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (shortMatch) return shortMatch[1]

  // youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (watchMatch) return watchMatch[1]

  // youtube.com/embed/ID
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
  if (embedMatch) return embedMatch[1]

  // youtube.com/shorts/ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/)
  if (shortsMatch) return shortsMatch[1]

  return null
}

type Props = YouTubeEmbedBlockProps & {
  className?: string
}

export const YouTubeEmbedBlock: React.FC<Props> = ({ url, caption, className }) => {
  const videoId = extractYouTubeId(url)

  if (!videoId) {
    return (
      <div className={cn('col-start-2 my-4 rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground', className)}>
        URL do YouTube inválida: {url}
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`

  return (
    <figure className={cn('col-start-2 my-4', className)}>
      <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={embedUrl}
          title={caption ?? 'YouTube video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
