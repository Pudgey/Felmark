"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import type { Workspace, Project } from "@/lib/types";
import type { TerminalBlock, TerminalContextType, CommandHandlerContext, AmbientInsight, TerminalSessionState } from "@/lib/terminal/types";
import { parseCommand } from "@/lib/terminal/parser";
import { COMMAND_REGISTRY } from "@/lib/terminal/commands";
import { extractDocumentContext, hashContext } from "@/lib/terminal/watcher";
import { buildWireContext } from "@/lib/wire-context";

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
  /** Editor blocks for ambient intelligence — enables D5 ambient loop */
  editorBlocks?: Array<{ type?: string; content?: string; props?: Record<string, unknown> }>;
  /** Callback for navigate actions (D7) */
  onOpenWorkspace?: (workspaceId: string) => void;
  sessionState?: TerminalSessionState;
  onSessionStateChange?: (state: TerminalSessionState) => void;
}

let blockIdCounter = 0;
function nextBlockId() {
  return `tb_${++blockIdCounter}_${Date.now()}`;
}

/** Throttle: minimum ms between ambient API calls */
const AMBIENT_THROTTLE_MS = 30_000;
/** Debounce: ms after last change before triggering ambient */
const AMBIENT_DEBOUNCE_MS = 2_000;

export default function TerminalProvider({
  workspaces,
  activeProject,
  children,
  editorBlocks,
  onOpenWorkspace,
  sessionState,
  onSessionStateChange,
}: TerminalProviderProps) {
  const [blocks, setBlocks] = useState<TerminalBlock[]>(sessionState?.blocks ?? []);
  const [inputHistory, setInputHistory] = useState<string[]>(sessionState?.inputHistory ?? []);
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(
    () => new Set(sessionState?.dismissedInsightKeys ?? [])
  );

  const workspacesRef = useRef(workspaces);
  workspacesRef.current = workspaces;

  // Refs for ambient intelligence loop (D5)
  const lastAmbientCallRef = useRef<number>(0);
  const lastContextHashRef = useRef<string>("");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const dismissedRef = useRef(dismissedInsights);
  dismissedRef.current = dismissedInsights;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    onSessionStateChange?.({
      blocks,
      inputHistory,
      dismissedInsightKeys: Array.from(dismissedInsights),
    });
  }, [blocks, inputHistory, dismissedInsights, onSessionStateChange]);

  const allProjects: { project: Project; client: string; workspaceId: string }[] = workspaces.flatMap(
    ws => ws.projects.map(p => ({ project: p, client: ws.client, workspaceId: ws.id }))
  );

  const addBlock = useCallback((block: TerminalBlock) => {
    setBlocks(prev => [...prev, block]);
  }, []);

  const clearBlocks = useCallback(() => {
    setBlocks([]);
  }, []);

  // D4/D5: Dismiss an insight by key
  const dismissInsight = useCallback((key: string) => {
    setDismissedInsights(prev => new Set(prev).add(key));
    setBlocks(prev => prev.filter(b => b.insightKey !== key));
  }, []);

  // ─── D7: Action routing ───────────────────────────
  const executeAction = useCallback((command: string) => {
    if (command.startsWith("navigate:workspace:")) {
      const wsId = command.replace("navigate:workspace:", "");
      onOpenWorkspace?.(wsId);
      return;
    }

    if (command.startsWith("insert:")) {
      const insertType = command.replace("insert:", "");
      const block: TerminalBlock = {
        id: nextBlockId(),
        type: "command",
        command: `insert:${insertType}`,
        content: (
          <div style={{ fontFamily: "var(--mono), monospace", fontSize: 12, color: "#9b988f" }}>
            Insert action: <strong>{insertType}</strong> block — coming soon
          </div>
        ),
        timestamp: Date.now(),
      };
      setBlocks(prev => [...prev, block]);
      return;
    }

    // Default: treat as a terminal command (e.g., "/rate", "/client Meridian")
    if (command.startsWith("/")) {
      executeCommandInner(command);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onOpenWorkspace]);

  // ─── Core command execution ───────────────────────
  const executeCommandInner = useCallback((input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setInputHistory(prev => [...prev, trimmed]);
    const parsed = parseCommand(trimmed);

    if (parsed.command === "clear") {
      clearBlocks();
      return;
    }

    const entry = COMMAND_REGISTRY[parsed.command];
    if (!entry) {
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

    // Show loading animation before result
    const loadingId = nextBlockId();
    const loadingBlock: TerminalBlock = {
      id: loadingId,
      type: "loading",
      command: trimmed,
      content: null,
      timestamp: Date.now(),
    };
    setBlocks(prev => [...prev, loadingBlock]);

    // Brief think delay, then replace with result
    setTimeout(() => {
      const result = entry.handler(parsed, context);
      const outputBlock: TerminalBlock = {
        id: nextBlockId(),
        type: "command",
        command: trimmed,
        content: result,
        timestamp: Date.now(),
      };
      setBlocks(prev => prev.filter(b => b.id !== loadingId).concat(outputBlock));
    }, 600);
  }, [activeProject, clearBlocks]);

  // Alias for context consumption (matches existing API)
  const executeCommand = executeCommandInner;

  // ─── D6: Natural language query ───────────────────
  const sendNLQuery = useCallback(async (query: string) => {
    const loadingId = nextBlockId();
    const loadingBlock: TerminalBlock = {
      id: loadingId,
      type: "loading",
      command: query,
      content: null,
      timestamp: Date.now(),
    };
    setBlocks(prev => [...prev, loadingBlock]);
    setInputHistory(prev => [...prev, query]);

    try {
      const businessCtx = buildWireContext(workspacesRef.current, []);
      const res = await fetch("/api/terminal/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, context: businessCtx }),
      });

      if (!mountedRef.current) return;

      const data = await res.json();

      const responseBlock: TerminalBlock & { nlData?: { text: string; data?: { type: string; content: unknown } | null; model?: string } } = {
        id: nextBlockId(),
        type: "nl-response",
        command: query,
        content: null,
        timestamp: Date.now(),
      };

      responseBlock.nlData = {
        text: data.text || data.error || "No response",
        data: data.data || null,
        model: data.model,
      };

      setBlocks(prev => prev.map(b => b.id === loadingId ? responseBlock : b));
    } catch (err) {
      if (!mountedRef.current) return;
      const errorBlock: TerminalBlock = {
        id: nextBlockId(),
        type: "error",
        command: query,
        content: (
          <div style={{ fontFamily: "var(--mono), monospace", fontSize: 12, color: "#dc2626" }}>
            Query failed: {String(err)}
          </div>
        ),
        timestamp: Date.now(),
      };
      setBlocks(prev => prev.map(b => b.id === loadingId ? errorBlock : b));
    }
  }, []);

  // ─── D5: Ambient intelligence loop ────────────────
  const runAmbientCheck = useCallback(async () => {
    if (!mountedRef.current) return;
    if (!editorBlocks || editorBlocks.length === 0) return;

    const activeWs = workspacesRef.current.find(ws =>
      ws.projects.some(p => p.id === activeProject)
    );
    const activeProj = activeWs?.projects.find(p => p.id === activeProject);

    const docCtx = extractDocumentContext(
      editorBlocks,
      activeWs ? { client: activeWs.client } : null,
      activeProj
        ? { name: activeProj.name, status: activeProj.status, due: (activeProj as unknown as { due?: string }).due }
        : null
    );

    // Hash check — skip if context hasn't changed
    const hash = hashContext(docCtx);
    if (hash === lastContextHashRef.current) return;

    // Throttle — max 1 call per 30 seconds
    const now = Date.now();
    if (now - lastAmbientCallRef.current < AMBIENT_THROTTLE_MS) return;

    lastContextHashRef.current = hash;
    lastAmbientCallRef.current = now;

    try {
      const businessCtx = buildWireContext(workspacesRef.current, []);

      const res = await fetch("/api/terminal/ambient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentContext: JSON.stringify(docCtx),
          businessContext: businessCtx,
        }),
      });

      if (!mountedRef.current) return;
      const data = await res.json();
      const insights: AmbientInsight[] = data.insights || [];

      if (insights.length === 0) return;

      const newBlocks: TerminalBlock[] = [];
      for (const insight of insights) {
        const key = `${insight.tier}:${insight.text.slice(0, 50)}`;
        if (dismissedRef.current.has(key)) continue;

        newBlocks.push({
          id: nextBlockId(),
          type: insight.tier,
          content: null,
          timestamp: Date.now(),
          insightKey: key,
          insight,
        });
      }

      if (newBlocks.length > 0) {
        setBlocks(prev => [...prev, ...newBlocks]);
      }
    } catch {
      // Silently fail — ambient is best-effort
    }
  }, [editorBlocks, activeProject]);

  // Debounced trigger when editor blocks or active project change
  useEffect(() => {
    if (!editorBlocks || editorBlocks.length === 0) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      runAmbientCheck();
    }, AMBIENT_DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [editorBlocks, activeProject, runAmbientCheck]);

  const value: TerminalContextType = {
    workspaces,
    projects: allProjects,
    activeProject: activeProject || null,
    blocks,
    addBlock,
    clearBlocks,
    executeCommand,
    inputHistory,
    dismissedInsights,
    dismissInsight,
    executeAction,
    sendNLQuery,
  };

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
}
