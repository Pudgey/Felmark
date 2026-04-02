"use client";

import styles from "./MoneyBlock.module.css";

export interface MilestoneItem { id: string; deliverable: string; amount: number; status: "paid" | "invoiced" | "ready" | "pending"; completedDate: string | null; invoiceNum: string | null }
export interface MilestoneData { milestones: MilestoneItem[] }

const STATUS_ICONS: Record<string, { icon: string; color: string }> = {
  paid: { icon: "\u2713", color: "#5a9a3c" },
  invoiced: { icon: "\u2197", color: "#5b7fa4" },
  ready: { icon: "\u25cf", color: "#b07d4f" },
  pending: { icon: "\u25cb", color: "var(--ink-300)" },
};

export default function MilestonePayment({ data, onUpdate }: { data: MilestoneData; onUpdate?: (d: MilestoneData) => void }) {
  const { milestones } = data;
  const total = milestones.reduce((s, m) => s + m.amount, 0);
  const paidTotal = milestones.filter(m => m.status === "paid").reduce((s, m) => s + m.amount, 0);
  const readyTotal = milestones.filter(m => m.status === "ready").reduce((s, m) => s + m.amount, 0);

  const triggerInvoice = (id: string) => {
    onUpdate?.({ milestones: milestones.map(m => m.id === id ? { ...m, status: "invoiced" as const, invoiceNum: `#${48 + milestones.indexOf(m)}` } : m) });
  };

  return (
    <div className={styles.mb}>
      <div className={styles.head}>
        <span className={styles.icon} style={{ color: "#5a9a3c" }}>&#x2691;</span>
        <span className={styles.label}>Milestone Payments</span>
        <span className={styles.headVal}>${total.toLocaleString()}</span>
      </div>
      <div className={styles.mileProgress}>
        {milestones.map(m => {
          const cfg = STATUS_ICONS[m.status] || STATUS_ICONS.pending;
          return <div key={m.id} className={styles.mileSeg} style={{ background: cfg.color, opacity: m.status === "pending" ? 0.15 : m.status === "ready" ? 0.4 : 0.7 }} />;
        })}
      </div>
      <div className={styles.mileRows}>
        {milestones.map((m, i) => {
          const cfg = STATUS_ICONS[m.status] || STATUS_ICONS.pending;
          return (
            <div key={m.id} className={`${styles.mileRow}${m.status === "ready" ? ` ${styles.mileRowReady}` : ""}`}>
              <div className={styles.mileNum}>{String(i + 1).padStart(2, "0")}</div>
              <div className={styles.mileIcon} style={{ color: cfg.color }}>{cfg.icon}</div>
              <div className={styles.mileInfo}>
                <span className={styles.mileName}>{m.deliverable}</span>
                <span className={styles.mileMeta}>
                  {m.completedDate && <span>Completed {m.completedDate}</span>}
                  {m.invoiceNum && <span> &middot; {m.invoiceNum}</span>}
                </span>
              </div>
              <span className={styles.mileAmt} style={{ color: m.status === "paid" ? "#5a9a3c" : "var(--ink-700)" }}>${m.amount.toLocaleString()}</span>
              {m.status === "ready" && <button className={styles.mileTrigger} onClick={() => triggerInvoice(m.id)}>Send Invoice</button>}
              {m.status === "paid" && <span className={`${styles.mileBadge} ${styles.mileBadgePaid}`}>Paid</span>}
              {m.status === "invoiced" && <span className={`${styles.mileBadge} ${styles.mileBadgeInv}`}>Invoiced</span>}
            </div>
          );
        })}
      </div>
      <div className={styles.mileSummary}>
        <span className={styles.mileSumItem}><span className={styles.mileSumDot} style={{ background: "#5a9a3c" }} /> ${paidTotal.toLocaleString()} received</span>
        {readyTotal > 0 && <span className={styles.mileSumItem}><span className={styles.mileSumDot} style={{ background: "#b07d4f" }} /> ${readyTotal.toLocaleString()} ready</span>}
        <span className={styles.mileSumItem}><span className={styles.mileSumDot} style={{ background: "var(--warm-300)" }} /> ${(total - paidTotal - readyTotal).toLocaleString()} remaining</span>
      </div>
    </div>
  );
}
