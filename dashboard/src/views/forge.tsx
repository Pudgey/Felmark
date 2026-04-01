"use client";

import type { Block, Workstation, Tab } from "@/lib/types";
import ForgePaper from "@/components/workstation/forge-paper/ForgePaper";

interface ForgeViewProps {
  tabs: Tab[];
  activeBlocks: Block[];
  activeProject: string;
  workstations: Workstation[];
  onClose: () => void;
  onSave: (blocks: Block[]) => void;
}

export default function ForgeView({ tabs, activeBlocks, activeProject, workstations, onClose, onSave }: ForgeViewProps) {
  const activeTab = tabs.find(t => t.active);

  if (activeTab) {
    return (
      <ForgePaper
        initialBlocks={activeBlocks}
        workstation={workstations.find(w => w.projects.some(p => p.id === activeProject))}
        projectName={activeTab.name || "Untitled"}
        onClose={onClose}
        onSave={onSave}
      />
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40, background: "var(--parchment)" }}>
      <div style={{ fontSize: 16, fontWeight: 500, color: "var(--ink-500)", marginBottom: 6 }}>Open a project to use Forge Paper</div>
      <div style={{ fontSize: 13, color: "var(--ink-400)", lineHeight: 1.5, maxWidth: 280, marginBottom: 20 }}>Forge is a document surface, so it needs an active project context before it can render.</div>
      <button style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid var(--panel-border)", background: "var(--warm-100)", color: "var(--ink-600)", fontSize: 13, cursor: "pointer" }} onClick={onClose}>
        Go to workstations
      </button>
    </div>
  );
}
