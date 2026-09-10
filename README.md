# Celebra — Convite Interativo

Versão consolidada do frontend aprovada em 27/08/2026.

## Deploy Cloudflare + vinext

```bash
npm install
npm run build:vinext
npm run deploy
```

### Diretrizes aplicadas
- A página inicial usa exatamente a arte aprovada enviada pelo usuário, sem recriação.
- As demais etapas usam exatamente os mockups aprovados na conversa como base visual.
- Fluxo compacto sem rolagem interna nas telas de criação.
- Categorias: Aniversário, Casamento, Bebê, Formatura, Natal e Réveillon.
- Personalização com IA: Copiar instruções → Colar no ChatGPT → Abrir ChatGPT; abertura só é liberada após copiar.
- Recursos: Confirmar presença, Sugestão de músicas, Lista de presentes, Presente coletivo, Como chegar e Adicionar à agenda.
- Página final usa o modelo aprovado, com efeito de folhear o convite, link e compartilhamento.
