import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container py-28 text-center">
      <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
      <p className="text-muted-foreground mb-6">Pagina nao encontrada.</p>
      <Button asChild variant="default">
        <Link href="/">Voltar ao inicio</Link>
      </Button>
    </div>
  )
}
