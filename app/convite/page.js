'use client';

import { useEffect, useState } from 'react';
import './convite.css';

export default function ConviteApp() {
  const [codigo, setCodigo] = useState('');

  useEffect(() => {
    const salvo = localStorage.getItem('celebra:last-invite') || '';
    setCodigo(salvo);

    const autoAbrir = localStorage.getItem('celebra:auto-open');

    if (salvo && autoAbrir === '1') {
      localStorage.removeItem('celebra:auto-open');

      window.location.href =
        `/e/${encodeURIComponent(salvo)}`;
    }
  }, []);

  const abrir = () => {
    if (codigo) {
      window.location.href =
        `/e/${encodeURIComponent(codigo)}`;
    }
  };

  return (
    <main className="convite-home">
      <div className="convite-brand">
        <img
          src="/brand/celebra-logo-v2.png"
          alt="Celebra Convite Interativo"
        />
      </div>

      <div className="convite-actions">
        {codigo && (
          <p>
            Abra o link do convite que você recebeu
            para vinculá-lo ao aplicativo.
          </p>
        )}

        <button onClick={abrir} disabled={!codigo}>
          <span>↗</span>
          Abrir meu convite
        </button>
      </div>
    </main>
  );
}
