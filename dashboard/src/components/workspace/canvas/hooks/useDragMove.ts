"use client";

import { useCallback, useState } from "react";
import type { CanvasBlock, CanvasRow, LayoutBlock, CellPosition } from "../types";
import { layoutRows } from "../layout";
import { BLOCK_DEFS, COLS, CELL, GAP, canFitInRow } from "../registry";

interface UseDragMoveProps {
  rowsRef: React.MutableRefObject<CanvasRow[]>;
  blocksRef: React.MutableRefObject<Record<string, CanvasBlock>>;
  gridRef: React.MutableRefObject<HTMLDivElement | null>;
  setRows: React.Dispatch<React.SetStateAction<CanvasRow[]>>;
}

export interface UseDragMoveReturn {
  movingBlock: string | null;
  moveCursor: { x: number; y: number } | null;
  previewLayout: LayoutBlock[] | null;
  startMove: (blockId: string, clientX: number, clientY: number) => void;
}

function findInsertIndex(
  rowLayoutBlocks: LayoutBlock[],
  row: CanvasRow,
  cell: CellPosition,
): number {
  const ordered = rowLayoutBlocks
    .filter((lb) => row.blockIds.includes(lb.id))
    .sort((a, b) => a.x - b.x);

  for (let i = 0; i < ordered.length; i++) {
    const midpoint = ordered[i].x + ordered[i].w / 2;
    if (cell.col < midpoint) return i;
  }

  return ordered.length;
}

export function useDragMove({
  rowsRef,
  blocksRef,
  gridRef,
  setRows,
}: UseDragMoveProps): UseDragMoveReturn {
  const [movingBlock, setMovingBlock] = useState<string | null>(null);
  const [moveCursor, setMoveCursor] = useState<{ x: number; y: number } | null>(null);
  const [previewLayout, setPreviewLayout] = useState<LayoutBlock[] | null>(null);

  const canvasToGrid = useCallback((clientX: number, clientY: number): CellPosition | null => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < -20 || y < -20) return null;
    const col = Math.round(x / (CELL + GAP));
    const row = Math.round(y / (CELL + GAP));
    return { col: Math.max(0, Math.min(COLS - 1, col)), row: Math.max(0, row) };
  }, [gridRef]);

  const buildPreviewRows = useCallback((blockId: string, cell: CellPosition): CanvasRow[] => {
    const currentRows = rowsRef.current;
    const currentBlocks = blocksRef.current;
    const moving = currentBlocks[blockId];

    if (!moving) return currentRows;

    const rowsWithoutBlock = currentRows
      .map((row) => ({
        ...row,
        blockIds: row.blockIds.filter((id) => id !== blockId),
      }))
      .filter((row) => row.blockIds.length > 0);

    if (rowsWithoutBlock.length === 0) {
      return [{ id: `r${Date.now()}`, blockIds: [blockId] }];
    }

    const remainingLayout = layoutRows(rowsWithoutBlock, currentBlocks, BLOCK_DEFS, COLS);
    let targetRowIdx = rowsWithoutBlock.length - 1;
    let yOffset = 0;

    for (let i = 0; i < rowsWithoutBlock.length; i++) {
      const rowLayoutBlocks = remainingLayout.filter((lb) => rowsWithoutBlock[i].blockIds.includes(lb.id));
      const rowHeight = rowLayoutBlocks.length > 0 ? rowLayoutBlocks[0].h : 2;
      if (cell.row < yOffset + rowHeight) {
        targetRowIdx = i;
        break;
      }
      yOffset += rowHeight;
    }

    const targetRow = rowsWithoutBlock[targetRowIdx];
    if (!targetRow || !canFitInRow(targetRow, currentBlocks, moving.w)) {
      const newRow: CanvasRow = { id: `r${Date.now()}`, blockIds: [blockId] };
      return [
        ...rowsWithoutBlock.slice(0, targetRowIdx + 1),
        newRow,
        ...rowsWithoutBlock.slice(targetRowIdx + 1),
      ];
    }

    const rowLayoutBlocks = remainingLayout.filter((lb) => targetRow.blockIds.includes(lb.id));
    const insertAt = findInsertIndex(rowLayoutBlocks, targetRow, cell);

    return rowsWithoutBlock.map((row, index) => {
      if (index !== targetRowIdx) return row;
      return {
        ...row,
        blockIds: [
          ...row.blockIds.slice(0, insertAt),
          blockId,
          ...row.blockIds.slice(insertAt),
        ],
      };
    });
  }, [blocksRef, rowsRef]);

  const clearMoveState = useCallback(() => {
    document.body.style.cursor = "";
    setMovingBlock(null);
    setMoveCursor(null);
    setPreviewLayout(null);
  }, []);

  const startMove = useCallback((blockId: string, clientX: number, clientY: number) => {
    setMovingBlock(blockId);
    setMoveCursor({ x: clientX, y: clientY });
    document.body.style.cursor = "grabbing";

    const onMove = (e: MouseEvent) => {
      setMoveCursor({ x: e.clientX, y: e.clientY });
      const cell = canvasToGrid(e.clientX, e.clientY);
      if (!cell) {
        setPreviewLayout(null);
        return;
      }

      const previewRows = buildPreviewRows(blockId, cell);
      setPreviewLayout(layoutRows(previewRows, blocksRef.current, BLOCK_DEFS, COLS));
    };

    const onUp = (e: MouseEvent) => {
      const cell = canvasToGrid(e.clientX, e.clientY);
      if (cell) {
        const nextRows = buildPreviewRows(blockId, cell);
        setRows(nextRows);
      }

      clearMoveState();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [blocksRef, buildPreviewRows, canvasToGrid, clearMoveState, setRows]);

  return {
    movingBlock,
    moveCursor,
    previewLayout,
    startMove,
  };
}
