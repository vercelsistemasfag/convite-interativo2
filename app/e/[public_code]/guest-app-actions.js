'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

export default function GuestAppActions({ publicCode }) {
  const [dialog, setDialog] = useState(null);
  const [environmentReady, setEnvironmentReady] = useState(false);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    setEnvironmentReady(true);
  }, []);

  const isIOS = () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const abrirAplicativo = () => {
    let appOpened = false;

    const onVisibility = () => {
      if (document.hidden) appOpened = true;
    };

    document.addEventListener('visibilitychange', onVisibility, { once: true });

    window.location.href = `celebra://convite/${publicCode}`;

    setTimeout(() => {
      document.removeEventListener('visibilitychange', onVisibility);

      if (!appOpened && !document.hidden) {
        setDialog(isIOS() ? 'ios' : 'android');
      }
    }, 1800);
  };

  const instalar = () => {
    setDialog(isIOS() ? 'ios' : 'android');
  };

  const prosseguir = () => {
    if (dialog === 'android') {
      setDialog(null);

      window.setTimeout(() => {
        window.location.href =
          'https://pub-5c31ce22b1b34c859235d0a6696b4a04.r2.dev/celebra-convite.apk';
      }, 150);

      return;
    }

    setDialog(null);
  };

  if (!environmentReady || isNative) {
    return null;
  }

  return (
    <>
      <div className="guest-app-actions">
        <button type="button" onClick={abrirAplicativo}>
          Abrir no aplicativo
        </button>

        <button type="button" onClick={instalar}>
          Instalar aplicativo
        </button>

        <p>Use o aplicativo para interagir com o convite e receber notificações.</p>
      </div>

      {dialog && (
        <div className="guest-app-dialog" role="dialog" aria-modal="true">
          <div className="guest-app-dialog-card">
            <button
              type="button"
              className="guest-app-dialog-close"
              onClick={() => setDialog(null)}
              aria-label="Fechar"
            >
              ×
            </button>

            {dialog === 'android' ? (
            <>
              <h3>Instalar Celebra Convidado</h3>

              <p>
                Ao tocar em <strong>Prosseguir</strong>, o download começará
                automaticamente.
              </p>

              <ol className="guest-app-dialog-steps">
                <li>
                  Quando o download terminar, toque no arquivo e confirme a
                  instalação.
                </li>
                <li>
                  Se o Android pedir autorização para instalar aplicativos
                  desta fonte, permita o acesso.
                </li>
                <li>
                  Se o Google Play informar que bloqueou a instalação por
                  segurança, toque na seta abaixo do aviso e selecione
                  <strong> Instalar assim mesmo</strong>.
                </li>
                <li>
                  Ao concluir, não toque no botão <strong>Abrir</strong> da
                  mensagem exibida no topo da tela. Volte para este convite e
                  toque em <strong>Abrir no aplicativo</strong>. Esse primeiro
                  acesso vincula e salva o convite no Celebra Convidado para
                  que você possa acessá-lo diretamente pelo aplicativo nas
                  próximas vezes.
                </li>
              </ol>
            </>          ) : (
              <>
                <h3>Adicionar no iPhone ou iPad</h3>
                <p>
                  No iOS, abra este convite no Safari, toque em Compartilhar e
                  escolha “Adicionar à Tela de Início”.
                </p>
                <p>
                  O iPhone não instala arquivos APK. O atalho pela Tela de Início
                  é a opção disponível no iOS.
                </p>
              </>
            )}

            <button
              type="button"
              className="guest-app-dialog-primary"
              onClick={prosseguir}
            >
              Prosseguir
            </button>
          </div>
        </div>
      )}
    </>
  );
}
