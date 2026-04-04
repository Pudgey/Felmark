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

const BOX_W = 110;
const BOX_H = 44;

function slotCenter(col: number, row: number, canvasW: number, canvasH: number) {
  const PAD_X = 80, PAD_Y = 60;
  const stepX = canvasW > PAD_X * 2 + 10 ? (canvasW - PAD_X * 2) / 4 : 100;
  const stepY = canvasH > PAD_Y * 2 + 10 ? (canvasH - PAD_Y * 2) / 3 : 80;
  return { cx: PAD_X + col * stepX, cy: PAD_Y + row * stepY };
}

function toCanvasElements(
  raw: AutodrawElement[],
  canvasW: number,
  canvasH: number,
  allocateId: () => number
): CanvasElement[] {
  const els: CanvasElement[] = [];

  for (const item of raw) {
    if (item.type === "rect" || item.type === "circle" || item.type === "diamond") {
      const { cx, cy } = slotCenter(item.col, item.row, canvasW, canvasH);
      els.push({
        id: allocateId(), type: item.type,
        x: cx - BOX_W / 2, y: cy - BOX_H / 2, w: BOX_W, h: BOX_H,
        strokeColor: "#2c2a25", fillColor: "transparent", strokeWidth: 1.5,
      });
      if (item.label) {
        els.push({
          id: allocateId(), type: "text",
          x: cx - BOX_W / 2 + 8, y: cy - 6,
          strokeColor: "#2c2a25", fillColor: "transparent", strokeWidth: 0,
          text: item.label, fontSize: 11,
        });
      }
    }

    if (item.type === "arrow") {
      const from = slotCenter(item.fromCol, item.fromRow, canvasW, canvasH);
      const to   = slotCenter(item.toCol,   item.toRow,   canvasW, canvasH);
      els.push({
        id: allocateId(), type: "arrow",
        x: from.cx, y: from.cy, w: to.cx - from.cx, h: to.cy - from.cy,
        strokeColor: "#2c2a25", fillColor: "transparent", strokeWidth: 1.5,
      });
      if (item.label) {
        els.push({
          id: allocateId(), type: "text",
          x: (from.cx + to.cx) / 2 + 4, y: (from.cy + to.cy) / 2 - 14,
          strokeColor: "#8a7e63", fillColor: "transparent", strokeWidth: 0,
          text: item.label, fontSize: 9,
        });
      }
    }

    if (item.type === "text") {
      const { cx, cy } = slotCenter(item.col, item.row, canvasW, canvasH);
      els.push({
        id: allocateId(), type: "text",
        x: cx, y: cy,
        strokeColor: "#2c2a25", fillColor: "transparent", strokeWidth: 0,
        text: item.text, fontSize: 12,
      });
    }
  }

  return els;
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
  allocateId: () => number
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

      const { elements: raw } = await res.json() as { elements: AutodrawElement[] };
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
