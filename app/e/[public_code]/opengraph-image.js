import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }) {
  const { public_code } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  const { data: event } = await supabase
    .from('events')
    .select('title,message,event_date,event_time,place_name')
    .eq('public_code', public_code)
    .eq('status', 'published')
    .maybeSingle();

  const title = event?.title || 'Você está convidado!';
  const message = event?.message || 'Abra seu convite interativo e participe.';
  const details = [
    event?.event_date,
    event?.event_time,
    event?.place_name,
  ].filter(Boolean).join(' • ');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f7f1e8',
          padding: '54px',
          fontFamily: 'Arial',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '34px',
            background: '#fffaf5',
            border: '2px solid #ead9cf',
            padding: '54px 62px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 800,
              color: '#c58b28',
              letterSpacing: '2px',
            }}
          >
            CELEBRA • CONVITE INTERATIVO
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div
              style={{
                display: 'flex',
                fontSize: '66px',
                lineHeight: 1.05,
                fontWeight: 900,
                color: '#6a0735',
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: '30px',
                lineHeight: 1.25,
                color: '#6b5961',
              }}
            >
              {message}
            </div>

            {details && (
              <div
                style={{
                  display: 'flex',
                  marginTop: '10px',
                  fontSize: '25px',
                  fontWeight: 700,
                  color: '#54112f',
                }}
              >
                {details}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '25px',
              fontWeight: 800,
              color: '#6a0735',
            }}
          >
            Toque no convite para abrir ✨
          </div>
        </div>
      </div>
    ),
    size
  );
}
