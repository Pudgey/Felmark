import { useState, useRef, useEffect } from "react";
const CH=[{id:"general",name:"General",icon:"#",type:"team",unread:0,desc:"Team updates"},{id:"design",name:"Design",icon:"#",type:"team",unread:3,desc:"Critiques & assets"},{id:"meridian",name:"Meridian Studio",icon:"M",type:"client",color:"#6a7b8a",unread:2,online:true,contact:"Sarah Chen",role:"Creative Director",desc:"Brand Guidelines v2"},{id:"nora",name:"Nora Kim",icon:"N",type:"client",color:"#9a8472",unread:0,online:true,contact:"Nora Kim",role:"Life Coach",desc:"Course Landing Page"},{id:"bolt",name:"Bolt Fitness",icon:"B",type:"client",color:"#8a7e5a",unread:1,online:false,contact:"Jake Torres",role:"Founder",desc:"App Onboarding UX"},{id:"luna",name:"Luna Boutique",icon:"L",type:"client",color:"#7a6a90",unread:1,online:false,contact:"Maria Santos",role:"Owner",desc:"New inquiry"}];
const P={alex:{name:"Alex Mercer",av:"A",color:"#a87444"},sarah:{name:"Sarah Chen",av:"S",color:"#6a7b8a"},nora:{name:"Nora Kim",av:"N",color:"#9a8472"},jake:{name:"Jake Torres",av:"J",color:"#8a7e5a"},maria:{name:"Maria Santos",av:"M",color:"#7a6a90"},kai:{name:"Kai Rivera",av:"K",color:"#5e8f5e"}};
const MSGS={meridian:[{id:"m1",from:"sarah",text:"Hey Alex — had a chance to review the color palette this morning. The teal feels too cold for our brand. Can we explore something warmer? Maybe sage or olive tones?",time:"10:42 AM",reactions:["👀"]},{id:"m2",from:"alex",text:"Totally get that feedback. I was actually leaning the same direction after seeing it on the mockups. Let me pull together 3 warm alternatives by end of day.",time:"10:48 AM"},{id:"m3",from:"sarah",text:"Amazing, thank you! James also mentioned he loves the logo direction — Concept B is the winner. Can we build out the full system around that?",time:"10:51 AM",reactions:["🎉"]},{id:"m4",from:"alex",text:"Love it — Concept B was my favorite too. Quick question: wordmark or symbol + wordmark as primary?",time:"10:55 AM"},{id:"m5",from:"sarah",text:"Symbol + wordmark for sure. Symbol alone for favicons and small spaces.",time:"11:02 AM"},{id:"m6",from:"alex",text:"Perfect. Here's the current project status:",time:"11:15 AM",attach:{type:"status",title:"Brand Guidelines v2",items:[{label:"Discovery & Audit",pct:100},{label:"Logo System",pct:100},{label:"Color & Typography",pct:50},{label:"Guidelines Doc",pct:0}]}}],bolt:[{id:"b1",from:"jake",text:"Hey, sorry for the slow response — been swamped with the gym expansion. I'll review the onboarding screens this week.",time:"Mon 3:14 PM"},{id:"b2",from:"alex",text:"No worries Jake. Just a heads up — we're about 4 days past the review deadline. The sooner you can look, the sooner we can finalize.",time:"Mon 4:02 PM",attach:{type:"invoice",num:"INV-047",amount:"$4,000",status:"4 days overdue"}}],general:[{id:"g1",from:"alex",text:"Quick update — Nora just signed the Course Landing Page proposal. That puts us at $14.8k for March, $200 away from our $15k goal.",time:"9:30 AM",reactions:["🔥"]},{id:"g2",from:"kai",text:"Let's gooo. I'll spin up the dev environment for Nora's project this afternoon.",time:"9:35 AM"}],design:[{id:"d1",from:"kai",text:"Alex — should we reuse the same component library for Nora's landing page? Or start fresh with a different system?",time:"Yesterday 2:10 PM",thread:4},{id:"d2",from:"alex",text:"Start fresh. Completely different aesthetic. Nora wants warm and organic — Bolt was clean and sporty. I'll send mood boards today.",time:"Yesterday 2:22 PM"},{id:"d3",from:"kai",text:"Makes sense. The Meridian social templates are ready for your review in Figma.",time:"Yesterday 3:45 PM"}],nora:[{id:"n1",from:"nora",text:"Just signed! So excited to get started on the landing page.",time:"9:15 AM",reactions:["🎉","❤️"]},{id:"n2",from:"alex",text:"Welcome aboard, Nora! Here's what happens next:",time:"9:20 AM",attach:{type:"checklist",title:"Onboarding · Course Landing Page",items:[{t:"Discovery questionnaire sent",done:true},{t:"Schedule kickoff call",done:false},{t:"Portal access & credentials",done:false},{t:"Mood board & visual references",done:false}]}}],luna:[{id:"l1",from:"maria",text:"Hi! I found you through Sarah at Meridian — she couldn't say enough good things. I'm launching a boutique fashion line and need brand identity, packaging, and a simple website. Would love to chat if you have capacity.",time:"2:18 PM"}]};

function StatusA({data}){const c=v=>v===100?"var(--sg)":v>0?"var(--em)":"var(--i2)";return(<div className="att att-st"><div className="att-t">{data.title}</div>{data.items.map((it,i)=>(<div key={i} className="att-row"><span className="att-row-lb">{it.label}</span><div className="att-row-bar"><div style={{width:`${it.pct}%`,background:c(it.pct)}}/></div><span className="att-row-pct" style={{color:c(it.pct)}}>{it.pct}%</span></div>))}</div>)}
function InvoiceA({data}){return(<div className="att att-inv"><div><div className="att-inv-num">{data.num}</div><div className="att-inv-amt">{data.amount}</div></div><div className="att-inv-badge">{data.status}</div></div>)}
function ChecklistA({data}){const d=data.items.filter(i=>i.done).length;return(<div className="att att-cl"><div className="att-cl-hd"><span className="att-t">{data.title}</span><span className="att-cl-ct">{d}/{data.items.length}</span></div>{data.items.map((it,i)=>(<div key={i} className={`att-cl-i${it.done?" done":""}`}><div className={`att-cl-cb${it.done?" on":""}`}>{it.done?"✓":""}</div><span>{it.t}</span></div>))}<div className="att-cl-bar"><div style={{width:`${(d/data.items.length)*100}%`}}/></div></div>)}

export default function Hub(){
const[ch,setCh]=useState("meridian");const[input,setInput]=useState("");const[msgs,setMsgs]=useState(MSGS);const[typing,setTyping]=useState(false);const ref=useRef(null);const iRef=useRef(null);
const cn=CH.find(c=>c.id===ch);const list=msgs[ch]||[];
useEffect(()=>{iRef.current?.focus()},[ch]);
useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight},[ch,msgs]);
const send=()=>{if(!input.trim())return;setMsgs(p=>({...p,[ch]:[...(p[ch]||[]),{id:`u${Date.now()}`,from:"alex",text:input,time:"Just now"}]}));setInput("");setTyping(true);setTimeout(()=>setTyping(false),2800)};
return(<><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>{`
*{box-sizing:border-box;margin:0;padding:0}:root{--bg:#edeae5;--card:#fff;--tint:#f8f7f4;--bd:#ddd9d2;--bdl:#ebe8e2;--i9:#252320;--i8:#363330;--i7:#4a4743;--i6:#5e5b56;--i5:#7a7772;--i4:#9b988f;--i3:#b5b2a9;--i2:#d0cdc6;--em:#a87444;--embg:rgba(168,116,68,.04);--sg:#5e8f5e;--lv:#7d7db0;--lvbg:rgba(125,125,176,.03);--rs:#b46e5e;--mono:'JetBrains Mono',monospace}
.hub{font-family:'DM Sans',sans-serif;background:var(--bg);height:100vh;display:flex;flex-direction:column;overflow:hidden}
.hub-top{height:56px;padding:0 28px;background:var(--card);border-bottom:1px solid var(--bd);display:flex;align-items:center;gap:14px;flex-shrink:0}
.hub-mark{width:30px;height:30px;border-radius:9px;background:var(--i9);display:flex;align-items:center;justify-content:center;color:var(--em);font-size:13px}
.hub-name{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:var(--i9)}
.hub-badge{font-family:var(--mono);font-size:8px;color:var(--lv);background:var(--lvbg);padding:3px 10px;border-radius:5px;border:1px solid rgba(125,125,176,.06);letter-spacing:.06em}
.hub-sep{width:1px;height:22px;background:var(--bd);margin:0 6px}
.hub-ch-title{flex:1;display:flex;align-items:center;gap:10px}
.hub-ch-av-sm{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0;position:relative}
.hub-ch-av-sm.team{background:var(--tint);border:1px solid var(--bdl);color:var(--i4)}
.hub-ch-av-sm.client{color:var(--card)}
.hub-ch-pres-sm{position:absolute;bottom:-1px;right:-1px;width:9px;height:9px;border-radius:50%;border:2px solid var(--card)}
.hub-ch-title-text{font-size:16px;font-weight:600;color:var(--i8)}
.hub-ch-title-sub{font-size:12px;color:var(--i4);font-weight:400}
.hub-btn{padding:8px 18px;border-radius:9px;border:1px solid var(--bd);background:var(--card);font-size:12px;font-family:inherit;color:var(--i5);cursor:pointer;font-weight:500;transition:all .1s}.hub-btn:hover{background:var(--tint);transform:translateY(-1px)}
.hub-body{flex:1;display:flex;overflow:hidden}
.hub-side{width:260px;background:var(--card);border-right:1px solid var(--bd);display:flex;flex-direction:column;flex-shrink:0}
.hub-side-hd{padding:18px 18px 14px;display:flex;align-items:center;justify-content:space-between}
.hub-side-t{font-family:var(--mono);font-size:9px;color:var(--i3);text-transform:uppercase;letter-spacing:.1em}
.hub-side-badge{font-family:var(--mono);font-size:9px;color:var(--card);background:var(--em);padding:2px 7px;border-radius:7px;min-width:18px;text-align:center}
.hub-side-search{margin:0 12px 14px;display:flex;align-items:center;gap:8px;padding:9px 14px;background:var(--tint);border:1px solid var(--bdl);border-radius:10px;transition:all .12s}
.hub-side-search:focus-within{border-color:var(--lv);background:var(--card);box-shadow:0 0 0 3px rgba(125,125,176,.04)}
.hub-side-search input{flex:1;border:none;outline:none;background:transparent;font-size:13px;font-family:inherit;color:var(--i7)}.hub-side-search input::placeholder{color:var(--i3)}
.hub-side-list{flex:1;overflow-y:auto;padding:0 8px}.hub-side-list::-webkit-scrollbar{width:3px}.hub-side-list::-webkit-scrollbar-thumb{background:var(--bd);border-radius:2px}
.hub-side-lb{font-family:var(--mono);font-size:8px;color:var(--i3);text-transform:uppercase;letter-spacing:.08em;padding:14px 10px 6px;display:flex;align-items:center;gap:8px}.hub-side-lb::after{content:'';flex:1;height:1px;background:var(--bdl)}
.c{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:12px;cursor:pointer;margin-bottom:2px;transition:all .1s;border:1px solid transparent}.c:hover{background:var(--tint)}.c.on{background:var(--lvbg);border-color:rgba(125,125,176,.05)}
.c-av{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;position:relative}.c-av.team{background:var(--tint);border:1px solid var(--bdl);color:var(--i4);font-size:16px}.c-av.client{color:var(--card)}
.c-pres{position:absolute;bottom:-1px;right:-1px;width:11px;height:11px;border-radius:50%;border:2.5px solid var(--card)}.c.on .c-pres{border-color:#f7f6f3}
.c-info{flex:1;min-width:0}.c-name{font-size:14px;font-weight:500;color:var(--i6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.c.on .c-name{color:var(--i9);font-weight:600}
.c-sub{font-size:11px;color:var(--i3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.c-unread{min-width:20px;height:20px;border-radius:10px;background:var(--em);color:var(--card);font-size:10px;font-weight:600;display:flex;align-items:center;justify-content:center;padding:0 5px;flex-shrink:0}
.hub-side-ft{padding:14px 18px;border-top:1px solid var(--bdl);font-family:var(--mono);font-size:9px;color:var(--i3);line-height:1.6}

/* CHAT — PURE WHITE */
.hub-chat{flex:1;display:flex;flex-direction:column;background:#ffffff;overflow:hidden}
.hub-chat-hd{padding:14px 32px;border-bottom:1px solid var(--bdl);display:flex;align-items:center;gap:8px;flex-shrink:0}
.hub-chat-hd-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.hub-chat-hd-name{font-size:13px;font-weight:500;color:var(--i5)}
.hub-chat-hd-role{font-size:12px;color:var(--i3)}
.hub-chat-hd-sp{flex:1}
.hub-chat-hd-time{font-family:var(--mono);font-size:9px;color:var(--i3)}
.hub-msgs{flex:1;overflow-y:auto;padding:28px 36px}.hub-msgs::-webkit-scrollbar{width:4px}.hub-msgs::-webkit-scrollbar-thumb{background:var(--bdl);border-radius:2px}
.msg{display:flex;gap:14px;padding:8px 10px;margin-bottom:2px;border-radius:12px;transition:background .06s}.msg:hover{background:rgba(248,247,244,.5)}
.msg-av{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;color:#fff;flex-shrink:0;margin-top:2px}
.msg-body{flex:1;min-width:0}
.msg-head{display:flex;align-items:baseline;gap:8px;margin-bottom:4px}
.msg-name{font-size:14px;font-weight:600;color:var(--i8)}
.msg-you{font-size:11px;color:var(--i3);font-weight:400}
.msg-time{font-family:var(--mono);font-size:10px;color:var(--i3);margin-left:auto}
.msg-text{font-size:15px;color:var(--i6);line-height:1.7;max-width:580px;letter-spacing:.005em}
.msg-rx{display:flex;gap:5px;margin-top:8px}.msg-r{padding:4px 10px;border-radius:8px;border:1px solid var(--bdl);background:#fff;font-size:13px;cursor:pointer;transition:all .08s;display:flex;align-items:center;gap:4px}.msg-r:hover{border-color:var(--i2);background:var(--tint);transform:scale(1.05)}
.msg-r-n{font-family:var(--mono);font-size:9px;color:var(--i4)}
.msg-thread{display:inline-flex;align-items:center;gap:5px;margin-top:8px;font-size:12px;color:var(--lv);cursor:pointer;padding:4px 10px;border-radius:7px;font-weight:500}.msg-thread:hover{background:var(--lvbg)}
.att{margin-top:10px;border:1px solid var(--bdl);border-radius:14px;max-width:420px;overflow:hidden;background:#fff}
.att-st{padding:16px 20px}.att-t{font-size:14px;font-weight:500;color:var(--i7);margin-bottom:12px}
.att-row{display:flex;align-items:center;gap:10px;padding:5px 0}.att-row-lb{font-size:13px;color:var(--i5);width:140px;flex-shrink:0}
.att-row-bar{flex:1;height:5px;background:var(--bdl);border-radius:3px;overflow:hidden}.att-row-bar div{height:100%;border-radius:3px;transition:width .5s ease}
.att-row-pct{font-family:var(--mono);font-size:11px;width:32px;text-align:right;flex-shrink:0;font-weight:500}
.att-inv{padding:16px 20px;display:flex;align-items:center;justify-content:space-between;border-left:4px solid var(--rs)}
.att-inv-num{font-family:var(--mono);font-size:11px;color:var(--i3)}
.att-inv-amt{font-family:'Fraunces',serif;font-size:28px;font-weight:700;color:var(--rs);line-height:1;margin-top:2px}
.att-inv-badge{font-family:var(--mono);font-size:10px;color:var(--rs);background:rgba(180,110,94,.05);padding:5px 12px;border-radius:8px;border:1px solid rgba(180,110,94,.08);font-weight:500}
.att-cl{padding:16px 20px}.att-cl-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.att-cl-ct{font-family:var(--mono);font-size:10px;color:var(--i3)}
.att-cl-i{display:flex;align-items:center;gap:10px;padding:7px 0;font-size:14px;color:var(--i6);border-bottom:1px solid var(--bdl)}.att-cl-i:last-of-type{border-bottom:none}.att-cl-i.done{opacity:.45}.att-cl-i.done span{text-decoration:line-through}
.att-cl-cb{width:18px;height:18px;border-radius:6px;border:2px solid var(--bd);display:flex;align-items:center;justify-content:center;font-size:10px;color:transparent;flex-shrink:0}.att-cl-cb.on{background:var(--sg);border-color:var(--sg);color:#fff}
.att-cl-bar{height:4px;background:var(--bdl);border-radius:2px;overflow:hidden;margin-top:12px}.att-cl-bar div{height:100%;background:var(--sg);border-radius:2px}
.msg-typing{display:flex;align-items:center;gap:10px;padding:10px 8px;font-size:13px;color:var(--i4)}
.msg-typing-dots{display:flex;gap:3px}
.msg-typing-dot{width:6px;height:6px;border-radius:50%;background:var(--i2);animation:b .6s ease infinite}.msg-typing-dot:nth-child(2){animation-delay:.12s}.msg-typing-dot:nth-child(3){animation-delay:.24s}
@keyframes b{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.hub-input{padding:16px 36px 22px;border-top:1px solid var(--bdl);flex-shrink:0;background:#fff}
.hub-input-wrap{display:flex;align-items:flex-end;gap:10px;padding:14px 20px;border:1.5px solid var(--bdl);border-radius:16px;transition:all .12s;background:#fff}
.hub-input-wrap:focus-within{border-color:var(--lv);box-shadow:0 0 0 4px rgba(125,125,176,.04)}
.hub-input-field{flex:1;border:none;outline:none;background:transparent;font-size:15px;font-family:inherit;color:var(--i7);resize:none;line-height:1.5;min-height:22px;max-height:120px}.hub-input-field::placeholder{color:var(--i3)}
.hub-input-btns{display:flex;gap:5px;flex-shrink:0}
.hub-input-a{width:32px;height:32px;border-radius:9px;border:1px solid var(--bdl);background:#fff;color:var(--i3);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all .08s}.hub-input-a:hover{border-color:var(--i2);color:var(--i5);background:var(--tint)}
.hub-input-send{width:32px;height:32px;border-radius:9px;border:none;background:var(--i2);color:var(--card);cursor:default;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;transition:all .12s}.hub-input-send.on{background:var(--i9);cursor:pointer}.hub-input-send.on:hover{background:var(--i8);transform:translateY(-1px)}
.hub-input-hints{font-family:var(--mono);font-size:9px;color:var(--i3);margin-top:8px;padding-left:2px;display:flex;gap:12px}
.hub-input-key{background:var(--tint);padding:1px 5px;border-radius:3px;border:1px solid var(--bdl)}
.hub-ft{height:30px;padding:0 28px;border-top:1px solid var(--bd);background:var(--card);display:flex;align-items:center;justify-content:space-between;font-family:var(--mono);font-size:9px;color:var(--i3);flex-shrink:0}
`}</style>
<div className="hub">
<div className="hub-top"><div className="hub-mark">◆</div><span className="hub-name">Felmark</span><span className="hub-badge">HUB</span><span className="hub-sep"/>
<div className="hub-ch-title">{cn.type==="client"?<div className="hub-ch-av-sm client" style={{background:cn.color}}>{cn.icon}<div className="hub-ch-pres-sm" style={{background:cn.online?"var(--sg)":"var(--i3)"}}/></div>:<div className="hub-ch-av-sm team">#</div>}<div><span className="hub-ch-title-text">{cn.name}</span><span className="hub-ch-title-sub"> · {cn.desc}</span></div></div>
{cn.type==="client"&&<button className="hub-btn">◎ Portal</button>}<button className="hub-btn">◇ Files</button></div>

<div className="hub-body">
<div className="hub-side"><div className="hub-side-hd"><span className="hub-side-t">Conversations</span>{CH.reduce((s,c)=>s+c.unread,0)>0&&<span className="hub-side-badge">{CH.reduce((s,c)=>s+c.unread,0)}</span>}</div>
<div className="hub-side-search"><span style={{color:"var(--i3)",fontSize:13}}>⌕</span><input placeholder="Search..."/></div>
<div className="hub-side-list">
<div className="hub-side-lb">Team</div>
{CH.filter(c=>c.type==="team").map(c=>(<div key={c.id} className={`c${ch===c.id?" on":""}`} onClick={()=>setCh(c.id)}><div className="c-av team">{c.icon}</div><div className="c-info"><div className="c-name">{c.name}</div><div className="c-sub">{c.desc}</div></div>{c.unread>0&&<span className="c-unread">{c.unread}</span>}</div>))}
<div className="hub-side-lb">Clients</div>
{CH.filter(c=>c.type==="client").map(c=>(<div key={c.id} className={`c${ch===c.id?" on":""}`} onClick={()=>setCh(c.id)}><div className="c-av client" style={{background:c.color}}>{c.icon}<div className="c-pres" style={{background:c.online?"var(--sg)":"var(--i3)"}}/></div><div className="c-info"><div className="c-name">{c.name}</div><div className="c-sub">{c.contact} · {c.desc}</div></div>{c.unread>0&&<span className="c-unread">{c.unread}</span>}</div>))}
</div><div className="hub-side-ft">Encrypted end-to-end.<br/>Clients see only their channel. ◆</div></div>

<div className="hub-chat">
{cn.type==="client"&&<div className="hub-chat-hd"><div className="hub-chat-hd-dot" style={{background:cn.online?"var(--sg)":"var(--i3)"}}/><span className="hub-chat-hd-name">{cn.contact}</span><span className="hub-chat-hd-role">{cn.role}</span><span className="hub-chat-hd-sp"/><span className="hub-chat-hd-time">{cn.online?"Online now":"Last seen 3d ago"}</span></div>}
<div className="hub-msgs" ref={ref}>
{list.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:"var(--i3)"}}><div style={{fontSize:24,opacity:.2,marginBottom:8}}>✉</div><div style={{fontSize:14}}>No messages yet</div></div>}
{list.map((msg,i)=>{const p=P[msg.from];const isYou=msg.from==="alex";const showHead=i===0||list[i-1].from!==msg.from;return(
<div key={msg.id} className="msg" style={{paddingTop:showHead?10:2,marginTop:showHead&&i>0?8:0}}>
{showHead?<div className="msg-av" style={{background:p?.color}}>{p?.av}</div>:<div style={{width:38,flexShrink:0}}/>}
<div className="msg-body">
{showHead&&<div className="msg-head"><span className="msg-name">{p?.name}</span>{isYou&&<span className="msg-you">you</span>}<span className="msg-time">{msg.time}</span></div>}
<div className="msg-text">{msg.text}</div>
{msg.attach?.type==="status"&&<StatusA data={msg.attach}/>}
{msg.attach?.type==="invoice"&&<InvoiceA data={msg.attach}/>}
{msg.attach?.type==="checklist"&&<ChecklistA data={msg.attach}/>}
{msg.reactions&&<div className="msg-rx">{msg.reactions.map((r,j)=><div key={j} className="msg-r"><span>{r}</span><span className="msg-r-n">1</span></div>)}</div>}
{msg.thread&&<div className="msg-thread">◇ {msg.thread} replies →</div>}
</div></div>)})}
{typing&&<div className="msg-typing"><div className="msg-typing-dots"><div className="msg-typing-dot"/><div className="msg-typing-dot"/><div className="msg-typing-dot"/></div><span>{cn.contact||"Someone"} is typing...</span></div>}
</div>
<div className="hub-input"><div className="hub-input-wrap"><textarea ref={iRef} className="hub-input-field" rows={1} value={input} onChange={e=>setInput(e.target.value)} placeholder={`Message ${cn.type==="client"?cn.name:"#"+cn.name}...`} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}}/><div className="hub-input-btns"><button className="hub-input-a" title="Attach">◻</button><button className="hub-input-a" title="Block">◆</button><button className={`hub-input-send${input.trim()?" on":""}`} onClick={send}>↑</button></div></div><div className="hub-input-hints"><span><span className="hub-input-key">Enter</span> send</span><span><span className="hub-input-key">Shift+Enter</span> new line</span></div></div>
</div></div>
<div className="hub-ft"><span>◆ {CH.filter(c=>c.online).length} online · {CH.reduce((s,c)=>s+c.unread,0)} unread</span><span>Felmark Hub · Encrypted · @felmark/forge</span></div>
</div></>)}
