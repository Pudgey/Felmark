"use client";

import { useState, useRef } from "react";
import WorkspaceTerminalMount from "@/components/terminal/mounts/WorkspaceTerminalMount";
import { useWorkspaceNav } from "@/views/routers/WorkspaceRouter";
import styles from "./SplitPanes.module.css";

/* ── Surface definitions ── */
const SURFACES = [
  { id: "money", label: "Money", icon: "$", desc: "Invoices, revenue, payments", action: "+ New Invoice", shortcut: "N", stateVal: "$14.8k", stateLb: "earned", color: "#26a69a" },
  { id: "work", label: "Work", icon: "\u25c6", desc: "Tasks, timers, subtasks", action: "+ New Task", shortcut: "\u21e7N", stateVal: "5", stateLb: "active", color: "#2962ff" },
  { id: "signals", label: "Signals", icon: "\u25ce", desc: "Client activity feed", action: "View Signals", shortcut: "S", stateVal: "3", stateLb: "new", color: "#ff9800" },
  { id: "pipeline", label: "Pipeline", icon: "\u2192", desc: "Deals, proposals, contracts", action: "+ New Deal", shortcut: "P", stateVal: "4", stateLb: "deals", color: "#26a69a" },
  { id: "clients", label: "Clients", icon: "\u25c7", desc: "Client records & contacts", action: "+ Add Client", shortcut: "C", stateVal: "4", stateLb: "total", color: "#2962ff" },
  { id: "time", label: "Time", icon: "\u25b6", desc: "Time entries & tracking", action: "\u25b6 Start Timer", shortcut: "T", stateVal: "7.2h", stateLb: "today", color: "#ff9800" },
  { id: "terminal", label: "Terminal", icon: "\u25b8", desc: "Forge command line", action: "Open Terminal", shortcut: "`", stateVal: "forge", stateLb: "ready", color: "#26a69a" },
] as const;

type SurfaceId = (typeof SURFACES)[number]["id"];

/* ── Demo data ── */
const INVOICES = [
  { id: "i1", client: "Bolt Fitness", av: "BF", num: "047", amount: 4000, days: "4d late", status: "overdue" as const, viewed: 2 },
  { id: "i2", client: "Meridian Studio", av: "MS", num: "048", amount: 2400, days: "8d left", status: "pending" as const, viewed: 3 },
  { id: "i3", client: "Nora Kim", av: "NK", num: "049", amount: 3200, days: "7d left", status: "pending" as const, viewed: 0 },
  { id: "i4", client: "Meridian Studio", av: "MS", num: "046", amount: 1800, days: "Paid Mar 28", status: "paid" as const },
];

const TASKS = [
  { id: "t0", title: "Client review & revisions", client: "Meridian", due: "Apr 1", status: "overdue" as const, pri: "urgent" as const, logged: "1.5h", est: "4h", subs: 3, subsDone: 0 },
  { id: "t1", title: "Color palette & typography", client: "Meridian", due: "Apr 2", status: "active" as const, pri: "high" as const, logged: "3h", est: "6h", subs: 4, subsDone: 2, timer: true },
  { id: "t2", title: "Blog post #1 draft", client: "Bolt Fitness", due: "Apr 3", status: "active" as const, pri: "medium" as const, logged: "4h", est: "6h", subs: 3, subsDone: 1 },
  { id: "t3", title: "Brand guidelines document", client: "Meridian", due: "Apr 5", status: "todo" as const, pri: "medium" as const, logged: "0h", est: "16h", subs: 6, subsDone: 0 },
  { id: "t4", title: "Landing page wireframes", client: "Nora Kim", due: "Apr 8", status: "todo" as const, pri: "medium" as const, logged: "0h", est: "10h", subs: 4, subsDone: 0 },
];

const SIGNAL_DATA = [
  { av: "MS", title: "Invoice #044 viewed", desc: "Sarah stayed 2m 14s on payment page.", time: "3m", urg: "hot" as const, action: "Follow up" },
  { av: "AC", title: "Contract signed", desc: "Aster & Co. completed signature.", time: "18m", urg: "ready" as const, action: "Send invoice" },
  { av: "NK", title: "No reply in 46 hours", desc: "North Kite feedback window narrowing.", time: "46h", urg: "watch" as const, action: "Send nudge" },
  { av: "NK", title: "Payment received", desc: "$2,200 deposited. Invoice #045 closed.", time: "2h", urg: "done" as const },
  { av: "LB", title: "Proposal opened", desc: "Maria viewed 4 pages, spent 3 minutes.", time: "1h", urg: "hot" as const, action: "Follow up" },
];

const PIPELINE_DEALS = [
  { client: "Luna Boutique", project: "Brand Identity", value: 6500, stage: "proposal" as const, dots: 1 },
  { client: "Meridian", project: "Guidelines v2 Phase 2", value: 4800, stage: "contract" as const, dots: 2 },
  { client: "Nora Kim", project: "Course Landing Page", value: 3200, stage: "invoice" as const, dots: 3 },
  { client: "Bolt Fitness", project: "App Onboarding UX", value: 4000, stage: "paid" as const, dots: 4 },
];

const CLIENTS_DATA = [
  { av: "MS", name: "Meridian Studio", owed: 2400, last: "2m", tasks: 3, status: "active" as const },
  { av: "NK", name: "Nora Kim", owed: 3200, last: "1h", tasks: 2, status: "active" as const },
  { av: "BF", name: "Bolt Fitness", owed: 4000, last: "3d", tasks: 2, status: "overdue" as const },
  { av: "LB", name: "Luna Boutique", owed: 0, last: "2h", tasks: 0, status: "lead" as const },
];

const TIME_ENTRIES = [
  { task: "Color palette & typography", client: "Meridian", hours: 1.37, rate: 120, running: true },
  { task: "Blog post #1 draft", client: "Bolt Fitness", hours: 1.5, rate: 95 },
  { task: "Client call \u2014 scope", client: "Meridian", hours: 0.75, rate: 120 },
  { task: "Onboarding revisions", client: "Bolt Fitness", hours: 3.5, rate: 95 },
];

/* ── Empty pane state ── */
function EmptyPane({ surfaceId }: { surfaceId: SurfaceId }) {
  const surf = SURFACES.find(s => s.id === surfaceId)!;
  return (
    <div className={styles.emptyPane}>
      <div className={styles.emptyInner}>
        <div className={styles.emptyGlyph}>{surf.icon}</div>
        <div className={styles.emptyTitle}>{surf.label}</div>
        <div className={styles.emptySub}>{surf.desc}</div>
        <button className={styles.emptyAction}>{surf.action}</button>
        <div className={styles.emptyShortcut}>Press {surf.shortcut}</div>
      </div>
    </div>
  );
}

/* ── Pane content components ── */

function MoneyPane() {
  const [exp, setExp] = useState<string | null>("i1");
  return (
    <div>
      <div className={styles.metrics}>
        <div className={styles.metric}><span className={`${styles.metricVal} ${styles.pos}`}>$14,800</span><span className={styles.metricLabel}>Earned</span></div>
        <div className={styles.metricSep} />
        <div className={styles.metric}><span className={`${styles.metricVal} ${styles.ov}`}>$9,600</span><span className={styles.metricLabel}>Owed</span></div>
        <div className={styles.metricSep} />
        <div className={styles.metric}><span className={styles.metricVal}>$108<span className={styles.metricUnit}>/hr</span></span><span className={styles.metricLabel}>Rate</span></div>
        <div className={styles.metricSep} />
        <div className={styles.metric}><span className={styles.metricVal}>74%</span><span className={styles.metricLabel}>Goal</span></div>
      </div>
      {INVOICES.map(inv => {
        const on = exp === inv.id;
        return (
          <div key={inv.id} className={`${styles.row} ${inv.status === "overdue" ? styles.rowOv : ""} ${on ? styles.rowOn : ""}`}>
            <div className={styles.rowMain} onClick={() => setExp(on ? null : inv.id)}>
              <div className={`${styles.avXs} ${inv.status === "overdue" ? styles.avOv : inv.status === "paid" ? styles.avPos : ""}`}>{inv.av}</div>
              <div className={styles.rowInfo}><span className={styles.rowName}>{inv.client}</span><span className={styles.rowMeta}>#{inv.num}</span></div>
              <span className={styles.rowMono}>${inv.amount.toLocaleString()}</span>
              <span className={`${styles.rowMono} ${styles.sm} ${inv.status === "overdue" ? styles.ov : ""}`}>{inv.days}</span>
              <span className={`${styles.pill} ${styles[inv.status]}`}>{inv.status}</span>
              <span className={styles.chev}>{on ? "\u25be" : "\u203a"}</span>
            </div>
            {on && (
              <div className={styles.rowExp}>
                <div className={styles.expKv}><span className={styles.expL}>Viewed</span><span className={styles.expV}>{(inv.viewed ?? 0) > 0 ? `${inv.viewed}\u00d7 by client` : "Not opened"}</span></div>
                <div className={styles.expActions}>
                  {inv.status === "overdue" && <button className={styles.btnDanger}>Send Reminder</button>}
                  {inv.status === "pending" && <button className={styles.btn}>Resend</button>}
                  <button className={styles.btn}>Copy Link</button>
                  {inv.status === "paid" && <span className={styles.confirm}>&check; Received</span>}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function WorkPane() {
  const [exp, setExp] = useState<string | null>("t1");
  const nav = useWorkspaceNav();

  const CLIENT_MAP: Record<string, { id: string; name: string; av: string; color: string }> = {
    "Meridian": { id: "c1", name: "Meridian Studio", av: "MS", color: "#7c8594" },
    "Bolt Fitness": { id: "c3", name: "Bolt Fitness", av: "BF", color: "#8a7e63" },
    "Nora Kim": { id: "c2", name: "Nora Kim", av: "NK", color: "#a08472" },
  };

  const openClientHub = (clientKey: string) => {
    const c = CLIENT_MAP[clientKey];
    if (c) nav.openHub({ clientId: c.id, clientName: c.name, clientAvatar: c.av, clientColor: c.color });
  };

  return (
    <div>
      {TASKS.map(t => {
        const on = exp === t.id;
        return (
          <div key={t.id} className={`${styles.row} ${t.status === "overdue" ? styles.rowOv : ""} ${on ? styles.rowOn : ""}`}>
            <div className={styles.rowMain} onClick={() => setExp(on ? null : t.id)}>
              <div className={`${styles.priLine} ${styles[t.pri]}`} />
              <div className={styles.rowInfo}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className={styles.rowName}>{t.title}</span>
                  {t.timer && <span className={styles.timerTag}>&#9679; 1:22</span>}
                </div>
                <span className={styles.rowMeta}>{t.client}{t.subs > 0 ? ` \u00b7 ${t.subsDone}/${t.subs}` : ""}</span>
              </div>
              <span className={`${styles.rowMono} ${styles.sm} ${t.status === "overdue" ? styles.ov : ""}`}>{t.due}</span>
              <span className={`${styles.rowMono} ${styles.sm} ${styles.dim}`}>{t.logged}<span className={styles.dim2}>/{t.est}</span></span>
              <span className={styles.chev}>{on ? "\u25be" : "\u203a"}</span>
            </div>
            {on && (
              <div className={styles.rowExp}>
                <div className={styles.expRow}>
                  <div className={styles.expKv}><span className={styles.expL}>Priority</span><span className={styles.expV} style={{ textTransform: "capitalize", color: t.pri === "urgent" ? "#ef5350" : t.pri === "high" ? "#ff9800" : undefined }}>{t.pri}</span></div>
                  <div className={styles.expKv}><span className={styles.expL}>Time</span><span className={styles.expV}>{t.logged} / {t.est}</span></div>
                  {t.subs > 0 && <div className={styles.expKv}><span className={styles.expL}>Subtasks</span><span className={styles.expV}>{t.subsDone}/{t.subs}</span></div>}
                </div>
                <div className={styles.expActions}>
                  {!t.timer && <button className={styles.btn}>&#9654; Timer</button>}
                  {t.timer && <button className={`${styles.btn} ${styles.btnTimer}`}>&#9632; Stop</button>}
                  <button className={styles.btn}>+ Subtask</button>
                  <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={(e) => { e.stopPropagation(); openClientHub(t.client); }}>Open Hub {"\u2192"}</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SignalsPane() {
  return (
    <div>
      {SIGNAL_DATA.map((s, i) => (
        <div key={i} className={styles.sigRow}>
          <div className={`${styles.avXs} ${styles[`av${s.urg.charAt(0).toUpperCase() + s.urg.slice(1)}`] || ""}`}>{s.av}</div>
          <div className={styles.sigBody}>
            <div className={styles.sigTop}><span className={styles.rowName}>{s.title}</span><span className={`${styles.rowMono} ${styles.dim}`}>{s.time}</span></div>
            <div className={styles.sigDesc}>{s.desc}</div>
            {s.action && <button className={`${styles.sigBtn} ${styles[`sigBtn${s.urg.charAt(0).toUpperCase() + s.urg.slice(1)}`] || ""}`}>{s.action}</button>}
          </div>
        </div>
      ))}
    </div>
  );
}

function PipelinePane() {
  const stageLabels: Record<string, string> = { proposal: "Proposal", contract: "Contract", invoice: "Invoice", paid: "Paid" };
  return (
    <div>
      <div className={styles.pipeBar}>
        {(["proposal", "contract", "invoice", "paid"] as const).map((s, i) => {
          const n = PIPELINE_DEALS.filter(d => d.stage === s).length;
          return (
            <div key={s} className={styles.pipeSeg}>
              <div className={`${styles.pipeSegBar} ${styles[`pipe${s.charAt(0).toUpperCase() + s.slice(1)}`]}`} />
              <div className={styles.pipeSegInfo}><span className={styles.pipeSegLb}>{stageLabels[s]}</span><span className={styles.pipeSegN}>{n}</span></div>
              {i < 3 && <span className={styles.pipeArr}>&rarr;</span>}
            </div>
          );
        })}
      </div>
      {PIPELINE_DEALS.map((d, i) => (
        <div key={i} className={styles.row}><div className={styles.rowMain}>
          <div className={styles.dots}>{[0, 1, 2, 3].map(n => <div key={n} className={`${styles.dot} ${n < d.dots ? styles.dotOn : ""}`} style={n < d.dots ? { background: d.stage === "paid" ? "#26a69a" : d.stage === "invoice" ? "#2962ff" : d.stage === "contract" ? "#ff9800" : "#9598a1" } : undefined} />)}</div>
          <div className={styles.rowInfo}><span className={styles.rowName}>{d.client}</span><span className={styles.rowMeta}>{d.project}</span></div>
          <span className={styles.rowMono}>${d.value.toLocaleString()}</span>
          <span className={`${styles.pill} ${d.stage === "paid" ? styles.paid : d.stage === "invoice" ? styles.pending : styles.neutral}`}>{stageLabels[d.stage]}</span>
        </div></div>
      ))}
    </div>
  );
}

function ClientsPane() {
  return (
    <div>
      {CLIENTS_DATA.map((cl, i) => (
        <div key={i} className={`${styles.row} ${cl.status === "overdue" ? styles.rowOv : ""}`}><div className={styles.rowMain}>
          <div className={`${styles.avXs} ${cl.status === "overdue" ? styles.avOv : cl.status === "lead" ? styles.avRdy : ""}`}>{cl.av}</div>
          <div className={styles.rowInfo}><span className={styles.rowName}>{cl.name}</span><span className={styles.rowMeta}>{cl.owed > 0 ? `$${(cl.owed / 1000).toFixed(1)}k owed` : "New lead"} &middot; {cl.last}</span></div>
          <span className={`${styles.rowMono} ${styles.sm}`}>{cl.tasks} tasks</span>
          <span className={`${styles.pill} ${cl.status === "overdue" ? styles.overdue : cl.status === "lead" ? styles.lead : styles.activeS}`}>{cl.status}</span>
        </div></div>
      ))}
    </div>
  );
}

function TimePane() {
  const total = TIME_ENTRIES.reduce((s, e) => s + e.hours, 0);
  const totalVal = TIME_ENTRIES.reduce((s, e) => s + e.hours * e.rate, 0);
  const avgRate = Math.round(totalVal / total);
  return (
    <div>
      <div className={styles.metrics}>
        <div className={styles.metric}><span className={styles.metricVal}>{total.toFixed(1)}h</span><span className={styles.metricLabel}>Total</span></div>
        <div className={styles.metricSep} />
        <div className={styles.metric}><span className={styles.metricVal}>${Math.round(totalVal).toLocaleString()}</span><span className={styles.metricLabel}>Value</span></div>
        <div className={styles.metricSep} />
        <div className={styles.metric}><span className={styles.metricVal}>${avgRate}</span><span className={styles.metricLabel}>Avg /hr</span></div>
      </div>
      {TIME_ENTRIES.map((e, i) => (
        <div key={i} className={`${styles.row} ${e.running ? styles.rowActive : ""}`}><div className={styles.rowMain}>
          <div className={styles.rowInfo}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className={styles.rowName}>{e.task}</span>
              {e.running && <span className={styles.timerTag}>&#9679; 1:22</span>}
            </div>
            <span className={styles.rowMeta}>{e.client}</span>
          </div>
          <span className={styles.rowMono}>{e.hours.toFixed(1)}h</span>
          <span className={`${styles.rowMono} ${styles.sm}`}>${Math.round(e.hours * e.rate)}</span>
        </div></div>
      ))}
    </div>
  );
}

function TerminalPane() {
  return <WorkspaceTerminalMount />;
}

const PANE_MAP: Record<SurfaceId, React.ComponentType> = {
  money: MoneyPane,
  work: WorkPane,
  signals: SignalsPane,
  pipeline: PipelinePane,
  clients: ClientsPane,
  time: TimePane,
  terminal: TerminalPane,
};

/* ── Context hints per surface ── */
const SURFACE_CONTEXT: Record<SurfaceId, string> = {
  money: "4 invoices \u00b7 $14,800 earned",
  work: "5 tasks \u00b7 2 active",
  signals: "5 signals \u00b7 2 urgent",
  pipeline: "4 deals \u00b7 $18,500 pipeline",
  clients: "4 clients \u00b7 1 overdue",
  time: "7.1h today \u00b7 $833 value",
  terminal: "forge \u00b7 ready",
};

/* ── Single Pane ── */
function Pane({ surface, onSurfaceChange, focused, onFocus, zoomed, onZoom, onSplit, onClose, canClose, canSplit, canFSplit, canRowSplit }: {
  surface: SurfaceId;
  onSurfaceChange: (id: SurfaceId) => void;
  focused?: boolean;
  onFocus?: () => void;
  zoomed?: boolean;
  onZoom?: () => void;
  onSplit?: (dir: "above" | "below" | "left" | "right" | "f-left" | "f-right") => void;
  canFSplit?: boolean;
  canRowSplit?: boolean;
  onClose?: () => void;
  canClose?: boolean;
  canSplit?: boolean;
}) {
  const [dropOpen, setDropOpen] = useState(false);
  const [splitOpen, setSplitOpen] = useState(false);
  const [ctxOpen, setCtxOpen] = useState(false);
  const [splitPos, setSplitPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [dropPos, setDropPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [ctxPos, setCtxPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const Content = PANE_MAP[surface];
  const surf = SURFACES.find(s => s.id === surface)!;

  const closeAll = () => { setDropOpen(false); setSplitOpen(false); setCtxOpen(false); };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setCtxPos({ top: e.clientY, left: e.clientX });
    setCtxOpen(true);
    setDropOpen(false);
    setSplitOpen(false);
  };

  return (
    <div className={`${styles.pane} ${focused ? styles.paneFocused : styles.paneInactive}`} onClick={onFocus}>
      <div className={styles.paneHd} onContextMenu={handleContextMenu}>
        <div className={styles.paneHdLeft} onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setDropPos({ top: rect.bottom + 2, left: rect.left }); setDropOpen(!dropOpen); setSplitOpen(false); }}>
          <span className={styles.paneIcon}>{surf.icon}</span>
          <span className={styles.paneLabel}>{surf.label}</span>
          <span className={styles.paneChevron}>{"\u25be"}</span>
        </div>
        <div className={styles.paneHdSep} />
        <span className={styles.paneHdContext}>{SURFACE_CONTEXT[surface]}</span>
        {dropOpen && (
          <div className={styles.paneDrop} style={{ position: "fixed", top: dropPos.top, left: dropPos.left }}>
            {SURFACES.map((s, i) => (
              <div key={s.id} className={`${styles.paneDropOpt} ${s.id === surface ? styles.paneDropOn : ""}`}
                onClick={() => { onSurfaceChange(s.id); setDropOpen(false); }}>
                <div className={`${styles.paneDropIconBox} ${s.id === surface ? styles.paneDropIconBoxOn : ""}`}>{s.icon}</div>
                <div className={styles.paneDropInfo}>
                  <span className={styles.paneDropName}>{s.label}</span>
                  <span className={styles.paneDropDesc}>{s.desc}</span>
                </div>
                <div className={styles.paneDropState}>
                  <span className={styles.paneDropStateVal} style={{ color: s.color }}>{s.stateVal}</span>
                  <span className={styles.paneDropStateLb}>{s.stateLb}</span>
                </div>
                <span className={styles.paneDropKey}>{i + 1}</span>
              </div>
            ))}
          </div>
        )}
        {splitOpen && canSplit && (
          <div className={styles.splitDrop} style={{ position: "fixed", top: splitPos.top, left: splitPos.left }}>
            <div className={styles.splitDropOpt} onClick={() => { onSplit?.("above"); setSplitOpen(false); }}>
              <div className={styles.splitDropPreview}>
                <div className={styles.splitDropNew} />
                <div className={styles.splitDropCur}>{surf.icon}</div>
              </div>
              <div className={styles.splitDropInfo}>
                <span className={styles.splitDropLabel}>Split above</span>
                <span className={styles.splitDropKey}>{"\u21e7\u2191"}</span>
              </div>
            </div>
            <div className={styles.splitDropOpt} onClick={() => { onSplit?.("below"); setSplitOpen(false); }}>
              <div className={styles.splitDropPreview}>
                <div className={styles.splitDropCur}>{surf.icon}</div>
                <div className={styles.splitDropNew} />
              </div>
              <div className={styles.splitDropInfo}>
                <span className={styles.splitDropLabel}>Split below</span>
                <span className={styles.splitDropKey}>{"\u21e7\u2193"}</span>
              </div>
            </div>
            {canRowSplit && <>
              <div className={styles.splitDropSep} />
              <div className={styles.splitDropOpt} onClick={() => { onSplit?.("left"); setSplitOpen(false); }}>
                <div className={`${styles.splitDropPreview} ${styles.splitDropPreviewH}`}>
                  <div className={styles.splitDropNew} />
                  <div className={styles.splitDropCur}>{surf.icon}</div>
                </div>
                <div className={styles.splitDropInfo}>
                  <span className={styles.splitDropLabel}>Split left</span>
                  <span className={styles.splitDropKey}>{"\u21e7\u2190"}</span>
                </div>
              </div>
              <div className={styles.splitDropOpt} onClick={() => { onSplit?.("right"); setSplitOpen(false); }}>
                <div className={`${styles.splitDropPreview} ${styles.splitDropPreviewH}`}>
                  <div className={styles.splitDropCur}>{surf.icon}</div>
                  <div className={styles.splitDropNew} />
                </div>
                <div className={styles.splitDropInfo}>
                  <span className={styles.splitDropLabel}>Split right</span>
                  <span className={styles.splitDropKey}>{"\u21e7\u2192"}</span>
                </div>
              </div>
            </>}
            {canFSplit && <>
              <div className={styles.splitDropSep} />
              <div className={styles.splitDropOpt} onClick={() => { onSplit?.("f-left"); setSplitOpen(false); }}>
                <div className={`${styles.splitDropPreview} ${styles.splitDropPreviewH}`}>
                  <div className={styles.splitDropNew} />
                  <div className={styles.splitDropCurStack}>
                    <div className={styles.splitDropCurMini} />
                    <div className={styles.splitDropCurMini} />
                  </div>
                </div>
                <div className={styles.splitDropInfo}>
                  <span className={styles.splitDropLabel}>Full left</span>
                  <span className={styles.splitDropKey}>F{"\u2190"}</span>
                </div>
              </div>
              <div className={styles.splitDropOpt} onClick={() => { onSplit?.("f-right"); setSplitOpen(false); }}>
                <div className={`${styles.splitDropPreview} ${styles.splitDropPreviewH}`}>
                  <div className={styles.splitDropCurStack}>
                    <div className={styles.splitDropCurMini} />
                    <div className={styles.splitDropCurMini} />
                  </div>
                  <div className={styles.splitDropNew} />
                </div>
                <div className={styles.splitDropInfo}>
                  <span className={styles.splitDropLabel}>Full right</span>
                  <span className={styles.splitDropKey}>F{"\u2192"}</span>
                </div>
              </div>
            </>}
          </div>
        )}
        <div className={styles.paneHdRight}>
          <div className={styles.paneBeacon}>
            <span className={`${styles.paneBeaconLabel} ${focused ? styles.paneBeaconLabelOn : styles.paneBeaconLabelOff}`}>
              {focused ? "active" : "idle"}
            </span>
            <div className={`${styles.paneBeaconDot} ${focused ? styles.paneBeaconDotOn : styles.paneBeaconDotOff}`} />
          </div>
          <span className={`${styles.paneHdAction} ${zoomed ? styles.paneHdActionActive : ""}`} onClick={e => { e.stopPropagation(); onZoom?.(); }} title={zoomed ? "Restore" : "Maximize"}>{zoomed ? "\u2923" : "\u2922"}</span>
          {canSplit && !zoomed && (
            <span className={styles.paneHdAction} onClick={e => { e.stopPropagation(); const rect = e.currentTarget.getBoundingClientRect(); setSplitPos({ top: rect.bottom + 2, left: rect.right - 180 }); setSplitOpen(!splitOpen); setDropOpen(false); }} title="Split pane">{"\u2295"}</span>
          )}
          {canClose && <span className={`${styles.paneHdAction} ${styles.paneHdActionClose}`} onClick={e => { e.stopPropagation(); onClose?.(); }} title="Close pane">{"\u00d7"}</span>}
        </div>
        {/* Right-click context menu */}
        {ctxOpen && (
          <div className={styles.ctxMenu} style={{ position: "fixed", top: ctxPos.top, left: ctxPos.left }}>
            {/* Switch surface */}
            <div className={styles.ctxGroup}>
              <span className={styles.ctxGroupLabel}>Switch surface</span>
              {SURFACES.map(s => (
                <div key={s.id} className={`${styles.ctxItem} ${s.id === surface ? styles.ctxItemOn : ""}`}
                  onClick={() => { onSurfaceChange(s.id); closeAll(); }}>
                  <span className={styles.ctxItemIcon}>{s.icon}</span>
                  <span className={styles.ctxItemLabel}>{s.label}</span>
                  {s.id === surface && <span className={styles.ctxItemCheck}>{"\u2713"}</span>}
                </div>
              ))}
            </div>
            <div className={styles.ctxSep} />
            {/* Pane actions */}
            <div className={styles.ctxItem} onClick={() => { onZoom?.(); closeAll(); }}>
              <span className={styles.ctxItemIcon}>{zoomed ? "\u2923" : "\u2922"}</span>
              <span className={styles.ctxItemLabel}>{zoomed ? "Restore pane" : "Maximize pane"}</span>
              <span className={styles.ctxItemKey}>{"\u21e7"}F</span>
            </div>
            {canSplit && !zoomed && <>
              <div className={styles.ctxItem} onClick={() => { onSplit?.("above"); closeAll(); }}>
                <span className={styles.ctxItemIcon}>{"\u2191"}</span>
                <span className={styles.ctxItemLabel}>Split above</span>
                <span className={styles.ctxItemKey}>{"\u21e7\u2191"}</span>
              </div>
              <div className={styles.ctxItem} onClick={() => { onSplit?.("below"); closeAll(); }}>
                <span className={styles.ctxItemIcon}>{"\u2193"}</span>
                <span className={styles.ctxItemLabel}>Split below</span>
                <span className={styles.ctxItemKey}>{"\u21e7\u2193"}</span>
              </div>
              {canRowSplit && <>
                <div className={styles.ctxItem} onClick={() => { onSplit?.("left"); closeAll(); }}>
                  <span className={styles.ctxItemIcon}>{"\u2190"}</span>
                  <span className={styles.ctxItemLabel}>Split left</span>
                  <span className={styles.ctxItemKey}>{"\u21e7\u2190"}</span>
                </div>
                <div className={styles.ctxItem} onClick={() => { onSplit?.("right"); closeAll(); }}>
                  <span className={styles.ctxItemIcon}>{"\u2192"}</span>
                  <span className={styles.ctxItemLabel}>Split right</span>
                  <span className={styles.ctxItemKey}>{"\u21e7\u2192"}</span>
                </div>
              </>}
            </>}
            {canClose && <>
              <div className={styles.ctxSep} />
              <div className={`${styles.ctxItem} ${styles.ctxItemDanger}`} onClick={() => { onClose?.(); closeAll(); }}>
                <span className={styles.ctxItemIcon}>{"\u00d7"}</span>
                <span className={styles.ctxItemLabel}>Close pane</span>
                <span className={styles.ctxItemKey}>{"\u21e7"}W</span>
              </div>
            </>}
          </div>
        )}
      </div>
      <div className={styles.paneBody} onClick={() => { if (ctxOpen) closeAll(); }} onContextMenu={handleContextMenu}>
        {Content ? <Content /> : <EmptyPane surfaceId={surface} />}
      </div>
    </div>
  );
}

/* ── Hybrid Header (tabs + prompt) ── */
const HEADER_TABS = [
  { id: "workspace", icon: "\u25c6", label: "Workspace" },
  { id: "workstation", icon: "\u270e", label: "Workstation" },
  { id: "hub", icon: "\u25ce", label: "Hub", dot: "var(--rdy, #2d7dd2)" },
  { id: "workbench", icon: "\u2699", label: "Workbench" },
] as const;

export function HybridHeader({ activeTab, topSurface, bottomSurface }: { activeTab: string; topSurface: string; bottomSurface: string }) {
  const topLabel = SURFACES.find(s => s.id === topSurface)?.label ?? topSurface;
  const bottomLabel = SURFACES.find(s => s.id === bottomSurface)?.label ?? bottomSurface;
  const nav = useWorkspaceNav();

  const handleTabClick = (tabId: string) => {
    if (tabId === "workspace") nav.closeHub();
    if (tabId === "hub" && nav.hubTab) nav.openHub(nav.hubTab);
  };

  // Dynamic tab label for hub
  const getTabLabel = (t: typeof HEADER_TABS[number]) => {
    if (t.id === "hub" && nav.hubTab) return `Hub: ${nav.hubTab.clientName}`;
    return t.label;
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerRow1}>
        {HEADER_TABS.map(t => (
          <div key={t.id}
            className={`${styles.headerTab} ${(t.id === "workspace" && nav.activeView === "workspace") || (t.id === "hub" && nav.activeView === "hub") ? styles.headerTabOn : ""}`}
            onClick={() => handleTabClick(t.id)}
          >
            <span className={styles.headerTabIcon}>{t.icon}</span>
            <span>{getTabLabel(t)}</span>
            {"dot" in t && nav.hubTab && t.id === "hub" && <span className={styles.headerTabDot} style={{ background: t.dot }} />}
          </div>
        ))}
        <div className={styles.headerNew}>+</div>
      </div>
      <div className={styles.headerRow2}>
        <span className={styles.promptMark}>{"\u25c6"}</span>
        <span className={styles.promptUser}>alex</span>
        <span className={styles.promptSep}>{"\u203a"}</span>
        <span className={styles.promptPath}>workspace</span>
        <span className={styles.promptSep}>{"\u203a"}</span>
        <span className={styles.promptBranch}><span>{"\u2387"}</span> {topLabel.toLowerCase()} + {bottomLabel.toLowerCase()}</span>
        <div className={styles.promptInput}>
          <span>Search or command...</span>
          <span className={styles.promptCursor} />
        </div>
        <div className={styles.headerChips}>
          <span className={`${styles.headerChip} ${styles.headerChipOk}`}>{"\u25cf"} synced</span>
          <span className={`${styles.headerChip} ${styles.headerChipWarn}`}>1 overdue</span>
        </div>
      </div>
    </div>
  );
}

/* ── Layout Presets ── */
interface LayoutPreset {
  id: string;
  label: string;
  top: SurfaceId;
  bottom: SurfaceId;
  ratio: number;
  key: string;
}

const PRESETS: LayoutPreset[] = [
  { id: "daily", label: "Daily", top: "money", bottom: "work", ratio: 50, key: "1" },
  { id: "finance", label: "Finance", top: "money", bottom: "pipeline", ratio: 55, key: "2" },
  { id: "hustle", label: "Hustle", top: "work", bottom: "time", ratio: 60, key: "3" },
  { id: "signals", label: "Signals", top: "signals", bottom: "clients", ratio: 50, key: "4" },
  { id: "focus", label: "Focus", top: "work", bottom: "work", ratio: 100, key: "5" },
];

/* ── Split Panes Shell ── */

interface PaneState {
  id: string;
  surface: SurfaceId;
}

interface StackRow {
  left: PaneState;
  right: PaneState | null;
}

interface PaneLayout {
  fLeft: PaneState | null;
  fRight: PaneState | null;
  stack: StackRow[];
}

let _paneId = 0;
const nextPaneId = () => `pane-${++_paneId}`;

function countPanes(layout: PaneLayout): number {
  let n = 0;
  if (layout.fLeft) n++;
  if (layout.fRight) n++;
  for (const row of layout.stack) { n++; if (row.right) n++; }
  return n;
}

function allPanes(layout: PaneLayout): PaneState[] {
  const out: PaneState[] = [];
  if (layout.fLeft) out.push(layout.fLeft);
  for (const row of layout.stack) { out.push(row.left); if (row.right) out.push(row.right); }
  if (layout.fRight) out.push(layout.fRight);
  return out;
}

export default function SplitPanes() {
  const [layout, setLayout] = useState<PaneLayout>({
    fLeft: null,
    fRight: null,
    stack: [
      { left: { id: nextPaneId(), surface: "money" }, right: null },
      { left: { id: nextPaneId(), surface: "work" }, right: null },
    ],
  });
  const [activeId, setActiveId] = useState<string>(layout.stack[0].left.id);
  const [zoomedId, setZoomedId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string>("daily");
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const MAX_PANES = 4;
  const total = countPanes(layout);
  const canSplitMore = total < MAX_PANES;
  const hasFLeft = layout.fLeft !== null;
  const hasFRight = layout.fRight !== null;

  const changeSurface = (id: string, surface: SurfaceId) => {
    setLayout(prev => ({
      ...prev,
      fLeft: prev.fLeft?.id === id ? { ...prev.fLeft, surface } : prev.fLeft,
      fRight: prev.fRight?.id === id ? { ...prev.fRight, surface } : prev.fRight,
      stack: prev.stack.map(row => ({
        left: row.left.id === id ? { ...row.left, surface } : row.left,
        right: row.right?.id === id ? { ...row.right, surface } : row.right,
      })),
    }));
  };

  const splitPane = (targetId: string, dir: "above" | "below" | "left" | "right" | "f-left" | "f-right") => {
    if (!canSplitMore) return;
    const newPane: PaneState = { id: nextPaneId(), surface: "signals" };

    setLayout(prev => {
      const next = { ...prev, stack: prev.stack.map(r => ({ ...r })) };

      if (dir === "f-left") {
        if (next.fLeft) return prev;
        next.fLeft = newPane;
        return next;
      }
      if (dir === "f-right") {
        if (next.fRight) return prev;
        next.fRight = newPane;
        return next;
      }

      // Find which row contains the target
      const rowIdx = next.stack.findIndex(r => r.left.id === targetId || r.right?.id === targetId);
      if (rowIdx === -1) return prev;

      if (dir === "above") {
        next.stack.splice(rowIdx, 0, { left: newPane, right: null });
        return next;
      }
      if (dir === "below") {
        next.stack.splice(rowIdx + 1, 0, { left: newPane, right: null });
        return next;
      }
      if (dir === "left") {
        const row = next.stack[rowIdx];
        if (row.right) return prev; // already split
        next.stack[rowIdx] = { left: newPane, right: row.left };
        return next;
      }
      if (dir === "right") {
        const row = next.stack[rowIdx];
        if (row.right) return prev;
        next.stack[rowIdx] = { left: row.left, right: newPane };
        return next;
      }
      return prev;
    });
    setActiveId(newPane.id);
    setZoomedId(null);
    setActivePreset("");
  };

  const closePane = (id: string) => {
    if (total <= 1) return;
    setLayout(prev => {
      const next = { ...prev, stack: prev.stack.map(r => ({ ...r })) };

      if (next.fLeft?.id === id) { next.fLeft = null; return next; }
      if (next.fRight?.id === id) { next.fRight = null; return next; }

      for (let i = 0; i < next.stack.length; i++) {
        const row = next.stack[i];
        if (row.left.id === id) {
          if (row.right) {
            // Left closed, right becomes the row
            next.stack[i] = { left: row.right, right: null };
          } else {
            // Only pane in row, remove the row
            next.stack.splice(i, 1);
          }
          return next;
        }
        if (row.right?.id === id) {
          next.stack[i] = { left: row.left, right: null };
          return next;
        }
      }
      return prev;
    });
    if (activeId === id) {
      const all = allPanes(layout).filter(p => p.id !== id);
      setActiveId(all[0]?.id ?? "");
    }
    if (zoomedId === id) setZoomedId(null);
    setActivePreset("");
  };

  const applyPreset = (preset: LayoutPreset) => {
    const p1 = nextPaneId();
    const p2 = nextPaneId();
    if (preset.ratio === 100) {
      setLayout({ fLeft: null, fRight: null, stack: [{ left: { id: p1, surface: preset.top }, right: null }] });
    } else {
      setLayout({
        fLeft: null, fRight: null,
        stack: [
          { left: { id: p1, surface: preset.top }, right: null },
          { left: { id: p2, surface: preset.bottom }, right: null },
        ],
      });
    }
    setActiveId(p1);
    setZoomedId(null);
    setActivePreset(preset.id);
  };

  const topSurface = layout.stack[0]?.left.surface ?? "money";
  const bottomSurface = layout.stack[1]?.left.surface ?? topSurface;

  const renderPane = (p: PaneState, rowHasRight: boolean) => {
    const isZoomed = zoomedId === p.id;
    const isHidden = zoomedId !== null && zoomedId !== p.id;
    // Can split left/right only if this row doesn't already have two panes
    const canRowSplitHere = !rowHasRight;
    return (
      <div key={p.id} className={styles.paneSlot} style={{
        flex: isZoomed ? "1" : isHidden ? "0 0 0px" : "1 1 0px",
        opacity: isHidden ? 0 : 1,
      }}>
        <Pane
          surface={p.surface}
          onSurfaceChange={(s) => changeSurface(p.id, s)}
          focused={activeId === p.id}
          onFocus={() => setActiveId(p.id)}
          zoomed={isZoomed}
          onZoom={() => setZoomedId(isZoomed ? null : p.id)}
          onSplit={(dir) => splitPane(p.id, dir)}
          onClose={() => closePane(p.id)}
          canClose={total > 1}
          canSplit={canSplitMore}
          canFSplit={canSplitMore && !hasFLeft && !hasFRight}
          canRowSplit={canSplitMore && canRowSplitHere}
        />
      </div>
    );
  };

  return (
    <div
      className={styles.panes}
      ref={containerRef}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
    >
      {(() => {
        // When zoomed, find where the zoomed pane lives and render only that
        if (zoomedId) {
          // Check F-columns
          if (layout.fLeft?.id === zoomedId) {
            return <div className={styles.panesOuter}><div className={styles.panesInner}>{renderPane(layout.fLeft, false)}</div></div>;
          }
          if (layout.fRight?.id === zoomedId) {
            return <div className={styles.panesOuter}><div className={styles.panesInner}>{renderPane(layout.fRight, false)}</div></div>;
          }
          // Check stack
          for (const row of layout.stack) {
            if (row.left.id === zoomedId) {
              return <div className={styles.panesOuter}><div className={styles.panesInner}><div className={styles.paneSlot} style={{ flex: "1 1 0px" }}>{renderPane(row.left, false)}</div></div></div>;
            }
            if (row.right?.id === zoomedId) {
              return <div className={styles.panesOuter}><div className={styles.panesInner}><div className={styles.paneSlot} style={{ flex: "1 1 0px" }}>{renderPane(row.right, false)}</div></div></div>;
            }
          }
        }

        // Normal (non-zoomed) rendering
        return (
          <div className={styles.panesOuter}>
            {/* F-Left column */}
            {layout.fLeft && (
              <div className={styles.fColumn}>
                {renderPane(layout.fLeft, false)}
              </div>
            )}

            {/* Center stack */}
            <div className={styles.panesInner}>
              {layout.stack.map((row, i) => (
                <div key={row.left.id} className={styles.paneSlot} style={{ flex: "1 1 0px" }}>
                  {i > 0 && (
                    <div className={`${styles.splitHandle} ${dragging ? styles.splitHandleDragging : ""}`}>
                      <div className={styles.splitHandleLine} />
                    </div>
                  )}
                  {row.right ? (
                    <div className={styles.rowPair}>
                      {renderPane(row.left, true)}
                      <div className={styles.vSplitHandle} />
                      {renderPane(row.right, true)}
                    </div>
                  ) : (
                    renderPane(row.left, false)
                  )}
                </div>
              ))}
            </div>

            {/* F-Right column */}
            {layout.fRight && (
              <div className={styles.fColumn}>
                {renderPane(layout.fRight, false)}
              </div>
            )}
          </div>
        );
      })()}

      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span className={styles.statusDot} />
          <span className={styles.statusActive}>Connected</span>
          <span className={styles.statusSep}>{"\u00b7"}</span>
          {PRESETS.map(p => (
            <span
              key={p.id}
              className={`${styles.presetPill} ${activePreset === p.id ? styles.presetPillOn : ""}`}
              onClick={() => applyPreset(p)}
            >
              {p.label}
              <span className={styles.presetKey}>{p.key}</span>
            </span>
          ))}
        </div>
        <div className={styles.statusRight}>
          <span style={{ color: "rgba(239,83,80,.6)" }}>1 overdue</span>
          <span>4 clients</span>
          <span>7 tasks</span>
        </div>
      </div>
    </div>
  );
}
