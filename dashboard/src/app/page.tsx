"use client";

import { useState, useEffect } from "react";
import { BLOCK_TYPES, INITIAL_WORKSTATIONS } from "@/lib/constants";
import type { Block, Workstation, Tab, ArchivedProject } from "@/lib/types";
import Rail from "@/components/rail/Rail";
import EditorSidebar from "@/components/sidebar/EditorSidebar";
import WorkstationOnboarding from "@/components/onboarding/WorkstationOnboarding";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { INITIAL_COMMENTS, type Comment } from "@/components/comments/CommentPanel";
import { INITIAL_ACTIVITIES, type BlockActivity } from "@/components/activity/ActivityMargin";
import CreationAnimation from "@/components/onboarding/CreationAnimation";
import Launchpad from "@/components/launchpad/Launchpad";
import type { DocumentTemplate } from "@/lib/types";
import { STARTER_TEMPLATES } from "@/lib/starter-templates";
import SaveTemplateModal from "@/components/workstation/templates/SaveTemplateModal";
import { useWorkstationActions, type CreationAnimState } from "@/forge/hooks/useWorkstationActions";
import TemplatePicker from "@/components/workstation/templates/TemplatePicker";
import ViewRouter from "@/views/ViewRouter";
import { usePersistence, loadFromStorage } from "@/forge/hooks/usePersistence";
import { loadEditorMemory, saveEditorMemory, type EditorMemoryDebugReport } from "@/forge";
import { useShellLayout } from "@/forge/hooks/useShellLayout";

const SUPPORTED_BLOCK_TYPES = new Set(BLOCK_TYPES.map((block) => block.type));

const INITIAL_TABS: Tab[] = [
  { id: "p1", name: "Brand Guidelines v2", client: "Meridian Studio", active: true },
];

/** Ensure at least one tab is active. */
function ensureActiveTab(tabs: Tab[], workstations: Workstation[]): { tabs: Tab[]; activeProject: string } {
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

const EMPTY_BLOCKS: Block[] = [];

function hasEditorMemoryAlerts(report: EditorMemoryDebugReport): boolean {
  return (
    report.migrationsApplied.length > 0 ||
    report.unknownBlockTypes.length > 0 ||
    report.deprecatedBlockTypes.length > 0 ||
    report.fallbackConversions.length > 0
  );
}

export default function Dashboard() {
  // SSR-safe defaults — always render the same HTML on server and client first pass
  const ssrDefault = ensureActiveTab(
    INITIAL_TABS.map(t => ({ ...t, active: false })),
    INITIAL_WORKSTATIONS,
  );

  const [workstations, setWorkstations] = useState<Workstation[]>(INITIAL_WORKSTATIONS);
  const [tabs, setTabs] = useState<Tab[]>(ssrDefault.tabs);
  const [activeProject, setActiveProject] = useState(ssrDefault.activeProject);
  const [blocksMap, setBlocksMap] = useState<Record<string, Block[]>>(getInitialBlocks);
  const [archived, setArchived] = useState<ArchivedProject[]>([]);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [activitiesMap, setActivitiesMap] = useState<Record<string, BlockActivity[]>>({ p1: INITIAL_ACTIVITIES });
  const [activeWorkstationId, setActiveWorkstationId] = useState<string | null>(() => {
    const ws = INITIAL_WORKSTATIONS.find(w => w.projects.some(p => p.id === ssrDefault.activeProject));
    return ws?.id ?? null;
  });

  // Hydrate from localStorage after mount
  const [_hydrated, setHydrated] = useState(false);
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
    const rawTabs = savedTabs ?? INITIAL_TABS.map(t => ({ ...t, active: false }));
    const rawProject = savedProject ?? "";

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

      if (rawProject && rawTabs.some(t => t.active && t.id === rawProject)) {
        setTabs(rawTabs);
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
  }, []);
  const {
    updateWorkstations, updateTabs, updateActiveProject, updateBlocksMap,
    updateArchived, updateComments, updateActivitiesMap,
    saveIndicatorState, saveStatusLabel, saveNow,
  } = usePersistence({
    state: { workstations, tabs, activeProject, blocksMap, archived, comments, activitiesMap },
    setters: { setWorkstations, setTabs, setActiveProject, setBlocksMap, setArchived, setComments, setActivitiesMap },
  });

  const {
    sidebarOpen, setSidebarOpen,
    railActive, setRailActive,
    sidebarWidth, setSidebarWidth,
    isResizing, setIsResizing,
    calendarScrollTarget, setCalendarScrollTarget,
    launchpadOpen, setLaunchpadOpen,
    zenMode, setZenMode,
    splitProject, setSplitProject,
    resizeRef,
    restoreWorkstationContext,
  } = useShellLayout();

  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [onboardingName, setOnboardingName] = useState<string | null>(null);
  const [creationAnim, setCreationAnim] = useState<CreationAnimState>(null);
  const [docTemplates, setDocTemplates] = useState<DocumentTemplate[]>(STARTER_TEMPLATES);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  const overdueCount = workstations.reduce((s, w) => s + w.projects.filter(p => p.status === "overdue").length, 0);

  // ── All workstation handlers via extracted hook ──
  const actions = useWorkstationActions({
    workstations, tabs, activeProject, activeWorkstationId,
    blocksMap, archived, comments, activitiesMap,
    creationAnim, onboardingName,
    updateWorkstations, updateTabs, updateActiveProject, updateBlocksMap,
    updateArchived, updateComments, updateActivitiesMap,
    setActiveWorkstationId, setWordCount, setCharCount,
    setOnboardingName, setCreationAnim, setSplitProject,
    restoreWorkstationContext, setRailActive, setLaunchpadOpen, setSidebarOpen, setCalendarScrollTarget,
  });

  const {
    forge, toggleWorkstation: _toggleWorkstation, selectWorkstation, selectProject,
    calendarOpenProject, handleTabClick, openForgeRail,
    handleTabClose, handleTabRename, handleTabReorder,
    togglePin: _togglePin, cycleStatus: _cycleStatus, addWorkstation: _addWorkstation, completeOnboarding,
    finishCreation, skipOnboarding, updateProjectDue,
    archiveProject, archiveCompletedInWorkstation: _archiveCompletedInWorkstation, archiveWorkstation: _archiveWorkstation, restoreProject,
    handleNewTab, handleNewTabInWorkstation,
    handleBlocksChange, handleWordCountChange,
    navigateRail, handleRenameWorkstation,
  } = actions;

  const activeBlocks = blocksMap[activeProject] || EMPTY_BLOCKS;

  const showSidebar = !zenMode && !creationAnim && onboardingName === null && railActive === "workstations";

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
      {showSidebar && (
        <EditorSidebar
          workstation={workstations.find(w => w.id === activeWorkstationId) ?? null}
          workstations={workstations}
          activeProject={activeProject}
          activeTab={tabs.find(t => t.active) ?? null}
          blocks={activeBlocks}
          tabs={tabs}
          blocksMap={blocksMap}
          open={sidebarOpen}
          width={sidebarWidth}
          isResizing={isResizing}
          saveIndicatorState={saveIndicatorState}
          saveStatusLabel={saveStatusLabel}
          onClose={() => setSidebarOpen(false)}
          onTabClick={handleTabClick}
          onNewTab={handleNewTab}
          onSelectProject={selectProject}
          onSelectWorkstation={selectWorkstation}
          onDuplicateProject={(id: string) => forge.projects.duplicate(id)}
          onArchiveProject={archiveProject}
          archived={archived}
          onRestoreProject={restoreProject}
          onPermanentDelete={(idx: number) => forge.projects.permanentDelete(idx)}
          onSaveNow={saveNow}
        />
      )}
      {/* Resize handle */}
      {sidebarOpen && showSidebar && (
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
          workstationProps={{
            workstations,
            tabs,
            activeProject,
            activeWorkstationId,
            activeBlocks,
            blocksMap,
            sidebarOpen,
            wordCount,
            charCount,
            splitProject,
            comments,
            activities: activitiesMap[activeProject] || [],
            docTemplates,
            zenMode,
            onOpenSidebar: () => setSidebarOpen(true),
            onTabClick: handleTabClick,
            onTabClose: handleTabClose,
            onNewTab: handleNewTab,
            onTabRename: handleTabRename,
            onTabReorder: handleTabReorder,
            onBlocksChange: handleBlocksChange,
            onWordCountChange: handleWordCountChange,
            onSelectProject: selectProject,
            onSelectWorkstation: selectWorkstation,
            onNavigateRail: navigateRail,
            onSaveAsTemplate: () => setShowSaveTemplate(true),
            onRenameWorkstation: handleRenameWorkstation,
            onUpdateProjectDue: updateProjectDue,
            onCommentsChange: updateComments,
            onActivitiesChange: (newActivities) => updateActivitiesMap(prev => ({ ...prev, [activeProject]: newActivities })),
            onToggleZen: () => setZenMode(prev => !prev),
            onSplitOpen: (id) => setSplitProject(id),
            onSplitClose: () => setSplitProject(null),
            onSplitMakePrimary: () => {
              if (!splitProject) return;
              const ws = workstations.find(w => w.projects.some(p => p.id === splitProject));
              const proj = ws?.projects.find(p => p.id === splitProject);
              if (ws && proj) {
                selectProject(proj, ws.client);
                setSplitProject(null);
              }
            },
            onForgeClose: restoreWorkstationContext,
            onForgeSave: (newBlocks) => {
              if (activeProject) {
                updateBlocksMap(prev => ({ ...prev, [activeProject]: newBlocks }));
              }
            },
          }}
          dashboardProps={{
            workstations,
            overdueCount,
            calendarScrollTarget,
            onSelectWorkstation: selectWorkstation,
            onSelectProject: selectProject,
            onNewTabInWorkstation: handleNewTabInWorkstation,
            onNewWorkstation: () => setOnboardingName("New Client"),
            onCalendarOpenProject: calendarOpenProject,
            onCalendarScrollComplete: () => setCalendarScrollTarget(null),
            onNavigateRail: navigateRail,
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
