import { useState, useRef, useEffect, useCallback } from "react";

const uid = () => Math.random().toString(36).slice(2, 10);

const BLOCK_TYPES = [
  { type: "paragraph", label: "Text", icon: "T", desc: "Plain text", section: "Basic" },
  { type: "h1", label: "Heading 1", icon: "H1", desc: "Large heading", section: "Basic" },
  { type: "h2", label: "Heading 2", icon: "H2", desc: "Medium heading", section: "Basic" },
  { type: "h3", label: "Heading 3", icon: "H3", desc: "Small heading", section: "Basic" },
  { type: "bullet", label: "Bullet list", icon: "•", desc: "Unordered list", section: "Basic" },
  { type: "numbered", label: "Numbered list", icon: "1.", desc: "Ordered list", section: "Basic" },
  { type: "todo", label: "To-do", icon: "☐", desc: "Checkbox", section: "Basic" },
  { type: "quote", label: "Quote", icon: "❝", desc: "Block quote", section: "Blocks" },
  { type: "code", label: "Code", icon: "<>", desc: "Code block", section: "Blocks" },
  { type: "callout", label: "Callout", icon: "!", desc: "Callout box", section: "Blocks" },
  { type: "divider", label: "Divider", icon: "—", desc: "Horizontal rule", section: "Blocks" },
];

const STATUS = {
  active: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", label: "Active" },
  review: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", label: "In Review" },
  completed: { color: "#6366f1", bg: "rgba(99,102,241,0.1)", label: "Completed" },
  paused: { color: "#78716c", bg: "rgba(120,113,108,0.1)", label: "Paused" },
  overdue: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "Overdue" },
};

const WORKSPACES = [
  { id: "w1", client: "Meridian Studio", avatar: "M", avatarBg: "#6366f1", open: true, projects: [
    { id: "p1", name: "Brand Guidelines v2", status: "active", due: "Apr 3", amount: "$2,400" },
    { id: "p2", name: "Website Copy", status: "review", due: "Apr 8", amount: "$1,800" },
    { id: "p3", name: "Social Media Kit", status: "completed", due: "Mar 20", amount: "$950" },
  ]},
  { id: "w2", client: "Nora Kim — Coach", avatar: "N", avatarBg: "#ec4899", open: false, projects: [
    { id: "p4", name: "Course Landing Page", status: "active", due: "Apr 12", amount: "$3,200" },
    { id: "p5", name: "Email Sequence (6x)", status: "paused", due: "Apr 20", amount: "$1,600" },
  ]},
  { id: "w3", client: "Bolt Fitness", avatar: "B", avatarBg: "#f59e0b", open: false, projects: [
    { id: "p6", name: "App Onboarding UX", status: "overdue", due: "Mar 25", amount: "$4,000" },
    { id: "p7", name: "Monthly Blog Posts", status: "active", due: "Apr 1", amount: "$800" },
  ]},
  { id: "w4", client: "Personal", avatar: "✦", avatarBg: "#18181b", open: false, projects: [
    { id: "p8", name: "Portfolio Updates", status: "active", due: "—", amount: "—" },
    { id: "p9", name: "Invoice Template", status: "completed", due: "—", amount: "—" },
  ]},
];

const INITIAL_TABS = [
  { id: "p1", name: "Brand Guidelines v2", client: "Meridian Studio", active: true },
];

/* ═══ EditableBlock ═══ */
function EditableBlock({ block, onContentChange, onEnter, onBackspace, onSlash, onSelect, registerRef }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current && registerRef) registerRef(block.id, ref.current); }, [block.id, registerRef]);
  useEffect(() => { if (ref.current && block.content && ref.current.innerHTML !== block.content) ref.current.innerHTML = block.content; }, []); // eslint-disable-line

  const ph = { h1: "Heading 1", h2: "Heading 2", h3: "Heading 3", code: "// code", quote: "Quote", paragraph: "Type '/' for commands", bullet: "List", numbered: "List", todo: "To-do", callout: "Type here…" };
  const styles = {
    h1: { fontSize: "1.8em", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.02em", marginTop: 28 },
    h2: { fontSize: "1.4em", fontWeight: 600, lineHeight: 1.3, marginTop: 20 },
    h3: { fontSize: "1.15em", fontWeight: 600, lineHeight: 1.35, marginTop: 14 },
    paragraph: { lineHeight: 1.65 }, bullet: { lineHeight: 1.65 }, numbered: { lineHeight: 1.65 },
    todo: { lineHeight: 1.65 }, quote: { lineHeight: 1.65 }, callout: { lineHeight: 1.65 },
    code: { fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace", fontSize: "0.84em", background: "rgba(0,0,0,0.03)", borderRadius: 4, padding: "14px 16px", lineHeight: 1.65, whiteSpace: "pre-wrap", tabSize: 2 },
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
      e.preventDefault();
      if (!ref.current) return;
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
      if (sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const tR = document.createRange(); tR.setStart(ref.current, 0); tR.setEnd(range.startContainer, range.startOffset);
        if (tR.toString().length === 0 && ref.current.textContent.length === 0) { e.preventDefault(); onBackspace(block.id); }
      }
    }
    if (e.key === "Tab") { e.preventDefault(); document.execCommand("insertText", false, "  "); }
  };

  return (
    <div ref={ref} contentEditable suppressContentEditableWarning
      data-placeholder={ph[block.type] || "Type '/' for commands"}
      style={{ outline: "none", width: "100%", ...styles[block.type], ...(block.type === "todo" && block.checked ? { textDecoration: "line-through", opacity: 0.4 } : {}) }}
      onInput={handleInput} onKeyDown={handleKeyDown} onMouseUp={onSelect} spellCheck />
  );
}

/* ═══ Main ═══ */
export default function FreelancerPad() {
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
  const [slashMenu, setSlashMenu] = useState(null);
  const [slashFilter, setSlashFilter] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const [formatBar, setFormatBar] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [dragId, setDragId] = useState(null);
  const [dropId, setDropId] = useState(null);
  const [railActive, setRailActive] = useState("workspaces");

  const blockElMap = useRef({});
  const editorRef = useRef(null);
  const contentCache = useRef({});

  const registerRef = useCallback((id, el) => { blockElMap.current[id] = el; }, []);

  useEffect(() => {
    let t = "";
    blocks.forEach(b => { const c = contentCache.current[b.id] || b.content || ""; const d = document.createElement("div"); d.innerHTML = c; t += " " + d.textContent; });
    const w = t.trim(); setWordCount(w.split(/\s+/).filter(x => x).length); setCharCount(w.length);
  }, [blocks]);

  const cursorTo = (el, end) => { setTimeout(() => { el.focus(); const r = document.createRange(); if (end) { r.selectNodeContents(el); r.collapse(false); } else { r.setStart(el, 0); r.collapse(true); } const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }, 0); };
  const onContentChange = useCallback((id, html) => { contentCache.current[id] = html; }, []);
  const onEnter = useCallback((id, bH, aH) => {
    contentCache.current[id] = bH; const nid = uid(); contentCache.current[nid] = aH;
    setBlocks(prev => { const idx = prev.findIndex(b => b.id === id); const bl = prev[idx]; const carry = ["bullet","numbered","todo"].includes(bl.type) ? bl.type : "paragraph"; const n = [...prev]; n[idx] = { ...bl, content: bH }; n.splice(idx+1, 0, { id: nid, type: carry, content: aH, checked: false }); return n; });
    setTimeout(() => { const el = blockElMap.current[nid]; if (el) { el.innerHTML = aH; cursorTo(el, false); } }, 20);
  }, []);
  const onBackspace = useCallback((id) => {
    setBlocks(prev => { if (prev.length <= 1) return prev; const idx = prev.findIndex(b => b.id === id); const n = prev.filter(b => b.id !== id); delete contentCache.current[id]; setTimeout(() => { const el = blockElMap.current[n[Math.max(0, idx-1)].id]; if (el) cursorTo(el, true); }, 20); return n; });
  }, []);
  const onSlash = useCallback((blockId, filter) => {
    const el = blockElMap.current[blockId]; if (!el || !editorRef.current) return;
    const rect = el.getBoundingClientRect(); const sr = editorRef.current.getBoundingClientRect();
    setSlashMenu({ blockId, top: rect.bottom - sr.top + editorRef.current.scrollTop + 4, left: rect.left - sr.left });
    setSlashFilter(filter || ""); setSlashIndex(0);
  }, []);

  const filteredTypes = BLOCK_TYPES.filter(t => t.label.toLowerCase().includes(slashFilter.toLowerCase()));

  const selectSlashItem = (type) => {
    if (!slashMenu) return;
    const { blockId } = slashMenu; const el = blockElMap.current[blockId];
    if (el) el.textContent = ""; contentCache.current[blockId] = "";
    if (type === "divider") {
      setBlocks(prev => { const idx = prev.findIndex(b => b.id === blockId); const n = [...prev]; n[idx] = { ...n[idx], type: "divider", content: "" }; const nid = uid(); contentCache.current[nid] = ""; n.splice(idx+1, 0, { id: nid, type: "paragraph", content: "", checked: false }); setTimeout(() => { const ne = blockElMap.current[nid]; if (ne) cursorTo(ne, false); }, 20); return n; });
    } else {
      setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, type, content: "" } : b));
      setTimeout(() => { if (el) cursorTo(el, false); }, 20);
    }
    setSlashMenu(null);
  };

  useEffect(() => { if (!slashMenu) return; const h = (e) => { if (e.key === "ArrowDown") { e.preventDefault(); setSlashIndex(i => Math.min(i+1, filteredTypes.length-1)); } else if (e.key === "ArrowUp") { e.preventDefault(); setSlashIndex(i => Math.max(i-1, 0)); } else if (e.key === "Enter") { e.preventDefault(); if (filteredTypes[slashIndex]) selectSlashItem(filteredTypes[slashIndex].type); } else if (e.key === "Escape") setSlashMenu(null); }; window.addEventListener("keydown", h, true); return () => window.removeEventListener("keydown", h, true); }, [slashMenu, slashIndex, filteredTypes]);
  useEffect(() => { if (!slashMenu) return; const h = (e) => { if (!e.target.closest(".slash-menu")) setSlashMenu(null); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, [slashMenu]);

  const handleSelect = () => { const sel = window.getSelection(); if (!sel || sel.isCollapsed || !sel.toString().trim() || !editorRef.current) { setFormatBar(null); return; } const rect = sel.getRangeAt(0).getBoundingClientRect(); const sr = editorRef.current.getBoundingClientRect(); setFormatBar({ top: rect.top - sr.top + editorRef.current.scrollTop - 42, left: rect.left - sr.left + rect.width / 2 - 90 }); };

  const addBlockAfter = (afterId) => { const nid = uid(); contentCache.current[nid] = ""; setBlocks(prev => { const idx = prev.findIndex(b => b.id === afterId); const n = [...prev]; n.splice(idx+1, 0, { id: nid, type: "paragraph", content: "", checked: false }); return n; }); setTimeout(() => { const el = blockElMap.current[nid]; if (el) cursorTo(el, false); }, 20); };
  const getNum = (bid) => { let c = 0; for (const b of blocks) { if (b.type === "numbered") c++; if (b.id === bid) return c; } return 1; };

  const selectProject = (project, client) => {
    setActiveProject(project.id);
    if (!tabs.find(t => t.id === project.id)) {
      setTabs(prev => [...prev.map(t => ({ ...t, active: false })), { id: project.id, name: project.name, client, active: true }]);
    } else {
      setTabs(prev => prev.map(t => ({ ...t, active: t.id === project.id })));
    }
  };

  const closeTab = (e, id) => { e.stopPropagation(); setTabs(prev => { const n = prev.filter(t => t.id !== id); if (n.length && !n.some(t => t.active)) n[n.length-1].active = true; return n; }); };

  const toggleWorkspace = (wid) => { setWorkspaces(prev => prev.map(w => w.id === wid ? { ...w, open: !w.open } : w)); };

  const activeTab = tabs.find(t => t.active);
  const activeWs = workspaces.find(w => w.projects.some(p => p.id === activeProject));

  // Earnings summary
  const totalEarnings = workspaces.reduce((sum, w) => sum + w.projects.reduce((s, p) => { const m = p.amount.match(/[\d,]+/); return s + (m ? parseInt(m[0].replace(",","")) : 0); }, 0), 0);
  const activeCount = workspaces.reduce((sum, w) => sum + w.projects.filter(p => p.status === "active").length, 0);
  const overdueCount = workspaces.reduce((sum, w) => sum + w.projects.filter(p => p.status === "overdue").length, 0);

  const renderBlock = (block) => {
    if (block.type === "divider") {
      return (<div key={block.id} className="brow" onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
        <div className="bgut" style={{ opacity: hoverBlock === block.id ? 1 : 0 }}>
          <button className="gb" onClick={() => addBlockAfter(block.id)}><svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>
          <div className="gb grip"><svg width="10" height="14" viewBox="0 0 10 14"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="7" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="3" cy="11.5" r="1" fill="currentColor"/><circle cx="7" cy="11.5" r="1" fill="currentColor"/></svg></div>
        </div>
        <div style={{ flex: 1, padding: "6px 0" }}><div style={{ height: 1, background: "#e5e5e5" }} /></div>
      </div>);
    }
    const isH = block.type.startsWith("h");
    return (
      <div key={block.id} className={`brow${dropId === block.id ? " drop" : ""}`} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
        <div className="bgut" style={{ opacity: hoverBlock === block.id ? 1 : 0, marginTop: isH ? (block.type === "h1" ? 32 : block.type === "h2" ? 24 : 18) : 2 }}>
          <button className="gb" onClick={() => addBlockAfter(block.id)}><svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>
          <div className="gb grip" draggable onDragStart={e => { setDragId(block.id); e.dataTransfer.effectAllowed = "move"; }} onDragEnd={() => { setDragId(null); setDropId(null); }}>
            <svg width="10" height="14" viewBox="0 0 10 14"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="7" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="3" cy="11.5" r="1" fill="currentColor"/><circle cx="7" cy="11.5" r="1" fill="currentColor"/></svg>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", flex: 1 }}
          onDragOver={e => { e.preventDefault(); if (dragId && dragId !== block.id) setDropId(block.id); }}
          onDrop={e => { e.preventDefault(); if (!dragId || dragId === block.id) return; setBlocks(prev => { const fi = prev.findIndex(b => b.id === dragId); const ti = prev.findIndex(b => b.id === block.id); const n = [...prev]; const [m] = n.splice(fi,1); n.splice(ti,0,m); return n; }); setDragId(null); setDropId(null); }}>
          {block.type === "bullet" && <span className="prefix">•</span>}
          {block.type === "numbered" && <span className="prefix num">{getNum(block.id)}.</span>}
          {block.type === "todo" && <label className="prefix todo-check"><input type="checkbox" checked={block.checked} onChange={() => setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, checked: !b.checked } : b))} /></label>}
          <div style={{ flex: 1, ...(block.type === "callout" ? { display: "flex", gap: 8, background: "#faf8f5", borderRadius: 6, padding: "10px 14px", border: "1px solid #ece8e1" } : {}), ...(block.type === "quote" ? { borderLeft: "2px solid #d4d4d4", paddingLeft: 16, color: "#737373" } : {}) }}>
            {block.type === "callout" && <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>📋</span>}
            <EditableBlock block={block} onContentChange={onContentChange} onEnter={onEnter} onBackspace={onBackspace} onSlash={onSlash} onSelect={handleSelect} registerRef={registerRef} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .app { display: flex; height: 100vh; font-family: 'Inter', -apple-system, sans-serif; font-size: 15px; color: #1a1a1a; background: #fff; }

        /* ── Rail ── */
        .rail { width: 48px; background: #1a1a1e; display: flex; flex-direction: column; align-items: center; padding: 10px 0; gap: 2px; flex-shrink: 0; }
        .rb { width: 36px; height: 36px; border-radius: 8px; border: none; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #68686e; transition: all 0.1s; position: relative; }
        .rb:hover { background: rgba(255,255,255,0.06); color: #a0a0a6; }
        .rb.on { background: rgba(255,255,255,0.08); color: #d4d4d8; }
        .rb .badge { position: absolute; top: 4px; right: 4px; width: 8px; height: 8px; border-radius: 50%; background: #ef4444; border: 2px solid #1a1a1e; }
        .rsep { width: 22px; height: 1px; background: rgba(255,255,255,0.06); margin: 6px 0; }

        /* ── Sidebar ── */
        .sb { width: 260px; min-width: 260px; background: #232326; display: flex; flex-direction: column; transition: width 0.15s, min-width 0.15s; overflow: hidden; border-right: 1px solid rgba(255,255,255,0.04); }
        .sb.closed { width: 0; min-width: 0; }
        .sb-inner { width: 260px; display: flex; flex-direction: column; height: 100%; }

        .sb-head { padding: 14px 16px 10px; display: flex; align-items: center; justify-content: space-between; }
        .sb-title { font-size: 11px; font-weight: 600; color: #68686e; letter-spacing: 0.06em; text-transform: uppercase; }
        .sb-close { background: none; border: none; cursor: pointer; color: #505056; display: flex; padding: 3px; border-radius: 4px; }
        .sb-close:hover { color: #909096; background: rgba(255,255,255,0.06); }

        /* Stats bar */
        .stats { display: flex; gap: 6px; padding: 0 12px 12px; }
        .stat { flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.04); border-radius: 8px; padding: 8px 10px; }
        .stat-val { font-size: 15px; font-weight: 700; color: #e4e4e7; letter-spacing: -0.01em; }
        .stat-lab { font-size: 10px; color: #606066; margin-top: 1px; }

        .sb-scroll { flex: 1; overflow-y: auto; padding-bottom: 8px; }
        .sb-scroll::-webkit-scrollbar { width: 4px; }
        .sb-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 99px; }

        /* Workspace item */
        .ws-head { display: flex; align-items: center; gap: 8px; padding: 6px 12px; cursor: pointer; transition: background 0.06s; margin: 2px 6px; border-radius: 6px; }
        .ws-head:hover { background: rgba(255,255,255,0.03); }
        .ws-avatar { width: 22px; height: 22px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
        .ws-name { font-size: 13px; font-weight: 500; color: #c4c4c8; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ws-arrow { color: #505056; flex-shrink: 0; transition: transform 0.12s; font-size: 10px; }
        .ws-count { font-size: 10px; color: #505056; background: rgba(255,255,255,0.04); padding: 1px 6px; border-radius: 10px; flex-shrink: 0; }

        .pj { display: flex; align-items: center; gap: 8px; padding: 5px 12px 5px 42px; cursor: pointer; transition: background 0.06s; margin: 0 6px; border-radius: 5px; }
        .pj:hover { background: rgba(255,255,255,0.04); }
        .pj.on { background: rgba(255,255,255,0.06); }
        .pj-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .pj-name { font-size: 13px; color: #a0a0a6; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pj.on .pj-name { color: #e4e4e7; }
        .pj-due { font-size: 10px; color: #505056; flex-shrink: 0; }

        .sb-footer { padding: 10px 14px; border-top: 1px solid rgba(255,255,255,0.04); display: flex; justify-content: space-between; font-size: 11px; color: #505056; }

        /* ── Main ── */
        .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

        .tabbar { height: 38px; background: #fafafa; border-bottom: 1px solid #ebebeb; display: flex; align-items: stretch; overflow-x: auto; flex-shrink: 0; }
        .tabbar::-webkit-scrollbar { display: none; }
        .tab { display: flex; align-items: center; gap: 6px; padding: 0 14px; font-size: 12.5px; color: #888; cursor: pointer; border-right: 1px solid #ebebeb; white-space: nowrap; position: relative; }
        .tab:hover { background: #f0f0f0; }
        .tab.on { background: #fff; color: #333; }
        .tab.on::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:2px; background:#6366f1; }
        .tab-close { background: none; border: none; cursor: pointer; color: #bbb; font-size: 14px; line-height: 1; padding: 2px; border-radius: 3px; display: flex; align-items: center; justify-content: center; }
        .tab-close:hover { background: rgba(0,0,0,0.06); color: #666; }

        .bread { height: 34px; padding: 0 20px; display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #aaa; border-bottom: 1px solid #f5f5f5; flex-shrink: 0; }
        .bread-nav { background: none; border: none; cursor: pointer; color: #ccc; display: flex; align-items: center; padding: 2px; border-radius: 3px; }
        .bread-nav:hover { color: #888; background: rgba(0,0,0,0.04); }
        .bread-status { font-size: 10px; font-weight: 600; padding: 1px 7px; border-radius: 10px; margin-left: 4px; }

        .editor { flex: 1; overflow-y: auto; position: relative; }
        .editor::-webkit-scrollbar { width: 6px; }
        .editor::-webkit-scrollbar-track { background: transparent; }
        .editor::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 99px; }
        .page { max-width: 700px; margin: 0 auto; padding: 36px 48px 40vh; width: 100%; }

        .brow { display: flex; align-items: flex-start; position: relative; width: 100%; }
        .brow.drop::before { content:''; position:absolute; top:-1px; left:0; right:0; height:2px; background:#6366f1; border-radius:2px; }
        .bgut { display: flex; align-items: center; flex-shrink: 0; transition: opacity 0.06s; margin-right: 4px; margin-left: -48px; width: 46px; justify-content: flex-end; gap: 1px; }
        .gb { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 3px; cursor: pointer; color: rgba(0,0,0,0.2); background: none; border: none; }
        .gb:hover { background: rgba(0,0,0,0.04); color: rgba(0,0,0,0.4); }
        .grip { cursor: grab; } .grip:active { cursor: grabbing; }
        .prefix { color: #a3a3a3; width: 22px; flex-shrink: 0; padding-top: 2px; text-align: center; font-size: 20px; line-height: 1.6; }
        .prefix.num { font-size: 15px; width: 26px; text-align: right; padding-right: 4px; }
        .todo-check { padding-top: 4px; flex-shrink: 0; width: 22px; display: flex; justify-content: center; cursor: pointer; }
        .todo-check input { width: 15px; height: 15px; accent-color: #6366f1; cursor: pointer; margin-top: 2px; }

        [contenteditable]:empty:before { content: attr(data-placeholder); color: #d4d4d4; pointer-events: none; }
        [contenteditable]:focus { outline: none; }
        ::selection { background: rgba(99,102,241,0.18); }

        .slash-menu { position: absolute; width: 280px; max-height: 320px; overflow-y: auto; background: #fff; border-radius: 8px; box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.1); padding: 4px; z-index: 100; }
        .sl-sec { font-size: 10.5px; font-weight: 600; color: #aaa; padding: 6px 8px 2px; letter-spacing: 0.04em; text-transform: uppercase; }
        .sl-it { display: flex; align-items: center; gap: 10px; padding: 5px 8px; border-radius: 5px; cursor: pointer; }
        .sl-it:hover, .sl-it.on { background: #f5f3ff; }
        .sl-ic { width: 40px; height: 40px; border-radius: 6px; border: 1px solid #eee; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 600; color: #737373; flex-shrink: 0; background: #fafafa; }
        .sl-lb { font-size: 13.5px; color: #333; }
        .sl-ds { font-size: 11.5px; color: #aaa; }

        .fbar { position: absolute; display: flex; align-items: stretch; background: #1a1a1e; border-radius: 6px; padding: 3px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); z-index: 100; gap: 1px; }
        .fb { background: none; border: none; color: rgba(255,255,255,0.8); width: 28px; height: 28px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; }
        .fb:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .fsep { width: 1px; background: rgba(255,255,255,0.1); margin: 3px 1px; }

        .status { height: 28px; background: #fafafa; border-top: 1px solid #ebebeb; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; font-size: 11px; color: #aaa; flex-shrink: 0; }
      `}</style>

      <div className="app">
        {/* ═══ RAIL ═══ */}
        <div className="rail">
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4l6-2 6 2v8l-6 2-6-2V4z" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round"/><path d="M8 6v8M2 4l6 2 6-2" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round"/></svg>
          </div>

          <button className={`rb${railActive === "workspaces" ? " on" : ""}`} onClick={() => { setRailActive("workspaces"); setSidebarOpen(true); }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>
          </button>
          <button className="rb" onClick={() => setRailActive("search")}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.3"/><path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          </button>
          <button className="rb">
            {overdueCount > 0 && <span className="badge" />}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="3" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M2.5 7h13M6 1.5v3M12 1.5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          </button>
          <div className="rsep" />
          <button className="rb">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.2 4.2l1.4 1.4M12.4 12.4l1.4 1.4M4.2 13.8l1.4-1.4M12.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.3"/></svg>
          </button>
          <button className="rb">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 6l3-3h6l3 3v6l-3 3H6l-3-3V6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><circle cx="9" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 14c0-2 1.1-3 2.5-3s2.5 1 2.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </button>
          <div style={{ marginTop: "auto" }}>
            <button className="rb">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="12.5" r="0.8" fill="currentColor"/></svg>
            </button>
          </div>
        </div>

        {/* ═══ SIDEBAR ═══ */}
        <div className={`sb${sidebarOpen ? "" : " closed"}`}>
          <div className="sb-inner">
            <div className="sb-head">
              <span className="sb-title">Workspaces</span>
              <button className="sb-close" onClick={() => setSidebarOpen(false)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </button>
            </div>

            {/* Quick stats */}
            <div className="stats">
              <div className="stat">
                <div className="stat-val">${(totalEarnings / 1000).toFixed(1)}k</div>
                <div className="stat-lab">Pipeline</div>
              </div>
              <div className="stat">
                <div className="stat-val">{activeCount}</div>
                <div className="stat-lab">Active</div>
              </div>
              <div className="stat">
                <div className="stat-val" style={{ color: overdueCount > 0 ? "#ef4444" : "#e4e4e7" }}>{overdueCount}</div>
                <div className="stat-lab">Overdue</div>
              </div>
            </div>

            <div className="sb-scroll">
              {workspaces.map(ws => (
                <div key={ws.id}>
                  <div className="ws-head" onClick={() => toggleWorkspace(ws.id)}>
                    <div className="ws-avatar" style={{ background: ws.avatarBg }}>{ws.avatar}</div>
                    <span className="ws-name">{ws.client}</span>
                    <span className="ws-count">{ws.projects.length}</span>
                    <span className="ws-arrow" style={{ transform: ws.open ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                  </div>
                  {ws.open && ws.projects.map(pj => (
                    <div key={pj.id} className={`pj${activeProject === pj.id ? " on" : ""}`} onClick={() => selectProject(pj, ws.client)}>
                      <div className="pj-dot" style={{ background: STATUS[pj.status].color }} />
                      <span className="pj-name">{pj.name}</span>
                      <span className="pj-due">{pj.due}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="sb-footer">
              <span>{wordCount} words</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e" }} />
                Saved
              </span>
            </div>
          </div>
        </div>

        {/* ═══ MAIN ═══ */}
        <div className="main">
          <div className="tabbar">
            {!sidebarOpen && (
              <button style={{ background: "none", border: "none", borderRight: "1px solid #ebebeb", padding: "0 10px", cursor: "pointer", color: "#aaa", display: "flex", alignItems: "center" }} onClick={() => setSidebarOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              </button>
            )}
            {tabs.map(tab => (
              <div key={tab.id} className={`tab${tab.active ? " on" : ""}`} onClick={() => setTabs(prev => prev.map(t => ({ ...t, active: t.id === tab.id })))}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.3, flexShrink: 0 }}><path d="M2.5 1h4l3 3v6.5a1 1 0 01-1 1h-6a1 1 0 01-1-1v-8.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1"/></svg>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{tab.name}</span>
                <button className="tab-close" onClick={e => closeTab(e, tab.id)}>×</button>
              </div>
            ))}
          </div>

          <div className="bread">
            <button className="bread-nav"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 3L4 7l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <button className="bread-nav"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <span style={{ color: "#ccc", margin: "0 4px" }}>{activeWs?.client || "Workspace"}</span>
            <span style={{ color: "#ddd" }}>/</span>
            <span style={{ color: "#888", margin: "0 4px" }}>{activeTab?.name || "Untitled"}</span>
            {(() => {
              const pj = workspaces.flatMap(w => w.projects).find(p => p.id === activeProject);
              if (!pj) return null;
              const st = STATUS[pj.status];
              return <span className="bread-status" style={{ background: st.bg, color: st.color }}>{st.label}</span>;
            })()}
          </div>

          <div className="editor" ref={editorRef}>
            <div className="page">{blocks.map(renderBlock)}</div>

            {slashMenu && filteredTypes.length > 0 && (
              <div className="slash-menu" style={{ top: slashMenu.top, left: slashMenu.left }}>
                {["Basic","Blocks"].map(section => { const items = filteredTypes.filter(t => t.section === section); if (!items.length) return null; return (<div key={section}><div className="sl-sec">{section}</div>{items.map(t => { const gi = filteredTypes.indexOf(t); return (<div key={t.type} className={`sl-it${gi === slashIndex ? " on" : ""}`} onClick={() => selectSlashItem(t.type)}><div className="sl-ic">{t.icon}</div><div><div className="sl-lb">{t.label}</div><div className="sl-ds">{t.desc}</div></div></div>); })}</div>); })}
              </div>
            )}
            {formatBar && (
              <div className="fbar" style={{ top: formatBar.top, left: formatBar.left }}>
                <button className="fb" onMouseDown={e => { e.preventDefault(); document.execCommand("bold"); }} style={{ fontWeight: 700 }}>B</button>
                <button className="fb" onMouseDown={e => { e.preventDefault(); document.execCommand("italic"); }} style={{ fontStyle: "italic" }}>I</button>
                <button className="fb" onMouseDown={e => { e.preventDefault(); document.execCommand("underline"); }} style={{ textDecoration: "underline" }}>U</button>
                <button className="fb" onMouseDown={e => { e.preventDefault(); document.execCommand("strikethrough"); }} style={{ textDecoration: "line-through" }}>S</button>
                <div className="fsep" />
                <button className="fb" onMouseDown={e => { e.preventDefault(); document.execCommand("formatBlock", false, "pre"); }} style={{ fontFamily: "monospace", fontSize: 11 }}>{"<>"}</button>
              </div>
            )}
          </div>

          <div className="status">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {(() => {
                const pj = workspaces.flatMap(w => w.projects).find(p => p.id === activeProject);
                if (!pj) return null;
                return (<>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: STATUS[pj.status].color }} />{STATUS[pj.status].label}</span>
                  <span>Due: {pj.due}</span>
                  <span>{pj.amount}</span>
                </>);
              })()}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <span>{wordCount} words</span>
              <span>{charCount} chars</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
