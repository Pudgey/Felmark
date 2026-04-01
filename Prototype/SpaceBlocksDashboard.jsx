import { useState } from "react";

/* ═══════════════════════════════════════════
   FELMARK WORKSPACE — DASHBOARD
   Soft. Clean. Spa-like. Breathable.
   Client sidebar + Space Blocks grid.
   ═══════════════════════════════════════════ */

const CLIENTS = [
  { id: "meridian", name: "Meridian Studio", av: "M", color: "#7c8594", status: "active", owed: 2400, earned: 12400, projects: 2, health: 92, unread: 2 },
  { id: "nora", name: "Nora Kim", av: "N", color: "#a08472", status: "active", owed: 3200, earned: 8200, projects: 2, health: 88, unread: 0 },
  { id: "bolt", name: "Bolt Fitness", av: "B", color: "#8a7e63", status: "overdue", owed: 4000, earned: 6000, projects: 2, health: 45, unread: 1 },
  { id: "luna", name: "Luna Boutique", av: "L", color: "#7c6b9e", status: "lead", owed: 0, earned: 0, projects: 0, health: 0, unread: 1 },
];

const sc = (s) => s === "active" ? "#6b9a6b" : s === "overdue" ? "#c07a6a" : s === "lead" ? "#8b8bba" : "#b5b2a9";

export default function Dashboard() {
  const [activeClient, setActiveClient] = useState("meridian");
  const [hovered, setHovered] = useState(null);
  const [whisperIdx, setWhisperIdx] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [editing, setEditing] = useState(false);

  const cl = CLIENTS.find(c => c.id === activeClient);

  const whispers = [
    { text: "Sarah hasn't responded to the color palette review in 2 days — a gentle follow-up usually helps", action: "Send Nudge", color: "#b07d4f" },
    { text: "Bolt Fitness invoice is approaching 7 days overdue — consider a friendly reminder", action: "Remind", color: "#c07a6a" },
    { text: "Luna Boutique inquired 2 hours ago — early response makes a great first impression", action: "Draft Proposal", color: "#6b9a6b" },
  ];
  const w = whispers[whisperIdx % whispers.length];

  const activity = [
    { text: "Sarah viewed your proposal", time: "2m", dot: "#8b8bba" },
    { text: "Payment received · $1,800", time: "3h", dot: "#6b9a6b" },
    { text: "Contract signed · Nora Kim", time: "1h", dot: "#6b9a6b" },
    { text: "3 comments on scope section", time: "2d", dot: "#b07d4f" },
    { text: "New inquiry · Luna Boutique", time: "2h", dot: "#8b8bba" },
    { text: "Deliverable submitted", time: "5d", dot: "#a08472" },
  ];

  const tasks = [
    { title: "Client review & revisions", status: "Review", sColor: "#8b8bba", due: "Apr 1", pri: "Urgent", pColor: "#c07a6a" },
    { title: "Color palette & typography", status: "In Progress", sColor: "#b07d4f", due: "Apr 2", pri: "High", pColor: "#b07d4f" },
    { title: "Brand guidelines document", status: "To Do", sColor: "#8b8bba", due: "Apr 5", pri: "Medium", pColor: "#8b8bba" },
    { title: "Social media template kit", status: "Backlog", sColor: "#b5b2a9", due: "Apr 10", pri: "Low", pColor: "#b5b2a9" },
  ];

  const invoices = [
    { num: "INV-047", client: "Bolt Fitness", amount: "$4,000", status: "overdue", sColor: "#c07a6a" },
    { num: "INV-048", client: "Meridian", amount: "$2,400", status: "sent", sColor: "#b07d4f" },
    { num: "INV-046", client: "Meridian", amount: "$1,800", status: "paid", sColor: "#6b9a6b" },
    { num: "INV-045", client: "Nora Kim", amount: "$2,200", status: "paid", sColor: "#6b9a6b" },
  ];

  const milestones = [
    { label: "Discovery", done: true },
    { label: "Concepts", done: true },
    { label: "System", active: true },
    { label: "Guidelines", done: false },
    { label: "Templates", done: false },
    { label: "Delivery", done: false },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#f2f0ec;--card:#fff;--card-tint:#f9f8fc;--card-warm:#faf9f6;--border:#e8e5df;--border-light:#f0ede8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ink-200:#d0cdc6;--ember:#b07d4f;--ember-soft:#d4b896;--ember-bg:rgba(176,125,79,0.04);--sage:#6b9a6b;--sage-bg:rgba(107,154,107,0.04);--lavender:#8b8bba;--lavender-bg:rgba(139,139,186,0.04);--rose:#c07a6a;--rose-bg:rgba(192,122,106,0.03);--mono:'JetBrains Mono',monospace}

.db{font-family:'Outfit',sans-serif;background:var(--bg);height:100vh;display:flex;flex-direction:column;overflow:hidden;color:var(--ink-600)}

/* ═══ Top ═══ */
.db-top{height:44px;padding:0 20px;background:var(--card);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-shrink:0}
.db-logo{display:flex;align-items:center;gap:7px}
.db-mark{width:26px;height:26px;border-radius:7px;background:var(--ink-900);display:flex;align-items:center;justify-content:center;color:var(--ember);font-size:11px}
.db-appname{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--ink-900)}
.db-sep{width:1px;height:18px;background:var(--border);margin:0 6px}
.db-spaces{display:flex;gap:2px;flex:1}
.db-space{padding:7px 16px;border-radius:7px;border:none;font-size:12px;font-family:inherit;cursor:pointer;color:var(--ink-400);background:none;display:flex;align-items:center;gap:5px;transition:all .1s}
.db-space:hover{background:var(--ember-bg);color:var(--ink-600)}
.db-space.on{background:var(--ember-bg);color:var(--ink-900);font-weight:500}
.db-space-add{padding:7px 12px;border-radius:7px;border:1px dashed var(--border);background:none;font-size:11px;color:var(--ink-300);cursor:pointer;font-family:inherit}
.db-space-add:hover{border-color:var(--ember-soft);color:var(--ember)}
.db-right{display:flex;align-items:center;gap:6px;flex-shrink:0}
.db-btn{padding:6px 16px;border-radius:7px;border:1px solid var(--border);background:var(--card);font-size:11px;font-family:inherit;color:var(--ink-500);cursor:pointer;transition:all .08s}
.db-btn:hover{background:var(--card-warm);border-color:var(--ink-200)}
.db-btn.primary{background:var(--ink-900);color:var(--card);border-color:var(--ink-900)}
.db-btn.primary:hover{background:var(--ink-800)}
.db-av{width:28px;height:28px;border-radius:7px;background:var(--ember-soft);color:var(--ink-900);font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center}

/* ═══ Body ═══ */
.db-body{display:flex;flex:1;overflow:hidden}

/* ═══ Client Sidebar ═══ */
.db-side{width:220px;background:var(--card);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0}
.db-side-head{padding:14px 14px 8px;display:flex;align-items:center;justify-content:space-between}
.db-side-title{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.08em}
.db-side-add{width:20px;height:20px;border-radius:5px;border:1px solid var(--border);background:var(--card);color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px}
.db-side-add:hover{border-color:var(--ember-soft);color:var(--ember)}
.db-side-list{flex:1;overflow-y:auto;padding:0 6px 6px}
.db-side-list::-webkit-scrollbar{width:3px}
.db-side-list::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

.db-cl{display:flex;align-items:center;gap:10px;padding:10px 10px;border-radius:10px;cursor:pointer;margin-bottom:2px;transition:all .08s}
.db-cl:hover{background:var(--card-warm)}
.db-cl.on{background:var(--lavender-bg);border:1px solid rgba(139,139,186,0.06)}
.db-cl:not(.on){border:1px solid transparent}
.db-cl-av{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:var(--card);flex-shrink:0;position:relative}
.db-cl-unread{position:absolute;top:-3px;right:-3px;min-width:14px;height:14px;border-radius:7px;background:var(--rose);color:#fff;font-size:7px;font-weight:600;display:flex;align-items:center;justify-content:center;border:2px solid var(--card)}
.db-cl-info{flex:1;min-width:0}
.db-cl-name{font-size:13px;font-weight:500;color:var(--ink-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.db-cl.on .db-cl-name{color:var(--ink-900);font-weight:600}
.db-cl-meta{display:flex;align-items:center;gap:4px;margin-top:2px;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.db-cl-dot{width:5px;height:5px;border-radius:50%}
.db-cl-right{flex-shrink:0;text-align:right}
.db-cl-earned{font-family:var(--mono);font-size:10px;font-weight:500;color:var(--ink-400)}
.db-cl-owed{font-family:var(--mono);font-size:9px;color:var(--rose)}

.db-side-foot{padding:10px 14px;border-top:1px solid var(--border-light);font-family:var(--mono);font-size:9px;color:var(--ink-300);line-height:1.5}

/* ═══ Canvas ═══ */
.db-canvas{flex:1;overflow-y:auto;padding:20px 24px}
.db-canvas::-webkit-scrollbar{width:6px}
.db-canvas::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

.db-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:960px}

/* ═══ Block ═══ */
.bk{border-radius:16px;overflow:hidden;position:relative;transition:transform .2s cubic-bezier(.16,1,.3,1),box-shadow .25s ease;border:1px solid var(--border)}
.bk:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,0.03)}

/* Accent line on hover */
.bk-line{position:absolute;bottom:0;left:0;height:2px;width:0;z-index:5;transition:width .35s cubic-bezier(.16,1,.3,1);border-radius:0 0 16px 16px}
.bk:hover .bk-line{width:100%}

/* Subtle pattern */
.bk-pattern{position:absolute;inset:0;z-index:0;opacity:.03;pointer-events:none}
.bk-pattern.dots{background-image:radial-gradient(circle,currentColor 0.5px,transparent 0.5px);background-size:12px 12px}
.bk-pattern.lines{background-image:repeating-linear-gradient(120deg,currentColor 0px,currentColor 1px,transparent 1px,transparent 10px);opacity:.02}

/* Content */
.bk-in{position:relative;z-index:1;padding:20px 22px;height:100%}

/* Typography */
.bk-value{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:700;line-height:1;color:var(--ink-900)}
.bk-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.06em;margin-top:4px}
.bk-sub{font-family:var(--mono);font-size:9px;color:var(--ink-300);display:flex;align-items:center;gap:4px;margin-top:6px}
.bk-trend{font-family:var(--mono);font-size:10px;padding:2px 8px;border-radius:5px}
.bk-section-title{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}
.bk-bar{height:4px;background:var(--border-light);border-radius:2px;overflow:hidden}
.bk-bar-fill{height:100%;border-radius:2px;transition:width .6s cubic-bezier(.16,1,.3,1)}

/* ═══ Whisper ═══ */
.bk-whisper{display:flex;align-items:center;gap:10px;padding:14px 20px;border-radius:16px;background:var(--card);border:1px solid var(--border)}
.bk-whisper-badge{font-family:var(--mono);font-size:9px;font-weight:500;color:var(--ember);background:var(--ember-bg);padding:4px 10px;border-radius:6px;flex-shrink:0;border:1px solid rgba(176,125,79,0.04)}
.bk-whisper-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.bk-whisper-text{font-size:13px;color:var(--ink-500);flex:1;line-height:1.5}
.bk-whisper-action{padding:6px 16px;border-radius:7px;border:1px solid var(--border);background:var(--card);font-size:11px;font-weight:500;font-family:inherit;cursor:pointer;color:var(--ink-600);flex-shrink:0;transition:all .1s}
.bk-whisper-action:hover{background:var(--card-warm);border-color:var(--ink-200);transform:translateY(-1px)}
.bk-whisper-x{width:24px;height:24px;border-radius:6px;border:1px solid var(--border);background:var(--card);color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}
.bk-whisper-x:hover{background:var(--card-warm)}
.bk-whisper-more{font-family:var(--mono);font-size:9px;color:var(--ink-300);flex-shrink:0}

/* Milestones */
.bk-ms{display:flex;align-items:center;gap:0;padding:14px 20px}
.bk-ms-node{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;position:relative}
.bk-ms-dot{width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:7px;border:2px solid;z-index:1}
.bk-ms-line{position:absolute;top:8px;left:50%;right:-50%;height:1.5px;z-index:0}
.bk-ms-label{font-family:var(--mono);font-size:8px;text-align:center}

/* Task rows */
.bk-task{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border-light)}
.bk-task:last-child{border-bottom:none}
.bk-task-pri{width:3px;height:20px;border-radius:2px;flex-shrink:0}
.bk-task-cb{width:14px;height:14px;border-radius:4px;border:1.5px solid var(--border);flex-shrink:0}
.bk-task-title{font-size:12px;color:var(--ink-700);flex:1}
.bk-task-status{font-family:var(--mono);font-size:8px;padding:2px 7px;border-radius:4px;flex-shrink:0;border:1px solid}
.bk-task-due{font-family:var(--mono);font-size:9px;color:var(--ink-300);flex-shrink:0}

/* Activity */
.bk-act{display:flex;align-items:center;gap:7px;padding:6px 0;border-bottom:1px solid var(--border-light)}
.bk-act:last-child{border-bottom:none}
.bk-act-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.bk-act-text{font-size:12px;color:var(--ink-500);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bk-act-time{font-family:var(--mono);font-size:9px;color:var(--ink-300);flex-shrink:0}

/* Health */
.bk-health{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-light)}
.bk-health:last-child{border-bottom:none}
.bk-health-av{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--card);flex-shrink:0}
.bk-health-info{flex:1;min-width:0}
.bk-health-name{font-size:12px;color:var(--ink-700);margin-bottom:3px}
.bk-health-bar{height:4px;background:rgba(139,139,186,0.06);border-radius:2px;overflow:hidden}
.bk-health-val{font-family:var(--mono);font-size:12px;font-weight:500;width:28px;text-align:right;flex-shrink:0}

/* Invoice rows */
.bk-inv{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border-light)}
.bk-inv:last-child{border-bottom:none}
.bk-inv-info{flex:1;min-width:0}
.bk-inv-client{font-size:12px;color:var(--ink-700)}
.bk-inv-num{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.bk-inv-amount{font-family:var(--mono);font-size:14px;font-weight:600;color:var(--ink-800);flex-shrink:0}
.bk-inv-status{font-family:var(--mono);font-size:8px;font-weight:500;padding:2px 8px;border-radius:5px;flex-shrink:0;border:1px solid}

/* Hours */
.bk-hours{display:flex;gap:6px;height:56px;margin-top:8px}
.bk-hours-col{flex:1;display:flex;flex-direction:column;align-items:center}
.bk-hours-bar{flex:1;width:100%;border-radius:4px;overflow:hidden;background:rgba(139,139,186,0.04);display:flex}
.bk-hours-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);margin-top:3px}

/* Timer */
.bk-timer-val{font-family:var(--mono);font-size:28px;font-weight:600;color:var(--ink-900);letter-spacing:.02em;margin:4px 0 8px}
.bk-timer-btns{display:flex;gap:4px}
.bk-timer-btn{padding:6px 16px;border-radius:7px;border:1px solid var(--border);background:var(--card);font-size:10px;font-family:inherit;font-weight:500;color:var(--ink-500);cursor:pointer;transition:all .08s}
.bk-timer-btn:hover{background:var(--card-warm)}
.bk-timer-btn.go{background:var(--ink-900);color:var(--card);border-color:var(--ink-900)}
.bk-timer-btn.log{color:var(--sage);border-color:rgba(107,154,107,.12)}

/* Footer */
.db-foot{padding:6px 20px;border-top:1px solid var(--border);background:var(--card);display:flex;justify-content:space-between;align-items:center;font-family:var(--mono);font-size:9px;color:var(--ink-300);flex-shrink:0}
      `}</style>

      <div className="db">
        {/* Top */}
        <div className="db-top">
          <div className="db-logo"><div className="db-mark">◆</div><span className="db-appname">Felmark</span></div>
          <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-300)", background: "var(--card-warm)", padding: "2px 8px", borderRadius: 4, border: "1px solid var(--border-light)" }}>WORKSPACE</span>
          <span className="db-sep" />
          <div className="db-spaces">
            {[{ id: "dashboard", icon: "◆", label: "Dashboard" }, { id: "triage", icon: "◎", label: "Triage" }, { id: "revenue", icon: "$", label: "Revenue" }].map(s => (
              <button key={s.id} className={`db-space${s.id === "dashboard" ? " on" : ""}`}><span>{s.icon}</span>{s.label}</button>
            ))}
            <button className="db-space-add">+ New Space</button>
          </div>
          <div className="db-right">
            <button className="db-btn">✎ Edit Layout</button>
            <button className="db-btn primary">+ Add Block</button>
            <div className="db-av">A</div>
          </div>
        </div>

        <div className="db-body">
          {/* ═══ Client Sidebar ═══ */}
          <div className="db-side">
            <div className="db-side-head">
              <span className="db-side-title">Clients</span>
              <button className="db-side-add">+</button>
            </div>
            <div className="db-side-list">
              {CLIENTS.map(c => (
                <div key={c.id} className={`db-cl${activeClient === c.id ? " on" : ""}`}
                  onClick={() => setActiveClient(c.id)}>
                  <div className="db-cl-av" style={{ background: c.color }}>
                    {c.av}
                    {c.unread > 0 && <span className="db-cl-unread">{c.unread}</span>}
                  </div>
                  <div className="db-cl-info">
                    <div className="db-cl-name">{c.name}</div>
                    <div className="db-cl-meta">
                      <div className="db-cl-dot" style={{ background: sc(c.status) }} />
                      <span>{c.status === "lead" ? "New lead" : `${c.projects} projects`}</span>
                    </div>
                  </div>
                  <div className="db-cl-right">
                    <div className="db-cl-earned">${(c.earned / 1000).toFixed(1)}k</div>
                    {c.owed > 0 && <div className="db-cl-owed">${(c.owed / 1000).toFixed(1)}k owed</div>}
                  </div>
                </div>
              ))}
            </div>
            <div className="db-side-foot">
              {CLIENTS.length} clients<br />
              ${(CLIENTS.reduce((s, c) => s + c.earned, 0) / 1000).toFixed(1)}k total earned
            </div>
          </div>

          {/* ═══ Canvas ═══ */}
          <div className="db-canvas">
            <div className="db-grid">

              {/* Row 1: Four stat blocks */}
              {[
                { label: "Earned this month", value: "$14,800", trend: "+12%", trendColor: "var(--sage)", bg: "var(--card)", tint: "var(--sage)", pattern: "dots" },
                { label: "Outstanding", value: "$9,600", trend: "3 invoices", trendColor: "var(--rose)", bg: "var(--card)", tint: "var(--rose)", pattern: "none" },
                { label: "Effective rate", value: "$108", unit: "/hr", sub: "Target: $150", bg: "var(--card-tint)", tint: "var(--lavender)", pattern: "lines" },
                { label: "Monthly goal", value: "74%", sub: "of $20,000", bg: "var(--card)", tint: "var(--ember)", pattern: "dots", isGoal: true },
              ].map((stat, i) => (
                <div key={i} className="bk"
                  style={{ background: stat.bg, gridColumn: "span 1", gridRow: "span 1" }}
                  onMouseEnter={() => setHovered(`stat${i}`)}
                  onMouseLeave={() => setHovered(null)}>
                  {stat.pattern !== "none" && <div className="bk-pattern" style={{ color: stat.tint }}><div className={`bk-pattern ${stat.pattern}`} style={{ color: stat.tint }} /></div>}
                  <div className="bk-in">
                    <div className="bk-label">{stat.label}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginTop: 6 }}>
                      <div className="bk-value" style={{ color: stat.tint }}>{stat.value}</div>
                      {stat.unit && <span style={{ fontFamily: "var(--mono)", fontSize: 16, color: stat.tint, opacity: .4 }}>{stat.unit}</span>}
                    </div>
                    {stat.trend && (
                      <div className="bk-sub">
                        <span className="bk-trend" style={{ color: stat.trendColor, background: stat.trendColor + "06", border: `1px solid ${stat.trendColor}08` }}>{stat.trend}</span>
                      </div>
                    )}
                    {stat.sub && <div className="bk-sub">{stat.sub}</div>}
                    {stat.isGoal && <div style={{ marginTop: 8 }}><div className="bk-bar"><div className="bk-bar-fill" style={{ width: "74%", background: stat.tint }} /></div></div>}
                  </div>
                  <div className="bk-line" style={{ background: stat.tint }} />
                </div>
              ))}

              {/* Row 2: AI Whisper — full width */}
              <div style={{ gridColumn: "span 4" }}>
                <div className="bk-whisper">
                  <span className="bk-whisper-badge">✦ AI</span>
                  <div className="bk-whisper-dot" style={{ background: w.color }} />
                  <div className="bk-whisper-text">{w.text}</div>
                  <button className="bk-whisper-action" onClick={() => setWhisperIdx(whisperIdx + 1)}>{w.action}</button>
                  <button className="bk-whisper-x" onClick={() => setWhisperIdx(whisperIdx + 1)}>✕</button>
                  <span className="bk-whisper-more">{whispers.length - 1} more</span>
                </div>
              </div>

              {/* Row 3: Milestones — full width */}
              <div className="bk" style={{ gridColumn: "span 4", gridRow: "span 1", background: "var(--card)" }}>
                <div className="bk-ms">
                  {milestones.map((m, i) => {
                    const c = m.done ? "var(--sage)" : m.active ? "var(--ember)" : "var(--ink-200)";
                    return (
                      <div key={i} className="bk-ms-node">
                        {i < milestones.length - 1 && <div className="bk-ms-line" style={{ background: m.done ? "var(--sage)" : "var(--border-light)" }} />}
                        <div className="bk-ms-dot" style={{
                          background: m.done ? c : m.active ? c : "var(--card)",
                          borderColor: c,
                          color: m.done || m.active ? "#fff" : "transparent",
                          boxShadow: m.active ? "0 0 0 4px var(--ember-bg)" : "none",
                        }}>{m.done ? "✓" : m.active ? "●" : ""}</div>
                        <div className="bk-ms-label" style={{ color: m.active ? "var(--ember)" : m.done ? "var(--ink-300)" : "var(--ink-300)" }}>{m.label}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="bk-line" style={{ background: "var(--ember)" }} />
              </div>

              {/* Row 4: Tasks (2 col) + Activity (1 col) + Health (1 col) */}
              <div className="bk" style={{ gridColumn: "span 2", gridRow: "span 2", background: "var(--card)" }}
                onMouseEnter={() => setHovered("tasks")} onMouseLeave={() => setHovered(null)}>
                <div className="bk-in">
                  <div className="bk-section-title">Active Tasks</div>
                  {tasks.map((t, i) => (
                    <div key={i} className="bk-task">
                      <div className="bk-task-pri" style={{ background: t.pColor }} />
                      <div className="bk-task-cb" />
                      <span className="bk-task-title">{t.title}</span>
                      <span className="bk-task-status" style={{ color: t.sColor, borderColor: t.sColor + "15", background: t.sColor + "04" }}>{t.status}</span>
                      <span className="bk-task-due">{t.due}</span>
                    </div>
                  ))}
                </div>
                <div className="bk-line" style={{ background: "var(--lavender)" }} />
              </div>

              <div className="bk" style={{ gridColumn: "span 1", gridRow: "span 2", background: "var(--card)" }}
                onMouseEnter={() => setHovered("activity")} onMouseLeave={() => setHovered(null)}>
                <div className="bk-in">
                  <div className="bk-section-title">Activity</div>
                  {activity.map((a, i) => (
                    <div key={i} className="bk-act">
                      <div className="bk-act-dot" style={{ background: a.dot }} />
                      <span className="bk-act-text">{a.text}</span>
                      <span className="bk-act-time">{a.time}</span>
                    </div>
                  ))}
                </div>
                <div className="bk-line" style={{ background: "var(--ember)" }} />
              </div>

              {/* Health — lavender tint */}
              <div className="bk" style={{ gridColumn: "span 1", gridRow: "span 2", background: "var(--card-tint)" }}
                onMouseEnter={() => setHovered("health")} onMouseLeave={() => setHovered(null)}>
                <div className="bk-pattern lines" style={{ color: "var(--lavender)" }} />
                <div className="bk-in">
                  <div className="bk-section-title" style={{ color: "var(--lavender)" }}>Client Health</div>
                  {CLIENTS.map((c, i) => (
                    <div key={i} className="bk-health">
                      <div className="bk-health-av" style={{ background: c.color }}>{c.av}</div>
                      <div className="bk-health-info">
                        <div className="bk-health-name">{c.name}</div>
                        <div className="bk-health-bar"><div style={{ width: `${c.health}%`, height: "100%", background: sc(c.status), borderRadius: 2, transition: "width .5s ease" }} /></div>
                      </div>
                      <span className="bk-health-val" style={{ color: sc(c.status) }}>{c.health || "—"}</span>
                    </div>
                  ))}
                </div>
                <div className="bk-line" style={{ background: "var(--lavender)" }} />
              </div>

              {/* Row 6: Timer + Hours + Invoices */}
              <div className="bk" style={{ gridColumn: "span 1", gridRow: "span 1", background: "var(--card)" }}
                onMouseEnter={() => setHovered("timer")} onMouseLeave={() => setHovered(null)}>
                <div className="bk-in">
                  <div className="bk-label">Color palette & typography</div>
                  <div className="bk-timer-val">1:22:00</div>
                  <div className="bk-timer-btns">
                    <button className={`bk-timer-btn${timerOn ? "" : " go"}`} onClick={() => setTimerOn(!timerOn)}>{timerOn ? "❚❚ Pause" : "▶ Start"}</button>
                    <button className="bk-timer-btn log">✓ Log</button>
                  </div>
                </div>
                <div className="bk-line" style={{ background: "var(--ink-300)" }} />
              </div>

              <div className="bk" style={{ gridColumn: "span 1", gridRow: "span 1", background: "var(--card-tint)" }}
                onMouseEnter={() => setHovered("hours")} onMouseLeave={() => setHovered(null)}>
                <div className="bk-pattern dots" style={{ color: "var(--lavender)" }} />
                <div className="bk-in">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div className="bk-label">This week</div>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "var(--ink-800)" }}>29.5h</span>
                  </div>
                  <div className="bk-hours">
                    {[{ d: "M", h: 6.5 }, { d: "T", h: 7 }, { d: "W", h: 5 }, { d: "T", h: 8 }, { d: "F", h: 3 }, { d: "S", h: 0 }, { d: "S", h: 0 }].map((d, i) => (
                      <div key={i} className="bk-hours-col">
                        <div className="bk-hours-bar"><div style={{ height: `${(d.h / 8) * 100}%`, background: d.h > 0 ? "var(--lavender)" : "transparent", borderRadius: 3, width: "100%", marginTop: "auto", transition: "height .4s ease", opacity: 0.5 }} /></div>
                        <span className="bk-hours-label">{d.d}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bk-line" style={{ background: "var(--lavender)" }} />
              </div>

              <div className="bk" style={{ gridColumn: "span 2", gridRow: "span 1", background: "var(--card)" }}
                onMouseEnter={() => setHovered("invoices")} onMouseLeave={() => setHovered(null)}>
                <div className="bk-in">
                  <div className="bk-section-title">Invoices</div>
                  {invoices.map((inv, i) => (
                    <div key={i} className="bk-inv">
                      <div className="bk-inv-info">
                        <span className="bk-inv-client">{inv.client}</span>
                        <span className="bk-inv-num">{inv.num}</span>
                      </div>
                      <span className="bk-inv-amount" style={{ color: inv.status === "overdue" ? "var(--rose)" : "var(--ink-800)" }}>{inv.amount}</span>
                      <span className="bk-inv-status" style={{ color: inv.sColor, borderColor: inv.sColor + "12", background: inv.sColor + "04" }}>{inv.status}</span>
                    </div>
                  ))}
                </div>
                <div className="bk-line" style={{ background: "var(--sage)" }} />
              </div>

            </div>
          </div>
        </div>

        <div className="db-foot">
          <span>◆ Felmark Workspace · Dashboard · {CLIENTS.length} clients</span>
          <span>Powered by @felmark/forge</span>
        </div>
      </div>
    </>
  );
}
