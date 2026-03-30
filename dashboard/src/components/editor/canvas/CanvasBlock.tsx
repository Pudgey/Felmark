"use client";

import { useState, useRef, useCallback } from "react";
import type { CanvasBlockData, CanvasElement } from "@/lib/types";
import type { StencilDef } from "./stencils";
import StencilPicker from "./StencilPicker";
import styles from "./CanvasBlock.module.css";

interface CanvasBlockProps {
  data: CanvasBlockData;
  onUpdate: (data: CanvasBlockData) => void;
}

const COLORS = ["#2c2a25", "#b07d4f", "#c24b38", "#5a9a3c", "#5b7fa4", "#7c6b9e", "#8a7e63", "#b8b3a8"];
const TOOLS = [
  { id: "select", icon: "↖" }, { id: "rect", icon: "□" }, { id: "circle", icon: "○" },
  { id: "diamond", icon: "◇" }, { id: "line", icon: "╱" }, { id: "arrow", icon: "→" },
  { id: "draw", icon: "✎" }, { id: "text", icon: "T" },
];

let nextCanvasId = 1;

function jitter(v: number, amount = 1.5) { return v + (Math.random() - 0.5) * amount; }

function sketchyRect(x: number, y: number, w: number, h: number) {
  const r = 1.5;
  const pts = [[jitter(x,r),jitter(y,r)],[jitter(x+w,r),jitter(y,r)],[jitter(x+w,r),jitter(y+h,r)],[jitter(x,r),jitter(y+h,r)]];
  return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]} L${pts[2][0]},${pts[2][1]} L${pts[3][0]},${pts[3][1]} Z`;
}

function sketchyEllipse(cx: number, cy: number, rx: number, ry: number) {
  let d = "";
  for (let i = 0; i <= 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    const px = cx + Math.cos(a) * rx + (Math.random() - 0.5) * 1.5;
    const py = cy + Math.sin(a) * ry + (Math.random() - 0.5) * 1.5;
    d += (i === 0 ? "M" : "L") + `${px},${py} `;
  }
  return d + "Z";
}

function sketchyDiamond(cx: number, cy: number, w: number, h: number) {
  const r = 1.5;
  const pts = [[jitter(cx,r),jitter(cy-h/2,r)],[jitter(cx+w/2,r),jitter(cy,r)],[jitter(cx,r),jitter(cy+h/2,r)],[jitter(cx-w/2,r),jitter(cy,r)]];
  return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]} L${pts[2][0]},${pts[2][1]} L${pts[3][0]},${pts[3][1]} Z`;
}

function sketchyLine(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1+x2)/2 + (Math.random()-0.5)*2, my = (y1+y2)/2 + (Math.random()-0.5)*2;
  return `M${jitter(x1,1)},${jitter(y1,1)} Q${mx},${my} ${jitter(x2,1)},${jitter(y2,1)}`;
}

function arrowHead(x2: number, y2: number, x1: number, y1: number, size = 12) {
  const a = Math.atan2(y2-y1,x2-x1);
  return `M${x2+Math.cos(a+Math.PI*0.82)*size},${y2+Math.sin(a+Math.PI*0.82)*size} L${x2},${y2} L${x2+Math.cos(a-Math.PI*0.82)*size},${y2+Math.sin(a-Math.PI*0.82)*size}`;
}

function smoothPath(pts: number[][]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const cx = (pts[i][0]+pts[i+1][0])/2, cy = (pts[i][1]+pts[i+1][1])/2;
    d += ` Q${pts[i][0]},${pts[i][1]} ${cx},${cy}`;
  }
  d += ` L${pts[pts.length-1][0]},${pts[pts.length-1][1]}`;
  return d;
}

function renderEl(el: CanvasElement) {
  const s = { stroke: el.strokeColor, strokeWidth: el.strokeWidth, fill: el.fillColor || "transparent" };
  if (el.type === "rect") return <path key={el.id} d={sketchyRect(Math.min(el.x,el.x+(el.w||0)),Math.min(el.y,el.y+(el.h||0)),Math.abs(el.w||0),Math.abs(el.h||0))} {...s} strokeLinecap="round" strokeLinejoin="round" />;
  if (el.type === "circle") return <path key={el.id} d={sketchyEllipse(el.x+(el.w||0)/2,el.y+(el.h||0)/2,Math.abs((el.w||0)/2),Math.abs((el.h||0)/2))} {...s} strokeLinecap="round" strokeLinejoin="round" />;
  if (el.type === "diamond") return <path key={el.id} d={sketchyDiamond(el.x+(el.w||0)/2,el.y+(el.h||0)/2,Math.abs(el.w||0),Math.abs(el.h||0))} {...s} strokeLinecap="round" strokeLinejoin="round" />;
  if (el.type === "line" || el.type === "arrow") {
    const x2 = el.x+(el.w||0), y2 = el.y+(el.h||0);
    return <g key={el.id}><path d={sketchyLine(el.x,el.y,x2,y2)} fill="none" stroke={el.strokeColor} strokeWidth={el.strokeWidth} strokeLinecap="round" />{el.type === "arrow" && <path d={arrowHead(x2,y2,el.x,el.y,10+el.strokeWidth*2)} fill="none" stroke={el.strokeColor} strokeWidth={el.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />}</g>;
  }
  if (el.type === "draw" && el.points) return <path key={el.id} d={smoothPath(el.points)} fill="none" stroke={el.strokeColor} strokeWidth={el.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />;
  if (el.type === "text") return <text key={el.id} x={el.x} y={el.y} fill={el.strokeColor} fontSize={el.fontSize||16} fontFamily="'Outfit',sans-serif" dominantBaseline="hanging">{el.text}</text>;
  return null;
}

export function getDefaultCanvasData(): CanvasBlockData {
  return { elements: [] };
}

export default function CanvasBlock({ data, onUpdate }: CanvasBlockProps) {
  const [tool, setTool] = useState("draw");
  const [color, setColor] = useState("#2c2a25");
  const [drawing, setDrawing] = useState(false);
  const [current, setCurrent] = useState<CanvasElement | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showStencils, setShowStencils] = useState(false);
  const [textInput, setTextInput] = useState<{ x: number; y: number } | null>(null);
  const [textValue, setTextValue] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLInputElement>(null);

  const getPos = (e: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleDown = (e: React.PointerEvent) => {
    const pos = getPos(e);
    if (tool === "text") { setTextInput(pos); setTextValue(""); setTimeout(() => textRef.current?.focus(), 50); return; }
    if (tool === "select") {
      let found: number | null = null;
      for (let i = data.elements.length - 1; i >= 0; i--) {
        const el = data.elements[i];
        const ex = Math.min(el.x, el.x+(el.w||0)), ey = Math.min(el.y, el.y+(el.h||0));
        const ew = Math.abs(el.w||0) || 20, eh = Math.abs(el.h||0) || 20;
        if (pos.x >= ex-8 && pos.x <= ex+ew+8 && pos.y >= ey-8 && pos.y <= ey+eh+8) { found = el.id; break; }
      }
      setSelectedId(found);
      return;
    }
    setDrawing(true);
    const id = nextCanvasId++;
    if (tool === "draw") setCurrent({ id, type: "draw", x: pos.x, y: pos.y, strokeColor: color, fillColor: "transparent", strokeWidth: 2, points: [[pos.x, pos.y]] });
    else setCurrent({ id, type: tool, x: pos.x, y: pos.y, w: 0, h: 0, strokeColor: color, fillColor: "transparent", strokeWidth: 2 });
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!drawing || !current) return;
    const pos = getPos(e);
    if (current.type === "draw") setCurrent(prev => prev ? { ...prev, points: [...(prev.points||[]), [pos.x, pos.y]] } : null);
    else setCurrent(prev => prev ? { ...prev, w: pos.x - prev.x, h: pos.y - prev.y } : null);
  };

  const handleUp = () => {
    if (!drawing || !current) { setDrawing(false); return; }
    setDrawing(false);
    if (current.type === "draw" && (current.points?.length || 0) < 3) { setCurrent(null); return; }
    if (current.type !== "draw" && Math.abs(current.w||0) < 4 && Math.abs(current.h||0) < 4) { setCurrent(null); return; }
    onUpdate({ elements: [...data.elements, current] });
    setCurrent(null);
  };

  const submitText = () => {
    if (textValue.trim() && textInput) {
      const el: CanvasElement = { id: nextCanvasId++, type: "text", x: textInput.x, y: textInput.y, strokeColor: color, fillColor: "transparent", strokeWidth: 0, text: textValue.trim(), fontSize: 16 };
      onUpdate({ elements: [...data.elements, el] });
    }
    setTextInput(null); setTextValue("");
  };

  const deleteSelected = useCallback(() => {
    if (selectedId === null) return;
    onUpdate({ elements: data.elements.filter(e => e.id !== selectedId) });
    setSelectedId(null);
  }, [selectedId, data, onUpdate]);

  const stampStencil = useCallback((stencil: StencilDef) => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    const canvasW = svgRect?.width || 600;
    const canvasH = 160;
    // Find bounding box of stencil template elements
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const el of stencil.elements) {
      const ew = Math.abs(el.w || 0) || 8;
      const eh = Math.abs(el.h || 0) || (el.fontSize || 12);
      minX = Math.min(minX, el.x, el.x + (el.w || 0));
      minY = Math.min(minY, el.y, el.y + (el.h || 0));
      maxX = Math.max(maxX, el.x + ew, el.x);
      maxY = Math.max(maxY, el.y + eh, el.y);
    }
    const groupW = maxX - minX;
    const groupH = maxY - minY;
    const offsetX = canvasW / 2 - groupW / 2 - minX;
    const offsetY = canvasH - groupH / 2 - minY;
    const newEls: CanvasElement[] = stencil.elements.map((tmpl) => ({
      ...tmpl,
      id: nextCanvasId++,
      x: tmpl.x + offsetX,
      y: tmpl.y + offsetY,
      ...(tmpl.points ? { points: tmpl.points.map(([px, py]) => [px + offsetX, py + offsetY]) } : {}),
    }));
    onUpdate({ elements: [...data.elements, ...newEls] });
    setShowStencils(false);
    setTool("select");
  }, [data, onUpdate]);

  return (
    <div className={styles.block}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        {TOOLS.map(t => (
          <button key={t.id} className={`${styles.toolBtn} ${tool === t.id ? styles.toolOn : ""}`} onClick={() => setTool(t.id)}>{t.icon}</button>
        ))}
        <span className={styles.sep} />
        {COLORS.slice(0, 6).map(c => (
          <div key={c} className={`${styles.colorDot} ${color === c ? styles.colorOn : ""}`} style={{ background: c }} onClick={() => setColor(c)} />
        ))}
        <span className={styles.sep} />
        {selectedId !== null && <button className={styles.delBtn} onClick={deleteSelected}>Del</button>}
        <button className={styles.toolBtn} onClick={() => onUpdate({ elements: [] })}>Clear</button>
        <button className={`${styles.toolBtn} ${showStencils ? styles.toolOn : ""}`} onClick={() => setShowStencils(v => !v)} title="Stencils">⬡</button>
        <span className={styles.count}>{data.elements.length}</span>
      </div>

      {/* Canvas */}
      <div className={styles.canvas} style={{ cursor: tool === "select" ? "default" : tool === "text" ? "text" : "crosshair" }}>
        <svg ref={svgRef} width="100%" height="100%" onPointerDown={handleDown} onPointerMove={handleMove} onPointerUp={handleUp}>
          {/* Grid */}
          <defs><pattern id="canvasGrid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.4" fill="var(--ink-300)" opacity="0.3" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#canvasGrid)" />
          {data.elements.map(el => renderEl(el))}
          {current && renderEl(current)}
          {/* Selection indicator */}
          {selectedId !== null && (() => {
            const sel = data.elements.find(e => e.id === selectedId);
            if (!sel || sel.type === "draw" || sel.type === "text") return null;
            const sx = Math.min(sel.x, sel.x+(sel.w||0))-4, sy = Math.min(sel.y, sel.y+(sel.h||0))-4;
            const sw = Math.abs(sel.w||0)+8, sh = Math.abs(sel.h||0)+8;
            return <rect x={sx} y={sy} width={sw} height={sh} fill="none" stroke="var(--ember)" strokeWidth="1" strokeDasharray="4 3" />;
          })()}
        </svg>
        {textInput && <input ref={textRef} className={styles.textInput} style={{ left: textInput.x, top: textInput.y }} value={textValue} onChange={e => setTextValue(e.target.value)} onKeyDown={e => { if (e.key === "Enter") submitText(); if (e.key === "Escape") { setTextInput(null); setTextValue(""); }}} onBlur={submitText} placeholder="Type..." />}
        {showStencils && <StencilPicker onSelect={stampStencil} onClose={() => setShowStencils(false)} />}
      </div>
    </div>
  );
}
