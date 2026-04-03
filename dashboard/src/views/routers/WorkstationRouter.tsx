"use client";

import type { Block, Workstation, Tab, Project, DocumentTemplate } from "@/lib/types";
import type { Comment } from "@/components/comments/CommentPanel";
import type { BlockActivity } from "@/components/activity/ActivityMargin";
import EditorView from "../editor";
import ForgeView from "../forge";

export interface WorkstationRouterProps {
  workstations: Workstation[];
  tabs: Tab[];
  activeProject: string;
  activeWorkstationId: string | null;
  activeBlocks: Block[];
  blocksMap: Record<string, Block[]>;
  sidebarOpen: boolean;
  wordCount: number;
  charCount: number;
  splitProject: string | null;
  comments: Comment[];
  activities: BlockActivity[];
  docTemplates: DocumentTemplate[];
  zenMode: boolean;
  onOpenSidebar: () => void;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
  onNewTab: () => void;
  onTabRename: (id: string, name: string) => void;
  onTabReorder: (sourceId: string, targetId: string, position: "before" | "after") => void;
  onBlocksChange: (projectId: string, blocks: Block[]) => void;
  onWordCountChange: (words: number, chars: number) => void;
  onSelectProject: (project: Project, client: string) => void;
  onSelectWorkstation: (wsId: string) => void;
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
  onForgeClose: () => void;
  onForgeSave: (blocks: Block[]) => void;
  splitProjectName?: string;
  splitClientName?: string;
}

export default function WorkstationRouter({ railActive, ...props }: WorkstationRouterProps & { railActive: string }) {
  const wrap = (child: React.ReactNode) => (
    <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex" }}>
      {child}
    </div>
  );

  if (railActive === "forge") {
    return wrap(
      <ForgeView
        tabs={props.tabs}
        activeBlocks={props.activeBlocks}
        activeProject={props.activeProject}
        workstations={props.workstations}
        onClose={props.onForgeClose}
        onSave={props.onForgeSave}
      />
    );
  }

  // Default: editor view
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
      onSelectWorkstation={props.onSelectWorkstation}
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
      splitProjectName={props.splitProjectName}
      splitClientName={props.splitClientName}
    />
  );
}
