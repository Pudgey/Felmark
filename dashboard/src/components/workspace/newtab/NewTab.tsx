"use client";

import { useState } from "react";
import { useWorkspaceNav } from "@/views/routers/WorkspaceRouter";
import styles from "./NewTab.module.css";

const SURFACES = [
  { id: "hub", icon: "\u25ce", label: "Client Hub", desc: "Project management", key: "1", stat: "4 clients" },
  { id: "pipeline", icon: "\u2192", label: "Pipeline", desc: "Deals & proposals", key: "2", stat: "$18.5k pipeline" },
  { id: "finance", icon: "$", label: "Finance", desc: "Invoices & billing", key: "3", stat: "$14.8k earned" },
  { id: "services", icon: "\u25c7", label: "Products", desc: "Services catalog", key: "4", stat: "8 products" },
  { id: "wire", icon: "\u223c", label: "The Wire", desc: "News & updates", key: "5", stat: "3 new" },
  { id: "terminal", icon: ">_", label: "Terminal", desc: "Forge command line", key: "6", stat: "last: 2m ago" },
];

const RECENTS = [
  { icon: "$", label: "Invoice #048 \u2014 Meridian", time: "2m ago" },
  { icon: "\u25c6", label: "Color palette & typography", time: "5m ago" },
  { icon: "\u270e", label: "Brand Guidelines v2.md", time: "12m ago" },
  { icon: "\u25c7", label: "Meridian Studio \u2014 Hub", time: "1h ago" },
  { icon: "\u25ce", label: "Invoice viewed by Sarah", time: "3h ago" },
];

export default function NewTab() {
  const [query, setQuery] = useState("");
  const [hoveredSurface, setHoveredSurface] = useState<string | null>(null);
  const nav = useWorkspaceNav();

  const handleSurfaceClick = (id: string) => {
    if (id === "hub") {
      nav.openHub({ clientId: "c1", clientName: "Meridian Studio", clientAvatar: "MS", clientColor: "#7c8594" });
    }
    if (id === "pipeline") nav.openTool("pipeline");
    if (id === "finance") nav.openTool("finance");
    if (id === "services") nav.openTool("services");
    if (id === "wire") nav.openTool("wire");
    // terminal — future navigation
  };

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div className={styles.newTab}>
      <div className={styles.content}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.mark}>{"\u25c6"}</div>
          <span className={styles.greeting}>{greeting}, Alex</span>
          <span className={styles.time}>{dateStr} {"\u00b7"} {timeStr}</span>
        </div>

        {/* Pulse stats */}
        <div className={styles.pulse}>
          <div className={styles.pulseItem}><div className={styles.pulseDot} style={{ background: "#26a69a" }} /><span className={styles.pulseVal}>$14.8k</span> earned</div>
          <div className={styles.pulseItem}><div className={styles.pulseDot} style={{ background: "#ef5350" }} /><span className={styles.pulseVal} style={{ color: "#ef5350" }}>1</span> overdue</div>
          <div className={styles.pulseItem}><div className={styles.pulseDot} style={{ background: "#2962ff" }} /><span className={styles.pulseVal}>3</span> signals</div>
          <div className={styles.pulseItem}><div className={styles.pulseDot} style={{ background: "#26a69a" }} /><span className={styles.pulseVal} style={{ color: "#26a69a" }}>{"\u25cf"} 1:22</span> timer</div>
        </div>

        {/* Command input */}
        <div className={styles.cmd}>
          <div className={styles.cmdBar}>
            <span className={styles.cmdIcon}>{"\u2318"}</span>
            <input className={styles.cmdInput} placeholder="Where do you want to go?" value={query} onChange={e => setQuery(e.target.value)} />
            <span className={styles.cmdKey}>{"\u21b5"}</span>
          </div>
        </div>

        {/* Surface grid */}
        <div className={styles.surfaces}>
          {SURFACES.map(s => (
            <div key={s.id} className={styles.surface}
              onMouseEnter={() => setHoveredSurface(s.id)}
              onMouseLeave={() => setHoveredSurface(null)}
              onClick={() => handleSurfaceClick(s.id)}>
              <span className={styles.surfaceKey}>{s.key}</span>
              <span className={styles.surfaceIcon}>{s.icon}</span>
              <span className={styles.surfaceLabel}>{s.label}</span>
              <span className={styles.surfaceDesc}>{hoveredSurface === s.id ? s.stat : s.desc}</span>
            </div>
          ))}
        </div>

        {/* Recents */}
        <div className={styles.recents}>
          <div className={styles.recentsHd}>Recent</div>
          {RECENTS.map((r, i) => (
            <div key={i} className={styles.recent}>
              <div className={styles.recentIcon}>{r.icon}</div>
              <span className={styles.recentLabel}>{r.label}</span>
              <span className={styles.recentTime}>{r.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
