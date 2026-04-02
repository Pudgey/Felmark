import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { id: "all", label: "All", icon: null },
  { id: "projects", label: "Projects", icon: "◆" },
  { id: "docs", label: "Documents", icon: "☰" },
  { id: "invoices", label: "Invoices", icon: "$" },
  { id: "clients", label: "Clients", icon: "⬡" },
  { id: "messages", label: "Messages", icon: "→" },
  { id: "commands", label: "Commands", icon: "❯" },
];

const RECENT_SEARCHES = [
  "brand guidelines typography",
  "bolt fitness invoice",
  "nora proposal",
];

const RESULTS = [
  // Projects
  { id: "r1", type: "projects", icon: "◆", color: "#5a9a3c", title: "Brand Guidelines v2", subtitle: "Meridian Studio", meta: "65% · Active · Due Apr 3", preview: "Primary & secondary logo usage rules, color palette with hex/RGB/CMYK values, typography scale & font pairings...", lastEdited: "2m ago", path: "Meridian Studio / Brand Guidelines v2" },
  { id: "r2", type: "projects", icon: "◆", color: "#b07d4f", title: "Website Copy", subtitle: "Meridian Studio", meta: "40% · In Review · Due Apr 8", preview: "Homepage hero copy, about page narrative, service descriptions for branding, strategy, and design...", lastEdited: "Yesterday", path: "Meridian Studio / Website Copy" },
  { id: "r3", type: "projects", icon: "◆", color: "#c24b38", title: "App Onboarding UX", subtitle: "Bolt Fitness", meta: "70% · Overdue · 4 days", preview: "Welcome flow, profile setup, workout preference quiz, first session scheduling, push notification opt-in...", lastEdited: "3 days ago", path: "Bolt Fitness / App Onboarding UX" },
  { id: "r4", type: "projects", icon: "◆", color: "#5a9a3c", title: "Course Landing Page", subtitle: "Nora Kim", meta: "25% · Active · Due Apr 12", preview: "Hero section with social proof, curriculum breakdown, instructor bio, testimonials carousel, pricing...", lastEdited: "Today", path: "Nora Kim / Course Landing Page" },

  // Documents
  { id: "r5", type: "docs", icon: "☰", color: "#b07d4f", title: "Typography Scale v3", subtitle: "Brand Guidelines v2", meta: "12 blocks · 2,847 words", preview: "Using Outfit Variable (single file, full weight range). Font scale: 12 / 14 / 16 / 20 / 24 / 32 / 40. Line height: 1.5 for body, 1.25 for headings.", lastEdited: "2m ago", path: "Meridian Studio / Brand Guidelines v2 / Typography" },
  { id: "r6", type: "docs", icon: "☰", color: "#7c8594", title: "Mood Board — Final", subtitle: "Brand Guidelines v2", meta: "8 blocks · 3 images", preview: "Warm earth tones, textured paper feel, modern serif meets monospace. References: Aesop, Kinfolk, Cereal Magazine.", lastEdited: "Yesterday", path: "Meridian Studio / Brand Guidelines v2 / Mood Board" },
  { id: "r7", type: "docs", icon: "☰", color: "#8a7e63", title: "Discovery Call Notes", subtitle: "Nora Kim", meta: "Meeting notes · Mar 25", preview: "Nora wants 'warm but professional' feel. Budget flexible. Timeline: 4 weeks. Key deliverable is the landing page.", lastEdited: "4 days ago", path: "Nora Kim / Discovery Call Notes" },

  // Invoices
  { id: "r8", type: "invoices", icon: "$", color: "#5a9a3c", title: "Invoice #047", subtitle: "Meridian Studio · $2,400", meta: "Sent · Viewed 2x", preview: "Brand Guidelines v2 — 50% deposit. Net 15. Due Apr 13.", lastEdited: "3h ago", path: "Meridian Studio / Invoices / #047" },
  { id: "r9", type: "invoices", icon: "$", color: "#c24b38", title: "Invoice #044", subtitle: "Bolt Fitness · $4,000", meta: "Overdue · 4 days", preview: "App Onboarding UX — full project fee. Net 15. Was due Mar 25.", lastEdited: "4 days ago", path: "Bolt Fitness / Invoices / #044" },
  { id: "r10", type: "invoices", icon: "$", color: "#7c8594", title: "Invoice #046", subtitle: "Nora Kim · $1,800", meta: "Paid · Mar 15", preview: "Retainer (March) — monthly coaching content support.", lastEdited: "Mar 15", path: "Nora Kim / Invoices / #046" },

  // Clients
  { id: "r11", type: "clients", icon: "⬡", color: "#7c8594", title: "Meridian Studio", subtitle: "sarah@meridianstudio.co", meta: "4 projects · $12.4k earned", preview: "Design & Branding · Client since Oct 2025 · Rate: $95/hr", lastEdited: "Active", path: "Workspaces / Meridian Studio", avatar: "M", avatarBg: "#7c8594" },
  { id: "r12", type: "clients", icon: "⬡", color: "#a08472", title: "Nora Kim", subtitle: "nora@coachkim.com", meta: "2 projects · $4.8k earned", preview: "Coaching · Client since Feb 2026 · Rate: $95/hr", lastEdited: "Active", path: "Workspaces / Nora Kim", avatar: "N", avatarBg: "#a08472" },
  { id: "r13", type: "clients", icon: "⬡", color: "#8a7e63", title: "Bolt Fitness", subtitle: "team@boltfit.co", meta: "2 projects · $4.8k earned", preview: "Fitness Tech · Client since Jan 2026 · Rate: $95/hr", lastEdited: "Overdue", path: "Workspaces / Bolt Fitness", avatar: "B", avatarBg: "#8a7e63" },

  // Messages
  { id: "r14", type: "messages", icon: "→", color: "#5b7fa4", title: "Sarah Chen", subtitle: "Brand Guidelines v2 · 2m ago", meta: "Comment", preview: "Can we make the logo usage section more specific? I want exact minimum sizes.", path: "Meridian Studio / Brand Guidelines v2 / Comments", avatar: "S", avatarBg: "#8a7e63" },
  { id: "r15", type: "messages", icon: "→", color: "#5b7fa4", title: "Jamie Park", subtitle: "Brand Guidelines v2 · 15m ago", meta: "Comment", preview: "I'd suggest adding a 'don't' section with misuse examples.", path: "Meridian Studio / Brand Guidelines v2 / Comments", avatar: "J", avatarBg: "#7c8594" },
  { id: "r16", type: "messages", icon: "→", color: "#5b7fa4", title: "Nora Kim", subtitle: "Direct message · Yesterday", meta: "DM", preview: "Love the direction! Can we add a testimonial section?", path: "Direct Messages / Nora Kim", avatar: "N", avatarBg: "#a08472" },

  // Commands
  { id: "r17", type: "commands", icon: "❯", color: "var(--ember)", title: "New proposal", meta: "⌘⇧P", preview: "Create a new proposal from template", path: "Command" },
  { id: "r18", type: "commands", icon: "❯", color: "var(--ember)", title: "New invoice", meta: "⌘⇧I", preview: "Generate and send an invoice", path: "Command" },
  { id: "r19", type: "commands", icon: "❯", color: "var(--ember)", title: "Switch workspace", meta: "⌘J", preview: "Jump to another client workspace", path: "Command" },
  { id: "r20", type: "commands", icon: "❯", color: "var(--ember)", title: "Open calendar", meta: "⌘⇧C", preview: "View today's schedule", path: "Command" },
];

export default function FelmarkSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showRecent, setShowRecent] = useState(true);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = query.trim()
    ? RESULTS.filter(r => {
        const matchesCategory = category === "all" || r.type === category;
        const matchesQuery = [r.title, r.subtitle, r.preview, r.meta, r.path]
          .filter(Boolean).join(" ").toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
      })
    : category === "all"
      ? RESULTS.slice(0, 8)
      : RESULTS.filter(r => r.type === category);

  const selected = filtered[selectedIdx];

  useEffect(() => { setSelectedIdx(0); }, [query, category]);

  // Scroll selected into view
  useEffect(() => {
    if (!resultsRef.current) return;
    const el = resultsRef.current.querySelector(".sr-item.on");
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && selected) { /* navigate */ }
    else if (e.key === "Escape") { setQuery(""); }
  };

  const groupedResults = () => {
    if (category !== "all") return [{ type: category, items: filtered }];
    const groups = [];
    const seen = new Set();
    filtered.forEach(r => {
      if (!seen.has(r.type)) { seen.add(r.type); groups.push({ type: r.type, items: [] }); }
      groups.find(g => g.type === r.type).items.push(r);
    });
    return groups;
  };

  const groups = groupedResults();
  let globalIdx = -1;

  const getCategoryLabel = (type) => CATEGORIES.find(c => c.id === type)?.label || type;

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

        .search-page {
          font-family: 'Outfit', sans-serif; font-size: 14px;
          color: var(--ink-700); background: var(--parchment);
          height: 100vh; display: flex; flex-direction: column;
        }

        /* ── Search header ── */
        .sh {
          padding: 20px 32px 0; flex-shrink: 0;
        }
        .sh-input-row {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 20px; background: #fff;
          border: 1px solid var(--warm-200); border-radius: 12px;
          transition: all 0.15s;
        }
        .sh-input-row.focused { border-color: var(--ember); box-shadow: 0 0 0 4px rgba(176,125,79,0.04), 0 4px 20px rgba(0,0,0,0.04); }
        .sh-icon { color: var(--ink-300); flex-shrink: 0; display: flex; }
        .sh-input {
          flex: 1; border: none; outline: none; font-family: inherit;
          font-size: 18px; color: var(--ink-800); background: transparent;
          font-weight: 400;
        }
        .sh-input::placeholder { color: var(--warm-400); font-weight: 300; }
        .sh-hints { display: flex; gap: 4px; flex-shrink: 0; align-items: center; }
        .sh-kbd {
          font-family: var(--mono); font-size: 9px; color: var(--ink-300);
          background: var(--warm-100); border: 1px solid var(--warm-200);
          border-radius: 4px; padding: 2px 6px;
        }
        .sh-clear {
          width: 24px; height: 24px; border-radius: 5px; border: none;
          background: var(--warm-100); cursor: pointer; color: var(--ink-400);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.08s; flex-shrink: 0;
        }
        .sh-clear:hover { background: var(--warm-200); color: var(--ink-600); }

        /* ── Category tabs ── */
        .sh-cats {
          display: flex; gap: 2px; padding: 12px 0 0; overflow-x: auto;
        }
        .sh-cats::-webkit-scrollbar { display: none; }
        .sh-cat {
          padding: 6px 14px; border-radius: 5px; font-size: 12.5px;
          border: none; cursor: pointer; font-family: inherit;
          color: var(--ink-400); background: none; transition: all 0.08s;
          white-space: nowrap; display: flex; align-items: center; gap: 5px;
        }
        .sh-cat:hover { background: var(--warm-100); color: var(--ink-600); }
        .sh-cat.on { background: var(--ink-900); color: var(--parchment); }
        .sh-cat-icon { font-family: var(--mono); font-size: 11px; }
        .sh-cat-count {
          font-family: var(--mono); font-size: 9px; opacity: 0.5;
        }

        /* ── Content ── */
        .search-content {
          flex: 1; display: flex; overflow: hidden;
          border-top: 1px solid var(--warm-200); margin-top: 12px;
        }

        /* ── Results list ── */
        .sr-list {
          flex: 1; overflow-y: auto; padding: 8px 0;
          border-right: 1px solid var(--warm-100);
          min-width: 0;
        }
        .sr-list::-webkit-scrollbar { width: 4px; }
        .sr-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }

        /* Group label */
        .sr-group-label {
          font-family: var(--mono); font-size: 9px; font-weight: 500;
          color: var(--ink-400); letter-spacing: 0.12em; text-transform: uppercase;
          padding: 14px 20px 6px; display: flex; align-items: center; gap: 8px;
        }
        .sr-group-label::after { content: ''; flex: 1; height: 1px; background: var(--warm-100); }

        .sr-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 10px 20px; cursor: pointer; transition: background 0.06s;
          border-left: 2px solid transparent; position: relative;
        }
        .sr-item:hover { background: var(--warm-50); }
        .sr-item.on { background: var(--ember-bg); border-left-color: var(--ember); }

        .sr-icon {
          width: 32px; height: 32px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 600; flex-shrink: 0; margin-top: 1px;
        }
        .sr-icon.avatar { color: #fff; }
        .sr-icon.symbol { border: 1px solid; }

        .sr-body { flex: 1; min-width: 0; }
        .sr-title-row { display: flex; align-items: center; gap: 8px; }
        .sr-title { font-size: 14px; font-weight: 500; color: var(--ink-800); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .sr-item.on .sr-title { color: var(--ink-900); font-weight: 600; }
        .sr-meta {
          font-family: var(--mono); font-size: 10px; color: var(--ink-300);
          flex-shrink: 0;
        }
        .sr-subtitle { font-size: 12px; color: var(--ink-400); margin-top: 1px; }
        .sr-preview {
          font-size: 12.5px; color: var(--ink-400); margin-top: 3px;
          line-height: 1.45; overflow: hidden; text-overflow: ellipsis;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }
        .sr-highlight { background: rgba(176,125,79,0.12); border-radius: 2px; padding: 0 1px; color: var(--ink-700); }
        .sr-path {
          font-family: var(--mono); font-size: 10px; color: var(--ink-300);
          margin-top: 4px; display: flex; align-items: center; gap: 4px;
        }
        .sr-path-sep { color: var(--warm-300); }

        /* ── Preview panel ── */
        .sr-preview-panel {
          width: 360px; flex-shrink: 0; overflow-y: auto;
          padding: 24px; background: var(--warm-50);
          display: flex; flex-direction: column;
        }
        .sr-preview-panel::-webkit-scrollbar { width: 4px; }
        .sr-preview-panel::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }

        .srp-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; color: var(--ink-300);
        }
        .srp-empty-icon { font-size: 28px; margin-bottom: 8px; opacity: 0.3; }
        .srp-empty-text { font-size: 13px; }

        .srp-header { margin-bottom: 20px; }
        .srp-type {
          font-family: var(--mono); font-size: 9px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 8px; display: flex; align-items: center; gap: 6px;
        }
        .srp-type-dot { width: 6px; height: 6px; border-radius: 2px; }
        .srp-title {
          font-family: 'Cormorant Garamond', serif; font-size: 24px;
          font-weight: 600; color: var(--ink-900); line-height: 1.2;
          margin-bottom: 4px;
        }
        .srp-subtitle { font-size: 14px; color: var(--ink-400); }

        .srp-section {
          font-family: var(--mono); font-size: 9px; color: var(--ink-400);
          text-transform: uppercase; letter-spacing: 0.1em; margin: 16px 0 8px;
          display: flex; align-items: center; gap: 8px;
        }
        .srp-section::after { content: ''; flex: 1; height: 1px; background: var(--warm-200); }

        .srp-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 5px 0; border-bottom: 1px solid var(--warm-100);
        }
        .srp-row:last-child { border-bottom: none; }
        .srp-label { font-size: 12.5px; color: var(--ink-400); }
        .srp-val { font-family: var(--mono); font-size: 12.5px; color: var(--ink-700); font-weight: 500; }
        .srp-val.green { color: #5a9a3c; }
        .srp-val.ember { color: var(--ember); }
        .srp-val.red { color: #c24b38; }

        .srp-content {
          padding: 14px 16px; background: var(--parchment);
          border: 1px solid var(--warm-200); border-radius: 8px;
          font-size: 13.5px; color: var(--ink-600); line-height: 1.65;
          font-family: 'Cormorant Garamond', serif; font-size: 15px;
        }

        .srp-path {
          font-family: var(--mono); font-size: 10px; color: var(--ink-300);
          margin-top: 12px; display: flex; align-items: center; gap: 4px;
        }

        .srp-actions { margin-top: 16px; display: flex; gap: 6px; }
        .srp-btn {
          flex: 1; padding: 9px; border-radius: 6px; font-size: 12.5px;
          font-weight: 500; font-family: inherit; cursor: pointer;
          text-align: center; transition: all 0.1s;
        }
        .srp-btn-primary { background: var(--ember); border: none; color: #fff; }
        .srp-btn-primary:hover { background: var(--ember-light); }
        .srp-btn-ghost { background: none; border: 1px solid var(--warm-200); color: var(--ink-600); }
        .srp-btn-ghost:hover { background: var(--warm-100); }

        /* ── Recent searches ── */
        .sr-recent { padding: 16px 20px; }
        .sr-recent-label {
          font-family: var(--mono); font-size: 9px; color: var(--ink-400);
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;
        }
        .sr-recent-item {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 8px; border-radius: 5px; cursor: pointer;
          transition: background 0.06s; margin: 0 -8px;
        }
        .sr-recent-item:hover { background: var(--warm-100); }
        .sr-recent-icon { color: var(--ink-300); font-size: 12px; flex-shrink: 0; }
        .sr-recent-text { font-size: 13px; color: var(--ink-500); }

        /* ── No results ── */
        .sr-no-results {
          padding: 48px 20px; text-align: center;
          color: var(--ink-300);
        }
        .sr-no-icon { font-size: 24px; opacity: 0.3; margin-bottom: 8px; }
        .sr-no-text { font-size: 14px; font-weight: 500; color: var(--ink-500); margin-bottom: 4px; }
        .sr-no-sub { font-size: 12.5px; }

        /* ── Footer ── */
        .search-footer {
          padding: 8px 32px; border-top: 1px solid var(--warm-200);
          display: flex; align-items: center; justify-content: space-between;
          font-family: var(--mono); font-size: 10px; color: var(--ink-300);
          flex-shrink: 0; background: var(--parchment);
        }
        .sf-hints { display: flex; gap: 12px; }
        .sf-hint { display: flex; align-items: center; gap: 4px; }
        .sf-kbd {
          font-size: 9px; background: var(--warm-100); border: 1px solid var(--warm-200);
          border-radius: 3px; padding: 1px 5px;
        }
      `}</style>

      <div className="search-page">
        {/* ── Search input ── */}
        <div className="sh">
          <div className={`sh-input-row${true ? " focused" : ""}`}>
            <span className="sh-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M13.5 13.5L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </span>
            <input ref={inputRef} className="sh-input" placeholder="Search everything..."
              value={query} onChange={e => { setQuery(e.target.value); setShowRecent(false); }}
              onKeyDown={handleKeyDown} autoComplete="off" spellCheck={false} />
            {query && (
              <button className="sh-clear" onClick={() => { setQuery(""); setShowRecent(true); inputRef.current?.focus(); }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </button>
            )}
            <div className="sh-hints">
              <span className="sh-kbd">esc</span>
              <span style={{ color: "var(--warm-300)" }}>close</span>
            </div>
          </div>

          {/* Category tabs */}
          <div className="sh-cats">
            {CATEGORIES.map(cat => {
              const count = cat.id === "all" ? filtered.length : RESULTS.filter(r => r.type === cat.id).filter(r => !query || [r.title, r.subtitle, r.preview].join(" ").toLowerCase().includes(query.toLowerCase())).length;
              return (
                <button key={cat.id} className={`sh-cat${category === cat.id ? " on" : ""}`}
                  onClick={() => setCategory(cat.id)}>
                  {cat.icon && <span className="sh-cat-icon">{cat.icon}</span>}
                  {cat.label}
                  <span className="sh-cat-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="search-content">
          {/* Results */}
          <div className="sr-list" ref={resultsRef}>
            {/* Recent searches (when empty) */}
            {!query && showRecent && category === "all" && (
              <div className="sr-recent">
                <div className="sr-recent-label">recent searches</div>
                {RECENT_SEARCHES.map((s, i) => (
                  <div key={i} className="sr-recent-item" onClick={() => { setQuery(s); setShowRecent(false); }}>
                    <span className="sr-recent-icon">↻</span>
                    <span className="sr-recent-text">{s}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Grouped results */}
            {filtered.length > 0 ? (
              groups.map(group => (
                <div key={group.type}>
                  <div className="sr-group-label">{getCategoryLabel(group.type)}</div>
                  {group.items.map(r => {
                    globalIdx++;
                    const isOn = globalIdx === selectedIdx;
                    const thisIdx = globalIdx;
                    const hasAvatar = r.avatar;

                    // Highlight matching text
                    const highlightText = (text) => {
                      if (!query || !text) return text;
                      const idx = text.toLowerCase().indexOf(query.toLowerCase());
                      if (idx === -1) return text;
                      return <>{text.slice(0, idx)}<span className="sr-highlight">{text.slice(idx, idx + query.length)}</span>{text.slice(idx + query.length)}</>;
                    };

                    return (
                      <div key={r.id} className={`sr-item${isOn ? " on" : ""}`}
                        onClick={() => setSelectedIdx(thisIdx)}
                        onMouseEnter={() => setSelectedIdx(thisIdx)}>
                        {hasAvatar ? (
                          <div className="sr-icon avatar" style={{ background: r.avatarBg }}>{r.avatar}</div>
                        ) : (
                          <div className="sr-icon symbol" style={{ color: r.color, background: r.color + "08", borderColor: r.color + "18" }}>{r.icon}</div>
                        )}
                        <div className="sr-body">
                          <div className="sr-title-row">
                            <span className="sr-title">{highlightText(r.title)}</span>
                            <span className="sr-meta">{r.meta}</span>
                          </div>
                          {r.subtitle && <div className="sr-subtitle">{highlightText(r.subtitle)}</div>}
                          <div className="sr-preview">{highlightText(r.preview)}</div>
                          <div className="sr-path">
                            {r.path.split(" / ").map((seg, si, arr) => (
                              <span key={si}>
                                {seg}{si < arr.length - 1 && <span className="sr-path-sep"> / </span>}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : query ? (
              <div className="sr-no-results">
                <div className="sr-no-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M21 21l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <div className="sr-no-text">No results for "{query}"</div>
                <div className="sr-no-sub">Try a different search term or category</div>
              </div>
            ) : null}
          </div>

          {/* ── Preview panel ── */}
          <div className="sr-preview-panel">
            {selected ? (
              <>
                <div className="srp-header">
                  <div className="srp-type" style={{ color: selected.color }}>
                    <span className="srp-type-dot" style={{ background: selected.color }} />
                    {getCategoryLabel(selected.type)}
                  </div>
                  <div className="srp-title">{selected.title}</div>
                  {selected.subtitle && <div className="srp-subtitle">{selected.subtitle}</div>}
                </div>

                <div className="srp-section">details</div>
                {selected.meta && <div className="srp-row"><span className="srp-label">Status</span><span className={`srp-val${selected.meta.includes("Overdue") ? " red" : selected.meta.includes("Active") ? " green" : selected.meta.includes("Paid") ? " green" : " ember"}`}>{selected.meta}</span></div>}
                {selected.lastEdited && <div className="srp-row"><span className="srp-label">Last activity</span><span className="srp-val">{selected.lastEdited}</span></div>}
                {selected.contact && <div className="srp-row"><span className="srp-label">Contact</span><span className="srp-val">{selected.contact}</span></div>}

                <div className="srp-section">preview</div>
                <div className="srp-content">{selected.preview}</div>

                <div className="srp-path" style={{ marginTop: 14 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8V2h4l2 2v4H2z" stroke="currentColor" strokeWidth="0.8"/></svg>
                  {selected.path}
                </div>

                <div className="srp-actions">
                  <button className="srp-btn srp-btn-primary">Open</button>
                  <button className="srp-btn srp-btn-ghost">Copy Link</button>
                </div>
              </>
            ) : (
              <div className="srp-empty">
                <div className="srp-empty-icon">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.2"/><path d="M24 24l8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                </div>
                <div className="srp-empty-text">Select a result to preview</div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="search-footer">
          <div className="sf-hints">
            <div className="sf-hint"><span className="sf-kbd">↑↓</span> navigate</div>
            <div className="sf-hint"><span className="sf-kbd">⏎</span> open</div>
            <div className="sf-hint"><span className="sf-kbd">tab</span> switch category</div>
            <div className="sf-hint"><span className="sf-kbd">esc</span> close</div>
          </div>
          <span>{filtered.length} results</span>
        </div>
      </div>
    </>
  );
}
