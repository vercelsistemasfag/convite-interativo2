'use client';

import { useEffect } from 'react';
import { App } from '@capacitor/app';

export default function DeepLinkHandler() {
  useEffect(() => {
    const abrirConvite = (url) => {
      if (!url?.startsWith('celebra://convite/')) return false;

      const codigo = url.replace('celebra://convite/', '').split(/[?#]/)[0];

      if (codigo) {
        localStorage.setItem("celebra:last-invite", codigo);
        window.location.replace(
          `https://celebra-convite.vercelsistemas.workers.dev/e/${encodeURIComponent(codigo)}`
        );
        return true;
      }

      return false;
    };

    let cancelled = false;

    const listener = App.addListener('appUrlOpen', ({ url }) => {
      abrirConvite(url);
    });

    const checkInitialUrl = async () => {
      const delays = [0, 250, 500, 1000, 1500];

      for (const delay of delays) {
        if (cancelled) return;

        if (delay) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        if (cancelled) return;

        const result = await App.getLaunchUrl();

        if (abrirConvite(result?.url)) {
          return;
        }
      }
    };

    checkInitialUrl();

    return () => {
      cancelled = true;
      listener.then((handle) => handle.remove());
    };
  }, []);

  return null;
}
