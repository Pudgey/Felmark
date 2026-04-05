"use client";

import styles from "./MoneyBlock.module.css";

export interface TaxData {
  annualEarnings: number;
  taxRate: number;
  quarterlyPayments: [number, number, number, number];
}

const QUARTERS = ["Q1 (Jan\u2013Mar)", "Q2 (Apr\u2013Jun)", "Q3 (Jul\u2013Sep)", "Q4 (Oct\u2013Dec)"];

export default function TaxEstimate({ data }: { data: TaxData }) {
  const { annualEarnings, taxRate, quarterlyPayments } = data;
  const estimatedTax = Math.round(annualEarnings * taxRate);
  const quarterly = Math.round(estimatedTax / 4);
  const paidSoFar = quarterlyPayments.reduce((s, p) => s + p, 0);
  const remaining = estimatedTax - paidSoFar;
  const currentQ = 1;

  return (
    <div className={styles.mb}>
      <div className={styles.head}>
        <span className={styles.icon} style={{ color: "var(--muted)" }}>
          &sect;
        </span>
        <span className={styles.label}>Tax Estimate</span>
        <span className={styles.headVal}>{Math.round(taxRate * 100)}% rate</span>
      </div>
      <div className={styles.taxTop}>
        <div className={styles.taxBig}>
          <span className={styles.taxBigLabel}>Estimated annual tax</span>
          <span className={styles.taxBigVal}>${estimatedTax.toLocaleString()}</span>
        </div>
        <div className={styles.taxBig}>
          <span className={styles.taxBigLabel}>Quarterly set-aside</span>
          <span className={`${styles.taxBigVal} ${styles.ember}`}>${quarterly.toLocaleString()}</span>
        </div>
      </div>
      <div className={styles.taxQuarters}>
        {QUARTERS.map((q, i) => {
          const paid = quarterlyPayments[i];
          const due = quarterly;
          const isCurrent = i === currentQ;
          const status = paid >= due ? "paid" : isCurrent ? "due" : i < currentQ ? "overdue" : "upcoming";
          const cfg = {
            paid: { color: "var(--success)", label: "Paid" },
            due: { color: "var(--ember)", label: "Due Apr 15" },
            overdue: { color: "var(--error)", label: "Overdue" },
            upcoming: { color: "var(--ink-300)", label: "Upcoming" },
          }[status]!;
          return (
            <div key={i} className={`${styles.taxQ}${status === "due" ? ` ${styles.taxQDue}` : ""}`}>
              <div className={styles.taxQHead}>
                <span className={styles.taxQName}>{q}</span>
                <span className={styles.taxQStatus} style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
              </div>
              <div className={styles.taxQBar}>
                <div
                  className={styles.taxQFill}
                  style={{ width: `${Math.min((paid / (due || 1)) * 100, 100)}%`, background: cfg.color }}
                />
              </div>
              <div className={styles.taxQVals}>
                <span>${paid.toLocaleString()} paid</span>
                <span>${due.toLocaleString()} due</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.taxFooter}>
        <span>Based on ${annualEarnings.toLocaleString()} projected annual income</span>
        <span style={{ color: remaining > 0 ? "var(--error)" : "var(--success)" }}>
          {remaining > 0 ? `$${remaining.toLocaleString()} remaining this year` : "Fully paid for the year"}
        </span>
      </div>
    </div>
  );
}
