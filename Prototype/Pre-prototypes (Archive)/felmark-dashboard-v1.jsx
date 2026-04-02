import { useState, useRef, useEffect, useCallback } from "react";

const uid = () => Math.random().toString(36).slice(2, 10);

const BLOCK_TYPES = [
  { type: "paragraph", label: "Text", icon: "T", desc: "Plain text", section: "Basic", shortcut: "⏎" },
  { type: "h1", label: "Heading 1", icon: "H1", desc: "Large heading", section: "Basic", shortcut: "#" },
  { type: "h2", label: "Heading 2", icon: "H2", desc: "Medium heading", section: "Basic", shortcut: "##" },
  { type: "h3", label: "Heading 3", icon: "H3", desc: "Small heading", section: "Basic", shortcut: "###" },
  { type: "bullet", label: "Bullet list", icon: "•", desc: "Unordered list", section: "Basic", shortcut: "-" },
  { type: "numbered", label: "Numbered list", icon: "1.", desc: "Ordered list", section: "Basic", shortcut: "1." },
  { type: "todo", label: "To-do", icon: "☐", desc: "Checkbox", section: "Basic", shortcut: "[]" },
  { type: "quote", label: "Quote", icon: "❝", desc: "Block quote", section: "Blocks", shortcut: ">" },
  { type: "code", label: "Code", icon: "<>", desc: "Code block", section: "Blocks", shortcut: "```" },
  { type: "callout", label: "Callout", icon: "!", desc: "Callout box", section: "Blocks", shortcut: "!" },
  { type: "divider", label: "Divider", icon: "—", desc: "Horizontal rule", section: "Blocks", shortcut: "---" },
];

const COMMANDS = [
  { id: "new-project", label: "New Project", section: "Create", shortcut: "⌘N", icon: "+" },
  { id: "new-proposal", label: "New Proposal", section: "Create", shortcut: "⌘⇧P", icon: "◆" },
  { id: "new-invoice", label: "New Invoice", section: "Create", shortcut: "⌘⇧I", icon: "$" },
  { id: "search", label: "Search Notes", section: "Navigate", shortcut: "⌘F", icon: "⌕" },
  { id: "switch-ws", label: "Switch Workspace", section: "Navigate", shortcut: "⌘J", icon: "⇄" },
  { id: "recent", label: "Recent Files", section: "Navigate", shortcut: "⌘E", icon: "↺" },
  { id: "export-pdf", label: "Export as PDF", section: "Actions", shortcut: "⌘⇧E", icon: "↓" },
  { id: "share", label: "Share with Client", section: "Actions", shortcut: "⌘⇧S", icon: "→" },
  { id: "duplicate", label: "Duplicate Block", section: "Actions", shortcut: "⌘D", icon: "⊞" },
];

const STATUS = {
  active: { color: "#5a9a3c", label: "Active" },
  review: { color: "#b07d4f", label: "In Review" },
  completed: { color: "#8993a1", label: "Completed" },
  paused: { color: "#9e9e93", label: "Paused" },
  overdue: { color: "#c24b38", label: "Overdue" },
};

const WORKSPACES = [
  { id: "w1", client: "Meridian Studio", avatar: "M", avatarBg: "#7c8594", open: true, projects: [
    { id: "p1", name: "Brand Guidelines v2", status: "active", due: "Apr 3", amount: "$2,400" },
    { id: "p2", name: "Website Copy", status: "review", due: "Apr 8", amount: "$1,800" },
    { id: "p3", name: "Social Media Kit", status: "completed", due: "Mar 20", amount: "$950" },
  ]},
  { id: "w2", client: "Nora Kim — Coach", avatar: "N", avatarBg: "#a08472", open: false, projects: [
    { id: "p4", name: "Course Landing Page", status: "active", due: "Apr 12", amount: "$3,200" },
    { id: "p5", name: "Email Sequence (6x)", status: "paused", due: "Apr 20", amount: "$1,600" },
  ]},
  { id: "w3", client: "Bolt Fitness", avatar: "B", avatarBg: "#8a7e63", open: false, projects: [
    { id: "p6", name: "App Onboarding UX", status: "overdue", due: "Mar 25", amount: "$4,000" },
    { id: "p7", name: "Monthly Blog Posts", status: "active", due: "Apr 1", amount: "$800" },
  ]},
  { id: "w4", client: "Personal", avatar: "✦", avatarBg: "#5c5c53", open: false, projects: [
    { id: "p8", name: "Portfolio Updates", status: "active", due: "—", amount: "—" },
    { id: "p9", name: "Invoice Template", status: "completed", due: "—", amount: "—" },
  ]},
];

const INITIAL_TABS = [{ id: "p1", name: "Brand Guidelines v2", client: "Meridian Studio", active: true }];

/* ═══ EditableBlock ═══ */
function EditableBlock({ block, onContentChange, onEnter, onBackspace, onSlash, onSelect, registerRef }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current && registerRef) registerRef(block.id, ref.current); }, [block.id, registerRef]);
  useEffect(() => { if (ref.current && block.content && ref.current.innerHTML !== block.content) ref.current.innerHTML = block.content; }, []);

  const ph = { h1: "Heading 1", h2: "Heading 2", h3: "Heading 3", code: "// code", quote: "Quote", paragraph: "Type '/' for commands, ⌘K for palette", bullet: "List", numbered: "List", todo: "To-do", callout: "Type here…" };
  const styles = {
    h1: { fontSize: "1.75em", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.02em", marginTop: 28, fontFamily: "'Cormorant Garamond', serif", color: "var(--ink-900)" },
    h2: { fontSize: "1.35em", fontWeight: 600, lineHeight: 1.3, marginTop: 20, fontFamily: "'Cormorant Garamond', serif", color: "var(--ink-900)" },
    h3: { fontSize: "1.12em", fontWeight: 600, lineHeight: 1.35, marginTop: 14, fontFamily: "'Cormorant Garamond', serif", color: "var(--ink-900)" },
    paragraph: { lineHeight: 1.65, color: "var(--ink-700)" },
    bullet: { lineHeight: 1.65, color: "var(--ink-700)" }, numbered: { lineHeight: 1.65, color: "var(--ink-700)" },
    todo: { lineHeight: 1.65, color: "var(--ink-700)" }, quote: { lineHeight: 1.65, color: "var(--ink-500)" },
    callout: { lineHeight: 1.65, color: "var(--ink-700)" },
    code: { fontFamily: "var(--mono)", fontSize: "0.84em", background: "var(--warm-100)", border: "1px solid var(--warm-200)", borderRadius: 5, padding: "14px 16px", lineHeight: 1.65, whiteSpace: "pre-wrap", tabSize: 2, color: "var(--ink-700)" },
  };

  const handleInput = () => {
    if (!ref.current) return;
    const text = ref.current.textContent; const html = ref.current.innerHTML;
    onContentChange(block.id, html, text);
    if (text === "/") onSlash(block.id);
    else if (text.startsWith("/")) onSlash(block.id, text.slice(1));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && block.type !== "code") {
      e.preventDefault(); if (!ref.current) return;
      const sel = window.getSelection(); const range = sel.getRangeAt(0);
      const bR = document.createRange(); bR.setStart(ref.current, 0); bR.setEnd(range.startContainer, range.startOffset);
      const bD = document.createElement("div"); bD.appendChild(bR.cloneContents());
      const aR = document.createRange(); aR.setStart(range.endContainer, range.endOffset); aR.setEnd(ref.current, ref.current.childNodes.length);
      const aD = document.createElement("div"); aD.appendChild(aR.cloneContents());
      ref.current.innerHTML = bD.innerHTML;
      onEnter(block.id, bD.innerHTML, aD.innerHTML);
    }
    if (e.key === "Backspace" && ref.current) {
      const sel = window.getSelection();
      if (sel.isCollapsed) { const range = sel.getRangeAt(0); const tR = document.createRange(); tR.setStart(ref.current, 0); tR.setEnd(range.startContainer, range.startOffset); if (tR.toString().length === 0 && ref.current.textContent.length === 0) { e.preventDefault(); onBackspace(block.id); } }
    }
    if (e.key === "Tab") { e.preventDefault(); document.execCommand("insertText", false, "  "); }
  };

  return <div ref={ref} contentEditable suppressContentEditableWarning data-placeholder={ph[block.type] || "Type '/' for commands"} style={{ outline: "none", width: "100%", ...styles[block.type], ...(block.type === "todo" && block.checked ? { textDecoration: "line-through", opacity: 0.35 } : {}) }} onInput={handleInput} onKeyDown={handleKeyDown} onMouseUp={onSelect} spellCheck />;
}

/* ═══ Main ═══ */
export default function FelmarkDashboard() {
  const [workspaces, setWorkspaces] = useState(WORKSPACES);
  const [blocks, setBlocks] = useState([
    { id: uid(), type: "h1", content: "Brand Guidelines v2", checked: false },
    { id: uid(), type: "callout", content: "Client: Meridian Studio — Due Apr 3 — Budget: $2,400", checked: false },
    { id: uid(), type: "h2", content: "Deliverables", checked: false },
    { id: uid(), type: "todo", content: "Primary & secondary logo usage rules", checked: true },
    { id: uid(), type: "todo", content: "Color palette with hex/RGB/CMYK values", checked: true },
    { id: uid(), type: "todo", content: "Typography scale & font pairings", checked: false },
    { id: uid(), type: "todo", content: "Imagery & photography direction", checked: false },
    { id: uid(), type: "todo", content: "Social media templates (IG, LinkedIn)", checked: false },
    { id: uid(), type: "divider", content: "", checked: false },
    { id: uid(), type: "h2", content: "Notes", checked: false },
    { id: uid(), type: "paragraph", content: "", checked: false },
  ]);
  const [tabs, setTabs] = useState(INITIAL_TABS);
  const [activeProject, setActiveProject] = useState("p1");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoverBlock, setHoverBlock] = useState(null);
  const [focusedBlock, setFocusedBlock] = useState(null);
  const [slashMenu, setSlashMenu] = useState(null);
  const [slashFilter, setSlashFilter] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const [formatBar, setFormatBar] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [dragId, setDragId] = useState(null);
  const [dropId, setDropId] = useState(null);
  const [railActive, setRailActive] = useState("workspaces");
  const [cmdPalette, setCmdPalette] = useState(false);
  const [cmdFilter, setCmdFilter] = useState("");
  const [cmdIndex, setCmdIndex] = useState(0);
  const [cmdBarValue, setCmdBarValue] = useState("");
  const [cmdBarFocused, setCmdBarFocused] = useState(false);

  const blockElMap = useRef({}); const editorRef = useRef(null); const contentCache = useRef({});
  const cmdInputRef = useRef(null); const cmdBarRef = useRef(null);

  const registerRef = useCallback((id, el) => { blockElMap.current[id] = el; }, []);

  useEffect(() => {
    let t = ""; blocks.forEach(b => { const c = contentCache.current[b.id] || b.content || ""; const d = document.createElement("div"); d.innerHTML = c; t += " " + d.textContent; });
    const w = t.trim(); setWordCount(w.split(/\s+/).filter(x => x).length); setCharCount(w.length);
  }, [blocks]);

  // ⌘K listener
  useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdPalette(p => !p); setCmdFilter(""); setCmdIndex(0); } if (e.key === "Escape") setCmdPalette(false); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);

  // Command palette filter
  const filteredCmds = COMMANDS.filter(c => c.label.toLowerCase().includes(cmdFilter.toLowerCase()));
  useEffect(() => { if (cmdPalette && cmdInputRef.current) cmdInputRef.current.focus(); }, [cmdPalette]);

  const cursorTo = (el, end) => { setTimeout(() => { el.focus(); const r = document.createRange(); if (end) { r.selectNodeContents(el); r.collapse(false); } else { r.setStart(el, 0); r.collapse(true); } const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }, 0); };
  const onContentChange = useCallback((id, html) => { contentCache.current[id] = html; }, []);
  const onEnter = useCallback((id, bH, aH) => { contentCache.current[id] = bH; const nid = uid(); contentCache.current[nid] = aH; setBlocks(prev => { const idx = prev.findIndex(b => b.id === id); const bl = prev[idx]; const carry = ["bullet","numbered","todo"].includes(bl.type) ? bl.type : "paragraph"; const n = [...prev]; n[idx] = { ...bl, content: bH }; n.splice(idx+1, 0, { id: nid, type: carry, content: aH, checked: false }); return n; }); setTimeout(() => { const el = blockElMap.current[nid]; if (el) { el.innerHTML = aH; cursorTo(el, false); } }, 20); }, []);
  const onBackspace = useCallback((id) => { setBlocks(prev => { if (prev.length <= 1) return prev; const idx = prev.findIndex(b => b.id === id); const n = prev.filter(b => b.id !== id); delete contentCache.current[id]; setTimeout(() => { const el = blockElMap.current[n[Math.max(0, idx-1)].id]; if (el) cursorTo(el, true); }, 20); return n; }); }, []);
  const onSlash = useCallback((blockId, filter) => { const el = blockElMap.current[blockId]; if (!el || !editorRef.current) return; const rect = el.getBoundingClientRect(); const sr = editorRef.current.getBoundingClientRect(); setSlashMenu({ blockId, top: rect.bottom - sr.top + editorRef.current.scrollTop + 4, left: rect.left - sr.left }); setSlashFilter(filter || ""); setSlashIndex(0); }, []);

  const filteredTypes = BLOCK_TYPES.filter(t => t.label.toLowerCase().includes(slashFilter.toLowerCase()));
  const selectSlashItem = (type) => { if (!slashMenu) return; const { blockId } = slashMenu; const el = blockElMap.current[blockId]; if (el) el.textContent = ""; contentCache.current[blockId] = ""; if (type === "divider") { setBlocks(prev => { const idx = prev.findIndex(b => b.id === blockId); const n = [...prev]; n[idx] = { ...n[idx], type: "divider", content: "" }; const nid = uid(); contentCache.current[nid] = ""; n.splice(idx+1, 0, { id: nid, type: "paragraph", content: "", checked: false }); setTimeout(() => { const ne = blockElMap.current[nid]; if (ne) cursorTo(ne, false); }, 20); return n; }); } else { setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, type, content: "" } : b)); setTimeout(() => { if (el) cursorTo(el, false); }, 20); } setSlashMenu(null); };

  useEffect(() => { if (!slashMenu) return; const h = (e) => { if (e.key === "ArrowDown") { e.preventDefault(); setSlashIndex(i => Math.min(i+1, filteredTypes.length-1)); } else if (e.key === "ArrowUp") { e.preventDefault(); setSlashIndex(i => Math.max(i-1, 0)); } else if (e.key === "Enter") { e.preventDefault(); if (filteredTypes[slashIndex]) selectSlashItem(filteredTypes[slashIndex].type); } else if (e.key === "Escape") setSlashMenu(null); }; window.addEventListener("keydown", h, true); return () => window.removeEventListener("keydown", h, true); }, [slashMenu, slashIndex, filteredTypes]);
  useEffect(() => { if (!slashMenu) return; const h = (e) => { if (!e.target.closest(".slash-menu")) setSlashMenu(null); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, [slashMenu]);

  const handleSelect = () => { const sel = window.getSelection(); if (!sel || sel.isCollapsed || !sel.toString().trim() || !editorRef.current) { setFormatBar(null); return; } const rect = sel.getRangeAt(0).getBoundingClientRect(); const sr = editorRef.current.getBoundingClientRect(); setFormatBar({ top: rect.top - sr.top + editorRef.current.scrollTop - 42, left: rect.left - sr.left + rect.width / 2 - 90 }); };
  const addBlockAfter = (afterId) => { const nid = uid(); contentCache.current[nid] = ""; setBlocks(prev => { const idx = prev.findIndex(b => b.id === afterId); const n = [...prev]; n.splice(idx+1, 0, { id: nid, type: "paragraph", content: "", checked: false }); return n; }); setTimeout(() => { const el = blockElMap.current[nid]; if (el) cursorTo(el, false); }, 20); };
  const getNum = (bid) => { let c = 0; for (const b of blocks) { if (b.type === "numbered") c++; if (b.id === bid) return c; } return 1; };
  const selectProject = (project, client) => { setActiveProject(project.id); if (!tabs.find(t => t.id === project.id)) setTabs(prev => [...prev.map(t => ({ ...t, active: false })), { id: project.id, name: project.name, client, active: true }]); else setTabs(prev => prev.map(t => ({ ...t, active: t.id === project.id }))); };
  const closeTab = (e, id) => { e.stopPropagation(); setTabs(prev => { const n = prev.filter(t => t.id !== id); if (n.length && !n.some(t => t.active)) n[n.length-1].active = true; return n; }); };
  const toggleWorkspace = (wid) => setWorkspaces(prev => prev.map(w => w.id === wid ? { ...w, open: !w.open } : w));

  const activeTab = tabs.find(t => t.active);
  const activeWs = workspaces.find(w => w.projects.some(p => p.id === activeProject));
  const totalEarnings = workspaces.reduce((s, w) => s + w.projects.reduce((a, p) => { const m = p.amount.match(/[\d,]+/); return a + (m ? parseInt(m[0].replace(",","")) : 0); }, 0), 0);
  const activeCount = workspaces.reduce((s, w) => s + w.projects.filter(p => p.status === "active").length, 0);
  const overdueCount = workspaces.reduce((s, w) => s + w.projects.filter(p => p.status === "overdue").length, 0);

  const renderBlock = (block) => {
    const isHovered = hoverBlock === block.id;
    const isFocused = focusedBlock === block.id;
    if (block.type === "divider") {
      return (<div key={block.id} className="brow" onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
        <div className="bgut" style={{ opacity: isHovered ? 1 : 0 }}>
          <button className="gb" onClick={() => addBlockAfter(block.id)}><svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>
          <div className="gb grip"><svg width="10" height="14" viewBox="0 0 10 14"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="7" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="3" cy="11.5" r="1" fill="currentColor"/><circle cx="7" cy="11.5" r="1" fill="currentColor"/></svg></div>
        </div>
        <div style={{ flex: 1, padding: "6px 0" }}><div style={{ height: 1, background: "var(--warm-200)" }} /></div>
      </div>);
    }
    const isH = block.type.startsWith("h");
    return (
      <div key={block.id} className={`brow${dropId === block.id ? " drop" : ""}${isFocused ? " focused" : ""}`} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
        <div className="bgut" style={{ opacity: isHovered ? 1 : 0, marginTop: isH ? (block.type === "h1" ? 32 : block.type === "h2" ? 24 : 18) : 2 }}>
          <button className="gb" onClick={() => addBlockAfter(block.id)}><svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>
          <div className="gb grip" draggable onDragStart={e => { setDragId(block.id); e.dataTransfer.effectAllowed = "move"; }} onDragEnd={() => { setDragId(null); setDropId(null); }}>
            <svg width="10" height="14" viewBox="0 0 10 14"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="7" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="3" cy="11.5" r="1" fill="currentColor"/><circle cx="7" cy="11.5" r="1" fill="currentColor"/></svg>
          </div>
        </div>

        {/* Block accent line */}
        <div className={`block-accent${isFocused ? " active" : ""}`} />

        <div style={{ display: "flex", alignItems: "flex-start", flex: 1 }}
          onDragOver={e => { e.preventDefault(); if (dragId && dragId !== block.id) setDropId(block.id); }}
          onDrop={e => { e.preventDefault(); if (!dragId || dragId === block.id) return; setBlocks(prev => { const fi = prev.findIndex(b => b.id === dragId); const ti = prev.findIndex(b => b.id === block.id); const n = [...prev]; const [m] = n.splice(fi,1); n.splice(ti,0,m); return n; }); setDragId(null); setDropId(null); }}>
          {block.type === "bullet" && <span className="prefix">•</span>}
          {block.type === "numbered" && <span className="prefix num">{getNum(block.id)}.</span>}
          {block.type === "todo" && <label className="prefix todo-check"><input type="checkbox" checked={block.checked} onChange={() => setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, checked: !b.checked } : b))} /></label>}
          <div style={{ flex: 1,
            ...(block.type === "callout" ? { display: "flex", gap: 8, background: "rgba(176,125,79,0.04)", borderRadius: 5, padding: "10px 14px", border: "1px solid rgba(176,125,79,0.08)" } : {}),
            ...(block.type === "quote" ? { borderLeft: "2px solid var(--warm-300)", paddingLeft: 16 } : {}) }}>
            {block.type === "callout" && <span style={{ fontSize: 15, flexShrink: 0, marginTop: 2, color: "var(--ember)" }}>◆</span>}
            <EditableBlock block={block} onContentChange={onContentChange} onEnter={onEnter} onBackspace={onBackspace} onSlash={onSlash} onSelect={handleSelect} registerRef={registerRef} />
          </div>

          {/* Block type label on hover */}
          {isHovered && <span className="block-type-label">{block.type}</span>}
        </div>
      </div>
    );
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --parchment: #faf9f7; --warm-50: #f7f6f3; --warm-100: #f0eee9;
          --warm-200: #e5e2db; --warm-300: #d5d1c8; --warm-400: #b8b3a8; --warm-500: #9a958a;
          --ink-900: #2c2a25; --ink-800: #3d3a33; --ink-700: #4f4c44; --ink-600: #65625a;
          --ink-500: #7d7a72; --ink-400: #9b988f; --ink-300: #b5b2a9;
          --ember: #b07d4f; --ember-light: #c89360; --ember-bg: rgba(176,125,79,0.08);
          --rail-bg: #353330; --rail-icon: #8a867e; --rail-icon-active: #c8c4bb;
          --panel: #f2f1ed; --panel-hover: #eceae5; --panel-active: #e6e4de; --panel-border: rgba(0,0,0,0.05);
          --mono: 'JetBrains Mono', 'Fira Code', monospace;
        }

        .app { display: flex; height: 100vh; font-family: 'Outfit', sans-serif; font-size: 15px; color: var(--ink-700); background: var(--parchment); }

        /* ── Rail ── */
        .rail { width: 48px; background: var(--rail-bg); display: flex; flex-direction: column; align-items: center; padding: 10px 0; gap: 2px; flex-shrink: 0; }
        .rb { width: 36px; height: 36px; border-radius: 6px; border: none; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--rail-icon); transition: all 0.1s; position: relative; }
        .rb:hover { background: rgba(255,255,255,0.06); color: var(--rail-icon-active); }
        .rb.on { background: rgba(255,255,255,0.08); color: var(--rail-icon-active); }
        .rb .badge { position: absolute; top: 5px; right: 5px; width: 7px; height: 7px; border-radius: 50%; background: #c24b38; border: 2px solid var(--rail-bg); }
        .rsep { width: 20px; height: 1px; background: rgba(255,255,255,0.06); margin: 6px 0; }

        /* ── Sidebar ── */
        .sb { width: 260px; min-width: 260px; background: var(--panel); display: flex; flex-direction: column; transition: width 0.15s, min-width 0.15s; overflow: hidden; border-right: 1px solid var(--panel-border); }
        .sb.closed { width: 0; min-width: 0; }
        .sb-inner { width: 260px; display: flex; flex-direction: column; height: 100%; }
        .sb-head { padding: 14px 16px 10px; display: flex; align-items: center; justify-content: space-between; }
        .sb-title { font-size: 10px; font-weight: 600; color: var(--ink-400); letter-spacing: 0.14em; text-transform: uppercase; font-family: var(--mono); }
        .sb-close { background: none; border: none; cursor: pointer; color: var(--ink-400); display: flex; padding: 3px; border-radius: 4px; }
        .sb-close:hover { color: var(--ink-600); background: rgba(0,0,0,0.04); }

        .stats { display: flex; gap: 6px; padding: 0 12px 12px; }
        .stat { flex: 1; background: var(--parchment); border: 1px solid var(--warm-200); border-radius: 6px; padding: 8px 10px; }
        .stat-val { font-size: 14px; font-weight: 500; color: var(--ink-800); font-family: var(--mono); }
        .stat-lab { font-size: 9px; color: var(--ink-400); margin-top: 2px; font-family: var(--mono); letter-spacing: 0.04em; text-transform: uppercase; }

        .sb-scroll { flex: 1; overflow-y: auto; padding-bottom: 8px; }
        .sb-scroll::-webkit-scrollbar { width: 3px; } .sb-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }

        .ws-head { display: flex; align-items: center; gap: 8px; padding: 6px 12px; cursor: pointer; transition: background 0.06s; margin: 2px 6px; border-radius: 5px; }
        .ws-head:hover { background: var(--panel-hover); }
        .ws-avatar { width: 22px; height: 22px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #fff; flex-shrink: 0; }
        .ws-name { font-size: 13px; font-weight: 500; color: var(--ink-800); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ws-arrow { color: var(--ink-400); flex-shrink: 0; transition: transform 0.12s; font-size: 9px; }
        .ws-count { font-size: 10px; color: var(--ink-400); background: var(--warm-200); padding: 1px 6px; border-radius: 8px; flex-shrink: 0; font-family: var(--mono); }

        .pj { display: flex; align-items: center; gap: 8px; padding: 5px 12px 5px 42px; cursor: pointer; transition: background 0.06s; margin: 0 6px; border-radius: 4px; }
        .pj:hover { background: var(--panel-hover); }
        .pj.on { background: var(--panel-active); }
        .pj-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .pj-name { font-size: 13px; color: var(--ink-600); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pj.on .pj-name { color: var(--ink-900); font-weight: 500; }
        .pj-due { font-size: 10px; color: var(--ink-400); flex-shrink: 0; font-family: var(--mono); }

        .sb-footer { padding: 10px 14px; border-top: 1px solid var(--panel-border); display: flex; justify-content: space-between; font-size: 10px; color: var(--ink-400); font-family: var(--mono); }

        /* ── Main ── */
        .main { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; }

        .tabbar { height: 38px; background: var(--warm-50); border-bottom: 1px solid var(--warm-200); display: flex; align-items: stretch; overflow-x: auto; flex-shrink: 0; }
        .tabbar::-webkit-scrollbar { display: none; }
        .tab { display: flex; align-items: center; gap: 6px; padding: 0 14px; font-size: 12.5px; color: var(--ink-400); cursor: pointer; border-right: 1px solid var(--warm-200); white-space: nowrap; position: relative; }
        .tab:hover { background: var(--warm-100); }
        .tab.on { background: var(--parchment); color: var(--ink-800); }
        .tab.on::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:2px; background: var(--ember); }
        .tab-close { background: none; border: none; cursor: pointer; color: var(--ink-300); font-size: 14px; line-height: 1; padding: 2px; border-radius: 3px; display: flex; align-items: center; }
        .tab-close:hover { background: rgba(0,0,0,0.05); color: var(--ink-600); }

        .bread { height: 34px; padding: 0 20px; display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-400); border-bottom: 1px solid var(--warm-100); flex-shrink: 0; font-family: var(--mono); }
        .bread-nav { background: none; border: none; cursor: pointer; color: var(--ink-300); display: flex; align-items: center; padding: 2px; border-radius: 3px; }
        .bread-nav:hover { color: var(--ink-500); background: rgba(0,0,0,0.03); }
        .bread-sep { color: var(--warm-300); }
        .bread-active { color: var(--ink-700); font-weight: 500; }
        .bread-status { font-size: 9px; font-weight: 500; padding: 2px 7px; border-radius: 2px; margin-left: 6px; letter-spacing: 0.04em; text-transform: uppercase; font-family: var(--mono); }

        .editor { flex: 1; overflow-y: auto; position: relative; background: var(--parchment); }
        .editor::-webkit-scrollbar { width: 5px; } .editor::-webkit-scrollbar-track { background: transparent; }
        .editor::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }
        .page { max-width: 700px; margin: 0 auto; padding: 36px 48px 40vh; width: 100%; }

        /* ── Block rows ── */
        .brow { display: flex; align-items: flex-start; position: relative; width: 100%; padding: 1px 0; border-radius: 3px; }
        .brow.drop::before { content:''; position:absolute; top:-1px; left:0; right:0; height:2px; background: var(--ember); border-radius:2px; }
        .brow.focused { background: rgba(176,125,79,0.02); }

        .block-accent { width: 2px; border-radius: 1px; align-self: stretch; margin-right: 8px; flex-shrink: 0; background: transparent; transition: background 0.15s; }
        .block-accent.active { background: var(--ember); }

        .block-type-label {
          font-family: var(--mono); font-size: 9px; font-weight: 400;
          color: var(--ink-300); text-transform: uppercase; letter-spacing: 0.06em;
          padding: 2px 6px; border-radius: 3px; background: var(--warm-100);
          align-self: flex-start; margin-top: 4px; flex-shrink: 0; margin-left: 8px;
          border: 1px solid var(--warm-200);
        }

        .bgut { display: flex; align-items: center; flex-shrink: 0; transition: opacity 0.06s; margin-right: 4px; margin-left: -52px; width: 48px; justify-content: flex-end; gap: 1px; }
        .gb { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 3px; cursor: pointer; color: var(--warm-400); background: none; border: none; }
        .gb:hover { background: rgba(0,0,0,0.04); color: var(--ink-500); }
        .grip { cursor: grab; } .grip:active { cursor: grabbing; }
        .prefix { color: var(--ink-300); width: 22px; flex-shrink: 0; padding-top: 2px; text-align: center; font-size: 20px; line-height: 1.6; }
        .prefix.num { font-size: 15px; width: 26px; text-align: right; padding-right: 4px; font-family: var(--mono); }
        .todo-check { padding-top: 4px; flex-shrink: 0; width: 22px; display: flex; justify-content: center; cursor: pointer; }
        .todo-check input { width: 15px; height: 15px; accent-color: var(--ember); cursor: pointer; margin-top: 2px; }

        [contenteditable]:empty:before { content: attr(data-placeholder); color: var(--warm-400); pointer-events: none; }
        [contenteditable]:focus { outline: none; }
        ::selection { background: rgba(176,125,79,0.14); }

        /* ── Slash menu (terminal-style) ── */
        .slash-menu { position: absolute; width: 300px; max-height: 340px; overflow-y: auto; background: #fff; border-radius: 8px; box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 6px 24px rgba(0,0,0,0.08); padding: 4px; z-index: 100; }
        .slash-menu::-webkit-scrollbar { width: 3px; } .slash-menu::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }
        .sl-sec { font-size: 9px; font-weight: 500; color: var(--ink-400); padding: 6px 8px 2px; letter-spacing: 0.08em; text-transform: uppercase; font-family: var(--mono); }
        .sl-it { display: flex; align-items: center; gap: 10px; padding: 5px 8px; border-radius: 5px; cursor: pointer; }
        .sl-it:hover, .sl-it.on { background: var(--ember-bg); }
        .sl-ic { width: 36px; height: 36px; border-radius: 5px; border: 1px solid var(--warm-200); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 500; color: var(--ink-500); flex-shrink: 0; background: var(--warm-50); font-family: var(--mono); }
        .sl-lb { font-size: 13px; color: var(--ink-800); flex: 1; }
        .sl-ds { font-size: 11px; color: var(--ink-400); }
        .sl-shortcut { font-family: var(--mono); font-size: 10px; color: var(--ink-300); background: var(--warm-100); padding: 1px 5px; border-radius: 3px; border: 1px solid var(--warm-200); margin-left: auto; flex-shrink: 0; }

        /* ── Format bar ── */
        .fbar { position: absolute; display: flex; align-items: stretch; background: var(--ink-900); border-radius: 6px; padding: 3px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); z-index: 100; gap: 1px; }
        .fb { background: none; border: none; color: rgba(255,255,255,0.8); width: 28px; height: 28px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; }
        .fb:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .fsep { width: 1px; background: rgba(255,255,255,0.1); margin: 3px 1px; }

        /* ── Command bar (bottom) ── */
        .cmd-bar {
          height: 36px; background: var(--warm-50); border-top: 1px solid var(--warm-200);
          display: flex; align-items: center; padding: 0 16px; gap: 8px; flex-shrink: 0;
        }
        .cmd-prompt { font-family: var(--mono); font-size: 12px; color: var(--ember); font-weight: 500; flex-shrink: 0; }
        .cmd-input {
          flex: 1; background: none; border: none; outline: none;
          font-family: var(--mono); font-size: 12px; color: var(--ink-700);
        }
        .cmd-input::placeholder { color: var(--warm-400); }
        .cmd-hints { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .cmd-hint { font-family: var(--mono); font-size: 10px; color: var(--ink-300); display: flex; align-items: center; gap: 3px; }
        .kbd { font-family: var(--mono); font-size: 9px; font-weight: 500; color: var(--ink-400); background: var(--warm-100); border: 1px solid var(--warm-200); border-radius: 3px; padding: 1px 4px; }

        /* ── Command palette overlay ── */
        .cmd-overlay {
          position: fixed; inset: 0; background: rgba(44,42,37,0.4);
          display: flex; align-items: flex-start; justify-content: center;
          padding-top: 20vh; z-index: 500; backdrop-filter: blur(2px);
        }
        .cmd-modal {
          width: 480px; background: #fff; border-radius: 10px;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.12);
          overflow: hidden;
        }
        .cmd-search-wrap {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 18px; border-bottom: 1px solid var(--warm-200);
        }
        .cmd-search-icon { color: var(--ink-300); flex-shrink: 0; }
        .cmd-search {
          flex: 1; background: none; border: none; outline: none;
          font-family: 'Outfit', sans-serif; font-size: 15px; color: var(--ink-800);
        }
        .cmd-search::placeholder { color: var(--warm-400); }
        .cmd-esc { font-family: var(--mono); font-size: 10px; color: var(--ink-300); background: var(--warm-100); border: 1px solid var(--warm-200); border-radius: 3px; padding: 2px 6px; flex-shrink: 0; }
        .cmd-list { max-height: 320px; overflow-y: auto; padding: 4px; }
        .cmd-list::-webkit-scrollbar { width: 3px; } .cmd-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }
        .cmd-section { font-family: var(--mono); font-size: 9px; font-weight: 500; color: var(--ink-400); padding: 8px 10px 3px; letter-spacing: 0.08em; text-transform: uppercase; }
        .cmd-item {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: 6px; cursor: pointer; transition: background 0.06s;
        }
        .cmd-item:hover, .cmd-item.on { background: var(--ember-bg); }
        .cmd-item-icon {
          width: 28px; height: 28px; border-radius: 5px;
          background: var(--warm-100); border: 1px solid var(--warm-200);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--mono); font-size: 13px; color: var(--ink-500); flex-shrink: 0;
        }
        .cmd-item.on .cmd-item-icon { background: var(--ember-bg); border-color: rgba(176,125,79,0.15); color: var(--ember); }
        .cmd-item-label { font-size: 14px; color: var(--ink-700); flex: 1; }
        .cmd-item.on .cmd-item-label { color: var(--ink-900); }
        .cmd-item-shortcut { font-family: var(--mono); font-size: 10px; color: var(--ink-300); flex-shrink: 0; }
      `}</style>

      <div className="app">
        {/* ═══ RAIL ═══ */}
        <div className="rail">
          <div style={{ width: 30, height: 30, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="var(--ember-light)" strokeWidth="1.2" /><path d="M14 8l-6 3.5v7L14 22l6-3.5v-7L14 8z" fill="var(--ember-light)" opacity="0.15" /><path d="M14 8v14M8 11.5l6 3.5 6-3.5" stroke="var(--ember-light)" strokeWidth="0.8" /></svg>
          </div>
          <button className={`rb${railActive === "workspaces" ? " on" : ""}`} onClick={() => { setRailActive("workspaces"); setSidebarOpen(true); }}><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/></svg></button>
          <button className="rb"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></button>
          <button className="rb">{overdueCount > 0 && <span className="badge" />}<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="3" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M2.5 7h13M6 1.5v3M12 1.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></button>
          <div className="rsep" />
          <button className="rb"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 6l3-3h6l3 3v6l-3 3H6l-3-3V6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="9" cy="8" r="2" stroke="currentColor" strokeWidth="1.1"/><path d="M6.5 14c0-2 1.1-3 2.5-3s2.5 1 2.5 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg></button>
          <div style={{ marginTop: "auto" }}><button className="rb"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.2 4.2l1.4 1.4M12.4 12.4l1.4 1.4M4.2 13.8l1.4-1.4M12.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg></button></div>
        </div>

        {/* ═══ SIDEBAR ═══ */}
        <div className={`sb${sidebarOpen ? "" : " closed"}`}>
          <div className="sb-inner">
            <div className="sb-head"><span className="sb-title">workspaces</span><button className="sb-close" onClick={() => setSidebarOpen(false)}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></button></div>
            <div className="stats">
              <div className="stat"><div className="stat-val">${(totalEarnings / 1000).toFixed(1)}k</div><div className="stat-lab">pipeline</div></div>
              <div className="stat"><div className="stat-val">{activeCount}</div><div className="stat-lab">active</div></div>
              <div className="stat"><div className="stat-val" style={{ color: overdueCount > 0 ? "#c24b38" : "var(--ink-800)" }}>{overdueCount}</div><div className="stat-lab">overdue</div></div>
            </div>
            <div className="sb-scroll">
              {workspaces.map(ws => (<div key={ws.id}><div className="ws-head" onClick={() => toggleWorkspace(ws.id)}><div className="ws-avatar" style={{ background: ws.avatarBg }}>{ws.avatar}</div><span className="ws-name">{ws.client}</span><span className="ws-count">{ws.projects.length}</span><span className="ws-arrow" style={{ transform: ws.open ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span></div>
                {ws.open && ws.projects.map(pj => (<div key={pj.id} className={`pj${activeProject === pj.id ? " on" : ""}`} onClick={() => selectProject(pj, ws.client)}><div className="pj-dot" style={{ background: STATUS[pj.status].color }} /><span className="pj-name">{pj.name}</span><span className="pj-due">{pj.due}</span></div>))}</div>))}
            </div>
            <div className="sb-footer"><span>{wordCount} words</span><span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: "#5a9a3c" }} />saved</span></div>
          </div>
        </div>

        {/* ═══ MAIN ═══ */}
        <div className="main">
          <div className="tabbar">
            {!sidebarOpen && <button style={{ background: "none", border: "none", borderRight: "1px solid var(--warm-200)", padding: "0 10px", cursor: "pointer", color: "var(--ink-400)", display: "flex", alignItems: "center" }} onClick={() => setSidebarOpen(true)}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></button>}
            {tabs.map(tab => (<div key={tab.id} className={`tab${tab.active ? " on" : ""}`} onClick={() => setTabs(prev => prev.map(t => ({ ...t, active: t.id === tab.id })))}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.3, flexShrink: 0 }}><path d="M2.5 1h4l3 3v6.5a1 1 0 01-1 1h-6a1 1 0 01-1-1v-8.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1"/></svg><span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{tab.name}</span><button className="tab-close" onClick={e => closeTab(e, tab.id)}>×</button></div>))}
          </div>

          <div className="bread">
            <button className="bread-nav"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 3L4 7l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <button className="bread-nav"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <span>{activeWs?.client || "workspace"}</span>
            <span className="bread-sep">/</span>
            <span className="bread-active">{activeTab?.name || "untitled"}</span>
            {(() => { const pj = workspaces.flatMap(w => w.projects).find(p => p.id === activeProject); if (!pj) return null; const st = STATUS[pj.status]; return <span className="bread-status" style={{ background: `${st.color}12`, color: st.color, border: `1px solid ${st.color}20` }}>{st.label}</span>; })()}
          </div>

          <div className="editor" ref={editorRef}>
            <div className="page">{blocks.map(renderBlock)}</div>
            {slashMenu && filteredTypes.length > 0 && (
              <div className="slash-menu" style={{ top: slashMenu.top, left: slashMenu.left }}>
                {["Basic","Blocks"].map(section => { const items = filteredTypes.filter(t => t.section === section); if (!items.length) return null; return (<div key={section}><div className="sl-sec">{section}</div>{items.map(t => { const gi = filteredTypes.indexOf(t); return (<div key={t.type} className={`sl-it${gi === slashIndex ? " on" : ""}`} onClick={() => selectSlashItem(t.type)}><div className="sl-ic">{t.icon}</div><div><div className="sl-lb">{t.label}</div><div className="sl-ds">{t.desc}</div></div><span className="sl-shortcut">{t.shortcut}</span></div>); })}</div>); })}
              </div>
            )}
            {formatBar && (
              <div className="fbar" style={{ top: formatBar.top, left: formatBar.left }}>
                <button className="fb" onMouseDown={e => { e.preventDefault(); document.execCommand("bold"); }} style={{ fontWeight: 700 }}>B</button>
                <button className="fb" onMouseDown={e => { e.preventDefault(); document.execCommand("italic"); }} style={{ fontStyle: "italic" }}>I</button>
                <button className="fb" onMouseDown={e => { e.preventDefault(); document.execCommand("underline"); }} style={{ textDecoration: "underline" }}>U</button>
                <button className="fb" onMouseDown={e => { e.preventDefault(); document.execCommand("strikethrough"); }} style={{ textDecoration: "line-through" }}>S</button>
                <div className="fsep" />
                <button className="fb" onMouseDown={e => { e.preventDefault(); document.execCommand("formatBlock", false, "pre"); }} style={{ fontFamily: "var(--mono)", fontSize: 11 }}>{"<>"}</button>
              </div>
            )}
          </div>

          {/* ── Command bar ── */}
          <div className="cmd-bar">
            <span className="cmd-prompt">❯</span>
            <input ref={cmdBarRef} className="cmd-input" placeholder="Type a command or search..." value={cmdBarValue}
              onChange={e => setCmdBarValue(e.target.value)}
              onFocus={() => setCmdBarFocused(true)} onBlur={() => setCmdBarFocused(false)}
              onKeyDown={e => { if (e.key === "Escape") { setCmdBarValue(""); cmdBarRef.current?.blur(); } }} />
            <div className="cmd-hints">
              <span className="cmd-hint"><kbd className="kbd">⌘K</kbd> palette</span>
              <span className="cmd-hint"><kbd className="kbd">/</kbd> blocks</span>
              <span className="cmd-hint"><span style={{ width: 5, height: 5, borderRadius: "50%", background: "#5a9a3c", display: "inline-block" }} /> {charCount}c</span>
            </div>
          </div>
        </div>

        {/* ═══ COMMAND PALETTE ═══ */}
        {cmdPalette && (
          <div className="cmd-overlay" onClick={() => setCmdPalette(false)}>
            <div className="cmd-modal" onClick={e => e.stopPropagation()}>
              <div className="cmd-search-wrap">
                <svg className="cmd-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3"/><path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                <input ref={cmdInputRef} className="cmd-search" placeholder="Search commands..." value={cmdFilter} onChange={e => { setCmdFilter(e.target.value); setCmdIndex(0); }}
                  onKeyDown={e => { if (e.key === "ArrowDown") { e.preventDefault(); setCmdIndex(i => Math.min(i+1, filteredCmds.length-1)); } else if (e.key === "ArrowUp") { e.preventDefault(); setCmdIndex(i => Math.max(i-1, 0)); } else if (e.key === "Enter") { setCmdPalette(false); } else if (e.key === "Escape") { setCmdPalette(false); } }} />
                <span className="cmd-esc">esc</span>
              </div>
              <div className="cmd-list">
                {["Create", "Navigate", "Actions"].map(section => {
                  const items = filteredCmds.filter(c => c.section === section);
                  if (!items.length) return null;
                  return (<div key={section}>
                    <div className="cmd-section">{section}</div>
                    {items.map(c => {
                      const gi = filteredCmds.indexOf(c);
                      return (<div key={c.id} className={`cmd-item${gi === cmdIndex ? " on" : ""}`} onClick={() => setCmdPalette(false)}>
                        <div className="cmd-item-icon">{c.icon}</div>
                        <span className="cmd-item-label">{c.label}</span>
                        <span className="cmd-item-shortcut">{c.shortcut}</span>
                      </div>);
                    })}
                  </div>);
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
