'use client';

import { useState, useEffect } from 'react';

const C = { bg: '#0a0a0f', bgCard: '#131318', bgElevated: '#1a1a22', accent: '#c9a94e', text: '#e8e6e1', textMuted: '#8a8880', border: '#1e1e28', success: '#4ade80', danger: '#f87171', info: '#60a5fa' };

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);
  const [connectLoading, setConnectLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [demands, setDemands] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') setBanner({ type: 'success', msg: 'Paiement reçu avec succès ! Votre bail est activé.' });
    if (params.get('payment') === 'cancelled') setBanner({ type: 'warn', msg: 'Paiement annulé. Vous pouvez réessayer.' });
    if (params.get('stripe') === 'success') setBanner({ type: 'success', msg: 'Compte Stripe Connect configuré !' });
    if (params.get('artisan') === 'success') setBanner({ type: 'success', msg: 'Paiement artisan effectué.' });

    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setUser(data.user);
        // Load role-specific data
        if (data.user.role === 'LANDLORD') {
          fetch('/api/properties', { credentials: 'include' })
            .then(r => r.ok ? r.json() : { properties: [] })
            .then(d => setProperties(d.properties || []));
        }
        fetch('/api/reverse').then(r => r.ok ? r.json() : { requests: [] }).then(d => setDemands(d.requests || []));
      })
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
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, landlordId: user.id, landlordName: `${user.firstName} ${user.lastName}` }),
      });
      const data = await res.json();
      if (data.onboardingUrl) window.location.href = data.onboardingUrl;
      else setBanner({ type: 'warn', msg: data.error || 'Erreur Stripe' });
    } catch { setBanner({ type: 'warn', msg: 'Erreur de connexion' }); }
    setConnectLoading(false);
  };

  if (loading) return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 12 }}>immo<span style={{ color: C.accent }}>.</span>cool</div>
        <div style={{ fontSize: 13 }}>Chargement...</div>
      </div>
    </div>
  );

  const roleLabel = { LANDLORD: 'Propriétaire', TENANT: 'Locataire', ARTISAN: 'Artisan', ADMIN: 'Admin' };
  const roleIcon = { LANDLORD: '🏠', TENANT: '🔑', ARTISAN: '🔧', ADMIN: '⚡' };

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: '📊' },
    ...(user?.role === 'LANDLORD' ? [{ id: 'properties', label: `Mes biens (${properties.length})`, icon: '🏘️' }] : []),
    { id: 'demands', label: `Demandes (${demands.length})`, icon: '📣' },
    { id: 'tools', label: 'Outils', icon: '🛠️' },
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: C.text }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.text }}>immo</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.accent }}>.cool</span>
        </a>
        <div style={{ display: 'flex', gap: 6 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? C.accent + '15' : 'transparent',
              border: `1px solid ${tab === t.id ? C.accent + '40' : 'transparent'}`,
              color: tab === t.id ? C.accent : C.textMuted, padding: '6px 14px', fontSize: 12,
              cursor: 'pointer', fontFamily: "'DM Sans'", display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: C.textMuted }}>{user?.firstName}</span>
          <span style={{ background: C.accent + '20', color: C.accent, padding: '3px 8px', fontSize: 10 }}>
            {roleIcon[user?.role]} {roleLabel[user?.role]}
          </span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.textMuted, padding: '5px 12px', fontSize: 11, cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        {/* Banner */}
        {banner && (
          <div style={{
            background: banner.type === 'success' ? '#4ade8010' : '#f8717110',
            border: `1px solid ${banner.type === 'success' ? C.success + '30' : C.danger + '30'}`,
            padding: '12px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 13, color: banner.type === 'success' ? C.success : C.danger }}>
              {banner.type === 'success' ? '✅' : '⚠️'} {banner.msg}
            </span>
            <button onClick={() => { setBanner(null); window.history.replaceState({}, '', '/dashboard'); }}
              style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer' }}>×</button>
          </div>
        )}

        {/* Stripe Connect CTA */}
        {user?.role === 'LANDLORD' && !user?.stripeOnboarded && (
          <div style={{ background: C.accent + '08', border: `1px solid ${C.accent}25`, padding: '16px 20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>Configurez Stripe Connect</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Recevez les paiements de vos locataires.</div>
            </div>
            <button onClick={handleStripeConnect} disabled={connectLoading}
              style={{ background: C.accent, color: '#0a0a0f', border: 'none', padding: '8px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: connectLoading ? 0.6 : 1 }}>
              {connectLoading ? '...' : 'Configurer →'}
            </button>
          </div>
        )}

        {/* TAB: OVERVIEW */}
        {tab === 'overview' && <>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, marginBottom: 24 }}>
            Bonjour {user?.firstName} {roleIcon[user?.role]}
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 32 }}>
            {user?.role === 'LANDLORD' && [
              { label: 'Biens publiés', value: properties.length || user?._count?.properties || 0 },
              { label: 'Baux actifs', value: user?._count?.leasesAsLandlord || 0 },
              { label: 'Stripe', value: user?.stripeOnboarded ? '✅ Actif' : '⏳ À faire' },
            ].map((s, i) => (
              <div key={i} style={{ background: C.bgCard, padding: 20 }}>
                <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontFamily: "'Playfair Display', serif", color: C.accent }}>{s.value}</div>
              </div>
            ))}
            {user?.role === 'TENANT' && [
              { label: 'Score locataire', value: `${user?.tenantProfile?.score || 0}/100` },
              { label: 'Budget max', value: user?.tenantProfile?.maxBudget ? `CHF ${Number(user.tenantProfile.maxBudget).toLocaleString('fr-CH')}` : '—' },
              { label: 'Cantons', value: user?.tenantProfile?.preferredCantons?.join(', ') || 'Tous' },
            ].map((s, i) => (
              <div key={i} style={{ background: C.bgCard, padding: 20 }}>
                <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontFamily: "'Playfair Display', serif", color: C.accent }}>{s.value}</div>
              </div>
            ))}
            {user?.role === 'ARTISAN' && [
              { label: 'Spécialités', value: user?.artisanProfile?.specialties?.join(', ') || '—' },
              { label: 'Note', value: user?.artisanProfile?.avgRating ? `${user.artisanProfile.avgRating}/5 ⭐` : 'Nouveau' },
              { label: 'Entreprise', value: user?.artisanProfile?.companyName || '—' },
            ].map((s, i) => (
              <div key={i} style={{ background: C.bgCard, padding: 20 }}>
                <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 16, fontFamily: "'DM Sans'", color: C.accent }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Recent properties for landlords */}
          {user?.role === 'LANDLORD' && properties.length > 0 && <>
            <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Derniers biens</div>
            {properties.slice(0, 3).map(p => (
              <div key={p.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: 16, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{p.title || `${p.rooms}p — ${p.city}`}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{p.street}, {p.postalCode} {p.city} ({p.canton})</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontFamily: "'Playfair Display', serif", color: C.accent }}>CHF {Number(p.monthlyRent).toLocaleString('fr-CH')}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>+{p.charges || 0} charges</div>
                </div>
              </div>
            ))}
            {properties.length > 3 && <button onClick={() => setTab('properties')} style={{ background: 'none', border: 'none', color: C.accent, cursor: 'pointer', fontSize: 12, marginTop: 4 }}>Voir tous ({properties.length}) →</button>}
          </>}

          {/* Recent demands */}
          {demands.length > 0 && <>
            <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12, marginTop: 28 }}>Demandes récentes</div>
            {demands.slice(0, 3).map(d => (
              <div key={d.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: 14, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{d.rooms}p — {d.city} ({d.canton})</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{d.description?.slice(0, 60)}</div>
                </div>
                <div style={{ fontSize: 14, color: C.accent, fontFamily: "'Playfair Display'" }}>max {Number(d.maxBudget).toLocaleString('fr-CH')} CHF</div>
              </div>
            ))}
          </>}
        </>}

        {/* TAB: PROPERTIES */}
        {tab === 'properties' && <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400 }}>Mes <span style={{ color: C.accent, fontStyle: 'italic' }}>biens</span></h2>
            <a href="/outils/bail-gratuit" style={{ background: C.accent, color: '#0a0a0f', padding: '8px 16px', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>+ Créer un bail</a>
          </div>
          {properties.length === 0 ? (
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
              <div style={{ fontSize: 15, marginBottom: 6 }}>Aucun bien publié</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Commencez par créer un bail pour votre premier bien.</div>
              <a href="/outils/bail-gratuit" style={{ color: C.accent, fontSize: 13, textDecoration: 'none' }}>Créer un bail gratuit →</a>
            </div>
          ) : properties.map(p => (
            <div key={p.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: 20, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{p.title || `${p.rooms}p — ${p.city}`}</span>
                  <span style={{ background: p.status === 'ACTIVE' ? C.success + '20' : C.accent + '20', color: p.status === 'ACTIVE' ? C.success : C.accent, padding: '2px 8px', fontSize: 10 }}>
                    {p.status === 'ACTIVE' ? 'Actif' : p.status}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{p.street}, {p.postalCode} {p.city} — {p.rooms}p, {p.surface || '?'}m², étage {p.floor || '?'}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                  {p.balcony && <span style={{ fontSize: 10, color: C.info }}>Balcon</span>}
                  {p.parking && <span style={{ fontSize: 10, color: C.info }}>Parking</span>}
                  {p.elevator && <span style={{ fontSize: 10, color: C.info }}>Ascenseur</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 22, fontFamily: "'Playfair Display', serif", color: C.accent }}>CHF {Number(p.monthlyRent).toLocaleString('fr-CH')}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>+{p.charges || 0} charges</div>
                {p.availableFrom && <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>Dispo: {new Date(p.availableFrom).toLocaleDateString('fr-CH')}</div>}
              </div>
            </div>
          ))}
        </>}

        {/* TAB: DEMANDS */}
        {tab === 'demands' && <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400 }}>Demandes <span style={{ color: C.accent, fontStyle: 'italic' }}>locataires</span></h2>
            <a href="/demande" style={{ background: C.accent, color: '#0a0a0f', padding: '8px 16px', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
              {user?.role === 'TENANT' ? '+ Publier ma recherche' : 'Voir tout'}
            </a>
          </div>
          {demands.length === 0 ? (
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📣</div>
              <div style={{ fontSize: 15, marginBottom: 6 }}>Aucune demande active</div>
              <a href="/demande" style={{ color: C.accent, fontSize: 13, textDecoration: 'none' }}>Publier une recherche →</a>
            </div>
          ) : demands.map(d => (
            <div key={d.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: 16, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{d.rooms}p — {d.city}</span>
                  <span style={{ background: C.accent + '15', color: C.accent, padding: '2px 6px', fontSize: 10 }}>{d.canton}</span>
                  {d.verified && <span style={{ background: C.success + '15', color: C.success, padding: '2px 6px', fontSize: 10 }}>Vérifié</span>}
                </div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{d.description?.slice(0, 80)}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 16, fontFamily: "'Playfair Display'", color: C.accent }}>max {Number(d.maxBudget).toLocaleString('fr-CH')} CHF</div>
                {user?.role === 'LANDLORD' && <button style={{ background: C.accent + '15', border: `1px solid ${C.accent}30`, color: C.accent, padding: '4px 10px', fontSize: 11, cursor: 'pointer', marginTop: 6 }}>Proposer un bien</button>}
              </div>
            </div>
          ))}
        </>}

        {/* TAB: TOOLS */}
        {tab === 'tools' && <>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, marginBottom: 24 }}>Outils <span style={{ color: C.accent, fontStyle: 'italic' }}>gratuits</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {[
              ...(user?.role === 'LANDLORD' ? [
                { href: '/outils/bail-gratuit', icon: '📄', label: 'Créer un bail', desc: 'Contrat conforme CO + droit cantonal' },
                { href: '/outils/etat-des-lieux', icon: '📋', label: 'État des lieux', desc: 'Formulaire digital avec photos' },
              ] : []),
              ...(user?.role === 'TENANT' ? [
                { href: '/outils/resiliation', icon: '📬', label: 'Résilier mon bail', desc: 'Calcul délais + lettre PDF' },
              ] : []),
              { href: '/outils/contestation', icon: '⚖️', label: 'Contester mon loyer', desc: 'Analyse IA + lettre PDF' },
              { href: '/outils/calculateur-loyer', icon: '🧮', label: 'Calculateur de loyer', desc: 'Estimation par IA (26 cantons)' },
              { href: '/outils/assistant-ia', icon: '🤖', label: 'Assistant juridique', desc: 'Chatbot droit du bail suisse' },
              { href: '/demande', icon: '📣', label: 'Marketplace', desc: 'Demandes locataires actives' },
            ].map((a, i) => (
              <a key={i} href={a.href} style={{
                background: C.bgCard, border: `1px solid ${C.border}`, padding: 20,
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14,
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
              >
                <span style={{ fontSize: 28 }}>{a.icon}</span>
                <div>
                  <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{a.label}</div>
                  <div style={{ color: C.textMuted, fontSize: 12, marginTop: 2 }}>{a.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </>}

        {/* Footer */}
        <div style={{ marginTop: 48, paddingTop: 20, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.textMuted }}>
          <span>immo.cool © 2026</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="/cgv" style={{ color: C.textMuted, textDecoration: 'none' }}>CGV</a>
            <a href="/confidentialite" style={{ color: C.textMuted, textDecoration: 'none' }}>Confidentialité</a>
            <a href="/outils" style={{ color: C.textMuted, textDecoration: 'none' }}>Outils</a>
          </div>
        </div>
      </div>
    </div>
  );
}
