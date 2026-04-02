import { useState } from "react";

const CLIENTS = [
  { id: "meridian", name: "Meridian Studio", contact: "Sarah Chen", avatar: "M", color: "#7c8594", status: "active", statusLabel: "Active", projects: [{ name: "Brand Guidelines v2", progress: 67, dueIn: "5 days" }], earned: 12400, owed: 2400, lastActive: "2 min ago", activity: [{ text: "Sarah viewed your proposal", time: "2m", type: "view" }, { text: "Payment received — $1,800", time: "3h", type: "money" }, { text: "Comment on Brand Guidelines", time: "1d", type: "comment" }], health: 92, unread: 2 },
  { id: "nora", name: "Nora Kim", contact: "Nora Kim", avatar: "N", color: "#a08472", status: "active", statusLabel: "Active", projects: [{ name: "Course Landing Page", progress: 25, dueIn: "14 days" }, { name: "Email Sequence", progress: 0, dueIn: "21 days" }], earned: 8200, owed: 3200, lastActive: "1h ago", activity: [{ text: "Contract signed — $3,200", time: "1h", type: "money" }, { text: "New project added", time: "1d", type: "update" }], health: 88, unread: 0 },
  { id: "bolt", name: "Bolt Fitness", contact: "Jake Torres", avatar: "B", color: "#8a7e63", status: "overdue", statusLabel: "Overdue", projects: [{ name: "App Onboarding Flow", progress: 70, dueIn: "4d overdue" }, { name: "Monthly Blog Posts", progress: 40, dueIn: "8 days" }], earned: 6000, owed: 4000, lastActive: "3d ago", activity: [{ text: "Invoice overdue — $4,000", time: "4d", type: "alert" }, { text: "Deliverable submitted", time: "1w", type: "update" }], health: 45, unread: 1 },
  { id: "luna", name: "Luna Boutique", contact: "Maria Santos", avatar: "L", color: "#7c6b9e", status: "lead", statusLabel: "New lead", projects: [], earned: 0, owed: 0, lastActive: "New", activity: [{ text: "Inquiry received via form", time: "2h", type: "new" }], health: 0, unread: 1 },
];

function MiniRing({ pct, size = 24 }) {
  if (pct === 0) return <div style={{ width: size, height: size, borderRadius: "50%", border: "2px dashed var(--warm-300)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 7, color: "var(--ink-300)" }}>—</span></div>;
  const r = (size - 4) / 2, circ = 2 * Math.PI * r;
  const c = pct >= 80 ? "#5a9a3c" : pct >= 50 ? "#d97706" : "#c24b38";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--warm-200)" strokeWidth="2" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth="2" strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: "stroke-dashoffset .5s ease" }} />
    </svg>
  );
}

function Bar({ pct, color }) {
  return <div style={{ height: 3, background: "var(--warm-200)", borderRadius: 2, overflow: "hidden", flex: 1 }}><div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width .3s" }} /></div>;
}

export default function Workspace() {
  const [hov, setHov] = useState(null);
  const [searchOn, setSearchOn] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const totalEarned = CLIENTS.reduce((s, c) => s + c.earned, 0);
  const totalOwed = CLIENTS.reduce((s, c) => s + c.owed, 0);
  const sc = (s) => s === "active" ? "#5a9a3c" : s === "overdue" ? "#c24b38" : s === "lead" ? "#5b7fa4" : "var(--ink-300)";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.ws{font-family:'Outfit',sans-serif;background:var(--parchment);min-height:100vh;padding:24px 28px 60px}
.ws-in{max-width:1040px;margin:0 auto}

.ws-hd{margin-bottom:20px}
.ws-hd-top{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:14px}
.ws-greet{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;color:var(--ink-900);line-height:1.2}
.ws-greet em{color:var(--ember);font-style:normal}
.ws-hd-sub{font-family:var(--mono);font-size:10px;color:var(--ink-300);margin-top:2px}
.ws-hd-btn{padding:7px 16px;border-radius:7px;border:none;background:var(--ink-900);color:#fff;font-size:12px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .1s}
.ws-hd-btn:hover{background:var(--ink-800)}

.ws-search{display:flex;align-items:center;gap:8px;padding:8px 14px;background:#fff;border:1px solid var(--warm-200);border-radius:8px;transition:border-color .12s,box-shadow .12s}
.ws-search.on{border-color:var(--ember);box-shadow:0 0 0 3px var(--ember-bg)}
.ws-search input{flex:1;border:none;outline:none;font-size:13px;font-family:inherit;color:var(--ink-700);background:transparent}
.ws-search input::placeholder{color:var(--warm-400)}
.ws-search-hint{font-family:var(--mono);font-size:9px;color:var(--ink-300);background:var(--warm-100);padding:2px 6px;border-radius:3px}

.ws-stats{display:flex;gap:8px;margin-bottom:16px}
.ws-st{padding:12px 16px;background:#fff;border:1px solid var(--warm-200);border-radius:8px;flex:1;transition:all .1s;cursor:default}
.ws-st:hover{border-color:var(--warm-300);transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,0.02)}
.ws-st-val{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;line-height:1}
.ws-st-lb{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em;margin-top:2px}

/* Onboarding */
.ws-hint{background:#fff;border:1px solid var(--warm-200);border-radius:10px;padding:14px 18px;margin-bottom:16px;display:flex;align-items:center;gap:12px;position:relative}
.ws-hint-icon{width:32px;height:32px;border-radius:8px;background:var(--ember-bg);border:1px solid rgba(176,125,79,0.06);display:flex;align-items:center;justify-content:center;color:var(--ember);font-size:12px;flex-shrink:0}
.ws-hint-body{flex:1}
.ws-hint-title{font-size:13px;font-weight:500;color:var(--ink-800);margin-bottom:1px}
.ws-hint-text{font-size:12px;color:var(--ink-400);line-height:1.5}
.ws-hint-text b{color:var(--ink-600);font-weight:500}
.ws-hint-close{position:absolute;top:8px;right:10px;border:none;background:none;color:var(--ink-300);cursor:pointer;font-size:12px}

.ws-sec{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.ws-sec-title{font-size:15px;font-weight:500;color:var(--ink-800);display:flex;align-items:center;gap:6px}
.ws-sec-count{font-family:var(--mono);font-size:10px;color:var(--ink-300);background:var(--warm-100);padding:1px 7px;border-radius:10px}

/* Grid */
.ws-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}

.ws-card{background:#fff;border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;cursor:pointer;transition:all .15s}
.ws-card:hover{border-color:var(--warm-300);transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.03)}

.ws-card-hd{padding:14px 16px 10px;display:flex;align-items:center;gap:12px}
.ws-card-av{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:600;color:#fff;flex-shrink:0;position:relative}
.ws-card-unread{position:absolute;top:-3px;right:-3px;min-width:15px;height:15px;border-radius:8px;background:#c24b38;color:#fff;font-size:8px;font-weight:600;display:flex;align-items:center;justify-content:center;border:2px solid #fff}
.ws-card-info{flex:1;min-width:0}
.ws-card-name{font-size:15px;font-weight:500;color:var(--ink-900)}
.ws-card-contact{font-size:11px;color:var(--ink-400)}
.ws-card-r{display:flex;flex-direction:column;align-items:flex-end;gap:2px;flex-shrink:0}
.ws-card-badge{font-family:var(--mono);font-size:9px;font-weight:500;padding:2px 8px;border-radius:4px;display:flex;align-items:center;gap:4px;border:1px solid}
.ws-card-badge-dot{width:4px;height:4px;border-radius:50%}
.ws-card-active{font-family:var(--mono);font-size:9px;color:var(--ink-300)}

.ws-card-body{padding:0 16px 12px}

/* Projects */
.ws-card-proj{display:flex;align-items:center;gap:8px;padding:5px 0}
.ws-card-proj+.ws-card-proj{border-top:1px solid var(--warm-100)}
.ws-card-proj-info{flex:1;min-width:0}
.ws-card-proj-name{font-size:12px;font-weight:500;color:var(--ink-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ws-card-proj-bar{display:flex;align-items:center;gap:6px;margin-top:2px}
.ws-card-proj-due{font-family:var(--mono);font-size:9px;flex-shrink:0}
.ws-card-proj-pct{font-family:var(--mono);font-size:10px;font-weight:500;width:28px;text-align:right;flex-shrink:0}

.ws-card-empty{padding:10px 0;text-align:center}
.ws-card-empty-text{font-size:12px;color:var(--ink-400);margin-bottom:6px}
.ws-card-empty-btn{padding:5px 12px;border-radius:5px;border:1px dashed var(--warm-300);background:transparent;font-size:11px;font-family:inherit;color:var(--ink-400);cursor:pointer;transition:all .08s}
.ws-card-empty-btn:hover{border-color:var(--ember);color:var(--ember);background:var(--ember-bg)}

.ws-card-money{display:flex;gap:5px;margin:8px 0}
.ws-card-money-item{flex:1;padding:7px 10px;background:var(--warm-50);border-radius:6px;border:1px solid var(--warm-100)}
.ws-card-money-val{font-family:var(--mono);font-size:14px;font-weight:600;line-height:1}
.ws-card-money-lb{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;margin-top:2px}

.ws-card-acts{border-top:1px solid var(--warm-100);padding-top:6px}
.ws-card-act{display:flex;align-items:center;gap:5px;padding:2px 0;font-size:11px;color:var(--ink-500)}
.ws-card-act-dot{width:4px;height:4px;border-radius:50%;flex-shrink:0}
.ws-card-act-text{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ws-card-act-time{font-family:var(--mono);font-size:9px;color:var(--ink-300);flex-shrink:0}

.ws-card-ft{padding:8px 16px;border-top:1px solid var(--warm-100);display:flex;justify-content:space-between;align-items:center}
.ws-card-ft-health{display:flex;align-items:center;gap:4px;font-family:var(--mono);font-size:10px}
.ws-card-ft-btns{display:flex;gap:3px}
.ws-card-ft-btn{padding:4px 10px;border-radius:4px;border:1px solid var(--warm-200);background:#fff;font-size:10px;font-family:inherit;color:var(--ink-400);cursor:pointer;transition:all .06s}
.ws-card-ft-btn:hover{background:var(--warm-50);color:var(--ink-600)}
.ws-card-ft-btn.acc{color:var(--ember);border-color:rgba(176,125,79,0.1);background:var(--ember-bg)}
.ws-card-ft-btn.acc:hover{background:rgba(176,125,79,0.12)}

.ws-add{background:var(--warm-50);border:2px dashed var(--warm-300);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:36px 20px;cursor:pointer;transition:all .12s;min-height:180px}
.ws-add:hover{border-color:var(--ember);background:var(--ember-bg)}
.ws-add-icon{width:36px;height:36px;border-radius:9px;background:#fff;border:1px solid var(--warm-200);display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--ink-300);margin-bottom:6px;transition:all .12s}
.ws-add:hover .ws-add-icon{border-color:var(--ember);color:var(--ember)}
.ws-add-text{font-size:13px;font-weight:500;color:var(--ink-400)}
.ws-add:hover .ws-add-text{color:var(--ember)}
.ws-add-sub{font-size:10px;color:var(--ink-300);margin-top:1px}
      `}</style>

      <div className="ws"><div className="ws-in">
        {/* Header */}
        <div className="ws-hd">
          <div className="ws-hd-top">
            <div>
              <div className="ws-greet">{greet}, Alex. <em>Let's build.</em></div>
              <div className="ws-hd-sub">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · {CLIENTS.length} clients · {CLIENTS.reduce((s, c) => s + c.projects.length, 0)} projects</div>
            </div>
            <button className="ws-hd-btn">+ New Client</button>
          </div>
          <div className={`ws-search${searchOn ? " on" : ""}`}>
            <span style={{ color: "var(--ink-300)", fontSize: 13 }}>⌕</span>
            <input placeholder="Search clients, projects, invoices..." onFocus={() => setSearchOn(true)} onBlur={() => setSearchOn(false)} />
            <span className="ws-search-hint">⌘K</span>
          </div>
        </div>

        {/* Stats */}
        <div className="ws-stats">
          <div className="ws-st"><div className="ws-st-val" style={{ color: "#5a9a3c" }}>${totalEarned.toLocaleString()}</div><div className="ws-st-lb">Total earned</div></div>
          <div className="ws-st"><div className="ws-st-val" style={{ color: totalOwed > 0 ? "var(--ember)" : "var(--ink-300)" }}>${totalOwed.toLocaleString()}</div><div className="ws-st-lb">Outstanding</div></div>
          <div className="ws-st"><div className="ws-st-val" style={{ color: "var(--ink-900)" }}>{CLIENTS.filter(c => c.status === "active").length}</div><div className="ws-st-lb">Active clients</div></div>
          <div className="ws-st"><div className="ws-st-val" style={{ color: CLIENTS.some(c => c.status === "overdue") ? "#c24b38" : "var(--ink-300)" }}>{CLIENTS.filter(c => c.status === "overdue").length}</div><div className="ws-st-lb">Need attention</div></div>
        </div>

        {/* Onboarding */}
        {showHint && (
          <div className="ws-hint">
            <div className="ws-hint-icon">✦</div>
            <div className="ws-hint-body">
              <div className="ws-hint-title">Welcome to your workspace</div>
              <div className="ws-hint-text">Each client has their own card. Click <b>Open →</b> to enter their <b>Workstation</b> — the full power editor with proposals, invoices, terminal, and AI. Press <b>⌘K</b> to search anything.</div>
            </div>
            <button className="ws-hint-close" onClick={() => setShowHint(false)}>✕</button>
          </div>
        )}

        {/* Section */}
        <div className="ws-sec">
          <div className="ws-sec-title">Clients <span className="ws-sec-count">{CLIENTS.length}</span></div>
        </div>

        {/* Grid */}
        <div className="ws-grid">
          {CLIENTS.map(client => {
            const sColor = sc(client.status);
            return (
              <div key={client.id} className="ws-card" onMouseEnter={() => setHov(client.id)} onMouseLeave={() => setHov(null)}>
                <div className="ws-card-hd">
                  <div className="ws-card-av" style={{ background: client.color }}>
                    {client.avatar}
                    {client.unread > 0 && <span className="ws-card-unread">{client.unread}</span>}
                  </div>
                  <div className="ws-card-info">
                    <div className="ws-card-name">{client.name}</div>
                    <div className="ws-card-contact">{client.contact}</div>
                  </div>
                  <div className="ws-card-r">
                    <div className="ws-card-badge" style={{ color: sColor, borderColor: sColor + "20", background: sColor + "06" }}>
                      <div className="ws-card-badge-dot" style={{ background: sColor }} />
                      {client.statusLabel}
                    </div>
                    <div className="ws-card-active">{client.lastActive}</div>
                  </div>
                </div>

                <div className="ws-card-body">
                  {client.projects.length > 0 ? (
                    <div>
                      {client.projects.map((p, i) => {
                        const pc = p.dueIn.includes("overdue") ? "#c24b38" : p.progress >= 60 ? "#5a9a3c" : "var(--ember)";
                        return (
                          <div key={i} className="ws-card-proj">
                            <div className="ws-card-proj-info">
                              <div className="ws-card-proj-name">{p.name}</div>
                              <div className="ws-card-proj-bar">
                                <Bar pct={p.progress} color={pc} />
                                <span className="ws-card-proj-due" style={{ color: p.dueIn.includes("overdue") ? "#c24b38" : "var(--ink-300)" }}>{p.dueIn}</span>
                              </div>
                            </div>
                            <span className="ws-card-proj-pct" style={{ color: pc }}>{p.progress}%</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="ws-card-empty">
                      <div className="ws-card-empty-text">No projects yet</div>
                      <button className="ws-card-empty-btn">+ Create first project</button>
                    </div>
                  )}

                  {(client.earned > 0 || client.owed > 0) && (
                    <div className="ws-card-money">
                      <div className="ws-card-money-item"><div className="ws-card-money-val" style={{ color: "#5a9a3c" }}>${client.earned.toLocaleString()}</div><div className="ws-card-money-lb">Earned</div></div>
                      <div className="ws-card-money-item"><div className="ws-card-money-val" style={{ color: client.owed > 0 ? "var(--ember)" : "var(--ink-300)" }}>${client.owed.toLocaleString()}</div><div className="ws-card-money-lb">Owed</div></div>
                    </div>
                  )}

                  <div className="ws-card-acts">
                    {client.activity.slice(0, 3).map((a, i) => {
                      const dc = a.type === "money" ? "#5a9a3c" : a.type === "alert" ? "#c24b38" : a.type === "view" ? "#5b7fa4" : a.type === "new" ? "#7c6b9e" : "var(--warm-400)";
                      return (
                        <div key={i} className="ws-card-act">
                          <div className="ws-card-act-dot" style={{ background: dc }} />
                          <span className="ws-card-act-text">{a.text}</span>
                          <span className="ws-card-act-time">{a.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="ws-card-ft">
                  <div className="ws-card-ft-health" style={{ color: client.health >= 80 ? "#5a9a3c" : client.health >= 50 ? "#d97706" : client.health > 0 ? "#c24b38" : "var(--ink-300)" }}>
                    <MiniRing pct={client.health} />
                    {client.health > 0 && <span>{client.health}%</span>}
                  </div>
                  <div className="ws-card-ft-btns">
                    {client.status === "lead" ? <button className="ws-card-ft-btn">Proposal</button> : <button className="ws-card-ft-btn">Invoice</button>}
                    <button className="ws-card-ft-btn acc">Open →</button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="ws-add">
            <div className="ws-add-icon">+</div>
            <div className="ws-add-text">Add a new client</div>
            <div className="ws-add-sub">⌘N</div>
          </div>
        </div>
      </div></div>
    </>
  );
}
