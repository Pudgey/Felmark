import type { ComponentType } from "react";
import ClientsPane from "./ClientsPane";
import MoneyPane from "./MoneyPane";
import PipelinePane from "./PipelinePane";
import SignalsPane from "./SignalsPane";
import TerminalPane from "./TerminalPane";
import TimePane from "./TimePane";
import WorkPane from "./WorkPane";

export const SURFACES = [
  { id: "money", label: "Money", icon: "$", desc: "Invoices, revenue, payments", action: "+ New Invoice", shortcut: "N", stateVal: "$14.8k", stateLb: "earned", color: "#26a69a" },
  { id: "work", label: "Work", icon: "\u25c6", desc: "Tasks, timers, subtasks", action: "+ New Task", shortcut: "\u21e7N", stateVal: "5", stateLb: "active", color: "#2962ff" },
  { id: "signals", label: "Signals", icon: "\u25ce", desc: "Client activity feed", action: "View Signals", shortcut: "S", stateVal: "3", stateLb: "new", color: "#ff9800" },
  { id: "pipeline", label: "Pipeline", icon: "\u2192", desc: "Deals, proposals, contracts", action: "+ New Deal", shortcut: "P", stateVal: "4", stateLb: "deals", color: "#26a69a" },
  { id: "clients", label: "Clients", icon: "\u25c7", desc: "Client records & contacts", action: "+ Add Client", shortcut: "C", stateVal: "4", stateLb: "total", color: "#2962ff" },
  { id: "time", label: "Time", icon: "\u25b6", desc: "Time entries & tracking", action: "\u25b6 Start Timer", shortcut: "T", stateVal: "7.2h", stateLb: "today", color: "#ff9800" },
  { id: "terminal", label: "Terminal", icon: "\u25b8", desc: "Forge command line", action: "Open Terminal", shortcut: "`", stateVal: "forge", stateLb: "ready", color: "#26a69a" },
] as const;

export type SurfaceId = (typeof SURFACES)[number]["id"];

export const SURFACE_CONTEXT: Record<SurfaceId, string> = {
  money: "4 invoices \u00b7 $14,800 earned",
  work: "5 tasks \u00b7 2 active",
  signals: "5 signals \u00b7 2 urgent",
  pipeline: "4 deals \u00b7 $18,500 pipeline",
  clients: "4 clients \u00b7 1 overdue",
  time: "7.1h today \u00b7 $833 value",
  terminal: "forge \u00b7 ready",
};

export const SURFACE_COMPONENTS: Record<SurfaceId, ComponentType> = {
  money: MoneyPane,
  work: WorkPane,
  signals: SignalsPane,
  pipeline: PipelinePane,
  clients: ClientsPane,
  time: TimePane,
  terminal: TerminalPane,
};

export function getSurfaceMeta(surfaceId: SurfaceId) {
  return SURFACES.find((surface) => surface.id === surfaceId)!;
}
