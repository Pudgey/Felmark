"use client";

import { useState, useRef } from "react";
import styles from "./SplitPanes.module.css";

/* ── Surface definitions ── */
const SURFACES = [
  { id: "money", label: "Money", icon: "$", desc: "Invoices, revenue, payments", action: "+ New Invoice", shortcut: "N", stateVal: "$14.8k", stateLb: "earned", color: "#26a69a" },
  { id: "work", label: "Work", icon: "\u25c6", desc: "Tasks, timers, subtasks", action: "+ New Task", shortcut: "\u21e7N", stateVal: "5", stateLb: "active", color: "#2962ff" },
  { id: "signals", label: "Signals", icon: "\u25ce", desc: "Client activity feed", action: "View Signals", shortcut: "S", stateVal: "3", stateLb: "new", color: "#ff9800" },
  { id: "pipeline", label: "Pipeline", icon: "\u2192", desc: "Deals, proposals, contracts", action: "+ New Deal", shortcut: "P", stateVal: "4", stateLb: "deals", color: "#26a69a" },
  { id: "clients", label: "Clients", icon: "\u25c7", desc: "Client records & contacts", action: "+ Add Client", shortcut: "C", stateVal: "4", stateLb: "total", color: "#2962ff" },
  { id: "time", label: "Time", icon: "\u25b6", desc: "Time entries & tracking", action: "\u25b6 Start Timer", shortcut: "T", stateVal: "7.2h", stateLb: "today", color: "#ff9800" },
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
                  <button className={styles.btn}>Editor</button>
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

const PANE_MAP: Record<SurfaceId, () => React.ReactNode> = {
  money: MoneyPane,
  work: WorkPane,
  signals: SignalsPane,
  pipeline: PipelinePane,
  clients: ClientsPane,
  time: TimePane,
};

/* ── Context hints per surface ── */
const SURFACE_CONTEXT: Record<SurfaceId, string> = {
  money: "4 invoices \u00b7 $14,800 earned",
  work: "5 tasks \u00b7 2 active",
  signals: "5 signals \u00b7 2 urgent",
  pipeline: "4 deals \u00b7 $18,500 pipeline",
  clients: "4 clients \u00b7 1 overdue",
  time: "7.1h today \u00b7 $833 value",
};

/* ── Single Pane ── */
function Pane({ surface, onSurfaceChange, focused, onFocus, zoomed, onZoom }: { surface: SurfaceId; onSurfaceChange: (id: SurfaceId) => void; focused?: boolean; onFocus?: () => void; zoomed?: boolean; onZoom?: () => void }) {
  const [dropOpen, setDropOpen] = useState(false);
  const Content = PANE_MAP[surface] ?? (() => <EmptyPane surfaceId={surface} />);
  const surf = SURFACES.find(s => s.id === surface)!;

  return (
    <div className={`${styles.pane} ${focused ? styles.paneFocused : styles.paneInactive}`} onClick={onFocus}>
      <div className={styles.paneHd}>
        <div className={styles.paneHdLeft} onClick={() => setDropOpen(!dropOpen)}>
          <span className={styles.paneIcon}>{surf.icon}</span>
          <span className={styles.paneLabel}>{surf.label}</span>
          <span className={styles.paneChevron}>{"\u25be"}</span>
        </div>
        <div className={styles.paneHdSep} />
        <span className={styles.paneHdContext}>{SURFACE_CONTEXT[surface]}</span>
        {dropOpen && (
          <div className={styles.paneDrop}>
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
        <div className={styles.paneHdRight}>
          <div className={styles.paneBeacon}>
            <span className={`${styles.paneBeaconLabel} ${focused ? styles.paneBeaconLabelOn : styles.paneBeaconLabelOff}`}>
              {focused ? "active" : "idle"}
            </span>
            <div className={`${styles.paneBeaconDot} ${focused ? styles.paneBeaconDotOn : styles.paneBeaconDotOff}`} />
          </div>
          <span className={`${styles.paneHdAction} ${zoomed ? styles.paneHdActionActive : ""}`} onClick={e => { e.stopPropagation(); onZoom?.(); }} title={zoomed ? "Restore" : "Maximize"}>{zoomed ? "\u2923" : "\u2922"}</span>
          <span className={styles.paneHdAction}>{"\u2295"}</span>
          <span className={styles.paneHdAction}>{"\u00d7"}</span>
        </div>
      </div>
      <div className={styles.paneBody}><Content /></div>
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

function HybridHeader({ activeTab, topSurface, bottomSurface }: { activeTab: string; topSurface: string; bottomSurface: string }) {
  const topLabel = SURFACES.find(s => s.id === topSurface)?.label ?? topSurface;
  const bottomLabel = SURFACES.find(s => s.id === bottomSurface)?.label ?? bottomSurface;

  return (
    <div className={styles.header}>
      <div className={styles.headerRow1}>
        {HEADER_TABS.map(t => (
          <div key={t.id} className={`${styles.headerTab} ${activeTab === t.id ? styles.headerTabOn : ""}`}>
            <span className={styles.headerTabIcon}>{t.icon}</span>
            <span>{t.label}</span>
            {"dot" in t && <span className={styles.headerTabDot} style={{ background: t.dot }} />}
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
export default function SplitPanes() {
  const [topSurface, setTopSurface] = useState<SurfaceId>("money");
  const [bottomSurface, setBottomSurface] = useState<SurfaceId>("work");
  const [splitRatio, setSplitRatio] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [activePane, setActivePane] = useState<"top" | "bottom">("top");
  const [zoomedPane, setZoomedPane] = useState<"top" | "bottom" | null>(null);
  const [activePreset, setActivePreset] = useState<string>("daily");
  const containerRef = useRef<HTMLDivElement>(null);

  const applyPreset = (preset: LayoutPreset) => {
    setTopSurface(preset.top);
    setBottomSurface(preset.bottom);
    setSplitRatio(preset.ratio);
    setZoomedPane(preset.ratio === 100 ? "top" : null);
    setActivePreset(preset.id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientY - rect.top) / rect.height) * 100;
    setSplitRatio(Math.min(80, Math.max(20, pct)));
  };

  return (
    <div
      className={styles.panes}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
    >
      <HybridHeader activeTab="workspace" topSurface={topSurface} bottomSurface={bottomSurface} />
      <div className={styles.panesInner}>
        <div className={styles.paneSlot} style={{
          flex: zoomedPane === "top" ? "1" : zoomedPane === "bottom" ? "0" : `0 0 ${splitRatio}%`,
          opacity: zoomedPane === "bottom" ? 0 : 1,
          overflow: zoomedPane === "bottom" ? "hidden" : undefined,
          minHeight: zoomedPane === "bottom" ? 0 : undefined,
        }}>
          <Pane
            surface={topSurface}
            onSurfaceChange={setTopSurface}
            focused={activePane === "top"}
            onFocus={() => setActivePane("top")}
            zoomed={zoomedPane === "top"}
            onZoom={() => setZoomedPane(zoomedPane === "top" ? null : "top")}
          />
        </div>

        {!zoomedPane && (
          <div className={`${styles.splitHandle} ${dragging ? styles.splitHandleDragging : ""}`} onMouseDown={() => setDragging(true)}>
            <div className={styles.splitHandleLine} />
          </div>
        )}

        <div className={styles.paneSlot} style={{
          flex: zoomedPane === "bottom" ? "1" : zoomedPane === "top" ? "0" : `0 0 ${100 - splitRatio}%`,
          opacity: zoomedPane === "top" ? 0 : 1,
          overflow: zoomedPane === "top" ? "hidden" : undefined,
          minHeight: zoomedPane === "top" ? 0 : undefined,
        }}>
          <Pane
            surface={bottomSurface}
            onSurfaceChange={setBottomSurface}
            focused={activePane === "bottom"}
            onFocus={() => setActivePane("bottom")}
            zoomed={zoomedPane === "bottom"}
            onZoom={() => setZoomedPane(zoomedPane === "bottom" ? null : "bottom")}
          />
        </div>
      </div>

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
