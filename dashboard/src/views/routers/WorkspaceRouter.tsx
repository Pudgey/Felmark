"use client";

import { useState, useCallback, createContext, useContext } from "react";
import WorkspaceSidebar from "@/components/workspace/sidebar/WorkspaceSidebar";
import SplitPanes, { HybridHeader } from "@/components/workspace/panes/SplitPanes";
import Toasts, { DEMO_TOASTS, type Toast } from "@/components/workspace/toasts/Toasts";
import ClientHub from "@/components/workspace/hub/ClientHub";

/* ── Workspace navigation context ── */
export interface HubTab {
  clientId: string;
  clientName: string;
  clientAvatar: string;
  clientColor: string;
}

interface WorkspaceNav {
  activeView: "workspace" | "hub";
  hubTab: HubTab | null;
  openHub: (client: HubTab) => void;
  closeHub: () => void;
}

const WorkspaceNavContext = createContext<WorkspaceNav>({
  activeView: "workspace",
  hubTab: null,
  openHub: () => {},
  closeHub: () => {},
});

export const useWorkspaceNav = () => useContext(WorkspaceNavContext);

export default function WorkspaceRouter() {
  const [toasts, setToasts] = useState<Toast[]>(DEMO_TOASTS);
  const [activeView, setActiveView] = useState<"workspace" | "hub">("workspace");
  const [hubTab, setHubTab] = useState<HubTab | null>(null);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleAction = useCallback((id: string) => {
    dismissToast(id);
  }, [dismissToast]);

  // Deduplication guard: if same client already open, just focus it
  const openHub = useCallback((client: HubTab) => {
    if (hubTab?.clientId === client.clientId) {
      setActiveView("hub");
      return;
    }
    setHubTab(client);
    setActiveView("hub");
  }, [hubTab]);

  const closeHub = useCallback(() => {
    setActiveView("workspace");
  }, []);

  const nav: WorkspaceNav = { activeView, hubTab, openHub, closeHub };

  return (
    <WorkspaceNavContext.Provider value={nav}>
      <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Header — always visible */}
        <HybridHeader activeTab={activeView === "hub" ? "hub" : "workspace"} topSurface="money" bottomSurface="work" />

        {/* Content area */}
        <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>
          {activeView === "workspace" && (
            <>
              <WorkspaceSidebar />
              <SplitPanes />
            </>
          )}
          {activeView === "hub" && hubTab && (
            <ClientHub
              clientId={hubTab.clientId}
              clientName={hubTab.clientName}
              clientAvatar={hubTab.clientAvatar}
              clientColor={hubTab.clientColor}
              onClose={closeHub}
            />
          )}
        </div>

        <Toasts toasts={toasts} onDismiss={dismissToast} onAction={handleAction} />
      </div>
    </WorkspaceNavContext.Provider>
  );
}
