"use client";

import { useCallback, useMemo } from "react";
import type { Block, GraphType, MoneyBlockType } from "@/lib/types";
import GraphBlockComponent, { GRAPH_TYPE_OPTIONS } from "../../../blocks/graphs/GraphBlock";
import GraphDataEditor from "../../../blocks/graphs/GraphDataEditor";
import graphStyles from "../../../blocks/graphs/GraphBlock.module.css";
import MoneyBlockComponent, { MONEY_TYPE_OPTIONS } from "../../../blocks/money/MoneyBlock";
import moneyStyles from "../../../blocks/money/MoneyBlock.module.css";
import DeliverableBlockComponent from "../../../blocks/deliverable/DeliverableBlock";
import DeadlineBlockComponent from "../../../blocks/deadline/DeadlineBlock";
import AudioBlockComponent from "../../../blocks/audio/AudioBlock";
import AiBlock from "../../../blocks/ai/AiBlock";
import CanvasBlock from "../../../blocks/canvas/CanvasBlock";
import EditableBlock from "../../../chrome/editable-block/EditableBlock";
import { getContentBlockMap } from "../block-registry/blockRegistry";
import type { BlockActivity } from "../../../../../activity/ActivityMargin";
import styles from "./BlockRenderer.module.css";

interface BlockRendererProps {
  blocks: Block[];
  setBlocks: (updater: Block[] | ((prev: Block[]) => Block[])) => void;
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
  setSlashMenu: (v: null) => void;
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

export default function BlockRenderer({
  blocks,
  setBlocks,
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
  setSlashMenu,
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
}: BlockRendererProps) {
  const contentBlockMap = useMemo(() => getContentBlockMap(setBlocks), [setBlocks]);

  const renderGutter = (blockId: string, extraStyle?: React.CSSProperties) => (
    <div className={styles.gutter} style={{ opacity: hoverBlock === blockId ? 1 : 0, ...extraStyle }}>
      <button className={styles.gutterBtn} onClick={() => addBlockAfter(blockId)}>
        <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
      <div className={`${styles.gutterBtn} ${styles.grip}`}>
        <svg width="10" height="14" viewBox="0 0 10 14"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="7" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="3" cy="11.5" r="1" fill="currentColor"/><circle cx="7" cy="11.5" r="1" fill="currentColor"/></svg>
      </div>
      <button className={`${styles.gutterBtn} ${styles.gutterDelete}`} onClick={() => deleteBlock(blockId)} title="Delete block">
        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
      </button>
    </div>
  );

  const renderBlock = (block: Block) => {
    // Graph block
    if (block.type === "graph" && block.graphData) {
      const isEditing = editingGraphId === block.id;
      return (
        <div key={block.id} data-block-id={block.id} className={styles.blockRow} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
          {renderGutter(block.id)}
          <div style={{ flex: 1 }}>
            <div
              onClick={() => { if (!isEditing) setEditingGraphId(block.id); }}
              style={{ cursor: isEditing ? "default" : "pointer", borderRadius: 10, outline: isEditing ? "2px solid var(--ember)" : "2px solid transparent", outlineOffset: 2, transition: "outline-color 0.12s" }}
            >
              <GraphBlockComponent graphData={block.graphData} />
            </div>
            {isEditing && (
              <GraphDataEditor
                graphData={block.graphData}
                onUpdate={(updated) => {
                  setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, graphData: updated } : b));
                }}
                onClose={() => setEditingGraphId(null)}
                onDelete={() => {
                  setEditingGraphId(null);
                  setBlocks(prev => {
                    if (prev.length <= 1) return [{ ...prev[0], type: "paragraph" as const, content: "", checked: false, graphData: undefined }];
                    return prev.filter(b => b.id !== block.id);
                  });
                }}
              />
            )}
          </div>
        </div>
      );
    }

    // Deliverable block
    if (block.type === "deliverable" && block.deliverableData) {
      return (
        <div key={block.id} data-block-id={block.id} className={styles.blockRow} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
          {renderGutter(block.id)}
          <div style={{ flex: 1 }}>
            <DeliverableBlockComponent
              data={block.deliverableData}
              onChange={(updated) => {
                setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, deliverableData: updated } : b));
              }}
              onCommentAdded={(text) => {
                const newActivity = { blockId: block.id, editedBy: "u1", editedAt: "now", comment: { user: "u1", text, time: "now" } };
                onActivitiesChange([newActivity, ...activities]);
              }}
            />
          </div>
        </div>
      );
    }

    // Content blocks (table, accordion, math, gallery, swatches, etc.)
    if (contentBlockMap[block.type]) {
      const rendered = contentBlockMap[block.type](block);
      if (rendered !== null) {
        return (
          <div key={block.id} data-block-id={block.id} className={styles.blockRow} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
            {renderGutter(block.id)}
            <div style={{ flex: 1 }}>{rendered}</div>
          </div>
        );
      }
    }

    // Graph sub-picker
    if (graphPicker && graphPicker.blockId === block.id && block.type !== "graph") {
      return (
        <div key={block.id} data-block-id={block.id} className={styles.blockRow} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
          {renderGutter(block.id)}
          <div style={{ flex: 1 }}>
            <div className={graphStyles.gb}>
              <div className={graphStyles.gbHead}>
                <span className={graphStyles.gbTitle}>Choose a chart type</span>
                <button onClick={() => setGraphPicker(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-300)", fontSize: 14 }}>&times;</button>
              </div>
              <div className={graphStyles.subPicker}>
                {GRAPH_TYPE_OPTIONS.map(opt => (
                  <button key={opt.type} className={graphStyles.subPickerItem} onClick={() => selectGraphType(opt.type)}>
                    <span className={graphStyles.subPickerIcon}>{opt.icon}</span>
                    <span className={graphStyles.subPickerLabel}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Money block
    if (block.type === "money" && block.moneyData) {
      return (
        <div key={block.id} data-block-id={block.id} className={styles.blockRow} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
          {renderGutter(block.id)}
          <div style={{ flex: 1 }}>
            <MoneyBlockComponent
              moneyData={block.moneyData}
              onUpdate={(updated) => setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, moneyData: updated } : b))}
            />
          </div>
        </div>
      );
    }

    // Money sub-picker
    if (moneyPicker && moneyPicker.blockId === block.id && block.type !== "money") {
      return (
        <div key={block.id} data-block-id={block.id} className={styles.blockRow} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
          {renderGutter(block.id)}
          <div style={{ flex: 1 }}>
            <div className={moneyStyles.mb}>
              <div className={moneyStyles.head}>
                <span className={moneyStyles.label}>Choose a money block</span>
                <button onClick={() => setMoneyPicker(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-300)", fontSize: 14 }}>&times;</button>
              </div>
              <div className={moneyStyles.subPicker}>
                {MONEY_TYPE_OPTIONS.map(opt => (
                  <button key={opt.type} className={moneyStyles.subPickerItem} onClick={() => selectMoneyType(opt.type)}>
                    <span className={moneyStyles.subPickerIcon}>{opt.icon}</span>
                    <span className={moneyStyles.subPickerLabel}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Deadline block
    if (block.type === "deadline" && block.deadlineData) {
      return (
        <div key={block.id} data-block-id={block.id} className={styles.blockRow} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
          {renderGutter(block.id)}
          <div style={{ flex: 1 }}>
            <DeadlineBlockComponent
              data={block.deadlineData}
              onUpdate={(updated) => setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, deadlineData: updated } : b))}
            />
          </div>
        </div>
      );
    }

    if (block.type === "ai") {
      return (
        <div key={block.id} data-block-id={block.id} className={styles.blockRow} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
          {renderGutter(block.id)}
          <div style={{ flex: 1 }}>
            <AiBlock blockId={block.id} onGenerate={handleAiGenerate} />
          </div>
        </div>
      );
    }

    if (block.type === "canvas" && block.canvasData) {
      return (
        <div key={block.id} data-block-id={block.id} className={styles.blockRow} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
          {renderGutter(block.id)}
          <div style={{ flex: 1 }}>
            <CanvasBlock
              data={block.canvasData}
              onUpdate={(updated) => setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, canvasData: updated } : b))}
            />
          </div>
        </div>
      );
    }

    if (block.type === "audio" && block.audioData) {
      return (
        <div key={block.id} data-block-id={block.id} className={styles.blockRow} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
          {renderGutter(block.id)}
          <div style={{ flex: 1 }}>
            <AudioBlockComponent
              data={block.audioData}
              onUpdate={(updated) => setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, audioData: updated } : b))}
            />
          </div>
        </div>
      );
    }

    if (block.type === "divider") {
      return (
        <div key={block.id} className={styles.blockRow} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
          {renderGutter(block.id)}
          <div style={{ flex: 1, padding: "6px 0" }}><div className={styles.dividerLine} /></div>
        </div>
      );
    }

    // Default: EditableBlock (text blocks)
    const isH = block.type.startsWith("h");
    const isHovered = hoverBlock === block.id;
    return (
      <div key={block.id} data-block-id={block.id} className={`${styles.blockRow} ${dropId === block.id ? styles.dropTarget : ""}`} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
        <div className={styles.gutter} style={{ opacity: isHovered ? 1 : 0, marginTop: isH ? (block.type === "h1" ? 32 : block.type === "h2" ? 24 : 18) : 2 }}>
          <button className={styles.gutterBtn} onClick={() => addBlockAfter(block.id)}>
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          <div
            className={`${styles.gutterBtn} ${styles.grip}`}
            draggable
            onDragStart={e => { setDragId(block.id); e.dataTransfer.effectAllowed = "move"; }}
            onDragEnd={() => { setDragId(null); setDropId(null); }}
          >
            <svg width="10" height="14" viewBox="0 0 10 14"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="7" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="3" cy="11.5" r="1" fill="currentColor"/><circle cx="7" cy="11.5" r="1" fill="currentColor"/></svg>
          </div>
          <button className={`${styles.gutterBtn} ${styles.gutterDelete}`} onClick={() => deleteBlock(block.id)} title="Delete block">
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Block accent line */}
        <div className={styles.blockAccent} />

        <div
          style={{ display: "flex", alignItems: "flex-start", flex: 1 }}
          onDragOver={e => { e.preventDefault(); if (dragId && dragId !== block.id) setDropId(block.id); }}
          onDrop={e => {
            e.preventDefault();
            if (!dragId || dragId === block.id) return;
            setBlocks(prev => {
              const fi = prev.findIndex(b => b.id === dragId);
              const ti = prev.findIndex(b => b.id === block.id);
              const n = [...prev];
              const [m] = n.splice(fi, 1);
              n.splice(ti, 0, m);
              return n;
            });
            setDragId(null);
            setDropId(null);
          }}
        >
          {block.type === "bullet" && <span className={styles.prefix}>&bull;</span>}
          {block.type === "numbered" && <span className={`${styles.prefix} ${styles.prefixNum}`}>{getNum(block.id)}.</span>}
          {block.type === "todo" && (
            <label className={styles.todoCheck}>
              <input type="checkbox" checked={block.checked} onChange={() => setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, checked: !b.checked } : b))} />
            </label>
          )}
          <div style={{
            flex: 1,
            ...(block.type === "callout" ? { display: "flex", gap: 8, background: "rgba(176,125,79,0.04)", borderRadius: 5, padding: "10px 14px", border: "1px solid rgba(176,125,79,0.08)" } : {}),
            ...(block.type === "quote" ? { borderLeft: "2px solid var(--warm-300)", paddingLeft: 16 } : {}),
          }}>
            {block.type === "callout" && <span style={{ fontSize: 15, flexShrink: 0, marginTop: 2, color: "var(--ember)" }}>{"\u25c6"}</span>}
            <EditableBlock
              block={block}
              onContentChange={onContentChange}
              onEnter={onEnter}
              onBackspace={onBackspace}
              onSlash={onSlash}
              onSlashClose={() => setSlashMenu(null)}
              onSelect={handleSelect}
              registerRef={registerRef}
              onCat={() => setCatOpen(true)}
            />
          </div>

          {/* Comment icon */}
          {(isHovered || commentedBlocks.has(block.id)) && (
            <button
              className={`${styles.blockCommentBtn} ${commentedBlocks.has(block.id) ? styles.blockCommentBtnActive : ""}`}
              title={commentedBlocks.has(block.id) ? "View comments" : "Add comment"}
              onClick={e => {
                e.stopPropagation();
                const el = blockElMap.current[block.id];
                const text = el?.textContent?.trim() || block.content;
                setCommentHighlight(text.slice(0, 80) + (text.length > 80 ? "\u2026" : ""));
                setCommentPanelOpen(true);
                setCommentedBlocks(prev => new Set(prev).add(block.id));
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.5 9c0 .5-.4 1-.8 1H4.5l-2.5 2V3.5c0-.5.4-1 .8-1h8.4c.4 0 .8.5.8 1V9z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /><path d="M4.5 5.5h5M4.5 7.5h3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" /></svg>
              {commentedBlocks.has(block.id) && <span className={styles.blockCommentDot} />}
            </button>
          )}
        </div>
      </div>
    );
  };

  return <>{blocks.map(renderBlock)}</>;
}
