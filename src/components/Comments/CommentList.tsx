'use client'

import useSWR from 'swr'
import { CommentItem } from './CommentItem'
import type { Comment } from '@/app/api/comments/route'

interface CommentListProps {
  postId: string
  postType: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function CommentList({ postId, postType }: CommentListProps) {
  const { data, error, isLoading, mutate } = useSWR<{ comments: Comment[] }>(
    `/api/comments?postId=${postId}&postType=${postType}`,
    fetcher,
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        Erro ao carregar comentarios. Tente novamente mais tarde.
      </p>
    )
  }

  const comments = data?.comments || []

  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum comentario ainda. Seja o primeiro a comentar!
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          postType={postType}
          onReplySuccess={() => mutate()}
        />
      ))}
    </div>
  )
}
