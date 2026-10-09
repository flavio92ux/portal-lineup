/**
 * Converte HTML de notícias (como do Dial Rádio / Quill)
 * em nós serializados compatíveis com o Lexical Editor do Payload CMS.
 */

export interface LexicalTextNode {
  [k: string]: unknown
  detail: 0
  format: number // 0 = normal, 1 = bold, 2 = italic, 8 = underline, 3 = bold+italic, etc.
  mode: 'normal'
  style: ''
  text: string
  type: 'text'
  version: 1
}

export interface LexicalLinkNode {
  [k: string]: unknown
  children: LexicalTextNode[]
  direction: 'ltr' | 'rtl' | null
  fields: {
    linkType: 'custom'
    newTab: boolean
    url: string
  }
  format: ''
  indent: 0
  type: 'link'
  version: number
}

export interface LexicalParagraphNode {
  [k: string]: unknown
  children: (LexicalTextNode | LexicalLinkNode)[]
  direction: 'ltr' | 'rtl' | null
  format: ''
  indent: 0
  type: 'paragraph'
  version: 1
}

export interface LexicalHeadingNode {
  [k: string]: unknown
  children: (LexicalTextNode | LexicalLinkNode)[]
  direction: 'ltr' | 'rtl' | null
  format: ''
  indent: 0
  tag: 'h1' | 'h2' | 'h3' | 'h4'
  type: 'heading'
  version: 1
}

export type LexicalBlockNode = LexicalParagraphNode | LexicalHeadingNode

export interface LexicalRoot {
  [k: string]: unknown
  root: {
    [k: string]: unknown
    children: LexicalBlockNode[]
    direction: 'ltr' | 'rtl' | null
    format: ''
    indent: 0
    type: 'root'
    version: 1
  }
}

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

export function htmlToLexical(html: string | null | undefined): LexicalRoot {
  if (!html || typeof html !== 'string') {
    return {
      root: {
        children: [],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    }
  }

  // Remove scripts e styles
  const clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  // Encontra todas as tags de bloco (p, h1, h2, h3, h4, blockquote)
  const blockRegex = /<(p|h1|h2|h3|h4|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi
  const blocks: LexicalBlockNode[] = []
  let match: RegExpExecArray | null

  while ((match = blockRegex.exec(clean)) !== null) {
    const rawTag = match[1].toLowerCase()
    const innerHtml = match[2].trim()

    // Extrai texto limpo para checar se é parágrafo vazio ou boilerplate
    const textOnly = innerHtml.replace(/<[^>]+>/g, '').trim()
    if (!textOnly) continue

    // Ignora linhas de contato / sugestão de pauta do site de origem
    if (
      textOnly.toLowerCase().includes('envie suas sugestoes de pauta') ||
      textOnly.toLowerCase().includes('envie suas sugestões de pauta')
    ) {
      continue
    }

    // Divide em tags e fragmentos de texto
    const tokens = innerHtml.split(/(<[^>]+>)/g).filter(Boolean)
    const children: (LexicalTextNode | LexicalLinkNode)[] = []

    let isBold = false
    let isItalic = false
    let isUnderline = false
    let currentLink: string | null = null

    for (const token of tokens) {
      if (token.startsWith('<') && token.endsWith('>')) {
        const lower = token.toLowerCase()

        if (
          (lower.startsWith('<strong') || lower.startsWith('<b')) &&
          !lower.startsWith('<br') &&
          !lower.startsWith('<block')
        ) {
          isBold = true
        } else if (lower.startsWith('</strong') || lower.startsWith('</b')) {
          isBold = false
        } else if (lower.startsWith('<em') || lower.startsWith('<i')) {
          isItalic = true
        } else if (lower.startsWith('</em') || lower.startsWith('</i')) {
          isItalic = false
        } else if (lower.startsWith('<u')) {
          isUnderline = true
        } else if (lower.startsWith('</u')) {
          isUnderline = false
        } else if (lower.startsWith('<a')) {
          const hrefMatch = token.match(/href=["']([^"']*)["']/i)
          currentLink = hrefMatch ? hrefMatch[1] : null
        } else if (lower.startsWith('</a')) {
          currentLink = null
        }
      } else {
        const text = decodeHtmlEntities(token)
        if (!text) continue

        let format = 0
        if (isBold) format |= 1
        if (isItalic) format |= 2
        if (isUnderline) format |= 8

        const textNode: LexicalTextNode = {
          detail: 0,
          format,
          mode: 'normal',
          style: '',
          text,
          type: 'text',
          version: 1,
        }

        if (currentLink) {
          children.push({
            children: [textNode],
            direction: 'ltr',
            fields: {
              linkType: 'custom',
              newTab: true,
              url: currentLink,
            },
            format: '',
            indent: 0,
            type: 'link',
            version: 3,
          })
        } else {
          children.push(textNode)
        }
      }
    }

    if (children.length > 0) {
      if (rawTag.startsWith('h')) {
        blocks.push({
          children,
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: rawTag as 'h1' | 'h2' | 'h3' | 'h4',
          type: 'heading',
          version: 1,
        })
      } else {
        blocks.push({
          children,
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        })
      }
    }
  }

  // Fallback caso o HTML não tivesse tags <p> e fosse apenas texto plano
  if (blocks.length === 0 && clean.trim()) {
    const plainText = decodeHtmlEntities(clean.replace(/<[^>]+>/g, '').trim())
    if (plainText) {
      blocks.push({
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: plainText,
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      })
    }
  }

  return {
    root: {
      children: blocks,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}
