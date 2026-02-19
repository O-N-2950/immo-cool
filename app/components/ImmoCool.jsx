"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════
// DESIGN SYSTEM
// ═══════════════════════════════════════════

const C = {
  bg: "#070809", bgCard: "#0F1114", bgElevated: "#161A1F", bgHover: "#1E2228",
  accent: "#C8A55C", accentLight: "#E8D5A0", accentDark: "#9E7F3A", accentGlow: "rgba(200,165,92,0.12)",
  text: "#F2F0ED", textMuted: "#8A8D94", textDim: "#5A5D64", border: "#22262D",
  success: "#4ADE80", error: "#F87171", info: "#60A5FA", white: "#FFFFFF",
  gradient: "linear-gradient(135deg, #C8A55C 0%, #E8D5A0 50%, #C8A55C 100%)",
};

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');`;

// ═══════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════

const SwissIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="3" fill="#FF0000"/>
    <path d="M10 6h4v12h-4z" fill="white"/><path d="M6 10h12v4H6z" fill="white"/>
  </svg>
);

const Icon = ({ name, size = 20, color = C.textMuted }) => {
  const d = {
    home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    building: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    heart: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    check: "M5 13l4 4L19 7",
    star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    chat: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    tool: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    document: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    money: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
    location: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
    close: "M6 18L18 6M6 6l12 12",
    menu: "M4 6h16M4 12h16M4 18h16",
    plus: "M12 4v16m8-8H4",
    photo: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    wrench: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
    logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    filter: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z",
    chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    scale: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
    globe: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
    lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    trending: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={d[name] || d.home}/>
    </svg>
  );
};

// ═══════════════════════════════════════════
// ANIMATED COUNTER
// ═══════════════════════════════════════════

const Counter = ({ target, suffix = "", prefix = "" }) => {
  const [val, setVal] = useState(0);
  const [go, setGo] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true); }, { threshold: 0.3 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  useEffect(() => {
    if (!go) return;
    let c = 0; const s = 50; const inc = target / s;
    const t = setInterval(() => { c += inc; if (c >= target) { setVal(target); clearInterval(t); } else setVal(Math.floor(c)); }, 40);
    return () => clearInterval(t);
  }, [go, target]);
  return <span ref={ref}>{prefix}{val.toLocaleString("fr-CH")}{suffix}</span>;
};

// ═══════════════════════════════════════════
// CANTONAL DATA (inline for frontend)
// ═══════════════════════════════════════════

const CANTONS_DATA = {
  JU: { name: "Jura", dates: ["31 mars","30 juin","30 sept.","31 déc."], formRequired: false, penurie: false },
  VD: { name: "Vaud", dates: ["1er janv.","1er avril","1er juill.","1er oct."], formRequired: true, penurie: true, rules: ["RULV applicables","État des lieux obligatoire","Cautionnement simple uniquement"] },
  GE: { name: "Genève", dates: ["Pas de dates locales"], formRequired: true, penurie: true, rules: ["Plafond loyer après rénovation","Logements subventionnés art. 24"] },
  NE: { name: "Neuchâtel", dates: ["31 mars","30 juin","30 sept."], formRequired: true, penurie: true },
  FR: { name: "Fribourg", dates: ["31 mars","30 juin","30 sept.","31 déc."], formRequired: true, penurie: true },
  VS: { name: "Valais", dates: ["Pas de dates locales"], formRequired: false, penurie: false },
  BE: { name: "Berne", dates: ["30 avril","31 oct."], formRequired: true, penurie: true },
  ZH: { name: "Zurich", dates: ["31 mars","30 sept."], formRequired: true, penurie: true },
  BS: { name: "Bâle-Ville", dates: ["Chaque fin de mois (sauf déc.)"], formRequired: true, penurie: true },
  LU: { name: "Lucerne", dates: ["Pas de dates locales"], formRequired: true, penurie: true },
  ZG: { name: "Zoug", dates: ["31 mars","30 juin","30 sept."], formRequired: true, penurie: true },
};

// ═══════════════════════════════════════════
// DEMO DATA
// ═══════════════════════════════════════════

const DEMO_PROPERTIES = [
  { id: 1, title: "3.5 pièces lumineux", city: "Delémont", canton: "JU", rooms: 3.5, rent: 1350, charges: 180, surface: 85, floor: 2, balcony: true, parking: true, elevator: false, img: "🏠", available: "2026-04-01", status: "active" },
  { id: 2, title: "4.5 pièces avec vue", city: "Porrentruy", canton: "JU", rooms: 4.5, rent: 1580, charges: 200, surface: 110, floor: 3, balcony: true, parking: true, elevator: true, img: "🏡", available: "2026-05-01", status: "active" },
  { id: 3, title: "2.5 pièces rénové", city: "Lausanne", canton: "VD", rooms: 2.5, rent: 1680, charges: 220, surface: 55, floor: 4, balcony: false, parking: false, elevator: true, img: "🏢", available: "2026-04-01", status: "active" },
  { id: 4, title: "5.5 pièces familial", city: "Neuchâtel", canton: "NE", rooms: 5.5, rent: 2100, charges: 280, surface: 140, floor: 1, balcony: true, parking: true, elevator: false, img: "🏘️", available: "2026-06-01", status: "active" },
  { id: 5, title: "3.5 pièces centre-ville", city: "Fribourg", canton: "FR", rooms: 3.5, rent: 1520, charges: 190, surface: 78, floor: 2, balcony: true, parking: false, elevator: true, img: "🏙️", available: "2026-03-15", status: "active" },
  { id: 6, title: "Studio meublé", city: "Genève", canton: "GE", rooms: 1.5, rent: 1250, charges: 100, surface: 32, floor: 5, balcony: false, parking: false, elevator: true, img: "🏨", available: "2026-03-01", status: "active" },
];

const DEMO_ARTISANS = [
  { id: 1, name: "Müller Plomberie", specialty: "Plomberie", city: "Delémont", canton: "JU", rating: 4.8, reviews: 47, hourly: 85 },
  { id: 2, name: "Électro Suisse Sàrl", specialty: "Électricité", city: "Porrentruy", canton: "JU", rating: 4.9, reviews: 32, hourly: 90 },
  { id: 3, name: "Peintex", specialty: "Peinture", city: "Delémont", canton: "JU", rating: 4.6, reviews: 28, hourly: 75 },
  { id: 4, name: "Serrurier Express", specialty: "Serrurerie", city: "Delémont", canton: "JU", rating: 4.7, reviews: 61, hourly: 95 },
];

const DEMO_MESSAGES = [
  { id: 1, from: "Marie Dupont", subject: "Visite 3.5 pièces", preview: "Bonjour, je souhaiterais visiter l'appartement...", time: "10:32", unread: true },
  { id: 2, from: "Pierre Martin", subject: "Documents complémentaires", preview: "Voici les attestations d'assurance demandées...", time: "Hier", unread: true },
  { id: 3, from: "immo.cool", subject: "Nouveau match !", preview: "Un nouveau locataire correspond à votre bien...", time: "Lun.", unread: false },
];

// ═══════════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════════

const globalCSS = `
${fonts}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: ${C.bg}; color: ${C.text}; font-family: 'DM Sans', sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
::selection { background: ${C.accent}; color: ${C.bg}; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: ${C.bg}; }
::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: ${C.textDim}; }
input, select, textarea { font-family: 'DM Sans', sans-serif; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
@keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(200,165,92,0.15); } 50% { box-shadow: 0 0 40px rgba(200,165,92,0.3); } }
@keyframes scaleIn { from { opacity:0; transform: scale(0.95); } to { opacity:1; transform: scale(1); } }
@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
@keyframes typewriter { from { width: 0; } to { width: 100%; } }

.fade-up { animation: fadeUp 0.7s ease-out forwards; opacity: 0; }
.fade-in { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
.slide-in { animation: slideIn 0.5s ease-out forwards; opacity: 0; }
.stagger-1 { animation-delay: 0.1s; } .stagger-2 { animation-delay: 0.2s; } .stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; } .stagger-5 { animation-delay: 0.5s; } .stagger-6 { animation-delay: 0.6s; }
`;

// ═══════════════════════════════════════════
// SHARED UI COMPONENTS
// ═══════════════════════════════════════════

const Btn = ({ children, variant = "primary", onClick, style, disabled, full }) => {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans'",
    cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.3s ease", border: "none",
    opacity: disabled ? 0.5 : 1, width: full ? "100%" : "auto",
  };
  const variants = {
    primary: { ...base, background: C.gradient, color: C.bg, backgroundSize: "200% 200%", },
    secondary: { ...base, background: "transparent", color: C.accent, border: `1.5px solid ${C.accent}`, },
    ghost: { ...base, background: "transparent", color: C.textMuted, },
    danger: { ...base, background: "transparent", color: C.error, border: `1.5px solid ${C.error}`, },
  };
  return <button style={{ ...variants[variant], ...style }} onClick={onClick} disabled={disabled}
    onMouseEnter={e => { if (!disabled) { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 8px 30px ${C.accentGlow}`; }}}
    onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
  >{children}</button>;
};

const Card = ({ children, style, onClick, hover = true, glow = false }) => (
  <div style={{
    background: C.bgCard, borderRadius: 16, border: `1px solid ${C.border}`,
    padding: 24, transition: "all 0.3s ease", cursor: onClick ? "pointer" : "default",
    ...(glow ? { animation: "glow 3s ease-in-out infinite" } : {}), ...style,
  }} onClick={onClick}
    onMouseEnter={e => { if(hover) { e.currentTarget.style.borderColor = C.accent + "40"; e.currentTarget.style.transform = "translateY(-2px)"; }}}
    onMouseLeave={e => { if(hover) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}}
  >{children}</div>
);

const Badge = ({ children, color = C.accent, style }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 6,
    fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase",
    background: color + "18", color: color, ...style,
  }}>{children}</span>
);

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 13, color: C.textMuted, marginBottom: 6, fontWeight: 500 }}>{label}</label>}
    <input {...props} style={{
      width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`,
      background: C.bgElevated, color: C.text, fontSize: 14, fontFamily: "'DM Sans'",
      outline: "none", transition: "border-color 0.3s",
      ...props.style,
    }} onFocus={e => e.target.style.borderColor = C.accent}
       onBlur={e => e.target.style.borderColor = C.border} />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 13, color: C.textMuted, marginBottom: 6, fontWeight: 500 }}>{label}</label>}
    <select {...props} style={{
      width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`,
      background: C.bgElevated, color: C.text, fontSize: 14, fontFamily: "'DM Sans'",
      outline: "none", appearance: "none", cursor: "pointer", ...props.style,
    }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const StatCard = ({ icon, label, value, sub, color = C.accent }) => (
  <Card style={{ textAlign: "center", padding: "20px 16px" }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
      <Icon name={icon} size={22} color={color}/>
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display'", color: C.text, marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 2 }}>{label}</div>
    {sub && <div style={{ fontSize: 12, color: color }}>{sub}</div>}
  </Card>
);

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════

export default function ImmoCoolApp() {
  const [view, setView] = useState("landing");
  const [userType, setUserType] = useState(null); // "owner" | "tenant"
  const [tab, setTab] = useState("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [searchFilters, setSearchFilters] = useState({ canton: "", maxRent: "", minRooms: "" });
  const [selectedCanton, setSelectedCanton] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, [view, tab]);

  const navigate = useCallback((v, type) => {
    setView(v);
    if (type) setUserType(type);
    setTab("dashboard");
    setMobileMenu(false);
  }, []);

  // ═══════════════════════════════════════════
  // LANDING PAGE
  // ═══════════════════════════════════════════

  const Landing = () => {
    const [heroReady, setHeroReady] = useState(false);
    useEffect(() => { setTimeout(() => setHeroReady(true), 100); }, []);

    return (
      <div style={{ minHeight: "100vh" }}>
        {/* NAV */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(7,8,9,0.85)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}20`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("landing")}>
            <SwissIcon size={26}/> 
            <span style={{ fontFamily: "'Playfair Display'", fontSize: 22, fontWeight: 700, color: C.text }}>immo<span style={{ color: C.accent }}>.cool</span></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Btn variant="ghost" onClick={() => { setAuthMode("login"); navigate("auth"); }} style={{ fontSize: 13, padding: "8px 16px" }}>Connexion</Btn>
            <Btn onClick={() => { setAuthMode("register"); navigate("auth"); }} style={{ fontSize: 13, padding: "8px 18px" }}>Créer un compte</Btn>
          </div>
        </nav>

        {/* HERO */}
        <section style={{
          minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden",
        }}>
          {/* Background effects */}
          <div style={{ position: "absolute", top: "15%", left: "10%", width: 500, height: 500, borderRadius: "50%",
            background: `radial-gradient(circle, ${C.accent}08 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }}/>
          <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%",
            background: `radial-gradient(circle, ${C.info}05 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }}/>
          
          {/* Grid overlay */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.03,
            backgroundImage: `linear-gradient(${C.accent} 1px, transparent 1px), linear-gradient(90deg, ${C.accent} 1px, transparent 1px)`,
            backgroundSize: "60px 60px", pointerEvents: "none" }}/>

          <div style={{ position: "relative", zIndex: 1, maxWidth: 800, opacity: heroReady ? 1 : 0, transform: heroReady ? "translateY(0)" : "translateY(40px)", transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            <Badge color={C.success} style={{ marginBottom: 24, fontSize: 12 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.success, marginRight: 6, display: "inline-block", animation: "pulse 2s infinite" }}/>
              100% gratuit pour les locataires
            </Badge>
            
            <h1 style={{ fontFamily: "'Playfair Display'", fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.02em" }}>
              L'immobilier suisse,<br/>
              <span style={{ background: C.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% 200%", animation: "gradientShift 4s ease infinite" }}>
                réinventé.
              </span>
            </h1>

            <p style={{ fontSize: 18, color: C.textMuted, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px" }}>
              La première plateforme qui élimine les régies. Publiez, trouvez, signez — 
              avec le respect automatique des <span style={{ color: C.accent }}>26 réglementations cantonales</span>.
            </p>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn onClick={() => { setAuthMode("register"); navigate("auth"); }} style={{ padding: "16px 36px", fontSize: 16 }}>
                Commencer gratuitement <Icon name="arrow" size={18} color={C.bg}/>
              </Btn>
              <Btn variant="secondary" onClick={() => navigate("app", "tenant")} style={{ padding: "16px 32px", fontSize: 16 }}>
                Explorer les biens
              </Btn>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section style={{ background: C.bgCard, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "48px 24px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, textAlign: "center" }}>
            {[
              { val: <Counter target={50} suffix="%" />, label: "moins cher qu'une régie" },
              { val: <Counter target={26} />, label: "cantons couverts" },
              { val: <Counter target={0} prefix="CHF " />, label: "pour les locataires" },
              { val: <Counter target={10} suffix=" min" />, label: "pour publier un bien" },
            ].map((s, i) => (
              <div key={i} className={`fade-up stagger-${i+1}`}>
                <div style={{ fontFamily: "'Playfair Display'", fontSize: 36, fontWeight: 700, color: C.accent, marginBottom: 8 }}>{s.val}</div>
                <div style={{ fontSize: 14, color: C.textMuted }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Badge style={{ marginBottom: 16 }}>Comment ça marche</Badge>
            <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 36, fontWeight: 600, marginBottom: 16 }}>
              Simple. Transparent. <span style={{ color: C.accent }}>Légal.</span>
            </h2>
            <p style={{ color: C.textMuted, fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
              Trois étapes pour remplacer votre régie immobilière.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { icon: "building", num: "01", title: "Publiez", desc: "Ajoutez votre bien en 10 minutes. Notre moteur cantonal génère automatiquement les formulaires légaux obligatoires.", color: C.accent },
              { icon: "search", num: "02", title: "Matchez", desc: "Notre algorithme de matching trouve les locataires fiables qui correspondent à votre bien. Score de compatibilité intelligent.", color: C.info },
              { icon: "shield", num: "03", title: "Signez", desc: "Bail conforme aux 26 réglementations cantonales. Signature électronique. État des lieux intégré. Garantie de loyer.", color: C.success },
            ].map((step, i) => (
              <Card key={i} style={{ padding: 32, position: "relative", overflow: "hidden" }} glow={i === 0}>
                <div style={{ position: "absolute", top: 16, right: 20, fontFamily: "'Playfair Display'", fontSize: 64, fontWeight: 700, color: step.color + "08" }}>{step.num}</div>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: step.color + "12", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon name={step.icon} size={26} color={step.color}/>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display'", fontSize: 22, fontWeight: 600, marginBottom: 12 }}>{step.title}</h3>
                <p style={{ color: C.textMuted, lineHeight: 1.7, fontSize: 14 }}>{step.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section style={{ padding: "80px 24px", background: C.bgCard, borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Badge color={C.success} style={{ marginBottom: 16 }}>Tarifs</Badge>
              <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 36, fontWeight: 600, marginBottom: 16 }}>
                Pas de frais cachés. <span style={{ color: C.accent }}>Jamais.</span>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              {/* TENANT */}
              <Card style={{ padding: 36, border: `2px solid ${C.success}30`, position: "relative" }}>
                <Badge color={C.success} style={{ position: "absolute", top: -12, left: 24 }}>Populaire</Badge>
                <div style={{ marginBottom: 8 }}>
                  <Icon name="user" size={20} color={C.success}/>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display'", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Locataire</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                  <span style={{ fontFamily: "'Playfair Display'", fontSize: 48, fontWeight: 700, color: C.success }}>CHF 0</span>
                  <span style={{ color: C.textMuted, fontSize: 14 }}>/ toujours</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                  {["Recherche illimitée","Candidatures illimitées","Algorithme de matching","Vérification de dossier","Messagerie directe","Alertes personnalisées"].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: C.textMuted }}>
                      <Icon name="check" size={16} color={C.success}/> {f}
                    </div>
                  ))}
                </div>
                <Btn full onClick={() => navigate("app", "tenant")} style={{ background: C.success, color: C.bg }}>Chercher un logement</Btn>
              </Card>

              {/* OWNER */}
              <Card style={{ padding: 36, border: `2px solid ${C.accent}30` }}>
                <div style={{ marginBottom: 8 }}>
                  <Icon name="building" size={20} color={C.accent}/>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display'", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Propriétaire</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display'", fontSize: 48, fontWeight: 700, color: C.accent }}>50%</span>
                  <span style={{ color: C.textMuted, fontSize: 14 }}>du 1er loyer</span>
                </div>
                <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>Payé uniquement quand un bail est signé. Pas de frais mensuels, pas d'abonnement.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                  {["Publication illimitée","Matching intelligent","Moteur de règles 26 cantons","Bail conforme auto-généré","Formulaires officiels","Artisans vérifiés (-90% vs régie)"].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: C.textMuted }}>
                      <Icon name="check" size={16} color={C.accent}/> {f}
                    </div>
                  ))}
                </div>
                <Btn full onClick={() => navigate("app", "owner")}>Publier mon bien</Btn>
              </Card>
            </div>

            {/* Comparison */}
            <Card style={{ marginTop: 32, padding: 32, background: C.bgElevated, textAlign: "center" }}>
              <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 8 }}>Comparaison pour un loyer de CHF 1'500/mois</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 13, color: C.textDim, marginBottom: 4 }}>Régie traditionnelle</div>
                  <div style={{ fontFamily: "'Playfair Display'", fontSize: 28, fontWeight: 700, color: C.error, textDecoration: "line-through" }}>CHF 1'500</div>
                  <div style={{ fontSize: 12, color: C.textDim }}>100% du premier loyer</div>
                </div>
                <div style={{ width: 1, background: C.border, alignSelf: "stretch" }}/>
                <div>
                  <div style={{ fontSize: 13, color: C.accent, marginBottom: 4, fontWeight: 600 }}>immo.cool</div>
                  <div style={{ fontFamily: "'Playfair Display'", fontSize: 28, fontWeight: 700, color: C.success }}>CHF 750</div>
                  <div style={{ fontSize: 12, color: C.success }}>50% du premier loyer</div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* CANTONAL ENGINE SHOWCASE */}
        <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Badge color={C.info} style={{ marginBottom: 16 }}>Innovation</Badge>
            <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 36, fontWeight: 600, marginBottom: 16 }}>
              Moteur de règles <span style={{ color: C.accent }}>26 cantons</span>
            </h2>
            <p style={{ color: C.textMuted, fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
              Chaque canton a ses propres règles. Notre moteur les connaît toutes et génère automatiquement les documents conformes.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {Object.entries(CANTONS_DATA).map(([code, c]) => (
              <Card key={code} style={{ padding: 16, cursor: "pointer", textAlign: "center",
                border: selectedCanton === code ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                background: selectedCanton === code ? C.accent + "08" : C.bgCard,
              }} onClick={() => setSelectedCanton(selectedCanton === code ? null : code)}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 18, fontWeight: 600, color: C.accent, marginBottom: 4 }}>{code}</div>
                <div style={{ fontSize: 13, color: C.text, marginBottom: 4 }}>{c.name}</div>
                <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                  {c.formRequired && <Badge color={C.info} style={{ fontSize: 9, padding: "2px 6px" }}>Form.</Badge>}
                  {c.penurie && <Badge color={C.error} style={{ fontSize: 9, padding: "2px 6px" }}>Pénurie</Badge>}
                </div>
              </Card>
            ))}
          </div>

          {selectedCanton && CANTONS_DATA[selectedCanton] && (
            <Card style={{ marginTop: 24, padding: 32, border: `1px solid ${C.accent}30`, animation: "scaleIn 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display'", fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
                    {CANTONS_DATA[selectedCanton].name} <span style={{ color: C.textDim }}>({selectedCanton})</span>
                  </h3>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                    <Badge color={CANTONS_DATA[selectedCanton].formRequired ? C.info : C.textDim}>
                      Formulaire loyer initial: {CANTONS_DATA[selectedCanton].formRequired ? "OBLIGATOIRE" : "Non requis"}
                    </Badge>
                    <Badge color={CANTONS_DATA[selectedCanton].penurie ? C.error : C.success}>
                      {CANTONS_DATA[selectedCanton].penurie ? "Pénurie déclarée" : "Pas de pénurie"}
                    </Badge>
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 48, fontWeight: 700, color: C.accent + "15" }}>{selectedCanton}</div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>Dates de résiliation officielles</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {CANTONS_DATA[selectedCanton].dates.map((d, i) => (
                    <span key={i} style={{ padding: "6px 14px", borderRadius: 8, background: C.bgElevated, fontSize: 13, color: C.text, border: `1px solid ${C.border}` }}>{d}</span>
                  ))}
                </div>
              </div>

              {CANTONS_DATA[selectedCanton].rules && (
                <div>
                  <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>Règles spécifiques</div>
                  {CANTONS_DATA[selectedCanton].rules.map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.text, marginBottom: 6 }}>
                      <Icon name="check" size={14} color={C.accent}/> {r}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </section>

        {/* CTA FINAL */}
        <section style={{ padding: "80px 24px", textAlign: "center", background: C.bgCard, borderTop: `1px solid ${C.border}` }}>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 32, fontWeight: 600, marginBottom: 16 }}>
            Prêt à éliminer les frais de régie ?
          </h2>
          <p style={{ color: C.textMuted, fontSize: 16, marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
            Rejoignez les propriétaires et locataires qui font confiance à immo.cool
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => navigate("app", "owner")} style={{ padding: "16px 36px", fontSize: 16 }}>
              <Icon name="building" size={18} color={C.bg}/> Je suis propriétaire
            </Btn>
            <Btn variant="secondary" onClick={() => navigate("app", "tenant")} style={{ padding: "16px 36px", fontSize: 16 }}>
              <Icon name="search" size={18} color={C.accent}/> Je cherche un logement
            </Btn>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: "40px 24px", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
            <SwissIcon size={18}/> 
            <span style={{ fontFamily: "'Playfair Display'", fontSize: 16, fontWeight: 600 }}>immo<span style={{ color: C.accent }}>.cool</span></span>
          </div>
          <p style={{ color: C.textDim, fontSize: 12 }}>
            © 2026 immo.cool — La plateforme immobilière 100% gratuite pour les locataires
          </p>
          <p style={{ color: C.textDim, fontSize: 11, marginTop: 4 }}>
            Conforme CO art. 253-274g · OBLF · 26 réglementations cantonales
          </p>
        </footer>
      </div>
    );
  };

  // ═══════════════════════════════════════════
  // AUTH PAGE
  // ═══════════════════════════════════════════

  const AuthPage = () => {
    const [mode, setMode] = useState(authMode);
    const [role, setRole] = useState("TENANT");
    const [formData, setFormData] = useState({ email: "", password: "", firstName: "", lastName: "", phone: "" });

    const handleSubmit = () => {
      // Demo: skip actual auth, go to dashboard
      navigate("app", role === "TENANT" ? "tenant" : "owner");
    };

    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ position: "absolute", top: 24, left: 24, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }} onClick={() => navigate("landing")}>
          <SwissIcon size={22}/> <span style={{ fontFamily: "'Playfair Display'", fontSize: 18, fontWeight: 600 }}>immo<span style={{ color: C.accent }}>.cool</span></span>
        </div>

        <Card style={{ maxWidth: 440, width: "100%", padding: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 28, fontWeight: 600, textAlign: "center", marginBottom: 8 }}>
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </h2>
          <p style={{ textAlign: "center", color: C.textMuted, fontSize: 14, marginBottom: 32 }}>
            {mode === "login" ? "Accédez à votre espace" : "Rejoignez immo.cool gratuitement"}
          </p>

          {mode === "register" && (
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {[{ v: "TENANT", l: "Locataire", i: "user", sub: "Gratuit" }, { v: "LANDLORD", l: "Propriétaire", i: "building", sub: "50% 1er loyer" }].map(r => (
                <div key={r.v} onClick={() => setRole(r.v)} style={{
                  flex: 1, padding: "16px 12px", borderRadius: 12, border: `2px solid ${role === r.v ? C.accent : C.border}`,
                  background: role === r.v ? C.accent + "08" : "transparent", cursor: "pointer", textAlign: "center", transition: "all 0.3s",
                }}>
                  <Icon name={r.i} size={22} color={role === r.v ? C.accent : C.textDim}/>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6, color: role === r.v ? C.text : C.textMuted }}>{r.l}</div>
                  <div style={{ fontSize: 11, color: role === r.v ? C.accent : C.textDim, marginTop: 2 }}>{r.sub}</div>
                </div>
              ))}
            </div>
          )}

          {mode === "register" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
              <Input label="Prénom" placeholder="Jean" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}/>
              <Input label="Nom" placeholder="Dupont" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}/>
            </div>
          )}

          <Input label="Email" type="email" placeholder="jean@example.ch" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
          <Input label="Mot de passe" type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}/>
          
          <Btn full onClick={handleSubmit} style={{ marginTop: 8, padding: "14px 24px" }}>
            {mode === "login" ? "Se connecter" : "Créer mon compte"} <Icon name="arrow" size={16} color={C.bg}/>
          </Btn>

          <p style={{ textAlign: "center", fontSize: 13, color: C.textMuted, marginTop: 20 }}>
            {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}
            <span onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ color: C.accent, cursor: "pointer", marginLeft: 4, fontWeight: 600 }}>
              {mode === "login" ? "Créer un compte" : "Se connecter"}
            </span>
          </p>
        </Card>
      </div>
    );
  };

  // ═══════════════════════════════════════════
  // APP LAYOUT (Sidebar + Content)
  // ═══════════════════════════════════════════

  const ownerTabs = [
    { id: "dashboard", icon: "home", label: "Tableau de bord" },
    { id: "properties", icon: "building", label: "Mes biens" },
    { id: "search", icon: "search", label: "Recherche" },
    { id: "inventory", icon: "document", label: "États des lieux" },
    { id: "artisans", icon: "wrench", label: "Artisans" },
    { id: "messages", icon: "chat", label: "Messages" },
    { id: "cantonal", icon: "scale", label: "Règles cantonales" },
    { id: "payments", icon: "money", label: "Paiements" },
  ];
  const tenantTabs = [
    { id: "dashboard", icon: "home", label: "Tableau de bord" },
    { id: "search", icon: "search", label: "Chercher" },
    { id: "applications", icon: "document", label: "Candidatures" },
    { id: "inventory", icon: "document", label: "États des lieux" },
    { id: "messages", icon: "chat", label: "Messages" },
    { id: "cantonal", icon: "scale", label: "Mes droits" },
  ];

  const AppLayout = () => {
    const tabs = userType === "owner" ? ownerTabs : tenantTabs;

    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* SIDEBAR */}
        <aside style={{
          width: 240, position: "fixed", top: 0, left: 0, bottom: 0,
          background: C.bgCard, borderRight: `1px solid ${C.border}`,
          padding: "20px 12px", display: "flex", flexDirection: "column", zIndex: 50,
          transform: mobileMenu ? "translateX(0)" : undefined,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", marginBottom: 24, cursor: "pointer" }} onClick={() => navigate("landing")}>
            <SwissIcon size={22}/>
            <span style={{ fontFamily: "'Playfair Display'", fontSize: 18, fontWeight: 600 }}>immo<span style={{ color: C.accent }}>.cool</span></span>
          </div>

          <div style={{ flex: 1 }}>
            {tabs.map(t => (
              <div key={t.id} onClick={() => setTab(t.id)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
                borderRadius: 10, marginBottom: 2, cursor: "pointer", transition: "all 0.2s",
                background: tab === t.id ? C.accent + "12" : "transparent",
                color: tab === t.id ? C.accent : C.textMuted,
              }}
                onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.background = C.bgHover; }}
                onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon name={t.icon} size={18} color={tab === t.id ? C.accent : C.textDim}/>
                <span style={{ fontSize: 13, fontWeight: tab === t.id ? 600 : 400 }}>{t.label}</span>
                {t.id === "messages" && <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: C.accent }}/>}
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: C.accent + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="user" size={16} color={C.accent}/>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Olivier N.</div>
                <div style={{ fontSize: 11, color: C.textDim }}>{userType === "owner" ? "Propriétaire" : "Locataire"}</div>
              </div>
            </div>
            <div onClick={() => navigate("landing")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", cursor: "pointer", borderRadius: 8, marginTop: 4, color: C.textDim, fontSize: 13 }}
              onMouseEnter={e => e.currentTarget.style.background = C.bgHover}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <Icon name="logout" size={16} color={C.textDim}/> Déconnexion
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ marginLeft: 240, flex: 1, padding: "32px 40px", minHeight: "100vh" }}>
          {tab === "dashboard" && <DashboardView/>}
          {tab === "properties" && <PropertiesView/>}
          {tab === "search" && <SearchView/>}
          {tab === "inventory" && <InventoryView/>}
          {tab === "artisans" && <ArtisansView/>}
          {tab === "messages" && <MessagesView/>}
          {tab === "cantonal" && <CantonalView/>}
          {tab === "payments" && <PaymentsView/>}
          {tab === "applications" && <ApplicationsView/>}
        </main>
      </div>
    );
  };

  // ═══════════════════════════════════════════
  // DASHBOARD VIEW
  // ═══════════════════════════════════════════

  const DashboardView = () => (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 28, fontWeight: 600, marginBottom: 4 }}>
          Bonjour, Olivier 👋
        </h1>
        <p style={{ color: C.textMuted, fontSize: 14 }}>
          {userType === "owner" ? "Voici l'état de vos biens immobiliers" : "Voici votre recherche de logement"}
        </p>
      </div>

      {userType === "owner" ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            <StatCard icon="building" label="Biens actifs" value="3" sub="+1 ce mois" color={C.accent}/>
            <StatCard icon="user" label="Candidatures" value="12" sub="4 nouvelles" color={C.info}/>
            <StatCard icon="document" label="Baux actifs" value="2" color={C.success}/>
            <StatCard icon="money" label="Revenus mensuels" value="CHF 4'280" sub="Charges incluses" color={C.accent}/>
          </div>

          {/* Recent Activity */}
          <Card style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Playfair Display'", fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Activité récente</h3>
            {[
              { icon: "user", text: "Nouvelle candidature de Marie Dupont pour 3.5 pièces Delémont", time: "Il y a 2h", color: C.info },
              { icon: "check", text: "Bail signé — 4.5 pièces Porrentruy avec Pierre Martin", time: "Hier", color: C.success },
              { icon: "bell", text: "Rappel: état des lieux de sortie prévu le 15 mars", time: "Lundi", color: C.accent },
              { icon: "wrench", text: "Intervention plomberie confirmée — Müller Plomberie", time: "Ven.", color: C.info },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: a.color + "12", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={a.icon} size={16} color={a.color}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.text }}>{a.text}</div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </Card>
        </>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            <StatCard icon="search" label="Biens consultés" value="24" sub="Cette semaine" color={C.info}/>
            <StatCard icon="heart" label="Favoris" value="5" color={C.error}/>
            <StatCard icon="document" label="Candidatures" value="3" sub="1 en attente" color={C.accent}/>
            <StatCard icon="star" label="Score profil" value="78/100" sub="Bon profil" color={C.success}/>
          </div>

          <Card style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Playfair Display'", fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Biens recommandés pour vous</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {DEMO_PROPERTIES.slice(0, 3).map(p => (
                <PropertyCard key={p.id} property={p} onSelect={() => setSelectedProperty(p)}/>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );

  // ═══════════════════════════════════════════
  // PROPERTY CARD (reusable)
  // ═══════════════════════════════════════════

  const PropertyCard = ({ property: p, onSelect }) => (
    <Card style={{ padding: 0, overflow: "hidden", cursor: "pointer" }} onClick={onSelect}>
      <div style={{ height: 140, background: `linear-gradient(135deg, ${C.bgElevated}, ${C.bgHover})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, position: "relative" }}>
        {p.img}
        <Badge color={C.success} style={{ position: "absolute", top: 12, right: 12, fontSize: 10 }}>{p.status === "active" ? "Disponible" : "Loué"}</Badge>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
          <h4 style={{ fontSize: 15, fontWeight: 600 }}>{p.title}</h4>
          <Badge>{p.canton}</Badge>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.textMuted, marginBottom: 10 }}>
          <Icon name="location" size={12} color={C.textDim}/> {p.city}
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 12, color: C.textMuted, marginBottom: 12 }}>
          <span>{p.rooms} pcs</span>
          <span>{p.surface}m²</span>
          <span>Ét. {p.floor}</span>
          {p.balcony && <span>🌇 Balcon</span>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: "'Playfair Display'", fontSize: 20, fontWeight: 700, color: C.accent }}>CHF {p.rent.toLocaleString("fr-CH")}</span>
            <span style={{ fontSize: 12, color: C.textDim }}>/mois</span>
          </div>
          <span style={{ fontSize: 11, color: C.textDim }}>+ CHF {p.charges} charges</span>
        </div>
      </div>
    </Card>
  );

  // ═══════════════════════════════════════════
  // PROPERTIES VIEW (owner)
  // ═══════════════════════════════════════════

  const PropertiesView = () => (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 24, fontWeight: 600 }}>Mes biens</h1>
          <p style={{ color: C.textMuted, fontSize: 13 }}>{DEMO_PROPERTIES.length} biens enregistrés</p>
        </div>
        <Btn><Icon name="plus" size={16} color={C.bg}/> Ajouter un bien</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {DEMO_PROPERTIES.map(p => <PropertyCard key={p.id} property={p} onSelect={() => setSelectedProperty(p)}/>)}
      </div>

      {/* Property detail modal */}
      {selectedProperty && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => setSelectedProperty(null)}>
          <Card style={{ maxWidth: 600, width: "100%", padding: 0, maxHeight: "80vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ height: 200, background: `linear-gradient(135deg, ${C.accent}15, ${C.bgElevated})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, position: "relative" }}>
              {selectedProperty.img}
              <div style={{ position: "absolute", top: 16, right: 16, cursor: "pointer" }} onClick={() => setSelectedProperty(null)}>
                <Icon name="close" size={24} color={C.textMuted}/>
              </div>
            </div>
            <div style={{ padding: 28 }}>
              <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 24, fontWeight: 600, marginBottom: 4 }}>{selectedProperty.title}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.textMuted, fontSize: 14, marginBottom: 16 }}>
                <Icon name="location" size={14} color={C.textDim}/> {selectedProperty.city}, {selectedProperty.canton}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { l: "Loyer", v: `CHF ${selectedProperty.rent}` },
                  { l: "Charges", v: `CHF ${selectedProperty.charges}` },
                  { l: "Pièces", v: selectedProperty.rooms },
                  { l: "Surface", v: `${selectedProperty.surface}m²` },
                  { l: "Étage", v: selectedProperty.floor },
                  { l: "Disponible", v: selectedProperty.available },
                ].map((s, i) => (
                  <div key={i} style={{ padding: 12, background: C.bgElevated, borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>{s.l}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.v}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {selectedProperty.balcony && <Badge color={C.success}>Balcon</Badge>}
                {selectedProperty.parking && <Badge color={C.info}>Parking</Badge>}
                {selectedProperty.elevator && <Badge color={C.info}>Ascenseur</Badge>}
              </div>

              {/* Canton info */}
              {CANTONS_DATA[selectedProperty.canton] && (
                <Card style={{ background: C.bgElevated, padding: 16, marginBottom: 20, border: `1px solid ${C.accent}20` }}>
                  <div style={{ fontSize: 12, color: C.accent, fontWeight: 600, marginBottom: 8 }}>
                    <Icon name="shield" size={14} color={C.accent}/> Réglementation {CANTONS_DATA[selectedProperty.canton].name}
                  </div>
                  {CANTONS_DATA[selectedProperty.canton].formRequired && (
                    <div style={{ fontSize: 12, color: C.info, marginBottom: 4 }}>⚠️ Formulaire de loyer initial obligatoire</div>
                  )}
                  <div style={{ fontSize: 12, color: C.textMuted }}>
                    Dates de résiliation: {CANTONS_DATA[selectedProperty.canton].dates.join(" · ")}
                  </div>
                </Card>
              )}

              <div style={{ display: "flex", gap: 12 }}>
                <Btn full>Voir les candidatures</Btn>
                <Btn variant="secondary" full>Modifier</Btn>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );

  // ═══════════════════════════════════════════
  // SEARCH VIEW
  // ═══════════════════════════════════════════

  const SearchView = () => {
    const filtered = DEMO_PROPERTIES.filter(p => {
      if (searchFilters.canton && p.canton !== searchFilters.canton) return false;
      if (searchFilters.maxRent && p.rent > parseInt(searchFilters.maxRent)) return false;
      if (searchFilters.minRooms && p.rooms < parseFloat(searchFilters.minRooms)) return false;
      return true;
    });

    return (
      <div className="fade-in">
        <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 24, fontWeight: 600, marginBottom: 4 }}>
          {userType === "owner" ? "Rechercher des biens" : "Trouver votre logement"}
        </h1>
        <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 24 }}>{filtered.length} biens disponibles</p>

        {/* Filters */}
        <Card style={{ marginBottom: 24, padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, alignItems: "end" }}>
            <Select label="Canton" options={[{ value: "", label: "Tous" }, ...Object.entries(CANTONS_DATA).map(([k, v]) => ({ value: k, label: v.name }))]}
              value={searchFilters.canton} onChange={e => setSearchFilters({...searchFilters, canton: e.target.value})}/>
            <Input label="Budget max (CHF)" type="number" placeholder="2000" value={searchFilters.maxRent}
              onChange={e => setSearchFilters({...searchFilters, maxRent: e.target.value})}/>
            <Input label="Pièces min." type="number" placeholder="3" step="0.5" value={searchFilters.minRooms}
              onChange={e => setSearchFilters({...searchFilters, minRooms: e.target.value})}/>
            <Btn variant="secondary" onClick={() => setSearchFilters({ canton: "", maxRent: "", minRooms: "" })} style={{ marginBottom: 16, padding: "12px" }}>
              Réinitialiser
            </Btn>
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {filtered.map(p => <PropertyCard key={p.id} property={p} onSelect={() => setSelectedProperty(p)}/>)}
        </div>

        {filtered.length === 0 && (
          <Card style={{ textAlign: "center", padding: 60 }}>
            <Icon name="search" size={40} color={C.textDim}/>
            <p style={{ color: C.textMuted, marginTop: 16 }}>Aucun bien ne correspond à vos critères</p>
            <Btn variant="secondary" onClick={() => setSearchFilters({ canton: "", maxRent: "", minRooms: "" })} style={{ marginTop: 16 }}>
              Voir tous les biens
            </Btn>
          </Card>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════
  // INVENTORY VIEW (État des lieux)
  // ═══════════════════════════════════════════

  const InventoryView = () => (
    <div className="fade-in">
      <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 24, fontWeight: 600, marginBottom: 24 }}>États des lieux</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
        {[
          { property: "3.5 pcs Delémont", type: "Entrée", date: "01.04.2026", status: "Planifié", statusColor: C.info },
          { property: "4.5 pcs Porrentruy", type: "Sortie", date: "15.03.2026", status: "En cours", statusColor: C.accent },
          { property: "2.5 pcs Lausanne", type: "Entrée", date: "15.01.2026", status: "Complété", statusColor: C.success },
        ].map((inv, i) => (
          <Card key={i} style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{inv.property}</h3>
                <div style={{ fontSize: 13, color: C.textMuted }}>État des lieux {inv.type.toLowerCase()}</div>
              </div>
              <Badge color={inv.statusColor}>{inv.status}</Badge>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.textMuted, marginBottom: 16 }}>
              <Icon name="calendar" size={14} color={C.textDim}/> {inv.date}
            </div>

            {/* Room checklist */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              {["Cuisine", "Salon", "Chambre 1", "Salle de bain", "Balcon"].map((room, ri) => (
                <div key={ri} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", borderRadius: 6, background: C.bgElevated, fontSize: 13 }}>
                  <span>{room}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {inv.status === "Complété" ? (
                      <Badge color={C.success} style={{ fontSize: 10, padding: "2px 6px" }}>OK</Badge>
                    ) : (
                      <>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: ri < 3 && inv.status === "En cours" ? C.success : C.textDim + "30" }}/>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="secondary" style={{ flex: 1, fontSize: 12, padding: "8px" }}>
                <Icon name="photo" size={14} color={C.accent}/> Photos
              </Btn>
              <Btn style={{ flex: 1, fontSize: 12, padding: "8px" }}>
                <Icon name="document" size={14} color={C.bg}/> Rapport
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  // ARTISANS VIEW
  // ═══════════════════════════════════════════

  const ArtisansView = () => (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 24, fontWeight: 600 }}>Artisans vérifiés</h1>
          <p style={{ color: C.textMuted, fontSize: 13 }}>Commission: 10% seulement (vs 30-40% en régie)</p>
        </div>
        <Btn variant="secondary"><Icon name="filter" size={16} color={C.accent}/> Filtrer</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {DEMO_ARTISANS.map(a => (
          <Card key={a.id} style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: C.accent + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="wrench" size={22} color={C.accent}/>
              </div>
              <Badge>{a.canton}</Badge>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{a.name}</h3>
            <div style={{ fontSize: 13, color: C.accent, marginBottom: 8 }}>{a.specialty}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: C.textMuted, marginBottom: 14 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="star" size={14} color="#FBBF24"/> {a.rating}
              </span>
              <span>{a.reviews} avis</span>
              <span>~CHF {a.hourly}/h</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.textMuted, marginBottom: 16 }}>
              <Icon name="location" size={12} color={C.textDim}/> {a.city}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn full style={{ fontSize: 12, padding: "10px" }}>Demander un devis</Btn>
              <Btn variant="ghost" style={{ fontSize: 12, padding: "10px" }}>
                <Icon name="chat" size={14} color={C.textMuted}/>
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  // MESSAGES VIEW
  // ═══════════════════════════════════════════

  const MessagesView = () => {
    const [activeMsg, setActiveMsg] = useState(null);
    return (
      <div className="fade-in">
        <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Messages</h1>
        <div style={{ display: "grid", gridTemplateColumns: activeMsg ? "300px 1fr" : "1fr", gap: 20 }}>
          <div>
            {DEMO_MESSAGES.map(m => (
              <div key={m.id} onClick={() => setActiveMsg(m)} style={{
                padding: "14px 16px", borderRadius: 12, marginBottom: 8, cursor: "pointer", transition: "all 0.2s",
                background: activeMsg?.id === m.id ? C.accent + "10" : C.bgCard,
                border: `1px solid ${activeMsg?.id === m.id ? C.accent + "30" : C.border}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: m.unread ? 700 : 400, color: m.unread ? C.text : C.textMuted }}>{m.from}</span>
                  <span style={{ fontSize: 11, color: C.textDim }}>{m.time}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: m.unread ? 600 : 400, marginBottom: 4 }}>{m.subject}</div>
                <div style={{ fontSize: 12, color: C.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.preview}</div>
                {m.unread && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, position: "absolute", top: 16, right: 16 }}/>}
              </div>
            ))}
          </div>

          {activeMsg && (
            <Card style={{ padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{activeMsg.subject}</h3>
                  <div style={{ fontSize: 13, color: C.textMuted }}>De: {activeMsg.from} · {activeMsg.time}</div>
                </div>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.8, color: C.textMuted, marginBottom: 24 }}>
                {activeMsg.preview}
                <br/><br/>
                Je reste à disposition pour convenir d'un rendez-vous. Merci pour votre retour rapide.
                <br/><br/>
                Cordialement,<br/>
                {activeMsg.from}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Input placeholder="Votre réponse..." style={{ flex: 1, marginBottom: 0 }}/>
                <Btn style={{ flexShrink: 0 }}><Icon name="arrow" size={16} color={C.bg}/></Btn>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════
  // CANTONAL VIEW
  // ═══════════════════════════════════════════

  const CantonalView = () => {
    const [activeCanton, setActiveCanton] = useState("JU");
    const c = CANTONS_DATA[activeCanton];

    return (
      <div className="fade-in">
        <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 24, fontWeight: 600, marginBottom: 4 }}>
          {userType === "owner" ? "Règles cantonales" : "Vos droits par canton"}
        </h1>
        <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 24 }}>
          Moteur de conformité automatique — 26 cantons suisses
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {Object.entries(CANTONS_DATA).map(([code, cd]) => (
            <div key={code} onClick={() => setActiveCanton(code)} style={{
              padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s",
              background: activeCanton === code ? C.accent : C.bgCard,
              color: activeCanton === code ? C.bg : C.textMuted,
              border: `1px solid ${activeCanton === code ? C.accent : C.border}`,
            }}>{code}</div>
          ))}
        </div>

        {c && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            <Card>
              <h3 style={{ fontFamily: "'Playfair Display'", fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
                {c.name} <span style={{ color: C.textDim }}>({activeCanton})</span>
              </h3>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>Formulaire loyer initial</div>
                <Badge color={c.formRequired ? C.info : C.textDim} style={{ fontSize: 12 }}>
                  {c.formRequired ? "OBLIGATOIRE" : "Non requis"}
                </Badge>
                {c.formRequired && (
                  <p style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>
                    ⚠️ Sans ce formulaire, le loyer peut être contesté sans délai
                  </p>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>Pénurie de logements</div>
                <Badge color={c.penurie ? C.error : C.success}>
                  {c.penurie ? "Pénurie déclarée" : "Pas de pénurie officielle"}
                </Badge>
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>Dates de résiliation</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {c.dates.map((d, i) => (
                    <span key={i} style={{ padding: "6px 12px", borderRadius: 6, background: C.bgElevated, fontSize: 12, border: `1px solid ${C.border}` }}>{d}</span>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <h3 style={{ fontFamily: "'Playfair Display'", fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Informations légales</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ padding: 12, background: C.bgElevated, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: C.accent, fontWeight: 600, marginBottom: 4 }}>Taux hypothécaire de référence</div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display'" }}>1.25%</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>Depuis le 01.09.2025 (précédent: 1.50%)</div>
                </div>

                <div style={{ padding: 12, background: C.bgElevated, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: C.accent, fontWeight: 600, marginBottom: 4 }}>Délai de résiliation</div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display'" }}>3 mois</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>Minimum légal (art. 266c CO)</div>
                </div>

                <div style={{ padding: 12, background: C.bgElevated, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: C.accent, fontWeight: 600, marginBottom: 4 }}>Garantie maximale</div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display'" }}>3 mois</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>Loyer + charges, sur compte bloqué (art. 257e CO)</div>
                </div>

                {c.rules && c.rules.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.text, padding: "8px 12px", background: C.accent + "08", borderRadius: 8, border: `1px solid ${C.accent}15` }}>
                    <Icon name="shield" size={14} color={C.accent}/> {r}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════
  // PAYMENTS VIEW
  // ═══════════════════════════════════════════

  const PaymentsView = () => (
    <div className="fade-in">
      <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Paiements</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard icon="money" label="Commissions reçues" value="CHF 2'890" color={C.success}/>
        <StatCard icon="clock" label="En attente" value="CHF 750" color={C.accent}/>
        <StatCard icon="chart" label="Ce mois" value="CHF 675" sub="+12%" color={C.info}/>
      </div>

      <Card>
        <h3 style={{ fontFamily: "'Playfair Display'", fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Historique</h3>
        {[
          { desc: "Commission bail — 3.5 pcs Delémont", amount: "CHF 675", date: "15.02.2026", status: "Payé", color: C.success },
          { desc: "Commission bail — 4.5 pcs Porrentruy", amount: "CHF 790", date: "01.02.2026", status: "Payé", color: C.success },
          { desc: "Intervention plomberie — Müller", amount: "CHF 85", date: "20.01.2026", status: "Payé", color: C.success },
          { desc: "Commission bail — 2.5 pcs Lausanne", amount: "CHF 840", date: "15.01.2026", status: "Payé", color: C.success },
          { desc: "Commission bail — Studio Genève", amount: "CHF 750", date: "En attente", status: "En attente", color: C.accent },
        ].map((p, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
            <div>
              <div style={{ fontSize: 14 }}>{p.desc}</div>
              <div style={{ fontSize: 12, color: C.textDim }}>{p.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 15, fontWeight: 600, fontFamily: "'JetBrains Mono'" }}>{p.amount}</div>
              <Badge color={p.color} style={{ fontSize: 10 }}>{p.status}</Badge>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );

  // ═══════════════════════════════════════════
  // APPLICATIONS VIEW (tenant)
  // ═══════════════════════════════════════════

  const ApplicationsView = () => (
    <div className="fade-in">
      <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Mes candidatures</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[
          { property: "3.5 pcs Delémont", canton: "JU", rent: 1350, status: "Présélectionné", color: C.accent, score: 87, date: "12.02.2026" },
          { property: "4.5 pcs Porrentruy", canton: "JU", rent: 1580, status: "En attente", color: C.info, score: 72, date: "10.02.2026" },
          { property: "2.5 pcs Lausanne", canton: "VD", rent: 1680, status: "Refusé", color: C.error, score: 54, date: "05.02.2026" },
        ].map((a, i) => (
          <Card key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>{a.property}</h3>
                <Badge>{a.canton}</Badge>
              </div>
              <div style={{ fontSize: 13, color: C.textMuted }}>CHF {a.rent.toLocaleString("fr-CH")}/mois · Candidature du {a.date}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.textDim, marginBottom: 2 }}>Match</div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 18, fontWeight: 700, color: a.score >= 70 ? C.success : C.accent }}>{a.score}%</div>
              </div>
              <Badge color={a.color} style={{ fontSize: 12, padding: "6px 12px" }}>{a.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }}/>
      {view === "landing" && <Landing/>}
      {view === "auth" && <AuthPage/>}
      {view === "app" && <AppLayout/>}
    </>
  );
}
