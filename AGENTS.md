# AGENTS.md — Celebra Convite Interativo

## Idioma e forma de trabalho

- Responda sempre em português do Brasil.
- Explique alterações de forma direta e acessível.
- Ao orientar pelo terminal, envie somente um passo por vez e aguarde a confirmação do usuário.
- O usuário normalmente responde `M` quando o comando funcionou ou envia uma captura de tela.
- Não execute builds, auditorias extensas ou verificações desnecessárias sem solicitação.
- Antes de alterar código, inspecione o trecho relevante e preserve mudanças existentes.
- Nunca exponha senhas, tokens, chaves privadas ou arquivos de ambiente.

## Contexto obrigatório

Antes de propor ou implementar mudanças relevantes, leia:

- `docs/CONTEXTO-CELEBRA.md`
- `README.md`
- Os arquivos diretamente relacionados à solicitação.

Atualize `docs/CONTEXTO-CELEBRA.md` quando uma decisão permanente, fluxo importante ou dependência estrutural mudar.

## Objetivo do projeto

O Celebra é um aplicativo de criação e visualização de convites digitais interativos. Deve permanecer simples, rápido, intuitivo e adequado principalmente para celulares. Não deve se transformar em um editor complexo semelhante ao Canva.

## Tecnologias principais

- Next.js com App Router e componentes React.
- Supabase para banco de dados e autenticação.
- Cloudflare Workers para publicação web.
- Capacitor para o APK Android.
- GitHub Actions para gerar e publicar o APK.
- Git como controle de versão.

## Arquivos e áreas importantes

- `app/page.js`: criação, personalização, seleção de recursos e prévia do convite.
- `app/e/[public_code]/page.js`: convite público usado pelos convidados.
- `app/e/[public_code]/public-invite.css`: estilos do convite público.
- `app/login/page.js`: login, cadastro, recuperação e acesso por código.
- `app/inicio/page.js`: painel do anfitrião.
- `lib/supabase.js`: cliente Supabase.
- `.github/workflows/android-apk.yml`: geração e publicação do APK.
- `android/`: projeto nativo Capacitor.

## Regras de interface já decididas

- Priorizar visualização mobile e rolagem mínima confortável.
- Manter a identidade visual Celebra: ameixa, coral, dourado suave e off-white.
- Usar fontes compactas e modernas; evitar fontes muito finas, excessivamente espaçadas ou serifadas.
- Preservar a operação simples e rápida.
- Não reintroduzir: dress code, enquete, restrições alimentares, sorteios, mural ou álbum.
- As seis interações públicas devem aparecer nesta ordem:
  1. Confirmar presença
  2. Sugestão de músicas
  3. Lista de presentes
  4. Pix Presente
  5. Como chegar
  6. Compartilhar convite

## Compatibilidade importante

- O recurso “Compartilhar convite” ainda utiliza internamente o identificador `calendar`.
- Esse identificador foi preservado para que convites antigos continuem funcionando.
- Não renomeie `calendar` no banco ou em `enabled_features` sem criar uma migração compatível.
- No APK, o compartilhamento usa `@capacitor/share`.
- No navegador, utiliza Web Share API com fallback de cópia.
- O compartilhamento deve enviar somente a URL para gerar apenas o card do convite.
- Cancelar o compartilhamento nativo não deve copiar o link nem mostrar mensagens.

## Autenticação

- O login com e-mail e senha deve permanecer separado do acesso por código.
- O código OTP enviado pelo Supabase possui 8 dígitos.
- O acesso por código não deve criar usuários automaticamente.
- Usuários sem cadastro devem ser direcionados para a criação da conta.
- Nunca misture o campo de senha com a tela de acesso por código.

## Banco de dados e segurança

- Respeite as políticas RLS do Supabase.
- Exclusões devem ser confirmadas pelo retorno do banco, não apenas pela ausência de erro.
- A exclusão de eventos depende das relações em cascata de `rsvps` e `music_suggestions`.
- Não use nem exponha a chave `service_role` no frontend.
- Não enfraqueça políticas RLS para resolver erros de acesso.

## Git e publicação

- Preserve arquivos não relacionados e alterações locais do usuário.
- Adicione ao commit somente os arquivos pertencentes à tarefa.
- Use mensagens de commit curtas e descritivas em português.
- Fluxo habitual:
  1. Alterar os arquivos.
  2. Criar o commit.
  3. Executar `git pull --rebase origin main`.
  4. Executar `git push origin main`.
- O APK deve ser gerado pelo workflow `android-apk.yml` no GitHub Actions.
- Não depender do build Android no Codespaces, pois o ambiente pode estar com uma versão Java incompatível.

## Critério de conclusão

Uma alteração só está concluída quando:

- Atende exatamente à solicitação sem desfazer decisões anteriores.
- Preserva compatibilidade com convites já publicados.
- Não inclui arquivos ou credenciais indevidas no commit.
- O comportamento esperado foi explicado claramente ao usuário.
