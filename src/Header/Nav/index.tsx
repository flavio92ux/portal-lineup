'use client'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

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
    </nav>
  )
}
