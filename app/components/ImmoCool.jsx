import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { Home, Search, Plus, FileText, Key, Users, MessageSquare, Settings, Bell, ChevronRight, ChevronLeft, MapPin, Bed, Bath, Square, Star, Shield, Check, X, Camera, Pen, TrendingUp, Building2, Wrench, LogOut, Menu, ArrowRight, ArrowLeft, Clock, Zap, Heart, Eye, Phone, Mail, Calendar, DollarSign, BarChart3, AlertTriangle, CheckCircle2, Upload, Sparkles, Lock, Globe, Award, CircleDot, Send, Paperclip, Image, Filter, SlidersHorizontal, RefreshCw, ChevronDown, ChevronUp, Maximize2, Minimize2, BellRing, XCircle, Info, AlertCircle, Trash2, Edit3, Copy, Download, ExternalLink, MoreHorizontal, Bookmark, Share2, ThumbsUp, Navigation, Layers, ZoomIn, ZoomOut, Move, RotateCcw } from "lucide-react";

// ═══════════════════════════════════════════════════════
// DESIGN SYSTEM — SWISS NOIR LUXURY v3
// ═══════════════════════════════════════════════════════
const C = {
  bg: "#07060A", bgCard: "#0F0E14", bgElevated: "#16151E", bgHover: "#1C1B27", bgOverlay: "rgba(7,6,10,0.85)",
  border: "#2A2838", borderHover: "#3D3A50", borderFocus: "#D4A85380",
  gold: "#D4A853", goldLight: "#E8C97A", goldDim: "#A07D2E", goldBg: "rgba(212,168,83,0.08)", goldBg2: "rgba(212,168,83,0.15)",
  text: "#F0EDE6", textSecondary: "#9B97A8", textMuted: "#5E5A6E", textDim: "#3D3950",
  success: "#34D399", successBg: "rgba(52,211,153,0.1)",
  danger: "#F87171", dangerBg: "rgba(248,113,113,0.1)",
  info: "#60A5FA", infoBg: "rgba(96,165,250,0.1)",
  purple: "#A78BFA", purpleBg: "rgba(167,139,250,0.08)",
  cyan: "#22D3EE",
};
const F = { display: "'Cormorant Garamond',Georgia,serif", body: "'DM Sans',-apple-system,sans-serif", mono: "'JetBrains Mono','SF Mono',monospace" };

// ═══════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════
const CANTONS = ["JU","VD","GE","NE","FR","BE","VS","BS","BL","SO","AG","ZH","LU","ZG","SZ","OW","NW","UR","GL","SH","TG","SG","AR","AI","GR","TI"];
const PROPERTIES = [
  {id:1,title:"3.5 pièces lumineux, vue Jura",addr:"Rue de la Gare 12",city:"Delémont",canton:"JU",rooms:3.5,area:78,rent:1350,charges:180,deposit:3,floor:2,floors:4,balcony:true,parking:true,cellar:true,laundry:true,avail:"2026-04-01",imgs:4,status:"active",apps:7,views:143,score:92,prevRent:1280,lat:47.3647,lng:7.3441,desc:"Magnifique appartement lumineux au 2ème étage avec vue dégagée sur les collines du Jura. Cuisine équipée récente, parquet chêne dans le séjour, salle de bains avec douche italienne. Cave et place de parc incluses.",features:["Parquet chêne","Cuisine IKEA 2024","Douche italienne","Double vitrage"]},
  {id:2,title:"2.5 pièces rénové, centre-ville",addr:"Grand-Rue 45",city:"Porrentruy",canton:"JU",rooms:2.5,area:55,rent:980,charges:120,deposit:2,floor:1,floors:3,balcony:false,parking:false,cellar:true,laundry:false,avail:"2026-03-15",imgs:6,status:"active",apps:12,views:218,score:87,prevRent:920,lat:47.4153,lng:7.0755,desc:"Studio rénové en 2025 au cœur de Porrentruy. Idéal première location ou personne seule. Proche gares et commerces.",features:["Rénové 2025","Centre-ville","Proche gare","Cave privée"]},
  {id:3,title:"4.5 pièces familial, quartier calme",addr:"Chemin des Prés 8",city:"Delémont",canton:"JU",rooms:4.5,area:105,rent:1780,charges:220,deposit:3,floor:0,floors:2,balcony:true,parking:true,cellar:true,laundry:true,avail:"2026-05-01",imgs:8,status:"active",apps:3,views:87,score:0,prevRent:null,lat:47.3589,lng:7.3501,desc:"Grand appartement familial en rez-de-chaussée avec jardin privatif. 3 chambres, cuisine ouverte sur séjour, 2 salles d'eau. Quartier résidentiel calme.",features:["Jardin privatif","3 chambres","2 salles d'eau","Buanderie privée"]},
  {id:4,title:"3.5 pièces avec terrasse panoramique",addr:"Route de Bâle 22",city:"Delémont",canton:"JU",rooms:3.5,area:82,rent:1480,charges:200,deposit:3,floor:3,floors:4,balcony:true,parking:true,cellar:true,laundry:true,avail:"2026-04-15",imgs:5,status:"active",apps:9,views:176,score:85,prevRent:1400,lat:47.3720,lng:7.3380,desc:"Superbe attique avec terrasse de 20m² offrant une vue panoramique. Finitions haut de gamme, cuisine Siemens, parquet massif.",features:["Terrasse 20m²","Vue panoramique","Cuisine Siemens","Attique"]},
];
const TENANTS = [
  {id:1,name:"Sophie Müller",score:94,income:6800,job:"CDI — Ingénieure",city:"Bâle",canton:"BS",verified:true,av:"SM",budget:1500,rooms:"3-4",moveIn:"2026-04-01",permit:"C",match:{budget:28,location:22,rooms:14,timing:10,reliability:14,verified:5},msg:"Bonjour, je suis très intéressée par votre appartement. Serait-il possible de planifier une visite ?"},
  {id:2,name:"Marc Dubois",score:87,income:5200,job:"CDI — Comptable",city:"Delémont",canton:"JU",verified:true,av:"MD",budget:1400,rooms:"3-4",moveIn:"2026-04-01",permit:"CH",match:{budget:25,location:25,rooms:14,timing:10,reliability:9,verified:4},msg:"Habitant déjà Delémont, je cherche un logement plus grand pour ma famille."},
  {id:3,name:"Leila Amrani",score:81,income:4900,job:"CDD — Chercheuse",city:"Neuchâtel",canton:"NE",verified:false,av:"LA",budget:1300,rooms:"2-3",moveIn:"2026-03-15",permit:"B",match:{budget:22,location:18,rooms:12,timing:9,reliability:13,verified:3},msg:"Je déménage dans le Jura pour un poste à la HE-Arc."},
  {id:4,name:"Thomas Weber",score:76,income:5500,job:"Indépendant",city:"Bienne",canton:"BE",verified:true,av:"TW",budget:1600,rooms:"3-4",moveIn:"2026-05-01",permit:"CH",match:{budget:24,location:15,rooms:14,timing:6,reliability:12,verified:5},msg:"Graphiste indépendant, je cherche un espace calme pour travailler depuis chez moi."},
  {id:5,name:"Ana Costa",score:68,income:4200,job:"CDI — Vendeuse",city:"Delémont",canton:"JU",verified:false,av:"AC",budget:1200,rooms:"2-3",moveIn:"2026-04-15",permit:"B",match:{budget:18,location:25,rooms:10,timing:8,reliability:5,verified:2},msg:"Je cherche mon premier appartement à Delémont."},
];
const STATS = [{m:"Sep",views:45,apps:3,rev:0},{m:"Oct",views:89,apps:8,rev:1350},{m:"Nov",views:134,apps:12,rev:2330},{m:"Dec",views:98,apps:7,rev:1350},{m:"Jan",views:167,apps:15,rev:3680},{m:"Fév",views:218,apps:19,rev:4030}];
const ROOMS_EDL = [
  {name:"Entrée",items:["Porte d'entrée","Serrure","Sol","Murs","Plafond","Éclairage","Interphone","Boîte aux lettres"]},
  {name:"Séjour",items:["Sol (parquet)","Murs","Plafond","Fenêtres","Stores/volets","Prises électriques","Éclairage","Radiateur"]},
  {name:"Cuisine",items:["Plan de travail","Évier + robinetterie","Plaques/cuisinière","Four","Réfrigérateur","Lave-vaisselle","Hotte","Armoires","Sol","Murs","Fenêtre","Prises"]},
  {name:"Chambre 1",items:["Sol","Murs","Plafond","Fenêtres","Stores/volets","Prises","Éclairage","Armoire"]},
  {name:"Chambre 2",items:["Sol","Murs","Plafond","Fenêtres","Stores/volets","Prises","Éclairage","Armoire"]},
  {name:"Salle de bains",items:["Lavabo","Baignoire/douche","WC","Miroir","Ventilation","Sol","Murs","Armoire toilette"]},
  {name:"Balcon",items:["Sol","Balustrade","Stores extérieurs","Éclairage"]},
  {name:"Cave",items:["Porte + serrure","Sol","Murs","Éclairage"]},
];
const MESSAGES_DATA = [
  {id:1,from:"Sophie Müller",av:"SM",preview:"Serait-il possible de visiter samedi ?",time:"14:32",unread:true,thread:[
    {from:"Sophie Müller",text:"Bonjour ! Je suis très intéressée par votre 3.5 pièces à Delémont. Serait-il possible de planifier une visite ce samedi ?",time:"14:32",mine:false},
    {from:"Vous",text:"Bonjour Sophie, bien sûr ! Samedi 10h ou 14h, qu'est-ce qui vous arrange ?",time:"14:45",mine:true},
    {from:"Sophie Müller",text:"14h serait parfait. Merci beaucoup !",time:"14:52",mine:false},
  ]},
  {id:2,from:"Marc Dubois",av:"MD",preview:"J'ai une question sur les charges",time:"Hier",unread:false,thread:[
    {from:"Marc Dubois",text:"Bonjour, les CHF 180 de charges incluent-ils le chauffage et l'eau chaude ?",time:"Hier 09:15",mine:false},
    {from:"Vous",text:"Oui, les charges couvrent chauffage, eau chaude et entretien des communs. L'électricité est à votre charge.",time:"Hier 10:02",mine:true},
  ]},
  {id:3,from:"Plomberie Jurassienne",av:"PJ",preview:"Devis pour remplacement robinet: CHF 280",time:"21.02",unread:false,thread:[
    {from:"Plomberie Jurassienne",text:"Suite à votre demande, voici notre devis pour le remplacement du robinet cuisine au Grand-Rue 45: CHF 280 TTC, intervention possible jeudi prochain.",time:"21.02",mine:false},
  ]},
];
const NOTIFS = [
  {id:1,type:"match",title:"Nouveau match 94/100",desc:"Sophie Müller — 3.5 pièces Delémont",time:"Il y a 2h",read:false},
  {id:2,type:"app",title:"Nouvelle candidature",desc:"Thomas Weber pour 3.5 pièces Delémont",time:"Il y a 5h",read:false},
  {id:3,type:"legal",title:"Taux hypothécaire vérifié",desc:"1.25% — conforme (prochaine vérif. 01.06.2026)",time:"Aujourd'hui",read:true},
  {id:4,type:"lease",title:"Bail signé",desc:"Marc Dubois — 2.5 pièces Porrentruy",time:"Hier",read:true},
  {id:5,type:"payment",title:"Commission reçue",desc:"CHF 490 — Porrentruy (réf. JU-2026-0047)",time:"22.02",read:true},
];

// ═══════════════════════════════════════════════════════
// MICRO COMPONENTS
// ═══════════════════════════════════════════════════════
const Badge = ({children,color="gold",s="sm"}) => {
  const m = {gold:[C.goldBg,C.gold],green:[C.successBg,C.success],red:[C.dangerBg,C.danger],blue:[C.infoBg,C.info],purple:[C.purpleBg,C.purple],cyan:["rgba(34,211,238,0.1)",C.cyan]};
  const [bg,fg]=m[color]||m.gold;
  return <span style={{background:bg,color:fg,padding:s==="sm"?"3px 10px":"5px 14px",borderRadius:20,fontSize:s==="sm"?11:12,fontFamily:F.mono,fontWeight:600,letterSpacing:"0.02em",display:"inline-flex",alignItems:"center",gap:4,whiteSpace:"nowrap"}}>{children}</span>;
};

const Ring = ({score,size=64,sw=4,label=true}) => {
  const r=(size-sw)/2, ci=2*Math.PI*r, off=ci*(1-score/100);
  const col=score>=85?C.success:score>=70?C.gold:score>=50?C.info:C.danger;
  return <div style={{position:"relative",width:size,height:size}}>
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={sw}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={ci} strokeDashoffset={off} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)"}}/></svg>
    {label&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,fontSize:size*.28,fontWeight:700,color:col}}>{score}</div>}
  </div>;
};

const Btn = ({children,onClick,v="primary",s="md",icon:I,full,disabled}) => {
  const [h,setH]=useState(false);
  const st={primary:{bg:C.gold,c:C.bg,hb:C.goldLight,sh:`0 0 30px ${C.gold}40`},secondary:{bg:"transparent",c:C.gold,hb:C.goldBg,bd:`1px solid ${C.gold}50`},ghost:{bg:"transparent",c:C.textSecondary,hb:C.bgHover},danger:{bg:C.dangerBg,c:C.danger,hb:"rgba(248,113,113,0.2)"},success:{bg:C.successBg,c:C.success,hb:"rgba(52,211,153,0.2)"}};
  const x=st[v]||st.primary; const pad=s==="sm"?"7px 14px":s==="lg"?"13px 28px":"9px 20px"; const fs=s==="sm"?12:s==="lg"?15:13;
  return <button onClick={onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{background:h?x.hb:x.bg,color:x.c,padding:pad,border:x.bd||"none",borderRadius:8,cursor:disabled?"not-allowed":"pointer",fontFamily:F.body,fontSize:fs,fontWeight:600,letterSpacing:"0.02em",display:"inline-flex",alignItems:"center",gap:7,transition:"all 0.25s",boxShadow:h&&x.sh?x.sh:"none",width:full?"100%":"auto",justifyContent:"center",opacity:disabled?0.5:1}}>{I&&<I size={fs+1}/>}{children}</button>;
};

const Stat = ({label,value,sub,icon:I,trend,color="gold"}) => {
  const fg={gold:C.gold,green:C.success,blue:C.info,purple:C.purple}[color];
  return <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 22px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <span style={{fontFamily:F.body,fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.08em"}}>{label}</span>
      {I&&<div style={{width:30,height:30,borderRadius:8,background:`${fg}15`,display:"flex",alignItems:"center",justifyContent:"center"}}><I size={15} color={fg}/></div>}
    </div>
    <div style={{fontFamily:F.display,fontSize:30,fontWeight:600,color:C.text,lineHeight:1,marginTop:6}}>{value}</div>
    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
      {trend!=null&&<span style={{fontFamily:F.mono,fontSize:11,color:trend>0?C.success:C.danger}}>{trend>0?"+":""}{trend}%</span>}
      {sub&&<span style={{fontFamily:F.body,fontSize:11,color:C.textMuted}}>{sub}</span>}
    </div>
  </div>;
};

const Inp = ({label,value,onChange,type="text",ph,icon:I,suf,area}) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontFamily:F.body,fontSize:12,color:C.textSecondary,fontWeight:500}}>{label}</label>}
    <div style={{position:"relative",display:"flex",alignItems:area?"flex-start":"center"}}>
      {I&&<I size={15} color={C.textMuted} style={{position:"absolute",left:12,top:area?12:undefined}}/>}
      {area?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} rows={3} style={{width:"100%",background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:8,padding:`10px 14px 10px ${I?"38px":"14px"}`,fontFamily:F.body,fontSize:14,color:C.text,outline:"none",resize:"vertical",transition:"border-color 0.2s"}} onFocus={e=>e.target.style.borderColor=C.borderFocus} onBlur={e=>e.target.style.borderColor=C.border}/>
      :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} style={{width:"100%",background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:8,padding:`10px ${suf?"48px":"14px"} 10px ${I?"38px":"14px"}`,fontFamily:F.body,fontSize:14,color:C.text,outline:"none",transition:"border-color 0.2s"}} onFocus={e=>e.target.style.borderColor=C.borderFocus} onBlur={e=>e.target.style.borderColor=C.border}/>}
      {suf&&<span style={{position:"absolute",right:12,fontFamily:F.mono,fontSize:12,color:C.textMuted}}>{suf}</span>}
    </div>
  </div>
);

const Sel = ({label,value,onChange,opts}) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontFamily:F.body,fontSize:12,color:C.textSecondary,fontWeight:500}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontFamily:F.body,fontSize:14,color:C.text,outline:"none",cursor:"pointer",appearance:"none"}}>
      {opts.map(o=><option key={o.v} value={o.v} style={{background:C.bg}}>{o.l}</option>)}
    </select>
  </div>
);

const Fade = ({show,children,d=0}) => <div style={{opacity:show?1:0,transform:show?"translateY(0)":"translateY(16px)",transition:`all 0.5s cubic-bezier(0.16,1,0.3,1) ${d}s`,pointerEvents:show?"auto":"none"}}>{children}</div>;

// ═══════════════════════════════════════════════════════
// SIGNATURE PAD — canvas réel
// ═══════════════════════════════════════════════════════
const SignaturePad = ({onSave,onCancel}) => {
  const canvasRef = useRef(null);
  const [drawing,setDrawing] = useState(false);
  const [hasSignature,setHasSignature] = useState(false);
  
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches?.[0];
    return { x:(touch||e).clientX-rect.left, y:(touch||e).clientY-rect.top };
  };
  const startDraw = (e) => { e.preventDefault(); setDrawing(true); setHasSignature(true); const ctx=canvasRef.current.getContext("2d"); const p=getPos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); };
  const draw = (e) => { if(!drawing)return; e.preventDefault(); const ctx=canvasRef.current.getContext("2d"); const p=getPos(e); ctx.lineTo(p.x,p.y); ctx.strokeStyle=C.gold; ctx.lineWidth=2.5; ctx.lineCap="round"; ctx.lineJoin="round"; ctx.stroke(); };
  const stopDraw = () => setDrawing(false);
  const clear = () => { const ctx=canvasRef.current.getContext("2d"); ctx.clearRect(0,0,canvasRef.current.width,canvasRef.current.height); setHasSignature(false); };
  
  return (
    <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontFamily:F.body,fontSize:14,fontWeight:600,color:C.text}}>Signature électronique</div>
        <Btn v="ghost" s="sm" icon={RotateCcw} onClick={clear}>Effacer</Btn>
      </div>
      <div style={{border:`1px dashed ${hasSignature?C.gold+"60":C.border}`,borderRadius:8,overflow:"hidden",background:C.bgElevated,marginBottom:16,position:"relative"}}>
        <canvas ref={canvasRef} width={500} height={160}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
          style={{width:"100%",height:160,cursor:"crosshair",touchAction:"none",display:"block"}}/>
        {!hasSignature && <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
          <span style={{fontFamily:F.body,fontSize:13,color:C.textMuted}}>Signez ici avec la souris ou le doigt</span>
        </div>}
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        {onCancel&&<Btn v="ghost" onClick={onCancel}>Annuler</Btn>}
        <Btn disabled={!hasSignature} onClick={()=>onSave?.(canvasRef.current.toDataURL())} icon={Check}>Valider la signature</Btn>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// MAP COMPONENT — SVG interactive
// ═══════════════════════════════════════════════════════
const PropertyMap = ({properties,selected,onSelect}) => {
  const minLat=47.34,maxLat=47.42,minLng=7.06,maxLng=7.36;
  const toX = lng => ((lng-minLng)/(maxLng-minLng))*100;
  const toY = lat => (1-(lat-minLat)/(maxLat-minLat))*100;
  return (
    <div style={{position:"relative",width:"100%",height:"100%",background:`linear-gradient(145deg,${C.bgCard},${C.bgElevated})`,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden",minHeight:300}}>
      {/* Grid lines */}
      <svg width="100%" height="100%" style={{position:"absolute",inset:0,opacity:0.15}}>
        {[20,40,60,80].map(p=><line key={`h${p}`} x1="0%" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke={C.border} strokeWidth={0.5}/>)}
        {[20,40,60,80].map(p=><line key={`v${p}`} x1={`${p}%`} y1="0%" x2={`${p}%`} y2="100%" stroke={C.border} strokeWidth={0.5}/>)}
      </svg>
      <div style={{position:"absolute",top:12,left:12,display:"flex",gap:4,zIndex:5}}>
        <Badge color="gold" s="sm"><MapPin size={10}/> Canton du Jura</Badge>
      </div>
      {/* Pins */}
      {properties.filter(p=>p.lat&&p.lng).map(p=>(
        <div key={p.id} onClick={()=>onSelect?.(p)} style={{
          position:"absolute", left:`${toX(p.lng)}%`, top:`${toY(p.lat)}%`, transform:"translate(-50%,-100%)",
          cursor:"pointer", zIndex:selected?.id===p.id?10:5, transition:"all 0.3s",
        }}>
          <div style={{
            background:selected?.id===p.id?C.gold:C.bgElevated,
            border:`2px solid ${selected?.id===p.id?C.gold:C.border}`,
            borderRadius:20, padding:"4px 10px", whiteSpace:"nowrap",
            boxShadow:selected?.id===p.id?`0 4px 20px ${C.gold}40`:`0 2px 8px rgba(0,0,0,0.4)`,
            transform:selected?.id===p.id?"scale(1.1)":"scale(1)", transition:"all 0.3s",
          }}>
            <span style={{fontFamily:F.mono,fontSize:12,fontWeight:700,color:selected?.id===p.id?C.bg:C.text}}>
              {p.rent.toLocaleString()}
            </span>
          </div>
          <div style={{width:0,height:0,borderLeft:"6px solid transparent",borderRight:"6px solid transparent",borderTop:`6px solid ${selected?.id===p.id?C.gold:C.border}`,margin:"0 auto"}}/>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// NOTIFICATIONS PANEL
// ═══════════════════════════════════════════════════════
const NotifPanel = ({open,onClose,notifs}) => {
  if(!open)return null;
  const icons = {match:Sparkles,app:Users,legal:Shield,lease:FileText,payment:DollarSign};
  const colors = {match:C.purple,app:C.info,legal:C.gold,lease:C.success,payment:C.success};
  return (
    <div style={{position:"absolute",top:"100%",right:0,width:360,background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,boxShadow:`0 12px 40px rgba(0,0,0,0.5)`,zIndex:100,marginTop:8,overflow:"hidden"}}>
      <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:F.body,fontSize:14,fontWeight:600,color:C.text}}>Notifications</span>
        <Btn v="ghost" s="sm" onClick={onClose}><X size={14}/></Btn>
      </div>
      <div style={{maxHeight:400,overflow:"auto"}}>
        {notifs.map(n=>{const Ic=icons[n.type]||Bell;const col=colors[n.type]||C.gold;return(
          <div key={n.id} style={{padding:"12px 18px",display:"flex",gap:12,alignItems:"flex-start",borderBottom:`1px solid ${C.border}08`,background:n.read?"transparent":C.goldBg,cursor:"pointer",transition:"background 0.2s"}} onMouseEnter={e=>e.currentTarget.style.background=C.bgHover} onMouseLeave={e=>e.currentTarget.style.background=n.read?"transparent":C.goldBg}>
            <div style={{width:32,height:32,borderRadius:8,background:`${col}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic size={15} color={col}/></div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:F.body,fontSize:13,fontWeight:n.read?400:600,color:C.text}}>{n.title}</div>
              <div style={{fontFamily:F.body,fontSize:12,color:C.textSecondary,marginTop:2}}>{n.desc}</div>
            </div>
            <span style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,flexShrink:0,marginTop:2}}>{n.time}</span>
          </div>
        );})}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════
const Landing = ({nav}) => {
  const [a,setA]=useState(0);
  useEffect(()=>{const t1=setTimeout(()=>setA(1),100),t2=setTimeout(()=>setA(2),400),t3=setTimeout(()=>setA(3),700);return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3)}},[]);
  
  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,overflow:"hidden"}}>
      <div style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <div style={{position:"absolute",top:"-20%",right:"-10%",width:600,height:600,borderRadius:"50%",background:`radial-gradient(circle,${C.gold}08 0%,transparent 70%)`,pointerEvents:"none"}}/>
        <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"24px 48px",position:"relative",zIndex:10,opacity:a>=1?1:0,transform:a>=1?"none":"translateY(-20px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1)"}}>
          <div style={{display:"flex",alignItems:"center"}}><span style={{fontFamily:F.display,fontSize:28,fontWeight:600}}>immo</span><span style={{fontFamily:F.display,fontSize:28,fontWeight:600,color:C.gold}}>.</span><span style={{fontFamily:F.display,fontSize:28,fontWeight:600}}>cool</span></div>
          <div style={{display:"flex",gap:8}}><Btn v="ghost" onClick={()=>nav("login")}>Connexion</Btn><Btn onClick={()=>nav("register")}>Commencer gratuitement</Btn></div>
        </nav>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 48px",position:"relative",zIndex:5}}>
          <div style={{maxWidth:900,textAlign:"center"}}>
            <Fade show={a>=1}><Badge color="gold" s="md">La première régie 100% IA de Suisse</Badge></Fade>
            <Fade show={a>=2} d={0.15}><h1 style={{fontFamily:F.display,fontSize:"clamp(48px,7vw,86px)",fontWeight:400,lineHeight:1.05,margin:"32px 0 24px"}}>Louez sans<br/><span style={{fontStyle:"italic",color:C.gold}}>intermédiaire</span></h1></Fade>
            <Fade show={a>=2} d={0.25}><p style={{fontFamily:F.body,fontSize:18,color:C.textSecondary,maxWidth:560,margin:"0 auto 40px",lineHeight:1.7}}>Matching intelligent, bail conforme aux 26 cantons, paiements sécurisés, état des lieux digital — 100% automatisé. <strong style={{color:C.text}}>Gratuit pour les locataires.</strong></p></Fade>
            <Fade show={a>=3} d={0.35}>
              <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
                <Btn s="lg" icon={Key} onClick={()=>nav("register")}>Espace propriétaire</Btn>
                <Btn s="lg" v="secondary" icon={Search} onClick={()=>nav("tenant-search")}>Chercher un appartement</Btn>
              </div>
            </Fade>
            <Fade show={a>=3} d={0.5}>
              <div style={{display:"flex",justifyContent:"center",gap:32,marginTop:48}}>
                {[{i:Shield,l:"Droit suisse"},{i:Lock,l:"Stripe sécurisé"},{i:Globe,l:"26 cantons"}].map((b,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:6}}><b.i size={14} color={C.textMuted}/><span style={{fontFamily:F.body,fontSize:12,color:C.textMuted}}>{b.l}</span></div>))}
              </div>
            </Fade>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div style={{padding:"100px 48px",position:"relative"}}>
        <div style={{maxWidth:1000,margin:"0 auto",textAlign:"center"}}>
          <span style={{fontFamily:F.mono,fontSize:11,color:C.gold,letterSpacing:"0.15em",textTransform:"uppercase"}}>Tarification</span>
          <h2 style={{fontFamily:F.display,fontSize:48,fontWeight:400,margin:"12px 0 60px"}}>Jusqu'à <span style={{fontStyle:"italic",color:C.gold}}>50% moins cher</span> qu'une régie</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:2}}>
            {[{role:"Locataire",price:"Gratuit",sub:"pour toujours",icon:Heart,color:C.success,ft:["Matching intelligent","Alertes personnalisées","Signature électronique","État des lieux digital","Résiliation assistée"]},
              {role:"Propriétaire",price:"50%",sub:"du premier loyer",icon:Key,color:C.gold,hl:true,ft:["Publication illimitée","Scoring IA des candidats","Bail automatique conforme","État des lieux digital","Marketplace artisans"]},
              {role:"Artisan",price:"10%",sub:"par intervention",icon:Wrench,color:C.info,ft:["Clients qualifiés","Paiement garanti","Visibilité locale","Gestion des devis","Avis vérifiés"]},
            ].map((p,i)=>(
              <div key={i} style={{background:p.hl?C.bgElevated:C.bgCard,border:`1px solid ${p.hl?C.gold+"40":C.border}`,borderRadius:i===0?"12px 0 0 12px":i===2?"0 12px 12px 0":"0",padding:"48px 36px",position:"relative",display:"flex",flexDirection:"column"}}>
                {p.hl&&<div style={{position:"absolute",top:-1,left:"20%",right:"20%",height:2,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`}}/>}
                <div style={{width:44,height:44,borderRadius:12,background:`${p.color}12`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><p.icon size={20} color={p.color}/></div>
                <div style={{fontFamily:F.mono,fontSize:11,color:p.color,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>{p.role}</div>
                <div style={{fontFamily:F.display,fontSize:p.price==="Gratuit"?40:52,fontWeight:600}}>{p.price}</div>
                <div style={{fontFamily:F.body,fontSize:13,color:C.textMuted,marginBottom:28}}>{p.sub}</div>
                <div style={{display:"flex",flexDirection:"column",gap:10,flex:1}}>{p.ft.map((f,j)=>(<div key={j} style={{display:"flex",alignItems:"center",gap:8,textAlign:"left"}}><Check size={13} color={p.color}/><span style={{fontFamily:F.body,fontSize:13,color:C.textSecondary}}>{f}</span></div>))}</div>
                <Btn v={p.hl?"primary":"secondary"} full onClick={()=>nav("register")} style={{marginTop:28}}>{p.hl?"Commencer":"S'inscrire"}</Btn>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{padding:"60px 48px 100px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <span style={{fontFamily:F.mono,fontSize:11,color:C.gold,letterSpacing:"0.15em",textTransform:"uppercase"}}>Fonctionnalités</span>
          <h2 style={{fontFamily:F.display,fontSize:44,fontWeight:400,margin:"12px 0"}}>Tout est <span style={{fontStyle:"italic",color:C.gold}}>automatisé</span></h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          {[{i:Zap,t:"Matching IA",d:"Score 0-100 sur 6 critères. Radar chart, comparaison instantanée.",c:C.gold},{i:FileText,t:"Bail conforme",d:"Généré pour les 26 cantons. Taux hypothécaire et IPC intégrés.",c:C.success},{i:Camera,t:"État des lieux",d:"Pièce par pièce, photos, signature tactile. Comparaison entrée/sortie.",c:C.info},{i:Shield,t:"Conformité légale",d:"OBLF, formulaire loyer initial, délais cantonaux vérifiés en temps réel.",c:C.purple},{i:DollarSign,t:"Paiements Stripe",d:"Commission prélevée automatiquement. Zéro manipulation.",c:C.gold},{i:Wrench,t:"Artisans intégrés",d:"Plombier, électricien — interventions gérées et payées dans l'app.",c:C.success}].map((f,i)=>(
            <div key={i} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:24,transition:"all 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=f.c+"40";e.currentTarget.style.transform="translateY(-3px)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none"}}>
              <div style={{width:36,height:36,borderRadius:10,background:`${f.c}12`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}><f.i size={18} color={f.c}/></div>
              <div style={{fontFamily:F.body,fontSize:15,fontWeight:600,marginBottom:6}}>{f.t}</div>
              <div style={{fontFamily:F.body,fontSize:13,color:C.textSecondary,lineHeight:1.6}}>{f.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{borderTop:`1px solid ${C.border}`,padding:"32px 48px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center"}}><span style={{fontFamily:F.display,fontSize:20,fontWeight:600}}>immo</span><span style={{fontFamily:F.display,fontSize:20,fontWeight:600,color:C.gold}}>.</span><span style={{fontFamily:F.display,fontSize:20,fontWeight:600}}>cool</span><span style={{fontFamily:F.body,fontSize:12,color:C.textMuted,marginLeft:12}}>© 2026</span></div>
        <div style={{display:"flex",gap:24}}>{["CGV","Confidentialité","Contact"].map(l=>(<span key={l} style={{fontFamily:F.body,fontSize:12,color:C.textMuted,cursor:"pointer"}}>{l}</span>))}</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// TENANT SEARCH PAGE
// ═══════════════════════════════════════════════════════
const TenantSearch = ({nav}) => {
  const [sel,setSel]=useState(null);
  const [fav,setFav]=useState({});
  const [filters,setFilters]=useState({canton:"JU",minRooms:"",maxRent:"",sort:"score"});
  const [applied,setApplied]=useState({});
  const [showApply,setShowApply]=useState(null);
  
  const filtered = PROPERTIES.filter(p=>p.status==="active");
  
  return (
    <div style={{height:"100vh",background:C.bg,color:C.text,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {/* Top bar */}
      <div style={{padding:"14px 32px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.bgCard,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{display:"flex",alignItems:"center",cursor:"pointer"}} onClick={()=>nav("landing")}><span style={{fontFamily:F.display,fontSize:22,fontWeight:600}}>immo</span><span style={{fontFamily:F.display,fontSize:22,fontWeight:600,color:C.gold}}>.</span><span style={{fontFamily:F.display,fontSize:22,fontWeight:600}}>cool</span></div>
          <div style={{width:1,height:24,background:C.border}}/>
          <span style={{fontFamily:F.body,fontSize:13,color:C.textSecondary}}>Recherche d'appartement</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn v="ghost" s="sm" onClick={()=>nav("login")}>Connexion</Btn>
          <Btn s="sm" onClick={()=>nav("register")}>Mon compte</Btn>
        </div>
      </div>
      
      {/* Filters bar */}
      <div style={{padding:"12px 32px",background:C.bgCard,borderBottom:`1px solid ${C.border}`,display:"flex",gap:12,alignItems:"center",flexShrink:0,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px"}}>
          <MapPin size={14} color={C.gold}/>
          <select value={filters.canton} onChange={e=>setFilters({...filters,canton:e.target.value})} style={{background:"none",border:"none",color:C.text,fontFamily:F.body,fontSize:13,outline:"none",cursor:"pointer"}}>{CANTONS.map(c=><option key={c} value={c} style={{background:C.bg}}>{c}</option>)}</select>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px"}}>
          <Bed size={14} color={C.textMuted}/>
          <input type="number" placeholder="Min. pièces" value={filters.minRooms} onChange={e=>setFilters({...filters,minRooms:e.target.value})} style={{background:"none",border:"none",color:C.text,fontFamily:F.body,fontSize:13,outline:"none",width:90}}/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px"}}>
          <DollarSign size={14} color={C.textMuted}/>
          <input type="number" placeholder="Budget max" value={filters.maxRent} onChange={e=>setFilters({...filters,maxRent:e.target.value})} style={{background:"none",border:"none",color:C.text,fontFamily:F.body,fontSize:13,outline:"none",width:90}}/>
          <span style={{fontFamily:F.mono,fontSize:11,color:C.textMuted}}>CHF</span>
        </div>
        <Badge color="gold" s="sm">{filtered.length} résultats</Badge>
      </div>
      
      {/* Main content: list + map/detail */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {/* Property list */}
        <div style={{width:420,borderRight:`1px solid ${C.border}`,overflow:"auto",flexShrink:0}}>
          {filtered.map(p=>(
            <div key={p.id} onClick={()=>setSel(p)} style={{padding:"16px 24px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:sel?.id===p.id?C.bgElevated:"transparent",transition:"background 0.2s"}} onMouseEnter={e=>{if(sel?.id!==p.id)e.currentTarget.style.background=C.bgHover}} onMouseLeave={e=>{if(sel?.id!==p.id)e.currentTarget.style.background="transparent"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontFamily:F.body,fontSize:14,fontWeight:600,color:C.text,marginBottom:4}}>{p.title}</div>
                  <div style={{display:"flex",alignItems:"center",gap:4,fontFamily:F.body,fontSize:12,color:C.textSecondary}}><MapPin size={11}/>{p.addr}, {p.city}</div>
                </div>
                <button onClick={(e)=>{e.stopPropagation();setFav({...fav,[p.id]:!fav[p.id]})}} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
                  <Heart size={18} color={fav[p.id]?C.danger:C.textMuted} fill={fav[p.id]?C.danger:"none"}/>
                </button>
              </div>
              <div style={{display:"flex",gap:12,marginBottom:8}}>
                {[{i:Bed,v:`${p.rooms}p`},{i:Square,v:`${p.area}m²`},{i:Layers,v:`${p.floor}/${p.floors}e`}].map((x,j)=>(
                  <span key={j} style={{display:"flex",alignItems:"center",gap:4,fontFamily:F.mono,fontSize:11,color:C.textMuted}}><x.i size={12}/>{x.v}</span>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><span style={{fontFamily:F.display,fontSize:22,fontWeight:600}}>CHF {p.rent.toLocaleString()}</span><span style={{fontFamily:F.body,fontSize:11,color:C.textMuted}}> /mois</span></div>
                <div style={{display:"flex",gap:6}}>
                  {p.balcony&&<Badge color="gold" s="sm">Balcon</Badge>}
                  {p.parking&&<Badge color="blue" s="sm">Parking</Badge>}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Right panel: map or detail */}
        <div style={{flex:1,overflow:"auto"}}>
          {sel ? (
            <div style={{padding:32}}>
              <button onClick={()=>setSel(null)} style={{display:"flex",alignItems:"center",gap:4,background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontFamily:F.body,fontSize:13,marginBottom:20,padding:0}}>
                <ArrowLeft size={14}/> Retour à la carte
              </button>
              
              {/* Photo placeholder */}
              <div style={{height:220,background:`linear-gradient(135deg,${C.bgElevated},${C.bgHover})`,borderRadius:12,marginBottom:24,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
                <Home size={48} color={C.textMuted}/>
                <div style={{position:"absolute",bottom:12,right:12}}><Badge color="gold" s="sm"><Camera size={10}/> {sel.imgs} photos</Badge></div>
                <div style={{position:"absolute",top:12,right:12}}>
                  <button onClick={()=>setFav({...fav,[sel.id]:!fav[sel.id]})} style={{width:36,height:36,borderRadius:10,background:C.bgOverlay,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Heart size={18} color={fav[sel.id]?C.danger:C.text} fill={fav[sel.id]?C.danger:"none"}/>
                  </button>
                </div>
              </div>
              
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                <div>
                  <h2 style={{fontFamily:F.display,fontSize:28,fontWeight:400,marginBottom:6}}>{sel.title}</h2>
                  <div style={{display:"flex",alignItems:"center",gap:6,fontFamily:F.body,fontSize:13,color:C.textSecondary}}><MapPin size={13}/>{sel.addr}, {sel.city} ({sel.canton})</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:F.display,fontSize:32,fontWeight:600}}>CHF {sel.rent.toLocaleString()}</div>
                  <div style={{fontFamily:F.body,fontSize:12,color:C.textMuted}}>+ CHF {sel.charges} charges/mois</div>
                </div>
              </div>
              
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:24}}>
                {[{l:"Pièces",v:sel.rooms,i:Bed},{l:"Surface",v:`${sel.area}m²`,i:Square},{l:"Étage",v:`${sel.floor}/${sel.floors}`,i:Building2},{l:"Garantie",v:`${sel.deposit} mois`,i:Shield}].map((x,j)=>(
                  <div key={j} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",textAlign:"center"}}>
                    <x.i size={16} color={C.gold} style={{marginBottom:6}}/>
                    <div style={{fontFamily:F.mono,fontSize:16,fontWeight:700,color:C.text}}>{x.v}</div>
                    <div style={{fontFamily:F.body,fontSize:11,color:C.textMuted}}>{x.l}</div>
                  </div>
                ))}
              </div>
              
              <div style={{fontFamily:F.body,fontSize:14,color:C.textSecondary,lineHeight:1.7,marginBottom:20}}>{sel.desc}</div>
              
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:24}}>
                {sel.features.map((f,j)=><Badge key={j} color="gold" s="sm">{f}</Badge>)}
                {sel.balcony&&<Badge color="blue" s="sm">Balcon</Badge>}
                {sel.parking&&<Badge color="blue" s="sm">Parking</Badge>}
                {sel.cellar&&<Badge color="purple" s="sm">Cave</Badge>}
                {sel.laundry&&<Badge color="purple" s="sm">Buanderie</Badge>}
              </div>
              
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:24,fontFamily:F.body,fontSize:12,color:C.textMuted}}>
                <Calendar size={13}/> Disponible dès le {new Date(sel.avail).toLocaleDateString("fr-CH")}
              </div>
              
              {/* Apply or already applied */}
              {applied[sel.id] ? (
                <div style={{background:C.successBg,border:`1px solid ${C.success}30`,borderRadius:12,padding:20,display:"flex",alignItems:"center",gap:12}}>
                  <CheckCircle2 size={24} color={C.success}/>
                  <div>
                    <div style={{fontFamily:F.body,fontSize:14,fontWeight:600,color:C.success}}>Candidature envoyée !</div>
                    <div style={{fontFamily:F.body,fontSize:12,color:C.textSecondary}}>Le propriétaire recevra votre dossier. Score de matching calculé automatiquement.</div>
                  </div>
                </div>
              ) : showApply===sel.id ? (
                <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:24}}>
                  <div style={{fontFamily:F.body,fontSize:14,fontWeight:600,marginBottom:16}}>Confirmer votre candidature</div>
                  <Inp label="Message au propriétaire (optionnel)" value="" onChange={()=>{}} ph="Présentez-vous brièvement..." area icon={MessageSquare}/>
                  <div style={{display:"flex",gap:8,marginTop:16}}>
                    <Btn icon={Send} onClick={()=>{setApplied({...applied,[sel.id]:true});setShowApply(null)}}>Envoyer ma candidature</Btn>
                    <Btn v="ghost" onClick={()=>setShowApply(null)}>Annuler</Btn>
                  </div>
                  <div style={{fontFamily:F.body,fontSize:11,color:C.textMuted,marginTop:12}}><Shield size={11}/> 100% gratuit — aucun frais pour les locataires</div>
                </div>
              ) : (
                <div style={{display:"flex",gap:8}}>
                  <Btn icon={Send} s="lg" onClick={()=>setShowApply(sel.id)}>Postuler gratuitement</Btn>
                  <Btn v="secondary" s="lg" icon={Calendar}>Demander une visite</Btn>
                </div>
              )}
            </div>
          ) : (
            <PropertyMap properties={filtered} selected={sel} onSelect={setSel}/>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// AUTH PAGE
// ═══════════════════════════════════════════════════════
const Auth = ({mode,nav}) => {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [role,setRole]=useState("LANDLORD"); const [fn,setFn]=useState(""); const [ln,setLn]=useState("");
  const reg=mode==="register";
  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"48px 64px",maxWidth:520}}>
        <button onClick={()=>nav("landing")} style={{display:"flex",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",marginBottom:40}}><span style={{fontFamily:F.display,fontSize:24,fontWeight:600,color:C.text}}>immo</span><span style={{fontFamily:F.display,fontSize:24,fontWeight:600,color:C.gold}}>.</span><span style={{fontFamily:F.display,fontSize:24,fontWeight:600,color:C.text}}>cool</span></button>
        <h2 style={{fontFamily:F.display,fontSize:34,fontWeight:400,marginBottom:6}}>{reg?"Créer un":"Accédez à votre"} <span style={{fontStyle:"italic",color:C.gold}}>compte</span></h2>
        <p style={{fontFamily:F.body,fontSize:14,color:C.textMuted,marginBottom:32}}>{reg?"Commencez gratuitement.":"Heureux de vous revoir."}</p>
        {reg&&<div style={{marginBottom:20}}>
          <label style={{fontFamily:F.body,fontSize:12,color:C.textSecondary,fontWeight:500,marginBottom:8,display:"block"}}>Je suis</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {[{v:"LANDLORD",l:"Propriétaire",i:Key},{v:"TENANT",l:"Locataire",i:Search},{v:"ARTISAN",l:"Artisan",i:Wrench}].map(r=>(
              <button key={r.v} onClick={()=>setRole(r.v)} style={{padding:12,background:role===r.v?C.goldBg:C.bgElevated,border:`1px solid ${role===r.v?C.gold+"50":C.border}`,borderRadius:10,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,color:role===r.v?C.gold:C.textSecondary,transition:"all 0.2s"}}><r.i size={18}/><span style={{fontFamily:F.body,fontSize:12,fontWeight:role===r.v?600:400}}>{r.l}</span>{r.v==="TENANT"&&<span style={{fontFamily:F.mono,fontSize:9,color:C.success}}>GRATUIT</span>}</button>
            ))}
          </div>
        </div>}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {reg&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><Inp label="Prénom" value={fn} onChange={setFn} ph="Olivier"/><Inp label="Nom" value={ln} onChange={setLn} ph="Botteron"/></div>}
          <Inp label="Email" value={email} onChange={setEmail} type="email" ph="olivier@example.ch" icon={Mail}/>
          <Inp label="Mot de passe" value={pass} onChange={setPass} type="password" ph="Min. 8 caractères" icon={Lock}/>
          <Btn full s="lg" onClick={()=>nav(role==="TENANT"?"tenant-search":"dashboard")} icon={ArrowRight}>{reg?"Créer mon compte":"Se connecter"}</Btn>
          <div style={{textAlign:"center",marginTop:4}}><span style={{fontFamily:F.body,fontSize:13,color:C.textMuted}}>{reg?"Déjà un compte ? ":"Pas de compte ? "}</span><span onClick={()=>nav(reg?"login":"register")} style={{fontFamily:F.body,fontSize:13,color:C.gold,cursor:"pointer",fontWeight:600}}>{reg?"Connexion":"S'inscrire"}</span></div>
        </div>
      </div>
      <div style={{flex:1,background:`linear-gradient(135deg,${C.bgCard},${C.bgElevated})`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"20%",right:"10%",width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${C.gold}08,transparent)`,pointerEvents:"none"}}/>
        <div style={{textAlign:"center",maxWidth:360,zIndex:2}}>
          <div style={{fontFamily:F.display,fontSize:72,fontWeight:300,color:C.gold,lineHeight:1,marginBottom:20}}>50%</div>
          <div style={{fontFamily:F.body,fontSize:18,marginBottom:6}}>moins cher qu'une régie</div>
          <div style={{fontFamily:F.body,fontSize:14,color:C.textMuted,lineHeight:1.7}}>Bail conforme, matching IA, état des lieux digital — 26 cantons suisses.</div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// DASHBOARD LAYOUT
// ═══════════════════════════════════════════════════════
const Dash = ({nav,sub,setSub}) => {
  const [collapsed,setCollapsed]=useState(false);
  const [notifOpen,setNotifOpen]=useState(false);
  const menu=[{id:"overview",i:BarChart3,l:"Tableau de bord"},{id:"properties",i:Building2,l:"Mes biens"},{id:"tenants",i:Users,l:"Candidatures"},{id:"leases",i:FileText,l:"Baux"},{id:"edl",i:Camera,l:"État des lieux"},{id:"messages",i:MessageSquare,l:"Messages",badge:1},{id:"artisans",i:Wrench,l:"Artisans"},{id:"settings",i:Settings,l:"Paramètres"}];
  
  return (
    <div style={{display:"flex",height:"100vh",background:C.bg,color:C.text,overflow:"hidden"}}>
      {/* Sidebar */}
      <div style={{width:collapsed?68:220,background:C.bgCard,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",transition:"width 0.3s",flexShrink:0,overflow:"hidden"}}>
        <div style={{padding:"16px 12px",display:"flex",alignItems:"center",justifyContent:collapsed?"center":"space-between",borderBottom:`1px solid ${C.border}`}}>
          {!collapsed&&<div style={{display:"flex",alignItems:"center"}}><span style={{fontFamily:F.display,fontSize:20,fontWeight:600}}>immo</span><span style={{fontFamily:F.display,fontSize:20,fontWeight:600,color:C.gold}}>.</span><span style={{fontFamily:F.display,fontSize:20,fontWeight:600}}>cool</span></div>}
          <button onClick={()=>setCollapsed(!collapsed)} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",padding:4}}><Menu size={16}/></button>
        </div>
        <div style={{flex:1,padding:"10px 6px",display:"flex",flexDirection:"column",gap:1}}>
          {menu.map(m=>(
            <button key={m.id} onClick={()=>setSub(m.id)} style={{display:"flex",alignItems:"center",gap:10,padding:collapsed?"9px":"9px 10px",background:sub===m.id?C.goldBg:"transparent",border:"none",borderRadius:7,cursor:"pointer",color:sub===m.id?C.gold:C.textSecondary,transition:"all 0.2s",width:"100%",justifyContent:collapsed?"center":"flex-start",position:"relative"}} onMouseEnter={e=>{if(sub!==m.id)e.currentTarget.style.background=C.bgHover}} onMouseLeave={e=>{if(sub!==m.id)e.currentTarget.style.background="transparent"}}>
              <m.i size={17}/>
              {!collapsed&&<span style={{fontFamily:F.body,fontSize:13,fontWeight:sub===m.id?600:400,whiteSpace:"nowrap"}}>{m.l}</span>}
              {m.badge&&!collapsed&&<span style={{marginLeft:"auto",background:C.danger,color:C.text,width:18,height:18,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,fontSize:10,fontWeight:700}}>{m.badge}</span>}
            </button>
          ))}
        </div>
        <div style={{padding:"10px 6px",borderTop:`1px solid ${C.border}`}}>
          <button onClick={()=>nav("landing")} style={{display:"flex",alignItems:"center",gap:10,padding:collapsed?"9px":"9px 10px",background:"none",border:"none",borderRadius:7,cursor:"pointer",color:C.textMuted,width:"100%",justifyContent:collapsed?"center":"flex-start"}}><LogOut size={17}/>{!collapsed&&<span style={{fontFamily:F.body,fontSize:13}}>Déconnexion</span>}</button>
        </div>
      </div>
      
      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"14px 28px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.bgCard,flexShrink:0}}>
          <div>
            <div style={{fontFamily:F.display,fontSize:20,fontWeight:600}}>{menu.find(m=>m.id===sub)?.l}</div>
            <div style={{fontFamily:F.body,fontSize:11,color:C.textMuted,marginTop:1}}>{new Date().toLocaleDateString("fr-CH",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{position:"relative"}}>
              <button onClick={()=>setNotifOpen(!notifOpen)} style={{background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:8,padding:7,cursor:"pointer",color:C.textSecondary,position:"relative"}}><Bell size={17}/><div style={{position:"absolute",top:3,right:3,width:7,height:7,borderRadius:"50%",background:C.danger}}/></button>
              <NotifPanel open={notifOpen} onClose={()=>setNotifOpen(false)} notifs={NOTIFS}/>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${C.gold}25,${C.purple}25)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,fontSize:12,fontWeight:600,color:C.gold}}>OB</div>
              <div><div style={{fontFamily:F.body,fontSize:12,fontWeight:500}}>Olivier B.</div><div style={{fontFamily:F.body,fontSize:10,color:C.textMuted}}>Propriétaire</div></div>
            </div>
          </div>
        </div>
        <div style={{flex:1,overflow:"auto",padding:28}} onClick={()=>notifOpen&&setNotifOpen(false)}>
          {sub==="overview"&&<Overview setSub={setSub}/>}
          {sub==="properties"&&<Props/>}
          {sub==="tenants"&&<Tenants/>}
          {sub==="leases"&&<Leases/>}
          {sub==="edl"&&<EDL/>}
          {sub==="messages"&&<Msgs/>}
          {sub==="artisans"&&<Placeholder i={Wrench} t="Marketplace artisans" d="Plombiers, électriciens, peintres — bientôt disponible"/>}
          {sub==="settings"&&<Sett/>}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// DASHBOARD > OVERVIEW
// ═══════════════════════════════════════════════════════
const Overview = ({setSub}) => (
  <div style={{display:"flex",flexDirection:"column",gap:20}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:14}}>
      <Stat label="Biens actifs" value="3" sub="publiés" icon={Building2} color="gold"/>
      <Stat label="Candidatures" value="31" sub="ce mois" icon={Users} trend={27} color="blue"/>
      <Stat label="Revenus" value="CHF 4'030" sub="commissions" icon={TrendingUp} trend={9} color="green"/>
      <Stat label="Matching" value="87%" sub="candidats qualifiés" icon={Sparkles} color="purple"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
      <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
        <div style={{fontFamily:F.body,fontSize:13,fontWeight:600,marginBottom:16}}>Performance 6 mois</div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={STATS}><defs><linearGradient id="gV" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.gold} stopOpacity={0.3}/><stop offset="100%" stopColor={C.gold} stopOpacity={0}/></linearGradient></defs><XAxis dataKey="m" tick={{fontSize:10,fill:C.textMuted,fontFamily:F.mono}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:C.textMuted,fontFamily:F.mono}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:8,fontFamily:F.body,fontSize:12}}/><Area type="monotone" dataKey="views" stroke={C.gold} fill="url(#gV)" strokeWidth={2}/><Area type="monotone" dataKey="apps" stroke={C.success} fill="none" strokeWidth={2}/></AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
        <div style={{fontFamily:F.body,fontSize:13,fontWeight:600,marginBottom:14}}>Conformité légale</div>
        {[{l:"Taux hypothécaire",v:"1.25%",ok:true},{l:"IPC (base déc. 2025)",v:"107.1",ok:true},{l:"Formulaire loyer initial",v:"JU — OK",ok:true},{l:"Prochain délai résiliation",v:"30.06.2026",ok:false}].map((r,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<3?`1px solid ${C.border}08`:"none"}}>
            <div><div style={{fontFamily:F.body,fontSize:11,color:C.textMuted}}>{r.l}</div><div style={{fontFamily:F.mono,fontSize:13,fontWeight:600,marginTop:1}}>{r.v}</div></div>
            {r.ok?<CheckCircle2 size={14} color={C.success}/>:<AlertTriangle size={14} color={C.gold}/>}
          </div>
        ))}
      </div>
    </div>
    <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><span style={{fontFamily:F.body,fontSize:13,fontWeight:600}}>Activité récente</span><Btn v="ghost" s="sm">Voir tout</Btn></div>
      {[{t:"Il y a 2h",txt:"Sophie Müller a candidaté pour 3.5 pièces Delémont — Score 94/100",tp:"match",i:Sparkles},{t:"Il y a 5h",txt:"Thomas Weber a candidaté — Score 76/100",tp:"app",i:Users},{t:"Hier",txt:"Bail signé: Marc Dubois — 2.5 pièces Porrentruy (JU-2026-0047)",tp:"lease",i:FileText},{t:"22.02",txt:"Commission reçue: CHF 490 via Stripe",tp:"pay",i:DollarSign}].map((a,i)=>{const col={match:C.purple,app:C.info,lease:C.success,pay:C.gold}[a.tp];return(
        <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<3?`1px solid ${C.border}08`:"none"}}>
          <div style={{width:32,height:32,borderRadius:8,background:`${col}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><a.i size={15} color={col}/></div>
          <div style={{flex:1,fontFamily:F.body,fontSize:12,color:C.text}}>{a.txt}</div>
          <span style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,flexShrink:0}}>{a.t}</span>
        </div>
      );})}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════
// DASHBOARD > PROPERTIES
// ═══════════════════════════════════════════════════════
const Props = () => (
  <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <span style={{fontFamily:F.body,fontSize:13,color:C.textMuted}}>{PROPERTIES.length} biens</span>
      <Btn icon={Plus}>Ajouter un bien</Btn>
    </div>
    {PROPERTIES.map(p=>(
      <div key={p.id} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:10,display:"flex",gap:16,alignItems:"center",cursor:"pointer",transition:"border-color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold+"40"} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
        <div style={{width:90,height:70,borderRadius:8,background:C.bgElevated,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Home size={24} color={C.textMuted}/></div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontFamily:F.body,fontSize:14,fontWeight:600}}>{p.title}</span><Badge color={p.status==="active"?"green":"gold"}>{p.status==="active"?"Actif":"Brouillon"}</Badge></div>
          <div style={{display:"flex",gap:14,fontFamily:F.body,fontSize:12,color:C.textSecondary}}><span style={{display:"flex",alignItems:"center",gap:3}}><MapPin size={11}/>{p.city}</span><span style={{display:"flex",alignItems:"center",gap:3}}><Bed size={11}/>{p.rooms}p</span><span style={{display:"flex",alignItems:"center",gap:3}}><Square size={11}/>{p.area}m²</span></div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}><div style={{fontFamily:F.display,fontSize:22,fontWeight:600}}>CHF {p.rent.toLocaleString()}</div><div style={{fontFamily:F.body,fontSize:11,color:C.textMuted}}>+{p.charges} charges</div></div>
        <div style={{display:"flex",gap:16,flexShrink:0,paddingLeft:16,borderLeft:`1px solid ${C.border}`}}>
          <div style={{textAlign:"center"}}><div style={{fontFamily:F.mono,fontSize:16,fontWeight:700,color:C.info}}>{p.apps}</div><div style={{fontFamily:F.body,fontSize:10,color:C.textMuted}}>candidatures</div></div>
          <div style={{textAlign:"center"}}><div style={{fontFamily:F.mono,fontSize:16,fontWeight:700,color:C.textSecondary}}>{p.views}</div><div style={{fontFamily:F.body,fontSize:10,color:C.textMuted}}>vues</div></div>
        </div>
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════
// DASHBOARD > TENANTS (MATCHING)
// ═══════════════════════════════════════════════════════
const Tenants = () => {
  const [sel,setSel]=useState(null);
  const rd = sel?[{axis:"Budget",value:sel.match.budget,max:30},{axis:"Localisation",value:sel.match.location,max:25},{axis:"Pièces",value:sel.match.rooms,max:15},{axis:"Timing",value:sel.match.timing,max:10},{axis:"Fiabilité",value:sel.match.reliability,max:15},{axis:"Vérifié",value:sel.match.verified,max:5}]:[];
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,height:"calc(100vh - 130px)"}}>
      <div style={{overflow:"auto",display:"flex",flexDirection:"column",gap:10}}>
        <span style={{fontFamily:F.body,fontSize:13,color:C.textMuted,marginBottom:4}}>{TENANTS.length} candidats</span>
        {TENANTS.map(t=>(
          <div key={t.id} onClick={()=>setSel(t)} style={{background:sel?.id===t.id?C.bgElevated:C.bgCard,border:`1px solid ${sel?.id===t.id?C.gold+"40":C.border}`,borderRadius:12,padding:14,cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"all 0.2s"}}>
            <Ring score={t.score} size={48}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontFamily:F.body,fontSize:13,fontWeight:600}}>{t.name}</span>{t.verified&&<Badge color="green" s="sm"><Check size={9}/> Vérifié</Badge>}</div>
              <div style={{fontFamily:F.body,fontSize:12,color:C.textSecondary,marginTop:3}}>{t.job} — {t.city} ({t.canton})</div>
              <div style={{display:"flex",gap:10,marginTop:4}}>{[`CHF ${t.budget}`,`${t.rooms}p`,t.permit].map((x,j)=><span key={j} style={{fontFamily:F.mono,fontSize:10,color:C.textMuted}}>{x}</span>)}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:24,overflow:"auto"}}>
        {sel?(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
              <div style={{width:56,height:56,borderRadius:14,background:`linear-gradient(135deg,${C.gold}25,${C.purple}25)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.display,fontSize:22,fontWeight:600,color:C.gold}}>{sel.av}</div>
              <div style={{flex:1}}><div style={{fontFamily:F.display,fontSize:22,fontWeight:400}}>{sel.name}</div><div style={{fontFamily:F.body,fontSize:13,color:C.textSecondary}}>{sel.job}</div></div>
              <Ring score={sel.score} size={64} sw={4}/>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={rd}><PolarGrid stroke={C.border}/><PolarAngleAxis dataKey="axis" tick={{fontSize:10,fill:C.textSecondary,fontFamily:F.body}}/><PolarRadiusAxis tick={false} axisLine={false}/><Radar dataKey="value" stroke={C.gold} fill={C.gold} fillOpacity={0.15} strokeWidth={2}/><Radar dataKey="max" stroke={C.border} fill="none" strokeWidth={1} strokeDasharray="4 4"/></RadarChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexDirection:"column",gap:6,margin:"16px 0"}}>
              {[{l:"Budget",s:sel.match.budget,m:30},{l:"Localisation",s:sel.match.location,m:25},{l:"Pièces",s:sel.match.rooms,m:15},{l:"Timing",s:sel.match.timing,m:10},{l:"Fiabilité",s:sel.match.reliability,m:15},{l:"Vérifié",s:sel.match.verified,m:5}].map((x,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontFamily:F.body,fontSize:11,color:C.textSecondary,width:70}}>{x.l}</span>
                  <div style={{flex:1,height:5,background:C.border,borderRadius:3,overflow:"hidden"}}><div style={{width:`${x.s/x.m*100}%`,height:"100%",background:x.s/x.m>=0.8?C.success:x.s/x.m>=0.5?C.gold:C.danger,borderRadius:3,transition:"width 0.8s"}}/></div>
                  <span style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,width:32,textAlign:"right"}}>{x.s}/{x.m}</span>
                </div>
              ))}
            </div>
            {/* Tenant message */}
            <div style={{background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:8,padding:14,marginBottom:16}}>
              <div style={{fontFamily:F.body,fontSize:11,color:C.textMuted,marginBottom:6}}>Message du candidat</div>
              <div style={{fontFamily:F.body,fontSize:13,color:C.textSecondary,fontStyle:"italic",lineHeight:1.5}}>"{sel.msg}"</div>
            </div>
            <div style={{display:"flex",gap:8}}><Btn icon={Check} full>Accepter</Btn><Btn v="secondary" icon={MessageSquare}>Contacter</Btn><Btn v="danger" icon={X}>Refuser</Btn></div>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:12}}><Users size={40} color={C.textMuted}/><span style={{fontFamily:F.body,fontSize:13,color:C.textMuted}}>Sélectionnez un candidat</span></div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// DASHBOARD > LEASES
// ═══════════════════════════════════════════════════════
const Leases = () => (
  <div>
    {[{ref:"JU-2026-0047",tenant:"Marc Dubois",prop:"2.5 pièces, Porrentruy",start:"15.03.2026",rent:"CHF 980",st:"active",signed:true},{ref:"JU-2026-0052",tenant:"Sophie Müller",prop:"3.5 pièces, Delémont",start:"01.04.2026",rent:"CHF 1'350",st:"pending",signed:false}].map((l,i)=>(
      <div key={i} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontFamily:F.mono,fontSize:12,color:C.gold}}>{l.ref}</span><Badge color={l.st==="active"?"green":"gold"}>{l.st==="active"?"Actif":"En attente"}</Badge></div>
            <div style={{fontFamily:F.body,fontSize:14,fontWeight:600}}>{l.prop}</div>
            <div style={{fontFamily:F.body,fontSize:12,color:C.textSecondary,marginTop:3}}>Locataire: {l.tenant} — Début: {l.start}</div>
          </div>
          <div style={{textAlign:"right"}}><div style={{fontFamily:F.display,fontSize:20,fontWeight:600}}>{l.rent}</div><div style={{fontFamily:F.body,fontSize:10,color:C.textMuted}}>loyer net</div></div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <Btn v="secondary" s="sm" icon={FileText}>Voir le bail</Btn>
          <Btn v="ghost" s="sm" icon={Download}>PDF</Btn>
          {!l.signed&&<Btn s="sm" icon={Pen}>Signer</Btn>}
        </div>
      </div>
    ))}
    <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginTop:16}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14}}><Shield size={15} color={C.gold}/><span style={{fontFamily:F.body,fontSize:13,fontWeight:600}}>Références légales</span></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {[{l:"Taux hypothécaire",v:"1.25%",s:"OFL — trimestriel"},{l:"IPC",v:"107.1 pts",s:"OFS — mensuel"},{l:"OBLF",v:"Art. 12-13, 16, 19",s:"Conformité auto"}].map((r,i)=>(
          <div key={i} style={{padding:14,background:C.bgElevated,borderRadius:8,border:`1px solid ${C.border}`}}>
            <div style={{fontFamily:F.body,fontSize:10,color:C.textMuted}}>{r.l}</div>
            <div style={{fontFamily:F.mono,fontSize:16,fontWeight:700,margin:"3px 0"}}>{r.v}</div>
            <div style={{fontFamily:F.body,fontSize:10,color:C.textMuted}}>{r.s}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════
// DASHBOARD > ÉTAT DES LIEUX with comparison
// ═══════════════════════════════════════════════════════
const EDL = () => {
  const [room,setRoom]=useState(0);
  const [items,setItems]=useState({});
  const [showSign,setShowSign]=useState(false);
  const [signed,setSigned]=useState(false);
  const [mode,setMode]=useState("entry"); // entry | exit | compare
  const ratings=["Neuf","Bon","Usé","Endommagé"];
  const rColors=[C.success,"#6EE7B7",C.gold,C.danger];
  
  // Mock entry data for comparison
  const entryData = {"0-0":{"rating":0},"0-1":{"rating":0},"0-2":{"rating":1},"0-3":{"rating":0},"0-4":{"rating":0},"0-5":{"rating":1},"0-6":{"rating":0},"0-7":{"rating":1},"1-0":{"rating":1},"1-1":{"rating":0},"1-2":{"rating":0},"1-3":{"rating":1},"1-4":{"rating":1},"1-5":{"rating":0},"1-6":{"rating":1},"1-7":{"rating":0}};
  
  const setItem=(ri,ii,f,v)=>{const k=`${ri}-${ii}`;setItems(p=>({...p,[k]:{...(p[k]||{}),[f]:v}}))};
  const getItem=(ri,ii)=>items[`${ri}-${ii}`]||{};
  const done=Object.keys(items).filter(k=>items[k].rating!=null).length;
  const total=ROOMS_EDL.reduce((a,r)=>a+r.items.length,0);
  
  if(showSign) return (
    <div style={{maxWidth:560}}>
      <Btn v="ghost" s="sm" icon={ArrowLeft} onClick={()=>setShowSign(false)}>Retour</Btn>
      <h3 style={{fontFamily:F.display,fontSize:28,fontWeight:400,margin:"20px 0 8px"}}>Signature de l'état des lieux</h3>
      <p style={{fontFamily:F.body,fontSize:13,color:C.textMuted,marginBottom:24}}>{done}/{total} éléments inspectés — {mode==="entry"?"Entrée":"Sortie"}</p>
      <div style={{marginBottom:16}}><div style={{fontFamily:F.body,fontSize:12,color:C.textSecondary,marginBottom:8}}>Signature du propriétaire</div><SignaturePad onSave={()=>setSigned(true)} onCancel={()=>setShowSign(false)}/></div>
      {signed && <div style={{background:C.successBg,border:`1px solid ${C.success}30`,borderRadius:12,padding:16,display:"flex",alignItems:"center",gap:12,marginTop:16}}><CheckCircle2 size={20} color={C.success}/><div><div style={{fontFamily:F.body,fontSize:14,fontWeight:600,color:C.success}}>État des lieux signé avec succès</div><div style={{fontFamily:F.body,fontSize:12,color:C.textSecondary}}>Document PDF généré et envoyé aux deux parties.</div></div></div>}
    </div>
  );
  
  return (
    <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:20,height:"calc(100vh - 130px)"}}>
      <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:14,display:"flex",flexDirection:"column",overflow:"auto"}}>
        {/* Mode toggle */}
        <div style={{display:"flex",gap:2,marginBottom:12,background:C.bgElevated,borderRadius:8,padding:2}}>
          {[{id:"entry",l:"Entrée"},{id:"exit",l:"Sortie"},{id:"compare",l:"Comparer"}].map(m=>(
            <button key={m.id} onClick={()=>setMode(m.id)} style={{flex:1,padding:"7px 0",borderRadius:6,border:"none",cursor:"pointer",background:mode===m.id?C.goldBg:"transparent",color:mode===m.id?C.gold:C.textMuted,fontFamily:F.body,fontSize:11,fontWeight:mode===m.id?600:400,transition:"all 0.2s"}}>{m.l}</button>
          ))}
        </div>
        <div style={{fontFamily:F.body,fontSize:11,color:C.textMuted,marginBottom:8,padding:"0 6px"}}>{done}/{total}</div>
        <div style={{height:3,background:C.border,borderRadius:2,marginBottom:10,overflow:"hidden"}}><div style={{width:`${total?done/total*100:0}%`,height:"100%",background:C.gold,borderRadius:2,transition:"width 0.3s"}}/></div>
        {ROOMS_EDL.map((r,i)=>{const rc=r.items.filter((_,j)=>items[`${i}-${j}`]?.rating!=null).length;return(
          <button key={i} onClick={()=>setRoom(i)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",background:room===i?C.goldBg:"transparent",border:"none",borderRadius:7,cursor:"pointer",color:room===i?C.gold:C.textSecondary,transition:"all 0.2s"}}>
            <span style={{fontFamily:F.body,fontSize:12,fontWeight:room===i?600:400}}>{r.name}</span>
            <span style={{fontFamily:F.mono,fontSize:10,color:rc===r.items.length?C.success:C.textMuted}}>{rc}/{r.items.length}</span>
          </button>
        );})}
        <div style={{marginTop:"auto",paddingTop:10,borderTop:`1px solid ${C.border}`}}>
          <Btn full icon={Pen} v={done===total?"primary":"secondary"} onClick={()=>setShowSign(true)}>Signer</Btn>
        </div>
      </div>
      
      <div style={{overflow:"auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <h3 style={{fontFamily:F.display,fontSize:26,fontWeight:400}}>{ROOMS_EDL[room].name}</h3>
          <Badge color={mode==="compare"?"purple":mode==="exit"?"blue":"gold"}>{mode==="compare"?"Comparaison":mode==="exit"?"Sortie":"Entrée"}</Badge>
        </div>
        
        {mode==="compare" ? (
          /* COMPARISON VIEW */
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8,padding:"0 14px",marginBottom:6}}>
              <span style={{fontFamily:F.body,fontSize:11,color:C.textMuted}}>Élément</span>
              <span style={{fontFamily:F.body,fontSize:11,color:C.textMuted,textAlign:"center"}}>Entrée</span>
              <span style={{fontFamily:F.body,fontSize:11,color:C.textMuted,textAlign:"center"}}>Sortie</span>
              <span style={{fontFamily:F.body,fontSize:11,color:C.textMuted,textAlign:"center"}}>Différence</span>
            </div>
            {ROOMS_EDL[room].items.map((item,j)=>{
              const entryR=entryData[`${room}-${j}`]?.rating;
              const exitR=getItem(room,j).rating;
              const diff=entryR!=null&&exitR!=null?exitR-entryR:null;
              return (
                <div key={j} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8,alignItems:"center",padding:"10px 14px",background:diff!=null&&diff>0?C.dangerBg:C.bgCard,border:`1px solid ${diff!=null&&diff>0?C.danger+"30":C.border}`,borderRadius:8}}>
                  <span style={{fontFamily:F.body,fontSize:13,color:C.text}}>{item}</span>
                  <div style={{textAlign:"center"}}>{entryR!=null&&<Badge color={entryR===0?"green":entryR===1?"gold":entryR===2?"gold":"red"} s="sm">{ratings[entryR]}</Badge>}</div>
                  <div style={{textAlign:"center"}}>{exitR!=null?<Badge color={exitR===0?"green":exitR===1?"gold":exitR===2?"gold":"red"} s="sm">{ratings[exitR]}</Badge>:<span style={{fontFamily:F.body,fontSize:11,color:C.textMuted}}>—</span>}</div>
                  <div style={{textAlign:"center"}}>{diff!=null?(diff===0?<CheckCircle2 size={16} color={C.success}/>:diff>0?<AlertTriangle size={16} color={C.danger}/>:<TrendingUp size={16} color={C.success}/>):<span style={{fontFamily:F.body,fontSize:11,color:C.textMuted}}>—</span>}</div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ENTRY/EXIT VIEW */
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {ROOMS_EDL[room].items.map((item,j)=>{
              const st=getItem(room,j);
              return (
                <div key={j} style={{background:C.bgCard,border:`1px solid ${st.rating!=null?C.gold+"25":C.border}`,borderRadius:8,padding:14,transition:"all 0.2s"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:st.rating!=null?10:0}}>
                    <span style={{fontFamily:F.body,fontSize:13,fontWeight:500}}>{item}</span>
                    <div style={{display:"flex",gap:4}}>
                      {ratings.map((r,k)=>(<button key={k} onClick={()=>setItem(room,j,"rating",k)} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${st.rating===k?rColors[k]+"60":C.border}`,background:st.rating===k?`${rColors[k]}15`:"transparent",color:st.rating===k?rColors[k]:C.textMuted,cursor:"pointer",fontFamily:F.body,fontSize:11,fontWeight:st.rating===k?600:400,transition:"all 0.2s"}}>{r}</button>))}
                    </div>
                  </div>
                  {st.rating!=null&&(
                    <div style={{display:"flex",gap:10}}>
                      <input placeholder="Remarques..." value={st.note||""} onChange={e=>setItem(room,j,"note",e.target.value)} style={{flex:1,background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:6,padding:"7px 10px",fontFamily:F.body,fontSize:12,color:C.text,outline:"none"}} onFocus={e=>e.target.style.borderColor=C.borderFocus} onBlur={e=>e.target.style.borderColor=C.border}/>
                      <button style={{display:"flex",alignItems:"center",gap:4,padding:"7px 12px",background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",color:C.textMuted,fontFamily:F.body,fontSize:11}}><Camera size={13}/> Photo</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// DASHBOARD > MESSAGES
// ═══════════════════════════════════════════════════════
const Msgs = () => {
  const [sel,setSel]=useState(null);
  const [msg,setMsg]=useState("");
  return (
    <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:0,height:"calc(100vh - 130px)",border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
      {/* Thread list */}
      <div style={{borderRight:`1px solid ${C.border}`,background:C.bgCard,overflow:"auto"}}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,fontFamily:F.body,fontSize:14,fontWeight:600}}>Messages</div>
        {MESSAGES_DATA.map(m=>(
          <div key={m.id} onClick={()=>setSel(m)} style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}08`,cursor:"pointer",background:sel?.id===m.id?C.bgElevated:m.unread?C.goldBg:"transparent",transition:"background 0.15s"}} onMouseEnter={e=>{if(sel?.id!==m.id)e.currentTarget.style.background=C.bgHover}} onMouseLeave={e=>{if(sel?.id!==m.id)e.currentTarget.style.background=m.unread?C.goldBg:"transparent"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.gold}20,${C.purple}20)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,fontSize:12,fontWeight:600,color:C.gold,flexShrink:0}}>{m.av}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:F.body,fontSize:13,fontWeight:m.unread?600:400}}>{m.from}</span>
                  <span style={{fontFamily:F.mono,fontSize:10,color:C.textMuted}}>{m.time}</span>
                </div>
                <div style={{fontFamily:F.body,fontSize:12,color:C.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:2}}>{m.preview}</div>
              </div>
              {m.unread&&<div style={{width:7,height:7,borderRadius:"50%",background:C.gold,flexShrink:0}}/>}
            </div>
          </div>
        ))}
      </div>
      
      {/* Chat */}
      <div style={{display:"flex",flexDirection:"column",background:C.bg}}>
        {sel?(
          <>
            <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10,background:C.bgCard}}>
              <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${C.gold}20,${C.purple}20)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,fontSize:11,fontWeight:600,color:C.gold}}>{sel.av}</div>
              <div style={{fontFamily:F.body,fontSize:14,fontWeight:600}}>{sel.from}</div>
            </div>
            <div style={{flex:1,overflow:"auto",padding:20,display:"flex",flexDirection:"column",gap:12}}>
              {sel.thread.map((t,i)=>(
                <div key={i} style={{display:"flex",justifyContent:t.mine?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"75%",background:t.mine?C.goldBg2:C.bgCard,border:`1px solid ${t.mine?C.gold+"30":C.border}`,borderRadius:12,padding:"10px 14px"}}>
                    <div style={{fontFamily:F.body,fontSize:13,color:C.text,lineHeight:1.5}}>{t.text}</div>
                    <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,marginTop:6,textAlign:t.mine?"right":"left"}}>{t.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:"12px 20px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8,background:C.bgCard}}>
              <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Écrire un message..." style={{flex:1,background:C.bgElevated,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontFamily:F.body,fontSize:13,color:C.text,outline:"none"}} onKeyDown={e=>{if(e.key==="Enter"&&msg.trim())setMsg("")}} onFocus={e=>e.target.style.borderColor=C.borderFocus} onBlur={e=>e.target.style.borderColor=C.border}/>
              <Btn icon={Send} disabled={!msg.trim()} onClick={()=>setMsg("")}>Envoyer</Btn>
            </div>
          </>
        ):(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:12}}><MessageSquare size={40} color={C.textMuted}/><span style={{fontFamily:F.body,fontSize:13,color:C.textMuted}}>Sélectionnez une conversation</span></div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════
const Sett = () => (
  <div style={{maxWidth:540,display:"flex",flexDirection:"column",gap:18}}>
    <h3 style={{fontFamily:F.display,fontSize:26,fontWeight:400}}>Paramètres</h3>
    <Inp label="Nom complet" value="Olivier Botteron" onChange={()=>{}}/>
    <Inp label="Email" value="olivier@immo.cool" onChange={()=>{}} icon={Mail}/>
    <Inp label="Téléphone" value="+41 79 XXX XX XX" onChange={()=>{}} icon={Phone}/>
    <div style={{padding:14,background:C.goldBg,border:`1px solid ${C.gold}30`,borderRadius:10,display:"flex",alignItems:"center",gap:12}}>
      <Award size={18} color={C.gold}/>
      <div style={{flex:1}}><div style={{fontFamily:F.body,fontSize:13,fontWeight:600,color:C.gold}}>Stripe Connect</div><div style={{fontFamily:F.body,fontSize:12,color:C.textSecondary}}>Prêt à recevoir des paiements</div></div>
      <Badge color="green">Actif</Badge>
    </div>
  </div>
);

const Placeholder = ({i:I,t,d}) => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:350,gap:14}}>
    <I size={44} color={C.textMuted}/><div style={{fontFamily:F.display,fontSize:22}}>{t}</div><div style={{fontFamily:F.body,fontSize:13,color:C.textMuted}}>{d}</div><Badge color="gold">Prochainement</Badge>
  </div>
);

// ═══════════════════════════════════════════════════════
// MAIN ROUTER
// ═══════════════════════════════════════════════════════
export default function ImmoCool() {
  const [page,setPage]=useState("landing");
  const [sub,setSub]=useState("overview");
  const [transition,setTransition]=useState(true);
  
  const nav = useCallback((p)=>{
    setTransition(false);
    setTimeout(()=>{
      setPage(p);
      if(p==="dashboard")setSub("overview");
      setTimeout(()=>setTransition(true),50);
    },200);
  },[]);
  
  return (
    <div style={{fontFamily:F.body}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        html,body{background:${C.bg};}
        ::selection{background:${C.gold}30;color:${C.text};}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:${C.bg};}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px;}
        input::placeholder,textarea::placeholder{color:${C.textMuted};}
        select option{background:${C.bg};color:${C.text};}
      `}</style>
      <div style={{opacity:transition?1:0,transition:"opacity 0.2s ease"}}>
        {page==="landing"&&<Landing nav={nav}/>}
        {page==="login"&&<Auth mode="login" nav={nav}/>}
        {page==="register"&&<Auth mode="register" nav={nav}/>}
        {page==="dashboard"&&<Dash nav={nav} sub={sub} setSub={setSub}/>}
        {page==="tenant-search"&&<TenantSearch nav={nav}/>}
      </div>
    </div>
  );
}
