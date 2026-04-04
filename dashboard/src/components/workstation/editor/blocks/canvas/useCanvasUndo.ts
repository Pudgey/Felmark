import { useRef, useCallback, useEffect, useState } from "react";
import type { CanvasElement } from "@/lib/types";

const MAX_UNDO = 50;

export function useCanvasUndo(elements: CanvasElement[], onUpdate: (data: { elements: CanvasElement[] }) => void) {
  const undoStack = useRef<CanvasElement[][]>([]);
  const redoStack = useRef<CanvasElement[][]>([]);
  const lastSnapshot = useRef<CanvasElement[]>(elements);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    lastSnapshot.current = elements;
  }, [elements]);

  const syncFlags = useCallback(() => {
    setCanUndo(undoStack.current.length > 0);
    setCanRedo(redoStack.current.length > 0);
  }, []);

  const pushUndo = useCallback(() => {
    undoStack.current.push(lastSnapshot.current);
    redoStack.current = [];
    if (undoStack.current.length > MAX_UNDO) undoStack.current.shift();
    syncFlags();
  }, [syncFlags]);

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return;
    redoStack.current.push(elements);
    const prev = undoStack.current.pop()!;
    onUpdate({ elements: prev });
    syncFlags();
  }, [elements, onUpdate, syncFlags]);

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return;
    undoStack.current.push(elements);
    const next = redoStack.current.pop()!;
    onUpdate({ elements: next });
    syncFlags();
  }, [elements, onUpdate, syncFlags]);

  return { pushUndo, undo, redo, canUndo, canRedo };
}
