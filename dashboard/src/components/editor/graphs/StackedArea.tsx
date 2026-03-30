"use client";

import { useState } from "react";
import { PALETTE } from "./palette";
import styles from "./GraphBlock.module.css";

export interface AreaSeries {
  label: string;
  color?: string;
  values: number[];
}

export default function StackedArea({ title, labels, series, height = 160 }: { title: string; labels: string[]; series: AreaSeries[]; height?: number }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const w = 500;
  const h = height;
  const pad = { top: 10, right: 10, bottom: 24, left: 10 };
  const n = labels.length;
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const stacked = series.map((s, si) => ({
    ...s,
    stackedValues: s.values.map((v, vi) => {
      let below = 0;
      for (let k = 0; k < si; k++) below += series[k].values[vi];
      return { base: below, top: below + v };
    }),
  }));

  const maxStack = Math.max(...labels.map((_, vi) => series.reduce((s, sr) => s + sr.values[vi], 0))) * 1.1;
  const getY = (val: number) => pad.top + chartH - (val / maxStack) * chartH;

  return (
    <div className={styles.gb}>
      <div className={styles.gbHead}>
        <span className={styles.gbTitle}>{title}</span>
        <span className={styles.gbBadge}>stacked area</span>
      </div>
      <svg className={styles.lineSvg} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => (
          <line key={i} x1={pad.left} y1={pad.top + chartH * (1 - frac)} x2={w - pad.right} y2={pad.top + chartH * (1 - frac)} stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
        ))}
        {stacked.map((s, si) => {
          const topPts = s.stackedValues.map((sv, vi) => `${pad.left + (vi / (n - 1)) * chartW},${getY(sv.top)}`).join(" ");
          const bottomPts = [...s.stackedValues].reverse().map((sv, vi) => `${pad.left + ((n - 1 - vi) / (n - 1)) * chartW},${getY(sv.base)}`).join(" ");
          return (
            <polygon key={si} points={`${topPts} ${bottomPts}`}
              fill={s.color || PALETTE[si]} opacity={hovered !== null && hovered !== si ? 0.15 : 0.25}
              style={{ transition: "opacity 0.2s", cursor: "pointer" }}
              onMouseEnter={() => setHovered(si)} onMouseLeave={() => setHovered(null)} />
          );
        })}
        {stacked.map((s, si) => {
          const path = s.stackedValues.map((sv, vi) => `${vi === 0 ? "M" : "L"}${pad.left + (vi / (n - 1)) * chartW},${getY(sv.top)}`).join(" ");
          return (
            <path key={si} d={path} fill="none" stroke={s.color || PALETTE[si]}
              strokeWidth={hovered === si ? 2.5 : 1.5} strokeLinecap="round" strokeLinejoin="round"
              opacity={hovered !== null && hovered !== si ? 0.3 : 0.8} style={{ transition: "all 0.2s" }} />
          );
        })}
        {labels.map((l, i) => (
          <text key={i} x={pad.left + (i / (n - 1)) * chartW} y={h - 4} textAnchor="middle" fill="#9b988f" fontSize="10" fontFamily="'JetBrains Mono', monospace">{l}</text>
        ))}
      </svg>
      <div className={styles.areaLegend}>
        {series.map((s, i) => (
          <div key={i} className={`${styles.areaLeg}${hovered === i ? ` ${styles.areaLegOn}` : ""}`}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <span className={styles.areaLegDot} style={{ background: s.color || PALETTE[i] }} />
            <span className={styles.areaLegLabel}>{s.label}</span>
            <span className={styles.areaLegVal}>${(s.values.reduce((a, b) => a + b, 0) / 1000).toFixed(1)}k</span>
          </div>
        ))}
      </div>
    </div>
  );
}
