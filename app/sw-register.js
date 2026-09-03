'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const configureServiceWorker = async () => {
      try {
        const pathname = window.location.pathname;

        // Remove o antigo registro global que controlava todo o domínio.
        const registrations = await navigator.serviceWorker.getRegistrations();

        await Promise.all(
          registrations
            .filter(registration => new URL(registration.scope).pathname === '/')
            .map(registration => registration.unregister())
        );

        // PWA do anfitrião
        if (pathname.startsWith('/anfitriao')) {
          await navigator.serviceWorker.register('/sw.js', {
            scope: '/anfitriao/'
          });
          return;
        }

        // Convites publicos usam web + APK, sem PWA proprio
      if (pathname.startsWith('/e/')) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          regs
            .filter(r => new URL(r.scope).pathname.startsWith('/e/'))
            .map(r => r.unregister())
        );
        return;
      }

    } catch (error) {
        console.error('Erro ao configurar Service Worker:', error);
      }
    };

    configureServiceWorker();
  }, []);

  return null;
}
