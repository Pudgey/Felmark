"use client";

import type { MoneyBlockData, MoneyBlockType } from "@/lib/types";
import RateCalc from "./RateCalc";
import PaySchedule from "./PaySchedule";
import ExpenseTracker from "./ExpenseTracker";
import MilestonePayment from "./MilestonePayment";
import TaxEstimate from "./TaxEstimate";
import PaymentButton from "./PaymentButton";

interface MoneyBlockProps {
  moneyData: MoneyBlockData;
  onUpdate?: (moneyData: MoneyBlockData) => void;
}

export default function MoneyBlock({ moneyData, onUpdate }: MoneyBlockProps) {
  const { moneyType } = moneyData;
  // Use default data if AI sent empty object or null
  const data = (moneyData.data && Object.keys(moneyData.data as object).length > 0)
    ? moneyData.data
    : getDefaultMoneyData(moneyType).data;

  const handleDataUpdate = (newData: unknown) => {
    onUpdate?.({ ...moneyData, data: newData });
  };

  switch (moneyType) {
    case "rate-calc":
      return <RateCalc data={data as any} onUpdate={handleDataUpdate} />;
    case "pay-schedule":
      return <PaySchedule data={data as any} />;
    case "expense":
      return <ExpenseTracker data={data as any} onUpdate={handleDataUpdate} />;
    case "milestone":
      return <MilestonePayment data={data as any} onUpdate={handleDataUpdate} />;
    case "tax":
      return <TaxEstimate data={data as any} />;
    case "payment":
      return <PaymentButton data={data as any} />;
    default:
      return <div style={{ padding: 16, color: "var(--ink-400)" }}>Unknown money block type</div>;
  }
}

export function getDefaultMoneyData(moneyType: MoneyBlockType): MoneyBlockData {
  switch (moneyType) {
    case "rate-calc":
      return { moneyType, data: { hours: 32, rate: 95 } };
    case "pay-schedule":
      return { moneyType, data: { total: 4800, items: [
        { id: "1", label: "Deposit", pct: 50, amount: 2400, status: "paid", date: "Mar 15", trigger: "On signing" },
        { id: "2", label: "Milestone", pct: 25, amount: 1200, status: "upcoming", date: "Apr 1", trigger: "After deliverables 1\u20133" },
        { id: "3", label: "Final", pct: 25, amount: 1200, status: "upcoming", date: "Apr 10", trigger: "On delivery" },
      ] } };
    case "expense":
      return { moneyType, data: { projectRevenue: 2400, expenses: [
        { id: "1", name: "Font license", amount: 45, category: "Software", date: "Mar 12" },
        { id: "2", name: "Stock photography", amount: 75, category: "Assets", date: "Mar 18" },
      ] } };
    case "milestone":
      return { moneyType, data: { milestones: [
        { id: "1", deliverable: "Logo usage rules", amount: 960, status: "paid", completedDate: "Mar 17", invoiceNum: "#045" },
        { id: "2", deliverable: "Color palette", amount: 960, status: "ready", completedDate: "Mar 21", invoiceNum: null },
        { id: "3", deliverable: "Typography scale", amount: 960, status: "pending", completedDate: null, invoiceNum: null },
      ] } };
    case "tax":
      return { moneyType, data: { annualEarnings: 142000, taxRate: 0.28, quarterlyPayments: [9940, 9940, 0, 0] as [number, number, number, number] } };
    case "payment":
      return { moneyType, data: { amount: 2400, label: "Brand Guidelines v2 \u2014 50% Deposit", client: "Meridian Studio" } };
  }
}

export const MONEY_TYPE_OPTIONS: { type: MoneyBlockType; icon: string; label: string }[] = [
  { type: "rate-calc", icon: "\u2297", label: "Rate Calc" },
  { type: "pay-schedule", icon: "\u25c6", label: "Schedule" },
  { type: "expense", icon: "\u2193", label: "Expenses" },
  { type: "milestone", icon: "\u2691", label: "Milestones" },
  { type: "tax", icon: "\u00a7", label: "Tax" },
  { type: "payment", icon: "$", label: "Payment" },
];
