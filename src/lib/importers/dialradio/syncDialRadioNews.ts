import type { Payload } from 'payload'
import { htmlToLexical } from './htmlToLexical'

export interface SyncOptions {
  limit?: number
  forceDraft?: boolean
}

export interface SyncResultItem {
  slug: string
  title: string
  status: 'imported' | 'skipped' | 'error'
  message?: string
}

export interface SyncReport {
  success: boolean
  totalFeedItems: number
  importedCount: number
  skippedCount: number
  errorCount: number
  items: SyncResultItem[]
  startedAt: string
  finishedAt: string
}

interface RssItem {
  title: string
  link: string
  pubDate: string
  description: string
  imageUrl?: string
}

interface DialRadioMateria {
  id?: number
  titulo?: string
  subtitulo?: string
  conteudoHtml?: string
  imgDestaque?: string
  dataPublicacao?: string
  tituloUrl?: string
  editorias?: Array<{ id: number; nome: string }>
}

const RSS_URL = 'https://dialradio.com.br/rss.xml'
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

/**
 * Faz o parse básico e seguro do feed RSS da Dial Rádio.
 */
function parseRssFeed(xml: string): RssItem[] {
  const items: RssItem[] = []
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || []

  for (const itemXml of itemMatches) {
    const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/title>/i)
    const linkMatch = itemXml.match(/<link>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/link>/i)
    const pubDateMatch = itemXml.match(
      /<pubDate>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/pubDate>/i,
    )
    const descMatch = itemXml.match(
      /<description>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/description>/i,
    )
    const enclosureMatch = itemXml.match(/<enclosure\s+[^>]*url=["']([^"']*)["']/i)

    const title = (titleMatch?.[1] || titleMatch?.[2] || '').trim()
    const link = (linkMatch?.[1] || linkMatch?.[2] || '').trim()
    const pubDate = (pubDateMatch?.[1] || pubDateMatch?.[2] || '').trim()
    const description = (descMatch?.[1] || descMatch?.[2] || '').trim()
    const imageUrl = enclosureMatch?.[1]?.trim()

    if (title && link) {
      items.push({
        title,
        link,
        pubDate,
        description,
        imageUrl,
      })
    }
  }

  return items
}

/**
 * Extrai os dados completos da matéria a partir da página HTML do Dial Rádio.
 * Utiliza o script vike_pageContext embutido pelo framework SSR da página.
 */
async function fetchMateriaDetails(url: string): Promise<DialRadioMateria | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      console.warn(`[DialRadio] Erro HTTP ao acessar ${url}: ${res.status}`)
      return null
    }

    const html = await res.text()

    // Busca o bloco vike_pageContext
    const match = html.match(
      /<script id="vike_pageContext" type="application\/json">([\s\S]*?)<\/script>/,
    )
    if (!match) {
      console.warn(`[DialRadio] Bloco vike_pageContext não encontrado na URL: ${url}`)
      return null
    }

    const pageContext = JSON.parse(match[1])
    const materia = pageContext?.data?.materia as DialRadioMateria | undefined
    return materia || null
  } catch (error) {
    console.error(`[DialRadio] Falha ao extrair detalhes de ${url}:`, error)
    return null
  }
}

/**
 * Faz download de uma imagem externa e cria o registro na collection Media do Payload.
 */
async function importMediaImage(
  payload: Payload,
  imageUrl: string,
  altText: string,
): Promise<string | number | null> {
  try {
    const res = await fetch(imageUrl, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      console.warn(`[DialRadio] Falha ao baixar imagem ${imageUrl}: HTTP ${res.status}`)
      return null
    }

    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const contentType = res.headers.get('content-type') || 'image/webp'

    // Obtém o nome do arquivo limpo
    const urlParts = imageUrl.split('/')
    let rawFilename = urlParts[urlParts.length - 1]?.split('?')[0] || `dialradio-${Date.now()}.webp`
    if (!rawFilename.includes('.')) {
      rawFilename += '.webp'
    }

    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: altText,
      },
      file: {
        data: buffer,
        mimetype: contentType,
        name: rawFilename,
        size: buffer.byteLength,
      },
    })

    return mediaDoc.id
  } catch (error) {
    console.warn(`[DialRadio] Erro ao cadastrar mídia (${imageUrl}):`, error)
    return null
  }
}

/**
 * Garante que uma categoria exista no Payload e retorna o ID.
 */
async function getOrCreateCategory(
  payload: Payload,
  categoryName: string,
): Promise<string | number | null> {
  if (!categoryName) return null

  try {
    const existing = await payload.find({
      collection: 'categories',
      where: {
        title: { equals: categoryName },
      },
      limit: 1,
      pagination: false,
    })

    if (existing.docs.length > 0) {
      return existing.docs[0].id
    }

    const created = await payload.create({
      collection: 'categories',
      data: {
        title: categoryName,
      },
    })

    return created.id
  } catch (err) {
    console.warn(`[DialRadio] Erro ao buscar/criar categoria "${categoryName}":`, err)
    return null
  }
}

/**
 * Função principal de sincronização de notícias do Dial Rádio para o Payload CMS.
 */
export async function syncDialRadioNews(
  payload: Payload,
  options: SyncOptions = {},
): Promise<SyncReport> {
  const startedAt = new Date().toISOString()
  const { limit = 15, forceDraft = false } = options
  const results: SyncResultItem[] = []

  let importedCount = 0
  let skippedCount = 0
  let errorCount = 0

  payload.logger.info('[DialRadio] Iniciando sincronização de notícias via RSS...')

  // 1. Obtém o feed RSS
  let rssXml = ''
  try {
    const rssRes = await fetch(RSS_URL, {
      headers: { 'User-Agent': USER_AGENT },
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(15000),
    })

    if (!rssRes.ok) {
      throw new Error(`HTTP ${rssRes.status} ao obter RSS: ${RSS_URL}`)
    }

    rssXml = await rssRes.text()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    payload.logger.error(`[DialRadio] Falha ao carregar RSS: ${msg}`)
    return {
      success: false,
      totalFeedItems: 0,
      importedCount: 0,
      skippedCount: 0,
      errorCount: 1,
      items: [
        {
          slug: '',
          title: 'RSS Feed Fetch',
          status: 'error',
          message: msg,
        },
      ],
      startedAt,
      finishedAt: new Date().toISOString(),
    }
  }

  const feedItems = parseRssFeed(rssXml)
  const itemsToProcess = feedItems.slice(0, limit)
  payload.logger.info(`[DialRadio] Encontrados ${feedItems.length} itens no RSS. Processando ${itemsToProcess.length}...`)

  // Busca autor padrão (primeiro usuário admin/editor encontrado) se houver
  let defaultAuthorId: string | number | undefined
  try {
    const users = await payload.find({
      collection: 'users',
      limit: 1,
      pagination: false,
    })
    if (users.docs.length > 0) {
      defaultAuthorId = users.docs[0].id
    }
  } catch {
    // Campo de autor não é obrigatório
  }

  // 2. Itera sobre cada notícia
  for (const item of itemsToProcess) {
    // Determina o slug a partir da URL da notícia
    // Ex: https://dialradio.com.br/noticias/th-sbt-reduz... -> th-sbt-reduz...
    const urlParts = item.link.replace(/\/$/, '').split('/')
    const slug = urlParts[urlParts.length - 1]

    if (!slug) {
      results.push({
        slug: '',
        title: item.title,
        status: 'error',
        message: 'Não foi possível extrair slug da URL',
      })
      errorCount++
      continue
    }

    try {
      // 3. Verifica se a notícia já foi importada
      const existing = await payload.find({
        collection: 'posts',
        where: {
          or: [
            { slug: { equals: slug } },
            { title: { equals: item.title } },
          ],
        },
        limit: 1,
        pagination: false,
      })

      if (existing.docs.length > 0) {
        results.push({
          slug,
          title: item.title,
          status: 'skipped',
          message: 'Post já existe no banco',
        })
        skippedCount++
        continue
      }

      // 4. Carrega detalhes da página da matéria (incluindo conteudoHtml completo)
      payload.logger.info(`[DialRadio] Extraindo detalhes da matéria: ${slug}`)
      const details = await fetchMateriaDetails(item.link)

      const title = details?.titulo || item.title
      const subtitle = details?.subtitulo || item.description
      const rawHtml = details?.conteudoHtml || `<p>${item.description}</p>`
      const pubDate = details?.dataPublicacao || item.pubDate || new Date().toISOString()
      const rawImage = details?.imgDestaque || item.imageUrl

      // Converte o corpo HTML para o AST do Lexical com nota de atribuição/crédito
      const attributionNote = `<p><em>Esta notícia foi originalmente publicada no portal <a href="${item.link}" target="_blank" rel="noopener noreferrer">Dial Rádio</a>. Todos os direitos reservados à fonte original.</em></p>`
      const finalHtml = `${rawHtml}\n${attributionNote}`
      const lexicalContent = htmlToLexical(finalHtml)

      // 5. Trata Categorias
      const categoryIds: (string | number)[] = []
      if (details?.editorias && Array.isArray(details.editorias)) {
        for (const ed of details.editorias) {
          if (ed.nome) {
            const catId = await getOrCreateCategory(payload, ed.nome)
            if (catId) categoryIds.push(catId)
          }
        }
      }

      // 6. Trata Imagem de Capa (Hero Image)
      let heroImageId: string | number | null = null
      if (rawImage) {
        const fullImageUrl = rawImage.startsWith('http')
          ? rawImage
          : `https://img.dialradio.com.br/${rawImage.replace(/^\//, '')}`

        heroImageId = await importMediaImage(payload, fullImageUrl, title)
      }

      // Versal / Headline: usa o nome da primeira editoria ou padrão
      const headline = details?.editorias?.[0]?.nome || 'Notícia'

      // 7. Cria o post no Payload CMS (publicado diretamente conforme solicitado)
      await payload.create({
        collection: 'posts',
        data: {
          title,
          subtitle,
          headline,
          type: 'news',
          slug,
          content: lexicalContent,
          heroImage: heroImageId ? (heroImageId as any) : undefined,
          categories: categoryIds.length > 0 ? (categoryIds as any) : undefined,
          authors: defaultAuthorId ? ([defaultAuthorId] as any) : undefined,
          publishedAt: new Date(pubDate).toISOString(),
          _status: forceDraft ? 'draft' : 'published',
          meta: {
            title,
            description: subtitle || title,
          },
        },
      })

      results.push({
        slug,
        title,
        status: 'imported',
        message: forceDraft ? 'Importado como rascunho' : 'Publicado com sucesso',
      })
      importedCount++
      payload.logger.info(`[DialRadio] Publicado com sucesso: "${title}" (slug: ${slug})`)
    } catch (postError) {
      const errMsg = postError instanceof Error ? postError.message : String(postError)
      payload.logger.error(`[DialRadio] Erro ao importar "${item.title}": ${errMsg}`)
      results.push({
        slug,
        title: item.title,
        status: 'error',
        message: errMsg,
      })
      errorCount++
    }
  }

  const finishedAt = new Date().toISOString()
  payload.logger.info(
    `[DialRadio] Sincronização finalizada: ${importedCount} importados, ${skippedCount} ignorados, ${errorCount} erros.`,
  )

  return {
    success: errorCount === 0 || importedCount > 0,
    totalFeedItems: feedItems.length,
    importedCount,
    skippedCount,
    errorCount,
    items: results,
    startedAt,
    finishedAt,
  }
}
