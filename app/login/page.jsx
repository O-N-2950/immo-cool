'use client';

import { useState } from 'react';

const COLORS = { bg: '#0a0a0f', bgCard: '#131318', accent: '#c9a94e', text: '#e8e6e1', textMuted: '#8a8880', border: '#1e1e28', success: '#4ade80', error: '#ef4444' };

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur de connexion');
      // Redirect based on role
      const role = data.user?.role;
      window.location.href = role === 'TENANT' ? '/dashboard/locataire' : role === 'ARTISAN' ? '/dashboard/artisan' : '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: COLORS.text }}>immo</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: COLORS.accent }}>.cool</span>
          </a>
          <p style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 8 }}>Connectez-vous à votre espace</p>
        </div>

        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, padding: 32 }}>
          {error && (
            <div style={{ background: COLORS.error + '15', border: `1px solid ${COLORS.error}40`, padding: '10px 14px', marginBottom: 20, color: COLORS.error, fontSize: 13 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, color: COLORS.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.ch"
              style={{ width: '100%', background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.text, padding: '12px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, color: COLORS.textMuted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              style={{ width: '100%', background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.text, padding: '12px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', background: COLORS.accent, color: COLORS.bg, border: 'none', padding: '14px', fontSize: 14, fontWeight: 600, cursor: loading ? 'wait' : 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <span style={{ color: COLORS.textMuted, fontSize: 13 }}>Pas encore de compte ? </span>
          <a href="/register" style={{ color: COLORS.accent, fontSize: 13, textDecoration: 'none' }}>Créer un compte</a>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <a href="/" style={{ color: COLORS.textMuted, fontSize: 12, textDecoration: 'none' }}>← Retour à l'accueil</a>
        </div>
      </div>
    </div>
  );
}
