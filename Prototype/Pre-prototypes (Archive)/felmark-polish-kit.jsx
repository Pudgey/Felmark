import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   FELMARK POLISH KIT — v2 (debugged)
   ═══════════════════════════════════════════ */

function AnimNum({ value, prefix = "", suffix = "", color }) {
  const [n, setN] = useState(0);
  const ran = useRef(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        const t0 = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - t0) / 1400, 1);
          setN(Math.round((1 - Math.pow(1 - p, 4)) * value));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return <span ref={ref} className="pk-num" style={{ color }}>{prefix}{n.toLocaleString()}{suffix}</span>;
}

function Spark({ data, color, id }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const w = 100, h = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - 3 - ((v - min) / range) * (h - 6)}`).join(" ");
  const last = pts.split(" ").pop().split(",");
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`spk-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`${pts} ${w},${h} 0,${h}`} fill={`url(#spk-${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx={last[0]} cy={last[1]} r="2" fill={color} opacity="0.7" />
    </svg>
  );
}

function Ring({ pct, color, label, sub, deadline, deadlineColor }) {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const size = 88, r = 38, circ = 2 * Math.PI * r;
  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx="44" cy="44" r={r} fill="none" stroke="var(--warm-200)" strokeWidth="5" />
        <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={vis ? circ - (pct / 100) * circ : circ}
          strokeLinecap="round" transform="rotate(-90 44 44)"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
        <text x="44" y="40" textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: 20, fontWeight: 600, fill: color, fontFamily: "'Cormorant Garamond', serif" }}>
          {vis ? pct : 0}%
        </text>
        <text x="44" y="56" textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: 8, fill: "var(--ink-300)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          complete
        </text>
      </svg>
      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-700)", textAlign: "center", lineHeight: 1.25 }}>{label}</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-300)" }}>{sub}</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 500, color: deadlineColor }}>{deadline}</div>
    </div>
  );
}

export default function PolishKit() {
  const [hoveredWs, setHoveredWs] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [revealed, setRevealed] = useState(0);
  const [barsVis, setBarsVis] = useState(false);
  const barsRef = useRef(null);

  useEffect(() => {
    const i = setInterval(() => setRevealed(p => Math.min(p + 1, 6)), 180);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setBarsVis(true); }, { threshold: 0.3 });
    if (barsRef.current) obs.observe(barsRef.current);
    return () => obs.disconnect();
  }, []);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dayPct = ((hour * 60 + now.getMinutes()) / 1440) * 100;

  const stats = [
    { id: "a", label: "Earned this month", value: 14800, prefix: "$", change: "+40%", up: true, color: "#5a9a3c", spark: [4200, 5800, 3900, 7200, 6100, 8400, 8200, 11400, 9800, 13200, 10600, 14800], detail: "Best month since October" },
    { id: "b", label: "Total pipeline", value: 36700, prefix: "$", change: "10 deals", up: false, color: "#b07d4f", spark: [18000, 22000, 28000, 24000, 31000, 29000, 33000, 36700], detail: "3 proposals awaiting" },
    { id: "c", label: "Effective rate", value: 112, prefix: "$", suffix: "/hr", change: "+$8", up: true, color: "#5b7fa4", spark: [85, 88, 92, 95, 98, 104, 104, 108, 112], detail: "Above market average" },
    { id: "d", label: "Hours this week", value: 32, suffix: "h", change: "80%", up: false, color: "#7c6b9e", spark: [28, 35, 30, 38, 32], detail: "8 hours capacity left" },
  ];

  const activity = [
    { icon: "$", color: "#5a9a3c", text: "Payment received", detail: "$1,800 from Nora Kim", time: "32m", hot: true },
    { icon: "◎", color: "#5b7fa4", text: "Invoice viewed", detail: "Sarah · Meridian Studio", time: "1h" },
    { icon: "→", color: "#8a7e63", text: "New comment", detail: "Brand Guidelines doc", time: "2h" },
    { icon: "✓", color: "#5a9a3c", text: "Proposal signed", detail: "Nora Kim · $3,200", time: "3h" },
    { icon: "↗", color: "#b07d4f", text: "Proposal sent", detail: "Luna Boutique · $6,500", time: "5h" },
    { icon: "!", color: "#c24b38", text: "Invoice overdue", detail: "Bolt Fitness · $4,000", time: "1d" },
  ];

  const workspaces = [
    { id: "w1", name: "Meridian Studio", av: "M", avC: "#7c8594", proj: 3, val: "$4,200", st: "Active", stC: "#5a9a3c", active: "2m ago", unread: 2 },
    { id: "w2", name: "Nora Kim", av: "N", avC: "#a08472", proj: 2, val: "$3,200", st: "Active", stC: "#5a9a3c", active: "1h ago", unread: 0 },
    { id: "w3", name: "Bolt Fitness", av: "B", avC: "#8a7e63", proj: 1, val: "$4,000", st: "Overdue", stC: "#c24b38", active: "3d ago", unread: 1 },
    { id: "w4", name: "Luna Boutique", av: "L", avC: "#7c6b9e", proj: 0, val: "—", st: "Lead", stC: "#5b7fa4", active: "New", unread: 0 },
  ];

  const months = [
    { m: "Oct", v: 8200 }, { m: "Nov", v: 11400 }, { m: "Dec", v: 9800 },
    { m: "Jan", v: 13200 }, { m: "Feb", v: 10600 }, { m: "Mar", v: 14800 },
  ];
  const maxV = Math.max(...months.map(m => m.v));

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.pk{font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink-700);background:var(--parchment);min-height:100vh;padding:24px 20px}
.pk-inner{max-width:940px;margin:0 auto}

/* Greeting */
.pk-greet{background:#fff;border:1px solid var(--warm-200);border-radius:12px;padding:18px 22px 16px;margin-bottom:14px}
.pk-greet-bar{height:3px;background:var(--warm-200);border-radius:2px;margin-bottom:14px;overflow:hidden}
.pk-greet-fill{height:100%;background:var(--ember);border-radius:2px}
.pk-greet-row{display:flex;align-items:flex-end;justify-content:space-between;gap:16px}
.pk-greet-text{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:500;color:var(--ink-900);line-height:1.2}
.pk-greet-text em{color:var(--ember);font-style:normal}
.pk-greet-meta{font-family:var(--mono);font-size:10px;color:var(--ink-300);text-align:right;flex-shrink:0;line-height:1.6}

/* Stats */
.pk-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
.pk-num{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;line-height:1;font-variant-numeric:tabular-nums}
.pk-stat{background:#fff;border:1px solid var(--warm-200);border-radius:10px;padding:16px 16px 12px;transition:border-color .15s,box-shadow .15s,transform .15s}
.pk-stat:hover{border-color:var(--warm-300);transform:translateY(-1px);box-shadow:0 3px 12px rgba(0,0,0,0.03)}
.pk-stat-row{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:3px}
.pk-stat-ch{font-family:var(--mono);font-size:10px;font-weight:500}
.pk-stat-ch.up{color:#5a9a3c}
.pk-stat-ch.neut{color:var(--ink-300)}
.pk-stat-label{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
.pk-stat-det{font-size:11px;color:var(--ink-400);margin-top:0;padding-top:0;border-top:none;max-height:0;opacity:0;overflow:hidden;transition:max-height .2s ease,opacity .2s ease,margin-top .2s ease,padding-top .2s ease}
.pk-stat:hover .pk-stat-det{max-height:30px;opacity:1;margin-top:8px;padding-top:8px;border-top:1px solid var(--warm-100)}

/* Grid */
.pk-grid{display:grid;grid-template-columns:1fr 320px;gap:12px}

/* Card */
.pk-card{background:#fff;border:1px solid var(--warm-200);border-radius:10px;overflow:hidden}
.pk-card+.pk-card{margin-top:12px}
.pk-card-head{padding:12px 16px;border-bottom:1px solid var(--warm-100);display:flex;align-items:center;justify-content:space-between}
.pk-card-title{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:var(--ink-900)}

/* Rings */
.pk-rings{display:flex;justify-content:space-evenly;padding:18px 12px}

/* Workspaces */
.pk-ws-list{padding:4px}
.pk-ws{display:flex;align-items:center;gap:11px;padding:9px 10px;border-radius:7px;cursor:pointer;transition:background .1s;position:relative;overflow:hidden}
.pk-ws:hover{background:var(--warm-50)}
.pk-ws-av{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:#fff;flex-shrink:0;position:relative}
.pk-ws-unread{position:absolute;top:-3px;right:-3px;min-width:14px;height:14px;border-radius:7px;background:#c24b38;color:#fff;font-size:8px;font-weight:600;display:flex;align-items:center;justify-content:center;border:2px solid #fff}
.pk-ws-info{flex:1;min-width:0}
.pk-ws-name{font-size:13px;font-weight:500;color:var(--ink-800);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pk-ws-meta{display:flex;align-items:center;gap:5px;margin-top:2px}
.pk-ws-badge{font-family:var(--mono);font-size:8px;font-weight:500;padding:1px 6px;border-radius:3px;border:1px solid;display:inline-flex;align-items:center;gap:3px}
.pk-ws-dot{width:4px;height:4px;border-radius:50%}
.pk-ws-sub{font-size:11px;color:var(--ink-300)}
.pk-ws-right{text-align:right;flex-shrink:0}
.pk-ws-val{font-family:var(--mono);font-size:12px;font-weight:600;color:var(--ink-700)}
.pk-ws-time{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.pk-ws-shim{position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(176,125,79,0.03),transparent);animation:shim 2s ease;pointer-events:none}
@keyframes shim{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}

/* Activity */
.pk-act-hdr{display:flex;align-items:center;gap:5px}
.pk-act-dot{width:5px;height:5px;border-radius:50%;background:#5a9a3c;animation:pls 1.5s ease infinite}
@keyframes pls{0%,60%,100%{opacity:.3;transform:scale(1)}15%{opacity:1;transform:scale(1.3)}}
.pk-act-lbl{font-family:var(--mono);font-size:9px;color:#5a9a3c}
.pk-acts{padding:2px}
.pk-act{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:6px;opacity:0;transform:translateY(5px);transition:all .25s ease;position:relative}
.pk-act.vis{opacity:1;transform:translateY(0)}
.pk-act+.pk-act{border-top:1px solid var(--warm-100)}
.pk-act:hover{background:var(--warm-50)}
.pk-act-ic{width:24px;height:24px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;flex-shrink:0;border:1px solid}
.pk-act-bd{flex:1;min-width:0}
.pk-act-tx{font-size:12px;font-weight:500;color:var(--ink-700)}
.pk-act-dtl{font-size:11px;color:var(--ink-400);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pk-act-tm{font-family:var(--mono);font-size:9px;color:var(--ink-300);flex-shrink:0}

/* Earnings */
.pk-earn-hdr{display:flex;justify-content:space-between;align-items:baseline;width:100%}
.pk-earn-tot{text-align:right}
.pk-earn-tot .pk-num{font-size:22px}
.pk-earn-ch{font-family:var(--mono);font-size:10px;color:#5a9a3c;font-weight:500}
.pk-earn-chart{display:flex;align-items:flex-end;gap:6px;padding:14px 16px;height:170px}
.pk-earn-col{flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;cursor:pointer;position:relative}
.pk-earn-bw{width:100%;flex:1;display:flex;align-items:flex-end}
.pk-earn-b{width:100%;border-radius:3px;min-height:2px;transition:height .7s cubic-bezier(0.16,1,0.3,1),opacity .12s}
.pk-earn-col:hover .pk-earn-b{opacity:1 !important}
.pk-earn-m{font-family:var(--mono);font-size:9px;color:var(--ink-300);margin-top:5px}
.pk-earn-m.now{color:var(--ember);font-weight:500}
.pk-earn-tip{position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:var(--ink-900);color:#fff;padding:3px 8px;border-radius:4px;font-family:var(--mono);font-size:10px;font-weight:500;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .12s;z-index:2}
.pk-earn-col:hover .pk-earn-tip{opacity:1}
      `}</style>

      <div className="pk"><div className="pk-inner">
        {/* Greeting */}
        <div className="pk-greet">
          <div className="pk-greet-bar"><div className="pk-greet-fill" style={{ width: `${dayPct}%` }} /></div>
          <div className="pk-greet-row">
            <div className="pk-greet-text">{greeting}. <em>Let's build.</em></div>
            <div className="pk-greet-meta">
              {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}<br />
              {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="pk-stats">
          {stats.map(s => (
            <div key={s.id} className="pk-stat">
              <div className="pk-stat-row">
                <AnimNum value={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} color={s.color} />
                <span className={`pk-stat-ch${s.up ? " up" : " neut"}`}>{s.up ? "↑ " : ""}{s.change}</span>
              </div>
              <div className="pk-stat-label">{s.label}</div>
              <Spark data={s.spark} color={s.color} id={s.id} />
              <div className="pk-stat-det">{s.detail}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="pk-grid">
          <div>
            {/* Rings */}
            <div className="pk-card">
              <div className="pk-card-head"><span className="pk-card-title">Active projects</span></div>
              <div className="pk-rings">
                <Ring pct={65} color="#5a9a3c" label="Brand Guidelines" sub="Meridian" deadline="5d left" deadlineColor="#c89360" />
                <Ring pct={25} color="#b07d4f" label="Course Page" sub="Nora Kim" deadline="14d left" deadlineColor="var(--ink-400)" />
                <Ring pct={70} color="#c24b38" label="App Onboarding" sub="Bolt Fitness" deadline="4d overdue" deadlineColor="#c24b38" />
              </div>
            </div>

            {/* Workspaces */}
            <div className="pk-card" style={{ marginTop: 12 }}>
              <div className="pk-card-head">
                <span className="pk-card-title">Workspaces</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-300)" }}>4 clients</span>
              </div>
              <div className="pk-ws-list">
                {workspaces.map(w => (
                  <div key={w.id} className="pk-ws" onMouseEnter={() => setHoveredWs(w.id)} onMouseLeave={() => setHoveredWs(null)}>
                    <div className="pk-ws-av" style={{ background: w.avC }}>
                      {w.av}
                      {w.unread > 0 && <span className="pk-ws-unread">{w.unread}</span>}
                    </div>
                    <div className="pk-ws-info">
                      <div className="pk-ws-name">{w.name}</div>
                      <div className="pk-ws-meta">
                        <span className="pk-ws-badge" style={{ color: w.stC, background: w.stC + "08", borderColor: w.stC + "15" }}>
                          <span className="pk-ws-dot" style={{ background: w.stC }} />{w.st}
                        </span>
                        <span className="pk-ws-sub">{w.proj} project{w.proj !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <div className="pk-ws-right">
                      <div className="pk-ws-val">{w.val}</div>
                      <div className="pk-ws-time">{w.active}</div>
                    </div>
                    {hoveredWs === w.id && <div className="pk-ws-shim" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            {/* Activity */}
            <div className="pk-card">
              <div className="pk-card-head">
                <span className="pk-card-title">Activity</span>
                <div className="pk-act-hdr"><div className="pk-act-dot" /><span className="pk-act-lbl">Live</span></div>
              </div>
              <div className="pk-acts">
                {activity.map((a, i) => (
                  <div key={i} className={`pk-act${i < revealed ? " vis" : ""}`} style={{ transitionDelay: `${i * 50}ms` }}>
                    <div className="pk-act-ic" style={{ color: a.color, background: a.color + "08", borderColor: a.color + "15" }}>{a.icon}</div>
                    <div className="pk-act-bd">
                      <div className="pk-act-tx">{a.text}</div>
                      <div className="pk-act-dtl">{a.detail}</div>
                    </div>
                    <div className="pk-act-tm">{a.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings */}
            <div className="pk-card" style={{ marginTop: 12 }}>
              <div className="pk-card-head">
                <div className="pk-earn-hdr">
                  <div>
                    <span className="pk-card-title">Earnings</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-300)", marginLeft: 8 }}>6 mo</span>
                  </div>
                  <div className="pk-earn-tot">
                    <AnimNum value={68000} prefix="$" color="var(--ink-900)" />
                    <div className="pk-earn-ch">↑ 18%</div>
                  </div>
                </div>
              </div>
              <div className="pk-earn-chart" ref={barsRef}>
                {months.map((m, i) => {
                  const cur = i === months.length - 1;
                  const h = barsVis ? (m.v / maxV) * 100 : 0;
                  return (
                    <div key={i} className="pk-earn-col" onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                      <div className="pk-earn-tip">${(m.v / 1000).toFixed(1)}k</div>
                      <div className="pk-earn-bw">
                        <div className="pk-earn-b" style={{
                          height: `${h}%`,
                          background: cur ? "var(--ember)" : "var(--warm-300)",
                          opacity: hoveredBar === i ? 1 : cur ? 0.8 : 0.3,
                          transitionDelay: `${i * 60}ms`,
                        }} />
                      </div>
                      <div className={`pk-earn-m${cur ? " now" : ""}`}>{m.m}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div></div>
    </>
  );
}
