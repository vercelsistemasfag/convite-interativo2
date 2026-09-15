'use client';
import { supabase } from '../lib/supabase';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

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

const backgroundCategories = {
  infantil: {
    label: 'Infantil',
    names: [
      'Diversão',
      'Aventura',
      'Festa Colorida',
      'Mundo Encantado',
      'Brincadeira',
      'Alegria',
    ],
    images: [
      '/backgrounds/infantil/1.png',
      '/backgrounds/infantil/2.png',
      '/backgrounds/infantil/3.png',
      '/backgrounds/infantil/4.png',
      '/backgrounds/infantil/5.png',
      '/backgrounds/infantil/6.png',
    ],
  },
  quinzeAnos: {
    label: 'Aniversário 15 Anos',
    names: [
      'Clássico',
      'Romântico',
      'Moderno',
      'Elegante',
      'Dourado',
      'Delicado',
    ],
    images: [
      '/backgrounds/aniversario-15-anos/1.png',
      '/backgrounds/aniversario-15-anos/2.png',
      '/backgrounds/aniversario-15-anos/3.png',
      '/backgrounds/aniversario-15-anos/4.png',
      '/backgrounds/aniversario-15-anos/5.png',
      '/backgrounds/aniversario-15-anos/6.png',
    ],
  },
  times: {
    label: 'Times de Futebol',
    names: [
      'São Paulo',
      'Internacional',
      'Grêmio',
      'Palmeiras',
      'Flamengo',
      'Corinthians',
    ],
    images: [
      '/backgrounds/times-futebol/1.png',
      '/backgrounds/times-futebol/2.png',
      '/backgrounds/times-futebol/3.png',
      '/backgrounds/times-futebol/4.png',
      '/backgrounds/times-futebol/5.png',
      '/backgrounds/times-futebol/6.png',
    ],
  },
  roblox: {
    label: 'Roblox',
    names: [
      'Roblox 1',
      'Roblox 2',
      'Roblox 3',
      'Roblox 4',
      'Roblox 5',
      'Roblox 6',
    ],
    images: [
      '/backgrounds/roblox/1.png',
      '/backgrounds/roblox/2.png',
      '/backgrounds/roblox/3.png',
      '/backgrounds/roblox/4.png',
      '/backgrounds/roblox/5.png',
      '/backgrounds/roblox/6.png',
    ],
  },
  classicos: {
    label: 'Clássicos',
    images: backgrounds,
  },
};

const features = [
  ['rsvp', 'Confirmar presença'],
  ['music', 'Sugestão de músicas'],
  ['gifts', 'Lista de presentes'],
  ['collective', 'Pix Presente'],
  ['location', 'Como chegar'],
  ['calendar', 'Compartilhar convite'],
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

function FeatureIcon({ type }) {
  const common = { viewBox:'0 0 24 24', 'aria-hidden':'true' };
  if (type === 'rsvp') return <svg {...common}><path d="M8 12.5l2.4 2.4L16 9.3"/><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/></svg>;
  if (type === 'music') return <svg {...common}><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>;
  if (type === 'gifts') return <svg {...common}><path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13"/><path d="M12 7H8.5A2.5 2.5 0 1 1 11 4.5V7zm0 0h3.5A2.5 2.5 0 1 0 13 4.5V7z"/></svg>;
  if (type === 'collective') return <svg {...common}><path d="M5 9h14v10H5zM7 9V6h10v3"/><path d="M9 14h6M12 11v6"/></svg>;
  if (type === 'location') return <svg {...common}><path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11z"/><circle cx="12" cy="10" r="2"/></svg>;
  return <svg {...common}><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 9h16M8 13h3M8 16h6"/></svg>;
}

function BrandHeader({ compact = false }) {
  return <div className={`brand-header ${compact ? 'compact' : ''}`}>
    <img src="/brand/celebra-logo-v2.png" alt="Celebra Convite Interativo" />
  </div>;
}

function StepDots({n}) { return <div className="native-dots">{[1,2,3,4,5].map(x=><i key={x} className={x<=n?'on':''}></i>)}<span>{n}/5</span></div> }
function ControlTitle({icon,text}) { return <h3 className="control-title"><i>{icon}</i>{text}</h3> }
function MiniDialog({text,close}) { return <div className="mini-dialog" onClick={close}><div onClick={e=>e.stopPropagation()}><button onClick={close}>×</button><strong>{text}</strong></div></div> }

function GiftMoneyIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  <rect x="3" y="9" width="18" height="12" rx="2"/>
  <path d="M12 9v12M3 13h18"/>
  <path d="M12 9H7.5A2.5 2.5 0 1 1 10 6.5L12 9Zm0 0h4.5A2.5 2.5 0 1 0 14 6.5L12 9Z"/>
  <path d="M13.7 15.5c-.4-.45-1-.7-1.7-.7-.9 0-1.55.4-1.55 1s.65.9 1.55 1 1.55.35 1.55 1.05-.65 1.05-1.55 1.05c-.75 0-1.4-.25-1.85-.75M12 14v5.7"/>
</svg>
  );
}

const defaultInvite = {
  category: 'aniversario',
  details: { title: '', message: 'Vamos celebrar!', date: '', time: '', place: '' },
  floatingElements: [],
  floatingTexts: [],
  cover: 0,
  background: 0,
  color: 0,
  fontColor: '#f4e7d7',
  font: 0,
  decor: 0,
  enabled: features.map(([id]) => id),
  featureConfig: {
    gifts: { items: ['', '', ''] },
    collective: { pixKey: '', receiver: '' },
    location: { address: '' },
  },
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
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession();

      if (!data.session || data.session.user?.is_anonymous) {
        if (data.session?.user?.is_anonymous) {
          await supabase.auth.signOut();
        }

        router.replace('/anfitriao/login');
        return;
      }

      setAuthChecking(false);
    }

    checkAuth();
  }, [router]);

  const [step, setStep] = useState(0);
  const [showEditorGuide, setShowEditorGuide] = useState(false);
  const [invite, setInvite] = useState(defaultInvite);
  const [hydrated, setHydrated] = useState(false);
  const { category, details, cover, background = 0, color, fontColor = '#f4e7d7', font, floatingElements = [], floatingTexts = defaultInvite.floatingTexts, enabled, featureConfig = defaultInvite.featureConfig } = invite;
  const [aiCopied, setAiCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);
  const [configError, setConfigError] = useState('');
  const [guestForm, setGuestForm] = useState({ name:'', attendance:'yes', companions:'0', songs:['', '', ''] });
  const [customBg, setCustomBg] = useState('');
  const [activeEditorPanel, setActiveEditorPanel] = useState(null);
  const [activeBackgroundCategory, setActiveBackgroundCategory] = useState('infantil');
  const activeBackgrounds = backgroundCategories[activeBackgroundCategory].images;
  const pointerStart = useRef(null);
  const resizeStart = useRef(null);
  const previewRef = useRef(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const selectedTextId =
    typeof selectedObject === 'string' && selectedObject.startsWith('text:')
      ? selectedObject.slice(5)
      : '';
  const selectedText = floatingTexts.find((item) => item.id === selectedTextId);
  const selectedTextColor = selectedText?.color || fontColor;
  const selectedTextFont = selectedText?.font ?? font;

  function applySelectedTextColor(nextColor) {
    if (!selectedTextId) return;
    updateFloatingText(selectedTextId, { color: nextColor });
  }

  function applySelectedTextFont(nextFont) {
    if (!selectedTextId) return;
    updateFloatingText(selectedTextId, { font: nextFont });
  }
  const [publishedEvent, setPublishedEvent] = useState(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("celebra:published-event:v1");
      if (raw) setPublishedEvent(JSON.parse(raw));
    } catch {}
  }, []);

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
          featureConfig: {
            ...current.featureConfig,
            ...(parsed.featureConfig || {}),
            gifts: { ...current.featureConfig.gifts, ...(parsed.featureConfig?.gifts || {}), items: Array.isArray(parsed.featureConfig?.gifts?.items) ? parsed.featureConfig.gifts.items : current.featureConfig.gifts.items },
            collective: { ...current.featureConfig.collective, ...(parsed.featureConfig?.collective || {}) },
            location: { ...current.featureConfig.location, ...(parsed.featureConfig?.location || {}) },
          },
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
  const inviteLink = publishedEvent?.public_code ? (typeof window !== 'undefined' ? `${window.location.origin}/e/${publishedEvent.public_code}` : `/e/${publishedEvent.public_code}`) : '';
  const aiPrompt = `Quero criar uma arte para um convite digital.

A imagem deverá ter:
• formato vertical 9:16;
• tamanho exato de 1080 × 1920 px;
• alta resolução;
• composição adequada para tela de celular.

Não crie nenhuma imagem ainda.

Primeiro, converse comigo e aguarde minhas instruções sobre o tipo de comemoração, tema, cores, estilo, elementos e composição.

Depois eu vou escolher entre duas possibilidades:

1. Criar somente o fundo do convite, deixando espaço adequado para eu inserir textos posteriormente no Celebra.

2. Criar a arte completa, já incluindo os textos e informações que eu fornecer, como nome, data, horário, local e outras informações.

Não presuma qual opção eu quero e não gere uma arte aleatória.

Aguarde eu explicar exatamente como quero o convite antes de criar a imagem.`;

  function go(n) { setStep(Math.max(0, Math.min(3, n))); setInviteOpen(false); setDialog(null); setActiveEditorPanel(null); window?.scrollTo?.({ top: 0, behavior: 'smooth' }); }
  function patchInvite(patch) { setInvite((current) => ({ ...current, ...patch })); }
  function patchDetails(patch) { setInvite((current) => ({ ...current, details: { ...current.details, ...patch } })); }
  function toggleFeature(id) { setInvite((current) => ({ ...current, enabled: current.enabled.includes(id) ? current.enabled.filter((x) => x !== id) : [...current.enabled, id] })); setConfigError(''); }
  function patchFeatureConfig(id, patch) { setInvite(current => ({...current, featureConfig:{...current.featureConfig,[id]:{...(current.featureConfig?.[id]||{}),...patch}}})); setConfigError(''); }
  function featureConfigured(id) {
    if(id==='gifts') return Boolean((featureConfig.gifts?.items||[]).some(item=>item.trim()));
    if(id==='collective') return Boolean(featureConfig.collective?.pixKey?.trim() && featureConfig.collective?.receiver?.trim());
    if(id==='location') return Boolean(featureConfig.location?.address?.trim());
    return true;
  }
  async function finishResources(){
    const missing=enabled.filter((id)=>!featureConfigured(id));
    if(missing.length){
      setConfigError('Preencha os campos obrigatórios ou desative o recurso que não deseja usar.');
      return;
    }

    setConfigError('');

    try {
      let { data: sessionData } = await supabase.auth.getSession();
      let session = sessionData?.session;

      if (!session) {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
        session = data.session;
      }

      const publicCode =
        (crypto?.randomUUID?.() || Math.random().toString(36).slice(2))
          .replace(/-/g, '')
          .slice(0, 12);

      const gifts = (invite.featureConfig?.gifts?.items || [])
        .map(item => String(item || '').trim())
        .filter(Boolean);

      const payload = {
        host_id: session.user.id,
        public_code: publicCode,
        status: 'published',
        category: invite.category,
        title: invite.details?.title || '',
        message: invite.details?.message || '',
        event_date: invite.details?.date || null,
        event_time: invite.details?.time || null,
        place_name: invite.details?.place || '',
        full_address: invite.featureConfig?.location?.address || '',
        cover_index: invite.cover || 0,
        background_index: invite.background || 0,
      custom_background_url: invite.customBackground || customBg || null,
        font_color: invite.fontColor || '#f4e7d7',
        font_index: invite.font || 0,
        decor_index: invite.decor || 0,
        floating_texts: invite.floatingTexts || [],
        floating_elements: invite.floatingElements || [],
        enabled_features: invite.enabled || [],
        pix_key: invite.featureConfig?.collective?.pixKey || null,
        pix_receiver_name: invite.featureConfig?.collective?.receiver || null,
        gift_items: gifts,
        published_at: new Date().toISOString()
      };

      const { data: event, error } = await supabase
        .from('events')
        .insert(payload)
        .select('id, public_code')
        .single();

      if (error) throw error;

      localStorage.setItem(
        'celebra:published-event:v1',
        JSON.stringify(event)
      );
      setPublishedEvent(event);
        router.push(`/painel?id=${event.id}`);

      setStep(3);
    } catch (error) {
      console.error('Erro ao publicar convite:', error);
      setConfigError(
        `Não foi possível publicar: ${
          error?.message || error?.details || error?.code || 'erro desconhecido'
        }`
      );
    }
  }

  async function uploadCustomBackground(file) {
    if (!file) return;

    try {
      const ext = file.name?.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from('invite-backgrounds')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from('invite-backgrounds')
        .getPublicUrl(fileName);

      const url = data.publicUrl;

      setCustomBg(url);
      setInvite(current => ({
        ...current,
        customBackground: url
      }));
    } catch (error) {
      console.error('Erro ao enviar fundo:', error);
      setConfigError('Não foi possível enviar a imagem. Tente novamente.');
    }
  }

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
    setInvite((current) => {
      const defaults = defaultInvite.floatingTexts || [];
      const currentTexts = Array.isArray(current.floatingTexts)
        ? current.floatingTexts
        : defaults;

      const textExists = currentTexts.some((item) => item.id === id);

      if (textExists) {
        return {
          ...current,
          floatingTexts: currentTexts.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          ),
        };
      }

      const defaultText = defaults.find((item) => item.id === id);

      return {
        ...current,
        floatingTexts: [
          ...currentTexts,
          {
            ...(defaultText || {
              id,
              x: 50,
              y: 50,
              size: 24,
              visible: true,
            }),
            ...patch,
          },
        ],
      };
    });
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
  function FloatingObject({kind,item,children,style={},className=''}){
    if(item.visible===false)return null;
    const selected=selectedObject===`${kind}:${item.id}`;
    return <div className={`floating-object ${kind==='text'?'floating-text':'floating-decor'} ${selected?'selected':''} ${className}`} style={{...style,left:`${item.x}%`,top:`${item.y}%`,fontSize:`${item.size}px`,color:kind==='text'?(item.color||fontColor):undefined,transform:`translate(-50%,-50%)`}} onPointerDown={e=>startObjectGesture(e,kind,item.id)} onPointerMove={e=>moveObjectGesture(e,kind,item.id)} onPointerUp={endObjectGesture} onPointerCancel={endObjectGesture}>
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
  function downloadCalendar(){
    const start=(details.date||'2025-07-20').replaceAll('-','')+'T'+(details.time||'19:00').replace(':','')+'00';
    const ics=`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${start}\nSUMMARY:${previewTitle}\nLOCATION:${featureConfig.location?.address||previewPlace}\nDESCRIPTION:Convite Celebra\nEND:VEVENT\nEND:VCALENDAR`;
    const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'}), url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url;a.download='convite-celebra.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),500);
  }
  function openFeature(id) {
    if(id==='location' && featureConfig.location?.address){ window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(featureConfig.location.address)}`,'_blank','noopener,noreferrer'); return; }
    if(id==='calendar'){ window.alert('No convite publicado, este botão abrirá as opções de compartilhamento do celular.'); return; }
    setActiveFeature(id); setDialog(null);
  }
  async function copyPix(){ const ok=await copyText(featureConfig.collective?.pixKey||''); if(ok)setDialog('Chave Pix copiada.'); }
  async function saveGuestAction(kind){
    try {
      const publishedRaw = localStorage.getItem('celebra:published-event:v1');
      const publishedEvent = publishedRaw ? JSON.parse(publishedRaw) : null;

      if (!publishedEvent?.id) {
        setDialog('Não foi possível identificar este convite.');
        return;
      }

      if (kind === 'rsvp') {
        const guestName = String(guestForm.name || '').trim();
        if (!guestName) {
          setDialog('Informe seu nome para confirmar presença.');
          return;
        }

        const { error } = await supabase
          .from('rsvps')
          .insert({
            event_id: publishedEvent.id,
            guest_name: guestName,
            response: guestForm.attendance === 'no' ? 'no' : 'yes',
            companions: Math.max(0, Number.parseInt(guestForm.companions || '0', 10) || 0)
          });

        if (error) throw error;

        setDialog('Confirmação registrada.');
        setGuestForm(v => ({ ...v, name: '', attendance: 'yes', companions: '0' }));
        return;
      }

      if (kind === 'music') {
        const guestName = String(guestForm.name || '').trim();
        const songs = (guestForm.songs || [])
          .map(song => String(song || '').trim())
          .filter(Boolean);

        if (!songs.length) {
          setDialog('Informe pelo menos uma música.');
          return;
        }

        const { error } = await supabase
          .from('music_suggestions')
          .insert({
            event_id: publishedEvent.id,
            guest_name: guestName || null,
            songs
          });

        if (error) throw error;

        setDialog('Sugestão registrada.');
        setGuestForm(v => ({ ...v, songs: ['', '', ''] }));
      }
    } catch (error) {
      console.error('Erro ao registrar ação do convidado:', error);
      setDialog('Não foi possível registrar agora. Tente novamente.');
    }
  }

  function backendEventPayload(){ return {event:{id:'convite-demo',category,title:previewTitle,message:previewMessage,date:details.date,time:details.time,place:previewPlace,enabled_features:enabled,feature_config:featureConfig,design:{background,font,fontColor,color,floatingTexts,floatingElements}},tables:{rsvps:['event_id','name','attendance','companions','created_at'],music_suggestions:['event_id','name','songs','created_at']}}; }


  if (authChecking) {
    return (
      <main className="auth-loading">
        <img src="/brand/celebra-logo-v2.png" alt="Celebra" />
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main className="prototype-shell">
      {step === 0 && <section className="html-screen home-html" aria-label="Tela inicial do Celebra">
        <BrandHeader />
        <a href="/anfitriao/inicio" className="back-invites-button">← Voltar para meus convites</a>
        <div className="home-question">O que vamos<br/>comemorar <span>hoje?</span></div>
        <div className="category-grid">
          {categories.map((cat) => <button key={cat.id} className="category-card" style={{'--cat': cat.color}} onClick={() => { setInvite((current) => ({ ...current, category: cat.id, details: { ...current.details, sub: '' } })); setShowEditorGuide(true); }}>
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
          <div ref={previewRef} className={`preview-card editor-live font-preview-${font}`} onPointerDown={(e)=>{if(e.target===e.currentTarget)setSelectedObject(null)}} style={{...previewStyle, backgroundImage:`linear-gradient(rgba(20,8,16,.12),rgba(20,8,16,.12)), url(${invite.customBackground || customBg || backgrounds[background]})`}}>
            {floatingTexts.map(el=><FloatingObject key={el.id} kind="text" item={el} className={`font-preview-${el.font ?? font}`}>{textValue(el)}</FloatingObject>)}
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
            <label className="field-block"><span><b>Título do evento</b></span><div className="field-apply-row"><input placeholder="Ex.: Aniversário da Mariana" value={details.title} onChange={(e)=>patchDetails({title:e.target.value})}/><button type="button" onClick={()=>applyTextAgain('title',details.title||selectedCategory.label)}>Aplicar texto</button></div></label>
            <label className="field-block"><span><b>Frase do convite</b></span><div className="field-apply-row"><input placeholder="Ex.: Vamos celebrar!" value={details.message || ''} onChange={(e)=>patchDetails({message:e.target.value})}/><button type="button" onClick={()=>applyTextAgain('message',details.message||'Vamos celebrar!')}>Aplicar texto</button></div></label>
            <div className="form-row"><label className="field-block"><span><b>Data</b></span><div className="field-apply-row"><input type="date" value={details.date} onChange={(e)=>patchDetails({date:e.target.value})}/><button type="button" onClick={()=>applyTextAgain('date',`▣ ${formatDateBR(details.date)}`)}>Aplicar texto</button></div></label><label className="field-block"><span><b>Horário</b></span><div className="field-apply-row"><input type="time" value={details.time} onChange={(e)=>patchDetails({time:e.target.value})}/><button type="button" onClick={()=>applyTextAgain('time',`◷ ${details.time||'19:00'}`)}>Aplicar texto</button></div></label></div>
            <label className="field-block"><span><b>Local</b></span><div className="field-apply-row"><input placeholder="Ex.: Salão de Festas" value={details.place} onChange={(e)=>patchDetails({place:e.target.value})}/><button type="button" onClick={()=>applyTextAgain('place',`⌖ ${details.place||'Salão de Festas'}`)}>Aplicar texto</button></div></label>
          </div>}

          {activeEditorPanel === 'fundos' && <div className="editor-section editor-section-active"><ControlTitle icon="▧" text="Fundos do convite"/><div className="background-category-tabs">
  {Object.entries(backgroundCategories).map(([id, category]) => (
    <button
      type="button"
      key={id}
      className={activeBackgroundCategory === id ? 'active' : ''}
      onClick={() => setActiveBackgroundCategory(id)}
    >
      {category.label}
    </button>
  ))}
</div>
<div className="background-grid">
  {activeBackgrounds.map((src, i) => {
    const isClassic = activeBackgroundCategory === 'classicos';
    const isSelected = isClassic
      ? background === i && !invite.customBackground && !customBg
      : invite.customBackground === src || customBg === src;

    return (
      <button
        type="button"
        key={src}
        className={isSelected ? 'selected' : ''}
        onClick={() => {
          setCustomBg('');
          if (isClassic) {
            patchInvite({
              background: i,
              cover: i,
              customBackground: '',
            });
          } else {
            patchInvite({
              background: i,
              cover: i,
              customBackground: src,
            });
          }
        }}
      >
        <img
          src={src}
          alt={`${backgroundCategories[activeBackgroundCategory].label} ${i + 1}`}
        />
        <span>
          {isClassic
            ? covers[i]
            : backgroundCategories[activeBackgroundCategory].names[i]}
        </span>
      </button>
    );
  })}
</div>
            <label className="upload-wide">＋ Enviar minha imagem<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e)=>{const f=e.target.files?.[0];if(f){uploadCustomBackground(f)}}}/></label>
          </div>}

          {activeEditorPanel === 'fontes' && <div className="editor-section editor-section-active"><ControlTitle icon="Aa" text="Fontes compactas"/><p className="section-hint">{selectedTextId
    ? 'Escolha a fonte somente para o texto selecionado.'
    : 'Toque primeiro no texto que deseja alterar na prévia.'}</p><div className="font-choice-list">{[['Bebas Neue','VAMOS CELEBRAR!'],['Oswald','Vamos celebrar!'],['Roboto Condensed','Vamos celebrar!'],['Barlow Condensed','Vamos celebrar!'],['Archivo Narrow','Vamos celebrar!'],['Anton','VAMOS CELEBRAR!'],['Fjalla One','Vamos celebrar!'],['Amatic SC','VAMOS CELEBRAR!'],['Pacifico','Vamos celebrar!'],['Lobster','Vamos celebrar!'],['Caveat','Vamos celebrar!'],['Satisfy','Vamos celebrar!']].map(([x,sample],i)=><button key={x} className={`font-sample font-preview-${i} ${Number(selectedTextFont)===i?'selected':''}`} disabled={!selectedTextId} onClick={()=>applySelectedTextFont(i)}><span>{sample}</span><small>{x}</small></button>)}</div></div>}
          {activeEditorPanel === 'cores' && <div className="editor-section editor-section-active">
            <ControlTitle icon="◉" text="Cores do texto"/>
            <div className="color-control-group"><strong>Cor do texto selecionado</strong><p>{selectedTextId ? 'Escolha uma cor diferente para este texto.' : 'Toque primeiro no texto que deseja alterar na prévia.'}</p><div className="color-row font-color-row">{['#ffffff','#f4e7d7','#e7bd6a','#6a0735','#17345f','#231f20','#ff654e'].map((c,i)=><button aria-label={`Cor da fonte ${i+1}`} key={c} style={{background:c}} className={selectedTextColor.toLowerCase()===c?'selected':''} disabled={!selectedTextId} onClick={()=>applySelectedTextColor(c)}/>)}</div><label className="custom-color-picker"><span>Escolher outra cor</span><input type="color" value={selectedTextColor} disabled={!selectedTextId} onChange={(e)=>applySelectedTextColor(e.target.value)}/><b style={{background:selectedTextColor}}></b></label></div>
            <div className="color-control-group accent-group"><strong>Cor de destaque</strong><p>Usada em bordas e detalhes decorativos.</p><div className="color-row">{['#6a0735','#ff654e','#c78c2a','#17345f','#638b7b','#9c739b'].map((c,i)=><button aria-label={`Cor de destaque ${i+1}`} key={c} style={{background:c}} className={color===i?'selected':''} onClick={()=>patchInvite({color:i})}/>)}</div></div>
          </div>}
          {activeEditorPanel === 'elementos' && <div className="editor-section editor-section-active"><ControlTitle icon="✦" text="Elementos flutuantes"/><p className="section-hint">Toque para adicionar. Na arte, toque no ícone para selecionar, arraste a caixa para mover e use a seta no canto para redimensionar.</p><div className="element-catalog">{elementCatalog.map(([type,glyph,label])=><button key={type} onClick={()=>addFloatingElement(type,glyph)}><b>{glyph}</b><span>{label}</span></button>)}</div></div>}
        </div>

        <div className="ai-panel ai-panel-v9"><div><strong>✨ Personalização com IA</strong><small>Opcional</small></div><p>Quer criar sua arte com o ChatGPT? Copie o briefing e continue a conversa por lá. Você pode pedir somente o fundo ou o convite completo, já com os textos.</p><div className="ai-steps ai-two"><button onClick={handleAiCopy}><b>1</b><strong>{aiCopied?'Briefing copiado ✓':'Clique aqui para copiar'}</strong><span>Leva o formato correto do Celebra.</span></button><a href="https://chatgpt.com/" target="_blank" rel="noreferrer"><b>2</b><strong>Clique aqui para abrir o ChatGPT</strong><span>Cole o comando e peça sua imagem.</span></a></div><p className="ai-flow-note">Após gerar seu convite no ChatGPT, baixe para sua galeria e use o botão <strong>Enviar minha imagem</strong> na seção <strong>Fundos</strong> aqui do editor.</p></div>
        <div className="nav-actions"><button onClick={()=>go(0)}>← Voltar</button><button className="next" onClick={()=>go(2)}>Continuar →</button></div><StepDots n={2}/>
      </section>}

      {step === 2 && <section className="html-screen native-page resources-page">
        <button className="back-button" onClick={() => go(1)}>‹</button><BrandHeader compact /><h1>O que seus convidados<br/>poderão fazer</h1><div className="gold-divider"><span></span><b>◆</b><span></span></div><p className="page-subtitle">Ative somente os recursos que quiser oferecer.</p>
        <div className="feature-list">{features.map(([id,label])=>{
          const on=enabled.includes(id), needs=['gifts','collective','location'].includes(id), ready=featureConfigured(id);
          const descriptions={rsvp:'Confirmações organizadas no painel do anfitrião.',music:'Sugestões reunidas no painel do anfitrião.',gifts:'Abra a lista de presentes escolhida.',collective:'Compartilhe os dados do Pix Presente com segurança.',location:'Abra a rota com o endereço completo.',calendar:'Abra as opções do celular para compartilhar o convite.'};
          return <div key={id} className={`feature-item ${on?'on':''}`}>
            <button type="button" className="feature-main" onClick={()=>toggleFeature(id)}><i>{id==='collective'?<GiftMoneyIcon/>:<FeatureIcon type={id}/>} </i><span><strong>{label}</strong><small>{descriptions[id]}</small></span><b>{on?'✓':''}</b></button>
            {on&&needs&&<div className="feature-config">
              {id==='gifts'&&<div className="manual-list-config"><span className="manual-list-title">Sugestões de presente <em>obrigatório</em></span><small>Digite pelo menos uma sugestão. Os convidados verão esta lista dentro do convite.</small>{(featureConfig.gifts?.items||['','','']).map((item,index)=><div className="manual-line" key={`gift-${index}`}><input placeholder={`Sugestão ${index+1}`} value={item} onChange={e=>{const items=[...(featureConfig.gifts?.items||['','',''])];items[index]=e.target.value;patchFeatureConfig('gifts',{items})}}/>{index===(featureConfig.gifts?.items||['','','']).length-1&&<button type="button" aria-label="Adicionar outra sugestão" onClick={()=>patchFeatureConfig('gifts',{items:[...(featureConfig.gifts?.items||['','','']),'']})}>＋</button>}</div>)}</div>}
              {id==='collective'&&<><label><span>Chave Pix <em>obrigatório</em></span><input placeholder="CPF, e-mail, telefone ou chave aleatória" value={featureConfig.collective?.pixKey||''} onChange={e=>patchFeatureConfig('collective',{pixKey:e.target.value})}/></label><label><span>Nome do recebedor <em>obrigatório</em></span><input placeholder="Nome que aparecerá para o convidado" value={featureConfig.collective?.receiver||''} onChange={e=>patchFeatureConfig('collective',{receiver:e.target.value})}/></label></>}
              {id==='location'&&<label><span>Endereço completo <em>obrigatório</em></span><input placeholder="Rua, número, bairro, cidade e estado" value={featureConfig.location?.address||''} onChange={e=>patchFeatureConfig('location',{address:e.target.value})}/></label>}
              <div className={`config-status ${ready?'ready':''}`}>{ready?'✓ Configurado':'Preencha para publicar'} <button type="button" onClick={()=>toggleFeature(id)}>Remover recurso</button></div>
            </div>}
          </div>;
        })}</div>
        {configError&&<div className="resource-warning">{configError}</div>}
        <div className="nav-actions"><button onClick={()=>go(1)}>← Voltar</button><button className="next" onClick={finishResources}>Finalizar →</button></div><StepDots n={3}/>
      </section>}

      {step === 3 && <section className="html-screen native-page publish-page">
        <button className="back-button" onClick={() => go(2)}>‹</button><BrandHeader compact /><h1>Seu convite está pronto!</h1><div className="gold-divider"><span></span><b>◆</b><span></span></div><p className="page-subtitle">Toque na capa para abrir. Dentro, seus convidados encontram tudo em uma única página.</p>
        <div className={`book-stage ${inviteOpen?'open':''}`}>
          <div className="book-page">
            <button type="button" className="book-close" aria-label="Fechar convite" onClick={()=>setInviteOpen(false)}>‹</button>
            <div className="book-page-head"><span>✦</span><img src="/brand/celebra-logo-v2.png" alt="Celebra" className="host-interaction-logo"/><strong className="host-interaction-title"><span>Interaja e</span><em>Participe!</em></strong><small>Escolha uma opção para continuar</small></div>
            <div className="book-actions">{features.filter(([id])=>enabled.includes(id)).map(([id,label])=><button type="button" key={id} onClick={()=>openFeature(id)}><i>{id==='collective'?<GiftMoneyIcon/>:<FeatureIcon type={id}/>} </i><span>{label}</span><b>›</b></button>)}</div>
            <div className="book-signature">Celebra <span>• convite interativo •</span></div>
          </div>
          <button type="button" className="book-cover" aria-label={inviteOpen?'Fechar convite':'Abrir convite'} onClick={()=>setInviteOpen(v=>!v)} style={{...previewStyle,backgroundImage:`linear-gradient(rgba(20,8,16,.12),rgba(20,8,16,.12)), url(${invite.customBackground || customBg || backgrounds[background]})`}}>
            {floatingTexts.filter(el=>el.visible!==false).map(el=><div key={el.id} className={`published-object published-text font-preview-${el.font ?? font}`} style={{left:`${el.x}%`,top:`${el.y}%`,fontSize:`${el.size}px`,color:el.color||fontColor,transform:`translate(-50%,-50%)`}}>{textValue(el)}</div>)}
            {floatingElements.map(el=><div key={el.id} className="published-object published-decor" style={{left:`${el.x}%`,top:`${el.y}%`,fontSize:`${el.size}px`,color:el.color||fontColor,transform:`translate(-50%,-50%)`}}>{el.glyph}</div>)}
            <span className="book-open-hint">Toque para abrir <b>›</b></span>
          </button>
        </div>
        <div className="share-box"><label>Link do convite</label><div><input readOnly value={inviteLink}/><button onClick={handleLinkCopy}>{linkCopied?'Copiado ✓':'Copiar'}</button></div><div className="share-buttons"><button onClick={()=>shareInvite('whatsapp')}>WhatsApp</button><button onClick={()=>shareInvite()}>Compartilhar</button></div></div>
        <div className="nav-actions"><button onClick={()=>go(1)}>← Editar convite</button><button className="next" onClick={()=>setInviteOpen(true)}>Ver convite →</button></div>
        {activeFeature==='rsvp'&&<div className="feature-dialog"><div><button className="dialog-x" onClick={()=>setActiveFeature(null)}>×</button><FeatureIcon type="rsvp"/><h3>Confirmar presença</h3><label>Seu nome<input value={guestForm.name} onChange={e=>setGuestForm(v=>({...v,name:e.target.value}))}/></label><div className="rsvp-choice"><button className={guestForm.attendance==='yes'?'on':''} onClick={()=>setGuestForm(v=>({...v,attendance:'yes'}))}>Vou participar</button><button className={guestForm.attendance==='no'?'on':''} onClick={()=>setGuestForm(v=>({...v,attendance:'no'}))}>Não vou</button></div><label>Acompanhantes<input type="number" min="0" max="20" value={guestForm.companions} onChange={e=>setGuestForm(v=>({...v,companions:e.target.value}))}/></label><button className="dialog-primary" onClick={()=>saveGuestAction('rsvp')}>Enviar confirmação</button></div></div>}
        {activeFeature==='music'&&<div className="feature-dialog"><div><button className="dialog-x" onClick={()=>setActiveFeature(null)}>×</button><FeatureIcon type="music"/><h3>Sugerir músicas</h3><label>Seu nome<input value={guestForm.name} onChange={e=>setGuestForm(v=>({...v,name:e.target.value}))}/></label><div className="guest-manual-list"><span>Digite suas sugestões</span><small>Preencha uma ou mais linhas.</small>{(guestForm.songs||['','','']).map((song,index)=><div className="manual-line" key={`song-${index}`}><input placeholder={`Música ou artista ${index+1}`} value={song} onChange={e=>setGuestForm(v=>{const songs=[...(v.songs||['','',''])];songs[index]=e.target.value;return {...v,songs}})}/>{index===(guestForm.songs||['','','']).length-1&&<button type="button" aria-label="Adicionar outra música" onClick={()=>setGuestForm(v=>({...v,songs:[...(v.songs||['','','']),'']}))}>＋</button>}</div>)}</div><button className="dialog-primary" onClick={()=>saveGuestAction('music')}>Enviar sugestões</button></div></div>}
        {activeFeature==='gifts'&&<div className="feature-dialog"><div><button className="dialog-x" onClick={()=>setActiveFeature(null)}>×</button><FeatureIcon type="gifts"/><h3>Lista de presentes</h3><p>Algumas sugestões escolhidas pelo anfitrião:</p><div className="gift-suggestion-list">{(featureConfig.gifts?.items||[]).filter(item=>item.trim()).map((item,index)=><div key={`published-gift-${index}`}><b>{index+1}</b><span>{item}</span></div>)}</div></div></div>}
        {activeFeature==='collective'&&<div className="feature-dialog"><div><button className="dialog-x" onClick={()=>setActiveFeature(null)}>×</button><FeatureIcon type="collective"/><h3>Pix Presente</h3><p>Envie seu presente diretamente para <strong>{featureConfig.collective?.receiver}</strong>.</p><div className="pix-key">{featureConfig.collective?.pixKey}</div><button className="dialog-primary" onClick={copyPix}>Copiar chave Pix</button></div></div>}
        {dialog&&<MiniDialog text={dialog} close={()=>setDialog(null)}/>} 
        <script type="application/json" id="celebra-backend-contract" dangerouslySetInnerHTML={{__html:JSON.stringify(backendEventPayload())}} />
      </section>}
    
      {showEditorGuide && (
        <div className="editor-guide-overlay">
          <div className="editor-guide-card">
            <h3>Antes de começar, olha só 👀</h3>

            <p>
              <strong>Quer montar tudo pelo Celebra?</strong><br />
              O convite começa mais livre para você decidir o que realmente quer usar.
              As ferramentas ficam <strong>logo abaixo do convite</strong> e aparecem
              recolhidas para deixar a tela mais limpa. É só tocar no botão da função
              que você quer editar para abrir as opções.
            </p>

            <div className="editor-guide-pointer">
              ↓ Toque nos botões abaixo da prévia para personalizar
            </div>

            <p>
              <strong>Prefere criar a arte com o ChatGPT? ✨</strong><br />
              Também dá! Copie o briefing que deixamos pronto. O ChatGPT vai receber
              o tamanho e o formato corretos e vai esperar você explicar como quer a arte.
              Você pode pedir apenas o fundo ou o convite completo, já com nome, data,
              horário, local e outros textos.
            </p>

            <p>
              Se a sua arte já vier completa, você não precisa repetir as informações
              usando os textos do Celebra. Use somente as ferramentas que fizerem sentido
              para o seu convite.
            </p>

            <button
              type="button"
              className="primary-modal"
              onClick={() => {
                setShowEditorGuide(false);
                go(1);
              }}
            >
              Entendi, vamos lá!
            </button>
          </div>
        </div>
      )}

</main>
  );
}
