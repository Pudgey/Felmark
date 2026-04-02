import { useState, useEffect } from "react";

const BOOT = [
  { text: "initializing @felmark/forge v1.0.0", delay: 100 },
  { text: "loading workspace: alex-mercer-design", delay: 300 },
  { text: "connecting forge services ████████████ done", delay: 600 },
  { text: "scanning 4 clients · 8 projects · 12 invoices", delay: 900 },
  { text: "ai model: haiku-3.5 · context loaded", delay: 1100 },
  { text: "forge ready. all systems operational.", delay: 1600 },
];

export default function TerminalWelcome() {
  const [lines, setLines] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptVal, setPromptVal] = useState("");
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    BOOT.forEach(({ text, delay }) => setTimeout(() => setLines(p => [...p, text]), delay));
    setTimeout(() => setShowPrompt(true), 2400);
  }, []);
  useEffect(() => { const i = setInterval(() => setCursorOn(v => !v), 530); return () => clearInterval(i); }, []);

  const hour = new Date().getHours();
  const greet = hour < 12 ? "good morning" : hour < 17 ? "good afternoon" : "good evening";
  const date = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toLowerCase();

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#1a1916;--bg2:#201e1a;--bg3:#272420;--bd:#332f28;--bd2:#2a2722;--t:#b5b2a9;--td:#65625a;--tb:#ece8e2;--em:#b07d4f;--emd:#8a6340;--emb:#d4a06a;--sg:#6b9a6b;--rs:#c07a6a;--lv:#8b8bba;--bl:#5b7fa4;--mono:'JetBrains Mono',monospace}
.tw{font-family:var(--mono);background:var(--bg);color:var(--t);height:100vh;display:flex;flex-direction:column;overflow:hidden;font-size:13px;line-height:1.6}
.tw::before{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px);pointer-events:none;z-index:100}

/* Bar */
.tw-bar{height:32px;padding:0 16px;background:var(--bg2);border-bottom:1px solid var(--bd);display:flex;align-items:center;gap:12px;flex-shrink:0}
.tw-dots{display:flex;gap:5px}
.tw-dot{width:8px;height:8px;border-radius:50%}
.tw-bar-t{flex:1;text-align:center;font-size:11px;color:var(--td);letter-spacing:.05em}
.tw-bar-s{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--sg)}
.tw-pulse{width:5px;height:5px;border-radius:50%;background:var(--sg);animation:p 2s ease infinite}
@keyframes p{0%,60%,100%{opacity:.3}20%{opacity:1}}

.tw-main{flex:1;display:flex;overflow:hidden}

/* Left */
.tw-l{flex:1;overflow-y:auto;border-right:1px solid var(--bd)}
.tw-l::-webkit-scrollbar{width:4px}
.tw-l::-webkit-scrollbar-thumb{background:var(--bd);border-radius:2px}

.tw-hero{padding:40px 40px 24px}
.tw-ascii{color:var(--em);font-size:10px;line-height:1.2;margin-bottom:16px;opacity:.5;white-space:pre}
.tw-greet{font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:500;color:var(--tb);line-height:1.1}
.tw-greet em{color:var(--emb);font-style:italic}
.tw-meta{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--td);margin-top:6px}
.tw-streak{display:inline-flex;align-items:center;gap:4px;color:var(--em);background:rgba(176,125,79,.06);padding:2px 8px;border-radius:3px;border:1px solid rgba(176,125,79,.08)}

/* Focus */
.tw-focus{margin:0 40px 20px;padding:14px 18px;background:var(--bg2);border:1px solid var(--bd);border-left:3px solid var(--em);border-radius:0 8px 8px 0}
.tw-focus-lb{font-size:9px;color:var(--em);text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px}
.tw-focus-t{font-size:15px;color:var(--tb);font-weight:500}
.tw-focus-m{font-size:10px;color:var(--td);margin-top:2px}

/* Section */
.tw-sec{padding:0 40px 20px}
.tw-sec-lb{font-size:9px;color:var(--td);text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:8px;margin-bottom:10px}
.tw-sec-lb::after{content:'';flex:1;height:1px;background:var(--bd)}

/* Table */
.tw-row{display:flex;align-items:center;padding:4px 0}
.tw-key{width:180px;color:var(--td);flex-shrink:0}
.tw-val{color:var(--tb);flex-shrink:0}
.tw-badge{font-size:9px;padding:1px 7px;border-radius:3px;margin-left:8px;border:1px solid}

/* Attention */
.tw-att{padding:10px 12px;background:var(--bg2);border:1px solid var(--bd);border-radius:6px;margin-bottom:6px;display:flex;align-items:flex-start;gap:10px}
.tw-att-ic{width:24px;height:24px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;margin-top:1px}
.tw-att-t{font-size:12px;color:var(--tb)}
.tw-att-m{font-size:10px;color:var(--td);margin-top:1px}

/* Events */
.tw-ev{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:12px}
.tw-ev-ic{font-size:10px;width:16px;text-align:center;flex-shrink:0}
.tw-ev b{color:var(--tb);font-weight:500}

/* Right */
.tw-r{width:340px;display:flex;flex-direction:column;flex-shrink:0;background:var(--bg2)}

/* Forge */
.tw-forge{padding:20px;border-bottom:1px solid var(--bd)}
.tw-forge-hd{display:flex;justify-content:space-between;margin-bottom:12px}
.tw-forge-t{font-size:11px;color:var(--em);text-transform:uppercase;letter-spacing:.08em}
.tw-forge-v{font-size:10px;color:var(--td)}
.tw-svc{display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--bd2)}
.tw-svc:last-child{border-bottom:none}
.tw-svc-d{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.tw-svc-n{font-size:11px;flex:1}
.tw-svc-l{font-size:10px;color:var(--td)}
.tw-svc-s{font-size:9px;padding:1px 6px;border-radius:3px}

/* Boot */
.tw-boot{padding:16px 20px;border-bottom:1px solid var(--bd)}
.tw-boot-t{font-size:9px;color:var(--td);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}
.tw-boot-ln{font-size:10px;color:var(--td);padding:2px 0;display:flex;align-items:center;gap:6px;animation:bi .15s ease}
@keyframes bi{from{opacity:0;transform:translateY(2px)}to{opacity:1;transform:translateY(0)}}

/* Metrics */
.tw-metrics{padding:16px 20px;border-bottom:1px solid var(--bd)}
.tw-metrics-t{font-size:9px;color:var(--td);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px}
.tw-metric{display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd2)}
.tw-metric:last-child{border-bottom:none}
.tw-metric-lb{font-size:11px;color:var(--td)}
.tw-metric-r{display:flex;align-items:center;gap:4px}
.tw-metric-v{font-size:13px;font-weight:500}
.tw-metric-bar{width:60px;height:3px;background:var(--bd);border-radius:2px;overflow:hidden}
.tw-metric-fill{height:100%;border-radius:2px}

/* Graph */
.tw-graph{padding:16px 20px;border-bottom:1px solid var(--bd)}
.tw-graph-t{font-size:9px;color:var(--td);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px}
.tw-graph-bars{display:flex;gap:3px;height:48px;align-items:flex-end}
.tw-graph-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px}
.tw-graph-bar{width:100%;border-radius:2px 2px 0 0}
.tw-graph-lb{font-size:7px;color:var(--td)}

/* Comments */
.tw-cmts{padding:16px 20px;flex:1;overflow-y:auto}
.tw-cmts::-webkit-scrollbar{width:3px}
.tw-cmts::-webkit-scrollbar-thumb{background:var(--bd);border-radius:2px}
.tw-cmts-t{font-size:9px;color:var(--td);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px}
.tw-cmt{padding:8px 0;border-bottom:1px solid var(--bd2)}
.tw-cmt:last-child{border-bottom:none}
.tw-cmt-hd{display:flex;align-items:center;gap:6px;margin-bottom:4px}
.tw-cmt-av{width:18px;height:18px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:500;color:var(--bg);flex-shrink:0}
.tw-cmt-nm{font-size:11px;color:var(--tb)}
.tw-cmt-tm{font-size:9px;color:var(--td)}
.tw-cmt-pj{font-size:9px;color:var(--td);background:var(--bg3);padding:1px 6px;border-radius:2px}
.tw-cmt-tx{font-size:11px;color:var(--t);line-height:1.5;padding-left:24px}

/* Prompt */
.tw-prompt{padding:10px 20px;background:var(--bg);border-top:1px solid var(--bd);display:flex;align-items:center;gap:8px;flex-shrink:0}
.tw-prompt-c{color:var(--em);font-size:13px}
.tw-prompt-p{color:var(--td);font-size:11px}
.tw-prompt-in{flex:1;background:transparent;border:none;outline:none;color:var(--tb);font-family:var(--mono);font-size:13px;caret-color:var(--em)}
.tw-prompt-in::placeholder{color:var(--bd)}
.tw-prompt-hints{font-size:9px;color:var(--td);display:flex;gap:8px}
.tw-prompt-k{background:var(--bg3);padding:1px 5px;border-radius:2px;border:1px solid var(--bd)}

/* Status */
.tw-st{height:24px;padding:0 16px;background:var(--bg2);border-top:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;font-size:9px;color:var(--td);flex-shrink:0}
.tw-st-l{display:flex;align-items:center;gap:8px}
.tw-st-d{width:4px;height:4px;border-radius:50%}
.tw-st-sep{width:1px;height:10px;background:var(--bd)}
      `}</style>

      <div className="tw">
        <div className="tw-bar">
          <div className="tw-dots"><div className="tw-dot" style={{ background: "var(--rs)" }} /><div className="tw-dot" style={{ background: "var(--em)" }} /><div className="tw-dot" style={{ background: "var(--sg)" }} /></div>
          <div className="tw-bar-t">felmark · workspace terminal</div>
          <div className="tw-bar-s"><div className="tw-pulse" />operational</div>
        </div>

        <div className="tw-main">
          {/* LEFT */}
          <div className="tw-l">
            <div className="tw-hero">
              <div className="tw-ascii">{`  ╔═╗╔═╗╦  ╔╦╗╔═╗╦═╗╦╔═
  ╠╣ ║╣ ║  ║║║╠═╣╠╦╝╠╩╗
  ╚  ╚═╝╩═╝╩ ╩╩ ╩╩╚═╩ ╩`}</div>
              <div className="tw-greet">{greet}. <em>let's build.</em></div>
              <div className="tw-meta"><span>{date}</span><span>·</span><span className="tw-streak">🔥 14-day streak</span></div>
            </div>

            <div className="tw-focus">
              <div className="tw-focus-lb">◆ suggested focus</div>
              <div className="tw-focus-t">Continue Brand Guidelines v2</div>
              <div className="tw-focus-m">typography section · 65% complete · due in 5 days · last edited 2m ago</div>
            </div>

            <div className="tw-sec">
              <div className="tw-sec-lb">Status</div>
              <div className="tw-row"><span className="tw-key">active projects</span><span className="tw-val" style={{ color: "var(--sg)" }}>7</span></div>
              <div className="tw-row"><span className="tw-key">in review</span><span className="tw-val" style={{ color: "var(--lv)" }}>1</span></div>
              <div className="tw-row"><span className="tw-key">overdue</span><span className="tw-val" style={{ color: "var(--rs)" }}>1</span><span className="tw-badge" style={{ color: "var(--rs)", borderColor: "rgba(192,122,106,.15)", background: "rgba(192,122,106,.04)" }}>NEEDS ACTION</span></div>
            </div>

            <div className="tw-sec">
              <div className="tw-sec-lb">Revenue</div>
              <div className="tw-row"><span className="tw-key">earned this month</span><span className="tw-val" style={{ color: "var(--sg)" }}>$14,800</span><span className="tw-badge" style={{ color: "var(--sg)", borderColor: "rgba(107,154,107,.15)", background: "rgba(107,154,107,.04)" }}>+40% VS FEB</span></div>
              <div className="tw-row"><span className="tw-key">pending payment</span><span className="tw-val" style={{ color: "var(--em)" }}>$7,200</span></div>
              <div className="tw-row"><span className="tw-key">total pipeline</span><span className="tw-val" style={{ color: "var(--tb)" }}>$22,000</span></div>
              <div style={{ margin: "12px 0 0", padding: "8px 12px", background: "rgba(107,154,107,.04)", border: "1px solid rgba(107,154,107,.06)", borderRadius: 5 }}>
                <span style={{ color: "var(--sg)", fontSize: 11 }}>↗ You're $200 away from your $15k monthly goal — best month since October</span>
              </div>
            </div>

            <div className="tw-sec">
              <div className="tw-sec-lb">Attention</div>
              {[
                { ic: "!", c: "var(--rs)", t: "Bolt Fitness — App Onboarding UX is 4 days overdue", m: "70% complete · $4,000 · Last activity: 3 days ago" },
                { ic: "→", c: "var(--em)", t: "Brand Guidelines v2 — due in 5 days (65% complete)", m: "Typography section active · Sarah reviewed yesterday" },
                { ic: "$", c: "var(--sg)", t: "Invoice #047 — $2,400 sent, awaiting payment", m: "Meridian Studio · Viewed 2x by sarah@ · Sent 3h ago" },
              ].map((a, i) => (
                <div key={i} className="tw-att">
                  <div className="tw-att-ic" style={{ color: a.c, background: a.c.replace(")", ",.06)").replace("var(", "rgba(").replace("--rs", "192,122,106").replace("--em", "176,125,79").replace("--sg", "107,154,107"), border: `1px solid ${a.c.replace(")", ",.08)").replace("var(", "rgba(").replace("--rs", "192,122,106").replace("--em", "176,125,79").replace("--sg", "107,154,107")}` }}>{a.ic}</div>
                  <div><div className="tw-att-t">{a.t}</div><div className="tw-att-m">{a.m}</div></div>
                </div>
              ))}
            </div>

            <div className="tw-sec">
              <div className="tw-sec-lb">Since Last Session</div>
              {[
                { ic: "$", c: "var(--sg)", t: <><b>$1,800</b> payment received from Nora Kim</> },
                { ic: "◎", c: "var(--bl)", t: <>Proposal viewed <b>3x</b> by nora@coachkim.com</> },
                { ic: "✓", c: "var(--sg)", t: <>Nora <b>signed</b> the Course Landing Page proposal</> },
                { ic: "◇", c: "var(--lv)", t: <>New inquiry from <b>Luna Boutique</b> via lead form</> },
                { ic: "✉", c: "var(--em)", t: <>Sarah left <b>3 comments</b> on Brand Guidelines scope</> },
              ].map((e, i) => (
                <div key={i} className="tw-ev"><span className="tw-ev-ic" style={{ color: e.c }}>{e.ic}</span><span>{e.t}</span></div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="tw-r">
            <div className="tw-forge">
              <div className="tw-forge-hd"><span className="tw-forge-t">◆ Forge Status</span><span className="tw-forge-v">v1.0.0</span></div>
              {[
                { n: "projects", s: "ok", l: "2ms", c: "var(--sg)" },
                { n: "clients", s: "ok", l: "1ms", c: "var(--sg)" },
                { n: "invoices", s: "ok", l: "3ms", c: "var(--sg)" },
                { n: "payments", s: "ok", l: "12ms", c: "var(--sg)" },
                { n: "documents", s: "ok", l: "4ms", c: "var(--sg)" },
                { n: "ai/haiku", s: "ok", l: "145ms", c: "var(--sg)" },
                { n: "wire", s: "idle", l: "—", c: "var(--td)" },
                { n: "sync", s: "ok", l: "8ms", c: "var(--sg)" },
              ].map((s, i) => (
                <div key={i} className="tw-svc">
                  <div className="tw-svc-d" style={{ background: s.c }} />
                  <span className="tw-svc-n">{s.n}</span>
                  <span className="tw-svc-l">{s.l}</span>
                  <span className="tw-svc-s" style={{ color: s.c, background: s.c === "var(--sg)" ? "rgba(107,154,107,.06)" : "rgba(101,98,90,.06)" }}>{s.s}</span>
                </div>
              ))}
            </div>

            <div className="tw-boot">
              <div className="tw-boot-t">Boot Log</div>
              {lines.map((ln, i) => <div key={i} className="tw-boot-ln"><span style={{ color: "var(--sg)" }}>→</span><span>{ln}</span></div>)}
              {lines.length < 6 && <div className="tw-boot-ln"><span style={{ color: "var(--em)" }}>●</span><span style={{ color: "var(--em)" }}>loading...</span></div>}
            </div>

            <div className="tw-metrics">
              <div className="tw-metrics-t">Metrics</div>
              {[
                { lb: "effective rate", v: "$108/hr", pct: 72, c: "var(--em)" },
                { lb: "utilization", v: "78%", pct: 78, c: "var(--sg)" },
                { lb: "avg response", v: "4.2h", pct: 45, c: "var(--lv)" },
                { lb: "close rate", v: "68%", pct: 68, c: "var(--sg)" },
              ].map((m, i) => (
                <div key={i} className="tw-metric">
                  <span className="tw-metric-lb">{m.lb}</span>
                  <div className="tw-metric-r"><span className="tw-metric-v" style={{ color: m.c }}>{m.v}</span><div className="tw-metric-bar"><div className="tw-metric-fill" style={{ width: `${m.pct}%`, background: m.c }} /></div></div>
                </div>
              ))}
            </div>

            <div className="tw-graph">
              <div className="tw-graph-t">Revenue · 7 Days</div>
              <div className="tw-graph-bars">
                {[{ d: "M", v: 1200 }, { d: "T", v: 0 }, { d: "W", v: 3400 }, { d: "T", v: 800 }, { d: "F", v: 1800 }, { d: "S", v: 0 }, { d: "S", v: 0 }].map((day, i) => (
                  <div key={i} className="tw-graph-col">
                    <div className="tw-graph-bar" style={{ height: `${day.v > 0 ? (day.v / 3400) * 100 : 2}%`, background: day.v > 0 ? "var(--em)" : "var(--bd)", opacity: day.v > 0 ? .5 : .2 }} />
                    <span className="tw-graph-lb">{day.d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="tw-cmts">
              <div className="tw-cmts-t">Recent Comments</div>
              {[
                { av: "#7c8594", n: "S", nm: "Sarah Chen", tm: "2m ago", pj: "Brand Guidelines", tx: "The teal feels too cold — can we push toward a warmer tone? Maybe sage or olive." },
                { av: "#a08472", n: "N", nm: "Nora Kim", tm: "1h ago", pj: "Landing Page", tx: "Just signed! So excited to get started on this." },
                { av: "#8a7e63", n: "J", nm: "Jake Torres", tm: "3d ago", pj: "App Onboarding", tx: "Been swamped — will review the screens this week for sure." },
              ].map((c, i) => (
                <div key={i} className="tw-cmt">
                  <div className="tw-cmt-hd"><div className="tw-cmt-av" style={{ background: c.av }}>{c.n}</div><span className="tw-cmt-nm">{c.nm}</span><span className="tw-cmt-tm">{c.tm}</span><span className="tw-cmt-pj">{c.pj}</span></div>
                  <div className="tw-cmt-tx">{c.tx}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showPrompt && (
          <div className="tw-prompt">
            <span className="tw-prompt-c">❯</span>
            <span className="tw-prompt-p">~/workspace</span>
            <input className="tw-prompt-in" value={promptVal} onChange={e => setPromptVal(e.target.value)} placeholder="type a command or press / for help" autoFocus />
            <div className="tw-prompt-hints"><span><span className="tw-prompt-k">/</span> commands</span><span><span className="tw-prompt-k">⌘K</span> search</span><span><span className="tw-prompt-k">esc</span> close</span></div>
          </div>
        )}

        <div className="tw-st">
          <div className="tw-st-l"><div className="tw-st-d" style={{ background: "var(--sg)" }} /><span>felmark v0.1.0</span><span className="tw-st-sep" /><span>4 clients</span><span className="tw-st-sep" /><span>8 projects</span><span className="tw-st-sep" /><span>forge: all services operational</span></div>
          <span>{date} · {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
    </>
  );
}
