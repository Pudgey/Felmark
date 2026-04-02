import { useRef, useEffect, useState, useCallback } from "react";

const MONTHLY_DATA = [
  { month: "Apr", year: "25", revenue: 3200, projects: 2 },
  { month: "May", year: "25", revenue: 5800, projects: 3 },
  { month: "Jun", year: "25", revenue: 4100, projects: 2 },
  { month: "Jul", year: "25", revenue: 7600, projects: 4 },
  { month: "Aug", year: "25", revenue: 6200, projects: 3 },
  { month: "Sep", year: "25", revenue: 9400, projects: 5 },
  { month: "Oct", year: "25", revenue: 8200, projects: 4 },
  { month: "Nov", year: "25", revenue: 11400, projects: 5 },
  { month: "Dec", year: "25", revenue: 9800, projects: 4 },
  { month: "Jan", year: "26", revenue: 13200, projects: 6 },
  { month: "Feb", year: "26", revenue: 10600, projects: 5 },
  { month: "Mar", year: "26", revenue: 14800, projects: 6, current: true },
];

const MAX_REV = Math.max(...MONTHLY_DATA.map(d => d.revenue));
const TOTAL_REV = MONTHLY_DATA.reduce((s, d) => s + d.revenue, 0);

export default function RevenueLandscape() {
  const canvasRef = useRef(null);
  const stateRef = useRef({ time: 0, hoverX: -1, hoverY: -1, drawProgress: 0, particles: [] });
  const [hoverInfo, setHoverInfo] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => { setTimeout(() => setRevealed(true), 300); }, []);

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    stateRef.current.hoverX = (e.clientX - rect.left) * 2;
    stateRef.current.hoverY = (e.clientY - rect.top) * 2;

    // Determine which month is hovered
    const relX = (e.clientX - rect.left) / rect.width;
    const monthIdx = Math.floor(relX * MONTHLY_DATA.length);
    if (monthIdx >= 0 && monthIdx < MONTHLY_DATA.length) {
      setHoverInfo({
        ...MONTHLY_DATA[monthIdx],
        idx: monthIdx,
        screenX: e.clientX - rect.left,
        screenY: e.clientY - rect.top,
      });
    } else {
      setHoverInfo(null);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    stateRef.current.hoverX = -1;
    setHoverInfo(null);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const state = stateRef.current;

    // Interpolate data to smooth terrain
    const getHeight = (xNorm) => {
      const idx = xNorm * (MONTHLY_DATA.length - 1);
      const i = Math.floor(idx);
      const frac = idx - i;
      const a = MONTHLY_DATA[Math.min(i, MONTHLY_DATA.length - 1)].revenue;
      const b = MONTHLY_DATA[Math.min(i + 1, MONTHLY_DATA.length - 1)].revenue;

      // Cubic interpolation for smoother curves
      const prev = MONTHLY_DATA[Math.max(i - 1, 0)].revenue;
      const next2 = MONTHLY_DATA[Math.min(i + 2, MONTHLY_DATA.length - 1)].revenue;

      const t = frac;
      const t2 = t * t;
      const t3 = t2 * t;

      const v = 0.5 * (
        (2 * a) +
        (-prev + b) * t +
        (2 * prev - 5 * a + 4 * b - next2) * t2 +
        (-prev + 3 * a - 3 * b + next2) * t3
      );

      return Math.max(0, v) / MAX_REV;
    };

    // Terrain noise
    const noise = (x, y) => {
      const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };

    const perlin1D = (x, freq, seed) => {
      const xf = x * freq;
      const xi = Math.floor(xf);
      const frac = xf - xi;
      const smooth = frac * frac * (3 - 2 * frac);
      const a = noise(xi, seed);
      const b = noise(xi + 1, seed);
      return a + (b - a) * smooth;
    };

    const draw = () => {
      state.time += 0.016;
      const w = canvas.width;
      const h = canvas.height;

      // Draw progress (animate terrain reveal)
      if (state.drawProgress < 1) {
        state.drawProgress = Math.min(1, state.drawProgress + 0.008);
      }

      // ── Background ──
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "#faf9f7");
      bgGrad.addColorStop(0.3, "#f8f6f2");
      bgGrad.addColorStop(1, "#f2efe8");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // ── Terrain parameters ──
      const margin = { top: h * 0.18, bottom: h * 0.22, left: w * 0.06, right: w * 0.06 };
      const terrainW = w - margin.left - margin.right;
      const terrainH = h - margin.top - margin.bottom;
      const numContours = 18;
      const numSlices = 200;

      // ── Draw contour layers (back to front) ──
      for (let c = numContours; c >= 0; c--) {
        const elevation = c / numContours; // 0 = base, 1 = peak
        const progress = state.drawProgress;

        // Color based on elevation
        const r = Math.round(230 + elevation * 25); // warm up
        const g = Math.round(225 - elevation * 55);
        const b = Math.round(215 - elevation * 95);
        const baseAlpha = 0.03 + elevation * 0.05;

        ctx.beginPath();

        // Start from bottom-left
        const baseY = margin.top + terrainH * (1 - elevation * 0.05);

        let started = false;
        let lastDrawnX = 0;

        for (let s = 0; s <= numSlices; s++) {
          const xNorm = s / numSlices;
          const drawLimit = progress;

          if (xNorm > drawLimit) break;

          const x = margin.left + xNorm * terrainW;
          const heightVal = getHeight(xNorm);

          // Only draw contour where terrain is above this elevation
          const terrainElevation = heightVal;
          if (terrainElevation < elevation) {
            if (started) {
              ctx.lineTo(x, baseY);
              started = false;
            }
            continue;
          }

          // Height above contour level
          const aboveContour = (terrainElevation - elevation) * terrainH * 0.75;

          // Add terrain noise for organic feel
          const noiseVal = perlin1D(xNorm, 8, c * 7.1) * 8 + perlin1D(xNorm, 16, c * 3.7) * 4;

          const y = baseY - aboveContour + noiseVal;

          if (!started) {
            ctx.moveTo(x, baseY);
            ctx.lineTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
          lastDrawnX = x;
        }

        if (started) {
          ctx.lineTo(lastDrawnX, baseY);
          ctx.closePath();

          // Fill
          const fillGrad = ctx.createLinearGradient(0, margin.top, 0, margin.top + terrainH);
          const emberMix = elevation;
          fillGrad.addColorStop(0, `rgba(${176 + emberMix * 30}, ${125 + emberMix * 10}, ${79}, ${baseAlpha * 1.5})`);
          fillGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${baseAlpha})`);
          ctx.fillStyle = fillGrad;
          ctx.fill();

          // Contour line
          ctx.strokeStyle = `rgba(176, 125, 79, ${0.04 + elevation * 0.08})`;
          ctx.lineWidth = elevation > 0.7 ? 1.5 : 0.8;
          ctx.stroke();
        }
      }

      // ── Peak markers ──
      MONTHLY_DATA.forEach((d, i) => {
        const xNorm = (i + 0.5) / MONTHLY_DATA.length;
        if (xNorm > state.drawProgress) return;

        const x = margin.left + xNorm * terrainW;
        const heightVal = d.revenue / MAX_REV;
        const baseY = margin.top + terrainH * 0.95;
        const peakY = baseY - heightVal * terrainH * 0.75;

        // Peak dot for high months
        if (heightVal > 0.6) {
          ctx.beginPath();
          ctx.arc(x, peakY + 10, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(176, 125, 79, ${0.15 + heightVal * 0.2})`;
          ctx.fill();

          // Glow
          const glow = ctx.createRadialGradient(x, peakY + 10, 0, x, peakY + 10, 16);
          glow.addColorStop(0, `rgba(176, 125, 79, 0.08)`);
          glow.addColorStop(1, "rgba(176, 125, 79, 0)");
          ctx.fillStyle = glow;
          ctx.fillRect(x - 16, peakY - 6, 32, 32);
        }
      });

      // ── Drawing edge (current month) ──
      if (state.drawProgress < 1) {
        const edgeX = margin.left + state.drawProgress * terrainW;

        // Animated drawing particles at edge
        if (Math.random() < 0.3) {
          const heightVal = getHeight(state.drawProgress);
          const baseY = margin.top + terrainH * 0.95;
          const edgeY = baseY - heightVal * terrainH * 0.75;

          state.particles.push({
            x: edgeX,
            y: edgeY + (Math.random() - 0.5) * 40,
            vx: Math.random() * 1.5 + 0.5,
            vy: (Math.random() - 0.5) * 0.8,
            life: 1,
            decay: 0.015 + Math.random() * 0.01,
            size: Math.random() * 2 + 0.5,
          });
        }

        // Edge line
        ctx.beginPath();
        ctx.moveTo(edgeX, margin.top);
        ctx.lineTo(edgeX, margin.top + terrainH);
        ctx.strokeStyle = "rgba(176, 125, 79, 0.08)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // ── Particles ──
      state.particles = state.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(176, 125, 79, ${p.life * 0.4})`;
        ctx.fill();
        return true;
      });

      // ── Month labels ──
      ctx.font = `${w * 0.013}px 'JetBrains Mono', monospace`;
      ctx.textAlign = "center";

      MONTHLY_DATA.forEach((d, i) => {
        const xNorm = (i + 0.5) / MONTHLY_DATA.length;
        if (xNorm > state.drawProgress + 0.02) return;

        const x = margin.left + xNorm * terrainW;
        const labelY = margin.top + terrainH + w * 0.025;

        const alpha = d.current ? 0.7 : 0.3;
        ctx.fillStyle = `rgba(44, 42, 37, ${alpha})`;
        ctx.fillText(d.month, x, labelY);

        if (d.year === "26" && (d.month === "Jan" || d.current)) {
          ctx.fillStyle = "rgba(44, 42, 37, 0.15)";
          ctx.fillText("'" + d.year, x, labelY + w * 0.016);
        }
      });

      // ── Hover crosshair ──
      if (state.hoverX > 0 && hoverInfo) {
        const hx = state.hoverX;

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(hx, margin.top);
        ctx.lineTo(hx, margin.top + terrainH);
        ctx.strokeStyle = "rgba(176, 125, 79, 0.15)";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Dot on terrain
        const xNorm = (hx - margin.left) / terrainW;
        if (xNorm >= 0 && xNorm <= 1) {
          const heightVal = getHeight(Math.min(xNorm, state.drawProgress));
          const baseY = margin.top + terrainH * 0.95;
          const dotY = baseY - heightVal * terrainH * 0.75;

          ctx.beginPath();
          ctx.arc(hx, dotY + 10, 5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(176, 125, 79, 0.3)";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(hx, dotY + 10, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#b07d4f";
          ctx.fill();
        }
      }

      // ── Elevation legend (left side) ──
      const legendX = margin.left - w * 0.01;
      const legendTop = margin.top + terrainH * 0.1;
      const legendBottom = margin.top + terrainH * 0.9;
      const legendSteps = 5;

      ctx.font = `${w * 0.011}px 'JetBrains Mono', monospace`;
      ctx.textAlign = "right";

      for (let i = 0; i <= legendSteps; i++) {
        const frac = i / legendSteps;
        const y = legendBottom - frac * (legendBottom - legendTop);
        const val = frac * MAX_REV;

        ctx.fillStyle = "rgba(44, 42, 37, 0.12)";
        ctx.fillText(`$${(val / 1000).toFixed(0)}k`, legendX - 4, y + 3);

        // Tick
        ctx.beginPath();
        ctx.moveTo(legendX, y);
        ctx.lineTo(legendX + 6, y);
        ctx.strokeStyle = "rgba(44, 42, 37, 0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [hoverInfo]);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
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

        .landscape {
          width: 100%; height: 100vh; position: relative;
          overflow: hidden; background: var(--parchment);
        }

        .ls-canvas {
          position: absolute; inset: 0; width: 100%; height: 100%;
          cursor: crosshair;
        }

        /* ── Header overlay ── */
        .ls-header {
          position: absolute; top: 28px; left: 36px;
          z-index: 2; pointer-events: none;
          opacity: 0; animation: lsReveal 1s ease 0.5s forwards;
        }
        .ls-badge {
          font-family: var(--mono); font-size: 9px; font-weight: 500;
          color: var(--ember); letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 6px;
        }
        .ls-title {
          font-family: 'Cormorant Garamond', serif; font-size: 28px;
          font-weight: 500; color: var(--ink-800); letter-spacing: -0.01em;
        }
        .ls-sub {
          font-family: 'Outfit', sans-serif; font-size: 13px;
          color: var(--ink-400); margin-top: 4px;
        }

        /* ── Stats overlay (top-right) ── */
        .ls-stats {
          position: absolute; top: 28px; right: 36px;
          z-index: 2; display: flex; gap: 20px; pointer-events: none;
          opacity: 0; animation: lsReveal 1s ease 0.8s forwards;
        }
        .ls-stat { text-align: right; }
        .ls-stat-val {
          font-family: 'Cormorant Garamond', serif; font-size: 24px;
          font-weight: 600; color: var(--ink-800); line-height: 1;
        }
        .ls-stat-val.ember { color: var(--ember); }
        .ls-stat-label {
          font-family: var(--mono); font-size: 9px; color: var(--ink-400);
          text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px;
        }

        /* ── Hover tooltip ── */
        .ls-tooltip {
          position: absolute; z-index: 10;
          background: #fff; border: 1px solid var(--warm-200);
          border-radius: 10px; padding: 12px 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          pointer-events: none; min-width: 160px;
          animation: lsTooltipIn 0.12s ease;
          transform: translate(-50%, calc(-100% - 20px));
        }
        .ls-tt-month {
          font-family: var(--mono); font-size: 10px; color: var(--ink-400);
          text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;
        }
        .ls-tt-revenue {
          font-family: 'Cormorant Garamond', serif; font-size: 24px;
          font-weight: 600; color: var(--ink-900); line-height: 1;
        }
        .ls-tt-row {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 6px; padding-top: 6px; border-top: 1px solid var(--warm-100);
          gap: 12px;
        }
        .ls-tt-label { font-size: 12px; color: var(--ink-400); }
        .ls-tt-val { font-family: var(--mono); font-size: 12px; color: var(--ink-700); font-weight: 500; }
        .ls-tt-val.up { color: #5a9a3c; }
        .ls-tt-val.down { color: #c24b38; }
        .ls-tt-current {
          display: inline-flex; align-items: center; gap: 4px;
          font-family: var(--mono); font-size: 9px; color: var(--ember);
          background: var(--ember-bg); padding: 1px 6px; border-radius: 3px;
          margin-top: 6px;
        }
        .ls-tt-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--ember); }

        /* ── Legend ── */
        .ls-legend {
          position: absolute; bottom: 24px; right: 36px;
          z-index: 2; display: flex; align-items: center; gap: 16px;
          pointer-events: none;
          opacity: 0; animation: lsReveal 1s ease 1.2s forwards;
        }
        .ls-legend-item {
          display: flex; align-items: center; gap: 6px;
          font-family: var(--mono); font-size: 10px; color: var(--ink-400);
        }
        .ls-legend-swatch {
          width: 16px; height: 8px; border-radius: 2px;
        }

        .ls-footer-left {
          position: absolute; bottom: 24px; left: 36px;
          z-index: 2; font-family: var(--mono); font-size: 10px;
          color: var(--ink-300); pointer-events: none;
          opacity: 0; animation: lsReveal 1s ease 1s forwards;
        }

        @keyframes lsReveal {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lsTooltipIn {
          from { opacity: 0; transform: translate(-50%, calc(-100% - 12px)); }
          to { opacity: 1; transform: translate(-50%, calc(-100% - 20px)); }
        }
      `}</style>

      <div className="landscape">
        <canvas
          ref={canvasRef}
          className="ls-canvas"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {/* Header */}
        <div className="ls-header">
          <div className="ls-badge">revenue landscape</div>
          <h1 className="ls-title">12-month terrain</h1>
          <p className="ls-sub">Higher peaks = higher revenue · hover to explore</p>
        </div>

        {/* Stats */}
        <div className="ls-stats">
          <div className="ls-stat">
            <div className="ls-stat-val">${(TOTAL_REV / 1000).toFixed(1)}k</div>
            <div className="ls-stat-label">12-month total</div>
          </div>
          <div className="ls-stat">
            <div className="ls-stat-val ember">${(MONTHLY_DATA[MONTHLY_DATA.length - 1].revenue / 1000).toFixed(1)}k</div>
            <div className="ls-stat-label">this month</div>
          </div>
          <div className="ls-stat">
            <div className="ls-stat-val">{Math.round(((MONTHLY_DATA[MONTHLY_DATA.length - 1].revenue - MONTHLY_DATA[MONTHLY_DATA.length - 2].revenue) / MONTHLY_DATA[MONTHLY_DATA.length - 2].revenue) * 100)}%</div>
            <div className="ls-stat-label">vs last month</div>
          </div>
        </div>

        {/* Tooltip */}
        {hoverInfo && (
          <div className="ls-tooltip" style={{ left: hoverInfo.screenX, top: hoverInfo.screenY }}>
            <div className="ls-tt-month">{hoverInfo.month} '{hoverInfo.year}</div>
            <div className="ls-tt-revenue">${hoverInfo.revenue.toLocaleString()}</div>
            <div className="ls-tt-row">
              <span className="ls-tt-label">Projects</span>
              <span className="ls-tt-val">{hoverInfo.projects}</span>
            </div>
            <div className="ls-tt-row">
              <span className="ls-tt-label">Avg / project</span>
              <span className="ls-tt-val">${Math.round(hoverInfo.revenue / hoverInfo.projects).toLocaleString()}</span>
            </div>
            {hoverInfo.idx > 0 && (() => {
              const prev = MONTHLY_DATA[hoverInfo.idx - 1].revenue;
              const change = ((hoverInfo.revenue - prev) / prev) * 100;
              return (
                <div className="ls-tt-row">
                  <span className="ls-tt-label">vs prev</span>
                  <span className={`ls-tt-val ${change >= 0 ? "up" : "down"}`}>
                    {change >= 0 ? "+" : ""}{change.toFixed(0)}%
                  </span>
                </div>
              );
            })()}
            {hoverInfo.current && (
              <div className="ls-tt-current"><span className="ls-tt-dot" /> current month</div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="ls-legend">
          <div className="ls-legend-item">
            <div className="ls-legend-swatch" style={{ background: "rgba(176, 125, 79, 0.08)" }} />
            valley
          </div>
          <div className="ls-legend-item">
            <div className="ls-legend-swatch" style={{ background: "rgba(176, 125, 79, 0.2)" }} />
            foothills
          </div>
          <div className="ls-legend-item">
            <div className="ls-legend-swatch" style={{ background: "rgba(176, 125, 79, 0.4)" }} />
            peak
          </div>
        </div>

        <div className="ls-footer-left">
          felmark · revenue landscape · apr '25 — mar '26
        </div>
      </div>
    </>
  );
}
