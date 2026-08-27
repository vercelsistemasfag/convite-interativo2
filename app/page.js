'use client';

import { useMemo, useRef, useState } from 'react';

const screens = [
  null,
  null,
  '/ui/03-capas.png',
  '/ui/04-personalizar.png',
  '/ui/05-recursos.png',
  '/ui/06-publicado.png',
];

const categories = [
  { id: 'aniversario', label: 'Aniversário', color: '#ff6c57', subs: ['Adulto', 'Infantil', '15 anos', 'Data marcante'], icon: 'cake' },
  { id: 'casamento', label: 'Casamento', color: '#c58b28', subs: ['Casamento', 'Noivado', 'Bodas', 'Renovação de votos'], icon: 'rings' },
  { id: 'bebe', label: 'Bebê', color: '#a95d7d', subs: ['Chá de bebê', 'Chá revelação', 'Chá de fraldas'], icon: 'baby' },
  { id: 'formatura', label: 'Formatura', color: '#54112f', subs: ['Formatura', 'Conclusão de curso'], icon: 'cap' },
  { id: 'natal', label: 'Natal', color: '#c28a2c', subs: ['Festa de Natal', 'Confraternização natalina'], icon: 'tree' },
  { id: 'reveillon', label: 'Réveillon', color: '#ff6a55', subs: ['Ano-Novo', 'Festa da virada'], icon: 'glasses' },
];

const covers = ['Clássico', 'Elegante', 'Romântico', 'Noturno', 'Minimalista', 'Divertido'];
const features = [
  ['rsvp', 'Confirmar presença'],
  ['music', 'Sugestão de músicas'],
  ['gifts', 'Lista de presentes'],
  ['collective', 'Presente coletivo'],
  ['location', 'Como chegar'],
  ['calendar', 'Adicionar à agenda'],
];

function pct(x, y, w, h, iw = 1024, ih = 1536) {
  return { left: `${(x / iw) * 100}%`, top: `${(y / ih) * 100}%`, width: `${(w / iw) * 100}%`, height: `${(h / ih) * 100}%` };
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function CategoryIcon({ type }) {
  if (type === 'cake') return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 30h36v24H14zM14 39c6 5 10-5 16 0s10-5 20 0M21 22v-8M32 22v-8M43 22v-8"/><path d="M18 12c3-5 6-5 6 0M29 12c3-5 6-5 6 0M40 12c3-5 6-5 6 0"/></svg>;
  if (type === 'rings') return <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="25" cy="36" r="15"/><circle cx="39" cy="36" r="15"/><path d="M32 8l5 5-5 5-5-5z"/></svg>;
  if (type === 'baby') return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M24 18h16v8H24zM22 26h20v28H22z"/><path d="M29 39c2-4 6-4 8 0 0 5-4 7-8 10-4-3-8-5-8-10 2-4 6-4 8 0z"/><path d="M26 18V9h12v9"/></svg>;
  if (type === 'cap') return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 24l24-12 24 12-24 12z"/><path d="M18 31v12c7 7 21 7 28 0V31M53 26v19"/><circle cx="53" cy="49" r="2"/></svg>;
  if (type === 'tree') return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 9l5 7 8 1-6 6 2 8-9-4-9 4 2-8-6-6 8-1z"/><path d="M32 25L18 43h9l-9 10h28l-9-10h9zM29 53v7h6v-7"/></svg>;
  return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 18h18l-3 16c-1 6-12 6-13 0zM36 18h18l-2 16c-2 6-13 6-14 0zM20 41l-4 14M44 41l4 14M12 55h9M43 55h9"/><path d="M31 7v6M27 10h8M49 5v6M46 8h6"/></svg>;
}

function BrandHeader({ compact = false }) {
  return <div className={`brand-header ${compact ? 'compact' : ''}`}>
    <img src="/brand/celebra-logo.png" alt="Celebra Convite Interativo" />
  </div>;
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('aniversario');
  const [details, setDetails] = useState({ title: '', sub: '', date: '', time: '', place: '', host: '' });
  const [cover, setCover] = useState(0);
  const [color, setColor] = useState(0);
  const [font, setFont] = useState(0);
  const [decor, setDecor] = useState(0);
  const [enabled, setEnabled] = useState(features.map(([id]) => id));
  const [aiCopied, setAiCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const pointerStart = useRef(null);

  const selectedCategory = useMemo(() => categories.find((c) => c.id === category) || categories[0], [category]);
  const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}/c/convite-demo` : 'https://celebra.app/c/convite-demo';
  const aiPrompt = `Crie uma imagem de fundo para convite digital da Celebra no formato vertical 9:16 (1080x1920 px). Categoria: ${selectedCategory.label}. Subcategoria: ${details.sub || selectedCategory.subs[0]}. Estilo escolhido: ${covers[cover]}. Preserve uma área central livre e limpa para textos e botões do aplicativo. Não inclua palavras, logotipos, datas, molduras com texto ou marcas d'água. Evite elementos importantes no centro; concentre a composição nas bordas e cantos. Use acabamento sofisticado, alta definição e composição adequada para tela de celular.`;

  function go(n) { setStep(Math.max(0, Math.min(5, n))); setInviteOpen(false); setDialog(null); window?.scrollTo?.({ top: 0, behavior: 'smooth' }); }
  function toggleFeature(id) { setEnabled((v) => v.includes(id) ? v.filter((x) => x !== id) : [...v, id]); }

  async function handleAiCopy() {
    const ok = await copyText(aiPrompt);
    if (ok) { setAiCopied(true); setTimeout(() => setAiCopied(false), 2500); }
  }
  async function handleLinkCopy() {
    const ok = await copyText(inviteLink);
    if (ok) { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2200); }
  }
  async function shareInvite(channel = '') {
    const text = 'Você está convidado! Abra meu convite interativo Celebra.';
    if (channel === 'whatsapp') { window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${inviteLink}`)}`, '_blank', 'noopener,noreferrer'); return; }
    if (navigator.share) { try { await navigator.share({ title: 'Convite Celebra', text, url: inviteLink }); } catch {} }
    else { await copyText(`${text} ${inviteLink}`); setDialog('Link do convite copiado para compartilhar.'); }
  }
  function openFeature(name) { setDialog(name); }

  return (
    <main className="prototype-shell">
      {step === 0 && <section className="html-screen home-html" aria-label="Tela inicial do Celebra">
        <BrandHeader />
        <div className="home-question">O que vamos<br/>comemorar <span>hoje?</span></div>
        <div className="category-grid">
          {categories.map((cat) => <button key={cat.id} className="category-card" style={{'--cat': cat.color}} onClick={() => { setCategory(cat.id); setDetails((d) => ({ ...d, sub: '' })); go(1); }}>
            <CategoryIcon type={cat.icon}/>
            <strong>{cat.label}</strong>
            <i><span></span><b>◆</b><span></span></i>
          </button>)}
        </div>
      </section>}

      {step === 1 && <section className="html-screen details-html" aria-label="Conte os detalhes">
        <button className="back-button" onClick={() => go(0)} aria-label="Voltar">‹</button>
        <BrandHeader compact />
        <h1>Conte os detalhes</h1>
        <div className="gold-divider"><span></span><b>◆</b><span></span></div>
        <form className="details-form" onSubmit={(e) => { e.preventDefault(); go(2); }}>
          <label className="field-block"><span>◇ <b>Título do evento</b></span><input placeholder="Ex.: Aniversário da Mariana" value={details.title} onChange={(e) => setDetails({ ...details, title: e.target.value })}/></label>
          <label className="field-block"><span>✧ <b>Subcategoria do evento</b></span><select value={details.sub} onChange={(e) => setDetails({ ...details, sub: e.target.value })}><option value="">Selecione a subcategoria</option>{selectedCategory.subs.map((s) => <option key={s}>{s}</option>)}</select></label>
          <div className="form-row">
            <label className="field-block"><span>▣ <b>Data do evento</b></span><input type="date" value={details.date} onChange={(e) => setDetails({ ...details, date: e.target.value })}/></label>
            <label className="field-block"><span>◷ <b>Horário</b></span><input type="time" value={details.time} onChange={(e) => setDetails({ ...details, time: e.target.value })}/></label>
          </div>
          <label className="field-block"><span>⌖ <b>Local do evento</b></span><input placeholder="Ex.: Salão de Festas do Condomínio" value={details.place} onChange={(e) => setDetails({ ...details, place: e.target.value })}/></label>
          <label className="field-block"><span>♙ <b>Nome do anfitrião</b></span><input placeholder="Ex.: Mariana Silva" value={details.host} onChange={(e) => setDetails({ ...details, host: e.target.value })}/></label>
          <button className="primary-cta" type="submit">Continuar <span>→</span></button>
        </form>
        <div className="progress-row" aria-label="Etapa 2 de 5"><b></b><i className="active"></i><i></i><i></i><i></i><span>2/5</span></div>
      </section>}

      {step >= 2 && <section className={`screen-frame step-${step + 1}`} aria-label={`Tela ${step + 1} do Celebra`}>
        <img className="approved-art" src={screens[step]} alt="Interface aprovada do aplicativo Celebra" draggable="false" />

        {step === 2 && <>
          <button className="hotspot clean" style={pct(51, 60, 88, 86)} onClick={() => go(1)} aria-label="Voltar" />
          {[[0,63,462],[1,369,462],[2,675,462],[3,63,854],[4,369,854],[5,675,854]].map(([i,x,y]) => <button key={i} className={`hotspot select-mark ${cover === i ? 'selected' : ''}`} style={pct(x,y,280,368)} onClick={() => setCover(i)} aria-label={`Capa ${covers[i]}`}><span>✓</span></button>)}
          <button className="hotspot clean" style={pct(543,1370,415,70)} onClick={() => go(3)} aria-label="Continuar" />
        </>}

        {step === 3 && <>
          <button className="hotspot clean" style={pct(48,46,78,74)} onClick={() => go(2)} aria-label="Voltar" />
          {[0,1,2,3,4,5].map((i) => <button key={`c${i}`} className={`dot-hit ${color === i ? 'on' : ''}`} style={pct(81+i*79,427,56,56)} onClick={() => setColor(i)} aria-label={`Cor ${i+1}`} />)}
          {[0,1,2,3].map((i) => <button key={`f${i}`} className={`choice-hit ${font === i ? 'on' : ''}`} style={pct(55+i*123,580,106,98)} onClick={() => setFont(i)} aria-label={`Tipografia ${i+1}`} />)}
          {[0,1,2,3,4,5].map((i) => <button key={`d${i}`} className={`choice-hit ${decor === i ? 'on' : ''}`} style={pct(55+i*79,764,66,78)} onClick={() => setDecor(i)} aria-label={`Elemento decorativo ${i+1}`} />)}
          <label className="file-hit" style={pct(55,917,73,87)} aria-label="Enviar imagem de fundo"><input type="file" accept="image/png,image/jpeg" /></label>
          <button className="hotspot ai-copy" style={pct(84,1260,247,54)} onClick={handleAiCopy} aria-label="Copiar instruções para IA"><span>{aiCopied ? 'Copiado ✓' : ''}</span></button>
          <a className={`hotspot ai-open ${aiCopied ? 'ready' : ''}`} style={pct(683,1260,246,54)} href={aiCopied ? 'https://chatgpt.com/' : undefined} target="_blank" rel="noreferrer" onClick={(e) => { if (!aiCopied) { e.preventDefault(); setDialog('Primeiro toque em “Copiar instruções”. Depois o botão para abrir o ChatGPT será liberado.'); } }} aria-label="Abrir ChatGPT" />
          <button className="hotspot clean" style={pct(541,1390,426,67)} onClick={() => go(4)} aria-label="Continuar" />
        </>}

        {step === 4 && <>
          <button className="hotspot clean" style={pct(48,44,78,76)} onClick={() => go(3)} aria-label="Voltar" />
          {[['rsvp',111,431],['music',111,568],['gifts',111,706],['collective',111,843],['location',111,979],['calendar',111,1116]].map(([id,x,y]) => <button key={id} className={`hotspot feature-toggle ${enabled.includes(id) ? 'on' : ''}`} style={pct(x,y,802,124)} onClick={() => toggleFeature(id)} aria-label={`Alternar ${features.find(([fid]) => fid === id)?.[1]}`}><span>{enabled.includes(id) ? '✓' : ''}</span></button>)}
          <button className="hotspot clean" style={pct(478,1382,436,72)} onClick={() => go(5)} aria-label="Finalizar e publicar" />
        </>}

        {step === 5 && <>
          <button className="hotspot clean" style={pct(33,45,66,65)} onClick={() => go(4)} aria-label="Fechar e voltar" />
          <button className="hotspot clean" style={pct(797,45,192,65)} onClick={() => go(1)} aria-label="Editar convite" />
          <div className={`flip-stage ${inviteOpen ? 'open' : ''}`} style={pct(263,258,491,681)} onPointerDown={(e) => { pointerStart.current = e.clientX; }} onPointerUp={(e) => { if (pointerStart.current !== null && pointerStart.current - e.clientX > 34) setInviteOpen(true); pointerStart.current = null; }}>
            <div className="card-inside"><small>CONVITE ABERTO</small><h2>{details.title || 'Aniversário da Juliana'}</h2><p>{details.date || '20 de julho de 2025'} {details.time ? `• ${details.time}` : '• 19h30'}</p><p>{details.place || 'Espaço Florescer'}</p><div className="inside-feature-grid">{features.filter(([id]) => enabled.includes(id)).map(([id,label]) => <button key={id} onClick={() => openFeature(label)}>{label}</button>)}</div><button className="close-card" onClick={() => setInviteOpen(false)}>Fechar convite</button></div>
            <button className="flip-cover" onClick={() => setInviteOpen((v) => !v)} aria-label={inviteOpen ? 'Fechar convite' : 'Abrir convite'}><img src="/ui/convite-capa-crop.png" alt="Capa do convite aprovado" draggable="false" /></button>
          </div>
          {[['Confirmar presença',108],['Sugestão de músicas',241],['Lista de presentes',374],['Presente coletivo',507],['Como chegar',640],['Adicionar à agenda',773]].map(([name,x]) => <button key={name} className="hotspot clean" style={pct(x,1008,123,120)} onClick={() => openFeature(name)} aria-label={name} />)}
          <button className="hotspot clean" style={pct(768,1227,145,51)} onClick={handleLinkCopy} aria-label="Copiar link" />
          <button className="hotspot clean" style={pct(108,1326,175,52)} onClick={() => shareInvite('whatsapp')} aria-label="Compartilhar no WhatsApp" />
          <button className="hotspot clean" style={pct(309,1326,180,52)} onClick={() => shareInvite()} aria-label="Compartilhar no Instagram" />
          <button className="hotspot clean" style={pct(510,1326,180,52)} onClick={() => shareInvite()} aria-label="Compartilhar no Facebook" />
          <button className="hotspot clean" style={pct(708,1326,205,52)} onClick={() => shareInvite()} aria-label="Mais opções de compartilhamento" />
          <button className="hotspot clean" style={pct(89,1411,370,64)} onClick={() => go(0)} aria-label="Ir para meus convites" />
          <button className="hotspot clean" style={pct(494,1411,441,64)} onClick={() => setInviteOpen(true)} aria-label="Ver prévia completa" />
        </>}

        {dialog && <div className="dialog-backdrop" onClick={() => setDialog(null)} role="presentation"><div className="dialog-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true"><button onClick={() => setDialog(null)}>×</button><strong>{dialog}</strong><p>Esta é uma demonstração do fluxo interativo. A integração definitiva será conectada na próxima fase do backend.</p></div></div>}
        {linkCopied && <div className="toast">Link copiado ✓</div>}
      </section>}
    </main>
  );
}
