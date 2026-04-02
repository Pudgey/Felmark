import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   FELMARK PDF EDITOR
   Edit. Annotate. Sign. Send.
   ═══════════════════════════════════════════ */

const TOOLS = [
  { id: "select", icon: "↖", label: "Select", shortcut: "V" },
  { id: "text", icon: "T", label: "Add text", shortcut: "T" },
  { id: "highlight", icon: "█", label: "Highlight", shortcut: "H" },
  { id: "underline", icon: "U̲", label: "Underline", shortcut: "U" },
  { id: "strikethrough", icon: "S̶", label: "Strikethrough", shortcut: "S" },
  { id: "draw", icon: "✎", label: "Freehand", shortcut: "D" },
  { id: "note", icon: "◇", label: "Sticky note", shortcut: "N" },
  { id: "shape", icon: "□", label: "Shape", shortcut: "R" },
  { id: "stamp", icon: "◎", label: "Stamp", shortcut: "P" },
  { id: "sign", icon: "✍", label: "Sign", shortcut: "G" },
  { id: "whiteout", icon: "▬", label: "White-out", shortcut: "W" },
  { id: "link", icon: "↗", label: "Link", shortcut: "K" },
];

const COLORS = ["#f7768e", "#ff9e64", "#e0af68", "#9ece6a", "#73daca", "#7aa2f7", "#bb9af7", "#2c2a25", "#b07d4f"];

const STAMPS = [
  { id: "approved", label: "Approved", color: "#16a34a" },
  { id: "rejected", label: "Rejected", color: "#dc2626" },
  { id: "draft", label: "Draft", color: "#7d7a72" },
  { id: "urgent", label: "Urgent", color: "#dc2626" },
  { id: "final", label: "Final", color: "#b07d4f" },
  { id: "reviewed", label: "Reviewed", color: "#2563eb" },
];

// Fake PDF page content
function PDFPage({ pageNum, zoom, annotations, activeAnnotation, onAnnotationClick, tool }) {
  const highlights = annotations.filter(a => a.page === pageNum && a.type === "highlight");
  const notes = annotations.filter(a => a.page === pageNum && a.type === "note");
  const stamps = annotations.filter(a => a.page === pageNum && a.type === "stamp");
  const sigs = annotations.filter(a => a.page === pageNum && a.type === "signature");
  const texts = annotations.filter(a => a.page === pageNum && a.type === "text");

  const cursorStyle = tool === "select" ? "default" : tool === "text" ? "text" : tool === "draw" ? "crosshair" : tool === "sign" ? "pointer" : "crosshair";

  return (
    <div className="pdf-page" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", cursor: cursorStyle }}>
      <div className="pdf-page-inner">
        {/* Simulated PDF content */}
        <div className="pdf-content">
          {pageNum === 1 && (
            <>
              <div className="pdf-c-header">
                <div className="pdf-c-logo">MERIDIAN</div>
                <div className="pdf-c-meta">
                  <div className="pdf-c-meta-row">Date: March 29, 2026</div>
                  <div className="pdf-c-meta-row">Contract #: FM-2026-047</div>
                </div>
              </div>
              <div className="pdf-c-title">Freelance Service Agreement</div>
              <div className="pdf-c-subtitle">Brand Identity Design Services</div>
              <div className="pdf-c-divider" />

              <div className="pdf-c-section">1. PARTIES</div>
              <div className="pdf-c-body">This Agreement is entered into between <strong>Alex Mercer Design</strong> ("Service Provider") and <strong>Meridian Studio</strong> ("Client"), collectively referred to as the "Parties."</div>

              <div className="pdf-c-section">2. SCOPE OF WORK</div>
              <div className="pdf-c-body">The Service Provider agrees to deliver the following brand identity services:</div>
              <div className="pdf-c-list">
                <div className="pdf-c-list-item">a) Primary logo design with 3 initial concepts and 2 rounds of revisions</div>
                <div className="pdf-c-list-item">b) Secondary logo mark and icon variant</div>
                <div className="pdf-c-list-item">c) Color palette — primary, secondary, accent, and semantic colors</div>
                <div className="pdf-c-list-item">d) Typography system — heading, body, and monospace font pairings</div>
                <div className="pdf-c-list-item">e) Brand guidelines document (40+ pages, PDF format)</div>
                <div className="pdf-c-list-item">f) Social media template kit — 12 templates for IG, LinkedIn, and X</div>
              </div>

              <div className="pdf-c-section">3. COMPENSATION</div>
              <div className="pdf-c-body">Total project fee: <strong>$4,800.00 USD</strong></div>
              <div className="pdf-c-body">Payment schedule:</div>
              <div className="pdf-c-list">
                <div className="pdf-c-list-item">• 50% deposit upon signing: $2,400.00</div>
                <div className="pdf-c-list-item">• 25% upon delivery of logo concepts: $1,200.00</div>
                <div className="pdf-c-list-item">• 25% upon final delivery: $1,200.00</div>
              </div>

              <div className="pdf-c-section">4. TIMELINE</div>
              <div className="pdf-c-body">Project duration: 6 weeks from deposit receipt. Specific milestones:</div>
              <div className="pdf-c-list">
                <div className="pdf-c-list-item">Week 1: Discovery & research</div>
                <div className="pdf-c-list-item">Week 2–3: Logo design & concepts</div>
                <div className="pdf-c-list-item">Week 4: Color, typography & system</div>
                <div className="pdf-c-list-item">Week 5: Guidelines document</div>
                <div className="pdf-c-list-item">Week 6: Social templates & final delivery</div>
              </div>

              <div className="pdf-c-section">5. REVISIONS</div>
              <div className="pdf-c-body">This agreement includes 2 rounds of revisions per deliverable. Additional revisions will be billed at $125/hour. A "round of revisions" constitutes a single consolidated set of feedback delivered within 3 business days.</div>
            </>
          )}

          {pageNum === 2 && (
            <>
              <div className="pdf-c-section">6. INTELLECTUAL PROPERTY</div>
              <div className="pdf-c-body">Upon receipt of final payment, all intellectual property rights for the deliverables described in Section 2 shall transfer to the Client. The Service Provider retains the right to display the work in their portfolio.</div>

              <div className="pdf-c-section">7. CONFIDENTIALITY</div>
              <div className="pdf-c-body">Both parties agree to maintain confidentiality of proprietary information shared during the course of this project. This includes but is not limited to business strategies, financial information, and unreleased brand materials.</div>

              <div className="pdf-c-section">8. TERMINATION</div>
              <div className="pdf-c-body">Either party may terminate this agreement with 14 days written notice. In the event of termination, the Client shall pay for all work completed to date. Deposits are non-refundable after the discovery phase is complete.</div>

              <div className="pdf-c-section">9. LIABILITY</div>
              <div className="pdf-c-body">The Service Provider's total liability under this agreement shall not exceed the total project fee of $4,800.00. Neither party shall be liable for indirect, incidental, or consequential damages.</div>

              <div className="pdf-c-section" style={{ marginTop: 40 }}>SIGNATURES</div>
              <div className="pdf-c-divider" />
              <div className="pdf-c-sig-area">
                <div className="pdf-c-sig-block">
                  <div className="pdf-c-sig-label">Service Provider</div>
                  <div className="pdf-c-sig-line" />
                  <div className="pdf-c-sig-name">Alex Mercer</div>
                  <div className="pdf-c-sig-date">Date: _______________</div>
                </div>
                <div className="pdf-c-sig-block">
                  <div className="pdf-c-sig-label">Client</div>
                  <div className="pdf-c-sig-line" />
                  <div className="pdf-c-sig-name">Sarah Chen, Meridian Studio</div>
                  <div className="pdf-c-sig-date">Date: _______________</div>
                </div>
              </div>

              <div className="pdf-c-footer">
                <div>Prepared with Felmark · tryfelmark.com</div>
                <div>Page 2 of 2</div>
              </div>
            </>
          )}
        </div>

        {/* Annotation overlays */}
        {highlights.map(h => (
          <div key={h.id} className={`pdf-ann-highlight${activeAnnotation === h.id ? " active" : ""}`}
            style={{ top: h.y, left: h.x, width: h.w, height: h.h, background: h.color + "30" }}
            onClick={() => onAnnotationClick(h.id)} />
        ))}
        {notes.map(n => (
          <div key={n.id} className={`pdf-ann-note${activeAnnotation === n.id ? " active" : ""}`}
            style={{ top: n.y, left: n.x }}
            onClick={() => onAnnotationClick(n.id)}>
            <div className="pdf-ann-note-icon" style={{ background: n.color }}>◇</div>
            {activeAnnotation === n.id && (
              <div className="pdf-ann-note-popup">
                <div className="pdf-ann-note-author">Alex Mercer · 2h ago</div>
                <div className="pdf-ann-note-text">{n.text}</div>
              </div>
            )}
          </div>
        ))}
        {stamps.map(s => (
          <div key={s.id} className="pdf-ann-stamp" style={{ top: s.y, left: s.x, color: s.color, borderColor: s.color }}>
            {s.label}
          </div>
        ))}
        {sigs.map(s => (
          <div key={s.id} className={`pdf-ann-sig${activeAnnotation === s.id ? " active" : ""}`}
            style={{ top: s.y, left: s.x }}
            onClick={() => onAnnotationClick(s.id)}>
            <div className="pdf-ann-sig-inner">{s.text}</div>
            <div className="pdf-ann-sig-line" />
            <div className="pdf-ann-sig-meta">{s.date}</div>
          </div>
        ))}
        {texts.map(t => (
          <div key={t.id} className={`pdf-ann-text${activeAnnotation === t.id ? " active" : ""}`}
            style={{ top: t.y, left: t.x, color: t.color, fontSize: t.size || 14 }}
            onClick={() => onAnnotationClick(t.id)}>
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// Signature modal
function SignModal({ onSign, onClose }) {
  const [mode, setMode] = useState("type");
  const [text, setText] = useState("Sarah Chen");
  const [font, setFont] = useState("script");
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  const fonts = {
    script: { family: "'Cormorant Garamond', serif", weight: 400, style: "italic", size: 28 },
    formal: { family: "'Cormorant Garamond', serif", weight: 600, style: "normal", size: 24 },
    clean: { family: "'Outfit', sans-serif", weight: 300, style: "italic", size: 22 },
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

  const startDraw = (e) => { drawing.current = true; };
  const moveDraw = (e) => {
    if (!drawing.current) return;
    const c = canvasRef.current, rect = c.getBoundingClientRect();
    const ctx = c.getContext("2d");
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineWidth = 2; ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y);
  };
  const endDraw = () => { drawing.current = false; const ctx = canvasRef.current?.getContext("2d"); ctx?.beginPath(); };

  const f = fonts[font];

  return (
    <div className="pdf-modal-overlay" onClick={onClose}>
      <div className="pdf-modal" onClick={e => e.stopPropagation()}>
        <div className="pdf-modal-head">
          <span className="pdf-modal-title">Insert signature</span>
          <button className="pdf-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="pdf-modal-tabs">
          <button className={`pdf-modal-tab${mode === "type" ? " on" : ""}`} onClick={() => setMode("type")}>Type</button>
          <button className={`pdf-modal-tab${mode === "draw" ? " on" : ""}`} onClick={() => setMode("draw")}>Draw</button>
        </div>

        <div className="pdf-modal-body">
          {mode === "type" && (
            <>
              <input className="pdf-modal-input" value={text} onChange={e => setText(e.target.value)} placeholder="Your name" autoFocus />
              <div className="pdf-modal-fonts">
                {Object.entries(fonts).map(([id, ff]) => (
                  <div key={id} className={`pdf-modal-font${font === id ? " on" : ""}`} onClick={() => setFont(id)}>
                    <span style={{ fontFamily: ff.family, fontWeight: ff.weight, fontStyle: ff.style, fontSize: Math.min(ff.size, 20) }}>{text || "Your Name"}</span>
                  </div>
                ))}
              </div>
              <div className="pdf-modal-preview">
                <div className="pdf-modal-preview-sig" style={{ fontFamily: f.family, fontWeight: f.weight, fontStyle: f.style, fontSize: f.size }}>
                  {text || "Your Name"}
                </div>
                <div className="pdf-modal-preview-line" />
              </div>
            </>
          )}
          {mode === "draw" && (
            <div className="pdf-modal-canvas-wrap">
              <canvas ref={canvasRef} className="pdf-modal-canvas"
                onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
                onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw} />
              <div className="pdf-modal-canvas-line" />
              <div className="pdf-modal-canvas-x">✕</div>
            </div>
          )}
        </div>

        <div className="pdf-modal-foot">
          <button className="pdf-modal-btn secondary" onClick={onClose}>Cancel</button>
          <button className="pdf-modal-btn primary" onClick={() => onSign(text, font)}>Insert Signature</button>
        </div>
      </div>
    </div>
  );
}


export default function PDFEditor() {
  const [tool, setTool] = useState("select");
  const [zoom, setZoom] = useState(85);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeColor, setActiveColor] = useState("#f7768e");
  const [showColors, setShowColors] = useState(false);
  const [showStamps, setShowStamps] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const [sidePanel, setSidePanel] = useState("pages"); // pages | comments | fields
  const totalPages = 2;

  const [annotations] = useState([
    { id: "h1", page: 1, type: "highlight", x: 42, y: 340, w: 420, h: 18, color: "#e0af68" },
    { id: "h2", page: 1, type: "highlight", x: 42, y: 525, w: 320, h: 18, color: "#f7768e" },
    { id: "n1", page: 1, type: "note", x: 500, y: 340, color: "#7aa2f7", text: "Sarah — please confirm this is the right entity name" },
    { id: "n2", page: 1, type: "note", x: 500, y: 570, color: "#e0af68", text: "Can we adjust the payment split to 40/30/30?" },
    { id: "s1", page: 2, type: "stamp", x: 360, y: 60, color: "#16a34a", label: "APPROVED" },
    { id: "sig1", page: 2, type: "signature", x: 60, y: 430, text: "Alex Mercer", date: "Signed Mar 29, 2026", font: "script" },
    { id: "t1", page: 1, type: "text", x: 42, y: 270, color: "#dc2626", text: "CONFIDENTIAL", size: 11 },
  ]);

  const comments = [
    { id: "c1", author: "Alex Mercer", avatar: "A", avatarColor: "#b07d4f", time: "2h ago", text: "Highlighted the entity name — Sarah, can you confirm this is correct?", page: 1, resolved: false },
    { id: "c2", author: "Sarah Chen", avatar: "S", avatarColor: "#7c8594", time: "1h ago", text: "Yes, that's correct. Can we adjust payment to 40/30/30?", page: 1, resolved: false },
    { id: "c3", author: "Alex Mercer", avatar: "A", avatarColor: "#b07d4f", time: "30m ago", text: "Updated. Also stamped page 2 as approved and signed.", page: 2, resolved: false },
  ];

  const fields = [
    { id: "f1", label: "Client name", value: "Meridian Studio", page: 1, filled: true },
    { id: "f2", label: "Contract date", value: "March 29, 2026", page: 1, filled: true },
    { id: "f3", label: "Project fee", value: "$4,800.00", page: 1, filled: true },
    { id: "f4", label: "Service Provider signature", value: "Signed", page: 2, filled: true },
    { id: "f5", label: "Client signature", value: "", page: 2, filled: false },
    { id: "f6", label: "Client date", value: "", page: 2, filled: false },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.pe{font-family:'Outfit',sans-serif;font-size:13px;color:var(--ink-700);background:#e8e5de;height:100vh;display:flex;flex-direction:column;overflow:hidden}

/* ═══ Top Bar ═══ */
.pe-top{padding:6px 12px;background:#fff;border-bottom:1px solid var(--warm-200);display:flex;align-items:center;gap:8px;flex-shrink:0}
.pe-top-left{display:flex;align-items:center;gap:8px;flex:1}
.pe-top-back{width:26px;height:26px;border-radius:5px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-400);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px}
.pe-top-back:hover{background:var(--warm-50)}
.pe-top-name{font-size:14px;font-weight:500;color:var(--ink-800);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pe-top-badge{font-family:var(--mono);font-size:8px;color:var(--ink-300);background:var(--warm-100);padding:2px 6px;border-radius:3px}
.pe-top-center{display:flex;align-items:center;gap:6px}
.pe-top-right{display:flex;align-items:center;gap:4px}
.pe-top-btn{padding:5px 12px;border-radius:5px;border:1px solid var(--warm-200);background:#fff;font-size:11px;font-family:inherit;color:var(--ink-500);cursor:pointer;display:flex;align-items:center;gap:4px;transition:all .08s}
.pe-top-btn:hover{background:var(--warm-50)}
.pe-top-btn.primary{background:var(--ink-900);color:#fff;border-color:var(--ink-900)}
.pe-top-btn.primary:hover{background:var(--ink-800)}
.pe-top-btn.ember{background:var(--ember);color:#fff;border-color:var(--ember)}
.pe-top-btn.ember:hover{background:var(--ember-light)}
.pe-collab{display:flex;margin-right:4px}
.pe-collab-av{width:24px;height:24px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;color:#fff;margin-left:-3px;border:2px solid #fff}

/* ═══ Toolbar ═══ */
.pe-toolbar{padding:4px 12px;background:#fff;border-bottom:1px solid var(--warm-200);display:flex;align-items:center;gap:2px;flex-shrink:0;position:relative}
.pe-tool{width:30px;height:30px;border-radius:5px;border:none;cursor:pointer;font-size:12px;color:var(--ink-400);background:none;display:flex;align-items:center;justify-content:center;transition:all .06s;position:relative}
.pe-tool:hover{background:var(--warm-100);color:var(--ink-600)}
.pe-tool.on{background:var(--ink-900);color:#fff}
.pe-tool-key{position:absolute;bottom:1px;right:2px;font-family:var(--mono);font-size:6px;color:var(--ink-300);opacity:0}
.pe-tool:hover .pe-tool-key{opacity:1}
.pe-tool.on .pe-tool-key{color:rgba(255,255,255,0.2)}
.pe-tool-sep{width:1px;height:20px;background:var(--warm-200);margin:0 3px}

/* Color picker */
.pe-colors{display:flex;gap:2px;margin-left:4px}
.pe-color{width:18px;height:18px;border-radius:4px;cursor:pointer;border:2px solid transparent;transition:all .06s}
.pe-color:hover{transform:scale(1.1)}
.pe-color.on{border-color:var(--ink-900);box-shadow:0 0 0 1px #fff inset}

/* Stamps dropdown */
.pe-stamps{position:absolute;top:100%;left:0;background:#fff;border:1px solid var(--warm-200);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.06);padding:4px;z-index:20;min-width:140px;margin-top:4px}
.pe-stamp-opt{display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:5px;cursor:pointer;font-size:12px;transition:background .06s}
.pe-stamp-opt:hover{background:var(--warm-50)}
.pe-stamp-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0}

/* Zoom */
.pe-zoom{display:flex;align-items:center;gap:3px;margin-left:auto}
.pe-zoom-btn{width:24px;height:24px;border-radius:4px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-400);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px}
.pe-zoom-btn:hover{background:var(--warm-100)}
.pe-zoom-val{font-family:var(--mono);font-size:10px;color:var(--ink-400);min-width:32px;text-align:center;cursor:pointer}

/* ═══ Main Layout ═══ */
.pe-main{flex:1;display:flex;overflow:hidden}

/* ═══ Side Panel ═══ */
.pe-side{width:220px;background:#fff;border-right:1px solid var(--warm-200);display:flex;flex-direction:column;flex-shrink:0}
.pe-side-tabs{display:flex;border-bottom:1px solid var(--warm-100);padding:2px}
.pe-side-tab{flex:1;padding:7px;font-size:11px;border:none;background:none;cursor:pointer;color:var(--ink-400);border-radius:4px;transition:all .08s;font-family:inherit;text-align:center}
.pe-side-tab:hover{color:var(--ink-600)}
.pe-side-tab.on{color:var(--ink-800);font-weight:500;background:var(--warm-50)}
.pe-side-content{flex:1;overflow-y:auto;padding:8px}
.pe-side-content::-webkit-scrollbar{width:3px}
.pe-side-content::-webkit-scrollbar-thumb{background:var(--warm-200);border-radius:2px}

/* Thumbnails */
.pe-thumb{border:2px solid transparent;border-radius:6px;margin-bottom:8px;cursor:pointer;overflow:hidden;transition:all .1s}
.pe-thumb:hover{border-color:var(--warm-300)}
.pe-thumb.on{border-color:var(--ember);box-shadow:0 0 0 1px var(--ember)}
.pe-thumb-inner{background:#fff;padding:8px;aspect-ratio:8.5/11;display:flex;flex-direction:column;gap:3px;position:relative}
.pe-thumb-line{height:2px;background:var(--warm-200);border-radius:1px}
.pe-thumb-line.title{height:4px;width:50%;background:var(--warm-300);margin-bottom:2px}
.pe-thumb-line.short{width:60%}
.pe-thumb-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-align:center;margin-top:4px}
.pe-thumb-badge{position:absolute;top:4px;right:4px;width:10px;height:10px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:6px;color:#fff}

/* Comments */
.pe-comment{padding:8px;border:1px solid var(--warm-100);border-radius:7px;margin-bottom:6px;cursor:pointer;transition:all .1s}
.pe-comment:hover{border-color:var(--warm-200);background:var(--warm-50)}
.pe-comment-top{display:flex;align-items:center;gap:6px;margin-bottom:4px}
.pe-comment-av{width:20px;height:20px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:600;color:#fff;flex-shrink:0}
.pe-comment-author{font-size:12px;font-weight:500;color:var(--ink-700);flex:1}
.pe-comment-time{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.pe-comment-text{font-size:12px;color:var(--ink-500);line-height:1.4;margin-bottom:3px}
.pe-comment-page{font-family:var(--mono);font-size:9px;color:var(--ink-300)}

/* Fields */
.pe-field{padding:8px;border:1px solid var(--warm-100);border-radius:6px;margin-bottom:4px;cursor:pointer;transition:all .08s;display:flex;align-items:center;gap:8px}
.pe-field:hover{border-color:var(--warm-200);background:var(--warm-50)}
.pe-field-status{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.pe-field-info{flex:1;min-width:0}
.pe-field-label{font-size:12px;color:var(--ink-600)}
.pe-field-val{font-family:var(--mono);font-size:11px;color:var(--ink-400);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pe-field-page{font-family:var(--mono);font-size:9px;color:var(--ink-300);flex-shrink:0}

/* ═══ Canvas Area ═══ */
.pe-canvas{flex:1;overflow:auto;display:flex;flex-direction:column;align-items:center;padding:24px 20px;gap:16px;background:#e8e5de}
.pe-canvas::-webkit-scrollbar{width:6px}
.pe-canvas::-webkit-scrollbar-thumb{background:var(--warm-400);border-radius:3px}

/* PDF Page */
.pdf-page{width:612px;flex-shrink:0;transition:transform .15s ease}
.pdf-page-inner{background:#fff;box-shadow:0 2px 12px rgba(0,0,0,0.08),0 0 0 1px rgba(0,0,0,0.03);border-radius:2px;position:relative;min-height:792px;overflow:hidden}

/* PDF content */
.pdf-content{padding:50px 55px;font-family:'Outfit',sans-serif;font-size:11px;color:#333;line-height:1.6}
.pdf-c-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px}
.pdf-c-logo{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:#1a1a1a;letter-spacing:.08em}
.pdf-c-meta{text-align:right}
.pdf-c-meta-row{font-family:var(--mono);font-size:9px;color:#888;line-height:1.6}
.pdf-c-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#1a1a1a;text-align:center;margin-bottom:3px}
.pdf-c-subtitle{font-family:var(--mono);font-size:10px;color:#888;text-align:center;margin-bottom:12px}
.pdf-c-divider{height:1px;background:#ddd;margin:12px 0}
.pdf-c-section{font-family:var(--mono);font-size:10px;font-weight:600;color:#1a1a1a;text-transform:uppercase;letter-spacing:.04em;margin:16px 0 6px}
.pdf-c-body{font-size:11px;color:#444;line-height:1.7;margin-bottom:8px}
.pdf-c-body strong{color:#1a1a1a}
.pdf-c-list{margin:4px 0 10px 12px}
.pdf-c-list-item{font-size:10.5px;color:#555;line-height:1.7;padding:1px 0}
.pdf-c-sig-area{display:flex;gap:40px;margin-top:20px}
.pdf-c-sig-block{flex:1}
.pdf-c-sig-label{font-family:var(--mono);font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.04em;margin-bottom:24px}
.pdf-c-sig-line{height:1px;background:#aaa;margin-bottom:6px}
.pdf-c-sig-name{font-size:11px;color:#444}
.pdf-c-sig-date{font-family:var(--mono);font-size:9px;color:#aaa;margin-top:4px}
.pdf-c-footer{display:flex;justify-content:space-between;font-family:var(--mono);font-size:8px;color:#bbb;margin-top:40px;padding-top:10px;border-top:1px solid #eee}

/* ═══ Annotations ═══ */
.pdf-ann-highlight{position:absolute;border-radius:2px;cursor:pointer;transition:outline .1s}
.pdf-ann-highlight:hover,.pdf-ann-highlight.active{outline:2px solid var(--ember)}
.pdf-ann-note{position:absolute;cursor:pointer;z-index:5}
.pdf-ann-note-icon{width:22px;height:22px;border-radius:5px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;box-shadow:0 2px 6px rgba(0,0,0,0.1);transition:transform .1s}
.pdf-ann-note:hover .pdf-ann-note-icon{transform:scale(1.1)}
.pdf-ann-note-popup{position:absolute;top:28px;left:0;background:#fff;border:1px solid var(--warm-200);border-radius:8px;padding:10px;box-shadow:0 4px 16px rgba(0,0,0,0.08);width:200px;z-index:10;animation:popIn .12s ease}
@keyframes popIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.pdf-ann-note-author{font-family:var(--mono);font-size:9px;color:var(--ink-300);margin-bottom:4px}
.pdf-ann-note-text{font-size:12px;color:var(--ink-600);line-height:1.4}
.pdf-ann-stamp{position:absolute;font-family:var(--mono);font-size:14px;font-weight:700;letter-spacing:.1em;border:2.5px solid;border-radius:4px;padding:4px 14px;transform:rotate(-12deg);opacity:.7}
.pdf-ann-sig{position:absolute;cursor:pointer;transition:outline .1s}
.pdf-ann-sig:hover,.pdf-ann-sig.active{outline:2px dashed var(--ember);outline-offset:4px;border-radius:2px}
.pdf-ann-sig-inner{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:400;font-style:italic;color:var(--ink-800)}
.pdf-ann-sig-line{height:1px;background:var(--ink-900);opacity:.15;margin:2px 0}
.pdf-ann-sig-meta{font-family:var(--mono);font-size:8px;color:var(--ink-300)}
.pdf-ann-text{position:absolute;font-family:var(--mono);font-weight:600;letter-spacing:.05em;cursor:pointer}
.pdf-ann-text:hover,.pdf-ann-text.active{outline:1px dashed var(--ember);outline-offset:2px}

/* ═══ Footer ═══ */
.pe-foot{padding:5px 12px;background:#fff;border-top:1px solid var(--warm-200);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.pe-foot-left{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:10px;color:var(--ink-300)}
.pe-foot-pages{display:flex;align-items:center;gap:4px}
.pe-foot-page-btn{width:22px;height:22px;border-radius:4px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-400);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px}
.pe-foot-page-btn:hover{background:var(--warm-50)}
.pe-foot-right{display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.pe-foot-dot{width:4px;height:4px;border-radius:50%;background:#16a34a}

/* ═══ Sign Modal ═══ */
.pdf-modal-overlay{position:fixed;inset:0;background:rgba(44,42,37,0.25);display:flex;align-items:center;justify-content:center;z-index:100}
.pdf-modal{background:#fff;border:1px solid var(--warm-200);border-radius:12px;width:420px;box-shadow:0 16px 48px rgba(0,0,0,0.12);animation:modalIn .15s ease}
@keyframes modalIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
.pdf-modal-head{padding:14px 18px;border-bottom:1px solid var(--warm-100);display:flex;align-items:center;justify-content:space-between}
.pdf-modal-title{font-size:15px;font-weight:500;color:var(--ink-800)}
.pdf-modal-close{width:24px;height:24px;border-radius:5px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-400);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px}
.pdf-modal-tabs{display:flex;gap:1px;padding:8px 18px;background:var(--warm-50);border-bottom:1px solid var(--warm-100)}
.pdf-modal-tab{flex:1;padding:6px;border-radius:5px;border:none;font-size:12px;font-family:inherit;cursor:pointer;color:var(--ink-400);background:transparent;text-align:center;transition:all .08s}
.pdf-modal-tab.on{background:#fff;color:var(--ink-800);font-weight:500;box-shadow:0 1px 3px rgba(0,0,0,0.04)}
.pdf-modal-body{padding:16px 18px}
.pdf-modal-input{width:100%;padding:8px 12px;border:1px solid var(--warm-200);border-radius:6px;font-size:14px;font-family:inherit;color:var(--ink-800);outline:none;margin-bottom:12px}
.pdf-modal-input:focus{border-color:var(--ember)}
.pdf-modal-fonts{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-bottom:12px}
.pdf-modal-font{padding:10px 8px;border:1px solid var(--warm-200);border-radius:6px;cursor:pointer;text-align:center;transition:all .08s;overflow:hidden}
.pdf-modal-font:hover{border-color:var(--warm-300)}
.pdf-modal-font.on{border-color:var(--ember);background:var(--ember-bg)}
.pdf-modal-preview{border:1px solid var(--warm-200);border-radius:6px;padding:16px;text-align:center;position:relative}
.pdf-modal-preview-sig{color:var(--ink-800);min-height:36px;display:flex;align-items:center;justify-content:center}
.pdf-modal-preview-line{position:absolute;bottom:16px;left:20px;right:20px;height:1px;background:var(--ink-900);opacity:.06}
.pdf-modal-canvas-wrap{position:relative;border:1px solid var(--warm-200);border-radius:6px;overflow:hidden}
.pdf-modal-canvas{width:100%;height:100px;cursor:crosshair;display:block;touch-action:none}
.pdf-modal-canvas-line{position:absolute;bottom:24px;left:16px;right:16px;height:1px;background:var(--ink-900);opacity:.06;pointer-events:none}
.pdf-modal-canvas-x{position:absolute;bottom:20px;left:10px;font-size:11px;color:var(--warm-300);pointer-events:none}
.pdf-modal-foot{padding:12px 18px;border-top:1px solid var(--warm-100);display:flex;gap:6px;justify-content:flex-end}
.pdf-modal-btn{padding:8px 18px;border-radius:6px;font-size:12px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .1s;border:none}
.pdf-modal-btn.secondary{background:#fff;color:var(--ink-500);border:1px solid var(--warm-200)}
.pdf-modal-btn.secondary:hover{background:var(--warm-50)}
.pdf-modal-btn.primary{background:var(--ink-900);color:#fff}
.pdf-modal-btn.primary:hover{background:var(--ink-800)}
      `}</style>

      <div className="pe">
        {/* ═══ Top Bar ═══ */}
        <div className="pe-top">
          <div className="pe-top-left">
            <button className="pe-top-back">←</button>
            <span className="pe-top-name">Freelance_Service_Agreement_Meridian.pdf</span>
            <span className="pe-top-badge">PDF</span>
            <span className="pe-top-badge">2 pages</span>
          </div>
          <div className="pe-top-center">
            <div className="pe-collab">
              <div className="pe-collab-av" style={{ background: "#b07d4f" }}>A</div>
              <div className="pe-collab-av" style={{ background: "#7c8594" }}>S</div>
            </div>
          </div>
          <div className="pe-top-right">
            <button className="pe-top-btn">↓ Download</button>
            <button className="pe-top-btn">⎙ Print</button>
            <button className="pe-top-btn ember" onClick={() => setShowSignModal(true)}>✍ Sign</button>
            <button className="pe-top-btn primary">Send to Client →</button>
          </div>
        </div>

        {/* ═══ Toolbar ═══ */}
        <div className="pe-toolbar">
          {TOOLS.map((t, i) => (
            <span key={t.id}>
              {(i === 1 || i === 5 || i === 8 || i === 10) && <span className="pe-tool-sep" />}
              <button className={`pe-tool${tool === t.id ? " on" : ""}`}
                onClick={() => {
                  setTool(t.id);
                  if (t.id === "stamp") setShowStamps(!showStamps);
                  else setShowStamps(false);
                  if (t.id === "sign") setShowSignModal(true);
                }}
                title={`${t.label} (${t.shortcut})`}>
                {t.icon}
                <span className="pe-tool-key">{t.shortcut}</span>
              </button>
            </span>
          ))}

          {/* Color picker */}
          <span className="pe-tool-sep" />
          <div className="pe-colors">
            {COLORS.slice(0, 6).map(c => (
              <div key={c} className={`pe-color${activeColor === c ? " on" : ""}`}
                style={{ background: c }} onClick={() => setActiveColor(c)} />
            ))}
          </div>

          {/* Stamps dropdown */}
          {showStamps && (
            <div className="pe-stamps">
              {STAMPS.map(s => (
                <div key={s.id} className="pe-stamp-opt" onClick={() => { setShowStamps(false); setTool("select"); }}>
                  <div className="pe-stamp-dot" style={{ background: s.color }} />
                  <span style={{ color: s.color, fontWeight: 500 }}>{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Zoom */}
          <div className="pe-zoom">
            <button className="pe-zoom-btn" onClick={() => setZoom(z => Math.max(40, z - 10))}>−</button>
            <span className="pe-zoom-val" onClick={() => setZoom(85)}>{zoom}%</span>
            <button className="pe-zoom-btn" onClick={() => setZoom(z => Math.min(200, z + 10))}>+</button>
          </div>
        </div>

        {/* ═══ Main ═══ */}
        <div className="pe-main">
          {/* Side panel */}
          <div className="pe-side">
            <div className="pe-side-tabs">
              <button className={`pe-side-tab${sidePanel === "pages" ? " on" : ""}`} onClick={() => setSidePanel("pages")}>Pages</button>
              <button className={`pe-side-tab${sidePanel === "comments" ? " on" : ""}`} onClick={() => setSidePanel("comments")}>Comments</button>
              <button className={`pe-side-tab${sidePanel === "fields" ? " on" : ""}`} onClick={() => setSidePanel("fields")}>Fields</button>
            </div>
            <div className="pe-side-content">
              {sidePanel === "pages" && (
                <>
                  {[1, 2].map(p => (
                    <div key={p} className={`pe-thumb${currentPage === p ? " on" : ""}`} onClick={() => setCurrentPage(p)}>
                      <div className="pe-thumb-inner">
                        {p === 1 && <>
                          <div className="pe-thumb-line title" />
                          <div className="pe-thumb-line" /><div className="pe-thumb-line short" />
                          <div className="pe-thumb-line" /><div className="pe-thumb-line" /><div className="pe-thumb-line short" />
                          <div className="pe-thumb-line" /><div className="pe-thumb-line" />
                          <div className="pe-thumb-badge" style={{ background: "#7aa2f7" }}>2</div>
                        </>}
                        {p === 2 && <>
                          <div className="pe-thumb-line" /><div className="pe-thumb-line short" />
                          <div className="pe-thumb-line" /><div className="pe-thumb-line" />
                          <div style={{ flex: 1 }} />
                          <div className="pe-thumb-line" /><div className="pe-thumb-line short" />
                          <div className="pe-thumb-badge" style={{ background: "#16a34a" }}>✓</div>
                        </>}
                      </div>
                      <div className="pe-thumb-label">Page {p}</div>
                    </div>
                  ))}
                </>
              )}

              {sidePanel === "comments" && (
                <>
                  {comments.map(c => (
                    <div key={c.id} className="pe-comment">
                      <div className="pe-comment-top">
                        <div className="pe-comment-av" style={{ background: c.avatarColor }}>{c.avatar}</div>
                        <span className="pe-comment-author">{c.author}</span>
                        <span className="pe-comment-time">{c.time}</span>
                      </div>
                      <div className="pe-comment-text">{c.text}</div>
                      <div className="pe-comment-page">Page {c.page}</div>
                    </div>
                  ))}
                </>
              )}

              {sidePanel === "fields" && (
                <>
                  {fields.map(f => (
                    <div key={f.id} className="pe-field">
                      <div className="pe-field-status" style={{ background: f.filled ? "#16a34a" : "#dc2626" }} />
                      <div className="pe-field-info">
                        <div className="pe-field-label">{f.label}</div>
                        <div className="pe-field-val">{f.value || "Empty — click to fill"}</div>
                      </div>
                      <span className="pe-field-page">p.{f.page}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 8, padding: "8px 0", borderTop: "1px solid var(--warm-100)", fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-300)", textAlign: "center" }}>
                    {fields.filter(f => f.filled).length} of {fields.length} fields complete
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="pe-canvas">
            {[1, 2].map(p => (
              <PDFPage key={p} pageNum={p} zoom={zoom} annotations={annotations}
                activeAnnotation={activeAnnotation}
                onAnnotationClick={id => setActiveAnnotation(activeAnnotation === id ? null : id)}
                tool={tool} />
            ))}
          </div>
        </div>

        {/* ═══ Footer ═══ */}
        <div className="pe-foot">
          <div className="pe-foot-left">
            <div className="pe-foot-pages">
              <button className="pe-foot-page-btn" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>‹</button>
              <span>{currentPage} / {totalPages}</span>
              <button className="pe-foot-page-btn" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}>›</button>
            </div>
            <span>·</span>
            <span>7 annotations</span>
            <span>·</span>
            <span>{fields.filter(f => f.filled).length}/{fields.length} fields</span>
          </div>
          <div className="pe-foot-right">
            <span className="pe-foot-dot" />
            <span>Saved · Last edit 2m ago</span>
          </div>
        </div>

        {/* Sign modal */}
        {showSignModal && (
          <SignModal onSign={(text, font) => setShowSignModal(false)} onClose={() => setShowSignModal(false)} />
        )}
      </div>
    </>
  );
}
