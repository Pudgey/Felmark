"use client";

import type { Block, Workstation, Tab, Project, DocumentTemplate } from "@/lib/types";
import type { Comment } from "@/components/comments/CommentPanel";
import type { BlockActivity } from "@/components/activity/ActivityMargin";
import Editor from "@/components/workstation/editor/Editor";

interface EditorViewProps {
  workstations: Workstation[];
  tabs: Tab[];
  activeProject: string;
  activeWorkstationId: string | null;
  blocks: Block[];
  sidebarOpen: boolean;
  wordCount: number;
  charCount: number;
  blocksMap: Record<string, Block[]>;
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
  splitProjectName?: string;
  splitClientName?: string;
}

export default function EditorView({
  workstations, tabs, activeProject, activeWorkstationId, blocks, sidebarOpen,
  wordCount, charCount, blocksMap, splitProject, comments, activities,
  docTemplates, zenMode, onOpenSidebar, onTabClick, onTabClose, onNewTab,
  onTabRename, onTabReorder, onBlocksChange, onWordCountChange, onSelectProject,
  onSelectWorkstation, onNavigateRail, onSaveAsTemplate, onRenameWorkstation,
  onUpdateProjectDue, onCommentsChange, onActivitiesChange, onToggleZen,
  onSplitOpen, onSplitClose, onSplitMakePrimary,
  splitProjectName, splitClientName,
}: EditorViewProps) {
  return (
    <Editor
      workstations={workstations}
      tabs={tabs}
      activeProject={activeProject}
      activeWorkstationId={activeWorkstationId}
      blocks={blocks}
      sidebarOpen={sidebarOpen}
      wordCount={wordCount}
      charCount={charCount}
      onOpenSidebar={onOpenSidebar}
      onTabClick={onTabClick}
      onTabClose={onTabClose}
      onNewTab={onNewTab}
      onTabRename={onTabRename}
      onTabReorder={onTabReorder}
      onBlocksChange={onBlocksChange}
      onWordCountChange={onWordCountChange}
      onSelectProject={onSelectProject}
      onSelectWorkstation={onSelectWorkstation}
      onNavigateRail={onNavigateRail}
      onSaveAsTemplate={onSaveAsTemplate}
      docTemplates={docTemplates}
      onRenameWorkstation={onRenameWorkstation}
      onUpdateProjectDue={onUpdateProjectDue}
      comments={comments}
      onCommentsChange={onCommentsChange}
      activities={activities}
      onActivitiesChange={onActivitiesChange}
      zenMode={zenMode}
      onToggleZen={onToggleZen}
      splitProject={splitProject}
      splitBlocks={splitProject ? blocksMap[splitProject] || [] : undefined}
      splitProjectName={splitProjectName}
      splitClientName={splitClientName}
      onSplitOpen={onSplitOpen}
      onSplitClose={onSplitClose}
      onSplitMakePrimary={onSplitMakePrimary}
    />
  );
}
