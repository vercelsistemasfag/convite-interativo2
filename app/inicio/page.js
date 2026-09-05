'use client';

import './inicio.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function InicioPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHome() {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (!session || session.user?.is_anonymous) {
          router.replace('/anfitriao/login');
          return;
        }

        setUser(session.user);

        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('host_id', session.user.id)
          .order('created_at', { ascending: false });

        if (eventError) throw eventError;

        setEvents(eventData || []);
      } catch (err) {
        setError(err?.message || 'Não foi possível carregar seus convites.');
      } finally {
        setLoading(false);
      }
    }

    loadHome();
  }, [router]);

  if (loading) {
    return (
      <main className="host-home">
        <p className="home-status">Carregando seus convites...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="host-home">
        <p className="home-status">{error}</p>
      </main>
    );
  }

  const displayName =
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Anfitrião';

  return (
    <main className="host-home">
      <header className="home-header">
        <img src="/brand/celebra-logo-v2.png" alt="Celebra" />

        <div>
          <span>ÁREA DO ANFITRIÃO</span>
          <h1>Olá, {displayName}</h1>
          <p>Crie, acompanhe e compartilhe seus convites.</p>
        </div>
      </header>

      <section className="home-top-actions">
        <a href="/anfitriao" className="new-invite-button">
          + Criar novo convite
        </a>
      </section>

      <section className="home-section">
        <div className="home-section-title">
          <div>
            <span>MEUS EVENTOS</span>
            <h2>Seus convites</h2>
          </div>

          <strong>{events.length}</strong>
        </div>

        {events.length === 0 ? (
          <div className="home-empty">
            <h3>Seu primeiro convite começa aqui</h3>
            <p>Crie um convite interativo e acompanhe tudo pelo painel.</p>

            <a href="/anfitriao">Criar convite</a>
          </div>
        ) : (
          <div className="event-list">
            {events.map(event => (
              <article className="event-card" key={event.id}>
                <div className="event-info">
                  <span>{event.category || 'Evento'}</span>
                  <h3>{event.title || 'Convite sem título'}</h3>
                  <p>
                    {event.event_date
                      ? new Date(`${event.event_date}T12:00:00`).toLocaleDateString('pt-BR')
                      : 'Data não informada'}
                  </p>
                </div>

                <div className="event-actions">
                  <a href={`/e/${event.public_code}`}>Ver convite</a>
                  <a href={`/painel?id=${event.id}`}>Abrir painel</a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
