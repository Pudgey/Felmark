import { useState, useEffect, useRef } from "react";

const EVENT_TYPES = {
  payment: { icon: "$", color: "#5a9a3c", bg: "rgba(90,154,60,0.06)", label: "PAYMENT" },
  invoice: { icon: "◇", color: "#8a7e63", bg: "rgba(138,126,99,0.04)", label: "INVOICE" },
  proposal: { icon: "◆", color: "#b07d4f", bg: "rgba(176,125,79,0.04)", label: "PROPOSAL" },
  message: { icon: "→", color: "#5b7fa4", bg: "rgba(91,127,164,0.04)", label: "MESSAGE" },
  deadline: { icon: "!", color: "#c24b38", bg: "rgba(194,75,56,0.04)", label: "DEADLINE" },
  milestone: { icon: "★", color: "#b07d4f", bg: "rgba(176,125,79,0.04)", label: "MILESTONE" },
  view: { icon: "◎", color: "#7c8594", bg: "rgba(124,133,148,0.04)", label: "VIEW" },
  system: { icon: "⟐", color: "#9b988f", bg: "rgba(155,152,143,0.04)", label: "SYSTEM" },
};

const SEED_EVENTS = [
  { id: 1, type: "system", time: "09:00:00", text: "Wire connected — streaming live events", detail: "felmark v0.1.0" },
  { id: 2, type: "system", time: "09:00:01", text: "Loaded 4 workspaces · 8 active projects", detail: "pipeline: $22,000" },
  { id: 3, type: "message", time: "09:12:34", text: "New message from Jamie Park", detail: "Brand Guidelines v2 → \"Got it, I'll set up the scale with Outfit variable\"", client: "Meridian Studio" },
  { id: 4, type: "view", time: "09:23:11", text: "Proposal viewed by nora@coachkim.com", detail: "Course Landing Page — 3rd view · 4m 22s reading time", client: "Nora Kim" },
  { id: 5, type: "deadline", time: "09:30:00", text: "⚠ Bolt Fitness — App Onboarding UX is now 4 days overdue", detail: "Progress: 70% · Last activity: 3 days ago · Value: $4,000", client: "Bolt Fitness" },
  { id: 6, type: "invoice", time: "09:45:18", text: "Invoice #047 sent to sarah@meridianstudio.co", detail: "$2,400 · Net 15 · Due Apr 13", client: "Meridian Studio" },
  { id: 7, type: "view", time: "10:02:44", text: "Invoice #047 opened by sarah@meridianstudio.co", detail: "First view · Meridian Studio", client: "Meridian Studio" },
  { id: 8, type: "message", time: "10:14:22", text: "New message from Sarah Chen", detail: "\"I want to review before it goes out\" — Direct message", client: null },
  { id: 9, type: "proposal", time: "10:31:05", text: "Proposal signed ✓ — Course Landing Page", detail: "Nora Kim accepted · $3,200 · Starting Apr 1", client: "Nora Kim" },
  { id: 10, type: "payment", time: "10:42:18", text: "Payment received — $1,800", detail: "Nora Kim · Invoice #046 · Retainer (March) · via Stripe", client: "Nora Kim" },
  { id: 11, type: "milestone", time: "10:42:19", text: "Monthly revenue milestone: $14,800", detail: "99% of $15k goal · $200 remaining · 2 days left", client: null },
  { id: 12, type: "view", time: "10:55:33", text: "Brand Guidelines v2 opened by Jamie Park", detail: "Typography section · Meridian Studio workspace", client: "Meridian Studio" },
  { id: 13, type: "message", time: "11:03:41", text: "Marcus Cole replied in Team", detail: "\"Just dropped it in the Brand Guidelines workspace\" — re: color palette file", client: null },
  { id: 14, type: "invoice", time: "11:15:00", text: "Invoice #044 — payment overdue", detail: "Bolt Fitness · $4,000 · 4 days past due · Auto-reminder queued", client: "Bolt Fitness" },
  { id: 15, type: "view", time: "11:28:17", text: "Invoice #047 viewed again by sarah@meridianstudio.co", detail: "2nd view · 1m 45s · Meridian Studio", client: "Meridian Studio" },
  { id: 16, type: "payment", time: "11:30:02", text: "Payment received — $2,400", detail: "Meridian Studio · Invoice #047 · Brand Guidelines deposit · via Stripe", client: "Meridian Studio" },
  { id: 17, type: "system", time: "11:30:03", text: "Daily revenue: $4,200 — personal best this month", detail: "↑ 18% vs daily average ($548/day)" },
];

const LIVE_EVENTS = [
  { type: "view", text: "Portfolio page viewed by unknown visitor", detail: "Referral from LinkedIn · 2m 11s on page", client: null },
  { type: "message", text: "Nora Kim sent a message", detail: "Course Landing Page → \"Love the direction! Can we add a testimonial section?\"", client: "Nora Kim" },
  { type: "view", text: "Invoice #044 opened by team@boltfit.co", detail: "Bolt Fitness · First view in 4 days", client: "Bolt Fitness" },
  { type: "system", text: "Auto-saved: Brand Guidelines v2", detail: "12 blocks · 2,847 words · Last change: Typography section" },
  { type: "milestone", text: "Brand Guidelines v2 — 70% complete", detail: "Progress milestone · Meridian Studio · Est. completion: Apr 1", client: "Meridian Studio" },
  { type: "payment", text: "Payment received — $4,000", detail: "Bolt Fitness · Invoice #044 · App Onboarding · via Stripe (4 days late)", client: "Bolt Fitness" },
  { type: "deadline", text: "Blog Posts due in 3 days", detail: "Bolt Fitness · Progress: 15% · Needs attention", client: "Bolt Fitness" },
];

export default function TheWire() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [paused, setPaused] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [liveCount, setLiveCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const scrollRef = useRef(null);
  const liveIdx = useRef(0);

  // Stream seed events
  useEffect(() => {
    setConnected(true);
    SEED_EVENTS.forEach((evt, i) => {
      setTimeout(() => {
        setEvents(prev => [...prev, { ...evt, isNew: true }]);
        setPulseActive(true);
        setTimeout(() => setPulseActive(false), 300);
      }, i * 280);
    });
  }, []);

  // Stream live events
  useEffect(() => {
    const interval = setInterval(() => {
      if (paused) return;
      if (liveIdx.current >= LIVE_EVENTS.length) {
        liveIdx.current = 0;
      }
      const evt = LIVE_EVENTS[liveIdx.current];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

      setEvents(prev => [...prev, {
        ...evt,
        id: Date.now(),
        time: timeStr,
        isNew: true,
        isLive: true,
      }]);
      setLiveCount(c => c + 1);
      setPulseActive(true);
      setTimeout(() => setPulseActive(false), 300);
      liveIdx.current++;
    }, 5000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, [paused]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current && !paused) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events, paused]);

  // Remove "new" flag after animation
  useEffect(() => {
    const t = setTimeout(() => {
      setEvents(prev => prev.map(e => ({ ...e, isNew: false })));
    }, 600);
    return () => clearTimeout(t);
  }, [events.length]);

  const filtered = filter === "all" ? events : events.filter(e => e.type === filter);

  // Stats
  const payments = events.filter(e => e.type === "payment");
  const totalReceived = payments.length;
  const views = events.filter(e => e.type === "view").length;
  const messages = events.filter(e => e.type === "message").length;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
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

        .wire {
          font-family: var(--mono); font-size: 12px;
          color: var(--ink-600); background: var(--parchment);
          height: 100vh; display: flex; flex-direction: column;
        }

        /* ── Header ── */
        .wire-head {
          padding: 12px 20px; border-bottom: 1px solid var(--warm-200);
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0; background: var(--parchment);
        }
        .wire-head-left { display: flex; align-items: center; gap: 12px; }
        .wire-title-row { display: flex; align-items: center; gap: 8px; }
        .wire-title {
          font-family: 'Cormorant Garamond', serif; font-size: 20px;
          font-weight: 600; color: var(--ink-900); letter-spacing: -0.01em;
        }
        .wire-live {
          display: flex; align-items: center; gap: 5px;
          font-size: 9px; font-weight: 500; color: var(--ink-400);
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .wire-pulse {
          width: 7px; height: 7px; border-radius: 50%;
          background: #5a9a3c; flex-shrink: 0;
          transition: box-shadow 0.15s, transform 0.15s;
        }
        .wire-pulse.active { box-shadow: 0 0 0 4px rgba(90,154,60,0.15); transform: scale(1.3); }
        .wire-sub { font-size: 10px; color: var(--ink-300); margin-top: 1px; }

        .wire-head-right { display: flex; align-items: center; gap: 6px; }
        .wire-btn {
          padding: 5px 12px; border-radius: 4px; font-size: 10px;
          border: 1px solid var(--warm-200); background: #fff;
          cursor: pointer; font-family: var(--mono); color: var(--ink-500);
          transition: all 0.08s; display: flex; align-items: center; gap: 4px;
        }
        .wire-btn:hover { background: var(--warm-50); border-color: var(--warm-300); }
        .wire-btn.on { background: var(--ink-900); color: var(--parchment); border-color: var(--ink-900); }
        .wire-btn.danger { color: #c24b38; border-color: rgba(194,75,56,0.2); }
        .wire-btn.danger:hover { background: rgba(194,75,56,0.04); }

        /* ── Stats ticker ── */
        .wire-ticker {
          display: flex; align-items: center; gap: 0;
          padding: 6px 20px; border-bottom: 1px solid var(--warm-100);
          flex-shrink: 0; overflow: hidden;
        }
        .wire-tick {
          display: flex; align-items: center; gap: 6px;
          padding: 0 16px; border-right: 1px solid var(--warm-100);
          flex-shrink: 0;
        }
        .wire-tick:last-child { border-right: none; }
        .wire-tick-label { font-size: 9px; color: var(--ink-300); text-transform: uppercase; letter-spacing: 0.06em; }
        .wire-tick-val { font-size: 12px; font-weight: 500; }
        .wire-tick-val.green { color: #5a9a3c; }
        .wire-tick-val.ember { color: var(--ember); }
        .wire-tick-val.red { color: #c24b38; }

        /* ── Filters ── */
        .wire-filters {
          display: flex; gap: 2px; padding: 8px 20px;
          border-bottom: 1px solid var(--warm-100); flex-shrink: 0;
          overflow-x: auto;
        }
        .wire-filter {
          padding: 4px 10px; border-radius: 3px; font-size: 10px;
          border: none; cursor: pointer; font-family: var(--mono);
          color: var(--ink-400); background: none; transition: all 0.06s;
          white-space: nowrap; display: flex; align-items: center; gap: 4px;
        }
        .wire-filter:hover { background: var(--warm-100); }
        .wire-filter.on { background: var(--ink-900); color: var(--parchment); }
        .wire-filter-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .wire-filter-count { opacity: 0.5; }

        /* ── Event stream ── */
        .wire-stream { flex: 1; overflow-y: auto; }
        .wire-stream::-webkit-scrollbar { width: 4px; }
        .wire-stream::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }

        .wire-event {
          display: flex; align-items: flex-start; gap: 0;
          padding: 0; border-bottom: 1px solid var(--warm-100);
          transition: background 0.08s;
          animation: eventIn 0.25s ease both;
        }
        .wire-event:hover { background: rgba(0,0,0,0.01); }
        .wire-event.highlight { background: rgba(90,154,60,0.02); }
        .wire-event.new-event { animation: eventFlash 0.6s ease; }

        @keyframes eventIn { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes eventFlash { 0% { background: rgba(176,125,79,0.06); } 100% { background: transparent; } }

        /* Time column */
        .wire-time {
          width: 76px; flex-shrink: 0; padding: 10px 10px 10px 16px;
          font-size: 11px; color: var(--ink-300); text-align: right;
          border-right: 1px solid var(--warm-100);
          font-variant-numeric: tabular-nums;
        }

        /* Type column */
        .wire-type-col {
          width: 32px; flex-shrink: 0; display: flex;
          align-items: flex-start; justify-content: center;
          padding-top: 10px;
        }
        .wire-type-icon {
          width: 20px; height: 20px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700;
        }

        /* Content */
        .wire-content { flex: 1; padding: 10px 16px 10px 8px; min-width: 0; }
        .wire-text { font-size: 12.5px; color: var(--ink-700); line-height: 1.45; }
        .wire-event.highlight .wire-text { color: var(--ink-900); font-weight: 500; }
        .wire-detail {
          font-size: 11px; color: var(--ink-400); margin-top: 2px;
          line-height: 1.4;
        }
        .wire-client {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 10px; color: var(--ink-400);
          background: var(--warm-100); padding: 0px 6px; border-radius: 2px;
          margin-top: 4px;
        }

        /* Live badge */
        .wire-live-badge {
          font-size: 8px; color: var(--ember);
          background: var(--ember-bg); padding: 0 4px; border-radius: 2px;
          margin-left: 6px; font-weight: 500; letter-spacing: 0.04em;
          border: 1px solid rgba(176,125,79,0.1);
        }

        /* ── Paused overlay ── */
        .wire-paused-bar {
          padding: 6px 20px; text-align: center;
          background: rgba(176,125,79,0.04); border-bottom: 1px solid rgba(176,125,79,0.08);
          font-size: 11px; color: var(--ember); flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }

        /* ── Footer ── */
        .wire-footer {
          padding: 6px 20px; border-top: 1px solid var(--warm-200);
          display: flex; justify-content: space-between; align-items: center;
          font-size: 10px; color: var(--ink-300); flex-shrink: 0;
          background: var(--parchment);
        }
        .wire-footer-left { display: flex; align-items: center; gap: 8px; }
        .wire-footer-dot { width: 5px; height: 5px; border-radius: 50%; }
      `}</style>

      <div className="wire">
        {/* ── Header ── */}
        <div className="wire-head">
          <div className="wire-head-left">
            <div>
              <div className="wire-title-row">
                <span className="wire-title">The Wire</span>
                <div className="wire-live">
                  <span className={`wire-pulse${pulseActive ? " active" : ""}`} />
                  {connected ? "live" : "connecting..."}
                </div>
              </div>
              <div className="wire-sub">{events.length} events · {liveCount} live this session</div>
            </div>
          </div>
          <div className="wire-head-right">
            <button className={`wire-btn${showStats ? " on" : ""}`} onClick={() => setShowStats(!showStats)}>
              stats
            </button>
            <button className={`wire-btn${paused ? " danger" : ""}`} onClick={() => setPaused(!paused)}>
              {paused ? "▶ resume" : "❚❚ pause"}
            </button>
            <button className="wire-btn" onClick={() => { setEvents([]); setLiveCount(0); }}>
              clear
            </button>
          </div>
        </div>

        {/* ── Stats ticker ── */}
        {showStats && (
          <div className="wire-ticker">
            <div className="wire-tick">
              <span className="wire-tick-label">payments</span>
              <span className="wire-tick-val green">{totalReceived}</span>
            </div>
            <div className="wire-tick">
              <span className="wire-tick-label">views</span>
              <span className="wire-tick-val ember">{views}</span>
            </div>
            <div className="wire-tick">
              <span className="wire-tick-label">messages</span>
              <span className="wire-tick-val">{messages}</span>
            </div>
            <div className="wire-tick">
              <span className="wire-tick-label">alerts</span>
              <span className="wire-tick-val red">{events.filter(e => e.type === "deadline").length}</span>
            </div>
            <div className="wire-tick">
              <span className="wire-tick-label">events/min</span>
              <span className="wire-tick-val">{events.length > 0 ? "~" + Math.max(1, Math.round(events.length / 3)) : "0"}</span>
            </div>
            <div className="wire-tick">
              <span className="wire-tick-label">uptime</span>
              <span className="wire-tick-val green">99.9%</span>
            </div>
          </div>
        )}

        {/* ── Filters ── */}
        <div className="wire-filters">
          <button className={`wire-filter${filter === "all" ? " on" : ""}`} onClick={() => setFilter("all")}>
            all <span className="wire-filter-count">{events.length}</span>
          </button>
          {Object.entries(EVENT_TYPES).map(([key, cfg]) => {
            const count = events.filter(e => e.type === key).length;
            if (count === 0 && key !== "payment") return null;
            return (
              <button key={key} className={`wire-filter${filter === key ? " on" : ""}`} onClick={() => setFilter(key)}>
                <span className="wire-filter-dot" style={{ background: cfg.color }} />
                {cfg.label.toLowerCase()}
                <span className="wire-filter-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── Paused ── */}
        {paused && (
          <div className="wire-paused-bar">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="2" y="2" width="3" height="8" rx="0.5" fill="currentColor"/><rect x="7" y="2" width="3" height="8" rx="0.5" fill="currentColor"/></svg>
            Feed paused — events still queuing
          </div>
        )}

        {/* ── Stream ── */}
        <div className="wire-stream" ref={scrollRef}>
          {filtered.map((evt, i) => {
            const cfg = EVENT_TYPES[evt.type] || EVENT_TYPES.system;
            const isPayment = evt.type === "payment";
            const isMilestone = evt.type === "milestone";

            return (
              <div key={evt.id || i} className={`wire-event${isPayment || isMilestone ? " highlight" : ""}${evt.isNew ? " new-event" : ""}`}>
                <div className="wire-time">{evt.time}</div>
                <div className="wire-type-col">
                  <div className="wire-type-icon" style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.icon}
                  </div>
                </div>
                <div className="wire-content">
                  <div className="wire-text">
                    {evt.text}
                    {evt.isLive && <span className="wire-live-badge">LIVE</span>}
                  </div>
                  {evt.detail && <div className="wire-detail">{evt.detail}</div>}
                  {evt.client && <span className="wire-client">⬡ {evt.client}</span>}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--ink-300)", fontSize: 12 }}>
              No events match this filter
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="wire-footer">
          <div className="wire-footer-left">
            <span className="wire-footer-dot" style={{ background: connected ? "#5a9a3c" : "#c24b38" }} />
            <span>{connected ? "connected" : "reconnecting..."}</span>
            <span>·</span>
            <span>felmark wire v0.1.0</span>
          </div>
          <span>streaming since 09:00:00 · mar 29, 2026</span>
        </div>
      </div>
    </>
  );
}
