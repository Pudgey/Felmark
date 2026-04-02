"use client";

import { useState, useCallback, useRef, useEffect, type SetStateAction, type Dispatch } from "react";
import type { Block, Workstation, Tab, ArchivedProject } from "@/lib/types";
import type { Comment } from "@/components/comments/CommentPanel";
import type { BlockActivity } from "@/components/activity/ActivityMargin";

// ── localStorage persistence ──
const STORAGE_KEY = "felmark_workspace";

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    if (raw) return JSON.parse(raw);
  } catch { /* corrupted data — use fallback */ }
  return fallback;
}

function saveToStorage(key: string, data: unknown) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(data));
  } catch { /* storage full — silent fail */ }
}

// ── Hook interface ──

interface UsePersistenceConfig {
  state: {
    workstations: Workstation[];
    tabs: Tab[];
    activeProject: string;
    blocksMap: Record<string, Block[]>;
    archived: ArchivedProject[];
    comments: Comment[];
    activitiesMap: Record<string, BlockActivity[]>;
  };
  setters: {
    setWorkstations: Dispatch<SetStateAction<Workstation[]>>;
    setTabs: Dispatch<SetStateAction<Tab[]>>;
    setActiveProject: Dispatch<SetStateAction<string>>;
    setBlocksMap: Dispatch<SetStateAction<Record<string, Block[]>>>;
    setArchived: Dispatch<SetStateAction<ArchivedProject[]>>;
    setComments: Dispatch<SetStateAction<Comment[]>>;
    setActivitiesMap: Dispatch<SetStateAction<Record<string, BlockActivity[]>>>;
  };
}

export interface UsePersistenceResult {
  updateWorkstations: Dispatch<SetStateAction<Workstation[]>>;
  updateTabs: Dispatch<SetStateAction<Tab[]>>;
  updateActiveProject: Dispatch<SetStateAction<string>>;
  updateBlocksMap: Dispatch<SetStateAction<Record<string, Block[]>>>;
  updateArchived: Dispatch<SetStateAction<ArchivedProject[]>>;
  updateComments: Dispatch<SetStateAction<Comment[]>>;
  updateActivitiesMap: Dispatch<SetStateAction<Record<string, BlockActivity[]>>>;
  saveIndicatorState: "saved" | "saving";
  saveStatusLabel: string;
  saveNow: () => void;
}

export function usePersistence({ state, setters }: UsePersistenceConfig): UsePersistenceResult {
  const { workstations, tabs, activeProject, blocksMap, archived, comments, activitiesMap } = state;
  const { setWorkstations, setTabs, setActiveProject, setBlocksMap, setArchived, setComments, setActivitiesMap } = setters;

  const [saveIndicatorState, setSaveIndicatorState] = useState<"saved" | "saving">("saved");
  const [saveRequestToken, setSaveRequestToken] = useState(0);
  const [lastCompletedSaveToken, setLastCompletedSaveToken] = useState<number | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(() => {
    const ls = loadFromStorage("lastSavedAt", null);
    return typeof ls === "number" ? ls : null;
  });
  const [saveStatusTick, setSaveStatusTick] = useState(() => {
    const ls = loadFromStorage("lastSavedAt", null);
    return typeof ls === "number" ? ls : 0;
  });

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markSavePending = useCallback(() => {
    let nextToken = 0;
    setSaveRequestToken(prev => {
      nextToken = prev + 1;
      return nextToken;
    });
    setSaveIndicatorState("saving");
    return nextToken;
  }, []);

  /** Wrap a setter so every call marks a save as pending. */
  const tracked = <T,>(setter: React.Dispatch<SetStateAction<T>>) =>
    (value: SetStateAction<T>) => { markSavePending(); setter(value); };

  const persistWorkstationState = useCallback((saveToken: number) => {
    const savedAt = Date.now();
    saveToStorage("workstations", workstations);
    saveToStorage("blocksMap", blocksMap);
    saveToStorage("tabs", tabs);
    saveToStorage("archived", archived);
    saveToStorage("comments", comments);
    saveToStorage("activitiesMap", activitiesMap);
    saveToStorage("activeProject", activeProject);
    saveToStorage("lastSavedAt", savedAt);
    setLastSavedAt(savedAt);
    setSaveStatusTick(savedAt);
    setLastCompletedSaveToken(saveToken);
  }, [workstations, blocksMap, tabs, archived, comments, activitiesMap, activeProject]);

  const saveNow = useCallback(() => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    const saveToken = markSavePending();
    if (saveToken) persistWorkstationState(saveToken);
  }, [markSavePending, persistWorkstationState]);

  const updateWorkstations = tracked(setWorkstations);
  const updateTabs = tracked(setTabs);
  const updateActiveProject = tracked(setActiveProject);
  const updateBlocksMap = tracked(setBlocksMap);
  const updateArchived = tracked(setArchived);
  const updateComments = tracked(setComments);
  const updateActivitiesMap = tracked(setActivitiesMap);

  // Debounce effect — persist after 800ms of inactivity
  useEffect(() => {
    if (saveRequestToken === 0) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      persistWorkstationState(saveRequestToken);
      saveTimer.current = null;
    }, 800);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [persistWorkstationState, saveRequestToken]);

  // Cmd+S keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveNow();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [saveNow]);

  // Save-complete indicator — reset to "saved" after 450ms
  useEffect(() => {
    if (lastCompletedSaveToken === null || lastCompletedSaveToken !== saveRequestToken) return;
    const timer = window.setTimeout(() => setSaveIndicatorState("saved"), 450);
    return () => window.clearTimeout(timer);
  }, [lastCompletedSaveToken, saveRequestToken]);

  // Tick-refresh interval — update relative timestamp every 30s
  useEffect(() => {
    if (!lastSavedAt) return;
    const tick = window.setInterval(() => setSaveStatusTick(Date.now()), 30000);
    return () => window.clearInterval(tick);
  }, [lastSavedAt]);

  // Save status label derivation
  const saveStatusLabel = (() => {
    if (saveIndicatorState === "saving") return "saving...";
    if (!lastSavedAt) return "saved";
    const elapsed = Math.max(0, saveStatusTick - lastSavedAt);
    const minutes = Math.floor(elapsed / 60000);
    if (minutes <= 0) return "saved just now";
    if (minutes === 1) return "saved 1m ago";
    if (minutes < 60) return `saved ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "saved 1h ago";
    return `saved ${hours}h ago`;
  })();

  return {
    updateWorkstations,
    updateTabs,
    updateActiveProject,
    updateBlocksMap,
    updateArchived,
    updateComments,
    updateActivitiesMap,
    saveIndicatorState,
    saveStatusLabel,
    saveNow,
  };
}
