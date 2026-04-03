"use client";

import type { ReactNode } from "react";
import { COMMAND_REGISTRY } from "./commands";
import { parseCommand } from "./parser";
import type {
  CommandHandlerContext,
  NLResponseData,
  TerminalBlock,
  TerminalCommandEntry,
  TerminalErrorEntry,
  TerminalNlResponseEntry,
  TerminalNlResponsePayload,
  TerminalOutputEntry,
  TerminalSessionEntry,
  TerminalSessionState,
} from "./types";
import type { Workstation } from "@/lib/types";

export const TERMINAL_SESSION_STORAGE_KEY = "felmark_terminal_session";

export const EMPTY_TERMINAL_SESSION_STATE: TerminalSessionState = {
  entries: [],
  inputHistory: [],
  dismissedInsightKeys: [],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function sanitizeNlResponsePayload(value: unknown): TerminalNlResponsePayload {
  if (!isRecord(value)) {
    return { text: "No response", data: null };
  }

  const type = value.data && isRecord(value.data) && typeof value.data.type === "string"
    ? value.data.type
    : null;

  const data = type === "table" || type === "list" || type === "metric" || type === "card"
    ? value.data as NLResponseData
    : null;

  return {
    text: sanitizeText(value.text) || "No response",
    data,
    model: typeof value.model === "string" ? value.model : undefined,
  };
}

function sanitizeEntry(value: unknown): TerminalSessionEntry | null {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.kind !== "string") {
    return null;
  }

  const timestamp = typeof value.timestamp === "number" ? value.timestamp : Date.now();

  switch (value.kind) {
    case "command":
      return {
        id: value.id,
        kind: "command",
        input: sanitizeText(value.input),
        activeProject: typeof value.activeProject === "string" ? value.activeProject : null,
        timestamp,
      };
    case "error":
      return {
        id: value.id,
        kind: "error",
        input: sanitizeText(value.input),
        message: sanitizeText(value.message) || "Terminal error",
        timestamp,
      };
    case "output":
      return {
        id: value.id,
        kind: "output",
        input: sanitizeText(value.input),
        message: sanitizeText(value.message),
        timestamp,
      };
    case "nl-response":
      return {
        id: value.id,
        kind: "nl-response",
        query: sanitizeText(value.query),
        response: sanitizeNlResponsePayload(value.response),
        timestamp,
      };
    default:
      return null;
  }
}

export function sanitizeTerminalSessionState(value: unknown): TerminalSessionState {
  if (!isRecord(value)) {
    return EMPTY_TERMINAL_SESSION_STATE;
  }

  return {
    entries: Array.isArray(value.entries)
      ? value.entries.map(sanitizeEntry).filter((entry): entry is TerminalSessionEntry => entry !== null)
      : [],
    inputHistory: Array.isArray(value.inputHistory)
      ? value.inputHistory.filter((item): item is string => typeof item === "string")
      : [],
    dismissedInsightKeys: Array.isArray(value.dismissedInsightKeys)
      ? value.dismissedInsightKeys.filter((item): item is string => typeof item === "string")
      : [],
  };
}

export function createCommandEntry(input: string, activeProject: string | null, timestamp: number, id: string): TerminalCommandEntry {
  return {
    id,
    kind: "command",
    input,
    activeProject,
    timestamp,
  };
}

export function createErrorEntry(input: string, message: string, timestamp: number, id: string): TerminalErrorEntry {
  return {
    id,
    kind: "error",
    input,
    message,
    timestamp,
  };
}

export function createOutputEntry(input: string, message: string, timestamp: number, id: string): TerminalOutputEntry {
  return {
    id,
    kind: "output",
    input,
    message,
    timestamp,
  };
}

export function createNlResponseEntry(query: string, response: TerminalNlResponsePayload, timestamp: number, id: string): TerminalNlResponseEntry {
  return {
    id,
    kind: "nl-response",
    query,
    response,
    timestamp,
  };
}

function buildCommandContext(workstations: Workstation[], activeProject: string | null): CommandHandlerContext {
  return {
    workstations,
    projects: workstations.flatMap((workstation) =>
      workstation.projects.map((project) => ({
        project,
        client: workstation.client,
        workstationId: workstation.id,
      }))
    ),
    activeProject,
  };
}

function createUnknownCommandContent(input: string): ReactNode {
  const parsed = parseCommand(input);

  return (
    <div style={{ fontFamily: "var(--mono), 'JetBrains Mono', monospace", fontSize: 12, color: "#dc2626" }}>
      Unknown command: <strong>{parsed.command}</strong>
      <div style={{ color: "#9b988f", marginTop: 4, fontSize: 11 }}>
        Available: {Object.keys(COMMAND_REGISTRY).map((name) => `/${name}`).join(", ")}
      </div>
    </div>
  );
}

function createErrorContent(message: string): ReactNode {
  return (
    <div style={{ fontFamily: "var(--mono), monospace", fontSize: 12, color: "#dc2626" }}>
      {message}
    </div>
  );
}

function createOutputContent(message: string): ReactNode {
  return (
    <div style={{ fontFamily: "var(--mono), monospace", fontSize: 12, color: "#9b988f" }}>
      {message}
    </div>
  );
}

export function buildTerminalBlocks(entries: TerminalSessionEntry[], workstations: Workstation[]): TerminalBlock[] {
  return entries.map((entry) => {
    switch (entry.kind) {
      case "command": {
        const parsed = parseCommand(entry.input);
        const handler = COMMAND_REGISTRY[parsed.command];

        if (!handler) {
          return {
            id: entry.id,
            type: "error",
            command: entry.input,
            content: createUnknownCommandContent(entry.input),
            timestamp: entry.timestamp,
          };
        }

        return {
          id: entry.id,
          type: "command",
          command: entry.input,
          content: handler.handler(parsed, buildCommandContext(workstations, entry.activeProject)),
          timestamp: entry.timestamp,
        };
      }
      case "error":
        return {
          id: entry.id,
          type: "error",
          command: entry.input,
          content: createErrorContent(entry.message),
          timestamp: entry.timestamp,
        };
      case "output":
        return {
          id: entry.id,
          type: "command",
          command: entry.input,
          content: createOutputContent(entry.message),
          timestamp: entry.timestamp,
        };
      case "nl-response":
        return {
          id: entry.id,
          type: "nl-response",
          command: entry.query,
          content: null,
          nlData: entry.response,
          timestamp: entry.timestamp,
        };
    }
  });
}
