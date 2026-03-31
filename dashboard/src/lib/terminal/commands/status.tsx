import React from "react";
import type { CommandRegistryEntry } from "../types";

const STATUS_DOTS: Record<string, { color: string; label: string }> = {
  active: { color: "#16a34a", label: "Active" },
  review: { color: "#d97706", label: "Review" },
  completed: { color: "#2563eb", label: "Done" },
  paused: { color: "#9b988f", label: "Paused" },
  overdue: { color: "#dc2626", label: "Overdue" },
};

export const statusCommand: CommandRegistryEntry = {
  description: "Show all projects and their status",
  icon: "◈",
  category: "Business",
  usage: "/status",
  handler: (_parsed, context) => {
    const { projects } = context;

    if (projects.length === 0) {
      return (
        <div style={{ padding: "8px 0", color: "#9b988f", fontFamily: "var(--mono), 'JetBrains Mono', monospace", fontSize: 12 }}>
          No projects found. Create a workspace first.
        </div>
      );
    }

    const activeCount = projects.filter(p => p.project.status === "active").length;
    const totalValue = projects.reduce((s, p) => {
      const num = parseFloat(p.project.amount.replace(/[^0-9.]/g, ""));
      return s + (isNaN(num) ? 0 : num);
    }, 0);

    return (
      <div style={{ fontFamily: "var(--mono), 'JetBrains Mono', monospace", fontSize: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "#9b988f", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
              <th style={{ textAlign: "left", padding: "4px 8px 6px 0", borderBottom: "1px solid #e5e2db", fontWeight: 500 }}>Project</th>
              <th style={{ textAlign: "left", padding: "4px 8px 6px", borderBottom: "1px solid #e5e2db", fontWeight: 500 }}>Client</th>
              <th style={{ textAlign: "left", padding: "4px 8px 6px", borderBottom: "1px solid #e5e2db", fontWeight: 500 }}>Status</th>
              <th style={{ textAlign: "right", padding: "4px 0 6px 8px", borderBottom: "1px solid #e5e2db", fontWeight: 500 }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(({ project, client }) => {
              const st = STATUS_DOTS[project.status] || STATUS_DOTS.active;
              return (
                <tr key={project.id}>
                  <td style={{ padding: "6px 8px 6px 0", color: "#3d3a33", borderBottom: "1px solid #f0eee9" }}>{project.name}</td>
                  <td style={{ padding: "6px 8px", color: "#65625a", borderBottom: "1px solid #f0eee9" }}>{client}</td>
                  <td style={{ padding: "6px 8px", borderBottom: "1px solid #f0eee9" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.color, display: "inline-block" }} />
                      <span style={{ color: st.color }}>{st.label}</span>
                    </span>
                  </td>
                  <td style={{ padding: "6px 0 6px 8px", textAlign: "right", color: "#3d3a33", borderBottom: "1px solid #f0eee9" }}>
                    {project.amount === "—" ? <span style={{ color: "#b5b2a9" }}>—</span> : project.amount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ marginTop: 10, padding: "8px 0 2px", borderTop: "1px solid #e5e2db", display: "flex", justifyContent: "space-between", color: "#9b988f", fontSize: 11 }}>
          <span>{activeCount} active · {projects.length} total</span>
          <span style={{ color: "#3d3a33" }}>{totalValue > 0 ? `$${totalValue.toLocaleString()}` : "—"}</span>
        </div>
      </div>
    );
  },
};
