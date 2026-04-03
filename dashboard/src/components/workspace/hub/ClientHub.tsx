"use client";

import { useState } from "react";
import styles from "./ClientHub.module.css";

interface ClientHubProps {
  clientId: string;
  clientName: string;
  clientAvatar: string;
  clientColor: string;
  onClose: () => void;
}

const TASKS = [
  { id: "t1", title: "Client review & revisions", status: "todo" as const, pri: "urgent" as const, due: "Apr 1", overdue: true, subs: 3, subsDone: 0, logged: 1.5, est: 4 },
  { id: "t2", title: "Color palette & typography", status: "active" as const, pri: "high" as const, due: "Apr 2", overdue: false, subs: 4, subsDone: 2, logged: 3, est: 6, timer: true },
  { id: "t3", title: "Brand guidelines document", status: "todo" as const, pri: "medium" as const, due: "Apr 5", overdue: false, subs: 6, subsDone: 0, logged: 0, est: 16 },
  { id: "t4", title: "Typography scale & pairings", status: "todo" as const, pri: "medium" as const, due: "Apr 5", overdue: false, subs: 0, subsDone: 0, logged: 0, est: 4 },
  { id: "t5", title: "Imagery direction", status: "todo" as const, pri: "low" as const, due: "Apr 7", overdue: false, subs: 0, subsDone: 0, logged: 0, est: 6 },
  { id: "t6", title: "Social media templates", status: "done" as const, pri: "low" as const, due: "Apr 10", overdue: false, subs: 0, subsDone: 0, logged: 8, est: 8 },
];

const COLUMNS = [
  { id: "todo", label: "To Do", color: "#4c525e" },
  { id: "active", label: "Active", color: "#26a69a" },
  { id: "review", label: "Review", color: "#ff9800" },
  { id: "done", label: "Done", color: "#787b86" },
] as const;

const INVOICES = [
  { id: "046", amount: 1800, status: "paid" as const, desc: "Phase 1 \u2014 Discovery" },
  { id: "048", amount: 2400, status: "pending" as const, desc: "Phase 2 \u2014 Design system", viewed: 3 },
  { id: "050", amount: 4200, status: "draft" as const, desc: "Unbilled hours (14h)" },
];

const priColor = (p: string) => p === "urgent" ? "#ef5350" : p === "high" ? "#ff9800" : p === "medium" ? "#2962ff" : "#4c525e";

export default function ClientHub({ clientName, clientAvatar, clientColor, onClose }: ClientHubProps) {
  const [view, setView] = useState("board");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const totalLogged = TASKS.reduce((s, t) => s + t.logged, 0);
  const totalEst = TASKS.reduce((s, t) => s + t.est, 0);

  return (
    <div className={styles.hub}>
      {/* Client header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.avatar} style={{ background: clientColor }}>{clientAvatar}</div>
          <div className={styles.headerInfo}>
            <div className={styles.nameRow}>
              <span className={styles.name}>{clientName}</span>
              <span className={styles.badge}>active</span>
            </div>
            <span className={styles.contact}>sarah@meridian.co &middot; $120/hr</span>
          </div>
          <div className={styles.headerActions}>
            <button className={`${styles.headerBtn} ${styles.headerBtnGhost}`}>{"\u25b6"} Timer</button>
            <button className={`${styles.headerBtn} ${styles.headerBtnGhost}`}>$ Invoice</button>
            <button className={`${styles.headerBtn} ${styles.headerBtnPrimary}`}>+ New Task</button>
            <button className={styles.closeBtn} onClick={onClose}>&times;</button>
          </div>
        </div>

        {/* Metrics */}
        <div className={styles.metrics}>
          <div className={styles.metric}><span className={`${styles.metricVal} ${styles.metricGreen}`}>$8,400</span><span className={styles.metricLabel}>Total billed</span></div>
          <div className={styles.metric}><span className={`${styles.metricVal} ${styles.metricAmber}`}>$2,400</span><span className={styles.metricLabel}>Outstanding</span></div>
          <div className={styles.metric}><span className={styles.metricVal}>{totalLogged}h<span className={styles.metricSub}>/{totalEst}h</span></span><span className={styles.metricLabel}>Hours logged</span></div>
          <div className={styles.metric}><span className={styles.metricVal}>65%</span><span className={styles.metricLabel}>Progress</span></div>
          <div className={styles.metric}><span className={`${styles.metricVal} ${styles.metricRed}`}>1</span><span className={styles.metricLabel}>Overdue</span></div>
        </div>

        {/* View tabs */}
        <div className={styles.views}>
          {([["board", "Board"], ["list", "List"], ["time", "Time"], ["invoices", "Invoices"]] as const).map(([id, lb]) => (
            <div key={id} className={`${styles.viewTab} ${view === id ? styles.viewTabOn : ""}`} onClick={() => setView(id)}>{lb}</div>
          ))}
        </div>
      </div>

      {/* Board view */}
      {view === "board" && (
        <div className={styles.boardArea}>
          <div className={styles.board}>
            {COLUMNS.map(col => {
              const colTasks = TASKS.filter(t => t.status === col.id);
              return (
                <div key={col.id} className={styles.col}>
                  <div className={styles.colHd}>
                    <div className={styles.colDot} style={{ background: col.color }} />
                    <span className={styles.colLabel}>{col.label}</span>
                    <span className={styles.colCount}>{colTasks.length}</span>
                  </div>
                  <div className={styles.colCards}>
                    {colTasks.map(t => {
                      const pct = t.subs > 0 ? Math.round((t.subsDone / t.subs) * 100) : t.status === "done" ? 100 : 0;
                      return (
                        <div key={t.id} className={`${styles.card} ${t.overdue ? styles.cardOv : ""} ${selectedTask === t.id ? styles.cardSelected : ""}`}
                          onClick={() => setSelectedTask(selectedTask === t.id ? null : t.id)}>
                          <div className={styles.cardPri} style={{ background: priColor(t.pri) }} />
                          <div className={styles.cardTitle}>{t.title}</div>
                          <div className={styles.cardMeta}>
                            <span className={t.overdue ? styles.cardDueOv : ""}>{t.due}</span>
                            {t.timer && <><span className={styles.cardMetaDot} /><span className={styles.cardTimer}>{"\u25cf"} 1:22</span></>}
                            {t.subs > 0 && <><span className={styles.cardMetaDot} /><span>{t.subsDone}/{t.subs}</span></>}
                            <span className={styles.cardMetaDot} />
                            <span>{t.logged}h/{t.est}h</span>
                          </div>
                          {(t.subs > 0 || t.status === "done") && (
                            <div className={styles.cardProgress}>
                              <div className={styles.cardBar}><div className={styles.cardBarFill} style={{ width: `${pct}%`, background: t.overdue ? "#ef5350" : "#26a69a" }} /></div>
                              <span className={styles.cardPct}>{pct}%</span>
                            </div>
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
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className={styles.listView}>
          {TASKS.map(t => {
            const pct = t.subs > 0 ? Math.round((t.subsDone / t.subs) * 100) : t.status === "done" ? 100 : 0;
            return (
              <div key={t.id} className={`${styles.listRow} ${t.overdue ? styles.listRowOv : ""}`}>
                <div className={styles.listPri} style={{ background: priColor(t.pri) }} />
                <span className={`${styles.listTitle} ${t.overdue ? styles.listTitleOv : ""}`}>{t.title}</span>
                {t.timer && <span className={styles.cardTimer}>{"\u25cf"} 1:22</span>}
                <div className={styles.listBar}><div className={styles.listBarFill} style={{ width: `${pct}%`, background: t.overdue ? "#ef5350" : "#26a69a" }} /></div>
                <span className={`${styles.listDue} ${t.overdue ? styles.listDueOv : ""}`}>{t.due}</span>
                <span className={styles.listHours}>{t.logged}/{t.est}h</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Time view */}
      {view === "time" && (
        <div className={styles.timeView}>
          <div className={styles.timeSummary}>
            <div className={styles.timeSumItem}><span className={styles.timeSumVal}>{totalLogged}h</span><span className={styles.timeSumLabel}>Total logged</span></div>
            <div className={styles.timeSumItem}><span className={styles.timeSumVal}>${Math.round(totalLogged * 120).toLocaleString()}</span><span className={styles.timeSumLabel}>Billed value</span></div>
            <div className={styles.timeSumItem}><span className={styles.timeSumVal}>$120</span><span className={styles.timeSumLabel}>Eff. rate</span></div>
          </div>
        </div>
      )}

      {/* Invoices view */}
      {view === "invoices" && (
        <div className={styles.invView}>
          {INVOICES.map(inv => (
            <div key={inv.id} className={styles.invCard}>
              <span className={styles.invNum}>#{inv.id}</span>
              <span className={styles.invDesc}>{inv.desc}</span>
              <span className={styles.invAmount} style={{ color: inv.status === "paid" ? "#26a69a" : inv.status === "draft" ? "#a5a49f" : "#1a1918" }}>${inv.amount.toLocaleString()}</span>
              <span className={styles.invStatus} style={{
                background: inv.status === "paid" ? "rgba(38,166,154,.08)" : inv.status === "pending" ? "rgba(255,152,0,.08)" : "rgba(165,164,159,.08)",
                color: inv.status === "paid" ? "#26a69a" : inv.status === "pending" ? "#ff9800" : "#a5a49f",
              }}>{inv.status}{"viewed" in inv ? ` \u00b7 ${inv.viewed}\u00d7` : ""}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
