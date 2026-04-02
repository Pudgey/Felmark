import { useState, useEffect } from "react";
const WORKSPACES=[{id:"w1",name:"Meridian Studio",avatar:"M",color:"#7c8594",projects:3,activeValue:4200,totalEarned:12400,lastActivity:"2m ago",status:"active",nextDeadline:"Apr 3",daysLeft:5,unread:2},{id:"w2",name:"Nora Kim",avatar:"N",color:"#a08472",projects:2,activeValue:3200,totalEarned:4800,lastActivity:"1h ago",status:"active",nextDeadline:"Apr 12",daysLeft:14,unread:0},{id:"w3",name:"Bolt Fitness",avatar:"B",color:"#8a7e63",projects:1,activeValue:4000,totalEarned:4800,lastActivity:"3d ago",status:"overdue",nextDeadline:"Mar 25",daysLeft:-4,unread:1},{id:"w4",name:"Luna Boutique",avatar:"L",color:"#7c6b9e",projects:0,activeValue:0,totalEarned:0,lastActivity:"New",status:"lead",nextDeadline:null,daysLeft:null,unread:0}];
const REVENUE_MONTHS=[{month:"Oct",value:8200},{month:"Nov",value:11400},{month:"Dec",value:9800},{month:"Jan",value:13200},{month:"Feb",value:10600},{month:"Mar",value:14800}];
const DEADLINES=[{id:1,title:"Brand Guidelines v2",client:"Meridian Studio",avatar:"M",color:"#7c8594",date:"Apr 3",daysLeft:5,progress:65,value:2400},{id:2,title:"Website Copy",client:"Meridian Studio",avatar:"M",color:"#7c8594",date:"Apr 8",daysLeft:10,progress:40,value:1800},{id:3,title:"Course Landing Page",client:"Nora Kim",avatar:"N",color:"#a08472",date:"Apr 12",daysLeft:14,progress:25,value:3200},{id:4,title:"App Onboarding UX",client:"Bolt Fitness",avatar:"B",color:"#8a7e63",date:"Mar 25",daysLeft:-4,progress:70,value:4000,overdue:true}];
const ACTIVITY=[{id:1,icon:"$",color:"#5a9a3c",text:"Payment received — $1,800 from Nora Kim",detail:"Invoice #046 · Retainer (March)",time:"32m ago"},{id:2,icon:"◎",color:"#5b7fa4",text:"Sarah viewed Invoice #047",detail:"Meridian Studio · 2nd view",time:"1h ago"},{id:3,icon:"→",color:"#8a7e63",text:'Sarah: "Can we make the logo section more specific?"',detail:"Brand Guidelines v2 · Comment",time:"2h ago"},{id:4,icon:"✓",color:"#5a9a3c",text:"Nora signed the Course Landing Page proposal",detail:"Proposal accepted · $3,200",time:"3h ago"},{id:5,icon:"↗",color:"#b07d4f",text:"Proposal sent to Luna Boutique",detail:"E-commerce Rebrand · $6,500",time:"5h ago"},{id:6,icon:"✎",color:"#7c8594",text:"Jamie edited Typography section",detail:"Brand Guidelines v2 · 8 changes",time:"6h ago"},{id:7,icon:"!",color:"#c24b38",text:"Bolt Fitness invoice is 4 days overdue",detail:"Invoice #044 · $4,000",time:"Yesterday"}];
const PIPELINE_STAGES=[{label:"Lead",count:3,value:10900,color:"#5b7fa4"},{label:"Proposed",count:2,value:11200,color:"#b07d4f"},{label:"Active",count:3,value:8200,color:"#5a9a3c"},{label:"Awaiting",count:2,value:6400,color:"#8a7e63"}];
const QUICK_ACTIONS=[{id:"proposal",label:"New proposal",icon:"◆",shortcut:"⌘⇧P"},{id:"invoice",label:"New invoice",icon:"$",shortcut:"⌘⇧I"},{id:"workspace",label:"New workspace",icon:"→",shortcut:"⌘⇧W"},{id:"note",label:"Quick note",icon:"✎",shortcut:"⌘N"}];
function AnimNum({value,prefix="",suffix=""}){const[display,setDisplay]=useState(0);useEffect(()=>{const start=Date.now();const frame=()=>{const p=Math.min((Date.now()-start)/1200,1);const eased=1-Math.pow(1-p,3);setDisplay(Math.round(eased*value));if(p<1)requestAnimationFrame(frame)};requestAnimationFrame(frame)},[value]);return<>{prefix}{display.toLocaleString()}{suffix}</>}
const statusCfg={active:{color:"#5a9a3c",label:"Active"},overdue:{color:"#c24b38",label:"Overdue"},lead:{color:"#5b7fa4",label:"Lead"},paused:{color:"#9b988f",label:"Paused"}};

export default function Dashboard(){
  const[hoveredWorkspace,setHoveredWorkspace]=useState(null);
  const[hoveredDeadline,setHoveredDeadline]=useState(null);
  const[now,setNow]=useState(new Date());
  useEffect(()=>{const i=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(i)},[]);
  const totalEarned=WORKSPACES.reduce((s,w)=>s+w.totalEarned,0);
  const totalActive=WORKSPACES.reduce((s,w)=>s+w.activeValue,0);
  const totalProjects=WORKSPACES.reduce((s,w)=>s+w.projects,0);
  const overdueCount=DEADLINES.filter(d=>d.overdue).length;
  const pipelineTotal=PIPELINE_STAGES.reduce((s,p)=>s+p.value,0);
  const maxMonth=Math.max(...REVENUE_MONTHS.map(m=>m.value));
  const hour=now.getHours();
  const greeting=hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

  return(
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
        .dash{font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink-700);background:var(--parchment);min-height:100vh}
        .dash-head{padding:28px 40px 20px;display:flex;align-items:flex-end;justify-content:space-between}
        .dash-greeting{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;color:var(--ink-800)}.dash-greeting em{font-style:italic;color:var(--ember)}
        .dash-date{font-family:var(--mono);font-size:11px;color:var(--ink-300);margin-top:2px}
        .dash-actions{display:flex;gap:5px}
        .dash-qa{display:flex;align-items:center;gap:5px;padding:7px 14px;border-radius:6px;font-size:12.5px;border:1px solid var(--warm-200);background:#fff;cursor:pointer;font-family:inherit;color:var(--ink-600);transition:all .08s}.dash-qa:hover{background:var(--warm-50);border-color:var(--warm-300)}.dash-qa.primary{background:var(--ember);border-color:var(--ember);color:#fff}.dash-qa.primary:hover{background:var(--ember-light)}
        .dash-qa-icon{font-family:var(--mono);font-size:13px}.dash-qa-key{font-family:var(--mono);font-size:9px;color:var(--ink-300);background:var(--warm-100);padding:1px 4px;border-radius:2px}.dash-qa.primary .dash-qa-key{background:rgba(255,255,255,.15);color:rgba(255,255,255,.6)}
        .dash-stats{display:flex;gap:0;margin:0 40px;border:1px solid var(--warm-200);border-radius:10px;overflow:hidden;background:#fff}
        .dash-stat{flex:1;padding:18px 22px;border-right:1px solid var(--warm-100);transition:background .06s;cursor:default}.dash-stat:last-child{border-right:none}.dash-stat:hover{background:var(--warm-50)}
        .dash-stat-val{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:600;color:var(--ink-900);line-height:1}.dash-stat-val.green{color:#5a9a3c}.dash-stat-val.ember{color:var(--ember)}
        .dash-stat-label{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.06em;margin-top:4px}
        .dash-stat-sub{font-size:11px;color:var(--ink-300);margin-top:2px}
        .dash-stat-chart{display:flex;gap:2px;height:28px;align-items:flex-end;margin-top:8px}.dash-stat-bar{flex:1;border-radius:2px;transition:height .4s ease;min-height:2px}
        .dash-grid{display:grid;grid-template-columns:1fr 380px;gap:20px;padding:20px 40px 60px}
        .dash-left{display:flex;flex-direction:column;gap:20px}.dash-right{display:flex;flex-direction:column;gap:20px}
        .dash-section{background:#fff;border:1px solid var(--warm-200);border-radius:10px;overflow:hidden}
        .dash-section-head{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--warm-100)}
        .dash-section-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--ink-900)}
        .dash-section-action{font-family:var(--mono);font-size:10px;color:var(--ink-400);background:none;border:1px solid var(--warm-200);border-radius:4px;padding:3px 10px;cursor:pointer;transition:all .06s}.dash-section-action:hover{background:var(--warm-100);color:var(--ink-600)}
        .dash-ws-list{padding:6px}
        .dash-ws{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:8px;cursor:pointer;transition:all .1s;border:1px solid transparent}.dash-ws:hover{background:var(--warm-50);border-color:var(--warm-200)}.dash-ws.hovered{background:var(--ember-bg);border-color:rgba(176,125,79,.1)}
        .dash-ws-avatar{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;color:#fff;flex-shrink:0;position:relative}
        .dash-ws-unread{position:absolute;top:-3px;right:-3px;width:16px;height:16px;border-radius:50%;background:#c24b38;color:#fff;font-size:9px;font-weight:600;display:flex;align-items:center;justify-content:center;border:2px solid #fff}
        .dash-ws-info{flex:1;min-width:0}.dash-ws-name{font-size:15px;font-weight:500;color:var(--ink-800)}
        .dash-ws-meta{display:flex;align-items:center;gap:6px;margin-top:2px;font-size:12px;color:var(--ink-400);flex-wrap:wrap}
        .dash-ws-status{font-family:var(--mono);font-size:9px;font-weight:500;padding:1px 6px;border-radius:3px}
        .dash-ws-right{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0}
        .dash-ws-value{font-family:var(--mono);font-size:14px;font-weight:600;color:var(--ink-800)}
        .dash-ws-deadline{font-family:var(--mono);font-size:10px}.dash-ws-activity{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .dash-dl-list{padding:6px}
        .dash-dl{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:7px;cursor:pointer;transition:all .08s}.dash-dl:hover{background:var(--warm-50)}.dash-dl.overdue{border-left:3px solid #c24b38;margin-left:-3px}
        .dash-dl-avatar{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#fff;flex-shrink:0}
        .dash-dl-info{flex:1;min-width:0}.dash-dl-title{font-size:13.5px;font-weight:500;color:var(--ink-700)}.dash-dl-client{font-size:11px;color:var(--ink-400)}
        .dash-dl-right{display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0}
        .dash-dl-date{font-family:var(--mono);font-size:11px;font-weight:500}
        .dash-dl-progress-wrap{display:flex;align-items:center;gap:4px}
        .dash-dl-progress{width:48px;height:3px;background:var(--warm-200);border-radius:2px;overflow:hidden}.dash-dl-progress-fill{height:100%;border-radius:2px}
        .dash-dl-pct{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
        .dash-act-list{padding:4px 6px}
        .dash-act{display:flex;align-items:flex-start;gap:10px;padding:10px;border-radius:6px;cursor:pointer;transition:background .06s;border-bottom:1px solid var(--warm-100)}.dash-act:last-child{border-bottom:none}.dash-act:hover{background:var(--warm-50)}
        .dash-act-icon{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0;margin-top:1px}
        .dash-act-body{flex:1;min-width:0}.dash-act-text{font-size:13px;color:var(--ink-600);line-height:1.4}.dash-act-detail{font-size:11px;color:var(--ink-400);margin-top:1px}
        .dash-act-time{font-family:var(--mono);font-size:10px;color:var(--ink-300);flex-shrink:0;margin-top:2px}
        .dash-pipe{padding:16px 20px}
        .dash-pipe-bar{display:flex;height:8px;border-radius:4px;overflow:hidden;gap:2px;margin-bottom:12px}.dash-pipe-seg{border-radius:3px;transition:width .4s}
        .dash-pipe-stages{display:flex;gap:0}.dash-pipe-stage{flex:1;text-align:center;padding:6px 4px;border-right:1px solid var(--warm-100)}.dash-pipe-stage:last-child{border-right:none}
        .dash-pipe-stage-count{font-family:var(--mono);font-size:16px;font-weight:600;color:var(--ink-800);display:block}
        .dash-pipe-stage-val{font-family:var(--mono);font-size:10px;color:var(--ink-400);display:block;margin-top:1px}
        .dash-pipe-stage-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em;margin-top:3px;display:block}
        .dash-earn{padding:16px 20px}
        .dash-earn-total{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px}
        .dash-earn-val{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--ink-900)}
        .dash-earn-change{font-family:var(--mono);font-size:11px;font-weight:500;color:#5a9a3c}
        .dash-earn-chart{display:flex;gap:6px;height:64px;align-items:flex-end}
        .dash-earn-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
        .dash-earn-bar{width:100%;border-radius:3px;transition:height .5s ease;min-height:3px}
        .dash-earn-bar-label{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
        .dash-earn-bar-val{font-family:var(--mono);font-size:9px;color:var(--ink-400);font-weight:500}
        .dash-footer{padding:8px 40px;font-family:var(--mono);font-size:10px;color:var(--ink-300);display:flex;justify-content:space-between;border-top:1px solid var(--warm-100)}
      `}</style>
      <div className="dash">
        <div className="dash-head"><div><div className="dash-greeting">{greeting}. <em>Let's build.</em></div><div className="dash-date">{now.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</div></div>
          <div className="dash-actions">{QUICK_ACTIONS.map((a,i)=><button key={a.id} className={`dash-qa${i===0?" primary":""}`}><span className="dash-qa-icon">{a.icon}</span>{a.label}<span className="dash-qa-key">{a.shortcut}</span></button>)}</div>
        </div>
        <div className="dash-stats">
          <div className="dash-stat"><div className="dash-stat-val green"><AnimNum value={14800} prefix="$"/></div><div className="dash-stat-label">earned this month</div><div className="dash-stat-sub">+40% vs February</div><div className="dash-stat-chart">{REVENUE_MONTHS.map((m,i)=><div key={i} className="dash-stat-bar" style={{height:`${(m.value/maxMonth)*100}%`,background:i===REVENUE_MONTHS.length-1?"#5a9a3c":"var(--warm-200)"}}/>)}</div></div>
          <div className="dash-stat"><div className="dash-stat-val ember"><AnimNum value={totalActive} prefix="$"/></div><div className="dash-stat-label">in progress</div><div className="dash-stat-sub">{totalProjects} active projects</div></div>
          <div className="dash-stat"><div className="dash-stat-val"><AnimNum value={pipelineTotal} prefix="$"/></div><div className="dash-stat-label">total pipeline</div><div className="dash-stat-sub">{PIPELINE_STAGES.reduce((s,p)=>s+p.count,0)} open deals</div></div>
          <div className="dash-stat"><div className="dash-stat-val">{DEADLINES.filter(d=>!d.overdue).length}</div><div className="dash-stat-label">upcoming deadlines</div>{overdueCount>0&&<div className="dash-stat-sub" style={{color:"#c24b38"}}>{overdueCount} overdue</div>}</div>
          <div className="dash-stat"><div className="dash-stat-val"><AnimNum value={totalEarned} prefix="$"/></div><div className="dash-stat-label">lifetime earnings</div><div className="dash-stat-sub">{WORKSPACES.length} clients total</div></div>
        </div>
        <div className="dash-grid">
          <div className="dash-left">
            <div className="dash-section"><div className="dash-section-head"><span className="dash-section-title">Workspaces</span><button className="dash-section-action">View all</button></div>
              <div className="dash-ws-list">{WORKSPACES.map(w=>{const st=statusCfg[w.status];const deadlineColor=w.daysLeft===null?"var(--ink-300)":w.daysLeft<0?"#c24b38":w.daysLeft<=5?"#c89360":"var(--ink-400)";const deadlineText=w.daysLeft===null?"No deadline":w.daysLeft<0?`${Math.abs(w.daysLeft)}d overdue`:w.daysLeft<=1?"Tomorrow":`${w.daysLeft}d left`;return(
                <div key={w.id} className={`dash-ws${hoveredWorkspace===w.id?" hovered":""}`} onMouseEnter={()=>setHoveredWorkspace(w.id)} onMouseLeave={()=>setHoveredWorkspace(null)}>
                  <div className="dash-ws-avatar" style={{background:w.color}}>{w.avatar}{w.unread>0&&<span className="dash-ws-unread">{w.unread}</span>}</div>
                  <div className="dash-ws-info"><div className="dash-ws-name">{w.name}</div><div className="dash-ws-meta"><span className="dash-ws-status" style={{color:st.color,background:st.color+"08",border:`1px solid ${st.color}15`}}>{st.label}</span><span>{w.projects} project{w.projects!==1?"s":""}</span><span>·</span><span>${(w.totalEarned/1000).toFixed(1)}k earned</span></div></div>
                  <div className="dash-ws-right">{w.activeValue>0&&<span className="dash-ws-value">${w.activeValue.toLocaleString()}</span>}{w.nextDeadline&&<span className="dash-ws-deadline" style={{color:deadlineColor}}>{deadlineText}</span>}<span className="dash-ws-activity">{w.lastActivity}</span></div>
                </div>)})}</div>
            </div>
            <div className="dash-section"><div className="dash-section-head"><span className="dash-section-title">Deadlines</span><button className="dash-section-action">Calendar</button></div>
              <div className="dash-dl-list">{DEADLINES.sort((a,b)=>a.daysLeft-b.daysLeft).map(d=>{const dateColor=d.overdue?"#c24b38":d.daysLeft<=5?"#c89360":"var(--ink-500)";const dateText=d.overdue?`${Math.abs(d.daysLeft)}d overdue`:d.daysLeft<=1?"Tomorrow":`${d.daysLeft}d left`;const progressColor=d.overdue?"#c24b38":d.progress>=60?"#5a9a3c":"#b07d4f";return(
                <div key={d.id} className={`dash-dl${hoveredDeadline===d.id?" hovered":""}${d.overdue?" overdue":""}`} onMouseEnter={()=>setHoveredDeadline(d.id)} onMouseLeave={()=>setHoveredDeadline(null)}>
                  <div className="dash-dl-avatar" style={{background:d.color}}>{d.avatar}</div>
                  <div className="dash-dl-info"><div className="dash-dl-title">{d.title}</div><div className="dash-dl-client">{d.client} · ${d.value.toLocaleString()}</div></div>
                  <div className="dash-dl-right"><span className="dash-dl-date" style={{color:dateColor}}>{dateText}</span><div className="dash-dl-progress-wrap"><div className="dash-dl-progress"><div className="dash-dl-progress-fill" style={{width:`${d.progress}%`,background:progressColor}}/></div><span className="dash-dl-pct">{d.progress}%</span></div></div>
                </div>)})}</div>
            </div>
          </div>
          <div className="dash-right">
            <div className="dash-section"><div className="dash-section-head"><span className="dash-section-title">Activity</span><button className="dash-section-action">The Wire</button></div>
              <div className="dash-act-list">{ACTIVITY.map(a=>(
                <div key={a.id} className="dash-act"><div className="dash-act-icon" style={{background:a.color+"08",color:a.color,border:`1px solid ${a.color}12`}}>{a.icon}</div><div className="dash-act-body"><div className="dash-act-text">{a.text}</div><div className="dash-act-detail">{a.detail}</div></div><span className="dash-act-time">{a.time}</span></div>
              ))}</div>
            </div>
            <div className="dash-section"><div className="dash-section-head"><span className="dash-section-title">Pipeline</span><button className="dash-section-action">Open</button></div>
              <div className="dash-pipe"><div className="dash-pipe-bar">{PIPELINE_STAGES.map((s,i)=><div key={i} className="dash-pipe-seg" style={{width:`${(s.value/pipelineTotal)*100}%`,background:s.color,opacity:.6}}/>)}</div>
                <div className="dash-pipe-stages">{PIPELINE_STAGES.map((s,i)=><div key={i} className="dash-pipe-stage"><span className="dash-pipe-stage-count">{s.count}</span><span className="dash-pipe-stage-val">${(s.value/1000).toFixed(1)}k</span><span className="dash-pipe-stage-label">{s.label}</span></div>)}</div>
              </div>
            </div>
            <div className="dash-section"><div className="dash-section-head"><span className="dash-section-title">Earnings</span><button className="dash-section-action">6 months</button></div>
              <div className="dash-earn"><div className="dash-earn-total"><span className="dash-earn-val"><AnimNum value={totalEarned} prefix="$"/></span><span className="dash-earn-change">↑ 18% vs last quarter</span></div>
                <div className="dash-earn-chart">{REVENUE_MONTHS.map((m,i)=>{const isCurrent=i===REVENUE_MONTHS.length-1;return(<div key={i} className="dash-earn-col"><span className="dash-earn-bar-val">${(m.value/1000).toFixed(1)}k</span><div className="dash-earn-bar" style={{height:`${(m.value/maxMonth)*100}%`,background:isCurrent?"var(--ember)":"var(--warm-200)"}}/><span className="dash-earn-bar-label" style={isCurrent?{color:"var(--ember)",fontWeight:500}:{}}>{m.month}</span></div>)})}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dash-footer"><span>Felmark · {WORKSPACES.length} workspaces · {totalProjects} projects</span><span>{now.toLocaleTimeString()}</span></div>
      </div>
    </>
  );
}
