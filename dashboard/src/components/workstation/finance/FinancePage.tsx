"use client";

import { useState, useEffect } from "react";
import styles from "./FinancePage.module.css";

function AnimNum({ value, prefix = "", decimals = 0 }: { value: number; prefix?: string; decimals?: number }) {
  const [d, setD] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const frame = () => {
      const p = Math.min((Date.now() - start) / 1200, 1);
      setD((1 - Math.pow(1 - p, 3)) * value);
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [value]);
  return <>{prefix}{decimals > 0 ? d.toFixed(decimals) : Math.round(d).toLocaleString()}</>;
}

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

const CLIENTS = [
  { name: "Meridian Studio", value: 12400, pct: 28.4, color: "#7c8594", trend: [3200, 2800, 4100, 2300] },
  { name: "Bolt Fitness", value: 8800, pct: 20.1, color: "#8a7e63", trend: [2200, 3400, 1800, 1400] },
  { name: "Nora Kim", value: 6600, pct: 15.1, color: "#a08472", trend: [0, 0, 1800, 4800] },
  { name: "Other clients", value: 15900, pct: 36.4, color: "#b8b3a8", trend: [4200, 5200, 3800, 2700] },
];

const INVOICES = [
  { id: "#047", client: "Meridian Studio", amount: 2400, status: "outstanding" as const, age: 1 },
  { id: "#044", client: "Bolt Fitness", amount: 4000, status: "overdue" as const, age: 4 },
  { id: "#046", client: "Nora Kim", amount: 1800, status: "paid" as const, age: 0 },
  { id: "#045", client: "Meridian Studio", amount: 960, status: "paid" as const, age: 0 },
  { id: "#043", client: "Bolt Fitness", amount: 2000, status: "paid" as const, age: 0 },
];

const SERVICES = [
  { name: "Brand Identity", earned: 28600, rate: 119, color: "#b07d4f" },
  { name: "Website Design", earned: 21000, rate: 105, color: "#5b7fa4" },
  { name: "Content & Copy", earned: 18400, rate: 96, color: "#5a9a3c" },
  { name: "Strategy", earned: 22500, rate: 125, color: "#7c6b9e" },
  { name: "Social Media", earned: 7800, rate: 87, color: "#8a7e63" },
];

const EXPENSES = [
  { name: "Software & Tools", amount: 2400, pct: 38 },
  { name: "Subcontractors", amount: 1800, pct: 29 },
  { name: "Assets & Licenses", amount: 1200, pct: 19 },
  { name: "Other", amount: 880, pct: 14 },
];

const CASHFLOW = [
  { label: "January", inPct: 85, outPct: 15, net: "+$12,480" },
  { label: "February", inPct: 80, outPct: 20, net: "+$10,040" },
  { label: "March", inPct: 88, outPct: 12, net: "+$13,960" },
];

export default function FinancePage() {
  const [period, setPeriod] = useState("12m");
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [hoveredClient, setHoveredClient] = useState<number | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => { const i = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(i); }, []);

  const totalRev = MONTHLY.reduce((s, m) => s + m.rev, 0);
  const totalExp = MONTHLY.reduce((s, m) => s + m.exp, 0);
  const totalProfit = totalRev - totalExp;
  const profitMargin = Math.round((totalProfit / totalRev) * 100);
  const totalHours = MONTHLY.reduce((s, m) => s + m.hours, 0);
  const effectiveRate = Math.round(totalRev / totalHours);
  const maxRev = Math.max(...MONTHLY.map(m => m.rev));
  const currentMonth = MONTHLY[MONTHLY.length - 1];
  const prevMonth = MONTHLY[MONTHLY.length - 2];
  const momChange = Math.round(((currentMonth.rev - prevMonth.rev) / prevMonth.rev) * 100);
  const taxEstimate = Math.round(currentMonth.rev * 12 * 0.28);
  const outstanding = INVOICES.filter(i => i.status === "outstanding").reduce((s, i) => s + i.amount, 0);
  const overdue = INVOICES.filter(i => i.status === "overdue").reduce((s, i) => s + i.amount, 0);
  const maxServiceEarned = Math.max(...SERVICES.map(s => s.earned));

  // SVG chart
  const chartW = 600, chartH = 140, pad = { t: 8, r: 8, b: 20, l: 8 };
  const cW = chartW - pad.l - pad.r, cH = chartH - pad.t - pad.b;
  const pts = MONTHLY.map((m, i) => ({ x: pad.l + (i / (MONTHLY.length - 1)) * cW, y: pad.t + cH - (m.rev / (maxRev * 1.15)) * cH }));
  const revLine = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const revArea = `${revLine} L${pts[pts.length - 1].x},${pad.t + cH} L${pts[0].x},${pad.t + cH} Z`;

  // Donut
  const donutR = 30, donutCirc = 2 * Math.PI * donutR;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.head}>
        <div className={styles.headLeft}>
          <span className={styles.title}>Finance</span>
          <span className={styles.subtitle}>Last updated {now.toLocaleTimeString()}</span>
        </div>
        <div className={styles.headRight}>
          <div className={styles.periodToggle}>
            {["3m", "6m", "12m", "YTD", "All"].map(p => (
              <button key={p} className={`${styles.periodBtn} ${period === p ? styles.periodOn : ""}`} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          <button className={styles.exportBtn}>Export CSV</button>
        </div>
      </div>

      {/* Ticker */}
      <div className={styles.ticker}>
        <div className={styles.tick}><div className={`${styles.tickVal} ${styles.green}`}><AnimNum value={14800} prefix="$" /></div><div className={styles.tickLabel}>this month</div><div className={`${styles.tickChange} ${momChange >= 0 ? styles.up : styles.down}`}>{momChange >= 0 ? "↑" : "↓"} {Math.abs(momChange)}% MoM</div></div>
        <div className={styles.tick}><div className={`${styles.tickVal} ${styles.white}`}><AnimNum value={totalRev} prefix="$" /></div><div className={styles.tickLabel}>12m revenue</div></div>
        <div className={styles.tick}><div className={`${styles.tickVal} ${styles.ember}`}><AnimNum value={totalProfit} prefix="$" /></div><div className={styles.tickLabel}>net profit</div><div className={`${styles.tickChange} ${styles.up}`}>{profitMargin}% margin</div></div>
        <div className={styles.tick}><div className={`${styles.tickVal} ${styles.white}`}>${effectiveRate}</div><div className={styles.tickLabel}>effective rate</div><div className={`${styles.tickChange} ${styles.up}`}>↑ $8 vs avg</div></div>
        <div className={styles.tick}><div className={`${styles.tickVal} ${styles.blue}`}><AnimNum value={outstanding} prefix="$" /></div><div className={styles.tickLabel}>outstanding</div></div>
        <div className={styles.tick}><div className={`${styles.tickVal} ${styles.red}`}><AnimNum value={overdue} prefix="$" /></div><div className={styles.tickLabel}>overdue</div><div className={`${styles.tickChange} ${styles.down}`}>4 days late</div></div>
        <div className={styles.tick}><div className={`${styles.tickVal} ${styles.purple}`}><AnimNum value={taxEstimate} prefix="$" /></div><div className={styles.tickLabel}>est. annual tax</div></div>
        <div className={styles.tick}><div className={`${styles.tickVal} ${styles.white}`}><AnimNum value={totalHours} /></div><div className={styles.tickLabel}>hours logged</div></div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {/* Panel 1: Revenue chart + bars */}
        <div className={styles.panel}>
          <div className={styles.panelHead}><span className={styles.panelTitle}>revenue · 12 months</span><button className={styles.panelAction}>Breakdown</button></div>
          <div className={styles.panelBody}>
            <svg className={styles.chartSvg} viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none" style={{ height: 100, marginBottom: 8 }}>
              {[0, 0.25, 0.5, 0.75, 1].map((f, i) => <line key={i} x1={pad.l} y1={pad.t + cH * (1 - f)} x2={chartW - pad.r} y2={pad.t + cH * (1 - f)} stroke="rgba(0,0,0,0.04)" strokeWidth="1" />)}
              <defs><linearGradient id="rvGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a8a2c" stopOpacity="0.12" /><stop offset="100%" stopColor="#4a8a2c" stopOpacity="0" /></linearGradient></defs>
              <path d={revArea} fill="url(#rvGrad)" />
              <path d={revLine} fill="none" stroke="#4a8a2c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={hoveredMonth === i ? 4 : 2} fill={hoveredMonth === i ? "#4a8a2c" : "var(--parchment)"} stroke="#4a8a2c" strokeWidth="1.5" style={{ transition: "r 0.1s", cursor: "pointer" }} onMouseEnter={() => setHoveredMonth(i)} onMouseLeave={() => setHoveredMonth(null)} />)}
              {MONTHLY.map((m, i) => <text key={i} x={pts[i].x} y={chartH - 4} textAnchor="middle" fill="var(--ink-300)" fontSize="9" fontFamily="'JetBrains Mono', monospace">{m.m}</text>)}
            </svg>
            <div className={styles.bars} style={{ height: 80 }}>
              {MONTHLY.map((m, i) => {
                const revH = (m.rev / maxRev) * 100;
                const expH = (m.exp / maxRev) * 100;
                const isCurrent = i === MONTHLY.length - 1;
                return (
                  <div key={i} className={styles.barCol} onMouseEnter={() => setHoveredMonth(i)} onMouseLeave={() => setHoveredMonth(null)}>
                    {hoveredMonth === i && <div className={styles.barTooltip}><span className={styles.barTtVal}>${m.rev.toLocaleString()}</span><span className={styles.barTtSub}>exp: ${m.exp} · {m.hours}h · {m.projects} proj</span></div>}
                    <div className={styles.bar} style={{ height: `${revH}%`, background: isCurrent ? "#4a8a2c" : "rgba(74,138,44,0.18)" }} />
                    <div className={styles.barExp} style={{ height: `${expH}%` }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel 2: Client donut + sparklines */}
        <div className={styles.panel}>
          <div className={styles.panelHead}><span className={styles.panelTitle}>revenue by client</span><button className={styles.panelAction}>Details</button></div>
          <div className={styles.panelBody}>
            <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 14 }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                {(() => { let offset = donutCirc * 0.25; return CLIENTS.map((c, i) => { const dash = donutCirc * (c.pct / 100); const gap = donutCirc - dash; const thisOffset = offset; offset -= dash; return <circle key={i} cx="40" cy="40" r={donutR} fill="none" stroke={c.color} strokeWidth={hoveredClient === i ? 10 : 7} strokeDasharray={`${dash - 1.5} ${gap + 1.5}`} strokeDashoffset={-thisOffset} opacity={hoveredClient !== null && hoveredClient !== i ? 0.2 : 0.7} style={{ transition: "all 0.2s", cursor: "pointer" }} onMouseEnter={() => setHoveredClient(i)} onMouseLeave={() => setHoveredClient(null)} />; }); })()}
                <text x="40" y="38" textAnchor="middle" fill="var(--ink-800)" fontSize="14" fontWeight="600" fontFamily="'JetBrains Mono', monospace">${(totalRev / 1000).toFixed(0)}k</text>
                <text x="40" y="50" textAnchor="middle" fill="var(--ink-300)" fontSize="8" fontFamily="'JetBrains Mono', monospace">TOTAL</text>
              </svg>
              <div style={{ flex: 1 }}>
                <div className={styles.clientRows}>
                  {CLIENTS.map((c, i) => {
                    const sparkMax = Math.max(...c.trend);
                    return (
                      <div key={i} className={`${styles.clientRow} ${hoveredClient === i ? styles.clientRowOn : ""}`} onMouseEnter={() => setHoveredClient(i)} onMouseLeave={() => setHoveredClient(null)}>
                        <span className={styles.clientDot} style={{ background: c.color }} />
                        <span className={styles.clientName}>{c.name}</span>
                        <svg className={styles.clientSpark} viewBox="0 0 60 20" preserveAspectRatio="none">
                          <polyline points={c.trend.map((v, vi) => `${(vi / (c.trend.length - 1)) * 60},${20 - (v / sparkMax) * 16 - 2}`).join(" ")} fill="none" stroke={c.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                        </svg>
                        <span className={styles.clientVal}>${(c.value / 1000).toFixed(1)}k</span>
                        <span className={styles.clientPct}>{c.pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Services + Invoices */}
        <div className={styles.panel}>
          <div className={styles.panelHead}><span className={styles.panelTitle}>revenue by service</span><button className={styles.panelAction}>Services</button></div>
          <div className={styles.panelBody}>
            <div className={styles.svcRows}>
              {SERVICES.map((s, i) => (
                <div key={i} className={styles.svcRow}>
                  <span className={styles.svcDot} style={{ background: s.color }} />
                  <span className={styles.svcName}>{s.name}</span>
                  <div className={styles.svcBarWrap}><div className={styles.svcBarFill} style={{ width: `${(s.earned / maxServiceEarned) * 100}%`, background: s.color, opacity: 0.4 }} /></div>
                  <span className={styles.svcVal}>${(s.earned / 1000).toFixed(1)}k</span>
                  <span className={styles.svcRate}>${s.rate}/hr</span>
                </div>
              ))}
            </div>
            <div className={styles.invSection}>
              <div className={styles.invLabel}>invoice aging</div>
              <div className={styles.invHeader}><span className={`${styles.invCell} ${styles.invId}`}>Invoice</span><span className={`${styles.invCell} ${styles.invClientCol}`}>Client</span><span className={`${styles.invCell} ${styles.invAmountCol}`}>Amount</span><span className={`${styles.invCell} ${styles.invStatusCol}`}>Status</span></div>
              {INVOICES.map(inv => (
                <div key={inv.id} className={styles.invRow}>
                  <span className={`${styles.invCell} ${styles.invId}`}>{inv.id}</span>
                  <span className={`${styles.invCell} ${styles.invClientCol}`}>{inv.client}</span>
                  <span className={`${styles.invCell} ${styles.invAmountCol}`}>${inv.amount.toLocaleString()}</span>
                  <span className={`${styles.invCell} ${styles.invStatusCol}`}><span className={`${styles.invStatusBadge} ${styles[`inv_${inv.status}`]}`}>{inv.status === "paid" ? "Paid" : inv.status === "overdue" ? `${inv.age}d overdue` : "Net 15"}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 4: Expenses + Tax + Cashflow */}
        <div className={styles.panel}>
          <div className={styles.panelHead}><span className={styles.panelTitle}>expenses & tax</span><button className={styles.panelAction}>Breakdown</button></div>
          <div className={styles.panelBody}>
            <div className={styles.expRows}>
              {EXPENSES.map((e, i) => (
                <div key={i} className={styles.expRow}>
                  <span className={styles.expName}>{e.name}</span>
                  <div className={styles.expBarWrap}><div className={styles.expBarFill} style={{ width: `${e.pct}%` }} /></div>
                  <span className={styles.expVal}>-${e.amount.toLocaleString()}</span>
                  <span className={styles.expPct}>{e.pct}%</span>
                </div>
              ))}
            </div>

            <div className={styles.taxSection}>
              <div className={styles.invLabel}>tax estimate</div>
              <div className={styles.taxGrid}>
                <div className={styles.taxCard}><div className={`${styles.taxVal} ${styles.ember}`}>${(taxEstimate / 1000).toFixed(1)}k</div><div className={styles.taxLab}>annual</div></div>
                <div className={styles.taxCard}><div className={`${styles.taxVal} ${styles.purple}`}>${Math.round(taxEstimate / 4).toLocaleString()}</div><div className={styles.taxLab}>quarterly</div></div>
              </div>
              <div className={styles.taxBar}><div className={styles.taxBarFill} style={{ width: "50%" }} /></div>
              <div className={styles.taxBarLabels}><span>$19,880 paid</span><span>${(taxEstimate - 19880).toLocaleString()} remaining</span></div>
            </div>

            <div className={styles.cfSection}>
              <div className={styles.invLabel}>cashflow · last 3 months</div>
              <div className={styles.cfRows}>
                {CASHFLOW.map((cf, i) => (
                  <div key={i} className={styles.cfRow}>
                    <span className={styles.cfLabel}>{cf.label}</span>
                    <div className={styles.cfBarWrap}>
                      <div className={styles.cfBarIn} style={{ width: `${cf.inPct}%` }} />
                      <div className={styles.cfBarOut} style={{ width: `${cf.outPct}%` }} />
                    </div>
                    <span className={styles.cfVal}>{cf.net}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}><span>Felmark Finance · All data from your workstation</span><span>{now.toLocaleTimeString()}</span></div>
    </div>
  );
}
