/* Canvas registry — constants, block definitions, initial data, helpers */

import type { CanvasBlock, CanvasRow, BlockTypeDef, LayoutBlock } from "./types";
import type { TargetRowResult } from "./types";

/* ── Constants ── */

export const CELL = 128;
export const COLS = 8;
export const GAP = 16;
export const ROW_GAP = 24;
export const COL_STEP = CELL + GAP;
export const ROW_STEP = CELL + ROW_GAP;
export const GRID_W = COLS * CELL + (COLS - 1) * GAP;
export const MAX_PER_ROW = 3;

/* ── Block type definitions (21 types) ── */

export const BLOCK_DEFS: BlockTypeDef[] = [
  { type: "revenue", label: "Revenue Counter", icon: "$", color: "#6b9a6b", defaultW: 2, minW: 1, maxW: 8, defaultH: 2, minH: 1, expandAxis: "width" },
  { type: "outstanding", label: "Outstanding", icon: "!", color: "#c07a6a", defaultW: 2, minW: 1, maxW: 8, defaultH: 2, minH: 1, expandAxis: "width" },
  { type: "tasks", label: "Task Board", icon: "\u229E", color: "#8b8bba", defaultW: 4, minW: 2, maxW: 8, defaultH: 3, minH: 2, expandAxis: "both" },
  { type: "activity", label: "Activity Feed", icon: "\u25C7", color: "#b07d4f", defaultW: 2, minW: 2, maxW: 4, defaultH: 3, minH: 2, expandAxis: "width" },
  { type: "health", label: "Client Health", icon: "\u2665", color: "#8b8bba", defaultW: 2, minW: 2, maxW: 4, defaultH: 3, minH: 2, expandAxis: "width" },
  { type: "timer", label: "Active Timer", icon: "\u25B6", color: "#6b9a6b", defaultW: 2, minW: 1, maxW: 4, defaultH: 2, minH: 1, expandAxis: "width" },
  { type: "calendar", label: "Calendar", icon: "\u25CE", color: "#8b8bba", defaultW: 4, minW: 2, maxW: 8, defaultH: 3, minH: 2, expandAxis: "both" },
  { type: "chat", label: "Quick Chat", icon: "\u2709", color: "#8b8bba", defaultW: 2, minW: 2, maxW: 4, defaultH: 3, minH: 2, expandAxis: "width" },
  { type: "invoices", label: "Invoice List", icon: "\u2630", color: "#6b9a6b", defaultW: 4, minW: 2, maxW: 8, defaultH: 2, minH: 2, expandAxis: "width" },
  { type: "files", label: "File Gallery", icon: "\u25FB", color: "#b07d4f", defaultW: 2, minW: 2, maxW: 6, defaultH: 2, minH: 2, expandAxis: "both" },
  { type: "pipeline", label: "Pipeline", icon: "\u2192", color: "#8b8bba", defaultW: 4, minW: 3, maxW: 8, defaultH: 3, minH: 2, expandAxis: "width" },
  { type: "automation", label: "Automations", icon: "\u26A1", color: "#b07d4f", defaultW: 3, minW: 2, maxW: 6, defaultH: 2, minH: 2, expandAxis: "width" },
  { type: "whisper", label: "AI Whisper", icon: "\u2726", color: "#b07d4f", defaultW: 8, minW: 4, maxW: 8, defaultH: 1, minH: 1, expandAxis: "width" },
  { type: "rate", label: "Rate Tracker", icon: "\u2197", color: "#8b8bba", defaultW: 2, minW: 1, maxW: 8, defaultH: 2, minH: 1, expandAxis: "width" },
  { type: "goal", label: "Goal Ring", icon: "\u25C9", color: "#b07d4f", defaultW: 2, minW: 1, maxW: 8, defaultH: 2, minH: 1, expandAxis: "width" },
  { type: "note", label: "Sticky Note", icon: "\u25FB", color: "#b5b2a9", defaultW: 2, minW: 1, maxW: 4, defaultH: 2, minH: 1, expandAxis: "both" },
  { type: "revenue-chart", label: "Revenue Chart", icon: "\u25C8", color: "#8b8bba", defaultW: 4, minW: 3, maxW: 8, defaultH: 3, minH: 2, expandAxis: "both" },
  { type: "project-summary", label: "Project Summary", icon: "\u25C6", color: "#b07d4f", defaultW: 5, minW: 5, maxW: 8, defaultH: 5, minH: 4, expandAxis: "both" },
  { type: "command-surface", label: "Command Surface", icon: "\u2318", color: "#7c6b9e", defaultW: 3, minW: 3, maxW: 4, defaultH: 4, minH: 3, expandAxis: "both" },
  { type: "client-pulse", label: "Client Pulse", icon: "\u25B3", color: "#5b7fa4", defaultW: 4, minW: 4, maxW: 8, defaultH: 5, minH: 4, expandAxis: "both" },
  { type: "invoice-surface", label: "Invoice Surface", icon: "\u25A3", color: "#b07d4f", defaultW: 4, minW: 4, maxW: 8, defaultH: 5, minH: 4, expandAxis: "both" },
];

/* ── Initial data (row-based) ── */

export const INITIAL_BLOCK_MAP: Record<string, CanvasBlock> = {
  b1: { id: "b1", type: "revenue", label: "Revenue", color: "#6b9a6b", w: 2, value: "$14,800", sub: "+12% this month" },
  b2: { id: "b2", type: "outstanding", label: "Outstanding", color: "#c07a6a", w: 2, value: "$9,600", sub: "3 invoices" },
  b3: { id: "b3", type: "rate", label: "Effective Rate", color: "#8b8bba", w: 2, value: "$108/hr", sub: "Target: $150" },
  b4: { id: "b4", type: "goal", label: "Monthly Goal", color: "#b07d4f", w: 2, value: "74%", sub: "of $20,000" },
  b5: { id: "b5", type: "whisper", label: "AI Whisper", color: "#b07d4f", w: 8 },
  b6: { id: "b6", type: "tasks", label: "Active Tasks", color: "#8b8bba", w: 4 },
  b7: { id: "b7", type: "activity", label: "Activity Feed", color: "#b07d4f", w: 2 },
  b8: { id: "b8", type: "health", label: "Client Health", color: "#8b8bba", w: 2 },
};

export const INITIAL_ROWS: CanvasRow[] = [
  { id: "r0", blockIds: ["b1", "b2", "b3", "b4"] },
  { id: "r1", blockIds: ["b5"] },
  { id: "r2", blockIds: ["b6", "b7", "b8"] },
];

/* ── Helpers ── */

export function findTargetRow(gridRow: number, layout: LayoutBlock[], rows: CanvasRow[]): TargetRowResult {
  let yAccum = 0;
  for (let i = 0; i < rows.length; i++) {
    const rowBlocks = layout.filter((lb) => rows[i].blockIds.includes(lb.id));
    const rowH = rowBlocks.length > 0 ? rowBlocks[0].h : 2;
    if (gridRow < yAccum + rowH) {
      return { rowIdx: i, rowY: yAccum, rowH, totalH: yAccum + rowH };
    }
    yAccum += rowH;
  }
  const lastH = layout.length > 0 ? layout[layout.length - 1].h : 2;
  return { rowIdx: Math.max(0, rows.length - 1), rowY: Math.max(0, yAccum - lastH), rowH: 2, totalH: yAccum };
}

export function canFitInRow(row: CanvasRow, blocks: Record<string, CanvasBlock>, addWidth: number): boolean {
  const rowWidth = row.blockIds.reduce((sum, bid) => sum + (blocks[bid]?.w ?? 0), 0);
  return rowWidth + addWidth <= COLS && row.blockIds.length < MAX_PER_ROW;
}

export function blockRect(b: { x: number; y: number; w: number; h: number }) {
  return {
    left: colToPx(b.x),
    top: rowToPx(b.y),
    width: spanWidthPx(b.w),
    height: spanHeightPx(b.h),
  };
}

export function colToPx(col: number) {
  return col * COL_STEP;
}

export function rowToPx(row: number) {
  return row * ROW_STEP;
}

export function spanWidthPx(span: number) {
  return span * CELL + (span - 1) * GAP;
}

export function spanHeightPx(span: number) {
  return span * CELL + (span - 1) * ROW_GAP;
}
