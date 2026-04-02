import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   FELMARK — TSUSHIMA CLOUDS
   Wind. Fog. Embers. Atmosphere.
   ═══════════════════════════════════════════ */

export default function TsushimaDashboard() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, dpr;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Cloud layers ──
    // Each cloud is a collection of overlapping circles
    function makeCloud(baseX, baseY, scale, speed, opacity) {
      const blobs = [];
      const count = 5 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        blobs.push({
          ox: (Math.random() - 0.5) * 120 * scale,
          oy: (Math.random() - 0.5) * 30 * scale,
          r: (20 + Math.random() * 40) * scale,
        });
      }
      return { x: baseX, y: baseY, blobs, speed, opacity, scale };
    }

    // Three layers: far, mid, near
    const farClouds = Array.from({ length: 5 }, () =>
      makeCloud(
        Math.random() * w * 1.5 - w * 0.25,
        30 + Math.random() * h * 0.25,
        0.6 + Math.random() * 0.3,
        0.08 + Math.random() * 0.06,
        0.015 + Math.random() * 0.01
      )
    );

    const midClouds = Array.from({ length: 4 }, () =>
      makeCloud(
        Math.random() * w * 1.5 - w * 0.25,
        h * 0.15 + Math.random() * h * 0.3,
        0.8 + Math.random() * 0.4,
        0.15 + Math.random() * 0.1,
        0.02 + Math.random() * 0.015
      )
    );

    const nearClouds = Array.from({ length: 3 }, () =>
      makeCloud(
        Math.random() * w * 1.5 - w * 0.25,
        h * 0.1 + Math.random() * h * 0.4,
        1.0 + Math.random() * 0.6,
        0.25 + Math.random() * 0.15,
        0.025 + Math.random() * 0.015
      )
    );

    // ── Fog layers ──
    // Wide horizontal bands that drift slowly
    const fogLayers = Array.from({ length: 3 }, (_, i) => ({
      x: Math.random() * w,
      y: h * 0.5 + i * h * 0.12 + Math.random() * h * 0.1,
      width: w * 0.8 + Math.random() * w * 0.6,
      height: 40 + Math.random() * 60,
      speed: 0.04 + Math.random() * 0.04,
      opacity: 0.012 + Math.random() * 0.008,
      phase: Math.random() * Math.PI * 2,
    }));

    // ── Wind streaks ──
    const windStreaks = Array.from({ length: 18 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      length: 40 + Math.random() * 120,
      speed: 1.5 + Math.random() * 2.5,
      opacity: 0.02 + Math.random() * 0.025,
      thickness: 0.3 + Math.random() * 0.5,
      life: Math.random() * 400,
      maxLife: 200 + Math.random() * 300,
    }));

    // ── Ember particles ──
    const embers = Array.from({ length: 14 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0.2 + Math.random() * 0.4,
      vy: -0.1 - Math.random() * 0.3,
      size: 1 + Math.random() * 2,
      opacity: 0.04 + Math.random() * 0.06,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.01,
      color: Math.random() > 0.5 ? "#b07d4f" : Math.random() > 0.5 ? "#c89360" : "#d5d1c8",
    }));

    // ── Dust motes ──
    const dust = Array.from({ length: 30 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.3) * 0.15,
      vy: (Math.random() - 0.5) * 0.08,
      size: 0.5 + Math.random() * 1,
      opacity: 0.02 + Math.random() * 0.03,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    function drawCloud(cloud, color) {
      ctx.fillStyle = color;
      ctx.globalAlpha = cloud.opacity;
      cloud.blobs.forEach(blob => {
        ctx.beginPath();
        ctx.arc(cloud.x + blob.ox, cloud.y + blob.oy, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function drawFog(fog) {
      const breathe = Math.sin(t * 0.0008 + fog.phase) * 0.3 + 0.7;
      ctx.globalAlpha = fog.opacity * breathe;
      ctx.fillStyle = "#d5d1c8";

      // Soft elliptical fog band
      ctx.beginPath();
      ctx.ellipse(
        fog.x + fog.width / 2,
        fog.y,
        fog.width / 2,
        fog.height / 2,
        0, 0, Math.PI * 2
      );
      ctx.fill();
    }

    function animate() {
      t++;
      ctx.clearRect(0, 0, w, h);

      // ── Far clouds (slowest, most transparent) ──
      farClouds.forEach(c => {
        c.x += c.speed;
        c.y += Math.sin(t * 0.001 + c.x * 0.01) * 0.02;
        if (c.x > w + 200) { c.x = -300; c.y = 30 + Math.random() * h * 0.25; }
        drawCloud(c, "#d5d1c8");
      });

      // ── Fog layers ──
      fogLayers.forEach(fog => {
        fog.x += fog.speed;
        if (fog.x > w + fog.width * 0.3) fog.x = -fog.width;
        drawFog(fog);
      });

      // ── Mid clouds ──
      midClouds.forEach(c => {
        c.x += c.speed;
        c.y += Math.sin(t * 0.0015 + c.x * 0.005) * 0.04;
        if (c.x > w + 200) { c.x = -300; c.y = h * 0.15 + Math.random() * h * 0.3; }
        drawCloud(c, "#c8c3b8");
      });

      // ── Near clouds (fastest, most visible) ──
      nearClouds.forEach(c => {
        c.x += c.speed;
        c.y += Math.sin(t * 0.002 + c.x * 0.003) * 0.06;
        if (c.x > w + 300) { c.x = -400; c.y = h * 0.1 + Math.random() * h * 0.4; }
        drawCloud(c, "#b8b3a8");
      });

      // ── Wind streaks ──
      windStreaks.forEach(ws => {
        ws.life++;
        if (ws.life > ws.maxLife) {
          ws.x = -ws.length;
          ws.y = Math.random() * h;
          ws.life = 0;
          ws.maxLife = 200 + Math.random() * 300;
        }

        ws.x += ws.speed;
        ws.y += Math.sin(t * 0.003 + ws.x * 0.01) * 0.15;

        const fadeIn = Math.min(ws.life / 40, 1);
        const fadeOut = Math.max(1 - (ws.life - ws.maxLife + 60) / 60, 0);
        const alpha = ws.opacity * fadeIn * (ws.life > ws.maxLife - 60 ? fadeOut : 1);

        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "#b8b3a8";
        ctx.lineWidth = ws.thickness;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(ws.x, ws.y);

        // Slight curve
        const mx = ws.x + ws.length * 0.5;
        const my = ws.y + Math.sin(t * 0.005 + ws.x * 0.02) * 3;
        ctx.quadraticCurveTo(mx, my, ws.x + ws.length, ws.y + Math.sin(t * 0.003) * 1.5);
        ctx.stroke();
      });

      // ── Ember particles ──
      embers.forEach(e => {
        e.wobblePhase += e.wobbleSpeed;
        e.x += e.vx + Math.sin(e.wobblePhase) * 0.3;
        e.y += e.vy + Math.cos(e.wobblePhase * 0.7) * 0.15;

        // Wrap
        if (e.x > w + 10) { e.x = -10; e.y = Math.random() * h; }
        if (e.y < -10) { e.y = h + 10; e.x = Math.random() * w; }

        const pulse = Math.sin(t * 0.02 + e.wobblePhase) * 0.3 + 0.7;

        // Glow
        ctx.globalAlpha = e.opacity * pulse * 0.3;
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size + 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.globalAlpha = e.opacity * pulse;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Dust motes ──
      dust.forEach(d => {
        d.phase += 0.008;
        d.x += d.vx + Math.sin(d.phase) * 0.05;
        d.y += d.vy + Math.cos(d.phase * 0.6) * 0.03;

        if (d.x > w + 5) d.x = -5;
        if (d.x < -5) d.x = w + 5;
        if (d.y > h + 5) d.y = -5;
        if (d.y < -5) d.y = h + 5;

        const twinkle = Math.sin(t * 0.015 + d.phase * 3) * 0.5 + 0.5;
        ctx.globalAlpha = d.opacity * twinkle;
        ctx.fillStyle = "#d5d1c8";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.ts{position:relative;min-height:100vh;background:var(--parchment);font-family:'Outfit',sans-serif;overflow:hidden}
.ts-canvas{position:fixed;inset:0;z-index:0;pointer-events:none}

/* Dashboard content floats above */
.ts-content{position:relative;z-index:1;max-width:900px;margin:0 auto;padding:40px 28px 80px}

/* Header */
.ts-header{margin-bottom:24px}
.ts-greeting{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:500;color:var(--ink-900);margin-bottom:4px;line-height:1.15}
.ts-greeting em{color:var(--ember);font-style:normal}
.ts-date{font-family:var(--mono);font-size:11px;color:var(--ink-300)}

/* Stats */
.ts-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px}
.ts-stat{background:rgba(255,255,255,0.7);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--warm-200);border-radius:10px;padding:16px;transition:all .15s}
.ts-stat:hover{background:rgba(255,255,255,0.85);transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,0.03)}
.ts-stat-val{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;line-height:1}
.ts-stat-label{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.04em;margin-top:3px}

/* Cards */
.ts-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ts-card{background:rgba(255,255,255,0.65);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--warm-200);border-radius:10px;overflow:hidden;transition:all .15s}
.ts-card:hover{background:rgba(255,255,255,0.8);box-shadow:0 4px 16px rgba(0,0,0,0.03)}
.ts-card-head{padding:12px 16px;border-bottom:1px solid var(--warm-100);display:flex;align-items:center;justify-content:space-between}
.ts-card-title{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:var(--ink-900)}
.ts-card-badge{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.ts-card-body{padding:12px 16px}

/* Activity items */
.ts-act{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--warm-100)}
.ts-act:last-child{border-bottom:none}
.ts-act-ic{width:24px;height:24px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;flex-shrink:0;border:1px solid}
.ts-act-info{flex:1;min-width:0}
.ts-act-text{font-size:13px;font-weight:500;color:var(--ink-700)}
.ts-act-sub{font-size:11px;color:var(--ink-300);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ts-act-time{font-family:var(--mono);font-size:9px;color:var(--ink-300);flex-shrink:0}

/* Workspace items */
.ts-ws{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--warm-100)}
.ts-ws:last-child{border-bottom:none}
.ts-ws-av{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#fff;flex-shrink:0}
.ts-ws-info{flex:1;min-width:0}
.ts-ws-name{font-size:13px;font-weight:500;color:var(--ink-700)}
.ts-ws-meta{font-size:11px;color:var(--ink-300)}
.ts-ws-val{font-family:var(--mono);font-size:12px;font-weight:600;color:var(--ink-700);flex-shrink:0}

/* Deadlines */
.ts-dl{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--warm-100)}
.ts-dl:last-child{border-bottom:none}
.ts-dl-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.ts-dl-info{flex:1}
.ts-dl-name{font-size:13px;font-weight:500;color:var(--ink-700)}
.ts-dl-client{font-size:11px;color:var(--ink-300)}
.ts-dl-days{font-family:var(--mono);font-size:11px;font-weight:500;flex-shrink:0}

/* Pipeline mini */
.ts-pipe{display:flex;gap:4px;margin-top:4px}
.ts-pipe-stage{flex:1;text-align:center}
.ts-pipe-bar{height:4px;border-radius:2px;margin-bottom:4px}
.ts-pipe-label{font-family:var(--mono);font-size:8px;color:var(--ink-300)}
.ts-pipe-count{font-family:var(--mono);font-size:12px;font-weight:600;color:var(--ink-700)}

/* Full width card */
.ts-full{grid-column:1/-1}

/* Attribution */
.ts-attr{text-align:center;margin-top:28px;font-family:var(--mono);font-size:9px;color:var(--ink-300);opacity:0.4}
      `}</style>

      <div className="ts">
        {/* Tsushima canvas */}
        <canvas ref={canvasRef} className="ts-canvas" />

        {/* Dashboard content - glass morphism cards */}
        <div className="ts-content">

          {/* Greeting */}
          <div className="ts-header">
            <div className="ts-greeting">Good evening. <em>Let's build.</em></div>
            <div className="ts-date">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · {new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</div>
          </div>

          {/* Stats */}
          <div className="ts-stats">
            <div className="ts-stat">
              <div className="ts-stat-val" style={{ color: "#5a9a3c" }}>$14,800</div>
              <div className="ts-stat-label">Earned this month</div>
            </div>
            <div className="ts-stat">
              <div className="ts-stat-val" style={{ color: "var(--ember)" }}>$36,700</div>
              <div className="ts-stat-label">Total pipeline</div>
            </div>
            <div className="ts-stat">
              <div className="ts-stat-val" style={{ color: "#5b7fa4" }}>$112/hr</div>
              <div className="ts-stat-label">Effective rate</div>
            </div>
            <div className="ts-stat">
              <div className="ts-stat-val" style={{ color: "#7c6b9e" }}>32h</div>
              <div className="ts-stat-label">Hours this week</div>
            </div>
          </div>

          {/* Grid */}
          <div className="ts-grid">

            {/* Activity */}
            <div className="ts-card">
              <div className="ts-card-head">
                <span className="ts-card-title">Activity</span>
                <span className="ts-card-badge">6 events</span>
              </div>
              <div className="ts-card-body">
                {[
                  { ic: "$", col: "#5a9a3c", t: "Payment received", s: "$1,800 from Nora Kim", time: "32m" },
                  { ic: "◎", col: "#5b7fa4", t: "Invoice viewed", s: "Sarah · Meridian Studio", time: "1h" },
                  { ic: "✓", col: "#5a9a3c", t: "Proposal signed", s: "Nora Kim · $3,200", time: "3h" },
                  { ic: "!", col: "#c24b38", t: "Invoice overdue", s: "Bolt Fitness · $4,000", time: "1d" },
                ].map((a, i) => (
                  <div key={i} className="ts-act">
                    <div className="ts-act-ic" style={{ color: a.col, background: a.col + "06", borderColor: a.col + "12" }}>{a.ic}</div>
                    <div className="ts-act-info">
                      <div className="ts-act-text">{a.t}</div>
                      <div className="ts-act-sub">{a.s}</div>
                    </div>
                    <span className="ts-act-time">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Workspaces */}
            <div className="ts-card">
              <div className="ts-card-head">
                <span className="ts-card-title">Workspaces</span>
                <span className="ts-card-badge">4 clients</span>
              </div>
              <div className="ts-card-body">
                {[
                  { av: "M", col: "#7c8594", n: "Meridian Studio", m: "3 projects · Active", v: "$4,200" },
                  { av: "N", col: "#a08472", n: "Nora Kim", m: "2 projects · Active", v: "$3,200" },
                  { av: "B", col: "#8a7e63", n: "Bolt Fitness", m: "1 project · Overdue", v: "$4,000" },
                  { av: "L", col: "#7c6b9e", n: "Luna Boutique", m: "Lead · New", v: "—" },
                ].map((ws, i) => (
                  <div key={i} className="ts-ws">
                    <div className="ts-ws-av" style={{ background: ws.col }}>{ws.av}</div>
                    <div className="ts-ws-info">
                      <div className="ts-ws-name">{ws.n}</div>
                      <div className="ts-ws-meta">{ws.m}</div>
                    </div>
                    <span className="ts-ws-val">{ws.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deadlines */}
            <div className="ts-card">
              <div className="ts-card-head">
                <span className="ts-card-title">Upcoming</span>
                <span className="ts-card-badge">Next 14 days</span>
              </div>
              <div className="ts-card-body">
                {[
                  { n: "Brand Guidelines v2", c: "Meridian", days: "3d", col: "#c24b38" },
                  { n: "Logo Concepts", c: "Nora Kim", days: "5d", col: "#c89360" },
                  { n: "Proposal Review", c: "Luna Boutique", days: "8d", col: "#5a9a3c" },
                  { n: "Final Delivery", c: "Meridian", days: "12d", col: "#5a9a3c" },
                ].map((d, i) => (
                  <div key={i} className="ts-dl">
                    <div className="ts-dl-dot" style={{ background: d.col }} />
                    <div className="ts-dl-info">
                      <div className="ts-dl-name">{d.n}</div>
                      <div className="ts-dl-client">{d.c}</div>
                    </div>
                    <span className="ts-dl-days" style={{ color: d.col }}>{d.days}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline */}
            <div className="ts-card">
              <div className="ts-card-head">
                <span className="ts-card-title">Pipeline</span>
                <span className="ts-card-badge">$36,700 total</span>
              </div>
              <div className="ts-card-body">
                <div className="ts-pipe">
                  {[
                    { label: "Lead", count: 2, val: 8, col: "var(--warm-300)" },
                    { label: "Proposal", count: 3, val: 6, col: "var(--ember)" },
                    { label: "Contract", count: 1, val: 4, col: "#5b7fa4" },
                    { label: "Active", count: 3, val: 10, col: "#5a9a3c" },
                    { label: "Invoice", count: 1, val: 3, col: "#7c6b9e" },
                  ].map((s, i) => (
                    <div key={i} className="ts-pipe-stage">
                      <div className="ts-pipe-bar" style={{ background: s.col, opacity: 0.25 + (s.val / 10) * 0.5 }} />
                      <div className="ts-pipe-count">{s.count}</div>
                      <div className="ts-pipe-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="ts-attr">wind carries those who ship · felmark</div>
        </div>
      </div>
    </>
  );
}
