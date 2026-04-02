import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   FELMARK /cat
   Every great product has an easter egg.
   This is ours.
   ═══════════════════════════════════════════ */

const CAT_FRAMES = {
  idle: [
    "  /\\_/\\  ",
    " ( o.o ) ",
    "  > ^ <  ",
  ],
  walk1: [
    "  /\\_/\\  ",
    " ( o.o ) ",
    " /|   |\\ ",
    "(_|   |_)",
  ],
  walk2: [
    "  /\\_/\\  ",
    " ( o.o ) ",
    "  |   |/ ",
    " (_   _) ",
  ],
  sit: [
    "  /\\_/\\  ",
    " ( -.– ) ",
    " /     \\ ",
    "(  . .  )",
    " \"\"\" \"\"\" ",
  ],
  sleep: [
    "  /\\_/\\  ",
    " ( –.– ) ",
    "  /| |\\  ",
    " (_/ \\_) ",
    "   z z z ",
  ],
  knock: [
    "  /\\_/\\  ",
    " ( ◉.◉ )╯",
    "  |   |  ",
    " /|   |\\ ",
  ],
  pounce: [
    "   /\\_/\\ ",
    "  ( ⊙.⊙ )",
    " ━━━╋━━━ ",
    "   / \\   ",
  ],
  happy: [
    "  /\\_/\\  ",
    " ( ^.^ ) ",
    "  > ^ <  ",
    "  ♡   ♡  ",
  ],
  loaf: [
    "  /\\_/\\  ",
    " ( -.– ) ",
    " |     | ",
    " |_____| ",
  ],
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

const PAW_PRINTS = ["🐾", "·", "◦", "·", "◦", "🐾"];

function TypeWriter({ text, speed = 35, onDone, style, className }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let idx = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      if (idx < text.length) {
        setDisplayed(text.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return <span style={style} className={className}>{displayed}</span>;
}

export default function CatCommand() {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [catState, setCatState] = useState("idle");
  const [catX, setCatX] = useState(0);
  const [showCat, setShowCat] = useState(false);
  const [pawPrints, setPawPrints] = useState([]);
  const [typing, setTyping] = useState(false);
  const [catMood, setCatMood] = useState("curious");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines, showCat]);

  const addLine = useCallback((content, type = "output") => {
    setLines(prev => [...prev, { id: Date.now() + Math.random(), content, type }]);
  }, []);

  const addLines = useCallback((contents, type = "output", delayMs = 80) => {
    contents.forEach((content, i) => {
      setTimeout(() => {
        addLine(content, type);
      }, i * delayMs);
    });
  }, [addLine]);

  // Cat walk animation
  const walkCat = useCallback((startX, endX, onDone) => {
    let x = startX;
    const dir = endX > startX ? 1 : -1;
    const step = () => {
      x += dir * 2;
      setCatX(x);
      setCatState(x % 4 < 2 ? "walk1" : "walk2");

      // Leave paw prints occasionally
      if (Math.random() > 0.85) {
        setPawPrints(prev => [...prev.slice(-12), { x, id: Date.now() }]);
      }

      if ((dir > 0 && x < endX) || (dir < 0 && x > endX)) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setCatState("idle");
        onDone?.();
      }
    };
    animRef.current = requestAnimationFrame(step);
  }, []);

  const runCatSequence = useCallback((variant) => {
    setShowCat(true);
    setPawPrints([]);

    if (variant === "walk") {
      setCatX(0);
      setCatState("walk1");
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
    }

    else if (variant === "knock") {
      setCatX(30);
      setCatState("idle");
      addLine("", "spacer");
      setTimeout(() => {
        setCatState("knock");
        addLine("  *knocks your proposal off the desk*", "cat-action");
        setTimeout(() => {
          addLine("", "spacer");
          addLine("  ┌─────────────────────────────────┐", "knocked");
          addLine("  │  P R O P O S A L                │▒", "knocked");
          addLine("  │  Brand Guidelines v2             │▒", "knocked-fall");
          addLine("  │  $4,800                          │▒", "knocked-fall");
          addLine("  └─────────────────────────────────┘▒", "knocked-fall");
          addLine("   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒", "knocked-shadow");
          addLine("", "spacer");
          addLine("         *thud*", "cat-action");
          addLine("", "spacer");
          setTimeout(() => {
            setCatState("happy");
            addLine("  ...the cat shows no remorse.", "cat-narration");
          }, 600);
        }, 500);
      }, 400);
    }

    else if (variant === "nap") {
      setCatX(20);
      setCatState("sit");
      addLine("", "spacer");
      setTimeout(() => {
        addLine("  *the cat settles onto your document*", "cat-action");
        setCatState("sleep");
        setTimeout(() => {
          addLine("", "spacer");
          addLine("  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░", "nap-blanket");
          addLine("  ░                                 ░", "nap-blanket");
          addLine("  ░   z z z                         ░", "nap-z");
          addLine("  ░          ╱ᐠ｡ꞈ｡ᐟ╲               ░", "nap-cat");
          addLine("  ░         (  ___  )               ░", "nap-cat");
          addLine("  ░          \"\"   \"\"                ░", "nap-cat");
          addLine("  ░                                 ░", "nap-blanket");
          addLine("  ░  [your document is blocked]     ░", "nap-blocked");
          addLine("  ░                                 ░", "nap-blanket");
          addLine("  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░", "nap-blanket");
          addLine("", "spacer");
          setTimeout(() => {
            addLine("  You can't move the cat. No one can move the cat.", "cat-narration");
            addLine("  The document will resume when the cat decides.", "cat-narration");
          }, 500);
        }, 600);
      }, 400);
    }

    else if (variant === "hunt") {
      setCatX(5);
      setCatState("idle");
      addLine("", "spacer");
      addLine("  *the cat notices your cursor*", "cat-action");
      setTimeout(() => {
        setCatState("pounce");
        addLine("", "spacer");
        addLine("          ◉_◉", "cat-eyes");
        addLine("           │         ↖ cursor", "cat-hunt");
        addLine("           │        ╱", "cat-hunt");
        addLine("           ╰──── ◆", "cat-hunt");
        addLine("", "spacer");
        setTimeout(() => {
          addLine("  *wiggles*", "cat-action");
          setTimeout(() => {
            addLine("", "spacer");
            addLine("  ━━━━━━━╋━━━━━━━━ POUNCE!", "cat-pounce");
            addLine("        ╱( ⊙.⊙ )╲", "cat-pounce");
            addLine("       ╱  > ◆ <  ╲", "cat-pounce");
            addLine("", "spacer");
            addLine("  *caught the cursor*", "cat-action");
            addLine("  *brings it to you as a gift*", "cat-action");
            setTimeout(() => {
              setCatState("happy");
              addLine("", "spacer");
              addLine("  You're welcome. 🐾", "cat-speech");
            }, 400);
          }, 700);
        }, 500);
      }, 600);
    }

    else if (variant === "fortune") {
      setCatX(25);
      setCatState("sit");
      addLine("", "spacer");
      addLine("  ┌─────────────────────────────────────────┐", "fortune-box");
      addLine("  │  🐱 FELMARK CAT — Freelancer Oracle     │", "fortune-header");
      addLine("  ├─────────────────────────────────────────┤", "fortune-box");
      const wisdom = CAT_WISDOM[Math.floor(Math.random() * CAT_WISDOM.length)];
      const padded = wisdom.length < 42 ? wisdom + " ".repeat(42 - wisdom.length) : wisdom;
      if (wisdom.length <= 42) {
        addLine(`  │  "${padded}" │`, "fortune-text");
      } else {
        const mid = wisdom.lastIndexOf(" ", 40);
        addLine(`  │  "${wisdom.slice(0, mid)}${" ".repeat(Math.max(0, 42 - mid - 1))} │`, "fortune-text");
        const line2 = wisdom.slice(mid + 1);
        addLine(`  │   ${line2}"${" ".repeat(Math.max(0, 41 - line2.length))} │`, "fortune-text");
      }
      addLine("  │                                         │", "fortune-box");
      addLine("  │  Lucky number: $" + (Math.floor(Math.random() * 15) + 3) + ",000" + " ".repeat(22) + "│", "fortune-lucky");
      addLine("  │  Lucky client: The next one who says yes │", "fortune-lucky");
      addLine("  └─────────────────────────────────────────┘", "fortune-box");
      addLine("", "spacer");
      setTimeout(() => setCatState("happy"), 300);
    }

    else {
      // Default: just show the cat
      setCatX(24);
      setCatState("idle");
      addLine("", "spacer");
      addLine("  meow.", "cat-speech");
    }
  }, [addLine, walkCat]);

  const handleCommand = (cmd) => {
    addLine(`❯ ${cmd}`, "command");

    const trimmed = cmd.trim().toLowerCase();

    if (trimmed === "/cat" || trimmed === "cat") {
      addLine("", "spacer");
      addLine("  🐾 /cat — Felmark's resident feline", "help-title");
      addLine("", "spacer");
      addLine("  Usage:", "help-label");
      addLine("    /cat walk      The cat walks across your document", "help-item");
      addLine("    /cat knock     The cat knocks your proposal off the desk", "help-item");
      addLine("    /cat nap       The cat falls asleep on your work", "help-item");
      addLine("    /cat hunt      The cat hunts your cursor", "help-item");
      addLine("    /cat fortune   Receive wisdom from the freelancer oracle", "help-item");
      addLine("    /cat mood      Check how the cat is feeling", "help-item");
      addLine("    /cat pet       Pet the cat", "help-item");
      addLine("", "spacer");
      addLine("  The cat does not answer to you. The cat answers to no one.", "help-footer");
      addLine("", "spacer");
      setShowCat(true);
      setCatX(24);
      setCatState("idle");
    }

    else if (trimmed === "/cat walk" || trimmed === "cat walk") {
      runCatSequence("walk");
    }

    else if (trimmed === "/cat knock" || trimmed === "cat knock") {
      runCatSequence("knock");
    }

    else if (trimmed === "/cat nap" || trimmed === "cat nap") {
      runCatSequence("nap");
    }

    else if (trimmed === "/cat hunt" || trimmed === "cat hunt") {
      runCatSequence("hunt");
    }

    else if (trimmed === "/cat fortune" || trimmed === "cat fortune") {
      runCatSequence("fortune");
    }

    else if (trimmed === "/cat pet" || trimmed === "cat pet") {
      setShowCat(true);
      setCatX(24);
      setCatState("happy");
      addLine("", "spacer");
      addLine("  *purrrrrrrr*", "cat-action");
      addLine("", "spacer");
      setTimeout(() => {
        addLine("  The cat appreciates this. Your next invoice will be paid on time.", "cat-narration");
        addLine("  (Probably.)", "cat-narration");
      }, 500);
    }

    else if (trimmed === "/cat mood" || trimmed === "cat mood") {
      const moods = [
        { mood: "Chaotic neutral", emoji: "◉_◉", desc: "Eyeing your deadline with malicious intent" },
        { mood: "Productively lazy", emoji: "–.–", desc: "Doing nothing, but doing it efficiently" },
        { mood: "Aggressively cozy", emoji: "^.^", desc: "Napping on your most important document" },
        { mood: "Suspiciously helpful", emoji: "o.o", desc: "Might actually let you work today" },
        { mood: "Unhinged", emoji: "⊙.⊙", desc: "3 AM energy at 2 PM" },
      ];
      const m = moods[Math.floor(Math.random() * moods.length)];
      addLine("", "spacer");
      addLine(`  Current mood: ${m.mood}`, "cat-mood-title");
      addLine(`  Face: ( ${m.emoji} )`, "cat-mood-face");
      addLine(`  Status: ${m.desc}`, "cat-mood-desc");
      addLine("", "spacer");
      setShowCat(true);
      setCatX(24);
      setCatState("idle");
    }

    else if (trimmed.startsWith("/cat")) {
      setShowCat(true);
      setCatX(24);
      setCatState("idle");
      addLine("", "spacer");
      addLine("  The cat stares at you blankly.", "cat-narration");
      addLine("  It does not understand this command.", "cat-narration");
      addLine("  It does not care to understand.", "cat-narration");
      addLine("", "spacer");
      addLine("  Type /cat for available commands.", "help-footer");
    }

    else if (trimmed === "clear") {
      setLines([]);
      setShowCat(false);
      setPawPrints([]);
      return;
    }

    else {
      addLine(`  Command not found: ${cmd}`, "error");
      addLine("  Type /cat to summon the cat.", "help-footer");
    }
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    handleCommand(input);
    setInput("");
  };

  // Initial welcome
  useEffect(() => {
    setTimeout(() => {
      setLines([
        { id: 1, content: "  Felmark Terminal v1.0", type: "system" },
        { id: 2, content: "  Type /cat to meet our resident feline.", type: "system-sub" },
        { id: 3, content: "", type: "spacer" },
      ]);
    }, 200);
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

        .cat-terminal{font-family:var(--mono);font-size:13px;background:var(--parchment);height:100vh;display:flex;flex-direction:column;color:var(--ink-600);max-width:720px;margin:0 auto;border-left:1px solid var(--warm-200);border-right:1px solid var(--warm-200)}

        .cat-head{padding:12px 20px;border-bottom:1px solid var(--warm-200);display:flex;align-items:center;gap:10px;background:#fff}
        .cat-head-dots{display:flex;gap:5px}.cat-head-dots span{width:10px;height:10px;border-radius:50%;background:var(--warm-200)}
        .cat-head-title{font-size:12px;color:var(--ink-300);flex:1;text-align:center}
        .cat-head-badge{font-size:9px;color:var(--ember);background:var(--ember-bg);padding:2px 8px;border-radius:3px;border:1px solid rgba(176,125,79,0.08)}

        .cat-output{flex:1;overflow-y:auto;padding:20px;line-height:1.65;white-space:pre}
        .cat-output::-webkit-scrollbar{width:4px}.cat-output::-webkit-scrollbar-thumb{background:rgba(0,0,0,.04);border-radius:99px}

        .cat-line{min-height:20px;animation:lineIn .15s ease}
        @keyframes lineIn{from{opacity:0;transform:translateY(2px)}to{opacity:1;transform:translateY(0)}}

        .cat-line.command{color:var(--ink-800);font-weight:500}
        .cat-line.system{color:var(--ink-400);font-weight:500}
        .cat-line.system-sub{color:var(--ink-300)}
        .cat-line.error{color:#c24b38}
        .cat-line.spacer{height:8px}

        .cat-line.help-title{color:var(--ember);font-weight:500}
        .cat-line.help-label{color:var(--ink-400)}
        .cat-line.help-item{color:var(--ink-500)}
        .cat-line.help-footer{color:var(--ink-300);font-style:italic}

        .cat-line.cat-speech{color:var(--ember);font-style:italic}
        .cat-line.cat-action{color:var(--ink-400);font-style:italic}
        .cat-line.cat-narration{color:var(--ink-300);font-style:italic}
        .cat-line.cat-eyes{color:var(--ember);font-size:16px}
        .cat-line.cat-hunt{color:var(--ink-300)}
        .cat-line.cat-pounce{color:var(--ember);font-weight:600}

        .cat-line.cat-mood-title{color:var(--ink-700);font-weight:500}
        .cat-line.cat-mood-face{color:var(--ember);font-size:14px}
        .cat-line.cat-mood-desc{color:var(--ink-400);font-style:italic}

        .cat-line.knocked{color:var(--ink-400)}
        .cat-line.knocked-fall{color:var(--ink-300);animation:knockFall .4s ease-out}
        @keyframes knockFall{from{transform:translateY(-8px) rotate(-3deg);opacity:0.5}to{transform:translateY(0) rotate(0);opacity:1}}
        .cat-line.knocked-shadow{color:var(--ink-300);opacity:.3}

        .cat-line.nap-blanket{color:var(--warm-400)}
        .cat-line.nap-z{color:var(--ink-300);animation:napZ 2s ease infinite}
        @keyframes napZ{0%,100%{opacity:.3}50%{opacity:.8}}
        .cat-line.nap-cat{color:var(--ink-400)}
        .cat-line.nap-blocked{color:#c24b38;font-size:11px}

        .cat-line.fortune-box{color:var(--warm-300)}
        .cat-line.fortune-header{color:var(--ember);font-weight:500}
        .cat-line.fortune-text{color:var(--ink-600);font-style:italic}
        .cat-line.fortune-lucky{color:var(--ink-400)}

        /* Cat display */
        .cat-ascii{padding:0 20px;margin:4px 0;color:var(--ember);line-height:1.3;white-space:pre;font-size:12px;transition:all .15s}

        /* Paw prints trail */
        .cat-paws{display:flex;gap:2px;padding:0 20px;height:16px;overflow:hidden;opacity:.2}
        .cat-paw{font-size:8px;color:var(--ember)}

        /* Input area */
        .cat-input-area{padding:12px 20px;border-top:1px solid var(--warm-200);display:flex;align-items:center;gap:8px;background:#fff}
        .cat-prompt{color:var(--ember);font-weight:600;font-size:15px;flex-shrink:0}
        .cat-input{flex:1;border:none;outline:none;font-family:var(--mono);font-size:13px;color:var(--ink-800);background:transparent}
        .cat-input::placeholder{color:var(--warm-400)}
        .cat-send{width:28px;height:28px;border-radius:6px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-400);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;transition:all .06s;flex-shrink:0}
        .cat-send:hover{background:var(--warm-100);color:var(--ink-600)}

        .cat-foot{padding:6px 20px;border-top:1px solid var(--warm-100);font-size:9px;color:var(--ink-300);display:flex;justify-content:space-between;background:var(--warm-50)}
        .cat-foot-hint{display:flex;gap:8px}
        .cat-kbd{background:var(--warm-100);border:1px solid var(--warm-200);border-radius:2px;padding:0 4px}
      `}</style>

      <div className="cat-terminal" onClick={() => inputRef.current?.focus()}>
        <div className="cat-head">
          <div className="cat-head-dots"><span /><span /><span /></div>
          <span className="cat-head-title">Felmark Terminal — /cat</span>
          <span className="cat-head-badge">Easter egg</span>
        </div>

        <div className="cat-output" ref={scrollRef}>
          {lines.map(line => (
            <div key={line.id} className={`cat-line ${line.type}`}>{line.content}</div>
          ))}

          {/* Live cat ASCII */}
          {showCat && CAT_FRAMES[catState] && (
            <div className="cat-ascii" style={{ paddingLeft: `${20 + catX * 8}px` }}>
              {CAT_FRAMES[catState].map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}

          {/* Paw prints */}
          {pawPrints.length > 0 && (
            <div className="cat-paws">
              {pawPrints.map((p, i) => (
                <span key={p.id} className="cat-paw" style={{ marginLeft: i === 0 ? p.x * 4 : 6 }}>🐾</span>
              ))}
            </div>
          )}
        </div>

        <div className="cat-input-area">
          <span className="cat-prompt">❯</span>
          <input ref={inputRef} className="cat-input" placeholder="Type /cat to begin..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }} />
          <button className="cat-send" onClick={handleSubmit}>↵</button>
        </div>

        <div className="cat-foot">
          <span>Felmark /cat · v1.0 · No cats were harmed</span>
          <div className="cat-foot-hint">
            <span><span className="cat-kbd">⏎</span> run</span>
            <span><span className="cat-kbd">clear</span> reset</span>
          </div>
        </div>
      </div>
    </>
  );
}
