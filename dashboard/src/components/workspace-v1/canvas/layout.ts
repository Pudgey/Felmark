/* Smart Spacing v2 — row-based layout engine for the Grid Canvas */

import type { CanvasBlock, CanvasRow, BlockTypeDef, LayoutBlock } from "./types";

/* ── distributeWidth ── */

interface WidthInput {
  id: string;
  w: number;
  minW: number;
  maxW: number;
  userSized: boolean;
}

export function distributeWidth(
  blockWidths: WidthInput[],
  cols: number,
): { id: string; w: number }[] {
  if (blockWidths.length === 0) return [];

  // Start from equal shares, clamped to min/max
  const userSizedTotal = blockWidths
    .filter((b) => b.userSized)
    .reduce((s, b) => s + Math.min(b.w, cols), 0);
  const flexCount = blockWidths.filter((b) => !b.userSized).length;
  const availCols = cols - userSizedTotal;
  const baseW = flexCount > 0 ? Math.floor(availCols / flexCount) : 0;
  let remainder = flexCount > 0 ? availCols - baseW * flexCount : 0;

  const result = blockWidths.map((b) => {
    if (b.userSized) return { id: b.id, w: Math.min(b.w, cols) };
    const w = Math.max(b.minW, Math.min(baseW + (remainder > 0 ? 1 : 0), b.maxW));
    if (remainder > 0) remainder--;
    return { id: b.id, w };
  });

  // Fix up: ensure total equals cols
  const sum = () => result.reduce((s, b) => s + b.w, 0);
  let diff = cols - sum();

  // Distribute remaining deficit (give to narrowest expandable blocks for even spread)
  while (diff > 0) {
    let bestIdx = -1;
    let bestW = Infinity;
    for (let i = 0; i < result.length; i++) {
      if (blockWidths[i].userSized) continue;
      if (result[i].w >= blockWidths[i].maxW) continue;
      if (result[i].w < bestW) { bestW = result[i].w; bestIdx = i; }
    }
    if (bestIdx < 0) { result[result.length - 1].w += diff; break; }
    result[bestIdx].w++;
    diff--;
  }

  // Shrink if over — try non-userSized first, then userSized
  while (diff < 0) {
    let bestIdx = -1;
    let bestW = 0;
    // First pass: shrink non-userSized
    for (let i = result.length - 1; i >= 0; i--) {
      if (blockWidths[i].userSized) continue;
      if (result[i].w <= blockWidths[i].minW) continue;
      if (result[i].w > bestW) { bestW = result[i].w; bestIdx = i; }
    }
    // Second pass: shrink userSized if needed
    if (bestIdx < 0) {
      for (let i = result.length - 1; i >= 0; i--) {
        if (result[i].w <= blockWidths[i].minW) continue;
        if (result[i].w > bestW) { bestW = result[i].w; bestIdx = i; }
      }
    }
    if (bestIdx < 0) break;
    result[bestIdx].w--;
    diff++;
  }

  return result;
}

/* ── layoutRows ── */

export function layoutRows(
  rows: CanvasRow[],
  blocks: Record<string, CanvasBlock>,
  defs: BlockTypeDef[],
  cols: number,
): LayoutBlock[] {
  const result: LayoutBlock[] = [];
  let yOffset = 0;

  for (const row of rows) {
    const rowBlocks = row.blockIds
      .map((id) => blocks[id])
      .filter(Boolean);

    if (rowBlocks.length === 0) continue;

    // Build width input for distribution
    const widthInputs: WidthInput[] = rowBlocks.map((b) => {
      const def = defs.find((d) => d.type === b.type);
      return {
        id: b.id,
        w: b.w,
        minW: def?.minW ?? 1,
        maxW: def?.maxW ?? cols,
        userSized: b.userSized ?? false,
      };
    });

    // Distribute widths to fill row
    const distributed = distributeWidth(widthInputs, cols);

    // Compute row height = max defaultH of blocks in this row, floored at max of minH
    const rowMinH = Math.max(
      ...rowBlocks.map((b) => {
        const def = defs.find((d) => d.type === b.type);
        return def?.minH ?? 1;
      }),
    );
    const rowHeight = Math.max(
      rowMinH,
      ...rowBlocks.map((b) => {
        const def = defs.find((d) => d.type === b.type);
        return def?.defaultH ?? 2;
      }),
    );

    // Position each block
    let xOffset = 0;
    for (const db of distributed) {
      result.push({ id: db.id, x: xOffset, y: yOffset, w: db.w, h: rowHeight });
      xOffset += db.w;
    }

    yOffset += rowHeight;
  }

  return result;
}
