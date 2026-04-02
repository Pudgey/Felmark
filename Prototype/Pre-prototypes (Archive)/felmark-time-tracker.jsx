import { useState, useEffect, useRef } from "react";

const PROJECTS = [
  { id: "p1", name: "Brand Guidelines v2", client: "Meridian Studio", color: "#7c8594", rate: 95 },
  { id: "p2", name: "Website Copy", client: "Meridian Studio", color: "#7c8594", rate: 95 },
  { id: "p3", name: "Course Landing Page", client: "Nora Kim", color: "#a08472", rate: 110 },
  { id: "p4", name: "App Onboarding UX", client: "Bolt Fitness", color: "#8a7e63", rate: 105 },
];

const ENTRIES = [
  { id: 1, project: "p1", desc: "Typography section revisions", start: "9:00 AM", end: "11:30 AM", duration: 9000, date: "Today", tags: ["design", "revisions"] },
  { id: 2, project: "p3", desc: "Wireframe iteration #3", start: "12:00 PM", end: "2:15 PM", duration: 8100, date: "Today", tags: ["wireframe"] },
  { id: 3, project: "p1", desc: "Color palette exploration", start: "2:45 PM", end: null, duration: 0, date: "Today", tags: ["design"], active: true },
  { id: 4, project: "p2", desc: "Homepage copy draft", start: "9:15 AM", end: "11:00 AM", duration: 6300, date: "Yesterday", tags: ["copywriting"] },
  { id: 5, project: "p4", desc: "Onboarding flow mapping", start: "11:30 AM", end: "1:00 PM", duration: 5400, date: "Yesterday", tags: ["ux"] },
  { id: 6, project: "p1", desc: "Logo sizing matrix", start: "2:00 PM", end: "4:30 PM", duration: 9000, date: "Yesterday", tags: ["design"] },
  { id: 7, project: "p3", desc: "Competitive analysis", start: "9:00 AM", end: "10:45 AM", duration: 6300, date: "Mon, Mar 28", tags: ["research"] },
];

const WEEK_DATA = [
  { day: "Mon", hours: 6.2 },
  { day: "Tue", hours: 7.8 },
  { day: "Wed", hours: 5.4 },
  { day: "Thu", hours: 8.1 },
  { day: "Fri", hours: 6.5 },
  { day: "Sat", hours: 1.2 },
  { day: "Sun", hours: 0 },
];

function formatDuration(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TimeTracker() {
  const [timerActive, setTimerActive] = useState(true);
  const [elapsed, setElapsed] = useState(2847); // pretend ~47 minutes in
  const [timerProject, setTimerProject] = useState("p1");
  const [timerDesc, setTimerDesc] = useState("Color palette exploration");
  const [showProjectPicker, setShowProjectPicker] = useState(false);

  useEffect(() => {
    if (!timerActive) return;
    const i = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(i);
  }, [timerActive]);

  const proj = PROJECTS.find(p => p.id === timerProject);
  const totalWeekHours = WEEK_DATA.reduce((s, d) => s + d.hours, 0);
  const maxDayHours = Math.max(...WEEK_DATA.map(d => d.hours));
  const todayEntries = ENTRIES.filter(e => e.date === "Today");
  const yesterdayEntries = ENTRIES.filter(e => e.date === "Yesterday");
  const olderEntries = ENTRIES.filter(e => e.date !== "Today" && e.date !== "Yesterday");
  const todayTotal = todayEntries.reduce((s, e) => s + (e.active ? elapsed : e.duration), 0);
  const earnedToday = Math.round((todayTotal / 3600) * (proj?.rate || 95));

  // Group by project for summary
  const projectSummary = PROJECTS.map(p => {
    const entries = ENTRIES.filter(e => e.project === p.id);
    const totalSecs = entries.reduce((s, e) => s + (e.active ? elapsed : e.duration), 0);
    return { ...p, totalSecs, totalHours: (totalSecs / 3600).toFixed(1), earned: Math.round((totalSecs / 3600) * p.rate) };
  }).filter(p => p.totalSecs > 0);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
        .tt{font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink-700);background:var(--parchment);height:100vh;display:flex;flex-direction:column}

        .tt-head{padding:16px 24px;border-bottom:1px solid var(--warm-200);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
        .tt-head-left{display:flex;align-items:center;gap:14px}
        .tt-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--ink-900)}
        .tt-head-right{display:flex;gap:5px}
        .tt-btn{padding:7px 16px;border-radius:6px;font-size:12px;font-weight:500;font-family:inherit;cursor:pointer;border:1px solid var(--warm-200);background:#fff;color:var(--ink-600);transition:all .08s;display:flex;align-items:center;gap:5px}
        .tt-btn:hover{background:var(--warm-50)}

        /* ── Active timer ── */
        .tt-timer{padding:20px 24px;border-bottom:1px solid var(--warm-200);background:#fff;display:flex;align-items:center;gap:16px;flex-shrink:0}
        .tt-timer-pulse{width:10px;height:10px;border-radius:50%;background:#5a9a3c;animation:ttPulse 2s ease infinite;flex-shrink:0}
        @keyframes ttPulse{0%,100%{opacity:.4;box-shadow:0 0 0 0 rgba(90,154,60,0.2)}50%{opacity:1;box-shadow:0 0 0 6px rgba(90,154,60,0)}}
        .tt-timer.paused .tt-timer-pulse{background:var(--warm-300);animation:none}

        .tt-timer-desc-wrap{flex:1;display:flex;flex-direction:column;gap:2px}
        .tt-timer-desc{font-size:15px;color:var(--ink-800);font-weight:500;border:none;outline:none;font-family:inherit;background:transparent;width:100%}
        .tt-timer-desc::placeholder{color:var(--warm-400)}
        .tt-timer-project{display:flex;align-items:center;gap:6px;cursor:pointer;position:relative}
        .tt-timer-project-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
        .tt-timer-project-name{font-family:var(--mono);font-size:11px;color:var(--ink-400)}
        .tt-timer-project-client{font-family:var(--mono);font-size:10px;color:var(--ink-300)}

        .tt-timer-display{font-family:var(--mono);font-size:28px;font-weight:600;color:var(--ink-900);letter-spacing:-0.02em;font-variant-numeric:tabular-nums;flex-shrink:0}
        .tt-timer.paused .tt-timer-display{color:var(--ink-300)}

        .tt-timer-rate{font-family:var(--mono);font-size:12px;color:var(--ink-300);flex-shrink:0;text-align:right}
        .tt-timer-rate-val{color:#5a9a3c;font-weight:500;font-size:14px;display:block}

        .tt-timer-controls{display:flex;gap:4px;flex-shrink:0}
        .tt-timer-btn{width:40px;height:40px;border-radius:10px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:all .1s}
        .tt-timer-stop{background:#c24b38;color:#fff}
        .tt-timer-stop:hover{background:#a83d2d}
        .tt-timer-pause{background:var(--ink-900);color:#fff}
        .tt-timer-pause:hover{background:var(--ink-800)}
        .tt-timer-play{background:#5a9a3c;color:#fff}
        .tt-timer-play:hover{background:#4a8a2c}

        /* Project picker */
        .tt-proj-picker{position:absolute;top:calc(100% + 6px);left:0;width:260px;background:#fff;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,.1),0 0 0 1px rgba(0,0,0,.04);padding:4px;z-index:50;animation:ttIn .12s ease}
        @keyframes ttIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        .tt-proj-option{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;transition:background .06s}
        .tt-proj-option:hover{background:var(--ember-bg)}
        .tt-proj-option-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0}
        .tt-proj-option-name{font-size:13px;color:var(--ink-700)}
        .tt-proj-option-client{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .tt-proj-option-rate{font-family:var(--mono);font-size:10px;color:var(--ink-300);margin-left:auto}

        /* ── Layout ── */
        .tt-layout{flex:1;display:flex;overflow:hidden}

        /* ── Timesheet ── */
        .tt-sheet{flex:1;overflow-y:auto;padding:0}
        .tt-sheet::-webkit-scrollbar{width:4px}.tt-sheet::-webkit-scrollbar-thumb{background:rgba(0,0,0,.04);border-radius:99px}

        .tt-group{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.1em;padding:14px 24px 6px;display:flex;align-items:center;gap:8px}
        .tt-group::after{content:'';flex:1;height:1px;background:var(--warm-100)}
        .tt-group-total{color:var(--ink-300);margin-left:auto;padding-left:8px;text-transform:none;letter-spacing:0}

        .tt-entry{display:flex;align-items:center;gap:12px;padding:10px 24px;border-bottom:1px solid var(--warm-100);cursor:pointer;transition:background .06s}
        .tt-entry:hover{background:var(--warm-50)}
        .tt-entry.active{background:rgba(90,154,60,0.02);border-left:3px solid #5a9a3c;padding-left:21px}

        .tt-entry-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0}
        .tt-entry-info{flex:1;min-width:0}
        .tt-entry-desc{font-size:14px;color:var(--ink-700)}
        .tt-entry.active .tt-entry-desc{font-weight:500}
        .tt-entry-meta{display:flex;align-items:center;gap:6px;margin-top:2px;font-size:12px;color:var(--ink-400)}
        .tt-entry-tag{font-family:var(--mono);font-size:9px;color:var(--ink-400);background:var(--warm-100);padding:0 5px;border-radius:2px}

        .tt-entry-time{font-family:var(--mono);font-size:11px;color:var(--ink-300);flex-shrink:0;text-align:right;min-width:100px}
        .tt-entry-duration{font-family:var(--mono);font-size:14px;font-weight:500;color:var(--ink-700);flex-shrink:0;min-width:70px;text-align:right;font-variant-numeric:tabular-nums}
        .tt-entry.active .tt-entry-duration{color:#5a9a3c}
        .tt-entry-earned{font-family:var(--mono);font-size:11px;color:var(--ink-300);flex-shrink:0;min-width:50px;text-align:right}

        /* ── Sidebar summary ── */
        .tt-summary{width:300px;flex-shrink:0;border-left:1px solid var(--warm-100);overflow-y:auto;background:var(--warm-50);padding:20px}
        .tt-summary::-webkit-scrollbar{width:3px}.tt-summary::-webkit-scrollbar-thumb{background:rgba(0,0,0,.04);border-radius:99px}

        .tt-sum-title{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;display:flex;align-items:center;gap:8px}
        .tt-sum-title::after{content:'';flex:1;height:1px;background:var(--warm-200)}

        /* Week chart */
        .tt-week{display:flex;gap:6px;height:80px;align-items:flex-end;margin-bottom:16px}
        .tt-week-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px}
        .tt-week-bar{width:100%;border-radius:3px;min-height:2px;transition:height .3s ease}
        .tt-week-label{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
        .tt-week-val{font-family:var(--mono);font-size:9px;color:var(--ink-400);font-weight:500}

        /* Summary stats */
        .tt-sum-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
        .tt-sum-stat{padding:12px;border:1px solid var(--warm-200);border-radius:8px;background:#fff;text-align:center}
        .tt-sum-stat-val{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--ink-900);line-height:1}
        .tt-sum-stat-val.green{color:#5a9a3c}
        .tt-sum-stat-val.ember{color:var(--ember)}
        .tt-sum-stat-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em;margin-top:3px}

        /* Project breakdown */
        .tt-sum-projects{display:flex;flex-direction:column;gap:6px}
        .tt-sum-project{padding:10px 12px;border:1px solid var(--warm-200);border-radius:7px;background:#fff}
        .tt-sum-proj-top{display:flex;align-items:center;gap:6px;margin-bottom:4px}
        .tt-sum-proj-dot{width:6px;height:6px;border-radius:2px;flex-shrink:0}
        .tt-sum-proj-name{font-size:13px;font-weight:500;color:var(--ink-700);flex:1}
        .tt-sum-proj-hours{font-family:var(--mono);font-size:12px;font-weight:500;color:var(--ink-600)}
        .tt-sum-proj-bar{height:3px;background:var(--warm-200);border-radius:2px;overflow:hidden;margin-bottom:4px}
        .tt-sum-proj-fill{height:100%;border-radius:2px;transition:width .3s}
        .tt-sum-proj-meta{display:flex;justify-content:space-between;font-family:var(--mono);font-size:10px;color:var(--ink-300)}

        .tt-foot{padding:6px 24px;border-top:1px solid var(--warm-100);font-family:var(--mono);font-size:10px;color:var(--ink-300);display:flex;justify-content:space-between;flex-shrink:0}
      `}</style>

      <div className="tt">
        <div className="tt-head">
          <div className="tt-head-left">
            <span className="tt-title">Time</span>
          </div>
          <div className="tt-head-right">
            <button className="tt-btn">This Week ▾</button>
            <button className="tt-btn">Export</button>
          </div>
        </div>

        {/* Active timer */}
        <div className={`tt-timer${!timerActive ? " paused" : ""}`}>
          {timerActive && <div className="tt-timer-pulse" />}
          <div className="tt-timer-desc-wrap">
            <input className="tt-timer-desc" value={timerDesc} onChange={e => setTimerDesc(e.target.value)} placeholder="What are you working on?" />
            <div className="tt-timer-project" onClick={() => setShowProjectPicker(!showProjectPicker)}>
              <span className="tt-timer-project-dot" style={{ background: proj?.color }} />
              <span className="tt-timer-project-name">{proj?.name}</span>
              <span className="tt-timer-project-client">{proj?.client}</span>
              <span style={{ fontSize: 8, color: "var(--ink-300)" }}>▾</span>
              {showProjectPicker && (
                <div className="tt-proj-picker" onClick={e => e.stopPropagation()}>
                  {PROJECTS.map(p => (
                    <div key={p.id} className="tt-proj-option" onClick={() => { setTimerProject(p.id); setShowProjectPicker(false); }}>
                      <span className="tt-proj-option-dot" style={{ background: p.color }} />
                      <div>
                        <div className="tt-proj-option-name">{p.name}</div>
                        <div className="tt-proj-option-client">{p.client}</div>
                      </div>
                      <span className="tt-proj-option-rate">${p.rate}/hr</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="tt-timer-display">{formatDuration(elapsed)}</div>

          <div className="tt-timer-rate">
            <span className="tt-timer-rate-val">${((elapsed / 3600) * (proj?.rate || 95)).toFixed(2)}</span>
            earning @ ${proj?.rate}/hr
          </div>

          <div className="tt-timer-controls">
            {timerActive ? (
              <>
                <button className="tt-timer-btn tt-timer-pause" onClick={() => setTimerActive(false)} title="Pause">❚❚</button>
                <button className="tt-timer-btn tt-timer-stop" onClick={() => setTimerActive(false)} title="Stop">■</button>
              </>
            ) : (
              <button className="tt-timer-btn tt-timer-play" onClick={() => setTimerActive(true)} title="Resume">▶</button>
            )}
          </div>
        </div>

        <div className="tt-layout">
          {/* Timesheet */}
          <div className="tt-sheet">
            {/* Today */}
            <div className="tt-group">Today<span className="tt-group-total">{(todayTotal / 3600).toFixed(1)}h · ${earnedToday}</span></div>
            {todayEntries.map(e => {
              const p = PROJECTS.find(pr => pr.id === e.project);
              const dur = e.active ? elapsed : e.duration;
              const earned = Math.round((dur / 3600) * (p?.rate || 95));
              return (
                <div key={e.id} className={`tt-entry${e.active ? " active" : ""}`}>
                  <span className="tt-entry-dot" style={{ background: p?.color }} />
                  <div className="tt-entry-info">
                    <div className="tt-entry-desc">{e.desc}</div>
                    <div className="tt-entry-meta">
                      <span>{p?.name}</span>
                      {e.tags?.map((t, i) => <span key={i} className="tt-entry-tag">{t}</span>)}
                    </div>
                  </div>
                  <span className="tt-entry-time">{e.start}{e.end ? ` — ${e.end}` : " — now"}</span>
                  <span className="tt-entry-duration">{formatDuration(dur)}</span>
                  <span className="tt-entry-earned">${earned}</span>
                </div>
              );
            })}

            {/* Yesterday */}
            {yesterdayEntries.length > 0 && (
              <>
                <div className="tt-group">Yesterday<span className="tt-group-total">{(yesterdayEntries.reduce((s, e) => s + e.duration, 0) / 3600).toFixed(1)}h</span></div>
                {yesterdayEntries.map(e => {
                  const p = PROJECTS.find(pr => pr.id === e.project);
                  const earned = Math.round((e.duration / 3600) * (p?.rate || 95));
                  return (
                    <div key={e.id} className="tt-entry">
                      <span className="tt-entry-dot" style={{ background: p?.color }} />
                      <div className="tt-entry-info">
                        <div className="tt-entry-desc">{e.desc}</div>
                        <div className="tt-entry-meta">
                          <span>{p?.name}</span>
                          {e.tags?.map((t, i) => <span key={i} className="tt-entry-tag">{t}</span>)}
                        </div>
                      </div>
                      <span className="tt-entry-time">{e.start} — {e.end}</span>
                      <span className="tt-entry-duration">{formatDuration(e.duration)}</span>
                      <span className="tt-entry-earned">${earned}</span>
                    </div>
                  );
                })}
              </>
            )}

            {/* Older */}
            {olderEntries.length > 0 && (
              <>
                <div className="tt-group">Earlier this week</div>
                {olderEntries.map(e => {
                  const p = PROJECTS.find(pr => pr.id === e.project);
                  const earned = Math.round((e.duration / 3600) * (p?.rate || 95));
                  return (
                    <div key={e.id} className="tt-entry">
                      <span className="tt-entry-dot" style={{ background: p?.color }} />
                      <div className="tt-entry-info">
                        <div className="tt-entry-desc">{e.desc}</div>
                        <div className="tt-entry-meta">
                          <span>{p?.name} · {e.date}</span>
                          {e.tags?.map((t, i) => <span key={i} className="tt-entry-tag">{t}</span>)}
                        </div>
                      </div>
                      <span className="tt-entry-time">{e.start} — {e.end}</span>
                      <span className="tt-entry-duration">{formatDuration(e.duration)}</span>
                      <span className="tt-entry-earned">${earned}</span>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Summary sidebar */}
          <div className="tt-summary">
            <div className="tt-sum-title">This week</div>
            <div className="tt-week">
              {WEEK_DATA.map((d, i) => {
                const isToday = i === 3;
                return (
                  <div key={i} className="tt-week-col">
                    <span className="tt-week-val">{d.hours > 0 ? d.hours : ""}</span>
                    <div className="tt-week-bar" style={{
                      height: `${maxDayHours > 0 ? (d.hours / maxDayHours) * 100 : 0}%`,
                      background: isToday ? "var(--ember)" : d.hours > 0 ? "var(--warm-300)" : "var(--warm-200)",
                    }} />
                    <span className="tt-week-label" style={isToday ? { color: "var(--ember)", fontWeight: 500 } : {}}>{d.day}</span>
                  </div>
                );
              })}
            </div>

            <div className="tt-sum-stats">
              <div className="tt-sum-stat">
                <div className="tt-sum-stat-val">{totalWeekHours.toFixed(1)}h</div>
                <div className="tt-sum-stat-label">Total hours</div>
              </div>
              <div className="tt-sum-stat">
                <div className="tt-sum-stat-val green">${Math.round(totalWeekHours * 100)}</div>
                <div className="tt-sum-stat-label">Earned</div>
              </div>
              <div className="tt-sum-stat">
                <div className="tt-sum-stat-val ember">${Math.round(ENTRIES.reduce((s, e) => s + (e.active ? elapsed : e.duration), 0) / 3600 / ENTRIES.length * 100) || 0}</div>
                <div className="tt-sum-stat-label">Effective rate</div>
              </div>
              <div className="tt-sum-stat">
                <div className="tt-sum-stat-val">{ENTRIES.length}</div>
                <div className="tt-sum-stat-label">Entries</div>
              </div>
            </div>

            <div className="tt-sum-title">By project</div>
            <div className="tt-sum-projects">
              {projectSummary.map(p => {
                const maxHours = Math.max(...projectSummary.map(pp => parseFloat(pp.totalHours)));
                return (
                  <div key={p.id} className="tt-sum-project">
                    <div className="tt-sum-proj-top">
                      <span className="tt-sum-proj-dot" style={{ background: p.color }} />
                      <span className="tt-sum-proj-name">{p.name}</span>
                      <span className="tt-sum-proj-hours">{p.totalHours}h</span>
                    </div>
                    <div className="tt-sum-proj-bar">
                      <div className="tt-sum-proj-fill" style={{ width: `${(parseFloat(p.totalHours) / maxHours) * 100}%`, background: p.color, opacity: 0.5 }} />
                    </div>
                    <div className="tt-sum-proj-meta">
                      <span>{p.client}</span>
                      <span>${p.earned} @ ${p.rate}/hr</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="tt-foot">
          <span>Felmark Time · {ENTRIES.length} entries this week</span>
          <span>Timer auto-saves every 30s</span>
        </div>
      </div>
    </>
  );
}
