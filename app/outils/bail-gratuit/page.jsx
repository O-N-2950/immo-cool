"use client";
import { useState } from "react";
import Link from "next/link";

const C={bg:"#07060A",bgCard:"#0F0E14",bgEl:"#16151E",border:"#2A2838",gold:"#D4A853",goldBg:"rgba(212,168,83,0.08)",text:"#F0EDE6",sec:"#9B97A8",muted:"#5E5A6E",success:"#34D399",successBg:"rgba(52,211,153,0.1)",danger:"#F87171",dangerBg:"rgba(248,113,113,0.1)"};
const F={d:"'Cormorant Garamond',Georgia,serif",b:"'DM Sans',sans-serif",m:"'JetBrains Mono',monospace"};

const CANTONS=[
  {v:"JU",l:"Jura",form:false},{v:"GE",l:"Genève",form:true},{v:"VD",l:"Vaud",form:true},{v:"NE",l:"Neuchâtel",form:true},
  {v:"FR",l:"Fribourg",form:true},{v:"BE",l:"Berne",form:false},{v:"VS",l:"Valais",form:false},{v:"ZH",l:"Zurich",form:true},
  {v:"BS",l:"Bâle-Ville",form:false},{v:"LU",l:"Lucerne",form:false},{v:"ZG",l:"Zoug",form:true},{v:"TI",l:"Tessin",form:false},
  {v:"SG",l:"St-Gall",form:false},{v:"AG",l:"Argovie",form:false},{v:"SO",l:"Soleure",form:false},{v:"TG",l:"Thurgovie",form:false},
  {v:"GR",l:"Grisons",form:false},{v:"BL",l:"Bâle-Camp.",form:false},{v:"SH",l:"Schaffhouse",form:false},{v:"NW",l:"Nidwald",form:true},
  {v:"SZ",l:"Schwyz",form:false},{v:"OW",l:"Obwald",form:false},{v:"AR",l:"Appenzell RE",form:false},{v:"AI",l:"Appenzell RI",form:false},
  {v:"UR",l:"Uri",form:false},{v:"GL",l:"Glaris",form:false},
];

const Header = () => (
  <div style={{padding:"16px 32px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
    <Link href="/" style={{display:"flex",alignItems:"center",textDecoration:"none"}}>
      <span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.text}}>immo</span><span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.gold}}>.</span><span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.text}}>cool</span>
    </Link>
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      {[{h:"/outils/contestation",l:"Contestation loyer"},{h:"/outils/resiliation",l:"Résiliation"},{h:"/outils/calculateur-loyer",l:"Calculateur"}].map(x=>(
        <Link key={x.h} href={x.h} style={{fontFamily:F.b,fontSize:11,color:C.sec,textDecoration:"none",padding:"5px 10px",borderRadius:6,border:`1px solid ${C.border}`}}>{x.l}</Link>
      ))}
    </div>
  </div>
);

const Inp=({label,value,onChange,ph,suf,type="text",note})=>(
  <div style={{display:"flex",flexDirection:"column",gap:4}}>
    <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500}}>{label}</label>
    <div style={{position:"relative"}}>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={ph}
        style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:`9px ${suf?"52px":"14px"} 9px 14px`,fontFamily:F.b,fontSize:14,color:C.text,outline:"none",transition:"border-color 0.2s"}}
        onFocus={e=>e.target.style.borderColor=C.gold+"80"} onBlur={e=>e.target.style.borderColor=C.border}/>
      {suf&&<span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontFamily:F.m,fontSize:11,color:C.muted}}>{suf}</span>}
    </div>
    {note&&<span style={{fontFamily:F.b,fontSize:10,color:C.muted,fontStyle:"italic"}}>{note}</span>}
  </div>
);

const Toggle=({label,active,onClick})=>(
  <button onClick={onClick} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${active?C.gold+"50":C.border}`,background:active?C.goldBg:"transparent",color:active?C.gold:C.muted,cursor:"pointer",fontFamily:F.b,fontSize:12,transition:"all 0.2s"}}>
    {active?"✓ ":""}{label}
  </button>
);

const Btn=({children,onClick,disabled,variant="primary",full})=>{
  const styles = {
    primary:{background:`linear-gradient(135deg,${C.gold},#A07D2E)`,color:C.bg,border:"none"},
    secondary:{background:"transparent",color:C.sec,border:`1px solid ${C.border}`},
    danger:{background:`linear-gradient(135deg,${C.danger},#B91C1C)`,color:"#fff",border:"none"},
  };
  const s = styles[variant];
  return <button onClick={onClick} disabled={disabled} style={{...s,padding:"13px 24px",borderRadius:10,fontFamily:F.b,fontSize:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.4:1,transition:"opacity 0.2s",width:full?"100%":"auto"}} onMouseEnter={e=>{if(!disabled)e.currentTarget.style.opacity="0.85"}} onMouseLeave={e=>{if(!disabled)e.currentTarget.style.opacity="1"}}>{children}</button>;
};

export default function BailGratuit() {
  const [step,setStep]=useState(1);
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(false);
  const [email,setEmail]=useState("");
  const [f,setF]=useState({
    canton:"JU",type:"habitation",
    ownerName:"",ownerAddr:"",ownerNPA:"",ownerCity:"",
    propAddr:"",propNPA:"",propCity:"",rooms:"3.5",floor:"",area:"",
    balcony:false,parking:false,cellar:false,laundry:false,
    rent:"",charges:"",chargesType:"forfait",deposit:"3",
    startDate:"",duration:"indefini",termination:"3",
    prevRent:"",prevRentReason:"",
    tenantName:"",tenantAddr:"",tenantNPA:"",tenantCity:"",tenantNat:"",tenantPermit:"CH",
  });
  const u=(k,v)=>setF({...f,[k]:v});
  const canton = CANTONS.find(c=>c.v===f.canton);
  
  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tools/generate-bail",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});
      if(res.ok){
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a=document.createElement("a"); a.href=url; a.download=`bail-${f.canton}-${f.propCity||"loyer"}-${Date.now()}.pdf`; a.click();
        URL.revokeObjectURL(url);
        setDone(true);
      }
    } catch(e){console.error(e)}
    setLoading(false);
  };

  const checks = [
    {ok:!!f.ownerName,t:f.ownerName?`Bailleur: ${f.ownerName}`:"Bailleur non renseigné"},
    {ok:!!f.propAddr,t:f.propAddr?`Objet: ${f.propAddr}, ${f.propNPA} ${f.propCity}`:"Adresse du bien manquante"},
    {ok:!!f.rent,t:f.rent?`Loyer: CHF ${f.rent} + ${f.charges||0} charges`:"Loyer non renseigné"},
    {ok:true,t:`Garantie: ${f.deposit} mois (max. 3 — art. 257e CO)`},
    {ok:true,t:`Taux hypo. 1.25% + IPC 107.1 — intégrés automatiquement`},
    {ok:!canton?.form||!!f.prevRent,t:canton?.form?(f.prevRent?`Formulaire loyer initial: loyer précédent CHF ${f.prevRent}`:"⚠️ Loyer précédent obligatoire dans ce canton"):"Formulaire loyer initial: non requis"},
    {ok:!!f.tenantName,t:f.tenantName?`Locataire: ${f.tenantName}`:"Locataire non renseigné"},
  ];
  const canGenerate = f.ownerName && f.propAddr && f.rent && f.tenantName && (!canton?.form || f.prevRent);

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.gold}30}`}</style>
      <Header/>
      <div style={{maxWidth:660,margin:"0 auto",padding:"40px 24px"}}>
        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"inline-block",background:C.goldBg,border:`1px solid ${C.gold}30`,borderRadius:20,padding:"4px 14px",fontFamily:F.m,fontSize:11,color:C.gold,marginBottom:16}}>100% gratuit — aucune inscription requise</div>
          <h1 style={{fontFamily:F.d,fontSize:"clamp(28px,5vw,44px)",fontWeight:400,lineHeight:1.1,marginBottom:12}}>
            Générez votre <span style={{fontStyle:"italic",color:C.gold}}>bail à loyer</span> conforme
          </h1>
          <p style={{fontFamily:F.b,fontSize:14,color:C.sec,lineHeight:1.7,maxWidth:460,margin:"0 auto"}}>
            Conforme aux 26 cantons. Taux hypothécaire et IPC intégrés. Formulaire de loyer initial inclus si requis. Sans avocat. Sans régie.
          </p>
        </div>
        
        {/* Progress */}
        <div style={{display:"flex",gap:3,marginBottom:6}}>
          {["Canton","Bailleur","Objet","Finances","Locataire","Vérification"].map((_,i)=>(
            <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<step?C.gold:C.border,transition:"background 0.3s"}}/>
          ))}
        </div>
        <div style={{fontFamily:F.m,fontSize:10,color:C.gold,marginBottom:24}}>Étape {step}/6</div>

        {/* ── STEP 1: Canton & Type ── */}
        {step===1&&<div>
          <h2 style={{fontFamily:F.d,fontSize:24,marginBottom:20}}>Canton & type de <span style={{color:C.gold,fontStyle:"italic"}}>bail</span></h2>
          <div style={{marginBottom:14}}>
            <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Canton</label>
            <select value={f.canton} onChange={e=>u("canton",e.target.value)} style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontFamily:F.b,fontSize:14,color:C.text,outline:"none",cursor:"pointer"}}>
              {CANTONS.map(c=><option key={c.v} value={c.v} style={{background:C.bg}}>{c.l} ({c.v})</option>)}
            </select>
          </div>
          {canton&&<div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:14}}>
            <div style={{fontFamily:F.b,fontSize:13,fontWeight:600,marginBottom:8}}>Règles — {canton.l}</div>
            <div style={{fontFamily:F.b,fontSize:12,color:C.sec}}>Formulaire loyer initial: <span style={{fontFamily:F.m,color:canton.form?C.gold:C.success}}>{canton.form?"Obligatoire":"Non requis"}</span></div>
          </div>}
          <div>
            <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Type</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{v:"habitation",l:"🏠 Habitation"},{v:"commercial",l:"🏢 Commercial"},{v:"garage",l:"🚗 Garage/parking"},{v:"attenant",l:"📦 Local attenant"}].map(t=>(
                <button key={t.v} onClick={()=>u("type",t.v)} style={{padding:12,borderRadius:8,border:`1px solid ${f.type===t.v?C.gold+"50":C.border}`,background:f.type===t.v?C.goldBg:"transparent",color:f.type===t.v?C.gold:C.sec,cursor:"pointer",fontFamily:F.b,fontSize:13,transition:"all 0.2s"}}>{t.l}</button>
              ))}
            </div>
          </div>
          <div style={{marginTop:24}}><Btn full onClick={()=>setStep(2)}>Continuer →</Btn></div>
        </div>}

        {/* ── STEP 2: Bailleur ── */}
        {step===2&&<div>
          <h2 style={{fontFamily:F.d,fontSize:24,marginBottom:20}}>Données du <span style={{color:C.gold,fontStyle:"italic"}}>bailleur</span></h2>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Inp label="Nom / Raison sociale" value={f.ownerName} onChange={v=>u("ownerName",v)} ph="Olivier Botteron"/>
            <Inp label="Adresse" value={f.ownerAddr} onChange={v=>u("ownerAddr",v)} ph="Rue de la Gare 12"/>
            <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:10}}>
              <Inp label="NPA" value={f.ownerNPA} onChange={v=>u("ownerNPA",v)} ph="2800"/>
              <Inp label="Ville" value={f.ownerCity} onChange={v=>u("ownerCity",v)} ph="Delémont"/>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:24}}>
            <Btn variant="secondary" onClick={()=>setStep(1)}>← Retour</Btn>
            <Btn full onClick={()=>setStep(3)}>Continuer →</Btn>
          </div>
        </div>}

        {/* ── STEP 3: Objet ── */}
        {step===3&&<div>
          <h2 style={{fontFamily:F.d,fontSize:24,marginBottom:20}}>Objet <span style={{color:C.gold,fontStyle:"italic"}}>loué</span></h2>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Inp label="Adresse du bien" value={f.propAddr} onChange={v=>u("propAddr",v)} ph="Grand-Rue 45"/>
            <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:10}}>
              <Inp label="NPA" value={f.propNPA} onChange={v=>u("propNPA",v)} ph="2900"/>
              <Inp label="Ville" value={f.propCity} onChange={v=>u("propCity",v)} ph="Porrentruy"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              <Inp label="Pièces" value={f.rooms} onChange={v=>u("rooms",v)} ph="3.5"/>
              <Inp label="Étage" value={f.floor} onChange={v=>u("floor",v)} ph="2"/>
              <Inp label="Surface" value={f.area} onChange={v=>u("area",v)} ph="75" suf="m²"/>
            </div>
            <div>
              <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Équipements</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <Toggle label="Balcon" active={f.balcony} onClick={()=>u("balcony",!f.balcony)}/>
                <Toggle label="Parking" active={f.parking} onClick={()=>u("parking",!f.parking)}/>
                <Toggle label="Cave" active={f.cellar} onClick={()=>u("cellar",!f.cellar)}/>
                <Toggle label="Buanderie" active={f.laundry} onClick={()=>u("laundry",!f.laundry)}/>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:24}}>
            <Btn variant="secondary" onClick={()=>setStep(2)}>← Retour</Btn>
            <Btn full onClick={()=>setStep(4)}>Continuer →</Btn>
          </div>
        </div>}

        {/* ── STEP 4: Finances ── */}
        {step===4&&<div>
          <h2 style={{fontFamily:F.d,fontSize:24,marginBottom:20}}>Conditions <span style={{color:C.gold,fontStyle:"italic"}}>financières</span></h2>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Inp label="Loyer mensuel net" value={f.rent} onChange={v=>u("rent",v)} type="number" suf="CHF"/>
              <Inp label="Charges mensuelles" value={f.charges} onChange={v=>u("charges",v)} type="number" suf="CHF"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Garantie de loyer</label>
                <select value={f.deposit} onChange={e=>u("deposit",e.target.value)} style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontFamily:F.b,fontSize:14,color:C.text,outline:"none"}}>
                  <option value="1" style={{background:C.bg}}>1 mois</option>
                  <option value="2" style={{background:C.bg}}>2 mois</option>
                  <option value="3" style={{background:C.bg}}>3 mois (maximum légal)</option>
                </select>
              </div>
              <Inp label="Date de début" value={f.startDate} onChange={v=>u("startDate",v)} type="date"/>
            </div>
            {canton?.form&&<div style={{background:C.goldBg,border:`1px solid ${C.gold}30`,borderRadius:10,padding:16}}>
              <div style={{fontFamily:F.b,fontSize:13,fontWeight:600,color:C.gold,marginBottom:10}}>⚠️ Formulaire de loyer initial requis — {canton.l}</div>
              <Inp label="Loyer du précédent locataire" value={f.prevRent} onChange={v=>u("prevRent",v)} type="number" suf="CHF" note="Obligatoire dans ce canton (OBLF art. 19)"/>
              {f.prevRent&&f.rent&&Number(f.rent)>Number(f.prevRent)&&<div style={{marginTop:10}}>
                <div style={{fontFamily:F.m,fontSize:11,color:C.danger,marginBottom:6}}>Hausse de {((Number(f.rent)-Number(f.prevRent))/Number(f.prevRent)*100).toFixed(1)}%</div>
                <Inp label="Motif de la hausse" value={f.prevRentReason} onChange={v=>u("prevRentReason",v)} ph="Travaux, adaptation au marché..."/>
              </div>}
            </div>}
            <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:10,padding:14}}>
              <div style={{fontFamily:F.m,fontSize:10,color:C.muted,marginBottom:4}}>INTÉGRÉ AUTOMATIQUEMENT</div>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                <span style={{fontFamily:F.m,fontSize:12}}>Taux hypo. <strong style={{color:C.gold}}>1.25%</strong></span>
                <span style={{fontFamily:F.m,fontSize:12}}>IPC <strong style={{color:C.gold}}>107.1</strong></span>
                <span style={{fontFamily:F.m,fontSize:12}}>OBLF <strong style={{color:C.gold}}>art. 12-13, 16, 19</strong></span>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:24}}>
            <Btn variant="secondary" onClick={()=>setStep(3)}>← Retour</Btn>
            <Btn full onClick={()=>setStep(5)}>Continuer →</Btn>
          </div>
        </div>}

        {/* ── STEP 5: Locataire ── */}
        {step===5&&<div>
          <h2 style={{fontFamily:F.d,fontSize:24,marginBottom:20}}>Données du <span style={{color:C.gold,fontStyle:"italic"}}>locataire</span></h2>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Inp label="Nom et prénom" value={f.tenantName} onChange={v=>u("tenantName",v)} ph="Sophie Müller"/>
            <Inp label="Adresse actuelle" value={f.tenantAddr} onChange={v=>u("tenantAddr",v)} ph="Rue actuelle"/>
            <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:10}}>
              <Inp label="NPA" value={f.tenantNPA} onChange={v=>u("tenantNPA",v)} ph="4000"/>
              <Inp label="Ville" value={f.tenantCity} onChange={v=>u("tenantCity",v)} ph="Bâle"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Inp label="Nationalité" value={f.tenantNat} onChange={v=>u("tenantNat",v)} ph="Suisse"/>
              <div>
                <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Permis</label>
                <select value={f.tenantPermit} onChange={e=>u("tenantPermit",e.target.value)} style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontFamily:F.b,fontSize:14,color:C.text,outline:"none"}}>
                  {["CH","C","B","L","G","F","N","Autre"].map(p=><option key={p} value={p} style={{background:C.bg}}>{p==="CH"?"Citoyen suisse":`Permis ${p}`}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:24}}>
            <Btn variant="secondary" onClick={()=>setStep(4)}>← Retour</Btn>
            <Btn full onClick={()=>setStep(6)}>Vérification finale →</Btn>
          </div>
        </div>}

        {/* ── STEP 6: Vérification & Génération ── */}
        {step===6&&!done&&<div>
          <h2 style={{fontFamily:F.d,fontSize:24,marginBottom:20}}>Vérification <span style={{color:C.gold,fontStyle:"italic"}}>finale</span></h2>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:24}}>
            {checks.map((c,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:c.ok?C.successBg:C.dangerBg,borderRadius:8,border:`1px solid ${c.ok?C.success+"20":C.danger+"20"}`}}>
                <span style={{fontFamily:F.b,fontSize:12,color:c.ok?C.success:C.danger}}>{c.ok?"✓":"✗"} {c.t}</span>
              </div>
            ))}
          </div>
          {f.rent&&<div style={{background:C.bgCard,border:`1px solid ${C.gold}20`,borderRadius:10,padding:14,marginBottom:20}}>
            <div style={{fontFamily:F.b,fontSize:12,color:C.muted,marginBottom:4}}>Commission immo.cool (si publié sur la plateforme)</div>
            <div style={{fontFamily:F.m,fontSize:18,color:C.gold}}>CHF {(Number(f.rent)*0.5).toFixed(0)} <span style={{fontSize:11,color:C.muted}}>= 50% du 1er loyer (uniquement si locataire trouvé)</span></div>
          </div>}
          <div style={{display:"flex",gap:8}}>
            <Btn variant="secondary" onClick={()=>setStep(5)}>← Retour</Btn>
            <Btn full onClick={generate} disabled={!canGenerate||loading}>
              {loading?"⏳ Génération en cours...":"📄 Générer le bail PDF"}
            </Btn>
          </div>
        </div>}

        {/* ── DONE ── */}
        {done&&<div style={{textAlign:"center"}}>
          <div style={{background:C.successBg,border:`2px solid ${C.success}40`,borderRadius:16,padding:32,marginBottom:24}}>
            <div style={{fontSize:48,marginBottom:12}}>✓</div>
            <h2 style={{fontFamily:F.d,fontSize:28,color:C.success,marginBottom:8}}>Bail généré avec succès !</h2>
            <p style={{fontFamily:F.b,fontSize:14,color:C.sec,lineHeight:1.6}}>
              Votre bail conforme au canton {canton?.l} a été téléchargé.<br/>
              Taux hypothécaire 1.25% et IPC 107.1 intégrés.{canton?.form?" Formulaire de loyer initial inclus.":""}
            </p>
          </div>
          <div style={{background:C.goldBg,border:`1px solid ${C.gold}30`,borderRadius:12,padding:20,marginBottom:20}}>
            <div style={{fontFamily:F.d,fontSize:20,marginBottom:8}}>Publiez ce bien sur <span style={{color:C.gold}}>immo.cool</span></div>
            <p style={{fontFamily:F.b,fontSize:13,color:C.sec,marginBottom:14}}>Matching IA avec locataires qualifiés. Vous ne payez que si on trouve votre locataire.</p>
            <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="votre@email.ch" style={{background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontFamily:F.b,fontSize:13,color:C.text,outline:"none",width:240}}/>
              <Btn onClick={()=>{}}>Publier ce bien →</Btn>
            </div>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
            <Link href="/outils/etat-des-lieux" style={{fontFamily:F.b,fontSize:12,color:C.sec,textDecoration:"none",padding:"8px 16px",borderRadius:8,border:`1px solid ${C.border}`}}>Générer l'état des lieux →</Link>
            <button onClick={()=>{setStep(1);setDone(false)}} style={{fontFamily:F.b,fontSize:12,color:C.muted,background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 16px",cursor:"pointer"}}>↺ Nouveau bail</button>
          </div>
        </div>}

        {/* Trust */}
        <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:40,paddingTop:24,borderTop:`1px solid ${C.border}`}}>
          {[{t:"Gratuit",s:"Aucun frais"},{t:"26 cantons",s:"Conformité totale"},{t:"Droit suisse",s:"CO + OBLF à jour"}].map((x,i)=>(
            <div key={i} style={{textAlign:"center"}}><div style={{fontFamily:F.b,fontSize:12,fontWeight:600,color:C.text}}>{x.t}</div><div style={{fontFamily:F.b,fontSize:10,color:C.muted}}>{x.s}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
