import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   FELMARK ANIMATION BLOCKS
   The "wow" moments in your proposals.
   Drop one in. Watch the client's face.
   ═══════════════════════════════════════════ */


// ═══ 1. STAT REVEAL ═══
// Numbers count up dramatically when they scroll into view
function StatReveal() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { value: 340, prefix: "", suffix: "%", label: "Average ROI on brand investment", sub: "Industry benchmark from Lucidpress 2025", delay: 0, color: "#5a9a3c" },
    { value: 23, prefix: "", suffix: "×", label: "Revenue increase with consistent branding", sub: "Source: Marq brand consistency report", delay: 200, color: "#b07d4f" },
    { value: 71, prefix: "", suffix: "%", label: "Of consumers buy from brands they recognize", sub: "Edelman Trust Barometer 2026", delay: 400, color: "#5b7fa4" },
  ];

  return (
    <div className="ab-stat-reveal" ref={ref}>
      <div className="ab-stat-grid">
        {stats.map((s, i) => (
          <AnimStat key={i} {...s} visible={visible} />
        ))}
      </div>
      <div className="ab-stat-footer">Why brand identity is a revenue investment, not a cost.</div>
    </div>
  );
}

function AnimStat({ value, prefix, suffix, label, sub, delay, color, visible }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setStarted(true);
      const start = Date.now();
      const duration = 1800;
      const frame = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        setCount(Math.round(eased * value));
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, delay);
    return () => clearTimeout(timer);
  }, [visible, value, delay]);

  return (
    <div className={`ab-stat-card${started ? " visible" : ""}`}>
      <div className="ab-stat-value" style={{ color }}>
        {prefix}{count}{suffix}
      </div>
      <div className="ab-stat-ring">
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke="var(--warm-200)" strokeWidth="3" />
          <circle cx="24" cy="24" r="20" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${(count / value) * 125.6} 125.6`}
            strokeLinecap="round" transform="rotate(-90 24 24)"
            style={{ transition: "stroke-dasharray 0.05s" }} />
        </svg>
      </div>
      <div className="ab-stat-label">{label}</div>
      <div className="ab-stat-sub">{sub}</div>
    </div>
  );
}


// ═══ 2. KINETIC TYPOGRAPHY ═══
// Words animate in one by one with staggered reveals
function KineticType() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const lines = [
    { text: "Your brand", weight: 300, size: 18, color: "var(--ink-400)" },
    { text: "is not a logo.", weight: 600, size: 44, color: "var(--ink-900)", serif: true },
    { text: "It's the feeling people get", weight: 300, size: 18, color: "var(--ink-400)" },
    { text: "before they even", weight: 400, size: 22, color: "var(--ink-500)" },
    { text: "read a word.", weight: 700, size: 52, color: "var(--ember)", serif: true },
  ];

  return (
    <div className="ab-kinetic" ref={ref}>
      <div className="ab-kinetic-inner">
        {lines.map((line, i) => (
          <div key={i} className={`ab-kinetic-line${visible ? " visible" : ""}`}
            style={{
              fontFamily: line.serif ? "'Cormorant Garamond', serif" : "'Outfit', sans-serif",
              fontWeight: line.weight,
              fontSize: line.size,
              color: line.color,
              transitionDelay: `${i * 280}ms`,
            }}>
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}


// ═══ 3. PARTICLE LOGO REVEAL ═══
// Particles coalesce into a shape
function ParticleReveal() {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const particlesRef = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = 680, h = 280;
    canvas.width = w * 2; canvas.height = h * 2;
    ctx.scale(2, 2);

    // Target positions forming "M" letterform
    const targets = [];
    const letterM = [
      // Left stroke
      ...Array.from({ length: 20 }, (_, i) => ({ x: 260, y: 60 + i * 8 })),
      // Left diagonal
      ...Array.from({ length: 14 }, (_, i) => ({ x: 260 + i * 5, y: 60 + i * 8 })),
      // Right diagonal
      ...Array.from({ length: 14 }, (_, i) => ({ x: 340 + 60 - i * 5, y: 60 + i * 8 })),
      // Right stroke
      ...Array.from({ length: 20 }, (_, i) => ({ x: 400, y: 60 + i * 8 })),
      // Middle V bottom
      ...Array.from({ length: 8 }, (_, i) => ({ x: 320 + i * 2 - 8, y: 160 + i * 3 })),
      ...Array.from({ length: 8 }, (_, i) => ({ x: 320 - i * 2 + 8, y: 160 + i * 3 })),
    ];

    // Create particles at random positions
    const particles = letterM.map(t => ({
      x: Math.random() * w,
      y: Math.random() * h,
      tx: t.x, ty: t.y,
      vx: 0, vy: 0,
      size: 2 + Math.random() * 2,
      color: Math.random() > 0.7 ? "#b07d4f" : Math.random() > 0.5 ? "#c89360" : "#8a7e63",
      arrived: false,
    }));
    particlesRef.current = particles;

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      ctx.clearRect(0, 0, w, h);

      const attracting = elapsed > 600;

      particles.forEach(p => {
        if (attracting) {
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 1) {
            p.vx += dx * 0.025;
            p.vy += dy * 0.025;
            p.vx *= 0.88;
            p.vy *= 0.88;
          } else {
            p.arrived = true;
            p.vx *= 0.5;
            p.vy *= 0.5;
          }
        } else {
          p.vx += (Math.random() - 0.5) * 0.3;
          p.vy += (Math.random() - 0.5) * 0.3;
          p.vx *= 0.98;
          p.vy *= 0.98;
        }

        p.x += p.vx;
        p.y += p.vy;

        const alpha = p.arrived ? 0.9 : 0.4 + Math.sin(elapsed * 0.003 + p.x) * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      // Check if most particles arrived
      const arrivedCount = particles.filter(p => p.arrived).length;
      if (arrivedCount > particles.length * 0.85 && !revealed) {
        setRevealed(true);
      }

      if (elapsed < 8000) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  return (
    <div className="ab-particle">
      <canvas ref={canvasRef} className="ab-particle-canvas" style={{ width: "100%", height: 280 }} />
      <div className={`ab-particle-text${revealed ? " visible" : ""}`}>
        <div className="ab-particle-name">MERIDIAN</div>
        <div className="ab-particle-sub">S T U D I O</div>
      </div>
      <div className="ab-particle-caption">Your brand, assembled from nothing into something unmistakable.</div>
    </div>
  );
}


// ═══ 4. VALUE COUNTER ═══
// Dramatic reveal of project value / ROI
function ValueCounter() {
  const [phase, setPhase] = useState(0);
  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && phase === 0) {
        setPhase(1);
        setTimeout(() => setPhase(2), 800);
        setTimeout(() => { setPhase(3); setCounting(true); }, 1600);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [phase]);

  useEffect(() => {
    if (!counting) return;
    const start = Date.now();
    const target = 147200;
    const frame = () => {
      const p = Math.min((Date.now() - start) / 2400, 1);
      const eased = 1 - Math.pow(1 - p, 5);
      setCount(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [counting]);

  return (
    <div className="ab-value" ref={ref}>
      <div className="ab-value-inner">
        <div className={`ab-value-label${phase >= 1 ? " visible" : ""}`}>
          Estimated brand value over 3 years
        </div>
        <div className={`ab-value-amount${phase >= 3 ? " visible" : ""}`}>
          <span className="ab-value-dollar">$</span>
          <span className="ab-value-num">{count.toLocaleString()}</span>
        </div>
        <div className={`ab-value-breakdown${phase >= 3 ? " visible" : ""}`}>
          <div className="ab-value-row">
            <span>Brand identity investment</span>
            <span className="ab-value-row-amt cost">−$4,800</span>
          </div>
          <div className="ab-value-row">
            <span>Estimated revenue from brand recognition</span>
            <span className="ab-value-row-amt">+$82,000</span>
          </div>
          <div className="ab-value-row">
            <span>Client retention improvement</span>
            <span className="ab-value-row-amt">+$46,000</span>
          </div>
          <div className="ab-value-row">
            <span>Premium pricing enabled by brand equity</span>
            <span className="ab-value-row-amt">+$24,000</span>
          </div>
        </div>
        <div className={`ab-value-roi${phase >= 3 ? " visible" : ""}`}>
          That's a <strong>30× return</strong> on your brand investment.
        </div>
      </div>
    </div>
  );
}


// ═══ 5. HERO SPOTLIGHT ═══
// Client's name appears dramatically
function HeroSpotlight() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const letters = "MERIDIAN".split("");

  return (
    <div className="ab-spotlight" ref={ref}>
      <div className="ab-spotlight-pre">Exclusively prepared for</div>
      <div className="ab-spotlight-name">
        {letters.map((l, i) => (
          <span key={i} className={`ab-spotlight-letter${visible ? " visible" : ""}`}
            style={{ transitionDelay: `${400 + i * 100}ms` }}>
            {l}
          </span>
        ))}
      </div>
      <div className={`ab-spotlight-line${visible ? " visible" : ""}`} />
      <div className={`ab-spotlight-post${visible ? " visible" : ""}`}>
        Brand Identity Proposal · April 2026
      </div>
    </div>
  );
}


// ═══ 6. CELEBRATION BURST ═══
// Confetti + success animation for proposal acceptance
function CelebrationBurst() {
  const [active, setActive] = useState(false);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const trigger = () => {
    setActive(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    canvas.width = w * 2; canvas.height = h * 2;
    ctx.scale(2, 2);

    const confetti = Array.from({ length: 80 }, () => ({
      x: w / 2 + (Math.random() - 0.5) * 100,
      y: h / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 14 - 4,
      size: 3 + Math.random() * 4,
      color: ["#b07d4f", "#c89360", "#5a9a3c", "#5b7fa4", "#7c6b9e", "#c24b38", "#8a7e63"][Math.floor(Math.random() * 7)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));

    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      ctx.clearRect(0, 0, w, h);

      confetti.forEach(c => {
        c.x += c.vx;
        c.vy += 0.25;
        c.y += c.vy;
        c.vx *= 0.99;
        c.rotation += c.rotSpeed;

        const alpha = Math.max(0, 1 - elapsed / 3000);
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = c.color;

        if (c.shape === "rect") {
          ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (elapsed < 3500) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  return (
    <div className="ab-celebration">
      <canvas ref={canvasRef} className="ab-celebration-canvas" />
      <div className="ab-celebration-inner">
        {!active ? (
          <>
            <div className="ab-celebration-icon">◆</div>
            <div className="ab-celebration-title">Ready to begin?</div>
            <div className="ab-celebration-desc">Click accept to lock in your package and kick off the project.</div>
            <button className="ab-celebration-btn" onClick={trigger}>Accept Proposal</button>
          </>
        ) : (
          <div className="ab-celebration-success">
            <div className="ab-celebration-check">✓</div>
            <div className="ab-celebration-success-title">Welcome aboard.</div>
            <div className="ab-celebration-success-sub">The project is live. Let's build something remarkable.</div>
          </div>
        )}
      </div>
    </div>
  );
}


// ═══ 7. NUMBER CASCADE ═══
// Stats rain down in sequence
function NumberCascade() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const items = [
    { num: "8+", label: "years of brand design experience", delay: 0 },
    { num: "47", label: "brand identity projects delivered", delay: 150 },
    { num: "100%", label: "client satisfaction rate", delay: 300 },
    { num: "$2.4M", label: "revenue generated for our clients' brands", delay: 450 },
    { num: "12", label: "industry awards for brand work", delay: 600 },
    { num: "4.9", label: "average client rating (out of 5)", delay: 750 },
  ];

  return (
    <div className="ab-cascade" ref={ref}>
      <div className="ab-cascade-grid">
        {items.map((item, i) => (
          <div key={i} className={`ab-cascade-item${visible ? " visible" : ""}`}
            style={{ transitionDelay: `${item.delay}ms` }}>
            <div className="ab-cascade-num">{item.num}</div>
            <div className="ab-cascade-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ═══ 8. AMBIENT GRADIENT SECTION ═══
// Slowly shifting warm gradient behind a message
function AmbientGradient() {
  const [hue, setHue] = useState(0);

  useEffect(() => {
    let frame;
    const animate = () => {
      setHue(prev => (prev + 0.15) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Map hue to warm Felmark colors
  const c1 = `hsl(${28 + Math.sin(hue * 0.01) * 8}, ${45 + Math.sin(hue * 0.015) * 10}%, ${82 + Math.sin(hue * 0.02) * 4}%)`;
  const c2 = `hsl(${35 + Math.cos(hue * 0.012) * 10}, ${35 + Math.cos(hue * 0.018) * 8}%, ${88 + Math.cos(hue * 0.025) * 3}%)`;
  const c3 = `hsl(${22 + Math.sin(hue * 0.008) * 6}, ${30 + Math.sin(hue * 0.013) * 12}%, ${90 + Math.sin(hue * 0.016) * 3}%)`;

  return (
    <div className="ab-ambient" style={{ background: `linear-gradient(135deg, ${c1}, ${c2}, ${c3})` }}>
      <div className="ab-ambient-content">
        <div className="ab-ambient-mark">◆</div>
        <div className="ab-ambient-quote">
          Great brands aren't designed.<br />
          They're <em>discovered.</em>
        </div>
        <div className="ab-ambient-author">— Our philosophy at every project</div>
      </div>
    </div>
  );
}


/* ═══════════════════════════
   SHOWCASE
   ═══════════════════════════ */
export default function AnimationBlocks() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
        .page{font-family:'Outfit',sans-serif;font-size:15px;color:var(--ink-700);background:var(--parchment);min-height:100vh}
        .canvas{max-width:780px;margin:0 auto;padding:40px 32px 100px}
        .doc-h1{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:var(--ink-900);margin-bottom:6px}
        .doc-meta{font-family:var(--mono);font-size:11px;color:var(--ink-400);margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--warm-200);display:flex;gap:12px}
        .doc-p{font-size:15px;color:var(--ink-600);line-height:1.8;margin-bottom:12px}
        .cat{font-family:var(--mono);font-size:9px;color:var(--ink-300);letter-spacing:.1em;text-transform:uppercase;margin:40px 0 12px;display:flex;align-items:center;gap:8px}.cat::after{content:'';flex:1;height:1px;background:var(--warm-200)}

        /* ═══ STAT REVEAL ═══ */
        .ab-stat-reveal{border:1px solid var(--warm-200);border-radius:14px;overflow:hidden;margin:16px 0;background:#fff}
        .ab-stat-grid{display:flex;gap:0}
        .ab-stat-card{flex:1;padding:28px 20px;text-align:center;border-right:1px solid var(--warm-100);opacity:0;transform:translateY(20px);transition:all .8s cubic-bezier(0.16,1,0.3,1)}
        .ab-stat-card:last-child{border-right:none}
        .ab-stat-card.visible{opacity:1;transform:translateY(0)}
        .ab-stat-value{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:700;line-height:1;margin-bottom:4px;font-variant-numeric:tabular-nums}
        .ab-stat-ring{margin:0 auto 10px}
        .ab-stat-label{font-size:14px;font-weight:500;color:var(--ink-700);margin-bottom:4px;line-height:1.3}
        .ab-stat-sub{font-family:var(--mono);font-size:10px;color:var(--ink-300);line-height:1.3}
        .ab-stat-footer{padding:12px 20px;background:var(--warm-50);border-top:1px solid var(--warm-100);text-align:center;font-size:14px;color:var(--ink-500);font-style:italic}

        /* ═══ KINETIC TYPE ═══ */
        .ab-kinetic{padding:48px 32px;margin:16px 0;border:1px solid var(--warm-200);border-radius:14px;background:#fff;overflow:hidden}
        .ab-kinetic-inner{display:flex;flex-direction:column;align-items:center;gap:4px}
        .ab-kinetic-line{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s cubic-bezier(0.16,1,0.3,1);text-align:center;line-height:1.15}
        .ab-kinetic-line.visible{opacity:1;transform:translateY(0)}

        /* ═══ PARTICLE REVEAL ═══ */
        .ab-particle{border:1px solid var(--warm-200);border-radius:14px;overflow:hidden;margin:16px 0;background:#fff;position:relative}
        .ab-particle-canvas{display:block;background:var(--warm-50)}
        .ab-particle-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;opacity:0;transition:opacity 1.5s ease;pointer-events:none}
        .ab-particle-text.visible{opacity:1}
        .ab-particle-name{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:600;color:var(--ink-900);letter-spacing:.12em}
        .ab-particle-sub{font-family:var(--mono);font-size:11px;color:var(--ink-400);letter-spacing:.3em;margin-top:2px}
        .ab-particle-caption{padding:12px 20px;text-align:center;font-size:14px;color:var(--ink-400);font-style:italic;border-top:1px solid var(--warm-100)}

        /* ═══ VALUE COUNTER ═══ */
        .ab-value{border:1px solid var(--warm-200);border-radius:14px;overflow:hidden;margin:16px 0;background:var(--ink-900)}
        .ab-value-inner{padding:40px 32px;text-align:center}
        .ab-value-label{font-family:var(--mono);font-size:11px;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;opacity:0;transform:translateY(10px);transition:all .6s ease}
        .ab-value-label.visible{opacity:1;transform:translateY(0)}
        .ab-value-amount{font-family:'Cormorant Garamond',serif;font-weight:700;line-height:1;margin-bottom:24px;opacity:0;transform:scale(0.8);transition:all .8s cubic-bezier(0.16,1,0.3,1)}
        .ab-value-amount.visible{opacity:1;transform:scale(1)}
        .ab-value-dollar{font-size:36px;color:rgba(255,255,255,0.3);vertical-align:super}
        .ab-value-num{font-size:72px;color:#fff;font-variant-numeric:tabular-nums}
        .ab-value-breakdown{display:flex;flex-direction:column;gap:4px;max-width:400px;margin:0 auto 16px;opacity:0;transform:translateY(16px);transition:all .8s ease .4s}
        .ab-value-breakdown.visible{opacity:1;transform:translateY(0)}
        .ab-value-row{display:flex;justify-content:space-between;font-size:13px;color:rgba(255,255,255,0.35);padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.04)}
        .ab-value-row-amt{font-family:var(--mono);font-weight:500;color:rgba(90,154,60,0.7)}
        .ab-value-row-amt.cost{color:rgba(194,75,56,0.5)}
        .ab-value-roi{font-size:16px;color:rgba(255,255,255,0.5);opacity:0;transform:translateY(10px);transition:all .6s ease .8s}
        .ab-value-roi.visible{opacity:1;transform:translateY(0)}
        .ab-value-roi strong{color:var(--ember);font-weight:600}

        /* ═══ HERO SPOTLIGHT ═══ */
        .ab-spotlight{padding:60px 32px;margin:16px 0;border:1px solid var(--warm-200);border-radius:14px;background:#fff;text-align:center;overflow:hidden}
        .ab-spotlight-pre{font-size:14px;color:var(--ink-400);margin-bottom:12px;font-style:italic}
        .ab-spotlight-name{display:flex;justify-content:center;gap:6px;margin-bottom:16px}
        .ab-spotlight-letter{font-family:'Cormorant Garamond',serif;font-size:56px;font-weight:600;color:var(--ink-900);opacity:0;transform:translateY(30px) scale(0.7);transition:all .5s cubic-bezier(0.16,1,0.3,1);display:inline-block;letter-spacing:.06em}
        .ab-spotlight-letter.visible{opacity:1;transform:translateY(0) scale(1)}
        .ab-spotlight-line{width:0;height:2px;background:var(--ember);margin:0 auto 16px;transition:width 0.8s cubic-bezier(0.16,1,0.3,1) 1.4s}
        .ab-spotlight-line.visible{width:120px}
        .ab-spotlight-post{font-family:var(--mono);font-size:12px;color:var(--ink-300);letter-spacing:.06em;opacity:0;transform:translateY(8px);transition:all .5s ease 1.8s}
        .ab-spotlight-post.visible{opacity:1;transform:translateY(0)}

        /* ═══ CELEBRATION ═══ */
        .ab-celebration{border:1px solid var(--warm-200);border-radius:14px;overflow:hidden;margin:16px 0;background:#fff;position:relative;min-height:240px}
        .ab-celebration-canvas{position:absolute;inset:0;pointer-events:none;z-index:2}
        .ab-celebration-inner{position:relative;z-index:1;padding:40px 32px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:240px}
        .ab-celebration-icon{font-size:28px;color:var(--ember);margin-bottom:12px}
        .ab-celebration-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--ink-900);margin-bottom:6px}
        .ab-celebration-desc{font-size:14px;color:var(--ink-400);margin-bottom:16px;max-width:360px}
        .ab-celebration-btn{padding:14px 40px;border-radius:8px;border:none;background:var(--ink-900);color:#fff;font-size:16px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .15s}
        .ab-celebration-btn:hover{background:var(--ink-800);transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,0.1)}
        .ab-celebration-success{animation:successIn .6s cubic-bezier(0.16,1,0.3,1)}
        @keyframes successIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
        .ab-celebration-check{width:56px;height:56px;border-radius:50%;background:rgba(90,154,60,0.06);color:#5a9a3c;font-size:26px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;border:1px solid rgba(90,154,60,0.1)}
        .ab-celebration-success-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--ink-900);margin-bottom:4px}
        .ab-celebration-success-sub{font-size:15px;color:var(--ink-400)}

        /* ═══ CASCADE ═══ */
        .ab-cascade{border:1px solid var(--warm-200);border-radius:14px;overflow:hidden;margin:16px 0;background:#fff;padding:28px 20px}
        .ab-cascade-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
        .ab-cascade-item{text-align:center;padding:20px 12px;border:1px solid var(--warm-100);border-radius:10px;opacity:0;transform:translateY(24px) scale(0.95);transition:all .6s cubic-bezier(0.16,1,0.3,1)}
        .ab-cascade-item.visible{opacity:1;transform:translateY(0) scale(1)}
        .ab-cascade-num{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;color:var(--ember);line-height:1;margin-bottom:6px}
        .ab-cascade-label{font-size:13px;color:var(--ink-500);line-height:1.35}

        /* ═══ AMBIENT GRADIENT ═══ */
        .ab-ambient{border-radius:14px;overflow:hidden;margin:16px 0;padding:56px 32px;transition:background 0.5s ease}
        .ab-ambient-content{text-align:center}
        .ab-ambient-mark{font-size:28px;color:var(--ember);opacity:.4;margin-bottom:12px}
        .ab-ambient-quote{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;color:var(--ink-800);line-height:1.35;margin-bottom:12px}
        .ab-ambient-quote em{font-style:italic;color:var(--ember);font-weight:600}
        .ab-ambient-author{font-family:var(--mono);font-size:11px;color:var(--ink-400)}
      `}</style>

      <div className="page"><div className="canvas">
        <h1 className="doc-h1">Animation Blocks</h1>
        <div className="doc-meta"><span>Showstopper moments for proposals</span><span>·</span><span>8 animations</span><span>·</span><span>Type /animate</span></div>

        <div className="cat">hero spotlight</div>
        <p className="doc-p">The client's name appears letter by letter with a staggered spring animation. An ember line draws itself underneath. Use as the first block in any proposal — make it personal from the first pixel.</p>
        <HeroSpotlight />

        <div className="cat">kinetic typography</div>
        <p className="doc-p">Five lines animate in sequence. Each line has its own size, weight, and color. Build a narrative that unfolds as the client reads. This one says: "Your brand is not a logo. It's the feeling people get before they even read a word."</p>
        <KineticType />

        <div className="cat">stat reveal</div>
        <p className="doc-p">Three stats count up when scrolled into view. Each has a progress ring that fills alongside the number. Staggered by 200ms. Use this to show industry data that justifies the investment.</p>
        <StatReveal />

        <div className="cat">ambient gradient</div>
        <p className="doc-p">A slowly breathing warm gradient behind a philosophy quote. The colors shift continuously in the Felmark palette. Feels alive. Use for section breaks or brand philosophy statements.</p>
        <AmbientGradient />

        <div className="cat">number cascade</div>
        <p className="doc-p">Six stats stagger in with scale + fade + slide. The "proof" section of any proposal — years of experience, projects delivered, client satisfaction, revenue generated. The numbers build confidence.</p>
        <NumberCascade />

        <div className="cat">particle logo reveal</div>
        <p className="doc-p">Ember and warm-toned particles float randomly, then coalesce into the client's logo mark. Once formed, the brand name fades in beneath. Use at the start of a brand delivery presentation.</p>
        <ParticleReveal />

        <div className="cat">value counter</div>
        <p className="doc-p">Dark terminal-style block. The estimated brand value counts up to $147,200 with a dramatic 5th-power easing curve. Below: a breakdown showing investment, revenue, retention, and pricing uplift. Ends with "That's a 30× return."</p>
        <ValueCounter />

        <div className="cat">celebration burst</div>
        <p className="doc-p">The final block. "Ready to begin?" — the client clicks "Accept Proposal" and confetti explodes from the center. Multi-colored particles with physics (gravity, air resistance, rotation). The button transforms into "Welcome aboard. Let's build something remarkable."</p>
        <CelebrationBurst />

      </div></div>
    </>
  );
}
