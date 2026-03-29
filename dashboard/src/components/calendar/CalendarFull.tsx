"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { Workspace } from "@/lib/types";
import styles from "./CalendarFull.module.css";

const genId = () => Math.random().toString(36).slice(2, 10);

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am – 8pm
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOUR_H = 64;

interface CalendarEvent {
  id: string;
  title: string;
  workspaceId: string;
  dayIdx: number;
  startHour: number;
  startMin: number;
  duration: number;
  type: "meeting" | "work" | "deadline" | "personal";
}

const EVENT_ICONS: Record<string, string> = {
  meeting: "◎",
  work: "◆",
  deadline: "⚑",
  personal: "✦",
};

interface CalendarFullProps {
  workspaces: Workspace[];
  onOpenProject?: (workspaceId: string) => void;
  scrollToProjectId?: string | null;
  onScrollComplete?: () => void;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatHour(h: number): string {
  if (h === 0 || h === 12) return h === 0 ? "12am" : "12pm";
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseDueDate(due: string): Date | null {
  if (!due || due === "—") return null;
  const match = due.match(/^([A-Za-z]+)\s+(\d+)$/);
  if (!match) return null;
  const monthIdx = MONTH_MAP[match[1]];
  if (monthIdx === undefined) return null;
  const day = parseInt(match[2]);
  const now = new Date();
  // Assume current year, but if month is far behind, could be next year
  let year = now.getFullYear();
  const candidate = new Date(year, monthIdx, day);
  // If the date is more than 6 months in the past, assume next year
  if (candidate.getTime() < now.getTime() - 180 * 86400000) year++;
  return new Date(year, monthIdx, day);
}

function generateDeadlineEvents(workspaces: Workspace[], weekStart: Date): CalendarEvent[] {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const events: CalendarEvent[] = [];
  workspaces.forEach((ws, wsIdx) => {
    ws.projects.forEach(p => {
      if (p.status === "completed") return;
      const dueDate = parseDueDate(p.due);
      if (!dueDate) return;

      // Check if due date falls in this week
      if (dueDate >= weekStart && dueDate < weekEnd) {
        const dayIdx = (dueDate.getDay() + 6) % 7; // Monday = 0
        const isOverdue = p.daysLeft != null && p.daysLeft < 0;
        events.push({
          id: `deadline-${p.id}`,
          title: p.name,
          workspaceId: `w${wsIdx + 1}`,
          dayIdx,
          startHour: 10,
          startMin: 0,
          duration: 60,
          type: isOverdue ? "deadline" : "deadline",
        });
      }
    });
  });

  return events;
}

export default function CalendarFull({ workspaces, onOpenProject, scrollToProjectId, onScrollComplete }: CalendarFullProps) {
  const [userEvents, setUserEvents] = useState<CalendarEvent[]>([]);
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));

  // Live deadline events derived from workspace data
  const deadlineEvents = useMemo(() => generateDeadlineEvents(workspaces, weekStart), [workspaces, weekStart]);

  // Merge: deadline events + user-created events
  const events = useMemo(() => [...deadlineEvents, ...userEvents], [deadlineEvents, userEvents]);
  const [wsFilter, setWsFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({ title: "", workspaceId: "w1", dayIdx: 0, startHour: 9, startMin: 0, duration: 60, type: "work" as CalendarEvent["type"] });
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const [now, setNow] = useState(new Date());
  const gridRef = useRef<HTMLDivElement>(null);

  // Refresh now every 60s
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(i);
  }, []);

  // Scroll to top on mount — nudge to current hour only if within working hours
  useEffect(() => {
    if (gridRef.current) {
      const h = now.getHours();
      if (h >= 9 && h <= 18) {
        // Center current hour in view, capped so we never scroll past the start
        gridRef.current.scrollTop = Math.max(0, (h - 8) * HOUR_H);
      } else {
        gridRef.current.scrollTop = 0;
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to a specific project event when triggered from mini-calendar
  useEffect(() => {
    if (!scrollToProjectId || !gridRef.current) return;

    // Find the project's due date and navigate to its week
    let targetDate: Date | null = null;
    workspaces.forEach(ws => {
      ws.projects.forEach(p => {
        if (p.id === scrollToProjectId) {
          targetDate = parseDueDate(p.due);
        }
      });
    });

    if (!targetDate) { onScrollComplete?.(); return; }

    // Navigate to the week containing this date
    const targetWeekStart = getWeekStart(targetDate);
    setWeekStart(targetWeekStart);

    // After state updates and re-render, scroll to the event element
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const eventEl = gridRef.current?.querySelector(`[data-event-id="deadline-${scrollToProjectId}"]`) as HTMLElement | null;
        if (eventEl) {
          const gridTop = gridRef.current!.getBoundingClientRect().top;
          const eventTop = eventEl.getBoundingClientRect().top;
          const scrollOffset = gridRef.current!.scrollTop + (eventTop - gridTop) - 100;
          gridRef.current!.scrollTo({ top: Math.max(0, scrollOffset), behavior: "smooth" });

          // Flash highlight
          setSelectedEvent(`deadline-${scrollToProjectId}`);
          const rect = eventEl.getBoundingClientRect();
          setPopoverPos({ top: Math.min(rect.top, window.innerHeight - 260), left: Math.min(rect.right + 8, window.innerWidth - 280) });
        }
        onScrollComplete?.();
      });
    });
  }, [scrollToProjectId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const isToday = (d: Date) =>
    d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();

  const todayIdx = weekDates.findIndex(isToday);

  // Now line
  const nowMinutes = (now.getHours() - 7) * 60 + now.getMinutes();
  const nowTop = (nowMinutes / 60) * HOUR_H;
  const showNowLine = now.getHours() >= 7 && now.getHours() <= 20;

  // Nav
  const prevWeek = () => setWeekStart(prev => { const d = new Date(prev); d.setDate(d.getDate() - 7); return d; });
  const nextWeek = () => setWeekStart(prev => { const d = new Date(prev); d.setDate(d.getDate() + 7); return d; });
  const goToday = () => setWeekStart(getWeekStart(new Date()));

  // Filter
  const filtered = wsFilter === "all" ? events : events.filter(e => e.workspaceId === wsFilter);

  // Workspace lookup
  const getWs = useCallback((id: string) => {
    const idx = parseInt(id.replace("w", "")) - 1;
    return workspaces[idx] || { client: "Unknown", avatarBg: "#999" };
  }, [workspaces]);

  // Single click — select event and show popover
  const handleEventClick = (e: React.MouseEvent<HTMLDivElement>, evtId: string) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const left = Math.min(rect.right + 8, window.innerWidth - 280);
    const top = Math.min(Math.max(rect.top, 8), window.innerHeight - 260);
    setPopoverPos({ top, left });
    setSelectedEvent(evtId);
  };

  // Double click — navigate to the project tab
  const handleEventDoubleClick = (e: React.MouseEvent<HTMLDivElement>, evtId: string) => {
    e.stopPropagation();
    const evt = events.find(ev => ev.id === evtId);
    if (evt && onOpenProject) {
      setSelectedEvent(null);
      setPopoverPos(null);
      onOpenProject(evt.workspaceId);
    }
  };

  // Cell click → create (guard against rapid double click)
  const handleCellClick = (dayIdx: number, hour: number) => {
    if (showCreate) return;
    setCreateData({ title: "", workspaceId: workspaces[0]?.id || "w1", dayIdx, startHour: hour, startMin: 0, duration: 60, type: "work" });
    setShowCreate(true);
  };

  const saveEvent = () => {
    if (!createData.title.trim()) return;
    setUserEvents(prev => [...prev, { ...createData, id: genId() }]);
    setShowCreate(false);
  };

  const deleteEvent = (id: string) => {
    // Only user events can be deleted — deadline events are read-only
    if (id.startsWith("deadline-")) return;
    setUserEvents(prev => prev.filter(e => e.id !== id));
    setSelectedEvent(null);
    setPopoverPos(null);
  };

  // Close popover on outside click or Escape
  useEffect(() => {
    if (!selectedEvent) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.popover}`) && !target.closest(`.${styles.event}`)) {
        setSelectedEvent(null);
        setPopoverPos(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSelectedEvent(null); setPopoverPos(null); }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [selectedEvent]);

  // Stats
  const totalHours = Math.round(filtered.reduce((s, e) => s + e.duration, 0) / 60 * 10) / 10;
  const meetingCount = filtered.filter(e => e.type === "meeting").length;
  const deadlineCount = filtered.filter(e => e.type === "deadline").length;

  // Month label
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthLabel = (() => {
    const sm = weekDates[0].getMonth();
    const em = weekDates[6].getMonth();
    if (sm === em) return `${months[sm]} ${weekDates[0].getFullYear()}`;
    return `${months[sm].slice(0, 3)} – ${months[em].slice(0, 3)} ${weekDates[6].getFullYear()}`;
  })();

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.title}>{monthLabel}</span>
          <div className={styles.navBtns}>
            <button className={styles.navBtn} onClick={prevWeek} aria-label="Previous week">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 3L4 7l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button className={styles.navBtn} onClick={nextWeek} aria-label="Next week">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
          <button className={styles.todayBtn} onClick={goToday}>Today</button>
        </div>
        <div className={styles.headerRight}>
          <button className={`${styles.filterPill} ${wsFilter === "all" ? styles.filterPillOn : ""}`} onClick={() => setWsFilter("all")}>All</button>
          {workspaces.slice(0, 4).map((ws, i) => (
            <button key={ws.id} className={`${styles.filterPill} ${wsFilter === `w${i + 1}` ? styles.filterPillOn : ""}`} onClick={() => setWsFilter(wsFilter === `w${i + 1}` ? "all" : `w${i + 1}`)}>
              <span className={styles.filterDot} style={{ background: ws.avatarBg }} />
              {ws.client.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Day headers */}
      <div className={styles.dayHeaders}>
        <div className={styles.dayHeaderGutter} />
        {weekDates.map((d, i) => (
          <div key={i} className={`${styles.dayHeader} ${isToday(d) ? styles.dayHeaderToday : ""}`}>
            <span className={styles.dayName}>{DAY_NAMES[d.getDay()]}</span>
            <span className={`${styles.dayDate} ${isToday(d) ? styles.dayDateToday : ""}`}>{d.getDate()}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.gridWrap} ref={gridRef}>
        <div className={styles.grid}>
          {HOURS.map(hour => (
            <div key={hour} className={styles.hourRow}>
              <div className={styles.hourLabel}>
                <span className={styles.hourLabelText}>{formatHour(hour)}</span>
              </div>
              {Array.from({ length: 7 }, (_, dayIdx) => (
                <div
                  key={dayIdx}
                  className={`${styles.hourCell} ${dayIdx === todayIdx ? styles.hourCellToday : ""}`}
                  onClick={() => handleCellClick(dayIdx, hour)}
                >
                  {/* Render events only from first hour row to avoid duplicates */}
                  {hour === HOURS[0] && filtered
                    .filter(e => e.dayIdx === dayIdx)
                    .map(evt => {
                      const ws = getWs(evt.workspaceId);
                      const top = ((evt.startHour - 7) * 60 + evt.startMin) / 60 * HOUR_H;
                      const height = Math.max(22, (evt.duration / 60) * HOUR_H - 2);
                      return (
                        <div
                          key={evt.id}
                          data-event-id={evt.id}
                          className={`${styles.event} ${selectedEvent === evt.id ? styles.eventSelected : ""}`}
                          style={{
                            top,
                            height,
                            background: ws.avatarBg + "12",
                            borderLeftColor: ws.avatarBg,
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`${evt.title}, ${ws.client}, ${formatHour(evt.startHour)}`}
                          onClick={e => handleEventClick(e, evt.id)}
                          onDoubleClick={e => handleEventDoubleClick(e, evt.id)}
                          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleEventClick(e as unknown as React.MouseEvent<HTMLDivElement>, evt.id); } }}
                        >
                          <div className={styles.eventTitle}>{evt.title}</div>
                          {height > 34 && (
                            <div className={styles.eventMeta}>
                              <span className={styles.eventTypeIcon}>{EVENT_ICONS[evt.type]}</span>
                              <span className={styles.eventWs}>{ws.client}</span>
                              <span>· {formatHour(evt.startHour)}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  }
                </div>
              ))}
            </div>
          ))}

          {/* Now line */}
          {showNowLine && todayIdx >= 0 && (
            <div
              className={styles.nowLine}
              style={{
                top: nowTop,
                left: `calc(52px + ${todayIdx} * ((100% - 52px) / 7))`,
                width: `calc((100% - 52px) / 7)`,
              }}
            >
              <span className={styles.nowDot} />
            </div>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statVal}>{totalHours}h</span>
          <span className={styles.statLabel}>scheduled</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statVal}>{meetingCount}</span>
          <span className={styles.statLabel}>meetings</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statVal}>{deadlineCount}</span>
          <span className={styles.statLabel}>deadlines</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statVal}>{filtered.length}</span>
          <span className={styles.statLabel}>total events</span>
        </div>
      </div>

      {/* Event popover */}
      {selectedEvent && popoverPos && (() => {
        const evt = events.find(e => e.id === selectedEvent);
        if (!evt) return null;
        const ws = getWs(evt.workspaceId);
        const endMin = evt.startHour * 60 + evt.startMin + evt.duration;
        const endH = Math.floor(endMin / 60);
        const endM = endMin % 60;
        return (
          <div className={styles.popover} style={{ top: popoverPos.top, left: popoverPos.left }}>
            <div className={styles.popoverTitle}>{evt.title}</div>
            <div className={styles.popoverRow}>
              <span className={styles.popoverLabel}>Time</span>
              {formatHour(evt.startHour)}:{String(evt.startMin).padStart(2, "0")} – {formatHour(endH)}:{String(endM).padStart(2, "0")}
            </div>
            <div className={styles.popoverRow}>
              <span className={styles.popoverLabel}>Client</span>
              <span className={styles.popoverWsDot} style={{ background: ws.avatarBg }} /> {ws.client}
            </div>
            <div className={styles.popoverRow}>
              <span className={styles.popoverLabel}>Type</span>
              {EVENT_ICONS[evt.type]} {evt.type}
            </div>
            <div className={styles.popoverRow}>
              <span className={styles.popoverLabel}>Duration</span>
              {evt.duration}min
            </div>
            <div className={styles.popoverActions}>
              <button className={styles.popoverBtn}>Edit</button>
              <button className={`${styles.popoverBtn} ${styles.popoverBtnDanger}`} onClick={() => deleteEvent(evt.id)}>Delete</button>
            </div>
          </div>
        );
      })()}

      {/* Create modal */}
      {showCreate && (
        <div className={styles.createOverlay} onClick={() => setShowCreate(false)}>
          <div className={styles.createModal} onClick={e => e.stopPropagation()}>
            <div className={styles.createTitle}>New event</div>
            <div className={styles.createField}>
              <label className={styles.createLabel}>Title</label>
              <input className={styles.createInput} placeholder="What are you working on?" autoFocus value={createData.title} onChange={e => setCreateData(prev => ({ ...prev, title: e.target.value }))} onKeyDown={e => { if (e.key === "Enter") saveEvent(); if (e.key === "Escape") setShowCreate(false); }} />
            </div>
            <div className={styles.createRow}>
              <div className={styles.createField} style={{ flex: 1 }}>
                <label className={styles.createLabel}>Client</label>
                <select className={styles.createSelect} value={createData.workspaceId} onChange={e => setCreateData(prev => ({ ...prev, workspaceId: e.target.value }))}>
                  {workspaces.map((ws, i) => <option key={ws.id} value={`w${i + 1}`}>{ws.client}</option>)}
                </select>
              </div>
              <div className={styles.createField} style={{ flex: 1 }}>
                <label className={styles.createLabel}>Type</label>
                <select className={styles.createSelect} value={createData.type} onChange={e => setCreateData(prev => ({ ...prev, type: e.target.value as CalendarEvent["type"] }))}>
                  <option value="work">Work</option>
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
            </div>
            <div className={styles.createRow}>
              <div className={styles.createField} style={{ flex: 1 }}>
                <label className={styles.createLabel}>Start</label>
                <select className={styles.createSelect} value={createData.startHour} onChange={e => setCreateData(prev => ({ ...prev, startHour: parseInt(e.target.value) }))}>
                  {HOURS.map(h => <option key={h} value={h}>{formatHour(h)}</option>)}
                </select>
              </div>
              <div className={styles.createField} style={{ flex: 1 }}>
                <label className={styles.createLabel}>Duration</label>
                <select className={styles.createSelect} value={createData.duration} onChange={e => setCreateData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                </select>
              </div>
            </div>
            <div className={styles.createActions}>
              <button className={styles.createBtn} onClick={() => setShowCreate(false)}>Cancel</button>
              <button className={`${styles.createBtn} ${styles.createBtnPrimary}`} onClick={saveEvent}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
