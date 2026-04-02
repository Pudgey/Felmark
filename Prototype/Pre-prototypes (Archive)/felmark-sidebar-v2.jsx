import { useState, useRef, useEffect } from "react";

const uid = () => Math.random().toString(36).slice(2, 10);

const WORKSPACES = [
  { id: "w1", client: "Meridian Studio", avatar: "M", avatarBg: "#7c8594", revenue: 5150, open: true, pinned: true, lastActive: "2m ago", projects: [
    { id: "p1", name: "Brand Guidelines v2", status: "active", due: "Apr 3", daysLeft: 5, amount: 2400, progress: 65, pinned: true },
    { id: "p2", name: "Website Copy", status: "review", due: "Apr 8", daysLeft: 10, amount: 1800, progress: 40, pinned: false },
    { id: "p3", name: "Social Media Kit", status: "completed", due: "Mar 20", daysLeft: -9, amount: 950, progress: 100, pinned: false },
  ]},
  { id: "w2", client: "Nora Kim — Coach", avatar: "N", avatarBg: "#a08472", revenue: 4800, open: false, pinned: false, lastActive: "1h ago", projects: [
    { id: "p4", name: "Course Landing Page", status: "active", due: "Apr 12", daysLeft: 14, amount: 3200, progress: 25, pinned: false },
    { id: "p5", name: "Email Sequence (6x)", status: "paused", due: "Apr 20", daysLeft: 22, amount: 1600, progress: 10, pinned: false },
  ]},
  { id: "w3", client: "Bolt Fitness", avatar: "B", avatarBg: "#8a7e63", revenue: 4800, open: false, pinned: false, lastActive: "3h ago", projects: [
    { id: "p6", name: "App Onboarding UX", status: "overdue", due: "Mar 25", daysLeft: -4, amount: 4000, progress: 70, pinned: false },
    { id: "p7", name: "Monthly Blog Posts", status: "active", due: "Apr 1", daysLeft: 3, amount: 800, progress: 15, pinned: false },
  ]},
  { id: "w4", client: "Personal", avatar: "✦", avatarBg: "#5c5c53", revenue: 0, open: false, pinned: false, lastActive: "5h ago", projects: [
    { id: "p8", name: "Portfolio Updates", status: "active", due: "—", daysLeft: null, amount: 0, progress: 50, pinned: false },
    { id: "p9", name: "Invoice Template", status: "completed", due: "—", daysLeft: null, amount: 0, progress: 100, pinned: false },
  ]},
];

const ARCHIVED = [
  { id: "a1", name: "Meridian — Logo Design", workspace: "Meridian Studio", completedDate: "Feb 14" },
  { id: "a2", name: "Nora — Workshop Slides", workspace: "Nora Kim", completedDate: "Jan 28" },
  { id: "a3", name: "Bolt — Brand Audit", workspace: "Bolt Fitness", completedDate: "Jan 10" },
];

const STATUS = {
  active: { color: "#5a9a3c", label: "Active", bg: "rgba(90,154,60,0.08)" },
  review: { color: "#b07d4f", label: "Review", bg: "rgba(176,125,79,0.08)" },
  completed: { color: "#8993a1", label: "Done", bg: "rgba(137,147,161,0.08)" },
  paused: { color: "#9e9e93", label: "Paused", bg: "rgba(158,158,147,0.08)" },
  overdue: { color: "#c24b38", label: "Overdue", bg: "rgba(194,75,56,0.08)" },
};

const STATUSES = ["active", "review", "paused", "completed"];

// Mini sparkline data
const SPARK_DATA = [4200, 5800, 4900, 7200, 6100, 8400, 9200, 11200, 10100, 12800, 13500, 14800];

export default function FelmarkSidebar() {
  const [workspaces, setWorkspaces] = useState(WORKSPACES);
  const [activeProject, setActiveProject] = useState("p1");
  const [search, setSearch] = useState("");
  const [showArchive, setShowArchive] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [hoverWs, setHoverWs] = useState(null);
  const [hoverPj, setHoverPj] = useState(null);
  const [showAddWs, setShowAddWs] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [dragPj, setDragPj] = useState(null);
  const [dropPj, setDropPj] = useState(null);
  const [expandedStats, setExpandedStats] = useState(false);

  const totalRevenue = workspaces.reduce((s, w) => s + w.revenue, 0);
  const activeCount = workspaces.reduce((s, w) => s + w.projects.filter(p => p.status === "active").length, 0);
  const overdueCount = workspaces.reduce((s, w) => s + w.projects.filter(p => p.status === "overdue").length, 0);
  const totalProjects = workspaces.reduce((s, w) => s + w.projects.length, 0);
  const completedCount = workspaces.reduce((s, w) => s + w.projects.filter(p => p.status === "completed").length, 0);

  const toggleWs = (wid) => setWorkspaces(prev => prev.map(w => w.id === wid ? { ...w, open: !w.open } : w));
  const togglePin = (pid) => {
    setWorkspaces(prev => prev.map(w => ({
      ...w, projects: w.projects.map(p => p.id === pid ? { ...p, pinned: !p.pinned } : p)
    })));
  };
  const cycleStatus = (pid) => {
    setWorkspaces(prev => prev.map(w => ({
      ...w, projects: w.projects.map(p => {
        if (p.id !== pid) return p;
        const idx = STATUSES.indexOf(p.status);
        return { ...p, status: STATUSES[(idx + 1) % STATUSES.length] };
      })
    })));
  };
  const addWorkspace = () => {
    if (!newWsName.trim()) return;
    const colors = ["#6b7280", "#92400e", "#065f46", "#7c3aed", "#be185d"];
    setWorkspaces(prev => [...prev, {
      id: uid(), client: newWsName.trim(), avatar: newWsName.trim()[0].toUpperCase(),
      avatarBg: colors[Math.floor(Math.random() * colors.length)],
      revenue: 0, open: true, pinned: false, lastActive: "now",
      projects: []
    }]);
    setNewWsName("");
    setShowAddWs(false);
  };

  const getDueColor = (daysLeft) => {
    if (daysLeft === null) return "var(--ink-300)";
    if (daysLeft < 0) return "#c24b38";
    if (daysLeft <= 3) return "#c89360";
    if (daysLeft <= 7) return "#b07d4f";
    return "var(--ink-400)";
  };

  const getDueLabel = (daysLeft, due) => {
    if (daysLeft === null) return due;
    if (daysLeft < 0) return `${Math.abs(daysLeft)}d overdue`;
    if (daysLeft === 0) return "Today";
    if (daysLeft === 1) return "Tomorrow";
    if (daysLeft <= 7) return `${daysLeft}d left`;
    return due;
  };

  // Filtered workspaces
  const filtered = search
    ? workspaces.map(w => ({
        ...w,
        projects: w.projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
        open: true,
      })).filter(w => w.client.toLowerCase().includes(search.toLowerCase()) || w.projects.length > 0)
    : workspaces;

  // Pinned projects across all workspaces
  const pinnedProjects = workspaces.flatMap(w =>
    w.projects.filter(p => p.pinned).map(p => ({ ...p, wsName: w.client, wsColor: w.avatarBg }))
  );

  const sparkPoints = SPARK_DATA.map((v, i) => {
    const x = (i / (SPARK_DATA.length - 1)) * 100;
    const max = Math.max(...SPARK_DATA);
    const min = Math.min(...SPARK_DATA);
    const y = 100 - ((v - min) / (max - min)) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --parchment: #faf9f7; --warm-50: #f7f6f3; --warm-100: #f0eee9;
          --warm-200: #e5e2db; --warm-300: #d5d1c8; --warm-400: #b8b3a8;
          --ink-900: #2c2a25; --ink-800: #3d3a33; --ink-700: #4f4c44;
          --ink-600: #65625a; --ink-500: #7d7a72; --ink-400: #9b988f; --ink-300: #b5b2a9;
          --ember: #b07d4f; --ember-light: #c89360; --ember-bg: rgba(176,125,79,0.08);
          --mono: 'JetBrains Mono', monospace;
          --panel: #f2f1ed; --panel-hover: #eceae5; --panel-active: #e6e4de;
          --panel-border: rgba(0,0,0,0.05);
        }

        .sb {
          width: 280px; background: var(--panel); font-family: 'Outfit', sans-serif;
          font-size: 14px; color: var(--ink-700); display: flex; flex-direction: column;
          height: 100vh; border-right: 1px solid var(--panel-border);
          overflow: hidden;
        }

        /* ── Header ── */
        .sb-head {
          padding: 14px 14px 0; display: flex; align-items: center;
          justify-content: space-between; flex-shrink: 0;
        }
        .sb-title { font-family: var(--mono); font-size: 10px; font-weight: 500; color: var(--ink-400); letter-spacing: 0.12em; text-transform: uppercase; }
        .sb-head-actions { display: flex; gap: 2px; }
        .sb-icon-btn {
          width: 26px; height: 26px; border-radius: 5px; border: none;
          background: none; cursor: pointer; display: flex; align-items: center;
          justify-content: center; color: var(--ink-400); transition: all 0.08s;
        }
        .sb-icon-btn:hover { background: var(--panel-hover); color: var(--ink-600); }

        /* ── Stats ── */
        .stats-area { padding: 10px 12px 8px; flex-shrink: 0; }
        .stats-main { display: flex; gap: 6px; }
        .stat {
          flex: 1; background: var(--parchment); border: 1px solid var(--warm-200);
          border-radius: 8px; padding: 10px 10px 8px; cursor: pointer;
          transition: all 0.1s; position: relative; overflow: hidden;
        }
        .stat:hover { border-color: var(--warm-300); box-shadow: 0 1px 4px rgba(0,0,0,0.03); }
        .stat.highlight { border-color: rgba(194,75,56,0.2); }
        .stat-val { font-size: 17px; font-weight: 600; color: var(--ink-800); font-family: var(--mono); line-height: 1; }
        .stat-lab { font-family: var(--mono); font-size: 8.5px; color: var(--ink-400); margin-top: 3px; text-transform: uppercase; letter-spacing: 0.06em; }
        .stat-spark { position: absolute; bottom: 0; left: 0; right: 0; height: 20px; opacity: 0.4; }

        .stats-expanded {
          margin-top: 6px; display: flex; gap: 6px;
          overflow: hidden; transition: max-height 0.2s ease, opacity 0.2s ease;
        }
        .stat-mini {
          flex: 1; background: var(--parchment); border: 1px solid var(--warm-200);
          border-radius: 6px; padding: 6px 8px; text-align: center;
        }
        .stat-mini-val { font-family: var(--mono); font-size: 13px; font-weight: 500; color: var(--ink-700); }
        .stat-mini-lab { font-family: var(--mono); font-size: 8px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 1px; }

        .stats-toggle {
          display: flex; align-items: center; justify-content: center;
          padding: 2px 0; cursor: pointer; color: var(--ink-300);
          transition: color 0.08s;
        }
        .stats-toggle:hover { color: var(--ink-500); }

        /* ── Search ── */
        .sb-search {
          margin: 4px 12px 6px; padding: 7px 10px 7px 30px; border-radius: 6px;
          border: 1px solid var(--warm-200); background: var(--parchment);
          font-family: inherit; font-size: 12.5px; color: var(--ink-700);
          outline: none; width: calc(100% - 24px); position: relative;
        }
        .sb-search:focus { border-color: var(--ember); box-shadow: 0 0 0 2px rgba(176,125,79,0.06); }
        .sb-search::placeholder { color: var(--warm-400); }
        .sb-search-wrap { position: relative; flex-shrink: 0; }
        .sb-search-icon { position: absolute; left: 22px; top: 50%; transform: translateY(-50%); color: var(--ink-300); pointer-events: none; z-index: 1; }

        /* ── Pinned ── */
        .pinned-section { padding: 0 6px; flex-shrink: 0; }
        .section-label {
          font-family: var(--mono); font-size: 9px; font-weight: 500;
          color: var(--ink-400); letter-spacing: 0.1em; text-transform: uppercase;
          padding: 8px 8px 4px; display: flex; align-items: center; gap: 6px;
        }
        .section-label::after { content: ''; flex: 1; height: 1px; background: var(--warm-200); }

        .pinned-item {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 8px; margin: 1px 0; border-radius: 5px;
          cursor: pointer; transition: background 0.06s;
        }
        .pinned-item:hover { background: var(--panel-hover); }
        .pinned-item.on { background: var(--panel-active); }
        .pinned-dot { width: 3px; align-self: stretch; border-radius: 2px; flex-shrink: 0; }
        .pinned-info { flex: 1; min-width: 0; }
        .pinned-name { font-size: 12.5px; color: var(--ink-700); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pinned-ws { font-size: 10px; color: var(--ink-400); }
        .pinned-progress { width: 32px; height: 3px; background: var(--warm-200); border-radius: 2px; flex-shrink: 0; overflow: hidden; }
        .pinned-progress-fill { height: 100%; border-radius: 2px; }

        /* ── Scroll ── */
        .sb-scroll { flex: 1; overflow-y: auto; padding: 0 6px 8px; }
        .sb-scroll::-webkit-scrollbar { width: 3px; }
        .sb-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }

        /* ── Workspace header ── */
        .ws {
          margin-bottom: 2px;
        }
        .ws-head {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 8px; cursor: pointer; transition: background 0.06s;
          border-radius: 6px; position: relative;
        }
        .ws-head:hover { background: var(--panel-hover); }
        .ws-head:hover .ws-actions { opacity: 1; }
        .ws-avatar {
          width: 24px; height: 24px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .ws-info { flex: 1; min-width: 0; }
        .ws-name { font-size: 13.5px; font-weight: 500; color: var(--ink-800); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ws-meta { display: flex; align-items: center; gap: 6px; margin-top: 1px; }
        .ws-revenue { font-family: var(--mono); font-size: 10px; color: var(--ink-400); }
        .ws-last-active { font-family: var(--mono); font-size: 9px; color: var(--ink-300); }
        .ws-count {
          font-family: var(--mono); font-size: 10px; color: var(--ink-400);
          background: var(--warm-200); min-width: 20px; height: 18px;
          border-radius: 9px; display: flex; align-items: center;
          justify-content: center; padding: 0 5px; flex-shrink: 0;
        }
        .ws-arrow {
          color: var(--ink-400); flex-shrink: 0; transition: transform 0.15s;
          font-size: 9px; width: 16px; text-align: center;
        }
        .ws-actions {
          display: flex; gap: 1px; opacity: 0; transition: opacity 0.1s;
          position: absolute; right: 32px;
        }
        .ws-act-btn {
          width: 22px; height: 22px; border-radius: 4px; border: none;
          background: var(--panel-hover); cursor: pointer; display: flex;
          align-items: center; justify-content: center; color: var(--ink-400);
          transition: all 0.06s; font-size: 11px;
        }
        .ws-act-btn:hover { background: var(--warm-200); color: var(--ink-600); }

        /* ── Project items ── */
        .pj {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 8px 6px 40px; cursor: pointer;
          transition: background 0.06s; border-radius: 5px;
          position: relative; margin: 1px 0;
        }
        .pj:hover { background: var(--panel-hover); }
        .pj:hover .pj-actions { opacity: 1; }
        .pj.on { background: var(--panel-active); }
        .pj.on .pj-name { font-weight: 500; color: var(--ink-900); }
        .pj.dragging { opacity: 0.4; }
        .pj.drop-target::before {
          content: ''; position: absolute; top: -1px; left: 40px; right: 8px;
          height: 2px; background: var(--ember); border-radius: 2px;
        }

        .pj-status-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
          cursor: pointer; transition: transform 0.1s; position: relative;
        }
        .pj-status-dot:hover { transform: scale(1.3); }
        .pj-status-ring {
          position: absolute; inset: -3px; border-radius: 50%;
          border: 1.5px solid transparent; transition: border-color 0.1s;
        }
        .pj-status-dot:hover .pj-status-ring { border-color: currentColor; opacity: 0.3; }

        .pj-content { flex: 1; min-width: 0; }
        .pj-name { font-size: 13px; color: var(--ink-700); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pj-bottom { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
        .pj-due { font-family: var(--mono); font-size: 10px; flex-shrink: 0; }
        .pj-amount { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }
        .pj-progress-bar { flex: 1; height: 2px; background: var(--warm-200); border-radius: 1px; overflow: hidden; min-width: 20px; }
        .pj-progress-fill { height: 100%; border-radius: 1px; transition: width 0.3s ease; }
        .pj-progress-pct { font-family: var(--mono); font-size: 9px; color: var(--ink-300); flex-shrink: 0; min-width: 24px; text-align: right; }

        .pj-actions {
          display: flex; gap: 1px; opacity: 0; transition: opacity 0.1s;
          flex-shrink: 0;
        }
        .pj-act-btn {
          width: 20px; height: 20px; border-radius: 3px; border: none;
          background: none; cursor: pointer; display: flex;
          align-items: center; justify-content: center; color: var(--ink-300);
          transition: all 0.06s; font-size: 10px;
        }
        .pj-act-btn:hover { background: var(--warm-200); color: var(--ink-600); }
        .pj-pin { color: var(--ember); }

        /* ── Add workspace ── */
        .add-ws-row {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 8px; margin: 2px 0; border-radius: 5px;
          cursor: pointer; color: var(--ink-400); transition: all 0.06s;
        }
        .add-ws-row:hover { background: var(--panel-hover); color: var(--ink-600); }
        .add-ws-input-row {
          display: flex; align-items: center; gap: 6px;
          padding: 4px 8px; margin: 2px 0;
        }
        .add-ws-input {
          flex: 1; padding: 5px 8px; border: 1px solid var(--ember);
          border-radius: 4px; font-family: inherit; font-size: 12.5px;
          color: var(--ink-800); outline: none; background: var(--parchment);
          box-shadow: 0 0 0 2px rgba(176,125,79,0.06);
        }
        .add-ws-confirm {
          width: 26px; height: 26px; border-radius: 4px; border: none;
          background: var(--ember); color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.08s;
        }
        .add-ws-confirm:hover { background: var(--ember-light); }
        .add-ws-cancel {
          width: 26px; height: 26px; border-radius: 4px; border: none;
          background: var(--warm-200); color: var(--ink-500); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── Archive ── */
        .archive-head {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 8px; cursor: pointer; margin-top: 4px;
          border-radius: 5px; transition: background 0.06s;
        }
        .archive-head:hover { background: var(--panel-hover); }
        .archive-icon { color: var(--ink-300); display: flex; flex-shrink: 0; }
        .archive-label { font-family: var(--mono); font-size: 10px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.08em; flex: 1; }
        .archive-count { font-family: var(--mono); font-size: 10px; color: var(--ink-300); background: var(--warm-200); padding: 1px 6px; border-radius: 8px; }

        .archive-item {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 8px 5px 32px; border-radius: 4px;
          transition: background 0.06s; cursor: default;
        }
        .archive-item:hover { background: var(--panel-hover); }
        .archive-item-name { font-size: 12px; color: var(--ink-400); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .archive-item-date { font-family: var(--mono); font-size: 9px; color: var(--ink-300); }

        /* ── Footer ── */
        .sb-footer {
          padding: 8px 14px; border-top: 1px solid var(--panel-border);
          display: flex; justify-content: space-between; align-items: center;
          font-family: var(--mono); font-size: 10px; color: var(--ink-400);
          flex-shrink: 0;
        }
        .sb-footer-status { display: flex; align-items: center; gap: 4px; }
        .sb-footer-dot { width: 5px; height: 5px; border-radius: 50%; }
      `}</style>

      <div className="sb">
        {/* ── Header ── */}
        <div className="sb-head">
          <span className="sb-title">workspaces</span>
          <div className="sb-head-actions">
            <button className="sb-icon-btn" title="Add workspace" onClick={() => setShowAddWs(true)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            <button className="sb-icon-btn" title="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="stats-area">
          <div className="stats-main">
            <div className="stat" onClick={() => setExpandedStats(!expandedStats)}>
              <div className="stat-val">${(totalRevenue / 1000).toFixed(1)}k</div>
              <div className="stat-lab">pipeline</div>
              <svg className="stat-spark" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline points={sparkPoints} fill="none" stroke="var(--ember)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <polyline points={`0,100 ${sparkPoints} 100,100`} fill="rgba(176,125,79,0.08)" stroke="none" />
              </svg>
            </div>
            <div className="stat">
              <div className="stat-val">{activeCount}</div>
              <div className="stat-lab">active</div>
            </div>
            <div className={`stat${overdueCount > 0 ? " highlight" : ""}`}>
              <div className="stat-val" style={{ color: overdueCount > 0 ? "#c24b38" : "var(--ink-800)" }}>{overdueCount}</div>
              <div className="stat-lab">overdue</div>
            </div>
          </div>

          {expandedStats && (
            <div className="stats-expanded">
              <div className="stat-mini"><div className="stat-mini-val">{totalProjects}</div><div className="stat-mini-lab">total</div></div>
              <div className="stat-mini"><div className="stat-mini-val">{completedCount}</div><div className="stat-mini-lab">done</div></div>
              <div className="stat-mini"><div className="stat-mini-val">{Math.round((completedCount / totalProjects) * 100)}%</div><div className="stat-mini-lab">rate</div></div>
            </div>
          )}

          <div className="stats-toggle" onClick={() => setExpandedStats(!expandedStats)}>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ transform: expandedStats ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>
              <path d="M1.5 2l4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="sb-search-wrap">
          <svg className="sb-search-icon" width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          <input className="sb-search" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* ── Pinned ── */}
        {pinnedProjects.length > 0 && !search && (
          <div className="pinned-section">
            <div className="section-label">pinned</div>
            {pinnedProjects.map(p => (
              <div key={p.id} className={`pinned-item${activeProject === p.id ? " on" : ""}`} onClick={() => setActiveProject(p.id)}>
                <div className="pinned-dot" style={{ background: p.wsColor }} />
                <div className="pinned-info">
                  <div className="pinned-name">{p.name}</div>
                  <div className="pinned-ws">{p.wsName}</div>
                </div>
                <div className="pinned-progress">
                  <div className="pinned-progress-fill" style={{ width: `${p.progress}%`, background: STATUS[p.status].color }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Workspace list ── */}
        <div className="sb-scroll">
          {!search && <div className="section-label">clients</div>}

          {filtered.map(ws => (
            <div key={ws.id} className="ws">
              <div className="ws-head"
                onMouseEnter={() => setHoverWs(ws.id)} onMouseLeave={() => setHoverWs(null)}
                onClick={() => toggleWs(ws.id)}>
                <div className="ws-avatar" style={{ background: ws.avatarBg }}>{ws.avatar}</div>
                <div className="ws-info">
                  <div className="ws-name">{ws.client}</div>
                  <div className="ws-meta">
                    {ws.revenue > 0 && <span className="ws-revenue">${(ws.revenue / 1000).toFixed(1)}k</span>}
                    <span className="ws-last-active">{ws.lastActive}</span>
                  </div>
                </div>
                {hoverWs === ws.id && (
                  <div className="ws-actions">
                    <button className="ws-act-btn" title="Add project" onClick={e => { e.stopPropagation(); }}>+</button>
                    <button className="ws-act-btn" title="Settings" onClick={e => { e.stopPropagation(); }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="2" cy="5" r="0.8" fill="currentColor"/><circle cx="5" cy="5" r="0.8" fill="currentColor"/><circle cx="8" cy="5" r="0.8" fill="currentColor"/></svg>
                    </button>
                  </div>
                )}
                <span className="ws-count">{ws.projects.length}</span>
                <span className="ws-arrow" style={{ transform: ws.open ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
              </div>

              {ws.open && ws.projects.map(pj => {
                const st = STATUS[pj.status];
                return (
                  <div key={pj.id}
                    className={`pj${activeProject === pj.id ? " on" : ""}${dragPj === pj.id ? " dragging" : ""}${dropPj === pj.id ? " drop-target" : ""}`}
                    onClick={() => setActiveProject(pj.id)}
                    onMouseEnter={() => setHoverPj(pj.id)} onMouseLeave={() => setHoverPj(null)}
                    draggable
                    onDragStart={() => setDragPj(pj.id)}
                    onDragEnd={() => { setDragPj(null); setDropPj(null); }}
                    onDragOver={e => { e.preventDefault(); if (dragPj && dragPj !== pj.id) setDropPj(pj.id); }}
                    onDrop={() => { setDragPj(null); setDropPj(null); }}>

                    <div className="pj-status-dot" style={{ color: st.color, background: st.color }}
                      onClick={e => { e.stopPropagation(); cycleStatus(pj.id); }}
                      title={`Click to change status (${st.label})`}>
                      <div className="pj-status-ring" />
                    </div>

                    <div className="pj-content">
                      <div className="pj-name">{pj.name}</div>
                      <div className="pj-bottom">
                        <span className="pj-due" style={{ color: getDueColor(pj.daysLeft) }}>
                          {getDueLabel(pj.daysLeft, pj.due)}
                        </span>
                        {pj.amount > 0 && <span className="pj-amount">${pj.amount.toLocaleString()}</span>}
                        <div className="pj-progress-bar">
                          <div className="pj-progress-fill" style={{ width: `${pj.progress}%`, background: st.color }} />
                        </div>
                        <span className="pj-progress-pct">{pj.progress}%</span>
                      </div>
                    </div>

                    {hoverPj === pj.id && (
                      <div className="pj-actions">
                        <button className={`pj-act-btn${pj.pinned ? " pj-pin" : ""}`} title={pj.pinned ? "Unpin" : "Pin"}
                          onClick={e => { e.stopPropagation(); togglePin(pj.id); }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M4 8L2 10M7 1.5l2 2-1.5 2-.5-.5L4 8l-1.5-1.5L5.5 3.5 5 3z" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill={pj.pinned ? "currentColor" : "none"}/></svg>
                        </button>
                        <button className="pj-act-btn" title="More" onClick={e => e.stopPropagation()}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="2" cy="5" r="0.8" fill="currentColor"/><circle cx="5" cy="5" r="0.8" fill="currentColor"/><circle cx="8" cy="5" r="0.8" fill="currentColor"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* ── Add workspace ── */}
          {!search && !showAddWs && (
            <div className="add-ws-row" onClick={() => setShowAddWs(true)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              <span style={{ fontSize: 12.5 }}>Add workspace</span>
            </div>
          )}
          {showAddWs && (
            <div className="add-ws-input-row">
              <input className="add-ws-input" placeholder="Client name..." value={newWsName} autoFocus
                onChange={e => setNewWsName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addWorkspace(); if (e.key === "Escape") setShowAddWs(false); }} />
              <button className="add-ws-confirm" onClick={addWorkspace}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="add-ws-cancel" onClick={() => setShowAddWs(false)}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
              </button>
            </div>
          )}

          {/* ── Archive ── */}
          {!search && (
            <>
              <div className="archive-head" onClick={() => setShowArchive(!showArchive)}>
                <span className="archive-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3" width="11" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M2.5 5.5v5.5a1 1 0 001 1h7a1 1 0 001-1V5.5" stroke="currentColor" strokeWidth="1.1"/><path d="M5.5 8h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                </span>
                <span className="archive-label">archive</span>
                <span className="archive-count">{ARCHIVED.length}</span>
                <span className="ws-arrow" style={{ transform: showArchive ? "rotate(90deg)" : "rotate(0deg)", color: "var(--ink-300)", fontSize: 9 }}>▶</span>
              </div>
              {showArchive && ARCHIVED.map(a => (
                <div key={a.id} className="archive-item">
                  <span style={{ color: "var(--ink-300)", fontSize: 11 }}>✓</span>
                  <span className="archive-item-name">{a.name}</span>
                  <span className="archive-item-date">{a.completedDate}</span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="sb-footer">
          <span>{totalProjects} projects · {workspaces.length} clients</span>
          <div className="sb-footer-status">
            <span className="sb-footer-dot" style={{ background: "#5a9a3c" }} />
            saved
          </div>
        </div>
      </div>
    </>
  );
}
