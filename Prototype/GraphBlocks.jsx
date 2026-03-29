import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   GRAPH BLOCKS — living charts inside documents
   Type /graph to insert. They breathe.
   ═══════════════════════════════════════════ */

// ── Shared helpers ──
const PALETTE = ["#b07d4f", "#7c8594", "#5a9a3c", "#5b7fa4", "#8a7e63", "#7c6b9e", "#c24b38", "#a08472"];
const lerp = (a, b, t) => a + (b - a) * t;

function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const from = display;
    const frame = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(lerp(from, value, eased)));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [value]);
  return <>{display.toLocaleString()}</>;
}

// ═══════════════════════════
// 1. VERTICAL BAR CHART
// ═══════════════════════════
function BarChart({ title = "Monthly Revenue", data, height = 180 }) {
  const [hovered, setHovered] = useState(null);
  const maxVal = Math.max(...data.map(d => d.value));

  return (
    <div className="gb">
      <div className="gb-head">
        <span className="gb-title">{title}</span>
        <span className="gb-type-badge">bar chart</span>
      </div>
      <div className="gb-bar-chart" style={{ height }}>
        {data.map((d, i) => {
          const h = (d.value / maxVal) * 100;
          const isHovered = hovered === i;
          return (
            <div key={i} className="gb-bar-col"
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              {isHovered && (
                <div className="gb-bar-tooltip">
                  <span className="gb-bar-tt-val">${d.value.toLocaleString()}</span>
                  {d.sub && <span className="gb-bar-tt-sub">{d.sub}</span>}
                </div>
              )}
              <div className="gb-bar-track">
                <div className="gb-bar" style={{
                  height: `${h}%`,
                  background: d.color || PALETTE[i % PALETTE.length],
                  opacity: isHovered ? 1 : 0.75,
                  transform: isHovered ? "scaleY(1.02)" : "scaleY(1)",
                }} />
              </div>
              <span className={`gb-bar-label${d.current ? " current" : ""}`}>{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════
// 2. LINE CHART (SVG)
// ═══════════════════════════
function LineChart({ title = "Growth Trend", data, height = 160 }) {
  const [hovered, setHovered] = useState(null);
  const w = 500;
  const h = height;
  const pad = { top: 10, right: 10, bottom: 24, left: 10 };
  const maxVal = Math.max(...data.map(d => d.value)) * 1.1;
  const minVal = Math.min(...data.map(d => d.value)) * 0.9;
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const points = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * chartW,
    y: pad.top + chartH - ((d.value - minVal) / (maxVal - minVal)) * chartH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${pad.top + chartH} L${points[0].x},${pad.top + chartH} Z`;

  return (
    <div className="gb">
      <div className="gb-head">
        <span className="gb-title">{title}</span>
        <span className="gb-type-badge">line chart</span>
      </div>
      <svg className="gb-line-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
          const y = pad.top + chartH * (1 - frac);
          return <line key={i} x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="rgba(0,0,0,0.03)" strokeWidth="1" />;
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#lineGrad)" />
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b07d4f" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#b07d4f" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Line */}
        <path d={linePath} fill="none" stroke="#b07d4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {points.map((p, i) => (
          <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
            <circle cx={p.x} cy={p.y} r={hovered === i ? 6 : 3.5} fill={hovered === i ? "#b07d4f" : "#fff"} stroke="#b07d4f" strokeWidth="2" style={{ transition: "r 0.15s" }} />
            {hovered === i && (
              <>
                <line x1={p.x} y1={p.y} x2={p.x} y2={pad.top + chartH} stroke="#b07d4f" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
                <rect x={p.x - 40} y={p.y - 32} width="80" height="24" rx="5" fill="#2c2a25" />
                <text x={p.x} y={p.y - 16} textAnchor="middle" fill="#fff" fontSize="11" fontFamily="'JetBrains Mono', monospace" fontWeight="500">${p.value.toLocaleString()}</text>
              </>
            )}
          </g>
        ))}

        {/* Labels */}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={h - 4} textAnchor="middle" fill="#9b988f" fontSize="10" fontFamily="'JetBrains Mono', monospace">{p.label}</text>
        ))}
      </svg>
    </div>
  );
}

// ═══════════════════════════
// 3. DONUT CHART (SVG)
// ═══════════════════════════
function DonutChart({ title = "Revenue by Client", data, size = 140 }) {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeW = size * 0.12;
  const circ = 2 * Math.PI * r;
  let offset = circ * 0.25; // start from top

  return (
    <div className="gb">
      <div className="gb-head">
        <span className="gb-title">{title}</span>
        <span className="gb-type-badge">donut</span>
      </div>
      <div className="gb-donut-layout">
        <div className="gb-donut-ring-wrap" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background ring */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth={strokeW} />

            {data.map((d, i) => {
              const pct = d.value / total;
              const dash = circ * pct;
              const gap = circ - dash;
              const thisOffset = offset;
              offset -= dash;

              return (
                <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                  stroke={d.color || PALETTE[i]}
                  strokeWidth={hovered === i ? strokeW + 4 : strokeW}
                  strokeDasharray={`${dash - 2} ${gap + 2}`}
                  strokeDashoffset={-thisOffset}
                  strokeLinecap="butt"
                  opacity={hovered !== null && hovered !== i ? 0.3 : 1}
                  style={{ transition: "all 0.2s", cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}
          </svg>
          <div className="gb-donut-center">
            {hovered !== null ? (
              <>
                <span className="gb-donut-center-val" style={{ color: data[hovered].color || PALETTE[hovered] }}>
                  {Math.round((data[hovered].value / total) * 100)}%
                </span>
                <span className="gb-donut-center-label">{data[hovered].label}</span>
              </>
            ) : (
              <>
                <span className="gb-donut-center-val">${(total / 1000).toFixed(1)}k</span>
                <span className="gb-donut-center-label">total</span>
              </>
            )}
          </div>
        </div>

        <div className="gb-donut-legend">
          {data.map((d, i) => (
            <div key={i} className={`gb-donut-leg-item${hovered === i ? " on" : ""}`}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <span className="gb-donut-leg-dot" style={{ background: d.color || PALETTE[i] }} />
              <span className="gb-donut-leg-label">{d.label}</span>
              <span className="gb-donut-leg-val">${(d.value / 1000).toFixed(1)}k</span>
              <span className="gb-donut-leg-pct">{Math.round((d.value / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════
// 4. HORIZONTAL BAR CHART
// ═══════════════════════════
function HorizontalBar({ title = "Hours by Project", data }) {
  const [hovered, setHovered] = useState(null);
  const maxVal = Math.max(...data.map(d => d.value));

  return (
    <div className="gb">
      <div className="gb-head">
        <span className="gb-title">{title}</span>
        <span className="gb-type-badge">horizontal bar</span>
      </div>
      <div className="gb-hbar-list">
        {data.map((d, i) => {
          const pct = (d.value / maxVal) * 100;
          const isH = hovered === i;
          return (
            <div key={i} className={`gb-hbar-row${isH ? " on" : ""}`}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <span className="gb-hbar-label">{d.label}</span>
              <div className="gb-hbar-track">
                <div className="gb-hbar-fill" style={{
                  width: `${pct}%`,
                  background: d.color || PALETTE[i % PALETTE.length],
                  opacity: isH ? 1 : 0.7,
                }} />
              </div>
              <span className="gb-hbar-val">{d.value}{d.unit || ""}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════
// 5. SPARKLINE ROW
// ═══════════════════════════
function SparklineRow({ title = "Weekly Activity", data }) {
  return (
    <div className="gb gb-compact">
      <div className="gb-head">
        <span className="gb-title">{title}</span>
        <span className="gb-type-badge">sparkline</span>
      </div>
      <div className="gb-spark-rows">
        {data.map((row, ri) => {
          const max = Math.max(...row.values);
          const w = 120;
          const h = 28;
          const points = row.values.map((v, i) => {
            const x = (i / (row.values.length - 1)) * w;
            const y = h - (v / max) * h * 0.8 - h * 0.1;
            return `${x},${y}`;
          }).join(" ");

          return (
            <div key={ri} className="gb-spark-row">
              <span className="gb-spark-label">{row.label}</span>
              <svg className="gb-spark-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                <polyline points={points} fill="none" stroke={row.color || PALETTE[ri]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {(() => {
                  const lastPt = points.split(" ").pop().split(",");
                  return <circle cx={lastPt[0]} cy={lastPt[1]} r="3" fill={row.color || PALETTE[ri]} />;
                })()}
              </svg>
              <span className="gb-spark-val" style={{ color: row.color || PALETTE[ri] }}>{row.current}</span>
              <span className={`gb-spark-change ${row.change >= 0 ? "up" : "down"}`}>
                {row.change >= 0 ? "+" : ""}{row.change}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════
// 6. STACKED AREA CHART
// ═══════════════════════════
function StackedArea({ title = "Revenue Composition", labels, series, height = 160 }) {
  const [hovered, setHovered] = useState(null);
  const w = 500;
  const h = height;
  const pad = { top: 10, right: 10, bottom: 24, left: 10 };
  const n = labels.length;
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const stacked = series.map((s, si) => ({
    ...s,
    stackedValues: s.values.map((v, vi) => {
      let below = 0;
      for (let k = 0; k < si; k++) below += series[k].values[vi];
      return { base: below, top: below + v, raw: v };
    }),
  }));

  const maxStack = Math.max(...labels.map((_, vi) => series.reduce((s, sr) => s + sr.values[vi], 0))) * 1.1;
  const getY = (val) => pad.top + chartH - (val / maxStack) * chartH;

  return (
    <div className="gb">
      <div className="gb-head">
        <span className="gb-title">{title}</span>
        <span className="gb-type-badge">stacked area</span>
      </div>
      <svg className="gb-line-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => (
          <line key={i} x1={pad.left} y1={pad.top + chartH * (1 - frac)} x2={w - pad.right} y2={pad.top + chartH * (1 - frac)} stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
        ))}

        {stacked.map((s, si) => {
          const topPoints = s.stackedValues.map((sv, vi) => {
            const x = pad.left + (vi / (n - 1)) * chartW;
            return `${x},${getY(sv.top)}`;
          }).join(" ");
          const bottomPoints = [...s.stackedValues].reverse().map((sv, vi) => {
            const x = pad.left + ((n - 1 - vi) / (n - 1)) * chartW;
            return `${x},${getY(sv.base)}`;
          }).join(" ");

          return (
            <polygon key={si} points={`${topPoints} ${bottomPoints}`}
              fill={s.color || PALETTE[si]}
              opacity={hovered !== null && hovered !== si ? 0.15 : 0.25}
              style={{ transition: "opacity 0.2s", cursor: "pointer" }}
              onMouseEnter={() => setHovered(si)}
              onMouseLeave={() => setHovered(null)} />
          );
        })}

        {stacked.map((s, si) => {
          const path = s.stackedValues.map((sv, vi) => {
            const x = pad.left + (vi / (n - 1)) * chartW;
            return `${vi === 0 ? "M" : "L"}${x},${getY(sv.top)}`;
          }).join(" ");
          return (
            <path key={si} d={path} fill="none" stroke={s.color || PALETTE[si]}
              strokeWidth={hovered === si ? 2.5 : 1.5} strokeLinecap="round" strokeLinejoin="round"
              opacity={hovered !== null && hovered !== si ? 0.3 : 0.8}
              style={{ transition: "all 0.2s" }} />
          );
        })}

        {labels.map((l, i) => (
          <text key={i} x={pad.left + (i / (n - 1)) * chartW} y={h - 4} textAnchor="middle" fill="#9b988f" fontSize="10" fontFamily="'JetBrains Mono', monospace">{l}</text>
        ))}
      </svg>

      <div className="gb-area-legend">
        {series.map((s, i) => (
          <div key={i} className={`gb-area-leg${hovered === i ? " on" : ""}`}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <span className="gb-area-leg-dot" style={{ background: s.color || PALETTE[i] }} />
            <span className="gb-area-leg-label">{s.label}</span>
            <span className="gb-area-leg-val">${(s.values.reduce((a, b) => a + b, 0) / 1000).toFixed(1)}k</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════
// 7. METRIC CARD ROW
// ═══════════════════════════
function MetricCards({ metrics }) {
  return (
    <div className="gb gb-compact">
      <div className="gb-metrics">
        {metrics.map((m, i) => (
          <div key={i} className="gb-metric">
            <div className="gb-metric-top">
              <span className="gb-metric-label">{m.label}</span>
              {m.change !== undefined && (
                <span className={`gb-metric-change ${m.change >= 0 ? "up" : "down"}`}>
                  {m.change >= 0 ? "^" : "v"} {Math.abs(m.change)}%
                </span>
              )}
            </div>
            <div className="gb-metric-val" style={{ color: m.color || "var(--ink-900)" }}>
              {m.prefix || ""}<AnimatedNumber value={m.value} />{m.suffix || ""}
            </div>
            {m.sub && <div className="gb-metric-sub">{m.sub}</div>}
            {m.sparkline && (
              <svg className="gb-metric-spark" viewBox="0 0 60 20" preserveAspectRatio="none">
                <polyline points={m.sparkline.map((v, vi) => {
                  const max = Math.max(...m.sparkline);
                  return `${(vi / (m.sparkline.length - 1)) * 60},${20 - (v / max) * 16 - 2}`;
                }).join(" ")} fill="none" stroke={m.color || "var(--ember)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════
   SHOWCASE — Design reference for graph blocks in editor context
   ═══════════════════ */
export default function GraphBlocks() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        .editor-page {
          font-family: 'Outfit', sans-serif; font-size: 15px;
          color: var(--ink-700); background: var(--parchment);
          min-height: 100vh;
        }

        .editor-canvas {
          max-width: 720px; margin: 0 auto; padding: 60px 40px 120px;
        }

        .doc-h1 { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 600; color: var(--ink-900); letter-spacing: -0.02em; margin-bottom: 8px; }
        .doc-meta { font-family: var(--mono); font-size: 11px; color: var(--ink-400); margin-bottom: 24px; display: flex; gap: 12px; align-items: center; padding-bottom: 20px; border-bottom: 1px solid var(--warm-200); }
        .doc-h2 { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: var(--ink-900); margin: 32px 0 12px; }
        .doc-p { font-size: 15px; color: var(--ink-600); line-height: 1.75; margin-bottom: 12px; }
        .doc-divider { height: 1px; background: var(--warm-200); margin: 24px 0; }

        /* GRAPH BLOCK STYLES */
        .gb {
          background: #fff; border: 1px solid var(--warm-200);
          border-radius: 10px; overflow: hidden; margin: 16px 0;
          transition: border-color 0.12s, box-shadow 0.12s;
        }
        .gb:hover { border-color: var(--warm-300); box-shadow: 0 2px 12px rgba(0,0,0,0.03); }

        .gb-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 18px 8px;
        }
        .gb-title { font-size: 14px; font-weight: 500; color: var(--ink-800); }
        .gb-type-badge {
          font-family: var(--mono); font-size: 9px; color: var(--ink-300);
          background: var(--warm-100); padding: 1px 7px; border-radius: 3px;
          border: 1px solid var(--warm-200); letter-spacing: 0.04em;
        }

        /* Bar chart */
        .gb-bar-chart {
          display: flex; gap: 4px; align-items: flex-end;
          padding: 8px 18px 8px;
        }
        .gb-bar-col {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; gap: 6px; position: relative; cursor: pointer;
        }
        .gb-bar-track { width: 100%; height: 100%; display: flex; align-items: flex-end; }
        .gb-bar {
          width: 100%; border-radius: 3px 3px 0 0;
          transition: all 0.2s ease; min-height: 3px;
          transform-origin: bottom;
        }
        .gb-bar-label { font-family: var(--mono); font-size: 9px; color: var(--ink-300); }
        .gb-bar-label.current { color: var(--ember); font-weight: 500; }
        .gb-bar-tooltip {
          position: absolute; bottom: calc(100% + 4px); left: 50%; transform: translateX(-50%);
          background: var(--ink-900); color: #fff; padding: 4px 10px; border-radius: 6px;
          font-family: var(--mono); font-size: 11px; white-space: nowrap; z-index: 5;
          display: flex; flex-direction: column; align-items: center; gap: 1px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .gb-bar-tt-val { font-weight: 500; }
        .gb-bar-tt-sub { font-size: 9px; color: rgba(255,255,255,0.4); }

        /* Line chart */
        .gb-line-svg { width: 100%; display: block; padding: 0 18px 4px; }

        /* Donut */
        .gb-donut-layout { display: flex; align-items: center; gap: 24px; padding: 8px 18px 16px; }
        .gb-donut-ring-wrap { position: relative; flex-shrink: 0; }
        .gb-donut-center {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .gb-donut-center-val { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: var(--ink-900); line-height: 1; }
        .gb-donut-center-label { font-family: var(--mono); font-size: 9px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.06em; }
        .gb-donut-legend { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .gb-donut-leg-item {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 8px; border-radius: 4px; cursor: pointer;
          transition: background 0.06s;
        }
        .gb-donut-leg-item:hover, .gb-donut-leg-item.on { background: var(--warm-100); }
        .gb-donut-leg-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
        .gb-donut-leg-label { font-size: 12.5px; color: var(--ink-600); flex: 1; }
        .gb-donut-leg-val { font-family: var(--mono); font-size: 11px; color: var(--ink-700); font-weight: 500; }
        .gb-donut-leg-pct { font-family: var(--mono); font-size: 10px; color: var(--ink-300); min-width: 28px; text-align: right; }

        /* Horizontal bars */
        .gb-hbar-list { padding: 4px 18px 14px; display: flex; flex-direction: column; gap: 6px; }
        .gb-hbar-row {
          display: flex; align-items: center; gap: 10px;
          padding: 4px 0; transition: background 0.06s;
          border-radius: 3px; cursor: pointer;
        }
        .gb-hbar-label { font-size: 12.5px; color: var(--ink-600); width: 130px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .gb-hbar-track { flex: 1; height: 8px; background: var(--warm-100); border-radius: 4px; overflow: hidden; }
        .gb-hbar-fill { height: 100%; border-radius: 4px; transition: all 0.3s ease; }
        .gb-hbar-val { font-family: var(--mono); font-size: 12px; color: var(--ink-700); font-weight: 500; min-width: 40px; text-align: right; }

        /* Sparkline rows */
        .gb-spark-rows { padding: 4px 18px 14px; display: flex; flex-direction: column; gap: 8px; }
        .gb-spark-row { display: flex; align-items: center; gap: 10px; }
        .gb-spark-label { font-size: 12.5px; color: var(--ink-600); width: 100px; flex-shrink: 0; }
        .gb-spark-svg { width: 120px; height: 28px; flex-shrink: 0; }
        .gb-spark-val { font-family: var(--mono); font-size: 13px; font-weight: 500; min-width: 48px; text-align: right; }
        .gb-spark-change { font-family: var(--mono); font-size: 10px; min-width: 36px; text-align: right; }
        .gb-spark-change.up { color: #5a9a3c; }
        .gb-spark-change.down { color: #c24b38; }

        /* Stacked area legend */
        .gb-area-legend { display: flex; gap: 12px; padding: 6px 18px 12px; }
        .gb-area-leg {
          display: flex; align-items: center; gap: 5px;
          font-size: 12px; cursor: pointer; padding: 2px 6px;
          border-radius: 3px; transition: background 0.06s;
        }
        .gb-area-leg:hover, .gb-area-leg.on { background: var(--warm-100); }
        .gb-area-leg-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
        .gb-area-leg-label { color: var(--ink-500); }
        .gb-area-leg-val { font-family: var(--mono); font-size: 11px; color: var(--ink-700); font-weight: 500; }

        /* Metric cards */
        .gb-metrics { display: flex; gap: 8px; padding: 8px 14px 14px; }
        .gb-metric {
          flex: 1; padding: 14px 16px;
          background: var(--warm-50); border: 1px solid var(--warm-100);
          border-radius: 8px; position: relative; overflow: hidden;
        }
        .gb-metric-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .gb-metric-label { font-family: var(--mono); font-size: 9px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.06em; }
        .gb-metric-change { font-family: var(--mono); font-size: 10px; font-weight: 500; }
        .gb-metric-change.up { color: #5a9a3c; }
        .gb-metric-change.down { color: #c24b38; }
        .gb-metric-val { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; line-height: 1; }
        .gb-metric-sub { font-size: 11px; color: var(--ink-300); margin-top: 4px; }
        .gb-metric-spark { position: absolute; bottom: 0; left: 0; right: 0; height: 20px; opacity: 0.3; }
      `}</style>

      <div className="editor-page">
        <div className="editor-canvas">
          <h1 className="doc-h1">Q1 2026 — Business Review</h1>
          <div className="doc-meta">
            <span>Meridian Studio</span>
            <span>·</span>
            <span>March 29, 2026</span>
            <span>·</span>
            <span>Quarterly Report</span>
          </div>

          <p className="doc-p">
            This quarter saw strong growth across all service lines. Revenue increased 40% month-over-month in March, driven primarily by the Brand Identity and Strategy verticals.
          </p>

          <MetricCards metrics={[
            { label: "Revenue", value: 14800, prefix: "$", color: "#5a9a3c", change: 40, sub: "this month", sparkline: [3200, 5800, 4100, 7600, 9400, 11400, 13200, 14800] },
            { label: "Projects", value: 8, color: "var(--ink-900)", change: 12, sub: "active" },
            { label: "Avg Rate", value: 95, prefix: "$", suffix: "/hr", color: "var(--ember)", change: 5, sub: "effective rate" },
            { label: "Pipeline", value: 22000, prefix: "$", color: "#5b7fa4", sub: "total value" },
          ]} />

          <h2 className="doc-h2">Revenue Trend</h2>
          <p className="doc-p">Monthly earnings have been on a consistent upward trajectory since October, with March on track to be the highest-grossing month.</p>

          <LineChart title="Monthly Revenue (12 months)" data={[
            { label: "Apr", value: 3200 }, { label: "May", value: 5800 },
            { label: "Jun", value: 4100 }, { label: "Jul", value: 7600 },
            { label: "Aug", value: 6200 }, { label: "Sep", value: 9400 },
            { label: "Oct", value: 8200 }, { label: "Nov", value: 11400 },
            { label: "Dec", value: 9800 }, { label: "Jan", value: 13200 },
            { label: "Feb", value: 10600 }, { label: "Mar", value: 14800 },
          ]} />

          <div className="doc-divider" />

          <h2 className="doc-h2">Revenue by Client</h2>
          <p className="doc-p">Meridian Studio remains the largest revenue source, followed by Bolt Fitness and Nora Kim.</p>

          <DonutChart title="Revenue Distribution" data={[
            { label: "Meridian Studio", value: 12400, color: "#7c8594" },
            { label: "Bolt Fitness", value: 4800, color: "#8a7e63" },
            { label: "Nora Kim", value: 4800, color: "#a08472" },
            { label: "Other", value: 2800, color: "#b8b3a8" },
          ]} />

          <div className="doc-divider" />

          <h2 className="doc-h2">Revenue by Service</h2>

          <BarChart title="Service Revenue (Q1)" data={[
            { label: "Brand", value: 8600, color: "#b07d4f" },
            { label: "Web", value: 6200, color: "#5b7fa4" },
            { label: "Copy", value: 4800, color: "#5a9a3c" },
            { label: "Strategy", value: 3600, color: "#7c6b9e" },
            { label: "Social", value: 1600, color: "#8a7e63", current: true },
          ]} />

          <div className="doc-divider" />

          <h2 className="doc-h2">Time Allocation</h2>
          <p className="doc-p">Hours logged across active projects this quarter.</p>

          <HorizontalBar title="Hours by Project" data={[
            { label: "Brand Guidelines v2", value: 32, unit: "h", color: "#7c8594" },
            { label: "App Onboarding UX", value: 68, unit: "h", color: "#8a7e63" },
            { label: "Course Landing Page", value: 18, unit: "h", color: "#a08472" },
            { label: "Website Copy", value: 24, unit: "h", color: "#7c8594" },
            { label: "Blog Posts", value: 12, unit: "h", color: "#8a7e63" },
          ]} />

          <div className="doc-divider" />

          <h2 className="doc-h2">Revenue Composition</h2>

          <StackedArea title="Revenue Streams" labels={["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]}
            series={[
              { label: "Design", color: "#b07d4f", values: [4200, 5400, 4800, 6200, 5100, 7200] },
              { label: "Copy", color: "#5a9a3c", values: [1800, 2400, 2200, 3200, 2800, 3600] },
              { label: "Strategy", color: "#7c6b9e", values: [1500, 2000, 1800, 2400, 1800, 2800] },
              { label: "Other", color: "#b8b3a8", values: [700, 1600, 1000, 1400, 900, 1200] },
            ]} />

          <div className="doc-divider" />

          <h2 className="doc-h2">Weekly Performance</h2>

          <SparklineRow title="This Month" data={[
            { label: "Revenue", values: [800, 1200, 900, 1400, 1800, 2200, 1600, 2400, 1900, 2600, 2100, 2800], current: "$14.8k", change: 40, color: "#5a9a3c" },
            { label: "Hours", values: [12, 18, 14, 20, 16, 22, 18, 24, 20, 28, 22, 26], current: "86h", change: 12, color: "#b07d4f" },
            { label: "Proposals", values: [0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1], current: "6 sent", change: 20, color: "#5b7fa4" },
          ]} />

          <p className="doc-p" style={{ marginTop: 24, fontStyle: "italic", color: "var(--ink-400)" }}>
            All data is live and updates as invoices are sent, payments are received, and hours are tracked. Insert a graph block with <span style={{ fontFamily: "var(--mono)", background: "var(--warm-100)", padding: "1px 6px", borderRadius: 3, fontSize: 13 }}>/graph</span>
          </p>
        </div>
      </div>
    </>
  );
}
