import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   FELMARK EDITOR — The anti-HoneyBook
   No rigid flows. No restrictions. Just blocks.
   Build anything. Your way.
   ═══════════════════════════════════════════ */

const BLOCK_CATEGORIES = [
  { id: "text", label: "Text", icon: "Aa", blocks: [
    { id: "h1", label: "Heading 1", desc: "Large section title", icon: "H1", shortcut: "# " },
    { id: "h2", label: "Heading 2", desc: "Medium section title", icon: "H2", shortcut: "## " },
    { id: "h3", label: "Heading 3", desc: "Small section title", icon: "H3", shortcut: "### " },
    { id: "paragraph", label: "Paragraph", desc: "Plain body text", icon: "¶", shortcut: "" },
    { id: "quote", label: "Quote", desc: "Blockquote with attribution", icon: "❝", shortcut: "> " },
    { id: "callout", label: "Callout", desc: "Info, warning, success, danger", icon: "ℹ", shortcut: "" },
    { id: "code", label: "Code Block", desc: "Syntax-highlighted code", icon: "<>", shortcut: "```" },
    { id: "divider", label: "Divider", desc: "Horizontal separator", icon: "—", shortcut: "---" },
  ]},
  { id: "data", label: "Live Data", icon: "{ }", blocks: [
    { id: "d-revenue", label: "{revenue}", desc: "Current month earnings", icon: "$", shortcut: "{rev" },
    { id: "d-deadline", label: "{deadline}", desc: "Next project deadline", icon: "⏱", shortcut: "{dead" },
    { id: "d-status", label: "{status}", desc: "Project status badge", icon: "●", shortcut: "{stat" },
    { id: "d-progress", label: "{progress}", desc: "Progress ring with %", icon: "◎", shortcut: "{prog" },
    { id: "d-timer", label: "{timer}", desc: "Live running timer", icon: "▶", shortcut: "{timer" },
    { id: "d-rate", label: "{effective-rate}", desc: "Your actual hourly rate", icon: "↗", shortcut: "{rate" },
    { id: "d-hours", label: "{hours}", desc: "Hours logged on project", icon: "#", shortcut: "{hours" },
    { id: "d-budget", label: "{budget-burn}", desc: "Budget consumed bar", icon: "█", shortcut: "{budget" },
  ]},
  { id: "visual", label: "Visual", icon: "◆", blocks: [
    { id: "v-flow", label: "Process Flow", desc: "Step-by-step visual flow", icon: "→", shortcut: "" },
    { id: "v-timeline", label: "Visual Timeline", desc: "Project roadmap with phases", icon: "◇", shortcut: "" },
    { id: "v-compare", label: "Comparison", desc: "Before/after side by side", icon: "⇄", shortcut: "" },
    { id: "v-brand", label: "Brand Board", desc: "Visual identity snapshot", icon: "✦", shortcut: "" },
    { id: "v-mood", label: "Mood Board", desc: "Visual direction grid", icon: "◆", shortcut: "" },
    { id: "v-wireframe", label: "Wireframe", desc: "Page layout wireframe", icon: "□", shortcut: "" },
    { id: "v-annotate", label: "Annotated Image", desc: "Screenshot with callout pins", icon: "◎", shortcut: "" },
    { id: "v-slider", label: "Before/After Slider", desc: "Drag to compare two states", icon: "‹›", shortcut: "" },
  ]},
  { id: "money", label: "Money", icon: "$", blocks: [
    { id: "m-pricing", label: "Pricing Table", desc: "Service tiers with prices", icon: "$", shortcut: "" },
    { id: "m-invoice", label: "Invoice Block", desc: "Line items with total", icon: "≡", shortcut: "" },
    { id: "m-payment", label: "Payment Button", desc: "Stripe checkout inline", icon: "→", shortcut: "" },
    { id: "m-schedule", label: "Payment Schedule", desc: "Milestone payment plan", icon: "◇", shortcut: "" },
    { id: "m-calculator", label: "Rate Calculator", desc: "Interactive rate builder", icon: "⊗", shortcut: "" },
    { id: "m-expense", label: "Expense Tracker", desc: "Project expense log", icon: "−", shortcut: "" },
  ]},
  { id: "content", label: "Rich Content", icon: "☰", blocks: [
    { id: "c-table", label: "Table", desc: "Editable spreadsheet grid", icon: "⊞", shortcut: "" },
    { id: "c-gallery", label: "Image Gallery", desc: "Grid with lightbox", icon: "◇", shortcut: "" },
    { id: "c-accordion", label: "Accordion", desc: "Collapsible sections", icon: "▸", shortcut: "" },
    { id: "c-math", label: "Math / Formula", desc: "Equation with result", icon: "∑", shortcut: "" },
    { id: "c-swatches", label: "Color Swatches", desc: "Palette with contrast check", icon: "●", shortcut: "" },
    { id: "c-embed", label: "Embed", desc: "Figma, Loom, Drive, Notion", icon: "⊏", shortcut: "" },
    { id: "c-bookmark", label: "Bookmark", desc: "Rich URL preview card", icon: "↗", shortcut: "" },
    { id: "c-canvas", label: "Canvas", desc: "Freehand drawing board", icon: "✎", shortcut: "" },
  ]},
  { id: "collab", label: "Collaboration", icon: "◎", blocks: [
    { id: "co-comment", label: "Comment Thread", desc: "Discussion inline", icon: "→", shortcut: "" },
    { id: "co-question", label: "Question", desc: "Ask the client something", icon: "?", shortcut: "" },
    { id: "co-decision", label: "Decision", desc: "Option A vs B vote", icon: "⇄", shortcut: "" },
    { id: "co-approval", label: "Approval", desc: "Client sign-off block", icon: "✓", shortcut: "" },
    { id: "co-handoff", label: "Handoff", desc: "Asset delivery block", icon: "↗", shortcut: "" },
    { id: "co-signature", label: "E-Signature", desc: "Legally binding signature", icon: "✍", shortcut: "" },
  ]},
  { id: "layout", label: "Layout", icon: "⊞", blocks: [
    { id: "l-2col", label: "2 Columns", desc: "Side-by-side layout", icon: "▐▌", shortcut: "" },
    { id: "l-3col", label: "3 Columns", desc: "Three equal columns", icon: "▐▌▐", shortcut: "" },
    { id: "l-sidebar", label: "Sidebar", desc: "Wide + narrow split", icon: "▐│", shortcut: "" },
    { id: "l-toggle", label: "Toggle Section", desc: "Expand/collapse group", icon: "▾", shortcut: "" },
    { id: "l-group", label: "Block Group", desc: "Group blocks together", icon: "{ }", shortcut: "" },
    { id: "l-spacer", label: "Spacer", desc: "Vertical breathing room", icon: "↕", shortcut: "" },
  ]},
  { id: "ai", label: "AI", icon: "❯", blocks: [
    { id: "ai-summarize", label: "Summarize", desc: "AI-generated summary", icon: "☰", shortcut: "" },
    { id: "ai-suggest", label: "Suggest Next", desc: "AI suggests next block", icon: "→", shortcut: "" },
    { id: "ai-tone", label: "Tone Check", desc: "Analyze tone & clarity", icon: "◎", shortcut: "" },
    { id: "ai-draft", label: "Draft Section", desc: "AI writes a section", icon: "✎", shortcut: "" },
    { id: "ai-risk", label: "Scope Risk", desc: "Flag potential scope creep", icon: "!", shortcut: "" },
  ]},
];

const ALL_BLOCKS = BLOCK_CATEGORIES.flatMap(c => c.blocks.map(b => ({ ...b, category: c.label, categoryIcon: c.icon })));

// Sample document blocks
const INITIAL_BLOCKS = [
  { id: "b1", type: "project-meta", data: { client: "Meridian Studio", project: "Brand Guidelines v2", due: "Apr 3, 2026", budget: 4800, status: "active" } },
  { id: "b2", type: "h1", content: "Brand Guidelines v2" },
  { id: "b3", type: "paragraph", content: "A comprehensive brand identity system covering logo usage, color palette, typography, imagery direction, and social media templates. This document is the deliverable — when it's done, it ships to the client as their brand guidelines." },
  { id: "b4", type: "callout", variant: "info", content: "This project is covered under the Freelance Service Agreement signed March 15, 2026. Any scope changes will require a Change Order." },
  { id: "b5", type: "divider", variant: "labeled", label: "Deliverables" },
  { id: "b6", type: "h2", content: "1. Logo Usage Rules" },
  { id: "b7", type: "paragraph", content: "The primary logo should maintain a minimum clear space equal to the height of the letter 'M' in the wordmark. On digital screens, minimum width is 120px. For print, minimum width is 1 inch." },
  { id: "b8", type: "data-inline", data: [
    { type: "progress", label: "Section progress", value: 65, max: 100 },
    { type: "status", label: "Status", value: "In review" },
    { type: "hours", label: "Hours", value: "4.2h" },
  ]},
  { id: "b9", type: "columns", columns: 2, children: [
    { id: "b9a", type: "column-content", label: "Primary Logo", content: "Used for most applications. Full color on light backgrounds.", mockType: "logo-primary" },
    { id: "b9b", type: "column-content", label: "Reversed Logo", content: "White version for dark backgrounds and photography overlays.", mockType: "logo-reversed" },
  ]},
  { id: "b10", type: "callout", variant: "warning", content: "Sarah commented: \"Can we add exact minimum sizes for print vs digital?\" — 2 hours ago" },
  { id: "b11", type: "h2", content: "2. Color Palette" },
  { id: "b12", type: "paragraph", content: "The color system is built on five core colors, each with specific roles. All pairs have been tested for WCAG AA accessibility compliance." },
  { id: "b13", type: "swatches", colors: [
    { hex: "#2c2a25", name: "Ink", role: "Primary text" },
    { hex: "#b07d4f", name: "Ember", role: "Accent" },
    { hex: "#faf9f7", name: "Parchment", role: "Background" },
    { hex: "#5a9a3c", name: "Green", role: "Success" },
    { hex: "#5b7fa4", name: "Blue", role: "Info" },
  ]},
  { id: "b14", type: "divider", variant: "labeled", label: "Project Financials" },
  { id: "b15", type: "pricing", items: [
    { name: "Brand Identity — Complete Package", amount: 4800 },
    { name: "50% deposit (paid)", amount: -2400, status: "paid" },
    { name: "25% milestone (due on deliverables 1–3)", amount: 1200, status: "upcoming" },
    { name: "25% on final delivery", amount: 1200, status: "upcoming" },
  ]},
  { id: "b16", type: "payment-schedule", milestones: [
    { label: "Deposit", amount: 2400, status: "paid", date: "Mar 15" },
    { label: "Milestone 1", amount: 1200, status: "current", date: "Apr 3" },
    { label: "Final", amount: 1200, status: "upcoming", date: "Apr 22" },
  ]},
  { id: "b17", type: "signature", parties: ["Alex Mercer (Freelancer)", "Sarah Chen (Meridian Studio)"], signed: [true, false] },
  { id: "b18", type: "spacer" },
];

// Render individual blocks
function BlockRenderer({ block, isSelected, onSelect, dragHandleProps }) {
  const baseClass = `ed-block${isSelected ? " selected" : ""}`;

  if (block.type === "project-meta") {
    const d = block.data;
    const statusColor = d.status === "active" ? "#5a9a3c" : d.status === "overdue" ? "#c24b38" : "#9b988f";
    return (
      <div className={`${baseClass} ed-meta`} onClick={onSelect}>
        <div className="ed-meta-row">
          <div className="ed-meta-client"><span className="ed-meta-av" style={{ background: "#7c8594" }}>M</span>{d.client}</div>
          <span className="ed-meta-sep">·</span>
          <span className="ed-meta-status" style={{ color: statusColor, background: statusColor + "08", borderColor: statusColor + "15" }}>● {d.status}</span>
          <span className="ed-meta-sep">·</span>
          <span className="ed-meta-due">Due {d.due}</span>
          <span className="ed-meta-sep">·</span>
          <span className="ed-meta-budget">${d.budget.toLocaleString()}</span>
        </div>
      </div>
    );
  }

  if (block.type === "h1") return <h1 className={`${baseClass} ed-h1`} onClick={onSelect} contentEditable suppressContentEditableWarning>{block.content}</h1>;
  if (block.type === "h2") return <h2 className={`${baseClass} ed-h2`} onClick={onSelect} contentEditable suppressContentEditableWarning>{block.content}</h2>;
  if (block.type === "h3") return <h3 className={`${baseClass} ed-h3`} onClick={onSelect} contentEditable suppressContentEditableWarning>{block.content}</h3>;
  if (block.type === "paragraph") return <p className={`${baseClass} ed-p`} onClick={onSelect} contentEditable suppressContentEditableWarning>{block.content}</p>;

  if (block.type === "callout") {
    const cfg = { info: { icon: "ℹ", color: "#5b7fa4" }, warning: { icon: "⚠", color: "#c89360" }, success: { icon: "✓", color: "#5a9a3c" }, danger: { icon: "✕", color: "#c24b38" } }[block.variant] || { icon: "ℹ", color: "#5b7fa4" };
    return (
      <div className={`${baseClass} ed-callout`} onClick={onSelect} style={{ borderColor: cfg.color + "15", background: cfg.color + "03" }}>
        <span className="ed-callout-icon" style={{ color: cfg.color }}>{cfg.icon}</span>
        <span className="ed-callout-text" contentEditable suppressContentEditableWarning>{block.content}</span>
      </div>
    );
  }

  if (block.type === "divider") {
    if (block.variant === "labeled") return (
      <div className={`${baseClass} ed-divider-labeled`} onClick={onSelect}>
        <span className="ed-divider-label">{block.label}</span>
      </div>
    );
    return <div className={`${baseClass} ed-divider`} onClick={onSelect} />;
  }

  if (block.type === "data-inline") {
    return (
      <div className={`${baseClass} ed-data-inline`} onClick={onSelect}>
        {block.data.map((d, i) => (
          <span key={i} className="ed-data-chip">
            {d.type === "progress" && <>
              <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="var(--warm-200)" strokeWidth="2" /><circle cx="8" cy="8" r="6" fill="none" stroke={d.value >= 60 ? "#5a9a3c" : "#b07d4f"} strokeWidth="2" strokeDasharray={`${(d.value / 100) * 37.7} 37.7`} transform="rotate(-90 8 8)" /></svg>
              <span className="ed-data-chip-label">{d.label}</span>
              <span className="ed-data-chip-val" style={{ color: d.value >= 60 ? "#5a9a3c" : "#b07d4f" }}>{d.value}%</span>
            </>}
            {d.type === "status" && <>
              <span className="ed-data-chip-dot" style={{ background: "#5b7fa4" }} />
              <span className="ed-data-chip-label">{d.label}</span>
              <span className="ed-data-chip-val" style={{ color: "#5b7fa4" }}>{d.value}</span>
            </>}
            {d.type === "hours" && <>
              <span className="ed-data-chip-label">{d.label}</span>
              <span className="ed-data-chip-val">{d.value}</span>
            </>}
          </span>
        ))}
      </div>
    );
  }

  if (block.type === "columns") {
    return (
      <div className={`${baseClass} ed-columns`} onClick={onSelect} style={{ gridTemplateColumns: `repeat(${block.columns}, 1fr)` }}>
        {block.children.map(child => (
          <div key={child.id} className="ed-col">
            <div className="ed-col-label">{child.label}</div>
            <div className="ed-col-mock" style={{ background: child.mockType === "logo-reversed" ? "var(--ink-900)" : "var(--warm-100)" }}>
              <span style={{ color: child.mockType === "logo-reversed" ? "var(--ember)" : "var(--ink-900)", fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600 }}>M</span>
            </div>
            <div className="ed-col-text">{child.content}</div>
          </div>
        ))}
      </div>
    );
  }

  if (block.type === "swatches") {
    return (
      <div className={`${baseClass} ed-swatches`} onClick={onSelect}>
        {block.colors.map((c, i) => (
          <div key={i} className="ed-swatch">
            <div className="ed-swatch-circle" style={{ background: c.hex, border: c.hex === "#faf9f7" ? "1px solid var(--warm-200)" : "none" }} />
            <div className="ed-swatch-info">
              <span className="ed-swatch-name">{c.name}</span>
              <span className="ed-swatch-hex">{c.hex}</span>
              <span className="ed-swatch-role">{c.role}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (block.type === "pricing") {
    const total = block.items.reduce((s, i) => s + i.amount, 0);
    return (
      <div className={`${baseClass} ed-pricing`} onClick={onSelect}>
        {block.items.map((item, i) => (
          <div key={i} className="ed-pricing-row">
            <span className="ed-pricing-name">
              {item.name}
              {item.status && <span className={`ed-pricing-status ${item.status}`}>{item.status}</span>}
            </span>
            <span className={`ed-pricing-amt${item.amount < 0 ? " paid" : ""}`}>{item.amount < 0 ? "−" : ""}${Math.abs(item.amount).toLocaleString()}</span>
          </div>
        ))}
        <div className="ed-pricing-row total">
          <span className="ed-pricing-name">Remaining balance</span>
          <span className="ed-pricing-amt">${total.toLocaleString()}</span>
        </div>
      </div>
    );
  }

  if (block.type === "payment-schedule") {
    return (
      <div className={`${baseClass} ed-milestones`} onClick={onSelect}>
        <div className="ed-ms-track">
          {block.milestones.map((m, i) => {
            const color = m.status === "paid" ? "#5a9a3c" : m.status === "current" ? "#b07d4f" : "var(--warm-300)";
            return (
              <div key={i} className="ed-ms-item">
                <div className="ed-ms-dot" style={{ background: m.status === "upcoming" ? "transparent" : color, borderColor: color }}>
                  {m.status === "paid" && <span style={{ color: "#fff", fontSize: 9 }}>✓</span>}
                </div>
                {i < block.milestones.length - 1 && <div className="ed-ms-line" style={{ background: m.status === "paid" ? color : "var(--warm-200)" }} />}
                <div className="ed-ms-label">{m.label}</div>
                <div className="ed-ms-amount" style={{ color }}>${m.amount.toLocaleString()}</div>
                <div className="ed-ms-date">{m.date}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (block.type === "signature") {
    return (
      <div className={`${baseClass} ed-sig`} onClick={onSelect}>
        <div className="ed-sig-label">E-Signatures</div>
        <div className="ed-sig-parties">
          {block.parties.map((p, i) => (
            <div key={i} className={`ed-sig-party${block.signed[i] ? " signed" : ""}`}>
              <div className="ed-sig-line" />
              <div className="ed-sig-name">{p}</div>
              {block.signed[i] ? (
                <div className="ed-sig-badge signed">✓ Signed · Mar 15, 2026</div>
              ) : (
                <div className="ed-sig-badge pending">Awaiting signature</div>
              )}
            </div>
          ))}
        </div>
        <div className="ed-sig-note">Legally binding digital signatures · Timestamped</div>
      </div>
    );
  }

  if (block.type === "spacer") return <div className={`${baseClass} ed-spacer`} onClick={onSelect} />;

  return <div className={baseClass} onClick={onSelect}>Unknown block: {block.type}</div>;
}

export default function Editor() {
  const [blocks] = useState(INITIAL_BLOCKS);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [showSlash, setShowSlash] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [slashPos, setSlashPos] = useState({ x: 0, y: 400 });
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const editorRef = useRef(null);

  const filteredBlocks = slashQuery
    ? ALL_BLOCKS.filter(b => b.label.toLowerCase().includes(slashQuery) || b.desc.toLowerCase().includes(slashQuery) || b.category.toLowerCase().includes(slashQuery))
    : activeCategory
      ? BLOCK_CATEGORIES.find(c => c.id === activeCategory)?.blocks.map(b => ({ ...b, category: BLOCK_CATEGORIES.find(c2 => c2.id === activeCategory).label, categoryIcon: BLOCK_CATEGORIES.find(c2 => c2.id === activeCategory).icon })) || []
      : ALL_BLOCKS.slice(0, 12);

  const handleEditorKey = (e) => {
    if (e.key === "/" && !showSlash) {
      setShowSlash(true);
      setSlashQuery("");
      setActiveCategory(null);
    }
    if (e.key === "Escape") {
      setShowSlash(false);
      setSelectedBlock(null);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

        .editor-page{font-family:'Outfit',sans-serif;font-size:15px;color:var(--ink-700);background:var(--parchment);min-height:100vh;display:flex;flex-direction:column}

        /* ── Top bar ── */
        .ed-topbar{padding:8px 24px;border-bottom:1px solid var(--warm-200);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:#fff}
        .ed-topbar-left{display:flex;align-items:center;gap:10px}
        .ed-topbar-breadcrumb{display:flex;align-items:center;gap:5px;font-size:13px;color:var(--ink-400)}
        .ed-topbar-breadcrumb span{cursor:pointer}.ed-topbar-breadcrumb span:hover{color:var(--ink-600)}
        .ed-topbar-breadcrumb .active{color:var(--ink-700);font-weight:500}
        .ed-topbar-right{display:flex;align-items:center;gap:6px}
        .ed-topbar-btn{padding:5px 12px;border-radius:5px;border:1px solid var(--warm-200);background:#fff;font-size:12px;font-family:inherit;color:var(--ink-500);cursor:pointer;transition:all .06s;display:flex;align-items:center;gap:4px}
        .ed-topbar-btn:hover{background:var(--warm-50)}
        .ed-topbar-btn.primary{background:var(--ember);border-color:var(--ember);color:#fff}
        .ed-topbar-btn.primary:hover{background:var(--ember-light)}
        .ed-topbar-collab{display:flex;gap:-4px;margin-right:8px}
        .ed-topbar-avatar{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#fff;border:2px solid #fff;margin-left:-4px;cursor:default}
        .ed-topbar-saved{font-family:var(--mono);font-size:10px;color:var(--ink-300);display:flex;align-items:center;gap:4px;margin-right:8px}
        .ed-topbar-saved-dot{width:5px;height:5px;border-radius:50%;background:#5a9a3c}

        /* ── Editor canvas ── */
        .ed-canvas{flex:1;max-width:780px;margin:0 auto;width:100%;padding:32px 48px 120px;position:relative;outline:none}
        .ed-canvas:focus{outline:none}

        /* ── Block base ── */
        .ed-block{position:relative;border-radius:4px;transition:all .06s;cursor:text}
        .ed-block:hover{background:rgba(176,125,79,0.015)}
        .ed-block.selected{background:rgba(176,125,79,0.02);box-shadow:-3px 0 0 0 var(--ember)}

        /* Block hover chrome */
        .ed-block-chrome{position:absolute;left:-44px;top:50%;transform:translateY(-50%);display:flex;gap:2px;opacity:0;transition:opacity .08s}
        .ed-block:hover .ed-block-chrome{opacity:1}
        .ed-chrome-btn{width:22px;height:22px;border-radius:4px;border:none;background:none;cursor:pointer;color:var(--ink-300);display:flex;align-items:center;justify-content:center;font-size:10px;transition:all .06s}
        .ed-chrome-btn:hover{background:var(--warm-100);color:var(--ink-600)}
        .ed-chrome-btn.drag{cursor:grab}
        .ed-chrome-btn.drag:active{cursor:grabbing}

        /* ── Block types ── */
        .ed-h1{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:var(--ink-900);padding:8px 4px;margin:4px 0;outline:none;line-height:1.2}
        .ed-h2{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--ink-900);padding:6px 4px;margin:16px 0 4px;outline:none;line-height:1.25}
        .ed-h3{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:var(--ink-800);padding:4px 4px;margin:12px 0 2px;outline:none}
        .ed-p{font-size:15px;color:var(--ink-600);line-height:1.8;padding:3px 4px;margin:2px 0;outline:none}
        .ed-p:empty::before{content:"Type / for blocks, or just start writing...";color:var(--warm-400);pointer-events:none}

        .ed-callout{display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border:1px solid;border-radius:8px;margin:8px 0;line-height:1.6;font-size:14px}
        .ed-callout-icon{font-size:14px;flex-shrink:0;margin-top:2px}
        .ed-callout-text{flex:1;outline:none}

        .ed-divider{height:1px;background:var(--warm-200);margin:16px 0}
        .ed-divider-labeled{display:flex;align-items:center;gap:10px;margin:20px 0;padding:0 4px}
        .ed-divider-labeled::before,.ed-divider-labeled::after{content:'';flex:1;height:1px;background:var(--warm-200)}
        .ed-divider-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.1em;white-space:nowrap}

        .ed-meta{padding:10px 16px;background:#fff;border:1px solid var(--warm-200);border-radius:8px;margin:0 0 8px}
        .ed-meta-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px}
        .ed-meta-client{display:flex;align-items:center;gap:6px;font-weight:500;color:var(--ink-800)}
        .ed-meta-av{width:20px;height:20px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;color:#fff;flex-shrink:0}
        .ed-meta-sep{color:var(--warm-300);font-size:10px}
        .ed-meta-status{font-family:var(--mono);font-size:10px;font-weight:500;padding:1px 8px;border-radius:3px;border:1px solid}
        .ed-meta-due,.ed-meta-budget{font-family:var(--mono);font-size:11px;color:var(--ink-400)}

        .ed-data-inline{display:flex;gap:6px;padding:6px 4px;margin:6px 0;flex-wrap:wrap}
        .ed-data-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border:1px solid var(--warm-200);border-radius:6px;background:#fff;font-family:var(--mono);font-size:12px}
        .ed-data-chip-label{color:var(--ink-400)}
        .ed-data-chip-val{font-weight:500;color:var(--ink-700)}
        .ed-data-chip-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}

        .ed-columns{display:grid;gap:12px;margin:10px 0;padding:4px}
        .ed-col{border:1px solid var(--warm-200);border-radius:8px;padding:14px;background:#fff}
        .ed-col-label{font-family:var(--mono);font-size:10px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
        .ed-col-mock{width:100%;aspect-ratio:3/2;border-radius:6px;display:flex;align-items:center;justify-content:center;margin-bottom:8px}
        .ed-col-text{font-size:13px;color:var(--ink-500);line-height:1.5}

        .ed-swatches{display:flex;gap:10px;padding:10px 4px;margin:8px 0;flex-wrap:wrap}
        .ed-swatch{display:flex;align-items:center;gap:8px;flex:1;min-width:120px}
        .ed-swatch-circle{width:40px;height:40px;border-radius:8px;flex-shrink:0}
        .ed-swatch-info{display:flex;flex-direction:column}
        .ed-swatch-name{font-size:13px;font-weight:500;color:var(--ink-700)}
        .ed-swatch-hex{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .ed-swatch-role{font-family:var(--mono);font-size:9px;color:var(--ink-300)}

        .ed-pricing{border:1px solid var(--warm-200);border-radius:8px;overflow:hidden;margin:10px 0}
        .ed-pricing-row{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;border-bottom:1px solid var(--warm-100);font-size:14px}
        .ed-pricing-row:last-child{border-bottom:none}
        .ed-pricing-row.total{background:var(--ink-900);padding:12px 16px}
        .ed-pricing-name{color:var(--ink-500);display:flex;align-items:center;gap:6px}
        .ed-pricing-row.total .ed-pricing-name{color:rgba(255,255,255,0.6)}
        .ed-pricing-amt{font-family:var(--mono);font-weight:500;color:var(--ink-800)}
        .ed-pricing-amt.paid{color:#5a9a3c}
        .ed-pricing-row.total .ed-pricing-amt{color:#fff;font-size:16px}
        .ed-pricing-status{font-family:var(--mono);font-size:9px;padding:1px 6px;border-radius:2px}
        .ed-pricing-status.paid{color:#5a9a3c;background:rgba(90,154,60,0.06)}
        .ed-pricing-status.upcoming{color:var(--ink-300);background:var(--warm-100)}

        .ed-milestones{margin:10px 0;padding:10px 4px}
        .ed-ms-track{display:flex;gap:0;justify-content:center}
        .ed-ms-item{display:flex;flex-direction:column;align-items:center;flex:1;position:relative}
        .ed-ms-dot{width:18px;height:18px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;z-index:1;background:#fff}
        .ed-ms-line{position:absolute;top:9px;left:calc(50% + 9px);right:calc(-50% + 9px);height:2px}
        .ed-ms-label{font-size:12px;font-weight:500;color:var(--ink-600);margin-top:6px}
        .ed-ms-amount{font-family:var(--mono);font-size:12px;font-weight:500}
        .ed-ms-date{font-family:var(--mono);font-size:10px;color:var(--ink-300)}

        .ed-sig{border:1px dashed var(--warm-300);border-radius:10px;padding:20px;margin:12px 0;text-align:center}
        .ed-sig-label{font-family:var(--mono);font-size:10px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px}
        .ed-sig-parties{display:flex;gap:20px;justify-content:center;margin-bottom:12px}
        .ed-sig-party{flex:1;max-width:240px;text-align:center}
        .ed-sig-line{width:100%;height:1px;background:var(--warm-300);margin-bottom:6px}
        .ed-sig-name{font-size:13px;color:var(--ink-500);margin-bottom:4px}
        .ed-sig-badge{font-family:var(--mono);font-size:10px;padding:2px 8px;border-radius:3px}
        .ed-sig-badge.signed{color:#5a9a3c;background:rgba(90,154,60,0.06)}
        .ed-sig-badge.pending{color:var(--ink-300);background:var(--warm-100)}
        .ed-sig-note{font-family:var(--mono);font-size:10px;color:var(--ink-300)}

        .ed-spacer{height:40px}

        /* ═══ SLASH COMMAND MENU ═══ */
        .ed-slash{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:520px;max-height:460px;background:#fff;border:1px solid var(--warm-200);border-radius:14px;box-shadow:0 16px 48px rgba(0,0,0,0.12),0 0 0 1px rgba(0,0,0,0.03);z-index:100;display:flex;flex-direction:column;overflow:hidden;animation:slashIn .15s ease}
        @keyframes slashIn{from{opacity:0;transform:translate(-50%,-50%) scale(0.97)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
        .ed-slash-overlay{position:fixed;inset:0;background:rgba(44,42,37,0.1);z-index:99}

        .ed-slash-header{padding:12px 16px;border-bottom:1px solid var(--warm-100)}
        .ed-slash-search-row{display:flex;align-items:center;gap:8px}
        .ed-slash-prompt{font-family:var(--mono);font-size:16px;color:var(--ember);font-weight:600}
        .ed-slash-input{flex:1;border:none;outline:none;font-size:15px;font-family:inherit;color:var(--ink-800)}
        .ed-slash-input::placeholder{color:var(--warm-400)}
        .ed-slash-count{font-family:var(--mono);font-size:10px;color:var(--ink-300)}

        .ed-slash-categories{display:flex;gap:2px;padding:8px 16px;border-bottom:1px solid var(--warm-100);overflow-x:auto}
        .ed-slash-categories::-webkit-scrollbar{display:none}
        .ed-slash-cat{padding:4px 10px;border-radius:4px;font-size:11px;border:none;cursor:pointer;font-family:inherit;color:var(--ink-400);background:none;transition:all .06s;white-space:nowrap;display:flex;align-items:center;gap:4px}
        .ed-slash-cat:hover{background:var(--warm-100);color:var(--ink-600)}
        .ed-slash-cat.on{background:var(--ink-900);color:#fff}
        .ed-slash-cat-icon{font-family:var(--mono);font-size:10px}

        .ed-slash-list{flex:1;overflow-y:auto;padding:4px}
        .ed-slash-list::-webkit-scrollbar{width:4px}.ed-slash-list::-webkit-scrollbar-thumb{background:rgba(0,0,0,.04);border-radius:99px}

        .ed-slash-group{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.08em;padding:10px 12px 4px}

        .ed-slash-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:7px;cursor:pointer;transition:all .06s}
        .ed-slash-item:hover{background:var(--ember-bg)}
        .ed-slash-item-icon{width:32px;height:32px;border-radius:7px;background:var(--warm-50);border:1px solid var(--warm-200);display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--ink-500);flex-shrink:0;transition:all .08s}
        .ed-slash-item:hover .ed-slash-item-icon{background:var(--ember-bg);border-color:rgba(176,125,79,.1);color:var(--ember)}
        .ed-slash-item-info{flex:1}
        .ed-slash-item-name{font-size:14px;font-weight:500;color:var(--ink-700)}
        .ed-slash-item-desc{font-size:12px;color:var(--ink-400)}
        .ed-slash-item-shortcut{font-family:var(--mono);font-size:9px;color:var(--ink-300);background:var(--warm-100);padding:1px 6px;border-radius:3px;flex-shrink:0}
        .ed-slash-item-cat{font-family:var(--mono);font-size:9px;color:var(--ink-300);flex-shrink:0}

        .ed-slash-footer{padding:8px 16px;border-top:1px solid var(--warm-100);display:flex;justify-content:space-between;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
        .ed-slash-footer-hints{display:flex;gap:8px}
        .ed-slash-kbd{background:var(--warm-100);border:1px solid var(--warm-200);border-radius:2px;padding:0 4px;font-size:9px}
      `}</style>

      <div className="editor-page">
        {/* Top bar */}
        <div className="ed-topbar">
          <div className="ed-topbar-left">
            <div className="ed-topbar-breadcrumb">
              <span>Meridian Studio</span>
              <span style={{ color: "var(--warm-300)" }}>/</span>
              <span className="active">Brand Guidelines v2</span>
            </div>
          </div>
          <div className="ed-topbar-right">
            <span className="ed-topbar-saved"><span className="ed-topbar-saved-dot" />Saved</span>
            <div className="ed-topbar-collab">
              <div className="ed-topbar-avatar" style={{ background: "#b07d4f" }}>A</div>
              <div className="ed-topbar-avatar" style={{ background: "#7c8594" }}>J</div>
            </div>
            <button className="ed-topbar-btn" onClick={() => setShowSlash(true)}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11 }}>/</span> Insert block
            </button>
            <button className="ed-topbar-btn">Share</button>
            <button className="ed-topbar-btn primary">Send to Client</button>
          </div>
        </div>

        {/* Editor */}
        <div className="ed-canvas" ref={editorRef} tabIndex={0} onKeyDown={handleEditorKey}>
          {blocks.map(block => (
            <div key={block.id}
              onMouseEnter={() => setHoveredBlock(block.id)}
              onMouseLeave={() => setHoveredBlock(null)}
              style={{ position: "relative" }}>
              {hoveredBlock === block.id && block.type !== "spacer" && (
                <div className="ed-block-chrome">
                  <button className="ed-chrome-btn" title="Add block above" onClick={(e) => { e.stopPropagation(); setShowSlash(true); }}>+</button>
                  <button className="ed-chrome-btn drag" title="Drag to reorder">⠿</button>
                </div>
              )}
              <BlockRenderer
                block={block}
                isSelected={selectedBlock === block.id}
                onSelect={() => setSelectedBlock(block.id)}
              />
            </div>
          ))}

          {/* Empty line prompt */}
          <p className="ed-block ed-p" contentEditable suppressContentEditableWarning
            onKeyDown={e => { if (e.key === "/") { e.preventDefault(); setShowSlash(true); } }}
          />
        </div>

        {/* Slash command menu */}
        {showSlash && (
          <>
            <div className="ed-slash-overlay" onClick={() => setShowSlash(false)} />
            <div className="ed-slash">
              <div className="ed-slash-header">
                <div className="ed-slash-search-row">
                  <span className="ed-slash-prompt">/</span>
                  <input className="ed-slash-input" placeholder="Search blocks..." autoFocus
                    value={slashQuery}
                    onChange={e => { setSlashQuery(e.target.value.toLowerCase()); setActiveCategory(null); }}
                    onKeyDown={e => { if (e.key === "Escape") setShowSlash(false); }} />
                  <span className="ed-slash-count">{filteredBlocks.length} blocks</span>
                </div>
              </div>

              <div className="ed-slash-categories">
                <button className={`ed-slash-cat${!activeCategory ? " on" : ""}`} onClick={() => setActiveCategory(null)}>All</button>
                {BLOCK_CATEGORIES.map(c => (
                  <button key={c.id} className={`ed-slash-cat${activeCategory === c.id ? " on" : ""}`}
                    onClick={() => { setActiveCategory(activeCategory === c.id ? null : c.id); setSlashQuery(""); }}>
                    <span className="ed-slash-cat-icon">{c.icon}</span>
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="ed-slash-list">
                {slashQuery ? (
                  filteredBlocks.map(b => (
                    <div key={b.id} className="ed-slash-item" onClick={() => setShowSlash(false)}>
                      <div className="ed-slash-item-icon">{b.icon}</div>
                      <div className="ed-slash-item-info">
                        <div className="ed-slash-item-name">{b.label}</div>
                        <div className="ed-slash-item-desc">{b.desc}</div>
                      </div>
                      {b.shortcut && <span className="ed-slash-item-shortcut">{b.shortcut}</span>}
                      <span className="ed-slash-item-cat">{b.category}</span>
                    </div>
                  ))
                ) : activeCategory ? (
                  filteredBlocks.map(b => (
                    <div key={b.id} className="ed-slash-item" onClick={() => setShowSlash(false)}>
                      <div className="ed-slash-item-icon">{b.icon}</div>
                      <div className="ed-slash-item-info">
                        <div className="ed-slash-item-name">{b.label}</div>
                        <div className="ed-slash-item-desc">{b.desc}</div>
                      </div>
                      {b.shortcut && <span className="ed-slash-item-shortcut">{b.shortcut}</span>}
                    </div>
                  ))
                ) : (
                  BLOCK_CATEGORIES.map(cat => (
                    <div key={cat.id}>
                      <div className="ed-slash-group">{cat.icon} {cat.label}</div>
                      {cat.blocks.slice(0, 3).map(b => (
                        <div key={b.id} className="ed-slash-item" onClick={() => setShowSlash(false)}>
                          <div className="ed-slash-item-icon">{b.icon}</div>
                          <div className="ed-slash-item-info">
                            <div className="ed-slash-item-name">{b.label}</div>
                            <div className="ed-slash-item-desc">{b.desc}</div>
                          </div>
                          {b.shortcut && <span className="ed-slash-item-shortcut">{b.shortcut}</span>}
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>

              <div className="ed-slash-footer">
                <span>{ALL_BLOCKS.length} blocks available across {BLOCK_CATEGORIES.length} categories</span>
                <div className="ed-slash-footer-hints">
                  <span><span className="ed-slash-kbd">↑↓</span> navigate</span>
                  <span><span className="ed-slash-kbd">⏎</span> insert</span>
                  <span><span className="ed-slash-kbd">⎋</span> close</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
