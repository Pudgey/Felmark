import React from "react";
import type { CommandRegistryEntry } from "../types";

const WIRE_SIGNALS = [
  {
    type: "opportunity",
    title: "Meridian is hiring 3 more freelancers",
    source: "LinkedIn",
    time: "2h ago",
    color: "#16a34a",
  },
  {
    type: "risk",
    title: "Cobalt Labs mentioned budget cuts in Q2 review",
    source: "Twitter",
    time: "5h ago",
    color: "#d97706",
  },
  {
    type: "insight",
    title: "Brand guidelines projects trending 18% higher rates",
    source: "Market data",
    time: "1d ago",
    color: "#2563eb",
  },
];

export const wireCommand: CommandRegistryEntry = {
  description: "Show latest Wire intelligence signals",
  icon: "⚡",
  category: "Intelligence",
  usage: "/wire",
  handler: () => {
    return (
      <div style={{ fontFamily: "var(--mono), 'JetBrains Mono', monospace", fontSize: 12 }}>
        <div style={{ color: "#9b988f", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 10 }}>
          Wire Signals
        </div>

        {WIRE_SIGNALS.map((signal, i) => (
          <div key={i} style={{
            padding: "8px 10px",
            marginBottom: 6,
            background: "#f7f6f3",
            borderRadius: 6,
            borderLeft: `3px solid ${signal.color}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <span style={{
                fontSize: 9,
                fontWeight: 600,
                textTransform: "uppercase" as const,
                letterSpacing: "0.06em",
                color: signal.color,
                background: signal.color + "10",
                padding: "1px 5px",
                borderRadius: 3,
              }}>
                {signal.type}
              </span>
              <span style={{ color: "#b5b2a9", fontSize: 10, marginLeft: "auto" }}>{signal.time}</span>
            </div>
            <div style={{ color: "#3d3a33", lineHeight: 1.4 }}>{signal.title}</div>
            <div style={{ color: "#b5b2a9", fontSize: 10, marginTop: 2 }}>via {signal.source}</div>
          </div>
        ))}

        <div style={{ color: "#b5b2a9", fontSize: 11, marginTop: 4, textAlign: "center" as const }}>
          Showing 3 of 12 signals · /wire --all for more
        </div>
      </div>
    );
  },
};
