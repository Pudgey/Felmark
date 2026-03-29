"use client";

import { useState, useRef, useEffect } from "react";
import { STATUS } from "@/lib/constants";
import type { Workspace, Project, ArchivedProject } from "@/lib/types";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  workspaces: Workspace[];
  archived: ArchivedProject[];
  activeProject: string;
  open: boolean;
  width: number;
  isResizing: boolean;
  wordCount: number;
  railActive: string;
  onClose: () => void;
  onToggleWorkspace: (id: string) => void;
  onSelectWorkspaceHome: (id: string) => void;
  onSelectProject: (project: Project, client: string) => void;
  onArchiveProject: (projectId: string) => void;
  onArchiveCompleted: (wsId: string) => void;
  onArchiveWorkspace: (wsId: string) => void;
  onRestoreProject: (archivedIdx: number) => void;
  onReorderWorkspaces: (fromIndex: number, toIndex: number) => void;
  onRenameWorkspace: (wsId: string, name: string) => void;
  onRenameProject: (projectId: string, name: string) => void;
  onAddWorkspace: (name: string) => void;
  onTogglePin: (projectId: string) => void;
  onCycleStatus: (projectId: string) => void;
  onScrollToCalendarEvent?: (projectId: string) => void;
}

const STATUSES = ["active", "review", "paused", "completed"] as const;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function CalendarView({ workspaces, onSelectProject, onScrollToEvent }: { workspaces: Workspace[]; onSelectProject: (project: Project, client: string) => void; onScrollToEvent?: (projectId: string) => void }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  // Build deadline map: day number → projects due that day
  const deadlineMap = new Map<number, { project: Project; client: string }[]>();
  workspaces.forEach(ws => {
    ws.projects.forEach(p => {
      if (!p.due || p.due === "—") return;
      // Parse "Apr 3", "Mar 20", etc.
      const match = p.due.match(/^([A-Za-z]+)\s+(\d+)$/);
      if (!match) return;
      const monthIdx = MONTH_NAMES.findIndex(m => m.startsWith(match[1]));
      const day = parseInt(match[2]);
      if (monthIdx === viewMonth) {
        const existing = deadlineMap.get(day) || [];
        existing.push({ project: p, client: ws.client });
        deadlineMap.set(day, existing);
      }
    });
  });

  // Calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d: number) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };

  const selectedDeadlines = selectedDay ? (deadlineMap.get(selectedDay) || []) : [];

  // All deadlines for this month, sorted by day
  const allDeadlines = Array.from(deadlineMap.entries())
    .sort(([a], [b]) => a - b)
    .flatMap(([day, items]) => items.map(item => ({ ...item, day })));

  return (
    <div className={styles.calendarView}>
      {/* Month nav */}
      <div className={styles.calNav}>
        <button className={styles.calNavBtn} onClick={prevMonth}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 3L4 6l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className={styles.calMonth}>{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button className={styles.calNavBtn} onClick={nextMonth}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      {/* Day headers */}
      <div className={styles.calGrid}>
        {DAYS.map(d => <div key={d} className={styles.calDayHeader}>{d}</div>)}

        {/* Day cells */}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} className={styles.calCell} />;
          const hasDeadline = deadlineMap.has(day);
          const deadlines = deadlineMap.get(day) || [];
          const isSelected = selectedDay === day;

          return (
            <div
              key={day}
              className={`${styles.calCell} ${styles.calCellDay} ${isToday(day) ? styles.calToday : ""} ${isSelected ? styles.calSelected : ""} ${hasDeadline ? styles.calHasDeadline : ""}`}
              onClick={() => setSelectedDay(isSelected ? null : day)}
            >
              <span className={styles.calDayNum}>{day}</span>
              {hasDeadline && (
                <div className={styles.calDots}>
                  {deadlines.slice(0, 3).map((d, j) => (
                    <span key={j} className={styles.calDot} style={{ background: STATUS[d.project.status]?.color || "var(--ember)" }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected day detail or full month list */}
      <div className={styles.calDeadlines}>
        {selectedDay && selectedDeadlines.length > 0 ? (
          <>
            <div className={styles.calDeadlineLabel}>
              {MONTH_NAMES[viewMonth].slice(0, 3)} {selectedDay}
              <span className={styles.calDeadlineCount}>{selectedDeadlines.length}</span>
            </div>
            {selectedDeadlines.map((d, i) => {
              const st = STATUS[d.project.status];
              return (
                <div key={i} className={styles.calDeadlineItem} onClick={() => onScrollToEvent ? onScrollToEvent(d.project.id) : onSelectProject(d.project, d.client)}>
                  <div className={styles.calDeadlineDot} style={{ background: st?.color || "var(--ember)" }} />
                  <div className={styles.calDeadlineInfo}>
                    <span className={styles.calDeadlineName}>{d.project.name}</span>
                    <span className={styles.calDeadlineMeta}>{d.client} · {d.project.amount}</span>
                  </div>
                  <span className={styles.calDeadlineStatus} style={{ color: st?.color, background: `${st?.color}10` }}>{st?.label}</span>
                </div>
              );
            })}
          </>
        ) : selectedDay && selectedDeadlines.length === 0 ? (
          <div className={styles.calEmpty}>No deadlines on {MONTH_NAMES[viewMonth].slice(0, 3)} {selectedDay}</div>
        ) : (
          <>
            <div className={styles.calDeadlineLabel}>
              all deadlines
              <span className={styles.calDeadlineCount}>{allDeadlines.length}</span>
            </div>
            {allDeadlines.length === 0 && (
              <div className={styles.calEmpty}>No deadlines this month</div>
            )}
            {allDeadlines.map((d, i) => {
              const st = STATUS[d.project.status];
              return (
                <div key={i} className={styles.calDeadlineItem} onClick={() => onScrollToEvent ? onScrollToEvent(d.project.id) : onSelectProject(d.project, d.client)}>
                  <div className={styles.calDeadlineDot} style={{ background: st?.color || "var(--ember)" }} />
                  <div className={styles.calDeadlineInfo}>
                    <span className={styles.calDeadlineName}>{d.project.name}</span>
                    <span className={styles.calDeadlineMeta}>{d.client} · {MONTH_NAMES[viewMonth].slice(0, 3)} {d.day}</span>
                  </div>
                  <span className={styles.calDeadlineStatus} style={{ color: st?.color, background: `${st?.color}10` }}>{st?.label}</span>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

const REVENUE_WEEKS = [
  { week: "W1", earned: 1200, pending: 800 },
  { week: "W2", earned: 2400, pending: 1200 },
  { week: "W3", earned: 1800, pending: 2400 },
  { week: "W4", earned: 3200, pending: 1600 },
  { week: "W5", earned: 2800, pending: 800 },
  { week: "W6", earned: 4200, pending: 2000 },
  { week: "W7", earned: 3600, pending: 1400 },
  { week: "now", earned: 2200, pending: 3800 },
];

function getDueColor(daysLeft: number | null) {
  if (daysLeft === null) return "var(--ink-300)";
  if (daysLeft < 0) return "#c24b38";
  if (daysLeft <= 3) return "#c89360";
  if (daysLeft <= 7) return "#b07d4f";
  return "var(--ink-400)";
}

function getDueLabel(daysLeft: number | null, due: string) {
  if (daysLeft === null) return due;
  if (daysLeft < 0) return `${Math.abs(daysLeft)}d overdue`;
  if (daysLeft === 0) return "Today";
  if (daysLeft === 1) return "Tomorrow";
  if (daysLeft <= 7) return `${daysLeft}d left`;
  return due;
}

export default function Sidebar({ workspaces, archived, activeProject, open, width, isResizing, wordCount, railActive, onClose, onToggleWorkspace, onSelectWorkspaceHome, onSelectProject, onArchiveProject, onArchiveCompleted, onArchiveWorkspace, onRestoreProject, onReorderWorkspaces, onRenameWorkspace, onRenameProject, onAddWorkspace, onTogglePin, onCycleStatus, onScrollToCalendarEvent }: SidebarProps) {
  const [wsMenu, setWsMenu] = useState<string | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [showAddWs, setShowAddWs] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [dragWsId, setDragWsId] = useState<string | null>(null);
  const [dropWsId, setDropWsId] = useState<string | null>(null);
  const dragRef = useRef<number | null>(null);
  const [editingWsId, setEditingWsId] = useState<string | null>(null);
  const [editingWsName, setEditingWsName] = useState("");
  const [editingPjId, setEditingPjId] = useState<string | null>(null);
  const [editingPjName, setEditingPjName] = useState("");
  const [search, setSearch] = useState("");
  const [expandedStats, setExpandedStats] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Close workspace menu on outside click
  useEffect(() => {
    if (!wsMenu) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.wsDropdown}`) && !target.closest(`.${styles.wsMenuBtn}`)) {
        setWsMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [wsMenu]);

  const totalEarnings = workspaces.reduce((s, w) =>
    s + w.projects.reduce((a, p) => {
      const m = p.amount.match(/[\d,]+/);
      return a + (m ? parseInt(m[0].replace(",", "")) : 0);
    }, 0), 0);
  const activeCount = workspaces.reduce((s, w) => s + w.projects.filter(p => p.status === "active").length, 0);
  const overdueCount = workspaces.reduce((s, w) => s + w.projects.filter(p => p.status === "overdue").length, 0);
  const totalProjects = workspaces.reduce((s, w) => s + w.projects.length, 0);
  const completedTotal = workspaces.reduce((s, w) => s + w.projects.filter(p => p.status === "completed").length, 0);

  const completedCount = (wsId: string) =>
    workspaces.find(w => w.id === wsId)?.projects.filter(p => p.status === "completed").length || 0;

  // Revenue flow — bar chart uses sample weekly data, totals computed from real projects
  const maxBarVal = Math.max(...REVENUE_WEEKS.map(w => w.earned + w.pending));
  const parseAmount = (amt: string) => { const m = amt.match(/[\d,]+/); return m ? parseInt(m[0].replace(",", "")) : 0; };
  const totalEarned = workspaces.reduce((s, w) => s + w.projects.filter(p => p.status === "completed").reduce((a, p) => a + parseAmount(p.amount), 0), 0);
  const totalPending = workspaces.reduce((s, w) => s + w.projects.filter(p => p.status !== "completed").reduce((a, p) => a + parseAmount(p.amount), 0), 0);

  // Pinned projects
  const pinnedProjects = workspaces.flatMap(w =>
    w.projects.filter(p => p.pinned).map(p => ({ ...p, wsName: w.client, wsColor: w.avatarBg }))
  );

  // Filtered workspaces
  const filtered = search
    ? workspaces.map(w => ({
        ...w,
        projects: w.projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
        open: true,
      })).filter(w => w.client.toLowerCase().includes(search.toLowerCase()) || w.projects.length > 0)
    : workspaces;

  return (
    <div className={`${styles.sidebar} ${open ? "" : styles.closed} ${isResizing ? styles.resizing : ""}`} style={{ "--sidebar-w": `${width}px` } as React.CSSProperties}>
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.head}>
          <span className={styles.title}>{railActive === "calendar" ? "calendar" : "workspaces"}</span>
          <div className={styles.headActions}>
            {railActive !== "calendar" && (
              <button className={styles.iconBtn} title="Add workspace" aria-label="Add workspace" onClick={() => setShowAddWs(true)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            )}
            <button className={styles.iconBtn} onClick={onClose} aria-label="Close sidebar">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>

        {/* Calendar view */}
        {railActive === "calendar" && <CalendarView workspaces={workspaces} onSelectProject={onSelectProject} onScrollToEvent={onScrollToCalendarEvent} />}

        {/* Revenue Flow */}
        {railActive !== "calendar" && <>
        <div className={styles.revenueArea}>
          {/* Header */}
          <div className={styles.rfHead}>
            <div className={styles.rfTitleRow}>
              <span className={styles.rfAmount}>${(totalEarned / 1000).toFixed(1)}k</span>
              <span className={styles.rfTrend}>+23%</span>
            </div>
            <span className={styles.rfLabel}>earned this month</span>
          </div>

          {/* Chart */}
          <div className={styles.rfChart}>
            {REVENUE_WEEKS.map((w, i) => {
              const earnedH = (w.earned / maxBarVal) * 100;
              const pendingH = (w.pending / maxBarVal) * 100;
              const isHovered = hoveredBar === i;
              const isNow = i === REVENUE_WEEKS.length - 1;
              return (
                <div key={i} className={`${styles.rfBarWrap} ${isNow ? styles.rfBarNow : ""}`}
                  onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                  <div className={styles.rfBarCol}>
                    <div className={`${styles.rfBar} ${styles.rfBarPending}`} style={{ height: `${pendingH}%`, opacity: isHovered ? 1 : 0.5 }} />
                    <div className={`${styles.rfBar} ${styles.rfBarEarned}`} style={{ height: `${earnedH}%`, opacity: isHovered ? 1 : 0.8 }} />
                  </div>
                  {isHovered && (
                    <div className={styles.rfTooltip}>
                      <span className={styles.rfTtEarned}>${w.earned.toLocaleString()}</span>
                      <span className={styles.rfTtPending}>${w.pending.toLocaleString()} pending</span>
                    </div>
                  )}
                  <span className={styles.rfBarLabel}>{isNow ? "→" : w.week}</span>
                </div>
              );
            })}
          </div>

          {/* Breakdown */}
          <div className={styles.rfBreakdown}>
            <div className={styles.rfBkItem}>
              <div className={`${styles.rfBkDot} ${styles.rfBkDotEarned}`} />
              <span className={styles.rfBkLabel}>Earned</span>
              <span className={styles.rfBkVal}>${(totalEarned / 1000).toFixed(1)}k</span>
            </div>
            <div className={styles.rfBkItem}>
              <div className={`${styles.rfBkDot} ${styles.rfBkDotPending}`} />
              <span className={styles.rfBkLabel}>Pending</span>
              <span className={styles.rfBkVal}>${(totalPending / 1000).toFixed(1)}k</span>
            </div>
            <div className={styles.rfBkItem}>
              <div className={`${styles.rfBkDot} ${styles.rfBkDotTotal}`} />
              <span className={styles.rfBkLabel}>Pipeline</span>
              <span className={`${styles.rfBkVal} ${styles.rfBkValStrong}`}>${((totalEarned + totalPending) / 1000).toFixed(1)}k</span>
            </div>
          </div>

          {/* Expandable project stats */}
          <div className={styles.statsToggle} onClick={() => setExpandedStats(!expandedStats)}>
            <div className={styles.statsToggleRow}>
              <span className={styles.statsToggleLabel}>{activeCount} active · {overdueCount > 0 ? <span style={{ color: "#c24b38" }}>{overdueCount} overdue</span> : "0 overdue"}</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: expandedStats ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {expandedStats && (
            <div className={styles.statsExpanded}>
              <div className={styles.statMini}><div className={styles.statMiniVal}>{totalProjects}</div><div className={styles.statMiniLab}>total</div></div>
              <div className={styles.statMini}><div className={styles.statMiniVal}>{completedTotal}</div><div className={styles.statMiniLab}>done</div></div>
              <div className={styles.statMini}><div className={styles.statMiniVal}>{totalProjects > 0 ? Math.round((completedTotal / totalProjects) * 100) : 0}%</div><div className={styles.statMiniLab}>rate</div></div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" /><path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          <input className={styles.search} placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Pinned */}
        {pinnedProjects.length > 0 && !search && (
          <div className={styles.pinnedSection}>
            <div className={styles.sectionLabel}>pinned</div>
            {pinnedProjects.map(p => (
              <div key={p.id} className={`${styles.pinnedItem} ${activeProject === p.id ? styles.pinnedItemOn : ""}`} onClick={() => {
                const ws = workspaces.find(w => w.projects.some(pr => pr.id === p.id));
                if (ws) onSelectProject(p, ws.client);
              }}>
                <div className={styles.pinnedDot} style={{ background: p.wsColor }} />
                <div className={styles.pinnedInfo}>
                  <div className={styles.pinnedName}>{p.name}</div>
                  <div className={styles.pinnedWs}>{p.wsName}</div>
                </div>
                <div className={styles.pinnedProgress}>
                  <div className={styles.pinnedProgressFill} style={{ width: `${p.progress}%`, background: STATUS[p.status].color }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Workspace list */}
        <div className={styles.scroll}>
          {!search && <div className={styles.sectionLabel}>clients</div>}

          {filtered.map((ws, wsIdx) => (
            <div
              key={ws.id}
              className={`${styles.wsBlock} ${dropWsId === ws.id ? styles.wsDropTarget : ""} ${dragWsId === ws.id ? styles.wsDragging : ""}`}
              onDragOver={e => { e.preventDefault(); if (dragWsId && dragWsId !== ws.id) setDropWsId(ws.id); }}
              onDragLeave={() => { if (dropWsId === ws.id) setDropWsId(null); }}
              onDrop={e => { e.preventDefault(); if (dragRef.current !== null && dragRef.current !== wsIdx) onReorderWorkspaces(dragRef.current, wsIdx); setDragWsId(null); setDropWsId(null); dragRef.current = null; }}
            >
              <div
                className={styles.wsHead}
                draggable
                onDragStart={e => { setDragWsId(ws.id); dragRef.current = wsIdx; e.dataTransfer.effectAllowed = "move"; }}
                onDragEnd={() => { setDragWsId(null); setDropWsId(null); dragRef.current = null; }}
              >
                <div className={styles.wsHeadClick} onClick={() => { if (editingWsId !== ws.id) onToggleWorkspace(ws.id); }}>
                  <div className={styles.wsAvatar} style={{ background: ws.avatarBg }} onDoubleClick={e => { e.stopPropagation(); onSelectWorkspaceHome(ws.id); }}>{ws.avatar}</div>
                  <div className={styles.wsInfo}>
                    {editingWsId === ws.id ? (
                      <input className={styles.wsRenameInput} value={editingWsName} autoFocus
                        onChange={e => setEditingWsName(e.target.value)}
                        onBlur={() => { onRenameWorkspace(ws.id, editingWsName.trim() || ws.client); setEditingWsId(null); }}
                        onKeyDown={e => { if (e.key === "Enter") { onRenameWorkspace(ws.id, editingWsName.trim() || ws.client); setEditingWsId(null); } if (e.key === "Escape") setEditingWsId(null); }}
                        onClick={e => e.stopPropagation()} />
                    ) : (
                      <span className={styles.wsName} onDoubleClick={e => { e.stopPropagation(); setEditingWsId(ws.id); setEditingWsName(ws.client); }}>{ws.client}</span>
                    )}
                    <div className={styles.wsMeta}>
                      {totalEarnings > 0 && <span className={styles.wsRevenue}>${(ws.projects.reduce((a, p) => { const m = p.amount.match(/[\d,]+/); return a + (m ? parseInt(m[0].replace(",", "")) : 0); }, 0) / 1000).toFixed(1)}k</span>}
                      <span className={styles.wsLastActive}>{ws.lastActive}</span>
                    </div>
                  </div>
                  <span className={styles.wsCount}>{ws.projects.length}</span>
                  <span className={styles.wsArrow} style={{ transform: ws.open ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                </div>
                <button className={styles.wsMenuBtn} onClick={e => { e.stopPropagation(); setWsMenu(wsMenu === ws.id ? null : ws.id); }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="3" cy="7" r="1" fill="currentColor" /><circle cx="7" cy="7" r="1" fill="currentColor" /><circle cx="11" cy="7" r="1" fill="currentColor" /></svg>
                </button>
              </div>

              {/* Workspace dropdown */}
              {wsMenu === ws.id && (
                <div className={styles.wsDropdown}>
                  <button className={styles.wsDropItem} onClick={() => { setEditingWsId(ws.id); setEditingWsName(ws.client); setWsMenu(null); }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span>Rename</span>
                  </button>
                  {completedCount(ws.id) > 0 && (
                    <button className={styles.wsDropItem} onClick={() => { onArchiveCompleted(ws.id); setWsMenu(null); }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3.5h9M2.5 3.5v6a1 1 0 001 1h5a1 1 0 001-1v-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 6h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
                      <span>Archive completed</span>
                      <span className={styles.wsDropBadge}>{completedCount(ws.id)}</span>
                    </button>
                  )}
                  <button className={styles.wsDropItem} onClick={() => { onArchiveWorkspace(ws.id); setWsMenu(null); }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3.5h9M2.5 3.5v6a1 1 0 001 1h5a1 1 0 001-1v-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 6l1.5 1.5L8 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span>Archive workspace</span>
                  </button>
                </div>
              )}

              {/* Projects */}
              {ws.open && ws.projects.map(pj => {
                const st = STATUS[pj.status];
                return (
                  <div
                    key={pj.id}
                    className={`${styles.project} ${activeProject === pj.id ? styles.projectActive : ""}`}
                    onClick={() => { if (editingPjId !== pj.id) onSelectProject(pj, ws.client); }}
                  >
                    <div
                      className={styles.projectStatusDot}
                      style={{ background: st.color }}
                      onClick={e => { e.stopPropagation(); onCycleStatus(pj.id); }}
                      title={`${st.label} — click to change`}
                    />
                    <div className={styles.projectContent}>
                      {editingPjId === pj.id ? (
                        <input className={styles.pjRenameInput} value={editingPjName} autoFocus
                          onChange={e => setEditingPjName(e.target.value)}
                          onBlur={() => { onRenameProject(pj.id, editingPjName.trim() || pj.name); setEditingPjId(null); }}
                          onKeyDown={e => { if (e.key === "Enter") { onRenameProject(pj.id, editingPjName.trim() || pj.name); setEditingPjId(null); } if (e.key === "Escape") setEditingPjId(null); }}
                          onClick={e => e.stopPropagation()} />
                      ) : (
                        <span className={styles.projectName} onDoubleClick={e => { e.stopPropagation(); setEditingPjId(pj.id); setEditingPjName(pj.name); }}>{pj.name}</span>
                      )}
                      <div className={styles.projectBottom}>
                        <span className={styles.projectDue} style={{ color: getDueColor(pj.daysLeft) }}>{getDueLabel(pj.daysLeft, pj.due)}</span>
                        {pj.amount !== "—" && <span className={styles.projectAmount}>{pj.amount}</span>}
                        <div className={styles.projectProgressBar}>
                          <div className={styles.projectProgressFill} style={{ width: `${pj.progress}%`, background: st.color }} />
                        </div>
                        <span className={styles.projectProgressPct}>{pj.progress}%</span>
                      </div>
                    </div>
                    <div className={styles.projectActions}>
                      <button className={`${styles.pjActBtn} ${pj.pinned ? styles.pjPinActive : ""}`} title={pj.pinned ? "Unpin" : "Pin"}
                        onClick={e => { e.stopPropagation(); onTogglePin(pj.id); }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M4 8L2 10M7 1.5l2 2-1.5 2-.5-.5L4 8l-1.5-1.5L5.5 3.5 5 3z" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill={pj.pinned ? "currentColor" : "none"} /></svg>
                      </button>
                      <button className={styles.pjActBtn} title="Archive" onClick={e => { e.stopPropagation(); onArchiveProject(pj.id); }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 3h8M1.8 3v5a.8.8 0 00.8.8h4.8a.8.8 0 00.8-.8V3" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 5h2" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Add workspace */}
          {!search && !showAddWs && (
            <div className={styles.addWsRow} onClick={() => setShowAddWs(true)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
              <span>Add workspace</span>
            </div>
          )}
          {showAddWs && (
            <div className={styles.addWsInputRow}>
              <input className={styles.addWsInput} placeholder="Client name..." value={newWsName} autoFocus
                onChange={e => setNewWsName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && newWsName.trim()) { onAddWorkspace(newWsName.trim()); setNewWsName(""); setShowAddWs(false); } if (e.key === "Escape") { setNewWsName(""); setShowAddWs(false); } }} />
              <button className={styles.addWsConfirm} onClick={() => { if (newWsName.trim()) { onAddWorkspace(newWsName.trim()); setNewWsName(""); setShowAddWs(false); } }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button className={styles.addWsCancel} onClick={() => { setNewWsName(""); setShowAddWs(false); }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
              </button>
            </div>
          )}

          {/* Archive drawer */}
          {archived.length > 0 && !search && (
            <div className={styles.archiveSection}>
              <div className={styles.archiveHead} onClick={() => setArchiveOpen(!archiveOpen)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3.5h9M2.5 3.5v6a1 1 0 001 1h5a1 1 0 001-1v-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 6h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
                <span className={styles.archiveLabel}>archive</span>
                <span className={styles.archiveBadge}>{archived.length}</span>
                <span className={styles.archiveArrow} style={{ transform: archiveOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
              </div>
              {archiveOpen && archived.map((item, idx) => (
                <div key={`${item.project.id}-${idx}`} className={styles.archiveItem}>
                  <div className={styles.archiveItemDot} />
                  <div className={styles.archiveItemInfo}>
                    <span className={styles.archiveItemName}>{item.project.name}</span>
                    <span className={styles.archiveItemMeta}>{item.workspaceName} · {item.archivedAt}</span>
                  </div>
                  <button className={styles.archiveRestoreBtn} onClick={() => onRestoreProject(idx)} title="Restore">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6.5a4 4 0 017.5-1.5M10 2v3H7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 5.5a4 4 0 01-7.5 1.5M2 10V7h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        </>}

        {/* Footer */}
        <div className={styles.footer}>
          <span>{railActive === "calendar" ? `${workspaces.flatMap(w => w.projects).filter(p => p.daysLeft != null).length} deadlines` : `${totalProjects} projects · ${workspaces.length} clients`}</span>
          <span className={styles.savedIndicator}>
            <span className={styles.savedDot} />saved
          </span>
        </div>
      </div>
    </div>
  );
}
