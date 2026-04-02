"use client";

import { useState, useEffect } from "react";
import { useFocusTrap } from "../shared/useFocusTrap";
import styles from "./HistoryModal.module.css";

interface Change {
  file: string;
  type: "added" | "modified" | "deleted";
  hunks: { context: string; lines: { type: "unchanged" | "addition" | "deletion"; text: string }[] }[];
}

interface Revision {
  id: string;
  hash: string;
  date: string;
  time: string;
  author: { name: string; avatar: string; color: string };
  message: string;
  status: "current" | "approved" | "pending";
  approvedBy?: { name: string; avatar: string };
  stats: { additions: number; deletions: number; files: number };
  changes: Change[];
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  current: { label: "HEAD", color: "#b07d4f", bg: "rgba(176,125,79,0.1)" },
  approved: { label: "Approved", color: "#5a9a3c", bg: "rgba(90,154,60,0.08)" },
  pending: { label: "Pending", color: "#8a7e63", bg: "rgba(138,126,99,0.08)" },
};

const FILE_TYPE_MAP: Record<string, { label: string; color: string }> = {
  added: { label: "A", color: "#5a9a3c" },
  modified: { label: "M", color: "#b07d4f" },
  deleted: { label: "D", color: "#c24b38" },
};

const REVISIONS: Revision[] = [
  {
    id: "r1", hash: "a3f7c1", date: "Mar 29, 2026", time: "11:42am",
    author: { name: "You", avatar: "A", color: "#b07d4f" },
    message: "Updated pricing — increased social template rate",
    status: "current",
    stats: { additions: 2, deletions: 1, files: 1 },
    changes: [{
      file: "Pricing", type: "modified",
      hunks: [{ context: "Line Items", lines: [
        { type: "unchanged", text: "Brand Guidelines Document    1 × $1,800    $1,800" },
        { type: "deletion", text: "Social Media Template Kit    5 × $100      $500" },
        { type: "addition", text: "Social Media Template Kit    5 × $120      $600" },
        { type: "unchanged", text: "" },
        { type: "deletion", text: "Total                                      $2,300" },
        { type: "addition", text: "Total                                      $2,400" },
      ]}]
    }]
  },
  {
    id: "r2", hash: "e8b2d4", date: "Mar 29, 2026", time: "10:15am",
    author: { name: "You", avatar: "A", color: "#b07d4f" },
    message: "Added social media templates to scope",
    status: "approved", approvedBy: { name: "Sarah Chen", avatar: "S" },
    stats: { additions: 1, deletions: 0, files: 2 },
    changes: [
      { file: "Scope of Work", type: "modified", hunks: [{ context: "Deliverables", lines: [
        { type: "unchanged", text: "04  Imagery & photography direction" },
        { type: "addition", text: "05  Social media templates (IG, LinkedIn)" },
      ]}]},
      { file: "Pricing", type: "modified", hunks: [{ context: "Line Items", lines: [
        { type: "unchanged", text: "Brand Guidelines Document    1 × $1,800    $1,800" },
        { type: "addition", text: "Social Media Template Kit    5 × $100      $500" },
      ]}]}
    ]
  },
  {
    id: "r3", hash: "f41a09", date: "Mar 28, 2026", time: "4:30pm",
    author: { name: "Jamie Park", avatar: "J", color: "#7c8594" },
    message: "Revised typography — switched to variable fonts",
    status: "approved", approvedBy: { name: "You", avatar: "A" },
    stats: { additions: 4, deletions: 3, files: 1 },
    changes: [{ file: "Notes", type: "modified", hunks: [{ context: "Typography", lines: [
      { type: "deletion", text: "Using static font files (Outfit Regular, Medium, Bold)" },
      { type: "deletion", text: "Font scale: 12 / 14 / 16 / 20 / 24 / 32" },
      { type: "deletion", text: "Line height: 1.5 across all sizes" },
      { type: "addition", text: "Using Outfit Variable (single file, full weight range)" },
      { type: "addition", text: "Font scale: 12 / 14 / 16 / 20 / 24 / 32 / 40" },
      { type: "addition", text: "Line height: 1.5 for body, 1.25 for headings" },
      { type: "addition", text: "Variable font supports weight 300–700 continuously" },
    ]}]}]
  },
  {
    id: "r4", hash: "c92e5b", date: "Mar 28, 2026", time: "2:10pm",
    author: { name: "You", avatar: "A", color: "#b07d4f" },
    message: "Added timeline milestones",
    status: "approved", approvedBy: { name: "Sarah Chen", avatar: "S" },
    stats: { additions: 4, deletions: 0, files: 1 },
    changes: [{ file: "Timeline", type: "added", hunks: [{ context: "Milestones", lines: [
      { type: "addition", text: "Week 1    Discovery & Research" },
      { type: "addition", text: "Week 2    Initial Concepts" },
      { type: "addition", text: "Week 3    Client Review" },
      { type: "addition", text: "Week 4    Final Delivery" },
    ]}]}]
  },
  {
    id: "r5", hash: "1d7f3a", date: "Mar 27, 2026", time: "9:00am",
    author: { name: "You", avatar: "A", color: "#b07d4f" },
    message: "Initial proposal created",
    status: "approved", approvedBy: { name: "Sarah Chen", avatar: "S" },
    stats: { additions: 12, deletions: 0, files: 4 },
    changes: [
      { file: "Introduction", type: "added", hunks: [{ context: "", lines: [
        { type: "addition", text: "Hi Sarah — thanks for reaching out about the" },
        { type: "addition", text: "Brand Guidelines project." },
      ]}]},
      { file: "Scope of Work", type: "added", hunks: [{ context: "Deliverables", lines: [
        { type: "addition", text: "01  Primary & secondary logo usage rules" },
        { type: "addition", text: "02  Color palette with hex/RGB/CMYK values" },
        { type: "addition", text: "03  Typography scale & font pairings" },
        { type: "addition", text: "04  Imagery & photography direction" },
      ]}]}
    ]
  },
];

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HistoryModal({ open, onClose }: HistoryModalProps) {
  const [selectedId, setSelectedId] = useState("r1");
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set(["all"]));

  const selected = REVISIONS.find(r => r.id === selectedId);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const trapRef = useFocusTrap(open);

  if (!open) return null;

  const isExpanded = (fileId: string) => expandedFiles.has("all") || expandedFiles.has(fileId);

  // Precompute which revisions start a new date group
  const showDateAtIndex = new Set<number>();
  {
    let prevDate = "";
    REVISIONS.forEach((rev, i) => {
      if (rev.date !== prevDate) { showDateAtIndex.add(i); prevDate = rev.date; }
    });
  }

  return (
    <div className={styles.overlay} onClick={onClose} ref={trapRef}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerTitle}>Version History</span>
            <span className={styles.headerBranch}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1" /><circle cx="5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1" /><path d="M5 4v2" stroke="currentColor" strokeWidth="1" /></svg>
              main
            </span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className={styles.body}>
          {/* Revision list (left) */}
          <div className={styles.revList}>
            <div className={styles.revListHead}>
              <span className={styles.revListTitle}>revisions</span>
              <span className={styles.revListCount}>{REVISIONS.length}</span>
            </div>
            <div className={styles.revScroll}>
              {REVISIONS.map((rev, i) => {
                const showDate = showDateAtIndex.has(i);
                const st = STATUS_MAP[rev.status];
                const isLast = i === REVISIONS.length - 1;
                return (
                  <div key={rev.id}>
                    {showDate && <div className={styles.revDate}>{rev.date}</div>}
                    <div className={`${styles.revItem} ${selectedId === rev.id ? styles.revItemOn : ""}`} onClick={() => setSelectedId(rev.id)}>
                      <div className={styles.revGraph}>
                        <div className={styles.revDot} style={{ borderColor: st.color }} />
                        {!isLast && <div className={styles.revLine} />}
                      </div>
                      <div className={styles.revBody}>
                        <div className={styles.revMsg}>{rev.message}</div>
                        <div className={styles.revMeta}>
                          <div className={styles.revAuthorAv} style={{ background: rev.author.color }}>{rev.author.avatar}</div>
                          <span className={styles.revHash}>{rev.hash}</span>
                          <span className={styles.revTime}>{rev.time}</span>
                          <span className={styles.revStatus} style={{ background: st.bg, color: st.color }}>{st.label}</span>
                        </div>
                        <div className={styles.revStats}>
                          <span className={styles.revStatAdd}>+{rev.stats.additions}</span>
                          <span className={styles.revStatDel}>-{rev.stats.deletions}</span>
                          <span className={styles.revStatFiles}>{rev.stats.files} {rev.stats.files === 1 ? "section" : "sections"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diff view (right) */}
          {selected && (
            <div className={styles.diffPane}>
              {/* Diff header */}
              <div className={styles.diffHead}>
                <div className={styles.diffMsg}>{selected.message}</div>
                <div className={styles.diffMeta}>
                  <span className={styles.diffChip}>
                    <span className={styles.diffChipAv} style={{ background: selected.author.color }}>{selected.author.avatar}</span>
                    {selected.author.name}
                  </span>
                  <span className={styles.diffChip}>{selected.hash}</span>
                  <span className={styles.diffChip}>{selected.date} at {selected.time}</span>
                  {selected.approvedBy && (
                    <span className={`${styles.diffChip} ${styles.diffChipApproved}`}>
                      ✓ Approved by {selected.approvedBy.name}
                    </span>
                  )}
                </div>
                {selected.status === "current" && (
                  <div className={styles.diffActions}>
                    <button className={styles.diffApprove}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      Approve
                    </button>
                    <button className={styles.diffRequest}>Request Changes</button>
                    <button className={styles.diffComment}>Comment</button>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className={styles.diffSummary}>
                <span className={styles.diffSummaryAdd}>+{selected.stats.additions} additions</span>
                <span className={styles.diffSummaryDel}>-{selected.stats.deletions} deletions</span>
                <span className={styles.diffSummaryFiles}>{selected.changes.length} {selected.changes.length === 1 ? "section" : "sections"}</span>
                <button className={styles.diffCollapseBtn} onClick={() => setExpandedFiles(prev => prev.has("all") ? new Set() : new Set(["all"]))}>
                  {expandedFiles.has("all") ? "Collapse all" : "Expand all"}
                </button>
              </div>

              {/* File diffs */}
              <div className={styles.diffContent}>
                {selected.changes.map((change, ci) => {
                  const ft = FILE_TYPE_MAP[change.type];
                  const fileId = `${selected.id}-${ci}`;
                  const expanded = isExpanded(fileId);
                  const totalAdd = change.hunks.reduce((s, h) => s + h.lines.filter(l => l.type === "addition").length, 0);
                  const totalDel = change.hunks.reduce((s, h) => s + h.lines.filter(l => l.type === "deletion").length, 0);

                  return (
                    <div key={ci} className={styles.diffFile}>
                      <div className={styles.diffFileHead} onClick={() => {
                        const next = new Set(expandedFiles);
                        next.delete("all");
                        if (next.has(fileId)) next.delete(fileId); else next.add(fileId);
                        setExpandedFiles(next);
                      }}>
                        <span className={styles.diffFileArrow} style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                        <span className={styles.diffFileType} style={{ background: `${ft.color}15`, color: ft.color, border: `1px solid ${ft.color}25` }}>{ft.label}</span>
                        <span className={styles.diffFileName}>{change.file}</span>
                        <div className={styles.diffFileStats}>
                          {totalAdd > 0 && <span className={styles.diffFileAdd}>+{totalAdd}</span>}
                          {totalDel > 0 && <span className={styles.diffFileDel}>-{totalDel}</span>}
                        </div>
                      </div>

                      {expanded && change.hunks.map((hunk, hi) => (
                        <div key={hi} className={styles.diffHunk}>
                          {hunk.context && <div className={styles.diffHunkContext}>@@ {hunk.context} @@</div>}
                          {hunk.lines.map((line, li) => {
                            const cls = line.type === "addition" ? styles.lineAdd : line.type === "deletion" ? styles.lineDel : styles.lineCtx;
                            return (
                              <div key={li} className={`${styles.diffLine} ${cls}`}>
                                <div className={styles.diffMarker}>
                                  {line.type === "addition" ? "+" : line.type === "deletion" ? "−" : ""}
                                </div>
                                <div className={styles.diffCode}>{line.text}</div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
