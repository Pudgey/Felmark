# Forge V2 React Prototype

Saved React prototype for the Forge UI.

```jsx
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   FELMARK FORGE v2 — 10x
   The engine room, redesigned.
   ═══════════════════════════════════════════ */

// Crossed hammers SVG
function HammerIcon({ size = 24, color = "#b07d4f" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Left hammer */}
      <path d="M4.5 2.5L10 8" />
      <path d="M2 5L6.5 9.5" />
      <path d="M5 6L3.5 7.5" />
      <path d="M7 4L5.5 5.5" />
      <path d="M9.5 8.5L16 15" />
      {/* Right hammer */}
      <path d="M19.5 2.5L14 8" />
      <path d="M22 5L17.5 9.5" />
      <path d="M19 6L20.5 7.5" />
      <path d="M17 4L18.5 5.5" />
      <path d="M14.5 8.5L8 15" />
      {/* Anvil base */}
      <path d="M6 18L12 15L18 18" />
      <path d="M5 18H19V20C19 21 18 22 17 22H7C6 22 5 21 5 20V18Z" />
    </svg>
  );
}

function LiveNum({ base, rate }) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const i = setInterval(() => setV(p => p + Math.floor(Math.random() * rate * 2)), 1200 + Math.random() * 1600);
    return () => clearInterval(i);
  }, [rate]);
  return <>{v.toLocaleString()}</>;
}

function Spark({ data, color, w = 64, h = 20, fill: doFill }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - 2 - ((v - min) / range) * (h - 4)}`).join(" ");
  const last = pts.split(" ").pop().split(",");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      {doFill && <polygon points={`${pts} ${w},${h} 0,${h}`} fill={color} opacity="0.06" />}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx={last[0]} cy={last[1]} r="1.5" fill={color} opacity="0.7" />
    </svg>
  );
}

function Dot({ color, pulse, size = 6 }) {
  return (
    <span style={{ position: "relative", width: size + 4, height: size + 4, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {pulse && <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, animation: "dp 2s ease infinite", opacity: 0 }} />}
      <span style={{ width: size, height: size, borderRadius: "50%", background: color, position: "relative", zIndex: 1 }} />
    </span>
  );
}

// Health ring
function HealthRing({ pct, color, size = 52 }) {
  const r = (size - 6) / 2, circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e2db" strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1)" }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: 12, fontWeight: 600, fill: color, fontFamily: "'JetBrains Mono', monospace" }}>
        {pct}%
      </text>
    </svg>
  );
}

export default function ForgeV2() {
  const [events, setEvents] = useState([]);
  const [lat, setLat] = useState(Array.from({ length: 24 }, () => 10 + Math.random() * 28));
  const [tput, setTput] = useState(Array.from({ length: 24 }, () => 80 + Math.random() * 120));
  const [conns, setConns] = useState(7);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const pool = [
      { svc: "invoices", act: "invoice.sent", dtl: "INV-0047 → Meridian Studio · $2,400", c: "#16a34a", icon: "$" },
      { svc: "projects", act: "project.updated", dtl: "Brand Guidelines v2 → 67% complete", c: "#2563eb", icon: "◎" },
      { svc: "wire", act: "signal.detected", dtl: "SaaS brand demand +34% · 96% relevance", c: "#b07d4f", icon: "★" },
      { svc: "time", act: "time.logged", dtl: "2.5h → Brand Guidelines · Alex", c: "#7c3aed", icon: "▶" },
      { svc: "clients", act: "portal.viewed", dtl: "Sarah Chen opened proposal", c: "#0891b2", icon: "◇" },
      { svc: "pipeline", act: "deal.moved", dtl: "Luna Boutique → Proposal stage", c: "#d97706", icon: "→" },
      { svc: "documents", act: "block.inserted", dtl: "Pricing table added to proposal", c: "#2563eb", icon: "+" },
      { svc: "invoices", act: "payment.received", dtl: "$1,800 via Stripe Connect", c: "#16a34a", icon: "$" },
      { svc: "auth", act: "session.created", dtl: "alex@tryfelmark.com · Chrome", c: "#7d7a72", icon: "◎" },
      { svc: "forge", act: "health.check", dtl: "All 8 services responding < 30ms", c: "#16a34a", icon: "✓" },
    ];
    const push = () => {
      const e = pool[Math.floor(Math.random() * pool.length)];
      setEvents(p => [{ ...e, id: Date.now(), ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }, ...p].slice(0, 14));
    };
    push();
    const i = setInterval(push, 2000 + Math.random() * 2000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setLat(p => [...p.slice(1), 6 + Math.random() * 32]);
      setTput(p => [...p.slice(1), 70 + Math.random() * 140]);
      setConns(p => Math.max(3, Math.min(14, p + Math.floor(Math.random() * 3) - 1)));
    }, 1400);
    return () => clearInterval(i);
  }, []);

  const svcs = [
    { n: "projects", lat: 14, calls: "2.4k", health: 99, c: "#2563eb" },
    { n: "invoices", lat: 18, calls: "890", health: 100, c: "#16a34a" },
    { n: "clients", lat: 11, calls: "1.8k", health: 98, c: "#0891b2" },
    { n: "documents", lat: 22, calls: "3.1k", health: 97, c: "#7c3aed" },
    { n: "pipeline", lat: 9, calls: "640", health: 100, c: "#d97706" },
    { n: "wire", lat: 31, calls: "420", health: 95, c: "#b07d4f" },
    { n: "time", lat: 8, calls: "1.2k", health: 100, c: "#7c3aed" },
    { n: "auth", lat: 6, calls: "3.8k", health: 100, c: "#7d7a72" },
  ];

  // Uptime calendar (last 30 days)
  const uptimeDays = Array.from({ length: 30 }, (_, i) => {
    const r = Math.random();
    return r > 0.02 ? 100 : r > 0.01 ? 99.5 : 98;
  });

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

@keyframes dp{0%{transform:scale(1);opacity:.25}50%{transform:scale(2);opacity:0}100%{transform:scale(1);opacity:0}}
@keyframes eIn{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:translateY(0)}}

.fg{font-family:'Outfit',sans-serif;background:var(--parchment);min-height:100vh;padding:28px 20px}
.fg-in{max-width:960px;margin:0 auto}

/* ══ Hero ══ */
.fg-hero{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding:24px 28px;background:#fff;border:1px solid var(--warm-200);border-radius:14px}
.fg-hero-l{display:flex;align-items:center;gap:16px}
.fg-hero-icon{width:56px;height:56px;border-radius:14px;background:var(--ink-900);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.fg-hero-icon::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(176,125,79,0.08),transparent);pointer-events:none}
.fg-hero-info{}
.fg-hero-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--ink-900);line-height:1.1;display:flex;align-items:baseline;gap:8px}
.fg-hero-title-badge{font-family:var(--mono);font-size:9px;font-weight:500;color:var(--ember);background:var(--ember-bg);border:1px solid rgba(176,125,79,0.08);padding:2px 8px;border-radius:4px;position:relative;top:-2px}
.fg-hero-sub{font-family:var(--mono);font-size:11px;color:var(--ink-300);margin-top:3px;display:flex;align-items:center;gap:8px}
.fg-hero-sep{width:1px;height:10px;background:var(--warm-200)}
.fg-hero-r{display:flex;align-items:center;gap:16px}
.fg-hero-health{display:flex;flex-direction:column;align-items:center;gap:2px}
.fg-hero-health-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em}
.fg-hero-uptime{display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.fg-hero-uptime-val{font-family:var(--mono);font-size:18px;font-weight:600;color:#16a34a;display:flex;align-items:center;gap:5px}
.fg-hero-uptime-label{font-family:var(--mono);font-size:9px;color:var(--ink-300)}

/* ══ Stats ══ */
.fg-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px}
.fg-st{background:#fff;border:1px solid var(--warm-200);border-radius:10px;padding:14px 16px;transition:all .15s;cursor:default;position:relative;overflow:hidden}
.fg-st:hover{border-color:var(--warm-300);transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,0.025)}
.fg-st-accent{position:absolute;top:0;left:0;right:0;height:2px;border-radius:2px 2px 0 0}
.fg-st-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2px}
.fg-st-val{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:var(--ink-900);line-height:1}
.fg-st-bdg{font-family:var(--mono);font-size:8px;font-weight:500;padding:2px 7px;border-radius:3px;display:flex;align-items:center;gap:3px}
.fg-st-lb{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}

/* ══ Grid ══ */
.fg-grid{display:grid;grid-template-columns:1fr 320px;gap:10px}

/* ══ Card ══ */
.fg-cd{background:#fff;border:1px solid var(--warm-200);border-radius:10px;overflow:hidden}
.fg-cd+.fg-cd{margin-top:10px}
.fg-cd-h{padding:11px 16px;border-bottom:1px solid var(--warm-100);display:flex;align-items:center;justify-content:space-between}
.fg-cd-t{font-size:14px;font-weight:500;color:var(--ink-800);display:flex;align-items:center;gap:6px}
.fg-cd-m{font-family:var(--mono);font-size:9px;color:var(--ink-300);display:flex;align-items:center;gap:4px}

/* ══ Services ══ */
.fg-svcs{padding:2px 4px}
.fg-sv{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:6px;transition:background .06s;cursor:default}
.fg-sv:hover{background:var(--warm-50)}
.fg-sv+.fg-sv{border-top:1px solid var(--warm-100)}
.fg-sv-nm{font-family:var(--mono);font-size:11px;font-weight:500;color:var(--ink-700);width:72px;flex-shrink:0}
.fg-sv-health{width:28px;height:10px;background:var(--warm-200);border-radius:2px;overflow:hidden;flex-shrink:0}
.fg-sv-health-fill{height:100%;border-radius:2px;transition:width .3s}
.fg-sv-st{font-family:var(--mono);font-size:9px;color:#16a34a;width:26px;flex-shrink:0;text-align:center}
.fg-sv-lat{font-family:var(--mono);font-size:10px;color:var(--ink-400);width:34px;text-align:right;flex-shrink:0}
.fg-sv-calls{font-family:var(--mono);font-size:10px;color:var(--ink-300);width:40px;text-align:right;flex-shrink:0}
.fg-sv-spark{margin-left:auto;flex-shrink:0}

/* ══ Architecture ══ */
.fg-arch{padding:16px}
.fg-arch-lb{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
.fg-arch-row{display:flex;gap:4px}
.fg-arch-nd{flex:1;padding:8px 6px;border-radius:7px;border:1px solid var(--warm-200);text-align:center;transition:all .1s;cursor:default}
.fg-arch-nd:hover{border-color:var(--warm-300);background:var(--warm-50)}
.fg-arch-nd-nm{font-family:var(--mono);font-size:10px;font-weight:500;color:var(--ink-700)}
.fg-arch-nd-sub{font-family:var(--mono);font-size:8px;color:var(--ink-300)}
.fg-arch-nd.on{border-color:rgba(22,163,74,0.1);background:rgba(22,163,74,0.01)}
.fg-arch-nd.em{border-color:rgba(176,125,79,0.1);background:var(--ember-bg)}
.fg-arch-nd.core{border:none;background:var(--ink-900);position:relative;overflow:hidden}
.fg-arch-nd.core::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(176,125,79,0.04),transparent,rgba(176,125,79,0.04));animation:coreShimmer 4s ease infinite}
@keyframes coreShimmer{0%,100%{opacity:.3}50%{opacity:.8}}
.fg-arch-nd.core .fg-arch-nd-nm{color:#fff;font-size:11px}
.fg-arch-nd.core .fg-arch-nd-sub{color:rgba(255,255,255,0.3)}
.fg-arch-conn{display:flex;align-items:center;justify-content:center;padding:3px 0}
.fg-arch-arr{color:var(--ink-300);font-size:10px}
.fg-arch-ln{flex:1;height:1px;background:var(--warm-200);margin:0 6px}

/* ══ Events ══ */
.fg-evts{padding:2px 4px;flex:1;overflow-y:auto}
.fg-evts::-webkit-scrollbar{width:3px}
.fg-evts::-webkit-scrollbar-thumb{background:var(--warm-200);border-radius:2px}
.fg-ev{display:flex;align-items:flex-start;gap:8px;padding:7px 8px;border-radius:5px;animation:eIn .2s ease;transition:background .06s}
.fg-ev:hover{background:var(--warm-50)}
.fg-ev+.fg-ev{border-top:1px solid var(--warm-100)}
.fg-ev-ic{width:22px;height:22px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;flex-shrink:0;border:1px solid}
.fg-ev-bd{flex:1;min-width:0}
.fg-ev-act{font-family:var(--mono);font-size:11px;color:var(--ink-700);font-weight:500}
.fg-ev-dtl{font-size:11px;color:var(--ink-400);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fg-ev-r{display:flex;flex-direction:column;align-items:flex-end;gap:1px;flex-shrink:0}
.fg-ev-ts{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.fg-ev-svc{font-family:var(--mono);font-size:8px;color:var(--ink-300);background:var(--warm-100);padding:0 4px;border-radius:2px}

/* ══ Uptime Calendar ══ */
.fg-up{padding:12px 16px}
.fg-up-grid{display:flex;gap:2px}
.fg-up-day{flex:1;height:16px;border-radius:2px;transition:all .1s;cursor:default}
.fg-up-day:hover{transform:scaleY(1.3)}
.fg-up-labels{display:flex;justify-content:space-between;margin-top:4px;font-family:var(--mono);font-size:8px;color:var(--ink-300)}

/* ══ Footer ══ */
.fg-ft{margin-top:12px;padding:10px 16px;background:#fff;border:1px solid var(--warm-200);border-radius:10px;display:flex;align-items:center;justify-content:space-between}
.fg-ft-l{display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:10px;color:#16a34a}
.fg-ft-r{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.fg-ft-sep{width:1px;height:10px;background:var(--warm-200)}
.fg-ft-tech{display:flex;align-items:center;gap:3px}
.fg-ft-tech-dot{width:3px;height:3px;border-radius:50%;background:var(--ink-300)}
      `}</style>

      <div className="fg"><div className="fg-in">

        {/* ══ Hero ══ */}
        <div className="fg-hero">
          <div className="fg-hero-l">
            <div className="fg-hero-icon">
              <HammerIcon size={28} color="#c89360" />
            </div>
            <div className="fg-hero-info">
              <div className="fg-hero-title">
                The Forge
                <span className="fg-hero-title-badge">engine</span>
              </div>
              <div className="fg-hero-sub">
                <span>@felmark/forge</span>
                <span className="fg-hero-sep" />
                <span>8 services</span>
                <span className="fg-hero-sep" />
                <span>v1.0.0</span>
              </div>
            </div>
          </div>
          <div className="fg-hero-r">
            <div className="fg-hero-health">
              <HealthRing pct={99} color="#16a34a" />
              <span className="fg-hero-health-label">System health</span>
            </div>
            <div className="fg-hero-uptime">
              <div className="fg-hero-uptime-val">
                <Dot color="#16a34a" pulse size={5} />
                99.98%
              </div>
              <span className="fg-hero-uptime-label">30-day uptime</span>
            </div>
          </div>
        </div>

        {/* ══ Stats ══ */}
        <div className="fg-stats">
          {[
            { val: <LiveNum base={847293} rate={3} />, lb: "API Calls", bdg: "live", bdgC: "#16a34a", accent: "#2563eb", spark: tput, sparkC: "#2563eb" },
            { val: `${Math.round(lat[lat.length - 1])}ms`, lb: "P50 Latency", bdg: "fast", bdgC: "#16a34a", accent: "#16a34a", spark: lat, sparkC: "#16a34a" },
            { val: "8 / 8", lb: "Services Up", bdg: "nominal", bdgC: "#2563eb", accent: "#7c3aed", spark: [8,8,8,8,8,7,8,8,8,8,8,8,8,8,7,8,8,8,8,8,8,8,8,8], sparkC: "#7c3aed" },
            { val: conns, lb: "WebSockets", bdg: "active", bdgC: "#b07d4f", accent: "#b07d4f", spark: [5,7,6,8,7,9,6,8,7,6,8,7,9,8,7,6,8,7,conns,conns,conns,conns,conns,conns], sparkC: "#b07d4f" },
          ].map((s, i) => (
            <div key={i} className="fg-st">
              <div className="fg-st-accent" style={{ background: s.accent }} />
              <div className="fg-st-top">
                <div className="fg-st-val">{s.val}</div>
                <span className="fg-st-bdg" style={{ color: s.bdgC, background: s.bdgC + "06", border: `1px solid ${s.bdgC}08` }}>
                  <Dot color={s.bdgC} pulse size={4} /> {s.bdg}
                </span>
              </div>
              <div className="fg-st-lb">{s.lb}</div>
              <Spark data={s.spark} color={s.sparkC} fill />
            </div>
          ))}
        </div>

        {/* ══ Main Grid ══ */}
        <div className="fg-grid">
          <div>
            {/* Services */}
            <div className="fg-cd">
              <div className="fg-cd-h">
                <span className="fg-cd-t"><HammerIcon size={14} color="var(--ink-400)" /> Services</span>
                <span className="fg-cd-m">8 registered · 0 degraded</span>
              </div>
              <div className="fg-svcs">
                {svcs.map((s, i) => (
                  <div key={i} className="fg-sv" onMouseEnter={() => setHovered(s.n)} onMouseLeave={() => setHovered(null)}>
                    <Dot color={s.c} pulse size={5} />
                    <span className="fg-sv-nm">{s.n}</span>
                    <div className="fg-sv-health">
                      <div className="fg-sv-health-fill" style={{ width: `${s.health}%`, background: s.health >= 99 ? "#16a34a" : s.health >= 95 ? "#d97706" : "#dc2626" }} />
                    </div>
                    <span className="fg-sv-st">✓</span>
                    <span className="fg-sv-lat">{s.lat}ms</span>
                    <span className="fg-sv-calls">{s.calls}</span>
                    <div className="fg-sv-spark">
                      <Spark data={Array.from({ length: 14 }, () => 4 + Math.random() * 28)} color={s.c} w={44} h={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture */}
            <div className="fg-cd">
              <div className="fg-cd-h">
                <span className="fg-cd-t">Architecture</span>
                <span className="fg-cd-m">request flow</span>
              </div>
              <div className="fg-arch">
                <div className="fg-arch-lb">Interfaces</div>
                <div className="fg-arch-row">
                  {[
                    { n: "Dashboard", s: "React · SSR", on: true },
                    { n: "Terminal", s: "Commands", on: true },
                    { n: "Portal", s: "Client-facing", on: true },
                    { n: "API", s: "REST + WS", on: false },
                  ].map((nd, i) => (
                    <div key={i} className={`fg-arch-nd${nd.on ? " on" : ""}`}>
                      <div className="fg-arch-nd-nm">{nd.n}</div>
                      <div className="fg-arch-nd-sub">{nd.s}</div>
                    </div>
                  ))}
                </div>
                <div className="fg-arch-conn"><div className="fg-arch-ln" /><span className="fg-arch-arr">↓</span><div className="fg-arch-ln" /></div>
                <div className="fg-arch-lb">Engine</div>
                <div className="fg-arch-row">
                  <div className="fg-arch-nd core">
                    <div className="fg-arch-nd-nm" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <HammerIcon size={13} color="#c89360" />
                      @felmark/forge
                    </div>
                    <div className="fg-arch-nd-sub">services · permissions · validation · business logic</div>
                  </div>
                </div>
                <div className="fg-arch-conn"><div className="fg-arch-ln" /><span className="fg-arch-arr">↓</span><div className="fg-arch-ln" /></div>
                <div className="fg-arch-lb">Infrastructure</div>
                <div className="fg-arch-row">
                  {[
                    { n: "Supabase", s: "DB · Auth", em: true },
                    { n: "Stripe", s: "Payments", em: true },
                    { n: "Haiku", s: "AI · Insights", em: true },
                    { n: "Vercel", s: "Edge · CDN", em: false },
                  ].map((nd, i) => (
                    <div key={i} className={`fg-arch-nd${nd.em ? " em" : ""}`}>
                      <div className="fg-arch-nd-nm">{nd.n}</div>
                      <div className="fg-arch-nd-sub">{nd.s}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Uptime calendar */}
              <div className="fg-up">
                <div className="fg-arch-lb">30-day uptime</div>
                <div className="fg-up-grid">
                  {uptimeDays.map((d, i) => (
                    <div key={i} className="fg-up-day" style={{
                      background: d >= 100 ? "#16a34a" : d >= 99.5 ? "#d97706" : "#dc2626",
                      opacity: d >= 100 ? 0.15 : d >= 99.5 ? 0.35 : 0.5,
                    }} title={`Day ${i + 1}: ${d}%`} />
                  ))}
                </div>
                <div className="fg-up-labels"><span>30 days ago</span><span>Today</span></div>
              </div>
            </div>
          </div>

          {/* Events */}
          <div>
            <div className="fg-cd" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <div className="fg-cd-h">
                <span className="fg-cd-t">Events</span>
                <span className="fg-cd-m"><Dot color="#16a34a" pulse size={4} /> streaming</span>
              </div>
              <div className="fg-evts">
                {events.map(e => (
                  <div key={e.id} className="fg-ev">
                    <div className="fg-ev-ic" style={{ color: e.c, background: e.c + "06", borderColor: e.c + "12" }}>{e.icon}</div>
                    <div className="fg-ev-bd">
                      <div className="fg-ev-act">{e.act}</div>
                      <div className="fg-ev-dtl">{e.dtl}</div>
                    </div>
                    <div className="fg-ev-r">
                      <div className="fg-ev-ts">{e.ts}</div>
                      <span className="fg-ev-svc">{e.svc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fg-ft">
          <div className="fg-ft-l"><Dot color="#16a34a" pulse size={5} /> All systems operational</div>
          <div className="fg-ft-r">
            {["Next.js 15", "Supabase", "Stripe Connect", "Claude Haiku", "Vercel Edge"].map((t, i) => (
              <span key={i} className="fg-ft-tech">{i > 0 && <span className="fg-ft-tech-dot" />}{t}</span>
            ))}
          </div>
        </div>

      </div></div>
    </>
  );
}
```
