/* Canvas persistence helpers */

import type { CanvasBlock, CanvasRow } from "./types";

export type StoredCanvasState = {
  blocks: Record<string, CanvasBlock>;
  rows: CanvasRow[];
};

export const CANVAS_STORAGE_KEY = "felmark_workspace_canvas_v1";

export function loadStoredCanvasState(): StoredCanvasState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CANVAS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCanvasState;
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.blocks || typeof parsed.blocks !== "object") return null;
    if (!Array.isArray(parsed.rows)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function persistCanvasState(blocks: Record<string, CanvasBlock>, rows: CanvasRow[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      CANVAS_STORAGE_KEY,
      JSON.stringify({ blocks, rows }),
    );
  } catch {
    // Ignore storage failures; the canvas should still remain usable in-memory.
  }
}
