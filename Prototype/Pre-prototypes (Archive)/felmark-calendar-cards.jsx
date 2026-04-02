import { useState } from "react";

const EVENTS = [
  {
    id: 1, title: "Brand review call", type: "meeting", client: "Meridian Studio", clientAvatar: "M", clientColor: "#7c8594",
    day: 0, startHour: 9, duration: 60, revenue: null, progress: null,
    attendees: [{ n: "S", c: "#8a7e63" }, { n: "J", c: "#7c8594" }],
    priority: "high", status: "upcoming", notes: "Review mood board direction", link: "meet.google.com/abc",
  },
  {
    id: 2, title: "Typography research", type: "deep-work", client: "Meridian Studio", clientAvatar: "M", clientColor: "#7c8594",
    day: 1, startHour: 9, duration: 120, revenue: null, progress: 45,
    priority: "medium", status: "in-progress", deliverable: "Typography scale",
  },
  {
    id: 3, title: "Landing page wireframe", type: "deep-work", client: "Nora Kim", clientAvatar: "N", clientColor: "#a08472",
    day: 2, startHour: 10, duration: 180, revenue: 800, progress: 25,
    priority: "medium", status: "in-progress", deliverable: "Course Landing Page",
  },
  {
    id: 4, title: "Color palette finalize", type: "deep-work", client: "Meridian Studio", clientAvatar: "M", clientColor: "#7c8594",
    day: 3, startHour: 9, duration: 120, revenue: null, progress: 80,
    priority: "high", status: "review", deliverable: "Color palette",
  },
  {
    id: 5, title: "Email sequence outline", type: "deep-work", client: "Nora Kim", clientAvatar: "N", clientColor: "#a08472",
    day: 4, startHour: 10, duration: 120, revenue: 400, progress: 10,
    priority: "low", status: "in-progress", deliverable: "Email Sequence",
  },
  {
    id: 6, title: "Logo guidelines draft", type: "deep-work", client: "Meridian Studio", clientAvatar: "M", clientColor: "#7c8594",
    day: 0, startHour: 10.5, duration: 150, revenue: 600, progress: 65,
    priority: "high", status: "in-progress", deliverable: "Logo usage rules",
  },
  {
    id: 7, title: "Nora kickoff call", type: "meeting", client: "Nora Kim", clientAvatar: "N", clientColor: "#a08472",
    day: 1, startHour: 14, duration: 45, revenue: null, progress: null,
    attendees: [{ n: "N", c: "#a08472" }],
    priority: "high", status: "upcoming", notes: "Discuss landing page scope", link: "zoom.us/j/123",
  },
  {
    id: 8, title: "Bolt onboarding review", type: "meeting", client: "Bolt Fitness", clientAvatar: "B", clientColor: "#8a7e63",
    day: 2, startHour: 15, duration: 60, revenue: null, progress: null,
    attendees: [{ n: "T", c: "#8a7e63" }],
    priority: "urgent", status: "overdue", notes: "Project is 4 days overdue — need action plan",
  },
  {
    id: 9, title: "Social templates — IG", type: "deep-work", client: "Meridian Studio", clientAvatar: "M", clientColor: "#7c8594",
    day: 3, startHour: 13, duration: 150, revenue: 350, progress: 15,
    priority: "medium", status: "in-progress", deliverable: "Social Media Kit",
  },
  {
    id: 10, title: "Blog post draft", type: "deep-work", client: "Bolt Fitness", clientAvatar: "B", clientColor: "#8a7e63",
    day: 4, startHour: 14, duration: 120, revenue: 200, progress: 15,
    priority: "low", status: "in-progress", deliverable: "Monthly Blog Posts",
  },
  {
    id: 11, title: "Client delivery — Meridian", type: "deadline", client: "Meridian Studio", clientAvatar: "M", clientColor: "#7c8594",
    day: 5, startHour: 11, duration: 60, revenue: 2400, progress: 100,
    priority: "urgent", status: "deadline",
  },
  {
    id: 12, title: "Weekly review", type: "personal", client: "Personal", clientAvatar: "✦", clientColor: "#5c5c53",
    day: 4, startHour: 16.5, duration: 30, revenue: null, progress: null,
    priority: "low", status: "upcoming",
  },
];

const DAYS = ["Mon 24", "Tue 25", "Wed 26", "Thu 27", "Fri 28", "Sat 29", "Sun 30"];
const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const HOUR_H = 72;
const TODAY = 5;

const TYPE_CONFIG = {
  "meeting": { accent: "#5b7fa4", icon: "◎", label: "Meeting" },
  "deep-work": { accent: "#b07d4f", icon: "◆", label: "Deep Work" },
  "deadline": { accent: "#c24b38", icon: "⚑", label: "Deadline" },
  "personal": { accent: "#7c6b9e", icon: "✦", label: "Personal" },
};

const PRIORITY_CONFIG = {
  urgent: { color: "#c24b38", dot: true },
  high: { color: "#b07d4f", dot: true },
  medium: { color: "#5b7fa4", dot: false },
  low: { color: "#9b988f", dot: false },
};

const STATUS_CONFIG = {
  "upcoming": { color: "#9b988f", label: "Upcoming" },
  "in-progress": { color: "#b07d4f", label: "In Progress" },
  "review": { color: "#5b7fa4", label: "In Review" },
  "overdue": { color: "#c24b38", label: "Overdue" },
  "deadline": { color: "#c24b38", label: "Deadline" },
  "completed": { color: "#5a9a3c", label: "Done" },
};

export default function CalendarCardsMinimal() {
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const selected = EVENTS.find(e => e.id === selectedEvent);

  const formatTime = (h) => {
    const hr = Math.floor(h);
    const min = Math.round((h - hr) * 60);
    const ampm = hr >= 12 ? "PM" : "AM";
    const hr12 = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
    return hr12 + ":" + String(min).padStart(2, "0") + " " + ampm;
  };
  const formatDuration = (mins) => {
    if (mins < 60) return mins + "m";
    const h = Math.floor(mins / 60), m = mins % 60;
    return m > 0 ? h + "h " + m + "m" : h + "h";
  };

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
        .cal { font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--ink-700); background: var(--parchment); height: 100vh; display: flex; flex-direction: column; }
        .cal-wrap { flex: 1; overflow: auto; display: flex; }
        .cal-wrap::-webkit-scrollbar { width: 5px; height: 5px; }
        .cal-wrap::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 99px; }
        .cal-gutter { width: 52px; flex-shrink: 0; border-right: 1px solid var(--warm-200); background: var(--parchment); position: sticky; left: 0; z-index: 5; }
        .cal-gutter-head { height: 48px; border-bottom: 1px solid var(--warm-200); }
        .cal-gutter-label { height: 72px; display: flex; align-items: flex-start; justify-content: flex-end; padding: 0 8px; font-family: var(--mono); font-size: 10px; color: var(--ink-300); transform: translateY(-6px); }
        .cal-days { display: flex; flex: 1; }
        .cal-day { flex: 1; min-width: 180px; border-right: 1px solid var(--warm-100); position: relative; }
        .cal-day:last-child { border-right: none; }
        .cal-day.today { background: rgba(176,125,79,0.015); }
        .cal-day-head { height: 48px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-bottom: 1px solid var(--warm-200); position: sticky; top: 0; z-index: 4; background: var(--parchment); }
        .cal-day.today .cal-day-head { background: var(--parchment); }
        .cal-day-name { font-size: 11px; color: var(--ink-400); }
        .cal-day-num { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: var(--ink-800); }
        .cal-day.today .cal-day-num { color: var(--ember); }
        .cal-hour { height: 72px; border-bottom: 1px solid var(--warm-100); position: relative; }
        .cal-hour-half { position: absolute; top: 50%; left: 0; right: 0; border-top: 1px dashed rgba(0,0,0,0.02); }

        /* ═══ EVENT CARD — MINIMAL PARCHMENT ═══ */
        .ev { position: absolute; left: 4px; right: 4px; border-radius: 7px; cursor: pointer; overflow: hidden; z-index: 2; transition: all 0.15s; display: flex; flex-direction: column; background: #fff; border: 1px solid var(--warm-200); }
        .ev:hover { z-index: 10; transform: translateY(-1px); border-color: var(--warm-300); box-shadow: 0 3px 12px rgba(0,0,0,0.05); }
        .ev.is-overdue { background: #fff; border-color: rgba(194,75,56,0.15); }
        .ev.is-overdue:hover { border-color: rgba(194,75,56,0.25); box-shadow: 0 3px 12px rgba(194,75,56,0.06); }
        .ev.is-deadline { border-color: rgba(194,75,56,0.12); }

        .ev-rail { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; border-radius: 3px 0 0 3px; }
        .ev-inner { padding: 6px 8px 6px 11px; display: flex; flex-direction: column; flex: 1; min-height: 0; }

        .ev-top { display: flex; align-items: center; gap: 4px; margin-bottom: 2px; }
        .ev-priority-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; }
        .ev-type-icon { font-size: 9px; flex-shrink: 0; }
        .ev-status-chip { font-family: var(--mono); font-size: 8px; font-weight: 500; padding: 0 5px; border-radius: 2px; display: inline-flex; align-items: center; gap: 3px; }
        .ev-status-dot { width: 3px; height: 3px; border-radius: 50%; }
        .ev-revenue { font-family: var(--mono); font-size: 9px; font-weight: 500; color: #5a9a3c; background: rgba(90,154,60,0.05); padding: 0 5px; border-radius: 2px; flex-shrink: 0; }
        .ev-time-label { font-family: var(--mono); font-size: 9px; color: var(--ink-300); margin-left: auto; flex-shrink: 0; }

        .ev-title { font-size: 12.5px; font-weight: 500; color: var(--ink-800); line-height: 1.3; margin-bottom: 1px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; }
        .ev-client { display: flex; align-items: center; gap: 4px; }
        .ev-client-av { width: 13px; height: 13px; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 7px; font-weight: 700; color: #fff; flex-shrink: 0; }
        .ev-client-text { font-size: 10.5px; color: var(--ink-400); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .ev-progress { display: flex; align-items: center; gap: 5px; margin-top: auto; padding-top: 3px; }
        .ev-progress-bar { flex: 1; height: 2px; background: var(--warm-200); border-radius: 1px; overflow: hidden; }
        .ev-progress-fill { height: 100%; border-radius: 1px; transition: width 0.4s; }
        .ev-progress-pct { font-family: var(--mono); font-size: 9px; color: var(--ink-300); flex-shrink: 0; }

        .ev-attendees { display: flex; margin-top: auto; padding-top: 3px; }
        .ev-attendee { width: 15px; height: 15px; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 7px; font-weight: 700; color: #fff; margin-right: -3px; border: 1.5px solid #fff; }
        .ev-link { font-family: var(--mono); font-size: 9px; color: var(--ink-300); margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        /* ═══ POPOVER ═══ */
        .pop-overlay { position: fixed; inset: 0; z-index: 99; }
        .pop { position: fixed; width: 300px; background: #fff; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04); z-index: 100; overflow: hidden; animation: popIn 0.15s ease; }
        @keyframes popIn { from { opacity: 0; transform: scale(0.96) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .pop-accent { height: 3px; }
        .pop-body { padding: 14px 18px; }
        .pop-type { font-family: var(--mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; display: flex; align-items: center; gap: 5px; }
        .pop-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: var(--ink-900); margin-bottom: 3px; }
        .pop-client { font-size: 13px; color: var(--ink-400); margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
        .pop-client-av { width: 18px; height: 18px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 600; color: #fff; }
        .pop-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px; }
        .pop-stat { padding: 7px 9px; background: var(--warm-50); border: 1px solid var(--warm-100); border-radius: 5px; }
        .pop-stat-label { font-family: var(--mono); font-size: 8px; color: var(--ink-300); text-transform: uppercase; letter-spacing: 0.06em; }
        .pop-stat-val { font-family: var(--mono); font-size: 13px; font-weight: 600; color: var(--ink-800); margin-top: 1px; }
        .pop-progress { margin-bottom: 10px; }
        .pop-progress-head { display: flex; justify-content: space-between; margin-bottom: 3px; }
        .pop-progress-label { font-size: 12px; color: var(--ink-400); }
        .pop-progress-pct { font-family: var(--mono); font-size: 11px; font-weight: 500; }
        .pop-progress-bar { height: 4px; background: var(--warm-200); border-radius: 2px; overflow: hidden; }
        .pop-progress-fill { height: 100%; border-radius: 2px; }
        .pop-notes { font-size: 13px; color: var(--ink-500); line-height: 1.5; padding: 8px 10px; background: var(--warm-50); border-radius: 5px; margin-bottom: 10px; border-left: 2px solid var(--warm-300); }
        .pop-attendees { display: flex; gap: 5px; margin-bottom: 10px; }
        .pop-att { display: flex; align-items: center; gap: 4px; padding: 3px 7px; background: var(--warm-50); border-radius: 4px; font-size: 11px; color: var(--ink-600); }
        .pop-att-av { width: 18px; height: 18px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 600; color: #fff; }
        .pop-actions { display: flex; gap: 5px; }
        .pop-btn { flex: 1; padding: 7px; border-radius: 5px; font-size: 12px; font-weight: 500; font-family: inherit; cursor: pointer; text-align: center; transition: all 0.1s; }
        .pop-btn-primary { background: var(--ember); border: none; color: #fff; }
        .pop-btn-primary:hover { background: var(--ember-light); }
        .pop-btn-ghost { background: none; border: 1px solid var(--warm-200); color: var(--ink-600); }
        .pop-btn-ghost:hover { background: var(--warm-50); }
      `}</style>

      <div className="cal">
        <div className="cal-wrap">
          <div className="cal-gutter">
            <div className="cal-gutter-head" />
            {HOURS.map(h => (<div key={h} className="cal-gutter-label">{h === 12 ? "12pm" : h > 12 ? (h-12)+"pm" : h+"am"}</div>))}
          </div>
          <div className="cal-days">
            {DAYS.map((day, di) => {
              const dayEvents = EVENTS.filter(e => e.day === di);
              const isToday = di === TODAY;
              return (
                <div key={di} className={"cal-day" + (isToday ? " today" : "")}>
                  <div className="cal-day-head">
                    <span className="cal-day-name">{day.split(" ")[0]}</span>
                    <span className="cal-day-num">{day.split(" ")[1]}</span>
                  </div>
                  {HOURS.map(h => (<div key={h} className="cal-hour"><div className="cal-hour-half" /></div>))}
                  {dayEvents.map(ev => {
                    const top = (ev.startHour - HOURS[0]) * HOUR_H;
                    const height = Math.max((ev.duration / 60) * HOUR_H, 36);
                    const typeCfg = TYPE_CONFIG[ev.type];
                    const priorityCfg = PRIORITY_CONFIG[ev.priority];
                    const statusCfg = STATUS_CONFIG[ev.status];
                    const isOverdue = ev.status === "overdue";
                    const isDeadline = ev.type === "deadline";
                    const isSmall = height < 60;
                    const isTiny = height < 44;
                    return (
                      <div key={ev.id}
                        className={"ev" + (isOverdue ? " is-overdue" : "") + (isDeadline ? " is-deadline" : "")}
                        style={{ top: top, height: height }}
                        onMouseEnter={() => setHoveredEvent(ev.id)}
                        onMouseLeave={() => setHoveredEvent(null)}
                        onClick={() => setSelectedEvent(selectedEvent === ev.id ? null : ev.id)}>
                        <div className="ev-rail" style={{ background: typeCfg.accent }} />
                        <div className="ev-inner">
                          <div className="ev-top">
                            {priorityCfg.dot && <span className="ev-priority-dot" style={{ background: priorityCfg.color }} />}
                            <span className="ev-type-icon" style={{ color: typeCfg.accent }}>{typeCfg.icon}</span>
                            {ev.status !== "upcoming" && !isTiny && (
                              <span className="ev-status-chip" style={{ color: statusCfg.color, background: statusCfg.color + "08" }}>
                                <span className="ev-status-dot" style={{ background: statusCfg.color }} />
                                {statusCfg.label}
                              </span>
                            )}
                            {ev.revenue && !isTiny && <span className="ev-revenue">${ev.revenue.toLocaleString()}</span>}
                            <span className="ev-time-label">{formatDuration(ev.duration)}</span>
                          </div>
                          <div className="ev-title" style={{ WebkitLineClamp: isTiny ? 1 : 2 }}>{ev.title}</div>
                          {!isTiny && (
                            <div className="ev-client">
                              <div className="ev-client-av" style={{ background: ev.clientColor }}>{ev.clientAvatar}</div>
                              <span className="ev-client-text">{ev.client} · {formatTime(ev.startHour)}</span>
                            </div>
                          )}
                          {ev.link && !isSmall && <div className="ev-link">↗ {ev.link}</div>}
                          {ev.attendees && !isSmall && (
                            <div className="ev-attendees">
                              {ev.attendees.map((a, ai) => (<div key={ai} className="ev-attendee" style={{ background: a.c }}>{a.n}</div>))}
                            </div>
                          )}
                          {ev.progress !== null && ev.progress < 100 && !isTiny && (
                            <div className="ev-progress">
                              <div className="ev-progress-bar"><div className="ev-progress-fill" style={{ width: ev.progress + "%", background: typeCfg.accent }} /></div>
                              <span className="ev-progress-pct">{ev.progress}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {selected && (
          <>
            <div className="pop-overlay" onClick={() => setSelectedEvent(null)} />
            <div className="pop" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
              <div className="pop-accent" style={{ background: TYPE_CONFIG[selected.type].accent }} />
              <div className="pop-body">
                <div className="pop-type" style={{ color: TYPE_CONFIG[selected.type].accent }}>
                  {TYPE_CONFIG[selected.type].icon} {TYPE_CONFIG[selected.type].label}
                  {selected.priority === "urgent" && <span style={{ color: "#c24b38", marginLeft: 4 }}>● URGENT</span>}
                </div>
                <div className="pop-title">{selected.title}</div>
                <div className="pop-client">
                  <span className="pop-client-av" style={{ background: selected.clientColor }}>{selected.clientAvatar}</span>
                  {selected.client}
                </div>
                <div className="pop-grid">
                  <div className="pop-stat"><div className="pop-stat-label">Time</div><div className="pop-stat-val">{formatTime(selected.startHour)}</div></div>
                  <div className="pop-stat"><div className="pop-stat-label">Duration</div><div className="pop-stat-val">{formatDuration(selected.duration)}</div></div>
                  <div className="pop-stat"><div className="pop-stat-label">Status</div><div className="pop-stat-val" style={{ color: STATUS_CONFIG[selected.status].color }}>{STATUS_CONFIG[selected.status].label}</div></div>
                  {selected.revenue && <div className="pop-stat"><div className="pop-stat-label">Revenue</div><div className="pop-stat-val" style={{ color: "#5a9a3c" }}>${selected.revenue.toLocaleString()}</div></div>}
                </div>
                {selected.progress !== null && (
                  <div className="pop-progress">
                    <div className="pop-progress-head">
                      <span className="pop-progress-label">{selected.deliverable || "Progress"}</span>
                      <span className="pop-progress-pct" style={{ color: TYPE_CONFIG[selected.type].accent }}>{selected.progress}%</span>
                    </div>
                    <div className="pop-progress-bar"><div className="pop-progress-fill" style={{ width: selected.progress + "%", background: TYPE_CONFIG[selected.type].accent }} /></div>
                  </div>
                )}
                {selected.notes && <div className="pop-notes">{selected.notes}</div>}
                {selected.attendees && (
                  <div className="pop-attendees">
                    {selected.attendees.map((a, i) => (
                      <div key={i} className="pop-att"><span className="pop-att-av" style={{ background: a.c }}>{a.n}</span>Attendee</div>
                    ))}
                  </div>
                )}
                <div className="pop-actions">
                  <button className="pop-btn pop-btn-primary">{selected.type === "meeting" ? "Join Call" : "Open Project"}</button>
                  <button className="pop-btn pop-btn-ghost">Edit</button>
                  <button className="pop-btn pop-btn-ghost">Reschedule</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
