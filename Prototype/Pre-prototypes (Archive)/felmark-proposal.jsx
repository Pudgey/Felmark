import { useState, useRef } from "react";

const uid = () => Math.random().toString(36).slice(2, 10);

const SECTION_TEMPLATES = [
  { type: "intro", label: "Introduction", icon: "◆", desc: "Who you are and what you'll do" },
  { type: "scope", label: "Scope of Work", icon: "☰", desc: "Deliverables and responsibilities" },
  { type: "timeline", label: "Timeline", icon: "→", desc: "Milestones and deadlines" },
  { type: "pricing", label: "Pricing", icon: "$", desc: "Line items and totals" },
  { type: "terms", label: "Terms", icon: "§", desc: "Payment terms and conditions" },
  { type: "signature", label: "Signature", icon: "✍", desc: "E-sign to accept" },
  { type: "text", label: "Text Block", icon: "T", desc: "Free-form content" },
];

const INITIAL_SECTIONS = [
  {
    id: uid(), type: "intro", title: "Introduction",
    content: "Hi Sarah — thanks for reaching out about the Brand Guidelines project. Based on our conversation, here's what I'm proposing.",
  },
  {
    id: uid(), type: "scope", title: "Scope of Work",
    items: [
      { id: uid(), text: "Primary & secondary logo usage rules", done: false },
      { id: uid(), text: "Color palette with hex, RGB, and CMYK values", done: false },
      { id: uid(), text: "Typography scale & font pairings", done: false },
      { id: uid(), text: "Imagery & photography direction guide", done: false },
      { id: uid(), text: "Social media templates (Instagram, LinkedIn)", done: false },
    ],
  },
  {
    id: uid(), type: "timeline", title: "Timeline",
    milestones: [
      { id: uid(), label: "Discovery & Research", duration: "Week 1", status: "upcoming" },
      { id: uid(), label: "Initial Concepts", duration: "Week 2", status: "upcoming" },
      { id: uid(), label: "Client Review", duration: "Week 3", status: "upcoming" },
      { id: uid(), label: "Final Delivery", duration: "Week 4", status: "upcoming" },
    ],
  },
  {
    id: uid(), type: "pricing", title: "Pricing",
    lineItems: [
      { id: uid(), description: "Brand Guidelines Document", qty: 1, rate: 1800 },
      { id: uid(), description: "Social Media Template Kit", qty: 5, rate: 120 },
    ],
    discount: 0,
  },
  {
    id: uid(), type: "terms", title: "Terms",
    content: "50% deposit due upon acceptance. Remaining 50% due upon final delivery. Two rounds of revisions included. Additional revisions billed at $95/hour.",
  },
  {
    id: uid(), type: "signature", title: "Acceptance",
  },
];

export default function ProposalBuilder() {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [dragId, setDragId] = useState(null);
  const [dropIdx, setDropIdx] = useState(null);
  const [editingTitle, setEditingTitle] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [clientName, setClientName] = useState("Sarah Chen");
  const [projectName, setProjectName] = useState("Brand Guidelines v2");
  const [proposalDate] = useState("March 29, 2026");
  const [validUntil] = useState("April 12, 2026");

  const addMenuRef = useRef(null);

  const moveSection = (fromIdx, toIdx) => {
    setSections(prev => {
      const n = [...prev];
      const [moved] = n.splice(fromIdx, 1);
      n.splice(toIdx, 0, moved);
      return n;
    });
  };

  const deleteSection = (id) => setSections(prev => prev.filter(s => s.id !== id));

  const addSection = (type) => {
    const template = SECTION_TEMPLATES.find(t => t.type === type);
    const base = { id: uid(), type, title: template.label };
    if (type === "scope") base.items = [{ id: uid(), text: "New deliverable", done: false }];
    else if (type === "timeline") base.milestones = [{ id: uid(), label: "Milestone", duration: "Week 1", status: "upcoming" }];
    else if (type === "pricing") { base.lineItems = [{ id: uid(), description: "Service", qty: 1, rate: 0 }]; base.discount = 0; }
    else if (type === "signature") {}
    else base.content = "";
    setSections(prev => [...prev, base]);
    setShowAddMenu(false);
  };

  const updateSection = (id, updates) => setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));

  // Pricing helpers
  const getSubtotal = (section) => section.lineItems?.reduce((s, li) => s + li.qty * li.rate, 0) || 0;
  const getTotal = (section) => { const sub = getSubtotal(section); return sub - (section.discount || 0); };
  const grandTotal = sections.filter(s => s.type === "pricing").reduce((s, sec) => s + getTotal(sec), 0);

  const renderSection = (section, idx) => {
    const isEditing = !previewMode;

    return (
      <div
        key={section.id}
        className={`prop-section${dragId === section.id ? " dragging" : ""}${dropIdx === idx ? " drop-target" : ""}`}
        draggable={isEditing}
        onDragStart={() => setDragId(section.id)}
        onDragEnd={() => { setDragId(null); setDropIdx(null); }}
        onDragOver={(e) => { e.preventDefault(); const i = sections.findIndex(s => s.id === section.id); if (dragId && dragId !== section.id) setDropIdx(i); }}
        onDrop={() => {
          if (!dragId) return;
          const from = sections.findIndex(s => s.id === dragId);
          const to = sections.findIndex(s => s.id === section.id);
          moveSection(from, to);
          setDragId(null); setDropIdx(null);
        }}
      >
        {/* Section header */}
        <div className="prop-section-head">
          {isEditing && <div className="prop-drag-handle">
            <svg width="10" height="14" viewBox="0 0 10 14"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="7" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="3" cy="11.5" r="1" fill="currentColor"/><circle cx="7" cy="11.5" r="1" fill="currentColor"/></svg>
          </div>}
          <span className="prop-section-type">{SECTION_TEMPLATES.find(t => t.type === section.type)?.icon}</span>
          {editingTitle === section.id ? (
            <input className="prop-title-input" value={section.title} autoFocus
              onChange={e => updateSection(section.id, { title: e.target.value })}
              onBlur={() => setEditingTitle(null)}
              onKeyDown={e => { if (e.key === "Enter") setEditingTitle(null); }} />
          ) : (
            <h3 className="prop-section-title" onClick={() => isEditing && setEditingTitle(section.id)}>{section.title}</h3>
          )}
          {isEditing && (
            <button className="prop-delete" onClick={() => deleteSection(section.id)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </button>
          )}
        </div>

        {/* ── Intro / Text ── */}
        {(section.type === "intro" || section.type === "text" || section.type === "terms") && (
          <div className="prop-body">
            {isEditing ? (
              <textarea className="prop-textarea" value={section.content || ""} placeholder="Write something..."
                onChange={e => updateSection(section.id, { content: e.target.value })} />
            ) : (
              <p className="prop-text">{section.content}</p>
            )}
          </div>
        )}

        {/* ── Scope ── */}
        {section.type === "scope" && (
          <div className="prop-body">
            {section.items?.map((item, i) => (
              <div key={item.id} className="scope-item">
                <span className="scope-num">{String(i + 1).padStart(2, "0")}</span>
                {isEditing ? (
                  <input className="scope-input" value={item.text}
                    onChange={e => {
                      const items = [...section.items];
                      items[i] = { ...items[i], text: e.target.value };
                      updateSection(section.id, { items });
                    }} />
                ) : (
                  <span className="scope-text">{item.text}</span>
                )}
                {isEditing && (
                  <button className="scope-delete" onClick={() => {
                    updateSection(section.id, { items: section.items.filter(x => x.id !== item.id) });
                  }}>×</button>
                )}
              </div>
            ))}
            {isEditing && (
              <button className="prop-add-item" onClick={() => {
                updateSection(section.id, { items: [...(section.items || []), { id: uid(), text: "New deliverable", done: false }] });
              }}>+ Add deliverable</button>
            )}
          </div>
        )}

        {/* ── Timeline ── */}
        {section.type === "timeline" && (
          <div className="prop-body">
            <div className="timeline-track">
              {section.milestones?.map((ms, i) => (
                <div key={ms.id} className="timeline-item">
                  <div className="timeline-dot-wrap">
                    <div className="timeline-dot" />
                    {i < section.milestones.length - 1 && <div className="timeline-line" />}
                  </div>
                  <div className="timeline-content">
                    {isEditing ? (
                      <div style={{ display: "flex", gap: 8, flex: 1 }}>
                        <input className="timeline-input" value={ms.label} style={{ flex: 1 }}
                          onChange={e => { const m = [...section.milestones]; m[i] = { ...m[i], label: e.target.value }; updateSection(section.id, { milestones: m }); }} />
                        <input className="timeline-input" value={ms.duration} style={{ width: 80 }}
                          onChange={e => { const m = [...section.milestones]; m[i] = { ...m[i], duration: e.target.value }; updateSection(section.id, { milestones: m }); }} />
                        <button className="scope-delete" onClick={() => updateSection(section.id, { milestones: section.milestones.filter(x => x.id !== ms.id) })}>×</button>
                      </div>
                    ) : (
                      <>
                        <span className="timeline-label">{ms.label}</span>
                        <span className="timeline-duration">{ms.duration}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {isEditing && (
              <button className="prop-add-item" onClick={() => {
                updateSection(section.id, { milestones: [...(section.milestones || []), { id: uid(), label: "New milestone", duration: "Week X", status: "upcoming" }] });
              }}>+ Add milestone</button>
            )}
          </div>
        )}

        {/* ── Pricing ── */}
        {section.type === "pricing" && (
          <div className="prop-body">
            <div className="pricing-table">
              <div className="pricing-header">
                <span className="pricing-col desc-col">Description</span>
                <span className="pricing-col qty-col">Qty</span>
                <span className="pricing-col rate-col">Rate</span>
                <span className="pricing-col total-col">Total</span>
                {isEditing && <span className="pricing-col act-col" />}
              </div>
              {section.lineItems?.map((li, i) => (
                <div key={li.id} className="pricing-row">
                  {isEditing ? (
                    <>
                      <input className="pricing-input desc-col" value={li.description}
                        onChange={e => { const items = [...section.lineItems]; items[i] = { ...items[i], description: e.target.value }; updateSection(section.id, { lineItems: items }); }} />
                      <input className="pricing-input qty-col" type="number" value={li.qty}
                        onChange={e => { const items = [...section.lineItems]; items[i] = { ...items[i], qty: parseInt(e.target.value) || 0 }; updateSection(section.id, { lineItems: items }); }} />
                      <input className="pricing-input rate-col" type="number" value={li.rate}
                        onChange={e => { const items = [...section.lineItems]; items[i] = { ...items[i], rate: parseFloat(e.target.value) || 0 }; updateSection(section.id, { lineItems: items }); }} />
                    </>
                  ) : (
                    <>
                      <span className="pricing-cell desc-col">{li.description}</span>
                      <span className="pricing-cell qty-col">{li.qty}</span>
                      <span className="pricing-cell rate-col">${li.rate.toLocaleString()}</span>
                    </>
                  )}
                  <span className="pricing-cell total-col">${(li.qty * li.rate).toLocaleString()}</span>
                  {isEditing && (
                    <button className="scope-delete act-col" onClick={() => updateSection(section.id, { lineItems: section.lineItems.filter(x => x.id !== li.id) })}>×</button>
                  )}
                </div>
              ))}
              <div className="pricing-footer">
                <span className="pricing-subtotal-label">Subtotal</span>
                <span className="pricing-subtotal-val">${getSubtotal(section).toLocaleString()}</span>
              </div>
              {section.discount > 0 && (
                <div className="pricing-footer" style={{ color: "#5a9a3c" }}>
                  <span className="pricing-subtotal-label">Discount</span>
                  <span className="pricing-subtotal-val">-${section.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="pricing-footer total-row">
                <span className="pricing-subtotal-label">Total</span>
                <span className="pricing-subtotal-val">${getTotal(section).toLocaleString()}</span>
              </div>
            </div>
            {isEditing && (
              <button className="prop-add-item" onClick={() => {
                updateSection(section.id, { lineItems: [...(section.lineItems || []), { id: uid(), description: "New item", qty: 1, rate: 0 }] });
              }}>+ Add line item</button>
            )}
          </div>
        )}

        {/* ── Signature ── */}
        {section.type === "signature" && (
          <div className="prop-body">
            <div className="sig-box">
              <div className="sig-row">
                <div className="sig-field">
                  <span className="sig-label">Client</span>
                  <div className="sig-line">{clientName}</div>
                </div>
                <div className="sig-field">
                  <span className="sig-label">Date</span>
                  <div className="sig-line">{proposalDate}</div>
                </div>
              </div>
              <div className="sig-sign-area">
                <span className="sig-placeholder">Click to sign</span>
              </div>
              <p className="sig-legal">By signing above, you agree to the terms outlined in this proposal and authorize the project to begin.</p>
            </div>
          </div>
        )}
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
          --warm-200: #e5e2db; --warm-300: #d5d1c8; --warm-400: #b8b3a8;
          --ink-900: #2c2a25; --ink-800: #3d3a33; --ink-700: #4f4c44;
          --ink-600: #65625a; --ink-500: #7d7a72; --ink-400: #9b988f; --ink-300: #b5b2a9;
          --ember: #b07d4f; --ember-light: #c89360; --ember-bg: rgba(176,125,79,0.08);
          --mono: 'JetBrains Mono', monospace;
        }

        .proposal-builder {
          font-family: 'Outfit', sans-serif; font-size: 15px;
          color: var(--ink-700); background: var(--warm-50);
          height: 100vh; display: flex; flex-direction: column;
        }

        /* ── Top bar ── */
        .prop-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 24px; border-bottom: 1px solid var(--warm-200);
          background: var(--parchment); flex-shrink: 0;
        }
        .prop-topbar-left { display: flex; align-items: center; gap: 12px; }
        .prop-back {
          background: none; border: none; cursor: pointer;
          color: var(--ink-400); display: flex; padding: 4px; border-radius: 4px;
        }
        .prop-back:hover { background: var(--warm-100); color: var(--ink-600); }
        .prop-topbar-title { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: var(--ink-900); }
        .prop-topbar-meta { font-family: var(--mono); font-size: 10px; color: var(--ink-400); margin-left: 12px; }
        .prop-topbar-right { display: flex; align-items: center; gap: 8px; }
        .prop-btn {
          padding: 7px 16px; border-radius: 5px; font-size: 13px; font-weight: 500;
          font-family: inherit; cursor: pointer; transition: all 0.1s;
        }
        .prop-btn-ghost { background: none; border: 1px solid var(--warm-200); color: var(--ink-600); }
        .prop-btn-ghost:hover { border-color: var(--warm-300); background: var(--warm-100); }
        .prop-btn-ghost.active { background: var(--ink-900); color: var(--parchment); border-color: var(--ink-900); }
        .prop-btn-primary { background: var(--ember); border: 1px solid var(--ember); color: #fff; }
        .prop-btn-primary:hover { background: var(--ember-light); }
        .prop-status { font-family: var(--mono); font-size: 10px; color: var(--ink-300); display: flex; align-items: center; gap: 4px; }

        /* ── Layout ── */
        .prop-layout { display: flex; flex: 1; overflow: hidden; }

        /* ── Sidebar (block palette) ── */
        .prop-palette {
          width: 220px; min-width: 220px; background: var(--parchment);
          border-right: 1px solid var(--warm-200); padding: 16px 12px;
          display: flex; flex-direction: column; gap: 4px;
          overflow-y: auto; flex-shrink: 0;
        }
        .prop-palette-label {
          font-family: var(--mono); font-size: 9px; font-weight: 500;
          color: var(--ink-400); letter-spacing: 0.1em; text-transform: uppercase;
          padding: 8px 8px 4px; 
        }
        .palette-item {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 10px; border-radius: 6px; cursor: pointer;
          transition: background 0.06s; border: 1px solid transparent;
        }
        .palette-item:hover { background: var(--warm-100); border-color: var(--warm-200); }
        .palette-icon {
          width: 30px; height: 30px; border-radius: 5px;
          background: var(--warm-100); border: 1px solid var(--warm-200);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: var(--ink-500); flex-shrink: 0;
          font-family: var(--mono);
        }
        .palette-label { font-size: 13px; color: var(--ink-700); }
        .palette-desc { font-size: 10.5px; color: var(--ink-400); }

        /* ── Canvas ── */
        .prop-canvas {
          flex: 1; overflow-y: auto; padding: 32px 40px 120px;
        }
        .prop-canvas::-webkit-scrollbar { width: 5px; }
        .prop-canvas::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }

        /* ── Proposal header ── */
        .prop-header {
          max-width: 640px; margin: 0 auto 32px; padding-bottom: 24px;
          border-bottom: 1px solid var(--warm-200);
        }
        .prop-header-badge {
          font-family: var(--mono); font-size: 9px; font-weight: 500;
          color: var(--ember); letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 12px;
        }
        .prop-header h1 {
          font-family: 'Cormorant Garamond', serif; font-size: 32px;
          font-weight: 600; color: var(--ink-900); letter-spacing: -0.02em;
          margin-bottom: 12px; line-height: 1.2;
        }
        .prop-header-info {
          display: flex; gap: 24px; font-family: var(--mono);
          font-size: 11px; color: var(--ink-400);
        }
        .prop-header-info span { display: flex; align-items: center; gap: 4px; }

        /* ── Sections ── */
        .prop-section {
          max-width: 640px; margin: 0 auto 16px;
          background: var(--parchment); border: 1px solid var(--warm-200);
          border-radius: 8px; overflow: hidden; transition: box-shadow 0.15s, border-color 0.15s;
        }
        .prop-section:hover { border-color: var(--warm-300); box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .prop-section.dragging { opacity: 0.4; }
        .prop-section.drop-target { border-color: var(--ember); box-shadow: 0 0 0 2px rgba(176,125,79,0.1); }

        .prop-section-head {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px; border-bottom: 1px solid var(--warm-100);
          background: var(--warm-50);
        }
        .prop-drag-handle {
          cursor: grab; color: var(--ink-300); padding: 2px;
          border-radius: 3px; display: flex; align-items: center;
        }
        .prop-drag-handle:hover { color: var(--ink-500); background: var(--warm-200); }
        .prop-drag-handle:active { cursor: grabbing; }
        .prop-section-type {
          font-family: var(--mono); font-size: 14px; color: var(--ember);
          width: 24px; text-align: center; flex-shrink: 0;
        }
        .prop-section-title {
          font-family: 'Cormorant Garamond', serif; font-size: 17px;
          font-weight: 600; color: var(--ink-800); cursor: text; flex: 1;
        }
        .prop-title-input {
          font-family: 'Cormorant Garamond', serif; font-size: 17px;
          font-weight: 600; color: var(--ink-800); border: none; outline: none;
          background: transparent; flex: 1;
        }
        .prop-delete {
          background: none; border: none; cursor: pointer; color: var(--ink-300);
          padding: 4px; border-radius: 4px; display: flex; opacity: 0;
          transition: opacity 0.1s;
        }
        .prop-section:hover .prop-delete { opacity: 1; }
        .prop-delete:hover { background: rgba(194,75,56,0.08); color: #c24b38; }

        .prop-body { padding: 16px; }

        .prop-textarea {
          width: 100%; min-height: 60px; border: 1px solid var(--warm-200);
          border-radius: 5px; padding: 10px 12px; font-family: inherit;
          font-size: 14px; color: var(--ink-700); background: #fff;
          outline: none; resize: vertical; line-height: 1.6;
        }
        .prop-textarea:focus { border-color: var(--ember); box-shadow: 0 0 0 3px rgba(176,125,79,0.06); }
        .prop-text { font-size: 14px; line-height: 1.7; color: var(--ink-700); }

        /* Scope items */
        .scope-item {
          display: flex; align-items: center; gap: 10px;
          padding: 6px 0; border-bottom: 1px solid var(--warm-100);
        }
        .scope-item:last-child { border-bottom: none; }
        .scope-num {
          font-family: var(--mono); font-size: 11px; color: var(--ink-300);
          width: 22px; flex-shrink: 0;
        }
        .scope-input {
          flex: 1; border: none; outline: none; font-family: inherit;
          font-size: 14px; color: var(--ink-700); background: transparent;
          padding: 2px 0;
        }
        .scope-text { font-size: 14px; color: var(--ink-700); }
        .scope-delete {
          background: none; border: none; cursor: pointer; color: var(--ink-300);
          font-size: 16px; padding: 2px 4px; border-radius: 3px; line-height: 1;
          opacity: 0; transition: opacity 0.1s;
        }
        .scope-item:hover .scope-delete, .pricing-row:hover .scope-delete { opacity: 1; }
        .scope-delete:hover { color: #c24b38; }

        .prop-add-item {
          background: none; border: 1px dashed var(--warm-300); border-radius: 5px;
          padding: 6px 12px; font-family: var(--mono); font-size: 11px;
          color: var(--ink-400); cursor: pointer; margin-top: 8px;
          width: 100%; transition: all 0.1s;
        }
        .prop-add-item:hover { border-color: var(--ember); color: var(--ember); background: var(--ember-bg); }

        /* Timeline */
        .timeline-track { padding: 4px 0; }
        .timeline-item { display: flex; gap: 12px; min-height: 44px; }
        .timeline-dot-wrap { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 16px; padding-top: 6px; }
        .timeline-dot { width: 8px; height: 8px; border-radius: 50%; border: 2px solid var(--ember); background: var(--parchment); flex-shrink: 0; z-index: 1; }
        .timeline-line { width: 1px; flex: 1; background: var(--warm-300); margin-top: 4px; }
        .timeline-content { flex: 1; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-bottom: 12px; }
        .timeline-label { font-size: 14px; color: var(--ink-700); }
        .timeline-duration { font-family: var(--mono); font-size: 11px; color: var(--ink-400); background: var(--warm-100); padding: 2px 8px; border-radius: 3px; }
        .timeline-input { border: 1px solid var(--warm-200); border-radius: 4px; padding: 4px 8px; font-family: inherit; font-size: 13px; color: var(--ink-700); outline: none; background: #fff; }
        .timeline-input:focus { border-color: var(--ember); }

        /* Pricing */
        .pricing-table { border: 1px solid var(--warm-200); border-radius: 6px; overflow: hidden; }
        .pricing-header {
          display: flex; padding: 8px 12px; background: var(--warm-100);
          font-family: var(--mono); font-size: 10px; font-weight: 500;
          color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.06em;
          border-bottom: 1px solid var(--warm-200);
        }
        .pricing-row {
          display: flex; align-items: center; padding: 8px 12px;
          border-bottom: 1px solid var(--warm-100);
        }
        .pricing-row:last-child { border-bottom: none; }
        .desc-col { flex: 1; } .qty-col { width: 60px; text-align: center; }
        .rate-col { width: 90px; text-align: right; } .total-col { width: 90px; text-align: right; }
        .act-col { width: 28px; text-align: center; }
        .pricing-cell { font-size: 14px; color: var(--ink-700); }
        .pricing-cell.total-col { font-family: var(--mono); font-weight: 500; }
        .pricing-input {
          border: 1px solid var(--warm-200); border-radius: 3px; padding: 4px 6px;
          font-family: inherit; font-size: 13px; color: var(--ink-700); outline: none; background: #fff;
        }
        .pricing-input:focus { border-color: var(--ember); }
        .pricing-input.qty-col, .pricing-input.rate-col { text-align: right; }
        .pricing-footer {
          display: flex; justify-content: flex-end; gap: 24px;
          padding: 8px 12px; font-size: 13px; color: var(--ink-600);
        }
        .pricing-footer.total-row {
          border-top: 1px solid var(--warm-200); font-weight: 600;
          color: var(--ink-900); font-size: 15px; padding: 10px 12px;
        }
        .pricing-subtotal-val { font-family: var(--mono); min-width: 90px; text-align: right; }

        /* Signature */
        .sig-box { padding: 8px 0; }
        .sig-row { display: flex; gap: 24px; margin-bottom: 20px; }
        .sig-field { flex: 1; }
        .sig-label { font-family: var(--mono); font-size: 10px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; display: block; }
        .sig-line { font-size: 14px; color: var(--ink-700); padding: 6px 0; border-bottom: 1px solid var(--warm-300); }
        .sig-sign-area {
          height: 80px; border: 1px dashed var(--warm-300); border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.1s; margin-bottom: 12px;
        }
        .sig-sign-area:hover { border-color: var(--ember); background: var(--ember-bg); }
        .sig-placeholder { font-family: var(--mono); font-size: 12px; color: var(--ink-300); }
        .sig-legal { font-size: 11px; color: var(--ink-400); line-height: 1.5; }

        /* ── Grand total bar ── */
        .grand-total-bar {
          max-width: 640px; margin: 24px auto 0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; background: var(--ink-900); border-radius: 8px;
        }
        .grand-total-label { font-family: var(--mono); font-size: 11px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; }
        .grand-total-val { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; color: var(--ember-light); }
      `}</style>

      <div className="proposal-builder">
        {/* ── Top bar ── */}
        <div className="prop-topbar">
          <div className="prop-topbar-left">
            <button className="prop-back">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span className="prop-topbar-title">Proposal</span>
            <span className="prop-topbar-meta">draft · edited 2m ago</span>
          </div>
          <div className="prop-topbar-right">
            <span className="prop-status">
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#5a9a3c" }} /> Auto-saved
            </span>
            <button className={`prop-btn prop-btn-ghost${previewMode ? " active" : ""}`} onClick={() => setPreviewMode(!previewMode)}>
              {previewMode ? "Edit" : "Preview"}
            </button>
            <button className="prop-btn prop-btn-primary">Send to Client</button>
          </div>
        </div>

        <div className="prop-layout">
          {/* ── Block palette ── */}
          {!previewMode && (
            <div className="prop-palette">
              <div className="prop-palette-label">add sections</div>
              {SECTION_TEMPLATES.map(t => (
                <div key={t.type} className="palette-item" onClick={() => addSection(t.type)}>
                  <div className="palette-icon">{t.icon}</div>
                  <div>
                    <div className="palette-label">{t.label}</div>
                    <div className="palette-desc">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Canvas ── */}
          <div className="prop-canvas">
            {/* Proposal header */}
            <div className="prop-header">
              <div className="prop-header-badge">Proposal</div>
              <h1>{projectName}</h1>
              <div className="prop-header-info">
                <span>◆ Prepared for {clientName}</span>
                <span>↳ {proposalDate}</span>
                <span>⏱ Valid until {validUntil}</span>
              </div>
            </div>

            {/* Sections */}
            {sections.map((section, idx) => renderSection(section, idx))}

            {/* Grand total */}
            <div className="grand-total-bar">
              <span className="grand-total-label">Project Total</span>
              <span className="grand-total-val">${grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
