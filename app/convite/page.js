'use client';

import { useEffect, useState } from 'react';
import './convite.css';

export default function ConviteApp() {
  const [codigo, setCodigo] = useState('');

  const abrirConvite = (valor) => {
    if (!valor) return;

    window.location.assign(
      `/e/${encodeURIComponent(valor)}`
    );
  };

  useEffect(() => {
    const salvo =
      localStorage.getItem('celebra:last-invite') || '';

    setCodigo(salvo);

    const recebido = (event) => {
      const novoCodigo = event.detail?.codigo;

      if (novoCodigo) {
        setCodigo(novoCodigo);
      }
    };

    window.addEventListener(
      'celebra-convite-recebido',
      recebido
    );

    return () => {
      window.removeEventListener(
        'celebra-convite-recebido',
        recebido
      );
    };
  }, []);

  const abrir = () => {
    abrirConvite(codigo);
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

        <button
          type="button"
          onClick={abrir}
          disabled={!codigo}
        >
          <span>↗</span>
          Abrir meu convite
        </button>
      </div>
    </main>
  );
}
