import React from "react";
import type { CommandRegistryEntry } from "../types";

export const rateCommand: CommandRegistryEntry = {
  description: "Calculate your effective hourly rate",
  icon: "◎",
  category: "Business",
  usage: "/rate",
  handler: (_parsed, context) => {
    const { projects } = context;

    // Compute from project data
    let totalRevenue = 0;
    let totalHours = 0;
    const projectRates: { name: string; amount: number; hours: number; rate: number }[] = [];

    for (const { project } of projects) {
      const amount = parseFloat(project.amount.replace(/[^0-9.]/g, ""));
      if (isNaN(amount) || amount === 0) continue;

      // Estimate hours from progress and a baseline (mock: use progress% of 40h per project)
      const estHours = Math.max(1, Math.round((project.progress / 100) * 40) || 8);
      totalRevenue += amount;
      totalHours += estHours;
      projectRates.push({
        name: project.name,
        amount,
        hours: estHours,
        rate: Math.round(amount / estHours),
      });
    }

    const effectiveRate = totalHours > 0 ? Math.round(totalRevenue / totalHours) : 0;
    const targetRate = 150;
    const pct = Math.min(100, Math.round((effectiveRate / targetRate) * 100));

    return (
      <div style={{ fontFamily: "var(--mono), 'JetBrains Mono', monospace", fontSize: 12 }}>
        {/* Rate header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#3d3a33" }}>
            ${effectiveRate}
          </span>
          <span style={{ color: "#9b988f", fontSize: 12 }}>/hr effective</span>
          <span style={{ marginLeft: "auto", color: pct >= 100 ? "#16a34a" : pct >= 70 ? "#d97706" : "#dc2626", fontSize: 11, fontWeight: 600 }}>
            {pct}% of target
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 6, background: "#f0eee9", borderRadius: 3, marginBottom: 14, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            background: pct >= 100 ? "#16a34a" : pct >= 70 ? "#d97706" : "#dc2626",
            borderRadius: 3,
            transition: "width 0.3s ease",
          }} />
        </div>

        {/* Per-project breakdown */}
        {projectRates.length > 0 && (
          <div style={{ borderTop: "1px solid #e5e2db", paddingTop: 8 }}>
            {projectRates.map((pr, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#65625a" }}>
                <span>{pr.name}</span>
                <span>
                  <span style={{ color: "#3d3a33" }}>${pr.rate}/hr</span>
                  <span style={{ color: "#b5b2a9", marginLeft: 8 }}>{pr.hours}h</span>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* AI hint */}
        <div style={{ marginTop: 10, padding: "6px 8px", background: "#f7f6f3", borderRadius: 4, color: "#9b988f", fontSize: 11 }}>
          <span style={{ color: "#b07d4f" }}>tip</span> — raise rates on projects below ${targetRate}/hr to improve your effective rate
        </div>
      </div>
    );
  },
};
