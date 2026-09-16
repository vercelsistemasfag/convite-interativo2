'use client';

import { useState } from 'react';
import styles from './ai-invite-guide.module.css';

const suggestions = {
  casamento: 'Conte se é casamento, noivado ou bodas. Informe os nomes do casal, a data, o horário e o local. Se houver cerimônia e recepção em lugares diferentes, explique os dois.',
  bebe: 'Escolha entre chá de bebê, chá revelação ou chá de fraldas. Informe os nomes que deseja exibir, a data, o horário e o local. No chá revelação, peça uma arte que mantenha a surpresa.',
  formatura: 'Informe o nome de quem está se formando, o curso ou a turma e se o convite é para a cerimônia, o baile ou uma comemoração. Inclua data, horário e local.',
  natal: 'Conte se é uma ceia, uma festa em família ou uma confraternização. Informe quem convida, a data, o horário e o local.',
  reveillon: 'Informe o ano que será recebido, o nome da festa, a data completa, o horário de início e o local. Esclareça se a festa começa na noite de 31 de dezembro.',
};

export default function AiInviteGuide({ category, image, uploading, error, title, onTitleChange, onUpload, onBack, onContinue, children }) {
  const [copyStatus, setCopyStatus] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const prompt = `Quero criar a arte completa de um convite digital de ${category.label} para usar no Celebra.

Antes de gerar a imagem, pergunte os detalhes que faltarem e aguarde minhas respostas.
${suggestions[category.id]}
Pergunte também o tema, as cores, o estilo e a mensagem que desejo incluir. Não invente nomes, datas, endereços ou outras informações.

Crie uma única arte vertical, na proporção 9:16, preferencialmente em 1080 × 1920 pixels, com alta resolução e leitura confortável na tela do celular.
Inclua todos os textos e dados confirmados na própria imagem, em português do Brasil, com acentos corretos. Use letras legíveis, bom contraste e margens generosas em todos os lados. Não corte os textos nem os encoste nas bordas.
Entregue somente a arte, sem moldura de celular, sem mockup, sem botões, sem QR code e sem marcas d'água. As funções interativas serão adicionadas depois no Celebra.
Não faça apenas um fundo vazio: preciso do convite completo. Confirme comigo o conteúdo antes de gerar.`;

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyStatus('Instruções copiadas! Agora abra o ChatGPT e cole na conversa.');
    } catch {
      setShowPrompt(true);
      setCopyStatus('Selecione e copie o texto abaixo para colar no ChatGPT.');
    }
  }

  return (
    <section className={`html-screen native-page ${styles.page}`} aria-label={`Criar convite de ${category.label} com ChatGPT`}>
      <button type="button" className="back-button" aria-label="Voltar às categorias" disabled={uploading} onClick={onBack}>‹</button>
      {children}
      <p className={styles.category}>{category.label}</p>
      <h1>Crie seu convite<br />com ChatGPT</h1>
      <p className={styles.intro}>Sua ideia vira uma arte completa. Depois, volte aqui para transformar a imagem em um convite interativo.</p>

      <ol className={styles.steps}>
        <li>
          <h2>Copie as instruções</h2>
          <p>Preparamos um texto com o formato e os cuidados para o seu convite ficar bonito no celular.</p>
          <button type="button" className={styles.primary} onClick={copyPrompt}>Copiar instruções</button>
          <p role="status" className={styles.status}>{copyStatus}</p>
          <details open={showPrompt} onToggle={event => setShowPrompt(event.currentTarget.open)}>
            <summary>Ver o texto que será copiado</summary>
            <textarea aria-label="Instruções para o ChatGPT" readOnly value={prompt} onFocus={event => event.target.select()} rows={10} />
          </details>
        </li>
        <li>
          <h2>Converse com o ChatGPT</h2>
          <p>Abra o ChatGPT, entre na sua conta se necessário e cole as instruções em uma conversa. Depois, responda às perguntas e conte como imagina a arte.</p>
          <p className={styles.tip}>{suggestions[category.id]}</p>
          <p>Você pode pedir flores, formas modernas, cores suaves ou uma composição festiva. Peça o <strong>convite completo, já com os textos</strong>.</p>
          <a className={styles.primary} href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">Abrir ChatGPT ↗</a>
          <small>As instruções não são enviadas automaticamente: cole o texto na conversa.</small>
        </li>
        <li>
          <h2>Revise e baixe a imagem</h2>
          <p>Confira nomes, acentos, data, horário e endereço. Se precisar, peça correções no ChatGPT antes de baixar a imagem para a galeria ou a pasta de downloads do celular.</p>
          <p>Prefira baixar a imagem original, sem tirar captura de tela. Use uma arte vertical 9:16, com os textos afastados das bordas.</p>
        </li>
        <li>
          <h2>Envie seu convite ao Celebra</h2>
          <p>Volte a esta página e selecione a imagem pronta. Para corrigir os textos da arte, faça o ajuste no ChatGPT e envie a nova versão aqui.</p>
          <label className={styles.upload}>
            {uploading ? 'Enviando imagem…' : image ? 'Trocar imagem do convite' : 'Enviar meu convite'}
            <input type="file" aria-label="Enviar imagem do convite" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={event => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) onUpload(file);
            }} />
          </label>
          <small>PNG, JPG ou WebP · até 10 MB.</small>
          {error && <p role="alert" className={styles.error}>{error}</p>}
          {uploading && <p role="status">Aguarde o envio terminar para continuar.</p>}
          {image && <figure className={styles.preview}><img src={image} alt={`Prévia da arte do convite de ${category.label}`} /><figcaption>Confira se todos os textos estão legíveis.</figcaption></figure>}
          <label className={styles.title}>Nome do convite no seu painel <span>(opcional)</span>
            <input value={title} onChange={event => onTitleChange(event.target.value)} placeholder={`Ex.: ${category.label} em família`} />
          </label>
          <small>Esse nome identifica o convite; ele não escreve por cima da imagem.</small>
        </li>
      </ol>

      <p className={styles.tip}>Na próxima etapa, escolha as funções interativas, como confirmar presença, sugerir músicas e como chegar. O endereço do mapa deve ser preenchido nessa etapa, mesmo que já apareça na imagem.</p>
      <div className={styles.actions}>
        <button type="button" disabled={uploading} onClick={onBack}>← Voltar</button>
        <button type="button" className={styles.primary} disabled={!image || uploading} onClick={onContinue}>Continuar →</button>
      </div>
      {!image && <p className={styles.help}>Envie a arte pronta para continuar.</p>}
    </section>
  );
}
