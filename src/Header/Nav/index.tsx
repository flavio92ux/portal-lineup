'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, UserCircle } from 'lucide-react'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center gap-1">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="inline"
            className="text-xs font-medium uppercase tracking-wide hover:text-foreground transition-colors px-2 py-1"
          />
        )
      })}
      <div className="flex items-center gap-2 ml-4">
        <ThemeSelector />
        <Link
          href="/search"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="sr-only">Buscar</span>
          <SearchIcon className="w-4 h-4" />
        </Link>
        <Link
          href="/admin"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="sr-only">Perfil</span>
          <UserCircle className="w-5 h-5" />
        </Link>
      </div>
    </nav>
  )
}
