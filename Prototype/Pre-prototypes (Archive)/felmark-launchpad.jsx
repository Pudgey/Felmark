import { useState, useEffect, useRef } from "react";

const SCREENS = [
  { id: "dashboard", name: "Dashboard", icon: "⊞", shortcut: "⌘1", desc: "Overview & stats", section: "core" },
  { id: "pipeline", name: "Pipeline", icon: "◆", shortcut: "⌘2", desc: "Deals & opportunities", section: "core" },
  { id: "calendar", name: "Calendar", icon: "◇", shortcut: "⌘3", desc: "Schedule & events", section: "core" },
  { id: "services", name: "Services", icon: "$", shortcut: "⌘4", desc: "Your offerings", section: "core" },
  { id: "templates", name: "Templates", icon: "§", shortcut: "⌘5", desc: "Contracts & proposals", section: "core" },
  { id: "wire", name: "The Wire", icon: "↗", shortcut: "⌘6", desc: "Industry signals", section: "core", pro: true },
  { id: "search", name: "Search", icon: "◎", shortcut: "⌘/", desc: "Find anything", section: "tools" },
  { id: "command", name: "Command Palette", icon: "❯", shortcut: "⌘K", desc: "Quick actions", section: "tools" },
  { id: "settings", name: "Settings", icon: "⚙", shortcut: "⌘,", desc: "Preferences", section: "tools" },
];

const RECENTS = [
  { id: "r1", name: "Brand Guidelines v2", workspace: "Meridian Studio", type: "doc", icon: "☰", color: "#7c8594", time: "2m ago", progress: 65 },
  { id: "r2", name: "Course Landing Page Proposal", workspace: "Nora Kim", type: "proposal", icon: "◆", color: "#a08472", time: "1h ago", progress: null },
  { id: "r3", name: "Invoice #047", workspace: "Meridian Studio", type: "invoice", icon: "$", color: "#7c8594", time: "3h ago", progress: null, status: "sent" },
  { id: "r4", name: "App Onboarding UX", workspace: "Bolt Fitness", type: "doc", icon: "☰", color: "#8a7e63", time: "Yesterday", progress: 70 },
  { id: "r5", name: "Typography Scale v3", workspace: "Meridian Studio", type: "doc", icon: "☰", color: "#7c8594", time: "Yesterday", progress: 45 },
];

const PINNED = [
  { id: "p1", name: "Freelance Service Agreement", type: "template", icon: "§", color: "#b07d4f" },
  { id: "p2", name: "Rate Calculator", type: "tool", icon: "⊗", color: "#5a9a3c" },
  { id: "p3", name: "Brand Identity — Pricing", type: "service", icon: "$", color: "#b07d4f" },
];

const WORKSPACES = [
  { id: "w1", name: "Meridian Studio", avatar: "M", color: "#7c8594", unread: 2 },
  { id: "w2", name: "Nora Kim", avatar: "N", color: "#a08472", unread: 0 },
  { id: "w3", name: "Bolt Fitness", avatar: "B", color: "#8a7e63", unread: 1 },
  { id: "w4", name: "Luna Boutique", avatar: "L", color: "#7c6b9e", unread: 0 },
];

export default function Launchpad() {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [hoveredScreen, setHoveredScreen] = useState(null);
  const [hoveredRecent, setHoveredRecent] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const filteredScreens = search
    ? SCREENS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase()))
    : SCREENS;

  const filteredRecents = search
    ? RECENTS.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.workspace.toLowerCase().includes(search.toLowerCase()))
    : RECENTS;

  const coreScreens = filteredScreens.filter(s => s.section === "core");
  const toolScreens = filteredScreens.filter(s => s.section === "tools");

  const typeCfg = {
    doc: { label: "Document", tagColor: "var(--ink-400)" },
    proposal: { label: "Proposal", tagColor: "#b07d4f" },
    invoice: { label: "Invoice", tagColor: "#5a9a3c" },
    template: { label: "Template", tagColor: "#7c6b9e" },
    tool: { label: "Tool", tagColor: "#5b7fa4" },
    service: { label: "Service", tagColor: "#b07d4f" },
  };

  if (!open) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
        <style>{`
          .lp-trigger-page { font-family: 'Outfit', sans-serif; height: 100vh; background: #faf9f7; display: flex; align-items: center; justify-content: center; }
          .lp-trigger { width: 40px; height: 40px; border-radius: 8px; border: 1px solid #e5e2db; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.1s; }
          .lp-trigger:hover { background: #f0eee9; border-color: #d5d1c8; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
          .lp-trigger svg { color: #7d7a72; }
        `}</style>
        <div className="lp-trigger-page">
          <button className="lp-trigger" onClick={() => setOpen(true)} title="Launchpad">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="11" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

        .lp-overlay{position:fixed;inset:0;background:rgba(44,42,37,0.4);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:flex-start;justify-content:center;padding-top:80px;animation:lpOverIn .2s ease}
        @keyframes lpOverIn{from{opacity:0}to{opacity:1}}

        .lp{width:680px;background:var(--parchment);border-radius:16px;box-shadow:0 16px 64px rgba(0,0,0,0.15),0 0 0 1px rgba(0,0,0,0.04);overflow:hidden;animation:lpIn .2s ease;max-height:calc(100vh - 120px);display:flex;flex-direction:column}
        @keyframes lpIn{from{opacity:0;transform:translateY(-8px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}

        .lp-search-wrap{padding:16px 20px 12px;border-bottom:1px solid var(--warm-200);flex-shrink:0}
        .lp-search-row{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#fff;border:1px solid var(--warm-200);border-radius:10px;transition:all .15s}
        .lp-search-row.focused{border-color:var(--ember);box-shadow:0 0 0 3px rgba(176,125,79,0.04)}
        .lp-search-icon{color:var(--ink-300);flex-shrink:0;display:flex}
        .lp-search{flex:1;border:none;outline:none;font-family:'Outfit',sans-serif;font-size:16px;color:var(--ink-800);background:transparent}
        .lp-search::placeholder{color:var(--warm-400);font-weight:300}
        .lp-search-hints{display:flex;gap:4px;flex-shrink:0}
        .lp-kbd{font-family:var(--mono);font-size:9px;color:var(--ink-300);background:var(--warm-100);border:1px solid var(--warm-200);border-radius:3px;padding:1px 5px}

        .lp-body{flex:1;overflow-y:auto;padding:8px 0}
        .lp-body::-webkit-scrollbar{width:4px}.lp-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.04);border-radius:99px}

        /* ── Section labels ── */
        .lp-sec{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.1em;padding:12px 20px 6px;display:flex;align-items:center;gap:8px}
        .lp-sec::after{content:'';flex:1;height:1px;background:var(--warm-100)}

        /* ── Screen tiles ── */
        .lp-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:0 16px}
        .lp-tile{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;transition:all .08s;border:1px solid transparent;position:relative}
        .lp-tile:hover{background:var(--warm-50);border-color:var(--warm-200)}
        .lp-tile.hovered{background:var(--ember-bg);border-color:rgba(176,125,79,0.1)}
        .lp-tile-icon{width:36px;height:36px;border-radius:8px;background:var(--warm-50);border:1px solid var(--warm-200);display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--ink-600);flex-shrink:0;transition:all .1s}
        .lp-tile:hover .lp-tile-icon{background:var(--warm-100);border-color:var(--warm-300)}
        .lp-tile.hovered .lp-tile-icon{background:var(--ember-bg);border-color:rgba(176,125,79,0.12);color:var(--ember)}
        .lp-tile-info{flex:1;min-width:0}
        .lp-tile-name{font-size:13px;font-weight:500;color:var(--ink-800);display:flex;align-items:center;gap:5px}
        .lp-tile-desc{font-size:11px;color:var(--ink-400);margin-top:1px}
        .lp-tile-shortcut{font-family:var(--mono);font-size:9px;color:var(--ink-300);background:var(--warm-100);border:1px solid var(--warm-200);padding:1px 5px;border-radius:3px;position:absolute;top:6px;right:8px;opacity:0;transition:opacity .08s}
        .lp-tile:hover .lp-tile-shortcut{opacity:1}
        .lp-tile-pro{font-family:var(--mono);font-size:8px;color:var(--ember);background:var(--ember-bg);padding:0 4px;border-radius:2px;border:1px solid rgba(176,125,79,0.08);letter-spacing:.03em}

        /* ── Tool tiles (smaller) ── */
        .lp-tools{display:flex;gap:4px;padding:0 16px}
        .lp-tool{display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:6px;cursor:pointer;transition:all .06s;flex:1;border:1px solid transparent}
        .lp-tool:hover{background:var(--warm-50);border-color:var(--warm-200)}
        .lp-tool-icon{font-size:12px;color:var(--ink-500);flex-shrink:0;width:20px;text-align:center}
        .lp-tool-name{font-size:12px;color:var(--ink-600)}
        .lp-tool-key{font-family:var(--mono);font-size:9px;color:var(--ink-300);margin-left:auto}

        /* ── Recents ── */
        .lp-recents{padding:0 12px}
        .lp-recent{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:7px;cursor:pointer;transition:all .06s;border:1px solid transparent}
        .lp-recent:hover{background:var(--warm-50);border-color:var(--warm-200)}
        .lp-recent.hovered{background:var(--ember-bg);border-color:rgba(176,125,79,0.08)}
        .lp-recent-icon{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}
        .lp-recent-info{flex:1;min-width:0}
        .lp-recent-name{font-size:13px;font-weight:500;color:var(--ink-700);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .lp-recent-meta{display:flex;align-items:center;gap:5px;margin-top:1px;font-size:11px;color:var(--ink-400)}
        .lp-recent-type{font-family:var(--mono);font-size:9px;padding:0 5px;border-radius:2px}
        .lp-recent-right{display:flex;align-items:center;gap:6px;flex-shrink:0}
        .lp-recent-progress{width:36px;height:3px;background:var(--warm-200);border-radius:2px;overflow:hidden}
        .lp-recent-progress-fill{height:100%;border-radius:2px}
        .lp-recent-time{font-family:var(--mono);font-size:10px;color:var(--ink-300)}

        /* ── Pinned ── */
        .lp-pinned{display:flex;gap:6px;padding:0 16px}
        .lp-pin{display:flex;align-items:center;gap:7px;padding:7px 12px;border-radius:6px;cursor:pointer;transition:all .06s;border:1px solid var(--warm-200);background:#fff;flex:1}
        .lp-pin:hover{border-color:var(--warm-300);box-shadow:0 2px 6px rgba(0,0,0,0.02)}
        .lp-pin-icon{font-size:13px;flex-shrink:0}
        .lp-pin-info{flex:1;min-width:0}
        .lp-pin-name{font-size:12px;font-weight:500;color:var(--ink-700);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .lp-pin-type{font-family:var(--mono);font-size:9px;color:var(--ink-300)}

        /* ── Workspaces quick switch ── */
        .lp-ws-row{display:flex;gap:4px;padding:0 16px}
        .lp-ws{display:flex;align-items:center;gap:6px;padding:7px 10px;border-radius:6px;cursor:pointer;transition:all .06s;flex:1;position:relative}
        .lp-ws:hover{background:var(--warm-100)}
        .lp-ws-av{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#fff;flex-shrink:0;position:relative}
        .lp-ws-unread{position:absolute;top:-2px;right:-2px;width:12px;height:12px;border-radius:50%;background:#c24b38;color:#fff;font-size:7px;font-weight:600;display:flex;align-items:center;justify-content:center;border:1.5px solid var(--parchment)}
        .lp-ws-name{font-size:12px;color:var(--ink-600);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

        /* ── Footer ── */
        .lp-footer{padding:10px 20px;border-top:1px solid var(--warm-100);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
        .lp-footer-left{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .lp-footer-right{display:flex;gap:4px}
        .lp-footer-hint{display:flex;align-items:center;gap:3px;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
      `}</style>

      <div className="lp-overlay" onClick={() => setOpen(false)}>
        <div className="lp" onClick={e => e.stopPropagation()}>
          {/* Search */}
          <div className="lp-search-wrap">
            <div className={`lp-search-row${search ? " focused" : ""}`}>
              <span className="lp-search-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/><path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </span>
              <input ref={inputRef} className="lp-search" placeholder="Jump to anything..."
                value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => { if (e.key === "Escape") { if (search) setSearch(""); else setOpen(false); }}} />
              <div className="lp-search-hints">
                <span className="lp-kbd">esc</span>
              </div>
            </div>
          </div>

          <div className="lp-body">
            {/* ── Screen tiles ── */}
            {coreScreens.length > 0 && (
              <>
                <div className="lp-sec">screens</div>
                <div className="lp-tiles">
                  {coreScreens.map(s => (
                    <div key={s.id}
                      className={`lp-tile${hoveredScreen === s.id ? " hovered" : ""}`}
                      onMouseEnter={() => setHoveredScreen(s.id)}
                      onMouseLeave={() => setHoveredScreen(null)}>
                      <div className="lp-tile-icon">{s.icon}</div>
                      <div className="lp-tile-info">
                        <div className="lp-tile-name">
                          {s.name}
                          {s.pro && <span className="lp-tile-pro">PRO</span>}
                        </div>
                        <div className="lp-tile-desc">{s.desc}</div>
                      </div>
                      <span className="lp-tile-shortcut">{s.shortcut}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── Tools ── */}
            {toolScreens.length > 0 && (
              <>
                <div className="lp-sec">tools</div>
                <div className="lp-tools">
                  {toolScreens.map(s => (
                    <div key={s.id} className="lp-tool">
                      <span className="lp-tool-icon">{s.icon}</span>
                      <span className="lp-tool-name">{s.name}</span>
                      <span className="lp-tool-key">{s.shortcut}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── Workspaces quick switch ── */}
            <div className="lp-sec">workspaces</div>
            <div className="lp-ws-row">
              {WORKSPACES.map(w => (
                <div key={w.id} className="lp-ws">
                  <div className="lp-ws-av" style={{ background: w.color }}>
                    {w.avatar}
                    {w.unread > 0 && <span className="lp-ws-unread">{w.unread}</span>}
                  </div>
                  <span className="lp-ws-name">{w.name}</span>
                </div>
              ))}
            </div>

            {/* ── Recents ── */}
            {filteredRecents.length > 0 && (
              <>
                <div className="lp-sec">recent</div>
                <div className="lp-recents">
                  {filteredRecents.map(r => {
                    const tc = typeCfg[r.type];
                    return (
                      <div key={r.id}
                        className={`lp-recent${hoveredRecent === r.id ? " hovered" : ""}`}
                        onMouseEnter={() => setHoveredRecent(r.id)}
                        onMouseLeave={() => setHoveredRecent(null)}>
                        <div className="lp-recent-icon" style={{ background: r.color + "0a", color: r.color, border: `1px solid ${r.color}15` }}>{r.icon}</div>
                        <div className="lp-recent-info">
                          <div className="lp-recent-name">{r.name}</div>
                          <div className="lp-recent-meta">
                            <span className="lp-recent-type" style={{ color: tc.tagColor, background: tc.tagColor + "08" }}>{tc.label}</span>
                            <span>{r.workspace}</span>
                          </div>
                        </div>
                        <div className="lp-recent-right">
                          {r.progress !== null && (
                            <div className="lp-recent-progress">
                              <div className="lp-recent-progress-fill" style={{ width: `${r.progress}%`, background: r.progress >= 60 ? "#5a9a3c" : "#b07d4f" }} />
                            </div>
                          )}
                          {r.status && <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#5a9a3c" }}>{r.status}</span>}
                          <span className="lp-recent-time">{r.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── Pinned ── */}
            <div className="lp-sec">pinned</div>
            <div className="lp-pinned">
              {PINNED.map(p => {
                const tc = typeCfg[p.type];
                return (
                  <div key={p.id} className="lp-pin">
                    <span className="lp-pin-icon" style={{ color: p.color }}>{p.icon}</span>
                    <div className="lp-pin-info">
                      <div className="lp-pin-name">{p.name}</div>
                      <div className="lp-pin-type">{tc.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="lp-footer">
            <div className="lp-footer-left">
              <svg width="14" height="14" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="#b07d4f" strokeWidth="1.5"/></svg>
              Felmark
            </div>
            <div className="lp-footer-right">
              <span className="lp-footer-hint"><span className="lp-kbd">↑↓</span> navigate</span>
              <span className="lp-footer-hint"><span className="lp-kbd">⏎</span> open</span>
              <span className="lp-footer-hint"><span className="lp-kbd">esc</span> close</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
