"use client";

import WorkstationRouter, { type WorkstationRouterProps } from "./routers/WorkstationRouter";
import DashboardRouter, { type DashboardRouterProps } from "./routers/DashboardRouter";
import WorkspaceRouter from "./routers/WorkspaceRouter";

function getDomain(railActive: string): "workstation" | "workspace" | "dashboard" {
  if (railActive === "workspace") return "workspace";
  if (railActive === "workstations" || railActive === "forge") return "workstation";
  return "dashboard";
}

export interface ViewRouterProps {
  railActive: string;
  onNavigateHome: () => void;
  workstationProps: WorkstationRouterProps;
  dashboardProps: DashboardRouterProps;
}

export default function ViewRouter({ railActive, onNavigateHome, workstationProps, dashboardProps }: ViewRouterProps) {
  const domain = getDomain(railActive);

  switch (domain) {
    case "workspace":
      return <WorkspaceRouter onNavigateHome={onNavigateHome} />;
    case "workstation":
      return <WorkstationRouter railActive={railActive} {...workstationProps} />;
    case "dashboard":
      return <DashboardRouter railActive={railActive} {...dashboardProps} />;
  }
}
