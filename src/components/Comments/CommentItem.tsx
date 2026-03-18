'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CommentForm } from './CommentForm'
import type { Comment } from '@/app/api/comments/route'

interface CommentItemProps {
  comment: Comment
  postId: string
  postType: string
  onReplySuccess: () => void
  depth?: number
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function CommentItem({
  comment,
  postId,
  postType,
  onReplySuccess,
  depth = 0,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const maxDepth = 3 // Limit nesting depth for readability

  const handleReplySuccess = () => {
    setIsReplying(false)
    onReplySuccess()
  }

  return (
    <div className={depth > 0 ? 'ml-6 border-l-2 border-border pl-4' : ''}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
          {getInitials(comment.author_name)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">{comment.author_name}</span>
            <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground/90">
            {comment.content}
          </p>

          {/* Reply button */}
          {depth < maxDepth && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-auto px-0 py-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setIsReplying(!isReplying)}
            >
              {isReplying ? 'Cancelar' : 'Responder'}
            </Button>
          )}

          {/* Reply form */}
          {isReplying && (
            <div className="mt-3">
              <CommentForm
                postId={postId}
                postType={postType}
                parentId={comment.id}
                onSuccess={handleReplySuccess}
                onCancel={() => setIsReplying(false)}
                isReply
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 flex flex-col gap-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              postType={postType}
              onReplySuccess={onReplySuccess}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
