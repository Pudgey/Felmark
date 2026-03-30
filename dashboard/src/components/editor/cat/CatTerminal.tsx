"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./CatTerminal.module.css";

interface CatTerminalProps {
  open: boolean;
  onClose: () => void;
}

const CAT_FRAMES: Record<string, string[]> = {
  idle: ["  /\\_/\\  ", " ( o.o ) ", "  > ^ <  "],
  walk1: ["  /\\_/\\  ", " ( o.o ) ", " /|   |\\ ", "(_|   |_)"],
  walk2: ["  /\\_/\\  ", " ( o.o ) ", "  |   |/ ", " (_   _) "],
  sit: ["  /\\_/\\  ", " ( -.– ) ", " /     \\ ", "(  . .  )", " \"\"\" \"\"\" "],
  sleep: ["  /\\_/\\  ", " ( –.– ) ", "  /| |\\  ", " (_/ \\_) ", "   z z z "],
  knock: ["  /\\_/\\  ", " ( ◉.◉ )╯", "  |   |  ", " /|   |\\ "],
  pounce: ["   /\\_/\\ ", "  ( ⊙.⊙ )", " ━━━╋━━━ ", "   / \\   "],
  happy: ["  /\\_/\\  ", " ( ^.^ ) ", "  > ^ <  ", "  ♡   ♡  "],
  loaf: ["  /\\_/\\  ", " ( -.– ) ", " |     | ", " |_____| "],
};

const CAT_WISDOM = [
  "A proposal left unsent is a deal left unearned.",
  "Your rate is not a suggestion. It's a boundary.",
  "The best time to follow up was yesterday. The second best time is now.",
  "Scope creep is just kindness without a contract.",
  "Every hour you don't track is money you're donating.",
  "A brand isn't what you say it is. It's what they feel it is.",
  "The client who haggles on price will haggle on everything.",
  "Your portfolio is only as good as your worst piece. Remove it.",
  "Charge more. You're worth it. I'm a cat, I would know.",
  "The best invoice is the one that's already paid.",
  "Rest is not the opposite of productivity. It's the source of it.",
  "Ship it. Then fix it. Perfection is procrastination in a fancy hat.",
  "If they can't afford you, they can't afford what you'll build them.",
  "A good contract saves friendships. A great contract saves businesses.",
  "Take a break. I'll watch the cursor for you.",
  "Remember: even I nap 16 hours a day and still get everything done.",
];

interface Line { id: number; content: string; type: string }

export default function CatTerminal({ open, onClose }: CatTerminalProps) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [catState, setCatState] = useState("idle");
  const [catX, setCatX] = useState(0);
  const [showCat, setShowCat] = useState(false);
  const [pawPrints, setPawPrints] = useState<{ x: number; id: number }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines, showCat]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      if (lines.length === 0) {
        setLines([
          { id: 1, content: "  Felmark Terminal v1.0", type: "system" },
          { id: 2, content: "", type: "spacer" },
          { id: 3, content: "  /\\_/\\", type: "cat-ascii-line" },
          { id: 4, content: " ( o.o )  meow. you found the easter egg.", type: "cat-ascii-line" },
          { id: 5, content: "  > ^ <", type: "cat-ascii-line" },
          { id: 6, content: "", type: "spacer" },
          { id: 7, content: "  Commands:", type: "help-label" },
          { id: 8, content: "    /cat walk       Walk across your document, drop wisdom", type: "help-item" },
          { id: 9, content: "    /cat knock      Knock your proposal off the desk", type: "help-item" },
          { id: 10, content: "    /cat nap        Fall asleep on your work", type: "help-item" },
          { id: 11, content: "    /cat hunt       Hunt your cursor", type: "help-item" },
          { id: 12, content: "    /cat fortune    Freelancer oracle wisdom", type: "help-item" },
          { id: 13, content: "    /cat pet        Pet the cat", type: "help-item" },
          { id: 14, content: "    /cat mood       Check the cat's mood", type: "help-item" },
          { id: 15, content: "    clear           Reset terminal", type: "help-item" },
          { id: 16, content: "    exit            Close", type: "help-item" },
          { id: 17, content: "", type: "spacer" },
          { id: 18, content: "  The cat does not answer to you. The cat answers to no one.", type: "help-footer" },
          { id: 19, content: "", type: "spacer" },
        ]);
      }
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [open]);

  const addLine = useCallback((content: string, type = "output") => {
    setLines(prev => [...prev, { id: Date.now() + Math.random(), content, type }]);
  }, []);

  const walkCat = useCallback((startX: number, endX: number, onDone?: () => void) => {
    let x = startX;
    const dir = endX > startX ? 1 : -1;
    const step = () => {
      x += dir * 2;
      setCatX(x);
      setCatState(x % 4 < 2 ? "walk1" : "walk2");
      if (Math.random() > 0.85) setPawPrints(prev => [...prev.slice(-12), { x, id: Date.now() }]);
      if ((dir > 0 && x < endX) || (dir < 0 && x > endX)) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setCatState("idle");
        onDone?.();
      }
    };
    animRef.current = requestAnimationFrame(step);
  }, []);

  const runCatSequence = useCallback((variant: string) => {
    setShowCat(true);
    setPawPrints([]);

    if (variant === "walk") {
      setCatX(0); setCatState("walk1");
      addLine("", "spacer");
      setTimeout(() => {
        walkCat(0, 52, () => {
          setCatState("sit");
          setTimeout(() => {
            const wisdom = CAT_WISDOM[Math.floor(Math.random() * CAT_WISDOM.length)];
            addLine("", "spacer");
            addLine(`  💬 ${wisdom}`, "cat-speech");
            addLine("", "spacer");
            setCatState("happy");
            setTimeout(() => setCatState("loaf"), 3000);
          }, 800);
        });
      }, 200);
    } else if (variant === "knock") {
      setCatX(30); setCatState("idle");
      addLine("", "spacer");
      setTimeout(() => {
        setCatState("knock");
        addLine("  *knocks your proposal off the desk*", "cat-action");
        setTimeout(() => {
          addLine("", "spacer");
          addLine(" ┌───────────────────────┐", "knocked");
          addLine(" │ P R O P O S A L      │▒", "knocked");
          addLine(" │ Brand Guidelines v2  │▒", "knocked-fall");
          addLine(" │ $4,800               │▒", "knocked-fall");
          addLine(" └───────────────────────┘▒", "knocked-fall");
          addLine("", "spacer");
          addLine("         *thud*", "cat-action");
          setTimeout(() => { setCatState("happy"); addLine("  ...the cat shows no remorse.", "cat-narration"); }, 600);
        }, 500);
      }, 400);
    } else if (variant === "nap") {
      setCatX(20); setCatState("sit");
      addLine("", "spacer");
      setTimeout(() => {
        addLine("  *the cat settles onto your document*", "cat-action");
        setCatState("sleep");
        setTimeout(() => {
          addLine("", "spacer");
          addLine(" ░░░░░░░░░░░░░░░░░░░░░░░░░", "nap-blanket");
          addLine(" ░  z z z                 ░", "nap-z");
          addLine(" ░       ╱ᐠ｡ꞈ｡ᐟ╲        ░", "nap-cat");
          addLine(" ░      (  ___  )        ░", "nap-cat");
          addLine(" ░  [doc is blocked]     ░", "nap-blocked");
          addLine(" ░░░░░░░░░░░░░░░░░░░░░░░░░", "nap-blanket");
          addLine("", "spacer");
          setTimeout(() => { addLine("  You can't move the cat. No one can move the cat.", "cat-narration"); }, 500);
        }, 600);
      }, 400);
    } else if (variant === "hunt") {
      setCatX(5); setCatState("idle");
      addLine("", "spacer");
      addLine("  *the cat notices your cursor*", "cat-action");
      setTimeout(() => {
        setCatState("pounce");
        addLine("      ◉_◉", "cat-eyes");
        addLine("       │    ↖ cursor", "cat-hunt");
        addLine("       ╰── ◆", "cat-hunt");
        setTimeout(() => {
          addLine("  *wiggles*", "cat-action");
          setTimeout(() => {
            addLine("", "spacer");
            addLine(" ━━━╋━━━ POUNCE!", "cat-pounce");
            addLine("  ╱( ⊙.⊙ )╲", "cat-pounce");
            addLine(" *caught it*", "cat-action");
            setTimeout(() => { setCatState("happy"); addLine("  You're welcome. 🐾", "cat-speech"); }, 400);
          }, 700);
        }, 500);
      }, 600);
    } else if (variant === "fortune") {
      setCatX(25); setCatState("sit");
      addLine("", "spacer");
      addLine(" 🐱 Freelancer Oracle", "fortune-header");
      addLine(" ─────────────────────────", "fortune-box");
      const wisdom = CAT_WISDOM[Math.floor(Math.random() * CAT_WISDOM.length)];
      addLine(` "${wisdom}"`, "fortune-text");
      addLine("", "spacer");
      addLine(` Lucky number: $${(Math.floor(Math.random() * 15) + 3)},000`, "fortune-lucky");
      addLine(" ─────────────────────────", "fortune-box");
      setTimeout(() => setCatState("happy"), 300);
    } else {
      setCatX(24); setCatState("idle");
      addLine("", "spacer");
      addLine("  meow.", "cat-speech");
    }
  }, [addLine, walkCat]);

  const handleCommand = (cmd: string) => {
    addLine(`❯ ${cmd}`, "command");
    const t = cmd.trim().toLowerCase();

    if (t === "/cat" || t === "cat") {
      addLine("", "spacer");
      addLine("  🐾 /cat — Felmark's resident feline", "help-title");
      addLine("", "spacer");
      addLine("    /cat walk      The cat walks across your document", "help-item");
      addLine("    /cat knock     The cat knocks your proposal off the desk", "help-item");
      addLine("    /cat nap       The cat falls asleep on your work", "help-item");
      addLine("    /cat hunt      The cat hunts your cursor", "help-item");
      addLine("    /cat fortune   Receive wisdom from the freelancer oracle", "help-item");
      addLine("    /cat pet       Pet the cat", "help-item");
      addLine("    /cat mood      Check how the cat is feeling", "help-item");
      addLine("", "spacer");
      addLine("  The cat does not answer to you. The cat answers to no one.", "help-footer");
      setShowCat(true); setCatX(24); setCatState("idle");
    } else if (t === "/cat walk" || t === "cat walk") { runCatSequence("walk"); }
    else if (t === "/cat knock" || t === "cat knock") { runCatSequence("knock"); }
    else if (t === "/cat nap" || t === "cat nap") { runCatSequence("nap"); }
    else if (t === "/cat hunt" || t === "cat hunt") { runCatSequence("hunt"); }
    else if (t === "/cat fortune" || t === "cat fortune") { runCatSequence("fortune"); }
    else if (t === "/cat pet" || t === "cat pet") {
      setShowCat(true); setCatX(24); setCatState("happy");
      addLine("", "spacer");
      addLine("  *purrrrrrrr*", "cat-action");
      setTimeout(() => { addLine("  The cat appreciates this. Your next invoice will be paid on time.", "cat-narration"); addLine("  (Probably.)", "cat-narration"); }, 500);
    } else if (t === "/cat mood" || t === "cat mood") {
      const moods = [
        { mood: "Chaotic neutral", face: "◉_◉", desc: "Eyeing your deadline with malicious intent" },
        { mood: "Productively lazy", face: "–.–", desc: "Doing nothing, but doing it efficiently" },
        { mood: "Aggressively cozy", face: "^.^", desc: "Napping on your most important document" },
        { mood: "Suspiciously helpful", face: "o.o", desc: "Might actually let you work today" },
        { mood: "Unhinged", face: "⊙.⊙", desc: "3 AM energy at 2 PM" },
      ];
      const m = moods[Math.floor(Math.random() * moods.length)];
      addLine("", "spacer");
      addLine(`  Current mood: ${m.mood}`, "cat-mood");
      addLine(`  Face: ( ${m.face} )`, "cat-face");
      addLine(`  Status: ${m.desc}`, "cat-narration");
      setShowCat(true); setCatX(24); setCatState("idle");
    } else if (t === "clear" || t === "reset" || t === "/clear" || t === "/reset") {
      setShowCat(false); setPawPrints([]);
      setLines([
        { id: Date.now(), content: "  Felmark Terminal v1.0", type: "system" },
        { id: Date.now() + 1, content: "", type: "spacer" },
        { id: Date.now() + 2, content: "  /\\_/\\", type: "cat-ascii-line" },
        { id: Date.now() + 3, content: " ( o.o )  meow. you found the easter egg.", type: "cat-ascii-line" },
        { id: Date.now() + 4, content: "  > ^ <", type: "cat-ascii-line" },
        { id: Date.now() + 5, content: "", type: "spacer" },
        { id: Date.now() + 6, content: "  Commands:", type: "help-label" },
        { id: Date.now() + 7, content: "    /cat walk       Walk across your document, drop wisdom", type: "help-item" },
        { id: Date.now() + 8, content: "    /cat knock      Knock your proposal off the desk", type: "help-item" },
        { id: Date.now() + 9, content: "    /cat nap        Fall asleep on your work", type: "help-item" },
        { id: Date.now() + 10, content: "    /cat hunt       Hunt your cursor", type: "help-item" },
        { id: Date.now() + 11, content: "    /cat fortune    Freelancer oracle wisdom", type: "help-item" },
        { id: Date.now() + 12, content: "    /cat pet        Pet the cat", type: "help-item" },
        { id: Date.now() + 13, content: "    /cat mood       Check the cat's mood", type: "help-item" },
        { id: Date.now() + 14, content: "    clear           Reset terminal", type: "help-item" },
        { id: Date.now() + 15, content: "    exit            Close", type: "help-item" },
        { id: Date.now() + 16, content: "", type: "spacer" },
        { id: Date.now() + 17, content: "  The cat does not answer to you. The cat answers to no one.", type: "help-footer" },
        { id: Date.now() + 18, content: "", type: "spacer" },
      ]);
      return;
    } else if (t === "exit" || t === "quit" || t === "q" || t === "/exit" || t === "/quit") {
      onClose(); return;
    } else if (t.startsWith("/cat")) {
      setShowCat(true); setCatX(24); setCatState("idle");
      addLine("  The cat stares at you blankly. Type /cat for commands.", "cat-narration");
    } else {
      addLine(`  Command not found: ${cmd}. Type /cat to summon the cat.`, "help-footer");
    }
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    handleCommand(input);
    setInput("");
  };

  if (!open) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <span className={styles.headIcon}>🐾</span>
        <span className={styles.headTitle}>$cat</span>
        <span className={styles.headBadge}>Easter egg</span>
        <button className={styles.closeBtn} onClick={onClose}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
        </button>
      </div>

      <div className={styles.output} ref={scrollRef}>
        {lines.map(line => (
          <div key={line.id} className={`${styles.line} ${styles[line.type] || ""}`}>{line.content}</div>
        ))}
        {showCat && CAT_FRAMES[catState] && (
          <div className={styles.catAscii} style={{ paddingLeft: `${catX * 6}px` }}>
            {CAT_FRAMES[catState].map((line, i) => <div key={i}>{line}</div>)}
          </div>
        )}
        {pawPrints.length > 0 && (
          <div className={styles.paws}>
            {pawPrints.map((p, i) => <span key={p.id} className={styles.paw} style={{ marginLeft: i === 0 ? p.x * 3 : 4 }}>🐾</span>)}
          </div>
        )}
      </div>

      <div className={`${styles.inputArea} ${input.startsWith("/") || input.startsWith("$") ? styles.inputAreaActive : ""}`}>
        <span className={`${styles.prompt} ${input.startsWith("/") || input.startsWith("$") ? styles.promptActive : ""}`}>❯</span>
        <input ref={inputRef} className={`${styles.input} ${input.startsWith("/") || input.startsWith("$") ? styles.inputActive : ""}`} placeholder="/cat walk, /cat fortune..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }} />
        <button className={`${styles.send} ${input.startsWith("/") || input.startsWith("$") ? styles.sendActive : ""}`} onClick={handleSubmit}>↵</button>
      </div>

      <div className={styles.foot}>
        <span>No cats were harmed</span>
        <div className={styles.footHints}>
          <span><span className={styles.kbd}>⏎</span> run</span>
          <span><span className={styles.kbd}>⎋</span> close</span>
        </div>
      </div>
    </div>
  );
}
