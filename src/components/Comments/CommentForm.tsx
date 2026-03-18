'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface CommentFormProps {
  postId: string
  postType: string
  parentId?: string | null
  onSuccess?: () => void
  onCancel?: () => void
  isReply?: boolean
}

export function CommentForm({
  postId,
  postType,
  parentId = null,
  onSuccess,
  onCancel,
  isReply = false,
}: CommentFormProps) {
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          postType,
          parentId,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
          content: content.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar comentário')
      }

      // Clear form on success
      setAuthorName('')
      setAuthorEmail('')
      setContent('')
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar comentário')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          type="text"
          placeholder="Seu nome"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
          minLength={2}
          maxLength={100}
          disabled={isSubmitting}
          className="flex-1"
        />
        <Input
          type="email"
          placeholder="Seu email"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          required
          disabled={isSubmitting}
          className="flex-1"
        />
      </div>
      <Textarea
        placeholder={isReply ? 'Escreva sua resposta...' : 'Escreva seu comentario...'}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        minLength={1}
        maxLength={5000}
        disabled={isSubmitting}
        rows={isReply ? 3 : 4}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSubmitting} size="sm">
          {isSubmitting ? 'Enviando...' : isReply ? 'Responder' : 'Comentar'}
        </Button>
        {isReply && onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
      </div>
      <p className="text-muted-foreground text-xs">
        Seu email não será publicado. Apenas seu nome aparecerá junto ao comentário.
      </p>
    </form>
  )
}
