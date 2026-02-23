import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.immocool.ch'),
  title: {
    default: 'immo.cool — Immobilier suisse 100% automatisé | Gratuit pour les locataires',
    template: '%s | immo.cool',
  },
  description: 'La première régie 100% IA de Suisse. Publiez, trouvez, signez votre bail en toute conformité. 50% moins cher qu\'une régie, gratuit pour les locataires. 26 cantons.',
  keywords: 'immobilier suisse, location appartement, bail suisse, locataire gratuit, régie en ligne, matching IA, état des lieux digital, Jura, Delémont',
  openGraph: {
    title: 'immo.cool — L\'immobilier suisse, réinventé',
    description: '100% gratuit pour les locataires. 50% du 1er loyer pour les propriétaires. Matching IA. Bail conforme 26 cantons.',
    url: 'https://www.immocool.ch',
    siteName: 'immo.cool',
    type: 'website',
    locale: 'fr_CH',
    alternateLocale: ['de_CH'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.immocool.ch' },
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#D4A853',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#07060A' }}>{children}</body>
    </html>
  );
}
