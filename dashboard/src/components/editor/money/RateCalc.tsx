"use client";

import { useState } from "react";
import styles from "./MoneyBlock.module.css";

export interface RateCalcData { hours: number; rate: number }

export default function RateCalc({ data, onUpdate }: { data: RateCalcData; onUpdate?: (d: RateCalcData) => void }) {
  const [editing, setEditing] = useState(false);
  const { hours, rate } = data;
  const total = hours * rate;

  const set = (field: "hours" | "rate", val: number) => {
    onUpdate?.({ ...data, [field]: Math.max(0, val) });
  };

  return (
    <div className={styles.mb}>
      <div className={styles.head}>
        <span className={styles.icon} style={{ color: "var(--ember)" }}>&#x2297;</span>
        <span className={styles.label}>Rate Calculator</span>
        <button className={styles.editBtn} onClick={() => setEditing(!editing)}>{editing ? "Done" : "Edit"}</button>
      </div>
      <div className={styles.calcBody}>
        <div className={styles.calcEq}>
          <div className={styles.calcGroup}>
            <span className={styles.calcGroupLabel}>hours</span>
            {editing ? <input className={styles.calcInput} type="number" value={hours} onChange={e => set("hours", parseInt(e.target.value) || 0)} />
              : <span className={styles.calcVal}>{hours}</span>}
          </div>
          <span className={styles.calcOp}>&times;</span>
          <div className={styles.calcGroup}>
            <span className={styles.calcGroupLabel}>rate</span>
            {editing ? <input className={styles.calcInput} type="number" value={rate} onChange={e => set("rate", parseInt(e.target.value) || 0)} />
              : <span className={styles.calcVal}>${rate}</span>}
          </div>
          <span className={styles.calcOp}>=</span>
          <div className={styles.calcGroup}>
            <span className={styles.calcGroupLabel}>total</span>
            <span className={styles.calcTotal}>${total.toLocaleString()}</span>
          </div>
        </div>
        <div className={styles.calcBreakdown}>
          <span className={styles.calcBdItem}><span className={styles.calcBdLabel}>Daily (8h)</span><span className={styles.calcBdVal}>${(rate * 8).toLocaleString()}</span></span>
          <span className={styles.calcBdSep} />
          <span className={styles.calcBdItem}><span className={styles.calcBdLabel}>Weekly (40h)</span><span className={styles.calcBdVal}>${(rate * 40).toLocaleString()}</span></span>
          <span className={styles.calcBdSep} />
          <span className={styles.calcBdItem}><span className={styles.calcBdLabel}>Per deliverable</span><span className={styles.calcBdVal}>${Math.round(total / Math.max(1, Math.ceil(hours / 8))).toLocaleString()}</span></span>
        </div>
      </div>
    </div>
  );
}
