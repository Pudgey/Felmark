"use client";

import styles from "./ListPane.module.css";

const TIME_ENTRIES = [
  { task: "Color palette & typography", client: "Meridian", hours: 1.37, rate: 120, running: true },
  { task: "Blog post #1 draft", client: "Bolt Fitness", hours: 1.5, rate: 95 },
  { task: "Client call \u2014 scope", client: "Meridian", hours: 0.75, rate: 120 },
  { task: "Onboarding revisions", client: "Bolt Fitness", hours: 3.5, rate: 95 },
];

export default function TimePane() {
  const totalHours = TIME_ENTRIES.reduce((sum, entry) => sum + entry.hours, 0);
  const totalValue = TIME_ENTRIES.reduce((sum, entry) => sum + entry.hours * entry.rate, 0);
  const averageRate = Math.round(totalValue / totalHours);

  return (
    <div>
      <div className={styles.metrics}>
        <div className={styles.metric}><span className={styles.metricVal}>{totalHours.toFixed(1)}h</span><span className={styles.metricLabel}>Total</span></div>
        <div className={styles.metricSep} />
        <div className={styles.metric}><span className={styles.metricVal}>${Math.round(totalValue).toLocaleString()}</span><span className={styles.metricLabel}>Value</span></div>
        <div className={styles.metricSep} />
        <div className={styles.metric}><span className={styles.metricVal}>${averageRate}</span><span className={styles.metricLabel}>Avg /hr</span></div>
      </div>

      {TIME_ENTRIES.map((entry, index) => (
        <div key={index} className={`${styles.row} ${entry.running ? styles.rowActive : ""}`}>
          <div className={styles.rowMain}>
            <div className={styles.rowInfo}>
              <div className={styles.rowNameWrap}>
                <span className={styles.rowName}>{entry.task}</span>
                {entry.running && <span className={styles.timerTag}>&#9679; 1:22</span>}
              </div>
              <span className={styles.rowMeta}>{entry.client}</span>
            </div>
            <span className={styles.rowMono}>{entry.hours.toFixed(1)}h</span>
            <span className={`${styles.rowMono} ${styles.sm}`}>${Math.round(entry.hours * entry.rate)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
