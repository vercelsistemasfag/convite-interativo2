'use client';

import './painel.css';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function PainelPage() {
  const router = useRouter();
  const [eventId, setEventId] = useState(null);
  const [event, setEvent] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = new URLSearchParams(window.location.search).get('id');
    setEventId(id);
  }, []);

  useEffect(() => {
    async function loadPanel() {
      try {
        setLoading(true);
        setError('');

        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;

        if (!session || session.user?.is_anonymous) {
          router.replace('/login');
          return;
        }

        let eventQuery = supabase
          .from('events')
          .select('*')
          .eq('host_id', session.user.id);

        if (eventId) {
          eventQuery = eventQuery.eq('id', eventId);
        } else {
          eventQuery = eventQuery
            .order('created_at', { ascending: false })
            .limit(1);
        }

        const { data: eventData, error: eventError } = await eventQuery.maybeSingle();

        if (eventError) throw eventError;

        if (!eventData) {
          setError('Você ainda não possui convites publicados.');
          return;
        }

        const { data: rsvpData, error: rsvpError } = await supabase
          .from('rsvps')
          .select('*')
          .eq('event_id', eventData.id)
          .order('created_at', { ascending: false });

        if (rsvpError) throw rsvpError;

        const { data: musicData, error: musicError } = await supabase
          .from('music_suggestions')
          .select('*')
          .eq('event_id', eventData.id)
          .order('created_at', { ascending: false });

        if (musicError) throw musicError;

        setEvent(eventData);
        setRsvps(rsvpData || []);
        setMusic(musicData || []);
      } catch (err) {
        setError(err?.message || 'Não foi possível carregar o painel.');
      } finally {
        setLoading(false);
      }
    }

    loadPanel();
  }, [router, eventId]);

  const stats = useMemo(() => {
    const confirmed = rsvps.filter(item => item.response === 'yes');
    const declined = rsvps.filter(item => item.response === 'no');

    const people = confirmed.reduce(
      (total, item) => total + 1 + Number(item.companions || 0),
      0
    );

    const songs = music.reduce(
      (total, item) => total + (Array.isArray(item.songs) ? item.songs.length : 0),
      0
    );

    return {
      confirmed: confirmed.length,
      people,
      declined: declined.length,
      songs
    };
  }, [rsvps, music]);

  if (loading) {
    return <main className="host-panel"><p className="panel-status">Carregando painel...</p></main>;
  }

  if (error) {
    return <main className="host-panel"><p className="panel-status">{error}</p></main>;
  }

  const inviteUrl =
    event?.public_code && typeof window !== 'undefined'
      ? `${window.location.origin}/e/${event.public_code}`
      : '';

  return (
    <main className="host-panel">
      <header className="panel-header">
        <img src="/brand/celebra-logo-v2.png" alt="Celebra" />
        <div>
          <span>PAINEL DO ANFITRIÃO</span>
          <h1>{event?.title || 'Seu evento'}</h1>
          <p>Acompanhe as interações dos seus convidados.</p>
        </div>
      </header>

      <section className="panel-stats">
        <article>
          <strong>{stats.confirmed}</strong>
          <span>Confirmações</span>
        </article>

        <article>
          <strong>{stats.people}</strong>
          <span>Pessoas confirmadas</span>
        </article>

        <article>
          <strong>{stats.declined}</strong>
          <span>Não vão</span>
        </article>

        <article>
          <strong>{stats.songs}</strong>
          <span>Músicas sugeridas</span>
        </article>
      </section>

      <section className="panel-section">
        <div className="section-heading">
          <div>
            <span>LISTA DE CONVIDADOS</span>
            <h2>Confirmações de presença</h2>
          </div>
          <strong>{rsvps.length}</strong>
        </div>

        <div className="guest-list">
          {rsvps.length === 0 ? (
            <p className="empty-state">Ainda não há respostas dos convidados.</p>
          ) : (
            rsvps.map(item => (
              <article className="guest-row" key={item.id}>
                <div className="guest-avatar">
                  {(item.guest_name || '?').charAt(0).toUpperCase()}
                </div>

                <div className="guest-info">
                  <strong>{item.guest_name || 'Convidado'}</strong>
                  <span>
                    {Number(item.companions || 0) > 0
                      ? `+ ${item.companions} acompanhante${Number(item.companions) > 1 ? 's' : ''}`
                      : 'Sem acompanhantes'}
                  </span>
                </div>

                <span className={`guest-status ${item.response === 'yes' ? 'yes' : 'no'}`}>
                  {item.response === 'yes' ? 'Confirmado' : 'Não vai'}
                </span>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel-section">
        <div className="section-heading">
          <div>
            <span>PLAYLIST DA FESTA</span>
            <h2>Sugestões de músicas</h2>
          </div>
          <strong>{stats.songs}</strong>
        </div>

        <div className="music-list">
          {music.length === 0 ? (
            <p className="empty-state">Ainda não há músicas sugeridas.</p>
          ) : (
            music.map(item => (
              <article className="music-row" key={item.id}>
                <div className="music-guest">
                  <span>♫</span>
                  <strong>{item.guest_name || 'Convidado'}</strong>
                </div>

                <div className="music-tags">
                  {(Array.isArray(item.songs) ? item.songs : [])
                    .filter(Boolean)
                    .map((song, index) => (
                      <span key={`${item.id}-${index}`}>{song}</span>
                    ))}
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel-actions panel-share-actions">
        <a
          className="panel-primary panel-action-main"
          href={inviteUrl}
          target="_blank"
          rel="noreferrer"
        >
          <span className="panel-action-icon">↗</span>
          <span>
            <strong>Visualizar convite</strong>
            <small>Veja como o convidado receberá</small>
          </span>
        </a>

        <a
          className="panel-primary panel-action-main panel-whatsapp"
          href={`https://wa.me/?text=${encodeURIComponent(`Você está convidado! Abra seu convite Celebra: ${inviteUrl}`)}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="panel-action-icon">✆</span>
          <span>
            <strong>Compartilhar no WhatsApp</strong>
            <small>Envie o convite diretamente</small>
          </span>
        </a>

        <button
          type="button"
          className="panel-primary panel-action-main panel-copy"
          onClick={async () => {
            if (!inviteUrl) return;
            await navigator.clipboard.writeText(inviteUrl);
          }}
        >
          <span className="panel-action-icon">⧉</span>
          <span>
            <strong>Copiar link</strong>
            <small>Copie para compartilhar onde quiser</small>
          </span>
        </button>

        <a href="/" className="panel-edit">
          Editar convite
        </a>
      </section>
    </main>
  );
}
