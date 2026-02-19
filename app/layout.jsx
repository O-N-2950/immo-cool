import './globals.css';

export const metadata = {
  title: 'immo.cool — La plateforme immobilière 100% gratuite pour les locataires',
  description: 'Publiez, trouvez, signez votre bail en toute conformité avec les 26 réglementations cantonales suisses. 50% moins cher qu\'une régie, gratuit pour les locataires.',
  keywords: 'immobilier, suisse, location, bail, locataire, propriétaire, régie, gratuit, cantonal',
  openGraph: {
    title: 'immo.cool — L\'immobilier suisse, réinventé',
    description: '100% gratuit pour les locataires. 50% moins cher qu\'une régie pour les propriétaires.',
    url: 'https://immo.cool',
    siteName: 'immo.cool',
    type: 'website',
    locale: 'fr_CH',
  },
  robots: 'index, follow',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      </head>
      <body>{children}</body>
    </html>
  );
}
