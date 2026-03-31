import React from "react";
import type { CommandRegistryEntry } from "../types";

/** Simple fuzzy match: all characters of query appear in order in target */
function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

export const clientCommand: CommandRegistryEntry = {
  description: "Look up a client workspace",
  icon: "◇",
  category: "Business",
  usage: "/client [name]",
  handler: (parsed, context) => {
    const { workspaces } = context;
    const query = parsed.action || parsed.positional.join(" ");

    if (!query) {
      // List all clients
      return (
        <div style={{ fontFamily: "var(--mono), 'JetBrains Mono', monospace", fontSize: 12 }}>
          <div style={{ color: "#9b988f", marginBottom: 8, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
            All Clients
          </div>
          {workspaces.map(ws => (
            <div key={ws.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid #f0eee9" }}>
              <span style={{
                width: 24, height: 24, borderRadius: 6, background: ws.avatarBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 11, fontWeight: 600,
              }}>
                {ws.avatar}
              </span>
              <span style={{ color: "#3d3a33", flex: 1 }}>{ws.client}</span>
              <span style={{ color: "#9b988f", fontSize: 11 }}>{ws.projects.length} project{ws.projects.length !== 1 ? "s" : ""}</span>
            </div>
          ))}
          <div style={{ marginTop: 6, color: "#b5b2a9", fontSize: 11 }}>
            Try: /client {"<name>"} for details
          </div>
        </div>
      );
    }

    // Fuzzy match
    const match = workspaces.find(ws => fuzzyMatch(query, ws.client));

    if (!match) {
      return (
        <div style={{ fontFamily: "var(--mono), 'JetBrains Mono', monospace", fontSize: 12, color: "#dc2626" }}>
          No client matching &quot;{query}&quot; found.
          <div style={{ color: "#9b988f", marginTop: 4 }}>
            Available: {workspaces.map(w => w.client).join(", ")}
          </div>
        </div>
      );
    }

    const activeProjects = match.projects.filter(p => p.status === "active" || p.status === "review");
    const totalValue = match.projects.reduce((s, p) => {
      const num = parseFloat(p.amount.replace(/[^0-9.]/g, ""));
      return s + (isNaN(num) ? 0 : num);
    }, 0);

    return (
      <div style={{ fontFamily: "var(--mono), 'JetBrains Mono', monospace", fontSize: 12 }}>
        {/* Client header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{
            width: 32, height: 32, borderRadius: 8, background: match.avatarBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 14, fontWeight: 600,
          }}>
            {match.avatar}
          </span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#3d3a33" }}>{match.client}</div>
            {match.contact && <div style={{ fontSize: 11, color: "#9b988f" }}>{match.contact}</div>}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          <div style={{ padding: "8px 10px", background: "#f7f6f3", borderRadius: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#3d3a33" }}>{match.projects.length}</div>
            <div style={{ fontSize: 10, color: "#9b988f", textTransform: "uppercase" as const }}>Projects</div>
          </div>
          <div style={{ padding: "8px 10px", background: "#f7f6f3", borderRadius: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#3d3a33" }}>{activeProjects.length}</div>
            <div style={{ fontSize: 10, color: "#9b988f", textTransform: "uppercase" as const }}>Active</div>
          </div>
          <div style={{ padding: "8px 10px", background: "#f7f6f3", borderRadius: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#3d3a33" }}>{totalValue > 0 ? `$${totalValue.toLocaleString()}` : "—"}</div>
            <div style={{ fontSize: 10, color: "#9b988f", textTransform: "uppercase" as const }}>Value</div>
          </div>
        </div>

        {/* Project list */}
        {match.projects.map(p => {
          const statusColors: Record<string, string> = {
            active: "#16a34a", review: "#d97706", completed: "#2563eb", paused: "#9b988f", overdue: "#dc2626",
          };
          return (
            <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderTop: "1px solid #f0eee9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: statusColors[p.status] || "#9b988f" }} />
                <span style={{ color: "#3d3a33" }}>{p.name}</span>
              </div>
              <span style={{ color: "#9b988f", fontSize: 11 }}>{p.amount}</span>
            </div>
          );
        })}

        {match.rate && (
          <div style={{ marginTop: 8, padding: "6px 8px", background: "#f7f6f3", borderRadius: 4, color: "#9b988f", fontSize: 11 }}>
            Rate: <span style={{ color: "#3d3a33" }}>{match.rate}</span>
          </div>
        )}
      </div>
    );
  },
};
