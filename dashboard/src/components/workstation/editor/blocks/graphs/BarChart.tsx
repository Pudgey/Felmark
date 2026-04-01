"use client";

import { useState } from "react";
import { PALETTE } from "./palette";
import styles from "./GraphBlock.module.css";

export interface BarDataPoint {
  label: string;
  value: number;
  color?: string;
  sub?: string;
  current?: boolean;
}

export default function BarChart({ title, data, height = 180 }: { title: string; data: BarDataPoint[]; height?: number }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxVal = Math.max(...data.map(d => d.value || 0)) || 1;

  return (
    <div className={styles.gb}>
      <div className={styles.gbHead}>
        <span className={styles.gbTitle}>{title}</span>
        <span className={styles.gbBadge}>bar chart</span>
      </div>
      <div className={styles.barChart} style={{ height }}>
        {data.map((d, i) => {
          const h = ((d.value || 0) / maxVal) * 100;
          const isH = hovered === i;
          return (
            <div key={i} className={styles.barCol}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              {isH && (
                <div className={styles.barTooltip}>
                  <span className={styles.barTtVal}>${(d.value || 0).toLocaleString()}</span>
                  {d.sub && <span className={styles.barTtSub}>{d.sub}</span>}
                </div>
              )}
              <div className={styles.barTrack}>
                <div className={styles.bar} style={{
                  height: `${h}%`,
                  background: d.color || PALETTE[i % PALETTE.length],
                  opacity: isH ? 1 : 0.75,
                  transform: isH ? "scaleY(1.02)" : "scaleY(1)",
                }} />
              </div>
              <span className={`${styles.barLabel}${d.current ? ` ${styles.barLabelCurrent}` : ""}`}>{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
