import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Portal Lineup - As principais notícias, análises e colunas sobre rádio e TV do Brasil. Cobertura completa do mercado de comunicação brasileiro.',
  images: [
    {
      url: `${getServerSideURL()}/web-app-manifest-512x512.png`,
      width: 512,
      height: 512,
      alt: 'Portal Lineup - Portal de Notícias sobre Rádio e TV',
    },
  ],
  siteName: 'Portal Lineup',
  title: 'Portal Lineup - Portal de Notícias sobre Rádio e TV do Brasil',
  locale: 'pt_BR',
  url: getServerSideURL(),
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
