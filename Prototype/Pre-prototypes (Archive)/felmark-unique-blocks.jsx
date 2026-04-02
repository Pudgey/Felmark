import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   FELMARK — UNIQUE EDITOR BLOCKS
   Blocks no other tool has.
   ═══════════════════════════════════════════ */


// ═══ 1. INTERACTIVE PRICING CONFIGURATOR ═══
// Client builds their own package by toggling options
function PricingConfigurator() {
  const [selected, setSelected] = useState(new Set(["logo", "colors", "typography"]));

  const options = [
    { id: "logo", name: "Logo Design", desc: "Primary + secondary + icon mark", price: 1200, required: true, category: "Core" },
    { id: "colors", name: "Color Palette", desc: "Primary, secondary, accent, semantic", price: 400, required: true, category: "Core" },
    { id: "typography", name: "Typography System", desc: "Font pairings, scale, hierarchy", price: 400, required: true, category: "Core" },
    { id: "guidelines", name: "Brand Guidelines Doc", desc: "40+ page PDF with usage rules", price: 800, category: "Deliverables" },
    { id: "social", name: "Social Media Kit", desc: "IG, LinkedIn, X templates (12 total)", price: 600, category: "Deliverables" },
    { id: "stationery", name: "Stationery Suite", desc: "Business card, letterhead, envelope", price: 500, category: "Deliverables" },
    { id: "iconset", name: "Custom Icon Set", desc: "24 icons matching brand style", price: 900, category: "Extras" },
    { id: "animation", name: "Logo Animation", desc: "5-second animated logo mark", price: 700, category: "Extras" },
    { id: "strategy", name: "Brand Strategy Session", desc: "2-hour workshop + positioning doc", price: 1500, category: "Extras" },
  ];

  const toggle = (id) => {
    const opt = options.find(o => o.id === id);
    if (opt.required) return;
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const total = options.filter(o => selected.has(o.id)).reduce((s, o) => s + o.price, 0);
  const categories = [...new Set(options.map(o => o.category))];

  return (
    <div className="ub-configurator">
      <div className="ub-header">
        <span className="ub-badge" style={{ color: "#b07d4f", background: "rgba(176,125,79,0.06)", borderColor: "rgba(176,125,79,0.1)" }}>Interactive</span>
        <span className="ub-title">Build your package</span>
        <span className="ub-subtitle">Toggle options on/off — price updates live</span>
      </div>
      <div className="ub-config-body">
        <div className="ub-config-options">
          {categories.map(cat => (
            <div key={cat}>
              <div className="ub-config-cat">{cat}</div>
              {options.filter(o => o.category === cat).map(opt => {
                const isOn = selected.has(opt.id);
                return (
                  <div key={opt.id} className={`ub-config-opt${isOn ? " on" : ""}${opt.required ? " required" : ""}`}
                    onClick={() => toggle(opt.id)}>
                    <div className={`ub-config-toggle${isOn ? " on" : ""}`}>
                      <div className="ub-config-toggle-dot" />
                    </div>
                    <div className="ub-config-opt-info">
                      <div className="ub-config-opt-name">
                        {opt.name}
                        {opt.required && <span className="ub-config-required">Required</span>}
                      </div>
                      <div className="ub-config-opt-desc">{opt.desc}</div>
                    </div>
                    <div className={`ub-config-opt-price${isOn ? " on" : ""}`}>${opt.price.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="ub-config-summary">
          <div className="ub-config-summary-label">Your package</div>
          <div className="ub-config-summary-items">
            {options.filter(o => selected.has(o.id)).map(o => (
              <div key={o.id} className="ub-config-summary-item">
                <span>✓ {o.name}</span>
                <span>${o.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="ub-config-summary-total">
            <span>Total investment</span>
            <span className="ub-config-total-val">${total.toLocaleString()}</span>
          </div>
          <div className="ub-config-summary-note">
            {selected.size} of {options.length} options selected
          </div>
          <button className="ub-config-accept">Accept Package →</button>
        </div>
      </div>
    </div>
  );
}


// ═══ 2. SCOPE BOUNDARY ═══
// Crystal clear what's in scope and what's not
function ScopeBoundary() {
  const inScope = [
    { item: "Logo design — primary + secondary + icon", status: "done" },
    { item: "Color palette — 5 colors with accessibility", status: "done" },
    { item: "Typography system — 3 fonts, full scale", status: "active" },
    { item: "Brand guidelines document — 40+ pages", status: "active" },
    { item: "Social media templates — IG + LinkedIn", status: "upcoming" },
  ];
  const outScope = [
    { item: "Website design or development", reason: "Separate engagement" },
    { item: "Copywriting or content creation", reason: "Client provides copy" },
    { item: "Photography or video production", reason: "Recommend vendor list provided" },
    { item: "Print production or manufacturing", reason: "Files print-ready, client manages production" },
    { item: "Ongoing social media management", reason: "Templates provided, not management" },
  ];
  const statusCfg = { done: { color: "#5a9a3c", icon: "✓" }, active: { color: "#b07d4f", icon: "●" }, upcoming: { color: "#9b988f", icon: "○" } };

  return (
    <div className="ub-scope">
      <div className="ub-header">
        <span className="ub-badge" style={{ color: "#5a9a3c", background: "rgba(90,154,60,0.06)", borderColor: "rgba(90,154,60,0.1)" }}>Scope</span>
        <span className="ub-title">Scope boundary</span>
      </div>
      <div className="ub-scope-grid">
        <div className="ub-scope-col in">
          <div className="ub-scope-col-header in">
            <span className="ub-scope-col-icon">✓</span>
            <span>Included in this project</span>
          </div>
          {inScope.map((s, i) => {
            const st = statusCfg[s.status];
            return (
              <div key={i} className="ub-scope-item in">
                <span className="ub-scope-status" style={{ color: st.color }}>{st.icon}</span>
                <span className="ub-scope-text">{s.item}</span>
              </div>
            );
          })}
        </div>
        <div className="ub-scope-divider">
          <div className="ub-scope-divider-line" />
          <span className="ub-scope-divider-label">Boundary</span>
          <div className="ub-scope-divider-line" />
        </div>
        <div className="ub-scope-col out">
          <div className="ub-scope-col-header out">
            <span className="ub-scope-col-icon">✕</span>
            <span>Not included</span>
          </div>
          {outScope.map((s, i) => (
            <div key={i} className="ub-scope-item out">
              <span className="ub-scope-x">✕</span>
              <div className="ub-scope-out-info">
                <span className="ub-scope-text">{s.item}</span>
                <span className="ub-scope-reason">{s.reason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="ub-scope-footer">Changes to scope require a signed Change Order with adjusted timeline and budget.</div>
    </div>
  );
}


// ═══ 3. CLIENT DECISION PICKER ═══
// Client picks between options, price/timeline update live
function DecisionPicker() {
  const [choice, setChoice] = useState(null);

  const options = [
    {
      id: "a", label: "Direction A", subtitle: "Organic & Warm",
      desc: "Earth tones, serif typography, hand-drawn textures. Feels artisanal, approachable, and premium without being corporate.",
      colors: ["#2c2a25", "#b07d4f", "#d5d1c8", "#faf9f7", "#5a9a3c"],
      font: "Cormorant Garamond",
      timeline: "3 weeks", price: 4200,
      pros: ["Unique & memorable", "Warm & approachable", "Trending aesthetic"],
    },
    {
      id: "b", label: "Direction B", subtitle: "Clean & Modern",
      desc: "Monochrome with a single accent, geometric sans-serif, sharp lines. Feels professional, scalable, and tech-forward.",
      colors: ["#1a1a1a", "#3b82f6", "#e5e5e5", "#fafafa", "#10b981"],
      font: "Inter",
      timeline: "2 weeks", price: 3600,
      pros: ["Highly versatile", "Scales easily", "Modern & clean"],
    },
    {
      id: "c", label: "Direction C", subtitle: "Bold & Expressive",
      desc: "High contrast, oversized type, dynamic color palette. Feels energetic, confident, and impossible to ignore.",
      colors: ["#0f0f0f", "#ff5722", "#ffd600", "#ffffff", "#7c4dff"],
      font: "Space Grotesk",
      timeline: "4 weeks", price: 4800,
      pros: ["Standout presence", "Highly expressive", "Strong brand recall"],
    },
  ];

  return (
    <div className="ub-decision">
      <div className="ub-header">
        <span className="ub-badge" style={{ color: "#7c6b9e", background: "rgba(124,107,158,0.06)", borderColor: "rgba(124,107,158,0.1)" }}>Decision</span>
        <span className="ub-title">Choose a direction</span>
        <span className="ub-subtitle">Click to select — your choice will be locked in after approval</span>
      </div>
      <div className="ub-decision-grid">
        {options.map(opt => (
          <div key={opt.id} className={`ub-decision-card${choice === opt.id ? " chosen" : ""}`}
            onClick={() => setChoice(opt.id)}>
            {choice === opt.id && <div className="ub-decision-chosen-badge">✓ Selected</div>}
            <div className="ub-decision-label">{opt.label}</div>
            <div className="ub-decision-subtitle">{opt.subtitle}</div>

            {/* Color preview */}
            <div className="ub-decision-colors">
              {opt.colors.map((c, i) => <div key={i} className="ub-decision-color" style={{ background: c, border: c === "#fafafa" || c === "#faf9f7" || c === "#ffffff" ? "1px solid #e5e2db" : "none" }} />)}
            </div>

            {/* Font preview */}
            <div className="ub-decision-font" style={{ fontFamily: opt.font === "Cormorant Garamond" ? "'Cormorant Garamond', serif" : "inherit" }}>
              {opt.font}
            </div>

            <div className="ub-decision-desc">{opt.desc}</div>

            <div className="ub-decision-pros">
              {opt.pros.map((p, i) => <span key={i} className="ub-decision-pro">✓ {p}</span>)}
            </div>

            <div className="ub-decision-meta">
              <span className="ub-decision-meta-item">${opt.price.toLocaleString()}</span>
              <span className="ub-decision-meta-sep">·</span>
              <span className="ub-decision-meta-item">{opt.timeline}</span>
            </div>
          </div>
        ))}
      </div>
      {choice && (
        <div className="ub-decision-confirm">
          You selected <strong>{options.find(o => o.id === choice)?.label}</strong> — {options.find(o => o.id === choice)?.subtitle} · ${options.find(o => o.id === choice)?.price.toLocaleString()} · {options.find(o => o.id === choice)?.timeline}
        </div>
      )}
    </div>
  );
}


// ═══ 4. REVISION HEATMAP ═══
// Shows edit intensity across the document
function RevisionHeatmap() {
  const sections = [
    { name: "Logo Usage Rules", edits: 14, lastEdit: "2h ago", authors: ["A", "J"], heat: 95, lines: 42 },
    { name: "Color Palette", edits: 8, lastEdit: "3h ago", authors: ["A"], heat: 70, lines: 28 },
    { name: "Typography System", edits: 22, lastEdit: "15m ago", authors: ["A", "J", "S"], heat: 100, lines: 56 },
    { name: "Imagery Direction", edits: 3, lastEdit: "2d ago", authors: ["A"], heat: 25, lines: 18 },
    { name: "Social Templates", edits: 1, lastEdit: "5d ago", authors: ["A"], heat: 10, lines: 12 },
    { name: "Brand Voice", edits: 6, lastEdit: "Yesterday", authors: ["A"], heat: 50, lines: 34 },
    { name: "Usage Guidelines", edits: 11, lastEdit: "4h ago", authors: ["A", "S"], heat: 80, lines: 48 },
  ];

  const maxEdits = Math.max(...sections.map(s => s.edits));
  const authorColors = { A: "#b07d4f", J: "#7c8594", S: "#8a7e63" };

  return (
    <div className="ub-heatmap">
      <div className="ub-header">
        <span className="ub-badge" style={{ color: "#c24b38", background: "rgba(194,75,56,0.04)", borderColor: "rgba(194,75,56,0.08)" }}>Revisions</span>
        <span className="ub-title">Edit heatmap</span>
        <span className="ub-subtitle">Hotter = more recent edits</span>
      </div>
      <div className="ub-heatmap-body">
        {sections.map((s, i) => {
          const heatColor = s.heat >= 80 ? "#c24b38" : s.heat >= 50 ? "#c89360" : s.heat >= 25 ? "#5b7fa4" : "#b8b3a8";
          const heatBg = s.heat >= 80 ? "rgba(194,75,56,0.04)" : s.heat >= 50 ? "rgba(200,147,96,0.04)" : "transparent";
          return (
            <div key={i} className="ub-heatmap-row" style={{ background: heatBg }}>
              <div className="ub-heatmap-bar" style={{ width: `${(s.edits / maxEdits) * 100}%`, background: heatColor, opacity: 0.15 }} />
              <div className="ub-heatmap-heat-strip" style={{ background: heatColor, opacity: s.heat / 100 }} />
              <div className="ub-heatmap-content">
                <div className="ub-heatmap-name">{s.name}</div>
                <div className="ub-heatmap-meta">
                  <span>{s.edits} edits</span>
                  <span>·</span>
                  <span>{s.lines} lines</span>
                  <span>·</span>
                  <span>{s.lastEdit}</span>
                </div>
              </div>
              <div className="ub-heatmap-authors">
                {s.authors.map((a, j) => (
                  <span key={j} className="ub-heatmap-author" style={{ background: authorColors[a] }}>{a}</span>
                ))}
              </div>
              <div className="ub-heatmap-edit-count" style={{ color: heatColor }}>{s.edits}</div>
            </div>
          );
        })}
      </div>
      <div className="ub-heatmap-legend">
        <span className="ub-heatmap-legend-item"><span className="ub-heatmap-legend-dot" style={{ background: "#c24b38" }} />Hot (active now)</span>
        <span className="ub-heatmap-legend-item"><span className="ub-heatmap-legend-dot" style={{ background: "#c89360" }} />Warm (today)</span>
        <span className="ub-heatmap-legend-item"><span className="ub-heatmap-legend-dot" style={{ background: "#5b7fa4" }} />Cool (this week)</span>
        <span className="ub-heatmap-legend-item"><span className="ub-heatmap-legend-dot" style={{ background: "#b8b3a8" }} />Cold (stale)</span>
      </div>
    </div>
  );
}


// ═══ 5. ASSET CHECKLIST ═══
// What you need from the client, with upload status
function AssetChecklist() {
  const [items, setItems] = useState([
    { id: 1, name: "Company logo (vector)", desc: "SVG, EPS, or AI format preferred", status: "received", receivedDate: "Mar 18", fileType: "SVG" },
    { id: 2, name: "Brand colors (if existing)", desc: "Hex codes or Pantone references", status: "received", receivedDate: "Mar 18", fileType: "PDF" },
    { id: 3, name: "Competitor URLs", desc: "3–5 competitors for analysis", status: "received", receivedDate: "Mar 20", fileType: "Link" },
    { id: 4, name: "Photography assets", desc: "Team photos, office, products", status: "partial", note: "3 of 8 uploaded", fileType: "JPG" },
    { id: 5, name: "Content copy", desc: "Homepage, about, and services text", status: "missing", daysWaiting: 5 },
    { id: 6, name: "Social media access", desc: "Admin access to IG, LinkedIn, X", status: "missing", daysWaiting: 5 },
    { id: 7, name: "Target audience brief", desc: "Demographics, psychographics, personas", status: "not-needed", note: "We'll create this in discovery" },
  ]);

  const statusCfg = {
    received: { color: "#5a9a3c", icon: "✓", label: "Received" },
    partial: { color: "#c89360", icon: "◐", label: "Partial" },
    missing: { color: "#c24b38", icon: "!", label: "Missing" },
    "not-needed": { color: "#9b988f", icon: "—", label: "Not needed" },
  };

  const received = items.filter(i => i.status === "received").length;
  const total = items.filter(i => i.status !== "not-needed").length;

  return (
    <div className="ub-assets">
      <div className="ub-header">
        <span className="ub-badge" style={{ color: "#8a7e63", background: "rgba(138,126,99,0.06)", borderColor: "rgba(138,126,99,0.1)" }}>Assets</span>
        <span className="ub-title">What I need from you</span>
        <span className="ub-subtitle">{received} of {total} received</span>
      </div>
      {/* Progress bar */}
      <div className="ub-assets-progress">
        <div className="ub-assets-progress-bar">
          <div className="ub-assets-progress-fill" style={{ width: `${(received / total) * 100}%` }} />
        </div>
        <span className="ub-assets-progress-label">{Math.round((received / total) * 100)}%</span>
      </div>
      <div className="ub-assets-list">
        {items.map(item => {
          const st = statusCfg[item.status];
          return (
            <div key={item.id} className={`ub-asset-item ${item.status}`}>
              <div className="ub-asset-status" style={{ color: st.color, background: st.color + "08", borderColor: st.color + "15" }}>
                {st.icon}
              </div>
              <div className="ub-asset-info">
                <div className="ub-asset-name">{item.name}</div>
                <div className="ub-asset-desc">{item.desc}</div>
              </div>
              <div className="ub-asset-right">
                {item.status === "received" && (
                  <span className="ub-asset-tag received">{item.fileType} · {item.receivedDate}</span>
                )}
                {item.status === "partial" && (
                  <span className="ub-asset-tag partial">{item.note}</span>
                )}
                {item.status === "missing" && (
                  <span className="ub-asset-tag missing">{item.daysWaiting}d waiting</span>
                )}
                {item.status === "not-needed" && (
                  <span className="ub-asset-tag not-needed">{item.note}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="ub-assets-nudge">
        <span className="ub-assets-nudge-icon">⚡</span>
        <span>2 items are blocking progress.</span>
        <button className="ub-assets-nudge-btn">Send Reminder</button>
      </div>
    </div>
  );
}


// ═══ 6. PROGRESS STREAM ═══
// Visual timeline of work-in-progress snapshots
function ProgressStream() {
  const snapshots = [
    { id: 1, date: "Mar 20", label: "Initial sketches", desc: "Exploring 4 different logo directions based on discovery workshop", items: 4, type: "sketch", color: "#b8b3a8" },
    { id: 2, date: "Mar 23", label: "Direction selected", desc: "Client chose Direction A — organic, warm, serif-forward", items: 1, type: "decision", color: "#7c6b9e" },
    { id: 3, date: "Mar 25", label: "Logo refinement", desc: "3 variants of chosen direction with typography pairings", items: 3, type: "design", color: "#b07d4f" },
    { id: 4, date: "Mar 27", label: "Color exploration", desc: "5 palette options tested against accessibility standards", items: 5, type: "design", color: "#b07d4f" },
    { id: 5, date: "Mar 29", label: "Typography system", desc: "Cormorant Garamond + Outfit + JetBrains Mono — full scale defined", items: 1, type: "design", color: "#b07d4f" },
    { id: 6, date: "Today", label: "Guidelines draft", desc: "First 20 pages of brand guidelines document in progress", items: 1, type: "current", color: "#5a9a3c" },
  ];

  return (
    <div className="ub-stream">
      <div className="ub-header">
        <span className="ub-badge" style={{ color: "#5b7fa4", background: "rgba(91,127,164,0.06)", borderColor: "rgba(91,127,164,0.1)" }}>Progress</span>
        <span className="ub-title">Work stream</span>
        <span className="ub-subtitle">How we got here</span>
      </div>
      <div className="ub-stream-track">
        {snapshots.map((s, i) => {
          const isLast = i === snapshots.length - 1;
          return (
            <div key={s.id} className={`ub-stream-item${isLast ? " current" : ""}`}>
              <div className="ub-stream-connector">
                <div className="ub-stream-dot" style={{ background: isLast ? s.color : "transparent", borderColor: s.color }}>
                  {!isLast && <span style={{ color: s.color, fontSize: 9 }}>{s.type === "decision" ? "◆" : "✓"}</span>}
                  {isLast && <span style={{ color: "#fff", fontSize: 9 }}>●</span>}
                </div>
                {i < snapshots.length - 1 && <div className="ub-stream-line" style={{ background: s.color + "30" }} />}
              </div>
              <div className="ub-stream-content">
                <div className="ub-stream-date">{s.date}</div>
                <div className="ub-stream-label">{s.label}</div>
                <div className="ub-stream-desc">{s.desc}</div>
                {s.items > 1 && (
                  <div className="ub-stream-thumbs">
                    {Array.from({ length: Math.min(s.items, 4) }).map((_, j) => (
                      <div key={j} className="ub-stream-thumb" style={{ background: s.color + "12", borderColor: s.color + "20" }}>
                        <span style={{ color: s.color + "60", fontSize: 12 }}>{s.type === "sketch" ? "✎" : "◆"}</span>
                      </div>
                    ))}
                    {s.items > 4 && <span className="ub-stream-more">+{s.items - 4}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ═══ 7. DEPENDENCY MAP ═══
// Which deliverables depend on what
function DependencyMap() {
  const nodes = [
    { id: "discovery", label: "Discovery", status: "done", x: 0, y: 0, deps: [] },
    { id: "strategy", label: "Strategy Doc", status: "done", x: 1, y: 0, deps: ["discovery"] },
    { id: "logo", label: "Logo Design", status: "active", x: 2, y: 0, deps: ["strategy"] },
    { id: "colors", label: "Color Palette", status: "active", x: 2, y: 1, deps: ["strategy"] },
    { id: "type", label: "Typography", status: "active", x: 3, y: 0, deps: ["logo"] },
    { id: "imagery", label: "Imagery", status: "blocked", x: 3, y: 1, deps: ["colors"], blocker: "Waiting on client photos" },
    { id: "guidelines", label: "Guidelines Doc", status: "upcoming", x: 4, y: 0, deps: ["type", "imagery", "colors"] },
    { id: "social", label: "Social Kit", status: "upcoming", x: 5, y: 0, deps: ["guidelines"] },
  ];

  const statusCfg = {
    done: { color: "#5a9a3c", bg: "rgba(90,154,60,0.04)", icon: "✓" },
    active: { color: "#b07d4f", bg: "rgba(176,125,79,0.04)", icon: "●" },
    blocked: { color: "#c24b38", bg: "rgba(194,75,56,0.04)", icon: "!" },
    upcoming: { color: "#9b988f", bg: "transparent", icon: "○" },
  };

  return (
    <div className="ub-deps">
      <div className="ub-header">
        <span className="ub-badge" style={{ color: "#5b7fa4", background: "rgba(91,127,164,0.06)", borderColor: "rgba(91,127,164,0.1)" }}>Dependencies</span>
        <span className="ub-title">Deliverable map</span>
        <span className="ub-subtitle">What depends on what</span>
      </div>
      <div className="ub-deps-canvas">
        <svg width="100%" viewBox="0 0 640 200" style={{ display: "block" }}>
          {/* Arrows */}
          {nodes.map(node => node.deps.map(depId => {
            const dep = nodes.find(n => n.id === depId);
            if (!dep) return null;
            const x1 = dep.x * 105 + 90;
            const y1 = dep.y * 80 + 60;
            const x2 = node.x * 105 + 20;
            const y2 = node.y * 80 + 60;
            const st = statusCfg[node.status];
            return <path key={`${depId}-${node.id}`} d={`M${x1} ${y1} C${x1 + 30} ${y1}, ${x2 - 30} ${y2}, ${x2} ${y2}`} fill="none" stroke={st.color} strokeWidth="1" opacity="0.25" strokeDasharray={node.status === "upcoming" ? "4 3" : "none"} />;
          }))}
          {/* Nodes */}
          {nodes.map(node => {
            const st = statusCfg[node.status];
            const nx = node.x * 105 + 20;
            const ny = node.y * 80 + 35;
            return (
              <g key={node.id}>
                <rect x={nx} y={ny} width={70} height={48} rx="8" fill={st.bg} stroke={st.color} strokeWidth="0.5" opacity={node.status === "upcoming" ? 0.4 : 1} />
                <text x={nx + 35} y={ny + 22} textAnchor="middle" dominantBaseline="central" fill={st.color} fontSize="10" fontWeight="500" fontFamily="Outfit, sans-serif">{node.label}</text>
                <text x={nx + 35} y={ny + 37} textAnchor="middle" dominantBaseline="central" fill={st.color} fontSize="9" fontFamily="'JetBrains Mono', monospace" opacity="0.6">{st.icon} {node.status}</text>
              </g>
            );
          })}
        </svg>
      </div>
      {/* Blocked callout */}
      {nodes.filter(n => n.status === "blocked").map(n => (
        <div key={n.id} className="ub-deps-blocked">
          <span className="ub-deps-blocked-icon">!</span>
          <span className="ub-deps-blocked-text"><strong>{n.label}</strong> is blocked: {n.blocker}</span>
          <button className="ub-deps-blocked-btn">Resolve</button>
        </div>
      ))}
    </div>
  );
}


// ═══ 8. AVAILABILITY BLOCK ═══
// Client picks a meeting time inline in the document
function AvailabilityPicker() {
  const [selected, setSelected] = useState(null);
  const days = [
    { date: "Mon, Apr 1", slots: [
      { time: "10:00 AM", duration: "30 min", available: true },
      { time: "2:00 PM", duration: "30 min", available: true },
      { time: "4:00 PM", duration: "30 min", available: false },
    ]},
    { date: "Tue, Apr 2", slots: [
      { time: "9:00 AM", duration: "30 min", available: true },
      { time: "11:00 AM", duration: "30 min", available: true },
      { time: "3:00 PM", duration: "30 min", available: true },
    ]},
    { date: "Wed, Apr 3", slots: [
      { time: "10:00 AM", duration: "30 min", available: true },
      { time: "1:00 PM", duration: "30 min", available: true },
    ]},
    { date: "Thu, Apr 4", slots: [
      { time: "9:00 AM", duration: "30 min", available: true },
      { time: "2:00 PM", duration: "30 min", available: true },
      { time: "4:30 PM", duration: "30 min", available: true },
    ]},
  ];

  return (
    <div className="ub-avail">
      <div className="ub-header">
        <span className="ub-badge" style={{ color: "#5b7fa4", background: "rgba(91,127,164,0.06)", borderColor: "rgba(91,127,164,0.1)" }}>Schedule</span>
        <span className="ub-title">Pick a time for our kickoff call</span>
        <span className="ub-subtitle">30-minute video call · All times in your timezone</span>
      </div>
      <div className="ub-avail-grid">
        {days.map((day, di) => (
          <div key={di} className="ub-avail-day">
            <div className="ub-avail-date">{day.date}</div>
            <div className="ub-avail-slots">
              {day.slots.map((slot, si) => {
                const key = `${di}-${si}`;
                const isSelected = selected === key;
                return (
                  <button key={si}
                    className={`ub-avail-slot${isSelected ? " chosen" : ""}${!slot.available ? " taken" : ""}`}
                    onClick={() => slot.available && setSelected(key)}
                    disabled={!slot.available}>
                    <span className="ub-avail-time">{slot.time}</span>
                    <span className="ub-avail-dur">{slot.duration}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <div className="ub-avail-confirm">
          <span>✓</span>
          <span>Selected: {days[parseInt(selected.split("-")[0])].date} at {days[parseInt(selected.split("-")[0])].slots[parseInt(selected.split("-")[1])].time}</span>
          <button className="ub-avail-confirm-btn">Confirm Booking</button>
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════
   SHOWCASE
   ═══════════════════════════ */
export default function UniqueBlocks() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
        .page{font-family:'Outfit',sans-serif;font-size:15px;color:var(--ink-700);background:var(--parchment);min-height:100vh}
        .canvas{max-width:780px;margin:0 auto;padding:40px 32px 100px}
        .doc-h1{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:var(--ink-900);margin-bottom:6px}
        .doc-meta{font-family:var(--mono);font-size:11px;color:var(--ink-400);margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--warm-200);display:flex;gap:12px}
        .doc-p{font-size:15px;color:var(--ink-600);line-height:1.8;margin-bottom:12px}
        .cat{font-family:var(--mono);font-size:9px;color:var(--ink-300);letter-spacing:.1em;text-transform:uppercase;margin:36px 0 12px;display:flex;align-items:center;gap:8px}.cat::after{content:'';flex:1;height:1px;background:var(--warm-200)}

        /* ── Shared ── */
        .ub-header{display:flex;align-items:center;gap:10px;padding:14px 20px;border-bottom:1px solid var(--warm-100);flex-wrap:wrap}
        .ub-badge{font-family:var(--mono);font-size:9px;font-weight:500;padding:2px 8px;border-radius:3px;border:1px solid}
        .ub-title{font-size:16px;font-weight:500;color:var(--ink-800)}
        .ub-subtitle{font-size:13px;color:var(--ink-400);margin-left:auto}

        /* ═══ CONFIGURATOR ═══ */
        .ub-configurator{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0;background:#fff}
        .ub-config-body{display:flex}
        .ub-config-options{flex:1;padding:16px;border-right:1px solid var(--warm-100)}
        .ub-config-cat{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.08em;padding:10px 0 6px}
        .ub-config-opt{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:7px;cursor:pointer;transition:all .08s;border:1px solid transparent;margin-bottom:3px}
        .ub-config-opt:hover{background:var(--warm-50);border-color:var(--warm-200)}
        .ub-config-opt.on{background:var(--ember-bg);border-color:rgba(176,125,79,0.08)}
        .ub-config-opt.required{opacity:1}
        .ub-config-toggle{width:32px;height:18px;border-radius:9px;background:var(--warm-200);position:relative;transition:background .15s;flex-shrink:0}
        .ub-config-toggle.on{background:var(--ember)}
        .ub-config-toggle-dot{width:14px;height:14px;border-radius:50%;background:#fff;position:absolute;top:2px;left:2px;transition:transform .15s;box-shadow:0 1px 3px rgba(0,0,0,0.1)}
        .ub-config-toggle.on .ub-config-toggle-dot{transform:translateX(14px)}
        .ub-config-opt-info{flex:1}
        .ub-config-opt-name{font-size:14px;font-weight:500;color:var(--ink-700);display:flex;align-items:center;gap:6px}
        .ub-config-required{font-family:var(--mono);font-size:8px;color:var(--ink-300);background:var(--warm-100);padding:0 5px;border-radius:2px}
        .ub-config-opt-desc{font-size:12px;color:var(--ink-400);margin-top:1px}
        .ub-config-opt-price{font-family:var(--mono);font-size:13px;font-weight:500;color:var(--ink-300);flex-shrink:0;transition:color .15s}
        .ub-config-opt-price.on{color:var(--ember)}

        .ub-config-summary{width:240px;padding:16px;background:var(--warm-50);display:flex;flex-direction:column}
        .ub-config-summary-label{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px}
        .ub-config-summary-items{flex:1;display:flex;flex-direction:column;gap:2px}
        .ub-config-summary-item{display:flex;justify-content:space-between;font-size:12px;color:var(--ink-500);padding:3px 0}
        .ub-config-summary-total{display:flex;justify-content:space-between;padding:10px 0;margin-top:10px;border-top:1px solid var(--warm-200);font-size:14px;font-weight:500;color:var(--ink-800)}
        .ub-config-total-val{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:var(--ember)}
        .ub-config-summary-note{font-family:var(--mono);font-size:10px;color:var(--ink-300);margin-bottom:10px}
        .ub-config-accept{padding:10px;border-radius:7px;border:none;background:var(--ink-900);color:#fff;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;transition:background .1s}
        .ub-config-accept:hover{background:var(--ink-800)}

        /* ═══ SCOPE BOUNDARY ═══ */
        .ub-scope{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0;background:#fff}
        .ub-scope-grid{display:flex;padding:0}
        .ub-scope-col{flex:1;padding:16px}
        .ub-scope-col-header{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;margin-bottom:10px;padding:6px 10px;border-radius:6px}
        .ub-scope-col-header.in{color:#5a9a3c;background:rgba(90,154,60,0.04)}
        .ub-scope-col-header.out{color:#c24b38;background:rgba(194,75,56,0.03)}
        .ub-scope-col-icon{font-size:12px}
        .ub-scope-item{display:flex;align-items:flex-start;gap:8px;padding:7px 0;border-bottom:1px solid var(--warm-100);font-size:13px}
        .ub-scope-item:last-child{border-bottom:none}
        .ub-scope-status{font-size:11px;width:16px;flex-shrink:0;text-align:center;margin-top:2px}
        .ub-scope-x{font-size:10px;color:#c24b38;width:16px;flex-shrink:0;text-align:center;margin-top:2px}
        .ub-scope-text{color:var(--ink-600)}
        .ub-scope-out-info{display:flex;flex-direction:column}.ub-scope-reason{font-size:11px;color:var(--ink-300);margin-top:1px}
        .ub-scope-divider{width:1px;display:flex;flex-direction:column;align-items:center;padding:16px 0}
        .ub-scope-divider-line{flex:1;width:1px;background:repeating-linear-gradient(180deg,var(--warm-300),var(--warm-300) 4px,transparent 4px,transparent 8px)}
        .ub-scope-divider-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);writing-mode:vertical-lr;text-orientation:mixed;letter-spacing:.06em;text-transform:uppercase;padding:8px 0}
        .ub-scope-footer{padding:10px 20px;background:var(--warm-50);border-top:1px solid var(--warm-100);font-family:var(--mono);font-size:10px;color:var(--ink-300);text-align:center}

        /* ═══ DECISION PICKER ═══ */
        .ub-decision{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0;background:#fff}
        .ub-decision-grid{display:flex;gap:12px;padding:20px}
        .ub-decision-card{flex:1;border:1px solid var(--warm-200);border-radius:10px;padding:18px;cursor:pointer;transition:all .12s;position:relative;overflow:hidden}
        .ub-decision-card:hover{border-color:var(--warm-300);box-shadow:0 2px 12px rgba(0,0,0,0.03);transform:translateY(-2px)}
        .ub-decision-card.chosen{border-color:var(--ember);box-shadow:0 0 0 1px var(--ember);background:var(--ember-bg)}
        .ub-decision-chosen-badge{position:absolute;top:8px;right:8px;font-family:var(--mono);font-size:9px;color:#fff;background:var(--ember);padding:2px 8px;border-radius:3px}
        .ub-decision-label{font-size:16px;font-weight:600;color:var(--ink-800);margin-bottom:2px}
        .ub-decision-subtitle{font-family:var(--mono);font-size:10px;color:var(--ink-400);margin-bottom:10px}
        .ub-decision-colors{display:flex;gap:4px;margin-bottom:10px}
        .ub-decision-color{width:24px;height:24px;border-radius:5px}
        .ub-decision-font{font-size:18px;color:var(--ink-600);margin-bottom:8px}
        .ub-decision-desc{font-size:12.5px;color:var(--ink-500);line-height:1.5;margin-bottom:10px}
        .ub-decision-pros{display:flex;flex-direction:column;gap:2px;margin-bottom:10px}
        .ub-decision-pro{font-size:11px;color:#5a9a3c}
        .ub-decision-meta{display:flex;align-items:center;gap:4px;font-family:var(--mono);font-size:12px;color:var(--ink-400);padding-top:8px;border-top:1px solid var(--warm-100)}
        .ub-decision-meta-sep{color:var(--warm-300)}
        .ub-decision-confirm{padding:12px 20px;background:var(--ember-bg);border-top:1px solid rgba(176,125,79,0.08);font-size:13px;color:var(--ink-600);text-align:center}
        .ub-decision-confirm strong{color:var(--ember)}

        /* ═══ HEATMAP ═══ */
        .ub-heatmap{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0;background:#fff}
        .ub-heatmap-body{padding:4px}
        .ub-heatmap-row{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:6px;margin:2px 0;position:relative;overflow:hidden;transition:background .06s}
        .ub-heatmap-row:hover{filter:brightness(0.98)}
        .ub-heatmap-bar{position:absolute;left:0;top:0;bottom:0;z-index:0;border-radius:6px}
        .ub-heatmap-heat-strip{position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:2px;z-index:1}
        .ub-heatmap-content{flex:1;z-index:2;padding-left:8px}
        .ub-heatmap-name{font-size:14px;font-weight:500;color:var(--ink-700)}
        .ub-heatmap-meta{font-family:var(--mono);font-size:10px;color:var(--ink-300);display:flex;gap:4px;margin-top:1px}
        .ub-heatmap-authors{display:flex;gap:2px;z-index:2;flex-shrink:0}
        .ub-heatmap-author{width:20px;height:20px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;color:#fff;border:1.5px solid #fff}
        .ub-heatmap-edit-count{font-family:var(--mono);font-size:14px;font-weight:600;z-index:2;min-width:24px;text-align:right;flex-shrink:0}
        .ub-heatmap-legend{display:flex;gap:12px;padding:8px 16px;border-top:1px solid var(--warm-100);font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .ub-heatmap-legend-item{display:flex;align-items:center;gap:4px}
        .ub-heatmap-legend-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0}

        /* ═══ ASSET CHECKLIST ═══ */
        .ub-assets{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0;background:#fff}
        .ub-assets-progress{padding:8px 20px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--warm-100)}
        .ub-assets-progress-bar{flex:1;height:4px;background:var(--warm-200);border-radius:2px;overflow:hidden}
        .ub-assets-progress-fill{height:100%;background:#5a9a3c;border-radius:2px;transition:width .3s}
        .ub-assets-progress-label{font-family:var(--mono);font-size:11px;color:#5a9a3c;font-weight:500}
        .ub-assets-list{padding:4px}
        .ub-asset-item{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:6px;border-bottom:1px solid var(--warm-100);transition:background .06s}
        .ub-asset-item:last-child{border-bottom:none}
        .ub-asset-item:hover{background:var(--warm-50)}
        .ub-asset-item.missing{background:rgba(194,75,56,0.01)}
        .ub-asset-status{width:26px;height:26px;border-radius:6px;border:1px solid;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}
        .ub-asset-info{flex:1;min-width:0}
        .ub-asset-name{font-size:14px;font-weight:500;color:var(--ink-700)}
        .ub-asset-desc{font-size:12px;color:var(--ink-400);margin-top:1px}
        .ub-asset-right{flex-shrink:0}
        .ub-asset-tag{font-family:var(--mono);font-size:10px;padding:2px 8px;border-radius:3px}
        .ub-asset-tag.received{color:#5a9a3c;background:rgba(90,154,60,0.06)}
        .ub-asset-tag.partial{color:#c89360;background:rgba(200,147,96,0.06)}
        .ub-asset-tag.missing{color:#c24b38;background:rgba(194,75,56,0.06)}
        .ub-asset-tag.not-needed{color:var(--ink-300);background:var(--warm-100)}
        .ub-assets-nudge{display:flex;align-items:center;gap:8px;padding:10px 20px;background:rgba(194,75,56,0.02);border-top:1px solid rgba(194,75,56,0.06);font-size:13px;color:var(--ink-500)}
        .ub-assets-nudge-icon{font-size:12px;color:#c89360}
        .ub-assets-nudge-btn{margin-left:auto;padding:5px 14px;border-radius:5px;border:1px solid var(--warm-200);background:#fff;font-size:12px;font-family:inherit;color:var(--ember);cursor:pointer}
        .ub-assets-nudge-btn:hover{background:var(--ember-bg)}

        /* ═══ PROGRESS STREAM ═══ */
        .ub-stream{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0;background:#fff}
        .ub-stream-track{padding:16px 20px}
        .ub-stream-item{display:flex;gap:14px;margin-bottom:0}
        .ub-stream-item:last-child{margin-bottom:0}
        .ub-stream-connector{display:flex;flex-direction:column;align-items:center;width:18px;flex-shrink:0}
        .ub-stream-dot{width:16px;height:16px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;z-index:1;background:#fff}
        .ub-stream-line{width:2px;flex:1;min-height:8px;margin:-2px 0}
        .ub-stream-content{flex:1;padding-bottom:16px}
        .ub-stream-date{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .ub-stream-label{font-size:14px;font-weight:500;color:var(--ink-700);margin:1px 0}
        .ub-stream-desc{font-size:13px;color:var(--ink-500);line-height:1.5}
        .ub-stream-thumbs{display:flex;gap:5px;margin-top:8px}
        .ub-stream-thumb{width:44px;height:44px;border-radius:6px;border:1px solid;display:flex;align-items:center;justify-content:center}
        .ub-stream-more{font-family:var(--mono);font-size:10px;color:var(--ink-300);display:flex;align-items:center}
        .ub-stream-item.current .ub-stream-label{color:var(--ember)}

        /* ═══ DEPENDENCY MAP ═══ */
        .ub-deps{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0;background:#fff}
        .ub-deps-canvas{padding:12px 16px;overflow-x:auto}
        .ub-deps-blocked{display:flex;align-items:center;gap:8px;padding:10px 20px;background:rgba(194,75,56,0.02);border-top:1px solid rgba(194,75,56,0.06);font-size:13px;color:var(--ink-500)}
        .ub-deps-blocked-icon{width:22px;height:22px;border-radius:5px;background:rgba(194,75,56,0.06);color:#c24b38;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0}
        .ub-deps-blocked-text{flex:1}.ub-deps-blocked-text strong{color:#c24b38}
        .ub-deps-blocked-btn{padding:5px 14px;border-radius:5px;border:1px solid rgba(194,75,56,0.15);background:#fff;font-size:12px;font-family:inherit;color:#c24b38;cursor:pointer;flex-shrink:0}

        /* ═══ AVAILABILITY ═══ */
        .ub-avail{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0;background:#fff}
        .ub-avail-grid{display:flex;gap:0;padding:0}
        .ub-avail-day{flex:1;padding:16px;border-right:1px solid var(--warm-100)}
        .ub-avail-day:last-child{border-right:none}
        .ub-avail-date{font-size:13px;font-weight:500;color:var(--ink-700);margin-bottom:8px;text-align:center}
        .ub-avail-slots{display:flex;flex-direction:column;gap:5px}
        .ub-avail-slot{width:100%;padding:10px;border:1px solid var(--warm-200);border-radius:7px;cursor:pointer;transition:all .08s;background:#fff;text-align:center;font-family:inherit}
        .ub-avail-slot:hover:not(:disabled){border-color:var(--ember);background:var(--ember-bg)}
        .ub-avail-slot.chosen{border-color:var(--ember);background:var(--ember);box-shadow:0 0 0 1px var(--ember)}
        .ub-avail-slot.taken{opacity:.3;cursor:not-allowed;text-decoration:line-through}
        .ub-avail-time{font-size:14px;font-weight:500;color:var(--ink-700);display:block}
        .ub-avail-slot.chosen .ub-avail-time{color:#fff}
        .ub-avail-dur{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .ub-avail-slot.chosen .ub-avail-dur{color:rgba(255,255,255,0.6)}
        .ub-avail-confirm{display:flex;align-items:center;gap:8px;padding:12px 20px;background:rgba(90,154,60,0.03);border-top:1px solid rgba(90,154,60,0.08);font-size:13px;color:var(--ink-600)}
        .ub-avail-confirm span:first-child{color:#5a9a3c;font-size:14px}
        .ub-avail-confirm-btn{margin-left:auto;padding:7px 18px;border-radius:6px;border:none;background:var(--ember);color:#fff;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;transition:background .1s}
        .ub-avail-confirm-btn:hover{background:var(--ember-light)}
      `}</style>

      <div className="page"><div className="canvas">
        <h1 className="doc-h1">Unique Editor Blocks</h1>
        <div className="doc-meta"><span>Blocks no other tool has</span><span>·</span><span>8 components</span><span>·</span><span>Type / to insert</span></div>

        <div className="cat">interactive pricing configurator</div>
        <p className="doc-p">Drop this into a proposal. The client toggles options on and off — the total updates live. They build their own package instead of accepting or rejecting yours. Required items stay locked.</p>
        <PricingConfigurator />

        <div className="cat">scope boundary</div>
        <p className="doc-p">The block that prevents scope creep. Left side: what's included with delivery status. Right side: what's explicitly excluded with reasons. A dashed "Boundary" divider makes the line unmistakable.</p>
        <ScopeBoundary />

        <div className="cat">client decision picker</div>
        <p className="doc-p">Three creative directions as cards. The client clicks to choose — selected card gets ember highlight with a "Selected" badge. Each shows color palette, typography, description, pros, price, and timeline. The choice is recorded.</p>
        <DecisionPicker />

        <div className="cat">revision heatmap</div>
        <p className="doc-p">See where the action is. Each document section shows edit count, authors, recency, and a colored heat bar. Red = active right now. Amber = edited today. Blue = this week. Grey = stale. Drop this into any document to understand where effort is going.</p>
        <RevisionHeatmap />

        <div className="cat">asset checklist</div>
        <p className="doc-p">What you need from the client, with live status. Green check for received, amber for partial, red for missing with days-waiting counter. Progress bar at top. "Send Reminder" button when items are blocking.</p>
        <AssetChecklist />

        <div className="cat">progress stream</div>
        <p className="doc-p">A visual story of how the project evolved. Each snapshot shows date, description, and thumbnail previews. The client sees the journey — not just the destination. Builds trust and justifies the investment.</p>
        <ProgressStream />

        <div className="cat">dependency map</div>
        <p className="doc-p">SVG diagram showing which deliverables depend on which. Color-coded by status: done (green), active (ember), blocked (red), upcoming (grey). Blocked items get a callout with the blocker and a "Resolve" button.</p>
        <DependencyMap />

        <div className="cat">availability picker</div>
        <p className="doc-p">Inline Calendly — right inside the proposal. The client picks a time slot without leaving the document. Unavailable slots are greyed out. Selected slot confirms with a "Confirm Booking" button. No separate scheduling link needed.</p>
        <AvailabilityPicker />
      </div></div>
    </>
  );
}
