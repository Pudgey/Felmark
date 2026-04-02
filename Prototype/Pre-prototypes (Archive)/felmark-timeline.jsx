import { useState, useRef } from "react";

const WEEKS = ["Mar 17", "Mar 24", "Mar 31", "Apr 7", "Apr 14", "Apr 21", "Apr 28", "May 5"];
const DAYS_PER_WEEK = 7;
const TOTAL_DAYS = WEEKS.length * DAYS_PER_WEEK;
const TODAY_OFFSET = 12; // days from start (Mar 29)

const INITIAL_TASKS = [
  { id: "t1", name: "Discovery & Research", workspace: "Meridian Studio", color: "#7c8594", start: 0, duration: 7, status: "done", assignee: "You" },
  { id: "t2", name: "Mood Board & Direction", workspace: "Meridian Studio", color: "#7c8594", start: 5, duration: 5, status: "done", assignee: "You" },
  { id: "t3", name: "Logo Usage Guidelines", workspace: "Meridian Studio", color: "#7c8594", start: 10, duration: 8, status: "active", assignee: "You" },
  { id: "t4", name: "Color & Typography", workspace: "Meridian Studio", color: "#7c8594", start: 14, duration: 6, status: "upcoming", assignee: "You" },
  { id: "t5", name: "Social Templates", workspace: "Meridian Studio", color: "#7c8594", start: 18, duration: 7, status: "upcoming", assignee: "You" },
  { id: "t6", name: "Client Review", workspace: "Meridian Studio", color: "#7c8594", start: 25, duration: 5, status: "upcoming", assignee: "Client" },
  { id: "m1", name: "Final Delivery", workspace: "Meridian Studio", color: "#7c8594", start: 30, duration: 0, status: "milestone", assignee: "" },
  { id: "t7", name: "Course Landing Page", workspace: "Nora Kim", color: "#a08472", start: 8, duration: 14, status: "active", assignee: "You" },
  { id: "t8", name: "Email Sequence Draft", workspace: "Nora Kim", color: "#a08472", start: 20, duration: 10, status: "upcoming", assignee: "You" },
  { id: "t9", name: "App Onboarding UX", workspace: "Bolt Fitness", color: "#8a7e63", start: 0, duration: 12, status: "overdue", assignee: "You" },
  { id: "t10", name: "Blog Posts (April)", workspace: "Bolt Fitness", color: "#8a7e63", start: 14, duration: 14, status: "upcoming", assignee: "You" },
];

const STATUS_STYLES = {
  done: { bg: "rgba(90,154,60,0.15)", border: "rgba(90,154,60,0.3)", text: "#5a9a3c" },
  active: { bg: "rgba(176,125,79,0.15)", border: "rgba(176,125,79,0.35)", text: "#b07d4f" },
  upcoming: { bg: "rgba(0,0,0,0.04)", border: "rgba(0,0,0,0.08)", text: "#7d7a72" },
  overdue: { bg: "rgba(194,75,56,0.12)", border: "rgba(194,75,56,0.3)", text: "#c24b38" },
  milestone: { bg: "var(--ember)", border: "var(--ember)", text: "#fff" },
};

export default function ProjectTimeline() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const scrollRef = useRef(null);

  const COL_W = 40;
  const ROW_H = 40;
  const CHART_W = TOTAL_DAYS * COL_W;
  const LABEL_W = 260;

  const workspaces = [...new Set(tasks.map(t => t.workspace))];
  const filtered = filter === "all" ? tasks : tasks.filter(t => t.workspace === filter);

  // Group by workspace
  const grouped = [];
  let lastWs = "";
  filtered.forEach(t => {
    if (t.workspace !== lastWs) { grouped.push({ type: "header", workspace: t.workspace, color: t.color }); lastWs = t.workspace; }
    grouped.push({ type: "task", ...t });
  });

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
        }

        .gantt {
          font-family: 'Outfit', sans-serif; font-size: 14px;
          color: var(--ink-700); background: var(--parchment);
          height: 100vh; display: flex; flex-direction: column;
        }

        .gantt-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 24px; border-bottom: 1px solid var(--warm-200);
          background: var(--parchment); flex-shrink: 0;
        }
        .gantt-title { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: var(--ink-900); }
        .gantt-filters { display: flex; align-items: center; gap: 4px; }
        .gantt-filter {
          padding: 5px 12px; border-radius: 4px; font-size: 12px; font-weight: 400;
          font-family: inherit; cursor: pointer; border: 1px solid transparent;
          background: none; color: var(--ink-400); transition: all 0.1s;
        }
        .gantt-filter:hover { background: var(--warm-100); }
        .gantt-filter.on { background: var(--ink-900); color: var(--parchment); border-color: var(--ink-900); }
        .gantt-meta { display: flex; align-items: center; gap: 16px; font-family: var(--mono); font-size: 10px; color: var(--ink-400); }
        .gantt-stat { display: flex; align-items: center; gap: 4px; }
        .gantt-dot { width: 6px; height: 6px; border-radius: 50%; }

        .gantt-body { flex: 1; overflow: auto; display: flex; }
        .gantt-body::-webkit-scrollbar { width: 5px; height: 5px; }
        .gantt-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }

        /* ── Left labels ── */
        .gantt-labels {
          width: ${LABEL_W}px; min-width: ${LABEL_W}px; flex-shrink: 0;
          border-right: 1px solid var(--warm-200); background: var(--warm-50);
          position: sticky; left: 0; z-index: 10;
        }
        .gantt-labels-head {
          height: 36px; padding: 0 16px; display: flex; align-items: center;
          font-family: var(--mono); font-size: 9px; color: var(--ink-400);
          text-transform: uppercase; letter-spacing: 0.08em;
          border-bottom: 1px solid var(--warm-200); background: var(--warm-50);
          position: sticky; top: 0; z-index: 11;
        }
        .label-ws-header {
          height: 28px; padding: 0 16px; display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 500; color: var(--ink-500);
          background: var(--warm-100); border-bottom: 1px solid var(--warm-200);
        }
        .label-ws-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
        .label-row {
          height: ${ROW_H}px; padding: 0 16px; display: flex; align-items: center; gap: 8px;
          border-bottom: 1px solid var(--warm-100); transition: background 0.06s;
        }
        .label-row:hover, .label-row.hovered { background: var(--ember-bg); }
        .label-name { font-size: 13px; color: var(--ink-700); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .label-assignee { font-family: var(--mono); font-size: 10px; color: var(--ink-300); flex-shrink: 0; }
        .label-status {
          font-family: var(--mono); font-size: 9px; font-weight: 500;
          padding: 1px 6px; border-radius: 2px; flex-shrink: 0;
          text-transform: uppercase; letter-spacing: 0.04em;
        }

        /* ── Chart ── */
        .gantt-chart { position: relative; min-width: ${CHART_W}px; }

        .gantt-chart-head {
          display: flex; height: 36px; border-bottom: 1px solid var(--warm-200);
          background: var(--warm-50); position: sticky; top: 0; z-index: 5;
        }
        .gantt-week {
          display: flex; align-items: center; justify-content: center;
          font-family: var(--mono); font-size: 10px; color: var(--ink-400);
          border-right: 1px solid var(--warm-200);
        }

        .gantt-chart-body { position: relative; }

        .gantt-grid-row {
          height: ${ROW_H}px; display: flex; border-bottom: 1px solid var(--warm-100);
          transition: background 0.06s; position: relative;
        }
        .gantt-grid-row:hover, .gantt-grid-row.hovered { background: rgba(176,125,79,0.02); }
        .gantt-grid-ws { height: 28px; background: var(--warm-100); border-bottom: 1px solid var(--warm-200); }

        .gantt-day-col {
          width: ${COL_W}px; min-width: ${COL_W}px; border-right: 1px solid var(--warm-100);
        }
        .gantt-day-col.weekend { background: rgba(0,0,0,0.01); }

        /* Today line */
        .today-line {
          position: absolute; top: 0; bottom: 0; width: 2px;
          background: var(--ember); z-index: 4; pointer-events: none;
          left: ${TODAY_OFFSET * COL_W + COL_W / 2}px;
        }
        .today-label {
          position: absolute; top: -36px;
          left: ${TODAY_OFFSET * COL_W + COL_W / 2 - 20}px;
          font-family: var(--mono); font-size: 9px; font-weight: 500;
          color: var(--ember); background: var(--ember-bg);
          padding: 2px 6px; border-radius: 3px; z-index: 6;
          border: 1px solid rgba(176,125,79,0.15);
        }

        /* Task bars */
        .task-bar {
          position: absolute; height: 24px; top: 8px; border-radius: 4px;
          display: flex; align-items: center; padding: 0 8px;
          font-size: 11px; font-weight: 500; cursor: pointer;
          transition: box-shadow 0.1s, transform 0.1s;
          overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
          border: 1px solid;
        }
        .task-bar:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

        .milestone-marker {
          position: absolute; top: 12px; width: 16px; height: 16px;
          transform: rotate(45deg); border-radius: 2px; cursor: pointer;
          transition: transform 0.1s;
        }
        .milestone-marker:hover { transform: rotate(45deg) scale(1.2); }
      `}</style>

      <div className="gantt">
        <div className="gantt-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span className="gantt-title">Timeline</span>
            <div className="gantt-filters">
              <button className={`gantt-filter${filter === "all" ? " on" : ""}`} onClick={() => setFilter("all")}>All</button>
              {workspaces.map(ws => (
                <button key={ws} className={`gantt-filter${filter === ws ? " on" : ""}`} onClick={() => setFilter(ws)}>{ws}</button>
              ))}
            </div>
          </div>
          <div className="gantt-meta">
            <span className="gantt-stat"><span className="gantt-dot" style={{ background: "#5a9a3c" }} /> {tasks.filter(t => t.status === "done").length} done</span>
            <span className="gantt-stat"><span className="gantt-dot" style={{ background: "#b07d4f" }} /> {tasks.filter(t => t.status === "active").length} active</span>
            <span className="gantt-stat"><span className="gantt-dot" style={{ background: "#c24b38" }} /> {tasks.filter(t => t.status === "overdue").length} overdue</span>
          </div>
        </div>

        <div className="gantt-body" ref={scrollRef}>
          {/* ── Labels ── */}
          <div className="gantt-labels">
            <div className="gantt-labels-head">task</div>
            {grouped.map((row, i) => {
              if (row.type === "header") {
                return <div key={`h-${row.workspace}`} className="label-ws-header"><div className="label-ws-dot" style={{ background: row.color }} />{row.workspace}</div>;
              }
              const st = STATUS_STYLES[row.status] || STATUS_STYLES.upcoming;
              return (
                <div key={row.id} className={`label-row${hoveredTask === row.id ? " hovered" : ""}`}
                  onMouseEnter={() => setHoveredTask(row.id)} onMouseLeave={() => setHoveredTask(null)}>
                  {row.status === "milestone" ? (
                    <span style={{ color: "var(--ember)", fontSize: 12 }}>◆</span>
                  ) : null}
                  <span className="label-name">{row.name}</span>
                  {row.assignee && <span className="label-assignee">{row.assignee}</span>}
                  {row.status !== "milestone" && (
                    <span className="label-status" style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                      {row.status}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Chart ── */}
          <div className="gantt-chart">
            {/* Week headers */}
            <div className="gantt-chart-head">
              {WEEKS.map((w, i) => (
                <div key={w} className="gantt-week" style={{ width: DAYS_PER_WEEK * COL_W }}>
                  {w}
                </div>
              ))}
              <div className="today-label">today</div>
            </div>

            {/* Chart body */}
            <div className="gantt-chart-body">
              <div className="today-line" />

              {grouped.map((row, ri) => {
                if (row.type === "header") {
                  return <div key={`gh-${row.workspace}`} className="gantt-grid-ws" />;
                }
                return (
                  <div key={row.id} className={`gantt-grid-row${hoveredTask === row.id ? " hovered" : ""}`}
                    onMouseEnter={() => setHoveredTask(row.id)} onMouseLeave={() => setHoveredTask(null)}>
                    {row.status === "milestone" ? (
                      <div className="milestone-marker"
                        style={{ left: row.start * COL_W + COL_W / 2 - 8, background: STATUS_STYLES.milestone.bg }} />
                    ) : (
                      <div className="task-bar"
                        style={{
                          left: row.start * COL_W + 2,
                          width: Math.max(row.duration * COL_W - 4, 20),
                          background: STATUS_STYLES[row.status].bg,
                          borderColor: STATUS_STYLES[row.status].border,
                          color: STATUS_STYLES[row.status].text,
                        }}>
                        {row.duration >= 3 && <span style={{ fontSize: 11, overflow: "hidden", textOverflow: "ellipsis" }}>{row.name}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
