"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import type { Workspace, Project } from "@/lib/types";
import type { TerminalBlock, TerminalContextType, CommandHandlerContext } from "@/lib/terminal/types";
import { parseCommand } from "@/lib/terminal/parser";
import { COMMAND_REGISTRY } from "@/lib/terminal/commands";

const TerminalContext = createContext<TerminalContextType | null>(null);

export function useTerminalContext() {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminalContext must be used within TerminalProvider");
  return ctx;
}

interface TerminalProviderProps {
  workspaces: Workspace[];
  activeProject: string;
  children: ReactNode;
}

let blockIdCounter = 0;
function nextBlockId() {
  return `tb_${++blockIdCounter}_${Date.now()}`;
}

export default function TerminalProvider({ workspaces, activeProject, children }: TerminalProviderProps) {
  const [blocks, setBlocks] = useState<TerminalBlock[]>([]);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const workspacesRef = useRef(workspaces);
  workspacesRef.current = workspaces;

  const allProjects: { project: Project; client: string; workspaceId: string }[] = workspaces.flatMap(
    ws => ws.projects.map(p => ({ project: p, client: ws.client, workspaceId: ws.id }))
  );

  const addBlock = useCallback((block: TerminalBlock) => {
    setBlocks(prev => [...prev, block]);
  }, []);

  const clearBlocks = useCallback(() => {
    setBlocks([]);
  }, []);

  const executeCommand = useCallback((input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setInputHistory(prev => [...prev, trimmed]);
    const parsed = parseCommand(trimmed);

    // Special case: clear
    if (parsed.command === "clear") {
      clearBlocks();
      return;
    }

    const entry = COMMAND_REGISTRY[parsed.command];
    if (!entry) {
      // Unknown command
      const errorBlock: TerminalBlock = {
        id: nextBlockId(),
        type: "error",
        command: trimmed,
        content: (
          <div style={{ fontFamily: "var(--mono), 'JetBrains Mono', monospace", fontSize: 12, color: "#dc2626" }}>
            Unknown command: <strong>{parsed.command}</strong>
            <div style={{ color: "#9b988f", marginTop: 4, fontSize: 11 }}>
              Available: {Object.keys(COMMAND_REGISTRY).map(k => `/${k}`).join(", ")}
            </div>
          </div>
        ),
        timestamp: Date.now(),
      };
      setBlocks(prev => [...prev, errorBlock]);
      return;
    }

    const context: CommandHandlerContext = {
      workspaces: workspacesRef.current,
      projects: workspacesRef.current.flatMap(ws =>
        ws.projects.map(p => ({ project: p, client: ws.client, workspaceId: ws.id }))
      ),
      activeProject: activeProject || null,
    };

    const result = entry.handler(parsed, context);

    const outputBlock: TerminalBlock = {
      id: nextBlockId(),
      type: "command",
      command: trimmed,
      content: result,
      timestamp: Date.now(),
    };
    setBlocks(prev => [...prev, outputBlock]);
  }, [activeProject, clearBlocks]);

  const value: TerminalContextType = {
    workspaces,
    projects: allProjects,
    activeProject: activeProject || null,
    blocks,
    addBlock,
    clearBlocks,
    executeCommand,
    inputHistory,
  };

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
}
