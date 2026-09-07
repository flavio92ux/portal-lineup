# 📖 Manual Definitivo de Manutenção — Portal Lineup

> **Para quem este manual foi feito?**  
> Para você, criador e mantenedor do projeto! Se este projeto foi gerado ou evoluído via "VibeCoding" (prompts e geração por IA) e agora você precisa **dar manutenção, corrigir bugs e adicionar funcionalidades com as próprias mãos**, este manual é o seu mapa de bordo completo.

---

## 📑 Sumário

1. [O Modelo Mental do Projeto (Sem Complicação)](#1-o-modelo-mental-do-projeto)
2. [O Mapa do Tesouro (Onde Fica Cada Coisa?)](#2-o-mapa-do-tesouro)
3. [Variáveis de Ambiente (`.env`) Descomplicadas](#3-variáveis-de-ambiente-env)
4. [Os Comandos do Dia a Dia](#4-os-comandos-do-dia-a-dia)
5. [A Regra de Ouro do Banco de Dados: `push: false`](#5-a-regra-de-ouro-do-banco-de-dados-push-false)
6. [Como Funcionam as Coleções do CMS](#6-como-funcionam-as-coleções-do-cms)
7. [Receitas Passo a Passo (Guias Práticos)](#7-receitas-passo-a-passo)
   - [Receita 1: Adicionar um novo campo em Posts e exibir no site](#receita-1-adicionar-um-novo-campo-em-posts-e-exibir-no-site)
   - [Receita 2: Criar uma nova Coleção do zero](#receita-2-criar-uma-nova-coleção-do-zero)
   - [Receita 3: Como alterar textos, menus e rodapé (Header & Footer)](#receita-3-como-alterar-textos-menus-e-rodapé-header--footer)
   - [Receita 4: Como funciona o Upload de Imagens (Cloudflare R2)](#receita-4-como-funciona-o-upload-de-imagens-cloudflare-r2)
   - [Receita 5: Como funcionam os Comentários (Supabase)](#receita-5-como-funcionam-os-comentários-supabase)
   - [Receita 6: Como funcionam as Páginas e Rotas do Frontend](#receita-6-como-funcionam-as-páginas-e-rotas-do-frontend)
   - [Receita 7: Estilização e Cores com Tailwind CSS v4](#receita-7-estilização-e-cores-com-tailwind-css-v4)
8. [Cache e Revalidação (Por que alterei no admin e não mudou no site?)](#8-cache-e-revalidação)
9. [Guia de Sobrevivência (Resolução dos Erros Mais Comuns)](#9-guia-de-sobrevivência-troubleshooting)
10. [Checklist de Segurança Antes do Deploy](#10-checklist-de-segurança-antes-do-deploy)

---

## 1. O Modelo Mental do Projeto

A primeira coisa que assusta quem vê este projeto é a quantidade de arquivos. Mas a estrutura lógica é muito simples:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SEU PROJETO (Next.js 15)                        │
│                        Porta padrão: 3000                              │
│                                                                        │
│   ┌──────────────────────────────┐   ┌─────────────────────────────┐   │
│   │   FRONTEND PÚBLICO           │   │   PAINEL ADMINISTRATIVO     │   │
│   │   Pasta: src/app/(frontend)  │   │   Pasta: src/app/(payload)  │   │
│   │   Acesso: localhost:3000/    │   │   Acesso: localhost:3000/admin│ │
│   │   Tecnologia: React 19 /     │   │   Tecnologia: Payload CMS   │   │
│   │   Server Components          │   │   3.77                      │   │
│   └──────────────┬───────────────┘   └──────────────┬──────────────┘   │
│                  │                                  │                  │
│                  └────────────────┬─────────────────┘                  │
│                                   │                                    │
│                         Local API do Payload                           │
│                      (getPayload({ config }))                          │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼───────────────────────────┐
       ▼                            ▼                           ▼
┌──────────────┐             ┌──────────────┐            ┌──────────────┐
│  PostgreSQL  │             │Cloudflare R2 │            │   Supabase   │
│ (Tabelas do  │             │ (Imagens e   │            │(Comentários  │
│     CMS)     │             │   Arquivos)  │            │  dos Posts)  │
└──────────────┘             └──────────────┘            └──────────────┘
```

### Três verdades fundamentais que você precisa saber:
1. **Você NÃO tem dois servidores rodando:** Não existe um backend Node em uma porta e o Next.js em outra. O Payload CMS 3.x roda **dentro** do próprio Next.js. Ao rodar `pnpm dev`, tudo sobe junto na porta `3000`.
2. **O Frontend lê direto do Payload:** O frontend (`src/app/(frontend)`) não faz requisições HTTP REST lentas para pegar os posts. Ele usa a **Local API** do Payload (`getPayload()`), que consulta diretamente o banco de dados com performance máxima.
3. **Existem 3 serviços externos conectados:**
   - **PostgreSQL**: Onde ficam guardados os textos das notícias, categorias, páginas e usuários.
   - **Cloudflare R2**: Onde ficam salvas as imagens enviadas pelo painel admin (funciona como um S3 da AWS).
   - **Supabase**: Usado exclusivamente para armazenar e consultar a árvore de comentários dos leitores.

---

## 2. O Mapa do Tesouro

Quando você quiser alterar algo no site, use este guia para saber exatamente qual arquivo abrir sem se perder:

| O que você quer fazer? | Onde ir? | Arquivo Principal |
| :--- | :--- | :--- |
| **Mudar a Home Page** | `src/app/(frontend)/` | `page.tsx` |
| **Mudar a Listagem de Notícias na Home** | `src/components/PostsListing/` | `index.tsx` |
| **Mudar o Visual de uma Notícia individual** | `src/app/(frontend)/noticias/[slug]/` | `page.tsx` |
| **Mudar o Topo da Notícia (Capa, Título, Autor)** | `src/heros/PostHero/` | `index.tsx` |
| **Mudar o Visual de uma Coluna** | `src/app/(frontend)/colunas/[slug]/` | `page.tsx` |
| **Mudar o Visual de um Review** | `src/app/(frontend)/reviews/[slug]/` | `page.tsx` |
| **Mudar a Página de Busca** | `src/app/(frontend)/search/` | `page.tsx` |
| **Mudar a Página de Perfil do Autor** | `src/app/(frontend)/autor/[slug]/` | `page.tsx` |
| **Mudar o Menu Superior (Header)** | `src/Header/` | `Component.client.tsx` e `config.ts` |
| **Mudar o Rodapé (Footer)** | `src/Footer/` | `Component.tsx` e `config.ts` |
| **Adicionar/Mudar Campos de Notícias no Admin** | `src/collections/Posts/` | `index.ts` |
| **Adicionar/Mudar Campos de Reviews no Admin** | `src/collections/Reviews/` | `index.ts` |
| **Adicionar/Mudar Categorias no Admin** | `src/collections/` | `Categories.ts` |
| **Adicionar/Mudar Usuários ou Autores** | `src/collections/Users/` | `index.ts` |
| **Mudar Cores, Fontes ou CSS Global** | `src/app/(frontend)/` | `globals.css` |
| **Mudar o Sistema de Comentários** | `src/components/Comments/` | `index.tsx` e `src/app/api/comments/route.ts` |
| **Mudar Configurações Gerais do Payload** | `src/` | `payload.config.ts` |

---

## 3. Variáveis de Ambiente (`.env`)

O arquivo `.env` fica na raiz do projeto. Ele guarda as chaves secretas. **Nunca suba o `.env` para o GitHub!**

Aqui está o que cada variável faz:

```ini
# 1. BANCO DE DADOS PRINCIPAL (PostgreSQL)
# String de conexão com o PostgreSQL (Vercel Postgres, Neon, Supabase ou local)
POSTGRES_URL=postgresql://usuario:senha@host:5432/nome_do_banco

# 2. SEGURANÇA DO PAYLOAD CMS
# Chave secreta aleatória usada para assinar cookies e senhas de login do admin
PAYLOAD_SECRET=uma_chave_secreta_longa_e_aleatoria

# 3. URL DO SITE
# Em desenvolvimento: http://localhost:3000
# Em produção: https://portal-lineup.site (ou seu domínio)
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# 4. STORAGE CLOUDFLARE R2 (Para imagens)
# Endpoint S3 do Cloudflare R2
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=sua_access_key
R2_SECRET_ACCESS_KEY=sua_secret_key
R2_BUCKET_NAME=nome_do_bucket
# URL pública do bucket ou subdomínio configurado (ex: https://cdn.seusite.com ou https://pub-xxx.r2.dev)
R2_PUBLIC_URL=https://cdn.portal-lineup.site

# 5. COMENTÁRIOS (Supabase)
# Usados pelo componente de comentários no frontend
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_supabase

# 6. CACHE E WEBHOOKS
# Chave usada para permitir que o Payload limpe o cache do Next.js via API
REVALIDATE_SECRET=sua_chave_secreta_de_revalidacao
# Chave usada para tarefas agendadas (Cron)
CRON_SECRET=sua_chave_cron_secreta
```

---

## 4. Os Comandos do Dia a Dia

No terminal, sempre use `pnpm` (evite misturar `npm` com `pnpm` para não corromper o lockfile):

### 1. Iniciar o projeto localmente
```bash
pnpm dev
```
- Acesse o site em: `http://localhost:3000`
- Acesse o painel admin em: `http://localhost:3000/admin`

### 2. O comando mais importante: Atualizar Tipos do TypeScript
```bash
pnpm generate:types
```
> [!IMPORTANT]
> **SEMPRE** que você adicionar, renomear ou remover um campo em `src/collections/...` ou `src/blocks/...`, execute este comando.
> Ele atualiza o arquivo `src/payload-types.ts`. Sem isso, o VSCode vai acusar erros vermelhos dizendo que seu novo campo "não existe".

### 3. Atualizar o Mapa de Componentes do Admin
```bash
pnpm generate:importmap
```
> [!NOTE]
> Execute se você criar ou alterar componentes personalizados que aparecem dentro do painel `/admin` (por exemplo, em `admin.components`).

### 4. Testar a Build de Produção
```bash
pnpm build
```
> [!TIP]
> Antes de fazer um `git push`, rode este comando. Ele compila o projeto exatamente como a Vercel fará. Se houver qualquer erro de TypeScript ou importação quebrada, você descobrirá aqui antes de derrubar o site em produção.

---

## 5. A Regra de Ouro do Banco de Dados: `push: false`

Esta é a maior armadilha para quem vem do "VibeCoding":

No arquivo [src/payload.config.ts](file:///home/flavio/Projetos/portal-lineup/src/payload.config.ts), o banco está configurado assim:

```typescript
db: vercelPostgresAdapter({
  pool: {
    connectionString: process.env.POSTGRES_URL || '',
  },
  push: false, // ⚠️ ATENÇÃO MÁXIMA AQUI!
}),
```

### O que significa `push: false`?
- **Com `push: true`**: Quando você adiciona um campo no código, o Payload tenta alterar a tabela do banco automaticamente ao iniciar.
- **Com `push: false` (o seu projeto)**: O Payload **NÃO mexe na estrutura do banco** automaticamente!
- **O que acontece se você só adicionar o campo no TypeScript?** O painel admin tenta salvar o documento, o banco de dados não tem aquela coluna e dispara o erro:  
  `error: column "nome_do_campo" of relation "posts" does not exist`.

### Como adicionar um novo campo no banco de dados com segurança:
Sempre que você criar um campo novo em uma coleção existente:
1. Abra seu gerenciador de banco (DBeaver, Supabase SQL Editor, Neon Console, pgAdmin ou `psql`).
2. Conecte no mesmo banco do `POSTGRES_URL`.
3. Execute o comando SQL para criar a coluna:
   ```sql
   -- Exemplo: Adicionando uma coluna de texto simples na tabela posts
   ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "fonte" varchar;

   -- E se a tabela tiver versionamento (rascunhos), adicione também na tabela de versões:
   ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_fonte" varchar;
   ```
4. Veja os exemplos prontos na pasta `scripts/` do projeto (`scripts/add-keywords-to-posts.sql`, `scripts/001-create-reviews-tables.sql`).

---

## 6. Como Funcionam as Coleções do CMS

No Payload, tudo o que tem dados é uma **Collection**. As coleções ficam em `src/collections/`:

### 1. `Posts` (`src/collections/Posts/index.ts`)
É a coleção principal de conteúdo. Ela possui um campo chamado `type`:
- Se `type === 'news'`: É uma **Notícia**. O site a exibe na rota `/noticias/[slug]`.
- Se `type === 'column'`: É uma **Coluna**. O site a exibe na rota `/colunas/[slug]`.
- Se você acessar `/posts/[slug]`, o sistema também resolve a página.

**Campos principais:**
- `headline`: O "versal" (chapeuzinho/destaque curto que fica acima do título, ex: *"BASTIDORES"*).
- `title`: O título principal da matéria.
- `subtitle`: O subtítulo ou linha fina.
- `heroImage`: Imagem de capa (relação com a coleção `Media`).
- `content`: O texto da matéria (editor Lexical rico, suporta blocos de código, banners, imagens e embeds do YouTube).
- `authors`: Autores vinculados (relação com `Users`).
- `categories`: Categorias da matéria.

### 2. `Reviews` (`src/collections/Reviews/index.ts`)
Coleção especializada em análises e resenhas de produtos ou serviços.
- Rota no frontend: `/reviews/[slug]`
- Campos específicos: `product` (nome, marca, foto), `rating` (nota de 0 a 10), `pros` (lista de pontos positivos), `cons` (lista de pontos negativos), `offers` (preço, link de afiliado e disponibilidade).

### 3. `Pages` (`src/collections/Pages/index.ts`)
Páginas institucionais ou dinâmicas construídas com blocos visuais (Page Builder).
- Rota no frontend: `/[slug]`
- *Nota*: Atualmente está com `admin: { hidden: true }`. Se você quiser que o menu "Pages" volte a aparecer no painel admin, basta remover a linha `hidden: true` em `src/collections/Pages/index.ts`.

### 4. `Categories` (`src/collections/Categories.ts`)
Categorias para organizar posts e reviews. Suporta hierarquia (categoria mãe e subcategorias).

### 5. `Media` (`src/collections/Media.ts`)
Gerencia todos os uploads de imagens.
- Gera automaticamente vários tamanhos otimizados (thumbnail, square, small, medium, large, og).
- Envia os arquivos diretamente para o seu bucket no **Cloudflare R2**.

### 6. `Users` (`src/collections/Users/index.ts`)
Os usuários do sistema e autores.
- Tem suporte a login e senha.
- Possui foto de avatar, bio e lista de redes sociais (Facebook, Instagram, X/Twitter, YouTube, TikTok, LinkedIn, Website).
- Alimenta a página de autor em `/autor/[slug]`.

### Globals: `Header` e `Footer`
São configurações únicas (não são listas). Ficam em `src/Header/config.ts` e `src/Footer/config.ts`.
- Permitem cadastrar os links que aparecem no menu de navegação e no rodapé sem precisar mexer no código.

---

## 7. Receitas Passo a Passo

### Receita 1: Adicionar um novo campo em Posts e exibir no site

**Cenário:** Você quer adicionar um campo chamado `"fonte"` (ex: "Fonte: Agência Brasil") em todas as notícias.

#### Passo 1: Adicionar o campo na Coleção
Abra `src/collections/Posts/index.ts`. Dentro do array `fields: [...]`, adicione:
```typescript
{
  name: 'fonte',
  type: 'text',
  label: 'Fonte da Informação',
  admin: {
    description: 'Informe o veículo ou fonte original da notícia',
    position: 'sidebar', // Para aparecer na barra lateral direita no admin
  },
},
```

#### Passo 2: Atualizar a tabela no Banco de Dados
Como o projeto está com `push: false`, abra seu cliente PostgreSQL e rode:
```sql
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "fonte" varchar;
ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_fonte" varchar;
```

#### Passo 3: Gerar os tipos do TypeScript
No seu terminal:
```bash
pnpm generate:types
```
Agora o TypeScript reconhece que `post.fonte` é uma `string | null | undefined`.

#### Passo 4: Incluir o campo na busca do Next.js
Abra o arquivo da página da notícia: `src/app/(frontend)/noticias/[slug]/page.tsx`.  
Na função `queryNewsBySlug`, verifique se o campo `fonte` está no `select` (ou se ela busca o documento completo). Se houver um `select`, inclua:
```typescript
select: {
  // ...outros campos...
  fonte: true,
}
```

#### Passo 5: Exibir no Componente Visual
Abra o componente onde você quer que o texto apareça (por exemplo, `src/heros/PostHero/index.tsx`):
```tsx
{post.fonte && (
  <p className="text-sm text-gray-500 italic mt-2">
    Fonte: {post.fonte}
  </p>
)}
```
Pronto! Você adicionou um campo do banco até a tela sem depender de IA.

---

### Receita 2: Criar uma nova Coleção do zero

**Cenário:** Você quer criar uma coleção de **Podcasts** para o portal.

1. **Crie o arquivo de configuração da coleção:**  
   Crie `src/collections/Podcasts.ts`:
   ```typescript
   import type { CollectionConfig } from 'payload'
   import { authenticated } from '../access/authenticated'
   import { authenticatedOrPublished } from '../access/authenticatedOrPublished'

   export const Podcasts: CollectionConfig = {
     slug: 'podcasts',
     admin: {
       useAsTitle: 'title',
       defaultColumns: ['title', 'episodeNumber', 'publishedAt'],
     },
     access: {
       create: authenticated,
       read: authenticatedOrPublished,
       update: authenticated,
       delete: authenticated,
     },
     fields: [
       { name: 'title', type: 'text', required: true, label: 'Título do Episódio' },
       { name: 'episodeNumber', type: 'number', label: 'Número do Episódio' },
       { name: 'audioUrl', type: 'text', required: true, label: 'URL do Áudio (MP3 / Spotify)' },
       { name: 'publishedAt', type: 'date', label: 'Data de Publicação' },
     ],
     timestamps: true,
   }
   ```

2. **Registrar a coleção no Payload:**  
   Abra `src/payload.config.ts`:
   ```typescript
   import { Podcasts } from './collections/Podcasts'

   // No array collections:
   collections: [Posts, Reviews, Pages, Media, Categories, Users, Podcasts],
   ```

3. **Criar a tabela no PostgreSQL:**  
   Execute no seu banco SQL:
   ```sql
   CREATE TABLE IF NOT EXISTS "podcasts" (
     "id" serial PRIMARY KEY NOT NULL,
     "title" varchar NOT NULL,
     "episode_number" numeric,
     "audio_url" varchar NOT NULL,
     "published_at" timestamp(3) with time zone,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
   ```

4. **Gerar os tipos:**
   ```bash
   pnpm generate:types
   ```

Ao rodar `pnpm dev`, "Podcasts" já aparecerá no menu lateral do `/admin` pronto para cadastrar episódios!

---

### Receita 3: Como alterar textos, menus e rodapé (Header & Footer)

Você não precisa alterar código para mudar os links do menu ou do rodapé:
1. Acesse `http://localhost:3000/admin`.
2. No menu lateral, procure a seção **Globals**.
3. Clique em **Header** para adicionar, remover ou reordenar os links do menu superior.
4. Clique em **Footer** para gerenciar os links do rodapé.
5. Ao salvar, os hooks `revalidateHeader` e `revalidateFooter` limpam o cache automaticamente e o site atualiza na hora.

---

### Receita 4: Como funciona o Upload de Imagens (Cloudflare R2)

O armazenamento de fotos está configurado em `src/plugins/index.ts` usando o plugin `s3Storage`.
- Quando você sobe uma imagem no painel:
  1. A biblioteca **Sharp** corta e comprime a imagem em diversos formatos (`thumbnail`, `square`, `small`, `medium`, `large`, `og`).
  2. O Payload envia os arquivos para o Cloudflare R2 com o prefixo `media/`.
  3. A URL gerada fica no formato: `${process.env.R2_PUBLIC_URL}/media/${filename}`.
- **Dica de ouro:** Se alguma imagem der erro de carregamento no Next.js (ex: *"hostname is not configured under images in next.config.js"*), abra o arquivo `next.config.js` e garanta que o domínio do seu CDN está listado em `images.remotePatterns`.

---

### Receita 5: Como funcionam os Comentários (Supabase)

Os comentários dos leitores não ficam no banco principal do Payload, mas sim no **Supabase**:
- **Front-end**: O componente `src/components/Comments/index.tsx` é inserido nas páginas de notícias e colunas.
- **Formulário de envio**: Ao enviar um comentário, ele faz uma requisição para a rota `POST /api/comments` (`src/app/api/comments/route.ts`).
- **Banco**: A rota usa o cliente Supabase (`src/lib/supabase/server.ts`) para salvar na tabela `comments`.
- **Árvore de respostas**: O backend organiza os comentários em níveis (comentários pai e respostas filhas).
- **A tabela SQL de comentários**: A estrutura da tabela está salva em `scripts/001_create_comments_table.sql`. Se você estiver configurando um Supabase novo, basta rodar aquele arquivo no SQL Editor do Supabase!

---

### Receita 6: Como funcionam as Páginas e Rotas do Frontend

O projeto utiliza o **App Router** do Next.js (`src/app/(frontend)/`):

- **`/`**: Carrega `src/app/(frontend)/page.tsx`. Busca os 3 posts destaque (`heroPosts`), 15 posts recentes (`latestPosts`) e 10 reviews (`latestReviews`).
- **`/noticias/[slug]`**: Carrega `src/app/(frontend)/noticias/[slug]/page.tsx`. Exibe a notícia completa com suporte a Live Preview do admin e comentários.
- **`/colunas/[slug]`**: Carrega `src/app/(frontend)/colunas/[slug]/page.tsx`. Exibe a coluna de opinião com destaque para o autor.
- **`/reviews/[slug]`**: Carrega `src/app/(frontend)/reviews/[slug]/page.tsx`. Exibe a análise de produto com prós/contras e notas.
- **`/autor/[slug]`**: Carrega `src/app/(frontend)/autor/[slug]/page.tsx`. Exibe a bio do autor, avatar, redes sociais e todas as matérias escritas por ele.
- **`/search`**: Carrega `src/app/(frontend)/search/page.tsx`. Faz a busca de posts integrada com o plugin de busca do Payload.
- **`/[slug]`**: Rota coringa que carrega páginas estáticas cadastradas na coleção `Pages`.

---

### Receita 7: Estilização e Cores com Tailwind CSS v4

O projeto usa a versão mais recente do Tailwind (v4):
- O arquivo principal de estilos é `src/app/(frontend)/globals.css`.
- Não existe um `tailwind.config.js` tradicional longo; as customizações principais são feitas via diretivas `@theme` e variáveis CSS no `globals.css`:
  - `--font-sans`: Fonte padrão do site (Open Sans).
  - `--font-mono`: Fonte monoespaçada (Geist Mono).
- **Modo Escuro (Dark Mode)**:
  - O projeto utiliza a classe/atributo `[data-theme='dark']`.
  - Para estilizar algo que só muda no modo escuro, use a classe `dark:` do Tailwind (ex: `bg-white dark:bg-zinc-900 text-black dark:text-white`).

---

## 8. Cache e Revalidação

### "Eu editei uma matéria no admin, salvei, mas no site ainda aparece a versão antiga. Por quê?"

O Next.js usa **ISR (Incremental Static Regeneration)** para que o site seja ultrarrápido. As páginas ficam em cache no servidor.

Para o site atualizar quando você publica algo:
1. **O que o projeto já faz automaticamente:**
   - Na coleção `Posts`, existe o hook `revalidatePost` (`src/collections/Posts/hooks/revalidatePost.ts`).
   - Toda vez que você clica em **Publicar** ou **Salvar**, ele chama:
     ```typescript
     revalidatePath('/noticias/' + slug)
     revalidatePath('/')
     revalidatePath('/noticias')
     revalidatePath('/colunas')
     ```
   - Isso limpa o cache dessas páginas no Next.js imediatamente.

2. **Como forçar a limpeza manual do cache (via API):**
   Se por qualquer motivo uma página ficou presa em cache, você pode disparar uma requisição POST:
   ```bash
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{
       "secret": "SEU_REVALIDATE_SECRET",
       "paths": ["/", "/noticias"],
       "type": "path"
     }'
   ```
   *(Mais detalhes disponíveis no arquivo `REVALIDATION.md` na raiz do projeto).*

---

## 9. Guia de Sobrevivência (Troubleshooting)

### Problema 1: O VSCode está acusando erro vermelho em propriedades como `post.titulo` ou `post.novoCampo`.
- **Causa:** O arquivo `src/payload-types.ts` está desatualizado em relação aos campos do CMS.
- **Solução:** Rode no terminal:
  ```bash
  pnpm generate:types
  ```

---

### Problema 2: Erro no console: `error: column "..." does not exist`.
- **Causa:** Você adicionou um novo campo em uma coleção, mas como o banco está com `push: false`, a coluna não foi criada na tabela do PostgreSQL.
- **Solução:** Conecte no seu PostgreSQL e rode o comando SQL correspondente:
  ```sql
  ALTER TABLE "nome_da_tabela" ADD COLUMN IF NOT EXISTS "nome_da_coluna" varchar;
  ```

---

### Problema 3: Erro no painel admin: `Component ... was not found in the importMap`.
- **Causa:** Um componente customizado do painel admin foi movido ou adicionado sem regenerar o mapa de imports.
- **Solução:** Rode no terminal:
  ```bash
  pnpm generate:importmap
  ```

---

### Problema 4: `Error: listen EADDRINUSE: address already in use :::3000`.
- **Causa:** Uma instância antiga do Next.js ficou travada rodando em segundo plano na porta 3000.
- **Solução (no Linux/Mac):**
  ```bash
  kill -9 $(lsof -t -i:3000)
  pnpm dev
  ```

---

### Problema 5: Imagens quebradas ou erro `Invalid src prop on next/image`.
- **Causa:** O domínio da imagem que está no R2 não está autorizado no `next.config.js`.
- **Solução:** Abra `next.config.js` e adicione o hostname do seu CDN na lista `images.remotePatterns`.

---

### Problema 6: Esqueci a senha do usuário Admin ou preciso criar o primeiro usuário.
- **Solução:**
  1. Se for em um banco novo, ao acessar `http://localhost:3000/admin` pela primeira vez, o Payload exibe automaticamente a tela de **Criação do Primeiro Administrador**.
  2. Se o banco já possui dados mas você não lembra a senha, você pode resetar o hash da senha direto na tabela `users` do PostgreSQL ou criar um script simples usando a Local API do Payload:
     ```typescript
     await payload.update({
       collection: 'users',
       where: { email: { equals: 'seu-email@dominio.com' } },
       data: { password: 'NovaSenhaSegura123' },
     })
     ```

---

## 10. Checklist de Segurança Antes do Deploy

Antes de rodar `git push origin main` ou enviar alterações para a produção:

- [ ] **1. Rodar `pnpm generate:types`** (garantir que nenhum tipo ficou para trás).
- [ ] **2. Rodar `pnpm build` localmente** (se passar localmente, a Vercel não vai quebrar).
- [ ] **3. Rodar os scripts SQL no banco de produção** (se você adicionou qualquer campo ou tabela nova, lembre-se do `push: false`).
- [ ] **4. Conferir variáveis de ambiente na Vercel** (garantir que todas as variáveis do `.env` estão configuradas nas configurações do projeto na Vercel).
- [ ] **5. Testar o site em modo anônimo** (garantir que páginas estáticas, busca e comentários funcionam para visitantes não logados).

---

💡 *Dica final:* Mantenha este manual sempre aberto ao programar. Sempre que tiver uma dúvida de onde fica algo, consulte o [Mapa do Tesouro](#2-o-mapa-do-tesouro) ou a seção de [Receitas](#7-receitas-passo-a-passo). Bom código!
