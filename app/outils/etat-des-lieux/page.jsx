"use client";
import { useState } from "react";
import Link from "next/link";

const C={bg:"#07060A",bgCard:"#0F0E14",bgEl:"#16151E",border:"#2A2838",gold:"#D4A853",goldBg:"rgba(212,168,83,0.08)",text:"#F0EDE6",sec:"#9B97A8",muted:"#5E5A6E",success:"#34D399",successBg:"rgba(52,211,153,0.1)"};
const F={d:"'Cormorant Garamond',Georgia,serif",b:"'DM Sans',sans-serif",m:"'JetBrains Mono',monospace"};

export default function EtatDesLieux() {
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(false);
  const [f,setF]=useState({
    type:"entry",date:"",
    propAddr:"",propNPA:"",propCity:"",rooms:"3.5",area:"75",
    ownerName:"",tenantName:"",
    balcony:true,cellar:true,
  });
  const u=(k,v)=>setF({...f,[k]:v});
  
  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tools/generate-edl",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});
      if(res.ok){
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a=document.createElement("a"); a.href=url; a.download=`etat-des-lieux-${f.type}-${Date.now()}.pdf`; a.click();
        URL.revokeObjectURL(url);
        setDone(true);
      }
    } catch(e){console.error(e)}
    setLoading(false);
  };
  
  const Inp=({label,value,k,ph,type="text",suf})=>(
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500}}>{label}</label>
      <div style={{position:"relative"}}>
        <input type={type} value={value} onChange={e=>u(k,e.target.value)} placeholder={ph}
          style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:`9px ${suf?"52px":"14px"} 9px 14px`,fontFamily:F.b,fontSize:14,color:C.text,outline:"none"}}
          onFocus={e=>e.target.style.borderColor=C.gold+"80"} onBlur={e=>e.target.style.borderColor=C.border}/>
        {suf&&<span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontFamily:F.m,fontSize:11,color:C.muted}}>{suf}</span>}
      </div>
    </div>
  );

  const rooms = Math.floor(Number(f.rooms)||3);
  const sections=["Entrée/couloir",...Array.from({length:rooms-1},(_,i)=>i===0?"Séjour":`Chambre ${i}`),"Cuisine","Salle de bains","WC",...(f.balcony?["Balcon/terrasse"]:[]),...(f.cellar?["Cave"]:[])];

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.gold}30}`}</style>
      
      <div style={{padding:"16px 32px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <Link href="/" style={{textDecoration:"none"}}><span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.text}}>immo</span><span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.gold}}>.</span><span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.text}}>cool</span></Link>
        <div style={{display:"flex",gap:6}}>
          <Link href="/outils/bail-gratuit" style={{fontFamily:F.b,fontSize:11,color:C.sec,textDecoration:"none",padding:"5px 10px",borderRadius:6,border:`1px solid ${C.border}`}}>Bail gratuit</Link>
          <Link href="/outils/resiliation" style={{fontFamily:F.b,fontSize:11,color:C.sec,textDecoration:"none",padding:"5px 10px",borderRadius:6,border:`1px solid ${C.border}`}}>Résiliation</Link>
        </div>
      </div>

      <div style={{maxWidth:620,margin:"0 auto",padding:"40px 24px"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"inline-block",background:C.goldBg,border:`1px solid ${C.gold}30`,borderRadius:20,padding:"4px 14px",fontFamily:F.m,fontSize:11,color:C.gold,marginBottom:16}}>Gratuit — PDF professionnel</div>
          <h1 style={{fontFamily:F.d,fontSize:"clamp(28px,5vw,44px)",fontWeight:400,lineHeight:1.1,marginBottom:12}}>
            État des lieux <span style={{fontStyle:"italic",color:C.gold}}>digital</span>
          </h1>
          <p style={{fontFamily:F.b,fontSize:14,color:C.sec,lineHeight:1.7,maxWidth:460,margin:"0 auto"}}>
            Grille d'inspection complète générée automatiquement selon le nombre de pièces. Prêt à imprimer.
          </p>
        </div>

        {!done ? (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Type */}
            <div>
              <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Type</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[{v:"entry",l:"📥 Entrée"},{v:"exit",l:"📤 Sortie"}].map(t=>(
                  <button key={t.v} onClick={()=>u("type",t.v)} style={{padding:12,borderRadius:8,border:`1px solid ${f.type===t.v?C.gold+"50":C.border}`,background:f.type===t.v?C.goldBg:"transparent",color:f.type===t.v?C.gold:C.sec,cursor:"pointer",fontFamily:F.b,fontSize:13}}>{t.l}</button>
                ))}
              </div>
            </div>
            
            <Inp label="Date de l'état des lieux" value={f.date} k="date" type="date"/>
            <Inp label="Adresse du bien" value={f.propAddr} k="propAddr" ph="Grand-Rue 45"/>
            <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:10}}>
              <Inp label="NPA" value={f.propNPA} k="propNPA" ph="2800"/>
              <Inp label="Ville" value={f.propCity} k="propCity" ph="Delémont"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Inp label="Pièces" value={f.rooms} k="rooms" ph="3.5"/>
              <Inp label="Surface" value={f.area} k="area" ph="75" suf="m²"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Inp label="Propriétaire" value={f.ownerName} k="ownerName" ph="Nom du bailleur"/>
              <Inp label="Locataire" value={f.tenantName} k="tenantName" ph="Nom du locataire"/>
            </div>
            <div style={{display:"flex",gap:6}}>
              {[{k:"balcony",l:"Balcon"},{k:"cellar",l:"Cave"}].map(eq=>(
                <button key={eq.k} onClick={()=>u(eq.k,!f[eq.k])} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${f[eq.k]?C.gold+"50":C.border}`,background:f[eq.k]?C.goldBg:"transparent",color:f[eq.k]?C.gold:C.muted,cursor:"pointer",fontFamily:F.b,fontSize:12}}>{f[eq.k]?"✓ ":""}{eq.l}</button>
              ))}
            </div>

            {/* Preview sections */}
            <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,padding:14}}>
              <div style={{fontFamily:F.m,fontSize:10,color:C.muted,marginBottom:8}}>SECTIONS GÉNÉRÉES ({sections.length})</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {sections.map((s,i)=>(
                  <span key={i} style={{fontFamily:F.b,fontSize:11,color:C.sec,background:C.bgEl,padding:"4px 10px",borderRadius:6}}>{s}</span>
                ))}
              </div>
              <div style={{fontFamily:F.b,fontSize:10,color:C.muted,marginTop:8}}>Chaque section contient: sols, murs, plafond, fenêtres, portes, prises, éclairage + remarques</div>
            </div>

            <button onClick={generate} disabled={loading}
              style={{width:"100%",padding:"14px",background:`linear-gradient(135deg,${C.gold},#A07D2E)`,border:"none",borderRadius:10,color:C.bg,fontFamily:F.b,fontSize:14,fontWeight:600,cursor:loading?"wait":"pointer",opacity:loading?0.6:1}}>
              {loading?"⏳ Génération...":"📄 Générer l'état des lieux PDF"}
            </button>
          </div>
        ) : (
          <div style={{textAlign:"center"}}>
            <div style={{background:C.successBg,border:`2px solid ${C.success}40`,borderRadius:16,padding:32,marginBottom:24}}>
              <div style={{fontSize:48,marginBottom:12}}>✓</div>
              <h2 style={{fontFamily:F.d,fontSize:28,color:C.success,marginBottom:8}}>État des lieux généré !</h2>
              <p style={{fontFamily:F.b,fontSize:14,color:C.sec,lineHeight:1.6}}>{sections.length} sections, prêt à imprimer et compléter lors de la visite.</p>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
              <Link href="/outils/bail-gratuit" style={{display:"inline-block",background:C.goldBg,border:`1px solid ${C.gold}40`,borderRadius:8,padding:"10px 16px",fontFamily:F.b,fontSize:13,color:C.gold,textDecoration:"none",fontWeight:600}}>Générer le bail →</Link>
              <button onClick={()=>setDone(false)} style={{fontFamily:F.b,fontSize:12,color:C.muted,background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 16px",cursor:"pointer"}}>↺ Nouveau</button>
            </div>
          </div>
        )}

        <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:40,paddingTop:24,borderTop:`1px solid ${C.border}`}}>
          {[{t:"Gratuit",s:"Aucun frais"},{t:"Dynamique",s:"Selon vos pièces"},{t:"OBLF art. 258",s:"Conforme"}].map((x,i)=>(
            <div key={i} style={{textAlign:"center"}}><div style={{fontFamily:F.b,fontSize:12,fontWeight:600}}>{x.t}</div><div style={{fontFamily:F.b,fontSize:10,color:C.muted}}>{x.s}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
