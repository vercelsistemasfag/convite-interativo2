'use client';

import { useEffect } from 'react';
import { App } from '@capacitor/app';

export default function DeepLinkHandler() {
  useEffect(() => {
    const salvarConvite = (url) => {
      if (!url || !url.startsWith('celebra://convite/')) return;

      const codigo = url
        .replace('celebra://convite/', '')
        .split(/[?#]/)[0];

      if (!codigo) return;

      localStorage.setItem('celebra:last-invite', codigo);

      window.dispatchEvent(
        new CustomEvent('celebra-convite-recebido', {
          detail: { codigo }
        })
      );
    };

    App.getLaunchUrl()
      .then((launch) => {
        if (launch?.url) salvarConvite(launch.url);
      })
      .catch(() => {});

    let handle;

    App.addListener('appUrlOpen', ({ url }) => {
      salvarConvite(url);
    }).then((h) => {
      handle = h;
    });

    return () => {
      if (handle) handle.remove();
    };
  }, []);

  return null;
}
