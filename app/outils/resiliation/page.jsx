"use client";
import { useState } from "react";
import Link from "next/link";

const C={bg:"#07060A",bgCard:"#0F0E14",bgEl:"#16151E",border:"#2A2838",gold:"#D4A853",goldBg:"rgba(212,168,83,0.08)",text:"#F0EDE6",sec:"#9B97A8",muted:"#5E5A6E",success:"#34D399",successBg:"rgba(52,211,153,0.1)",danger:"#F87171"};
const F={d:"'Cormorant Garamond',Georgia,serif",b:"'DM Sans',sans-serif",m:"'JetBrains Mono',monospace"};

const CANTONS=["JU","GE","VD","NE","FR","BE","VS","ZH","BS","LU","ZG","TI","SG","AG","SO","TG","GR","BL","SH","NW","SZ","OW","AR","AI","UR","GL"];

function calcDeadline(termDate, months=3) {
  if(!termDate) return null;
  const d = new Date(termDate);
  d.setMonth(d.getMonth() - months);
  return d;
}

function formatDate(d) {
  if(!d) return "—";
  return new Date(d).toLocaleDateString("fr-CH",{day:"2-digit",month:"long",year:"numeric"});
}

export default function Resiliation() {
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(false);
  const [f,setF]=useState({
    role:"tenant",canton:"JU",noticePeriod:"3",
    senderName:"",senderAddr:"",senderNPA:"",senderCity:"",
    recipientName:"",recipientAddr:"",recipientNPA:"",recipientCity:"",
    propAddr:"",propNPA:"",propCity:"",leaseRef:"",
    terminationDate:"",
  });
  const u=(k,v)=>setF({...f,[k]:v});
  
  const deadline = calcDeadline(f.terminationDate, Number(f.noticePeriod));
  const sendBy = deadline ? new Date(deadline.getTime() - 5*24*60*60*1000) : null; // -5 jours pour le courrier
  const isLate = sendBy && sendBy < new Date();
  
  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tools/generate-resiliation",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});
      if(res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a=document.createElement("a"); a.href=url; a.download=`resiliation-${Date.now()}.pdf`; a.click();
        URL.revokeObjectURL(url);
        setDone(true);
      }
    } catch(e){console.error(e)}
    setLoading(false);
  };
  
  const Inp=({label,value,k,ph,type="text"})=>(
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500}}>{label}</label>
      <input type={type} value={value} onChange={e=>u(k,e.target.value)} placeholder={ph}
        style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 14px",fontFamily:F.b,fontSize:14,color:C.text,outline:"none",transition:"border-color 0.2s"}}
        onFocus={e=>e.target.style.borderColor=C.gold+"80"} onBlur={e=>e.target.style.borderColor=C.border}/>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.gold}30}`}</style>
      
      <div style={{padding:"16px 32px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <Link href="/" style={{textDecoration:"none"}}><span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.text}}>immo</span><span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.gold}}>.</span><span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.text}}>cool</span></Link>
        <div style={{display:"flex",gap:6}}>
          <Link href="/outils/bail-gratuit" style={{fontFamily:F.b,fontSize:11,color:C.sec,textDecoration:"none",padding:"5px 10px",borderRadius:6,border:`1px solid ${C.border}`}}>Bail gratuit</Link>
          <Link href="/outils/contestation" style={{fontFamily:F.b,fontSize:11,color:C.sec,textDecoration:"none",padding:"5px 10px",borderRadius:6,border:`1px solid ${C.border}`}}>Contestation</Link>
        </div>
      </div>

      <div style={{maxWidth:620,margin:"0 auto",padding:"40px 24px"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"inline-block",background:C.goldBg,border:`1px solid ${C.gold}30`,borderRadius:20,padding:"4px 14px",fontFamily:F.m,fontSize:11,color:C.gold,marginBottom:16}}>Gratuit — courrier prêt à envoyer</div>
          <h1 style={{fontFamily:F.d,fontSize:"clamp(28px,5vw,44px)",fontWeight:400,lineHeight:1.1,marginBottom:12}}>
            Résiliez votre <span style={{fontStyle:"italic",color:C.gold}}>bail</span> en 2 minutes
          </h1>
          <p style={{fontFamily:F.b,fontSize:14,color:C.sec,lineHeight:1.7,maxWidth:460,margin:"0 auto"}}>
            Lettre conforme au CO, prête à envoyer par recommandé. Calcul automatique des délais.
          </p>
        </div>

        {!done ? (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Role */}
            <div>
              <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Je suis</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[{v:"tenant",l:"🏠 Locataire"},{v:"owner",l:"🔑 Propriétaire"}].map(r=>(
                  <button key={r.v} onClick={()=>u("role",r.v)} style={{padding:12,borderRadius:8,border:`1px solid ${f.role===r.v?C.gold+"50":C.border}`,background:f.role===r.v?C.goldBg:"transparent",color:f.role===r.v?C.gold:C.sec,cursor:"pointer",fontFamily:F.b,fontSize:13}}>{r.l}</button>
                ))}
              </div>
            </div>

            {/* Expéditeur */}
            <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
              <div style={{fontFamily:F.b,fontSize:13,fontWeight:600,marginBottom:12}}>Expéditeur ({f.role==="tenant"?"locataire":"propriétaire"})</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <Inp label="Nom" value={f.senderName} k="senderName" ph={f.role==="tenant"?"Sophie Müller":"Olivier Botteron"}/>
                <Inp label="Adresse" value={f.senderAddr} k="senderAddr" ph="Rue de la Gare 12"/>
                <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:10}}>
                  <Inp label="NPA" value={f.senderNPA} k="senderNPA" ph="2800"/>
                  <Inp label="Ville" value={f.senderCity} k="senderCity" ph="Delémont"/>
                </div>
              </div>
            </div>

            {/* Destinataire */}
            <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
              <div style={{fontFamily:F.b,fontSize:13,fontWeight:600,marginBottom:12}}>Destinataire ({f.role==="tenant"?"propriétaire/régie":"locataire"})</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <Inp label="Nom" value={f.recipientName} k="recipientName" ph={f.role==="tenant"?"Régie du Jura SA":"Sophie Müller"}/>
                <Inp label="Adresse" value={f.recipientAddr} k="recipientAddr" ph="Rue de l'Avenir 8"/>
                <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:10}}>
                  <Inp label="NPA" value={f.recipientNPA} k="recipientNPA" ph="2800"/>
                  <Inp label="Ville" value={f.recipientCity} k="recipientCity" ph="Delémont"/>
                </div>
              </div>
            </div>

            {/* Objet & date */}
            <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
              <div style={{fontFamily:F.b,fontSize:13,fontWeight:600,marginBottom:12}}>Bail concerné</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <Inp label="Adresse du bien loué" value={f.propAddr} k="propAddr" ph="Grand-Rue 45"/>
                <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:10}}>
                  <Inp label="NPA" value={f.propNPA} k="propNPA" ph="2800"/>
                  <Inp label="Ville" value={f.propCity} k="propCity" ph="Delémont"/>
                </div>
                <Inp label="Référence du bail (si connue)" value={f.leaseRef} k="leaseRef" ph="JU-2024-0123"/>
                <Inp label="Date de résiliation souhaitée" value={f.terminationDate} k="terminationDate" type="date"/>
              </div>
            </div>

            {/* Deadline calculator */}
            {f.terminationDate&&<div style={{background:isLate?"rgba(248,113,113,0.1)":C.successBg,border:`1px solid ${isLate?C.danger+"30":C.success+"30"}`,borderRadius:12,padding:18}}>
              <div style={{fontFamily:F.b,fontSize:13,fontWeight:600,color:isLate?C.danger:C.success,marginBottom:8}}>
                {isLate?"⚠️ Attention — délai possiblement dépassé":"✓ Calcul des délais"}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <div style={{fontFamily:F.b,fontSize:12,color:C.sec}}>Résiliation effective: <strong style={{color:C.text}}>{formatDate(f.terminationDate)}</strong></div>
                <div style={{fontFamily:F.b,fontSize:12,color:C.sec}}>Préavis: <strong style={{color:C.text}}>{f.noticePeriod} mois (art. 266c CO)</strong></div>
                <div style={{fontFamily:F.b,fontSize:12,color:C.sec}}>Le courrier doit être <strong>reçu</strong> avant le: <strong style={{color:isLate?C.danger:C.success}}>{formatDate(deadline)}</strong></div>
                <div style={{fontFamily:F.b,fontSize:12,color:C.sec}}>Date d'envoi recommandée: <strong style={{color:isLate?C.danger:C.gold}}>{formatDate(sendBy)}</strong></div>
              </div>
            </div>}

            <button onClick={generate} disabled={loading||!f.senderName||!f.terminationDate}
              style={{width:"100%",padding:"14px",background:f.senderName&&f.terminationDate?`linear-gradient(135deg,${C.gold},#A07D2E)`:"#333",border:"none",borderRadius:10,color:C.bg,fontFamily:F.b,fontSize:14,fontWeight:600,cursor:f.senderName&&f.terminationDate?"pointer":"not-allowed",opacity:loading?0.6:1}}>
              {loading?"⏳ Génération...":"📄 Générer la lettre de résiliation"}
            </button>
          </div>
        ) : (
          <div style={{textAlign:"center"}}>
            <div style={{background:C.successBg,border:`2px solid ${C.success}40`,borderRadius:16,padding:32,marginBottom:24}}>
              <div style={{fontSize:48,marginBottom:12}}>✓</div>
              <h2 style={{fontFamily:F.d,fontSize:28,color:C.success,marginBottom:8}}>Résiliation générée !</h2>
              <p style={{fontFamily:F.b,fontSize:14,color:C.sec,lineHeight:1.6}}>
                Imprimez et envoyez par <strong style={{color:C.text}}>courrier recommandé</strong>.<br/>
                La date de réception fait foi, pas la date d'envoi.
              </p>
            </div>
            <div style={{background:C.goldBg,border:`1px solid ${C.gold}30`,borderRadius:12,padding:20,marginBottom:20}}>
              <div style={{fontFamily:F.d,fontSize:20,marginBottom:8}}>Vous cherchez un nouvel appartement ?</div>
              <p style={{fontFamily:F.b,fontSize:13,color:C.sec,marginBottom:14}}>100% gratuit pour les locataires. Matching IA.</p>
              <Link href="/" style={{display:"inline-block",background:`linear-gradient(135deg,${C.gold},#A07D2E)`,borderRadius:8,padding:"10px 20px",fontFamily:F.b,fontSize:13,color:C.bg,textDecoration:"none",fontWeight:600}}>
                Chercher un appartement →
              </Link>
            </div>
            <button onClick={()=>{setDone(false)}} style={{fontFamily:F.b,fontSize:12,color:C.muted,background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 16px",cursor:"pointer"}}>↺ Nouvelle résiliation</button>
          </div>
        )}

        <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:40,paddingTop:24,borderTop:`1px solid ${C.border}`}}>
          {[{t:"Gratuit",s:"Aucun frais"},{t:"Conforme CO",s:"Art. 266a-266o"},{t:"Recommandé",s:"Envoi sécurisé"}].map((x,i)=>(
            <div key={i} style={{textAlign:"center"}}><div style={{fontFamily:F.b,fontSize:12,fontWeight:600}}>{x.t}</div><div style={{fontFamily:F.b,fontSize:10,color:C.muted}}>{x.s}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
