import { useState, useEffect, useRef } from "react";

const NOX_SUGGESTIONS = [
  { id: 1, icon: "✎", label: "Draft a proposal for this project", category: "write" },
  { id: 2, icon: "◎", label: "Analyze my effective rate across projects", category: "analyze" },
  { id: 3, icon: "!", label: "Detect scope creep on Brand Guidelines", category: "detect" },
  { id: 4, icon: "→", label: "Write a follow-up email to Bolt Fitness", category: "write" },
  { id: 5, icon: "$", label: "Predict next month's cash flow", category: "analyze" },
  { id: 6, icon: "§", label: "Review Nora's contract for red flags", category: "detect" },
];

const DEMO_CONVERSATION = [
  {
    role: "system",
    text: "Nox is online. I have context on 4 workspaces, 8 projects, and 46 documents.",
    time: "11:30",
  },
  {
    role: "user",
    text: "analyze my rates across all active projects",
    time: "11:31",
  },
  {
    role: "nox",
    text: null, // complex response rendered below
    type: "rate-analysis",
    time: "11:31",
    data: {
      target: 95,
      projects: [
        { name: "Brand Guidelines v2", client: "Meridian", hours: 32, value: 2400, rate: 75, status: "below" },
        { name: "Website Copy", client: "Meridian", hours: 18, value: 1800, rate: 100, status: "above" },
        { name: "Course Landing Page", client: "Nora Kim", hours: 12, value: 3200, rate: 267, status: "above" },
        { name: "App Onboarding UX", client: "Bolt Fitness", hours: 68, value: 4000, rate: 59, status: "critical" },
        { name: "Blog Posts", client: "Bolt Fitness", hours: 8, value: 800, rate: 100, status: "above" },
      ],
      avgRate: 87,
      insight: "Your blended rate is $87/hr — 8% below your $95 target. Bolt Fitness's Onboarding project is the outlier at $59/hr, dragging the average down significantly. Without Bolt, your rate would be $110/hr.",
      recommendations: [
        "Renegotiate Bolt Onboarding or accept the loss and finish fast",
        "Increase your standard rate to $110/hr for new proposals",
        "Nora's Landing Page is your most profitable project — replicate that scope",
      ],
    },
  },
  {
    role: "user",
    text: "write a follow-up email to bolt fitness about the overdue invoice",
    time: "11:33",
  },
  {
    role: "nox",
    text: null,
    type: "email-draft",
    time: "11:33",
    data: {
      to: "team@boltfit.co",
      subject: "Quick check-in — Invoice #044",
      body: `Hi team,

Hope things are going well on your end. I wanted to follow up on Invoice #044 ($4,000) for the App Onboarding UX project — it looks like it slipped past the due date on March 25.

I know things get busy, so just flagging it in case it got lost in the shuffle. Happy to resend or adjust the payment method if that's easier.

The project is at 70% and I'd love to keep momentum going — wrapping this up is my top priority this week.

Let me know if you have any questions.

Best,
Alex`,
      tone: "Professional but warm — no guilt, just a nudge",
      variants: ["More direct", "Softer touch", "Add urgency"],
    },
  },
];

const TYPING_PHASES = [
  "thinking",
  "reading context",
  "analyzing",
  "generating",
];

function TypingIndicator() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setPhase(p => (p + 1) % TYPING_PHASES.length), 1200);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="nox-typing">
      <div className="nox-typing-dots"><span /><span /><span /></div>
      <span className="nox-typing-phase">{TYPING_PHASES[phase]}</span>
    </div>
  );
}

function NoxParticles() {
  const canvasRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; };
    resize();

    const spawn = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 1 + 0.3,
      life: 1,
      decay: Math.random() * 0.002 + 0.0005,
      type: Math.random() > 0.7 ? "ember" : "cool",
    });

    for (let i = 0; i < 30; i++) particles.current.push(spawn());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.03) particles.current.push(spawn());

      particles.current = particles.current.filter(p => {
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) return false;

        const alpha = p.life * 0.2;
        if (p.type === "ember") {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 149, 108, ${alpha})`;
          ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(120, 140, 170, ${alpha * 0.5})`;
          ctx.fill();
        }
        return true;
      });

      // Connect nearby particles
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const dx = particles.current[i].x - particles.current[j].x;
          const dy = particles.current[i].y - particles.current[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles.current[i].x, particles.current[i].y);
            ctx.lineTo(particles.current[j].x, particles.current[j].y);
            ctx.strokeStyle = `rgba(176, 125, 79, ${(1 - dist / 80) * 0.04})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="nox-particles" />;
}

export default function NoxAI() {
  const [messages, setMessages] = useState(DEMO_CONVERSATION);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [hoveredSug, setHoveredSug] = useState(null);
  const [activeVariant, setActiveVariant] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: text.trim(), time: "now" }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: "nox",
        text: `I've analyzed your request. Based on your current project data and workspace context, here's what I found. This is a simulated response — in production, Nox would have full access to your documents, invoices, and project history to give you real insights.`,
        type: "text",
        time: "now",
      }]);
    }, 2500);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .nox {
          font-family: 'Outfit', sans-serif; font-size: 14px;
          color: rgba(255,255,255,0.7); background: #0c0c0b;
          height: 100vh; display: flex; flex-direction: column;
          position: relative; overflow: hidden;
        }

        .nox-particles { position: absolute; inset: 0; pointer-events: none; z-index: 0; width: 100%; height: 100%; }

        /* ── Header ── */
        .nox-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.04);
          flex-shrink: 0; position: relative; z-index: 2;
          background: rgba(12,12,11,0.8); backdrop-filter: blur(12px);
        }
        .nox-header-left { display: flex; align-items: center; gap: 12px; }

        .nox-logo {
          display: flex; align-items: center; gap: 8px;
        }
        .nox-logo-mark {
          width: 28px; height: 28px; border-radius: 7px;
          background: linear-gradient(135deg, #b07d4f, #c89360);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .nox-logo-mark::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          border-radius: 7px;
        }
        .nox-logo-mark svg { position: relative; z-index: 1; }
        .nox-logo-text {
          font-family: 'JetBrains Mono', monospace; font-size: 16px;
          font-weight: 600; color: rgba(255,255,255,0.9); letter-spacing: 0.08em;
        }
        .nox-logo-ai {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: #c89360; background: rgba(200,147,96,0.1);
          padding: 1px 6px; border-radius: 3px; border: 1px solid rgba(200,147,96,0.15);
          margin-left: 4px; letter-spacing: 0.06em;
        }

        .nox-status {
          display: flex; align-items: center; gap: 6px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: rgba(255,255,255,0.25);
        }
        .nox-status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #5a9a3c; animation: noxPulse 2s ease infinite;
        }
        @keyframes noxPulse { 0%, 100% { opacity: 0.4; box-shadow: none; } 50% { opacity: 1; box-shadow: 0 0 8px rgba(90,154,60,0.3); } }

        .nox-header-right { display: flex; align-items: center; gap: 6px; }
        .nox-h-btn {
          width: 30px; height: 30px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02); cursor: pointer; color: rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center; transition: all 0.08s;
        }
        .nox-h-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.1); }

        /* ── Context bar ── */
        .nox-context {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 20px; border-bottom: 1px solid rgba(255,255,255,0.03);
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: rgba(255,255,255,0.2); flex-shrink: 0;
          position: relative; z-index: 2; overflow-x: auto;
        }
        .nox-context::-webkit-scrollbar { display: none; }
        .nox-ctx-chip {
          display: flex; align-items: center; gap: 4px;
          padding: 3px 8px; border-radius: 4px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.04);
          white-space: nowrap; flex-shrink: 0;
        }
        .nox-ctx-chip.active { border-color: rgba(200,147,96,0.15); color: rgba(200,147,96,0.6); }
        .nox-ctx-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; }

        /* ── Messages ── */
        .nox-messages {
          flex: 1; overflow-y: auto; padding: 20px; position: relative; z-index: 2;
        }
        .nox-messages::-webkit-scrollbar { width: 4px; }
        .nox-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.04); border-radius: 99px; }

        /* System message */
        .nox-msg-system {
          text-align: center; padding: 12px 0;
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: rgba(255,255,255,0.15);
        }

        /* User message */
        .nox-msg-user {
          display: flex; justify-content: flex-end; margin-bottom: 16px;
        }
        .nox-msg-user-bubble {
          max-width: 440px; padding: 12px 16px; border-radius: 12px 12px 2px 12px;
          background: rgba(200,147,96,0.1); border: 1px solid rgba(200,147,96,0.12);
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          color: rgba(255,255,255,0.8); line-height: 1.5;
        }

        /* Nox message */
        .nox-msg-nox { margin-bottom: 20px; }
        .nox-msg-nox-head {
          display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
        }
        .nox-msg-nox-avatar {
          width: 24px; height: 24px; border-radius: 6px;
          background: linear-gradient(135deg, rgba(200,147,96,0.2), rgba(200,147,96,0.05));
          border: 1px solid rgba(200,147,96,0.15);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .nox-msg-nox-name { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #c89360; font-weight: 500; }
        .nox-msg-nox-time { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.15); }

        .nox-msg-nox-body { padding-left: 32px; }

        .nox-msg-text {
          font-size: 14px; color: rgba(255,255,255,0.6);
          line-height: 1.7; max-width: 520px;
        }

        /* ── Rate analysis card ── */
        .nox-card {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px; overflow: hidden; max-width: 540px;
          margin-bottom: 12px;
        }
        .nox-card-head {
          padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: space-between;
        }
        .nox-card-title {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: rgba(255,255,255,0.3); text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .nox-card-badge {
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          padding: 2px 7px; border-radius: 3px;
        }

        /* Rate table */
        .nox-rate-table { padding: 0; }
        .nox-rate-row {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: background 0.06s;
        }
        .nox-rate-row:last-child { border-bottom: none; }
        .nox-rate-row:hover { background: rgba(255,255,255,0.015); }
        .nox-rate-bar-col { width: 4px; align-self: stretch; border-radius: 2px; flex-shrink: 0; }
        .nox-rate-info { flex: 1; min-width: 0; }
        .nox-rate-name { font-size: 13px; color: rgba(255,255,255,0.7); font-weight: 500; }
        .nox-rate-client { font-size: 11px; color: rgba(255,255,255,0.25); }
        .nox-rate-hours { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.25); width: 48px; text-align: right; flex-shrink: 0; }
        .nox-rate-val { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; width: 64px; text-align: right; flex-shrink: 0; }
        .nox-rate-val.above { color: #5a9a3c; }
        .nox-rate-val.below { color: #c89360; }
        .nox-rate-val.critical { color: #c24b38; }

        .nox-rate-summary {
          padding: 14px 16px; border-top: 1px solid rgba(255,255,255,0.04);
          display: flex; gap: 16px;
        }
        .nox-rate-stat { flex: 1; text-align: center; }
        .nox-rate-stat-val { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 600; }
        .nox-rate-stat-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }

        /* Insight */
        .nox-insight {
          padding: 14px 16px; margin: 0 0 12px;
          background: rgba(200,147,96,0.04); border: 1px solid rgba(200,147,96,0.08);
          border-radius: 8px; font-size: 13.5px; color: rgba(255,255,255,0.5);
          line-height: 1.65; max-width: 540px;
        }
        .nox-insight strong { color: rgba(255,255,255,0.8); font-weight: 500; }

        /* Recommendations */
        .nox-recs { max-width: 540px; margin-bottom: 8px; }
        .nox-rec {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.03);
          font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.5;
        }
        .nox-rec:last-child { border-bottom: none; }
        .nox-rec-num { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #c89360; width: 20px; flex-shrink: 0; }

        /* ── Email draft card ── */
        .nox-email {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px; overflow: hidden; max-width: 540px; margin-bottom: 12px;
        }
        .nox-email-head {
          padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .nox-email-field {
          display: flex; align-items: center; gap: 8px;
          padding: 3px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px;
        }
        .nox-email-label { color: rgba(255,255,255,0.2); width: 52px; flex-shrink: 0; }
        .nox-email-val { color: rgba(255,255,255,0.5); }
        .nox-email-subject { color: rgba(255,255,255,0.7); font-weight: 500; }

        .nox-email-body {
          padding: 16px; font-size: 14px; color: rgba(255,255,255,0.55);
          line-height: 1.75; white-space: pre-wrap;
          font-family: 'Outfit', sans-serif;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .nox-email-footer {
          padding: 10px 16px; display: flex; align-items: center;
          justify-content: space-between;
        }
        .nox-email-tone { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.2); font-style: italic; }
        .nox-email-actions { display: flex; gap: 4px; }
        .nox-email-act {
          padding: 5px 12px; border-radius: 5px; font-size: 11px;
          font-family: 'JetBrains Mono', monospace; cursor: pointer;
          transition: all 0.08s; border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02); color: rgba(255,255,255,0.4);
        }
        .nox-email-act:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.1); }
        .nox-email-act.primary { background: rgba(200,147,96,0.15); border-color: rgba(200,147,96,0.2); color: #c89360; }
        .nox-email-act.primary:hover { background: rgba(200,147,96,0.25); }

        .nox-email-variants {
          display: flex; gap: 4px; padding: 8px 16px;
          border-top: 1px solid rgba(255,255,255,0.03);
        }
        .nox-variant {
          padding: 4px 10px; border-radius: 4px; font-size: 10px;
          font-family: 'JetBrains Mono', monospace; cursor: pointer;
          border: 1px solid rgba(255,255,255,0.05); background: none;
          color: rgba(255,255,255,0.25); transition: all 0.08s;
        }
        .nox-variant:hover { border-color: rgba(200,147,96,0.15); color: rgba(200,147,96,0.6); background: rgba(200,147,96,0.04); }
        .nox-variant.on { border-color: rgba(200,147,96,0.2); color: #c89360; background: rgba(200,147,96,0.06); }

        /* ── Typing indicator ── */
        .nox-typing {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 0 8px 32px;
        }
        .nox-typing-dots { display: flex; gap: 3px; }
        .nox-typing-dots span {
          width: 4px; height: 4px; border-radius: 50%;
          background: #c89360; animation: noxDot 1.2s ease infinite;
        }
        .nox-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .nox-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes noxDot { 0%, 60%, 100% { opacity: 0.15; } 30% { opacity: 0.8; } }
        .nox-typing-phase {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: rgba(200,147,96,0.4); font-style: italic;
        }

        /* ── Suggestions ── */
        .nox-suggestions {
          display: flex; gap: 6px; flex-wrap: wrap; padding: 12px 20px;
          border-top: 1px solid rgba(255,255,255,0.03);
          flex-shrink: 0; position: relative; z-index: 2;
        }
        .nox-sug {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02);
          cursor: pointer; transition: all 0.1s; font-size: 12.5px;
          color: rgba(255,255,255,0.35);
        }
        .nox-sug:hover {
          border-color: rgba(200,147,96,0.15); color: rgba(255,255,255,0.6);
          background: rgba(200,147,96,0.04);
          box-shadow: 0 0 12px rgba(200,147,96,0.04);
        }
        .nox-sug-icon { font-size: 13px; color: #c89360; opacity: 0.5; }
        .nox-sug:hover .nox-sug-icon { opacity: 1; }

        /* ── Input ── */
        .nox-input-area {
          padding: 12px 20px 16px; border-top: 1px solid rgba(255,255,255,0.04);
          flex-shrink: 0; position: relative; z-index: 2;
          background: rgba(12,12,11,0.6); backdrop-filter: blur(12px);
        }
        .nox-input-row {
          display: flex; align-items: flex-end; gap: 10px;
          padding: 12px 16px; border-radius: 10px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.15s;
        }
        .nox-input-row.focused { border-color: rgba(200,147,96,0.2); box-shadow: 0 0 20px rgba(200,147,96,0.04); }

        .nox-prompt {
          font-family: 'JetBrains Mono', monospace; font-size: 14px;
          color: #c89360; font-weight: 600; flex-shrink: 0; padding-bottom: 2px;
        }

        .nox-input {
          flex: 1; border: none; outline: none;
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          color: rgba(255,255,255,0.8); background: transparent;
          resize: none; min-height: 20px; max-height: 80px; line-height: 1.5;
        }
        .nox-input::placeholder { color: rgba(255,255,255,0.12); }

        .nox-input-actions { display: flex; gap: 4px; flex-shrink: 0; }
        .nox-send {
          width: 32px; height: 32px; border-radius: 7px; border: none;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.1s;
        }
        .nox-send.ready { background: linear-gradient(135deg, #b07d4f, #c89360); color: #fff; }
        .nox-send.ready:hover { box-shadow: 0 0 16px rgba(200,147,96,0.2); transform: scale(1.05); }
        .nox-send.disabled { background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.1); cursor: default; }

        .nox-input-hints {
          display: flex; gap: 10px; padding: 6px 4px 0;
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          color: rgba(255,255,255,0.1);
        }
        .nox-kbd {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 3px; padding: 0px 4px; margin-right: 2px;
        }

        /* ── Footer ── */
        .nox-footer {
          padding: 6px 20px; display: flex; justify-content: space-between;
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          color: rgba(255,255,255,0.08); flex-shrink: 0;
          position: relative; z-index: 2;
        }
      `}</style>

      <div className="nox">
        <NoxParticles />

        {/* ── Header ── */}
        <div className="nox-header">
          <div className="nox-header-left">
            <div className="nox-logo">
              <div className="nox-logo-mark">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2l-5 3v6l5 3 5-3V5L8 2z" fill="rgba(255,255,255,0.9)" />
                </svg>
              </div>
              <span className="nox-logo-text">NOX</span>
              <span className="nox-logo-ai">AI</span>
            </div>
            <div className="nox-status">
              <span className="nox-status-dot" />
              context loaded · 4 workspaces
            </div>
          </div>
          <div className="nox-header-right">
            <button className="nox-h-btn" title="Settings">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.8 2.8l1.4 1.4M9.8 9.8l1.4 1.4M2.8 11.2l1.4-1.4M9.8 4.2l1.4-1.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
            </button>
            <button className="nox-h-btn" title="History">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.1"/><path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
            </button>
            <button className="nox-h-btn" title="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        {/* ── Context bar ── */}
        <div className="nox-context">
          <span style={{ color: "rgba(255,255,255,0.1)" }}>context:</span>
          <span className="nox-ctx-chip active"><span className="nox-ctx-dot" style={{ background: "#c89360" }} /> Brand Guidelines v2</span>
          <span className="nox-ctx-chip"><span className="nox-ctx-dot" style={{ background: "#7c8594" }} /> Meridian Studio</span>
          <span className="nox-ctx-chip"><span className="nox-ctx-dot" style={{ background: "#8a7e63" }} /> 5 invoices</span>
          <span className="nox-ctx-chip"><span className="nox-ctx-dot" style={{ background: "#5b7fa4" }} /> 138 hours tracked</span>
          <span className="nox-ctx-chip"><span className="nox-ctx-dot" style={{ background: "#5a9a3c" }} /> $14.8k this month</span>
        </div>

        {/* ── Messages ── */}
        <div className="nox-messages" ref={scrollRef}>
          {messages.map((msg, i) => {
            if (msg.role === "system") {
              return <div key={i} className="nox-msg-system">{msg.text}</div>;
            }

            if (msg.role === "user") {
              return (
                <div key={i} className="nox-msg-user">
                  <div className="nox-msg-user-bubble">{msg.text}</div>
                </div>
              );
            }

            if (msg.role === "nox") {
              return (
                <div key={i} className="nox-msg-nox">
                  <div className="nox-msg-nox-head">
                    <div className="nox-msg-nox-avatar">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2l-5 3v6l5 3 5-3V5L8 2z" fill="#c89360" /></svg>
                    </div>
                    <span className="nox-msg-nox-name">nox</span>
                    <span className="nox-msg-nox-time">{msg.time}</span>
                  </div>

                  <div className="nox-msg-nox-body">
                    {/* Text response */}
                    {msg.type === "text" && <div className="nox-msg-text">{msg.text}</div>}

                    {/* Rate analysis */}
                    {msg.type === "rate-analysis" && msg.data && (
                      <>
                        <div className="nox-card">
                          <div className="nox-card-head">
                            <span className="nox-card-title">rate analysis</span>
                            <span className="nox-card-badge" style={{ background: "rgba(200,147,96,0.08)", color: "#c89360", border: "1px solid rgba(200,147,96,0.12)" }}>live data</span>
                          </div>
                          <div className="nox-rate-table">
                            {msg.data.projects.map((p, pi) => {
                              const barColor = p.status === "above" ? "#5a9a3c" : p.status === "below" ? "#c89360" : "#c24b38";
                              return (
                                <div key={pi} className="nox-rate-row">
                                  <div className="nox-rate-bar-col" style={{ background: barColor }} />
                                  <div className="nox-rate-info">
                                    <div className="nox-rate-name">{p.name}</div>
                                    <div className="nox-rate-client">{p.client}</div>
                                  </div>
                                  <span className="nox-rate-hours">{p.hours}h</span>
                                  <span className={`nox-rate-val ${p.status}`}>${p.rate}/hr</span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="nox-rate-summary">
                            <div className="nox-rate-stat">
                              <div className="nox-rate-stat-val" style={{ color: "#c89360" }}>${msg.data.avgRate}</div>
                              <div className="nox-rate-stat-label">blended rate</div>
                            </div>
                            <div className="nox-rate-stat">
                              <div className="nox-rate-stat-val" style={{ color: "rgba(255,255,255,0.6)" }}>${msg.data.target}</div>
                              <div className="nox-rate-stat-label">target rate</div>
                            </div>
                            <div className="nox-rate-stat">
                              <div className="nox-rate-stat-val" style={{ color: "#c24b38" }}>-8%</div>
                              <div className="nox-rate-stat-label">below target</div>
                            </div>
                          </div>
                        </div>

                        <div className="nox-insight">
                          {msg.data.insight.split("$59/hr").map((part, pi, arr) =>
                            pi < arr.length - 1
                              ? <span key={pi}>{part}<strong>$59/hr</strong></span>
                              : <span key={pi}>{part}</span>
                          )}
                        </div>

                        <div className="nox-recs">
                          {msg.data.recommendations.map((r, ri) => (
                            <div key={ri} className="nox-rec">
                              <span className="nox-rec-num">{ri + 1}.</span>
                              {r}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Email draft */}
                    {msg.type === "email-draft" && msg.data && (
                      <div className="nox-email">
                        <div className="nox-email-head">
                          <div className="nox-email-field"><span className="nox-email-label">to</span><span className="nox-email-val">{msg.data.to}</span></div>
                          <div className="nox-email-field"><span className="nox-email-label">subject</span><span className="nox-email-subject">{msg.data.subject}</span></div>
                        </div>
                        <div className="nox-email-body">{msg.data.body}</div>
                        <div className="nox-email-footer">
                          <span className="nox-email-tone">{msg.data.tone}</span>
                          <div className="nox-email-actions">
                            <button className="nox-email-act">Copy</button>
                            <button className="nox-email-act primary">Send via Felmark</button>
                          </div>
                        </div>
                        <div className="nox-email-variants">
                          <span style={{ fontFamily: "var(--mono, 'JetBrains Mono')", fontSize: 9, color: "rgba(255,255,255,0.15)", marginRight: 4, alignSelf: "center" }}>variants:</span>
                          {msg.data.variants.map((v, vi) => (
                            <button key={vi} className={`nox-variant${activeVariant === vi ? " on" : ""}`}
                              onClick={() => setActiveVariant(activeVariant === vi ? null : vi)}>{v}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          })}

          {isTyping && <TypingIndicator />}
        </div>

        {/* ── Suggestions ── */}
        <div className="nox-suggestions">
          {NOX_SUGGESTIONS.slice(0, 4).map(s => (
            <button key={s.id} className="nox-sug"
              onMouseEnter={() => setHoveredSug(s.id)}
              onMouseLeave={() => setHoveredSug(null)}
              onClick={() => sendMessage(s.label)}>
              <span className="nox-sug-icon">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* ── Input ── */}
        <div className="nox-input-area">
          <div className={`nox-input-row${true ? " focused" : ""}`}>
            <span className="nox-prompt">❯</span>
            <textarea ref={inputRef} className="nox-input" placeholder="ask nox anything..."
              value={input} onChange={e => setInput(e.target.value)} rows={1}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }} />
            <div className="nox-input-actions">
              <button className={`nox-send ${input.trim() ? "ready" : "disabled"}`}
                onClick={() => sendMessage(input)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 11V3M4 5.5L7 2.5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
          <div className="nox-input-hints">
            <span><span className="nox-kbd">⏎</span> send</span>
            <span><span className="nox-kbd">⇧⏎</span> new line</span>
            <span><span className="nox-kbd">⌘I</span> toggle nox</span>
          </div>
        </div>

        <div className="nox-footer">
          <span>nox ai · felmark intelligence layer</span>
          <span>context: brand-guidelines-v2 · 4 workspaces · 138h tracked</span>
        </div>
      </div>
    </>
  );
}
