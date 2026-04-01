"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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

/* ── Geometry helpers ── */

interface Box { x: number; y: number; w: number; h: number }

function getBBox(el: CanvasElement): Box {
  if (el.type === "draw" && el.points?.length) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const [px, py] of el.points) {
      minX = Math.min(minX, px); minY = Math.min(minY, py);
      maxX = Math.max(maxX, px); maxY = Math.max(maxY, py);
    }
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
  }
  if (el.type === "text") {
    const w = (el.text?.length || 1) * (el.fontSize || 16) * 0.6;
    const h = (el.fontSize || 16) * 1.2;
    return { x: el.x, y: el.y, w, h };
  }
  // shapes, line, arrow
  const x = Math.min(el.x, el.x + (el.w || 0));
  const y = Math.min(el.y, el.y + (el.h || 0));
  return { x, y, w: Math.abs(el.w || 0), h: Math.abs(el.h || 0) };
}

function rectsIntersect(a: Box, b: Box): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function hitTest(pos: { x: number; y: number }, elements: CanvasElement[]): number | null {
  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i];
    const bb = getBBox(el);
    const pad = 8;
    if (
      pos.x >= bb.x - pad &&
      pos.x <= bb.x + Math.max(bb.w, 4) + pad &&
      pos.y >= bb.y - pad &&
      pos.y <= bb.y + Math.max(bb.h, 4) + pad
    ) {
      return el.id;
    }
  }
  return null;
}

function moveElement(el: CanvasElement, dx: number, dy: number): CanvasElement {
  const moved = { ...el, x: el.x + dx, y: el.y + dy };
  if (el.type === "draw" && el.points) {
    moved.points = el.points.map(([px, py]) => [px + dx, py + dy]);
  }
  return moved;
}

/* ── Sketchy rendering ── */

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

/* ── Selection indicator for any element ── */

function renderSelectionBox(el: CanvasElement) {
  const bb = getBBox(el);
  const pad = 4;
  return (
    <rect
      key={`sel-${el.id}`}
      x={bb.x - pad}
      y={bb.y - pad}
      width={Math.max(bb.w, 4) + pad * 2}
      height={Math.max(bb.h, 4) + pad * 2}
      fill="none"
      stroke="var(--ember)"
      strokeWidth="1"
      strokeDasharray="4 3"
      pointerEvents="none"
    />
  );
}

/* ── Drag state (ref-based for perf) ── */

interface DragState {
  type: "move" | "rubberband";
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  movingIds: Set<number>;
  originals: Map<number, { x: number; y: number; points?: number[][] }>;
}

/* ── Main component ── */

export function getDefaultCanvasData(): CanvasBlockData {
  return { elements: [] };
}

export default function CanvasBlock({ data, onUpdate }: CanvasBlockProps) {
  const [tool, setTool] = useState("draw");
  const [color, setColor] = useState("#2c2a25");
  const [drawing, setDrawing] = useState(false);
  const [current, setCurrent] = useState<CanvasElement | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showStencils, setShowStencils] = useState(false);
  const [textInput, setTextInput] = useState<{ x: number; y: number } | null>(null);
  const [textValue, setTextValue] = useState("");
  const [rubberBand, setRubberBand] = useState<Box | null>(null);
  const [movingElements, setMovingElements] = useState<CanvasElement[] | null>(null);
  const [hoverCursor, setHoverCursor] = useState<string>("default");

  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  // Elements to render: use movingElements during drag, otherwise data.elements
  const renderElements = movingElements ?? data.elements;

  const getPos = (e: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  /* ── Pointer handlers ── */

  const handleDown = (e: React.PointerEvent) => {
    const pos = getPos(e);
    const shiftKey = e.shiftKey;

    if (tool === "text") {
      setTextInput(pos);
      setTextValue("");
      setTimeout(() => textRef.current?.focus(), 50);
      return;
    }

    if (tool === "select") {
      const hitId = hitTest(pos, data.elements);

      if (hitId !== null) {
        // Determine selection set after this click
        let newSelection: Set<number>;
        if (shiftKey) {
          newSelection = new Set(selectedIds);
          if (newSelection.has(hitId)) {
            newSelection.delete(hitId);
            setSelectedIds(newSelection);
            return;
          }
          newSelection.add(hitId);
        } else if (selectedIds.has(hitId)) {
          newSelection = new Set(selectedIds);
        } else {
          newSelection = new Set([hitId]);
        }
        setSelectedIds(newSelection);

        // Build originals snapshot for move
        const originals = new Map<number, { x: number; y: number; points?: number[][] }>();
        for (const el of data.elements) {
          if (newSelection.has(el.id)) {
            originals.set(el.id, {
              x: el.x,
              y: el.y,
              points: el.points ? el.points.map(p => [...p]) : undefined,
            });
          }
        }

        dragRef.current = {
          type: "move",
          startX: pos.x,
          startY: pos.y,
          lastX: pos.x,
          lastY: pos.y,
          movingIds: newSelection,
          originals,
        };

        (e.target as Element).setPointerCapture?.(e.pointerId);
        return;
      }

      // Clicked empty space — rubber band
      if (!shiftKey) {
        setSelectedIds(new Set());
      }
      dragRef.current = {
        type: "rubberband",
        startX: pos.x,
        startY: pos.y,
        lastX: pos.x,
        lastY: pos.y,
        movingIds: new Set(),
        originals: new Map(),
      };
      (e.target as Element).setPointerCapture?.(e.pointerId);
      return;
    }

    // Drawing tools
    setDrawing(true);
    const id = nextCanvasId++;
    if (tool === "draw") {
      setCurrent({ id, type: "draw", x: pos.x, y: pos.y, strokeColor: color, fillColor: "transparent", strokeWidth: 2, points: [[pos.x, pos.y]] });
    } else {
      setCurrent({ id, type: tool, x: pos.x, y: pos.y, w: 0, h: 0, strokeColor: color, fillColor: "transparent", strokeWidth: 2 });
    }
  };

  const handleMove = (e: React.PointerEvent) => {
    const pos = getPos(e);

    // Drag state handling (select tool)
    if (dragRef.current) {
      const drag = dragRef.current;
      drag.lastX = pos.x;
      drag.lastY = pos.y;

      if (drag.type === "move") {
        const dx = pos.x - drag.startX;
        const dy = pos.y - drag.startY;
        const updated = data.elements.map(el => {
          const orig = drag.originals.get(el.id);
          if (!orig) return el;
          const moved: CanvasElement = { ...el, x: orig.x + dx, y: orig.y + dy };
          if (el.type === "draw" && orig.points) {
            moved.points = orig.points.map(([px, py]) => [px + dx, py + dy]);
          }
          return moved;
        });
        setMovingElements(updated);
      } else if (drag.type === "rubberband") {
        const rx = Math.min(drag.startX, pos.x);
        const ry = Math.min(drag.startY, pos.y);
        const rw = Math.abs(pos.x - drag.startX);
        const rh = Math.abs(pos.y - drag.startY);
        setRubberBand({ x: rx, y: ry, w: rw, h: rh });
      }
      return;
    }

    // Hover cursor for select tool (only when idle)
    if (tool === "select" && !drawing) {
      const hitId = hitTest(pos, data.elements);
      const newCursor = hitId !== null ? "move" : "default";
      if (newCursor !== hoverCursor) setHoverCursor(newCursor);
      return;
    }

    // Drawing tool move
    if (!drawing || !current) return;
    if (current.type === "draw") {
      setCurrent(prev => prev ? { ...prev, points: [...(prev.points || []), [pos.x, pos.y]] } : null);
    } else {
      setCurrent(prev => prev ? { ...prev, w: pos.x - prev.x, h: pos.y - prev.y } : null);
    }
  };

  const handleUp = (e: React.PointerEvent) => {
    // Handle drag end
    if (dragRef.current) {
      const drag = dragRef.current;
      const shiftKey = e.shiftKey;

      if (drag.type === "move" && movingElements) {
        onUpdate({ elements: movingElements });
        setMovingElements(null);
      } else if (drag.type === "rubberband" && rubberBand) {
        if (rubberBand.w > 2 || rubberBand.h > 2) {
          const hit = new Set<number>(shiftKey ? selectedIds : []);
          for (const el of data.elements) {
            const bb = getBBox(el);
            const elBox: Box = { x: bb.x, y: bb.y, w: Math.max(bb.w, 4), h: Math.max(bb.h, 4) };
            if (rectsIntersect(rubberBand, elBox)) {
              hit.add(el.id);
            }
          }
          setSelectedIds(hit);
        }
        setRubberBand(null);
      }

      dragRef.current = null;
      return;
    }

    // Drawing tool up
    if (!drawing || !current) { setDrawing(false); return; }
    setDrawing(false);
    if (current.type === "draw" && (current.points?.length || 0) < 3) { setCurrent(null); return; }
    if (current.type !== "draw" && Math.abs(current.w || 0) < 4 && Math.abs(current.h || 0) < 4) { setCurrent(null); return; }
    onUpdate({ elements: [...data.elements, current] });
    setCurrent(null);
  };

  /* ── Text input ── */

  const submitText = () => {
    if (textValue.trim() && textInput) {
      const el: CanvasElement = {
        id: nextCanvasId++, type: "text", x: textInput.x, y: textInput.y,
        strokeColor: color, fillColor: "transparent", strokeWidth: 0,
        text: textValue.trim(), fontSize: 16,
      };
      onUpdate({ elements: [...data.elements, el] });
    }
    setTextInput(null);
    setTextValue("");
  };

  /* ── Actions ── */

  const deleteSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    onUpdate({ elements: data.elements.filter(e => !selectedIds.has(e.id)) });
    setSelectedIds(new Set());
  }, [selectedIds, data, onUpdate]);

  const bringForward = useCallback(() => {
    if (selectedIds.size === 0) return;
    const sel = data.elements.filter(e => selectedIds.has(e.id));
    const rest = data.elements.filter(e => !selectedIds.has(e.id));
    onUpdate({ elements: [...rest, ...sel] });
  }, [selectedIds, data, onUpdate]);

  const sendBackward = useCallback(() => {
    if (selectedIds.size === 0) return;
    const sel = data.elements.filter(e => selectedIds.has(e.id));
    const rest = data.elements.filter(e => !selectedIds.has(e.id));
    onUpdate({ elements: [...sel, ...rest] });
  }, [selectedIds, data, onUpdate]);

  const duplicateSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    const dupes: CanvasElement[] = [];
    for (const el of data.elements) {
      if (selectedIds.has(el.id)) {
        dupes.push(moveElement({ ...el, id: nextCanvasId++ }, 10, 10));
      }
    }
    const newIds = new Set(dupes.map(d => d.id));
    onUpdate({ elements: [...data.elements, ...dupes] });
    setSelectedIds(newIds);
  }, [selectedIds, data, onUpdate]);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(data.elements.map(e => e.id)));
  }, [data.elements]);

  const nudge = useCallback((dx: number, dy: number) => {
    if (selectedIds.size === 0) return;
    const updated = data.elements.map(el =>
      selectedIds.has(el.id) ? moveElement(el, dx, dy) : el
    );
    onUpdate({ elements: updated });
  }, [selectedIds, data, onUpdate]);

  /* ── Keyboard shortcuts ── */

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (textInput) return;

    const mod = e.metaKey || e.ctrlKey;
    const step = e.shiftKey ? 10 : 1;

    switch (e.key) {
      case "Delete":
      case "Backspace":
        if (selectedIds.size > 0) { e.preventDefault(); deleteSelected(); }
        break;
      case "ArrowUp":
        if (selectedIds.size > 0) { e.preventDefault(); nudge(0, -step); }
        break;
      case "ArrowDown":
        if (selectedIds.size > 0) { e.preventDefault(); nudge(0, step); }
        break;
      case "ArrowLeft":
        if (selectedIds.size > 0) { e.preventDefault(); nudge(-step, 0); }
        break;
      case "ArrowRight":
        if (selectedIds.size > 0) { e.preventDefault(); nudge(step, 0); }
        break;
      case "a":
        if (mod) { e.preventDefault(); selectAll(); }
        break;
      case "d":
        if (mod) { e.preventDefault(); duplicateSelected(); }
        break;
      case "Escape":
        setSelectedIds(new Set());
        break;
    }
  }, [selectedIds, textInput, deleteSelected, nudge, selectAll, duplicateSelected]);

  /* ── Stencil stamping ── */

  const stampStencil = useCallback((stencil: StencilDef) => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    const canvasW = svgRect?.width || 600;
    const canvasH = 160;
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

  /* ── Cursor logic ── */

  const getCursor = (): string => {
    if (tool !== "select") return tool === "text" ? "text" : "crosshair";
    if (dragRef.current?.type === "move") return "grabbing";
    if (dragRef.current?.type === "rubberband") return "crosshair";
    return hoverCursor;
  };

  /* ── Clean up stale selections when elements change ── */

  useEffect(() => {
    if (selectedIds.size === 0) return;
    const elIds = new Set(data.elements.map(e => e.id));
    let changed = false;
    const cleaned = new Set<number>();
    selectedIds.forEach(id => {
      if (elIds.has(id)) cleaned.add(id);
      else changed = true;
    });
    if (changed) setSelectedIds(cleaned);
  }, [data.elements, selectedIds]);

  return (
    <div className={styles.block} ref={containerRef} tabIndex={0} onKeyDown={handleKeyDown}>
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
        {selectedIds.size > 0 && (
          <>
            <button className={styles.toolBtn} onClick={bringForward} title="Bring forward">↑</button>
            <button className={styles.toolBtn} onClick={sendBackward} title="Send backward">↓</button>
            <button className={styles.delBtn} onClick={deleteSelected}>Del</button>
          </>
        )}
        <button className={styles.toolBtn} onClick={() => onUpdate({ elements: [] })}>Clear</button>
        <button className={`${styles.toolBtn} ${showStencils ? styles.toolOn : ""}`} onClick={() => setShowStencils(v => !v)} title="Stencils">⬡</button>
        <span className={styles.count}>{data.elements.length}</span>
      </div>

      {/* Canvas */}
      <div className={styles.canvas} style={{ cursor: getCursor() }}>
        <svg ref={svgRef} width="100%" height="100%" onPointerDown={handleDown} onPointerMove={handleMove} onPointerUp={handleUp}>
          {/* Grid */}
          <defs><pattern id="canvasGrid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.4" fill="var(--ink-300)" opacity="0.3" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#canvasGrid)" />
          {renderElements.map(el => renderEl(el))}
          {current && renderEl(current)}
          {/* Selection indicators for all selected elements */}
          {selectedIds.size > 0 && renderElements
            .filter(el => selectedIds.has(el.id))
            .map(el => renderSelectionBox(el))
          }
          {/* Rubber band rectangle */}
          {rubberBand && (
            <rect
              x={rubberBand.x}
              y={rubberBand.y}
              width={rubberBand.w}
              height={rubberBand.h}
              fill="var(--ember)"
              fillOpacity="0.08"
              stroke="var(--ember)"
              strokeWidth="1"
              strokeDasharray="4 3"
              pointerEvents="none"
            />
          )}
        </svg>
        {textInput && (
          <input
            ref={textRef}
            className={styles.textInput}
            style={{ left: textInput.x, top: textInput.y }}
            value={textValue}
            onChange={e => setTextValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") submitText();
              if (e.key === "Escape") { setTextInput(null); setTextValue(""); }
              e.stopPropagation();
            }}
            onBlur={submitText}
            placeholder="Type..."
          />
        )}
        {showStencils && <StencilPicker onSelect={stampStencil} onClose={() => setShowStencils(false)} />}
      </div>
    </div>
  );
}
