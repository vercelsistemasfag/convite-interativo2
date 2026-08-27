'use client';

import { useMemo, useState } from 'react';

const celebrations = [
  { id: 'aniversario', icon: '🎂', title: 'Aniversário', note: 'Adulto, infantil, 15 anos e datas marcantes' },
  { id: 'casamento', icon: '💍', title: 'Casamento', note: 'Casamento, noivado, bodas e renovação de votos' },
  { id: 'bebe', icon: '🍼', title: 'Bebê', note: 'Chá de bebê, chá revelação e chá de fraldas' },
  { id: 'formatura', icon: '🎓', title: 'Formatura', note: 'Formatura e conclusão de curso' },
  { id: 'casa-nova', icon: '🏠', title: 'Casa Nova', note: 'Chá de casa nova e open house' },
  { id: 'churrasco', icon: '🍖', title: 'Churrasco', note: 'Encontro descontraído com amigos e família' },
  { id: 'tematica', icon: '🎭', title: 'Festa Temática', note: 'Fantasia, anos 80, neon e outros temas' },
  { id: 'confraternizacao', icon: '🥂', title: 'Confraternização', note: 'Amigos, família ou empresa' },
  { id: 'natal', icon: '🎄', title: 'Natal', note: 'Ceia, amigo secreto e encontro em família' },
  { id: 'reveillon', icon: '🎆', title: 'Réveillon', note: 'Celebração de Ano Novo' },
  { id: 'festa-junina', icon: '🌽', title: 'Festa Junina', note: 'Arraiá, comidas típicas e quadrilha' },
  { id: 'empresarial', icon: '💼', title: 'Evento Empresarial', note: 'Inauguração, lançamento e celebrações corporativas' },
];

const featureOptions = [
  { id: 'rsvp', icon: '✓', title: 'Confirmar presença', detail: 'Organize sua lista de convidados.' },
  { id: 'music', icon: '♫', title: 'Sugestão de músicas', detail: 'Seus convidados ajudam a montar a playlist.' },
  { id: 'gifts', icon: '♢', title: 'Lista de presentes', detail: 'Adicione produtos e links de lojas.' },
  { id: 'collective', icon: '♡', title: 'Presente coletivo', detail: 'Crie uma meta e receba contribuições via Pix.' },
  { id: 'polls', icon: '▥', title: 'Enquetes', detail: 'Descubra preferências dos convidados.' },
  { id: 'location', icon: '⌖', title: 'Como chegar', detail: 'Facilite o acesso pelo mapa.' },
  { id: 'calendar', icon: '□', title: 'Adicionar ao calendário', detail: 'Ajude ninguém a esquecer a data.' },
  { id: 'dress', icon: '✦', title: 'Dress code', detail: 'Informe o estilo de traje quando necessário.' },
];

const initialFeatures = ['rsvp', 'music', 'gifts', 'collective', 'location', 'calendar'];

function formatDate(date) {
  if (!date) return '20 de setembro de 2026';
  const [y, m, d] = date.split('-');
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${y}-${m}-${d}T12:00:00Z`));
}

function shortDate(date) {
  if (!date) return '20 · SET · 2026';
  const [y, m, d] = date.split('-');
  const month = new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' }).format(new Date(`${y}-${m}-${d}T12:00:00Z`)).replace('.', '').toUpperCase();
  return `${d} · ${month} · ${y}`;
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [celebration, setCelebration] = useState(null);
  const [form, setForm] = useState({ name: '', age: '', date: '', time: '', place: '', city: '', message: '' });
  const [features, setFeatures] = useState(initialFeatures);
  const [copied, setCopied] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);

  const selected = useMemo(() => celebrations.find((item) => item.id === celebration), [celebration]);
  const progress = (step / 5) * 100;
  const displayName = form.name || 'Ana';
  const displayAge = form.age || '30';

  function next() { setStep((v) => Math.min(5, v + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function back() { setStep((v) => Math.max(1, v - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function toggleFeature(id) { setFeatures((c) => c.includes(id) ? c.filter((x) => x !== id) : [...c, id]); }

  const aiPrompt = `Crie uma arte de capa para um convite digital de ${selected?.title || 'comemoração'}${form.name ? ` de ${form.name}` : ''}. A imagem será usada em um PWA mobile. Produza em formato vertical 4:5, com composição central segura, boa leitura em telas pequenas e espaço visual para inserir nome, data e horário. Se eu enviar uma foto, adapte o enquadramento sem deformar pessoas, preserve rostos e complete o cenário de forma natural se necessário. Use uma direção artística sofisticada, autoral e não genérica. Não insira textos na imagem.`;

  async function copyPrompt() { try { await navigator.clipboard.writeText(aiPrompt); setCopied(true); setTimeout(() => setCopied(false), 2200); } catch {} }
  async function sharePreview() { const text = `Você está convidado para celebrar ${displayName}!\n${formatDate(form.date)}${form.time ? ` às ${form.time}` : ''}.`; if (navigator.share) { try { await navigator.share({ title: `Convite de ${displayName}`, text }); } catch {} } else { await navigator.clipboard?.writeText(text); alert('Texto do convite copiado.'); } }

  return (
    <main className="app-shell">
      <header className="brandbar">
        <div className="brandmark">✦</div><div><strong>Celebra</strong><span>convite interativo</span></div><div className="step-pill">{step}/5</div>
      </header>
      <div className="progress"><span style={{ width: `${progress}%` }} /></div>

      {step === 1 && <section className="stage">
        <div className="eyebrow">Vamos começar</div><h1>O que vamos comemorar?</h1>
        <p className="lead">Escolha o tipo de comemoração. A Celebra prepara uma experiência visual própria para cada momento.</p>
        <div className="celebration-grid">{celebrations.map((item) => <button key={item.id} className={`celebration-card ${celebration === item.id ? 'selected' : ''}`} onClick={() => setCelebration(item.id)}><span className="emoji">{item.icon}</span><span className="card-copy"><strong>{item.title}</strong><small>{item.note}</small></span><span className="check">✓</span></button>)}</div>
        <button className="primary" disabled={!celebration} onClick={next}>Continuar</button>
      </section>}

      {step === 2 && <section className="stage narrow">
        <button className="back" onClick={back}>← Voltar</button><div className="eyebrow">{selected?.icon} {selected?.title}</div><h1>Conte os detalhes</h1><p className="lead">Essas informações entram diretamente na experiência do convite.</p>
        <div className="form-card">
          <label>Nome de quem celebra<input value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} placeholder="Ex.: Ana" /></label>
          {selected?.id === 'aniversario' && <label>Idade <input inputMode="numeric" value={form.age} onChange={(e) => setForm({...form,age:e.target.value.replace(/\D/g,'').slice(0,3)})} placeholder="Ex.: 30" /></label>}
          <div className="two-cols"><label>Data<input type="date" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})}/></label><label>Horário<input type="time" value={form.time} onChange={(e)=>setForm({...form,time:e.target.value})}/></label></div>
          <label>Local<input value={form.place} onChange={(e)=>setForm({...form,place:e.target.value})} placeholder="Ex.: Espaço Jardim"/></label>
          <label>Cidade<input value={form.city} onChange={(e)=>setForm({...form,city:e.target.value})} placeholder="Ex.: Novo Hamburgo - RS"/></label>
          <label>Mensagem especial <textarea value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} placeholder="Ex.: Uma nova fase, muitas histórias para viver..." /></label>
        </div><button className="primary" disabled={!form.name || !form.date} onClick={next}>Personalizar convite</button>
      </section>}

      {step === 3 && <section className="stage narrow">
        <button className="back" onClick={back}>← Voltar</button><div className="eyebrow">Personalização</div><h1>Deixe com a sua cara</h1><p className="lead">O padrão já tem direção artística própria. Se quiser, sua foto pode virar parte da composição com IA.</p>
        <div className="ai-card"><div className="spark">✨</div><div><h2>Personalize com IA</h2><p>Envie sua foto ao ChatGPT e peça uma versão preparada especialmente para seu convite. Nós já preparamos tamanho, enquadramento e estilo.</p></div><div className="ai-actions"><button className="primary compact" onClick={copyPrompt}>{copied?'✓ Instruções copiadas':'Copiar instruções'}</button><a className="secondary compact" href="https://chatgpt.com/" target="_blank" rel="noreferrer">Abrir ChatGPT ↗</a></div></div>
        <div className="standard-card"><div className="mini-preview"><span>✦</span><strong>{displayName}</strong><small>{shortDate(form.date)}</small></div><div><h3>Experiência Celebra</h3><p>Continue sem foto e veja nosso primeiro convite padrão de aniversário em movimento.</p></div></div>
        <button className="primary" onClick={next}>Continuar com este convite</button>
      </section>}

      {step === 4 && <section className="stage">
        <button className="back" onClick={back}>← Voltar</button><div className="eyebrow">Interatividade</div><h1>O que seus convidados poderão fazer?</h1><p className="lead">Ative somente o que faz sentido para a comemoração.</p>
        <div className="feature-grid">{featureOptions.map((item)=>{const active=features.includes(item.id);return <button key={item.id} className={`feature-card ${active?'active':''}`} onClick={()=>toggleFeature(item.id)}><span className="feature-icon">{item.icon}</span><span><strong>{item.title}</strong><small>{item.detail}</small></span><span className="switch"><i/></span></button>})}</div><button className="primary" onClick={next}>Ver meu convite</button>
      </section>}

      {step === 5 && <section className="stage preview-stage">
        <button className="back" onClick={back}>← Voltar</button>
        <div className="eyebrow">Experiência padrão · Aniversário</div>
        <h1>Abra o convite. Depois, participe.</h1>
        <p className="lead">A capa concentra o impacto visual. Ao abrir, data, local e ações aparecem juntas para reduzir a rolagem no celular.</p>

        <div className="experience-wrap">
          <article className={`compact-invite ${inviteOpen ? 'open' : ''}`}>
            {!inviteOpen && <button type="button" className="compact-cover" onClick={() => setInviteOpen(true)}>
              <div className="compact-cover-brand">Celebra <small>CONVITE INTERATIVO</small></div>
              <div className="compact-cover-stars">✦ ✧ ✦</div>
              <div className="compact-cover-frame">
                <small>HOJE É DIA DE</small>
                <h2>{displayName}</h2>
                {selected?.id === 'aniversario' && <strong>faz {displayAge}!</strong>}
                <span>{shortDate(form.date)}</span>
              </div>
              <div className="tap-open"><b>Toque para abrir</b><span>⌄</span></div>
            </button>}

            {inviteOpen && <div className="compact-inside">
              <div className="inside-header">
                <div><small>VOCÊ ESTÁ CONVIDADO</small><h2>{displayName} <em>{selected?.id === 'aniversario' ? `${displayAge}!` : ''}</em></h2></div>
                <button type="button" onClick={() => { setInviteOpen(false); setActivePanel(null); }}>Fechar</button>
              </div>

              <div className="inside-info">
                <div><span>□</span><b>{shortDate(form.date)}</b><small>{form.time || '19h00'}</small></div>
                <div><span>⌖</span><b>{form.place || 'Espaço Jardim'}</b><small>{form.city || 'Novo Hamburgo · RS'}</small></div>
              </div>

              {features.includes('rsvp') && <button type="button" className="inside-primary" onClick={() => setActivePanel('rsvp')}>
                <span>✓</span><div><b>Confirmar presença</b><small>Avise que você vai participar</small></div><i>›</i>
              </button>}

              <div className="inside-actions">
                {features.includes('music') && <button type="button" onClick={() => setActivePanel('music')}><span>♫</span><b>Sugerir música</b></button>}
                {features.includes('gifts') && <button type="button" onClick={() => setActivePanel('gifts')}><span>♢</span><b>Presentes</b></button>}
                {features.includes('collective') && <button type="button" onClick={() => setActivePanel('collective')}><span>♡</span><b>Presente coletivo</b></button>}
                {features.includes('location') && <button type="button" onClick={() => setActivePanel('location')}><span>⌖</span><b>Como chegar</b></button>}
                {features.includes('calendar') && <button type="button" onClick={() => setActivePanel('calendar')}><span>□</span><b>Adicionar à agenda</b></button>}
                {features.includes('polls') && <button type="button" onClick={() => setActivePanel('polls')}><span>▥</span><b>Enquete</b></button>}
              </div>

              <div className="inside-note"><span>“</span><p>{form.message || 'Uma nova fase, muitas histórias para viver e momentos para guardar. Vai ser ainda melhor com você por perto.'}</p></div>
              <footer className="inside-footer">✦ Celebra · convite interativo</footer>

              {activePanel && <div className="inside-panel">
                <button type="button" className="inside-panel-close" onClick={() => setActivePanel(null)}>×</button>
                {activePanel === 'rsvp' && <><span className="inside-panel-icon">✓</span><h3>Confirmar presença</h3><p>A confirmação será feita aqui, sem sair do convite.</p><button type="button" className="inside-panel-action">Vou participar!</button></>}
                {activePanel === 'music' && <><span className="inside-panel-icon">♫</span><h3>Sugira uma música</h3><p>A busca Deezer ficará neste painel, com preview quando disponível e sugestão manual como alternativa.</p><div className="inside-search">Pesquisar música ou artista… <b>⌕</b></div></>}
                {activePanel === 'gifts' && <><span className="inside-panel-icon">♢</span><h3>Lista de presentes</h3><p>Os presentes escolhidos pelo anfitrião aparecerão aqui.</p><button type="button" className="inside-panel-action">Ver lista</button></>}
                {activePanel === 'collective' && <><span className="inside-panel-icon">♡</span><h3>Presente coletivo</h3><p>Viagem de aniversário</p><div className="inside-goal"><i /></div><b className="inside-goal-text">68% da meta alcançada</b><button type="button" className="inside-panel-action">Contribuir via Pix</button></>}
                {activePanel === 'location' && <><span className="inside-panel-icon">⌖</span><h3>Como chegar</h3><p>{form.place || 'Espaço Jardim'} · {form.city || 'Novo Hamburgo · RS'}</p><button type="button" className="inside-panel-action">Abrir no mapa</button></>}
                {activePanel === 'calendar' && <><span className="inside-panel-icon">□</span><h3>Salvar a data</h3><p>{formatDate(form.date)} {form.time ? `às ${form.time}` : 'às 19h00'}.</p><button type="button" className="inside-panel-action">Adicionar à agenda</button></>}
                {activePanel === 'polls' && <><span className="inside-panel-icon">▥</span><h3>Enquete da festa</h3><p>Uma pergunta rápida pode aparecer aqui.</p><button type="button" className="inside-panel-action">Responder</button></>}
              </div>}
            </div>}
          </article>
        </div>

        <div className="publish-card"><div><strong>Modelo compacto para mobile</strong><p>O convidado encontra as funções principais logo depois de abrir o cartão.</p></div><code>celebra.app/e/{displayName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-')}-K7M4</code></div>
        <button className="primary" onClick={sharePreview}>Compartilhar prévia</button>
        <button className="secondary" onClick={() => { setInviteOpen(false); setActivePanel(null); setStep(1); }}>Criar outro convite</button>
      </section>}
    </main>
  );
}
