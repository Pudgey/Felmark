/* Hook — canvas-to-grid coordinate conversion */

import { useCallback } from "react";
import type { CellPosition } from "../types";
import { CELL, GAP, COLS, ROW_STEP } from "../registry";

export function useCanvasGrid(gridRef: React.RefObject<HTMLDivElement | null>) {
  const canvasToGrid = useCallback(
    (clientX: number, clientY: number): CellPosition | null => {
      if (!gridRef.current) return null;
      const rect = gridRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < -20 || y < -20) return null;
      const col = Math.round(x / (CELL + GAP));
      const row = Math.round(y / ROW_STEP);
      return { col: Math.max(0, Math.min(COLS - 1, col)), row: Math.max(0, row) };
    },
    [gridRef],
  );

  return { canvasToGrid };
}
