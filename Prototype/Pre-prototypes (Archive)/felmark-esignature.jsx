import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   FELMARK — E-SIGNATURE BLOCK
   The last thing in every proposal.
   The moment a project becomes real.
   ═══════════════════════════════════════════ */

// ── Drawing Canvas ──
function SignCanvas({ onSign }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const points = useRef([]);
  const hasDrawn = useRef(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const rect = c.getBoundingClientRect();
    c.width = rect.width * 2;
    c.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#2c2a25";
  }, []);

  const getPos = (e) => {
    const c = canvasRef.current;
    const rect = c.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    drawing.current = true;
    points.current = [getPos(e)];
    hasDrawn.current = true;
  };

  const moveDraw = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const pos = getPos(e);
    points.current.push(pos);
    const ctx = canvasRef.current.getContext("2d");

    if (points.current.length < 3) return;

    const p = points.current;
    const len = p.length;

    ctx.beginPath();
    ctx.moveTo(p[len - 3].x, p[len - 3].y);

    // Smooth quadratic curve through midpoints
    const mx = (p[len - 2].x + p[len - 1].x) / 2;
    const my = (p[len - 2].y + p[len - 1].y) / 2;
    ctx.quadraticCurveTo(p[len - 2].x, p[len - 2].y, mx, my);

    // Variable width based on speed
    const dx = p[len - 1].x - p[len - 2].x;
    const dy = p[len - 1].y - p[len - 2].y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    const width = Math.max(1, Math.min(3.5, 4 - speed * 0.08));

    ctx.lineWidth = width;
    ctx.stroke();
  };

  const endDraw = () => {
    drawing.current = false;
  };

  const clear = () => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    hasDrawn.current = false;
    points.current = [];
  };

  const accept = () => {
    if (!hasDrawn.current) return;
    onSign(canvasRef.current.toDataURL());
  };

  return (
    <div className="es-draw">
      <div className="es-draw-label">Draw your signature</div>
      <div className="es-draw-canvas-wrap">
        <canvas ref={canvasRef} className="es-draw-canvas"
          onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw} />
        <div className="es-draw-baseline" />
        <div className="es-draw-x">✕</div>
      </div>
      <div className="es-draw-actions">
        <button className="es-btn-clear" onClick={clear}>Clear</button>
        <button className="es-btn-accept" onClick={accept}>Accept & Sign</button>
      </div>
    </div>
  );
}

// ── Type Signature ──
function SignType({ name, onSign }) {
  const [text, setText] = useState(name);
  const fonts = [
    { id: "script", family: "'Cormorant Garamond', serif", weight: 400, style: "italic", size: 32 },
    { id: "formal", family: "'Cormorant Garamond', serif", weight: 600, style: "normal", size: 28 },
    { id: "clean", family: "'Outfit', sans-serif", weight: 300, style: "italic", size: 26 },
    { id: "mono", family: "'JetBrains Mono', monospace", weight: 400, style: "normal", size: 20 },
  ];
  const [font, setFont] = useState("script");

  const selectedFont = fonts.find(f => f.id === font);

  return (
    <div className="es-type">
      <div className="es-type-label">Type your signature</div>
      <input className="es-type-input" value={text} onChange={e => setText(e.target.value)} placeholder="Your full name" />

      <div className="es-type-preview-label">Choose a style</div>
      <div className="es-type-fonts">
        {fonts.map(f => (
          <div key={f.id} className={`es-type-font${font === f.id ? " on" : ""}`} onClick={() => setFont(f.id)}>
            <span style={{ fontFamily: f.family, fontWeight: f.weight, fontStyle: f.style, fontSize: Math.min(f.size, 22), color: "var(--ink-800)" }}>
              {text || "Your Name"}
            </span>
          </div>
        ))}
      </div>

      {/* Large preview */}
      <div className="es-type-preview">
        <div className="es-type-preview-sig" style={{
          fontFamily: selectedFont.family,
          fontWeight: selectedFont.weight,
          fontStyle: selectedFont.style,
          fontSize: selectedFont.size,
        }}>
          {text || "Your Name"}
        </div>
        <div className="es-type-baseline" />
      </div>

      <div className="es-draw-actions">
        <button className="es-btn-accept" onClick={() => onSign(text)} disabled={!text.trim()}>Accept & Sign</button>
      </div>
    </div>
  );
}

// ── Signed Party Display ──
function SignedParty({ party, status, sigData, timestamp, ip }) {
  return (
    <div className={`es-party ${status}`}>
      <div className="es-party-top">
        <div className={`es-party-status ${status}`}>
          {status === "signed" ? "✓" : status === "viewing" ? "◎" : "○"}
        </div>
        <div className="es-party-info">
          <div className="es-party-name">{party.name}</div>
          <div className="es-party-role">{party.role}</div>
        </div>
        {status === "signed" && (
          <div className="es-party-badge">Signed</div>
        )}
        {status === "viewing" && (
          <div className="es-party-badge viewing">Viewing now</div>
        )}
      </div>

      {status === "signed" && (
        <div className="es-party-sig-area">
          {/* If it's image data (drawn), show image; otherwise show typed */}
          {sigData && sigData.startsWith("data:") ? (
            <img src={sigData} alt="Signature" className="es-party-sig-img" />
          ) : (
            <div className="es-party-sig-typed">{sigData}</div>
          )}
          <div className="es-party-sig-line" />
          <div className="es-party-sig-meta">
            <span>{timestamp}</span>
            <span>·</span>
            <span>IP {ip}</span>
          </div>
        </div>
      )}

      {status === "pending" && (
        <div className="es-party-pending">
          <div className="es-party-pending-line" />
          <div className="es-party-pending-text">Awaiting signature</div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ──
export default function ESignature() {
  const [clientSigned, setClientSigned] = useState(false);
  const [clientSigData, setClientSigData] = useState(null);
  const [mode, setMode] = useState("draw"); // draw | type
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSign = (data) => {
    setClientSigned(true);
    setClientSigData(data);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const now = new Date();
  const timestamp = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) + " at " + now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.es-page{font-family:'Outfit',sans-serif;background:var(--parchment);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px}
.es-wrap{width:100%;max-width:620px}

/* ── Block container ── */
.es-block{background:#fff;border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;position:relative}

/* ── Header ── */
.es-header{padding:18px 22px 14px;border-bottom:1px solid var(--warm-100)}
.es-header-row{display:flex;align-items:center;gap:8px;margin-bottom:4px}
.es-header-icon{width:28px;height:28px;border-radius:7px;background:var(--ember-bg);border:1px solid rgba(176,125,79,0.08);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--ember)}
.es-header-title{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;color:var(--ink-900)}
.es-header-sub{font-size:12px;color:var(--ink-400);padding-left:36px}

/* ── Agreement text ── */
.es-agreement{padding:14px 22px;border-bottom:1px solid var(--warm-100);background:var(--warm-50)}
.es-agreement-text{font-size:12px;color:var(--ink-500);line-height:1.6}
.es-agreement-text strong{color:var(--ink-700);font-weight:500}

/* ── Parties section ── */
.es-parties{padding:16px 22px}
.es-parties-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px}

/* Party row */
.es-party{border:1px solid var(--warm-200);border-radius:10px;padding:14px 16px;margin-bottom:10px;transition:all .2s}
.es-party:last-child{margin-bottom:0}
.es-party.signed{border-color:rgba(90,154,60,0.12);background:rgba(90,154,60,0.01)}

.es-party-top{display:flex;align-items:center;gap:10px}
.es-party-status{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;transition:all .2s}
.es-party-status.signed{background:rgba(90,154,60,0.06);color:#5a9a3c;border:1px solid rgba(90,154,60,0.1)}
.es-party-status.pending{background:var(--warm-50);color:var(--ink-300);border:1px solid var(--warm-200)}
.es-party-status.viewing{background:rgba(91,127,164,0.06);color:#5b7fa4;border:1px solid rgba(91,127,164,0.1);animation:viewPulse 2s ease infinite}
@keyframes viewPulse{0%,100%{box-shadow:0 0 0 0 rgba(91,127,164,0)}50%{box-shadow:0 0 0 4px rgba(91,127,164,0.06)}}

.es-party-info{flex:1}
.es-party-name{font-size:14px;font-weight:500;color:var(--ink-800)}
.es-party-role{font-size:11px;color:var(--ink-400)}

.es-party-badge{font-family:var(--mono);font-size:9px;font-weight:500;padding:3px 10px;border-radius:4px;flex-shrink:0}
.es-party-badge{color:#5a9a3c;background:rgba(90,154,60,0.04);border:1px solid rgba(90,154,60,0.08)}
.es-party-badge.viewing{color:#5b7fa4;background:rgba(91,127,164,0.04);border:1px solid rgba(91,127,164,0.08)}

/* Signature display area */
.es-party-sig-area{margin-top:12px;padding-top:8px}
.es-party-sig-img{height:48px;display:block;margin-bottom:4px;filter:contrast(1.2)}
.es-party-sig-typed{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:400;font-style:italic;color:var(--ink-800);margin-bottom:4px}
.es-party-sig-line{height:1px;background:var(--ink-900);opacity:0.1;margin-bottom:6px}
.es-party-sig-meta{display:flex;gap:6px;font-family:var(--mono);font-size:9px;color:var(--ink-300)}

/* Pending state */
.es-party-pending{margin-top:12px}
.es-party-pending-line{height:1px;background:var(--warm-200);margin-bottom:6px;position:relative}
.es-party-pending-line::after{content:'✕';position:absolute;left:8px;top:-8px;font-size:11px;color:var(--warm-300)}
.es-party-pending-text{font-family:var(--mono);font-size:10px;color:var(--ink-300)}

/* ── Signing area ── */
.es-signing{padding:16px 22px;border-top:1px solid var(--warm-100)}
.es-signing-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px}

/* Mode tabs */
.es-modes{display:flex;gap:2px;margin-bottom:14px;background:var(--warm-100);border-radius:6px;padding:2px}
.es-mode{flex:1;padding:6px;border-radius:5px;border:none;font-size:12px;font-family:inherit;color:var(--ink-400);cursor:pointer;transition:all .1s;background:transparent;text-align:center}
.es-mode.on{background:#fff;color:var(--ink-800);font-weight:500;box-shadow:0 1px 3px rgba(0,0,0,0.04)}

/* Draw canvas */
.es-draw-label,.es-type-label{font-size:12px;font-weight:500;color:var(--ink-600);margin-bottom:6px}
.es-draw-canvas-wrap{position:relative;border:1px solid var(--warm-200);border-radius:8px;overflow:hidden;margin-bottom:10px;background:#fff}
.es-draw-canvas{width:100%;height:120px;cursor:crosshair;display:block;touch-action:none}
.es-draw-baseline{position:absolute;bottom:28px;left:20px;right:20px;height:1px;background:var(--ink-900);opacity:0.06;pointer-events:none}
.es-draw-x{position:absolute;bottom:24px;left:12px;font-size:13px;color:var(--warm-300);pointer-events:none}
.es-draw-actions{display:flex;gap:6px}
.es-btn-clear{padding:8px 16px;border-radius:6px;border:1px solid var(--warm-200);background:#fff;font-size:12px;font-family:inherit;color:var(--ink-400);cursor:pointer;transition:all .08s}
.es-btn-clear:hover{background:var(--warm-50)}
.es-btn-accept{flex:1;padding:8px;border-radius:6px;border:none;background:var(--ink-900);color:#fff;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .1s}
.es-btn-accept:hover:not(:disabled){background:var(--ink-800);transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,0.06)}
.es-btn-accept:disabled{opacity:.3;cursor:not-allowed}

/* Type signature */
.es-type-input{width:100%;padding:8px 12px;border:1px solid var(--warm-200);border-radius:6px;font-size:14px;font-family:inherit;color:var(--ink-800);outline:none;margin-bottom:12px;transition:border-color .1s}
.es-type-input:focus{border-color:var(--ember)}
.es-type-input::placeholder{color:var(--warm-400)}

.es-type-preview-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}
.es-type-fonts{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:14px}
.es-type-font{padding:10px 12px;border:1px solid var(--warm-200);border-radius:7px;cursor:pointer;transition:all .1s;text-align:center;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;min-height:44px;display:flex;align-items:center;justify-content:center}
.es-type-font:hover{border-color:var(--warm-300);background:var(--warm-50)}
.es-type-font.on{border-color:var(--ember);background:var(--ember-bg);box-shadow:0 0 0 1px var(--ember)}

.es-type-preview{border:1px solid var(--warm-200);border-radius:8px;padding:16px 20px;margin-bottom:10px;background:#fff;text-align:center;position:relative}
.es-type-preview-sig{color:var(--ink-800);line-height:1.2;min-height:40px;display:flex;align-items:center;justify-content:center}
.es-type-baseline{position:absolute;bottom:20px;left:24px;right:24px;height:1px;background:var(--ink-900);opacity:0.06}

/* ── Legal footer ── */
.es-legal{padding:12px 22px;border-top:1px solid var(--warm-100);display:flex;align-items:center;gap:6px}
.es-legal-icon{font-size:10px;color:var(--ink-300)}
.es-legal-text{font-family:var(--mono);font-size:9px;color:var(--ink-300);line-height:1.5}

/* ── Celebration overlay ── */
.es-celebration{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:10;animation:celebIn .3s ease}
@keyframes celebIn{from{opacity:0}to{opacity:1}}
.es-celeb-inner{text-align:center;animation:celebBounce .4s cubic-bezier(0.34,1.56,0.64,1)}
@keyframes celebBounce{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
.es-celeb-check{width:56px;height:56px;border-radius:50%;background:rgba(90,154,60,0.06);border:2px solid rgba(90,154,60,0.12);color:#5a9a3c;font-size:24px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px}
.es-celeb-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:var(--ink-900);margin-bottom:4px}
.es-celeb-sub{font-size:14px;color:var(--ink-400)}
      `}</style>

      <div className="es-page"><div className="es-wrap">
        <div className="es-block">

          {/* Celebration overlay */}
          {showCelebration && (
            <div className="es-celebration">
              <div className="es-celeb-inner">
                <div className="es-celeb-check">✓</div>
                <div className="es-celeb-title">Signed.</div>
                <div className="es-celeb-sub">The project is official. Let's build something great.</div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="es-header">
            <div className="es-header-row">
              <div className="es-header-icon">✍</div>
              <div className="es-header-title">E-Signatures</div>
            </div>
            <div className="es-header-sub">Both parties must sign to execute this agreement</div>
          </div>

          {/* Agreement summary */}
          <div className="es-agreement">
            <div className="es-agreement-text">
              By signing below, you agree to the terms outlined in this <strong>Brand Identity Proposal</strong> between <strong>Alex Mercer Design</strong> and <strong>Meridian Studio</strong>, including the scope of work, payment schedule of <strong>$4,800</strong> (50% deposit, 25% milestone, 25% on delivery), and timeline of <strong>6 weeks</strong>.
            </div>
          </div>

          {/* Parties */}
          <div className="es-parties">
            <div className="es-parties-label">Signatories</div>

            {/* Freelancer - already signed */}
            <SignedParty
              party={{ name: "Alex Mercer", role: "Freelancer · Alex Mercer Design" }}
              status="signed"
              sigData="Alex Mercer"
              timestamp="March 29, 2026 at 2:14 PM"
              ip="73.162.xxx.xxx"
            />

            {/* Client */}
            <SignedParty
              party={{ name: "Sarah Chen", role: "Client · Meridian Studio" }}
              status={clientSigned ? "signed" : "viewing"}
              sigData={clientSigned ? clientSigData : null}
              timestamp={clientSigned ? timestamp : null}
              ip={clientSigned ? "98.45.xxx.xxx" : null}
            />
          </div>

          {/* Signing area (only if client hasn't signed) */}
          {!clientSigned && (
            <div className="es-signing">
              <div className="es-signing-label">Sign as Sarah Chen</div>

              {/* Mode tabs */}
              <div className="es-modes">
                <button className={`es-mode${mode === "draw" ? " on" : ""}`} onClick={() => setMode("draw")}>Draw</button>
                <button className={`es-mode${mode === "type" ? " on" : ""}`} onClick={() => setMode("type")}>Type</button>
              </div>

              {mode === "draw" && <SignCanvas onSign={handleSign} />}
              {mode === "type" && <SignType name="Sarah Chen" onSign={handleSign} />}
            </div>
          )}

          {/* Legal footer */}
          <div className="es-legal">
            <span className="es-legal-icon">◎</span>
            <span className="es-legal-text">
              Legally binding digital signatures · Timestamped and IP-logged · Compliant with ESIGN Act and UETA · Document hash: <span style={{ fontWeight: 500 }}>sha256:7f3a...c8d2</span>
            </span>
          </div>
        </div>
      </div></div>
    </>
  );
}
