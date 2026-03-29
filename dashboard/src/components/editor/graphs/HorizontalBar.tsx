"use client";

import { useState } from "react";
import { PALETTE } from "./palette";
import styles from "./GraphBlock.module.css";

export interface HBarDataPoint {
  label: string;
  value: number;
  unit?: string;
  color?: string;
}

export default function HorizontalBar({ title, data }: { title: string; data: HBarDataPoint[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxVal = Math.max(...data.map(d => d.value || 0)) || 1;

  return (
    <div className={styles.gb}>
      <div className={styles.gbHead}>
        <span className={styles.gbTitle}>{title}</span>
        <span className={styles.gbBadge}>horizontal bar</span>
      </div>
      <div className={styles.hbarList}>
        {data.map((d, i) => {
          const pct = ((d.value || 0) / maxVal) * 100;
          return (
            <div key={i} className={`${styles.hbarRow}${hovered === i ? ` ${styles.hbarRowOn}` : ""}`}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <span className={styles.hbarLabel}>{d.label}</span>
              <div className={styles.hbarTrack}>
                <div className={styles.hbarFill} style={{
                  width: `${pct}%`,
                  background: d.color || PALETTE[i % PALETTE.length],
                  opacity: hovered === i ? 1 : 0.7,
                }} />
              </div>
              <span className={styles.hbarVal}>{d.value}{d.unit || ""}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
