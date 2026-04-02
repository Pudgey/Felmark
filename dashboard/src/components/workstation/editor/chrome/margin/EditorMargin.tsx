"use client";

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import type { Block, Tab, Workstation } from "@/lib/types";
import type { Comment } from "@/components/comments/CommentPanel";
import type { BlockActivity } from "@/components/activity/ActivityMargin";
import DocumentOutline from "@/components/shared/DocumentOutline";
import {
  BLOCK_LABELS,
  BLOCK_LABEL_COLORS,
  buildRailData,
  formatBlockPreview,
  getBlockSummary,
} from "./rail-data";
import styles from "./EditorMargin.module.css";

const TERMINAL_SPLIT_ID = "__terminal__";

interface EditorMarginProps {
  blocks: Block[];
  workstations: Workstation[];
  tabs: Tab[];
  activeProject: string;
  comments: Comment[];
  activities: BlockActivity[];
  splitProject?: string | null;
  hoveredBlock: string | null;
  onHoverBlock: (id: string | null) => void;
  onScrollTo: (id: string) => void;
  onSelectTab: (id: string) => void;
  onReorderBlock?: (fromIndex: number, toIndex: number) => void;
  onDeleteBlocks?: (ids: string[]) => void;
}

export default function EditorMargin({
  blocks,
  workstations,
  tabs,
  activeProject,
  comments,
  activities,
  splitProject,
  hoveredBlock,
  onHoverBlock,
  onScrollTo,
  onSelectTab,
  onReorderBlock,
  onDeleteBlocks,
}: EditorMarginProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dropIdx, setDropIdx] = useState<number | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; blockId: string } | null>(null);
  const lastClickIdx = useRef<number | null>(null);
  const dragRef = useRef<number | null>(null);
  const blockIds = useMemo(() => new Set(blocks.map(block => block.id)), [blocks]);
  const validSelected = useMemo(() => new Set([...selected].filter(id => blockIds.has(id))), [selected, blockIds]);
  const rail = useMemo(() => {
    return buildRailData({
      blocks,
      workstations,
      tabs,
      activeProject,
      comments,
      activities,
      splitProject,
    });
  }, [blocks, workstations, tabs, activeProject, comments, activities, splitProject]);

  useEffect(() => {
    if (!ctxMenu) return;
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("contextmenu", close);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("contextmenu", close);
    };
  }, [ctxMenu]);

  const handleItemClick = useCallback((e: React.MouseEvent, block: Block, index: number) => {
    if (e.shiftKey && lastClickIdx.current !== null) {
      const start = Math.min(lastClickIdx.current, index);
      const end = Math.max(lastClickIdx.current, index);
      const rangeIds = blocks.slice(start, end + 1).map(item => item.id);
      setSelected(prev => {
        const next = new Set(prev);
        rangeIds.forEach(id => next.add(id));
        return next;
      });
    } else if (e.metaKey || e.ctrlKey) {
      setSelected(prev => {
        const next = new Set(prev);
        if (next.has(block.id)) next.delete(block.id);
        else next.add(block.id);
        return next;
      });
      lastClickIdx.current = index;
    } else {
      setSelected(new Set());
      lastClickIdx.current = index;
      onScrollTo(block.id);
    }
  }, [blocks, onScrollTo]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (validSelected.size === 0) return;

    if (e.key === "Escape") {
      setSelected(new Set());
      return;
    }

    if ((e.key === "Delete" || e.key === "Backspace") && onDeleteBlocks) {
      e.preventDefault();
      onDeleteBlocks([...validSelected]);
      setSelected(new Set());
      return;
    }

    if (e.key === "a" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setSelected(new Set(blocks.map(block => block.id)));
      return;
    }

    if (e.key === "c" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      const text = blocks
        .filter(block => validSelected.has(block.id))
        .map(block => (block.type === "divider" ? "---" : getBlockSummary(block)))
        .join("\n");
      navigator.clipboard.writeText(text);
    }
  }, [blocks, onDeleteBlocks, validSelected]);

  const handleDelete = useCallback(() => {
    if (validSelected.size > 0 && onDeleteBlocks) {
      onDeleteBlocks([...validSelected]);
      setSelected(new Set());
    }
  }, [onDeleteBlocks, validSelected]);

  const handleCopy = useCallback(() => {
    const text = blocks
      .filter(block => validSelected.has(block.id))
      .map(block => (block.type === "divider" ? "---" : getBlockSummary(block)))
      .join("\n");
    navigator.clipboard.writeText(text);
  }, [blocks, validSelected]);

  return (
    <div className={styles.margin}>
      <div className={styles.scroll}>
        <div className={styles.stationCard}>
          <div className={styles.stationHead}>
            <div className={styles.stationAvatar} style={{ background: rail.activeWorkstation?.avatarBg || "var(--ink-400)" }}>
              {rail.activeWorkstation?.avatar || "W"}
            </div>
            <div className={styles.stationCopy}>
              <div className={styles.kicker}>Current workstation</div>
              <div className={styles.stationName}>{rail.activeWorkstation?.client || rail.activeTab?.client || "Workstation"}</div>
              <div className={styles.stationMeta}>
                {(rail.activeTab?.name || "Untitled")} is the active document inside a workstation-native control rail.
              </div>
            </div>
          </div>

          <div className={styles.stationStats}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Docs</div>
              <div className={styles.statValue}>{rail.stationStats.docs}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Review</div>
              <div className={styles.statValue}>{rail.stationStats.reviews}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Signals</div>
              <div className={styles.statValue}>{rail.stationStats.signals}</div>
            </div>
          </div>
        </div>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelLabel}>Open stack</span>
            <span className={styles.panelCount}>{tabs.length}</span>
          </div>
          <div className={styles.stack}>
            {rail.openDocs.map(doc => (
              <button
                key={doc.id}
                type="button"
                className={`${styles.stackItem} ${doc.active ? styles.stackItemActive : ""}`}
                onClick={() => {
                  if (doc.active) {
                    const firstBlockId = blocks[0]?.id;
                    if (firstBlockId) onScrollTo(firstBlockId);
                    return;
                  }
                  onSelectTab(doc.id);
                }}
              >
                <div className={styles.stackItemHead}>
                  <div className={styles.stackItemCopy}>
                    <div className={styles.stackItemTitle}>{doc.name}</div>
                    <div className={styles.stackItemMeta}>{doc.meta}</div>
                  </div>
                  <span className={`${styles.badge} ${styles[`badge_${doc.badge}`]}`}>{doc.badge}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelLabel}>Review queue</span>
            <span className={styles.panelCount}>{rail.reviewItems.length}</span>
          </div>
          {rail.reviewItems.length === 0 ? (
            <div className={styles.emptyState}>No live review blocks yet. Decision, poll, feedback, and signoff blocks will surface here.</div>
          ) : (
            <div className={styles.signalList}>
              {rail.reviewItems.map(item => (
                <button key={item.id} type="button" className={`${styles.signalItem} ${styles.signalClickable}`} onClick={() => onScrollTo(item.id)}>
                  <div className={styles.signalHead}>
                    <div className={styles.signalCopy}>
                      <div className={styles.signalTitle}>{item.title}</div>
                      <div className={styles.signalMeta}>{item.meta}</div>
                    </div>
                    <span className={`${styles.badge} ${styles[`badge_${item.tone}`]}`}>{item.badge}</span>
                  </div>
                  <div className={styles.signalType}>{item.type}</div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelLabel}>Shared context</span>
            <span className={styles.panelCount}>{rail.contextItems.length}</span>
          </div>
          {rail.contextItems.length === 0 ? (
            <div className={styles.emptyState}>Add handoff, asset checklist, deadline, or bookmark blocks to build shared context into the workstation.</div>
          ) : (
            <div className={styles.signalList}>
              {rail.contextItems.map(item => (
                <button key={item.id} type="button" className={`${styles.signalItem} ${styles.signalClickable}`} onClick={() => onScrollTo(item.id)}>
                  <div className={styles.signalType}>{item.type}</div>
                  <div className={styles.signalTitle}>{item.title}</div>
                  <div className={styles.signalMeta}>{item.meta}</div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelLabel}>Live signals</span>
            <span className={styles.panelCount}>{rail.liveSignals.length}</span>
          </div>
          {rail.liveSignals.length === 0 ? (
            <div className={styles.emptyState}>No live collaboration signals on this document yet.</div>
          ) : (
            <div className={styles.signalList}>
              {rail.liveSignals.map(signal => (
                <button
                  key={signal.id}
                  type="button"
                  disabled={!signal.targetId}
                  className={`${styles.signalItem} ${signal.targetId ? styles.signalClickable : styles.signalStatic}`}
                  onClick={() => signal.targetId && onScrollTo(signal.targetId)}
                >
                  <div className={styles.signalHead}>
                    <div className={styles.signalCopy}>
                      <div className={styles.signalTitle}>{signal.title}</div>
                      <div className={styles.signalMeta}>{signal.meta}</div>
                    </div>
                    <span className={`${styles.badge} ${styles[`badge_${signal.tone}`]}`}>Live</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelLabel}>Terminal</span>
            <span className={styles.panelCount}>{splitProject === TERMINAL_SPLIT_ID ? "split" : "ready"}</span>
          </div>
          <div className={styles.terminalCard}>
            <div className={styles.terminalLine}>/jump review-queue</div>
            <div className={styles.terminalLine}>/insert signoff</div>
            <div className={styles.terminalMeta}>
              {splitProject === TERMINAL_SPLIT_ID
                ? "Terminal is open in split view right now."
                : "Terminal stays workstation-native and can open from the top-right toolbar."}
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelLabel}>Document spine</span>
          </div>
          <div className={styles.spine}>
            <DocumentOutline
              blocks={blocks}
              hoveredBlock={hoveredBlock}
              onScrollTo={onScrollTo}
              onHoverBlock={onHoverBlock}
              compact
              label="outline"
            />
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.gutter} tabIndex={0} onKeyDown={handleKeyDown}>
            <div className={styles.gutterHead}>
              <span className={styles.gutterLabel}>Block map</span>
              <span className={styles.gutterCount}>{blocks.length}</span>
            </div>
            <div className={styles.gutterItems}>
              {blocks.map((block, index) => {
                const label = BLOCK_LABELS[block.type] || "?";
                const color = BLOCK_LABEL_COLORS[block.type] || "var(--ink-300)";
                const isHovered = hoveredBlock === block.id;
                const isSelected = validSelected.has(block.id);
                const isSection = block.type === "h1" || block.type === "h2";
                const preview = formatBlockPreview(block, 26);
                const isEmpty = preview === "";

                return (
                  <div
                    key={block.id}
                    className={`${styles.gutterItem} ${isHovered ? styles.gutterItemOn : ""} ${isSelected ? styles.gutterItemSelected : ""} ${isSection ? styles.gutterItemSection : ""} ${dropIdx === index ? styles.gutterItemDrop : ""} ${dragIdx === index ? styles.gutterItemDrag : ""}`}
                    draggable={!!onReorderBlock && validSelected.size === 0}
                    onDragStart={e => { setDragIdx(index); dragRef.current = index; e.dataTransfer.effectAllowed = "move"; }}
                    onDragEnd={() => { setDragIdx(null); setDropIdx(null); dragRef.current = null; }}
                    onDragOver={e => { e.preventDefault(); if (dragRef.current !== null && dragRef.current !== index) setDropIdx(index); }}
                    onDragLeave={() => { if (dropIdx === index) setDropIdx(null); }}
                    onDrop={e => {
                      e.preventDefault();
                      if (dragRef.current !== null && dragRef.current !== index && onReorderBlock) {
                        onReorderBlock(dragRef.current, index);
                      }
                      setDragIdx(null);
                      setDropIdx(null);
                      dragRef.current = null;
                    }}
                    onMouseEnter={() => onHoverBlock(block.id)}
                    onMouseLeave={() => onHoverBlock(null)}
                    onClick={e => handleItemClick(e, block, index)}
                    onDoubleClick={e => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY, blockId: block.id }); }}
                    onContextMenu={e => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY, blockId: block.id }); }}
                  >
                    <span className={styles.gutterLine}>{index + 1}</span>
                    <span className={styles.gutterType} style={{ color }}>{label}</span>
                    <span
                      className={`${styles.gutterPreview} ${isEmpty ? styles.gutterPreviewEmpty : ""} ${block.type === "divider" ? styles.gutterPreviewDivider : ""}`}
                      style={!isEmpty && block.type !== "paragraph" && block.type !== "bullet" && block.type !== "numbered" ? { color, opacity: 0.72 } : undefined}
                    >
                      {block.type === "divider" ? "divider" : isEmpty ? "empty" : preview}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {validSelected.size > 0 && (
        <div className={styles.selectionBar}>
          <span className={styles.selectionCount}>{validSelected.size} selected</span>
          <button className={styles.selectionBtn} title="Copy (⌘C)" onClick={handleCopy}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M10 4V3a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 3v5.5A1.5 1.5 0 003 10h1" stroke="currentColor" strokeWidth="1.2"/></svg>
          </button>
          {onDeleteBlocks && (
            <button className={`${styles.selectionBtn} ${styles.selectionBtnDanger}`} title="Delete (⌫)" onClick={handleDelete}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5.5 4V3a1 1 0 011-1h1a1 1 0 011 1v1M5.5 6.5v3.5M8.5 6.5v3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M3.5 4l.5 7.5a1 1 0 001 1h4a1 1 0 001-1L10.5 4" stroke="currentColor" strokeWidth="1.2"/></svg>
            </button>
          )}
          <button className={styles.selectionBtn} title="Clear selection (Esc)" onClick={() => setSelected(new Set())}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </button>
        </div>
      )}

      {ctxMenu && (
        <div className={styles.ctxMenu} style={{ top: ctxMenu.y, left: ctxMenu.x }} onClick={e => e.stopPropagation()}>
          <button className={styles.ctxItem} onClick={() => { onScrollTo(ctxMenu.blockId); setCtxMenu(null); }}>
            Go to block
          </button>
          {onDeleteBlocks && (
            <button className={styles.ctxItemDanger} onClick={() => { onDeleteBlocks([ctxMenu.blockId]); setCtxMenu(null); }}>
              Delete block
            </button>
          )}
        </div>
      )}
    </div>
  );
}
