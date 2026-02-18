import './globals.css';

export const metadata = {
  title: 'immo.cool — La plateforme immobilière gratuite pour les locataires',
  description: 'Matching intelligent, bail conforme au droit suisse, paiements sécurisés, état des lieux digital — 100% automatisé, 100% gratuit pour les locataires.',
  keywords: 'immobilier, Suisse, location, bail, locataire, propriétaire, gratuit, automatisé',
  openGraph: {
    title: 'immo.cool — Louez sans intermédiaire',
    description: '100% gratuit pour les locataires. 50% moins cher pour les propriétaires.',
    url: 'https://www.immo.cool',
    siteName: 'immo.cool',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
