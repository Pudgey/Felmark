import { useState } from "react";

/* ═══════════════════════════════════════════
   FELMARK — BLOCK LIBRARY v2
   Every block previews itself.
   You see what you get before you place it.
   ═══════════════════════════════════════════ */

const CATS = [
  { id: "all", label: "All" },
  { id: "money", label: "Money" },
  { id: "work", label: "Work" },
  { id: "client", label: "Client" },
  { id: "time", label: "Time" },
  { id: "comms", label: "Comms" },
  { id: "data", label: "Data" },
];

// ── Mini Preview Components ──

function PrevRevenue() {
  return (
    <div className="bp">
      <div className="bp-lb">EARNED THIS MONTH</div>
      <div className="bp-big" style={{ color: "var(--sg)" }}>$14,800</div>
      <div className="bp-trend-row"><span className="bp-trend up">+12%</span><span className="bp-dim">vs last month</span></div>
      <div className="bp-mini-chart">
        <svg width="100%" height="28" viewBox="0 0 120 28" preserveAspectRatio="none">
          <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--sg)" stopOpacity=".1"/><stop offset="100%" stopColor="var(--sg)" stopOpacity="0"/></linearGradient></defs>
          <path d="M0,24 L20,20 L40,22 L60,16 L80,12 L100,8 L120,4 L120,28 L0,28Z" fill="url(#rg)"/>
          <polyline points="0,24 20,20 40,22 60,16 80,12 100,8 120,4" fill="none" stroke="var(--sg)" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
        </svg>
      </div>
      <div className="bp-kv"><span>Outstanding</span><span style={{color:"var(--rs)"}}>$9,600</span></div>
      <div className="bp-kv"><span>Pipeline</span><span>$22,000</span></div>
    </div>
  );
}

function PrevOutstanding() {
  return (
    <div className="bp">
      <div className="bp-lb">OUTSTANDING</div>
      <div className="bp-big" style={{ color: "var(--rs)" }}>$9,600</div>
      <div className="bp-dim" style={{ marginTop: 2 }}>3 invoices unpaid</div>
      <div className="bp-inv-rows">
        {[{ c: "Bolt", a: "$4,000", s: "overdue", sc: "var(--rs)" }, { c: "Meridian", a: "$2,400", s: "sent", sc: "var(--em)" }, { c: "Nora", a: "$3,200", s: "sent", sc: "var(--em)" }].map((inv, i) => (
          <div key={i} className="bp-inv-r">
            <span className="bp-inv-c">{inv.c}</span>
            <span className="bp-inv-a">{inv.a}</span>
            <span className="bp-inv-s" style={{ color: inv.sc, background: inv.sc.replace(")", ",.05)").replace("var(", "rgba(").replace("--rs", "180,110,94").replace("--em", "168,116,68") }}>{inv.s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrevBoard() {
  const cols = [
    { l: "To Do", c: "#7d7db0", items: ["Guidelines doc", "Social kit"] },
    { l: "Active", c: "#a87444", items: ["Color palette"] },
    { l: "Review", c: "#7d7db0", items: ["Revisions"] },
    { l: "Done", c: "#5e8f5e", items: ["Discovery", "Logos"] },
  ];
  return (
    <div className="bp bp-board">
      <div className="bp-lb">ACTIVE TASKS</div>
      <div className="bp-board-cols">
        {cols.map((col, i) => (
          <div key={i} className="bp-board-col">
            <div className="bp-board-hd"><div className="bp-board-dot" style={{ background: col.c }} /><span style={{ color: col.c }}>{col.l}</span></div>
            {col.items.map((item, j) => <div key={j} className="bp-board-card">{item}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function PrevActivity() {
  const items = [
    { t: "Sarah viewed proposal", time: "2m", c: "#7d7db0" },
    { t: "Payment · $1,800", time: "3h", c: "#5e8f5e" },
    { t: "Contract signed", time: "1d", c: "#5e8f5e" },
    { t: "New lead: Luna", time: "2h", c: "#7a6a90" },
    { t: "3 comments on scope", time: "2d", c: "#a87444" },
  ];
  return (
    <div className="bp">
      <div className="bp-lb">ACTIVITY FEED</div>
      <div className="bp-act-list">
        {items.map((a, i) => (
          <div key={i} className="bp-act-row"><div className="bp-act-dot" style={{ background: a.c }} /><span className="bp-act-text">{a.t}</span><span className="bp-act-time">{a.time}</span></div>
        ))}
      </div>
    </div>
  );
}

function PrevHealth() {
  const clients = [
    { av: "M", name: "Meridian", c: "#6a7b8a", h: 92 },
    { av: "N", name: "Nora", c: "#9a8472", h: 88 },
    { av: "B", name: "Bolt", c: "#8a7e5a", h: 45 },
  ];
  return (
    <div className="bp">
      <div className="bp-lb">CLIENT HEALTH</div>
      <div className="bp-health-list">
        {clients.map((cl, i) => (
          <div key={i} className="bp-health-row">
            <div className="bp-health-av" style={{ background: cl.c }}>{cl.av}</div>
            <span className="bp-health-name">{cl.name}</span>
            <div className="bp-health-bar"><div style={{ width: `${cl.h}%`, background: cl.h > 70 ? "var(--sg)" : "var(--rs)" }} /></div>
            <span className="bp-health-val" style={{ color: cl.h > 70 ? "var(--sg)" : "var(--rs)" }}>{cl.h}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrevTimer() {
  return (
    <div className="bp bp-center">
      <div className="bp-lb">ACTIVE TIMER</div>
      <div className="bp-timer-task">Color palette & typography</div>
      <div className="bp-timer-time">1:22:00</div>
      <div className="bp-timer-btns">
        <div className="bp-timer-go">▶ Start</div>
        <div className="bp-timer-log">✓ Log</div>
      </div>
    </div>
  );
}

function PrevCalendar() {
  const days = [
    { d: "M", n: "31", dots: 3, today: true },
    { d: "T", n: "1", dots: 1 },
    { d: "W", n: "2", dots: 1 },
    { d: "T", n: "3", dots: 1 },
    { d: "F", n: "4", dots: 0 },
    { d: "S", n: "5", dots: 1 },
    { d: "S", n: "6", dots: 0 },
  ];
  return (
    <div className="bp">
      <div className="bp-lb">THIS WEEK</div>
      <div className="bp-cal-days">
        {days.map((d, i) => (
          <div key={i} className={`bp-cal-day${d.today ? " today" : ""}`}>
            <span className="bp-cal-name">{d.d}</span>
            <span className="bp-cal-num">{d.n}</span>
            {d.dots > 0 && <div className="bp-cal-dots">{Array.from({ length: Math.min(d.dots, 3) }).map((_, j) => <div key={j} className="bp-cal-dot" />)}</div>}
          </div>
        ))}
      </div>
      <div className="bp-cal-items">
        <div className="bp-cal-item"><div className="bp-cal-bar" style={{ background: "var(--em)" }} /><span>Reply to feedback</span><span className="bp-dim">9:00</span></div>
        <div className="bp-cal-item"><div className="bp-cal-bar" style={{ background: "var(--lv)" }} /><span>Call with Nora</span><span className="bp-dim">11:00</span></div>
        <div className="bp-cal-item"><div className="bp-cal-bar" style={{ background: "var(--rs)" }} /><span>Palette due</span><span className="bp-dim">2:00</span></div>
      </div>
    </div>
  );
}

function PrevChat() {
  return (
    <div className="bp">
      <div className="bp-lb">QUICK CHAT</div>
      <div className="bp-chat-head"><div className="bp-chat-av" style={{ background: "#6a7b8a" }}>S</div><span>Sarah Chen</span><div className="bp-chat-online" /></div>
      <div className="bp-chat-msgs">
        <div className="bp-chat-msg recv"><div className="bp-chat-bubble recv">Can we push the teal warmer?</div><span className="bp-dim">2m</span></div>
        <div className="bp-chat-msg sent"><div className="bp-chat-bubble sent">On it — 3 alternatives by EOD.</div><span className="bp-dim">Just now</span></div>
      </div>
      <div className="bp-chat-input"><span className="bp-dim">Message Sarah...</span><div className="bp-chat-send">↑</div></div>
    </div>
  );
}

function PrevInvoices() {
  const invs = [
    { c: "Bolt Fitness", a: "$4,000", s: "overdue", sc: "var(--rs)" },
    { c: "Meridian", a: "$2,400", s: "sent", sc: "var(--em)" },
    { c: "Meridian", a: "$1,800", s: "paid", sc: "var(--sg)" },
    { c: "Nora Kim", a: "$2,200", s: "paid", sc: "var(--sg)" },
  ];
  return (
    <div className="bp">
      <div className="bp-lb">INVOICES</div>
      {invs.map((inv, i) => (
        <div key={i} className="bp-inv-r"><span className="bp-inv-c">{inv.c}</span><span className="bp-inv-a">{inv.a}</span><span className="bp-inv-s" style={{ color: inv.sc, background: inv.sc.replace(")", ",.05)").replace("var(", "rgba(").replace("--rs", "180,110,94").replace("--em", "168,116,68").replace("--sg", "94,143,94") }}>{inv.s}</span></div>
      ))}
    </div>
  );
}

function PrevFiles() {
  const files = [
    { name: "Brand_v2.pdf", type: "PDF", c: "#b46e5e" },
    { name: "Logo_B.fig", type: "FIG", c: "#7d7db0" },
    { name: "Palette.png", type: "PNG", c: "#5e8f5e" },
    { name: "Feedback.docx", type: "DOC", c: "#7d7db0" },
  ];
  return (
    <div className="bp">
      <div className="bp-lb">FILE GALLERY</div>
      <div className="bp-files-grid">
        {files.map((f, i) => (
          <div key={i} className="bp-file-card">
            <div className="bp-file-thumb" style={{ background: f.c + "08" }}><span style={{ color: f.c, fontWeight: 600 }}>{f.type}</span></div>
            <div className="bp-file-name">{f.name}</div>
          </div>
        ))}
      </div>
      <div className="bp-file-drop">Drop files here</div>
    </div>
  );
}

function PrevPipeline() {
  const stages = [
    { l: "Lead", c: "#7d7db0", n: 2 },
    { l: "Proposal", c: "#a87444", n: 1 },
    { l: "Active", c: "#5e8f5e", n: 3 },
    { l: "Done", c: "#9b988f", n: 2 },
  ];
  return (
    <div className="bp">
      <div className="bp-lb">PIPELINE</div>
      <div className="bp-pipe-track">
        {stages.map((s, i) => (
          <div key={i} className="bp-pipe-stage"><div className="bp-pipe-bar" style={{ background: s.c }} /><span className="bp-pipe-name">{s.l}</span><span className="bp-pipe-n" style={{ color: s.c }}>{s.n}</span></div>
        ))}
      </div>
      <div className="bp-pipe-deals">
        {[{ name: "Luna · Brand", val: "$6.5k", c: "#7d7db0" }, { name: "Nora · Landing", val: "$3.2k", c: "#5e8f5e" }, { name: "Bolt · App UX", val: "$4.0k", c: "#b46e5e" }].map((d, i) => (
          <div key={i} className="bp-pipe-deal"><div className="bp-pipe-deal-dot" style={{ background: d.c }} /><span className="bp-pipe-deal-name">{d.name}</span><span className="bp-pipe-deal-val" style={{ color: d.c }}>{d.val}</span></div>
        ))}
      </div>
    </div>
  );
}

function PrevAutomations() {
  const rules = [
    { icon: "✉", c: "#5e8f5e", trigger: "Tasks done →", action: "Send update email" },
    { icon: "$", c: "#a87444", trigger: "Project 50% →", action: "Draft invoice" },
    { icon: "◎", c: "#7d7db0", trigger: "Delivered + 3d →", action: "Send reminder" },
  ];
  return (
    <div className="bp">
      <div className="bp-lb">AUTOMATIONS</div>
      {rules.map((r, i) => (
        <div key={i} className="bp-auto-row"><div className="bp-auto-ic" style={{ color: r.c, background: r.c + "08", borderColor: r.c + "12" }}>{r.icon}</div><div className="bp-auto-info"><span className="bp-auto-trigger">{r.trigger}</span><span className="bp-auto-action">{r.action}</span></div></div>
      ))}
    </div>
  );
}

function PrevWhisper() {
  return (
    <div className="bp bp-whisper-prev">
      <div className="bp-whisper-row">
        <span className="bp-whisper-badge">✦ AI</span>
        <span className="bp-whisper-dot" />
        <span className="bp-whisper-text">Sarah hasn't responded in 2 days — gentle follow-up helps</span>
        <span className="bp-whisper-btn">Nudge</span>
      </div>
    </div>
  );
}

function PrevRate() {
  return (
    <div className="bp bp-center">
      <div className="bp-lb">EFFECTIVE RATE</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginTop: 6 }}>
        <span className="bp-big" style={{ color: "var(--lv)" }}>$108</span>
        <span style={{ color: "var(--lv)", opacity: .4, fontSize: 10, fontFamily: "var(--mono)" }}>/hr</span>
      </div>
      <div className="bp-rate-bar"><div style={{ width: "72%" }} /></div>
      <div className="bp-dim">Target: $150/hr · 72%</div>
      <div className="bp-mini-chart" style={{ marginTop: 6 }}>
        <svg width="100%" height="24" viewBox="0 0 120 24" preserveAspectRatio="none">
          <polyline points="0,20 20,18 40,14 60,12 80,16 100,18 120,16" fill="none" stroke="var(--lv)" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
          <line x1="0" y1="8" x2="120" y2="8" stroke="var(--i2)" strokeWidth=".5" strokeDasharray="3 3"/>
        </svg>
      </div>
    </div>
  );
}

function PrevGoal() {
  const r = 24, c = 2 * Math.PI * r;
  return (
    <div className="bp bp-center">
      <div className="bp-lb">MONTHLY GOAL</div>
      <svg width="64" height="64" viewBox="0 0 64 64" style={{ margin: "8px 0" }}>
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--bdl)" strokeWidth="4" />
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--em)" strokeWidth="4" strokeDasharray={c} strokeDashoffset={c - (74 / 100) * c} strokeLinecap="round" transform="rotate(-90 32 32)" />
        <text x="32" y="30" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 14, fontWeight: 700, fill: "var(--em)", fontFamily: "'Fraunces', serif" }}>74%</text>
        <text x="32" y="42" textAnchor="middle" style={{ fontSize: 7, fill: "var(--i3)", fontFamily: "var(--mono)" }}>$20,000</text>
      </svg>
      <div className="bp-dim">$14,800 of $20,000</div>
    </div>
  );
}

function PrevSticky() {
  return (
    <div className="bp bp-sticky-prev">
      <div className="bp-lb">STICKY NOTE</div>
      <div className="bp-sticky-text">Sarah prefers warm tones. CEO James needs sign-off before final delivery. Budget flexible for Phase 2.</div>
    </div>
  );
}

function PrevRevenueChart() {
  const data = [
    { l: "Mer", v: 12400, c: "#6a7b8a" },
    { l: "Nora", v: 8200, c: "#9a8472" },
    { l: "Bolt", v: 6000, c: "#8a7e5a" },
  ];
  const max = Math.max(...data.map(d => d.v));
  return (
    <div className="bp">
      <div className="bp-lb">REVENUE BY CLIENT</div>
      <div className="bp-rev-chart">
        {data.map((d, i) => (
          <div key={i} className="bp-rev-row">
            <div className="bp-rev-av" style={{ background: d.c }}>{d.l[0]}</div>
            <span className="bp-rev-name">{d.l}</span>
            <div className="bp-rev-bar"><div style={{ width: `${(d.v / max) * 100}%`, background: "var(--lv)", opacity: .3 }} /></div>
            <span className="bp-rev-val">${(d.v / 1000).toFixed(1)}k</span>
          </div>
        ))}
      </div>
      <div className="bp-kv" style={{ marginTop: 6 }}><span>Total</span><span style={{ color: "var(--sg)", fontWeight: 600 }}>$26.6k</span></div>
    </div>
  );
}

// ── Block Registry ──
const BLOCKS = [
  { id: "revenue", name: "Revenue Counter", cat: "money", size: "2×2", color: "var(--sg)", desc: "Total earned, trend, and sparkline", Prev: PrevRevenue },
  { id: "outstanding", name: "Outstanding", cat: "money", size: "2×2", color: "var(--rs)", desc: "Unpaid invoices breakdown", Prev: PrevOutstanding },
  { id: "board", name: "Task Board", cat: "work", size: "4×3", color: "var(--lv)", desc: "Kanban columns by status", Prev: PrevBoard },
  { id: "activity", name: "Activity Feed", cat: "comms", size: "2×3", color: "var(--em)", desc: "Live stream of all events", Prev: PrevActivity },
  { id: "health", name: "Client Health", cat: "client", size: "2×3", color: "var(--lv)", desc: "Health scores ranked with bars", Prev: PrevHealth },
  { id: "timer", name: "Active Timer", cat: "time", size: "2×2", color: "var(--em)", desc: "Track time on any task", Prev: PrevTimer },
  { id: "calendar", name: "Calendar", cat: "time", size: "4×3", color: "var(--lv)", desc: "Week view with events", Prev: PrevCalendar },
  { id: "chat", name: "Quick Chat", cat: "comms", size: "2×3", color: "var(--lv)", desc: "Message any client inline", Prev: PrevChat },
  { id: "invoices", name: "Invoice List", cat: "money", size: "4×2", color: "var(--sg)", desc: "All invoices with status", Prev: PrevInvoices },
  { id: "files", name: "File Gallery", cat: "data", size: "2×2", color: "var(--em)", desc: "Grid of project files", Prev: PrevFiles },
  { id: "pipeline", name: "Pipeline", cat: "work", size: "4×3", color: "var(--lv)", desc: "Deals from lead to signed", Prev: PrevPipeline },
  { id: "automations", name: "Automations", cat: "work", size: "3×2", color: "var(--em)", desc: "When X happens → do Y", Prev: PrevAutomations },
  { id: "whisper", name: "AI Whisper", cat: "comms", size: "8×1", color: "var(--em)", desc: "Contextual AI nudges", Prev: PrevWhisper },
  { id: "rate", name: "Rate Tracker", cat: "money", size: "2×2", color: "var(--lv)", desc: "Effective hourly rate trend", Prev: PrevRate },
  { id: "goal", name: "Goal Ring", cat: "data", size: "2×2", color: "var(--em)", desc: "Progress toward a target", Prev: PrevGoal },
  { id: "sticky", name: "Sticky Note", cat: "data", size: "2×2", color: "var(--i4)", desc: "Freeform text note", Prev: PrevSticky },
  { id: "revchart", name: "Revenue Chart", cat: "money", size: "4×3", color: "var(--lv)", desc: "Revenue breakdown by client", Prev: PrevRevenueChart },
];

export default function BlockLibrary() {
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState(null);

  const filtered = BLOCKS.filter(b =>
    (cat === "all" || b.cat === cat) &&
    (!search || b.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#edeae5;--card:#fff;--tint:#f8f7f4;--bd:#ddd9d2;--bdl:#ebe8e2;--i9:#252320;--i8:#363330;--i7:#4a4743;--i6:#5e5b56;--i5:#7a7772;--i4:#9b988f;--i3:#b5b2a9;--i2:#d0cdc6;--em:#a87444;--embg:rgba(168,116,68,.04);--sg:#5e8f5e;--lv:#7d7db0;--lvbg:rgba(125,125,176,.03);--rs:#b46e5e;--mono:'JetBrains Mono',monospace}

.lib{font-family:'DM Sans',sans-serif;background:var(--bg);min-height:100vh;padding:40px 24px 80px}
.lib-in{max-width:1000px;margin:0 auto}

/* Header */
.lib-hd{margin-bottom:32px}
.lib-eye{font-family:var(--mono);font-size:10px;color:var(--em);text-transform:uppercase;letter-spacing:.14em;margin-bottom:6px}
.lib-t{font-family:'Fraunces',serif;font-size:36px;font-weight:600;color:var(--i9);margin-bottom:6px}
.lib-sub{font-size:15px;color:var(--i4);line-height:1.6}

/* Search + Cats */
.lib-bar{display:flex;align-items:center;gap:12px;margin-bottom:24px}
.lib-search{display:flex;align-items:center;gap:8px;padding:10px 16px;background:var(--card);border:1px solid var(--bd);border-radius:12px;width:260px;transition:all .12s}
.lib-search:focus-within{border-color:var(--lv);box-shadow:0 0 0 3px rgba(125,125,176,.04)}
.lib-search input{flex:1;border:none;outline:none;background:transparent;font-size:14px;font-family:inherit;color:var(--i7)}
.lib-search input::placeholder{color:var(--i3)}
.lib-cats{display:flex;gap:3px;flex:1}
.lib-cat{padding:8px 16px;border-radius:9px;border:1px solid var(--bd);background:var(--card);font-size:12px;font-family:inherit;color:var(--i5);cursor:pointer;font-weight:500;transition:all .1s}
.lib-cat:hover{background:var(--tint);transform:translateY(-1px)}
.lib-cat.on{background:var(--i9);color:var(--card);border-color:var(--i9)}
.lib-count{font-family:var(--mono);font-size:11px;color:var(--i3);margin-left:auto;flex-shrink:0}

/* Grid */
.lib-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}

/* Block Card */
.bcard{background:var(--card);border:1px solid var(--bd);border-radius:18px;overflow:hidden;cursor:pointer;transition:all .18s cubic-bezier(.16,1,.3,1);position:relative}
.bcard:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,.05);border-color:var(--i2)}
.bcard-line{position:absolute;bottom:0;left:0;height:3px;width:0;z-index:2;transition:width .35s cubic-bezier(.16,1,.3,1);border-radius:0 0 18px 18px}
.bcard:hover .bcard-line{width:100%}

/* Preview area */
.bcard-prev{padding:16px 16px 12px;border-bottom:1px solid var(--bdl);min-height:160px;position:relative;overflow:hidden}
.bcard-prev::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,var(--i2) .4px,transparent .4px);background-size:14px 14px;opacity:.15;pointer-events:none}

/* Info area */
.bcard-info{padding:14px 18px;display:flex;align-items:flex-start;gap:10px}
.bcard-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;border:1px solid;transition:transform .1s}
.bcard:hover .bcard-icon{transform:scale(1.06)}
.bcard-text{flex:1;min-width:0}
.bcard-name{font-size:15px;font-weight:600;color:var(--i8)}
.bcard-desc{font-size:12px;color:var(--i4);margin-top:2px;line-height:1.4}
.bcard-meta{display:flex;align-items:center;gap:6px;margin-top:6px}
.bcard-size{font-family:var(--mono);font-size:9px;color:var(--i3);background:var(--tint);padding:2px 8px;border-radius:5px;border:1px solid var(--bdl)}
.bcard-cat{font-family:var(--mono);font-size:9px;color:var(--i3);text-transform:uppercase;letter-spacing:.04em}

/* ═══ PREVIEW INNARDS ═══ */
.bp{position:relative;z-index:1;font-size:10px}
.bp-lb{font-family:var(--mono);font-size:7px;color:var(--i3);text-transform:uppercase;letter-spacing:.07em}
.bp-big{font-family:'Fraunces',serif;font-size:22px;font-weight:700;line-height:1;margin-top:4px}
.bp-dim{font-family:var(--mono);font-size:8px;color:var(--i3)}
.bp-trend-row{display:flex;align-items:center;gap:4px;margin-top:4px}
.bp-trend{font-family:var(--mono);font-size:8px;padding:1px 5px;border-radius:3px}
.bp-trend.up{color:var(--sg);background:rgba(94,143,94,.06)}
.bp-mini-chart{margin-top:6px}
.bp-kv{display:flex;justify-content:space-between;padding:2px 0;font-family:var(--mono);font-size:8px;color:var(--i4)}
.bp-center{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:120px}

/* Rate */
.bp-rate-bar{width:80%;height:3px;background:var(--bdl);border-radius:2px;overflow:hidden;margin:6px 0 4px}
.bp-rate-bar div{height:100%;background:var(--lv);border-radius:2px}

/* Board */
.bp-board-cols{display:flex;gap:3px;margin-top:6px}
.bp-board-col{flex:1;min-width:0}
.bp-board-hd{display:flex;align-items:center;gap:2px;font-family:var(--mono);font-size:6px;font-weight:500;text-transform:uppercase;margin-bottom:3px}
.bp-board-dot{width:3px;height:3px;border-radius:1px}
.bp-board-card{background:var(--tint);border:1px solid var(--bdl);border-radius:3px;padding:3px 4px;margin-bottom:2px;font-size:8px;color:var(--i6)}

/* Activity */
.bp-act-list{margin-top:6px}
.bp-act-row{display:flex;align-items:center;gap:4px;padding:2px 0}
.bp-act-dot{width:3px;height:3px;border-radius:50%;flex-shrink:0}
.bp-act-text{font-size:9px;color:var(--i5);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bp-act-time{font-family:var(--mono);font-size:7px;color:var(--i3);flex-shrink:0}

/* Health */
.bp-health-list{margin-top:6px}
.bp-health-row{display:flex;align-items:center;gap:5px;padding:3px 0}
.bp-health-av{width:16px;height:16px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:600;color:#fff;flex-shrink:0}
.bp-health-name{font-size:9px;color:var(--i5);width:40px;flex-shrink:0}
.bp-health-bar{flex:1;height:3px;background:var(--bdl);border-radius:2px;overflow:hidden}
.bp-health-bar div{height:100%;border-radius:2px}
.bp-health-val{font-family:var(--mono);font-size:8px;font-weight:500;width:16px;text-align:right;flex-shrink:0}

/* Timer */
.bp-timer-task{font-size:9px;color:var(--i4);margin-top:6px}
.bp-timer-time{font-family:var(--mono);font-size:24px;font-weight:600;color:var(--i9);margin:4px 0 6px}
.bp-timer-btns{display:flex;gap:3px}
.bp-timer-go{padding:3px 10px;border-radius:4px;background:var(--i9);color:#fff;font-size:8px;font-family:inherit;font-weight:500}
.bp-timer-log{padding:3px 10px;border-radius:4px;border:1px solid rgba(94,143,94,.12);color:var(--sg);font-size:8px;font-family:inherit}

/* Calendar */
.bp-cal-days{display:flex;gap:2px;margin-top:6px}
.bp-cal-day{flex:1;text-align:center;padding:3px 1px;border-radius:4px}
.bp-cal-day.today{background:var(--embg);border:1px solid rgba(168,116,68,.06)}
.bp-cal-day:not(.today){border:1px solid transparent}
.bp-cal-name{font-family:var(--mono);font-size:6px;color:var(--i4);display:block}
.bp-cal-num{font-size:10px;font-weight:500;color:var(--i7);display:block}
.bp-cal-dots{display:flex;gap:1px;justify-content:center;margin-top:1px}
.bp-cal-dot{width:2px;height:2px;border-radius:50%;background:var(--em)}
.bp-cal-items{margin-top:6px}
.bp-cal-item{display:flex;align-items:center;gap:4px;padding:2px 0;font-size:8px;color:var(--i5)}
.bp-cal-bar{width:2px;height:12px;border-radius:1px;flex-shrink:0}

/* Chat */
.bp-chat-head{display:flex;align-items:center;gap:5px;margin-top:6px;padding-bottom:4px;border-bottom:1px solid var(--bdl);font-size:10px;color:var(--i6);font-weight:500}
.bp-chat-av{width:16px;height:16px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:600;color:#fff;flex-shrink:0}
.bp-chat-online{width:5px;height:5px;border-radius:50%;background:var(--sg);margin-left:auto}
.bp-chat-msgs{padding:4px 0}
.bp-chat-msg{display:flex;align-items:flex-end;gap:4px;margin-bottom:3px}
.bp-chat-msg.sent{justify-content:flex-end}
.bp-chat-bubble{max-width:85%;padding:4px 7px;border-radius:6px;font-size:8px;line-height:1.4}
.bp-chat-bubble.recv{background:var(--tint);border:1px solid var(--bdl);color:var(--i6);border-bottom-left-radius:2px}
.bp-chat-bubble.sent{background:var(--i9);color:#fff;border-bottom-right-radius:2px}
.bp-chat-input{display:flex;align-items:center;justify-content:space-between;padding:4px 6px;border:1px solid var(--bdl);border-radius:6px;margin-top:4px;font-size:8px}
.bp-chat-send{width:16px;height:16px;border-radius:4px;background:var(--i9);color:#fff;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:600}

/* Invoices */
.bp-inv-rows{margin-top:6px}
.bp-inv-r{display:flex;align-items:center;gap:4px;padding:3px 0;font-size:9px;border-bottom:1px solid var(--bdl)}
.bp-inv-r:last-child{border-bottom:none}
.bp-inv-c{flex:1;color:var(--i5)}
.bp-inv-a{font-family:var(--mono);font-size:9px;font-weight:500;color:var(--i7);flex-shrink:0}
.bp-inv-s{font-family:var(--mono);font-size:7px;font-weight:500;padding:1px 5px;border-radius:3px;flex-shrink:0}

/* Files */
.bp-files-grid{display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-top:6px}
.bp-file-card{border:1px solid var(--bdl);border-radius:5px;overflow:hidden}
.bp-file-thumb{height:28px;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:8px}
.bp-file-name{font-size:7px;color:var(--i5);padding:2px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bp-file-drop{margin-top:4px;padding:4px;border:1px dashed var(--bd);border-radius:4px;text-align:center;font-size:7px;color:var(--i3)}

/* Pipeline */
.bp-pipe-track{display:flex;gap:2px;margin-top:6px}
.bp-pipe-stage{flex:1;text-align:center;padding:4px 2px;background:var(--tint);border:1px solid var(--bdl);border-radius:4px}
.bp-pipe-bar{height:2px;border-radius:1px;margin-bottom:2px}
.bp-pipe-name{font-family:var(--mono);font-size:6px;color:var(--i4);display:block}
.bp-pipe-n{font-family:'Fraunces',serif;font-size:12px;font-weight:600;display:block}
.bp-pipe-deals{margin-top:5px}
.bp-pipe-deal{display:flex;align-items:center;gap:4px;padding:2px 0;font-size:8px}
.bp-pipe-deal-dot{width:4px;height:4px;border-radius:1px;flex-shrink:0}
.bp-pipe-deal-name{flex:1;color:var(--i5)}
.bp-pipe-deal-val{font-family:var(--mono);font-size:8px;font-weight:500;flex-shrink:0}

/* Automations */
.bp-auto-row{display:flex;align-items:flex-start;gap:6px;padding:4px 0;border-bottom:1px solid var(--bdl)}
.bp-auto-row:last-child{border-bottom:none}
.bp-auto-ic{width:20px;height:20px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:600;flex-shrink:0;border:1px solid;margin-top:1px}
.bp-auto-info{flex:1}
.bp-auto-trigger{font-size:9px;color:var(--i5);display:block}
.bp-auto-action{font-size:8px;color:var(--i3);display:block}

/* Whisper */
.bp-whisper-prev{display:flex;align-items:center}
.bp-whisper-row{display:flex;align-items:center;gap:6px;width:100%}
.bp-whisper-badge{font-family:var(--mono);font-size:7px;font-weight:500;color:var(--em);background:var(--embg);padding:2px 6px;border-radius:3px;flex-shrink:0}
.bp-whisper-dot{width:4px;height:4px;border-radius:50%;background:var(--em);flex-shrink:0}
.bp-whisper-text{font-size:9px;color:var(--i5);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bp-whisper-btn{font-size:7px;color:var(--i5);border:1px solid var(--bd);padding:2px 6px;border-radius:3px;flex-shrink:0}

/* Sticky */
.bp-sticky-prev{background:rgba(168,116,68,.02)}
.bp-sticky-text{font-size:10px;color:var(--i5);line-height:1.5;margin-top:6px;font-style:italic}

/* Revenue chart */
.bp-rev-chart{margin-top:8px}
.bp-rev-row{display:flex;align-items:center;gap:5px;padding:3px 0}
.bp-rev-av{width:16px;height:16px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:600;color:#fff;flex-shrink:0}
.bp-rev-name{font-size:8px;color:var(--i5);width:28px;flex-shrink:0}
.bp-rev-bar{flex:1;height:3px;background:var(--bdl);border-radius:2px;overflow:hidden}
.bp-rev-bar div{height:100%;border-radius:2px}
.bp-rev-val{font-family:var(--mono);font-size:8px;font-weight:500;color:var(--i7);width:28px;text-align:right;flex-shrink:0}
      `}</style>

      <div className="lib">
        <div className="lib-in">
          <div className="lib-hd">
            <div className="lib-eye">Space Block Library</div>
            <div className="lib-t">17 blocks. Drag to compose.</div>
            <div className="lib-sub">Every block previews exactly what it renders. Pick one, drag it onto the canvas, resize to fit.</div>
          </div>

          <div className="lib-bar">
            <div className="lib-search">
              <span style={{ color: "var(--i3)", fontSize: 14 }}>⌕</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search blocks..." />
            </div>
            <div className="lib-cats">
              {CATS.map(c => (
                <button key={c.id} className={`lib-cat${cat === c.id ? " on" : ""}`} onClick={() => setCat(c.id)}>{c.label}</button>
              ))}
            </div>
            <span className="lib-count">{filtered.length} blocks</span>
          </div>

          <div className="lib-grid">
            {filtered.map((block, i) => {
              const Prev = block.Prev;
              return (
                <div key={block.id} className="bcard"
                  style={{ animationDelay: `${i * 40}ms` }}
                  onMouseEnter={() => setHovered(block.id)}
                  onMouseLeave={() => setHovered(null)}>
                  <div className="bcard-prev"><Prev /></div>
                  <div className="bcard-info">
                    <div className="bcard-icon" style={{ color: block.color, background: block.color.replace(")", ",.06)").replace("var(", "rgba(").replace("--sg", "94,143,94").replace("--em", "168,116,68").replace("--lv", "125,125,176").replace("--rs", "180,110,94").replace("--i4", "155,152,143"), borderColor: block.color.replace(")", ",.1)").replace("var(", "rgba(").replace("--sg", "94,143,94").replace("--em", "168,116,68").replace("--lv", "125,125,176").replace("--rs", "180,110,94").replace("--i4", "155,152,143") }}>
                      {block.id === "revenue" ? "$" : block.id === "outstanding" ? "!" : block.id === "board" ? "⊞" : block.id === "activity" ? "◇" : block.id === "health" ? "♥" : block.id === "timer" ? "▶" : block.id === "calendar" ? "◎" : block.id === "chat" ? "✉" : block.id === "invoices" ? "☰" : block.id === "files" ? "◻" : block.id === "pipeline" ? "→" : block.id === "automations" ? "⚡" : block.id === "whisper" ? "✦" : block.id === "rate" ? "↗" : block.id === "goal" ? "◉" : block.id === "sticky" ? "◻" : "◈"}
                    </div>
                    <div className="bcard-text">
                      <div className="bcard-name">{block.name}</div>
                      <div className="bcard-desc">{block.desc}</div>
                      <div className="bcard-meta">
                        <span className="bcard-size">{block.size}</span>
                        <span className="bcard-cat">{block.cat}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bcard-line" style={{ background: block.color }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
