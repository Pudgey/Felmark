import { useState } from "react";

/* ═══════════════════════════════════════════
   FELMARK — WORK BLOCKS
   3 blocks that run your business.
   Task Board. Pipeline. Automations.
   ═══════════════════════════════════════════ */

// ── 1. Task Board ──
function TaskBoard() {
  const [view, setView] = useState("board");
  const [expanded, setExpanded] = useState(new Set(["t3", "t6"]));
  const [hovTask, setHovTask] = useState(null);

  const columns = [
    { id: "todo", label: "To Do", color: "#7d7db0", tasks: [
      { id: "t4", title: "Brand guidelines document", client: "Meridian", clientColor: "#6a7b8a", priority: "medium", priColor: "#7d7db0", due: "Apr 5", est: "16h", logged: "0h", subtasks: [{ t: "Cover & TOC", d: false }, { t: "Logo usage rules", d: false }, { t: "Color specs", d: false }, { t: "Typography scales", d: false }, { t: "Photo direction", d: false }, { t: "Social guidelines", d: false }], comments: 0, files: 0 },
      { id: "t5", title: "Social media template kit", client: "Meridian", clientColor: "#6a7b8a", priority: "low", priColor: "#9b988f", due: "Apr 10", est: "8h", logged: "0h", subtasks: [{ t: "IG posts (4×)", d: false }, { t: "IG stories (4×)", d: false }, { t: "LinkedIn (2×)", d: false }], comments: 0, files: 0 },
    ]},
    { id: "progress", label: "In Progress", color: "#a87444", tasks: [
      { id: "t3", title: "Color palette & typography system", client: "Meridian", clientColor: "#6a7b8a", priority: "high", priColor: "#a87444", due: "Apr 2", est: "6h", logged: "3h", subtasks: [{ t: "Primary palette (5 colors)", d: true }, { t: "Secondary & accents", d: false }, { t: "Heading font pairing", d: true }, { t: "Body & mono selection", d: false }], comments: 3, files: 1, active: true },
      { id: "t7", title: "Blog content series", client: "Bolt Fitness", clientColor: "#8a7e5a", priority: "medium", priColor: "#7d7db0", due: "Apr 8", est: "12h", logged: "4h", subtasks: [{ t: "Outline 5 posts", d: true }, { t: "Draft post #1", d: false }, { t: "Draft post #2", d: false }], comments: 0, files: 0 },
    ]},
    { id: "review", label: "Review", color: "#7d7db0", tasks: [
      { id: "t6", title: "Client review & revisions", client: "Meridian", clientColor: "#6a7b8a", priority: "urgent", priColor: "#b46e5e", due: "Apr 1", est: "4h", logged: "1.5h", subtasks: [{ t: "Address color feedback", d: false }, { t: "Revise teal → warmer", d: false }, { t: "CEO sign-off on logo", d: false }], comments: 5, files: 2, overdue: true },
    ]},
    { id: "done", label: "Done", color: "#5e8f5e", tasks: [
      { id: "t1", title: "Discovery & brand audit", client: "Meridian", clientColor: "#6a7b8a", priority: "high", priColor: "#a87444", due: "Mar 20", est: "8h", logged: "7.5h", subtasks: [{ t: "Competitive analysis", d: true }, { t: "Stakeholder interviews", d: true }, { t: "Brand inventory", d: true }], done: true },
      { id: "t2", title: "Logo concept exploration", client: "Meridian", clientColor: "#6a7b8a", priority: "high", priColor: "#a87444", due: "Mar 25", est: "12h", logged: "14h", subtasks: [{ t: "Moodboard", d: true }, { t: "Concept A", d: true }, { t: "Concept B", d: true }, { t: "Concept C", d: true }], done: true, overLogged: true },
    ]},
  ];

  const totalTasks = columns.reduce((s, c) => s + c.tasks.length, 0);
  const doneTasks = columns.find(c => c.id === "done")?.tasks.length || 0;
  const totalLogged = columns.reduce((s, c) => s + c.tasks.reduce((ss, t) => ss + parseFloat(t.logged), 0), 0);
  const totalEst = columns.reduce((s, c) => s + c.tasks.reduce((ss, t) => ss + parseFloat(t.est), 0), 0);

  const toggleExp = (id) => setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="wb">
      {/* Header */}
      <div className="wb-hd">
        <div className="wb-hd-left">
          <div className="wb-title">Tasks</div>
          <div className="wb-metrics">
            <div className="wb-metric"><span className="wb-metric-val">{doneTasks}/{totalTasks}</span><span className="wb-metric-lb">complete</span></div>
            <div className="wb-metric-bar"><div style={{ width: `${(doneTasks / totalTasks) * 100}%`, background: "var(--sg)" }} /></div>
            <div className="wb-metric"><span className="wb-metric-val">{totalLogged}h</span><span className="wb-metric-lb">of {totalEst}h</span></div>
          </div>
        </div>
        <div className="wb-hd-right">
          <div className="wb-views">{[{ id: "board", lb: "Board" }, { id: "list", lb: "List" }].map(v => (
            <button key={v.id} className={`wb-view${view === v.id ? " on" : ""}`} onClick={() => setView(v.id)}>{v.lb}</button>
          ))}</div>
          <button className="wb-add-btn">+ Task</button>
        </div>
      </div>

      {/* Board view */}
      {view === "board" && (
        <div className="wb-board">
          {columns.map(col => (
            <div key={col.id} className="wb-col">
              <div className="wb-col-hd">
                <div className="wb-col-dot" style={{ background: col.color }} />
                <span className="wb-col-name" style={{ color: col.color }}>{col.label}</span>
                <span className="wb-col-count">{col.tasks.length}</span>
                <span className="wb-col-spacer" />
                <button className="wb-col-add">+</button>
              </div>
              <div className="wb-col-cards">
                {col.tasks.map(task => {
                  const subsDone = task.subtasks.filter(s => s.d).length;
                  const subsTotal = task.subtasks.length;
                  const isExp = expanded.has(task.id);
                  const timeRatio = parseFloat(task.est) > 0 ? parseFloat(task.logged) / parseFloat(task.est) : 0;

                  return (
                    <div key={task.id} className={`wb-card${task.done ? " done" : ""}${hovTask === task.id ? " hov" : ""}${task.overdue ? " overdue" : ""}`}
                      onMouseEnter={() => setHovTask(task.id)} onMouseLeave={() => setHovTask(null)}>
                      {/* Priority strip */}
                      <div className="wb-card-pri" style={{ background: task.priColor }} />

                      {/* Content */}
                      <div className="wb-card-body">
                        {/* Top row: client + due */}
                        <div className="wb-card-top">
                          <span className="wb-card-client" style={{ color: task.clientColor }}>{task.client}</span>
                          <span className={`wb-card-due${task.overdue ? " late" : ""}`}>{task.due}</span>
                        </div>

                        {/* Title */}
                        <div className={`wb-card-title${task.done ? " done" : ""}`}>{task.title}</div>

                        {/* Subtask progress */}
                        {subsTotal > 0 && (
                          <div className="wb-card-subs">
                            <div className="wb-card-sub-bar"><div style={{ width: `${(subsDone / subsTotal) * 100}%`, background: subsDone === subsTotal ? "var(--sg)" : col.color }} /></div>
                            <span className="wb-card-sub-count" style={{ color: subsDone === subsTotal ? "var(--sg)" : "var(--i3)" }}>{subsDone}/{subsTotal}</span>
                            {subsTotal > 0 && <button className="wb-card-sub-toggle" onClick={() => toggleExp(task.id)}>{isExp ? "▾" : "▸"}</button>}
                          </div>
                        )}

                        {/* Expanded subtasks */}
                        {isExp && (
                          <div className="wb-card-sub-list">
                            {task.subtasks.map((sub, si) => (
                              <div key={si} className={`wb-card-sub-item${sub.d ? " done" : ""}`}>
                                <div className={`wb-card-sub-cb${sub.d ? " on" : ""}`}>{sub.d ? "✓" : ""}</div>
                                <span>{sub.t}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Footer row: time + comments + files + timer */}
                        <div className="wb-card-foot">
                          <div className="wb-card-time">
                            <span className={`wb-card-logged${task.overLogged ? " over" : ""}`}>{task.logged}</span>
                            <span className="wb-card-est">/{task.est}</span>
                          </div>
                          {task.comments > 0 && <span className="wb-card-badge comment">◇ {task.comments}</span>}
                          {task.files > 0 && <span className="wb-card-badge file">◻ {task.files}</span>}
                          <span className="wb-card-foot-spacer" />
                          {task.active && <span className="wb-card-active-dot" />}
                          {!task.done && <button className="wb-card-timer-btn">▶</button>}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* Drop zone */}
                <div className="wb-col-drop">Drop here</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="wb-list">
          {columns.filter(c => c.id !== "done").map(col => (
            <div key={col.id} className="wb-list-group">
              <div className="wb-list-group-hd"><div className="wb-col-dot" style={{ background: col.color }} /><span style={{ color: col.color }}>{col.label}</span><span className="wb-col-count">{col.tasks.length}</span><div className="wb-list-line" /></div>
              {col.tasks.map(task => {
                const subsDone = task.subtasks.filter(s => s.d).length;
                const subsTotal = task.subtasks.length;
                return (
                  <div key={task.id} className={`wb-list-row${task.overdue ? " overdue" : ""}`}
                    onMouseEnter={() => setHovTask(task.id)} onMouseLeave={() => setHovTask(null)}>
                    <div className="wb-list-pri" style={{ background: task.priColor }} />
                    <div className="wb-list-cb" />
                    <div className="wb-list-info">
                      <div className="wb-list-title">{task.title}</div>
                      <div className="wb-list-meta"><span style={{ color: task.clientColor }}>{task.client}</span>{subsTotal > 0 && <span>{subsDone}/{subsTotal} subtasks</span>}</div>
                    </div>
                    <span className={`wb-list-due${task.overdue ? " late" : ""}`}>{task.due}</span>
                    <span className="wb-list-time">{task.logged}<span className="wb-list-est">/{task.est}</span></span>
                    <span className="wb-list-priority" style={{ color: task.priColor, background: task.priColor + "06", borderColor: task.priColor + "12" }}>{task.priority}</span>
                    <button className="wb-list-timer">▶</button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 2. Pipeline ──
function PipelineBlock() {
  const [hovDeal, setHovDeal] = useState(null);
  const stages = [
    { id: "inquiry", label: "Inquiry", color: "#7d7db0", deals: [
      { id: "d1", name: "Luna Boutique", project: "Brand Identity + Packaging", value: 6500, contact: "Maria Santos", days: 2, temp: "warm", probability: 40 },
      { id: "d2", name: "Skyline Co", project: "Website Redesign", value: 3200, contact: "Tom Parker", days: 5, temp: "cool", probability: 20 },
    ]},
    { id: "proposal", label: "Proposal", color: "#a87444", deals: [
      { id: "d3", name: "Meridian Studio", project: "Brand Guidelines v2", value: 4800, contact: "Sarah Chen", days: 4, temp: "hot", probability: 75, viewed: 3 },
    ]},
    { id: "active", label: "Active", color: "#5e8f5e", deals: [
      { id: "d4", name: "Nora Kim", project: "Course Landing Page", value: 3200, contact: "Nora Kim", pct: 25, color: "#9a8472" },
      { id: "d5", name: "Bolt Fitness", project: "App Onboarding UX", value: 4000, contact: "Jake Torres", pct: 70, color: "#8a7e5a", overdue: true },
      { id: "d6", name: "Bolt Fitness", project: "Blog Content", value: 3000, contact: "Jake Torres", pct: 40, color: "#8a7e5a" },
    ]},
  ];

  const totalValue = stages.reduce((s, st) => s + st.deals.reduce((ss, d) => ss + d.value, 0), 0);
  const weightedValue = stages.reduce((s, st) => s + st.deals.reduce((ss, d) => ss + d.value * ((d.probability || (d.pct ? 90 : 50)) / 100), 0), 0);

  return (
    <div className="wb">
      <div className="wb-hd">
        <div className="wb-hd-left">
          <div className="wb-title">Pipeline</div>
          <div className="wb-metrics">
            <div className="wb-metric"><span className="wb-metric-val">${(totalValue / 1000).toFixed(1)}k</span><span className="wb-metric-lb">total</span></div>
            <div className="wb-metric"><span className="wb-metric-val">${(weightedValue / 1000).toFixed(1)}k</span><span className="wb-metric-lb">weighted</span></div>
            <div className="wb-metric"><span className="wb-metric-val">{stages.reduce((s, st) => s + st.deals.length, 0)}</span><span className="wb-metric-lb">deals</span></div>
          </div>
        </div>
      </div>

      {/* Funnel visualization */}
      <div className="wb-funnel">
        {stages.map((st, i) => {
          const stageValue = st.deals.reduce((s, d) => s + d.value, 0);
          return (
            <div key={st.id} className="wb-funnel-stage">
              <div className="wb-funnel-bar" style={{ background: st.color }} />
              <div className="wb-funnel-label" style={{ color: st.color }}>{st.label}</div>
              <div className="wb-funnel-value">${(stageValue / 1000).toFixed(1)}k</div>
              <div className="wb-funnel-count">{st.deals.length} deal{st.deals.length !== 1 ? "s" : ""}</div>
              {i < stages.length - 1 && <div className="wb-funnel-arrow">→</div>}
            </div>
          );
        })}
      </div>

      {/* Deal columns */}
      <div className="wb-deals">
        {stages.map(st => (
          <div key={st.id} className="wb-deal-col">
            {st.deals.map(deal => (
              <div key={deal.id} className={`wb-deal${hovDeal === deal.id ? " hov" : ""}${deal.overdue ? " overdue" : ""}`}
                onMouseEnter={() => setHovDeal(deal.id)} onMouseLeave={() => setHovDeal(null)}>
                <div className="wb-deal-accent" style={{ background: st.color }} />
                <div className="wb-deal-body">
                  <div className="wb-deal-top">
                    <span className="wb-deal-name">{deal.name}</span>
                    <span className="wb-deal-value" style={{ color: st.color }}>${deal.value.toLocaleString()}</span>
                  </div>
                  <div className="wb-deal-project">{deal.project}</div>

                  {/* Stage-specific content */}
                  {deal.probability !== undefined && (
                    <div className="wb-deal-prob">
                      <div className="wb-deal-prob-bar"><div style={{ width: `${deal.probability}%`, background: st.color }} /></div>
                      <span className="wb-deal-prob-val" style={{ color: st.color }}>{deal.probability}%</span>
                      {deal.viewed && <span className="wb-deal-viewed">Viewed {deal.viewed}×</span>}
                    </div>
                  )}
                  {deal.pct !== undefined && (
                    <div className="wb-deal-prob">
                      <div className="wb-deal-prob-bar"><div style={{ width: `${deal.pct}%`, background: deal.overdue ? "var(--rs)" : st.color }} /></div>
                      <span className="wb-deal-prob-val" style={{ color: deal.overdue ? "var(--rs)" : st.color }}>{deal.pct}%</span>
                    </div>
                  )}

                  <div className="wb-deal-foot">
                    <span className="wb-deal-contact">{deal.contact}</span>
                    {deal.days !== undefined && <span className="wb-deal-age">{deal.days}d ago</span>}
                    {deal.temp && <span className={`wb-deal-temp ${deal.temp}`}>{deal.temp}</span>}
                    {deal.overdue && <span className="wb-deal-overdue-badge">overdue</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 3. Automations ──
function AutomationsBlock() {
  const [activeRule, setActiveRule] = useState("a1");
  const rules = [
    { id: "a1", trigger: "All concept tasks marked done", action: "Send milestone update to Sarah", icon: "✉", color: "#5e8f5e", status: "fired", statusLabel: "Fired 3h ago", triggerType: "task_status", actionType: "email",
      log: [{ text: "Triggered: 3 tasks completed", time: "3h ago" }, { text: "Email sent to sarah@meridian.co", time: "3h ago" }, { text: "Email opened", time: "2h ago" }] },
    { id: "a2", trigger: "Project reaches 50% completion", action: "Auto-draft invoice for $2,400", icon: "$", color: "#a87444", status: "ready", statusLabel: "Ready — project at 48%", triggerType: "project_pct", actionType: "invoice",
      log: [{ text: "Watching: Brand Guidelines v2", time: "Active" }, { text: "Current progress: 48%", time: "2% to trigger" }] },
    { id: "a3", trigger: "Deliverable submitted + 3 days", action: "Send review reminder to client", icon: "◎", color: "#7d7db0", status: "scheduled", statusLabel: "Fires Apr 4", triggerType: "time_delay", actionType: "email",
      log: [{ text: "Deliverable submitted Mar 29", time: "3d ago" }, { text: "Reminder scheduled", time: "Apr 4" }] },
    { id: "a4", trigger: "Invoice overdue by 7+ days", action: "Send formal payment reminder", icon: "!", color: "#b46e5e", status: "watching", statusLabel: "Watching INV-047 (4d)", triggerType: "invoice_status", actionType: "email",
      log: [{ text: "INV-047 sent to Bolt Fitness", time: "Mar 25" }, { text: "Due date: Apr 1 (passed)", time: "4d ago" }, { text: "Trigger fires at 7d", time: "3 days left" }] },
  ];

  const activeR = rules.find(r => r.id === activeRule);
  const statusColor = (s) => s === "fired" ? "var(--sg)" : s === "ready" ? "var(--em)" : s === "scheduled" ? "var(--lv)" : "var(--rs)";

  return (
    <div className="wb">
      <div className="wb-hd">
        <div className="wb-hd-left">
          <div className="wb-title">Automations</div>
          <div className="wb-metrics">
            <div className="wb-metric"><span className="wb-metric-val">{rules.length}</span><span className="wb-metric-lb">rules</span></div>
            <div className="wb-metric"><span className="wb-metric-val" style={{ color: "var(--sg)" }}>{rules.filter(r => r.status === "fired").length}</span><span className="wb-metric-lb">fired</span></div>
            <div className="wb-metric"><span className="wb-metric-val" style={{ color: "var(--rs)" }}>{rules.filter(r => r.status === "watching").length}</span><span className="wb-metric-lb">watching</span></div>
          </div>
        </div>
        <button className="wb-add-btn">+ Add Rule</button>
      </div>

      <div className="wb-auto-split">
        {/* Rule list */}
        <div className="wb-auto-list">
          {rules.map(rule => (
            <div key={rule.id} className={`wb-auto-rule${activeRule === rule.id ? " on" : ""}`}
              onClick={() => setActiveRule(rule.id)}>
              <div className="wb-auto-icon" style={{ color: rule.color, background: rule.color + "08", borderColor: rule.color + "12" }}>{rule.icon}</div>
              <div className="wb-auto-info">
                <div className="wb-auto-trigger">{rule.trigger}</div>
                <div className="wb-auto-action">→ {rule.action}</div>
              </div>
              <div className="wb-auto-status-col">
                <span className="wb-auto-status-dot" style={{ background: statusColor(rule.status) }} />
                <span className="wb-auto-status-lb" style={{ color: statusColor(rule.status) }}>{rule.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {activeR && (
          <div className="wb-auto-detail">
            <div className="wb-auto-det-hd">
              <div className="wb-auto-det-icon" style={{ color: activeR.color, background: activeR.color + "08", borderColor: activeR.color + "12" }}>{activeR.icon}</div>
              <div>
                <div className="wb-auto-det-status" style={{ color: statusColor(activeR.status) }}>{activeR.statusLabel}</div>
              </div>
            </div>

            {/* Visual flow */}
            <div className="wb-auto-flow">
              <div className="wb-auto-flow-node trigger">
                <div className="wb-auto-flow-lb">When</div>
                <div className="wb-auto-flow-text">{activeR.trigger}</div>
                <span className="wb-auto-flow-type">{activeR.triggerType.replace("_", " ")}</span>
              </div>
              <div className="wb-auto-flow-arrow">↓</div>
              <div className="wb-auto-flow-node action">
                <div className="wb-auto-flow-lb">Then</div>
                <div className="wb-auto-flow-text">{activeR.action}</div>
                <span className="wb-auto-flow-type">{activeR.actionType}</span>
              </div>
            </div>

            {/* Activity log */}
            <div className="wb-auto-log">
              <div className="wb-auto-log-lb">Activity Log</div>
              {activeR.log.map((entry, i) => (
                <div key={i} className="wb-auto-log-row">
                  <div className="wb-auto-log-dot" style={{ background: i === 0 ? activeR.color : "var(--i2)" }} />
                  <span className="wb-auto-log-text">{entry.text}</span>
                  <span className="wb-auto-log-time">{entry.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Showcase ──
export default function WorkBlocks() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#edeae5;--card:#fff;--tint:#f8f7f4;--bd:#ddd9d2;--bdl:#ebe8e2;--i9:#252320;--i8:#363330;--i7:#4a4743;--i6:#5e5b56;--i5:#7a7772;--i4:#9b988f;--i3:#b5b2a9;--i2:#d0cdc6;--em:#a87444;--embg:rgba(168,116,68,.04);--sg:#5e8f5e;--sgbg:rgba(94,143,94,.04);--lv:#7d7db0;--lvbg:rgba(125,125,176,.03);--rs:#b46e5e;--rsbg:rgba(180,110,94,.04);--mono:'JetBrains Mono',monospace}
.pg{font-family:'DM Sans',sans-serif;background:var(--bg);min-height:100vh;padding:48px 24px 80px}
.pg-in{max-width:860px;margin:0 auto}
.pg-hd{margin-bottom:36px}.pg-eye{font-family:var(--mono);font-size:10px;color:var(--em);text-transform:uppercase;letter-spacing:.14em;margin-bottom:6px}
.pg-t{font-family:'Fraunces',serif;font-size:36px;font-weight:600;color:var(--i9);margin-bottom:6px}.pg-t em{font-style:italic;color:var(--em)}
.pg-sub{font-size:15px;color:var(--i4);line-height:1.6}
.pg-lb{font-family:var(--mono);font-size:9px;color:var(--i3);text-transform:uppercase;letter-spacing:.06em;margin:36px 0 12px 2px;display:flex;align-items:center;gap:8px}.pg-lb::after{content:'';flex:1;height:1px;background:var(--bdl)}

/* ═══ SHARED ═══ */
.wb{background:var(--card);border:1px solid var(--bd);border-radius:20px;overflow:hidden;transition:all .18s cubic-bezier(.16,1,.3,1)}.wb:hover{box-shadow:0 12px 40px rgba(0,0,0,.04)}
.wb-hd{padding:20px 24px 14px;display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid var(--bdl)}
.wb-hd-left{}.wb-hd-right{display:flex;gap:6px;align-items:center}
.wb-title{font-family:'Fraunces',serif;font-size:22px;font-weight:600;color:var(--i9)}
.wb-metrics{display:flex;align-items:center;gap:12px;margin-top:6px}
.wb-metric{display:flex;align-items:baseline;gap:4px}
.wb-metric-val{font-family:var(--mono);font-size:13px;font-weight:500;color:var(--i7)}
.wb-metric-lb{font-family:var(--mono);font-size:10px;color:var(--i3)}
.wb-metric-bar{width:80px;height:4px;background:var(--bdl);border-radius:2px;overflow:hidden}.wb-metric-bar div{height:100%;border-radius:2px;transition:width .4s ease}
.wb-views{display:flex;gap:2px;background:var(--tint);border-radius:8px;padding:2px;border:1px solid var(--bdl)}
.wb-view{padding:5px 14px;border-radius:6px;border:none;background:transparent;font-size:12px;font-family:inherit;color:var(--i4);cursor:pointer;font-weight:500;transition:all .08s}
.wb-view.on{background:var(--card);color:var(--i8);box-shadow:0 1px 3px rgba(0,0,0,.03)}
.wb-add-btn{padding:7px 18px;border-radius:9px;border:1px solid var(--bd);background:var(--card);font-size:12px;font-family:inherit;color:var(--i5);cursor:pointer;font-weight:500;transition:all .1s}.wb-add-btn:hover{background:var(--tint);transform:translateY(-1px)}

/* ═══ TASK BOARD ═══ */
.wb-board{display:flex;gap:8px;padding:14px;overflow-x:auto}
.wb-board::-webkit-scrollbar{height:4px}.wb-board::-webkit-scrollbar-thumb{background:var(--bd);border-radius:2px}
.wb-col{min-width:200px;flex:1}
.wb-col-hd{display:flex;align-items:center;gap:5px;padding:6px 8px;margin-bottom:6px}
.wb-col-dot{width:7px;height:7px;border-radius:2px;flex-shrink:0}
.wb-col-name{font-family:var(--mono);font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.04em}
.wb-col-count{font-family:var(--mono);font-size:10px;color:var(--i3)}
.wb-col-spacer{flex:1}
.wb-col-add{width:20px;height:20px;border-radius:5px;border:1px solid var(--bdl);background:var(--card);color:var(--i3);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;opacity:0;transition:opacity .08s}.wb-col-hd:hover .wb-col-add{opacity:1}
.wb-col-cards{}
.wb-col-drop{padding:10px;border:1.5px dashed var(--bdl);border-radius:10px;text-align:center;font-size:10px;color:var(--i3);opacity:0;transition:opacity .08s}.wb-col:hover .wb-col-drop{opacity:.5}

/* Card */
.wb-card{border:1px solid var(--bdl);border-radius:12px;margin-bottom:6px;overflow:hidden;transition:all .12s cubic-bezier(.16,1,.3,1);cursor:default;background:var(--card)}
.wb-card:hover,.wb-card.hov{border-color:var(--i2);box-shadow:0 4px 16px rgba(0,0,0,.03);transform:translateY(-1px)}
.wb-card.overdue{border-left:3px solid var(--rs)}
.wb-card.done{opacity:.5}
.wb-card-pri{height:3px}
.wb-card-body{padding:12px 14px 10px}
.wb-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
.wb-card-client{font-family:var(--mono);font-size:9px;font-weight:500}
.wb-card-due{font-family:var(--mono);font-size:9px;color:var(--i3)}.wb-card-due.late{color:var(--rs);font-weight:500}
.wb-card-title{font-size:14px;font-weight:500;color:var(--i8);line-height:1.35;margin-bottom:6px}.wb-card-title.done{text-decoration:line-through;color:var(--i3)}

/* Subtask bar */
.wb-card-subs{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.wb-card-sub-bar{flex:1;height:3px;background:var(--bdl);border-radius:2px;overflow:hidden}.wb-card-sub-bar div{height:100%;border-radius:2px;transition:width .3s ease}
.wb-card-sub-count{font-family:var(--mono);font-size:9px;color:var(--i3);flex-shrink:0}
.wb-card-sub-toggle{border:none;background:none;font-size:8px;color:var(--i3);cursor:pointer;padding:2px}

/* Subtask list */
.wb-card-sub-list{margin-bottom:6px}
.wb-card-sub-item{display:flex;align-items:center;gap:6px;padding:3px 0;font-size:12px;color:var(--i6);border-bottom:1px solid var(--bdl)}
.wb-card-sub-item:last-child{border-bottom:none}
.wb-card-sub-item.done{opacity:.4}.wb-card-sub-item.done span{text-decoration:line-through}
.wb-card-sub-cb{width:14px;height:14px;border-radius:4px;border:1.5px solid var(--bd);display:flex;align-items:center;justify-content:center;font-size:8px;color:transparent;flex-shrink:0}.wb-card-sub-cb.on{background:var(--sg);border-color:var(--sg);color:#fff}

/* Footer */
.wb-card-foot{display:flex;align-items:center;gap:5px;padding-top:6px;border-top:1px solid var(--bdl)}
.wb-card-time{font-family:var(--mono);font-size:10px;color:var(--i4)}
.wb-card-logged{}.wb-card-logged.over{color:var(--rs)}.wb-card-est{color:var(--i3)}
.wb-card-badge{font-family:var(--mono);font-size:8px;padding:2px 6px;border-radius:4px;border:1px solid var(--bdl);color:var(--i4)}
.wb-card-badge.comment{color:var(--lv);border-color:rgba(125,125,176,.08)}
.wb-card-foot-spacer{flex:1}
.wb-card-active-dot{width:6px;height:6px;border-radius:50%;background:var(--sg);animation:pulse 2s ease infinite}
@keyframes pulse{0%,60%,100%{opacity:.3}20%{opacity:1}}
.wb-card-timer-btn{width:22px;height:22px;border-radius:6px;border:1px solid var(--bdl);background:var(--card);color:var(--i3);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:8px;opacity:0;transition:all .08s}
.wb-card:hover .wb-card-timer-btn{opacity:1}
.wb-card-timer-btn:hover{border-color:var(--em);color:var(--em);background:var(--embg)}

/* ═══ LIST VIEW ═══ */
.wb-list{padding:8px 14px 14px}
.wb-list-group{margin-bottom:12px}
.wb-list-group-hd{display:flex;align-items:center;gap:5px;padding:4px 6px;margin-bottom:4px;font-family:var(--mono);font-size:10px;font-weight:500;text-transform:uppercase}
.wb-list-line{flex:1;height:1px;background:var(--bdl)}
.wb-list-row{display:flex;align-items:center;gap:10px;padding:12px 10px;border:1px solid var(--bdl);border-radius:10px;margin-bottom:4px;transition:all .1s;cursor:default}
.wb-list-row:hover{border-color:var(--i2);box-shadow:0 3px 10px rgba(0,0,0,.02)}
.wb-list-row.overdue{border-left:3px solid var(--rs)}
.wb-list-pri{width:3px;height:24px;border-radius:2px;flex-shrink:0}
.wb-list-cb{width:16px;height:16px;border-radius:5px;border:1.5px solid var(--bd);flex-shrink:0}
.wb-list-info{flex:1;min-width:0}
.wb-list-title{font-size:14px;font-weight:500;color:var(--i8)}
.wb-list-meta{display:flex;gap:6px;font-family:var(--mono);font-size:10px;color:var(--i3);margin-top:2px}
.wb-list-due{font-family:var(--mono);font-size:11px;color:var(--i4);width:50px;flex-shrink:0}.wb-list-due.late{color:var(--rs);font-weight:500}
.wb-list-time{font-family:var(--mono);font-size:11px;color:var(--i4);width:56px;flex-shrink:0}.wb-list-est{color:var(--i3)}
.wb-list-priority{font-family:var(--mono);font-size:9px;font-weight:500;padding:2px 8px;border-radius:5px;border:1px solid;flex-shrink:0;text-transform:capitalize}
.wb-list-timer{width:24px;height:24px;border-radius:6px;border:1px solid var(--bdl);background:var(--card);color:var(--i3);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;opacity:0;transition:all .08s}
.wb-list-row:hover .wb-list-timer{opacity:1}

/* ═══ PIPELINE ═══ */
.wb-funnel{display:flex;padding:16px 24px 12px;gap:0;border-bottom:1px solid var(--bdl)}
.wb-funnel-stage{flex:1;text-align:center;padding:8px 6px;position:relative}
.wb-funnel-bar{height:3px;border-radius:2px;margin-bottom:8px}
.wb-funnel-label{font-family:var(--mono);font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:.04em}
.wb-funnel-value{font-family:'Fraunces',serif;font-size:18px;font-weight:600;color:var(--i8);margin-top:2px}
.wb-funnel-count{font-family:var(--mono);font-size:9px;color:var(--i3);margin-top:2px}
.wb-funnel-arrow{position:absolute;right:-6px;top:50%;transform:translateY(-50%);color:var(--i2);font-size:10px;z-index:1}
.wb-deals{display:flex;gap:8px;padding:14px}
.wb-deal-col{flex:1;min-width:0}

/* Deal card */
.wb-deal{border:1px solid var(--bdl);border-radius:12px;margin-bottom:6px;overflow:hidden;transition:all .12s;cursor:default;position:relative}
.wb-deal:hover,.wb-deal.hov{border-color:var(--i2);box-shadow:0 4px 14px rgba(0,0,0,.03);transform:translateY(-1px)}
.wb-deal.overdue{border-left:3px solid var(--rs)}
.wb-deal-accent{height:3px}
.wb-deal-body{padding:12px 14px}
.wb-deal-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px}
.wb-deal-name{font-size:14px;font-weight:600;color:var(--i8)}
.wb-deal-value{font-family:var(--mono);font-size:14px;font-weight:500}
.wb-deal-project{font-size:12px;color:var(--i4);margin-bottom:8px}
.wb-deal-prob{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.wb-deal-prob-bar{flex:1;height:4px;background:var(--bdl);border-radius:2px;overflow:hidden}.wb-deal-prob-bar div{height:100%;border-radius:2px;transition:width .3s ease}
.wb-deal-prob-val{font-family:var(--mono);font-size:10px;font-weight:500;flex-shrink:0}
.wb-deal-viewed{font-family:var(--mono);font-size:9px;color:var(--lv);flex-shrink:0}
.wb-deal-foot{display:flex;align-items:center;gap:6px;padding-top:6px;border-top:1px solid var(--bdl);font-size:11px}
.wb-deal-contact{color:var(--i4);flex:1}
.wb-deal-age{font-family:var(--mono);font-size:9px;color:var(--i3)}
.wb-deal-temp{font-family:var(--mono);font-size:8px;font-weight:500;padding:2px 6px;border-radius:4px}
.wb-deal-temp.hot{color:var(--rs);background:var(--rsbg)}
.wb-deal-temp.warm{color:var(--em);background:var(--embg)}
.wb-deal-temp.cool{color:var(--lv);background:var(--lvbg)}
.wb-deal-overdue-badge{font-family:var(--mono);font-size:8px;color:var(--rs);background:var(--rsbg);padding:2px 6px;border-radius:4px;font-weight:500}

/* ═══ AUTOMATIONS ═══ */
.wb-auto-split{display:flex;min-height:320px}
.wb-auto-list{width:55%;border-right:1px solid var(--bdl);padding:10px}
.wb-auto-rule{display:flex;align-items:flex-start;gap:10px;padding:12px;border-radius:12px;cursor:pointer;margin-bottom:4px;transition:all .08s;border:1px solid transparent}
.wb-auto-rule:hover{background:var(--tint)}
.wb-auto-rule.on{background:var(--lvbg);border-color:rgba(125,125,176,.05)}
.wb-auto-icon{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;border:1px solid;margin-top:1px}
.wb-auto-info{flex:1;min-width:0}
.wb-auto-trigger{font-size:13px;font-weight:500;color:var(--i7)}
.wb-auto-action{font-size:12px;color:var(--i4);margin-top:2px}
.wb-auto-status-col{flex-shrink:0;display:flex;align-items:center;gap:5px;margin-top:3px}
.wb-auto-status-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.wb-auto-status-lb{font-family:var(--mono);font-size:9px;font-weight:500}

/* Detail */
.wb-auto-detail{flex:1;padding:16px;overflow-y:auto}
.wb-auto-det-hd{display:flex;align-items:center;gap:10px;margin-bottom:16px}
.wb-auto-det-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;border:1px solid}
.wb-auto-det-status{font-family:var(--mono);font-size:11px;font-weight:500}

/* Flow */
.wb-auto-flow{margin-bottom:16px}
.wb-auto-flow-node{padding:12px 14px;border:1px solid var(--bdl);border-radius:12px;margin-bottom:0}
.wb-auto-flow-node.trigger{border-left:3px solid var(--lv)}
.wb-auto-flow-node.action{border-left:3px solid var(--sg)}
.wb-auto-flow-lb{font-family:var(--mono);font-size:8px;color:var(--i3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px}
.wb-auto-flow-text{font-size:14px;font-weight:500;color:var(--i8)}
.wb-auto-flow-type{font-family:var(--mono);font-size:9px;color:var(--i3);margin-top:3px;display:inline-block;background:var(--tint);padding:2px 6px;border-radius:4px;border:1px solid var(--bdl)}
.wb-auto-flow-arrow{text-align:center;color:var(--i2);font-size:14px;padding:4px 0}

/* Log */
.wb-auto-log{border-top:1px solid var(--bdl);padding-top:12px}
.wb-auto-log-lb{font-family:var(--mono);font-size:8px;color:var(--i3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
.wb-auto-log-row{display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid var(--bdl)}
.wb-auto-log-row:last-child{border-bottom:none}
.wb-auto-log-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:5px}
.wb-auto-log-text{font-size:13px;color:var(--i6);flex:1}
.wb-auto-log-time{font-family:var(--mono);font-size:10px;color:var(--i3);flex-shrink:0}
      `}</style>

      <div className="pg">
        <div className="pg-in">
          <div className="pg-hd">
            <div className="pg-eye">Space Blocks · Work</div>
            <div className="pg-t">3 blocks that <em>run your business</em></div>
            <div className="pg-sub">Toggle board/list views. Expand subtasks. Hover deals for details. Click automation rules to see their activity logs.</div>
          </div>

          <div className="pg-lb">1 · Task Board</div>
          <TaskBoard />

          <div className="pg-lb">2 · Pipeline</div>
          <PipelineBlock />

          <div className="pg-lb">3 · Automations</div>
          <AutomationsBlock />
        </div>
      </div>
    </>
  );
}
