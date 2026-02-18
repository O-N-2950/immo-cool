"use client";
import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0A0C0F",
  bgCard: "#12151A",
  bgElevated: "#1A1E25",
  bgHover: "#222730",
  accent: "#C8A55C",
  accentLight: "#E8D5A0",
  accentDark: "#9E7F3A",
  text: "#F2F0ED",
  textMuted: "#8A8D94",
  textDim: "#5A5D64",
  border: "#2A2E35",
  success: "#4ADE80",
  error: "#F87171",
  info: "#60A5FA",
  white: "#FFFFFF",
};

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
`;

const SwissIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="3" fill="#FF0000" />
    <path d="M10 6h4v12h-4z" fill="white" />
    <path d="M6 10h12v4H6z" fill="white" />
  </svg>
);

const Icon = ({ name, size = 20, color = COLORS.textMuted }) => {
  const icons = {
    home: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    search: <><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></>,
    user: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    key: <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />,
    building: <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    heart: <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
    check: <path d="M5 13l4 4L19 7" />,
    star: <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
    calendar: <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    chat: <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    tool: <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    document: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    camera: <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />,
    money: <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    shield: <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    arrow: <path d="M17 8l4 4m0 0l-4 4m4-4H3" />,
    location: <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
    close: <path d="M6 18L18 6M6 6l12 12" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    plus: <path d="M12 4v16m8-8H4" />,
    photo: <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    bell: <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
    wrench: <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />,
    logout: <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

const AnimatedCounter = ({ target, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const inc = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return <span ref={ref}>{count.toLocaleString("fr-CH")}{suffix}</span>;
};

// ─────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────
export default function ImmoCool() {
  const [currentView, setCurrentView] = useState("landing");
  const [userType, setUserType] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(null);
  const [animateIn, setAnimateIn] = useState(true);

  useEffect(() => {
    setAnimateIn(false);
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, [currentView, activeTab]);

  const navigate = (view, type = null) => {
    setAnimateIn(false);
    setTimeout(() => {
      setCurrentView(view);
      if (type) setUserType(type);
      setActiveTab("dashboard");
      setAnimateIn(true);
    }, 200);
  };

  // ─── LANDING PAGE ───
  const LandingPage = () => (
    <div style={{ minHeight: "100vh", background: COLORS.bg }}>
      {/* Hero */}
      <div style={{
        position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column",
        background: `radial-gradient(ellipse at 30% 20%, rgba(200,165,92,0.08) 0%, transparent 60%),
                     radial-gradient(ellipse at 70% 80%, rgba(200,165,92,0.05) 0%, transparent 50%),
                     ${COLORS.bg}`,
        overflow: "hidden"
      }}>
        {/* Decorative grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: `linear-gradient(${COLORS.accent} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.accent} 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />

        {/* Nav */}
        <nav style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "24px 48px", position: "relative", zIndex: 10,
          borderBottom: `1px solid ${COLORS.border}22`
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SwissIcon size={28} />
            <span style={{
              fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600,
              color: COLORS.text, letterSpacing: "0.02em"
            }}>
              immo<span style={{ color: COLORS.accent }}>.cool</span>
            </span>
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {["Fonctionnalités", "Tarifs", "Sécurité", "Contact"].map(item => (
              <span key={item} style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textMuted,
                cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase",
                transition: "color 0.3s"
              }}
                onMouseEnter={e => e.target.style.color = COLORS.accent}
                onMouseLeave={e => e.target.style.color = COLORS.textMuted}
              >{item}</span>
            ))}
            <button onClick={() => navigate("app", "owner")} style={{
              background: "transparent", border: `1px solid ${COLORS.accent}`,
              color: COLORS.accent, padding: "10px 24px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: "0.06em",
              textTransform: "uppercase", transition: "all 0.3s"
            }}
              onMouseEnter={e => { e.target.style.background = COLORS.accent; e.target.style.color = COLORS.bg; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = COLORS.accent; }}
            >Connexion</button>
          </div>
        </nav>

        {/* Hero Content */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 48px", position: "relative", zIndex: 5
        }}>
          <div style={{ maxWidth: 900, textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `${COLORS.accent}15`, border: `1px solid ${COLORS.accent}30`,
              padding: "8px 20px", marginBottom: 40, borderRadius: 0,
              animation: animateIn ? "fadeDown 0.8s ease" : "none"
            }}>
              <div style={{ width: 6, height: 6, background: COLORS.success, borderRadius: "50%" }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.accent,
                letterSpacing: "0.1em", textTransform: "uppercase"
              }}>La plateforme immobilière 100% gratuite pour les locataires</span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 6vw, 78px)",
              fontWeight: 400, color: COLORS.text, lineHeight: 1.1, margin: "0 0 30px",
              animation: animateIn ? "fadeUp 1s ease" : "none"
            }}>
              Louez sans<br />
              <span style={{
                fontStyle: "italic", color: COLORS.accent,
                position: "relative"
              }}>
                intermédiaire
                <svg style={{ position: "absolute", bottom: -8, left: 0, width: "100%", height: 12 }}
                  viewBox="0 0 300 12" preserveAspectRatio="none">
                  <path d="M0 8 Q75 0, 150 6 T300 4" stroke={COLORS.accent} strokeWidth="1.5"
                    fill="none" opacity="0.4" />
                </svg>
              </span>
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: COLORS.textMuted,
              lineHeight: 1.7, maxWidth: 560, margin: "0 auto 50px",
              animation: animateIn ? "fadeUp 1.2s ease" : "none"
            }}>
              Matching intelligent, bail conforme au droit suisse, paiements sécurisés,
              état des lieux digital — tout est automatisé.
            </p>

            <div style={{
              display: "flex", gap: 16, justifyContent: "center",
              animation: animateIn ? "fadeUp 1.4s ease" : "none"
            }}>
              <button onClick={() => navigate("app", "owner")} style={{
                background: COLORS.accent, color: COLORS.bg, border: "none",
                padding: "16px 40px", cursor: "pointer", fontSize: 14,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                letterSpacing: "0.06em", textTransform: "uppercase",
                transition: "all 0.3s", position: "relative", overflow: "hidden"
              }}
                onMouseEnter={e => { e.target.style.background = COLORS.accentLight; e.target.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.target.style.background = COLORS.accent; e.target.style.transform = "translateY(0)"; }}
              >
                Je suis propriétaire
              </button>
              <button onClick={() => navigate("app", "tenant")} style={{
                background: "transparent", color: COLORS.text,
                border: `1px solid ${COLORS.border}`, padding: "16px 40px",
                cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
                transition: "all 0.3s"
              }}
                onMouseEnter={e => { e.target.style.borderColor = COLORS.accent; e.target.style.color = COLORS.accent; }}
                onMouseLeave={e => { e.target.style.borderColor = COLORS.border; e.target.style.color = COLORS.text; }}
              >
                Je cherche un logement
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          animation: "pulse 2s ease infinite"
        }}>
          <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: COLORS.textDim,
            letterSpacing: "0.15em", textTransform: "uppercase" }}>Découvrir</span>
          <div style={{ width: 1, height: 40, background: `linear-gradient(${COLORS.textDim}, transparent)` }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`
      }}>
        {[
          { value: 0, suffix: " CHF", label: "Commission cachée" },
          { value: 100, suffix: "%", label: "Automatisé" },
          { value: 24, suffix: "/7", label: "Disponible" },
          { value: 3, suffix: " min", label: "Publier une annonce" },
        ].map((stat, i) => (
          <div key={i} style={{
            padding: "48px 32px", textAlign: "center",
            borderRight: i < 3 ? `1px solid ${COLORS.border}` : "none",
            transition: "background 0.3s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.bgCard}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: 42,
              color: COLORS.accent, fontWeight: 400, marginBottom: 8
            }}>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <div style={{
              fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.textMuted,
              letterSpacing: "0.06em", textTransform: "uppercase"
            }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ padding: "120px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <span style={{
            fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.accent,
            letterSpacing: "0.15em", textTransform: "uppercase"
          }}>Comment ça marche</span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 400,
            color: COLORS.text, marginTop: 16
          }}>
            Six étapes, zéro <span style={{ fontStyle: "italic", color: COLORS.accent }}>tracas</span>
          </h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1,
          background: COLORS.border, maxWidth: 1100, margin: "0 auto"
        }}>
          {[
            { icon: "plus", num: "01", title: "Publiez", desc: "Décrivez votre bien en 3 minutes. Notre formulaire intelligent capture chaque détail." },
            { icon: "search", num: "02", title: "Match", desc: "Notre algorithme connecte les bons locataires aux bons propriétaires. Automatiquement." },
            { icon: "calendar", num: "03", title: "Visitez", desc: "Coordonnez les visites via l'agenda intégré. Confirmations et rappels automatiques." },
            { icon: "document", num: "04", title: "Signez", desc: "Bail conforme CO/droit cantonal généré et signé électroniquement par les deux parties." },
            { icon: "camera", num: "05", title: "État des lieux", desc: "Formulaire digital avec photos et signatures. Comparaison entrée/sortie automatique." },
            { icon: "wrench", num: "06", title: "Gérez", desc: "Incidents, artisans, paiements, résiliation — tout depuis la plateforme." },
          ].map((f, i) => (
            <div key={i} style={{
              background: COLORS.bg, padding: 48,
              cursor: "default", transition: "all 0.4s", position: "relative", overflow: "hidden"
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = COLORS.bgCard;
                e.currentTarget.querySelector('.feat-num').style.color = COLORS.accent;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = COLORS.bg;
                e.currentTarget.querySelector('.feat-num').style.color = COLORS.border;
              }}
            >
              <div className="feat-num" style={{
                fontFamily: "'Playfair Display', serif", fontSize: 72, fontWeight: 400,
                color: COLORS.border, position: "absolute", top: 16, right: 24,
                transition: "color 0.4s", lineHeight: 1
              }}>{f.num}</div>
              <div style={{ marginBottom: 20 }}>
                <Icon name={f.icon} size={24} color={COLORS.accent} />
              </div>
              <h3 style={{
                fontFamily: "'DM Sans'", fontSize: 18, fontWeight: 600,
                color: COLORS.text, marginBottom: 12, letterSpacing: "0.02em"
              }}>{f.title}</h3>
              <p style={{
                fontFamily: "'DM Sans'", fontSize: 14, color: COLORS.textMuted,
                lineHeight: 1.7
              }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{
        padding: "120px 48px",
        background: `linear-gradient(180deg, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)`
      }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <span style={{
            fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.accent,
            letterSpacing: "0.15em", textTransform: "uppercase"
          }}>Tarification transparente</span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 400,
            color: COLORS.text, marginTop: 16
          }}>
            Jusqu'à <span style={{ fontStyle: "italic", color: COLORS.accent }}>50% moins cher</span> qu'une régie — et gratuit pour les locataires
          </h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2,
          maxWidth: 800, margin: "0 auto"
        }}>
          {[
            {
              title: "Propriétaire", icon: "key",
              price: "50%", desc: "du premier loyer, payable après signature du bail",
              features: [
                "Publication illimitée d'annonces",
                "Matching intelligent des candidats",
                "Génération automatique du bail",
                "État des lieux digital",
                "Marketplace artisans intégrée",
                "Gestion des incidents",
              ]
            },
            {
              title: "Locataire", icon: "home",
              price: "GRATUIT", desc: "100% gratuit pour tous les locataires",
              features: [
                "Accès à toutes les annonces",
                "Profil vérifié et scoring",
                "Alertes personnalisées",
                "Signature électronique",
                "État des lieux partagé",
                "Résiliation assistée",
              ]
            }
          ].map((plan, i) => (
            <div key={i} style={{
              background: COLORS.bgElevated, padding: 56,
              border: `1px solid ${COLORS.border}`, position: "relative",
              transition: "all 0.4s"
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent + "60"}
              onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                <Icon name={plan.icon} size={22} color={COLORS.accent} />
                <span style={{
                  fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.accent,
                  letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600
                }}>{plan.title}</span>
              </div>
              <div style={{
                fontFamily: "'Playfair Display', serif", fontSize: 48,
                color: COLORS.text, fontWeight: 400, marginBottom: 8
              }}>{plan.price}</div>
              <p style={{
                fontFamily: "'DM Sans'", fontSize: 14, color: COLORS.textMuted,
                marginBottom: 40
              }}>{plan.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Icon name="check" size={16} color={COLORS.accent} />
                    <span style={{
                      fontFamily: "'DM Sans'", fontSize: 14, color: COLORS.textMuted
                    }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        padding: "120px 48px", textAlign: "center",
        borderTop: `1px solid ${COLORS.border}`
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 400,
          color: COLORS.text, marginBottom: 24
        }}>
          Prêt à <span style={{ fontStyle: "italic", color: COLORS.accent }}>simplifier</span> ?
        </h2>
        <p style={{
          fontFamily: "'DM Sans'", fontSize: 16, color: COLORS.textMuted,
          marginBottom: 48, maxWidth: 480, margin: "0 auto 48px"
        }}>
          Rejoignez les propriétaires qui ont choisi l'efficacité suisse.
        </p>
        <button onClick={() => navigate("app", "owner")} style={{
          background: COLORS.accent, color: COLORS.bg, border: "none",
          padding: "18px 56px", cursor: "pointer", fontSize: 14,
          fontFamily: "'DM Sans'", fontWeight: 600,
          letterSpacing: "0.08em", textTransform: "uppercase",
          transition: "all 0.3s"
        }}
          onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.target.style.transform = "translateY(0)"}
        >
          Commencer gratuitement
        </button>
        <div style={{
          marginTop: 24, fontFamily: "'DM Sans'", fontSize: 12,
          color: COLORS.textDim
        }}>
          Aucune carte bancaire requise • Annulation à tout moment
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: "48px", borderTop: `1px solid ${COLORS.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SwissIcon size={20} />
          <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.textDim }}>
            © 2026 immo.cool SA — Confédération Suisse
          </span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["CGV", "Confidentialité", "Mentions légales"].map(l => (
            <span key={l} style={{
              fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.textDim,
              cursor: "pointer", letterSpacing: "0.04em"
            }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );

  // ─── APP DASHBOARD ───
  const sidebarItems = userType === "owner" ? [
    { id: "dashboard", icon: "home", label: "Tableau de bord" },
    { id: "properties", icon: "building", label: "Mes biens" },
    { id: "matches", icon: "heart", label: "Matchs" },
    { id: "leases", icon: "document", label: "Baux" },
    { id: "inventory", icon: "camera", label: "États des lieux" },
    { id: "incidents", icon: "wrench", label: "Incidents" },
    { id: "artisans", icon: "tool", label: "Artisans" },
    { id: "payments", icon: "money", label: "Paiements" },
    { id: "messages", icon: "chat", label: "Messages" },
  ] : [
    { id: "dashboard", icon: "home", label: "Tableau de bord" },
    { id: "search", icon: "search", label: "Rechercher" },
    { id: "matches", icon: "heart", label: "Mes matchs" },
    { id: "lease", icon: "document", label: "Mon bail" },
    { id: "inventory", icon: "camera", label: "État des lieux" },
    { id: "incidents", icon: "wrench", label: "Signaler" },
    { id: "payments", icon: "money", label: "Paiements" },
    { id: "messages", icon: "chat", label: "Messages" },
  ];

  const DashboardOwner = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Welcome */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.bgElevated} 0%, ${COLORS.bgCard} 100%)`,
        border: `1px solid ${COLORS.border}`, padding: "40px 44px",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: -30, right: -30, width: 200, height: 200,
          background: `radial-gradient(circle, ${COLORS.accent}10 0%, transparent 70%)`
        }} />
        <span style={{
          fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.accent,
          letterSpacing: "0.15em", textTransform: "uppercase"
        }}>Bienvenue</span>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 400,
          color: COLORS.text, margin: "12px 0 8px"
        }}>Bonjour, Olivier</h2>
        <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: COLORS.textMuted }}>
          Vous avez 3 nouveaux matchs et 1 signature en attente.
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: COLORS.border }}>
        {[
          { label: "Biens actifs", value: "4", icon: "building", change: "+1" },
          { label: "Matchs en cours", value: "7", icon: "heart", change: "+3" },
          { label: "Baux signés", value: "12", icon: "document", change: "ce mois" },
          { label: "Revenus", value: "8'400", icon: "money", change: "CHF" },
        ].map((kpi, i) => (
          <div key={i} style={{
            background: COLORS.bgCard, padding: "28px 24px",
            transition: "background 0.3s", cursor: "default"
          }}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.bgElevated}
            onMouseLeave={e => e.currentTarget.style.background = COLORS.bgCard}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
              <Icon name={kpi.icon} size={20} color={COLORS.accent} />
              <span style={{
                fontFamily: "'DM Sans'", fontSize: 11, color: COLORS.success,
                background: `${COLORS.success}15`, padding: "3px 8px"
              }}>{kpi.change}</span>
            </div>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: 28,
              color: COLORS.text, fontWeight: 400, marginBottom: 4
            }}>{kpi.value}</div>
            <div style={{
              fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.textMuted,
              letterSpacing: "0.04em"
            }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Latest Matches */}
        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, padding: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <span style={{
              fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.accent,
              letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600
            }}>Derniers matchs</span>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.textDim, cursor: "pointer" }}>Tout voir →</span>
          </div>
          {[
            { name: "Sophie Müller", apt: "3.5 pces — Delémont", score: 94, status: "Visite planifiée" },
            { name: "Marc Bianchi", apt: "4.5 pces — Porrentruy", score: 87, status: "En attente" },
            { name: "Léa Dubois", apt: "2.5 pces — Courgenay", score: 82, status: "Nouveau" },
          ].map((m, i) => (
            <div key={i} style={{
              padding: "16px 0", borderBottom: i < 2 ? `1px solid ${COLORS.border}40` : "none",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 14, color: COLORS.text, fontWeight: 500 }}>
                  {m.name}
                </div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
                  {m.apt}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  fontFamily: "'JetBrains Mono'", fontSize: 14,
                  color: m.score > 90 ? COLORS.success : COLORS.accent, fontWeight: 500
                }}>{m.score}%</div>
                <div style={{
                  fontFamily: "'DM Sans'", fontSize: 11, color: COLORS.textDim, marginTop: 2
                }}>{m.status}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming */}
        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, padding: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <span style={{
              fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.accent,
              letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600
            }}>Agenda</span>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.textDim, cursor: "pointer" }}>Calendrier →</span>
          </div>
          {[
            { date: "Aujourd'hui 14h", event: "Visite — 3.5 pces Delémont", type: "visite" },
            { date: "Demain 10h", event: "Signature bail — Léa Dubois", type: "signature" },
            { date: "Ven. 16h", event: "État des lieux sortie — Rue Neuve 12", type: "edl" },
          ].map((e, i) => (
            <div key={i} style={{
              padding: "16px 0", borderBottom: i < 2 ? `1px solid ${COLORS.border}40` : "none",
              display: "flex", gap: 16, alignItems: "center"
            }}>
              <div style={{
                width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                background: `${COLORS.accent}12`, flexShrink: 0
              }}>
                <Icon name={e.type === "visite" ? "calendar" : e.type === "signature" ? "document" : "camera"}
                  size={18} color={COLORS.accent} />
              </div>
              <div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 14, color: COLORS.text }}>
                  {e.event}
                </div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.accent, marginTop: 2 }}>
                  {e.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PropertiesView = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: COLORS.text, fontWeight: 400 }}>
          Mes biens
        </h2>
        <button onClick={() => setShowModal("addProperty")} style={{
          background: COLORS.accent, color: COLORS.bg, border: "none",
          padding: "12px 28px", cursor: "pointer", fontSize: 13,
          fontFamily: "'DM Sans'", fontWeight: 600, letterSpacing: "0.04em",
          display: "flex", alignItems: "center", gap: 8
        }}>
          <Icon name="plus" size={16} color={COLORS.bg} /> Ajouter un bien
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        {[
          { title: "3.5 pces — Rue de la Gare 15", city: "Delémont", rent: "1'450", rooms: "3.5", status: "Publié", matches: 3, area: "78m²" },
          { title: "4.5 pces — Chemin du Verger 8", city: "Porrentruy", rent: "1'680", rooms: "4.5", status: "Loué", matches: 0, area: "95m²" },
          { title: "2.5 pces — Rue Neuve 12", city: "Courgenay", rent: "980", rooms: "2.5", status: "Publié", matches: 4, area: "52m²" },
          { title: "5.5 pces — Av. de la Liberté 3", city: "Delémont", rent: "2'200", rooms: "5.5", status: "Résiliation", matches: 0, area: "120m²" },
        ].map((p, i) => (
          <div key={i} style={{
            background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
            overflow: "hidden", transition: "all 0.3s", cursor: "pointer"
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${COLORS.accent}50`}
            onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
          >
            {/* Image placeholder */}
            <div style={{
              height: 160, background: `linear-gradient(135deg, ${COLORS.bgElevated}, ${COLORS.bgHover})`,
              display: "flex", alignItems: "center", justifyContent: "center", position: "relative"
            }}>
              <Icon name="photo" size={32} color={COLORS.textDim} />
              <div style={{
                position: "absolute", top: 12, right: 12,
                background: p.status === "Loué" ? COLORS.success + "20" : p.status === "Résiliation" ? COLORS.error + "20" : COLORS.accent + "20",
                color: p.status === "Loué" ? COLORS.success : p.status === "Résiliation" ? COLORS.error : COLORS.accent,
                padding: "4px 12px", fontFamily: "'DM Sans'", fontSize: 11,
                letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600
              }}>{p.status}</div>
            </div>
            <div style={{ padding: "24px" }}>
              <h3 style={{ fontFamily: "'DM Sans'", fontSize: 15, color: COLORS.text, fontWeight: 600, marginBottom: 4 }}>
                {p.title}
              </h3>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.textMuted, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="location" size={14} color={COLORS.textMuted} /> {p.city}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontFamily: "'Playfair Display'", fontSize: 22, color: COLORS.accent }}>
                    {p.rent}
                  </span>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.textMuted }}> CHF/mois</span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.textDim }}>
                    {p.rooms} pces
                  </span>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.textDim }}>
                    {p.area}
                  </span>
                </div>
              </div>
              {p.matches > 0 && (
                <div style={{
                  marginTop: 16, paddingTop: 16, borderTop: `1px solid ${COLORS.border}40`,
                  display: "flex", alignItems: "center", gap: 8
                }}>
                  <Icon name="heart" size={14} color={COLORS.accent} />
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.accent }}>
                    {p.matches} matchs compatibles
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const InventoryView = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: COLORS.text, fontWeight: 400 }}>
        État des lieux
      </h2>
      <div style={{
        background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, padding: 32
      }}>
        <div style={{
          fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.accent,
          letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: 24
        }}>
          État des lieux d'entrée — 3.5 pces Rue de la Gare 15
        </div>

        {/* Room selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {["Entrée", "Cuisine", "Salon", "Chambre 1", "Salle de bain", "Balcon", "Cave"].map((room, i) => (
            <button key={room} style={{
              background: i === 0 ? COLORS.accent + "20" : "transparent",
              border: `1px solid ${i === 0 ? COLORS.accent + "50" : COLORS.border}`,
              color: i === 0 ? COLORS.accent : COLORS.textMuted,
              padding: "8px 18px", fontFamily: "'DM Sans'", fontSize: 13,
              cursor: "pointer", transition: "all 0.2s"
            }}>{room}</button>
          ))}
        </div>

        {/* Room details */}
        <div style={{
          background: COLORS.bgElevated, border: `1px solid ${COLORS.border}`,
          padding: 28
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 16, color: COLORS.text, fontWeight: 600 }}>
              Entrée
            </span>
            <span style={{
              fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.success,
              background: `${COLORS.success}15`, padding: "4px 12px"
            }}>4/6 éléments complétés</span>
          </div>

          {/* Checklist items */}
          {[
            { element: "Sols (parquet)", state: "Bon état", hasPhoto: true },
            { element: "Murs et peinture", state: "Bon état", hasPhoto: true },
            { element: "Plafond", state: "Bon état", hasPhoto: false },
            { element: "Porte d'entrée & serrure", state: "Légère usure", hasPhoto: true },
            { element: "Interrupteurs & prises", state: "—", hasPhoto: false },
            { element: "Éclairage", state: "—", hasPhoto: false },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 0", borderBottom: i < 5 ? `1px solid ${COLORS.border}30` : "none"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                  background: item.state !== "—" ? COLORS.accent + "20" : "transparent",
                  border: `1px solid ${item.state !== "—" ? COLORS.accent + "50" : COLORS.border}`
                }}>
                  {item.state !== "—" && <Icon name="check" size={13} color={COLORS.accent} />}
                </div>
                <span style={{
                  fontFamily: "'DM Sans'", fontSize: 14,
                  color: item.state !== "—" ? COLORS.text : COLORS.textDim
                }}>{item.element}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <select style={{
                  background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                  color: item.state === "Légère usure" ? COLORS.accentLight : COLORS.textMuted,
                  padding: "6px 12px", fontFamily: "'DM Sans'", fontSize: 12
                }} defaultValue={item.state}>
                  <option>—</option>
                  <option>Neuf</option>
                  <option>Bon état</option>
                  <option>Légère usure</option>
                  <option>Usure normale</option>
                  <option>Dégâts</option>
                </select>
                <button style={{
                  background: item.hasPhoto ? COLORS.accent + "20" : "transparent",
                  border: `1px solid ${item.hasPhoto ? COLORS.accent + "40" : COLORS.border}`,
                  padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                }}>
                  <Icon name="camera" size={14} color={item.hasPhoto ? COLORS.accent : COLORS.textDim} />
                  <span style={{
                    fontFamily: "'DM Sans'", fontSize: 11,
                    color: item.hasPhoto ? COLORS.accent : COLORS.textDim
                  }}>{item.hasPhoto ? "2 photos" : "Photo"}</span>
                </button>
              </div>
            </div>
          ))}

          {/* Comments */}
          <div style={{ marginTop: 20 }}>
            <textarea placeholder="Remarques pour cette pièce..." style={{
              width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`,
              color: COLORS.text, padding: 14, fontFamily: "'DM Sans'", fontSize: 13,
              resize: "vertical", minHeight: 60, outline: "none", boxSizing: "border-box"
            }} />
          </div>
        </div>

        {/* Signatures */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
          {["Signature propriétaire", "Signature locataire"].map((sig, i) => (
            <div key={i} style={{
              background: COLORS.bgElevated, border: `1px dashed ${COLORS.border}`,
              padding: 32, textAlign: "center", cursor: "pointer"
            }}>
              <Icon name="document" size={24} color={COLORS.textDim} />
              <div style={{
                fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.textDim, marginTop: 8
              }}>{sig}</div>
              <div style={{
                fontFamily: "'DM Sans'", fontSize: 11, color: COLORS.textDim, marginTop: 4
              }}>Toucher pour signer</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ArtisansView = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: COLORS.text, fontWeight: 400 }}>
          Artisans partenaires
        </h2>
        <div style={{
          display: "flex", gap: 8
        }}>
          {["Tous", "Plomberie", "Électricité", "Peinture", "Serrurerie"].map((cat, i) => (
            <button key={cat} style={{
              background: i === 0 ? COLORS.accent + "20" : "transparent",
              border: `1px solid ${i === 0 ? COLORS.accent + "50" : COLORS.border}`,
              color: i === 0 ? COLORS.accent : COLORS.textMuted,
              padding: "8px 16px", fontFamily: "'DM Sans'", fontSize: 12,
              cursor: "pointer"
            }}>{cat}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { name: "Plomberie Dupont", specialty: "Plomberie & sanitaire", rating: 4.8, jobs: 47, city: "Delémont", response: "< 2h" },
          { name: "ElectroPro Jura", specialty: "Électricité", rating: 4.9, jobs: 63, city: "Porrentruy", response: "< 4h" },
          { name: "Peintures Riat", specialty: "Peinture & rénovation", rating: 4.7, jobs: 31, city: "Courgenay", response: "< 24h" },
          { name: "Serrurier Express", specialty: "Serrurerie", rating: 4.6, jobs: 28, city: "Delémont", response: "< 1h" },
          { name: "Chauffage Suisse", specialty: "Chauffage & ventilation", rating: 4.8, jobs: 52, city: "Delémont", response: "< 4h" },
          { name: "Menuiserie Jobin", specialty: "Menuiserie", rating: 4.9, jobs: 19, city: "Saignelégier", response: "< 48h" },
        ].map((a, i) => (
          <div key={i} style={{
            background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
            padding: 24, transition: "all 0.3s", cursor: "pointer"
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${COLORS.accent}50`}
            onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, background: COLORS.accent + "15",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Icon name="wrench" size={20} color={COLORS.accent} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="star" size={14} color={COLORS.accent} />
                <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: COLORS.accent, fontWeight: 600 }}>
                  {a.rating}
                </span>
              </div>
            </div>
            <h3 style={{ fontFamily: "'DM Sans'", fontSize: 15, color: COLORS.text, fontWeight: 600, marginBottom: 4 }}>
              {a.name}
            </h3>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.textMuted, marginBottom: 16 }}>
              {a.specialty}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.textDim }}>
                📍 {a.city}
              </span>
              <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.success }}>
                ⚡ {a.response}
              </span>
            </div>
            <div style={{
              marginTop: 16, paddingTop: 12, borderTop: `1px solid ${COLORS.border}30`,
              fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.textDim
            }}>
              {a.jobs} interventions réalisées
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SearchView = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: COLORS.text, fontWeight: 400 }}>
        Trouver mon logement
      </h2>

      {/* Filters */}
      <div style={{
        background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, padding: 24,
        display: "flex", gap: 16, flexWrap: "wrap", alignItems: "end"
      }}>
        {[
          { label: "Localité", type: "text", placeholder: "Delémont, Porrentruy..." },
          { label: "Pièces", type: "select", options: ["2.5+", "3.5+", "4.5+", "5.5+"] },
          { label: "Budget max", type: "text", placeholder: "CHF/mois" },
          { label: "Surface min", type: "text", placeholder: "m²" },
        ].map((f, i) => (
          <div key={i} style={{ flex: f.type === "text" ? "1 1 180px" : "0 0 120px" }}>
            <div style={{
              fontFamily: "'DM Sans'", fontSize: 11, color: COLORS.textMuted,
              marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase"
            }}>{f.label}</div>
            {f.type === "text" ? (
              <input placeholder={f.placeholder} style={{
                width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                color: COLORS.text, padding: "10px 14px", fontFamily: "'DM Sans'", fontSize: 13,
                outline: "none", boxSizing: "border-box"
              }} />
            ) : (
              <select style={{
                width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                color: COLORS.textMuted, padding: "10px 14px", fontFamily: "'DM Sans'", fontSize: 13
              }}>
                {f.options.map(o => <option key={o}>{o}</option>)}
              </select>
            )}
          </div>
        ))}
        <button style={{
          background: COLORS.accent, color: COLORS.bg, border: "none",
          padding: "10px 32px", height: 42, fontFamily: "'DM Sans'", fontSize: 13,
          fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em"
        }}>Rechercher</button>
      </div>

      {/* Results */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        {[
          { title: "3.5 pces — Rue de la Gare 15", city: "Delémont", rent: "1'450", rooms: "3.5", area: "78m²", avail: "01.04.2026", match: 94 },
          { title: "2.5 pces — Rue Neuve 12", city: "Courgenay", rent: "980", rooms: "2.5", area: "52m²", avail: "15.03.2026", match: 87 },
          { title: "4 pces — Grand-Rue 44", city: "Porrentruy", rent: "1'350", rooms: "4", area: "88m²", avail: "01.05.2026", match: 79 },
          { title: "3.5 pces — Av. Liberté 21", city: "Delémont", rent: "1'520", rooms: "3.5", area: "82m²", avail: "01.04.2026", match: 72 },
        ].map((r, i) => (
          <div key={i} style={{
            background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
            overflow: "hidden", transition: "all 0.3s", cursor: "pointer"
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${COLORS.accent}50`}
            onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
          >
            <div style={{
              height: 140, background: `linear-gradient(135deg, ${COLORS.bgElevated}, ${COLORS.bgHover})`,
              display: "flex", alignItems: "center", justifyContent: "center", position: "relative"
            }}>
              <Icon name="photo" size={32} color={COLORS.textDim} />
              <div style={{
                position: "absolute", top: 12, left: 12,
                background: `${COLORS.success}20`, color: COLORS.success,
                padding: "4px 12px", fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 600
              }}>Match {r.match}%</div>
            </div>
            <div style={{ padding: 20 }}>
              <h3 style={{ fontFamily: "'DM Sans'", fontSize: 14, color: COLORS.text, fontWeight: 600, marginBottom: 8 }}>
                {r.title}
              </h3>
              <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.textDim }}>{r.rooms} pces</span>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.textDim }}>{r.area}</span>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.textDim }}>Dispo {r.avail}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Playfair Display'", fontSize: 20, color: COLORS.accent }}>
                  {r.rent} <span style={{ fontSize: 12, fontFamily: "'DM Sans'", color: COLORS.textMuted }}>CHF/mois</span>
                </span>
                <button style={{
                  background: COLORS.accent + "15", border: `1px solid ${COLORS.accent}40`,
                  color: COLORS.accent, padding: "6px 16px", fontFamily: "'DM Sans'", fontSize: 12,
                  cursor: "pointer"
                }}>Postuler</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MessagesView = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: COLORS.text, fontWeight: 400 }}>
        Messages
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 1, background: COLORS.border, minHeight: 500 }}>
        {/* Conversation list */}
        <div style={{ background: COLORS.bgCard }}>
          {[
            { name: "Sophie Müller", msg: "Merci pour la confirmation de visite !", time: "14:32", unread: true },
            { name: "Marc Bianchi", msg: "Est-ce que le parking est inclus ?", time: "Hier", unread: false },
            { name: "Plomberie Dupont", msg: "Intervention confirmée pour lundi", time: "Lun.", unread: false },
            { name: "Léa Dubois", msg: "J'ai signé le bail, merci !", time: "12.02", unread: false },
          ].map((c, i) => (
            <div key={i} style={{
              padding: "18px 20px", borderBottom: `1px solid ${COLORS.border}30`,
              cursor: "pointer", transition: "background 0.2s",
              background: i === 0 ? COLORS.bgElevated : "transparent"
            }}
              onMouseEnter={e => e.currentTarget.style.background = COLORS.bgElevated}
              onMouseLeave={e => { if (i !== 0) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{
                  fontFamily: "'DM Sans'", fontSize: 14, fontWeight: c.unread ? 600 : 400,
                  color: c.unread ? COLORS.text : COLORS.textMuted
                }}>{c.name}</span>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: COLORS.textDim }}>{c.time}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  fontFamily: "'DM Sans'", fontSize: 12,
                  color: c.unread ? COLORS.text : COLORS.textDim,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>{c.msg}</span>
                {c.unread && <div style={{ width: 7, height: 7, background: COLORS.accent, borderRadius: "50%", flexShrink: 0 }} />}
              </div>
            </div>
          ))}
        </div>
        {/* Chat area */}
        <div style={{ background: COLORS.bg, display: "flex", flexDirection: "column" }}>
          <div style={{
            padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: COLORS.bgCard
          }}>
            <div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 15, color: COLORS.text, fontWeight: 500 }}>
                Sophie Müller
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.success }}>
                En ligne
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                <Icon name="calendar" size={18} color={COLORS.textMuted} />
              </button>
              <button style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                <Icon name="document" size={18} color={COLORS.textMuted} />
              </button>
            </div>
          </div>
          <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { from: "them", text: "Bonjour, je suis très intéressée par le 3.5 pièces à Delémont.", time: "14:28" },
              { from: "me", text: "Bonjour Sophie ! Je vous propose une visite. Quelles sont vos disponibilités cette semaine ?", time: "14:30" },
              { from: "them", text: "Merci pour la confirmation de visite ! Je serai là jeudi à 14h.", time: "14:32" },
            ].map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.from === "me" ? "flex-end" : "flex-start",
                maxWidth: "70%"
              }}>
                <div style={{
                  background: msg.from === "me" ? COLORS.accent + "20" : COLORS.bgCard,
                  border: `1px solid ${msg.from === "me" ? COLORS.accent + "30" : COLORS.border}`,
                  padding: "12px 16px",
                  fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.text, lineHeight: 1.5
                }}>{msg.text}</div>
                <div style={{
                  fontFamily: "'DM Sans'", fontSize: 10, color: COLORS.textDim,
                  marginTop: 4, textAlign: msg.from === "me" ? "right" : "left"
                }}>{msg.time}</div>
              </div>
            ))}
          </div>
          <div style={{
            padding: "16px 24px", borderTop: `1px solid ${COLORS.border}`,
            display: "flex", gap: 12
          }}>
            <input placeholder="Votre message..." style={{
              flex: 1, background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
              color: COLORS.text, padding: "12px 16px", fontFamily: "'DM Sans'", fontSize: 13,
              outline: "none"
            }} />
            <button style={{
              background: COLORS.accent, color: COLORS.bg, border: "none",
              padding: "12px 24px", fontFamily: "'DM Sans'", fontSize: 13,
              fontWeight: 600, cursor: "pointer"
            }}>Envoyer</button>
          </div>
        </div>
      </div>
    </div>
  );

  const PaymentsView = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: COLORS.text, fontWeight: 400 }}>
        Paiements
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: COLORS.border }}>
        {[
          { label: "Reçu ce mois", value: "5'800 CHF", color: COLORS.success },
          { label: "En attente", value: "1'450 CHF", color: COLORS.accent },
          { label: "Commission immo.cool", value: "1'160 CHF", color: COLORS.info },
        ].map((s, i) => (
          <div key={i} style={{ background: COLORS.bgCard, padding: 28 }}>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.textMuted, marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {s.label}
            </div>
            <div style={{ fontFamily: "'Playfair Display'", fontSize: 28, color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, padding: 32 }}>
        <div style={{
          fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.accent,
          letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: 24
        }}>Historique des transactions</div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Date", "Locataire", "Bien", "Montant", "Statut"].map(h => (
                <th key={h} style={{
                  fontFamily: "'DM Sans'", fontSize: 11, color: COLORS.textDim,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  padding: "12px 16px", textAlign: "left",
                  borderBottom: `1px solid ${COLORS.border}`
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { date: "15.02.2026", tenant: "Léa Dubois", prop: "2.5 pces Courgenay", amount: "1'176 CHF", status: "Payé" },
              { date: "01.02.2026", tenant: "Marc Bianchi", prop: "4.5 pces Porrentruy", amount: "1'680 CHF", status: "Payé" },
              { date: "01.02.2026", tenant: "Sophie Müller", prop: "3.5 pces Delémont", amount: "1'450 CHF", status: "En attente" },
              { date: "15.01.2026", tenant: "Artisan — Plomberie Dupont", prop: "4.5 pces Porrentruy", amount: "450 CHF", status: "Payé" },
            ].map((tx, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}30` }}>
                <td style={{ padding: "14px 16px", fontFamily: "'JetBrains Mono'", fontSize: 12, color: COLORS.textDim }}>{tx.date}</td>
                <td style={{ padding: "14px 16px", fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.text }}>{tx.tenant}</td>
                <td style={{ padding: "14px 16px", fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.textMuted }}>{tx.prop}</td>
                <td style={{ padding: "14px 16px", fontFamily: "'Playfair Display'", fontSize: 14, color: COLORS.accent }}>{tx.amount}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    fontFamily: "'DM Sans'", fontSize: 11,
                    color: tx.status === "Payé" ? COLORS.success : COLORS.accent,
                    background: tx.status === "Payé" ? COLORS.success + "15" : COLORS.accent + "15",
                    padding: "4px 10px"
                  }}>{tx.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    if (userType === "owner") {
      switch (activeTab) {
        case "dashboard": return <DashboardOwner />;
        case "properties": return <PropertiesView />;
        case "inventory": return <InventoryView />;
        case "artisans": return <ArtisansView />;
        case "messages": return <MessagesView />;
        case "payments": return <PaymentsView />;
        default: return <DashboardOwner />;
      }
    } else {
      switch (activeTab) {
        case "dashboard": return <DashboardOwner />;
        case "search": return <SearchView />;
        case "inventory": return <InventoryView />;
        case "messages": return <MessagesView />;
        case "payments": return <PaymentsView />;
        default: return <DashboardOwner />;
      }
    }
  };

  // ─── APP LAYOUT ───
  const AppLayout = () => (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg }}>
      {/* Sidebar */}
      <div style={{
        width: 260, background: COLORS.bgCard, borderRight: `1px solid ${COLORS.border}`,
        display: "flex", flexDirection: "column", flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{
          padding: "24px 24px", borderBottom: `1px solid ${COLORS.border}`,
          display: "flex", alignItems: "center", gap: 10
        }}>
          <SwissIcon size={24} />
          <span style={{
            fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600,
            color: COLORS.text
          }}>
            immo<span style={{ color: COLORS.accent }}>.cool</span>
          </span>
        </div>

        {/* Role badge */}
        <div style={{
          margin: "20px 20px 8px", padding: "10px 14px",
          background: COLORS.accent + "10", border: `1px solid ${COLORS.accent}25`
        }}>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: COLORS.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {userType === "owner" ? "Espace propriétaire" : "Espace locataire"}
          </div>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, padding: "12px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
              background: activeTab === item.id ? COLORS.accent + "12" : "transparent",
              border: "none", cursor: "pointer", width: "100%", textAlign: "left",
              transition: "all 0.2s",
              borderLeft: activeTab === item.id ? `2px solid ${COLORS.accent}` : "2px solid transparent"
            }}
              onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.background = COLORS.bgHover; }}
              onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon name={item.icon} size={18} color={activeTab === item.id ? COLORS.accent : COLORS.textDim} />
              <span style={{
                fontFamily: "'DM Sans'", fontSize: 13,
                color: activeTab === item.id ? COLORS.accent : COLORS.textMuted,
                fontWeight: activeTab === item.id ? 500 : 400
              }}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${COLORS.border}` }}>
          <button onClick={() => navigate("landing")} style={{
            display: "flex", alignItems: "center", gap: 10, background: "none",
            border: "none", cursor: "pointer", padding: "8px 0"
          }}>
            <Icon name="logout" size={16} color={COLORS.textDim} />
            <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.textDim }}>
              Retour à l'accueil
            </span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{
          padding: "16px 32px", borderBottom: `1px solid ${COLORS.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: COLORS.bgCard
        }}>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.textDim }}>
            {new Date().toLocaleDateString("fr-CH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
              <Icon name="bell" size={20} color={COLORS.textMuted} />
              <div style={{
                position: "absolute", top: -2, right: -2, width: 8, height: 8,
                background: COLORS.error, borderRadius: "50%"
              }} />
            </button>
            <div style={{
              width: 34, height: 34, background: COLORS.accent + "20",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'DM Sans'", fontSize: 13, color: COLORS.accent, fontWeight: 600
            }}>OL</div>
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1, padding: 32, overflowY: "auto",
          opacity: animateIn ? 1 : 0, transition: "opacity 0.3s ease"
        }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );

  // ─── ADD PROPERTY MODAL ───
  const AddPropertyModal = () => (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
      backdropFilter: "blur(4px)"
    }}
      onClick={() => setShowModal(null)}
    >
      <div style={{
        background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
        width: 600, maxHeight: "80vh", overflow: "auto", padding: 40
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 24, color: COLORS.text, fontWeight: 400 }}>
            Nouveau bien
          </h2>
          <button onClick={() => setShowModal(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Icon name="close" size={20} color={COLORS.textMuted} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { label: "Adresse", placeholder: "Rue, numéro" },
            { label: "NPA / Localité", placeholder: "2800 Delémont" },
          ].map((f, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: COLORS.textMuted, marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {f.label}
              </div>
              <input placeholder={f.placeholder} style={{
                width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                color: COLORS.text, padding: "12px 14px", fontFamily: "'DM Sans'", fontSize: 13,
                outline: "none", boxSizing: "border-box"
              }} />
            </div>
          ))}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              { label: "Nb de pièces", placeholder: "3.5" },
              { label: "Surface (m²)", placeholder: "78" },
              { label: "Étage", placeholder: "2ème" },
            ].map((f, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: COLORS.textMuted, marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {f.label}
                </div>
                <input placeholder={f.placeholder} style={{
                  width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                  color: COLORS.text, padding: "12px 14px", fontFamily: "'DM Sans'", fontSize: 13,
                  outline: "none", boxSizing: "border-box"
                }} />
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: COLORS.textMuted, marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Loyer mensuel (CHF)
            </div>
            <input placeholder="1'450" style={{
              width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`,
              color: COLORS.text, padding: "12px 14px", fontFamily: "'DM Sans'", fontSize: 13,
              outline: "none", boxSizing: "border-box"
            }} />
          </div>

          <div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: COLORS.textMuted, marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Caractéristiques
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Balcon", "Cave", "Grenier", "Parking", "Buanderie", "Animaux OK", "Cuisine ouverte", "Ascenseur", "Meublé"].map((tag, i) => (
                <button key={tag} style={{
                  background: i < 3 ? COLORS.accent + "15" : "transparent",
                  border: `1px solid ${i < 3 ? COLORS.accent + "40" : COLORS.border}`,
                  color: i < 3 ? COLORS.accent : COLORS.textMuted,
                  padding: "7px 14px", fontFamily: "'DM Sans'", fontSize: 12,
                  cursor: "pointer", transition: "all 0.2s"
                }}>{tag}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: COLORS.textMuted, marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Détail des pièces (pour l'état des lieux)
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Entrée", "Cuisine", "Salon", "Chambre 1", "Chambre 2", "Salle de bain", "WC", "Balcon", "Cave"].map((room, i) => (
                <span key={room} style={{
                  background: COLORS.accent + "10", border: `1px solid ${COLORS.accent}25`,
                  padding: "6px 12px", fontFamily: "'DM Sans'", fontSize: 12, color: COLORS.accent
                }}>{room}</span>
              ))}
            </div>
          </div>

          <button style={{
            width: "100%", background: COLORS.accent, color: COLORS.bg,
            border: "none", padding: "14px", fontFamily: "'DM Sans'",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            letterSpacing: "0.04em", marginTop: 8
          }}>
            Publier l'annonce
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        ${fonts}
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${COLORS.bg}; }
        ::selection { background: ${COLORS.accent}40; color: ${COLORS.text}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; }
        ::-webkit-scrollbar-thumb:hover { background: ${COLORS.textDim}; }
        input::placeholder, textarea::placeholder { color: ${COLORS.textDim}; }
        select { appearance: none; cursor: pointer; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

      {currentView === "landing" ? <LandingPage /> : <AppLayout />}
      {showModal === "addProperty" && <AddPropertyModal />}
    </>
  );
}
