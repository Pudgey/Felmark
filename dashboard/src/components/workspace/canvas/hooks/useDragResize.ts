"use client";

import { useState, useEffect } from "react";
import type { CanvasBlock } from "../types";
import { BLOCK_DEFS, CELL, GAP, COLS } from "../registry";

export interface UseDragResizeReturn {
  resizing: boolean;
  startResize: (blockId: string, neighborId: string, startX: number, startW: number, neighborStartW: number) => void;
}

export function useDragResize(
  blocksRef: React.MutableRefObject<Record<string, CanvasBlock>>,
  setBlocks: React.Dispatch<React.SetStateAction<Record<string, CanvasBlock>>>,
): UseDragResizeReturn {
  const [resizeState, setResizeState] = useState<{
    blockId: string;
    neighborId: string;
    startX: number;
    startW: number;
    neighborStartW: number;
  } | null>(null);

  useEffect(() => {
    if (!resizeState) return;

    document.body.style.cursor = "col-resize";

    const def = BLOCK_DEFS.find(d => d.type === blocksRef.current[resizeState.blockId]?.type);
    const neighborDef = BLOCK_DEFS.find(d => d.type === blocksRef.current[resizeState.neighborId]?.type);
    const minW = def?.minW ?? 1;
    const neighborMinW = neighborDef?.minW ?? 1;
    const maxW = def?.maxW ?? COLS;
    const neighborMaxW = neighborDef?.maxW ?? COLS;
    const total = resizeState.startW + resizeState.neighborStartW;

    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - resizeState.startX;
      const colDelta = Math.round(delta / (CELL + GAP));

      let newW = Math.max(minW, Math.min(maxW, resizeState.startW + colDelta));
      let newNeighborW = Math.max(neighborMinW, Math.min(neighborMaxW, resizeState.neighborStartW - colDelta));

      if (newW + newNeighborW !== total) {
        if (newW === minW) newNeighborW = total - minW;
        else if (newNeighborW === neighborMinW) newW = total - neighborMinW;
        else newNeighborW = total - newW;
      }

      setBlocks(prev => ({
        ...prev,
        [resizeState.blockId]: { ...prev[resizeState.blockId], w: newW, userSized: true },
        [resizeState.neighborId]: { ...prev[resizeState.neighborId], w: newNeighborW, userSized: true },
      }));
    };

    const onUp = () => {
      document.body.style.cursor = "";
      setResizeState(null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [blocksRef, resizeState, setBlocks]);

  const startResize = (blockId: string, neighborId: string, startX: number, startW: number, neighborStartW: number) => {
    setResizeState({ blockId, neighborId, startX, startW, neighborStartW });
  };

  return {
    resizing: !!resizeState,
    startResize,
  };
}
