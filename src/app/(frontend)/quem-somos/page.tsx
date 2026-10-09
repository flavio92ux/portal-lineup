import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { Radio, Tv, ShieldCheck, Target, Eye, Award, Users, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Quem Somos - Portal Lineup',
  description:
    'Conheça a história, a missão e a equipe do Portal Lineup, referência em notícias, bastidores e análises sobre o mercado de Rádio e TV no Brasil.',
  alternates: {
    canonical: '/quem-somos',
  },
}

export default function QuemSomosPage() {
  return (
    <main className="min-h-screen bg-background py-12 md:py-20">
      <div className="container max-w-5xl">
        {/* Header Hero */}
        <header className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/20 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-300">
            Institucional
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Quem Somos
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            A principal referência em jornalismo especializado, análises de mercado, bastidores e
            tecnologia da radiodifusão e televisão brasileira.
          </p>
        </header>

        {/* Apresentação Principal */}
        <section className="mb-16 rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Nossa História e Propósito
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              O <strong className="text-foreground">Portal Lineup</strong> nasceu com o objetivo de
              preencher uma lacuna fundamental no ecossistema jornalístico brasileiro: cobrir com
              profundidade, agilidade e rigor técnico as transformações do rádio e da televisão, os
              dois meios de comunicação de massa mais presentes no cotidiano da população do país.
            </p>
            <p>
              Em um cenário dinâmico marcado pela transição para a TV 3.0, a migração do rádio AM
              para o FM e a convergência constante entre telecomunicações e plataformas digitais de
              streaming, o Portal Lineup atua como um farol de informação confiável tanto para
              profissionais do setor quanto para apaixonados pela mídia eletrônica.
            </p>
            <p>
              Nossa redação acompanha diariamente concessões, licitações, medições de audiência
              (Kantar IBOPE Media), movimentações de executivos e comunicadores, lançamentos
              tecnológicos e os bastidores das principais redes de rádio e TV aberta e por assinatura.
            </p>
          </div>
        </section>

        {/* Pilares: Missão, Visão e Valores */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Nossos Pilares
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <Target className="size-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Missão</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Informar com precisão, transparência e responsabilidade sobre os acontecimentos do
                mercado de mídia brasileiro, valorizando a radiodifusão nacional e democratizando o
                acesso à informação de qualidade.
              </p>
            </div>

            <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <Eye className="size-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Visão</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Ser o portal líder e mais respeitado do Brasil na cobertura editorial e técnica de
                rádio, televisão e novas mídias, reconhecido pela credibilidade e independência.
              </p>
            </div>

            <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Valores</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Ética jornalística, independência editorial, checagem criteriosa das fontes,
                respeito aos direitos autorais, inovação contínua e compromisso inegociável com a
                verdade.
              </p>
            </div>
          </div>
        </section>

        {/* Linha Editorial e Cobertura */}
        <section className="mb-16 rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Linha Editorial e Especialidades
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            O Portal Lineup divide sua cobertura em eixos temáticos especializados para atender
            tanto o público geral quanto radiodifusores, engenheiros, publicitários e comunicadores:
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex gap-4">
              <div className="size-10 shrink-0 rounded-lg bg-blue-100 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <Radio className="size-6" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Radiodifusão e Dial</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Acompanhamento de frequências FM, migração AM-FM, emissoras comunitárias e
                  educativas, alcance de sinal e inovações no rádio digital.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="size-10 shrink-0 rounded-lg bg-blue-100 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <Tv className="size-6" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Televisão Aberta e Paga</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Programação, grade horária, transmissões esportivas e culturais, mercado
                  publicitário e bastidores das grandes emissoras brasileiras.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="size-10 shrink-0 rounded-lg bg-blue-100 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <Award className="size-6" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Audiência e Métricas</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Relatórios analíticos de audiência, dados de share, alcance de público e hábitos
                  de consumo de áudio e vídeo do telespectador e ouvinte.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="size-10 shrink-0 rounded-lg bg-blue-100 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <BookOpen className="size-6" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Regulação e Tecnologia</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Atos da Anatel, Ministério das Comunicações, normas da ABERT, AERP e avanços
                  técnicos como a TV 3.0 e inteligência artificial na mídia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Princípios de Independência e Contato */}
        <section className="rounded-2xl border border-blue-600/20 bg-blue-50/60 p-6 sm:p-10 dark:border-blue-900/40 dark:bg-blue-950/20">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-xl font-bold text-foreground">Transparência e Contato com a Redação</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Prezamos pela relação aberta com nossos leitores e fontes. Tem alguma sugestão de
                pauta, release ou correção? Nossa equipe editorial está sempre à disposição.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/contato"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Fale com a Redação
              </Link>
              <Link
                href="/politica-de-privacidade"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground shadow-xs transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Política de Privacidade
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
