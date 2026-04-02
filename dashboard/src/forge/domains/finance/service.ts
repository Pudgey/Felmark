import type { StateUpdater } from "../../types";
import { selectFinanceShellSummary, selectWorkstationFinanceSummary, selectWorkstationFinanceSummaries } from "./selectors";

export function createFinanceServices(state: Pick<StateUpdater, "getState">) {
  return {
    getShellSummary() {
      return selectFinanceShellSummary(state.getState().workstations);
    },

    getWorkstationSummary(workstationId: string) {
      const workstation = state.getState().workstations.find(item => item.id === workstationId);
      return workstation ? selectWorkstationFinanceSummary(workstation) : null;
    },

    getWorkstationSummaries() {
      return selectWorkstationFinanceSummaries(state.getState().workstations);
    },
  };
}
