"use client";

import { PALETTE } from "./palette";
import styles from "./GraphBlock.module.css";

export interface SparklineData {
  label: string;
  values: number[];
  current: string;
  change: number;
  color?: string;
}

export default function SparklineRow({ title, data }: { title: string; data: SparklineData[] }) {
  return (
    <div className={styles.gb}>
      <div className={styles.gbHead}>
        <span className={styles.gbTitle}>{title}</span>
        <span className={styles.gbBadge}>sparkline</span>
      </div>
      <div className={styles.sparkRows}>
        {data.map((row, ri) => {
          const max = Math.max(...row.values);
          const w = 120;
          const h = 28;
          const points = row.values.map((v, i) => {
            const x = (i / (row.values.length - 1)) * w;
            const y = h - (v / max) * h * 0.8 - h * 0.1;
            return `${x},${y}`;
          }).join(" ");
          const lastPt = points.split(" ").pop()!.split(",");

          return (
            <div key={ri} className={styles.sparkRow}>
              <span className={styles.sparkLabel}>{row.label}</span>
              <svg className={styles.sparkSvg} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                <polyline points={points} fill="none" stroke={row.color || PALETTE[ri]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={lastPt[0]} cy={lastPt[1]} r="3" fill={row.color || PALETTE[ri]} />
              </svg>
              <span className={styles.sparkVal} style={{ color: row.color || PALETTE[ri] }}>{row.current}</span>
              <span className={`${styles.sparkChange} ${row.change >= 0 ? styles.sparkUp : styles.sparkDown}`}>
                {row.change >= 0 ? "+" : ""}{row.change}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
