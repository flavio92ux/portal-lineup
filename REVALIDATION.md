# Revalidação de Cache

Este projeto implementa um sistema de revalidação de cache em duas camadas:

## 1. Revalidação Local (Next.js)

Quando você edita uma página ou post no Payload CMS, os hooks `revalidatePage` e `revalidatePost` são acionados automaticamente. Eles usam as funções `revalidatePath` e `revalidateTag` do Next.js para limpar o cache local da aplicação.

**Paths revalidados automaticamente:**
- **Pages**: `/` (ou o slug da página) e `/pages-sitemap`
- **Posts**: O URL do post, `/posts-sitemap`, `/`, `/noticias`, `/colunas`

## 2. Revalidação Remota (Webhooks)

Para ambientes serverless (como Vercel), o cache pode estar distribuído em múltiplos servidores. Os hooks remotos (`revalidatePageRemote` e `revalidatePostRemote`) chamam a API `/api/revalidate` para garantir que o cache seja limpo em todas as instâncias.

### Como Funciona

Quando você edita conteúdo no Payload CMS:

1. **Hook Local** → Limpa o cache local com `revalidatePath`
2. **Hook Remoto** → Faz uma chamada HTTP para `/api/revalidate` (segura por token)
3. **API Remota** → Processa a revalidação usando `revalidatePath` novamente

### Rota de Revalidação Manual

**Endpoint**: `POST /api/revalidate`

**Autenticação**: Token `REVALIDATE_SECRET` (configurado nas variáveis de ambiente)

**Corpo da Requisição**:
```json
{
  "secret": "seu-token-secreto",
  "paths": ["/", "/noticias", "/pagina-especifica"],
  "type": "path"
}
```

**Respostas**:
- `200 OK`: Cache revalidado com sucesso
- `401 Unauthorized`: Token inválido ou ausente
- `400 Bad Request`: Dados faltantes ou inválidos
- `500 Internal Server Error`: Erro ao processar a revalidação

### Exemplos de Uso

#### Via cURL

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "seu-token-secreto",
    "paths": ["/"],
    "type": "path"
  }'
```

#### Via JavaScript

```javascript
async function revalidateCache() {
  const response = await fetch('/api/revalidate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: process.env.REVALIDATE_SECRET,
      paths: ['/noticias'],
      type: 'path',
    }),
  });

  const data = await response.json();
  console.log(data);
}
```

## Variáveis de Ambiente

- `REVALIDATE_SECRET`: Token seguro para autenticar requisições de revalidação (obrigatório para produção)
- `NEXT_PUBLIC_SERVER_URL`: URL base da aplicação (usado pelos hooks remotos para fazer as chamadas)

## Fluxo Completo

```
Edita conteúdo no Payload CMS
        ↓
     Hook afterChange acionado
        ↓
    ├→ revalidatePage/revalidatePost (local)
    │   └→ revalidatePath() + revalidateTag()
    │
    └→ revalidatePageRemote/revalidatePostRemote (remoto)
        └→ POST /api/revalidate
            └→ revalidatePath() novamente
```

## Notas Importantes

- Os hooks remotos só fazem requisições se `REVALIDATE_SECRET` estiver configurado
- A revalidação remota é assíncrona e não bloqueia a resposta do Payload CMS
- Erros na revalidação remota são logados mas não afetam o salvamento do documento
- Em desenvolvimento, você pode desabilitar revalidações com `context.disableRevalidate = true`
