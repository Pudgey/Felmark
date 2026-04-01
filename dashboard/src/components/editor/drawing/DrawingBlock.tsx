"use client";

import { useMemo } from "react";
import type { DrawingBlockData, DrawingType } from "@/lib/types";
import styles from "./DrawingBlock.module.css";

/* ── Jitter helpers for hand-drawn feel ── */
const j = (v: number, a = 1.2) => v + (Math.random() - 0.5) * a;
const jPath = (points: number[][]) =>
  points.map((p, i) => `${i === 0 ? "M" : "L"}${j(p[0])},${j(p[1])}`).join(" ");

/* ── Type picker options (exported for Editor sub-picker) ── */
export const DRAWING_TYPE_OPTIONS: { type: DrawingType; icon: string; label: string }[] = [
  { type: "flowchart", icon: "◇", label: "Flowchart" },
  { type: "userflow", icon: "→", label: "User Flow" },
  { type: "devices", icon: "▣", label: "Device Frames" },
  { type: "sitemap", icon: "⊞", label: "Sitemap Tree" },
  { type: "stickies", icon: "▦", label: "Sticky Notes" },
  { type: "sketch-chart", icon: "▥", label: "Sketch Chart" },
  { type: "stamps", icon: "✓", label: "Stamps" },
  { type: "wireframe-kit", icon: "☐", label: "Wireframe Kit" },
];

/* ── Default data factory ── */
export function getDefaultDrawingData(drawingType: DrawingType): DrawingBlockData {
  const titles: Record<DrawingType, string> = {
    flowchart: "Client Onboarding Flow",
    userflow: "User Flow Diagram",
    devices: "Responsive Preview",
    sitemap: "Site Architecture",
    stickies: "Brainstorm Notes",
    "sketch-chart": "Revenue Overview",
    stamps: "Approval Stamps",
    "wireframe-kit": "Wireframe Components",
  };
  return { drawingType, title: titles[drawingType], data: {} };
}

/* ── Panel wrapper ── */
function Panel({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className={styles.dcPanel}>
      <div className={styles.dcPanelHead}>
        <span className={styles.dcBadge}>{icon}</span>
        <span className={styles.dcPanelTitle}>{title}</span>
      </div>
      <div className={styles.dcBody}>{children}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   1. FlowchartKit
   ════════════════════════════════════════════════════ */
function FlowchartKit() {
  const nodes = useMemo(() => [
    { id: "n1", label: "Client inquiry", x: 280, y: 30, shape: "pill" as const },
    { id: "n2", label: "Good fit?", x: 280, y: 90, shape: "diamond" as const },
    { id: "n3", label: "Discovery call", x: 280, y: 155, shape: "rect" as const },
    { id: "n4", label: "Send proposal", x: 280, y: 215, shape: "rect" as const },
    { id: "n5", label: "Accepted?", x: 280, y: 280, shape: "diamond" as const },
    { id: "n6", label: "Sign contract", x: 280, y: 345, shape: "rect" as const },
    { id: "n7", label: "Collect deposit", x: 280, y: 405, shape: "rect" as const },
    { id: "n8", label: "Project kickoff", x: 280, y: 465, shape: "pill" as const },
    { id: "n9", label: "Refer out", x: 470, y: 90, shape: "rect" as const },
    { id: "n10", label: "Revise scope", x: 470, y: 280, shape: "rect" as const },
  ], []);

  const arrows = useMemo(() => [
    { from: [280, 48], to: [280, 74], label: "" },
    { from: [280, 108], to: [280, 140], label: "Yes" },
    { from: [340, 90], to: [430, 90], label: "No" },
    { from: [280, 172], to: [280, 200], label: "" },
    { from: [280, 232], to: [280, 264], label: "" },
    { from: [280, 298], to: [280, 330], label: "Yes" },
    { from: [340, 280], to: [430, 280], label: "No" },
    { from: [280, 362], to: [280, 390], label: "" },
    { from: [280, 422], to: [280, 450], label: "" },
    { from: [470, 298], to: [470, 330], label: "", curve: true, backTo: [310, 215] },
  ], []);

  return (
    <Panel icon="◇" title="Client Onboarding Flow">
      <svg viewBox="0 0 580 500" className={styles.dcSvg}>
        <defs>
          <marker id="fc-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="var(--ink-400)" />
          </marker>
        </defs>
        {/* Arrows */}
        {arrows.map((a, i) => {
          if (a.curve && a.backTo) {
            return (
              <g key={i}>
                <path
                  d={`M${j(a.from[0])},${j(a.from[1])} C${j(a.from[0] + 40)},${j(a.from[1] + 30)} ${j(a.backTo[0] + 60)},${j(a.backTo[1])} ${j(a.backTo[0])},${j(a.backTo[1])}`}
                  fill="none" stroke="var(--ink-300)" strokeWidth="1.2" strokeDasharray="4 3"
                  markerEnd="url(#fc-arrow)"
                />
              </g>
            );
          }
          return (
            <g key={i}>
              <line
                x1={j(a.from[0])} y1={j(a.from[1])}
                x2={j(a.to[0])} y2={j(a.to[1])}
                stroke="var(--ink-300)" strokeWidth="1.2" markerEnd="url(#fc-arrow)"
              />
              {a.label && (
                <text x={a.from[0] - 16} y={(a.from[1] + a.to[1]) / 2 + 3} className={styles.dcArrowLabel}>{a.label}</text>
              )}
            </g>
          );
        })}
        {/* Nodes */}
        {nodes.map(n => {
          const w = n.shape === "diamond" ? 50 : 80;
          const h = n.shape === "diamond" ? 32 : 28;
          return (
            <g key={n.id} className={styles.flowNode}>
              {n.shape === "pill" && (
                <rect x={j(n.x - w)} y={j(n.y - h / 2)} width={w * 2} height={h} rx={h / 2}
                  fill="var(--warm-50)" stroke="var(--ink-400)" strokeWidth="1.2" />
              )}
              {n.shape === "diamond" && (
                <path d={jPath([[n.x, n.y - h], [n.x + w, n.y], [n.x, n.y + h], [n.x - w, n.y]]) + "Z"}
                  fill="var(--warm-50)" stroke="var(--ink-400)" strokeWidth="1.2" />
              )}
              {n.shape === "rect" && (
                <rect x={j(n.x - w)} y={j(n.y - h / 2)} width={w * 2} height={h} rx={4}
                  fill="var(--warm-50)" stroke="var(--ink-400)" strokeWidth="1.2" />
              )}
              <text x={n.x} y={n.y + 4} textAnchor="middle"
                style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fill: "var(--ink-700)" }}>
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </Panel>
  );
}

/* ════════════════════════════════════════════════════
   2. UserFlowDiagram
   ════════════════════════════════════════════════════ */
function UserFlowDiagram() {
  const screens = useMemo(() => [
    { label: "Landing", desc: "Nav + hero + CTA" },
    { label: "Sign up", desc: "Form fields" },
    { label: "Onboarding", desc: "3-step wizard" },
    { label: "First project", desc: "Create prompt" },
    { label: "Editor", desc: "Block workspace" },
  ], []);

  const annotations = [
    { idx: 1, text: "32% drop off", color: "#c24b38" },
    { idx: 4, text: "68% activate", color: "#5a9a3c" },
  ];

  const funnelWidths = [100, 68, 52, 45, 38];
  const funnelColors = ["var(--warm-200)", "var(--warm-200)", "var(--warm-200)", "var(--warm-300)", "var(--ember)"];

  return (
    <Panel icon="→" title="User Flow Diagram">
      <svg viewBox="0 0 600 180" className={styles.dcSvg}>
        {screens.map((s, i) => {
          const x = 20 + i * 116;
          const y = 20;
          const w = 96;
          const h = 110;
          return (
            <g key={i} className={styles.ufScreen}>
              {/* Screen frame */}
              <rect x={j(x)} y={j(y)} width={w} height={h} rx={6}
                fill="#fff" stroke="var(--ink-300)" strokeWidth="1.2" />
              {/* Mini nav */}
              <rect x={x + 4} y={y + 4} width={w - 8} height={8} rx={2} fill="var(--warm-100)" />
              {/* Content area */}
              <rect x={x + 8} y={y + 18} width={w - 16} height={20} rx={3} fill="var(--warm-50)" />
              <rect x={x + 8} y={y + 42} width={w - 16} height={6} rx={2} fill="var(--warm-100)" />
              <rect x={x + 8} y={y + 52} width={w - 32} height={6} rx={2} fill="var(--warm-100)" />
              {/* CTA */}
              <rect x={x + (w - 36) / 2} y={y + 66} width={36} height={12} rx={3} fill="var(--ember)" />
              {/* Label */}
              <text x={x + w / 2} y={y + h + 14} textAnchor="middle"
                style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fill: "var(--ink-600)", fontWeight: 500 }}>
                {s.label}
              </text>
              {/* Arrow to next */}
              {i < screens.length - 1 && (
                <line x1={x + w + 2} y1={y + h / 2} x2={x + 114} y2={y + h / 2}
                  stroke="var(--ink-300)" strokeWidth="1.2" markerEnd="url(#uf-arrow)" />
              )}
            </g>
          );
        })}
        {/* Annotations */}
        {annotations.map((a, i) => {
          const x = 20 + a.idx * 116 + 48;
          return (
            <text key={i} x={x} y={162} textAnchor="middle" className={styles.ufAnnotation}
              style={{ fill: a.color }}>
              {a.text}
            </text>
          );
        })}
        <defs>
          <marker id="uf-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="var(--ink-400)" />
          </marker>
        </defs>
      </svg>
      {/* Conversion funnel */}
      <div className={styles.ufFunnel}>
        {funnelWidths.map((w, i) => (
          <div key={i} className={styles.ufFunnelBar}
            style={{ width: `${w}%`, background: funnelColors[i], opacity: 0.4 + i * 0.15 }} />
        ))}
      </div>
    </Panel>
  );
}

/* ════════════════════════════════════════════════════
   3. DeviceFrames
   ════════════════════════════════════════════════════ */
function DeviceFrames() {
  return (
    <Panel icon="▣" title="Responsive Preview">
      <div className={styles.dcDevices}>
        {/* Desktop */}
        <div>
          <div className={styles.dcDevice} style={{ width: 320 }}>
            <div className={styles.dcDeviceBar}>
              <span className={styles.dcTrafficDot} style={{ background: "#f55" }} />
              <span className={styles.dcTrafficDot} style={{ background: "#fb3" }} />
              <span className={styles.dcTrafficDot} style={{ background: "#5d5" }} />
              <span className={styles.dcUrlBar}>app.tryfelmark.com</span>
            </div>
            <div className={styles.dcDeviceContent}>
              <div className={styles.dcMockNav}>
                <div className={styles.dcMLogo} />
                <div className={styles.dcMLinks}>
                  <div className={styles.dcMLink} /><div className={styles.dcMLink} /><div className={styles.dcMLink} />
                </div>
              </div>
              <div className={styles.dcMHero}>
                <div className={styles.dcMHeroTitle} />
                <div className={styles.dcMHeroSub} />
                <div className={styles.dcMCta} />
              </div>
              <div className={styles.dcMGrid}>
                <div className={styles.dcMCard} /><div className={styles.dcMCard} /><div className={styles.dcMCard} />
              </div>
            </div>
          </div>
          <div className={styles.dcDeviceLabel}>Desktop</div>
        </div>
        {/* Tablet */}
        <div>
          <div className={styles.dcDevice} style={{ width: 180 }}>
            <div className={styles.dcNotch} />
            <div className={styles.dcDeviceContent}>
              <div className={styles.dcMockNav}>
                <div className={styles.dcMLogo} />
                <div className={styles.dcMLinks}>
                  <div className={styles.dcMLink} /><div className={styles.dcMLink} />
                </div>
              </div>
              <div className={styles.dcMHero}>
                <div className={styles.dcMHeroTitle} />
                <div className={styles.dcMHeroSub} />
                <div className={styles.dcMCta} />
              </div>
            </div>
          </div>
          <div className={styles.dcDeviceLabel}>Tablet</div>
        </div>
        {/* Phone */}
        <div>
          <div className={styles.dcDevice} style={{ width: 90 }}>
            <div className={styles.dcDynIsland} />
            <div className={styles.dcDeviceContent}>
              <div className={styles.dcMockNav}>
                <div className={styles.dcMLogo} />
              </div>
              <div className={styles.dcMHero}>
                <div className={styles.dcMHeroTitle} />
                <div className={styles.dcMCta} />
              </div>
            </div>
          </div>
          <div className={styles.dcDeviceLabel}>Phone</div>
        </div>
      </div>
    </Panel>
  );
}

/* ════════════════════════════════════════════════════
   4. SitemapTree
   ════════════════════════════════════════════════════ */
function SitemapTree() {
  const tree = useMemo(() => ({
    label: "Home", children: [
      { label: "About", children: [
        { label: "Team" }, { label: "Story" }, { label: "Careers", badge: "NEW" },
      ]},
      { label: "Work", children: [
        { label: "Case Studies" }, { label: "Clients" },
      ]},
      { label: "Services", children: [
        { label: "Brand Identity" }, { label: "Web Design" }, { label: "Strategy" }, { label: "Content", badge: "NEW" },
      ]},
      { label: "Blog" },
      { label: "Contact" },
    ],
  }), []);

  const depthColors = ["var(--ember)", "var(--ink-500)", "var(--ink-400)", "var(--warm-300)"];

  type TreeNode = { label: string; badge?: string; children?: TreeNode[] };

  function renderNode(node: TreeNode, x: number, y: number, depth: number, parentX?: number, parentY?: number): React.ReactNode[] {
    const elements: React.ReactNode[] = [];
    const key = `${node.label}-${x}-${y}`;
    const w = Math.max(node.label.length * 7 + 16, 60);
    const h = 24;
    const color = depthColors[Math.min(depth, depthColors.length - 1)];

    // Connector from parent
    if (parentX !== undefined && parentY !== undefined) {
      elements.push(
        <path key={`c-${key}`}
          d={`M${parentX},${parentY + 12} C${parentX},${parentY + 28} ${x + w / 2},${y - 16} ${x + w / 2},${y}`}
          fill="none" stroke="var(--warm-300)" strokeWidth="1.2" />
      );
    }

    // Node rect
    elements.push(
      <g key={key} className={styles.smNode}>
        <rect x={j(x)} y={j(y)} width={w} height={h} rx={4}
          fill="var(--parchment)" stroke={color} strokeWidth="1.2" />
        <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle"
          style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fill: "var(--ink-700)" }}>
          {node.label}
        </text>
        {node.badge && (
          <>
            <rect x={x + w - 4} y={y - 4} width={26} height={12} rx={6} fill="#5a9a3c" />
            <text x={x + w + 9} y={y + 5} textAnchor="middle" className={styles.smBadge}>{node.badge}</text>
          </>
        )}
      </g>
    );

    // Children
    if (node.children) {
      const totalW = node.children.reduce((acc, c) => acc + Math.max(c.label.length * 7 + 16, 60) + 16, -16);
      let cx = x + w / 2 - totalW / 2;
      for (const child of node.children) {
        const cw = Math.max(child.label.length * 7 + 16, 60);
        elements.push(...renderNode(child, cx, y + 52, depth + 1, x + w / 2, y + h));
        // Render grandchildren
        if (child.children) {
          const gcTotal = child.children.reduce((acc, gc) => acc + Math.max(gc.label.length * 7 + 16, 60) + 12, -12);
          let gcx = cx + cw / 2 - gcTotal / 2;
          for (const gc of child.children) {
            const gcw = Math.max(gc.label.length * 7 + 16, 60);
            // already rendered recursively above
            gcx += gcw + 12;
          }
        }
        cx += cw + 16;
      }
    }

    return elements;
  }

  return (
    <Panel icon="⊞" title="Site Architecture">
      <svg viewBox="0 0 680 220" className={styles.smTree}>
        {renderNode(tree, 290, 10, 0)}
      </svg>
    </Panel>
  );
}

/* ════════════════════════════════════════════════════
   5. StickyCluster
   ════════════════════════════════════════════════════ */
function StickyCluster() {
  const stickies = useMemo(() => [
    { text: "Users want faster onboarding — reduce steps to 3", author: "Sarah", color: "#fef3c7", x: 10, y: 10, rot: -3 },
    { text: "Mobile-first approach for all new features", author: "Jamie", color: "#ede9fe", x: 170, y: 5, rot: 2 },
    { text: "Integrate Stripe Connect by Q2", author: "Alex", color: "#dcfce7", x: 330, y: 15, rot: -1 },
    { text: "Consider dark mode as default — 73% prefer it", author: "Sarah", color: "#fce7d6", x: 50, y: 170, rot: 1.5 },
    { text: "Auto-save every 5s, not on blur", author: "Jamie", color: "#fef3c7", x: 220, y: 180, rot: -2 },
    { text: "Weekly client digest email — high retention signal", author: "Alex", color: "#dbeafe", x: 390, y: 165, rot: 2.5 },
  ], []);

  const connections = [
    { from: 0, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 5 },
  ];

  return (
    <Panel icon="▦" title="Brainstorm Notes">
      <div className={styles.dcStickyCanvas}>
        {/* Connection lines */}
        <svg className={styles.dcStickyLines}>
          {connections.map((c, i) => {
            const f = stickies[c.from];
            const t = stickies[c.to];
            return (
              <line key={i}
                x1={f.x + 70} y1={f.y + 50}
                x2={t.x + 70} y2={t.y + 20}
                stroke="var(--warm-300)" strokeWidth="1" strokeDasharray="6 4" />
            );
          })}
        </svg>
        {/* Sticky notes */}
        {stickies.map((s, i) => (
          <div key={i} className={styles.dcSticky}
            style={{
              left: s.x, top: s.y,
              background: s.color,
              transform: `rotate(${s.rot}deg)`,
            }}>
            <div className={styles.dcStickyText}>{s.text}</div>
            <div className={styles.dcStickyAuthor}>— {s.author}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ════════════════════════════════════════════════════
   6. HandDrawnChart (sketch-chart)
   ════════════════════════════════════════════════════ */
function HandDrawnChart() {
  const data = useMemo(() => [
    { label: "Jan", value: 4200 },
    { label: "Feb", value: 5800 },
    { label: "Mar", value: 3900 },
    { label: "Apr", value: 7200 },
    { label: "May", value: 6100 },
    { label: "Jun", value: 8400 },
  ], []);

  const maxVal = 9000;
  const chartH = 200;
  const chartW = 480;
  const barW = 48;
  const gap = 24;
  const leftPad = 50;
  const topPad = 20;
  const peakIdx = data.findIndex(d => d.value === Math.max(...data.map(d => d.value)));

  const yLabels = [0, 2000, 4000, 6000, 8000];

  return (
    <Panel icon="▥" title="Revenue Overview">
      <svg viewBox={`0 0 ${chartW + leftPad + 20} ${chartH + topPad + 40}`} className={styles.hdChart}>
        {/* Y-axis labels & gridlines */}
        {yLabels.map(v => {
          const y = topPad + chartH - (v / maxVal) * chartH;
          return (
            <g key={v}>
              <text x={leftPad - 8} y={y + 3} textAnchor="end" className={styles.hdLabel}>
                ${(v / 1000).toFixed(0)}k
              </text>
              <line x1={leftPad} y1={y} x2={leftPad + chartW - 20} y2={y}
                stroke="var(--warm-200)" strokeWidth="0.8" strokeDasharray="4 3" />
            </g>
          );
        })}
        {/* Bars */}
        {data.map((d, i) => {
          const barH = (d.value / maxVal) * chartH;
          const x = leftPad + i * (barW + gap) + gap / 2;
          const y = topPad + chartH - barH;
          const isMax = i === peakIdx;
          const fill = isMax ? "var(--ember)" : "var(--warm-200)";
          // Jitter the bar edges for hand-drawn feel
          const pts: number[][] = [
            [x, topPad + chartH],
            [x, y],
            [x + barW, y],
            [x + barW, topPad + chartH],
          ];
          return (
            <g key={i}>
              <path d={jPath(pts) + "Z"} fill={fill} className={styles.hdBar} />
              {/* Value label */}
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" className={styles.hdValue}>
                ${(d.value / 1000).toFixed(1)}k
              </text>
              {/* X label */}
              <text x={x + barW / 2} y={topPad + chartH + 16} textAnchor="middle" className={styles.hdLabel}>
                {d.label}
              </text>
              {/* Peak annotation */}
              {isMax && (
                <text x={x + barW / 2} y={y - 18} textAnchor="middle" className={styles.hdAnnotation}>
                  Peak month ↑
                </text>
              )}
            </g>
          );
        })}
        {/* Trend line */}
        <path
          d={data.map((d, i) => {
            const x = leftPad + i * (barW + gap) + gap / 2 + barW / 2;
            const y = topPad + chartH - (d.value / maxVal) * chartH;
            return `${i === 0 ? "M" : "L"}${j(x, 0.5)},${j(y, 0.5)}`;
          }).join(" ")}
          fill="none" stroke="var(--ink-400)" strokeWidth="1.2" strokeDasharray="5 3"
        />
      </svg>
    </Panel>
  );
}

/* ════════════════════════════════════════════════════
   7. AnnotationStamps
   ════════════════════════════════════════════════════ */
function AnnotationStamps() {
  const stamps = useMemo(() => [
    { label: "Approved", icon: "✓", bg: "#dcfce7", color: "#166534" },
    { label: "Needs revision", icon: "↻", bg: "#fef3c7", color: "#92400e" },
    { label: "Rejected", icon: "✕", bg: "#fecaca", color: "#991b1b" },
    { label: "Draft", icon: "✎", bg: "#e5e7eb", color: "#4b5563" },
    { label: "Final", icon: "◆", bg: "#fce7d6", color: "#9a3412" },
    { label: "Urgent", icon: "!", bg: "#fecaca", color: "#991b1b" },
    { label: "Client approved", icon: "★", bg: "#dcfce7", color: "#166534" },
    { label: "Internal only", icon: "⊘", bg: "#e5e7eb", color: "#4b5563" },
  ], []);

  return (
    <Panel icon="✓" title="Approval Stamps">
      <div className={styles.dcStampsGrid}>
        {stamps.map((s, i) => (
          <div key={i} className={styles.dcStamp} style={{ background: s.bg, color: s.color }}>
            <span className={styles.dcStampIcon}>{s.icon}</span>
            {s.label}
          </div>
        ))}
      </div>
      {/* Applied demo */}
      <div className={styles.dcStampApplied}>
        <span className={styles.dcStampAppliedIcon}>✓</span>
        <div className={styles.dcStampAppliedInfo}>
          <span className={styles.dcStampAppliedLabel}>Approved</span>
          <span className={styles.dcStampAppliedMeta}>Sarah Chen &middot; Mar 28, 2026 at 3:42 PM</span>
        </div>
      </div>
    </Panel>
  );
}

/* ════════════════════════════════════════════════════
   8. WireframeComponents (wireframe-kit)
   ════════════════════════════════════════════════════ */
function WireframeComponents() {
  return (
    <Panel icon="☐" title="Wireframe Components">
      <div className={styles.dcWfGrid}>
        {/* Navigation */}
        <div className={styles.dcWfItem}>
          <div className={styles.dcWfPreview}>
            <div className={styles.wkNav}>
              <div className={styles.wkLogo} />
              <div className={styles.wkLinks}>
                <div className={styles.wkLink} /><div className={styles.wkLink} /><div className={styles.wkLink} />
              </div>
            </div>
          </div>
          <div className={styles.dcWfLabel}>Navigation</div>
        </div>
        {/* Hero (split) */}
        <div className={styles.dcWfItem}>
          <div className={styles.dcWfPreview}>
            <div className={styles.wkHeroSplit}>
              <div className={styles.wkHeroText}>
                <div className={styles.wkTextLine} />
                <div className={styles.wkTextLineSm} />
              </div>
              <div className={styles.wkHeroImg} />
            </div>
          </div>
          <div className={styles.dcWfLabel}>Hero (split)</div>
        </div>
        {/* 3-card grid */}
        <div className={styles.dcWfItem}>
          <div className={styles.dcWfPreview}>
            <div className={styles.wkCards}>
              <div className={styles.wkCard} /><div className={styles.wkCard} /><div className={styles.wkCard} />
            </div>
          </div>
          <div className={styles.dcWfLabel}>Card Grid</div>
        </div>
        {/* Testimonial */}
        <div className={styles.dcWfItem}>
          <div className={styles.dcWfPreview}>
            <div className={styles.wkTestimonial}>
              <div className={styles.wkAvatar} />
              <div className={styles.wkQuote} />
              <div className={styles.wkTextLineSm} />
            </div>
          </div>
          <div className={styles.dcWfLabel}>Testimonial</div>
        </div>
        {/* Pricing table */}
        <div className={styles.dcWfItem}>
          <div className={styles.dcWfPreview}>
            <div className={styles.wkPricing}>
              <div className={styles.wkPricingCol}>
                <span className={styles.wkPrice}>$8</span>
                <div className={styles.wkBtnOutline} />
              </div>
              <div className={styles.wkPricingColFeatured}>
                <span className={styles.wkPrice}>$12</span>
                <div className={styles.wkBtn} />
              </div>
              <div className={styles.wkPricingCol}>
                <span className={styles.wkPrice}>$24</span>
                <div className={styles.wkBtnOutline} />
              </div>
            </div>
          </div>
          <div className={styles.dcWfLabel}>Pricing</div>
        </div>
        {/* Footer (dark) */}
        <div className={styles.dcWfItem}>
          <div className={styles.dcWfPreview} style={{ padding: 0 }}>
            <div className={styles.wkFooter}>
              <div className={styles.wkFooterCol}>
                <div className={styles.wkFooterLine} />
                <div className={styles.wkFooterLineSm} />
                <div className={styles.wkFooterLineSm} />
              </div>
              <div className={styles.wkFooterCol}>
                <div className={styles.wkFooterLine} />
                <div className={styles.wkFooterLineSm} />
                <div className={styles.wkFooterLineSm} />
              </div>
              <div className={styles.wkFooterCol}>
                <div className={styles.wkFooterLine} />
                <div className={styles.wkFooterLineSm} />
              </div>
            </div>
          </div>
          <div className={styles.dcWfLabel}>Footer</div>
        </div>
      </div>
    </Panel>
  );
}

/* ════════════════════════════════════════════════════
   Main DrawingBlock component
   ════════════════════════════════════════════════════ */
interface DrawingBlockProps {
  drawingData: DrawingBlockData;
  onUpdate: (data: DrawingBlockData) => void;
}

export default function DrawingBlock({ drawingData }: DrawingBlockProps) {
  switch (drawingData.drawingType) {
    case "flowchart": return <FlowchartKit />;
    case "userflow": return <UserFlowDiagram />;
    case "devices": return <DeviceFrames />;
    case "sitemap": return <SitemapTree />;
    case "stickies": return <StickyCluster />;
    case "sketch-chart": return <HandDrawnChart />;
    case "stamps": return <AnnotationStamps />;
    case "wireframe-kit": return <WireframeComponents />;
    default: return <Panel icon="✎" title="Drawing"><p>Unknown drawing type</p></Panel>;
  }
}
