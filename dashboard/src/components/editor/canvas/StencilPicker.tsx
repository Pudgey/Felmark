"use client";

import { useState, useMemo } from "react";
import type { StencilDef } from "./stencils";
import { STENCIL_CATEGORIES, STENCILS } from "./stencils";
import styles from "./StencilPicker.module.css";

interface StencilPickerProps {
  onSelect: (stencil: StencilDef) => void;
  onClose: () => void;
}

/* Clean (non-jittered) SVG renderers for stencil previews */
function previewRect(x: number, y: number, w: number, h: number) {
  return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
}

function previewEllipse(cx: number, cy: number, rx: number, ry: number) {
  let d = "";
  for (let i = 0; i <= 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    d += (i === 0 ? "M" : "L") + `${cx + Math.cos(a) * rx},${cy + Math.sin(a) * ry} `;
  }
  return d + "Z";
}

function previewDiamond(cx: number, cy: number, w: number, h: number) {
  return `M${cx},${cy - h / 2} L${cx + w / 2},${cy} L${cx},${cy + h / 2} L${cx - w / 2},${cy} Z`;
}

function previewLine(x1: number, y1: number, x2: number, y2: number) {
  return `M${x1},${y1} L${x2},${y2}`;
}

function previewArrowHead(x2: number, y2: number, x1: number, y1: number, size = 8) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return `M${x2 + Math.cos(a + Math.PI * 0.82) * size},${y2 + Math.sin(a + Math.PI * 0.82) * size} L${x2},${y2} L${x2 + Math.cos(a - Math.PI * 0.82) * size},${y2 + Math.sin(a - Math.PI * 0.82) * size}`;
}

function renderPreviewEl(el: StencilDef["elements"][number], idx: number) {
  const s = { stroke: el.strokeColor, strokeWidth: el.strokeWidth, fill: el.fillColor || "transparent" };
  if (el.type === "rect") {
    const ex = Math.min(el.x, el.x + (el.w || 0));
    const ey = Math.min(el.y, el.y + (el.h || 0));
    return <path key={idx} d={previewRect(ex, ey, Math.abs(el.w || 0), Math.abs(el.h || 0))} {...s} strokeLinecap="round" strokeLinejoin="round" />;
  }
  if (el.type === "circle") {
    return <path key={idx} d={previewEllipse(el.x + (el.w || 0) / 2, el.y + (el.h || 0) / 2, Math.abs((el.w || 0) / 2), Math.abs((el.h || 0) / 2))} {...s} strokeLinecap="round" strokeLinejoin="round" />;
  }
  if (el.type === "diamond") {
    return <path key={idx} d={previewDiamond(el.x + (el.w || 0) / 2, el.y + (el.h || 0) / 2, Math.abs(el.w || 0), Math.abs(el.h || 0))} {...s} strokeLinecap="round" strokeLinejoin="round" />;
  }
  if (el.type === "line" || el.type === "arrow") {
    const x2 = el.x + (el.w || 0);
    const y2 = el.y + (el.h || 0);
    return (
      <g key={idx}>
        <path d={previewLine(el.x, el.y, x2, y2)} fill="none" stroke={el.strokeColor} strokeWidth={el.strokeWidth} strokeLinecap="round" />
        {el.type === "arrow" && (
          <path d={previewArrowHead(x2, y2, el.x, el.y, 6 + el.strokeWidth)} fill="none" stroke={el.strokeColor} strokeWidth={el.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        )}
      </g>
    );
  }
  if (el.type === "text") {
    return <text key={idx} x={el.x} y={el.y} fill={el.strokeColor} fontSize={el.fontSize || 11} fontFamily="'Outfit',sans-serif" dominantBaseline="hanging">{el.text}</text>;
  }
  return null;
}

function StencilPreview({ stencil }: { stencil: StencilDef }) {
  // Calculate bounding box
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const el of stencil.elements) {
    const ex = el.x;
    const ey = el.y;
    const ew = Math.abs(el.w || 0) || 8;
    const eh = Math.abs(el.h || 0) || (el.fontSize || 12);
    minX = Math.min(minX, ex, ex + (el.w || 0));
    minY = Math.min(minY, ey, ey + (el.h || 0));
    maxX = Math.max(maxX, ex + ew, ex);
    maxY = Math.max(maxY, ey + eh, ey);
  }
  const pad = 4;
  const vw = maxX - minX + pad * 2;
  const vh = maxY - minY + pad * 2;

  return (
    <svg
      viewBox={`${minX - pad} ${minY - pad} ${vw} ${vh}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      {stencil.elements.map((el, i) => renderPreviewEl(el, i))}
    </svg>
  );
}

export default function StencilPicker({ onSelect, onClose }: StencilPickerProps) {
  const [category, setCategory] = useState(STENCIL_CATEGORIES[0].id);

  const filtered = useMemo(
    () => STENCILS.filter((s) => s.category === category),
    [category],
  );

  return (
    <div className={styles.picker}>
      <button className={styles.close} onClick={onClose} title="Close">✕</button>
      <div className={styles.tabs}>
        {STENCIL_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.tab} ${category === cat.id ? styles.tabOn : ""}`}
            onClick={() => setCategory(cat.id)}
          >
            <span className={styles.tabIcon}>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>
      <div className={styles.grid}>
        {filtered.map((stencil) => (
          <button
            key={stencil.id}
            className={styles.item}
            onClick={() => onSelect(stencil)}
            title={stencil.name}
          >
            <div className={styles.preview}>
              <StencilPreview stencil={stencil} />
            </div>
            <span className={styles.label}>{stencil.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
