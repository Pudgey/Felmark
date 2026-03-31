import type { ReactNode } from "react";
import type { Workspace, Project } from "@/lib/types";

export interface TerminalBlock {
  id: string;
  type: "command" | "output" | "welcome" | "error";
  command?: string;
  content: ReactNode;
  timestamp: number;
}

export interface ParsedCommand {
  raw: string;
  command: string;
  action: string;
  args: Record<string, string>;
  positional: string[];
}

export interface CommandHandlerContext {
  workspaces: Workspace[];
  projects: { project: Project; client: string; workspaceId: string }[];
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
  workspaces: Workspace[];
  projects: { project: Project; client: string; workspaceId: string }[];
  activeProject: string | null;
  blocks: TerminalBlock[];
  addBlock: (block: TerminalBlock) => void;
  clearBlocks: () => void;
  executeCommand: (input: string) => void;
  inputHistory: string[];
}
