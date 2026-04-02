import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   FELMARK DRAWING COMPONENTS
   Visual primitives for the canvas.
   Sketchy, warm, professional.
   ═══════════════════════════════════════════ */

// Jitter helper for hand-drawn feel
const j = (v, a = 1.2) => v + (Math.random() - 0.5) * a;
const jPath = (points) => points.map((p, i) => `${i === 0 ? "M" : "L"}${j(p[0])},${j(p[1])}`).join(" ");

// ═══ 1. FLOWCHART KIT ═══
function FlowchartKit() {
  const [hoveredNode, setHoveredNode] = useState(null);

  const nodes = [
    { id: "start", type: "pill", x: 260, y: 20, w: 160, h: 40, label: "Client inquiry", color: "#5b7fa4" },
    { id: "qualify", type: "diamond", x: 270, y: 100, w: 140, h: 70, label: "Good fit?", color: "#7c6b9e" },
    { id: "no", type: "rect", x: 460, y: 110, w: 130, h: 44, label: "Refer out", color: "#c24b38" },
    { id: "discovery", type: "rect", x: 270, y: 210, w: 140, h: 44, label: "Discovery call", color: "#b07d4f" },
    { id: "proposal", type: "rect", x: 270, y: 290, w: 140, h: 44, label: "Send proposal", color: "#b07d4f" },
    { id: "decision", type: "diamond", x: 270, y: 374, w: 140, h: 70, label: "Accepted?", color: "#7c6b9e" },
    { id: "revise", type: "rect", x: 80, y: 384, w: 120, h: 44, label: "Revise scope", color: "#c89360" },
    { id: "contract", type: "rect", x: 270, y: 484, w: 140, h: 44, label: "Sign contract", color: "#5a9a3c" },
    { id: "deposit", type: "rect", x: 270, y: 564, w: 140, h: 44, label: "Collect deposit", color: "#5a9a3c" },
    { id: "kickoff", type: "pill", x: 260, y: 644, w: 160, h: 40, label: "Project kickoff", color: "#5a9a3c" },
  ];

  const arrows = [
    { from: "start", to: "qualify", label: "" },
    { from: "qualify", to: "no", label: "No", bend: "right" },
    { from: "qualify", to: "discovery", label: "Yes" },
    { from: "discovery", to: "proposal", label: "" },
    { from: "proposal", to: "decision", label: "" },
    { from: "decision", to: "revise", label: "No", bend: "left" },
    { from: "revise", to: "proposal", label: "", bend: "up" },
    { from: "decision", to: "contract", label: "Yes" },
    { from: "contract", to: "deposit", label: "" },
    { from: "deposit", to: "kickoff", label: "" },
  ];

  const getCenter = (n) => ({ x: n.x + n.w / 2, y: n.y + n.h / 2 });
  const getBottom = (n) => ({ x: n.x + n.w / 2, y: n.y + n.h });
  const getTop = (n) => ({ x: n.x + n.w / 2, y: n.y });
  const getRight = (n) => ({ x: n.x + n.w, y: n.y + n.h / 2 });
  const getLeft = (n) => ({ x: n.x, y: n.y + n.h / 2 });

  return (
    <div className="dc-panel">
      <div className="dc-panel-head">
        <span className="dc-badge">Flowchart</span>
        <span className="dc-panel-title">Client acquisition flow</span>
      </div>
      <svg viewBox="0 0 680 700" className="dc-svg">
        <defs>
          <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M1 1.5L8 5L1 8.5" fill="none" stroke="var(--ink-500)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>

        {/* Arrows */}
        {arrows.map((a, i) => {
          const from = nodes.find(n => n.id === a.from);
          const to = nodes.find(n => n.id === a.to);
          if (!from || !to) return null;

          let x1, y1, x2, y2, path;
          if (a.bend === "right") {
            const p1 = getRight(from);
            const p2 = getLeft(to);
            path = `M${j(p1.x)} ${j(p1.y)} C${p1.x + 30} ${p1.y}, ${p2.x - 30} ${p2.y}, ${j(p2.x)} ${j(p2.y)}`;
          } else if (a.bend === "left") {
            const p1 = getLeft(from);
            const p2 = getLeft(to);
            path = `M${j(p1.x)} ${j(p1.y)} C${p1.x - 40} ${p1.y}, ${p2.x - 40} ${p2.y}, ${j(p2.x)} ${j(p2.y)}`;
          } else if (a.bend === "up") {
            const p1 = getRight(from);
            const p2 = getLeft(to);
            path = `M${j(p1.x)} ${j(p1.y)} L${j(p2.x - 20)} ${j(p1.y)} L${j(p2.x - 20)} ${j(p2.y)} L${j(p2.x)} ${j(p2.y)}`;
          } else {
            const p1 = getBottom(from);
            const p2 = getTop(to);
            const my = (p1.y + p2.y) / 2;
            path = `M${j(p1.x)} ${j(p1.y)} C${p1.x} ${my}, ${p2.x} ${my}, ${j(p2.x)} ${j(p2.y)}`;
          }

          return (
            <g key={i}>
              <path d={path} fill="none" stroke="var(--ink-400)" strokeWidth="1.2" markerEnd="url(#ah)" strokeLinecap="round" />
              {a.label && (() => {
                const p1 = a.bend === "right" ? getRight(from) : a.bend === "left" ? getLeft(from) : getBottom(from);
                const p2 = a.bend === "right" ? getLeft(to) : a.bend === "left" ? getLeft(to) : getTop(to);
                const lx = a.bend === "right" ? (p1.x + p2.x) / 2 : a.bend === "left" ? p1.x - 24 : p1.x + 14;
                const ly = a.bend ? (p1.y + p2.y) / 2 - 2 : (p1.y + p2.y) / 2;
                return <text x={lx} y={ly} className="dc-arrow-label">{a.label}</text>;
              })()}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map(n => {
          const isHovered = hoveredNode === n.id;
          const cx = n.x + n.w / 2, cy = n.y + n.h / 2;

          let shape;
          if (n.type === "pill") {
            shape = <rect x={j(n.x)} y={j(n.y)} width={n.w} height={n.h} rx={n.h / 2} />;
          } else if (n.type === "diamond") {
            const pts = [[cx, j(n.y)], [j(n.x + n.w), cy], [cx, j(n.y + n.h)], [j(n.x), cy]];
            shape = <path d={pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + " Z"} />;
          } else {
            shape = <path d={jPath([[n.x, n.y], [n.x + n.w, n.y], [n.x + n.w, n.y + n.h], [n.x, n.y + n.h]]) + " Z"} />;
          }

          return (
            <g key={n.id} className="dc-node" style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredNode(n.id)} onMouseLeave={() => setHoveredNode(null)}>
              <g style={{ fill: isHovered ? n.color + "12" : n.color + "06", stroke: n.color, strokeWidth: isHovered ? 1.8 : 1, transition: "all 0.1s" }}>
                {shape}
              </g>
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
                style={{ fill: n.color, fontSize: 13, fontWeight: 500, fontFamily: "'Outfit', sans-serif" }}>
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}


// ═══ 2. DEVICE FRAMES ═══
function DeviceFrames() {
  return (
    <div className="dc-panel">
      <div className="dc-panel-head">
        <span className="dc-badge" style={{ color: "#7c8594", background: "rgba(124,133,148,0.06)", borderColor: "rgba(124,133,148,0.1)" }}>Devices</span>
        <span className="dc-panel-title">Responsive preview</span>
      </div>
      <div className="dc-devices">
        {/* Desktop */}
        <div className="dc-device desktop">
          <div className="dc-device-bar">
            <div className="dc-device-dots"><span /><span /><span /></div>
            <div className="dc-device-url">meridianstudio.co</div>
          </div>
          <div className="dc-device-screen">
            <div className="dc-mock-nav"><div className="dc-m-logo" /><div className="dc-m-links"><span /><span /><span /><span className="dc-m-btn" /></div></div>
            <div className="dc-mock-hero">
              <div className="dc-m-badge" />
              <div className="dc-m-h1" />
              <div className="dc-m-p" /><div className="dc-m-p short" />
              <div className="dc-m-cta-row"><div className="dc-m-cta" /><div className="dc-m-cta-ghost" /></div>
            </div>
            <div className="dc-mock-grid"><div /><div /><div /></div>
          </div>
        </div>

        {/* Tablet */}
        <div className="dc-device tablet">
          <div className="dc-device-bar tablet-bar">
            <div className="dc-device-notch" />
          </div>
          <div className="dc-device-screen tablet-screen">
            <div className="dc-mock-nav"><div className="dc-m-logo" /><div className="dc-m-hamburger">☰</div></div>
            <div className="dc-mock-hero">
              <div className="dc-m-h1" style={{ width: "80%" }} />
              <div className="dc-m-p" /><div className="dc-m-p short" />
              <div className="dc-m-cta" />
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="dc-device phone">
          <div className="dc-device-bar phone-bar">
            <div className="dc-device-island" />
          </div>
          <div className="dc-device-screen phone-screen">
            <div className="dc-mock-nav" style={{ padding: "6px 8px" }}><div className="dc-m-logo" style={{ width: 24, height: 5 }} /><div className="dc-m-hamburger" style={{ fontSize: 10 }}>☰</div></div>
            <div className="dc-mock-hero" style={{ padding: "8px" }}>
              <div className="dc-m-h1" style={{ width: "90%", height: 8 }} />
              <div className="dc-m-p" style={{ height: 3 }} />
              <div className="dc-m-cta" style={{ height: 14, width: 60 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══ 3. STICKY NOTE CLUSTER ═══
function StickyCluster() {
  const stickies = [
    { x: 40, y: 20, rot: -3, color: "#f7e9b8", text: "What does \"premium\" mean to our audience?", author: "Alex" },
    { x: 220, y: 10, rot: 2, color: "#e2dff7", text: "Competitor logos all use blue — differentiate with warm tones", author: "Jamie" },
    { x: 400, y: 25, rot: -1, color: "#d4ecd4", text: "CEO wants \"approachable but not casual\"", author: "Sarah" },
    { x: 100, y: 175, rot: 1.5, color: "#fce4d6", text: "Consider serif for headings — test Cormorant vs Playfair", author: "Alex" },
    { x: 300, y: 180, rot: -2.5, color: "#f7e9b8", text: "The old logo has equity — don't throw it away, evolve it", author: "Jamie" },
    { x: 490, y: 170, rot: 1, color: "#dce8f5", text: "Social media: needs to work at 40×40px avatar size", author: "Alex" },
  ];

  return (
    <div className="dc-panel">
      <div className="dc-panel-head">
        <span className="dc-badge" style={{ color: "#c89360", background: "rgba(200,147,96,0.06)", borderColor: "rgba(200,147,96,0.1)" }}>Brainstorm</span>
        <span className="dc-panel-title">Discovery workshop notes</span>
      </div>
      <div className="dc-sticky-canvas">
        {stickies.map((s, i) => (
          <div key={i} className="dc-sticky" style={{ left: s.x, top: s.y, transform: `rotate(${s.rot}deg)`, background: s.color }}>
            <div className="dc-sticky-text">{s.text}</div>
            <div className="dc-sticky-author">— {s.author}</div>
          </div>
        ))}
        {/* Connection lines */}
        <svg className="dc-sticky-lines" viewBox="0 0 680 340">
          <line x1="185" y1="85" x2="260" y2="72" stroke="var(--ink-300)" strokeWidth="0.8" strokeDasharray="4 3" />
          <line x1="360" y1="80" x2="440" y2="88" stroke="var(--ink-300)" strokeWidth="0.8" strokeDasharray="4 3" />
          <line x1="140" y1="155" x2="170" y2="210" stroke="#c24b38" strokeWidth="1" strokeDasharray="3 4" />
        </svg>
      </div>
    </div>
  );
}


// ═══ 4. USER FLOW DIAGRAM ═══
function UserFlowDiagram() {
  return (
    <div className="dc-panel">
      <div className="dc-panel-head">
        <span className="dc-badge" style={{ color: "#5b7fa4", background: "rgba(91,127,164,0.06)", borderColor: "rgba(91,127,164,0.1)" }}>User flow</span>
        <span className="dc-panel-title">Onboarding experience</span>
      </div>
      <svg viewBox="0 0 680 280" className="dc-svg">
        <defs>
          <marker id="ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M1 2L7 5L1 8" fill="none" stroke="var(--ink-400)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>

        {/* Screens as mini wireframes */}
        {[
          { x: 20, y: 60, label: "Landing page", sub: "Hero + CTA", screen: "landing" },
          { x: 155, y: 60, label: "Sign up", sub: "Email + password", screen: "signup" },
          { x: 290, y: 60, label: "Onboarding", sub: "3-step wizard", screen: "onboard" },
          { x: 425, y: 60, label: "First project", sub: "Template picker", screen: "project" },
          { x: 560, y: 60, label: "Editor", sub: "Start working", screen: "editor" },
        ].map((s, i) => (
          <g key={i}>
            {/* Mini screen */}
            <rect x={j(s.x)} y={j(s.y)} width="110" height="74" rx="6" fill="var(--warm-50)" stroke="var(--warm-300)" strokeWidth="0.8" />
            {/* Screen content */}
            <rect x={s.x + 8} y={s.y + 8} width="94" height="4" rx="1" fill="var(--warm-200)" />
            <rect x={s.x + 8} y={s.y + 18} width="60" height="8" rx="2" fill="var(--warm-300)" />
            <rect x={s.x + 8} y={s.y + 32} width="80" height="3" rx="1" fill="var(--warm-200)" />
            <rect x={s.x + 8} y={s.y + 40} width="50" height="3" rx="1" fill="var(--warm-200)" />
            <rect x={s.x + 8} y={s.y + 50} width="40" height="12" rx="3" fill="var(--ink-900)" opacity="0.1" />
            {/* Label */}
            <text x={s.x + 55} y={s.y + 90} textAnchor="middle" style={{ fontSize: 12, fontWeight: 500, fill: "var(--ink-700)", fontFamily: "'Outfit', sans-serif" }}>{s.label}</text>
            <text x={s.x + 55} y={s.y + 104} textAnchor="middle" style={{ fontSize: 10, fill: "var(--ink-300)", fontFamily: "'JetBrains Mono', monospace" }}>{s.sub}</text>
            {/* Connector */}
            {i < 4 && <line x1={s.x + 113} y1={s.y + 37} x2={s.x + 132} y2={s.y + 37} stroke="var(--ink-300)" strokeWidth="1" markerEnd="url(#ah2)" />}
          </g>
        ))}

        {/* Drop-off annotation */}
        <line x1="210" y1="140" x2="210" y2="190" stroke="#c24b38" strokeWidth="0.8" strokeDasharray="3 3" />
        <text x="210" y="205" textAnchor="middle" style={{ fontSize: 10, fill: "#c24b38", fontFamily: "'JetBrains Mono', monospace" }}>32% drop off</text>
        <text x="210" y="218" textAnchor="middle" style={{ fontSize: 9, fill: "var(--ink-300)", fontFamily: "'JetBrains Mono', monospace" }}>password friction</text>

        {/* Success annotation */}
        <line x1="615" y1="140" x2="615" y2="180" stroke="#5a9a3c" strokeWidth="0.8" strokeDasharray="3 3" />
        <text x="615" y="195" textAnchor="middle" style={{ fontSize: 10, fill: "#5a9a3c", fontFamily: "'JetBrains Mono', monospace" }}>68% activate</text>
        <text x="615" y="208" textAnchor="middle" style={{ fontSize: 9, fill: "var(--ink-300)", fontFamily: "'JetBrains Mono', monospace" }}>within 24 hours</text>

        {/* Conversion funnel bar at bottom */}
        <rect x="20" y="240" width="640" height="8" rx="4" fill="var(--warm-200)" />
        <rect x="20" y="240" width="640" height="8" rx="4" fill="#5a9a3c" opacity="0.12" />
        <rect x="20" y="240" width="435" height="8" rx="4" fill="#5a9a3c" opacity="0.15" />
        <rect x="20" y="240" width="290" height="8" rx="4" fill="#5a9a3c" opacity="0.25" />
        <rect x="20" y="240" width="180" height="8" rx="4" fill="#5a9a3c" opacity="0.35" />
        <text x="20" y="264" style={{ fontSize: 9, fill: "var(--ink-300)", fontFamily: "'JetBrains Mono', monospace" }}>100%</text>
        <text x="180" y="264" textAnchor="middle" style={{ fontSize: 9, fill: "var(--ink-300)", fontFamily: "'JetBrains Mono', monospace" }}>68%</text>
        <text x="350" y="264" textAnchor="middle" style={{ fontSize: 9, fill: "var(--ink-300)", fontFamily: "'JetBrains Mono', monospace" }}>46%</text>
        <text x="615" y="264" textAnchor="middle" style={{ fontSize: 9, fill: "#5a9a3c", fontFamily: "'JetBrains Mono', monospace" }}>38% converted</text>
      </svg>
    </div>
  );
}


// ═══ 5. SITEMAP TREE ═══
function SitemapTree() {
  const pages = {
    label: "Home", children: [
      { label: "About", children: [
        { label: "Team" },
        { label: "Story" },
        { label: "Careers", tag: "new" },
      ]},
      { label: "Work", children: [
        { label: "Case Studies" },
        { label: "Clients" },
      ]},
      { label: "Services", children: [
        { label: "Brand Identity" },
        { label: "Web Design" },
        { label: "Strategy" },
        { label: "Content", tag: "new" },
      ]},
      { label: "Blog" },
      { label: "Contact" },
    ],
  };

  const nodeW = 95, nodeH = 34, gapX = 12, gapY = 50;
  const totalLeaf = pages.children.reduce((s, c) => s + (c.children?.length || 0), 0);
  const levelTwoW = pages.children.length * (nodeW + gapX);

  function renderNode(node, x, y, level) {
    const isRoot = level === 0;
    const color = isRoot ? "#b07d4f" : level === 1 ? "#5b7fa4" : "#8a7e63";
    const elements = [];

    elements.push(
      <g key={`${node.label}-${x}-${y}`}>
        <rect x={j(x)} y={j(y)} width={nodeW} height={nodeH} rx={isRoot ? nodeH / 2 : 6}
          fill={color + "06"} stroke={color} strokeWidth={isRoot ? 1.2 : 0.8} />
        <text x={x + nodeW / 2} y={y + nodeH / 2} textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: isRoot ? 13 : 11, fontWeight: isRoot ? 600 : 400, fill: color, fontFamily: "'Outfit', sans-serif" }}>
          {node.label}
        </text>
        {node.tag && (
          <g>
            <rect x={x + nodeW - 20} y={y - 6} width={24} height={12} rx={3} fill="#5a9a3c" />
            <text x={x + nodeW - 8} y={y + 1} textAnchor="middle" dominantBaseline="central"
              style={{ fontSize: 7, fill: "#fff", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>NEW</text>
          </g>
        )}
      </g>
    );

    if (node.children) {
      const childCount = node.children.length;
      const totalChildW = childCount * nodeW + (childCount - 1) * gapX;
      const startX = x + nodeW / 2 - totalChildW / 2;

      node.children.forEach((child, i) => {
        const cx = startX + i * (nodeW + gapX);
        const cy = y + nodeH + gapY;

        // Connector
        elements.push(
          <path key={`line-${node.label}-${child.label}`}
            d={`M${x + nodeW / 2} ${y + nodeH} C${x + nodeW / 2} ${y + nodeH + 20}, ${cx + nodeW / 2} ${cy - 20}, ${cx + nodeW / 2} ${cy}`}
            fill="none" stroke="var(--warm-300)" strokeWidth="0.8" />
        );

        elements.push(...renderNode(child, cx, cy, level + 1));
      });
    }

    return elements;
  }

  return (
    <div className="dc-panel">
      <div className="dc-panel-head">
        <span className="dc-badge" style={{ color: "#5a9a3c", background: "rgba(90,154,60,0.06)", borderColor: "rgba(90,154,60,0.1)" }}>Sitemap</span>
        <span className="dc-panel-title">Website architecture</span>
      </div>
      <svg viewBox="0 0 680 320" className="dc-svg">
        {renderNode(pages, 292, 16, 0)}
      </svg>
    </div>
  );
}


// ═══ 6. HAND-DRAWN CHART ═══
function HandDrawnChart() {
  const data = [
    { label: "Jan", value: 4200 },
    { label: "Feb", value: 5800 },
    { label: "Mar", value: 3900 },
    { label: "Apr", value: 7200 },
    { label: "May", value: 6100 },
    { label: "Jun", value: 8400 },
  ];
  const max = Math.max(...data.map(d => d.value));
  const chartX = 60, chartY = 30, chartW = 540, chartH = 180;
  const barW = 50, gap = (chartW - data.length * barW) / (data.length + 1);

  return (
    <div className="dc-panel">
      <div className="dc-panel-head">
        <span className="dc-badge" style={{ color: "#b07d4f", background: "rgba(176,125,79,0.06)", borderColor: "rgba(176,125,79,0.1)" }}>Chart</span>
        <span className="dc-panel-title">Monthly revenue — sketched</span>
      </div>
      <svg viewBox="0 0 680 280" className="dc-svg">
        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
          const y = chartY + chartH * (1 - f);
          const val = Math.round(max * f);
          return (
            <g key={i}>
              <line x1={chartX} y1={y} x2={chartX + chartW} y2={j(y, 0.5)} stroke="var(--warm-200)" strokeWidth="0.5" strokeDasharray="3 4" />
              <text x={chartX - 8} y={y + 3} textAnchor="end" style={{ fontSize: 9, fill: "var(--ink-300)", fontFamily: "'JetBrains Mono', monospace" }}>${(val / 1000).toFixed(1)}k</text>
            </g>
          );
        })}

        {/* Bars with sketchy edges */}
        {data.map((d, i) => {
          const barH = (d.value / max) * chartH;
          const x = chartX + gap + i * (barW + gap);
          const y = chartY + chartH - barH;
          const isMax = d.value === max;
          const color = isMax ? "#b07d4f" : "#d5d1c8";

          const path = jPath([
            [x, chartY + chartH],
            [x, y],
            [x + barW, y],
            [x + barW, chartY + chartH],
          ]) + " Z";

          return (
            <g key={i}>
              <path d={path} fill={color + "40"} stroke={color} strokeWidth="1" />
              {/* Value label */}
              <text x={x + barW / 2} y={y - 8} textAnchor="middle"
                style={{ fontSize: 11, fontWeight: 500, fill: isMax ? "#b07d4f" : "var(--ink-400)", fontFamily: "'JetBrains Mono', monospace" }}>
                ${(d.value / 1000).toFixed(1)}k
              </text>
              {/* X label */}
              <text x={x + barW / 2} y={chartY + chartH + 18} textAnchor="middle"
                style={{ fontSize: 10, fill: "var(--ink-400)", fontFamily: "'Outfit', sans-serif" }}>
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Trend line */}
        <path d={data.map((d, i) => {
          const x = chartX + gap + i * (barW + gap) + barW / 2;
          const y = chartY + chartH - (d.value / max) * chartH;
          return `${i === 0 ? "M" : "L"}${j(x, 2)},${j(y, 2)}`;
        }).join(" ")} fill="none" stroke="#b07d4f" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />

        {/* Annotation */}
        <line x1={chartX + gap + 5 * (barW + gap) + barW / 2} y1={chartY + chartH - (8400 / max) * chartH - 20}
          x2={chartX + gap + 5 * (barW + gap) + barW / 2 + 60} y2={chartY + chartH - (8400 / max) * chartH - 40}
          stroke="#b07d4f" strokeWidth="0.8" strokeDasharray="3 2" />
        <text x={chartX + gap + 5 * (barW + gap) + barW / 2 + 64} y={chartY + chartH - (8400 / max) * chartH - 44}
          style={{ fontSize: 10, fill: "#b07d4f", fontFamily: "'JetBrains Mono', monospace" }}>Peak month ↑</text>
      </svg>
    </div>
  );
}


// ═══ 7. ANNOTATION STAMPS ═══
function AnnotationStamps() {
  const stamps = [
    { type: "approved", icon: "✓", label: "Approved", color: "#5a9a3c", date: "Mar 29" },
    { type: "revision", icon: "↻", label: "Needs revision", color: "#c89360", date: "Mar 28" },
    { type: "rejected", icon: "✕", label: "Rejected", color: "#c24b38", date: "" },
    { type: "draft", icon: "✎", label: "Draft", color: "#9b988f", date: "" },
    { type: "final", icon: "◆", label: "Final", color: "#b07d4f", date: "" },
    { type: "urgent", icon: "!", label: "Urgent", color: "#c24b38", date: "" },
    { type: "client-approved", icon: "★", label: "Client approved", color: "#5a9a3c", date: "" },
    { type: "internal", icon: "⊘", label: "Internal only", color: "#7c8594", date: "" },
  ];

  return (
    <div className="dc-panel">
      <div className="dc-panel-head">
        <span className="dc-badge" style={{ color: "#c24b38", background: "rgba(194,75,56,0.04)", borderColor: "rgba(194,75,56,0.08)" }}>Stamps</span>
        <span className="dc-panel-title">Status annotations</span>
      </div>
      <div className="dc-stamps-grid">
        {stamps.map((s, i) => (
          <div key={i} className="dc-stamp" style={{ borderColor: s.color + "20" }}>
            <div className="dc-stamp-icon" style={{ color: s.color, borderColor: s.color, background: s.color + "06" }}>
              {s.icon}
            </div>
            <span className="dc-stamp-label" style={{ color: s.color }}>{s.label}</span>
            {s.date && <span className="dc-stamp-date">{s.date}</span>}
          </div>
        ))}
      </div>
      <div className="dc-stamps-demo">
        <div className="dc-stamp-applied" style={{ borderColor: "#5a9a3c20" }}>
          <div className="dc-stamp-applied-content">
            <div className="dc-stamp-applied-icon" style={{ color: "#5a9a3c", borderColor: "#5a9a3c" }}>✓</div>
            <div className="dc-stamp-applied-info">
              <div className="dc-stamp-applied-label" style={{ color: "#5a9a3c" }}>Approved by Sarah Chen</div>
              <div className="dc-stamp-applied-date">March 29, 2026 · 2:14 PM</div>
            </div>
          </div>
          <div className="dc-stamp-applied-sig" style={{ color: "#5a9a3c" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontStyle: "italic" }}>Sarah Chen</span>
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══ 8. WIREFRAME COMPONENTS ═══
function WireframeComponents() {
  return (
    <div className="dc-panel">
      <div className="dc-panel-head">
        <span className="dc-badge" style={{ color: "#7c8594", background: "rgba(124,133,148,0.06)", borderColor: "rgba(124,133,148,0.1)" }}>Wireframe kit</span>
        <span className="dc-panel-title">Drag-and-drop UI patterns</span>
      </div>
      <div className="dc-wf-grid">
        {/* Nav patterns */}
        <div className="dc-wf-item">
          <div className="dc-wf-preview">
            <div className="wk-nav"><div className="wk-logo" /><div className="wk-links"><span /><span /><span /><span className="wk-btn" /></div></div>
          </div>
          <div className="dc-wf-label">Navigation</div>
        </div>

        {/* Hero patterns */}
        <div className="dc-wf-item">
          <div className="dc-wf-preview">
            <div className="wk-hero-split"><div className="wk-hero-text"><div className="wk-h" /><div className="wk-p" /><div className="wk-p s" /><div className="wk-cta" /></div><div className="wk-hero-img" /></div>
          </div>
          <div className="dc-wf-label">Hero — split</div>
        </div>

        {/* Card grid */}
        <div className="dc-wf-item">
          <div className="dc-wf-preview">
            <div className="wk-cards"><div className="wk-card"><div className="wk-card-img" /><div className="wk-card-body"><div className="wk-h s" /><div className="wk-p" /></div></div><div className="wk-card"><div className="wk-card-img" /><div className="wk-card-body"><div className="wk-h s" /><div className="wk-p" /></div></div><div className="wk-card"><div className="wk-card-img" /><div className="wk-card-body"><div className="wk-h s" /><div className="wk-p" /></div></div></div>
          </div>
          <div className="dc-wf-label">3-card grid</div>
        </div>

        {/* Testimonial */}
        <div className="dc-wf-item">
          <div className="dc-wf-preview">
            <div className="wk-testimonial"><div className="wk-quote-mark">❝</div><div className="wk-p" style={{ width: "85%" }} /><div className="wk-p s" style={{ width: "60%" }} /><div className="wk-t-author"><div className="wk-avatar" /><div><div className="wk-p s" style={{ width: 40 }} /><div className="wk-p" style={{ width: 60, height: 2, marginTop: 2 }} /></div></div></div>
          </div>
          <div className="dc-wf-label">Testimonial</div>
        </div>

        {/* Pricing table */}
        <div className="dc-wf-item">
          <div className="dc-wf-preview">
            <div className="wk-pricing"><div className="wk-price-col"><div className="wk-h s" /><div className="wk-price-num" /><div className="wk-p" /><div className="wk-p" /><div className="wk-p" /><div className="wk-cta s" /></div><div className="wk-price-col featured"><div className="wk-h s" /><div className="wk-price-num" /><div className="wk-p" /><div className="wk-p" /><div className="wk-p" /><div className="wk-cta" /></div><div className="wk-price-col"><div className="wk-h s" /><div className="wk-price-num" /><div className="wk-p" /><div className="wk-p" /><div className="wk-p" /><div className="wk-cta s" /></div></div>
          </div>
          <div className="dc-wf-label">Pricing table</div>
        </div>

        {/* Footer */}
        <div className="dc-wf-item">
          <div className="dc-wf-preview" style={{ background: "var(--ink-900)", borderRadius: 4 }}>
            <div className="wk-footer"><div className="wk-footer-cols"><div><div className="wk-logo" style={{ background: "rgba(255,255,255,0.15)" }} /><div className="wk-p" style={{ background: "rgba(255,255,255,0.06)", marginTop: 6, width: 60 }} /></div><div><div className="wk-p" style={{ background: "rgba(255,255,255,0.08)" }} /><div className="wk-p" style={{ background: "rgba(255,255,255,0.06)", width: "80%" }} /><div className="wk-p" style={{ background: "rgba(255,255,255,0.06)", width: "60%" }} /></div><div><div className="wk-p" style={{ background: "rgba(255,255,255,0.08)" }} /><div className="wk-p" style={{ background: "rgba(255,255,255,0.06)", width: "80%" }} /><div className="wk-p" style={{ background: "rgba(255,255,255,0.06)", width: "60%" }} /></div></div></div>
          </div>
          <div className="dc-wf-label">Footer — dark</div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════
   SHOWCASE
   ═══════════════════════════ */
export default function DrawingComponents() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
        .page{font-family:'Outfit',sans-serif;font-size:15px;color:var(--ink-700);background:var(--parchment);min-height:100vh}
        .canvas{max-width:780px;margin:0 auto;padding:40px 32px 100px}
        .doc-h1{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:var(--ink-900);margin-bottom:6px}
        .doc-meta{font-family:var(--mono);font-size:11px;color:var(--ink-400);margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--warm-200);display:flex;gap:12px}
        .doc-p{font-size:15px;color:var(--ink-600);line-height:1.8;margin-bottom:12px}
        .cat{font-family:var(--mono);font-size:9px;color:var(--ink-300);letter-spacing:.1em;text-transform:uppercase;margin:36px 0 12px;display:flex;align-items:center;gap:8px}.cat::after{content:'';flex:1;height:1px;background:var(--warm-200)}

        /* ═══ SHARED ═══ */
        .dc-panel{border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;margin:16px 0;background:#fff}
        .dc-panel-head{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--warm-100)}
        .dc-badge{font-family:var(--mono);font-size:9px;font-weight:500;padding:2px 8px;border-radius:3px;border:1px solid;color:var(--ink-400);background:var(--warm-100);border-color:var(--warm-200)}
        .dc-panel-title{font-size:15px;font-weight:500;color:var(--ink-800)}
        .dc-svg{width:100%;display:block}
        .dc-arrow-label{font-size:10px;fill:var(--ink-400);font-family:'JetBrains Mono',monospace;font-weight:500}

        /* ═══ DEVICES ═══ */
        .dc-devices{display:flex;align-items:flex-end;gap:20px;padding:24px;justify-content:center}
        .dc-device{border:1px solid var(--warm-300);border-radius:10px;overflow:hidden;background:var(--warm-50)}
        .dc-device.desktop{width:320px}
        .dc-device.tablet{width:180px}
        .dc-device.phone{width:90px}
        .dc-device-bar{display:flex;align-items:center;padding:6px 10px;border-bottom:1px solid var(--warm-200);background:var(--warm-100);gap:8px}
        .dc-device-dots{display:flex;gap:3px}.dc-device-dots span{width:6px;height:6px;border-radius:50%;background:var(--warm-300)}
        .dc-device-url{font-family:var(--mono);font-size:8px;color:var(--ink-300);background:#fff;border:1px solid var(--warm-200);border-radius:3px;padding:1px 8px;flex:1;text-align:center}
        .tablet-bar{justify-content:center;padding:4px}
        .dc-device-notch{width:40px;height:3px;background:var(--warm-300);border-radius:2px}
        .phone-bar{justify-content:center;padding:4px}
        .dc-device-island{width:24px;height:6px;background:var(--ink-900);border-radius:3px;opacity:.15}
        .dc-device-screen{padding:10px;min-height:180px}
        .tablet-screen{min-height:200px;padding:8px}
        .phone-screen{min-height:160px;padding:6px}

        /* Mock content */
        .dc-mock-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
        .dc-m-logo{width:40px;height:6px;background:var(--warm-300);border-radius:2px}
        .dc-m-links{display:flex;gap:6px;align-items:center}.dc-m-links span{width:20px;height:3px;background:var(--warm-200);border-radius:1px}
        .dc-m-btn{width:28px;height:10px;background:var(--ink-900);border-radius:2px;opacity:.12}
        .dc-m-hamburger{font-size:12px;color:var(--ink-300)}
        .dc-mock-hero{padding:8px 0}
        .dc-m-badge{width:60px;height:6px;background:var(--ember);opacity:.12;border-radius:2px;margin-bottom:4px}
        .dc-m-h1{width:65%;height:10px;background:var(--warm-300);border-radius:2px;margin-bottom:5px}
        .dc-m-p{width:85%;height:4px;background:var(--warm-200);border-radius:1px;margin-bottom:3px}.dc-m-p.short{width:50%}
        .dc-m-cta-row{display:flex;gap:5px;margin-top:6px}
        .dc-m-cta{width:56px;height:14px;background:var(--ink-900);border-radius:3px;opacity:.15}
        .dc-m-cta-ghost{width:50px;height:14px;border:1px solid var(--warm-300);border-radius:3px}
        .dc-mock-grid{display:flex;gap:6px;margin-top:8px}.dc-mock-grid div{flex:1;height:40px;background:var(--warm-100);border-radius:3px;border:1px solid var(--warm-200)}

        /* ═══ STICKY NOTES ═══ */
        .dc-sticky-canvas{position:relative;min-height:340px;padding:20px;background:var(--warm-50)}
        .dc-sticky{position:absolute;width:160px;padding:14px;border-radius:2px;box-shadow:2px 3px 8px rgba(0,0,0,0.06);cursor:pointer;transition:transform .12s,box-shadow .12s}
        .dc-sticky:hover{transform:scale(1.04) rotate(0deg) !important;box-shadow:3px 5px 14px rgba(0,0,0,0.1);z-index:5}
        .dc-sticky-text{font-size:12px;color:var(--ink-700);line-height:1.45;margin-bottom:6px}
        .dc-sticky-author{font-family:var(--mono);font-size:9px;color:var(--ink-400)}
        .dc-sticky-lines{position:absolute;inset:0;pointer-events:none}

        /* ═══ STAMPS ═══ */
        .dc-stamps-grid{display:flex;gap:6px;padding:16px;flex-wrap:wrap}
        .dc-stamp{display:flex;align-items:center;gap:6px;padding:6px 12px;border:1px solid;border-radius:6px;cursor:pointer;transition:all .08s}
        .dc-stamp:hover{transform:translateY(-1px);box-shadow:0 2px 6px rgba(0,0,0,0.04)}
        .dc-stamp-icon{width:24px;height:24px;border-radius:5px;border:1.5px solid;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}
        .dc-stamp-label{font-family:var(--mono);font-size:11px;font-weight:500}
        .dc-stamp-date{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
        .dc-stamps-demo{padding:0 16px 16px}
        .dc-stamp-applied{border:1px solid;border-radius:8px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between}
        .dc-stamp-applied-content{display:flex;align-items:center;gap:10px}
        .dc-stamp-applied-icon{width:32px;height:32px;border-radius:7px;border:2px solid;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
        .dc-stamp-applied-label{font-size:14px;font-weight:500}
        .dc-stamp-applied-date{font-family:var(--mono);font-size:10px;color:var(--ink-300);margin-top:2px}

        /* ═══ WIREFRAME KIT ═══ */
        .dc-wf-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:16px}
        .dc-wf-item{border:1px solid var(--warm-200);border-radius:8px;overflow:hidden;cursor:pointer;transition:all .08s}
        .dc-wf-item:hover{border-color:var(--warm-300);box-shadow:0 2px 8px rgba(0,0,0,0.03);transform:translateY(-1px)}
        .dc-wf-preview{padding:10px;background:var(--warm-50);min-height:100px}
        .dc-wf-label{padding:6px 10px;font-size:11px;font-weight:500;color:var(--ink-500);text-align:center;border-top:1px solid var(--warm-100)}

        /* Wireframe kit primitives */
        .wk-nav{display:flex;align-items:center;justify-content:space-between;padding:4px 0;margin-bottom:6px}
        .wk-logo{width:32px;height:5px;background:var(--warm-300);border-radius:1px}
        .wk-links{display:flex;gap:5px;align-items:center}.wk-links span{width:16px;height:3px;background:var(--warm-200);border-radius:1px}
        .wk-btn{width:24px;height:8px;background:var(--ink-900);border-radius:2px;opacity:.12}
        .wk-h{width:60%;height:7px;background:var(--warm-300);border-radius:1px;margin-bottom:4px}.wk-h.s{width:40%;height:5px}
        .wk-p{width:80%;height:3px;background:var(--warm-200);border-radius:1px;margin-bottom:2px}.wk-p.s{width:50%}
        .wk-cta{width:40px;height:10px;background:var(--ink-900);border-radius:2px;opacity:.12;margin-top:4px}.wk-cta.s{opacity:.06}
        .wk-hero-split{display:flex;gap:8px;align-items:center}
        .wk-hero-text{flex:1}
        .wk-hero-img{width:60px;height:50px;background:var(--warm-200);border-radius:4px;flex-shrink:0}
        .wk-cards{display:flex;gap:4px}
        .wk-card{flex:1;border:1px solid var(--warm-200);border-radius:3px;overflow:hidden}
        .wk-card-img{height:28px;background:var(--warm-200)}
        .wk-card-body{padding:4px}
        .wk-testimonial{text-align:center;padding:8px}
        .wk-quote-mark{font-size:14px;color:var(--warm-300);margin-bottom:2px}
        .wk-t-author{display:flex;align-items:center;gap:5px;justify-content:center;margin-top:6px}
        .wk-avatar{width:16px;height:16px;border-radius:50%;background:var(--warm-300)}
        .wk-pricing{display:flex;gap:3px}
        .wk-price-col{flex:1;border:1px solid var(--warm-200);border-radius:3px;padding:6px;text-align:center}
        .wk-price-col.featured{border-color:var(--ink-900);border-width:1.5px;background:rgba(44,42,37,0.01)}
        .wk-price-num{width:24px;height:8px;background:var(--warm-300);border-radius:1px;margin:4px auto}
        .wk-footer{padding:8px}
        .wk-footer-cols{display:flex;gap:12px}
        .wk-footer-cols>div{flex:1;display:flex;flex-direction:column;gap:3px}
      `}</style>

      <div className="page"><div className="canvas">
        <h1 className="doc-h1">Drawing Components</h1>
        <div className="doc-meta"><span>Visual primitives for the canvas</span><span>·</span><span>8 component kits</span><span>·</span><span>Drag from library</span></div>

        <div className="cat">flowchart kit</div>
        <p className="doc-p">Hover the nodes. Hand-drawn edges, diamond decision nodes, pill start/end caps. Every connector has subtle jitter. The "Revise scope" node loops back up to "Send proposal" — showing the real negotiation flow.</p>
        <FlowchartKit />

        <div className="cat">user flow diagram</div>
        <p className="doc-p">Five mini screen wireframes connected by arrows. Each screen shows a rough layout. Annotations call out drop-off points (32% at sign-up) and conversion rates (38% activated). A gradient funnel bar at the bottom shows the pipeline narrowing.</p>
        <UserFlowDiagram />

        <div className="cat">device frames</div>
        <p className="doc-p">Desktop, tablet, and phone frames with realistic browser chrome. The desktop has traffic light dots and a URL bar. The tablet has a notch. The phone has a Dynamic Island. Inside: the same wireframe content adapts to each screen size.</p>
        <DeviceFrames />

        <div className="cat">sitemap tree</div>
        <p className="doc-p">Recursive site architecture with curved connector lines. Home → About (Team, Story, Careers), Work (Case Studies, Clients), Services (Brand Identity, Web Design, Strategy, Content), Blog, Contact. New pages get green "NEW" badges. Color-coded by depth.</p>
        <SitemapTree />

        <div className="cat">sticky note cluster</div>
        <p className="doc-p">Six sticky notes scattered at natural angles on a cork-board background. Each has handwritten-style text, an author attribution, and subtle rotation. Hover to straighten and lift. Dashed connection lines link related ideas. Perfect for presenting discovery workshop output.</p>
        <StickyCluster />

        <div className="cat">hand-drawn chart</div>
        <p className="doc-p">Revenue bar chart with sketchy edges. Every bar has jittered corners — no two render identically. Dashed gridlines, monospace axis labels, a trend line connecting peaks, and an annotation callout on the highest month. The warmth of a whiteboard sketch with real data.</p>
        <HandDrawnChart />

        <div className="cat">annotation stamps</div>
        <p className="doc-p">Eight status stamps: Approved, Needs Revision, Rejected, Draft, Final, Urgent, Client Approved, Internal Only. Each with a bordered icon, colored label, and optional date. Below: an applied stamp showing the full approval with signature and timestamp. Drop these on any deliverable in the editor.</p>
        <AnnotationStamps />

        <div className="cat">wireframe component kit</div>
        <p className="doc-p">Six reusable page patterns as miniature previews: Navigation, Hero (split layout), 3-card grid, Testimonial, Pricing table (with featured column), and dark Footer. Hover to lift. Drag these into the canvas to assemble full page wireframes in seconds.</p>
        <WireframeComponents />

      </div></div>
    </>
  );
}
