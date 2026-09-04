'use client';

import { useEffect } from 'react';
import { App } from '@capacitor/app';

export default function DeepLinkHandler() {
  useEffect(() => {
    let ativo = true;
    let processado = false;

    const receberConvite = (url) => {
      if (
        processado ||
        !url ||
        !url.startsWith('celebra://convite/')
      ) {
        return false;
      }

      const codigo = url
        .replace('celebra://convite/', '')
        .split(/[?#]/)[0];

      if (!codigo) return false;

      processado = true;

      localStorage.setItem('celebra:last-invite', codigo);
      localStorage.setItem('celebra:auto-open', '1');

      window.location.replace('/convite');

      return true;
    };

    const iniciar = async () => {
      try {
        const launch = await App.getLaunchUrl();

        if (ativo && launch?.url) {
          receberConvite(launch.url);
        }
      } catch (e) {
        console.error('Erro ao ler deep link inicial:', e);
      }
    };

    iniciar();

    const listener = App.addListener(
      'appUrlOpen',
      ({ url }) => {
        if (ativo) receberConvite(url);
      }
    );

    return () => {
      ativo = false;
      listener.then((handle) => handle.remove());
    };
  }, []);

  return null;
}
