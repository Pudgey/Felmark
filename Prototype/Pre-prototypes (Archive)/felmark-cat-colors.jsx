import { useState, useEffect, useRef, useCallback } from "react";

const TC = {
  red:"#f38ba8", green:"#a6e3a1", yellow:"#f9e2af", blue:"#89b4fa",
  mauve:"#cba6f7", cyan:"#94e2d5", pink:"#f5c2e7", peach:"#fab387",
  flamingo:"#f2cdcd", rosewater:"#f5e0dc", sky:"#89dceb", sapphire:"#74c7ec",
  lavender:"#b4befe", text:"#cdd6f4", sub0:"#a6adc8", sub1:"#bac2de",
  ov0:"#6c7086", ov1:"#7f849c", s0:"#313244", s1:"#45475a", s2:"#585b70",
  base:"#1e1e2e", mantle:"#181825", crust:"#11111b",
};
const RAINBOW = [TC.red, TC.peach, TC.yellow, TC.green, TC.cyan, TC.blue, TC.mauve];

const WISDOM = [
  "A proposal left unsent is a deal left unearned.",
  "Your rate is not a suggestion. It's a boundary.",
  "Scope creep is just kindness without a contract.",
  "Every hour you don't track is money you donate.",
  "Charge more. You're worth it. I'm a cat.",
  "Ship it. Perfection is procrastination in a hat.",
  "The best invoice is the one already paid.",
  "Rest is not laziness. Even I nap 16 hours a day.",
  "Take the break. The work will still be here.",
  "A good contract saves friendships.",
  "Your portfolio is only as strong as its worst piece.",
  "If they can't afford you, they can't afford the outcome.",
];

function S({ c, children, b, i: it, d }) {
  return <span style={{ color: c, fontWeight: b ? 600 : 400, fontStyle: it ? "italic" : "normal", opacity: d ? 0.5 : 1 }}>{children}</span>;
}

function RB({ text }) {
  return <span>{text.split("").map((ch, i) => <span key={i} style={{ color: RAINBOW[i % RAINBOW.length] }}>{ch}</span>)}</span>;
}

function GR({ text, from, to }) {
  const interp = (c1, c2, t) => {
    const h = (s) => parseInt(s, 16);
    const r = Math.round(h(c1.slice(1,3)) + (h(c2.slice(1,3)) - h(c1.slice(1,3))) * t);
    const g = Math.round(h(c1.slice(3,5)) + (h(c2.slice(3,5)) - h(c1.slice(3,5))) * t);
    const b = Math.round(h(c1.slice(5,7)) + (h(c2.slice(5,7)) - h(c1.slice(5,7))) * t);
    return `rgb(${r},${g},${b})`;
  };
  return <span>{text.split("").map((ch, i) => <span key={i} style={{ color: interp(from, to, i / Math.max(text.length - 1, 1)) }}>{ch}</span>)}</span>;
}

function Bar({ pct, color, width = 20 }) {
  const f = Math.min(Math.round(pct / (100 / width)), width);
  return <span><S c={color}>{"█".repeat(f)}</S><S c={TC.s1}>{"░".repeat(width - f)}</S></span>;
}

export default function CatColors() {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const add = useCallback((node, ms = 0) => {
    if (ms === 0) setLines(p => [...p, { id: Date.now() + Math.random(), node }]);
    else setTimeout(() => setLines(p => [...p, { id: Date.now() + Math.random(), node }]), ms);
  }, []);

  const seq = useCallback((nodes, base = 0, gap = 55) => {
    nodes.forEach((n, i) => add(n, base + i * gap));
    return base + nodes.length * gap;
  }, [add]);

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase();
    add(<span><S c={TC.green} b>{"❯"}</S> <S c={TC.text}>{raw}</S></span>);

    if (cmd === "/cat" || cmd === "cat") {
      setBusy(true);
      const d = seq([
        <span> </span>,
        <span>  <S c={TC.mauve} b>{"╭──────────────────────────────────────╮"}</S></span>,
        <span>  <S c={TC.mauve} b>{"│"}</S>  <RB text="  Felmark Cat — Terminal Colors  " />  <S c={TC.mauve} b>{"│"}</S></span>,
        <span>  <S c={TC.mauve} b>{"╰──────────────────────────────────────╯"}</S></span>,
        <span> </span>,
        <span>  <S c={TC.ov1}>Commands:</S></span>,
        <span>    <S c={TC.green}>/cat art</S>      <S c={TC.ov0}>Rainbow ASCII cat</S></span>,
        <span>    <S c={TC.blue}>/cat fortune</S>  <S c={TC.ov0}>Colored wisdom card</S></span>,
        <span>    <S c={TC.peach}>/cat status</S>   <S c={TC.ov0}>System status dashboard</S></span>,
        <span>    <S c={TC.pink}>/cat colors</S>   <S c={TC.ov0}>Full palette showcase</S></span>,
        <span>    <S c={TC.yellow}>/cat matrix</S>   <S c={TC.ov0}>The cat sees everything</S></span>,
        <span>    <S c={TC.cyan}>/cat vibe</S>     <S c={TC.ov0}>Energy reading</S></span>,
        <span>    <S c={TC.red}>/cat roast</S>    <S c={TC.ov0}>The cat judges your work</S></span>,
        <span> </span>,
      ]);
      setTimeout(() => setBusy(false), d + 50);
    }

    else if (cmd === "/cat art" || cmd === "cat art") {
      setBusy(true);
      const d = seq([
        <span> </span>,
        <span>    <GR text={"    /\\_____/\\"} from={TC.pink} to={TC.mauve} /></span>,
        <span>    <GR text={"   /  o   o  \\"} from={TC.flamingo} to={TC.pink} /></span>,
        <span>    <GR text={"  ( ==  ^  == )"} from={TC.rosewater} to={TC.flamingo} /></span>,
        <span>    <GR text={"   )         ("} from={TC.peach} to={TC.rosewater} /></span>,
        <span>    <GR text={"  ( |||   ||| )"} from={TC.yellow} to={TC.peach} /></span>,
        <span>    <GR text={" (  |||   |||  )"} from={TC.green} to={TC.yellow} /></span>,
        <span>    <GR text={"  \"\"\"\"   \"\"\"\""} from={TC.cyan} to={TC.green} /></span>,
        <span> </span>,
        <span>    <S c={TC.ov0} i>{"\"I contain multitudes.\" — The Cat"}</S></span>,
        <span> </span>,
        <span>    <S c={TC.s2}>Small form:</S></span>,
        <span> </span>,
        <span>      <S c={TC.pink}>{"   ╱|、"}</S></span>,
        <span>      <S c={TC.flamingo}>{"  (˚ˎ 。7"}</S></span>,
        <span>      <S c={TC.peach}>{"   |、˜〵"}</S></span>,
        <span>      <S c={TC.yellow}>{"   じしˍ,)ノ"}</S></span>,
        <span> </span>,
        <span>    <RB text="~ the felmark cat vibes in full spectrum ~" /></span>,
        <span> </span>,
      ], 0, 50);
      setTimeout(() => setBusy(false), d + 50);
    }

    else if (cmd === "/cat colors" || cmd === "cat colors") {
      setBusy(true);
      const sw = (name, hex) => (
        <span>    <S c={hex} b>{"██"}</S> <S c={hex}>{name.padEnd(12)}</S> <S c={TC.ov0}>{hex}</S></span>
      );
      const block = (c) => <S c={c}>{"████████████████████████████████████████"}</S>;
      const d = seq([
        <span> </span>,
        <span>  <GR text={"╔═══ TERMINAL PALETTE ════════════════════╗"} from={TC.red} to={TC.mauve} /></span>,
        <span> </span>,
        <span>  <S c={TC.sub0}>  Normal:</S></span>,
        sw("Red", TC.red), sw("Peach", TC.peach), sw("Yellow", TC.yellow), sw("Green", TC.green),
        sw("Teal", TC.cyan), sw("Blue", TC.blue), sw("Mauve", TC.mauve), sw("Pink", TC.pink),
        <span> </span>,
        <span>  <S c={TC.sub0}>  Extended:</S></span>,
        sw("Flamingo", TC.flamingo), sw("Rosewater", TC.rosewater), sw("Sky", TC.sky),
        sw("Sapphire", TC.sapphire), sw("Lavender", TC.lavender),
        <span> </span>,
        <span>  <S c={TC.sub0}>  Spectrum:</S></span>,
        <span>    <RB text={"████████████████████████████████████████"} /></span>,
        <span>    <GR text={"████████████████████████████████████████"} from={TC.red} to={TC.blue} /></span>,
        <span>    <GR text={"████████████████████████████████████████"} from={TC.pink} to={TC.peach} /></span>,
        <span>    <GR text={"████████████████████████████████████████"} from={TC.green} to={TC.cyan} /></span>,
        <span> </span>,
        <span>  <GR text={"╚═══════════════════════════════════════╝"} from={TC.mauve} to={TC.red} /></span>,
        <span> </span>,
      ], 0, 40);
      setTimeout(() => setBusy(false), d + 50);
    }

    else if (cmd === "/cat fortune" || cmd === "cat fortune") {
      setBusy(true);
      const w = WISDOM[Math.floor(Math.random() * WISDOM.length)];
      const lucky = "$" + (Math.floor(Math.random() * 18) + 3) + "," + Math.floor(Math.random() * 9) + "00";
      const d = seq([
        <span> </span>,
        <span>  <S c={TC.yellow}>{"╔══════════════════════════════════════════╗"}</S></span>,
        <span>  <S c={TC.yellow}>{"║"}</S> <S c={TC.peach} b>{"  🐱 FREELANCER ORACLE"}</S>{"                   "}<S c={TC.yellow}>{"║"}</S></span>,
        <span>  <S c={TC.yellow}>{"╠══════════════════════════════════════════╣"}</S></span>,
        <span>  <S c={TC.yellow}>{"║"}</S>{"                                          "}<S c={TC.yellow}>{"║"}</S></span>,
        <span>  <S c={TC.yellow}>{"║"}</S>{"  "}<GR text={`"${w}"`} from={TC.pink} to={TC.peach} /></span>,
        <span>  <S c={TC.yellow}>{"║"}</S>{"                                          "}<S c={TC.yellow}>{"║"}</S></span>,
        <span>  <S c={TC.yellow}>{"║"}</S>{"  "}<S c={TC.green}>{"◆"}</S>{" "}<S c={TC.sub0}>{"Lucky invoice:"}</S>{" "}<S c={TC.green} b>{lucky}</S>{"                    "}<S c={TC.yellow}>{"║"}</S></span>,
        <span>  <S c={TC.yellow}>{"║"}</S>{"  "}<S c={TC.blue}>{"◆"}</S>{" "}<S c={TC.sub0}>{"Lucky day:"}</S>{" "}<S c={TC.blue} b>{"The one you ship"}</S>{"              "}<S c={TC.yellow}>{"║"}</S></span>,
        <span>  <S c={TC.yellow}>{"║"}</S>{"  "}<S c={TC.mauve}>{"◆"}</S>{" "}<S c={TC.sub0}>{"Lucky client:"}</S>{" "}<S c={TC.mauve} b>{"Next yes"}</S>{"                    "}<S c={TC.yellow}>{"║"}</S></span>,
        <span>  <S c={TC.yellow}>{"║"}</S>{"                                          "}<S c={TC.yellow}>{"║"}</S></span>,
        <span>  <S c={TC.yellow}>{"╚══════════════════════════════════════════╝"}</S></span>,
        <span> </span>,
      ]);
      setTimeout(() => setBusy(false), d + 50);
    }

    else if (cmd === "/cat status" || cmd === "cat status") {
      setBusy(true);
      const d = seq([
        <span> </span>,
        <span>  <S c={TC.blue} b>{"┌─ FELMARK SYSTEM STATUS ──────────────────┐"}</S></span>,
        <span>  <S c={TC.blue}>{"│"}</S>{"                                           "}<S c={TC.blue}>{"│"}</S></span>,
        <span>  <S c={TC.blue}>{"│"}</S>{"  "}<S c={TC.sub0}>{"CPU       "}</S> <Bar pct={34} color={TC.green} /> <S c={TC.green} b>{"  34%"}</S>{"  "}<S c={TC.blue}>{"│"}</S></span>,
        <span>  <S c={TC.blue}>{"│"}</S>{"  "}<S c={TC.sub0}>{"Memory    "}</S> <Bar pct={62} color={TC.yellow} /> <S c={TC.yellow} b>{"  62%"}</S>{"  "}<S c={TC.blue}>{"│"}</S></span>,
        <span>  <S c={TC.blue}>{"│"}</S>{"  "}<S c={TC.sub0}>{"Vibes     "}</S> <Bar pct={100} color={TC.pink} /> <S c={TC.pink} b>{"  MAX"}</S>{"  "}<S c={TC.blue}>{"│"}</S></span>,
        <span>  <S c={TC.blue}>{"│"}</S>{"  "}<S c={TC.sub0}>{"Cat nap   "}</S> <Bar pct={87} color={TC.mauve} /> <S c={TC.mauve} b>{"  87%"}</S>{"  "}<S c={TC.blue}>{"│"}</S></span>,
        <span>  <S c={TC.blue}>{"│"}</S>{"  "}<S c={TC.sub0}>{"Invoices  "}</S> <Bar pct={45} color={TC.peach} /> <S c={TC.peach} b>{"  45%"}</S>{"  "}<S c={TC.blue}>{"│"}</S></span>,
        <span>  <S c={TC.blue}>{"│"}</S>{"                                           "}<S c={TC.blue}>{"│"}</S></span>,
        <span>  <S c={TC.blue}>{"│"}</S>{"  "}<S c={TC.green}>{"●"}</S>{" "}<S c={TC.text}>{"Editor"}</S>{"       "}<S c={TC.green} b>{"ONLINE"}</S>{"                    "}<S c={TC.blue}>{"│"}</S></span>,
        <span>  <S c={TC.blue}>{"│"}</S>{"  "}<S c={TC.green}>{"●"}</S>{" "}<S c={TC.text}>{"Pipeline"}</S>{"     "}<S c={TC.green} b>{"ONLINE"}</S>{"                    "}<S c={TC.blue}>{"│"}</S></span>,
        <span>  <S c={TC.blue}>{"│"}</S>{"  "}<S c={TC.green}>{"●"}</S>{" "}<S c={TC.text}>{"Stripe"}</S>{"       "}<S c={TC.green} b>{"CONNECTED"}</S>{"                 "}<S c={TC.blue}>{"│"}</S></span>,
        <span>  <S c={TC.blue}>{"│"}</S>{"  "}<S c={TC.yellow}>{"●"}</S>{" "}<S c={TC.text}>{"The Wire"}</S>{"     "}<S c={TC.yellow} b>{"3 SIGNALS"}</S>{"                 "}<S c={TC.blue}>{"│"}</S></span>,
        <span>  <S c={TC.blue}>{"│"}</S>{"  "}<S c={TC.pink}>{"●"}</S>{" "}<S c={TC.text}>{"Cat"}</S>{"          "}<S c={TC.pink} b>{"VIBING"}</S>{"                    "}<S c={TC.blue}>{"│"}</S></span>,
        <span>  <S c={TC.blue}>{"│"}</S>{"                                           "}<S c={TC.blue}>{"│"}</S></span>,
        <span>  <S c={TC.blue}>{"└───────────────────────────────────────────┘"}</S></span>,
        <span> </span>,
      ], 0, 48);
      setTimeout(() => setBusy(false), d + 50);
    }

    else if (cmd === "/cat matrix" || cmd === "cat matrix") {
      setBusy(true);
      const chars = "アイウエオカキクケコサシスセソタチツテト01";
      const mLine = () => Array.from({ length: 44 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      const d = seq([
        <span> </span>,
        <span>  <GR text={mLine()} from="#003300" to={TC.green} /></span>,
        <span>  <GR text={mLine()} from="#004400" to={TC.green} /></span>,
        <span>  <GR text={mLine()} from="#002200" to={TC.green} /></span>,
        <span>  <GR text={mLine()} from="#005500" to={TC.green} /></span>,
        <span>  <GR text={mLine()} from="#003300" to={TC.green} /></span>,
        <span> </span>,
        <span>{"    "}<S c={TC.green}>{"  ╱|、"}</S></span>,
        <span>{"    "}<S c={TC.green}>{"("}</S><S c="#88ff88" b>{"˚ˎ 。"}</S><S c={TC.green}>{"7"}</S>{"   "}<S c={TC.green} b>{"\"I see all your deadlines.\""}</S></span>,
        <span>{"    "}<S c={TC.green}>{" |、˜〵"}</S>{"    "}<S c={TC.green} b>{"\"None of them are met.\""}</S></span>,
        <span>{"    "}<S c={TC.green}>{" じしˍ,)ノ"}</S></span>,
        <span> </span>,
        <span>  <GR text={mLine()} from={TC.green} to="#003300" /></span>,
        <span>  <GR text={mLine()} from={TC.green} to="#004400" /></span>,
        <span>  <GR text={mLine()} from={TC.green} to="#002200" /></span>,
        <span>  <GR text={mLine()} from={TC.green} to="#005500" /></span>,
        <span>  <GR text={mLine()} from={TC.green} to="#003300" /></span>,
        <span> </span>,
      ], 0, 60);
      setTimeout(() => setBusy(false), d + 50);
    }

    else if (cmd === "/cat vibe" || cmd === "cat vibe") {
      setBusy(true);
      const moods = ["cosmically unbothered", "dangerously creative", "quietly feral", "aggressively cozy", "suspiciously productive"];
      const mood = moods[Math.floor(Math.random() * moods.length)];
      const vb = (name, pct, color, overflow) => (
        <span>{"  "}<S c={TC.sub0}>{name.padEnd(14)}</S>{" "}<S c={color}>{"▓".repeat(Math.min(Math.round(pct / 5), 20))}</S><S c={TC.s1}>{"░".repeat(Math.max(20 - Math.round(pct / 5), 0))}</S>{" "}<S c={color} b>{overflow ? "!!!" : pct + "%"}</S></span>
      );
      const d = seq([
        <span> </span>,
        <span>  <GR text={"╭───── TODAY'S ENERGY READING ─────╮"} from={TC.pink} to={TC.mauve} /></span>,
        <span> </span>,
        vb("Creativity", 92, TC.pink, false),
        vb("Focus", 67, TC.blue, false),
        vb("Chaos", 88, TC.red, false),
        vb("Productivity", 43, TC.green, false),
        vb("Caffeine", 100, TC.peach, false),
        vb("Cat energy", 110, TC.mauve, true),
        <span> </span>,
        <span>{"  "}<S c={TC.ov0}>{"Overall mood: "}</S><GR text={mood} from={TC.peach} to={TC.pink} /></span>,
        <span> </span>,
        <span>{"  "}<S c={TC.ov0} i>{"The cat recommends: "}</S><S c={TC.yellow}>{"shipping something today."}</S></span>,
        <span>{"  "}<S c={TC.ov0} i>{"The cat also recommends: "}</S><S c={TC.cyan}>{"a nap first."}</S></span>,
        <span> </span>,
        <span>  <GR text={"╰─────────────────────────────────╯"} from={TC.mauve} to={TC.pink} /></span>,
        <span> </span>,
      ]);
      setTimeout(() => setBusy(false), d + 50);
    }

    else if (cmd === "/cat roast" || cmd === "cat roast") {
      setBusy(true);
      const roasts = [
        ["Your proposal has been open for 6 days.", "The client opened it once. For 12 seconds.", "Follow up. Or don't.", "The cat doesn't care."],
        ["You tracked 2 hours today.", "You were online for 9.", "The other 7 hours are between you and God.", "And the cat. The cat saw everything."],
        ["Your effective rate is $47/hour.", "You told LinkedIn it's $150.", "The cat respects the audacity.", "But not the math."],
        ["You have 3 invoices overdue.", "The oldest is from February.", "February.", "The cat is embarrassed for you."],
      ];
      const r = roasts[Math.floor(Math.random() * roasts.length)];
      const d = seq([
        <span> </span>,
        <span>{"    "}<S c={TC.red} b>{"  /\\_/\\"}</S></span>,
        <span>{"    "}<S c={TC.red} b>{" ( ◉_◉ )"}</S>{"  "}<S c={TC.red}>{"THE CAT HAS OPINIONS"}</S></span>,
        <span>{"    "}<S c={TC.red} b>{"  > ^ <"}</S></span>,
        <span> </span>,
        ...r.slice(0, -1).map(line => <span>{"    "}<S c={TC.text}>{"  " + line}</S></span>),
        <span>{"    "}<S c={TC.ov0} i>{"  " + r[r.length - 1]}</S></span>,
        <span> </span>,
        <span>{"    "}<S c={TC.s2}>{"  ─────────────────────────────"}</S></span>,
        <span>{"    "}<S c={TC.ov0} i>{"  This roast was generated with love."}</S></span>,
        <span>{"    "}<S c={TC.ov0} i>{"  And a little malice. 🐾"}</S></span>,
        <span> </span>,
      ], 0, 65);
      setTimeout(() => setBusy(false), d + 50);
    }

    else if (cmd === "clear") { setLines([]); return; }

    else {
      add(<span>{"  "}<S c={TC.red}>{"command not found: "}</S><S c={TC.text}>{raw}</S></span>);
      add(<span>{"  "}<S c={TC.ov0}>{"try "}</S><S c={TC.green}>{"/cat"}</S></span>);
    }
  };

  const submit = () => { if (!input.trim() || busy) return; run(input); setInput(""); };

  useEffect(() => {
    setLines([
      { id: 1, node: <span>{"  "}<GR text={"Felmark Terminal v2.0 — Colors Edition"} from={TC.mauve} to={TC.pink} /></span> },
      { id: 2, node: <span>{"  "}<S c={TC.ov0}>{"Type "}</S><S c={TC.green} b>{"/cat"}</S><S c={TC.ov0}>{" to begin."}</S></span> },
      { id: 3, node: <span> </span> },
    ]);
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .ct{font-family:'JetBrains Mono',monospace;font-size:13px;background:#1e1e2e;height:100vh;display:flex;flex-direction:column;color:#cdd6f4;max-width:760px;margin:0 auto;border-left:1px solid #313244;border-right:1px solid #313244}
        .ct-h{padding:10px 16px;background:#181825;border-bottom:1px solid #313244;display:flex;align-items:center;gap:8px}
        .ct-dots{display:flex;gap:6px}.ct-dots span{width:12px;height:12px;border-radius:50%}
        .ct-title{flex:1;text-align:center;font-size:11px;color:#6c7086}
        .ct-tag{font-size:9px;padding:2px 8px;border-radius:4px;background:#313244;color:#a6adc8}
        .ct-o{flex:1;overflow-y:auto;padding:16px 20px;line-height:1.7;white-space:pre-wrap;word-break:break-word}
        .ct-o::-webkit-scrollbar{width:6px}.ct-o::-webkit-scrollbar-thumb{background:#313244;border-radius:3px}.ct-o::-webkit-scrollbar-track{background:#1e1e2e}
        .ct-l{min-height:20px;animation:ci .12s ease}
        @keyframes ci{from{opacity:0}to{opacity:1}}
        .ct-i{padding:10px 20px;border-top:1px solid #313244;display:flex;align-items:center;gap:8px;background:#181825}
        .ct-p{color:#a6e3a1;font-weight:600;font-size:15px;flex-shrink:0}
        .ct-in{flex:1;border:none;outline:none;font-family:'JetBrains Mono',monospace;font-size:13px;color:#cdd6f4;background:transparent;caret-color:#a6e3a1}
        .ct-in::placeholder{color:#45475a}.ct-in:disabled{opacity:.4}
        .ct-f{padding:4px 20px;background:#11111b;border-top:1px solid #181825;display:flex;justify-content:space-between;font-size:9px;color:#45475a}
        .ct-fh{display:flex;gap:8px}
        .ct-k{background:#313244;padding:0 4px;border-radius:2px;color:#585b70}
      `}</style>
      <div className="ct" onClick={() => inputRef.current?.focus()}>
        <div className="ct-h">
          <div className="ct-dots"><span style={{ background: "#f38ba8" }} /><span style={{ background: "#f9e2af" }} /><span style={{ background: "#a6e3a1" }} /></div>
          <span className="ct-title">felmark — /cat</span>
          <span className="ct-tag">catppuccin</span>
        </div>
        <div className="ct-o" ref={scrollRef}>
          {lines.map(l => <div key={l.id} className="ct-l">{l.node}</div>)}
        </div>
        <div className="ct-i">
          <span className="ct-p">❯</span>
          <input ref={inputRef} className="ct-in" placeholder={busy ? "cat is thinking..." : "type /cat to begin..."}
            value={input} disabled={busy} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); }} />
        </div>
        <div className="ct-f">
          <span>felmark cat v2.0 · catppuccin mocha</span>
          <div className="ct-fh"><span><span className="ct-k">⏎</span> run</span><span><span className="ct-k">clear</span> reset</span></div>
        </div>
      </div>
    </>
  );
}
