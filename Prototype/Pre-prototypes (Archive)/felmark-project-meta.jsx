import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   PROJECT META BLOCK — the living header
   Every field is real. Every value is editable.
   ═══════════════════════════════════════════ */

const CLIENTS = [
  { id: "c1", name: "Meridian Studio", avatar: "M", color: "#7c8594", contact: "sarah@meridianstudio.co" },
  { id: "c2", name: "Nora Kim", avatar: "N", color: "#a08472", contact: "nora@coachkim.com" },
  { id: "c3", name: "Bolt Fitness", avatar: "B", color: "#8a7e63", contact: "team@boltfit.co" },
  { id: "c4", name: "Luna Boutique", avatar: "L", color: "#7c6b9e", contact: "maria@lunaboutique.co" },
];

const STATUSES = [
  { id: "draft", label: "Draft", icon: "○", color: "#b8b3a8" },
  { id: "active", label: "Active", icon: "●", color: "#5a9a3c" },
  { id: "review", label: "In Review", icon: "◎", color: "#5b7fa4" },
  { id: "paused", label: "Paused", icon: "❚❚", color: "#9b988f" },
  { id: "overdue", label: "Overdue", icon: "!", color: "#c24b38" },
  { id: "completed", label: "Completed", icon: "✓", color: "#5a9a3c" },
];

const TEAM = [
  { id: "u1", name: "You", avatar: "A", color: "#b07d4f" },
  { id: "u2", name: "Jamie Park", avatar: "J", color: "#7c8594" },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

// ── Mini Calendar Picker ──
function CalendarPicker({ value, onChange, onClose }) {
  const d = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(d.getFullYear());
  const [viewMonth, setViewMonth] = useState(d.getMonth());
  const [showTime, setShowTime] = useState(false);
  const [hours, setHours] = useState(d.getHours());
  const [minutes, setMinutes] = useState(d.getMinutes());
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const today = new Date();
  const selectedDate = value ? new Date(value) : null;

  const selectDate = (day) => {
    const date = new Date(viewYear, viewMonth, day, hours, minutes);
    onChange(date.toISOString());
  };

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } else setViewMonth(viewMonth - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } else setViewMonth(viewMonth + 1); };

  const setQuickDate = (daysFromNow) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hours, minutes, 0, 0);
    onChange(d.toISOString());
    onClose();
  };

  const clearDate = () => { onChange(null); onClose(); };

  return (
    <div className="cal-picker" ref={ref}>
      {/* Quick dates */}
      <div className="cal-quick">
        <button className="cal-quick-btn" onClick={() => setQuickDate(0)}>Today</button>
        <button className="cal-quick-btn" onClick={() => setQuickDate(7)}>+1 week</button>
        <button className="cal-quick-btn" onClick={() => setQuickDate(14)}>+2 weeks</button>
        <button className="cal-quick-btn" onClick={() => setQuickDate(30)}>+30 days</button>
      </div>

      {/* Month nav */}
      <div className="cal-nav">
        <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
        <span className="cal-nav-label">{MONTHS[viewMonth]} {viewYear}</span>
        <button className="cal-nav-btn" onClick={nextMonth}>›</button>
      </div>

      {/* Day headers */}
      <div className="cal-grid">
        {DAYS_SHORT.map(d => <span key={d} className="cal-day-header">{d}</span>)}

        {/* Empty slots before first day */}
        {Array.from({ length: firstDay }).map((_, i) => <span key={`e${i}`} className="cal-day-empty" />)}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;
          const isSelected = selectedDate && selectedDate.getFullYear() === viewYear && selectedDate.getMonth() === viewMonth && selectedDate.getDate() === day;
          const isPast = new Date(viewYear, viewMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <button key={day}
              className={`cal-day-btn${isToday ? " today" : ""}${isSelected ? " selected" : ""}${isPast ? " past" : ""}`}
              onClick={() => selectDate(day)}>
              {day}
            </button>
          );
        })}
      </div>

      {/* Time picker */}
      <div className="cal-time">
        <button className="cal-time-toggle" onClick={() => setShowTime(!showTime)}>
          {showTime ? "Hide time" : "Set time"} · {String(hours).padStart(2,"0")}:{String(minutes).padStart(2,"0")}
        </button>
        {showTime && (
          <div className="cal-time-inputs">
            <input className="cal-time-input" type="number" min="0" max="23" value={hours}
              onChange={e => { setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0))); if (selectedDate) { const nd = new Date(selectedDate); nd.setHours(parseInt(e.target.value) || 0); onChange(nd.toISOString()); } }} />
            <span className="cal-time-sep">:</span>
            <input className="cal-time-input" type="number" min="0" max="59" value={minutes}
              onChange={e => { setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0))); if (selectedDate) { const nd = new Date(selectedDate); nd.setMinutes(parseInt(e.target.value) || 0); onChange(nd.toISOString()); } }} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="cal-footer">
        <button className="cal-clear" onClick={clearDate}>Clear</button>
        <button className="cal-done" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

// ── Countdown display ──
function Countdown({ dateStr }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i); }, []);

  if (!dateStr) return <span className="pm-countdown dim">No date set</span>;

  const target = new Date(dateStr);
  const diff = target - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  const overdue = diff < 0;
  const urgent = days <= 3 && days >= 0;
  const absDays = Math.abs(days);
  const absHrs = Math.abs(hrs);
  const absMins = Math.abs(mins);
  const absSecs = Math.abs(secs);

  const color = overdue ? "#c24b38" : urgent ? "#c89360" : "#5a9a3c";

  return (
    <span className="pm-countdown" style={{ color }}>
      {overdue ? (
        <>{absDays}d {absHrs}h overdue</>
      ) : (
        <>{days}d {hrs}h {String(mins).padStart(2,"0")}m <span className="pm-countdown-sec">{String(secs).padStart(2,"0")}s</span></>
      )}
      {urgent && !overdue && <span className="pm-pulse" style={{ background: color }} />}
    </span>
  );
}


/* ═══════════════════════════
   THE META BLOCK COMPONENT
   ═══════════════════════════ */
function ProjectMetaBlock({
  initialClient = "c1",
  initialStatus = "active",
  initialDueDate = new Date(2026, 3, 3, 17, 0).toISOString(), // Apr 3, 2026 5pm
  initialBudget = 4800,
  initialAssignee = "u1",
  initialTags = ["Brand Identity", "Q2 2026"],
}) {
  const [client, setClient] = useState(initialClient);
  const [status, setStatus] = useState(initialStatus);
  const [dueDate, setDueDate] = useState(initialDueDate);
  const [budget, setBudget] = useState(initialBudget);
  const [spent, setSpent] = useState(1680);
  const [assignee, setAssignee] = useState(initialAssignee);
  const [tags, setTags] = useState(initialTags);

  const [showClientPicker, setShowClientPicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  const clientData = CLIENTS.find(c => c.id === client);
  const statusData = STATUSES.find(s => s.id === status);
  const assigneeData = TEAM.find(u => u.id === assignee);
  const budgetPct = Math.round((spent / budget) * 100);
  const budgetColor = budgetPct >= 90 ? "#c24b38" : budgetPct >= 70 ? "#c89360" : "#5a9a3c";

  const formatDate = (isoStr) => {
    if (!isoStr) return "Set due date...";
    const d = new Date(isoStr);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} · ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
    }
    setNewTag("");
    setShowTagInput(false);
  };

  const removeTag = (tag) => setTags(tags.filter(t => t !== tag));

  return (
    <div className="pm-block">
      {/* ── Row 1: Client + Status ── */}
      <div className="pm-row pm-row-main">
        {/* Client */}
        <div className="pm-field" style={{ position: "relative" }}>
          <div className="pm-field-trigger" onClick={() => setShowClientPicker(!showClientPicker)}>
            <span className="pm-avatar" style={{ background: clientData.color }}>{clientData.avatar}</span>
            <span className="pm-client-name">{clientData.name}</span>
            <span className="pm-chevron">▾</span>
          </div>
          {showClientPicker && (
            <div className="pm-dropdown">
              <div className="pm-dropdown-label">Switch client</div>
              {CLIENTS.map(c => (
                <div key={c.id} className={`pm-dropdown-item${c.id === client ? " on" : ""}`}
                  onClick={() => { setClient(c.id); setShowClientPicker(false); }}>
                  <span className="pm-avatar sm" style={{ background: c.color }}>{c.avatar}</span>
                  <div className="pm-dropdown-item-info">
                    <span className="pm-dropdown-item-name">{c.name}</span>
                    <span className="pm-dropdown-item-sub">{c.contact}</span>
                  </div>
                  {c.id === client && <span className="pm-check">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <span className="pm-sep">·</span>

        {/* Status */}
        <div className="pm-field" style={{ position: "relative" }}>
          <div className="pm-status-trigger" onClick={() => setShowStatusPicker(!showStatusPicker)}
            style={{ background: statusData.color + "08", borderColor: statusData.color + "18", color: statusData.color }}>
            <span>{statusData.icon}</span>
            <span>{statusData.label}</span>
            <span className="pm-chevron" style={{ color: statusData.color }}>▾</span>
          </div>
          {showStatusPicker && (
            <div className="pm-dropdown narrow">
              <div className="pm-dropdown-label">Set status</div>
              {STATUSES.map(s => (
                <div key={s.id} className={`pm-dropdown-item${s.id === status ? " on" : ""}`}
                  onClick={() => { setStatus(s.id); setShowStatusPicker(false); }}>
                  <span style={{ color: s.color, fontSize: 13 }}>{s.icon}</span>
                  <span style={{ color: s.color, fontWeight: 500, fontSize: 13 }}>{s.label}</span>
                  {s.id === status && <span className="pm-check">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <span className="pm-sep">·</span>

        {/* Assignee */}
        <div className="pm-field" style={{ position: "relative" }}>
          <div className="pm-field-trigger compact" onClick={() => setShowAssigneePicker(!showAssigneePicker)}>
            <span className="pm-avatar sm" style={{ background: assigneeData.color }}>{assigneeData.avatar}</span>
            <span className="pm-assignee-name">{assigneeData.name}</span>
          </div>
          {showAssigneePicker && (
            <div className="pm-dropdown narrow">
              <div className="pm-dropdown-label">Assignee</div>
              {TEAM.map(u => (
                <div key={u.id} className={`pm-dropdown-item${u.id === assignee ? " on" : ""}`}
                  onClick={() => { setAssignee(u.id); setShowAssigneePicker(false); }}>
                  <span className="pm-avatar sm" style={{ background: u.color }}>{u.avatar}</span>
                  <span style={{ fontSize: 13 }}>{u.name}</span>
                  {u.id === assignee && <span className="pm-check">✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 2: Due Date (THE REAL ONE) ── */}
      <div className="pm-row pm-row-date" style={{ position: "relative" }}>
        <div className="pm-date-field" onClick={() => setShowDatePicker(!showDatePicker)}>
          <span className="pm-date-icon">⏱</span>
          <div className="pm-date-info">
            <span className="pm-date-label">Due</span>
            <span className="pm-date-value">{formatDate(dueDate)}</span>
          </div>
          <Countdown dateStr={dueDate} />
        </div>
        {showDatePicker && (
          <CalendarPicker value={dueDate} onChange={setDueDate} onClose={() => setShowDatePicker(false)} />
        )}
      </div>

      {/* ── Row 3: Budget ── */}
      <div className="pm-row pm-row-budget">
        <div className="pm-budget-field">
          <span className="pm-budget-icon">$</span>
          <div className="pm-budget-info">
            <span className="pm-budget-label">Budget</span>
            <div className="pm-budget-values">
              {editingBudget ? (
                <input className="pm-budget-input" type="number" value={budget} autoFocus
                  onChange={e => setBudget(Math.max(0, parseInt(e.target.value) || 0))}
                  onBlur={() => setEditingBudget(false)}
                  onKeyDown={e => { if (e.key === "Enter") setEditingBudget(false); }} />
              ) : (
                <span className="pm-budget-total" onClick={() => setEditingBudget(true)}>${budget.toLocaleString()}</span>
              )}
              <span className="pm-budget-sep">·</span>
              <span className="pm-budget-spent">${spent.toLocaleString()} spent</span>
              <span className="pm-budget-sep">·</span>
              <span className="pm-budget-remaining" style={{ color: budgetColor }}>${(budget - spent).toLocaleString()} remaining</span>
            </div>
          </div>
          <div className="pm-budget-bar-wrap">
            <div className="pm-budget-bar">
              <div className="pm-budget-fill" style={{ width: `${Math.min(budgetPct, 100)}%`, background: budgetColor }} />
            </div>
            <span className="pm-budget-pct" style={{ color: budgetColor }}>{budgetPct}%</span>
          </div>
        </div>
      </div>

      {/* ── Row 4: Tags ── */}
      <div className="pm-row pm-row-tags">
        <span className="pm-tags-icon">⊷</span>
        {tags.map(tag => (
          <span key={tag} className="pm-tag">
            {tag}
            <button className="pm-tag-remove" onClick={() => removeTag(tag)}>×</button>
          </span>
        ))}
        {showTagInput ? (
          <input className="pm-tag-input" placeholder="Tag name..." value={newTag} autoFocus
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addTag(); if (e.key === "Escape") { setShowTagInput(false); setNewTag(""); } }}
            onBlur={addTag} />
        ) : (
          <button className="pm-tag-add" onClick={() => setShowTagInput(true)}>+</button>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════
   SHOWCASE
   ═══════════════════════════ */
export default function ProjectMetaShowcase() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
        .page{font-family:'Outfit',sans-serif;font-size:15px;color:var(--ink-700);background:var(--parchment);min-height:100vh}
        .canvas{max-width:740px;margin:0 auto;padding:48px 40px 120px}
        .doc-h1{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:var(--ink-900);margin-bottom:12px}
        .doc-p{font-size:15px;color:var(--ink-600);line-height:1.8;margin-bottom:12px}
        .doc-note{font-size:13px;color:var(--ink-400);font-style:italic;padding:10px 16px;border-left:2px solid var(--warm-300);margin:20px 0;line-height:1.6}

        /* ═══ PROJECT META BLOCK ═══ */
        .pm-block{border:1px solid var(--warm-200);border-radius:10px;overflow:hidden;margin:16px 0;background:#fff}
        .pm-row{display:flex;align-items:center;gap:8px;padding:10px 18px;border-bottom:1px solid var(--warm-100)}
        .pm-row:last-child{border-bottom:none}
        .pm-sep{color:var(--warm-300);font-size:12px}

        /* Client trigger */
        .pm-field{position:relative}
        .pm-field-trigger{display:flex;align-items:center;gap:8px;cursor:pointer;padding:4px 8px;border-radius:5px;transition:background .06s}
        .pm-field-trigger:hover{background:var(--warm-100)}
        .pm-field-trigger.compact{gap:5px;padding:4px 6px}
        .pm-avatar{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#fff;flex-shrink:0}
        .pm-avatar.sm{width:20px;height:20px;border-radius:5px;font-size:9px}
        .pm-client-name{font-size:14px;font-weight:500;color:var(--ink-800)}
        .pm-assignee-name{font-size:13px;color:var(--ink-500)}
        .pm-chevron{font-size:8px;color:var(--ink-300)}

        /* Status trigger */
        .pm-status-trigger{display:flex;align-items:center;gap:5px;cursor:pointer;padding:3px 10px;border-radius:5px;font-family:var(--mono);font-size:11px;font-weight:500;border:1px solid;transition:all .06s}
        .pm-status-trigger:hover{filter:brightness(0.95)}

        /* Dropdown */
        .pm-dropdown{position:absolute;top:calc(100% + 6px);left:0;width:260px;background:#fff;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,.1),0 0 0 1px rgba(0,0,0,.04);padding:4px;z-index:50;animation:ddIn .12s ease}
        .pm-dropdown.narrow{width:180px}
        @keyframes ddIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        .pm-dropdown-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.08em;padding:8px 10px 4px}
        .pm-dropdown-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;transition:background .06s}
        .pm-dropdown-item:hover{background:var(--ember-bg)}
        .pm-dropdown-item.on{background:var(--warm-100)}
        .pm-dropdown-item-info{flex:1;min-width:0}
        .pm-dropdown-item-name{font-size:13px;font-weight:500;color:var(--ink-700);display:block}
        .pm-dropdown-item-sub{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .pm-check{font-size:12px;color:#5a9a3c;flex-shrink:0}

        /* ── DATE ROW ── */
        .pm-row-date{padding:12px 18px;cursor:pointer;transition:background .06s}
        .pm-row-date:hover{background:var(--warm-50)}
        .pm-date-field{display:flex;align-items:center;gap:12px;width:100%}
        .pm-date-icon{font-size:16px;color:var(--ember);flex-shrink:0}
        .pm-date-info{flex:1}
        .pm-date-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:1px}
        .pm-date-value{font-size:14px;color:var(--ink-700);font-weight:500}
        .pm-countdown{font-family:var(--mono);font-size:13px;font-weight:500;flex-shrink:0;display:flex;align-items:center;gap:4px}
        .pm-countdown.dim{color:var(--ink-300);font-weight:400}
        .pm-countdown-sec{font-size:11px;opacity:.5;font-variant-numeric:tabular-nums}
        .pm-pulse{width:5px;height:5px;border-radius:50%;animation:pmPulse 2s ease infinite}
        @keyframes pmPulse{0%,100%{opacity:.3}50%{opacity:1}}

        /* ── CALENDAR PICKER ── */
        .cal-picker{position:absolute;top:calc(100% + 8px);left:18px;width:300px;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.12),0 0 0 1px rgba(0,0,0,.04);z-index:60;overflow:hidden;animation:ddIn .15s ease}
        .cal-quick{display:flex;gap:4px;padding:10px 12px;border-bottom:1px solid var(--warm-100)}
        .cal-quick-btn{padding:4px 10px;border-radius:4px;border:1px solid var(--warm-200);background:#fff;font-family:var(--mono);font-size:10px;color:var(--ink-500);cursor:pointer;transition:all .06s}
        .cal-quick-btn:hover{background:var(--ember-bg);border-color:rgba(176,125,79,.15);color:var(--ember)}
        .cal-nav{display:flex;align-items:center;justify-content:space-between;padding:10px 12px 6px}
        .cal-nav-btn{width:28px;height:28px;border-radius:5px;border:none;background:none;cursor:pointer;color:var(--ink-400);font-size:16px;display:flex;align-items:center;justify-content:center;transition:background .06s}
        .cal-nav-btn:hover{background:var(--warm-100)}
        .cal-nav-label{font-size:14px;font-weight:500;color:var(--ink-800)}
        .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;padding:4px 12px 8px}
        .cal-day-header{text-align:center;font-family:var(--mono);font-size:9px;color:var(--ink-300);padding:4px 0}
        .cal-day-empty{padding:4px}
        .cal-day-btn{width:100%;aspect-ratio:1;border:none;border-radius:6px;background:none;cursor:pointer;font-family:inherit;font-size:13px;color:var(--ink-600);transition:all .06s;display:flex;align-items:center;justify-content:center}
        .cal-day-btn:hover{background:var(--warm-100)}
        .cal-day-btn.today{font-weight:600;color:var(--ember)}
        .cal-day-btn.selected{background:var(--ember);color:#fff;font-weight:600}
        .cal-day-btn.past{color:var(--ink-300)}
        .cal-time{padding:6px 12px;border-top:1px solid var(--warm-100)}
        .cal-time-toggle{width:100%;padding:6px;border:none;background:none;font-family:var(--mono);font-size:11px;color:var(--ink-400);cursor:pointer;text-align:center;border-radius:4px;transition:background .06s}
        .cal-time-toggle:hover{background:var(--warm-100)}
        .cal-time-inputs{display:flex;align-items:center;justify-content:center;gap:4px;padding:6px 0}
        .cal-time-input{width:50px;padding:6px;border:1px solid var(--warm-200);border-radius:5px;font-family:var(--mono);font-size:14px;text-align:center;color:var(--ink-800);outline:none}
        .cal-time-input:focus{border-color:var(--ember)}
        .cal-time-sep{font-size:16px;color:var(--ink-300);font-weight:600}
        .cal-footer{display:flex;justify-content:space-between;padding:8px 12px;border-top:1px solid var(--warm-100)}
        .cal-clear{padding:5px 12px;border:none;background:none;font-family:var(--mono);font-size:11px;color:var(--ink-400);cursor:pointer;border-radius:4px}
        .cal-clear:hover{background:var(--warm-100);color:#c24b38}
        .cal-done{padding:5px 16px;border:none;background:var(--ember);color:#fff;font-family:var(--mono);font-size:11px;border-radius:4px;cursor:pointer}
        .cal-done:hover{background:var(--ember-light)}

        /* ── BUDGET ROW ── */
        .pm-budget-field{display:flex;align-items:center;gap:12px;width:100%}
        .pm-budget-icon{font-size:14px;color:#5a9a3c;font-family:var(--mono);font-weight:600;flex-shrink:0;width:20px;text-align:center}
        .pm-budget-info{flex:1}
        .pm-budget-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:1px}
        .pm-budget-values{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
        .pm-budget-total{font-size:15px;font-weight:600;color:var(--ink-800);cursor:pointer;padding:1px 4px;border-radius:3px;transition:background .06s}
        .pm-budget-total:hover{background:var(--ember-bg)}
        .pm-budget-input{width:100px;padding:3px 8px;border:1px solid var(--ember);border-radius:4px;font-family:var(--mono);font-size:15px;font-weight:600;color:var(--ink-800);outline:none;background:var(--ember-bg)}
        .pm-budget-sep{color:var(--warm-300);font-size:10px}
        .pm-budget-spent{font-family:var(--mono);font-size:12px;color:var(--ink-400)}
        .pm-budget-remaining{font-family:var(--mono);font-size:12px;font-weight:500}
        .pm-budget-bar-wrap{display:flex;align-items:center;gap:6px;flex-shrink:0;width:100px}
        .pm-budget-bar{flex:1;height:4px;background:var(--warm-200);border-radius:2px;overflow:hidden}
        .pm-budget-fill{height:100%;border-radius:2px;transition:width .3s}
        .pm-budget-pct{font-family:var(--mono);font-size:11px;font-weight:500;min-width:28px;text-align:right}

        /* ── TAGS ROW ── */
        .pm-row-tags{flex-wrap:wrap;gap:5px}
        .pm-tags-icon{font-size:12px;color:var(--ink-300);flex-shrink:0}
        .pm-tag{font-family:var(--mono);font-size:10px;color:var(--ink-500);background:var(--warm-100);padding:2px 8px;border-radius:3px;display:flex;align-items:center;gap:4px;border:1px solid var(--warm-200)}
        .pm-tag-remove{background:none;border:none;color:var(--ink-300);cursor:pointer;font-size:12px;padding:0;line-height:1;transition:color .06s}
        .pm-tag-remove:hover{color:#c24b38}
        .pm-tag-add{width:22px;height:22px;border-radius:4px;border:1px dashed var(--warm-300);background:none;cursor:pointer;color:var(--ink-300);font-size:12px;display:flex;align-items:center;justify-content:center;transition:all .06s}
        .pm-tag-add:hover{border-color:var(--ember);color:var(--ember);background:var(--ember-bg)}
        .pm-tag-input{padding:2px 8px;border:1px solid var(--ember);border-radius:3px;font-family:var(--mono);font-size:10px;color:var(--ink-700);outline:none;width:100px;background:var(--ember-bg)}
      `}</style>

      <div className="page"><div className="canvas">
        <h1 className="doc-h1">Brand Guidelines v2</h1>

        <ProjectMetaBlock />

        <p className="doc-p" style={{ marginTop: 20 }}>
          Every field above is real. Click the client name to switch workspaces. Click the status badge to change project state. Click the due date to open a full calendar picker with quick dates, time selection, and a live countdown that ticks every second. Click the budget to edit it — the progress bar and percentage update instantly. Add and remove tags.
        </p>

        <div className="doc-note">
          This replaces the old hardcoded callout: <span style={{ fontFamily: "var(--mono)", textDecoration: "line-through", color: "var(--ink-300)" }}>◆ Client: Meridian Studio — Due Apr 3 — Budget: $2,400</span>. Every value is now a live, interactive field connected to the project data.
        </div>

        <p className="doc-p">The countdown timer is real — seconds are ticking right now. Change the due date and the countdown recalculates instantly. Set it to yesterday and watch it turn red with "overdue." Set it to 2 days from now and watch the amber pulse dot appear.</p>

        <p className="doc-p">The budget bar shows 35% consumed. Click the dollar amount to edit — change it to $2,000 and watch the percentage jump to 84% and turn amber. The math is live.</p>
      </div></div>
    </>
  );
}
