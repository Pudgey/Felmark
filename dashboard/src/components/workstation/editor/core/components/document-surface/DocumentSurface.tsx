"use client";

import type { Block, BlockType, Workstation, GraphType, MoneyBlockType } from "@/lib/types";
import { STATUS } from "@/lib/constants";
import DueDatePicker from "@/components/shared/DueDatePicker";
import SlashMenu from "../../../chrome/slash-menu/SlashMenu";
import FormatBar from "../../../chrome/format-bar/FormatBar";
import BlockRenderer from "../block-renderer/BlockRenderer";
import type { BlockActivity } from "../../../../../activity/ActivityMargin";
import styles from "./DocumentSurface.module.css";

interface DocumentSurfaceProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  blocks: Block[];
  setBlocks: (updater: Block[] | ((prev: Block[]) => Block[])) => void;
  activeProject: string;
  workstations: Workstation[];
  breathe: boolean;
  rightPanelOpen?: boolean;
  splitProject?: string | null;
  handlePageClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onUpdateProjectDue?: (projectId: string, due: string | null) => void;
  onCloseConvo: () => void;
  onCloseComment: () => void;
  // Slash menu
  slashMenu: { blockId: string; top: number; left: number } | null;
  setSlashMenu: (v: null) => void;
  slashFilter: string;
  slashIndex: number;
  selectSlashItem: (type: BlockType) => void;
  setSlashIndex: (idx: number) => void;
  // Format bar
  formatBar: { top: number; left: number } | null;
  // Block renderer
  hoverBlock: string | null;
  setHoverBlock: (id: string | null) => void;
  activeBlockId: string | null;
  freshBlockId: string | null;
  dropId: string | null;
  setDropId: (id: string | null) => void;
  dragId: string | null;
  setDragId: (id: string | null) => void;
  blockElMap: React.MutableRefObject<Record<string, HTMLDivElement>>;
  addBlockAfter: (afterId: string) => void;
  deleteBlock: (blockId: string) => void;
  onContentChange: (id: string, html: string, text: string) => void;
  onEnter: (id: string, bH: string, aH: string) => void;
  onBackspace: (id: string) => void;
  onSlash: (blockId: string, filter?: string) => void;
  handleSelect: () => void;
  registerRef: (id: string, el: HTMLDivElement) => void;
  setCatOpen: (open: boolean) => void;
  handleAiGenerate: (blockId: string, generatedBlocks: Block[]) => void;
  getNum: (bid: string) => number;
  graphPicker: { blockId: string } | null;
  setGraphPicker: (v: { blockId: string } | null) => void;
  moneyPicker: { blockId: string } | null;
  setMoneyPicker: (v: { blockId: string } | null) => void;
  editingGraphId: string | null;
  setEditingGraphId: (id: string | null) => void;
  selectGraphType: (graphType: GraphType) => void;
  selectMoneyType: (moneyType: MoneyBlockType) => void;
  commentedBlocks: Set<string>;
  setCommentedBlocks: React.Dispatch<React.SetStateAction<Set<string>>>;
  setCommentHighlight: (v: string | null) => void;
  setCommentPanelOpen: (open: boolean) => void;
  onActivitiesChange: (activities: BlockActivity[]) => void;
  activities: BlockActivity[];
}

export default function DocumentSurface({
  editorRef,
  blocks,
  setBlocks,
  activeProject,
  workstations,
  breathe,
  rightPanelOpen,
  splitProject,
  handlePageClick,
  onUpdateProjectDue,
  onCloseConvo,
  onCloseComment,
  slashMenu,
  setSlashMenu,
  slashFilter,
  slashIndex,
  selectSlashItem,
  setSlashIndex,
  formatBar,
  hoverBlock,
  setHoverBlock,
  activeBlockId,
  freshBlockId,
  dropId,
  setDropId,
  dragId,
  setDragId,
  blockElMap,
  addBlockAfter,
  deleteBlock,
  onContentChange,
  onEnter,
  onBackspace,
  onSlash,
  handleSelect,
  registerRef,
  setCatOpen,
  handleAiGenerate,
  getNum,
  graphPicker,
  setGraphPicker,
  moneyPicker,
  setMoneyPicker,
  editingGraphId,
  setEditingGraphId,
  selectGraphType,
  selectMoneyType,
  commentedBlocks,
  setCommentedBlocks,
  setCommentHighlight,
  setCommentPanelOpen,
  onActivitiesChange,
  activities,
}: DocumentSurfaceProps) {
  const activeWs = workstations.find(w => w.projects.some(p => p.id === activeProject));

  return (
    <div className={styles.editor} ref={editorRef} onMouseDown={() => { onCloseConvo(); onCloseComment(); }} style={{ flex: 1 }}>
      <div className={`${styles.page} ${breathe ? styles.pageBreathe : ""} ${breathe && rightPanelOpen ? styles.pageBreathePanel : ""} ${splitProject ? styles.pageSplit : ""}`} onClick={handlePageClick}>
        {/* Project meta bar with due date picker */}
        {activeWs && (() => {
          const project = activeWs.projects.find(p => p.id === activeProject);
          if (!project) return null;
          const st = STATUS[project.status];
          return (
            <div className={styles.metaBar}>
              <div className={styles.metaClient}>
                <span className={styles.metaAvatar} style={{ background: activeWs.avatarBg }}>{activeWs.avatar}</span>
                {activeWs.client}
              </div>
              <span className={styles.metaSep}>&middot;</span>
              <span className={styles.metaStatus} style={{ color: st.color, background: st.color + "08", borderColor: st.color + "15" }}>&bull; {st.label}</span>
              <span className={styles.metaSep}>&middot;</span>
              <DueDatePicker
                date={project.due}
                onChange={(due) => onUpdateProjectDue?.(activeProject, due)}
              />
            </div>
          );
        })()}
        <BlockRenderer
          blocks={blocks}
          setBlocks={setBlocks}
          hoverBlock={hoverBlock}
          setHoverBlock={setHoverBlock}
          activeBlockId={activeBlockId}
          freshBlockId={freshBlockId}
          dropId={dropId}
          setDropId={setDropId}
          dragId={dragId}
          setDragId={setDragId}
          blockElMap={blockElMap}
          addBlockAfter={addBlockAfter}
          deleteBlock={deleteBlock}
          onContentChange={onContentChange}
          onEnter={onEnter}
          onBackspace={onBackspace}
          onSlash={onSlash}
          setSlashMenu={setSlashMenu}
          handleSelect={handleSelect}
          registerRef={registerRef}
          setCatOpen={setCatOpen}
          handleAiGenerate={handleAiGenerate}
          getNum={getNum}
          graphPicker={graphPicker}
          setGraphPicker={setGraphPicker}
          moneyPicker={moneyPicker}
          setMoneyPicker={setMoneyPicker}
          editingGraphId={editingGraphId}
          setEditingGraphId={setEditingGraphId}
          selectGraphType={selectGraphType}
          selectMoneyType={selectMoneyType}
          commentedBlocks={commentedBlocks}
          setCommentedBlocks={setCommentedBlocks}
          setCommentHighlight={setCommentHighlight}
          setCommentPanelOpen={setCommentPanelOpen}
          onActivitiesChange={onActivitiesChange}
          activities={activities}
        />
      </div>
      {slashMenu && (
        <SlashMenu
          top={slashMenu.top}
          left={slashMenu.left}
          filter={slashFilter}
          selectedIndex={slashIndex}
          onSelect={selectSlashItem}
          onClose={() => setSlashMenu(null)}
          onIndexChange={setSlashIndex}
        />
      )}
      {formatBar && <FormatBar top={formatBar.top} left={formatBar.left} />}
    </div>
  );
}
