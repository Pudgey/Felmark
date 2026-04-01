import type { ReactNode } from "react";
import type { Workstation, Project } from "@/lib/types";

export interface TerminalBlock {
  id: string;
  type: "command" | "output" | "welcome" | "error" | "whisper" | "nudge" | "alert" | "loading" | "nl-response";
  command?: string;
  content: ReactNode;
  timestamp: number;
  /** For whisper/nudge/alert: unique key for dismiss tracking */
  insightKey?: string;
  /** For nudge/alert: structured data */
  insight?: AmbientInsight;
}

export interface TerminalSessionState {
  blocks: TerminalBlock[];
  inputHistory: string[];
  dismissedInsightKeys: string[];
}

export interface AmbientInsight {
  tier: "whisper" | "nudge" | "alert";
  text: string;
  reason?: string;
  action?: { label: string; command: string } | null;
}

export interface NLResponseData {
  type: "table" | "list" | "metric" | "card";
  content: unknown;
}

export interface ParsedCommand {
  raw: string;
  command: string;
  action: string;
  args: Record<string, string>;
  positional: string[];
}

export interface CommandHandlerContext {
  workstations: Workstation[];
  projects: { project: Project; client: string; workstationId: string }[];
  activeProject: string | null;
}

export type CommandHandler = (
  parsed: ParsedCommand,
  context: CommandHandlerContext
) => ReactNode;

export interface CommandRegistryEntry {
  handler: CommandHandler;
  description: string;
  icon: string;
  category: string;
  usage?: string;
}

export interface TerminalContextType {
  workstations: Workstation[];
  projects: { project: Project; client: string; workstationId: string }[];
  activeProject: string | null;
  blocks: TerminalBlock[];
  addBlock: (block: TerminalBlock) => void;
  clearBlocks: () => void;
  executeCommand: (input: string) => void;
  inputHistory: string[];
  /** D5: Dismissed insight keys */
  dismissedInsights: Set<string>;
  dismissInsight: (key: string) => void;
  /** D7: Execute an action from a nudge/alert */
  executeAction: (command: string) => void;
  /** D6: Send a natural language query */
  sendNLQuery: (query: string) => void;
}
