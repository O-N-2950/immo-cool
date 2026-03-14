'use client';

import { useState, useEffect } from 'react';

const COLORS = { bg: '#0a0a0f', bgCard: '#131318', bgElevated: '#1a1a22', accent: '#c9a94e', text: '#e8e6e1', textMuted: '#8a8880', border: '#1e1e28', success: '#4ade80', danger: '#f87171' };

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);
  const [connectLoading, setConnectLoading] = useState(false);

  useEffect(() => {
    // Check URL params for Stripe return
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') setBanner({ type: 'success', msg: 'Paiement reçu avec succès ! Votre bail est activé.' });
    if (params.get('payment') === 'cancelled') setBanner({ type: 'warn', msg: 'Paiement annulé. Vous pouvez réessayer depuis votre tableau de bord.' });
    if (params.get('stripe') === 'success') setBanner({ type: 'success', msg: 'Compte Stripe Connect configuré ! Vous pouvez maintenant recevoir des paiements.' });
    if (params.get('artisan') === 'success') setBanner({ type: 'success', msg: 'Paiement artisan effectué avec succès.' });

    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : Promise.reject('Non connecté'))
      .then(data => setUser(data.user))
      .catch(() => { window.location.href = '/login'; })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const handleStripeConnect = async () => {
    setConnectLoading(true);
    try {
      const res = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, landlordId: user.id, landlordName: `${user.firstName} ${user.lastName}` }),
      });
      const data = await res.json();
      if (data.onboardingUrl) window.location.href = data.onboardingUrl;
      else setBanner({ type: 'warn', msg: data.error || 'Erreur lors de la configuration Stripe' });
    } catch { setBanner({ type: 'warn', msg: 'Erreur de connexion' }); }
    setConnectLoading(false);
  };

  if (loading) return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
      Chargement...
    </div>
  );

  const roleLabel = { LANDLORD: 'Propriétaire', TENANT: 'Locataire', ARTISAN: 'Artisan', ADMIN: 'Admin' };
  const roleIcon = { LANDLORD: '🏠', TENANT: '🔑', ARTISAN: '🔧', ADMIN: '⚡' };

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: COLORS.text }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: COLORS.text }}>immo</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: COLORS.accent }}>.cool</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: COLORS.textMuted }}>{user?.firstName} {user?.lastName}</span>
          <span style={{ background: COLORS.accent + '20', color: COLORS.accent, padding: '4px 10px', fontSize: 11, letterSpacing: '0.05em' }}>
            {roleIcon[user?.role]} {roleLabel[user?.role]}
          </span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, padding: '6px 14px', fontSize: 12, cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
        {/* Payment/Stripe banner */}
        {banner && (
          <div style={{
            background: banner.type === 'success' ? '#4ade8015' : '#f8717115',
            border: `1px solid ${banner.type === 'success' ? COLORS.success + '40' : COLORS.danger + '40'}`,
            padding: '14px 20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 13, color: banner.type === 'success' ? COLORS.success : COLORS.danger }}>
              {banner.type === 'success' ? '✅' : '⚠️'} {banner.msg}
            </span>
            <button onClick={() => { setBanner(null); window.history.replaceState({}, '', '/dashboard'); }}
              style={{ background: 'none', border: 'none', color: COLORS.textMuted, cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>
        )}

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 400, marginBottom: 8 }}>
          Bonjour {user?.firstName} {roleIcon[user?.role]}
        </h1>
        <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 24 }}>
          Bienvenue sur votre tableau de bord {roleLabel[user?.role]?.toLowerCase()}
        </p>

        {/* Stripe Connect CTA for landlords */}
        {user?.role === 'LANDLORD' && !user?.stripeOnboarded && (
          <div style={{
            background: COLORS.accent + '10', border: `1px solid ${COLORS.accent}30`,
            padding: '20px 24px', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.accent, marginBottom: 4 }}>Configurez Stripe Connect</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>Pour recevoir les paiements de vos locataires, configurez votre compte Stripe.</div>
            </div>
            <button onClick={handleStripeConnect} disabled={connectLoading}
              style={{ background: COLORS.accent, color: '#0a0a0f', border: 'none', padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', opacity: connectLoading ? 0.6 : 1 }}>
              {connectLoading ? 'Chargement...' : 'Configurer →'}
            </button>
          </div>
        )}

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 40 }}>
          {user?.role === 'LANDLORD' && [
            { label: 'Biens publiés', value: user?._count?.properties || 0 },
            { label: 'Baux actifs', value: user?._count?.leasesAsLandlord || 0 },
            { label: 'Stripe', value: user?.stripeOnboarded ? '✅ Connecté' : '⏳ À configurer' },
          ].map((s, i) => (
            <div key={i} style={{ background: COLORS.bgCard, padding: 24 }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontFamily: "'Playfair Display', serif", color: COLORS.accent }}>{s.value}</div>
            </div>
          ))}
          {user?.role === 'TENANT' && [
            { label: 'Score locataire', value: user?.tenantProfile?.score || 0 },
            { label: 'Budget max', value: user?.tenantProfile?.maxBudget ? `CHF ${user.tenantProfile.maxBudget}` : 'Non défini' },
            { label: 'Cantons', value: user?.tenantProfile?.preferredCantons?.join(', ') || 'Tous' },
          ].map((s, i) => (
            <div key={i} style={{ background: COLORS.bgCard, padding: 24 }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontFamily: "'Playfair Display', serif", color: COLORS.accent }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Actions rapides</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            ...(user?.role === 'LANDLORD' ? [
              { href: '/outils/bail-gratuit', icon: '📄', label: 'Créer un bail', desc: 'Générer un contrat conforme' },
              { href: '/outils/etat-des-lieux', icon: '📋', label: 'État des lieux', desc: 'Formulaire digital avec photos' },
            ] : []),
            ...(user?.role === 'TENANT' ? [
              { href: '/outils/resiliation', icon: '📬', label: 'Résilier mon bail', desc: 'Calcul délais + lettre PDF' },
            ] : []),
            { href: '/outils/contestation', icon: '⚖️', label: 'Contester mon loyer', desc: 'Analyse IA gratuite' },
            { href: '/outils/calculateur-loyer', icon: '🧮', label: 'Calculateur de loyer', desc: 'Estimation par IA' },
            { href: '/outils/assistant-ia', icon: '🤖', label: 'Assistant juridique', desc: 'Chatbot droit du bail' },
            { href: '/demande', icon: '📣', label: 'Recherches actives', desc: 'Voir les demandes locataires' },
          ].map((a, i) => (
            <a key={i} href={a.href} style={{
              background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, padding: 20,
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14,
              transition: 'border-color 0.2s', cursor: 'pointer',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
            >
              <span style={{ fontSize: 28 }}>{a.icon}</span>
              <div>
                <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 600 }}>{a.label}</div>
                <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 2 }}>{a.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
