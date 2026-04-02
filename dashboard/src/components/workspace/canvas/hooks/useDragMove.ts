"use client";

import { useCallback, useState } from "react";
import type { CanvasBlock, CanvasRow, LayoutBlock } from "../types";
import { layoutRows } from "../layout";
import { BLOCK_DEFS, COLS, CELL, GAP, GRID_W, canFitInRow } from "../registry";

const MOVE_PREVIEW_ID = "__move_preview__";
const MOVE_PREVIEW_ROW_ID = "__move_preview_row__";

interface UseDragMoveProps {
  layoutRef: React.MutableRefObject<LayoutBlock[]>;
  rowsRef: React.MutableRefObject<CanvasRow[]>;
  blocksRef: React.MutableRefObject<Record<string, CanvasBlock>>;
  gridRef: React.MutableRefObject<HTMLDivElement | null>;
  setRows: React.Dispatch<React.SetStateAction<CanvasRow[]>>;
}

export interface UseDragMoveReturn {
  movingBlock: string | null;
  moveCursor: { x: number; y: number } | null;
  moveOffset: { x: number; y: number } | null;
  previewLayout: LayoutBlock[] | null;
  previewSlot: LayoutBlock | null;
  moveTarget: MoveTarget | null;
  startMove: (blockId: string, clientX: number, clientY: number) => void;
}

export type MoveTarget =
  | { kind: "row"; insertIdx: number; top: number; width: number }
  | { kind: "column"; rowIdx: number; insertIdx: number; left: number; top: number; height: number };

export function useDragMove({
  layoutRef,
  rowsRef,
  blocksRef,
  gridRef,
  setRows,
}: UseDragMoveProps): UseDragMoveReturn {
  const [movingBlock, setMovingBlock] = useState<string | null>(null);
  const [moveCursor, setMoveCursor] = useState<{ x: number; y: number } | null>(null);
  const [moveOffset, setMoveOffset] = useState<{ x: number; y: number } | null>(null);
  const [previewLayout, setPreviewLayout] = useState<LayoutBlock[] | null>(null);
  const [previewSlot, setPreviewSlot] = useState<LayoutBlock | null>(null);
  const [moveTarget, setMoveTarget] = useState<MoveTarget | null>(null);

  const getRowsWithoutBlock = useCallback((blockId: string): CanvasRow[] => (
    rowsRef.current
      .map((row) => ({
        ...row,
        blockIds: row.blockIds.filter((id) => id !== blockId),
      }))
      .filter((row) => row.blockIds.length > 0)
  ), [rowsRef]);

  const insertBlockIntoRows = useCallback((
    rowsWithoutBlock: CanvasRow[],
    insertId: string,
    target: MoveTarget,
    rowId: string,
  ): CanvasRow[] => {
    if (rowsWithoutBlock.length === 0) {
      return [{ id: rowId, blockIds: [insertId] }];
    }

    if (target.kind === "row") {
      const newRow: CanvasRow = { id: rowId, blockIds: [insertId] };
      return [
        ...rowsWithoutBlock.slice(0, target.insertIdx),
        newRow,
        ...rowsWithoutBlock.slice(target.insertIdx),
      ];
    }

    return rowsWithoutBlock.map((row, index) => {
      if (index !== target.rowIdx) return row;
      return {
        ...row,
        blockIds: [
          ...row.blockIds.slice(0, target.insertIdx),
          insertId,
          ...row.blockIds.slice(target.insertIdx),
        ],
      };
    });
  }, []);

  const pickMoveTarget = useCallback((blockId: string, clientX: number, clientY: number): MoveTarget | null => {
    if (!gridRef.current) return null;

    const currentBlocks = blocksRef.current;
    const moving = currentBlocks[blockId];
    if (!moving) return null;

    const rect = gridRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const rowsWithoutBlock = getRowsWithoutBlock(blockId);

    if (rowsWithoutBlock.length === 0) {
      return { kind: "row", insertIdx: 0, top: 0, width: GRID_W };
    }

    const remainingLayout = layoutRows(rowsWithoutBlock, currentBlocks, BLOCK_DEFS, COLS);

    let bestTarget: MoveTarget | null = null;
    let bestScore = Number.POSITIVE_INFINITY;
    let yOffset = 0;

    const considerRowTarget = (insertIdx: number, top: number) => {
      if (x < -24 || x > GRID_W + 24) return;
      const score = Math.abs(y - top);
      if (score < bestScore && score <= 34) {
        bestScore = score;
        bestTarget = { kind: "row", insertIdx, top, width: GRID_W };
      }
    };

    considerRowTarget(0, 0);

    for (let rowIdx = 0; rowIdx < rowsWithoutBlock.length; rowIdx++) {
      const row = rowsWithoutBlock[rowIdx];
      const rowLayoutBlocks = remainingLayout
        .filter((lb) => row.blockIds.includes(lb.id))
        .sort((a, b) => a.x - b.x);

      if (rowLayoutBlocks.length === 0) continue;

      const rowHeight = rowLayoutBlocks[0].h;
      const rowTop = yOffset * (CELL + GAP);
      const rowHeightPx = rowHeight * CELL + (rowHeight - 1) * GAP;
      const rowBottom = rowTop + rowHeightPx;
      const rowMid = rowTop + rowHeightPx / 2;

      if (canFitInRow(row, currentBlocks, moving.w) && y >= rowTop - 20 && y <= rowBottom + 20) {
        const boundaries = [0, ...rowLayoutBlocks.map((lb) => lb.x + lb.w)];
        for (let insertIdx = 0; insertIdx < boundaries.length; insertIdx++) {
          const left = Math.min(boundaries[insertIdx] * (CELL + GAP), GRID_W);
          const score = Math.abs(x - left) + Math.abs(y - rowMid) * 0.18;
          if (score < bestScore && Math.abs(x - left) <= 44) {
            bestScore = score;
            bestTarget = {
              kind: "column",
              rowIdx,
              insertIdx,
              left,
              top: rowTop,
              height: rowHeightPx,
            };
          }
        }
      }

      yOffset += rowHeight;
      considerRowTarget(rowIdx + 1, yOffset * (CELL + GAP));
    }

    return bestTarget;
  }, [blocksRef, getRowsWithoutBlock, gridRef]);

  const buildPreviewRows = useCallback((blockId: string, target: MoveTarget): CanvasRow[] => {
    const currentRows = rowsRef.current;
    const currentBlocks = blocksRef.current;
    const moving = currentBlocks[blockId];

    if (!moving) return currentRows;

    const rowsWithoutBlock = getRowsWithoutBlock(blockId);
    return insertBlockIntoRows(rowsWithoutBlock, blockId, target, `r${Date.now()}`);
  }, [blocksRef, getRowsWithoutBlock, insertBlockIntoRows, rowsRef]);

  const clearMoveState = useCallback(() => {
    document.body.style.cursor = "";
    setMovingBlock(null);
    setMoveCursor(null);
    setMoveOffset(null);
    setPreviewLayout(null);
    setPreviewSlot(null);
    setMoveTarget(null);
  }, []);

  const startMove = useCallback((blockId: string, clientX: number, clientY: number) => {
    setMovingBlock(blockId);
    setMoveCursor({ x: clientX, y: clientY });
    const movingLayout = layoutRef.current.find((lb) => lb.id === blockId);
    if (gridRef.current && movingLayout) {
      const gridRect = gridRef.current.getBoundingClientRect();
      const blockLeft = gridRect.left + movingLayout.x * (CELL + GAP);
      const blockTop = gridRect.top + movingLayout.y * (CELL + GAP);
      setMoveOffset({ x: clientX - blockLeft, y: clientY - blockTop });
    } else {
      setMoveOffset({ x: 28, y: 18 });
    }
    document.body.style.cursor = "grabbing";

    const onMove = (e: MouseEvent) => {
      setMoveCursor({ x: e.clientX, y: e.clientY });
      const target = pickMoveTarget(blockId, e.clientX, e.clientY);
      setMoveTarget(target);
      if (!target) {
        setPreviewLayout(null);
        setPreviewSlot(null);
        return;
      }

      const moving = blocksRef.current[blockId];
      if (!moving) {
        setPreviewLayout(null);
        setPreviewSlot(null);
        return;
      }

      const rowsWithoutBlock = getRowsWithoutBlock(blockId);
      const previewRows = insertBlockIntoRows(
        rowsWithoutBlock,
        MOVE_PREVIEW_ID,
        target,
        MOVE_PREVIEW_ROW_ID,
      );
      const previewBlocks = {
        ...blocksRef.current,
        [MOVE_PREVIEW_ID]: { ...moving, id: MOVE_PREVIEW_ID },
      };
      const computed = layoutRows(previewRows, previewBlocks, BLOCK_DEFS, COLS);
      setPreviewLayout(computed.filter((lb) => lb.id !== MOVE_PREVIEW_ID));
      setPreviewSlot(computed.find((lb) => lb.id === MOVE_PREVIEW_ID) ?? null);
    };

    const onUp = (e: MouseEvent) => {
      const target = pickMoveTarget(blockId, e.clientX, e.clientY);
      if (target) {
        const nextRows = buildPreviewRows(blockId, target);
        setRows(nextRows);
      }

      clearMoveState();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [blocksRef, buildPreviewRows, clearMoveState, getRowsWithoutBlock, gridRef, insertBlockIntoRows, layoutRef, pickMoveTarget, setRows]);

  return {
    movingBlock,
    moveCursor,
    moveOffset,
    previewLayout,
    previewSlot,
    moveTarget,
    startMove,
  };
}
