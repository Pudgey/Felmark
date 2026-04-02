import { useState, useRef, useEffect, useCallback } from "react";

const BLOCKS = [
  { id: "b1", type: "h1", content: "Brand Guidelines v2", section: true, sectionColor: "#b07d4f", complete: false },
  { id: "b2", type: "callout", content: "Client: Meridian Studio — Due Apr 3 — Budget: $2,400", icon: "◆" },
  { id: "b3", type: "divider" },
  { id: "b4", type: "h2", content: "Introduction", section: true, sectionColor: "#5a9a3c", complete: true },
  { id: "b5", type: "p", content: "Hi Sarah — thanks for reaching out about the Brand Guidelines project. Based on our conversation, here's what I'm proposing for Meridian Studio's visual identity system." },
  { id: "b6", type: "p", content: "This document covers everything from logo usage to typography to social media templates. Each section builds on the last, so the final deliverable is a cohesive system, not a collection of parts." },
  { id: "b7", type: "divider" },
  { id: "b8", type: "h2", content: "Scope of Work", section: true, sectionColor: "#5a9a3c", complete: true },
  { id: "b9", type: "todo", content: "Primary & secondary logo usage rules", checked: true },
  { id: "b10", type: "todo", content: "Color palette with hex/RGB/CMYK values", checked: true },
  { id: "b11", type: "todo", content: "Typography scale & font pairings", checked: false },
  { id: "b12", type: "todo", content: "Imagery & photography direction", checked: false },
  { id: "b13", type: "todo", content: "Social media templates (IG, LinkedIn)", checked: false },
  { id: "b14", type: "divider" },
  { id: "b15", type: "h2", content: "Typography", section: true, sectionColor: "#b07d4f", complete: false },
  { id: "b16", type: "p", content: "Using Outfit Variable — a single file that supports the full weight range from 300 to 700. This gives us maximum flexibility for both web and print without managing multiple font files." },
  { id: "b17", type: "h3", content: "Font Scale" },
  { id: "b18", type: "p", content: "The type scale follows a modular progression: 12 / 14 / 16 / 20 / 24 / 32 / 40. Body text sits at 16px with a line height of 1.5. Headings use 1.25 line height for tighter vertical rhythm." },
  { id: "b19", type: "code", content: "--font-body: 'Outfit', sans-serif;\n--font-heading: 'Cormorant Garamond', serif;\n--font-mono: 'JetBrains Mono', monospace;\n\n--scale-xs: 12px;\n--scale-sm: 14px;\n--scale-base: 16px;\n--scale-lg: 20px;\n--scale-xl: 24px;\n--scale-2xl: 32px;\n--scale-3xl: 40px;" },
  { id: "b20", type: "h3", content: "Font Pairings" },
  { id: "b21", type: "p", content: "Cormorant Garamond for headings and display text — it brings warmth and authority. Outfit for body copy — clean, modern, highly legible. JetBrains Mono for metadata, labels, and anything that needs a technical feel." },
  { id: "b22", type: "divider" },
  { id: "b23", type: "h2", content: "Color Palette", section: true, sectionColor: "#b07d4f", complete: false },
  { id: "b24", type: "p", content: "The palette draws from warm earth tones — parchment, stone, and ember. It should feel like old-world craft meeting modern precision." },
  { id: "b25", type: "color-swatch", colors: [
    { name: "Parchment", hex: "#faf9f7" },
    { name: "Warm 200", hex: "#e5e2db" },
    { name: "Ink 900", hex: "#2c2a25" },
    { name: "Ember", hex: "#b07d4f" },
    { name: "Green", hex: "#5a9a3c" },
  ]},
  { id: "b26", type: "divider" },
  { id: "b27", type: "h2", content: "Imagery Direction", section: true, sectionColor: "#9b988f", complete: false },
  { id: "b28", type: "p", content: "", placeholder: "Describe the photography and imagery style..." },
  { id: "b29", type: "divider" },
  { id: "b30", type: "h2", content: "Social Templates", section: true, sectionColor: "#9b988f", complete: false },
  { id: "b31", type: "p", content: "", placeholder: "Outline the social media template deliverables..." },
  { id: "b32", type: "divider" },
  { id: "b33", type: "h2", content: "Notes", section: true, sectionColor: "#9b988f", complete: false },
  { id: "b34", type: "p", content: "", placeholder: "Type '/' for commands, ⌘K for palette" },
];

const BLOCK_LABELS = {
  h1: "H1", h2: "H2", h3: "H3", p: "¶", todo: "☐", callout: "◆",
  divider: "—", code: "<>", "color-swatch": "🎨",
};

const BLOCK_LABEL_COLORS = {
  h1: "var(--ember)", h2: "var(--ink-500)", h3: "var(--ink-400)",
  p: "var(--ink-300)", todo: "#5a9a3c", callout: "var(--ember)",
  divider: "var(--warm-300)", code: "#5b7fa4", "color-swatch": "var(--ink-400)",
};

export default function EditorWithMargin() {
  const [blocks, setBlocks] = useState(BLOCKS);
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [activeSection, setActiveSection] = useState("b1");
  const [spineCollapsed, setSpineCollapsed] = useState(false);
  const [gutterVisible, setGutterVisible] = useState(true);
  const [showBlockMenu, setShowBlockMenu] = useState(null);
  const editorRef = useRef(null);
  const blockRefs = useRef({});

  const sections = blocks.filter(b => b.section);
  const totalSections = sections.length;
  const completeSections = sections.filter(s => s.complete).length;
  const docProgress = Math.round((completeSections / totalSections) * 100);

  // Track active section on scroll
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const onScroll = () => {
      for (const section of [...sections].reverse()) {
        const el = blockRefs.current[section.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    editor.addEventListener("scroll", onScroll, { passive: true });
    return () => editor.removeEventListener("scroll", onScroll);
  }, [sections]);

  const scrollTo = (blockId) => {
    const el = blockRefs.current[blockId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleTodo = (id) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, checked: !b.checked } : b));
  };

  const getSectionStatus = (section) => {
    if (section.complete) return "complete";
    if (section.sectionColor === "#9b988f") return "empty";
    return "active";
  };

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

        .ed {
          font-family: 'Outfit', sans-serif; font-size: 15px;
          color: var(--ink-700); background: var(--parchment);
          height: 100vh; display: flex; flex-direction: column;
        }

        /* ── Top bar ── */
        .ed-top {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 16px; border-bottom: 1px solid var(--warm-200);
          flex-shrink: 0; background: var(--parchment); z-index: 10;
        }
        .ed-top-left { display: flex; align-items: center; gap: 8px; }
        .ed-nav-btn { width: 28px; height: 28px; border-radius: 5px; border: none; background: none; cursor: pointer; color: var(--ink-400); display: flex; align-items: center; justify-content: center; }
        .ed-nav-btn:hover { background: var(--warm-100); color: var(--ink-600); }
        .ed-breadcrumb { font-family: var(--mono); font-size: 12px; color: var(--ink-400); display: flex; align-items: center; gap: 4px; }
        .ed-bc-active { color: var(--ink-700); font-weight: 500; }
        .ed-bc-sep { color: var(--warm-300); }
        .ed-status { font-family: var(--mono); font-size: 9px; font-weight: 500; padding: 2px 8px; border-radius: 3px; background: rgba(90,154,60,0.06); color: #5a9a3c; border: 1px solid rgba(90,154,60,0.1); letter-spacing: 0.04em; }
        .ed-top-right { display: flex; align-items: center; gap: 4px; }
        .ed-top-btn { width: 32px; height: 32px; border-radius: 6px; border: none; background: none; cursor: pointer; color: var(--ink-400); display: flex; align-items: center; justify-content: center; transition: all 0.08s; }
        .ed-top-btn:hover { background: var(--warm-100); color: var(--ink-600); }
        .ed-avatar { width: 28px; height: 28px; border-radius: 50%; background: var(--ember); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #fff; cursor: pointer; }

        /* ── Main layout ── */
        .ed-main { flex: 1; display: flex; overflow: hidden; }

        /* ═══ LEFT MARGIN ═══ */
        .ed-margin {
          width: 220px; min-width: 220px; flex-shrink: 0;
          display: flex; flex-direction: column;
          border-right: 1px solid var(--warm-100);
          background: var(--warm-50);
          transition: width 0.2s, min-width 0.2s;
          overflow: hidden;
        }

        /* ── Document Spine ── */
        .spine {
          padding: 16px 12px 12px; flex-shrink: 0;
          border-bottom: 1px solid var(--warm-100);
        }
        .spine-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 10px;
        }
        .spine-label { font-family: var(--mono); font-size: 9px; font-weight: 500; color: var(--ink-400); letter-spacing: 0.1em; text-transform: uppercase; }
        .spine-progress { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }

        .spine-bar { height: 3px; background: var(--warm-200); border-radius: 2px; overflow: hidden; margin-bottom: 12px; }
        .spine-bar-fill { height: 100%; border-radius: 2px; background: #5a9a3c; transition: width 0.4s ease; }

        .spine-sections { display: flex; flex-direction: column; gap: 1px; }
        .spine-item {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 8px; border-radius: 5px; cursor: pointer;
          transition: all 0.08s; position: relative;
        }
        .spine-item:hover { background: var(--warm-100); }
        .spine-item.on { background: var(--ember-bg); }

        .spine-dot-wrap {
          display: flex; flex-direction: column; align-items: center;
          width: 12px; flex-shrink: 0; position: relative;
        }
        .spine-dot {
          width: 8px; height: 8px; border-radius: 50%;
          border: 2px solid; flex-shrink: 0; z-index: 1;
          transition: all 0.15s; position: relative;
        }
        .spine-dot.complete { border-color: #5a9a3c; background: #5a9a3c; }
        .spine-dot.active { border-color: var(--ember); background: var(--ember); }
        .spine-dot.empty { border-color: var(--warm-300); background: var(--warm-50); }
        .spine-item.on .spine-dot { transform: scale(1.25); box-shadow: 0 0 0 3px rgba(176,125,79,0.12); }

        .spine-connector {
          position: absolute; top: 10px; left: 5.5px;
          width: 1px; height: calc(100% + 1px); z-index: 0;
        }

        .spine-name {
          font-size: 12px; color: var(--ink-500); flex: 1;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .spine-item.on .spine-name { color: var(--ink-800); font-weight: 500; }
        .spine-item .spine-name.complete-text { color: var(--ink-400); }
        .spine-check { font-size: 10px; color: #5a9a3c; flex-shrink: 0; }

        /* ── Block Gutter ── */
        .gutter {
          flex: 1; overflow-y: auto; padding: 0;
        }
        .gutter::-webkit-scrollbar { width: 3px; }
        .gutter::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }

        .gutter-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 12px 6px;
        }
        .gutter-label { font-family: var(--mono); font-size: 9px; font-weight: 500; color: var(--ink-400); letter-spacing: 0.1em; text-transform: uppercase; }
        .gutter-count { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }

        .gutter-items { display: flex; flex-direction: column; gap: 0; }
        .gutter-item {
          display: flex; align-items: center; gap: 6px;
          padding: 3px 12px; transition: background 0.06s;
          cursor: pointer; min-height: 28px; position: relative;
        }
        .gutter-item:hover { background: var(--warm-100); }
        .gutter-item.on { background: var(--ember-bg); }

        .gutter-line {
          font-family: var(--mono); font-size: 9px; color: var(--ink-300);
          width: 20px; text-align: right; flex-shrink: 0;
          font-variant-numeric: tabular-nums;
        }

        .gutter-type {
          font-family: var(--mono); font-size: 9px; font-weight: 500;
          width: 24px; text-align: center; flex-shrink: 0;
          padding: 1px 0; border-radius: 2px;
          transition: all 0.08s;
        }
        .gutter-item:hover .gutter-type { background: rgba(0,0,0,0.03); }

        .gutter-preview {
          font-size: 11px; color: var(--ink-400); flex: 1;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .gutter-item.on .gutter-preview { color: var(--ink-600); font-weight: 500; }
        .gutter-item.section-row .gutter-preview { color: var(--ink-600); font-weight: 500; }
        .gutter-preview.empty { color: var(--warm-400); font-style: italic; }
        .gutter-preview.divider-text { color: var(--warm-300); }

        /* Hover actions */
        .gutter-actions {
          display: flex; gap: 1px; opacity: 0; transition: opacity 0.08s;
          position: absolute; right: 8px;
        }
        .gutter-item:hover .gutter-actions { opacity: 1; }
        .gutter-act {
          width: 18px; height: 18px; border-radius: 3px; border: none;
          background: var(--warm-200); cursor: pointer; color: var(--ink-400);
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; transition: all 0.06s;
        }
        .gutter-act:hover { background: var(--warm-300); color: var(--ink-600); }

        /* ═══ EDITOR ═══ */
        .ed-scroll {
          flex: 1; overflow-y: auto; padding: 48px 80px 120px 60px;
        }
        .ed-scroll::-webkit-scrollbar { width: 5px; }
        .ed-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }

        .ed-content { max-width: 640px; }

        /* Block styles */
        .block { position: relative; margin-bottom: 2px; }
        .block:hover .block-handle { opacity: 1; }

        .block-handle {
          position: absolute; left: -36px; top: 50%; transform: translateY(-50%);
          display: flex; gap: 2px; opacity: 0; transition: opacity 0.1s;
        }
        .block-handle-btn {
          width: 22px; height: 22px; border-radius: 4px; border: none;
          background: none; cursor: pointer; color: var(--ink-300);
          display: flex; align-items: center; justify-content: center;
        }
        .block-handle-btn:hover { background: var(--warm-200); color: var(--ink-500); }

        .block-h1 {
          font-family: 'Cormorant Garamond', serif; font-size: 32px;
          font-weight: 600; color: var(--ink-900); letter-spacing: -0.02em;
          line-height: 1.2; padding: 4px 0; margin-bottom: 8px;
        }

        .block-h2 {
          font-family: 'Cormorant Garamond', serif; font-size: 22px;
          font-weight: 600; color: var(--ink-900); line-height: 1.3;
          padding: 4px 0; margin-top: 8px;
        }

        .block-h3 {
          font-family: 'Cormorant Garamond', serif; font-size: 17px;
          font-weight: 600; color: var(--ink-800); line-height: 1.35;
          padding: 3px 0;
        }

        .block-p {
          font-size: 15px; color: var(--ink-600); line-height: 1.75;
          padding: 3px 0;
        }
        .block-p.empty { color: var(--warm-400); }

        .block-callout {
          background: rgba(176,125,79,0.03); border: 1px solid rgba(176,125,79,0.08);
          border-radius: 6px; padding: 12px 16px; display: flex;
          align-items: center; gap: 10px; font-size: 14px; color: var(--ink-600);
          margin-bottom: 8px;
        }
        .block-callout-icon { color: var(--ember); font-size: 14px; flex-shrink: 0; }

        .block-todo {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 4px 0; font-size: 15px;
        }
        .block-checkbox {
          width: 18px; height: 18px; border-radius: 4px;
          border: 1.5px solid var(--warm-300); background: #fff;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0; margin-top: 3px;
          transition: all 0.12s;
        }
        .block-checkbox:hover { border-color: var(--ember); }
        .block-checkbox.checked { background: var(--ember); border-color: var(--ember); }
        .block-checkbox-mark { color: #fff; font-size: 11px; }
        .block-todo-text { line-height: 1.65; color: var(--ink-600); }
        .block-todo-text.checked { text-decoration: line-through; color: var(--ink-300); text-decoration-color: var(--warm-300); }

        .block-divider { height: 1px; background: var(--warm-200); margin: 16px 0; }

        .block-code {
          background: var(--ink-900); border-radius: 8px;
          padding: 16px 20px; margin: 8px 0;
          font-family: var(--mono); font-size: 12.5px;
          color: rgba(255,255,255,0.7); line-height: 1.7;
          white-space: pre-wrap; overflow-x: auto;
        }
        .block-code .key { color: #7eb8da; }
        .block-code .val { color: #c89360; }

        /* Color swatches */
        .block-swatches { display: flex; gap: 10px; margin: 12px 0; flex-wrap: wrap; }
        .block-swatch {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          cursor: pointer; transition: transform 0.1s;
        }
        .block-swatch:hover { transform: translateY(-2px); }
        .block-swatch-circle {
          width: 48px; height: 48px; border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        }
        .block-swatch-name { font-size: 11px; color: var(--ink-500); font-weight: 500; }
        .block-swatch-hex { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }

        /* ── Status bar ── */
        .ed-status-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 5px 16px; border-top: 1px solid var(--warm-100);
          font-family: var(--mono); font-size: 10px; color: var(--ink-300);
          flex-shrink: 0; background: var(--parchment);
        }
        .ed-sb-left { display: flex; align-items: center; gap: 12px; }
        .ed-sb-right { display: flex; align-items: center; gap: 12px; }
        .ed-sb-dot { width: 5px; height: 5px; border-radius: 50%; }
      `}</style>

      <div className="ed">
        {/* ── Top bar ── */}
        <div className="ed-top">
          <div className="ed-top-left">
            <button className="ed-nav-btn"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 3L4.5 7l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <button className="ed-nav-btn"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <div className="ed-breadcrumb">
              <span>Meridian Studio</span>
              <span className="ed-bc-sep">/</span>
              <span className="ed-bc-active">Brand Guidelines v2</span>
            </div>
            <span className="ed-status">ACTIVE</span>
          </div>
          <div className="ed-top-right">
            <button className="ed-top-btn" title="Comments"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 10c0 .7-.4 1.2-1 1.2H5L2.5 14V3.5c0-.7.4-1.2 1-1.2h8.5c.6 0 1 .5 1 1.2V10z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg></button>
            <button className="ed-top-btn" title="History"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <div className="ed-avatar">A</div>
          </div>
        </div>

        <div className="ed-main">
          {/* ═══ LEFT MARGIN ═══ */}
          <div className="ed-margin">
            {/* ── Document Spine ── */}
            <div className="spine">
              <div className="spine-head">
                <span className="spine-label">outline</span>
                <span className="spine-progress">{completeSections}/{totalSections} sections</span>
              </div>

              <div className="spine-bar">
                <div className="spine-bar-fill" style={{ width: `${docProgress}%` }} />
              </div>

              <div className="spine-sections">
                {sections.map((section, i) => {
                  const status = getSectionStatus(section);
                  const isActive = activeSection === section.id;
                  const isLast = i === sections.length - 1;
                  const displayName = section.content.length > 22 ? section.content.slice(0, 20) + "…" : section.content;

                  return (
                    <div key={section.id} className={`spine-item${isActive ? " on" : ""}`}
                      onClick={() => scrollTo(section.id)}>
                      <div className="spine-dot-wrap">
                        <div className={`spine-dot ${status}`} />
                        {!isLast && (
                          <div className="spine-connector" style={{
                            background: status === "complete" ? "rgba(90,154,60,0.2)" : "var(--warm-200)"
                          }} />
                        )}
                      </div>
                      <span className={`spine-name${status === "complete" ? " complete-text" : ""}`}>
                        {displayName}
                      </span>
                      {status === "complete" && <span className="spine-check">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Block Gutter ── */}
            <div className="gutter">
              <div className="gutter-head">
                <span className="gutter-label">blocks</span>
                <span className="gutter-count">{blocks.length}</span>
              </div>

              <div className="gutter-items">
                {blocks.map((block, i) => {
                  const label = BLOCK_LABELS[block.type] || "?";
                  const color = BLOCK_LABEL_COLORS[block.type] || "var(--ink-300)";
                  const isHovered = hoveredBlock === block.id;
                  const isSection = block.section;
                  const preview = block.content
                    ? (block.content.length > 28 ? block.content.slice(0, 26) + "…" : block.content)
                    : block.placeholder || (block.type === "divider" ? "————" : "");
                  const isEmpty = !block.content && block.type !== "divider" && block.type !== "color-swatch";

                  if (block.type === "divider") {
                    return (
                      <div key={block.id} className={`gutter-item${isHovered ? " on" : ""}`}
                        onMouseEnter={() => setHoveredBlock(block.id)}
                        onMouseLeave={() => setHoveredBlock(null)}
                        onClick={() => scrollTo(block.id)}
                        style={{ minHeight: 16 }}>
                        <span className="gutter-line" style={{ fontSize: 8 }}>{i + 1}</span>
                        <span className="gutter-type" style={{ color, fontSize: 8 }}>—</span>
                        <span className="gutter-preview divider-text">divider</span>
                      </div>
                    );
                  }

                  return (
                    <div key={block.id}
                      className={`gutter-item${isHovered ? " on" : ""}${isSection ? " section-row" : ""}`}
                      onMouseEnter={() => setHoveredBlock(block.id)}
                      onMouseLeave={() => setHoveredBlock(null)}
                      onClick={() => scrollTo(block.id)}>
                      <span className="gutter-line">{i + 1}</span>
                      <span className="gutter-type" style={{ color }}>{label}</span>
                      <span className={`gutter-preview${isEmpty ? " empty" : ""}`}>
                        {block.type === "color-swatch" ? "color swatches" : isEmpty ? (block.placeholder || "empty") : preview}
                      </span>
                      <div className="gutter-actions">
                        <button className="gutter-act" title="Duplicate">⊕</button>
                        <button className="gutter-act" title="Delete">×</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ═══ EDITOR CANVAS ═══ */}
          <div className="ed-scroll" ref={editorRef}>
            <div className="ed-content">
              {blocks.map((block, i) => {
                const isHovered = hoveredBlock === block.id;

                return (
                  <div key={block.id}
                    ref={el => { if (el) blockRefs.current[block.id] = el; }}
                    className="block"
                    onMouseEnter={() => setHoveredBlock(block.id)}
                    onMouseLeave={() => setHoveredBlock(null)}
                    style={{ background: isHovered ? "rgba(176,125,79,0.015)" : "transparent", borderRadius: 4, transition: "background 0.08s" }}>

                    {/* Hover handle */}
                    <div className="block-handle">
                      <button className="block-handle-btn" title="Add block">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                      </button>
                      <button className="block-handle-btn" title="Drag" style={{ cursor: "grab" }}>
                        <svg width="10" height="12" viewBox="0 0 10 12"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="7" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="7" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="9.5" r="1" fill="currentColor"/><circle cx="7" cy="9.5" r="1" fill="currentColor"/></svg>
                      </button>
                    </div>

                    {block.type === "h1" && <div className="block-h1">{block.content}</div>}
                    {block.type === "h2" && <h2 className="block-h2">{block.content}</h2>}
                    {block.type === "h3" && <h3 className="block-h3">{block.content}</h3>}

                    {block.type === "p" && (
                      <p className={`block-p${!block.content ? " empty" : ""}`}>
                        {block.content || block.placeholder || "Type something..."}
                      </p>
                    )}

                    {block.type === "callout" && (
                      <div className="block-callout">
                        <span className="block-callout-icon">{block.icon}</span>
                        {block.content}
                      </div>
                    )}

                    {block.type === "todo" && (
                      <div className="block-todo">
                        <div className={`block-checkbox${block.checked ? " checked" : ""}`}
                          onClick={() => toggleTodo(block.id)}>
                          {block.checked && <span className="block-checkbox-mark">✓</span>}
                        </div>
                        <span className={`block-todo-text${block.checked ? " checked" : ""}`}>{block.content}</span>
                      </div>
                    )}

                    {block.type === "divider" && <div className="block-divider" />}

                    {block.type === "code" && (
                      <div className="block-code">
                        {block.content.split("\n").map((line, li) => {
                          const parts = line.split(":");
                          if (parts.length >= 2) {
                            return <div key={li}><span className="key">{parts[0]}</span>: <span className="val">{parts.slice(1).join(":").trim()}</span></div>;
                          }
                          return <div key={li}>{line}</div>;
                        })}
                      </div>
                    )}

                    {block.type === "color-swatch" && (
                      <div className="block-swatches">
                        {block.colors.map((c, ci) => (
                          <div key={ci} className="block-swatch">
                            <div className="block-swatch-circle" style={{ background: c.hex }} />
                            <span className="block-swatch-name">{c.name}</span>
                            <span className="block-swatch-hex">{c.hex}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Status bar ── */}
        <div className="ed-status-bar">
          <div className="ed-sb-left">
            <span>{blocks.length} blocks</span>
            <span>·</span>
            <span>{blocks.filter(b => b.type === "p" && b.content).reduce((s, b) => s + b.content.split(" ").length, 0)} words</span>
            <span>·</span>
            <span>{docProgress}% complete</span>
          </div>
          <div className="ed-sb-right">
            <span><span className="ed-sb-dot" style={{ background: "#5a9a3c", display: "inline-block", marginRight: 4 }} />saved</span>
            <span>·</span>
            <span>edited 2m ago</span>
          </div>
        </div>
      </div>
    </>
  );
}
