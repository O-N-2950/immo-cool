"use client";
import { useState } from "react";
import Link from "next/link";

const C = {
  bg:"#07060A",bgCard:"#0F0E14",bgEl:"#16151E",border:"#2A2838",
  gold:"#D4A853",goldBg:"rgba(212,168,83,0.08)",
  text:"#F0EDE6",sec:"#9B97A8",muted:"#5E5A6E",
  success:"#34D399",successBg:"rgba(52,211,153,0.1)",
  danger:"#F87171",dangerBg:"rgba(248,113,113,0.1)",
  info:"#60A5FA",
};
const F={d:"'Cormorant Garamond',Georgia,serif",b:"'DM Sans',sans-serif",m:"'JetBrains Mono',monospace"};

const CANTONS=["JU","GE","VD","NE","FR","BE","VS","ZH","BS","LU","ZG","TI","SG","AG","SO","TG","GR","BL","SH","NW","SZ","OW","AR","AI","UR","GL"];

export default function Contestation() {
  const [step,setStep]=useState(1);
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [email,setEmail]=useState("");
  const [emailSaved,setEmailSaved]=useState(false);
  const [f,setF]=useState({
    canton:"JU",propCity:"",rooms:"3.5",area:"75",
    currentRent:"",charges:"",leaseDate:"",leaseRate:"1.75",
    tenantName:"",tenantAddr:"",tenantCity:"",
    ownerName:"",ownerAddr:"",propAddr:"",propNPA:"",
  });
  const u=(k,v)=>setF({...f,[k]:v});
  
  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tools/contest", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(f),
      });
      const data = await res.json();
      setResult(data);
      setStep(3);
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
  };
  
  const downloadPDF = async () => {
    try {
      const res = await fetch("/api/tools/contest", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({...f, format:"pdf", fairRent:result?.fairRent}),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `analyse-loyer-${Date.now()}.pdf`; a.click();
    } catch(e) { console.error(e); }
  };
  
  const Inp = ({label,value,k,ph,suf,type="text",note}) => (
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500}}>{label}</label>
      <div style={{position:"relative"}}>
        <input type={type} value={value} onChange={e=>u(k,e.target.value)} placeholder={ph}
          style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:`9px ${suf?"52px":"14px"} 9px 14px`,fontFamily:F.b,fontSize:14,color:C.text,outline:"none",transition:"border-color 0.2s"}}
          onFocus={e=>e.target.style.borderColor=C.gold+"80"} onBlur={e=>e.target.style.borderColor=C.border}/>
        {suf&&<span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontFamily:F.m,fontSize:11,color:C.muted}}>{suf}</span>}
      </div>
      {note&&<span style={{fontFamily:F.b,fontSize:10,color:C.muted,fontStyle:"italic"}}>{note}</span>}
    </div>
  );
  
  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.gold}30}@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      
      {/* Header */}
      <div style={{padding:"16px 32px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Link href="/" style={{display:"flex",alignItems:"center",textDecoration:"none"}}>
          <span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.text}}>immo</span>
          <span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.gold}}>.</span>
          <span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.text}}>cool</span>
        </Link>
        <div style={{display:"flex",gap:8}}>
          <Link href="/outils/bail-gratuit" style={{fontFamily:F.b,fontSize:12,color:C.sec,textDecoration:"none",padding:"6px 12px",borderRadius:6,border:`1px solid ${C.border}`}}>Bail gratuit</Link>
          <Link href="/outils/resiliation" style={{fontFamily:F.b,fontSize:12,color:C.sec,textDecoration:"none",padding:"6px 12px",borderRadius:6,border:`1px solid ${C.border}`}}>Résiliation</Link>
        </div>
      </div>

      <div style={{maxWidth:620,margin:"0 auto",padding:"40px 24px"}}>
        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"inline-block",background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:20,padding:"4px 14px",fontFamily:F.m,fontSize:11,color:C.danger,marginBottom:16}}>
            Outil exclusif — propulsé par IA
          </div>
          <h1 style={{fontFamily:F.d,fontSize:"clamp(28px,5vw,44px)",fontWeight:400,lineHeight:1.1,marginBottom:12}}>
            Votre loyer est-il<br/><span style={{fontStyle:"italic",color:C.danger}}>trop élevé</span> ?
          </h1>
          <p style={{fontFamily:F.b,fontSize:15,color:C.sec,lineHeight:1.7,maxWidth:480,margin:"0 auto"}}>
            Analyse automatique en 2 minutes. Comparaison avec le taux hypothécaire, l'IPC et les loyers du marché. Lettre de contestation générée si applicable.
          </p>
        </div>
        
        {/* Progress */}
        <div style={{display:"flex",gap:4,marginBottom:24}}>
          {["Votre bail","Détails","Résultat"].map((_,i)=>(
            <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<step?C.gold:C.border,transition:"background 0.3s"}}/>
          ))}
        </div>
        
        {/* ── STEP 1: Bail data ── */}
        {step===1&&<div>
          <h2 style={{fontFamily:F.d,fontSize:24,marginBottom:20}}>Informations de votre <span style={{color:C.gold,fontStyle:"italic"}}>bail</span></h2>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Canton</label>
                <select value={f.canton} onChange={e=>u("canton",e.target.value)} style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontFamily:F.b,fontSize:14,color:C.text,outline:"none"}}>
                  {CANTONS.map(c=><option key={c} value={c} style={{background:C.bg}}>{c}</option>)}
                </select>
              </div>
              <Inp label="Ville" value={f.propCity} k="propCity" ph="Delémont"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              <Inp label="Pièces" value={f.rooms} k="rooms" ph="3.5"/>
              <Inp label="Surface" value={f.area} k="area" ph="75" suf="m²"/>
              <Inp label="Début du bail" value={f.leaseDate} k="leaseDate" type="date"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Inp label="Loyer net actuel" value={f.currentRent} k="currentRent" type="number" suf="CHF/mois"/>
              <Inp label="Charges" value={f.charges} k="charges" type="number" suf="CHF/mois"/>
            </div>
            <Inp label="Taux hypothécaire au moment de la signature" value={f.leaseRate} k="leaseRate" ph="1.75" suf="%" 
              note="Indiqué dans votre bail ou dans le formulaire de loyer initial. Si vous ne savez pas, regardez la date: avant 2024 = 1.75%, avant 2023 = 1.50%, avant 2020 = 1.25%"/>
            
            <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,padding:14}}>
              <div style={{fontFamily:F.m,fontSize:10,color:C.muted,marginBottom:6}}>RÉFÉRENCES ACTUELLES</div>
              <div style={{display:"flex",gap:20}}>
                <div><span style={{fontFamily:F.b,fontSize:11,color:C.sec}}>Taux hypo. </span><span style={{fontFamily:F.m,fontSize:13,fontWeight:700,color:C.gold}}>1.25%</span></div>
                <div><span style={{fontFamily:F.b,fontSize:11,color:C.sec}}>IPC </span><span style={{fontFamily:F.m,fontSize:13,fontWeight:700,color:C.gold}}>107.1</span></div>
                <div><span style={{fontFamily:F.b,fontSize:11,color:C.sec}}>Source </span><span style={{fontFamily:F.m,fontSize:11,color:C.muted}}>OFL / OFS 2026</span></div>
              </div>
            </div>
          </div>
          
          <button onClick={()=>setStep(2)} disabled={!f.currentRent || !f.leaseRate}
            style={{width:"100%",marginTop:24,padding:"14px 20px",background:f.currentRent&&f.leaseRate?`linear-gradient(135deg,${C.gold},#A07D2E)`:"#333",border:"none",borderRadius:10,color:C.bg,fontFamily:F.b,fontSize:14,fontWeight:600,cursor:f.currentRent&&f.leaseRate?"pointer":"not-allowed",transition:"opacity 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.9"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            Continuer →
          </button>
        </div>}
        
        {/* ── STEP 2: Contact (optional but captures lead) ── */}
        {step===2&&<div>
          <h2 style={{fontFamily:F.d,fontSize:24,marginBottom:8}}>Vos coordonnées <span style={{color:C.muted,fontStyle:"italic"}}>(optionnel)</span></h2>
          <p style={{fontFamily:F.b,fontSize:13,color:C.muted,marginBottom:20}}>Pour pré-remplir la lettre de contestation. Si vous laissez vide, des champs à compléter seront générés.</p>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Inp label="Votre nom" value={f.tenantName} k="tenantName" ph="Sophie Müller"/>
            <Inp label="Votre adresse" value={f.tenantAddr} k="tenantAddr" ph="Grand-Rue 45, 2800 Delémont"/>
            <Inp label="Nom du propriétaire / régie" value={f.ownerName} k="ownerName" ph="Si connu"/>
            <Inp label="Adresse du propriétaire / régie" value={f.ownerAddr} k="ownerAddr" ph="Si connue"/>
          </div>
          
          <div style={{display:"flex",gap:8,marginTop:24}}>
            <button onClick={()=>setStep(1)} style={{flex:"0 0 auto",padding:"14px 20px",background:"transparent",border:`1px solid ${C.border}`,borderRadius:10,color:C.sec,fontFamily:F.b,fontSize:14,cursor:"pointer"}}>← Retour</button>
            <button onClick={analyze} disabled={loading}
              style={{flex:1,padding:"14px 20px",background:`linear-gradient(135deg,${C.danger},#B91C1C)`,border:"none",borderRadius:10,color:"#fff",fontFamily:F.b,fontSize:14,fontWeight:600,cursor:loading?"wait":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {loading ? (
                <><span style={{display:"flex",gap:3}}>{[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:3,background:"#fff",animation:`pulse 1s ${i*0.15}s infinite`}}/>)}</span> Analyse en cours...</>
              ) : "🔍 Analyser mon loyer"}
            </button>
          </div>
        </div>}
        
        {/* ── STEP 3: RESULTS ── */}
        {step===3&&result&&<div>
          {/* Big result card */}
          <div style={{
            background: result.canContest ? C.dangerBg : C.successBg,
            border: `2px solid ${result.canContest ? C.danger+"50" : C.success+"50"}`,
            borderRadius:16, padding:28, textAlign:"center", marginBottom:24,
          }}>
            <div style={{fontSize:48,marginBottom:8}}>{result.canContest ? "⚠️" : "✅"}</div>
            <h2 style={{fontFamily:F.d,fontSize:28,fontWeight:600,marginBottom:8,color:result.canContest?C.danger:C.success}}>
              {result.canContest ? "Loyer potentiellement trop élevé" : "Loyer conforme"}
            </h2>
            
            {result.canContest ? (
              <div>
                <div style={{fontFamily:F.d,fontSize:52,fontWeight:700,color:C.danger,margin:"16px 0 4px"}}>
                  CHF {result.saving?.toLocaleString('fr-CH')}<span style={{fontSize:20,fontWeight:400}}>/mois</span>
                </div>
                <div style={{fontFamily:F.b,fontSize:16,color:C.sec}}>
                  d'économie potentielle ({result.overpricePercent}% au-dessus du référence)
                </div>
                <div style={{fontFamily:F.m,fontSize:14,color:C.text,marginTop:8,background:C.bgCard,display:"inline-block",padding:"6px 16px",borderRadius:8}}>
                  = CHF {result.savingAnnual?.toLocaleString('fr-CH')}/an
                </div>
              </div>
            ) : (
              <p style={{fontFamily:F.b,fontSize:14,color:C.sec}}>
                D'après notre analyse, votre loyer correspond aux conditions de marché et au taux hypothécaire actuel.
              </p>
            )}
          </div>
          
          {/* Detail cards */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
            {[
              {l:"Votre loyer",v:`CHF ${Number(f.currentRent).toLocaleString('fr-CH')}`,c:C.text},
              {l:"Loyer de référence",v:`CHF ${result.fairRent?.toLocaleString('fr-CH')}`,c:result.canContest?C.success:C.text},
              {l:"Taux hypo. actuel",v:`${result.currentRate}%`,c:C.gold},
            ].map((x,i)=>(
              <div key={i} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,padding:14,textAlign:"center"}}>
                <div style={{fontFamily:F.b,fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em"}}>{x.l}</div>
                <div style={{fontFamily:F.m,fontSize:20,fontWeight:700,color:x.c,marginTop:6}}>{x.v}</div>
              </div>
            ))}
          </div>
          
          {/* Explanation */}
          {result.explanation&&<div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:20}}>
            <div style={{fontFamily:F.b,fontSize:12,fontWeight:600,color:C.gold,marginBottom:8}}>📊 Analyse détaillée</div>
            <p style={{fontFamily:F.b,fontSize:13,color:C.sec,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{result.explanation}</p>
          </div>}
          
          {/* Legal basis */}
          <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:20}}>
            <div style={{fontFamily:F.b,fontSize:12,fontWeight:600,color:C.gold,marginBottom:8}}>⚖️ Bases légales</div>
            {result.legalBasis?.map((l,i)=>(
              <div key={i} style={{fontFamily:F.m,fontSize:11,color:C.sec,padding:"3px 0"}}>{l}</div>
            ))}
          </div>
          
          {/* CTA: Download PDF + Email capture */}
          {result.canContest&&<div style={{background:`linear-gradient(135deg,${C.goldBg},rgba(167,139,250,0.05))`,border:`1px solid ${C.gold}30`,borderRadius:16,padding:24,marginBottom:20}}>
            <h3 style={{fontFamily:F.d,fontSize:22,marginBottom:12}}>Télécharger votre <span style={{color:C.gold,fontStyle:"italic"}}>analyse + lettre</span></h3>
            <p style={{fontFamily:F.b,fontSize:13,color:C.sec,marginBottom:16,lineHeight:1.6}}>
              Le PDF contient l'analyse complète de votre loyer et une lettre de contestation pré-remplie, prête à envoyer par recommandé.
            </p>
            
            {!emailSaved ? (
              <div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Votre email (pour recevoir la copie)"
                    style={{flex:1,background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontFamily:F.b,fontSize:13,color:C.text,outline:"none"}}
                    onFocus={e=>e.target.style.borderColor=C.gold+"80"} onBlur={e=>e.target.style.borderColor=C.border}/>
                  <button onClick={()=>{setEmailSaved(true);downloadPDF()}}
                    style={{padding:"10px 20px",background:`linear-gradient(135deg,${C.gold},#A07D2E)`,border:"none",borderRadius:8,color:C.bg,fontFamily:F.b,fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
                    📥 Télécharger PDF
                  </button>
                </div>
                <button onClick={()=>{setEmailSaved(true);downloadPDF()}}
                  style={{background:"none",border:"none",color:C.muted,fontFamily:F.b,fontSize:11,cursor:"pointer",padding:0}}>
                  Télécharger sans email →
                </button>
              </div>
            ) : (
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:C.success,fontFamily:F.b,fontSize:13}}>✓ PDF téléchargé</span>
                <button onClick={downloadPDF} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"6px 12px",color:C.sec,fontFamily:F.b,fontSize:12,cursor:"pointer"}}>Retélécharger</button>
              </div>
            )}
          </div>}
          
          {/* Upsell: immo.cool */}
          <div style={{background:C.bgCard,border:`1px solid ${C.gold}20`,borderRadius:12,padding:18,textAlign:"center"}}>
            <div style={{fontFamily:F.d,fontSize:18,marginBottom:8}}>Envie de changer d'appartement ?</div>
            <p style={{fontFamily:F.b,fontSize:13,color:C.sec,marginBottom:14}}>
              Trouvez un appartement au juste prix sur immo.cool. 100% gratuit pour les locataires.
            </p>
            <Link href="/" style={{display:"inline-block",background:C.goldBg,border:`1px solid ${C.gold}40`,borderRadius:8,padding:"8px 20px",fontFamily:F.b,fontSize:13,color:C.gold,textDecoration:"none",fontWeight:600}}>
              Chercher un appartement →
            </Link>
          </div>
          
          {/* Restart */}
          <button onClick={()=>{setStep(1);setResult(null);setEmailSaved(false)}}
            style={{width:"100%",marginTop:16,padding:"10px",background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,fontFamily:F.b,fontSize:12,cursor:"pointer"}}>
            ↺ Nouvelle analyse
          </button>
        </div>}
        
        {/* Trust indicators */}
        <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:40,paddingTop:24,borderTop:`1px solid ${C.border}`}}>
          {[{t:"Gratuit",s:"Aucun frais caché"},{t:"Confidentiel",s:"Données non partagées"},{t:"Droit suisse",s:"CO + OBLF à jour"}].map((x,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontFamily:F.b,fontSize:12,fontWeight:600,color:C.text}}>{x.t}</div>
              <div style={{fontFamily:F.b,fontSize:10,color:C.muted}}>{x.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
