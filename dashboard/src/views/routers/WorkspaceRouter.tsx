"use client";

import { useState, useCallback, createContext, useContext } from "react";
import WorkspaceSidebar from "@/components/workspace/sidebar/WorkspaceSidebar";
import SplitPanes, { HybridHeader } from "@/components/workspace/panes/SplitPanes";
import Toasts, { DEMO_TOASTS, type Toast } from "@/components/workspace/toasts/Toasts";
import ClientHub from "@/components/workspace/hub/ClientHub";
import NewTab from "@/components/workspace/newtab/NewTab";
import PipelineBoard from "@/components/workstation/pipeline/PipelineBoard";
import FinancePage from "@/components/workstation/finance/FinancePage";
import ServicesPage from "@/components/workstation/services/ServicesPage";

/* ── Workspace navigation context ── */
export interface HubTab {
  clientId: string;
  clientName: string;
  clientAvatar: string;
  clientColor: string;
}

export interface ToolTab {
  id: string;
  type: "pipeline" | "finance" | "services" | "team" | "wire";
  label: string;
  icon: string;
}

interface WorkspaceNav {
  activeView: "workspace" | "hub" | "newtab" | "tool";
  hubTab: HubTab | null;
  hubTabs: HubTab[];
  activeHubId: string | null;
  toolTabs: ToolTab[];
  activeToolId: string | null;
  activeTool: ToolTab | null;
  openHub: (client: HubTab) => void;
  closeHubTab: (clientId: string) => void;
  switchHub: (clientId: string) => void;
  openTool: (type: ToolTab["type"]) => void;
  closeToolTab: (id: string) => void;
  switchTool: (id: string) => void;
  goToWorkspace: () => void;
  openNewTab: () => void;
}

const TOOL_DEFS: Record<ToolTab["type"], { label: string; icon: string }> = {
  pipeline: { label: "Pipeline", icon: "\u2192" },
  finance: { label: "Finance", icon: "$" },
  services: { label: "Services", icon: "\u25c7" },
  team: { label: "Team", icon: "\u25cb" },
  wire: { label: "Wire", icon: "\u223c" },
};

const WorkspaceNavContext = createContext<WorkspaceNav>({
  activeView: "workspace",
  hubTab: null,
  hubTabs: [],
  activeHubId: null,
  toolTabs: [],
  activeToolId: null,
  activeTool: null,
  openHub: () => {},
  closeHubTab: () => {},
  switchHub: () => {},
  openTool: () => {},
  closeToolTab: () => {},
  switchTool: () => {},
  goToWorkspace: () => {},
  openNewTab: () => {},
});

export const useWorkspaceNav = () => useContext(WorkspaceNavContext);

export default function WorkspaceRouter() {
  const [toasts, setToasts] = useState<Toast[]>(DEMO_TOASTS);
  const [activeView, setActiveView] = useState<"workspace" | "hub" | "newtab" | "tool">("workspace");
  const [hubTabs, setHubTabs] = useState<HubTab[]>([]);
  const [activeHubId, setActiveHubId] = useState<string | null>(null);
  const [toolTabs, setToolTabs] = useState<ToolTab[]>([]);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  const hubTab = hubTabs.find(t => t.clientId === activeHubId) ?? null;
  const activeTool = toolTabs.find(t => t.id === activeToolId) ?? null;

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleAction = useCallback((id: string) => {
    dismissToast(id);
  }, [dismissToast]);

  // Deduplication: if client already has a tab, focus it. Otherwise create new tab.
  const openHub = useCallback((client: HubTab) => {
    setHubTabs(prev => {
      if (prev.some(t => t.clientId === client.clientId)) return prev;
      return [...prev, client];
    });
    setActiveHubId(client.clientId);
    setActiveView("hub");
  }, []);

  const closeHubTab = useCallback((clientId: string) => {
    setHubTabs(prev => {
      const next = prev.filter(t => t.clientId !== clientId);
      if (next.length === 0) {
        setActiveView("workspace");
        setActiveHubId(null);
      } else if (activeHubId === clientId) {
        // Switch to the last remaining tab
        setActiveHubId(next[next.length - 1].clientId);
      }
      return next;
    });
  }, [activeHubId]);

  const switchHub = useCallback((clientId: string) => {
    setActiveHubId(clientId);
    setActiveView("hub");
  }, []);

  // Tool tabs: dedup by type (only one Pipeline, one Finance, etc.)
  const openTool = useCallback((type: ToolTab["type"]) => {
    const existing = toolTabs.find(t => t.type === type);
    if (existing) {
      setActiveToolId(existing.id);
      setActiveView("tool");
      return;
    }
    const def = TOOL_DEFS[type];
    const newTab: ToolTab = { id: `tool-${type}`, type, label: def.label, icon: def.icon };
    setToolTabs(prev => [...prev, newTab]);
    setActiveToolId(newTab.id);
    setActiveView("tool");
  }, [toolTabs]);

  const closeToolTab = useCallback((id: string) => {
    setToolTabs(prev => {
      const next = prev.filter(t => t.id !== id);
      if (next.length === 0 && activeView === "tool") {
        setActiveView("workspace");
        setActiveToolId(null);
      } else if (activeToolId === id) {
        setActiveToolId(next[next.length - 1]?.id ?? null);
        if (next.length === 0) setActiveView("workspace");
      }
      return next;
    });
  }, [activeToolId, activeView]);

  const switchTool = useCallback((id: string) => {
    setActiveToolId(id);
    setActiveView("tool");
  }, []);

  const goToWorkspace = useCallback(() => {
    setActiveView("workspace");
  }, []);

  const openNewTab = useCallback(() => {
    setActiveView("newtab");
  }, []);

  const nav: WorkspaceNav = { activeView, hubTab, hubTabs, activeHubId, toolTabs, activeToolId, activeTool, openHub, closeHubTab, switchHub, openTool, closeToolTab, switchTool, goToWorkspace, openNewTab };

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
          {activeView === "newtab" && <NewTab />}
          {activeView === "tool" && activeTool && (
            <div style={{ flex: 1, overflow: "auto" }}>
              {activeTool.type === "pipeline" && <PipelineBoard />}
              {activeTool.type === "finance" && <FinancePage />}
              {activeTool.type === "services" && <ServicesPage />}
              {/* Future: team, wire */}
            </div>
          )}
          {activeView === "hub" && hubTab && (
            <ClientHub
              clientId={hubTab.clientId}
              clientName={hubTab.clientName}
              clientAvatar={hubTab.clientAvatar}
              clientColor={hubTab.clientColor}
              onClose={() => closeHubTab(hubTab.clientId)}
            />
          )}
        </div>

        <Toasts toasts={toasts} onDismiss={dismissToast} onAction={handleAction} />
      </div>
    </WorkspaceNavContext.Provider>
  );
}
