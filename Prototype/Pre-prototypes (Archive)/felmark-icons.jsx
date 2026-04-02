import { useState } from "react";

/* ═══════════════════════════════════════════
   FELMARK — Product Icons
   Workstation: power editor + terminal
   Workspace: project manager + tasks
   2 versions each. 24px grid. 1.5px stroke.
   ═══════════════════════════════════════════ */

// ── WORKSTATION A: Terminal window with cursor blink ──
function WorkstationA({ size = 24, color = "currentColor", strokeWidth = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {/* Window frame */}
      <rect x="2" y="3" width="20" height="18" rx="2" />
      {/* Title bar */}
      <line x1="2" y1="7" x2="22" y2="7" />
      {/* Window dots */}
      <circle cx="5" cy="5" r="0.75" fill={color} stroke="none" />
      <circle cx="7.5" cy="5" r="0.75" fill={color} stroke="none" />
      <circle cx="10" cy="5" r="0.75" fill={color} stroke="none" />
      {/* Terminal prompt */}
      <polyline points="6,11 8.5,13 6,15" />
      {/* Cursor line */}
      <line x1="10" y1="15" x2="18" y2="15" />
      {/* Code line */}
      <line x1="10" y1="11" x2="16" y2="11" />
    </svg>
  );
}

// ── WORKSTATION B: Split editor with blocks ──
function WorkstationB({ size = 24, color = "currentColor", strokeWidth = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {/* Outer frame */}
      <rect x="2" y="3" width="20" height="18" rx="2" />
      {/* Vertical split */}
      <line x1="9" y1="3" x2="9" y2="21" />
      {/* Left sidebar - block icons */}
      <rect x="4" y="6" width="3" height="2" rx="0.5" />
      <rect x="4" y="10" width="3" height="2" rx="0.5" />
      <rect x="4" y="14" width="3" height="2" rx="0.5" />
      {/* Right side - editor content */}
      <line x1="12" y1="7" x2="19" y2="7" />
      <line x1="12" y1="10" x2="17" y2="10" />
      <line x1="12" y1="13" x2="20" y2="13" />
      <line x1="12" y1="16" x2="15" y2="16" />
      {/* Cursor */}
      <line x1="15" y1="15" x2="15" y2="17" strokeWidth={strokeWidth * 1.2} />
    </svg>
  );
}

// ── WORKSPACE A: Kanban board with cards ──
function WorkspaceA({ size = 24, color = "currentColor", strokeWidth = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {/* Three columns */}
      {/* Column 1 */}
      <rect x="2" y="3" width="6" height="18" rx="1.5" />
      <line x1="3.5" y1="6" x2="6.5" y2="6" strokeWidth={strokeWidth * 0.8} />
      <rect x="3.5" y="8" width="3" height="3" rx="0.75" strokeWidth={strokeWidth * 0.8} />
      <rect x="3.5" y="12.5" width="3" height="3" rx="0.75" strokeWidth={strokeWidth * 0.8} />
      {/* Column 2 */}
      <rect x="9" y="3" width="6" height="18" rx="1.5" />
      <line x1="10.5" y1="6" x2="13.5" y2="6" strokeWidth={strokeWidth * 0.8} />
      <rect x="10.5" y="8" width="3" height="3" rx="0.75" strokeWidth={strokeWidth * 0.8} />
      <rect x="10.5" y="12.5" width="3" height="2" rx="0.75" strokeWidth={strokeWidth * 0.8} />
      {/* Column 3 */}
      <rect x="16" y="3" width="6" height="18" rx="1.5" />
      <line x1="17.5" y1="6" x2="20.5" y2="6" strokeWidth={strokeWidth * 0.8} />
      <rect x="17.5" y="8" width="3" height="2" rx="0.75" strokeWidth={strokeWidth * 0.8} />
    </svg>
  );
}

// ── WORKSPACE B: Checklist with progress ──
function WorkspaceB({ size = 24, color = "currentColor", strokeWidth = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {/* Frame */}
      <rect x="3" y="2" width="18" height="20" rx="2" />
      {/* Header bar */}
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="7" y1="4" x2="14" y2="4" strokeWidth={strokeWidth * 0.8} />
      {/* Check row 1 — done */}
      <rect x="6" y="9.5" width="2.5" height="2.5" rx="0.5" />
      <polyline points="6.5,10.75 7,11.5 8,10" strokeWidth={strokeWidth * 0.9} />
      <line x1="10.5" y1="10.75" x2="18" y2="10.75" />
      {/* Check row 2 — done */}
      <rect x="6" y="13.5" width="2.5" height="2.5" rx="0.5" />
      <polyline points="6.5,14.75 7,15.5 8,14" strokeWidth={strokeWidth * 0.9} />
      <line x1="10.5" y1="14.75" x2="16" y2="14.75" />
      {/* Check row 3 — empty */}
      <rect x="6" y="17.5" width="2.5" height="2.5" rx="0.5" />
      <line x1="10.5" y1="18.75" x2="17" y2="18.75" />
    </svg>
  );
}

// ── Showcase ──
export default function Icons() {
  const [hovered, setHovered] = useState(null);

  const icons = [
    { id: "ws-a", label: "Workstation A", sub: "Terminal + prompt", Component: WorkstationA },
    { id: "ws-b", label: "Workstation B", sub: "Split editor + blocks", Component: WorkstationB },
    { id: "wp-a", label: "Workspace A", sub: "Kanban board", Component: WorkspaceA },
    { id: "wp-b", label: "Workspace B", sub: "Task checklist", Component: WorkspaceB },
  ];

  const sizes = [16, 20, 24, 32, 48];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--ink-900:#2c2a25;--ink-700:#4f4c44;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--mono:'JetBrains Mono',monospace}
      `}</style>

      <div style={{ fontFamily: "'Outfit', sans-serif", background: "var(--parchment)", minHeight: "100vh", padding: "40px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ember)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Icon System</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "var(--ink-900)", marginBottom: 4 }}>Workstation & Workspace</div>
            <div style={{ fontSize: 14, color: "var(--ink-400)" }}>Two versions each. 24px grid. 1.5px stroke. Pixel-aligned.</div>
          </div>

          {/* Icon grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 32 }}>
            {icons.map(icon => (
              <div key={icon.id}
                onMouseEnter={() => setHovered(icon.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: "#fff", border: `1px solid ${hovered === icon.id ? "var(--ember)" : "var(--warm-200)"}`,
                  borderRadius: 12, padding: 20, textAlign: "center", cursor: "default",
                  transition: "all .12s",
                  boxShadow: hovered === icon.id ? "0 0 0 3px rgba(176,125,79,0.06)" : "none",
                  transform: hovered === icon.id ? "translateY(-2px)" : "none",
                }}>
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
                    background: hovered === icon.id ? "var(--ink-900)" : "var(--warm-50)",
                    border: `1px solid ${hovered === icon.id ? "var(--ink-900)" : "var(--warm-200)"}`,
                    transition: "all .15s",
                  }}>
                    <icon.Component size={32} color={hovered === icon.id ? "#fff" : "var(--ink-700)"} />
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-800)", marginBottom: 2 }}>{icon.label}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-300)" }}>{icon.sub}</div>
              </div>
            ))}
          </div>

          {/* Size scale */}
          <div style={{ background: "#fff", border: "1px solid var(--warm-200)", borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-300)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 14 }}>Scale · All sizes</div>
            {icons.map(icon => (
              <div key={icon.id} style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 0", borderBottom: "1px solid var(--warm-100)" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-500)", width: 120 }}>{icon.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {sizes.map(s => (
                    <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <icon.Component size={s} color="var(--ink-700)" />
                      <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-300)" }}>{s}px</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Dark mode */}
          <div style={{ background: "var(--ink-900)", border: "1px solid #3d3a33", borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#65625a", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 14 }}>Dark context</div>
            <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
              {icons.map(icon => (
                <div key={icon.id} style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: 6 }}><icon.Component size={32} color="#b5b2a9" /></div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#65625a" }}>{icon.label.split(" ")[0]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ember accent */}
          <div style={{ background: "#fff", border: "1px solid var(--warm-200)", borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-300)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 14 }}>Accent color</div>
            <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
              {icons.map(icon => (
                <div key={icon.id} style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: 6 }}><icon.Component size={32} color="var(--ember)" /></div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-300)" }}>{icon.label.split(" ")[0]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* In-context usage */}
          <div style={{ background: "#fff", border: "1px solid var(--warm-200)", borderRadius: 10, padding: 20 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-300)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 14 }}>In context · Navigation</div>

            {/* Simulated nav */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 220 }}>
              {[
                { Icon: WorkspaceA, label: "Workspace", active: true, badge: "3" },
                { Icon: WorkstationA, label: "Workstation", active: false },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 6,
                  background: item.active ? "rgba(176,125,79,0.08)" : "transparent",
                  cursor: "pointer",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                    background: item.active ? "rgba(176,125,79,0.08)" : "var(--warm-50)",
                    border: `1px solid ${item.active ? "rgba(176,125,79,0.1)" : "var(--warm-200)"}`,
                  }}>
                    <item.Icon size={16} color={item.active ? "var(--ember)" : "var(--ink-400)"} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: item.active ? 500 : 400, color: item.active ? "var(--ink-900)" : "var(--ink-500)", flex: 1 }}>{item.label}</span>
                  {item.badge && <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "#fff", background: "#c24b38", width: 16, height: 16, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.badge}</span>}
                </div>
              ))}
            </div>

            {/* Simulated top bar */}
            <div style={{ marginTop: 16, padding: "8px 12px", background: "var(--warm-50)", borderRadius: 6, border: "1px solid var(--warm-200)", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 5, background: "var(--ink-900)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ember)", fontSize: 9 }}>◆</div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>Felmark</span>
              <div style={{ width: 1, height: 14, background: "var(--warm-200)", margin: "0 2px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", background: "#fff", borderRadius: 4, border: "1px solid var(--warm-200)" }}>
                <WorkspaceA size={12} color="var(--ember)" />
                <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-500)" }}>Workspace</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 4 }}>
                <WorkstationA size={12} color="var(--ink-300)" />
                <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-300)" }}>Workstation</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
