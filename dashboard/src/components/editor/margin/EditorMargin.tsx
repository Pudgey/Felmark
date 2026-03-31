"use client";

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import type { Block } from "@/lib/types";
import styles from "./EditorMargin.module.css";

const BLOCK_LABELS: Record<string, string> = {
  h1: "H1", h2: "H2", h3: "H3", paragraph: "¶", todo: "☐", callout: "◆",
  divider: "—", code: "<>", bullet: "•", numbered: "1.", quote: "❝", graph: "▥", deliverable: "☰", money: "$", table: "⊞", accordion: "▸", math: "∑", gallery: "▦", swatches: "●", beforeafter: "◐", bookmark: "↗", deadline: "⚑",
  audio: "♫", ai: "AI", canvas: "✎", drawing: "✐",
  "comment-thread": "💬", mention: "@", question: "?", feedback: "↺", decision: "⚖", poll: "▣", handoff: "→", signoff: "✍", annotation: "📌",
  "ai-action": "⚡",
  timeline: "⏱", flow: "◎", brandboard: "✦", moodboard: "◇", wireframe: "☐", pullquote: "❝",
  "hero-spotlight": "★", "kinetic-type": "Aa", "number-cascade": "#",
  "stat-reveal": "◎", "value-counter": "$",
  "pricing-config": "≋", "scope-boundary": "⊟", "asset-checklist": "☑",
  "decision-picker": "⇄", "availability-picker": "◇", "progress-stream": "→", "dependency-map": "⊞", "revision-heatmap": "▥",
};

const BLOCK_LABEL_COLORS: Record<string, string> = {
  h1: "var(--ember)", h2: "var(--ink-500)", h3: "var(--ink-400)",
  paragraph: "var(--ink-300)", todo: "#5a9a3c", callout: "var(--ember)",
  divider: "var(--warm-300)", code: "#5b7fa4", bullet: "var(--ink-400)",
  numbered: "var(--ink-400)", quote: "var(--ink-400)", graph: "#5b7fa4", deliverable: "#5b7fa4", money: "#5a9a3c", table: "var(--ink-500)", accordion: "var(--ink-500)", math: "var(--ember)", gallery: "#5b7fa4", swatches: "var(--ember)", beforeafter: "var(--ink-500)", bookmark: "#5b7fa4", deadline: "#c24b38",
  audio: "#8a7e63", ai: "#7864b4", canvas: "#5b7fa4", drawing: "var(--ink-500)",
  "comment-thread": "var(--ember)", mention: "var(--ember)", question: "#b89a20", feedback: "#5b7fa4", decision: "#7c8594", poll: "var(--ember)", handoff: "#5a9a3c", signoff: "#5a9a3c", annotation: "#c24b38",
  "ai-action": "#7864b4",
  timeline: "#5b7fa4", flow: "#7c6b9e", brandboard: "var(--ember)", moodboard: "#8a7e63", wireframe: "#7c8594", pullquote: "var(--ember)",
  "hero-spotlight": "var(--ember)", "kinetic-type": "var(--ink-500)", "number-cascade": "var(--ember)",
  "stat-reveal": "#5a9a3c", "value-counter": "var(--ember)",
  "pricing-config": "var(--ember)", "scope-boundary": "#7c8594", "asset-checklist": "#5a9a3c",
  "decision-picker": "var(--ember)", "availability-picker": "#5b7fa4", "progress-stream": "var(--ink-500)", "dependency-map": "#7c8594", "revision-heatmap": "var(--ember)",
};

function humanizeToken(value: string) {
  return value.replace(/-/g, " ");
}

function firstText(...values: Array<string | null | undefined>) {
  for (const value of values) {
    if (typeof value === "string" && value.trim() && value.trim() !== "[]") return value.trim();
  }
  return "";
}

function countLabel(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getBlockSummary(block: Block) {
  switch (block.type) {
    case "divider":
      return "divider";
    case "graph":
      return firstText(block.graphData?.title, block.graphData?.graphType ? `${humanizeToken(block.graphData.graphType)} chart` : "");
    case "deliverable":
      return firstText(block.deliverableData?.title, block.deliverableData?.description, "deliverable");
    case "money":
      return firstText(block.moneyData?.moneyType ? humanizeToken(block.moneyData.moneyType) : "", "money");
    case "table":
      return block.tableData?.rows?.length ? countLabel(Math.max(0, block.tableData.rows.length - 1), "row") : "table";
    case "accordion":
      return firstText(block.accordionData?.items?.[0]?.title, block.accordionData?.items?.length ? countLabel(block.accordionData.items.length, "section") : "", "accordion");
    case "math":
      return firstText(block.mathData?.formula, block.mathData?.result, "formula");
    case "gallery":
      return block.galleryData?.images?.length ? countLabel(block.galleryData.images.length, "image") : "gallery";
    case "swatches":
      return block.swatchesData?.colors?.length ? countLabel(block.swatchesData.colors.length, "color") : "swatches";
    case "beforeafter":
      return firstText(
        block.beforeAfterData?.beforeLabel && block.beforeAfterData?.afterLabel
          ? `${block.beforeAfterData.beforeLabel} → ${block.beforeAfterData.afterLabel}`
          : "",
        "before / after"
      );
    case "bookmark":
      return firstText(block.bookmarkData?.title, block.bookmarkData?.source, block.bookmarkData?.url, "bookmark");
    case "deadline":
      return firstText(block.deadlineData?.title, block.deadlineData?.assignee, "deadline");
    case "audio":
      return firstText(block.audioData?.transcript, block.audioData?.audioUrl ? "recorded audio" : "", "audio note");
    case "ai":
      return "AI generation";
    case "comment-thread":
      return firstText(block.commentThreadData?.messages?.[0]?.text, "comment thread");
    case "mention":
      return firstText(block.mentionData?.person ? `mention ${block.mentionData.person}` : "", block.mentionData?.message, "mention");
    case "question":
      return firstText(block.questionData?.question, block.questionData?.answer, "question");
    case "feedback":
      return firstText(block.feedbackData?.description, block.feedbackData?.reviewer ? `feedback from ${block.feedbackData.reviewer}` : "", "feedback");
    case "decision":
      return firstText(block.decisionData?.title, block.decisionData?.decision, "decision");
    case "poll":
      return firstText(block.pollData?.question, block.pollData?.options?.length ? countLabel(block.pollData.options.length, "option") : "", "poll");
    case "handoff":
      return firstText(block.handoffData?.notes, block.handoffData?.from && block.handoffData?.to ? `${block.handoffData.from} → ${block.handoffData.to}` : "", "handoff");
    case "signoff":
      return firstText(block.signoffData?.section, block.signoffData?.signer, "signoff");
    case "annotation":
      return firstText(block.annotationData?.pins?.[0]?.comment, block.annotationData?.pins?.length ? countLabel(block.annotationData.pins.length, "annotation") : "", "annotation");
    case "canvas":
      return firstText(
        block.canvasData?.elements?.find(element => typeof element.text === "string" && element.text.trim())?.text,
        block.canvasData?.elements?.length ? countLabel(block.canvasData.elements.length, "element") : "",
        "canvas"
      );
    case "drawing":
      return firstText(block.drawingData?.title, block.drawingData?.drawingType ? humanizeToken(block.drawingData.drawingType) : "", "drawing");
    case "ai-action":
      return firstText(block.aiActionData?.targetLabel, block.aiActionData?.output, block.aiActionData?.mode ? `${humanizeToken(block.aiActionData.mode)} action` : "", "AI action");
    case "timeline":
      return firstText(block.timelineData?.title, block.timelineData?.phases?.[0]?.label, "timeline");
    case "flow":
      return firstText(block.flowData?.title, block.flowData?.nodes?.[0]?.label, "flow");
    case "brandboard":
      return firstText(block.brandBoardData?.title, block.brandBoardData?.logoName, "brand board");
    case "moodboard":
      return firstText(block.moodBoardData?.title, block.moodBoardData?.keywords?.[0], "mood board");
    case "wireframe":
      return firstText(block.wireframeData?.title, block.wireframeData?.viewport, "wireframe");
    case "pullquote":
      return firstText(block.pullQuoteData?.text, block.pullQuoteData?.author, "pull quote");
    case "hero-spotlight":
      return firstText(block.heroSpotlightData?.name, block.heroSpotlightData?.preLine, "hero spotlight");
    case "kinetic-type":
      return firstText(block.kineticTypeData?.lines?.[0]?.text, "kinetic type");
    case "number-cascade":
      return firstText(block.numberCascadeData?.stats?.[0]?.label, "number cascade");
    case "stat-reveal":
      return firstText(block.statRevealData?.footer, block.statRevealData?.stats?.[0]?.label, "stat reveal");
    case "value-counter":
      return firstText(block.valueCounterData?.topLabel, block.valueCounterData?.bottomLine, "value counter");
    case "pricing-config":
      return block.pricingConfigData ? `${block.pricingConfigData.selected.length}/${block.pricingConfigData.options.length} selected` : "pricing config";
    case "scope-boundary":
      return firstText(block.scopeBoundaryData?.note, block.scopeBoundaryData ? `${countLabel(block.scopeBoundaryData.inScope.length, "scope item")}` : "", "scope boundary");
    case "asset-checklist":
      return block.assetChecklistData?.items?.length ? countLabel(block.assetChecklistData.items.length, "asset") : "asset checklist";
    case "decision-picker": {
      const picked = block.decisionPickerData?.options.find(option => option.id === block.decisionPickerData?.choice);
      return firstText(picked?.label, block.decisionPickerData?.options?.length ? countLabel(block.decisionPickerData.options.length, "option") : "", "decision picker");
    }
    case "availability-picker":
      return firstText(block.availabilityPickerData?.selected, block.availabilityPickerData?.days?.length ? countLabel(block.availabilityPickerData.days.length, "day") : "", "availability");
    case "progress-stream":
      return firstText(block.progressStreamData?.snapshots?.[0]?.label, block.progressStreamData?.snapshots?.length ? countLabel(block.progressStreamData.snapshots.length, "update") : "", "progress stream");
    case "dependency-map":
      return firstText(block.dependencyMapData?.nodes?.[0]?.label, block.dependencyMapData?.nodes?.length ? countLabel(block.dependencyMapData.nodes.length, "dependency") : "", "dependency map");
    case "revision-heatmap":
      return firstText(block.revisionHeatmapData?.sections?.[0]?.name, block.revisionHeatmapData?.sections?.length ? countLabel(block.revisionHeatmapData.sections.length, "section") : "", "revision heatmap");
    default:
      return firstText(block.content);
  }
}

function formatBlockPreview(block: Block, max = 24) {
  const summary = getBlockSummary(block);
  if (!summary) return "";
  return summary.length > max ? `${summary.slice(0, max - 2)}…` : summary;
}

interface EditorMarginProps {
  blocks: Block[];
  hoveredBlock: string | null;
  onHoverBlock: (id: string | null) => void;
  onScrollTo: (id: string) => void;
  onReorderBlock?: (fromIndex: number, toIndex: number) => void;
  onDeleteBlocks?: (ids: string[]) => void;
}

export default function EditorMargin({ blocks, hoveredBlock, onHoverBlock, onScrollTo, onReorderBlock, onDeleteBlocks }: EditorMarginProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dropIdx, setDropIdx] = useState<number | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; blockId: string } | null>(null);
  const lastClickIdx = useRef<number | null>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<number | null>(null);
  const blockIds = useMemo(() => new Set(blocks.map(b => b.id)), [blocks]);
  const validSelected = useMemo(() => new Set([...selected].filter(id => blockIds.has(id))), [selected, blockIds]);

  // Close context menu on outside click
  useEffect(() => {
    if (!ctxMenu) return;
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("contextmenu", close);
    return () => { window.removeEventListener("click", close); window.removeEventListener("contextmenu", close); };
  }, [ctxMenu]);

  const handleItemClick = useCallback((e: React.MouseEvent, block: Block, index: number) => {
    if (e.shiftKey && lastClickIdx.current !== null) {
      // Range select
      const start = Math.min(lastClickIdx.current, index);
      const end = Math.max(lastClickIdx.current, index);
      const rangeIds = blocks.slice(start, end + 1).map(b => b.id);
      setSelected(prev => {
        const next = new Set(prev);
        rangeIds.forEach(id => next.add(id));
        return next;
      });
    } else if (e.metaKey || e.ctrlKey) {
      // Toggle individual
      setSelected(prev => {
        const next = new Set(prev);
        if (next.has(block.id)) next.delete(block.id);
        else next.add(block.id);
        return next;
      });
      lastClickIdx.current = index;
    } else {
      // Normal click — clear selection, scroll to block
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
      setSelected(new Set(blocks.map(b => b.id)));
      return;
    }

    if (e.key === "c" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      const text = blocks
        .filter(b => validSelected.has(b.id))
        .map(b => (b.type === "divider" ? "---" : getBlockSummary(b)))
        .join("\n");
      navigator.clipboard.writeText(text);
      return;
    }
  }, [validSelected, blocks, onDeleteBlocks]);

  const handleDelete = useCallback(() => {
    if (validSelected.size > 0 && onDeleteBlocks) {
      onDeleteBlocks([...validSelected]);
      setSelected(new Set());
    }
  }, [validSelected, onDeleteBlocks]);

  const handleCopy = useCallback(() => {
    const text = blocks
      .filter(b => validSelected.has(b.id))
      .map(b => (b.type === "divider" ? "---" : getBlockSummary(b)))
      .join("\n");
    navigator.clipboard.writeText(text);
  }, [validSelected, blocks]);

  // Extract sections (h1 and h2 blocks)
  const sections = useMemo(() =>
    blocks.filter(b => b.type === "h1" || b.type === "h2").map(b => {
      const idx = blocks.indexOf(b);
      let hasContent = false;
      let allFilled = true;
      for (let i = idx + 1; i < blocks.length; i++) {
        const next = blocks[i];
        if (next.type === "h1" || next.type === "h2") break;
        if (next.type === "divider") continue;
        hasContent = true;
        if (!next.content) { allFilled = false; break; }
        if (next.type === "todo" && !next.checked) allFilled = false;
      }
      const status = !hasContent ? "empty" : allFilled ? "complete" : "active";
      return { ...b, status };
    }),
  [blocks]);

  const completeSections = sections.filter(s => s.status === "complete").length;
  const totalSections = sections.length;
  const docProgress = totalSections > 0 ? Math.round((completeSections / totalSections) * 100) : 0;

  return (
    <div className={styles.margin}>
      {/* Document Spine */}
      <div className={styles.spine}>
        <div className={styles.spineHead}>
          <span className={styles.spineLabel}>outline</span>
          <span className={styles.spineProgress}>{completeSections}/{totalSections}</span>
        </div>

        <div className={styles.spineBar}>
          <div className={styles.spineBarFill} style={{ width: `${docProgress}%` }} />
        </div>

        <div className={styles.spineSections}>
          {sections.map((section, i) => {
            const isActive = hoveredBlock === section.id;
            const isLast = i === sections.length - 1;
            const name = section.content.length > 20 ? section.content.slice(0, 18) + "…" : (section.content || "Untitled");

            return (
              <div
                key={section.id}
                className={`${styles.spineItem} ${isActive ? styles.spineItemOn : ""}`}
                onClick={() => onScrollTo(section.id)}
                onMouseEnter={() => onHoverBlock(section.id)}
                onMouseLeave={() => onHoverBlock(null)}
              >
                <div className={styles.spineDotWrap}>
                  <div className={`${styles.spineDot} ${styles[`spineDot_${section.status}`]}`} />
                  {!isLast && (
                    <div className={styles.spineConnector} style={{
                      background: section.status === "complete" ? "rgba(90,154,60,0.2)" : "var(--warm-200)"
                    }} />
                  )}
                </div>
                <span className={`${styles.spineName} ${section.status === "complete" ? styles.spineNameDone : ""}`}>
                  {name}
                </span>
                {section.status === "complete" && <span className={styles.spineCheck}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Block Gutter */}
      <div className={styles.gutter} ref={gutterRef} tabIndex={0} onKeyDown={handleKeyDown}>
        <div className={styles.gutterHead}>
          <span className={styles.gutterLabel}>blocks</span>
          <span className={styles.gutterCount}>{blocks.length}</span>
        </div>

        <div className={styles.gutterItems}>
          {blocks.map((block, i) => {
            const label = BLOCK_LABELS[block.type] || "?";
            const color = BLOCK_LABEL_COLORS[block.type] || "var(--ink-300)";
            const isHovered = hoveredBlock === block.id;
            const isSelected = validSelected.has(block.id);
            const isSection = block.type === "h1" || block.type === "h2";
            const preview = formatBlockPreview(block);
            const isEmpty = preview === "";

            return (
              <div
                key={block.id}
                className={`${styles.gutterItem} ${isHovered ? styles.gutterItemOn : ""} ${isSelected ? styles.gutterItemSelected : ""} ${isSection ? styles.gutterItemSection : ""} ${dropIdx === i ? styles.gutterItemDrop : ""} ${dragIdx === i ? styles.gutterItemDrag : ""}`}
                draggable={!!onReorderBlock && validSelected.size === 0}
                onDragStart={e => { setDragIdx(i); dragRef.current = i; e.dataTransfer.effectAllowed = "move"; }}
                onDragEnd={() => { setDragIdx(null); setDropIdx(null); dragRef.current = null; }}
                onDragOver={e => { e.preventDefault(); if (dragRef.current !== null && dragRef.current !== i) setDropIdx(i); }}
                onDragLeave={() => { if (dropIdx === i) setDropIdx(null); }}
                onDrop={e => {
                  e.preventDefault();
                  if (dragRef.current !== null && dragRef.current !== i && onReorderBlock) {
                    onReorderBlock(dragRef.current, i);
                  }
                  setDragIdx(null); setDropIdx(null); dragRef.current = null;
                }}
                onMouseEnter={() => onHoverBlock(block.id)}
                onMouseLeave={() => onHoverBlock(null)}
                onClick={(e) => handleItemClick(e, block, i)}
                onDoubleClick={(e) => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY, blockId: block.id }); }}
                onContextMenu={(e) => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY, blockId: block.id }); }}
              >
                <span className={styles.gutterLine}>{i + 1}</span>
                <span className={styles.gutterType} style={{ color }}>{label}</span>
                <span className={`${styles.gutterPreview} ${isEmpty ? styles.gutterPreviewEmpty : ""} ${block.type === "divider" ? styles.gutterPreviewDivider : ""}`}
                  style={!isEmpty && block.type !== "paragraph" && block.type !== "bullet" && block.type !== "numbered" ? { color, opacity: 0.7 } : undefined}>
                  {block.type === "divider" ? "divider" : isEmpty ? "empty" : preview}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selection toolbar */}
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

      {/* Context menu */}
      {ctxMenu && (
        <div className={styles.ctxMenu} style={{ top: ctxMenu.y, left: ctxMenu.x }}
          onClick={e => e.stopPropagation()}>
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
