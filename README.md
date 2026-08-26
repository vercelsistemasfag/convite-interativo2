# Celebre — Convites Interativos

Frontend MVP do PWA de convites interativos, preparado para Cloudflare Workers com vinext.

## Stack

- Next.js 16 / App Router
- React 19
- vinext
- Cloudflare Workers + Vite Plugin
- PWA com manifest e service worker

## Desenvolvimento local

```bash
npm install
npm run check:vinext
npm run dev:vinext
```

O fluxo original do Next.js continua disponível com `npm run dev`.

## Build Cloudflare

```bash
npm run build:vinext
```

## Primeiro deploy

1. Entre na sua conta Cloudflare pelo terminal:

```bash
npx wrangler login
```

2. Confira sua conta:

```bash
npx wrangler whoami
```

3. Faça o deploy:

```bash
npm run deploy
```

O Worker será publicado inicialmente em um endereço `*.workers.dev`. Depois, um domínio personalizado pode ser vinculado pelo painel da Cloudflare.

> Se o deploy for feito por CI/GitHub, use `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` como variáveis secretas em vez de colocar credenciais no código.

## Estrutura futura

O projeto está preparado para receber:

- Supabase para eventos, confirmações, músicas, votos, presentes e contribuições;
- Deezer para pesquisa e preview de músicas;
- Amazon Creators API para lista de presentes;
- Pix direto para a conta do organizador;
- Links públicos individuais em `/e/<slug-codigo>`;
- painel privado do organizador.

## Observação

O vinext ainda está em beta. Antes de cada atualização importante, rode `npm run check:vinext` e valide o build antes do deploy.
