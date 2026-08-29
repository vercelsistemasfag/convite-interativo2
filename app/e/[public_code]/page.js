'use client';

import './public-invite.css';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

const backgroundFiles = [
  '/backgrounds/3931.png',
  '/backgrounds/3932.png',
  '/backgrounds/3933.png',
  '/backgrounds/3934.png',
  '/backgrounds/3935.png',
  '/backgrounds/3936.png'
];

const fonts = [
  'Bebas Neue',
  'Oswald',
  'Roboto Condensed',
  'Barlow Condensed',
  'Archivo Narrow',
  'Anton',
  'Fjalla One',
  'Amatic SC',
  'Pacifico',
  'Lobster',
  'Caveat',
  'Satisfy'
];

const featureMeta = {
  rsvp: { label: 'Confirmar presença', icon: '✓' },
  music: { label: 'Sugestão de músicas', icon: '♫' },
  gifts: { label: 'Lista de presentes', icon: '🎁' },
  collective: { label: 'Pix Presente', icon: '◇' },
  location: { label: 'Como chegar', icon: '⌖' },
  calendar: { label: 'Adicionar à agenda', icon: '▣' }
};

function formatDateBR(value) {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  return y && m && d ? `${d}/${m}/${y}` : value;
}


export default function PublicInvitePage() {
  const params = useParams();
  const publicCode = params?.public_code;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [opened, setOpened] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [dialog, setDialog] = useState('');
  const [guestName, setGuestName] = useState('');
  const [attendance, setAttendance] = useState('yes');
  const [companions, setCompanions] = useState('0');
  const [songs, setSongs] = useState(['', '', '']);

  useEffect(() => {
    if (!publicCode) return;

    async function loadEvent() {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('public_code', publicCode)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        console.error('Erro ao carregar convite:', error);
        setError('Convite não encontrado ou indisponível.');
        setLoading(false);
        return;
      }

      setEvent(data);
      setLoading(false);
    }

    loadEvent();
  }, [publicCode]);

  useEffect(() => {
    if (!event) return;
    const timer = setTimeout(() => setOpened(true), 2500);
    return () => clearTimeout(timer);
  }, [event]);

  const enabled = event?.enabled_features || [];

  const coverBackground = useMemo(() => {
    if (!event) return backgroundFiles[0];
    return backgroundFiles[event.background_index] || backgroundFiles[0];
  }, [event]);

  function textValue(item) {
    if (item?.text) return item.text;

    switch (item?.type) {
      case 'message': return event?.message || '';
      case 'title': return event?.title || '';
      case 'date': return formatDateBR(event?.event_date);
      case 'time': return event?.event_time?.slice(0, 5) || '';
      case 'place': return event?.place_name || '';
      case 'closing': return 'Celebra';
      default: return '';
    }
  }

  async function submitRsvp() {
    const name = guestName.trim();

    if (!name) {
      setDialog('Informe seu nome.');
      return;
    }

    const { error } = await supabase.from('rsvps').insert({
      event_id: event.id,
      guest_name: name,
      response: attendance === 'no' ? 'no' : 'yes',
      companions: Math.max(0, parseInt(companions || '0', 10) || 0)
    });

    if (error) {
      console.error(error);
      setDialog('Não foi possível registrar agora.');
      return;
    }

    setDialog('Confirmação registrada.');
    setActiveFeature(null);
    setGuestName('');
    setCompanions('0');
  }
  async function submitMusic() {
    const cleanSongs = songs.map(v => v.trim()).filter(Boolean);

    if (!cleanSongs.length) {
      setDialog('Informe pelo menos uma música.');
      return;
    }

    const { error } = await supabase.from('music_suggestions').insert({
      event_id: event.id,
      guest_name: guestName.trim() || null,
      songs: cleanSongs
    });

    if (error) {
      console.error(error);
      setDialog('Não foi possível registrar agora.');
      return;
    }

    setDialog('Sugestão registrada.');
    setActiveFeature(null);
    setSongs(['', '', '']);
  }

  function addSongField() {
    if (songs.length >= 10) return;
    setSongs(current => [...current, '']);
  }

  function openLocation() {
    const address = event?.full_address || event?.place_name || '';

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  async function copyPix() {
    if (!event?.pix_key) return;

    try {
      await navigator.clipboard.writeText(event.pix_key);
      setDialog('Chave Pix copiada.');
    } catch {
      setDialog(`Chave Pix: ${event.pix_key}`);
    }
  }

  function addCalendar() {
    const date = (event.event_date || '').replaceAll('-', '');
    const time = (event.event_time || '00:00').replace(':', '').slice(0, 4) + '00';
    const location = event.full_address || event.place_name || '';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${date}T${time}`,
      `SUMMARY:${event.title || 'Evento Celebra'}`,
      `LOCATION:${location}`,
      `DESCRIPTION:${event.message || ''}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'convite-celebra.ics';
    a.click();

    URL.revokeObjectURL(url);
  }

  function runFeature(id) {
    if (id === 'location') return openLocation();
    if (id === 'calendar') return addCalendar();

    setDialog('');
    setActiveFeature(id);
  }
  if (loading) {
    return <main className="public-state">Carregando convite...</main>;
  }

  if (error) {
    return <main className="public-state">{error}</main>;
  }

  return (
    <main className="public-invite-page">
      <div className={`book-shell ${opened ? 'is-open' : ''}`}>
        <section className="inside-page">
          <div className="inside-top">
            <span className="inside-star">✦</span>
            <h2>INTERAJA COM O CONVITE</h2>
            <p>Escolha uma opção</p>
          </div>

          <div className="feature-grid">
            {enabled.map(id => {
              const meta = featureMeta[id];
              if (!meta) return null;

              return (
                <button
                  key={id}
                  className="feature-card"
                  onClick={() => runFeature(id)}
                >
                  <span className="feature-icon">{meta.icon}</span>
                  <strong>{meta.label}</strong>
                </button>
              );
            })}
          </div>

          <div className="inside-brand">Celebra</div>

          <button className="close-book" onClick={() => setOpened(false)}>
            ‹
          </button>
        </section>

        <section
          className="cover-page"
          onClick={() => setOpened(true)}
          style={{
            backgroundImage: `url("${coverBackground}")`,
            color: event.font_color || '#f4e7d7',
            fontFamily: fonts[event.font_index] || fonts[0]
          }}
        >
          {(event.floating_texts || [])
            .filter(item => item.visible !== false)
            .map(item => {
              const value = textValue(item);
              if (!value) return null;

              return (
                <div
                  key={item.id}
                  className={`cover-text cover-text-${item.type}`}
                  style={{
                    left: `${item.x ?? 50}%`,
                    top: `${item.y ?? 50}%`,
                    fontSize: `${item.size ?? 18}px`
                  }}
                >
                  {value}
                </div>
              );
            })}

          {(event.floating_elements || [])
            .filter(item => item.visible !== false)
            .map(item => (
              <div
                key={item.id}
                className="cover-floating-element"
                style={{
                  left: `${item.x ?? 50}%`,
                  top: `${item.y ?? 50}%`,
                  fontSize: `${item.size ?? 32}px`
                }}
              >
                {item.glyph}
              </div>
            ))}

          {!opened && (
            <div className="tap-open">
              <span>⌃</span>
              <small>TOQUE PARA ABRIR</small>
            </div>
          )}
        </section>
      </div>
      {activeFeature === 'rsvp' && (
        <div className="feature-modal">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setActiveFeature(null)}>×</button>
            <h3>Confirmar presença</h3>

            <input
              placeholder="Seu nome"
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
            />

            <div className="choice-row">
              <button
                className={attendance === 'yes' ? 'selected' : ''}
                onClick={() => setAttendance('yes')}
              >
                Vou participar
              </button>

              <button
                className={attendance === 'no' ? 'selected' : ''}
                onClick={() => setAttendance('no')}
              >
                Não vou
              </button>
            </div>

            {attendance === 'yes' && (
              <input
                type="number"
                min="0"
                placeholder="Acompanhantes"
                value={companions}
                onChange={e => setCompanions(e.target.value)}
              />
            )}

            <button className="primary-modal" onClick={submitRsvp}>
              Confirmar
            </button>
          </div>
        </div>
      )}

      {activeFeature === 'music' && (
        <div className="feature-modal">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setActiveFeature(null)}>×</button>
            <h3>Sugestão de músicas</h3>

            <input
              placeholder="Seu nome (opcional)"
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
            />

            {songs.map((song, index) => (
              <input
                key={index}
                placeholder={`Música ${index + 1}`}
                value={song}
                onChange={e =>
                  setSongs(current =>
                    current.map((v, i) => i === index ? e.target.value : v)
                  )
                }
              />
            ))}

            <button className="add-line" onClick={addSongField}>
              + Adicionar outra música
            </button>

            <button className="primary-modal" onClick={submitMusic}>
              Enviar sugestão
            </button>
          </div>
        </div>
      )}

      {activeFeature === 'gifts' && (
        <div className="feature-modal">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setActiveFeature(null)}>×</button>
            <h3>Lista de presentes</h3>
            <p className="modal-help">Sugestões escolhidas pelo anfitrião:</p>

            <div className="gift-list">
              {(event.gift_items || []).map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeFeature === 'collective' && (
        <div className="feature-modal">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setActiveFeature(null)}>×</button>
            <h3>Pix Presente</h3>
            <p className="modal-help">Envie seu presente diretamente ao anfitrião.</p>

            {event.pix_receiver_name && (
              <div className="pix-row">
                <span>Recebedor</span>
                <strong>{event.pix_receiver_name}</strong>
              </div>
            )}

            <div className="pix-key">{event.pix_key}</div>

            <button className="primary-modal" onClick={copyPix}>
              Copiar chave Pix
            </button>
          </div>
        </div>
      )}

      {dialog && (
        <div className="message-dialog" onClick={() => setDialog('')}>
          <div onClick={e => e.stopPropagation()}>
            <button onClick={() => setDialog('')}>×</button>
            {dialog}
          </div>
        </div>
      )}
    </main>
  );
}
