import { createClient } from '@supabase/supabase-js';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://convite-interativo2.vercelsistemas.workers.dev';

export async function generateMetadata({ params }) {
  const { public_code } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  const { data: event } = await supabase
    .from('events')
    .select('title,message,category')
    .eq('public_code', public_code)
    .eq('status', 'published')
    .maybeSingle();

  const title = 'Clique e participe da festa!';

  const description =
    event?.message ||
    'Abra seu convite interativo e participe dessa celebração.';

  const imageUrl = `${SITE_URL}/convite-whatsapp.jpg?v=5`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    openGraph: {
      title,
      type: 'website',
      url: `${SITE_URL}/e/${public_code}`,
      siteName: 'Celebra • Convite Interativo',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      images: [imageUrl],
    },
  };
}

export default function InviteLayout({ children }) {
  return children;
}
