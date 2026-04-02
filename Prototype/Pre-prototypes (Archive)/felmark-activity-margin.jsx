import { useState, useEffect, useRef } from "react";

const TEAM = [
  { id: "u1", name: "You", short: "You", avatar: "A", color: "#b07d4f", online: true },
  { id: "u2", name: "Jamie Park", short: "Jamie", avatar: "J", color: "#7c8594", online: true },
  { id: "u3", name: "Sarah Chen", short: "Sarah", avatar: "S", color: "#8a7e63", online: false },
];

const BLOCKS = [
  { id: "b1", type: "h1", content: "Brand Guidelines v2", activity: null },
  { id: "b2", type: "callout", content: "Client: Meridian Studio — Due Apr 3 — Budget: $2,400" },
  { id: "b3", type: "divider" },
  { id: "b4", type: "h2", content: "Introduction" },
  { id: "b5", type: "p", content: "Hi Sarah — thanks for reaching out about the Brand Guidelines project. Based on our conversation, here's what I'm proposing for Meridian Studio's visual identity system.",
    activity: { editedBy: "u1", editedAt: "2h ago", edits: 3 } },
  { id: "b6", type: "p", content: "This document covers everything from logo usage to typography to social media templates. Each section builds on the last, so the final deliverable is a cohesive system.",
    activity: { editedBy: "u1", editedAt: "2h ago", edits: 1 } },
  { id: "b7", type: "divider" },
  { id: "b8", type: "h2", content: "Scope of Work",
    activity: { comment: { user: "u3", text: "Can we make the logo section more specific? I want exact minimum sizes.", time: "2m ago", unread: true } } },
  { id: "b9", type: "todo", content: "Primary & secondary logo usage rules", checked: true,
    activity: { editedBy: "u3", editedAt: "Yesterday", note: "Sarah reviewed" } },
  { id: "b10", type: "todo", content: "Color palette with hex/RGB/CMYK values", checked: true,
    activity: { editedBy: "u1", editedAt: "3h ago" } },
  { id: "b11", type: "todo", content: "Typography scale & font pairings", checked: false,
    activity: { editedBy: "u2", editedAt: "15m ago", typing: true } },
  { id: "b12", type: "todo", content: "Imagery & photography direction", checked: false },
  { id: "b13", type: "todo", content: "Social media templates (IG, LinkedIn)", checked: false },
  { id: "b14", type: "divider" },
  { id: "b15", type: "h2", content: "Typography",
    activity: { editedBy: "u2", editedAt: "15m ago", edits: 8, hot: true } },
  { id: "b16", type: "p", content: "Using Outfit Variable — a single file that supports the full weight range from 300 to 700. This gives us maximum flexibility for both web and print.",
    activity: { editedBy: "u2", editedAt: "15m ago", edits: 4 } },
  { id: "b17", type: "h3", content: "Font Scale" },
  { id: "b18", type: "p", content: "The type scale follows a modular progression: 12 / 14 / 16 / 20 / 24 / 32 / 40. Body text sits at 16px with a line height of 1.5.",
    activity: { editedBy: "u2", editedAt: "12m ago", edits: 2, comment: { user: "u2", text: "I'd suggest adding a 'don't' section with misuse examples.", time: "15m ago" } } },
  { id: "b19", type: "code", content: "--font-body: 'Outfit', sans-serif;\n--font-heading: 'Cormorant Garamond', serif;\n--font-mono: 'JetBrains Mono', monospace;",
    activity: { editedBy: "u2", editedAt: "10m ago", edits: 1, isNew: true } },
  { id: "b20", type: "divider" },
  { id: "b21", type: "h2", content: "Color Palette" },
  { id: "b22", type: "p", content: "The palette draws from warm earth tones — parchment, stone, and ember. It should feel like old-world craft meeting modern precision.",
    activity: { editedBy: "u1", editedAt: "Yesterday", edits: 2 } },
  { id: "b23", type: "divider" },
  { id: "b24", type: "h2", content: "Notes" },
  { id: "b25", type: "p", content: "", placeholder: "Type '/' for commands, ⌘K for palette" },
];

export default function ActivityMargin() {
  const [blocks] = useState(BLOCKS);
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [expandedComment, setExpandedComment] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState("all"); // all | comments | edits | active
  const [showTimeline, setShowTimeline] = useState(false);

  const getUser = (id) => TEAM.find(u => u.id === id) || TEAM[0];

  // Who's currently active
  const activeUsers = TEAM.filter(u => u.online && u.id !== "u1");

  // Activity stats
  const totalEdits = blocks.reduce((s, b) => s + (b.activity?.edits || 0), 0);
  const comments = blocks.filter(b => b.activity?.comment).length;
  const activeBlocks = blocks.filter(b => b.activity?.editedAt?.includes("m ago") || b.activity?.typing).length;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
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

        .am-page {
          font-family: 'Outfit', sans-serif; font-size: 15px;
          color: var(--ink-700); background: var(--parchment);
          height: 100vh; display: flex; flex-direction: column;
        }

        /* ── Top bar ── */
        .am-top {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 16px; border-bottom: 1px solid var(--warm-200);
          flex-shrink: 0; z-index: 10;
        }
        .am-top-left { display: flex; align-items: center; gap: 8px; }
        .am-breadcrumb { font-family: var(--mono); font-size: 12px; color: var(--ink-400); display: flex; align-items: center; gap: 4px; }
        .am-bc-active { color: var(--ink-700); font-weight: 500; }
        .am-bc-sep { color: var(--warm-300); }
        .am-top-right { display: flex; align-items: center; gap: 8px; }

        /* Presence strip */
        .am-presence {
          display: flex; align-items: center; gap: 4px;
          padding: 4px 10px; border-radius: 5px;
          background: var(--warm-50); border: 1px solid var(--warm-100);
        }
        .am-presence-av {
          width: 22px; height: 22px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 600; color: #fff; flex-shrink: 0;
          border: 2px solid var(--parchment); margin-left: -6px;
        }
        .am-presence-av:first-child { margin-left: 0; }
        .am-presence-text { font-family: var(--mono); font-size: 10px; color: var(--ink-400); margin-left: 4px; }
        .am-presence-dot { width: 5px; height: 5px; border-radius: 50%; background: #5a9a3c; animation: presencePulse 2s ease infinite; }
        @keyframes presencePulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }

        /* ── Main layout ── */
        .am-main { flex: 1; display: flex; overflow: hidden; }

        /* ═══ EDITOR ═══ */
        .am-editor { flex: 1; overflow-y: auto; padding: 40px 60px 120px 80px; }
        .am-editor::-webkit-scrollbar { width: 5px; }
        .am-editor::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }
        .am-content { max-width: 600px; position: relative; }

        /* Block styles */
        .am-block { position: relative; display: flex; align-items: flex-start; }
        .am-block-content { flex: 1; min-width: 0; }

        .am-block-glow { position: absolute; inset: -4px -8px; border-radius: 6px; pointer-events: none; transition: background 0.15s; }

        .blk-h1 { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 600; color: var(--ink-900); letter-spacing: -0.02em; padding: 4px 0; margin-bottom: 8px; }
        .blk-h2 { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: var(--ink-900); padding: 4px 0; margin-top: 8px; }
        .blk-h3 { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 600; color: var(--ink-800); padding: 3px 0; }
        .blk-p { font-size: 15px; color: var(--ink-600); line-height: 1.75; padding: 3px 0; }
        .blk-p.empty { color: var(--warm-400); }
        .blk-callout { background: rgba(176,125,79,0.03); border: 1px solid rgba(176,125,79,0.08); border-radius: 6px; padding: 12px 16px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--ink-600); margin-bottom: 8px; }
        .blk-callout-icon { color: var(--ember); }
        .blk-todo { display: flex; align-items: flex-start; gap: 10px; padding: 4px 0; }
        .blk-cb { width: 18px; height: 18px; border-radius: 4px; border: 1.5px solid var(--warm-300); background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 3px; transition: all 0.12s; }
        .blk-cb.checked { background: var(--ember); border-color: var(--ember); }
        .blk-cb-mark { color: #fff; font-size: 11px; }
        .blk-todo-text { line-height: 1.65; color: var(--ink-600); }
        .blk-todo-text.checked { text-decoration: line-through; color: var(--ink-300); text-decoration-color: var(--warm-300); }
        .blk-divider { height: 1px; background: var(--warm-200); margin: 16px 0; }
        .blk-code { background: var(--ink-900); border-radius: 8px; padding: 14px 18px; font-family: var(--mono); font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.7; white-space: pre-wrap; margin: 8px 0; }

        /* ═══ ACTIVITY MARGIN (RIGHT) ═══ */
        .am-margin {
          width: 260px; min-width: 260px; flex-shrink: 0;
          border-left: 1px solid var(--warm-100);
          background: var(--warm-50);
          display: flex; flex-direction: column;
          overflow: hidden;
        }

        /* Margin header */
        .am-margin-head {
          padding: 12px 14px; border-bottom: 1px solid var(--warm-100);
          flex-shrink: 0;
        }
        .am-margin-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .am-margin-title { font-family: var(--mono); font-size: 10px; font-weight: 500; color: var(--ink-400); letter-spacing: 0.1em; text-transform: uppercase; }
        .am-margin-stats { display: flex; gap: 10px; font-family: var(--mono); font-size: 10px; color: var(--ink-300); }
        .am-margin-stat { display: flex; align-items: center; gap: 3px; }
        .am-margin-stat-dot { width: 5px; height: 5px; border-radius: 50%; }

        /* Filters */
        .am-margin-filters { display: flex; gap: 2px; }
        .am-mf {
          padding: 3px 8px; border-radius: 3px; font-size: 10px;
          border: none; cursor: pointer; font-family: var(--mono);
          color: var(--ink-400); background: none; transition: all 0.06s;
        }
        .am-mf:hover { background: var(--warm-100); }
        .am-mf.on { background: var(--ink-900); color: var(--parchment); }

        /* Margin scroll */
        .am-margin-scroll { flex: 1; overflow-y: auto; padding: 8px 0; }
        .am-margin-scroll::-webkit-scrollbar { width: 3px; }
        .am-margin-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }

        /* ── Activity item ── */
        .am-item {
          padding: 8px 14px; transition: background 0.06s;
          border-left: 2px solid transparent; position: relative;
        }
        .am-item:hover { background: var(--warm-100); }
        .am-item.highlighted { background: var(--ember-bg); border-left-color: var(--ember); }
        .am-item.has-comment { }

        /* Edit indicator */
        .am-edit {
          display: flex; align-items: center; gap: 8px;
        }
        .am-edit-avatar {
          width: 22px; height: 22px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .am-edit-info { flex: 1; min-width: 0; }
        .am-edit-who { font-size: 12px; font-weight: 500; color: var(--ink-600); }
        .am-edit-meta { font-family: var(--mono); font-size: 10px; color: var(--ink-300); display: flex; align-items: center; gap: 4px; }
        .am-edit-count { color: var(--ink-400); }

        /* Hot indicator (recently active) */
        .am-hot {
          font-family: var(--mono); font-size: 8px; color: var(--ember);
          background: var(--ember-bg); padding: 0 4px; border-radius: 2px;
          border: 1px solid rgba(176,125,79,0.1); letter-spacing: 0.04em;
        }

        /* New block indicator */
        .am-new {
          font-family: var(--mono); font-size: 8px; color: #5a9a3c;
          background: rgba(90,154,60,0.06); padding: 0 4px; border-radius: 2px;
          border: 1px solid rgba(90,154,60,0.1); letter-spacing: 0.04em;
        }

        /* Typing indicator */
        .am-typing {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; color: var(--ember); margin-top: 4px;
        }
        .am-typing-dots { display: flex; gap: 2px; }
        .am-typing-dots span {
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--ember); animation: typDot 1.2s ease infinite;
        }
        .am-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .am-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typDot { 0%, 60%, 100% { opacity: 0.2; } 30% { opacity: 1; } }

        /* ── Comment in margin ── */
        .am-comment {
          margin-top: 8px; padding: 10px 12px;
          background: #fff; border: 1px solid var(--warm-200);
          border-radius: 8px; cursor: pointer; transition: all 0.1s;
        }
        .am-comment:hover { border-color: var(--warm-300); box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .am-comment.expanded { border-color: var(--ember); box-shadow: 0 2px 12px rgba(176,125,79,0.06); }
        .am-comment.unread { border-left: 3px solid var(--ember); }

        .am-comment-head { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
        .am-comment-av {
          width: 18px; height: 18px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          font-size: 8px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .am-comment-author { font-size: 12px; font-weight: 500; color: var(--ink-700); }
        .am-comment-time { font-family: var(--mono); font-size: 9px; color: var(--ink-300); margin-left: auto; }
        .am-comment-text {
          font-size: 13px; color: var(--ink-600); line-height: 1.5;
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: 14px;
        }

        .am-comment-reply {
          display: flex; gap: 6px; margin-top: 8px; padding-top: 8px;
          border-top: 1px solid var(--warm-100);
        }
        .am-comment-reply input {
          flex: 1; padding: 6px 10px; border: 1px solid var(--warm-200);
          border-radius: 5px; font-family: inherit; font-size: 12px;
          color: var(--ink-700); outline: none;
        }
        .am-comment-reply input:focus { border-color: var(--ember); }
        .am-comment-reply input::placeholder { color: var(--warm-400); }
        .am-comment-reply-btn {
          padding: 6px 12px; border-radius: 5px; border: none;
          background: var(--ember); color: #fff; font-size: 11px;
          cursor: pointer; font-family: inherit;
        }

        /* ── Connector lines ── */
        .am-connector {
          position: absolute; left: -1px; top: 50%;
          width: 20px; height: 1px; background: var(--warm-200);
          pointer-events: none;
        }
        .am-item.highlighted .am-connector { background: rgba(176,125,79,0.2); }

        /* ── Section label ── */
        .am-section-label {
          font-family: var(--mono); font-size: 9px; color: var(--ink-300);
          padding: 10px 14px 4px; letter-spacing: 0.06em;
        }

        /* ── Note indicator ── */
        .am-note {
          font-family: var(--mono); font-size: 10px; color: var(--ink-300);
          font-style: italic; margin-top: 2px;
        }

        /* ── Empty state ── */
        .am-empty {
          padding: 8px 14px; font-size: 11px; color: var(--ink-300);
          font-style: italic;
        }

        /* ── Timeline mini ── */
        .am-timeline {
          padding: 12px 14px; border-top: 1px solid var(--warm-100);
          flex-shrink: 0;
        }
        .am-timeline-label { font-family: var(--mono); font-size: 9px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
        .am-timeline-row {
          display: flex; align-items: center; gap: 8px;
          padding: 3px 0; font-size: 11px;
        }
        .am-timeline-time { font-family: var(--mono); font-size: 10px; color: var(--ink-300); width: 44px; text-align: right; flex-shrink: 0; }
        .am-timeline-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .am-timeline-text { color: var(--ink-500); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .am-timeline-row.now .am-timeline-time { color: var(--ember); font-weight: 500; }
        .am-timeline-row.now .am-timeline-dot { background: var(--ember); box-shadow: 0 0 0 2px rgba(176,125,79,0.12); }

        /* ── Footer ── */
        .am-footer {
          padding: 5px 16px; border-top: 1px solid var(--warm-100);
          font-family: var(--mono); font-size: 10px; color: var(--ink-300);
          display: flex; justify-content: space-between; flex-shrink: 0;
        }
      `}</style>

      <div className="am-page">
        {/* ── Top bar ── */}
        <div className="am-top">
          <div className="am-top-left">
            <div className="am-breadcrumb">
              <span>Meridian Studio</span>
              <span className="am-bc-sep">/</span>
              <span className="am-bc-active">Brand Guidelines v2</span>
            </div>
          </div>
          <div className="am-top-right">
            <div className="am-presence">
              {TEAM.filter(u => u.online).map(u => (
                <div key={u.id} className="am-presence-av" style={{ background: u.color }}>{u.avatar}</div>
              ))}
              <span className="am-presence-dot" />
              <span className="am-presence-text">{TEAM.filter(u => u.online).length} online</span>
            </div>
          </div>
        </div>

        <div className="am-main">
          {/* ═══ EDITOR ═══ */}
          <div className="am-editor">
            <div className="am-content">
              {blocks.map((block) => {
                const isHovered = hoveredBlock === block.id;
                const hasActivity = !!block.activity;
                const user = block.activity?.editedBy ? getUser(block.activity.editedBy) : null;

                return (
                  <div key={block.id} className="am-block"
                    onMouseEnter={() => setHoveredBlock(block.id)}
                    onMouseLeave={() => setHoveredBlock(null)}>

                    {/* Glow for active blocks */}
                    {hasActivity && (
                      <div className="am-block-glow" style={{
                        background: isHovered
                          ? `${user?.color || "var(--ember)"}08`
                          : block.activity?.typing ? "rgba(176,125,79,0.02)" : "transparent"
                      }} />
                    )}

                    {/* Left avatar (appears on hover for edited blocks) */}
                    {hasActivity && user && isHovered && block.type !== "divider" && (
                      <div style={{
                        position: "absolute", left: -40, top: block.type === "h2" ? 8 : 4,
                        width: 26, height: 26, borderRadius: 6,
                        background: user.color, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 10, fontWeight: 600,
                        color: "#fff", animation: "fadeIn 0.15s ease",
                        boxShadow: `0 0 0 2px var(--parchment), 0 0 0 3px ${user.color}30`,
                      }}>
                        {user.avatar}
                      </div>
                    )}

                    <div className="am-block-content">
                      {block.type === "h1" && <div className="blk-h1">{block.content}</div>}
                      {block.type === "h2" && <h2 className="blk-h2">{block.content}</h2>}
                      {block.type === "h3" && <h3 className="blk-h3">{block.content}</h3>}
                      {block.type === "p" && <p className={`blk-p${!block.content ? " empty" : ""}`}>{block.content || block.placeholder || "Type something..."}</p>}
                      {block.type === "callout" && <div className="blk-callout"><span className="blk-callout-icon">◆</span>{block.content}</div>}
                      {block.type === "todo" && (
                        <div className="blk-todo">
                          <div className={`blk-cb${block.checked ? " checked" : ""}`}>
                            {block.checked && <span className="blk-cb-mark">✓</span>}
                          </div>
                          <span className={`blk-todo-text${block.checked ? " checked" : ""}`}>{block.content}</span>
                        </div>
                      )}
                      {block.type === "divider" && <div className="blk-divider" />}
                      {block.type === "code" && <div className="blk-code">{block.content}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══ ACTIVITY MARGIN ═══ */}
          <div className="am-margin">
            <div className="am-margin-head">
              <div className="am-margin-title-row">
                <span className="am-margin-title">activity</span>
                <div className="am-margin-stats">
                  <span className="am-margin-stat"><span className="am-margin-stat-dot" style={{ background: "var(--ember)" }} />{activeBlocks} live</span>
                  <span className="am-margin-stat"><span className="am-margin-stat-dot" style={{ background: "#5b7fa4" }} />{comments} comments</span>
                </div>
              </div>
              <div className="am-margin-filters">
                <button className={`am-mf${filter === "all" ? " on" : ""}`} onClick={() => setFilter("all")}>All</button>
                <button className={`am-mf${filter === "comments" ? " on" : ""}`} onClick={() => setFilter("comments")}>Comments</button>
                <button className={`am-mf${filter === "edits" ? " on" : ""}`} onClick={() => setFilter("edits")}>Edits</button>
                <button className={`am-mf${filter === "active" ? " on" : ""}`} onClick={() => setFilter("active")}>Live</button>
              </div>
            </div>

            <div className="am-margin-scroll">
              {blocks.map(block => {
                if (!block.activity) return null;
                const a = block.activity;
                const user = a.editedBy ? getUser(a.editedBy) : null;
                const commentUser = a.comment ? getUser(a.comment.user) : null;
                const isHighlighted = hoveredBlock === block.id;

                // Filter logic
                if (filter === "comments" && !a.comment) return null;
                if (filter === "edits" && !a.editedBy) return null;
                if (filter === "active" && !a.typing && !a.hot) return null;

                return (
                  <div key={block.id}
                    className={`am-item${isHighlighted ? " highlighted" : ""}${a.comment ? " has-comment" : ""}`}
                    onMouseEnter={() => setHoveredBlock(block.id)}
                    onMouseLeave={() => setHoveredBlock(null)}>

                    <div className="am-connector" />

                    {/* Edit indicator */}
                    {user && (
                      <div className="am-edit">
                        <div className="am-edit-avatar" style={{ background: user.color }}>{user.avatar}</div>
                        <div className="am-edit-info">
                          <span className="am-edit-who">{user.short}</span>
                          <div className="am-edit-meta">
                            <span>{a.editedAt}</span>
                            {a.edits && <span className="am-edit-count">· {a.edits} edits</span>}
                            {a.hot && <span className="am-hot">ACTIVE</span>}
                            {a.isNew && <span className="am-new">NEW</span>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Typing indicator */}
                    {a.typing && (
                      <div className="am-typing">
                        <span className="am-typing-dots"><span /><span /><span /></span>
                        {user?.short} is typing...
                      </div>
                    )}

                    {/* Note */}
                    {a.note && <div className="am-note">{a.note}</div>}

                    {/* Comment */}
                    {a.comment && commentUser && (
                      <div className={`am-comment${expandedComment === block.id ? " expanded" : ""}${a.comment.unread ? " unread" : ""}`}
                        onClick={() => setExpandedComment(expandedComment === block.id ? null : block.id)}>
                        <div className="am-comment-head">
                          <div className="am-comment-av" style={{ background: commentUser.color }}>{commentUser.avatar}</div>
                          <span className="am-comment-author">{commentUser.name}</span>
                          <span className="am-comment-time">{a.comment.time}</span>
                        </div>
                        <div className="am-comment-text">{a.comment.text}</div>

                        {expandedComment === block.id && (
                          <div className="am-comment-reply" onClick={e => e.stopPropagation()}>
                            <input placeholder="Reply..." value={replyText}
                              onChange={e => setReplyText(e.target.value)} />
                            <button className="am-comment-reply-btn">Reply</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {filter !== "all" && blocks.filter(b => {
                if (!b.activity) return false;
                if (filter === "comments") return !!b.activity.comment;
                if (filter === "edits") return !!b.activity.editedBy;
                if (filter === "active") return b.activity.typing || b.activity.hot;
                return false;
              }).length === 0 && (
                <div className="am-empty">No {filter} activity on this document</div>
              )}
            </div>

            {/* Timeline mini */}
            <div className="am-timeline">
              <div className="am-timeline-label">session timeline</div>
              {[
                { time: "9:20", text: "You started editing", color: "#b07d4f" },
                { time: "9:35", text: "Jamie joined", color: "#7c8594" },
                { time: "10:15", text: "Jamie edited Typography", color: "#7c8594", now: false },
                { time: "11:30", text: "Sarah commented on Scope", color: "#8a7e63" },
                { time: "now", text: "Jamie typing in Typography", color: "#7c8594", now: true },
              ].map((t, i) => (
                <div key={i} className={`am-timeline-row${t.now ? " now" : ""}`}>
                  <span className="am-timeline-time">{t.time}</span>
                  <span className="am-timeline-dot" style={{ background: t.now ? undefined : t.color }} />
                  <span className="am-timeline-text">{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="am-footer">
          <span>{totalEdits} edits · {comments} comments · {activeBlocks} active blocks</span>
          <span>● saved · 2 collaborators</span>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }`}</style>
    </>
  );
}
