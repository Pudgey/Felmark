"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import type { Workstation } from "@/lib/types";
import type {
  TerminalBlock,
  TerminalContextType,
  AmbientInsight,
  TerminalSessionState,
} from "@/lib/terminal/types";
import {
  buildTerminalBlocks,
  createCommandEntry,
  createErrorEntry,
  createNlResponseEntry,
  createOutputEntry,
  EMPTY_TERMINAL_SESSION_STATE,
} from "@/lib/terminal/session";
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

type TerminalSessionUpdater = TerminalSessionState | ((prev: TerminalSessionState) => TerminalSessionState);

interface TerminalProviderProps {
  workstations: Workstation[];
  activeProject: string;
  children: ReactNode;
  /** Editor blocks for ambient intelligence — enables D5 ambient loop */
  editorBlocks?: Array<{ type?: string; content?: string; props?: Record<string, unknown> }>;
  /** Callback for navigate actions (D7) */
  onOpenWorkstation?: (workstationId: string) => void;
  sessionState?: TerminalSessionState;
  onSessionStateChange?: (state: TerminalSessionUpdater) => void;
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
  workstations,
  activeProject,
  children,
  editorBlocks,
  onOpenWorkstation,
  sessionState,
  onSessionStateChange,
}: TerminalProviderProps) {
  const [fallbackSessionState, setFallbackSessionState] = useState<TerminalSessionState>(
    sessionState ?? EMPTY_TERMINAL_SESSION_STATE
  );
  const [pendingBlocks, setPendingBlocks] = useState<TerminalBlock[]>([]);
  const [ambientBlocks, setAmbientBlocks] = useState<TerminalBlock[]>([]);

  const isControlled = sessionState !== undefined && onSessionStateChange !== undefined;
  const sharedState = isControlled ? sessionState : fallbackSessionState;
  const dismissedInsights = useMemo(
    () => new Set(sharedState.dismissedInsightKeys),
    [sharedState.dismissedInsightKeys]
  );

  const workstationsRef = useRef(workstations);
  workstationsRef.current = workstations;

  // Refs for ambient intelligence loop (D5)
  const lastAmbientCallRef = useRef<number>(0);
  const lastContextHashRef = useRef<string>("");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const dismissedRef = useRef(dismissedInsights);
  dismissedRef.current = dismissedInsights;

  const updateSharedState = useCallback((updater: TerminalSessionUpdater) => {
    if (isControlled) {
      onSessionStateChange?.(updater);
      return;
    }

    setFallbackSessionState((prev) => typeof updater === "function" ? updater(prev) : updater);
  }, [isControlled, onSessionStateChange]);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const allProjects = useMemo(
    () => workstations.flatMap((ws) => ws.projects.map((project) => ({
      project,
      client: ws.client,
      workstationId: ws.id,
    }))),
    [workstations]
  );

  const sessionBlocks = useMemo(
    () => buildTerminalBlocks(sharedState.entries, workstations),
    [sharedState.entries, workstations]
  );

  const blocks = useMemo(
    () => [...sessionBlocks, ...pendingBlocks, ...ambientBlocks].sort((a, b) => a.timestamp - b.timestamp),
    [sessionBlocks, pendingBlocks, ambientBlocks]
  );

  const addBlock = useCallback((block: TerminalBlock) => {
    setPendingBlocks((prev) => [...prev, block]);
  }, []);

  const clearBlocks = useCallback(() => {
    setPendingBlocks([]);
    setAmbientBlocks([]);
    updateSharedState((prev) => ({
      ...prev,
      entries: [],
    }));
  }, [updateSharedState]);

  // D4/D5: Dismiss an insight by key
  const dismissInsight = useCallback((key: string) => {
    setAmbientBlocks((prev) => prev.filter((block) => block.insightKey !== key));
    updateSharedState((prev) => {
      if (prev.dismissedInsightKeys.includes(key)) {
        return prev;
      }

      return {
        ...prev,
        dismissedInsightKeys: [...prev.dismissedInsightKeys, key],
      };
    });
  }, [updateSharedState]);

  // ─── Core command execution ───────────────────────
  const executeCommandInner = useCallback((input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    updateSharedState((prev) => ({
      ...prev,
      inputHistory: [...prev.inputHistory, trimmed],
    }));

    const parsed = parseCommand(trimmed);

    if (parsed.command === "clear") {
      clearBlocks();
      return;
    }

    const entry = COMMAND_REGISTRY[parsed.command];
    if (!entry) {
      const timestamp = Date.now();
      updateSharedState((prev) => ({
        ...prev,
        entries: prev.entries.concat(
          createErrorEntry(trimmed, `Unknown command: ${parsed.command}`, timestamp, nextBlockId())
        ),
      }));
      return;
    }

    const timestamp = Date.now();
    const loadingId = nextBlockId();
    const loadingBlock: TerminalBlock = {
      id: loadingId,
      type: "loading",
      command: trimmed,
      content: null,
      timestamp,
    };
    setPendingBlocks((prev) => [...prev, loadingBlock]);

    // Brief think delay, then replace with a shared session entry
    setTimeout(() => {
      if (!mountedRef.current) return;

      setPendingBlocks((prev) => prev.filter((block) => block.id !== loadingId));
      updateSharedState((prev) => ({
        ...prev,
        entries: prev.entries.concat(
          createCommandEntry(trimmed, activeProject || null, timestamp, nextBlockId())
        ),
      }));
    }, 600);
  }, [activeProject, clearBlocks, updateSharedState]);

  // Alias for context consumption (matches existing API)
  const executeCommand = executeCommandInner;

  // ─── D7: Action routing ───────────────────────────
  const executeAction = useCallback((command: string) => {
    if (command.startsWith("navigate:workstation:")) {
      const wsId = command.replace("navigate:workstation:", "");
      onOpenWorkstation?.(wsId);
      return;
    }

    if (command.startsWith("insert:")) {
      const insertType = command.replace("insert:", "");
      const timestamp = Date.now();

      updateSharedState((prev) => ({
        ...prev,
        entries: prev.entries.concat(
          createOutputEntry(
            `insert:${insertType}`,
            `Insert action: ${insertType} block - coming soon`,
            timestamp,
            nextBlockId()
          )
        ),
      }));
      return;
    }

    // Default: treat as a terminal command (e.g., "/rate", "/client Meridian")
    if (command.startsWith("/")) {
      executeCommandInner(command);
    }
  }, [executeCommandInner, onOpenWorkstation, updateSharedState]);

  // ─── D6: Natural language query ───────────────────
  const sendNLQuery = useCallback(async (query: string) => {
    const timestamp = Date.now();
    const loadingId = nextBlockId();
    const loadingBlock: TerminalBlock = {
      id: loadingId,
      type: "loading",
      command: query,
      content: null,
      timestamp,
    };

    setPendingBlocks((prev) => [...prev, loadingBlock]);
    updateSharedState((prev) => ({
      ...prev,
      inputHistory: [...prev.inputHistory, query],
    }));

    try {
      const businessCtx = buildWireContext(workstationsRef.current, []);
      const res = await fetch("/api/terminal/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, context: businessCtx }),
      });

      if (!mountedRef.current) return;

      const data = await res.json();
      setPendingBlocks((prev) => prev.filter((block) => block.id !== loadingId));
      updateSharedState((prev) => ({
        ...prev,
        entries: prev.entries.concat(
          createNlResponseEntry(
            query,
            {
              text: data.text || data.error || "No response",
              data: data.data || null,
              model: data.model,
            },
            timestamp,
            nextBlockId()
          )
        ),
      }));
    } catch (err) {
      if (!mountedRef.current) return;

      setPendingBlocks((prev) => prev.filter((block) => block.id !== loadingId));
      updateSharedState((prev) => ({
        ...prev,
        entries: prev.entries.concat(
          createErrorEntry(query, `Query failed: ${String(err)}`, timestamp, nextBlockId())
        ),
      }));
    }
  }, [updateSharedState]);

  // ─── D5: Ambient intelligence loop ────────────────
  const runAmbientCheck = useCallback(async () => {
    if (!mountedRef.current) return;
    if (!editorBlocks || editorBlocks.length === 0) return;

    const activeWs = workstationsRef.current.find((ws) =>
      ws.projects.some((project) => project.id === activeProject)
    );
    const activeProj = activeWs?.projects.find((project) => project.id === activeProject);

    const docCtx = extractDocumentContext(
      editorBlocks,
      activeWs ? { client: activeWs.client } : null,
      activeProj
        ? { name: activeProj.name, status: activeProj.status, due: (activeProj as { due?: string }).due }
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
      const businessCtx = buildWireContext(workstationsRef.current, []);

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
        setAmbientBlocks((prev) => {
          const existingKeys = new Set(prev.map((block) => block.insightKey).filter(Boolean));
          const deduped = newBlocks.filter((block) => !block.insightKey || !existingKeys.has(block.insightKey));
          return deduped.length > 0 ? [...prev, ...deduped] : prev;
        });
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

  const value = useMemo<TerminalContextType>(() => ({
    workstations,
    projects: allProjects,
    activeProject: activeProject || null,
    blocks,
    addBlock,
    clearBlocks,
    executeCommand,
    inputHistory: sharedState.inputHistory,
    dismissedInsights,
    dismissInsight,
    executeAction,
    sendNLQuery,
  }), [
    workstations,
    allProjects,
    activeProject,
    blocks,
    addBlock,
    clearBlocks,
    executeCommand,
    sharedState.inputHistory,
    dismissedInsights,
    dismissInsight,
    executeAction,
    sendNLQuery,
  ]);

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
}
