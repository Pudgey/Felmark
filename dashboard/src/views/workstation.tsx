"use client";

import type { Workstation, Project } from "@/lib/types";
import WorkstationHome from "@/components/workstation/Workstation";

interface WorkstationViewProps {
  workstations: Workstation[];
  activeWorkstationId: string;
  onSelectProject: (project: Project, client: string) => void;
  onNewTab: () => void;
  onRenameWorkstation: (wsId: string, name: string) => void;
  onUpdateProjectDue: (projectId: string, due: string | null) => void;
}

export default function WorkstationView({ workstations, activeWorkstationId, onSelectProject, onNewTab, onRenameWorkstation, onUpdateProjectDue }: WorkstationViewProps) {
  const ws = workstations.find(w => w.id === activeWorkstationId);
  if (!ws) return null;

  return (
    <WorkstationHome
      workstation={ws}
      onSelectProject={onSelectProject}
      onNewTab={onNewTab}
      onRenameWorkstation={onRenameWorkstation}
      onUpdateProjectDue={onUpdateProjectDue}
    />
  );
}
