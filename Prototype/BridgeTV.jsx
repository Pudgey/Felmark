import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════
   FELMARK — BRIDGE v3
   TradingView light. Your business as
   a stock ticker. Watchlist right.
   Client detail center. Revenue chart.
   ═══════════════════════════════════════════ */

export default function BridgeTV() {
  const [activeClient, setActiveClient] = useState("meridian");
  const [activeTab, setActiveTab] = useState("overview");
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(s => s + 1), 1000); return () => clearInterval(t); }, []);

  const clients = [
    { id: "meridian", sym: "MER", name: "Meridian Studio", val: "$8,400", chg: "+2,400", chgPct: "+40%", up: true, type: "client" },
    { id: "bolt", sym: "BLT", name: "Bolt Fitness", val: "$4,200", chg: "-800", chgPct: "-16%", up: false, type: "client" },
    { id: "nora", sym: "NOR", name: "Nora Kim", val: "$3,200", chg: "+1,400", chgPct: "+78%", up: true, type: "client" },
    { id: "luna", sym: "LUN", name: "Luna Boutique", val: "$0", chg: "new", chgPct: "lead", up: null, type: "lead" },
  ];

  const metrics = {
    meridian: { billed: "$8,400", outstanding: "$2,400", hours: "42.5h", rate: "$120", projects: 3, overdue: 0, health: 82, trend: [40,45,35,60,55,70,65,80,72,85,78,92] },
    bolt: { billed: "$4,200", outstanding: "$4,000", hours: "28h", rate: "$110", projects: 2, overdue: 1, health: 48, trend: [30,35,40,38,42,35,30,28,32,25,20,18] },
    nora: { billed: "$3,200", outstanding: "$3,200", hours: "18h", rate: "$120", projects: 1, overdue: 0, health: 71, trend: [0,0,0,0,0,0,0,10,25,40,55,70] },
    luna: { billed: "$0", outstanding: "$0", hours: "0h", rate: "—", projects: 0, overdue: 0, health: 0, trend: [0,0,0,0,0,0,0,0,0,0,0,0] },
  };

  const cl = clients.find(c => c.id === activeClient);
  const m = metrics[activeClient];

  return (<>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <style>{`
*{box-sizing:border-box;margin:0;padding:0}body{margin:0}
.tv{font-family:'Inter',-apple-system,sans-serif;background:#fff;height:100vh;display:flex;flex-direction:column;color:#131722;-webkit-font-smoothing:antialiased}

/* ═══ TOP NAV ═══ */
.nav{height:42px;display:flex;align-items:center;padding:0 16px;border-bottom:1px solid #e0e3eb;gap:12px;flex-shrink:0;background:#fff}
.nav-logo{display:flex;align-items:center;gap:6px;font-weight:700;font-size:15px;color:#131722;flex-shrink:0}
.nav-logo-mark{font-size:16px;color:#c89360}
.nav-links{display:flex;gap:0;margin-left:8px}
.nav-link{font-size:13px;color:#787b86;padding:10px 12px;cursor:pointer;transition:color .06s;font-weight:500}
.nav-link:hover{color:#131722}
.nav-link.on{color:#131722;box-shadow:inset 0 -2px 0 #c89360}
.nav-search{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;background:#f0f3fa;margin-left:auto;cursor:pointer;transition:all .08s}
.nav-search:hover{background:#e8ecf5}
.nav-search-icon{font-size:12px;color:#787b86}
.nav-search-text{font-size:12px;color:#9598a1}
.nav-search-key{font-family:'JetBrains Mono',monospace;font-size:9px;color:#b2b5be;margin-left:4px}
.nav-icons{display:flex;gap:2px;margin-left:8px}
.nav-icon{width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;color:#787b86;cursor:pointer;transition:all .06s}
.nav-icon:hover{background:#f0f3fa;color:#131722}

/* ═══ BODY ═══ */
.body{flex:1;display:flex;overflow:hidden}

/* ═══ MAIN CONTENT ═══ */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;border-right:1px solid #e0e3eb}

/* Breadcrumb */
.bread{display:flex;align-items:center;gap:4px;padding:10px 20px;font-size:12px;color:#787b86;flex-shrink:0}
.bread a{color:#2962ff;text-decoration:none;cursor:pointer}.bread a:hover{text-decoration:underline}
.bread-sep{color:#d1d4dc}

/* Client header — like stock header */
.ch{padding:0 20px 16px;flex-shrink:0}
.ch-top{display:flex;align-items:center;gap:14px;margin-bottom:8px}
.ch-avatar{width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;flex-shrink:0}
.ch-info{flex:1}
.ch-name{font-size:24px;font-weight:700;color:#131722;letter-spacing:-.02em}
.ch-sym-row{display:flex;align-items:center;gap:6px;margin-top:2px}
.ch-sym{font-family:'JetBrains Mono',monospace;font-size:13px;color:#787b86;font-weight:500}
.ch-badge{font-size:10px;padding:2px 8px;border-radius:4px;font-weight:500}
.ch-tools{display:flex;gap:4px}
.ch-tool{width:32px;height:32px;border-radius:6px;border:1px solid #e0e3eb;display:flex;align-items:center;justify-content:center;font-size:12px;color:#787b86;cursor:pointer;transition:all .06s}
.ch-tool:hover{background:#f0f3fa;color:#131722}

/* Price area — like stock price */
.ch-price{display:flex;align-items:baseline;gap:8px;margin-top:4px}
.ch-price-val{font-size:36px;font-weight:800;color:#131722;letter-spacing:-.03em;line-height:1}
.ch-price-unit{font-size:14px;color:#787b86;font-weight:500}
.ch-price-chg{font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:600}
.ch-price-sub{font-size:12px;color:#9598a1;margin-top:4px}

/* Tabs — TradingView style */
.tabs{display:flex;padding:0 20px;border-bottom:1px solid #e0e3eb;flex-shrink:0;overflow-x:auto}
.tab{font-size:13px;font-weight:500;padding:10px 14px;color:#787b86;cursor:pointer;border-bottom:2px solid transparent;transition:all .06s;white-space:nowrap}
.tab:hover{color:#131722}
.tab.on{color:#131722;border-bottom-color:#2962ff}

/* Chart area */
.chart-area{flex:1;padding:20px;overflow:hidden;display:flex;flex-direction:column}
.chart-hd{display:flex;align-items:center;gap:8px;margin-bottom:12px}
.chart-title{font-size:16px;font-weight:700;color:#131722;flex:1;display:flex;align-items:center;gap:4px}
.chart-title-chev{font-size:11px;color:#787b86;cursor:pointer}
.chart-btn{padding:6px 14px;border-radius:6px;border:1px solid #e0e3eb;background:#fff;font-size:12px;color:#787b86;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;transition:all .06s}
.chart-btn:hover{background:#f0f3fa;color:#131722}
.chart-btn.primary{background:#2962ff;color:#fff;border-color:#2962ff}.chart-btn.primary:hover{background:#1e50d9}

.chart-svg-wrap{flex:1;position:relative;min-height:0}
.chart-svg{width:100%;height:100%;display:block}

/* Key stats below chart */
.kstats{display:flex;gap:0;padding:12px 20px;border-top:1px solid #e0e3eb;flex-shrink:0}
.kstat{flex:1;padding:0 12px;border-right:1px solid #f0f3fa}
.kstat:first-child{padding-left:0}
.kstat:last-child{border-right:none}
.kstat-label{font-size:11px;color:#787b86}
.kstat-val{font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:600;color:#131722;margin-top:2px}

/* ═══ WATCHLIST SIDEBAR ═══ */
.wl{width:300px;flex-shrink:0;display:flex;flex-direction:column;background:#fff;overflow:hidden}

/* Watchlist header */
.wl-hd{display:flex;align-items:center;padding:8px 12px;border-bottom:1px solid #e0e3eb;flex-shrink:0;gap:4px}
.wl-title{font-size:13px;font-weight:700;color:#131722;flex:1}
.wl-tool{width:26px;height:26px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#787b86;cursor:pointer}.wl-tool:hover{background:#f0f3fa}

/* Watchlist column header */
.wl-colhd{display:flex;align-items:center;padding:4px 12px;font-family:'JetBrains Mono',monospace;font-size:9px;color:#9598a1;border-bottom:1px solid #f0f3fa}
.wl-colhd span:first-child{flex:1}

/* Watchlist section */
.wl-sec{font-family:'JetBrains Mono',monospace;font-size:9px;color:#9598a1;padding:8px 12px 2px;text-transform:uppercase;letter-spacing:.06em;display:flex;align-items:center;gap:4px}
.wl-sec-arrow{font-size:7px}

/* Watchlist row */
.wl-row{display:flex;align-items:center;padding:6px 12px;cursor:pointer;transition:background .04s;border-left:2px solid transparent}
.wl-row:hover{background:#f0f3fa}
.wl-row.on{background:#f0f3fa;border-left-color:#2962ff}
.wl-row-sym{display:flex;align-items:center;gap:6px;flex:1;min-width:0}
.wl-row-dot{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;flex-shrink:0}
.wl-row-ticker{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;color:#131722}
.wl-row-ind{width:4px;height:4px;border-radius:50%;margin-left:2px}
.wl-row-val{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;color:#131722;width:70px;text-align:right;flex-shrink:0}
.wl-row-chg{font-family:'JetBrains Mono',monospace;font-size:11px;width:50px;text-align:right;flex-shrink:0}
.wl-row-pct{font-family:'JetBrains Mono',monospace;font-size:11px;width:50px;text-align:right;flex-shrink:0}

/* Watchlist detail — like TradingView's detail panel below */
.wl-detail{border-top:1px solid #e0e3eb;flex-shrink:0;overflow-y:auto}
.wl-detail::-webkit-scrollbar{width:3px}.wl-detail::-webkit-scrollbar-thumb{background:#e0e3eb;border-radius:2px}

.wl-detail-hd{display:flex;align-items:center;gap:8px;padding:10px 12px}
.wl-detail-dot{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;flex-shrink:0}
.wl-detail-sym{font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;color:#131722}
.wl-detail-tools{display:flex;gap:2px;margin-left:auto}
.wl-detail-tool{width:24px;height:24px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#9598a1;cursor:pointer}.wl-detail-tool:hover{background:#f0f3fa}

.wl-detail-name{padding:0 12px;font-size:11px;color:#787b86}
.wl-detail-price{padding:8px 12px;display:flex;align-items:baseline;gap:6px}
.wl-detail-price-val{font-size:24px;font-weight:800;color:#131722;letter-spacing:-.02em}
.wl-detail-price-unit{font-size:11px;color:#787b86}
.wl-detail-price-chg{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600}
.wl-detail-sub{padding:0 12px 8px;font-size:10px;color:#9598a1;display:flex;align-items:center;gap:4px}
.wl-detail-sub-dot{width:4px;height:4px;border-radius:50%;background:#9598a1}

/* AI insight — like TradingView's purple insight box */
.wl-insight{margin:4px 12px;padding:10px 12px;border-radius:8px;background:rgba(200,147,96,.06);border:1px solid rgba(200,147,96,.1)}
.wl-insight-icon{font-size:11px;color:#c89360;margin-right:4px}
.wl-insight-text{font-size:11px;color:#6b6560;line-height:1.5}
.wl-insight-dismiss{float:right;font-size:10px;color:#c89360;cursor:pointer;margin-left:4px}

/* Key stats in sidebar */
.wl-stats{padding:10px 12px;border-top:1px solid #f0f3fa}
.wl-stats-title{font-size:12px;font-weight:700;color:#131722;margin-bottom:6px}
.wl-stat-row{display:flex;justify-content:space-between;padding:3px 0}
.wl-stat-label{font-size:12px;color:#787b86}
.wl-stat-val{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;color:#131722}

/* Pipeline as a section below */
.wl-pipeline{padding:10px 12px;border-top:1px solid #f0f3fa}
.wl-pipeline-title{font-size:12px;font-weight:700;color:#131722;margin-bottom:6px;display:flex;align-items:center;gap:4px}

/* Overdue section in sidebar */
.wl-alerts{padding:8px 12px;border-top:1px solid #f0f3fa}
.wl-alert{display:flex;align-items:center;gap:6px;padding:4px 0;font-size:11px}
.wl-alert-dot{width:4px;height:4px;border-radius:50%;flex-shrink:0}
.wl-alert-text{color:#787b86;flex:1}
.wl-alert-val{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;flex-shrink:0}
    `}</style>

    <div className="tv">
      {/* ═══ NAV ═══ */}
      <div className="nav">
        <div className="nav-logo"><span className="nav-logo-mark">◆</span>Felmark</div>
        <div className="nav-links">
          <span className="nav-link on">Bridge</span>
          <span className="nav-link">Workspace</span>
          <span className="nav-link">Workstation</span>
          <span className="nav-link">Hub</span>
        </div>
        <div className="nav-search">
          <span className="nav-search-icon">⌕</span>
          <span className="nav-search-text">Search</span>
          <span className="nav-search-key">(⌘K)</span>
        </div>
        <div className="nav-icons">
          <div className="nav-icon">+</div>
          <div className="nav-icon">⊞</div>
          <div className="nav-icon">⋯</div>
        </div>
      </div>

      <div className="body">
        {/* ═══ MAIN ═══ */}
        <div className="main">
          {/* Breadcrumb */}
          <div className="bread">
            <a>Clients</a><span className="bread-sep">/</span>
            <a>Active</a><span className="bread-sep">/</span>
            <span style={{ color: "#131722" }}>{cl.name}</span>
          </div>

          {/* Client header = stock header */}
          <div className="ch">
            <div className="ch-top">
              <div className="ch-avatar" style={{ background: activeClient === "meridian" ? "rgba(124,133,148,.08)" : activeClient === "bolt" ? "rgba(200,147,96,.06)" : activeClient === "nora" ? "rgba(41,98,255,.05)" : "rgba(0,0,0,.03)", color: activeClient === "meridian" ? "#7c8594" : activeClient === "bolt" ? "#c89360" : activeClient === "nora" ? "#2962ff" : "#9598a1" }}>{cl.sym.slice(0,2)}</div>
              <div className="ch-info">
                <div className="ch-name">{cl.name}</div>
                <div className="ch-sym-row">
                  <span className="ch-sym">{cl.sym}</span>
                  <span>·</span>
                  <span className="ch-badge" style={{ background: cl.type === "lead" ? "rgba(255,152,0,.08)" : "rgba(38,166,154,.06)", color: cl.type === "lead" ? "#ff9800" : "#26a69a" }}>{cl.type === "lead" ? "Lead" : "Active Client"}</span>
                </div>
              </div>
              <div className="ch-tools">
                <div className="ch-tool">—</div>
                <div className="ch-tool">△</div>
                <div className="ch-tool">≈</div>
              </div>
            </div>
            <div className="ch-price">
              <span className="ch-price-val">{m.billed}</span>
              <span className="ch-price-unit">billed</span>
              {cl.up !== null && <span className="ch-price-chg" style={{ color: cl.up ? "#26a69a" : "#ef5350" }}>{cl.chg} {cl.chgPct}</span>}
              {cl.up === null && <span className="ch-price-chg" style={{ color: "#ff9800" }}>new lead</span>}
            </div>
            <div className="ch-price-sub">Lifetime billing · {m.projects} projects · $120/hr rate</div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {["Overview","Invoices","Tasks","Time","Documents","Signals","Scope","Files"].map(t => (
              <span key={t} className={`tab${activeTab === t.toLowerCase() ? " on" : ""}`} onClick={() => setActiveTab(t.toLowerCase())}>{t}</span>
            ))}
          </div>

          {/* Chart */}
          <div className="chart-area">
            <div className="chart-hd">
              <span className="chart-title">Revenue <span className="chart-title-chev">›</span></span>
              <button className="chart-btn">📷</button>
              <button className="chart-btn primary">◎ Full chart</button>
            </div>
            <div className="chart-svg-wrap">
              <svg className="chart-svg" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="tvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={cl.up === false ? "#ef5350" : "#26a69a"} stopOpacity="0.08" />
                    <stop offset="100%" stopColor={cl.up === false ? "#ef5350" : "#26a69a"} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid */}
                {[40,80,120,160].map(y => <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#f0f3fa" strokeWidth="0.5" />)}
                {/* Prev close line */}
                <line x1="0" y1={200 - m.trend[m.trend.length - 2] * 1.8} x2="600" y2={200 - m.trend[m.trend.length - 2] * 1.8} stroke="#787b86" strokeWidth="0.5" strokeDasharray="4 3" />
                {/* Area */}
                <path d={`M0,${200 - m.trend[0] * 1.8} ${m.trend.map((v, i) => `L${(i / (m.trend.length - 1)) * 600},${200 - v * 1.8}`).join(" ")} L600,200 L0,200 Z`} fill="url(#tvg)" />
                {/* Line */}
                <path d={m.trend.map((v, i) => `${i === 0 ? "M" : "L"}${(i / (m.trend.length - 1)) * 600},${200 - v * 1.8}`).join(" ")} fill="none" stroke={cl.up === false ? "#ef5350" : "#26a69a"} strokeWidth="1.5" />
                {/* Y labels */}
                {[
                  { y: 200 - m.trend[m.trend.length - 2] * 1.8, label: `Prev: ${m.trend[m.trend.length - 2]}%` },
                ].map((l, i) => (
                  <g key={i}>
                    <rect x="520" y={l.y - 8} width="78" height="16" rx="2" fill="#787b86" />
                    <text x="559" y={l.y + 3} fill="#fff" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">{l.label}</text>
                  </g>
                ))}
                {/* Current label */}
                <g>
                  <rect x="520" y={200 - m.trend[m.trend.length - 1] * 1.8 - 8} width="78" height="16" rx="2" fill={cl.up === false ? "#ef5350" : "#26a69a"} />
                  <text x="559" y={200 - m.trend[m.trend.length - 1] * 1.8 + 3} fill="#fff" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">{m.health}% health</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Key stats */}
          <div className="kstats">
            {[
              { label: "Outstanding", val: m.outstanding, color: parseFloat(m.outstanding.replace(/[$,]/g, "")) > 0 ? "#ff9800" : "#131722" },
              { label: "Hours logged", val: m.hours },
              { label: "Effective rate", val: m.rate },
              { label: "Projects", val: String(m.projects) },
              { label: "Health score", val: `${m.health}%`, color: m.health > 70 ? "#26a69a" : m.health > 40 ? "#ff9800" : "#ef5350" },
              { label: "Overdue", val: String(m.overdue), color: m.overdue > 0 ? "#ef5350" : "#26a69a" },
            ].map((s, i) => (
              <div key={i} className="kstat">
                <div className="kstat-label">{s.label}</div>
                <div className="kstat-val" style={{ color: s.color || "#131722" }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ WATCHLIST ═══ */}
        <div className="wl">
          <div className="wl-hd">
            <span className="wl-title">Watchlist</span>
            <div className="wl-tool">+</div>
            <div className="wl-tool">⊞</div>
            <div className="wl-tool">⋯</div>
          </div>

          {/* Column headers */}
          <div className="wl-colhd">
            <span style={{ flex: 1 }}>Client</span>
            <span style={{ width: 70, textAlign: "right" }}>Billed</span>
            <span style={{ width: 50, textAlign: "right" }}>Chg</span>
            <span style={{ width: 50, textAlign: "right" }}>Chg%</span>
          </div>

          {/* Overview metrics */}
          <div className="wl-sec"><span className="wl-sec-arrow">▾</span> OVERVIEW</div>
          {[
            { sym: "REV", name: "Revenue", val: "$14,800", chg: "+4,200", pct: "+40%", up: true, dot: "#26a69a", dotBg: "rgba(38,166,154,.08)" },
            { sym: "PIPE", name: "Pipeline", val: "$36,200", chg: "+8,400", pct: "+30%", up: true, dot: "#2962ff", dotBg: "rgba(41,98,255,.06)" },
            { sym: "OWED", name: "Outstanding", val: "$9,600", chg: "+1,200", pct: "+14%", up: false, dot: "#ff9800", dotBg: "rgba(255,152,0,.06)" },
            { sym: "RATE", name: "Eff. Rate", val: "$118", chg: "+3", pct: "+2.6%", up: true, dot: "#131722", dotBg: "rgba(0,0,0,.04)" },
          ].map((r, i) => (
            <div key={i} className="wl-row" style={{ cursor: "default" }}>
              <div className="wl-row-sym">
                <div className="wl-row-dot" style={{ background: r.dotBg, color: r.dot }}>{r.sym.slice(0, 1)}</div>
                <span className="wl-row-ticker">{r.sym}</span>
                <span className="wl-row-ind" style={{ background: r.dot }} />
              </div>
              <span className="wl-row-val">{r.val}</span>
              <span className="wl-row-chg" style={{ color: r.up ? "#26a69a" : "#ef5350" }}>{r.chg}</span>
              <span className="wl-row-pct" style={{ color: r.up ? "#26a69a" : "#ef5350" }}>{r.pct}</span>
            </div>
          ))}

          {/* Clients */}
          <div className="wl-sec"><span className="wl-sec-arrow">▾</span> CLIENTS</div>
          {clients.map(c => (
            <div key={c.id} className={`wl-row${activeClient === c.id ? " on" : ""}`}
              onClick={() => setActiveClient(c.id)}>
              <div className="wl-row-sym">
                <div className="wl-row-dot" style={{ background: c.id === "meridian" ? "rgba(124,133,148,.08)" : c.id === "bolt" ? "rgba(200,147,96,.06)" : c.id === "nora" ? "rgba(41,98,255,.05)" : "rgba(0,0,0,.03)", color: c.id === "meridian" ? "#7c8594" : c.id === "bolt" ? "#c89360" : c.id === "nora" ? "#2962ff" : "#9598a1", fontSize: 7, fontWeight: 700 }}>{c.sym.slice(0, 1)}</div>
                <span className="wl-row-ticker">{c.sym}</span>
                <span className="wl-row-ind" style={{ background: c.up === true ? "#26a69a" : c.up === false ? "#ef5350" : "#ff9800" }} />
              </div>
              <span className="wl-row-val">{c.val}</span>
              <span className="wl-row-chg" style={{ color: c.up === true ? "#26a69a" : c.up === false ? "#ef5350" : "#ff9800" }}>{c.chg}</span>
              <span className="wl-row-pct" style={{ color: c.up === true ? "#26a69a" : c.up === false ? "#ef5350" : "#ff9800" }}>{c.chgPct}</span>
            </div>
          ))}

          {/* Detail panel below — like TradingView's */}
          <div className="wl-detail">
            <div className="wl-detail-hd">
              <div className="wl-detail-dot" style={{ background: activeClient === "meridian" ? "rgba(124,133,148,.08)" : activeClient === "bolt" ? "rgba(200,147,96,.06)" : activeClient === "nora" ? "rgba(41,98,255,.05)" : "rgba(0,0,0,.03)", color: activeClient === "meridian" ? "#7c8594" : activeClient === "bolt" ? "#c89360" : activeClient === "nora" ? "#2962ff" : "#9598a1" }}>{cl.sym.slice(0, 2)}</div>
              <span className="wl-detail-sym">{cl.sym}</span>
              <div className="wl-detail-tools">
                <div className="wl-detail-tool">⊞</div>
                <div className="wl-detail-tool">✎</div>
                <div className="wl-detail-tool">⋯</div>
              </div>
            </div>
            <div className="wl-detail-name">{cl.name} · Active Client</div>
            <div className="wl-detail-price">
              <span className="wl-detail-price-val">{m.billed}</span>
              <span className="wl-detail-price-unit">billed</span>
              {cl.up !== null && <span className="wl-detail-price-chg" style={{ color: cl.up ? "#26a69a" : "#ef5350" }}>{cl.chg} {cl.chgPct}</span>}
            </div>
            <div className="wl-detail-sub">
              <span className="wl-detail-sub-dot" />
              <span>{m.projects} projects · Last active: recent</span>
            </div>

            {/* AI Insight */}
            <div className="wl-insight">
              <span className="wl-insight-dismiss">›</span>
              <span className="wl-insight-icon">✦</span>
              <span className="wl-insight-text">
                {activeClient === "meridian" && "Meridian has viewed Invoice #044 three times without paying. Consider a follow-up. Their avg payment cycle is 6 days."}
                {activeClient === "bolt" && "Bolt Fitness has $4,000 overdue (4 days late). This is unusual — their previous 3 invoices paid within 3 days."}
                {activeClient === "nora" && "Nora Kim is a new client trending well. 78% growth in billing this quarter. Consider proposing Phase 2."}
                {activeClient === "luna" && "Luna Boutique opened your proposal 4 times (3m avg read). High intent signal — follow up within 24 hours."}
              </span>
            </div>

            {/* Key stats */}
            <div className="wl-stats">
              <div className="wl-stats-title">Key stats</div>
              {[
                { label: "Outstanding", val: m.outstanding },
                { label: "Hours logged", val: m.hours },
                { label: "Effective rate", val: m.rate },
                { label: "Health score", val: `${m.health}%` },
                { label: "Overdue tasks", val: String(m.overdue) },
              ].map((s, i) => (
                <div key={i} className="wl-stat-row">
                  <span className="wl-stat-label">{s.label}</span>
                  <span className="wl-stat-val">{s.val}</span>
                </div>
              ))}
            </div>

            {/* Signals / alerts */}
            <div className="wl-alerts">
              <div className="wl-stats-title">Signals</div>
              {activeClient === "meridian" && <>
                <div className="wl-alert"><span className="wl-alert-dot" style={{ background: "#ef5350" }} /><span className="wl-alert-text">Invoice viewed 3×</span><span className="wl-alert-val" style={{ color: "#ef5350" }}>3m ago</span></div>
                <div className="wl-alert"><span className="wl-alert-dot" style={{ background: "#26a69a" }} /><span className="wl-alert-text">Contract signed</span><span className="wl-alert-val" style={{ color: "#26a69a" }}>18m ago</span></div>
              </>}
              {activeClient === "bolt" && <>
                <div className="wl-alert"><span className="wl-alert-dot" style={{ background: "#ef5350" }} /><span className="wl-alert-text">$4,000 overdue</span><span className="wl-alert-val" style={{ color: "#ef5350" }}>4d late</span></div>
                <div className="wl-alert"><span className="wl-alert-dot" style={{ background: "#ff9800" }} /><span className="wl-alert-text">No reply 46h</span><span className="wl-alert-val" style={{ color: "#ff9800" }}>46h</span></div>
              </>}
              {activeClient === "nora" && <>
                <div className="wl-alert"><span className="wl-alert-dot" style={{ background: "#26a69a" }} /><span className="wl-alert-text">Payment received</span><span className="wl-alert-val" style={{ color: "#26a69a" }}>$2,200</span></div>
              </>}
              {activeClient === "luna" && <>
                <div className="wl-alert"><span className="wl-alert-dot" style={{ background: "#2962ff" }} /><span className="wl-alert-text">Proposal opened 4×</span><span className="wl-alert-val" style={{ color: "#2962ff" }}>1h ago</span></div>
              </>}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
}
