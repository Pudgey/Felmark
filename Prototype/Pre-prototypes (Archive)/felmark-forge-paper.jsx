import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   FELMARK FORGE PAPER — Editor + Draft Line
   The typewriter line follows you.
   ═══════════════════════════════════════════ */

const BLOCK_TYPES = [
  { id: "text", icon: "¶", label: "Text", desc: "Plain paragraph", cat: "basic" },
  { id: "h1", icon: "H₁", label: "Heading 1", desc: "Large section heading", cat: "basic" },
  { id: "h2", icon: "H₂", label: "Heading 2", desc: "Medium heading", cat: "basic" },
  { id: "h3", icon: "H₃", label: "Heading 3", desc: "Small heading", cat: "basic" },
  { id: "quote", icon: "❝", label: "Quote", desc: "Client testimonial or pull quote", cat: "content" },
  { id: "callout", icon: "◇", label: "Callout", desc: "Highlighted info box", cat: "content" },
  { id: "divider", icon: "—", label: "Divider", desc: "Horizontal rule", cat: "basic" },
  { id: "checklist", icon: "☐", label: "Checklist", desc: "To-do items", cat: "content" },
  { id: "code", icon: "<>", label: "Code", desc: "Code snippet block", cat: "content" },
  { id: "image", icon: "◻", label: "Image", desc: "Image or screenshot", cat: "media" },
  { id: "table", icon: "⊞", label: "Table", desc: "Data table", cat: "data" },
  { id: "pricing", icon: "$", label: "Pricing", desc: "Pricing line item", cat: "money" },
  { id: "scope", icon: "◆", label: "Scope", desc: "Scope boundary block", cat: "money" },
  { id: "timeline", icon: "→", label: "Timeline", desc: "Project milestone", cat: "content" },
  { id: "signature", icon: "✍", label: "Signature", desc: "E-signature block", cat: "money" },
];

// Default blocks for the document
function getDefaultBlocks() {
  return [
    { id: "b1", type: "h1", content: "Monthly Blog Posts", focused: false },
    { id: "b2", type: "text", content: "This proposal outlines a content strategy for Bolt Fitness, covering 8 blog posts per month across fitness, nutrition, and lifestyle categories.", focused: false },
    { id: "b3", type: "h2", content: "Scope of Work", focused: false },
    { id: "b4", type: "checklist", items: [
      { text: "4× fitness training articles (800–1200 words)", checked: true },
      { text: "2× nutrition guides with meal plans", checked: true },
      { text: "2× lifestyle/motivation pieces", checked: false },
      { text: "SEO optimization for all posts", checked: false },
      { text: "Social media caption kit (12 captions/month)", checked: false },
    ]},
    { id: "b5", type: "callout", content: "All blog posts include one round of revisions. Additional revisions billed at $85/hr.", variant: "warning" },
    { id: "b6", type: "h2", content: "Pricing", focused: false },
    { id: "b7", type: "pricing", items: [
      { label: "Blog posts (8×/month)", amount: 2400, note: "$300 per post" },
      { label: "SEO optimization", amount: 400, note: "Per month" },
      { label: "Social media kit", amount: 200, note: "12 captions" },
    ]},
    { id: "b8", type: "divider" },
    { id: "b9", type: "quote", content: "Bolt Fitness saw a 340% increase in organic traffic after 3 months of working with Alex.", author: "Jake Torres, Bolt Fitness" },
    { id: "b10", type: "h2", content: "Timeline", focused: false },
    { id: "b11", type: "timeline", items: [
      { label: "Week 1", desc: "Content strategy & keyword research", status: "done" },
      { label: "Week 2–3", desc: "First batch of 4 posts drafted", status: "active" },
      { label: "Week 4", desc: "Revisions, SEO, and publishing", status: "pending" },
    ]},
    { id: "b12", type: "text", content: "", placeholder: "Type / for blocks...", focused: false },
  ];
}

// ── Individual Block Renderers ──
function TextBlock({ block, onFocus, isFocused, onChange }) {
  const ref = useRef(null);
  return (
    <div className={`fp-block fp-block-text${isFocused ? " focused" : ""}`} onClick={() => onFocus(block.id)}>
      <div ref={ref} className="fp-text" contentEditable suppressContentEditableWarning
        data-placeholder={block.placeholder || "Type something..."}
        onFocus={() => onFocus(block.id)}
        onInput={e => onChange?.(block.id, e.currentTarget.textContent)}
      >{block.content}</div>
    </div>
  );
}

function HeadingBlock({ block, level, onFocus, isFocused }) {
  const cls = `fp-h${level}`;
  return (
    <div className={`fp-block${isFocused ? " focused" : ""}`} onClick={() => onFocus(block.id)}>
      <div className={cls} contentEditable suppressContentEditableWarning
        onFocus={() => onFocus(block.id)}
        data-placeholder={`Heading ${level}`}
      >{block.content}</div>
    </div>
  );
}

function QuoteBlock({ block, onFocus, isFocused }) {
  return (
    <div className={`fp-block fp-quote${isFocused ? " focused" : ""}`} onClick={() => onFocus(block.id)}>
      <div className="fp-quote-mark">❝</div>
      <div className="fp-quote-text" contentEditable suppressContentEditableWarning
        onFocus={() => onFocus(block.id)}
      >{block.content}</div>
      {block.author && <div className="fp-quote-author">— {block.author}</div>}
    </div>
  );
}

function CalloutBlock({ block, onFocus, isFocused }) {
  const variants = { info: { icon: "◎", color: "#2563eb" }, warning: { icon: "◇", color: "#d97706" }, success: { icon: "✓", color: "#16a34a" }, error: { icon: "!", color: "#dc2626" } };
  const v = variants[block.variant || "info"];
  return (
    <div className={`fp-block fp-callout${isFocused ? " focused" : ""}`}
      style={{ borderLeftColor: v.color, background: v.color + "03" }}
      onClick={() => onFocus(block.id)}>
      <div className="fp-callout-icon" style={{ color: v.color }}>{v.icon}</div>
      <div className="fp-callout-text" contentEditable suppressContentEditableWarning
        onFocus={() => onFocus(block.id)}
      >{block.content}</div>
    </div>
  );
}

function ChecklistBlock({ block, onFocus, isFocused }) {
  const [items, setItems] = useState(block.items || []);
  const toggle = (i) => setItems(prev => prev.map((item, idx) => idx === i ? { ...item, checked: !item.checked } : item));
  return (
    <div className={`fp-block fp-checklist${isFocused ? " focused" : ""}`} onClick={() => onFocus(block.id)}>
      {items.map((item, i) => (
        <div key={i} className={`fp-check-item${item.checked ? " done" : ""}`}>
          <div className={`fp-check-box${item.checked ? " checked" : ""}`} onClick={e => { e.stopPropagation(); toggle(i); }}>
            {item.checked && "✓"}
          </div>
          <span className="fp-check-text" contentEditable suppressContentEditableWarning
            onFocus={() => onFocus(block.id)}
          >{item.text}</span>
        </div>
      ))}
    </div>
  );
}

function PricingBlock({ block, onFocus, isFocused }) {
  const items = block.items || [];
  const total = items.reduce((s, i) => s + i.amount, 0);
  return (
    <div className={`fp-block fp-pricing${isFocused ? " focused" : ""}`} onClick={() => onFocus(block.id)}>
      {items.map((item, i) => (
        <div key={i} className="fp-price-row">
          <div className="fp-price-label">{item.label}</div>
          <div className="fp-price-note">{item.note}</div>
          <div className="fp-price-amount">${item.amount.toLocaleString()}</div>
        </div>
      ))}
      <div className="fp-price-total">
        <span>Total</span>
        <span className="fp-price-total-val">${total.toLocaleString()}/mo</span>
      </div>
    </div>
  );
}

function TimelineBlock({ block, onFocus, isFocused }) {
  return (
    <div className={`fp-block fp-timeline${isFocused ? " focused" : ""}`} onClick={() => onFocus(block.id)}>
      {(block.items || []).map((item, i) => (
        <div key={i} className={`fp-tl-item ${item.status}`}>
          <div className="fp-tl-dot-col">
            <div className={`fp-tl-dot ${item.status}`}>{item.status === "done" ? "✓" : item.status === "active" ? "●" : "○"}</div>
            {i < block.items.length - 1 && <div className="fp-tl-line" />}
          </div>
          <div className="fp-tl-info">
            <div className="fp-tl-label">{item.label}</div>
            <div className="fp-tl-desc">{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DividerBlock({ block, onFocus, isFocused }) {
  return (
    <div className={`fp-block fp-divider-block${isFocused ? " focused" : ""}`} onClick={() => onFocus(block.id)}>
      <div className="fp-divider-line" />
    </div>
  );
}

// ── Slash Command Palette ──
function SlashPalette({ filter, onSelect, selectedIndex }) {
  const filtered = BLOCK_TYPES.filter(b =>
    b.label.toLowerCase().includes(filter) || b.desc.toLowerCase().includes(filter) || b.cat.includes(filter)
  );
  if (filtered.length === 0) return null;
  return (
    <div className="fp-slash">
      {filtered.map((b, i) => (
        <div key={b.id} className={`fp-slash-item${i === selectedIndex ? " sel" : ""}`}
          onClick={() => onSelect(b.id)}
          onMouseEnter={() => {}}>
          <div className="fp-slash-icon">{b.icon}</div>
          <div className="fp-slash-info">
            <div className="fp-slash-label">{b.label}</div>
            <div className="fp-slash-desc">{b.desc}</div>
          </div>
          <span className="fp-slash-cat">{b.cat}</span>
        </div>
      ))}
    </div>
  );
}

// ── Draft Line (Typewriter Guide) ──
function DraftLine({ y, visible }) {
  if (!visible || y < 0) return null;
  return (
    <div className="fp-draft-line" style={{ top: y }}>
      <div className="fp-draft-line-inner" />
      <div className="fp-draft-line-marker">
        <div className="fp-draft-line-arrow">▸</div>
      </div>
    </div>
  );
}

// ── Main Editor ──
export default function ForgePaper() {
  const [blocks, setBlocks] = useState(getDefaultBlocks);
  const [focusedBlock, setFocusedBlock] = useState(null);
  const [draftLineY, setDraftLineY] = useState(-1);
  const [showSlash, setShowSlash] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");
  const [slashIdx, setSlashIdx] = useState(0);
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [draftLineEnabled, setDraftLineEnabled] = useState(true);
  const [draftLineStyle, setDraftLineStyle] = useState("ember"); // ember | blue | muted
  const paperRef = useRef(null);

  // Update draft line position based on focused block
  useEffect(() => {
    if (!focusedBlock || !draftLineEnabled) { setDraftLineY(-1); return; }
    const el = document.querySelector(`[data-block-id="${focusedBlock}"]`);
    if (!el || !paperRef.current) { setDraftLineY(-1); return; }
    const paperRect = paperRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setDraftLineY(elRect.bottom - paperRect.top);
  }, [focusedBlock, blocks, draftLineEnabled]);

  // Also update on typing/content changes
  useEffect(() => {
    if (!draftLineEnabled) return;
    const observer = new MutationObserver(() => {
      if (!focusedBlock) return;
      const el = document.querySelector(`[data-block-id="${focusedBlock}"]`);
      if (!el || !paperRef.current) return;
      const paperRect = paperRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setDraftLineY(elRect.bottom - paperRect.top);
    });
    if (paperRef.current) observer.observe(paperRef.current, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [focusedBlock, draftLineEnabled]);

  const handleFocus = (id) => {
    setFocusedBlock(id);
    setShowSlash(false);
  };

  const handleBlockChange = (id, text) => {
    // Check for slash command
    if (text && text.startsWith("/")) {
      setShowSlash(true);
      setSlashFilter(text.slice(1).toLowerCase());
      setSlashIdx(0);
    } else {
      setShowSlash(false);
    }
  };

  const insertBlock = (type) => {
    const newBlock = { id: `b${Date.now()}`, type, content: "", focused: false };
    if (type === "checklist") newBlock.items = [{ text: "New item", checked: false }];
    if (type === "pricing") newBlock.items = [{ label: "Line item", amount: 0, note: "" }];
    if (type === "timeline") newBlock.items = [{ label: "Phase 1", desc: "Description", status: "pending" }];
    if (type === "callout") { newBlock.content = "Important note here"; newBlock.variant = "info"; }
    if (type === "quote") { newBlock.content = "Quote text here"; newBlock.author = "Author"; }

    const idx = blocks.findIndex(b => b.id === focusedBlock);
    if (idx >= 0) {
      const updated = [...blocks];
      updated.splice(idx + 1, 0, newBlock);
      setBlocks(updated);
    } else {
      setBlocks([...blocks, newBlock]);
    }
    setShowSlash(false);
    setTimeout(() => setFocusedBlock(newBlock.id), 50);
  };

  const renderBlock = (block) => {
    const isFocused = focusedBlock === block.id;
    const isHovered = hoveredBlock === block.id;
    const props = { block, onFocus: handleFocus, isFocused };

    return (
      <div key={block.id} data-block-id={block.id}
        className={`fp-block-wrap${isHovered && !isFocused ? " hovered" : ""}`}
        onMouseEnter={() => setHoveredBlock(block.id)}
        onMouseLeave={() => setHoveredBlock(null)}>

        {/* Drag handle + add button (visible on hover) */}
        <div className={`fp-block-chrome${isHovered || isFocused ? " visible" : ""}`}>
          <button className="fp-block-add" onClick={() => { setFocusedBlock(block.id); insertBlock("text"); }} title="Add block below">+</button>
          <button className="fp-block-drag" title="Drag to reorder">⋮⋮</button>
        </div>

        {/* Block */}
        {block.type === "text" && <TextBlock {...props} onChange={handleBlockChange} />}
        {block.type === "h1" && <HeadingBlock {...props} level={1} />}
        {block.type === "h2" && <HeadingBlock {...props} level={2} />}
        {block.type === "h3" && <HeadingBlock {...props} level={3} />}
        {block.type === "quote" && <QuoteBlock {...props} />}
        {block.type === "callout" && <CalloutBlock {...props} />}
        {block.type === "checklist" && <ChecklistBlock {...props} />}
        {block.type === "pricing" && <PricingBlock {...props} />}
        {block.type === "timeline" && <TimelineBlock {...props} />}
        {block.type === "divider" && <DividerBlock {...props} />}
      </div>
    );
  };

  const draftColor = draftLineStyle === "ember" ? "#b07d4f" : draftLineStyle === "blue" ? "#2563eb" : "#d5d1c8";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.fp{font-family:'Outfit',sans-serif;background:#e8e5de;min-height:100vh;display:flex;flex-direction:column}

/* ═══ Top Bar ═══ */
.fp-top{padding:8px 16px;background:#fff;border-bottom:1px solid var(--warm-200);display:flex;align-items:center;gap:8px;flex-shrink:0}
.fp-top-back{width:28px;height:28px;border-radius:6px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-400);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px}
.fp-top-back:hover{background:var(--warm-50)}
.fp-top-crumb{font-size:13px;color:var(--ink-400);display:flex;align-items:center;gap:4px}
.fp-top-crumb strong{color:var(--ink-800);font-weight:500}
.fp-top-crumb-sep{color:var(--warm-300)}
.fp-top-badge{font-family:var(--mono);font-size:8px;font-weight:500;padding:2px 7px;border-radius:3px;margin-left:4px}
.fp-top-badge.active{color:#16a34a;background:rgba(22,163,74,0.04);border:1px solid rgba(22,163,74,0.06)}
.fp-top-badge.paper{color:var(--ember);background:var(--ember-bg);border:1px solid rgba(176,125,79,0.06)}
.fp-top-spacer{flex:1}
.fp-top-btn{padding:6px 14px;border-radius:6px;border:1px solid var(--warm-200);background:#fff;font-size:12px;font-family:inherit;color:var(--ink-500);cursor:pointer;display:flex;align-items:center;gap:4px;transition:all .08s}
.fp-top-btn:hover{background:var(--warm-50)}
.fp-top-btn.primary{background:var(--ember);color:#fff;border-color:var(--ember)}
.fp-top-btn.primary:hover{background:var(--ember-light)}

/* Draft line toggle */
.fp-dline-toggle{display:flex;align-items:center;gap:6px;margin-right:8px}
.fp-dline-btn{width:28px;height:18px;border-radius:9px;position:relative;cursor:pointer;transition:background .15s;border:none}
.fp-dline-btn.on{background:var(--ember)}
.fp-dline-btn.off{background:var(--warm-300)}
.fp-dline-dot{width:14px;height:14px;border-radius:50%;background:#fff;position:absolute;top:2px;transition:left .15s;box-shadow:0 1px 2px rgba(0,0,0,0.08)}
.fp-dline-btn.on .fp-dline-dot{left:12px}
.fp-dline-btn.off .fp-dline-dot{left:2px}
.fp-dline-label{font-family:var(--mono);font-size:9px;color:var(--ink-300)}

/* ═══ Paper Area ═══ */
.fp-canvas{flex:1;overflow-y:auto;display:flex;justify-content:center;padding:32px 20px 80px}
.fp-paper-wrap{position:relative;width:100%;max-width:720px}
.fp-paper{background:#fff;border:1px solid rgba(0,0,0,0.04);box-shadow:0 2px 16px rgba(0,0,0,0.06);border-radius:3px;padding:48px 56px 60px;min-height:900px;position:relative}

/* ═══ Document Header ═══ */
.fp-doc-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;padding-bottom:14px;border-bottom:1.5px solid var(--ink-900)}
.fp-doc-client{display:flex;align-items:center;gap:10px}
.fp-doc-avatar{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;color:#fff;flex-shrink:0}
.fp-doc-client-name{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:var(--ink-900)}
.fp-doc-meta{text-align:right}
.fp-doc-meta-row{font-family:var(--mono);font-size:10px;color:var(--ink-300);line-height:1.6}

/* ═══ Document Footer ═══ */
.fp-doc-footer{margin-top:40px;padding-top:12px;border-top:1px solid var(--warm-200);display:flex;justify-content:space-between;font-family:var(--mono);font-size:9px;color:var(--ink-300)}

/* ═══ Block System ═══ */
.fp-block-wrap{position:relative;padding-left:36px;margin-bottom:2px}
.fp-block-wrap.hovered{background:rgba(176,125,79,0.01);border-radius:4px}

/* Chrome (add + drag) */
.fp-block-chrome{position:absolute;left:0;top:2px;display:flex;gap:1px;opacity:0;transition:opacity .1s}
.fp-block-chrome.visible{opacity:1}
.fp-block-chrome button{width:18px;height:18px;border-radius:3px;border:none;background:transparent;color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;transition:all .06s}
.fp-block-chrome button:hover{background:var(--warm-200);color:var(--ink-600)}
.fp-block-add{font-size:13px !important}

/* Base block */
.fp-block{padding:3px 0;border-radius:3px;transition:outline .1s;outline:2px solid transparent;outline-offset:2px}
.fp-block.focused{outline-color:rgba(176,125,79,0.1)}

/* Text */
.fp-text{font-size:15px;color:var(--ink-700);line-height:1.7;outline:none;min-height:24px}
.fp-text:empty::before{content:attr(data-placeholder);color:var(--warm-400);pointer-events:none}
[contenteditable]:focus{outline:none}

/* Headings */
.fp-h1{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--ink-900);line-height:1.25;outline:none;padding:6px 0 2px}
.fp-h1:empty::before{content:attr(data-placeholder);color:var(--warm-300)}
.fp-h2{font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:600;color:var(--ink-900);line-height:1.3;outline:none;padding:12px 0 2px}
.fp-h2:empty::before{content:attr(data-placeholder);color:var(--warm-300)}
.fp-h3{font-size:16px;font-weight:600;color:var(--ink-800);line-height:1.35;outline:none;padding:8px 0 2px}
.fp-h3:empty::before{content:attr(data-placeholder);color:var(--warm-300)}

/* Quote */
.fp-quote{border-left:3px solid var(--ember);padding:12px 16px;background:var(--ember-bg);border-radius:0 8px 8px 0;margin:8px 0}
.fp-quote-mark{font-size:24px;color:var(--ember);opacity:.3;line-height:1;margin-bottom:4px}
.fp-quote-text{font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;color:var(--ink-700);line-height:1.6;outline:none}
.fp-quote-author{font-family:var(--mono);font-size:11px;color:var(--ink-400);margin-top:6px}

/* Callout */
.fp-callout{border-left:3px solid;padding:12px 14px;border-radius:0 8px 8px 0;margin:8px 0;display:flex;align-items:flex-start;gap:10px}
.fp-callout-icon{font-size:14px;flex-shrink:0;margin-top:1px}
.fp-callout-text{font-size:14px;color:var(--ink-600);line-height:1.6;outline:none;flex:1}

/* Checklist */
.fp-checklist{padding:6px 0;margin:4px 0}
.fp-check-item{display:flex;align-items:flex-start;gap:8px;padding:4px 0}
.fp-check-box{width:18px;height:18px;border-radius:4px;border:1.5px solid var(--warm-300);display:flex;align-items:center;justify-content:center;font-size:10px;color:transparent;cursor:pointer;transition:all .1s;flex-shrink:0;margin-top:2px}
.fp-check-box:hover{border-color:var(--ember)}
.fp-check-box.checked{background:var(--ember);border-color:var(--ember);color:#fff}
.fp-check-text{font-size:14px;color:var(--ink-600);line-height:1.5;outline:none}
.fp-check-item.done .fp-check-text{text-decoration:line-through;color:var(--ink-300)}

/* Pricing */
.fp-pricing{margin:8px 0;border:1px solid var(--warm-200);border-radius:8px;overflow:hidden}
.fp-price-row{display:flex;align-items:center;padding:10px 14px;border-bottom:1px solid var(--warm-100);gap:8px}
.fp-price-row:last-of-type{border-bottom:1px solid var(--warm-200)}
.fp-price-label{flex:1;font-size:14px;color:var(--ink-700);font-weight:500}
.fp-price-note{font-family:var(--mono);font-size:10px;color:var(--ink-300);flex-shrink:0}
.fp-price-amount{font-family:var(--mono);font-size:14px;font-weight:600;color:var(--ink-800);width:70px;text-align:right;flex-shrink:0}
.fp-price-total{display:flex;justify-content:space-between;padding:10px 14px;background:var(--warm-50);font-size:14px;font-weight:500;color:var(--ink-800)}
.fp-price-total-val{font-family:var(--mono);font-weight:600;color:var(--ember)}

/* Timeline */
.fp-timeline{padding:8px 0;margin:4px 0}
.fp-tl-item{display:flex;gap:12px}
.fp-tl-dot-col{display:flex;flex-direction:column;align-items:center;width:20px;flex-shrink:0}
.fp-tl-dot{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;border:1.5px solid}
.fp-tl-dot.done{background:rgba(22,163,74,0.06);border-color:rgba(22,163,74,0.12);color:#16a34a}
.fp-tl-dot.active{background:var(--ember-bg);border-color:rgba(176,125,79,0.12);color:var(--ember)}
.fp-tl-dot.pending{background:var(--warm-50);border-color:var(--warm-200);color:var(--ink-300)}
.fp-tl-line{width:1.5px;flex:1;min-height:16px;background:var(--warm-200);margin:3px 0}
.fp-tl-info{padding-bottom:12px}
.fp-tl-label{font-family:var(--mono);font-size:11px;font-weight:500;color:var(--ink-700)}
.fp-tl-desc{font-size:13px;color:var(--ink-400);margin-top:1px}

/* Divider */
.fp-divider-block{padding:12px 0}
.fp-divider-line{height:1px;background:var(--warm-200)}

/* ═══ Draft Line ═══ */
.fp-draft-line{position:absolute;left:0;right:0;z-index:10;pointer-events:none;transition:top .15s cubic-bezier(0.16,1,0.3,1)}
.fp-draft-line-inner{height:1.5px;background:${draftColor};opacity:.25;margin:0 -8px}
.fp-draft-line-marker{position:absolute;right:-20px;top:-6px}
.fp-draft-line-arrow{color:${draftColor};font-size:10px;opacity:.4}

/* ═══ Slash Palette ═══ */
.fp-slash{position:fixed;z-index:50;background:#fff;border:1px solid var(--warm-200);border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.08);padding:4px;max-height:280px;overflow-y:auto;width:260px;left:50%;transform:translateX(-50%);top:50%;margin-top:-140px}
.fp-slash-item{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:6px;cursor:pointer;transition:background .06s}
.fp-slash-item:hover,.fp-slash-item.sel{background:var(--warm-50)}
.fp-slash-item.sel{background:var(--ember-bg);outline:1px solid rgba(176,125,79,0.06)}
.fp-slash-icon{width:26px;height:26px;border-radius:6px;background:var(--warm-50);border:1px solid var(--warm-200);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--ink-400);flex-shrink:0}
.fp-slash-item.sel .fp-slash-icon{border-color:rgba(176,125,79,0.1);color:var(--ember)}
.fp-slash-info{flex:1;min-width:0}
.fp-slash-label{font-size:13px;font-weight:500;color:var(--ink-800)}
.fp-slash-desc{font-size:11px;color:var(--ink-400)}
.fp-slash-cat{font-family:var(--mono);font-size:8px;color:var(--ink-300);background:var(--warm-100);padding:1px 5px;border-radius:3px;flex-shrink:0}
      `}</style>

      <div className="fp">
        {/* Top bar */}
        <div className="fp-top">
          <button className="fp-top-back">‹</button>
          <div className="fp-top-crumb">
            <span>Bolt Fitness</span>
            <span className="fp-top-crumb-sep">/</span>
            <strong>Monthly Blog Posts</strong>
          </div>
          <span className="fp-top-badge active">ACTIVE</span>
          <span className="fp-top-badge paper">FORGE PAPER</span>
          <span className="fp-top-spacer" />

          {/* Draft line toggle */}
          <div className="fp-dline-toggle">
            <span className="fp-dline-label">Draft line</span>
            <button className={`fp-dline-btn${draftLineEnabled ? " on" : " off"}`}
              onClick={() => setDraftLineEnabled(!draftLineEnabled)}>
              <div className="fp-dline-dot" />
            </button>
          </div>

          <button className="fp-top-btn">↓ PDF</button>
          <button className="fp-top-btn">⎙ Print</button>
          <button className="fp-top-btn primary">Send to Client →</button>
        </div>

        {/* Canvas */}
        <div className="fp-canvas">
          <div className="fp-paper-wrap">
            <div className="fp-paper" ref={paperRef}>

              {/* Document header */}
              <div className="fp-doc-header">
                <div className="fp-doc-client">
                  <div className="fp-doc-avatar" style={{ background: "#8a7e63" }}>B</div>
                  <div className="fp-doc-client-name">Bolt Fitness</div>
                </div>
                <div className="fp-doc-meta">
                  <div className="fp-doc-meta-row">Date: March 31, 2026</div>
                  <div className="fp-doc-meta-row">Document: FM-2026-981</div>
                </div>
              </div>

              {/* Blocks */}
              {blocks.map(b => renderBlock(b))}

              {/* Document footer */}
              <div className="fp-doc-footer">
                <span>◆ Powered by @felmark/forge</span>
                <span>FM-2026-981 · March 31, 2026</span>
              </div>

              {/* Draft line */}
              <DraftLine y={draftLineY} visible={draftLineEnabled && focusedBlock !== null} />
            </div>
          </div>
        </div>

        {/* Slash command palette */}
        {showSlash && <SlashPalette filter={slashFilter} onSelect={insertBlock} selectedIndex={slashIdx} />}
      </div>
    </>
  );
}
