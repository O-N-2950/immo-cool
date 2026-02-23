"use client";
import Link from "next/link";

const C={bg:"#07060A",bgCard:"#0F0E14",bgEl:"#16151E",border:"#2A2838",gold:"#D4A853",goldBg:"rgba(212,168,83,0.08)",text:"#F0EDE6",sec:"#9B97A8",muted:"#5E5A6E",danger:"#F87171",purple:"#A78BFA",success:"#34D399",info:"#60A5FA"};
const F={d:"'Cormorant Garamond',Georgia,serif",b:"'DM Sans',sans-serif",m:"'JetBrains Mono',monospace"};

const TOOLS = [
  {href:"/outils/contestation",icon:"⚠️",title:"Contestation de loyer IA",desc:"Votre loyer est-il trop élevé ? Analyse automatique + lettre de contestation.",tag:"🔥 Le plus populaire",tagColor:C.danger,tagBg:"rgba(248,113,113,0.1)"},
  {href:"/outils/bail-gratuit",icon:"📄",title:"Générateur de bail gratuit",desc:"Bail conforme 26 cantons. Taux hypothécaire et IPC intégrés. Formulaire loyer initial automatique.",tag:"⭐ Essentiel",tagColor:C.gold,tagBg:C.goldBg},
  {href:"/outils/resiliation",icon:"✉️",title:"Résiliation de bail",desc:"Lettre prête à envoyer par recommandé. Calcul automatique des délais.",tag:"Rapide",tagColor:C.info,tagBg:"rgba(96,165,250,0.1)"},
  {href:"/outils/calculateur-loyer",icon:"✨",title:"Calculateur de loyer IA",desc:"Estimation du juste loyer par IA + données marché. Comparez avec votre loyer actuel.",tag:"IA",tagColor:C.purple,tagBg:"rgba(167,139,250,0.1)"},
  {href:"/outils/etat-des-lieux",icon:"🏠",title:"État des lieux PDF",desc:"Grille d'inspection dynamique selon vos pièces. PDF professionnel prêt à imprimer.",tag:"PDF pro",tagColor:C.success,tagBg:"rgba(52,211,153,0.1)"},
  {href:"/outils/assistant-ia",icon:"💬",title:"Assistant juridique IA",desc:"Posez vos questions sur le droit du bail suisse. Expert IA disponible 24/7.",tag:"IA 24/7",tagColor:C.purple,tagBg:"rgba(167,139,250,0.1)"},
];

export default function Outils() {
  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text}}>
      {/* Header */}
      <div style={{padding:"16px 32px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Link href="/" style={{textDecoration:"none"}}>
          <span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.text}}>immo</span>
          <span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.gold}}>.</span>
          <span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.text}}>cool</span>
        </Link>
        <Link href="/demande" style={{fontFamily:F.b,fontSize:12,color:C.gold,textDecoration:"none",padding:"6px 14px",borderRadius:6,border:`1px solid ${C.gold}30`}}>
          Publier ma recherche →
        </Link>
      </div>

      <div style={{maxWidth:860,margin:"0 auto",padding:"48px 24px"}}>
        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{display:"inline-block",background:C.goldBg,border:`1px solid ${C.gold}30`,borderRadius:20,padding:"4px 14px",fontFamily:F.m,fontSize:11,color:C.gold,marginBottom:16}}>
            100% gratuit — aucune inscription
          </div>
          <h1 style={{fontFamily:F.d,fontSize:"clamp(32px,6vw,52px)",fontWeight:400,lineHeight:1.1,marginBottom:16}}>
            Outils immobiliers <span style={{fontStyle:"italic",color:C.gold}}>gratuits</span>
          </h1>
          <p style={{fontFamily:F.b,fontSize:16,color:C.sec,lineHeight:1.7,maxWidth:520,margin:"0 auto"}}>
            Tout ce dont vous avez besoin pour votre bail, sans avocat, sans régie, sans frais. Conformes au droit suisse.
          </p>
        </div>

        {/* Tools grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))",gap:16,marginBottom:48}}>
          {TOOLS.map((t,i)=>(
            <Link key={i} href={t.href} style={{textDecoration:"none",color:C.text}}>
              <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:22,height:"100%",transition:"all 0.25s",cursor:"pointer"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold+"50";e.currentTarget.style.transform="translateY(-2px)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateY(0)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:12}}>
                  <span style={{fontSize:28}}>{t.icon}</span>
                  <span style={{background:t.tagBg,borderRadius:12,padding:"3px 10px",fontFamily:F.m,fontSize:10,color:t.tagColor}}>{t.tag}</span>
                </div>
                <h3 style={{fontFamily:F.d,fontSize:20,fontWeight:600,marginBottom:8}}>{t.title}</h3>
                <p style={{fontFamily:F.b,fontSize:13,color:C.sec,lineHeight:1.6}}>{t.desc}</p>
                <div style={{marginTop:14,fontFamily:F.b,fontSize:12,color:C.gold,fontWeight:600}}>Utiliser gratuitement →</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div style={{display:"flex",justifyContent:"center",gap:32,marginBottom:48,flexWrap:"wrap"}}>
          {[{v:"26",l:"cantons couverts"},{v:"6",l:"outils gratuits"},{v:"CHF 0",l:"pour les locataires"},{v:"24/7",l:"IA disponible"}].map((s,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontFamily:F.d,fontSize:36,fontWeight:600,color:C.gold}}>{s.v}</div>
              <div style={{fontFamily:F.b,fontSize:12,color:C.muted}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* CTA for owners */}
        <div style={{background:`linear-gradient(135deg,${C.goldBg},rgba(167,139,250,0.05))`,border:`1px solid ${C.gold}25`,borderRadius:16,padding:32,textAlign:"center"}}>
          <h2 style={{fontFamily:F.d,fontSize:28,marginBottom:8}}>Vous êtes propriétaire ?</h2>
          <p style={{fontFamily:F.b,fontSize:15,color:C.sec,marginBottom:20,lineHeight:1.7,maxWidth:480,margin:"0 auto 20px"}}>
            Publiez votre bien gratuitement. Vous ne payez que 50% du premier loyer — et seulement si on trouve votre locataire.
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <Link href="/" style={{display:"inline-block",background:`linear-gradient(135deg,${C.gold},#A07D2E)`,borderRadius:10,padding:"12px 28px",fontFamily:F.b,fontSize:14,color:C.bg,textDecoration:"none",fontWeight:600}}>
              Publier un bien →
            </Link>
            <Link href="/demande" style={{display:"inline-block",background:"transparent",border:`1px solid ${C.gold}40`,borderRadius:10,padding:"12px 28px",fontFamily:F.b,fontSize:14,color:C.gold,textDecoration:"none"}}>
              Voir les demandes de locataires →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div style={{textAlign:"center",marginTop:48,paddingTop:24,borderTop:`1px solid ${C.border}`}}>
          <span style={{fontFamily:F.d,fontSize:18,color:C.muted}}>immo</span>
          <span style={{fontFamily:F.d,fontSize:18,color:C.gold}}>.</span>
          <span style={{fontFamily:F.d,fontSize:18,color:C.muted}}>cool</span>
          <p style={{fontFamily:F.b,fontSize:11,color:C.muted,marginTop:4}}>La première régie 100% IA de Suisse — www.immocool.ch</p>
        </div>
      </div>
    </div>
  );
}
