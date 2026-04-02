"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./Workspace.module.css";

/* ═══ Seed Data ═══ */

interface SubTask { t: string; d: boolean }
interface Task {
  id: string; project: string; title: string; status: string; priority: string;
  due: string; est: string; logged: string;
  subtasks?: SubTask[]; comments?: number; files?: number;
}
interface Client {
  id: string; name: string; av: string; color: string; status: string;
  owed: number; unread: number; lastActive: string; email: string;
  contact: string; earned: number; health: number; since: string;
}
interface ProjectItem { id: string; name: string; status: string; value: number }
interface Message { from: string; text: string; time: string; unread?: boolean }
interface Activity { text: string; time: string; dot: string }

const CLIENTS: Client[] = [
  { id: "meridian", name: "Meridian Studio", av: "M", color: "#7c8594", status: "active", owed: 2400, unread: 2, lastActive: "2m", email: "sarah@meridian.co", contact: "Sarah Chen", earned: 12400, health: 92, since: "Oct 2025" },
  { id: "nora", name: "Nora Kim", av: "N", color: "#a08472", status: "active", owed: 3200, unread: 0, lastActive: "1h", email: "nora@norakim.com", contact: "Nora Kim", earned: 8200, health: 88, since: "Feb 2026" },
  { id: "bolt", name: "Bolt Fitness", av: "B", color: "#8a7e63", status: "overdue", owed: 4000, unread: 1, lastActive: "3d", email: "jake@boltfitness.com", contact: "Jake Torres", earned: 6000, health: 45, since: "Jan 2026" },
  { id: "luna", name: "Luna Boutique", av: "L", color: "#7c6b9e", status: "lead", owed: 0, unread: 1, lastActive: "2h", email: "maria@luna.co", contact: "Maria Santos", earned: 0, health: 0, since: "New" },
];

const PROJECTS: Record<string, ProjectItem[]> = {
  meridian: [
    { id: "p1", name: "Brand Guidelines v2", status: "active", value: 4800 },
    { id: "p2", name: "Social Templates", status: "complete", value: 1800 },
  ],
  nora: [
    { id: "p5", name: "Course Landing Page", status: "active", value: 3200 },
    { id: "p6", name: "Email Sequence", status: "pending", value: 1200 },
  ],
  bolt: [
    { id: "p3", name: "App Onboarding", status: "overdue", value: 4000 },
    { id: "p4", name: "Blog Posts", status: "active", value: 3000 },
  ],
};

const STATUSES = [
  { id: "backlog", label: "Backlog", color: "#9b988f" },
  { id: "todo", label: "To Do", color: "#5b7fa4" },
  { id: "progress", label: "In Progress", color: "#d97706" },
  { id: "review", label: "Review", color: "#7c6b9e" },
  { id: "done", label: "Done", color: "#5a9a3c" },
];

const PRIORITIES = [
  { id: "urgent", label: "Urgent", color: "#c24b38" },
  { id: "high", label: "High", color: "#d97706" },
  { id: "medium", label: "Med", color: "#5b7fa4" },
  { id: "low", label: "Low", color: "#9b988f" },
];

const SEED_TASKS: Task[] = [
  { id: "t1", project: "p1", title: "Discovery & brand audit", status: "done", priority: "high", due: "Mar 20", est: "8h", logged: "7.5h", subtasks: [{ t: "Competitive analysis", d: true }, { t: "Stakeholder interviews", d: true }, { t: "Brand inventory", d: true }] },
  { id: "t2", project: "p1", title: "Logo concept exploration", status: "done", priority: "high", due: "Mar 25", est: "12h", logged: "14h", subtasks: [{ t: "Moodboard", d: true }, { t: "Concept A — wordmark", d: true }, { t: "Concept B — symbol", d: true }, { t: "Concept C — abstract", d: true }] },
  { id: "t3", project: "p1", title: "Color palette & typography system", status: "progress", priority: "high", due: "Apr 2", est: "6h", logged: "3h", comments: 3, files: 1, subtasks: [{ t: "Primary palette (5 colors)", d: true }, { t: "Secondary & accent colors", d: false }, { t: "Heading font pairing", d: true }, { t: "Body & mono selection", d: false }] },
  { id: "t4", project: "p1", title: "Brand guidelines document", status: "todo", priority: "medium", due: "Apr 5", est: "16h", logged: "0h", subtasks: [{ t: "Cover & TOC", d: false }, { t: "Logo usage rules", d: false }, { t: "Color specs", d: false }, { t: "Typography scales", d: false }, { t: "Photo direction", d: false }, { t: "Social guidelines", d: false }] },
  { id: "t5", project: "p1", title: "Social media template kit", status: "backlog", priority: "low", due: "Apr 10", est: "8h", logged: "0h", subtasks: [{ t: "IG posts (4x)", d: false }, { t: "IG stories (4x)", d: false }, { t: "LinkedIn (2x)", d: false }, { t: "X/Twitter (2x)", d: false }] },
  { id: "t6", project: "p1", title: "Client review & revisions", status: "review", priority: "urgent", due: "Apr 1", est: "4h", logged: "1.5h", comments: 5, files: 2, subtasks: [{ t: "Address color feedback", d: false }, { t: "Revise teal → warmer", d: false }, { t: "CEO sign-off on logo", d: false }] },
];

const SEED_MESSAGES: Message[] = [
  { from: "Sarah", text: "Can we adjust the color palette? The teal feels too cold.", time: "2m ago", unread: true },
  { from: "Sarah", text: "Love the logo direction! Concept B it is.", time: "1d ago", unread: true },
  { from: "You", text: "Updated scope with additional social templates.", time: "2d ago" },
  { from: "Sarah", text: "Sounds great. Timeline looking ok?", time: "3d ago" },
  { from: "You", text: "On track — guidelines draft by end of week.", time: "4d ago" },
];

const SEED_ACTIVITY: Activity[] = [
  { text: "Sarah viewed proposal", time: "2m", dot: "#5b7fa4" },
  { text: "Payment received · $1,800", time: "3h", dot: "#5a9a3c" },
  { text: "3 comments on scope", time: "2d", dot: "#d97706" },
  { text: "Contract signed", time: "2w", dot: "#5a9a3c" },
  { text: "Proposal sent · $4,800", time: "2w", dot: "var(--ember)" },
];

const CLIENT_NOTES: Record<string, string> = {
  meridian: "Prefers clean, minimal aesthetic. Sarah is decision-maker, CEO (James) has final sign-off.",
  bolt: "Slow to respond. Payment delays are a pattern. Consider deposits.",
  luna: "Referred by Meridian. Boutique fashion, June launch. ~$5-8k project.",
  nora: "Very responsive. Course launches May 15. Tight timeline.",
};

const sc = (s: string) => s === "active" ? "#5a9a3c" : s === "overdue" ? "#c24b38" : s === "lead" ? "#5b7fa4" : s === "complete" ? "#5a9a3c" : "#9b988f";

function Bar({ pct, color, h = 3 }: { pct: number; color: string; h?: number }) {
  return <div style={{ height: h, background: "var(--warm-200)", borderRadius: h / 2, overflow: "hidden", flex: 1 }}><div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: h / 2 }} /></div>;
}

/* ═══ Component ═══ */

type RightPanel = "pulse" | "task" | "messages" | "invoice";

export default function WorkspacePage() {
  const [clientId, setClientId] = useState("meridian");
  const [projectId, setProjectId] = useState("p1");
  const [view, setView] = useState("list");
  const [groupBy, setGroupBy] = useState("status");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["t3", "t6"]));
  const [allTasks, setAllTasks] = useState<Task[]>(SEED_TASKS);

  // Right panel
  const [rightPanel, setRightPanel] = useState<RightPanel>("pulse");

  // Timer
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerTaskId, setTimerTaskId] = useState<string | null>(null);
  const [timerSecs, setTimerSecs] = useState(0);

  // Messages
  const [msgs, setMsgs] = useState<Message[]>(SEED_MESSAGES);
  const [msgInput, setMsgInput] = useState("");

  // Invoice
  const [invSent, setInvSent] = useState(false);

  // Command bar
  const [showCmdBar, setShowCmdBar] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");
  const [cmdSel, setCmdSel] = useState(0);
  const cmdRef = useRef<HTMLInputElement>(null);

  const cl = CLIENTS.find(c => c.id === clientId)!;
  const tasks = allTasks.filter(t => t.project === projectId);
  const selTask = selectedTask ? allTasks.find(t => t.id === selectedTask) : null;
  const proj = PROJECTS[clientId]?.find(p => p.id === projectId);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === "done").length;
  const totalLogged = tasks.reduce((s, t) => s + parseFloat(t.logged), 0);
  const totalEst = tasks.reduce((s, t) => s + parseFloat(t.est), 0);

  const grouped = (groupBy === "status" ? STATUSES : PRIORITIES)
    .map(g => ({ ...g, tasks: tasks.filter(t => (groupBy === "status" ? t.status : t.priority) === g.id) }))
    .filter(g => g.tasks.length > 0);

  // Timer tick
  useEffect(() => {
    if (!timerRunning) return;
    const i = setInterval(() => setTimerSecs(s => s + 1), 1000);
    return () => clearInterval(i);
  }, [timerRunning]);

  // ⌘K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowCmdBar(true); setCmdQuery(""); setCmdSel(0); }
      if (e.key === "Escape") setShowCmdBar(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => { if (showCmdBar) cmdRef.current?.focus(); }, [showCmdBar]);

  // Auto-switch to task panel when selecting a task
  useEffect(() => {
    if (!selectedTask) return;
    const frame = requestAnimationFrame(() => setRightPanel("task"));
    return () => cancelAnimationFrame(frame);
  }, [selectedTask]);

  const toggleExpand = (id: string) => { setExpanded(p => { const n = new Set(p); if (n.has(id)) { n.delete(id); } else { n.add(id); } return n; }); };

  const startTimer = useCallback((taskId: string) => { setTimerTaskId(taskId); setTimerSecs(0); setTimerRunning(true); }, []);
  const stopAndLogTimer = useCallback(() => {
    if (timerTaskId && timerSecs > 0) {
      const hours = Math.round((timerSecs / 3600) * 10) / 10;
      setAllTasks(prev => prev.map(t => t.id === timerTaskId ? { ...t, logged: `${(parseFloat(t.logged) + hours).toFixed(1)}h` } : t));
    }
    setTimerRunning(false); setTimerSecs(0); setTimerTaskId(null);
  }, [timerTaskId, timerSecs]);

  const openPanel = (panel: RightPanel) => { setRightPanel(panel); if (panel !== "task") setSelectedTask(null); };

  const timerFmt = `${Math.floor(timerSecs / 3600) > 0 ? Math.floor(timerSecs / 3600) + ":" : ""}${String(Math.floor((timerSecs % 3600) / 60)).padStart(2, "0")}:${String(timerSecs % 60).padStart(2, "0")}`;
  const timerTaskName = timerTaskId ? allTasks.find(t => t.id === timerTaskId)?.title : null;

  // Command palette
  const cmds = [
    { icon: "$", label: `Create invoice for ${cl.name}`, sub: "Quick Invoice", cat: "action", color: "#5a9a3c", fn: () => openPanel("invoice") },
    { icon: "✉", label: `Message ${cl.contact}`, sub: cl.name, cat: "action", color: "#5b7fa4", fn: () => openPanel("messages") },
    { icon: "▶", label: "Start timer on current task", sub: "Time Tracking", cat: "action", color: "#d97706", fn: () => { if (selectedTask) startTimer(selectedTask); } },
    ...CLIENTS.map(c => ({ icon: c.av, label: c.name, sub: `${PROJECTS[c.id]?.length || 0} projects`, cat: "client", color: c.color, fn: () => { setClientId(c.id); setProjectId(PROJECTS[c.id]?.[0]?.id || ""); openPanel("pulse"); } })),
  ];
  const filteredCmds = cmdQuery ? cmds.filter(c => c.label.toLowerCase().includes(cmdQuery.toLowerCase())) : cmds;

  const sendMsg = () => {
    if (!msgInput.trim()) return;
    setMsgs(prev => [{ from: "You", text: msgInput, time: "now" }, ...prev]);
    setMsgInput("");
  };

  return (
    <div className={styles.root}>
      <div className={styles.body}>
      {/* ═══ Sidebar ═══ */}
      <div className={styles.side}>
        <div className={styles.sideHead}>
          <span className={styles.sideTitle}>Clients</span>
          <button className={styles.sideAdd}>+</button>
        </div>
        <div className={styles.sideClients}>
          {CLIENTS.map(c => (
            <div key={c.id}>
              <div className={`${styles.cl} ${clientId === c.id ? styles.clOn : ""}`} onClick={() => { setClientId(c.id); setProjectId(PROJECTS[c.id]?.[0]?.id || ""); setSelectedTask(null); setRightPanel("pulse"); }}>
                <div className={styles.clAv} style={{ background: c.color }}>
                  {c.av}
                  {c.unread > 0 && <span className={styles.clUnread}>{c.unread}</span>}
                </div>
                <div className={styles.clInfo}>
                  <div className={styles.clName}>{c.name}</div>
                  <div className={styles.clMeta}><div className={styles.clDot} style={{ background: sc(c.status) }} />{c.status === "lead" ? "Lead" : `${PROJECTS[c.id]?.length || 0} proj`}</div>
                </div>
                {c.owed > 0 && <span className={styles.clOwed} style={{ color: c.status === "overdue" ? "#c24b38" : "var(--ember)" }}>${(c.owed / 1000).toFixed(1)}k</span>}
              </div>
              {clientId === c.id && (PROJECTS[c.id] || []).map(p => (
                <div className={styles.sideProjects} key={p.id}>
                  <div className={`${styles.sideProj} ${projectId === p.id ? styles.sideProjOn : ""}`} onClick={() => { setProjectId(p.id); setSelectedTask(null); }}>
                    <div className={styles.sideProjDot} style={{ background: sc(p.status) }} />
                    <span className={styles.sideProjName}>{p.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Main ═══ */}
      <div className={styles.main}>
        {/* Project header */}
        <div className={styles.ph}>
          <div className={styles.phTop}>
            <div className={styles.phTitle}>
              {proj?.name || "Overview"}
              <span className={styles.phStatus} style={{ color: sc(proj?.status || "active"), borderColor: sc(proj?.status || "active") + "20", background: sc(proj?.status || "active") + "06" }}>
                {proj?.status || "—"}
              </span>
            </div>
            <div className={styles.phActions}>
              <button className={`${styles.phBtn} ${rightPanel === "messages" ? styles.phBtnPrimary : ""}`} onClick={() => openPanel("messages")}>✉ Messages{cl.unread > 0 ? ` (${cl.unread})` : ""}</button>
              <button className={`${styles.phBtn} ${styles.phBtnEmber} ${rightPanel === "invoice" ? styles.phBtnPrimary : ""}`} onClick={() => openPanel("invoice")}>$ Invoice</button>
              <button className={`${styles.phBtn} ${styles.phBtnPrimary}`}>+ Task</button>
            </div>
          </div>
          <div className={styles.phStats}>
            <span><span className={styles.phStatVal}>{doneTasks}/{totalTasks}</span> tasks</span>
            <Bar pct={totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0} color="#5a9a3c" h={4} />
            <span><span className={styles.phStatVal}>{totalLogged}h</span>/{totalEst}h</span>
            <span><span className={styles.phStatVal} style={{ color: "var(--ember)" }}>${(proj?.value || 0).toLocaleString()}</span></span>
          </div>
        </div>

        {/* Toolbar */}
        <div className={styles.tb}>
          <div className={styles.tbViews}>
            {(["list", "board"] as const).map(v => (
              <button key={v} className={`${styles.tbView} ${view === v ? styles.tbViewOn : ""}`} onClick={() => setView(v)}>
                {v === "list" ? "☰ List" : "⊞ Board"}
              </button>
            ))}
          </div>
          <span className={styles.tbSep} />
          <button className={styles.tbFilter} onClick={() => setGroupBy(groupBy === "status" ? "priority" : "status")}>
            Group: {groupBy === "status" ? "Status" : "Priority"}
          </button>
          <button className={styles.tbFilter}>Filter</button>
          <span className={styles.tbSpacer} />
          <span className={styles.tbCount}>{tasks.length} tasks</span>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* ═══ Task area ═══ */}
          <div className={styles.tasks} style={{ flex: 1 }}>
            {view === "list" && grouped.map(group => (
              <div key={group.id} className={styles.group}>
                <div className={styles.groupHead}>
                  <div className={styles.groupDot} style={{ background: group.color }} />
                  <span className={styles.groupLabel} style={{ color: group.color }}>{group.label}</span>
                  <span className={styles.groupCount}>{group.tasks.length}</span>
                  <div className={styles.groupLine} />
                </div>
                {group.tasks.map(task => {
                  const pri = PRIORITIES.find(p => p.id === task.priority)!;
                  const isDone = task.status === "done";
                  const isExp = expanded.has(task.id);
                  const subsTotal = task.subtasks?.length || 0;
                  return (
                    <div key={task.id}>
                      <div className={`${styles.task} ${selectedTask === task.id ? styles.taskSelected : ""}`}
                        onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}>
                        <div className={styles.taskPri} style={{ background: pri.color }} />
                        <div className={styles.taskCheck}>
                          <div className={`${styles.taskCb} ${isDone ? styles.taskCbDone : ""}`}>{isDone ? "✓" : ""}</div>
                        </div>
                        <div className={styles.taskBody}>
                          <div className={`${styles.taskTitle} ${isDone ? styles.taskTitleDone : ""}`}>
                            {subsTotal > 0 && <span className={styles.taskExpand} onClick={e => { e.stopPropagation(); toggleExpand(task.id); }}>{isExp ? "▾" : "▸"}</span>}
                            {task.title}
                            <span className={styles.taskBadges}>
                              {task.comments && <span className={styles.taskBadge} style={{ color: "#5b7fa4", background: "rgba(91,127,164,0.06)" }}>◇{task.comments}</span>}
                              {task.files && <span className={styles.taskBadge} style={{ color: "var(--ink-400)", background: "var(--warm-100)" }}>◻{task.files}</span>}
                            </span>
                          </div>
                          {isExp && subsTotal > 0 && (
                            <div className={styles.taskSubs}>
                              {task.subtasks!.map((sub, si) => (
                                <div key={si} className={styles.taskSub}>
                                  <div className={`${styles.taskSubCb} ${sub.d ? styles.taskSubCbDone : ""}`}>{sub.d ? "✓" : ""}</div>
                                  <span className={sub.d ? styles.taskSubTextDone : ""}>{sub.t}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {view === "board" && (
              <div className={styles.board}>
                {STATUSES.map(status => {
                  const colTasks = tasks.filter(t => t.status === status.id);
                  return (
                    <div key={status.id} className={styles.boardCol}>
                      <div className={styles.boardColHead}>
                        <div className={styles.boardColDot} style={{ background: status.color }} />
                        <span className={styles.boardColName} style={{ color: status.color }}>{status.label}</span>
                        <span className={styles.boardColCount}>{colTasks.length}</span>
                      </div>
                      <div className={styles.boardCards}>
                        {colTasks.map(task => {
                          const pri = PRIORITIES.find(p => p.id === task.priority)!;
                          return (
                            <div key={task.id} className={`${styles.boardCard} ${selectedTask === task.id ? styles.taskSelected : ""}`} onClick={() => setSelectedTask(task.id)}>
                              <div className={styles.boardCardTitle}>{task.title}</div>
                              <div className={styles.boardCardMeta}>
                                <span className={styles.boardCardDue}>{task.due}</span>
                                <span className={styles.boardCardPri} style={{ color: pri.color, borderColor: pri.color + "20", background: pri.color + "06" }}>{pri.label}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ═══ Right Panel — Context Sensitive ═══ */}
          <div className={styles.right}>
            <div className={styles.rpTabs}>
              <button className={`${styles.rpTab} ${rightPanel === "pulse" ? styles.rpTabOn : ""}`} onClick={() => openPanel("pulse")}>Pulse</button>
              <button className={`${styles.rpTab} ${rightPanel === "task" ? styles.rpTabOn : ""}`} onClick={() => { if (selectedTask) setRightPanel("task"); }} style={{ opacity: selectedTask ? 1 : 0.4 }}>Task</button>
              <button className={`${styles.rpTab} ${rightPanel === "messages" ? styles.rpTabOn : ""}`} onClick={() => openPanel("messages")}>Chat{cl.unread > 0 && <span className={styles.rpDot} />}</button>
              <button className={`${styles.rpTab} ${rightPanel === "invoice" ? styles.rpTabOn : ""}`} onClick={() => openPanel("invoice")}>Invoice</button>
            </div>

            <div className={styles.rpBody}>
              {/* ── Pulse ── */}
              {rightPanel === "pulse" && (
                <>
                  <div className={styles.pStats}>
                    <div className={styles.pStat}><div className={styles.pStatVal} style={{ color: "#5a9a3c" }}>${(cl.earned / 1000).toFixed(1)}k</div><div className={styles.pStatLabel}>Earned</div></div>
                    <div className={styles.pStat}><div className={styles.pStatVal} style={{ color: cl.owed > 0 ? "#c24b38" : "var(--ink-300)" }}>${(cl.owed / 1000).toFixed(1)}k</div><div className={styles.pStatLabel}>Owed</div></div>
                    <div className={styles.pStat}><div className={styles.pStatVal} style={{ color: "var(--ink-800)" }}>{PROJECTS[clientId]?.length || 0}</div><div className={styles.pStatLabel}>Projects</div></div>
                    <div className={styles.pStat}><div className={styles.pStatVal} style={{ color: cl.health >= 80 ? "#5a9a3c" : cl.health >= 50 ? "#d97706" : cl.health > 0 ? "#c24b38" : "var(--ink-300)" }}>{cl.health || "—"}</div><div className={styles.pStatLabel}>Health</div></div>
                  </div>
                  <div className={styles.pLabel}>Activity</div>
                  {SEED_ACTIVITY.map((a, i) => (
                    <div key={i} className={styles.pAct}><div className={styles.pActDot} style={{ background: a.dot }} /><span className={styles.pActText}>{a.text}</span><span className={styles.pActTime}>{a.time}</span></div>
                  ))}
                  <div className={styles.pLabel}>Contact</div>
                  <div style={{ fontSize: 11, color: "var(--ink-600)", marginBottom: 2 }}>{cl.contact}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-300)", marginBottom: 8 }}>{cl.email} · Since {cl.since}</div>
                  <div className={styles.pLabel}>Notes</div>
                  <div className={styles.pNotes} contentEditable suppressContentEditableWarning>{CLIENT_NOTES[clientId] || ""}</div>
                </>
              )}

              {/* ── Task Detail ── */}
              {rightPanel === "task" && selTask && (
                <>
                  <div className={styles.tdHead}>{selTask.title}</div>
                  <div className={styles.tdFields}>
                    <div className={styles.tdField}><div className={styles.tdFieldLabel}>Status</div><div className={styles.tdFieldVal}><span style={{ width: 5, height: 5, borderRadius: 2, background: STATUSES.find(s => s.id === selTask.status)?.color, display: "inline-block" }} />{STATUSES.find(s => s.id === selTask.status)?.label}</div></div>
                    <div className={styles.tdField}><div className={styles.tdFieldLabel}>Priority</div><div className={styles.tdFieldVal} style={{ color: PRIORITIES.find(p => p.id === selTask.priority)?.color }}>{PRIORITIES.find(p => p.id === selTask.priority)?.label}</div></div>
                    <div className={styles.tdField}><div className={styles.tdFieldLabel}>Due</div><div className={styles.tdFieldVal}>{selTask.due}</div></div>
                    <div className={styles.tdField}><div className={styles.tdFieldLabel}>Time</div><div className={styles.tdFieldVal}>{selTask.logged} / {selTask.est}</div></div>
                  </div>
                  <Bar pct={parseFloat(selTask.est) > 0 ? (parseFloat(selTask.logged) / parseFloat(selTask.est)) * 100 : 0} color={parseFloat(selTask.logged) > parseFloat(selTask.est) ? "#c24b38" : "#5a9a3c"} h={3} />
                  <button className={styles.detailTimer} onClick={() => startTimer(selTask.id)}>
                    {timerTaskId === selTask.id && timerRunning ? "⏸ Pause" : "▶ Start Timer"}
                  </button>
                  {selTask.subtasks && selTask.subtasks.length > 0 && (
                    <>
                      <div className={styles.pLabel}>Subtasks · {selTask.subtasks.filter(s => s.d).length}/{selTask.subtasks.length}</div>
                      {selTask.subtasks.map((sub, i) => (
                        <div key={i} className={styles.detailSubRow}>
                          <div className={`${styles.taskSubCb} ${sub.d ? styles.taskSubCbDone : ""}`} style={{ width: 13, height: 13, borderRadius: 3 }}>{sub.d ? "✓" : ""}</div>
                          <span style={{ fontSize: 11, color: sub.d ? "var(--ink-300)" : "var(--ink-600)", textDecoration: sub.d ? "line-through" : "none", flex: 1 }}>{sub.t}</span>
                        </div>
                      ))}
                    </>
                  )}
                  <div className={styles.pLabel}>Comments</div>
                  <div className={styles.detailCommentRow}>
                    <input className={styles.detailCommentInput} placeholder="Add a comment..." />
                    <button className={styles.detailCommentSend}>↑</button>
                  </div>
                </>
              )}
              {rightPanel === "task" && !selTask && (
                <div style={{ textAlign: "center", padding: 24, color: "var(--ink-300)", fontSize: 12 }}>Click a task to see details</div>
              )}

              {/* ── Messages ── */}
              {rightPanel === "messages" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#5a9a3c" }} />
                    <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#5a9a3c" }}>{cl.contact} online</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column-reverse", gap: 4, marginBottom: 8, minHeight: 200 }}>
                    {msgs.map((m, i) => (
                      <div key={i} className={`${styles.msg} ${m.from === "You" ? styles.msgSent : styles.msgReceived}`}>
                        {m.from !== "You" && <div className={styles.msgAv} style={{ background: cl.color }}>{cl.av}</div>}
                        <div className={styles.msgBubble}>
                          <div>{m.text}</div>
                          <div className={styles.msgMeta}>{m.from} · {m.time}{m.unread ? " · New" : ""}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.detailCommentRow}>
                    <input className={styles.detailCommentInput} value={msgInput} onChange={e => setMsgInput(e.target.value)} placeholder={`Message ${cl.contact}...`} onKeyDown={e => { if (e.key === "Enter") sendMsg(); }} />
                    <button className={styles.detailCommentSend} style={{ background: msgInput.trim() ? "var(--ink-900)" : "var(--warm-200)", color: msgInput.trim() ? "#fff" : "var(--ink-300)" }} onClick={sendMsg}>↑</button>
                  </div>
                </>
              )}

              {/* ── Quick Invoice ── */}
              {rightPanel === "invoice" && !invSent && (
                <>
                  <div className={styles.qiClient}>
                    <div className={styles.qiAv} style={{ background: cl.color }}>{cl.av}</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-800)" }}>{cl.name}</div><div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-300)" }}>{cl.email}</div></div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-300)" }}>INV-049</span>
                  </div>
                  <div className={styles.qiItem}><span className={styles.qiItemDesc}>{proj?.name} — Design</span><span className={styles.qiItemAmt}>$2,400</span></div>
                  <div className={styles.qiItem}><span className={styles.qiItemDesc}>Logo overage (2h)</span><span className={styles.qiItemAmt}>$250</span></div>
                  <button style={{ border: "none", background: "none", fontSize: 10, color: "var(--ink-300)", cursor: "pointer", padding: "5px 0" }}>+ Add line item</button>
                  <div className={styles.qiTotal}><span>Total</span><span style={{ fontFamily: "var(--mono)", fontWeight: 600 }}>$2,650</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 10, color: "var(--ink-400)" }}><span>Due</span><span style={{ fontFamily: "var(--mono)", color: "var(--ink-600)" }}>Net 15 · Apr 15</span></div>
                  <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                    <button className={styles.phBtn} style={{ flex: 1, textAlign: "center", justifyContent: "center" }}>Save Draft</button>
                    <button className={`${styles.phBtn} ${styles.phBtnPrimary}`} style={{ flex: 1, textAlign: "center", justifyContent: "center" }} onClick={() => setInvSent(true)}>Send →</button>
                  </div>
                </>
              )}
              {rightPanel === "invoice" && invSent && (
                <div style={{ textAlign: "center", padding: 24 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(90,154,60,0.06)", border: "1px solid rgba(90,154,60,0.1)", color: "#5a9a3c", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>✓</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-900)", marginBottom: 2 }}>Invoice sent</div>
                  <div style={{ fontSize: 11, color: "var(--ink-400)", marginBottom: 10 }}>INV-049 · $2,650 → {cl.contact}</div>
                  <button className={styles.phBtn} onClick={() => setInvSent(false)}>Create another</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* ═══ Timer Bar ═══ */}
      {(timerRunning || timerTaskId) && (
        <div className={styles.timerBar}>
          {timerRunning && <div className={styles.timerPulse} />}
          <div className={styles.timerInfo}><div className={styles.timerTask}>{timerTaskName}</div><div className={styles.timerClient}>{cl.name}</div></div>
          <div className={styles.timerTime}>{timerFmt}</div>
          {timerRunning && <button className={`${styles.timerBtn} ${styles.timerBtnStop}`} onClick={() => setTimerRunning(false)}>❚❚</button>}
          {!timerRunning && <button className={`${styles.timerBtn} ${styles.timerBtnStart}`} onClick={() => setTimerRunning(true)}>▶</button>}
          <button className={`${styles.timerBtn} ${styles.timerBtnLog}`} onClick={stopAndLogTimer}>✓ Log</button>
        </div>
      )}

      <div className={styles.foot}>
        <div className={styles.footL}><span className={styles.footDot} /><span>Synced</span></div>
        <span>{tasks.length} tasks · {doneTasks} done · {totalLogged}h logged</span>
      </div>

      {/* ═══ ⌘K Command Bar ═══ */}
      {showCmdBar && (
        <div className={styles.cmdOverlay} onClick={() => setShowCmdBar(false)}>
          <div className={styles.cmd} onClick={e => e.stopPropagation()}>
            <div className={styles.cmdInputRow}>
              <span style={{ color: "var(--ink-300)", fontSize: 12 }}>⌕</span>
              <input ref={cmdRef} className={styles.cmdInput} value={cmdQuery} onChange={e => { setCmdQuery(e.target.value); setCmdSel(0); }} placeholder="Search or type a command..."
                onKeyDown={e => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setCmdSel(s => Math.min(s + 1, filteredCmds.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setCmdSel(s => Math.max(s - 1, 0)); }
                  if (e.key === "Enter" && filteredCmds[cmdSel]) { filteredCmds[cmdSel].fn(); setShowCmdBar(false); }
                  if (e.key === "Escape") setShowCmdBar(false);
                }} />
              <span className={styles.cmdEsc}>ESC</span>
            </div>
            <div className={styles.cmdResults}>
              {(["action", "client"] as const).map(cat => {
                const items = filteredCmds.filter(c => c.cat === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat}>
                    <div className={styles.cmdGroup}>{cat === "action" ? "Actions" : "Clients"}</div>
                    {items.map((cmd) => {
                      const flatIdx = filteredCmds.indexOf(cmd);
                      return (
                        <div key={flatIdx} className={`${styles.cmdItem} ${cmdSel === flatIdx ? styles.cmdItemSel : ""}`}
                          onMouseEnter={() => setCmdSel(flatIdx)} onClick={() => { cmd.fn?.(); setShowCmdBar(false); }}>
                          <div className={styles.cmdItemIcon} style={{ color: cmd.color, background: cmd.color + "08", borderColor: cmd.color + "15" }}>{cmd.icon}</div>
                          <div className={styles.cmdItemInfo}><div className={styles.cmdItemLabel}>{cmd.label}</div><div className={styles.cmdItemSub}>{cmd.sub}</div></div>
                          {cmdSel === flatIdx && <span className={styles.cmdItemEnter}>↵</span>}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              {filteredCmds.length === 0 && <div style={{ padding: 16, textAlign: "center", color: "var(--ink-300)", fontSize: 12 }}>No results</div>}
            </div>
            <div className={styles.cmdFoot}><span><span className={styles.cmdKey}>↑↓</span> navigate</span><span><span className={styles.cmdKey}>↵</span> select</span><span><span className={styles.cmdKey}>esc</span> close</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
