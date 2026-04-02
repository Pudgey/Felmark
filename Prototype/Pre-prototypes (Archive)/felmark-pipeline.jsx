import { useState, useRef } from "react";

const STAGES = [
  { id: "lead", label: "Lead", icon: "◇", color: "#5b7fa4", desc: "New opportunity" },
  { id: "proposed", label: "Proposed", icon: "◆", color: "#b07d4f", desc: "Sent proposal" },
  { id: "active", label: "Active", icon: "●", color: "#5a9a3c", desc: "Work in progress" },
  { id: "payment", label: "Awaiting Payment", icon: "$", color: "#8a7e63", desc: "Invoice sent" },
  { id: "completed", label: "Completed", icon: "✓", color: "#7c8594", desc: "Paid & delivered" },
];

const INITIAL_DEALS = [
  // Leads
  { id: "d1", stage: "lead", name: "E-commerce Rebrand", client: "Luna Boutique", contact: "maria@lunaboutique.co", value: 6500, probability: 40, daysInStage: 3, source: "Referral", notes: "Maria reached out via Instagram. Wants full rebrand by summer.", avatar: "L", avatarBg: "#7c6b9e" },
  { id: "d2", stage: "lead", name: "App UI Audit", client: "HealthTrack", contact: "dev@healthtrack.io", value: 3200, probability: 25, daysInStage: 7, source: "Cold outreach", notes: "Responded to my case study post on LinkedIn.", avatar: "H", avatarBg: "#5b7fa4" },
  { id: "d3", stage: "lead", name: "Newsletter Design", client: "The Daily Brief", contact: "editor@dailybrief.com", value: 1200, probability: 60, daysInStage: 1, source: "Inbound", notes: "Quick project. They want a Substack template.", avatar: "D", avatarBg: "#3d6b52" },

  // Proposed
  { id: "d4", stage: "proposed", name: "Course Landing Page", client: "Nora Kim", contact: "nora@coachkim.com", value: 3200, probability: 85, daysInStage: 2, source: "Existing client", notes: "Proposal sent. She's viewed it 3 times. Likely to sign.", avatar: "N", avatarBg: "#a08472", proposalViews: 3 },
  { id: "d5", stage: "proposed", name: "Brand Strategy Sprint", client: "Finch & Co", contact: "james@finchandco.com", value: 8000, probability: 50, daysInStage: 5, source: "Referral", notes: "Waiting on budget approval from their board.", avatar: "F", avatarBg: "#8b5c3a" },

  // Active
  { id: "d6", stage: "active", name: "Brand Guidelines v2", client: "Meridian Studio", contact: "sarah@meridianstudio.co", value: 2400, probability: 95, daysInStage: 12, progress: 65, dueIn: 5, avatar: "M", avatarBg: "#7c8594" },
  { id: "d7", stage: "active", name: "Website Copy", client: "Meridian Studio", contact: "sarah@meridianstudio.co", value: 1800, probability: 90, daysInStage: 8, progress: 40, dueIn: 10, avatar: "M", avatarBg: "#7c8594" },
  { id: "d8", stage: "active", name: "App Onboarding UX", client: "Bolt Fitness", contact: "team@boltfit.co", value: 4000, probability: 85, daysInStage: 18, progress: 70, dueIn: -4, avatar: "B", avatarBg: "#8a7e63", overdue: true },

  // Awaiting Payment
  { id: "d9", stage: "payment", name: "Invoice #047 — Brand deposit", client: "Meridian Studio", value: 2400, probability: 98, daysInStage: 1, invoiceDate: "Mar 29", avatar: "M", avatarBg: "#7c8594", invoiceViews: 2 },
  { id: "d10", stage: "payment", name: "Invoice #044 — Onboarding", client: "Bolt Fitness", value: 4000, probability: 80, daysInStage: 4, invoiceDate: "Mar 25", avatar: "B", avatarBg: "#8a7e63", overdue: true },

  // Completed
  { id: "d11", stage: "completed", name: "Social Media Kit", client: "Meridian Studio", value: 950, paidDate: "Mar 20", avatar: "M", avatarBg: "#7c8594" },
  { id: "d12", stage: "completed", name: "Retainer (March)", client: "Nora Kim", value: 1800, paidDate: "Mar 15", avatar: "N", avatarBg: "#a08472" },
  { id: "d13", stage: "completed", name: "Logo Refresh", client: "Meridian Studio", value: 3200, paidDate: "Dec 15", avatar: "M", avatarBg: "#7c8594" },
];

export default function Pipeline() {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [dragDeal, setDragDeal] = useState(null);
  const [dropStage, setDropStage] = useState(null);
  const [hoveredDeal, setHoveredDeal] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showAdd, setShowAdd] = useState(null);
  const [newDeal, setNewDeal] = useState({ name: "", client: "", value: "" });

  const moveDeal = (dealId, newStage) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage, daysInStage: 0 } : d));
  };

  const addDeal = (stage) => {
    if (!newDeal.name.trim()) return;
    setDeals(prev => [...prev, {
      id: `d${Date.now()}`, stage, name: newDeal.name, client: newDeal.client || "Unknown",
      value: parseInt(newDeal.value) || 0, probability: stage === "lead" ? 30 : 70,
      daysInStage: 0, avatar: (newDeal.client || "?")[0].toUpperCase(),
      avatarBg: ["#7c6b9e", "#5b7fa4", "#a08472", "#3d6b52", "#8b5c3a"][Math.floor(Math.random() * 5)],
    }]);
    setNewDeal({ name: "", client: "", value: "" });
    setShowAdd(null);
  };

  // Stats
  const stageValue = (stageId) => deals.filter(d => d.stage === stageId).reduce((s, d) => s + d.value, 0);
  const stageCount = (stageId) => deals.filter(d => d.stage === stageId).length;
  const totalPipeline = deals.filter(d => d.stage !== "completed").reduce((s, d) => s + d.value, 0);
  const weightedPipeline = deals.filter(d => d.stage !== "completed").reduce((s, d) => s + d.value * (d.probability || 50) / 100, 0);
  const completedTotal = deals.filter(d => d.stage === "completed").reduce((s, d) => s + d.value, 0);
  const conversionRate = deals.length > 0 ? Math.round((deals.filter(d => d.stage === "completed").length / deals.length) * 100) : 0;

  const selected = deals.find(d => d.id === selectedDeal);

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

        .pipe {
          font-family: 'Outfit', sans-serif; font-size: 14px;
          color: var(--ink-700); background: var(--warm-50);
          height: 100vh; display: flex; flex-direction: column;
        }

        /* ── Header ── */
        .pipe-header {
          padding: 14px 24px; border-bottom: 1px solid var(--warm-200);
          background: var(--parchment); flex-shrink: 0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .pipe-header-left { display: flex; align-items: center; gap: 16px; }
        .pipe-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: var(--ink-900); }
        .pipe-view-toggle { display: flex; border: 1px solid var(--warm-200); border-radius: 5px; overflow: hidden; }
        .pipe-vt {
          padding: 4px 12px; font-size: 11px; border: none; cursor: pointer;
          font-family: inherit; color: var(--ink-400); background: #fff; transition: all 0.08s;
        }
        .pipe-vt:not(:last-child) { border-right: 1px solid var(--warm-200); }
        .pipe-vt.on { background: var(--ink-900); color: var(--parchment); }

        .pipe-header-right { display: flex; align-items: center; gap: 8px; }
        .pipe-add-btn {
          display: flex; align-items: center; gap: 5px; padding: 6px 16px;
          border-radius: 5px; border: none; background: var(--ember);
          color: #fff; font-size: 13px; font-weight: 500; font-family: inherit;
          cursor: pointer; transition: background 0.1s;
        }
        .pipe-add-btn:hover { background: var(--ember-light); }

        /* ── Stats strip ── */
        .pipe-stats {
          display: flex; gap: 0; border-bottom: 1px solid var(--warm-200);
          background: var(--parchment); flex-shrink: 0;
        }
        .pipe-stat {
          flex: 1; padding: 12px 20px; border-right: 1px solid var(--warm-100);
          cursor: default; transition: background 0.06s;
        }
        .pipe-stat:last-child { border-right: none; }
        .pipe-stat:hover { background: var(--warm-50); }
        .pipe-stat-val { font-family: var(--mono); font-size: 18px; font-weight: 600; color: var(--ink-800); }
        .pipe-stat-val.green { color: #5a9a3c; }
        .pipe-stat-val.ember { color: var(--ember); }
        .pipe-stat-label { font-family: var(--mono); font-size: 9px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }

        /* ── Funnel bar ── */
        .pipe-funnel {
          display: flex; height: 4px; flex-shrink: 0;
        }
        .pipe-funnel-seg { transition: width 0.3s ease; min-width: 2px; }

        /* ── Board ── */
        .pipe-board {
          flex: 1; display: flex; gap: 0; overflow-x: auto;
        }
        .pipe-board::-webkit-scrollbar { height: 5px; }
        .pipe-board::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }

        /* ── Column ── */
        .pipe-col {
          flex: 1; min-width: 240px; display: flex; flex-direction: column;
          border-right: 1px solid var(--warm-100);
          transition: background 0.12s;
        }
        .pipe-col:last-child { border-right: none; }
        .pipe-col.drop-target { background: rgba(176,125,79,0.02); }

        .pipe-col-head {
          padding: 12px 14px; display: flex; align-items: center;
          justify-content: space-between; flex-shrink: 0;
          border-bottom: 1px solid var(--warm-100);
          position: sticky; top: 0; background: var(--warm-50); z-index: 5;
        }
        .pipe-col-title-row { display: flex; align-items: center; gap: 8px; }
        .pipe-col-icon { font-size: 12px; }
        .pipe-col-name { font-size: 13px; font-weight: 500; color: var(--ink-800); }
        .pipe-col-count {
          font-family: var(--mono); font-size: 10px; color: var(--ink-300);
          background: var(--warm-100); min-width: 18px; height: 18px;
          border-radius: 9px; display: flex; align-items: center;
          justify-content: center; padding: 0 5px;
        }
        .pipe-col-val {
          font-family: var(--mono); font-size: 11px; font-weight: 500;
        }

        .pipe-col-body {
          flex: 1; overflow-y: auto; padding: 8px 8px 60px;
          display: flex; flex-direction: column; gap: 6px;
        }
        .pipe-col-body::-webkit-scrollbar { width: 3px; }
        .pipe-col-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }

        /* ── Deal card ── */
        .deal {
          background: var(--parchment); border: 1px solid var(--warm-200);
          border-radius: 8px; padding: 12px 14px; cursor: grab;
          transition: all 0.12s; position: relative; overflow: hidden;
        }
        .deal:hover { border-color: var(--warm-300); box-shadow: 0 2px 10px rgba(0,0,0,0.03); transform: translateY(-1px); }
        .deal:active { cursor: grabbing; }
        .deal.dragging { opacity: 0.4; transform: scale(0.95); }
        .deal.hovered { border-color: var(--ember); box-shadow: 0 2px 12px rgba(176,125,79,0.06); }
        .deal.overdue-card { border-left: 3px solid #c24b38; }

        .deal-accent { position: absolute; top: 0; left: 0; right: 0; height: 2px; }

        .deal-top { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; }
        .deal-avatar {
          width: 28px; height: 28px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .deal-info { flex: 1; min-width: 0; }
        .deal-name { font-size: 13.5px; font-weight: 500; color: var(--ink-800); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .deal-client { font-size: 12px; color: var(--ink-400); margin-top: 1px; }

        .deal-value { font-family: var(--mono); font-size: 14px; font-weight: 600; color: var(--ink-800); flex-shrink: 0; }

        .deal-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .deal-tag {
          font-family: var(--mono); font-size: 9px; padding: 1px 6px;
          border-radius: 3px; display: flex; align-items: center; gap: 3px;
        }
        .deal-prob { background: var(--warm-100); color: var(--ink-400); }
        .deal-days { color: var(--ink-300); }
        .deal-overdue { background: rgba(194,75,56,0.06); color: #c24b38; }
        .deal-views { background: rgba(176,125,79,0.06); color: var(--ember); }

        /* Progress mini-bar */
        .deal-progress { height: 3px; background: var(--warm-200); border-radius: 2px; margin-top: 8px; overflow: hidden; }
        .deal-progress-fill { height: 100%; border-radius: 2px; transition: width 0.3s ease; }

        /* Due badge */
        .deal-due {
          font-family: var(--mono); font-size: 10px; font-weight: 500;
          display: flex; align-items: center; gap: 3px;
        }

        /* ── Add deal inline ── */
        .deal-add-btn {
          display: flex; align-items: center; justify-content: center; gap: 5px;
          padding: 8px; border: 1px dashed var(--warm-300); border-radius: 6px;
          cursor: pointer; font-size: 12px; color: var(--ink-400);
          transition: all 0.08s; background: none; width: 100%;
          font-family: inherit;
        }
        .deal-add-btn:hover { border-color: var(--ember); color: var(--ember); background: var(--ember-bg); }

        .deal-add-form {
          background: var(--parchment); border: 1px solid var(--ember);
          border-radius: 8px; padding: 12px; display: flex; flex-direction: column;
          gap: 8px; box-shadow: 0 2px 12px rgba(176,125,79,0.06);
        }
        .deal-add-input {
          padding: 7px 10px; border: 1px solid var(--warm-200); border-radius: 5px;
          font-family: inherit; font-size: 13px; color: var(--ink-800);
          outline: none; background: #fff;
        }
        .deal-add-input:focus { border-color: var(--ember); }
        .deal-add-input::placeholder { color: var(--warm-400); }
        .deal-add-actions { display: flex; gap: 6px; }
        .deal-add-save {
          flex: 1; padding: 6px; border-radius: 5px; border: none;
          background: var(--ember); color: #fff; font-size: 12px;
          font-family: inherit; cursor: pointer; font-weight: 500;
        }
        .deal-add-cancel {
          padding: 6px 12px; border-radius: 5px;
          border: 1px solid var(--warm-200); background: #fff;
          color: var(--ink-500); font-size: 12px; cursor: pointer; font-family: inherit;
        }

        /* ── Detail panel ── */
        .deal-detail {
          position: fixed; top: 0; right: 0; bottom: 0; width: 360px;
          background: var(--parchment); border-left: 1px solid var(--warm-200);
          box-shadow: -8px 0 32px rgba(0,0,0,0.06); z-index: 50;
          display: flex; flex-direction: column;
          animation: slideIn 0.2s ease;
        }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

        .dd-head {
          padding: 20px 24px 16px; border-bottom: 1px solid var(--warm-200);
          display: flex; align-items: flex-start; gap: 14px;
        }
        .dd-avatar {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .dd-info { flex: 1; }
        .dd-name { font-size: 17px; font-weight: 600; color: var(--ink-900); }
        .dd-client { font-size: 13px; color: var(--ink-400); margin-top: 2px; }
        .dd-close {
          width: 28px; height: 28px; border-radius: 6px; border: none;
          background: none; cursor: pointer; color: var(--ink-300);
          display: flex; align-items: center; justify-content: center;
        }
        .dd-close:hover { background: var(--warm-100); color: var(--ink-600); }

        .dd-body { flex: 1; overflow-y: auto; padding: 16px 24px; }
        .dd-body::-webkit-scrollbar { width: 3px; }
        .dd-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }

        .dd-section { font-family: var(--mono); font-size: 9px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.1em; margin: 16px 0 8px; display: flex; align-items: center; gap: 8px; }
        .dd-section::after { content: ''; flex: 1; height: 1px; background: var(--warm-200); }

        .dd-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 6px 0; border-bottom: 1px solid var(--warm-100);
        }
        .dd-row:last-child { border-bottom: none; }
        .dd-label { font-size: 13px; color: var(--ink-400); }
        .dd-val { font-family: var(--mono); font-size: 13px; color: var(--ink-700); font-weight: 500; }
        .dd-val.green { color: #5a9a3c; }
        .dd-val.ember { color: var(--ember); }
        .dd-val.red { color: #c24b38; }

        .dd-stage-selector {
          display: flex; gap: 3px; margin: 12px 0;
        }
        .dd-stage-btn {
          flex: 1; padding: 6px 4px; border-radius: 4px;
          border: 1px solid var(--warm-200); background: #fff;
          cursor: pointer; text-align: center; font-size: 10px;
          font-family: var(--mono); color: var(--ink-400);
          transition: all 0.08s;
        }
        .dd-stage-btn:hover { border-color: var(--warm-300); }
        .dd-stage-btn.on { border-color: var(--ember); background: var(--ember-bg); color: var(--ember); font-weight: 500; }

        .dd-notes {
          width: 100%; min-height: 64px; padding: 10px 12px;
          border: 1px solid var(--warm-200); border-radius: 6px;
          font-family: inherit; font-size: 13px; color: var(--ink-600);
          outline: none; resize: none; background: #fff; line-height: 1.5;
        }
        .dd-notes:focus { border-color: var(--ember); }

        .dd-actions {
          padding: 14px 24px; border-top: 1px solid var(--warm-200);
          display: flex; gap: 8px; flex-shrink: 0;
        }
        .dd-btn {
          flex: 1; padding: 9px; border-radius: 6px; font-size: 13px;
          font-weight: 500; font-family: inherit; cursor: pointer; text-align: center;
        }
        .dd-btn-primary { background: var(--ember); border: none; color: #fff; }
        .dd-btn-primary:hover { background: var(--ember-light); }
        .dd-btn-ghost { background: none; border: 1px solid var(--warm-200); color: var(--ink-600); }
        .dd-btn-ghost:hover { background: var(--warm-50); }
        .dd-btn-danger { background: none; border: 1px solid rgba(194,75,56,0.15); color: #c24b38; }
        .dd-btn-danger:hover { background: rgba(194,75,56,0.04); }

        /* ── Overlay ── */
        .deal-overlay {
          position: fixed; inset: 0; z-index: 49; background: rgba(44,42,37,0.15);
          backdrop-filter: blur(1px);
        }
      `}</style>

      <div className="pipe">
        {/* ── Header ── */}
        <div className="pipe-header">
          <div className="pipe-header-left">
            <span className="pipe-title">Pipeline</span>
            <div className="pipe-view-toggle">
              <button className="pipe-vt on">Board</button>
              <button className="pipe-vt">List</button>
              <button className="pipe-vt">Funnel</button>
            </div>
          </div>
          <div className="pipe-header-right">
            <button className="pipe-add-btn" onClick={() => setShowAdd("lead")}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              New Deal
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="pipe-stats">
          <div className="pipe-stat">
            <div className="pipe-stat-val ember">${(totalPipeline / 1000).toFixed(1)}k</div>
            <div className="pipe-stat-label">total pipeline</div>
          </div>
          <div className="pipe-stat">
            <div className="pipe-stat-val">${(weightedPipeline / 1000).toFixed(1)}k</div>
            <div className="pipe-stat-label">weighted value</div>
          </div>
          <div className="pipe-stat">
            <div className="pipe-stat-val green">${(completedTotal / 1000).toFixed(1)}k</div>
            <div className="pipe-stat-label">won this period</div>
          </div>
          <div className="pipe-stat">
            <div className="pipe-stat-val">{deals.filter(d => d.stage !== "completed").length}</div>
            <div className="pipe-stat-label">open deals</div>
          </div>
          <div className="pipe-stat">
            <div className="pipe-stat-val">{conversionRate}%</div>
            <div className="pipe-stat-label">conversion rate</div>
          </div>
        </div>

        {/* ── Funnel ── */}
        <div className="pipe-funnel">
          {STAGES.map(s => {
            const val = stageValue(s.id);
            const pct = totalPipeline + completedTotal > 0 ? (val / (totalPipeline + completedTotal)) * 100 : 20;
            return <div key={s.id} className="pipe-funnel-seg" style={{ width: `${Math.max(pct, 2)}%`, background: s.color }} />;
          })}
        </div>

        {/* ── Board ── */}
        <div className="pipe-board">
          {STAGES.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage.id);
            const val = stageValue(stage.id);

            return (
              <div key={stage.id}
                className={`pipe-col${dropStage === stage.id ? " drop-target" : ""}`}
                onDragOver={e => { e.preventDefault(); if (dragDeal) setDropStage(stage.id); }}
                onDragLeave={() => setDropStage(null)}
                onDrop={() => { if (dragDeal) { moveDeal(dragDeal, stage.id); setDragDeal(null); setDropStage(null); } }}>

                <div className="pipe-col-head">
                  <div className="pipe-col-title-row">
                    <span className="pipe-col-icon" style={{ color: stage.color }}>{stage.icon}</span>
                    <span className="pipe-col-name">{stage.label}</span>
                    <span className="pipe-col-count">{stageDeals.length}</span>
                  </div>
                  <span className="pipe-col-val" style={{ color: stage.color }}>${(val / 1000).toFixed(1)}k</span>
                </div>

                <div className="pipe-col-body">
                  {stageDeals.map(deal => (
                    <div key={deal.id}
                      className={`deal${dragDeal === deal.id ? " dragging" : ""}${hoveredDeal === deal.id ? " hovered" : ""}${deal.overdue ? " overdue-card" : ""}`}
                      draggable
                      onDragStart={() => setDragDeal(deal.id)}
                      onDragEnd={() => { setDragDeal(null); setDropStage(null); }}
                      onMouseEnter={() => setHoveredDeal(deal.id)}
                      onMouseLeave={() => setHoveredDeal(null)}
                      onClick={() => setSelectedDeal(deal.id)}>

                      <div className="deal-accent" style={{ background: stage.color }} />

                      <div className="deal-top">
                        <div className="deal-avatar" style={{ background: deal.avatarBg }}>{deal.avatar}</div>
                        <div className="deal-info">
                          <div className="deal-name">{deal.name}</div>
                          <div className="deal-client">{deal.client}</div>
                        </div>
                        <span className="deal-value">${deal.value.toLocaleString()}</span>
                      </div>

                      <div className="deal-meta">
                        {deal.probability && <span className="deal-tag deal-prob">{deal.probability}%</span>}
                        {deal.daysInStage !== undefined && <span className="deal-tag deal-days">{deal.daysInStage}d in stage</span>}
                        {deal.overdue && <span className="deal-tag deal-overdue">OVERDUE</span>}
                        {deal.proposalViews && <span className="deal-tag deal-views">{deal.proposalViews} views</span>}
                        {deal.invoiceViews && <span className="deal-tag deal-views">{deal.invoiceViews} views</span>}
                      </div>

                      {deal.progress !== undefined && (
                        <div className="deal-progress">
                          <div className="deal-progress-fill" style={{ width: `${deal.progress}%`, background: deal.overdue ? "#c24b38" : stage.color }} />
                        </div>
                      )}

                      {deal.dueIn !== undefined && (
                        <div className="deal-due" style={{ color: deal.dueIn < 0 ? "#c24b38" : deal.dueIn <= 5 ? "#c89360" : "var(--ink-400)", marginTop: 6, fontSize: 10 }}>
                          {deal.dueIn < 0 ? `${Math.abs(deal.dueIn)}d overdue` : `${deal.dueIn}d left`}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add deal */}
                  {showAdd === stage.id ? (
                    <div className="deal-add-form">
                      <input className="deal-add-input" placeholder="Deal name..." value={newDeal.name}
                        autoFocus onChange={e => setNewDeal(d => ({ ...d, name: e.target.value }))}
                        onKeyDown={e => { if (e.key === "Enter") addDeal(stage.id); if (e.key === "Escape") setShowAdd(null); }} />
                      <input className="deal-add-input" placeholder="Client name..." value={newDeal.client}
                        onChange={e => setNewDeal(d => ({ ...d, client: e.target.value }))} />
                      <input className="deal-add-input" placeholder="Value ($)..." value={newDeal.value}
                        onChange={e => setNewDeal(d => ({ ...d, value: e.target.value }))} />
                      <div className="deal-add-actions">
                        <button className="deal-add-save" onClick={() => addDeal(stage.id)}>Add Deal</button>
                        <button className="deal-add-cancel" onClick={() => setShowAdd(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button className="deal-add-btn" onClick={() => setShowAdd(stage.id)}>+ Add deal</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Detail panel ── */}
        {selected && (
          <>
            <div className="deal-overlay" onClick={() => setSelectedDeal(null)} />
            <div className="deal-detail">
              <div className="dd-head">
                <div className="dd-avatar" style={{ background: selected.avatarBg }}>{selected.avatar}</div>
                <div className="dd-info">
                  <div className="dd-name">{selected.name}</div>
                  <div className="dd-client">{selected.client}</div>
                </div>
                <button className="dd-close" onClick={() => setSelectedDeal(null)}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                </button>
              </div>

              <div className="dd-body">
                {/* Stage selector */}
                <div className="dd-section">stage</div>
                <div className="dd-stage-selector">
                  {STAGES.map(s => (
                    <button key={s.id} className={`dd-stage-btn${selected.stage === s.id ? " on" : ""}`}
                      onClick={() => { moveDeal(selected.id, s.id); setSelectedDeal(null); }}>
                      {s.label.split(" ")[0]}
                    </button>
                  ))}
                </div>

                <div className="dd-section">details</div>
                <div className="dd-row"><span className="dd-label">Value</span><span className="dd-val ember">${selected.value.toLocaleString()}</span></div>
                {selected.probability && <div className="dd-row"><span className="dd-label">Probability</span><span className="dd-val">{selected.probability}%</span></div>}
                {selected.probability && <div className="dd-row"><span className="dd-label">Weighted</span><span className="dd-val">${Math.round(selected.value * selected.probability / 100).toLocaleString()}</span></div>}
                {selected.contact && <div className="dd-row"><span className="dd-label">Contact</span><span className="dd-val">{selected.contact}</span></div>}
                {selected.source && <div className="dd-row"><span className="dd-label">Source</span><span className="dd-val">{selected.source}</span></div>}
                {selected.daysInStage !== undefined && <div className="dd-row"><span className="dd-label">Days in stage</span><span className="dd-val">{selected.daysInStage}d</span></div>}
                {selected.progress !== undefined && <div className="dd-row"><span className="dd-label">Progress</span><span className="dd-val">{selected.progress}%</span></div>}
                {selected.dueIn !== undefined && (
                  <div className="dd-row">
                    <span className="dd-label">Deadline</span>
                    <span className={`dd-val${selected.dueIn < 0 ? " red" : selected.dueIn <= 5 ? " ember" : ""}`}>
                      {selected.dueIn < 0 ? `${Math.abs(selected.dueIn)}d overdue` : `${selected.dueIn}d left`}
                    </span>
                  </div>
                )}
                {selected.invoiceDate && <div className="dd-row"><span className="dd-label">Invoice date</span><span className="dd-val">{selected.invoiceDate}</span></div>}
                {selected.paidDate && <div className="dd-row"><span className="dd-label">Paid</span><span className="dd-val green">{selected.paidDate}</span></div>}

                {selected.notes && (
                  <>
                    <div className="dd-section">notes</div>
                    <textarea className="dd-notes" defaultValue={selected.notes} />
                  </>
                )}
              </div>

              <div className="dd-actions">
                <button className="dd-btn dd-btn-primary">Open Project</button>
                <button className="dd-btn dd-btn-ghost">Edit</button>
                <button className="dd-btn dd-btn-danger">Archive</button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
