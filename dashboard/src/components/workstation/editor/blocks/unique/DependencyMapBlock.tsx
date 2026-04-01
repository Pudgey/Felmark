"use client";

import type { DependencyMapData } from "@/lib/types";
import styles from "./UniqueBlocks.module.css";

interface Props {
  data: DependencyMapData;
  onUpdate: (data: DependencyMapData) => void;
}

const STATUS_CFG: Record<string, { color: string; bg: string; icon: string }> = {
  done: { color: "#5a9a3c", bg: "rgba(90,154,60,0.04)", icon: "✓" },
  active: { color: "#b07d4f", bg: "rgba(176,125,79,0.04)", icon: "●" },
  blocked: { color: "#c24b38", bg: "rgba(194,75,56,0.04)", icon: "!" },
  upcoming: { color: "#9b988f", bg: "transparent", icon: "○" },
};

export function getDefaultDependencyMapData(): DependencyMapData {
  return {
    nodes: [
      { id: "discovery", label: "Discovery", status: "done", x: 0, y: 0, deps: [] },
      { id: "strategy", label: "Strategy Doc", status: "done", x: 1, y: 0, deps: ["discovery"] },
      { id: "logo", label: "Logo Design", status: "active", x: 2, y: 0, deps: ["strategy"] },
      { id: "colors", label: "Color Palette", status: "active", x: 2, y: 1, deps: ["strategy"] },
      { id: "type", label: "Typography", status: "active", x: 3, y: 0, deps: ["logo"] },
      { id: "imagery", label: "Imagery", status: "blocked", x: 3, y: 1, deps: ["colors"], blocker: "Waiting on client photos" },
      { id: "guidelines", label: "Guidelines Doc", status: "upcoming", x: 4, y: 0, deps: ["type", "imagery", "colors"] },
      { id: "social", label: "Social Kit", status: "upcoming", x: 5, y: 0, deps: ["guidelines"] },
    ],
  };
}

export default function DependencyMapBlock({ data }: Props) {
  const blocked = data.nodes.filter(n => n.status === "blocked");

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge} style={{ color: "#5b7fa4", background: "rgba(91,127,164,0.06)", borderColor: "rgba(91,127,164,0.1)" }}>Dependencies</span>
        <span className={styles.title}>Deliverable map</span>
        <span className={styles.subtitle}>What depends on what</span>
      </div>
      <div className={styles.depsCanvas}>
        <svg width="100%" viewBox="0 0 640 200" style={{ display: "block" }}>
          {/* Arrows */}
          {data.nodes.map(node => node.deps.map(depId => {
            const dep = data.nodes.find(n => n.id === depId);
            if (!dep) return null;
            const x1 = dep.x * 105 + 90;
            const y1 = dep.y * 80 + 60;
            const x2 = node.x * 105 + 20;
            const y2 = node.y * 80 + 60;
            const st = STATUS_CFG[node.status];
            return <path key={`${depId}-${node.id}`} d={`M${x1} ${y1} C${x1 + 30} ${y1}, ${x2 - 30} ${y2}, ${x2} ${y2}`} fill="none" stroke={st.color} strokeWidth="1" opacity="0.25" strokeDasharray={node.status === "upcoming" ? "4 3" : "none"} />;
          }))}
          {/* Nodes */}
          {data.nodes.map(node => {
            const st = STATUS_CFG[node.status];
            const nx = node.x * 105 + 20;
            const ny = node.y * 80 + 35;
            return (
              <g key={node.id}>
                <rect x={nx} y={ny} width={70} height={48} rx="8" fill={st.bg} stroke={st.color} strokeWidth="0.5" opacity={node.status === "upcoming" ? 0.4 : 1} />
                <text x={nx + 35} y={ny + 22} textAnchor="middle" dominantBaseline="central" fill={st.color} fontSize="10" fontWeight="500" fontFamily="Outfit, sans-serif">{node.label}</text>
                <text x={nx + 35} y={ny + 37} textAnchor="middle" dominantBaseline="central" fill={st.color} fontSize="9" fontFamily="'JetBrains Mono', monospace" opacity="0.6">{st.icon} {node.status}</text>
              </g>
            );
          })}
        </svg>
      </div>
      {blocked.map(n => (
        <div key={n.id} className={styles.depsBlocked}>
          <span className={styles.depsBlockedIcon}>!</span>
          <span className={styles.depsBlockedText}><strong>{n.label}</strong> is blocked: {n.blocker}</span>
          <button className={styles.depsBlockedBtn}>Resolve</button>
        </div>
      ))}
    </div>
  );
}
