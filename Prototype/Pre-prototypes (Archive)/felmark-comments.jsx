import { useState } from "react";

/* ═══════════════════════════════════════════
   5 COMMENT STYLES — pick your favorite
   Each is a self-contained component
   ═══════════════════════════════════════════ */

const SAMPLE_COMMENTS = [
  { id: 1, author: "Sarah Chen", avatar: "S", color: "#8a7e63", text: "Can we make the logo usage section more specific? I want exact minimum sizes.", time: "2m ago", resolved: false, highlight: "Primary & secondary logo usage rules" },
  { id: 2, author: "Jamie Park", avatar: "J", color: "#7c8594", text: "I'd suggest adding a 'don't' section with examples of incorrect usage.", time: "15m ago", resolved: false, reply: { author: "You", avatar: "A", color: "#b07d4f", text: "Good call — I'll add a misuse grid.", time: "8m ago" } },
  { id: 3, author: "You", avatar: "A", color: "#b07d4f", text: "Need to confirm hex values with the client before finalizing.", time: "1h ago", resolved: true, highlight: "Color palette with hex/RGB/CMYK" },
];

/* ─────────────────────────────────────
   STYLE 1: WHISPER
   Ultra-minimal. Thin lines. Barely there.
   ───────────────────────────────────── */
function StyleWhisper() {
  const [hoveredId, setHoveredId] = useState(null);
  return (
    <div className="s1-panel">
      {SAMPLE_COMMENTS.filter(c => !c.resolved).map(c => (
        <div key={c.id} className={`s1-comment${hoveredId === c.id ? " hovered" : ""}`}
          onMouseEnter={() => setHoveredId(c.id)} onMouseLeave={() => setHoveredId(null)}>
          <div className="s1-line" style={{ background: c.color }} />
          <div className="s1-body">
            <div className="s1-meta">
              <span className="s1-author">{c.author}</span>
              <span className="s1-time">{c.time}</span>
            </div>
            <p className="s1-text">{c.text}</p>
            {c.reply && (
              <div className="s1-reply">
                <span className="s1-reply-author">{c.reply.author}</span>
                <span className="s1-reply-text">{c.reply.text}</span>
              </div>
            )}
            {hoveredId === c.id && (
              <div className="s1-actions">
                <button className="s1-act">Reply</button>
                <button className="s1-act">Resolve</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────
   STYLE 2: STONE CARDS
   Elevated cards with subtle shadows.
   ───────────────────────────────────── */
function StyleStoneCards() {
  const [expandedId, setExpandedId] = useState(null);
  return (
    <div className="s2-panel">
      {SAMPLE_COMMENTS.filter(c => !c.resolved).map(c => (
        <div key={c.id} className={`s2-card${expandedId === c.id ? " expanded" : ""}`}
          onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
          <div className="s2-header">
            <div className="s2-avatar" style={{ background: c.color }}>{c.avatar}</div>
            <div className="s2-info">
              <span className="s2-author">{c.author}</span>
              <span className="s2-time">{c.time}</span>
            </div>
            <div className="s2-dot" />
          </div>
          <p className="s2-text">{c.text}</p>
          {c.highlight && <span className="s2-ref">"{c.highlight}"</span>}
          {expandedId === c.id && (
            <>
              {c.reply && (
                <div className="s2-reply">
                  <div className="s2-reply-av" style={{ background: c.reply.color }}>{c.reply.avatar}</div>
                  <div>
                    <span className="s2-reply-author">{c.reply.author}</span>
                    <p className="s2-reply-text">{c.reply.text}</p>
                  </div>
                </div>
              )}
              <div className="s2-input-row">
                <input className="s2-input" placeholder="Reply..." />
                <button className="s2-send">↑</button>
              </div>
              <div className="s2-actions">
                <button className="s2-act resolve">✓ Resolve</button>
                <button className="s2-act">⋯</button>
              </div>
            </>
          )}
        </div>
      ))}
      <div className="s2-resolved-count">
        {SAMPLE_COMMENTS.filter(c => c.resolved).length} resolved
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 4l2 2 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   STYLE 3: MARGIN NOTES
   Academic-style. Serif font. Footnote energy.
   ───────────────────────────────────── */
function StyleMarginNotes() {
  return (
    <div className="s3-panel">
      {SAMPLE_COMMENTS.filter(c => !c.resolved).map((c, i) => (
        <div key={c.id} className="s3-note">
          <div className="s3-num">{i + 1}</div>
          <div className="s3-body">
            <p className="s3-text">
              <span className="s3-author-inline">{c.author}:</span> {c.text}
            </p>
            {c.reply && (
              <p className="s3-reply">
                <span className="s3-author-inline">{c.reply.author}:</span> {c.reply.text}
              </p>
            )}
            <span className="s3-time">{c.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────
   STYLE 4: TERMINAL THREADS
   Monospace. Command-block inspired.
   ───────────────────────────────────── */
function StyleTerminal() {
  return (
    <div className="s4-panel">
      {SAMPLE_COMMENTS.filter(c => !c.resolved).map(c => (
        <div key={c.id} className="s4-block">
          <div className="s4-accent" style={{ background: c.color }} />
          <div className="s4-inner">
            <div className="s4-head">
              <span className="s4-prompt">⟩</span>
              <span className="s4-author">{c.author.toLowerCase().replace(" ", ".")}</span>
              <span className="s4-sep">·</span>
              <span className="s4-time">{c.time}</span>
              <span className="s4-status">open</span>
            </div>
            {c.highlight && <div className="s4-ref">→ "{c.highlight}"</div>}
            <div className="s4-text">{c.text}</div>
            {c.reply && (
              <div className="s4-reply">
                <span className="s4-reply-prompt">└─</span>
                <span className="s4-reply-author">{c.reply.author.toLowerCase().replace(" ", ".")}</span>
                <span className="s4-reply-text">{c.reply.text}</span>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="s4-input-block">
        <span className="s4-input-prompt">⟩ comment</span>
        <span className="s4-cursor">│</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   STYLE 5: BUBBLE THREAD
   Chat-bubble style. Conversational.
   ───────────────────────────────────── */
function StyleBubbles() {
  return (
    <div className="s5-panel">
      {SAMPLE_COMMENTS.filter(c => !c.resolved).map(c => (
        <div key={c.id} className="s5-thread">
          <div className="s5-connector" style={{ background: c.color + "20" }} />
          <div className="s5-bubble-wrap">
            <div className="s5-bubble">
              <div className="s5-bubble-header">
                <div className="s5-avatar" style={{ background: c.color }}>{c.avatar}</div>
                <span className="s5-name">{c.author}</span>
                <span className="s5-time">{c.time}</span>
              </div>
              <p className="s5-text">{c.text}</p>
            </div>
            {c.reply && (
              <div className="s5-bubble reply">
                <div className="s5-bubble-header">
                  <div className="s5-avatar" style={{ background: c.reply.color }}>{c.reply.avatar}</div>
                  <span className="s5-name">{c.reply.author}</span>
                  <span className="s5-time">{c.reply.time}</span>
                </div>
                <p className="s5-text">{c.reply.text}</p>
              </div>
            )}
          </div>
          <div className="s5-actions">
            <button className="s5-act">↩</button>
            <button className="s5-act">✓</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════
   SHOWCASE
   ═══════════════════ */
export default function CommentStyles() {
  const [active, setActive] = useState(1);
  const styles = [
    { id: 1, label: "Whisper", desc: "Thin lines, barely there" },
    { id: 2, label: "Stone Cards", desc: "Elevated, expandable" },
    { id: 3, label: "Margin Notes", desc: "Academic, serif" },
    { id: 4, label: "Terminal", desc: "Monospace, command-block" },
    { id: 5, label: "Bubbles", desc: "Chat-style threads" },
  ];

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

        .showcase {
          font-family: 'Outfit', sans-serif; font-size: 14px;
          color: var(--ink-700); background: var(--parchment);
          min-height: 100vh; display: flex;
        }

        /* ── Editor mock (left) ── */
        .editor-mock {
          flex: 1; padding: 48px 80px 48px 120px; max-width: 680px;
          border-right: 1px solid var(--warm-100);
        }
        .em-title {
          font-family: 'Cormorant Garamond', serif; font-size: 28px;
          font-weight: 600; color: var(--ink-900); margin-bottom: 8px;
        }
        .em-callout {
          background: rgba(176,125,79,0.04); border: 1px solid rgba(176,125,79,0.08);
          border-radius: 6px; padding: 10px 14px; display: flex; align-items: center;
          gap: 8px; font-size: 14px; color: var(--ink-600); margin-bottom: 24px;
        }
        .em-callout-icon { color: var(--ember); font-size: 14px; }
        .em-h2 {
          font-family: 'Cormorant Garamond', serif; font-size: 20px;
          font-weight: 600; color: var(--ink-900); margin: 28px 0 8px;
        }
        .em-li { display: flex; gap: 8px; padding: 4px 0; font-size: 14px; color: var(--ink-600); }
        .em-li-dot { color: var(--warm-400); font-size: 18px; line-height: 1.4; }
        .em-divider { height: 1px; background: var(--warm-200); margin: 20px 0; }
        .em-placeholder { font-size: 14px; color: var(--warm-400); }
        .em-todo { display: flex; align-items: center; gap: 8px; padding: 3px 0; }
        .em-checkbox { width: 15px; height: 15px; accent-color: var(--ember); }

        /* Comment markers in text */
        .em-highlight {
          background: rgba(176,125,79,0.1); border-bottom: 2px solid rgba(176,125,79,0.3);
          padding: 0 2px; border-radius: 2px; cursor: pointer; position: relative;
        }
        .em-highlight:hover { background: rgba(176,125,79,0.18); }
        .em-marker {
          position: absolute; right: -28px; top: -2px;
          width: 20px; height: 20px; border-radius: 4px;
          background: var(--ember-bg); border: 1px solid rgba(176,125,79,0.12);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--mono); font-size: 9px; color: var(--ember);
          cursor: pointer;
        }

        /* ── Selector (top) ── */
        .style-selector {
          position: fixed; top: 16px; right: 16px;
          display: flex; gap: 4px; z-index: 50;
          background: #fff; border: 1px solid var(--warm-200);
          border-radius: 8px; padding: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .style-tab {
          padding: 6px 14px; border-radius: 5px; font-size: 12px;
          border: none; cursor: pointer; font-family: inherit;
          color: var(--ink-400); background: none; transition: all 0.08s;
        }
        .style-tab:hover { background: var(--warm-100); }
        .style-tab.on { background: var(--ink-900); color: var(--parchment); }

        /* ── Comment panel (right) ── */
        .comment-area {
          width: 300px; padding: 20px 16px;
          flex-shrink: 0; position: relative;
        }

        /* ═══════════════════════════════
           STYLE 1: WHISPER
           ═══════════════════════════════ */
        .s1-panel { display: flex; flex-direction: column; gap: 0; }
        .s1-comment {
          display: flex; gap: 10px; padding: 12px 0;
          border-bottom: 1px solid var(--warm-100);
          transition: background 0.08s; margin: 0 -8px; padding-left: 8px; padding-right: 8px;
          border-radius: 4px;
        }
        .s1-comment.hovered { background: var(--warm-50); }
        .s1-line { width: 2px; border-radius: 1px; flex-shrink: 0; align-self: stretch; }
        .s1-body { flex: 1; min-width: 0; }
        .s1-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px; }
        .s1-author { font-size: 12px; font-weight: 500; color: var(--ink-700); }
        .s1-time { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }
        .s1-text { font-size: 13px; color: var(--ink-600); line-height: 1.55; }
        .s1-reply { margin-top: 6px; padding-top: 6px; border-top: 1px dashed var(--warm-200); }
        .s1-reply-author { font-size: 11px; font-weight: 500; color: var(--ink-500); margin-right: 4px; }
        .s1-reply-text { font-size: 12px; color: var(--ink-400); }
        .s1-actions { display: flex; gap: 6px; margin-top: 8px; }
        .s1-act {
          font-size: 11px; color: var(--ink-400); background: none; border: none;
          cursor: pointer; padding: 2px 8px; border-radius: 3px;
          font-family: inherit; transition: all 0.08s;
        }
        .s1-act:hover { background: var(--warm-200); color: var(--ink-600); }

        /* ═══════════════════════════════
           STYLE 2: STONE CARDS
           ═══════════════════════════════ */
        .s2-panel { display: flex; flex-direction: column; gap: 8px; }
        .s2-card {
          background: #fff; border: 1px solid var(--warm-200);
          border-radius: 10px; padding: 12px 14px; cursor: pointer;
          transition: all 0.12s;
        }
        .s2-card:hover { border-color: var(--warm-300); box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .s2-card.expanded { border-color: var(--ember); box-shadow: 0 2px 12px rgba(176,125,79,0.06); }
        .s2-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .s2-avatar {
          width: 22px; height: 22px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .s2-info { flex: 1; display: flex; align-items: baseline; gap: 6px; }
        .s2-author { font-size: 12px; font-weight: 500; color: var(--ink-700); }
        .s2-time { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }
        .s2-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ember); flex-shrink: 0; }
        .s2-text { font-size: 13px; color: var(--ink-600); line-height: 1.5; }
        .s2-ref {
          font-size: 11px; color: var(--ink-400); font-style: italic;
          display: block; margin-top: 6px; padding: 4px 8px;
          background: var(--warm-50); border-radius: 4px;
          border-left: 2px solid var(--warm-300);
        }
        .s2-reply {
          display: flex; gap: 8px; margin-top: 10px; padding-top: 10px;
          border-top: 1px solid var(--warm-100);
        }
        .s2-reply-av {
          width: 18px; height: 18px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 600; color: #fff; flex-shrink: 0; margin-top: 1px;
        }
        .s2-reply-author { font-size: 11px; font-weight: 500; color: var(--ink-500); }
        .s2-reply-text { font-size: 12px; color: var(--ink-400); line-height: 1.45; margin-top: 1px; }
        .s2-input-row { display: flex; gap: 6px; margin-top: 10px; }
        .s2-input {
          flex: 1; padding: 6px 10px; border: 1px solid var(--warm-200); border-radius: 5px;
          font-family: inherit; font-size: 12px; outline: none; color: var(--ink-700);
        }
        .s2-input:focus { border-color: var(--ember); }
        .s2-input::placeholder { color: var(--warm-400); }
        .s2-send {
          width: 28px; height: 28px; border-radius: 5px; border: none;
          background: var(--ember); color: #fff; cursor: pointer;
          font-size: 13px; display: flex; align-items: center; justify-content: center;
        }
        .s2-actions { display: flex; gap: 6px; margin-top: 8px; justify-content: flex-end; }
        .s2-act {
          font-size: 11px; padding: 3px 10px; border-radius: 4px;
          border: 1px solid var(--warm-200); background: #fff;
          color: var(--ink-500); cursor: pointer; font-family: inherit;
        }
        .s2-act:hover { background: var(--warm-50); }
        .s2-act.resolve { border-color: rgba(90,154,60,0.2); color: #5a9a3c; background: rgba(90,154,60,0.04); }
        .s2-resolved-count {
          font-family: var(--mono); font-size: 11px; color: var(--ink-300);
          text-align: center; padding: 12px 0; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 4px;
        }
        .s2-resolved-count:hover { color: var(--ink-500); }

        /* ═══════════════════════════════
           STYLE 3: MARGIN NOTES
           ═══════════════════════════════ */
        .s3-panel { display: flex; flex-direction: column; gap: 0; padding-left: 4px; }
        .s3-note {
          display: flex; gap: 10px; padding: 14px 0;
          border-bottom: 1px solid var(--warm-100);
        }
        .s3-num {
          font-family: 'Cormorant Garamond', serif; font-size: 18px;
          font-weight: 500; color: var(--warm-300); width: 20px;
          text-align: right; flex-shrink: 0; line-height: 1.4;
        }
        .s3-body { flex: 1; }
        .s3-text {
          font-family: 'Cormorant Garamond', serif; font-size: 14px;
          color: var(--ink-600); line-height: 1.6; font-style: italic;
        }
        .s3-author-inline {
          font-style: normal; font-weight: 600; color: var(--ink-800); font-size: 13px;
        }
        .s3-reply {
          font-family: 'Cormorant Garamond', serif; font-size: 13px;
          color: var(--ink-400); line-height: 1.5; margin-top: 6px;
          padding-left: 12px; border-left: 1px solid var(--warm-300);
          font-style: italic;
        }
        .s3-time { font-family: var(--mono); font-size: 9px; color: var(--ink-300); margin-top: 4px; display: block; }

        /* ═══════════════════════════════
           STYLE 4: TERMINAL
           ═══════════════════════════════ */
        .s4-panel {
          background: var(--ink-900); border-radius: 8px; padding: 8px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .s4-block {
          display: flex; overflow: hidden; border-radius: 5px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04);
        }
        .s4-accent { width: 2px; flex-shrink: 0; }
        .s4-inner { padding: 8px 10px; flex: 1; }
        .s4-head { display: flex; align-items: center; gap: 5px; margin-bottom: 4px; flex-wrap: wrap; }
        .s4-prompt { font-family: var(--mono); font-size: 11px; color: var(--ember); }
        .s4-author { font-family: var(--mono); font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; }
        .s4-sep { color: rgba(255,255,255,0.15); font-size: 10px; }
        .s4-time { font-family: var(--mono); font-size: 10px; color: rgba(255,255,255,0.2); }
        .s4-status {
          font-family: var(--mono); font-size: 9px; color: var(--ember);
          background: rgba(176,125,79,0.08); padding: 0px 5px; border-radius: 2px;
          margin-left: auto;
        }
        .s4-ref {
          font-family: var(--mono); font-size: 10px; color: rgba(255,255,255,0.25);
          margin-bottom: 3px; font-style: italic;
        }
        .s4-text { font-family: var(--mono); font-size: 11.5px; color: rgba(255,255,255,0.5); line-height: 1.5; }
        .s4-reply {
          display: flex; gap: 4px; margin-top: 6px; padding-top: 6px;
          border-top: 1px solid rgba(255,255,255,0.03);
          font-family: var(--mono); font-size: 11px;
        }
        .s4-reply-prompt { color: rgba(255,255,255,0.15); }
        .s4-reply-author { color: rgba(255,255,255,0.4); margin-right: 4px; }
        .s4-reply-text { color: rgba(255,255,255,0.35); }
        .s4-input-block {
          padding: 8px 10px; border-radius: 5px; margin-top: 2px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04);
          font-family: var(--mono); font-size: 11px;
        }
        .s4-input-prompt { color: var(--ember); }
        .s4-cursor { color: var(--ember); animation: blink 0.8s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }

        /* ═══════════════════════════════
           STYLE 5: BUBBLES
           ═══════════════════════════════ */
        .s5-panel { display: flex; flex-direction: column; gap: 12px; }
        .s5-thread { display: flex; align-items: flex-start; gap: 6px; }
        .s5-connector {
          width: 3px; align-self: stretch; border-radius: 2px;
          flex-shrink: 0; margin-top: 4px;
        }
        .s5-bubble-wrap { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .s5-bubble {
          background: #fff; border: 1px solid var(--warm-200);
          border-radius: 10px; padding: 10px 12px;
          transition: border-color 0.1s;
        }
        .s5-bubble:hover { border-color: var(--warm-300); }
        .s5-bubble.reply { margin-left: 16px; background: var(--warm-50); border-color: var(--warm-100); }
        .s5-bubble-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
        .s5-avatar {
          width: 18px; height: 18px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .s5-name { font-size: 11.5px; font-weight: 500; color: var(--ink-700); }
        .s5-time { font-family: var(--mono); font-size: 9px; color: var(--ink-300); margin-left: auto; }
        .s5-text { font-size: 13px; color: var(--ink-600); line-height: 1.5; }
        .s5-actions {
          display: flex; flex-direction: column; gap: 2px; flex-shrink: 0; padding-top: 8px;
        }
        .s5-act {
          width: 24px; height: 24px; border-radius: 5px; border: 1px solid var(--warm-200);
          background: #fff; cursor: pointer; display: flex; align-items: center;
          justify-content: center; font-size: 11px; color: var(--ink-300);
          transition: all 0.08s;
        }
        .s5-act:hover { background: var(--warm-100); color: var(--ink-600); border-color: var(--warm-300); }
      `}</style>

      <div className="showcase">
        {/* ── Style selector ── */}
        <div className="style-selector">
          {styles.map(s => (
            <button key={s.id} className={`style-tab${active === s.id ? " on" : ""}`}
              onClick={() => setActive(s.id)}>
              {s.label}
            </button>
          ))}
        </div>

        {/* ── Editor mock ── */}
        <div className="editor-mock">
          <h1 className="em-title">Meeting with Christian</h1>
          <div className="em-callout">
            <span className="em-callout-icon">◆</span>
            Date: Mar 29, 2026 — Attendees: Christian, Sarah, Jamie
          </div>

          <h2 className="em-h2">Agenda</h2>
          <div className="em-li"><span className="em-li-dot">•</span> Review brand direction feedback</div>
          <div className="em-li"><span className="em-li-dot">•</span> <span className="em-highlight">Primary & secondary logo usage rules<span className="em-marker">1</span></span></div>
          <div className="em-li"><span className="em-li-dot">•</span> <span className="em-highlight">Color palette with hex/RGB/CMYK<span className="em-marker">3</span></span></div>

          <div className="em-divider" />

          <h2 className="em-h2">Notes</h2>
          <p className="em-placeholder">Type '/' for commands, ⌘K for palette</p>

          <div className="em-divider" />

          <h2 className="em-h2">Action Items</h2>
          <div className="em-todo"><input type="checkbox" className="em-checkbox" /> <span style={{ color: "var(--warm-400)" }}>To-do</span></div>
        </div>

        {/* ── Comment panel ── */}
        <div className="comment-area">
          {active === 1 && <StyleWhisper />}
          {active === 2 && <StyleStoneCards />}
          {active === 3 && <StyleMarginNotes />}
          {active === 4 && <StyleTerminal />}
          {active === 5 && <StyleBubbles />}
        </div>
      </div>
    </>
  );
}
