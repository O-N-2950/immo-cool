"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const C={bg:"#07060A",bgCard:"#0F0E14",bgEl:"#16151E",border:"#2A2838",gold:"#D4A853",goldBg:"rgba(212,168,83,0.08)",text:"#F0EDE6",sec:"#9B97A8",muted:"#5E5A6E",success:"#34D399",successBg:"rgba(52,211,153,0.1)",danger:"#F87171",info:"#60A5FA",purple:"#A78BFA"};
const F={d:"'Cormorant Garamond',Georgia,serif",b:"'DM Sans',sans-serif",m:"'JetBrains Mono',monospace"};
const CANTONS=["JU","GE","VD","NE","FR","BE","VS","ZH","BS","LU","ZG","TI","SG","AG","SO","TG","GR","BL","SH","NW","SZ","OW","AR","AI","UR","GL"];

// Données de secours si l'API ne retourne rien (première visite, DB vide)
const FALLBACK_DEMANDS = [
  {id:"f1",rooms:3.5,city:"Delémont",canton:"JU",maxBudget:1350,description:"Couple, 2 CDI, revenus 8'500/mois. Cherchons pour avril 2026.",createdAt:"2026-02-20",verified:true},
  {id:"f2",rooms:4.5,city:"Porrentruy",canton:"JU",maxBudget:1600,description:"Famille avec 1 enfant. Recherchons proche école. Disponibles dès mai.",createdAt:"2026-02-18",verified:true},
  {id:"f3",rooms:2.5,city:"Delémont",canton:"JU",maxBudget:950,description:"Étudiant HES, garant parental. Dès septembre 2026.",createdAt:"2026-02-22",verified:false},
  {id:"f4",rooms:3.5,city:"Saignelégier",canton:"JU",maxBudget:1200,description:"Personne seule, CDI industrie horlogère, revenus stables.",createdAt:"2026-02-15",verified:true},
  {id:"f5",rooms:5.5,city:"Delémont",canton:"JU",maxBudget:2200,description:"Famille 2 enfants, double CDI. Parking obligatoire. Dès juillet.",createdAt:"2026-02-21",verified:true},
  {id:"f6",rooms:2.5,city:"Genève",canton:"GE",maxBudget:1800,description:"Jeune professionnel, CDI banque privée. Cherche Eaux-Vives ou Plainpalais.",createdAt:"2026-02-19",verified:true},
  {id:"f7",rooms:3.5,city:"Lausanne",canton:"VD",maxBudget:1900,description:"Couple sans enfant, 2 CDI tech. Proche transports.",createdAt:"2026-02-17",verified:true},
  {id:"f8",rooms:4.5,city:"Bienne",canton:"BE",maxBudget:1500,description:"Famille bilingue FR/DE, CDI. Quartier calme souhaité.",createdAt:"2026-02-23",verified:true},
];

const DemandCard = ({d, isOwner}) => (
  <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:12,padding:18,transition:"border-color 0.2s"}}
    onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold+"40"}
    onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:10}}>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <span style={{fontFamily:F.d,fontSize:24,fontWeight:600,color:C.gold}}>{d.rooms}p</span>
        <span style={{fontFamily:F.b,fontSize:13,color:C.sec}}>— {d.city} ({d.canton})</span>
        {d.verified && <span style={{background:C.successBg,borderRadius:10,padding:"2px 8px",fontFamily:F.m,fontSize:9,color:C.success}}>✓ vérifié</span>}
      </div>
      <span style={{fontFamily:F.m,fontSize:18,fontWeight:700,color:C.text}}>max {Number(d.maxBudget).toLocaleString("fr-CH")} <span style={{fontSize:10,fontWeight:400,color:C.muted}}>CHF/mois</span></span>
    </div>
    <p style={{fontFamily:F.b,fontSize:13,color:C.sec,lineHeight:1.6,marginBottom:10}}>{d.description}</p>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontFamily:F.m,fontSize:10,color:C.muted}}>{new Date(d.createdAt).toLocaleDateString("fr-CH")}</span>
      {isOwner && <button style={{padding:"6px 14px",background:C.goldBg,border:`1px solid ${C.gold}30`,borderRadius:6,fontFamily:F.b,fontSize:11,color:C.gold,cursor:"pointer",fontWeight:600}}>Proposer mon bien →</button>}
    </div>
  </div>
);

export default function Demande() {
  const [mode,setMode]=useState("browse"); // browse | post | owner
  const [filter,setFilter]=useState({canton:"",rooms:"",maxRent:""});
  const [demands,setDemands]=useState([]);
  const [loading,setLoading]=useState(true);
  const [posting,setPosting]=useState(false);
  const [posted,setPosted]=useState(false);
  const [postError,setPostError]=useState("");
  const [form,setForm]=useState({rooms:"3.5",city:"",canton:"JU",maxRent:"",desc:"",email:"",phone:""});
  const uf=(k,v)=>setForm({...form,[k]:v});
  
  // Fetch demands from API (fallback to seed data)
  useEffect(()=>{
    const params = new URLSearchParams();
    if(filter.canton) params.set("canton", filter.canton);
    if(filter.rooms) params.set("rooms", filter.rooms);
    fetch(`/api/reverse?${params}`)
      .then(r=>r.json())
      .then(data=>{
        if(data.requests && data.requests.length > 0) {
          setDemands(data.requests);
        } else {
          // Fallback: filtrer les données de démo
          const f = FALLBACK_DEMANDS.filter(d => {
            if(filter.canton && d.canton !== filter.canton) return false;
            if(filter.rooms && d.rooms !== parseFloat(filter.rooms)) return false;
            return true;
          });
          setDemands(f);
        }
      })
      .catch(()=>setDemands(FALLBACK_DEMANDS))
      .finally(()=>setLoading(false));
  },[filter.canton, filter.rooms]);
  
  const handlePost = async () => {
    setPosting(true);
    setPostError("");
    try {
      const res = await fetch("/api/reverse", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email: form.email,
          phone: form.phone || null,
          firstName: null,
          canton: form.canton,
          city: form.city,
          rooms: parseFloat(form.rooms),
          maxBudget: parseFloat(form.maxRent),
          description: form.desc,
        }),
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || "Erreur serveur");
      setPosted(true);
    } catch(e) {
      setPostError(e.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.gold}30}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      
      {/* Header */}
      <div style={{padding:"16px 32px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <Link href="/" style={{textDecoration:"none"}}><span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.text}}>immo</span><span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.gold}}>.</span><span style={{fontFamily:F.d,fontSize:22,fontWeight:600,color:C.text}}>cool</span></Link>
        <div style={{display:"flex",gap:6}}>
          <Link href="/outils/bail-gratuit" style={{fontFamily:F.b,fontSize:11,color:C.sec,textDecoration:"none",padding:"5px 10px",borderRadius:6,border:`1px solid ${C.border}`}}>Bail gratuit</Link>
          <Link href="/outils/contestation" style={{fontFamily:F.b,fontSize:11,color:C.sec,textDecoration:"none",padding:"5px 10px",borderRadius:6,border:`1px solid ${C.border}`}}>Contestation</Link>
        </div>
      </div>

      <div style={{maxWidth:800,margin:"0 auto",padding:"40px 24px"}}>
        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{display:"inline-block",background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.3)",borderRadius:20,padding:"4px 14px",fontFamily:F.m,fontSize:11,color:C.purple,marginBottom:16}}>Nouveau concept — unique en Suisse</div>
          <h1 style={{fontFamily:F.d,fontSize:"clamp(28px,5vw,42px)",fontWeight:400,lineHeight:1.1,marginBottom:12}}>
            Des locataires <span style={{fontStyle:"italic",color:C.gold}}>cherchent activement</span>
          </h1>
          <p style={{fontFamily:F.b,fontSize:15,color:C.sec,lineHeight:1.7,maxWidth:520,margin:"0 auto"}}>
            Locataires qualifiés qui publient leurs critères. Propriétaires : proposez votre bien directement aux bonnes personnes.
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{display:"flex",gap:4,background:C.bgCard,borderRadius:10,padding:4,marginBottom:28}}>
          {[{v:"browse",l:"👀 Voir les demandes",s:"Propriétaire"},{v:"post",l:"📝 Publier ma recherche",s:"Locataire"}].map(m=>(
            <button key={m.v} onClick={()=>{setMode(m.v);setPosted(false)}} style={{flex:1,padding:"12px 16px",borderRadius:8,border:"none",background:mode===m.v?C.goldBg:"transparent",color:mode===m.v?C.gold:C.muted,cursor:"pointer",fontFamily:F.b,fontSize:13,fontWeight:mode===m.v?600:400,transition:"all 0.2s"}}>
              {m.l}<br/><span style={{fontSize:10,fontWeight:400}}>{m.s}</span>
            </button>
          ))}
        </div>

        {/* ── BROWSE MODE (for owners) ── */}
        {mode==="browse"&&<div>
          {/* Stats bar */}
          <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
            {[
              {v:demands.length,l:"demandes actives"},
              {v:demands.filter(d=>d.verified).length,l:"profils vérifiés"},
              {v:[...new Set(demands.map(d=>d.canton))].length,l:"cantons"},
            ].map((s,i)=>(
              <div key={i} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 14px",display:"flex",gap:6,alignItems:"baseline"}}>
                <span style={{fontFamily:F.m,fontSize:18,fontWeight:700,color:C.gold}}>{s.v}</span>
                <span style={{fontFamily:F.b,fontSize:11,color:C.muted}}>{s.l}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
            <select value={filter.canton} onChange={e=>setFilter({...filter,canton:e.target.value})} style={{background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",fontFamily:F.b,fontSize:12,color:C.text,outline:"none"}}>
              <option value="" style={{background:C.bg}}>Tous les cantons</option>
              {CANTONS.map(c=><option key={c} value={c} style={{background:C.bg}}>{c}</option>)}
            </select>
            <select value={filter.rooms} onChange={e=>setFilter({...filter,rooms:e.target.value})} style={{background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",fontFamily:F.b,fontSize:12,color:C.text,outline:"none"}}>
              <option value="" style={{background:C.bg}}>Toutes tailles</option>
              {["1.5","2.5","3.5","4.5","5.5"].map(r=><option key={r} value={r} style={{background:C.bg}}>{r} pièces</option>)}
            </select>
          </div>

          {/* Demand cards */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {loading ? <div style={{textAlign:"center",padding:40,color:C.muted,fontFamily:F.b}}>⏳ Chargement...</div> :
             demands.map(d=><DemandCard key={d.id} d={d} isOwner={true}/>)}
            {!loading && demands.length===0&&<div style={{textAlign:"center",padding:40,color:C.muted,fontFamily:F.b}}>Aucune demande pour ces critères.</div>}
          </div>

          {/* CTA for owners */}
          <div style={{background:`linear-gradient(135deg,${C.goldBg},rgba(167,139,250,0.05))`,border:`1px solid ${C.gold}25`,borderRadius:16,padding:24,marginTop:28,textAlign:"center"}}>
            <h3 style={{fontFamily:F.d,fontSize:22,marginBottom:8}}>Vous avez un bien à louer ?</h3>
            <p style={{fontFamily:F.b,fontSize:13,color:C.sec,marginBottom:16,lineHeight:1.6}}>
              Ces locataires sont pré-qualifiés et cherchent activement. Publiez votre bien gratuitement — vous ne payez que si ça matche.
            </p>
            <Link href="/" style={{display:"inline-block",background:`linear-gradient(135deg,${C.gold},#A07D2E)`,borderRadius:10,padding:"12px 28px",fontFamily:F.b,fontSize:14,color:C.bg,textDecoration:"none",fontWeight:600}}>
              Publier mon bien gratuitement →
            </Link>
          </div>
        </div>}

        {/* ── POST MODE (for tenants) ── */}
        {mode==="post"&&!posted&&<div>
          <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:24}}>
            <h2 style={{fontFamily:F.d,fontSize:22,marginBottom:4}}>Publiez votre <span style={{color:C.gold,fontStyle:"italic"}}>recherche</span></h2>
            <p style={{fontFamily:F.b,fontSize:12,color:C.muted,marginBottom:20}}>100% gratuit. Les propriétaires verront votre demande et pourront vous proposer leur bien.</p>
            
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                <div>
                  <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Pièces</label>
                  <select value={form.rooms} onChange={e=>uf("rooms",e.target.value)} style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px",fontFamily:F.b,fontSize:14,color:C.text,outline:"none"}}>
                    {["1.5","2.5","3.5","4.5","5.5","6.5"].map(r=><option key={r} value={r} style={{background:C.bg}}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Canton</label>
                  <select value={form.canton} onChange={e=>uf("canton",e.target.value)} style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px",fontFamily:F.b,fontSize:14,color:C.text,outline:"none"}}>
                    {CANTONS.map(c=><option key={c} value={c} style={{background:C.bg}}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Ville</label>
                  <input value={form.city} onChange={e=>uf("city",e.target.value)} placeholder="Delémont" style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px",fontFamily:F.b,fontSize:14,color:C.text,outline:"none"}}/>
                </div>
              </div>
              
              <div>
                <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Budget maximum</label>
                <div style={{position:"relative"}}>
                  <input value={form.maxRent} onChange={e=>uf("maxRent",e.target.value)} placeholder="1400" type="number" style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 70px 10px 14px",fontFamily:F.m,fontSize:16,color:C.text,outline:"none"}}/>
                  <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontFamily:F.m,fontSize:11,color:C.muted}}>CHF/mois</span>
                </div>
              </div>
              
              <div>
                <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Décrivez votre profil & besoins</label>
                <textarea value={form.desc} onChange={e=>uf("desc",e.target.value)} placeholder="Ex: Couple, 2 CDI, revenus 8'500/mois. Cherchons pour avril 2026. Proche transports si possible."
                  rows={3} style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontFamily:F.b,fontSize:14,color:C.text,outline:"none",resize:"vertical",lineHeight:1.6}}/>
                <span style={{fontFamily:F.b,fontSize:10,color:C.muted}}>Plus votre profil est complet, plus les propriétaires vous contacteront. Mentionnez: situation pro, revenus, disponibilité, préférences.</span>
              </div>
              
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Email</label>
                  <input value={form.email} onChange={e=>uf("email",e.target.value)} placeholder="votre@email.ch" type="email" style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px",fontFamily:F.b,fontSize:14,color:C.text,outline:"none"}}/>
                </div>
                <div>
                  <label style={{fontFamily:F.b,fontSize:12,color:C.sec,fontWeight:500,marginBottom:6,display:"block"}}>Téléphone (optionnel)</label>
                  <input value={form.phone} onChange={e=>uf("phone",e.target.value)} placeholder="+41 79 000 00 00" type="tel" style={{width:"100%",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px",fontFamily:F.b,fontSize:14,color:C.text,outline:"none"}}/>
                </div>
              </div>
            </div>
            
            <button onClick={handlePost} disabled={posting||!form.email||!form.maxRent||!form.city}
              style={{width:"100%",marginTop:20,padding:"14px",background:form.email&&form.maxRent&&form.city?`linear-gradient(135deg,${C.gold},#A07D2E)`:"#333",border:"none",borderRadius:10,color:C.bg,fontFamily:F.b,fontSize:14,fontWeight:600,cursor:form.email&&form.maxRent&&form.city?"pointer":"not-allowed",opacity:posting?0.6:1}}>
              {posting?"⏳ Publication...":"📣 Publier ma recherche gratuitement"}
            </button>
            {postError && <div style={{marginTop:10,padding:"10px 14px",background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:8,fontFamily:F.b,fontSize:12,color:C.danger}}>{postError}</div>}
          </div>
        </div>}

        {/* Posted success */}
        {mode==="post"&&posted&&<div style={{textAlign:"center"}}>
          <div style={{background:C.successBg,border:`2px solid ${C.success}40`,borderRadius:16,padding:32,marginBottom:24,animation:"fadeIn 0.4s ease"}}>
            <div style={{fontSize:48,marginBottom:12}}>🎉</div>
            <h2 style={{fontFamily:F.d,fontSize:28,color:C.success,marginBottom:8}}>Recherche publiée !</h2>
            <p style={{fontFamily:F.b,fontSize:14,color:C.sec,lineHeight:1.6}}>
              Les propriétaires de <strong style={{color:C.text}}>{form.city} ({form.canton})</strong> peuvent maintenant voir votre demande.<br/>
              Vous recevrez un email dès qu'un bien correspond à vos critères.
            </p>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
            <Link href="/outils/calculateur-loyer" style={{display:"inline-block",background:C.goldBg,border:`1px solid ${C.gold}40`,borderRadius:8,padding:"10px 16px",fontFamily:F.b,fontSize:13,color:C.gold,textDecoration:"none"}}>Vérifier les prix du marché →</Link>
            <Link href="/outils/contestation" style={{display:"inline-block",background:"rgba(248,113,113,0.1)",border:`1px solid rgba(248,113,113,0.3)`,borderRadius:8,padding:"10px 16px",fontFamily:F.b,fontSize:13,color:C.danger,textDecoration:"none"}}>Mon loyer est-il trop élevé ? →</Link>
          </div>
        </div>}

        {/* Trust */}
        <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:40,paddingTop:24,borderTop:`1px solid ${C.border}`}}>
          {[{t:"Gratuit",s:"Pour les locataires"},{t:"Pré-qualifié",s:"Profils vérifiés"},{t:"Confidentiel",s:"Email jamais partagé"}].map((x,i)=>(
            <div key={i} style={{textAlign:"center"}}><div style={{fontFamily:F.b,fontSize:12,fontWeight:600}}>{x.t}</div><div style={{fontFamily:F.b,fontSize:10,color:C.muted}}>{x.s}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
