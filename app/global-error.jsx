'use client';

/**
 * Global Error Boundary — immo.cool
 * Capture toutes les erreurs non gérées côté client
 * Inspiré des patterns WinWin V2
 */
export default function GlobalError({ error, reset }) {
  return (
    <html lang="fr">
      <body style={{
        background: '#0a0a0f', color: '#e0e0e0', fontFamily: "'DM Sans', sans-serif",
        display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
        padding: 24
      }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
            Une erreur est survenue
          </h2>
          <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>
            Notre équipe a été notifiée. Veuillez réessayer.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: '#c9a94e', color: '#0a0a0f', border: 'none',
              padding: '12px 32px', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', letterSpacing: '0.05em'
            }}
          >
            Réessayer
          </button>
          <div style={{ marginTop: 16 }}>
            <a href="/" style={{ color: '#c9a94e', fontSize: 13, textDecoration: 'none' }}>
              ← Retour à l'accueil
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
