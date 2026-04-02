import { useState } from "react";

const REVISIONS = [
  {
    id: "r1", hash: "a3f7c1", branch: "main", date: "Mar 29, 2026", time: "11:42am",
    author: { name: "You", avatar: "A", color: "#b07d4f" },
    message: "Updated pricing — increased social template rate",
    status: "current",
    stats: { additions: 2, deletions: 1, files: 1 },
    changes: [
      {
        file: "Pricing",
        type: "modified",
        hunks: [
          { context: "Line Items", lines: [
            { type: "unchanged", text: "Brand Guidelines Document    1 × $1,800    $1,800" },
            { type: "deletion", text: "Social Media Template Kit    5 × $100      $500" },
            { type: "addition", text: "Social Media Template Kit    5 × $120      $600" },
            { type: "unchanged", text: "" },
            { type: "deletion", text: "Total                                      $2,300" },
            { type: "addition", text: "Total                                      $2,400" },
          ]}
        ]
      }
    ]
  },
  {
    id: "r2", hash: "e8b2d4", branch: "main", date: "Mar 29, 2026", time: "10:15am",
    author: { name: "You", avatar: "A", color: "#b07d4f" },
    message: "Added social media templates to scope",
    status: "approved",
    approvedBy: { name: "Sarah Chen", avatar: "S" },
    stats: { additions: 1, deletions: 0, files: 2 },
    changes: [
      {
        file: "Scope of Work",
        type: "modified",
        hunks: [
          { context: "Deliverables", lines: [
            { type: "unchanged", text: "04  Imagery & photography direction" },
            { type: "addition", text: "05  Social media templates (IG, LinkedIn)" },
          ]}
        ]
      },
      {
        file: "Pricing",
        type: "modified",
        hunks: [
          { context: "Line Items", lines: [
            { type: "unchanged", text: "Brand Guidelines Document    1 × $1,800    $1,800" },
            { type: "addition", text: "Social Media Template Kit    5 × $100      $500" },
          ]}
        ]
      }
    ]
  },
  {
    id: "r3", hash: "f41a09", branch: "main", date: "Mar 28, 2026", time: "4:30pm",
    author: { name: "Jamie Park", avatar: "J", color: "#7c8594" },
    message: "Revised typography section — switched to variable fonts",
    status: "approved",
    approvedBy: { name: "You", avatar: "A" },
    stats: { additions: 4, deletions: 3, files: 1 },
    changes: [
      {
        file: "Notes",
        type: "modified",
        hunks: [
          { context: "Typography", lines: [
            { type: "deletion", text: "Using static font files (Outfit Regular, Medium, Bold)" },
            { type: "deletion", text: "Font scale: 12 / 14 / 16 / 20 / 24 / 32" },
            { type: "deletion", text: "Line height: 1.5 across all sizes" },
            { type: "addition", text: "Using Outfit Variable (single file, full weight range)" },
            { type: "addition", text: "Font scale: 12 / 14 / 16 / 20 / 24 / 32 / 40" },
            { type: "addition", text: "Line height: 1.5 for body, 1.25 for headings" },
            { type: "addition", text: "Variable font supports weight 300–700 continuously" },
          ]}
        ]
      }
    ]
  },
  {
    id: "r4", hash: "c92e5b", branch: "main", date: "Mar 28, 2026", time: "2:10pm",
    author: { name: "You", avatar: "A", color: "#b07d4f" },
    message: "Added timeline milestones",
    status: "approved",
    approvedBy: { name: "Sarah Chen", avatar: "S" },
    stats: { additions: 4, deletions: 0, files: 1 },
    changes: [
      {
        file: "Timeline",
        type: "added",
        hunks: [
          { context: "Milestones", lines: [
            { type: "addition", text: "Week 1    Discovery & Research" },
            { type: "addition", text: "Week 2    Initial Concepts" },
            { type: "addition", text: "Week 3    Client Review" },
            { type: "addition", text: "Week 4    Final Delivery" },
          ]}
        ]
      }
    ]
  },
  {
    id: "r5", hash: "1d7f3a", branch: "main", date: "Mar 27, 2026", time: "9:00am",
    author: { name: "You", avatar: "A", color: "#b07d4f" },
    message: "Initial proposal created",
    status: "approved",
    approvedBy: { name: "Sarah Chen", avatar: "S" },
    stats: { additions: 12, deletions: 0, files: 4 },
    changes: [
      {
        file: "Introduction",
        type: "added",
        hunks: [
          { context: "", lines: [
            { type: "addition", text: "Hi Sarah — thanks for reaching out about the" },
            { type: "addition", text: "Brand Guidelines project. Based on our conversation," },
            { type: "addition", text: "here's what I'm proposing." },
          ]}
        ]
      },
      {
        file: "Scope of Work",
        type: "added",
        hunks: [
          { context: "Deliverables", lines: [
            { type: "addition", text: "01  Primary & secondary logo usage rules" },
            { type: "addition", text: "02  Color palette with hex/RGB/CMYK values" },
            { type: "addition", text: "03  Typography scale & font pairings" },
            { type: "addition", text: "04  Imagery & photography direction" },
          ]}
        ]
      }
    ]
  },
];

const STATUS_MAP = {
  current: { label: "HEAD", color: "#b07d4f", bg: "rgba(176,125,79,0.1)", border: "rgba(176,125,79,0.2)" },
  approved: { label: "Approved", color: "#5a9a3c", bg: "rgba(90,154,60,0.08)", border: "rgba(90,154,60,0.15)" },
  pending: { label: "Pending", color: "#8a7e63", bg: "rgba(138,126,99,0.08)", border: "rgba(138,126,99,0.15)" },
  rejected: { label: "Changes Req.", color: "#c24b38", bg: "rgba(194,75,56,0.08)", border: "rgba(194,75,56,0.15)" },
};

const FILE_TYPE_MAP = {
  added: { label: "A", color: "#5a9a3c" },
  modified: { label: "M", color: "#b07d4f" },
  deleted: { label: "D", color: "#c24b38" },
  renamed: { label: "R", color: "#7c8594" },
};

export default function ProjectHistory() {
  const [selectedRevision, setSelectedRevision] = useState("r1");
  const [expandedFiles, setExpandedFiles] = useState(new Set(["all"]));
  const [viewMode, setViewMode] = useState("split"); // split | unified | list
  const [filter, setFilter] = useState("all"); // all | mine | reviews

  const selected = REVISIONS.find(r => r.id === selectedRevision);
  const filtered = filter === "all" ? REVISIONS
    : filter === "mine" ? REVISIONS.filter(r => r.author.name === "You")
    : REVISIONS.filter(r => r.approvedBy?.name === "You");

  const toggleFile = (fileId) => {
    setExpandedFiles(prev => {
      const next = new Set(prev);
      if (next.has(fileId)) next.delete(fileId);
      else next.add(fileId);
      return next;
    });
  };

  const isExpanded = (fileId) => expandedFiles.has("all") || expandedFiles.has(fileId);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --parchment: #faf9f7; --warm-50: #f7f6f3; --warm-100: #f0eee9;
          --warm-200: #e5e2db; --warm-300: #d5d1c8; --warm-400: #b8b3a8;
          --ink-900: #2c2a25; --ink-800: #3d3a33; --ink-700: #4f4c44;
          --ink-600: #65625a; --ink-500: #7d7a72; --ink-400: #9b988f; --ink-300: #b5b2a9;
          --ember: #b07d4f; --ember-light: #c89360; --ember-bg: rgba(176,125,79,0.08);
          --mono: 'JetBrains Mono', monospace;
          --green: #5a9a3c; --red: #c24b38;
          --diff-add-bg: rgba(90,154,60,0.06); --diff-add-border: rgba(90,154,60,0.15);
          --diff-del-bg: rgba(194,75,56,0.06); --diff-del-border: rgba(194,75,56,0.12);
        }

        .history {
          font-family: 'Outfit', sans-serif; font-size: 14px;
          color: var(--ink-700); background: var(--parchment);
          height: 100vh; display: flex; flex-direction: column;
        }

        /* ── Topbar ── */
        .h-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 20px; border-bottom: 1px solid var(--warm-200);
          flex-shrink: 0; background: var(--warm-50);
        }
        .h-topbar-left { display: flex; align-items: center; gap: 12px; }
        .h-back { background: none; border: none; cursor: pointer; color: var(--ink-400); display: flex; padding: 4px; border-radius: 4px; }
        .h-back:hover { background: var(--warm-200); color: var(--ink-600); }
        .h-title { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 600; color: var(--ink-900); }
        .h-branch {
          font-family: var(--mono); font-size: 11px; color: var(--ember);
          background: var(--ember-bg); border: 1px solid rgba(176,125,79,0.12);
          padding: 2px 8px; border-radius: 3px; display: flex; align-items: center; gap: 4px;
        }
        .h-topbar-right { display: flex; align-items: center; gap: 6px; }
        .h-btn {
          padding: 6px 14px; border-radius: 5px; font-size: 12px; font-weight: 500;
          font-family: inherit; cursor: pointer; transition: all 0.1s;
        }
        .h-btn-ghost { background: none; border: 1px solid var(--warm-200); color: var(--ink-600); }
        .h-btn-ghost:hover { border-color: var(--warm-300); background: var(--warm-100); }
        .h-btn-ghost.on { background: var(--ink-900); color: var(--parchment); border-color: var(--ink-900); }
        .h-view-toggle { display: flex; border: 1px solid var(--warm-200); border-radius: 5px; overflow: hidden; }
        .h-vt {
          padding: 5px 10px; font-size: 11px; font-weight: 500; border: none;
          cursor: pointer; font-family: var(--mono); color: var(--ink-400); background: #fff;
        }
        .h-vt:not(:last-child) { border-right: 1px solid var(--warm-200); }
        .h-vt:hover { background: var(--warm-100); }
        .h-vt.on { background: var(--ink-900); color: var(--parchment); }

        .h-layout { display: flex; flex: 1; overflow: hidden; }

        /* ── Revision list (left) ── */
        .h-revisions {
          width: 340px; min-width: 340px; background: var(--warm-50);
          border-right: 1px solid var(--warm-200); display: flex;
          flex-direction: column; flex-shrink: 0;
        }
        .h-rev-head {
          padding: 10px 14px; border-bottom: 1px solid var(--warm-200);
          display: flex; align-items: center; justify-content: space-between;
        }
        .h-rev-title { font-family: var(--mono); font-size: 9px; font-weight: 500; color: var(--ink-400); letter-spacing: 0.1em; text-transform: uppercase; }
        .h-rev-filters { display: flex; gap: 2px; }
        .h-rf {
          padding: 3px 8px; border-radius: 3px; font-size: 11px;
          border: none; cursor: pointer; font-family: inherit;
          color: var(--ink-400); background: none; transition: all 0.08s;
        }
        .h-rf:hover { background: var(--warm-200); }
        .h-rf.on { background: var(--ink-900); color: var(--parchment); }

        .h-rev-scroll { flex: 1; overflow-y: auto; }
        .h-rev-scroll::-webkit-scrollbar { width: 3px; }
        .h-rev-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }

        .h-rev-date {
          font-family: var(--mono); font-size: 10px; color: var(--ink-400);
          padding: 12px 14px 4px; letter-spacing: 0.02em;
        }

        /* Revision item */
        .rev-item {
          display: flex; gap: 10px; padding: 10px 14px;
          cursor: pointer; transition: background 0.06s; position: relative;
        }
        .rev-item:hover { background: var(--warm-100); }
        .rev-item.on { background: var(--ember-bg); }

        /* Timeline graph */
        .rev-graph { display: flex; flex-direction: column; align-items: center; width: 20px; flex-shrink: 0; }
        .rev-dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid; flex-shrink: 0; z-index: 1; background: var(--warm-50); }
        .rev-item.on .rev-dot { background: #faf5ef; }
        .rev-item:hover .rev-dot { background: var(--warm-100); }
        .rev-line { width: 1.5px; flex: 1; margin-top: 2px; }

        .rev-body { flex: 1; min-width: 0; }
        .rev-msg { font-size: 13px; color: var(--ink-800); font-weight: 500; line-height: 1.4; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .rev-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .rev-hash { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }
        .rev-time { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }
        .rev-author-av {
          width: 16px; height: 16px; border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          font-size: 8px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .rev-stats { display: flex; gap: 6px; margin-top: 4px; }
        .rev-stat { font-family: var(--mono); font-size: 10px; display: flex; align-items: center; gap: 2px; }
        .rev-stat.add { color: var(--green); }
        .rev-stat.del { color: var(--red); }
        .rev-stat.files { color: var(--ink-400); }
        .rev-status {
          font-family: var(--mono); font-size: 9px; font-weight: 500;
          padding: 1px 6px; border-radius: 2px; letter-spacing: 0.04em;
          text-transform: uppercase; border: 1px solid;
        }

        /* ── Diff view (right) ── */
        .h-diff { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
        .h-diff::-webkit-scrollbar { width: 5px; }
        .h-diff::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }

        /* Diff header */
        .diff-head {
          padding: 16px 24px; border-bottom: 1px solid var(--warm-200);
          background: var(--parchment); flex-shrink: 0; position: sticky; top: 0; z-index: 5;
        }
        .diff-head-msg { font-size: 16px; font-weight: 600; color: var(--ink-900); margin-bottom: 6px; font-family: 'Cormorant Garamond', serif; }
        .diff-head-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .diff-head-chip {
          font-family: var(--mono); font-size: 10px; color: var(--ink-400);
          display: flex; align-items: center; gap: 4px;
        }
        .diff-head-chip .av {
          width: 18px; height: 18px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 600; color: #fff;
        }

        .diff-actions {
          display: flex; gap: 6px; margin-top: 12px;
        }
        .diff-action {
          padding: 5px 12px; border-radius: 4px; font-size: 11.5px; font-weight: 500;
          font-family: inherit; cursor: pointer; transition: all 0.1s;
          display: flex; align-items: center; gap: 5px;
        }
        .diff-approve { background: rgba(90,154,60,0.08); border: 1px solid rgba(90,154,60,0.15); color: var(--green); }
        .diff-approve:hover { background: rgba(90,154,60,0.15); }
        .diff-request { background: rgba(194,75,56,0.06); border: 1px solid rgba(194,75,56,0.12); color: var(--red); }
        .diff-request:hover { background: rgba(194,75,56,0.1); }
        .diff-comment { background: none; border: 1px solid var(--warm-200); color: var(--ink-600); }
        .diff-comment:hover { background: var(--warm-100); }

        /* File diffs */
        .diff-content { padding: 16px 24px 60px; }

        .diff-file {
          border: 1px solid var(--warm-200); border-radius: 6px;
          overflow: hidden; margin-bottom: 12px;
        }
        .diff-file-head {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px; background: var(--warm-50);
          border-bottom: 1px solid var(--warm-200); cursor: pointer;
          transition: background 0.06s;
        }
        .diff-file-head:hover { background: var(--warm-100); }
        .diff-file-arrow { font-size: 9px; color: var(--ink-400); transition: transform 0.12s; }
        .diff-file-type {
          font-family: var(--mono); font-size: 10px; font-weight: 600;
          width: 18px; height: 18px; border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .diff-file-name { font-size: 13px; font-weight: 500; color: var(--ink-800); flex: 1; }
        .diff-file-stats { display: flex; gap: 8px; font-family: var(--mono); font-size: 10px; }
        .diff-file-add { color: var(--green); }
        .diff-file-del { color: var(--red); }

        /* Hunk */
        .diff-hunk { border-top: 1px solid var(--warm-100); }
        .diff-hunk-context {
          font-family: var(--mono); font-size: 10px; color: var(--ink-400);
          padding: 4px 14px; background: rgba(0,0,0,0.015);
          border-bottom: 1px solid var(--warm-100);
          letter-spacing: 0.02em;
        }

        /* Lines */
        .diff-line {
          display: flex; align-items: stretch; font-family: var(--mono);
          font-size: 12px; line-height: 1.7; min-height: 24px;
          border-bottom: 1px solid transparent;
        }
        .diff-line:hover { filter: brightness(0.98); }
        .diff-gutter {
          width: 44px; text-align: right; padding: 0 8px;
          color: var(--ink-300); user-select: none; flex-shrink: 0;
          display: flex; align-items: center; justify-content: flex-end;
          font-size: 10px;
        }
        .diff-marker {
          width: 20px; text-align: center; font-weight: 600;
          user-select: none; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
        }
        .diff-code {
          flex: 1; padding: 0 12px; white-space: pre-wrap;
          word-break: break-all;
        }
        .diff-comment-btn {
          width: 20px; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; opacity: 0; transition: opacity 0.1s; cursor: pointer;
          color: var(--ink-300); background: none; border: none;
        }
        .diff-line:hover .diff-comment-btn { opacity: 1; }
        .diff-comment-btn:hover { color: var(--ember); }

        /* Line types */
        .diff-line.add { background: var(--diff-add-bg); }
        .diff-line.add .diff-gutter { background: rgba(90,154,60,0.06); color: var(--green); }
        .diff-line.add .diff-marker { color: var(--green); }
        .diff-line.add .diff-code { color: var(--ink-800); }

        .diff-line.del { background: var(--diff-del-bg); }
        .diff-line.del .diff-gutter { background: rgba(194,75,56,0.05); color: var(--red); }
        .diff-line.del .diff-marker { color: var(--red); }
        .diff-line.del .diff-code { color: var(--ink-600); }

        .diff-line.ctx .diff-code { color: var(--ink-500); }
        .diff-line.ctx .diff-gutter { color: var(--ink-300); }

        /* ── Summary bar ── */
        .diff-summary {
          display: flex; align-items: center; gap: 16px; padding: 12px 24px;
          background: var(--warm-50); border-bottom: 1px solid var(--warm-200);
          font-family: var(--mono); font-size: 11px; color: var(--ink-400);
          flex-shrink: 0;
        }
        .diff-summary-stat { display: flex; align-items: center; gap: 4px; }

        /* ── Expand / collapse all ── */
        .diff-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 24px; flex-shrink: 0;
        }
        .diff-toolbar-btn {
          font-family: var(--mono); font-size: 10px; color: var(--ink-400);
          background: none; border: none; cursor: pointer; padding: 3px 6px;
          border-radius: 3px;
        }
        .diff-toolbar-btn:hover { background: var(--warm-100); color: var(--ink-600); }
      `}</style>

      <div className="history">
        {/* ── Topbar ── */}
        <div className="h-topbar">
          <div className="h-topbar-left">
            <button className="h-back">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span className="h-title">Project History</span>
            <span className="h-branch">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1"/><circle cx="5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1"/><path d="M5 4v2" stroke="currentColor" strokeWidth="1"/></svg>
              main
            </span>
          </div>
          <div className="h-topbar-right">
            <div className="h-view-toggle">
              <button className={`h-vt${viewMode === "unified" ? " on" : ""}`} onClick={() => setViewMode("unified")}>Unified</button>
              <button className={`h-vt${viewMode === "split" ? " on" : ""}`} onClick={() => setViewMode("split")}>Split</button>
              <button className={`h-vt${viewMode === "list" ? " on" : ""}`} onClick={() => setViewMode("list")}>List</button>
            </div>
          </div>
        </div>

        <div className="h-layout">
          {/* ═══ REVISION LIST ═══ */}
          <div className="h-revisions">
            <div className="h-rev-head">
              <span className="h-rev-title">revisions</span>
              <div className="h-rev-filters">
                <button className={`h-rf${filter === "all" ? " on" : ""}`} onClick={() => setFilter("all")}>All</button>
                <button className={`h-rf${filter === "mine" ? " on" : ""}`} onClick={() => setFilter("mine")}>Mine</button>
                <button className={`h-rf${filter === "reviews" ? " on" : ""}`} onClick={() => setFilter("reviews")}>Reviews</button>
              </div>
            </div>

            <div className="h-rev-scroll">
              {(() => {
                let lastDate = "";
                return filtered.map((rev, i) => {
                  const showDate = rev.date !== lastDate;
                  lastDate = rev.date;
                  const st = STATUS_MAP[rev.status];
                  const isLast = i === filtered.length - 1;
                  return (
                    <div key={rev.id}>
                      {showDate && <div className="h-rev-date">{rev.date}</div>}
                      <div className={`rev-item${selectedRevision === rev.id ? " on" : ""}`} onClick={() => setSelectedRevision(rev.id)}>
                        <div className="rev-graph">
                          <div className="rev-dot" style={{ borderColor: st.color }} />
                          {!isLast && <div className="rev-line" style={{ background: "var(--warm-300)" }} />}
                        </div>
                        <div className="rev-body">
                          <div className="rev-msg">{rev.message}</div>
                          <div className="rev-meta">
                            <div className="rev-author-av" style={{ background: rev.author.color }}>{rev.author.avatar}</div>
                            <span className="rev-hash">{rev.hash}</span>
                            <span className="rev-time">{rev.time}</span>
                            <span className="rev-status" style={{ background: st.bg, color: st.color, borderColor: st.border }}>{st.label}</span>
                          </div>
                          <div className="rev-stats">
                            <span className="rev-stat add">+{rev.stats.additions}</span>
                            <span className="rev-stat del">-{rev.stats.deletions}</span>
                            <span className="rev-stat files">{rev.stats.files} {rev.stats.files === 1 ? "section" : "sections"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* ═══ DIFF VIEW ═══ */}
          {selected && (
            <div className="h-diff">
              <div className="diff-head">
                <div className="diff-head-msg">{selected.message}</div>
                <div className="diff-head-meta">
                  <span className="diff-head-chip">
                    <span className="av" style={{ background: selected.author.color }}>{selected.author.avatar}</span>
                    {selected.author.name}
                  </span>
                  <span className="diff-head-chip">{selected.hash}</span>
                  <span className="diff-head-chip">{selected.date} at {selected.time}</span>
                  {selected.approvedBy && (
                    <span className="diff-head-chip" style={{ color: "var(--green)" }}>
                      ✓ Approved by {selected.approvedBy.name}
                    </span>
                  )}
                </div>

                {selected.status === "current" && (
                  <div className="diff-actions">
                    <button className="diff-action diff-approve">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Approve
                    </button>
                    <button className="diff-action diff-request">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 3v4M6 9h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      Request Changes
                    </button>
                    <button className="diff-action diff-comment">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 7.5c0 .5-.3 1-.8 1H4l-2.2 2V3c0-.5.3-1 .8-1h7.4c.5 0 .8.5.8 1v4.5z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>
                      Comment
                    </button>
                  </div>
                )}
              </div>

              <div className="diff-summary">
                <span className="diff-summary-stat" style={{ color: "var(--green)" }}>+{selected.stats.additions} additions</span>
                <span className="diff-summary-stat" style={{ color: "var(--red)" }}>-{selected.stats.deletions} deletions</span>
                <span className="diff-summary-stat">{selected.changes.length} {selected.changes.length === 1 ? "section" : "sections"} changed</span>
                <div style={{ marginLeft: "auto" }}>
                  <button className="diff-toolbar-btn"
                    onClick={() => setExpandedFiles(prev => prev.has("all") ? new Set() : new Set(["all"]))}>
                    {expandedFiles.has("all") ? "Collapse all" : "Expand all"}
                  </button>
                </div>
              </div>

              <div className="diff-content">
                {selected.changes.map((change, ci) => {
                  const ft = FILE_TYPE_MAP[change.type];
                  const fileId = `${selected.id}-${ci}`;
                  const expanded = isExpanded(fileId);
                  const totalAdd = change.hunks.reduce((s, h) => s + h.lines.filter(l => l.type === "addition").length, 0);
                  const totalDel = change.hunks.reduce((s, h) => s + h.lines.filter(l => l.type === "deletion").length, 0);

                  return (
                    <div key={ci} className="diff-file">
                      <div className="diff-file-head" onClick={() => { const next = new Set(expandedFiles); next.delete("all"); if (next.has(fileId)) next.delete(fileId); else next.add(fileId); setExpandedFiles(next); }}>
                        <span className="diff-file-arrow" style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                        <span className="diff-file-type" style={{ background: `${ft.color}15`, color: ft.color, border: `1px solid ${ft.color}25` }}>{ft.label}</span>
                        <span className="diff-file-name">{change.file}</span>
                        <div className="diff-file-stats">
                          {totalAdd > 0 && <span className="diff-file-add">+{totalAdd}</span>}
                          {totalDel > 0 && <span className="diff-file-del">-{totalDel}</span>}
                        </div>
                      </div>

                      {expanded && change.hunks.map((hunk, hi) => {
                        let addLine = 1;
                        let delLine = 1;
                        return (
                          <div key={hi} className="diff-hunk">
                            {hunk.context && <div className="diff-hunk-context">@@ {hunk.context} @@</div>}
                            {hunk.lines.map((line, li) => {
                              const cls = line.type === "addition" ? "add" : line.type === "deletion" ? "del" : "ctx";
                              const lineNum = line.type === "addition" ? addLine++ : line.type === "deletion" ? delLine++ : (addLine++, delLine++, addLine - 1);
                              return (
                                <div key={li} className={`diff-line ${cls}`}>
                                  <div className="diff-gutter">{lineNum}</div>
                                  <div className="diff-marker">
                                    {line.type === "addition" ? "+" : line.type === "deletion" ? "−" : ""}
                                  </div>
                                  <div className="diff-code">{line.text}</div>
                                  <button className="diff-comment-btn" title="Add comment">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 7.5c0 .5-.3 1-.8 1H4l-2.2 2V3c0-.5.3-1 .8-1h7.4c.5 0 .8.5.8 1v4.5z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
