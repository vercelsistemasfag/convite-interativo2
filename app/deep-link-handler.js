'use client';

import { useEffect } from 'react';
import { App } from '@capacitor/app';

export default function DeepLinkHandler() {
  useEffect(() => {
    const receberConvite = (url) => {
      if (!url || !url.startsWith('celebra://convite/')) return false;

      const codigo = url
        .replace('celebra://convite/', '')
        .split(/[?#]/)[0];

      if (!codigo) return false;

      localStorage.setItem('celebra:last-invite', codigo);
      localStorage.setItem('celebra:auto-open', '1');

      window.location.replace('/convite');
      return true;
    };

    let ativo = true;

    const iniciar = async () => {
      const launch = await App.getLaunchUrl();

      if (ativo && launch?.url) {
        receberConvite(launch.url);
      }
    };

    iniciar();

    const listener = App.addListener('appUrlOpen', ({ url }) => {
      if (ativo) receberConvite(url);
    });

    return () => {
      ativo = false;
      listener.then((handle) => handle.remove());
    };
  }, []);

  return null;
}
