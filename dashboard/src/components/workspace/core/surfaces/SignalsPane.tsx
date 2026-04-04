"use client";

import styles from "./SignalsPane.module.css";

const SIGNAL_DATA = [
  { av: "MS", title: "Invoice #044 viewed", desc: "Sarah stayed 2m 14s on payment page.", time: "3m", urg: "hot" as const, action: "Follow up" },
  { av: "AC", title: "Contract signed", desc: "Aster & Co. completed signature.", time: "18m", urg: "ready" as const, action: "Send invoice" },
  { av: "NK", title: "No reply in 46 hours", desc: "North Kite feedback window narrowing.", time: "46h", urg: "watch" as const, action: "Send nudge" },
  { av: "NK", title: "Payment received", desc: "$2,200 deposited. Invoice #045 closed.", time: "2h", urg: "done" as const },
  { av: "LB", title: "Proposal opened", desc: "Maria viewed 4 pages, spent 3 minutes.", time: "1h", urg: "hot" as const, action: "Follow up" },
];

export default function SignalsPane() {
  return (
    <div>
      {SIGNAL_DATA.map((signal, index) => (
        <div key={index} className={styles.sigRow}>
          <div className={`${styles.avXs} ${styles[`av${signal.urg.charAt(0).toUpperCase() + signal.urg.slice(1)}`]}`}>{signal.av}</div>
          <div className={styles.sigBody}>
            <div className={styles.sigTop}><span className={styles.rowName}>{signal.title}</span><span className={`${styles.rowMono} ${styles.dim}`}>{signal.time}</span></div>
            <div className={styles.sigDesc}>{signal.desc}</div>
            {signal.action && <button className={`${styles.sigBtn} ${styles[`sigBtn${signal.urg.charAt(0).toUpperCase() + signal.urg.slice(1)}`]}`}>{signal.action}</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
