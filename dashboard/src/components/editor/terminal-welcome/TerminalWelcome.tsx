"use client";

import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════
   TERMINAL WELCOME v2 — 10x
   The screen that makes you open Felmark first
   ═══════════════════════════════════════ */

const SUGGESTIONS = [
  { cmd: "open brand-guidelines", desc: "Continue where you left off", icon: "◆", hot: true },
  { cmd: "create invoice --client bolt", desc: "Bill the overdue project", icon: "$", hot: false },
  { cmd: "new proposal --client nora", desc: "Start Nora's proposal", icon: "+", hot: false },
  { cmd: "view calendar", desc: "3 events today", icon: "◎", hot: false },
  { cmd: "send reminder --client bolt", desc: "Nudge overdue payment", icon: "→", hot: false },
  { cmd: "new workspace", desc: "Onboard a new client", icon: "⊞", hot: false },
];

function EmberParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    const resize = () => { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; };
    resize();
    window.addEventListener("resize", resize);

    const spawn = () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.5 + 0.15),
      size: Math.random() * 1.8 + 0.5,
      life: 1,
      decay: Math.random() * 0.003 + 0.001,
      heat: Math.random(),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: (Math.random() - 0.5) * 0.02,
    });

    for (let i = 0; i < 20; i++) {
      const p = spawn();
      p.y = Math.random() * canvas.height;
      p.life = Math.random();
      particles.current.push(p);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.06) particles.current.push(spawn());

      particles.current = particles.current.filter(p => {
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.2;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) return false;

        const alpha = p.life * 0.25;
        const r = 190 + p.heat * 60;
        const g = 130 + p.heat * 40;
        const b = 60 + p.heat * 20;

        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.3})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(p.x - p.size * 4, p.y - p.size * 4, p.size * 8, p.size * 8);

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
        return true;
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="tw-particles" />;
}

interface TerminalWelcomeProps {
  activeCount?: number;
  reviewCount?: number;
  overdueCount?: number;
  totalEarned?: number;
  totalPending?: number;
  pipeline?: number;
  onOpenCmdPalette?: () => void;
  onNewWorkspace?: () => void;
}

export default function TerminalWelcome({ activeCount = 4, reviewCount = 1, overdueCount = 1, totalEarned = 14800, totalPending = 7200, pipeline = 22000, onOpenCmdPalette, onNewWorkspace }: TerminalWelcomeProps) {
  const [phase, setPhase] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggIdx, setSuggIdx] = useState(0);
  const [executedCmd, setExecutedCmd] = useState<string | null>(null);
  const [cmdOutput, setCmdOutput] = useState<{ text: string; icon: string; color: string } | null>(null);
  const [expandedComment, setExpandedComment] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [streak] = useState(14);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const now = mounted ? new Date() : new Date(0);
  const hour = now.getHours();
  const greeting = !mounted ? "" : hour < 12 ? "good morning" : hour < 17 ? "good afternoon" : "good evening";
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dateStr = mounted ? `${dayNames[now.getDay()]}, ${monthNames[now.getMonth()]} ${now.getDate()}` : "";

  // Cascading reveal — gentle pacing
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    for (let i = 1; i <= 12; i++) {
      timers.push(setTimeout(() => setPhase(i), i * 380));
    }
    // Let the user discover the command input themselves
    return () => timers.forEach(clearTimeout);
  }, []);

  // Auto-scroll: only after a command is executed, not during reveal
  const scrollTrigger = executedCmd ? `${executedCmd}-${cmdOutput?.text ?? ""}` : null;
  useEffect(() => {
    if (scrollTrigger && scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [scrollTrigger]);

  const filtered = inputValue
    ? SUGGESTIONS.filter(s => s.cmd.toLowerCase().includes(inputValue.toLowerCase()) || s.desc.toLowerCase().includes(inputValue.toLowerCase()))
    : SUGGESTIONS;

  const executeCommand = (cmd: string) => {
    setExecutedCmd(cmd);
    setInputValue("");
    setShowSuggestions(false);
    setCmdOutput(null);
    setTimeout(() => {
      if (cmd.includes("brand")) setCmdOutput({ text: "Opening Brand Guidelines v2...\nLast edited: Typography section \u00b7 2 minutes ago", icon: "\u25c6", color: "#b07d4f" });
      else if (cmd.includes("invoice")) setCmdOutput({ text: "Creating invoice for Bolt Fitness \u2014 $4,000\nAuto-populating from project scope\nOpening editor...", icon: "$", color: "#5a9a3c" });
      else if (cmd.includes("proposal")) setCmdOutput({ text: "Scaffolding proposal for Nora Kim\nTemplate: Brand & Identity \u00b7 6 sections\nPre-filling from discovery notes...", icon: "+", color: "#b07d4f" });
      else if (cmd.includes("calendar")) setCmdOutput({ text: "09:00  Brand review call \u2014 Meridian\n11:30  Deep work block (current)\n14:00  Nora kickoff \u2014 Course Landing Page", icon: "\u25ce", color: "#7c8594" });
      else if (cmd.includes("reminder")) setCmdOutput({ text: "Sending payment reminder to Bolt Fitness\nRe: Invoice #044 \u2014 $4,000 (4 days overdue)\nDraft ready \u2014 review before sending?", icon: "\u2192", color: "#b07d4f" });
      else if (cmd.includes("workspace")) { onNewWorkspace?.(); return; }
      else setCmdOutput({ text: `Command not found: ${cmd}\nTry: open, create, new, view, send`, icon: "?", color: "#9b988f" });
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && showSuggestions) { e.preventDefault(); setSuggIdx(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp" && showSuggestions) { e.preventDefault(); setSuggIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (showSuggestions && filtered[suggIdx]) executeCommand(filtered[suggIdx].cmd); else if (inputValue.trim()) executeCommand(inputValue.trim()); }
    else if (e.key === "Tab" && showSuggestions && filtered[suggIdx]) { e.preventDefault(); setInputValue(filtered[suggIdx].cmd); }
    else if (e.key === "Escape") setShowSuggestions(false);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        .tw { font-family: var(--mono); font-size: 13px; color: var(--ink-600); background: var(--parchment); height: 100%; flex: 1; display: flex; flex-direction: column; position: relative; overflow: hidden; }
        .tw-particles { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .tw-scroll { flex: 1; overflow-y: auto; position: relative; z-index: 1; padding: 48px 60px; }
        .tw-scroll::-webkit-scrollbar { width: 4px; }
        .tw-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }
        .tw-content { max-width: 600px; width: 100%; margin: 0 auto; }

        .tw-line { min-height: 20px; opacity: 0; transform: translateY(8px); transition: opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1), transform 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
        .tw-line.visible { opacity: 1; transform: translateY(0); }

        .tw-greeting {
          font-family: 'Cormorant Garamond', serif; font-size: 32px;
          font-weight: 500; color: var(--ink-800); line-height: 1.3;
          margin-bottom: 4px; letter-spacing: -0.01em;
        }
        .tw-greeting em { font-style: italic; color: var(--ember); font-weight: 500; }
        .tw-date-row {
          display: flex; align-items: center; gap: 10px;
          font-size: 11px; color: var(--ink-300); margin-bottom: 4px;
        }
        .tw-streak {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 10px; color: var(--ember); background: var(--ember-bg);
          padding: 1px 8px; border-radius: 3px; border: 1px solid rgba(176,125,79,0.08);
        }
        .tw-streak-fire { font-size: 11px; }

        .tw-focus {
          margin: 14px 0 4px; padding: 12px 16px;
          background: rgba(176,125,79,0.03); border: 1px solid rgba(176,125,79,0.08);
          border-radius: 8px; display: flex; align-items: flex-start; gap: 12px;
          cursor: pointer; transition: all 0.12s;
        }
        .tw-focus:hover { background: rgba(176,125,79,0.06); border-color: rgba(176,125,79,0.15); }
        .tw-focus-icon {
          width: 32px; height: 32px; border-radius: 7px;
          background: var(--ember-bg); border: 1px solid rgba(176,125,79,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; color: var(--ember); flex-shrink: 0;
        }
        .tw-focus-body { flex: 1; }
        .tw-focus-label { font-family: var(--mono); font-size: 9px; color: var(--ember); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 3px; }
        .tw-focus-text { font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--ink-800); font-weight: 500; line-height: 1.4; }
        .tw-focus-sub { font-size: 12px; color: var(--ink-400); margin-top: 2px; font-family: 'Outfit', sans-serif; }
        .tw-focus-kbd { font-family: var(--mono); font-size: 9px; color: var(--ink-300); background: var(--warm-100); border: 1px solid var(--warm-200); border-radius: 3px; padding: 1px 5px; flex-shrink: 0; align-self: center; }

        .tw-section {
          font-size: 9px; font-weight: 500; color: var(--ink-300);
          letter-spacing: 0.14em; margin-top: 16px; margin-bottom: 6px;
          display: flex; align-items: center; gap: 8px;
        }
        .tw-section::after { content: ''; flex: 1; height: 1px; background: var(--warm-200); }

        .tw-stat { display: flex; align-items: center; gap: 0; padding: 2px 0; font-size: 12.5px; }
        .tw-stat-label { color: var(--ink-400); width: 180px; flex-shrink: 0; }
        .tw-stat-val { font-weight: 500; }
        .tw-stat-badge {
          font-size: 9px; margin-left: 8px; padding: 0px 5px; border-radius: 2px;
          font-weight: 500; letter-spacing: 0.04em;
        }

        .tw-insight {
          margin: 8px 0 0; padding: 8px 12px;
          background: rgba(90,154,60,0.03); border: 1px solid rgba(90,154,60,0.08);
          border-radius: 6px; font-size: 12px; color: #5a9a3c;
          display: flex; align-items: center; gap: 8px;
          font-family: 'Outfit', sans-serif;
        }
        .tw-insight-icon { font-size: 14px; flex-shrink: 0; }

        .tw-alert {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 8px 12px; margin: 2px -12px; border-radius: 6px;
          transition: background 0.08s; cursor: pointer; position: relative;
        }
        .tw-alert:hover { background: rgba(0,0,0,0.015); }
        .tw-alert-icon {
          width: 24px; height: 24px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; flex-shrink: 0; margin-top: 1px;
        }
        .tw-alert-body { flex: 1; }
        .tw-alert-text { font-size: 13px; color: var(--ink-600); line-height: 1.4; }
        .tw-alert-sub { font-size: 11px; color: var(--ink-300); margin-top: 2px; }
        .tw-alert-actions {
          display: flex; gap: 4px; opacity: 0; transition: opacity 0.1s;
          position: absolute; right: 8px; top: 8px;
        }
        .tw-alert:hover .tw-alert-actions { opacity: 1; }
        .tw-alert-act {
          padding: 3px 8px; border-radius: 3px; font-size: 10px;
          border: 1px solid var(--warm-200); background: #fff;
          cursor: pointer; font-family: var(--mono); color: var(--ink-500);
          transition: all 0.06s;
        }
        .tw-alert-act:hover { background: var(--warm-100); }
        .tw-alert-act.primary { background: var(--ember); border-color: var(--ember); color: #fff; }
        .tw-alert-act.primary:hover { background: var(--ember-light); }

        .tw-comment {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 12px; margin: 2px -12px; border-radius: 6px;
          cursor: pointer; transition: all 0.08s;
        }
        .tw-comment:hover { background: rgba(0,0,0,0.015); }
        .tw-comment.expanded { background: var(--warm-50); border: 1px solid var(--warm-200); margin: 4px -12px; }
        .tw-comment-avatar {
          width: 28px; height: 28px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .tw-comment-body { flex: 1; min-width: 0; }
        .tw-comment-head { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
        .tw-comment-author { font-size: 12px; font-weight: 500; color: var(--ink-700); font-family: 'Outfit', sans-serif; }
        .tw-comment-time { font-size: 10px; color: var(--ink-300); }
        .tw-comment-project { font-size: 9px; color: var(--ink-300); background: var(--warm-100); padding: 0 5px; border-radius: 2px; }
        .tw-comment-text {
          color: var(--ink-600); font-style: italic;
          line-height: 1.5; font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
        }
        .tw-comment-reply-input {
          display: flex; gap: 6px; margin-top: 8px; padding-top: 8px;
          border-top: 1px solid var(--warm-200);
        }
        .tw-comment-reply-input input {
          flex: 1; padding: 6px 10px; border: 1px solid var(--warm-200);
          border-radius: 5px; font-family: inherit; font-size: 12px;
          color: var(--ink-700); outline: none; background: #fff;
        }
        .tw-comment-reply-input input:focus { border-color: var(--ember); }
        .tw-comment-reply-input input::placeholder { color: var(--warm-400); }
        .tw-comment-reply-send {
          padding: 6px 12px; border-radius: 5px; border: none;
          background: var(--ember); color: #fff; font-size: 11px;
          font-family: inherit; cursor: pointer;
        }

        .tw-event { display: flex; align-items: center; gap: 10px; padding: 3px 0; font-size: 12.5px; }
        .tw-event-time { color: var(--ink-300); width: 48px; text-align: right; flex-shrink: 0; }
        .tw-event-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .tw-event-text { color: var(--ink-600); }
        .tw-event.now .tw-event-time { color: var(--ember); font-weight: 500; }
        .tw-event.now .tw-event-dot { background: var(--ember); box-shadow: 0 0 0 3px rgba(176,125,79,0.12); }
        .tw-event.now .tw-event-text { color: var(--ink-800); font-weight: 500; }
        .tw-event.past .tw-event-time { color: var(--ink-300); }
        .tw-event.past .tw-event-text { color: var(--ink-400); text-decoration: line-through; text-decoration-color: var(--warm-300); }
        .tw-event.past .tw-event-dot { background: var(--warm-300); }

        .tw-away {
          display: flex; align-items: center; gap: 8px;
          padding: 3px 0; font-size: 12px; color: var(--ink-500);
        }
        .tw-away-icon { font-size: 11px; width: 16px; text-align: center; flex-shrink: 0; }
        .tw-away-val { font-weight: 500; color: var(--ink-700); }

        .tw-prompt-text {
          color: var(--ink-400); font-size: 13px; margin-top: 12px;
          font-style: italic; font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
        }

        .tw-input-area { margin-top: 14px; position: relative; }
        .tw-suggestions {
          position: absolute; bottom: calc(100% + 6px); left: 0; right: 0;
          background: #fff; border: 1px solid var(--warm-200); border-radius: 10px;
          padding: 4px; box-shadow: 0 -4px 20px rgba(0,0,0,0.06); z-index: 10;
        }
        .tw-sug {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 12px; border-radius: 6px; cursor: pointer;
          transition: background 0.06s;
        }
        .tw-sug:hover, .tw-sug.on { background: var(--ember-bg); }
        .tw-sug-icon {
          width: 26px; height: 26px; border-radius: 6px;
          background: var(--warm-100); border: 1px solid var(--warm-200);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; color: var(--ink-500); flex-shrink: 0;
        }
        .tw-sug.on .tw-sug-icon { background: var(--ember-bg); border-color: rgba(176,125,79,0.12); color: var(--ember); }
        .tw-sug-info { flex: 1; }
        .tw-sug-cmd { font-size: 12.5px; color: var(--ink-800); font-weight: 500; display: flex; align-items: center; gap: 6px; }
        .tw-sug-hot { font-size: 8px; color: var(--ember); background: var(--ember-bg); padding: 0 4px; border-radius: 2px; border: 1px solid rgba(176,125,79,0.1); font-weight: 600; letter-spacing: 0.04em; }
        .tw-sug-desc { font-size: 11px; color: var(--ink-400); font-family: 'Outfit', sans-serif; }
        .tw-sug-tab {
          font-size: 9px; color: var(--ink-300); background: var(--warm-100);
          border: 1px solid var(--warm-200); border-radius: 3px;
          padding: 1px 5px; opacity: 0; transition: opacity 0.08s; flex-shrink: 0;
        }
        .tw-sug.on .tw-sug-tab { opacity: 1; }

        .tw-input-row {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 16px; background: #fff;
          border: 1px solid var(--warm-200); border-radius: 10px;
          transition: all 0.15s;
        }
        .tw-input-row.focused { border-color: var(--ember); box-shadow: 0 0 0 3px rgba(176,125,79,0.06); }
        .tw-prompt-char { color: var(--ember); font-weight: 600; font-size: 15px; flex-shrink: 0; }
        .tw-input {
          flex: 1; border: none; outline: none; font-family: var(--mono);
          font-size: 13px; color: var(--ink-800); background: transparent;
        }
        .tw-input::placeholder { color: var(--warm-400); }
        .tw-input-hints { display: flex; gap: 4px; flex-shrink: 0; }
        .tw-kbd { font-size: 9px; color: var(--ink-300); background: var(--warm-100); border: 1px solid var(--warm-200); border-radius: 3px; padding: 1px 5px; }

        .tw-executed { margin-top: 14px; animation: lineIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) both; }
        .tw-exec-cmd { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .tw-exec-prompt { color: var(--ember); font-weight: 600; }
        .tw-exec-text { color: var(--ink-800); font-weight: 500; }
        .tw-exec-output {
          padding: 12px 14px; border-radius: 8px;
          background: rgba(0,0,0,0.015); border: 1px solid var(--warm-100);
          white-space: pre-wrap; line-height: 1.6; font-size: 12px;
          color: var(--ink-600); display: flex; gap: 10px; align-items: flex-start;
        }
        .tw-exec-icon {
          width: 24px; height: 24px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; flex-shrink: 0;
        }
        .tw-exec-spinner { display: flex; gap: 3px; padding: 10px 0; }
        .tw-exec-spinner span { width: 4px; height: 4px; border-radius: 50%; background: var(--ember); animation: dotPulse 1s ease infinite; }
        .tw-exec-spinner span:nth-child(2) { animation-delay: 0.15s; }
        .tw-exec-spinner span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes dotPulse { 0%, 60%, 100% { opacity: 0.2; } 30% { opacity: 1; } }

        .tw-footer {
          padding: 8px 60px; display: flex; align-items: center;
          justify-content: space-between; font-size: 10px; color: var(--ink-300);
          border-top: 1px solid var(--warm-100); position: relative; z-index: 1;
          background: var(--parchment); flex-shrink: 0;
        }
        .tw-footer-left { display: flex; align-items: center; gap: 8px; }
        .tw-footer-dot { width: 5px; height: 5px; border-radius: 50%; background: #5a9a3c; }
      `}</style>

      <div className="tw">
        <EmberParticles />

        <div className="tw-scroll" ref={scrollRef}>
          <div className="tw-content">
            {/* Greeting */}
            <div className={`tw-line${phase >= 1 ? " visible" : ""}`}>
              <div className="tw-greeting">{greeting}. <em>let&apos;s build.</em></div>
            </div>

            <div className={`tw-line${phase >= 1 ? " visible" : ""}`} style={{ transitionDelay: "80ms" }}>
              <div className="tw-date-row">
                <span>{dateStr}</span>
                <span>&middot;</span>
                <span className="tw-streak"><span className="tw-streak-fire">&#x1f525;</span> {streak}-day streak</span>
              </div>
            </div>

            {/* Focus suggestion */}
            <div className={`tw-line${phase >= 2 ? " visible" : ""}`}>
              <div className="tw-focus" onClick={() => executeCommand("open brand-guidelines")}>
                <div className="tw-focus-icon">&#x25c6;</div>
                <div className="tw-focus-body">
                  <div className="tw-focus-label">suggested focus</div>
                  <div className="tw-focus-text">Continue Brand Guidelines v2</div>
                  <div className="tw-focus-sub">Typography section &middot; 65% complete &middot; due in 5 days &middot; last edited 2m ago</div>
                </div>
                <span className="tw-focus-kbd">&#x23ce;</span>
              </div>
            </div>

            {/* Status */}
            <div className={`tw-line${phase >= 3 ? " visible" : ""}`}><div className="tw-section">STATUS</div></div>
            <div className={`tw-line${phase >= 3 ? " visible" : ""}`} style={{ transitionDelay: "80ms" }}>
              <div className="tw-stat">
                <span className="tw-stat-label">active projects</span>
                <span className="tw-stat-val" style={{ color: "#5a9a3c" }}>{activeCount}</span>
              </div>
            </div>
            <div className={`tw-line${phase >= 3 ? " visible" : ""}`} style={{ transitionDelay: "160ms" }}>
              <div className="tw-stat">
                <span className="tw-stat-label">in review</span>
                <span className="tw-stat-val" style={{ color: "#b07d4f" }}>{reviewCount}</span>
              </div>
            </div>
            <div className={`tw-line${phase >= 3 ? " visible" : ""}`} style={{ transitionDelay: "240ms" }}>
              <div className="tw-stat">
                <span className="tw-stat-label">overdue</span>
                <span className="tw-stat-val" style={{ color: "#c24b38" }}>{overdueCount}</span>
                <span className="tw-stat-badge" style={{ background: "rgba(194,75,56,0.06)", color: "#c24b38" }}>NEEDS ACTION</span>
              </div>
            </div>

            {/* Revenue */}
            <div className={`tw-line${phase >= 4 ? " visible" : ""}`}><div className="tw-section">REVENUE</div></div>
            <div className={`tw-line${phase >= 4 ? " visible" : ""}`} style={{ transitionDelay: "80ms" }}>
              <div className="tw-stat">
                <span className="tw-stat-label">earned this month</span>
                <span className="tw-stat-val" style={{ color: "#5a9a3c" }}>${totalEarned.toLocaleString()}</span>
                <span className="tw-stat-badge" style={{ background: "rgba(90,154,60,0.06)", color: "#5a9a3c" }}>+40% VS FEB</span>
              </div>
            </div>
            <div className={`tw-line${phase >= 4 ? " visible" : ""}`} style={{ transitionDelay: "160ms" }}>
              <div className="tw-stat">
                <span className="tw-stat-label">pending payment</span>
                <span className="tw-stat-val" style={{ color: "#b07d4f" }}>${totalPending.toLocaleString()}</span>
              </div>
            </div>
            <div className={`tw-line${phase >= 4 ? " visible" : ""}`} style={{ transitionDelay: "240ms" }}>
              <div className="tw-stat">
                <span className="tw-stat-label">total pipeline</span>
                <span className="tw-stat-val" style={{ color: "var(--ink-800)" }}>${pipeline.toLocaleString()}</span>
              </div>
            </div>
            <div className={`tw-line${phase >= 5 ? " visible" : ""}`}>
              <div className="tw-insight">
                <span className="tw-insight-icon">&nearr;</span>
                You&apos;re $200 away from your $15k monthly goal &mdash; best month since October
              </div>
            </div>

            {/* Attention */}
            <div className={`tw-line${phase >= 6 ? " visible" : ""}`}><div className="tw-section">ATTENTION</div></div>
            <div className={`tw-line${phase >= 6 ? " visible" : ""}`} style={{ transitionDelay: "80ms" }}>
              <div className="tw-alert">
                <div className="tw-alert-icon" style={{ background: "rgba(194,75,56,0.06)", color: "#c24b38" }}>!</div>
                <div className="tw-alert-body">
                  <div className="tw-alert-text">Bolt Fitness &mdash; App Onboarding UX is 4 days overdue</div>
                  <div className="tw-alert-sub">70% complete &middot; $4,000 &middot; Last activity: 3 days ago</div>
                </div>
                <div className="tw-alert-actions">
                  <button className="tw-alert-act primary" onClick={(e) => { e.stopPropagation(); executeCommand("open app-onboarding"); }}>Open</button>
                  <button className="tw-alert-act" onClick={(e) => { e.stopPropagation(); executeCommand("send reminder --client bolt"); }}>Remind</button>
                </div>
              </div>
            </div>
            <div className={`tw-line${phase >= 7 ? " visible" : ""}`}>
              <div className="tw-alert">
                <div className="tw-alert-icon" style={{ background: "rgba(176,125,79,0.06)", color: "#b07d4f" }}>&rarr;</div>
                <div className="tw-alert-body">
                  <div className="tw-alert-text">Brand Guidelines v2 &mdash; due in 5 days (65% complete)</div>
                  <div className="tw-alert-sub">Typography section active &middot; Sarah reviewed yesterday</div>
                </div>
                <div className="tw-alert-actions">
                  <button className="tw-alert-act primary">Open</button>
                </div>
              </div>
            </div>
            <div className={`tw-line${phase >= 7 ? " visible" : ""}`} style={{ transitionDelay: "80ms" }}>
              <div className="tw-alert">
                <div className="tw-alert-icon" style={{ background: "rgba(90,154,60,0.06)", color: "#5a9a3c" }}>$</div>
                <div className="tw-alert-body">
                  <div className="tw-alert-text">Invoice #047 &mdash; $2,400 sent, awaiting payment</div>
                  <div className="tw-alert-sub">Meridian Studio &middot; Viewed 2x by sarah@ &middot; Sent 3h ago</div>
                </div>
                <div className="tw-alert-actions">
                  <button className="tw-alert-act">Track</button>
                </div>
              </div>
            </div>

            {/* While you were away */}
            <div className={`tw-line${phase >= 8 ? " visible" : ""}`}><div className="tw-section">SINCE LAST SESSION</div></div>
            <div className={`tw-line${phase >= 8 ? " visible" : ""}`} style={{ transitionDelay: "80ms" }}>
              <div className="tw-away"><span className="tw-away-icon" style={{ color: "#5a9a3c" }}>$</span> <span className="tw-away-val">$1,800</span> payment received from Nora Kim</div>
            </div>
            <div className={`tw-line${phase >= 8 ? " visible" : ""}`} style={{ transitionDelay: "160ms" }}>
              <div className="tw-away"><span className="tw-away-icon" style={{ color: "#5b7fa4" }}>&#x25ce;</span> Proposal viewed <span className="tw-away-val">3x</span> by nora@coachkim.com</div>
            </div>
            <div className={`tw-line${phase >= 8 ? " visible" : ""}`} style={{ transitionDelay: "240ms" }}>
              <div className="tw-away"><span className="tw-away-icon" style={{ color: "#b07d4f" }}>&#x2713;</span> Nora <span className="tw-away-val">signed</span> the Course Landing Page proposal</div>
            </div>

            {/* Comments */}
            <div className={`tw-line${phase >= 9 ? " visible" : ""}`}><div className="tw-section">RECENT COMMENTS</div></div>
            <div className={`tw-line${phase >= 9 ? " visible" : ""}`} style={{ transitionDelay: "80ms" }}>
              <div className={`tw-comment${expandedComment === 1 ? " expanded" : ""}`}
                onClick={() => setExpandedComment(expandedComment === 1 ? null : 1)}>
                <div className="tw-comment-avatar" style={{ background: "#8a7e63" }}>S</div>
                <div className="tw-comment-body">
                  <div className="tw-comment-head">
                    <span className="tw-comment-author">Sarah Chen</span>
                    <span className="tw-comment-time">2m ago</span>
                    <span className="tw-comment-project">Brand Guidelines</span>
                  </div>
                  <div className="tw-comment-text">Can we make the logo usage section more specific? I want exact minimum sizes.</div>
                  {expandedComment === 1 && (
                    <div className="tw-comment-reply-input" onClick={e => e.stopPropagation()}>
                      <input placeholder="Reply to Sarah..." value={replyText} onChange={e => setReplyText(e.target.value)} />
                      <button className="tw-comment-reply-send">Reply</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={`tw-line${phase >= 9 ? " visible" : ""}`} style={{ transitionDelay: "160ms" }}>
              <div className={`tw-comment${expandedComment === 2 ? " expanded" : ""}`}
                onClick={() => setExpandedComment(expandedComment === 2 ? null : 2)}>
                <div className="tw-comment-avatar" style={{ background: "#7c8594" }}>J</div>
                <div className="tw-comment-body">
                  <div className="tw-comment-head">
                    <span className="tw-comment-author">Jamie Park</span>
                    <span className="tw-comment-time">15m ago</span>
                    <span className="tw-comment-project">Brand Guidelines</span>
                  </div>
                  <div className="tw-comment-text">I&apos;d suggest adding a &ldquo;don&apos;t&rdquo; section with misuse examples.</div>
                  {expandedComment === 2 && (
                    <div className="tw-comment-reply-input" onClick={e => e.stopPropagation()}>
                      <input placeholder="Reply to Jamie..." />
                      <button className="tw-comment-reply-send">Reply</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Today */}
            <div className={`tw-line${phase >= 10 ? " visible" : ""}`}><div className="tw-section">TODAY</div></div>
            <div className={`tw-line${phase >= 10 ? " visible" : ""}`} style={{ transitionDelay: "80ms" }}>
              <div className="tw-event past"><span className="tw-event-time">09:00</span><span className="tw-event-dot" /><span className="tw-event-text">Brand review call &mdash; Meridian Studio</span></div>
            </div>
            <div className={`tw-line${phase >= 10 ? " visible" : ""}`} style={{ transitionDelay: "160ms" }}>
              <div className="tw-event now"><span className="tw-event-time">11:30</span><span className="tw-event-dot" /><span className="tw-event-text">Now &mdash; deep work block</span></div>
            </div>
            <div className={`tw-line${phase >= 10 ? " visible" : ""}`} style={{ transitionDelay: "240ms" }}>
              <div className="tw-event"><span className="tw-event-time">14:00</span><span className="tw-event-dot" style={{ background: "var(--warm-300)" }} /><span className="tw-event-text">Nora kickoff call &mdash; Course Landing Page</span></div>
            </div>

            {/* Prompt */}
            <div className={`tw-line${phase >= 11 ? " visible" : ""}`}>
              <div className="tw-prompt-text">Ready when you are.</div>
            </div>

            {/* Executed command */}
            {executedCmd && (
              <div className="tw-executed">
                <div className="tw-exec-cmd">
                  <span className="tw-exec-prompt">&#x276f;</span>
                  <span className="tw-exec-text">{executedCmd}</span>
                </div>
                {!cmdOutput ? (
                  <div className="tw-exec-spinner"><span /><span /><span /></div>
                ) : (
                  <div className="tw-exec-output">
                    <div className="tw-exec-icon" style={{ background: cmdOutput.color + "0a", color: cmdOutput.color, border: `1px solid ${cmdOutput.color}15` }}>{cmdOutput.icon}</div>
                    <span>{cmdOutput.text}</span>
                  </div>
                )}
              </div>
            )}

            {/* Command input */}
            <div className={`tw-line${phase >= 12 ? " visible" : ""}`}>
              <div className="tw-input-area">
                {showSuggestions && filtered.length > 0 && (
                  <div className="tw-suggestions">
                    {filtered.map((s, i) => (
                      <div key={i} className={`tw-sug${suggIdx === i ? " on" : ""}`}
                        onClick={() => executeCommand(s.cmd)}
                        onMouseEnter={() => setSuggIdx(i)}>
                        <div className="tw-sug-icon">{s.icon}</div>
                        <div className="tw-sug-info">
                          <div className="tw-sug-cmd">
                            {s.cmd}
                            {s.hot && <span className="tw-sug-hot">HOT</span>}
                          </div>
                          <div className="tw-sug-desc">{s.desc}</div>
                        </div>
                        <span className="tw-sug-tab">tab</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className={`tw-input-row${inputFocused ? " focused" : ""}`}>
                  <span className="tw-prompt-char">&#x276f;</span>
                  <input ref={inputRef} className="tw-input" value={inputValue}
                    onChange={e => { setInputValue(e.target.value); setShowSuggestions(true); setSuggIdx(0); }}
                    onFocus={() => { setInputFocused(true); setShowSuggestions(true); }}
                    onBlur={() => { setInputFocused(false); setTimeout(() => setShowSuggestions(false), 150); }}
                    onKeyDown={handleKeyDown}
                    placeholder="type a command..."
                    autoComplete="off" spellCheck={false} />
                  <div className="tw-input-hints">
                    <span className="tw-kbd">&uarr;&darr;</span>
                    <span className="tw-kbd">tab</span>
                    <span className="tw-kbd">&#x23ce;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tw-footer">
          <div className="tw-footer-left">
            <span className="tw-footer-dot" />
            <span>felmark v0.1.0</span>
            <span>&middot;</span>
            <span>4 workspaces &middot; 8 projects</span>
          </div>
          <span>{mounted ? `${dateStr} \u00b7 ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}` : "\u00a0"}</span>
        </div>
      </div>
    </>
  );
}
