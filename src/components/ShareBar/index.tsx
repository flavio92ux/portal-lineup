'use client'

import React from 'react'
import { Facebook, Twitter, Linkedin, Link2, MessageCircle } from 'lucide-react'

interface ShareBarProps {
  url: string
  title: string
  description?: string
}

export const ShareBar: React.FC<ShareBarProps> = ({ url, title, description }) => {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || '')

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-[#1877F2]',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:text-[#1DA1F2]',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
      color: 'hover:text-[#0A66C2]',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:text-[#25D366]',
    },
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copiado!')
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Link copiado!')
    }
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-muted-foreground mr-2 text-xs font-medium">Compartilhar:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-muted-foreground p-2 transition-colors ${link.color}`}
          aria-label={`Compartilhar no ${link.name}`}
          title={`Compartilhar no ${link.name}`}
        >
          <link.icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={copyToClipboard}
        className="text-muted-foreground hover:text-foreground p-2 transition-colors"
        aria-label="Copiar link"
        title="Copiar link"
      >
        <Link2 className="h-4 w-4" />
      </button>
    </div>
  )
}
