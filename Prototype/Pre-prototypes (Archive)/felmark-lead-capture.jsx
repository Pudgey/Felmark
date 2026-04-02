import { useState, useRef } from "react";

function MinimalCapture() {
  const [phase, setPhase] = useState("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const expand = () => { setPhase("expanded"); setTimeout(() => inputRef.current?.focus(), 100); };
  const submit = () => { if (!email.includes("@")) return; setPhase("submitting"); setTimeout(() => setPhase("done"), 1500); };

  if (phase === "done") {
    return (
      <div className="mc-done">
        <div className="mc-done-check">✓</div>
        <div className="mc-done-title">Thank you, {name || "friend"}.</div>
        <div className="mc-done-sub">I'll be in touch within 24 hours.</div>
      </div>
    );
  }

  return (
    <div className={`mc${phase === "expanded" ? " expanded" : ""}`}>
      {phase === "idle" ? (
        <div className="mc-idle" onClick={expand}>
          <span className="mc-idle-label">Have a project in mind?</span>
          <span className="mc-idle-cta">Let's talk →</span>
        </div>
      ) : (
        <div className="mc-form">
          <div className="mc-form-title">Tell me about your project</div>
          <div className="mc-form-sub">Fill in a few details and I'll get back to you with a plan.</div>
          <div className="mc-form-fields">
            <div className="mc-field">
              <label className="lc-label">Name</label>
              <input ref={inputRef} className="lc-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="mc-field">
              <label className="lc-label">Email</label>
              <input className="lc-input" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="mc-field full">
              <label className="lc-label">What do you need?</label>
              <textarea className="lc-textarea" placeholder="A brief description of your project, goals, and any constraints..." rows={4} value={message} onChange={e => setMessage(e.target.value)} />
            </div>
          </div>
          <div className="mc-form-actions">
            <button className="lc-btn-primary" onClick={submit} disabled={phase === "submitting"}>
              {phase === "submitting" ? <span className="lc-spinner" /> : null}
              {phase === "submitting" ? "Sending..." : "Send Inquiry"}
            </button>
            <button className="lc-btn-ghost" onClick={() => setPhase("idle")}>Cancel</button>
          </div>
          <div className="lc-trust-line">Typically responds within 24 hours · No commitment required</div>
        </div>
      )}
    </div>
  );
}

function FullIntake() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: "", email: "", company: "", service: null, budget: null, timeline: null, description: "", referral: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const update = (k, v) => setData(prev => ({ ...prev, [k]: v }));

  const services = [
    { id: "brand", label: "Brand Identity", icon: "◆", desc: "Logo, colors, typography, guidelines document", price: "from $2,400" },
    { id: "web", label: "Website Design", icon: "◇", desc: "Custom responsive design with developer handoff", price: "from $1,800" },
    { id: "copy", label: "Content & Copy", icon: "✎", desc: "Web copy, email sequences, blog content", price: "from $350/page" },
    { id: "strategy", label: "Strategy Session", icon: "◎", desc: "Brand, marketing, or product strategy deep-dive", price: "from $500" },
    { id: "other", label: "Something Else", icon: "→", desc: "Custom project, retainer, or ongoing support", price: "Let's discuss" },
  ];
  const budgets = [
    { id: "2k", label: "Under $2,000", sub: "Small project" },
    { id: "5k", label: "$2,000 – $5,000", sub: "Standard project" },
    { id: "10k", label: "$5,000 – $10,000", sub: "Large project" },
    { id: "10k+", label: "$10,000+", sub: "Enterprise or retainer" },
    { id: "unsure", label: "Not sure yet", sub: "Need guidance on scoping" },
  ];
  const timelines = [
    { id: "rush", label: "ASAP", sub: "Within 2 weeks", icon: "!" },
    { id: "soon", label: "This month", sub: "2–4 weeks", icon: "→" },
    { id: "normal", label: "Next month", sub: "4–8 weeks", icon: "◎" },
    { id: "flexible", label: "Flexible", sub: "No rush", icon: "◇" },
  ];

  const canNext = () => {
    if (step === 1) return data.name && data.email?.includes("@");
    if (step === 2) return data.service;
    if (step === 3) return data.budget && data.timeline;
    return true;
  };

  const handleSubmit = () => { setSubmitting(true); setTimeout(() => { setSubmitting(false); setDone(true); }, 2000); };
  const stepLabels = ["About You", "Service", "Budget & Timeline", "Details"];

  if (done) {
    return (
      <div className="fi-done">
        <div className="fi-done-icon">◆</div>
        <div className="fi-done-title">You're on my radar.</div>
        <div className="fi-done-sub">I'll review your inquiry and respond within 24 hours with a tailored plan.</div>
        <div className="fi-done-summary">
          <div className="fi-done-summary-label">What I received</div>
          <div className="fi-done-row"><span>Service</span><span>{services.find(s => s.id === data.service)?.label}</span></div>
          <div className="fi-done-row"><span>Budget</span><span>{budgets.find(b => b.id === data.budget)?.label}</span></div>
          <div className="fi-done-row"><span>Timeline</span><span>{timelines.find(t => t.id === data.timeline)?.label}</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fi">
      {/* Progress */}
      <div className="fi-progress">
        <div className="fi-progress-steps">
          {stepLabels.map((label, i) => {
            const s = i + 1;
            const isPast = step > s;
            const isCurrent = step === s;
            return (
              <div key={s} className={`fi-prog-item${isPast ? " past" : ""}${isCurrent ? " current" : ""}`}>
                <div className="fi-prog-dot">{isPast ? "✓" : s}</div>
                <span className="fi-prog-label">{label}</span>
              </div>
            );
          })}
        </div>
        <div className="fi-prog-track"><div className="fi-prog-fill" style={{ width: `${((step - 1) / 3) * 100}%` }} /></div>
      </div>

      {/* Step content */}
      <div className="fi-body">
        {step === 1 && (
          <div className="fi-step" key="s1">
            <div className="fi-step-header">
              <div className="fi-step-title">Let's start with you</div>
              <div className="fi-step-sub">Who am I building for?</div>
            </div>
            <div className="fi-fields-grid">
              <div className="fi-field">
                <label className="lc-label">Your name <span className="lc-req">*</span></label>
                <input className="lc-input" placeholder="Jane Smith" value={data.name} onChange={e => update("name", e.target.value)} autoFocus />
              </div>
              <div className="fi-field">
                <label className="lc-label">Email <span className="lc-req">*</span></label>
                <input className="lc-input" type="email" placeholder="jane@company.com" value={data.email} onChange={e => update("email", e.target.value)} />
              </div>
              <div className="fi-field span-2">
                <label className="lc-label">Company <span className="lc-opt">(optional)</span></label>
                <input className="lc-input" placeholder="Company or brand name" value={data.company} onChange={e => update("company", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fi-step" key="s2">
            <div className="fi-step-header">
              <div className="fi-step-title">What do you need?</div>
              <div className="fi-step-sub">Pick the service that best fits your project</div>
            </div>
            <div className="fi-services">
              {services.map(s => (
                <div key={s.id} className={`fi-svc${data.service === s.id ? " on" : ""}`} onClick={() => update("service", s.id)}>
                  <div className="fi-svc-icon">{s.icon}</div>
                  <div className="fi-svc-info">
                    <div className="fi-svc-name">{s.label}</div>
                    <div className="fi-svc-desc">{s.desc}</div>
                  </div>
                  <div className="fi-svc-price">{s.price}</div>
                  <div className={`fi-svc-radio${data.service === s.id ? " on" : ""}`}>{data.service === s.id ? "✓" : ""}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fi-step" key="s3">
            <div className="fi-step-header">
              <div className="fi-step-title">Budget & timeline</div>
              <div className="fi-step-sub">No commitment — just helps me prepare a relevant proposal</div>
            </div>

            <label className="lc-label" style={{ marginBottom: 10 }}>What's your budget range?</label>
            <div className="fi-budget-grid">
              {budgets.map(b => (
                <div key={b.id} className={`fi-budget${data.budget === b.id ? " on" : ""}`} onClick={() => update("budget", b.id)}>
                  <div className="fi-budget-label">{b.label}</div>
                  <div className="fi-budget-sub">{b.sub}</div>
                </div>
              ))}
            </div>

            <label className="lc-label" style={{ marginTop: 24, marginBottom: 10 }}>When do you need this?</label>
            <div className="fi-timeline-grid">
              {timelines.map(t => (
                <div key={t.id} className={`fi-tl${data.timeline === t.id ? " on" : ""}`} onClick={() => update("timeline", t.id)}>
                  <span className="fi-tl-icon">{t.icon}</span>
                  <div className="fi-tl-text">
                    <div className="fi-tl-label">{t.label}</div>
                    <div className="fi-tl-sub">{t.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="fi-step" key="s4">
            <div className="fi-step-header">
              <div className="fi-step-title">Almost there</div>
              <div className="fi-step-sub">Anything else that would help me prepare?</div>
            </div>
            <div className="fi-fields-stack">
              <div className="fi-field">
                <label className="lc-label">Project description <span className="lc-opt">(optional)</span></label>
                <textarea className="lc-textarea" placeholder="Tell me about what you're envisioning — goals, references, constraints, anything useful..." rows={5} value={data.description} onChange={e => update("description", e.target.value)} />
              </div>
              <div className="fi-field">
                <label className="lc-label">How did you find me? <span className="lc-opt">(optional)</span></label>
                <input className="lc-input" placeholder="Referral, Dribbble, Google, Twitter..." value={data.referral} onChange={e => update("referral", e.target.value)} />
              </div>
            </div>

            <div className="fi-review">
              <div className="fi-review-label">Review</div>
              <div className="fi-review-grid">
                <div className="fi-review-item"><span className="fi-review-key">Name</span><span className="fi-review-val">{data.name}</span></div>
                <div className="fi-review-item"><span className="fi-review-key">Email</span><span className="fi-review-val">{data.email}</span></div>
                {data.company && <div className="fi-review-item"><span className="fi-review-key">Company</span><span className="fi-review-val">{data.company}</span></div>}
                <div className="fi-review-item"><span className="fi-review-key">Service</span><span className="fi-review-val">{services.find(s => s.id === data.service)?.label}</span></div>
                <div className="fi-review-item"><span className="fi-review-key">Budget</span><span className="fi-review-val">{budgets.find(b => b.id === data.budget)?.label}</span></div>
                <div className="fi-review-item"><span className="fi-review-key">Timeline</span><span className="fi-review-val">{timelines.find(t => t.id === data.timeline)?.label}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="fi-footer">
        <div className="fi-footer-left">
          {step > 1 && <button className="lc-btn-ghost" onClick={() => setStep(step - 1)}>← Back</button>}
        </div>
        <div className="fi-footer-right">
          <span className="fi-footer-step">Step {step} of 4</span>
          {step < 4 ? (
            <button className="lc-btn-primary" onClick={() => setStep(step + 1)} disabled={!canNext()}>Continue →</button>
          ) : (
            <button className="lc-btn-ember" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <><span className="lc-spinner" /> Sending...</> : "Submit Inquiry"}
            </button>
          )}
        </div>
      </div>

      <div className="lc-trust-footer">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1L1.5 3v3L5 9l3.5-3V3L5 1z" stroke="currentColor" strokeWidth="0.8"/></svg>
        Your information is private · Powered by Felmark
      </div>
    </div>
  );
}

export default function LeadCapture() {
  const [active, setActive] = useState("full");

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

        .lc-page{font-family:'Outfit',sans-serif;font-size:15px;color:var(--ink-700);background:var(--warm-50);min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px}

        /* ── Page header ── */
        .lc-page-header{text-align:center;margin-bottom:32px;width:100%;max-width:720px}
        .lc-page-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--ink-900);margin-bottom:6px}
        .lc-page-sub{font-size:14px;color:var(--ink-400);margin-bottom:20px}

        .lc-toggle{display:inline-flex;gap:0;background:#fff;border:1px solid var(--warm-200);border-radius:8px;padding:3px;margin:0 auto}
        .lc-toggle-btn{padding:8px 24px;border-radius:6px;font-size:13px;border:none;cursor:pointer;font-family:inherit;color:var(--ink-400);background:none;transition:all .08s;font-weight:500}
        .lc-toggle-btn:hover{color:var(--ink-600)}
        .lc-toggle-btn.on{background:var(--ink-900);color:#fff}

        /* ═══ SHARED ELEMENTS ═══ */
        .lc-label{font-family:var(--mono);font-size:10px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.06em;display:flex;align-items:center;gap:4px;margin-bottom:5px}
        .lc-req{color:#c24b38}.lc-opt{color:var(--ink-300);text-transform:none;letter-spacing:0}
        .lc-input{width:100%;padding:12px 16px;border:1px solid var(--warm-200);border-radius:8px;font-family:inherit;font-size:15px;color:var(--ink-800);outline:none;transition:all .12s;background:#fff}
        .lc-input:focus{border-color:var(--ember);box-shadow:0 0 0 3px rgba(176,125,79,0.05)}
        .lc-input::placeholder{color:var(--warm-400)}
        .lc-textarea{width:100%;padding:12px 16px;border:1px solid var(--warm-200);border-radius:8px;font-family:inherit;font-size:15px;color:var(--ink-800);outline:none;resize:none;transition:all .12s;line-height:1.5}
        .lc-textarea:focus{border-color:var(--ember);box-shadow:0 0 0 3px rgba(176,125,79,0.05)}
        .lc-textarea::placeholder{color:var(--warm-400)}

        .lc-btn-primary{padding:12px 28px;border-radius:8px;border:none;background:var(--ink-900);color:#fff;font-size:15px;font-weight:500;font-family:inherit;cursor:pointer;transition:background .1s;display:flex;align-items:center;gap:6px}
        .lc-btn-primary:hover{background:var(--ink-800)}.lc-btn-primary:disabled{opacity:.3;cursor:not-allowed}
        .lc-btn-ember{padding:12px 28px;border-radius:8px;border:none;background:var(--ember);color:#fff;font-size:15px;font-weight:500;font-family:inherit;cursor:pointer;transition:background .1s;display:flex;align-items:center;gap:6px}
        .lc-btn-ember:hover{background:var(--ember-light)}.lc-btn-ember:disabled{opacity:.4;cursor:not-allowed}
        .lc-btn-ghost{padding:12px 20px;border-radius:8px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-500);font-size:14px;font-family:inherit;cursor:pointer;transition:all .06s}
        .lc-btn-ghost:hover{background:var(--warm-50);border-color:var(--warm-300)}
        .lc-spinner{width:14px;height:14px;border:2px solid rgba(255,255,255,0.2);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;flex-shrink:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        .lc-trust-line{font-family:var(--mono);font-size:10px;color:var(--ink-300);text-align:center;margin-top:16px}
        .lc-trust-footer{text-align:center;padding:12px;font-family:var(--mono);font-size:10px;color:var(--ink-300);display:flex;align-items:center;justify-content:center;gap:5px;border-top:1px solid var(--warm-100)}

        /* ═══ MINIMAL ═══ */
        .mc{width:100%;max-width:720px;border:1px solid var(--warm-200);border-radius:14px;overflow:hidden;background:#fff;transition:all .25s}
        .mc.expanded{box-shadow:0 8px 32px rgba(0,0,0,0.06)}
        .mc-idle{padding:24px 32px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:background .06s}
        .mc-idle:hover{background:var(--warm-50)}
        .mc-idle-label{font-size:18px;color:var(--ink-600)}
        .mc-idle-cta{font-size:15px;font-weight:500;color:var(--ember);transition:transform .1s}
        .mc-idle:hover .mc-idle-cta{transform:translateX(3px)}
        .mc-form{padding:32px}
        .mc-form-title{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:var(--ink-900);margin-bottom:4px}
        .mc-form-sub{font-size:14px;color:var(--ink-400);margin-bottom:24px}
        .mc-form-fields{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .mc-field{display:flex;flex-direction:column}.mc-field.full{grid-column:1/-1}
        .mc-form-actions{display:flex;gap:8px;margin-top:24px}
        .mc-form-actions .lc-btn-primary{flex:1}
        .mc-done{width:100%;max-width:720px;border:1px solid var(--warm-200);border-radius:14px;background:#fff;padding:48px 40px;text-align:center}
        .mc-done-check{width:52px;height:52px;border-radius:50%;background:rgba(90,154,60,0.06);color:#5a9a3c;font-size:24px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;border:1px solid rgba(90,154,60,0.1)}
        .mc-done-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--ink-900);margin-bottom:6px}
        .mc-done-sub{font-size:15px;color:var(--ink-400)}

        /* ═══ FULL INTAKE ═══ */
        .fi{width:100%;max-width:720px;border:1px solid var(--warm-200);border-radius:14px;background:#fff;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.04)}

        /* Progress */
        .fi-progress{padding:20px 32px 16px;border-bottom:1px solid var(--warm-100);position:relative}
        .fi-progress-steps{display:flex;gap:0}
        .fi-prog-item{display:flex;align-items:center;gap:8px;flex:1}
        .fi-prog-dot{width:28px;height:28px;border-radius:50%;border:2px solid var(--warm-300);background:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:11px;color:var(--ink-300);transition:all .2s;flex-shrink:0}
        .fi-prog-item.past .fi-prog-dot{border-color:#5a9a3c;color:#5a9a3c;background:rgba(90,154,60,0.04)}
        .fi-prog-item.current .fi-prog-dot{background:var(--ember);color:#fff;border-color:var(--ember);box-shadow:0 0 0 4px rgba(176,125,79,0.08)}
        .fi-prog-label{font-size:12px;color:var(--ink-300);transition:color .2s}
        .fi-prog-item.past .fi-prog-label{color:var(--ink-500)}
        .fi-prog-item.current .fi-prog-label{color:var(--ink-800);font-weight:500}
        .fi-prog-track{position:absolute;bottom:0;left:32px;right:32px;height:2px;background:var(--warm-200);border-radius:1px}
        .fi-prog-fill{height:100%;background:var(--ember);border-radius:1px;transition:width .3s ease}

        /* Body */
        .fi-body{padding:32px 36px;min-height:360px}
        .fi-step{animation:stepIn .2s ease}
        @keyframes stepIn{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
        .fi-step-header{margin-bottom:24px}
        .fi-step-title{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:var(--ink-900);margin-bottom:4px}
        .fi-step-sub{font-size:14px;color:var(--ink-400)}

        .fi-fields-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .fi-fields-stack{display:flex;flex-direction:column;gap:16px}
        .fi-field{display:flex;flex-direction:column}
        .fi-field.span-2{grid-column:1/-1}

        /* Services */
        .fi-services{display:flex;flex-direction:column;gap:8px}
        .fi-svc{display:flex;align-items:center;gap:14px;padding:16px 18px;border:1px solid var(--warm-200);border-radius:10px;cursor:pointer;transition:all .1s}
        .fi-svc:hover{border-color:var(--warm-300);background:var(--warm-50)}
        .fi-svc.on{border-color:var(--ember);background:var(--ember-bg);box-shadow:0 0 0 1px var(--ember)}
        .fi-svc-icon{width:40px;height:40px;border-radius:9px;background:var(--warm-50);border:1px solid var(--warm-200);display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--ink-500);flex-shrink:0;transition:all .1s}
        .fi-svc.on .fi-svc-icon{background:var(--ember-bg);border-color:rgba(176,125,79,0.12);color:var(--ember)}
        .fi-svc-info{flex:1}
        .fi-svc-name{font-size:15px;font-weight:500;color:var(--ink-800)}
        .fi-svc-desc{font-size:13px;color:var(--ink-400);margin-top:1px}
        .fi-svc-price{font-family:var(--mono);font-size:11px;color:var(--ink-300);flex-shrink:0}
        .fi-svc-radio{width:22px;height:22px;border-radius:50%;border:2px solid var(--warm-300);display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;flex-shrink:0;transition:all .1s}
        .fi-svc-radio.on{background:var(--ember);border-color:var(--ember)}

        /* Budget */
        .fi-budget-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .fi-budget{padding:14px 18px;border:1px solid var(--warm-200);border-radius:8px;cursor:pointer;transition:all .08s}
        .fi-budget:hover{border-color:var(--warm-300);background:var(--warm-50)}
        .fi-budget.on{border-color:var(--ember);background:var(--ember-bg);box-shadow:0 0 0 1px var(--ember)}
        .fi-budget-label{font-size:15px;font-weight:500;color:var(--ink-700)}
        .fi-budget.on .fi-budget-label{color:var(--ember)}
        .fi-budget-sub{font-size:12px;color:var(--ink-300);margin-top:2px}

        /* Timeline */
        .fi-timeline-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
        .fi-tl{display:flex;align-items:center;gap:8px;padding:14px 12px;border:1px solid var(--warm-200);border-radius:8px;cursor:pointer;transition:all .08s}
        .fi-tl:hover{border-color:var(--warm-300);background:var(--warm-50)}
        .fi-tl.on{border-color:var(--ember);background:var(--ember-bg);box-shadow:0 0 0 1px var(--ember)}
        .fi-tl-icon{font-size:14px;color:var(--ink-400);flex-shrink:0}
        .fi-tl.on .fi-tl-icon{color:var(--ember)}
        .fi-tl-label{font-size:13px;font-weight:500;color:var(--ink-700)}
        .fi-tl-sub{font-size:10px;color:var(--ink-300);margin-top:1px}

        /* Review */
        .fi-review{margin-top:24px;padding:18px 20px;background:var(--warm-50);border:1px solid var(--warm-100);border-radius:10px}
        .fi-review-label{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px}
        .fi-review-grid{display:grid;grid-template-columns:1fr 1fr;gap:0}
        .fi-review-item{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--warm-200);font-size:13px}
        .fi-review-item:nth-last-child(-n+2){border-bottom:none}
        .fi-review-key{color:var(--ink-400)}
        .fi-review-val{font-weight:500;color:var(--ink-700);text-align:right}
        .fi-review-item:nth-child(odd){padding-right:12px;border-right:1px solid var(--warm-200)}
        .fi-review-item:nth-child(even){padding-left:12px}

        /* Footer */
        .fi-footer{display:flex;align-items:center;justify-content:space-between;padding:16px 32px;border-top:1px solid var(--warm-100)}
        .fi-footer-left{display:flex;align-items:center;gap:8px}
        .fi-footer-right{display:flex;align-items:center;gap:12px}
        .fi-footer-step{font-family:var(--mono);font-size:10px;color:var(--ink-300)}

        /* Done */
        .fi-done{width:100%;max-width:720px;border:1px solid var(--warm-200);border-radius:14px;background:#fff;padding:56px 48px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.04)}
        .fi-done-icon{width:60px;height:60px;border-radius:14px;background:var(--ember-bg);border:1px solid rgba(176,125,79,0.08);color:var(--ember);font-size:26px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}
        .fi-done-title{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:var(--ink-900);margin-bottom:8px}
        .fi-done-sub{font-size:16px;color:var(--ink-400);margin-bottom:24px;line-height:1.5;max-width:400px;margin-left:auto;margin-right:auto}
        .fi-done-summary{text-align:left;padding:18px 20px;background:var(--warm-50);border:1px solid var(--warm-100);border-radius:10px;max-width:360px;margin:0 auto}
        .fi-done-summary-label{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}
        .fi-done-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;border-bottom:1px solid var(--warm-100)}
        .fi-done-row:last-child{border-bottom:none}
        .fi-done-row span:first-child{color:var(--ink-400)}
        .fi-done-row span:last-child{font-weight:500;color:var(--ink-700)}
      `}</style>

      <div className="lc-page">
        <div className="lc-page-header">
          <div className="lc-page-title">Lead Capture</div>
          <div className="lc-page-sub">Beautiful intake forms your clients fill out on your website. Leads flow directly into your Felmark pipeline.</div>
          <div className="lc-toggle">
            <button className={`lc-toggle-btn${active === "minimal" ? " on" : ""}`} onClick={() => setActive("minimal")}>Minimal</button>
            <button className={`lc-toggle-btn${active === "full" ? " on" : ""}`} onClick={() => setActive("full")}>Full Intake</button>
          </div>
        </div>

        {active === "minimal" && <MinimalCapture />}
        {active === "full" && <FullIntake />}
      </div>
    </>
  );
}
