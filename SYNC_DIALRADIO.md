# Sincronização e Publicação Automática de Notícias (Dial Rádio & Tudo Rádio)

Este módulo implementa a coleta, conversão e publicação automática de notícias a partir dos portais:
- **Dial Rádio** (`https://dialradio.com.br`) via Feed RSS + SSR.
- **Tudo Rádio** (`https://tudoradio.com`) via Sitemap XML (`https://tudoradio.com/sitemaps/noticias.xml`) + scraping inteligente de JSON-LD e HTML.

Diretamente no **Payload CMS** do Portal Lineup.

---

## 1. Visão Geral da Arquitetura

O processo combina a leitura de fontes leves (Feed **RSS** para Dial Rádio e **Sitemap XML** para Tudo Rádio) com extração rica de metadados e conversão do corpo da notícia para o **Lexical AST**, sem necessidade de navegadores pesados (como Puppeteer ou Playwright):

```
┌──────────────────────────────────────────────┐
│ Dial Rádio: dialradio.com.br/rss             │
│ Tudo Rádio: tudoradio.com/sitemaps/noticias  │
└──────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ Verificação Anti-Duplicação                  │ ──> Checa se o slug ou título já existe no banco
└──────────────────────────────────────────────┘
                       │ (Apenas novos)
                       ▼
┌──────────────────────────────────────────────┐
│ Fetch da Notícia & Extração Estruturada      │ ──> JSON-LD (NewsArticle), SSR Context e HTML prose
└──────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ Conversão HTML -> Lexical AST                │ ──> Converte tags (<p>, <strong>, etc.) para nós Lexical
└──────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ Download & Upload de Mídia                   │ ──> Salva imagem em WebP/JPEG na collection 'media'
└──────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ Categorias & Publicação Direta               │ ──> Cria post publicado (_status: 'published') em 'posts'
└──────────────────────────────────────────────┘
```

---

## 2. Estrutura dos Arquivos

Os arquivos implementados estão organizados da seguinte forma:

| Arquivo | Função |
| :--- | :--- |
| [`src/lib/importers/dialradio/htmlToLexical.ts`](file:///home/flavio/Projetos/portal-lineup/src/lib/importers/dialradio/htmlToLexical.ts) | Converte o HTML da notícia para a árvore AST nativa do Lexical Editor. Preserva negrito, itálico, sublinhado, links e títulos, além de limpar parágrafos vazios e rodapés de redação. |
| [`src/lib/importers/dialradio/syncDialRadioNews.ts`](file:///home/flavio/Projetos/portal-lineup/src/lib/importers/dialradio/syncDialRadioNews.ts) | Serviço do Dial Rádio: lê o RSS, evita duplicatas, baixa imagens para a collection `media`, associa/cria categorias e salva os posts publicados. |
| [`src/lib/importers/tudoradio/syncTudoRadioNews.ts`](file:///home/flavio/Projetos/portal-lineup/src/lib/importers/tudoradio/syncTudoRadioNews.ts) | Serviço do Tudo Rádio: lê o sitemap XML, extrai JSON-LD, metadados e prose, cadastra mídia e salva posts. |
| [`src/app/api/cron/sync-dialradio/route.ts`](file:///home/flavio/Projetos/portal-lineup/src/app/api/cron/sync-dialradio/route.ts) | Endpoint unificado (`GET` e `POST`) com suporte ao parâmetro `?source=all|dialradio|tudoradio` para rodar na mesma cron do Vercel. |
| [`src/app/api/cron/sync-tudoradio/route.ts`](file:///home/flavio/Projetos/portal-lineup/src/app/api/cron/sync-tudoradio/route.ts) | Endpoint dedicado específico para o Tudo Rádio. |
| [`src/scripts/syncAllNews.ts`](file:///home/flavio/Projetos/portal-lineup/src/scripts/syncAllNews.ts) | Script CLI unificado (`npm run sync:all`) para sincronizar ambos de uma só vez. |
| [`src/scripts/syncTudoRadio.ts`](file:///home/flavio/Projetos/portal-lineup/src/scripts/syncTudoRadio.ts) | Script CLI específico para o Tudo Rádio (`npm run sync:tudoradio`). |
| [`src/scripts/syncDialRadio.ts`](file:///home/flavio/Projetos/portal-lineup/src/scripts/syncDialRadio.ts) | Script CLI específico para o Dial Rádio (`npm run sync:dialradio`). |

---

## 3. Variáveis de Ambiente (`.env`)

Certifique-se de configurar a chave de segurança para proteger o endpoint de cron:

```env
# Chave secreta para autorizar a execução do cron
CRON_SECRET=sua_chave_secreta_aqui
```

> **Nota**: Em ambiente de desenvolvimento (`NODE_ENV !== 'production'`), se `CRON_SECRET` não estiver definido, o endpoint aceitará requisições locais para facilitar testes.

---

## 4. Como Executar Manualmente

### Opção A: Via Terminal (Script NPM / Payload CLI)

Você pode disparar a sincronização a qualquer momento pelo terminal:

```bash
# Sincroniza ambas as fontes (Dial Rádio + Tudo Rádio)
npm run sync:all

# Sincroniza apenas o Tudo Rádio (via Sitemap)
npm run sync:tudoradio

# Sincroniza apenas o Dial Rádio (via RSS)
npm run sync:dialradio
```

### Opção B: Via Requisição HTTP (cURL ou Navegador)

Você pode chamar o endpoint enviando o parâmetro `?secret=`:

```bash
# Sincroniza ambas as fontes na mesma chamada (padrão)
curl -X POST "http://localhost:3000/api/cron/sync-dialradio?secret=sua_chave_secreta_aqui"

# Sincroniza apenas o Tudo Rádio
curl -X POST "http://localhost:3000/api/cron/sync-dialradio?secret=sua_chave_secreta_aqui&source=tudoradio"

# Sincroniza apenas o Dial Rádio
curl -X POST "http://localhost:3000/api/cron/sync-dialradio?secret=sua_chave_secreta_aqui&source=dialradio"
```

Ou chamando o endpoint dedicado do Tudo Rádio:
```bash
curl -X POST "http://localhost:3000/api/cron/sync-tudoradio?secret=sua_chave_secreta_aqui"
```

#### Parâmetros Opcionais via Query String:

- `source`: Fonte a sincronizar: `all` (padrão), `dialradio` ou `tudoradio`.
- `limit`: Quantidade máxima de itens a processar por fonte por execução (padrão: `10`).
  - Exemplo: `?limit=5`
- `draft`: Se enviado como `true`, salva as matérias como rascunho em vez de publicar diretamente (padrão: `false`).
  - Exemplo: `?draft=true`

Exemplo de retorno JSON:
```json
{
  "success": true,
  "totalFeedItems": 50,
  "importedCount": 1,
  "skippedCount": 14,
  "errorCount": 0,
  "items": [
    {
      "slug": "th-sbt-reduz-equipes-e-demite-profissionais-de-diferentes-areas-na-paraiba",
      "title": "TH+ SBT reduz equipes e demite profissionais de diferentes áreas na Paraíba",
      "status": "imported",
      "message": "Publicado com sucesso"
    }
  ],
  "startedAt": "2026-10-09T12:40:15.575Z",
  "finishedAt": "2026-10-09T12:40:59.008Z"
}
```

---

## 5. Configuração da Rotina Periódica (Cron)

Escolha a opção que melhor se adapta à infraestrutura onde o projeto está hospedado:

### Opção 1: Linux Crontab (Servidor / VPS / Docker Host)

No servidor Linux, abra a edição do cron:

```bash
crontab -e
```

Adicione uma das linhas abaixo para executar, por exemplo, a cada 30 minutos:

**Via cURL (Recomendado):**
```bash
*/30 * * * * curl -s -X POST "http://localhost:3000/api/cron/sync-dialradio?secret=sua_chave_secreta_aqui" > /dev/null 2>&1
```

**Via comando CLI:**
```bash
*/30 * * * * cd /caminho/do/portal-lineup && npm run sync:dialradio >> /var/log/sync-dialradio.log 2>&1
```

---

### Opção 2: Vercel Cron (Deploy na Vercel)

Se a aplicação estiver hospedada na Vercel, adicione o arquivo `vercel.json` na raiz do projeto:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-dialradio",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

Na Vercel, adicione a variável de ambiente `CRON_SECRET`. O próprio ecossistema Vercel enviará automaticamente o header `Authorization: Bearer <CRON_SECRET>` a cada ciclo.

---

### Opção 3: Serviços Externos Gratuitos (cron-job.org / EasyCron)

Se você não tiver acesso direto ao crontab do servidor:

1. Acesse [cron-job.org](https://cron-job.org).
2. Crie um novo Cronjob.
3. Configure o endereço URL:
   ```
   https://seusite.com.br/api/cron/sync-dialradio?secret=sua_chave_secreta_aqui
   ```
4. Defina o intervalo desejado (ex: a cada 15 ou 30 minutos).

---

### Opção 4: Docker Compose

Se estiver rodando em container, você pode adicionar um serviço leve de cron no `docker-compose.yml` ou agendar o disparo via `docker exec`:

```bash
*/30 * * * * docker exec -t portal-lineup-payload-1 npm run sync:dialradio >> /tmp/cron-sync.log 2>&1
```

---

## 6. Resiliência e Tratamento de Erros

1. **Anti-Duplicação**:
   - Cada notícia tem seu slug comparado antes de qualquer download. Se já existir no Payload, é ignorada em ~300ms.
2. **Timeouts com AbortSignal**:
   - Todas as requisições HTTP externas possuem timeout de 15 segundos (`AbortSignal.timeout(15000)`), garantindo que a rotina nunca trave caso o site de origem esteja lento ou instável.
3. **Isolamento de Imagem**:
   - Se o download ou upload da imagem de capa para o Cloudflare R2 falhar por qualquer motivo de rede, o post continua sendo criado normalmente com o texto completo.
4. **Formatação de Conteúdo**:
   - Textos formatados em negrito (`<strong>`), itálico (`<em>`), hiperlinks (`<a>`) e cabeçalhos (`<h2>`, `<h3>`) são convertidos para o formato estruturado do Lexical, garantindo compatibilidade com o layout do frontend.
