"use client";

import type { Workstation, Project } from "@/lib/types";
import DashboardHome from "@/components/workstation/dashboard/DashboardHome";
import TerminalWelcome from "@/components/workstation/terminal-welcome/TerminalWelcome";

interface HomeViewProps {
  workstations: Workstation[];
  overdueCount: number;
  onSelectWorkstation: (wsId: string) => void;
  onSelectProject: (project: Project, client: string) => void;
  onNewTabInWorkstation: (wsId: string) => void;
  onNewWorkstation: () => void;
}

export default function HomeView({ workstations, overdueCount, onSelectWorkstation, onSelectProject, onNewTabInWorkstation, onNewWorkstation }: HomeViewProps) {
  if (workstations.length > 0) {
    return (
      <DashboardHome
        workstations={workstations}
        onSelectWorkstation={onSelectWorkstation}
        onSelectProject={onSelectProject}
        onNewTabInWorkstation={onNewTabInWorkstation}
      />
    );
  }

  return (
    <TerminalWelcome
      activeCount={0}
      reviewCount={0}
      overdueCount={overdueCount}
      onOpenCmdPalette={() => {}}
      onNewWorkstation={onNewWorkstation}
    />
  );
}
