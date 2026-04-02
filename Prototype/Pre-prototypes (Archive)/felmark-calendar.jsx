import { useState, useRef, useEffect } from "react";

const uid = () => Math.random().toString(36).slice(2, 10);

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am - 8pm
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FULL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DATES = [24, 25, 26, 27, 28, 29, 30]; // Mar 24-30
const TODAY_IDX = 5; // Saturday Mar 29
const NOW_HOUR = 11;
const NOW_MIN = 30;

const WORKSPACES = [
  { id: "w1", name: "Meridian Studio", color: "#7c8594", light: "rgba(124,133,148,0.08)", border: "rgba(124,133,148,0.2)" },
  { id: "w2", name: "Nora Kim", color: "#a08472", light: "rgba(160,132,114,0.08)", border: "rgba(160,132,114,0.2)" },
  { id: "w3", name: "Bolt Fitness", color: "#8a7e63", light: "rgba(138,126,99,0.08)", border: "rgba(138,126,99,0.2)" },
  { id: "w4", name: "Personal", color: "#b07d4f", light: "rgba(176,125,79,0.08)", border: "rgba(176,125,79,0.2)" },
];

const INITIAL_EVENTS = [
  { id: uid(), title: "Brand review call", workspace: "w1", day: 0, startHour: 9, startMin: 0, duration: 60, type: "meeting" },
  { id: uid(), title: "Logo guidelines draft", workspace: "w1", day: 0, startHour: 10, startMin: 30, duration: 120, type: "work" },
  { id: uid(), title: "Typography research", workspace: "w1", day: 1, startHour: 9, startMin: 0, duration: 90, type: "work" },
  { id: uid(), title: "Nora kickoff call", workspace: "w2", day: 1, startHour: 14, startMin: 0, duration: 45, type: "meeting" },
  { id: uid(), title: "Landing page wireframe", workspace: "w2", day: 2, startHour: 10, startMin: 0, duration: 150, type: "work" },
  { id: uid(), title: "Bolt onboarding review", workspace: "w3", day: 2, startHour: 15, startMin: 0, duration: 60, type: "meeting" },
  { id: uid(), title: "Color palette finalize", workspace: "w1", day: 3, startHour: 9, startMin: 0, duration: 90, type: "work" },
  { id: uid(), title: "Social templates — IG", workspace: "w1", day: 3, startHour: 13, startMin: 0, duration: 120, type: "work" },
  { id: uid(), title: "Email sequence outline", workspace: "w2", day: 4, startHour: 10, startMin: 0, duration: 90, type: "work" },
  { id: uid(), title: "Blog post draft", workspace: "w3", day: 4, startHour: 14, startMin: 0, duration: 90, type: "work" },
  { id: uid(), title: "Weekly review", workspace: "w4", day: 4, startHour: 16, startMin: 30, duration: 30, type: "personal" },
  { id: uid(), title: "Client delivery — Meridian", workspace: "w1", day: 5, startHour: 11, startMin: 0, duration: 60, type: "deadline" },
];

const EVENT_TYPES = {
  meeting: { icon: "◎" },
  work: { icon: "◆" },
  deadline: { icon: "⚑" },
  personal: { icon: "✦" },
};

const MINI_MONTH = [
  [null, null, null, null, null, 1, 2],
  [3, 4, 5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14, 15, 16],
  [17, 18, 19, 20, 21, 22, 23],
  [24, 25, 26, 27, 28, 29, 30],
  [31, null, null, null, null, null, null],
];

export default function FelmarkCalendar() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [view, setView] = useState("week");
  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({ title: "", workspace: "w1", day: TODAY_IDX, startHour: 9, startMin: 0, duration: 60, type: "work" });
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [wsFilter, setWsFilter] = useState("all");
  const gridRef = useRef(null);

  const HOUR_H = 64;
  const DAY_W = `calc((100% - 56px) / 7)`;

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTop = (NOW_HOUR - 7.5) * HOUR_H;
    }
  }, []);

  const filtered = wsFilter === "all" ? events : events.filter(e => e.workspace === wsFilter);

  const openCreate = (day, hour) => {
    setCreateData({ title: "", workspace: "w1", day, startHour: hour, startMin: 0, duration: 60, type: "work" });
    setShowCreate(true);
  };

  const saveEvent = () => {
    if (!createData.title.trim()) return;
    setEvents(prev => [...prev, { ...createData, id: uid() }]);
    setShowCreate(false);
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setSelectedEvent(null);
  };

  const getWs = (id) => WORKSPACES.find(w => w.id === id) || WORKSPACES[0];

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
        }

        .cal {
          font-family: 'Outfit', sans-serif; font-size: 14px;
          color: var(--ink-700); background: var(--parchment);
          height: 100vh; display: flex; flex-direction: column;
        }

        /* ── Topbar ── */
        .cal-top {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 20px; border-bottom: 1px solid var(--warm-200);
          flex-shrink: 0; background: var(--parchment);
        }
        .cal-top-left { display: flex; align-items: center; gap: 14px; }
        .cal-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: var(--ink-900); }
        .cal-week-label { font-family: var(--mono); font-size: 11px; color: var(--ink-400); }
        .cal-nav { display: flex; gap: 2px; }
        .cal-nav-btn {
          width: 30px; height: 30px; border-radius: 5px; border: 1px solid var(--warm-200);
          background: #fff; cursor: pointer; display: flex; align-items: center;
          justify-content: center; color: var(--ink-400); transition: all 0.08s;
        }
        .cal-nav-btn:hover { border-color: var(--warm-300); color: var(--ink-600); background: var(--warm-50); }
        .cal-today-btn {
          padding: 5px 14px; border-radius: 5px; border: 1px solid var(--warm-200);
          background: #fff; cursor: pointer; font-family: var(--mono); font-size: 11px;
          color: var(--ink-500); transition: all 0.08s;
        }
        .cal-today-btn:hover { background: var(--warm-100); border-color: var(--warm-300); }

        .cal-top-right { display: flex; align-items: center; gap: 8px; }
        .cal-view-toggle { display: flex; border: 1px solid var(--warm-200); border-radius: 5px; overflow: hidden; }
        .cal-vt {
          padding: 5px 14px; font-size: 12px; border: none; cursor: pointer;
          font-family: inherit; color: var(--ink-400); background: #fff; transition: all 0.08s;
        }
        .cal-vt:not(:last-child) { border-right: 1px solid var(--warm-200); }
        .cal-vt:hover { background: var(--warm-50); }
        .cal-vt.on { background: var(--ink-900); color: var(--parchment); }
        .cal-create-btn {
          display: flex; align-items: center; gap: 5px; padding: 6px 16px;
          border-radius: 5px; border: none; background: var(--ember);
          color: #fff; font-size: 13px; font-weight: 500; font-family: inherit;
          cursor: pointer; transition: background 0.1s;
        }
        .cal-create-btn:hover { background: var(--ember-light); }

        /* ── Filter bar ── */
        .cal-filters {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 20px; border-bottom: 1px solid var(--warm-100);
          flex-shrink: 0;
        }
        .cal-filter-label { font-family: var(--mono); font-size: 9px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.08em; margin-right: 4px; }
        .cal-filter {
          display: flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 4px; border: 1px solid var(--warm-200);
          background: #fff; cursor: pointer; font-size: 12px; color: var(--ink-500);
          transition: all 0.08s; font-family: inherit;
        }
        .cal-filter:hover { border-color: var(--warm-300); background: var(--warm-50); }
        .cal-filter.on { background: var(--ink-900); color: var(--parchment); border-color: var(--ink-900); }
        .cal-filter-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        /* ── Layout ── */
        .cal-body { display: flex; flex: 1; overflow: hidden; }

        /* ── Mini sidebar ── */
        .cal-side {
          width: 220px; min-width: 220px; border-right: 1px solid var(--warm-200);
          background: var(--warm-50); padding: 16px; display: flex;
          flex-direction: column; gap: 20px; flex-shrink: 0;
          overflow-y: auto;
        }
        .cal-side::-webkit-scrollbar { width: 3px; }
        .cal-side::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }

        /* Mini month */
        .mini-month-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .mini-month-title { font-size: 14px; font-weight: 600; color: var(--ink-800); }
        .mini-month-nav { display: flex; gap: 2px; }
        .mini-nav-btn {
          width: 24px; height: 24px; border-radius: 4px; border: none;
          background: none; cursor: pointer; color: var(--ink-400);
          display: flex; align-items: center; justify-content: center;
        }
        .mini-nav-btn:hover { background: var(--warm-200); color: var(--ink-600); }
        .mini-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; }
        .mini-day-label { font-family: var(--mono); font-size: 9px; color: var(--ink-300); text-align: center; padding: 2px 0; }
        .mini-day {
          width: 28px; height: 28px; border-radius: 4px; display: flex;
          align-items: center; justify-content: center; font-size: 12px;
          color: var(--ink-600); cursor: pointer; transition: background 0.06s;
          margin: 0 auto;
        }
        .mini-day:hover { background: var(--warm-200); }
        .mini-day.today { background: var(--ember); color: #fff; font-weight: 600; border-radius: 50%; }
        .mini-day.in-range { background: var(--ember-bg); color: var(--ember); }
        .mini-day.empty { cursor: default; }

        /* Upcoming events */
        .upcoming-label { font-family: var(--mono); font-size: 9px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .upcoming-item {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 8px 0; border-bottom: 1px solid var(--warm-100);
        }
        .upcoming-item:last-child { border-bottom: none; }
        .upcoming-dot { width: 3px; align-self: stretch; border-radius: 2px; flex-shrink: 0; margin-top: 2px; }
        .upcoming-info { flex: 1; }
        .upcoming-title { font-size: 13px; color: var(--ink-800); font-weight: 500; }
        .upcoming-time { font-family: var(--mono); font-size: 10px; color: var(--ink-400); margin-top: 1px; }

        /* ── Grid ── */
        .cal-grid-wrap { flex: 1; overflow: auto; position: relative; }
        .cal-grid-wrap::-webkit-scrollbar { width: 5px; height: 5px; }
        .cal-grid-wrap::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }

        /* Day header */
        .cal-day-header {
          display: flex; position: sticky; top: 0; z-index: 10;
          background: var(--parchment); border-bottom: 1px solid var(--warm-200);
        }
        .cal-time-gutter-head { width: 56px; flex-shrink: 0; border-right: 1px solid var(--warm-100); }
        .cal-day-col-head {
          flex: 1; text-align: center; padding: 10px 0 8px;
          border-right: 1px solid var(--warm-100); position: relative;
        }
        .cal-day-col-head:last-child { border-right: none; }
        .cal-day-name { font-size: 11px; color: var(--ink-400); font-weight: 400; }
        .cal-day-num { font-size: 20px; font-weight: 600; color: var(--ink-800); margin-top: 2px; font-family: 'Cormorant Garamond', serif; }
        .cal-day-col-head.today .cal-day-num {
          background: var(--ember); color: #fff; width: 32px; height: 32px;
          border-radius: 50%; display: inline-flex; align-items: center;
          justify-content: center; font-size: 18px;
        }

        /* Time grid */
        .cal-grid { display: flex; position: relative; }
        .cal-time-gutter {
          width: 56px; flex-shrink: 0; border-right: 1px solid var(--warm-100);
        }
        .cal-time-label {
          height: ${HOUR_H}px; display: flex; align-items: flex-start;
          justify-content: flex-end; padding: 0 8px;
          font-family: var(--mono); font-size: 10px; color: var(--ink-300);
          transform: translateY(-6px);
        }
        .cal-day-col {
          flex: 1; position: relative;
          border-right: 1px solid var(--warm-100);
        }
        .cal-day-col:last-child { border-right: none; }
        .cal-hour-row {
          height: ${HOUR_H}px; border-bottom: 1px solid var(--warm-100);
          cursor: pointer; transition: background 0.06s;
        }
        .cal-hour-row:hover { background: rgba(176,125,79,0.02); }
        .cal-hour-row-half { border-bottom: 1px dashed rgba(0,0,0,0.03); height: ${HOUR_H / 2}px; }

        /* Now indicator */
        .now-line {
          position: absolute; left: 56px; right: 0; height: 2px;
          background: var(--ember); z-index: 5; pointer-events: none;
        }
        .now-dot {
          position: absolute; left: 52px; width: 10px; height: 10px;
          border-radius: 50%; background: var(--ember); z-index: 6;
          transform: translateY(-4px); pointer-events: none;
        }
        .now-label {
          position: absolute; left: 8px; font-family: var(--mono);
          font-size: 10px; color: var(--ember); font-weight: 500;
          transform: translateY(-7px); z-index: 6; pointer-events: none;
        }

        /* ── Event cards ── */
        .ev {
          position: absolute; left: 4px; right: 4px; border-radius: 6px;
          padding: 6px 8px; cursor: pointer; overflow: hidden;
          border-left: 3px solid; transition: box-shadow 0.1s, transform 0.1s;
          z-index: 3;
        }
        .ev:hover { transform: scale(1.01); box-shadow: 0 2px 10px rgba(0,0,0,0.06); z-index: 4; }
        .ev-title { font-size: 12px; font-weight: 500; color: var(--ink-800); line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ev-time { font-family: var(--mono); font-size: 9.5px; color: var(--ink-400); margin-top: 2px; }
        .ev-ws { font-size: 10px; color: var(--ink-400); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ev-type { position: absolute; top: 6px; right: 6px; font-size: 10px; color: var(--ink-300); }

        /* ── Create modal ── */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(44,42,37,0.3);
          display: flex; align-items: center; justify-content: center;
          z-index: 100; backdrop-filter: blur(2px);
        }
        .modal {
          width: 420px; background: #fff; border-radius: 12px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05);
          overflow: hidden; animation: modalIn 0.15s ease;
        }
        @keyframes modalIn { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .modal-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px; border-bottom: 1px solid var(--warm-200);
        }
        .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: var(--ink-900); }
        .modal-close {
          background: none; border: none; cursor: pointer; color: var(--ink-400);
          padding: 4px; border-radius: 4px; display: flex;
        }
        .modal-close:hover { background: var(--warm-100); color: var(--ink-600); }

        .modal-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
        .modal-field { display: flex; flex-direction: column; gap: 4px; }
        .modal-label { font-size: 12px; font-weight: 500; color: var(--ink-600); }
        .modal-input {
          padding: 9px 12px; border: 1px solid var(--warm-200); border-radius: 5px;
          font-family: inherit; font-size: 14px; color: var(--ink-800);
          outline: none; background: #fff;
        }
        .modal-input:focus { border-color: var(--ember); box-shadow: 0 0 0 3px rgba(176,125,79,0.06); }
        .modal-select {
          padding: 9px 12px; border: 1px solid var(--warm-200); border-radius: 5px;
          font-family: inherit; font-size: 14px; color: var(--ink-800);
          outline: none; background: #fff; cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239b988f' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center;
        }
        .modal-select:focus { border-color: var(--ember); }
        .modal-row { display: flex; gap: 10px; }
        .modal-row > * { flex: 1; }

        .modal-type-row { display: flex; gap: 6px; }
        .modal-type {
          flex: 1; padding: 8px; border: 1px solid var(--warm-200); border-radius: 6px;
          cursor: pointer; text-align: center; font-size: 12px; color: var(--ink-500);
          transition: all 0.08s; background: #fff;
        }
        .modal-type:hover { border-color: var(--warm-300); background: var(--warm-50); }
        .modal-type.on { border-color: var(--ember); background: var(--ember-bg); color: var(--ember); font-weight: 500; }
        .modal-type-icon { font-size: 16px; display: block; margin-bottom: 2px; }

        .modal-foot {
          display: flex; justify-content: flex-end; gap: 8px;
          padding: 14px 20px; border-top: 1px solid var(--warm-100);
        }
        .modal-btn {
          padding: 8px 20px; border-radius: 5px; font-size: 13px; font-weight: 500;
          font-family: inherit; cursor: pointer; transition: all 0.1s;
        }
        .modal-cancel { background: none; border: 1px solid var(--warm-200); color: var(--ink-600); }
        .modal-cancel:hover { background: var(--warm-100); border-color: var(--warm-300); }
        .modal-save { background: var(--ember); border: 1px solid var(--ember); color: #fff; }
        .modal-save:hover { background: var(--ember-light); }

        /* ── Event detail popover ── */
        .ev-popover {
          position: fixed; width: 280px; background: #fff; border-radius: 10px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04);
          padding: 16px; z-index: 50; animation: modalIn 0.12s ease;
        }
        .ev-pop-title { font-size: 15px; font-weight: 600; color: var(--ink-900); margin-bottom: 8px; }
        .ev-pop-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .ev-pop-icon { color: var(--ink-300); flex-shrink: 0; display: flex; }
        .ev-pop-text { font-size: 13px; color: var(--ink-600); }
        .ev-pop-text.mono { font-family: var(--mono); font-size: 11px; }
        .ev-pop-actions { display: flex; gap: 6px; margin-top: 12px; border-top: 1px solid var(--warm-100); padding-top: 12px; }
        .ev-pop-btn {
          flex: 1; padding: 6px; border-radius: 4px; font-size: 12px;
          font-family: inherit; cursor: pointer; text-align: center; transition: all 0.08s;
        }
        .ev-pop-edit { background: var(--warm-100); border: 1px solid var(--warm-200); color: var(--ink-600); }
        .ev-pop-edit:hover { background: var(--warm-200); }
        .ev-pop-del { background: rgba(194,75,56,0.06); border: 1px solid rgba(194,75,56,0.12); color: #c24b38; }
        .ev-pop-del:hover { background: rgba(194,75,56,0.1); }
      `}</style>

      <div className="cal">
        {/* ── Topbar ── */}
        <div className="cal-top">
          <div className="cal-top-left">
            <span className="cal-title">Calendar</span>
            <span className="cal-week-label">March 24 – 30, 2026</span>
            <div className="cal-nav">
              <button className="cal-nav-btn"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2.5l-4 3.5 4 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
              <button className="cal-nav-btn"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            </div>
            <button className="cal-today-btn">Today</button>
          </div>
          <div className="cal-top-right">
            <div className="cal-view-toggle">
              <button className={`cal-vt${view === "day" ? " on" : ""}`} onClick={() => setView("day")}>Day</button>
              <button className={`cal-vt${view === "week" ? " on" : ""}`} onClick={() => setView("week")}>Week</button>
              <button className={`cal-vt${view === "month" ? " on" : ""}`} onClick={() => setView("month")}>Month</button>
            </div>
            <button className="cal-create-btn" onClick={() => { setCreateData({ title: "", workspace: "w1", day: TODAY_IDX, startHour: NOW_HOUR + 1, startMin: 0, duration: 60, type: "work" }); setShowCreate(true); }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              New Event
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="cal-filters">
          <span className="cal-filter-label">show</span>
          <button className={`cal-filter${wsFilter === "all" ? " on" : ""}`} onClick={() => setWsFilter("all")}>All</button>
          {WORKSPACES.map(ws => (
            <button key={ws.id} className={`cal-filter${wsFilter === ws.id ? " on" : ""}`} onClick={() => setWsFilter(ws.id)}>
              <span className="cal-filter-dot" style={{ background: ws.color }} />
              {ws.name}
            </button>
          ))}
        </div>

        <div className="cal-body">
          {/* ── Sidebar ── */}
          <div className="cal-side">
            {/* Mini month */}
            <div>
              <div className="mini-month-head">
                <span className="mini-month-title">March 2026</span>
                <div className="mini-month-nav">
                  <button className="mini-nav-btn"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M6.5 2l-3.5 3 3.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                  <button className="mini-nav-btn"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3.5 2l3.5 3-3.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                </div>
              </div>
              <div className="mini-grid">
                {["M","T","W","T","F","S","S"].map((d, i) => <div key={i} className="mini-day-label">{d}</div>)}
                {MINI_MONTH.flat().map((d, i) => (
                  <div key={i} className={`mini-day${d === 29 ? " today" : ""}${d && d >= 24 && d <= 30 ? " in-range" : ""}${d === null ? " empty" : ""}`}>
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming */}
            <div>
              <div className="upcoming-label">Today's events</div>
              {events.filter(e => e.day === TODAY_IDX).sort((a, b) => a.startHour - b.startHour).map(ev => {
                const ws = getWs(ev.workspace);
                const endMin = ev.startHour * 60 + ev.startMin + ev.duration;
                const endH = Math.floor(endMin / 60);
                const endM = endMin % 60;
                return (
                  <div key={ev.id} className="upcoming-item">
                    <div className="upcoming-dot" style={{ background: ws.color }} />
                    <div className="upcoming-info">
                      <div className="upcoming-title">{ev.title}</div>
                      <div className="upcoming-time">
                        {String(ev.startHour).padStart(2, "0")}:{String(ev.startMin).padStart(2, "0")} → {String(endH).padStart(2, "0")}:{String(endM).padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                );
              })}
              {events.filter(e => e.day === TODAY_IDX).length === 0 && (
                <div style={{ fontSize: 12, color: "var(--ink-300)", padding: "8px 0" }}>No events today</div>
              )}
            </div>
          </div>

          {/* ── Grid ── */}
          <div className="cal-grid-wrap" ref={gridRef}>
            {/* Day headers */}
            <div className="cal-day-header">
              <div className="cal-time-gutter-head" />
              {DAYS.map((d, i) => (
                <div key={i} className={`cal-day-col-head${i === TODAY_IDX ? " today" : ""}`}>
                  <div className="cal-day-name">{d}</div>
                  <div className="cal-day-num">{DATES[i]}</div>
                </div>
              ))}
            </div>

            {/* Time grid */}
            <div className="cal-grid" style={{ position: "relative" }}>
              {/* Time gutter */}
              <div className="cal-time-gutter">
                {HOURS.map(h => (
                  <div key={h} className="cal-time-label">
                    {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {DAYS.map((d, di) => (
                <div key={di} className="cal-day-col">
                  {HOURS.map(h => (
                    <div key={h} className="cal-hour-row" onClick={() => openCreate(di, h)} />
                  ))}

                  {/* Events */}
                  {filtered.filter(e => e.day === di).map(ev => {
                    const ws = getWs(ev.workspace);
                    const top = (ev.startHour - 7) * HOUR_H + (ev.startMin / 60) * HOUR_H;
                    const height = Math.max((ev.duration / 60) * HOUR_H - 2, 22);
                    const endMin = ev.startHour * 60 + ev.startMin + ev.duration;
                    const endH = Math.floor(endMin / 60);
                    const endM = endMin % 60;

                    return (
                      <div key={ev.id} className="ev" style={{
                        top, height, background: ws.light, borderLeftColor: ws.color,
                      }}
                        onMouseEnter={() => setHoveredEvent(ev.id)}
                        onMouseLeave={() => setHoveredEvent(null)}
                        onClick={e => { e.stopPropagation(); setSelectedEvent(selectedEvent === ev.id ? null : ev.id); }}>
                        <span className="ev-type">{EVENT_TYPES[ev.type]?.icon}</span>
                        <div className="ev-title">{ev.title}</div>
                        {height > 36 && <div className="ev-time">{String(ev.startHour).padStart(2, "0")}:{String(ev.startMin).padStart(2, "0")} → {String(endH).padStart(2, "0")}:{String(endM).padStart(2, "0")}</div>}
                        {height > 52 && <div className="ev-ws">{ws.name}</div>}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Now indicator */}
              {(() => {
                const top = (NOW_HOUR - 7) * HOUR_H + (NOW_MIN / 60) * HOUR_H;
                return (
                  <>
                    <div className="now-label" style={{ top }}>{`${NOW_HOUR}:${String(NOW_MIN).padStart(2, "0")}`}</div>
                    <div className="now-dot" style={{ top }} />
                    <div className="now-line" style={{ top }} />
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* ── Create modal ── */}
        {showCreate && (
          <div className="modal-overlay" onClick={() => setShowCreate(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-head">
                <span className="modal-title">Create Event</span>
                <button className="modal-close" onClick={() => setShowCreate(false)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-field">
                  <label className="modal-label">Title</label>
                  <input className="modal-input" placeholder="Event name..." value={createData.title} autoFocus
                    onChange={e => setCreateData(d => ({ ...d, title: e.target.value }))}
                    onKeyDown={e => { if (e.key === "Enter") saveEvent(); }} />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Workspace</label>
                  <select className="modal-select" value={createData.workspace}
                    onChange={e => setCreateData(d => ({ ...d, workspace: e.target.value }))}>
                    {WORKSPACES.map(ws => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
                  </select>
                </div>
                <div className="modal-row">
                  <div className="modal-field">
                    <label className="modal-label">Day</label>
                    <select className="modal-select" value={createData.day}
                      onChange={e => setCreateData(d => ({ ...d, day: parseInt(e.target.value) }))}>
                      {FULL_DAYS.map((d, i) => <option key={i} value={i}>{d}, Mar {DATES[i]}</option>)}
                    </select>
                  </div>
                  <div className="modal-field">
                    <label className="modal-label">Duration</label>
                    <select className="modal-select" value={createData.duration}
                      onChange={e => setCreateData(d => ({ ...d, duration: parseInt(e.target.value) }))}>
                      <option value={30}>30 min</option><option value={45}>45 min</option>
                      <option value={60}>1 hour</option><option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option><option value={180}>3 hours</option>
                    </select>
                  </div>
                </div>
                <div className="modal-row">
                  <div className="modal-field">
                    <label className="modal-label">Start time</label>
                    <select className="modal-select" value={`${createData.startHour}:${createData.startMin}`}
                      onChange={e => { const [h, m] = e.target.value.split(":").map(Number); setCreateData(d => ({ ...d, startHour: h, startMin: m })); }}>
                      {HOURS.flatMap(h => [0, 30].map(m => (
                        <option key={`${h}:${m}`} value={`${h}:${m}`}>
                          {h === 12 ? 12 : h > 12 ? h - 12 : h}:{String(m).padStart(2, "0")} {h >= 12 ? "PM" : "AM"}
                        </option>
                      )))}
                    </select>
                  </div>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Type</label>
                  <div className="modal-type-row">
                    {Object.entries(EVENT_TYPES).map(([key, val]) => (
                      <div key={key} className={`modal-type${createData.type === key ? " on" : ""}`}
                        onClick={() => setCreateData(d => ({ ...d, type: key }))}>
                        <span className="modal-type-icon">{val.icon}</span>
                        {key}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-foot">
                <button className="modal-btn modal-cancel" onClick={() => setShowCreate(false)}>Cancel</button>
                <button className="modal-btn modal-save" onClick={saveEvent}>Create Event</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Event detail popover ── */}
        {selectedEvent && (() => {
          const ev = events.find(e => e.id === selectedEvent);
          if (!ev) return null;
          const ws = getWs(ev.workspace);
          const endMin = ev.startHour * 60 + ev.startMin + ev.duration;
          return (
            <div className="ev-popover" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
              <div className="ev-pop-title">{ev.title}</div>
              <div className="ev-pop-row">
                <span className="ev-pop-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2.5" width="10" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M2 5.5h10M5 1v3M9 1v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg></span>
                <span className="ev-pop-text">{FULL_DAYS[ev.day]}, Mar {DATES[ev.day]}</span>
              </div>
              <div className="ev-pop-row">
                <span className="ev-pop-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.1"/><path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span className="ev-pop-text mono">{String(ev.startHour).padStart(2, "0")}:{String(ev.startMin).padStart(2, "0")} → {String(Math.floor(endMin / 60)).padStart(2, "0")}:{String(endMin % 60).padStart(2, "0")} · {ev.duration}min</span>
              </div>
              <div className="ev-pop-row">
                <span className="ev-pop-icon" style={{ color: ws.color }}>●</span>
                <span className="ev-pop-text">{ws.name}</span>
              </div>
              <div className="ev-pop-actions">
                <button className="ev-pop-btn ev-pop-edit" onClick={() => setSelectedEvent(null)}>Edit</button>
                <button className="ev-pop-btn ev-pop-del" onClick={() => deleteEvent(ev.id)}>Delete</button>
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
}
