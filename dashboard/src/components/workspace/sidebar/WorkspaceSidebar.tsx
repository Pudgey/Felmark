"use client";

import { useState } from "react";
import styles from "./WorkspaceSidebar.module.css";

const CLIENTS = [
  { id: "c1", name: "Meridian Studio", av: "MS", status: "active" as const, owed: 2400, last: "2m",
    tasks: [
      { title: "Client review & revisions", due: "Apr 1", status: "overdue" as const },
      { title: "Color palette & typography", due: "Apr 2", status: "active" as const, timer: true },
      { title: "Brand guidelines document", due: "Apr 5", status: "todo" as const },
    ]},
  { id: "c2", name: "Nora Kim", av: "NK", status: "active" as const, owed: 3200, last: "1h",
    tasks: [
      { title: "Landing page wireframes", due: "Apr 8", status: "todo" as const },
      { title: "Email sequence draft", due: "Apr 12", status: "todo" as const },
    ]},
  { id: "c3", name: "Bolt Fitness", av: "BF", status: "overdue" as const, owed: 4000, last: "3d",
    tasks: [
      { title: "Onboarding UX revisions", due: "Apr 5", status: "active" as const },
      { title: "Blog post #1 draft", due: "Apr 3", status: "active" as const },
    ]},
  { id: "c4", name: "Luna Boutique", av: "LB", status: "lead" as const, owed: 0, last: "2h", tasks: [] },
];

const SIGNALS = [
  { text: "Sarah viewed invoice #044", time: "3m", urg: "hot" },
  { text: "Nora signed contract", time: "18m", urg: "ready" },
  { text: "Bolt — no reply in 3 days", time: "3d", urg: "watch" },
  { text: "$2,200 received from Nora", time: "2h", urg: "done" },
];

const URG_CLASS: Record<string, string> = { hot: "sigDotHot", ready: "sigDotReady", watch: "sigDotWatch", done: "sigDotDone" };

export default function WorkspaceSidebar() {
  const [active, setActive] = useState<string | null>("c1");
  const [clientsOpen, setClientsOpen] = useState(true);
  const [signalsOpen, setSignalsOpen] = useState(true);

  return (
    <div className={styles.sb}>
      {/* Header */}
      <div className={styles.sbHd}>
        <div className={styles.sbMark}>&#9670;</div>
        <div className={styles.sbHdInfo}>
          <div className={styles.sbHdLabel}>Workspace</div>
          <div className={styles.sbHdName}>Alex Mercer</div>
        </div>
        <div className={styles.sbHdActions}>
          <div className={styles.sbIco}>+</div>
          <div className={styles.sbIco}>&times;</div>
        </div>
      </div>

      {/* Stats with sparklines */}
      <div className={styles.sbStats}>
        {[
          { label: "Earned this month", val: "$14,800", dot: "var(--pos)", color: styles.valPos, spark: [3200, 5800, 4100, 7600, 9400, 11400, 13200, 14800], sparkColor: "#2d8a4e" },
          { label: "Outstanding", val: "$9,600", dot: "var(--ov)", color: styles.valOv, spark: [12000, 11200, 10800, 9600, 10200, 9800, 9600], sparkColor: "#d9453a" },
          { label: "Active tasks", val: "5", dot: "var(--ink-900, #1a1918)", color: "" },
          { label: "Overdue", val: "1", dot: "var(--ov)", color: styles.valOv },
        ].map((s, i) => (
          <div key={i} className={styles.sbStat}>
            <div className={styles.sbStatLeft}>
              <div className={styles.sbStatDot} style={{ background: s.dot }} />
              <span className={styles.sbStatLabel}>{s.label}</span>
            </div>
            <div className={styles.sbStatRight}>
              {s.spark && (
                <svg className={styles.sbSpark} viewBox="0 0 48 16" preserveAspectRatio="none">
                  <polyline
                    points={s.spark.map((v, vi) => {
                      const max = Math.max(...s.spark);
                      const min = Math.min(...s.spark);
                      const range = max - min || 1;
                      return `${(vi / (s.spark.length - 1)) * 48},${14 - ((v - min) / range) * 12 - 1}`;
                    }).join(" ")}
                    fill="none"
                    stroke={s.sparkColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <span className={`${styles.sbStatVal} ${s.color}`}>{s.val}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className={styles.sbSearch}>
        <span className={styles.sbSearchIcon}>&#8981;</span>
        <input className={styles.sbSearchInput} placeholder="Search clients, tasks..." />
        <div className={styles.sbKeys}><span className={styles.sbKey}>&#8984;</span><span className={styles.sbKey}>K</span></div>
      </div>

      {/* Scroll */}
      <div className={styles.sbScroll}>
        {/* Clients */}
        <div className={styles.sbSec} onClick={() => setClientsOpen(!clientsOpen)}>
          <span className={styles.sbSecArrow} style={{ transform: clientsOpen ? "rotate(90deg)" : "rotate(0)" }}>&#9656;</span>
          <span className={styles.sbSecLb}>Clients</span>
          <span className={styles.sbSecN}>{CLIENTS.length}</span>
        </div>

        {clientsOpen && <>
          {CLIENTS.map(cl => {
            const on = active === cl.id;
            const sc = cl.status === "overdue" ? "var(--ov)" : cl.status === "active" ? "var(--pos)" : cl.status === "lead" ? "var(--rdy)" : "var(--g300, #d0cfcb)";
            const hasOverdue = cl.tasks.some(t => t.status === "overdue");

            return (
              <div key={cl.id} className={`${styles.cl} ${on ? styles.clOn : ""}`}>
                <div className={styles.clMain} onClick={() => setActive(on ? null : cl.id)}>
                  <div className={`${styles.clAv} ${cl.status === "overdue" ? styles.clAvOv : cl.status === "lead" ? styles.clAvLead : ""}`}>
                    {cl.av}
                    <div className={styles.clAvDot} style={{ background: sc }} />
                  </div>
                  <div className={styles.clInfo}>
                    <div className={styles.clName}>{cl.name}</div>
                    <div className={styles.clMeta}>
                      {cl.owed > 0 ? <span style={{ color: cl.status === "overdue" ? "var(--ov)" : undefined }}>${(cl.owed / 1000).toFixed(1)}k owed</span> : <span>New lead</span>}
                      {" \u00b7 "}{cl.last}
                    </div>
                  </div>
                  <div className={styles.clRight}>
                    {cl.tasks.length > 0 && <span className={`${styles.clCount} ${hasOverdue ? styles.clCountAlert : ""}`}>{cl.tasks.length}</span>}
                    <span className={styles.clChevron}>{on ? "\u25be" : "\u203a"}</span>
                  </div>
                </div>

                {on && (
                  <div className={styles.clExp}>
                    {cl.tasks.length > 0 && (
                      <div className={styles.clTasks}>
                        {cl.tasks.slice(0, 3).map((t, i) => (
                          <div key={i} className={`${styles.clTask} ${t.status === "overdue" ? styles.clTaskOv : ""}`}>
                            <div className={styles.clTaskDot} style={{ background: t.status === "overdue" ? "var(--ov)" : t.status === "active" ? "var(--pos)" : "var(--g300, #d0cfcb)" }} />
                            <span className={styles.clTaskName}>{t.title}</span>
                            <div className={styles.clTaskRight}>
                              {"timer" in t && t.timer && <span className={styles.clTaskTimer}>&#9679; 1:22</span>}
                              <span className={styles.clTaskDue}>{t.due}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {cl.status === "overdue" && <button className={`${styles.clBtn} ${styles.clBtnRemind}`}>Send Reminder</button>}
                    {cl.status === "active" && <button className={`${styles.clBtn} ${styles.clBtnInvoice}`}>$ Invoice</button>}
                    {cl.status === "lead" && <button className={`${styles.clBtn} ${styles.clBtnPropose}`}>&rarr; Send Proposal</button>}
                  </div>
                )}
              </div>
            );
          })}

          <div className={styles.clAdd}>
            <span className={styles.clAddIcon}>+</span>
            Add Client
          </div>
        </>}

        {/* Signals */}
        <div className={styles.sbSec} onClick={() => setSignalsOpen(!signalsOpen)}>
          <span className={styles.sbSecArrow} style={{ transform: signalsOpen ? "rotate(90deg)" : "rotate(0)" }}>&#9656;</span>
          <span className={styles.sbSecLb}>Signals</span>
          <span className={styles.sbSecN}>{SIGNALS.length}</span>
        </div>

        {signalsOpen && SIGNALS.map((sig, i) => (
          <div key={i} className={styles.sig}>
            <div className={`${styles.sigDot} ${styles[URG_CLASS[sig.urg]] || ""}`} />
            <span className={styles.sigText}>{sig.text}</span>
            <span className={styles.sigTime}>{sig.time}</span>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className={styles.sbQa}>
        <button className={styles.sbQaBtn}><span className={styles.sbQaIcon}>$</span>Invoice<span className={styles.sbQaKey}>N</span></button>
        <button className={styles.sbQaBtn}><span className={styles.sbQaIcon}>&#9654;</span>Timer<span className={styles.sbQaKey}>T</span></button>
      </div>

      {/* Footer */}
      <div className={styles.sbFt}>
        <span className={styles.sbFtL}>{CLIENTS.length} clients &middot; 7 tasks</span>
        <div className={styles.sbFtR}><span className={styles.sbFtDot} /><span>synced</span></div>
      </div>
    </div>
  );
}
