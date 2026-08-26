import './globals.css';
import ServiceWorkerRegister from './sw-register';

export const metadata = {
  title: 'Celebre — Convites Interativos',
  description: 'Crie convites interativos para momentos especiais.',
  manifest: '/manifest.webmanifest',
  applicationName: 'Celebre',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Celebre',
  },
};

export const viewport = {
  themeColor: '#6f55d9',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
