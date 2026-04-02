import type { StateUpdater } from "../types";
import type { FinanceShellSummary } from "../domains/finance/types";
import { selectFinanceShellSummary, selectWorkstationFinanceSummaries } from "../domains/finance/selectors";

export interface SidebarWorkstationSummary {
  workstationId: string;
  projectCount: number;
  activeProjects: number;
  overdueProjects: number;
  completedProjects: number;
  revenueDisplay: string | null;
}

export interface SidebarShellSummary {
  finance: FinanceShellSummary;
  activeProjects: number;
  overdueProjects: number;
  totalProjects: number;
  completedProjects: number;
  completionRate: number;
  workstations: Record<string, SidebarWorkstationSummary>;
}

export function createSidebarReadModels(state: Pick<StateUpdater, "getState">) {
  return {
    getSummary(): SidebarShellSummary {
      const { workstations } = state.getState();
      const finance = selectFinanceShellSummary(workstations);
      const financeByWorkstation = new Map(
        selectWorkstationFinanceSummaries(workstations).map(summary => [summary.workstationId, summary]),
      );

      const workstationsById = Object.fromEntries(workstations.map(workstation => {
        const financeSummary = financeByWorkstation.get(workstation.id);
        const activeProjects = workstation.projects.filter(project => project.status === "active").length;
        const overdueProjects = workstation.projects.filter(project => project.status === "overdue").length;
        const completedProjects = workstation.projects.filter(project => project.status === "completed").length;

        return [
          workstation.id,
          {
            workstationId: workstation.id,
            projectCount: workstation.projects.length,
            activeProjects,
            overdueProjects,
            completedProjects,
            revenueDisplay: financeSummary && finance.hasTrackedRevenue ? financeSummary.pipeline.display : null,
          },
        ] satisfies [string, SidebarWorkstationSummary];
      }));

      const totalProjects = workstations.reduce((total, workstation) => total + workstation.projects.length, 0);
      const completedProjects = workstations.reduce((total, workstation) => {
        return total + workstation.projects.filter(project => project.status === "completed").length;
      }, 0);

      return {
        finance,
        activeProjects: workstations.reduce((total, workstation) => {
          return total + workstation.projects.filter(project => project.status === "active").length;
        }, 0),
        overdueProjects: workstations.reduce((total, workstation) => {
          return total + workstation.projects.filter(project => project.status === "overdue").length;
        }, 0),
        totalProjects,
        completedProjects,
        completionRate: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0,
        workstations: workstationsById,
      };
    },
  };
}
