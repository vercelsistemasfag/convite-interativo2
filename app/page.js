'use client';

import { useMemo, useRef, useState } from 'react';

const screens = [
  '/ui/01-inicio.png',
  '/ui/02-detalhes.png',
  '/ui/03-capas.png',
  '/ui/04-personalizar.png',
  '/ui/05-recursos.png',
  '/ui/06-publicado.png',
];

const categories = [
  { id: 'aniversario', label: 'Aniversário', subs: ['Adulto', 'Infantil', '15 anos', 'Data marcante'] },
  { id: 'casamento', label: 'Casamento', subs: ['Casamento', 'Noivado', 'Bodas', 'Renovação de votos'] },
  { id: 'bebe', label: 'Bebê', subs: ['Chá de bebê', 'Chá revelação', 'Chá de fraldas'] },
  { id: 'formatura', label: 'Formatura', subs: ['Formatura', 'Conclusão de curso'] },
  { id: 'natal', label: 'Natal', subs: ['Festa de Natal', 'Confraternização natalina'] },
  { id: 'reveillon', label: 'Réveillon', subs: ['Ano-Novo', 'Festa da virada'] },
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
  const aiPrompt = `Crie uma imagem de fundo para convite digital da Celebra no formato vertical 9:16 (1080x1920 px). Categoria: ${selectedCategory.label}. Subcategoria: ${details.sub || selectedCategory.subs[0]}. Estilo escolhido: ${covers[cover]}. Preserve uma área central livre e limpa para textos e botões do aplicativo. Não inclua palavras, logotipos, datas, molduras com texto ou marcas d'água. Evite elementos importantes no centro; concentre a composição nas bordas e cantos. Use acabamento sofisticado, alta definição e composição adequada para tela de celular. Se eu enviar uma foto, preserve rosto, proporções e identidade, adaptando apenas enquadramento, cenário e estilo sem deformar a pessoa.`;

  function go(n) { setStep(Math.max(0, Math.min(5, n))); setInviteOpen(false); setDialog(null); }
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
    if (channel === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${inviteLink}`)}`, '_blank', 'noopener,noreferrer');
      return;
    }
    if (navigator.share) {
      try { await navigator.share({ title: 'Convite Celebra', text, url: inviteLink }); } catch {}
    } else {
      await copyText(`${text} ${inviteLink}`);
      setDialog('Link do convite copiado para compartilhar.');
    }
  }

  function openFeature(name) { setDialog(name); }

  return (
    <main className="prototype-shell">
      <section className={`screen-frame step-${step + 1}`} aria-label={`Tela ${step + 1} do Celebra`}>
        <img className="approved-art" src={screens[step]} alt="Interface aprovada do aplicativo Celebra" draggable="false" />

        {step === 0 && <>
          {[
            [0, 'aniversario', 64, 888], [1, 'casamento', 355, 888], [2, 'bebe', 648, 888],
            [3, 'formatura', 64, 1177], [4, 'natal', 355, 1177], [5, 'reveillon', 648, 1177],
          ].map(([i, id, x, y]) => <button key={id} className="hotspot clean" style={pct(x, y, 270, 275, 983, 1536)} onClick={() => { setCategory(id); setDetails((d) => ({ ...d, sub: '' })); go(1); }} aria-label={`Selecionar ${categories[i].label}`} />)}
        </>}

        {step === 1 && <>
          <button className="hotspot clean" style={pct(54, 65, 92, 86)} onClick={() => go(0)} aria-label="Voltar" />
          <input className="field-overlay" style={pct(83, 563, 854, 82)} value={details.title} onChange={(e) => setDetails({ ...details, title: e.target.value })} aria-label="Título do evento" />
          <select className="field-overlay" style={pct(83, 741, 854, 83)} value={details.sub} onChange={(e) => setDetails({ ...details, sub: e.target.value })} aria-label="Subcategoria do evento">
            <option value="">Selecione a subcategoria</option>
            {selectedCategory.subs.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input className="field-overlay" style={pct(83, 907, 402, 83)} type="date" value={details.date} onChange={(e) => setDetails({ ...details, date: e.target.value })} aria-label="Data do evento" />
          <input className="field-overlay" style={pct(522, 907, 415, 83)} type="time" value={details.time} onChange={(e) => setDetails({ ...details, time: e.target.value })} aria-label="Horário" />
          <input className="field-overlay" style={pct(83, 1082, 854, 80)} value={details.place} onChange={(e) => setDetails({ ...details, place: e.target.value })} aria-label="Local do evento" />
          <input className="field-overlay" style={pct(83, 1238, 854, 80)} value={details.host} onChange={(e) => setDetails({ ...details, host: e.target.value })} aria-label="Nome do anfitrião" />
          <button className="hotspot clean" style={pct(82, 1342, 858, 80)} onClick={() => go(2)} aria-label="Continuar" />
        </>}

        {step === 2 && <>
          <button className="hotspot clean" style={pct(51, 60, 88, 86)} onClick={() => go(1)} aria-label="Voltar" />
          {[
            [0, 63, 462], [1, 369, 462], [2, 675, 462], [3, 63, 854], [4, 369, 854], [5, 675, 854],
          ].map(([i, x, y]) => <button key={i} className={`hotspot select-mark ${cover === i ? 'selected' : ''}`} style={pct(x, y, 280, 368)} onClick={() => setCover(i)} aria-label={`Capa ${covers[i]}`}><span>✓</span></button>)}
          <button className="hotspot clean" style={pct(543, 1370, 415, 70)} onClick={() => go(3)} aria-label="Continuar" />
        </>}

        {step === 3 && <>
          <button className="hotspot clean" style={pct(48, 46, 78, 74)} onClick={() => go(2)} aria-label="Voltar" />
          {[0,1,2,3,4,5].map((i) => <button key={`c${i}`} className={`dot-hit ${color === i ? 'on' : ''}`} style={pct(81 + i * 79, 427, 56, 56)} onClick={() => setColor(i)} aria-label={`Cor ${i + 1}`} />)}
          {[0,1,2,3].map((i) => <button key={`f${i}`} className={`choice-hit ${font === i ? 'on' : ''}`} style={pct(55 + i * 123, 580, 106, 98)} onClick={() => setFont(i)} aria-label={`Tipografia ${i + 1}`} />)}
          {[0,1,2,3,4,5].map((i) => <button key={`d${i}`} className={`choice-hit ${decor === i ? 'on' : ''}`} style={pct(55 + i * 79, 764, 66, 78)} onClick={() => setDecor(i)} aria-label={`Elemento decorativo ${i + 1}`} />)}
          <label className="file-hit" style={pct(55, 917, 73, 87)} aria-label="Enviar imagem de fundo"><input type="file" accept="image/png,image/jpeg" /></label>
          <button className="hotspot ai-copy" style={pct(84, 1260, 247, 54)} onClick={handleAiCopy} aria-label="Copiar instruções para IA"><span>{aiCopied ? 'Copiado ✓' : ''}</span></button>
          <a className={`hotspot ai-open ${aiCopied ? 'ready' : ''}`} style={pct(683, 1260, 246, 54)} href={aiCopied ? 'https://chatgpt.com/' : undefined} target="_blank" rel="noreferrer" onClick={(e) => { if (!aiCopied) { e.preventDefault(); setDialog('Primeiro toque em “Copiar instruções”. Depois o botão para abrir o ChatGPT será liberado.'); } }} aria-label="Abrir ChatGPT" />
          <button className="hotspot clean" style={pct(541, 1390, 426, 67)} onClick={() => go(4)} aria-label="Continuar" />
        </>}

        {step === 4 && <>
          <button className="hotspot clean" style={pct(48, 44, 78, 76)} onClick={() => go(3)} aria-label="Voltar" />
          {[
            ['rsvp', 111, 431], ['music', 111, 568], ['gifts', 111, 706],
            ['collective', 111, 843], ['location', 111, 979], ['calendar', 111, 1116],
          ].map(([id, x, y]) => <button key={id} className={`hotspot feature-toggle ${enabled.includes(id) ? 'on' : ''}`} style={pct(x, y, 802, 124)} onClick={() => toggleFeature(id)} aria-label={`Alternar ${features.find(([fid]) => fid === id)?.[1]}`}><span>{enabled.includes(id) ? '✓' : ''}</span></button>)}
          <button className="hotspot clean" style={pct(478, 1382, 436, 72)} onClick={() => go(5)} aria-label="Finalizar e publicar" />
        </>}

        {step === 5 && <>
          <button className="hotspot clean" style={pct(33, 45, 66, 65)} onClick={() => go(4)} aria-label="Fechar e voltar" />
          <button className="hotspot clean" style={pct(797, 45, 192, 65)} onClick={() => go(1)} aria-label="Editar convite" />

          <div className={`flip-stage ${inviteOpen ? 'open' : ''}`} style={pct(263, 258, 491, 681)}
               onPointerDown={(e) => { pointerStart.current = e.clientX; }}
               onPointerUp={(e) => { if (pointerStart.current !== null && pointerStart.current - e.clientX > 34) setInviteOpen(true); pointerStart.current = null; }}>
            <div className="card-inside">
              <small>CONVITE ABERTO</small>
              <h2>{details.title || 'Aniversário da Juliana'}</h2>
              <p>{details.date || '20 de julho de 2025'} {details.time ? `• ${details.time}` : '• 19h30'}</p>
              <p>{details.place || 'Espaço Florescer'}</p>
              <div className="inside-feature-grid">
                {features.filter(([id]) => enabled.includes(id)).map(([id, label]) => <button key={id} onClick={() => openFeature(label)}>{label}</button>)}
              </div>
              <button className="close-card" onClick={() => setInviteOpen(false)}>Fechar convite</button>
            </div>
            <button className="flip-cover" onClick={() => setInviteOpen((v) => !v)} aria-label={inviteOpen ? 'Fechar convite' : 'Abrir convite'}>
              <img src="/ui/convite-capa-crop.png" alt="Capa do convite aprovado" draggable="false" />
            </button>
          </div>

          {[
            ['Confirmar presença', 108], ['Sugestão de músicas', 241], ['Lista de presentes', 374],
            ['Presente coletivo', 507], ['Como chegar', 640], ['Adicionar à agenda', 773],
          ].map(([name, x]) => <button key={name} className="hotspot clean" style={pct(x, 1008, 123, 120)} onClick={() => openFeature(name)} aria-label={name} />)}

          <button className="hotspot clean" style={pct(768, 1227, 145, 51)} onClick={handleLinkCopy} aria-label="Copiar link" />
          <button className="hotspot clean" style={pct(108, 1326, 175, 52)} onClick={() => shareInvite('whatsapp')} aria-label="Compartilhar no WhatsApp" />
          <button className="hotspot clean" style={pct(309, 1326, 180, 52)} onClick={() => shareInvite()} aria-label="Compartilhar no Instagram" />
          <button className="hotspot clean" style={pct(510, 1326, 180, 52)} onClick={() => shareInvite()} aria-label="Compartilhar no Facebook" />
          <button className="hotspot clean" style={pct(708, 1326, 205, 52)} onClick={() => shareInvite()} aria-label="Mais opções de compartilhamento" />
          <button className="hotspot clean" style={pct(89, 1411, 370, 64)} onClick={() => go(0)} aria-label="Ir para meus convites" />
          <button className="hotspot clean" style={pct(494, 1411, 441, 64)} onClick={() => setInviteOpen(true)} aria-label="Ver prévia completa" />
        </>}

        {dialog && <div className="dialog-backdrop" onClick={() => setDialog(null)} role="presentation"><div className="dialog-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true"><button onClick={() => setDialog(null)}>×</button><strong>{dialog}</strong><p>Esta é uma demonstração do fluxo interativo. A integração definitiva será conectada na próxima fase do backend.</p></div></div>}
        {linkCopied && <div className="toast">Link copiado ✓</div>}
      </section>
      <p className="prototype-note">Protótipo Celebra • artes aprovadas aplicadas sem recriação visual</p>
    </main>
  );
}
