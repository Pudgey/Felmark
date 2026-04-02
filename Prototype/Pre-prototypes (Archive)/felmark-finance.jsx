import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   FELMARK FINANCE — your money, visualized
   TradingView density × Warp energy × Notion calm
   ═══════════════════════════════════════════ */

function AnimNum({ value, prefix = "", suffix = "", decimals = 0 }) {
  const [d, setD] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const frame = () => {
      const p = Math.min((Date.now() - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setD(eased * value);
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [value]);
  return <>{prefix}{decimals > 0 ? d.toFixed(decimals) : Math.round(d).toLocaleString()}{suffix}</>;
}

// Revenue data
const MONTHLY = [
  { m: "Apr", rev: 3200, exp: 420, hours: 34, projects: 2 },
  { m: "May", rev: 5800, exp: 310, hours: 58, projects: 3 },
  { m: "Jun", rev: 4100, exp: 580, hours: 42, projects: 2 },
  { m: "Jul", rev: 7600, exp: 440, hours: 72, projects: 4 },
  { m: "Aug", rev: 6200, exp: 350, hours: 60, projects: 3 },
  { m: "Sep", rev: 9400, exp: 620, hours: 88, projects: 5 },
  { m: "Oct", rev: 8200, exp: 510, hours: 78, projects: 4 },
  { m: "Nov", rev: 11400, exp: 680, hours: 104, projects: 5 },
  { m: "Dec", rev: 9800, exp: 490, hours: 90, projects: 4 },
  { m: "Jan", rev: 13200, exp: 720, hours: 118, projects: 6 },
  { m: "Feb", rev: 10600, exp: 560, hours: 96, projects: 5 },
  { m: "Mar", rev: 14800, exp: 840, hours: 132, projects: 6 },
];

const CLIENTS_REV = [
  { name: "Meridian Studio", value: 12400, pct: 28.4, color: "#7c8594", trend: [3200, 2800, 4100, 2300] },
  { name: "Bolt Fitness", value: 8800, pct: 20.1, color: "#8a7e63", trend: [2200, 3400, 1800, 1400] },
  { name: "Nora Kim", value: 6600, pct: 15.1, color: "#a08472", trend: [0, 0, 1800, 4800] },
  { name: "Other clients", value: 15900, pct: 36.4, color: "#b8b3a8", trend: [4200, 5200, 3800, 2700] },
];

const INVOICES_AGING = [
  { id: "#047", client: "Meridian Studio", amount: 2400, status: "outstanding", age: 1, due: "Apr 13" },
  { id: "#044", client: "Bolt Fitness", amount: 4000, status: "overdue", age: 4, due: "Mar 25" },
  { id: "#046", client: "Nora Kim", amount: 1800, status: "paid", age: 0, paidDate: "Mar 15" },
  { id: "#045", client: "Meridian Studio", amount: 960, status: "paid", age: 0, paidDate: "Mar 18" },
  { id: "#043", client: "Bolt Fitness", amount: 2000, status: "paid", age: 0, paidDate: "Mar 10" },
];

const SERVICES_REV = [
  { name: "Brand Identity", earned: 28600, count: 8, avgDeal: 3575, rate: 119, color: "#b07d4f" },
  { name: "Website Design", earned: 21000, count: 5, avgDeal: 4200, rate: 105, color: "#5b7fa4" },
  { name: "Content & Copy", earned: 18400, count: 12, avgDeal: 1533, rate: 96, color: "#5a9a3c" },
  { name: "Strategy", earned: 22500, count: 15, avgDeal: 1500, rate: 125, color: "#7c6b9e" },
  { name: "Social Media", earned: 7800, count: 6, avgDeal: 1300, rate: 87, color: "#8a7e63" },
];

const EXPENSES_CAT = [
  { name: "Software & Tools", amount: 2400, pct: 38 },
  { name: "Subcontractors", amount: 1800, pct: 29 },
  { name: "Assets & Licenses", amount: 1200, pct: 19 },
  { name: "Other", amount: 880, pct: 14 },
];

export default function Finance() {
  const [period, setPeriod] = useState("12m");
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [hoveredClient, setHoveredClient] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => { const i = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(i); }, []);

  const totalRev = MONTHLY.reduce((s, m) => s + m.rev, 0);
  const totalExp = MONTHLY.reduce((s, m) => s + m.exp, 0);
  const totalProfit = totalRev - totalExp;
  const profitMargin = Math.round((totalProfit / totalRev) * 100);
  const totalHours = MONTHLY.reduce((s, m) => s + m.hours, 0);
  const effectiveRate = Math.round(totalRev / totalHours);
  const maxRev = Math.max(...MONTHLY.map(m => m.rev));
  const avgMonthly = Math.round(totalRev / 12);
  const currentMonth = MONTHLY[MONTHLY.length - 1];
  const prevMonth = MONTHLY[MONTHLY.length - 2];
  const momChange = Math.round(((currentMonth.rev - prevMonth.rev) / prevMonth.rev) * 100);
  const annualProjection = currentMonth.rev * 12;
  const taxEstimate = Math.round(annualProjection * 0.28);
  const outstanding = INVOICES_AGING.filter(i => i.status === "outstanding").reduce((s, i) => s + i.amount, 0);
  const overdue = INVOICES_AGING.filter(i => i.status === "overdue").reduce((s, i) => s + i.amount, 0);
  const maxServiceEarned = Math.max(...SERVICES_REV.map(s => s.earned));

  // SVG chart helpers
  const chartW = 600, chartH = 140, pad = { t: 8, r: 8, b: 20, l: 8 };
  const cW = chartW - pad.l - pad.r, cH = chartH - pad.t - pad.b;

  const revenuePoints = MONTHLY.map((m, i) => ({
    x: pad.l + (i / (MONTHLY.length - 1)) * cW,
    y: pad.t + cH - (m.rev / (maxRev * 1.15)) * cH,
  }));
  const revLine = revenuePoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const revArea = `${revLine} L${revenuePoints[revenuePoints.length - 1].x},${pad.t + cH} L${revenuePoints[0].x},${pad.t + cH} Z`;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
        .fin{font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink-700);background:var(--ink-900);min-height:100vh;display:flex;flex-direction:column}

        /* ── Header (dark Warp style) ── */
        .fin-head{padding:16px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.04);flex-shrink:0}
        .fin-head-left{display:flex;align-items:center;gap:14px}
        .fin-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:rgba(255,255,255,0.9)}
        .fin-subtitle{font-family:var(--mono);font-size:10px;color:rgba(255,255,255,0.25)}
        .fin-head-right{display:flex;align-items:center;gap:6px}
        .fin-period{display:flex;border:1px solid rgba(255,255,255,0.06);border-radius:5px;overflow:hidden}
        .fin-period-btn{padding:5px 12px;font-family:var(--mono);font-size:10px;border:none;cursor:pointer;color:rgba(255,255,255,0.3);background:none;transition:all .06s}
        .fin-period-btn:hover{color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.02)}
        .fin-period-btn.on{color:var(--ember);background:rgba(176,125,79,0.08)}
        .fin-export{padding:5px 14px;border-radius:5px;border:1px solid rgba(255,255,255,0.06);background:none;font-family:var(--mono);font-size:10px;color:rgba(255,255,255,0.3);cursor:pointer;transition:all .06s}
        .fin-export:hover{color:rgba(255,255,255,0.5);border-color:rgba(255,255,255,0.1)}

        /* ── Ticker strip ── */
        .fin-ticker{display:flex;gap:0;border-bottom:1px solid rgba(255,255,255,0.04);flex-shrink:0;overflow-x:auto}
        .fin-ticker::-webkit-scrollbar{display:none}
        .fin-tick{padding:14px 20px;border-right:1px solid rgba(255,255,255,0.03);min-width:140px;transition:background .06s;cursor:default}
        .fin-tick:hover{background:rgba(255,255,255,0.01)}
        .fin-tick-val{font-family:var(--mono);font-size:20px;font-weight:600;line-height:1}
        .fin-tick-val.green{color:#5a9a3c}.fin-tick-val.ember{color:var(--ember)}.fin-tick-val.red{color:#c24b38}.fin-tick-val.white{color:rgba(255,255,255,0.85)}
        .fin-tick-label{font-family:var(--mono);font-size:9px;color:rgba(255,255,255,0.2);text-transform:uppercase;letter-spacing:.06em;margin-top:4px}
        .fin-tick-change{font-family:var(--mono);font-size:10px;margin-top:2px}
        .fin-tick-change.up{color:#5a9a3c}.fin-tick-change.down{color:#c24b38}
        .fin-tick-spark{margin-top:6px;height:20px}

        /* ── Grid ── */
        .fin-grid{flex:1;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto;gap:1px;background:rgba(255,255,255,0.03);overflow:auto}

        /* ── Panel (each grid cell) ── */
        .fin-panel{background:var(--ink-900);padding:0;display:flex;flex-direction:column;overflow:hidden}
        .fin-panel-head{display:flex;align-items:center;justify-content:space-between;padding:12px 18px 8px}
        .fin-panel-title{font-family:var(--mono);font-size:10px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.1em}
        .fin-panel-action{font-family:var(--mono);font-size:9px;color:rgba(255,255,255,0.15);background:none;border:1px solid rgba(255,255,255,0.04);border-radius:3px;padding:2px 8px;cursor:pointer;transition:all .06s}
        .fin-panel-action:hover{color:rgba(255,255,255,0.3);border-color:rgba(255,255,255,0.08)}
        .fin-panel-body{flex:1;padding:0 18px 14px}

        /* ── Revenue chart ── */
        .fin-chart-svg{width:100%;display:block}

        /* ── Bar chart (Warp style) ── */
        .fin-bars{display:flex;gap:3px;height:120px;align-items:flex-end;padding:4px 0}
        .fin-bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:0;height:100%;justify-content:flex-end;cursor:pointer;position:relative}
        .fin-bar-col:hover .fin-bar-tooltip{opacity:1;transform:translateY(0)}
        .fin-bar{width:100%;border-radius:2px 2px 0 0;transition:all .15s;min-height:2px;position:relative}
        .fin-bar-col:hover .fin-bar{filter:brightness(1.2)}
        .fin-bar-exp{width:100%;border-radius:0;min-height:1px}
        .fin-bar-label{font-family:var(--mono);font-size:9px;color:rgba(255,255,255,0.15);margin-top:4px}
        .fin-bar-col:hover .fin-bar-label{color:rgba(255,255,255,0.4)}
        .fin-bar-tooltip{position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%) translateY(4px);background:rgba(255,255,255,0.08);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:8px 12px;font-family:var(--mono);font-size:10px;color:rgba(255,255,255,0.7);white-space:nowrap;opacity:0;transition:all .12s;z-index:5;pointer-events:none}
        .fin-bar-tt-val{font-size:14px;font-weight:600;color:#fff;display:block;margin-bottom:2px}
        .fin-bar-tt-sub{color:rgba(255,255,255,0.3);display:block}

        /* ── Client breakdown ── */
        .fin-client-rows{display:flex;flex-direction:column;gap:4px}
        .fin-client-row{display:flex;align-items:center;gap:10px;padding:7px 0;cursor:pointer;transition:all .06s;border-radius:4px;margin:0 -6px;padding-left:6px;padding-right:6px}
        .fin-client-row:hover{background:rgba(255,255,255,0.02)}
        .fin-client-row.on{background:rgba(176,125,79,0.04)}
        .fin-client-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0}
        .fin-client-name{font-size:13px;color:rgba(255,255,255,0.6);flex:1}
        .fin-client-spark{width:60px;height:20px;flex-shrink:0}
        .fin-client-val{font-family:var(--mono);font-size:13px;color:rgba(255,255,255,0.7);font-weight:500;min-width:60px;text-align:right}
        .fin-client-pct{font-family:var(--mono);font-size:10px;color:rgba(255,255,255,0.2);min-width:36px;text-align:right}
        .fin-client-bar-wrap{flex:1;max-width:120px}
        .fin-client-bar{height:4px;border-radius:2px;background:rgba(255,255,255,0.04);overflow:hidden}
        .fin-client-bar-fill{height:100%;border-radius:2px;transition:width .4s}

        /* ── Invoice aging ── */
        .fin-inv-table{width:100%}
        .fin-inv-header{display:flex;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-family:var(--mono);font-size:9px;color:rgba(255,255,255,0.15);text-transform:uppercase;letter-spacing:.06em}
        .fin-inv-row{display:flex;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.02);transition:background .06s;cursor:pointer}
        .fin-inv-row:hover{background:rgba(255,255,255,0.01)}
        .fin-inv-row:last-child{border-bottom:none}
        .fin-inv-cell{font-family:var(--mono);font-size:12px;color:rgba(255,255,255,0.5)}
        .fin-inv-cell.id{width:60px;flex-shrink:0;color:rgba(255,255,255,0.3)}
        .fin-inv-cell.client{flex:1;color:rgba(255,255,255,0.5)}
        .fin-inv-cell.amount{width:80px;text-align:right;font-weight:500;color:rgba(255,255,255,0.7)}
        .fin-inv-cell.status{width:90px;text-align:right}
        .fin-inv-status{font-size:9px;font-weight:500;padding:2px 7px;border-radius:3px;display:inline-block}
        .fin-inv-status.paid{color:#5a9a3c;background:rgba(90,154,60,0.08)}
        .fin-inv-status.outstanding{color:var(--ember);background:rgba(176,125,79,0.08)}
        .fin-inv-status.overdue{color:#c24b38;background:rgba(194,75,56,0.08)}

        /* ── Services table ── */
        .fin-svc-rows{display:flex;flex-direction:column;gap:2px}
        .fin-svc-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.02)}
        .fin-svc-row:last-child{border-bottom:none}
        .fin-svc-dot{width:6px;height:6px;border-radius:2px;flex-shrink:0}
        .fin-svc-name{font-size:12px;color:rgba(255,255,255,0.5);width:110px;flex-shrink:0}
        .fin-svc-bar-wrap{flex:1;height:6px;background:rgba(255,255,255,0.03);border-radius:3px;overflow:hidden}
        .fin-svc-bar-fill{height:100%;border-radius:3px;transition:width .4s}
        .fin-svc-val{font-family:var(--mono);font-size:11px;color:rgba(255,255,255,0.5);min-width:54px;text-align:right}
        .fin-svc-rate{font-family:var(--mono);font-size:10px;color:rgba(255,255,255,0.2);min-width:48px;text-align:right}

        /* ── Expenses breakdown ── */
        .fin-exp-rows{display:flex;flex-direction:column;gap:6px}
        .fin-exp-row{display:flex;align-items:center;gap:8px}
        .fin-exp-name{font-size:12px;color:rgba(255,255,255,0.4);width:130px;flex-shrink:0}
        .fin-exp-bar-wrap{flex:1;height:4px;background:rgba(255,255,255,0.03);border-radius:2px;overflow:hidden}
        .fin-exp-bar-fill{height:100%;border-radius:2px;background:rgba(194,75,56,0.3)}
        .fin-exp-val{font-family:var(--mono);font-size:11px;color:rgba(194,75,56,0.5);min-width:54px;text-align:right}
        .fin-exp-pct{font-family:var(--mono);font-size:10px;color:rgba(255,255,255,0.15);min-width:30px;text-align:right}

        /* ── Tax panel ── */
        .fin-tax-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .fin-tax-card{padding:12px;border:1px solid rgba(255,255,255,0.04);border-radius:6px;text-align:center}
        .fin-tax-card-val{font-family:var(--mono);font-size:18px;font-weight:600;color:rgba(255,255,255,0.7)}
        .fin-tax-card-val.ember{color:var(--ember)}
        .fin-tax-card-label{font-family:var(--mono);font-size:9px;color:rgba(255,255,255,0.15);text-transform:uppercase;letter-spacing:.04em;margin-top:2px}
        .fin-tax-bar{margin-top:10px;height:4px;background:rgba(255,255,255,0.03);border-radius:2px;overflow:hidden}
        .fin-tax-bar-fill{height:100%;border-radius:2px;background:#7c6b9e;transition:width .4s}
        .fin-tax-bar-label{display:flex;justify-content:space-between;margin-top:4px;font-family:var(--mono);font-size:9px;color:rgba(255,255,255,0.15)}

        /* ── Cashflow mini ── */
        .fin-cf-rows{display:flex;flex-direction:column;gap:4px}
        .fin-cf-row{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:11px}
        .fin-cf-label{color:rgba(255,255,255,0.3);width:90px;flex-shrink:0}
        .fin-cf-bar-wrap{flex:1;height:6px;background:rgba(255,255,255,0.02);border-radius:3px;overflow:hidden;display:flex}
        .fin-cf-bar-in{height:100%;background:#5a9a3c;border-radius:3px 0 0 3px}
        .fin-cf-bar-out{height:100%;background:rgba(194,75,56,0.4);border-radius:0 3px 3px 0}
        .fin-cf-val{color:rgba(255,255,255,0.4);min-width:60px;text-align:right}

        /* ── Footer ── */
        .fin-footer{padding:6px 24px;border-top:1px solid rgba(255,255,255,0.03);display:flex;justify-content:space-between;font-family:var(--mono);font-size:10px;color:rgba(255,255,255,0.12);flex-shrink:0}
      `}</style>

      <div className="fin">
        {/* ── Header ── */}
        <div className="fin-head">
          <div className="fin-head-left">
            <span className="fin-title">Finance</span>
            <span className="fin-subtitle">Last updated {now.toLocaleTimeString()}</span>
          </div>
          <div className="fin-head-right">
            <div className="fin-period">
              {["3m", "6m", "12m", "YTD", "All"].map(p => (
                <button key={p} className={`fin-period-btn${period === p ? " on" : ""}`} onClick={() => setPeriod(p)}>{p}</button>
              ))}
            </div>
            <button className="fin-export">Export CSV</button>
          </div>
        </div>

        {/* ── Ticker strip ── */}
        <div className="fin-ticker">
          <div className="fin-tick">
            <div className="fin-tick-val green"><AnimNum value={14800} prefix="$" /></div>
            <div className="fin-tick-label">this month</div>
            <div className={`fin-tick-change ${momChange >= 0 ? "up" : "down"}`}>{momChange >= 0 ? "↑" : "↓"} {Math.abs(momChange)}% MoM</div>
          </div>
          <div className="fin-tick">
            <div className="fin-tick-val white"><AnimNum value={totalRev} prefix="$" /></div>
            <div className="fin-tick-label">12m revenue</div>
          </div>
          <div className="fin-tick">
            <div className="fin-tick-val ember"><AnimNum value={totalProfit} prefix="$" /></div>
            <div className="fin-tick-label">net profit</div>
            <div className="fin-tick-change up">{profitMargin}% margin</div>
          </div>
          <div className="fin-tick">
            <div className="fin-tick-val white">${effectiveRate}</div>
            <div className="fin-tick-label">effective rate</div>
            <div className="fin-tick-change up">↑ $8 vs avg</div>
          </div>
          <div className="fin-tick">
            <div className="fin-tick-val" style={{ color: "#5b7fa4" }}><AnimNum value={outstanding} prefix="$" /></div>
            <div className="fin-tick-label">outstanding</div>
          </div>
          <div className="fin-tick">
            <div className="fin-tick-val red"><AnimNum value={overdue} prefix="$" /></div>
            <div className="fin-tick-label">overdue</div>
            <div className="fin-tick-change down">4 days late</div>
          </div>
          <div className="fin-tick">
            <div className="fin-tick-val" style={{ color: "#7c6b9e" }}><AnimNum value={taxEstimate} prefix="$" /></div>
            <div className="fin-tick-label">est. annual tax</div>
          </div>
          <div className="fin-tick">
            <div className="fin-tick-val white"><AnimNum value={totalHours} /></div>
            <div className="fin-tick-label">hours logged</div>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="fin-grid">
          {/* ── Panel 1: Revenue chart + bars ── */}
          <div className="fin-panel">
            <div className="fin-panel-head">
              <span className="fin-panel-title">revenue · 12 months</span>
              <button className="fin-panel-action">Breakdown</button>
            </div>
            <div className="fin-panel-body">
              {/* SVG Line */}
              <svg className="fin-chart-svg" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none" style={{ height: 100, marginBottom: 8 }}>
                {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
                  <line key={i} x1={pad.l} y1={pad.t + cH * (1 - f)} x2={chartW - pad.r} y2={pad.t + cH * (1 - f)} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                ))}
                <defs>
                  <linearGradient id="rvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5a9a3c" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#5a9a3c" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={revArea} fill="url(#rvGrad)" />
                <path d={revLine} fill="none" stroke="#5a9a3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {revenuePoints.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={hoveredMonth === i ? 4 : 2} fill={hoveredMonth === i ? "#5a9a3c" : "var(--ink-900)"} stroke="#5a9a3c" strokeWidth="1.5" style={{ transition: "r 0.1s", cursor: "pointer" }}
                    onMouseEnter={() => setHoveredMonth(i)} onMouseLeave={() => setHoveredMonth(null)} />
                ))}
                {MONTHLY.map((m, i) => (
                  <text key={i} x={revenuePoints[i].x} y={chartH - 4} textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="9" fontFamily="'JetBrains Mono', monospace">{m.m}</text>
                ))}
              </svg>

              {/* Bars: revenue vs expenses */}
              <div className="fin-bars" style={{ height: 80 }}>
                {MONTHLY.map((m, i) => {
                  const revH = (m.rev / maxRev) * 100;
                  const expH = (m.exp / maxRev) * 100;
                  const isCurrent = i === MONTHLY.length - 1;
                  return (
                    <div key={i} className="fin-bar-col" onMouseEnter={() => setHoveredMonth(i)} onMouseLeave={() => setHoveredMonth(null)}>
                      <div className="fin-bar-tooltip">
                        <span className="fin-bar-tt-val">${m.rev.toLocaleString()}</span>
                        <span className="fin-bar-tt-sub">exp: ${m.exp} · {m.hours}h · {m.projects} projects</span>
                      </div>
                      <div className="fin-bar" style={{ height: `${revH}%`, background: isCurrent ? "#5a9a3c" : "rgba(90,154,60,0.2)" }} />
                      <div className="fin-bar-exp" style={{ height: `${expH}%`, background: "rgba(194,75,56,0.15)" }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Panel 2: Client breakdown ── */}
          <div className="fin-panel">
            <div className="fin-panel-head">
              <span className="fin-panel-title">revenue by client</span>
              <button className="fin-panel-action">Details</button>
            </div>
            <div className="fin-panel-body">
              {/* Donut mini */}
              <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 14 }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  {(() => { const r = 30, circ = 2 * Math.PI * r; let offset = circ * 0.25; return CLIENTS_REV.map((c, i) => { const dash = circ * (c.pct / 100); const gap = circ - dash; const thisOffset = offset; offset -= dash; return <circle key={i} cx="40" cy="40" r={r} fill="none" stroke={c.color} strokeWidth={hoveredClient === i ? 10 : 7} strokeDasharray={`${dash - 1.5} ${gap + 1.5}`} strokeDashoffset={-thisOffset} opacity={hoveredClient !== null && hoveredClient !== i ? 0.2 : 0.7} style={{ transition: "all 0.2s", cursor: "pointer" }} onMouseEnter={() => setHoveredClient(i)} onMouseLeave={() => setHoveredClient(null)} />; }); })()}
                  <text x="40" y="38" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="14" fontWeight="600" fontFamily="'JetBrains Mono', monospace">${(totalRev / 1000).toFixed(0)}k</text>
                  <text x="40" y="50" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="8" fontFamily="'JetBrains Mono', monospace">TOTAL</text>
                </svg>
                <div style={{ flex: 1 }}>
                  <div className="fin-client-rows">
                    {CLIENTS_REV.map((c, i) => {
                      const sparkMax = Math.max(...c.trend);
                      return (
                        <div key={i} className={`fin-client-row${hoveredClient === i ? " on" : ""}`}
                          onMouseEnter={() => setHoveredClient(i)} onMouseLeave={() => setHoveredClient(null)}>
                          <span className="fin-client-dot" style={{ background: c.color }} />
                          <span className="fin-client-name">{c.name}</span>
                          <svg className="fin-client-spark" viewBox="0 0 60 20" preserveAspectRatio="none">
                            <polyline points={c.trend.map((v, vi) => `${(vi / (c.trend.length - 1)) * 60},${20 - (v / sparkMax) * 16 - 2}`).join(" ")} fill="none" stroke={c.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                          </svg>
                          <span className="fin-client-val">${(c.value / 1000).toFixed(1)}k</span>
                          <span className="fin-client-pct">{c.pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Panel 3: Services + Invoices ── */}
          <div className="fin-panel">
            <div className="fin-panel-head">
              <span className="fin-panel-title">revenue by service</span>
              <button className="fin-panel-action">Services</button>
            </div>
            <div className="fin-panel-body">
              <div className="fin-svc-rows">
                {SERVICES_REV.map((s, i) => (
                  <div key={i} className="fin-svc-row">
                    <span className="fin-svc-dot" style={{ background: s.color }} />
                    <span className="fin-svc-name">{s.name}</span>
                    <div className="fin-svc-bar-wrap">
                      <div className="fin-svc-bar-fill" style={{ width: `${(s.earned / maxServiceEarned) * 100}%`, background: s.color, opacity: 0.4 }} />
                    </div>
                    <span className="fin-svc-val">${(s.earned / 1000).toFixed(1)}k</span>
                    <span className="fin-svc-rate">${s.rate}/hr</span>
                  </div>
                ))}
              </div>

              {/* Invoice aging below */}
              <div style={{ marginTop: 16 }}>
                <div className="fin-panel-title" style={{ marginBottom: 6, fontSize: 9, fontFamily: "var(--mono)", color: "rgba(255,255,255,0.15)", textTransform: "uppercase", letterSpacing: "0.1em" }}>invoice aging</div>
                <div className="fin-inv-table">
                  <div className="fin-inv-header">
                    <span className="fin-inv-cell id">Invoice</span>
                    <span className="fin-inv-cell client">Client</span>
                    <span className="fin-inv-cell amount">Amount</span>
                    <span className="fin-inv-cell status">Status</span>
                  </div>
                  {INVOICES_AGING.map(inv => (
                    <div key={inv.id} className="fin-inv-row">
                      <span className="fin-inv-cell id">{inv.id}</span>
                      <span className="fin-inv-cell client">{inv.client}</span>
                      <span className="fin-inv-cell amount">${inv.amount.toLocaleString()}</span>
                      <span className="fin-inv-cell status">
                        <span className={`fin-inv-status ${inv.status}`}>
                          {inv.status === "paid" ? "Paid" : inv.status === "overdue" ? `${inv.age}d overdue` : "Net 15"}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Panel 4: Expenses + Tax + Cashflow ── */}
          <div className="fin-panel">
            <div className="fin-panel-head">
              <span className="fin-panel-title">expenses & tax</span>
              <button className="fin-panel-action">Breakdown</button>
            </div>
            <div className="fin-panel-body">
              {/* Expenses */}
              <div className="fin-exp-rows">
                {EXPENSES_CAT.map((e, i) => (
                  <div key={i} className="fin-exp-row">
                    <span className="fin-exp-name">{e.name}</span>
                    <div className="fin-exp-bar-wrap">
                      <div className="fin-exp-bar-fill" style={{ width: `${e.pct}%` }} />
                    </div>
                    <span className="fin-exp-val">-${e.amount.toLocaleString()}</span>
                    <span className="fin-exp-pct">{e.pct}%</span>
                  </div>
                ))}
              </div>

              {/* Tax */}
              <div style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 8, fontSize: 9, fontFamily: "var(--mono)", color: "rgba(255,255,255,0.15)", textTransform: "uppercase", letterSpacing: "0.1em" }}>tax estimate</div>
                <div className="fin-tax-grid">
                  <div className="fin-tax-card">
                    <div className="fin-tax-card-val ember">${(taxEstimate / 1000).toFixed(1)}k</div>
                    <div className="fin-tax-card-label">annual estimate</div>
                  </div>
                  <div className="fin-tax-card">
                    <div className="fin-tax-card-val" style={{ color: "#7c6b9e" }}>${Math.round(taxEstimate / 4).toLocaleString()}</div>
                    <div className="fin-tax-card-label">quarterly</div>
                  </div>
                </div>
                <div className="fin-tax-bar">
                  <div className="fin-tax-bar-fill" style={{ width: "50%" }} />
                </div>
                <div className="fin-tax-bar-label">
                  <span>$19,880 paid</span>
                  <span>${(taxEstimate - 19880).toLocaleString()} remaining</span>
                </div>
              </div>

              {/* Cashflow */}
              <div style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 8, fontSize: 9, fontFamily: "var(--mono)", color: "rgba(255,255,255,0.15)", textTransform: "uppercase", letterSpacing: "0.1em" }}>cashflow · last 3 months</div>
                <div className="fin-cf-rows">
                  {[{ label: "January", inPct: 85, outPct: 15, net: "+$12,480" }, { label: "February", inPct: 80, outPct: 20, net: "+$10,040" }, { label: "March", inPct: 88, outPct: 12, net: "+$13,960" }].map((cf, i) => (
                    <div key={i} className="fin-cf-row">
                      <span className="fin-cf-label">{cf.label}</span>
                      <div className="fin-cf-bar-wrap">
                        <div className="fin-cf-bar-in" style={{ width: `${cf.inPct}%` }} />
                        <div className="fin-cf-bar-out" style={{ width: `${cf.outPct}%` }} />
                      </div>
                      <span className="fin-cf-val" style={{ color: "rgba(90,154,60,0.5)" }}>{cf.net}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fin-footer">
          <span>Felmark Finance · All data from your workspace</span>
          <span>{now.toLocaleTimeString()}</span>
        </div>
      </div>
    </>
  );
}
