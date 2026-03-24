import { generateText, Output } from 'ai'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const { title, subtitle, headline, existingTags } = await req.json()

    if (!title) {
      return Response.json({ error: 'Title is required' }, { status: 400 })
    }

    const context = [
      title && `Titulo: ${title}`,
      subtitle && `Subtitulo: ${subtitle}`,
      headline && `Versal: ${headline}`,
      existingTags?.length > 0 && `Tags existentes: ${existingTags.join(', ')}`,
    ]
      .filter(Boolean)
      .join('\n')

    const { output } = await generateText({
      model: 'openai/gpt-4o-mini',
      output: Output.object({
        schema: z.object({
          suggestions: z.array(z.string()).describe('Lista de tags sugeridas para SEO'),
        }),
      }),
      prompt: `Voce e um especialista em SEO para um portal de noticias sobre radio e TV do Brasil.

Com base no conteudo abaixo, sugira de 8 a 12 tags/keywords relevantes para SEO.

${context}

Regras para as tags:
- Devem ser em portugues brasileiro
- Devem ser relevantes para o tema de radio, TV e midia brasileira
- Use termos que pessoas pesquisariam no Google
- Inclua nomes de emissoras, programas ou apresentadores mencionados
- Inclua termos genericos do setor (audiencia, ibope, programacao, etc)
- Use letras minusculas
- Nao repita tags que ja existem: ${existingTags?.join(', ') || 'nenhuma'}
- Prefira termos curtos (1-3 palavras)

Retorne apenas tags relevantes e uteis para SEO.`,
      maxOutputTokens: 500,
      temperature: 0.7,
    })

    return Response.json({ suggestions: output?.suggestions || [] })
  } catch (error) {
    console.error('Error generating tag suggestions:', error)
    return Response.json({ suggestions: [], error: 'Failed to generate suggestions' }, { status: 500 })
  }
}
