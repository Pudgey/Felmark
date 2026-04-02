import { useState, useRef } from "react";

/* ═══════════════════════════════════════════
   FELMARK — SPACE BLOCKS
   Compose your business. No code.
   ═══════════════════════════════════════════ */

// ── Block Registry ──
const BLOCK_LIBRARY = [
  { cat: "work", blocks: [
    { type: "task-list", name: "Task List", icon: "☰", desc: "Tasks with subtasks, priority, status", size: "2x2" },
    { type: "task-board", name: "Task Board", icon: "⊞", desc: "Kanban columns by status", size: "3x2" },
    { type: "milestone-track", name: "Milestone Tracker", icon: "→", desc: "Project phase progress", size: "3x1" },
    { type: "priority-matrix", name: "Priority Matrix", icon: "◆", desc: "Urgent/important quadrants", size: "2x2" },
  ]},
  { cat: "money", blocks: [
    { type: "revenue-counter", name: "Revenue Counter", icon: "$", desc: "Big number — earned this period", size: "1x1" },
    { type: "outstanding", name: "Outstanding", icon: "!", desc: "Unpaid invoices total", size: "1x1" },
    { type: "invoice-list", name: "Invoice List", icon: "☰", desc: "All invoices with status", size: "2x2" },
    { type: "rate-calc", name: "Rate Tracker", icon: "↗", desc: "Effective rate over time", size: "2x1" },
  ]},
  { cat: "client", blocks: [
    { type: "client-cards", name: "Client Cards", icon: "◎", desc: "Visual client overview", size: "2x2" },
    { type: "health-grid", name: "Health Grid", icon: "♥", desc: "Client health scores ranked", size: "1x2" },
    { type: "response-tracker", name: "Response Time", icon: "◇", desc: "Avg response by client", size: "1x1" },
  ]},
  { cat: "time", blocks: [
    { type: "active-timer", name: "Active Timer", icon: "▶", desc: "Start/stop timer for any task", size: "2x1" },
    { type: "weekly-hours", name: "Weekly Hours", icon: "◑", desc: "Hours logged this week", size: "2x1" },
    { type: "deadline-countdown", name: "Countdown", icon: "!", desc: "Next deadline approaching", size: "1x1" },
  ]},
  { cat: "data", blocks: [
    { type: "big-number", name: "Big Number", icon: "#", desc: "Single metric, large display", size: "1x1" },
    { type: "bar-chart", name: "Bar Chart", icon: "▊", desc: "Compare values across categories", size: "2x1" },
    { type: "sparkline-row", name: "Sparkline Row", icon: "~", desc: "Trend line with label and value", size: "2x1" },
    { type: "goal-tracker", name: "Goal Tracker", icon: "◉", desc: "Progress ring toward a target", size: "1x1" },
  ]},
  { cat: "comms", blocks: [
    { type: "quick-chat", name: "Quick Chat", icon: "✉", desc: "Message any client inline", size: "1x2" },
    { type: "ai-whisper", name: "AI Whisper", icon: "✦", desc: "Contextual AI suggestions", size: "3x1" },
    { type: "activity-feed", name: "Activity Feed", icon: "◇", desc: "Live stream of all events", size: "1x2" },
  ]},
  { cat: "auto", blocks: [
    { type: "trigger-card", name: "Automation Rule", icon: "⚡", desc: "When X happens → do Y", size: "2x1" },
    { type: "reminder-queue", name: "Reminder Queue", icon: "◎", desc: "Upcoming automated actions", size: "1x2" },
  ]},
  { cat: "content", blocks: [
    { type: "sticky-note", name: "Sticky Note", icon: "◻", desc: "Quick text note", size: "1x1" },
    { type: "quick-links", name: "Quick Links", icon: "↗", desc: "Bookmarks and shortcuts", size: "1x1" },
    { type: "embed", name: "Embed", icon: "◈", desc: "Figma, Loom, Google, any URL", size: "2x2" },
  ]},
];

const CATS = { work: "Work", money: "Money", client: "Client", time: "Time", data: "Data", comms: "Comms", auto: "Automations", content: "Content" };
const CAT_COLORS = { work: "#d97706", money: "#5a9a3c", client: "#5b7fa4", time: "#7c6b9e", data: "var(--ember)", comms: "#5b7fa4", auto: "#d97706", content: "var(--ink-400)" };

// ── Pre-built Spaces ──
const DEFAULT_SPACES = [
  {
    id: "dashboard", name: "Dashboard", icon: "◆",
    blocks: [
      { id: "b1", type: "revenue-counter", x: 0, y: 0, w: 1, h: 1, config: { label: "Earned this month", value: "$14,800", color: "#5a9a3c", trend: "+12%" } },
      { id: "b2", type: "outstanding", x: 1, y: 0, w: 1, h: 1, config: { label: "Outstanding", value: "$9,600", color: "#c24b38", count: "3 invoices" } },
      { id: "b3", type: "deadline-countdown", x: 2, y: 0, w: 1, h: 1, config: { label: "Next deadline", value: "2 days", task: "Color palette due", color: "var(--ember)" } },
      { id: "b4", type: "goal-tracker", x: 3, y: 0, w: 1, h: 1, config: { label: "Monthly goal", value: 74, target: "$20,000", color: "var(--ember)" } },
      { id: "b5", type: "ai-whisper", x: 0, y: 1, w: 4, h: 1, config: {} },
      { id: "b6", type: "task-board", x: 0, y: 2, w: 2, h: 2, config: { client: "all", groupBy: "status" } },
      { id: "b7", type: "activity-feed", x: 2, y: 2, w: 1, h: 2, config: {} },
      { id: "b8", type: "health-grid", x: 3, y: 2, w: 1, h: 2, config: {} },
    ],
  },
  {
    id: "triage", name: "Morning Triage", icon: "!",
    blocks: [
      { id: "c1", type: "ai-whisper", x: 0, y: 0, w: 4, h: 1, config: {} },
      { id: "c2", type: "outstanding", x: 0, y: 1, w: 1, h: 1, config: { label: "Overdue", value: "$4,000", color: "#c24b38", count: "1 invoice" } },
      { id: "c3", type: "response-tracker", x: 1, y: 1, w: 1, h: 1, config: { label: "Slowest response", value: "Bolt · 3d", color: "#c24b38" } },
      { id: "c4", type: "deadline-countdown", x: 2, y: 1, w: 1, h: 1, config: { label: "Next deadline", value: "2 days", task: "Color palette", color: "var(--ember)" } },
      { id: "c5", type: "big-number", x: 3, y: 1, w: 1, h: 1, config: { label: "Tasks overdue", value: "3", color: "#c24b38" } },
      { id: "c6", type: "task-list", x: 0, y: 2, w: 2, h: 2, config: { filter: "urgent+high", client: "all" } },
      { id: "c7", type: "invoice-list", x: 2, y: 2, w: 2, h: 2, config: { filter: "overdue+sent" } },
    ],
  },
  {
    id: "revenue", name: "Revenue", icon: "$",
    blocks: [
      { id: "d1", type: "revenue-counter", x: 0, y: 0, w: 1, h: 1, config: { label: "This month", value: "$14,800", color: "#5a9a3c", trend: "+12%" } },
      { id: "d2", type: "outstanding", x: 1, y: 0, w: 1, h: 1, config: { label: "Outstanding", value: "$9,600", color: "var(--ember)", count: "3 invoices" } },
      { id: "d3", type: "rate-calc", x: 2, y: 0, w: 2, h: 1, config: { label: "Effective rate", value: "$108/hr", target: "$150", color: "var(--ember)" } },
      { id: "d4", type: "bar-chart", x: 0, y: 1, w: 2, h: 2, config: { label: "Revenue by client" } },
      { id: "d5", type: "invoice-list", x: 2, y: 1, w: 2, h: 2, config: { filter: "all" } },
    ],
  },
];

// ── Block Renderers ──
function BigNumberBlock({ config }) {
  return (
    <div className="sb-inner">
      <div className="sb-big-val" style={{ color: config.color || "var(--ink-900)" }}>{config.value}</div>
      <div className="sb-big-label">{config.label}</div>
      {config.trend && <div className="sb-big-trend" style={{ color: config.trend.startsWith("+") ? "#5a9a3c" : "#c24b38" }}>{config.trend}</div>}
      {config.count && <div className="sb-big-sub">{config.count}</div>}
      {config.task && <div className="sb-big-sub">{config.task}</div>}
    </div>
  );
}

function GoalBlock({ config }) {
  const pct = config.value || 0;
  const r = 28, circ = 2 * Math.PI * r;
  return (
    <div className="sb-inner" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <svg width="68" height="68" viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={r} fill="none" stroke="var(--warm-200)" strokeWidth="4" />
        <circle cx="34" cy="34" r={r} fill="none" stroke={config.color || "var(--ember)"} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ} strokeLinecap="round" transform="rotate(-90 34 34)" style={{ transition: "stroke-dashoffset .6s ease" }} />
        <text x="34" y="32" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 14, fontWeight: 600, fill: config.color || "var(--ember)", fontFamily: "var(--mono)" }}>{pct}%</text>
        <text x="34" y="44" textAnchor="middle" style={{ fontSize: 7, fill: "var(--ink-300)", fontFamily: "var(--mono)" }}>{config.target}</text>
      </svg>
      <div className="sb-big-label" style={{ marginTop: 2 }}>{config.label}</div>
    </div>
  );
}

function AIWhisperBlock() {
  const [idx, setIdx] = useState(0);
  const whispers = [
    { text: "Sarah hasn't responded to color palette in 2 days", action: "Nudge", color: "var(--ember)" },
    { text: "Bolt invoice 4 days overdue — risk rises 3× after 7d", action: "Remind", color: "#c24b38" },
    { text: "Luna inquired 2h ago — leads go cold after 24h", action: "Propose", color: "#5a9a3c" },
  ];
  const w = whispers[idx % whispers.length];
  return (
    <div className="sb-inner sb-whisper">
      <span className="sb-whisper-badge">✦ AI</span>
      <span className="sb-whisper-dot" style={{ background: w.color }} />
      <span className="sb-whisper-text">{w.text}</span>
      <button className="sb-whisper-action" style={{ color: w.color, borderColor: w.color + "20" }} onClick={() => setIdx(idx + 1)}>{w.action}</button>
      <button className="sb-whisper-x" onClick={() => setIdx(idx + 1)}>✕</button>
    </div>
  );
}

function TaskBoardBlock() {
  const cols = [
    { label: "To Do", color: "#5b7fa4", items: ["Brand guidelines doc", "Social template kit"] },
    { label: "In Progress", color: "#d97706", items: ["Color palette system"] },
    { label: "Review", color: "#7c6b9e", items: ["Client revisions"] },
    { label: "Done", color: "#5a9a3c", items: ["Discovery audit", "Logo concepts"] },
  ];
  return (
    <div className="sb-inner sb-board">
      {cols.map((col, i) => (
        <div key={i} className="sb-board-col">
          <div className="sb-board-col-head"><div className="sb-board-col-dot" style={{ background: col.color }} /><span style={{ color: col.color }}>{col.label}</span><span className="sb-board-col-count">{col.items.length}</span></div>
          {col.items.map((item, j) => <div key={j} className="sb-board-card">{item}</div>)}
        </div>
      ))}
    </div>
  );
}

function TaskListBlock() {
  const tasks = [
    { title: "Client review & revisions", pri: "#c24b38", due: "Apr 1", status: "review" },
    { title: "Color palette & typography", pri: "#d97706", due: "Apr 2", status: "progress" },
    { title: "Brand guidelines document", pri: "#5b7fa4", due: "Apr 5", status: "todo" },
    { title: "Social media template kit", pri: "#9b988f", due: "Apr 10", status: "backlog" },
  ];
  return (
    <div className="sb-inner sb-tasklist">
      {tasks.map((t, i) => (
        <div key={i} className="sb-tl-row">
          <div className="sb-tl-pri" style={{ background: t.pri }} />
          <div className="sb-tl-cb" />
          <span className="sb-tl-title">{t.title}</span>
          <span className="sb-tl-due">{t.due}</span>
        </div>
      ))}
    </div>
  );
}

function ActivityBlock() {
  const items = [
    { text: "Sarah viewed proposal", time: "2m", dot: "#5b7fa4" },
    { text: "Payment $1,800", time: "3h", dot: "#5a9a3c" },
    { text: "3 comments on scope", time: "2d", dot: "#d97706" },
    { text: "Contract signed", time: "2w", dot: "#5a9a3c" },
    { text: "Proposal sent $4,800", time: "2w", dot: "var(--ember)" },
    { text: "New lead: Luna", time: "2h", dot: "#7c6b9e" },
  ];
  return (
    <div className="sb-inner sb-activity">
      <div className="sb-activity-label">Activity</div>
      {items.map((a, i) => (
        <div key={i} className="sb-act-row"><div className="sb-act-dot" style={{ background: a.dot }} /><span className="sb-act-text">{a.text}</span><span className="sb-act-time">{a.time}</span></div>
      ))}
    </div>
  );
}

function HealthBlock() {
  const clients = [
    { name: "Meridian", health: 92, color: "#5a9a3c", av: "M", avC: "#7c8594" },
    { name: "Nora", health: 88, color: "#5a9a3c", av: "N", avC: "#a08472" },
    { name: "Bolt", health: 45, color: "#c24b38", av: "B", avC: "#8a7e63" },
    { name: "Luna", health: 0, color: "var(--ink-300)", av: "L", avC: "#7c6b9e" },
  ];
  return (
    <div className="sb-inner sb-health">
      <div className="sb-health-label">Client Health</div>
      {clients.map((c, i) => (
        <div key={i} className="sb-health-row">
          <div className="sb-health-av" style={{ background: c.avC }}>{c.av}</div>
          <span className="sb-health-name">{c.name}</span>
          <div className="sb-health-bar"><div style={{ width: `${c.health}%`, height: "100%", background: c.color, borderRadius: 2 }} /></div>
          <span className="sb-health-val" style={{ color: c.color }}>{c.health || "—"}</span>
        </div>
      ))}
    </div>
  );
}

function InvoiceListBlock() {
  const invs = [
    { num: "INV-047", client: "Bolt", amount: "$4,000", status: "overdue", statusColor: "#c24b38" },
    { num: "INV-048", client: "Meridian", amount: "$2,400", status: "sent", statusColor: "#d97706" },
    { num: "INV-046", client: "Meridian", amount: "$1,800", status: "paid", statusColor: "#5a9a3c" },
    { num: "INV-045", client: "Nora", amount: "$2,200", status: "paid", statusColor: "#5a9a3c" },
  ];
  return (
    <div className="sb-inner sb-invlist">
      {invs.map((inv, i) => (
        <div key={i} className="sb-inv-row">
          <span className="sb-inv-num">{inv.num}</span>
          <span className="sb-inv-client">{inv.client}</span>
          <span className="sb-inv-amount">{inv.amount}</span>
          <span className="sb-inv-status" style={{ color: inv.statusColor, borderColor: inv.statusColor + "20", background: inv.statusColor + "06" }}>{inv.status}</span>
        </div>
      ))}
    </div>
  );
}

function BarChartBlock() {
  const data = [{ label: "Meridian", val: 75, color: "#7c8594" }, { label: "Nora", val: 52, color: "#a08472" }, { label: "Bolt", val: 38, color: "#8a7e63" }, { label: "Luna", val: 0, color: "#7c6b9e" }];
  const max = Math.max(...data.map(d => d.val));
  return (
    <div className="sb-inner sb-barchart">
      <div className="sb-bar-label">Revenue by Client</div>
      <div className="sb-bars">
        {data.map((d, i) => (
          <div key={i} className="sb-bar-item">
            <div className="sb-bar-track"><div className="sb-bar-fill" style={{ width: `${max > 0 ? (d.val / max) * 100 : 0}%`, background: d.color }} /></div>
            <div className="sb-bar-info"><span>{d.label}</span><span>${(d.val * 166).toLocaleString()}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RateBlock({ config }) {
  return (
    <div className="sb-inner sb-rate">
      <div className="sb-rate-top">
        <div><div className="sb-rate-val" style={{ color: config.color }}>{config.value}</div><div className="sb-big-label">{config.label}</div></div>
        <div style={{ textAlign: "right" }}><div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-300)" }}>Target</div><div style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 600, color: "var(--ink-400)" }}>{config.target}</div></div>
      </div>
      <div className="sb-rate-sparkline">
        <svg width="100%" height="30" viewBox="0 0 200 30" preserveAspectRatio="none">
          <polyline points="0,25 30,22 60,18 90,15 120,20 150,22 180,24 200,22" fill="none" stroke="var(--ember)" strokeWidth="1.5" />
          <line x1="0" y1="10" x2="200" y2="10" stroke="var(--warm-200)" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
}

function WeeklyHoursBlock() {
  const days = [{ d: "M", h: 6.5 }, { d: "T", h: 7 }, { d: "W", h: 5 }, { d: "T", h: 8 }, { d: "F", h: 3 }, { d: "S", h: 0 }, { d: "S", h: 0 }];
  const total = days.reduce((s, d) => s + d.h, 0);
  return (
    <div className="sb-inner sb-weekly">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span className="sb-big-label">This week</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 600, color: "var(--ink-800)" }}>{total}h</span>
      </div>
      <div className="sb-weekly-bars">
        {days.map((d, i) => (
          <div key={i} className="sb-weekly-col">
            <div className="sb-weekly-bar"><div style={{ height: `${(d.h / 8) * 100}%`, background: d.h > 0 ? "var(--ember)" : "var(--warm-200)", borderRadius: 2, width: "100%", marginTop: "auto" }} /></div>
            <span className="sb-weekly-label">{d.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimerBlock() {
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(4920);
  return (
    <div className="sb-inner sb-timer">
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        {running && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#5a9a3c", animation: "tp 1.5s ease infinite" }} />}
        <span style={{ fontSize: 10, color: "var(--ink-500)" }}>Color palette & typography</span>
      </div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 28, fontWeight: 600, color: "var(--ink-900)", letterSpacing: ".02em", marginBottom: 4 }}>
        {`${Math.floor(secs / 3600)}:${String(Math.floor((secs % 3600) / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`}
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <button onClick={() => setRunning(!running)} style={{ padding: "4px 12px", borderRadius: 4, border: "none", background: running ? "var(--warm-100)" : "var(--ink-900)", color: running ? "var(--ink-500)" : "#fff", fontSize: 10, fontFamily: "inherit", cursor: "pointer" }}>{running ? "❚❚ Pause" : "▶ Start"}</button>
        <button style={{ padding: "4px 12px", borderRadius: 4, border: "none", background: "#5a9a3c", color: "#fff", fontSize: 10, fontFamily: "inherit", cursor: "pointer" }}>✓ Log</button>
      </div>
    </div>
  );
}

function StickyBlock() {
  return (
    <div className="sb-inner sb-sticky">
      <div className="sb-sticky-text" contentEditable suppressContentEditableWarning style={{ outline: "none", minHeight: 40, fontSize: 12, color: "var(--ink-600)", lineHeight: 1.5 }}>
        Remember: Sarah prefers warm tones. CEO James needs to sign off before final delivery.
      </div>
    </div>
  );
}

function renderBlock(block) {
  const t = block.type;
  const c = block.config || {};
  if (t === "revenue-counter" || t === "outstanding" || t === "deadline-countdown" || t === "big-number" || t === "response-tracker") return <BigNumberBlock config={c} />;
  if (t === "goal-tracker") return <GoalBlock config={c} />;
  if (t === "ai-whisper") return <AIWhisperBlock />;
  if (t === "task-board") return <TaskBoardBlock />;
  if (t === "task-list") return <TaskListBlock />;
  if (t === "activity-feed") return <ActivityBlock />;
  if (t === "health-grid") return <HealthBlock />;
  if (t === "invoice-list") return <InvoiceListBlock />;
  if (t === "bar-chart") return <BarChartBlock />;
  if (t === "rate-calc") return <RateBlock config={c} />;
  if (t === "weekly-hours") return <WeeklyHoursBlock />;
  if (t === "active-timer") return <TimerBlock />;
  if (t === "sticky-note") return <StickyBlock />;
  if (t === "sparkline-row") return <RateBlock config={{ label: "Trend", value: "$14.8k", target: "$20k", color: "var(--ember)" }} />;
  return <div className="sb-inner" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-300)", fontSize: 11 }}>{block.type}</div>;
}

// ── Main Component ──
export default function SpaceBlocks() {
  const [activeSpace, setActiveSpace] = useState("dashboard");
  const [spaces, setSpaces] = useState(DEFAULT_SPACES);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libCat, setLibCat] = useState("work");
  const [editing, setEditing] = useState(false);
  const [configBlock, setConfigBlock] = useState(null);
  const [dragging, setDragging] = useState(null);

  const space = spaces.find(s => s.id === activeSpace);

  const addBlock = (blockDef) => {
    const newBlock = {
      id: `b${Date.now()}`, type: blockDef.type, x: 0, y: 99,
      w: parseInt(blockDef.size[0]), h: parseInt(blockDef.size[2]),
      config: blockDef.type === "revenue-counter" ? { label: "Revenue", value: "$0", color: "#5a9a3c" } :
              blockDef.type === "big-number" ? { label: "Metric", value: "0", color: "var(--ink-900)" } :
              blockDef.type === "outstanding" ? { label: "Outstanding", value: "$0", color: "var(--ember)" } : {},
    };
    setSpaces(prev => prev.map(s => s.id === activeSpace ? { ...s, blocks: [...s.blocks, newBlock] } : s));
    setShowLibrary(false);
  };

  const removeBlock = (blockId) => {
    setSpaces(prev => prev.map(s => s.id === activeSpace ? { ...s, blocks: s.blocks.filter(b => b.id !== blockId) } : s));
    setConfigBlock(null);
  };

  const libDef = BLOCK_LIBRARY.find(c => c.cat === libCat);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.sp{font-family:'Outfit',sans-serif;background:var(--parchment);height:100vh;display:flex;flex-direction:column;overflow:hidden}

/* Top bar */
.sp-top{padding:6px 12px;background:#fff;border-bottom:1px solid var(--warm-200);display:flex;align-items:center;gap:6px;flex-shrink:0}
.sp-top-logo{display:flex;align-items:center;gap:5px}
.sp-top-mark{width:22px;height:22px;border-radius:5px;background:var(--ink-900);display:flex;align-items:center;justify-content:center;color:var(--ember);font-size:9px}
.sp-top-name{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600;color:var(--ink-900)}
.sp-sep{width:1px;height:14px;background:var(--warm-200);margin:0 4px}

/* Space tabs */
.sp-tabs{display:flex;gap:2px;flex:1;overflow-x:auto}
.sp-tab{padding:5px 12px;border-radius:5px;border:none;font-size:11px;font-family:inherit;cursor:pointer;color:var(--ink-400);background:none;display:flex;align-items:center;gap:4px;white-space:nowrap;transition:all .06s}
.sp-tab:hover{color:var(--ink-600);background:var(--warm-50)}
.sp-tab.on{background:var(--ember-bg);color:var(--ink-900);font-weight:500}
.sp-tab-icon{font-size:10px}
.sp-tab-add{padding:4px 8px;border-radius:4px;border:1px dashed var(--warm-300);background:none;font-size:10px;font-family:inherit;color:var(--ink-300);cursor:pointer}
.sp-tab-add:hover{border-color:var(--ember);color:var(--ember)}

.sp-top-right{display:flex;gap:4px;flex-shrink:0}
.sp-top-btn{padding:4px 12px;border-radius:5px;border:1px solid var(--warm-200);background:#fff;font-size:10px;font-family:inherit;color:var(--ink-500);cursor:pointer;display:flex;align-items:center;gap:3px}
.sp-top-btn:hover{background:var(--warm-50)}
.sp-top-btn.on{background:var(--ink-900);color:#fff;border-color:var(--ink-900)}
.sp-top-btn.primary{background:var(--ember);color:#fff;border-color:var(--ember)}
.sp-top-btn.primary:hover{background:#c89360}

/* Canvas */
.sp-canvas{flex:1;overflow:auto;padding:12px}
.sp-canvas::-webkit-scrollbar{width:6px;height:6px}
.sp-canvas::-webkit-scrollbar-thumb{background:var(--warm-200);border-radius:3px}

.sp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;auto-rows:minmax(120px,auto)}

/* Space Block */
.sb{background:#fff;border:1px solid var(--warm-200);border-radius:10px;overflow:hidden;position:relative;transition:all .12s}
.sb:hover{border-color:var(--warm-300);box-shadow:0 2px 8px rgba(0,0,0,0.02)}
.sb.editing{border-style:dashed}
.sb.editing:hover{border-color:var(--ember);box-shadow:0 0 0 3px var(--ember-bg)}

/* Block header (editing mode) */
.sb-edit-head{display:none;padding:4px 8px;background:var(--warm-50);border-bottom:1px solid var(--warm-100);align-items:center;gap:4px;cursor:grab}
.sb.editing .sb-edit-head{display:flex}
.sb-edit-handle{font-size:8px;color:var(--ink-300);cursor:grab}
.sb-edit-name{font-family:var(--mono);font-size:8px;color:var(--ink-400);flex:1}
.sb-edit-btn{width:16px;height:16px;border-radius:3px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:8px}
.sb-edit-btn:hover{background:var(--warm-100);color:var(--ink-600)}
.sb-edit-btn.danger:hover{background:rgba(194,75,56,.06);color:#c24b38;border-color:rgba(194,75,56,.1)}

/* Block inner */
.sb-inner{padding:12px;height:100%}

/* Big number */
.sb-big-val{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;line-height:1}
.sb-big-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em;margin-top:2px}
.sb-big-trend{font-family:var(--mono);font-size:10px;margin-top:2px}
.sb-big-sub{font-family:var(--mono);font-size:9px;color:var(--ink-300);margin-top:1px}

/* Whisper */
.sb-whisper{display:flex;align-items:center;gap:6px;padding:8px 12px}
.sb-whisper-badge{font-family:var(--mono);font-size:8px;font-weight:600;color:var(--ember);background:var(--ember-bg);padding:2px 6px;border-radius:3px;flex-shrink:0}
.sb-whisper-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.sb-whisper-text{font-size:12px;color:var(--ink-600);flex:1;line-height:1.3}
.sb-whisper-action{padding:4px 10px;border-radius:4px;border:1px solid;font-size:10px;font-weight:500;font-family:inherit;cursor:pointer;background:#fff;flex-shrink:0}
.sb-whisper-x{width:20px;height:20px;border-radius:4px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0}

/* Board */
.sb-board{display:flex;gap:4px;padding:8px;height:100%}
.sb-board-col{flex:1;min-width:0}
.sb-board-col-head{display:flex;align-items:center;gap:3px;padding:2px 4px;margin-bottom:3px;font-family:var(--mono);font-size:8px;font-weight:500;text-transform:uppercase}
.sb-board-col-dot{width:4px;height:4px;border-radius:1px}
.sb-board-col-count{color:var(--ink-300);font-weight:400}
.sb-board-card{background:var(--warm-50);border:1px solid var(--warm-100);border-radius:4px;padding:5px 6px;margin-bottom:2px;font-size:10px;color:var(--ink-700);cursor:grab}

/* Task list */
.sb-tasklist{padding:6px 8px}
.sb-tl-row{display:flex;align-items:center;gap:5px;padding:5px 0;border-bottom:1px solid var(--warm-100)}
.sb-tl-row:last-child{border-bottom:none}
.sb-tl-pri{width:3px;height:14px;border-radius:1px;flex-shrink:0}
.sb-tl-cb{width:12px;height:12px;border-radius:3px;border:1.5px solid var(--warm-300);flex-shrink:0}
.sb-tl-title{font-size:11px;color:var(--ink-700);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-tl-due{font-family:var(--mono);font-size:9px;color:var(--ink-300);flex-shrink:0}

/* Activity */
.sb-activity{padding:8px 10px}
.sb-activity-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;margin-bottom:6px}
.sb-act-row{display:flex;align-items:center;gap:5px;padding:4px 0;border-bottom:1px solid var(--warm-100);font-size:10px}
.sb-act-row:last-child{border-bottom:none}
.sb-act-dot{width:3px;height:3px;border-radius:50%;flex-shrink:0}
.sb-act-text{flex:1;color:var(--ink-500);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-act-time{font-family:var(--mono);font-size:8px;color:var(--ink-300);flex-shrink:0}

/* Health */
.sb-health{padding:8px 10px}
.sb-health-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;margin-bottom:6px}
.sb-health-row{display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid var(--warm-100)}
.sb-health-row:last-child{border-bottom:none}
.sb-health-av{width:18px;height:18px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:600;color:#fff;flex-shrink:0}
.sb-health-name{font-size:11px;color:var(--ink-600);width:50px;flex-shrink:0}
.sb-health-bar{flex:1;height:4px;background:var(--warm-200);border-radius:2px;overflow:hidden}
.sb-health-val{font-family:var(--mono);font-size:10px;font-weight:500;width:20px;text-align:right;flex-shrink:0}

/* Invoice list */
.sb-invlist{padding:6px 8px}
.sb-inv-row{display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid var(--warm-100);font-size:10px}
.sb-inv-row:last-child{border-bottom:none}
.sb-inv-num{font-family:var(--mono);font-size:9px;color:var(--ink-400);width:52px;flex-shrink:0}
.sb-inv-client{color:var(--ink-600);width:50px;flex-shrink:0}
.sb-inv-amount{font-family:var(--mono);font-size:11px;font-weight:500;color:var(--ink-800);flex:1;text-align:right}
.sb-inv-status{font-family:var(--mono);font-size:8px;font-weight:500;padding:1px 6px;border-radius:3px;border:1px solid;flex-shrink:0}

/* Bar chart */
.sb-barchart{padding:8px 10px}
.sb-bar-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;margin-bottom:8px}
.sb-bars{display:flex;flex-direction:column;gap:5px}
.sb-bar-item{}
.sb-bar-track{height:6px;background:var(--warm-200);border-radius:3px;overflow:hidden;margin-bottom:2px}
.sb-bar-fill{height:100%;border-radius:3px;transition:width .4s ease}
.sb-bar-info{display:flex;justify-content:space-between;font-family:var(--mono);font-size:8px;color:var(--ink-400)}

/* Rate */
.sb-rate{padding:10px 12px}
.sb-rate-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px}
.sb-rate-val{font-family:var(--mono);font-size:20px;font-weight:600}
.sb-rate-sparkline{border-top:1px solid var(--warm-100);padding-top:4px}

/* Weekly hours */
.sb-weekly{padding:10px 12px}
.sb-weekly-bars{display:flex;gap:3px;height:48px}
.sb-weekly-col{flex:1;display:flex;flex-direction:column;align-items:center}
.sb-weekly-bar{flex:1;width:100%;display:flex;border-radius:2px;overflow:hidden;background:var(--warm-100)}
.sb-weekly-label{font-family:var(--mono);font-size:7px;color:var(--ink-300);margin-top:2px}

/* Timer */
.sb-timer{padding:10px 12px}
@keyframes tp{0%,60%,100%{opacity:.3;transform:scale(1)}15%{opacity:1;transform:scale(1.1)}}

/* Sticky */
.sb-sticky{padding:10px;background:rgba(217,151,6,0.03)}

/* ═══ Library panel ═══ */
.sp-lib{position:fixed;inset:0;background:rgba(44,42,37,.15);z-index:100;display:flex;justify-content:center;align-items:flex-start;padding-top:60px}
.sp-lib-panel{width:560px;background:#fff;border:1px solid var(--warm-200);border-radius:12px;box-shadow:0 16px 48px rgba(0,0,0,0.08);overflow:hidden;max-height:80vh;display:flex;flex-direction:column}
.sp-lib-head{padding:14px 18px;border-bottom:1px solid var(--warm-100);display:flex;align-items:center;justify-content:space-between}
.sp-lib-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--ink-900)}
.sp-lib-close{width:24px;height:24px;border-radius:5px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px}
.sp-lib-cats{display:flex;gap:2px;padding:8px 14px;border-bottom:1px solid var(--warm-100);overflow-x:auto;flex-shrink:0}
.sp-lib-cat{padding:5px 10px;border-radius:4px;border:none;font-size:10px;font-family:inherit;cursor:pointer;color:var(--ink-400);background:none;white-space:nowrap}
.sp-lib-cat:hover{color:var(--ink-600);background:var(--warm-50)}
.sp-lib-cat.on{background:var(--ink-900);color:#fff}
.sp-lib-blocks{flex:1;overflow-y:auto;padding:10px 14px;display:grid;grid-template-columns:1fr 1fr;gap:6px}
.sp-lib-block{padding:12px;border:1px solid var(--warm-200);border-radius:8px;cursor:pointer;transition:all .1s}
.sp-lib-block:hover{border-color:var(--ember);background:var(--ember-bg);transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.03)}
.sp-lib-block-top{display:flex;align-items:center;gap:8px;margin-bottom:4px}
.sp-lib-block-icon{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;border:1px solid}
.sp-lib-block-name{font-size:13px;font-weight:500;color:var(--ink-800)}
.sp-lib-block-size{font-family:var(--mono);font-size:8px;color:var(--ink-300);background:var(--warm-100);padding:1px 4px;border-radius:2px}
.sp-lib-block-desc{font-size:11px;color:var(--ink-400);line-height:1.4}

/* Footer */
.sp-foot{padding:4px 12px;border-top:1px solid var(--warm-200);background:#fff;display:flex;justify-content:space-between;align-items:center;font-family:var(--mono);font-size:8px;color:var(--ink-300);flex-shrink:0}
      `}</style>

      <div className="sp">
        {/* Top bar */}
        <div className="sp-top">
          <div className="sp-top-logo"><div className="sp-top-mark">◆</div><span className="sp-top-name">Felmark</span></div>
          <span style={{ fontFamily: "var(--mono)", fontSize: 7, color: "var(--ink-300)", background: "var(--warm-100)", padding: "1px 5px", borderRadius: 3 }}>WORKSPACE</span>
          <span className="sp-sep" />

          {/* Space tabs */}
          <div className="sp-tabs">
            {spaces.map(s => (
              <button key={s.id} className={`sp-tab${activeSpace === s.id ? " on" : ""}`} onClick={() => setActiveSpace(s.id)}>
                <span className="sp-tab-icon">{s.icon}</span>{s.name}
              </button>
            ))}
            <button className="sp-tab-add">+ Space</button>
          </div>

          <div className="sp-top-right">
            <button className={`sp-top-btn${editing ? " on" : ""}`} onClick={() => setEditing(!editing)}>
              {editing ? "✓ Done" : "✎ Edit"}
            </button>
            <button className="sp-top-btn primary" onClick={() => setShowLibrary(true)}>+ Block</button>
          </div>
        </div>

        {/* Canvas */}
        <div className="sp-canvas">
          <div className="sp-grid">
            {space?.blocks.map(block => {
              const def = BLOCK_LIBRARY.flatMap(c => c.blocks).find(b => b.type === block.type);
              return (
                <div key={block.id} className={`sb${editing ? " editing" : ""}`}
                  style={{ gridColumn: `span ${block.w}`, gridRow: `span ${block.h}` }}>
                  {/* Edit header */}
                  <div className="sb-edit-head">
                    <span className="sb-edit-handle">⋮⋮</span>
                    <span className="sb-edit-name">{def?.name || block.type}</span>
                    <button className="sb-edit-btn" onClick={() => setConfigBlock(configBlock === block.id ? null : block.id)} title="Configure">⚙</button>
                    <button className="sb-edit-btn danger" onClick={() => removeBlock(block.id)} title="Remove">✕</button>
                  </div>

                  {/* Config panel */}
                  {configBlock === block.id && (
                    <div style={{ padding: "8px 10px", background: "var(--warm-50)", borderBottom: "1px solid var(--warm-100)", fontSize: 10 }}>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-400)", textTransform: "uppercase", marginBottom: 6 }}>Configure · {def?.name}</div>
                      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-400)", width: 50 }}>Source</span>
                        <select style={{ flex: 1, border: "1px solid var(--warm-200)", borderRadius: 3, padding: "2px 4px", fontSize: 9, fontFamily: "inherit", outline: "none" }}>
                          <option>All clients</option><option>Meridian Studio</option><option>Bolt Fitness</option><option>Nora Kim</option>
                        </select>
                      </div>
                      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-400)", width: 50 }}>Period</span>
                        <select style={{ flex: 1, border: "1px solid var(--warm-200)", borderRadius: 3, padding: "2px 4px", fontSize: 9, fontFamily: "inherit", outline: "none" }}>
                          <option>This month</option><option>This week</option><option>Last 30 days</option><option>All time</option>
                        </select>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-400)", width: 50 }}>Color</span>
                        <div style={{ display: "flex", gap: 2 }}>
                          {["#5a9a3c", "var(--ember)", "#c24b38", "#5b7fa4", "#7c6b9e", "var(--ink-900)"].map(c => (
                            <div key={c} style={{ width: 14, height: 14, borderRadius: 3, background: c, cursor: "pointer", border: "1px solid var(--warm-200)" }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {renderBlock(block)}
                </div>
              );
            })}

            {/* Add block placeholder (editing mode) */}
            {editing && (
              <div style={{ gridColumn: "span 1", gridRow: "span 1", border: "2px dashed var(--warm-300)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .12s", minHeight: 120 }}
                onClick={() => setShowLibrary(true)}>
                <div style={{ textAlign: "center", color: "var(--ink-300)" }}>
                  <div style={{ fontSize: 20, marginBottom: 2 }}>+</div>
                  <div style={{ fontSize: 10 }}>Add Block</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sp-foot">
          <span>{space?.blocks.length} blocks · {space?.name}</span>
          <span>◆ Powered by @felmark/forge</span>
        </div>
      </div>

      {/* ═══ Block Library ═══ */}
      {showLibrary && (
        <div className="sp-lib" onClick={() => setShowLibrary(false)}>
          <div className="sp-lib-panel" onClick={e => e.stopPropagation()}>
            <div className="sp-lib-head">
              <span className="sp-lib-title">Space Block Library</span>
              <button className="sp-lib-close" onClick={() => setShowLibrary(false)}>✕</button>
            </div>
            <div className="sp-lib-cats">
              {Object.entries(CATS).map(([id, label]) => (
                <button key={id} className={`sp-lib-cat${libCat === id ? " on" : ""}`} onClick={() => setLibCat(id)}>{label}</button>
              ))}
            </div>
            <div className="sp-lib-blocks">
              {(BLOCK_LIBRARY.find(c => c.cat === libCat)?.blocks || []).map(block => (
                <div key={block.type} className="sp-lib-block" onClick={() => addBlock(block)}>
                  <div className="sp-lib-block-top">
                    <div className="sp-lib-block-icon" style={{ color: CAT_COLORS[libCat], background: (CAT_COLORS[libCat] || "var(--ink-400)") + "08", borderColor: (CAT_COLORS[libCat] || "var(--ink-400)") + "15" }}>{block.icon}</div>
                    <div>
                      <div className="sp-lib-block-name">{block.name}</div>
                      <span className="sp-lib-block-size">{block.size}</span>
                    </div>
                  </div>
                  <div className="sp-lib-block-desc">{block.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
