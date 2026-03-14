import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { Open_Sans } from 'next/font/google'
import React from 'react'

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
})

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import Script from 'next/script'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(openSans.variable, GeistMono.variable)}
      lang="pt-BR"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <Script
          type="text/javascript"
          id="mmvst_globe"
          src="//mapmyvisitors.com/globe.js?d=RXIlyWDwGqOYT8MCCFtobXfF4_6rL40SyzIhGJDLa4k"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VEDTNPFG1Y"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-VEDTNPFG1Y');
          `}
        </Script>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'PORTAL LINEUP',
    template: '%s | PORTAL LINEUP',
  },
  description: 'PORTAL LINEUP - As principais noticias sobre radio e TV do Brasil.',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@portallineup',
  },
}
