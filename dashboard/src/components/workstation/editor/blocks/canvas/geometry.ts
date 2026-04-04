import type { CanvasElement } from "@/lib/types";

export interface Box { x: number; y: number; w: number; h: number }

export function getBBox(el: CanvasElement): Box {
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
  const x = Math.min(el.x, el.x + (el.w || 0));
  const y = Math.min(el.y, el.y + (el.h || 0));
  return { x, y, w: Math.abs(el.w || 0), h: Math.abs(el.h || 0) };
}

export function rectsIntersect(a: Box, b: Box): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function hitTest(pos: { x: number; y: number }, elements: CanvasElement[]): number | null {
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

export function moveElement(el: CanvasElement, dx: number, dy: number): CanvasElement {
  const moved = { ...el, x: el.x + dx, y: el.y + dy };
  if (el.type === "draw" && el.points) {
    moved.points = el.points.map(([px, py]) => [px + dx, py + dy]);
  }
  return moved;
}

export function getSelectionBBox(elements: CanvasElement[], ids: Set<number>): Box {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const el of elements) {
    if (!ids.has(el.id)) continue;
    const bb = getBBox(el);
    minX = Math.min(minX, bb.x);
    minY = Math.min(minY, bb.y);
    maxX = Math.max(maxX, bb.x + Math.max(bb.w, 4));
    maxY = Math.max(maxY, bb.y + Math.max(bb.h, 4));
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}
