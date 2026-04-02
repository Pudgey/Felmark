import { useState } from "react";

/* ═══════════════════════════════════════════
   FELMARK — WORKSPACE SIDEBAR
   10x client navigation. Standalone.
   ═══════════════════════════════════════════ */

const CLIENTS = [
  {
    id: "meridian", name: "Meridian Studio", av: "M", color: "#6a7b8a", status: "active",
    contact: "Sarah Chen", role: "Creative Director",
    earned: 12400, owed: 2400, health: 92, unread: 2,
    sparkline: [3200, 1800, 2400, 1200, 3800],
    projects: [
      { id: "p1", name: "Brand Guidelines v2", status: "active", pct: 65 },
      { id: "p2", name: "Social Templates", status: "complete", pct: 100 },
    ],
    lastActive: "2 min ago", tags: ["design", "branding"],
  },
  {
    id: "nora", name: "Nora Kim", av: "N", color: "#9a8472", status: "active",
    contact: "Nora Kim", role: "Life Coach",
    earned: 8200, owed: 3200, health: 88, unread: 0,
    sparkline: [2200, 0, 3200, 0, 2800],
    projects: [
      { id: "p3", name: "Course Landing Page", status: "active", pct: 25 },
      { id: "p4", name: "Email Sequence", status: "pending", pct: 0 },
    ],
    lastActive: "1 hour ago", tags: ["web", "copy"],
  },
  {
    id: "bolt", name: "Bolt Fitness", av: "B", color: "#8a7e5a", status: "overdue",
    contact: "Jake Torres", role: "Founder",
    earned: 6000, owed: 4000, health: 45, unread: 1,
    sparkline: [4000, 2000, 0, 0, 0],
    projects: [
      { id: "p5", name: "App Onboarding UX", status: "overdue", pct: 70 },
      { id: "p6", name: "Blog Content", status: "active", pct: 40 },
    ],
    lastActive: "3 days ago", tags: ["app", "content"],
  },
  {
    id: "luna", name: "Luna Boutique", av: "L", color: "#7a6a90", status: "lead",
    contact: "Maria Santos", role: "Owner",
    earned: 0, owed: 0, health: 0, unread: 1,
    sparkline: [0, 0, 0, 0, 0],
    projects: [],
    lastActive: "2 hours ago", tags: ["new"],
  },
];

const sc = (s) => s === "active" ? "#5e8f5e" : s === "overdue" ? "#b46e5e" : s === "lead" ? "#7d7db0" : s === "complete" ? "#5e8f5e" : "#9b988f";
const sl = (s) => s === "active" ? "Active" : s === "overdue" ? "Overdue" : s === "lead" ? "New Lead" : s === "complete" ? "Complete" : s === "pending" ? "Pending" : s;

function MiniSparkline({ data, color, width = 52, height = 18 }) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / max) * (height - 2) - 1}`).join(" ");
  const area = `0,${height} ${pts} ${width},${height}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <polygon points={area} fill={color} opacity="0.06" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    </svg>
  );
}

function HealthRing({ value, color, size = 28 }) {
  if (!value) return <div style={{ width: size, height: size, borderRadius: "50%", border: "2px solid var(--bd)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 7, color: "var(--i3)" }}>—</div>;
  const r = (size / 2) - 3, circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bd)" strokeWidth="2.5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="2.5"
        strokeDasharray={circ} strokeDashoffset={circ - (value / 100) * circ} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset .6s cubic-bezier(.16,1,.3,1)" }} />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: 8, fontWeight: 600, fill: color, fontFamily: "var(--mono)" }}>{value}</text>
    </svg>
  );
}

export default function Sidebar() {
  const [active, setActive] = useState("meridian");
  const [expanded, setExpanded] = useState(new Set(["meridian"]));
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState(null);

  const toggleExpand = (id) => setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const filtered = search ? CLIENTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.contact.toLowerCase().includes(search.toLowerCase())) : CLIENTS;
  const totalEarned = CLIENTS.reduce((s, c) => s + c.earned, 0);
  const totalOwed = CLIENTS.reduce((s, c) => s + c.owed, 0);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{
--bg:#edeae5;--card:#fff;--tint:#f8f7f4;--bd:#ddd9d2;--bdl:#ebe8e2;
--i9:#252320;--i8:#363330;--i7:#4a4743;--i6:#5e5b56;--i5:#7a7772;--i4:#9b988f;--i3:#b5b2a9;--i2:#d0cdc6;
--em:#a87444;--emb:#c8915c;--embg:rgba(168,116,68,.04);
--sg:#5e8f5e;--sgbg:rgba(94,143,94,.04);
--lv:#7d7db0;--lvbg:rgba(125,125,176,.03);
--rs:#b46e5e;--rsbg:rgba(180,110,94,.04);
--mono:'JetBrains Mono',monospace
}

.sb-wrap{font-family:'DM Sans',sans-serif;background:var(--bg);height:100vh;display:flex;align-items:stretch}

/* ═══ SIDEBAR ═══ */
.sb{width:280px;background:var(--card);border-right:1px solid var(--bd);display:flex;flex-direction:column;overflow:hidden}

/* Header */
.sb-hd{padding:18px 18px 0;flex-shrink:0}
.sb-hd-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.sb-hd-logo{display:flex;align-items:center;gap:8px}
.sb-hd-mark{width:28px;height:28px;border-radius:8px;background:var(--i9);display:flex;align-items:center;justify-content:center;color:var(--em);font-size:12px}
.sb-hd-name{font-family:'Fraunces',serif;font-size:18px;font-weight:600;color:var(--i9)}
.sb-hd-add{width:28px;height:28px;border-radius:8px;border:1px solid var(--bd);background:var(--card);color:var(--i3);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all .1s}
.sb-hd-add:hover{border-color:var(--em);color:var(--em);background:var(--embg)}

/* Search */
.sb-search{display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--tint);border:1px solid var(--bdl);border-radius:10px;margin-bottom:14px;transition:border-color .1s}
.sb-search:focus-within{border-color:var(--lv);background:var(--card)}
.sb-search-icon{color:var(--i3);font-size:12px;flex-shrink:0}
.sb-search input{flex:1;border:none;outline:none;background:transparent;font-size:13px;font-family:inherit;color:var(--i7)}
.sb-search input::placeholder{color:var(--i3)}
.sb-search-count{font-family:var(--mono);font-size:9px;color:var(--i3);flex-shrink:0}

/* Summary strip */
.sb-summary{display:flex;gap:0;margin-bottom:14px;border-radius:10px;overflow:hidden;border:1px solid var(--bdl)}
.sb-summary-item{flex:1;padding:8px 10px;background:var(--tint);text-align:center;border-right:1px solid var(--bdl)}
.sb-summary-item:last-child{border-right:none}
.sb-summary-val{font-family:'Fraunces',serif;font-size:15px;font-weight:600;line-height:1}
.sb-summary-lb{font-family:var(--mono);font-size:7px;color:var(--i3);text-transform:uppercase;letter-spacing:.06em;margin-top:2px}

/* Client list */
.sb-list{flex:1;overflow-y:auto;padding:0 10px 10px}
.sb-list::-webkit-scrollbar{width:4px}
.sb-list::-webkit-scrollbar-thumb{background:var(--bd);border-radius:2px}

/* Client card */
.sb-cl{border-radius:14px;margin-bottom:4px;overflow:hidden;transition:all .15s cubic-bezier(.16,1,.3,1);cursor:pointer;border:1px solid transparent}
.sb-cl:hover{background:var(--tint);border-color:var(--bdl)}
.sb-cl.on{background:var(--lvbg);border-color:rgba(125,125,176,.06)}

/* Main row */
.sb-cl-main{display:flex;align-items:center;gap:10px;padding:10px 12px}

/* Avatar */
.sb-cl-av-wrap{position:relative;flex-shrink:0}
.sb-cl-av{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;color:var(--card);transition:transform .12s}
.sb-cl:hover .sb-cl-av{transform:scale(1.04)}
.sb-cl-status-ring{position:absolute;bottom:-1px;right:-1px;width:12px;height:12px;border-radius:50%;border:2.5px solid var(--card);display:flex;align-items:center;justify-content:center}
.sb-cl.on .sb-cl-status-ring{border-color:rgba(248,247,244,1)}
.sb-cl-unread{position:absolute;top:-3px;right:-3px;min-width:16px;height:16px;border-radius:8px;background:var(--rs);color:#fff;font-size:8px;font-weight:600;display:flex;align-items:center;justify-content:center;border:2.5px solid var(--card);padding:0 3px}
.sb-cl.on .sb-cl-unread{border-color:rgba(248,247,244,1)}

/* Info */
.sb-cl-info{flex:1;min-width:0}
.sb-cl-name{font-size:14px;font-weight:500;color:var(--i7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .08s}
.sb-cl.on .sb-cl-name{color:var(--i9);font-weight:600}
.sb-cl-contact{font-size:11px;color:var(--i4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px;display:flex;align-items:center;gap:4px}
.sb-cl-status-label{font-family:var(--mono);font-size:8px;font-weight:500;padding:1px 6px;border-radius:4px;border:1px solid}

/* Right column */
.sb-cl-right{flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:4px}
.sb-cl-earned{font-family:var(--mono);font-size:11px;font-weight:500;color:var(--i5)}
.sb-cl-time{font-family:var(--mono);font-size:9px;color:var(--i3)}

/* Expanded area */
.sb-cl-expand{overflow:hidden;transition:max-height .25s cubic-bezier(.16,1,.3,1),opacity .2s;max-height:0;opacity:0}
.sb-cl-expand.open{max-height:400px;opacity:1}
.sb-cl-detail{padding:0 12px 12px}

/* Stats row */
.sb-cl-stats{display:flex;gap:6px;margin-bottom:10px}
.sb-cl-stat{flex:1;padding:6px 8px;background:var(--tint);border-radius:8px;border:1px solid var(--bdl)}
.sb-cl-stat-val{font-family:var(--mono);font-size:12px;font-weight:500;line-height:1}
.sb-cl-stat-lb{font-family:var(--mono);font-size:7px;color:var(--i3);text-transform:uppercase;margin-top:2px}

/* Sparkline row */
.sb-cl-spark{display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:var(--tint);border-radius:8px;border:1px solid var(--bdl);margin-bottom:10px}
.sb-cl-spark-lb{font-family:var(--mono);font-size:8px;color:var(--i3)}

/* Projects */
.sb-cl-projects{margin-bottom:6px}
.sb-cl-proj-t{font-family:var(--mono);font-size:8px;color:var(--i3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
.sb-cl-proj{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;cursor:pointer;transition:all .08s;margin-bottom:2px}
.sb-cl-proj:hover{background:var(--tint)}
.sb-cl-proj-dot{width:6px;height:6px;border-radius:2px;flex-shrink:0}
.sb-cl-proj-info{flex:1;min-width:0}
.sb-cl-proj-name{font-size:12px;color:var(--i6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-cl-proj-pct{font-family:var(--mono);font-size:9px;flex-shrink:0}
.sb-cl-proj-bar{width:36px;height:3px;background:var(--bdl);border-radius:2px;overflow:hidden;flex-shrink:0}
.sb-cl-proj-fill{height:100%;border-radius:2px;transition:width .4s ease}

/* Tags */
.sb-cl-tags{display:flex;gap:3px;flex-wrap:wrap}
.sb-cl-tag{font-family:var(--mono);font-size:8px;color:var(--i4);background:var(--tint);padding:2px 7px;border-radius:4px;border:1px solid var(--bdl)}

/* Quick actions */
.sb-cl-actions{display:flex;gap:4px;margin-top:8px}
.sb-cl-action{flex:1;padding:6px;border-radius:7px;border:1px solid var(--bd);background:var(--card);font-size:10px;font-family:inherit;color:var(--i5);cursor:pointer;text-align:center;transition:all .08s;font-weight:500}
.sb-cl-action:hover{background:var(--tint);border-color:var(--i2)}
.sb-cl-action.primary{background:var(--i9);color:var(--card);border-color:var(--i9)}
.sb-cl-action.primary:hover{background:var(--i8)}

/* Footer */
.sb-ft{padding:12px 18px;border-top:1px solid var(--bdl);flex-shrink:0}
.sb-ft-stats{display:flex;justify-content:space-between;font-family:var(--mono);font-size:9px;color:var(--i3);margin-bottom:6px}
.sb-ft-bar{height:3px;background:var(--bdl);border-radius:2px;overflow:hidden;display:flex;gap:1px}
.sb-ft-seg{height:100%;border-radius:2px;transition:width .4s ease}
.sb-ft-label{font-family:var(--mono);font-size:8px;color:var(--i3);margin-top:6px;text-align:center}

/* The rest of the page (placeholder) */
.sb-page{flex:1;background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--i3);font-size:14px}
      `}</style>

      <div className="sb-wrap">
        <div className="sb">
          {/* Header */}
          <div className="sb-hd">
            <div className="sb-hd-top">
              <div className="sb-hd-logo">
                <div className="sb-hd-mark">◆</div>
                <span className="sb-hd-name">Clients</span>
              </div>
              <button className="sb-hd-add">+</button>
            </div>

            {/* Search */}
            <div className="sb-search">
              <span className="sb-search-icon">⌕</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." />
              <span className="sb-search-count">{filtered.length}</span>
            </div>

            {/* Summary */}
            <div className="sb-summary">
              <div className="sb-summary-item">
                <div className="sb-summary-val" style={{ color: "var(--sg)" }}>${(totalEarned / 1000).toFixed(1)}k</div>
                <div className="sb-summary-lb">Earned</div>
              </div>
              <div className="sb-summary-item">
                <div className="sb-summary-val" style={{ color: totalOwed > 0 ? "var(--rs)" : "var(--i3)" }}>${(totalOwed / 1000).toFixed(1)}k</div>
                <div className="sb-summary-lb">Owed</div>
              </div>
              <div className="sb-summary-item">
                <div className="sb-summary-val" style={{ color: "var(--i8)" }}>{CLIENTS.length}</div>
                <div className="sb-summary-lb">Clients</div>
              </div>
            </div>
          </div>

          {/* Client list */}
          <div className="sb-list">
            {filtered.map(cl => {
              const isActive = active === cl.id;
              const isExpanded = expanded.has(cl.id);
              const isHovered = hovered === cl.id;
              const statusColor = sc(cl.status);
              const healthColor = cl.health >= 75 ? "var(--sg)" : cl.health >= 50 ? "var(--em)" : cl.health > 0 ? "var(--rs)" : "var(--i3)";

              return (
                <div key={cl.id} className={`sb-cl${isActive ? " on" : ""}`}
                  onMouseEnter={() => setHovered(cl.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => { setActive(cl.id); toggleExpand(cl.id); }}>

                  {/* Main row */}
                  <div className="sb-cl-main">
                    <div className="sb-cl-av-wrap">
                      <div className="sb-cl-av" style={{ background: cl.color }}>{cl.av}</div>
                      <div className="sb-cl-status-ring" style={{ background: statusColor }} />
                      {cl.unread > 0 && <div className="sb-cl-unread">{cl.unread}</div>}
                    </div>

                    <div className="sb-cl-info">
                      <div className="sb-cl-name">{cl.name}</div>
                      <div className="sb-cl-contact">
                        <span>{cl.contact}</span>
                        <span className="sb-cl-status-label" style={{
                          color: statusColor,
                          borderColor: statusColor + "18",
                          background: statusColor + "06",
                        }}>{sl(cl.status)}</span>
                      </div>
                    </div>

                    <div className="sb-cl-right">
                      <HealthRing value={cl.health} color={healthColor} size={28} />
                    </div>
                  </div>

                  {/* Expanded detail */}
                  <div className={`sb-cl-expand${isExpanded ? " open" : ""}`}>
                    <div className="sb-cl-detail">

                      {/* Revenue stats */}
                      <div className="sb-cl-stats">
                        <div className="sb-cl-stat">
                          <div className="sb-cl-stat-val" style={{ color: "var(--sg)" }}>${(cl.earned / 1000).toFixed(1)}k</div>
                          <div className="sb-cl-stat-lb">Earned</div>
                        </div>
                        <div className="sb-cl-stat">
                          <div className="sb-cl-stat-val" style={{ color: cl.owed > 0 ? "var(--rs)" : "var(--i3)" }}>${(cl.owed / 1000).toFixed(1)}k</div>
                          <div className="sb-cl-stat-lb">Owed</div>
                        </div>
                        <div className="sb-cl-stat">
                          <div className="sb-cl-stat-val" style={{ color: "var(--i7)" }}>{cl.projects.length}</div>
                          <div className="sb-cl-stat-lb">Projects</div>
                        </div>
                      </div>

                      {/* Sparkline */}
                      {cl.earned > 0 && (
                        <div className="sb-cl-spark">
                          <span className="sb-cl-spark-lb">5-month revenue</span>
                          <MiniSparkline data={cl.sparkline} color={cl.color} />
                        </div>
                      )}

                      {/* Projects */}
                      {cl.projects.length > 0 && (
                        <div className="sb-cl-projects">
                          <div className="sb-cl-proj-t">Projects</div>
                          {cl.projects.map(proj => (
                            <div key={proj.id} className="sb-cl-proj" onClick={e => e.stopPropagation()}>
                              <div className="sb-cl-proj-dot" style={{ background: sc(proj.status) }} />
                              <div className="sb-cl-proj-info">
                                <div className="sb-cl-proj-name">{proj.name}</div>
                              </div>
                              <div className="sb-cl-proj-bar">
                                <div className="sb-cl-proj-fill" style={{ width: `${proj.pct}%`, background: sc(proj.status) }} />
                              </div>
                              <span className="sb-cl-proj-pct" style={{ color: proj.pct === 100 ? "var(--sg)" : sc(proj.status) }}>{proj.pct}%</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="sb-cl-tags">
                        {cl.tags.map(tag => <span key={tag} className="sb-cl-tag">{tag}</span>)}
                        <span className="sb-cl-tag" style={{ color: "var(--i3)", borderStyle: "dashed" }}>{cl.lastActive}</span>
                      </div>

                      {/* Quick actions */}
                      <div className="sb-cl-actions">
                        <button className="sb-cl-action">✉ Message</button>
                        <button className="sb-cl-action">$ Invoice</button>
                        <button className="sb-cl-action primary">Open →</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add client */}
            <div style={{
              margin: "8px 0", padding: "14px", borderRadius: 14,
              border: "1.5px dashed var(--bd)", textAlign: "center",
              cursor: "pointer", transition: "all .1s", fontSize: 13, color: "var(--i3)",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--em)"; e.currentTarget.style.color = "var(--em)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bd)"; e.currentTarget.style.color = "var(--i3)"; }}>
              + Add Client
            </div>
          </div>

          {/* Footer */}
          <div className="sb-ft">
            <div className="sb-ft-stats">
              <span>{CLIENTS.filter(c => c.status === "active").length} active</span>
              <span>{CLIENTS.filter(c => c.status === "lead").length} leads</span>
              <span>{CLIENTS.filter(c => c.status === "overdue").length} overdue</span>
            </div>
            <div className="sb-ft-bar">
              {CLIENTS.map(cl => (
                <div key={cl.id} className="sb-ft-seg" style={{
                  width: `${Math.max(cl.earned / totalEarned * 100, 8)}%`,
                  background: cl.color,
                  opacity: 0.4,
                }} />
              ))}
            </div>
            <div className="sb-ft-label">revenue distribution</div>
          </div>
        </div>

        {/* Page placeholder */}
        <div className="sb-page">
          <div style={{ textAlign: "center", opacity: 0.5 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, marginBottom: 4 }}>← Sidebar Component</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11 }}>The dashboard canvas goes here</div>
          </div>
        </div>
      </div>
    </>
  );
}
