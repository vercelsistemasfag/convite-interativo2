import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://convite-interativo2.vercelsistemas.workers.dev';

const backgrounds = [
  '/backgrounds/3931.png',
  '/backgrounds/3932.png',
  '/backgrounds/3933.png',
  '/backgrounds/3934.png',
  '/backgrounds/3935.png',
  '/backgrounds/3936.png',
];

export async function GET(request, { params }) {
  const { public_code } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  const { data: event } = await supabase
    .from('events')
    .select('title,message,event_date,event_time,place_name,background_index')
    .eq('public_code', public_code)
    .eq('status', 'published')
    .maybeSingle();

  const title = event?.title || 'Você está convidado!';
  const message = event?.message || '';

  const backgroundIndex = Math.max(
    0,
    Math.min(backgrounds.length - 1, Number(event?.background_index) || 0)
  );

  const backgroundUrl = `${SITE_URL}${backgrounds[backgroundIndex]}`;

  const details = [
    event?.event_date,
    event?.event_time,
    event?.place_name,
  ].filter(Boolean);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: '#f7f1e8',
          fontFamily: 'Arial',
        }}
      >
        <img
          src={backgroundUrl}
          width="354"
          height="630"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            height: '100%',
            width: 'auto',
            objectFit: 'contain',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background:
              'linear-gradient(90deg, #fffaf5 0%, #fffaf5 56%, rgba(255,250,245,.92) 67%, rgba(255,250,245,.18) 82%, rgba(255,250,245,0) 100%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '62%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '62px 72px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '23px',
              fontWeight: 800,
              letterSpacing: '1.8px',
              color: '#c58b28',
              marginBottom: '22px',
            }}
          >
            CELEBRA • CONVITE INTERATIVO
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '64px',
              lineHeight: 1.02,
              fontWeight: 900,
              color: '#6a0735',
              marginBottom: '14px',
            }}
          >
            {title}
          </div>

          {message && (
            <div
              style={{
                display: 'flex',
                fontSize: '27px',
                lineHeight: 1.2,
                fontWeight: 700,
                color: '#b07b23',
                marginBottom: '22px',
              }}
            >
              {message}
            </div>
          )}

          {details.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                fontSize: '23px',
                lineHeight: 1.25,
                fontWeight: 700,
                color: '#54112f',
                marginBottom: '28px',
              }}
            >
              {details.map((item, index) => (
                <div key={index} style={{ display: 'flex' }}>
                  {index > 0 ? ' • ' : ''}
                  {item}
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              fontSize: '22px',
              fontWeight: 800,
              color: '#54112f',
            }}
          >
            ✨ Toque no convite para abrir
          </div>
        </div>
      </div>
    ),
    size
  );
}
