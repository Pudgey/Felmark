import { useState, useRef, useEffect, useCallback } from "react";

const uid = () => Math.random().toString(36).slice(2, 10);

/* ─── Block types for slash menu ─── */
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

/* ─── File tree data ─── */
const INITIAL_TREE = [
  { id: "f1", name: "Notes", type: "folder", open: true, children: [
    { id: "f2", name: "Daily", type: "folder", open: false, children: [
      { id: "d1", name: "2026-03-29", type: "file" },
      { id: "d2", name: "2026-03-28", type: "file" },
    ]},
    { id: "f3", name: "Ideas", type: "folder", open: true, children: [
      { id: "i1", name: "Writing is telepathy", type: "file" },
      { id: "i2", name: "Evergreen notes", type: "file" },
    ]},
    { id: "f4", name: "Projects", type: "folder", open: false, children: [
      { id: "p1", name: "App redesign", type: "file" },
      { id: "p2", name: "Q2 roadmap", type: "file" },
    ]},
  ]},
  { id: "f5", name: "Templates", type: "folder", open: false, children: [
    { id: "t1", name: "Meeting notes", type: "file" },
    { id: "t2", name: "Weekly review", type: "file" },
  ]},
];

/* ─── Tabs ─── */
const INITIAL_TABS = [
  { id: "i1", name: "Writing is telepathy", active: true },
  { id: "i2", name: "Evergreen notes", active: false },
];

/* ═══════════════════════════════════════
   EditableBlock — isolated from re-renders
   ═══════════════════════════════════════ */
function EditableBlock({ block, onContentChange, onEnter, onBackspace, onSlash, onSelect, registerRef }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && registerRef) registerRef(block.id, ref.current);
  }, [block.id, registerRef]);

  useEffect(() => {
    if (ref.current && block.content && ref.current.innerHTML !== block.content) {
      ref.current.innerHTML = block.content;
    }
  }, []); // eslint-disable-line

  const ph = { h1: "Heading 1", h2: "Heading 2", h3: "Heading 3", code: "// code", quote: "Quote", paragraph: "Type '/' for commands", bullet: "List", numbered: "List", todo: "To-do", callout: "Type here…" };
  const styles = {
    h1: { fontSize: "1.8em", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.02em", marginTop: 28 },
    h2: { fontSize: "1.4em", fontWeight: 600, lineHeight: 1.3, marginTop: 20 },
    h3: { fontSize: "1.15em", fontWeight: 600, lineHeight: 1.35, marginTop: 14 },
    paragraph: { lineHeight: 1.65 },
    bullet: { lineHeight: 1.65 }, numbered: { lineHeight: 1.65 },
    todo: { lineHeight: 1.65 },
    quote: { lineHeight: 1.65 },
    code: { fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace", fontSize: "0.84em", background: "rgba(0,0,0,0.03)", borderRadius: 4, padding: "14px 16px", lineHeight: 1.65, whiteSpace: "pre-wrap", tabSize: 2 },
    callout: { lineHeight: 1.65 },
  };

  const handleInput = () => {
    if (!ref.current) return;
    const text = ref.current.textContent;
    const html = ref.current.innerHTML;
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

/* ═══════════════════
   File Tree Component
   ═══════════════════ */
function FileTree({ tree, activeFile, onSelect, depth = 0 }) {
  const [localTree, setLocalTree] = useState(tree);

  useEffect(() => { setLocalTree(tree); }, [tree]);

  const toggle = (id) => {
    setLocalTree(prev => prev.map(n => n.id === id ? { ...n, open: !n.open } : n));
  };

  return (
    <div>
      {localTree.map(node => (
        <div key={node.id}>
          <div className={`tree-item${node.type === "file" && activeFile === node.id ? " active" : ""}`}
            style={{ paddingLeft: 12 + depth * 16 }}
            onClick={() => node.type === "folder" ? toggle(node.id) : onSelect(node)}>
            {node.type === "folder" ? (
              <svg className="tree-arrow" width="10" height="10" viewBox="0 0 10 10" style={{ transform: node.open ? "rotate(90deg)" : "rotate(0deg)" }}>
                <path d="M3 1.5l4 3.5-4 3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
                <path d="M3.5 1.5h4.5l3.5 3.5v7.5h-8a1 1 0 01-1-1v-9a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.1"/>
                <path d="M8 1.5v3.5h3.5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
              </svg>
            )}
            <span className="tree-name">{node.name}</span>
          </div>
          {node.type === "folder" && node.open && node.children && (
            <FileTree tree={node.children} activeFile={activeFile} onSelect={onSelect} depth={depth + 1} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════
   Main Component
   ═══════════════ */
export default function NotePad() {
  const [blocks, setBlocks] = useState([
    { id: uid(), type: "h1", content: "Writing is telepathy", checked: false },
    { id: uid(), type: "paragraph", content: '<span style="color:#7c3aed">#evergreen</span>', checked: false },
    { id: uid(), type: "paragraph", content: "", checked: false },
  ]);
  const [tabs, setTabs] = useState(INITIAL_TABS);
  const [tree] = useState(INITIAL_TREE);
  const [activeFile, setActiveFile] = useState("i1");
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
  const [activeIconRail, setActiveIconRail] = useState("files");

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

  const onContentChange = useCallback((id, html, text) => { contentCache.current[id] = html; }, []);

  const onEnter = useCallback((id, beforeHtml, afterHtml) => {
    contentCache.current[id] = beforeHtml;
    const newId = uid(); contentCache.current[newId] = afterHtml;
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id); const block = prev[idx];
      const carry = ["bullet", "numbered", "todo"].includes(block.type) ? block.type : "paragraph";
      const next = [...prev]; next[idx] = { ...block, content: beforeHtml };
      next.splice(idx + 1, 0, { id: newId, type: carry, content: afterHtml, checked: false });
      return next;
    });
    setTimeout(() => { const el = blockElMap.current[newId]; if (el) { el.innerHTML = afterHtml; cursorTo(el, false); } }, 20);
  }, []);

  const onBackspace = useCallback((id) => {
    setBlocks(prev => {
      if (prev.length <= 1) return prev;
      const idx = prev.findIndex(b => b.id === id); const next = prev.filter(b => b.id !== id);
      delete contentCache.current[id];
      setTimeout(() => { const el = blockElMap.current[next[Math.max(0, idx - 1)].id]; if (el) cursorTo(el, true); }, 20);
      return next;
    });
  }, []);

  const onSlash = useCallback((blockId, filter) => {
    const el = blockElMap.current[blockId];
    if (!el || !editorRef.current) return;
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
      setBlocks(prev => { const idx = prev.findIndex(b => b.id === blockId); const next = [...prev]; next[idx] = { ...next[idx], type: "divider", content: "" }; const nid = uid(); contentCache.current[nid] = ""; next.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false }); setTimeout(() => { const ne = blockElMap.current[nid]; if (ne) cursorTo(ne, false); }, 20); return next; });
    } else {
      setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, type, content: "" } : b));
      setTimeout(() => { if (el) cursorTo(el, false); }, 20);
    }
    setSlashMenu(null);
  };

  useEffect(() => {
    if (!slashMenu) return;
    const h = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSlashIndex(i => Math.min(i + 1, filteredTypes.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSlashIndex(i => Math.max(i - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); if (filteredTypes[slashIndex]) selectSlashItem(filteredTypes[slashIndex].type); }
      else if (e.key === "Escape") setSlashMenu(null);
    };
    window.addEventListener("keydown", h, true); return () => window.removeEventListener("keydown", h, true);
  }, [slashMenu, slashIndex, filteredTypes]);

  useEffect(() => { if (!slashMenu) return; const h = (e) => { if (!e.target.closest(".slash-menu")) setSlashMenu(null); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, [slashMenu]);

  const handleSelect = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim() || !editorRef.current) { setFormatBar(null); return; }
    const rect = sel.getRangeAt(0).getBoundingClientRect(); const sr = editorRef.current.getBoundingClientRect();
    setFormatBar({ top: rect.top - sr.top + editorRef.current.scrollTop - 42, left: rect.left - sr.left + rect.width / 2 - 90 });
  };

  const addBlockAfter = (afterId) => {
    const nid = uid(); contentCache.current[nid] = "";
    setBlocks(prev => { const idx = prev.findIndex(b => b.id === afterId); const next = [...prev]; next.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false }); return next; });
    setTimeout(() => { const el = blockElMap.current[nid]; if (el) cursorTo(el, false); }, 20);
  };

  const getNum = (bid) => { let c = 0; for (const b of blocks) { if (b.type === "numbered") c++; if (b.id === bid) return c; } return 1; };

  const selectFile = (node) => {
    setActiveFile(node.id);
    if (!tabs.find(t => t.id === node.id)) {
      setTabs(prev => [...prev.map(t => ({ ...t, active: false })), { id: node.id, name: node.name, active: true }]);
    } else {
      setTabs(prev => prev.map(t => ({ ...t, active: t.id === node.id })));
    }
  };

  const closeTab = (e, tabId) => {
    e.stopPropagation();
    setTabs(prev => {
      const next = prev.filter(t => t.id !== tabId);
      if (next.length && !next.some(t => t.active)) next[next.length - 1].active = true;
      return next;
    });
  };

  const renderBlock = (block) => {
    if (block.type === "divider") {
      return (
        <div key={block.id} className="brow" onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
          <div className="bgut" style={{ opacity: hoverBlock === block.id ? 1 : 0 }}>
            <button className="gb" onClick={() => addBlockAfter(block.id)}><svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>
            <div className="gb grip"><svg width="10" height="14" viewBox="0 0 10 14"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="7" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="3" cy="11.5" r="1" fill="currentColor"/><circle cx="7" cy="11.5" r="1" fill="currentColor"/></svg></div>
          </div>
          <div style={{ flex: 1, padding: "6px 0" }}><div style={{ height: 1, background: "#e5e5e5" }} /></div>
        </div>
      );
    }
    const isH = block.type.startsWith("h");
    return (
      <div key={block.id} className={`brow${dropId === block.id ? " drop" : ""}`}
        onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
        <div className="bgut" style={{ opacity: hoverBlock === block.id ? 1 : 0, marginTop: isH ? (block.type === "h1" ? 32 : block.type === "h2" ? 24 : 18) : 2 }}>
          <button className="gb" onClick={() => addBlockAfter(block.id)}><svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>
          <div className="gb grip" draggable onDragStart={e => { setDragId(block.id); e.dataTransfer.effectAllowed = "move"; }} onDragEnd={() => { setDragId(null); setDropId(null); }}>
            <svg width="10" height="14" viewBox="0 0 10 14"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="7" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="3" cy="11.5" r="1" fill="currentColor"/><circle cx="7" cy="11.5" r="1" fill="currentColor"/></svg>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", flex: 1 }}
          onDragOver={e => { e.preventDefault(); if (dragId && dragId !== block.id) setDropId(block.id); }}
          onDrop={e => { e.preventDefault(); if (!dragId || dragId === block.id) return; setBlocks(prev => { const fi = prev.findIndex(b => b.id === dragId); const ti = prev.findIndex(b => b.id === block.id); const n = [...prev]; const [m] = n.splice(fi, 1); n.splice(ti, 0, m); return n; }); setDragId(null); setDropId(null); }}>
          {block.type === "bullet" && <span className="prefix">•</span>}
          {block.type === "numbered" && <span className="prefix num">{getNum(block.id)}.</span>}
          {block.type === "todo" && <label className="prefix todo-check"><input type="checkbox" checked={block.checked} onChange={() => setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, checked: !b.checked } : b))} /></label>}
          <div style={{ flex: 1, ...(block.type === "callout" ? { display: "flex", gap: 8, background: "#f8f7f4", borderRadius: 4, padding: "10px 14px", border: "1px solid #eee" } : {}), ...(block.type === "quote" ? { borderLeft: "2px solid #d4d4d4", paddingLeft: 16, color: "#737373" } : {}) }}>
            {block.type === "callout" && <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>}
            <EditableBlock block={block} onContentChange={onContentChange} onEnter={onEnter} onBackspace={onBackspace} onSlash={onSlash} onSelect={handleSelect} registerRef={registerRef} />
          </div>
        </div>
      </div>
    );
  };

  const activeTab = tabs.find(t => t.active);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .app {
          display: flex; height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
          font-size: 15px; color: #262626; background: #fff;
        }

        /* ── Icon Rail ── */
        .rail {
          width: 44px; background: #2b2b2e; display: flex; flex-direction: column;
          align-items: center; padding: 10px 0; gap: 2px; flex-shrink: 0;
        }
        .rail-btn {
          width: 34px; height: 34px; border-radius: 6px; border: none;
          background: none; cursor: pointer; display: flex;
          align-items: center; justify-content: center; color: #808086;
          transition: background 0.1s, color 0.1s;
        }
        .rail-btn:hover { background: rgba(255,255,255,0.06); color: #b0b0b5; }
        .rail-btn.on { background: rgba(255,255,255,0.08); color: #d4d4d8; }
        .rail-sep { width: 20px; height: 1px; background: rgba(255,255,255,0.06); margin: 6px 0; }

        /* ── Sidebar ── */
        .sidebar {
          width: 220px; background: #303033; display: flex; flex-direction: column;
          transition: width 0.15s, min-width 0.15s; overflow: hidden;
          border-right: 1px solid rgba(255,255,255,0.04);
        }
        .sidebar.closed { width: 0; min-width: 0; }
        .sb-head {
          padding: 12px 14px 8px; font-size: 11px; font-weight: 600;
          color: #808086; letter-spacing: 0.06em; text-transform: uppercase;
          display: flex; align-items: center; justify-content: space-between;
        }
        .sb-close {
          background: none; border: none; cursor: pointer;
          color: #606066; display: flex; align-items: center; padding: 2px;
          border-radius: 3px;
        }
        .sb-close:hover { color: #909096; background: rgba(255,255,255,0.06); }
        .tree-item {
          display: flex; align-items: center; gap: 6px;
          padding: 4px 8px; cursor: pointer; font-size: 13px;
          color: #b0b0b5; transition: background 0.06s; border-radius: 3px;
          margin: 0 4px; user-select: none;
        }
        .tree-item:hover { background: rgba(255,255,255,0.04); }
        .tree-item.active { background: rgba(255,255,255,0.08); color: #e4e4e7; }
        .tree-arrow {
          flex-shrink: 0; color: #606066; transition: transform 0.12s;
        }
        .tree-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .sb-footer {
          margin-top: auto; padding: 10px 14px;
          border-top: 1px solid rgba(255,255,255,0.04);
          display: flex; justify-content: space-between;
          font-size: 11px; color: #606066;
        }

        /* ── Main ── */
        .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

        /* ── Tab bar ── */
        .tabbar {
          height: 38px; background: #fafafa; border-bottom: 1px solid #ebebeb;
          display: flex; align-items: stretch; overflow-x: auto; flex-shrink: 0;
        }
        .tabbar::-webkit-scrollbar { display: none; }
        .tab {
          display: flex; align-items: center; gap: 6px;
          padding: 0 14px; font-size: 12.5px; color: #888;
          cursor: pointer; border-right: 1px solid #ebebeb;
          white-space: nowrap; transition: background 0.06s; position: relative;
          min-width: 0;
        }
        .tab:hover { background: #f0f0f0; }
        .tab.on { background: #fff; color: #333; }
        .tab.on::after {
          content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
          height: 2px; background: #7c3aed;
        }
        .tab-close {
          background: none; border: none; cursor: pointer; color: #bbb;
          font-size: 14px; line-height: 1; padding: 2px; border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
        }
        .tab-close:hover { background: rgba(0,0,0,0.06); color: #666; }
        .tab-icon { opacity: 0.3; flex-shrink: 0; }

        /* ── Breadcrumb bar ── */
        .bread {
          height: 32px; padding: 0 20px; display: flex; align-items: center;
          gap: 6px; font-size: 12.5px; color: #aaa; border-bottom: 1px solid #f0f0f0;
          flex-shrink: 0;
        }
        .bread-nav { background: none; border: none; cursor: pointer; color: #ccc; display: flex; align-items: center; padding: 2px; border-radius: 3px; }
        .bread-nav:hover { color: #888; background: rgba(0,0,0,0.04); }

        /* ── Editor ── */
        .editor { flex: 1; overflow-y: auto; position: relative; }
        .editor::-webkit-scrollbar { width: 6px; }
        .editor::-webkit-scrollbar-track { background: transparent; }
        .editor::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 99px; }
        .page { max-width: 700px; margin: 0 auto; padding: 40px 48px 40vh; width: 100%; }

        .brow { display: flex; align-items: flex-start; position: relative; width: 100%; }
        .brow.drop::before { content:''; position:absolute; top:-1px; left:0; right:0; height:2px; background:#7c3aed; border-radius:2px; }
        .bgut {
          display: flex; align-items: center; flex-shrink: 0;
          transition: opacity 0.06s; margin-right: 4px;
          margin-left: -48px; width: 46px; justify-content: flex-end; gap: 1px;
        }
        .gb {
          width: 22px; height: 22px; display: flex; align-items: center;
          justify-content: center; border-radius: 3px; cursor: pointer;
          color: rgba(0,0,0,0.2); background: none; border: none;
        }
        .gb:hover { background: rgba(0,0,0,0.04); color: rgba(0,0,0,0.4); }
        .grip { cursor: grab; } .grip:active { cursor: grabbing; }

        .prefix { color: #a3a3a3; width: 22px; flex-shrink: 0; padding-top: 2px; text-align: center; font-size: 20px; line-height: 1.6; }
        .prefix.num { font-size: 15px; width: 26px; text-align: right; padding-right: 4px; }
        .todo-check { padding-top: 4px; flex-shrink: 0; width: 22px; display: flex; justify-content: center; cursor: pointer; }
        .todo-check input { width: 15px; height: 15px; accent-color: #7c3aed; cursor: pointer; margin-top: 2px; }

        [contenteditable]:empty:before { content: attr(data-placeholder); color: #d4d4d4; pointer-events: none; }
        [contenteditable]:focus { outline: none; }
        ::selection { background: rgba(124,58,237,0.18); }

        /* ── Slash menu ── */
        .slash-menu {
          position: absolute; width: 280px; max-height: 320px; overflow-y: auto;
          background: #fff; border-radius: 8px;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.1);
          padding: 4px; z-index: 100;
        }
        .slash-menu::-webkit-scrollbar { width: 4px; }
        .slash-menu::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 99px; }
        .sl-sec { font-size: 10.5px; font-weight: 600; color: #aaa; padding: 6px 8px 2px; letter-spacing: 0.04em; text-transform: uppercase; }
        .sl-it {
          display: flex; align-items: center; gap: 10px;
          padding: 5px 8px; border-radius: 5px; cursor: pointer;
        }
        .sl-it:hover, .sl-it.on { background: #f5f3ff; }
        .sl-ic {
          width: 40px; height: 40px; border-radius: 6px;
          border: 1px solid #eee; display: flex; align-items: center;
          justify-content: center; font-size: 15px; font-weight: 600;
          color: #737373; flex-shrink: 0; background: #fafafa;
        }
        .sl-lb { font-size: 13.5px; color: #333; }
        .sl-ds { font-size: 11.5px; color: #aaa; }

        /* ── Format bar ── */
        .fbar {
          position: absolute; display: flex; align-items: stretch;
          background: #262626; border-radius: 6px; padding: 3px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 100; gap: 1px;
        }
        .fb {
          background: none; border: none; color: rgba(255,255,255,0.8);
          width: 28px; height: 28px; border-radius: 4px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; font-size: 13px;
        }
        .fb:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .fsep { width: 1px; background: rgba(255,255,255,0.1); margin: 3px 1px; }

        /* ── Status bar ── */
        .status {
          height: 26px; background: #fafafa; border-top: 1px solid #ebebeb;
          display: flex; align-items: center; justify-content: flex-end;
          padding: 0 16px; gap: 16px; font-size: 11px; color: #aaa;
          flex-shrink: 0;
        }
      `}</style>

      <div className="app">
        {/* ═══ ICON RAIL ═══ */}
        <div className="rail">
          <button className={`rail-btn${activeIconRail === "files" ? " on" : ""}`} onClick={() => { setActiveIconRail("files"); setSidebarOpen(true); }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 2.5h4.5l2 2H15a1 1 0 011 1V14a1 1 0 01-1 1H3a1 1 0 01-1-1V3.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3"/></svg>
          </button>
          <button className={`rail-btn${activeIconRail === "search" ? " on" : ""}`} onClick={() => setActiveIconRail("search")}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.3"/><path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          </button>
          <button className="rail-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          </button>
          <div className="rail-sep" />
          <button className="rail-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><polygon points="9,2 11.5,7 17,7.5 13,11 14,16.5 9,14 4,16.5 5,11 1,7.5 6.5,7" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round"/></svg>
          </button>
          <button className="rail-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M9 2v2M9 14v2M2 9h2M14 9h2" stroke="currentColor" strokeWidth="1"/></svg>
          </button>
          <div style={{ marginTop: "auto" }}>
            <button className="rail-btn">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="rail-btn" style={{ marginTop: 2 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9.5 2.5a5.5 5.5 0 11-4 9.5L3 15l3-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* ═══ SIDEBAR ═══ */}
        <div className={`sidebar${sidebarOpen ? "" : " closed"}`} style={{ minWidth: sidebarOpen ? 220 : 0 }}>
          <div style={{ width: 220 }}>
            <div className="sb-head">
              <span>Files</span>
              <button className="sb-close" onClick={() => setSidebarOpen(false)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{ padding: "2px 0", overflow: "auto", flex: 1 }}>
              <FileTree tree={tree} activeFile={activeFile} onSelect={selectFile} />
            </div>
            <div className="sb-footer">
              <span>{wordCount} words</span>
              <span>{charCount} chars</span>
            </div>
          </div>
        </div>

        {/* ═══ MAIN ═══ */}
        <div className="main">
          {/* Tab bar */}
          <div className="tabbar">
            {!sidebarOpen && (
              <button style={{ background: "none", border: "none", borderRight: "1px solid #ebebeb", padding: "0 10px", cursor: "pointer", color: "#aaa", display: "flex", alignItems: "center" }}
                onClick={() => setSidebarOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              </button>
            )}
            {tabs.map(tab => (
              <div key={tab.id} className={`tab${tab.active ? " on" : ""}`}
                onClick={() => setTabs(prev => prev.map(t => ({ ...t, active: t.id === tab.id })))}>
                <svg className="tab-icon" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 1h4l3 3v6.5a1 1 0 01-1 1h-6a1 1 0 01-1-1v-8.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1"/><path d="M6.5 1v3h3" stroke="currentColor" strokeWidth="1"/></svg>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{tab.name}</span>
                <button className="tab-close" onClick={(e) => closeTab(e, tab.id)}>×</button>
              </div>
            ))}
          </div>

          {/* Breadcrumbs */}
          <div className="bread">
            <button className="bread-nav"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 3L4 7l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <button className="bread-nav"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <span style={{ margin: "0 4px", color: "#ccc" }}>Notes</span>
            <span style={{ color: "#ddd" }}>/</span>
            <span style={{ margin: "0 4px", color: "#ccc" }}>Ideas</span>
            <span style={{ color: "#ddd" }}>/</span>
            <span style={{ color: "#888" }}>{activeTab?.name || "Untitled"}</span>
          </div>

          {/* Editor */}
          <div className="editor" ref={editorRef}>
            <div className="page">
              {blocks.map(renderBlock)}
            </div>

            {slashMenu && filteredTypes.length > 0 && (
              <div className="slash-menu" style={{ top: slashMenu.top, left: slashMenu.left }}>
                {["Basic", "Blocks"].map(section => {
                  const items = filteredTypes.filter(t => t.section === section);
                  if (!items.length) return null;
                  return (<div key={section}><div className="sl-sec">{section}</div>{items.map(t => {
                    const gi = filteredTypes.indexOf(t);
                    return (<div key={t.type} className={`sl-it${gi === slashIndex ? " on" : ""}`} onClick={() => selectSlashItem(t.type)}>
                      <div className="sl-ic">{t.icon}</div>
                      <div><div className="sl-lb">{t.label}</div><div className="sl-ds">{t.desc}</div></div>
                    </div>);
                  })}</div>);
                })}
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

          {/* Status bar */}
          <div className="status">
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
          </div>
        </div>
      </div>
    </>
  );
}
