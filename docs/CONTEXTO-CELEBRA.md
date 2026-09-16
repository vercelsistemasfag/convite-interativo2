# Contexto do Projeto — Celebra Convite Interativo

## 1. Visão geral

O Celebra é um aplicativo gratuito para criar, publicar e compartilhar convites digitais interativos. O anfitrião monta o convite, seleciona funções e recebe as interações dos convidados.

O foco do produto é:

- Uso simples e rápido em celulares.
- Convites visualmente bem apresentados.
- Interatividade sem exigir cadastro do convidado.
- Baixo custo operacional.
- Compatibilidade entre navegador, PWA e APK Android.
- Evitar complexidade semelhante a editores como Canva.

Repositório:

`https://github.com/vercelsistemasfag/convite-interativo2`

Endereço público:

`https://celebra-convite.vercelsistemas.workers.dev/`

## 2. Perfis de utilização

### Anfitrião

O anfitrião pode:

- Criar uma conta.
- Entrar com e-mail e senha.
- Entrar sem senha por código OTP enviado ao e-mail.
- Criar e personalizar convites.
- Selecionar funcionalidades.
- Publicar o convite.
- Copiar ou compartilhar o endereço público.
- Visualizar seus convites.
- Excluir definitivamente um convite.

### Convidado

O convidado:

- Abre o convite por um endereço público.
- Não precisa criar conta.
- Folheia a capa para acessar as interações.
- Utiliza apenas as funções habilitadas pelo anfitrião.
- Pode acessar pelo navegador ou pelo APK de convidado.

## 3. Tecnologias

- Next.js com App Router.
- React.
- Supabase:
  - PostgreSQL.
  - Authentication.
  - Row Level Security.
  - E-mails de autenticação.
- Cloudflare Workers para aplicação web.
- Cloudflare R2 para distribuição do APK.
- Capacitor para Android.
- Plugin `@capacitor/share` para compartilhamento nativo.
- GitHub Actions para geração do APK.
- GitHub como repositório principal.

## 4. Estrutura principal

### `app/page.js`

Tela principal de criação do convite. Contém:

- Seleção da comemoração.
- Personalização visual.
- Configuração dos textos.
- Elementos flutuantes.
- Seleção das funcionalidades.
- Configuração das funções que precisam de dados.
- Pré-visualização.
- Publicação e compartilhamento pelo painel de criação.

Este arquivo concentra bastante lógica e deve ser alterado com cuidado.

### `app/e/[public_code]/page.js`

Página pública do convite. Responsável por:

- Buscar o evento pelo código público.
- Exibir a capa.
- Executar a animação de abertura.
- Mostrar os seis cards interativos.
- Registrar presença.
- Receber sugestões de músicas.
- Mostrar lista de presentes.
- Mostrar dados do Pix Presente.
- Abrir a localização.
- Compartilhar o convite.

### `app/e/[public_code]/public-invite.css`

Estilos da página pública, cards, modal, convite, animação e responsividade.

### `app/login/page.js`

Responsável por:

- Login com senha.
- Cadastro.
- Recuperação de senha.
- Login sem senha por código OTP.
- Atualização de senha após recuperação.

### `app/inicio/page.js`

Painel do anfitrião:

- Lista os convites do usuário.
- Permite abrir e editar.
- Permite excluir convite.
- A exclusão deve acontecer de verdade no Supabase.

### `lib/supabase.js`

Inicialização do cliente Supabase usado no frontend.

### `.github/workflows/android-apk.yml`

Workflow utilizado para:

- Preparar Java compatível.
- Gerar o APK Android.
- Publicar o APK no Cloudflare R2.
- Disponibilizar o APK como artefato do GitHub Actions.

## 5. Fluxo de criação do convite

O fluxo deve permanecer simples:

1. Escolher o tipo de comemoração.
2. Personalizar o convite.
3. Selecionar e configurar as funcionalidades.
4. Visualizar e publicar.
5. Compartilhar o endereço gerado.

A etapa “Conte os detalhes” foi removida. Os dados são configurados diretamente na personalização.

## 6. Personalização

### Textos

- Cada caixa pode possuir cor própria.
- O texto pode ser arrastado.
- O tamanho é ajustado por controles.
- Texto não deve possuir rotação.
- A edição acontece na caixa correspondente.
- Existe a opção de aplicar novamente.
- Preferir fontes compactas, modernas e legíveis.
- Evitar fontes muito finas, serifadas ou excessivamente espaçadas.

### Elementos flutuantes

- Podem ser arrastados.
- Podem ser redimensionados.
- Podem ser girados.
- Possuem botão pequeno para exclusão.
- A interação deve evitar conflito entre arrastar, redimensionar e girar.
- Somente o fundo é obrigatório; os outros elementos podem ser removidos.

### Personalização com IA

Na categoria Aniversário, é uma função secundária e simplificada:

1. Copiar as instruções preparadas.
2. Abrir o ChatGPT para gerar a imagem.

No editor de Aniversário, não transformar essa área no foco principal.

### Demais categorias: arte completa com ChatGPT (16/09/2026)

- Casamento, Bebê, Formatura, Natal e Réveillon abrem a página `app/ai-invite-guide.js` na etapa de personalização; somente Aniversário abre o editor nativo e seu guia inicial.
- O passo a passo tem instruções adaptadas à categoria, cópia com alternativa manual, abertura do ChatGPT, revisão e download, envio da arte pronta e prévia.
- Pedir arte completa com textos, vertical 9:16, preferencialmente 1080 × 1920, sem botões ou moldura de celular.
- O usuário volta ao Celebra e envia PNG, JPG ou WebP até 10 MB. O envio reutiliza o bucket `invite-backgrounds` e só libera o avanço após sucesso.
- O nome opcional identifica o convite no painel; não é sobreposto à arte.
- Nessas categorias, a publicação usa a imagem completa e listas vazias de textos e elementos flutuantes. Nenhuma mudança no banco ou na leitura dos convites já publicados.
- Cada categoria mantém seu próprio rascunho em `categoryDrafts` dentro do rascunho local existente. A marca local `aiArtworkCategory` confirma o envio da arte da categoria, sem aceitar um fundo antigo como arte pronta automaticamente.
- Voltar da seleção de recursos retorna à página apropriada à categoria.
- As seis funções interativas continuam na etapa seguinte. O endereço de Como chegar precisa ser configurado mesmo quando aparece na imagem.

## 7. Funcionalidades públicas

A ordem obrigatória dos cards é:

1. Confirmar presença.
2. Sugestão de músicas.
3. Lista de presentes.
4. Pix Presente.
5. Como chegar.
6. Compartilhar convite.

### Confirmar presença

Coleta:

- Nome do convidado.
- Participação: sim ou não.
- Número de acompanhantes, quando participar.

O campo de acompanhantes deve abrir vazio e mostrar “Número de acompanhantes”. Valor vazio deve ser salvo como zero.

Os registros são gravados na tabela `rsvps`.

### Sugestão de músicas

O convidado pode enviar sugestões. Os dados são gravados em `music_suggestions`.

Existe intenção de integração com API externa, preferencialmente Deezer, com busca e prévia. Deve existir fallback para digitação livre.

### Lista de presentes

O anfitrião configura uma lista de sugestões. Uma possível integração futura com a Amazon ainda precisa ser avaliada.

### Pix Presente

O anfitrião informa:

- Chave Pix.
- Nome do recebedor.

O pagamento é direto ao anfitrião, sem intermediador.

### Como chegar

Abre o endereço configurado no aplicativo de mapas do dispositivo. O endereço é preenchido manualmente pelo anfitrião.

### Compartilhar convite

Substituiu permanentemente “Adicionar à agenda”.

Compatibilidade importante:

- O identificador interno continua sendo `calendar`.
- Convites antigos podem ter `calendar` em `enabled_features`.
- Não renomear esse identificador sem migração do banco.
- O rótulo público é “Compartilhar convite”.
- O card utiliza um ícone vetorial de compartilhamento.
- O compartilhamento envia somente a URL.
- No WhatsApp deve aparecer apenas o card de pré-visualização, sem texto e endereço repetidos abaixo.
- No APK utiliza `@capacitor/share`.
- No navegador utiliza `navigator.share`.
- Quando não houver suporte web, utiliza cópia como fallback.
- Cancelar ou fechar o compartilhamento nativo não deve copiar o endereço nem mostrar aviso.

## 8. Autenticação

### Login com senha

Possui campos próprios de e-mail e senha.

### Login por código

Deve permanecer visualmente separado do login com senha:

1. Usuário escolhe “Entrar sem senha”.
2. Informa somente o e-mail.
3. Recebe o código.
4. Digita ou cola o código.
5. Confirma o acesso.

Regras:

- O código atual enviado pelo Supabase possui 8 dígitos.
- O campo deve aceitar 8 dígitos.
- O campo de senha não pode aparecer nessa tela.
- `signInWithOtp` utiliza `shouldCreateUser: false`.
- Usuário sem cadastro deve receber direcionamento para criar a conta.
- Manter apenas a opção nova “Ainda não tem cadastro? Criar minha conta”.
- Não reintroduzir o antigo botão “Ainda não tenho conta”.

### SMTP

O Supabase utiliza SMTP personalizado.

Nunca armazenar no repositório:

- Senha de aplicativo do Gmail.
- Credenciais SMTP.
- Tokens privados.
- Chave `service_role`.

## 9. Banco de dados e RLS

Tabelas conhecidas:

- `events`
- `rsvps`
- `music_suggestions`

Campos importantes utilizados em `events` incluem:

- `id`
- `host_id`
- `public_code`
- `status`
- `enabled_features`

Outros campos devem ser confirmados no código ou no Supabase antes de criar consultas ou migrações.

### Exclusão de convite

O anfitrião pode excluir somente os próprios eventos.

A política de exclusão considera:

`auth.uid() = host_id`

A aplicação não pode considerar a exclusão bem-sucedida apenas porque não houve erro. A consulta utiliza retorno dos registros excluídos para confirmar que o banco realmente autorizou a operação.

Relacionamentos conhecidos:

- `rsvps.event_id` possui exclusão em cascata.
- `music_suggestions.event_id` possui exclusão em cascata.

Nunca resolver problemas de banco desativando a RLS.

## 10. Identidade visual

Paleta principal:

- Ameixa.
- Coral.
- Dourado suave.
- Off-white.
- Cinza claro em fundos externos quando necessário.

Características do logotipo:

- Nome Celebra.
- Celular e envelope.
- Estrelas douradas.
- Arco formando parte de um círculo.
- Assinatura “Convite Interativo”.

Evitar:

- Visual genérico de template pronto.
- Excesso de elementos decorativos.
- Fontes básicas demais.
- Conteúdo espremido ou sem respiro.
- Mudanças no logotipo sem solicitação expressa.

## 11. Categorias e fundos

Categorias já trabalhadas:

- Aniversário.
- Casamento.
- Bebê.
- Formatura.
- Natal.
- Réveillon.

Categorias internas atuais da galeria:

- Infantil.
- Aniversário de 15 anos.
- Times de Futebol.
- Roblox.
- Clássicos.

Padrão para fundos gerados:

- 1080 × 1920 pixels.
- Proporção vertical 9:16.
- Alta resolução.
- Centro livre para textos.
- Elementos concentrados nas bordas e cantos.
- Sem textos, botões, datas, endereços ou marcas d’água quando for somente fundo.

## 12. Recursos removidos definitivamente

Não reintroduzir sem decisão expressa do responsável pelo produto:

- Dress code.
- Enquete.
- Restrições alimentares.
- Sorteios ou brincadeiras.
- Mural.
- Álbum de fotos.

## 13. APK Android

O APK é baseado em Capacitor.

Pacotes principais atuais:

- `@capacitor/core`
- `@capacitor/android`
- `@capacitor/app`
- `@capacitor/share`

Depois de instalar ou alterar plugins nativos:

1. Executar `npx cap sync android`.
2. Commitar os arquivos Android gerados necessários.
3. Enviar para a branch principal.
4. Executar manualmente o workflow `android-apk.yml`.

O build direto no Codespaces já falhou por incompatibilidade da versão Java. Preferir GitHub Actions.

## 14. Git e colaboração

Para novas melhorias:

1. Atualizar a branch local.
2. Criar uma branch para a tarefa.
3. Inspecionar o código relevante.
4. Fazer alteração pequena e focada.
5. Revisar apenas o diff da tarefa.
6. Criar commit descritivo.
7. Enviar a branch.
8. Abrir Pull Request para revisão.

Não incluir no commit:

- APKs locais não solicitados.
- Arquivos de ambiente.
- Credenciais.
- Imagens não relacionadas.
- Alterações automáticas fora do escopo.

## 15. Pendências e possibilidades futuras

Itens ainda passíveis de evolução:

- Integração de músicas com Deezer.
- Avaliação de integração de presentes com Amazon.
- Melhorias na visualização das respostas do anfitrião.
- Refinamento de folhear e voltar.
- Expansão controlada dos modelos de convite.
- Melhor documentação da estrutura completa do Supabase.
- Testes sistemáticos em diferentes tamanhos de celular.

Esses itens não devem ser implementados sem solicitação.

## 16. Princípios para novas alterações

Antes de mudar qualquer comportamento:

- Verificar se a mudança afeta convites já publicados.
- Preservar os identificadores usados no banco.
- Verificar a experiência no celular.
- Não misturar fluxos que foram separados.
- Evitar dependências desnecessárias.
- Não duplicar botões ou mensagens.
- Não remover funções operacionais sem autorização.
- Manter o convidado sem obrigação de cadastro.
- Tratar sucesso do banco somente quando houver confirmação real.

## 17. Prompt inicial recomendado

Ao abrir o projeto com uma nova conta do ChatGPT ou Codex, utilizar:

> Leia integralmente o arquivo AGENTS.md e o documento
> docs/CONTEXTO-CELEBRA.md. Depois inspecione somente os arquivos relevantes
> para a solicitação atual. Preserve as decisões existentes, a compatibilidade
> com convites publicados e as políticas RLS. Explique em português o que
> entendeu e não altere nenhum arquivo até receber a tarefa específica.

## 18. Manutenção deste documento

Este arquivo funciona como memória compartilhada do projeto.

Atualize-o quando houver:

- Nova decisão permanente de produto.
- Mudança na arquitetura.
- Nova tabela ou política relevante.
- Alteração no fluxo de autenticação.
- Mudança no processo do APK.
- Substituição permanente de uma funcionalidade.
