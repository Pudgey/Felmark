import { useState } from "react";

export default function ClientPortal() {
  const [activeView, setActiveView] = useState("proposal");
  const [accepted, setAccepted] = useState(false);
  const [paid, setPaid] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id: 1, user: "Sarah Chen", avatar: "S", color: "#8a7e63", text: "This looks great! Can we add a section about logo animation?", time: "2h ago", isClient: true },
    { id: 2, user: "Alex Mercer", avatar: "A", color: "#b07d4f", text: "Absolutely — I'll add a motion guidelines section in the next revision.", time: "1h ago", isClient: false },
  ]);

  const addComment = () => {
    if (!comment.trim()) return;
    setComments(prev => [...prev, { id: Date.now(), user: "Sarah Chen", avatar: "S", color: "#8a7e63", text: comment, time: "Just now", isClient: true }]);
    setComment("");
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
        .cp{font-family:'Outfit',sans-serif;font-size:15px;color:var(--ink-700);background:var(--warm-50);min-height:100vh}

        /* Nav */
        .cp-nav{padding:14px 40px;background:var(--parchment);border-bottom:1px solid var(--warm-200);display:flex;align-items:center;justify-content:space-between}
        .cp-nav-left{display:flex;align-items:center;gap:10px}
        .cp-nav-logo{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--ink-900);display:flex;align-items:center;gap:6px}
        .cp-nav-from{font-family:var(--mono);font-size:11px;color:var(--ink-400)}
        .cp-nav-right{display:flex;align-items:center;gap:4px}
        .cp-nav-toggle{display:flex;background:#fff;border:1px solid var(--warm-200);border-radius:6px;padding:2px;gap:0}
        .cp-nav-t{padding:6px 16px;border-radius:4px;font-size:12px;border:none;cursor:pointer;font-family:inherit;color:var(--ink-400);background:none;transition:all .06s}
        .cp-nav-t:hover{color:var(--ink-600)}
        .cp-nav-t.on{background:var(--ink-900);color:#fff}

        .cp-body{max-width:720px;margin:0 auto;padding:40px 24px 80px}

        /* ── Proposal view ── */
        .cp-card{background:#fff;border:1px solid var(--warm-200);border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.03)}
        .cp-card-head{padding:32px 36px 24px;border-bottom:1px solid var(--warm-100)}
        .cp-card-badge{font-family:var(--mono);font-size:9px;color:var(--ember);background:var(--ember-bg);padding:3px 10px;border-radius:4px;border:1px solid rgba(176,125,79,0.08);display:inline-block;margin-bottom:12px;letter-spacing:.04em}
        .cp-card-title{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:var(--ink-900);line-height:1.15;margin-bottom:8px}
        .cp-card-meta{display:flex;gap:16px;font-family:var(--mono);font-size:11px;color:var(--ink-400);flex-wrap:wrap}
        .cp-card-meta-item{display:flex;align-items:center;gap:4px}

        .cp-card-body{padding:28px 36px}

        .cp-section-label{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.1em;margin:20px 0 10px;display:flex;align-items:center;gap:8px}
        .cp-section-label:first-child{margin-top:0}
        .cp-section-label::after{content:'';flex:1;height:1px;background:var(--warm-200)}
        .cp-text{font-size:15px;color:var(--ink-600);line-height:1.75;margin-bottom:12px}

        /* Scope items */
        .cp-scope{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
        .cp-scope-item{display:flex;align-items:flex-start;gap:10px;padding:10px 14px;border:1px solid var(--warm-200);border-radius:7px}
        .cp-scope-num{font-family:var(--mono);font-size:10px;color:var(--ink-300);width:18px;flex-shrink:0;padding-top:2px}
        .cp-scope-info{flex:1}
        .cp-scope-name{font-size:14px;font-weight:500;color:var(--ink-700)}
        .cp-scope-desc{font-size:12.5px;color:var(--ink-400);margin-top:2px}

        /* Pricing */
        .cp-pricing{border:1px solid var(--warm-200);border-radius:8px;overflow:hidden;margin:12px 0}
        .cp-pricing-row{display:flex;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--warm-100);font-size:14px}
        .cp-pricing-row:last-child{border-bottom:none}
        .cp-pricing-row.total{background:var(--ink-900);color:#fff;padding:14px 16px}
        .cp-pricing-label{color:var(--ink-500)}
        .cp-pricing-row.total .cp-pricing-label{color:rgba(255,255,255,0.6)}
        .cp-pricing-val{font-family:var(--mono);font-weight:500;color:var(--ink-800)}
        .cp-pricing-row.total .cp-pricing-val{color:#fff;font-size:18px}

        /* Timeline */
        .cp-timeline{display:flex;gap:0;margin:12px 0}
        .cp-timeline-item{flex:1;text-align:center;padding:10px 8px;position:relative}
        .cp-timeline-item::after{content:'';position:absolute;top:22px;left:50%;right:-50%;height:1px;background:var(--warm-200);z-index:0}
        .cp-timeline-item:last-child::after{display:none}
        .cp-timeline-dot{width:12px;height:12px;border-radius:50%;border:2px solid var(--warm-300);background:#fff;margin:0 auto 6px;position:relative;z-index:1}
        .cp-timeline-item.done .cp-timeline-dot{background:#5a9a3c;border-color:#5a9a3c}
        .cp-timeline-item.current .cp-timeline-dot{border-color:var(--ember);background:var(--ember);box-shadow:0 0 0 3px rgba(176,125,79,0.1)}
        .cp-timeline-name{font-size:12px;font-weight:500;color:var(--ink-600)}
        .cp-timeline-date{font-family:var(--mono);font-size:10px;color:var(--ink-300)}

        /* Accept area */
        .cp-accept{padding:24px 36px;border-top:1px solid var(--warm-100);background:var(--warm-50)}
        .cp-accept-row{display:flex;align-items:center;gap:12px}
        .cp-accept-btn{flex:1;padding:14px;border-radius:8px;border:none;font-size:16px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .1s;display:flex;align-items:center;justify-content:center;gap:6px}
        .cp-accept-primary{background:var(--ink-900);color:#fff}
        .cp-accept-primary:hover{background:var(--ink-800)}
        .cp-accept-ghost{background:none;border:1px solid var(--warm-200);color:var(--ink-500)}
        .cp-accept-ghost:hover{background:#fff}
        .cp-accept-note{font-family:var(--mono);font-size:10px;color:var(--ink-300);text-align:center;margin-top:10px}

        .cp-accepted{text-align:center;padding:24px 36px;border-top:1px solid var(--warm-100);background:rgba(90,154,60,0.02)}
        .cp-accepted-icon{width:48px;height:48px;border-radius:50%;background:rgba(90,154,60,0.06);color:#5a9a3c;font-size:22px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;border:1px solid rgba(90,154,60,0.1)}
        .cp-accepted-title{font-size:16px;font-weight:500;color:#5a9a3c;margin-bottom:4px}
        .cp-accepted-sub{font-size:13px;color:var(--ink-400)}

        /* ── Comments ── */
        .cp-comments{margin-top:24px}
        .cp-comment{display:flex;align-items:flex-start;gap:10px;padding:12px 0;border-bottom:1px solid var(--warm-100)}
        .cp-comment:last-child{border-bottom:none}
        .cp-comment-av{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#fff;flex-shrink:0}
        .cp-comment-body{flex:1}
        .cp-comment-head{display:flex;align-items:center;gap:6px;margin-bottom:2px}
        .cp-comment-name{font-size:13px;font-weight:500;color:var(--ink-700)}
        .cp-comment-badge{font-family:var(--mono);font-size:8px;padding:1px 5px;border-radius:2px}
        .cp-comment-time{font-family:var(--mono);font-size:10px;color:var(--ink-300);margin-left:auto}
        .cp-comment-text{font-size:14px;color:var(--ink-600);line-height:1.55}

        .cp-comment-input{display:flex;gap:10px;margin-top:12px;padding-top:12px;border-top:1px solid var(--warm-100)}
        .cp-comment-input-av{width:30px;height:30px;border-radius:7px;background:#8a7e63;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#fff;flex-shrink:0}
        .cp-comment-input-wrap{flex:1;display:flex;gap:6px}
        .cp-comment-textarea{flex:1;padding:9px 14px;border:1px solid var(--warm-200);border-radius:7px;font-family:inherit;font-size:14px;color:var(--ink-700);outline:none;resize:none}
        .cp-comment-textarea:focus{border-color:var(--ember)}
        .cp-comment-textarea::placeholder{color:var(--warm-400)}
        .cp-comment-send{padding:9px 16px;border-radius:7px;border:none;background:var(--ember);color:#fff;font-size:13px;font-family:inherit;cursor:pointer;flex-shrink:0}
        .cp-comment-send:hover{background:var(--ember-light)}

        /* ── Invoice view ── */
        .cp-inv-amount{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:700;color:var(--ink-900);line-height:1;margin-bottom:4px}
        .cp-inv-status{font-family:var(--mono);font-size:10px;font-weight:500;padding:3px 10px;border-radius:4px;display:inline-block;margin-bottom:12px}

        .cp-pay-btn{width:100%;padding:16px;border-radius:8px;border:none;background:var(--ink-900);color:#fff;font-size:16px;font-weight:500;font-family:inherit;cursor:pointer;transition:background .1s;display:flex;align-items:center;justify-content:center;gap:8px}
        .cp-pay-btn:hover{background:var(--ink-800)}
        .cp-pay-note{font-family:var(--mono);font-size:10px;color:var(--ink-300);text-align:center;margin-top:8px;display:flex;align-items:center;justify-content:center;gap:4px}

        .cp-paid{text-align:center;padding:20px}
        .cp-paid-icon{width:48px;height:48px;border-radius:50%;background:rgba(90,154,60,0.06);color:#5a9a3c;font-size:22px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;border:1px solid rgba(90,154,60,0.1)}
        .cp-paid-title{font-size:16px;font-weight:500;color:#5a9a3c}
        .cp-paid-sub{font-size:13px;color:var(--ink-400);margin-top:2px}

        .cp-footer{text-align:center;padding:24px;font-family:var(--mono);font-size:10px;color:var(--ink-300);display:flex;align-items:center;justify-content:center;gap:5px}
      `}</style>

      <div className="cp">
        {/* Nav */}
        <div className="cp-nav">
          <div className="cp-nav-left">
            <div className="cp-nav-logo">
              <svg width="18" height="18" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="#b07d4f" strokeWidth="1.5"/></svg>
              Alex Mercer
            </div>
            <span className="cp-nav-from">via Felmark</span>
          </div>
          <div className="cp-nav-right">
            <div className="cp-nav-toggle">
              <button className={`cp-nav-t${activeView === "proposal" ? " on" : ""}`} onClick={() => setActiveView("proposal")}>Proposal</button>
              <button className={`cp-nav-t${activeView === "invoice" ? " on" : ""}`} onClick={() => setActiveView("invoice")}>Invoice</button>
            </div>
          </div>
        </div>

        <div className="cp-body">
          {activeView === "proposal" && (
            <div className="cp-card">
              <div className="cp-card-head">
                <span className="cp-card-badge">PROPOSAL</span>
                <h1 className="cp-card-title">Brand Guidelines v2</h1>
                <div className="cp-card-meta">
                  <span className="cp-card-meta-item">◆ Prepared for Meridian Studio</span>
                  <span className="cp-card-meta-item">◇ March 29, 2026</span>
                  <span className="cp-card-meta-item">$ $4,800</span>
                </div>
              </div>

              <div className="cp-card-body">
                <div className="cp-section-label">overview</div>
                <p className="cp-text">A comprehensive brand identity system for Meridian Studio, covering logo usage, color palette, typography, imagery direction, and social media templates. This ensures brand consistency across every touchpoint.</p>

                <div className="cp-section-label">deliverables</div>
                <div className="cp-scope">
                  {[
                    { name: "Primary & secondary logo usage rules", desc: "Clear rules for placement, sizing, clear space, and color variants" },
                    { name: "Color palette with hex/RGB/CMYK values", desc: "Complete color system with accessibility notes" },
                    { name: "Typography scale & font pairings", desc: "Modular type scale with web and print variants" },
                    { name: "Imagery & photography direction", desc: "Mood board and guidelines for photography style" },
                    { name: "Social media templates (IG, LinkedIn)", desc: "Template kit with Canva + Figma source files" },
                  ].map((item, i) => (
                    <div key={i} className="cp-scope-item">
                      <span className="cp-scope-num">{String(i + 1).padStart(2, "0")}</span>
                      <div className="cp-scope-info">
                        <div className="cp-scope-name">{item.name}</div>
                        <div className="cp-scope-desc">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cp-section-label">timeline</div>
                <div className="cp-timeline">
                  {[
                    { name: "Kickoff", date: "Apr 1", status: "done" },
                    { name: "Deliverables 1–3", date: "Apr 10", status: "current" },
                    { name: "Client review", date: "Apr 15", status: "" },
                    { name: "Final delivery", date: "Apr 22", status: "" },
                  ].map((t, i) => (
                    <div key={i} className={`cp-timeline-item ${t.status}`}>
                      <div className="cp-timeline-dot" />
                      <div className="cp-timeline-name">{t.name}</div>
                      <div className="cp-timeline-date">{t.date}</div>
                    </div>
                  ))}
                </div>

                <div className="cp-section-label">investment</div>
                <div className="cp-pricing">
                  <div className="cp-pricing-row"><span className="cp-pricing-label">Brand Identity — Complete Package</span><span className="cp-pricing-val">$4,800</span></div>
                  <div className="cp-pricing-row"><span className="cp-pricing-label">50% deposit (due on signing)</span><span className="cp-pricing-val">$2,400</span></div>
                  <div className="cp-pricing-row"><span className="cp-pricing-label">25% on milestone (deliverables 1–3)</span><span className="cp-pricing-val">$1,200</span></div>
                  <div className="cp-pricing-row"><span className="cp-pricing-label">25% on final delivery</span><span className="cp-pricing-val">$1,200</span></div>
                  <div className="cp-pricing-row total"><span className="cp-pricing-label">Total</span><span className="cp-pricing-val">$4,800</span></div>
                </div>

                {/* Comments */}
                <div className="cp-comments">
                  <div className="cp-section-label">discussion</div>
                  {comments.map(c => (
                    <div key={c.id} className="cp-comment">
                      <div className="cp-comment-av" style={{ background: c.color }}>{c.avatar}</div>
                      <div className="cp-comment-body">
                        <div className="cp-comment-head">
                          <span className="cp-comment-name">{c.user}</span>
                          <span className="cp-comment-badge" style={c.isClient ? { color: "#8a7e63", background: "rgba(138,126,99,0.06)" } : { color: "var(--ember)", background: "var(--ember-bg)" }}>{c.isClient ? "Client" : "Freelancer"}</span>
                          <span className="cp-comment-time">{c.time}</span>
                        </div>
                        <div className="cp-comment-text">{c.text}</div>
                      </div>
                    </div>
                  ))}
                  <div className="cp-comment-input">
                    <div className="cp-comment-input-av">S</div>
                    <div className="cp-comment-input-wrap">
                      <textarea className="cp-comment-textarea" placeholder="Leave a comment..." rows={1} value={comment} onChange={e => setComment(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addComment(); }}} />
                      <button className="cp-comment-send" onClick={addComment}>Send</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accept / Accepted */}
              {!accepted ? (
                <div className="cp-accept">
                  <div className="cp-accept-row">
                    <button className="cp-accept-btn cp-accept-primary" onClick={() => setAccepted(true)}>Accept Proposal</button>
                    <button className="cp-accept-btn cp-accept-ghost">Request Changes</button>
                  </div>
                  <div className="cp-accept-note">By accepting, you agree to the scope, timeline, and terms above. A deposit invoice will be sent immediately.</div>
                </div>
              ) : (
                <div className="cp-accepted">
                  <div className="cp-accepted-icon">✓</div>
                  <div className="cp-accepted-title">Proposal accepted</div>
                  <div className="cp-accepted-sub">A deposit invoice for $2,400 has been sent to your email</div>
                </div>
              )}
            </div>
          )}

          {activeView === "invoice" && (
            <div className="cp-card">
              <div className="cp-card-head">
                <span className="cp-card-badge">INVOICE #047</span>
                <div className="cp-inv-amount">$2,400</div>
                <span className="cp-inv-status" style={{ color: paid ? "#5a9a3c" : "var(--ember)", background: paid ? "rgba(90,154,60,0.06)" : "var(--ember-bg)", border: `1px solid ${paid ? "rgba(90,154,60,0.1)" : "rgba(176,125,79,0.08)"}` }}>
                  {paid ? "✓ PAID" : "AWAITING PAYMENT"}
                </span>
                <div className="cp-card-meta" style={{ marginTop: 12 }}>
                  <span className="cp-card-meta-item">From: Alex Mercer</span>
                  <span className="cp-card-meta-item">Date: March 29, 2026</span>
                  <span className="cp-card-meta-item">Due: April 13, 2026</span>
                </div>
              </div>

              <div className="cp-card-body">
                <div className="cp-section-label">line items</div>
                <div className="cp-pricing">
                  <div className="cp-pricing-row"><span className="cp-pricing-label">Brand Guidelines v2 — 50% Deposit</span><span className="cp-pricing-val">$2,400</span></div>
                  <div className="cp-pricing-row total"><span className="cp-pricing-label">Amount due</span><span className="cp-pricing-val">$2,400</span></div>
                </div>

                <div style={{ marginTop: 20 }}>
                  {!paid ? (
                    <>
                      <button className="cp-pay-btn" onClick={() => setPaid(true)}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="4" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 7h13" stroke="currentColor" strokeWidth="1.2"/></svg>
                        Pay $2,400
                      </button>
                      <div className="cp-pay-note">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="1" y="1" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="0.8"/></svg>
                        Secured by Stripe · 256-bit encryption
                      </div>
                    </>
                  ) : (
                    <div className="cp-paid">
                      <div className="cp-paid-icon">✓</div>
                      <div className="cp-paid-title">Payment successful</div>
                      <div className="cp-paid-sub">A receipt has been sent to sarah@meridianstudio.co</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="cp-footer">
            <svg width="12" height="12" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="1.5"/></svg>
            Powered by Felmark · tryfelmark.com
          </div>
        </div>
      </div>
    </>
  );
}
