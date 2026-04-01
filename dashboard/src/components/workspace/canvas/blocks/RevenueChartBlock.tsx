"use client";

import type { RenderBlock } from "../types";
import styles from "./RevenueChartBlock.module.css";

const MONTHS = [
  { label: "Oct", value: 8200 },
  { label: "Nov", value: 9400 },
  { label: "Dec", value: 7800 },
  { label: "Jan", value: 11200 },
  { label: "Feb", value: 12600 },
  { label: "Mar", value: 14800 },
];

const CLIENTS = [
  { name: "Meridian", avatar: "M", color: "#7c8594", value: 12400 },
  { name: "Nora Kim", avatar: "N", color: "#a08472", value: 8200 },
  { name: "Bolt Fitness", avatar: "B", color: "#8a7e63", value: 6000 },
  { name: "Others", avatar: "+", color: "#b5b2a9", value: 2400 },
];

const TOTAL = MONTHS.reduce((s, m) => s + m.value, 0);
const MAX_VAL = Math.max(...MONTHS.map((m) => m.value));
const MAX_CLIENT = Math.max(...CLIENTS.map((c) => c.value));

/* SVG chart dimensions */
const W = 320;
const H = 80;
const PX = 10;
const PY = 8;

function buildPath(closed: boolean): string {
  const step = (W - PX * 2) / (MONTHS.length - 1);
  const points = MONTHS.map((m, i) => {
    const x = PX + i * step;
    const y = PY + (H - PY * 2) * (1 - m.value / (MAX_VAL * 1.15));
    return `${x},${y}`;
  });
  if (closed) {
    return `M${PX},${H - PY} L${points.join(" L")} L${W - PX},${H - PY} Z`;
  }
  return `M${points.join(" L")}`;
}

export default function RevenueChartBlock({ block }: { block: RenderBlock }) {
  const step = (W - PX * 2) / (MONTHS.length - 1);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Revenue</span>
        <span className={styles.period}>Last 6 months</span>
        <span className={styles.total}>${(TOTAL / 1000).toFixed(1)}k</span>
      </div>

      <div className={styles.chart}>
        <svg
          className={styles.chartSvg}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6b9a6b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6b9a6b" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <path d={buildPath(true)} fill="url(#revGrad)" />
          <path d={buildPath(false)} fill="none" stroke="#6b9a6b" strokeWidth="2" strokeLinecap="round" />
          {MONTHS.map((m, i) => {
            const x = PX + i * step;
            const y = PY + (H - PY * 2) * (1 - m.value / (MAX_VAL * 1.15));
            return (
              <circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke="#6b9a6b" strokeWidth="1.5" />
            );
          })}
        </svg>
        <div className={styles.chartLabels}>
          {MONTHS.map((m) => (
            <span key={m.label} className={styles.chartLabel}>{m.label}</span>
          ))}
        </div>
      </div>

      <div className={styles.sectionTitle}>By client</div>
      <div className={styles.clients}>
        {CLIENTS.map((c, i) => (
          <div key={i} className={styles.clientRow}>
            <div className={styles.clientAvatar} style={{ background: c.color }}>
              {c.avatar}
            </div>
            <span className={styles.clientName}>{c.name}</span>
            <div className={styles.clientBar}>
              <div
                className={styles.clientBarFill}
                style={{
                  width: `${(c.value / MAX_CLIENT) * 100}%`,
                  background: c.color,
                }}
              />
            </div>
            <span className={styles.clientValue}>${(c.value / 1000).toFixed(1)}k</span>
          </div>
        ))}
      </div>
    </div>
  );
}
