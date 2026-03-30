"use client";

import { useState, useRef, useEffect } from "react";
import { getDueLabel, getDueColor, getDueBg, formatDueShort, getQuickDates, getDueUrgency } from "@/lib/due-dates";
import styles from "./DueDatePicker.module.css";

interface DueDatePickerProps {
  date: string | null;
  onChange: (date: string | null) => void;
  compact?: boolean;
}

export default function DueDatePicker({ date, onChange, compact }: DueDatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Outside click close
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const urgency = getDueUrgency(date);
  const label = getDueLabel(date);
  const color = getDueColor(date);
  const bg = getDueBg(date);
  const shortDate = formatDueShort(date);
  const quickDates = getQuickDates();

  const handleDateInput = (value: string) => {
    if (value) {
      onChange(value);
      setOpen(false);
    }
  };

  const handleClear = () => {
    onChange(null);
    setOpen(false);
  };

  return (
    <div className={styles.wrap} ref={ref}>
      {/* Trigger */}
      <button
        className={`${styles.trigger} ${compact ? styles.triggerCompact : ""} ${urgency !== "none" ? styles.triggerActive : ""}`}
        style={{ color, background: date ? bg : undefined, borderColor: date ? color + "20" : undefined }}
        onClick={() => setOpen(p => !p)}
      >
        {urgency === "overdue" && <span className={styles.urgentDot} />}
        {urgency === "urgent" && <span className={styles.urgentDot} />}
        {compact ? (
          <span>{date ? shortDate : "Set date"}</span>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
              <rect x="1.5" y="2" width="9" height="8" rx="1.5" stroke="currentColor" strokeWidth="1" />
              <path d="M1.5 4.5h9M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span>{date ? label : "Set due date"}</span>
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className={styles.dropdown}>
          {/* Native date input */}
          <div className={styles.dateInputWrap}>
            <input
              ref={inputRef}
              type="date"
              className={styles.dateInput}
              value={date || ""}
              onChange={e => handleDateInput(e.target.value)}
            />
          </div>

          {/* Quick picks */}
          <div className={styles.quickLabel}>Quick set</div>
          <div className={styles.quickList}>
            {quickDates.map(q => (
              <button
                key={q.label}
                className={`${styles.quickItem} ${date === q.date ? styles.quickItemOn : ""}`}
                onClick={() => { onChange(q.date); setOpen(false); }}
              >
                <span className={styles.quickItemLabel}>{q.label}</span>
                <span className={styles.quickItemDate}>{formatDueShort(q.date)}</span>
              </button>
            ))}
          </div>

          {/* Clear */}
          {date && (
            <button className={styles.clearBtn} onClick={handleClear}>
              Remove due date
            </button>
          )}
        </div>
      )}
    </div>
  );
}
