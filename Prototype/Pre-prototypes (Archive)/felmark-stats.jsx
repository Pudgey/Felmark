import { useState, useEffect } from "react";

/* ═══════════════════════════════════════
   FELMARK STATS — 5 layouts that tell stories
   Each fits inside a 260px sidebar
   ═══════════════════════════════════════ */

const REVENUE_WEEKS = [
  { week: "W1", earned: 1200, pending: 800 },
  { week: "W2", earned: 2400, pending: 1200 },
  { week: "W3", earned: 1800, pending: 2400 },
  { week: "W4", earned: 3200, pending: 1600 },
  { week: "W5", earned: 2800, pending: 800 },
  { week: "W6", earned: 4200, pending: 2000 },
  { week: "W7", earned: 3600, pending: 1400 },
  { week: "now", earned: 2200, pending: 3800 },
];

const PROJECTS = [
  { name: "Brand Guidelines", client: "Meridian", progress: 65, status: "active", dueIn: 5, value: 2400 },
  { name: "Website Copy", client: "Meridian", progress: 40, status: "review", dueIn: 10, value: 1800 },
  { name: "Landing Page", client: "Nora Kim", progress: 25, status: "active", dueIn: 14, value: 3200 },
  { name: "Onboarding UX", client: "Bolt", progress: 70, status: "overdue", dueIn: -4, value: 4000 },
  { name: "Blog Posts", client: "Bolt", progress: 15, status: "active", dueIn: 3, value: 800 },
];

const MONTHS = [
  { month: "Oct", earned: 8200 },
  { month: "Nov", earned: 11400 },
  { month: "Dec", earned: 9800 },
  { month: "Jan", earned: 13200 },
  { month: "Feb", earned: 10600 },
  { month: "Mar", earned: 14800 },
];

/* ─────────────────────────────────────
   LAYOUT 1: REVENUE FLOW
   Stacked bar chart + cash breakdown
   ───────────────────────────────────── */
function RevenueFlow() {
  const [hovered, setHovered] = useState(null);
  const maxVal = Math.max(...REVENUE_WEEKS.map(w => w.earned + w.pending));
  const totalEarned = REVENUE_WEEKS.reduce((s, w) => s + w.earned, 0);
  const totalPending = REVENUE_WEEKS.reduce((s, w) => s + w.pending, 0);

  return (
    <div className="rf">
      {/* Header */}
      <div className="rf-head">
        <div className="rf-title-row">
          <span className="rf-amount">${(totalEarned / 1000).toFixed(1)}k</span>
          <span className="rf-trend up">+23%</span>
        </div>
        <span className="rf-label">earned this month</span>
      </div>

      {/* Chart */}
      <div className="rf-chart">
        {REVENUE_WEEKS.map((w, i) => {
          const earnedH = (w.earned / maxVal) * 100;
          const pendingH = (w.pending / maxVal) * 100;
          const isHovered = hovered === i;
          const isNow = i === REVENUE_WEEKS.length - 1;
          return (
            <div key={i} className={`rf-bar-wrap${isNow ? " now" : ""}`}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <div className="rf-bar-col">
                <div className="rf-bar pending" style={{ height: `${pendingH}%`, opacity: isHovered ? 1 : 0.5 }} />
                <div className="rf-bar earned" style={{ height: `${earnedH}%`, opacity: isHovered ? 1 : 0.8 }} />
              </div>
              {isHovered && (
                <div className="rf-tooltip">
                  <span className="rf-tt-earned">${w.earned.toLocaleString()}</span>
                  <span className="rf-tt-pending">${w.pending.toLocaleString()} pending</span>
                </div>
              )}
              <span className="rf-bar-label">{isNow ? "→" : w.week}</span>
            </div>
          );
        })}
      </div>

      {/* Breakdown */}
      <div className="rf-breakdown">
        <div className="rf-bk-item">
          <div className="rf-bk-dot earned" />
          <span className="rf-bk-label">Earned</span>
          <span className="rf-bk-val">${(totalEarned / 1000).toFixed(1)}k</span>
        </div>
        <div className="rf-bk-item">
          <div className="rf-bk-dot pending" />
          <span className="rf-bk-label">Pending</span>
          <span className="rf-bk-val">${(totalPending / 1000).toFixed(1)}k</span>
        </div>
        <div className="rf-bk-item">
          <div className="rf-bk-dot total" />
          <span className="rf-bk-label">Pipeline</span>
          <span className="rf-bk-val strong">${((totalEarned + totalPending) / 1000).toFixed(1)}k</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   LAYOUT 2: DEADLINE PRESSURE
   Visual urgency — which projects need attention NOW
   ───────────────────────────────────── */
function DeadlinePressure() {
  const sorted = [...PROJECTS].sort((a, b) => a.dueIn - b.dueIn);
  const urgent = sorted.filter(p => p.dueIn <= 3);
  const upcoming = sorted.filter(p => p.dueIn > 3 && p.dueIn <= 10);
  const comfortable = sorted.filter(p => p.dueIn > 10);

  return (
    <div className="dp">
      <div className="dp-head">
        <span className="dp-label">Deadline pressure</span>
        <span className="dp-count">{urgent.length} urgent</span>
      </div>

      {/* Pressure bar */}
      <div className="dp-pressure-bar">
        <div className="dp-pressure-fill urgent" style={{ width: `${(urgent.length / PROJECTS.length) * 100}%` }} />
        <div className="dp-pressure-fill soon" style={{ width: `${(upcoming.length / PROJECTS.length) * 100}%` }} />
        <div className="dp-pressure-fill ok" style={{ width: `${(comfortable.length / PROJECTS.length) * 100}%` }} />
      </div>

      {/* Project list */}
      <div className="dp-list">
        {sorted.map((p, i) => {
          const urgency = p.dueIn < 0 ? "overdue" : p.dueIn <= 3 ? "urgent" : p.dueIn <= 7 ? "soon" : "ok";
          const urgencyColors = { overdue: "#c24b38", urgent: "#c89360", soon: "#b07d4f", ok: "#5a9a3c" };
          const dueText = p.dueIn < 0 ? `${Math.abs(p.dueIn)}d over` : p.dueIn === 0 ? "Today" : p.dueIn === 1 ? "Tomorrow" : `${p.dueIn}d`;

          return (
            <div key={i} className={`dp-item ${urgency}`}>
              <div className="dp-item-bar" style={{ background: urgencyColors[urgency] }} />
              <div className="dp-item-info">
                <span className="dp-item-name">{p.name}</span>
                <span className="dp-item-client">{p.client}</span>
              </div>
              <div className="dp-item-right">
                <span className="dp-item-due" style={{ color: urgencyColors[urgency] }}>{dueText}</span>
                <div className="dp-item-progress">
                  <div className="dp-item-progress-fill" style={{ width: `${p.progress}%`, background: urgencyColors[urgency] }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   LAYOUT 3: EARNINGS VELOCITY
   How fast you're making money this month vs last
   ───────────────────────────────────── */
function EarningsVelocity() {
  const thisMonth = 14800;
  const lastMonth = 10600;
  const goal = 15000;
  const velocity = ((thisMonth / goal) * 100).toFixed(0);
  const daysLeft = 2;
  const dailyRate = thisMonth / 27; // 27 days into month
  const projected = dailyRate * 31;

  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference - (circumference * Math.min(thisMonth / goal, 1));

  return (
    <div className="ev">
      {/* Ring */}
      <div className="ev-ring-wrap">
        <svg className="ev-ring" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--warm-200)" strokeWidth="5" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--ember)" strokeWidth="5"
            strokeDasharray={circumference} strokeDashoffset={dashOffset}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
          {/* Last month ghost */}
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--warm-300)" strokeWidth="2"
            strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * (lastMonth / goal))}
            strokeLinecap="round" opacity="0.4"
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
        </svg>
        <div className="ev-ring-center">
          <span className="ev-ring-pct">{velocity}%</span>
          <span className="ev-ring-label">of goal</span>
        </div>
      </div>

      {/* Stats */}
      <div className="ev-stats">
        <div className="ev-stat">
          <span className="ev-stat-val">${(thisMonth / 1000).toFixed(1)}k</span>
          <span className="ev-stat-label">this month</span>
        </div>
        <div className="ev-stat-divider" />
        <div className="ev-stat">
          <span className="ev-stat-val">${(goal / 1000).toFixed(0)}k</span>
          <span className="ev-stat-label">goal</span>
        </div>
        <div className="ev-stat-divider" />
        <div className="ev-stat">
          <span className="ev-stat-val">${(projected / 1000).toFixed(1)}k</span>
          <span className="ev-stat-label">projected</span>
        </div>
      </div>

      {/* Comparison */}
      <div className="ev-compare">
        <div className="ev-compare-row">
          <span className="ev-compare-label">vs last month</span>
          <span className="ev-compare-val up">+{(((thisMonth - lastMonth) / lastMonth) * 100).toFixed(0)}%</span>
        </div>
        <div className="ev-compare-row">
          <span className="ev-compare-label">daily avg</span>
          <span className="ev-compare-val">${Math.round(dailyRate)}/day</span>
        </div>
        <div className="ev-compare-row">
          <span className="ev-compare-label">{daysLeft} days left</span>
          <span className="ev-compare-val">${((goal - thisMonth)).toLocaleString()} to go</span>
        </div>
      </div>

      {/* Month sparkline */}
      <div className="ev-months">
        {MONTHS.map((m, i) => {
          const maxE = Math.max(...MONTHS.map(x => x.earned));
          const h = (m.earned / maxE) * 100;
          const isLast = i === MONTHS.length - 1;
          return (
            <div key={i} className="ev-month-col">
              <div className="ev-month-bar-wrap">
                <div className={`ev-month-bar${isLast ? " current" : ""}`} style={{ height: `${h}%` }} />
              </div>
              <span className="ev-month-label">{m.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   LAYOUT 4: PROJECT HEALTH
   At-a-glance health of every project
   ───────────────────────────────────── */
function ProjectHealth() {
  return (
    <div className="ph">
      <div className="ph-head">
        <span className="ph-label">Project health</span>
        <span className="ph-summary">{PROJECTS.filter(p => p.status === "active").length} on track</span>
      </div>

      <div className="ph-grid">
        {PROJECTS.map((p, i) => {
          const statusColors = { active: "#5a9a3c", review: "#b07d4f", overdue: "#c24b38" };
          const color = statusColors[p.status] || "#9b988f";
          const ringCirc = 2 * Math.PI * 14;
          const ringOffset = ringCirc - (ringCirc * (p.progress / 100));

          return (
            <div key={i} className="ph-card">
              <div className="ph-ring-wrap">
                <svg width="36" height="36" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="var(--warm-200)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke={color} strokeWidth="3"
                    strokeDasharray={ringCirc} strokeDashoffset={ringOffset}
                    strokeLinecap="round"
                    style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
                </svg>
                <span className="ph-ring-pct" style={{ color }}>{p.progress}%</span>
              </div>
              <div className="ph-card-info">
                <span className="ph-card-name">{p.name}</span>
                <span className="ph-card-meta">
                  {p.client} · <span style={{ color }}>{p.dueIn < 0 ? `${Math.abs(p.dueIn)}d over` : `${p.dueIn}d`}</span>
                </span>
              </div>
              <span className="ph-card-val">${(p.value / 1000).toFixed(1)}k</span>
            </div>
          );
        })}
      </div>

      {/* Utilization bar */}
      <div className="ph-util">
        <div className="ph-util-head">
          <span className="ph-util-label">Capacity</span>
          <span className="ph-util-pct">78%</span>
        </div>
        <div className="ph-util-bar">
          <div className="ph-util-fill" style={{ width: "78%" }} />
        </div>
        <span className="ph-util-hint">~22% available for new work</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   LAYOUT 5: CASH PULSE
   Real-time money flow with animations
   ───────────────────────────────────── */
function CashPulse() {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const i = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 600); }, 3000);
    return () => clearInterval(i);
  }, []);

  const incoming = 6200;
  const outgoing = 1400;
  const net = incoming - outgoing;

  return (
    <div className="cp">
      {/* Pulse indicator */}
      <div className="cp-pulse-row">
        <div className={`cp-pulse-dot${pulse ? " active" : ""}`} />
        <span className="cp-pulse-label">Cash flow — live</span>
      </div>

      {/* Net */}
      <div className="cp-net">
        <span className="cp-net-sign">+</span>
        <span className="cp-net-amount">${(net / 1000).toFixed(1)}k</span>
        <span className="cp-net-period">this week</span>
      </div>

      {/* Flow bars */}
      <div className="cp-flows">
        <div className="cp-flow">
          <div className="cp-flow-head">
            <span className="cp-flow-icon in">↓</span>
            <span className="cp-flow-label">Incoming</span>
            <span className="cp-flow-val in">${(incoming / 1000).toFixed(1)}k</span>
          </div>
          <div className="cp-flow-bar"><div className="cp-flow-fill in" style={{ width: `${(incoming / (incoming + outgoing)) * 100}%` }} /></div>
          <div className="cp-flow-detail">
            <span>Invoice #047 — $2,400</span>
            <span>Invoice #046 — $1,800</span>
            <span>Retainer — $2,000</span>
          </div>
        </div>

        <div className="cp-flow">
          <div className="cp-flow-head">
            <span className="cp-flow-icon out">↑</span>
            <span className="cp-flow-label">Outgoing</span>
            <span className="cp-flow-val out">${(outgoing / 1000).toFixed(1)}k</span>
          </div>
          <div className="cp-flow-bar"><div className="cp-flow-fill out" style={{ width: `${(outgoing / (incoming + outgoing)) * 100}%` }} /></div>
          <div className="cp-flow-detail">
            <span>Stripe fees — $180</span>
            <span>Figma — $15</span>
            <span>Subcontractor — $1,200</span>
          </div>
        </div>
      </div>

      {/* Pending */}
      <div className="cp-pending">
        <span className="cp-pending-label">Awaiting payment</span>
        <div className="cp-pending-items">
          <div className="cp-pending-item">
            <span className="cp-pend-name">Bolt Fitness</span>
            <span className="cp-pend-val">$4,000</span>
            <span className="cp-pend-days overdue">4d overdue</span>
          </div>
          <div className="cp-pending-item">
            <span className="cp-pend-name">Nora Kim</span>
            <span className="cp-pend-val">$3,200</span>
            <span className="cp-pend-days">due Apr 12</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════
   SHOWCASE
   ═══════════════════ */
export default function StatsShowcase() {
  const [active, setActive] = useState(1);
  const layouts = [
    { id: 1, label: "Revenue Flow" },
    { id: 2, label: "Deadlines" },
    { id: 3, label: "Velocity" },
    { id: 4, label: "Health" },
    { id: 5, label: "Cash Pulse" },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --parchment: #faf9f7; --warm-50: #f7f6f3; --warm-100: #f0eee9;
          --warm-200: #e5e2db; --warm-300: #d5d1c8; --warm-400: #b8b3a8;
          --ink-900: #2c2a25; --ink-800: #3d3a33; --ink-700: #4f4c44;
          --ink-600: #65625a; --ink-500: #7d7a72; --ink-400: #9b988f; --ink-300: #b5b2a9;
          --ember: #b07d4f; --ember-light: #c89360; --ember-bg: rgba(176,125,79,0.08);
          --mono: 'JetBrains Mono', monospace;
          --green: #5a9a3c; --red: #c24b38;
        }

        .showcase {
          font-family: 'Outfit', sans-serif; font-size: 14px;
          color: var(--ink-700); background: #e8e6e1;
          min-height: 100vh; display: flex; align-items: center;
          justify-content: center; flex-direction: column; gap: 16px;
          padding: 32px;
        }

        .layout-tabs {
          display: flex; gap: 4px; background: #fff;
          border: 1px solid var(--warm-200); border-radius: 8px;
          padding: 3px; box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .layout-tab {
          padding: 6px 16px; border-radius: 5px; font-size: 12.5px;
          border: none; cursor: pointer; font-family: inherit;
          color: var(--ink-400); background: none; transition: all 0.08s;
        }
        .layout-tab:hover { background: var(--warm-100); }
        .layout-tab.on { background: var(--ink-900); color: var(--parchment); }

        /* Sidebar frame */
        .sidebar-frame {
          width: 280px; background: #f2f1ed;
          border-radius: 12px; padding: 14px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
        }

        /* ═══ LAYOUT 1: REVENUE FLOW ═══ */
        .rf-head { margin-bottom: 14px; }
        .rf-title-row { display: flex; align-items: baseline; gap: 8px; }
        .rf-amount { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; color: var(--ink-900); line-height: 1; }
        .rf-trend { font-family: var(--mono); font-size: 11px; font-weight: 500; padding: 1px 6px; border-radius: 3px; }
        .rf-trend.up { background: rgba(90,154,60,0.08); color: var(--green); }
        .rf-label { font-family: var(--mono); font-size: 10px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.06em; }

        .rf-chart {
          display: flex; gap: 3px; height: 80px; align-items: flex-end;
          margin-bottom: 14px; padding: 0 2px;
        }
        .rf-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; position: relative; cursor: pointer; }
        .rf-bar-wrap.now .rf-bar.earned { background: var(--ember); }
        .rf-bar-col { width: 100%; display: flex; flex-direction: column-reverse; gap: 1px; height: 80px; }
        .rf-bar { border-radius: 2px; transition: all 0.2s; min-height: 2px; }
        .rf-bar.earned { background: var(--green); }
        .rf-bar.pending { background: var(--warm-300); }
        .rf-bar-label { font-family: var(--mono); font-size: 8px; color: var(--ink-300); }
        .rf-tooltip {
          position: absolute; bottom: calc(100% + 4px); left: 50%; transform: translateX(-50%);
          background: var(--ink-900); color: #fff; padding: 4px 8px; border-radius: 5px;
          font-family: var(--mono); font-size: 10px; white-space: nowrap;
          display: flex; flex-direction: column; align-items: center; gap: 1px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 10;
        }
        .rf-tt-earned { color: #8fbc6b; }
        .rf-tt-pending { color: rgba(255,255,255,0.4); font-size: 9px; }

        .rf-breakdown {
          display: flex; flex-direction: column; gap: 6px;
          padding: 10px 0 0; border-top: 1px solid var(--warm-200);
        }
        .rf-bk-item { display: flex; align-items: center; gap: 8px; }
        .rf-bk-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
        .rf-bk-dot.earned { background: var(--green); }
        .rf-bk-dot.pending { background: var(--warm-300); }
        .rf-bk-dot.total { background: var(--ember); }
        .rf-bk-label { font-size: 12px; color: var(--ink-500); flex: 1; }
        .rf-bk-val { font-family: var(--mono); font-size: 12px; color: var(--ink-700); }
        .rf-bk-val.strong { color: var(--ink-900); font-weight: 600; }

        /* ═══ LAYOUT 2: DEADLINE PRESSURE ═══ */
        .dp-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .dp-label { font-family: var(--mono); font-size: 10px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.06em; }
        .dp-count { font-family: var(--mono); font-size: 10px; color: var(--red); background: rgba(194,75,56,0.06); padding: 1px 6px; border-radius: 3px; }

        .dp-pressure-bar { display: flex; height: 6px; border-radius: 3px; overflow: hidden; gap: 2px; margin-bottom: 12px; }
        .dp-pressure-fill { border-radius: 3px; transition: width 0.3s ease; }
        .dp-pressure-fill.urgent { background: var(--red); }
        .dp-pressure-fill.soon { background: var(--ember); }
        .dp-pressure-fill.ok { background: var(--green); }

        .dp-list { display: flex; flex-direction: column; gap: 2px; }
        .dp-item {
          display: flex; align-items: center; gap: 8px;
          padding: 8px; border-radius: 6px; transition: background 0.06s;
        }
        .dp-item:hover { background: rgba(0,0,0,0.02); }
        .dp-item.overdue { background: rgba(194,75,56,0.03); }
        .dp-item-bar { width: 3px; align-self: stretch; border-radius: 2px; flex-shrink: 0; }
        .dp-item-info { flex: 1; min-width: 0; }
        .dp-item-name { font-size: 13px; color: var(--ink-800); font-weight: 500; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .dp-item-client { font-size: 11px; color: var(--ink-400); }
        .dp-item-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
        .dp-item-due { font-family: var(--mono); font-size: 11px; font-weight: 500; }
        .dp-item-progress { width: 40px; height: 3px; background: var(--warm-200); border-radius: 2px; overflow: hidden; }
        .dp-item-progress-fill { height: 100%; border-radius: 2px; }

        /* ═══ LAYOUT 3: EARNINGS VELOCITY ═══ */
        .ev { text-align: center; }
        .ev-ring-wrap { position: relative; width: 120px; height: 120px; margin: 0 auto 14px; }
        .ev-ring { width: 100%; height: 100%; }
        .ev-ring-center {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .ev-ring-pct { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 700; color: var(--ink-900); line-height: 1; }
        .ev-ring-label { font-family: var(--mono); font-size: 9px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.06em; }

        .ev-stats { display: flex; justify-content: center; gap: 0; margin-bottom: 12px; }
        .ev-stat { flex: 1; text-align: center; padding: 0 4px; }
        .ev-stat-val { font-family: var(--mono); font-size: 13px; font-weight: 500; color: var(--ink-800); display: block; }
        .ev-stat-label { font-family: var(--mono); font-size: 8px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.04em; }
        .ev-stat-divider { width: 1px; background: var(--warm-200); }

        .ev-compare { display: flex; flex-direction: column; gap: 4px; padding: 10px 0; border-top: 1px solid var(--warm-200); border-bottom: 1px solid var(--warm-200); margin-bottom: 12px; }
        .ev-compare-row { display: flex; justify-content: space-between; }
        .ev-compare-label { font-size: 12px; color: var(--ink-400); }
        .ev-compare-val { font-family: var(--mono); font-size: 12px; color: var(--ink-700); }
        .ev-compare-val.up { color: var(--green); }

        .ev-months { display: flex; gap: 4px; height: 40px; align-items: flex-end; }
        .ev-month-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; }
        .ev-month-bar-wrap { width: 100%; height: 40px; display: flex; align-items: flex-end; }
        .ev-month-bar { width: 100%; background: var(--warm-300); border-radius: 2px; transition: height 0.3s ease; }
        .ev-month-bar.current { background: var(--ember); }
        .ev-month-label { font-family: var(--mono); font-size: 8px; color: var(--ink-300); }

        /* ═══ LAYOUT 4: PROJECT HEALTH ═══ */
        .ph-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .ph-label { font-family: var(--mono); font-size: 10px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.06em; }
        .ph-summary { font-family: var(--mono); font-size: 10px; color: var(--green); }

        .ph-grid { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; }
        .ph-card {
          display: flex; align-items: center; gap: 10px;
          padding: 6px 8px; border-radius: 6px;
          transition: background 0.06s;
        }
        .ph-card:hover { background: rgba(0,0,0,0.02); }
        .ph-ring-wrap { position: relative; width: 36px; height: 36px; flex-shrink: 0; }
        .ph-ring-pct {
          position: absolute; inset: 0; display: flex; align-items: center;
          justify-content: center; font-family: var(--mono); font-size: 9px; font-weight: 500;
        }
        .ph-card-info { flex: 1; min-width: 0; }
        .ph-card-name { font-size: 13px; color: var(--ink-800); font-weight: 500; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ph-card-meta { font-size: 11px; color: var(--ink-400); }
        .ph-card-val { font-family: var(--mono); font-size: 12px; color: var(--ink-500); flex-shrink: 0; }

        .ph-util { padding-top: 10px; border-top: 1px solid var(--warm-200); }
        .ph-util-head { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .ph-util-label { font-size: 12px; color: var(--ink-500); }
        .ph-util-pct { font-family: var(--mono); font-size: 12px; color: var(--ember); font-weight: 500; }
        .ph-util-bar { height: 6px; background: var(--warm-200); border-radius: 3px; overflow: hidden; }
        .ph-util-fill { height: 100%; background: var(--ember); border-radius: 3px; transition: width 0.3s ease; }
        .ph-util-hint { font-family: var(--mono); font-size: 9px; color: var(--ink-300); margin-top: 4px; display: block; }

        /* ═══ LAYOUT 5: CASH PULSE ═══ */
        .cp-pulse-row { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
        .cp-pulse-dot {
          width: 8px; height: 8px; border-radius: 50%; background: var(--green);
          transition: all 0.3s; flex-shrink: 0;
        }
        .cp-pulse-dot.active { box-shadow: 0 0 0 4px rgba(90,154,60,0.15); transform: scale(1.2); }
        .cp-pulse-label { font-family: var(--mono); font-size: 10px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.06em; }

        .cp-net { margin-bottom: 14px; }
        .cp-net-sign { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: var(--green); font-weight: 600; }
        .cp-net-amount { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; color: var(--ink-900); }
        .cp-net-period { font-family: var(--mono); font-size: 10px; color: var(--ink-400); margin-left: 6px; }

        .cp-flows { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
        .cp-flow { }
        .cp-flow-head { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
        .cp-flow-icon { font-family: var(--mono); font-size: 11px; font-weight: 600; width: 18px; height: 18px; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .cp-flow-icon.in { background: rgba(90,154,60,0.08); color: var(--green); }
        .cp-flow-icon.out { background: rgba(194,75,56,0.06); color: var(--red); }
        .cp-flow-label { font-size: 12px; color: var(--ink-500); flex: 1; }
        .cp-flow-val { font-family: var(--mono); font-size: 12px; font-weight: 500; }
        .cp-flow-val.in { color: var(--green); }
        .cp-flow-val.out { color: var(--red); }
        .cp-flow-bar { height: 4px; background: var(--warm-200); border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
        .cp-flow-fill { height: 100%; border-radius: 2px; transition: width 0.3s ease; }
        .cp-flow-fill.in { background: var(--green); }
        .cp-flow-fill.out { background: var(--red); }
        .cp-flow-detail { display: flex; flex-direction: column; gap: 1px; }
        .cp-flow-detail span { font-family: var(--mono); font-size: 10px; color: var(--ink-300); padding-left: 24px; }

        .cp-pending { padding-top: 10px; border-top: 1px solid var(--warm-200); }
        .cp-pending-label { font-family: var(--mono); font-size: 10px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; display: block; }
        .cp-pending-items { display: flex; flex-direction: column; gap: 4px; }
        .cp-pending-item { display: flex; align-items: center; gap: 6px; padding: 4px 0; }
        .cp-pend-name { font-size: 12px; color: var(--ink-600); flex: 1; }
        .cp-pend-val { font-family: var(--mono); font-size: 11px; color: var(--ink-700); font-weight: 500; }
        .cp-pend-days { font-family: var(--mono); font-size: 10px; color: var(--ink-400); }
        .cp-pend-days.overdue { color: var(--red); }
      `}</style>

      <div className="showcase">
        <div className="layout-tabs">
          {layouts.map(l => (
            <button key={l.id} className={`layout-tab${active === l.id ? " on" : ""}`}
              onClick={() => setActive(l.id)}>{l.label}</button>
          ))}
        </div>

        <div className="sidebar-frame">
          {active === 1 && <RevenueFlow />}
          {active === 2 && <DeadlinePressure />}
          {active === 3 && <EarningsVelocity />}
          {active === 4 && <ProjectHealth />}
          {active === 5 && <CashPulse />}
        </div>
      </div>
    </>
  );
}
