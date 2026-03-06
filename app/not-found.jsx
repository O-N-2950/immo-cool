/**
 * 404 Page — immo.cool
 */
export default function NotFound() {
  return (
    <div style={{
      background: '#0a0a0f', color: '#e0e0e0', fontFamily: "'DM Sans', sans-serif",
      display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
      padding: 24
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 72, fontWeight: 200, color: '#c9a94e', marginBottom: 8 }}>404</div>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Page introuvable</h2>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>
          Cette page n'existe pas ou a été déplacée.
        </p>
        <a href="/" style={{
          display: 'inline-block', background: '#c9a94e', color: '#0a0a0f',
          padding: '12px 32px', fontSize: 14, fontWeight: 600,
          textDecoration: 'none', letterSpacing: '0.05em'
        }}>
          Retour à l'accueil
        </a>
        <div style={{ marginTop: 24 }}>
          <a href="/outils" style={{ color: '#c9a94e', fontSize: 13, textDecoration: 'none' }}>
            Voir nos outils gratuits →
          </a>
        </div>
      </div>
    </div>
  );
}
