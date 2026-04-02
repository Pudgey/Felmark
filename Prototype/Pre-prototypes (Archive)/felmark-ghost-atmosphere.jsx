import { useState, useEffect, useRef } from "react";

function Atmosphere() {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let w, h, frame;

    const resize = () => {
      w = c.parentElement.offsetWidth;
      h = c.parentElement.offsetHeight;
      c.width = w * 2;
      c.height = h * 2;
      ctx.setTransform(2, 0, 0, 2, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // ── CLOUDS — big visible rolling shapes ──
    const clouds = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * w * 1.5 - w * 0.25,
      y: h * 0.1 + i * (h * 0.18),
      rx: 200 + Math.random() * 350,
      ry: 30 + Math.random() * 50,
      speed: 0.12 + Math.random() * 0.18,
      baseOpacity: 0.06 + Math.random() * 0.06,
      phase: Math.random() * Math.PI * 2,
      color: i % 3 === 0 ? [176, 125, 79] : i % 3 === 1 ? [200, 147, 96] : [213, 209, 200],
    }));

    // ── FOG BANKS — thick drifting layers ──
    const fogs = Array.from({ length: 4 }, (_, i) => ({
      x: -300 + Math.random() * w,
      y: h * 0.35 + Math.random() * h * 0.4,
      rx: 250 + Math.random() * 400,
      ry: 40 + Math.random() * 70,
      speed: 0.06 + Math.random() * 0.1,
      opacity: 0.05 + Math.random() * 0.05,
      phase: Math.random() * Math.PI * 2,
      drift: 15 + Math.random() * 20,
    }));

    // ── EMBERS — warm floating dots ──
    const embers = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 1 + Math.random() * 3,
      vx: 0.1 + Math.random() * 0.4,
      vy: (Math.random() - 0.5) * 0.15,
      phase: Math.random() * Math.PI * 2,
      wobble: 0.004 + Math.random() * 0.008,
      wobbleAmp: 8 + Math.random() * 16,
      baseAlpha: 0.08 + Math.random() * 0.15,
      twinkleSpeed: 0.015 + Math.random() * 0.025,
      hue: Math.random(), // color picker
    }));

    // ── WIND STREAKS — visible sweeping lines ──
    const streaks = Array.from({ length: 6 }, () => ({
      x: -300,
      y: 0,
      len: 100 + Math.random() * 250,
      speed: 2 + Math.random() * 3,
      thick: 0.5 + Math.random() * 1,
      alpha: 0,
      maxAlpha: 0.06 + Math.random() * 0.08,
      active: false,
      cooldown: Math.floor(Math.random() * 300),
    }));

    // ── PETALS — tumbling leaves ──
    const petals = Array.from({ length: 14 }, () => ({
      x: Math.random() * w * 1.3 - w * 0.15,
      y: Math.random() * h,
      size: 3 + Math.random() * 6,
      vx: 0.2 + Math.random() * 0.6,
      vy: 0.03 + Math.random() * 0.12,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.04,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleFreq: 0.006 + Math.random() * 0.012,
      wobbleAmp: 12 + Math.random() * 25,
      alpha: 0.06 + Math.random() * 0.1,
      shape: Math.floor(Math.random() * 3),
      color: Math.random() > 0.5 ? "#b07d4f" : Math.random() > 0.5 ? "#c89360" : "#d5d1c8",
    }));

    let t = 0;

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, w, h);

      // ── CLOUDS ──
      clouds.forEach(cl => {
        cl.x += cl.speed;
        if (cl.x - cl.rx > w + 50) cl.x = -cl.rx - 50;

        const breathe = 0.7 + Math.sin(t * 0.003 + cl.phase) * 0.3;
        const a = cl.baseOpacity * breathe;

        const g = ctx.createRadialGradient(cl.x, cl.y, 0, cl.x, cl.y, cl.rx);
        g.addColorStop(0, `rgba(${cl.color[0]},${cl.color[1]},${cl.color[2]},${a})`);
        g.addColorStop(0.4, `rgba(${cl.color[0]},${cl.color[1]},${cl.color[2]},${a * 0.5})`);
        g.addColorStop(1, `rgba(${cl.color[0]},${cl.color[1]},${cl.color[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(cl.x, cl.y, cl.rx, cl.ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── FOG ──
      fogs.forEach(f => {
        f.x += f.speed;
        const yOff = Math.sin(t * 0.002 + f.phase) * f.drift;
        if (f.x - f.rx > w + 100) { f.x = -f.rx - 100; f.y = h * 0.3 + Math.random() * h * 0.45; }

        const breathe = 0.6 + Math.sin(t * 0.004 + f.phase) * 0.4;
        const a = f.opacity * breathe;
        const cy = f.y + yOff;

        const g = ctx.createRadialGradient(f.x, cy, 0, f.x, cy, f.rx);
        g.addColorStop(0, `rgba(213,209,200,${a})`);
        g.addColorStop(0.5, `rgba(213,209,200,${a * 0.4})`);
        g.addColorStop(1, "rgba(213,209,200,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(f.x, cy, f.rx, f.ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── WIND STREAKS ──
      streaks.forEach(s => {
        if (!s.active) {
          s.cooldown--;
          if (s.cooldown <= 0) {
            s.active = true;
            s.x = -s.len;
            s.y = h * 0.1 + Math.random() * h * 0.7;
            s.alpha = 0;
          }
          return;
        }
        s.x += s.speed;
        const progress = (s.x + s.len) / (w + s.len * 2);
        if (progress < 0.2) s.alpha = s.maxAlpha * (progress / 0.2);
        else if (progress > 0.8) s.alpha = s.maxAlpha * ((1 - progress) / 0.2);
        else s.alpha = s.maxAlpha;

        if (s.x > w + 100) {
          s.active = false;
          s.cooldown = 150 + Math.floor(Math.random() * 300);
        }

        const curve = Math.sin(t * 0.008 + s.y * 0.01) * 5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.quadraticCurveTo(s.x + s.len * 0.5, s.y + curve, s.x + s.len, s.y + curve * 0.5);
        ctx.strokeStyle = `rgba(176,125,79,${s.alpha})`;
        ctx.lineWidth = s.thick;
        ctx.lineCap = "round";
        ctx.stroke();
      });

      // ── PETALS ──
      petals.forEach(p => {
        p.x += p.vx + Math.sin(t * p.wobbleFreq + p.wobblePhase) * p.wobbleAmp * 0.015;
        p.y += p.vy;
        p.rot += p.rotV;

        if (p.x > w + 30) { p.x = -30; p.y = Math.random() * h; }
        if (p.y > h + 30) { p.y = -20; }

        const pulse = 0.6 + Math.sin(t * 0.006 + p.wobblePhase) * 0.4;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha * pulse;
        ctx.fillStyle = p.color;

        if (p.shape === 0) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 1) {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.6, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.6, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 1.2, -p.size * 0.3, p.size, p.size * 0.6, 0, p.size);
          ctx.bezierCurveTo(-p.size, p.size * 0.6, -p.size * 1.2, -p.size * 0.3, 0, -p.size);
          ctx.fill();
        }

        ctx.restore();
        ctx.globalAlpha = 1;
      });

      // ── EMBERS ──
      embers.forEach(e => {
        e.x += e.vx;
        e.y += e.vy + Math.sin(t * e.wobble + e.phase) * 0.1;
        const wx = Math.sin(t * e.wobble * 0.7 + e.phase * 2) * e.wobbleAmp * 0.015;

        if (e.x > w + 15) { e.x = -15; e.y = Math.random() * h; }
        if (e.y < -15) e.y = h + 10;
        if (e.y > h + 15) e.y = -10;

        const twinkle = 0.3 + (Math.sin(t * e.twinkleSpeed + e.phase * 5) * 0.5 + 0.5) * 0.7;
        const a = e.baseAlpha * twinkle;
        const dx = e.x + wx;

        // Color
        let r, g, b;
        if (e.hue < 0.35) { r = 176; g = 125; b = 79; }
        else if (e.hue < 0.6) { r = 200; g = 147; b = 96; }
        else if (e.hue < 0.8) { r = 213; g = 209; b = 200; }
        else { r = 192; g = 168; b = 126; }

        // Glow halo
        if (e.size > 1.5) {
          ctx.beginPath();
          ctx.arc(dx, e.y, e.size + 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.2})`;
          ctx.fill();
        }

        // Core
        ctx.beginPath();
        ctx.arc(dx, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fill();
      });

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

export default function GhostDashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.gd{font-family:'Outfit',sans-serif;background:var(--parchment);min-height:100vh;position:relative;overflow:hidden}
.gd-atmos{position:absolute;inset:0;z-index:0}
.gd-content{position:relative;z-index:1;max-width:960px;margin:0 auto;padding:40px 32px 60px}

.gd-greet{margin-bottom:24px}
.gd-greet-text{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:500;color:var(--ink-900);line-height:1.2;margin-bottom:4px}
.gd-greet-text em{color:var(--ember);font-style:normal}
.gd-greet-sub{font-family:var(--mono);font-size:11px;color:var(--ink-300)}

.gd-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px}
.gd-stat{background:rgba(255,255,255,0.75);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(229,226,219,0.6);border-radius:10px;padding:16px;transition:transform .15s,box-shadow .15s}
.gd-stat:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,0.03)}
.gd-stat-val{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;line-height:1}
.gd-stat-label{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.05em;margin-top:4px}

.gd-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.gd-card{background:rgba(255,255,255,0.7);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(229,226,219,0.5);border-radius:10px;padding:18px}
.gd-card-title{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:var(--ink-900);margin-bottom:12px}

.gd-act{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--warm-100)}
.gd-act:last-child{border-bottom:none}
.gd-act-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.gd-act-text{font-size:13px;color:var(--ink-600);flex:1}
.gd-act-time{font-family:var(--mono);font-size:9px;color:var(--ink-300)}

.gd-proj{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--warm-100)}
.gd-proj:last-child{border-bottom:none}
.gd-proj-av{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#fff;flex-shrink:0}
.gd-proj-info{flex:1}
.gd-proj-name{font-size:13px;font-weight:500;color:var(--ink-700)}
.gd-proj-client{font-size:11px;color:var(--ink-300)}
.gd-proj-amt{font-family:var(--mono);font-size:12px;font-weight:500;color:var(--ink-700)}
      `}</style>

      <div className="gd">
        {/* Atmosphere layer */}
        <div className="gd-atmos">
          <Atmosphere />
        </div>

        {/* Dashboard content */}
        <div className="gd-content">
          <div className="gd-greet">
            <div className="gd-greet-text">{greeting}. <em>Let's build.</em></div>
            <div className="gd-greet-sub">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>

          <div className="gd-stats">
            {[
              { v: "$14,800", l: "Earned this month", c: "#5a9a3c" },
              { v: "$36,700", l: "Total pipeline", c: "#b07d4f" },
              { v: "$112/hr", l: "Effective rate", c: "#5b7fa4" },
              { v: "32h", l: "Hours this week", c: "#7c6b9e" },
            ].map((s, i) => (
              <div key={i} className="gd-stat">
                <div className="gd-stat-val" style={{ color: s.c }}>{s.v}</div>
                <div className="gd-stat-label">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="gd-grid">
            <div className="gd-card">
              <div className="gd-card-title">Recent activity</div>
              {[
                { d: "#5a9a3c", t: "Payment received — $1,800 from Nora", tm: "32m" },
                { d: "#5b7fa4", t: "Invoice viewed — Meridian Studio", tm: "1h" },
                { d: "#b07d4f", t: "Proposal sent — Luna · $6,500", tm: "3h" },
                { d: "#5a9a3c", t: "Contract signed — Nora · $3,200", tm: "5h" },
                { d: "#c24b38", t: "Invoice overdue — Bolt · $4,000", tm: "1d" },
              ].map((a, i) => (
                <div key={i} className="gd-act">
                  <div className="gd-act-dot" style={{ background: a.d }} />
                  <div className="gd-act-text">{a.t}</div>
                  <div className="gd-act-time">{a.tm}</div>
                </div>
              ))}
            </div>

            <div className="gd-card">
              <div className="gd-card-title">Active projects</div>
              {[
                { av: "M", c: "#7c8594", n: "Brand Guidelines v2", cl: "Meridian Studio", a: "$4,200" },
                { av: "N", c: "#a08472", n: "Course Landing Page", cl: "Nora Kim", a: "$3,200" },
                { av: "B", c: "#8a7e63", n: "App Onboarding Flow", cl: "Bolt Fitness", a: "$4,000" },
                { av: "L", c: "#7c6b9e", n: "Brand Identity", cl: "Luna Boutique", a: "$6,500" },
              ].map((p, i) => (
                <div key={i} className="gd-proj">
                  <div className="gd-proj-av" style={{ background: p.c }}>{p.av}</div>
                  <div className="gd-proj-info">
                    <div className="gd-proj-name">{p.n}</div>
                    <div className="gd-proj-client">{p.cl}</div>
                  </div>
                  <div className="gd-proj-amt">{p.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
