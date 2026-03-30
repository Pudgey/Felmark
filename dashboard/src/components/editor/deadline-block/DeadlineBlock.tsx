"use client";

import { useState } from "react";
import type { DeadlineBlockData } from "@/lib/types";
import { daysLeft, formatDue, getDueLabelFromDate, getDueColorFromDate } from "@/lib/utils";
import styles from "./DeadlineBlock.module.css";

interface DeadlineBlockProps {
  data: DeadlineBlockData;
  onUpdate: (data: DeadlineBlockData) => void;
}

export default function DeadlineBlock({ data, onUpdate }: DeadlineBlockProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(data.title);

  const dl = daysLeft(data.due);
  const isOverdue = dl !== null && dl < 0;
  const isDueSoon = dl !== null && dl >= 0 && dl <= 3;
  const isDueToday = dl === 0;

  const status = data.completed ? "done" : isOverdue ? "overdue" : isDueToday ? "today" : isDueSoon ? "soon" : "upcoming";

  const statusStyles: Record<string, { border: string; bg: string }> = {
    done: { border: "rgba(90,154,60,0.3)", bg: "rgba(90,154,60,0.03)" },
    overdue: { border: "rgba(194,75,56,0.3)", bg: "rgba(194,75,56,0.03)" },
    today: { border: "var(--ember)", bg: "var(--ember-bg)" },
    soon: { border: "rgba(176,125,79,0.3)", bg: "rgba(176,125,79,0.03)" },
    upcoming: { border: "var(--warm-200)", bg: "transparent" },
  };

  const st = statusStyles[status];

  const saveTitle = () => {
    const trimmed = titleValue.trim() || data.title;
    onUpdate({ ...data, title: trimmed });
    setEditingTitle(false);
  };

  return (
    <div className={styles.block} style={{ borderColor: st.border, background: st.bg }}>
      <button
        className={`${styles.check} ${data.completed ? styles.checkDone : ""}`}
        onClick={() => onUpdate({ ...data, completed: !data.completed })}
        title={data.completed ? "Mark incomplete" : "Mark complete"}
      >
        {data.completed ? "\u2713" : "\u2691"}
      </button>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          {editingTitle ? (
            <input
              className={styles.titleInput}
              value={titleValue}
              autoFocus
              onChange={e => setTitleValue(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={e => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") { setTitleValue(data.title); setEditingTitle(false); } }}
            />
          ) : (
            <span
              className={`${styles.title} ${data.completed ? styles.titleDone : ""}`}
              onDoubleClick={() => { setTitleValue(data.title); setEditingTitle(true); }}
            >
              {data.title}
            </span>
          )}
        </div>

        <div className={styles.meta}>
          <label className={styles.datePicker} onClick={e => e.stopPropagation()}>
            <span className={styles.dateDisplay} style={{ color: data.completed ? "#5a9a3c" : getDueColorFromDate(data.due) }}>
              {data.due ? formatDue(data.due) : "Set date"}
            </span>
            <input
              type="date"
              value={data.due || ""}
              onChange={e => onUpdate({ ...data, due: e.target.value || null })}
              className={styles.dateHidden}
            />
          </label>

          {data.due && !data.completed && (
            <span className={styles.daysLeft} style={{ color: getDueColorFromDate(data.due) }}>
              {getDueLabelFromDate(data.due)}
            </span>
          )}

          {data.completed && <span className={styles.doneLabel}>Done</span>}

          <span className={styles.assignee}>{data.assignee}</span>
        </div>
      </div>
    </div>
  );
}

export function getDefaultDeadlineData(): DeadlineBlockData {
  // Default to 7 days from now
  const d = new Date();
  d.setDate(d.getDate() + 7);
  const iso = d.toISOString().split("T")[0];
  return {
    title: "Untitled deadline",
    due: iso,
    assignee: "You",
    completed: false,
  };
}
