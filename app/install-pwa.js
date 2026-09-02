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

  if (!prompt || installed) return null;

  const install = async () => {
    await prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
  };

  return (
    <button type="button" className={className} onClick={install}>
      Instalar aplicativo
    </button>
  );
}
