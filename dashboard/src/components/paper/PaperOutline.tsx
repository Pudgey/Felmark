"use client";

import { useState, useMemo } from "react";
import type { Block } from "@/lib/types";
import styles from "./PaperOutline.module.css";

interface PaperOutlineProps {
  blocks: Block[];
  focusedBlock: string | null;
  hoveredBlock?: string | null;
  onScrollTo: (blockId: string) => void;
  onHoverSection?: (sectionId: string | null) => void;
  clientName: string;
}

const SECTION_STATUS = {
  complete: { label: "Complete", color: "#5a9a3c", icon: "✓" },
  draft: { label: "Draft", color: "#d97706", icon: "✎" },
  empty: { label: "Empty", color: "#c24b38", icon: "○" },
  review: { label: "Review", color: "#5b7fa4", icon: "◎" },
  locked: { label: "Locked", color: "#7d7a72", icon: "◆" },
};

type SectionStatus = keyof typeof SECTION_STATUS;

interface Section {
  id: string;
  label: string;
  status: SectionStatus;
  icon: string;
  children: ChildSection[];
  words: number;
  target: number;
  locked?: boolean;
  meta?: string;
  suggestion?: string;
}

interface ChildSection {
  id: string;
  label: string;
  status: SectionStatus;
  words: number;
  meta?: string;
}

function getPlainText(html: string): string {
  if (typeof document !== "undefined") {
    const el = document.createElement("div");
    el.innerHTML = html;
    return (el.textContent || "").replace(/[\u200B\uFEFF\xA0]/g, "").trim();
  }
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/[\u200B\uFEFF\xA0]/g, "").trim();
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function truncateLabel(text: string, max = 38): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function buildChildSection(block: Block, text: string, words: number): ChildSection | null {
  const trimmed = text.trim();
  const excerpt = trimmed ? truncateLabel(trimmed) : "";

  switch (block.type) {
    case "h3":
      return { id: block.id, label: excerpt || "Untitled", status: words > 0 ? "complete" : "empty", words };
    case "deliverable":
      if (!block.deliverableData) return null;
      return {
        id: block.id,
        label: block.deliverableData.title,
        status: block.deliverableData.status === "approved" ? "complete" : "draft",
        words: 0,
        meta: block.deliverableData.dueDate,
      };
    case "table":
      if (!block.tableData) return null;
      return {
        id: block.id,
        label: "Table",
        status: block.tableData.rows.length > 1 ? "complete" : "draft",
        words: 0,
        meta: `${block.tableData.rows.length} rows`,
      };
    case "signoff": {
      const parties = block.signoffData?.parties || [];
      const signedCount = parties.filter(p => p.signed).length;
      return {
        id: block.id,
        label: "Signature",
        status: parties.length > 0 && signedCount === parties.length ? "complete" : "draft",
        words: 0,
        meta: parties.length > 0 ? `${signedCount}/${parties.length} signed` : undefined,
      };
    }
    case "ai":
      return {
        id: block.id,
        label: "AI generation",
        status: "draft",
        words: 0,
        meta: "Prompt and insert blocks",
      };
    case "paragraph":
      return trimmed ? { id: block.id, label: excerpt, status: "complete", words } : null;
    case "bullet":
      return { id: block.id, label: excerpt || "Bullet item", status: trimmed ? "complete" : "draft", words };
    case "numbered":
      return { id: block.id, label: excerpt || "Numbered item", status: trimmed ? "complete" : "draft", words };
    case "todo":
      return { id: block.id, label: excerpt || "To-do item", status: trimmed ? "draft" : "empty", words };
    case "quote":
      return { id: block.id, label: excerpt || "Quote", status: trimmed ? "complete" : "draft", words };
    case "callout":
      return { id: block.id, label: excerpt || "Callout", status: trimmed ? "complete" : "draft", words };
    case "code":
      return { id: block.id, label: excerpt || "Code block", status: trimmed ? "complete" : "draft", words };
    case "divider":
      return block.content ? { id: block.id, label: truncateLabel(getPlainText(block.content) || "Divider"), status: "draft", words: 0 } : null;
    default:
      return trimmed ? { id: block.id, label: excerpt, status: "complete", words } : null;
  }
}

// ── Build sections from blocks ──
function buildSections(blocks: Block[]): Section[] {
  const sections: Section[] = [];

  // Auto header
  sections.push({ id: "__header", label: "Document Header", status: "locked", icon: "◆", children: [], words: 0, target: 0, locked: true, meta: "Auto-generated · Client, date, ID" });

  let currentSection: Section | null = null;

  for (const block of blocks) {
    if (block.type === "h1" || block.type === "h2") {
      // Flush previous section
      if (currentSection) sections.push(currentSection);

      const text = getPlainText(block.content);
      const icon = block.type === "h1" ? "◆" : "☐";
      currentSection = { id: block.id, label: text || "Untitled", status: "empty", icon, children: [], words: 0, target: 150 };
      continue;
    }

    const text = getPlainText(block.content);
    const words = countWords(text);

    if (!currentSection) {
      // Blocks before first heading — create an intro section
      currentSection = {
        id: block.id,
        label: text ? truncateLabel(text, 24) : "Introduction",
        status: "empty",
        icon: "¶",
        children: [],
        words: 0,
        target: 120,
      };
    }

    currentSection.words += words;
    const child = buildChildSection(block, text, words);
    if (child) currentSection.children.push(child);
  }

  // Flush last section
  if (currentSection) sections.push(currentSection);

  // Auto footer
  sections.push({ id: "__footer", label: "Document Footer", status: "locked", icon: "◆", children: [], words: 0, target: 0, locked: true, meta: "⚒ @felmark/forge" });

  // Calculate section statuses
  for (const sec of sections) {
    if (sec.locked) continue;
    if (sec.words === 0 && sec.children.length === 0) {
      sec.status = "empty";
    } else if (sec.children.some(c => c.status === "review")) {
      sec.status = "review";
    } else if (sec.words >= sec.target * 0.8 && sec.children.every(c => c.status === "complete" || c.status === "draft")) {
      sec.status = "complete";
    } else {
      sec.status = "draft";
    }
  }

  return sections;
}

// ── Health Ring ──
function HealthRing({ pct, size = 40 }: { pct: number; size?: number }) {
  const r = (size - 5) / 2, circ = 2 * Math.PI * r;
  const color = pct >= 80 ? "#5a9a3c" : pct >= 50 ? "#d97706" : "#c24b38";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--warm-200)" strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dashoffset .6s cubic-bezier(0.34,1.56,0.64,1)" }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: 10, fontWeight: 600, fill: color, fontFamily: "var(--mono)" }}>
        {pct}%
      </text>
    </svg>
  );
}

// ── Word progress bar ──
function WordBar({ count, target, color }: { count: number; target: number; color: string }) {
  const pct = Math.min(100, target > 0 ? (count / target) * 100 : 0);
  return (
    <div className={styles.wordBar}>
      <div className={styles.wordBarFill} style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function PaperOutline({ blocks, focusedBlock, hoveredBlock, onScrollTo, onHoverSection, clientName }: PaperOutlineProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [showAI, setShowAI] = useState(true);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const sections = useMemo(() => buildSections(blocks), [blocks]);

  const totalWords = sections.reduce((s, sec) => s + sec.words, 0);
  const completeSections = sections.filter(s => s.status === "complete" || s.status === "locked").length;
  const totalSections = sections.length;
  const healthPct = Math.round((completeSections / totalSections) * 100);
  const missingSections = sections.filter(s => s.status === "empty" && !s.locked);

  // Find which section the focused block belongs to
  const activeSectionId = useMemo(() => {
    const targetId = hoveredBlock || focusedBlock;
    if (!targetId) return null;
    // Check if target block IS a section
    const direct = sections.find(s => s.id === targetId);
    if (direct) return direct.id;
    // Check children
    for (const sec of sections) {
      if (sec.children.some(c => c.id === targetId)) return sec.id;
    }
    // Find by block position — walk backwards to nearest heading
    const idx = blocks.findIndex(b => b.id === targetId);
    if (idx === -1) return null;
    for (let i = idx; i >= 0; i--) {
      if (blocks[i].type === "h1" || blocks[i].type === "h2") {
        return blocks[i].id;
      }
    }
    return sections[1]?.id || null;
  }, [focusedBlock, hoveredBlock, blocks, sections]);

  const toggleCollapse = (id: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.head}>
        <div className={styles.headTop}>
          <div className={styles.headTitle}>
            <span className={styles.headTitleIcon}>◆</span>
            Outline
          </div>
          <div className={styles.headActions}>
            <button className={`${styles.headBtn} ${showAI ? styles.headBtnOn : ""}`} onClick={() => setShowAI(!showAI)} title="AI suggestions">✦</button>
            <button className={styles.headBtn} onClick={() => setCollapsed(new Set(sections.map(s => s.id)))} title="Collapse all">⊟</button>
            <button className={styles.headBtn} onClick={() => setCollapsed(new Set())} title="Expand all">⊞</button>
          </div>
        </div>

        <div className={styles.docInfo}>
          <div className={styles.docRing}><HealthRing pct={healthPct} /></div>
          <div className={styles.docMeta}>
            <div className={styles.docType}>
              <span className={styles.docTypeBadge}>◆ Proposal</span>
              <span>·</span>
              <span>{clientName}</span>
            </div>
            <div className={styles.docStats}>
              <span>{totalWords} words</span>
              <span>·</span>
              <span>{completeSections}/{totalSections} sections</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className={styles.sections}>
        {sections.map(sec => {
          const st = SECTION_STATUS[sec.status];
          const isActive = activeSectionId === sec.id;
          const isCollapsed = collapsed.has(sec.id);
          const hasChildren = sec.children.length > 0;
          const isHovered = hoveredSection === sec.id;

          return (
            <div key={sec.id} className={styles.sec}>
              <div
                className={`${styles.secRow} ${isActive ? styles.secRowActive : ""} ${sec.locked ? styles.secRowLocked : ""}`}
                onClick={() => !sec.locked && onScrollTo(sec.id)}
                onMouseEnter={() => { setHoveredSection(sec.id); onHoverSection?.(sec.id); }}
                onMouseLeave={() => { setHoveredSection(null); onHoverSection?.(null); }}
              >
                {!sec.locked ? (
                  <div className={styles.secDrag}><div className={styles.secDragDot} /><div className={styles.secDragDot} /><div className={styles.secDragDot} /><div className={styles.secDragDot} /></div>
                ) : <div style={{ width: 10 }} />}

                {hasChildren ? (
                  <div className={`${styles.secArrow} ${!isCollapsed ? styles.secArrowOpen : ""}`}
                    onClick={e => { e.stopPropagation(); toggleCollapse(sec.id); }}>▸</div>
                ) : <div style={{ width: 12 }} />}

                <div className={`${styles.secStatus} ${styles[`st_${sec.status}`]}`}>{st.icon}</div>

                <div className={styles.secInfo}>
                  <div className={styles.secLabel}>{sec.label}</div>
                  {sec.meta && <div className={styles.secMeta}>{sec.meta}</div>}
                  {!sec.locked && sec.target > 0 && <WordBar count={sec.words} target={sec.target} color={st.color} />}
                </div>

                {isHovered && !sec.locked && (
                  <div className={styles.tip}>
                    {sec.words > 0 ? `${sec.words}/${sec.target} words` : st.label}
                  </div>
                )}
              </div>

              {hasChildren && !isCollapsed && (
                <div className={styles.children}>
                  {sec.children.map(child => {
                    return (
                      <div key={child.id} className={`${styles.child} ${focusedBlock === child.id ? styles.childActive : ""}`}
                        onClick={() => onScrollTo(child.id)}>
                        <div className={`${styles.childDot} ${styles[`cd_${child.status}`]}`} />
                        <span className={styles.childLabel}>{child.label}</span>
                        {child.meta && <span className={styles.childMeta}>{child.meta}</span>}
                        {child.words > 0 && <span className={styles.childWords}>{child.words}w</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI suggestions */}
      {showAI && missingSections.length > 0 && (
        <div className={styles.ai}>
          <div className={styles.aiHead}>
            <span className={styles.aiBadge}>AI</span>
            <span className={styles.aiTitle}>Missing sections</span>
          </div>
          {missingSections.map(sec => (
            <div key={sec.id} className={styles.aiItem} onClick={() => onScrollTo(sec.id)}>
              <div className={styles.aiItemDot} />
              <div className={styles.aiItemText}>
                <strong>{sec.label}</strong> is empty
              </div>
              <span className={styles.aiItemAction}>Fix →</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className={styles.foot}>
        <div className={styles.footLeft}>
          <span className={styles.footDot} />
          <span>Editing</span>
        </div>
        <span className={styles.footRight}>{totalWords}w · {totalSections} sec</span>
      </div>
    </div>
  );
}
