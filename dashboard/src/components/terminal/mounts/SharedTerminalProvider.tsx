"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Workstation } from "@/lib/types";
import {
  EMPTY_TERMINAL_SESSION_STATE,
  TERMINAL_SESSION_STORAGE_KEY,
  sanitizeTerminalSessionState,
} from "@/lib/terminal/session";
import type { TerminalSessionState } from "@/lib/terminal/types";

type TerminalSessionUpdater = TerminalSessionState | ((prev: TerminalSessionState) => TerminalSessionState);

interface SharedTerminalContextValue {
  sessionState: TerminalSessionState;
  setSessionState: (next: TerminalSessionUpdater) => void;
  workstations: Workstation[];
  activeProject: string;
  onOpenWorkstation?: (workstationId: string) => void;
}

interface SharedTerminalProviderProps {
  children: ReactNode;
  workstations: Workstation[];
  activeProject: string;
  onOpenWorkstation?: (workstationId: string) => void;
}

const SharedTerminalContext = createContext<SharedTerminalContextValue | null>(null);

export function useSharedTerminal() {
  const context = useContext(SharedTerminalContext);
  if (!context) {
    throw new Error("useSharedTerminal must be used within SharedTerminalProvider");
  }
  return context;
}

export default function SharedTerminalProvider({
  children,
  workstations,
  activeProject,
  onOpenWorkstation,
}: SharedTerminalProviderProps) {
  const [sessionState, setSessionStateState] = useState<TerminalSessionState>(EMPTY_TERMINAL_SESSION_STATE);
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setStorageLoaded(true);
      return;
    }

    try {
      const raw = window.localStorage.getItem(TERMINAL_SESSION_STORAGE_KEY);
      if (raw) {
        setSessionStateState(sanitizeTerminalSessionState(JSON.parse(raw)));
      }
    } catch {
      window.localStorage.removeItem(TERMINAL_SESSION_STORAGE_KEY);
      setSessionStateState(EMPTY_TERMINAL_SESSION_STATE);
    } finally {
      setStorageLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!storageLoaded || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(TERMINAL_SESSION_STORAGE_KEY, JSON.stringify(sessionState));
  }, [sessionState, storageLoaded]);

  const setSessionState = useCallback((next: TerminalSessionUpdater) => {
    setSessionStateState((prev) => typeof next === "function" ? next(prev) : next);
  }, []);

  const value = useMemo<SharedTerminalContextValue>(() => ({
    sessionState,
    setSessionState,
    workstations,
    activeProject,
    onOpenWorkstation,
  }), [sessionState, setSessionState, workstations, activeProject, onOpenWorkstation]);

  return (
    <SharedTerminalContext.Provider value={value}>
      {children}
    </SharedTerminalContext.Provider>
  );
}
