"use client";

import { useCallback, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { Block, Tab, Workstation } from "@/lib/types";
import type { Comment } from "@/components/comments/CommentPanel";
import type { BlockActivity } from "@/components/activity/ActivityMargin";
import DocumentOutline from "@/components/shared/DocumentOutline";
import {
  BLOCK_LABELS,
  BLOCK_LABEL_COLORS,
  buildRailData,
  formatBlockPreview,
} from "@/components/workstation/editor/chrome/margin/rail-data";
import styles from "./WorkstationSidebar.module.css";

const TERMINAL_SPLIT_ID = "__terminal__";

interface WorkstationSidebarProps {
  blocks: Block[];
  workstations: Workstation[];
  tabs: Tab[];
  activeProject: string;
  activeWorkstationId: string | null;
  comments: Comment[];
  activities: BlockActivity[];
  splitProject?: string | null;
  open: boolean;
  width: number;
  onClose: () => void;
  onSelectTab: (id: string) => void;
  onSelectWorkstationHome: (wsId: string) => void;
}

const BADGE_TONES: Record<string, CSSProperties> = {
  current: { color: "var(--ember)", background: "rgba(176, 125, 79, 0.08)", borderColor: "rgba(176, 125, 79, 0.12)" },
  ember: { color: "var(--ember)", background: "rgba(176, 125, 79, 0.08)", borderColor: "rgba(176, 125, 79, 0.12)" },
  split: { color: "#5b7fa4", background: "rgba(91, 127, 164, 0.07)", borderColor: "rgba(91, 127, 164, 0.14)" },
  info: { color: "#5b7fa4", background: "rgba(91, 127, 164, 0.07)", borderColor: "rgba(91, 127, 164, 0.14)" },
  open: { color: "#7c6b9e", background: "rgba(124, 107, 158, 0.07)", borderColor: "rgba(124, 107, 158, 0.14)" },
  purple: { color: "#7c6b9e", background: "rgba(124, 107, 158, 0.07)", borderColor: "rgba(124, 107, 158, 0.14)" },
  warning: { color: "#b07d4f", background: "rgba(176, 125, 79, 0.08)", borderColor: "rgba(176, 125, 79, 0.14)" },
  danger: { color: "#c24b38", background: "rgba(194, 75, 56, 0.07)", borderColor: "rgba(194, 75, 56, 0.14)" },
  success: { color: "#5a9a3c", background: "rgba(90, 154, 60, 0.07)", borderColor: "rgba(90, 154, 60, 0.14)" },
  teal: { color: "#4f8d8a", background: "rgba(79, 141, 138, 0.08)", borderColor: "rgba(79, 141, 138, 0.14)" },
};

function getBadgeStyle(tone: string) {
  return BADGE_TONES[tone] || { color: "var(--ink-500)", background: "rgba(247, 246, 243, 0.86)", borderColor: "var(--warm-200)" };
}

function emitBlockScroll(blockId: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("felmark:scroll-to-block", { detail: { blockId } }));
}

export default function WorkstationSidebar({
  blocks,
  workstations,
  tabs,
  activeProject,
  activeWorkstationId,
  comments,
  activities,
  splitProject,
  open,
  width,
  onClose,
  onSelectTab,
  onSelectWorkstationHome,
}: WorkstationSidebarProps) {
  const [focusedBlock, setFocusedBlock] = useState<string | null>(null);
  const rail = useMemo(() => buildRailData({
    blocks,
    workstations,
    tabs,
    activeProject,
    comments,
    activities,
    splitProject,
  }), [activities, activeProject, blocks, comments, splitProject, tabs, workstations]);

  const activeWorkstation = rail.activeWorkstation || (activeWorkstationId ? workstations.find(ws => ws.id === activeWorkstationId) || null : null);
  const activeDocumentName = rail.activeTab?.name || (activeWorkstationId ? "Workstation home" : "No active document");

  const handleScrollTo = useCallback((blockId: string) => {
    setFocusedBlock(blockId);
    emitBlockScroll(blockId);
  }, []);

  const handleDocSelect = useCallback((tabId: string, isActive: boolean) => {
    if (isActive) {
      const firstBlockId = blocks[0]?.id;
      if (firstBlockId) handleScrollTo(firstBlockId);
      return;
    }
    onSelectTab(tabId);
  }, [blocks, handleScrollTo, onSelectTab]);

  const shellStyle = { "--sidebar-w": `${width}px` } as CSSProperties;

  return (
    <aside className={`${styles.shell} ${open ? "" : styles.closed}`} style={shellStyle} aria-hidden={!open}>
      <div className={styles.inner}>
        <div className={styles.topbar}>
          <div className={styles.brand}>
            <div className={styles.kicker}>Workstation</div>
            <div className={styles.title}>{activeWorkstation?.client || "Control rail"}</div>
          </div>
          <button className={styles.iconBtn} type="button" onClick={onClose} aria-label="Close workstation rail">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <section className={styles.summaryCard}>
          <div className={styles.summaryHead}>
            <div className={styles.avatar} style={{ background: activeWorkstation?.avatarBg || "var(--ink-400)" }}>
              {activeWorkstation?.avatar || "W"}
            </div>
            <div className={styles.summaryBody}>
              <div className={styles.kicker}>Current workstation</div>
              <div className={styles.summaryName}>{activeWorkstation?.client || "Workstation"}</div>
              <div className={styles.summaryMeta}>{activeDocumentName}</div>
              <div className={styles.summarySub}>
                Outline stays primary here. Review, context, and activity support the document instead of replacing its navigation.
              </div>
            </div>
            {activeWorkstation?.id ? (
              <button
                className={styles.iconBtn}
                type="button"
                onClick={() => onSelectWorkstationHome(activeWorkstation.id)}
                aria-label="Open workstation home"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7h9M7 2.5l4.5 4.5L7 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : null}
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.kicker}>Docs</div>
              <div className={styles.statValue}>{rail.stationStats.docs}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.kicker}>Review</div>
              <div className={styles.statValue}>{rail.stationStats.reviews}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.kicker}>Signals</div>
              <div className={styles.statValue}>{rail.stationStats.signals}</div>
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelLabel}>Outline</span>
            <span className={styles.panelCount}>{blocks.length}</span>
          </div>
          <div className={styles.outlineWrap}>
            <DocumentOutline
              blocks={blocks}
              focusedBlock={focusedBlock}
              onScrollTo={handleScrollTo}
              label="outline"
            />
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelLabel}>Open stack</span>
            <span className={styles.panelCount}>{rail.openDocs.length}</span>
          </div>
          {rail.openDocs.length === 0 ? (
            <div className={styles.empty}>No open documents in this workstation yet.</div>
          ) : (
            <div className={styles.stack}>
              {rail.openDocs.map(doc => (
                <button
                  key={doc.id}
                  type="button"
                  className={`${styles.row} ${styles.rowButton} ${doc.active ? styles.rowActive : ""}`}
                  onClick={() => handleDocSelect(doc.id, doc.active)}
                >
                  <div className={styles.rowHead}>
                    <div className={styles.rowCopy}>
                      <div className={styles.rowTitle}>{doc.name}</div>
                      <div className={styles.rowMeta}>{doc.meta}</div>
                    </div>
                    <span className={styles.badge} style={getBadgeStyle(doc.badge)}>{doc.badge}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelLabel}>Review queue</span>
            <span className={styles.panelCount}>{rail.reviewItems.length}</span>
          </div>
          {rail.reviewItems.length === 0 ? (
            <div className={styles.empty}>Decision, poll, feedback, and signoff blocks will surface here.</div>
          ) : (
            <div className={styles.list}>
              {rail.reviewItems.map(item => (
                <button key={item.id} type="button" className={`${styles.row} ${styles.rowButton}`} onClick={() => handleScrollTo(item.id)}>
                  <div className={styles.rowHead}>
                    <div className={styles.rowCopy}>
                      <div className={styles.meta}>{item.type}</div>
                      <div className={styles.rowTitle}>{item.title}</div>
                      <div className={styles.rowMeta}>{item.meta}</div>
                    </div>
                    <span className={styles.badge} style={getBadgeStyle(item.tone)}>{item.badge}</span>
                  </div>
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
            <div className={styles.empty}>Add handoff, asset checklist, bookmark, or deadline blocks to build context here.</div>
          ) : (
            <div className={styles.list}>
              {rail.contextItems.map(item => (
                <button key={item.id} type="button" className={`${styles.row} ${styles.rowButton}`} onClick={() => handleScrollTo(item.id)}>
                  <div className={styles.meta}>{item.type}</div>
                  <div className={styles.rowTitle}>{item.title}</div>
                  <div className={styles.rowMeta}>{item.meta}</div>
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
            <div className={styles.empty}>No live collaboration signals on this document yet.</div>
          ) : (
            <div className={styles.list}>
              {rail.liveSignals.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.row} ${item.targetId ? styles.rowButton : ""}`}
                  onClick={item.targetId ? () => handleScrollTo(item.targetId) : undefined}
                >
                  <div className={styles.rowHead}>
                    <div className={styles.rowCopy}>
                      <div className={styles.rowTitle}>{item.title}</div>
                      <div className={styles.rowMeta}>{item.meta}</div>
                    </div>
                    <span className={styles.badge} style={getBadgeStyle(item.tone)}>Live</span>
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
            <div className={styles.terminalCommand}>/jump review-queue</div>
            <div className={styles.terminalCommand}>/insert signoff</div>
            <div className={styles.terminalText}>
              {splitProject === TERMINAL_SPLIT_ID
                ? "Terminal is open in split view right now."
                : "Terminal remains a workstation-native control surface from the top-right toolbar."}
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelLabel}>Block map</span>
            <span className={styles.panelCount}>{blocks.length}</span>
          </div>
          {blocks.length === 0 ? (
            <div className={styles.blockEmpty}>Open a document to inspect its block map.</div>
          ) : (
            <div className={styles.blockMap}>
              {blocks.map((block, index) => {
                const label = BLOCK_LABELS[block.type] || "?";
                const color = BLOCK_LABEL_COLORS[block.type] || "var(--ink-300)";
                const preview = formatBlockPreview(block, 30);
                const isSection = block.type === "h1" || block.type === "h2";
                const isActive = focusedBlock === block.id;
                const isEmpty = preview === "";
                return (
                  <button
                    key={block.id}
                    type="button"
                    className={`${styles.blockRow} ${isSection ? styles.blockRowSection : ""} ${isActive ? styles.blockRowActive : ""}`}
                    onClick={() => handleScrollTo(block.id)}
                  >
                    <span className={styles.blockIndex}>{index + 1}</span>
                    <span className={styles.blockType} style={{ color }}>{label}</span>
                    <span
                      className={`${styles.blockPreview} ${isEmpty ? styles.blockPreviewEmpty : ""}`}
                      style={!isEmpty && block.type !== "paragraph" && block.type !== "bullet" && block.type !== "numbered" ? { color, opacity: 0.72 } : undefined}
                    >
                      {isEmpty ? "empty" : preview}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}
