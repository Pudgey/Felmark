import { useState } from "react";

const NOTIFS = [
  { id: 1, type: "payment", title: "Payment received — $1,800", body: "Nora Kim paid Invoice #046 · Retainer (March)", time: "32m ago", read: false, icon: "$", color: "#5a9a3c", action: "View invoice", workspace: "Nora Kim" },
  { id: 2, type: "comment", title: "Sarah commented on Brand Guidelines v2", body: "\"Can we make the logo usage section more specific? I want exact minimum sizes.\"", time: "2h ago", read: false, icon: "→", color: "#8a7e63", action: "Reply", workspace: "Meridian Studio", avatar: "S", avatarBg: "#8a7e63" },
  { id: 3, type: "view", title: "Sarah viewed Invoice #047", body: "2nd view · 1m 45s on page · Meridian Studio", time: "2h ago", read: false, icon: "◎", color: "#5b7fa4", action: "Track", workspace: "Meridian Studio" },
  { id: 4, type: "signed", title: "Nora signed the Course Landing Page proposal", body: "Proposal accepted · $3,200 project value · Ready to start", time: "3h ago", read: true, icon: "✓", color: "#5a9a3c", action: "Open project", workspace: "Nora Kim" },
  { id: 5, type: "overdue", title: "Invoice #044 is 4 days overdue", body: "Bolt Fitness · $4,000 · Sent Mar 25 · No views in 48h", time: "Today", read: false, icon: "!", color: "#c24b38", action: "Send reminder", workspace: "Bolt Fitness" },
  { id: 6, type: "edit", title: "Jamie edited Typography section", body: "Brand Guidelines v2 · 8 changes · Typography Scale v3 updated", time: "6h ago", read: true, icon: "✎", color: "#7c8594", action: "Review changes", workspace: "Meridian Studio", avatar: "J", avatarBg: "#7c8594" },
  { id: 7, type: "deadline", title: "Brand Guidelines v2 due in 5 days", body: "65% complete · 3 deliverables remaining · Meridian Studio", time: "Today", read: true, icon: "⏱", color: "#c89360", action: "Open project", workspace: "Meridian Studio" },
  { id: 8, type: "proposal", title: "Proposal sent to Luna Boutique", body: "E-commerce Rebrand · $6,500 · Awaiting response", time: "Yesterday", read: true, icon: "↗", color: "#b07d4f", action: "Track", workspace: "Luna Boutique" },
  { id: 9, type: "wire", title: "3 new signals on The Wire", body: "Nora Kim raised $2M · Meridian hiring · Brand demand +34%", time: "Yesterday", read: true, icon: "◆", color: "#b07d4f", action: "Open The Wire", pro: true },
  { id: 10, type: "milestone", title: "Logo usage rules — approved by all", body: "Brand Guidelines v2 · Sarah ✓ · Jamie ✓ · Ready for next milestone", time: "2 days ago", read: true, icon: "⬡", color: "#5a9a3c", action: "View deliverable", workspace: "Meridian Studio" },
];

const FILTERS = ["All", "Unread", "Payments", "Comments", "Deadlines", "Clients"];
const filterMap = { All: null, Unread: "unread", Payments: "payment", Comments: "comment", Deadlines: "deadline", Clients: "client" };

export default function Notifications() {
  const [filter, setFilter] = useState("All");
  const [notifs, setNotifs] = useState(NOTIFS);
  const [selectedId, setSelectedId] = useState(null);

  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = notifs.filter(n => !n.read).length;

  const filtered = notifs.filter(n => {
    if (filter === "Unread") return !n.read;
    if (filter === "Payments") return n.type === "payment";
    if (filter === "Comments") return n.type === "comment" || n.type === "edit";
    if (filter === "Deadlines") return n.type === "deadline" || n.type === "overdue";
    if (filter === "Clients") return n.type === "signed" || n.type === "view";
    return true;
  });

  const todayNotifs = filtered.filter(n => n.time.includes("ago") || n.time === "Today");
  const olderNotifs = filtered.filter(n => !n.time.includes("ago") && n.time !== "Today");

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
        .notif-page{font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink-700);background:var(--parchment);height:100vh;display:flex;flex-direction:column;max-width:680px;margin:0 auto;border-left:1px solid var(--warm-200);border-right:1px solid var(--warm-200)}

        .n-head{padding:16px 24px;border-bottom:1px solid var(--warm-200);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
        .n-head-left{display:flex;align-items:center;gap:10px}
        .n-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--ink-900)}
        .n-badge{font-family:var(--mono);font-size:10px;color:#fff;background:#c24b38;min-width:20px;height:20px;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:0 6px}
        .n-mark-all{font-family:var(--mono);font-size:11px;color:var(--ink-400);background:none;border:none;cursor:pointer;transition:color .06s}
        .n-mark-all:hover{color:var(--ember)}

        .n-filters{display:flex;gap:3px;padding:10px 24px;border-bottom:1px solid var(--warm-100);flex-shrink:0}
        .n-f{padding:5px 14px;border-radius:5px;font-size:12px;border:none;cursor:pointer;font-family:inherit;color:var(--ink-400);background:none;transition:all .06s}
        .n-f:hover{background:var(--warm-100)}
        .n-f.on{background:var(--ink-900);color:var(--parchment)}

        .n-list{flex:1;overflow-y:auto;padding:0}
        .n-list::-webkit-scrollbar{width:4px}.n-list::-webkit-scrollbar-thumb{background:rgba(0,0,0,.04);border-radius:99px}

        .n-group{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.1em;padding:14px 24px 6px;display:flex;align-items:center;gap:8px}
        .n-group::after{content:'';flex:1;height:1px;background:var(--warm-100)}

        .n-item{display:flex;align-items:flex-start;gap:12px;padding:14px 24px;border-bottom:1px solid var(--warm-100);cursor:pointer;transition:background .06s;position:relative}
        .n-item:hover{background:var(--warm-50)}
        .n-item.unread{background:rgba(176,125,79,0.015)}
        .n-item.unread::before{content:'';position:absolute;left:10px;top:50%;transform:translateY(-50%);width:6px;height:6px;border-radius:50%;background:var(--ember)}

        .n-item-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0}
        .n-item-icon.avatar{color:#fff}

        .n-item-body{flex:1;min-width:0}
        .n-item-title{font-size:14px;color:var(--ink-700);line-height:1.4;margin-bottom:2px}
        .n-item.unread .n-item-title{color:var(--ink-900);font-weight:500}
        .n-item-text{font-size:13px;color:var(--ink-400);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .n-item-footer{display:flex;align-items:center;gap:8px;margin-top:6px}
        .n-item-time{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .n-item-ws{font-family:var(--mono);font-size:9px;color:var(--ink-300);background:var(--warm-100);padding:1px 6px;border-radius:2px}
        .n-item-pro{font-family:var(--mono);font-size:8px;color:var(--ember);background:var(--ember-bg);padding:1px 5px;border-radius:2px;border:1px solid rgba(176,125,79,0.08)}

        .n-item-action{flex-shrink:0;padding:5px 12px;border-radius:5px;border:1px solid var(--warm-200);background:#fff;font-size:11px;color:var(--ink-500);cursor:pointer;font-family:inherit;transition:all .06s;opacity:0}
        .n-item:hover .n-item-action{opacity:1}
        .n-item-action:hover{background:var(--ember);border-color:var(--ember);color:#fff}

        .n-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--ink-300);padding:40px}
        .n-empty-icon{font-size:28px;color:var(--warm-300);margin-bottom:8px}
        .n-empty-text{font-size:14px;color:var(--ink-400)}

        .n-foot{padding:8px 24px;border-top:1px solid var(--warm-100);font-family:var(--mono);font-size:10px;color:var(--ink-300);text-align:center;flex-shrink:0}
      `}</style>

      <div className="notif-page">
        <div className="n-head">
          <div className="n-head-left">
            <span className="n-title">Notifications</span>
            {unreadCount > 0 && <span className="n-badge">{unreadCount}</span>}
          </div>
          {unreadCount > 0 && <button className="n-mark-all" onClick={markAllRead}>Mark all read</button>}
        </div>

        <div className="n-filters">
          {FILTERS.map(f => <button key={f} className={`n-f${filter === f ? " on" : ""}`} onClick={() => setFilter(f)}>{f}</button>)}
        </div>

        <div className="n-list">
          {filtered.length > 0 ? (
            <>
              {todayNotifs.length > 0 && (
                <>
                  <div className="n-group">Today</div>
                  {todayNotifs.map(n => (
                    <div key={n.id} className={`n-item${!n.read ? " unread" : ""}`} onClick={() => markRead(n.id)}>
                      {n.avatar ? (
                        <div className="n-item-icon avatar" style={{ background: n.avatarBg }}>{n.avatar}</div>
                      ) : (
                        <div className="n-item-icon" style={{ background: n.color + "08", color: n.color, border: `1px solid ${n.color}12` }}>{n.icon}</div>
                      )}
                      <div className="n-item-body">
                        <div className="n-item-title">{n.title}</div>
                        <div className="n-item-text">{n.body}</div>
                        <div className="n-item-footer">
                          <span className="n-item-time">{n.time}</span>
                          {n.workspace && <span className="n-item-ws">{n.workspace}</span>}
                          {n.pro && <span className="n-item-pro">PRO</span>}
                        </div>
                      </div>
                      <button className="n-item-action" onClick={e => { e.stopPropagation(); markRead(n.id); }}>{n.action}</button>
                    </div>
                  ))}
                </>
              )}
              {olderNotifs.length > 0 && (
                <>
                  <div className="n-group">Earlier</div>
                  {olderNotifs.map(n => (
                    <div key={n.id} className={`n-item${!n.read ? " unread" : ""}`} onClick={() => markRead(n.id)}>
                      {n.avatar ? (
                        <div className="n-item-icon avatar" style={{ background: n.avatarBg }}>{n.avatar}</div>
                      ) : (
                        <div className="n-item-icon" style={{ background: n.color + "08", color: n.color, border: `1px solid ${n.color}12` }}>{n.icon}</div>
                      )}
                      <div className="n-item-body">
                        <div className="n-item-title">{n.title}</div>
                        <div className="n-item-text">{n.body}</div>
                        <div className="n-item-footer">
                          <span className="n-item-time">{n.time}</span>
                          {n.workspace && <span className="n-item-ws">{n.workspace}</span>}
                          {n.pro && <span className="n-item-pro">PRO</span>}
                        </div>
                      </div>
                      <button className="n-item-action" onClick={e => { e.stopPropagation(); markRead(n.id); }}>{n.action}</button>
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
            <div className="n-empty">
              <div className="n-empty-icon">◎</div>
              <div className="n-empty-text">No notifications in this category</div>
            </div>
          )}
        </div>

        <div className="n-foot">You're up to date</div>
      </div>
    </>
  );
}
