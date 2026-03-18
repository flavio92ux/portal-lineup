'use client'

import { useCallback, useState } from 'react'
import { CommentForm } from './CommentForm'
import { CommentList } from './CommentList'
import { useSWRConfig } from 'swr'

interface CommentsProps {
  postId: string
  postType?: string
}

export function Comments({ postId, postType = 'posts' }: CommentsProps) {
  const { mutate } = useSWRConfig()
  const [commentCount, setCommentCount] = useState(0)

  const handleCommentSuccess = useCallback(() => {
    // Revalidate the comments list
    mutate(`/api/comments?postId=${postId}&postType=${postType}`)
    setCommentCount((prev) => prev + 1)
  }, [mutate, postId, postType])

  console.log('Aqui')

  return (
    <section className="border-border mt-12 border-t pt-8">
      <h3 className="text-foreground mb-6 text-xl font-semibold">Comentários</h3>

      {/* Comment form */}
      <div className="mb-8">
        <CommentForm postId={postId} postType={postType} onSuccess={handleCommentSuccess} />
      </div>

      {/* Comments list */}
      <CommentList key={commentCount} postId={postId} postType={postType} />
    </section>
  )
}

export { CommentForm } from './CommentForm'
export { CommentItem } from './CommentItem'
export { CommentList } from './CommentList'
