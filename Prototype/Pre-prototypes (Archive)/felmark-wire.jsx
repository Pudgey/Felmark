import { useState, useEffect, useRef } from "react";

const NICHES = ["Design & Branding", "Web Development", "Copywriting", "Marketing", "All"];

const SIGNAL_TYPES = {
  trend: { icon: "↗", color: "#5a9a3c", label: "Trend", bg: "rgba(90,154,60,0.04)" },
  opportunity: { icon: "◆", color: "#b07d4f", label: "Opportunity", bg: "rgba(176,125,79,0.04)" },
  insight: { icon: "◎", color: "#5b7fa4", label: "Insight", bg: "rgba(91,127,164,0.04)" },
  alert: { icon: "!", color: "#c24b38", label: "Alert", bg: "rgba(194,75,56,0.04)" },
  client: { icon: "⬡", color: "#8a7e63", label: "Client Signal", bg: "rgba(138,126,99,0.04)" },
  market: { icon: "$", color: "#7c6b9e", label: "Market", bg: "rgba(124,107,158,0.04)" },
  tool: { icon: "⚙", color: "#7c8594", label: "Tool", bg: "rgba(124,133,148,0.04)" },
  community: { icon: "●", color: "#a08472", label: "Community", bg: "rgba(160,132,114,0.04)" },
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
  { id:1, type:"trend", source:"Google Trends", time:"2m", live:true, headline:"\"Brand guidelines\" searches up 34% this quarter", body:"Google Trends shows steady increase in searches for brand guidelines and visual identity systems. This correlates with the rise of early-stage startups prioritizing brand consistency before Series A fundraising — they're learning that investors respond to polished brands.", tags:["Brand Identity","Growing Demand","Startups"], relevance:95, metric:{label:"+34%",sub:"search volume"}, spark:[40,42,48,52,58,65,72,80,88,95,102,115], group:"live" },
  { id:2, type:"opportunity", source:"Upwork", time:"5m", live:true, headline:"12 new brand identity projects posted in the last hour — avg budget $4.2k", body:"Unusual spike in brand identity project postings on Upwork. Average budget is $4,200, up from $3,100 last month. Most are from Series A startups in fintech and healthtech verticals. Several mention 'brand guidelines' as a key deliverable — directly aligned with your top service.", tags:["Upwork","High Budget","Fintech","Healthtech"], relevance:92, metric:{label:"12 new",sub:"in 1 hour"}, spark:[2,3,2,4,3,5,4,6,5,8,7,12], group:"live" },
  { id:3, type:"client", source:"Client Activity", time:"8m", live:true, headline:"Meridian Studio posted a job listing for a Marketing Director", body:"Your client Meridian Studio has posted a job listing for a Marketing Director on LinkedIn. This could signal upcoming brand campaigns and additional design work. Companies that hire marketing leadership typically increase creative spend by 40–60% within the first quarter. Consider reaching out about expanded scope.", tags:["Meridian Studio","Expansion Signal","Upsell"], relevance:98, metric:{label:"Your client",sub:"hiring signal"}, isClientSignal:true, group:"live", relatedAction:"Open Meridian workspace and draft an expanded scope proposal" },
  { id:4, type:"insight", source:"Industry Report", time:"14m", headline:"Average freelance design rate now $112/hr in US metros — up 8% YoY", body:"The 2026 Freelance Design Rate Report shows average hourly rates have increased to $112/hr for US metro-based designers, up from $104/hr in 2025. Brand identity specialists command a premium at $125/hr. Web design rates are flat at $95/hr. Strategy-inclusive packages show the highest growth at 14% YoY.", tags:["Rate Benchmarks","2026 Data","Pricing"], relevance:88, metric:{label:"$112/hr",sub:"avg US rate"}, spark:[82,85,88,90,92,95,98,100,104,104,108,112], group:"today" },
  { id:5, type:"trend", source:"Dribbble", time:"18m", headline:"Warm earth tone palettes trending — 3× more saves than cool palettes", body:"Dribbble's trending data shows warm, organic color palettes (earth tones, terracotta, sage, parchment) are receiving significantly more engagement than cool-toned work. This aligns with the broader 'organic minimalism' trend in brand design that started in late 2025.", tags:["Color Trends","Earth Tones","Organic Minimalism"], relevance:82, metric:{label:"3×",sub:"more saves"}, group:"today" },
  { id:6, type:"tool", source:"ProductHunt", time:"22m", headline:"Fontshare launches 14 new variable fonts — all free for commercial use", body:"Indian Type Foundry's Fontshare just released 14 new variable font families, all free for commercial use. Includes several serif and sans-serif options suitable for brand identity work. Variable fonts reduce page load times and provide more design flexibility.", tags:["Typography","Free Resource","Variable Fonts"], relevance:75, metric:{label:"14 fonts",sub:"free commercial"}, group:"today" },
  { id:7, type:"market", source:"Felmark Intelligence", time:"25m", headline:"Freelancers who offer strategy earn 2.4× more per project than design-only", body:"Felmark's internal data across 12,000 freelancer projects shows that combining brand strategy with design execution results in an average project value of $8,400 vs $3,500 for design-only work. Adding strategy also correlates with 40% higher client retention and 2.1× more referrals.", tags:["Strategy","Revenue Data","Felmark Data","Retention"], relevance:91, metric:{label:"2.4×",sub:"revenue multiplier"}, spark:[3500,3800,4200,4800,5200,5800,6400,7000,7200,7800,8000,8400], group:"today" },
  { id:8, type:"alert", source:"Hacker News", time:"31m", headline:"AI-generated brand kits discussed on HN — 847 upvotes, mixed sentiment", body:"A Hacker News post about AI tools that auto-generate brand identity kits has gained significant traction. Comments are mixed — many note AI output lacks strategic depth and cultural nuance. This represents both a threat (commoditization of basic design) and an opportunity (positioning on strategy, not just execution). Top comment: 'AI can generate a logo but it can't tell you why that logo matters.'", tags:["AI Disruption","Positioning","Strategy"], relevance:86, metric:{label:"847",sub:"upvotes"}, spark:[0,12,45,120,280,420,560,640,720,780,820,847], group:"today" },
  { id:9, type:"community", source:"Twitter / X", time:"35m", headline:"Viral thread: \"Why I charge $10k for brand guidelines\" — 4.2k retweets", body:"A freelance designer's thread breaking down their $10k brand guidelines process is going viral. Key points: discovery workshop ($2k value), strategy document ($3k), visual identity ($3k), guidelines doc ($2k). The thread emphasizes that the deliverable isn't a PDF — it's the strategic thinking that goes into it.", tags:["Pricing","Viral","Brand Guidelines","Value Framing"], relevance:79, metric:{label:"4.2k",sub:"retweets"}, spark:[10,80,320,800,1400,2100,2800,3200,3500,3800,4000,4200], group:"today" },
  { id:10, type:"opportunity", source:"LinkedIn", time:"38m", headline:"Nora Kim's company just raised a $2M seed round", body:"Nora Kim (your client) — Coach Kim LLC just announced a $2M seed round led by First Round Capital. Companies that raise typically increase their marketing and brand spend by 50–80% within 90 days. This is a strong signal to propose expanded services — website redesign, brand refresh, content strategy.", tags:["Nora Kim","Funding Signal","Upsell","First Round"], relevance:96, metric:{label:"$2M",sub:"seed round"}, isClientSignal:true, group:"today", relatedAction:"Draft an expanded services proposal for Nora Kim" },
  { id:11, type:"insight", source:"Awwwards", time:"42m", headline:"Serif typography now appears on 62% of Awwwards Site of the Day winners", body:"Serif fonts have overtaken sans-serif as the dominant choice for award-winning web design. Cormorant Garamond, Playfair Display, and DM Serif Display are the most common. This trend is strongest in luxury, lifestyle, and professional services sectors.", tags:["Typography","Web Design","Awards","Serif"], relevance:73, metric:{label:"62%",sub:"serif dominance"}, group:"earlier" },
  { id:12, type:"trend", source:"Behance", time:"48m", headline:"Minimalist logo projects up 28% on Behance — case studies dominate", body:"Behance's trending projects show a 28% increase in minimalist logo and brand identity case studies. The most-featured work emphasizes process documentation, showing sketches, iterations, and strategy alongside final deliverables. Process-heavy case studies get 3.2× more appreciations.", tags:["Logo Design","Case Studies","Process"], relevance:70, metric:{label:"+28%",sub:"on Behance"}, group:"earlier" },
  { id:13, type:"client", source:"Client Activity", time:"1h", headline:"Bolt Fitness website traffic doubled this week — may need design support", body:"Traffic monitoring shows Bolt Fitness experienced a 2× spike in website visits this week, likely from a press mention or viral social post. Their current site may not handle the scrutiny. This is a natural conversation opener for web design services.", tags:["Bolt Fitness","Traffic Spike","Web Design"], relevance:85, metric:{label:"2×",sub:"traffic spike"}, isClientSignal:true, group:"earlier", relatedAction:"Reach out to Bolt about a website refresh" },
  { id:14, type:"market", source:"Felmark Intelligence", time:"1h", headline:"Q1 2026: Freelance design revenue up 18% — strongest quarter in 3 years", body:"Aggregated Felmark data shows freelance designers earned 18% more in Q1 2026 compared to Q1 2025, the strongest growth since 2023. Key drivers: increased startup spending, brand refresh cycles, and growing preference for independent contractors over agencies.", tags:["Q1 2026","Market Growth","Industry"], relevance:77, metric:{label:"+18%",sub:"Q1 revenue"}, spark:[72,74,76,78,80,84,86,88,90,94,96,100], group:"earlier" },
];

const FILTERS = ["All","Trends","Opportunities","Client Signals","Market","Tools","Community","Alerts"];
const filterMap = { "All":null, "Trends":"trend", "Opportunities":"opportunity", "Client Signals":"client", "Market":"market", "Tools":"tool", "Community":"community", "Alerts":"alert" };

// Mini sparkline component
function Spark({ data, color, width = 56, height = 20 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - 2 - ((v - min) / range) * (height - 4);
    return `${x},${y}`;
  }).join(" ");
  const lastPt = points.split(" ").pop().split(",");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", flexShrink: 0 }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx={lastPt[0]} cy={lastPt[1]} r="2" fill={color} opacity="0.7" />
    </svg>
  );
}

export default function TheWire() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("Design & Branding");
  const [bookmarked, setBookmarked] = useState(new Set([3, 7, 10]));
  const [now, setNow] = useState(new Date());
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i); }, []);

  const toggleBookmark = (id, e) => { e.stopPropagation(); setBookmarked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };

  const filtered = FEED.filter(item => {
    if (activeFilter !== "All" && item.type !== filterMap[activeFilter]) return false;
    if (searchQuery && !item.headline.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const liveItems = filtered.filter(i => i.group === "live");
  const todayItems = filtered.filter(i => i.group === "today");
  const earlierItems = filtered.filter(i => i.group === "earlier");

  const selected = FEED.find(i => i.id === selectedItem);
  const clientSignals = FEED.filter(f => f.isClientSignal).length;
  const avgRelevance = Math.round(FEED.reduce((s, f) => s + f.relevance, 0) / FEED.length);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
        .w{font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink-700);background:var(--parchment);height:100vh;display:flex;flex-direction:column}

        /* ── Header ── */
        .w-head{padding:14px 24px 0;flex-shrink:0}
        .w-head-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
        .w-head-left{display:flex;align-items:center;gap:12px}
        .w-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:var(--ink-900)}
        .w-live{display:flex;align-items:center;gap:5px;font-family:var(--mono);font-size:10px;color:#5a9a3c;background:rgba(90,154,60,0.04);border:1px solid rgba(90,154,60,0.08);padding:3px 10px;border-radius:5px}
        .w-live-dot{width:6px;height:6px;border-radius:50%;background:#5a9a3c;animation:lp 2s ease infinite;box-shadow:0 0 0 2px rgba(90,154,60,0.1)}
        @keyframes lp{0%,100%{opacity:.4}50%{opacity:1}}
        .w-pro{font-family:var(--mono);font-size:9px;color:var(--ember);background:var(--ember-bg);border:1px solid rgba(176,125,79,0.08);padding:3px 10px;border-radius:4px;letter-spacing:.04em;font-weight:500}
        .w-head-right{display:flex;align-items:center;gap:8px}
        .w-niche{padding:6px 12px;border:1px solid var(--warm-200);border-radius:6px;font-family:var(--mono);font-size:11px;color:var(--ink-600);background:#fff;cursor:pointer;outline:none}
        .w-search-w{position:relative}
        .w-search{width:220px;padding:7px 12px 7px 30px;border:1px solid var(--warm-200);border-radius:6px;font-family:inherit;font-size:13px;color:var(--ink-700);outline:none;background:#fff}
        .w-search:focus{border-color:var(--ember);box-shadow:0 0 0 3px rgba(176,125,79,0.04)}
        .w-search::placeholder{color:var(--warm-400)}
        .w-search-i{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--ink-300)}

        /* ── Stats ticker ── */
        .w-ticker{display:flex;gap:0;margin:0 -24px;padding:0 24px;border-bottom:1px solid var(--warm-200);overflow-x:auto}
        .w-ticker::-webkit-scrollbar{display:none}
        .w-tick{padding:10px 18px;border-right:1px solid var(--warm-100);display:flex;align-items:center;gap:8px;flex-shrink:0;cursor:default;transition:background .06s}
        .w-tick:hover{background:var(--warm-50)}
        .w-tick:last-child{border-right:none}
        .w-tick-val{font-family:var(--mono);font-size:16px;font-weight:600;line-height:1}
        .w-tick-info{display:flex;flex-direction:column}
        .w-tick-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.06em}
        .w-tick-change{font-family:var(--mono);font-size:9px;font-weight:500}
        .w-tick-change.up{color:#5a9a3c}.w-tick-change.down{color:#c24b38}

        /* ── Filters ── */
        .w-filters{display:flex;gap:3px;padding:10px 24px;border-bottom:1px solid var(--warm-100);flex-shrink:0;overflow-x:auto}
        .w-filters::-webkit-scrollbar{display:none}
        .w-f{padding:5px 14px;border-radius:5px;font-size:12px;border:1px solid transparent;cursor:pointer;font-family:inherit;color:var(--ink-400);background:none;transition:all .06s;white-space:nowrap}
        .w-f:hover{background:var(--warm-100);color:var(--ink-600)}
        .w-f.on{background:var(--ink-900);color:var(--parchment);border-color:var(--ink-900)}

        /* ── Layout ── */
        .w-layout{flex:1;display:flex;overflow:hidden}

        /* ── Feed ── */
        .w-feed{flex:1;overflow-y:auto;border-right:1px solid var(--warm-100)}
        .w-feed::-webkit-scrollbar{width:4px}
        .w-feed::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.04);border-radius:99px}

        /* Group label */
        .w-group{display:flex;align-items:center;gap:8px;padding:10px 20px 6px;font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.1em}
        .w-group::after{content:'';flex:1;height:1px;background:var(--warm-100)}
        .w-group-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
        .w-group-count{font-size:9px;color:var(--ink-300);background:var(--warm-100);padding:0 5px;border-radius:8px}

        /* ── Signal item ── */
        .w-item{display:flex;align-items:stretch;padding:0;border-bottom:1px solid var(--warm-100);cursor:pointer;transition:all .08s;position:relative}
        .w-item:hover{background:var(--warm-50)}
        .w-item.on{background:var(--ember-bg)}

        .w-item-rel{width:3px;flex-shrink:0;transition:opacity .15s}
        .w-item-inner{flex:1;display:flex;align-items:flex-start;padding:12px 16px 12px 12px;gap:10px}

        /* Type icon */
        .w-item-type{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0;margin-top:1px;transition:all .1s}

        /* Body */
        .w-item-body{flex:1;min-width:0}
        .w-item-top{display:flex;align-items:center;gap:6px;margin-bottom:3px}
        .w-item-source{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
        .w-item-time{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
        .w-item-client-badge{font-family:var(--mono);font-size:8px;color:var(--ember);background:var(--ember-bg);padding:0 5px;border-radius:2px;border:1px solid rgba(176,125,79,0.08);font-weight:500}
        .w-item-hl{font-size:14px;color:var(--ink-700);line-height:1.45;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis}
        .w-item.on .w-item-hl{color:var(--ink-900);font-weight:500}
        .w-item-tags{display:flex;gap:3px;flex-wrap:wrap}
        .w-item-tag{font-family:var(--mono);font-size:9px;color:var(--ink-400);background:var(--warm-100);padding:0 6px;border-radius:2px}

        /* Right column */
        .w-item-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;min-width:90px}
        .w-item-metric-val{font-family:var(--mono);font-size:14px;font-weight:600;line-height:1}
        .w-item-metric-sub{font-family:var(--mono);font-size:9px;color:var(--ink-300)}

        /* Relevance bar */
        .w-item-relevance{width:100%;height:2px;background:var(--warm-200);border-radius:1px;overflow:hidden;margin-top:2px}
        .w-item-relevance-fill{height:100%;border-radius:1px;transition:width .3s}

        /* Hover actions */
        .w-item-actions{position:absolute;right:12px;top:10px;display:flex;gap:3px;opacity:0;transition:opacity .08s}
        .w-item:hover .w-item-actions{opacity:1}
        .w-item-act{width:24px;height:24px;border-radius:5px;border:1px solid var(--warm-200);background:#fff;cursor:pointer;color:var(--ink-400);display:flex;align-items:center;justify-content:center;font-size:10px;transition:all .06s}
        .w-item-act:hover{background:var(--warm-100);color:var(--ink-600)}
        .w-item-act.bookmarked{color:var(--ember);border-color:rgba(176,125,79,0.2);background:var(--ember-bg)}

        /* ═══ PREVIEW ═══ */
        .w-pv{width:420px;flex-shrink:0;overflow-y:auto;background:var(--warm-50);display:flex;flex-direction:column}
        .w-pv::-webkit-scrollbar{width:4px}
        .w-pv::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.04);border-radius:99px}

        .w-pv-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:var(--ink-300);padding:40px}
        .w-pv-empty-icon{font-size:32px;color:var(--warm-300);margin-bottom:10px}
        .w-pv-empty-title{font-size:15px;color:var(--ink-400);font-weight:500;margin-bottom:4px}
        .w-pv-empty-sub{font-size:13px;color:var(--ink-300)}

        .w-pv-head{padding:24px 24px 18px;border-bottom:1px solid var(--warm-100)}
        .w-pv-source-row{display:flex;align-items:center;gap:8px;margin-bottom:12px}
        .w-pv-source-badge{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:11px;font-weight:700;color:#fff;flex-shrink:0}
        .w-pv-source-name{font-size:13px;color:var(--ink-500)}
        .w-pv-source-time{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .w-pv-bookmark{margin-left:auto;width:28px;height:28px;border-radius:6px;border:1px solid var(--warm-200);background:#fff;cursor:pointer;color:var(--ink-400);display:flex;align-items:center;justify-content:center;font-size:12px;transition:all .06s;flex-shrink:0}
        .w-pv-bookmark:hover{background:var(--warm-100)}
        .w-pv-bookmark.on{color:var(--ember);border-color:rgba(176,125,79,0.2);background:var(--ember-bg)}

        .w-pv-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:var(--ink-900);line-height:1.25;margin-bottom:12px}

        .w-pv-badges{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px}
        .w-pv-type-badge{font-family:var(--mono);font-size:9px;font-weight:500;padding:3px 10px;border-radius:4px;display:flex;align-items:center;gap:4px}
        .w-pv-rel-badge{font-family:var(--mono);font-size:9px;color:var(--ink-400);background:var(--warm-100);border:1px solid var(--warm-200);padding:3px 10px;border-radius:4px;display:flex;align-items:center;gap:4px}
        .w-pv-rel-bar{width:32px;height:3px;background:var(--warm-200);border-radius:2px;overflow:hidden}
        .w-pv-rel-fill{height:100%;border-radius:2px}

        /* Metric hero */
        .w-pv-metric{padding:18px 20px;background:var(--parchment);border:1px solid var(--warm-200);border-radius:10px;display:flex;align-items:center;gap:16px;margin-bottom:4px}
        .w-pv-metric-left{text-align:center;flex-shrink:0}
        .w-pv-metric-val{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;line-height:1}
        .w-pv-metric-sub{font-family:var(--mono);font-size:10px;color:var(--ink-400);margin-top:2px}
        .w-pv-metric-spark{flex:1}

        .w-pv-body{flex:1;padding:16px 24px 24px}
        .w-pv-sec{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.1em;margin:18px 0 8px;display:flex;align-items:center;gap:8px}
        .w-pv-sec::after{content:'';flex:1;height:1px;background:var(--warm-200)}
        .w-pv-text{font-size:15px;color:var(--ink-600);line-height:1.7}
        .w-pv-tags{display:flex;gap:4px;flex-wrap:wrap;margin-top:12px}
        .w-pv-tag{font-family:var(--mono);font-size:9px;color:var(--ink-400);background:var(--warm-100);border:1px solid var(--warm-200);padding:2px 8px;border-radius:3px;cursor:default;transition:all .06s}
        .w-pv-tag:hover{border-color:var(--warm-300);background:var(--warm-200)}

        /* Suggested action */
        .w-pv-action{padding:16px 18px;background:var(--parchment);border:1px solid var(--warm-200);border-radius:10px;margin-top:12px}
        .w-pv-action-label{font-family:var(--mono);font-size:9px;color:var(--ember);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;display:flex;align-items:center;gap:5px}
        .w-pv-action-label::before{content:'';width:4px;height:4px;border-radius:1px;background:var(--ember);flex-shrink:0}
        .w-pv-action-text{font-size:14px;color:var(--ink-700);line-height:1.55;margin-bottom:10px}
        .w-pv-action-btn{padding:8px 20px;border-radius:6px;border:none;background:var(--ember);color:#fff;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;transition:background .1s;display:inline-flex;align-items:center;gap:5px}
        .w-pv-action-btn:hover{background:var(--ember-light)}
        .w-pv-action-secondary{padding:8px 16px;border-radius:6px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-600);font-size:12px;font-family:inherit;cursor:pointer;margin-left:6px}
        .w-pv-action-secondary:hover{background:var(--warm-50)}

        /* Related signals */
        .w-pv-related{display:flex;flex-direction:column;gap:4px;margin-top:8px}
        .w-pv-related-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;transition:background .06s}
        .w-pv-related-item:hover{background:var(--warm-100)}
        .w-pv-related-icon{width:20px;height:20px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0}
        .w-pv-related-text{font-size:12px;color:var(--ink-500);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .w-pv-related-time{font-family:var(--mono);font-size:9px;color:var(--ink-300);flex-shrink:0}

        /* ── Footer ── */
        .w-foot{padding:7px 24px;border-top:1px solid var(--warm-200);display:flex;align-items:center;justify-content:space-between;font-family:var(--mono);font-size:10px;color:var(--ink-300);flex-shrink:0}
        .w-foot-l{display:flex;align-items:center;gap:8px}
        .w-foot-dot{width:5px;height:5px;border-radius:50%;background:#5a9a3c;animation:lp 2s ease infinite}
      `}</style>

      <div className="w">
        {/* Header */}
        <div className="w-head">
          <div className="w-head-top">
            <div className="w-head-left">
              <span className="w-title">The Wire</span>
              <span className="w-live"><span className="w-live-dot" />{liveItems.length} live</span>
              <span className="w-pro">PRO</span>
            </div>
            <div className="w-head-right">
              <select className="w-niche" value={selectedNiche} onChange={e => setSelectedNiche(e.target.value)}>
                {NICHES.map(n => <option key={n}>{n}</option>)}
              </select>
              <div className="w-search-w">
                <span className="w-search-i"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/><path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></span>
                <input className="w-search" placeholder="Search signals..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Stats ticker */}
          <div className="w-ticker">
            <div className="w-tick">
              <span className="w-tick-val" style={{ color: "#5a9a3c" }}>{filtered.length}</span>
              <div className="w-tick-info"><span className="w-tick-label">Signals</span><span className="w-tick-change up">+4 new today</span></div>
            </div>
            <div className="w-tick">
              <span className="w-tick-val" style={{ color: "var(--ember)" }}>{clientSignals}</span>
              <div className="w-tick-info"><span className="w-tick-label">Client signals</span><span className="w-tick-change up">Action needed</span></div>
            </div>
            <div className="w-tick">
              <span className="w-tick-val" style={{ color: "var(--ink-800)" }}>{avgRelevance}%</span>
              <div className="w-tick-info"><span className="w-tick-label">Avg relevance</span></div>
            </div>
            <div className="w-tick">
              <span className="w-tick-val" style={{ color: "#5b7fa4" }}>$112</span>
              <div className="w-tick-info"><span className="w-tick-label">Avg market rate</span><span className="w-tick-change up">↑ 8% YoY</span></div>
            </div>
            <div className="w-tick">
              <span className="w-tick-val" style={{ color: "#5a9a3c" }}>+34%</span>
              <div className="w-tick-info"><span className="w-tick-label">Niche demand</span><span className="w-tick-change up">Growing</span></div>
            </div>
            <div className="w-tick">
              <span className="w-tick-val" style={{ color: "#7c6b9e" }}>2.4×</span>
              <div className="w-tick-info"><span className="w-tick-label">Strategy premium</span></div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="w-filters">
          {FILTERS.map(f => (
            <button key={f} className={`w-f${activeFilter === f ? " on" : ""}`} onClick={() => setActiveFilter(f)}>{f}</button>
          ))}
        </div>

        <div className="w-layout">
          {/* Feed */}
          <div className="w-feed">
            {/* Live group */}
            {liveItems.length > 0 && (
              <>
                <div className="w-group"><span className="w-group-dot" style={{ background: "#5a9a3c", boxShadow: "0 0 0 2px rgba(90,154,60,0.15)", animation: "lp 2s ease infinite" }} />Live now<span className="w-group-count">{liveItems.length}</span></div>
                {liveItems.map(item => <SignalItem key={item.id} item={item} selected={selectedItem} onSelect={setSelectedItem} hovered={hoveredItem} onHover={setHoveredItem} bookmarked={bookmarked} onBookmark={toggleBookmark} />)}
              </>
            )}

            {/* Today group */}
            {todayItems.length > 0 && (
              <>
                <div className="w-group"><span className="w-group-dot" style={{ background: "var(--ink-300)" }} />Today<span className="w-group-count">{todayItems.length}</span></div>
                {todayItems.map(item => <SignalItem key={item.id} item={item} selected={selectedItem} onSelect={setSelectedItem} hovered={hoveredItem} onHover={setHoveredItem} bookmarked={bookmarked} onBookmark={toggleBookmark} />)}
              </>
            )}

            {/* Earlier group */}
            {earlierItems.length > 0 && (
              <>
                <div className="w-group"><span className="w-group-dot" style={{ background: "var(--warm-300)" }} />Earlier<span className="w-group-count">{earlierItems.length}</span></div>
                {earlierItems.map(item => <SignalItem key={item.id} item={item} selected={selectedItem} onSelect={setSelectedItem} hovered={hoveredItem} onHover={setHoveredItem} bookmarked={bookmarked} onBookmark={toggleBookmark} />)}
              </>
            )}
          </div>

          {/* Preview */}
          <div className="w-pv">
            {selected ? (() => {
              const tc = SIGNAL_TYPES[selected.type];
              const sc = SOURCES[selected.source];
              const actionText = selected.relatedAction || (selected.isClientSignal ? "Reach out to this client about expanded services while the momentum is fresh." : selected.type === "opportunity" ? "Consider adjusting your positioning or outreach to capture this opportunity." : selected.type === "alert" ? "Stay informed and consider how this affects your service positioning." : "Use this data to refine your pricing, positioning, or outreach strategy.");
              const related = FEED.filter(f => f.id !== selected.id && f.tags.some(t => selected.tags.includes(t))).slice(0, 3);

              return (
                <>
                  <div className="w-pv-head">
                    <div className="w-pv-source-row">
                      <span className="w-pv-source-badge" style={{ background: sc?.color || "#9b988f" }}>{sc?.abbr}</span>
                      <div>
                        <div className="w-pv-source-name">{selected.source}</div>
                        <div className="w-pv-source-time">{selected.time} ago · {selectedNiche}</div>
                      </div>
                      <button className={`w-pv-bookmark${bookmarked.has(selected.id) ? " on" : ""}`}
                        onClick={() => setBookmarked(prev => { const n = new Set(prev); n.has(selected.id) ? n.delete(selected.id) : n.add(selected.id); return n; })}>
                        {bookmarked.has(selected.id) ? "★" : "☆"}
                      </button>
                    </div>

                    <div className="w-pv-title">{selected.headline}</div>

                    <div className="w-pv-badges">
                      <span className="w-pv-type-badge" style={{ color: tc.color, background: tc.bg, border: `1px solid ${tc.color}15` }}>{tc.icon} {tc.label}</span>
                      <span className="w-pv-rel-badge">
                        {selected.relevance}% relevant
                        <span className="w-pv-rel-bar"><span className="w-pv-rel-fill" style={{ width: `${selected.relevance}%`, background: selected.relevance >= 90 ? "#5a9a3c" : selected.relevance >= 75 ? "var(--ember)" : "var(--ink-400)" }} /></span>
                      </span>
                      {selected.isClientSignal && <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ember)", background: "var(--ember-bg)", padding: "3px 8px", borderRadius: 4, border: "1px solid rgba(176,125,79,0.08)", fontWeight: 500 }}>YOUR CLIENT</span>}
                    </div>

                    {/* Hero metric */}
                    {selected.metric && (
                      <div className="w-pv-metric">
                        <div className="w-pv-metric-left">
                          <div className="w-pv-metric-val" style={{ color: tc.color }}>{selected.metric.label}</div>
                          <div className="w-pv-metric-sub">{selected.metric.sub}</div>
                        </div>
                        {selected.spark && (
                          <div className="w-pv-metric-spark">
                            <Spark data={selected.spark} color={tc.color} width={200} height={48} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="w-pv-body">
                    <div className="w-pv-sec">analysis</div>
                    <div className="w-pv-text">{selected.body}</div>
                    <div className="w-pv-tags">
                      {selected.tags.map((t, i) => <span key={i} className="w-pv-tag">{t}</span>)}
                    </div>

                    <div className="w-pv-sec">suggested action</div>
                    <div className="w-pv-action">
                      <div className="w-pv-action-label">what to do</div>
                      <div className="w-pv-action-text">{actionText}</div>
                      <button className="w-pv-action-btn">
                        {selected.isClientSignal ? "→ Open Workspace" : selected.type === "opportunity" ? "◆ Create Proposal" : "★ Save Signal"}
                      </button>
                      <button className="w-pv-action-secondary">Dismiss</button>
                    </div>

                    {/* Related signals */}
                    {related.length > 0 && (
                      <>
                        <div className="w-pv-sec">related signals</div>
                        <div className="w-pv-related">
                          {related.map(r => {
                            const rtc = SIGNAL_TYPES[r.type];
                            return (
                              <div key={r.id} className="w-pv-related-item" onClick={() => setSelectedItem(r.id)}>
                                <div className="w-pv-related-icon" style={{ background: rtc.bg, color: rtc.color, border: `1px solid ${rtc.color}12` }}>{rtc.icon}</div>
                                <span className="w-pv-related-text">{r.headline}</span>
                                <span className="w-pv-related-time">{r.time}</span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </>
              );
            })() : (
              <div className="w-pv-empty">
                <div className="w-pv-empty-icon">◎</div>
                <div className="w-pv-empty-title">Select a signal</div>
                <div className="w-pv-empty-sub">Click any signal to see the full analysis and suggested actions</div>
              </div>
            )}
          </div>
        </div>

        <div className="w-foot">
          <div className="w-foot-l"><span className="w-foot-dot" /><span>Live · {filtered.length} signals · {selectedNiche}</span></div>
          <span>{now.toLocaleTimeString()} · Updated every 60s</span>
        </div>
      </div>
    </>
  );
}

// Signal item component
function SignalItem({ item, selected, onSelect, hovered, onHover, bookmarked, onBookmark }) {
  const tc = SIGNAL_TYPES[item.type];
  const sc = SOURCES[item.source];
  const isOn = selected === item.id;
  const isBookmarked = bookmarked.has(item.id);

  return (
    <div className={`w-item${isOn ? " on" : ""}`}
      onClick={() => onSelect(item.id)}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}>
      <div className="w-item-rel" style={{ background: tc.color, opacity: item.relevance / 100 }} />
      <div className="w-item-inner">
        <div className="w-item-type" style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.color}12` }}>{tc.icon}</div>
        <div className="w-item-body">
          <div className="w-item-top">
            <span className="w-item-source">{sc?.abbr || "?"}</span>
            <span className="w-item-time">{item.time}{item.live ? "" : " ago"}</span>
            {item.isClientSignal && <span className="w-item-client-badge">YOUR CLIENT</span>}
          </div>
          <div className="w-item-hl">{item.headline}</div>
          <div className="w-item-tags">
            {item.tags.slice(0, 3).map((t, i) => <span key={i} className="w-item-tag">{t}</span>)}
          </div>
        </div>
        <div className="w-item-right">
          {item.metric && (
            <>
              <span className="w-item-metric-val" style={{ color: tc.color }}>{item.metric.label}</span>
              <span className="w-item-metric-sub">{item.metric.sub}</span>
            </>
          )}
          {item.spark && <Spark data={item.spark} color={tc.color} width={48} height={16} />}
          <div className="w-item-relevance">
            <div className="w-item-relevance-fill" style={{ width: `${item.relevance}%`, background: item.relevance >= 90 ? "#5a9a3c" : item.relevance >= 75 ? "var(--ember)" : "var(--ink-400)" }} />
          </div>
        </div>
      </div>
      <div className="w-item-actions">
        <button className={`w-item-act${isBookmarked ? " bookmarked" : ""}`} onClick={e => onBookmark(item.id, e)} title="Bookmark">
          {isBookmarked ? "★" : "☆"}
        </button>
        <button className="w-item-act" title="Share">↗</button>
      </div>
    </div>
  );
}
