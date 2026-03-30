"use client";

import { useMemo, useState, useRef } from "react";
import type { Block } from "@/lib/types";
import styles from "./EditorMargin.module.css";

const BLOCK_LABELS: Record<string, string> = {
  h1: "H1", h2: "H2", h3: "H3", paragraph: "¶", todo: "☐", callout: "◆",
  divider: "—", code: "<>", bullet: "•", numbered: "1.", quote: "❝", graph: "▥", deliverable: "☰", money: "$", table: "⊞", accordion: "▸", math: "∑", gallery: "▦", swatches: "●", beforeafter: "◐", bookmark: "↗", deadline: "⚑",
};

const BLOCK_LABEL_COLORS: Record<string, string> = {
  h1: "var(--ember)", h2: "var(--ink-500)", h3: "var(--ink-400)",
  paragraph: "var(--ink-300)", todo: "#5a9a3c", callout: "var(--ember)",
  divider: "var(--warm-300)", code: "#5b7fa4", bullet: "var(--ink-400)",
  numbered: "var(--ink-400)", quote: "var(--ink-400)", graph: "#5b7fa4", deliverable: "#5b7fa4", money: "#5a9a3c", table: "var(--ink-500)", accordion: "var(--ink-500)", math: "var(--ember)", gallery: "#5b7fa4", swatches: "var(--ember)", beforeafter: "var(--ink-500)", bookmark: "#5b7fa4", deadline: "#c24b38",
};

interface EditorMarginProps {
  blocks: Block[];
  hoveredBlock: string | null;
  onHoverBlock: (id: string | null) => void;
  onScrollTo: (id: string) => void;
  onReorderBlock?: (fromIndex: number, toIndex: number) => void;
}

export default function EditorMargin({ blocks, hoveredBlock, onHoverBlock, onScrollTo, onReorderBlock }: EditorMarginProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dropIdx, setDropIdx] = useState<number | null>(null);
  const dragRef = useRef<number | null>(null);

  // Extract sections (h1 and h2 blocks)
  const sections = useMemo(() =>
    blocks.filter(b => b.type === "h1" || b.type === "h2").map(b => {
      // Section is "complete" if it's followed by content blocks that are all filled
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
      <div className={styles.gutter}>
        <div className={styles.gutterHead}>
          <span className={styles.gutterLabel}>blocks</span>
          <span className={styles.gutterCount}>{blocks.length}</span>
        </div>

        <div className={styles.gutterItems}>
          {blocks.map((block, i) => {
            const label = BLOCK_LABELS[block.type] || "?";
            const color = BLOCK_LABEL_COLORS[block.type] || "var(--ink-300)";
            const isHovered = hoveredBlock === block.id;
            const isSection = block.type === "h1" || block.type === "h2";
            const graphTitle = block.type === "graph" && block.graphData ? block.graphData.title : "";
            const delivTitle = block.type === "deliverable" && block.deliverableData ? block.deliverableData.title : "";
            const moneyLabel = block.type === "money" && block.moneyData ? block.moneyData.moneyType.replace("-", " ") : "";
            const deadlineTitle = block.type === "deadline" && block.deadlineData ? block.deadlineData.title : "";
            const displayContent = block.type === "graph" ? graphTitle : block.type === "deliverable" ? delivTitle : block.type === "money" ? moneyLabel : block.type === "deadline" ? deadlineTitle : block.content;
            const preview = displayContent
              ? (displayContent.length > 24 ? displayContent.slice(0, 22) + "…" : displayContent)
              : "";
            const isEmpty = !displayContent && block.type !== "divider" && block.type !== "graph" && block.type !== "deliverable" && block.type !== "money" && block.type !== "deadline";

            return (
              <div
                key={block.id}
                className={`${styles.gutterItem} ${isHovered ? styles.gutterItemOn : ""} ${isSection ? styles.gutterItemSection : ""} ${dropIdx === i ? styles.gutterItemDrop : ""} ${dragIdx === i ? styles.gutterItemDrag : ""}`}
                draggable={!!onReorderBlock}
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
                onClick={() => onScrollTo(block.id)}
              >
                <span className={styles.gutterLine}>{i + 1}</span>
                <span className={styles.gutterType} style={{ color }}>{label}</span>
                <span className={`${styles.gutterPreview} ${isEmpty ? styles.gutterPreviewEmpty : ""} ${block.type === "divider" ? styles.gutterPreviewDivider : ""}`}
                  style={!isEmpty && block.type !== "paragraph" && block.type !== "bullet" && block.type !== "numbered" ? { color, opacity: 0.7 } : undefined}>
                  {block.type === "divider" ? "divider" : block.type === "graph" ? (graphTitle || "chart") : block.type === "deliverable" ? (delivTitle || "deliverable") : block.type === "money" ? (moneyLabel || "money") : block.type === "deadline" ? (deadlineTitle || "deadline") : isEmpty ? "empty" : preview}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
