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

/* ── Demo data ── */
interface Sub { t: string; d: boolean }
interface Entry { date: string; desc: string; h: number; v: number }
interface Task {
  id: string; title: string; status: "todo" | "active" | "review" | "done"; pri: "urgent" | "high" | "medium" | "low";
  due: string; overdue?: boolean; subs: Sub[]; logged: number; est: number; timer?: boolean; entries: Entry[];
}

const TASKS: Task[] = [
  { id: "t1", title: "Client review & revisions", status: "todo", pri: "urgent", due: "Apr 1", overdue: true, subs: [{ t: "Address color feedback", d: false }, { t: "Revise teal \u2192 warmer", d: false }, { t: "CEO sign-off", d: false }], logged: 1.5, est: 4, entries: [{ date: "Apr 1", desc: "Revision meeting", h: 1.5, v: 180 }] },
  { id: "t2", title: "Color palette & typography", status: "active", pri: "high", due: "Apr 2", subs: [{ t: "Primary palette", d: true }, { t: "Secondary & accents", d: false }, { t: "Heading fonts", d: true }, { t: "Body & mono", d: false }], logged: 3, est: 6, timer: true, entries: [{ date: "Apr 2", desc: "Palette exploration", h: 2, v: 240 }, { date: "Apr 1", desc: "Research", h: 1, v: 120 }] },
  { id: "t3", title: "Brand guidelines document", status: "todo", pri: "medium", due: "Apr 5", subs: [{ t: "Cover & TOC", d: false }, { t: "Logo rules", d: false }, { t: "Color specs", d: false }, { t: "Typography", d: false }, { t: "Photography", d: false }, { t: "Social guidelines", d: false }], logged: 0, est: 16, entries: [] },
  { id: "t4", title: "Typography scale & pairings", status: "todo", pri: "medium", due: "Apr 5", subs: [], logged: 0, est: 4, entries: [] },
  { id: "t5", title: "Imagery direction", status: "todo", pri: "low", due: "Apr 7", subs: [], logged: 0, est: 6, entries: [] },
  { id: "t6", title: "Social media templates", status: "done", pri: "low", due: "Apr 10", subs: [], logged: 8, est: 8, entries: [{ date: "Mar 20", desc: "Template design", h: 8, v: 960 }] },
];

const COLUMNS = [
  { id: "todo" as const, label: "To Do", color: "#4c525e" },
  { id: "active" as const, label: "Active", color: "#26a69a" },
  { id: "review" as const, label: "Review", color: "#ff9800" },
  { id: "done" as const, label: "Done", color: "#787b86" },
];

const INVOICES = [
  { id: "046", amount: 1800, status: "paid" as const, desc: "Phase 1 \u2014 Discovery" },
  { id: "048", amount: 2400, status: "pending" as const, desc: "Phase 2 \u2014 Design system", viewed: 3 },
  { id: "050", amount: 4200, status: "draft" as const, desc: "Unbilled hours (14h)" },
];

const FILES = [
  { n: "Brand Guidelines v2.pdf", s: "2.4 MB", d: "Apr 2", type: "doc" },
  { n: "Color-Palette-Final.fig", s: "18 MB", d: "Apr 1", type: "design" },
  { n: "Contract-Meridian-2026.pdf", s: "340 KB", d: "Mar 15", type: "contract" },
  { n: "Proposal-Phase2.pdf", s: "520 KB", d: "Mar 10", type: "proposal" },
];

const priColor = (p: string) => p === "urgent" ? "#ef5350" : p === "high" ? "#ff9800" : p === "medium" ? "#2962ff" : "#4c525e";
const statusColor = (s: string) => s === "overdue" || s === "urgent" ? "#ef5350" : s === "active" ? "#26a69a" : s === "review" ? "#ff9800" : s === "done" ? "#787b86" : "#4c525e";

export default function ClientHub({ clientId, clientName, clientAvatar, clientColor, onClose }: ClientHubProps) {
  const [view, setView] = useState("board");
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const hubRef = useRef<HTMLDivElement>(null);

  // Auto scroll to top when client changes or hub opens
  useEffect(() => {
    hubRef.current?.scrollTo(0, 0);
    setView("board");
    setSelectedTask(null);
  }, [clientId]);

  const task = selectedTask ? tasks.find(t => t.id === selectedTask) ?? null : null;
  const totalLogged = tasks.reduce((s, t) => s + t.logged, 0);
  const totalEst = tasks.reduce((s, t) => s + t.est, 0);
  const allEntries = tasks.flatMap(t => t.entries.map(e => ({ ...e, task: t.title }))).sort((a, b) => b.date.localeCompare(a.date));

  const handleDrop = (targetCol: Task["status"]) => {
    if (!dragId) return;
    setTasks(prev => prev.map(t => t.id === dragId ? { ...t, status: targetCol, overdue: targetCol === "todo" ? t.overdue : false } : t));
    setDragId(null);
    setDragOver(null);
  };

  return (
    <div className={styles.hub} ref={hubRef}>
      {/* Client header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.avatar} style={{ background: clientColor }}>{clientAvatar}</div>
          <div className={styles.headerInfo}>
            <div className={styles.nameRow}>
              <span className={styles.name}>{clientName}</span>
              <span className={styles.badge}>active</span>
            </div>
            <span className={styles.contact}>sarah@meridian.co {"\u00b7"} $120/hr</span>
          </div>
          <div className={styles.headerActions}>
            <button className={`${styles.headerBtn} ${styles.headerBtnGhost}`}>{"\u25b6"} Timer</button>
            <button className={`${styles.headerBtn} ${styles.headerBtnGhost}`}>$ Invoice</button>
            <button className={`${styles.headerBtn} ${styles.headerBtnPrimary}`}>+ New Task</button>
            <button className={styles.closeBtn} onClick={onClose}>{"\u00d7"}</button>
          </div>
        </div>
        <div className={styles.metrics}>
          <div className={styles.metric}><span className={`${styles.metricVal} ${styles.metricGreen}`}>$8,400</span><span className={styles.metricLabel}>Total billed</span></div>
          <div className={styles.metric}><span className={`${styles.metricVal} ${styles.metricAmber}`}>$2,400</span><span className={styles.metricLabel}>Outstanding</span></div>
          <div className={styles.metric}><span className={styles.metricVal}>{totalLogged}h<span className={styles.metricSub}>/{totalEst}h</span></span><span className={styles.metricLabel}>Hours logged</span></div>
          <div className={styles.metric}><span className={styles.metricVal}>65%</span><span className={styles.metricLabel}>Progress</span></div>
          <div className={styles.metric}><span className={`${styles.metricVal} ${styles.metricRed}`}>1</span><span className={styles.metricLabel}>Overdue</span></div>
        </div>
        <div className={styles.views}>
          {([["board", "Board"], ["list", "List"], ["time", "Time & Billing"], ["invoices", "Invoices"], ["files", "Files"]] as const).map(([id, lb]) => (
            <div key={id} className={`${styles.viewTab} ${view === id ? styles.viewTabOn : ""}`} onClick={() => setView(id)}>{lb}</div>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className={styles.contentArea}>
        {/* ── BOARD ── */}
        {view === "board" && (
          <div className={styles.board}>
            {COLUMNS.map(col => {
              const colTasks = tasks.filter(t => t.status === col.id);
              return (
                <div key={col.id} className={`${styles.col} ${dragOver === col.id ? styles.colDragOver : ""}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(col.id); }} onDragLeave={() => setDragOver(null)} onDrop={() => handleDrop(col.id)}>
                  <div className={styles.colHd}>
                    <div className={styles.colDot} style={{ background: col.color }} />
                    <span className={styles.colLabel}>{col.label}</span>
                    <span className={styles.colCount}>{colTasks.length}</span>
                  </div>
                  <div className={styles.colCards}>
                    {colTasks.map(t => {
                      const sd = t.subs.filter(s => s.d).length;
                      const st = t.subs.length;
                      const pct = st > 0 ? Math.round((sd / st) * 100) : t.status === "done" ? 100 : 0;
                      return (
                        <div key={t.id} draggable className={`${styles.card} ${t.overdue ? styles.cardOv : ""} ${selectedTask === t.id ? styles.cardSelected : ""} ${dragId === t.id ? styles.cardDragging : ""}`}
                          onDragStart={() => setDragId(t.id)}
                          onDragEnd={() => { setDragId(null); setDragOver(null); }}
                          onClick={() => setSelectedTask(selectedTask === t.id ? null : t.id)}>
                          <div className={styles.cardPri} style={{ background: priColor(t.pri) }} />
                          <div className={styles.cardTitle}>{t.title}</div>
                          <div className={styles.cardMeta}>
                            <span className={t.overdue ? styles.cardDueOv : ""}>{t.due}</span>
                            {t.timer && <><span className={styles.cardMetaDot} /><span className={styles.cardTimer}>{"\u25cf"} 1:22</span></>}
                            {st > 0 && <><span className={styles.cardMetaDot} /><span>{sd}/{st}</span></>}
                            <span className={styles.cardMetaDot} /><span>{t.logged}h/{t.est}h</span>
                          </div>
                          {(st > 0 || t.status === "done") && (
                            <div className={styles.cardProgress}><div className={styles.cardBar}><div className={styles.cardBarFill} style={{ width: `${pct}%`, background: t.overdue ? "#ef5350" : "#26a69a" }} /></div><span className={styles.cardPct}>{pct}%</span></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className={styles.colAdd}><button className={styles.colAddBtn}>+ Add task</button></div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── LIST ── */}
        {view === "list" && (
          <div className={styles.listView}>
            <div className={styles.listHd}><span style={{ width: 3 }} /><span style={{ width: 16 }} /><span style={{ flex: 1 }}>Task</span><span style={{ width: 60 }}>Status</span><span style={{ width: 44, textAlign: "right" }}>Due</span><span style={{ width: 50, textAlign: "right" }}>Hours</span><span style={{ width: 48 }}>Progress</span></div>
            {TASKS.map(t => {
              const sd = t.subs.filter(s => s.d).length; const st = t.subs.length;
              const pct = st > 0 ? Math.round((sd / st) * 100) : t.status === "done" ? 100 : 0;
              const sc = t.overdue ? "overdue" : t.status;
              return (
                <div key={t.id} className={`${styles.listRow} ${t.overdue ? styles.listRowOv : ""}`} onClick={() => setSelectedTask(selectedTask === t.id ? null : t.id)}>
                  <div className={styles.listPri} style={{ background: priColor(t.pri) }} />
                  <div className={`${styles.listCb} ${t.status === "done" ? styles.listCbDone : ""}`}>{t.status === "done" ? "\u2713" : ""}</div>
                  <span className={`${styles.listTitle} ${t.overdue ? styles.listTitleOv : ""}`}>{t.title}{t.timer && <span className={styles.cardTimer} style={{ marginLeft: 6 }}>{"\u25cf"} 1:22</span>}</span>
                  <span className={styles.listStatus} style={{ background: statusColor(sc) + "14", color: statusColor(sc) }}>{sc}</span>
                  <span className={`${styles.listDue} ${t.overdue ? styles.listDueOv : ""}`}>{t.due}</span>
                  <span className={styles.listHours}>{t.logged}/{t.est}h</span>
                  <div className={styles.listBar}><div className={styles.listBarFill} style={{ width: `${pct}%`, background: t.overdue ? "#ef5350" : "#26a69a" }} /></div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TIME ── */}
        {view === "time" && (
          <div className={styles.timeView}>
            <div className={styles.timeSummary}>
              <div className={styles.timeSumItem}><span className={styles.timeSumVal}>{totalLogged}h</span><span className={styles.timeSumLabel}>Total logged</span></div>
              <div className={styles.timeSumItem}><span className={styles.timeSumVal}>${Math.round(totalLogged * 120).toLocaleString()}</span><span className={styles.timeSumLabel}>Billed value</span></div>
              <div className={styles.timeSumItem}><span className={styles.timeSumVal}>$120</span><span className={styles.timeSumLabel}>Eff. rate</span></div>
              <div className={styles.timeSumItem}><span className={`${styles.timeSumVal} ${styles.metricAmber}`}>14h</span><span className={styles.timeSumLabel}>Unbilled</span></div>
            </div>
            <div className={styles.timeTable}>
              <div className={styles.timeTableHd}><span style={{ width: 50 }}>Date</span><span style={{ flex: 1 }}>Task</span><span style={{ width: 40, textAlign: "right" }}>Hours</span><span style={{ width: 40, textAlign: "right" }}>Rate</span><span style={{ width: 50, textAlign: "right" }}>Value</span></div>
              {allEntries.map((e, i) => (
                <div key={i} className={styles.timeTableRow}><span className={styles.timeDate}>{e.date}</span><span className={styles.timeTask}>{e.task}</span><span className={styles.timeHours}>{e.h}h</span><span className={styles.timeRate}>$120</span><span className={styles.timeValue}>${e.v}</span></div>
              ))}
            </div>
            <div className={styles.timeFooter}><button className={`${styles.headerBtn} ${styles.headerBtnPrimary}`}>{"\u2192"} Generate Invoice from Time</button></div>
          </div>
        )}

        {/* ── INVOICES ── */}
        {view === "invoices" && (
          <div className={styles.invView}>
            {INVOICES.map(inv => (
              <div key={inv.id} className={styles.invCard}>
                <span className={styles.invNum}>#{inv.id}</span>
                <span className={styles.invDesc}>{inv.desc}</span>
                <span className={styles.invAmount} style={{ color: inv.status === "paid" ? "#26a69a" : inv.status === "draft" ? "#a5a49f" : "#1a1918" }}>${inv.amount.toLocaleString()}</span>
                <span className={styles.invStatus} style={{ background: inv.status === "paid" ? "rgba(38,166,154,.08)" : inv.status === "pending" ? "rgba(255,152,0,.08)" : "rgba(165,164,159,.08)", color: inv.status === "paid" ? "#26a69a" : inv.status === "pending" ? "#ff9800" : "#a5a49f" }}>{inv.status}{"viewed" in inv ? ` \u00b7 ${inv.viewed}\u00d7` : ""}</span>
                {inv.status === "pending" && <span className={styles.invAction} style={{ borderColor: "rgba(255,152,0,.15)", color: "#ff9800", background: "rgba(255,152,0,.04)" }}>remind</span>}
                {inv.status === "draft" && <span className={styles.invAction} style={{ borderColor: "#e2e1dd", color: "#5c5b57", background: "#fff" }}>finalize</span>}
              </div>
            ))}
            <div className={styles.invFooter}><span>3 invoices {"\u00b7"} $8,400 total</span><span style={{ color: "#ff9800" }}>$2,400 outstanding</span></div>
          </div>
        )}

        {/* ── FILES ── */}
        {view === "files" && (
          <div className={styles.filesView}>
            {FILES.map((f, i) => (
              <div key={i} className={styles.fileRow}>
                <div className={styles.fileIcon} style={{ background: f.type === "design" ? "rgba(41,98,255,.08)" : f.type === "contract" ? "rgba(255,152,0,.08)" : "#f0f0ee", color: f.type === "design" ? "#2962ff" : f.type === "contract" ? "#ff9800" : "#a5a49f" }}>{f.type === "design" ? "FIG" : f.type === "contract" || f.type === "proposal" ? "PDF" : "DOC"}</div>
                <div className={styles.fileInfo}><span className={styles.fileName}>{f.n}</span><span className={styles.fileMeta}>{f.s} {"\u00b7"} {f.d}</span></div>
              </div>
            ))}
          </div>
        )}

        {/* ── DETAIL PANEL ── */}
        {task && (
          <div className={styles.detail}>
            <div className={styles.detailHd}>
              <div className={styles.detailPri} style={{ background: priColor(task.pri) }} />
              <span className={styles.detailTitle}>{task.title}</span>
              <div className={styles.detailClose} onClick={() => setSelectedTask(null)}>{"\u00d7"}</div>
            </div>
            <div className={styles.detailBody}>
              {/* Fields */}
              <div className={styles.dSec}>
                <div className={styles.dFields}>
                  <div><span className={styles.dFieldLabel}>Status</span><div className={styles.dPill} style={{ background: statusColor(task.overdue ? "overdue" : task.status) + "14", color: statusColor(task.overdue ? "overdue" : task.status) }}>{task.overdue ? "overdue" : task.status}</div></div>
                  <div><span className={styles.dFieldLabel}>Priority</span><div className={styles.dPill} style={{ background: priColor(task.pri) + "14", color: priColor(task.pri) }}>{task.pri}</div></div>
                  <div><span className={styles.dFieldLabel}>Due</span><span className={styles.dFieldVal} style={{ color: task.overdue ? "#ef5350" : undefined }}>{task.due}{task.overdue ? " \u2014 overdue" : ""}</span></div>
                  <div><span className={styles.dFieldLabel}>Time</span><span className={styles.dFieldVal}>{task.logged}h / {task.est}h</span></div>
                </div>
              </div>
              {/* Timer */}
              {task.timer && <div className={styles.dSec}><div className={styles.dTimer}><span className={styles.dTimerVal}>{"\u25cf"} 1:22:14</span><button className={styles.dTimerBtn}>{"\u25a0"} Stop</button></div></div>}
              {/* Subtasks */}
              {task.subs.length > 0 && (
                <div className={styles.dSec}>
                  <span className={styles.dSecLabel}>Subtasks</span>
                  <div className={styles.dProgress}><div className={styles.dPbar}><div className={styles.dPbarFill} style={{ width: `${(task.subs.filter(s => s.d).length / task.subs.length) * 100}%`, background: "#26a69a" }} /></div><span className={styles.dPpct}>{task.subs.filter(s => s.d).length}/{task.subs.length}</span></div>
                  {task.subs.map((s, i) => (
                    <div key={i} className={`${styles.dSub} ${s.d ? styles.dSubDone : ""}`}>
                      <div className={`${styles.dSubCb} ${s.d ? styles.dSubCbChecked : ""}`}>{s.d ? "\u2713" : ""}</div>
                      <span className={styles.dSubText}>{s.t}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Time entries */}
              {task.entries.length > 0 && (
                <div className={styles.dSec}>
                  <span className={styles.dSecLabel}>Time Entries</span>
                  {task.entries.map((e, i) => (
                    <div key={i} className={styles.dEntry}><span className={styles.dEntryDate}>{e.date}</span><span className={styles.dEntryDesc}>{e.desc}</span><span className={styles.dEntryH}>{e.h}h</span><span className={styles.dEntryV}>${e.v}</span></div>
                  ))}
                </div>
              )}
              {/* Actions */}
              <div className={styles.dSec}>
                <div className={styles.dActions}>
                  {!task.timer && <button className={`${styles.headerBtn} ${styles.headerBtnGhost}`}>{"\u25b6"} Start Timer</button>}
                  <button className={`${styles.headerBtn} ${styles.headerBtnGhost}`}>Open in Editor {"\u2192"}</button>
                  {task.overdue && <button className={`${styles.headerBtn} ${styles.headerBtnPrimary}`} style={{ background: "#ef5350", borderColor: "#ef5350" }}>Reschedule</button>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
