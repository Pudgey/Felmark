export interface FinanceAmountSummary {
  value: number;
  display: string;
}

export interface FinanceWorkstationSummary {
  workstationId: string;
  collected: FinanceAmountSummary;
  outstanding: FinanceAmountSummary;
  pipeline: FinanceAmountSummary;
}

export interface FinanceShellSummary {
  collected: FinanceAmountSummary;
  outstanding: FinanceAmountSummary;
  pipeline: FinanceAmountSummary;
  hasTrackedRevenue: boolean;
}
