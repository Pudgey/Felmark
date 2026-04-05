"use client";

import { useState, useEffect, useRef } from "react";
import type { Workstation, Project } from "@/lib/types";
import { getDaysLeft as daysLeft, getDueLabel as getDueLabelFromDate, getDueColor as getDueColorFromDate } from "@/lib/due-dates";
import styles from "./DashboardHome.module.css";

// ── Seed data (activity, pipeline, earnings — not yet connected to real data) ──

const ACTIVITY = [
  { id: 1, icon: "$", color: "#5a9a3c", text: "Payment received — $1,800 from Nora Kim", detail: "Invoice #046 · Retainer (March)", time: "32m ago" },
  { id: 2, icon: "◎", color: "#5b7fa4", text: "Sarah viewed Invoice #047", detail: "Meridian Studio · 2nd view", time: "1h ago" },
  { id: 3, icon: "→", color: "#8a7e63", text: "Sarah: \"Can we make the logo section more specific?\"", detail: "Brand Guidelines v2 · Comment", time: "2h ago" },
  { id: 4, icon: "✓", color: "#5a9a3c", text: "Nora signed the Course Landing Page proposal", detail: "Proposal accepted · $3,200", time: "3h ago" },
  { id: 5, icon: "↗", color: "#b07d4f", text: "Proposal sent to Luna Boutique", detail: "E-commerce Rebrand · $6,500", time: "5h ago" },
  { id: 6, icon: "✎", color: "#7c8594", text: "Jamie edited Typography section", detail: "Brand Guidelines v2 · 8 changes", time: "6h ago" },
  { id: 7, icon: "!", color: "#c24b38", text: "Bolt Fitness invoice is 4 days overdue", detail: "Invoice #044 · $4,000", time: "Yesterday" },
];

const PIPELINE_STAGES = [
  { label: "Lead", count: 3, value: 10900, color: "#5b7fa4" },
  { label: "Proposed", count: 2, value: 11200, color: "#b07d4f" },
  { label: "Active", count: 3, value: 8200, color: "#5a9a3c" },
  { label: "Awaiting", count: 2, value: 6400, color: "#8a7e63" },
];

const REVENUE_MONTHS = [
  { month: "Oct", value: 8200 }, { month: "Nov", value: 11400 }, { month: "Dec", value: 9800 },
  { month: "Jan", value: 13200 }, { month: "Feb", value: 10600 }, { month: "Mar", value: 14800 },
];

const QUICK_ACTIONS = [
  { id: "proposal", label: "New proposal", icon: "◆", shortcut: "⌘⇧P" },
  { id: "invoice", label: "New invoice", icon: "$", shortcut: "⌘⇧I" },
  { id: "workspace", label: "New workstation", icon: "→", shortcut: "⌘⇧W" },
  { id: "note", label: "Quick note", icon: "✎", shortcut: "⌘N" },
];

// ── Animated number (only animates on value change, not parent re-render) ──

function AnimNum({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevValue.current === value) return;
    const from = prevValue.current;
    prevValue.current = value;
    const start = Date.now();
    const animate = () => {
      const p = Math.min((Date.now() - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (p < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [value]);

  return <>{prefix}{display.toLocaleString()}{suffix}</>;
}

// ── Status config (static, outside component) ──

const STATUS_CFG: Record<string, { color: string; label: string }> = {
  active: { color: "#5a9a3c", label: "Active" },
  review: { color: "#b07d4f", label: "Review" },
  overdue: { color: "#c24b38", label: "Overdue" },
  paused: { color: "#9b988f", label: "Paused" },
  completed: { color: "#7c8594", label: "Done" },
};

// ── Component ──

interface DashboardHomeProps {
  workstations: Workstation[];
  onSelectWorkstation: (wsId: string) => void;
  onSelectProject: (project: Project, client: string) => void;
  onNewTabInWorkstation: (wsId: string) => void;
}

export default function DashboardHome({ workstations, onSelectWorkstation, onSelectProject, onNewTabInWorkstation }: DashboardHomeProps) {
  const [now, setNow] = useState(() => new Date());
  const [showWsPicker, setShowWsPicker] = useState(false);
  const [wsSearch, setWsSearch] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(i);
  }, []);

  // ── Computed from real workspace data ──
  const allProjects = workstations.flatMap(ws => ws.projects);
  const activeProjects = allProjects.filter(p => p.status !== "completed");
  const overdueProjects = allProjects.filter(p => { const dl = daysLeft(p.due); return p.status === "overdue" || (dl != null && dl < 0); });

  const parseAmount = (amt: string) => { const m = amt.match(/[\d,]+/); return m ? parseInt(m[0].replace(",", "")) : 0; };
  const totalEarned = allProjects.reduce((s, p) => s + parseAmount(p.amount), 0);
  const totalActive = activeProjects.reduce((s, p) => s + parseAmount(p.amount), 0);
  const pipelineTotal = PIPELINE_STAGES.reduce((s, p) => s + p.value, 0);
  const maxMonth = Math.max(...REVENUE_MONTHS.map(m => m.value), 1);

  // Deadlines sorted by urgency
  const deadlines = activeProjects
    .filter(p => daysLeft(p.due) != null)
    .sort((a, b) => (daysLeft(a.due) ?? 999) - (daysLeft(b.due) ?? 999));

  const hour = now?.getHours() ?? 12;
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Workspace picker: Personal first, then alphabetical, filtered by search
  const sortedWorkspaces = [...workstations].sort((a, b) => {
    const aPers = a.client.toLowerCase() === "personal" ? 0 : 1;
    const bPers = b.client.toLowerCase() === "personal" ? 0 : 1;
    if (aPers !== bPers) return aPers - bPers;
    return a.client.localeCompare(b.client);
  });
  const filteredPicker = wsSearch
    ? sortedWorkspaces.filter(w => w.client.toLowerCase().includes(wsSearch.toLowerCase()))
    : sortedWorkspaces;

  // Close picker on outside click
  useEffect(() => {
    if (!showWsPicker) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowWsPicker(false);
        setWsSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showWsPicker]);

  // Focus search when picker opens
  useEffect(() => {
    if (showWsPicker) searchInputRef.current?.focus();
  }, [showWsPicker]);

  const handlePickWorkspace = (wsId: string) => {
    setShowWsPicker(false);
    setWsSearch("");
    onNewTabInWorkstation(wsId);
  };

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.greeting}>{greeting}. <span className={styles.greetingAccent}>Let&apos;s build.</span></div>
          <div className={styles.date}>{now ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "\u00A0"}</div>
        </div>
        <div className={styles.actions}>
          {QUICK_ACTIONS.map((a, i) => (
            a.id === "note" ? (
              <div key={a.id} style={{ position: "relative" }} ref={pickerRef}>
                <button className={styles.qa} onClick={() => setShowWsPicker(p => !p)}>
                  <span className={styles.qaIcon}>{a.icon}</span>
                  {a.label}
                  <span className={styles.qaKey}>{a.shortcut}</span>
                </button>
                {showWsPicker && (
                  <div className={styles.wsPicker}>
                    <div className={styles.wsPickerSearch}>
                      <svg className={styles.wsPickerSearchIcon} width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" /><path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                      <input
                        ref={searchInputRef}
                        className={styles.wsPickerInput}
                        placeholder="Search workstations..."
                        value={wsSearch}
                        onChange={e => setWsSearch(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Escape") { setShowWsPicker(false); setWsSearch(""); }
                          if (e.key === "Enter" && filteredPicker.length > 0) handlePickWorkspace(filteredPicker[0].id);
                        }}
                      />
                    </div>
                    <div className={styles.wsPickerList}>
                      {filteredPicker.map(ws => (
                        <div key={ws.id} className={styles.wsPickerItem} onClick={() => handlePickWorkspace(ws.id)}>
                          <div className={styles.wsPickerAvatar} style={{ background: ws.avatarBg }}>{ws.avatar}</div>
                          <span className={styles.wsPickerName}>{ws.client}</span>
                          <span className={styles.wsPickerCount}>{ws.projects.length}</span>
                        </div>
                      ))}
                      {filteredPicker.length === 0 && (
                        <div className={styles.wsPickerEmpty}>No workstations match &ldquo;{wsSearch}&rdquo;</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button key={a.id} className={`${styles.qa} ${i === 0 ? styles.qaPrimary : ""}`}>
                <span className={styles.qaIcon}>{a.icon}</span>
                {a.label}
                <span className={styles.qaKey}>{a.shortcut}</span>
              </button>
            )
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={`${styles.statVal} ${styles.statValGreen}`}><AnimNum value={REVENUE_MONTHS[REVENUE_MONTHS.length - 1].value} prefix="$" /></div>
          <div className={styles.statLabel}>earned this month</div>
          <div className={styles.statSub}>+40% vs February</div>
          <div className={styles.statChart}>
            {REVENUE_MONTHS.map((m, i) => (
              <div key={i} className={styles.statBar} style={{ height: `${(m.value / maxMonth) * 100}%`, background: i === REVENUE_MONTHS.length - 1 ? "#5a9a3c" : "var(--warm-200)" }} />
            ))}
          </div>
        </div>
        <div className={styles.stat}>
          <div className={`${styles.statVal} ${styles.statValEmber}`}><AnimNum value={totalActive} prefix="$" /></div>
          <div className={styles.statLabel}>in progress</div>
          <div className={styles.statSub}>{activeProjects.length} active projects</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal}><AnimNum value={pipelineTotal} prefix="$" /></div>
          <div className={styles.statLabel}>total pipeline</div>
          <div className={styles.statSub}>{PIPELINE_STAGES.reduce((s, p) => s + p.count, 0)} open deals</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal}>{deadlines.filter(d => (daysLeft(d.due) ?? 0) >= 0).length}</div>
          <div className={styles.statLabel}>upcoming deadlines</div>
          {overdueProjects.length > 0 && <div className={styles.statSub} style={{ color: "#c24b38" }}>{overdueProjects.length} overdue</div>}
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal}><AnimNum value={totalEarned} prefix="$" /></div>
          <div className={styles.statLabel}>total value</div>
          <div className={styles.statSub}>{workstations.length} clients</div>
        </div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        <div className={styles.left}>
          {/* Workspaces */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionTitle}>Workstations</span>
              <button className={styles.sectionAction}>View all</button>
            </div>
            <div className={styles.wsList}>
              {workstations.length === 0 && (
                <div style={{ padding: "24px 14px", textAlign: "center", color: "var(--ink-300)", fontSize: 13 }}>No workstations yet. Create one to get started.</div>
              )}
              {workstations.map(ws => {
                const wsActive = ws.projects.filter(p => p.status !== "completed");
                const wsValue = wsActive.reduce((s, p) => s + parseAmount(p.amount), 0);
                const wsTotal = ws.projects.reduce((s, p) => s + parseAmount(p.amount), 0);
                const wsOverdue = ws.projects.some(p => { const dl = daysLeft(p.due); return p.status === "overdue" || (dl != null && dl < 0); });
                const nextDl = wsActive.filter(p => daysLeft(p.due) != null).sort((a, b) => (daysLeft(a.due) ?? 999) - (daysLeft(b.due) ?? 999))[0];
                const st = wsOverdue ? STATUS_CFG.overdue : STATUS_CFG.active;
                const dlColor = !nextDl ? "var(--ink-300)" : getDueColorFromDate(nextDl.due);
                const dlText = !nextDl ? "No deadline" : getDueLabelFromDate(nextDl.due);

                return (
                  <div key={ws.id} className={styles.ws} role="button" tabIndex={0} aria-label={`${ws.client} workstation`} onClick={() => onSelectWorkstation(ws.id)} onKeyDown={e => { if (e.key === "Enter") onSelectWorkstation(ws.id); }}>
                    <div className={styles.wsAvatar} style={{ background: ws.avatarBg }}>{ws.avatar}</div>
                    <div className={styles.wsInfo}>
                      <div className={styles.wsName}>{ws.client}</div>
                      <div className={styles.wsMeta}>
                        <span className={styles.wsStatus} style={{ color: st.color, background: st.color + "12", border: `1px solid ${st.color}20` }}>{st.label}</span>
                        <span>{ws.projects.length} project{ws.projects.length !== 1 ? "s" : ""}</span>
                        <span>·</span>
                        <span>${(wsTotal / 1000).toFixed(1)}k value</span>
                      </div>
                    </div>
                    <div className={styles.wsRight}>
                      {wsValue > 0 && <span className={styles.wsValue}>${wsValue.toLocaleString()}</span>}
                      <span className={styles.wsDeadline} style={{ color: dlColor }}>{dlText}</span>
                      <span className={styles.wsActivity}>{ws.lastActive}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deadlines */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionTitle}>Deadlines</span>
              <button className={styles.sectionAction}>Calendar</button>
            </div>
            <div className={styles.dlList}>
              {deadlines.length === 0 && (
                <div style={{ padding: "20px 14px", textAlign: "center", color: "var(--ink-300)", fontSize: 13 }}>No upcoming deadlines</div>
              )}
              {deadlines.slice(0, 6).map(p => {
                const ws = workstations.find(w => w.projects.some(pr => pr.id === p.id));
                const dl = daysLeft(p.due);
                const isOverdue = (dl ?? 0) < 0;
                const dlColor = getDueColorFromDate(p.due);
                const dlText = getDueLabelFromDate(p.due);
                const progressColor = isOverdue ? "#c24b38" : (p.progress ?? 0) >= 60 ? "#5a9a3c" : "#b07d4f";

                return (
                  <div key={p.id} className={`${styles.dl} ${isOverdue ? styles.dlOverdue : ""}`} role="button" tabIndex={0} aria-label={`${p.name}, ${dlText}`} onClick={() => ws && onSelectProject(p, ws.client)} onKeyDown={e => { if (e.key === "Enter" && ws) onSelectProject(p, ws.client); }}>
                    <div className={styles.dlAvatar} style={{ background: ws?.avatarBg || "#999" }}>{ws?.avatar || "?"}</div>
                    <div className={styles.dlInfo}>
                      <div className={styles.dlTitle}>{p.name}</div>
                      <div className={styles.dlClient}>{ws?.client} · {p.amount}</div>
                    </div>
                    <div className={styles.dlRight}>
                      <span className={styles.dlDate} style={{ color: dlColor }}>{dlText}</span>
                      <div className={styles.dlProgressWrap}>
                        <div className={styles.dlProgress}>
                          <div className={styles.dlProgressFill} style={{ width: `${p.progress ?? 0}%`, background: progressColor }} />
                        </div>
                        <span className={styles.dlPct}>{p.progress ?? 0}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.right}>
          {/* Activity */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionTitle}>Activity</span>
              <button className={styles.sectionAction}>The Wire</button>
            </div>
            <div className={styles.actList}>
              {ACTIVITY.map(a => (
                <div key={a.id} className={styles.act}>
                  <div className={styles.actIcon} style={{ background: a.color + "12", color: a.color, border: `1px solid ${a.color}20` }}>{a.icon}</div>
                  <div className={styles.actBody}>
                    <div className={styles.actText}>{a.text}</div>
                    <div className={styles.actDetail}>{a.detail}</div>
                  </div>
                  <span className={styles.actTime}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionTitle}>Pipeline</span>
              <button className={styles.sectionAction}>Open</button>
            </div>
            <div className={styles.pipe}>
              <div className={styles.pipeBar}>
                {PIPELINE_STAGES.map((s, i) => (
                  <div key={i} className={styles.pipeSeg} style={{ width: `${Math.max((s.value / pipelineTotal) * 100, 2)}%`, background: s.color, opacity: 0.6 }} />
                ))}
              </div>
              <div className={styles.pipeStages}>
                {PIPELINE_STAGES.map((s, i) => (
                  <div key={i} className={styles.pipeStage}>
                    <span className={styles.pipeStageCount}>{s.count}</span>
                    <span className={styles.pipeStageVal}>${(s.value / 1000).toFixed(1)}k</span>
                    <span className={styles.pipeStageLabel}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionTitle}>Earnings</span>
              <button className={styles.sectionAction}>6 months</button>
            </div>
            <div className={styles.earn}>
              <div className={styles.earnTotal}>
                <span className={styles.earnVal}><AnimNum value={totalEarned} prefix="$" /></span>
                <span className={styles.earnChange}>↑ 18% vs last quarter</span>
              </div>
              <div className={styles.earnChart}>
                {REVENUE_MONTHS.map((m, i) => {
                  const isCurrent = i === REVENUE_MONTHS.length - 1;
                  return (
                    <div key={i} className={styles.earnCol}>
                      <span className={styles.earnBarVal}>${(m.value / 1000).toFixed(1)}k</span>
                      <div className={styles.earnBar} style={{ height: `${(m.value / maxMonth) * 100}%`, background: isCurrent ? "var(--ember)" : "var(--warm-200)" }} />
                      <span className={styles.earnBarLabel} style={isCurrent ? { color: "var(--ember)", fontWeight: 500 } : undefined}>{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span>Felmark · {workstations.length} workstations · {allProjects.length} projects</span>
        <span>{now ? now.toLocaleTimeString() : "\u00A0"}</span>
      </div>
    </div>
  );
}
