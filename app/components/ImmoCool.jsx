import { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Home, Search, Plus, FileText, Key, Users, MessageSquare, Settings, Bell, ChevronRight, ChevronLeft, MapPin, Bed, Bath, Square, Star, Shield, Check, X, Camera, Pen, TrendingUp, Building2, Wrench, LogOut, Menu, ArrowRight, Clock, Zap, Heart, Eye, Phone, Mail, Calendar, DollarSign, BarChart3, AlertTriangle, CheckCircle2, Upload, Sparkles, Lock, Globe, Award, CircleDot } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// DESIGN SYSTEM — SWISS NOIR LUXURY
// ═══════════════════════════════════════════════════════════════
const C = {
  bg: "#07060A", bgCard: "#0F0E14", bgElevated: "#16151E", bgHover: "#1C1B27",
  border: "#2A2838", borderHover: "#3D3A50",
  gold: "#D4A853", goldLight: "#E8C97A", goldDim: "#A07D2E", goldBg: "rgba(212,168,83,0.08)",
  text: "#F0EDE6", textSecondary: "#9B97A8", textMuted: "#5E5A6E",
  success: "#34D399", successBg: "rgba(52,211,153,0.1)",
  danger: "#F87171", dangerBg: "rgba(248,113,113,0.1)",
  info: "#60A5FA", infoBg: "rgba(96,165,250,0.1)",
  purple: "#A78BFA", purpleBg: "rgba(167,139,250,0.08)",
};

const font = {
  display: "'Cormorant Garamond', Georgia, serif",
  body: "'DM Sans', -apple-system, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', monospace",
};

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════
const CANTONS = ["JU","VD","GE","NE","FR","BE","VS","BS","BL","SO","AG","ZH","LU","ZG","SZ","OW","NW","UR","GL","SH","TG","SG","AR","AI","GR","TI"];
const MOCK_PROPERTIES = [
  { id:1, title:"3.5 pièces lumineux, vue Jura", address:"Rue de la Gare 12", city:"Delémont", canton:"JU", rooms:3.5, area:78, rent:1350, charges:180, deposit:3, floor:2, totalFloors:4, balcony:true, parking:true, cellar:true, laundry:true, available:"2026-04-01", images:4, status:"active", applications:7, views:143, matchScore:92, previousRent:1280 },
  { id:2, title:"2.5 pièces rénové, centre-ville", address:"Grand-Rue 45", city:"Porrentruy", canton:"JU", rooms:2.5, area:55, rent:980, charges:120, deposit:2, floor:1, totalFloors:3, balcony:false, parking:false, cellar:true, laundry:false, available:"2026-03-15", images:6, status:"active", applications:12, views:218, matchScore:87, previousRent:920 },
  { id:3, title:"4.5 pièces familial, quartier calme", address:"Chemin des Prés 8", city:"Delémont", canton:"JU", rooms:4.5, area:105, rent:1780, charges:220, deposit:3, floor:0, totalFloors:2, balcony:true, parking:true, cellar:true, laundry:true, available:"2026-05-01", images:8, status:"draft", applications:0, views:0, matchScore:0, previousRent:null },
];
const MOCK_TENANTS = [
  { id:1, name:"Sophie Müller", score:94, income:6800, job:"CDI — Ingénieure", city:"Bâle", canton:"BS", verified:true, photo:"SM", budget:1500, rooms:"3-4", moveIn:"2026-04-01", permits:"C", match: {budget:28,location:22,rooms:14,timing:10,reliability:14,verified:5} },
  { id:2, name:"Marc Dubois", score:87, income:5200, job:"CDI — Comptable", city:"Delémont", canton:"JU", verified:true, photo:"MD", budget:1400, rooms:"3-4", moveIn:"2026-04-01", permits:"Suisse", match: {budget:25,location:25,rooms:14,timing:10,reliability:9,verified:4} },
  { id:3, name:"Leila Amrani", score:81, income:4900, job:"CDD — Chercheuse", city:"Neuchâtel", canton:"NE", verified:false, photo:"LA", budget:1300, rooms:"2-3", moveIn:"2026-03-15", permits:"B", match: {budget:22,location:18,rooms:12,timing:9,reliability:13,verified:3} },
  { id:4, name:"Thomas Weber", score:76, income:5500, job:"Indépendant", city:"Bienne", canton:"BE", verified:true, photo:"TW", budget:1600, rooms:"3-4", moveIn:"2026-05-01", permits:"Suisse", match: {budget:24,location:15,rooms:14,timing:6,reliability:12,verified:5} },
  { id:5, name:"Ana Costa", score:68, income:4200, job:"CDI — Vendeuse", city:"Delémont", canton:"JU", verified:false, photo:"AC", budget:1200, rooms:"2-3", moveIn:"2026-04-15", permits:"B", match: {budget:18,location:25,rooms:10,timing:8,reliability:5,verified:2} },
];
const MONTHLY_STATS = [
  {month:"Sep",views:45,applications:3,revenue:0},{month:"Oct",views:89,applications:8,revenue:1350},
  {month:"Nov",views:134,applications:12,revenue:2330},{month:"Dec",views:98,applications:7,revenue:1350},
  {month:"Jan",views:167,applications:15,revenue:3680},{month:"Fév",views:218,applications:19,revenue:4030},
];
const ETAT_LIEUX_ROOMS = [
  { name:"Entrée", items:["Porte d'entrée","Serrure","Sol","Murs","Plafond","Éclairage","Interphone","Boîte aux lettres"] },
  { name:"Séjour", items:["Sol (parquet)","Murs","Plafond","Fenêtres","Stores/volets","Prises électriques","Éclairage","Radiateur/chauffage"] },
  { name:"Cuisine", items:["Plan de travail","Évier + robinetterie","Cuisinière/plaques","Four","Réfrigérateur","Lave-vaisselle","Hotte","Armoires","Sol","Murs","Fenêtre","Prises"] },
  { name:"Chambre 1", items:["Sol","Murs","Plafond","Fenêtres","Stores/volets","Prises","Éclairage","Armoire encastrée"] },
  { name:"Chambre 2", items:["Sol","Murs","Plafond","Fenêtres","Stores/volets","Prises","Éclairage","Armoire encastrée"] },
  { name:"Salle de bains", items:["Lavabo + robinetterie","Baignoire/douche","WC","Miroir","Ventilation","Carrelage sol","Carrelage murs","Armoire toilette","Porte-serviettes"] },
  { name:"Balcon", items:["Sol","Balustrade","Stores extérieurs","Éclairage"] },
  { name:"Cave", items:["Porte + serrure","Sol","Murs","Éclairage","Ventilation"] },
];

// ═══════════════════════════════════════════════════════════════
// MICRO-COMPONENTS
// ═══════════════════════════════════════════════════════════════
const Badge = ({children,color="gold",size="sm"}) => {
  const colors = { gold:[C.goldBg,C.gold], green:[C.successBg,C.success], red:[C.dangerBg,C.danger], blue:[C.infoBg,C.info], purple:[C.purpleBg,C.purple] };
  const [bg,fg] = colors[color]||colors.gold;
  return <span style={{background:bg,color:fg,padding:size==="sm"?"3px 10px":"5px 14px",borderRadius:20,fontSize:size==="sm"?11:12,fontFamily:font.mono,fontWeight:600,letterSpacing:"0.02em",display:"inline-flex",alignItems:"center",gap:4}}>{children}</span>;
};

const ScoreRing = ({score,size=64,strokeWidth=4,showLabel=true}) => {
  const r = (size-strokeWidth)/2;
  const circ = 2*Math.PI*r;
  const offset = circ*(1-score/100);
  const color = score>=85?C.success:score>=70?C.gold:score>=50?C.info:C.danger;
  return (
    <div style={{position:"relative",width:size,height:size}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{transition:"stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)"}}/>
      </svg>
      {showLabel && <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:font.mono,fontSize:size*0.28,fontWeight:700,color}}>{score}</div>}
    </div>
  );
};

const GlowButton = ({children,onClick,variant="primary",size="md",icon:Icon,full}) => {
  const [hover,setHover] = useState(false);
  const styles = {
    primary: {bg:C.gold,color:C.bg,hoverBg:C.goldLight,shadow:`0 0 30px ${C.gold}40`},
    secondary: {bg:"transparent",color:C.gold,hoverBg:C.goldBg,border:`1px solid ${C.gold}50`,shadow:"none"},
    ghost: {bg:"transparent",color:C.textSecondary,hoverBg:C.bgHover,shadow:"none"},
    danger: {bg:C.dangerBg,color:C.danger,hoverBg:"rgba(248,113,113,0.2)",shadow:"none"},
  };
  const s = styles[variant];
  const pad = size==="sm"?"8px 16px":size==="lg"?"14px 32px":"10px 24px";
  const fs = size==="sm"?12:size==="lg"?15:13;
  return (
    <button onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{
      background:hover?s.hoverBg:s.bg, color:s.color, padding:pad, border:s.border||"none",
      borderRadius:8, cursor:"pointer", fontFamily:font.body, fontSize:fs, fontWeight:600,
      letterSpacing:"0.03em", display:"inline-flex", alignItems:"center", gap:8,
      transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)", boxShadow:hover?s.shadow:"none",
      width:full?"100%":"auto", justifyContent:"center",
    }}>
      {Icon && <Icon size={fs+2}/>}
      {children}
    </button>
  );
};

const StatCard = ({label,value,sub,icon:Icon,trend,color="gold"}) => {
  const fg = {gold:C.gold,green:C.success,blue:C.info,purple:C.purple}[color];
  return (
    <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 24px",display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <span style={{fontFamily:font.body,fontSize:12,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.08em"}}>{label}</span>
        {Icon && <div style={{width:32,height:32,borderRadius:8,background:`${fg}15`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={16} color={fg}/></div>}
      </div>
      <div style={{fontFamily:font.display,fontSize:32,fontWeight:600,color:C.text,lineHeight:1}}>{value}</div>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        {trend && <span style={{fontFamily:font.mono,fontSize:11,color:trend>0?C.success:C.danger}}>{trend>0?"+":""}{trend}%</span>}
        {sub && <span style={{fontFamily:font.body,fontSize:12,color:C.textMuted}}>{sub}</span>}
      </div>
    </div>
  );
};

const Input = ({label,value,onChange,type="text",placeholder,icon:Icon,suffix}) => (
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {label && <label style={{fontFamily:font.body,fontSize:12,color:C.textSecondary,fontWeight:500}}>{label}</label>}
    <div style={{position:"relative",display:"flex",alignItems:"center"}}>
      {Icon && <Icon size={16} color={C.textMuted} style={{position:"absolute",left:12}}/>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{
        width:"100%",background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:8,
        padding:`10px ${suffix?"50px":"14px"} 10px ${Icon?"40px":"14px"}`,fontFamily:font.body,fontSize:14,
        color:C.text,outline:"none",transition:"border-color 0.2s",
      }} onFocus={e=>e.target.style.borderColor=C.gold+"80"} onBlur={e=>e.target.style.borderColor=C.border}/>
      {suffix && <span style={{position:"absolute",right:14,fontFamily:font.mono,fontSize:12,color:C.textMuted}}>{suffix}</span>}
    </div>
  </div>
);

const Dropdown = ({label,value,onChange,options}) => (
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {label && <label style={{fontFamily:font.body,fontSize:12,color:C.textSecondary,fontWeight:500}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{
      width:"100%",background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:8,
      padding:"10px 14px",fontFamily:font.body,fontSize:14,color:C.text,outline:"none",
      cursor:"pointer",appearance:"none",
    }}>
      {options.map(o=><option key={o.value} value={o.value} style={{background:C.bg}}>{o.label}</option>)}
    </select>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// PAGE: LANDING
// ═══════════════════════════════════════════════════════════════
const Landing = ({onNavigate}) => {
  const [animStep,setAnimStep] = useState(0);
  useEffect(()=>{const t=setTimeout(()=>setAnimStep(1),100);const t2=setTimeout(()=>setAnimStep(2),400);const t3=setTimeout(()=>setAnimStep(3),700);return()=>{clearTimeout(t);clearTimeout(t2);clearTimeout(t3)}},[]);
  
  const features = [
    {icon:Zap,title:"Matching IA",desc:"Algorithme qui score vos candidats sur 6 critères. Fini le tri manuel.",color:C.gold},
    {icon:FileText,title:"Bail conforme",desc:"Généré automatiquement selon les 26 cantons. Taux hypothécaire et IPC intégrés.",color:C.success},
    {icon:Camera,title:"État des lieux digital",desc:"Pièce par pièce, photos, signatures tactiles. Comparaison entrée/sortie automatique.",color:C.info},
    {icon:Shield,title:"Conformité légale",desc:"OBLF, formulaire de loyer initial, délais cantonaux. Tout est vérifié en temps réel.",color:C.purple},
    {icon:DollarSign,title:"Paiements Stripe",desc:"Commission prélevée automatiquement. Zéro manipulation. Zéro risque d'impayé.",color:C.gold},
    {icon:Wrench,title:"Marketplace artisans",desc:"Plombier, électricien, peintre — interventions gérées et payées dans l'app.",color:C.success},
  ];
  
  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,overflow:"hidden"}}>
      {/* HERO */}
      <div style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        {/* Gradient orbs */}
        <div style={{position:"absolute",top:"-20%",right:"-10%",width:600,height:600,borderRadius:"50%",background:`radial-gradient(circle, ${C.gold}08 0%, transparent 70%)`,pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"-30%",left:"-15%",width:800,height:800,borderRadius:"50%",background:`radial-gradient(circle, ${C.purple}05 0%, transparent 70%)`,pointerEvents:"none"}}/>
        
        {/* Nav */}
        <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"24px 48px",position:"relative",zIndex:10,opacity:animStep>=1?1:0,transform:animStep>=1?"translateY(0)":"translateY(-20px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1)"}}>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontFamily:font.display,fontSize:28,fontWeight:600,color:C.text}}>immo</span>
            <span style={{fontFamily:font.display,fontSize:28,fontWeight:600,color:C.gold}}>.</span>
            <span style={{fontFamily:font.display,fontSize:28,fontWeight:600,color:C.text}}>cool</span>
          </div>
          <div style={{display:"flex",gap:8}}>
            <GlowButton variant="ghost" onClick={()=>onNavigate("login")}>Connexion</GlowButton>
            <GlowButton onClick={()=>onNavigate("register")}>Commencer gratuitement</GlowButton>
          </div>
        </nav>

        {/* Hero content */}
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 48px",position:"relative",zIndex:5}}>
          <div style={{maxWidth:900,textAlign:"center"}}>
            <div style={{opacity:animStep>=1?1:0,transform:animStep>=1?"translateY(0)":"translateY(30px)",transition:"all 1s cubic-bezier(0.16,1,0.3,1) 0.1s"}}>
              <Badge color="gold" size="md">La première régie 100% IA de Suisse</Badge>
            </div>
            
            <h1 style={{fontFamily:font.display,fontSize:"clamp(48px,7vw,86px)",fontWeight:400,lineHeight:1.05,margin:"32px 0 24px",opacity:animStep>=2?1:0,transform:animStep>=2?"translateY(0)":"translateY(40px)",transition:"all 1s cubic-bezier(0.16,1,0.3,1) 0.2s"}}>
              Louez sans<br/>
              <span style={{fontStyle:"italic",color:C.gold}}>intermédiaire</span>
            </h1>
            
            <p style={{fontFamily:font.body,fontSize:18,color:C.textSecondary,maxWidth:560,margin:"0 auto 40px",lineHeight:1.7,opacity:animStep>=2?1:0,transform:animStep>=2?"translateY(0)":"translateY(30px)",transition:"all 1s cubic-bezier(0.16,1,0.3,1) 0.35s"}}>
              Matching intelligent, bail conforme aux 26 cantons, paiements sécurisés, état des lieux digital — 100% automatisé. <strong style={{color:C.text}}>Gratuit pour les locataires.</strong>
            </p>
            
            <div style={{display:"flex",gap:16,justifyContent:"center",opacity:animStep>=3?1:0,transform:animStep>=3?"translateY(0)":"translateY(20px)",transition:"all 1s cubic-bezier(0.16,1,0.3,1) 0.5s"}}>
              <GlowButton size="lg" icon={ArrowRight} onClick={()=>onNavigate("register")}>Créer un compte propriétaire</GlowButton>
              <GlowButton size="lg" variant="secondary" icon={Search} onClick={()=>onNavigate("register")}>Chercher un appartement</GlowButton>
            </div>
            
            {/* Trust badges */}
            <div style={{display:"flex",justifyContent:"center",gap:32,marginTop:48,opacity:animStep>=3?1:0,transition:"opacity 1s ease 0.8s"}}>
              {[
                {icon:Shield,label:"Conforme au droit suisse"},
                {icon:Lock,label:"Paiements via Stripe"},
                {icon:Globe,label:"26 cantons couverts"},
              ].map((b,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                  <b.icon size={14} color={C.textMuted}/>
                  <span style={{fontFamily:font.body,fontSize:12,color:C.textMuted}}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* PRICING — The disruptive section */}
      <div style={{padding:"120px 48px",position:"relative"}}>
        <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg, transparent 0%, ${C.gold}03 50%, transparent 100%)`,pointerEvents:"none"}}/>
        <div style={{maxWidth:1000,margin:"0 auto",textAlign:"center",position:"relative"}}>
          <span style={{fontFamily:font.mono,fontSize:11,color:C.gold,letterSpacing:"0.15em",textTransform:"uppercase"}}>Tarification</span>
          <h2 style={{fontFamily:font.display,fontSize:48,fontWeight:400,margin:"12px 0 60px"}}>
            Jusqu'à <span style={{fontStyle:"italic",color:C.gold}}>50% moins cher</span> qu'une régie
          </h2>
          
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:2}}>
            {[
              {role:"Locataire",price:"Gratuit",sub:"pour toujours",icon:Heart,color:C.success,features:["Matching intelligent","Alertes personnalisées","Signature électronique","État des lieux digital","Résiliation assistée"]},
              {role:"Propriétaire",price:"50%",sub:"du premier loyer",icon:Key,color:C.gold,highlight:true,features:["Publication illimitée","Scoring IA des candidats","Bail automatique conforme","État des lieux digital","Marketplace artisans"]},
              {role:"Artisan",price:"10%",sub:"par intervention",icon:Wrench,color:C.info,features:["Clients qualifiés","Paiement garanti","Visibilité locale","Gestion des devis","Avis vérifiés"]},
            ].map((plan,i)=>(
              <div key={i} style={{background:plan.highlight?C.bgElevated:C.bgCard,border:`1px solid ${plan.highlight?C.gold+"40":C.border}`,borderRadius:i===0?"12px 0 0 12px":i===2?"0 12px 12px 0":"0",padding:"48px 36px",position:"relative",display:"flex",flexDirection:"column"}}>
                {plan.highlight && <div style={{position:"absolute",top:-1,left:"20%",right:"20%",height:2,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`}}/>}
                <div style={{width:48,height:48,borderRadius:12,background:`${plan.color}12`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
                  <plan.icon size={22} color={plan.color}/>
                </div>
                <div style={{fontFamily:font.mono,fontSize:11,color:plan.color,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>{plan.role}</div>
                <div style={{fontFamily:font.display,fontSize:plan.price==="Gratuit"?42:56,fontWeight:600,color:C.text}}>{plan.price}</div>
                <div style={{fontFamily:font.body,fontSize:13,color:C.textMuted,marginBottom:32}}>{plan.sub}</div>
                <div style={{display:"flex",flexDirection:"column",gap:12,flex:1}}>
                  {plan.features.map((f,j)=>(
                    <div key={j} style={{display:"flex",alignItems:"center",gap:10,textAlign:"left"}}>
                      <Check size={14} color={plan.color}/>
                      <span style={{fontFamily:font.body,fontSize:13,color:C.textSecondary}}>{f}</span>
                    </div>
                  ))}
                </div>
                <GlowButton variant={plan.highlight?"primary":"secondary"} full style={{marginTop:32}} onClick={()=>onNavigate("register")}>
                  {plan.highlight?"Commencer maintenant":"S'inscrire"}
                </GlowButton>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div style={{padding:"80px 48px 120px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:60}}>
          <span style={{fontFamily:font.mono,fontSize:11,color:C.gold,letterSpacing:"0.15em",textTransform:"uppercase"}}>Fonctionnalités</span>
          <h2 style={{fontFamily:font.display,fontSize:44,fontWeight:400,margin:"12px 0"}}>
            Tout est <span style={{fontStyle:"italic",color:C.gold}}>automatisé</span>
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20}}>
          {features.map((f,i)=>(
            <div key={i} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:28,transition:"all 0.3s",cursor:"default"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=f.color+"50";e.currentTarget.style.transform="translateY(-4px)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateY(0)"}}>
              <div style={{width:40,height:40,borderRadius:10,background:`${f.color}12`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
                <f.icon size={20} color={f.color}/>
              </div>
              <div style={{fontFamily:font.body,fontSize:16,fontWeight:600,color:C.text,marginBottom:8}}>{f.title}</div>
              <div style={{fontFamily:font.body,fontSize:13,color:C.textSecondary,lineHeight:1.6}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{borderTop:`1px solid ${C.border}`,padding:"40px 48px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontFamily:font.display,fontSize:20,fontWeight:600}}>immo</span>
          <span style={{fontFamily:font.display,fontSize:20,fontWeight:600,color:C.gold}}>.</span>
          <span style={{fontFamily:font.display,fontSize:20,fontWeight:600}}>cool</span>
          <span style={{fontFamily:font.body,fontSize:12,color:C.textMuted,marginLeft:12}}>© 2026</span>
        </div>
        <div style={{display:"flex",gap:24}}>
          {["CGV","Confidentialité","Contact","API"].map(l=>(
            <span key={l} style={{fontFamily:font.body,fontSize:12,color:C.textMuted,cursor:"pointer",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color=C.gold} onMouseLeave={e=>e.target.style.color=C.textMuted}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PAGE: DASHBOARD PROPRIÉTAIRE
// ═══════════════════════════════════════════════════════════════
const Dashboard = ({onNavigate,subPage,setSubPage}) => {
  const [sidebarCollapsed,setSidebarCollapsed] = useState(false);
  const [notifOpen,setNotifOpen] = useState(false);
  
  const menuItems = [
    {id:"overview",icon:BarChart3,label:"Tableau de bord"},
    {id:"properties",icon:Building2,label:"Mes biens"},
    {id:"tenants",icon:Users,label:"Candidatures"},
    {id:"leases",icon:FileText,label:"Baux"},
    {id:"etat-lieux",icon:Camera,label:"État des lieux"},
    {id:"artisans",icon:Wrench,label:"Artisans"},
    {id:"messages",icon:MessageSquare,label:"Messages"},
    {id:"settings",icon:Settings,label:"Paramètres"},
  ];
  
  return (
    <div style={{display:"flex",height:"100vh",background:C.bg,color:C.text,overflow:"hidden"}}>
      {/* SIDEBAR */}
      <div style={{width:sidebarCollapsed?72:240,background:C.bgCard,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",transition:"width 0.3s cubic-bezier(0.4,0,0.2,1)",flexShrink:0,overflow:"hidden"}}>
        <div style={{padding:"20px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}}>
          {!sidebarCollapsed && (
            <div style={{display:"flex",alignItems:"center",gap:3}}>
              <span style={{fontFamily:font.display,fontSize:22,fontWeight:600}}>immo</span>
              <span style={{fontFamily:font.display,fontSize:22,fontWeight:600,color:C.gold}}>.</span>
              <span style={{fontFamily:font.display,fontSize:22,fontWeight:600}}>cool</span>
            </div>
          )}
          <button onClick={()=>setSidebarCollapsed(!sidebarCollapsed)} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",padding:4}}>
            <Menu size={18}/>
          </button>
        </div>
        
        <div style={{flex:1,padding:"12px 8px",display:"flex",flexDirection:"column",gap:2}}>
          {menuItems.map(item=>(
            <button key={item.id} onClick={()=>setSubPage(item.id)} style={{
              display:"flex",alignItems:"center",gap:12,padding:sidebarCollapsed?"10px":"10px 12px",
              background:subPage===item.id?C.goldBg:"transparent",
              border:"none",borderRadius:8,cursor:"pointer",color:subPage===item.id?C.gold:C.textSecondary,
              transition:"all 0.2s",width:"100%",justifyContent:sidebarCollapsed?"center":"flex-start",
            }} onMouseEnter={e=>{if(subPage!==item.id)e.currentTarget.style.background=C.bgHover}} onMouseLeave={e=>{if(subPage!==item.id)e.currentTarget.style.background="transparent"}}>
              <item.icon size={18}/>
              {!sidebarCollapsed && <span style={{fontFamily:font.body,fontSize:13,fontWeight:subPage===item.id?600:400,whiteSpace:"nowrap"}}>{item.label}</span>}
            </button>
          ))}
        </div>
        
        <div style={{padding:"12px 8px",borderTop:`1px solid ${C.border}`}}>
          <button onClick={()=>onNavigate("landing")} style={{display:"flex",alignItems:"center",gap:12,padding:sidebarCollapsed?"10px":"10px 12px",background:"none",border:"none",borderRadius:8,cursor:"pointer",color:C.textMuted,width:"100%",justifyContent:sidebarCollapsed?"center":"flex-start"}} onMouseEnter={e=>e.currentTarget.style.color=C.danger} onMouseLeave={e=>e.currentTarget.style.color=C.textMuted}>
            <LogOut size={18}/>
            {!sidebarCollapsed && <span style={{fontFamily:font.body,fontSize:13}}>Déconnexion</span>}
          </button>
        </div>
      </div>
      
      {/* MAIN CONTENT */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* TOP BAR */}
        <div style={{padding:"16px 32px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.bgCard}}>
          <div>
            <div style={{fontFamily:font.display,fontSize:22,fontWeight:600}}>
              {menuItems.find(m=>m.id===subPage)?.label || "Tableau de bord"}
            </div>
            <div style={{fontFamily:font.body,fontSize:12,color:C.textMuted,marginTop:2}}>
              {new Date().toLocaleDateString("fr-CH",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{position:"relative"}}>
              <button onClick={()=>setNotifOpen(!notifOpen)} style={{background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:8,padding:8,cursor:"pointer",color:C.textSecondary,position:"relative"}}>
                <Bell size={18}/>
                <div style={{position:"absolute",top:4,right:4,width:8,height:8,borderRadius:"50%",background:C.danger}}/>
              </button>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.gold}30,${C.purple}30)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:font.mono,fontSize:13,fontWeight:600,color:C.gold}}>OB</div>
              <div>
                <div style={{fontFamily:font.body,fontSize:13,fontWeight:500}}>Olivier B.</div>
                <div style={{fontFamily:font.body,fontSize:11,color:C.textMuted}}>Propriétaire</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* SCROLLABLE CONTENT */}
        <div style={{flex:1,overflow:"auto",padding:32}}>
          {subPage === "overview" && <DashboardOverview onNavigate={setSubPage}/>}
          {subPage === "properties" && <PropertiesView onNavigate={setSubPage}/>}
          {subPage === "tenants" && <TenantsView/>}
          {subPage === "leases" && <LeasesView/>}
          {subPage === "etat-lieux" && <EtatDesLieuxView/>}
          {subPage === "artisans" && <ArtisansView/>}
          {subPage === "messages" && <MessagesView/>}
          {subPage === "settings" && <SettingsView/>}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SUB-PAGE: OVERVIEW
// ═══════════════════════════════════════════════════════════════
const DashboardOverview = ({onNavigate}) => (
  <div style={{display:"flex",flexDirection:"column",gap:24}}>
    {/* Stats row */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:16}}>
      <StatCard label="Biens actifs" value="2" sub="sur 3 publiés" icon={Building2} color="gold"/>
      <StatCard label="Candidatures" value="19" sub="ce mois" icon={Users} trend={27} color="blue"/>
      <StatCard label="Revenus estimés" value="CHF 4'030" sub="commissions" icon={TrendingUp} trend={9} color="green"/>
      <StatCard label="Taux de matching" value="87%" sub="candidats qualifiés" icon={Sparkles} color="purple"/>
    </div>
    
    {/* Charts row */}
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
      <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div>
            <div style={{fontFamily:font.body,fontSize:14,fontWeight:600,color:C.text}}>Performance</div>
            <div style={{fontFamily:font.body,fontSize:12,color:C.textMuted}}>Vues et candidatures sur 6 mois</div>
          </div>
          <div style={{display:"flex",gap:16}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:C.gold}}/><span style={{fontFamily:font.body,fontSize:11,color:C.textMuted}}>Vues</span></div>
            <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:C.success}}/><span style={{fontFamily:font.body,fontSize:11,color:C.textMuted}}>Candidatures</span></div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={MONTHLY_STATS}>
            <defs>
              <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.gold} stopOpacity={0.3}/><stop offset="100%" stopColor={C.gold} stopOpacity={0}/></linearGradient>
              <linearGradient id="gApps" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.success} stopOpacity={0.3}/><stop offset="100%" stopColor={C.success} stopOpacity={0}/></linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{fontSize:11,fill:C.textMuted,fontFamily:font.mono}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:C.textMuted,fontFamily:font.mono}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:8,fontFamily:font.body,fontSize:12}} labelStyle={{color:C.text}} itemStyle={{color:C.textSecondary}}/>
            <Area type="monotone" dataKey="views" stroke={C.gold} fill="url(#gViews)" strokeWidth={2}/>
            <Area type="monotone" dataKey="applications" stroke={C.success} fill="url(#gApps)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legal compliance widget */}
      <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:24,display:"flex",flexDirection:"column",gap:16}}>
        <div style={{fontFamily:font.body,fontSize:14,fontWeight:600,color:C.text}}>Conformité légale</div>
        {[
          {label:"Taux hypothécaire",value:"1.25%",status:"ok",date:"01.03.2026"},
          {label:"IPC (base déc. 2025)",value:"107.1",status:"ok",date:"15.02.2026"},
          {label:"Formulaire loyer initial",value:"JU — OK",status:"ok",date:"Conforme"},
          {label:"Délais résiliation",value:"3 mois",status:"warn",date:"Prochain: 30.06"},
        ].map((ref,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<3?`1px solid ${C.border}`:"none"}}>
            <div>
              <div style={{fontFamily:font.body,fontSize:12,color:C.textSecondary}}>{ref.label}</div>
              <div style={{fontFamily:font.mono,fontSize:14,fontWeight:600,color:C.text,marginTop:2}}>{ref.value}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              {ref.status==="ok"?<CheckCircle2 size={14} color={C.success}/>:<AlertTriangle size={14} color={C.gold}/>}
              <span style={{fontFamily:font.mono,fontSize:10,color:C.textMuted}}>{ref.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recent activity */}
    <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontFamily:font.body,fontSize:14,fontWeight:600,color:C.text}}>Activité récente</div>
        <GlowButton variant="ghost" size="sm">Voir tout</GlowButton>
      </div>
      {[
        {time:"Il y a 2h",text:"Sophie Müller a candidaté pour 3.5 pièces, Delémont",type:"application",icon:Users},
        {time:"Il y a 5h",text:"Nouveau match: Marc Dubois — Score 87/100",type:"match",icon:Sparkles},
        {time:"Hier",text:"Bail généré pour 2.5 pièces Porrentruy (réf. JU-2026-0047)",type:"lease",icon:FileText},
        {time:"23.02",text:"Taux hypothécaire vérifié: 1.25% — conforme",type:"legal",icon:Shield},
      ].map((a,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:i<3?`1px solid ${C.border}08`:"none",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=C.bgHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <div style={{width:36,height:36,borderRadius:8,background:a.type==="application"?C.infoBg:a.type==="match"?C.purpleBg:a.type==="lease"?C.successBg:C.goldBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <a.icon size={16} color={a.type==="application"?C.info:a.type==="match"?C.purple:a.type==="lease"?C.success:C.gold}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:font.body,fontSize:13,color:C.text}}>{a.text}</div>
          </div>
          <span style={{fontFamily:font.mono,fontSize:11,color:C.textMuted,flexShrink:0}}>{a.time}</span>
        </div>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// SUB-PAGE: PROPERTIES
// ═══════════════════════════════════════════════════════════════
const PropertiesView = ({onNavigate}) => {
  const [showCreate,setShowCreate] = useState(false);
  
  if(showCreate) return <PropertyCreateForm onBack={()=>setShowCreate(false)}/>;
  
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div style={{fontFamily:font.body,fontSize:14,color:C.textMuted}}>{MOCK_PROPERTIES.length} biens</div>
        <GlowButton icon={Plus} onClick={()=>setShowCreate(true)}>Ajouter un bien</GlowButton>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {MOCK_PROPERTIES.map(p=>(
          <div key={p.id} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:20,display:"flex",gap:20,alignItems:"center",cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold+"40"} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{width:100,height:80,borderRadius:8,background:`linear-gradient(135deg,${C.bgElevated},${C.bgHover})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Home size={28} color={C.textMuted}/>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <span style={{fontFamily:font.body,fontSize:15,fontWeight:600,color:C.text}}>{p.title}</span>
                <Badge color={p.status==="active"?"green":"gold"}>{p.status==="active"?"Actif":"Brouillon"}</Badge>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:16,fontFamily:font.body,fontSize:12,color:C.textSecondary}}>
                <span style={{display:"flex",alignItems:"center",gap:4}}><MapPin size={12}/>{p.city} ({p.canton})</span>
                <span style={{display:"flex",alignItems:"center",gap:4}}><Bed size={12}/>{p.rooms} pièces</span>
                <span style={{display:"flex",alignItems:"center",gap:4}}><Square size={12}/>{p.area} m²</span>
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:font.display,fontSize:24,fontWeight:600,color:C.text}}>CHF {p.rent.toLocaleString()}</div>
              <div style={{fontFamily:font.body,fontSize:11,color:C.textMuted}}>+ {p.charges} charges</div>
            </div>
            <div style={{display:"flex",gap:20,flexShrink:0,paddingLeft:20,borderLeft:`1px solid ${C.border}`}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:font.mono,fontSize:18,fontWeight:700,color:C.info}}>{p.applications}</div>
                <div style={{fontFamily:font.body,fontSize:10,color:C.textMuted}}>candidatures</div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:font.mono,fontSize:18,fontWeight:700,color:C.textSecondary}}>{p.views}</div>
                <div style={{fontFamily:font.body,fontSize:10,color:C.textMuted}}>vues</div>
              </div>
            </div>
            <ChevronRight size={18} color={C.textMuted}/>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PROPERTY CREATE FORM
// ═══════════════════════════════════════════════════════════════
const PropertyCreateForm = ({onBack}) => {
  const [step,setStep] = useState(1);
  const [form,setForm] = useState({type:"APARTMENT",title:"",address:"",npa:"",city:"",canton:"JU",rooms:3.5,area:"",floor:"",totalFloors:"",rent:"",charges:"",deposit:3,balcony:false,parking:false,cellar:false,laundry:false,available:"",description:"",previousRent:""});
  const set = (k,v) => setForm({...form,[k]:v});
  const totalSteps = 4;
  
  return (
    <div>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontFamily:font.body,fontSize:13,marginBottom:24,padding:0}} onMouseEnter={e=>e.target.style.color=C.gold} onMouseLeave={e=>e.target.style.color=C.textMuted}>
        <ChevronLeft size={16}/> Retour aux biens
      </button>
      
      {/* Progress */}
      <div style={{display:"flex",gap:4,marginBottom:32}}>
        {Array.from({length:totalSteps}).map((_,i)=>(
          <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<step?C.gold:C.border,transition:"background 0.3s"}}/>
        ))}
      </div>
      
      <div style={{maxWidth:640}}>
        {step===1 && (
          <div>
            <h3 style={{fontFamily:font.display,fontSize:28,fontWeight:400,marginBottom:8}}>Informations <span style={{fontStyle:"italic",color:C.gold}}>générales</span></h3>
            <p style={{fontFamily:font.body,fontSize:13,color:C.textMuted,marginBottom:32}}>Décrivez votre bien pour attirer les meilleurs candidats.</p>
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <Dropdown label="Type de bien" value={form.type} onChange={v=>set("type",v)} options={[{value:"APARTMENT",label:"Appartement"},{value:"HOUSE",label:"Maison"},{value:"STUDIO",label:"Studio"},{value:"COMMERCIAL",label:"Commercial"}]}/>
                <Dropdown label="Canton" value={form.canton} onChange={v=>set("canton",v)} options={CANTONS.map(c=>({value:c,label:c}))}/>
              </div>
              <Input label="Titre de l'annonce" value={form.title} onChange={v=>set("title",v)} placeholder="Ex: 3.5 pièces lumineux, vue Jura"/>
              <Input label="Adresse" value={form.address} onChange={v=>set("address",v)} placeholder="Rue et numéro" icon={MapPin}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:16}}>
                <Input label="NPA" value={form.npa} onChange={v=>set("npa",v)} placeholder="2800"/>
                <Input label="Ville" value={form.city} onChange={v=>set("city",v)} placeholder="Delémont"/>
              </div>
            </div>
          </div>
        )}
        
        {step===2 && (
          <div>
            <h3 style={{fontFamily:font.display,fontSize:28,fontWeight:400,marginBottom:8}}>Caractéristiques du <span style={{fontStyle:"italic",color:C.gold}}>bien</span></h3>
            <p style={{fontFamily:font.body,fontSize:13,color:C.textMuted,marginBottom:32}}>Ces détails sont utilisés pour le matching et l'état des lieux.</p>
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
                <Input label="Nombre de pièces" value={form.rooms} onChange={v=>set("rooms",v)} type="number" suffix="pièces" icon={Bed}/>
                <Input label="Surface" value={form.area} onChange={v=>set("area",v)} type="number" suffix="m²" icon={Square}/>
                <Input label="Étage" value={form.floor} onChange={v=>set("floor",v)} type="number" suffix={`/ ${form.totalFloors||"?"}`}/>
              </div>
              <div>
                <label style={{fontFamily:font.body,fontSize:12,color:C.textSecondary,fontWeight:500,marginBottom:10,display:"block"}}>Équipements</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {[{key:"balcony",label:"Balcon / terrasse"},{key:"parking",label:"Place de parc"},{key:"cellar",label:"Cave"},{key:"laundry",label:"Buanderie"}].map(eq=>(
                    <button key={eq.key} onClick={()=>set(eq.key,!form[eq.key])} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:form[eq.key]?C.goldBg:C.bgElevated,border:`1px solid ${form[eq.key]?C.gold+"50":C.border}`,borderRadius:8,cursor:"pointer",color:form[eq.key]?C.gold:C.textSecondary,fontFamily:font.body,fontSize:13,transition:"all 0.2s"}}>
                      {form[eq.key]?<CheckCircle2 size={16}/>:<CircleDot size={16}/>}
                      {eq.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step===3 && (
          <div>
            <h3 style={{fontFamily:font.display,fontSize:28,fontWeight:400,marginBottom:8}}>Conditions <span style={{fontStyle:"italic",color:C.gold}}>financières</span></h3>
            <p style={{fontFamily:font.body,fontSize:13,color:C.textMuted,marginBottom:32}}>Le formulaire de loyer initial sera généré automatiquement si requis par votre canton.</p>
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <Input label="Loyer mensuel net" value={form.rent} onChange={v=>set("rent",v)} type="number" suffix="CHF" icon={DollarSign}/>
                <Input label="Charges mensuelles" value={form.charges} onChange={v=>set("charges",v)} type="number" suffix="CHF"/>
              </div>
              <Dropdown label="Garantie de loyer" value={form.deposit} onChange={v=>set("deposit",v)} options={[{value:1,label:"1 mois"},{value:2,label:"2 mois"},{value:3,label:"3 mois (max. légal)"}]}/>
              <Input label="Loyer du précédent locataire (optionnel)" value={form.previousRent} onChange={v=>set("previousRent",v)} type="number" suffix="CHF" placeholder="Requis pour le formulaire de loyer initial"/>
              <Input label="Disponible dès" value={form.available} onChange={v=>set("available",v)} type="date" icon={Calendar}/>
              
              {/* Commission preview */}
              {form.rent && (
                <div style={{background:C.goldBg,border:`1px solid ${C.gold}30`,borderRadius:12,padding:20}}>
                  <div style={{fontFamily:font.body,fontSize:12,color:C.gold,marginBottom:8}}>Votre commission immo.cool</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                    <span style={{fontFamily:font.display,fontSize:32,fontWeight:600,color:C.text}}>CHF {Math.round(form.rent*0.5).toLocaleString()}</span>
                    <span style={{fontFamily:font.body,fontSize:12,color:C.textMuted}}>50% du premier loyer — payable après signature</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {step===4 && (
          <div>
            <h3 style={{fontFamily:font.display,fontSize:28,fontWeight:400,marginBottom:8}}>Vérification <span style={{fontStyle:"italic",color:C.gold}}>finale</span></h3>
            <p style={{fontFamily:font.body,fontSize:13,color:C.textMuted,marginBottom:32}}>Vérifiez les informations avant publication. L'état des lieux sera généré automatiquement.</p>
            
            {/* Compliance checks */}
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
              {[
                {ok:true,text:`Canton ${form.canton}: formulaire de loyer initial ${["GE","VD","NE","FR","ZG","ZH"].includes(form.canton)?"obligatoire — sera généré":"non requis"}`},
                {ok:true,text:`Garantie de loyer: ${form.deposit} mois — conforme à l'art. 257e CO`},
                {ok:true,text:"Taux hypothécaire de référence: 1.25% — sera inclus dans le bail"},
                {ok:!!form.previousRent || !["GE","VD","NE","FR","ZG","ZH"].includes(form.canton), text:form.previousRent?"Loyer précédent renseigné — transparence assurée":"Loyer précédent non renseigné"+(["GE","VD","NE","FR","ZG","ZH"].includes(form.canton)?" — recommandé pour votre canton":"")},
              ].map((c,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:c.ok?C.successBg:C.dangerBg,borderRadius:8}}>
                  {c.ok?<CheckCircle2 size={16} color={C.success}/>:<AlertTriangle size={16} color={C.danger}/>}
                  <span style={{fontFamily:font.body,fontSize:13,color:c.ok?C.success:C.danger}}>{c.text}</span>
                </div>
              ))}
            </div>
            
            <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
              <div style={{fontFamily:font.body,fontSize:12,color:C.textMuted,marginBottom:12}}>Documents qui seront générés automatiquement</div>
              {["Bail à loyer conforme au canton "+form.canton, "Formulaire de loyer initial (si requis)", `État des lieux — ${Math.floor(form.rooms)||3} pièces + ${[form.balcony&&"balcon",form.cellar&&"cave",form.laundry&&"buanderie"].filter(Boolean).join(", ")||"aucun annexe"}`, "Quittance de clés"].map((d,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:i<3?`1px solid ${C.border}08`:"none"}}>
                  <FileText size={14} color={C.gold}/>
                  <span style={{fontFamily:font.body,fontSize:13,color:C.textSecondary}}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:40}}>
          <GlowButton variant="ghost" onClick={()=>step>1?setStep(step-1):onBack()} icon={ChevronLeft}>
            {step>1?"Précédent":"Annuler"}
          </GlowButton>
          <GlowButton onClick={()=>step<totalSteps?setStep(step+1):null} icon={step===totalSteps?Check:ChevronRight}>
            {step===totalSteps?"Publier le bien":"Suivant"}
          </GlowButton>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SUB-PAGE: TENANTS (MATCHING VIEW)
// ═══════════════════════════════════════════════════════════════
const TenantsView = () => {
  const [selectedTenant,setSelectedTenant] = useState(null);
  const [selectedProperty,setSelectedProperty] = useState(MOCK_PROPERTIES[0]);
  const radarData = selectedTenant ? [
    {axis:"Budget",value:selectedTenant.match.budget,max:30},
    {axis:"Localisation",value:selectedTenant.match.location,max:25},
    {axis:"Pièces",value:selectedTenant.match.rooms,max:15},
    {axis:"Timing",value:selectedTenant.match.timing,max:10},
    {axis:"Fiabilité",value:selectedTenant.match.reliability,max:15},
    {axis:"Vérifié",value:selectedTenant.match.verified,max:5},
  ] : [];
  
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,height:"calc(100vh - 140px)"}}>
      {/* LEFT: Candidate list */}
      <div style={{display:"flex",flexDirection:"column",gap:12,overflow:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontFamily:font.body,fontSize:13,color:C.textMuted}}>
            {MOCK_TENANTS.length} candidats pour <strong style={{color:C.text}}>{selectedProperty.title}</strong>
          </span>
        </div>
        
        {MOCK_TENANTS.map(t=>(
          <div key={t.id} onClick={()=>setSelectedTenant(t)} style={{
            background:selectedTenant?.id===t.id?C.bgElevated:C.bgCard,
            border:`1px solid ${selectedTenant?.id===t.id?C.gold+"40":C.border}`,
            borderRadius:12, padding:16, cursor:"pointer", transition:"all 0.2s",
            display:"flex", alignItems:"center", gap:16,
          }}>
            <ScoreRing score={t.score} size={52}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontFamily:font.body,fontSize:14,fontWeight:600,color:C.text}}>{t.name}</span>
                {t.verified && <Badge color="green" size="sm"><Check size={10}/> Vérifié</Badge>}
              </div>
              <div style={{fontFamily:font.body,fontSize:12,color:C.textSecondary,marginTop:4}}>
                {t.job} — {t.city} ({t.canton})
              </div>
              <div style={{display:"flex",gap:12,marginTop:6}}>
                <span style={{fontFamily:font.mono,fontSize:11,color:C.textMuted}}>Budget: CHF {t.budget.toLocaleString()}</span>
                <span style={{fontFamily:font.mono,fontSize:11,color:C.textMuted}}>Pièces: {t.rooms}</span>
                <span style={{fontFamily:font.mono,fontSize:11,color:C.textMuted}}>Permis: {t.permits}</span>
              </div>
            </div>
            <ChevronRight size={16} color={C.textMuted}/>
          </div>
        ))}
      </div>
      
      {/* RIGHT: Detail panel */}
      <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:28,overflow:"auto"}}>
        {selectedTenant ? (
          <div>
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:28}}>
              <div style={{width:64,height:64,borderRadius:16,background:`linear-gradient(135deg,${C.gold}25,${C.purple}25)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:font.display,fontSize:24,fontWeight:600,color:C.gold}}>{selectedTenant.photo}</div>
              <div>
                <div style={{fontFamily:font.display,fontSize:24,fontWeight:400}}>{selectedTenant.name}</div>
                <div style={{fontFamily:font.body,fontSize:13,color:C.textSecondary}}>{selectedTenant.job}</div>
              </div>
              <div style={{marginLeft:"auto"}}>
                <ScoreRing score={selectedTenant.score} size={72} strokeWidth={5}/>
              </div>
            </div>
            
            {/* Radar Chart */}
            <div style={{marginBottom:24}}>
              <div style={{fontFamily:font.body,fontSize:13,fontWeight:600,color:C.text,marginBottom:12}}>Analyse du matching</div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={C.border}/>
                  <PolarAngleAxis dataKey="axis" tick={{fontSize:11,fill:C.textSecondary,fontFamily:font.body}}/>
                  <PolarRadiusAxis tick={false} axisLine={false}/>
                  <Radar name="Score" dataKey="value" stroke={C.gold} fill={C.gold} fillOpacity={0.15} strokeWidth={2}/>
                  <Radar name="Maximum" dataKey="max" stroke={C.border} fill="none" strokeWidth={1} strokeDasharray="4 4"/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Score breakdown */}
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
              {[
                {label:"Budget",score:selectedTenant.match.budget,max:30,desc:selectedTenant.income?`CHF ${selectedTenant.income.toLocaleString()}/mois — ratio ${Math.round(selectedProperty.rent/selectedTenant.income*100)}%`:""},
                {label:"Localisation",score:selectedTenant.match.location,max:25,desc:`${selectedTenant.city} (${selectedTenant.canton})`},
                {label:"Pièces",score:selectedTenant.match.rooms,max:15,desc:`Recherche: ${selectedTenant.rooms} pièces`},
                {label:"Timing",score:selectedTenant.match.timing,max:10,desc:`Dispo: ${selectedTenant.moveIn}`},
                {label:"Fiabilité",score:selectedTenant.match.reliability,max:15,desc:`Score profil`},
                {label:"Vérification",score:selectedTenant.match.verified,max:5,desc:selectedTenant.verified?"Identité + revenus":"Non vérifié"},
              ].map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontFamily:font.body,fontSize:12,color:C.textSecondary,width:80}}>{s.label}</span>
                  <div style={{flex:1,height:6,background:C.border,borderRadius:3,overflow:"hidden"}}>
                    <div style={{width:`${s.score/s.max*100}%`,height:"100%",background:s.score/s.max>=0.8?C.success:s.score/s.max>=0.5?C.gold:C.danger,borderRadius:3,transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}}/>
                  </div>
                  <span style={{fontFamily:font.mono,fontSize:11,color:C.textMuted,width:40,textAlign:"right"}}>{s.score}/{s.max}</span>
                </div>
              ))}
            </div>
            
            <div style={{display:"flex",gap:8}}>
              <GlowButton icon={Check} full>Accepter la candidature</GlowButton>
              <GlowButton variant="secondary" icon={MessageSquare}>Contacter</GlowButton>
            </div>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:16}}>
            <Users size={48} color={C.textMuted}/>
            <div style={{fontFamily:font.body,fontSize:14,color:C.textMuted}}>Sélectionnez un candidat pour voir le détail</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SUB-PAGE: ÉTAT DES LIEUX
// ═══════════════════════════════════════════════════════════════
const EtatDesLieuxView = () => {
  const [activeRoom,setActiveRoom] = useState(0);
  const [items,setItems] = useState({});
  const ratings = ["Neuf","Bon","Usé","Endommagé"];
  const ratingColors = [C.success,"#6EE7B7",C.gold,C.danger];
  
  const setItemState = (roomIdx,itemIdx,field,value) => {
    const key = `${roomIdx}-${itemIdx}`;
    setItems(prev=>({...prev,[key]:{...(prev[key]||{}),[field]:value}}));
  };
  const getItemState = (roomIdx,itemIdx) => items[`${roomIdx}-${itemIdx}`] || {};
  
  const completedItems = Object.keys(items).filter(k=>items[k].rating!==undefined).length;
  const totalItems = ETAT_LIEUX_ROOMS.reduce((a,r)=>a+r.items.length,0);
  
  return (
    <div style={{display:"grid",gridTemplateColumns:"240px 1fr",gap:24,height:"calc(100vh - 140px)"}}>
      {/* Room navigation */}
      <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:16,display:"flex",flexDirection:"column",gap:4,overflow:"auto"}}>
        <div style={{fontFamily:font.body,fontSize:12,color:C.textMuted,marginBottom:8,padding:"0 8px"}}>
          Progression: {completedItems}/{totalItems}
        </div>
        <div style={{height:4,background:C.border,borderRadius:2,marginBottom:12,marginLeft:8,marginRight:8,overflow:"hidden"}}>
          <div style={{width:`${totalItems?completedItems/totalItems*100:0}%`,height:"100%",background:C.gold,borderRadius:2,transition:"width 0.3s"}}/>
        </div>
        
        {ETAT_LIEUX_ROOMS.map((room,i)=>{
          const roomCompleted = room.items.filter((_,j)=>items[`${i}-${j}`]?.rating!==undefined).length;
          return (
            <button key={i} onClick={()=>setActiveRoom(i)} style={{
              display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",
              background:activeRoom===i?C.goldBg:"transparent", border:"none", borderRadius:8,
              cursor:"pointer", color:activeRoom===i?C.gold:C.textSecondary, transition:"all 0.2s",
            }}>
              <span style={{fontFamily:font.body,fontSize:13,fontWeight:activeRoom===i?600:400}}>{room.name}</span>
              <span style={{fontFamily:font.mono,fontSize:10,color:roomCompleted===room.items.length?C.success:C.textMuted}}>
                {roomCompleted}/{room.items.length}
              </span>
            </button>
          );
        })}
        
        <div style={{marginTop:"auto",padding:"12px 0 0",borderTop:`1px solid ${C.border}`}}>
          <GlowButton full icon={Pen} variant={completedItems===totalItems?"primary":"secondary"}>
            Signer l'état des lieux
          </GlowButton>
        </div>
      </div>
      
      {/* Room items */}
      <div style={{overflow:"auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
          <h3 style={{fontFamily:font.display,fontSize:28,fontWeight:400}}>
            {ETAT_LIEUX_ROOMS[activeRoom].name}
          </h3>
          <Badge color="gold">{ETAT_LIEUX_ROOMS[activeRoom].items.length} éléments</Badge>
        </div>
        
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {ETAT_LIEUX_ROOMS[activeRoom].items.map((item,j)=>{
            const state = getItemState(activeRoom,j);
            return (
              <div key={j} style={{background:C.bgCard,border:`1px solid ${state.rating!==undefined?C.gold+"30":C.border}`,borderRadius:10,padding:16,transition:"all 0.2s"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:state.rating!==undefined?12:0}}>
                  <span style={{fontFamily:font.body,fontSize:14,fontWeight:500,color:C.text}}>{item}</span>
                  <div style={{display:"flex",gap:6}}>
                    {ratings.map((r,k)=>(
                      <button key={k} onClick={()=>setItemState(activeRoom,j,"rating",k)} style={{
                        padding:"5px 12px", borderRadius:6, border:`1px solid ${state.rating===k?ratingColors[k]+"60":C.border}`,
                        background:state.rating===k?`${ratingColors[k]}15`:"transparent",
                        color:state.rating===k?ratingColors[k]:C.textMuted, cursor:"pointer",
                        fontFamily:font.body, fontSize:11, fontWeight:state.rating===k?600:400,
                        transition:"all 0.2s",
                      }}>{r}</button>
                    ))}
                  </div>
                </div>
                
                {state.rating !== undefined && (
                  <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <input placeholder="Remarques (optionnel)" value={state.note||""} onChange={e=>setItemState(activeRoom,j,"note",e.target.value)} style={{
                        width:"100%", background:C.bgElevated, border:`1px solid ${C.border}`, borderRadius:6,
                        padding:"8px 12px", fontFamily:font.body, fontSize:12, color:C.text, outline:"none",
                      }} onFocus={e=>e.target.style.borderColor=C.gold+"60"} onBlur={e=>e.target.style.borderColor=C.border}/>
                    </div>
                    <button style={{display:"flex",alignItems:"center",gap:4,padding:"8px 14px",background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",color:C.textMuted,fontFamily:font.body,fontSize:11}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                      <Camera size={14}/> Photo
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SUB-PAGE: LEASES
// ═══════════════════════════════════════════════════════════════
const LeasesView = () => (
  <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <div style={{fontFamily:font.body,fontSize:14,color:C.textMuted}}>2 baux actifs</div>
    </div>
    {[
      {ref:"JU-2026-0047",tenant:"Marc Dubois",property:"2.5 pièces, Porrentruy",start:"15.03.2026",rent:"CHF 980",status:"active",signed:true},
      {ref:"JU-2026-0031",tenant:"Sophie Müller",property:"3.5 pièces, Delémont",start:"01.04.2026",rent:"CHF 1'350",status:"pending",signed:false},
    ].map((l,i)=>(
      <div key={i} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:20,marginBottom:12,cursor:"pointer",transition:"border-color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold+"40"} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontFamily:font.mono,fontSize:12,color:C.gold}}>{l.ref}</span>
              <Badge color={l.status==="active"?"green":"gold"}>{l.status==="active"?"Actif":"En attente signature"}</Badge>
            </div>
            <div style={{fontFamily:font.body,fontSize:15,fontWeight:600,color:C.text}}>{l.property}</div>
            <div style={{fontFamily:font.body,fontSize:13,color:C.textSecondary,marginTop:4}}>Locataire: {l.tenant} — Début: {l.start}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:font.display,fontSize:22,fontWeight:600}}>{l.rent}</div>
            <div style={{fontFamily:font.body,fontSize:11,color:C.textMuted}}>loyer net/mois</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:16}}>
          <GlowButton variant="secondary" size="sm" icon={FileText}>Voir le bail</GlowButton>
          <GlowButton variant="ghost" size="sm" icon={Camera}>État des lieux</GlowButton>
          {!l.signed && <GlowButton size="sm" icon={Pen}>Signer</GlowButton>}
        </div>
      </div>
    ))}
    
    {/* Legal reference box */}
    <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:20,marginTop:24}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <Shield size={16} color={C.gold}/>
        <span style={{fontFamily:font.body,fontSize:13,fontWeight:600,color:C.text}}>Références légales incluses dans vos baux</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
        {[
          {label:"Taux hypothécaire de réf.",value:"1.25%",source:"OFL — Mise à jour trimestrielle",icon:TrendingUp},
          {label:"IPC (base déc. 2025)",value:"107.1 pts",source:"OFS — Mise à jour mensuelle",icon:BarChart3},
          {label:"Art. OBLF applicable",value:"Art. 12-13, 16, 19",source:"Conformité automatique",icon:FileText},
        ].map((r,i)=>(
          <div key={i} style={{padding:16,background:C.bgElevated,borderRadius:8,border:`1px solid ${C.border}`}}>
            <r.icon size={16} color={C.gold} style={{marginBottom:8}}/>
            <div style={{fontFamily:font.body,fontSize:11,color:C.textMuted}}>{r.label}</div>
            <div style={{fontFamily:font.mono,fontSize:18,fontWeight:700,color:C.text,margin:"4px 0"}}>{r.value}</div>
            <div style={{fontFamily:font.body,fontSize:10,color:C.textMuted}}>{r.source}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Placeholder sub-pages
const ArtisansView = () => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:400,gap:16}}>
    <Wrench size={48} color={C.textMuted}/>
    <div style={{fontFamily:font.display,fontSize:24,color:C.text}}>Marketplace artisans</div>
    <div style={{fontFamily:font.body,fontSize:14,color:C.textMuted}}>Plombiers, électriciens, peintres — bientôt disponible</div>
    <Badge color="gold">Prochainement</Badge>
  </div>
);
const MessagesView = () => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:400,gap:16}}>
    <MessageSquare size={48} color={C.textMuted}/>
    <div style={{fontFamily:font.display,fontSize:24,color:C.text}}>Messagerie</div>
    <div style={{fontFamily:font.body,fontSize:14,color:C.textMuted}}>Communication propriétaire-locataire sécurisée</div>
    <Badge color="gold">Prochainement</Badge>
  </div>
);
const SettingsView = () => (
  <div style={{display:"flex",flexDirection:"column",gap:20,maxWidth:600}}>
    <h3 style={{fontFamily:font.display,fontSize:28,fontWeight:400}}>Paramètres</h3>
    <Input label="Nom complet" value="Olivier Botteron" onChange={()=>{}}/>
    <Input label="Email" value="olivier@immo.cool" onChange={()=>{}} icon={Mail}/>
    <Input label="Téléphone" value="+41 79 XXX XX XX" onChange={()=>{}} icon={Phone}/>
    <div style={{padding:16,background:C.goldBg,border:`1px solid ${C.gold}30`,borderRadius:10,display:"flex",alignItems:"center",gap:12}}>
      <Award size={20} color={C.gold}/>
      <div>
        <div style={{fontFamily:font.body,fontSize:13,fontWeight:600,color:C.gold}}>Stripe Connect</div>
        <div style={{fontFamily:font.body,fontSize:12,color:C.textSecondary}}>Compte connecté — prêt à recevoir des paiements</div>
      </div>
      <Badge color="green">Actif</Badge>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// AUTH PAGES
// ═══════════════════════════════════════════════════════════════
const AuthPage = ({mode,onNavigate}) => {
  const [email,setEmail] = useState("");
  const [pass,setPass] = useState("");
  const [role,setRole] = useState("LANDLORD");
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const isRegister = mode==="register";
  
  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex"}}>
      {/* Left: form */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 80px",maxWidth:560}}>
        <button onClick={()=>onNavigate("landing")} style={{display:"flex",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",marginBottom:48}}>
          <span style={{fontFamily:font.display,fontSize:24,fontWeight:600,color:C.text}}>immo</span>
          <span style={{fontFamily:font.display,fontSize:24,fontWeight:600,color:C.gold}}>.</span>
          <span style={{fontFamily:font.display,fontSize:24,fontWeight:600,color:C.text}}>cool</span>
        </button>
        
        <h2 style={{fontFamily:font.display,fontSize:36,fontWeight:400,marginBottom:8}}>
          {isRegister?"Créer un":"Accédez à votre"} <span style={{fontStyle:"italic",color:C.gold}}>compte</span>
        </h2>
        <p style={{fontFamily:font.body,fontSize:14,color:C.textMuted,marginBottom:36}}>
          {isRegister?"Commencez gratuitement — aucun engagement.":"Heureux de vous revoir."}
        </p>
        
        {isRegister && (
          <div style={{marginBottom:24}}>
            <label style={{fontFamily:font.body,fontSize:12,color:C.textSecondary,fontWeight:500,marginBottom:10,display:"block"}}>Je suis</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[{value:"LANDLORD",label:"Propriétaire",icon:Key},{value:"TENANT",label:"Locataire",icon:Search},{value:"ARTISAN",label:"Artisan",icon:Wrench}].map(r=>(
                <button key={r.value} onClick={()=>setRole(r.value)} style={{
                  padding:"14px",background:role===r.value?C.goldBg:C.bgElevated,
                  border:`1px solid ${role===r.value?C.gold+"50":C.border}`,borderRadius:10,
                  cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8,
                  color:role===r.value?C.gold:C.textSecondary,transition:"all 0.2s",
                }}>
                  <r.icon size={20}/>
                  <span style={{fontFamily:font.body,fontSize:12,fontWeight:role===r.value?600:400}}>{r.label}</span>
                  {r.value==="TENANT" && <span style={{fontFamily:font.mono,fontSize:9,color:C.success}}>GRATUIT</span>}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {isRegister && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Input label="Prénom" value={firstName} onChange={setFirstName} placeholder="Olivier"/>
              <Input label="Nom" value={lastName} onChange={setLastName} placeholder="Botteron"/>
            </div>
          )}
          <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="olivier@example.ch" icon={Mail}/>
          <Input label="Mot de passe" value={pass} onChange={setPass} type="password" placeholder="Min. 8 caractères" icon={Lock}/>
          
          <GlowButton full size="lg" onClick={()=>onNavigate("dashboard")} icon={ArrowRight}>
            {isRegister?"Créer mon compte":"Se connecter"}
          </GlowButton>
          
          <div style={{textAlign:"center",marginTop:8}}>
            <span style={{fontFamily:font.body,fontSize:13,color:C.textMuted}}>
              {isRegister?"Déjà un compte ? ":"Pas encore de compte ? "}
            </span>
            <span onClick={()=>onNavigate(isRegister?"login":"register")} style={{fontFamily:font.body,fontSize:13,color:C.gold,cursor:"pointer",fontWeight:600}}>
              {isRegister?"Connexion":"S'inscrire"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Right: visual */}
      <div style={{flex:1,background:`linear-gradient(135deg,${C.bgCard},${C.bgElevated})`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"20%",right:"10%",width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${C.gold}08,transparent)`,pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"10%",left:"20%",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${C.purple}05,transparent)`,pointerEvents:"none"}}/>
        
        <div style={{textAlign:"center",maxWidth:400,position:"relative",zIndex:2}}>
          <div style={{fontFamily:font.display,fontSize:72,fontWeight:300,color:C.gold,lineHeight:1,marginBottom:24}}>50%</div>
          <div style={{fontFamily:font.body,fontSize:18,color:C.text,marginBottom:8}}>moins cher qu'une régie</div>
          <div style={{fontFamily:font.body,fontSize:14,color:C.textMuted,lineHeight:1.7}}>
            Bail conforme, matching IA, état des lieux digital — tout automatisé pour les 26 cantons suisses.
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:32}}>
            {[{n:"2'847",l:"Locataires"},{n:"312",l:"Propriétaires"},{n:"26",l:"Cantons"}].map((s,i)=>(
              <div key={i} style={{textAlign:"center"}}>
                <div style={{fontFamily:font.mono,fontSize:20,fontWeight:700,color:C.gold}}>{s.n}</div>
                <div style={{fontFamily:font.body,fontSize:11,color:C.textMuted}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN APP — ROUTER
// ═══════════════════════════════════════════════════════════════
export default function ImmoCoolPlatform() {
  const [page,setPage] = useState("landing");
  const [subPage,setSubPage] = useState("overview");
  
  const navigate = useCallback((p) => {
    setPage(p);
    if(p==="dashboard") setSubPage("overview");
  }, []);
  
  return (
    <div style={{fontFamily:font.body}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        html, body { background:${C.bg}; }
        ::selection { background:${C.gold}30; color:${C.text}; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:${C.bg}; }
        ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:3px; }
        ::-webkit-scrollbar-thumb:hover { background:${C.borderHover}; }
        input::placeholder { color:${C.textMuted}; }
        select option { background:${C.bg}; color:${C.text}; }
      `}</style>
      
      {page === "landing" && <Landing onNavigate={navigate}/>}
      {page === "login" && <AuthPage mode="login" onNavigate={navigate}/>}
      {page === "register" && <AuthPage mode="register" onNavigate={navigate}/>}
      {page === "dashboard" && <Dashboard onNavigate={navigate} subPage={subPage} setSubPage={setSubPage}/>}
    </div>
  );
}
