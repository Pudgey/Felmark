"use client";

import { useCallback, useRef, useEffect, type Dispatch, type SetStateAction } from "react";
import type { Block, Workstation, Project, Tab, ArchivedProject, WorkstationTemplate } from "@/lib/types";
import type { Comment } from "@/components/comments/CommentPanel";
import type { BlockActivity } from "@/components/activity/ActivityMargin";
import { createForge, type StateUpdater, type Forge } from "@/forge";

// ── Config interface ──

// ── Creation animation state type (shared with page.tsx) ──
export type CreationAnimState = {
  name: string;
  template: string;
  color: string;
  pendingData: { name: string; contact: string; rate: string; budget: string; color: string; template: WorkstationTemplate };
} | null;

export interface UseWorkstationActionsConfig {
  // Data state
  workstations: Workstation[];
  tabs: Tab[];
  activeProject: string;
  activeWorkstationId: string | null;
  blocksMap: Record<string, Block[]>;
  archived: ArchivedProject[];
  comments: Comment[];
  activitiesMap: Record<string, BlockActivity[]>;

  // Onboarding state (read by finishCreation / skipOnboarding)
  creationAnim: CreationAnimState;
  onboardingName: string | null;

  // Tracked setters from usePersistence
  updateWorkstations: Dispatch<SetStateAction<Workstation[]>>;
  updateTabs: Dispatch<SetStateAction<Tab[]>>;
  updateActiveProject: Dispatch<SetStateAction<string>>;
  updateBlocksMap: Dispatch<SetStateAction<Record<string, Block[]>>>;
  updateArchived: Dispatch<SetStateAction<ArchivedProject[]>>;
  updateComments: Dispatch<SetStateAction<Comment[]>>;
  updateActivitiesMap: Dispatch<SetStateAction<Record<string, BlockActivity[]>>>;

  // Non-persisted setters
  setActiveWorkstationId: Dispatch<SetStateAction<string | null>>;
  setWordCount: Dispatch<SetStateAction<number>>;
  setCharCount: Dispatch<SetStateAction<number>>;
  setOnboardingName: Dispatch<SetStateAction<string | null>>;
  setCreationAnim: Dispatch<SetStateAction<CreationAnimState>>;
  setSplitProject: Dispatch<SetStateAction<string | null>>;

  // Shell layout callbacks
  restoreWorkstationContext: () => void;
  setRailActive: Dispatch<SetStateAction<string>>;
  setLaunchpadOpen: Dispatch<SetStateAction<boolean>>;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setCalendarScrollTarget: Dispatch<SetStateAction<string | null>>;
}

// ── Return type ──

export interface UseWorkstationActionsResult {
  forge: Forge;
  toggleWorkstation: (wid: string) => void;
  selectWorkstation: (wid: string) => void;
  selectProject: (project: Project, client: string) => void;
  calendarOpenProject: (projectId: string) => void;
  handleTabClick: (id: string) => void;
  openForgeRail: () => void;
  handleTabClose: (id: string) => void;
  handleTabRename: (id: string, name: string) => void;
  handleTabReorder: (sourceId: string, targetId: string, position: "before" | "after") => void;
  togglePin: (projectId: string) => void;
  cycleStatus: (projectId: string) => void;
  addWorkstation: (name: string) => void;
  completeOnboarding: (data: { name: string; contact: string; rate: string; budget: string; color: string; template: WorkstationTemplate }) => void;
  finishCreation: () => void;
  skipOnboarding: () => void;
  updateProjectDue: (projectId: string, due: string | null) => void;
  archiveProject: (projectId: string) => void;
  archiveCompletedInWorkstation: (wsId: string) => void;
  archiveWorkstation: (wsId: string) => void;
  restoreProject: (archivedIdx: number) => void;
  handleNewTab: () => void;
  handleNewTabInWorkstation: (wsId: string) => void;
  handleBlocksChange: (projectId: string, blocks: Block[]) => void;
  handleWordCountChange: (words: number, chars: number) => void;
  navigateRail: (item: string) => void;
  handleRenameWorkstation: (wsId: string, name: string) => void;
}

// ── Template labels (used by onboarding) ──

const TEMPLATE_LABELS: Record<WorkstationTemplate, string> = {
  blank: "Blank Project", proposal: "Proposal", meeting: "Meeting Notes",
  brief: "Project Brief", retainer: "Retainer", invoice: "Invoice",
};

// ── Hook ──

export function useWorkstationActions(config: UseWorkstationActionsConfig): UseWorkstationActionsResult {
  const {
    workstations, tabs, activeProject, activeWorkstationId,
    blocksMap, archived: _archived, comments: _comments, activitiesMap: _activitiesMap,
    updateWorkstations, updateTabs, updateActiveProject, updateBlocksMap,
    updateArchived: _updateArchived, updateComments: _updateComments, updateActivitiesMap: _updateActivitiesMap,
    setActiveWorkstationId, setWordCount, setCharCount,
    setOnboardingName, setCreationAnim, setSplitProject: _setSplitProject,
    restoreWorkstationContext, setRailActive, setLaunchpadOpen, setSidebarOpen,
    setCalendarScrollTarget: _setCalendarScrollTarget,
  } = config;

  // ── Forge — the root service layer ──
  const forgeState: StateUpdater = {
    getState: () => ({
      workstations: config.workstations,
      tabs: config.tabs,
      activeProject: config.activeProject,
      blocksMap: config.blocksMap,
      archived: config.archived,
      comments: config.comments,
      activitiesMap: config.activitiesMap,
    }),
    setWorkstations: config.updateWorkstations,
    setTabs: config.updateTabs,
    setActiveProject: config.updateActiveProject,
    setBlocksMap: config.updateBlocksMap,
    setArchived: config.updateArchived,
    setComments: config.updateComments,
    setActivitiesMap: config.updateActivitiesMap,
  };
  const forge = createForge(forgeState);

  // Single click — pure expand/collapse toggle
  const toggleWorkstation = (wid: string) => forge.workstations.toggle(wid);

  // Helper: select a project by opening its tab
  const selectProject = (project: Project, client: string) => {
    restoreWorkstationContext();
    const ws = workstations.find(w => w.projects.some(p => p.id === project.id));
    setActiveWorkstationId(ws?.id ?? null);
    updateActiveProject(project.id);
    if (!tabs.find(t => t.id === project.id)) {
      updateTabs(prev => [...prev.map(t => ({ ...t, active: false })), { id: project.id, name: project.name, client, active: true }]);
    } else {
      updateTabs(prev => prev.map(t => ({ ...t, active: t.id === project.id })));
    }
    // Ensure blocks exist for this project
    if (!blocksMap[project.id]) {
      updateBlocksMap(prev => ({ ...prev, [project.id]: makeEmptyBlocks() }));
    }
  };

  // Double click — open the first project in the workstation
  const selectWorkstation = (wid: string) => {
    restoreWorkstationContext();
    const ws = workstations.find(w => w.id === wid);
    if (!ws) return;
    if (ws.projects.length > 0) {
      selectProject(ws.projects[0], ws.client);
    }
    // Ensure workstation is expanded in sidebar
    updateWorkstations(prev => prev.map(w => w.id === wid ? { ...w, open: true } : w));
  };

  // Double-click calendar event -> open that exact project
  const calendarOpenProject = (projectId: string) => {
    const ws = workstations.find(workstation => workstation.projects.some(project => project.id === projectId));
    const project = ws?.projects.find(item => item.id === projectId);
    if (!ws || !project) return;
    selectProject(project, ws.client);
  };

  const handleTabClick = (id: string) => {
    restoreWorkstationContext();
    const ws = workstations.find(w => w.projects.some(p => p.id === id));
    setActiveWorkstationId(ws?.id ?? null);
    forge.tabs.select(id);
  };

  // ── openForgeRail with ref pattern to prevent stale closures ──
  const openForgeRailRef = useRef<() => void>(undefined);
  const openForgeRailImpl = () => {
    setLaunchpadOpen(false);
    setSidebarOpen(true);

    const currentActiveTab = tabs.find(tab => tab.active);
    if (currentActiveTab) {
      setActiveWorkstationId(null);
      setRailActive("forge");
      return;
    }

    if (activeProject) {
      setActiveWorkstationId(null);
      forge.tabs.select(activeProject);
      setRailActive("forge");
      return;
    }

    const workstationContext = activeWorkstationId
      ? workstations.find(workstation => workstation.id === activeWorkstationId)
      : null;
    const workstationProject = workstationContext?.projects[0];
    if (workstationContext && workstationProject) {
      selectProject(workstationProject, workstationContext.client);
      setRailActive("forge");
      return;
    }

    const fallbackTab = tabs[0];
    if (fallbackTab) {
      setActiveWorkstationId(null);
      forge.tabs.select(fallbackTab.id);
      setRailActive("forge");
      return;
    }

    const fallbackWorkstation = workstations[0];
    const fallbackProject = fallbackWorkstation?.projects[0];
    if (fallbackWorkstation && fallbackProject) {
      selectProject(fallbackProject, fallbackWorkstation.client);
      setRailActive("forge");
      return;
    }

    restoreWorkstationContext();
  };
  useEffect(() => { openForgeRailRef.current = openForgeRailImpl; });
  const openForgeRail = useCallback(() => openForgeRailRef.current?.(), []);

  const handleTabClose = (id: string) => forge.tabs.close(id);
  const handleTabRename = (id: string, name: string) => forge.projects.rename(id, name);
  const handleTabReorder = (sourceId: string, targetId: string, position: "before" | "after") => forge.tabs.reorder(sourceId, targetId, position);

  const togglePin = (projectId: string) => forge.projects.togglePin(projectId);
  const cycleStatus = (projectId: string) => forge.projects.cycleStatus(projectId);

  const addWorkstation = (name: string) => {
    // Show onboarding card instead of creating immediately
    setOnboardingName(name);
  };

  const completeOnboarding = (data: { name: string; contact: string; rate: string; budget: string; color: string; template: WorkstationTemplate }) => {
    setOnboardingName(null);
    setCreationAnim({ name: data.name, template: TEMPLATE_LABELS[data.template], color: data.color, pendingData: data });
  };

  const finishCreation = () => {
    if (!config.creationAnim) return;
    forge.workstations.create(config.creationAnim.pendingData);
    setCreationAnim(null);
  };

  const skipOnboarding = () => {
    if (!config.onboardingName) return;
    forge.workstations.quickCreate(config.onboardingName);
    setOnboardingName(null);
  };

  const updateProjectDue = (projectId: string, due: string | null) => forge.projects.setDue(projectId, due);

  const archiveProject = (projectId: string) => forge.projects.archive(projectId);
  const archiveCompletedInWorkstation = (wsId: string) => forge.workstations.archiveCompleted(wsId);
  const archiveWorkstation = (wsId: string) => forge.workstations.archive(wsId);
  const restoreProject = (archivedIdx: number) => forge.projects.restore(archivedIdx);

  const handleNewTab = () => {
    restoreWorkstationContext();
    const activeWs = workstations.find(w => w.projects.some(p => p.id === activeProject)) || workstations[0];
    forge.projects.createInWorkstation(activeWs.id);
  };

  const handleNewTabInWorkstation = (wsId: string) => {
    restoreWorkstationContext();
    setActiveWorkstationId(null);
    forge.projects.createInWorkstation(wsId);
  };

  // ── forgeRef pattern for stable handleBlocksChange callback ──
  const forgeRef = useRef(forge);
  useEffect(() => { forgeRef.current = forge; });
  const handleBlocksChange = useCallback((projectId: string, blocks: Block[]) => {
    forgeRef.current.documents.setBlocks(projectId, blocks);
  }, []);

  const handleWordCountChange = useCallback((words: number, chars: number) => {
    setWordCount(words);
    setCharCount(chars);
  }, [setWordCount, setCharCount]);

  const navigateRail = useCallback((item: string) => {
    if (item === "workstations") {
      restoreWorkstationContext();
      return;
    }
    if (item === "forge") {
      openForgeRail();
      return;
    }
    setLaunchpadOpen(false);
    setRailActive(item);
    if (item === "home") {
      setActiveWorkstationId(null);
      updateTabs(prev => prev.map(t => ({ ...t, active: false })));
      updateActiveProject("");
      setSidebarOpen(true);
    }
  }, [restoreWorkstationContext, openForgeRail, updateTabs, updateActiveProject, setLaunchpadOpen, setRailActive, setSidebarOpen, setActiveWorkstationId]);

  const handleRenameWorkstation = useCallback((wsId: string, name: string) => {
    updateWorkstations(prev => prev.map(w => w.id === wsId ? { ...w, client: name, avatar: name[0].toUpperCase() } : w));
    updateTabs(prev => prev.map(t => {
      const ws = workstations.find(w => w.id === wsId);
      if (ws && ws.projects.some(p => p.id === t.id)) return { ...t, client: name };
      return t;
    }));
  }, [updateWorkstations, updateTabs, workstations]);

  return {
    forge,
    toggleWorkstation,
    selectWorkstation,
    selectProject,
    calendarOpenProject,
    handleTabClick,
    openForgeRail,
    handleTabClose,
    handleTabRename,
    handleTabReorder,
    togglePin,
    cycleStatus,
    addWorkstation,
    completeOnboarding,
    finishCreation,
    skipOnboarding,
    updateProjectDue,
    archiveProject,
    archiveCompletedInWorkstation,
    archiveWorkstation,
    restoreProject,
    handleNewTab,
    handleNewTabInWorkstation,
    handleBlocksChange,
    handleWordCountChange,
    navigateRail,
    handleRenameWorkstation,
  };
}

// ── Helper (copied from page.tsx) ──
import { uid } from "@/lib/utils";

function makeEmptyBlocks(): Block[] {
  return [
    { id: uid(), type: "h1", content: "", checked: false },
    { id: uid(), type: "paragraph", content: "", checked: false },
  ];
}
