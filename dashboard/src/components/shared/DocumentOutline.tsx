"use client";

import { useMemo } from "react";
import type { Block } from "@/lib/types";
import styles from "./DocumentOutline.module.css";

interface DocumentOutlineProps {
  blocks: Block[];
  focusedBlock?: string | null;
  hoveredBlock?: string | null;
  onScrollTo: (blockId: string) => void;
  onHoverBlock?: (blockId: string | null) => void;
  compact?: boolean;
  showProgress?: boolean;
  label?: string;
}

interface Section {
  id: string;
  type: string;
  content: string;
  status: "empty" | "active" | "complete";
}

function isHeading(type: Block["type"]) {
  return type === "h1" || type === "h2" || type === "h3";
}

function getPlainTextContent(content: string) {
  return content.replace(/<[^>]*>/g, " ").replace(/[\u200B\uFEFF\xA0]/g, "").trim();
}

function hasStructuredContent(block: Block) {
  return Object.entries(block).some(([key, value]) => {
    if (key === "id" || key === "type" || key === "content" || key === "checked") return false;
    if (value == null) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") return Object.keys(value).length > 0;
    return true;
  });
}

function blockHasContent(block: Block) {
  if (getPlainTextContent(block.content) !== "") return true;
  if (block.type === "divider") return false;
  if (block.type === "todo" && block.checked) return true;
  return hasStructuredContent(block);
}

export default function DocumentOutline({ blocks, focusedBlock, hoveredBlock, onScrollTo, onHoverBlock, compact, showProgress = true, label = "Outline" }: DocumentOutlineProps) {
  // Extract headings with completion status
  const sections = useMemo(() => {
    return blocks
      .filter(b => isHeading(b.type))
      .map(b => {
        const idx = blocks.indexOf(b);
        let hasContent = false;
        let allFilled = true;
        for (let i = idx + 1; i < blocks.length; i++) {
          const next = blocks[i];
          if (isHeading(next.type)) break;
          if (next.type === "divider") continue;
          hasContent = true;
          if (!blockHasContent(next)) { allFilled = false; break; }
          if (next.type === "todo" && !next.checked) allFilled = false;
        }
        const status: Section["status"] = !hasContent ? "empty" : allFilled ? "complete" : "active";
        return { id: b.id, type: b.type, content: getPlainTextContent(b.content), status };
      });
  }, [blocks]);

  const activeSectionId = useMemo(() => {
    const activeBlockId = hoveredBlock || focusedBlock;
    if (!activeBlockId) return null;
    const idx = blocks.findIndex(block => block.id === activeBlockId);
    if (idx === -1) return null;
    for (let i = idx; i >= 0; i--) {
      if (isHeading(blocks[i].type)) return blocks[i].id;
    }
    return null;
  }, [blocks, focusedBlock, hoveredBlock]);

  // Section numbering (only H2s)
  const sectionNums = useMemo(() => {
    const map = new Map<string, number>();
    let n = 0;
    for (const s of sections) { if (s.type === "h2") { n++; map.set(s.id, n); } }
    return map;
  }, [sections]);

  const completeSections = sections.filter(s => s.status === "complete").length;
  const totalSections = sections.length;
  const progress = totalSections > 0 ? Math.round((completeSections / totalSections) * 100) : 0;

  if (sections.length === 0) {
    return (
      <div className={`${styles.outline} ${compact ? styles.compact : ""}`}>
        <div className={styles.head}>
          <span className={styles.label}>{label}</span>
        </div>
        <div className={styles.empty}>No headings yet</div>
      </div>
    );
  }

  return (
    <div className={`${styles.outline} ${compact ? styles.compact : ""}`}>
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        <span className={styles.progress}>{completeSections}/{totalSections}</span>
      </div>

      {showProgress && (
        <div className={styles.bar}>
          <div className={styles.barFill} style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className={styles.sections}>
        {sections.map((section, i) => {
          const isActive = activeSectionId === section.id;
          const isLast = i === sections.length - 1;
          const maxLen = compact ? 18 : 30;
          const name = section.content.length > maxLen ? section.content.slice(0, maxLen - 2) + "…" : (section.content || "Untitled");
          const indent = section.type === "h3" ? 2 : section.type === "h2" ? 1 : 0;
          const num = sectionNums.get(section.id);

          return (
            <div
              key={section.id}
              className={`${styles.item} ${isActive ? styles.itemOn : ""} ${styles[`indent_${indent}`]}`}
              onClick={() => onScrollTo(section.id)}
              onMouseEnter={() => onHoverBlock?.(section.id)}
              onMouseLeave={() => onHoverBlock?.(null)}
            >
              <div className={styles.dotWrap}>
                <div className={`${styles.dot} ${styles[`dot_${section.status}`]}`} />
                {!isLast && (
                  <div className={styles.connector} style={{
                    background: section.status === "complete" ? "rgba(90,154,60,0.2)" : "var(--warm-200)"
                  }} />
                )}
              </div>
              {num !== undefined && <span className={styles.num}>{num}</span>}
              <span className={`${styles.name} ${section.status === "complete" ? styles.nameDone : ""}`}>
                {name}
              </span>
              {section.status === "complete" && <span className={styles.check}>✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
