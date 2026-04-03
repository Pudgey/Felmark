"use client";

import { useState } from "react";
import { INITIAL_WORKSTATIONS } from "@/lib/constants";
import type { Block, Workstation, Tab, ArchivedProject } from "@/lib/types";
import Rail from "@/components/rail/Rail";
import Sidebar from "@/components/sidebar/Sidebar";
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
import { useShellLayout } from "@/forge/hooks/useShellLayout";

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

export default function Dashboard() {
  const [workstations, setWorkstations] = useState<Workstation[]>(() => loadFromStorage("workstations", null) ?? INITIAL_WORKSTATIONS);
  const [tabs, setTabs] = useState<Tab[]>(() => loadFromStorage("tabs", null) ?? INITIAL_TABS.map(t => ({ ...t, active: false })));
  const [activeProject, setActiveProject] = useState(() => loadFromStorage("activeProject", null) ?? "");
  const [blocksMap, setBlocksMap] = useState<Record<string, Block[]>>(() => loadFromStorage("blocksMap", null) ?? getInitialBlocks());
  const [archived, setArchived] = useState<ArchivedProject[]>(() => loadFromStorage("archived", null) ?? []);
  const [comments, setComments] = useState<Comment[]>(() => loadFromStorage("comments", null) ?? INITIAL_COMMENTS);
  const [activitiesMap, setActivitiesMap] = useState<Record<string, BlockActivity[]>>(() => loadFromStorage("activitiesMap", null) ?? { p1: INITIAL_ACTIVITIES });
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
  const [activeWorkstationId, setActiveWorkstationId] = useState<string | null>(null);
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
    forge, toggleWorkstation, selectWorkstation, selectProject,
    calendarOpenProject, handleTabClick, openForgeRail,
    handleTabClose, handleTabRename, handleTabReorder,
    togglePin, cycleStatus, addWorkstation, completeOnboarding,
    finishCreation, skipOnboarding, updateProjectDue,
    archiveProject, archiveCompletedInWorkstation, archiveWorkstation, restoreProject,
    handleNewTab, handleNewTabInWorkstation,
    handleBlocksChange, handleWordCountChange,
    navigateRail, handleRenameWorkstation,
  } = actions;

  const activeBlocks = blocksMap[activeProject] || HYDRATION_SAFE_EMPTY_BLOCKS;

  const showSidebar = !zenMode && !creationAnim && onboardingName === null;
  const hasActiveTab = tabs.some(t => t.active);
  const showNavigationSidebar = showSidebar && railActive === "workstations" && !hasActiveTab;
  const showEditorSidebar = showSidebar && railActive === "workstations" && hasActiveTab;

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
      {showNavigationSidebar && (
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
      {showEditorSidebar && (
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
          onSaveNow={saveNow}
        />
      )}
      {/* Resize handle */}
      {sidebarOpen && (showNavigationSidebar || showEditorSidebar) && (
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
