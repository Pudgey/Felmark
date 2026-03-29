"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import styles from "./ConversationPanel.module.css";

const genId = () => Math.random().toString(36).slice(2, 10);

// ── Types ──

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  color: string;
  online: boolean;
}

interface LastMsg {
  user: string;
  text: string;
  time: string;
  timeSort: number;
}

interface Attachment {
  type: string;
  name: string;
}

interface Conversation {
  id: string;
  type: "team" | "project" | "dm";
  name: string;
  workspace?: string;
  wsColor?: string;
  icon?: string;
  userId?: string;
  unread: number;
  pinned: boolean;
  muted: boolean;
  priority: boolean;
  typing: string[];
  threads: number;
  lastMsg: LastMsg;
  participants?: string[];
  attachment?: Attachment;
  reactions?: Record<string, number>;
  messages?: Message[];
}

interface Message {
  id: string;
  user: string;
  text: string;
  time: string;
}

// ── Data ──

const TEAM: TeamMember[] = [
  { id: "u1", name: "You", avatar: "A", color: "#b07d4f", online: true },
  { id: "u2", name: "Jamie Park", avatar: "J", color: "#7c8594", online: true },
  { id: "u3", name: "Priya Sharma", avatar: "P", color: "#a08472", online: false },
  { id: "u4", name: "Marcus Cole", avatar: "M", color: "#5a9a3c", online: true },
  { id: "u5", name: "Sarah Chen", avatar: "S", color: "#8a7e63", online: false },
];

const getUser = (id: string): TeamMember =>
  TEAM.find(u => u.id === id) || { id: "?", name: "Unknown", avatar: "?", color: "#999", online: false };

const SEED_MESSAGES: Record<string, Message[]> = {
  "c-team": [
    { id: "m1", user: "u4", text: "Meridian just approved the mood board direction — we're good to move forward", time: "10:42am" },
    { id: "m2", user: "u2", text: "Nice! I'll start the typography system today", time: "10:45am" },
    { id: "m3", user: "u3", text: "Can someone share the latest color palette file? Need it for the social templates", time: "11:01am" },
    { id: "m4", user: "u4", text: "Just dropped it in the Brand Guidelines workspace", time: "11:03am" },
    { id: "m5", user: "u1", text: "Thanks Marcus. Priya check the callout block in the doc — linked it there too", time: "11:15am" },
  ],
  "c-p1": [
    { id: "m6", user: "u2", text: "Should we go with variable fonts or static? Variable gives us more flexibility but file size is bigger", time: "9:30am" },
    { id: "m7", user: "u1", text: "Variable. The client wants web + print from the same system", time: "9:34am" },
    { id: "m8", user: "u2", text: "Got it, I'll set up the scale with Outfit variable then", time: "9:35am" },
  ],
  "c-p4": [
    { id: "m9", user: "u3", text: "Nora wants the hero section to feel 'warm but professional' — her words", time: "Yesterday" },
    { id: "m10", user: "u1", text: "I'll pull some reference screenshots. That's basically our whole Felmark palette lol", time: "Yesterday" },
  ],
  "c-p6": [
    { id: "m11", user: "u4", text: "This one is overdue — client pinged me twice. What's the blocker?", time: "Yesterday" },
    { id: "m12", user: "u1", text: "Waiting on their API docs. I'll follow up today", time: "Yesterday" },
  ],
  "c-dm1": [
    { id: "m13", user: "u2", text: "Hey, can you review my type scale before I send it to the client?", time: "8:20am" },
    { id: "m14", user: "u1", text: "Yeah send it over, I'll look at lunch", time: "8:25am" },
  ],
  "c-dm2": [
    { id: "m15", user: "u5", text: "Quick question — is the proposal for the brand guidelines sent yet?", time: "10:50am" },
    { id: "m16", user: "u5", text: "I want to review before it goes out", time: "10:51am" },
  ],
};

const INITIAL_CONVOS: Conversation[] = [
  {
    id: "c-team", type: "team", name: "Team", icon: "◆", unread: 3, pinned: true, muted: false, priority: false,
    typing: ["u2"], threads: 4,
    lastMsg: { user: "u1", text: "Thanks Marcus. Priya check the callout block in the doc — linked it there too", time: "11:15am", timeSort: 1115 },
    participants: ["u1", "u2", "u3", "u4"],
    reactions: { "👍": 2 },
  },
  {
    id: "c-p1", type: "project", name: "Brand Guidelines v2", workspace: "Meridian Studio", wsColor: "#7c8594",
    icon: "#", unread: 1, pinned: true, muted: false, priority: true,
    typing: [], threads: 2,
    lastMsg: { user: "u2", text: "Jamie: Got it, I'll set up the scale with Outfit variable then", time: "9:35am", timeSort: 935 },
    participants: ["u1", "u2"],
    attachment: { type: "file", name: "typography-scale.fig" },
  },
  {
    id: "c-p4", type: "project", name: "Course Landing Page", workspace: "Nora Kim", wsColor: "#a08472",
    icon: "#", unread: 0, pinned: false, muted: false, priority: false,
    typing: [], threads: 1,
    lastMsg: { user: "u1", text: "You: I'll pull some reference screenshots. That's basically our whole Felmark palette lol", time: "Yesterday", timeSort: -1 },
    participants: ["u1", "u3"],
  },
  {
    id: "c-p6", type: "project", name: "App Onboarding UX", workspace: "Bolt Fitness", wsColor: "#8a7e63",
    icon: "#", unread: 0, pinned: false, muted: true, priority: false,
    typing: [], threads: 0,
    lastMsg: { user: "u1", text: "You: Waiting on their API docs. I'll follow up today", time: "Yesterday", timeSort: -1 },
    participants: ["u1", "u4"],
  },
  {
    id: "c-dm1", type: "dm", name: "Jamie Park", userId: "u2", unread: 0, pinned: false, muted: false, priority: false,
    typing: [], threads: 0,
    lastMsg: { user: "u2", text: "Yeah send it over, I'll look at lunch", time: "8:25am", timeSort: 825 },
  },
  {
    id: "c-dm2", type: "dm", name: "Sarah Chen", userId: "u5", unread: 2, pinned: false, muted: false, priority: true,
    typing: [], threads: 0,
    lastMsg: { user: "u5", text: "I want to review before it goes out", time: "10:51am", timeSort: 1051 },
  },
  {
    id: "c-dm3", type: "dm", name: "Marcus Cole", userId: "u4", unread: 0, pinned: false, muted: false, priority: false,
    typing: [], threads: 0,
    lastMsg: { user: "u4", text: "Meridian approved the mood board", time: "Yesterday", timeSort: -1 },
  },
  {
    id: "c-p7", type: "project", name: "Monthly Blog Posts", workspace: "Bolt Fitness", wsColor: "#8a7e63",
    icon: "#", unread: 0, pinned: false, muted: false, priority: false,
    typing: [], threads: 0,
    lastMsg: { user: "u4", text: "Marcus: I'll draft the outline by Friday", time: "Mon", timeSort: -2 },
    participants: ["u1", "u4"],
  },
];

// ── Component ──

interface ConversationPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function ConversationPanel({ open, onClose }: ConversationPanelProps) {
  const [convos, setConvos] = useState(INITIAL_CONVOS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "pinned">("all");
  const [showNew, setShowNew] = useState(false);
  const [showNewDm, setShowNewDm] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [kbIndex, setKbIndex] = useState(-1);
  const [draft, setDraft] = useState("");

  const searchRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const newMenuRef = useRef<HTMLDivElement>(null);

  const active = convos.find(c => c.id === activeId);

  // Expose total unread for parent badge
  const totalUnread = convos.reduce((s, c) => s + (c.muted ? 0 : c.unread), 0);

  // ── Actions ──

  const select = useCallback((id: string) => {
    setActiveId(id);
    setConvos(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  }, []);

  const togglePin = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConvos(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  }, []);

  const toggleMute = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConvos(prev => prev.map(c => c.id === id ? { ...c, muted: !c.muted } : c));
  }, []);

  const createDm = useCallback((userId: string) => {
    setConvos(prev => {
      const existing = prev.find(c => c.type === "dm" && c.userId === userId);
      if (existing) {
        setActiveId(existing.id);
        setShowNewDm(false);
        setShowNew(false);
        return prev.map(c => c.id === existing.id ? { ...c, unread: 0 } : c);
      }
      const user = getUser(userId);
      const nc: Conversation = {
        id: genId(), type: "dm", name: user.name, userId, unread: 0,
        pinned: false, muted: false, priority: false, typing: [], threads: 0,
        lastMsg: { user: "u1", text: "New conversation", time: "now", timeSort: 9999 },
      };
      setActiveId(nc.id);
      setShowNewDm(false);
      setShowNew(false);
      return [nc, ...prev];
    });
  }, []);

  const sendMessage = useCallback(() => {
    if (!draft.trim() || !activeId) return;
    const newMsg: Message = { id: genId(), user: "u1", text: draft.trim(), time: "now" };
    SEED_MESSAGES[activeId] = [...(SEED_MESSAGES[activeId] || []), newMsg];
    setConvos(prev => prev.map(c =>
      c.id === activeId ? { ...c, lastMsg: { user: "u1", text: draft.trim(), time: "now", timeSort: 9999 }, unread: 0 } : c
    ));
    setDraft("");
  }, [draft, activeId]);

  // ── Filtering & grouping ──

  const { groups, flatList } = useMemo(() => {
    let list = convos;
    if (search) list = list.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.workspace?.toLowerCase().includes(search.toLowerCase())
    );
    if (filter === "unread") list = list.filter(c => c.unread > 0);
    if (filter === "pinned") list = list.filter(c => c.pinned);

    const pinned = list.filter(c => c.pinned);
    const unpinned = list.filter(c => !c.pinned);
    const today = unpinned.filter(c => c.lastMsg.timeSort > 0).sort((a, b) => b.lastMsg.timeSort - a.lastMsg.timeSort);
    const yesterday = unpinned.filter(c => c.lastMsg.timeSort === -1);
    const older = unpinned.filter(c => c.lastMsg.timeSort < -1);

    const g: { label: string; items: Conversation[] }[] = [];
    if (pinned.length) g.push({ label: "pinned", items: pinned });
    if (today.length) g.push({ label: "today", items: today });
    if (yesterday.length) g.push({ label: "yesterday", items: yesterday });
    if (older.length) g.push({ label: "older", items: older });

    return { groups: g, flatList: g.flatMap(gr => gr.items) };
  }, [convos, search, filter]);

  // Reset kbIndex on filter/search change
  useEffect(() => {
    setKbIndex(-1);
  }, [search, filter]);

  // ── Keyboard nav ──

  useEffect(() => {
    if (activeId) return; // Only in list view
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setKbIndex(i => Math.min(i + 1, flatList.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setKbIndex(i => Math.max(i - 1, 0)); }
      else if (e.key === "Enter" && kbIndex >= 0 && flatList[kbIndex]) { select(flatList[kbIndex].id); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [kbIndex, flatList, select, activeId]);

  // ⌘F to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f" && open && !activeId) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, activeId]);

  // Outside click to close menus
  useEffect(() => {
    if (!showNew && !showNewDm) return;
    const handler = (e: MouseEvent) => {
      if (newMenuRef.current && !newMenuRef.current.contains(e.target as Node)) {
        setShowNew(false);
        setShowNewDm(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNew, showNewDm]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId]);

  // Focus composer on chat open
  useEffect(() => {
    if (activeId) inputRef.current?.focus();
  }, [activeId]);

  if (!open) return null;

  // ── Chat view ──
  if (activeId && active) {
    const dmUser = active.type === "dm" ? getUser(active.userId || "") : null;
    const msgs = SEED_MESSAGES[active.id] || [];

    return (
      <div className={styles.panel}>
        <div className={styles.chatHead}>
          <button className={styles.iconBtn} onClick={() => setActiveId(null)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 3L4 7l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className={styles.chatHeadIcon} style={{
            background: active.type === "team" ? "var(--ink-900)" : active.type === "dm" ? dmUser?.color : "var(--warm-200)",
            color: active.type === "team" ? "var(--ember-light)" : active.type === "dm" ? "#fff" : "var(--ink-600)",
            fontSize: active.type === "project" ? 10 : 12,
          }}>
            {active.type === "team" ? (
              <svg width="14" height="14" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="1.5" /><path d="M14 8v14M8 11.5l6 3.5 6-3.5" stroke="currentColor" strokeWidth="1" /></svg>
            ) : active.type === "project" ? "#" : dmUser?.avatar}
          </div>
          <div className={styles.chatHeadInfo}>
            <span className={styles.chatHeadName}>{active.name}</span>
            <span className={styles.chatHeadMeta}>
              {active.type === "team" && `${TEAM.filter(u => u.online).length} online · ${TEAM.length} members`}
              {active.type === "project" && active.workspace}
              {active.type === "dm" && (dmUser?.online ? "Online" : "Offline")}
            </span>
          </div>
          <div className={styles.chatHeadActions}>
            <button className={styles.iconBtn} title="Search">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.1" /><path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
            </button>
          </div>
          <button className={styles.iconBtn} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className={styles.messages}>
          {msgs.map(msg => {
            const user = getUser(msg.user);
            const isSelf = msg.user === "u1";
            return (
              <div key={msg.id} className={`${styles.msg} ${isSelf ? styles.msgSelf : ""}`}>
                <div className={styles.msgAvatar} style={{ background: user.color }}>{user.avatar}</div>
                <div className={styles.msgBody}>
                  <div className={styles.msgHeader}>
                    <span className={styles.msgName}>{isSelf ? "You" : user.name}</span>
                    <span className={styles.msgTime}>{msg.time}</span>
                  </div>
                  <p className={styles.msgText}>{msg.text}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.composer}>
          <div className={styles.composerWrap}>
            <textarea
              ref={inputRef}
              className={styles.composerInput}
              placeholder={`Message ${active.name}...`}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              rows={1}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            />
            <div className={styles.composerActions}>
              <button className={styles.composerAttach} title="Attach file">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7.5 3.5v6a2 2 0 01-4 0v-7a3 3 0 016 0v7.5a1 1 0 01-2 0V4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
              </button>
              <button className={styles.composerSend} onClick={sendMessage} disabled={!draft.trim()}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 11V3M4 5.5L7 2.5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>
          <div className={styles.composerHint}>
            <kbd className={styles.kbd}>⏎</kbd> send · <kbd className={styles.kbd}>⇧⏎</kbd> new line
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──

  let globalIdx = -1;

  const renderConvo = (c: Conversation) => {
    globalIdx++;
    const idx = globalIdx;
    const isActive = activeId === c.id;
    const isKb = kbIndex === idx;
    const isHovered = hovered === c.id;
    const dmUser = c.type === "dm" ? getUser(c.userId || "") : null;
    const typingUsers = c.typing.map(id => getUser(id));

    return (
      <div
        key={c.id}
        className={`${styles.conv} ${isActive ? styles.convActive : ""} ${isKb ? styles.convKb : ""} ${c.muted ? styles.convMuted : ""}`}
        onClick={() => select(c.id)}
        onMouseEnter={() => setHovered(c.id)}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Icon */}
        <div className={styles.convIconWrap}>
          {c.type === "team" ? (
            <div className={`${styles.convIcon} ${styles.teamIcon}`}>
              <svg width="16" height="16" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="1.8" /><path d="M14 8v14M8 11.5l6 3.5 6-3.5" stroke="currentColor" strokeWidth="1.2" /></svg>
            </div>
          ) : c.type === "project" ? (
            <div className={`${styles.convIcon} ${styles.projIcon}`} style={{ borderColor: (c.wsColor || "var(--ink-400)") + "40" }}>
              <span style={{ color: c.wsColor || "var(--ink-400)" }}>#</span>
            </div>
          ) : (
            <div className={`${styles.convIcon} ${styles.dmIcon}`} style={{ background: dmUser?.color }}>
              {dmUser?.avatar}
              <span className={styles.dmPresence} style={{ background: dmUser?.online ? "#5a9a3c" : "var(--warm-300)" }} />
            </div>
          )}
          {c.priority && <span className={styles.convPriority}>!</span>}
        </div>

        {/* Content */}
        <div className={styles.convBody}>
          <div className={styles.convTopRow}>
            <span className={styles.convName}>{c.name}</span>
            <span className={styles.convTime}>{c.lastMsg.time}</span>
          </div>

          {c.type === "project" && c.workspace && (
            <div className={styles.convWorkspace}>{c.workspace}</div>
          )}

          {typingUsers.length > 0 ? (
            <div className={styles.convTyping}>
              <span className={styles.typingDots}><span /><span /><span /></span>
              {typingUsers.map(u => u.name.split(" ")[0]).join(", ")} typing...
            </div>
          ) : (
            <div className={styles.convPreview}>{c.lastMsg.text}</div>
          )}

          {/* Meta row */}
          <div className={styles.convBottomRow}>
            {c.type === "team" && c.participants && (
              <div className={styles.convAvatars}>
                {c.participants.slice(0, 3).map(pId => {
                  const u = getUser(pId);
                  return <div key={pId} className={styles.convMiniAv} style={{ background: u.color }}>{u.avatar}</div>;
                })}
                {c.participants.length > 3 && <span className={styles.convAvMore}>+{c.participants.length - 3}</span>}
              </div>
            )}

            {c.threads > 0 && (
              <span className={styles.convThreads}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 3.5h5l2 2v-4a1 1 0 00-1-1h-5a1 1 0 00-1 1v4l1.5-1.5z" stroke="currentColor" strokeWidth="0.9" /><path d="M3.5 5.5v1a1 1 0 001 1h3l1.5 1.5v-4a1 1 0 00-1-1" stroke="currentColor" strokeWidth="0.9" /></svg>
                {c.threads}
              </span>
            )}

            {c.attachment && (
              <span className={styles.convAttach}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5.5 2.5v4.5a1.5 1.5 0 01-3 0V3a2 2 0 014 0v4.5a.5.5 0 01-1 0V3.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" /></svg>
                {c.attachment.name}
              </span>
            )}

            {c.reactions && Object.keys(c.reactions).length > 0 && (
              <div className={styles.convReactions}>
                {Object.entries(c.reactions).map(([emoji, count]) => (
                  <span key={emoji} className={styles.convReaction}>{emoji} {count}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className={styles.convRight}>
          {c.unread > 0 && !c.muted && <span className={styles.convUnread}>{c.unread}</span>}
          {c.muted && (
            <span className={styles.convMutedIcon}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><path d="M9.5 5V3.5a3.5 3.5 0 00-6.3-2.1M2.5 4v1a3.5 3.5 0 005.7 2.7M6 9v1.5M4 10.5h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
            </span>
          )}

          {isHovered && (
            <div className={styles.convActions}>
              <button className={`${styles.convAct} ${c.pinned ? styles.convActOn : ""}`} title={c.pinned ? "Unpin" : "Pin"} onClick={e => togglePin(c.id, e)}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M4 8L2 10M7 1.5l2 2-1.5 2-.5-.5L4 8l-1.5-1.5L5.5 3.5 5 3z" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill={c.pinned ? "currentColor" : "none"} /></svg>
              </button>
              <button className={styles.convAct} title={c.muted ? "Unmute" : "Mute"} onClick={e => toggleMute(c.id, e)}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  {c.muted
                    ? <><path d="M0.5 0.5l9 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /><path d="M8 4V3a3 3 0 00-5.4-1.8M2 3.5v.5a3 3 0 004.8 2.4M5 7.5v1M3.5 8.5h3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" /></>
                    : <><path d="M5 1.5a2.5 2.5 0 012.5 2.5v1a2.5 2.5 0 01-5 0V4A2.5 2.5 0 015 1.5zM5 7v1.5M3.5 8.5h3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" /></>
                  }
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.head}>
        <div className={styles.titleRow}>
          <span className={styles.title}>Messages</span>
          {totalUnread > 0 && <span className={styles.unreadBadge}>{totalUnread}</span>}
        </div>
        <div className={styles.headActions}>
          <div style={{ position: "relative" }} ref={newMenuRef}>
            <button className={styles.iconBtn} onClick={() => { setShowNew(p => !p); setShowNewDm(false); }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            {showNew && !showNewDm && (
              <div className={styles.newMenu}>
                <div className={styles.newMenuItem} onClick={() => setShowNew(false)}>
                  <span className={styles.newMenuIcon}>#</span> Project conversation
                </div>
                <div className={styles.newMenuItem} onClick={() => setShowNewDm(true)}>
                  <span className={styles.newMenuIcon}>@</span> Direct message
                </div>
              </div>
            )}
            {showNewDm && (
              <div className={styles.dmPicker}>
                <div className={styles.dmPickerLabel}>send message to</div>
                {TEAM.filter(u => u.id !== "u1").map(u => (
                  <div key={u.id} className={styles.dmUser} onClick={() => createDm(u.id)}>
                    <div className={styles.dmUserAv} style={{ background: u.color }}>{u.avatar}</div>
                    <span className={styles.dmUserName}>{u.name}</span>
                    <div className={styles.dmUserDot} style={{ background: u.online ? "#5a9a3c" : "var(--warm-300)" }} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className={styles.iconBtn} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <button className={`${styles.filter} ${filter === "all" ? styles.filterOn : ""}`} onClick={() => setFilter("all")}>
          All<span className={styles.filterCount}>{convos.length}</span>
        </button>
        <button className={`${styles.filter} ${filter === "unread" ? styles.filterOn : ""}`} onClick={() => setFilter("unread")}>
          Unread<span className={styles.filterCount}>{convos.filter(c => c.unread > 0).length}</span>
        </button>
        <button className={`${styles.filter} ${filter === "pinned" ? styles.filterOn : ""}`} onClick={() => setFilter("pinned")}>
          Pinned<span className={styles.filterCount}>{convos.filter(c => c.pinned).length}</span>
        </button>
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" /><path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
        <input ref={searchRef} className={styles.search} placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)} />
        <span className={styles.searchShortcut}>⌘F</span>
      </div>

      {/* List */}
      <div className={styles.scroll}>
        {groups.length > 0 ? (
          groups.map(group => (
            <div key={group.label}>
              <div className={styles.groupLabel}>{group.label}</div>
              {group.items.map(c => renderConvo(c))}
            </div>
          ))
        ) : convos.length === 0 ? (
          /* Empty state — no conversations at all */
          <div className={styles.emptyState}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M26 18c0 1.2-.8 2.4-2 2.4H10l-5.6 5.6V6.4C4.4 5.2 5.2 4 6.4 4h17.2C24.8 4 26 5.2 26 6.4V18z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
            <div className={styles.emptyTitle}>No conversations yet</div>
            <div className={styles.emptySub}>Start a project conversation or send a direct message to a team member</div>
            <button className={styles.emptyAction} onClick={() => setShowNew(true)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              New conversation
            </button>
          </div>
        ) : (
          /* Empty state — no results */
          <div className={styles.emptyState}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M26 18c0 1.2-.8 2.4-2 2.4H10l-5.6 5.6V6.4C4.4 5.2 5.2 4 6.4 4h17.2C24.8 4 26 5.2 26 6.4V18z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
            <div className={styles.emptyTitle}>No conversations found</div>
            <div className={styles.emptySub}>Try a different search or filter</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.footerLink}>
          Open full view
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 7l4-4M4 3h3v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className={styles.footerCount}>{convos.length} conversations</span>
          <span className={styles.footerKbd}>↑↓</span>
        </div>
      </div>
    </div>
  );
}
