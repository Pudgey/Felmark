"use client";

import { useState } from "react";
import { useWorkspaceNav } from "@/views/routers/WorkspaceRouter";
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

interface CtxMenu {
  type: "client" | "section";
  pos: { top: number; left: number };
  clientId?: string;
  section?: "clients" | "signals";
}

export default function WorkspaceSidebar() {
  const [active, setActive] = useState<string | null>("c1");
  const [clientsOpen, setClientsOpen] = useState(true);
  const [signalsOpen, setSignalsOpen] = useState(true);
  const [ctx, setCtx] = useState<CtxMenu | null>(null);
  const nav = useWorkspaceNav();

  const openClientCtx = (e: React.MouseEvent, clientId: string) => {
    e.preventDefault();
    setCtx({ type: "client", pos: { top: e.clientY, left: e.clientX }, clientId });
  };

  const openSectionCtx = (e: React.MouseEvent, section: "clients" | "signals") => {
    e.preventDefault();
    setCtx({ type: "section", pos: { top: e.clientY, left: e.clientX }, section });
  };

  const closeCtx = () => setCtx(null);

  const ctxClient = ctx?.clientId ? CLIENTS.find(c => c.id === ctx.clientId) : null;

  return (
    <div className={styles.sb}>
      {/* Header */}
      <div className={styles.sbHd}>
        <div className={styles.sbAvatar}>AM</div>
        <span className={styles.sbHdName}>Alex Mercer</span>
        <div className={styles.sbIco}>{"\u2699"}</div>
      </div>

      {/* Stats */}
      <div className={styles.sbStats}>
        {/* Earned — rich sparkline card */}
        <div className={styles.earnedCard}>
          <div className={styles.earnedRow}>
            <div>
              <div className={styles.earnedLabel}>Earned this month</div>
              <div className={styles.earnedVal}>$14,800</div>
            </div>
            <div className={styles.earnedRight}>
              <span className={styles.earnedPct}>74%</span>
              <span className={styles.earnedGoal}>of $20k goal</span>
            </div>
          </div>
          <svg className={styles.earnedChart} viewBox="0 0 252 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#26a69a" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#26a69a" stopOpacity="0.01" />
              </linearGradient>
            </defs>
            {(() => {
              const data = [0,0,450,450,1650,1650,1650,2450,2450,2450,4850,4850,5450,5450,5450,7250,7250,7250,8200,8200,8200,10400,10400,10400,12000,12000,12000,12000,13800,14800];
              const goal = 20000;
              const pts = data.map((v, i) => `${(i / 29) * 252},${38 - (v / goal) * 36}`);
              const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p}`).join(" ");
              const area = `M0,40 ${pts.map((p) => `L${p}`).join(" ")} L252,40 Z`;
              const lastY = 38 - (14800 / goal) * 36;
              return (
                <>
                  <line x1="0" y1={38 - (goal / goal) * 36} x2="252" y2={38 - (goal / goal) * 36} stroke="var(--warm-200, #e0dfdb)" strokeWidth="0.5" strokeDasharray="3 2" />
                  <path d={area} fill="url(#earnGrad)" />
                  <path d={line} fill="none" stroke="#26a69a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx={252} cy={lastY} r="2.5" fill="#fff" stroke="#26a69a" strokeWidth="1.5" />
                </>
              );
            })()}
          </svg>
          <div className={styles.earnedFt}>
            <span>Apr 1</span>
            <span style={{ color: "#26a69a" }}>+12% vs last month</span>
            <span>Apr 30</span>
          </div>
        </div>

        {/* Outstanding — compact client blocks */}
        <div className={styles.outstandingCard}>
          <div className={styles.outstandingRow}>
            <div className={styles.outstandingLabel}>Outstanding</div>
            <span className={styles.outstandingVal}>$9,600</span>
          </div>
          <div className={styles.outstandingClients}>
            {[
              { av: "BF", name: "Bolt Fitness", amount: "$4,000", days: "4d late", status: "overdue" as const },
              { av: "NK", name: "Nora Kim", amount: "$3,200", days: "7d left", status: "pending" as const },
              { av: "MS", name: "Meridian", amount: "$2,400", days: "8d left", status: "pending" as const },
            ].map((c, i) => (
              <div key={i} className={`${styles.outClient} ${c.status === "overdue" ? styles.outClientOv : ""}`}>
                <div className={`${styles.outClientAv} ${c.status === "overdue" ? styles.outClientAvOv : ""}`}>{c.av}</div>
                <span className={styles.outClientName}>{c.name}</span>
                <span className={styles.outClientAmount} style={{ color: c.status === "overdue" ? "#ef5350" : "var(--ink-800, #2a2926)" }}>{c.amount}</span>
                <span className={styles.outClientDays} style={{ color: c.status === "overdue" ? "#ef5350" : "var(--ink-400, #a5a49f)" }}>{c.days}</span>
              </div>
            ))}
          </div>
          <div className={styles.outstandingBar}>
            <div style={{ flex: 4000, background: "#ef5350", borderRadius: "2px 0 0 2px" }} />
            <div style={{ flex: 3200, background: "rgba(255, 152, 0, .4)" }} />
            <div style={{ flex: 2400, background: "rgba(255, 152, 0, .25)", borderRadius: "0 2px 2px 0" }} />
          </div>
        </div>

        {/* Tasks — dense tracker */}
        <div className={styles.tasksCard}>
          <div className={styles.tasksRow}>
            <div>
              <span className={styles.tasksCount}>7</span>
              <span className={styles.tasksLabel}> tasks</span>
            </div>
            <span className={styles.tasksHours}>16.5h logged</span>
          </div>
          {/* Status bar */}
          <div className={styles.tasksBar}>
            <div style={{ flex: 1, background: "#ef5350", borderRadius: "2px 0 0 2px" }} />
            <div style={{ flex: 3, background: "#26a69a" }} />
            <div style={{ flex: 3, background: "var(--warm-200, #e0dfdb)", borderRadius: "0 2px 2px 0" }} />
          </div>
          {/* Overdue */}
          <div className={styles.tasksOv}>
            <div className={styles.tasksOvHd}>
              <div className={styles.tasksOvDot} />
              <span className={styles.tasksOvLabel}>Overdue</span>
              <span className={styles.tasksOvCount}>1</span>
            </div>
            <div className={styles.taskItem}>
              <div className={`${styles.taskPri} ${styles.taskPriUrgent}`} />
              <span className={`${styles.taskName} ${styles.taskNameOv}`}>Client review &amp; revisions</span>
              <span className={`${styles.taskDue} ${styles.taskDueOv}`}>Apr 1</span>
            </div>
          </div>
          {/* Active */}
          <div className={styles.tasksList}>
            {[
              { title: "Color palette & typography", pri: "high", pct: 50, due: "Apr 2", timer: true },
              { title: "Blog post #1 draft", pri: "medium", pct: 33, due: "Apr 3" },
              { title: "Onboarding UX revisions", pri: "high", pct: 67, due: "Apr 5" },
            ].map((t, i) => (
              <div key={i} className={styles.taskItem}>
                <div className={`${styles.taskPri} ${t.pri === "high" ? styles.taskPriHigh : styles.taskPriMed}`} />
                <span className={styles.taskName}>{t.title}</span>
                {"timer" in t && t.timer && <span className={styles.taskTimer}>{"\u25cf"}</span>}
                <div className={styles.taskBar}><div className={styles.taskBarFill} style={{ width: `${t.pct}%` }} /></div>
                <span className={styles.taskDue}>{t.due}</span>
              </div>
            ))}
          </div>
          <div className={styles.tasksFt}>+ 3 upcoming</div>
        </div>
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
        <div className={styles.sbSec} onClick={() => setClientsOpen(!clientsOpen)} onContextMenu={(e) => openSectionCtx(e, "clients")}>
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
                <div className={styles.clMain} onClick={() => setActive(on ? null : cl.id)} onContextMenu={(e) => openClientCtx(e, cl.id)}>
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
                  <div className={styles.clExp} onContextMenu={(e) => openClientCtx(e, cl.id)}>
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
        <div className={styles.sbSec} onClick={() => setSignalsOpen(!signalsOpen)} onContextMenu={(e) => openSectionCtx(e, "signals")}>
          <span className={styles.sbSecArrow} style={{ transform: signalsOpen ? "rotate(90deg)" : "rotate(0)" }}>&#9656;</span>
          <span className={styles.sbSecLb}>Signals</span>
          <span className={styles.sbSecN}>{SIGNALS.length}</span>
        </div>

        {signalsOpen && SIGNALS.map((sig, i) => (
          <div key={i} className={styles.sig} onContextMenu={(e) => openSectionCtx(e, "signals")}>
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
      {/* Context menu */}
      {ctx && (
        <div className={styles.ctxOverlay} onClick={closeCtx}>
          <div className={styles.ctxMenu} style={{ position: "fixed", top: ctx.pos.top, left: ctx.pos.left }} onClick={e => e.stopPropagation()}>
            {ctx.type === "client" && ctxClient && <>
              <div className={styles.ctxHeader}>{ctxClient.name}</div>
              <div className={styles.ctxItem} onClick={() => { nav.openHub({ clientId: ctxClient.id, clientName: ctxClient.name, clientAvatar: ctxClient.av, clientColor: ctxClient.status === "overdue" ? "#8a7e63" : "#7c8594" }); closeCtx(); }}>
                <span className={styles.ctxIcon}>{"\u25c7"}</span><span>Open Hub</span>
              </div>
              <div className={styles.ctxItem} onClick={closeCtx}>
                <span className={styles.ctxIcon}>{"\u25b6"}</span><span>Start Timer</span>
              </div>
              <div className={styles.ctxItem} onClick={closeCtx}>
                <span className={styles.ctxIcon}>$</span><span>Send Invoice</span>
              </div>
              <div className={styles.ctxItem} onClick={closeCtx}>
                <span className={styles.ctxIcon}>{"\u2709"}</span><span>Message</span>
              </div>
              <div className={styles.ctxSep} />
              <div className={styles.ctxItem} onClick={closeCtx}>
                <span className={styles.ctxIcon}>{"\u270e"}</span><span>Edit Client</span>
              </div>
              <div className={`${styles.ctxItem} ${styles.ctxItemDanger}`} onClick={closeCtx}>
                <span className={styles.ctxIcon}>{"\u2715"}</span><span>Archive Client</span>
              </div>
            </>}
            {ctx.type === "section" && ctx.section === "clients" && <>
              <div className={styles.ctxHeader}>Clients</div>
              <div className={styles.ctxItem} onClick={() => { setClientsOpen(!clientsOpen); closeCtx(); }}>
                <span className={styles.ctxIcon}>{clientsOpen ? "\u25b4" : "\u25be"}</span><span>{clientsOpen ? "Collapse" : "Expand"}</span>
              </div>
              <div className={styles.ctxSep} />
              <div className={styles.ctxItem} onClick={closeCtx}>
                <span className={styles.ctxIcon}>{"\u2195"}</span><span>Sort by name</span>
              </div>
              <div className={styles.ctxItem} onClick={closeCtx}>
                <span className={styles.ctxIcon}>$</span><span>Sort by owed</span>
              </div>
              <div className={styles.ctxItem} onClick={closeCtx}>
                <span className={styles.ctxIcon}>!</span><span>Sort by status</span>
              </div>
              <div className={styles.ctxSep} />
              <div className={styles.ctxItem} onClick={closeCtx}>
                <span className={styles.ctxIcon}>+</span><span>Add Client</span>
              </div>
            </>}
            {ctx.type === "section" && ctx.section === "signals" && <>
              <div className={styles.ctxHeader}>Signals</div>
              <div className={styles.ctxItem} onClick={() => { setSignalsOpen(!signalsOpen); closeCtx(); }}>
                <span className={styles.ctxIcon}>{signalsOpen ? "\u25b4" : "\u25be"}</span><span>{signalsOpen ? "Collapse" : "Expand"}</span>
              </div>
              <div className={styles.ctxSep} />
              <div className={styles.ctxItem} onClick={closeCtx}>
                <span className={styles.ctxIcon}>{"\u2713"}</span><span>Mark all read</span>
              </div>
              <div className={styles.ctxItem} onClick={closeCtx}>
                <span className={styles.ctxIcon}>{"\u25ce"}</span><span>Filter by urgency</span>
              </div>
            </>}
          </div>
        </div>
      )}
    </div>
  );
}
