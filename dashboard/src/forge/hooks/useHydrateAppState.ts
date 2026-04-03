"use client";

import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { Block, Workstation, Tab, ArchivedProject } from "@/lib/types";
import type { Comment } from "@/components/comments/CommentPanel";
import type { BlockActivity } from "@/components/activity/ActivityMargin";
import { BLOCK_TYPES, INITIAL_WORKSTATIONS } from "@/lib/constants";
import { loadEditorMemory, saveEditorMemory, type EditorMemoryDebugReport } from "@/forge";
import { loadFromStorage } from "./usePersistence";

export const SUPPORTED_BLOCK_TYPES = new Set(BLOCK_TYPES.map((block) => block.type));

export const INITIAL_TABS: Tab[] = [
  { id: "p1", name: "Brand Guidelines v2", client: "Meridian Studio", active: true },
];

export function reconcileTabs(tabs: Tab[], workstations: Workstation[]): Tab[] {
  const owners = new Map<string, { name: string; client: string }>();

  for (const workstation of workstations) {
    for (const project of workstation.projects) {
      owners.set(project.id, {
        name: project.name,
        client: workstation.client,
      });
    }
  }

  const seen = new Set<string>();

  return tabs.flatMap((tab) => {
    const owner = owners.get(tab.id);
    if (!owner || seen.has(tab.id)) {
      return [];
    }

    seen.add(tab.id);
    return [{
      id: tab.id,
      name: owner.name,
      client: owner.client,
      active: tab.active,
    }];
  });
}

/** Ensure at least one tab is active. */
export function ensureActiveTab(tabs: Tab[], workstations: Workstation[]): { tabs: Tab[]; activeProject: string } {
  if (tabs.length > 0 && tabs.some(t => t.active)) {
    return { tabs, activeProject: tabs.find(t => t.active)!.id };
  }
  if (tabs.length > 0) {
    const activated = tabs.map((t, i) => ({ ...t, active: i === 0 }));
    return { tabs: activated, activeProject: activated[0].id };
  }
  // No tabs at all — create one from first workstation's first project
  const ws = workstations[0];
  const pj = ws?.projects[0];
  if (ws && pj) {
    return {
      tabs: [{ id: pj.id, name: pj.name, client: ws.client, active: true }],
      activeProject: pj.id,
    };
  }
  return { tabs: [], activeProject: "" };
}

function hasEditorMemoryAlerts(report: EditorMemoryDebugReport): boolean {
  return (
    report.migrationsApplied.length > 0 ||
    report.unknownBlockTypes.length > 0 ||
    report.deprecatedBlockTypes.length > 0 ||
    report.fallbackConversions.length > 0
  );
}

interface UseHydrateAppStateConfig {
  setWorkstations: Dispatch<SetStateAction<Workstation[]>>;
  setTabs: Dispatch<SetStateAction<Tab[]>>;
  setActiveProject: Dispatch<SetStateAction<string>>;
  setBlocksMap: Dispatch<SetStateAction<Record<string, Block[]>>>;
  setArchived: Dispatch<SetStateAction<ArchivedProject[]>>;
  setComments: Dispatch<SetStateAction<Comment[]>>;
  setActivitiesMap: Dispatch<SetStateAction<Record<string, BlockActivity[]>>>;
  setActiveWorkstationId: Dispatch<SetStateAction<string | null>>;
  setHydrated: Dispatch<SetStateAction<boolean>>;
}

export function useHydrateAppState({
  setWorkstations,
  setTabs,
  setActiveProject,
  setBlocksMap,
  setArchived,
  setComments,
  setActivitiesMap,
  setActiveWorkstationId,
  setHydrated,
}: UseHydrateAppStateConfig): void {
  useEffect(() => {
    const editorMemory = loadEditorMemory({ supportedBlockTypes: SUPPORTED_BLOCK_TYPES });
    const savedWs = loadFromStorage<Workstation[] | null>("workstations", null);
    const savedTabs = loadFromStorage<Tab[] | null>("tabs", null);
    const savedProject = loadFromStorage<string | null>("activeProject", null);
    const savedArchived = loadFromStorage<ArchivedProject[] | null>("archived", null);
    const savedComments = loadFromStorage<Comment[] | null>("comments", null);
    const savedActivities = loadFromStorage<Record<string, BlockActivity[]> | null>("activitiesMap", null);
    const shouldHydrateBlocks =
      editorMemory.source === "snapshot" ||
      Object.keys(editorMemory.snapshot.blocksMap).length > 0;

    const ws = savedWs ?? INITIAL_WORKSTATIONS;
    const rawTabs = reconcileTabs(savedTabs ?? INITIAL_TABS.map(t => ({ ...t, active: false })), ws);
    const rawProject = savedProject && ws.some(w => w.projects.some(p => p.id === savedProject))
      ? savedProject
      : "";

    if (hasEditorMemoryAlerts(editorMemory.report)) {
      console.warn("[felmark:editor-memory]", {
        source: editorMemory.source,
        report: editorMemory.report,
      });
    }

    // Ensure an active tab
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;

      if (savedWs) setWorkstations(savedWs);
      if (shouldHydrateBlocks) {
        setBlocksMap(editorMemory.snapshot.blocksMap);
        if (editorMemory.source === "legacy") {
          saveEditorMemory(editorMemory.snapshot.blocksMap, editorMemory.snapshot.savedAt);
        }
      }
      if (savedArchived) setArchived(savedArchived);
      if (savedComments) setComments(savedComments);
      if (savedActivities) setActivitiesMap(savedActivities);

      if (rawProject && rawTabs.some(t => t.id === rawProject)) {
        const resolvedTabs = rawTabs.map(t => ({ ...t, active: t.id === rawProject }));
        setTabs(resolvedTabs);
        setActiveProject(rawProject);
        const owningWs = ws.find(w => w.projects.some(p => p.id === rawProject));
        setActiveWorkstationId(owningWs?.id ?? null);
      } else {
        const resolved = ensureActiveTab(rawTabs, ws);
        setTabs(resolved.tabs);
        setActiveProject(resolved.activeProject);
        const owningWs = ws.find(w => w.projects.some(p => p.id === resolved.activeProject));
        setActiveWorkstationId(owningWs?.id ?? null);
      }

      setHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
