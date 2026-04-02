import type { Project, Workstation } from "@/lib/types";
import type { FinanceAmountSummary, FinanceShellSummary, FinanceWorkstationSummary } from "./types";

const COMPACT_CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

function makeAmountSummary(value: number): FinanceAmountSummary {
  return {
    value,
    display: COMPACT_CURRENCY.format(value),
  };
}

export function parseProjectAmount(amount: string): number {
  const match = amount.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(",", ""), 10) : 0;
}

function isCollectedProject(project: Project): boolean {
  return project.status === "completed";
}

export function selectWorkstationFinanceSummary(workstation: Workstation): FinanceWorkstationSummary {
  const collectedValue = workstation.projects
    .filter(isCollectedProject)
    .reduce((total, project) => total + parseProjectAmount(project.amount), 0);
  const outstandingValue = workstation.projects
    .filter(project => !isCollectedProject(project))
    .reduce((total, project) => total + parseProjectAmount(project.amount), 0);

  return {
    workstationId: workstation.id,
    collected: makeAmountSummary(collectedValue),
    outstanding: makeAmountSummary(outstandingValue),
    pipeline: makeAmountSummary(collectedValue + outstandingValue),
  };
}

export function selectWorkstationFinanceSummaries(workstations: Workstation[]): FinanceWorkstationSummary[] {
  return workstations.map(selectWorkstationFinanceSummary);
}

export function selectFinanceShellSummary(workstations: Workstation[]): FinanceShellSummary {
  const workstationSummaries = selectWorkstationFinanceSummaries(workstations);
  const collectedValue = workstationSummaries.reduce((total, workstation) => total + workstation.collected.value, 0);
  const outstandingValue = workstationSummaries.reduce((total, workstation) => total + workstation.outstanding.value, 0);
  const pipelineValue = collectedValue + outstandingValue;

  return {
    collected: makeAmountSummary(collectedValue),
    outstanding: makeAmountSummary(outstandingValue),
    pipeline: makeAmountSummary(pipelineValue),
    hasTrackedRevenue: pipelineValue > 0,
  };
}
