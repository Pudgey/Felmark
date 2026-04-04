"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { CanvasBlockData, CanvasElement } from "@/lib/types";
import type { StencilDef } from "./stencils";
import StencilPicker from "./StencilPicker";
import type { Box } from "./geometry";
import { getBBox, rectsIntersect, hitTest, moveElement, getSelectionBBox } from "./geometry";
import { type HandleId, HANDLE_CURSORS, hitTestHandles, computeResizedBBox, remapElements } from "./resize";
import { renderEl, renderSelectionUI } from "./rendering";
import { useCanvasUndo } from "./useCanvasUndo";
import { useAutodraw } from "./useAutodraw";
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

/* ── Drag state (ref-based for perf) ── */

interface DragState {
  type: "move" | "rubberband" | "resize";
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  movingIds: Set<number>;
  originals: Map<number, { x: number; y: number; points?: number[][] }>;
  handle?: HandleId;
  originalBBox?: Box;
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

  const { pushUndo, undo, redo, canUndo, canRedo } = useCanvasUndo(data.elements, onUpdate);

  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const allocateId = useCallback(() => nextCanvasId++, []);

  const { prompt, setPrompt, isGenerating, error: autodrawError, generate } = useAutodraw(
    data, onUpdate, pushUndo, svgRef, allocateId
  );

  const [autodrawOpen, setAutodrawOpen] = useState(false);

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
      // Check resize handles first
      if (selectedIds.size > 0) {
        const selBB = getSelectionBBox(renderElements, selectedIds);
        const handle = hitTestHandles(pos, selBB);
        if (handle) {
          dragRef.current = {
            type: "resize", startX: pos.x, startY: pos.y, lastX: pos.x, lastY: pos.y,
            movingIds: new Set(selectedIds), originals: new Map(), handle, originalBBox: selBB,
          };
          (e.target as Element).setPointerCapture?.(e.pointerId);
          return;
        }
      }

      const hitId = hitTest(pos, data.elements);

      if (hitId !== null) {
        let newSelection: Set<number>;
        if (shiftKey) {
          newSelection = new Set(selectedIds);
          if (newSelection.has(hitId)) { newSelection.delete(hitId); setSelectedIds(newSelection); return; }
          newSelection.add(hitId);
        } else if (selectedIds.has(hitId)) {
          newSelection = new Set(selectedIds);
        } else {
          newSelection = new Set([hitId]);
        }
        setSelectedIds(newSelection);

        const originals = new Map<number, { x: number; y: number; points?: number[][] }>();
        for (const el of data.elements) {
          if (newSelection.has(el.id)) {
            originals.set(el.id, { x: el.x, y: el.y, points: el.points ? el.points.map(p => [...p]) : undefined });
          }
        }
        dragRef.current = { type: "move", startX: pos.x, startY: pos.y, lastX: pos.x, lastY: pos.y, movingIds: newSelection, originals };
        (e.target as Element).setPointerCapture?.(e.pointerId);
        return;
      }

      if (!shiftKey) setSelectedIds(new Set());
      dragRef.current = { type: "rubberband", startX: pos.x, startY: pos.y, lastX: pos.x, lastY: pos.y, movingIds: new Set(), originals: new Map() };
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

    if (dragRef.current) {
      const drag = dragRef.current;
      drag.lastX = pos.x;
      drag.lastY = pos.y;

      if (drag.type === "resize" && drag.handle && drag.originalBBox) {
        const dx = pos.x - drag.startX, dy = pos.y - drag.startY;
        const newBB = computeResizedBBox(drag.originalBBox, drag.handle, dx, dy);
        setMovingElements(remapElements(data.elements, drag.movingIds, drag.originalBBox, newBB));
      } else if (drag.type === "move") {
        const dx = pos.x - drag.startX, dy = pos.y - drag.startY;
        setMovingElements(data.elements.map(el => {
          const orig = drag.originals.get(el.id);
          if (!orig) return el;
          const moved: CanvasElement = { ...el, x: orig.x + dx, y: orig.y + dy };
          if (el.type === "draw" && orig.points) moved.points = orig.points.map(([px, py]) => [px + dx, py + dy]);
          return moved;
        }));
      } else if (drag.type === "rubberband") {
        setRubberBand({ x: Math.min(drag.startX, pos.x), y: Math.min(drag.startY, pos.y), w: Math.abs(pos.x - drag.startX), h: Math.abs(pos.y - drag.startY) });
      }
      return;
    }

    if (tool === "select" && !drawing) {
      const hitId = hitTest(pos, data.elements);
      const newCursor = hitId !== null ? "move" : "default";
      if (newCursor !== hoverCursor) setHoverCursor(newCursor);
      return;
    }

    if (!drawing || !current) return;
    if (current.type === "draw") {
      setCurrent(prev => prev ? { ...prev, points: [...(prev.points || []), [pos.x, pos.y]] } : null);
    } else {
      setCurrent(prev => prev ? { ...prev, w: pos.x - prev.x, h: pos.y - prev.y } : null);
    }
  };

  const handleUp = (e: React.PointerEvent) => {
    if (dragRef.current) {
      const drag = dragRef.current;
      const shiftKey = e.shiftKey;

      if ((drag.type === "move" || drag.type === "resize") && movingElements) {
        pushUndo();
        onUpdate({ elements: movingElements });
        setMovingElements(null);
      } else if (drag.type === "rubberband" && rubberBand) {
        if (rubberBand.w > 2 || rubberBand.h > 2) {
          const hit = new Set<number>(shiftKey ? selectedIds : []);
          for (const el of data.elements) {
            const bb = getBBox(el);
            if (rectsIntersect(rubberBand, { x: bb.x, y: bb.y, w: Math.max(bb.w, 4), h: Math.max(bb.h, 4) })) hit.add(el.id);
          }
          setSelectedIds(hit);
        }
        setRubberBand(null);
      }
      dragRef.current = null;
      return;
    }

    if (!drawing || !current) { setDrawing(false); return; }
    setDrawing(false);
    if (current.type === "draw" && (current.points?.length || 0) < 3) { setCurrent(null); return; }
    if (current.type !== "draw" && Math.abs(current.w || 0) < 4 && Math.abs(current.h || 0) < 4) { setCurrent(null); return; }
    pushUndo();
    onUpdate({ elements: [...data.elements, current] });
    setCurrent(null);
  };

  /* ── Text input ── */

  const submitText = () => {
    if (textValue.trim() && textInput) {
      pushUndo();
      onUpdate({ elements: [...data.elements, { id: nextCanvasId++, type: "text", x: textInput.x, y: textInput.y, strokeColor: color, fillColor: "transparent", strokeWidth: 0, text: textValue.trim(), fontSize: 16 }] });
    }
    setTextInput(null);
    setTextValue("");
  };

  /* ── Actions ── */

  const deleteSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    pushUndo();
    onUpdate({ elements: data.elements.filter(e => !selectedIds.has(e.id)) });
    setSelectedIds(new Set());
  }, [selectedIds, data, onUpdate, pushUndo]);

  const bringForward = useCallback(() => {
    if (selectedIds.size === 0) return;
    pushUndo();
    const sel = data.elements.filter(e => selectedIds.has(e.id));
    const rest = data.elements.filter(e => !selectedIds.has(e.id));
    onUpdate({ elements: [...rest, ...sel] });
  }, [selectedIds, data, onUpdate, pushUndo]);

  const sendBackward = useCallback(() => {
    if (selectedIds.size === 0) return;
    pushUndo();
    const sel = data.elements.filter(e => selectedIds.has(e.id));
    const rest = data.elements.filter(e => !selectedIds.has(e.id));
    onUpdate({ elements: [...sel, ...rest] });
  }, [selectedIds, data, onUpdate, pushUndo]);

  const duplicateSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    pushUndo();
    const dupes: CanvasElement[] = [];
    for (const el of data.elements) {
      if (selectedIds.has(el.id)) dupes.push(moveElement({ ...el, id: nextCanvasId++ }, 10, 10));
    }
    onUpdate({ elements: [...data.elements, ...dupes] });
    setSelectedIds(new Set(dupes.map(d => d.id)));
  }, [selectedIds, data, onUpdate, pushUndo]);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(data.elements.map(e => e.id)));
  }, [data.elements]);

  const nudge = useCallback((dx: number, dy: number) => {
    if (selectedIds.size === 0) return;
    pushUndo();
    onUpdate({ elements: data.elements.map(el => selectedIds.has(el.id) ? moveElement(el, dx, dy) : el) });
  }, [selectedIds, data, onUpdate, pushUndo]);

  /* ── Keyboard shortcuts ── */

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (textInput) return;
    const mod = e.metaKey || e.ctrlKey;
    const step = e.shiftKey ? 10 : 1;

    switch (e.key) {
      case "Delete": case "Backspace":
        if (selectedIds.size > 0) { e.preventDefault(); deleteSelected(); } break;
      case "ArrowUp": if (selectedIds.size > 0) { e.preventDefault(); nudge(0, -step); } break;
      case "ArrowDown": if (selectedIds.size > 0) { e.preventDefault(); nudge(0, step); } break;
      case "ArrowLeft": if (selectedIds.size > 0) { e.preventDefault(); nudge(-step, 0); } break;
      case "ArrowRight": if (selectedIds.size > 0) { e.preventDefault(); nudge(step, 0); } break;
      case "z":
        if (mod && e.shiftKey) { e.preventDefault(); redo(); }
        else if (mod) { e.preventDefault(); undo(); }
        break;
      case "a": if (mod) { e.preventDefault(); selectAll(); } break;
      case "d": if (mod) { e.preventDefault(); duplicateSelected(); } break;
      case "Escape": setSelectedIds(new Set()); break;
    }
  }, [selectedIds, textInput, deleteSelected, nudge, selectAll, duplicateSelected, undo, redo]);

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
    const offsetX = canvasW / 2 - (maxX - minX) / 2 - minX;
    const offsetY = canvasH - (maxY - minY) / 2 - minY;
    const newEls: CanvasElement[] = stencil.elements.map((tmpl) => ({
      ...tmpl, id: nextCanvasId++, x: tmpl.x + offsetX, y: tmpl.y + offsetY,
      ...(tmpl.points ? { points: tmpl.points.map(([px, py]) => [px + offsetX, py + offsetY]) } : {}),
    }));
    pushUndo();
    onUpdate({ elements: [...data.elements, ...newEls] });
    setShowStencils(false);
    setTool("select");
  }, [data, onUpdate, pushUndo]);

  /* ── Cursor logic ── */

  const getCursor = (): string => {
    if (tool !== "select") return tool === "text" ? "text" : "crosshair";
    if (dragRef.current?.type === "resize" && dragRef.current.handle) return HANDLE_CURSORS[dragRef.current.handle];
    if (dragRef.current?.type === "move") return "grabbing";
    if (dragRef.current?.type === "rubberband") return "crosshair";
    return hoverCursor;
  };

  /* ── Clean up stale selections ── */

  useEffect(() => {
    if (selectedIds.size === 0) return;
    const elIds = new Set(data.elements.map(e => e.id));
    let changed = false;
    const cleaned = new Set<number>();
    selectedIds.forEach(id => { if (elIds.has(id)) cleaned.add(id); else changed = true; });
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
        <button className={styles.toolBtn} onClick={undo} disabled={!canUndo} title="Undo (⌘Z)" style={{ opacity: canUndo ? 1 : 0.3 }}>↩</button>
        <button className={styles.toolBtn} onClick={redo} disabled={!canRedo} title="Redo (⌘⇧Z)" style={{ opacity: canRedo ? 1 : 0.3 }}>↪</button>
        <span className={styles.sep} />
        <button className={styles.toolBtn} onClick={() => { pushUndo(); onUpdate({ elements: [] }); }}>Clear</button>
        <button className={`${styles.toolBtn} ${showStencils ? styles.toolOn : ""}`} onClick={() => setShowStencils(v => !v)} title="Stencils">⬡</button>
        <span className={styles.sep} />
        <button
          className={`${styles.toolBtn} ${autodrawOpen ? styles.toolOn : ""}`}
          onClick={() => setAutodrawOpen(v => !v)}
          title="AI Autodraw (✦)"
        >✦</button>
        {autodrawOpen && (
          <input
            className={styles.autodrawInput}
            placeholder="Describe a diagram…"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !isGenerating) { generate(); setAutodrawOpen(false); }
              if (e.key === "Escape") setAutodrawOpen(false);
              e.stopPropagation();
            }}
            disabled={isGenerating}
            autoFocus
          />
        )}
        {isGenerating && <span className={styles.count}>✦…</span>}
        {autodrawError && <span className={styles.autodrawErr}>{autodrawError}</span>}
        <span className={styles.count}>{data.elements.length}</span>
      </div>

      {/* Canvas */}
      <div className={styles.canvas} style={{ cursor: getCursor() }}>
        <svg ref={svgRef} width="100%" height="100%" onPointerDown={handleDown} onPointerMove={handleMove} onPointerUp={handleUp}>
          <defs><pattern id="canvasGrid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.4" fill="var(--ink-300)" opacity="0.3" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#canvasGrid)" />
          {renderElements.map(el => renderEl(el))}
          {current && renderEl(current)}
          {selectedIds.size > 0 && (() => {
            const bb = getSelectionBBox(renderElements, selectedIds);
            return renderSelectionUI(bb, tool === "select" && !dragRef.current);
          })()}
          {rubberBand && (
            <rect x={rubberBand.x} y={rubberBand.y} width={rubberBand.w} height={rubberBand.h}
              fill="var(--ember)" fillOpacity="0.08" stroke="var(--ember)" strokeWidth="1" strokeDasharray="4 3" pointerEvents="none" />
          )}
        </svg>
        {textInput && (
          <input ref={textRef} className={styles.textInput} style={{ left: textInput.x, top: textInput.y }}
            value={textValue} onChange={e => setTextValue(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submitText(); if (e.key === "Escape") { setTextInput(null); setTextValue(""); } e.stopPropagation(); }}
            onBlur={submitText} placeholder="Type..." />
        )}
        {showStencils && <StencilPicker onSelect={stampStencil} onClose={() => setShowStencils(false)} />}
      </div>
    </div>
  );
}
