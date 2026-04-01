"use client";

/* useDragMove — block drag-to-move (placeholder for future implementation) */

export interface UseDragMoveReturn {
  movingBlock: string | null;
  moveCursor: { x: number; y: number } | null;
  previewLayout: null;
  startMove: (blockId: string, clientX: number, clientY: number) => void;
}

export function useDragMove(): UseDragMoveReturn {
  /* Block drag-to-move is not yet implemented in Canvas.
     This hook exists as the extraction point for future implementation. */
  return {
    movingBlock: null,
    moveCursor: null,
    previewLayout: null,
    startMove: () => {},
  };
}
