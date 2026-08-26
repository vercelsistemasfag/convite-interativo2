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
  { id: 'rsvp', icon: '✅', title: 'Confirmar presença', detail: 'Organize sua lista de convidados.' },
  { id: 'music', icon: '🎵', title: 'Sugestão de músicas', detail: 'Seus convidados ajudam a montar a playlist.' },
  { id: 'gifts', icon: '🎁', title: 'Lista de presentes', detail: 'Adicione produtos e links de lojas.' },
  { id: 'collective', icon: '💝', title: 'Presente coletivo', detail: 'Crie uma meta e receba contribuições via Pix.' },
  { id: 'polls', icon: '📊', title: 'Enquetes', detail: 'Descubra preferências dos convidados.' },
  { id: 'location', icon: '📍', title: 'Como chegar', detail: 'Facilite o acesso pelo mapa.' },
  { id: 'calendar', icon: '📅', title: 'Adicionar ao calendário', detail: 'Ajude ninguém a esquecer a data.' },
  { id: 'dress', icon: '✨', title: 'Dress code', detail: 'Informe o estilo de traje quando necessário.' },
];

const initialFeatures = ['rsvp', 'music', 'gifts', 'collective', 'location', 'calendar'];

function formatDate(date) {
  if (!date) return 'Escolha a data';
  const [y, m, d] = date.split('-');
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${y}-${m}-${d}T12:00:00Z`));
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [celebration, setCelebration] = useState(null);
  const [form, setForm] = useState({ name: '', date: '', time: '', place: '', city: '' });
  const [features, setFeatures] = useState(initialFeatures);
  const [copied, setCopied] = useState(false);

  const selected = useMemo(() => celebrations.find((item) => item.id === celebration), [celebration]);
  const progress = (step / 5) * 100;

  function next() {
    setStep((value) => Math.min(5, value + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function back() {
    setStep((value) => Math.max(1, value - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleFeature(id) {
    setFeatures((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  const aiPrompt = `Crie uma arte de capa para um convite digital de ${selected?.title || 'comemoração'}${form.name ? ` de ${form.name}` : ''}. A imagem será usada em um PWA mobile. Produza em formato vertical 4:5, com composição central segura, boa leitura em telas pequenas e espaço visual para inserir nome, data e horário. Se eu enviar uma foto, adapte o enquadramento sem deformar pessoas, preserve rostos e complete o cenário de forma natural se necessário. O estilo deve ser elegante, atual e apropriado para ${selected?.title || 'a comemoração'}. Não insira textos na imagem, a menos que eu peça explicitamente.`;

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(aiPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  async function sharePreview() {
    const text = `🎉 Você está convidado para ${form.name || 'uma comemoração especial'}!\n${formatDate(form.date)}${form.time ? ` às ${form.time}` : ''}.`;
    if (navigator.share) {
      try { await navigator.share({ title: form.name || 'Convite', text }); } catch {}
    } else {
      await navigator.clipboard?.writeText(text);
      alert('Texto do convite copiado.');
    }
  }

  return (
    <main className="app-shell">
      <header className="brandbar">
        <div className="brandmark">C</div>
        <div>
          <strong>Celebre</strong>
          <span>convites interativos</span>
        </div>
        <div className="step-pill">{step}/5</div>
      </header>

      <div className="progress"><span style={{ width: `${progress}%` }} /></div>

      {step === 1 && (
        <section className="stage">
          <div className="eyebrow">Vamos começar</div>
          <h1>O que vamos comemorar?</h1>
          <p className="lead">Escolha o tipo de comemoração para prepararmos a melhor experiência para o seu convite.</p>

          <div className="celebration-grid">
            {celebrations.map((item) => (
              <button key={item.id} className={`celebration-card ${celebration === item.id ? 'selected' : ''}`} onClick={() => setCelebration(item.id)}>
                <span className="emoji">{item.icon}</span>
                <span className="card-copy"><strong>{item.title}</strong><small>{item.note}</small></span>
                <span className="check">✓</span>
              </button>
            ))}
          </div>

          <button className="primary" disabled={!celebration} onClick={next}>Continuar</button>
        </section>
      )}

      {step === 2 && (
        <section className="stage narrow">
          <button className="back" onClick={back}>← Voltar</button>
          <div className="eyebrow">{selected?.icon} {selected?.title}</div>
          <h1>Conte os detalhes</h1>
          <p className="lead">Só precisamos das informações essenciais por enquanto.</p>

          <div className="form-card">
            <label>Nome da comemoração
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={selected?.id === 'aniversario' ? 'Ex.: Aniversário da Ana' : 'Ex.: Nossa comemoração'} />
            </label>
            <div className="two-cols">
              <label>Data<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
              <label>Horário<input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></label>
            </div>
            <label>Local<input value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} placeholder="Ex.: Espaço Jardim" /></label>
            <label>Cidade<input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Ex.: Novo Hamburgo - RS" /></label>
          </div>

          <button className="primary" disabled={!form.name || !form.date} onClick={next}>Personalizar convite</button>
        </section>
      )}

      {step === 3 && (
        <section className="stage narrow">
          <button className="back" onClick={back}>← Voltar</button>
          <div className="eyebrow">Personalização</div>
          <h1>Deixe com a sua cara</h1>
          <p className="lead">Você pode seguir com nosso visual padrão ou criar uma capa exclusiva com IA.</p>

          <div className="ai-card">
            <div className="spark">✨</div>
            <div>
              <h2>Personalize com IA</h2>
              <p>Envie sua foto ao ChatGPT e peça uma versão preparada especialmente para seu convite. Nós já preparamos as instruções de tamanho, enquadramento e estilo.</p>
            </div>
            <div className="ai-actions">
              <button className="primary compact" onClick={copyPrompt}>{copied ? '✓ Instruções copiadas' : 'Copiar instruções'}</button>
              <a className="secondary compact" href="https://chatgpt.com/" target="_blank" rel="noreferrer">Abrir ChatGPT ↗</a>
            </div>
          </div>

          <div className="standard-card">
            <div className="mini-preview">
              <span>{selected?.icon}</span>
              <strong>{form.name}</strong>
              <small>{formatDate(form.date)}</small>
            </div>
            <div><h3>Prefere manter o padrão?</h3><p>Sem problema. O convite já fica pronto e elegante sem nenhuma edição.</p></div>
          </div>

          <button className="primary" onClick={next}>Continuar com este convite</button>
        </section>
      )}

      {step === 4 && (
        <section className="stage">
          <button className="back" onClick={back}>← Voltar</button>
          <div className="eyebrow">Interatividade</div>
          <h1>O que seus convidados poderão fazer?</h1>
          <p className="lead">Ative apenas os recursos que combinam com sua comemoração. Você poderá alterar isso depois.</p>

          <div className="feature-grid">
            {featureOptions.map((item) => {
              const active = features.includes(item.id);
              return (
                <button key={item.id} className={`feature-card ${active ? 'active' : ''}`} onClick={() => toggleFeature(item.id)}>
                  <span className="feature-icon">{item.icon}</span>
                  <span><strong>{item.title}</strong><small>{item.detail}</small></span>
                  <span className="switch"><i /></span>
                </button>
              );
            })}
          </div>
          <button className="primary" onClick={next}>Ver meu convite</button>
        </section>
      )}

      {step === 5 && (
        <section className="stage preview-stage">
          <button className="back" onClick={back}>← Voltar</button>
          <div className="eyebrow">Prévia</div>
          <h1>Seu convite está tomando forma 🎉</h1>
          <p className="lead">Esta é a primeira prévia do que seus convidados verão.</p>

          <div className="phone-wrap">
            <div className="phone">
              <div className="cover">
                <div className="cover-badge">{selected?.icon} {selected?.title}</div>
                <div className="cover-content">
                  <small>Você está convidado</small>
                  <h2>{form.name}</h2>
                  <p>{formatDate(form.date)} {form.time && `• ${form.time}`}</p>
                </div>
              </div>
              <div className="invite-body">
                {(form.place || form.city) && <div className="location-line">📍 <span>{form.place}{form.place && form.city ? ' · ' : ''}{form.city}</span></div>}
                <p className="welcome">Vai ser muito especial ter você com a gente.</p>
                <div className="guest-actions">
                  {featureOptions.filter((item) => features.includes(item.id)).map((item) => (
                    <button key={item.id}><span>{item.icon}</span>{item.title}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="publish-card">
            <div><strong>Próximo passo: publicar</strong><p>Depois de conectarmos o banco, esta ação criará um link exclusivo para cada convite.</p></div>
            <code>celebre.app/e/{(form.name || 'meu-convite').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-K7M4</code>
          </div>

          <button className="primary" onClick={sharePreview}>Compartilhar prévia</button>
          <button className="secondary" onClick={() => setStep(1)}>Criar outro convite</button>
        </section>
      )}
    </main>
  );
}
