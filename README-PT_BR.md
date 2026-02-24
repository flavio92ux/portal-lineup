# Portal de Rádio - CMS (Payload CMS)

Documentação completa do sistema de gerenciamento de conteúdo para o Portal de Rádio. Este projeto é construído sobre o **Payload CMS 3.77.0** com **Next.js 15**, oferecendo uma solução enterprise-grade para gerenciar websites, blogs e plataformas de conteúdo.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Projeto](#arquitetura-do-projeto)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Configuração Inicial](#configuração-inicial)
6. [Collections (Coleções de Dados)](#collections--coleções-de-dados)
7. [Globals (Dados Globais)](#globals--dados-globais)
8. [Blocos de Conteúdo](#blocos-de-conteúdo)
9. [Sistema de Acesso (Access Control)](#sistema-de-acesso-access-control)
10. [Hooks (Ciclo de Vida)](#hooks--ciclo-de-vida)
11. [Plugins](#plugins)
12. [Componentes Customizados](#componentes-customizados)
13. [Frontend (Apresentação)](#frontend--apresentação)
14. [Funcionalidades Avançadas](#funcionalidades-avançadas)
15. [Scripts e Comandos](#scripts-e-comandos)
16. [Deployment](#deployment)

---

## 🎯 Visão Geral

Este é um **CMS Headless** baseado em Payload que funciona como backend de gerenciamento de conteúdo integrado com um frontend Next.js. O projeto permite:

- Criar, editar e publicar conteúdo (páginas e posts)
- Gerenciar usuários e permissões
- Construir páginas complexas com um **page builder visual**
- Live preview do conteúdo antes de publicar
- SEO otimizado automaticamente
- Busca full-text sincronizada
- Upload e otimização de mídia
- Relacionamentos entre conteúdos
- Publicação agendada
- Redirecionamentos automáticos

---

## 🏗️ Arquitetura do Projeto

### Camadas da Aplicação

```
┌─────────────────────────────────────────┐
│   Frontend Next.js (Cliente)             │
│   - SSR, SSG, ISR                       │
│   - Componentes React                   │
│   - Layout builder preview              │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Next.js API Routes                     │
│   - Endpoints customizados              │
│   - Seed de dados                       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Payload CMS (Admin)                    │
│   - Painel administrativo               │
│   - Local API                           │
│   - GraphQL/REST                        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Banco de Dados (Vercel Postgres)       │
│   - Collections (tabelas)               │
│   - Globals                             │
└─────────────────────────────────────────┘
```

### Fluxo de Dados

```
Usuário edita conteúdo
        ↓
Admin Payload valida
        ↓
Hooks executam (populatePublishedAt, revalidação)
        ↓
Dados salvos no Postgres
        ↓
ISR revalida next.js
        ↓
Frontend atualizado
```

---

## 💻 Stack Tecnológico

### Core
- **Payload CMS 3.77.0** - Headless CMS
- **Next.js 15** - Framework React
- **React 19** - UI library
- **TypeScript** - Type safety

### Banco de Dados & Storage
- **Vercel Postgres** - Banco de dados relacional
- **Sharp** - Otimização de imagens
- **Payload Database Adapter** - ORM abstrato

### Plugins Oficiais
- `@payloadcms/plugin-seo` - SEO meta fields
- `@payloadcms/plugin-search` - Full-text search
- `@payloadcms/plugin-redirects` - Gerenciamento de redirecionamentos
- `@payloadcms/plugin-form-builder` - Page builder para formulários
- `@payloadcms/plugin-nested-docs` - Estrutura hierárquica
- `@payloadcms/richtext-lexical` - Rich text editor
- `@payloadcms/admin-bar` - Bar no frontend
- `@payloadcms/live-preview-react` - Preview ao vivo

### UI & Styling
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Ícones
- **Radix UI** - Componentes acessíveis
- **Geist Design** - Design system

### Testing & Code Quality
- **Playwright** - E2E testing
- **Vitest** - Unit testing
- **ESLint** - Linting
- **TypeScript ESC** - Type checking

### DevOps & Build
- **Vercel** - Deployment
- **Docker** - Containerização
- **pnpm** - Package manager

---

## 📁 Estrutura de Pastas

```
/
├── src/
│   ├── app/
│   │   ├── (frontend)/              # Frontend público
│   │   │   ├── layout.tsx           # Layout principal
│   │   │   ├── page.tsx             # Home
│   │   │   ├── [slug]/              # Páginas dinâmicas
│   │   │   ├── posts/               # Arquivo de posts
│   │   │   ├── search/              # Página de busca
│   │   │   └── next/                # Next.js docs estáticas
│   │   ├── (payload)/               # Admin & API
│   │   │   ├── admin/               # Painel administrativo
│   │   │   ├── api/                 # API routes
│   │   │   └── layout.tsx           # Layout isolado
│   │
│   ├── collections/                 # Definições de coleções
│   │   ├── Categories.ts            # Categorias de posts
│   │   ├── Media.ts                 # Upload de arquivos
│   │   ├── Pages/                   # Páginas editáveis
│   │   ├── Posts/                   # Posts/Blog
│   │   └── Users/                   # Usuários & Auth
│   │
│   ├── blocks/                      # Blocos do page builder
│   │   ├── ArchiveBlock/
│   │   ├── Banner/
│   │   ├── CallToAction/
│   │   ├── Code/
│   │   ├── Content/
│   │   ├── Form/
│   │   ├── MediaBlock/
│   │   ├── RelatedPosts/
│   │   └── RenderBlocks.tsx         # Renderizador universal
│   │
│   ├── components/                  # Componentes React
│   │   ├── BeforeDashboard/         # Widget dashboard admin
│   │   ├── BeforeLogin/             # Widget pre-login
│   │   ├── AdminBar/                # Barra admin no frontend
│   │   ├── CollectionArchive/       # Listagem de posts
│   │   ├── Pagination/              # Paginação
│   │   ├── RichText/                # Renderizador rich text
│   │   ├── Media/                   # Componente imagem
│   │   └── ui/                      # Componentes base (botões, cards)
│   │
│   ├── heros/                       # Diferentes estilos de hero
│   │   ├── HighImpact/
│   │   ├── MediumImpact/
│   │   ├── LowImpact/
│   │   ├── PostHero/
│   │   └── config.ts                # Configuração
│   │
│   ├── fields/                      # Definições de campos reutilizáveis
│   │   ├── defaultLexical.ts        # Editor rich text padrão
│   │   ├── link.ts                  # Campo link interno/externo
│   │   └── linkGroup.ts             # Grupo de links
│   │
│   ├── hooks/                       # Lifecycle hooks
│   │   ├── populatePublishedAt.ts   # Preenche data de publicação
│   │   └── revalidateRedirects.ts   # Revalida redirecionamentos
│   │
│   ├── access/                      # Funções de controle de acesso
│   │   ├── anyone.ts                # Acesso público
│   │   ├── authenticated.ts         # Apenas autenticados
│   │   └── authenticatedOrPublished.ts # Auth ou conteúdo publicado
│   │
│   ├── plugins/                     # Configuração de plugins
│   │   └── index.ts                 # Exports de plugins
│   │
│   ├── search/                      # Integração busca
│   │   ├── beforeSync.ts            # Preparação dados busca
│   │   ├── fieldOverrides.ts        # Customização fields
│   │   └── Component.tsx            # UI busca
│   │
│   ├── utilities/                   # Funções utilitárias
│   │   ├── getURL.ts                # URL base da aplicação
│   │   ├── getPayload.ts            # Instância Payload
│   │   ├── getRedirects.ts          # Carrega redirecionamentos
│   │   ├── generatePreviewPath.ts   # Gera URL preview
│   │   ├── formatAuthors.ts         # Formata nomes autores
│   │   ├── mergeOpenGraph.ts        # Merge tags OG
│   │   └── ...
│   │
│   ├── Footer/                      # Global Footer
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   └── hooks/
│   │
│   ├── Header/                      # Global Header
│   │   ├── Component.tsx
│   │   ├── Component.client.tsx
│   │   ├── config.ts
│   │   ├── Nav/
│   │   └── hooks/
│   │
│   ├── payload.config.ts            # ⭐ Configuração principal
│   └── payload-types.ts             # ⭐ Tipos gerados automaticamente
│
├── tests/
│   ├── e2e/                         # Testes end-to-end
│   │   ├── admin.e2e.spec.ts
│   │   └── frontend.e2e.spec.ts
│   ├── int/                         # Testes de integração
│   │   └── api.int.spec.ts
│   └── helpers/
│
├── public/                          # Arquivos estáticos
│   └── media/
│
├── Dockerfile                       # Containerização
├── docker-compose.yml               # Services Docker
├── next.config.js                   # Configuração Next.js
├── payload.config.ts                # ⭐ Configuração Payload
├── tsconfig.json                    # TypeScript config
├── tailwind.config.mjs              # Tailwind config
├── tailwind.config.mjs              # PostCSS config
├── eslint.config.mjs                # ESLint ruleset
├── playwright.config.ts             # E2E tests config
├── vitest.config.mts                # Unit tests config
├── vitest.setup.ts
├── components.json                  # shadcn/ui components
├── package.json                     # Dependências
├── pnpm-lock.yaml                   # Lock file pnpm
├── .env.example                     # Variáveis de ambiente
└── README.md                        # Documentação oficial
```

---

## ⚙️ Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env` baseado em `.env.example`:

```bash
# Banco de dados
POSTGRES_URL="postgresql://user:password@localhost:5432/radio_portal"

# Payload
PAYLOAD_SECRET="your-secret-key-min-32-chars-long"

# Autenticação Cron
CRON_SECRET="your-cron-secret"

# URLs
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"

# Search (ElasticSearch/Meilisearch)
SEARCH_ENABLED="true"
SEARCH_URI="http://localhost:7700"
```

### 2. Instalação de Dependências

```bash
pnpm install
```

### 3. Geração de Tipos

Após instalar, gere os tipos TypeScript:

```bash
pnpm generate:types
```

### 4. Inicializar Database

```bash
# Cria schema no Postgres
pnpm payload migrate

# Seed inicial (cria usuário admin)
pnpm seed
```

### 5. Desenvolvimento Local

```bash
pnpm dev
```

Acesse:
- Frontend: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

---

## 📦 Collections (Coleções de Dados)

As collections são as "tabelas" do banco de dados. Cada uma define um tipo de conteúdo.

### 1. **Users** (Usuários & Autenticação)

**Arquivo**: [src/collections/Users/index.ts](src/collections/Users/index.ts)

```typescript
{
  slug: 'users',
  auth: true,  // Habilita autenticação
  fields: [
    { name: 'name', type: 'text' }
  ]
}
```

**Campos**:
- `email` (único, obrigatório)
- `password` (hashed automático)
- `name` (opcional)
- `roles` (para RBAC)

**Acesso**:
- ✅ Autenticados podem ler/escrever/deletar
- ❌ Anônimos: sem acesso

**Hooks Associados**:
- `beforeChange`: Validação de email
- `afterChange`: Auditoria de modificações

**Exemplo de Uso**:
```typescript
// Login
const user = await payload.auth({ 
  collection: 'users',
  data: { email: 'john@example.com', password: '123456' }
})

// Criar novo user
const newUser = await payload.create({
  collection: 'users',
  data: { email: 'jane@example.com', name: 'Jane' },
  overrideAccess: false,
})
```

---

### 2. **Posts** (Blog/Artigos)

**Arquivo**: [src/collections/Posts/index.ts](src/collections/Posts/index.ts)

**Campos Principais**:
- `title` (texto, obrigatório)
- `slug` (URL-friendly, único, auto-gerado)
- `content` (rich text com blocos)
- `excerpt` (resumo)
- `heroImage` (imagem destacada)
- `categories` (relacionamento com Categories)
- `authors` (relacionamento com Users)
- `status` (draft, published)
- `publishedAt` (data de publicação)

**Estrutura Tab-based**:
```
┌─ Content Tab
│  ├─ Title
│  ├─ Slug
│  ├─ Content (Lexical)
│  └─ Categories
└─ Meta Tab
   ├─ Meta Description
   ├─ Meta Image
   └─ Meta Title (SEO)
```

**Acesso**:
- Criação: ✅ Autenticados
- Leitura: ✅ Publicados OU Autenticados
- Edição: ✅ Autenticados
- Deleção: ✅ Autenticados

**Drafts & Versioning**:
```typescript
versions: {
  drafts: { autosave: true },
  maxPerDoc: 100
}
```

**Hooks Associados**:
- `populateAuthors`: Preenche autor automático
- `revalidatePost`: Revalida ISR no Next.js
- `beforeChange`: Formata slug

**Live Preview**:
Editores podem ver atualizações em tempo real no frontend:
```typescript
livePreview: {
  url: ({ data, req }) => 
    `http://localhost:3000/posts/${data.slug}`
}
```

**Exemplo de Uso**:
```typescript
// Buscar posts publicados
const { docs } = await payload.find({
  collection: 'posts',
  where: { status: { equals: 'published' } },
  sort: '-publishedAt'
})

// Criar draft
await payload.create({
  collection: 'posts',
  data: { title: 'Novo Post' },
  draft: true  // Não valida campos obrigatórios
})
```

---

### 3. **Pages** (Páginas Editáveis)

**Arquivo**: [src/collections/Pages/index.ts](src/collections/Pages/index.ts)

**Similares a Posts**, mas mais flexíveis:
- Sem campos como `authors`, `categories`
- Suportam blocos customizados (layout builder)
- Geralmente para páginas estáticas (About, Contact, etc)

**Blocos Suportados**:
- `ArchiveBlock` - Lista de posts
- `CallToAction` - CTA com imagem
- `Content` - Rich text
- `FormBlock` - Formulário customizado
- `MediaBlock` - Galeria de imagens

**Exemplo de Estrutura**:
```json
{
  "title": "About Us",
  "slug": "about",
  "layout": [
    {
      "blockType": "hero",
      "style": "highImpact",
      "title": "About Our Company"
    },
    {
      "blockType": "content",
      "text": "<p>We are...</p>"
    },
    {
      "blockType": "cta",
      "links": [{ "text": "Join us", "url": "..." }]
    }
  ]
}
```

---

### 4. **Media** (Upload de Arquivos)

**Arquivo**: [src/collections/Media.ts](src/collections/Media.ts)

**Funcionalidades**:
- Upload com validação de tipo MIME
- Otimização automática com Sharp
- Gera múltiplas resoluções (responsive)
- Suporta drag-drop no admin

**Campos Observáveis**:
- `filename`
- `url` (gerado)
- `width`, `height` (detectados)
- `filesize`
- `mimeType`

**Acesso**:
- Upload: ✅ Autenticados
- Acesso: ✅ Público

**Armazenamento**:
Por padrão, salva em `/public/media/`

```typescript
// Uso em componentes
import { getMediaUrl } from '@/utilities/getMediaUrl'

const url = getMediaUrl(mediaDoc)
```

---

### 5. **Categories** (Categorização de Posts)

**Arquivo**: [src/collections/Categories.ts](src/collections/Categories.ts)

**Plugin**: Usa `nestedDocsPlugin` para criar hierarquias

**Estrutura**:
```
├─ News
│  ├─ Technology
│  ├─ Sports
└─ Entertainment
   ├─ Music
   └─ Movies
```

**Campos**:
- `title`
- `slug`
- `parent` (relacionamento recursivo)
- `breadcrumbs` (auto-gerado)

**Exemplo de URL Hierárquica**:
```
/news/technology/  → category breadcrumb: News > Technology
```

---

## 🌍 Globals (Dados Globais)

Globals são dados únicos compartilhados em toda a aplicação (não são "collections"). Apenas 1 documento por global.

### **Header** (Navegação)

**Arquivo**: [src/Header/config.ts](src/Header/config.ts)

**Campos**:
- `nav` (array de links de navegação)
- `logo` (imagem/texto)
- `links` (links rápidos, redes sociais)

**Renderização Frontend**:
```tsx
import { getGlobals } from '@/utilities/getGlobals'

const { header } = await getGlobals()
// header.nav.map(link => <NavItem>{link.label}</NavItem>)
```

---

### **Footer** (Rodapé)

**Arquivo**: [src/Footer/config.ts](src/Footer/config.ts)

**Campos**:
- `columns` (colunas de links)
  - `title`
  - `links`
- `copyright` (texto copyright)
- `socialLinks`

**Renderização**:
```tsx
const { footer } = await getGlobals()
// footer.columns.map(col => <FooterColumn>{col.links}</FooterColumn>)
```

---

## 🎨 Blocos de Conteúdo

O sistema de blocos permite que editores construam layouts complexos sem código.

### Arquitetura de Blocos

Cada bloco possui:
1. **config.ts** - Definição de campos no admin
2. **Component.tsx** - Renderização no frontend
3. **types** - TypeScript types

### Blocos Disponíveis

#### **1. Content Block**
```typescript
{
  blockType: 'content',
  content: { /* LexicalJSON */ },
  columns: 1  // 1-2 colunas
}
```

Renderiza rich text.

#### **2. Media Block**
```typescript
{
  blockType: 'media',
  media: { id, url, alt },
  caption?: 'string'
}
```

Imagem responsiva com otimização.

#### **3. Banner Block**
```typescript
{
  blockType: 'banner',
  backgroundColor?: 'blue' | 'white',
  content: /* richtext */,
  cta?: { text, link }
}
```

CTA destacado com imagem.

#### **4. Code Block**
```typescript
{
  blockType: 'code',
  language: 'typescript',
  code: 'const x = 1;'
}
```

Renderiza código com highlight (Prism).

#### **5. Archive Block**
```typescript
{
  blockType: 'archive',
  relationFrom: 'posts',  // Relação a buscar
  populateBy: 'collection' | 'selection',
  limit: 10
}
```

Lista dinâmica de posts.

#### **6. Related Posts**
```typescript
{
  blockType: 'relatedPosts',
  post?: postId,
  relationshipType: 'categories' | 'tags'
}
```

Posts relacionados por categoria.

#### **7. Form Block**
```typescript
{
  blockType: 'form',
  form: formId  // Referência ao formulário
}
```

Incorpora formulário customizado.

### Renderizador Universal

**Arquivo**: [src/blocks/RenderBlocks.tsx](src/blocks/RenderBlocks.tsx)

```typescript
export async function RenderBlocks({ blocks, renderCustomBlocks }) {
  return (
    <>
      {blocks?.map((block, i) => {
        switch(block.blockType) {
          case 'content':
            return <Content block={block} key={i} />
          case 'media':
            return <MediaBlock block={block} key={i} />
          // ... outros blocos
        }
      })}
    </>
  )
}
```

### Adicionar Novo Bloco

1. Criar pasta `src/blocks/MyBlock/`
2. Criar `config.ts` com schema:
```typescript
export const MyBlock: Block = {
  slug: 'myBlock',
  fields: [
    { name: 'title', type: 'text' },
    // ... campos
  ]
}
```

3. Criar `Component.tsx`:
```typescript
export default async function MyBlockComponent({ block }) {
  return (
    <div className="my-block">
      <h2>{block.title}</h2>
    </div>
  )
}
```

4. Registrar em `Pages` e `Posts` collection config:
```typescript
fields: [
  {
    name: 'layout',
    type: 'blocks',
    blocks: [/* ..., MyBlock */]
  }
]
```

---

## 🔐 Sistema de Acesso (Access Control)

Controla quem pode ver/criar/editar/deletar dados.

### Tipos de Acesso

1. **Nível Collection** - Controla CRUD completo
2. **Nível Field** - Controla visibilidade de campos específicos
3. **Row-Level Security** - Dados filtrados por condições

### Funções de Acesso

**Arquivo**: [src/access/](src/access/)

#### **authenticated** (...autenticado)
```typescript
// src/access/authenticated.ts
export const authenticated = ({ req: { user } }) => Boolean(user)
```

Apenas usuários logados.

#### **authenticatedOrPublished** (...publicado)
```typescript
// src/access/authenticatedOrPublished.ts
export const authenticatedOrPublished = ({ req: { user } }) => {
  if (user) return true  // Autenticado vê tudo
  return { _status: { equals: 'published' } }  // Anônimo vê publicado
}
```

Públicos veem apenas conteúdo publicado.

#### **anyone** (...qualquer um)
```typescript
// src/access/anyone.ts
export const anyone = () => true
```

Completamente público.

### Uso em Collections

```typescript
export const Posts = {
  slug: 'posts',
  access: {
    create: authenticated,      // Apenas autenticados criam
    read: authenticatedOrPublished,  // Públicos veem publicado
    update: authenticated,       // Apenas autenticados editam
    delete: authenticated,       // Apenas autenticados deletam
  }
}
```

### Row-Level Security (Filtros)

Retornar objeto com condições Payload Query:

```typescript
export const ownPostsOnly = ({ req: { user } }) => {
  if (!user) return false  // Nega acesso
  if (user.isAdmin) return true  // Admin acessa tudo
  
  return {
    author: { equals: user.id }  // Filtra posts do usuário
  }
}
```

### Field-Level Access

Controlar visibilidade de campos:

```typescript
{
  name: 'internalNotes',
  type: 'textarea',
  access: {
    read: ({ req: { user } }) => user?.isAdmin,
    update: ({ req: { user } }) => user?.isAdmin,
  }
}
```

**Importante**: Field-level access APENAS retorna boolean, sem query constraints.

---

## 🔄 Hooks (Ciclo de Vida)

Hooks executam em eventos do ciclo de vida das coleções.

### Tipos de Hooks

#### **beforeValidate** - Antes da validação
Formata dados, normaliza valores.

```typescript
hooks: {
  beforeValidate: [
    ({ data }) => {
      data.slug = slugify(data.title)
      return data
    }
  ]
}
```

#### **beforeChange** - Antes de salvar
Lógica de negócio pré-salvar.

```typescript
hooks: {
  beforeChange: [
    ({ data, operation, req }) => {
      if (operation === 'create') {
        data.createdBy = req.user.id
      }
      return data
    }
  ]
}
```

#### **afterChange** - Depois de salvar
Side effects pós-salvar (notificações, cache, revalidação).

```typescript
hooks: {
  afterChange: [
    async ({ doc, req, operation }) => {
      if (operation === 'create') {
        await notifySubscribers(doc)
        // ⚠️ IMPORTANTE: Passar req para manter transação
        await req.payload.create({
          collection: 'audit-log',
          data: { action: 'create', docId: doc.id },
          req  // ← Transação unificada
        })
      }
    }
  ]
}
```

#### **afterRead** - Depois de carregar
Campos computados, enriquecimento de dados.

```typescript
hooks: {
  afterRead: [
    async ({ doc, req }) => {
      doc.viewCount = await getViewCount(doc.id)
      doc.relatedPosts = await findRelated(doc.id)
      return doc
    }
  ]
}
```

#### **beforeDelete** - Antes de deletar
Cascata de deletions, backup.

```typescript
hooks: {
  beforeDelete: [
    async ({ id, req }) => {
      // Deleta comentários relacionados
      await req.payload.delete({
        collection: 'comments',
        where: { post: { equals: id } },
        req  // Transação
      })
    }
  ]
}
```

### Hooks Específicos do Projeto

#### **populatePublishedAt**
Arquivo: [src/hooks/populatePublishedAt.ts](src/hooks/populatePublishedAt.ts)

Preenche automaticamente `publishedAt` quando status muda para "published".

```typescript
if (data.status === 'published' && !data.publishedAt) {
  data.publishedAt = new Date()
}
```

#### **revalidatePost/revalidatePage**
Arquivo: [src/collections/Posts/hooks/revalidatePost.ts](src/collections/Posts/hooks/revalidatePost.ts)

Revalida ISR (Incremental Static Regeneration) no Next.js.

```typescript
// Função baseada em fetch `revalidatePath`
await fetch(`${url}/api/revalidate`, {
  method: 'POST',
  body: JSON.stringify({ slug: doc.slug })
})
```

---

## 🔌 Plugins

Plugins estendem funcionalidades do Payload. Registrados em [src/plugins/index.ts](src/plugins/index.ts).

### **1. Plugin SEO**

Adiciona campos de SEO (meta title, description, image).

```typescript
seoPlugin({
  generateTitle: ({ doc }) => `${doc.title} | My Site`,
  generateURL: ({ doc }) => `https://mysite.com/${doc.slug}`
})
```

**Campos Criados**:
- `meta.title`
- `meta.description`
- `meta.image`

**Uso Frontend**:
```typescript
const { meta } = post
export const metadata = {
  title: meta?.title,
  description: meta?.description,
  openGraph: { images: [meta?.image?.url] }
}
```

---

### **2. Plugin Search (Full-text)**

Sincroniza conteúdo com motor de busca (default: Meilisearch).

```typescript
searchPlugin({
  collections: ['posts', 'pages'],
  beforeSync: beforeSyncWithSearch,
  syncDrafts: false
})
```

**Como Funciona**:
1. Quando Doc é salvo → Hook chama `beforeSync`
2. `beforeSync` extrai campos relevantes
3. Envia para Meilisearch
4. Frontend busca via `/api/search?q=...`

**Arquivo beforeSync**: [src/search/beforeSync.ts](src/search/beforeSync.ts)

```typescript
export const beforeSyncWithSearch = ({ doc, operation }) => {
  if (!doc.slug || doc._status !== 'published') return null

  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    content: doc.content?.root?.children?.[0]?.text,
    type: 'post'
  }
}
```

---

### **3. Plugin Redirects**

Gerencia redirecionamentos 301/302.

```typescript
redirectsPlugin({
  collections: ['pages', 'posts'],
  overrides: { hooks: { afterChange: [revalidateRedirects] } }
})
```

**Admin CMS**:
- Criar redirect: `/old-url → /new-url`
- Status: 301 (permanent) ou 302 (temporary)
- Aplicado via middleware Next.js

---

### **4. Plugin Nested Docs**

Cria hierarquias (categorias aninhadas).

```typescript
nestedDocsPlugin({
  collections: ['categories'],
  generateURL: (docs) => docs.reduce((url, doc) => 
    `${url}/${doc.slug}`, ''
  )
})
```

**Resultado**:
- Categoria "Technology" pai de "AI"
- URL gerado: `/categories/technology/ai/`

---

### **5. Plugin Form Builder**

Permite criar formulários sem código.

```typescript
formBuilderPlugin({
  fields: { payment: false }  // Desabilita pagamento
})
```

**Admin CMS**:
- Visual form builder
- Campos: Text, Email, Select, Checkbox
- Salva respostas em collection

---

### **6. Plugin Admin Bar** & **Live Preview**

Exibe bar no frontend para editar conteúdo sem sair do site.

```typescript
// No layout frontend
import { AdminBar } from '@payloadcms/admin-bar/client'

export default function Layout({ children }) {
  return (
    <>
      <AdminBar className="..." />
      {children}
    </>
  )
}
```

---

## 🎨 Componentes Customizados

Payload permite customizar UI via React Components. Localizados em [src/components/](src/components/).

### Tipos de Componentes

#### **1. BeforeLogin**
Exibe mensagem/banner antes do login.

**Arquivo**: [src/components/BeforeLogin/index.tsx](src/components/BeforeLogin/index.tsx)

```tsx
export default function BeforeLogin() {
  return (
    <div>
      <h1>Welcome to Portal Admin</h1>
      <p>Login to manage content</p>
    </div>
  )
}
```

Customizado em `payload.config.ts`:
```typescript
admin: {
  components: {
    beforeLogin: ['@/components/BeforeLogin']
  }
}
```

#### **2. BeforeDashboard**
Widget no dashboard pós-login.

**Arquivo**: [src/components/BeforeDashboard/index.tsx](src/components/BeforeDashboard/index.tsx)

Pode exibir:
- Estatísticas (posts, usuários)
- Shortcuts (criar novo post)
- Notificações

```tsx
export default async function BeforeDashboard() {
  const { docs: posts } = await payload.find({
    collection: 'posts',
    limit: 5,
    sort: '-createdAt'
  })

  return (
    <div className="dashboard-widget">
      <h2>Recent Posts</h2>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </div>
  )
}
```

#### **3. Componentes de UI**
Reutilizáveis em todo projeto.

**Localização**: [src/components/ui/](src/components/ui/)

Inclui:
- `Button.tsx`
- `Card.tsx`
- `Link.tsx`
- `Image.tsx` (com otimização)

**Exemplo - Button**:
```tsx
<Button 
  variant="primary" 
  size="lg"
  onClick={handleClick}
>
  Click Me
</Button>
```

---

## 🌐 Frontend (Apresentação)

O frontend é uma aplicação Next.js pública que consome dados do Payload.

### Estrutura de Rotas

```
/                          →  Home (SSG)
/posts                     →  Blog archive (ISR)
/posts/[slug]              →  Post individual (SSG com fallback)
/search                    →  Search page (ISR)
/[slug]                    →  Page dinâmica (SSG com fallback)
/next                      →  Next.js docs
/api/revalidate            →  ISR revalidation endpoint
/api/search                →  Search API
/admin                     →  Payload admin
```

### Fetch de Dados

#### **Server Components** (recomendado)
```tsx
// app/(frontend)/posts/page.tsx
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'

export default async function PostsPage() {
  const payload = await getPayload()
  
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } }
  })

  if (!posts.length) notFound()
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
```

#### **API Route** (quando necessário client-side)
```typescript
// app/api/posts/route.ts
import { getPayload } from 'payload'

export async function GET() {
  const payload = await getPayload()
  
  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } }
  })
  
  return Response.json(docs)
}
```

### Renderização de Bloco

```tsx
// app/(frontend)/[slug]/page.tsx
import { RenderBlocks } from '@/blocks/RenderBlocks'

export default async function PageSlug({ params }) {
  const page = await getPayload().findByID({
    collection: 'pages',
    id: params.slug
  })

  return (
    <main>
      {/* Renderiza todos os blocos */}
      <RenderBlocks blocks={page.layout} />
    </main>
  )
}
```

### Estratégias de Geração

#### **SSG (Static Site Generation)**
Gera páginas em tempo de build.

```tsx
export async function generateStaticParams() {
  const posts = await getPayload().find({
    collection: 'posts'
  })
  
  return posts.docs.map(post => ({
    slug: post.slug
  }))
}
```

#### **ISR (Incremental Static Regeneration)**
Revalida página after `revalidate` segundos.

```tsx
export const revalidate = 60  // 60 segundos
```

Ou on-demand via endpoint:
```typescript
// api/revalidate route
import { revalidatePath } from 'next/cache'

export async function POST(req) {
  const { slug } = await req.json()
  revalidatePath(`/posts/${slug}`)
  return Response.json({ revalidated: true })
}
```

---

## 🚀 Funcionalidades Avançadas

### **1. Live Preview (Edição ao Vivo)**

Permite editores ver mudanças em tempo real no frontend.

**Como Funciona**:
1. Payload admin abre iframe do frontend
2. Draft data compartilhada via API
3. Frontend renderiza draft em tempo real

**Configuração**:
```typescript
// payload.config.ts
livePreview: {
  breakpoints: [
    { label: 'Mobile', width: 375 },
    { label: 'Tablet', width: 768 },
    { label: 'Desktop', width: 1440 }
  ]
}
```

**No Frontend**:
```typescript
// app/(frontend)/[slug]/page.tsx
'use client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export default function Page() {
  return (
    <>
      <LivePreviewListener />
      {/* Conteúdo renderizado */}
    </>
  )
}
```

---

### **2. Agendamento de Publicação**

Publicar conteúdo em data/hora específica.

**Configuração**:
```typescript
versions: {
  drafts: {
    schedulePublish: true  // Habilita schedule
  }
}
```

**No Admin**:
1. Edite Post em draft
2. Clique "Schedule Publish"
3. Escolha data/hora
4. Sistema publica automaticamente via CRON job

---

### **3. Busca Full-Text**

Implementação de busca com Meilisearch/ElasticSearch.

**Frontend**:
```typescript
// app/(frontend)/search/page.tsx
'use client'

const [query, setQuery] = useState('')
const [results, setResults] = useState([])

const handleSearch = async (q: string) => {
  const res = await fetch(`/api/search?q=${q}`)
  const data = await res.json()
  setResults(data)
}

return (
  <>
    <input 
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Buscar..."
    />
    {results.map(r => (
      <div key={r.id}>{r.title}</div>
    ))}
  </>
)
```

---

### **4. Otimização de Imagem**

Sharp otimiza imagens automaticamente.

**Servidor**:
```typescript
// payload.config.ts
import sharp from 'sharp'

export default buildConfig({
  sharp  // Ativa otimização
})
```

**Frontend**:
```tsx
// components/Media/index.tsx
import Image from 'next/image'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export default function Media({ doc }) {
  return (
    <Image
      src={getMediaUrl(doc)}
      alt={doc.alt}
      width={doc.width}
      height={doc.height}
      sizes="(max-width: 768px) 100vw, 50vw"
      priority={false}
    />
  )
}
```

---

### **5. Redirecionamentos**

Gerencia 301/302 redirects via CMS.

**Admin**:
1. Ir para Redirects collection
2. Criar: `/old-path` → `/new-path`
3. Escolher tipo: 301 (permanente) ou 302 (temporário)

**Implementação**:
```javascript
// next.config.js
async redirects() {
  const redirects = await getRedirects()
  return redirects.map(r => ({
    source: r.from,
    destination: r.to,
    permanent: r.type === '301'
  }))
}
```

---

### **6. Auditoria de Mudanças**

Rastrear quem mudou o quê e quando.

**Implementação**:
```typescript
// Collections hooks
afterChange: [
  async ({ doc, previousDoc, operation, req }) => {
    if (operation === 'update' && previousDoc) {
      // Detectar mudanças
      const changes = Object.keys(doc).filter(
        key => doc[key] !== previousDoc[key]
      )

      await req.payload.create({
        collection: 'audit-logs',
        data: {
          document: doc.id,
          collection: 'posts',
          user: req.user.id,
          operation,
          changes,
          timestamp: new Date()
        },
        req
      })
    }
  }
]
```

---

## 📜 Scripts e Comandos

### Desenvolvimento

```bash
# Dev server com hot reload
pnpm dev

# Build produção
pnpm build

# Iniciar server produção
pnpm start

# Dev com produção (test prod build)
pnpm dev:prod
```

### Geração de Código

```bash
# Gerar tipos TypeScript
pnpm generate:types

# Gerar import map (componentes customizados)
pnpm generate:importmap

# Ambos
pnpm generate:types && pnpm generate:importmap
```

### Qualidade de Código

```bash
# Lint
pnpm lint

# Lint com auto-fix
pnpm lint:fix

# Type check
tsc --noEmit
```

### Testing

```bash
# Todos os testes
pnpm test

# Unit tests
pnpm test:int

# E2E tests
pnpm test:e2e

# E2E com UI
npx playwright test --ui
```

### Banco de Dados

```bash
# Migrations
pnpm payload migrate

# Seed dados iniciais
pnpm seed

# Reset (⚠️ deleta dados)
pnpm payload migrate:reset
```

---

## 🚀 Deployment

### Vercel (Recomendado)

1. **Push para GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Conectar no Vercel**:
   - https://vercel.com/new
   - Selecionar repositório
   - Vercel detecta Next.js automaticamente

3. **Variáveis de Ambiente**:
   ```
   POSTGRES_URL → Vercel Postgres
   PAYLOAD_SECRET → Gerado
   CRON_SECRET → Gerado
   ```

4. **Deploy automático**:
   - Push em main → Deploy automático
   - Preview URLs para PRs

### Docker

```bash
# Build image
docker build -t portal-radio-cms .

# Rodar container
docker run -p 3000:3000 \
  -e POSTGRES_URL="..." \
  -e PAYLOAD_SECRET="..." \
  portal-radio-cms
```

### Docker Compose

```bash
# Iniciar services (Postgres + App)
docker-compose up -d

# Logs
docker-compose logs -f

# Parar
docker-compose down
```

---

## 📚 Referências

- [Payload CMS Docs](https://payloadcms.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [GraphQL](https://graphql.org/learn)

---

## 🎓 Fluxo de Edição de Conteúdo (Passo a Passo)

### Criar um Novo Post

1. **Acessa Admin**:
   - URL: `http://localhost:3000/admin`
   - Login com credenciais

2. **Criar Collection**:
   - Clique em "Posts" na sidebar
   - Clique "Create New"

3. **Preencher Campos**:
   - **Title**: "Meu Novo Artigo"
   - **Slug**: Auto-gerado (`meu-novo-artigo`)
   - **Content**: Rich text com blocos
   - **Hero Image**: Upload imagem

4. **Categorizar**:
   - Selecionar categorias relevantes
   - Adicionar tags

5. **SEO**:
   - Na aba "Meta"
   - Preencher Meta Title, Description, Image
   - Visualizar preview em Google

6. **Preview ao Vivo**:
   - Clique "Live Preview"
   - Ver em mobile/tablet/desktop
   - Editar em tempo real

7. **Publicar**:
   - Escolher Status: "Draft" vs "Published"
   - Publicar agora OR Agendar data
   - Clique "Publish"

8. **Frontend Atualiza**:
   - Hook `revalidatePost` acionado
   - ISR revalida no Next.js
   - Post aparece em `http://localhost:3000/posts/meu-novo-artigo`

---

## 🔍 Troubleshooting

### Erro: "POSTGRES_URL não configurada"
```bash
# Solução: Criar .env
cp .env.example .env
# Editar e adicionar URL do Postgres
```

### Erro: "PayloadRequest is not defined"
```bash
# Garanta que está usando req.payload
// ✅ Correto
await req.payload.find(...)

// ❌ Incorreto
await payload.find(...)
```

### Tipos desatualizados após mudar schema
```bash
# Regenerar tipos
pnpm generate:types
```

### ISR não revalida após salvar
```bash
# Verificar:
1. Hook revalidatePost está configurado
2. Endpoint /api/revalidate existe
3. CRON_SECRET configurado (para scheduled publishes)
```

---

## 💡 Melhores Práticas

✅ **DO's**:
- Use Server Components para fetch de dados
- Passe `req` para nested operations em hooks
- Gere tipos após schema changes
- Use `overrideAccess: false` quando passar `user`
- Implemente row-level security com query constraints
- Cache Heavy computations em `req.context`

❌ **DON'Ts**:
- Não use Local API sem `overrideAccess: false`
- Não ignore hooks de revalidação
- Não confie em client-provided `userId`
- Não esqueça de migrations após schema changes
- Não misture SSR/SSG sem revalidação strategy

---

**Última atualização**: 23/02/2026
**Versão Payload CMS**: 3.77.0
**Versão Next.js**: 15.4.11
