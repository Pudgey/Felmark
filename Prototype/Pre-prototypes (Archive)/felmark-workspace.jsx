import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   FELMARK WORKSPACE — v5
   Kit #1 + Kit #2. Every component integrated.
   One screen. Zero navigation. Full cockpit.
   ═══════════════════════════════════════════ */

const CLIENTS = [
  { id: "meridian", name: "Meridian Studio", av: "M", color: "#7c8594", status: "active", owed: 2400, unread: 2, email: "sarah@meridian.co", contact: "Sarah Chen", earned: 12400, health: 92, since: "Oct 2025" },
  { id: "nora", name: "Nora Kim", av: "N", color: "#a08472", status: "active", owed: 3200, unread: 0, email: "nora@norakim.com", contact: "Nora Kim", earned: 8200, health: 88, since: "Feb 2026" },
  { id: "bolt", name: "Bolt Fitness", av: "B", color: "#8a7e63", status: "overdue", owed: 4000, unread: 1, email: "jake@bolt.com", contact: "Jake Torres", earned: 6000, health: 45, since: "Jan 2026" },
  { id: "luna", name: "Luna Boutique", av: "L", color: "#7c6b9e", status: "lead", owed: 0, unread: 1, email: "maria@luna.co", contact: "Maria Santos", earned: 0, health: 0, since: "New" },
];
const PROJECTS = {
  meridian: [{ id: "p1", name: "Brand Guidelines v2", status: "active", value: 4800 }, { id: "p2", name: "Social Templates", status: "complete", value: 1800 }],
  bolt: [{ id: "p3", name: "App Onboarding", status: "overdue", value: 4000 }, { id: "p4", name: "Blog Posts", status: "active", value: 3000 }],
  nora: [{ id: "p5", name: "Course Landing Page", status: "active", value: 3200 }, { id: "p6", name: "Email Sequence", status: "pending", value: 1200 }],
};
const STATUSES = [
  { id: "backlog", label: "Backlog", color: "#9b988f" }, { id: "todo", label: "To Do", color: "#5b7fa4" },
  { id: "progress", label: "In Progress", color: "#d97706" }, { id: "review", label: "Review", color: "#7c6b9e" },
  { id: "done", label: "Done", color: "#5a9a3c" },
];
const PRIORITIES = [
  { id: "urgent", label: "Urgent", color: "#c24b38" }, { id: "high", label: "High", color: "#d97706" },
  { id: "medium", label: "Med", color: "#5b7fa4" }, { id: "low", label: "Low", color: "#9b988f" },
];
const TASKS = [
  { id: "t1", project: "p1", title: "Discovery & brand audit", status: "done", priority: "high", due: "Mar 20", est: "8h", logged: "7.5h", subtasks: [{ t: "Competitive analysis", d: true }, { t: "Stakeholder interviews", d: true }, { t: "Brand inventory", d: true }] },
  { id: "t2", project: "p1", title: "Logo concept exploration", status: "done", priority: "high", due: "Mar 25", est: "12h", logged: "14h", subtasks: [{ t: "Moodboard", d: true }, { t: "Concept A", d: true }, { t: "Concept B", d: true }, { t: "Concept C", d: true }] },
  { id: "t3", project: "p1", title: "Color palette & typography system", status: "progress", priority: "high", due: "Apr 2", est: "6h", logged: "3h", comments: 3, files: 1, subtasks: [{ t: "Primary palette (5 colors)", d: true }, { t: "Secondary & accents", d: false }, { t: "Heading font pairing", d: true }, { t: "Body & mono selection", d: false }] },
  { id: "t4", project: "p1", title: "Brand guidelines document", status: "todo", priority: "medium", due: "Apr 5", est: "16h", logged: "0h", subtasks: [{ t: "Cover & TOC", d: false }, { t: "Logo rules", d: false }, { t: "Color specs", d: false }, { t: "Typography", d: false }, { t: "Photo direction", d: false }, { t: "Social guidelines", d: false }] },
  { id: "t5", project: "p1", title: "Social media template kit", status: "backlog", priority: "low", due: "Apr 10", est: "8h", logged: "0h", subtasks: [{ t: "IG posts (4×)", d: false }, { t: "IG stories (4×)", d: false }, { t: "LinkedIn (2×)", d: false }, { t: "X/Twitter (2×)", d: false }] },
  { id: "t6", project: "p1", title: "Client review & revisions", status: "review", priority: "urgent", due: "Apr 1", est: "4h", logged: "1.5h", comments: 5, files: 2, subtasks: [{ t: "Address color feedback", d: false }, { t: "Revise teal → warmer", d: false }, { t: "CEO sign-off", d: false }] },
];
const MILESTONES = [
  { id: "m1", label: "Discovery", status: "done", tasks: "3/3", date: "Mar 20" },
  { id: "m2", label: "Concepts", status: "done", tasks: "4/4", date: "Mar 25" },
  { id: "m3", label: "System", status: "active", tasks: "2/4", date: "Apr 2" },
  { id: "m4", label: "Guidelines", status: "pending", tasks: "0/6", date: "Apr 5" },
  { id: "m5", label: "Templates", status: "pending", tasks: "0/4", date: "Apr 10" },
  { id: "m6", label: "Delivery", status: "pending", tasks: "—", date: "Apr 12" },
];
const FILES = [
  { name: "Brand_Guidelines_v2_Draft.pdf", size: "4.2 MB", date: "Mar 29", type: "pdf", by: "You" },
  { name: "Logo_Concepts_B.fig", size: "12 MB", date: "Mar 25", type: "fig", by: "You" },
  { name: "Color_Palette_Final.png", size: "340 KB", date: "Mar 22", type: "img", by: "You" },
  { name: "Feedback_Notes.docx", size: "89 KB", date: "Mar 28", type: "doc", by: "Sarah" },
];
const AUTOMATIONS = [
  { id: "a1", status: "done", icon: "✓", color: "#5a9a3c", title: "Milestone update sent to Sarah", time: "3h ago", trigger: "Concepts tasks → done" },
  { id: "a2", status: "ready", icon: "$", color: "var(--ember)", title: "Invoice auto-drafted · $2,400", time: "Ready", trigger: "Project reaches 50%" },
  { id: "a3", status: "scheduled", icon: "◇", color: "#5b7fa4", title: "Review reminder queued for Sarah", time: "Apr 4", trigger: "3d after deliverable" },
];
const WHISPERS = [
  { id: "w1", text: "Sarah hasn't responded to color palette review in 2 days", action: "Send Nudge", color: "var(--ember)", urgency: "medium" },
  { id: "w2", text: "Logo Concepts logged 14h vs 12h budget — adjust estimate?", action: "Adjust", color: "#5b7fa4", urgency: "low" },
  { id: "w3", text: "Bolt invoice 4 days overdue — collection risk rises 3× after 7 days", action: "Remind", color: "#c24b38", urgency: "high" },
];
const WEEK = [
  { day: "Mon", date: "31", full: "Mar 31", today: true, items: [{ time: "9:00", text: "Reply to feedback", color: "#d97706", type: "task" }, { time: "11:00", text: "Call with Nora", color: "#5b7fa4", type: "call", dur: "30m" }, { time: "2:00", text: "Color palette due", color: "var(--ember)", type: "deadline" }] },
  { day: "Tue", date: "1", full: "Apr 1", items: [{ time: "—", text: "Client review deadline", color: "#c24b38", type: "deadline" }] },
  { day: "Wed", date: "2", full: "Apr 2", items: [{ time: "10:00", text: "Meridian sync", color: "#5b7fa4", type: "call", dur: "45m" }] },
  { day: "Thu", date: "3", full: "Apr 3", items: [{ time: "—", text: "Proposal expires", color: "#c24b38", type: "deadline" }] },
  { day: "Fri", date: "4", full: "Apr 4", items: [] },
  { day: "Sat", date: "5", full: "Apr 5", items: [{ time: "—", text: "Guidelines doc due", color: "var(--ember)", type: "deadline" }] },
  { day: "Sun", date: "6", full: "Apr 6", items: [] },
];
const MSGS = [
  { from: "Sarah", text: "Can we adjust the color palette? The teal feels too cold.", time: "2m ago", unread: true },
  { from: "Sarah", text: "Love the logo direction! Concept B it is.", time: "1d ago", unread: true },
  { from: "You", text: "Updated scope with additional social templates.", time: "2d ago" },
  { from: "Sarah", text: "Sounds great. Timeline ok?", time: "3d ago" },
  { from: "You", text: "On track — guidelines draft by end of week.", time: "4d ago" },
];
const ACTIVITY = [
  { text: "Sarah viewed proposal", time: "2m", dot: "#5b7fa4" },
  { text: "Payment received · $1,800", time: "3h", dot: "#5a9a3c" },
  { text: "3 comments on scope", time: "2d", dot: "#d97706" },
  { text: "Contract signed", time: "2w", dot: "#5a9a3c" },
];

function Bar({ pct, color, h = 3 }) { return <div style={{ height: h, background: "var(--warm-200)", borderRadius: h / 2, overflow: "hidden", flex: 1 }}><div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: h / 2 }} /></div>; }
const sc = (s) => s === "active" ? "#5a9a3c" : s === "overdue" ? "#c24b38" : s === "lead" ? "#5b7fa4" : s === "complete" ? "#5a9a3c" : "#9b988f";
const typeColors = { pdf: "#c24b38", fig: "#7c6b9e", img: "#5a9a3c", doc: "#5b7fa4" };

export default function Workspace() {
  const [clientId, setClientId] = useState("meridian");
  const [projectId, setProjectId] = useState("p1");
  const [view, setView] = useState("list");
  const [groupBy, setGroupBy] = useState("status");
  const [selectedTask, setSelectedTask] = useState(null);
  const [expanded, setExpanded] = useState(new Set(["t3", "t6"]));
  const [rightPanel, setRightPanel] = useState("pulse");
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerTask, setTimerTask] = useState(null);
  const [timerSecs, setTimerSecs] = useState(0);
  const [showCmd, setShowCmd] = useState(false);
  const [cmdQ, setCmdQ] = useState("");
  const [cmdSel, setCmdSel] = useState(0);
  const [msgInput, setMsgInput] = useState("");
  const [msgs, setMsgs] = useState(MSGS);
  const [invSent, setInvSent] = useState(false);
  const [whisperDismissed, setWhisperDismissed] = useState(new Set());
  const [showAutomations, setShowAutomations] = useState(false);
  const [autoDismissed, setAutoDismissed] = useState(new Set());
  const [msHovered, setMsHovered] = useState(null);
  const [calDay, setCalDay] = useState(0);
  const [fileView, setFileView] = useState("list");
  const [dragOver, setDragOver] = useState(false);
  const [fileList, setFileList] = useState(FILES);
  const cmdRef = useRef(null);

  const cl = CLIENTS.find(c => c.id === clientId);
  const tasks = TASKS.filter(t => t.project === projectId);
  const selTask = selectedTask ? TASKS.find(t => t.id === selectedTask) : null;
  const proj = PROJECTS[clientId]?.find(p => p.id === projectId);
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === "done").length;
  const totalLogged = tasks.reduce((s, t) => s + parseFloat(t.logged), 0);
  const totalEst = tasks.reduce((s, t) => s + parseFloat(t.est), 0);
  const grouped = groupBy === "status"
    ? STATUSES.map(s => ({ ...s, tasks: tasks.filter(t => t.status === s.id) })).filter(g => g.tasks.length > 0)
    : PRIORITIES.map(p => ({ ...p, tasks: tasks.filter(t => t.priority === p.id) })).filter(g => g.tasks.length > 0);

  const visWhispers = WHISPERS.filter(w => !whisperDismissed.has(w.id));
  const visAutos = AUTOMATIONS.filter(a => !autoDismissed.has(a.id));
  const msDone = MILESTONES.filter(m => m.status === "done").length;

  useEffect(() => { if (!timerRunning) return; const i = setInterval(() => setTimerSecs(s => s + 1), 1000); return () => clearInterval(i); }, [timerRunning]);
  useEffect(() => { const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowCmd(true); setCmdQ(""); setCmdSel(0); } if (e.key === "Escape") setShowCmd(false); }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, []);
  useEffect(() => { if (showCmd) cmdRef.current?.focus(); }, [showCmd]);
  useEffect(() => { if (selectedTask) setRightPanel("task"); }, [selectedTask]);

  const toggleExp = (id) => { setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); };
  const startTimer = (tid) => { setTimerTask(tid); setTimerSecs(0); setTimerRunning(true); };
  const stopTimer = () => { setTimerRunning(false); setTimerSecs(0); setTimerTask(null); };
  const timerFmt = `${Math.floor(timerSecs / 3600) > 0 ? Math.floor(timerSecs / 3600) + ":" : ""}${String(Math.floor((timerSecs % 3600) / 60)).padStart(2, "0")}:${String(timerSecs % 60).padStart(2, "0")}`;

  const cmds = [
    { icon: "$", label: `Create invoice for ${cl.name}`, cat: "action", color: "#5a9a3c", fn: () => { setRightPanel("invoice"); setSelectedTask(null); setInvSent(false); } },
    { icon: "✉", label: `Message ${cl.contact}`, cat: "action", color: "#5b7fa4", fn: () => { setRightPanel("messages"); setSelectedTask(null); } },
    { icon: "▶", label: "Start timer on current task", cat: "action", color: "#d97706", fn: () => selectedTask && startTimer(selectedTask) },
    ...CLIENTS.map(c => ({ icon: c.av, label: c.name, cat: "client", color: c.color, fn: () => { setClientId(c.id); setProjectId(PROJECTS[c.id]?.[0]?.id || ""); setSelectedTask(null); setRightPanel("pulse"); } })),
  ];
  const fCmds = cmdQ ? cmds.filter(c => c.label.toLowerCase().includes(cmdQ.toLowerCase())) : cmds;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
.ws{font-family:'Outfit',sans-serif;background:var(--parchment);height:100vh;display:flex;flex-direction:column;overflow:hidden;font-size:13px;color:var(--ink-700)}
.ws-top{height:36px;padding:0 10px;background:#fff;border-bottom:1px solid var(--warm-200);display:flex;align-items:center;gap:6px;flex-shrink:0}
.ws-body{display:flex;flex:1;overflow:hidden}
.ws-side{width:192px;background:#fff;border-right:1px solid var(--warm-200);display:flex;flex-direction:column;flex-shrink:0}
.ws-side-head{padding:6px 6px 2px;display:flex;align-items:center;justify-content:space-between}
.ws-side-list{flex:1;overflow-y:auto;padding:2px 4px}.ws-side-list::-webkit-scrollbar{width:2px}.ws-side-list::-webkit-scrollbar-thumb{background:var(--warm-200)}
.ws-cl{display:flex;align-items:center;gap:6px;padding:5px 6px;border-radius:5px;cursor:pointer;margin-bottom:1px;transition:all .04s}
.ws-cl:hover{background:var(--warm-50)}.ws-cl.on{background:var(--ember-bg)}
.ws-cl-av{width:24px;height:24px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#fff;flex-shrink:0;position:relative}
.ws-cl-unread{position:absolute;top:-2px;right:-2px;min-width:11px;height:11px;border-radius:6px;background:#c24b38;color:#fff;font-size:6px;font-weight:600;display:flex;align-items:center;justify-content:center;border:1.5px solid #fff}
.ws-cl-info{flex:1;min-width:0}.ws-cl-name{font-size:11px;font-weight:500;color:var(--ink-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ws-cl.on .ws-cl-name{color:var(--ink-900);font-weight:600}
.ws-cl-meta{font-family:var(--mono);font-size:8px;color:var(--ink-300);display:flex;align-items:center;gap:3px}
.ws-cl-dot{width:4px;height:4px;border-radius:50%}
.ws-cl-owed{font-family:var(--mono);font-size:8px;font-weight:500;flex-shrink:0}
.ws-sp{display:flex;align-items:center;gap:4px;padding:3px 6px;margin:0 4px 1px 18px;border-radius:3px;cursor:pointer;font-size:10px;color:var(--ink-500)}
.ws-sp:hover{background:var(--warm-50)}.ws-sp.on{background:var(--ember-bg);color:var(--ink-800);font-weight:500}
.ws-sp-dot{width:4px;height:4px;border-radius:50%;flex-shrink:0}
.ws-main{flex:1;display:flex;flex-direction:column;overflow:hidden}

/* Project header */
.ws-ph{padding:8px 14px 6px;background:#fff;border-bottom:1px solid var(--warm-200);flex-shrink:0}
.ws-ph-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
.ws-ph-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--ink-900);display:flex;align-items:center;gap:6px}
.ws-ph-badge{font-family:var(--mono);font-size:7px;font-weight:500;padding:2px 6px;border-radius:3px;border:1px solid}
.ws-ph-btns{display:flex;gap:3px}
.ws-ph-btn{padding:3px 8px;border-radius:4px;border:1px solid var(--warm-200);background:#fff;font-size:10px;font-family:inherit;color:var(--ink-500);cursor:pointer;display:flex;align-items:center;gap:2px}.ws-ph-btn:hover{background:var(--warm-50)}
.ws-ph-btn.e{color:var(--ember);border-color:rgba(176,125,79,.08);background:var(--ember-bg)}
.ws-ph-btn.p{background:var(--ink-900);color:#fff;border-color:var(--ink-900)}
.ws-ph-btn.on{background:var(--ink-900);color:#fff;border-color:var(--ink-900)}

/* Milestone bar */
.ws-ms{padding:6px 14px;background:#fff;border-bottom:1px solid var(--warm-200);flex-shrink:0;display:flex;align-items:center;gap:0}
.ws-ms-node{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:default;position:relative}
.ws-ms-dot{width:14px;height:14px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:7px;color:#fff;border:2px solid;z-index:1}
.ws-ms-line{position:absolute;top:7px;left:50%;right:-50%;height:2px;z-index:0}
.ws-ms-label{font-family:var(--mono);font-size:7px;text-align:center}
.ws-ms-tip{position:absolute;top:-44px;left:50%;transform:translateX(-50%);background:var(--ink-900);color:#fff;padding:5px 8px;border-radius:4px;font-family:var(--mono);font-size:8px;white-space:nowrap;z-index:10;pointer-events:none}

/* AI Whisper */
.ws-aw{padding:4px 14px;background:#fff;border-bottom:1px solid var(--warm-200);flex-shrink:0;display:flex;align-items:center;gap:6px}
.ws-aw-badge{font-family:var(--mono);font-size:8px;font-weight:600;color:var(--ember);flex-shrink:0}
.ws-aw-dot{width:4px;height:4px;border-radius:50%;flex-shrink:0}
.ws-aw-text{font-size:11px;color:var(--ink-600);flex:1;line-height:1.3}
.ws-aw-action{padding:3px 8px;border-radius:3px;border:1px solid;font-size:9px;font-weight:500;font-family:inherit;cursor:pointer;background:#fff;flex-shrink:0}
.ws-aw-x{width:18px;height:18px;border-radius:3px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:8px;flex-shrink:0}
.ws-aw-more{font-family:var(--mono);font-size:8px;color:var(--ink-300);flex-shrink:0}

/* Stats strip */
.ws-stats{padding:4px 14px;background:#fff;border-bottom:1px solid var(--warm-200);display:flex;gap:12px;font-family:var(--mono);font-size:9px;color:var(--ink-400);align-items:center;flex-shrink:0}
.ws-stat-v{font-weight:600;color:var(--ink-700);margin-right:2px}

/* Toolbar */
.ws-tb{padding:3px 14px;background:#fff;border-bottom:1px solid var(--warm-200);display:flex;align-items:center;gap:4px;flex-shrink:0}
.ws-tb-views{display:flex;gap:1px;background:var(--warm-100);border-radius:3px;padding:1px}
.ws-tb-v{padding:3px 8px;border-radius:2px;border:none;font-size:9px;font-family:inherit;cursor:pointer;color:var(--ink-400);background:transparent}.ws-tb-v:hover{color:var(--ink-600)}.ws-tb-v.on{background:#fff;color:var(--ink-800);font-weight:500;box-shadow:0 1px 2px rgba(0,0,0,.02)}
.ws-tb-sep{width:1px;height:14px;background:var(--warm-200)}
.ws-tb-f{padding:3px 6px;border-radius:3px;border:1px solid var(--warm-200);background:#fff;font-size:9px;font-family:inherit;color:var(--ink-400);cursor:pointer}.ws-tb-f:hover{background:var(--warm-50)}

/* Tasks */
.ws-tasks{flex:1;overflow-y:auto;padding:4px 10px}.ws-tasks::-webkit-scrollbar{width:3px}.ws-tasks::-webkit-scrollbar-thumb{background:var(--warm-200)}
.ws-grp{margin-bottom:6px}
.ws-grp-head{display:flex;align-items:center;gap:4px;padding:2px 4px;margin-bottom:2px}
.ws-grp-dot{width:5px;height:5px;border-radius:2px;flex-shrink:0}
.ws-grp-label{font-family:var(--mono);font-size:8px;font-weight:500;text-transform:uppercase;letter-spacing:.03em}
.ws-grp-count{font-family:var(--mono);font-size:8px;color:var(--ink-300)}
.ws-grp-line{flex:1;height:1px;background:var(--warm-200)}
.ws-t{display:flex;align-items:center;background:#fff;border:1px solid var(--warm-200);border-radius:5px;margin-bottom:2px;overflow:hidden;cursor:pointer;transition:all .06s}
.ws-t:hover{border-color:var(--warm-300);box-shadow:0 1px 3px rgba(0,0,0,.02)}.ws-t.sel{border-color:var(--ember);box-shadow:0 0 0 2px var(--ember-bg)}
.ws-t-pri{width:3px;align-self:stretch;flex-shrink:0}
.ws-t-chk{width:28px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ws-t-cb{width:13px;height:13px;border-radius:3px;border:1.5px solid var(--warm-300);display:flex;align-items:center;justify-content:center;font-size:7px;color:transparent;cursor:pointer}.ws-t-cb.done{background:#5a9a3c;border-color:#5a9a3c;color:#fff}
.ws-t-body{flex:1;padding:5px 0;min-width:0}
.ws-t-title{font-size:11px;font-weight:500;color:var(--ink-800);display:flex;align-items:center;gap:3px}.ws-t-title.done{color:var(--ink-300);text-decoration:line-through}
.ws-t-bdg{font-family:var(--mono);font-size:6px;padding:1px 3px;border-radius:2px;display:inline-flex;align-items:center;gap:1px}
.ws-t-exp{font-size:7px;color:var(--ink-300);cursor:pointer}
.ws-t-subs{margin-top:2px;padding-left:1px}
.ws-t-sub{display:flex;align-items:center;gap:3px;padding:1px 0;font-size:9px;color:var(--ink-500)}
.ws-t-sub-cb{width:10px;height:10px;border-radius:2px;border:1.5px solid var(--warm-300);display:flex;align-items:center;justify-content:center;font-size:6px;color:transparent;flex-shrink:0}.ws-t-sub-cb.done{background:#5a9a3c;border-color:#5a9a3c;color:#fff}
.ws-t-cells{display:flex;align-items:center;flex-shrink:0;padding-right:4px}
.ws-t-cell{padding:2px 5px;font-family:var(--mono);font-size:8px;text-align:center;color:var(--ink-400);min-width:36px}
.ws-t-av{width:16px;height:16px;border-radius:3px;background:var(--ember);color:#fff;font-size:7px;font-weight:600;display:flex;align-items:center;justify-content:center}
.ws-t-timer{width:16px;height:16px;border-radius:3px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:6px;opacity:0;transition:opacity .06s}.ws-t:hover .ws-t-timer{opacity:1}

/* Right panel */
.ws-right{width:272px;background:#fff;border-left:1px solid var(--warm-200);display:flex;flex-direction:column;flex-shrink:0;overflow:hidden}
.ws-rp-tabs{display:flex;border-bottom:1px solid var(--warm-100);flex-shrink:0;padding:0 2px;overflow-x:auto}
.ws-rp-tab{padding:6px 6px;text-align:center;font-size:9px;cursor:pointer;color:var(--ink-400);border-bottom:2px solid transparent;margin-bottom:-1px;border:none;background:none;font-family:inherit;white-space:nowrap;transition:color .05s}
.ws-rp-tab:hover{color:var(--ink-600)}.ws-rp-tab.on{color:var(--ink-900);font-weight:500;border-bottom-color:var(--ember)}
.ws-rp-dot{display:inline-block;width:4px;height:4px;border-radius:50%;margin-left:2px;vertical-align:middle}
.ws-rp-body{flex:1;overflow-y:auto;padding:8px 10px}.ws-rp-body::-webkit-scrollbar{width:3px}.ws-rp-body::-webkit-scrollbar-thumb{background:var(--warm-200)}
.ws-rp-label{font-family:var(--mono);font-size:7px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px;margin-top:8px}

/* Pulse stats */
.ws-p-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:3px;margin-bottom:6px}
.ws-p-stat{padding:6px;background:var(--warm-50);border-radius:4px;border:1px solid var(--warm-100)}
.ws-p-stat-val{font-family:var(--mono);font-size:12px;font-weight:600;line-height:1}
.ws-p-stat-label{font-family:var(--mono);font-size:7px;color:var(--ink-300);text-transform:uppercase;margin-top:1px}
.ws-p-act{display:flex;align-items:center;gap:4px;padding:3px 0;border-bottom:1px solid var(--warm-100);font-size:10px}
.ws-p-act:last-child{border-bottom:none}
.ws-p-act-dot{width:3px;height:3px;border-radius:50%;flex-shrink:0}

/* Task detail */
.ws-td-fields{display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-bottom:6px}
.ws-td-f{padding:4px 6px;background:var(--warm-50);border-radius:3px;border:1px solid var(--warm-100)}
.ws-td-fl{font-family:var(--mono);font-size:6px;color:var(--ink-300);text-transform:uppercase;margin-bottom:1px}
.ws-td-fv{font-size:10px;font-weight:500;color:var(--ink-700);display:flex;align-items:center;gap:2px}

/* Messages */
.ws-msg{display:flex;align-items:flex-end;gap:4px;margin-bottom:4px}
.ws-msg.sent{justify-content:flex-end}
.ws-msg-av{width:18px;height:18px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:600;color:#fff;flex-shrink:0}
.ws-msg-b{max-width:80%;padding:6px 8px;border-radius:8px;font-size:11px;line-height:1.4}
.ws-msg.received .ws-msg-b{background:var(--warm-50);border:1px solid var(--warm-100);color:var(--ink-700);border-bottom-left-radius:2px}
.ws-msg.sent .ws-msg-b{background:var(--ink-900);color:#fff;border-bottom-right-radius:2px}
.ws-msg-meta{font-family:var(--mono);font-size:7px;margin-top:2px}
.ws-msg.received .ws-msg-meta{color:var(--ink-300)}.ws-msg.sent .ws-msg-meta{color:rgba(255,255,255,.3)}

/* Files */
.ws-file{display:flex;align-items:center;gap:6px;padding:5px 4px;border-radius:4px;cursor:pointer;transition:background .04s}
.ws-file:hover{background:var(--warm-50)}
.ws-file-icon{width:24px;height:24px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:7px;font-weight:600;flex-shrink:0;border:1px solid}
.ws-file-info{flex:1;min-width:0}
.ws-file-name{font-size:11px;color:var(--ink-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ws-file-meta{font-family:var(--mono);font-size:8px;color:var(--ink-300)}
.ws-file-dl{font-size:10px;color:var(--ember);cursor:pointer;flex-shrink:0;opacity:0}.ws-file:hover .ws-file-dl{opacity:1}
.ws-file-drop{padding:14px;border:2px dashed var(--warm-300);border-radius:6px;text-align:center;margin-top:6px;transition:all .12s;cursor:pointer;font-size:10px;color:var(--ink-300)}
.ws-file-drop:hover,.ws-file-drop.over{border-color:var(--ember);color:var(--ember);background:var(--ember-bg)}

/* Calendar */
.ws-cal-days{display:flex;gap:1px;margin-bottom:8px}
.ws-cal-day{flex:1;padding:4px 2px;text-align:center;cursor:pointer;border-radius:4px;transition:background .04s;position:relative}
.ws-cal-day:hover{background:var(--warm-50)}.ws-cal-day.on{background:var(--ember-bg)}
.ws-cal-day.today::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:12px;height:2px;background:var(--ember);border-radius:1px}
.ws-cal-day-name{font-family:var(--mono);font-size:8px;color:var(--ink-400)}
.ws-cal-day.on .ws-cal-day-name{color:var(--ember)}
.ws-cal-day-num{font-size:12px;font-weight:500;color:var(--ink-700)}
.ws-cal-day-dots{display:flex;gap:1px;justify-content:center;margin-top:2px}
.ws-cal-item{display:flex;align-items:flex-start;gap:5px;padding:4px;border-radius:3px;margin-bottom:2px;cursor:default}
.ws-cal-item:hover{background:var(--warm-50)}
.ws-cal-item-bar{width:2px;min-height:22px;border-radius:1px;flex-shrink:0;margin-top:1px}
.ws-cal-item-time{font-family:var(--mono);font-size:8px;color:var(--ink-300);width:28px;flex-shrink:0}
.ws-cal-item-text{font-size:10px;color:var(--ink-600);flex:1;line-height:1.3}
.ws-cal-item-dur{font-family:var(--mono);font-size:8px;color:var(--ink-300);flex-shrink:0}

/* Automations */
.ws-auto{padding:4px 14px;background:#fff;border-bottom:1px solid var(--warm-200);flex-shrink:0}
.ws-auto-head{display:flex;align-items:center;gap:4px;padding:2px 0;cursor:pointer;font-size:10px;color:var(--ink-500)}
.ws-auto-items{padding:4px 0}
.ws-auto-item{display:flex;align-items:center;gap:6px;padding:3px 0;font-size:10px;border-bottom:1px solid var(--warm-100)}
.ws-auto-item:last-child{border-bottom:none}
.ws-auto-icon{width:18px;height:18px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:600;flex-shrink:0;border:1px solid}
.ws-auto-info{flex:1;min-width:0;color:var(--ink-600)}
.ws-auto-status{font-family:var(--mono);font-size:8px;font-weight:500;flex-shrink:0}
.ws-auto-x{font-size:8px;color:var(--ink-300);cursor:pointer;opacity:0;flex-shrink:0}.ws-auto-item:hover .ws-auto-x{opacity:1}

/* Timer */
.ws-timer{padding:4px 12px;background:#fff;border-top:1px solid var(--warm-200);display:flex;align-items:center;gap:8px;flex-shrink:0}
.ws-timer-pulse{width:5px;height:5px;border-radius:50%;background:#5a9a3c;animation:tp 1.5s ease infinite}
@keyframes tp{0%,60%,100%{opacity:.3;transform:scale(1)}15%{opacity:1;transform:scale(1.1)}}
.ws-timer-info{flex:1;min-width:0}
.ws-timer-task{font-size:10px;font-weight:500;color:var(--ink-800);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ws-timer-client{font-family:var(--mono);font-size:7px;color:var(--ink-300)}
.ws-timer-time{font-family:var(--mono);font-size:15px;font-weight:600;color:var(--ink-900);flex-shrink:0}
.ws-timer-btn{padding:3px 8px;border-radius:3px;border:none;font-size:8px;font-weight:500;font-family:inherit;cursor:pointer;flex-shrink:0}

.ws-foot{height:22px;padding:0 10px;border-top:1px solid var(--warm-200);display:flex;align-items:center;justify-content:space-between;background:#fff;flex-shrink:0;font-family:var(--mono);font-size:8px;color:var(--ink-300)}

/* ⌘K */
.ws-cmd-o{position:fixed;inset:0;background:rgba(44,42,37,.2);z-index:100;display:flex;align-items:flex-start;justify-content:center;padding-top:100px}
.ws-cmd{width:420px;background:#fff;border:1px solid var(--warm-200);border-radius:10px;box-shadow:0 16px 48px rgba(0,0,0,.1);overflow:hidden}
.ws-cmd-in{display:flex;align-items:center;gap:6px;padding:10px 14px;border-bottom:1px solid var(--warm-100)}
.ws-cmd-in input{flex:1;border:none;outline:none;font-size:14px;font-family:inherit;color:var(--ink-800);background:transparent}
.ws-cmd-in input::placeholder{color:var(--warm-400)}
.ws-cmd-r{max-height:240px;overflow-y:auto;padding:4px}
.ws-cmd-g{font-family:var(--mono);font-size:7px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em;padding:4px 10px 2px}
.ws-cmd-i{display:flex;align-items:center;gap:6px;padding:5px 10px;border-radius:5px;cursor:pointer;transition:background .04s}
.ws-cmd-i:hover,.ws-cmd-i.sel{background:var(--ember-bg)}
.ws-cmd-ic{width:22px;height:22px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;flex-shrink:0;border:1px solid}
.ws-cmd-il{font-size:12px;color:var(--ink-800)}.ws-cmd-i.sel .ws-cmd-il{font-weight:500}
.ws-cmd-f{padding:5px 14px;border-top:1px solid var(--warm-100);font-family:var(--mono);font-size:8px;color:var(--ink-300);display:flex;gap:10px}
.ws-cmd-k{background:var(--warm-100);padding:1px 3px;border-radius:2px;margin-right:2px}
      `}</style>

      <div className="ws">
        {/* Top */}
        <div className="ws-top">
          <div style={{ width: 22, height: 22, borderRadius: 5, background: "var(--ink-900)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ember)", fontSize: 9 }}>◆</div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, color: "var(--ink-900)" }}>Felmark</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 7, color: "var(--ink-300)", background: "var(--warm-100)", padding: "1px 5px", borderRadius: 3 }}>WORKSPACE</span>
          <span style={{ width: 1, height: 14, background: "var(--warm-200)", margin: "0 2px" }} />
          <span style={{ fontSize: 11, color: "var(--ink-400)" }}>{cl.name} <span style={{ color: "var(--warm-300)" }}>/</span> <b style={{ color: "var(--ink-700)", fontWeight: 500 }}>{proj?.name || "—"}</b></span>
          <span style={{ flex: 1 }} />
          <div onClick={() => setShowCmd(true)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", background: "var(--warm-50)", border: "1px solid var(--warm-200)", borderRadius: 5, width: 200, cursor: "pointer" }}><span style={{ color: "var(--warm-400)", fontSize: 11, flex: 1 }}>Search or command...</span><span style={{ fontFamily: "var(--mono)", fontSize: 7, color: "var(--ink-300)", background: "var(--warm-100)", padding: "1px 4px", borderRadius: 2 }}>⌘K</span></div>
          <button style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid var(--warm-200)", background: "#fff", fontSize: 10, fontFamily: "inherit", color: "var(--ink-500)", cursor: "pointer" }}>Workstation ↗</button>
          <button style={{ padding: "4px 10px", borderRadius: 4, border: "none", background: "var(--ink-900)", color: "#fff", fontSize: 10, fontFamily: "inherit", cursor: "pointer" }}>+ Task</button>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: "var(--ember)", color: "#fff", fontSize: 9, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>A</div>
        </div>

        <div className="ws-body">
          {/* Sidebar */}
          <div className="ws-side">
            <div className="ws-side-head"><span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-300)", textTransform: "uppercase", letterSpacing: ".05em", paddingLeft: 4 }}>Clients</span><button style={{ width: 16, height: 16, borderRadius: 3, border: "1px solid var(--warm-200)", background: "#fff", color: "var(--ink-300)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>+</button></div>
            <div className="ws-side-list">
              {CLIENTS.map(c => (
                <div key={c.id}>
                  <div className={`ws-cl${clientId === c.id ? " on" : ""}`} onClick={() => { setClientId(c.id); setProjectId(PROJECTS[c.id]?.[0]?.id || ""); setSelectedTask(null); setRightPanel("pulse"); }}>
                    <div className="ws-cl-av" style={{ background: c.color }}>{c.av}{c.unread > 0 && <span className="ws-cl-unread">{c.unread}</span>}</div>
                    <div className="ws-cl-info"><div className="ws-cl-name">{c.name}</div><div className="ws-cl-meta"><div className="ws-cl-dot" style={{ background: sc(c.status) }} />{c.status === "lead" ? "Lead" : `${PROJECTS[c.id]?.length || 0} proj`}</div></div>
                    {c.owed > 0 && <span className="ws-cl-owed" style={{ color: c.status === "overdue" ? "#c24b38" : "var(--ember)" }}>${(c.owed / 1000).toFixed(1)}k</span>}
                  </div>
                  {clientId === c.id && (PROJECTS[c.id] || []).map(p => (
                    <div key={p.id} className={`ws-sp${projectId === p.id ? " on" : ""}`} onClick={() => { setProjectId(p.id); setSelectedTask(null); }}><div className="ws-sp-dot" style={{ background: sc(p.status) }} /><span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</span></div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Main */}
          <div className="ws-main">
            {/* Project header */}
            <div className="ws-ph">
              <div className="ws-ph-top">
                <div className="ws-ph-title">{proj?.name || "Overview"}<span className="ws-ph-badge" style={{ color: sc(proj?.status), borderColor: sc(proj?.status) + "20", background: sc(proj?.status) + "06" }}>{proj?.status || "—"}</span></div>
                <div className="ws-ph-btns">
                  <button className={`ws-ph-btn${rightPanel === "messages" ? " on" : ""}`} onClick={() => { setRightPanel("messages"); setSelectedTask(null); }}>✉{cl.unread > 0 ? ` ${cl.unread}` : ""}</button>
                  <button className={`ws-ph-btn${rightPanel === "files" ? " on" : ""}`} onClick={() => { setRightPanel("files"); setSelectedTask(null); }}>◻ {fileList.length}</button>
                  <button className={`ws-ph-btn e${rightPanel === "invoice" ? " on" : ""}`} onClick={() => { setRightPanel("invoice"); setSelectedTask(null); setInvSent(false); }}>$ Invoice</button>
                  <button className="ws-ph-btn p">+ Task</button>
                </div>
              </div>
            </div>

            {/* Milestone bar */}
            <div className="ws-ms">
              {MILESTONES.map((m, i) => {
                const c = m.status === "done" ? "#5a9a3c" : m.status === "active" ? "var(--ember)" : "var(--warm-300)";
                return (
                  <div key={m.id} className="ws-ms-node" onMouseEnter={() => setMsHovered(m.id)} onMouseLeave={() => setMsHovered(null)}>
                    {i < MILESTONES.length - 1 && <div className="ws-ms-line" style={{ background: m.status === "done" ? "#5a9a3c" : "var(--warm-200)" }} />}
                    <div className="ws-ms-dot" style={{ background: m.status === "pending" ? "#fff" : c, borderColor: c }}>{m.status === "done" ? "✓" : m.status === "active" ? "●" : ""}</div>
                    <div className="ws-ms-label" style={{ color: m.status === "active" ? "var(--ember)" : m.status === "done" ? "var(--ink-300)" : "var(--ink-400)" }}>{m.label}</div>
                    {msHovered === m.id && <div className="ws-ms-tip">{m.label} · {m.tasks} tasks · {m.date}</div>}
                  </div>
                );
              })}
            </div>

            {/* AI Whisper bar */}
            {visWhispers.length > 0 && (() => { const w = visWhispers[0]; return (
              <div className="ws-aw" style={{ borderLeftColor: w.color === "#c24b38" ? "rgba(194,75,56,.08)" : undefined }}>
                <span className="ws-aw-badge">✦</span>
                <span className="ws-aw-dot" style={{ background: w.color }} />
                <span className="ws-aw-text">{w.text}</span>
                <button className="ws-aw-action" style={{ color: w.color, borderColor: w.color + "20" }} onClick={() => setWhisperDismissed(p => new Set([...p, w.id]))}>{w.action}</button>
                <button className="ws-aw-x" onClick={() => setWhisperDismissed(p => new Set([...p, w.id]))}>✕</button>
                {visWhispers.length > 1 && <span className="ws-aw-more">{visWhispers.length - 1} more</span>}
              </div>
            ); })()}

            {/* Automations strip (collapsible) */}
            <div className="ws-auto">
              <div className="ws-auto-head" onClick={() => setShowAutomations(!showAutomations)}>
                <span>{showAutomations ? "▾" : "▸"}</span>
                <span>⚡ Automations</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-300)", background: "var(--warm-100)", padding: "1px 5px", borderRadius: 8 }}>{visAutos.length}</span>
              </div>
              {showAutomations && (
                <div className="ws-auto-items">
                  {visAutos.map(a => (
                    <div key={a.id} className="ws-auto-item">
                      <div className="ws-auto-icon" style={{ color: a.color, background: a.color + "08", borderColor: a.color + "12" }}>{a.icon}</div>
                      <span className="ws-auto-info">{a.title}</span>
                      <span className="ws-auto-status" style={{ color: a.status === "done" ? "#5a9a3c" : a.status === "ready" ? "var(--ember)" : "#5b7fa4" }}>{a.status === "done" ? "✓" : a.status === "ready" ? "●" : "◎"} {a.time}</span>
                      <span className="ws-auto-x" onClick={() => setAutoDismissed(p => new Set([...p, a.id]))}>✕</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats + Toolbar */}
            <div className="ws-stats">
              <span><span className="ws-stat-v">{doneTasks}/{totalTasks}</span> tasks</span>
              <Bar pct={totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0} color="#5a9a3c" h={3} />
              <span><span className="ws-stat-v">{totalLogged}h</span>/{totalEst}h</span>
              <span><span className="ws-stat-v" style={{ color: "var(--ember)" }}>${(proj?.value || 0).toLocaleString()}</span></span>
            </div>

            <div className="ws-tb">
              <div className="ws-tb-views">{["list", "board"].map(v => <button key={v} className={`ws-tb-v${view === v ? " on" : ""}`} onClick={() => setView(v)}>{v === "list" ? "☰ List" : "⊞ Board"}</button>)}</div>
              <span className="ws-tb-sep" />
              <button className="ws-tb-f" onClick={() => setGroupBy(groupBy === "status" ? "priority" : "status")}>Group: {groupBy === "status" ? "Status" : "Priority"}</button>
              <button className="ws-tb-f">Filter</button>
              <span style={{ flex: 1 }} />
              <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-300)" }}>{tasks.length} tasks</span>
            </div>

            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              {/* Tasks */}
              <div className="ws-tasks" style={{ flex: 1 }}>
                {view === "list" && grouped.map(g => (
                  <div key={g.id} className="ws-grp">
                    <div className="ws-grp-head"><div className="ws-grp-dot" style={{ background: g.color }} /><span className="ws-grp-label" style={{ color: g.color }}>{g.label}</span><span className="ws-grp-count">{g.tasks.length}</span><div className="ws-grp-line" /></div>
                    {g.tasks.map(task => {
                      const pri = PRIORITIES.find(p => p.id === task.priority); const isDone = task.status === "done"; const isExp = expanded.has(task.id);
                      const sd = task.subtasks?.filter(s => s.d).length || 0; const st = task.subtasks?.length || 0;
                      return (
                        <div key={task.id} className={`ws-t${selectedTask === task.id ? " sel" : ""}`} onClick={() => { setSelectedTask(selectedTask === task.id ? null : task.id); setRightPanel("task"); }}>
                          <div className="ws-t-pri" style={{ background: pri.color }} />
                          <div className="ws-t-chk"><div className={`ws-t-cb${isDone ? " done" : ""}`}>{isDone ? "✓" : ""}</div></div>
                          <div className="ws-t-body">
                            <div className={`ws-t-title${isDone ? " done" : ""}`}>
                              {st > 0 && <span className="ws-t-exp" onClick={e => { e.stopPropagation(); toggleExp(task.id); }}>{isExp ? "▾" : "▸"}</span>}
                              {task.title}
                              {task.comments && <span className="ws-t-bdg" style={{ color: "#5b7fa4", background: "rgba(91,127,164,.06)" }}>◇{task.comments}</span>}
                              {task.files && <span className="ws-t-bdg" style={{ color: "var(--ink-400)", background: "var(--warm-100)" }}>◻{task.files}</span>}
                            </div>
                            {isExp && st > 0 && <div className="ws-t-subs">{task.subtasks.map((sub, si) => (
                              <div key={si} className="ws-t-sub"><div className={`ws-t-sub-cb${sub.d ? " done" : ""}`}>{sub.d ? "✓" : ""}</div><span style={{ textDecoration: sub.d ? "line-through" : "none", color: sub.d ? "var(--ink-300)" : undefined }}>{sub.t}</span></div>
                            ))}</div>}
                          </div>
                          <div className="ws-t-cells">
                            {st > 0 && <div className="ws-t-cell" style={{ color: sd === st ? "#5a9a3c" : "var(--ink-400)", minWidth: 26 }}>{sd}/{st}</div>}
                            <div className="ws-t-cell" style={{ minWidth: 38 }}>{task.due}</div>
                            <div className="ws-t-cell" style={{ minWidth: 26, color: parseFloat(task.logged) > parseFloat(task.est) ? "#c24b38" : undefined }}>{task.logged}</div>
                            <button className="ws-t-timer" onClick={e => { e.stopPropagation(); startTimer(task.id); }}>▶</button>
                            <div className="ws-t-av">A</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                {view === "board" && (
                  <div style={{ display: "flex", gap: 5, height: "100%", overflowX: "auto" }}>
                    {STATUSES.map(s => { const ct = tasks.filter(t => t.status === s.id); return (
                      <div key={s.id} style={{ minWidth: 150, width: 150, flexShrink: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "3px 4px", marginBottom: 3 }}><div style={{ width: 5, height: 5, borderRadius: 2, background: s.color }} /><span style={{ fontFamily: "var(--mono)", fontSize: 8, fontWeight: 500, textTransform: "uppercase", color: s.color }}>{s.label}</span><span style={{ fontFamily: "var(--mono)", fontSize: 7, color: "var(--ink-300)" }}>{ct.length}</span></div>
                        {ct.map(t => (<div key={t.id} onClick={() => { setSelectedTask(t.id); setRightPanel("task"); }} style={{ background: "#fff", border: `1px solid ${selectedTask === t.id ? "var(--ember)" : "var(--warm-200)"}`, borderRadius: 4, padding: "5px 6px", marginBottom: 2, cursor: "pointer", fontSize: 10 }}><div style={{ fontWeight: 500, color: "var(--ink-800)", marginBottom: 2 }}>{t.title}</div><div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: 7, color: "var(--ink-300)" }}><span>{t.due}</span><span style={{ color: PRIORITIES.find(p => p.id === t.priority)?.color }}>{PRIORITIES.find(p => p.id === t.priority)?.label}</span></div></div>))}
                      </div>
                    ); })}
                  </div>
                )}
              </div>

              {/* ═══ Right Panel ═══ */}
              <div className="ws-right">
                <div className="ws-rp-tabs">
                  {[
                    { id: "pulse", label: "Pulse" },
                    { id: "task", label: "Task", dim: !selectedTask },
                    { id: "messages", label: "Chat", dot: cl.unread > 0 ? "#c24b38" : null },
                    { id: "invoice", label: "Invoice" },
                    { id: "files", label: "Files" },
                    { id: "calendar", label: "Cal" },
                  ].map(t => (
                    <button key={t.id} className={`ws-rp-tab${rightPanel === t.id ? " on" : ""}`}
                      style={{ opacity: t.dim ? 0.4 : 1 }}
                      onClick={() => { if (t.id === "task" && !selectedTask) return; setRightPanel(t.id); if (t.id !== "task") setSelectedTask(null); }}>
                      {t.label}{t.dot && <span className="ws-rp-dot" style={{ background: t.dot }} />}
                    </button>
                  ))}
                </div>

                <div className="ws-rp-body">
                  {/* Pulse */}
                  {rightPanel === "pulse" && <>
                    <div className="ws-p-stats">
                      <div className="ws-p-stat"><div className="ws-p-stat-val" style={{ color: "#5a9a3c" }}>${(cl.earned / 1000).toFixed(1)}k</div><div className="ws-p-stat-label">Earned</div></div>
                      <div className="ws-p-stat"><div className="ws-p-stat-val" style={{ color: cl.owed > 0 ? "#c24b38" : "var(--ink-300)" }}>${(cl.owed / 1000).toFixed(1)}k</div><div className="ws-p-stat-label">Owed</div></div>
                      <div className="ws-p-stat"><div className="ws-p-stat-val">{PROJECTS[clientId]?.length || 0}</div><div className="ws-p-stat-label">Projects</div></div>
                      <div className="ws-p-stat"><div className="ws-p-stat-val" style={{ color: cl.health >= 80 ? "#5a9a3c" : cl.health > 0 ? "#c24b38" : "var(--ink-300)" }}>{cl.health || "—"}</div><div className="ws-p-stat-label">Health</div></div>
                    </div>
                    <div className="ws-rp-label">Activity</div>
                    {ACTIVITY.map((a, i) => <div key={i} className="ws-p-act"><div className="ws-p-act-dot" style={{ background: a.dot }} /><span style={{ flex: 1, color: "var(--ink-500)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.text}</span><span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-300)", flexShrink: 0 }}>{a.time}</span></div>)}
                    <div className="ws-rp-label">Contact</div>
                    <div style={{ fontSize: 10, color: "var(--ink-600)" }}>{cl.contact} · <span style={{ fontFamily: "var(--mono)", color: "var(--ink-300)" }}>{cl.email}</span></div>
                    <div className="ws-rp-label">Notes</div>
                    <div style={{ fontSize: 10, color: "var(--ink-500)", lineHeight: 1.5, outline: "none", minHeight: 30 }} contentEditable suppressContentEditableWarning>
                      {clientId === "meridian" ? "Clean, minimal aesthetic. Sarah decides, CEO signs off." : clientId === "bolt" ? "Slow responder. Payment delays. Consider deposits." : clientId === "luna" ? "Referred by Meridian. June launch. ~$5–8k." : "Responsive. May 15 course launch. Tight timeline."}
                    </div>
                  </>}

                  {/* Task */}
                  {rightPanel === "task" && selTask && <>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-900)", marginBottom: 8, lineHeight: 1.3 }}>{selTask.title}</div>
                    <div className="ws-td-fields">
                      <div className="ws-td-f"><div className="ws-td-fl">Status</div><div className="ws-td-fv"><span style={{ width: 4, height: 4, borderRadius: 2, background: STATUSES.find(s => s.id === selTask.status)?.color, display: "inline-block" }} />{STATUSES.find(s => s.id === selTask.status)?.label}</div></div>
                      <div className="ws-td-f"><div className="ws-td-fl">Priority</div><div className="ws-td-fv" style={{ color: PRIORITIES.find(p => p.id === selTask.priority)?.color }}>{PRIORITIES.find(p => p.id === selTask.priority)?.label}</div></div>
                      <div className="ws-td-f"><div className="ws-td-fl">Due</div><div className="ws-td-fv">{selTask.due}</div></div>
                      <div className="ws-td-f"><div className="ws-td-fl">Time</div><div className="ws-td-fv">{selTask.logged} / {selTask.est}</div></div>
                    </div>
                    <Bar pct={parseFloat(selTask.est) > 0 ? (parseFloat(selTask.logged) / parseFloat(selTask.est)) * 100 : 0} color={parseFloat(selTask.logged) > parseFloat(selTask.est) ? "#c24b38" : "#5a9a3c"} h={3} />
                    <button onClick={() => startTimer(selTask.id)} style={{ marginTop: 6, padding: "3px 8px", borderRadius: 3, border: "1px solid var(--warm-200)", background: "#fff", fontSize: 9, fontFamily: "inherit", color: "var(--ink-500)", cursor: "pointer" }}>▶ Start Timer</button>
                    {selTask.subtasks?.length > 0 && <><div className="ws-rp-label">Subtasks · {selTask.subtasks.filter(s => s.d).length}/{selTask.subtasks.length}</div>{selTask.subtasks.map((s, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 0", borderBottom: i < selTask.subtasks.length - 1 ? "1px solid var(--warm-100)" : "none", fontSize: 10 }}><div className={`ws-t-sub-cb${s.d ? " done" : ""}`}>{s.d ? "✓" : ""}</div><span style={{ color: s.d ? "var(--ink-300)" : "var(--ink-600)", textDecoration: s.d ? "line-through" : "none" }}>{s.t}</span></div>)}</>}
                    <div className="ws-rp-label">Comment</div>
                    <div style={{ display: "flex", gap: 3 }}><input placeholder="Add comment..." style={{ flex: 1, padding: "4px 6px", border: "1px solid var(--warm-200)", borderRadius: 3, fontSize: 9, fontFamily: "inherit", outline: "none" }} /><button style={{ padding: "4px 6px", borderRadius: 3, border: "none", background: "var(--ink-900)", color: "#fff", fontSize: 8, cursor: "pointer" }}>↑</button></div>
                  </>}
                  {rightPanel === "task" && !selTask && <div style={{ textAlign: "center", padding: 20, color: "var(--ink-300)", fontSize: 11 }}>Click a task</div>}

                  {/* Messages */}
                  {rightPanel === "messages" && <>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: "#5a9a3c" }} /><span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "#5a9a3c" }}>{cl.contact} online</span></div>
                    <div style={{ display: "flex", flexDirection: "column-reverse", gap: 3, marginBottom: 6, minHeight: 180 }}>
                      {msgs.map((m, i) => <div key={i} className={`ws-msg ${m.from === "You" ? "sent" : "received"}`}>{m.from !== "You" && <div className="ws-msg-av" style={{ background: cl.color }}>{cl.av}</div>}<div className="ws-msg-b"><div>{m.text}</div><div className="ws-msg-meta">{m.from} · {m.time}{m.unread ? " · New" : ""}</div></div></div>)}
                    </div>
                    <div style={{ display: "flex", gap: 3 }}><input value={msgInput} onChange={e => setMsgInput(e.target.value)} placeholder={`Message ${cl.contact}...`} onKeyDown={e => { if (e.key === "Enter" && msgInput.trim()) { setMsgs([{ from: "You", text: msgInput, time: "now" }, ...msgs]); setMsgInput(""); } }} style={{ flex: 1, padding: "5px 7px", border: "1px solid var(--warm-200)", borderRadius: 4, fontSize: 10, fontFamily: "inherit", outline: "none" }} /><button onClick={() => { if (msgInput.trim()) { setMsgs([{ from: "You", text: msgInput, time: "now" }, ...msgs]); setMsgInput(""); } }} style={{ padding: "5px 7px", borderRadius: 4, border: "none", background: msgInput.trim() ? "var(--ink-900)" : "var(--warm-200)", color: msgInput.trim() ? "#fff" : "var(--ink-300)", fontSize: 9, cursor: "pointer" }}>↑</button></div>
                  </>}

                  {/* Invoice */}
                  {rightPanel === "invoice" && !invSent && <>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 0", borderBottom: "1px solid var(--warm-100)", marginBottom: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 5, background: cl.color, color: "#fff", fontSize: 9, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>{cl.av}</div>
                      <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-800)" }}>{cl.name}</div><div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-300)" }}>{cl.email}</div></div>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-300)" }}>INV-049</span>
                    </div>
                    {[{ d: `${proj?.name} — Design`, a: "$2,400" }, { d: "Logo overage (2h)", a: "$250" }].map((item, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--warm-100)", fontSize: 10 }}><span style={{ color: "var(--ink-600)" }}>{item.d}</span><span style={{ fontFamily: "var(--mono)", fontWeight: 500, color: "var(--ink-800)" }}>{item.a}</span></div>)}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid var(--warm-200)", marginTop: 4, fontWeight: 500, color: "var(--ink-900)", fontSize: 12 }}><span>Total</span><span style={{ fontFamily: "var(--mono)" }}>$2,650</span></div>
                    <div style={{ fontSize: 9, color: "var(--ink-400)", marginBottom: 6 }}>Due: Net 15 · Apr 15 · Stripe</div>
                    <div style={{ display: "flex", gap: 3 }}>
                      <button style={{ flex: 1, padding: 6, borderRadius: 4, border: "1px solid var(--warm-200)", background: "#fff", fontSize: 10, fontFamily: "inherit", color: "var(--ink-500)", cursor: "pointer" }}>Draft</button>
                      <button onClick={() => setInvSent(true)} style={{ flex: 1, padding: 6, borderRadius: 4, border: "none", background: "var(--ink-900)", color: "#fff", fontSize: 10, fontFamily: "inherit", cursor: "pointer" }}>Send →</button>
                    </div>
                  </>}
                  {rightPanel === "invoice" && invSent && <div style={{ textAlign: "center", padding: 20 }}><div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(90,154,60,.06)", border: "1px solid rgba(90,154,60,.1)", color: "#5a9a3c", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>✓</div><div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-900)", marginBottom: 2 }}>Sent</div><div style={{ fontSize: 10, color: "var(--ink-400)" }}>INV-049 · $2,650 → {cl.contact}</div></div>}

                  {/* Files */}
                  {rightPanel === "files" && <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-300)" }}>{fileList.length} FILES</span>
                      <div style={{ display: "flex", gap: 2 }}>
                        {["list", "grid"].map(v => <button key={v} onClick={() => setFileView(v)} style={{ width: 18, height: 18, borderRadius: 3, border: `1px solid ${fileView === v ? "var(--ink-900)" : "var(--warm-200)"}`, background: fileView === v ? "var(--ink-900)" : "#fff", color: fileView === v ? "#fff" : "var(--ink-300)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>{v === "list" ? "☰" : "⊞"}</button>)}
                      </div>
                    </div>
                    {fileView === "list" && fileList.map((f, i) => (
                      <div key={i} className="ws-file">
                        <div className="ws-file-icon" style={{ color: typeColors[f.type] || "#9b988f", background: (typeColors[f.type] || "#9b988f") + "08", borderColor: (typeColors[f.type] || "#9b988f") + "15" }}>{f.type.toUpperCase()}</div>
                        <div className="ws-file-info"><div className="ws-file-name">{f.name}</div><div className="ws-file-meta">{f.size} · {f.date}</div></div>
                        <span className="ws-file-dl">↓</span>
                      </div>
                    ))}
                    {fileView === "grid" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>{fileList.map((f, i) => (
                      <div key={i} style={{ border: "1px solid var(--warm-200)", borderRadius: 4, overflow: "hidden", cursor: "pointer" }}>
                        <div style={{ height: 40, background: (typeColors[f.type] || "#9b988f") + "06", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600, color: typeColors[f.type] }}>{f.type.toUpperCase()}</div>
                        <div style={{ padding: "3px 5px", fontSize: 9, color: "var(--ink-600)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                      </div>
                    ))}</div>}
                    <div className={`ws-file-drop${dragOver ? " over" : ""}`}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={e => { e.preventDefault(); setDragOver(false); setFileList(p => [{ name: `Upload_${Date.now()}.png`, size: "1.2 MB", date: "Now", type: "img", by: "You" }, ...p]); }}
                      onClick={() => setFileList(p => [{ name: `Upload_${Date.now()}.png`, size: "1.2 MB", date: "Now", type: "img", by: "You" }, ...p])}>
                      {dragOver ? "↓ Drop here" : "Drop files or click to upload"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 6, fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-300)" }}><div style={{ width: 3, height: 3, borderRadius: "50%", background: "#5a9a3c" }} />Shared via portal</div>
                  </>}

                  {/* Calendar */}
                  {rightPanel === "calendar" && <>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-300)", marginBottom: 6 }}>WEEK · Mar 31 – Apr 6</div>
                    <div className="ws-cal-days">
                      {WEEK.map((d, i) => (
                        <div key={i} className={`ws-cal-day${calDay === i ? " on" : ""}${d.today ? " today" : ""}`} onClick={() => setCalDay(i)}>
                          <div className="ws-cal-day-name">{d.day}</div>
                          <div className="ws-cal-day-num">{d.date}</div>
                          {d.items.length > 0 && <div className="ws-cal-day-dots">{d.items.slice(0, 3).map((item, j) => <div key={j} style={{ width: 3, height: 3, borderRadius: "50%", background: item.color }} />)}</div>}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-500)", marginBottom: 4 }}>{WEEK[calDay].day}, {WEEK[calDay].full}</div>
                    {WEEK[calDay].items.length > 0 ? WEEK[calDay].items.map((item, i) => (
                      <div key={i} className="ws-cal-item">
                        <div className="ws-cal-item-time">{item.time}</div>
                        <div className="ws-cal-item-bar" style={{ background: item.color }} />
                        <div style={{ flex: 1 }}>
                          <div className="ws-cal-item-text">{item.text}</div>
                          <div style={{ fontFamily: "var(--mono)", fontSize: 7, color: "var(--ink-300)" }}>{item.type}{item.dur ? ` · ${item.dur}` : ""}</div>
                        </div>
                      </div>
                    )) : <div style={{ textAlign: "center", padding: 16, color: "var(--ink-300)", fontSize: 10 }}>Nothing scheduled</div>}
                    <button style={{ width: "100%", padding: 5, marginTop: 6, borderRadius: 4, border: "1px dashed var(--warm-300)", background: "transparent", fontSize: 9, fontFamily: "inherit", color: "var(--ink-400)", cursor: "pointer" }}>+ Add to {WEEK[calDay].day}</button>
                  </>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timer */}
        {(timerRunning || timerTask) && (
          <div className="ws-timer">
            {timerRunning && <div className="ws-timer-pulse" />}
            <div className="ws-timer-info"><div className="ws-timer-task">{TASKS.find(t => t.id === timerTask)?.title}</div><div className="ws-timer-client">{cl.name}</div></div>
            <div className="ws-timer-time">{timerFmt}</div>
            {timerRunning && <button className="ws-timer-btn" style={{ background: "var(--warm-100)", color: "var(--ink-500)" }} onClick={() => setTimerRunning(false)}>❚❚</button>}
            {!timerRunning && <button className="ws-timer-btn" style={{ background: "var(--ink-900)", color: "#fff" }} onClick={() => setTimerRunning(true)}>▶</button>}
            <button className="ws-timer-btn" style={{ background: "#5a9a3c", color: "#fff" }} onClick={stopTimer}>✓ Log</button>
          </div>
        )}

        <div className="ws-foot"><div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 3, height: 3, borderRadius: "50%", background: "#5a9a3c" }} /><span>Synced</span></div><span>{tasks.length} tasks · {doneTasks} done · {msDone}/{MILESTONES.length} milestones</span></div>
      </div>

      {/* ⌘K */}
      {showCmd && (
        <div className="ws-cmd-o" onClick={() => setShowCmd(false)}>
          <div className="ws-cmd" onClick={e => e.stopPropagation()}>
            <div className="ws-cmd-in"><span style={{ color: "var(--ink-300)", fontSize: 12 }}>⌕</span><input ref={cmdRef} value={cmdQ} onChange={e => { setCmdQ(e.target.value); setCmdSel(0); }} placeholder="Search or type a command..." onKeyDown={e => { if (e.key === "ArrowDown") { e.preventDefault(); setCmdSel(s => Math.min(s + 1, fCmds.length - 1)); } if (e.key === "ArrowUp") { e.preventDefault(); setCmdSel(s => Math.max(s - 1, 0)); } if (e.key === "Enter" && fCmds[cmdSel]?.fn) { fCmds[cmdSel].fn(); setShowCmd(false); } if (e.key === "Escape") setShowCmd(false); }} /><span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-300)", background: "var(--warm-100)", padding: "2px 5px", borderRadius: 2 }}>ESC</span></div>
            <div className="ws-cmd-r">
              {["action", "client"].map(cat => { const items = fCmds.filter(c => c.cat === cat); if (!items.length) return null; return (<div key={cat}><div className="ws-cmd-g">{cat === "action" ? "Actions" : "Clients"}</div>{items.map((cmd, i) => { const fi = fCmds.indexOf(cmd); return (<div key={fi} className={`ws-cmd-i${cmdSel === fi ? " sel" : ""}`} onMouseEnter={() => setCmdSel(fi)} onClick={() => { cmd.fn?.(); setShowCmd(false); }}><div className="ws-cmd-ic" style={{ color: cmd.color, background: cmd.color + "08", borderColor: cmd.color + "15" }}>{cmd.icon}</div><div><div className="ws-cmd-il">{cmd.label}</div></div>{cmdSel === fi && <span style={{ fontFamily: "var(--mono)", fontSize: 7, color: "var(--ink-300)", background: "var(--warm-100)", padding: "1px 4px", borderRadius: 2, marginLeft: "auto" }}>↵</span>}</div>); })}</div>); })}
            </div>
            <div className="ws-cmd-f"><span><span className="ws-cmd-k">↑↓</span> navigate</span><span><span className="ws-cmd-k">↵</span> select</span><span><span className="ws-cmd-k">esc</span> close</span></div>
          </div>
        </div>
      )}
    </>
  );
}
