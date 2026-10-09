import type { Metadata } from 'next'
import React from 'react'
import { ContactForm } from './ContactForm'
import { Mail, Newspaper, MessageSquare, Clock, ShieldCheck, Share2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contato e Fale Conosco - Portal Lineup',
  description:
    'Entre em contato com a equipe editorial, comercial ou de pautas do Portal Lineup. Envie sugestões, dúvidas, releases e propostas de parcerias.',
  alternates: {
    canonical: '/contato',
  },
}

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-background py-12 md:py-20">
      <div className="container max-w-5xl">
        {/* Header Hero */}
        <header className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/20 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-300">
            Fale Conosco
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Entre em Contato
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Tem uma sugestão de pauta, release para a redação ou interesse em anunciar? Envie sua
            mensagem para a nossa equipe.
          </p>
        </header>

        {/* Grid de Contato */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Coluna 1: Informações e Canais Oficiais (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Canais de Atendimento
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Se preferir enviar um e-mail diretamente, utilize um dos endereços departamentais
                abaixo:
              </p>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <Newspaper className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Redação e Pautas</h3>
                    <p className="text-xs text-muted-foreground">
                      Sugestões de notícias, informações de bastidores e novidades
                    </p>
                    <a
                      href="mailto:redacao@portallineup.com.br"
                      className="mt-1 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      redacao@portallineup.com.br
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    <Share2 className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Comercial e Parcerias</h3>
                    <p className="text-xs text-muted-foreground">
                      Anúncios, publicidade digital, mídia kit e projetos especiais
                    </p>
                    <a
                      href="mailto:comercial@portallineup.com.br"
                      className="mt-1 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      comercial@portallineup.com.br
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Atendimento Geral</h3>
                    <p className="text-xs text-muted-foreground">
                      Dúvidas, suporte, direitos de privacidade e comunicados
                    </p>
                    <a
                      href="mailto:contato@portallineup.com.br"
                      className="mt-1 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      contato@portallineup.com.br
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Card com Orientações para Assessorias de Imprensa */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="size-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-semibold text-foreground">Assessorias de Imprensa</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Releases institucionais, avisos de pauta e comunicados de emissoras de rádio e TV
                são lidos e analisados por nossa equipe editorial com prioridade de segunda a sexta-feira.
              </p>
            </div>
          </div>

          {/* Coluna 2: Formulário Interativo (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Envie sua Mensagem
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Preencha o formulário abaixo e responderemos o mais rápido possível.
              </p>

              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
