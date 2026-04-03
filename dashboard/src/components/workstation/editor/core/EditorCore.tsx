"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type { Block, Workstation, Tab } from "@/lib/types";
import type { Project, DocumentTemplate } from "@/lib/types";
import { cursorTo } from "@/lib/utils";
import type { Comment as CommentType } from "../../../comments/CommentPanel";
import type { BlockActivity } from "../../../activity/ActivityMargin";
import type { TerminalSessionState } from "@/lib/terminal/types";

// Hooks
import { useFocusManager } from "./hooks/useFocusManager";
import { useContentCache } from "./hooks/useContentCache";
import { useUndoStack } from "./hooks/useUndoStack";
import { useBlockOperations } from "./hooks/useBlockOperations";
import { useSlashMenu } from "./hooks/useSlashMenu";
import { useTabOverflow } from "./hooks/useTabOverflow";
import { usePanelState } from "./hooks/usePanelState";
import { useEditorKeys } from "./hooks/useEditorKeys";

// Components
import TabBar from "./components/tab-bar/TabBar";
import Toolbar from "./components/toolbar/Toolbar";
import SplitPicker from "./components/toolbar/split-picker/SplitPicker";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import DocumentSurface from "./components/document-surface/DocumentSurface";
import ZenHint from "./components/zen-hint/ZenHint";

// Panels & chrome
import ShareModal from "../panels/share-modal/ShareModal";
import CatTerminal from "../panels/cat/CatTerminal";
import ConversationPanel from "../panels/conversation/ConversationPanel";
import ActivityMargin from "../../../activity/ActivityMargin";
import HistoryModal from "../../../history/HistoryModal";
import EditorMargin from "../chrome/margin/EditorMargin";
import CommandBar from "../chrome/command-bar/CommandBar";
import CommandPalette from "../chrome/command-palette/CommandPalette";
import SplitPane from "../chrome/split-pane/SplitPane";
import Terminal from "../../../terminal/Terminal";
import TerminalProvider from "../../../terminal/TerminalProvider";
import NotificationPanel from "../../../notifications/NotificationPanel";

import tabBarStyles from "./components/tab-bar/TabBar.module.css";
import styles from "./EditorCore.module.css";

const TERMINAL_SPLIT_ID = "__terminal__";

export interface EditorProps {
  workstations: Workstation[];
  tabs: Tab[];
  activeProject: string;
  blocks: Block[];
  sidebarOpen: boolean;
  wordCount: number;
  charCount: number;
  onOpenSidebar: () => void;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
  onNewTab: () => void;
  onTabRename: (id: string, name: string) => void;
  onTabReorder?: (sourceId: string, targetId: string, position: "before" | "after") => void;
  onBlocksChange: (projectId: string, blocks: Block[]) => void;
  onWordCountChange: (words: number, chars: number) => void;
  activeWorkstationId?: string | null;
  onSelectProject?: (project: Project, client: string) => void;
  onSelectWorkstation?: (wsId: string) => void;
  onSaveAsTemplate?: () => void;
  docTemplates?: DocumentTemplate[];
  onNavigateRail?: (item: string) => void;
  onRenameWorkstation?: (wsId: string, name: string) => void;
  onUpdateProjectDue?: (projectId: string, due: string | null) => void;
  comments: CommentType[];
  onCommentsChange: (comments: CommentType[]) => void;
  activities: BlockActivity[];
  onActivitiesChange: (activities: BlockActivity[]) => void;
  zenMode?: boolean;
  onToggleZen?: () => void;
  splitProject?: string | null;
  splitBlocks?: Block[];
  splitProjectName?: string;
  splitClientName?: string;
  onSplitOpen?: (projectId: string) => void;
  onSplitClose?: () => void;
  onSplitMakePrimary?: () => void;
}

export default function EditorCore(props: EditorProps) {
  const {
    workstations, tabs, activeProject, blocks: blocksProp, sidebarOpen, charCount,
    onOpenSidebar, onTabClick, onTabClose, onNewTab, onTabRename, onBlocksChange, onWordCountChange,
    activeWorkstationId, onSelectWorkstation, onNavigateRail,
    onUpdateProjectDue, comments: _comments, onCommentsChange: _onCommentsChange, activities, onActivitiesChange,
    zenMode, onToggleZen, splitProject, splitBlocks, splitProjectName, splitClientName,
    onSplitOpen, onSplitClose, onSplitMakePrimary,
  } = props;

  // Local UI state
  const [hoverBlock, setHoverBlock] = useState<string | null>(null);
  const [formatBar, setFormatBar] = useState<{ top: number; left: number } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropId, setDropId] = useState<string | null>(null);
  const [terminalSessions, setTerminalSessions] = useState<Record<string, TerminalSessionState>>({});
  const splitPickerRef = useRef<HTMLDivElement>(null);
  const manuallyRenamed = useRef<Set<string>>(new Set());

  // Hooks
  const focus = useFocusManager();
  const cache = useContentCache({ onWordCountChange, onBlocksChange, activeProject });
  const undo = useUndoStack();

  const blockOps = useBlockOperations({
    blocksProp,
    activeProject,
    contentCache: cache.contentCache,
    blockElMap: focus.blockElMap,
    restoreContentCache: cache.restoreContentCache,
    mergeCachedContent: cache.mergeCachedContent,
    commitBlocks: cache.commitBlocks,
    settleSaveState: cache.settleSaveState,
    setSaveState: cache.setSaveState,
    typingSaveTimer: cache.typingSaveTimer,
    emitWordCounts: cache.emitWordCounts,
    flushCachedContent: cache.flushCachedContent,
    focusNew: focus.focusNew,
    pushUndoAction: undo.pushUndoAction,
    setFreshBlockId: focus.setFreshBlockId,
    setUndoAction: undo.setUndoAction,
    tabs,
    onTabRename,
    manuallyRenamed,
    onBlocksChange,
    editingGraphId: null, // Will be provided by slash menu
    setEditingGraphId: () => {},
    onActivitiesChange,
    activities,
  });

  // Wrap focusNew to also set activeBlockId (in the original monolith they were combined)
  const focusNewWithActive = useCallback((id: string, retries?: number) => {
    blockOps.setActiveBlockId(id);
    focus.focusNew(id, retries);
  }, [blockOps, focus]);

  const slash = useSlashMenu({
    blockElMap: focus.blockElMap,
    contentCache: cache.contentCache,
    setBlocks: blockOps.setBlocks,
    focusNew: focusNewWithActive,
    pushUndoAction: undo.pushUndoAction,
    snapshotCurrentBlocks: blockOps.snapshotCurrentBlocks,
  });

  // Wire editingGraphId into blockOps delete logic
  // Since hooks can't be conditionally composed, we handle this at the component level
  const deleteBlock = useCallback((blockId: string) => {
    undo.pushUndoAction("Deleted block", blockOps.snapshotCurrentBlocks(), blockId);
    blockOps.setBlocks(prev => {
      if (prev.length <= 1) {
        delete cache.contentCache.current[blockId];
        const el = focus.blockElMap.current[blockId];
        if (el) { el.textContent = ""; }
        return [{ id: prev[0].id, type: "paragraph" as const, content: "", checked: false }];
      }
      const idx = prev.findIndex(b => b.id === blockId);
      const n = prev.filter(b => b.id !== blockId);
      delete cache.contentCache.current[blockId];
      const focusIdx = Math.max(0, idx - 1);
      setTimeout(() => {
        const el = focus.blockElMap.current[n[focusIdx]?.id];
        if (el) cursorTo(el, true);
      }, 20);
      return n;
    });
    if (slash.editingGraphId === blockId) slash.setEditingGraphId(null);
  }, [blockOps, cache.contentCache, focus.blockElMap, slash, undo]);

  const panels = usePanelState({ splitPickerRef });

  // Filter tabs by active client — switching workstations shows only that client's tabs
  const workstationTabs = useMemo(() => {
    if (!activeWorkstationId) return tabs;
    const ws = workstations.find(w => w.id === activeWorkstationId);
    if (!ws) return tabs;
    const projectIds = new Set(ws.projects.map(p => p.id));
    return tabs.filter(t => projectIds.has(t.id));
  }, [tabs, activeWorkstationId, workstations]);

  const tabOverflow = useTabOverflow({
    tabs: workstationTabs,
    manuallyRenamed,
    overflowPillClass: tabBarStyles.overflowPill,
    overflowDropdownClass: tabBarStyles.overflowDropdown,
  });

  useEditorKeys({
    getSelectedBlockId: focus.getSelectedBlockId,
    setCmdPalette: panels.setCmdPalette,
    cmdPaletteSourceBlockId: panels.cmdPaletteSourceBlockId,
    deleteBlock,
    blockElMap: focus.blockElMap,
  });

  // Terminal session management
  const terminalSessionKey = activeProject || TERMINAL_SPLIT_ID;
  const handleTerminalSessionChange = useCallback((session: TerminalSessionState) => {
    setTerminalSessions(prev => {
      const current = prev[terminalSessionKey];
      if (
        current &&
        current.blocks === session.blocks &&
        current.inputHistory === session.inputHistory &&
        current.dismissedInsightKeys === session.dismissedInsightKeys
      ) {
        return prev;
      }
      return { ...prev, [terminalSessionKey]: session };
    });
  }, [terminalSessionKey]);

  // Format bar
  const handleSelect = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim() || !focus.editorRef.current) {
      setFormatBar(null);
      return;
    }
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    const sr = focus.editorRef.current.getBoundingClientRect();
    setFormatBar({ top: rect.top - sr.top + focus.editorRef.current.scrollTop - 42, left: rect.left - sr.left + rect.width / 2 - 90 });
  };

  // Command palette handler
  const activeWs = workstations.find(w => w.projects.some(p => p.id === activeProject));
  const activeTab = tabs.find(t => t.active);

  const handleCommandSelect = (commandId: string) => {
    switch (commandId) {
      case "new-project":
        onNewTab();
        return true;
      case "new-proposal":
        onNavigateRail?.("templates");
        return true;
      case "new-invoice":
        onNavigateRail?.("finance");
        return true;
      case "search":
        onNavigateRail?.("search");
        return true;
      case "switch-ws":
        if (activeWs?.id && onSelectWorkstation) {
          onSelectWorkstation(activeWs.id);
          return true;
        }
        onNavigateRail?.("workstations");
        return true;
      case "recent":
        panels.setHistoryOpen(true);
        return true;
      case "export-pdf":
        if (typeof window === "undefined") return false;
        window.print();
        return true;
      case "share":
        if (!activeProject) return false;
        panels.setShareOpen(true);
        return true;
      case "duplicate": {
        const sourceId = panels.cmdPaletteSourceBlockId.current || hoverBlock;
        if (!sourceId) return false;
        return blockOps.duplicateBlockById(sourceId);
      }
      default:
        return false;
    }
  };

  const unreadTotal = 0;

  return (
    <div className={`${styles.main} ${zenMode ? styles.zenMode : ""}`}>
      {/* Tab bar */}
      {!zenMode && <div className={styles.tabbar}>
        <TabBar
          sidebarOpen={sidebarOpen}
          onOpenSidebar={onOpenSidebar}
          convoPanelOpen={panels.convoPanelOpen}
          onToggleConvo={() => panels.setConvoPanelOpen(p => !p)}
          unreadTotal={unreadTotal}
          tabZoneRef={tabOverflow.tabZoneRef}
          visibleTabs={tabOverflow.visibleTabs}
          editingTabId={tabOverflow.editingTabId}
          editingTabName={tabOverflow.editingTabName}
          setEditingTabId={tabOverflow.setEditingTabId}
          setEditingTabName={tabOverflow.setEditingTabName}
          onTabClick={onTabClick}
          onTabClose={onTabClose}
          onTabRename={onTabRename}
          onNewTab={onNewTab}
          overflowOpen={tabOverflow.overflowOpen}
          setOverflowOpen={tabOverflow.setOverflowOpen}
          manuallyRenamed={manuallyRenamed}
        >
          <Toolbar
            breathe={panels.breathe}
            setBreathe={panels.setBreathe}
            splitProject={splitProject}
            onSplitOpen={onSplitOpen}
            onSplitClose={onSplitClose}
            splitPickerOpen={panels.splitPickerOpen}
            setSplitPickerOpen={panels.setSplitPickerOpen}
            splitPickerRef={splitPickerRef}
            notifPanelOpen={panels.notifPanelOpen}
            setNotifPanelOpen={panels.setNotifPanelOpen}
            notifications={panels.notifications}
            commentPanelOpen={panels.commentPanelOpen}
            setCommentPanelOpen={panels.setCommentPanelOpen}
            historyOpen={panels.historyOpen}
            setHistoryOpen={panels.setHistoryOpen}
            shareOpen={panels.shareOpen}
            setShareOpen={panels.setShareOpen}
            splitPickerContent={
              <SplitPicker
                workstations={workstations}
                activeProject={activeProject}
                onSplitOpen={onSplitOpen}
                onClose={() => panels.setSplitPickerOpen(false)}
              />
            }
          />
        </TabBar>
      </div>}

      {/* Breadcrumb */}
      {!zenMode && <Breadcrumb
        tabs={tabs}
        activeProject={activeProject}
        workstations={workstations}
        onSelectWorkstation={onSelectWorkstation}
      />}

      {/* Editor + panels */}
      <div className={styles.editorRow}>
        <ConversationPanel open={panels.convoPanelOpen} onClose={() => panels.setConvoPanelOpen(false)} />

        <div className={styles.editorCol}>
          <div className={styles.surfaceStage}>
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              {/* Left margin */}
              {!zenMode && <EditorMargin
                blocks={blockOps.blocks}
                hoveredBlock={hoverBlock}
                onHoverBlock={setHoverBlock}
                onScrollTo={(id) => focus.scrollToBlock(id, "start")}
                onReorderBlock={(fromIdx, toIdx) => {
                  blockOps.setBlocks(prev => {
                    const n = [...prev];
                    const [moved] = n.splice(fromIdx, 1);
                    n.splice(toIdx, 0, moved);
                    return n;
                  });
                }}
                onDeleteBlocks={blockOps.deleteBlocks}
              />}

              {/* Document surface */}
              <DocumentSurface
                editorRef={focus.editorRef}
                blocks={blockOps.blocks}
                setBlocks={blockOps.setBlocks}
                activeProject={activeProject}
                workstations={workstations}
                breathe={panels.breathe}
                splitProject={splitProject}
                handlePageClick={blockOps.handlePageClick}
                onUpdateProjectDue={onUpdateProjectDue}
                onCloseConvo={() => panels.setConvoPanelOpen(false)}
                onCloseComment={() => panels.setCommentPanelOpen(false)}
                slashMenu={slash.slashMenu}
                setSlashMenu={slash.setSlashMenu as (v: null) => void}
                slashFilter={slash.slashFilter}
                slashIndex={slash.slashIndex}
                selectSlashItem={slash.selectSlashItem}
                setSlashIndex={slash.setSlashIndex}
                formatBar={formatBar}
                hoverBlock={hoverBlock}
                setHoverBlock={setHoverBlock}
                activeBlockId={blockOps.activeBlockId}
                freshBlockId={focus.freshBlockId}
                dropId={dropId}
                setDropId={setDropId}
                dragId={dragId}
                setDragId={setDragId}
                blockElMap={focus.blockElMap}
                addBlockAfter={blockOps.addBlockAfter}
                deleteBlock={deleteBlock}
                onContentChange={blockOps.onContentChange}
                onEnter={blockOps.onEnter}
                onBackspace={blockOps.onBackspace}
                onSlash={slash.onSlash}
                handleSelect={handleSelect}
                registerRef={focus.registerRef}
                setCatOpen={panels.setCatOpen}
                handleAiGenerate={blockOps.handleAiGenerate}
                getNum={blockOps.getNum}
                graphPicker={slash.graphPicker}
                setGraphPicker={slash.setGraphPicker}
                moneyPicker={slash.moneyPicker}
                setMoneyPicker={slash.setMoneyPicker}
                editingGraphId={slash.editingGraphId}
                setEditingGraphId={slash.setEditingGraphId}
                selectGraphType={slash.selectGraphType}
                selectMoneyType={slash.selectMoneyType}
                commentedBlocks={panels.commentedBlocks}
                setCommentedBlocks={panels.setCommentedBlocks}
                setCommentHighlight={panels.setCommentHighlight}
                setCommentPanelOpen={panels.setCommentPanelOpen}
                onActivitiesChange={onActivitiesChange}
                activities={activities}
              />

              {/* Split pane */}
              {splitProject === TERMINAL_SPLIT_ID && (
                <TerminalProvider
                  key={terminalSessionKey}
                  workstations={workstations}
                  activeProject={activeProject}
                  editorBlocks={blockOps.blocks}
                  sessionState={terminalSessions[terminalSessionKey]}
                  onSessionStateChange={handleTerminalSessionChange}
                >
                  <Terminal onClose={() => onSplitClose?.()} />
                </TerminalProvider>
              )}
              {splitProject && splitProject !== TERMINAL_SPLIT_ID && splitBlocks && (
                <SplitPane
                  blocks={splitBlocks}
                  projectName={splitProjectName || "Untitled"}
                  clientName={splitClientName || ""}
                  onClose={() => onSplitClose?.()}
                  onMakePrimary={() => onSplitMakePrimary?.()}
                />
              )}
            </div>
          </div>

          {/* Command bar */}
          {!activeWorkstationId && !zenMode && <CommandBar charCount={charCount} />}
        </div>

        {/* Activity margin (right) */}
        {!zenMode && <ActivityMargin
          open={panels.commentPanelOpen}
          onClose={() => { panels.setCommentPanelOpen(false); panels.setCommentHighlight(null); }}
          blocks={blockOps.blocks}
          activities={activities}
          onActivitiesChange={onActivitiesChange}
          hoveredBlock={hoverBlock}
          onHoverBlock={setHoverBlock}
          pendingHighlight={panels.commentHighlight}
          onHighlightConsumed={() => panels.setCommentHighlight(null)}
          onScrollToBlock={(blockId) => focus.scrollToBlock(blockId, "center")}
        />}

        {/* Notification panel */}
        {!zenMode && (
          <NotificationPanel
            open={panels.notifPanelOpen}
            onClose={() => panels.setNotifPanelOpen(false)}
            notifications={panels.notifications}
            onMarkAllRead={() => panels.setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            onMarkRead={(id) => panels.setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
          />
        )}
      </div>

      {/* Zen mode exit hint */}
      {zenMode && <ZenHint onToggleZen={onToggleZen} />}

      {/* Command palette */}
      {panels.cmdPalette && <CommandPalette onClose={() => panels.setCmdPalette(false)} onSelectCommand={handleCommandSelect} />}

      {/* History modal */}
      <HistoryModal open={panels.historyOpen} onClose={() => panels.setHistoryOpen(false)} />

      {/* Share modal */}
      <ShareModal
        open={panels.shareOpen}
        onClose={() => panels.setShareOpen(false)}
        projectId={activeProject}
        projectName={activeTab?.name || "Untitled"}
        clientName={activeWs?.client || ""}
        clientAvatar={activeWs?.avatar || ""}
        clientColor={activeWs?.avatarBg || "#b07d4f"}
        blocks={blockOps.blocks}
      />

      {/* Cat terminal easter egg */}
      <CatTerminal open={panels.catOpen} onClose={() => panels.setCatOpen(false)} />
    </div>
  );
}
