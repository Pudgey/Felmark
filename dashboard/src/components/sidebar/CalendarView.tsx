"use client";

import { useState } from "react";
import { STATUS } from "@/lib/constants";
import type { Workstation, Project } from "@/lib/types";
import styles from "./Sidebar.module.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface CalendarViewProps {
  workstations: Workstation[];
  onSelectProject: (project: Project, client: string) => void;
  onScrollToEvent?: (projectId: string) => void;
}

export default function CalendarView({ workstations, onSelectProject, onScrollToEvent }: CalendarViewProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  // Build deadline map: day number → projects due that day
  const deadlineMap = new Map<number, { project: Project; client: string }[]>();
  workstations.forEach(ws => {
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
