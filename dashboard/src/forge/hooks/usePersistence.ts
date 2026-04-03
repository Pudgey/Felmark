"use client";

import { useState, useCallback, useRef, useEffect, type SetStateAction, type Dispatch } from "react";
import type { Block, Workstation, Tab, ArchivedProject } from "@/lib/types";
import type { Comment } from "@/components/comments/CommentPanel";
import type { BlockActivity } from "@/components/activity/ActivityMargin";

// ── localStorage persistence ──
const STORAGE_KEY = "felmark_workspace";

type LegacyColumnsBlock = {
  id?: string;
  type: "columns";
  content?: string;
  checked?: boolean;
  columnsData?: {
    columns?: Array<{
      label?: string;
      content?: string;
    }>;
  };
};

type LegacyDataChipsBlock = {
  id?: string;
  type: "data-chips";
  content?: string;
  checked?: boolean;
  dataChipsData?: {
    chips?: Array<{
      label?: string;
      type?: string;
    }>;
  };
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function migrateLegacyColumnsBlock(block: LegacyColumnsBlock): Block {
  const sections = (block.columnsData?.columns ?? [])
    .map((column, index) => {
      const label = escapeHtml(column.label?.trim() || `Column ${index + 1}`);
      const content = escapeHtml(column.content?.trim() || "");
      return content ? `<strong>${label}</strong><br>${content}` : `<strong>${label}</strong>`;
    })
    .filter(Boolean);

  return {
    id: block.id || `migrated-columns-${Date.now()}`,
    type: "callout",
    checked: Boolean(block.checked),
    content: sections.join("<br><br>") || block.content || "Legacy columns block",
  };
}

function migrateLegacyDataChipsBlock(block: LegacyDataChipsBlock): Block {
  const chips = (block.dataChipsData?.chips ?? [])
    .map((chip) => chip.label?.trim() || chip.type?.trim() || "")
    .filter(Boolean)
    .map((label) => `<strong>${escapeHtml(label)}</strong>`);

  return {
    id: block.id || `migrated-data-chips-${Date.now()}`,
    type: "callout",
    checked: Boolean(block.checked),
    content: chips.join(" • ") || block.content || "Legacy data chips block",
  };
}

function migrateLegacyBlock(block: unknown): Block | null {
  if (!isObject(block) || typeof block.id !== "string" || typeof block.type !== "string") return null;

  if (block.type === "columns") {
    return migrateLegacyColumnsBlock(block as LegacyColumnsBlock);
  }

  if (block.type === "data-chips") {
    return migrateLegacyDataChipsBlock(block as LegacyDataChipsBlock);
  }

  return block as unknown as Block;
}

function normalizeBlocksMap(value: unknown): Record<string, Block[]> | null {
  if (!isObject(value)) return null;

  const normalizedEntries = Object.entries(value).map(([projectId, blocks]) => {
    const nextBlocks = Array.isArray(blocks)
      ? blocks.map(migrateLegacyBlock).filter((block): block is Block => block !== null)
      : [];

    return [projectId, nextBlocks];
  });

  return Object.fromEntries(normalizedEntries);
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (key === "blocksMap") {
        return (normalizeBlocksMap(parsed) ?? fallback) as T;
      }
      return parsed;
    }
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
