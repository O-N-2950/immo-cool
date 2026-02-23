"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const C={bg:"#07060A",bgCard:"#0F0E14",bgEl:"#16151E",border:"#2A2838",gold:"#D4A853",goldBg:"rgba(212,168,83,0.08)",text:"#F0EDE6",sec:"#9B97A8",muted:"#5E5A6E",success:"#34D399"};
const F={d:"'Cormorant Garamond',Georgia,serif",b:"'DM Sans',sans-serif",m:"'JetBrains Mono',monospace"};

const SUGGESTIONS = [
  "Quel est le délai de résiliation à Genève ?",
  "Mon propriétaire peut-il augmenter le loyer ?",
  "Comment contester un loyer abusif ?",
  "Qu'est-ce que le taux hypothécaire de référence ?",
  "Garantie de loyer : combien maximum ?",
  "Sous-location : quelles sont les règles ?",
  "Mon propriétaire refuse de rendre la garantie",
  "État des lieux : que vérifier ?",
];

export default function AssistantIA() {
  const [msgs,setMsgs]=useState([{role:"assistant",text:"Bonjour ! Je suis l'assistant juridique IA d'immo.cool. Je suis spécialisé en droit du bail suisse (CO, OBLF, 26 cantons).\n\nVous pouvez me poser des questions sur :\n• Résiliation et délais\n• Loyer abusif et contestation\n• Garantie de loyer\n• Taux hypothécaire et IPC\n• État des lieux\n• Sous-location\n• Et bien plus...\n\nComment puis-je vous aider ?"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const scrollRef=useRef(null);
  const inputRef=useRef(null);
  
  useEffect(()=>{scrollRef.current?.scrollTo({top:scrollRef.current.scrollHeight,behavior:"smooth"})},[msgs]);
  
  const send = async (text) => {
    const msg = text || input.trim();
    if(!msg||loading) return;
    setInput("");
    setMsgs(prev=>[...prev,{role:"user",text:msg}]);
    setLoading(true);
    
    try {
      const res = await fetch("/api/ai/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:msg,lang:"fr"})});
      const data = await res.json();
      setMsgs(prev=>[...prev,{role:"assistant",text:data.reply||"Erreur de traitement."}]);
    } catch(e) {
      setMsgs(prev=>[...prev,{role:"assistant",text:"Erreur de connexion. Veuillez réessayer."}]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:C.bg,color:C.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.gold}30}@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      
      {/* Header */}
      <div style={{padding:"12px 24px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <Link href="/" style={{textDecoration:"none"}}><span style={{fontFamily:F.d,fontSize:20,fontWeight:600,color:C.text}}>immo</span><span style={{fontFamily:F.d,fontSize:20,fontWeight:600,color:C.gold}}>.</span><span style={{fontFamily:F.d,fontSize:20,fontWeight:600,color:C.text}}>cool</span></Link>
          <div style={{width:1,height:20,background:C.border}}/>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:8,height:8,borderRadius:4,background:C.success}}/>
            <span style={{fontFamily:F.b,fontSize:13,fontWeight:600}}>Assistant juridique IA</span>
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <Link href="/outils/contestation" style={{fontFamily:F.b,fontSize:11,color:C.sec,textDecoration:"none",padding:"5px 10px",borderRadius:6,border:`1px solid ${C.border}`}}>Contestation loyer</Link>
          <Link href="/outils/bail-gratuit" style={{fontFamily:F.b,fontSize:11,color:C.sec,textDecoration:"none",padding:"5px 10px",borderRadius:6,border:`1px solid ${C.border}`}}>Bail gratuit</Link>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{flex:1,overflow:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:12}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadeIn 0.3s ease"}}>
            <div style={{maxWidth:"75%",display:"flex",gap:10,flexDirection:m.role==="user"?"row-reverse":"row"}}>
              {m.role==="assistant"&&<div style={{width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${C.gold}30,rgba(167,139,250,0.3))`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14}}>✨</div>}
              <div style={{background:m.role==="user"?C.goldBg:C.bgCard,border:`1px solid ${m.role==="user"?C.gold+"30":C.border}`,borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"12px 16px"}}>
                <div style={{fontFamily:F.b,fontSize:14,color:C.text,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{m.text}</div>
              </div>
            </div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",gap:4,padding:"12px 16px",animation:"fadeIn 0.3s ease"}}>
          <div style={{width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${C.gold}30,rgba(167,139,250,0.3))`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>✨</div>
          <div style={{display:"flex",gap:4,alignItems:"center",padding:"12px 16px",background:C.bgCard,borderRadius:14,border:`1px solid ${C.border}`}}>
            {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:4,background:C.gold,animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite`}}/>)}
          </div>
        </div>}
        
        {/* Suggestions (only at start) */}
        {msgs.length===1&&!loading&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
          {SUGGESTIONS.map((s,i)=>(
            <button key={i} onClick={()=>send(s)} style={{padding:"8px 14px",background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:20,fontFamily:F.b,fontSize:12,color:C.sec,cursor:"pointer",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold+"50";e.currentTarget.style.color=C.gold}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.sec}}>
              {s}
            </button>
          ))}
        </div>}
      </div>

      {/* Input */}
      <div style={{padding:"16px 24px",borderTop:`1px solid ${C.border}`,background:C.bgCard,flexShrink:0}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",gap:10}}>
          <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Posez votre question sur le droit du bail suisse..."
            style={{flex:1,background:C.bgEl,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",fontFamily:F.b,fontSize:14,color:C.text,outline:"none",transition:"border-color 0.2s"}}
            onFocus={e=>e.target.style.borderColor=C.gold+"80"} onBlur={e=>e.target.style.borderColor=C.border}/>
          <button onClick={()=>send()} disabled={!input.trim()||loading}
            style={{padding:"0 20px",background:input.trim()&&!loading?`linear-gradient(135deg,${C.gold},#A07D2E)`:"#333",border:"none",borderRadius:10,color:C.bg,fontFamily:F.b,fontSize:14,fontWeight:600,cursor:input.trim()&&!loading?"pointer":"not-allowed",transition:"opacity 0.2s"}}>
            Envoyer
          </button>
        </div>
        <div style={{maxWidth:720,margin:"6px auto 0",fontFamily:F.b,fontSize:10,color:C.muted,textAlign:"center"}}>
          immo.cool n'est pas un cabinet d'avocats. Pour un litige, consultez l'ASLOCA ou un avocat spécialisé.
        </div>
      </div>
    </div>
  );
}
