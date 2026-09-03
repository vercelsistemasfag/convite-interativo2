'use client';

import { useEffect } from 'react';
import { App } from '@capacitor/app';

export default function DeepLinkHandler() {
  useEffect(() => {
    const abrirConvite = (url) => {
      if (!url?.startsWith('celebra://convite/')) return;

      const codigo = url.replace('celebra://convite/', '').split(/[?#]/)[0];

      if (codigo) {
        window.location.href = `/e/${encodeURIComponent(codigo)}`;
      }
    };

    App.getLaunchUrl().then(({ url }) => abrirConvite(url));

    const listener = App.addListener('appUrlOpen', ({ url }) => {
      abrirConvite(url);
    });

    return () => {
      listener.then((handle) => handle.remove());
    };
  }, []);

  return null;
}
