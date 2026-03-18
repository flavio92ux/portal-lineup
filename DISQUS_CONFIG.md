# Configuração do Disqus para Comentários

## O que foi adicionado?

Integrei o **Disqus** em todas as páginas de posts, notícias e colunas do seu portal. Agora os usuários podem deixar comentários e opiniões em cada matéria.

## Como configurar?

### 1. Criar uma conta Disqus (se não tiver)
- Acesse [disqus.com](https://disqus.com)
- Crie uma conta ou faça login

### 2. Criar um site no Disqus
- Vá para [disqus.com/admin/create](https://disqus.com/admin/create/)
- Preencha as informações do site:
  - **Website Name**: (ex: "Portal Lineup")
  - **Website URL**: (ex: "https://seusite.com")
  - **Category**: News (ou similar)
  - **Website Language**: Portuguese (Brazil)
- Clique em "Create Site"

### 3. Obter o Short Name
- Após criar o site, você receberá um **Short Name** (ex: "portal-lineup")
- Você pode encontrá-lo em: **Settings** → **General** → **Shortname**

### 4. Adicionar a variável de ambiente
No painel de settings do v0 ou no seu `.env.local`, adicione:

```env
NEXT_PUBLIC_DISQUS_SHORTNAME=seu-shortname-aqui
```

Substitua `seu-shortname-aqui` pelo Short Name do seu site Disqus.

### 5. Pronto!
Os comentários deverão aparecer automaticamente no final de cada post, notícia e coluna.

## Componente instalado

- **Arquivo**: `src/components/DisqusComments/DisqusComments.tsx`
- **Exportação**: `src/components/DisqusComments/index.ts`

O componente é reutilizável e foi integrado nas seguintes páginas:
- `/src/app/(frontend)/posts/[slug]/page.tsx` - Posts
- `/src/app/(frontend)/noticias/[slug]/page.tsx` - Notícias
- `/src/app/(frontend)/colunas/[slug]/page.tsx` - Colunas

## Recursos do Disqus inclusos

✅ Comentários aninhados (respostas a comentários)  
✅ Login social (Google, Facebook, Twitter, etc.)  
✅ Moderação de comentários  
✅ Sistema de votação (upvotes/downvotes)  
✅ Notificações para autores  
✅ Análise de engajamento  
✅ Integração com redes sociais  

## Como moderar comentários?

1. Acesse o painel Disqus em [disqus.com/admin/](https://disqus.com/admin/)
2. Vá até "Moderate"
3. Aprove, rejeite ou remova comentários conforme necessário

## Precisar de ajuda?

Consulte a documentação oficial: https://help.disqus.com
