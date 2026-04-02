import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   FELMARK — FORGE PAPER OUTLINE
   The spine of every proposal.
   Section-oriented. Draft-tolerant. Alive.
   ═══════════════════════════════════════════ */

const DOC_TYPES = {
  proposal: { label: "Proposal", icon: "◆", color: "#b07d4f" },
  contract: { label: "Contract", icon: "◎", color: "#5b7fa4" },
  invoice: { label: "Invoice", icon: "$", color: "#5a9a3c" },
  brief: { label: "Brief", icon: "☰", color: "#7c6b9e" },
};

const SECTION_STATUS = {
  complete: { label: "Complete", color: "#5a9a3c", icon: "✓" },
  draft: { label: "Draft", color: "#d97706", icon: "✎" },
  empty: { label: "Empty", color: "#c24b38", icon: "○" },
  review: { label: "Review", color: "#5b7fa4", icon: "◎" },
  locked: { label: "Locked", color: "#7d7a72", icon: "◆" },
};

function HealthRing({ pct, size = 40 }) {
  const r = (size - 5) / 2, circ = 2 * Math.PI * r;
  const color = pct >= 80 ? "#5a9a3c" : pct >= 50 ? "#d97706" : "#c24b38";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--warm-200)" strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dashoffset .6s cubic-bezier(0.34,1.56,0.64,1)" }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: 10, fontWeight: 600, fill: color, fontFamily: "var(--mono)" }}>
        {pct}%
      </text>
    </svg>
  );
}

function WordBar({ count, target, color }) {
  const pct = Math.min(100, (count / target) * 100);
  return (
    <div className="fp-wb">
      <div className="fp-wb-fill" style={{ width: `${pct}%`, background: color || "var(--ember)" }} />
    </div>
  );
}

export default function ForgePaperOutline() {
  const [activeSection, setActiveSection] = useState("scope");
  const [collapsed, setCollapsed] = useState(new Set());
  const [hoveredSection, setHoveredSection] = useState(null);
  const [docType] = useState("proposal");
  const [showAI, setShowAI] = useState(true);

  const doc = DOC_TYPES[docType];

  const sections = [
    {
      id: "header", label: "Document Header", status: "locked", icon: "◆",
      children: [], words: 0, target: 0, locked: true,
      meta: "Auto-generated · Client name, date, ID",
    },
    {
      id: "intro", label: "Introduction", status: "complete", icon: "¶",
      children: [
        { id: "intro-greeting", label: "Greeting", status: "complete", words: 24 },
        { id: "intro-context", label: "Project context", status: "complete", words: 68 },
      ],
      words: 92, target: 120,
    },
    {
      id: "scope", label: "Scope of Work", status: "draft", icon: "☐",
      children: [
        { id: "scope-deliverables", label: "Deliverables", status: "complete", words: 145 },
        { id: "scope-checklist", label: "Checklist", status: "draft", words: 38, meta: "3 of 5 items" },
        { id: "scope-exclusions", label: "Exclusions", status: "empty", words: 0 },
      ],
      words: 183, target: 250,
    },
    {
      id: "pricing", label: "Pricing", status: "complete", icon: "$",
      children: [
        { id: "pricing-table", label: "Line items", status: "complete", words: 0, meta: "3 items · $3,000/mo" },
        { id: "pricing-notes", label: "Payment terms", status: "complete", words: 42 },
      ],
      words: 42, target: 80,
    },
    {
      id: "timeline", label: "Timeline", status: "draft", icon: "→",
      children: [
        { id: "tl-phases", label: "Project phases", status: "draft", words: 0, meta: "3 milestones" },
        { id: "tl-deadlines", label: "Key deadlines", status: "empty", words: 0 },
      ],
      words: 0, target: 100,
    },
    {
      id: "social", label: "Social Proof", status: "empty", icon: "❝",
      children: [],
      words: 0, target: 60,
      suggestion: "Add a testimonial — proposals with social proof close 34% more",
    },
    {
      id: "terms", label: "Terms & Conditions", status: "review", icon: "◎",
      children: [
        { id: "terms-revisions", label: "Revision policy", status: "complete", words: 56 },
        { id: "terms-ip", label: "IP ownership", status: "review", words: 78, meta: "Client reviewing" },
        { id: "terms-termination", label: "Termination", status: "complete", words: 64 },
        { id: "terms-liability", label: "Liability", status: "complete", words: 52 },
      ],
      words: 250, target: 300,
    },
    {
      id: "signatures", label: "Signatures", status: "draft", icon: "✍",
      children: [
        { id: "sig-provider", label: "Service provider", status: "complete", words: 0, meta: "Signed Mar 29" },
        { id: "sig-client", label: "Client", status: "empty", words: 0, meta: "Awaiting signature" },
      ],
      words: 0, target: 0,
    },
    {
      id: "footer", label: "Document Footer", status: "locked", icon: "◆",
      children: [], words: 0, target: 0, locked: true,
      meta: "Powered by @felmark/forge",
    },
  ];

  const totalWords = sections.reduce((s, sec) => s + sec.words, 0);
  const completeSections = sections.filter(s => s.status === "complete" || s.status === "locked").length;
  const totalSections = sections.length;
  const healthPct = Math.round((completeSections / totalSections) * 100);

  const toggleCollapse = (id) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const missingSections = sections.filter(s => s.status === "empty" && !s.locked);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.fpo{font-family:'Outfit',sans-serif;width:248px;background:#fff;border-right:1px solid var(--warm-200);display:flex;flex-direction:column;height:100vh;user-select:none}

/* ═══ Header ═══ */
.fpo-head{padding:12px 12px 10px;border-bottom:1px solid var(--warm-100)}
.fpo-head-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.fpo-head-title{display:flex;align-items:center;gap:5px;font-size:13px;font-weight:600;color:var(--ink-800)}
.fpo-head-title-icon{font-size:10px;color:var(--ember)}
.fpo-head-actions{display:flex;gap:2px}
.fpo-head-btn{width:22px;height:22px;border-radius:4px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px;transition:all .08s}
.fpo-head-btn:hover{background:var(--warm-50);color:var(--ink-500);border-color:var(--warm-300)}
.fpo-head-btn.on{background:var(--ember-bg);border-color:rgba(176,125,79,0.1);color:var(--ember)}

/* Doc info */
.fpo-doc{display:flex;align-items:center;gap:8px}
.fpo-doc-ring{flex-shrink:0}
.fpo-doc-info{flex:1;min-width:0}
.fpo-doc-type{display:flex;align-items:center;gap:4px;font-family:var(--mono);font-size:9px;color:var(--ink-400)}
.fpo-doc-type-badge{padding:1px 5px;border-radius:3px;border:1px solid;font-weight:500}
.fpo-doc-stats{font-family:var(--mono);font-size:9px;color:var(--ink-300);display:flex;gap:6px;margin-top:2px}

/* ═══ Sections list ═══ */
.fpo-sections{flex:1;overflow-y:auto;padding:6px 6px 4px}
.fpo-sections::-webkit-scrollbar{width:3px}
.fpo-sections::-webkit-scrollbar-thumb{background:var(--warm-200);border-radius:2px}

/* Section item */
.fpo-sec{margin-bottom:1px;border-radius:6px;overflow:hidden}
.fpo-sec-row{display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:6px;cursor:pointer;transition:all .06s;position:relative}
.fpo-sec-row:hover{background:var(--warm-50)}
.fpo-sec-row.active{background:var(--ember-bg)}
.fpo-sec-row.locked{opacity:.45}

/* Drag handle */
.fpo-sec-drag{width:10px;display:flex;flex-direction:column;align-items:center;gap:1px;opacity:0;transition:opacity .08s;cursor:grab;flex-shrink:0}
.fpo-sec-row:hover .fpo-sec-drag{opacity:1}
.fpo-sec-drag-dot{width:3px;height:3px;border-radius:50%;background:var(--warm-300)}

/* Collapse arrow */
.fpo-sec-arrow{width:12px;font-size:8px;color:var(--ink-300);flex-shrink:0;text-align:center;cursor:pointer;transition:transform .12s}
.fpo-sec-arrow.open{transform:rotate(90deg)}

/* Status indicator */
.fpo-sec-status{width:16px;height:16px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:8px;flex-shrink:0;border:1px solid;transition:all .12s}

/* Section label */
.fpo-sec-info{flex:1;min-width:0}
.fpo-sec-label{font-size:12px;font-weight:500;color:var(--ink-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .08s}
.fpo-sec-row.active .fpo-sec-label{color:var(--ink-900);font-weight:600}
.fpo-sec-row.locked .fpo-sec-label{color:var(--ink-300)}
.fpo-sec-meta{font-family:var(--mono);font-size:8px;color:var(--ink-300);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* Word bar */
.fp-wb{height:2px;background:var(--warm-200);border-radius:1px;margin-top:3px;overflow:hidden}
.fp-wb-fill{height:100%;border-radius:1px;transition:width .3s}

/* Child sections */
.fpo-children{padding:0 0 2px 20px}
.fpo-child{display:flex;align-items:center;gap:6px;padding:4px 8px;border-radius:4px;cursor:pointer;transition:all .06s}
.fpo-child:hover{background:var(--warm-50)}
.fpo-child.active{background:var(--ember-bg)}
.fpo-child-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;transition:background .12s}
.fpo-child-label{font-size:11px;color:var(--ink-500);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .08s}
.fpo-child.active .fpo-child-label{color:var(--ink-800);font-weight:500}
.fpo-child-words{font-family:var(--mono);font-size:8px;color:var(--ink-300);flex-shrink:0}
.fpo-child-meta{font-family:var(--mono);font-size:8px;color:var(--ink-300);flex-shrink:0}

/* ═══ AI Section ═══ */
.fpo-ai{padding:8px;border-top:1px solid var(--warm-100);flex-shrink:0}
.fpo-ai-head{display:flex;align-items:center;gap:5px;margin-bottom:6px}
.fpo-ai-badge{font-family:var(--mono);font-size:8px;font-weight:600;color:var(--ember);background:var(--ember-bg);padding:1px 5px;border-radius:3px;border:1px solid rgba(176,125,79,0.06)}
.fpo-ai-title{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em}

.fpo-ai-item{display:flex;align-items:flex-start;gap:6px;padding:6px 8px;border:1px solid var(--warm-200);border-radius:6px;margin-bottom:4px;cursor:pointer;transition:all .08s}
.fpo-ai-item:hover{border-color:var(--warm-300);background:var(--warm-50)}
.fpo-ai-item-dot{width:5px;height:5px;border-radius:50%;background:var(--ember);flex-shrink:0;margin-top:4px}
.fpo-ai-item-text{font-size:11px;color:var(--ink-500);line-height:1.4;flex:1}
.fpo-ai-item-action{font-family:var(--mono);font-size:8px;color:var(--ember);flex-shrink:0;margin-top:2px}

/* ═══ Footer ═══ */
.fpo-foot{padding:8px 12px;border-top:1px solid var(--warm-100);flex-shrink:0;display:flex;align-items:center;justify-content:space-between}
.fpo-foot-left{display:flex;align-items:center;gap:4px;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.fpo-foot-dot{width:4px;height:4px;border-radius:50%;background:var(--ember);animation:fpoDot 2s ease infinite}
@keyframes fpoDot{0%,60%,100%{opacity:.2}20%{opacity:1}}
.fpo-foot-right{font-family:var(--mono);font-size:9px;color:var(--ink-300)}

/* Tooltip */
.fpo-tip{position:absolute;left:100%;top:50%;transform:translateY(-50%);margin-left:8px;background:var(--ink-900);color:#fff;padding:4px 8px;border-radius:4px;font-family:var(--mono);font-size:9px;white-space:nowrap;pointer-events:none;z-index:20;opacity:0;transition:opacity .1s}
.fpo-sec-row:hover .fpo-tip{opacity:1}

/* Status colors */
.fpo-st-complete{color:#5a9a3c;background:rgba(90,154,60,0.04);border-color:rgba(90,154,60,0.1)}
.fpo-st-draft{color:#d97706;background:rgba(217,151,6,0.04);border-color:rgba(217,151,6,0.1)}
.fpo-st-empty{color:#c24b38;background:rgba(194,75,56,0.04);border-color:rgba(194,75,56,0.1)}
.fpo-st-review{color:#5b7fa4;background:rgba(91,127,164,0.04);border-color:rgba(91,127,164,0.1)}
.fpo-st-locked{color:var(--ink-300);background:var(--warm-50);border-color:var(--warm-200)}

/* Child dot colors */
.fpo-cd-complete{background:#5a9a3c}
.fpo-cd-draft{background:#d97706}
.fpo-cd-empty{background:#c24b38}
.fpo-cd-review{background:#5b7fa4}
      `}</style>

      <div className="fpo">

        {/* ═══ Header ═══ */}
        <div className="fpo-head">
          <div className="fpo-head-top">
            <div className="fpo-head-title">
              <span className="fpo-head-title-icon">◆</span>
              Outline
            </div>
            <div className="fpo-head-actions">
              <button className={`fpo-head-btn${showAI ? " on" : ""}`} onClick={() => setShowAI(!showAI)} title="AI suggestions">✦</button>
              <button className="fpo-head-btn" title="Collapse all">⊟</button>
              <button className="fpo-head-btn" title="Add section">+</button>
            </div>
          </div>

          <div className="fpo-doc">
            <div className="fpo-doc-ring"><HealthRing pct={healthPct} /></div>
            <div className="fpo-doc-info">
              <div className="fpo-doc-type">
                <span className="fpo-doc-type-badge" style={{ color: doc.color, borderColor: doc.color + "25", background: doc.color + "06" }}>
                  {doc.icon} {doc.label}
                </span>
                <span>·</span>
                <span>Bolt Fitness</span>
              </div>
              <div className="fpo-doc-stats">
                <span>{totalWords} words</span>
                <span>·</span>
                <span>{completeSections}/{totalSections} sections</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Sections ═══ */}
        <div className="fpo-sections">
          {sections.map(sec => {
            const st = SECTION_STATUS[sec.status];
            const isActive = activeSection === sec.id;
            const isCollapsed = collapsed.has(sec.id);
            const hasChildren = sec.children && sec.children.length > 0;
            const isHovered = hoveredSection === sec.id;

            return (
              <div key={sec.id} className="fpo-sec">
                {/* Main row */}
                <div
                  className={`fpo-sec-row${isActive ? " active" : ""}${sec.locked ? " locked" : ""}`}
                  onClick={() => !sec.locked && setActiveSection(sec.id)}
                  onMouseEnter={() => setHoveredSection(sec.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  {/* Drag handle */}
                  {!sec.locked && (
                    <div className="fpo-sec-drag">
                      <div className="fpo-sec-drag-dot" /><div className="fpo-sec-drag-dot" />
                      <div className="fpo-sec-drag-dot" /><div className="fpo-sec-drag-dot" />
                    </div>
                  )}
                  {sec.locked && <div style={{ width: 10 }} />}

                  {/* Collapse arrow */}
                  {hasChildren ? (
                    <div className={`fpo-sec-arrow${!isCollapsed ? " open" : ""}`}
                      onClick={e => { e.stopPropagation(); toggleCollapse(sec.id); }}>
                      ▸
                    </div>
                  ) : (
                    <div style={{ width: 12 }} />
                  )}

                  {/* Status */}
                  <div className={`fpo-sec-status fpo-st-${sec.status}`}>
                    {st.icon}
                  </div>

                  {/* Label + meta */}
                  <div className="fpo-sec-info">
                    <div className="fpo-sec-label">{sec.label}</div>
                    {sec.meta && <div className="fpo-sec-meta">{sec.meta}</div>}
                    {!sec.locked && sec.target > 0 && (
                      <WordBar count={sec.words} target={sec.target} color={st.color} />
                    )}
                  </div>

                  {/* Tooltip */}
                  {isHovered && !sec.locked && (
                    <div className="fpo-tip">
                      {sec.words > 0 ? `${sec.words}/${sec.target} words` : st.label}
                      {sec.suggestion ? ` · ${sec.suggestion.split("—")[0].trim()}` : ""}
                    </div>
                  )}
                </div>

                {/* Children */}
                {hasChildren && !isCollapsed && (
                  <div className="fpo-children">
                    {sec.children.map(child => {
                      const cSt = SECTION_STATUS[child.status];
                      const cActive = activeSection === child.id;
                      return (
                        <div key={child.id}
                          className={`fpo-child${cActive ? " active" : ""}`}
                          onClick={() => setActiveSection(child.id)}>
                          <div className={`fpo-child-dot fpo-cd-${child.status}`} />
                          <span className="fpo-child-label">{child.label}</span>
                          {child.meta && <span className="fpo-child-meta">{child.meta}</span>}
                          {child.words > 0 && <span className="fpo-child-words">{child.words}w</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Section suggestion */}
                {sec.suggestion && isActive && (
                  <div style={{ padding: "4px 8px 6px 46px" }}>
                    <div style={{ fontSize: 10, color: "var(--ember)", fontStyle: "italic", lineHeight: 1.4 }}>
                      ✦ {sec.suggestion}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ═══ AI Suggestions ═══ */}
        {showAI && missingSections.length > 0 && (
          <div className="fpo-ai">
            <div className="fpo-ai-head">
              <span className="fpo-ai-badge">AI</span>
              <span className="fpo-ai-title">Missing sections</span>
            </div>
            {missingSections.map(sec => (
              <div key={sec.id} className="fpo-ai-item" onClick={() => setActiveSection(sec.id)}>
                <div className="fpo-ai-item-dot" />
                <div className="fpo-ai-item-text">
                  <strong style={{ color: "var(--ink-700)" }}>{sec.label}</strong> is empty
                  {sec.suggestion && <span style={{ display: "block", marginTop: 2, fontSize: 10, color: "var(--ink-400)" }}>{sec.suggestion}</span>}
                </div>
                <span className="fpo-ai-item-action">Fix →</span>
              </div>
            ))}
          </div>
        )}

        {/* ═══ Footer ═══ */}
        <div className="fpo-foot">
          <div className="fpo-foot-left">
            <span className="fpo-foot-dot" />
            <span>Editing</span>
          </div>
          <span className="fpo-foot-right">{totalWords}w · {totalSections} sec</span>
        </div>
      </div>
    </>
  );
}
