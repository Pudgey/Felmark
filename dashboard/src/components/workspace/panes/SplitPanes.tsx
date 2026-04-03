"use client";

import { useState, useRef } from "react";
import styles from "./SplitPanes.module.css";

/* ── Surface definitions ── */
const SURFACES = [
  { id: "money", label: "Money", icon: "$" },
  { id: "work", label: "Work", icon: "\u25c6" },
  { id: "signals", label: "Signals", icon: "\u25ce" },
  { id: "pipeline", label: "Pipeline", icon: "\u2192" },
  { id: "clients", label: "Clients", icon: "\u25c7" },
  { id: "time", label: "Time", icon: "\u25b6" },
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
                  <div className={styles.expKv}><span className={styles.expL}>Priority</span><span className={styles.expV} style={{ textTransform: "capitalize", color: t.pri === "urgent" ? "var(--ov)" : t.pri === "high" ? "var(--wtc, #c07a1e)" : undefined }}>{t.pri}</span></div>
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
          <div className={styles.dots}>{[0, 1, 2, 3].map(n => <div key={n} className={`${styles.dot} ${n < d.dots ? styles.dotOn : ""}`} style={n < d.dots ? { background: d.stage === "paid" ? "var(--pos)" : d.stage === "invoice" ? "var(--rdy, #2d7dd2)" : d.stage === "contract" ? "var(--wtc, #c07a1e)" : "var(--ink-400)" } : undefined} />)}</div>
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

/* ── Single Pane ── */
function Pane({ surface, onSurfaceChange }: { surface: SurfaceId; onSurfaceChange: (id: SurfaceId) => void }) {
  const [dropOpen, setDropOpen] = useState(false);
  const Content = PANE_MAP[surface];
  const surf = SURFACES.find(s => s.id === surface)!;

  return (
    <div className={styles.pane}>
      <div className={styles.paneHd}>
        <div className={styles.paneHdLeft} onClick={() => setDropOpen(!dropOpen)}>
          <span className={styles.paneIcon}>{surf.icon}</span>
          <span className={styles.paneLabel}>{surf.label}</span>
          <span className={styles.paneChevron}>&blacktriangledown;</span>
        </div>
        {dropOpen && (
          <div className={styles.paneDrop}>
            {SURFACES.map(s => (
              <div key={s.id} className={`${styles.paneDropOpt} ${s.id === surface ? styles.paneDropOn : ""}`}
                onClick={() => { onSurfaceChange(s.id); setDropOpen(false); }}>
                <span className={styles.paneDropIcon}>{s.icon}</span>
                <span>{s.label}</span>
                {s.id === surface && <span className={styles.paneDropCheck}>&check;</span>}
              </div>
            ))}
          </div>
        )}
        <div className={styles.paneHdRight}>
          <span className={styles.paneHdAction}>&nesear;</span>
          <span className={styles.paneHdAction}>&times;</span>
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

/* ── Split Panes Shell ── */
export default function SplitPanes() {
  const [topSurface, setTopSurface] = useState<SurfaceId>("money");
  const [bottomSurface, setBottomSurface] = useState<SurfaceId>("work");
  const [splitRatio, setSplitRatio] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
        <div style={{ flex: `0 0 ${splitRatio}%`, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <Pane surface={topSurface} onSurfaceChange={setTopSurface} />
        </div>

        <div className={styles.splitHandle} onMouseDown={() => setDragging(true)}>
          <div className={styles.splitHandleBar} />
        </div>

        <div style={{ flex: `0 0 ${100 - splitRatio}%`, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <Pane surface={bottomSurface} onSurfaceChange={setBottomSurface} />
        </div>
      </div>

      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span className={styles.statusDot} />
          <span className={styles.statusActive}>Connected</span>
          <span>4 clients</span>
          <span>7 tasks</span>
          <span style={{ color: "rgba(217,69,58,.6)" }}>1 overdue</span>
        </div>
        <div className={styles.statusRight}>
          <span>Workspace v3</span>
          <span>@felmark/forge</span>
        </div>
      </div>
    </div>
  );
}
