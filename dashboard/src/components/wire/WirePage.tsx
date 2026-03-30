"use client";

import { useState, useEffect } from "react";
import type { Workspace } from "@/lib/types";
import type { WireService } from "@/lib/wire-context";
import styles from "./WirePage.module.css";

const NICHES = ["Design & Branding", "Web Development", "Copywriting", "Marketing", "All"];

const SIGNAL_TYPES: Record<string, { icon: string; color: string; label: string; bg: string }> = {
  trend: { icon: "↗", color: "#5a9a3c", label: "Trend", bg: "rgba(90,154,60,0.04)" },
  opportunity: { icon: "◆", color: "#b07d4f", label: "Opportunity", bg: "rgba(176,125,79,0.04)" },
  insight: { icon: "◎", color: "#5b7fa4", label: "Insight", bg: "rgba(91,127,164,0.04)" },
  alert: { icon: "!", color: "#c24b38", label: "Alert", bg: "rgba(194,75,56,0.04)" },
  client: { icon: "⬡", color: "#8a7e63", label: "Client Signal", bg: "rgba(138,126,99,0.04)" },
  market: { icon: "$", color: "#7c6b9e", label: "Market", bg: "rgba(124,107,158,0.04)" },
  tool: { icon: "⚙", color: "#7c8594", label: "Tool", bg: "rgba(124,133,148,0.04)" },
  community: { icon: "●", color: "#a08472", label: "Community", bg: "rgba(160,132,114,0.04)" },
};

const SOURCES: Record<string, { abbr: string; color: string }> = {
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

interface Signal {
  id: number; type: string; source: string; time: string; live?: boolean;
  headline: string; body: string; tags: string[]; relevance: number;
  metric?: { label: string; sub: string }; spark?: number[];
  isClientSignal?: boolean; group: string; relatedAction?: string;
}

const FEED: Signal[] = [
  { id:1, type:"trend", source:"Google Trends", time:"2m", live:true, headline:"\"Brand guidelines\" searches up 34% this quarter", body:"Google Trends shows steady increase in searches for brand guidelines and visual identity systems. This correlates with the rise of early-stage startups prioritizing brand consistency before Series A fundraising — they're learning that investors respond to polished brands.", tags:["Brand Identity","Growing Demand","Startups"], relevance:95, metric:{label:"+34%",sub:"search volume"}, spark:[40,42,48,52,58,65,72,80,88,95,102,115], group:"live" },
  { id:2, type:"opportunity", source:"Upwork", time:"5m", live:true, headline:"12 new brand identity projects posted in the last hour — avg budget $4.2k", body:"Unusual spike in brand identity project postings on Upwork. Average budget is $4,200, up from $3,100 last month. Most are from Series A startups in fintech and healthtech verticals. Several mention 'brand guidelines' as a key deliverable — directly aligned with your top service.", tags:["Upwork","High Budget","Fintech","Healthtech"], relevance:92, metric:{label:"12 new",sub:"in 1 hour"}, spark:[2,3,2,4,3,5,4,6,5,8,7,12], group:"live" },
  { id:3, type:"client", source:"Client Activity", time:"8m", live:true, headline:"Meridian Studio posted a job listing for a Marketing Director", body:"Your client Meridian Studio has posted a job listing for a Marketing Director on LinkedIn. This could signal upcoming brand campaigns and additional design work. Companies that hire marketing leadership typically increase creative spend by 40–60% within the first quarter.", tags:["Meridian Studio","Expansion Signal","Upsell"], relevance:98, metric:{label:"Your client",sub:"hiring signal"}, isClientSignal:true, group:"live", relatedAction:"Open Meridian workspace and draft an expanded scope proposal" },
  { id:4, type:"insight", source:"Industry Report", time:"14m", headline:"Average freelance design rate now $112/hr in US metros — up 8% YoY", body:"The 2026 Freelance Design Rate Report shows average hourly rates have increased to $112/hr for US metro-based designers, up from $104/hr in 2025. Brand identity specialists command a premium at $125/hr. Web design rates are flat at $95/hr.", tags:["Rate Benchmarks","2026 Data","Pricing"], relevance:88, metric:{label:"$112/hr",sub:"avg US rate"}, spark:[82,85,88,90,92,95,98,100,104,104,108,112], group:"today" },
  { id:5, type:"trend", source:"Dribbble", time:"18m", headline:"Warm earth tone palettes trending — 3× more saves than cool palettes", body:"Dribbble's trending data shows warm, organic color palettes (earth tones, terracotta, sage, parchment) are receiving significantly more engagement than cool-toned work. This aligns with the broader 'organic minimalism' trend in brand design.", tags:["Color Trends","Earth Tones","Organic Minimalism"], relevance:82, metric:{label:"3×",sub:"more saves"}, group:"today" },
  { id:6, type:"tool", source:"ProductHunt", time:"22m", headline:"Fontshare launches 14 new variable fonts — all free for commercial use", body:"Indian Type Foundry's Fontshare just released 14 new variable font families, all free for commercial use. Includes several serif and sans-serif options suitable for brand identity work.", tags:["Typography","Free Resource","Variable Fonts"], relevance:75, metric:{label:"14 fonts",sub:"free commercial"}, group:"today" },
  { id:7, type:"market", source:"Felmark Intelligence", time:"25m", headline:"Freelancers who offer strategy earn 2.4× more per project than design-only", body:"Felmark's internal data across 12,000 freelancer projects shows that combining brand strategy with design execution results in an average project value of $8,400 vs $3,500 for design-only work. Adding strategy also correlates with 40% higher client retention.", tags:["Strategy","Revenue Data","Felmark Data","Retention"], relevance:91, metric:{label:"2.4×",sub:"revenue multiplier"}, spark:[3500,3800,4200,4800,5200,5800,6400,7000,7200,7800,8000,8400], group:"today" },
  { id:8, type:"alert", source:"Hacker News", time:"31m", headline:"AI-generated brand kits discussed on HN — 847 upvotes, mixed sentiment", body:"A Hacker News post about AI tools that auto-generate brand identity kits has gained significant traction. Comments are mixed — many note AI output lacks strategic depth. This represents both a threat and an opportunity. Top comment: 'AI can generate a logo but it can't tell you why that logo matters.'", tags:["AI Disruption","Positioning","Strategy"], relevance:86, metric:{label:"847",sub:"upvotes"}, spark:[0,12,45,120,280,420,560,640,720,780,820,847], group:"today" },
  { id:9, type:"community", source:"Twitter / X", time:"35m", headline:"Viral thread: \"Why I charge $10k for brand guidelines\" — 4.2k retweets", body:"A freelance designer's thread breaking down their $10k brand guidelines process is going viral. Key points: discovery workshop ($2k value), strategy document ($3k), visual identity ($3k), guidelines doc ($2k).", tags:["Pricing","Viral","Brand Guidelines","Value Framing"], relevance:79, metric:{label:"4.2k",sub:"retweets"}, spark:[10,80,320,800,1400,2100,2800,3200,3500,3800,4000,4200], group:"today" },
  { id:10, type:"opportunity", source:"LinkedIn", time:"38m", headline:"Nora Kim's company just raised a $2M seed round", body:"Nora Kim (your client) — Coach Kim LLC just announced a $2M seed round led by First Round Capital. Companies that raise typically increase their marketing and brand spend by 50–80% within 90 days.", tags:["Nora Kim","Funding Signal","Upsell","First Round"], relevance:96, metric:{label:"$2M",sub:"seed round"}, isClientSignal:true, group:"today", relatedAction:"Draft an expanded services proposal for Nora Kim" },
  { id:11, type:"insight", source:"Awwwards", time:"42m", headline:"Serif typography now appears on 62% of Awwwards Site of the Day winners", body:"Serif fonts have overtaken sans-serif as the dominant choice for award-winning web design. Cormorant Garamond, Playfair Display, and DM Serif Display are the most common.", tags:["Typography","Web Design","Awards","Serif"], relevance:73, metric:{label:"62%",sub:"serif dominance"}, group:"earlier" },
  { id:12, type:"trend", source:"Behance", time:"48m", headline:"Minimalist logo projects up 28% on Behance — case studies dominate", body:"Behance's trending projects show a 28% increase in minimalist logo and brand identity case studies. Process-heavy case studies get 3.2× more appreciations.", tags:["Logo Design","Case Studies","Process"], relevance:70, metric:{label:"+28%",sub:"on Behance"}, group:"earlier" },
  { id:13, type:"client", source:"Client Activity", time:"1h", headline:"Bolt Fitness website traffic doubled this week — may need design support", body:"Traffic monitoring shows Bolt Fitness experienced a 2× spike in website visits this week, likely from a press mention or viral social post. This is a natural conversation opener for web design services.", tags:["Bolt Fitness","Traffic Spike","Web Design"], relevance:85, metric:{label:"2×",sub:"traffic spike"}, isClientSignal:true, group:"earlier", relatedAction:"Reach out to Bolt about a website refresh" },
  { id:14, type:"market", source:"Felmark Intelligence", time:"1h", headline:"Q1 2026: Freelance design revenue up 18% — strongest quarter in 3 years", body:"Aggregated Felmark data shows freelance designers earned 18% more in Q1 2026 compared to Q1 2025, the strongest growth since 2023.", tags:["Q1 2026","Market Growth","Industry"], relevance:77, metric:{label:"+18%",sub:"Q1 revenue"}, spark:[72,74,76,78,80,84,86,88,90,94,96,100], group:"earlier" },
];

const FILTERS = ["All","Trends","Opportunities","Client Signals","Market","Tools","Community","Alerts"];
const filterMap: Record<string, string | null> = { "All":null, "Trends":"trend", "Opportunities":"opportunity", "Client Signals":"client", "Market":"market", "Tools":"tool", "Community":"community", "Alerts":"alert" };

function Spark({ data, color, width = 56, height = 20 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - 2 - ((v - min) / range) * (height - 4);
    return `${x},${y}`;
  }).join(" ");
  const last = points.split(" ").pop()!.split(",");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", flexShrink: 0 }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx={last[0]} cy={last[1]} r="2" fill={color} opacity="0.7" />
    </svg>
  );
}

function SignalItem({ item, selected, onSelect, bookmarked, onBookmark }: { item: Signal; selected: number | null; onSelect: (id: number) => void; bookmarked: Set<number>; onBookmark: (id: number, e: React.MouseEvent) => void }) {
  const tc = SIGNAL_TYPES[item.type];
  const sc = SOURCES[item.source];
  return (
    <div className={`${styles.item} ${selected === item.id ? styles.itemOn : ""}`} onClick={() => onSelect(item.id)}>
      <div className={styles.itemRel} style={{ background: tc.color, opacity: item.relevance / 100 }} />
      <div className={styles.itemInner}>
        <div className={styles.itemType} style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.color}12` }}>{tc.icon}</div>
        <div className={styles.itemBody}>
          <div className={styles.itemTop}>
            <span className={styles.itemSource}>{sc?.abbr || "?"}</span>
            <span className={styles.itemTime}>{item.time}{item.live ? "" : " ago"}</span>
            {item.isClientSignal && <span className={styles.clientBadge}>YOUR CLIENT</span>}
          </div>
          <div className={styles.itemHl}>{item.headline}</div>
          <div className={styles.itemTags}>{item.tags.slice(0, 3).map((t, i) => <span key={i} className={styles.itemTag}>{t}</span>)}</div>
        </div>
        <div className={styles.itemRight}>
          {item.metric && <><span className={styles.itemMetricVal} style={{ color: tc.color }}>{item.metric.label}</span><span className={styles.itemMetricSub}>{item.metric.sub}</span></>}
          {item.spark && <Spark data={item.spark} color={tc.color} width={48} height={16} />}
          <div className={styles.itemRelBar}><div className={styles.itemRelFill} style={{ width: `${item.relevance}%`, background: item.relevance >= 90 ? "#5a9a3c" : item.relevance >= 75 ? "var(--ember)" : "var(--ink-400)" }} /></div>
        </div>
      </div>
      <div className={styles.itemActions}>
        <button className={`${styles.itemAct} ${bookmarked.has(item.id) ? styles.itemActOn : ""}`} onClick={e => onBookmark(item.id, e)}>{bookmarked.has(item.id) ? "★" : "☆"}</button>
        <button className={styles.itemAct}>↗</button>
      </div>
    </div>
  );
}

interface WirePageProps {
  workspaces?: Workspace[];
  services?: WireService[];
}

export default function WirePage({ workspaces = [], services = [] }: WirePageProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState<number | null>(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("Design & Branding");
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set([3, 7, 10]));
  const [now, setNow] = useState(new Date());
  const [hasGenerated, setHasGenerated] = useState(false);
  const [aiSignals, setAiSignals] = useState<Signal[] | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("felmark_wire_onboarded")) {
      setHasGenerated(true);
    }
  }, []);

  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i); }, []);

  const refreshSignals = () => {
    setGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setAiSignals(FEED);
      setGenerating(false);
      setHasGenerated(true);
      localStorage.setItem("felmark_wire_onboarded", "true");
    }, 1500);
  };

  // Onboarding phase detection
  const hasWorkspaces = workspaces.length > 0;
  const hasServices = services.length > 0;
  const hasProjects = workspaces.some(w => w.projects.length > 0);
  const hasRate = workspaces.some(w => w.rate && w.rate !== "" && w.rate !== "$0");

  const isPhaseA = !hasWorkspaces || !hasServices;
  const isPhaseB = hasWorkspaces && hasServices && !hasGenerated && !aiSignals;
  // Phase C: hasGenerated || aiSignals (normal feed)

  // Compute context line for Phase B
  const serviceCount = services.length;
  const clientCount = workspaces.filter(w => !w.personal).length;
  const firstRate = workspaces.find(w => w.rate)?.rate || "$0/hr";

  const blurredPreviewItems = FEED.slice(0, 4);

  const toggleBookmark = (id: number, e: React.MouseEvent) => { e.stopPropagation(); setBookmarked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };

  const filtered = FEED.filter(item => {
    if (activeFilter !== "All" && item.type !== filterMap[activeFilter]) return false;
    if (searchQuery && !item.headline.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const liveItems = filtered.filter(i => i.group === "live");
  const todayItems = filtered.filter(i => i.group === "today");
  const earlierItems = filtered.filter(i => i.group === "earlier");
  const selected = FEED.find(i => i.id === selectedItem) || null;
  const clientSignals = FEED.filter(f => f.isClientSignal).length;
  const avgRelevance = Math.round(FEED.reduce((s, f) => s + f.relevance, 0) / FEED.length);

  // Phase A: No data yet — blurred preview + setup checklist
  if (isPhaseA) {
    return (
      <div className={styles.page}>
        <div className={styles.head}>
          <div className={styles.headTop}>
            <div className={styles.headLeft}>
              <span className={styles.title}>The Wire</span>
              <span className={styles.pro}>PRO</span>
            </div>
          </div>
        </div>
        <div className={styles.onboardWrap}>
          <div className={styles.onboardBlurred}>
            {blurredPreviewItems.map(item => {
              const tc = SIGNAL_TYPES[item.type];
              const sc = SOURCES[item.source];
              return (
                <div key={item.id} className={styles.item} style={{ opacity: 0.15, filter: "blur(2px)", pointerEvents: "none" }}>
                  <div className={styles.itemRel} style={{ background: tc.color, opacity: item.relevance / 100 }} />
                  <div className={styles.itemInner}>
                    <div className={styles.itemType} style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.color}12` }}>{tc.icon}</div>
                    <div className={styles.itemBody}>
                      <div className={styles.itemTop}>
                        <span className={styles.itemSource}>{sc?.abbr || "?"}</span>
                        <span className={styles.itemTime}>{item.time}</span>
                      </div>
                      <div className={styles.itemHl}>{item.headline}</div>
                      <div className={styles.itemTags}>{item.tags.slice(0, 3).map((t, i) => <span key={i} className={styles.itemTag}>{t}</span>)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.onboardCard}>
            <div className={styles.onboardIcon}>&#9678;</div>
            <div className={styles.onboardTitle}>Your business intelligence briefing</div>
            <div className={styles.onboardSub}>Personalized signals powered by AI</div>
            <div className={styles.onboardChecklist}>
              <div className={styles.onboardCheckItem}>
                <span className={`${styles.onboardCheck} ${hasServices ? styles.onboardCheckDone : ""}`}>{hasServices ? "\u2713" : "\u25CB"}</span>
                Add your services
              </div>
              <div className={styles.onboardCheckItem}>
                <span className={`${styles.onboardCheck} ${hasProjects ? styles.onboardCheckDone : ""}`}>{hasProjects ? "\u2713" : "\u25CB"}</span>
                Create a client workspace
              </div>
              <div className={styles.onboardCheckItem}>
                <span className={`${styles.onboardCheck} ${hasRate ? styles.onboardCheckDone : ""}`}>{hasRate ? "\u2713" : "\u25CB"}</span>
                Set your hourly rate
              </div>
            </div>
            <button className={styles.onboardCta}>Set up now &rarr;</button>
          </div>
        </div>
      </div>
    );
  }

  // Phase B: Has data, never generated — CTA to generate
  if (isPhaseB) {
    return (
      <div className={styles.page}>
        <div className={styles.head}>
          <div className={styles.headTop}>
            <div className={styles.headLeft}>
              <span className={styles.title}>The Wire</span>
              <span className={styles.pro}>PRO</span>
            </div>
          </div>
        </div>
        <div className={styles.onboardWrap}>
          <div className={styles.readyCard}>
            <div className={styles.onboardIcon}>&#9678;</div>
            <div className={styles.onboardTitle}>Ready to generate your first intelligence briefing</div>
            <div className={styles.readyContext}>
              Based on: {serviceCount} service{serviceCount !== 1 ? "s" : ""} &middot; {clientCount} client{clientCount !== 1 ? "s" : ""} &middot; {firstRate} rate
            </div>
            <button className={styles.onboardCta} onClick={refreshSignals} disabled={generating}>
              {generating ? "Generating..." : "Generate briefing \u2192"}
            </button>
            <div className={styles.onboardHint}>
              Refreshes daily &middot; Personalized to your business &middot; Powered by Claude AI
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Phase C: Normal feed
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.head}>
        <div className={styles.headTop}>
          <div className={styles.headLeft}>
            <span className={styles.title}>The Wire</span>
            <span className={styles.live}><span className={styles.liveDot} />{liveItems.length} live</span>
            <span className={styles.pro}>PRO</span>
          </div>
          <div className={styles.headRight}>
            <select className={styles.niche} value={selectedNiche} onChange={e => setSelectedNiche(e.target.value)}>
              {NICHES.map(n => <option key={n}>{n}</option>)}
            </select>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/><path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <input className={styles.search} placeholder="Search signals..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className={styles.ticker}>
          <div className={styles.tick}><span className={styles.tickVal} style={{ color: "#5a9a3c" }}>{filtered.length}</span><div className={styles.tickInfo}><span className={styles.tickLabel}>Signals</span><span className={`${styles.tickChange} ${styles.up}`}>+4 new today</span></div></div>
          <div className={styles.tick}><span className={styles.tickVal} style={{ color: "var(--ember)" }}>{clientSignals}</span><div className={styles.tickInfo}><span className={styles.tickLabel}>Client signals</span><span className={`${styles.tickChange} ${styles.up}`}>Action needed</span></div></div>
          <div className={styles.tick}><span className={styles.tickVal} style={{ color: "var(--ink-800)" }}>{avgRelevance}%</span><div className={styles.tickInfo}><span className={styles.tickLabel}>Avg relevance</span></div></div>
          <div className={styles.tick}><span className={styles.tickVal} style={{ color: "#5b7fa4" }}>$112</span><div className={styles.tickInfo}><span className={styles.tickLabel}>Avg market rate</span><span className={`${styles.tickChange} ${styles.up}`}>↑ 8% YoY</span></div></div>
          <div className={styles.tick}><span className={styles.tickVal} style={{ color: "#5a9a3c" }}>+34%</span><div className={styles.tickInfo}><span className={styles.tickLabel}>Niche demand</span><span className={`${styles.tickChange} ${styles.up}`}>Growing</span></div></div>
          <div className={styles.tick}><span className={styles.tickVal} style={{ color: "#7c6b9e" }}>2.4×</span><div className={styles.tickInfo}><span className={styles.tickLabel}>Strategy premium</span></div></div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {FILTERS.map(f => <button key={f} className={`${styles.filterBtn} ${activeFilter === f ? styles.filterOn : ""}`} onClick={() => setActiveFilter(f)}>{f}</button>)}
      </div>

      <div className={styles.layout}>
        {/* Feed */}
        <div className={styles.feed}>
          {liveItems.length > 0 && <>
            <div className={styles.group}><span className={styles.groupDot} style={{ background: "#5a9a3c", boxShadow: "0 0 0 2px rgba(90,154,60,0.15)" }} />Live now<span className={styles.groupCount}>{liveItems.length}</span></div>
            {liveItems.map(item => <SignalItem key={item.id} item={item} selected={selectedItem} onSelect={setSelectedItem} bookmarked={bookmarked} onBookmark={toggleBookmark} />)}
          </>}
          {todayItems.length > 0 && <>
            <div className={styles.group}><span className={styles.groupDot} style={{ background: "var(--ink-300)" }} />Today<span className={styles.groupCount}>{todayItems.length}</span></div>
            {todayItems.map(item => <SignalItem key={item.id} item={item} selected={selectedItem} onSelect={setSelectedItem} bookmarked={bookmarked} onBookmark={toggleBookmark} />)}
          </>}
          {earlierItems.length > 0 && <>
            <div className={styles.group}><span className={styles.groupDot} style={{ background: "var(--warm-300)" }} />Earlier<span className={styles.groupCount}>{earlierItems.length}</span></div>
            {earlierItems.map(item => <SignalItem key={item.id} item={item} selected={selectedItem} onSelect={setSelectedItem} bookmarked={bookmarked} onBookmark={toggleBookmark} />)}
          </>}
        </div>

        {/* Preview */}
        <div className={styles.preview}>
          {selected ? (() => {
            const tc = SIGNAL_TYPES[selected.type];
            const sc = SOURCES[selected.source];
            const actionText = selected.relatedAction || (selected.isClientSignal ? "Reach out to this client about expanded services while the momentum is fresh." : selected.type === "opportunity" ? "Consider adjusting your positioning or outreach to capture this opportunity." : selected.type === "alert" ? "Stay informed and consider how this affects your service positioning." : "Use this data to refine your pricing, positioning, or outreach strategy.");
            const related = FEED.filter(f => f.id !== selected.id && f.tags.some(t => selected.tags.includes(t))).slice(0, 3);

            return <>
              <div className={styles.pvHead}>
                <div className={styles.pvSourceRow}>
                  <span className={styles.pvSourceBadge} style={{ background: sc?.color || "#9b988f" }}>{sc?.abbr}</span>
                  <div><div className={styles.pvSourceName}>{selected.source}</div><div className={styles.pvSourceTime}>{selected.time} ago · {selectedNiche}</div></div>
                  <button className={`${styles.pvBookmark} ${bookmarked.has(selected.id) ? styles.pvBookmarkOn : ""}`} onClick={() => setBookmarked(prev => { const n = new Set(prev); n.has(selected.id) ? n.delete(selected.id) : n.add(selected.id); return n; })}>{bookmarked.has(selected.id) ? "★" : "☆"}</button>
                </div>
                <div className={styles.pvTitle}>{selected.headline}</div>
                <div className={styles.pvBadges}>
                  <span className={styles.pvTypeBadge} style={{ color: tc.color, background: tc.bg, border: `1px solid ${tc.color}15` }}>{tc.icon} {tc.label}</span>
                  <span className={styles.pvRelBadge}>{selected.relevance}% relevant<span className={styles.pvRelBar}><span className={styles.pvRelFill} style={{ width: `${selected.relevance}%`, background: selected.relevance >= 90 ? "#5a9a3c" : selected.relevance >= 75 ? "var(--ember)" : "var(--ink-400)" }} /></span></span>
                  {selected.isClientSignal && <span className={styles.clientBadge}>YOUR CLIENT</span>}
                </div>
                {selected.metric && (
                  <div className={styles.pvMetric}>
                    <div className={styles.pvMetricLeft}><div className={styles.pvMetricVal} style={{ color: tc.color }}>{selected.metric.label}</div><div className={styles.pvMetricSub}>{selected.metric.sub}</div></div>
                    {selected.spark && <div className={styles.pvMetricSpark}><Spark data={selected.spark} color={tc.color} width={200} height={48} /></div>}
                  </div>
                )}
              </div>
              <div className={styles.pvBody}>
                <div className={styles.pvSec}>analysis</div>
                <div className={styles.pvText}>{selected.body}</div>
                <div className={styles.pvTags}>{selected.tags.map((t, i) => <span key={i} className={styles.pvTag}>{t}</span>)}</div>
                <div className={styles.pvSec}>suggested action</div>
                <div className={styles.pvAction}>
                  <div className={styles.pvActionLabel}>what to do</div>
                  <div className={styles.pvActionText}>{actionText}</div>
                  <button className={styles.pvActionBtn}>{selected.isClientSignal ? "→ Open Workspace" : selected.type === "opportunity" ? "◆ Create Proposal" : "★ Save Signal"}</button>
                  <button className={styles.pvActionSecondary}>Dismiss</button>
                </div>
                {related.length > 0 && <>
                  <div className={styles.pvSec}>related signals</div>
                  <div className={styles.pvRelated}>
                    {related.map(r => { const rtc = SIGNAL_TYPES[r.type]; return (
                      <div key={r.id} className={styles.pvRelatedItem} onClick={() => setSelectedItem(r.id)}>
                        <div className={styles.pvRelatedIcon} style={{ background: rtc.bg, color: rtc.color, border: `1px solid ${rtc.color}12` }}>{rtc.icon}</div>
                        <span className={styles.pvRelatedText}>{r.headline}</span>
                        <span className={styles.pvRelatedTime}>{r.time}</span>
                      </div>
                    ); })}
                  </div>
                </>}
              </div>
            </>;
          })() : (
            <div className={styles.pvEmpty}><div className={styles.pvEmptyIcon}>◎</div><div className={styles.pvEmptyTitle}>Select a signal</div><div className={styles.pvEmptySub}>Click any signal to see the full analysis and suggested actions</div></div>
          )}
        </div>
      </div>

      <div className={styles.footer}><div className={styles.footerLeft}><span className={styles.footerDot} />Live · {filtered.length} signals · {selectedNiche}</div><span>{now.toLocaleTimeString()} · Updated every 60s</span></div>
    </div>
  );
}
