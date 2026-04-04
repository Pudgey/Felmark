import { useRef, useCallback, useEffect } from "react";
import type { CanvasElement } from "@/lib/types";

const MAX_UNDO = 50;

export function useCanvasUndo(elements: CanvasElement[], onUpdate: (data: { elements: CanvasElement[] }) => void) {
  const undoStack = useRef<CanvasElement[][]>([]);
  const redoStack = useRef<CanvasElement[][]>([]);
  const lastSnapshot = useRef<CanvasElement[]>(elements);

  useEffect(() => { lastSnapshot.current = elements; }, [elements]);

  const pushUndo = useCallback(() => {
    undoStack.current.push(lastSnapshot.current);
    redoStack.current = [];
    if (undoStack.current.length > MAX_UNDO) undoStack.current.shift();
  }, []);

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return;
    redoStack.current.push(elements);
    const prev = undoStack.current.pop()!;
    onUpdate({ elements: prev });
  }, [elements, onUpdate]);

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return;
    undoStack.current.push(elements);
    const next = redoStack.current.pop()!;
    onUpdate({ elements: next });
  }, [elements, onUpdate]);

  return {
    pushUndo,
    undo,
    redo,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
  };
}
