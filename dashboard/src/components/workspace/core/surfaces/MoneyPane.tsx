"use client";

import { useState } from "react";
import styles from "./ListPane.module.css";

const INVOICES = [
  { id: "i1", client: "Bolt Fitness", av: "BF", num: "047", amount: 4000, days: "4d late", status: "overdue" as const, viewed: 2 },
  { id: "i2", client: "Meridian Studio", av: "MS", num: "048", amount: 2400, days: "8d left", status: "pending" as const, viewed: 3 },
  { id: "i3", client: "Nora Kim", av: "NK", num: "049", amount: 3200, days: "7d left", status: "pending" as const, viewed: 0 },
  { id: "i4", client: "Meridian Studio", av: "MS", num: "046", amount: 1800, days: "Paid Mar 28", status: "paid" as const },
];

export default function MoneyPane() {
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>("i1");

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

      {INVOICES.map((invoice) => {
        const expanded = expandedInvoiceId === invoice.id;

        return (
          <div key={invoice.id} className={`${styles.row} ${invoice.status === "overdue" ? styles.rowOv : ""} ${expanded ? styles.rowOn : ""}`}>
            <div className={styles.rowMain} onClick={() => setExpandedInvoiceId(expanded ? null : invoice.id)}>
              <div className={`${styles.avXs} ${invoice.status === "overdue" ? styles.avOv : invoice.status === "paid" ? styles.avPos : ""}`}>{invoice.av}</div>
              <div className={styles.rowInfo}><span className={styles.rowName}>{invoice.client}</span><span className={styles.rowMeta}>#{invoice.num}</span></div>
              <span className={styles.rowMono}>${invoice.amount.toLocaleString()}</span>
              <span className={`${styles.rowMono} ${styles.sm} ${invoice.status === "overdue" ? styles.ov : ""}`}>{invoice.days}</span>
              <span className={`${styles.pill} ${styles[invoice.status]}`}>{invoice.status}</span>
              <span className={styles.chev}>{expanded ? "\u25be" : "\u203a"}</span>
            </div>

            {expanded && (
              <div className={styles.rowExp}>
                <div className={styles.expKv}><span className={styles.expL}>Viewed</span><span className={styles.expV}>{(invoice.viewed ?? 0) > 0 ? `${invoice.viewed}\u00d7 by client` : "Not opened"}</span></div>
                <div className={styles.expActions}>
                  {invoice.status === "overdue" && <button className={styles.btnDanger}>Send Reminder</button>}
                  {invoice.status === "pending" && <button className={styles.btn}>Resend</button>}
                  <button className={styles.btn}>Copy Link</button>
                  {invoice.status === "paid" && <span className={styles.confirm}>&check; Received</span>}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
