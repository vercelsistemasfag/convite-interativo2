export async function GET(request, { params }) {
  const { public_code } = await params;

  const manifest = {
    name: 'Celebra Convite',
    short_name: 'Convite',
    id: `/e/${public_code}`,
    start_url: `/e/${public_code}`,
    scope: `/e/${public_code}`,
    display: 'standalone',
    background_color: '#f8f4f2',
    theme_color: '#5b143c',
    lang: 'pt-BR',
    description: 'Seu convite interativo Celebra.',
    categories: ['lifestyle', 'social'],
    icons: [
      { src: '/brand/celebra-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/brand/celebra-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
    ]
  };

  return Response.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json'
    }
  });
}
