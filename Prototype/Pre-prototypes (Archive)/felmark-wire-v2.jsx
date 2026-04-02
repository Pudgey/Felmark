import { useState, useEffect } from "react";

const NICHES = ["Design & Branding", "Web Development", "Copywriting", "Marketing", "All"];
const SIGNAL_TYPES = {
  trend: { icon: "↗", color: "#5a9a3c", label: "Trend" },
  opportunity: { icon: "◆", color: "#b07d4f", label: "Opportunity" },
  insight: { icon: "◎", color: "#5b7fa4", label: "Insight" },
  alert: { icon: "!", color: "#c24b38", label: "Alert" },
  client: { icon: "⬡", color: "#8a7e63", label: "Client Signal" },
  market: { icon: "$", color: "#7c6b9e", label: "Market" },
  tool: { icon: "⚙", color: "#7c8594", label: "Tool" },
  community: { icon: "●", color: "#a08472", label: "Community" },
};
const SOURCES = {
  "Felmark Intelligence": { abbr: "FI", color: "#b07d4f" },
  "Dribbble": { abbr: "Dr", color: "#ea4c89" },
  "Behance": { abbr: "Be", color: "#1769ff" },
  "LinkedIn": { abbr: "Li", color: "#5b7fa4" },
  "Twitter / X": { abbr: "X", color: "#4f4c44" },
  "Upwork": { abbr: "Up", color: "#5a9a3c" },
  "ProductHunt": { abbr: "PH", color: "#da552f" },
  "Hacker News": { abbr: "HN", color: "#ff6600" },
  "Awwwards": { abbr: "Aw", color: "#2c2a25" },
  "Industry Report": { abbr: "IR", color: "#7c6b9e" },
  "Google Trends": { abbr: "GT", color: "#4285f4" },
  "Client Activity": { abbr: "CA", color: "#8a7e63" },
};
const FEED = [
  { id:1, type:"trend", source:"Google Trends", time:"2m ago", live:true, headline:"\"Brand guidelines\" searches up 34% this quarter", body:"Google Trends shows steady increase in searches for brand guidelines and visual identity systems, correlating with early-stage startups prioritizing brand consistency before Series A.", tags:["Brand Identity","Growing Demand"], relevance:95, metric:{label:"+34%",sub:"search volume"} },
  { id:2, type:"opportunity", source:"Upwork", time:"5m ago", live:true, headline:"12 new brand identity projects posted in the last hour — avg budget $4.2k", body:"Unusual spike in brand identity postings. Average budget $4,200, up from $3,100 last month. Most from Series A startups in fintech and healthtech.", tags:["Upwork","High Budget","Fintech"], relevance:92, metric:{label:"12 new",sub:"in 1 hour"} },
  { id:3, type:"client", source:"Client Activity", time:"8m ago", live:true, headline:"Meridian Studio posted a job listing for a Marketing Director", body:"Your client Meridian Studio posted a Marketing Director role on LinkedIn. This signals upcoming brand campaigns and potential additional design work. Consider reaching out about expanded scope.", tags:["Meridian Studio","Expansion Signal"], relevance:98, metric:{label:"Your client",sub:"hiring signal"}, isClientSignal:true },
  { id:4, type:"insight", source:"Industry Report", time:"14m ago", headline:"Average freelance design rate now $112/hr in US metros — up 8% YoY", body:"2026 Freelance Design Rate Report: average hourly rates increased to $112/hr, up from $104 in 2025. Brand identity specialists command $125/hr premium. Web design flat at $95/hr.", tags:["Rate Benchmarks","2026 Data"], relevance:88, metric:{label:"$112/hr",sub:"avg US rate"} },
  { id:5, type:"trend", source:"Dribbble", time:"18m ago", headline:"Warm earth tone palettes trending — 3× more saves than cool palettes", body:"Dribbble data shows warm, organic color palettes (earth tones, terracotta, sage, parchment) receiving significantly more engagement than cool-toned work, aligning with the 'organic minimalism' trend.", tags:["Color Trends","Earth Tones"], relevance:82, metric:{label:"3×",sub:"more saves"} },
  { id:6, type:"tool", source:"ProductHunt", time:"22m ago", headline:"Fontshare launches 14 new variable fonts — all free for commercial use", body:"Indian Type Foundry's Fontshare released 14 new variable font families, all free for commercial use. Several serif and sans-serif options suitable for brand identity work.", tags:["Typography","Free Resource"], relevance:75, metric:{label:"14 fonts",sub:"free commercial"} },
  { id:7, type:"market", source:"Felmark Intelligence", time:"25m ago", headline:"Freelancers who offer strategy earn 2.4× more per project than design-only", body:"Felmark data across 12,000 projects: combining brand strategy with design execution yields avg $8,400 vs $3,500 design-only. Strategy also correlates with 40% higher client retention.", tags:["Strategy","Revenue Data"], relevance:91, metric:{label:"2.4×",sub:"revenue multiplier"} },
  { id:8, type:"alert", source:"Hacker News", time:"31m ago", headline:"AI-generated brand kits discussed on HN — 847 upvotes, mixed sentiment", body:"HN post about AI auto-generating brand kits gained traction. Comments mixed — many note AI lacks strategic depth. Both a threat (commoditization) and opportunity (position on strategy).", tags:["AI Disruption","Positioning"], relevance:86, metric:{label:"847",sub:"upvotes"} },
  { id:9, type:"community", source:"Twitter / X", time:"35m ago", headline:"Viral thread: \"Why I charge $10k for brand guidelines\" — 4.2k retweets", body:"Designer's thread breaking down $10k process: discovery workshop ($2k), strategy ($3k), visual identity ($3k), guidelines ($2k). Useful framing for premium pricing justification.", tags:["Pricing","Viral"], relevance:79, metric:{label:"4.2k",sub:"retweets"} },
  { id:10, type:"opportunity", source:"LinkedIn", time:"38m ago", headline:"Nora Kim's company just raised a $2M seed round", body:"Nora Kim (your client) — Coach Kim LLC announced $2M seed led by First Round Capital. Companies that raise typically increase marketing spend within 90 days. Strong upsell signal.", tags:["Nora Kim","Funding Signal"], relevance:96, metric:{label:"$2M",sub:"seed round"}, isClientSignal:true },
  { id:11, type:"insight", source:"Awwwards", time:"42m ago", headline:"Serif typography now appears on 62% of Site of the Day winners", body:"Serif fonts overtook sans-serif for award-winning web design. Cormorant Garamond, Playfair Display, DM Serif Display most common. Strongest in luxury and professional services.", tags:["Typography","Awards"], relevance:73, metric:{label:"62%",sub:"serif dominance"} },
  { id:12, type:"trend", source:"Behance", time:"48m ago", headline:"Minimalist logo projects up 28% on Behance — case studies dominate", body:"Behance trending shows 28% increase in minimalist brand identity case studies. Most-featured work emphasizes process documentation alongside final deliverables.", tags:["Logo Design","Case Studies"], relevance:70, metric:{label:"+28%",sub:"on Behance"} },
  { id:13, type:"client", source:"Client Activity", time:"1h ago", headline:"Bolt Fitness website traffic doubled this week — may need design support", body:"Bolt Fitness experienced 2× spike in website visits, likely from press mention. Current site may not handle scrutiny. Natural opener for web design services.", tags:["Bolt Fitness","Traffic Spike"], relevance:85, metric:{label:"2×",sub:"traffic spike"}, isClientSignal:true },
  { id:14, type:"market", source:"Felmark Intelligence", time:"1h ago", headline:"Q1 2026: Freelance design revenue up 18% — strongest quarter in 3 years", body:"Aggregated Felmark data: freelance designers earned 18% more in Q1 2026 vs Q1 2025. Key drivers: startup spending, brand refresh cycles, preference for independents over agencies.", tags:["Q1 2026","Market Growth"], relevance:77, metric:{label:"+18%",sub:"Q1 revenue"} },
];
const FILTERS = ["All Types","Trends","Opportunities","Client Signals","Market Data","Tools","Community"];
const filterMap = { "All Types":null, "Trends":"trend", "Opportunities":"opportunity", "Client Signals":"client", "Market Data":"market", "Tools":"tool", "Community":"community" };

export default function TheWire() {
  const [activeFilter, setActiveFilter] = useState("All Types");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("Design & Branding");
  const [now, setNow] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i); }, []);

  const filtered = FEED.filter(item => {
    if (activeFilter !== "All Types" && item.type !== filterMap[activeFilter]) return false;
    if (searchQuery && !item.headline.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const selected = FEED.find(i => i.id === selectedItem);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
        .wire{font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink-700);background:var(--parchment);height:100vh;display:flex;flex-direction:column}
        .w-head{padding:12px 24px;border-bottom:1px solid var(--warm-200);flex-shrink:0}
        .w-head-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
        .w-head-left{display:flex;align-items:center;gap:12px}
        .w-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--ink-900)}
        .w-live{display:flex;align-items:center;gap:5px;font-family:var(--mono);font-size:10px;color:#5a9a3c;background:rgba(90,154,60,0.05);border:1px solid rgba(90,154,60,0.1);padding:2px 8px;border-radius:4px}
        .w-live-dot{width:5px;height:5px;border-radius:50%;background:#5a9a3c;animation:lp 2s ease infinite}
        @keyframes lp{0%,100%{opacity:.4}50%{opacity:1}}
        .w-pro{font-family:var(--mono);font-size:9px;color:var(--ember);background:var(--ember-bg);border:1px solid rgba(176,125,79,0.1);padding:2px 8px;border-radius:3px;letter-spacing:.04em}
        .w-head-right{display:flex;align-items:center;gap:8px}
        .w-niche{padding:5px 10px;border:1px solid var(--warm-200);border-radius:5px;font-family:var(--mono);font-size:11px;color:var(--ink-600);background:#fff;cursor:pointer;outline:none}
        .w-search-w{position:relative}.w-search{width:200px;padding:6px 10px 6px 28px;border:1px solid var(--warm-200);border-radius:5px;font-family:inherit;font-size:12px;color:var(--ink-700);outline:none;background:#fff}.w-search:focus{border-color:var(--ember)}.w-search::placeholder{color:var(--warm-400)}.w-search-i{position:absolute;left:8px;top:50%;transform:translateY(-50%);color:var(--ink-300)}
        .w-filters{display:flex;gap:2px}.w-f{padding:4px 12px;border-radius:4px;font-size:12px;border:none;cursor:pointer;font-family:inherit;color:var(--ink-400);background:none;transition:all .06s}.w-f:hover{background:var(--warm-100);color:var(--ink-600)}.w-f.on{background:var(--ink-900);color:var(--parchment)}
        .w-layout{flex:1;display:flex;overflow:hidden}
        .w-feed{flex:1;overflow-y:auto;border-right:1px solid var(--warm-100)}.w-feed::-webkit-scrollbar{width:4px}.w-feed::-webkit-scrollbar-thumb{background:rgba(0,0,0,.04);border-radius:99px}
        .w-fh{display:flex;align-items:center;padding:8px 20px;border-bottom:1px solid var(--warm-200);position:sticky;top:0;background:var(--warm-50);z-index:3;font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.08em}
        .w-fh-time{width:80px;flex-shrink:0}.w-fh-type{width:28px;flex-shrink:0}.w-fh-hl{flex:1}.w-fh-metric{width:80px;flex-shrink:0;text-align:right}.w-fh-src{width:100px;flex-shrink:0;text-align:right}
        .w-item{display:flex;align-items:flex-start;padding:10px 20px;border-bottom:1px solid var(--warm-100);cursor:pointer;transition:background .06s;border-left:2px solid transparent}.w-item:hover{background:var(--warm-50)}.w-item.on{background:var(--ember-bg);border-left-color:var(--ember)}.w-item.is-client{background:rgba(138,126,99,0.02)}
        .w-i-rel{width:3px;flex-shrink:0;align-self:stretch;border-radius:2px;margin-right:8px}
        .w-i-time{width:80px;flex-shrink:0;display:flex;align-items:center;gap:5px}.w-i-live-dot{width:5px;height:5px;border-radius:50%;background:#5a9a3c;animation:lp 2s ease infinite;flex-shrink:0}.w-i-time-t{font-family:var(--mono);font-size:11px;color:var(--ink-300)}
        .w-i-type{width:28px;flex-shrink:0;display:flex;align-items:center;justify-content:center}.w-i-type-icon{width:22px;height:22px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600}
        .w-i-body{flex:1;min-width:0;padding:0 12px}.w-i-hl{font-size:13.5px;color:var(--ink-700);line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.w-item.on .w-i-hl{color:var(--ink-900);font-weight:500}
        .w-i-tags{display:flex;gap:3px;margin-top:4px}.w-i-tag{font-family:var(--mono);font-size:9px;color:var(--ink-400);background:var(--warm-100);padding:0 5px;border-radius:2px}.w-i-tag.ct{color:var(--ember);background:var(--ember-bg);border:1px solid rgba(176,125,79,0.08)}
        .w-i-metric{width:80px;flex-shrink:0;text-align:right}.w-i-mv{font-family:var(--mono);font-size:13px;font-weight:600}.w-i-ms{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
        .w-i-src{width:100px;flex-shrink:0;text-align:right;display:flex;align-items:center;justify-content:flex-end;gap:5px}.w-i-src-ab{width:20px;height:20px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:8px;font-weight:700;color:#fff}.w-i-src-n{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .w-pv{width:400px;flex-shrink:0;overflow-y:auto;background:var(--warm-50);display:flex;flex-direction:column}.w-pv::-webkit-scrollbar{width:4px}.w-pv::-webkit-scrollbar-thumb{background:rgba(0,0,0,.04);border-radius:99px}
        .w-pv-empty{flex:1;display:flex;align-items:center;justify-content:center;text-align:center;color:var(--ink-300);font-size:13px}
        .w-pv-head{padding:20px 24px 16px;border-bottom:1px solid var(--warm-100)}
        .w-pv-sr{display:flex;align-items:center;gap:8px;margin-bottom:10px}.w-pv-sb{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:10px;font-weight:700;color:#fff}.w-pv-sn{font-size:12px;color:var(--ink-500)}.w-pv-st{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .w-pv-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--ink-900);line-height:1.25;margin-bottom:10px}
        .w-pv-tr{display:flex;align-items:center;gap:8px;margin-bottom:10px}.w-pv-tb{font-family:var(--mono);font-size:9px;font-weight:500;padding:2px 8px;border-radius:3px;display:flex;align-items:center;gap:4px}.w-pv-rb{font-family:var(--mono);font-size:9px;color:var(--ink-400);background:var(--warm-100);border:1px solid var(--warm-200);padding:2px 8px;border-radius:3px}
        .w-pv-mc{padding:14px 16px;background:var(--parchment);border:1px solid var(--warm-200);border-radius:8px;text-align:center;margin-bottom:4px}.w-pv-mcv{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;line-height:1}.w-pv-mcs{font-family:var(--mono);font-size:10px;color:var(--ink-400);margin-top:2px}
        .w-pv-body{flex:1;padding:16px 24px}
        .w-pv-sec{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.1em;margin:14px 0 8px;display:flex;align-items:center;gap:8px}.w-pv-sec::after{content:'';flex:1;height:1px;background:var(--warm-200)}
        .w-pv-text{font-size:14px;color:var(--ink-600);line-height:1.7}
        .w-pv-tags{display:flex;gap:4px;flex-wrap:wrap;margin-top:12px}.w-pv-tag{font-family:var(--mono);font-size:9px;color:var(--ink-400);background:var(--warm-100);border:1px solid var(--warm-200);padding:2px 7px;border-radius:3px}
        .w-pv-act{padding:12px 14px;background:var(--parchment);border:1px solid var(--warm-200);border-radius:8px;margin-top:12px}.w-pv-act-l{font-family:var(--mono);font-size:9px;color:var(--ember);text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px}.w-pv-act-t{font-size:13px;color:var(--ink-700);line-height:1.5}.w-pv-act-b{margin-top:8px;padding:6px 16px;border-radius:5px;border:none;background:var(--ember);color:#fff;font-size:12px;font-weight:500;font-family:inherit;cursor:pointer;transition:background .1s}.w-pv-act-b:hover{background:var(--ember-light)}
        .w-foot{padding:6px 24px;border-top:1px solid var(--warm-200);display:flex;align-items:center;justify-content:space-between;font-family:var(--mono);font-size:10px;color:var(--ink-300);flex-shrink:0;background:var(--parchment)}
        .w-foot-l{display:flex;align-items:center;gap:8px}.w-foot-dot{width:5px;height:5px;border-radius:50%;background:#5a9a3c}
      `}</style>
      <div className="wire">
        <div className="w-head">
          <div className="w-head-top">
            <div className="w-head-left">
              <span className="w-title">The Wire</span>
              <span className="w-live"><span className="w-live-dot"/>3 live signals</span>
              <span className="w-pro">PRO</span>
            </div>
            <div className="w-head-right">
              <select className="w-niche" value={selectedNiche} onChange={e=>setSelectedNiche(e.target.value)}>{NICHES.map(n=><option key={n}>{n}</option>)}</select>
              <div className="w-search-w"><span className="w-search-i"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1"/><path d="M8 8l3 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg></span><input className="w-search" placeholder="Search signals..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/></div>
            </div>
          </div>
          <div className="w-filters">{FILTERS.map(f=><button key={f} className={`w-f${activeFilter===f?" on":""}`} onClick={()=>setActiveFilter(f)}>{f}</button>)}</div>
        </div>
        <div className="w-layout">
          <div className="w-feed">
            <div className="w-fh"><span className="w-fh-time">Time</span><span className="w-fh-type"/><span className="w-fh-hl">Signal</span><span className="w-fh-metric">Metric</span><span className="w-fh-src">Source</span></div>
            {filtered.map(item=>{const tc=SIGNAL_TYPES[item.type],sc=SOURCES[item.source];return(
              <div key={item.id} className={`w-item${selectedItem===item.id?" on":""}${item.live?" is-live":""}${item.isClientSignal?" is-client":""}`} onClick={()=>setSelectedItem(item.id)}>
                <div className="w-i-rel" style={{background:tc.color,opacity:item.relevance/100}}/>
                <div className="w-i-time">{item.live&&<span className="w-i-live-dot"/>}<span className="w-i-time-t">{item.time}</span></div>
                <div className="w-i-type"><div className="w-i-type-icon" style={{color:tc.color,background:tc.color+"08",border:`1px solid ${tc.color}15`}}>{tc.icon}</div></div>
                <div className="w-i-body"><div className="w-i-hl">{item.headline}</div><div className="w-i-tags">{item.isClientSignal&&<span className="w-i-tag ct">YOUR CLIENT</span>}{item.tags.slice(0,2).map((t,i)=><span key={i} className="w-i-tag">{t}</span>)}</div></div>
                <div className="w-i-metric">{item.metric&&<><div className="w-i-mv" style={{color:tc.color}}>{item.metric.label}</div><div className="w-i-ms">{item.metric.sub}</div></>}</div>
                <div className="w-i-src"><span className="w-i-src-n">{item.source.length>14?item.source.slice(0,12)+"…":item.source}</span><span className="w-i-src-ab" style={{background:sc?.color||"#9b988f"}}>{sc?.abbr||"?"}</span></div>
              </div>
            )})}
          </div>
          <div className="w-pv">
            {selected?(()=>{const tc=SIGNAL_TYPES[selected.type],sc=SOURCES[selected.source];const actionText=selected.isClientSignal?"Reach out to this client about expanded services while the momentum is fresh.":selected.type==="opportunity"?"Consider adjusting your positioning or outreach to capture this opportunity.":selected.type==="alert"?"Stay informed and consider how this affects your service positioning.":"Use this data to refine your pricing, positioning, or outreach strategy.";return(<>
              <div className="w-pv-head">
                <div className="w-pv-sr"><span className="w-pv-sb" style={{background:sc?.color||"#9b988f"}}>{sc?.abbr}</span><div><div className="w-pv-sn">{selected.source}</div><div className="w-pv-st">{selected.time}</div></div></div>
                <div className="w-pv-title">{selected.headline}</div>
                <div className="w-pv-tr"><span className="w-pv-tb" style={{color:tc.color,background:tc.color+"08",border:`1px solid ${tc.color}15`}}>{tc.icon} {tc.label}</span><span className="w-pv-rb">{selected.relevance}% relevant</span></div>
                {selected.metric&&<div className="w-pv-mc"><div className="w-pv-mcv" style={{color:tc.color}}>{selected.metric.label}</div><div className="w-pv-mcs">{selected.metric.sub}</div></div>}
              </div>
              <div className="w-pv-body">
                <div className="w-pv-sec">analysis</div>
                <div className="w-pv-text">{selected.body}</div>
                <div className="w-pv-tags">{selected.tags.map((t,i)=><span key={i} className="w-pv-tag">{t}</span>)}</div>
                <div className="w-pv-sec">suggested action</div>
                <div className="w-pv-act"><div className="w-pv-act-l">what to do</div><div className="w-pv-act-t">{actionText}</div><button className="w-pv-act-b">{selected.isClientSignal?"Open Workspace":selected.type==="opportunity"?"Create Proposal":"Save Signal"}</button></div>
              </div>
            </>)})():<div className="w-pv-empty"><div><div style={{fontSize:24,color:"var(--warm-300)",marginBottom:8}}>◎</div>Select a signal to read more</div></div>}
          </div>
        </div>
        <div className="w-foot"><div className="w-foot-l"><span className="w-foot-dot"/><span>Live · {filtered.length} signals · {selectedNiche}</span></div><span>{now.toLocaleTimeString()} · Updated every 60s</span></div>
      </div>
    </>
  );
}
