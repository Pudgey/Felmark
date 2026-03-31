import React from "react";
import type { CommandRegistryEntry } from "../types";

const STAGES = [
  { key: "active", label: "Active", color: "#16a34a" },
  { key: "review", label: "Review", color: "#d97706" },
  { key: "paused", label: "Paused", color: "#9b988f" },
  { key: "completed", label: "Completed", color: "#2563eb" },
  { key: "overdue", label: "Overdue", color: "#dc2626" },
];

export const pipelineCommand: CommandRegistryEntry = {
  description: "View project pipeline by status",
  icon: "▧",
  category: "Business",
  usage: "/pipeline",
  handler: (_parsed, context) => {
    const { projects } = context;

    if (projects.length === 0) {
      return (
        <div style={{ fontFamily: "var(--mono), 'JetBrains Mono', monospace", fontSize: 12, color: "#9b988f" }}>
          No projects in pipeline.
        </div>
      );
    }

    // Group by status
    const grouped: Record<string, typeof projects> = {};
    for (const p of projects) {
      const status = p.project.status;
      if (!grouped[status]) grouped[status] = [];
      grouped[status].push(p);
    }

    const maxCount = Math.max(1, ...Object.values(grouped).map(g => g.length));

    return (
      <div style={{ fontFamily: "var(--mono), 'JetBrains Mono', monospace", fontSize: 12 }}>
        <div style={{ color: "#9b988f", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 10 }}>
          Pipeline Overview
        </div>

        {STAGES.map(stage => {
          const items = grouped[stage.key] || [];
          if (items.length === 0 && stage.key !== "active") return null;
          const barWidth = Math.max(4, Math.round((items.length / maxCount) * 100));

          return (
            <div key={stage.key} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: stage.color }} />
                  <span style={{ color: "#3d3a33", fontWeight: 500 }}>{stage.label}</span>
                </div>
                <span style={{ color: "#9b988f", fontSize: 11 }}>{items.length}</span>
              </div>
              {/* Bar */}
              <div style={{ height: 8, background: "#f0eee9", borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
                <div style={{
                  height: "100%",
                  width: `${barWidth}%`,
                  background: stage.color,
                  borderRadius: 4,
                  opacity: items.length === 0 ? 0.2 : 0.8,
                }} />
              </div>
              {/* Project names */}
              {items.length > 0 && (
                <div style={{ paddingLeft: 12, color: "#65625a", fontSize: 11 }}>
                  {items.map(({ project, client }) => (
                    <div key={project.id} style={{ padding: "1px 0" }}>
                      {project.name} <span style={{ color: "#b5b2a9" }}>· {client}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div style={{ borderTop: "1px solid #e5e2db", paddingTop: 6, marginTop: 4, color: "#9b988f", fontSize: 11, display: "flex", justifyContent: "space-between" }}>
          <span>{projects.length} total projects</span>
          <span>{grouped["active"]?.length || 0} in progress</span>
        </div>
      </div>
    );
  },
};
