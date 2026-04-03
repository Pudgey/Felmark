"use client";

import { useState, useRef, useCallback } from "react";
import type { CanvasBlock, CanvasRow, LayoutBlock, GhostPosition, CellPosition } from "../types";
import { layoutRows } from "../layout";
import { BLOCK_DEFS, COLS, CELL, GAP, MAX_PER_ROW, ROW_STEP, findTargetRow } from "../registry";

/* ── Types ── */

export interface UseDragPlaceProps {
  layoutRef: React.MutableRefObject<LayoutBlock[]>;
  rowsRef: React.MutableRefObject<CanvasRow[]>;
  blocksRef: React.MutableRefObject<Record<string, CanvasBlock>>;
  insertTargetRef: React.MutableRefObject<number | null>;
  gridRef: React.MutableRefObject<HTMLDivElement | null>;
  setBlocks: React.Dispatch<React.SetStateAction<Record<string, CanvasBlock>>>;
  setRows: React.Dispatch<React.SetStateAction<CanvasRow[]>>;
  setInsertTarget: React.Dispatch<React.SetStateAction<number | null>>;
  setShowLibrary: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UseDragPlaceReturn {
  dragging: boolean;
  dragCursor: { x: number; y: number } | null;
  placingBlock: string | null;
  ghostPos: GhostPosition | null;
  previewLayout: LayoutBlock[] | null;
  startDragWithListeners: (type: string) => void;
}

/* ── Hook ── */

export function useDragPlace(props: UseDragPlaceProps): UseDragPlaceReturn {
  const {
    layoutRef, rowsRef, blocksRef, insertTargetRef,
    gridRef, setBlocks, setRows, setInsertTarget, setShowLibrary,
  } = props;

  const [dragging, setDragging] = useState(false);
  const [dragCursor, setDragCursor] = useState<{ x: number; y: number } | null>(null);
  const [placingBlock, setPlacingBlock] = useState<string | null>(null);
  const [ghostPos, setGhostPos] = useState<GhostPosition | null>(null);
  const [previewLayout, setPreviewLayout] = useState<LayoutBlock[] | null>(null);

  const dragTypeRef = useRef<string | null>(null);
  const onMoveRef = useRef<((e: MouseEvent) => void) | null>(null);
  const onUpRef = useRef<((e: MouseEvent) => void) | null>(null);

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

  const attachDragListeners = useCallback(() => {
    const onMove = (e: MouseEvent) => {
      setDragCursor({ x: e.clientX, y: e.clientY });
      if (!dragTypeRef.current) return;
      const cell = canvasToGrid(e.clientX, e.clientY);
      if (cell) {
        const def = BLOCK_DEFS.find((bt) => bt.type === dragTypeRef.current);
        if (def) {
          const currentLayout = layoutRef.current;
          const currentRows = rowsRef.current;
          const currentBlocks = blocksRef.current;

          const target = findTargetRow(cell.row, currentLayout, currentRows);
          const targetRow = currentRows[target.rowIdx];
          const rowWidth = targetRow ? targetRow.blockIds.reduce((sum, bid) => sum + (currentBlocks[bid]?.w ?? 0), 0) : 0;
          const fitsInRow = targetRow && rowWidth + def.defaultW <= COLS && targetRow.blockIds.length < MAX_PER_ROW;
          const ghostY = fitsInRow ? target.rowY : target.totalH;
          const ghostH = fitsInRow ? target.rowH : def.defaultH;
          const ghostX = fitsInRow ? Math.min(rowWidth, COLS - def.defaultW) : 0;
          setGhostPos({ x: ghostX, y: ghostY, w: def.defaultW, h: ghostH });

          // Compute preview layout
          const newId = "__preview__";
          const previewBlock: CanvasBlock = { id: newId, type: def.type, label: def.label, color: def.color, w: def.defaultW };

          let previewRows: CanvasRow[];
          if (fitsInRow) {
            previewRows = currentRows.map((r, i) =>
              i === target.rowIdx ? { ...r, blockIds: [...r.blockIds, newId] } : r,
            );
          } else {
            const newRow: CanvasRow = { id: "rpreview", blockIds: [newId] };
            previewRows = [...currentRows.slice(0, target.rowIdx + 1), newRow, ...currentRows.slice(target.rowIdx + 1)];
          }

          const previewBlockMap = { ...currentBlocks, [newId]: previewBlock };
          const computed = layoutRows(previewRows, previewBlockMap, BLOCK_DEFS, COLS);
          setPreviewLayout(computed.filter((lb) => lb.id !== newId));
        }
      } else {
        setGhostPos(null);
        setPreviewLayout(null);
      }
    };

    const onUp = (e: MouseEvent) => {
      if (!dragTypeRef.current) return;
      const cell = canvasToGrid(e.clientX, e.clientY);
      if (cell) {
        const def = BLOCK_DEFS.find((bt) => bt.type === dragTypeRef.current);
        if (def) {
          const currentLayout = layoutRef.current;
          const currentRows = rowsRef.current;
          const currentBlocks = blocksRef.current;

          const newId = `b${Date.now()}`;
          const newBlock: CanvasBlock = {
            id: newId, type: def.type, label: def.label, color: def.color, w: def.defaultW,
          };

          // If insertTarget is set and that row is empty, place into it
          const curInsertTarget = insertTargetRef.current;
          if (curInsertTarget !== null && currentRows[curInsertTarget]?.blockIds.length === 0) {
            setRows((prev) => prev.map((r, i) =>
              i === curInsertTarget ? { ...r, blockIds: [newId] } : r,
            ));
            setInsertTarget(null);
          } else {
            const target = findTargetRow(cell.row, currentLayout, currentRows);
            const targetRow = currentRows[target.rowIdx];
            const rowWidth = targetRow ? targetRow.blockIds.reduce((sum, bid) => sum + (currentBlocks[bid]?.w ?? 0), 0) : 0;

            if (targetRow && rowWidth + def.defaultW <= COLS && targetRow.blockIds.length < MAX_PER_ROW) {
              setRows((prev) => prev.map((r, i) =>
                i === target.rowIdx ? { ...r, blockIds: [...r.blockIds, newId] } : r,
              ));
            } else {
              const newRow: CanvasRow = { id: `r${Date.now()}`, blockIds: [newId] };
              setRows((prev) => [...prev.slice(0, target.rowIdx + 1), newRow, ...prev.slice(target.rowIdx + 1)]);
            }
          }

          setBlocks((prev) => ({ ...prev, [newId]: newBlock }));
        }
      }
      setDragging(false);
      setDragCursor(null);
      setPreviewLayout(null);
      dragTypeRef.current = null;
      setGhostPos(null);
      setPlacingBlock(null);

      // Clean up listeners
      if (onMoveRef.current) window.removeEventListener("mousemove", onMoveRef.current);
      if (onUpRef.current) window.removeEventListener("mouseup", onUpRef.current);
      onMoveRef.current = null;
      onUpRef.current = null;
    };

    onMoveRef.current = onMove;
    onUpRef.current = onUp;
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [canvasToGrid, layoutRef, rowsRef, blocksRef, insertTargetRef, setBlocks, setRows, setInsertTarget]);

  const startDragWithListeners = useCallback((type: string) => {
    dragTypeRef.current = type;
    setDragging(true);
    setPlacingBlock(type);
    setShowLibrary(false);
    // Defer listener attachment to next tick so state is set
    requestAnimationFrame(() => attachDragListeners());
  }, [attachDragListeners, setShowLibrary]);

  return { dragging, dragCursor, placingBlock, ghostPos, previewLayout, startDragWithListeners };
}
