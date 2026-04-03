"use client";

import { useState, useCallback } from "react";
import WorkspaceSidebar from "@/components/workspace/sidebar/WorkspaceSidebar";
import SplitPanes from "@/components/workspace/panes/SplitPanes";
import Toasts, { DEMO_TOASTS, type Toast } from "@/components/workspace/toasts/Toasts";

export default function WorkspaceRouter() {
  const [toasts, setToasts] = useState<Toast[]>(DEMO_TOASTS);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleAction = useCallback((id: string) => {
    // Future: route actions to the right surface
    dismissToast(id);
  }, [dismissToast]);

  return (
    <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex", position: "relative" }}>
      <WorkspaceSidebar />
      <SplitPanes />
      <Toasts toasts={toasts} onDismiss={dismissToast} onAction={handleAction} />
    </div>
  );
}
