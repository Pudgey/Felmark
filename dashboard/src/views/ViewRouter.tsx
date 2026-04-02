"use client";

import type { Block, Workstation, Tab, Project, DocumentTemplate } from "@/lib/types";
import type { Comment } from "@/components/comments/CommentPanel";
import type { BlockActivity } from "@/components/activity/ActivityMargin";

import WorkspaceView from "./workspace";
import CalendarView from "./calendar";
import SearchView from "./search";
import ServicesView from "./services";
import PipelineView from "./pipeline";
import TemplatesView from "./templates";
import FinanceView from "./finance";
import WireView from "./wire";
import TeamView from "./team";
import HomeView from "./home";
import ForgeView from "./forge";
import WorkstationView from "./workstation";
import EditorView from "./editor";

export interface ViewRouterProps {
  railActive: string;
  workstations: Workstation[];
  tabs: Tab[];
  activeProject: string;
  activeWorkstationId: string | null;
  activeBlocks: Block[];
  blocksMap: Record<string, Block[]>;
  sidebarOpen: boolean;
  wordCount: number;
  charCount: number;
  overdueCount: number;
  splitProject: string | null;
  comments: Comment[];
  activities: BlockActivity[];
  docTemplates: DocumentTemplate[];
  zenMode: boolean;
  calendarScrollTarget: string | null;
  onOpenSidebar: () => void;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
  onNewTab: () => void;
  onTabRename: (id: string, name: string) => void;
  onTabReorder: (sourceId: string, targetId: string, position: "before" | "after") => void;
  onBlocksChange: (projectId: string, blocks: Block[]) => void;
  onWordCountChange: (words: number, chars: number) => void;
  onSelectProject: (project: Project, client: string) => void;
  onSelectWorkstationHome: (wsId: string) => void;
  onResumeEditor?: () => void;
  onNavigateRail: (item: string) => void;
  onSaveAsTemplate: () => void;
  onRenameWorkstation: (wsId: string, name: string) => void;
  onUpdateProjectDue: (projectId: string, due: string | null) => void;
  onCommentsChange: (comments: Comment[]) => void;
  onActivitiesChange: (activities: BlockActivity[]) => void;
  onToggleZen: () => void;
  onSplitOpen: (id: string) => void;
  onSplitClose: () => void;
  onSplitMakePrimary: () => void;
  onNewWorkstation: () => void;
  onNewTabInWorkstation: (wsId: string) => void;
  onCalendarOpenProject: (projectId: string) => void;
  onCalendarScrollComplete: () => void;
  onForgeClose: () => void;
  onForgeSave: (blocks: Block[]) => void;
}

export default function ViewRouter(props: ViewRouterProps) {
  const { railActive, activeWorkstationId, tabs } = props;
  const wrap = (child: React.ReactNode) => (
    <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex" }}>
      {child}
    </div>
  );

  switch (railActive) {
    case "workspace":
      return wrap(<WorkspaceView />);
    case "calendar":
      return wrap(<CalendarView workstations={props.workstations} onOpenProject={props.onCalendarOpenProject} scrollToProjectId={props.calendarScrollTarget} onScrollComplete={props.onCalendarScrollComplete} />);
    case "search":
      return wrap(<SearchView workstations={props.workstations} />);
    case "services":
      return wrap(<ServicesView />);
    case "pipeline":
      return wrap(<PipelineView />);
    case "templates":
      return wrap(<TemplatesView />);
    case "finance":
      return wrap(<FinanceView />);
    case "wire":
      return wrap(<WireView workstations={props.workstations} />);
    case "team":
      return wrap(<TeamView />);
    case "home":
      return wrap(<HomeView workstations={props.workstations} overdueCount={props.overdueCount} onSelectWorkstation={props.onSelectWorkstationHome} onSelectProject={props.onSelectProject} onNewTabInWorkstation={props.onNewTabInWorkstation} onNewWorkstation={props.onNewWorkstation} />);
    case "forge":
      return wrap(<ForgeView tabs={props.tabs} activeBlocks={props.activeBlocks} activeProject={props.activeProject} workstations={props.workstations} onClose={props.onForgeClose} onSave={props.onForgeSave} />);
    default:
      break;
  }

  // Non-rail-name routes: workstation home, terminal welcome, or editor
  if (activeWorkstationId && !tabs.some(t => t.active)) {
    return wrap(<WorkstationView workstations={props.workstations} activeWorkstationId={activeWorkstationId} onSelectProject={props.onSelectProject} onNewTab={props.onNewTab} onResumeEditor={props.onResumeEditor} onRenameWorkstation={props.onRenameWorkstation} onUpdateProjectDue={props.onUpdateProjectDue} />);
  }

  return (
    <EditorView
      workstations={props.workstations}
      tabs={props.tabs}
      activeProject={props.activeProject}
      activeWorkstationId={props.activeWorkstationId}
      blocks={props.activeBlocks}
      sidebarOpen={props.sidebarOpen}
      wordCount={props.wordCount}
      charCount={props.charCount}
      blocksMap={props.blocksMap}
      splitProject={props.splitProject}
      comments={props.comments}
      activities={props.activities}
      docTemplates={props.docTemplates}
      zenMode={props.zenMode}
      onOpenSidebar={props.onOpenSidebar}
      onTabClick={props.onTabClick}
      onTabClose={props.onTabClose}
      onNewTab={props.onNewTab}
      onTabRename={props.onTabRename}
      onTabReorder={props.onTabReorder}
      onBlocksChange={props.onBlocksChange}
      onWordCountChange={props.onWordCountChange}
      onSelectProject={props.onSelectProject}
      onSelectWorkstationHome={props.onSelectWorkstationHome}
      onNavigateRail={props.onNavigateRail}
      onSaveAsTemplate={props.onSaveAsTemplate}
      onRenameWorkstation={props.onRenameWorkstation}
      onUpdateProjectDue={props.onUpdateProjectDue}
      onCommentsChange={props.onCommentsChange}
      onActivitiesChange={props.onActivitiesChange}
      onToggleZen={props.onToggleZen}
      onSplitOpen={props.onSplitOpen}
      onSplitClose={props.onSplitClose}
      onSplitMakePrimary={props.onSplitMakePrimary}
    />
  );
}
