import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════
   FELMARK WORKSPACE — GET
   What needs your attention. Right now.
   Every item = one thing + one action.
   ═══════════════════════════════════════════ */

const ITEMS = [
  // CRITICAL — money or deadline at risk
  {
    id: 1, tier: "critical",
    icon: "$", iconColor: "#c24b38",
    client: "Bolt Fitness", clientAvatar: "B", clientColor: "#8a7e63",
    title: "Invoice 4 days overdue",
    detail: "$4,000 · Sent Mar 27 · Viewed once",
    action: "Send Reminder",
    actionVariant: "danger",
    meta: "Auto-reminder in 3 days if unpaid",
    age: "4d overdue",
  },
  {
    id: 2, tier: "critical",
    icon: "✍", iconColor: "#c24b38",
    client: "Meridian Studio", clientAvatar: "M", clientColor: "#7c8594",
    title: "Proposal unsigned for 4 days",
    detail: "$4,800 · Viewed 3 times by Sarah · Last viewed 6h ago",
    action: "Follow Up",
    actionVariant: "danger",
    meta: "Close rate drops 40% after day 5",
    age: "4d waiting",
  },

  // ACTIVE — needs your response or action
  {
    id: 3, tier: "active",
    icon: "◇", iconColor: "#d97706",
    client: "Meridian Studio", clientAvatar: "M", clientColor: "#7c8594",
    title: "Sarah left feedback on Brand Guidelines",
    detail: "3 comments on Scope section · 2 days ago",
    action: "Reply",
    actionVariant: "primary",
    meta: "Average response time: 4h — you're at 48h",
    age: "2d ago",
  },
  {
    id: 4, tier: "active",
    icon: "→", iconColor: "#d97706",
    client: "Nora Kim", clientAvatar: "N", clientColor: "#a08472",
    title: "Contract signed — start the project",
    detail: "$3,200 · Course Landing Page · Signed 1h ago",
    action: "Create Milestone",
    actionVariant: "primary",
    meta: "First milestone due in 14 days",
    age: "1h ago",
  },
  {
    id: 5, tier: "active",
    icon: "$", iconColor: "#d97706",
    client: "Nora Kim", clientAvatar: "N", clientColor: "#a08472",
    title: "Deposit invoice not yet created",
    detail: "50% deposit · $1,600 · Contract says due on signing",
    action: "Create Invoice",
    actionVariant: "primary",
    meta: "Auto-suggested based on payment terms",
    age: "Now",
  },
  {
    id: 6, tier: "active",
    icon: "◎", iconColor: "#d97706",
    client: "Bolt Fitness", clientAvatar: "B", clientColor: "#8a7e63",
    title: "App Onboarding deliverable ready for review",
    detail: "Submitted 5 days ago · Jake hasn't opened it",
    action: "Nudge Client",
    actionVariant: "secondary",
    meta: "Delivery → review → final invoice pipeline stalled",
    age: "5d waiting",
  },

  // WATCHING — monitoring, not urgent
  {
    id: 7, tier: "watching",
    icon: "★", iconColor: "#5b7fa4",
    client: "Luna Boutique", clientAvatar: "L", clientColor: "#7c6b9e",
    title: "New inquiry — no response yet",
    detail: "Maria Santos · via lead form · Brand identity interest",
    action: "Send Proposal",
    actionVariant: "secondary",
    meta: "Leads go cold after 24h — it's been 2h",
    age: "2h ago",
  },
  {
    id: 8, tier: "watching",
    icon: "↗", iconColor: "#5b7fa4",
    client: null,
    title: "Effective rate dropping this week",
    detail: "$108/hr ↓ from $112 · Bolt Fitness dragging average",
    action: "View Breakdown",
    actionVariant: "ghost",
    meta: "Target: $150/hr · Gap: 28%",
    age: "This week",
  },
];

export default function WorkspaceGet() {
  const [dismissed, setDismissed] = useState(new Set());
  const [actioned, setActioned] = useState(new Set());
  const [expanded, setExpanded] = useState(null);
  const [showAIMeta, setShowAIMeta] = useState(true);

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const visible = ITEMS.filter(i => !dismissed.has(i.id));
  const critical = visible.filter(i => i.tier === "critical");
  const active = visible.filter(i => i.tier === "active");
  const watching = visible.filter(i => i.tier === "watching");

  const handleAction = (id) => {
    setActioned(prev => new Set([...prev, id]));
    setTimeout(() => setDismissed(prev => new Set([...prev, id])), 1200);
  };

  const handleDismiss = (id) => {
    setDismissed(prev => new Set([...prev, id]));
  };

  const tierConfig = {
    critical: { label: "Needs action now", color: "#c24b38", bg: "rgba(194,75,56,0.03)", border: "rgba(194,75,56,0.08)", count: critical.length },
    active: { label: "Respond or decide", color: "#d97706", bg: "rgba(217,151,6,0.02)", border: "rgba(217,151,6,0.06)", count: active.length },
    watching: { label: "Keep an eye on", color: "#5b7fa4", bg: "rgba(91,127,164,0.02)", border: "rgba(91,127,164,0.06)", count: watching.length },
  };

  function renderItem(item) {
    const isDone = actioned.has(item.id);
    const isExpanded = expanded === item.id;

    return (
      <div key={item.id} className={`wg-item${isDone ? " done" : ""}`}>
        <div className="wg-item-main" onClick={() => setExpanded(isExpanded ? null : item.id)}>
          {/* Left: icon */}
          <div className="wg-item-icon" style={{ color: item.iconColor, background: item.iconColor + "08", borderColor: item.iconColor + "12" }}>
            {isDone ? "✓" : item.icon}
          </div>

          {/* Center: content */}
          <div className="wg-item-body">
            <div className="wg-item-top-row">
              {item.client && (
                <div className="wg-item-client">
                  <div className="wg-item-client-av" style={{ background: item.clientColor }}>{item.clientAvatar}</div>
                  <span className="wg-item-client-name">{item.client}</span>
                  <span className="wg-item-sep">·</span>
                </div>
              )}
              <span className="wg-item-age">{item.age}</span>
            </div>
            <div className="wg-item-title">{isDone ? <s>{item.title}</s> : item.title}</div>
            <div className="wg-item-detail">{item.detail}</div>

            {/* AI meta — why this matters */}
            {showAIMeta && isExpanded && item.meta && (
              <div className="wg-item-meta">
                <span className="wg-item-meta-badge">✦</span>
                <span>{item.meta}</span>
              </div>
            )}
          </div>

          {/* Right: action */}
          <div className="wg-item-actions">
            {!isDone ? (
              <>
                <button className={`wg-btn ${item.actionVariant}`}
                  onClick={(e) => { e.stopPropagation(); handleAction(item.id); }}>
                  {item.action}
                </button>
                <button className="wg-btn-dismiss" onClick={(e) => { e.stopPropagation(); handleDismiss(item.id); }}>✕</button>
              </>
            ) : (
              <span className="wg-item-done-label">Done ✓</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  const allDone = visible.length === 0;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.wg{font-family:'Outfit',sans-serif;background:var(--parchment);min-height:100vh;padding:28px 24px 60px}
.wg-in{max-width:720px;margin:0 auto}

/* Header */
.wg-hd{margin-bottom:24px}
.wg-hd-eyebrow{font-family:var(--mono);font-size:10px;color:var(--ember);text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;display:flex;align-items:center;gap:6px}
.wg-hd-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--ember);animation:hdDot 2s ease infinite}
@keyframes hdDot{0%,60%,100%{opacity:.3}20%{opacity:1}}
.wg-hd-title{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:var(--ink-900);line-height:1.15;margin-bottom:4px}
.wg-hd-sub{font-size:14px;color:var(--ink-400);line-height:1.5}
.wg-hd-sub b{color:var(--ink-600);font-weight:500}

/* Summary strip */
.wg-summary{display:flex;gap:6px;margin-bottom:22px}
.wg-summary-item{padding:10px 14px;background:#fff;border:1px solid var(--warm-200);border-radius:8px;display:flex;align-items:center;gap:8px;flex:1;transition:all .1s}
.wg-summary-item:hover{border-color:var(--warm-300);transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,0.02)}
.wg-summary-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.wg-summary-val{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;line-height:1}
.wg-summary-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em;margin-top:1px}

/* AI toggle */
.wg-ai-toggle{display:flex;align-items:center;justify-content:flex-end;gap:6px;margin-bottom:14px}
.wg-ai-toggle-label{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.wg-ai-toggle-btn{width:28px;height:16px;border-radius:8px;position:relative;cursor:pointer;transition:background .15s;border:none}
.wg-ai-toggle-btn.on{background:var(--ember)}
.wg-ai-toggle-btn.off{background:var(--warm-300)}
.wg-ai-toggle-dot{width:12px;height:12px;border-radius:50%;background:#fff;position:absolute;top:2px;transition:left .15s;box-shadow:0 1px 2px rgba(0,0,0,0.06)}
.wg-ai-toggle-btn.on .wg-ai-toggle-dot{left:14px}
.wg-ai-toggle-btn.off .wg-ai-toggle-dot{left:2px}

/* Tier section */
.wg-tier{margin-bottom:20px}
.wg-tier-head{display:flex;align-items:center;gap:8px;margin-bottom:8px;padding:0 2px}
.wg-tier-dot{width:6px;height:6px;border-radius:50%}
.wg-tier-label{font-family:var(--mono);font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.05em}
.wg-tier-count{font-family:var(--mono);font-size:9px;color:var(--ink-300);background:var(--warm-100);padding:1px 6px;border-radius:8px}
.wg-tier-line{flex:1;height:1px;background:var(--warm-200)}

/* Item */
.wg-item{background:#fff;border:1px solid var(--warm-200);border-radius:10px;margin-bottom:6px;overflow:hidden;transition:all .15s}
.wg-item:hover{border-color:var(--warm-300);box-shadow:0 2px 10px rgba(0,0,0,0.02)}
.wg-item.done{opacity:.4;transform:scale(0.98);pointer-events:none}

.wg-item-main{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;cursor:pointer}

/* Icon */
.wg-item-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;flex-shrink:0;border:1px solid;margin-top:2px;transition:all .15s}
.wg-item.done .wg-item-icon{color:#5a9a3c !important;background:rgba(90,154,60,0.04) !important;border-color:rgba(90,154,60,0.08) !important}

/* Body */
.wg-item-body{flex:1;min-width:0}
.wg-item-top-row{display:flex;align-items:center;gap:0;margin-bottom:2px;flex-wrap:wrap}
.wg-item-client{display:flex;align-items:center;gap:4px}
.wg-item-client-av{width:16px;height:16px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:600;color:#fff;flex-shrink:0}
.wg-item-client-name{font-family:var(--mono);font-size:10px;color:var(--ink-400);font-weight:500}
.wg-item-sep{color:var(--warm-300);font-size:10px;margin:0 4px}
.wg-item-age{font-family:var(--mono);font-size:10px;color:var(--ink-300)}

.wg-item-title{font-size:14px;font-weight:500;color:var(--ink-900);line-height:1.3;margin-bottom:2px}
.wg-item-title s{color:var(--ink-300);text-decoration:line-through}
.wg-item-detail{font-size:12px;color:var(--ink-400);line-height:1.4}

/* AI meta */
.wg-item-meta{display:flex;align-items:flex-start;gap:5px;margin-top:8px;padding:7px 9px;background:var(--ember-bg);border:1px solid rgba(176,125,79,0.04);border-radius:6px;font-size:11px;color:var(--ink-500);line-height:1.4;animation:metaIn .15s ease}
@keyframes metaIn{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:translateY(0)}}
.wg-item-meta-badge{font-family:var(--mono);font-size:8px;font-weight:600;color:var(--ember);flex-shrink:0;margin-top:1px}

/* Actions */
.wg-item-actions{display:flex;align-items:center;gap:4px;flex-shrink:0;margin-top:2px}

/* Buttons */
.wg-btn{padding:7px 14px;border-radius:6px;border:none;font-size:12px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .1s;white-space:nowrap}
.wg-btn.danger{background:#c24b38;color:#fff}
.wg-btn.danger:hover{background:#b3422f;transform:translateY(-1px);box-shadow:0 2px 8px rgba(194,75,56,0.15)}
.wg-btn.primary{background:var(--ink-900);color:#fff}
.wg-btn.primary:hover{background:var(--ink-800);transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,0.08)}
.wg-btn.secondary{background:#fff;color:var(--ink-600);border:1px solid var(--warm-200)}
.wg-btn.secondary:hover{background:var(--warm-50);border-color:var(--warm-300)}
.wg-btn.ghost{background:transparent;color:var(--ink-400);border:1px solid var(--warm-200)}
.wg-btn.ghost:hover{background:var(--warm-50)}

.wg-btn-dismiss{width:24px;height:24px;border-radius:5px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;opacity:0;transition:all .08s}
.wg-item:hover .wg-btn-dismiss{opacity:1}
.wg-btn-dismiss:hover{background:var(--warm-100);color:var(--ink-500)}

.wg-item-done-label{font-family:var(--mono);font-size:11px;color:#5a9a3c;font-weight:500}

/* ═══ Empty state ═══ */
.wg-empty{text-align:center;padding:60px 20px}
.wg-empty-icon{width:56px;height:56px;border-radius:14px;background:rgba(90,154,60,0.04);border:1px solid rgba(90,154,60,0.08);display:flex;align-items:center;justify-content:center;font-size:22px;color:#5a9a3c;margin:0 auto 14px}
.wg-empty-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:var(--ink-900);margin-bottom:4px}
.wg-empty-sub{font-size:14px;color:var(--ink-400);line-height:1.5;max-width:360px;margin:0 auto}

/* Footer */
.wg-foot{margin-top:24px;padding-top:14px;border-top:1px solid var(--warm-200);display:flex;justify-content:space-between;align-items:center}
.wg-foot-left{display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:10px;color:var(--ink-300)}
.wg-foot-dot{width:4px;height:4px;border-radius:50%;background:var(--ember);animation:hdDot 2s ease infinite}
.wg-foot-right{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
      `}</style>

      <div className="wg"><div className="wg-in">

        {/* ═══ Header ═══ */}
        <div className="wg-hd">
          <div className="wg-hd-eyebrow">
            <span className="wg-hd-eyebrow-dot" />
            Workspace · GET
          </div>
          <div className="wg-hd-title">{greet}, Alex.</div>
          <div className="wg-hd-sub">
            You have <b>{critical.length} critical</b> item{critical.length !== 1 ? "s" : ""} and <b>{active.length} action</b>{active.length !== 1 ? "s" : ""} waiting.
            {visible.length === 0 && " Actually — you're all clear."}
          </div>
        </div>

        {/* ═══ Summary ═══ */}
        <div className="wg-summary">
          {[
            { val: critical.length, label: "Critical", color: "#c24b38" },
            { val: active.length, label: "Actions", color: "#d97706" },
            { val: watching.length, label: "Watching", color: "#5b7fa4" },
            { val: "$4,000", label: "At risk", color: "#c24b38", isText: true },
          ].map((s, i) => (
            <div key={i} className="wg-summary-item">
              <div className="wg-summary-dot" style={{ background: s.color }} />
              <div>
                <div className="wg-summary-val" style={{ color: s.color }}>{s.isText ? s.val : s.val}</div>
                <div className="wg-summary-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* AI toggle */}
        <div className="wg-ai-toggle">
          <span className="wg-ai-toggle-label">✦ AI insights</span>
          <button className={`wg-ai-toggle-btn${showAIMeta ? " on" : " off"}`}
            onClick={() => setShowAIMeta(!showAIMeta)}>
            <div className="wg-ai-toggle-dot" />
          </button>
        </div>

        {/* ═══ Items ═══ */}
        {allDone ? (
          <div className="wg-empty">
            <div className="wg-empty-icon">✓</div>
            <div className="wg-empty-title">You're clear.</div>
            <div className="wg-empty-sub">Nothing needs your attention right now. Go create something in the Workstation, or take a break — you've earned it.</div>
          </div>
        ) : (
          <>
            {/* Critical */}
            {critical.length > 0 && (
              <div className="wg-tier">
                <div className="wg-tier-head">
                  <div className="wg-tier-dot" style={{ background: "#c24b38" }} />
                  <span className="wg-tier-label" style={{ color: "#c24b38" }}>Needs action now</span>
                  <span className="wg-tier-count">{critical.length}</span>
                  <div className="wg-tier-line" />
                </div>
                {critical.map(renderItem)}
              </div>
            )}

            {/* Active */}
            {active.length > 0 && (
              <div className="wg-tier">
                <div className="wg-tier-head">
                  <div className="wg-tier-dot" style={{ background: "#d97706" }} />
                  <span className="wg-tier-label" style={{ color: "#d97706" }}>Respond or decide</span>
                  <span className="wg-tier-count">{active.length}</span>
                  <div className="wg-tier-line" />
                </div>
                {active.map(renderItem)}
              </div>
            )}

            {/* Watching */}
            {watching.length > 0 && (
              <div className="wg-tier">
                <div className="wg-tier-head">
                  <div className="wg-tier-dot" style={{ background: "#5b7fa4" }} />
                  <span className="wg-tier-label" style={{ color: "#5b7fa4" }}>Keep an eye on</span>
                  <span className="wg-tier-count">{watching.length}</span>
                  <div className="wg-tier-line" />
                </div>
                {watching.map(renderItem)}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="wg-foot">
          <div className="wg-foot-left">
            <span className="wg-foot-dot" />
            <span>AI last scanned 30 seconds ago</span>
          </div>
          <span className="wg-foot-right">{ITEMS.length} items · {ITEMS.length - visible.length} resolved</span>
        </div>

      </div></div>
    </>
  );
}
