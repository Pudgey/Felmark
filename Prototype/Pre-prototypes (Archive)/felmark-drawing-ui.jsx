import { useState, useRef } from "react";

/* ═══════════════════════════════════════════
   FELMARK DRAWING UI — Visual blocks that
   make proposals look like designed decks
   ═══════════════════════════════════════════ */

// ── 1. Annotated Image ──
// Markup screenshots with numbered callouts, arrows, and highlights
function AnnotatedImage() {
  const [activeCallout, setActiveCallout] = useState(null);
  const callouts = [
    { id: 1, x: 18, y: 22, label: "Hero section needs bolder CTA", color: "#c24b38" },
    { id: 2, x: 62, y: 15, label: "Navigation is too cluttered — simplify to 4 items", color: "#b07d4f" },
    { id: 3, x: 35, y: 58, label: "Add social proof section here", color: "#5a9a3c" },
    { id: 4, x: 78, y: 72, label: "Footer links need restructuring", color: "#5b7fa4" },
    { id: 5, x: 50, y: 42, label: "Typography hierarchy is flat — increase contrast", color: "#7c6b9e" },
  ];

  return (
    <div className="dui-annotated">
      <div className="dui-annotated-header">
        <span className="dui-block-badge">Annotation</span>
        <span className="dui-block-title">Current site audit — meridianstudio.co</span>
      </div>
      <div className="dui-annotated-canvas">
        {/* Simulated screenshot */}
        <div className="dui-annotated-img">
          <div className="dui-fake-site">
            <div className="dui-fake-nav"><div className="dui-fake-logo" /><div className="dui-fake-nav-items"><span /><span /><span /><span /><span /><span /></div></div>
            <div className="dui-fake-hero"><div className="dui-fake-hero-text"><div className="dui-fake-h1" /><div className="dui-fake-p" /><div className="dui-fake-p short" /><div className="dui-fake-btn" /></div><div className="dui-fake-hero-img" /></div>
            <div className="dui-fake-section"><div className="dui-fake-card" /><div className="dui-fake-card" /><div className="dui-fake-card" /></div>
            <div className="dui-fake-footer"><span /><span /><span /><span /></div>
          </div>

          {/* Callout pins */}
          {callouts.map(c => (
            <div key={c.id} className={`dui-callout-pin${activeCallout === c.id ? " active" : ""}`}
              style={{ left: `${c.x}%`, top: `${c.y}%`, borderColor: c.color }}
              onClick={() => setActiveCallout(activeCallout === c.id ? null : c.id)}>
              <span className="dui-callout-num" style={{ background: c.color }}>{c.id}</span>
              {activeCallout === c.id && (
                <div className="dui-callout-bubble" style={{ borderColor: c.color + "30" }}>
                  <span className="dui-callout-dot" style={{ background: c.color }} />
                  {c.label}
                </div>
              )}
            </div>
          ))}

          {/* Highlight zones */}
          <div className="dui-highlight-zone" style={{ left: "5%", top: "10%", width: "90%", height: "14%", borderColor: "rgba(176,125,79,0.3)" }} />
          <div className="dui-highlight-zone" style={{ left: "10%", top: "50%", width: "80%", height: "22%", borderColor: "rgba(90,154,60,0.3)" }} />
        </div>

        {/* Legend */}
        <div className="dui-annotated-legend">
          {callouts.map(c => (
            <div key={c.id} className={`dui-legend-item${activeCallout === c.id ? " active" : ""}`}
              onClick={() => setActiveCallout(activeCallout === c.id ? null : c.id)}>
              <span className="dui-legend-num" style={{ background: c.color }}>{c.id}</span>
              <span className="dui-legend-text">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 2. Flow Diagram Block ──
// Inline visual process flow for proposals
function FlowDiagram() {
  const [activeNode, setActiveNode] = useState(null);
  const nodes = [
    { id: "discovery", label: "Discovery", sub: "Week 1", desc: "Stakeholder interviews, brand audit, competitor analysis, goal alignment", icon: "◎", color: "#5b7fa4" },
    { id: "strategy", label: "Strategy", sub: "Week 2", desc: "Brand positioning, voice & tone, audience mapping, key messages", icon: "◆", color: "#7c6b9e" },
    { id: "design", label: "Design", sub: "Week 3–4", desc: "Logo concepts, color palette, typography, imagery direction", icon: "✦", color: "#b07d4f" },
    { id: "refine", label: "Refine", sub: "Week 5", desc: "Two rounds of revisions, stakeholder feedback, final adjustments", icon: "◇", color: "#8a7e63" },
    { id: "deliver", label: "Deliver", sub: "Week 6", desc: "Brand guidelines PDF, source files, social templates, handoff", icon: "✓", color: "#5a9a3c" },
  ];

  return (
    <div className="dui-flow">
      <div className="dui-flow-header">
        <span className="dui-block-badge" style={{ color: "#7c6b9e", background: "rgba(124,107,158,0.06)", borderColor: "rgba(124,107,158,0.1)" }}>Process</span>
        <span className="dui-block-title">Our approach</span>
      </div>
      <div className="dui-flow-track">
        {/* Connector line */}
        <div className="dui-flow-line" />

        {nodes.map((n, i) => (
          <div key={n.id} className={`dui-flow-node${activeNode === n.id ? " active" : ""}`}
            onClick={() => setActiveNode(activeNode === n.id ? null : n.id)}>
            <div className="dui-flow-dot" style={{ background: n.color + "10", borderColor: n.color, color: n.color }}>
              <span>{n.icon}</span>
            </div>
            <div className="dui-flow-label">{n.label}</div>
            <div className="dui-flow-sub">{n.sub}</div>
            {activeNode === n.id && (
              <div className="dui-flow-detail" style={{ borderColor: n.color + "20" }}>
                <div className="dui-flow-detail-bar" style={{ background: n.color }} />
                {n.desc}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 3. Brand Board ──
// Complete brand identity snapshot in one visual block
function BrandBoard() {
  const colors = [
    { hex: "#2c2a25", name: "Ink", type: "Primary" },
    { hex: "#b07d4f", name: "Ember", type: "Accent" },
    { hex: "#faf9f7", name: "Parchment", type: "Background" },
    { hex: "#5a9a3c", name: "Success", type: "Semantic" },
    { hex: "#e5e2db", name: "Warm 200", type: "Border" },
  ];

  return (
    <div className="dui-brand">
      <div className="dui-brand-header">
        <span className="dui-block-badge" style={{ color: "#b07d4f", background: "rgba(176,125,79,0.06)", borderColor: "rgba(176,125,79,0.1)" }}>Brand Board</span>
        <span className="dui-block-title">Visual identity — Meridian Studio</span>
      </div>

      <div className="dui-brand-grid">
        {/* Logo area */}
        <div className="dui-brand-logo">
          <div className="dui-brand-logo-box">
            <div className="dui-brand-logo-mark">M</div>
            <div className="dui-brand-logo-text">MERIDIAN<br /><span>STUDIO</span></div>
          </div>
          <div className="dui-brand-logo-variants">
            <div className="dui-brand-logo-var dark"><span>M</span></div>
            <div className="dui-brand-logo-var light"><span>M</span></div>
            <div className="dui-brand-logo-var icon"><span>M</span></div>
          </div>
        </div>

        {/* Colors */}
        <div className="dui-brand-colors">
          <div className="dui-brand-section-label">Color palette</div>
          <div className="dui-brand-color-grid">
            {colors.map(c => (
              <div key={c.hex} className="dui-brand-color">
                <div className="dui-brand-color-swatch" style={{ background: c.hex, border: c.hex === "#faf9f7" ? "1px solid var(--warm-200)" : "none" }} />
                <div className="dui-brand-color-name">{c.name}</div>
                <div className="dui-brand-color-hex">{c.hex}</div>
                <div className="dui-brand-color-type">{c.type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="dui-brand-type">
          <div className="dui-brand-section-label">Typography</div>
          <div className="dui-brand-type-sample heading">Cormorant Garamond</div>
          <div className="dui-brand-type-meta">Headings · 400–700 · Serif</div>
          <div className="dui-brand-type-sample body">Outfit — The quick brown fox</div>
          <div className="dui-brand-type-meta">Body · 300–600 · Sans-serif</div>
          <div className="dui-brand-type-sample mono">JetBrains Mono</div>
          <div className="dui-brand-type-meta">Code & data · 300–500 · Monospace</div>
        </div>

        {/* Mood strip */}
        <div className="dui-brand-mood">
          <div className="dui-brand-section-label">Mood & texture</div>
          <div className="dui-brand-mood-strip">
            {["#d5d1c8", "#e5e2db", "#c89360", "#8a7e63", "#4f4c44", "#f0eee9"].map((c, i) => (
              <div key={i} className="dui-brand-mood-cell" style={{ background: c }}>
                {i === 2 && <span style={{ fontSize: 18, color: "#fff" }}>✦</span>}
              </div>
            ))}
          </div>
          <div className="dui-brand-mood-words">
            <span>Warm</span><span>Organic</span><span>Confident</span><span>Minimal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 4. Visual Timeline / Roadmap ──
function VisualTimeline() {
  const phases = [
    { label: "Kickoff", date: "Apr 1", status: "done", items: ["Stakeholder call", "Asset collection", "Access setup"], color: "#5a9a3c" },
    { label: "Discovery", date: "Apr 3–8", status: "done", items: ["Brand audit", "Competitor review", "Audience interviews"], color: "#5a9a3c" },
    { label: "Strategy", date: "Apr 9–15", status: "current", items: ["Positioning doc", "Voice & tone", "Key messages"], color: "#b07d4f" },
    { label: "Design", date: "Apr 16–28", status: "upcoming", items: ["Logo concepts", "Color system", "Typography scale", "Imagery direction"], color: "#5b7fa4" },
    { label: "Refinement", date: "Apr 29 – May 6", status: "upcoming", items: ["Round 1 revisions", "Round 2 revisions", "Final tweaks"], color: "#7c6b9e" },
    { label: "Delivery", date: "May 7", status: "upcoming", items: ["Guidelines PDF", "Source files", "Social templates"], color: "#8a7e63" },
  ];

  return (
    <div className="dui-timeline">
      <div className="dui-timeline-header">
        <span className="dui-block-badge" style={{ color: "#5b7fa4", background: "rgba(91,127,164,0.06)", borderColor: "rgba(91,127,164,0.1)" }}>Timeline</span>
        <span className="dui-block-title">Project roadmap — 6 weeks</span>
      </div>

      <div className="dui-timeline-track">
        {phases.map((p, i) => (
          <div key={i} className={`dui-tl-phase ${p.status}`}>
            <div className="dui-tl-connector">
              <div className="dui-tl-dot" style={{ borderColor: p.color, background: p.status === "done" ? p.color : p.status === "current" ? p.color : "transparent" }}>
                {p.status === "done" && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
                {p.status === "current" && <span style={{ color: "#fff", fontSize: 8 }}>●</span>}
              </div>
              {i < phases.length - 1 && <div className="dui-tl-line" style={{ background: p.status === "done" ? p.color : "var(--warm-200)" }} />}
            </div>
            <div className="dui-tl-content">
              <div className="dui-tl-label" style={{ color: p.status === "upcoming" ? "var(--ink-400)" : "var(--ink-800)" }}>{p.label}</div>
              <div className="dui-tl-date">{p.date}</div>
              <div className="dui-tl-items">
                {p.items.map((item, j) => (
                  <div key={j} className="dui-tl-item">
                    <span className="dui-tl-item-check" style={{ color: p.status === "done" ? "#5a9a3c" : "var(--warm-300)" }}>
                      {p.status === "done" ? "✓" : "○"}
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 5. Comparison Layout ──
function ComparisonBlock() {
  return (
    <div className="dui-compare">
      <div className="dui-compare-header">
        <span className="dui-block-badge" style={{ color: "#c24b38", background: "rgba(194,75,56,0.04)", borderColor: "rgba(194,75,56,0.08)" }}>Comparison</span>
        <span className="dui-block-title">Current state vs. proposed redesign</span>
      </div>

      <div className="dui-compare-grid">
        <div className="dui-compare-col before">
          <div className="dui-compare-col-label">
            <span className="dui-compare-dot" style={{ background: "#c24b38" }} />
            Before
          </div>
          <div className="dui-compare-card">
            <div className="dui-compare-mock before-mock">
              <div className="cm-nav"><div className="cm-logo-old" /><div className="cm-nav-links"><span /><span /><span /><span /><span /></div></div>
              <div className="cm-hero-old"><div className="cm-h1-old" /><div className="cm-p-old" /><div className="cm-p-old s" /><div className="cm-btn-old" /></div>
              <div className="cm-grid-old"><div /><div /><div /></div>
            </div>
          </div>
          <div className="dui-compare-issues">
            <div className="dui-compare-issue"><span className="dui-issue-x">✕</span>Cluttered navigation (6 items)</div>
            <div className="dui-compare-issue"><span className="dui-issue-x">✕</span>Weak visual hierarchy</div>
            <div className="dui-compare-issue"><span className="dui-issue-x">✕</span>No social proof above fold</div>
            <div className="dui-compare-issue"><span className="dui-issue-x">✕</span>Generic stock imagery</div>
          </div>
        </div>

        <div className="dui-compare-divider">
          <div className="dui-compare-arrow">→</div>
        </div>

        <div className="dui-compare-col after">
          <div className="dui-compare-col-label">
            <span className="dui-compare-dot" style={{ background: "#5a9a3c" }} />
            After
          </div>
          <div className="dui-compare-card">
            <div className="dui-compare-mock after-mock">
              <div className="cm-nav-new"><div className="cm-logo-new" /><div className="cm-nav-links-new"><span /><span /><span /><span /></div></div>
              <div className="cm-hero-new"><div className="cm-badge-new" /><div className="cm-h1-new" /><div className="cm-p-new" /><div className="cm-cta-row"><div className="cm-btn-new" /><div className="cm-btn-ghost" /></div></div>
              <div className="cm-social-proof"><div className="cm-avatar-row"><span /><span /><span /></div><div className="cm-stars" /></div>
            </div>
          </div>
          <div className="dui-compare-wins">
            <div className="dui-compare-win"><span className="dui-win-check">✓</span>Simplified to 4 nav items</div>
            <div className="dui-compare-win"><span className="dui-win-check">✓</span>Strong typographic hierarchy</div>
            <div className="dui-compare-win"><span className="dui-win-check">✓</span>Social proof above the fold</div>
            <div className="dui-compare-win"><span className="dui-win-check">✓</span>Dual CTA (primary + ghost)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 6. Mood Board ──
function MoodBoard() {
  return (
    <div className="dui-mood">
      <div className="dui-mood-header">
        <span className="dui-block-badge" style={{ color: "#8a7e63", background: "rgba(138,126,99,0.06)", borderColor: "rgba(138,126,99,0.1)" }}>Mood Board</span>
        <span className="dui-block-title">Visual direction — organic minimalism</span>
      </div>
      <div className="dui-mood-grid">
        <div className="dui-mood-cell large" style={{ background: "#d5d1c8", gridRow: "span 2" }}>
          <div className="dui-mood-cell-inner"><span className="dui-mood-icon">◆</span><span className="dui-mood-cell-label">Earth tones</span></div>
        </div>
        <div className="dui-mood-cell" style={{ background: "#e5e2db" }}>
          <div className="dui-mood-cell-inner"><span className="dui-mood-icon">Aa</span><span className="dui-mood-cell-label">Serif type</span></div>
        </div>
        <div className="dui-mood-cell" style={{ background: "#f0eee9" }}>
          <div className="dui-mood-cell-inner"><span className="dui-mood-icon">◎</span><span className="dui-mood-cell-label">White space</span></div>
        </div>
        <div className="dui-mood-cell" style={{ background: "#c89360" }}>
          <div className="dui-mood-cell-inner" style={{ color: "#fff" }}><span className="dui-mood-icon">✦</span><span className="dui-mood-cell-label">Warm accents</span></div>
        </div>
        <div className="dui-mood-cell wide" style={{ background: "#4f4c44", gridColumn: "span 2" }}>
          <div className="dui-mood-cell-inner" style={{ color: "rgba(255,255,255,0.7)" }}><span className="dui-mood-icon">☰</span><span className="dui-mood-cell-label">Clean grids</span></div>
        </div>
        <div className="dui-mood-cell" style={{ background: "#b8b3a8" }}>
          <div className="dui-mood-cell-inner"><span className="dui-mood-icon">◇</span><span className="dui-mood-cell-label">Natural texture</span></div>
        </div>
        <div className="dui-mood-cell" style={{ background: "#8a7e63" }}>
          <div className="dui-mood-cell-inner" style={{ color: "rgba(255,255,255,0.8)" }}><span className="dui-mood-icon">●</span><span className="dui-mood-cell-label">Organic shapes</span></div>
        </div>
        <div className="dui-mood-cell" style={{ background: "#faf9f7", border: "1px solid var(--warm-200)" }}>
          <div className="dui-mood-cell-inner"><span className="dui-mood-icon">—</span><span className="dui-mood-cell-label">Minimal lines</span></div>
        </div>
      </div>
      <div className="dui-mood-keywords">
        <span>Organic</span><span>Warm</span><span>Confident</span><span>Minimal</span><span>Elevated</span><span>Timeless</span>
      </div>
    </div>
  );
}

// ── 7. Wireframe Block ──
function WireframeBlock() {
  return (
    <div className="dui-wireframe">
      <div className="dui-wireframe-header">
        <span className="dui-block-badge" style={{ color: "#7c8594", background: "rgba(124,133,148,0.06)", borderColor: "rgba(124,133,148,0.1)" }}>Wireframe</span>
        <span className="dui-block-title">Homepage layout — proposed structure</span>
      </div>
      <div className="dui-wire-canvas">
        {/* Nav */}
        <div className="dui-wire-section" data-label="Navigation">
          <div className="wf-nav"><div className="wf-logo" /><div className="wf-nav-items"><span>About</span><span>Work</span><span>Services</span><span className="wf-btn-small">Contact</span></div></div>
        </div>
        {/* Hero */}
        <div className="dui-wire-section" data-label="Hero">
          <div className="wf-hero">
            <div className="wf-hero-left">
              <div className="wf-badge">Brand Identity Studio</div>
              <div className="wf-heading">We build brands<br />that people remember</div>
              <div className="wf-body-text">Two lines of supporting copy that explains<br />the value proposition clearly.</div>
              <div className="wf-cta-group"><div className="wf-btn-primary">Start a Project</div><div className="wf-btn-outline">See Our Work →</div></div>
            </div>
            <div className="wf-hero-right"><div className="wf-img-placeholder">Featured Project Image</div></div>
          </div>
        </div>
        {/* Social proof */}
        <div className="dui-wire-section" data-label="Social proof">
          <div className="wf-proof">
            <div className="wf-proof-logos"><span>Client</span><span>Client</span><span>Client</span><span>Client</span><span>Client</span></div>
            <div className="wf-proof-text">"Testimonial quote from a happy client about results."</div>
          </div>
        </div>
        {/* Services */}
        <div className="dui-wire-section" data-label="Services">
          <div className="wf-services">
            <div className="wf-service-card"><div className="wf-service-icon">◆</div><div className="wf-service-name">Brand Identity</div><div className="wf-service-desc">Two lines describing this service offering.</div></div>
            <div className="wf-service-card"><div className="wf-service-icon">◇</div><div className="wf-service-name">Web Design</div><div className="wf-service-desc">Two lines describing this service offering.</div></div>
            <div className="wf-service-card"><div className="wf-service-icon">◎</div><div className="wf-service-name">Strategy</div><div className="wf-service-desc">Two lines describing this service offering.</div></div>
          </div>
        </div>
      </div>
      <div className="dui-wire-footer">
        <span>Annotations: click any section label to discuss</span>
        <span>Desktop · 1440px</span>
      </div>
    </div>
  );
}

// ── 8. Pull Quote / Testimonial Block ──
function PullQuote() {
  return (
    <div className="dui-pullquote">
      <div className="dui-pq-mark">❝</div>
      <div className="dui-pq-text">Alex didn't just design our brand — he gave us a strategic foundation that changed how we talk about ourselves. The guidelines document alone was worth the investment.</div>
      <div className="dui-pq-attribution">
        <div className="dui-pq-avatar">S</div>
        <div className="dui-pq-info">
          <div className="dui-pq-name">Sarah Chen</div>
          <div className="dui-pq-role">Founder, Meridian Studio</div>
        </div>
        <div className="dui-pq-stars">★★★★★</div>
      </div>
    </div>
  );
}


/* ═══════════════════════════
   SHOWCASE
   ═══════════════════════════ */
export default function DrawingUI() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
        .page{font-family:'Outfit',sans-serif;font-size:15px;color:var(--ink-700);background:var(--parchment);min-height:100vh}
        .canvas{max-width:780px;margin:0 auto;padding:40px 32px 100px}

        /* ── Shared ── */
        .doc-h1{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:var(--ink-900);margin-bottom:6px}
        .doc-meta{font-family:var(--mono);font-size:11px;color:var(--ink-400);margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--warm-200);display:flex;gap:12px}
        .doc-p{font-size:15px;color:var(--ink-600);line-height:1.8;margin-bottom:16px}
        .cat{font-family:var(--mono);font-size:9px;color:var(--ink-300);letter-spacing:.1em;text-transform:uppercase;margin:32px 0 12px;display:flex;align-items:center;gap:8px}.cat::after{content:'';flex:1;height:1px;background:var(--warm-200)}

        .dui-block-badge{font-family:var(--mono);font-size:9px;font-weight:500;padding:2px 8px;border-radius:3px;color:var(--ink-400);background:var(--warm-100);border:1px solid var(--warm-200)}
        .dui-block-title{font-size:15px;font-weight:500;color:var(--ink-800)}

        /* ═══ ANNOTATED IMAGE ═══ */
        .dui-annotated{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0}
        .dui-annotated-header{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--warm-100)}
        .dui-annotated-canvas{padding:16px}
        .dui-annotated-img{position:relative;border-radius:8px;overflow:hidden;background:var(--warm-50);border:1px solid var(--warm-200);aspect-ratio:16/10}

        /* Fake site */
        .dui-fake-site{padding:12px;height:100%;display:flex;flex-direction:column;gap:8px}
        .dui-fake-nav{display:flex;align-items:center;justify-content:space-between;padding:6px 0}
        .dui-fake-logo{width:60px;height:8px;background:var(--warm-300);border-radius:2px}
        .dui-fake-nav-items{display:flex;gap:8px}.dui-fake-nav-items span{width:28px;height:5px;background:var(--warm-300);border-radius:1px}
        .dui-fake-hero{display:flex;gap:16px;flex:1;align-items:center;padding:8px 0}
        .dui-fake-hero-text{flex:1;display:flex;flex-direction:column;gap:6px}
        .dui-fake-h1{width:70%;height:14px;background:var(--warm-300);border-radius:2px}
        .dui-fake-p{width:85%;height:6px;background:var(--warm-200);border-radius:1px}
        .dui-fake-p.short{width:50%}
        .dui-fake-btn{width:80px;height:16px;background:var(--ink-900);border-radius:3px;opacity:.15}
        .dui-fake-hero-img{width:140px;height:90px;background:var(--warm-200);border-radius:6px;flex-shrink:0}
        .dui-fake-section{display:flex;gap:8px;padding:4px 0}
        .dui-fake-card{flex:1;height:50px;background:var(--warm-100);border-radius:4px;border:1px solid var(--warm-200)}
        .dui-fake-footer{display:flex;gap:12px;justify-content:center;padding:6px 0}.dui-fake-footer span{width:32px;height:4px;background:var(--warm-200);border-radius:1px}

        /* Callouts */
        .dui-callout-pin{position:absolute;z-index:5;cursor:pointer;transform:translate(-50%,-50%)}
        .dui-callout-num{width:22px;height:22px;border-radius:50%;color:#fff;font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:transform .1s}
        .dui-callout-pin:hover .dui-callout-num{transform:scale(1.15)}
        .dui-callout-pin.active .dui-callout-num{transform:scale(1.2)}
        .dui-callout-bubble{position:absolute;top:28px;left:50%;transform:translateX(-50%);background:#fff;border:1px solid;border-radius:8px;padding:8px 12px;font-size:12px;color:var(--ink-600);white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.08);display:flex;align-items:center;gap:6px;animation:bubbleIn .15s ease}
        @keyframes bubbleIn{from{opacity:0;transform:translateX(-50%) translateY(4px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        .dui-callout-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
        .dui-highlight-zone{position:absolute;border:2px dashed;border-radius:6px;pointer-events:none}

        .dui-annotated-legend{display:flex;flex-direction:column;gap:4px;margin-top:12px}
        .dui-legend-item{display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:5px;cursor:pointer;transition:background .06s;font-size:13px;color:var(--ink-500)}
        .dui-legend-item:hover,.dui-legend-item.active{background:var(--warm-100)}
        .dui-legend-num{width:18px;height:18px;border-radius:50%;color:#fff;font-size:9px;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0}

        /* ═══ FLOW DIAGRAM ═══ */
        .dui-flow{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0}
        .dui-flow-header{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--warm-100)}
        .dui-flow-track{display:flex;align-items:flex-start;gap:0;padding:24px 18px;position:relative}
        .dui-flow-line{position:absolute;top:47px;left:50px;right:50px;height:2px;background:var(--warm-200)}
        .dui-flow-node{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;position:relative;z-index:1;cursor:pointer;padding:0 4px}
        .dui-flow-dot{width:36px;height:36px;border-radius:10px;border:2px solid;display:flex;align-items:center;justify-content:center;font-size:16px;transition:all .12s}
        .dui-flow-node:hover .dui-flow-dot{transform:scale(1.1)}
        .dui-flow-node.active .dui-flow-dot{transform:scale(1.15);box-shadow:0 2px 12px rgba(0,0,0,0.08)}
        .dui-flow-label{font-size:13px;font-weight:500;color:var(--ink-700);text-align:center}
        .dui-flow-sub{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .dui-flow-detail{position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#fff;border:1px solid;border-radius:8px;padding:10px 14px;font-size:12px;color:var(--ink-500);line-height:1.5;width:180px;text-align:center;box-shadow:0 4px 16px rgba(0,0,0,0.06);animation:bubbleIn .15s ease}
        .dui-flow-detail-bar{width:24px;height:3px;border-radius:2px;margin:0 auto 6px}

        /* ═══ BRAND BOARD ═══ */
        .dui-brand{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0}
        .dui-brand-header{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--warm-100)}
        .dui-brand-grid{padding:18px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .dui-brand-section-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}

        .dui-brand-logo{grid-column:1/-1;display:flex;align-items:center;gap:20px;padding:20px;background:var(--warm-50);border-radius:10px;border:1px solid var(--warm-100)}
        .dui-brand-logo-box{display:flex;align-items:center;gap:12px;flex:1}
        .dui-brand-logo-mark{width:48px;height:48px;border-radius:12px;background:var(--ink-900);color:var(--ember);font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;display:flex;align-items:center;justify-content:center}
        .dui-brand-logo-text{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--ink-900);line-height:1.1;letter-spacing:.04em}
        .dui-brand-logo-text span{font-size:11px;letter-spacing:.2em;font-weight:500;color:var(--ink-400)}
        .dui-brand-logo-variants{display:flex;gap:8px}
        .dui-brand-logo-var{width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600}
        .dui-brand-logo-var.dark{background:var(--ink-900);color:var(--ember)}
        .dui-brand-logo-var.light{background:var(--warm-100);color:var(--ink-900);border:1px solid var(--warm-200)}
        .dui-brand-logo-var.icon{background:var(--ember);color:#fff;border-radius:50%}

        .dui-brand-color-grid{display:flex;gap:6px}
        .dui-brand-color{display:flex;flex-direction:column;align-items:center;gap:3px;flex:1}
        .dui-brand-color-swatch{width:100%;aspect-ratio:1;border-radius:8px}
        .dui-brand-color-name{font-size:11px;font-weight:500;color:var(--ink-600)}
        .dui-brand-color-hex{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
        .dui-brand-color-type{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em}

        .dui-brand-type-sample{margin-bottom:2px}
        .dui-brand-type-sample.heading{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--ink-800)}
        .dui-brand-type-sample.body{font-family:'Outfit',sans-serif;font-size:16px;color:var(--ink-700)}
        .dui-brand-type-sample.mono{font-family:'JetBrains Mono',monospace;font-size:14px;color:var(--ink-600)}
        .dui-brand-type-meta{font-family:var(--mono);font-size:10px;color:var(--ink-300);margin-bottom:10px}

        .dui-brand-mood{grid-column:1/-1}
        .dui-brand-mood-strip{display:flex;gap:4px;height:48px;border-radius:8px;overflow:hidden}
        .dui-brand-mood-cell{flex:1;display:flex;align-items:center;justify-content:center}
        .dui-brand-mood-words{display:flex;gap:10px;margin-top:8px;font-family:var(--mono);font-size:10px;color:var(--ink-300)}

        /* ═══ TIMELINE ═══ */
        .dui-timeline{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0}
        .dui-timeline-header{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--warm-100)}
        .dui-timeline-track{padding:20px 18px}
        .dui-tl-phase{display:flex;gap:14px;margin-bottom:2px}
        .dui-tl-phase:last-child{margin-bottom:0}
        .dui-tl-connector{display:flex;flex-direction:column;align-items:center;width:20px;flex-shrink:0}
        .dui-tl-dot{width:18px;height:18px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1;background:#fff}
        .dui-tl-line{width:2px;flex:1;min-height:8px;margin:-2px 0}
        .dui-tl-content{flex:1;padding-bottom:16px}
        .dui-tl-label{font-size:14px;font-weight:500;margin-bottom:1px}
        .dui-tl-date{font-family:var(--mono);font-size:10px;color:var(--ink-300);margin-bottom:6px}
        .dui-tl-items{display:flex;flex-direction:column;gap:2px}
        .dui-tl-item{display:flex;align-items:center;gap:5px;font-size:13px;color:var(--ink-500)}
        .dui-tl-item-check{font-size:11px;width:14px;flex-shrink:0;text-align:center}
        .dui-tl-phase.upcoming .dui-tl-content{opacity:.5}

        /* ═══ COMPARISON ═══ */
        .dui-compare{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0}
        .dui-compare-header{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--warm-100)}
        .dui-compare-grid{display:flex;gap:0;padding:18px}
        .dui-compare-col{flex:1}
        .dui-compare-col-label{display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:11px;font-weight:500;margin-bottom:10px}
        .dui-compare-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .dui-compare-divider{width:32px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .dui-compare-arrow{width:24px;height:24px;border-radius:50%;background:var(--warm-100);color:var(--ink-400);display:flex;align-items:center;justify-content:center;font-size:12px}
        .dui-compare-card{border:1px solid var(--warm-200);border-radius:8px;overflow:hidden;margin-bottom:10px}

        /* Mock sites */
        .dui-compare-mock{padding:10px;background:var(--warm-50);min-height:160px}
        .cm-nav,.cm-nav-new{display:flex;align-items:center;justify-content:space-between;padding:4px 0;margin-bottom:8px}
        .cm-logo-old,.cm-logo-new{width:40px;height:6px;border-radius:2px;background:var(--warm-300)}
        .cm-logo-new{background:var(--ink-900);opacity:.2}
        .cm-nav-links,.cm-nav-links-new{display:flex;gap:6px}
        .cm-nav-links span,.cm-nav-links-new span{width:22px;height:4px;background:var(--warm-300);border-radius:1px}
        .cm-hero-old{padding:8px 0}
        .cm-h1-old{width:65%;height:10px;background:var(--warm-300);border-radius:2px;margin-bottom:5px}
        .cm-p-old{width:80%;height:4px;background:var(--warm-200);border-radius:1px;margin-bottom:3px}
        .cm-p-old.s{width:50%}
        .cm-btn-old{width:50px;height:12px;background:var(--warm-300);border-radius:2px;margin-top:6px}
        .cm-grid-old{display:flex;gap:5px;padding:6px 0}
        .cm-grid-old div{flex:1;height:30px;background:var(--warm-200);border-radius:3px}
        .cm-hero-new{padding:8px 0}
        .cm-badge-new{width:80px;height:8px;background:var(--ember);opacity:.15;border-radius:2px;margin-bottom:5px}
        .cm-h1-new{width:70%;height:12px;background:var(--ink-900);opacity:.15;border-radius:2px;margin-bottom:5px}
        .cm-p-new{width:65%;height:4px;background:var(--warm-300);border-radius:1px;margin-bottom:6px}
        .cm-cta-row{display:flex;gap:5px}
        .cm-btn-new{width:60px;height:14px;background:var(--ink-900);opacity:.2;border-radius:3px}
        .cm-btn-ghost{width:50px;height:14px;border:1px solid var(--warm-300);border-radius:3px}
        .cm-social-proof{display:flex;align-items:center;gap:8px;padding:8px 0;margin-top:4px}
        .cm-avatar-row{display:flex;gap:-4px}.cm-avatar-row span{width:14px;height:14px;border-radius:50%;background:var(--warm-300);margin-left:-3px;border:1px solid var(--warm-50)}
        .cm-stars{font-size:8px;color:#c89360}

        .dui-compare-issues,.dui-compare-wins{display:flex;flex-direction:column;gap:3px}
        .dui-compare-issue,.dui-compare-win{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink-500)}
        .dui-issue-x{color:#c24b38;font-size:10px;width:14px;text-align:center;flex-shrink:0}
        .dui-win-check{color:#5a9a3c;font-size:11px;width:14px;text-align:center;flex-shrink:0}

        /* ═══ MOOD BOARD ═══ */
        .dui-mood{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0}
        .dui-mood-header{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--warm-100)}
        .dui-mood-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:16px}
        .dui-mood-cell{border-radius:8px;aspect-ratio:1;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .12s}
        .dui-mood-cell:hover{transform:scale(1.02)}
        .dui-mood-cell.large{aspect-ratio:auto}
        .dui-mood-cell.wide{aspect-ratio:auto;min-height:64px}
        .dui-mood-cell-inner{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;color:var(--ink-500)}
        .dui-mood-icon{font-size:20px}
        .dui-mood-cell-label{font-family:var(--mono);font-size:10px}
        .dui-mood-keywords{display:flex;gap:8px;padding:0 16px 14px;flex-wrap:wrap}
        .dui-mood-keywords span{font-family:var(--mono);font-size:10px;color:var(--ink-400);background:var(--warm-100);border:1px solid var(--warm-200);padding:3px 10px;border-radius:4px}

        /* ═══ WIREFRAME ═══ */
        .dui-wireframe{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0}
        .dui-wireframe-header{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--warm-100)}
        .dui-wire-canvas{padding:16px;background:var(--warm-50)}
        .dui-wire-section{border:1px dashed var(--warm-300);border-radius:8px;padding:14px;margin-bottom:8px;position:relative;background:rgba(255,255,255,0.5)}
        .dui-wire-section::before{content:attr(data-label);position:absolute;top:-8px;left:12px;font-family:var(--mono);font-size:9px;color:var(--ink-300);background:var(--warm-50);padding:0 6px;text-transform:uppercase;letter-spacing:.06em}
        .dui-wire-footer{display:flex;justify-content:space-between;padding:8px 18px;font-family:var(--mono);font-size:10px;color:var(--ink-300)}

        .wf-nav{display:flex;align-items:center;justify-content:space-between}
        .wf-logo{width:36px;height:10px;background:var(--warm-300);border-radius:2px}
        .wf-nav-items{display:flex;gap:12px;font-family:var(--mono);font-size:10px;color:var(--ink-400)}
        .wf-btn-small{padding:2px 10px;background:var(--ink-900);color:#fff;border-radius:3px;font-size:10px;opacity:.7}

        .wf-hero{display:flex;gap:20px;align-items:center}
        .wf-hero-left{flex:1}
        .wf-badge{font-family:var(--mono);font-size:9px;color:var(--ember);background:var(--ember-bg);padding:2px 8px;border-radius:3px;display:inline-block;margin-bottom:6px}
        .wf-heading{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--ink-800);line-height:1.25;margin-bottom:6px}
        .wf-body-text{font-size:11px;color:var(--ink-400);line-height:1.5;margin-bottom:8px}
        .wf-cta-group{display:flex;gap:6px}
        .wf-btn-primary{padding:6px 14px;background:var(--ink-900);color:#fff;border-radius:5px;font-size:11px;font-weight:500;opacity:.8}
        .wf-btn-outline{padding:6px 14px;border:1px solid var(--warm-300);border-radius:5px;font-size:11px;color:var(--ink-500)}
        .wf-hero-right{width:200px;flex-shrink:0}
        .wf-img-placeholder{width:100%;aspect-ratio:4/3;background:var(--warm-200);border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:10px;color:var(--ink-300)}

        .wf-proof{text-align:center;padding:6px 0}
        .wf-proof-logos{display:flex;justify-content:center;gap:16px;margin-bottom:6px}
        .wf-proof-logos span{font-family:var(--mono);font-size:10px;color:var(--ink-300);background:var(--warm-200);padding:3px 10px;border-radius:3px}
        .wf-proof-text{font-family:'Cormorant Garamond',serif;font-size:14px;font-style:italic;color:var(--ink-400)}

        .wf-services{display:flex;gap:10px}
        .wf-service-card{flex:1;padding:12px;border:1px solid var(--warm-200);border-radius:6px;background:#fff;text-align:center}
        .wf-service-icon{font-size:18px;color:var(--ember);margin-bottom:4px}
        .wf-service-name{font-size:13px;font-weight:500;color:var(--ink-700);margin-bottom:2px}
        .wf-service-desc{font-size:10px;color:var(--ink-400);line-height:1.4}

        /* ═══ PULL QUOTE ═══ */
        .dui-pullquote{border:1px solid var(--warm-200);border-radius:12px;padding:28px 32px;margin:16px 0;background:#fff;position:relative}
        .dui-pq-mark{font-family:'Cormorant Garamond',serif;font-size:48px;color:var(--ember);opacity:.2;position:absolute;top:12px;left:20px;line-height:1}
        .dui-pq-text{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:400;font-style:italic;color:var(--ink-600);line-height:1.6;margin-bottom:16px;padding-left:8px}
        .dui-pq-attribution{display:flex;align-items:center;gap:10px;padding-left:8px}
        .dui-pq-avatar{width:36px;height:36px;border-radius:8px;background:#8a7e63;color:#fff;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .dui-pq-info{flex:1}
        .dui-pq-name{font-size:14px;font-weight:500;color:var(--ink-800)}
        .dui-pq-role{font-size:12px;color:var(--ink-400)}
        .dui-pq-stars{color:#c89360;font-size:13px;letter-spacing:1px;flex-shrink:0}
      `}</style>

      <div className="page"><div className="canvas">
        <h1 className="doc-h1">Drawing UI Components</h1>
        <div className="doc-meta"><span>Visual blocks for proposals</span><span>·</span><span>8 components</span><span>·</span><span>Type / to insert</span></div>

        <p className="doc-p">These blocks transform a plain writeup into a professional design deck. Insert them inline alongside text — they're editor blocks, not separate files.</p>

        <div className="cat">annotated screenshot</div>
        <p className="doc-p">Click the numbered pins to see callouts. Use this to walk clients through an audit of their current site.</p>
        <AnnotatedImage />

        <div className="cat">process flow</div>
        <p className="doc-p">Click any phase to see the detail. Drop this into proposals to show how you work.</p>
        <FlowDiagram />

        <div className="cat">visual timeline</div>
        <p className="doc-p">Checkmarks for completed phases, ember dot for current, faded for upcoming. Clients see exactly where they are.</p>
        <VisualTimeline />

        <div className="cat">comparison layout</div>
        <p className="doc-p">Before/after with annotated issues and wins. Show the client what's wrong and exactly how you'll fix it.</p>
        <ComparisonBlock />

        <div className="cat">brand board</div>
        <p className="doc-p">Complete visual identity in one block — logo variants, color palette, typography, and mood. Drop this at the end of a brand proposal as the deliverable preview.</p>
        <BrandBoard />

        <div className="cat">mood board</div>
        <p className="doc-p">Visual direction grid with keywords. Use during discovery to align on aesthetic before designing.</p>
        <MoodBoard />

        <div className="cat">wireframe block</div>
        <p className="doc-p">Annotated wireframe layout with dashed section labels. Inline in the proposal — the client sees the structure before you design it.</p>
        <WireframeBlock />

        <div className="cat">testimonial / pull quote</div>
        <p className="doc-p">Drop a testimonial from a past client into any proposal. Social proof right where they're deciding.</p>
        <PullQuote />
      </div></div>
    </>
  );
}
