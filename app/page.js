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

function StepDots({n}) { return <div className="native-dots">{[1,2,3,4,5].map(x=><i key={x} className={x<=n?'on':''}></i>)}<span>{n}/5</span></div> }
function ControlTitle({icon,text}) { return <h3 className="control-title"><i>{icon}</i>{text}</h3> }
function MiniDialog({text,close}) { return <div className="mini-dialog" onClick={close}><div onClick={e=>e.stopPropagation()}><button onClick={close}>×</button><strong>{text}</strong><p>Esta função será conectada ao backend na próxima fase.</p></div></div> }

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

      {step === 2 && <section className="html-screen native-page">
        <button className="back-button" onClick={() => go(1)}>‹</button><BrandHeader compact />
        <h1>Deixe com a sua cara</h1><div className="gold-divider"><span></span><b>◆</b><span></span></div>
        <p className="page-subtitle">Escolha um estilo para começar. Você poderá personalizar na próxima etapa.</p>
        <div className="cover-grid">{covers.map((name,i)=><button key={name} className={`cover-card ${cover===i?'selected':''}`} onClick={()=>setCover(i)}><div className={`cover-art cover-${i}`}><span>{selectedCategory.label}</span><b>{name}</b><i>◆</i></div><strong>{name}</strong>{cover===i&&<em>✓</em>}</button>)}</div>
        <div className="nav-actions"><button onClick={()=>go(1)}>← Voltar</button><button className="next" onClick={()=>go(3)}>Continuar →</button></div><StepDots n={3}/>
      </section>}

      {step === 3 && <section className="html-screen native-page personalize-page">
        <button className="back-button" onClick={() => go(2)}>‹</button><BrandHeader compact />
        <h1>Personalize seu convite</h1><div className="gold-divider"><span></span><b>◆</b><span></span></div><p className="page-subtitle">Deixe seu convite com a sua cara!</p>
        <div className="personalize-layout"><div className="controls-col">
          <ControlTitle icon="◉" text="Cores principais"/><div className="color-row">{['#6a0735','#ff654e','#c78c2a','#17345f','#638b7b','#9c739b'].map((c,i)=><button key={c} style={{background:c}} className={color===i?'selected':''} onClick={()=>setColor(i)}/>)}</div>
          <ControlTitle icon="Aa" text="Tipografia"/><div className="font-row">{['Clássica','Moderna','Elegante','Divertida'].map((x,i)=><button key={x} className={font===i?'selected':''} onClick={()=>setFont(i)}><b className={`font-${i}`}>Aa</b><span>{x}</span></button>)}</div>
          <ControlTitle icon="✧" text="Elementos decorativos"/><div className="decor-row">{['✦','❧','♡','⋰','🎈','⌁'].map((x,i)=><button key={i} className={decor===i?'selected':''} onClick={()=>setDecor(i)}>{x}</button>)}</div>
          <ControlTitle icon="▧" text="Imagem de fundo (opcional)"/><label className="upload-native">↑<span>Enviar</span><input type="file" accept="image/png,image/jpeg"/></label>
        </div><div className="invite-preview"><span>Prévia do convite</span><div className={`preview-card preview-${cover}`}><small>✦ ✦ ✦</small><h2>Vamos<br/><i>Celebrar!</i></h2><p>{details.title||'Aniversário da Mariana'}</p><p>▣ {details.date||'20/07/2025'}　◷ {details.time||'19:00'}</p><p>⌖ {details.place||'Salão de Festas'}</p><b>Conto com você!</b></div><button onClick={()=>setCover((cover+1)%covers.length)}>↻ Trocar modelo</button></div></div>
        <div className="ai-panel"><div><strong>🪄 Personalização com IA ✨</strong><small>Recurso opcional</small></div><p>Para sua imagem encaixar perfeitamente no convite, siga os passos abaixo.</p><div className="ai-steps"><button onClick={handleAiCopy}><b>1</b><strong>Copiar instruções</strong><span>{aiCopied?'Copiado ✓':'Copiar instruções'}</span></button><div><b>2</b><strong>Colar no ChatGPT</strong><span>Cole e descreva o que deseja mudar.</span></div><a href={aiCopied?'https://chatgpt.com/':undefined} target="_blank" onClick={(e)=>{if(!aiCopied){e.preventDefault();setDialog('Primeiro copie as instruções.')}}}><b>3</b><strong>Abrir ChatGPT</strong><span>Abrir ChatGPT ↗</span></a></div></div>
        <div className="nav-actions"><button onClick={()=>go(2)}>← Voltar</button><button className="next" onClick={()=>go(4)}>Continuar →</button></div><StepDots n={4}/>
        {dialog&&<MiniDialog text={dialog} close={()=>setDialog(null)}/>} 
      </section>}

      {step === 4 && <section className="html-screen native-page resources-page">
        <button className="back-button" onClick={() => go(3)}>‹</button><BrandHeader compact /><h1>O que seus convidados<br/>poderão fazer</h1><div className="gold-divider"><span></span><b>◆</b><span></span></div><p className="page-subtitle">Selecione os recursos que deseja disponibilizar no seu convite</p>
        <div className="feature-list">{features.map(([id,label],i)=><button key={id} className={enabled.includes(id)?'on':''} onClick={()=>toggleFeature(id)}><i>{['▣','♫','🎁','♧','⌖','▦'][i]}</i><span><strong>{label}</strong><small>{['Seus convidados confirmam a presença no evento.','Seus convidados sugerem músicas para o evento.','Compartilhe sua lista de presentes online.','Permita contribuições para um presente em grupo.','Exiba o endereço e facilite a chegada.','Adicione o evento à agenda com um clique.'][i]}</small></span><b>{enabled.includes(id)?'✓':''}</b></button>)}</div>
        <div className="tip-box">✦ <span><strong>Você pode alterar depois</strong><small>Todos os recursos podem ser ativados ou desativados a qualquer momento.</small></span><em>Dica</em></div>
        <div className="nav-actions"><button onClick={()=>go(3)}>← Voltar</button><button className="next" onClick={()=>go(5)}>Finalizar e publicar →</button></div><StepDots n={5}/>
      </section>}

      {step === 5 && <section className="html-screen native-page publish-page">
        <button className="back-button" onClick={() => go(4)}>‹</button><BrandHeader compact /><h1>Seu convite está pronto!</h1><div className="gold-divider"><span></span><b>◆</b><span></span></div><p className="page-subtitle">Toque no convite para abrir e fechar como um convite físico.</p>
        <div className={`native-flip ${inviteOpen?'open':''}`}><div className="native-inside"><h2>{details.title||'Aniversário da Juliana'}</h2><p>{details.date||'20 de julho de 2025'} • {details.time||'19h30'}</p><p>{details.place||'Espaço Florescer'}</p><div>{features.filter(([id])=>enabled.includes(id)).map(([id,l])=><button key={id} onClick={()=>openFeature(l)}>{l}</button>)}</div></div><button className="native-cover" onClick={()=>setInviteOpen(!inviteOpen)}><img src="/ui/convite-capa-crop.png" alt="Capa do convite"/></button></div>
        <div className="published-features">{features.filter(([id])=>enabled.includes(id)).map(([id,l])=><button key={id} onClick={()=>openFeature(l)}>{l}</button>)}</div>
        <div className="share-box"><label>Link do convite</label><div><input readOnly value={inviteLink}/><button onClick={handleLinkCopy}>{linkCopied?'Copiado ✓':'Copiar'}</button></div><div className="share-buttons"><button onClick={()=>shareInvite('whatsapp')}>WhatsApp</button><button onClick={()=>shareInvite()}>Compartilhar</button></div></div>
        <div className="nav-actions"><button onClick={()=>go(0)}>← Meus convites</button><button className="next" onClick={()=>setInviteOpen(true)}>Ver prévia completa →</button></div>
        {dialog&&<MiniDialog text={dialog} close={()=>setDialog(null)}/>} 
      </section>}
    </main>
  );
}
