import type { Block } from "./types";

// ── Core calculations ──

export function getDaysLeft(due: string | null): number | null {
  if (!due) return null;
  const d = new Date(due + "T00:00:00");
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}

export type DueUrgency = "normal" | "soon" | "urgent" | "overdue" | "none";

export function getDueUrgency(due: string | null): DueUrgency {
  const days = getDaysLeft(due);
  if (days === null) return "none";
  if (days < 0) return "overdue";
  if (days <= 3) return "urgent";
  if (days <= 7) return "soon";
  return "normal";
}

// ── Formatting ──

export function formatDueDate(due: string | null): string {
  if (!due) return "—";
  const d = new Date(due + "T00:00:00");
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDueShort(due: string | null): string {
  if (!due) return "—";
  const d = new Date(due + "T00:00:00");
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getDueLabel(due: string | null): string {
  const days = getDaysLeft(due);
  if (days === null) return "—";
  if (days < -1) return `${Math.abs(days)}d overdue`;
  if (days === -1) return "1d overdue";
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days <= 14) return `${days}d left`;
  return formatDueShort(due);
}

// ── Colors ──

export function getDueColor(due: string | null): string {
  const urgency = getDueUrgency(due);
  switch (urgency) {
    case "overdue": return "#c24b38";
    case "urgent": return "#c24b38";
    case "soon": return "#c89360";
    case "normal": return "#5a9a3c";
    case "none": return "var(--ink-300)";
  }
}

export function getDueBg(due: string | null): string {
  const urgency = getDueUrgency(due);
  switch (urgency) {
    case "overdue": return "rgba(194,75,56,0.06)";
    case "urgent": return "rgba(194,75,56,0.04)";
    case "soon": return "rgba(200,147,96,0.04)";
    case "normal": return "rgba(90,154,60,0.04)";
    case "none": return "var(--warm-100)";
  }
}

// ── Scanning blocks for nearest deadline ──

export function getNearestDeadline(blocks: Block[]): { date: string; label: string } | null {
  let nearest: string | null = null;
  let nearestLabel = "";

  for (const block of blocks) {
    // Deliverable due dates
    if (block.deliverableData?.dueDate) {
      const raw = block.deliverableData.dueDate;
      // Try to parse — could be "Apr 15" or "2026-04-15"
      const iso = parseFlexibleDate(raw);
      if (iso && (!nearest || iso < nearest)) {
        nearest = iso;
        nearestLabel = block.deliverableData.title;
      }
    }

    // Deadline blocks
    if (block.deadlineData?.due) {
      const iso = block.deadlineData.due;
      if (!nearest || iso < nearest) {
        nearest = iso;
        nearestLabel = block.deadlineData.title;
      }
    }
  }

  if (!nearest) return null;
  return { date: nearest, label: nearestLabel };
}

// Parse various date formats to ISO string
function parseFlexibleDate(input: string): string | null {
  // Already ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;

  // Try native parsing
  const d = new Date(input);
  if (!isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }

  return null;
}

// ── Warning check ──

export function shouldShowWarning(due: string | null): boolean {
  const days = getDaysLeft(due);
  if (days === null) return false;
  return days <= 7;
}

// ── Quick date helpers (for date picker) ──

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getQuickDates(): { label: string; date: string }[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const in2Weeks = new Date(now);
  in2Weeks.setDate(in2Weeks.getDate() + 14);

  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return [
    { label: "Today", date: toISODate(now) },
    { label: "Tomorrow", date: toISODate(tomorrow) },
    { label: "Next week", date: toISODate(nextWeek) },
    { label: "In 2 weeks", date: toISODate(in2Weeks) },
    { label: "Next month", date: toISODate(nextMonth) },
  ];
}
