import { useState } from "react";

/* ═══════════════════════════════════════════
   FELMARK — QUICK ELEMENTS
   AI sees what's missing. You click to fix it.
   Lives in the left sidebar.
   ═══════════════════════════════════════════ */

export default function QuickElements() {
  const [dismissed, setDismissed] = useState(new Set());
  const [inserted, setInserted] = useState(new Set());
  const [expanded, setExpanded] = useState(null);

  const suggestions = [
    {
      id: "social-proof",
      priority: "high",
      icon: "❝",
      label: "Add social proof",
      reason: "Proposals with testimonials close 34% more often",
      detail: "Your proposal has pricing but no testimonials. Drop a client quote before the pricing table — it builds trust right before the decision point.",
      block: "Pull Quote",
      blockIcon: "❝",
      impact: "+34% close rate",
      impactColor: "#5a9a3c",
      preview: "\"Alex didn't just design our brand — he gave us a strategic foundation...\" — Sarah Chen, Meridian Studio",
    },
    {
      id: "scope-block",
      priority: "high",
      icon: "◆",
      label: "Define scope boundary",
      reason: "This project has no explicit scope — #1 cause of creep",
      detail: "You've listed deliverables but haven't drawn the line on what's excluded. Add a Scope Boundary block to prevent 'I thought that was included' conversations.",
      block: "Scope Boundary",
      blockIcon: "◆",
      impact: "Prevents scope creep",
      impactColor: "#b07d4f",
      preview: "✓ Logo design, color palette, typography ✕ Website, copywriting, print production",
    },
    {
      id: "timeline",
      priority: "medium",
      icon: "◇",
      label: "Show the timeline",
      reason: "Clients are 2× more likely to sign with a clear roadmap",
      detail: "Your proposal jumps from deliverables to pricing. Add a Visual Timeline between them so the client sees when each phase happens and when they'll get results.",
      block: "Visual Timeline",
      blockIcon: "◇",
      impact: "2× sign rate",
      impactColor: "#5b7fa4",
      preview: "Week 1: Discovery → Week 2-3: Design → Week 4: Refinement → Week 5: Delivery",
    },
  ];

  const activeSuggestions = suggestions.filter(s => !dismissed.has(s.id));

  if (activeSuggestions.length === 0) {
    return (
      <>
        <Styles />
        <div className="qe">
          <div className="qe-head">
            <div className="qe-head-row">
              <span className="qe-head-icon">✦</span>
              <span className="qe-head-title">Quick elements</span>
            </div>
          </div>
          <div className="qe-empty">
            <div className="qe-empty-icon">✓</div>
            <div className="qe-empty-text">Looking good</div>
            <div className="qe-empty-sub">No suggestions right now</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Styles />
      <div className="qe">
        {/* Header */}
        <div className="qe-head">
          <div className="qe-head-row">
            <span className="qe-head-icon">✦</span>
            <span className="qe-head-title">Quick elements</span>
          </div>
          <div className="qe-head-sub">AI suggestions for this document</div>
        </div>

        {/* Suggestions */}
        <div className="qe-list">
          {activeSuggestions.map((s, i) => {
            const isExpanded = expanded === s.id;
            const isInserted = inserted.has(s.id);

            return (
              <div key={s.id} className={`qe-item${isExpanded ? " expanded" : ""}${isInserted ? " inserted" : ""}`}>
                {/* Collapsed */}
                <div className="qe-item-top" onClick={() => setExpanded(isExpanded ? null : s.id)}>
                  <div className="qe-item-left">
                    <div className={`qe-item-icon ${s.priority}`}>{s.icon}</div>
                    <div className="qe-item-info">
                      <div className="qe-item-label">{s.label}</div>
                      <div className="qe-item-reason">{s.reason}</div>
                    </div>
                  </div>
                  <div className="qe-item-chevron">{isExpanded ? "−" : "+"}</div>
                </div>

                {/* Expanded detail */}
                {isExpanded && !isInserted && (
                  <div className="qe-item-detail">
                    <div className="qe-item-explain">{s.detail}</div>

                    {/* Preview */}
                    <div className="qe-item-preview">
                      <div className="qe-item-preview-label">
                        <span className="qe-item-preview-icon">{s.blockIcon}</span>
                        {s.block}
                      </div>
                      <div className="qe-item-preview-text">{s.preview}</div>
                    </div>

                    {/* Impact */}
                    <div className="qe-item-impact">
                      <span className="qe-item-impact-dot" style={{ background: s.impactColor }} />
                      <span className="qe-item-impact-text" style={{ color: s.impactColor }}>{s.impact}</span>
                    </div>

                    {/* Actions */}
                    <div className="qe-item-actions">
                      <button className="qe-btn-insert" onClick={(e) => { e.stopPropagation(); setInserted(prev => new Set([...prev, s.id])); }}>
                        + Insert {s.block}
                      </button>
                      <button className="qe-btn-dismiss" onClick={(e) => { e.stopPropagation(); setDismissed(prev => new Set([...prev, s.id])); setExpanded(null); }}>
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* Inserted state */}
                {isInserted && (
                  <div className="qe-item-inserted">
                    <span className="qe-item-inserted-icon">✓</span>
                    <span className="qe-item-inserted-text">Inserted below pricing table</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="qe-foot">
          <div className="qe-foot-row">
            <span className="qe-foot-dot" />
            <span>Analyzing document...</span>
          </div>
        </div>
      </div>
    </>
  );
}

function Styles() {
  return (
    <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap');

.qe{font-family:'Outfit',sans-serif;width:260px;background:#fff;border:1px solid var(--warm-200);border-radius:10px;overflow:hidden}

/* Head */
.qe-head{padding:12px 14px 10px;border-bottom:1px solid var(--warm-100)}
.qe-head-row{display:flex;align-items:center;gap:6px;margin-bottom:2px}
.qe-head-icon{font-size:12px;color:var(--ember)}
.qe-head-title{font-size:13px;font-weight:600;color:var(--ink-800)}
.qe-head-sub{font-family:var(--mono);font-size:9px;color:var(--ink-300)}

/* List */
.qe-list{padding:4px}

/* Item */
.qe-item{border:1px solid transparent;border-radius:8px;margin-bottom:3px;transition:all .12s;overflow:hidden}
.qe-item:last-child{margin-bottom:0}
.qe-item:hover{background:var(--warm-50)}
.qe-item.expanded{border-color:var(--warm-200);background:#fff}
.qe-item.inserted{opacity:.5}

.qe-item-top{display:flex;align-items:center;gap:8px;padding:8px 8px;cursor:pointer;justify-content:space-between}
.qe-item-left{display:flex;align-items:center;gap:8px;flex:1;min-width:0}

.qe-item-icon{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;border:1px solid}
.qe-item-icon.high{color:var(--ember);background:var(--ember-bg);border-color:rgba(176,125,79,0.1)}
.qe-item-icon.medium{color:#5b7fa4;background:rgba(91,127,164,0.06);border-color:rgba(91,127,164,0.1)}

.qe-item-info{flex:1;min-width:0}
.qe-item-label{font-size:12px;font-weight:500;color:var(--ink-800);line-height:1.2}
.qe-item-reason{font-size:10px;color:var(--ink-300);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.qe-item-chevron{font-size:14px;color:var(--ink-300);flex-shrink:0;width:18px;text-align:center;transition:color .1s}
.qe-item:hover .qe-item-chevron{color:var(--ink-500)}

/* Detail */
.qe-item-detail{padding:0 10px 10px;animation:detIn .15s ease}
@keyframes detIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}

.qe-item-explain{font-size:12px;color:var(--ink-500);line-height:1.5;margin-bottom:10px}

/* Preview */
.qe-item-preview{background:var(--warm-50);border:1px solid var(--warm-100);border-radius:6px;padding:8px 10px;margin-bottom:8px}
.qe-item-preview-label{font-family:var(--mono);font-size:9px;color:var(--ink-400);display:flex;align-items:center;gap:4px;margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em}
.qe-item-preview-icon{font-size:10px;color:var(--ember)}
.qe-item-preview-text{font-size:11px;color:var(--ink-500);line-height:1.4;font-style:italic}

/* Impact */
.qe-item-impact{display:flex;align-items:center;gap:5px;margin-bottom:10px}
.qe-item-impact-dot{width:5px;height:5px;border-radius:50%}
.qe-item-impact-text{font-family:var(--mono);font-size:10px;font-weight:500}

/* Actions */
.qe-item-actions{display:flex;gap:5px}
.qe-btn-insert{flex:1;padding:7px;border-radius:5px;border:none;background:var(--ink-900);color:#fff;font-size:11px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .1s}
.qe-btn-insert:hover{background:var(--ink-800)}
.qe-btn-dismiss{padding:7px 10px;border-radius:5px;border:1px solid var(--warm-200);background:#fff;font-size:11px;font-family:inherit;color:var(--ink-400);cursor:pointer;transition:all .08s}
.qe-btn-dismiss:hover{background:var(--warm-50);color:var(--ink-600)}

/* Inserted */
.qe-item-inserted{padding:4px 10px 8px;display:flex;align-items:center;gap:5px}
.qe-item-inserted-icon{font-size:10px;color:#5a9a3c}
.qe-item-inserted-text{font-size:11px;color:#5a9a3c}

/* Empty */
.qe-empty{padding:24px 14px;text-align:center}
.qe-empty-icon{font-size:18px;color:#5a9a3c;margin-bottom:6px}
.qe-empty-text{font-size:13px;font-weight:500;color:var(--ink-600);margin-bottom:2px}
.qe-empty-sub{font-size:11px;color:var(--ink-300)}

/* Footer */
.qe-foot{padding:8px 14px;border-top:1px solid var(--warm-100)}
.qe-foot-row{display:flex;align-items:center;gap:5px;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.qe-foot-dot{width:4px;height:4px;border-radius:50%;background:var(--ember);animation:qdot 2s ease infinite}
@keyframes qdot{0%,60%,100%{opacity:.2}20%{opacity:1}}
    `}</style>
  );
}
