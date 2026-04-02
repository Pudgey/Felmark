import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════
   FELMARK DATA BLOCKS — all 16 prototyped
   Every block is inline, living, breathing
   ═══════════════════════════════════════════ */

// ── Animated number ──
function ANum({ value, prefix = "", suffix = "", duration = 900 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const from = 0;
    const frame = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [value]);
  return <>{prefix}{display.toLocaleString()}{suffix}</>;
}

// ═══════════════════
// 1. {revenue}
// ═══════════════════
function RevenueBlock({ invoiced = 2400, total = 4800 }) {
  const pct = Math.round((invoiced / total) * 100);
  return (
    <span className="db db-revenue">
      <span className="db-icon" style={{ color: "#5a9a3c" }}>$</span>
      <span className="db-val green"><ANum value={invoiced} prefix="$" /></span>
      <span className="db-sep">/</span>
      <span className="db-dim">${total.toLocaleString()}</span>
      <span className="db-mini-bar"><span className="db-mini-fill" style={{ width: `${pct}%`, background: "#5a9a3c" }} /></span>
      <span className="db-pct">{pct}%</span>
      <span className="db-tag">invoiced</span>
    </span>
  );
}

// ═══════════════════
// 2. {deadline}
// ═══════════════════
function DeadlineBlock({ days = 5, hours = 14, date = "Apr 3" }) {
  const [h, setH] = useState(hours);
  const [m, setM] = useState(42);
  const [s, setS] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setS(prev => {
        if (prev <= 0) { setM(pm => { if (pm <= 0) { setH(ph => Math.max(0, ph - 1)); return 59; } return pm - 1; }); return 59; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(i);
  }, []);

  const overdue = days < 0;
  const urgent = days <= 3 && !overdue;
  const color = overdue ? "#c24b38" : urgent ? "#c89360" : "#b07d4f";

  return (
    <span className="db db-deadline" style={{ borderColor: color + "20", background: color + "04" }}>
      <span className="db-icon" style={{ color }}>⏱</span>
      {overdue ? (
        <span className="db-val" style={{ color }}>{Math.abs(days)}d overdue</span>
      ) : (
        <span className="db-val" style={{ color }}>{days}d {h}h {String(m).padStart(2, "0")}m <span className="db-seconds">{String(s).padStart(2, "0")}s</span></span>
      )}
      <span className="db-dim">{date}</span>
      {urgent && <span className="db-pulse-dot" style={{ background: color }} />}
    </span>
  );
}

// ═══════════════════
// 3. {status}
// ═══════════════════
function StatusBlock({ status = "active" }) {
  const cfg = {
    active: { color: "#5a9a3c", icon: "●", label: "Active" },
    review: { color: "#5b7fa4", icon: "◎", label: "In Review" },
    "in-progress": { color: "#b07d4f", icon: "◐", label: "In Progress" },
    overdue: { color: "#c24b38", icon: "!", label: "Overdue" },
    completed: { color: "#7c8594", icon: "✓", label: "Completed" },
    paused: { color: "#9b988f", icon: "❚❚", label: "Paused" },
    draft: { color: "#b8b3a8", icon: "○", label: "Draft" },
    sent: { color: "#5a9a3c", icon: "↗", label: "Sent" },
  }[status] || { color: "#9b988f", icon: "?", label: status };

  return (
    <span className="db db-status" style={{ borderColor: cfg.color + "15", background: cfg.color + "06" }}>
      <span style={{ color: cfg.color, fontSize: 11 }}>{cfg.icon}</span>
      <span style={{ color: cfg.color, fontWeight: 500, fontSize: 12 }}>{cfg.label}</span>
    </span>
  );
}

// ═══════════════════
// 4. {progress}
// ═══════════════════
function ProgressBlock({ value = 65 }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const frame = () => {
      const p = Math.min((Date.now() - start) / 1000, 1);
      setCurrent(Math.round(p * value));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [value]);

  const color = value >= 80 ? "#5a9a3c" : value >= 50 ? "#b07d4f" : value >= 25 ? "#c89360" : "#c24b38";
  const circ = 2 * Math.PI * 8;

  return (
    <span className="db db-progress">
      <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
        <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="2.5" />
        <circle cx="10" cy="10" r="8" fill="none" stroke={color} strokeWidth="2.5"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - current / 100)}
          strokeLinecap="round" style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 0.3s" }} />
      </svg>
      <span className="db-val" style={{ color }}>{current}%</span>
    </span>
  );
}

// ═══════════════════
// 5. {timer}
// ═══════════════════
function TimerBlock({ hours = 32, rate = 95 }) {
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(0);
  const [totalH, setTotalH] = useState(hours);

  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => {
      setSecs(s => { if (s >= 59) { setTotalH(h => h + 1); return 0; } return s + 1; });
    }, 1000);
    return () => clearInterval(i);
  }, [running]);

  const cost = totalH * rate;

  return (
    <span className="db db-timer">
      <span className="db-icon" style={{ color: running ? "#5a9a3c" : "var(--ink-400)" }}>⏲</span>
      <span className="db-val">{totalH}h {String(secs).padStart(2, "0")}s</span>
      <span className="db-dim">${cost.toLocaleString()} at ${rate}/hr</span>
      <button className={`db-timer-btn ${running ? "on" : ""}`}
        onClick={e => { e.preventDefault(); e.stopPropagation(); setRunning(!running); }}>
        {running ? "❚❚" : "▶"}
      </button>
    </span>
  );
}

// ═══════════════════
// 6. {client.last-message}
// ═══════════════════
function ClientMessageBlock({ client = "Sarah Chen", message = "I'll review the proposal by end of day", time = "2h ago", avatar = "S", color = "#8a7e63" }) {
  return (
    <span className="db db-message">
      <span className="db-msg-av" style={{ background: color }}>{avatar}</span>
      <span className="db-msg-body">
        <span className="db-msg-who">{client}</span>
        <span className="db-msg-text">"{message}"</span>
      </span>
      <span className="db-msg-time">{time}</span>
    </span>
  );
}

// ═══════════════════
// 7. {client.next-meeting}
// ═══════════════════
function NextMeetingBlock({ title = "Nora kickoff call", time = "2:00 PM", day = "Today", hoursUntil = 2.5 }) {
  const color = hoursUntil <= 1 ? "#c24b38" : hoursUntil <= 4 ? "#b07d4f" : "var(--ink-500)";
  return (
    <span className="db db-meeting" style={{ borderColor: color + "15", background: color + "04" }}>
      <span className="db-icon" style={{ color }}>◎</span>
      <span className="db-val" style={{ color }}>{day} {time}</span>
      <span className="db-dim">{title}</span>
      <span className="db-tag" style={{ color }}>{hoursUntil}h</span>
    </span>
  );
}

// ═══════════════════
// 8. {client.lifetime-value}
// ═══════════════════
function LifetimeValueBlock({ value = 12400, projects = 6, since = "Oct 2025" }) {
  return (
    <span className="db db-ltv">
      <span className="db-icon" style={{ color: "#5a9a3c" }}>⬡</span>
      <span className="db-val green"><ANum value={value} prefix="$" /></span>
      <span className="db-dim">{projects} projects · since {since}</span>
    </span>
  );
}

// ═══════════════════
// 9. {client.response-time}
// ═══════════════════
function ResponseTimeBlock({ avgDays = 1.2, trend = "faster" }) {
  const color = avgDays <= 1 ? "#5a9a3c" : avgDays <= 3 ? "#b07d4f" : "#c24b38";
  const label = avgDays <= 1 ? "Fast" : avgDays <= 3 ? "Normal" : "Slow";
  return (
    <span className="db db-response">
      <span className="db-icon" style={{ color }}>↻</span>
      <span className="db-val" style={{ color }}>{avgDays}d avg</span>
      <span className="db-tag" style={{ color, background: color + "08", borderColor: color + "15" }}>{label}</span>
      {trend === "faster" && <span className="db-trend-arrow" style={{ color: "#5a9a3c" }}>↓</span>}
      {trend === "slower" && <span className="db-trend-arrow" style={{ color: "#c24b38" }}>↑</span>}
    </span>
  );
}

// ═══════════════════
// 10. {project.hours}
// ═══════════════════
function ProjectHoursBlock({ hours = 32, budget = 48 }) {
  const pct = Math.round((hours / budget) * 100);
  const color = pct >= 90 ? "#c24b38" : pct >= 70 ? "#c89360" : "#5a9a3c";
  return (
    <span className="db db-hours">
      <span className="db-icon" style={{ color: "var(--ink-400)" }}>◷</span>
      <span className="db-val">{hours}h</span>
      <span className="db-sep">/</span>
      <span className="db-dim">{budget}h budget</span>
      <span className="db-mini-bar"><span className="db-mini-fill" style={{ width: `${Math.min(pct, 100)}%`, background: color }} /></span>
      <span className="db-pct" style={{ color }}>{pct}%</span>
    </span>
  );
}

// ═══════════════════
// 11. {project.effective-rate}
// ═══════════════════
function EffectiveRateBlock({ rate = 75, target = 95 }) {
  const diff = rate - target;
  const color = diff >= 0 ? "#5a9a3c" : diff >= -15 ? "#c89360" : "#c24b38";
  const label = diff >= 0 ? "Above target" : "Below target";
  return (
    <span className="db db-rate">
      <span className="db-icon" style={{ color }}>$/h</span>
      <span className="db-val" style={{ color }}>${rate}/hr</span>
      <span className="db-dim">target ${target}/hr</span>
      <span className="db-tag" style={{ color, background: color + "08", borderColor: color + "15" }}>
        {diff >= 0 ? "+" : ""}{diff}
      </span>
    </span>
  );
}

// ═══════════════════
// 12. {project.budget-burn}
// ═══════════════════
function BudgetBurnBlock({ spent = 1680, total = 2400 }) {
  const remaining = total - spent;
  const pct = Math.round((spent / total) * 100);
  const color = pct >= 90 ? "#c24b38" : pct >= 70 ? "#c89360" : "#5a9a3c";

  return (
    <span className="db db-burn">
      <span className="db-icon" style={{ color }}>🔥</span>
      <span className="db-val" style={{ color }}><ANum value={spent} prefix="$" /></span>
      <span className="db-sep">spent ·</span>
      <span className="db-val">${remaining.toLocaleString()}</span>
      <span className="db-dim">remaining</span>
      <span className="db-mini-bar wide"><span className="db-mini-fill" style={{ width: `${pct}%`, background: color }} /></span>
    </span>
  );
}

// ═══════════════════
// 13. {invoice.status}
// ═══════════════════
function InvoiceStatusBlock({ number = "047", amount = 2400, status = "viewed", views = 2, daysSince = 1 }) {
  const cfg = {
    draft: { color: "#9b988f", label: "Draft", icon: "○" },
    sent: { color: "#b07d4f", label: "Sent", icon: "↗" },
    viewed: { color: "#5b7fa4", label: "Viewed", icon: "◎" },
    paid: { color: "#5a9a3c", label: "Paid", icon: "✓" },
    overdue: { color: "#c24b38", label: "Overdue", icon: "!" },
  }[status];

  return (
    <span className="db db-invoice" style={{ borderColor: cfg.color + "15", background: cfg.color + "04" }}>
      <span className="db-icon" style={{ color: cfg.color }}>{cfg.icon}</span>
      <span className="db-dim">#{number}</span>
      <span className="db-val" style={{ color: cfg.color }}>${amount.toLocaleString()}</span>
      <span className="db-tag" style={{ color: cfg.color, background: cfg.color + "08", borderColor: cfg.color + "15" }}>{cfg.label}</span>
      {views > 0 && status !== "draft" && <span className="db-dim">{views}× viewed</span>}
      {status === "overdue" && <span className="db-dim" style={{ color: "#c24b38" }}>{daysSince}d late</span>}
    </span>
  );
}

// ═══════════════════
// 14. {scope.progress}
// ═══════════════════
function ScopeProgressBlock({ completed = 2, total = 5 }) {
  const pct = Math.round((completed / total) * 100);
  return (
    <span className="db db-scope">
      <span className="db-icon" style={{ color: "#5a9a3c" }}>☰</span>
      <span className="db-val">{completed}/{total}</span>
      <span className="db-dim">deliverables</span>
      <span className="db-scope-dots">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className="db-scope-dot" style={{ background: i < completed ? "#5a9a3c" : "var(--warm-200)" }} />
        ))}
      </span>
      <span className="db-pct">{pct}%</span>
    </span>
  );
}

// ═══════════════════
// 15. {contract.expiry}
// ═══════════════════
function ContractExpiryBlock({ daysLeft = 42, date = "May 10", type = "Retainer" }) {
  const color = daysLeft <= 7 ? "#c24b38" : daysLeft <= 30 ? "#c89360" : "var(--ink-500)";
  return (
    <span className="db db-contract" style={{ borderColor: color + "15", background: color + "04" }}>
      <span className="db-icon" style={{ color }}>§</span>
      <span className="db-val" style={{ color }}>{daysLeft}d</span>
      <span className="db-dim">{type} · renews {date}</span>
      {daysLeft <= 30 && <span className="db-tag" style={{ color, background: color + "08", borderColor: color + "15" }}>Renew soon</span>}
    </span>
  );
}

// ═══════════════════
// 16. {date}
// ═══════════════════
function DateBlock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i); }, []);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <span className="db db-date">
      <span className="db-icon" style={{ color: "var(--ink-400)" }}>◇</span>
      <span className="db-val">{days[now.getDay()]}, {months[now.getMonth()]} {now.getDate()}, {now.getFullYear()}</span>
      <span className="db-time-live">{String(now.getHours()).padStart(2, "0")}:{String(now.getMinutes()).padStart(2, "0")}:{String(now.getSeconds()).padStart(2, "0")}</span>
    </span>
  );
}


/* ═══════════════════════════
   DOCUMENT SHOWCASE
   ═══════════════════════════ */
export default function DataBlocksShowcase() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --parchment: #faf9f7; --warm-50: #f7f6f3; --warm-100: #f0eee9;
          --warm-200: #e5e2db; --warm-300: #d5d1c8; --warm-400: #b8b3a8;
          --ink-900: #2c2a25; --ink-800: #3d3a33; --ink-700: #4f4c44;
          --ink-600: #65625a; --ink-500: #7d7a72; --ink-400: #9b988f; --ink-300: #b5b2a9;
          --ember: #b07d4f; --ember-light: #c89360; --ember-bg: rgba(176,125,79,0.08);
          --mono: 'JetBrains Mono', monospace;
        }

        .page { font-family: 'Outfit', sans-serif; font-size: 15px; color: var(--ink-700); background: var(--parchment); min-height: 100vh; }
        .canvas { max-width: 740px; margin: 0 auto; padding: 48px 40px 120px; }

        .doc-h1 { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 600; color: var(--ink-900); margin-bottom: 6px; }
        .doc-meta { font-family: var(--mono); font-size: 11px; color: var(--ink-400); margin-bottom: 28px; display: flex; gap: 12px; align-items: center; padding-bottom: 20px; border-bottom: 1px solid var(--warm-200); }
        .doc-h2 { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: var(--ink-900); margin: 32px 0 12px; display: flex; align-items: center; gap: 8px; }
        .doc-h2-count { font-family: var(--mono); font-size: 10px; color: var(--ink-300); background: var(--warm-100); padding: 1px 7px; border-radius: 8px; font-weight: 400; }
        .doc-p { font-size: 15px; color: var(--ink-600); line-height: 1.8; margin-bottom: 12px; }
        .doc-divider { height: 1px; background: var(--warm-200); margin: 20px 0; }
        .doc-note { font-size: 13px; color: var(--ink-400); font-style: italic; margin: 16px 0; padding: 10px 16px; border-left: 2px solid var(--warm-300); line-height: 1.6; }
        .doc-label { font-family: var(--mono); font-size: 9px; color: var(--ink-300); letter-spacing: 0.06em; margin-bottom: 8px; display: block; }

        /* Block row — show blocks in context */
        .block-row { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0 16px; }
        .block-stack { display: flex; flex-direction: column; gap: 6px; margin: 10px 0 16px; }

        /* Inline context */
        .inline-demo { margin: 8px 0; line-height: 2.4; font-size: 15px; color: var(--ink-600); }

        /* ═══ DATA BLOCK BASE ═══ */
        .db {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 3px 10px; border-radius: 6px;
          border: 1px solid var(--warm-200);
          background: #fff;
          font-family: var(--mono); font-size: 12px;
          vertical-align: middle;
          transition: all 0.12s;
          white-space: nowrap;
          cursor: default;
        }
        .db:hover { border-color: var(--warm-300); box-shadow: 0 2px 8px rgba(0,0,0,0.03); }

        .db-icon { font-size: 12px; flex-shrink: 0; }
        .db-val { font-weight: 600; color: var(--ink-800); }
        .db-val.green { color: #5a9a3c; }
        .db-sep { color: var(--ink-300); font-weight: 400; }
        .db-dim { color: var(--ink-400); font-weight: 400; font-size: 11px; }
        .db-pct { color: var(--ink-400); font-size: 10px; }
        .db-tag {
          font-size: 9px; padding: 0 5px; border-radius: 2px;
          font-weight: 500; letter-spacing: 0.03em;
          color: var(--ink-300); background: var(--warm-100);
          border: 1px solid var(--warm-200);
        }

        .db-mini-bar { width: 40px; height: 3px; background: var(--warm-200); border-radius: 2px; overflow: hidden; flex-shrink: 0; }
        .db-mini-bar.wide { width: 56px; }
        .db-mini-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }

        /* Deadline */
        .db-seconds { font-size: 10px; opacity: 0.5; font-variant-numeric: tabular-nums; }
        .db-pulse-dot { width: 5px; height: 5px; border-radius: 50%; animation: dbPulse 2s ease infinite; flex-shrink: 0; }
        @keyframes dbPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

        /* Status */
        .db-status { gap: 4px; padding: 2px 8px; }

        /* Progress */
        .db-progress { gap: 5px; }

        /* Timer */
        .db-timer-btn {
          width: 20px; height: 20px; border-radius: 4px;
          border: 1px solid var(--warm-200); background: #fff;
          cursor: pointer; font-size: 8px; color: var(--ink-400);
          display: inline-flex; align-items: center; justify-content: center;
          transition: all 0.08s; flex-shrink: 0;
        }
        .db-timer-btn:hover { background: var(--warm-100); }
        .db-timer-btn.on { background: #5a9a3c; color: #fff; border-color: #5a9a3c; }

        /* Message */
        .db-message { gap: 8px; max-width: 100%; }
        .db-msg-av {
          width: 20px; height: 20px; border-radius: 4px;
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .db-msg-body { display: inline-flex; flex-direction: column; min-width: 0; }
        .db-msg-who { font-size: 10px; font-weight: 500; color: var(--ink-600); }
        .db-msg-text { font-size: 11px; color: var(--ink-400); font-style: italic; font-family: 'Outfit', sans-serif; overflow: hidden; text-overflow: ellipsis; max-width: 300px; }
        .db-msg-time { font-size: 9px; color: var(--ink-300); flex-shrink: 0; }

        /* Scope dots */
        .db-scope-dots { display: inline-flex; gap: 3px; align-items: center; }
        .db-scope-dot { width: 6px; height: 6px; border-radius: 50%; transition: background 0.2s; }

        /* Live time */
        .db-time-live { font-variant-numeric: tabular-nums; color: var(--ink-400); font-size: 11px; }

        /* Trend arrow */
        .db-trend-arrow { font-size: 13px; font-weight: 600; flex-shrink: 0; }

        /* Rate icon override */
        .db-rate .db-icon { font-size: 9px; font-weight: 700; font-family: var(--mono); }

        /* ── Category badge ── */
        .cat-badge {
          font-family: var(--mono); font-size: 9px; font-weight: 500;
          color: var(--ember); letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 10px; display: flex; align-items: center; gap: 8px;
        }
        .cat-badge::after { content: ''; flex: 1; height: 1px; background: var(--warm-200); }
      `}</style>

      <div className="page">
        <div className="canvas">
          <h1 className="doc-h1">Data Blocks</h1>
          <div className="doc-meta">
            <span>Felmark Block Library</span>
            <span>·</span>
            <span>16 live data blocks</span>
            <span>·</span>
            <span>Type {"{"} to insert</span>
          </div>

          <p className="doc-p">
            Every data block pulls live information from your Felmark workspace. They update in real-time — revenue counts up, deadlines count down, timers tick, invoice views increment. Insert them anywhere in any document.
          </p>

          {/* ── PROJECT & STATUS ── */}
          <div className="cat-badge">project & status</div>

          <div className="inline-demo">
            Project is currently <StatusBlock status="active" /> with <ProgressBlock value={65} /> completion and a <DeadlineBlock days={5} hours={14} date="Apr 3" /> deadline.
          </div>

          <div className="inline-demo">
            Scope: <ScopeProgressBlock completed={2} total={5} /> — deliverables are being reviewed. Document created <DateBlock />.
          </div>

          <div className="doc-divider" />

          {/* ── MONEY ── */}
          <div className="cat-badge">money & billing</div>

          <div className="inline-demo">
            Invoiced so far: <RevenueBlock invoiced={2400} total={4800} />. Budget burn: <BudgetBurnBlock spent={1680} total={2400} />.
          </div>

          <div className="inline-demo">
            Current effective rate: <EffectiveRateBlock rate={75} target={95} />. Time tracked: <ProjectHoursBlock hours={32} budget={48} />.
          </div>

          <div className="inline-demo">
            Active timer: <TimerBlock hours={32} rate={95} /> — click play to start tracking.
          </div>

          <div className="block-row">
            <InvoiceStatusBlock number="047" amount={2400} status="viewed" views={2} />
            <InvoiceStatusBlock number="044" amount={4000} status="overdue" views={1} daysSince={4} />
            <InvoiceStatusBlock number="046" amount={1800} status="paid" views={3} />
          </div>

          <div className="doc-divider" />

          {/* ── CLIENT ── */}
          <div className="cat-badge">client intelligence</div>

          <div className="inline-demo">
            Meridian Studio: <LifetimeValueBlock value={12400} projects={6} since="Oct 2025" />. Response time: <ResponseTimeBlock avgDays={1.2} trend="faster" />.
          </div>

          <div className="inline-demo">
            Latest from client: <ClientMessageBlock client="Sarah Chen" message="I'll review the proposal by end of day — looks great so far" time="2h ago" avatar="S" color="#8a7e63" />
          </div>

          <div className="inline-demo">
            Next scheduled call: <NextMeetingBlock title="Nora kickoff — Course Landing Page" time="2:00 PM" day="Today" hoursUntil={2.5} />
          </div>

          <div className="inline-demo">
            Contract status: <ContractExpiryBlock daysLeft={42} date="May 10" type="Retainer" />
          </div>

          <div className="doc-divider" />

          {/* ── STATUS VARIANTS ── */}
          <div className="cat-badge">status variants</div>
          <div className="block-row">
            <StatusBlock status="active" />
            <StatusBlock status="in-progress" />
            <StatusBlock status="review" />
            <StatusBlock status="overdue" />
            <StatusBlock status="completed" />
            <StatusBlock status="paused" />
            <StatusBlock status="draft" />
            <StatusBlock status="sent" />
          </div>

          <div className="doc-divider" />

          {/* ── INVOICE STATUS VARIANTS ── */}
          <div className="cat-badge">invoice lifecycle</div>
          <div className="block-stack">
            <InvoiceStatusBlock number="048" amount={3200} status="draft" views={0} />
            <InvoiceStatusBlock number="047" amount={2400} status="sent" views={0} />
            <InvoiceStatusBlock number="047" amount={2400} status="viewed" views={2} />
            <InvoiceStatusBlock number="046" amount={1800} status="paid" views={3} />
            <InvoiceStatusBlock number="044" amount={4000} status="overdue" views={1} daysSince={4} />
          </div>

          <div className="doc-divider" />

          <div className="doc-note">
            All 16 data blocks are inline — they sit naturally inside paragraphs, headings, callouts, tables, and any other content block. They never break the reading flow. They just make your documents smarter.
          </div>
        </div>
      </div>
    </>
  );
}
