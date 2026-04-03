"use client";

import React, { useState, useCallback, useRef, useEffect, type Dispatch, type SetStateAction } from "react";

export interface UseShellLayoutResult {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  railActive: string;
  setRailActive: Dispatch<SetStateAction<string>>;
  sidebarWidth: number;
  setSidebarWidth: Dispatch<SetStateAction<number>>;
  isResizing: boolean;
  setIsResizing: Dispatch<SetStateAction<boolean>>;
  calendarScrollTarget: string | null;
  setCalendarScrollTarget: Dispatch<SetStateAction<string | null>>;
  launchpadOpen: boolean;
  setLaunchpadOpen: Dispatch<SetStateAction<boolean>>;
  zenMode: boolean;
  setZenMode: Dispatch<SetStateAction<boolean>>;
  splitProject: string | null;
  setSplitProject: Dispatch<SetStateAction<string | null>>;
  resizeRef: React.MutableRefObject<{ startX: number; startW: number } | null>;
  restoreWorkstationContext: () => void;
  onResizeHandleMouseDown: (e: React.MouseEvent) => void;
}

export function useShellLayout(): UseShellLayoutResult {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [railActive, setRailActive] = useState("workstations");
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const [calendarScrollTarget, setCalendarScrollTarget] = useState<string | null>(null);
  const [launchpadOpen, setLaunchpadOpen] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [splitProject, setSplitProject] = useState<string | null>(null);
  const resizeRef = useRef<{ startX: number; startW: number } | null>(null);

  const restoreWorkstationContext = useCallback(() => {
    setRailActive("workstations");
    setLaunchpadOpen(false);
    setSidebarOpen(true);
  }, []);

  const onResizeHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    resizeRef.current = { startX: e.clientX, startW: sidebarWidth };
    setIsResizing(true);

    const onMouseMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      const delta = ev.clientX - resizeRef.current.startX;
      const newW = Math.min(720, Math.max(220, resizeRef.current.startW + delta));
      setSidebarWidth(newW);
    };

    const onMouseUp = () => {
      resizeRef.current = null;
      setIsResizing(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [sidebarWidth]);

  // Zen mode: Escape to exit
  useEffect(() => {
    if (!zenMode) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZenMode(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [zenMode]);

  return {
    sidebarOpen,
    setSidebarOpen,
    railActive,
    setRailActive,
    sidebarWidth,
    setSidebarWidth,
    isResizing,
    setIsResizing,
    calendarScrollTarget,
    setCalendarScrollTarget,
    launchpadOpen,
    setLaunchpadOpen,
    zenMode,
    setZenMode,
    splitProject,
    setSplitProject,
    resizeRef,
    restoreWorkstationContext,
    onResizeHandleMouseDown,
  };
}
