import { useState, useRef, useEffect } from "react";

const uid = () => Math.random().toString(36).slice(2, 10);

const TEAM = [
  { id: "u1", name: "You", avatar: "A", color: "#b07d4f", online: true },
  { id: "u2", name: "Jamie Park", avatar: "J", color: "#7c8594", online: true },
  { id: "u3", name: "Priya Sharma", avatar: "P", color: "#a08472", online: false },
  { id: "u4", name: "Marcus Cole", avatar: "M", color: "#5a9a3c", online: true },
  { id: "u5", name: "Sarah Chen", avatar: "S", color: "#8a7e63", online: false },
];

const CONVOS = [
  {
    id: "c-team", type: "team", name: "Team", icon: "◆", unread: 3, pinned: true, muted: false, priority: false,
    typing: ["u2"],
    threads: 4,
    lastMsg: { user: "u1", text: "Thanks Marcus. Priya check the callout block in the doc — linked it there too", time: "11:15am", timeSort: 1115 },
    participants: ["u1", "u2", "u3", "u4"],
    reactions: { "👍": 2, "🔥": 1 },
  },
  {
    id: "c-p1", type: "project", name: "Brand Guidelines v2", workspace: "Meridian Studio", wsColor: "#7c8594",
    icon: "#", unread: 1, pinned: true, muted: false, priority: true,
    typing: [],
    threads: 2,
    lastMsg: { user: "u2", text: "Jamie: Got it, I'll set up the scale with Outfit variable then", time: "9:35am", timeSort: 935 },
    participants: ["u1", "u2"],
    attachment: { type: "file", name: "typography-scale.fig" },
  },
  {
    id: "c-p4", type: "project", name: "Course Landing Page", workspace: "Nora Kim", wsColor: "#a08472",
    icon: "#", unread: 0, pinned: false, muted: false, priority: false,
    typing: [],
    threads: 1,
    lastMsg: { user: "u1", text: "You: I'll pull some reference screenshots. That's basically our whole Felmark palette lol", time: "Yesterday", timeSort: -1 },
    participants: ["u1", "u3"],
  },
  {
    id: "c-p6", type: "project", name: "App Onboarding UX", workspace: "Bolt Fitness", wsColor: "#8a7e63",
    icon: "#", unread: 0, pinned: false, muted: true, priority: false,
    typing: [],
    threads: 0,
    lastMsg: { user: "u1", text: "You: Waiting on their API docs. I'll follow up today", time: "Yesterday", timeSort: -1 },
    participants: ["u1", "u4"],
  },
  {
    id: "c-dm1", type: "dm", name: "Jamie Park", userId: "u2", unread: 0, pinned: false, muted: false, priority: false,
    typing: ["u2"],
    threads: 0,
    lastMsg: { user: "u2", text: "Yeah send it over, I'll look at lunch", time: "8:25am", timeSort: 825 },
  },
  {
    id: "c-dm2", type: "dm", name: "Sarah Chen", userId: "u5", unread: 2, pinned: false, muted: false, priority: true,
    typing: [],
    threads: 0,
    lastMsg: { user: "u5", text: "I want to review before it goes out", time: "10:51am", timeSort: 1051 },
  },
  {
    id: "c-dm3", type: "dm", name: "Marcus Cole", userId: "u4", unread: 0, pinned: false, muted: false, priority: false,
    typing: [],
    threads: 0,
    lastMsg: { user: "u4", text: "Meridian approved the mood board 🎉", time: "Yesterday", timeSort: -1 },
  },
  {
    id: "c-p7", type: "project", name: "Monthly Blog Posts", workspace: "Bolt Fitness", wsColor: "#8a7e63",
    icon: "#", unread: 0, pinned: false, muted: false, priority: false,
    typing: [],
    threads: 0,
    lastMsg: { user: "u4", text: "Marcus: I'll draft the outline by Friday", time: "Mon", timeSort: -2 },
    participants: ["u1", "u4"],
  },
];

export default function ConversationsV2() {
  const [convos, setConvos] = useState(CONVOS);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | unread | pinned
  const [showNew, setShowNew] = useState(false);
  const [showNewDm, setShowNewDm] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [kbIndex, setKbIndex] = useState(-1);
  const searchRef = useRef(null);

  const totalUnread = convos.reduce((s, c) => s + (c.muted ? 0 : c.unread), 0);

  const select = (id) => {
    setActiveId(id);
    setConvos(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const togglePin = (id, e) => {
    e.stopPropagation();
    setConvos(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  };

  const toggleMute = (id, e) => {
    e.stopPropagation();
    setConvos(prev => prev.map(c => c.id === id ? { ...c, muted: !c.muted } : c));
  };

  const getUser = (id) => TEAM.find(u => u.id === id) || { name: "?", avatar: "?", color: "#999", online: false };

  // Filter & search
  let list = convos;
  if (search) list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.workspace?.toLowerCase().includes(search.toLowerCase()));
  if (filter === "unread") list = list.filter(c => c.unread > 0);
  if (filter === "pinned") list = list.filter(c => c.pinned);

  // Group: pinned first, then today, then yesterday, then older
  const pinned = list.filter(c => c.pinned);
  const unpinned = list.filter(c => !c.pinned);
  const today = unpinned.filter(c => c.lastMsg.timeSort > 0);
  const yesterday = unpinned.filter(c => c.lastMsg.timeSort === -1);
  const older = unpinned.filter(c => c.lastMsg.timeSort < -1);

  const groups = [];
  if (pinned.length) groups.push({ label: "pinned", items: pinned });
  if (today.length) groups.push({ label: "today", items: today.sort((a, b) => b.lastMsg.timeSort - a.lastMsg.timeSort) });
  if (yesterday.length) groups.push({ label: "yesterday", items: yesterday });
  if (older.length) groups.push({ label: "older", items: older });

  const flatList = groups.flatMap(g => g.items);

  // Keyboard nav
  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setKbIndex(i => Math.min(i + 1, flatList.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setKbIndex(i => Math.max(i - 1, 0)); }
      else if (e.key === "Enter" && kbIndex >= 0 && flatList[kbIndex]) { select(flatList[kbIndex].id); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [kbIndex, flatList]);

  const createDm = (userId) => {
    const user = TEAM.find(u => u.id === userId);
    const existing = convos.find(c => c.type === "dm" && c.userId === userId);
    if (existing) { select(existing.id); setShowNewDm(false); setShowNew(false); return; }
    const nc = { id: uid(), type: "dm", name: user.name, userId, unread: 0, pinned: false, muted: false, priority: false, typing: [], threads: 0, lastMsg: { user: "u1", text: "New conversation", time: "now", timeSort: 9999 } };
    setConvos(prev => [nc, ...prev]);
    select(nc.id);
    setShowNewDm(false);
    setShowNew(false);
  };

  const renderConvo = (c, globalIdx) => {
    const isActive = activeId === c.id;
    const isHovered = hovered === c.id;
    const isKb = kbIndex === globalIdx;
    const lastUser = getUser(c.lastMsg.user);
    const dmUser = c.type === "dm" ? getUser(c.userId) : null;
    const typingUsers = (c.typing || []).map(id => getUser(id));

    return (
      <div key={c.id}
        className={`conv${isActive ? " active" : ""}${isKb ? " kb" : ""}${c.muted ? " muted" : ""}`}
        onClick={() => select(c.id)}
        onMouseEnter={() => setHovered(c.id)}
        onMouseLeave={() => setHovered(null)}>

        {/* Icon */}
        <div className="conv-icon-wrap">
          {c.type === "team" ? (
            <div className="conv-icon team-icon">
              <svg width="16" height="16" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="1.8"/><path d="M14 8v14M8 11.5l6 3.5 6-3.5" stroke="currentColor" strokeWidth="1.2"/></svg>
            </div>
          ) : c.type === "project" ? (
            <div className="conv-icon proj-icon" style={{ borderColor: c.wsColor + "40" }}>
              <span style={{ color: c.wsColor || "var(--ink-400)" }}>#</span>
            </div>
          ) : (
            <div className="conv-icon dm-icon" style={{ background: dmUser?.color }}>
              {dmUser?.avatar}
              <span className="dm-presence" style={{ background: dmUser?.online ? "#5a9a3c" : "var(--warm-300)" }} />
            </div>
          )}
          {c.priority && <span className="conv-priority">!</span>}
        </div>

        {/* Content */}
        <div className="conv-body">
          <div className="conv-top-row">
            <span className="conv-name">{c.name}</span>
            <span className="conv-time">{c.lastMsg.time}</span>
          </div>

          {c.type === "project" && c.workspace && (
            <div className="conv-workspace">{c.workspace}</div>
          )}

          {/* Typing indicator or last message */}
          {typingUsers.length > 0 ? (
            <div className="conv-typing">
              <span className="typing-dots"><span /><span /><span /></span>
              {typingUsers.map(u => u.name.split(" ")[0]).join(", ")} typing...
            </div>
          ) : (
            <div className="conv-preview">
              {c.lastMsg.text}
            </div>
          )}

          {/* Bottom row: meta indicators */}
          <div className="conv-bottom-row">
            {c.type === "team" && c.participants && (
              <div className="conv-avatars">
                {c.participants.slice(0, 3).map(uid => {
                  const u = getUser(uid);
                  return <div key={uid} className="conv-mini-av" style={{ background: u.color }}>{u.avatar}</div>;
                })}
                {c.participants.length > 3 && <span className="conv-av-more">+{c.participants.length - 3}</span>}
              </div>
            )}

            {c.threads > 0 && (
              <span className="conv-threads">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 3.5h5l2 2v-4a1 1 0 00-1-1h-5a1 1 0 00-1 1v4l1.5-1.5z" stroke="currentColor" strokeWidth="0.9"/><path d="M3.5 5.5v1a1 1 0 001 1h3l1.5 1.5v-4a1 1 0 00-1-1" stroke="currentColor" strokeWidth="0.9"/></svg>
                {c.threads}
              </span>
            )}

            {c.attachment && (
              <span className="conv-attach">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5.5 2.5v4.5a1.5 1.5 0 01-3 0V3a2 2 0 014 0v4.5a.5.5 0 01-1 0V3.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/></svg>
                {c.attachment.name}
              </span>
            )}

            {c.reactions && Object.keys(c.reactions).length > 0 && (
              <div className="conv-reactions">
                {Object.entries(c.reactions).map(([emoji, count]) => (
                  <span key={emoji} className="conv-reaction">{emoji} {count}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: unread + actions */}
        <div className="conv-right">
          {c.unread > 0 && !c.muted && <span className="conv-unread">{c.unread}</span>}
          {c.muted && <span className="conv-muted-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M9.5 5V3.5a3.5 3.5 0 00-6.3-2.1M2.5 4v1a3.5 3.5 0 005.7 2.7M6 9v1.5M4 10.5h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
          </span>}

          {isHovered && (
            <div className="conv-actions">
              <button className={`conv-act${c.pinned ? " on" : ""}`} title={c.pinned ? "Unpin" : "Pin"} onClick={e => togglePin(c.id, e)}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M4 8L2 10M7 1.5l2 2-1.5 2-.5-.5L4 8l-1.5-1.5L5.5 3.5 5 3z" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill={c.pinned ? "currentColor" : "none"}/></svg>
              </button>
              <button className="conv-act" title={c.muted ? "Unmute" : "Mute"} onClick={e => toggleMute(c.id, e)}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">{c.muted ? <><path d="M0.5 0.5l9 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/><path d="M8 4V3a3 3 0 00-5.4-1.8M2 3.5v.5a3 3 0 004.8 2.4M5 7.5v1M3.5 8.5h3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/></> : <><path d="M5 1.5a2.5 2.5 0 012.5 2.5v1a2.5 2.5 0 01-5 0V4A2.5 2.5 0 015 1.5zM5 7v1.5M3.5 8.5h3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/></>}</svg>
              </button>
              <button className="conv-act" title="More">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="2" cy="5" r="0.8" fill="currentColor"/><circle cx="5" cy="5" r="0.8" fill="currentColor"/><circle cx="8" cy="5" r="0.8" fill="currentColor"/></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  let globalIdx = -1;

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
          --panel: #f2f1ed; --panel-hover: #eceae5; --panel-active: #e6e4de;
        }

        .msg-panel {
          width: 340px; font-family: 'Outfit', sans-serif; font-size: 14px;
          color: var(--ink-700); background: var(--parchment);
          display: flex; flex-direction: column; height: 100vh;
          border-right: 1px solid rgba(0,0,0,0.05);
        }

        /* ── Header ── */
        .msg-head {
          padding: 16px 16px 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .msg-title-row { display: flex; align-items: center; gap: 8px; }
        .msg-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: var(--ink-900); }
        .msg-unread-badge {
          font-family: var(--mono); font-size: 10px; font-weight: 600;
          background: var(--ember); color: #fff; min-width: 18px; height: 18px;
          border-radius: 9px; display: flex; align-items: center;
          justify-content: center; padding: 0 5px;
        }
        .msg-head-actions { display: flex; gap: 2px; }
        .msg-icon-btn {
          width: 28px; height: 28px; border-radius: 6px; border: none;
          background: none; cursor: pointer; display: flex; align-items: center;
          justify-content: center; color: var(--ink-400); transition: all 0.08s;
          position: relative;
        }
        .msg-icon-btn:hover { background: var(--warm-100); color: var(--ink-600); }

        /* ── Filter tabs ── */
        .msg-filters {
          display: flex; gap: 2px; padding: 0 14px 10px; flex-shrink: 0;
        }
        .msg-filter {
          padding: 4px 12px; border-radius: 4px; font-size: 12px;
          border: none; cursor: pointer; font-family: inherit;
          color: var(--ink-400); background: none; transition: all 0.08s;
          font-weight: 400;
        }
        .msg-filter:hover { background: var(--warm-100); }
        .msg-filter.on { background: var(--ink-900); color: var(--parchment); font-weight: 500; }
        .msg-filter-count {
          font-family: var(--mono); font-size: 9px; color: var(--ink-300);
          margin-left: 3px;
        }

        /* ── Search ── */
        .msg-search-wrap { position: relative; padding: 0 14px 8px; flex-shrink: 0; }
        .msg-search-icon {
          position: absolute; left: 24px; top: 8px;
          color: var(--ink-300); pointer-events: none;
        }
        .msg-search {
          width: 100%; padding: 8px 10px 8px 32px; border-radius: 6px;
          border: 1px solid var(--warm-200); background: var(--warm-50);
          font-family: inherit; font-size: 13px; color: var(--ink-700); outline: none;
        }
        .msg-search:focus { border-color: var(--ember); background: #fff; box-shadow: 0 0 0 2px rgba(176,125,79,0.06); }
        .msg-search::placeholder { color: var(--warm-400); }
        .msg-search-shortcut {
          position: absolute; right: 24px; top: 8px;
          font-family: var(--mono); font-size: 9px; color: var(--ink-300);
          background: var(--warm-100); border: 1px solid var(--warm-200);
          border-radius: 3px; padding: 1px 5px;
        }

        /* ── Scroll ── */
        .msg-scroll { flex: 1; overflow-y: auto; }
        .msg-scroll::-webkit-scrollbar { width: 3px; }
        .msg-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }

        /* ── Group label ── */
        .group-label {
          font-family: var(--mono); font-size: 9px; font-weight: 500;
          color: var(--ink-400); letter-spacing: 0.1em; text-transform: uppercase;
          padding: 12px 16px 4px;
          display: flex; align-items: center; gap: 8px;
        }
        .group-label::after { content: ''; flex: 1; height: 1px; background: var(--warm-200); }

        /* ── Conversation row ── */
        .conv {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 14px; cursor: pointer; transition: background 0.06s;
          position: relative; border-left: 2px solid transparent;
          margin: 0 2px;
          border-radius: 6px;
        }
        .conv:hover { background: var(--panel-hover); }
        .conv.active { background: var(--ember-bg); border-left-color: var(--ember); }
        .conv.kb { background: var(--warm-100); outline: 1px solid var(--warm-300); outline-offset: -1px; }
        .conv.muted { opacity: 0.55; }
        .conv.muted:hover { opacity: 0.8; }

        /* ── Icon ── */
        .conv-icon-wrap { position: relative; flex-shrink: 0; }
        .conv-icon {
          width: 38px; height: 38px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 600; flex-shrink: 0;
        }
        .team-icon { background: var(--ink-900); color: var(--ember-light); }
        .proj-icon { background: var(--warm-100); border: 1px solid; font-family: var(--mono); font-size: 16px; font-weight: 500; }
        .dm-icon { color: #fff; position: relative; }
        .dm-presence {
          position: absolute; bottom: -1px; right: -1px;
          width: 10px; height: 10px; border-radius: 50%;
          border: 2px solid var(--parchment);
        }
        .conv.active .dm-presence { border-color: #faf5ef; }
        .conv-priority {
          position: absolute; top: -2px; left: -2px;
          width: 14px; height: 14px; border-radius: 50%;
          background: #c24b38; color: #fff; font-size: 9px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid var(--parchment);
        }

        /* ── Body ── */
        .conv-body { flex: 1; min-width: 0; padding-top: 1px; }
        .conv-top-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 1px; }
        .conv-name { font-size: 14px; font-weight: 500; color: var(--ink-800); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .conv.active .conv-name { color: var(--ink-900); font-weight: 600; }
        .conv-time { font-family: var(--mono); font-size: 10px; color: var(--ink-300); flex-shrink: 0; }

        .conv-workspace { font-size: 11px; color: var(--ink-400); margin-bottom: 2px; }

        .conv-preview {
          font-size: 12.5px; color: var(--ink-400); line-height: 1.4;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          max-width: 100%;
        }

        .conv-typing {
          font-size: 12px; color: var(--ember); display: flex;
          align-items: center; gap: 4px;
        }
        .typing-dots { display: flex; gap: 2px; align-items: center; }
        .typing-dots span {
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--ember); animation: typePulse 1.2s ease infinite;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typePulse { 0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); } 30% { opacity: 1; transform: scale(1); } }

        /* Bottom row */
        .conv-bottom-row {
          display: flex; align-items: center; gap: 8px; margin-top: 4px;
          flex-wrap: wrap;
        }

        .conv-avatars { display: flex; align-items: center; }
        .conv-mini-av {
          width: 16px; height: 16px; border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          font-size: 8px; font-weight: 600; color: #fff;
          margin-right: -4px; border: 1.5px solid var(--parchment);
          position: relative;
        }
        .conv.active .conv-mini-av { border-color: #faf5ef; }
        .conv-av-more { font-family: var(--mono); font-size: 9px; color: var(--ink-300); margin-left: 6px; }

        .conv-threads {
          font-family: var(--mono); font-size: 10px; color: var(--ink-300);
          display: flex; align-items: center; gap: 3px;
        }

        .conv-attach {
          font-family: var(--mono); font-size: 10px; color: var(--ink-400);
          display: flex; align-items: center; gap: 3px;
          background: var(--warm-100); padding: 1px 6px; border-radius: 3px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          max-width: 140px;
        }

        .conv-reactions { display: flex; gap: 3px; }
        .conv-reaction {
          font-size: 10px; background: var(--warm-100); padding: 1px 5px;
          border-radius: 3px; border: 1px solid var(--warm-200);
        }

        /* ── Right column ── */
        .conv-right {
          display: flex; flex-direction: column; align-items: flex-end;
          gap: 4px; flex-shrink: 0; min-width: 28px; padding-top: 2px;
        }
        .conv-unread {
          font-family: var(--mono); font-size: 10px; font-weight: 600;
          background: var(--ember); color: #fff;
          min-width: 18px; height: 18px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 5px;
        }
        .conv-muted-icon { color: var(--ink-300); display: flex; }

        .conv-actions {
          display: flex; gap: 1px; margin-top: 2px;
        }
        .conv-act {
          width: 20px; height: 20px; border-radius: 4px; border: none;
          background: none; cursor: pointer; display: flex; align-items: center;
          justify-content: center; color: var(--ink-300); transition: all 0.06s;
        }
        .conv-act:hover { background: var(--warm-200); color: var(--ink-600); }
        .conv-act.on { color: var(--ember); }

        /* ── New menu ── */
        .new-menu {
          position: absolute; top: 36px; right: 0; width: 200px;
          background: #fff; border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04);
          padding: 4px; z-index: 50;
        }
        .new-menu-item {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 10px; border-radius: 5px; cursor: pointer;
          font-size: 13px; color: var(--ink-700); transition: background 0.06s;
        }
        .new-menu-item:hover { background: var(--ember-bg); }
        .new-menu-icon { font-family: var(--mono); font-size: 12px; color: var(--ink-400); width: 20px; text-align: center; }

        .dm-picker {
          position: absolute; top: 36px; right: 0; width: 220px;
          background: #fff; border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04);
          padding: 4px; z-index: 50;
        }
        .dm-picker-label { font-family: var(--mono); font-size: 9px; color: var(--ink-400); padding: 6px 10px 4px; text-transform: uppercase; letter-spacing: 0.08em; }
        .dm-user-item {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 10px; border-radius: 5px; cursor: pointer;
          transition: background 0.06s;
        }
        .dm-user-item:hover { background: var(--ember-bg); }
        .dm-user-av {
          width: 24px; height: 24px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 600; color: #fff;
        }
        .dm-user-name { font-size: 13px; color: var(--ink-700); flex: 1; }
        .dm-user-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        /* ── Footer ── */
        .msg-footer {
          padding: 8px 16px; border-top: 1px solid rgba(0,0,0,0.04);
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }
        .msg-footer-link {
          font-size: 12px; color: var(--ember); font-weight: 500;
          background: none; border: none; cursor: pointer;
          font-family: inherit; display: flex; align-items: center; gap: 4px;
        }
        .msg-footer-link:hover { color: var(--ember-light); }
        .msg-footer-count { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }
        .msg-footer-kbd { font-family: var(--mono); font-size: 9px; color: var(--ink-300); background: var(--warm-100); border: 1px solid var(--warm-200); border-radius: 3px; padding: 1px 4px; margin-left: 4px; }
      `}</style>

      <div className="msg-panel">
        {/* ── Header ── */}
        <div className="msg-head">
          <div className="msg-title-row">
            <span className="msg-title">Messages</span>
            {totalUnread > 0 && <span className="msg-unread-badge">{totalUnread}</span>}
          </div>
          <div className="msg-head-actions">
            <div style={{ position: "relative" }}>
              <button className="msg-icon-btn" onClick={() => { setShowNew(!showNew); setShowNewDm(false); }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              {showNew && !showNewDm && (
                <div className="new-menu">
                  <div className="new-menu-item" onClick={() => setShowNew(false)}><span className="new-menu-icon">#</span> Project conversation</div>
                  <div className="new-menu-item" onClick={() => { setShowNewDm(true); }}><span className="new-menu-icon">@</span> Direct message</div>
                </div>
              )}
              {showNewDm && (
                <div className="dm-picker">
                  <div className="dm-picker-label">send message to</div>
                  {TEAM.filter(u => u.id !== "u1").map(u => (
                    <div key={u.id} className="dm-user-item" onClick={() => createDm(u.id)}>
                      <div className="dm-user-av" style={{ background: u.color }}>{u.avatar}</div>
                      <span className="dm-user-name">{u.name}</span>
                      <div className="dm-user-dot" style={{ background: u.online ? "#5a9a3c" : "var(--warm-300)" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="msg-icon-btn">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="msg-filters">
          <button className={`msg-filter${filter === "all" ? " on" : ""}`} onClick={() => setFilter("all")}>
            All<span className="msg-filter-count">{convos.length}</span>
          </button>
          <button className={`msg-filter${filter === "unread" ? " on" : ""}`} onClick={() => setFilter("unread")}>
            Unread<span className="msg-filter-count">{convos.filter(c => c.unread > 0).length}</span>
          </button>
          <button className={`msg-filter${filter === "pinned" ? " on" : ""}`} onClick={() => setFilter("pinned")}>
            Pinned<span className="msg-filter-count">{convos.filter(c => c.pinned).length}</span>
          </button>
        </div>

        {/* ── Search ── */}
        <div className="msg-search-wrap">
          <svg className="msg-search-icon" width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          <input ref={searchRef} className="msg-search" placeholder="Search conversations..." value={search}
            onChange={e => setSearch(e.target.value)} />
          <span className="msg-search-shortcut">⌘F</span>
        </div>

        {/* ── List ── */}
        <div className="msg-scroll">
          {groups.map(group => (
            <div key={group.label}>
              <div className="group-label">{group.label}</div>
              {group.items.map(c => {
                globalIdx++;
                return renderConvo(c, globalIdx);
              })}
            </div>
          ))}

          {list.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink-300)" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M26 18c0 1.2-.8 2.4-2 2.4H10l-5.6 5.6V6.4C4.4 5.2 5.2 4 6.4 4h17.2C24.8 4 26 5.2 26 6.4V18z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-500)" }}>No conversations found</div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="msg-footer">
          <button className="msg-footer-link">
            Open full view
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 7l4-4M4 3h3v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="msg-footer-count">{convos.length} conversations</span>
            <span className="msg-footer-kbd">↑↓</span>
          </div>
        </div>
      </div>
    </>
  );
}
