import { useState, useRef, useEffect } from "react";

const uid = () => Math.random().toString(36).slice(2, 10);

const WORKSPACES = [
  { id: "w1", client: "Meridian Studio", avatar: "M", color: "#7c8594" },
  { id: "w2", client: "Nora Kim", avatar: "N", color: "#a08472" },
  { id: "w3", client: "Bolt Fitness", avatar: "B", color: "#8a7e63" },
  { id: "w4", client: "Personal", avatar: "✦", color: "#5c5c53" },
];

const INITIAL_NOTES = [
  { id: uid(), text: "Check competitor pricing on Dribbble — Meridian wants to undercut by 15%", workspace: "w1", time: "2m ago", url: "dribbble.com/shots/brand-guide" },
  { id: uid(), text: "This color palette generator would be perfect for the guidelines doc", workspace: "w1", time: "18m ago", url: "coolors.co/palette/264653" },
  { id: uid(), text: "Nora's course structure — reference this webflow template layout", workspace: "w2", time: "1h ago", url: "webflow.com/templates/coaching" },
  { id: uid(), text: "Bolt Fitness onboarding flow from Loom — need to annotate this", workspace: "w3", time: "3h ago", url: "loom.com/share/abc123" },
];

export default function FelmarkExtension() {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [draft, setDraft] = useState("");
  const [activeWs, setActiveWs] = useState("w1");
  const [showWsPicker, setShowWsPicker] = useState(false);
  const [view, setView] = useState("notes"); // notes | all
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  const currentWs = WORKSPACES.find(w => w.id === activeWs);
  const filteredNotes = view === "notes"
    ? notes.filter(n => n.workspace === activeWs)
    : notes;

  const saveNote = () => {
    if (!draft.trim()) return;
    setSaving(true);
    const newNote = {
      id: uid(),
      text: draft.trim(),
      workspace: activeWs,
      time: "now",
      url: "current page",
    };
    setTimeout(() => {
      setNotes(prev => [newNote, ...prev]);
      setDraft("");
      setSaving(false);
    }, 300);
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveNote();
    }
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --parchment: #faf9f7;
          --warm-50: #f7f6f3;
          --warm-100: #f0eee9;
          --warm-200: #e5e2db;
          --warm-300: #d5d1c8;
          --warm-400: #b8b3a8;
          --ink-900: #2c2a25;
          --ink-800: #3d3a33;
          --ink-700: #4f4c44;
          --ink-600: #65625a;
          --ink-500: #7d7a72;
          --ink-400: #9b988f;
          --ink-300: #b5b2a9;
          --ember: #b07d4f;
          --ember-light: #c89360;
          --ember-bg: rgba(176,125,79,0.08);
          --rail-bg: #353330;
        }

        .ext {
          width: 380px;
          height: 560px;
          font-family: 'Outfit', -apple-system, sans-serif;
          font-size: 14px;
          color: var(--ink-700);
          background: var(--parchment);
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06);
          position: relative;
        }

        /* ── Header ── */
        .ext-head {
          padding: 14px 16px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--warm-200);
          background: var(--warm-50);
          flex-shrink: 0;
        }

        .ext-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ext-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--ink-900);
          letter-spacing: 0.03em;
        }

        .ext-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .ext-btn {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          border: none;
          background: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink-400);
          transition: all 0.1s;
        }

        .ext-btn:hover { background: var(--warm-200); color: var(--ink-700); }

        /* ── Workspace selector ── */
        .ws-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-bottom: 1px solid var(--warm-100);
          flex-shrink: 0;
        }

        .ws-selector {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 5px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.1s;
          position: relative;
          border: 1px solid var(--warm-200);
          background: #fff;
        }

        .ws-selector:hover { border-color: var(--warm-300); }

        .ws-av {
          width: 18px;
          height: 18px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 600;
          color: #fff;
          flex-shrink: 0;
        }

        .ws-sel-name {
          font-size: 12.5px;
          font-weight: 500;
          color: var(--ink-800);
        }

        .ws-sel-arrow {
          font-size: 8px;
          color: var(--ink-400);
          margin-left: 2px;
        }

        .ws-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          width: 200px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05);
          padding: 4px;
          z-index: 50;
        }

        .ws-drop-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.06s;
        }

        .ws-drop-item:hover { background: var(--warm-100); }
        .ws-drop-item.on { background: var(--ember-bg); }

        .ws-drop-name {
          font-size: 13px;
          color: var(--ink-700);
        }

        .ws-drop-item.on .ws-drop-name { color: var(--ember); font-weight: 500; }

        .view-toggle {
          margin-left: auto;
          display: flex;
          border: 1px solid var(--warm-200);
          border-radius: 5px;
          overflow: hidden;
        }

        .vt-btn {
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          font-family: inherit;
          color: var(--ink-400);
          background: #fff;
          transition: all 0.1s;
        }

        .vt-btn.on { background: var(--ink-900); color: var(--warm-50); }
        .vt-btn:first-child { border-right: 1px solid var(--warm-200); }

        /* ── Input area ── */
        .input-area {
          padding: 12px 16px;
          border-bottom: 1px solid var(--warm-100);
          flex-shrink: 0;
        }

        .input-wrap {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          background: #fff;
          border: 1px solid var(--warm-200);
          border-radius: 8px;
          padding: 10px 12px;
          transition: border-color 0.15s;
        }

        .input-wrap:focus-within {
          border-color: var(--ember);
          box-shadow: 0 0 0 3px rgba(176,125,79,0.06);
        }

        .input-wrap textarea {
          flex: 1;
          border: none;
          outline: none;
          resize: none;
          font-family: inherit;
          font-size: 13.5px;
          color: var(--ink-800);
          background: transparent;
          line-height: 1.5;
          min-height: 20px;
          max-height: 80px;
        }

        .input-wrap textarea::placeholder { color: var(--warm-400); }

        .send-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s;
          background: var(--ember);
          color: #fff;
        }

        .send-btn:hover { background: var(--ember-light); }
        .send-btn:disabled { background: var(--warm-200); color: var(--warm-400); cursor: default; }

        .input-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          padding: 0 2px;
        }

        .input-meta-item {
          font-size: 10.5px;
          color: var(--ink-400);
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .input-meta-item svg { opacity: 0.5; }

        /* ── Notes list ── */
        .notes-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px 8px;
        }

        .notes-list::-webkit-scrollbar { width: 3px; }
        .notes-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }

        .note-card {
          padding: 10px 12px;
          border-radius: 8px;
          margin-bottom: 4px;
          transition: background 0.08s;
          cursor: default;
          position: relative;
          group: true;
        }

        .note-card:hover { background: var(--warm-100); }
        .note-card:hover .note-delete { opacity: 1; }

        .note-text {
          font-size: 13.5px;
          color: var(--ink-700);
          line-height: 1.55;
          margin-bottom: 6px;
        }

        .note-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .note-ws {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10.5px;
          font-weight: 500;
          color: var(--ink-500);
        }

        .note-ws-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .note-time {
          font-size: 10.5px;
          color: var(--ink-300);
        }

        .note-url {
          font-size: 10.5px;
          color: var(--ember);
          text-decoration: none;
          opacity: 0.7;
          transition: opacity 0.1s;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 140px;
          display: inline-block;
        }

        .note-url:hover { opacity: 1; }

        .note-delete {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 22px;
          height: 22px;
          border-radius: 4px;
          border: none;
          background: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink-300);
          opacity: 0;
          transition: all 0.1s;
        }

        .note-delete:hover { background: rgba(194,75,56,0.08); color: #c24b38; }

        .note-new {
          animation: slideIn 0.25s ease;
        }

        /* ── Empty state ── */
        .empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }

        .empty-icon { color: var(--warm-300); margin-bottom: 12px; }
        .empty-title { font-size: 14px; font-weight: 500; color: var(--ink-500); margin-bottom: 4px; }
        .empty-sub { font-size: 12.5px; color: var(--ink-300); line-height: 1.5; }

        /* ── Footer ── */
        .ext-foot {
          padding: 8px 16px;
          border-top: 1px solid var(--warm-100);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          background: var(--warm-50);
        }

        .ext-foot-link {
          font-size: 11.5px;
          color: var(--ember);
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.1s;
          background: none;
          border: none;
          font-family: inherit;
        }

        .ext-foot-link:hover { color: var(--ember-light); }

        .ext-foot-count {
          font-size: 11px;
          color: var(--ink-300);
        }

        /* ── Saving indicator ── */
        .saving-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ember);
          animation: pulse 0.6s ease infinite alternate;
        }

        @keyframes pulse { from { opacity: 0.3; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

        /* ── Keyboard shortcut hint ── */
        .kbd {
          font-size: 9px;
          font-weight: 500;
          color: var(--ink-300);
          background: var(--warm-100);
          border: 1px solid var(--warm-200);
          border-radius: 3px;
          padding: 1px 4px;
          font-family: inherit;
        }
      `}</style>

      <div className="ext">
        {/* ── Header ── */}
        <div className="ext-head">
          <div className="ext-logo">
            <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="var(--ember)" strokeWidth="1.5" />
              <path d="M14 8l-6 3.5v7L14 22l6-3.5v-7L14 8z" fill="var(--ember)" opacity="0.15" />
              <path d="M14 8v14M8 11.5l6 3.5 6-3.5" stroke="var(--ember)" strokeWidth="1" />
            </svg>
            <span className="ext-logo-text">Felmark</span>
          </div>
          <div className="ext-actions">
            <button className="ext-btn" title="Capture screenshot">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/></svg>
            </button>
            <button className="ext-btn" title="Capture page link">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.5 9.5l3-3M7 10.5a2.5 2.5 0 01-3.5 0v0a2.5 2.5 0 010-3.5l1-1M9 5.5a2.5 2.5 0 013.5 0v0a2.5 2.5 0 010 3.5l-1 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </button>
            <button className="ext-btn" title="Settings">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M8 2v2M8 12v2M2 8h2M12 8h2M3.8 3.8l1.4 1.4M10.8 10.8l1.4 1.4M3.8 12.2l1.4-1.4M10.8 5.2l1.4-1.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        {/* ── Workspace bar ── */}
        <div className="ws-bar">
          <div className="ws-selector" onClick={() => setShowWsPicker(p => !p)}>
            <div className="ws-av" style={{ background: currentWs.color }}>{currentWs.avatar}</div>
            <span className="ws-sel-name">{currentWs.client}</span>
            <span className="ws-sel-arrow">▼</span>

            {showWsPicker && (
              <div className="ws-dropdown" onClick={e => e.stopPropagation()}>
                {WORKSPACES.map(ws => (
                  <div key={ws.id}
                    className={`ws-drop-item${activeWs === ws.id ? " on" : ""}`}
                    onClick={() => { setActiveWs(ws.id); setShowWsPicker(false); }}>
                    <div className="ws-av" style={{ background: ws.color }}>{ws.avatar}</div>
                    <span className="ws-drop-name">{ws.client}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="view-toggle">
            <button className={`vt-btn${view === "notes" ? " on" : ""}`} onClick={() => setView("notes")}>Workspace</button>
            <button className={`vt-btn${view === "all" ? " on" : ""}`} onClick={() => setView("all")}>All</button>
          </div>
        </div>

        {/* ── Input ── */}
        <div className="input-area">
          <div className="input-wrap">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Quick note, idea, or link..."
              rows={1}
            />
            <button className="send-btn" onClick={saveNote} disabled={!draft.trim() || saving}>
              {saving ? (
                <div className="saving-dot" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 11V3M4 5.5L7 2.5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </button>
          </div>
          <div className="input-meta">
            <span className="input-meta-item">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 7.5l2-2 1.5 1.5 2-2.5L9 7.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="1" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="0.8"/></svg>
              Page captured
            </span>
            <span className="input-meta-item">
              <kbd className="kbd">⏎</kbd> to save
            </span>
          </div>
        </div>

        {/* ── Notes ── */}
        {filteredNotes.length > 0 ? (
          <div className="notes-list">
            {filteredNotes.map((note, i) => {
              const ws = WORKSPACES.find(w => w.id === note.workspace);
              return (
                <div key={note.id} className={`note-card${note.time === "now" ? " note-new" : ""}`}>
                  <div className="note-text">{note.text}</div>
                  <div className="note-meta">
                    {view === "all" && ws && (
                      <span className="note-ws">
                        <span className="note-ws-dot" style={{ background: ws.color }} />
                        {ws.client}
                      </span>
                    )}
                    <span className="note-time">{note.time}</span>
                    {note.url && (
                      <a href="#" className="note-url" title={note.url}>
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ marginRight: 2, verticalAlign: "-1px", display: "inline" }}><path d="M4.5 7a2 2 0 01-2.8 0v0a2 2 0 010-2.8l.8-.8M5.5 3a2 2 0 012.8 0v0a2 2 0 010 2.8l-.8.8" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"/></svg>
                        {note.url}
                      </a>
                    )}
                  </div>
                  <button className="note-delete" onClick={() => deleteNote(note.id)}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty">
            <div className="empty-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="6" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M10 14h12M10 19h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div className="empty-title">No notes yet</div>
            <div className="empty-sub">Capture ideas, links, and thoughts<br />as you browse</div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="ext-foot">
          <button className="ext-foot-link">
            Open Dashboard
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 7l4-4M4 3h3v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <span className="ext-foot-count">{notes.length} notes</span>
        </div>
      </div>
    </>
  );
}
