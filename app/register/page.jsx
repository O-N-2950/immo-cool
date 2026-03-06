'use client';

import { useState } from 'react';

const COLORS = { bg: '#0a0a0f', bgCard: '#131318', accent: '#c9a94e', text: '#e8e6e1', textMuted: '#8a8880', border: '#1e1e28', success: '#4ade80', error: '#ef4444' };

const ROLES = [
  { value: 'LANDLORD', label: 'Propriétaire', icon: '🏠', desc: 'Publiez vos biens, trouvez des locataires' },
  { value: 'TENANT', label: 'Locataire', icon: '🔑', desc: 'Trouvez votre logement, 100% gratuit' },
  { value: 'ARTISAN', label: 'Artisan', icon: '🔧', desc: 'Recevez des mandats de réparation' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1=rôle, 2=infos
  const [role, setRole] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    setError('');
    if (!form.email || !form.password || !form.firstName || !form.lastName) {
      return setError('Tous les champs sont requis');
    }
    if (form.password.length < 6) return setError('Mot de passe : 6 caractères minimum');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      window.location.href = '/login?registered=true';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.text, padding: '12px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: COLORS.text }}>immo</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: COLORS.accent }}>.cool</span>
          </a>
          <p style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 8 }}>Créez votre compte gratuitement</p>
        </div>

        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, padding: 32 }}>
          {error && (
            <div style={{ background: COLORS.error + '15', border: `1px solid ${COLORS.error}40`, padding: '10px 14px', marginBottom: 20, color: COLORS.error, fontSize: 13 }}>{error}</div>
          )}

          {step === 1 && (
            <>
              <div style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Étape 1 — Votre profil</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ROLES.map(r => (
                  <button key={r.value} onClick={() => { setRole(r.value); setStep(2); }}
                    style={{
                      background: COLORS.bg, border: `1px solid ${COLORS.border}`, padding: '16px 20px',
                      cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent}
                    onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
                  >
                    <span style={{ fontSize: 28 }}>{r.icon}</span>
                    <div>
                      <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 600 }}>{r.label}</div>
                      <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 2 }}>{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
                Étape 2 — {ROLES.find(r => r.value === role)?.label}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>Prénom *</label>
                  <input value={form.firstName} onChange={e => update('firstName', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>Nom *</label>
                  <input value={form.lastName} onChange={e => update('lastName', e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>Email *</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="vous@exemple.ch" style={inputStyle} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>Mot de passe * (6 caractères min.)</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)} style={inputStyle} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>Téléphone</label>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+41 79 000 00 00" style={inputStyle} />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, padding: 14, cursor: 'pointer', fontSize: 13 }}>← Retour</button>
                <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, background: COLORS.accent, color: COLORS.bg, border: 'none', padding: 14, fontSize: 14, fontWeight: 600, cursor: loading ? 'wait' : 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Création...' : 'Créer mon compte'}
                </button>
              </div>

              {role === 'TENANT' && (
                <div style={{ background: COLORS.accent + '10', border: `1px solid ${COLORS.accent}30`, padding: '10px 14px', marginTop: 16, fontSize: 12, color: COLORS.accent }}>
                  ✨ 100% gratuit pour les locataires — accès à tous les outils
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <span style={{ color: COLORS.textMuted, fontSize: 13 }}>Déjà un compte ? </span>
          <a href="/login" style={{ color: COLORS.accent, fontSize: 13, textDecoration: 'none' }}>Se connecter</a>
        </div>
      </div>
    </div>
  );
}
