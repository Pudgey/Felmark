"use client";

import { useState, type Dispatch, type SetStateAction, type RefObject } from "react";
import type { CanvasBlockData, CanvasElement } from "@/lib/types";

// The shape the LLM returns — an intermediate format
type AutodrawElement =
  | { type: "rect" | "circle" | "diamond"; col: number; row: number; label?: string }
  | { type: "arrow"; fromCol: number; fromRow: number; toCol: number; toRow: number; label?: string }
  | { type: "text"; col: number; row: number; text: string };

// nextCanvasId is module-level in CanvasBlock.tsx — import it from there.
// IMPORTANT: We cannot import nextCanvasId directly since it's a `let` in CanvasBlock.tsx.
// Instead, accept an `allocateId: () => number` callback from the hook caller.

// Shape dimensions by type — circles must be square to render correctly
const DIMS = {
  rect: { w: 120, h: 48 },
  circle: { w: 60, h: 60 },
  diamond: { w: 90, h: 60 },
} as const;

function slotCenter(col: number, row: number, canvasW: number, canvasH: number) {
  const PAD_X = 80,
    PAD_Y = 60;
  const stepX = canvasW > PAD_X * 2 + 10 ? (canvasW - PAD_X * 2) / 4 : 100;
  const stepY = canvasH > PAD_Y * 2 + 10 ? (canvasH - PAD_Y * 2) / 3 : 80;
  return { cx: PAD_X + col * stepX, cy: PAD_Y + row * stepY };
}

// Trim arrow endpoints from center to box edge so arrows don't pierce through shapes
function trimToBoxEdge(
  fromCx: number,
  fromCy: number,
  fromHw: number,
  fromHh: number,
  toCx: number,
  toCy: number,
  toHw: number,
  toHh: number,
): { x1: number; y1: number; x2: number; y2: number } {
  const dx = toCx - fromCx,
    dy = toCy - fromCy;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return { x1: fromCx, y1: fromCy, x2: toCx, y2: toCy };
  const nx = dx / len,
    ny = dy / len;
  const GAP = 4;
  const tFrom = Math.min(
    Math.abs(nx) > 0.001 ? (fromHw + GAP) / Math.abs(nx) : Infinity,
    Math.abs(ny) > 0.001 ? (fromHh + GAP) / Math.abs(ny) : Infinity,
  );
  const tTo = Math.min(
    Math.abs(nx) > 0.001 ? (toHw + GAP) / Math.abs(nx) : Infinity,
    Math.abs(ny) > 0.001 ? (toHh + GAP) / Math.abs(ny) : Infinity,
  );
  return {
    x1: fromCx + nx * tFrom,
    y1: fromCy + ny * tFrom,
    x2: toCx - nx * tTo,
    y2: toCy - ny * tTo,
  };
}

function toCanvasElements(
  raw: AutodrawElement[],
  canvasW: number,
  canvasH: number,
  allocateId: () => number,
): CanvasElement[] {
  // Separate into three layers so SVG paint order is: shapes → arrows → labels
  const shapes: CanvasElement[] = [];
  const connectors: CanvasElement[] = [];
  const labels: CanvasElement[] = [];

  // Build slot→type map so arrow trimming uses accurate shape dimensions
  const slotType = new Map<string, keyof typeof DIMS>();
  for (const item of raw) {
    if (item.type === "rect" || item.type === "circle" || item.type === "diamond") {
      slotType.set(`${item.col},${item.row}`, item.type);
    }
  }

  for (const item of raw) {
    if (item.type === "rect" || item.type === "circle" || item.type === "diamond") {
      const { cx, cy } = slotCenter(item.col, item.row, canvasW, canvasH);
      const { w, h } = DIMS[item.type];
      shapes.push({
        id: allocateId(),
        type: item.type,
        x: cx - w / 2,
        y: cy - h / 2,
        w,
        h,
        strokeColor: "#2c2a25",
        fillColor: "transparent",
        strokeWidth: 1.5,
      });
      if (item.label) {
        labels.push({
          id: allocateId(),
          type: "text",
          x: cx - w / 2 + 8,
          y: cy - 7,
          strokeColor: "#2c2a25",
          fillColor: "transparent",
          strokeWidth: 0,
          text: item.label,
          fontSize: 12,
        });
      }
    }

    if (item.type === "arrow") {
      const from = slotCenter(item.fromCol, item.fromRow, canvasW, canvasH);
      const to = slotCenter(item.toCol, item.toRow, canvasW, canvasH);
      const fromDims = DIMS[slotType.get(`${item.fromCol},${item.fromRow}`) ?? "rect"];
      const toDims = DIMS[slotType.get(`${item.toCol},${item.toRow}`) ?? "rect"];
      const { x1, y1, x2, y2 } = trimToBoxEdge(
        from.cx,
        from.cy,
        fromDims.w / 2,
        fromDims.h / 2,
        to.cx,
        to.cy,
        toDims.w / 2,
        toDims.h / 2,
      );
      connectors.push({
        id: allocateId(),
        type: "arrow",
        x: x1,
        y: y1,
        w: x2 - x1,
        h: y2 - y1,
        strokeColor: "#2c2a25",
        fillColor: "transparent",
        strokeWidth: 1.5,
      });
      if (item.label) {
        labels.push({
          id: allocateId(),
          type: "text",
          x: (x1 + x2) / 2 + 4,
          y: (y1 + y2) / 2 - 13,
          strokeColor: "#8a7e63",
          fillColor: "transparent",
          strokeWidth: 0,
          text: item.label,
          fontSize: 10,
        });
      }
    }

    if (item.type === "text") {
      const { cx, cy } = slotCenter(item.col, item.row, canvasW, canvasH);
      labels.push({
        id: allocateId(),
        type: "text",
        x: cx,
        y: cy,
        strokeColor: "#2c2a25",
        fillColor: "transparent",
        strokeWidth: 0,
        text: item.text,
        fontSize: 13,
      });
    }
  }

  return [...shapes, ...connectors, ...labels];
}

export interface UseAutodrawReturn {
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  isGenerating: boolean;
  error: string | null;
  generate: () => Promise<void>;
}

export function useAutodraw(
  data: CanvasBlockData,
  onUpdate: (data: CanvasBlockData) => void,
  pushUndo: () => void,
  svgRef: RefObject<SVGSVGElement>,
  allocateId: () => number,
): UseAutodrawReturn {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const rect = svgRef.current?.getBoundingClientRect();
      const canvasW = rect?.width || 700;
      const canvasH = rect?.height || 400;

      const res = await fetch("/api/canvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const { elements: raw } = (await res.json()) as { elements: AutodrawElement[] };
      if (!Array.isArray(raw) || raw.length === 0) throw new Error("No elements returned");

      const newEls = toCanvasElements(raw, canvasW, canvasH, allocateId);
      pushUndo();
      onUpdate({ elements: [...data.elements, ...newEls] });
      setPrompt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return { prompt, setPrompt, isGenerating, error, generate };
}
