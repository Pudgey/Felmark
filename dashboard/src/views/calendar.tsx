"use client";

import type { Workstation } from "@/lib/types";
import CalendarFull from "@/components/workstation/calendar/CalendarFull";

interface CalendarViewProps {
  workstations: Workstation[];
  onOpenProject: (projectId: string) => void;
  scrollToProjectId?: string | null;
  onScrollComplete: () => void;
}

export default function CalendarView({ workstations, onOpenProject, scrollToProjectId, onScrollComplete }: CalendarViewProps) {
  return (
    <CalendarFull
      workstations={workstations}
      onOpenProject={onOpenProject}
      scrollToProjectId={scrollToProjectId}
      onScrollComplete={onScrollComplete}
    />
  );
}
