import type { Payload } from 'payload'
import { htmlToLexical } from '../dialradio/htmlToLexical'

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

interface SitemapItem {
  loc: string
  lastmod?: string
}

interface TudoRadioArticleDetails {
  title: string
  subtitle?: string
  headline?: string
  contentHtml: string
  imageUrl?: string
  datePublished?: string
  authorName?: string
  section?: string
  tags: string[]
}

const SITEMAP_URL = 'https://tudoradio.com/sitemaps/noticias.xml'
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

/**
 * Decodifica entidades HTML básicas para strings limpas.
 */
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&apos;/g, "'")
}

/**
 * Faz o parse do sitemap XML de notícias do Tudo Rádio.
 * Extrai as primeiras URLs sem precisar percorrer todo o XML pesado na memória.
 */
function parseSitemap(xml: string, limit: number): SitemapItem[] {
  const items: SitemapItem[] = []
  const maxToExtract = Math.max(limit * 3, 30) // Margem de segurança para pular os já cadastrados

  const urlRegex = /<url>([\s\S]*?)<\/url>/gi
  let match: RegExpExecArray | null

  while ((match = urlRegex.exec(xml)) !== null && items.length < maxToExtract) {
    const block = match[1]
    const locMatch = block.match(/<loc>([\s\S]*?)<\/loc>/i)
    const lastmodMatch = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/i)

    const loc = locMatch?.[1]?.trim()
    const lastmod = lastmodMatch?.[1]?.trim()

    if (loc && loc.startsWith('http')) {
      items.push({ loc, lastmod })
    }
  }

  return items
}

/**
 * Extrai os detalhes completos da matéria a partir da página HTML do Tudo Rádio.
 * Utiliza JSON-LD (NewsArticle), meta tags OpenGraph e o container de texto prose.
 */
async function fetchArticleDetails(url: string): Promise<TudoRadioArticleDetails | null> {
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
      console.warn(`[TudoRadio] Erro HTTP ao acessar ${url}: ${res.status}`)
      return null
    }

    const html = await res.text()

    // 1. JSON-LD estruturado
    const ldMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
    let newsArticle: any = null
    for (const m of ldMatches) {
      try {
        const parsed = JSON.parse(m[1])
        if (parsed['@type'] === 'NewsArticle') {
          newsArticle = parsed
          break
        }
      } catch {
        // Ignora blocos JSON-LD que não sejam válidos ou relevantes
      }
    }

    // 2. Metadados e OpenGraph como fallback
    const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([\s\S]*?)["']/i)
    const ogDescMatch = html.match(
      /<meta\s+(?:property=["']og:description["']|name=["']description["'])\s+content=["']([\s\S]*?)["']/i,
    )
    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i)
    const sectionMetaMatch = html.match(/<meta\s+property=["']article:section["']\s+content=["']([^"']*)["']/i)
    const publishedMetaMatch = html.match(
      /<meta\s+(?:property=["']article:published_time["']|name=["']article:published_time["'])\s+content=["']([^"']*)["']/i,
    )

    // Tags/Palavras-chave
    const tagMatches = [...html.matchAll(/<meta\s+property=["']article:tag["']\s+content=["']([^"']*)["']/gi)]
    const tags = tagMatches.map((t) => decodeHtmlEntities(t[1].trim())).filter(Boolean)

    // Versal / Badge de categoria no topo
    const badgeMatch = html.match(/<span class="text-trblue-600[^"]*font-medium">([^<]+)<\/span>/i)
    const headlineBadge = badgeMatch?.[1]?.trim()

    // Título
    let title = newsArticle?.headline || (ogTitleMatch ? ogTitleMatch[1].replace(/\s*\|\s*Tudo Rádio$/i, '') : '')
    title = decodeHtmlEntities(title).trim()

    // Subtítulo / Descrição
    let subtitle = newsArticle?.description || ogDescMatch?.[1] || ''
    subtitle = decodeHtmlEntities(subtitle).trim()

    // Versal / Headline
    const section = newsArticle?.articleSection || sectionMetaMatch?.[1] || ''
    const headline = headlineBadge || (section && section !== 'Geral' ? section : 'Tudo Rádio')

    // Imagem
    let rawImage =
      typeof newsArticle?.image === 'string'
        ? newsArticle.image
        : newsArticle?.image?.url || ogImageMatch?.[1]

    if (rawImage && rawImage.startsWith('/')) {
      rawImage = `https://tudoradio.com${rawImage}`
    }

    // Data de publicação
    const datePublished = newsArticle?.datePublished || publishedMetaMatch?.[1]

    // Autor
    const authorName = newsArticle?.author?.name || undefined

    // 3. Conteúdo HTML da matéria
    let contentHtml = ''
    const proseMatch = html.match(/<div class="[^"]*prose prose-lg[^"]*">([\s\S]*?)<\/div>\s*<\/section>/i)
    if (proseMatch) {
      contentHtml = proseMatch[1].trim()
    } else {
      const genericProse = html.match(/<div class="[^"]*prose[^"]*">([\s\S]*?)<\/div>/i)
      if (genericProse) {
        contentHtml = genericProse[1].trim()
      } else if (subtitle) {
        contentHtml = `<p>${subtitle}</p>`
      }
    }

    if (!title) {
      return null
    }

    return {
      title,
      subtitle,
      headline,
      contentHtml,
      imageUrl: rawImage,
      datePublished,
      authorName,
      section,
      tags,
    }
  } catch (error) {
    console.error(`[TudoRadio] Falha ao extrair detalhes de ${url}:`, error)
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
      console.warn(`[TudoRadio] Falha ao baixar imagem ${imageUrl}: HTTP ${res.status}`)
      return null
    }

    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const contentType = res.headers.get('content-type') || 'image/jpeg'

    // Obtém o nome do arquivo a partir do header ou da URL
    const disposition = res.headers.get('content-disposition') || ''
    const filenameMatch = disposition.match(/filename="?([^";]+)"?/i)

    const urlParts = imageUrl.split('/')
    let rawFilename =
      filenameMatch?.[1] ||
      urlParts[urlParts.length - 1]?.split('?')[0] ||
      `tudoradio-${Date.now()}.jpg`

    if (!rawFilename.includes('.')) {
      const ext = contentType.includes('png') ? '.png' : contentType.includes('webp') ? '.webp' : '.jpg'
      rawFilename += ext
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
    console.warn(`[TudoRadio] Erro ao cadastrar mídia (${imageUrl}):`, error)
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
    console.warn(`[TudoRadio] Erro ao buscar/criar categoria "${categoryName}":`, err)
    return null
  }
}

/**
 * Função principal de sincronização de notícias do Tudo Rádio via Sitemap para o Payload CMS.
 */
export async function syncTudoRadioNews(
  payload: Payload,
  options: SyncOptions = {},
): Promise<SyncReport> {
  const startedAt = new Date().toISOString()
  const { limit = 10, forceDraft = false } = options
  const results: SyncResultItem[] = []

  let importedCount = 0
  let skippedCount = 0
  let errorCount = 0

  payload.logger.info('[TudoRadio] Iniciando sincronização de notícias via Sitemap...')

  // 1. Obtém o sitemap XML
  let sitemapXml = ''
  try {
    const sitemapRes = await fetch(SITEMAP_URL, {
      headers: { 'User-Agent': USER_AGENT },
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(15000),
    })

    if (!sitemapRes.ok) {
      throw new Error(`HTTP ${sitemapRes.status} ao obter Sitemap: ${SITEMAP_URL}`)
    }

    sitemapXml = await sitemapRes.text()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    payload.logger.error(`[TudoRadio] Falha ao carregar sitemap: ${msg}`)
    return {
      success: false,
      totalFeedItems: 0,
      importedCount: 0,
      skippedCount: 0,
      errorCount: 1,
      items: [
        {
          slug: '',
          title: 'Sitemap Fetch',
          status: 'error',
          message: msg,
        },
      ],
      startedAt,
      finishedAt: new Date().toISOString(),
    }
  }

  const sitemapItems = parseSitemap(sitemapXml, limit)
  payload.logger.info(
    `[TudoRadio] Encontrados itens recentes no Sitemap. Avaliando até ${sitemapItems.length} candidatos para limite de ${limit}...`,
  )

  // Busca autor padrão (primeiro usuário admin/editor encontrado)
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

  // 2. Itera sobre cada notícia do sitemap
  for (const item of sitemapItems) {
    if (importedCount >= limit) {
      break
    }

    const urlParts = item.loc.replace(/\/$/, '').split('/')
    const slug = urlParts[urlParts.length - 1]

    if (!slug) {
      continue
    }

    try {
      // 3. Verificação rápida se o slug já existe no banco antes de fazer scraping
      const existing = await payload.find({
        collection: 'posts',
        where: {
          slug: { equals: slug },
        },
        limit: 1,
        pagination: false,
      })

      if (existing.docs.length > 0) {
        results.push({
          slug,
          title: (existing.docs[0] as any).title || slug,
          status: 'skipped',
          message: 'Post já existe no banco (verificação de slug)',
        })
        skippedCount++
        continue
      }

      // 4. Carrega detalhes da página da matéria
      payload.logger.info(`[TudoRadio] Extraindo detalhes da matéria: ${slug}`)
      const details = await fetchArticleDetails(item.loc)

      if (!details) {
        results.push({
          slug,
          title: slug,
          status: 'error',
          message: 'Não foi possível extrair dados da página da matéria',
        })
        errorCount++
        continue
      }

      // 5. Segunda verificação por título caso tenha havido importação com outro slug
      const existingTitle = await payload.find({
        collection: 'posts',
        where: {
          title: { equals: details.title },
        },
        limit: 1,
        pagination: false,
      })

      if (existingTitle.docs.length > 0) {
        results.push({
          slug,
          title: details.title,
          status: 'skipped',
          message: 'Post já existe no banco (verificação de título)',
        })
        skippedCount++
        continue
      }

      // 6. Converte corpo HTML para AST Lexical com nota de atribuição/crédito
      const creditAuthor = details.authorName ? ` por ${details.authorName}` : ''
      const attributionNote = `<p><em>Esta notícia foi originalmente publicada${creditAuthor} no portal <a href="${item.loc}" target="_blank" rel="noopener noreferrer">tudoradio.com</a>. Todos os direitos reservados à fonte original.</em></p>`
      const finalHtml = `${details.contentHtml}\n${attributionNote}`
      const lexicalContent = htmlToLexical(finalHtml)

      // 7. Categorias: adiciona "Tudo Rádio" e seção específica se houver
      const categoryIds: (string | number)[] = []
      const tudoRadioCatId = await getOrCreateCategory(payload, 'Tudo Rádio')
      if (tudoRadioCatId) categoryIds.push(tudoRadioCatId)

      if (details.section && details.section !== 'Geral' && details.section !== 'Notícias') {
        const secCatId = await getOrCreateCategory(payload, details.section)
        if (secCatId && !categoryIds.includes(secCatId)) {
          categoryIds.push(secCatId)
        }
      }

      // 8. Imagem Hero
      let heroImageId: string | number | null = null
      if (details.imageUrl) {
        heroImageId = await importMediaImage(payload, details.imageUrl, details.title)
      }

      const pubDate = details.datePublished || item.lastmod || new Date().toISOString()

      // 9. Cria o post no Payload CMS
      await payload.create({
        collection: 'posts',
        data: {
          title: details.title,
          subtitle: details.subtitle,
          headline: details.headline || 'Tudo Rádio',
          type: 'news',
          slug,
          content: lexicalContent,
          heroImage: heroImageId ? (heroImageId as any) : undefined,
          categories: categoryIds.length > 0 ? (categoryIds as any) : undefined,
          authors: defaultAuthorId ? ([defaultAuthorId] as any) : undefined,
          publishedAt: new Date(pubDate).toISOString(),
          _status: forceDraft ? 'draft' : 'published',
          meta: {
            title: details.title,
            description: details.subtitle || details.title,
            keywords: details.tags.length > 0 ? details.tags : undefined,
          },
        },
      })

      results.push({
        slug,
        title: details.title,
        status: 'imported',
        message: forceDraft ? 'Importado como rascunho' : 'Publicado com sucesso',
      })
      importedCount++
      payload.logger.info(`[TudoRadio] Publicado com sucesso: "${details.title}" (slug: ${slug})`)
    } catch (postError) {
      const errMsg = postError instanceof Error ? postError.message : String(postError)
      payload.logger.error(`[TudoRadio] Erro ao importar slug "${slug}": ${errMsg}`)
      results.push({
        slug,
        title: slug,
        status: 'error',
        message: errMsg,
      })
      errorCount++
    }
  }

  const finishedAt = new Date().toISOString()
  payload.logger.info(
    `[TudoRadio] Sincronização finalizada: ${importedCount} importados, ${skippedCount} ignorados, ${errorCount} erros.`,
  )

  return {
    success: errorCount === 0 || importedCount > 0,
    totalFeedItems: sitemapItems.length,
    importedCount,
    skippedCount,
    errorCount,
    items: results,
    startedAt,
    finishedAt,
  }
}
