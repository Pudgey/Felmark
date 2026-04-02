import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════
   FELMARK — WORKBENCH v2
   Three sections. Maximum polish.
   The workshop where you build your tools.
   ═══════════════════════════════════════════ */

const NODES = [
  { id: "n1", x: 80, y: 50, type: "trigger", label: "New Lead Arrives", sub: "via intake form", icon: "◆", color: "#8b8bba" },
  { id: "n2", x: 80, y: 190, type: "action", label: "Send Welcome Email", sub: "template: warm intro", icon: "✉", color: "#6b9a6b" },
  { id: "n3", x: 80, y: 330, type: "delay", label: "Wait 2 Days", sub: "pause for response", icon: "◎", color: "#9b988f" },
  { id: "n4", x: 280, y: 430, type: "condition", label: "Client Responded?", sub: "check email & portal", icon: "◇", color: "#b07d4f" },
  { id: "n5", x: 60, y: 560, type: "action", label: "Send Follow-up", sub: "template: gentle nudge", icon: "✉", color: "#c07a6a" },
  { id: "n6", x: 440, y: 560, type: "action", label: "Create Project", sub: "from service template", icon: "+", color: "#6b9a6b" },
  { id: "n7", x: 440, y: 700, type: "action", label: "Send Proposal", sub: "auto-filled from catalog", icon: "◆", color: "#b07d4f" },
  { id: "n8", x: 440, y: 840, type: "action", label: "Generate Invoice", sub: "50% deposit · auto-draft", icon: "$", color: "#6b9a6b" },
];
const CONNS = [
  { from: "n1", to: "n2" }, { from: "n2", to: "n3" }, { from: "n3", to: "n4" },
  { from: "n4", to: "n5", label: "No" }, { from: "n4", to: "n6", label: "Yes" },
  { from: "n6", to: "n7" }, { from: "n7", to: "n8" },
];
const SERVICES = [
  { id: "s1", name: "Brand Identity", price: "$6,500", per: "fixed", timeline: "6 weeks", deposit: "50%", color: "#8b8bba", items: ["Logo system", "Brand guidelines", "Color & typography", "Social templates", "Stationery suite"], template: "Brand Identity Project", popular: true },
  { id: "s2", name: "Website Redesign", price: "$12,000", per: "fixed", timeline: "10 weeks", deposit: "33%", color: "#6b9a6b", items: ["UX audit & research", "Wireframes", "Visual design", "Frontend development", "Launch & handoff"], template: "Website Redesign" },
  { id: "s3", name: "Monthly Retainer", price: "$3,000", per: "/month", timeline: "Ongoing", deposit: "—", color: "#b07d4f", items: ["20 hours/month", "Priority response", "Strategy call", "Quarterly review"], template: "Retainer Setup" },
  { id: "s4", name: "Strategy Session", price: "$150", per: "/hour", timeline: "Per session", deposit: "—", color: "#c07a6a", items: ["Brand audit", "Competitive analysis", "Recommendations", "Action plan"], template: "Consultation" },
];
const STAGES = [
  { id: "p1", name: "Inquiry", color: "#8b8bba", auto: "Send welcome email", time: "1–2d", count: 2, pct: 100 },
  { id: "p2", name: "Consultation", color: "#8b8bba", auto: "Schedule discovery call", time: "3–5d", count: 1, pct: 85 },
  { id: "p3", name: "Proposal", color: "#b07d4f", auto: "Send proposal from catalog", time: "2–4d", count: 1, pct: 65 },
  { id: "p4", name: "Negotiation", color: "#b07d4f", auto: "—", time: "1–7d", count: 0, pct: 50 },
  { id: "p5", name: "Booked", color: "#6b9a6b", auto: "Create project + invoice deposit", time: "—", count: 1, pct: 40 },
  { id: "p6", name: "Active", color: "#6b9a6b", auto: "Start onboarding sequence", time: "varies", count: 3, pct: 30 },
  { id: "p7", name: "Delivered", color: "#6b9a6b", auto: "Send feedback form", time: "—", count: 1, pct: 15 },
  { id: "p8", name: "Complete", color: "#9b988f", auto: "Referral request in 30d", time: "—", count: 2, pct: 8 },
];
const SECS = [
  { id: "workflows", icon: "⚡", label: "Workflows" },
  { id: "services", icon: "◆", label: "Services" },
  { id: "pipeline", icon: "→", label: "Pipeline" },
  { id: "templates", icon: "◎", label: "Templates", soon: true },
  { id: "forms", icon: "☐", label: "Forms", soon: true },
  { id: "sequences", icon: "✉", label: "Sequences", soon: true },
  { id: "portal", icon: "◇", label: "Portal", soon: true },
  { id: "brand", icon: "✦", label: "Brand Kit", soon: true },
  { id: "fields", icon: "#", label: "Custom Fields", soon: true },
  { id: "integrations", icon: "↗", label: "Integrations", soon: true },
];

export default function Workbench() {
  const [sec, setSec] = useState("workflows");
  const [selNode, setSelNode] = useState("n4");
  const [selSvc, setSelSvc] = useState(null);
  const [hovStage, setHovStage] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 50); }, []);

  const node = selNode ? NODES.find(n => n.id === selNode) : null;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{
--bg:#edeae5;--card:#fff;--tint:#f8f7f4;--bd:#ddd9d2;--bdl:#ebe8e2;
--i9:#252320;--i8:#363330;--i7:#4a4743;--i6:#5e5b56;--i5:#7a7772;--i4:#9b988f;--i3:#b5b2a9;--i2:#d0cdc6;
--em:#a87444;--emb:#c8915c;--embg:rgba(168,116,68,.04);
--sg:#5e8f5e;--sgbg:rgba(94,143,94,.04);
--lv:#7d7db0;--lvbg:rgba(125,125,176,.04);
--rs:#b46e5e;--rsbg:rgba(180,110,94,.04);
--mono:'JetBrains Mono',monospace;
--wb:#191815;--wb2:#21201c;--wb3:#2a2824;--wbd:#3a362e;--wbd2:#302c26;--wt:#ada9a0;--wtd:#706c64;--wtb:#e8e4dc
}
.wb{font-family:'DM Sans',sans-serif;background:var(--bg);height:100vh;display:flex;flex-direction:column;overflow:hidden}

/* Top */
.wb-top{height:52px;padding:0 24px;background:var(--card);border-bottom:1px solid var(--bd);display:flex;align-items:center;gap:12px;flex-shrink:0;z-index:10}
.wb-mark{width:28px;height:28px;border-radius:8px;background:var(--i9);display:flex;align-items:center;justify-content:center;color:var(--em);font-size:12px}
.wb-name{font-family:'Fraunces',serif;font-size:19px;font-weight:600;color:var(--i9)}
.wb-badge{font-family:var(--mono);font-size:8px;color:var(--em);background:var(--embg);padding:3px 10px;border-radius:5px;border:1px solid rgba(168,116,68,.06);letter-spacing:.06em}
.wb-sep{width:1px;height:20px;background:var(--bd);margin:0 8px}
.wb-section-name{font-size:15px;font-weight:500;color:var(--i7);flex:1}
.wb-btn{padding:8px 20px;border-radius:9px;border:1px solid var(--bd);background:var(--card);font-size:12px;font-family:inherit;color:var(--i5);cursor:pointer;transition:all .12s;font-weight:500}
.wb-btn:hover{background:var(--tint);border-color:var(--i2);transform:translateY(-1px)}
.wb-btn.p{background:var(--i9);color:var(--card);border-color:var(--i9)}
.wb-btn.p:hover{background:var(--i8);transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.06)}

.wb-body{flex:1;display:flex;overflow:hidden}

/* ═══ Sidebar ═══ */
.wb-side{width:210px;background:var(--card);border-right:1px solid var(--bd);display:flex;flex-direction:column;flex-shrink:0;padding:16px 8px}
.wb-side-t{font-family:var(--mono);font-size:9px;color:var(--i3);text-transform:uppercase;letter-spacing:.1em;padding:4px 12px 10px}
.wb-ni{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;cursor:pointer;margin-bottom:2px;transition:all .08s;border:1px solid transparent}
.wb-ni:hover{background:var(--tint)}
.wb-ni.on{background:var(--lvbg);border-color:rgba(125,125,176,.05)}
.wb-ni-ic{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;transition:all .1s}
.wb-ni.on .wb-ni-ic{background:var(--lvbg);color:var(--lv);border:1px solid rgba(125,125,176,.08)}
.wb-ni:not(.on) .wb-ni-ic{background:var(--tint);color:var(--i4);border:1px solid var(--bdl)}
.wb-ni-lb{font-size:13px;color:var(--i5)}.wb-ni.on .wb-ni-lb{color:var(--i8);font-weight:500}
.wb-ni-soon{font-family:var(--mono);font-size:7px;color:var(--i3);background:var(--bdl);padding:1px 5px;border-radius:3px;margin-left:auto}
.wb-side-ft{padding:14px;border-top:1px solid var(--bdl);font-family:var(--mono);font-size:9px;color:var(--i3);line-height:1.6;margin-top:auto}

/* ═══ WORKFLOWS ═══ */
.wf{flex:1;display:flex;flex-direction:column;overflow:hidden}
.wf-bar{padding:12px 24px;background:var(--wb2);border-bottom:1px solid var(--wbd);display:flex;align-items:center;gap:10px;flex-shrink:0}
.wf-bar-t{font-family:'Fraunces',serif;font-size:19px;font-weight:600;color:var(--wtb);flex:1}
.wf-bar-badge{font-family:var(--mono);font-size:9px;color:var(--em);background:rgba(168,116,68,.06);padding:3px 10px;border-radius:5px;border:1px solid rgba(168,116,68,.06)}
.wf-bar-btn{padding:7px 16px;border-radius:7px;border:1px solid var(--wbd);background:var(--wb2);font-size:11px;font-family:inherit;color:var(--wt);cursor:pointer;transition:all .1s;font-weight:500}
.wf-bar-btn:hover{border-color:var(--em);background:var(--wb3)}
.wf-bar-btn.go{background:var(--em);color:var(--wtb);border-color:var(--em)}.wf-bar-btn.go:hover{background:var(--emb)}

.wf-body{flex:1;display:flex;overflow:hidden}

/* Canvas */
.wf-cv{flex:1;background:var(--wb);overflow:auto;position:relative}
.wf-cv::-webkit-scrollbar{width:6px;height:6px}.wf-cv::-webkit-scrollbar-thumb{background:var(--wbd);border-radius:3px}
.wf-dots{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(168,116,68,.04) 1px,transparent 1px);background-size:28px 28px;pointer-events:none}

/* Nodes */
.wf-n{position:absolute;width:300px;background:var(--wb2);border:1px solid var(--wbd);border-radius:14px;cursor:pointer;transition:all .15s cubic-bezier(.16,1,.3,1);overflow:hidden;z-index:2}
.wf-n:hover{border-color:rgba(168,116,68,.2);box-shadow:0 12px 32px rgba(0,0,0,.2);transform:translateY(-3px)}
.wf-n.sel{border-color:var(--lv);box-shadow:0 0 0 3px rgba(125,125,176,.08),0 12px 32px rgba(0,0,0,.15)}
.wf-n-line{height:3px;width:0;transition:width .35s cubic-bezier(.16,1,.3,1)}.wf-n:hover .wf-n-line{width:100%}
.wf-n-body{padding:16px 18px;display:flex;align-items:flex-start;gap:12px}
.wf-n-ic{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;border:1px solid}
.wf-n-type{font-family:var(--mono);font-size:8px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:3px}
.wf-n-lb{font-size:15px;font-weight:500;color:var(--wtb)}
.wf-n-sub{font-size:12px;color:var(--wtd);margin-top:3px}

/* Detail panel */
.wf-det{width:300px;background:var(--wb2);border-left:1px solid var(--wbd);flex-shrink:0;overflow-y:auto;display:flex;flex-direction:column}
.wf-det::-webkit-scrollbar{width:3px}.wf-det::-webkit-scrollbar-thumb{background:var(--wbd);border-radius:2px}
.wf-det-hd{padding:20px;border-bottom:1px solid var(--wbd)}
.wf-det-type{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.wf-det-title{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:var(--wtb)}
.wf-det-sub{font-size:12px;color:var(--wtd);margin-top:4px}
.wf-det-sec{padding:18px 20px;border-bottom:1px solid var(--wbd)}
.wf-det-lb{font-family:var(--mono);font-size:8px;color:var(--wtd);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}
.wf-det-flb{font-size:12px;color:var(--wtd);margin-bottom:4px}
.wf-det-sel{width:100%;padding:9px 12px;background:var(--wb);border:1px solid var(--wbd);border-radius:8px;font-size:12px;font-family:inherit;color:var(--wtb);outline:none;appearance:none;margin-bottom:10px;transition:border-color .1s}
.wf-det-sel:focus{border-color:var(--em)}
.wf-det-in{width:100%;padding:9px 12px;background:var(--wb);border:1px solid var(--wbd);border-radius:8px;font-size:12px;font-family:inherit;color:var(--wtb);outline:none;margin-bottom:10px;transition:border-color .1s}
.wf-det-in:focus{border-color:var(--em)}
.wf-det-conn{display:flex;align-items:center;gap:6px;padding:6px 0;font-size:12px;color:var(--wtd)}
.wf-det-conn-dir{font-size:11px;width:18px;text-align:center;flex-shrink:0}

/* ═══ SERVICES ═══ */
.sv{flex:1;overflow-y:auto;padding:32px 40px}
.sv::-webkit-scrollbar{width:6px}.sv::-webkit-scrollbar-thumb{background:var(--bd);border-radius:3px}
.sv-hd{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:28px;max-width:800px}
.sv-t{font-family:'Fraunces',serif;font-size:30px;font-weight:600;color:var(--i9)}
.sv-sub{font-size:14px;color:var(--i4);margin-top:4px;line-height:1.5}
.sv-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:800px}
.sv-c{background:var(--card);border:1px solid var(--bd);border-radius:18px;overflow:hidden;transition:all .18s cubic-bezier(.16,1,.3,1);cursor:pointer;position:relative}
.sv-c:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.05);border-color:var(--i2)}
.sv-c.sel{border-color:var(--lv);box-shadow:0 0 0 3px rgba(125,125,176,.06)}
.sv-c-line{height:3px;width:0;transition:width .35s cubic-bezier(.16,1,.3,1)}.sv-c:hover .sv-c-line{width:100%}
.sv-c-pop{position:absolute;top:16px;right:16px;font-family:var(--mono);font-size:8px;color:var(--em);background:var(--embg);padding:3px 8px;border-radius:5px;border:1px solid rgba(168,116,68,.06)}
.sv-c-body{padding:24px 26px 20px}
.sv-c-price{font-family:'Fraunces',serif;font-size:36px;font-weight:700;line-height:1;display:flex;align-items:baseline;gap:2px}
.sv-c-per{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:400;opacity:.4}
.sv-c-name{font-size:18px;font-weight:500;color:var(--i7);margin-top:6px}
.sv-c-meta{display:flex;gap:10px;margin-top:10px;font-family:var(--mono);font-size:10px;color:var(--i3)}
.sv-c-meta-item{display:flex;align-items:center;gap:4px;padding:3px 8px;background:var(--tint);border-radius:5px;border:1px solid var(--bdl)}
.sv-c-items{margin-top:16px;padding-top:16px;border-top:1px solid var(--bdl)}
.sv-c-items-t{font-family:var(--mono);font-size:8px;color:var(--i3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
.sv-c-item{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:13px;color:var(--i5)}
.sv-c-item-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.sv-c-ft{padding:14px 26px;border-top:1px solid var(--bdl);display:flex;align-items:center;justify-content:space-between;background:var(--tint)}
.sv-c-tmpl{font-family:var(--mono);font-size:10px;color:var(--i3);display:flex;align-items:center;gap:5px}
.sv-c-edit{font-size:12px;color:var(--em);cursor:pointer;font-weight:500;transition:color .08s}
.sv-c-edit:hover{color:var(--emb)}

/* ═══ PIPELINE ═══ */
.pl{flex:1;overflow-y:auto;padding:32px 40px}
.pl::-webkit-scrollbar{width:6px}.pl::-webkit-scrollbar-thumb{background:var(--bd);border-radius:3px}
.pl-hd{margin-bottom:28px;max-width:840px}
.pl-t{font-family:'Fraunces',serif;font-size:30px;font-weight:600;color:var(--i9)}
.pl-sub{font-size:14px;color:var(--i4);margin-top:4px;line-height:1.5}

/* Visual funnel */
.pl-funnel{display:flex;gap:0;margin-bottom:28px;max-width:840px;position:relative}
.pl-funnel::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:var(--bd)}
.pl-fn{flex:1;text-align:center;padding:16px 6px 14px;background:var(--card);border:1px solid var(--bd);margin-right:-1px;transition:all .12s;cursor:pointer;position:relative;overflow:hidden}
.pl-fn:first-child{border-radius:14px 0 0 14px}.pl-fn:last-child{border-radius:0 14px 14px 0}
.pl-fn:hover,.pl-fn.hov{z-index:2;border-color:var(--lv);transform:scaleY(1.02)}
.pl-fn-bar{position:absolute;top:0;left:0;right:0;height:3px}
.pl-fn-name{font-size:11px;font-weight:500;color:var(--i5);margin-bottom:4px}
.pl-fn.hov .pl-fn-name{color:var(--i8)}
.pl-fn-count{font-family:'Fraunces',serif;font-size:22px;font-weight:600;line-height:1}
.pl-fn-time{font-family:var(--mono);font-size:9px;color:var(--i3);margin-top:6px}
.pl-fn-arr{position:absolute;right:-5px;top:50%;transform:translateY(-50%);color:var(--i2);font-size:9px;z-index:3}

/* Stage list */
.pl-list{max-width:700px}
.pl-li{display:flex;align-items:center;gap:14px;padding:16px 20px;background:var(--card);border:1px solid var(--bd);border-radius:14px;margin-bottom:8px;transition:all .12s cubic-bezier(.16,1,.3,1);cursor:pointer}
.pl-li:hover{border-color:var(--i2);box-shadow:0 6px 16px rgba(0,0,0,.02);transform:translateX(3px)}
.pl-li.hov{border-color:var(--lv);background:var(--lvbg);transform:translateX(3px)}
.pl-li-handle{font-size:11px;color:var(--i2);cursor:grab;flex-shrink:0}
.pl-li:hover .pl-li-handle{color:var(--i4)}
.pl-li-dot{width:12px;height:12px;border-radius:4px;flex-shrink:0}
.pl-li-info{flex:1;min-width:0}
.pl-li-name{font-size:15px;font-weight:500;color:var(--i8)}
.pl-li-auto{font-size:12px;color:var(--i4);margin-top:2px;display:flex;align-items:center;gap:5px}
.pl-li-auto-ic{color:var(--em);font-size:11px}
.pl-li-right{flex-shrink:0;text-align:right}
.pl-li-time{font-family:var(--mono);font-size:10px;color:var(--i3)}
.pl-li-count{font-family:var(--mono);font-size:13px;font-weight:500;margin-top:2px}

/* Coming soon */
.wb-soon{flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px}
.wb-soon-ic{font-size:32px;opacity:.15;margin-bottom:4px}
.wb-soon-t{font-size:17px;font-weight:500;color:var(--i5)}
.wb-soon-s{font-size:13px;color:var(--i4);max-width:260px;text-align:center;line-height:1.6}

/* Footer */
.wb-ft{height:30px;padding:0 24px;border-top:1px solid var(--bd);background:var(--card);display:flex;align-items:center;justify-content:space-between;font-family:var(--mono);font-size:9px;color:var(--i3);flex-shrink:0}

/* Stagger animation */
.stagger{opacity:0;transform:translateY(8px);animation:staggerIn .4s ease forwards}
@keyframes staggerIn{to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div className="wb">
        <div className="wb-top">
          <div className="wb-mark">◆</div>
          <span className="wb-name">Felmark</span>
          <span className="wb-badge">WORKBENCH</span>
          <span className="wb-sep" />
          <span className="wb-section-name">{SECS.find(s => s.id === sec)?.label}</span>
          <button className="wb-btn">← Back to Workspace</button>
          <button className="wb-btn p">Save Changes</button>
        </div>

        <div className="wb-body">
          {/* Sidebar */}
          <div className="wb-side">
            <div className="wb-side-t">Build</div>
            {SECS.map((s, i) => (
              <div key={s.id} className={`wb-ni${sec === s.id ? " on" : ""}`}
                style={loaded ? { animation: `staggerIn .4s ease ${i * 30}ms forwards`, opacity: 0 } : undefined}
                onClick={() => { setSec(s.id); setSelNode(null); setSelSvc(null); }}>
                <div className="wb-ni-ic">{s.icon}</div>
                <span className="wb-ni-lb">{s.label}</span>
                {s.soon && <span className="wb-ni-soon">SOON</span>}
              </div>
            ))}
            <div className="wb-side-ft">Build your systems once.<br />They run forever after. ◆</div>
          </div>

          {/* ═══ WORKFLOW BUILDER ═══ */}
          {sec === "workflows" && (
            <div className="wf">
              <div className="wf-bar">
                <span className="wf-bar-t">New Lead → Project Flow</span>
                <span className="wf-bar-badge">8 steps · active</span>
                <button className="wf-bar-btn">+ Add Step</button>
                <button className="wf-bar-btn go">▶ Test Run</button>
              </div>
              <div className="wf-body">
                <div className="wf-cv">
                  <div className="wf-dots" />
                  <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }} width="900" height="960" viewBox="0 0 900 960">
                    {CONNS.map((c, i) => {
                      const f = NODES.find(n => n.id === c.from), t = NODES.find(n => n.id === c.to);
                      if (!f || !t) return null;
                      const fx = f.x + 150, fy = f.y + 80, tx = t.x + 150, ty = t.y + 8;
                      const my = (fy + ty) / 2;
                      return (
                        <g key={i}>
                          <path d={`M${fx} ${fy} C${fx} ${my},${tx} ${my},${tx} ${ty}`} fill="none" stroke="rgba(168,116,68,.12)" strokeWidth="2" strokeDasharray="6 4" />
                          <circle cx={tx} cy={ty} r="3.5" fill="rgba(168,116,68,.25)" />
                          {c.label && <text x={(fx + tx) / 2 + (c.label === "Yes" ? 16 : -22)} y={my - 2} fill="rgba(168,116,68,.35)" fontSize="10" fontFamily="'JetBrains Mono',monospace">{c.label}</text>}
                        </g>
                      );
                    })}
                  </svg>
                  {NODES.map((n, i) => (
                    <div key={n.id} className={`wf-n${selNode === n.id ? " sel" : ""}`}
                      style={{ left: n.x, top: n.y, animationDelay: `${i * 50}ms` }}
                      onClick={() => setSelNode(selNode === n.id ? null : n.id)}>
                      <div className="wf-n-line" style={{ background: n.color }} />
                      <div className="wf-n-body">
                        <div className="wf-n-ic" style={{ color: n.color, background: n.color + "08", borderColor: n.color + "12" }}>{n.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div className="wf-n-type" style={{ color: n.color }}>{n.type}</div>
                          <div className="wf-n-lb">{n.label}</div>
                          <div className="wf-n-sub">{n.sub}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detail */}
                {node && (
                  <div className="wf-det">
                    <div className="wf-det-hd">
                      <div className="wf-det-type" style={{ color: node.color }}>{node.type}</div>
                      <div className="wf-det-title">{node.label}</div>
                      <div className="wf-det-sub">{node.sub}</div>
                    </div>
                    <div className="wf-det-sec">
                      <div className="wf-det-lb">Configuration</div>
                      {node.type === "trigger" && <><div className="wf-det-flb">Source</div><select className="wf-det-sel"><option>Lead intake form</option><option>Manual entry</option><option>Email forward</option></select><div className="wf-det-flb">Assign to</div><select className="wf-det-sel"><option>Me (Alex Mercer)</option><option>Team queue</option></select></>}
                      {node.type === "action" && <><div className="wf-det-flb">{node.icon === "✉" ? "Email template" : node.icon === "$" ? "Invoice type" : "Template"}</div><select className="wf-det-sel"><option>{node.sub}</option><option>Custom...</option></select><div className="wf-det-flb">Run after</div><select className="wf-det-sel"><option>Immediately</option><option>1 hour</option><option>Next morning</option></select></>}
                      {node.type === "delay" && <><div className="wf-det-flb">Wait for</div><input className="wf-det-in" defaultValue="2 days" /><div className="wf-det-flb">Skip if</div><select className="wf-det-sel"><option>Client responds</option><option>Never skip</option></select></>}
                      {node.type === "condition" && <><div className="wf-det-flb">Check</div><select className="wf-det-sel"><option>Email reply received</option><option>Form submitted</option><option>Portal login detected</option></select><div className="wf-det-flb">Yes → goes to</div><input className="wf-det-in" defaultValue="Create Project" readOnly style={{ color: "var(--sg)" }} /><div className="wf-det-flb">No → goes to</div><input className="wf-det-in" defaultValue="Send Follow-up" readOnly style={{ color: "var(--rs)" }} /></>}
                    </div>
                    <div className="wf-det-sec">
                      <div className="wf-det-lb">Connections</div>
                      {CONNS.filter(c => c.from === node.id).map((c, i) => { const tgt = NODES.find(n => n.id === c.to); return <div key={`o${i}`} className="wf-det-conn"><span className="wf-det-conn-dir" style={{ color: "var(--sg)" }}>→</span>{tgt?.label}{c.label ? ` · ${c.label}` : ""}</div>; })}
                      {CONNS.filter(c => c.to === node.id).map((c, i) => { const src = NODES.find(n => n.id === c.from); return <div key={`i${i}`} className="wf-det-conn"><span className="wf-det-conn-dir" style={{ color: "var(--lv)" }}>←</span>{src?.label}{c.label ? ` · ${c.label}` : ""}</div>; })}
                    </div>
                    <div className="wf-det-sec" style={{ borderBottom: "none" }}>
                      <div className="wf-det-lb">Danger zone</div>
                      <button style={{ padding: "7px 14px", borderRadius: 7, border: "1px solid rgba(180,110,94,.12)", background: "var(--rsbg)", fontSize: 11, fontFamily: "inherit", color: "var(--rs)", cursor: "pointer", fontWeight: 500 }}>Remove Step</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ SERVICES ═══ */}
          {sec === "services" && (
            <div className="sv">
              <div className="sv-hd">
                <div><div className="sv-t">Service Catalog</div><div className="sv-sub">What you sell. Feeds proposals, project templates, and invoicing.</div></div>
                <button className="wb-btn p">+ New Service</button>
              </div>
              <div className="sv-grid">
                {SERVICES.map((s, i) => (
                  <div key={s.id} className={`sv-c${selSvc === s.id ? " sel" : ""} stagger`}
                    style={{ animationDelay: `${i * 80}ms` }}
                    onClick={() => setSelSvc(selSvc === s.id ? null : s.id)}>
                    <div className="sv-c-line" style={{ background: s.color }} />
                    {s.popular && <div className="sv-c-pop">MOST SOLD</div>}
                    <div className="sv-c-body">
                      <div className="sv-c-price" style={{ color: s.color }}>{s.price}<span className="sv-c-per">{s.per !== "fixed" ? s.per : ""}</span></div>
                      <div className="sv-c-name">{s.name}</div>
                      <div className="sv-c-meta">
                        <span className="sv-c-meta-item">◎ {s.timeline}</span>
                        {s.deposit !== "—" && <span className="sv-c-meta-item">$ {s.deposit} deposit</span>}
                      </div>
                      <div className="sv-c-items">
                        <div className="sv-c-items-t">Deliverables</div>
                        {s.items.map((item, j) => (
                          <div key={j} className="sv-c-item"><div className="sv-c-item-dot" style={{ background: s.color }} />{item}</div>
                        ))}
                      </div>
                    </div>
                    <div className="sv-c-ft">
                      <span className="sv-c-tmpl"><span style={{ color: s.color }}>◎</span> Links to: {s.template}</span>
                      <span className="sv-c-edit">Edit →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ PIPELINE ═══ */}
          {sec === "pipeline" && (
            <div className="pl">
              <div className="pl-hd"><div className="pl-t">Pipeline Designer</div><div className="pl-sub">Shape how clients move through your business. Automations fire on each transition.</div></div>

              <div className="pl-funnel">
                {STAGES.map((s, i) => (
                  <div key={s.id} className={`pl-fn${hovStage === s.id ? " hov" : ""}`}
                    onMouseEnter={() => setHovStage(s.id)} onMouseLeave={() => setHovStage(null)}>
                    <div className="pl-fn-bar" style={{ background: s.color }} />
                    <div className="pl-fn-name">{s.name}</div>
                    <div className="pl-fn-count" style={{ color: s.count > 0 ? s.color : "var(--i2)" }}>{s.count}</div>
                    <div className="pl-fn-time">{s.time}</div>
                    {i < STAGES.length - 1 && <span className="pl-fn-arr">›</span>}
                  </div>
                ))}
              </div>

              <div className="pl-list">
                {STAGES.map((s, i) => (
                  <div key={s.id} className={`pl-li stagger${hovStage === s.id ? " hov" : ""}`}
                    style={{ animationDelay: `${i * 50}ms` }}
                    onMouseEnter={() => setHovStage(s.id)} onMouseLeave={() => setHovStage(null)}>
                    <span className="pl-li-handle">⋮⋮</span>
                    <div className="pl-li-dot" style={{ background: s.color }} />
                    <div className="pl-li-info">
                      <div className="pl-li-name">{s.name}</div>
                      <div className="pl-li-auto">{s.auto !== "—" ? <><span className="pl-li-auto-ic">⚡</span>{s.auto}</> : <span style={{ color: "var(--i3)" }}>No automation configured</span>}</div>
                    </div>
                    <div className="pl-li-right">
                      <div className="pl-li-time">{s.time}</div>
                      <div className="pl-li-count" style={{ color: s.count > 0 ? s.color : "var(--i2)" }}>{s.count} active</div>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                  <button style={{ padding: "10px 24px", borderRadius: 10, border: "1.5px dashed var(--bd)", background: "transparent", fontSize: 13, fontFamily: "inherit", color: "var(--i4)", cursor: "pointer", transition: "all .1s", fontWeight: 500 }}
                    onMouseEnter={e => { e.target.style.borderColor = "var(--em)"; e.target.style.color = "var(--em)"; }}
                    onMouseLeave={e => { e.target.style.borderColor = "var(--bd)"; e.target.style.color = "var(--i4)"; }}>
                    + Add Stage
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Coming soon */}
          {!["workflows", "services", "pipeline"].includes(sec) && (
            <div className="wb-soon">
              <div className="wb-soon-ic">{SECS.find(s => s.id === sec)?.icon}</div>
              <div className="wb-soon-t">{SECS.find(s => s.id === sec)?.label}</div>
              <div className="wb-soon-s">This builder is under construction. Build your {SECS.find(s => s.id === sec)?.label.toLowerCase()} here soon.</div>
            </div>
          )}
        </div>

        <div className="wb-ft"><span>◆ Felmark Workbench</span><span>Build once, run forever. · @felmark/forge</span></div>
      </div>
    </>
  );
}
