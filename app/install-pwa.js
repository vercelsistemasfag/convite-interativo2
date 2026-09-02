'use client';

import { useEffect, useState } from 'react';

export default function InstallPWA({ className = '' }) {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    const ready = (event) => {
      event.preventDefault();
      setPrompt(event);
    };

    const done = () => {
      setInstalled(true);
      setPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', ready);
    window.addEventListener('appinstalled', done);

    return () => {
      window.removeEventListener('beforeinstallprompt', ready);
      window.removeEventListener('appinstalled', done);
    };
  }, []);

  if (installed) return null;

  const install = async () => {
    if (prompt) {
      await prompt.prompt();
      await prompt.userChoice;
      setPrompt(null);
      return;
    }

    const regs = await navigator.serviceWorker.getRegistrations();
    const controller = navigator.serviceWorker.controller;
    alert(
      'DIAGNÓSTICO PWA\n\n' +
      'Controlador: ' + (controller?.scriptURL || 'NENHUM') + '\n' +
      'Registros: ' + (regs.length || 0) + '\n' +
      'Escopos: ' + (regs.map(r => r.scope).join(' | ') || 'NENHUM') + '\n' +
      'Prompt instalação: NÃO'
    );
  };

  return (
    <button type="button" className={className} onClick={install}>
      Instalar aplicativo
    </button>
  );
}
