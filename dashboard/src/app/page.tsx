"use client";

import { useState, useCallback, useRef, useEffect, type SetStateAction } from "react";
import { INITIAL_WORKSTATIONS } from "@/lib/constants";
import type { Block, Workstation, Project, Tab, ArchivedProject, WorkstationTemplate } from "@/lib/types";
import { uid, makeBlocks } from "@/lib/utils";
import Rail from "@/components/rail/Rail";
import Sidebar from "@/components/sidebar/Sidebar";
import WorkstationSidebar from "@/components/sidebar/WorkstationSidebar";
import WorkstationOnboarding from "@/components/onboarding/WorkstationOnboarding";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { INITIAL_COMMENTS, type Comment } from "@/components/comments/CommentPanel";
import { INITIAL_ACTIVITIES, type BlockActivity } from "@/components/activity/ActivityMargin";
import CreationAnimation from "@/components/onboarding/CreationAnimation";
import Launchpad from "@/components/launchpad/Launchpad";
import type { DocumentTemplate } from "@/lib/types";
import { STARTER_TEMPLATES } from "@/lib/starter-templates";
import { createForge } from "@/forge";
import type { StateUpdater } from "@/forge";
import SaveTemplateModal from "@/components/workstation/templates/SaveTemplateModal";
import TemplatePicker from "@/components/workstation/templates/TemplatePicker";
import ViewRouter from "@/views/ViewRouter";

const INITIAL_TABS: Tab[] = [
  { id: "p1", name: "Brand Guidelines v2", client: "Meridian Studio", active: true },
];

function getInitialBlocks(): Record<string, Block[]> {
  return {
    p1: [
      { id: "seed-p1-title", type: "h1", content: "Brand Guidelines v2", checked: false },
      { id: "seed-p1-meta", type: "callout", content: "Client: Meridian Studio — Due Apr 3 — Budget: $2,400", checked: false },
      { id: "seed-p1-deliverables", type: "h2", content: "Deliverables", checked: false },
      { id: "seed-p1-todo-logo", type: "todo", content: "Primary & secondary logo usage rules", checked: true },
      { id: "seed-p1-todo-colors", type: "todo", content: "Color palette with hex/RGB/CMYK values", checked: true },
      { id: "seed-p1-todo-typography", type: "todo", content: "Typography scale & font pairings", checked: false },
      { id: "seed-p1-todo-imagery", type: "todo", content: "Imagery & photography direction", checked: false },
      { id: "seed-p1-todo-social", type: "todo", content: "Social media templates (IG, LinkedIn)", checked: false },
      { id: "seed-p1-divider", type: "divider", content: "", checked: false },
      { id: "seed-p1-notes-heading", type: "h2", content: "Notes", checked: false },
      { id: "seed-p1-notes-body", type: "paragraph", content: "", checked: false },
    ],
  };
}

const HYDRATION_SAFE_EMPTY_BLOCKS: Block[] = [
  { id: "seed-empty-title", type: "h1", content: "", checked: false },
  { id: "seed-empty-body", type: "paragraph", content: "", checked: false },
];

function makeEmptyBlocks(): Block[] {
  return [
    { id: uid(), type: "h1", content: "", checked: false },
    { id: uid(), type: "paragraph", content: "", checked: false },
  ];
}

// ── localStorage persistence ──
const STORAGE_KEY = "felmark_workspace";

function loadFromStorage<T>(key: string, fallback: T): T {
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

export default function Dashboard() {
  const [workstations, setWorkstations] = useState<Workstation[]>(INITIAL_WORKSTATIONS);
  const [tabs, setTabs] = useState<Tab[]>(INITIAL_TABS.map(t => ({ ...t, active: false })));
  const [activeProject, setActiveProject] = useState("");
  const [blocksMap, setBlocksMap] = useState<Record<string, Block[]>>(() => getInitialBlocks());
  const [archived, setArchived] = useState<ArchivedProject[]>([]);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [activitiesMap, setActivitiesMap] = useState<Record<string, BlockActivity[]>>({ p1: INITIAL_ACTIVITIES });
  const [saveIndicatorState, setSaveIndicatorState] = useState<"saved" | "saving">("saved");
  const [saveRequestToken, setSaveRequestToken] = useState(0);
  const [lastCompletedSaveToken, setLastCompletedSaveToken] = useState<number | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [saveStatusTick, setSaveStatusTick] = useState(0);

  // ── Hydrate from localStorage after mount (avoids SSR mismatch) ──
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const ws = loadFromStorage("workstations", null);
    if (ws) setWorkstations(ws);
    const t = loadFromStorage("tabs", null);
    if (t) setTabs(t);
    const ap = loadFromStorage("activeProject", null);
    if (ap !== null) setActiveProject(ap);
    const bm = loadFromStorage("blocksMap", null);
    if (bm) setBlocksMap(bm);
    const ar = loadFromStorage("archived", null);
    if (ar) setArchived(ar);
    const cm = loadFromStorage("comments", null);
    if (cm) setComments(cm);
    const am = loadFromStorage("activitiesMap", null);
    if (am) setActivitiesMap(am);
    const ls = loadFromStorage("lastSavedAt", null);
    if (typeof ls === "number") {
      setLastSavedAt(ls);
      setSaveStatusTick(ls);
    }
    setHydrated(true);
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [railActive, setRailActive] = useState("workstations");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [onboardingName, setOnboardingName] = useState<string | null>(null);
  const [creationAnim, setCreationAnim] = useState<{ name: string; template: string; color: string; pendingData: { name: string; contact: string; rate: string; budget: string; color: string; template: WorkstationTemplate } } | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const [activeWorkstationId, setActiveWorkstationId] = useState<string | null>(null);
  const [calendarScrollTarget, setCalendarScrollTarget] = useState<string | null>(null);
  const [launchpadOpen, setLaunchpadOpen] = useState(false);
  const [docTemplates, setDocTemplates] = useState<DocumentTemplate[]>(STARTER_TEMPLATES);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [splitProject, setSplitProject] = useState<string | null>(null);
  const resizeRef = useRef<{ startX: number; startW: number } | null>(null);

  const overdueCount = workstations.reduce((s, w) => s + w.projects.filter(p => p.status === "overdue").length, 0);

  // ── Auto-save to localStorage (debounced 500ms) ──
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const markSavePending = useCallback(() => {
    if (!hydrated) return;
    let nextToken = 0;
    setSaveRequestToken(prev => {
      nextToken = prev + 1;
      return nextToken;
    });
    setSaveIndicatorState("saving");
    return nextToken;
  }, [hydrated]);

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

  const updateWorkstations = useCallback((value: SetStateAction<Workstation[]>) => {
    markSavePending();
    setWorkstations(value);
  }, [markSavePending]);

  const updateTabs = useCallback((value: SetStateAction<Tab[]>) => {
    markSavePending();
    setTabs(value);
  }, [markSavePending]);

  const updateActiveProject = useCallback((value: SetStateAction<string>) => {
    markSavePending();
    setActiveProject(value);
  }, [markSavePending]);

  const updateBlocksMap = useCallback((value: SetStateAction<Record<string, Block[]>>) => {
    markSavePending();
    setBlocksMap(value);
  }, [markSavePending]);

  const updateArchived = useCallback((value: SetStateAction<ArchivedProject[]>) => {
    markSavePending();
    setArchived(value);
  }, [markSavePending]);

  const updateComments = useCallback((value: SetStateAction<Comment[]>) => {
    markSavePending();
    setComments(value);
  }, [markSavePending]);

  const updateActivitiesMap = useCallback((value: SetStateAction<Record<string, BlockActivity[]>>) => {
    markSavePending();
    setActivitiesMap(value);
  }, [markSavePending]);

  useEffect(() => {
    if (!hydrated || saveRequestToken === 0) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      persistWorkstationState(saveRequestToken);
      saveTimer.current = null;
    }, 800);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [hydrated, persistWorkstationState, saveRequestToken]);

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

  useEffect(() => {
    if (lastCompletedSaveToken === null || lastCompletedSaveToken !== saveRequestToken) return;
    const timer = window.setTimeout(() => setSaveIndicatorState("saved"), 450);
    return () => window.clearTimeout(timer);
  }, [lastCompletedSaveToken, saveRequestToken]);

  useEffect(() => {
    if (!lastSavedAt) return;
    const tick = window.setInterval(() => setSaveStatusTick(Date.now()), 30000);
    return () => window.clearInterval(tick);
  }, [lastSavedAt]);

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

  // Zen mode: Escape to exit
  useEffect(() => {
    if (!zenMode) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZenMode(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [zenMode]);


  // ── Forge — the root service layer ──
  const forgeState: StateUpdater = {
    getState: () => ({ workstations, tabs, activeProject, blocksMap, archived, comments, activitiesMap }),
    setWorkstations: updateWorkstations,
    setTabs: updateTabs,
    setActiveProject: updateActiveProject,
    setBlocksMap: updateBlocksMap,
    setArchived: updateArchived,
    setComments: updateComments,
    setActivitiesMap: updateActivitiesMap,
  };
  const forge = createForge(forgeState);

  // Single click — pure expand/collapse toggle
  const toggleWorkstation = (wid: string) => forge.workstations.toggle(wid);

  const restoreWorkstationContext = () => {
    setRailActive("workstations");
    setLaunchpadOpen(false);
    setSidebarOpen(true);
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

  // Double-click calendar event → open that exact project
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

  const openForgeRail = () => {
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

  const handleTabClose = (id: string) => forge.tabs.close(id);

  const handleTabRename = (id: string, name: string) => forge.projects.rename(id, name);

  const handleTabReorder = (sourceId: string, targetId: string, position: "before" | "after") => forge.tabs.reorder(sourceId, targetId, position);

  const togglePin = (projectId: string) => forge.projects.togglePin(projectId);
  const cycleStatus = (projectId: string) => forge.projects.cycleStatus(projectId);

  const addWorkstation = (name: string) => {
    // Show onboarding card instead of creating immediately
    setOnboardingName(name);
  };

  const TEMPLATE_LABELS: Record<WorkstationTemplate, string> = {
    blank: "Blank Project", proposal: "Proposal", meeting: "Meeting Notes",
    brief: "Project Brief", retainer: "Retainer", invoice: "Invoice",
  };

  const completeOnboarding = (data: { name: string; contact: string; rate: string; budget: string; color: string; template: WorkstationTemplate }) => {
    setOnboardingName(null);
    setCreationAnim({ name: data.name, template: TEMPLATE_LABELS[data.template], color: data.color, pendingData: data });
  };

  const finishCreation = () => {
    if (!creationAnim) return;
    forge.workstations.create(creationAnim.pendingData);
    setCreationAnim(null);
  };

  const skipOnboarding = () => {
    if (!onboardingName) return;
    forge.workstations.quickCreate(onboardingName);
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

  const handleBlocksChange = useCallback((projectId: string, blocks: Block[]) => {
    forge.documents.setBlocks(projectId, blocks);
  }, []);

  const handleWordCountChange = useCallback((words: number, chars: number) => {
    setWordCount(words);
    setCharCount(chars);
  }, []);

  const activeBlocks = blocksMap[activeProject] || HYDRATION_SAFE_EMPTY_BLOCKS;

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
  }, [restoreWorkstationContext, openForgeRail, updateTabs, updateActiveProject]);

  const handleRenameWorkstation = useCallback((wsId: string, name: string) => {
    updateWorkstations(prev => prev.map(w => w.id === wsId ? { ...w, client: name, avatar: name[0].toUpperCase() } : w));
    updateTabs(prev => prev.map(t => {
      const ws = workstations.find(w => w.id === wsId);
      if (ws && ws.projects.some(p => p.id === t.id)) return { ...t, client: name };
      return t;
    }));
  }, [updateWorkstations, updateTabs, workstations]);

  const showWorkstationSidebar = !zenMode
    && railActive === "workstations"
    && !creationAnim
    && onboardingName === null;

  return (
    <ErrorBoundary>
    <div style={{ display: "flex", height: "100dvh", background: "var(--parchment)" }}>
      {!zenMode && <Rail
        activeItem={railActive}
        overdueCount={overdueCount}
        onItemClick={(item) => {
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
        }}
        zenMode={zenMode}
        onToggleZen={() => setZenMode(true)}
      />}
      {showWorkstationSidebar && (
          <Sidebar
            workstations={workstations}
            archived={archived}
            activeProject={activeProject}
            open={sidebarOpen}
            width={sidebarWidth}
            isResizing={isResizing}
            wordCount={wordCount}
            railActive={railActive}
            onClose={() => setSidebarOpen(false)}
            onToggleWorkstation={toggleWorkstation}
            onSelectWorkstation={selectWorkstation}
            onSelectProject={selectProject}
            onArchiveProject={archiveProject}
            onArchiveCompleted={archiveCompletedInWorkstation}
            onArchiveWorkstation={archiveWorkstation}
            onRestoreProject={restoreProject}
            onRenameProject={handleTabRename}
            onUpdateProjectDue={updateProjectDue}
            onRenameWorkstation={(wsId, name) => forge.workstations.rename(wsId, name)}
            onReorderWorkstations={(fromIdx, toIdx) => forge.workstations.reorder(fromIdx, toIdx)}
            onAddWorkstation={addWorkstation}
            onTogglePin={togglePin}
            onCycleStatus={cycleStatus}
            onScrollToCalendarEvent={(projectId) => setCalendarScrollTarget(projectId)}
            saveIndicatorState={saveIndicatorState}
            saveStatusLabel={saveStatusLabel}
            onSaveNow={saveNow}
          />
      )}
      {/* Resize handle */}
      {sidebarOpen && showWorkstationSidebar && (
        <div
          style={{
            width: 5,
            cursor: "col-resize",
            flexShrink: 0,
            position: "relative",
            zIndex: 10,
            marginLeft: -3,
            marginRight: -2,
          }}
          onMouseDown={e => {
            e.preventDefault();
            resizeRef.current = { startX: e.clientX, startW: sidebarWidth };
            setIsResizing(true);

            const onMouseMove = (ev: MouseEvent) => {
              if (!resizeRef.current) return;
              const delta = ev.clientX - resizeRef.current.startX;
              const newW = Math.min(720, Math.max(220, resizeRef.current.startW + delta));
              setSidebarWidth(newW);
            };

            const onMouseUp = () => {
              resizeRef.current = null;
              setIsResizing(false);
              document.removeEventListener("mousemove", onMouseMove);
              document.removeEventListener("mouseup", onMouseUp);
              document.body.style.cursor = "";
              document.body.style.userSelect = "";
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 2,
            width: 1,
            background: isResizing ? "var(--ember)" : "transparent",
            transition: isResizing ? "none" : "background 0.15s",
          }} />
        </div>
      )}
      {creationAnim ? (
        <CreationAnimation
          clientName={creationAnim.name}
          templateName={creationAnim.template}
          color={creationAnim.color}
          onComplete={finishCreation}
        />
      ) : onboardingName !== null ? (
        <div style={{ flex: 1, overflow: "auto", background: "var(--parchment)" }}>
          <WorkstationOnboarding
            initialName={onboardingName}
            workstations={workstations}
            onComplete={completeOnboarding}
            onSkip={skipOnboarding}
          />
        </div>
      ) : (
        <ViewRouter
          railActive={railActive}
          workstations={workstations}
          tabs={tabs}
          activeProject={activeProject}
          activeWorkstationId={activeWorkstationId}
          activeBlocks={activeBlocks}
          blocksMap={blocksMap}
          sidebarOpen={sidebarOpen}
          wordCount={wordCount}
          charCount={charCount}
          overdueCount={overdueCount}
          splitProject={splitProject}
          comments={comments}
          activities={activitiesMap[activeProject] || []}
          docTemplates={docTemplates}
          zenMode={zenMode}
          calendarScrollTarget={calendarScrollTarget}
          onOpenSidebar={() => setSidebarOpen(true)}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
          onNewTab={handleNewTab}
          onTabRename={handleTabRename}
          onTabReorder={handleTabReorder}
          onBlocksChange={handleBlocksChange}
          onWordCountChange={handleWordCountChange}
          onSelectProject={selectProject}
          onSelectWorkstation={selectWorkstation}
          onNavigateRail={navigateRail}
          onSaveAsTemplate={() => setShowSaveTemplate(true)}
          onRenameWorkstation={handleRenameWorkstation}
          onUpdateProjectDue={updateProjectDue}
          onCommentsChange={updateComments}
          onActivitiesChange={(newActivities) => updateActivitiesMap(prev => ({ ...prev, [activeProject]: newActivities }))}
          onToggleZen={() => setZenMode(prev => !prev)}
          onSplitOpen={(id) => setSplitProject(id)}
          onSplitClose={() => setSplitProject(null)}
          onSplitMakePrimary={() => {
            if (!splitProject) return;
            const ws = workstations.find(w => w.projects.some(p => p.id === splitProject));
            const proj = ws?.projects.find(p => p.id === splitProject);
            if (ws && proj) {
              selectProject(proj, ws.client);
              setSplitProject(null);
            }
          }}
          onNewWorkstation={() => setOnboardingName("New Client")}
          onNewTabInWorkstation={handleNewTabInWorkstation}
          onCalendarOpenProject={calendarOpenProject}
          onCalendarScrollComplete={() => setCalendarScrollTarget(null)}
          onForgeClose={restoreWorkstationContext}
          onForgeSave={(newBlocks) => {
            if (activeProject) {
              updateBlocksMap(prev => ({ ...prev, [activeProject]: newBlocks }));
            }
          }}
        />
      )}
    </div>

    <Launchpad
      open={launchpadOpen}
      onClose={() => setLaunchpadOpen(false)}
      workstations={workstations}
      onNavigate={(screenId) => {
        setRailActive(screenId);
        if (screenId === "home") {
          setActiveWorkstationId(null);
          updateTabs(prev => prev.map(t => ({ ...t, active: false })));
          updateActiveProject("");
        }
        setSidebarOpen(true);
      }}
      onSelectWorkstation={(wsId) => {
        selectWorkstation(wsId);
        setRailActive("workstations");
      }}
      onOpenCommandPalette={() => {
        // Editor manages command palette state internally
        // This is a placeholder — in the future, lift cmdPalette state to page.tsx
      }}
    />

    <SaveTemplateModal
      open={showSaveTemplate}
      onClose={() => setShowSaveTemplate(false)}
      blocks={blocksMap[activeProject] || []}
      onSave={(template) => setDocTemplates(prev => [...prev, template])}
    />

    <TemplatePicker
      open={showTemplatePicker}
      onClose={() => setShowTemplatePicker(false)}
      templates={docTemplates}
      onSelectBlank={() => {
        // Just close — the new tab is already created with blank blocks
      }}
      onSelectTemplate={(blocks) => {
        if (activeProject) {
          updateBlocksMap(prev => ({ ...prev, [activeProject]: blocks }));
        }
      }}
    />
    </ErrorBoundary>
  );
}
