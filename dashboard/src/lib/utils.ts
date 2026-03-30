import type { Block, WorkspaceTemplate } from "./types";

export const uid = () => Math.random().toString(36).slice(2, 10);

/** Compute days remaining from an ISO date string. Positive = future, negative = overdue, null = no date. */
export function daysLeft(due: string | null): number | null {
  if (!due) return null;
  const d = new Date(due + "T00:00:00");
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}

/** Format an ISO date string to a short display label like "Apr 3" */
export function formatDue(due: string | null): string {
  if (!due) return "\u2014";
  const d = new Date(due + "T00:00:00");
  if (isNaN(d.getTime())) return "\u2014";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Get the due label with relative context: "5 days left", "3 days overdue", "Due Apr 3" */
export function getDueLabelFromDate(due: string | null): string {
  const dl = daysLeft(due);
  if (dl === null) return "\u2014";
  if (dl < 0) return `${Math.abs(dl)}d overdue`;
  if (dl === 0) return "Due today";
  if (dl <= 14) return `${dl}d left`;
  return formatDue(due);
}

/** Get due color based on days remaining */
export function getDueColorFromDate(due: string | null): string {
  const dl = daysLeft(due);
  if (dl === null) return "var(--ink-300)";
  if (dl < 0) return "#c24b38";
  if (dl <= 3) return "#c24b38";
  if (dl <= 7) return "var(--ember)";
  return "var(--ink-400)";
}

export function makeBlocks(template: WorkspaceTemplate, clientName: string): { blocks: Block[]; projectName: string } {
  switch (template) {
    case "proposal":
      return {
        projectName: `${clientName} — Proposal`,
        blocks: [
          { id: uid(), type: "h1", content: `Proposal for ${clientName}`, checked: false },
          { id: uid(), type: "callout", content: `Client: ${clientName} — Date: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`, checked: false },
          { id: uid(), type: "h2", content: "Scope of Work", checked: false },
          { id: uid(), type: "todo", content: "Deliverable 1", checked: false },
          { id: uid(), type: "todo", content: "Deliverable 2", checked: false },
          { id: uid(), type: "todo", content: "Deliverable 3", checked: false },
          { id: uid(), type: "divider", content: "", checked: false },
          { id: uid(), type: "h2", content: "Timeline", checked: false },
          { id: uid(), type: "bullet", content: "Week 1 — Discovery & Research", checked: false },
          { id: uid(), type: "bullet", content: "Week 2 — Initial Concepts", checked: false },
          { id: uid(), type: "bullet", content: "Week 3 — Client Review", checked: false },
          { id: uid(), type: "bullet", content: "Week 4 — Final Delivery", checked: false },
          { id: uid(), type: "divider", content: "", checked: false },
          { id: uid(), type: "h2", content: "Pricing", checked: false },
          { id: uid(), type: "paragraph", content: "", checked: false },
          { id: uid(), type: "divider", content: "", checked: false },
          { id: uid(), type: "h2", content: "Terms", checked: false },
          { id: uid(), type: "paragraph", content: "50% deposit due upon acceptance. Remaining 50% due upon final delivery. Two rounds of revisions included.", checked: false },
        ],
      };
    case "meeting":
      return {
        projectName: `${clientName} — Meeting Notes`,
        blocks: [
          { id: uid(), type: "h1", content: `Meeting with ${clientName}`, checked: false },
          { id: uid(), type: "callout", content: `Date: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} — Attendees: `, checked: false },
          { id: uid(), type: "h2", content: "Agenda", checked: false },
          { id: uid(), type: "bullet", content: "", checked: false },
          { id: uid(), type: "divider", content: "", checked: false },
          { id: uid(), type: "h2", content: "Notes", checked: false },
          { id: uid(), type: "paragraph", content: "", checked: false },
          { id: uid(), type: "divider", content: "", checked: false },
          { id: uid(), type: "h2", content: "Action Items", checked: false },
          { id: uid(), type: "todo", content: "", checked: false },
        ],
      };
    case "brief":
      return {
        projectName: `${clientName} — Project Brief`,
        blocks: [
          { id: uid(), type: "h1", content: `Project Brief — ${clientName}`, checked: false },
          { id: uid(), type: "h2", content: "Overview", checked: false },
          { id: uid(), type: "paragraph", content: "", checked: false },
          { id: uid(), type: "h2", content: "Goals", checked: false },
          { id: uid(), type: "bullet", content: "", checked: false },
          { id: uid(), type: "h2", content: "Target Audience", checked: false },
          { id: uid(), type: "paragraph", content: "", checked: false },
          { id: uid(), type: "h2", content: "Deliverables", checked: false },
          { id: uid(), type: "todo", content: "", checked: false },
          { id: uid(), type: "h2", content: "Timeline & Budget", checked: false },
          { id: uid(), type: "paragraph", content: "", checked: false },
          { id: uid(), type: "h2", content: "References", checked: false },
          { id: uid(), type: "paragraph", content: "", checked: false },
        ],
      };
    case "retainer":
      return {
        projectName: `${clientName} — Retainer`,
        blocks: [
          { id: uid(), type: "h1", content: `Monthly Retainer — ${clientName}`, checked: false },
          { id: uid(), type: "callout", content: `Client: ${clientName} — Start date: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`, checked: false },
          { id: uid(), type: "h2", content: "Monthly Scope", checked: false },
          { id: uid(), type: "paragraph", content: "", checked: false },
          { id: uid(), type: "h2", content: "Hours", checked: false },
          { id: uid(), type: "bullet", content: "Included hours: 20h/month", checked: false },
          { id: uid(), type: "bullet", content: "Overage rate: $___/hr", checked: false },
          { id: uid(), type: "h2", content: "Deliverables", checked: false },
          { id: uid(), type: "todo", content: "", checked: false },
          { id: uid(), type: "h2", content: "Billing", checked: false },
          { id: uid(), type: "paragraph", content: "Invoiced on the 1st of each month. Net 15 terms.", checked: false },
        ],
      };
    case "invoice":
      return {
        projectName: `${clientName} — Invoice`,
        blocks: [
          { id: uid(), type: "h1", content: `Invoice — ${clientName}`, checked: false },
          { id: uid(), type: "callout", content: `Date: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} — Due: Net 15`, checked: false },
          { id: uid(), type: "h2", content: "Line Items", checked: false },
          { id: uid(), type: "paragraph", content: "", checked: false },
          { id: uid(), type: "divider", content: "", checked: false },
          { id: uid(), type: "h2", content: "Terms", checked: false },
          { id: uid(), type: "paragraph", content: "Payment due within 15 days of invoice date.", checked: false },
        ],
      };
    default:
      return {
        projectName: "Untitled",
        blocks: [
          { id: uid(), type: "h1", content: "", checked: false },
          { id: uid(), type: "paragraph", content: "", checked: false },
        ],
      };
  }
}

export function cursorTo(el: HTMLElement, end: boolean) {
  setTimeout(() => {
    el.focus();
    const r = document.createRange();
    if (end) {
      r.selectNodeContents(el);
      r.collapse(false);
    } else {
      r.setStart(el, 0);
      r.collapse(true);
    }
    const s = window.getSelection();
    if (s) {
      s.removeAllRanges();
      s.addRange(r);
    }
  }, 0);
}
