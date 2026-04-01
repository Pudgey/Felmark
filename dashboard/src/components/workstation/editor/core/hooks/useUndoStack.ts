"use client";

import { useState, useRef, useCallback } from "react";
import type { Block } from "@/lib/types";

export function useUndoStack() {
  const [undoAction, setUndoAction] = useState<{ label: string; snapshot: Block[]; focusId?: string } | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushUndoAction = useCallback((label: string, snapshot: Block[], focusId?: string) => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndoAction({ label, snapshot: structuredClone(snapshot), focusId });
    undoTimer.current = setTimeout(() => setUndoAction(null), 5000);
  }, []);

  return {
    undoAction,
    setUndoAction,
    undoTimer,
    pushUndoAction,
  };
}
