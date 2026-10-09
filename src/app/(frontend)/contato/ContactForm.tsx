'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Pauta e Sugestão de Notícia',
    message: '',
    consent: false,
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.consent) {
      setStatus('error')
      setFeedbackMessage('Por favor, concorde com a Política de Privacidade para enviar.')
      return
    }

    setStatus('loading')
    setFeedbackMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ocorreu um erro ao enviar sua mensagem.')
      }

      setStatus('success')
      setFeedbackMessage(data.message || 'Mensagem enviada com sucesso!')
      setFormData({
        name: '',
        email: '',
        subject: 'Pauta e Sugestão de Notícia',
        message: '',
        consent: false,
      })
    } catch (err: unknown) {
      setStatus('error')
      if (err instanceof Error) {
        setFeedbackMessage(err.message)
      } else {
        setFeedbackMessage('Não foi possível enviar a mensagem. Tente novamente mais tarde.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === 'success' && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-50/80 p-4 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-200">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="text-sm">
            <p className="font-semibold">Mensagem enviada com sucesso!</p>
            <p className="mt-1">{feedbackMessage}</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive dark:bg-destructive/20">
          <AlertCircle className="size-5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">Atenção</p>
            <p className="mt-1">{feedbackMessage}</p>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Seu Nome Completo <span className="text-destructive">*</span>
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Ex: Carlos Silva"
          value={formData.name}
          onChange={handleChange}
          className="mt-1.5 h-10 bg-background"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Seu E-mail <span className="text-destructive">*</span>
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="seuemail@exemplo.com"
          value={formData.email}
          onChange={handleChange}
          className="mt-1.5 h-10 bg-background"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground">
          Assunto <span className="text-destructive">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-1 focus-visible:ring-4 focus-visible:ring-ring/10"
        >
          <option value="Pauta e Sugestão de Notícia">Pauta e Sugestão de Notícia</option>
          <option value="Comercial & Publicidade">Comercial & Publicidade</option>
          <option value="Assessoria de Imprensa">Assessoria de Imprensa / Release</option>
          <option value="Correção ou Erro em Publicação">Correção ou Erro em Publicação</option>
          <option value="Dúvidas e Sugestões Gerais">Dúvidas e Sugestões Gerais</option>
          <option value="Outro Assunto">Outro Assunto</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground">
          Sua Mensagem <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Escreva sua mensagem com o máximo de detalhes possível..."
          value={formData.message}
          onChange={handleChange}
          className="mt-1.5 bg-background"
        />
      </div>

      <div className="flex items-start gap-2.5 pt-1">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          checked={formData.consent}
          onChange={handleChange}
          className="mt-1 size-4 rounded border-input text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="consent" className="text-xs leading-relaxed text-muted-foreground">
          Concordo com a coleta e tratamento dos meus dados para atendimento conforme a{' '}
          <Link
            href="/politica-de-privacidade"
            className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
          >
            Política de Privacidade
          </Link>
          .
        </label>
      </div>

      <Button
        type="submit"
        disabled={status === 'loading'}
        className="w-full h-11 bg-blue-600 font-semibold text-white hover:bg-blue-700"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Enviando mensagem...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Enviar Mensagem
          </>
        )}
      </Button>
    </form>
  )
}
