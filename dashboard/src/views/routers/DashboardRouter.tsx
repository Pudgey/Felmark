"use client";

import type { Workstation, Project } from "@/lib/types";
import HomeView from "../home";
import CalendarView from "../calendar";
import SearchView from "../search";
import TemplatesView from "../templates";
import WireView from "../wire";
import TeamView from "../team";

export interface DashboardRouterProps {
  workstations: Workstation[];
  overdueCount: number;
  calendarScrollTarget: string | null;
  onSelectWorkstation: (wsId: string) => void;
  onSelectProject: (project: Project, client: string) => void;
  onNewTabInWorkstation: (wsId: string) => void;
  onNewWorkstation: () => void;
  onCalendarOpenProject: (projectId: string) => void;
  onCalendarScrollComplete: () => void;
  onNavigateRail: (item: string) => void;
}

export default function DashboardRouter({ railActive, ...props }: DashboardRouterProps & { railActive: string }) {
  const wrap = (child: React.ReactNode) => (
    <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex" }}>
      {child}
    </div>
  );

  switch (railActive) {
    case "home":
      return wrap(
        <HomeView
          workstations={props.workstations}
          overdueCount={props.overdueCount}
          onSelectWorkstation={props.onSelectWorkstation}
          onSelectProject={props.onSelectProject}
          onNewTabInWorkstation={props.onNewTabInWorkstation}
          onNewWorkstation={props.onNewWorkstation}
        />
      );
    case "calendar":
      return wrap(
        <CalendarView
          workstations={props.workstations}
          onOpenProject={props.onCalendarOpenProject}
          scrollToProjectId={props.calendarScrollTarget}
          onScrollComplete={props.onCalendarScrollComplete}
        />
      );
    case "search":
      return wrap(<SearchView workstations={props.workstations} />);
    case "templates":
      return wrap(<TemplatesView />);
    case "wire":
      return wrap(<WireView workstations={props.workstations} />);
    case "team":
      return wrap(<TeamView />);
    default:
      return wrap(
        <HomeView
          workstations={props.workstations}
          overdueCount={props.overdueCount}
          onSelectWorkstation={props.onSelectWorkstation}
          onSelectProject={props.onSelectProject}
          onNewTabInWorkstation={props.onNewTabInWorkstation}
          onNewWorkstation={props.onNewWorkstation}
        />
      );
  }
}
