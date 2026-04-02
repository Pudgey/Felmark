import { useState, useRef } from "react";

const TEAM = [
  { id: "u1", name: "You", short: "You", avatar: "A", color: "#b07d4f" },
  { id: "u2", name: "Jamie Park", short: "Jamie", avatar: "J", color: "#7c8594" },
  { id: "u3", name: "Sarah Chen", short: "Sarah", avatar: "S", color: "#8a7e63" },
];

const INITIAL_DELIVERABLES = [
  {
    id: "d1", title: "Primary & secondary logo usage rules", status: "approved",
    assignee: "u1", dueDate: "Mar 18", completedDate: "Mar 17",
    description: "Define clear rules for logo placement, sizing, clear space, and color variants.",
    files: [
      { id: "f1", name: "logo-guidelines-v3.pdf", type: "pdf", size: "2.4 MB", uploadedBy: "u1", uploadedAt: "Mar 17", thumbnail: null },
      { id: "f2", name: "logo-usage-examples.fig", type: "fig", size: "8.1 MB", uploadedBy: "u1", uploadedAt: "Mar 17", thumbnail: null },
    ],
    comments: [
      { id: "c1", user: "u3", text: "The minimum size specs look great. Can we also add a section about logo animation guidelines for social?", time: "Mar 18, 10:30am", resolved: false },
      { id: "c2", user: "u1", text: "Good idea — I'll add a motion section in v4. For now the static rules are locked.", time: "Mar 18, 11:15am", resolved: false },
    ],
    approvals: [{ user: "u3", status: "approved", time: "Mar 18" }, { user: "u2", status: "approved", time: "Mar 18" }],
    activity: [
      { text: "You uploaded logo-guidelines-v3.pdf", time: "Mar 17" },
      { text: "Sarah approved", time: "Mar 18" },
      { text: "Jamie approved", time: "Mar 18" },
    ],
  },
  {
    id: "d2", title: "Color palette with hex/RGB/CMYK values", status: "review",
    assignee: "u1", dueDate: "Mar 22", completedDate: "Mar 21",
    description: "Complete color system with primary, secondary, and neutral palettes plus accessibility notes.",
    files: [
      { id: "f3", name: "color-system-v2.pdf", type: "pdf", size: "1.8 MB", uploadedBy: "u1", uploadedAt: "Mar 21", thumbnail: null },
    ],
    comments: [
      { id: "c3", user: "u3", text: "Can we make sure all color pairs hit WCAG AA contrast? The ember on parchment might be close.", time: "Mar 22, 9:00am", resolved: false },
    ],
    approvals: [{ user: "u3", status: "pending", time: null }, { user: "u2", status: "approved", time: "Mar 22" }],
    activity: [
      { text: "You uploaded color-system-v2.pdf", time: "Mar 21" },
      { text: "Jamie approved", time: "Mar 22" },
      { text: "Sarah requested changes", time: "Mar 22" },
    ],
  },
  {
    id: "d3", title: "Typography scale & font pairings", status: "in-progress",
    assignee: "u2", dueDate: "Mar 28", completedDate: null,
    description: "Modular type scale with Outfit Variable, Cormorant Garamond, and JetBrains Mono. Web + print variants.",
    files: [],
    comments: [
      { id: "c4", user: "u2", text: "Working on the variable font setup now. Should have the scale doc ready by tomorrow.", time: "Mar 27, 4:30pm", resolved: false },
    ],
    approvals: [],
    activity: [
      { text: "Jamie started working", time: "Mar 25" },
      { text: "Jamie commented", time: "Mar 27" },
    ],
  },
  {
    id: "d4", title: "Imagery & photography direction", status: "todo",
    assignee: "u1", dueDate: "Apr 1", completedDate: null,
    description: "Mood board and guidelines for photography style, image treatments, and illustration direction.",
    files: [],
    comments: [],
    approvals: [],
    activity: [],
  },
  {
    id: "d5", title: "Social media templates (IG, LinkedIn)", status: "todo",
    assignee: "u1", dueDate: "Apr 3", completedDate: null,
    description: "Template kit for Instagram feed/stories and LinkedIn posts. Canva + Figma source files.",
    files: [],
    comments: [],
    approvals: [],
    activity: [],
  },
];

const STATUS_CONFIG = {
  "todo": { label: "To Do", color: "#9b988f", bg: "rgba(155,152,143,0.06)", icon: "○" },
  "in-progress": { label: "In Progress", color: "#b07d4f", bg: "rgba(176,125,79,0.06)", icon: "◐" },
  "review": { label: "In Review", color: "#5b7fa4", bg: "rgba(91,127,164,0.06)", icon: "◎" },
  "changes": { label: "Changes Requested", color: "#c24b38", bg: "rgba(194,75,56,0.06)", icon: "↻" },
  "approved": { label: "Approved", color: "#5a9a3c", bg: "rgba(90,154,60,0.06)", icon: "✓" },
};

const FILE_ICONS = {
  pdf: { icon: "PDF", color: "#c24b38" },
  fig: { icon: "FIG", color: "#a259ff" },
  png: { icon: "PNG", color: "#5b7fa4" },
  jpg: { icon: "JPG", color: "#5b7fa4" },
  sketch: { icon: "SKT", color: "#f7b500" },
  doc: { icon: "DOC", color: "#2b579a" },
  default: { icon: "FILE", color: "#9b988f" },
};

export default function DeliverableBlocks() {
  const [deliverables, setDeliverables] = useState(INITIAL_DELIVERABLES);
  const [expandedId, setExpandedId] = useState("d2");
  const [activeTab, setActiveTab] = useState({});
  const [commentText, setCommentText] = useState({});
  const [showUpload, setShowUpload] = useState(null);
  const [dragFile, setDragFile] = useState(null);
  const [showStatusMenu, setShowStatusMenu] = useState(null);

  const getUser = (id) => TEAM.find(u => u.id === id) || TEAM[0];
  const getFileIcon = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    return FILE_ICONS[ext] || FILE_ICONS.default;
  };

  const getTab = (id) => activeTab[id] || "files";
  const setTab = (id, tab) => setActiveTab(prev => ({ ...prev, [id]: tab }));

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const updateStatus = (id, status) => {
    setDeliverables(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    setShowStatusMenu(null);
  };

  const addComment = (id) => {
    const text = commentText[id];
    if (!text?.trim()) return;
    setDeliverables(prev => prev.map(d => d.id === id ? {
      ...d,
      comments: [...d.comments, { id: `c${Date.now()}`, user: "u1", text: text.trim(), time: "Just now", resolved: false }],
    } : d));
    setCommentText(prev => ({ ...prev, [id]: "" }));
  };

  const simulateUpload = (id) => {
    const names = ["deliverable-draft.pdf", "design-v2.fig", "mockup-final.png", "assets.zip"];
    const name = names[Math.floor(Math.random() * names.length)];
    setDeliverables(prev => prev.map(d => d.id === id ? {
      ...d,
      files: [...d.files, { id: `f${Date.now()}`, name, type: name.split(".").pop(), size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`, uploadedBy: "u1", uploadedAt: "Just now" }],
      status: d.status === "todo" ? "in-progress" : d.status,
    } : d));
    setShowUpload(null);
  };

  const approve = (delivId) => {
    setDeliverables(prev => prev.map(d => {
      if (d.id !== delivId) return d;
      const existing = d.approvals.find(a => a.user === "u1");
      if (existing) {
        return { ...d, approvals: d.approvals.map(a => a.user === "u1" ? { ...a, status: "approved", time: "Just now" } : a) };
      }
      return { ...d, approvals: [...d.approvals, { user: "u1", status: "approved", time: "Just now" }] };
    }));
  };

  // Stats
  const totalDeliverables = deliverables.length;
  const approvedCount = deliverables.filter(d => d.status === "approved").length;
  const reviewCount = deliverables.filter(d => d.status === "review").length;
  const progressPct = Math.round((approvedCount / totalDeliverables) * 100);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --parchment: #faf9f7; --warm-50: #f7f6f3; --warm-100: #f0eee9;
          --warm-200: #e5e2db; --warm-300: #d5d1c8; --warm-400: #b8b3a8;
          --ink-900: #2c2a25; --ink-800: #3d3a33; --ink-700: #4f4c44;
          --ink-600: #65625a; --ink-500: #7d7a72; --ink-400: #9b988f; --ink-300: #b5b2a9;
          --ember: #b07d4f; --ember-light: #c89360; --ember-bg: rgba(176,125,79,0.08);
          --mono: 'JetBrains Mono', monospace;
        }

        .db-page { font-family: 'Outfit', sans-serif; font-size: 15px; color: var(--ink-700); background: var(--parchment); min-height: 100vh; }
        .db-canvas { max-width: 740px; margin: 0 auto; padding: 48px 40px 120px; }

        .db-h1 { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 600; color: var(--ink-900); margin-bottom: 4px; }
        .db-meta { font-family: var(--mono); font-size: 11px; color: var(--ink-400); margin-bottom: 20px; display: flex; gap: 12px; align-items: center; }
        .db-status-badge { padding: 2px 8px; border-radius: 3px; font-weight: 500; font-size: 10px; letter-spacing: 0.04em; }

        /* Progress bar */
        .db-progress { margin-bottom: 28px; }
        .db-progress-head { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .db-progress-label { font-size: 13px; color: var(--ink-500); }
        .db-progress-pct { font-family: var(--mono); font-size: 12px; color: var(--ember); font-weight: 500; }
        .db-progress-bar { height: 6px; background: var(--warm-200); border-radius: 3px; overflow: hidden; display: flex; gap: 2px; }
        .db-progress-seg { height: 100%; border-radius: 3px; transition: width 0.4s ease; }

        .db-h2 { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: var(--ink-900); margin: 28px 0 14px; }
        .db-p { font-size: 15px; color: var(--ink-600); line-height: 1.75; margin-bottom: 16px; }

        /* ═══ DELIVERABLE BLOCK ═══ */
        .deliv {
          border: 1px solid var(--warm-200); border-radius: 10px;
          margin-bottom: 10px; overflow: hidden;
          transition: all 0.15s; background: #fff;
        }
        .deliv:hover { border-color: var(--warm-300); }
        .deliv.expanded { border-color: var(--warm-300); box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
        .deliv.status-approved { border-left: 3px solid #5a9a3c; }
        .deliv.status-review { border-left: 3px solid #5b7fa4; }
        .deliv.status-in-progress { border-left: 3px solid #b07d4f; }
        .deliv.status-changes { border-left: 3px solid #c24b38; }
        .deliv.status-todo { border-left: 3px solid #d5d1c8; }

        /* ── Collapsed row ── */
        .deliv-row {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 18px; cursor: pointer;
          transition: background 0.06s;
        }
        .deliv-row:hover { background: var(--warm-50); }

        .deliv-status-icon {
          width: 28px; height: 28px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 600; flex-shrink: 0;
          transition: all 0.12s; cursor: pointer; position: relative;
        }
        .deliv-status-icon:hover { transform: scale(1.1); }

        .deliv-info { flex: 1; min-width: 0; }
        .deliv-title { font-size: 15px; font-weight: 500; color: var(--ink-800); }
        .deliv.status-approved .deliv-title { text-decoration: line-through; text-decoration-color: rgba(90,154,60,0.3); color: var(--ink-500); }
        .deliv-subtitle { display: flex; align-items: center; gap: 8px; margin-top: 3px; flex-wrap: wrap; }
        .deliv-assignee { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--ink-400); }
        .deliv-assignee-av { width: 16px; height: 16px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 600; color: #fff; }
        .deliv-due { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }
        .deliv-file-count { font-family: var(--mono); font-size: 10px; color: var(--ink-300); display: flex; align-items: center; gap: 3px; }
        .deliv-comment-count { font-family: var(--mono); font-size: 10px; color: var(--ink-300); display: flex; align-items: center; gap: 3px; }

        .deliv-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .deliv-approval-dots { display: flex; gap: 3px; }
        .deliv-approval-dot {
          width: 18px; height: 18px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 600; border: 1.5px solid;
        }
        .deliv-approval-dot.approved { background: rgba(90,154,60,0.08); border-color: rgba(90,154,60,0.2); color: #5a9a3c; }
        .deliv-approval-dot.pending { background: var(--warm-50); border-color: var(--warm-200); color: var(--ink-300); }
        .deliv-expand-arrow { font-size: 10px; color: var(--ink-300); transition: transform 0.15s; }

        /* Status dropdown */
        .deliv-status-menu {
          position: absolute; top: calc(100% + 4px); left: 0;
          background: #fff; border-radius: 8px; width: 180px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04);
          padding: 4px; z-index: 50;
        }
        .deliv-status-option {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 10px; border-radius: 5px; cursor: pointer;
          font-size: 13px; transition: background 0.06s;
        }
        .deliv-status-option:hover { background: var(--ember-bg); }
        .deliv-status-option-icon { font-size: 14px; width: 18px; text-align: center; }

        /* ── Expanded content ── */
        .deliv-expanded {
          border-top: 1px solid var(--warm-100);
          animation: expandIn 0.2s ease;
        }
        @keyframes expandIn { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 2000px; } }

        .deliv-desc {
          padding: 14px 18px; font-size: 14px; color: var(--ink-500);
          line-height: 1.6; border-bottom: 1px solid var(--warm-100);
          background: var(--warm-50);
        }

        /* Tabs */
        .deliv-tabs {
          display: flex; gap: 0; border-bottom: 1px solid var(--warm-100);
        }
        .deliv-tab {
          padding: 10px 18px; font-size: 12.5px; cursor: pointer;
          border: none; background: none; font-family: inherit;
          color: var(--ink-400); transition: all 0.08s;
          border-bottom: 2px solid transparent; display: flex;
          align-items: center; gap: 5px;
        }
        .deliv-tab:hover { color: var(--ink-600); background: var(--warm-50); }
        .deliv-tab.on { color: var(--ink-800); font-weight: 500; border-bottom-color: var(--ember); }
        .deliv-tab-count { font-family: var(--mono); font-size: 9px; color: var(--ink-300); background: var(--warm-100); padding: 0 5px; border-radius: 8px; }

        .deliv-panel { padding: 14px 18px; }

        /* ── Files tab ── */
        .deliv-files { display: flex; flex-direction: column; gap: 6px; }
        .deliv-file {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 14px; border: 1px solid var(--warm-200);
          border-radius: 8px; transition: all 0.08s; cursor: pointer;
        }
        .deliv-file:hover { border-color: var(--warm-300); background: var(--warm-50); }
        .deliv-file-icon {
          width: 36px; height: 36px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--mono); font-size: 10px; font-weight: 700;
          color: #fff; flex-shrink: 0;
        }
        .deliv-file-info { flex: 1; min-width: 0; }
        .deliv-file-name { font-size: 14px; font-weight: 500; color: var(--ink-800); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .deliv-file-meta { font-family: var(--mono); font-size: 10px; color: var(--ink-400); margin-top: 1px; display: flex; gap: 8px; }
        .deliv-file-actions { display: flex; gap: 4px; flex-shrink: 0; }
        .deliv-file-act {
          width: 28px; height: 28px; border-radius: 5px; border: 1px solid var(--warm-200);
          background: #fff; cursor: pointer; color: var(--ink-400);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; transition: all 0.06s;
        }
        .deliv-file-act:hover { background: var(--warm-100); color: var(--ink-600); }

        /* Upload zone */
        .deliv-upload-zone {
          border: 2px dashed var(--warm-300); border-radius: 8px;
          padding: 24px; text-align: center; cursor: pointer;
          transition: all 0.12s; margin-top: 8px;
        }
        .deliv-upload-zone:hover { border-color: var(--ember); background: var(--ember-bg); }
        .deliv-upload-zone.drag-over { border-color: var(--ember); background: rgba(176,125,79,0.06); transform: scale(1.01); }
        .deliv-upload-icon { font-size: 24px; color: var(--warm-400); margin-bottom: 6px; }
        .deliv-upload-text { font-size: 13px; color: var(--ink-500); }
        .deliv-upload-hint { font-family: var(--mono); font-size: 10px; color: var(--ink-300); margin-top: 4px; }
        .deliv-upload-btn {
          margin-top: 10px; padding: 7px 20px; border-radius: 6px;
          border: none; background: var(--ember); color: #fff;
          font-size: 13px; font-weight: 500; font-family: inherit;
          cursor: pointer; transition: background 0.1s;
        }
        .deliv-upload-btn:hover { background: var(--ember-light); }

        /* ── Comments tab ── */
        .deliv-comments { display: flex; flex-direction: column; gap: 0; }
        .deliv-comment {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 0; border-bottom: 1px solid var(--warm-100);
        }
        .deliv-comment:last-child { border-bottom: none; }
        .deliv-comment-av {
          width: 28px; height: 28px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .deliv-comment-body { flex: 1; }
        .deliv-comment-head { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
        .deliv-comment-author { font-size: 13px; font-weight: 500; color: var(--ink-700); }
        .deliv-comment-time { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }
        .deliv-comment-text { font-size: 14px; color: var(--ink-600); line-height: 1.6; }

        .deliv-comment-input {
          display: flex; gap: 10px; align-items: flex-start;
          padding-top: 12px; border-top: 1px solid var(--warm-100); margin-top: 8px;
        }
        .deliv-comment-input-av {
          width: 28px; height: 28px; border-radius: 6px;
          background: var(--ember); display: flex; align-items: center;
          justify-content: center; font-size: 11px; font-weight: 600;
          color: #fff; flex-shrink: 0; margin-top: 2px;
        }
        .deliv-comment-input-wrap { flex: 1; }
        .deliv-comment-textarea {
          width: 100%; padding: 10px 12px; border: 1px solid var(--warm-200);
          border-radius: 8px; font-family: inherit; font-size: 14px;
          color: var(--ink-700); outline: none; resize: none;
          min-height: 40px; line-height: 1.5;
        }
        .deliv-comment-textarea:focus { border-color: var(--ember); box-shadow: 0 0 0 3px rgba(176,125,79,0.06); }
        .deliv-comment-textarea::placeholder { color: var(--warm-400); }
        .deliv-comment-input-actions { display: flex; gap: 6px; margin-top: 8px; justify-content: flex-end; }
        .deliv-comment-send {
          padding: 6px 16px; border-radius: 5px; border: none;
          background: var(--ember); color: #fff; font-size: 12px;
          font-weight: 500; font-family: inherit; cursor: pointer;
        }
        .deliv-comment-send:hover { background: var(--ember-light); }

        /* ── Approvals tab ── */
        .deliv-approvals { display: flex; flex-direction: column; gap: 8px; }
        .deliv-approval-row {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 14px; border: 1px solid var(--warm-200);
          border-radius: 8px;
        }
        .deliv-approval-av {
          width: 32px; height: 32px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .deliv-approval-info { flex: 1; }
        .deliv-approval-name { font-size: 14px; font-weight: 500; color: var(--ink-700); }
        .deliv-approval-time { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }
        .deliv-approval-status {
          font-family: var(--mono); font-size: 10px; font-weight: 500;
          padding: 3px 10px; border-radius: 4px; flex-shrink: 0;
        }
        .deliv-approval-status.approved { background: rgba(90,154,60,0.06); color: #5a9a3c; border: 1px solid rgba(90,154,60,0.12); }
        .deliv-approval-status.pending { background: var(--warm-50); color: var(--ink-400); border: 1px solid var(--warm-200); }

        .deliv-approve-btn {
          width: 100%; padding: 10px; border-radius: 6px; border: none;
          background: #5a9a3c; color: #fff; font-size: 14px;
          font-weight: 500; font-family: inherit; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          margin-top: 8px; transition: background 0.1s;
        }
        .deliv-approve-btn:hover { background: #4e8a33; }

        /* ── Activity tab ── */
        .deliv-activity { display: flex; flex-direction: column; gap: 0; }
        .deliv-act-item {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 0; border-bottom: 1px solid var(--warm-100);
          font-size: 13px; color: var(--ink-500);
        }
        .deliv-act-item:last-child { border-bottom: none; }
        .deliv-act-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--warm-300); flex-shrink: 0; }
        .deliv-act-time { font-family: var(--mono); font-size: 10px; color: var(--ink-300); margin-left: auto; flex-shrink: 0; }

        .deliv-empty { padding: 24px; text-align: center; color: var(--ink-300); font-size: 13px; }
      `}</style>

      <div className="db-page">
        <div className="db-canvas">
          <h1 className="db-h1">Brand Guidelines v2</h1>
          <div className="db-meta">
            <span>Meridian Studio</span>
            <span>·</span>
            <span className="db-status-badge" style={{ background: "rgba(90,154,60,0.06)", color: "#5a9a3c" }}>ACTIVE</span>
            <span>·</span>
            <span>Due Apr 3</span>
            <span>·</span>
            <span>$2,400</span>
          </div>

          {/* Progress */}
          <div className="db-progress">
            <div className="db-progress-head">
              <span className="db-progress-label">Deliverable progress</span>
              <span className="db-progress-pct">{approvedCount}/{totalDeliverables} approved · {progressPct}%</span>
            </div>
            <div className="db-progress-bar">
              {deliverables.map(d => {
                const cfg = STATUS_CONFIG[d.status];
                return <div key={d.id} className="db-progress-seg" style={{ width: `${100 / totalDeliverables}%`, background: cfg.color, opacity: d.status === "todo" ? 0.2 : 0.7 }} />;
              })}
            </div>
          </div>

          <p className="db-p">Each deliverable below is a living task — upload files, get feedback, request approval. When all items are approved, the project is complete.</p>

          <h2 className="db-h2">Deliverables</h2>

          {/* ── Deliverable blocks ── */}
          {deliverables.map((d, di) => {
            const cfg = STATUS_CONFIG[d.status];
            const isExpanded = expandedId === d.id;
            const assignee = getUser(d.assignee);
            const tab = getTab(d.id);

            return (
              <div key={d.id} className={`deliv${isExpanded ? " expanded" : ""} status-${d.status}`}>
                {/* Collapsed row */}
                <div className="deliv-row" onClick={() => toggleExpand(d.id)}>
                  <div className="deliv-status-icon" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}20` }}
                    onClick={e => { e.stopPropagation(); setShowStatusMenu(showStatusMenu === d.id ? null : d.id); }}>
                    {cfg.icon}
                    {showStatusMenu === d.id && (
                      <div className="deliv-status-menu" onClick={e => e.stopPropagation()}>
                        {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                          <div key={key} className="deliv-status-option" onClick={() => updateStatus(d.id, key)}>
                            <span className="deliv-status-option-icon" style={{ color: val.color }}>{val.icon}</span>
                            <span style={{ color: val.color }}>{val.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="deliv-info">
                    <div className="deliv-title">{d.title}</div>
                    <div className="deliv-subtitle">
                      <span className="deliv-assignee">
                        <span className="deliv-assignee-av" style={{ background: assignee.color }}>{assignee.avatar}</span>
                        {assignee.short}
                      </span>
                      <span className="deliv-due">Due {d.dueDate}</span>
                      {d.files.length > 0 && <span className="deliv-file-count">📎 {d.files.length}</span>}
                      {d.comments.length > 0 && <span className="deliv-comment-count">💬 {d.comments.length}</span>}
                    </div>
                  </div>

                  <div className="deliv-right">
                    {d.approvals.length > 0 && (
                      <div className="deliv-approval-dots">
                        {d.approvals.map((a, ai) => {
                          const u = getUser(a.user);
                          return (
                            <div key={ai} className={`deliv-approval-dot ${a.status}`} title={`${u.name}: ${a.status}`}>
                              {a.status === "approved" ? "✓" : "·"}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <span className="deliv-expand-arrow" style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="deliv-expanded">
                    <div className="deliv-desc">{d.description}</div>

                    <div className="deliv-tabs">
                      <button className={`deliv-tab${tab === "files" ? " on" : ""}`} onClick={() => setTab(d.id, "files")}>
                        Files <span className="deliv-tab-count">{d.files.length}</span>
                      </button>
                      <button className={`deliv-tab${tab === "comments" ? " on" : ""}`} onClick={() => setTab(d.id, "comments")}>
                        Discussion <span className="deliv-tab-count">{d.comments.length}</span>
                      </button>
                      <button className={`deliv-tab${tab === "approvals" ? " on" : ""}`} onClick={() => setTab(d.id, "approvals")}>
                        Approvals <span className="deliv-tab-count">{d.approvals.filter(a => a.status === "approved").length}/{d.approvals.length}</span>
                      </button>
                      <button className={`deliv-tab${tab === "activity" ? " on" : ""}`} onClick={() => setTab(d.id, "activity")}>
                        Activity
                      </button>
                    </div>

                    <div className="deliv-panel">
                      {/* FILES */}
                      {tab === "files" && (
                        <>
                          <div className="deliv-files">
                            {d.files.map(f => {
                              const fi = getFileIcon(f.name);
                              return (
                                <div key={f.id} className="deliv-file">
                                  <div className="deliv-file-icon" style={{ background: fi.color }}>{fi.icon}</div>
                                  <div className="deliv-file-info">
                                    <div className="deliv-file-name">{f.name}</div>
                                    <div className="deliv-file-meta">
                                      <span>{f.size}</span>
                                      <span>{getUser(f.uploadedBy).short}</span>
                                      <span>{f.uploadedAt}</span>
                                    </div>
                                  </div>
                                  <div className="deliv-file-actions">
                                    <button className="deliv-file-act" title="Download">↓</button>
                                    <button className="deliv-file-act" title="Preview">◎</button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="deliv-upload-zone"
                            onDragOver={e => { e.preventDefault(); setDragFile(d.id); }}
                            onDragLeave={() => setDragFile(null)}
                            onDrop={e => { e.preventDefault(); simulateUpload(d.id); }}
                            onClick={() => simulateUpload(d.id)}
                            style={dragFile === d.id ? { borderColor: "var(--ember)", background: "rgba(176,125,79,0.06)" } : {}}>
                            <div className="deliv-upload-icon">↑</div>
                            <div className="deliv-upload-text">Drop files here or click to upload</div>
                            <div className="deliv-upload-hint">PDF, Figma, Sketch, PNG, JPG — up to 25MB</div>
                          </div>
                        </>
                      )}

                      {/* COMMENTS */}
                      {tab === "comments" && (
                        <>
                          {d.comments.length > 0 ? (
                            <div className="deliv-comments">
                              {d.comments.map(c => {
                                const u = getUser(c.user);
                                return (
                                  <div key={c.id} className="deliv-comment">
                                    <div className="deliv-comment-av" style={{ background: u.color }}>{u.avatar}</div>
                                    <div className="deliv-comment-body">
                                      <div className="deliv-comment-head">
                                        <span className="deliv-comment-author">{u.name}</span>
                                        <span className="deliv-comment-time">{c.time}</span>
                                      </div>
                                      <div className="deliv-comment-text">{c.text}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="deliv-empty">No comments yet — start the conversation</div>
                          )}

                          <div className="deliv-comment-input">
                            <div className="deliv-comment-input-av">A</div>
                            <div className="deliv-comment-input-wrap">
                              <textarea className="deliv-comment-textarea" placeholder="Add a comment about this deliverable..."
                                rows={2} value={commentText[d.id] || ""}
                                onChange={e => setCommentText(prev => ({ ...prev, [d.id]: e.target.value }))}
                                onKeyDown={e => { if (e.key === "Enter" && e.metaKey) addComment(d.id); }} />
                              <div className="deliv-comment-input-actions">
                                <button className="deliv-comment-send" onClick={() => addComment(d.id)}>Comment</button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* APPROVALS */}
                      {tab === "approvals" && (
                        <div className="deliv-approvals">
                          {d.approvals.length > 0 ? d.approvals.map((a, ai) => {
                            const u = getUser(a.user);
                            return (
                              <div key={ai} className="deliv-approval-row">
                                <div className="deliv-approval-av" style={{ background: u.color }}>{u.avatar}</div>
                                <div className="deliv-approval-info">
                                  <div className="deliv-approval-name">{u.name}</div>
                                  {a.time && <div className="deliv-approval-time">{a.time}</div>}
                                </div>
                                <span className={`deliv-approval-status ${a.status}`}>
                                  {a.status === "approved" ? "✓ Approved" : "Pending"}
                                </span>
                              </div>
                            );
                          }) : (
                            <div className="deliv-empty">No approvals requested yet</div>
                          )}

                          {d.status === "review" && (
                            <button className="deliv-approve-btn" onClick={() => approve(d.id)}>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              Approve Deliverable
                            </button>
                          )}
                        </div>
                      )}

                      {/* ACTIVITY */}
                      {tab === "activity" && (
                        <div className="deliv-activity">
                          {d.activity.length > 0 ? d.activity.map((a, ai) => (
                            <div key={ai} className="deliv-act-item">
                              <span className="deliv-act-dot" />
                              <span>{a.text}</span>
                              <span className="deliv-act-time">{a.time}</span>
                            </div>
                          )) : (
                            <div className="deliv-empty">No activity yet</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
