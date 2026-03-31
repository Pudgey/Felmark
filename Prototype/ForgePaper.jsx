// ═══════════════════════════════════════════
// FORGE PAPER by Felmark
// Draft. Sign. Send. No PDF needed.
// The contract IS the editor. The editor IS the contract.
// ═══════════════════════════════════════════
//
// What it is:
//   A formal document renderer that takes Felmark blocks and presents them
//   as a professional, signable, shareable contract/proposal/agreement.
//   Same blocks you already wrote — rendered with contract-grade typography,
//   page numbers, section numbering, signature fields, and legal formatting.
//
// What it replaces:
//   DocuSign ($10-45/mo), PandaDoc ($19/mo), HelloSign ($15/mo),
//   Adobe Sign ($15/mo), and the entire "export to PDF then upload
//   to a signing tool" workflow.
//
// The flow:
//   1. Write in the Felmark editor (or /ai generate a contract)
//   2. Click "Forge Paper" → blocks render as formal document
//   3. Add signature fields → drag to position
//   4. Send → client gets a branded link
//   5. Client reads, signs in browser
//   6. Both parties get a signed copy
//   7. Status syncs back to your workspace
//
// What you already have that powers this:
//   - Block editor with 40+ block types
//   - E-signature block (draw + type + 4 font choices)
//   - Share system with PIN protection + expiration
//   - Client portal prototype
//   - AI generation (Haiku creates full contracts)
//   - Pricing configurator, scope boundary, payment schedule
//   - Due date system, deliverable tracking
//   - @felmark/forge service layer
//
// Architecture:
//   Forge Paper is NOT a separate editor. It's a render mode.
//   The same blocks, the same data, the same forge services —
//   just rendered with formal document styling instead of editor chrome.
//
//   Editor view:  blocks with gutters, slash menu, format bar
//   Paper view:   same blocks with contract typography, page breaks, numbering
//
// ═══════════════════════════════════════════

import { useState, useRef, useEffect } from "react";

// ── Signature modal (reused from e-signature block pattern) ──
function SignModal({ onSign, onClose }) {
  const [mode, setMode] = useState("type");
  const [text, setText] = useState("");
  const [font, setFont] = useState("script");
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  const fonts = {
    script: { family: "'Cormorant Garamond', serif", weight: 400, style: "italic", size: 28 },
    formal: { family: "'Cormorant Garamond', serif", weight: 600, style: "normal", size: 24 },
    clean: { family: "'Outfit', sans-serif", weight: 300, style: "italic", size: 22 },
    mono: { family: "'JetBrains Mono', monospace", weight: 400, style: "normal", size: 18 },
  };

  useEffect(() => {
    if (mode !== "draw") return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const rect = c.getBoundingClientRect();
    c.width = rect.width * 2; c.height = rect.height * 2;
    ctx.scale(2, 2); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#2c2a25";
  }, [mode]);

  const startDraw = () => { drawing.current = true; };
  const moveDraw = (e) => {
    if (!drawing.current) return;
    const c = canvasRef.current, rect = c.getBoundingClientRect();
    const ctx = c.getContext("2d");
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineWidth = 2; ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y);
  };
  const endDraw = () => { drawing.current = false; canvasRef.current?.getContext("2d")?.beginPath(); };

  const f = fonts[font];

  return (
    <div className="fp-modal-overlay" onClick={onClose}>
      <div className="fp-modal" onClick={e => e.stopPropagation()}>
        <div className="fp-modal-head">
          <span className="fp-modal-title">Sign this document</span>
          <button className="fp-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="fp-modal-tabs">
          <button className={`fp-modal-tab${mode === "type" ? " on" : ""}`} onClick={() => setMode("type")}>Type</button>
          <button className={`fp-modal-tab${mode === "draw" ? " on" : ""}`} onClick={() => setMode("draw")}>Draw</button>
        </div>
        <div className="fp-modal-body">
          {mode === "type" && (
            <>
              <input className="fp-modal-input" value={text} onChange={e => setText(e.target.value)} placeholder="Your full legal name" autoFocus />
              <div className="fp-modal-fonts">
                {Object.entries(fonts).map(([id, ff]) => (
                  <div key={id} className={`fp-modal-font${font === id ? " on" : ""}`} onClick={() => setFont(id)}>
                    <span style={{ fontFamily: ff.family, fontWeight: ff.weight, fontStyle: ff.style, fontSize: Math.min(ff.size, 20) }}>{text || "Your Name"}</span>
                  </div>
                ))}
              </div>
              <div className="fp-modal-preview">
                <div className="fp-modal-preview-sig" style={{ fontFamily: f.family, fontWeight: f.weight, fontStyle: f.style, fontSize: f.size }}>
                  {text || "Your Name"}
                </div>
                <div className="fp-modal-preview-line" />
              </div>
            </>
          )}
          {mode === "draw" && (
            <div className="fp-modal-canvas-wrap">
              <canvas ref={canvasRef} className="fp-modal-canvas"
                onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
                onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw} />
              <div className="fp-modal-canvas-line" />
              <div className="fp-modal-canvas-x">✕</div>
            </div>
          )}
        </div>
        <div className="fp-modal-foot">
          <div className="fp-modal-legal">By signing, you agree to the terms in this document. This constitutes a legally binding electronic signature.</div>
          <div className="fp-modal-actions">
            <button className="fp-modal-btn secondary" onClick={onClose}>Cancel</button>
            <button className="fp-modal-btn primary" onClick={() => onSign(text, font)} disabled={mode === "type" && !text.trim()}>Sign Document</button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function ForgePaper() {
  const [showSignModal, setShowSignModal] = useState(false);
  const [signed, setSigned] = useState({ provider: true, client: false });
  const [clientSig, setClientSig] = useState(null);
  const [view, setView] = useState("paper"); // paper | edit
  const [sent, setSent] = useState(false);

  const handleSign = (text, font) => {
    setClientSig({ text, font });
    setSigned(prev => ({ ...prev, client: true }));
    setShowSignModal(false);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.fp{font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink-700);background:#e8e5de;min-height:100vh;display:flex;flex-direction:column}

/* ═══ Top Bar ═══ */
.fp-top{padding:8px 20px;background:#fff;border-bottom:1px solid var(--warm-200);display:flex;align-items:center;gap:10px;flex-shrink:0}
.fp-top-back{width:28px;height:28px;border-radius:6px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-400);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px}
.fp-top-back:hover{background:var(--warm-50)}
.fp-top-info{flex:1}
.fp-top-title{font-size:15px;font-weight:500;color:var(--ink-800);display:flex;align-items:center;gap:8px}
.fp-top-badge{font-family:var(--mono);font-size:8px;padding:2px 7px;border-radius:3px;letter-spacing:.03em}
.fp-top-badge.paper{color:var(--ember);background:var(--ember-bg);border:1px solid rgba(176,125,79,0.08)}
.fp-top-badge.status{color:#5a9a3c;background:rgba(90,154,60,0.04);border:1px solid rgba(90,154,60,0.08)}
.fp-top-badge.pending{color:var(--ink-400);background:var(--warm-100);border:1px solid var(--warm-200)}
.fp-top-sub{font-family:var(--mono);font-size:10px;color:var(--ink-300);margin-top:1px}
.fp-top-right{display:flex;align-items:center;gap:5px}
.fp-top-btn{padding:6px 14px;border-radius:6px;border:1px solid var(--warm-200);background:#fff;font-size:12px;font-family:inherit;color:var(--ink-500);cursor:pointer;display:flex;align-items:center;gap:5px;transition:all .08s}
.fp-top-btn:hover{background:var(--warm-50)}
.fp-top-btn.primary{background:var(--ink-900);color:#fff;border-color:var(--ink-900)}
.fp-top-btn.primary:hover{background:var(--ink-800)}
.fp-top-btn.ember{background:var(--ember);color:#fff;border-color:var(--ember)}
.fp-top-btn.ember:hover{background:var(--ember-light)}
.fp-top-btn.sent{background:rgba(90,154,60,0.04);color:#5a9a3c;border-color:rgba(90,154,60,0.1);cursor:default}

/* ═══ Paper ═══ */
.fp-scroll{flex:1;overflow-y:auto;display:flex;justify-content:center;padding:32px 20px 80px}
.fp-scroll::-webkit-scrollbar{width:6px}
.fp-scroll::-webkit-scrollbar-thumb{background:var(--warm-400);border-radius:3px}

.fp-paper{width:680px;background:#fff;border-radius:3px;box-shadow:0 2px 16px rgba(0,0,0,0.08),0 0 0 1px rgba(0,0,0,0.02);position:relative}

/* ═══ Document Content ═══ */
.fp-doc{padding:60px 72px}

.fp-doc-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px}
.fp-doc-logo{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:var(--ink-900);letter-spacing:.06em}
.fp-doc-logo-sub{font-family:var(--mono);font-size:9px;color:var(--ink-300);margin-top:2px}
.fp-doc-meta{text-align:right;font-family:var(--mono);font-size:9px;color:var(--ink-400);line-height:1.8}

.fp-doc-title{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:var(--ink-900);text-align:center;margin-bottom:4px}
.fp-doc-subtitle{font-family:var(--mono);font-size:10px;color:var(--ink-400);text-align:center;margin-bottom:20px;letter-spacing:.04em}
.fp-doc-divider{height:1px;background:var(--warm-200);margin:16px 0}

.fp-doc-section{font-family:var(--mono);font-size:10px;font-weight:600;color:var(--ink-900);text-transform:uppercase;letter-spacing:.04em;margin:24px 0 8px}
.fp-doc-body{font-size:14px;color:var(--ink-600);line-height:1.75;margin-bottom:10px}
.fp-doc-body strong{color:var(--ink-800)}
.fp-doc-list{margin:6px 0 12px 16px}
.fp-doc-list-item{font-size:13px;color:var(--ink-500);line-height:1.8;padding:1px 0}

/* Pricing table */
.fp-doc-pricing{border:1px solid var(--warm-200);border-radius:8px;overflow:hidden;margin:12px 0}
.fp-doc-pricing-row{display:flex;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--warm-100);font-size:13px}
.fp-doc-pricing-row:last-child{border-bottom:none}
.fp-doc-pricing-row.total{background:var(--ink-900);color:#fff;padding:12px 16px}
.fp-doc-pricing-label{color:var(--ink-500)}
.fp-doc-pricing-row.total .fp-doc-pricing-label{color:rgba(255,255,255,0.6)}
.fp-doc-pricing-val{font-family:var(--mono);font-weight:500;color:var(--ink-800)}
.fp-doc-pricing-row.total .fp-doc-pricing-val{color:#fff;font-size:15px}

/* Timeline */
.fp-doc-timeline{display:flex;gap:0;margin:12px 0}
.fp-doc-tl-item{flex:1;text-align:center;padding:8px;position:relative}
.fp-doc-tl-item::after{content:'';position:absolute;top:18px;left:50%;right:-50%;height:1px;background:var(--warm-200);z-index:0}
.fp-doc-tl-item:last-child::after{display:none}
.fp-doc-tl-dot{width:10px;height:10px;border-radius:50%;border:2px solid var(--warm-300);background:#fff;margin:0 auto 4px;position:relative;z-index:1}
.fp-doc-tl-label{font-size:11px;font-weight:500;color:var(--ink-600)}
.fp-doc-tl-date{font-family:var(--mono);font-size:9px;color:var(--ink-300)}

/* Scope boundary */
.fp-doc-scope{display:flex;gap:0;margin:12px 0;border:1px solid var(--warm-200);border-radius:8px;overflow:hidden}
.fp-doc-scope-col{flex:1;padding:14px}
.fp-doc-scope-head{font-size:12px;font-weight:500;margin-bottom:8px;padding:4px 8px;border-radius:4px}
.fp-doc-scope-head.in{color:#5a9a3c;background:rgba(90,154,60,0.04)}
.fp-doc-scope-head.out{color:#c24b38;background:rgba(194,75,56,0.03)}
.fp-doc-scope-item{font-size:12px;color:var(--ink-500);padding:3px 0;display:flex;align-items:flex-start;gap:6px}
.fp-doc-scope-divider{width:1px;background:var(--warm-200)}

/* Signature area */
.fp-doc-sig{margin-top:32px;padding-top:20px;border-top:1px solid var(--warm-200)}
.fp-doc-sig-title{font-family:var(--mono);font-size:10px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px;text-align:center}
.fp-doc-sig-parties{display:flex;gap:40px}
.fp-doc-sig-party{flex:1;text-align:center}
.fp-doc-sig-role{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em;margin-bottom:20px}

/* Signed state */
.fp-doc-sig-signed{margin-bottom:6px}
.fp-doc-sig-signed-text{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:400;font-style:italic;color:var(--ink-800)}
.fp-doc-sig-line{height:1px;background:var(--ink-900);opacity:.1;margin-bottom:6px}
.fp-doc-sig-name{font-size:12px;color:var(--ink-500)}
.fp-doc-sig-date{font-family:var(--mono);font-size:9px;color:var(--ink-300);margin-top:2px}
.fp-doc-sig-badge{font-family:var(--mono);font-size:9px;padding:2px 8px;border-radius:3px;display:inline-block;margin-top:4px}
.fp-doc-sig-badge.signed{color:#5a9a3c;background:rgba(90,154,60,0.04);border:1px solid rgba(90,154,60,0.08)}

/* Pending state */
.fp-doc-sig-pending{padding:16px;border:1px dashed var(--warm-300);border-radius:8px;margin-bottom:6px}
.fp-doc-sig-pending-text{font-family:var(--mono);font-size:10px;color:var(--ink-300);margin-bottom:8px}
.fp-doc-sig-sign-btn{padding:8px 24px;border-radius:6px;border:none;background:var(--ember);color:#fff;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .1s}
.fp-doc-sig-sign-btn:hover{background:var(--ember-light)}

/* Footer */
.fp-doc-footer{display:flex;justify-content:space-between;font-family:var(--mono);font-size:8px;color:var(--ink-300);margin-top:40px;padding-top:12px;border-top:1px solid var(--warm-100)}

/* ═══ Sent overlay ═══ */
.fp-sent{position:absolute;inset:0;background:rgba(255,255,255,0.95);display:flex;align-items:center;justify-content:center;z-index:10;animation:fpSentIn .3s ease}
@keyframes fpSentIn{from{opacity:0}to{opacity:1}}
.fp-sent-inner{text-align:center}
.fp-sent-check{width:56px;height:56px;border-radius:50%;background:rgba(90,154,60,0.06);border:2px solid rgba(90,154,60,0.12);color:#5a9a3c;font-size:24px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px}
.fp-sent-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:var(--ink-900);margin-bottom:4px}
.fp-sent-sub{font-size:14px;color:var(--ink-400);margin-bottom:12px}
.fp-sent-url{font-family:var(--mono);font-size:11px;color:var(--ember);background:var(--ember-bg);padding:6px 14px;border-radius:5px;border:1px solid rgba(176,125,79,0.08)}

/* ═══ Modal ═══ */
.fp-modal-overlay{position:fixed;inset:0;background:rgba(44,42,37,0.25);display:flex;align-items:center;justify-content:center;z-index:100}
.fp-modal{background:#fff;border:1px solid var(--warm-200);border-radius:14px;width:440px;box-shadow:0 16px 48px rgba(0,0,0,0.12);animation:fpModalIn .15s ease}
@keyframes fpModalIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
.fp-modal-head{padding:16px 20px;border-bottom:1px solid var(--warm-100);display:flex;align-items:center;justify-content:space-between}
.fp-modal-title{font-size:16px;font-weight:500;color:var(--ink-800)}
.fp-modal-close{width:26px;height:26px;border-radius:6px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-400);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px}
.fp-modal-tabs{display:flex;gap:2px;padding:10px 20px;background:var(--warm-50);border-bottom:1px solid var(--warm-100)}
.fp-modal-tab{flex:1;padding:7px;border-radius:5px;border:none;font-size:12px;font-family:inherit;cursor:pointer;color:var(--ink-400);background:transparent;text-align:center;transition:all .08s}
.fp-modal-tab.on{background:#fff;color:var(--ink-800);font-weight:500;box-shadow:0 1px 3px rgba(0,0,0,0.04)}
.fp-modal-body{padding:18px 20px}
.fp-modal-input{width:100%;padding:10px 14px;border:1px solid var(--warm-200);border-radius:7px;font-size:15px;font-family:inherit;color:var(--ink-800);outline:none;margin-bottom:14px}
.fp-modal-input:focus{border-color:var(--ember)}
.fp-modal-input::placeholder{color:var(--warm-400)}
.fp-modal-fonts{display:grid;grid-template-columns:repeat(2,1fr);gap:5px;margin-bottom:14px}
.fp-modal-font{padding:12px 10px;border:1px solid var(--warm-200);border-radius:7px;cursor:pointer;text-align:center;transition:all .08s;overflow:hidden}
.fp-modal-font:hover{border-color:var(--warm-300)}
.fp-modal-font.on{border-color:var(--ember);background:var(--ember-bg);box-shadow:0 0 0 1px var(--ember)}
.fp-modal-preview{border:1px solid var(--warm-200);border-radius:8px;padding:20px;text-align:center;position:relative}
.fp-modal-preview-sig{color:var(--ink-800);min-height:40px;display:flex;align-items:center;justify-content:center}
.fp-modal-preview-line{position:absolute;bottom:20px;left:24px;right:24px;height:1px;background:var(--ink-900);opacity:.06}
.fp-modal-canvas-wrap{position:relative;border:1px solid var(--warm-200);border-radius:8px;overflow:hidden}
.fp-modal-canvas{width:100%;height:120px;cursor:crosshair;display:block;touch-action:none}
.fp-modal-canvas-line{position:absolute;bottom:28px;left:20px;right:20px;height:1px;background:var(--ink-900);opacity:.06;pointer-events:none}
.fp-modal-canvas-x{position:absolute;bottom:24px;left:12px;font-size:12px;color:var(--warm-300);pointer-events:none}
.fp-modal-foot{padding:14px 20px;border-top:1px solid var(--warm-100)}
.fp-modal-legal{font-family:var(--mono);font-size:10px;color:var(--ink-300);line-height:1.5;margin-bottom:12px}
.fp-modal-actions{display:flex;gap:6px;justify-content:flex-end}
.fp-modal-btn{padding:9px 20px;border-radius:6px;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .1s;border:none}
.fp-modal-btn.secondary{background:#fff;color:var(--ink-500);border:1px solid var(--warm-200)}
.fp-modal-btn.secondary:hover{background:var(--warm-50)}
.fp-modal-btn.primary{background:var(--ink-900);color:#fff}
.fp-modal-btn.primary:hover{background:var(--ink-800)}
.fp-modal-btn:disabled{opacity:.3;cursor:not-allowed}

/* ═══ Bottom bar ═══ */
.fp-bottom{padding:6px 20px;background:#fff;border-top:1px solid var(--warm-200);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.fp-bottom-left{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:10px;color:var(--ink-300)}
.fp-bottom-dot{width:4px;height:4px;border-radius:50%;background:var(--ember)}
.fp-bottom-right{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
      `}</style>

      <div className="fp">
        {/* ═══ Top Bar ═══ */}
        <div className="fp-top">
          <button className="fp-top-back">←</button>
          <div className="fp-top-info">
            <div className="fp-top-title">
              Freelance Service Agreement
              <span className="fp-top-badge paper">FORGE PAPER</span>
              {signed.provider && signed.client
                ? <span className="fp-top-badge status">✓ Fully signed</span>
                : signed.provider
                  ? <span className="fp-top-badge pending">1 of 2 signed</span>
                  : null}
            </div>
            <div className="fp-top-sub">Meridian Studio · $4,800 · Brand Identity</div>
          </div>
          <div className="fp-top-right">
            <button className="fp-top-btn">↓ Export PDF</button>
            <button className="fp-top-btn">⎙ Print</button>
            {!sent ? (
              <button className="fp-top-btn ember" onClick={() => setSent(true)}>Send to Client →</button>
            ) : (
              <button className="fp-top-btn sent">✓ Sent</button>
            )}
          </div>
        </div>

        {/* ═══ Paper ═══ */}
        <div className="fp-scroll">
          <div className="fp-paper">
            {sent && (
              <div className="fp-sent">
                <div className="fp-sent-inner">
                  <div className="fp-sent-check">✓</div>
                  <div className="fp-sent-title">Forge Paper sent</div>
                  <div className="fp-sent-sub">Sarah Chen will receive this at sarah@meridianstudio.co</div>
                  <div className="fp-sent-url">share.tryfelmark.com/fp/meridian-047</div>
                </div>
              </div>
            )}

            <div className="fp-doc">
              {/* Header */}
              <div className="fp-doc-header">
                <div>
                  <div className="fp-doc-logo">ALEX MERCER</div>
                  <div className="fp-doc-logo-sub">Brand Identity Design</div>
                </div>
                <div className="fp-doc-meta">
                  Date: March 31, 2026<br />
                  Document: FM-2026-047<br />
                  Prepared for: Meridian Studio
                </div>
              </div>

              <div className="fp-doc-title">Freelance Service Agreement</div>
              <div className="fp-doc-subtitle">Brand Identity Design Services</div>
              <div className="fp-doc-divider" />

              {/* 1. Parties */}
              <div className="fp-doc-section">1. Parties</div>
              <div className="fp-doc-body">This Agreement is entered into between <strong>Alex Mercer Design</strong> ("Service Provider") and <strong>Meridian Studio</strong> ("Client"), collectively referred to as the "Parties."</div>

              {/* 2. Scope */}
              <div className="fp-doc-section">2. Scope of Work</div>
              <div className="fp-doc-body">The Service Provider agrees to deliver the following brand identity services:</div>
              <div className="fp-doc-list">
                <div className="fp-doc-list-item">a) Primary logo design with 3 initial concepts and 2 rounds of revisions</div>
                <div className="fp-doc-list-item">b) Secondary logo mark and icon variant</div>
                <div className="fp-doc-list-item">c) Color palette — primary, secondary, accent, and semantic colors</div>
                <div className="fp-doc-list-item">d) Typography system — heading, body, and monospace font pairings</div>
                <div className="fp-doc-list-item">e) Brand guidelines document (40+ pages, PDF format)</div>
                <div className="fp-doc-list-item">f) Social media template kit — 12 templates for IG, LinkedIn, and X</div>
              </div>

              {/* Scope boundary */}
              <div className="fp-doc-scope">
                <div className="fp-doc-scope-col">
                  <div className="fp-doc-scope-head in">✓ Included</div>
                  <div className="fp-doc-scope-item"><span style={{color:"#5a9a3c"}}>✓</span> Logo design & variants</div>
                  <div className="fp-doc-scope-item"><span style={{color:"#5a9a3c"}}>✓</span> Color & typography system</div>
                  <div className="fp-doc-scope-item"><span style={{color:"#5a9a3c"}}>✓</span> Brand guidelines PDF</div>
                  <div className="fp-doc-scope-item"><span style={{color:"#5a9a3c"}}>✓</span> Social media templates</div>
                </div>
                <div className="fp-doc-scope-divider" />
                <div className="fp-doc-scope-col">
                  <div className="fp-doc-scope-head out">✕ Not included</div>
                  <div className="fp-doc-scope-item"><span style={{color:"#c24b38"}}>✕</span> Website design</div>
                  <div className="fp-doc-scope-item"><span style={{color:"#c24b38"}}>✕</span> Copywriting</div>
                  <div className="fp-doc-scope-item"><span style={{color:"#c24b38"}}>✕</span> Photography</div>
                  <div className="fp-doc-scope-item"><span style={{color:"#c24b38"}}>✕</span> Print production</div>
                </div>
              </div>

              {/* 3. Compensation */}
              <div className="fp-doc-section">3. Compensation</div>
              <div className="fp-doc-pricing">
                <div className="fp-doc-pricing-row"><span className="fp-doc-pricing-label">Brand Identity — Complete Package</span><span className="fp-doc-pricing-val">$4,800.00</span></div>
                <div className="fp-doc-pricing-row"><span className="fp-doc-pricing-label">50% deposit upon signing</span><span className="fp-doc-pricing-val">$2,400.00</span></div>
                <div className="fp-doc-pricing-row"><span className="fp-doc-pricing-label">25% upon logo delivery</span><span className="fp-doc-pricing-val">$1,200.00</span></div>
                <div className="fp-doc-pricing-row"><span className="fp-doc-pricing-label">25% upon final delivery</span><span className="fp-doc-pricing-val">$1,200.00</span></div>
                <div className="fp-doc-pricing-row total"><span className="fp-doc-pricing-label">Total</span><span className="fp-doc-pricing-val">$4,800.00</span></div>
              </div>

              {/* 4. Timeline */}
              <div className="fp-doc-section">4. Timeline</div>
              <div className="fp-doc-body">Project duration: 6 weeks from deposit receipt.</div>
              <div className="fp-doc-timeline">
                {[{ l: "Discovery", d: "Week 1" }, { l: "Concepts", d: "Week 2-3" }, { l: "System", d: "Week 4" }, { l: "Guidelines", d: "Week 5" }, { l: "Delivery", d: "Week 6" }].map((t, i) => (
                  <div key={i} className="fp-doc-tl-item">
                    <div className="fp-doc-tl-dot" />
                    <div className="fp-doc-tl-label">{t.l}</div>
                    <div className="fp-doc-tl-date">{t.d}</div>
                  </div>
                ))}
              </div>

              {/* 5-8 abbreviated */}
              <div className="fp-doc-section">5. Revisions</div>
              <div className="fp-doc-body">2 rounds of revisions per deliverable included. Additional revisions billed at $125/hour.</div>

              <div className="fp-doc-section">6. Intellectual Property</div>
              <div className="fp-doc-body">Upon final payment, all IP transfers to Client. Provider retains portfolio display rights.</div>

              <div className="fp-doc-section">7. Confidentiality</div>
              <div className="fp-doc-body">Both parties agree to maintain confidentiality of proprietary information shared during this project.</div>

              <div className="fp-doc-section">8. Termination</div>
              <div className="fp-doc-body">Either party may terminate with 14 days written notice. Client pays for all completed work. Deposits non-refundable after discovery phase.</div>

              {/* Signatures */}
              <div className="fp-doc-sig">
                <div className="fp-doc-sig-title">Signatures</div>
                <div className="fp-doc-sig-parties">
                  {/* Provider — signed */}
                  <div className="fp-doc-sig-party">
                    <div className="fp-doc-sig-role">Service Provider</div>
                    <div className="fp-doc-sig-signed">
                      <div className="fp-doc-sig-signed-text">Alex Mercer</div>
                    </div>
                    <div className="fp-doc-sig-line" />
                    <div className="fp-doc-sig-name">Alex Mercer</div>
                    <div className="fp-doc-sig-date">Signed March 31, 2026</div>
                    <span className="fp-doc-sig-badge signed">✓ Signed</span>
                  </div>

                  {/* Client — pending or signed */}
                  <div className="fp-doc-sig-party">
                    <div className="fp-doc-sig-role">Client</div>
                    {signed.client && clientSig ? (
                      <>
                        <div className="fp-doc-sig-signed">
                          <div className="fp-doc-sig-signed-text">{clientSig.text}</div>
                        </div>
                        <div className="fp-doc-sig-line" />
                        <div className="fp-doc-sig-name">{clientSig.text}, Meridian Studio</div>
                        <div className="fp-doc-sig-date">Signed March 31, 2026</div>
                        <span className="fp-doc-sig-badge signed">✓ Signed</span>
                      </>
                    ) : (
                      <div className="fp-doc-sig-pending">
                        <div className="fp-doc-sig-pending-text">Awaiting signature</div>
                        <button className="fp-doc-sig-sign-btn" onClick={() => setShowSignModal(true)}>Sign Document</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="fp-doc-footer">
                <span>⚒ Powered by @felmark/forge</span>
                <span>Page 1 of 1 · FM-2026-047</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Bottom Bar ═══ */}
        <div className="fp-bottom">
          <div className="fp-bottom-left">
            <span className="fp-bottom-dot" />
            <span>Forge Paper · {signed.provider && signed.client ? "Fully executed" : "Awaiting signature"}</span>
          </div>
          <div className="fp-bottom-right">⚒ @felmark/forge</div>
        </div>

        {/* Sign modal */}
        {showSignModal && (
          <SignModal onSign={handleSign} onClose={() => setShowSignModal(false)} />
        )}
      </div>
    </>
  );
}
