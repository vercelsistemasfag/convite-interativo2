import './globals.css';
import ServiceWorkerRegister from './sw-register';

export const metadata = {
  title: 'Celebra — Convite Interativo',
  description: 'Crie e compartilhe convites interativos para momentos especiais.',
  manifest: '/manifest.webmanifest',
  applicationName: 'Celebra',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Celebra' },
};

export const viewport = { themeColor: '#5b143c', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return <html lang="pt-BR"><body><ServiceWorkerRegister />{children}</body></html>;
}
