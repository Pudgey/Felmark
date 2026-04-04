"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./ClientHub.module.css";

interface ClientHubProps {
  clientId: string;
  clientName: string;
  clientAvatar: string;
  clientColor: string;
  onClose: () => void;
}

interface Sub { t: string; d: boolean }
interface Comment { user: string; av: string; time: string; text: string; reactions?: string[] }
interface Task {
  id: string; title: string; section: "todo" | "active" | "done"; pri: "urgent" | "high" | "medium" | "low";
  due: string; overdue?: boolean; assignee: string; subs: Sub[]; est: string; actual: string;
  timer?: boolean; pct: number; desc: string; tags: string[]; comments: Comment[];
}

const INIT_TASKS: Task[] = [
  { id: "t1", title: "Client review & revisions", section: "todo", pri: "urgent", due: "Apr 1", overdue: true, assignee: "You", subs: [{ t: "Address color feedback", d: false }, { t: "Revise teal \u2192 warmer", d: false }, { t: "CEO sign-off", d: false }], est: "4h", actual: "1h 51m", pct: 0, desc: "Review all brand assets with Sarah. Address feedback on color temperature.", tags: ["revision"], comments: [{ user: "Sarah Chen", av: "SC", time: "2h ago", text: "Can we shift the teal to something warmer? The current palette feels too clinical.", reactions: ["\ud83d\udc4d 1"] }, { user: "You", av: "AX", time: "1h ago", text: "Noted \u2014 I'll explore a warmer direction. Will have options by tomorrow." }] },
  { id: "t2", title: "Color palette & typography", section: "active", pri: "high", due: "Apr 2", assignee: "You", subs: [{ t: "Primary palette", d: true }, { t: "Secondary & accents", d: false }, { t: "Heading fonts", d: true }, { t: "Body & mono fonts", d: false }], est: "6h", actual: "3h 12m", timer: true, pct: 50, desc: "Define the complete color system and typography scale.", tags: ["design", "active"], comments: [{ user: "You", av: "AX", time: "3h ago", text: "Started with 3 palette directions. Leaning toward option B.", reactions: ["\ud83d\udd25 1"] }] },
  { id: "t3", title: "Brand guidelines document", section: "todo", pri: "medium", due: "Apr 5", assignee: "You", subs: [{ t: "Cover & TOC", d: false }, { t: "Logo usage rules", d: false }, { t: "Color specifications", d: false }, { t: "Typography guide", d: false }, { t: "Photography direction", d: false }, { t: "Social guidelines", d: false }], est: "16h", actual: "0m", pct: 0, desc: "Master brand guidelines PDF. 30-40 pages covering all visual identity standards.", tags: ["deliverable"], comments: [] },
  { id: "t4", title: "Typography scale & pairings", section: "todo", pri: "medium", due: "Apr 5", assignee: "You", subs: [], est: "4h", actual: "0m", pct: 0, desc: "", tags: [], comments: [] },
  { id: "t5", title: "Imagery direction & moodboard", section: "todo", pri: "low", due: "Apr 7", assignee: "You", subs: [], est: "6h", actual: "0m", pct: 0, desc: "", tags: ["research"], comments: [] },
  { id: "t6", title: "Social media templates", section: "done", pri: "low", due: "Mar 20", assignee: "You", subs: [], est: "8h", actual: "7h 45m", pct: 100, desc: "12 post templates + 4 story templates for Instagram and LinkedIn.", tags: ["deliverable"], comments: [{ user: "Sarah Chen", av: "SC", time: "Mar 22", text: "These look amazing! Team loves them. \u2728", reactions: ["\u2764\ufe0f 2"] }] },
  { id: "t7", title: "Kickoff meeting notes", section: "done", pri: "low", due: "Mar 15", assignee: "You", subs: [], est: "1h", actual: "1h 10m", pct: 100, desc: "", tags: [], comments: [] },
];

const SECTIONS = [
  { id: "todo" as const, label: "To Do", icon: "\u25cb" },
  { id: "active" as const, label: "In Progress", icon: "\u25d0" },
  { id: "done" as const, label: "Done", icon: "\u25cf" },
];

const NAV_ITEMS = [
  { id: "tasks", icon: "\u25c6", label: "Tasks", count: "7" },
  { id: "deliverables", icon: "\u2192", label: "Deliverables", count: "3" },
  { id: "time", icon: "\u25b6", label: "Time & Billing", count: "" },
  { id: "invoices", icon: "$", label: "Invoices", count: "3" },
  { id: "files", icon: "\u2601", label: "Files", count: "9" },
  { id: "scope", icon: "\u25ce", label: "Scope", count: "" },
];

const priColor = (p: string) => p === "urgent" ? "#ef5350" : p === "high" ? "#ff9800" : p === "medium" ? "#2962ff" : "#a5a49f";
const priLabel = (p: string) => p === "urgent" ? "Urgent" : p === "high" ? "High" : p === "medium" ? "Medium" : "Low";

export default function ClientHub({ clientId, clientName, clientAvatar, clientColor, onClose }: ClientHubProps) {
  const [tasks, setTasks] = useState<Task[]>(INIT_TASKS);
  const [selected, setSelected] = useState<string | null>("t1");
  const [navItem, setNavItem] = useState("tasks");
  const [commentText, setCommentText] = useState("");
  const [viewTab, setViewTab] = useState<"list" | "board" | "timeline">("list");
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [dwTab, setDwTab] = useState<"detail" | "comments">("detail");
  const [timer, setTimer] = useState(4934);
  const hubRef = useRef<HTMLDivElement>(null);

  useEffect(() => { hubRef.current?.scrollTo(0, 0); setSelected("t1"); setNavItem("tasks"); setCollapsedSections(new Set()); setDwTab("detail"); }, [clientId]);
  useEffect(() => { const t = setInterval(() => setTimer(s => s + 1), 1000); return () => clearInterval(t); }, []);

  const toggleSection = (id: string) => setCollapsedSections(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const fmt = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const task = selected ? tasks.find(t => t.id === selected) ?? null : null;

  const handleDrop = (targetSection: Task["section"]) => {
    if (!dragId) return;
    setTasks(prev => prev.map(t => t.id === dragId ? { ...t, section: targetSection, overdue: targetSection !== "todo" ? false : t.overdue, pct: targetSection === "done" ? 100 : t.pct } : t));
    setDragId(null);
  };
  const [dragId, setDragId] = useState<string | null>(null);

  return (
    <div className={styles.hub} ref={hubRef}>
      <div className={styles.layout}>
        {/* Left nav */}
        <div className={styles.nav}>
          <div className={styles.navClient}>
            <div className={styles.navAv} style={{ background: clientColor }}>{clientAvatar}</div>
            <div className={styles.navName}>{clientName}</div>
            <div className={styles.navBadge}>active</div>
            <div className={styles.navContact}>$120/hr</div>
          </div>
          <div className={styles.navItems}>
            {NAV_ITEMS.map(n => (
              <div key={n.id} className={`${styles.navItem} ${navItem === n.id ? styles.navItemOn : ""}`} onClick={() => setNavItem(n.id)}>
                <span className={styles.navItemIcon}>{n.icon}</span>{n.label}
                {n.count && <span className={styles.navItemCount}>{n.count}</span>}
              </div>
            ))}
          </div>
          <div className={styles.navStats}>
            <div className={styles.navStat}><span>Billed</span><span className={`${styles.navStatVal} ${styles.green}`}>$8,400</span></div>
            <div className={styles.navStat}><span>Outstanding</span><span className={styles.navStatVal} style={{ color: "#ff9800" }}>$2,400</span></div>
            <div className={styles.navStat}><span>Overdue</span><span className={`${styles.navStatVal} ${styles.red}`}>1 task</span></div>
            <div className={styles.navStat}><span>Progress</span><span className={styles.navStatVal}>65%</span></div>
          </div>
        </div>

        {/* Task list */}
        <div className={styles.list}>
          <div className={styles.listHd}>
            <span className={styles.listTitle}>Brand Guidelines v2</span>
            <div className={styles.listFilters}>
              <button className={styles.filterBtn}>{"▾"} Filter</button>
              <button className={styles.filterBtn}>{"↕"} Sort</button>
            </div>
            <button className={`${styles.listBtn} ${styles.listBtnPrimary}`}>+ Add task</button>
            <div className={styles.viewTabs}>
              {(["list", "board", "timeline"] as const).map(v => (
                <button key={v} className={`${styles.viewTab} ${viewTab === v ? styles.viewTabOn : ""}`} onClick={() => setViewTab(v)}>
                  {v === "list" ? "List" : v === "board" ? "Board" : "Timeline"}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.listScroll}>
            {SECTIONS.map(sec => {
              const secTasks = tasks.filter(t => t.section === sec.id);
              return (
                <div key={sec.id} className={styles.section} onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(sec.id)}>
                  <div className={styles.sectionHd} onClick={() => toggleSection(sec.id)}>
                    <span className={`${styles.sectionArrow} ${!collapsedSections.has(sec.id) ? styles.sectionArrowOpen : ""}`}>{"▸"}</span>
                    <span className={styles.sectionIcon}>{sec.icon}</span>
                    <span className={styles.sectionLabel}>{sec.label}</span>
                    <span className={styles.sectionCount}>{secTasks.length}</span>
                  </div>
                  {!collapsedSections.has(sec.id) && secTasks.map(t => {
                    const subsDone = t.subs.filter(s => s.d).length;
                    return (
                      <div key={t.id} draggable className={`${styles.taskRow} ${t.overdue ? styles.taskRowOv : ""} ${selected === t.id ? styles.taskRowSelected : ""} ${dragId === t.id ? styles.taskRowDragging : ""}`}
                        onClick={() => { setSelected(selected === t.id ? null : t.id); setDwTab("detail"); }} onDragStart={() => setDragId(t.id)} onDragEnd={() => setDragId(null)}>
                        <div className={styles.taskPri} style={{ background: priColor(t.pri) }} />
                        <div className={`${styles.taskCheck} ${t.section === "done" ? styles.taskCheckDone : ""}`} onClick={e => e.stopPropagation()}>{t.section === "done" ? "\u2713" : ""}</div>
                        <div className={styles.taskInfo}>
                          <div className={styles.taskTitle}>
                            <span className={styles.taskTitleText}>{t.title}</span>
                            {t.subs.length > 0 && <span className={styles.taskSubs}>{"\u2610"} {subsDone}/{t.subs.length}</span>}
                            {t.comments.length > 0 && <span className={styles.taskComments}>{"\ud83d\udcac"} {t.comments.length}</span>}
                          </div>
                        </div>
                        {t.timer && <span className={styles.taskTimer}>{"\u25cf"} 1:22</span>}
                        <span className={`${styles.taskDue} ${t.overdue ? styles.taskDueOv : ""}`}>{t.due}</span>
                        <div className={styles.taskAvatar}>AX</div>
                      </div>
                    );
                  })}
                  {!collapsedSections.has(sec.id) && <div className={styles.addTask}>+ Add task...</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dim overlay */}
        <div className={`${styles.drawerDim} ${selected ? styles.drawerDimShow : ""}`} onClick={() => setSelected(null)} />

        {/* Slide-out drawer */}
        <div className={`${styles.drawerWrap} ${selected ? styles.drawerWrapOpen : ""}`}>
          {task && (
            <div className={styles.drawer}>
              <div className={styles.dwHd}>
                <div className={`${styles.dwCheck} ${task.section === "done" ? styles.dwCheckDone : ""}`}>{task.section === "done" ? "✓" : ""}</div>
                <div className={styles.dwHdInfo}>
                  <div className={styles.dwId}>FLM-{task.id.replace("t", "")}</div>
                  <div className={styles.dwTitle}>{task.title}</div>
                </div>
                <div className={styles.dwActions}>
                  <button className={styles.dwAction}>{"📎"}</button>
                  <button className={styles.dwAction}>{"⤢"}</button>
                  <button className={styles.dwAction}>{"⋯"}</button>
                  <button className={styles.dwAction} onClick={() => setSelected(null)}>{"✕"}</button>
                </div>
              </div>

              {task.timer && (
                <div className={styles.dwTimer}>
                  <div className={styles.dwTimerDot} />
                  <span className={styles.dwTimerVal}>{fmt(timer)}</span>
                  <span className={styles.dwTimerMoney}>${Math.floor((timer / 3600) * 120)}/hr</span>
                  <button className={styles.dwTimerBtn}>{"■"} Stop</button>
                </div>
              )}

              <div className={styles.dwTabs}>
                <div className={`${styles.dwTab} ${dwTab === "detail" ? styles.dwTabOn : ""}`} onClick={() => setDwTab("detail")}>Detail</div>
                <div className={`${styles.dwTab} ${dwTab === "comments" ? styles.dwTabOn : ""}`} onClick={() => setDwTab("comments")}>
                  Comments{task.comments.length > 0 && <span className={styles.dwTabCt}>{task.comments.length}</span>}
                </div>
              </div>

              <div className={styles.dwScroll}>
                {dwTab === "detail" && <>
                  <div className={styles.dwProps}>
                    {[
                      { icon: "◐", label: "Status", val: <span className={styles.dwPill} style={{ background: task.overdue ? "rgba(239,83,80,.08)" : task.section === "active" ? "rgba(255,152,0,.08)" : task.section === "done" ? "rgba(38,166,154,.08)" : "rgba(76,82,94,.06)", color: task.overdue ? "#ef5350" : task.section === "active" ? "#ff9800" : task.section === "done" ? "#26a69a" : "#7c7b77" }}>{task.overdue ? "Overdue" : task.section === "done" ? "Done" : task.section === "active" ? "In Progress" : "To Do"}</span>, key: "S" },
                      { icon: "◎", label: "Priority", val: <span className={styles.dwPill} style={{ background: priColor(task.pri) + "14", color: priColor(task.pri) }}>{priLabel(task.pri)}</span>, key: "P" },
                      { icon: "◉", label: "Assignee", val: <><div className={styles.dwAv} style={{ background: "rgba(38,166,154,.06)", color: "#26a69a" }}>AX</div>You</>, key: "A" },
                      { icon: "◻", label: "Due", val: <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: task.overdue ? "#ef5350" : undefined }}>{task.due}{task.overdue ? " — overdue" : ""}</span>, key: "D" },
                      { icon: "⏱", label: "Estimated", val: <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#a5a49f" }}>{task.est}</span> },
                      { icon: "⏱", label: "Tracked", val: <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#26a69a" }}>{task.timer ? fmt(timer) : task.actual}</span> },
                      ...(task.tags.length > 0 ? [{ icon: "#", label: "Labels", val: <div style={{ display: "flex", gap: 3 }}>{task.tags.map(tg => <span key={tg} className={styles.dwTag}>{tg}</span>)}</div>, key: "L" }] : []),
                    ].map((p, i) => (
                      <div key={i} className={styles.dwProp}>
                        <span className={styles.dwPropIcon}>{p.icon}</span>
                        <span className={styles.dwPropLabel}>{p.label}</span>
                        <div className={styles.dwPropVal}>{p.val}</div>
                        {p.key && <span className={styles.dwPropKey}>{p.key}</span>}
                      </div>
                    ))}
                  </div>

                  <div className={styles.dwDesc}>
                    <div className={styles.dwSecLabel}>Description</div>
                    {task.desc ? <div className={styles.dwDescText}>{task.desc}</div> : <div className={styles.dwDescEmpty}>What is this task about?</div>}
                  </div>

                  <div className={styles.dwSubs}>
                    <div className={styles.dwSecLabel}>Subtasks</div>
                    {task.subs.length > 0 && (
                      <div className={styles.dwSubsBar}>
                        <div className={styles.dwPbar}><div className={styles.dwPbarFill} style={{ width: `${(task.subs.filter(s => s.d).length / task.subs.length) * 100}%` }} /></div>
                        <span className={styles.dwPbarCt}>{task.subs.filter(s => s.d).length}/{task.subs.length}</span>
                      </div>
                    )}
                    {task.subs.map((s, i) => (
                      <div key={i} className={`${styles.dwSub} ${s.d ? styles.dwSubDone : ""}`}>
                        <div className={`${styles.dwSubCb} ${s.d ? styles.dwSubCbDone : ""}`}>{s.d ? "✓" : ""}</div>
                        <span className={styles.dwSubText}>{s.t}</span>
                      </div>
                    ))}
                    <div className={styles.dwSubAdd}>+ Add subtask</div>
                  </div>
                </>}

                {dwTab === "comments" && (
                  <div className={styles.dwComments}>
                    <div className={styles.dwSecLabel}>Thread · {task.comments.length}</div>
                    {task.comments.map((c, i) => (
                      <div key={i} className={styles.dwComment}>
                        <div className={styles.dwCommentAv} style={{ background: c.user === "You" ? "rgba(38,166,154,.06)" : "rgba(124,133,148,.1)", color: c.user === "You" ? "#26a69a" : "#7c8594" }}>{c.av}</div>
                        <div className={styles.dwCommentBody}>
                          <div className={styles.dwCommentMeta}>
                            <span className={styles.dwCommentUser}>{c.user}</span>
                            <span className={styles.dwCommentRole} style={{ background: c.user === "You" ? "rgba(38,166,154,.04)" : "rgba(124,133,148,.06)", color: c.user === "You" ? "#26a69a" : "#7c8594" }}>{c.user === "You" ? "you" : "client"}</span>
                            <span className={styles.dwCommentTime}>{c.time}</span>
                          </div>
                          <div className={styles.dwCommentText}>{c.text}</div>
                          {c.reactions && c.reactions.length > 0 && (
                            <div className={styles.dwCommentReactions}>
                              {c.reactions.map((r, ri) => <span key={ri} className={styles.dwRx}>{r}</span>)}
                              <span className={styles.dwRxAdd}>+</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {task.comments.length === 0 && <div className={styles.dwDescEmpty}>No comments yet</div>}
                    <div className={styles.dwInput}>
                      <div className={styles.dwInputAv}>AX</div>
                      <div className={styles.dwInputBox}>
                        <textarea placeholder="Add a comment..." rows={1} value={commentText} onChange={e => setCommentText(e.target.value)} />
                        <div className={styles.dwInputFt}>
                          <button className={styles.dwInputTool}>{"☺"}</button>
                          <button className={styles.dwInputTool}>{"@"}</button>
                          <button className={styles.dwInputTool}>{"📎"}</button>
                          <button className={styles.dwInputSend}>Send</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.dwFooter}>
                <button className={`${styles.dwFooterBtn} ${styles.dwFooterPrimary}`}>{"✓"} Complete</button>
                <button className={`${styles.dwFooterBtn} ${styles.dwFooterGhost}`}>{"→"} Editor</button>
                <button className={`${styles.dwFooterBtn} ${styles.dwFooterGhost}`}>{"$"} Invoice</button>
                <div className={styles.dwFooterSpacer} />
                <div className={styles.dwFooterCollab}>
                  <div className={styles.dwFooterCav} style={{ background: "rgba(38,166,154,.06)", color: "#26a69a", zIndex: 2 }}>AX</div>
                  <div className={styles.dwFooterCav} style={{ background: "rgba(124,133,148,.1)", color: "#7c8594", zIndex: 1 }}>SC</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
