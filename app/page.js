'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

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

const covers = ['Bordô Dourado', 'Floral Rosé', 'Abstrato', 'Festa Noturna', 'Tropical', 'Arquitetônico'];
const backgrounds = ['/backgrounds/3931.png','/backgrounds/3932.png','/backgrounds/3933.png','/backgrounds/3934.png','/backgrounds/3935.png','/backgrounds/3936.png'];
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
    <img src="/brand/celebra-logo-v2.png" alt="Celebra Convite Interativo" />
  </div>;
}

function StepDots({n}) { return <div className="native-dots">{[1,2,3,4,5].map(x=><i key={x} className={x<=n?'on':''}></i>)}<span>{n}/5</span></div> }
function ControlTitle({icon,text}) { return <h3 className="control-title"><i>{icon}</i>{text}</h3> }
function MiniDialog({text,close}) { return <div className="mini-dialog" onClick={close}><div onClick={e=>e.stopPropagation()}><button onClick={close}>×</button><strong>{text}</strong><p>Esta função será conectada ao backend na próxima fase.</p></div></div> }

const defaultInvite = {
  category: 'aniversario',
  details: { title: '', message: 'Vamos celebrar!', date: '', time: '', place: '' },
  floatingElements: [],
  floatingTexts: [
    { id:'message', type:'message', x:50, y:29, size:34, rotate:0, visible:true },
    { id:'title', type:'title', x:50, y:42, size:22, rotate:0, visible:true },
    { id:'date', type:'date', x:37, y:56, size:14, rotate:0, visible:true },
    { id:'time', type:'time', x:67, y:56, size:14, rotate:0, visible:true },
    { id:'place', type:'place', x:50, y:66, size:14, rotate:0, visible:true },
    { id:'closing', type:'closing', x:50, y:79, size:15, rotate:0, visible:true },
  ],
  cover: 0,
  background: 0,
  color: 0,
  fontColor: '#f4e7d7',
  font: 0,
  decor: 0,
  enabled: features.map(([id]) => id),
};

function formatDateBR(value) {
  if (!value) return '20/07/2025';
  const [year, month, day] = value.split('-');
  return day && month && year ? `${day}/${month}/${year}` : value;
}

function formatDateLongBR(value) {
  if (!value) return '20 de julho de 2025';
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, day)));
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [invite, setInvite] = useState(defaultInvite);
  const [hydrated, setHydrated] = useState(false);
  const { category, details, cover, background = 0, color, fontColor = '#f4e7d7', font, floatingElements = [], floatingTexts = defaultInvite.floatingTexts, enabled } = invite;
  const [aiCopied, setAiCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [customBg, setCustomBg] = useState('');
  const [activeEditorPanel, setActiveEditorPanel] = useState(null);
  const pointerStart = useRef(null);
  const resizeStart = useRef(null);
  const previewRef = useRef(null);
  const [selectedObject, setSelectedObject] = useState(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('celebra:invite-draft:v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        setInvite((current) => ({
          ...current,
          ...parsed,
          details: { ...current.details, ...(parsed.details || {}) },
          enabled: Array.isArray(parsed.enabled) ? parsed.enabled : current.enabled,
          floatingTexts: Array.isArray(parsed.floatingTexts) ? parsed.floatingTexts : current.floatingTexts,
        }));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem('celebra:invite-draft:v1', JSON.stringify(invite)); } catch {}
  }, [invite, hydrated]);

  const selectedCategory = useMemo(() => categories.find((c) => c.id === category) || categories[0], [category]);
  const previewTitle = details.title || selectedCategory.label;
  const previewMessage = details.message || 'Vamos celebrar!';
  const previewSub = selectedCategory.label;
  const previewDate = formatDateBR(details.date);
  const previewDateLong = formatDateLongBR(details.date);
  const previewTime = details.time || '19:00';
  const previewPlace = details.place || 'Salão de Festas';
  const previewColors = ['#6a0735','#ff654e','#c78c2a','#17345f','#638b7b','#9c739b'];
  const previewStyle = { '--preview-accent': previewColors[color], '--preview-accent-soft': `${previewColors[color]}33`, '--invite-text': fontColor };
  const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}/c/convite-demo` : 'https://celebra.app/c/convite-demo';
  const aiPrompt = `Crie uma imagem de fundo para convite digital da Celebra no formato vertical 9:16 (1080x1920 px). Categoria: ${selectedCategory.label}. Estilo escolhido: ${covers[cover]}. Preserve uma área central livre e limpa para textos e botões do aplicativo. Não inclua palavras, logotipos, datas, molduras com texto ou marcas d'água. Evite elementos importantes no centro; concentre a composição nas bordas e cantos. Use acabamento sofisticado, alta definição e composição adequada para tela de celular.`;

  function go(n) { setStep(Math.max(0, Math.min(3, n))); setInviteOpen(false); setDialog(null); setActiveEditorPanel(null); window?.scrollTo?.({ top: 0, behavior: 'smooth' }); }
  function patchInvite(patch) { setInvite((current) => ({ ...current, ...patch })); }
  function patchDetails(patch) { setInvite((current) => ({ ...current, details: { ...current.details, ...patch } })); }
  function toggleFeature(id) { setInvite((current) => ({ ...current, enabled: current.enabled.includes(id) ? current.enabled.filter((x) => x !== id) : [...current.enabled, id] })); }
  function clearDraft() { setInvite(defaultInvite); setStep(0); try { window.localStorage.removeItem('celebra:invite-draft:v1'); } catch {} }

  const elementCatalog = [
    ['balloons','🎈','Balões'],['heart','💛','Coração'],['sparkles','✨','Brilhos'],['gift','🎁','Presente'],
    ['cake','🎂','Bolo'],['confetti','🎉','Confete'],['star','⭐','Estrela'],['flowers','🌸','Flores']
  ];
  function addFloatingElement(type, glyph) {
    const item = { id: `${Date.now()}-${Math.random()}`, type, glyph, x: 50, y: 24, size: 44, rotate: 0 };
    patchInvite({ floatingElements: [...floatingElements, item] });
    setSelectedObject(`decor:${item.id}`);
  }
  function updateFloatingElement(id, patch) {
    setInvite(current => ({...current, floatingElements:(current.floatingElements||[]).map(el=>el.id===id?{...el,...patch}:el)}));
  }
  function updateFloatingText(id, patch) {
    setInvite(current => ({...current, floatingTexts:(current.floatingTexts||defaultInvite.floatingTexts).map(el=>el.id===id?{...el,...patch}:el)}));
  }
  function removeObject(kind,id) {
    if(kind==='decor') setInvite(current=>({...current,floatingElements:(current.floatingElements||[]).filter(el=>el.id!==id)}));
    else updateFloatingText(id,{visible:false});
    setSelectedObject(null);
  }
  function applyTextAgain(id, text){ updateFloatingText(id,{visible:true,text}); setSelectedObject(`text:${id}`); }
  function getObject(kind,id){ return kind==='decor' ? floatingElements.find(x=>x.id===id) : floatingTexts.find(x=>x.id===id); }
  function patchObject(kind,id,patch){ kind==='decor' ? updateFloatingElement(id,patch) : updateFloatingText(id,patch); }
  function selectObject(kind,id){
    const key=`${kind}:${id}`;
    if(selectedObject!==key) setSelectedObject(key);
  }
  function startObjectGesture(e,kind,id){
    if(e.target.closest?.('.object-control')) return;
    const key=`${kind}:${id}`;
    if(selectedObject!==key){ e.preventDefault(); e.stopPropagation(); setSelectedObject(key); return; }
    e.preventDefault(); e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const obj=getObject(kind,id), r=previewRef.current?.getBoundingClientRect(); if(!obj||!r)return;
    pointerStart.current={kind,id,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,x:obj.x,y:obj.y};
  }
  function moveObjectGesture(e,kind,id){
    if(!previewRef.current) return;
    const d=pointerStart.current; if(!d||d.id!==id||d.pointerId!==e.pointerId)return;
    const r=previewRef.current.getBoundingClientRect();
    const x=Math.max(3,Math.min(97,d.x+((e.clientX-d.startX)/r.width)*100));
    const y=Math.max(3,Math.min(97,d.y+((e.clientY-d.startY)/r.height)*100));
    patchObject(kind,id,{x,y});
  }
  function startResize(e,kind,id){
    e.preventDefault(); e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const obj=getObject(kind,id), r=previewRef.current?.getBoundingClientRect(); if(!obj||!r)return;
    const cx=r.left+r.width*obj.x/100, cy=r.top+r.height*obj.y/100;
    resizeStart.current={kind,id,pointerId:e.pointerId,cx,cy,distance:Math.max(1,Math.hypot(e.clientX-cx,e.clientY-cy)),size:obj.size};
  }
  function moveResize(e,kind,id){
    const d=resizeStart.current; if(!d||d.id!==id||d.pointerId!==e.pointerId)return;
    e.preventDefault(); e.stopPropagation();
    const dist=Math.max(1,Math.hypot(e.clientX-d.cx,e.clientY-d.cy));
    const min=kind==='text'?10:22,max=kind==='text'?72:110;
    patchObject(kind,id,{size:Math.max(min,Math.min(max,d.size*(dist/d.distance)))});
  }
  function endObjectGesture(){ pointerStart.current=null; resizeStart.current=null; }
  function textValue(item){ if(Object.prototype.hasOwnProperty.call(item,'text')) return item.text; return ({message:previewMessage,title:previewTitle,date:`▣ ${previewDate}`,time:`◷ ${previewTime}`,place:`⌖ ${previewPlace}`,closing:'Conto com você!'})[item.type]||''; }
  function FloatingObject({kind,item,children}){
    if(item.visible===false)return null;
    const selected=selectedObject===`${kind}:${item.id}`;
    return <div className={`floating-object ${kind==='text'?'floating-text':'floating-decor'} ${selected?'selected':''}`} style={{left:`${item.x}%`,top:`${item.y}%`,fontSize:`${item.size}px`,transform:`translate(-50%,-50%)`}} onPointerDown={e=>startObjectGesture(e,kind,item.id)} onPointerMove={e=>moveObjectGesture(e,kind,item.id)} onPointerUp={endObjectGesture} onPointerCancel={endObjectGesture}>
      <div className="object-content">{children}</div>
      {selected&&<>
        <button type="button" className="object-control object-delete" aria-label="Excluir" onPointerDown={e=>{e.stopPropagation();e.preventDefault();removeObject(kind,item.id)}}>×</button>
        <button type="button" className="object-control object-resize" aria-label="Redimensionar" onPointerDown={e=>startResize(e,kind,item.id)} onPointerMove={e=>moveResize(e,kind,item.id)} onPointerUp={endObjectGesture} onPointerCancel={endObjectGesture}>↘</button>
      </>}
    </div>;
  }

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
          {categories.map((cat) => <button key={cat.id} className="category-card" style={{'--cat': cat.color}} onClick={() => { setInvite((current) => ({ ...current, category: cat.id, details: { ...current.details, sub: '' } })); go(1); }}>
            <CategoryIcon type={cat.icon}/>
            <strong>{cat.label}</strong>
            <i><span></span><b>◆</b><span></span></i>
          </button>)}
        </div>
      </section>}

      {step === 1 && <section className="html-screen native-page personalize-page editor-v9">
        <button className="back-button" onClick={() => go(0)}>‹</button><BrandHeader compact />
        <h1>Personalize seu convite</h1><div className="gold-divider"><span></span><b>◆</b><span></span></div><p className="page-subtitle">Edite os dados e o visual. A prévia muda na hora.</p>

        <div className="editor-preview-top">
          <div ref={previewRef} className={`preview-card editor-live font-preview-${font}`} onPointerDown={(e)=>{if(e.target===e.currentTarget)setSelectedObject(null)}} style={{...previewStyle, backgroundImage:`linear-gradient(rgba(20,8,16,.12),rgba(20,8,16,.12)), url(${customBg || backgrounds[background]})`}}>
            {floatingTexts.map(el=><FloatingObject key={el.id} kind="text" item={el}>{textValue(el)}</FloatingObject>)}
            {floatingElements.map(el=><FloatingObject key={el.id} kind="decor" item={el}>{el.glyph}</FloatingObject>)}
          </div>
        </div>

        <div className="editor-tabs" aria-label="Ferramentas de personalização">
          {[
            ['texto','Aa','Texto'],
            ['fundos','▧','Fundos'],
            ['fontes','𝓕','Fontes'],
            ['cores','◉','Cores'],
            ['elementos','✦','Elementos']
          ].map(([id,icon,label]) => (
            <button key={id} type="button" className={activeEditorPanel===id?'active':''} aria-expanded={activeEditorPanel===id} onClick={()=>setActiveEditorPanel(current=>current===id?null:id)}>
              {icon}<span>{label}</span>
            </button>
          ))}
        </div>

        <div className={`editor-panel-slot ${activeEditorPanel?'open':''}`}>
          {activeEditorPanel === 'texto' && <div className="editor-section editor-section-active"><ControlTitle icon="✎" text="Textos e informações"/>
            <p className="section-hint">Edite o conteúdo somente nos campos abaixo. Na arte, toque para selecionar, arraste para mover e use a seta para redimensionar.</p>
            <label className="field-block"><span><b>Título do evento</b></span><div className="field-apply-row"><input placeholder="Ex.: Aniversário da Mariana" value={details.title} onChange={(e)=>patchDetails({title:e.target.value})}/><button type="button" onClick={()=>applyTextAgain('title',details.title||selectedCategory.label)}>Aplicar novamente</button></div></label>
            <label className="field-block"><span><b>Frase do convite</b></span><div className="field-apply-row"><input placeholder="Ex.: Vamos celebrar!" value={details.message || ''} onChange={(e)=>patchDetails({message:e.target.value})}/><button type="button" onClick={()=>applyTextAgain('message',details.message||'Vamos celebrar!')}>Aplicar novamente</button></div></label>
            <div className="form-row"><label className="field-block"><span><b>Data</b></span><div className="field-apply-row"><input type="date" value={details.date} onChange={(e)=>patchDetails({date:e.target.value})}/><button type="button" onClick={()=>applyTextAgain('date',`▣ ${formatDateBR(details.date)}`)}>Aplicar novamente</button></div></label><label className="field-block"><span><b>Horário</b></span><div className="field-apply-row"><input type="time" value={details.time} onChange={(e)=>patchDetails({time:e.target.value})}/><button type="button" onClick={()=>applyTextAgain('time',`◷ ${details.time||'19:00'}`)}>Aplicar novamente</button></div></label></div>
            <label className="field-block"><span><b>Local</b></span><div className="field-apply-row"><input placeholder="Ex.: Salão de Festas" value={details.place} onChange={(e)=>patchDetails({place:e.target.value})}/><button type="button" onClick={()=>applyTextAgain('place',`⌖ ${details.place||'Salão de Festas'}`)}>Aplicar novamente</button></div></label>
          </div>}

          {activeEditorPanel === 'fundos' && <div className="editor-section editor-section-active"><ControlTitle icon="▧" text="Fundos do convite"/><div className="background-grid">{backgrounds.map((src,i)=><button key={src} className={background===i&&!customBg?'selected':''} onClick={()=>{patchInvite({background:i,cover:i});setCustomBg('')}}><img src={src} alt={covers[i]}/><span>{covers[i]}</span></button>)}</div>
            <label className="upload-wide">＋ Enviar minha imagem<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e)=>{const f=e.target.files?.[0];if(f){setCustomBg(URL.createObjectURL(f))}}}/></label>
          </div>}

          {activeEditorPanel === 'fontes' && <div className="editor-section editor-section-active"><ControlTitle icon="Aa" text="Fontes compactas"/><p className="section-hint">Doze estilos realmente diferentes, carregados como web fonts para manter o mesmo visual em qualquer aparelho.</p><div className="font-choice-list">{[['Bebas Neue','VAMOS CELEBRAR!'],['Oswald','Vamos celebrar!'],['Roboto Condensed','Vamos celebrar!'],['Barlow Condensed','Vamos celebrar!'],['Archivo Narrow','Vamos celebrar!'],['Anton','VAMOS CELEBRAR!'],['Fjalla One','Vamos celebrar!'],['Amatic SC','VAMOS CELEBRAR!'],['Pacifico','Vamos celebrar!'],['Lobster','Vamos celebrar!'],['Caveat','Vamos celebrar!'],['Satisfy','Vamos celebrar!']].map(([x,sample],i)=><button key={x} className={`font-sample font-preview-${i} ${font===i?'selected':''}`} onClick={()=>patchInvite({font:i})}><span>{sample}</span><small>{x}</small>{font===i&&<b>✓</b>}</button>)}</div></div>}
          {activeEditorPanel === 'cores' && <div className="editor-section editor-section-active">
            <ControlTitle icon="◉" text="Cores do convite"/>
            <div className="color-control-group"><strong>Cor da fonte</strong><p>Altera a cor de todos os textos do convite.</p><div className="color-row font-color-row">{['#ffffff','#f4e7d7','#e7bd6a','#6a0735','#17345f','#231f20','#ff654e'].map((c,i)=><button aria-label={`Cor da fonte ${i+1}`} key={c} style={{background:c}} className={fontColor.toLowerCase()===c?'selected':''} onClick={()=>patchInvite({fontColor:c})}/>)}</div><label className="custom-color-picker"><span>Escolher outra cor</span><input type="color" value={fontColor} onChange={(e)=>patchInvite({fontColor:e.target.value})}/><b style={{background:fontColor}}></b></label></div>
            <div className="color-control-group accent-group"><strong>Cor de destaque</strong><p>Usada em bordas e detalhes decorativos.</p><div className="color-row">{['#6a0735','#ff654e','#c78c2a','#17345f','#638b7b','#9c739b'].map((c,i)=><button aria-label={`Cor de destaque ${i+1}`} key={c} style={{background:c}} className={color===i?'selected':''} onClick={()=>patchInvite({color:i})}/>)}</div></div>
          </div>}
          {activeEditorPanel === 'elementos' && <div className="editor-section editor-section-active"><ControlTitle icon="✦" text="Elementos flutuantes"/><p className="section-hint">Toque para adicionar. Na arte, toque no ícone para selecionar, arraste a caixa para mover e use a seta no canto para redimensionar.</p><div className="element-catalog">{elementCatalog.map(([type,glyph,label])=><button key={type} onClick={()=>addFloatingElement(type,glyph)}><b>{glyph}</b><span>{label}</span></button>)}</div></div>}
        </div>

        <div className="ai-panel ai-panel-v9"><div><strong>✨ Personalização com IA</strong><small>Opcional</small></div><p>Quer criar um fundo exclusivo? Copie o comando pronto e abra o ChatGPT. Depois, cole o comando e descreva o visual que deseja.</p><div className="ai-steps ai-two"><button onClick={handleAiCopy}><b>1</b><strong>{aiCopied?'Comando copiado ✓':'Copiar comando'}</strong><span>Leva o formato correto do Celebra.</span></button><a href="https://chatgpt.com/" target="_blank" rel="noreferrer"><b>2</b><strong>Abrir ChatGPT</strong><span>Cole o comando e peça sua imagem.</span></a></div></div>
        <div className="nav-actions"><button onClick={()=>go(0)}>← Voltar</button><button className="next" onClick={()=>go(2)}>Continuar →</button></div><StepDots n={2}/>
      </section>}

      {step === 2 && <section className="html-screen native-page resources-page">
        <button className="back-button" onClick={() => go(1)}>‹</button><BrandHeader compact /><h1>O que seus convidados<br/>poderão fazer</h1><div className="gold-divider"><span></span><b>◆</b><span></span></div><p className="page-subtitle">Ative somente os recursos que quiser oferecer.</p>
        <div className="feature-list">{features.map(([id,label],i)=><button key={id} className={enabled.includes(id)?'on':''} onClick={()=>toggleFeature(id)}><i>{['▣','♫','🎁','♧','⌖','▦'][i]}</i><span><strong>{label}</strong><small>{['Confirmação de presença.','Sugestões para a trilha sonora.','Link para sua lista de presentes.','Contribuição para presente coletivo.','Endereço e rota do evento.','Evento salvo na agenda.'][i]}</small></span><b>{enabled.includes(id)?'✓':''}</b></button>)}</div>
        <div className="nav-actions"><button onClick={()=>go(1)}>← Voltar</button><button className="next" onClick={()=>go(3)}>Finalizar →</button></div><StepDots n={3}/>
      </section>}

      {step === 3 && <section className="html-screen native-page publish-page">
        <button className="back-button" onClick={() => go(2)}>‹</button><BrandHeader compact /><h1>Seu convite está pronto!</h1><div className="gold-divider"><span></span><b>◆</b><span></span></div><p className="page-subtitle">Confira e compartilhe seu convite interativo.</p>
        <div className={`native-flip ${inviteOpen?'open':''}`}><div className={`native-inside published-invite font-preview-${font}`} style={{...previewStyle,backgroundImage:`linear-gradient(rgba(20,8,16,.12),rgba(20,8,16,.12)), url(${customBg || backgrounds[background]})`}}>{floatingTexts.filter(el=>el.visible!==false).map(el=><div key={el.id} className="published-object published-text" style={{left:`${el.x}%`,top:`${el.y}%`,fontSize:`${el.size}px`,transform:`translate(-50%,-50%)`}}>{textValue(el)}</div>)}{floatingElements.map(el=><div key={el.id} className="published-object published-decor" style={{left:`${el.x}%`,top:`${el.y}%`,fontSize:`${el.size}px`,transform:`translate(-50%,-50%)`}}>{el.glyph}</div>)}</div><button className="native-cover" onClick={()=>setInviteOpen(!inviteOpen)}><img src={customBg || backgrounds[background]} alt="Capa do convite"/></button></div>
        <div className="published-features">{features.filter(([id])=>enabled.includes(id)).map(([id,l])=><button key={id} onClick={()=>openFeature(l)}>{l}</button>)}</div>
        <div className="share-box"><label>Link do convite</label><div><input readOnly value={inviteLink}/><button onClick={handleLinkCopy}>{linkCopied?'Copiado ✓':'Copiar'}</button></div><div className="share-buttons"><button onClick={()=>shareInvite('whatsapp')}>WhatsApp</button><button onClick={()=>shareInvite()}>Compartilhar</button></div></div>
        <div className="nav-actions"><button onClick={()=>go(1)}>← Editar convite</button><button className="next" onClick={()=>setInviteOpen(true)}>Ver convite →</button></div>
        {dialog&&<MiniDialog text={dialog} close={()=>setDialog(null)}/>} 
      </section>}
    </main>
  );
}
