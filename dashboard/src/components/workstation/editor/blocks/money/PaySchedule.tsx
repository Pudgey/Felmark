"use client";

import styles from "./MoneyBlock.module.css";

export interface PayScheduleItem { id: string; label: string; pct: number; amount: number; status: "paid" | "invoiced" | "upcoming" | "overdue"; date: string; trigger: string }
export interface PayScheduleData { total: number; items: PayScheduleItem[] }

const STATUS_CFG: Record<string, { color: string; bg: string; label: string }> = {
  paid: { color: "#5a9a3c", bg: "rgba(90,154,60,0.06)", label: "Paid" },
  invoiced: { color: "#5b7fa4", bg: "rgba(91,127,164,0.06)", label: "Invoiced" },
  upcoming: { color: "var(--ink-400)", bg: "var(--warm-50)", label: "Upcoming" },
  overdue: { color: "#c24b38", bg: "rgba(194,75,56,0.06)", label: "Overdue" },
};

export default function PaySchedule({ data }: { data: PayScheduleData }) {
  const { total, items } = data;
  const paid = items.filter(s => s.status === "paid").reduce((sum, s) => sum + s.amount, 0);
  const remaining = total - paid;

  return (
    <div className={styles.mb}>
      <div className={styles.head}>
        <span className={styles.icon} style={{ color: "var(--ember)" }}>&#x25c6;</span>
        <span className={styles.label}>Payment Schedule</span>
        <span className={styles.headVal}>${total.toLocaleString()} total</span>
      </div>
      <div className={styles.schedTimeline}>
        <div className={styles.schedTrack}><div className={styles.schedFill} style={{ width: `${(paid / (total || 1)) * 100}%` }} /></div>
      </div>
      <div className={styles.schedRows}>
        {items.map(s => {
          const cfg = STATUS_CFG[s.status] || STATUS_CFG.upcoming;
          return (
            <div key={s.id} className={styles.schedRow}>
              <div className={styles.schedRowIcon} style={{ color: cfg.color, background: cfg.bg }}>{s.status === "paid" ? "\u2713" : "\u25cb"}</div>
              <div className={styles.schedRowInfo}>
                <span className={styles.schedRowLabel}>{s.label}</span>
                <span className={styles.schedRowTrigger}>{s.trigger}</span>
              </div>
              <div className={styles.schedRowRight}>
                <span className={styles.schedRowAmount} style={{ color: s.status === "paid" ? "#5a9a3c" : "var(--ink-800)" }}>${s.amount.toLocaleString()}</span>
                <span className={styles.schedRowDate}>{s.date}</span>
              </div>
              <span className={styles.schedRowStatus} style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.schedSummary}>
        <div><span className={styles.schedSumLabel}>Received</span><span className={`${styles.schedSumVal} ${styles.green}`}>${paid.toLocaleString()}</span></div>
        <div><span className={styles.schedSumLabel}>Remaining</span><span className={styles.schedSumVal}>${remaining.toLocaleString()}</span></div>
      </div>
    </div>
  );
}
