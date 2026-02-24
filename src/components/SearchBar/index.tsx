'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchIcon } from 'lucide-react'

export const SearchBar: React.FC<{
  placeholder?: string
  className?: string
}> = ({ placeholder = 'Busque e comece a ouvir', className }) => {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex items-center gap-2 bg-secondary rounded-lg overflow-hidden border border-border">
        <div className="flex items-center flex-1 px-4 gap-3">
          <SearchIcon className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full py-2.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:bg-foreground/90 transition-colors"
        >
          Buscar
        </button>
      </div>
    </form>
  )
}
