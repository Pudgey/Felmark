"use client";

import { useState } from "react";
import { PALETTE } from "./palette";
import styles from "./GraphBlock.module.css";

export interface DonutDataPoint {
  label: string;
  value: number;
  color?: string;
}

export default function DonutChart({
  title,
  data,
  size = 140,
}: {
  title: string;
  data: DonutDataPoint[];
  size?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1; // guard against 0
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeW = size * 0.12;
  const circ = 2 * Math.PI * r;

  // Precompute offsets for each segment to avoid mutation during render
  const segmentOffsets: number[] = [];
  {
    let cur = circ * 0.25;
    data.forEach((d) => {
      segmentOffsets.push(cur);
      cur -= circ * ((d.value || 0) / total);
    });
  }

  return (
    <div className={styles.gb}>
      <div className={styles.gbHead}>
        <span className={styles.gbTitle}>{title}</span>
        <span className={styles.gbBadge}>donut</span>
      </div>
      <div className={styles.donutLayout}>
        <div className={styles.donutRingWrap} style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="color-mix(in srgb, var(--ink-900) 3%, transparent)"
              strokeWidth={strokeW}
            />
            {data.map((d, i) => {
              const pct = (d.value || 0) / total;
              const dash = circ * pct;
              const gap = circ - dash;
              const thisOffset = segmentOffsets[i];
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={d.color || PALETTE[i]}
                  strokeWidth={hovered === i ? strokeW + 4 : strokeW}
                  strokeDasharray={`${dash - 2} ${gap + 2}`}
                  strokeDashoffset={-thisOffset}
                  strokeLinecap="butt"
                  opacity={hovered !== null && hovered !== i ? 0.3 : 1}
                  style={{ transition: "all 0.2s", cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}
          </svg>
          <div className={styles.donutCenter}>
            {hovered !== null ? (
              <>
                <span className={styles.donutCenterVal} style={{ color: data[hovered].color || PALETTE[hovered] }}>
                  {Math.round(((data[hovered]?.value || 0) / total) * 100)}%
                </span>
                <span className={styles.donutCenterLabel}>{data[hovered].label}</span>
              </>
            ) : (
              <>
                <span className={styles.donutCenterVal}>${(total / 1000).toFixed(1)}k</span>
                <span className={styles.donutCenterLabel}>total</span>
              </>
            )}
          </div>
        </div>
        <div className={styles.donutLegend}>
          {data.map((d, i) => (
            <div
              key={i}
              className={`${styles.donutLegItem}${hovered === i ? ` ${styles.donutLegItemOn}` : ""}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className={styles.donutLegDot} style={{ background: d.color || PALETTE[i] }} />
              <span className={styles.donutLegLabel}>{d.label}</span>
              <span className={styles.donutLegVal}>${((d.value || 0) / 1000).toFixed(1)}k</span>
              <span className={styles.donutLegPct}>{Math.round(((d.value || 0) / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
