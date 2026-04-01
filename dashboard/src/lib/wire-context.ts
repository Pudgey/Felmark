import type { Workstation } from "./types";

export interface WireServiceTier {
  name: string;
  price: number;
  unit: string;
}

export interface WireService {
  id: string;
  name: string;
  category: string;
  tiers: WireServiceTier[];
  timesUsed: number;
  totalEarned: number;
}

/**
 * Build a concise context string from workspaces and services
 * for the Wire AI to generate personalized signals.
 * Kept under ~1000 tokens.
 */
export function buildWireContext(
  workstations: Workstation[],
  services: WireService[]
): string {
  const parts: string[] = [];

  // Services summary
  if (services.length > 0) {
    parts.push("SERVICES:");
    for (const s of services) {
      const tierSummary = s.tiers
        .map((t) => `${t.name} $${t.price}/${t.unit}`)
        .join(", ");
      parts.push(
        `- ${s.name} (${s.category}): ${tierSummary} | Used ${s.timesUsed}x, earned $${s.totalEarned.toLocaleString()}`
      );
    }
  } else {
    parts.push("SERVICES: None configured yet.");
  }

  // Workspaces / clients summary
  if (workstations.length > 0) {
    parts.push("\nCLIENTS:");
    for (const w of workstations) {
      const projectCount = w.projects.length;
      const statuses = w.projects.map((p) => p.status);
      const activeCount = statuses.filter((s) => s === "active").length;
      const reviewCount = statuses.filter((s) => s === "review").length;
      const completedCount = statuses.filter((s) => s === "completed").length;
      const overdueCount = statuses.filter((s) => s === "overdue").length;

      let statusStr = `${projectCount} project${projectCount !== 1 ? "s" : ""}`;
      const details: string[] = [];
      if (activeCount > 0) details.push(`${activeCount} active`);
      if (reviewCount > 0) details.push(`${reviewCount} in review`);
      if (completedCount > 0) details.push(`${completedCount} completed`);
      if (overdueCount > 0) details.push(`${overdueCount} overdue`);
      if (details.length > 0) statusStr += ` (${details.join(", ")})`;

      const extra: string[] = [];
      if (w.rate) extra.push(`rate: ${w.rate}`);
      if (w.contact) extra.push(`contact: ${w.contact}`);

      parts.push(
        `- ${w.client}: ${statusStr}${extra.length ? " | " + extra.join(", ") : ""}`
      );
    }
  } else {
    parts.push("\nCLIENTS: No workstations created yet.");
  }

  // Overall stats
  const totalProjects = workstations.reduce((s, w) => s + w.projects.length, 0);
  const totalRevenue = services.reduce((s, svc) => s + svc.totalEarned, 0);
  const avgRate = services.length > 0
    ? Math.round(
        services.reduce(
          (s, svc) => s + svc.tiers.reduce((ts, t) => ts + t.price, 0) / svc.tiers.length,
          0
        ) / services.length
      )
    : 0;

  parts.push(`\nSTATS: ${workstations.length} clients, ${totalProjects} projects, ${services.length} services, $${totalRevenue.toLocaleString()} total earned, ~$${avgRate} avg service price`);
  parts.push(`DATE: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`);

  return parts.join("\n");
}
