'use client';

import { useEffect, useState } from 'react';
import './convite.css';

export default function ConviteApp() {
  const [codigo, setCodigo] = useState('');

  useEffect(() => {
    let timer;

    const abrirCodigo = (novoCodigo) => {
      if (!novoCodigo) return;

      setCodigo(novoCodigo);

      timer = setTimeout(() => {
        window.location.replace(
          `https://celebra-convite.vercelsistemas.workers.dev/e/${encodeURIComponent(novoCodigo)}`
        );
      }, 900);
    };

    const pendente = localStorage.getItem('celebra:pending-invite');
    const salvo = localStorage.getItem('celebra:last-invite');

    if (pendente) {
      localStorage.removeItem('celebra:pending-invite');
      abrirCodigo(pendente);
    } else if (salvo) {
      setCodigo(salvo);
    }

    const receberConvite = (event) => {
      localStorage.removeItem('celebra:pending-invite');
      abrirCodigo(event.detail);
    };

    window.addEventListener('celebra:open-invite', receberConvite);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('celebra:open-invite', receberConvite);
    };
  }, []);

  const abrir = () => {
    if (codigo) {
      window.location.replace(
        `https://celebra-convite.vercelsistemas.workers.dev/e/${encodeURIComponent(codigo)}`
      );
    }
  };

  return (
    <main className="convite-home">
      <div className="convite-brand">
        <img src="/brand/celebra-logo-v2.png" alt="Celebra Convite Interativo" />
      </div>

      <div className="convite-actions">
        {!codigo && (
          <p>Abra o link do convite que você recebeu para vinculá-lo ao aplicativo.</p>
        )}

        <button onClick={abrir} disabled={!codigo}>
          <span>✉</span>
          Abrir meu convite
        </button>
      </div>
    </main>
  );
}
