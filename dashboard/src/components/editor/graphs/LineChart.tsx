"use client";

import { useState } from "react";
import styles from "./GraphBlock.module.css";

export interface LineDataPoint {
  label: string;
  value: number;
}

export default function LineChart({ title, data, height = 160 }: { title: string; data: LineDataPoint[]; height?: number }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const w = 500;
  const h = height;
  const pad = { top: 10, right: 10, bottom: 24, left: 10 };
  const maxVal = (Math.max(...data.map(d => d.value || 0)) || 1) * 1.1;
  const minVal = Math.min(...data.map(d => d.value || 0)) * 0.9;
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const points = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * chartW,
    y: pad.top + chartH - ((d.value - minVal) / (maxVal - minVal)) * chartH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${pad.top + chartH} L${points[0].x},${pad.top + chartH} Z`;

  return (
    <div className={styles.gb}>
      <div className={styles.gbHead}>
        <span className={styles.gbTitle}>{title}</span>
        <span className={styles.gbBadge}>line chart</span>
      </div>
      <svg className={styles.lineSvg} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
          const y = pad.top + chartH * (1 - frac);
          return <line key={i} x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="rgba(0,0,0,0.03)" strokeWidth="1" />;
        })}
        <defs>
          <linearGradient id="gbLineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b07d4f" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#b07d4f" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#gbLineGrad)" />
        <path d={linePath} fill="none" stroke="#b07d4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
            <circle cx={p.x} cy={p.y} r={hovered === i ? 6 : 3.5} fill={hovered === i ? "#b07d4f" : "#fff"} stroke="#b07d4f" strokeWidth="2" style={{ transition: "r 0.15s" }} />
            {hovered === i && (
              <>
                <line x1={p.x} y1={p.y} x2={p.x} y2={pad.top + chartH} stroke="#b07d4f" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
                <rect x={p.x - 40} y={p.y - 32} width="80" height="24" rx="5" fill="#2c2a25" />
                <text x={p.x} y={p.y - 16} textAnchor="middle" fill="#fff" fontSize="11" fontFamily="'JetBrains Mono', monospace" fontWeight="500">${(p.value || 0).toLocaleString()}</text>
              </>
            )}
          </g>
        ))}
        {points.map((p, i) => (
          <text key={`l${i}`} x={p.x} y={h - 4} textAnchor="middle" fill="#9b988f" fontSize="10" fontFamily="'JetBrains Mono', monospace">{p.label}</text>
        ))}
      </svg>
    </div>
  );
}
