import { useState, useRef, useEffect } from "react";

const uid = () => Math.random().toString(36).slice(2, 10);

const TEAM_MEMBERS = [
  { id: "u1", name: "You", avatar: "A", color: "#b07d4f", online: true },
  { id: "u2", name: "Jamie Park", avatar: "J", color: "#7c8594", online: true },
  { id: "u3", name: "Priya Sharma", avatar: "P", color: "#a08472", online: false },
  { id: "u4", name: "Marcus Cole", avatar: "M", color: "#5a9a3c", online: true },
  { id: "u5", name: "Sarah Chen", avatar: "S", color: "#8a7e63", online: false },
];

const CONVERSATIONS = [
  {
    id: "c-team", type: "team", name: "Team", icon: "◆", unread: 3,
    messages: [
      { id: "m1", user: "u4", text: "Meridian just approved the mood board direction — we're good to move forward", time: "10:42am" },
      { id: "m2", user: "u2", text: "Nice! I'll start the typography system today", time: "10:45am" },
      { id: "m3", user: "u3", text: "Can someone share the latest color palette file? Need it for the social templates", time: "11:01am" },
      { id: "m4", user: "u4", text: "Just dropped it in the Brand Guidelines workspace", time: "11:03am" },
      { id: "m5", user: "u1", text: "Thanks Marcus. Priya check the callout block in the doc — linked it there too", time: "11:15am" },
    ],
  },
  {
    id: "c-p1", type: "project", name: "Brand Guidelines v2", workspace: "Meridian Studio", icon: "●", unread: 1,
    messages: [
      { id: "m6", user: "u2", text: "Should we go with variable fonts or static? Variable gives us more flexibility but file size is bigger", time: "9:30am" },
      { id: "m7", user: "u1", text: "Variable. The client wants web + print from the same system", time: "9:34am" },
      { id: "m8", user: "u2", text: "Got it, I'll set up the scale with Outfit variable then", time: "9:35am" },
    ],
  },
  {
    id: "c-p4", type: "project", name: "Course Landing Page", workspace: "Nora Kim", icon: "●", unread: 0,
    messages: [
      { id: "m9", user: "u3", text: "Nora wants the hero section to feel 'warm but professional' — her words", time: "Yesterday" },
      { id: "m10", user: "u1", text: "I'll pull some reference screenshots. That's basically our whole Felmark palette lol", time: "Yesterday" },
    ],
  },
  {
    id: "c-p6", type: "project", name: "App Onboarding UX", workspace: "Bolt Fitness", icon: "●", unread: 0,
    messages: [
      { id: "m11", user: "u4", text: "This one is overdue — client pinged me twice. What's the blocker?", time: "Yesterday" },
      { id: "m12", user: "u1", text: "Waiting on their API docs. I'll follow up today", time: "Yesterday" },
    ],
  },
  {
    id: "c-dm1", type: "dm", name: "Jamie Park", userId: "u2", unread: 0,
    messages: [
      { id: "m13", user: "u2", text: "Hey, can you review my type scale before I send it to the client?", time: "8:20am" },
      { id: "m14", user: "u1", text: "Yeah send it over, I'll look at lunch", time: "8:25am" },
    ],
  },
  {
    id: "c-dm2", type: "dm", name: "Sarah Chen", userId: "u5", unread: 2,
    messages: [
      { id: "m15", user: "u5", text: "Quick question — is the proposal for the brand guidelines sent yet?", time: "10:50am" },
      { id: "m16", user: "u5", text: "I want to review before it goes out", time: "10:51am" },
    ],
  },
];

export default function ConversationsPanel() {
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [activeConvo, setActiveConvo] = useState("c-team");
  const [draft, setDraft] = useState("");
  const [panelOpen, setPanelOpen] = useState(true);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showNewDm, setShowNewDm] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const active = conversations.find(c => c.id === activeConvo);
  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [activeConvo, active?.messages?.length]);

  useEffect(() => {
    if (activeConvo && inputRef.current) inputRef.current.focus();
  }, [activeConvo]);

  const sendMessage = () => {
    if (!draft.trim()) return;
    const newMsg = { id: uid(), user: "u1", text: draft.trim(), time: "now" };
    setConversations(prev => prev.map(c =>
      c.id === activeConvo ? { ...c, messages: [...c.messages, newMsg], unread: 0 } : c
    ));
    setDraft("");
  };

  const selectConvo = (id) => {
    setActiveConvo(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const createProjectConvo = () => {
    const newConvo = {
      id: uid(), type: "project", name: "New Conversation",
      workspace: "Personal", icon: "●", unread: 0, messages: [],
    };
    setConversations(prev => [...prev, newConvo]);
    setActiveConvo(newConvo.id);
    setShowNewMenu(false);
  };

  const createDm = (userId) => {
    const user = TEAM_MEMBERS.find(u => u.id === userId);
    const existing = conversations.find(c => c.type === "dm" && c.userId === userId);
    if (existing) { selectConvo(existing.id); setShowNewDm(false); return; }
    const newConvo = {
      id: uid(), type: "dm", name: user.name, userId, unread: 0, messages: [],
    };
    setConversations(prev => [...prev, newConvo]);
    setActiveConvo(newConvo.id);
    setShowNewDm(false);
    setShowNewMenu(false);
  };

  const teamConvos = conversations.filter(c => c.type === "team");
  const projectConvos = conversations.filter(c => c.type === "project");
  const dmConvos = conversations.filter(c => c.type === "dm");

  const getUser = (id) => TEAM_MEMBERS.find(u => u.id === id) || { name: "Unknown", avatar: "?", color: "#999" };

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
          --rail-bg: #353330;
        }

        .conv-wrapper {
          display: flex; height: 100vh;
          font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--ink-700);
        }

        /* ── Toggle tab (sits beside rail) ── */
        .conv-tab {
          width: 48px; background: var(--rail-bg);
          display: flex; flex-direction: column; align-items: center;
          padding: 10px 0; gap: 4px; flex-shrink: 0;
        }

        .tab-icon-btn {
          width: 36px; height: 36px; border-radius: 6px; border: none;
          background: none; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          color: #8a867e; transition: all 0.1s; position: relative;
        }
        .tab-icon-btn:hover { background: rgba(255,255,255,0.06); color: #c8c4bb; }
        .tab-icon-btn.on { background: rgba(255,255,255,0.08); color: #c8c4bb; }
        .tab-badge {
          position: absolute; top: 4px; right: 3px;
          min-width: 14px; height: 14px; border-radius: 7px;
          background: var(--ember); color: #fff; font-size: 9px;
          font-weight: 600; display: flex; align-items: center;
          justify-content: center; padding: 0 3px;
          font-family: var(--mono); border: 2px solid var(--rail-bg);
        }
        .rsep { width: 20px; height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0; }

        /* ── Panel ── */
        .conv-panel {
          width: 320px; min-width: 320px; background: var(--parchment);
          display: flex; flex-direction: column;
          border-right: 1px solid var(--warm-200);
          transition: width 0.15s, min-width 0.15s;
          overflow: hidden;
        }
        .conv-panel.closed { width: 0; min-width: 0; }
        .conv-panel-inner { width: 320px; display: flex; height: 100%; }

        /* ── Sidebar list ── */
        .conv-list {
          width: 100%; display: flex; flex-direction: column;
          background: var(--warm-50);
        }

        .conv-list-head {
          padding: 14px 14px 10px; display: flex;
          align-items: center; justify-content: space-between;
          border-bottom: 1px solid var(--warm-200); flex-shrink: 0;
        }
        .conv-list-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px; font-weight: 600; color: var(--ink-900);
        }
        .conv-list-actions { display: flex; gap: 4px; }
        .conv-icon-btn {
          width: 28px; height: 28px; border-radius: 5px; border: none;
          background: none; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          color: var(--ink-400); transition: all 0.08s;
        }
        .conv-icon-btn:hover { background: var(--warm-200); color: var(--ink-600); }

        /* Search */
        .conv-search {
          margin: 8px 10px; padding: 7px 10px; border-radius: 5px;
          border: 1px solid var(--warm-200); background: var(--parchment);
          font-family: inherit; font-size: 12.5px; color: var(--ink-700);
          outline: none; width: calc(100% - 20px);
        }
        .conv-search:focus { border-color: var(--ember); box-shadow: 0 0 0 2px rgba(176,125,79,0.06); }
        .conv-search::placeholder { color: var(--warm-400); }

        /* Section labels */
        .conv-section-label {
          font-family: var(--mono); font-size: 9px; font-weight: 500;
          color: var(--ink-400); letter-spacing: 0.1em; text-transform: uppercase;
          padding: 12px 14px 4px;
        }

        .conv-scroll { flex: 1; overflow-y: auto; }
        .conv-scroll::-webkit-scrollbar { width: 3px; }
        .conv-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }

        /* Conversation item */
        .conv-item {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 14px; cursor: pointer; transition: background 0.06s;
          position: relative;
        }
        .conv-item:hover { background: var(--warm-100); }
        .conv-item.on { background: var(--ember-bg); }

        .conv-item-icon {
          width: 32px; height: 32px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600; flex-shrink: 0;
        }
        .conv-item-icon.team { background: var(--ink-900); color: var(--ember-light); }
        .conv-item-icon.project { background: var(--warm-200); color: var(--ink-600); font-size: 10px; }
        .conv-item-icon.dm { color: #fff; }

        .conv-item-info { flex: 1; min-width: 0; }
        .conv-item-name { font-size: 13px; font-weight: 500; color: var(--ink-800); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .conv-item-preview { font-size: 11.5px; color: var(--ink-400); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 1px; }
        .conv-item.on .conv-item-name { color: var(--ink-900); }

        .conv-item-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
        .conv-item-time { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }
        .conv-unread {
          min-width: 16px; height: 16px; border-radius: 8px;
          background: var(--ember); color: #fff; font-size: 9px;
          font-weight: 600; display: flex; align-items: center;
          justify-content: center; padding: 0 4px; font-family: var(--mono);
        }

        .conv-item-ws { font-size: 10px; color: var(--ink-400); margin-top: 1px; }

        /* Online dot */
        .online-dot {
          position: absolute; bottom: 8px; left: 34px;
          width: 8px; height: 8px; border-radius: 50%;
          border: 2px solid var(--warm-50);
        }
        .conv-item.on .online-dot { border-color: #faf5ef; }

        /* ── Chat view ── */
        .conv-chat {
          flex: 1; display: flex; flex-direction: column;
          background: var(--parchment); min-width: 0;
        }

        .chat-head {
          padding: 12px 20px; border-bottom: 1px solid var(--warm-200);
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
        }
        .chat-head-icon {
          width: 28px; height: 28px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; flex-shrink: 0;
        }
        .chat-head-info { flex: 1; }
        .chat-head-name { font-size: 14px; font-weight: 600; color: var(--ink-900); }
        .chat-head-meta { font-family: var(--mono); font-size: 10px; color: var(--ink-400); margin-top: 1px; }
        .chat-head-actions { display: flex; gap: 4px; }

        /* Messages */
        .chat-messages {
          flex: 1; overflow-y: auto; padding: 16px 20px;
        }
        .chat-messages::-webkit-scrollbar { width: 3px; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }

        .msg {
          display: flex; gap: 10px; margin-bottom: 16px;
          animation: msgIn 0.15s ease;
        }
        .msg-avatar {
          width: 28px; height: 28px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: #fff; flex-shrink: 0;
          margin-top: 2px;
        }
        .msg-body { flex: 1; min-width: 0; }
        .msg-header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 3px; }
        .msg-name { font-size: 13px; font-weight: 600; color: var(--ink-800); }
        .msg-time { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }
        .msg-text { font-size: 14px; color: var(--ink-700); line-height: 1.6; }
        .msg.self .msg-name { color: var(--ember); }

        /* Composer */
        .chat-composer {
          padding: 12px 20px 16px; border-top: 1px solid var(--warm-100); flex-shrink: 0;
        }
        .composer-wrap {
          display: flex; align-items: flex-end; gap: 8px;
          background: #fff; border: 1px solid var(--warm-200);
          border-radius: 8px; padding: 10px 12px;
          transition: border-color 0.15s;
        }
        .composer-wrap:focus-within { border-color: var(--ember); box-shadow: 0 0 0 3px rgba(176,125,79,0.06); }
        .composer-input {
          flex: 1; border: none; outline: none; resize: none;
          font-family: inherit; font-size: 13.5px; color: var(--ink-800);
          background: transparent; line-height: 1.5; min-height: 20px; max-height: 80px;
        }
        .composer-input::placeholder { color: var(--warm-400); }
        .composer-actions { display: flex; gap: 2px; flex-shrink: 0; }
        .composer-btn {
          width: 28px; height: 28px; border-radius: 5px; border: none;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.1s;
        }
        .composer-attach { background: none; color: var(--ink-300); }
        .composer-attach:hover { background: var(--warm-100); color: var(--ink-500); }
        .composer-send { background: var(--ember); color: #fff; }
        .composer-send:hover { background: var(--ember-light); }
        .composer-send:disabled { background: var(--warm-200); color: var(--warm-400); cursor: default; }
        .composer-hint { font-family: var(--mono); font-size: 10px; color: var(--ink-300); margin-top: 6px; padding: 0 2px; display: flex; align-items: center; gap: 4px; }
        .kbd { font-family: var(--mono); font-size: 9px; color: var(--ink-400); background: var(--warm-100); border: 1px solid var(--warm-200); border-radius: 3px; padding: 1px 4px; }

        /* ── New conversation menu ── */
        .new-menu {
          position: absolute; top: 44px; right: 10px;
          background: #fff; border-radius: 8px; width: 200px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05);
          padding: 4px; z-index: 50;
        }
        .new-menu-item {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 10px; border-radius: 5px; cursor: pointer;
          font-size: 13px; color: var(--ink-700); transition: background 0.06s;
        }
        .new-menu-item:hover { background: var(--ember-bg); }
        .new-menu-icon { font-family: var(--mono); font-size: 12px; color: var(--ink-400); width: 20px; text-align: center; }

        /* ── DM picker ── */
        .dm-picker {
          position: absolute; top: 44px; right: 10px;
          background: #fff; border-radius: 8px; width: 220px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05);
          padding: 4px; z-index: 50;
        }
        .dm-picker-label { font-family: var(--mono); font-size: 9px; color: var(--ink-400); padding: 6px 10px 4px; text-transform: uppercase; letter-spacing: 0.08em; }
        .dm-user {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 10px; border-radius: 5px; cursor: pointer;
          transition: background 0.06s;
        }
        .dm-user:hover { background: var(--ember-bg); }
        .dm-user-av {
          width: 24px; height: 24px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .dm-user-name { font-size: 13px; color: var(--ink-700); }
        .dm-user-status { width: 6px; height: 6px; border-radius: 50%; margin-left: auto; flex-shrink: 0; }

        /* ── Empty state ── */
        .chat-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 40px; text-align: center;
        }
        .chat-empty-icon { color: var(--warm-300); margin-bottom: 12px; }
        .chat-empty-title { font-size: 14px; font-weight: 500; color: var(--ink-500); margin-bottom: 4px; }
        .chat-empty-sub { font-size: 12.5px; color: var(--ink-300); line-height: 1.5; }

        @keyframes msgIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="conv-wrapper">
        {/* ═══ ICON TAB (beside rail) ═══ */}
        <div className="conv-tab">
          <button className={`tab-icon-btn${panelOpen ? " on" : ""}`} onClick={() => setPanelOpen(!panelOpen)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15 10.5c0 .8-.5 1.5-1.2 1.5H5.5l-3.5 3V4c0-.8.5-1.5 1.2-1.5h10.6c.7 0 1.2.7 1.2 1.5v6.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            </svg>
            {totalUnread > 0 && <span className="tab-badge">{totalUnread}</span>}
          </button>

          <div className="rsep" />

          <button className="tab-icon-btn" title="Workspaces">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>
          </button>
          <button className="tab-icon-btn" title="Search">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* ═══ CONVERSATION LIST ═══ */}
        <div className={`conv-panel${panelOpen ? "" : " closed"}`}>
          <div className="conv-panel-inner">
            <div className="conv-list" style={{ position: "relative" }}>
              <div className="conv-list-head">
                <span className="conv-list-title">Messages</span>
                <div className="conv-list-actions">
                  <button className="conv-icon-btn" onClick={() => { setShowNewMenu(p => !p); setShowNewDm(false); }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                </div>
                {showNewMenu && (
                  <div className="new-menu">
                    <div className="new-menu-item" onClick={createProjectConvo}>
                      <span className="new-menu-icon">●</span> Project conversation
                    </div>
                    <div className="new-menu-item" onClick={() => { setShowNewDm(true); setShowNewMenu(false); }}>
                      <span className="new-menu-icon">@</span> Direct message
                    </div>
                  </div>
                )}
                {showNewDm && (
                  <div className="dm-picker">
                    <div className="dm-picker-label">Send message to</div>
                    {TEAM_MEMBERS.filter(u => u.id !== "u1").map(u => (
                      <div key={u.id} className="dm-user" onClick={() => createDm(u.id)}>
                        <div className="dm-user-av" style={{ background: u.color }}>{u.avatar}</div>
                        <span className="dm-user-name">{u.name}</span>
                        <div className="dm-user-status" style={{ background: u.online ? "#5a9a3c" : "var(--warm-300)" }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input className="conv-search" placeholder="Search conversations..." value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)} />

              <div className="conv-scroll">
                {/* Team */}
                <div className="conv-section-label">team</div>
                {teamConvos.filter(c => c.name.toLowerCase().includes(searchFilter.toLowerCase())).map(c => {
                  const lastMsg = c.messages[c.messages.length - 1];
                  const lastUser = lastMsg ? getUser(lastMsg.user) : null;
                  return (
                    <div key={c.id} className={`conv-item${activeConvo === c.id ? " on" : ""}`} onClick={() => selectConvo(c.id)}>
                      <div className="conv-item-icon team">◆</div>
                      <div className="conv-item-info">
                        <div className="conv-item-name">{c.name}</div>
                        {lastMsg && <div className="conv-item-preview">{lastUser?.name?.split(" ")[0]}: {lastMsg.text}</div>}
                      </div>
                      <div className="conv-item-meta">
                        {lastMsg && <span className="conv-item-time">{lastMsg.time}</span>}
                        {c.unread > 0 && <span className="conv-unread">{c.unread}</span>}
                      </div>
                    </div>
                  );
                })}

                {/* Projects */}
                <div className="conv-section-label">projects</div>
                {projectConvos.filter(c => c.name.toLowerCase().includes(searchFilter.toLowerCase())).map(c => {
                  const lastMsg = c.messages[c.messages.length - 1];
                  const lastUser = lastMsg ? getUser(lastMsg.user) : null;
                  return (
                    <div key={c.id} className={`conv-item${activeConvo === c.id ? " on" : ""}`} onClick={() => selectConvo(c.id)}>
                      <div className="conv-item-icon project">#</div>
                      <div className="conv-item-info">
                        <div className="conv-item-name">{c.name}</div>
                        {c.workspace && <div className="conv-item-ws">{c.workspace}</div>}
                        {lastMsg && <div className="conv-item-preview">{lastUser?.name?.split(" ")[0]}: {lastMsg.text}</div>}
                      </div>
                      <div className="conv-item-meta">
                        {lastMsg && <span className="conv-item-time">{lastMsg.time}</span>}
                        {c.unread > 0 && <span className="conv-unread">{c.unread}</span>}
                      </div>
                    </div>
                  );
                })}

                {/* DMs */}
                <div className="conv-section-label">direct messages</div>
                {dmConvos.filter(c => c.name.toLowerCase().includes(searchFilter.toLowerCase())).map(c => {
                  const lastMsg = c.messages[c.messages.length - 1];
                  const user = TEAM_MEMBERS.find(u => u.id === c.userId);
                  return (
                    <div key={c.id} className={`conv-item${activeConvo === c.id ? " on" : ""}`} onClick={() => selectConvo(c.id)} style={{ position: "relative" }}>
                      <div className="conv-item-icon dm" style={{ background: user?.color || "#999" }}>{user?.avatar}</div>
                      {user && <div className="online-dot" style={{ background: user.online ? "#5a9a3c" : "var(--warm-300)" }} />}
                      <div className="conv-item-info">
                        <div className="conv-item-name">{c.name}</div>
                        {lastMsg && <div className="conv-item-preview">{lastMsg.text}</div>}
                      </div>
                      <div className="conv-item-meta">
                        {lastMsg && <span className="conv-item-time">{lastMsg.time}</span>}
                        {c.unread > 0 && <span className="conv-unread">{c.unread}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ CHAT VIEW ═══ */}
        <div className="conv-chat">
          {active ? (
            <>
              <div className="chat-head">
                <div className="chat-head-icon" style={{
                  background: active.type === "team" ? "var(--ink-900)" : active.type === "dm" ? (TEAM_MEMBERS.find(u => u.id === active.userId)?.color || "#999") : "var(--warm-200)",
                  color: active.type === "team" ? "var(--ember-light)" : active.type === "dm" ? "#fff" : "var(--ink-600)",
                  fontSize: active.type === "project" ? 10 : 12,
                }}>
                  {active.type === "team" ? "◆" : active.type === "project" ? "#" : TEAM_MEMBERS.find(u => u.id === active.userId)?.avatar}
                </div>
                <div className="chat-head-info">
                  <div className="chat-head-name">{active.name}</div>
                  <div className="chat-head-meta">
                    {active.type === "team" && `${TEAM_MEMBERS.filter(u => u.online).length} online · ${TEAM_MEMBERS.length} members`}
                    {active.type === "project" && active.workspace}
                    {active.type === "dm" && (TEAM_MEMBERS.find(u => u.id === active.userId)?.online ? "Online" : "Offline")}
                  </div>
                </div>
                <div className="chat-head-actions">
                  <button className="conv-icon-btn" title="Pin conversation">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 9L2 12M8.5 2.5l3 3-2 2.5-1-1-3 3-2-2 3-3-1-1z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="conv-icon-btn" title="Search messages">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.1"/><path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                  </button>
                  <button className="conv-icon-btn" title="Members">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.1"/><path d="M3 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                  </button>
                </div>
              </div>

              <div className="chat-messages">
                {active.messages.map(msg => {
                  const user = getUser(msg.user);
                  const isSelf = msg.user === "u1";
                  return (
                    <div key={msg.id} className={`msg${isSelf ? " self" : ""}`}>
                      <div className="msg-avatar" style={{ background: user.color }}>{user.avatar}</div>
                      <div className="msg-body">
                        <div className="msg-header">
                          <span className="msg-name">{isSelf ? "You" : user.name}</span>
                          <span className="msg-time">{msg.time}</span>
                        </div>
                        <div className="msg-text">{msg.text}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-composer">
                <div className="composer-wrap">
                  <textarea ref={inputRef} className="composer-input" placeholder={`Message ${active.name}...`}
                    value={draft} onChange={e => setDraft(e.target.value)} rows={1}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
                  <div className="composer-actions">
                    <button className="composer-btn composer-attach" title="Attach file">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7.5 3.5v6a2 2 0 01-4 0v-7a3 3 0 016 0v7.5a1 1 0 01-2 0V4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                    </button>
                    <button className="composer-btn composer-send" onClick={sendMessage} disabled={!draft.trim()}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 11V3M4 5.5L7 2.5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </div>
                <div className="composer-hint">
                  <kbd className="kbd">⏎</kbd> send · <kbd className="kbd">⇧⏎</kbd> new line
                </div>
              </div>
            </>
          ) : (
            <div className="chat-empty">
              <div className="chat-empty-icon">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M30 21c0 1.5-1 3-2.5 3H11l-7 6V8c0-1.5 1-3 2.5-3h21c1.5 0 2.5 1.5 2.5 3v13z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              </div>
              <div className="chat-empty-title">Select a conversation</div>
              <div className="chat-empty-sub">Or start a new one with the + button</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
