"use client";

import type { Workstation } from "@/lib/types";
import TerminalWelcome from "@/components/workstation/terminal-welcome/TerminalWelcome";

interface TerminalWelcomeViewProps {
  workstations: Workstation[];
  overdueCount: number;
  onNewWorkstation: () => void;
}

export default function TerminalWelcomeView({ workstations, overdueCount, onNewWorkstation }: TerminalWelcomeViewProps) {
  return (
    <TerminalWelcome
      activeCount={workstations.reduce((s, w) => s + w.projects.filter(p => p.status !== "completed").length, 0)}
      reviewCount={workstations.reduce((s, w) => s + w.projects.filter(p => p.status === "review").length, 0)}
      overdueCount={overdueCount}
      onOpenCmdPalette={() => {}}
      onNewWorkstation={onNewWorkstation}
    />
  );
}
