'use client'

import { useEffect } from 'react'

interface DisqusCommentsProps {
  postId: string
  postTitle: string
  postSlug: string
}

/**
 * Componente Disqus para exibir comentários em posts
 * 
 * Requer a seguinte variável de ambiente:
 * NEXT_PUBLIC_DISQUS_SHORTNAME - O nome curto do seu fórum Disqus
 */
export function DisqusComments({ postId, postTitle, postSlug }: DisqusCommentsProps) {
  const shortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME

  if (!shortname) {
    console.warn('NEXT_PUBLIC_DISQUS_SHORTNAME não está definido')
    return null
  }

  useEffect(() => {
    // Limpar comentários anteriores
    const existingDisqusThread = document.getElementById('disqus_thread')
    if (existingDisqusThread) {
      existingDisqusThread.innerHTML = ''
    }

    // Configurar Disqus
    const disqusConfig = function () {
      this.page.url = typeof window !== 'undefined' ? window.location.href : ''
      this.page.identifier = postId
      this.page.title = postTitle
    }

    // Remover script anterior se existir
    const oldScript = document.getElementById('disqus_script')
    if (oldScript) {
      oldScript.remove()
    }

    // Adicionar novo script
    const script = document.createElement('script')
    script.id = 'disqus_script'
    script.src = `https://${shortname}.disqus.com/embed.js`
    script.setAttribute('data-timestamp', new Date().getTime().toString())
    script.async = true

    // Definir a função de configuração antes de carregar o script
    ;(window as any).disqus_config = disqusConfig

    document.body.appendChild(script)

    return () => {
      // Cleanup: remover o script ao desmontar
      const script = document.getElementById('disqus_script')
      if (script) {
        script.remove()
      }
    }
  }, [postId, postTitle, shortname])

  return (
    <div id="disqus_thread" className="mt-12 pt-8 border-t border-border">
      <div className="text-center py-8">
        <p className="text-foreground/60">Carregando comentários...</p>
      </div>
    </div>
  )
}
