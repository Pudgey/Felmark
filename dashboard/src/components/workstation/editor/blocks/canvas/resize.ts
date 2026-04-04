import type { CanvasElement } from "@/lib/types";
import type { Box } from "./geometry";

export type HandleId = "nw" | "n" | "ne" | "w" | "e" | "sw" | "s" | "se";
export const HANDLE_SIZE = 6;
const HANDLE_HIT = 8;

export const HANDLE_CURSORS: Record<HandleId, string> = {
  nw: "nwse-resize", n: "ns-resize", ne: "nesw-resize",
  w: "ew-resize", e: "ew-resize",
  sw: "nesw-resize", s: "ns-resize", se: "nwse-resize",
};

export function getHandlePositions(bb: Box): Record<HandleId, { x: number; y: number }> {
  const { x, y, w, h } = bb;
  return {
    nw: { x, y }, n: { x: x + w / 2, y }, ne: { x: x + w, y },
    w: { x, y: y + h / 2 }, e: { x: x + w, y: y + h / 2 },
    sw: { x, y: y + h }, s: { x: x + w / 2, y: y + h }, se: { x: x + w, y: y + h },
  };
}

export function hitTestHandles(pos: { x: number; y: number }, bb: Box): HandleId | null {
  const handles = getHandlePositions(bb);
  for (const [id, hp] of Object.entries(handles)) {
    if (Math.abs(pos.x - hp.x) <= HANDLE_HIT && Math.abs(pos.y - hp.y) <= HANDLE_HIT) {
      return id as HandleId;
    }
  }
  return null;
}

export function computeResizedBBox(original: Box, handle: HandleId, dx: number, dy: number): Box {
  let { x, y, w, h } = original;
  if (handle.includes("w")) { x += dx; w -= dx; }
  if (handle.includes("e")) { w += dx; }
  if (handle.startsWith("n")) { y += dy; h -= dy; }
  if (handle.startsWith("s") || handle === "se" || handle === "sw") { h += dy; }
  if (w < 4) { if (handle.includes("w")) x += w - 4; w = 4; }
  if (h < 4) { if (handle.startsWith("n")) y += h - 4; h = 4; }
  return { x, y, w, h };
}

export function remapElements(elements: CanvasElement[], ids: Set<number>, oldBB: Box, newBB: Box): CanvasElement[] {
  const sx = oldBB.w > 1 ? newBB.w / oldBB.w : 1;
  const sy = oldBB.h > 1 ? newBB.h / oldBB.h : 1;
  return elements.map(el => {
    if (!ids.has(el.id)) return el;
    const mapped: CanvasElement = {
      ...el,
      x: newBB.x + (el.x - oldBB.x) * sx,
      y: newBB.y + (el.y - oldBB.y) * sy,
      w: (el.w || 0) * sx,
      h: (el.h || 0) * sy,
    };
    if (el.type === "draw" && el.points) {
      mapped.points = el.points.map(([px, py]) => [
        newBB.x + (px - oldBB.x) * sx,
        newBB.y + (py - oldBB.y) * sy,
      ]);
    }
    if (el.type === "text" && el.fontSize) {
      mapped.fontSize = el.fontSize * Math.min(sx, sy);
    }
    return mapped;
  });
}
