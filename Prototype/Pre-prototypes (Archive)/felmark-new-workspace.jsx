import { useState, useEffect, useRef } from "react";

const COLORS = [
  { id: "slate", value: "#7c8594", light: "rgba(124,133,148,0.1)" },
  { id: "clay", value: "#a08472", light: "rgba(160,132,114,0.1)" },
  { id: "olive", value: "#7a7e53", light: "rgba(122,126,83,0.1)" },
  { id: "moss", value: "#5a6e50", light: "rgba(90,110,80,0.1)" },
  { id: "storm", value: "#5c6878", light: "rgba(92,104,120,0.1)" },
  { id: "rust", value: "#8b5c3a", light: "rgba(139,92,58,0.1)" },
  { id: "forest", value: "#3d6b52", light: "rgba(61,107,82,0.1)" },
  { id: "violet", value: "#7c6b9e", light: "rgba(124,107,158,0.1)" },
  { id: "rose", value: "#9e5a6b", light: "rgba(158,90,107,0.1)" },
  { id: "ember", value: "#b07d4f", light: "rgba(176,125,79,0.1)" },
];

const TEMPLATES = [
  { id: "blank", icon: "◇", label: "Blank project", desc: "Start from scratch", sections: ["Notes"], color: "var(--ink-400)" },
  { id: "proposal", icon: "◆", label: "Proposal", desc: "Scope, timeline, pricing, terms", sections: ["Intro", "Scope", "Timeline", "Pricing", "Terms", "Signature"], color: "var(--ember)" },
  { id: "meeting", icon: "○", label: "Meeting notes", desc: "Agenda, notes, action items", sections: ["Agenda", "Notes", "Action Items", "Follow-ups"], color: "#5a9a3c" },
  { id: "brief", icon: "□", label: "Project brief", desc: "Goals, audience, deliverables", sections: ["Overview", "Objectives", "Audience", "Deliverables", "Timeline"], color: "#5b7fa4" },
  { id: "retainer", icon: "↻", label: "Retainer", desc: "Monthly scope, hours, billing", sections: ["Scope", "Hours", "Deliverables", "Billing"], color: "#7c6b9e" },
  { id: "invoice", icon: "$", label: "Invoice only", desc: "Quick invoice, no project docs", sections: ["Line Items", "Terms"], color: "#8b5c3a" },
];

const RECENT_CLIENTS = [
  { name: "Meridian Studio", color: "#7c8594", contact: "sarah@meridian.co" },
  { name: "Nora Kim", color: "#a08472", contact: "nora@coachkim.com" },
  { name: "Bolt Fitness", color: "#8a7e63", contact: "team@boltfit.co" },
];

const INDUSTRIES = [
  "Design", "Marketing", "Development", "Consulting", "Photography",
  "Writing", "Strategy", "Branding", "Video", "Other",
];

export default function NewWorkspaceV2() {
  const [clientName, setClientName] = useState("");
  const [contact, setContact] = useState("");
  const [rate, setRate] = useState("");
  const [selectedColor, setSelectedColor] = useState("ember");
  const [selectedTemplate, setSelectedTemplate] = useState("proposal");
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [industry, setIndustry] = useState(null);
  const [budget, setBudget] = useState("");
  const [showRecent, setShowRecent] = useState(false);
  const [step, setStep] = useState(1); // 1 = details, 2 = template
  const [creating, setCreating] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => { if (nameRef.current) nameRef.current.focus(); }, []);

  const currentColor = COLORS.find(c => c.id === selectedColor) || COLORS[9];
  const initials = clientName.trim() ? clientName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";
  const activeTemplate = TEMPLATES.find(t => t.id === selectedTemplate);
  const previewTemplate = hoveredTemplate ? TEMPLATES.find(t => t.id === hoveredTemplate) : activeTemplate;

  const handleCreate = () => {
    if (!clientName.trim()) return;
    setCreating(true);
  };

  const selectRecent = (client) => {
    setClientName(client.name);
    setContact(client.contact);
    const match = COLORS.find(c => c.value === client.color);
    if (match) setSelectedColor(match.id);
    setShowRecent(false);
  };

  const canProceed = clientName.trim().length > 0;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
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

        .nw-backdrop {
          font-family: 'Outfit', sans-serif; font-size: 14px;
          color: var(--ink-700); background: rgba(44,42,37,0.4);
          height: 100vh; display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(4px);
        }

        .nw-modal {
          width: 540px; max-height: 92vh; background: var(--parchment);
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.04);
          display: flex; flex-direction: column;
          animation: modalIn 0.25s ease;
        }
        @keyframes modalIn { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

        /* ── Header ── */
        .nw-header {
          padding: 24px 28px 20px; display: flex; align-items: center; gap: 16px;
          border-bottom: 1px solid var(--warm-200);
        }

        .nw-avatar {
          width: 52px; height: 52px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; font-weight: 600; color: #fff;
          transition: background 0.3s, transform 0.2s;
          flex-shrink: 0; position: relative; overflow: hidden;
        }
        .nw-avatar::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          border-radius: 12px;
        }
        .nw-avatar:hover { transform: scale(1.05); }
        .nw-avatar.empty { background: var(--warm-200) !important; color: var(--ink-300); }

        .nw-header-info { flex: 1; }
        .nw-title {
          font-family: 'Cormorant Garamond', serif; font-size: 24px;
          font-weight: 600; color: var(--ink-900); line-height: 1.2;
        }
        .nw-subtitle { font-size: 13px; color: var(--ink-400); margin-top: 2px; }

        .nw-close {
          width: 32px; height: 32px; border-radius: 6px; border: none;
          background: none; cursor: pointer; color: var(--ink-300);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.08s; flex-shrink: 0;
        }
        .nw-close:hover { background: var(--warm-100); color: var(--ink-600); }

        /* ── Steps indicator ── */
        .nw-steps {
          display: flex; align-items: center; gap: 0; padding: 14px 28px;
          border-bottom: 1px solid var(--warm-100); flex-shrink: 0;
        }
        .nw-step {
          display: flex; align-items: center; gap: 6px; cursor: pointer;
          padding: 4px 0; transition: color 0.1s;
        }
        .nw-step-dot {
          width: 22px; height: 22px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--mono); font-size: 10px; font-weight: 600;
          transition: all 0.2s;
        }
        .nw-step.active .nw-step-dot { background: var(--ember); color: #fff; }
        .nw-step.done .nw-step-dot { background: rgba(90,154,60,0.1); color: #5a9a3c; }
        .nw-step.upcoming .nw-step-dot { background: var(--warm-200); color: var(--ink-400); }
        .nw-step-label { font-size: 12.5px; }
        .nw-step.active .nw-step-label { color: var(--ink-800); font-weight: 500; }
        .nw-step.done .nw-step-label { color: #5a9a3c; }
        .nw-step.upcoming .nw-step-label { color: var(--ink-400); }
        .nw-step-line { width: 32px; height: 1px; background: var(--warm-300); margin: 0 10px; }

        /* ── Body ── */
        .nw-body { flex: 1; overflow-y: auto; padding: 20px 28px 8px; }
        .nw-body::-webkit-scrollbar { width: 4px; }
        .nw-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 99px; }

        /* ── Fields ── */
        .nw-field { margin-bottom: 18px; }
        .nw-label {
          font-size: 13px; font-weight: 500; color: var(--ink-700);
          margin-bottom: 6px; display: flex; align-items: center; gap: 6px;
        }
        .nw-optional { font-size: 11px; font-weight: 400; color: var(--ink-300); }
        .nw-input {
          width: 100%; padding: 11px 14px; border: 1px solid var(--warm-200);
          border-radius: 8px; font-family: inherit; font-size: 15px;
          color: var(--ink-800); outline: none; background: #fff;
          transition: all 0.15s;
        }
        .nw-input:focus { border-color: var(--ember); box-shadow: 0 0 0 3px rgba(176,125,79,0.06); }
        .nw-input::placeholder { color: var(--warm-400); }
        .nw-input.large { font-size: 17px; padding: 13px 16px; font-weight: 500; }
        .nw-row { display: flex; gap: 12px; }
        .nw-row > * { flex: 1; }

        /* Recent clients */
        .nw-recent { position: relative; }
        .nw-recent-trigger {
          font-size: 11.5px; color: var(--ember); cursor: pointer;
          background: none; border: none; font-family: inherit;
          font-weight: 500; padding: 0;
        }
        .nw-recent-trigger:hover { text-decoration: underline; }
        .nw-recent-dropdown {
          position: absolute; top: calc(100% + 4px); left: 0; right: 0;
          background: #fff; border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04);
          padding: 4px; z-index: 20;
        }
        .nw-recent-item {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: 6px; cursor: pointer;
          transition: background 0.06s;
        }
        .nw-recent-item:hover { background: var(--ember-bg); }
        .nw-recent-av {
          width: 28px; height: 28px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .nw-recent-name { font-size: 13px; color: var(--ink-800); font-weight: 500; }
        .nw-recent-contact { font-size: 11px; color: var(--ink-400); }

        /* ── Color picker ── */
        .nw-colors {
          display: flex; gap: 6px; flex-wrap: wrap;
        }
        .nw-color {
          width: 30px; height: 30px; border-radius: 50%;
          cursor: pointer; border: 2px solid transparent;
          transition: all 0.15s; position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .nw-color:hover { transform: scale(1.12); }
        .nw-color.on { border-color: var(--ink-700); box-shadow: 0 0 0 2px var(--parchment), 0 0 0 4px currentColor; transform: scale(1.1); }
        .nw-color-check { color: #fff; font-size: 12px; opacity: 0; transition: opacity 0.1s; }
        .nw-color.on .nw-color-check { opacity: 1; }

        /* ── Industry tags ── */
        .nw-tags { display: flex; gap: 5px; flex-wrap: wrap; }
        .nw-tag {
          padding: 5px 12px; border-radius: 5px; font-size: 12.5px;
          border: 1px solid var(--warm-200); background: #fff;
          cursor: pointer; transition: all 0.1s; color: var(--ink-500);
        }
        .nw-tag:hover { border-color: var(--warm-300); background: var(--warm-50); }
        .nw-tag.on { border-color: var(--ember); background: var(--ember-bg); color: var(--ember); font-weight: 500; }

        /* ── Templates ── */
        .nw-templates { display: flex; flex-direction: column; gap: 6px; }
        .nw-tmpl {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px; border: 1px solid var(--warm-200);
          border-radius: 10px; cursor: pointer; transition: all 0.12s;
          position: relative; overflow: hidden;
        }
        .nw-tmpl:hover { border-color: var(--warm-300); background: var(--warm-50); }
        .nw-tmpl.on { border-color: var(--ember); background: var(--ember-bg); box-shadow: 0 0 0 1px rgba(176,125,79,0.08); }
        .nw-tmpl-icon {
          width: 38px; height: 38px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0; transition: all 0.15s;
          background: var(--warm-100); border: 1px solid var(--warm-200);
        }
        .nw-tmpl.on .nw-tmpl-icon { background: var(--ember-bg); border-color: rgba(176,125,79,0.15); }
        .nw-tmpl-info { flex: 1; }
        .nw-tmpl-name { font-size: 14px; font-weight: 500; color: var(--ink-800); }
        .nw-tmpl.on .nw-tmpl-name { color: var(--ink-900); font-weight: 600; }
        .nw-tmpl-desc { font-size: 12px; color: var(--ink-400); margin-top: 1px; }
        .nw-tmpl-sections {
          display: flex; gap: 3px; margin-top: 5px; flex-wrap: wrap;
        }
        .nw-tmpl-section {
          font-family: var(--mono); font-size: 9px; color: var(--ink-400);
          background: var(--warm-100); padding: 1px 6px; border-radius: 3px;
          border: 1px solid var(--warm-200);
        }
        .nw-tmpl.on .nw-tmpl-section { background: rgba(176,125,79,0.06); border-color: rgba(176,125,79,0.12); color: var(--ember); }
        .nw-tmpl-check {
          width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
          border: 1.5px solid var(--warm-300); display: flex; align-items: center;
          justify-content: center; transition: all 0.15s;
        }
        .nw-tmpl.on .nw-tmpl-check { background: var(--ember); border-color: var(--ember); color: #fff; }

        /* ── Template preview panel ── */
        .nw-preview {
          margin-top: 12px; padding: 14px 16px;
          background: var(--warm-50); border: 1px solid var(--warm-200);
          border-radius: 8px; transition: all 0.2s;
        }
        .nw-preview-label { font-family: var(--mono); font-size: 9px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
        .nw-preview-sections { display: flex; gap: 4px; flex-wrap: wrap; }
        .nw-preview-section {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; color: var(--ink-600);
          padding: 4px 10px; background: #fff;
          border: 1px solid var(--warm-200); border-radius: 5px;
        }
        .nw-preview-num { font-family: var(--mono); font-size: 9px; color: var(--ink-300); }

        /* ── Separator ── */
        .nw-sep {
          display: flex; align-items: center; gap: 12px;
          margin: 16px 0 12px;
        }
        .nw-sep-line { flex: 1; height: 1px; background: var(--warm-200); }
        .nw-sep-label { font-family: var(--mono); font-size: 9px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.1em; flex-shrink: 0; }

        /* ── Footer ── */
        .nw-footer {
          padding: 14px 28px; border-top: 1px solid var(--warm-200);
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }
        .nw-foot-left { display: flex; align-items: center; gap: 8px; }
        .nw-kbd { font-family: var(--mono); font-size: 9px; color: var(--ink-400); background: var(--warm-100); border: 1px solid var(--warm-200); border-radius: 3px; padding: 1px 5px; }
        .nw-skip { font-size: 12px; color: var(--ink-400); }
        .nw-foot-right { display: flex; gap: 8px; }

        .nw-back-btn {
          padding: 10px 18px; border-radius: 8px;
          border: 1px solid var(--warm-200); background: #fff;
          color: var(--ink-600); font-size: 13px; font-family: inherit;
          cursor: pointer; transition: all 0.1s;
          display: flex; align-items: center; gap: 5px;
        }
        .nw-back-btn:hover { background: var(--warm-50); border-color: var(--warm-300); }

        .nw-next-btn {
          padding: 10px 24px; border-radius: 8px; border: none;
          background: var(--warm-200); color: var(--ink-400);
          font-size: 14px; font-weight: 500; font-family: inherit;
          cursor: not-allowed; transition: all 0.2s;
          display: flex; align-items: center; gap: 6px;
        }
        .nw-next-btn.ready {
          background: var(--ember); color: #fff; cursor: pointer;
        }
        .nw-next-btn.ready:hover { background: var(--ember-light); }

        /* ── Creating state ── */
        .nw-creating {
          padding: 48px 28px; text-align: center;
          animation: fadeIn 0.3s ease;
        }
        .nw-creating-avatar {
          width: 64px; height: 64px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; font-weight: 600; color: #fff;
          margin: 0 auto 20px; position: relative;
          animation: pulse 1.5s ease infinite;
        }
        .nw-creating-avatar::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          border-radius: 14px;
        }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        .nw-creating-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: var(--ink-900); margin-bottom: 4px; }
        .nw-creating-sub { font-size: 13px; color: var(--ink-400); margin-bottom: 24px; }
        .nw-creating-steps { display: flex; flex-direction: column; gap: 6px; text-align: left; max-width: 300px; margin: 0 auto; }
        .nw-creating-step {
          display: flex; align-items: center; gap: 8px; padding: 4px 0;
          font-size: 13px; color: var(--ink-400); animation: fadeSlideIn 0.3s ease both;
        }
        .nw-creating-step.done { color: #5a9a3c; }
        .nw-creating-step.active { color: var(--ember); }
        .nw-cstep-icon { width: 18px; text-align: center; flex-shrink: 0; font-size: 12px; }
        .nw-cstep-spinner { animation: spin 0.8s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="nw-backdrop">
        <div className="nw-modal">
          {/* ── Header ── */}
          <div className="nw-header">
            <div className={`nw-avatar${!clientName.trim() ? " empty" : ""}`}
              style={{ background: clientName.trim() ? currentColor.value : undefined }}>
              {initials}
            </div>
            <div className="nw-header-info">
              <h2 className="nw-title">{clientName.trim() || "New workspace"}</h2>
              <p className="nw-subtitle">{contact || "Set up a new client workspace"}</p>
            </div>
            <button className="nw-close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* ── Steps ── */}
          <div className="nw-steps">
            <div className={`nw-step ${step === 1 ? "active" : step > 1 ? "done" : "upcoming"}`} onClick={() => !creating && setStep(1)}>
              <div className="nw-step-dot">{step > 1 ? "✓" : "1"}</div>
              <span className="nw-step-label">Details</span>
            </div>
            <div className="nw-step-line" />
            <div className={`nw-step ${step === 2 ? "active" : step > 2 ? "done" : "upcoming"}`} onClick={() => !creating && canProceed && setStep(2)}>
              <div className="nw-step-dot">{step > 2 ? "✓" : "2"}</div>
              <span className="nw-step-label">Template</span>
            </div>
          </div>

          {!creating ? (
            <>
              <div className="nw-body">
                {/* ═══ STEP 1: Details ═══ */}
                {step === 1 && (
                  <>
                    <div className="nw-field nw-recent">
                      <div className="nw-label">
                        Client name
                        <button className="nw-recent-trigger" onClick={() => setShowRecent(!showRecent)}>
                          or pick recent
                        </button>
                      </div>
                      <input ref={nameRef} className="nw-input large" value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        placeholder="e.g. Meridian Studio"
                        onKeyDown={e => { if (e.key === "Enter" && canProceed) setStep(2); }} />
                      {showRecent && (
                        <div className="nw-recent-dropdown">
                          {RECENT_CLIENTS.map(c => (
                            <div key={c.name} className="nw-recent-item" onClick={() => selectRecent(c)}>
                              <div className="nw-recent-av" style={{ background: c.color }}>{c.name[0]}</div>
                              <div>
                                <div className="nw-recent-name">{c.name}</div>
                                <div className="nw-recent-contact">{c.contact}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="nw-row">
                      <div className="nw-field">
                        <div className="nw-label">Contact <span className="nw-optional">optional</span></div>
                        <input className="nw-input" value={contact} onChange={e => setContact(e.target.value)} placeholder="sarah@acme.com" />
                      </div>
                      <div className="nw-field">
                        <div className="nw-label">Rate <span className="nw-optional">optional</span></div>
                        <input className="nw-input" value={rate} onChange={e => setRate(e.target.value)} placeholder="$95/hr" />
                      </div>
                    </div>

                    <div className="nw-field">
                      <div className="nw-label">Color</div>
                      <div className="nw-colors">
                        {COLORS.map(c => (
                          <div key={c.id} className={`nw-color${selectedColor === c.id ? " on" : ""}`}
                            style={{ background: c.value, color: c.value }}
                            onClick={() => setSelectedColor(c.id)}>
                            <span className="nw-color-check">✓</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="nw-field">
                      <div className="nw-label">Industry <span className="nw-optional">optional</span></div>
                      <div className="nw-tags">
                        {INDUSTRIES.map(tag => (
                          <button key={tag} className={`nw-tag${industry === tag ? " on" : ""}`}
                            onClick={() => setIndustry(industry === tag ? null : tag)}>
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="nw-field">
                      <div className="nw-label">Estimated budget <span className="nw-optional">optional</span></div>
                      <input className="nw-input" value={budget} onChange={e => setBudget(e.target.value)} placeholder="$2,000 – $5,000" />
                    </div>
                  </>
                )}

                {/* ═══ STEP 2: Template ═══ */}
                {step === 2 && (
                  <>
                    <div className="nw-sep">
                      <div className="nw-sep-line" />
                      <span className="nw-sep-label">start with</span>
                      <div className="nw-sep-line" />
                    </div>

                    <div className="nw-templates">
                      {TEMPLATES.map(t => (
                        <div key={t.id}
                          className={`nw-tmpl${selectedTemplate === t.id ? " on" : ""}`}
                          onClick={() => setSelectedTemplate(t.id)}
                          onMouseEnter={() => setHoveredTemplate(t.id)}
                          onMouseLeave={() => setHoveredTemplate(null)}>
                          <div className="nw-tmpl-icon" style={{ color: t.color }}>{t.icon}</div>
                          <div className="nw-tmpl-info">
                            <div className="nw-tmpl-name">{t.label}</div>
                            <div className="nw-tmpl-desc">{t.desc}</div>
                            <div className="nw-tmpl-sections">
                              {t.sections.map((s, i) => (
                                <span key={i} className="nw-tmpl-section">{s}</span>
                              ))}
                            </div>
                          </div>
                          <div className="nw-tmpl-check">
                            {selectedTemplate === t.id && (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Preview */}
                    {previewTemplate && (
                      <div className="nw-preview">
                        <div className="nw-preview-label">
                          {previewTemplate.label} includes {previewTemplate.sections.length} sections
                        </div>
                        <div className="nw-preview-sections">
                          {previewTemplate.sections.map((s, i) => (
                            <div key={i} className="nw-preview-section">
                              <span className="nw-preview-num">{String(i + 1).padStart(2, "0")}</span>
                              {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* ── Footer ── */}
              <div className="nw-footer">
                <div className="nw-foot-left">
                  <span className="nw-kbd">esc</span>
                  <span className="nw-skip">cancel</span>
                </div>
                <div className="nw-foot-right">
                  {step > 1 && (
                    <button className="nw-back-btn" onClick={() => setStep(step - 1)}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2.5l-4 3.5 4 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Back
                    </button>
                  )}
                  {step === 1 ? (
                    <button className={`nw-next-btn${canProceed ? " ready" : ""}`}
                      onClick={() => canProceed && setStep(2)}>
                      Next
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  ) : (
                    <button className="nw-next-btn ready" onClick={handleCreate}>
                      Create workspace
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4.5 7h5M7.5 4.5L10 7l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* ── Creating state ── */
            <div className="nw-creating">
              <div className="nw-creating-avatar" style={{ background: currentColor.value }}>
                {initials}
              </div>
              <div className="nw-creating-title">Creating {clientName}</div>
              <div className="nw-creating-sub">Setting up workspace with {activeTemplate?.label} template</div>
              <div className="nw-creating-steps">
                {[
                  { text: "Creating workspace", delay: 0 },
                  { text: `Applying ${activeTemplate?.label} template`, delay: 800 },
                  { text: `Generating ${activeTemplate?.sections.length} sections`, delay: 1600 },
                  { text: "Reading client context with AI", delay: 2400 },
                  { text: "Ready", delay: 3200 },
                ].map((s, i) => {
                  const [stepState, setStepState] = useState("upcoming");
                  useEffect(() => {
                    const t1 = setTimeout(() => setStepState("active"), s.delay);
                    const t2 = setTimeout(() => setStepState("done"), s.delay + 700);
                    return () => { clearTimeout(t1); clearTimeout(t2); };
                  }, []);
                  return (
                    <div key={i} className={`nw-creating-step ${stepState}`} style={{ animationDelay: `${s.delay}ms` }}>
                      <span className="nw-cstep-icon">
                        {stepState === "done" ? "✓" : stepState === "active" ? <span className="nw-cstep-spinner">⠋</span> : "○"}
                      </span>
                      {s.text}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
