"use client";
import { useState } from "react";
import Link from "next/link";

const C={bg:"#07060A",bgCard:"#0F0E14",bgEl:"#16151E",border:"#2A2838",gold:"#D4A853",goldBg:"rgba(212,168,83,0.08)",text:"#F0EDE6",sec:"#9B97A8",muted:"#5E5A6E",success:"#34D399",successBg:"rgba(52,211,153,0.1)",danger:"#F87171",info:"#60A5FA",purple:"#A78BFA"};
const F={d:"'Cormorant Garamond',Georgia,serif",b:"'DM Sans',sans-serif",m:"'JetBrains Mono',monospace"};
const CANTONS=["JU","GE","VD","NE","FR","BE","VS","ZH","BS","LU","ZG","TI","SG","AG","SO","TG","GR","BL","SH","NW","SZ","OW","AR","AI","UR","GL"];

export default function CalculateurLoyer() {
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [currentRent,setCurrentRent]=useState("");
  const [f,setF]=useState({canton:"JU",city:"Delémont",rooms:"3.5",area:"75",floor:"2",balcony:true,parking:false,renovated:false});
  const u=(k,v)=>setF({...f,[k]:v});
  
  const estimate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/estimate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});
      const data = await res.json();
      setResult(data);
    } catch(e){console.error(e)}
    setLoading(false);
  };
  
  const isOverpaying = result && currentRent && Number(currentRent) > result.max;
  const saving = isOverpaying ? Number(currentRent) - result.median : 0;

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.gold}30}@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      
      <div style={{padding:"16px 32px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <Link href="/" style={{textDecoration:"none"}}><span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.text}}>immo</span><span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.gold}}>.</span><span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.text}}>cool</span></Link>
        <div style={{display:"flex",gap:6}}>
          <Link href="/outils/contestation" style={{fontFamily:F.b,fontSize:11,color:C.sec,textDecoration:"none",padding:"5px 10px",borderRadius:6,border:`1px solid ${C.border}`}}>Contestation</Link>
          <Link href="/outils/bail-gratuit" style={{fontFamily:F.b,fontSize:11,color:C.sec,textDecoration:"none",padding:"5px 10px",borderRadius:6,border:`1px solid ${C.border}`}}>Bail gratuit</Link>
        </div>
      </div>

      <div style={{maxWidth:580,margin:"0 auto",padding:"40px 24px"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"inline-block",background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.3)",borderRadius:20,padding:"4px 14px",fontFamily:F.m,fontSize:11,color:C.purple,marginBottom:16}}>Propulsé par IA</div>
          <h1 style={{fontFamily:F.d,fontSize:"clamp(28px,5vw,44px)",fontWeight:400,lineHeight:1.1,marginBottom:12}}>
            Quel est le <span style={{fontStyle:"italic",color:C.gold}}>juste loyer</span> ?
          </h1>
          <p style={{fontFamily:F.b,fontSize:14,color:C.sec,lineHeight:1.7,maxWidth:440,margin:"0 auto"}}>
            Estimation basée sur le marché suisse, les données cantonales et l'IA. Gratuit et instantané.
          </p>
        </div>

        {/* Form */}
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:24}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Canton</label>
              <select value={f.canton} onChange={e=>u("canton",e.target.value)} style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontFamily:F.b,fontSize:14,color:C.text,outline:"none"}}>
                {CANTONS.map(c=><option key={c} value={c} style={{background:C.bg}}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Ville</label>
              <input value={f.city} onChange={e=>u("city",e.target.value)} placeholder="Delémont" style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontFamily:F.b,fontSize:14,color:C.text,outline:"none"}}/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {[{l:"Pièces",k:"rooms",ph:"3.5"},{l:"Surface m²",k:"area",ph:"75"},{l:"Étage",k:"floor",ph:"2"}].map(x=>(
              <div key={x.k}>
                <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>{x.l}</label>
                <input value={f[x.k]} onChange={e=>u(x.k,e.target.value)} placeholder={x.ph} type="number" style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontFamily:F.b,fontSize:14,color:C.text,outline:"none"}}/>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {[{k:"balcony",l:"Balcon"},{k:"parking",l:"Parking"},{k:"renovated",l:"Rénové"}].map(eq=>(
              <button key={eq.k} onClick={()=>u(eq.k,!f[eq.k])} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${f[eq.k]?C.gold+"50":C.border}`,background:f[eq.k]?C.goldBg:"transparent",color:f[eq.k]?C.gold:C.muted,cursor:"pointer",fontFamily:F.b,fontSize:12}}>{f[eq.k]?"✓ ":""}{eq.l}</button>
            ))}
          </div>
        </div>

        <button onClick={estimate} disabled={loading}
          style={{width:"100%",padding:"14px",background:`linear-gradient(135deg,${C.purple},${C.gold})`,border:"none",borderRadius:10,color:C.bg,fontFamily:F.b,fontSize:14,fontWeight:600,cursor:loading?"wait":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          {loading?<><span style={{display:"flex",gap:3}}>{[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:3,background:C.bg,animation:`pulse 1s ${i*.15}s infinite`}}/>)}</span> Analyse IA...</>:"✨ Estimer le loyer juste"}
        </button>

        {/* Results */}
        {result&&<div style={{marginTop:28}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
            {[{l:"Minimum",v:result.min,c:C.info},{l:"Médian",v:result.median,c:C.gold},{l:"Maximum",v:result.max,c:C.purple}].map((x,i)=>(
              <div key={i} style={{background:C.bgCard,border:`1px solid ${x.c}20`,borderRadius:12,padding:16,textAlign:"center"}}>
                <div style={{fontFamily:F.b,fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em"}}>{x.l}</div>
                <div style={{fontFamily:F.d,fontSize:32,fontWeight:600,color:x.c,margin:"8px 0 2px"}}>CHF {x.v?.toLocaleString("fr-CH")}</div>
                <div style={{fontFamily:F.b,fontSize:10,color:C.muted}}>/mois net</div>
              </div>
            ))}
          </div>
          <div style={{fontFamily:F.b,fontSize:12,color:C.muted,marginBottom:4}}>+ CHF {result.charges} charges estimées/mois</div>
          <div style={{fontFamily:F.b,fontSize:13,color:C.sec,lineHeight:1.6,marginTop:8}}>{result.explanation}</div>
          {result.comparable&&<div style={{fontFamily:F.b,fontSize:12,color:C.muted,marginTop:6,fontStyle:"italic"}}>{result.comparable}</div>}

          {/* Compare with current rent */}
          <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginTop:20}}>
            <div style={{fontFamily:F.b,fontSize:13,fontWeight:600,marginBottom:10}}>Comparer avec votre loyer actuel</div>
            <div style={{display:"flex",gap:8,alignItems:"end"}}>
              <div style={{flex:1}}>
                <label style={{fontFamily:F.b,fontSize:12,color:C.sec,marginBottom:4,display:"block"}}>Loyer actuel</label>
                <input value={currentRent} onChange={e=>setCurrentRent(e.target.value)} placeholder="1400" type="number"
                  style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontFamily:F.m,fontSize:16,color:C.text,outline:"none"}}/>
              </div>
              <div style={{fontFamily:F.m,fontSize:14,color:C.muted,paddingBottom:10}}>CHF/mois</div>
            </div>
            {currentRent&&<div style={{marginTop:12}}>
              {isOverpaying ? (
                <div style={{background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:10,padding:14}}>
                  <div style={{fontFamily:F.b,fontSize:14,fontWeight:600,color:C.danger,marginBottom:4}}>
                    ⚠️ Vous payez ~CHF {saving}/mois de trop
                  </div>
                  <div style={{fontFamily:F.b,fontSize:12,color:C.sec}}>Soit CHF {saving*12}/an. Vous pourriez contester.</div>
                  <Link href="/outils/contestation" style={{display:"inline-block",marginTop:10,background:`linear-gradient(135deg,${C.danger},#B91C1C)`,borderRadius:8,padding:"8px 16px",fontFamily:F.b,fontSize:12,color:"#fff",textDecoration:"none",fontWeight:600}}>
                    Analyser mon bail →
                  </Link>
                </div>
              ) : Number(currentRent) < result.min ? (
                <div style={{background:C.successBg,border:`1px solid ${C.success}20`,borderRadius:10,padding:14}}>
                  <div style={{fontFamily:F.b,fontSize:14,color:C.success}}>✓ Bon prix — en dessous du marché</div>
                </div>
              ) : (
                <div style={{background:C.successBg,border:`1px solid ${C.success}20`,borderRadius:10,padding:14}}>
                  <div style={{fontFamily:F.b,fontSize:14,color:C.success}}>✓ Loyer conforme au marché</div>
                </div>
              )}
            </div>}
          </div>
        </div>}

        <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:40,paddingTop:24,borderTop:`1px solid ${C.border}`}}>
          {[{t:"IA",s:"Claude + données marché"},{t:"26 cantons",s:"Prix locaux"},{t:"Gratuit",s:"Aucun frais"}].map((x,i)=>(
            <div key={i} style={{textAlign:"center"}}><div style={{fontFamily:F.b,fontSize:12,fontWeight:600}}>{x.t}</div><div style={{fontFamily:F.b,fontSize:10,color:C.muted}}>{x.s}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
