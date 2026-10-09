import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { Shield, Lock, FileText, CheckCircle2, AlertCircle, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Privacidade - Portal Lineup',
  description:
    'Conheça nossa Política de Privacidade. Saiba como o Portal Lineup coleta, utiliza, protege seus dados e cumpre as diretrizes da LGPD e do Google AdSense.',
  alternates: {
    canonical: '/politica-de-privacidade',
  },
}

export default function PoliticaDePrivacidadePage() {
  const ultimaAtualizacao = '08 de outubro de 2026'

  return (
    <main className="min-h-screen bg-background py-12 md:py-20">
      <div className="container max-w-4xl">
        {/* Header Hero */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/20 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-300">
            Segurança & Conformidade
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Política de Privacidade
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            A sua privacidade é fundamental para nós. Esta política detalha como coletamos, usamos,
            armazenamos e protegemos suas informações de acordo com a LGPD e as normas do Google AdSense.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Última atualização: <span className="font-medium text-foreground">{ultimaAtualizacao}</span>
          </p>
        </header>

        {/* Card Destaque LGPD & Compromisso */}
        <div className="mb-12 rounded-2xl border border-blue-600/30 bg-blue-50/50 p-6 sm:p-8 dark:border-blue-900/50 dark:bg-blue-950/30">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <Shield className="size-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                Compromisso com a Lei Geral de Proteção de Dados (LGPD)
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                O <strong className="text-foreground">Portal Lineup</strong> opera em total
                conformidade com a Lei Federal nº 13.709/2018 (Lei Geral de Proteção de Dados
                Pessoais - LGPD). Garantimos que qualquer informação fornecida por você será
                tratada com máxima confidencialidade, transparência e medidas técnicas de segurança.
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo Estruturado da Política */}
        <div className="space-y-12 text-foreground">
          {/* Seção 1 */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                1
              </span>
              Informações Coletadas
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>O Portal Lineup pode coletar informações em duas circunstâncias:</p>
              <ul className="list-inside list-disc space-y-2 pl-2">
                <li>
                  <strong className="text-foreground">Informações fornecidas voluntariamente:</strong>{' '}
                  Quando você preenche nosso formulário de contato ou nos envia e-mails (nome, endereço
                  de e-mail, assunto e mensagem). Esses dados são usados exclusivamente para responder à
                  sua solicitação.
                </li>
                <li>
                  <strong className="text-foreground">Dados de navegação e arquivos de log:</strong>{' '}
                  Como a maioria dos portais da web, nossos servidores registram automaticamente dados
                  estatísticos anônimos, incluindo endereço de IP, provedor de acesso (ISP), tipo de
                  navegador, páginas de referência e saída, data/hora e tempo gasto em cada artigo.
                </li>
              </ul>
            </div>
          </section>

          {/* Seção 2 */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                2
              </span>
              Cookies e Tecnologias de Rastreamento
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Utilizamos cookies para melhorar a experiência do usuário, salvar preferências de tema
                (claro/escuro) e analisar o tráfego de páginas através de ferramentas como o Google
                Analytics.
              </p>
              <p>
                Você tem o poder de desativar os cookies nas configurações do seu navegador de internet
                (Chrome, Firefox, Safari, Edge) ou através de ferramentas de segurança, ciente de que
                algumas funcionalidades interativas do site podem ter sua experiência afetada.
              </p>
            </div>
          </section>

          {/* Seção 3 - Google AdSense (CRUCIAL) */}
          <section className="rounded-2xl border-2 border-blue-500/30 bg-card p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                3
              </span>
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Publicidade e Google AdSense
              </h2>
            </div>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                O Portal Lineup utiliza o serviço de publicidade do{' '}
                <strong className="text-foreground">Google AdSense</strong> para exibir anúncios
                relevantes aos nossos leitores e financiar nossa produção editorial independente.
              </p>

              <div className="rounded-xl border border-amber-500/20 bg-amber-50/60 p-4 dark:border-amber-500/30 dark:bg-amber-950/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="text-xs sm:text-sm text-foreground">
                    <p className="font-semibold text-amber-900 dark:text-amber-200">
                      Diretrizes de Cookies do Google AdSense:
                    </p>
                    <ul className="mt-2 list-inside list-disc space-y-1.5 text-muted-foreground">
                      <li>
                        Fornecedores terceirizados, incluindo o Google, utilizam cookies para veicular
                        anúncios com base em visitas anteriores dos usuários ao nosso website ou a
                        outros sites na Internet.
                      </li>
                      <li>
                        O uso de cookies de publicidade pelo Google permite que ele e seus parceiros
                        veiculem anúncios com base nas visitas feitas ao Portal Lineup e/ou a outros sites.
                      </li>
                      <li>
                        Os usuários podem optar por desativar a publicidade personalizada acessando as{' '}
                        <a
                          href="https://adssettings.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
                        >
                          Configurações de Anúncios do Google
                        </a>
                        .
                      </li>
                      <li>
                        Alternativamente, você pode desativar o uso de cookies de terceiros para
                        publicidade personalizada visitando o portal informativo{' '}
                        <a
                          href="https://www.aboutads.info/choices/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
                        >
                          www.aboutads.info
                        </a>
                        .
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <p>
                O Google AdSense utiliza o cookie DoubleClick DART para fins de exibição de anúncios.
                Caso deseje saber mais sobre as práticas de privacidade do Google e como ele gerencia
                dados de anúncios, consulte a{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
                >
                  Política de Privacidade e Termos da Google
                </a>
                .
              </p>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                4
              </span>
              Finalidade do Tratamento dos Dados
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>Utilizamos os dados coletados com as seguintes finalidades legítimas:</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-2 rounded-lg border border-border p-3">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span className="text-xs sm:text-sm">Prestar suporte e responder mensagens de leitores</span>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-border p-3">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span className="text-xs sm:text-sm">Aprimorar o conteúdo, navegação e desempenho do portal</span>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-border p-3">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span className="text-xs sm:text-sm">Detectar e prevenir fraudes e falhas de segurança</span>
                </div>
                <div className="flex items-start gap-2 rounded-lg border border-border p-3">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span className="text-xs sm:text-sm">Exibir anúncios contextualizados e relevantes</span>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 5 - Direitos do Titular LGPD */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                5
              </span>
              Seus Direitos como Titular de Dados (LGPD)
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>Conforme o Artigo 18 da LGPD, você possui os seguintes direitos garantidos:</p>
              <ul className="list-inside list-disc space-y-1.5 pl-2 text-sm sm:text-base">
                <li>Confirmação da existência de tratamento de dados;</li>
                <li>Acesso aos dados coletados;</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
                <li>Revogação do consentimento a qualquer momento;</li>
                <li>Informação sobre as entidades públicas e privadas com as quais compartilhamos dados.</li>
              </ul>
              <p className="mt-3">
                Para exercer qualquer um desses direitos, basta entrar em contato com nossa equipe
                através da nossa página de <Link href="/contato" className="font-semibold text-blue-600 underline">Contato</Link>.
              </p>
            </div>
          </section>

          {/* Seção 6 */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                6
              </span>
              Segurança das Informações
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Adotamos medidas técnicas, administrativas e organizacionais adequadas para proteger
                seus dados contra acessos não autorizados, destruição acidental ou ilícita, perda,
                alteração ou comunicação indevida. Todas as comunicações em nosso site são protegidas
                por criptografia SSL/TLS (HTTPS).
              </p>
            </div>
          </section>

          {/* Seção 7 */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                7
              </span>
              Links para Sites de Terceiros
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Nossos artigos contêm links para websites externos (emissoras de rádio, redes de TV,
                órgãos governamentais como Anatel e Ministério das Comunicações, entre outros). Não nos
                responsabilizamos pelas políticas de privacidade ou conteúdo praticados por sites
                terceiros. Recomendamos que leia a política de privacidade de cada site visitado.
              </p>
            </div>
          </section>

          {/* Seção 8 - Contato do DPO / Redação */}
          <section className="rounded-2xl border border-blue-600/20 bg-blue-50/60 p-6 sm:p-8 dark:border-blue-900/40 dark:bg-blue-950/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">Dúvidas sobre Privacidade?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Se você tiver qualquer dúvida sobre esta Política de Privacidade ou sobre o
                  tratamento de seus dados pessoais, fale conosco.
                </p>
              </div>
              <Link
                href="/contato"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700"
              >
                Canal de Contato
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
