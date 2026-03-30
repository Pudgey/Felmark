import type { BlockTypeInfo, Workspace, StatusInfo, ProjectStatus } from "./types";

export const BLOCK_TYPES: BlockTypeInfo[] = [
  { type: "paragraph", label: "Text", icon: "T", desc: "Plain text", section: "Basic", shortcut: "⏎" },
  { type: "h1", label: "Heading 1", icon: "H1", desc: "Large heading", section: "Basic", shortcut: "#" },
  { type: "h2", label: "Heading 2", icon: "H2", desc: "Medium heading", section: "Basic", shortcut: "##" },
  { type: "h3", label: "Heading 3", icon: "H3", desc: "Small heading", section: "Basic", shortcut: "###" },
  { type: "bullet", label: "Bullet list", icon: "•", desc: "Unordered list", section: "Basic", shortcut: "-" },
  { type: "numbered", label: "Numbered list", icon: "1.", desc: "Ordered list", section: "Basic", shortcut: "1." },
  { type: "todo", label: "To-do", icon: "☐", desc: "Checkbox", section: "Basic", shortcut: "[]" },
  { type: "quote", label: "Quote", icon: "❝", desc: "Block quote", section: "Blocks", shortcut: ">" },
  { type: "code", label: "Code", icon: "<>", desc: "Code block", section: "Blocks", shortcut: "```" },
  { type: "callout", label: "Callout", icon: "!", desc: "Callout box", section: "Blocks", shortcut: "!" },
  { type: "divider", label: "Divider", icon: "—", desc: "Horizontal rule", section: "Blocks", shortcut: "---" },
  { type: "graph", label: "Graph", icon: "▥", desc: "Insert a live chart", section: "Blocks", shortcut: "/graph" },
  { type: "deliverable", label: "Deliverable", icon: "☰", desc: "Task with files & approvals", section: "Blocks", shortcut: "/deliv" },
  { type: "money", label: "Money", icon: "$", desc: "Financial block", section: "Blocks", shortcut: "/money" },
  { type: "table", label: "Table", icon: "⊞", desc: "Editable data table", section: "Blocks", shortcut: "/table" },
  { type: "accordion", label: "Accordion", icon: "▸", desc: "Collapsible sections", section: "Blocks", shortcut: "/acc" },
  { type: "math", label: "Formula", icon: "∑", desc: "Math with variables", section: "Blocks", shortcut: "/math" },
  { type: "gallery", label: "Gallery", icon: "▦", desc: "Image grid + lightbox", section: "Blocks", shortcut: "/gallery" },
  { type: "swatches", label: "Swatches", icon: "●", desc: "Colors + contrast check", section: "Blocks", shortcut: "/color" },
  { type: "beforeafter", label: "Before/After", icon: "◐", desc: "Comparison slider", section: "Blocks", shortcut: "/ba" },
  { type: "bookmark", label: "Bookmark", icon: "\u2197", desc: "Link preview card", section: "Blocks", shortcut: "/link" },
  { type: "deadline", label: "Deadline", icon: "\u2691", desc: "Due date milestone", section: "Blocks", shortcut: "/deadline" },
  { type: "audio", label: "Audio", icon: "●", desc: "Voice memo & transcript", section: "Blocks", shortcut: "/audio" },
  { type: "ai", label: "AI Generate", icon: "◈", desc: "Generate blocks from a prompt", section: "Blocks", shortcut: "/ai" },
  { type: "comment-thread", label: "Comment Thread", icon: "💬", desc: "Discussion anchored to a block", section: "Collaboration", shortcut: "/thread" },
  { type: "mention", label: "Mention", icon: "@", desc: "Tag someone with a notification", section: "Collaboration", shortcut: "/mention" },
  { type: "question", label: "Question", icon: "?", desc: "Flag a question for the client", section: "Collaboration", shortcut: "/question" },
  { type: "feedback", label: "Feedback Request", icon: "↺", desc: "Assign a reviewer with due date", section: "Collaboration", shortcut: "/feedback" },
  { type: "decision", label: "Decision", icon: "⚖", desc: "Log a decision with context", section: "Collaboration", shortcut: "/decision" },
  { type: "poll", label: "Poll", icon: "▣", desc: "Vote between options", section: "Collaboration", shortcut: "/poll" },
  { type: "handoff", label: "Handoff", icon: "→", desc: "Mark ready for next person", section: "Collaboration", shortcut: "/handoff" },
  { type: "signoff", label: "Sign-off", icon: "✓", desc: "Lock section after approval", section: "Collaboration", shortcut: "/signoff" },
  { type: "annotation", label: "Annotation", icon: "📌", desc: "Pin comments on an image", section: "Collaboration", shortcut: "/annotate" },
];

export interface Command {
  id: string;
  label: string;
  section: "Create" | "Navigate" | "Actions";
  shortcut: string;
  icon: string;
}

export const COMMANDS: Command[] = [
  { id: "new-project", label: "New Project", section: "Create", shortcut: "⌘N", icon: "+" },
  { id: "new-proposal", label: "New Proposal", section: "Create", shortcut: "⌘⇧P", icon: "◆" },
  { id: "new-invoice", label: "New Invoice", section: "Create", shortcut: "⌘⇧I", icon: "$" },
  { id: "search", label: "Search Notes", section: "Navigate", shortcut: "⌘F", icon: "⌕" },
  { id: "switch-ws", label: "Switch Workspace", section: "Navigate", shortcut: "⌘J", icon: "⇄" },
  { id: "recent", label: "Recent Files", section: "Navigate", shortcut: "⌘E", icon: "↺" },
  { id: "export-pdf", label: "Export as PDF", section: "Actions", shortcut: "⌘⇧E", icon: "↓" },
  { id: "share", label: "Share with Client", section: "Actions", shortcut: "⌘⇧S", icon: "→" },
  { id: "duplicate", label: "Duplicate Block", section: "Actions", shortcut: "⌘D", icon: "⊞" },
];

export const STATUS: Record<ProjectStatus, StatusInfo> = {
  active: { color: "#5a9a3c", label: "Active" },
  review: { color: "#b07d4f", label: "In Review" },
  completed: { color: "#8993a1", label: "Completed" },
  paused: { color: "#9e9e93", label: "Paused" },
  overdue: { color: "#c24b38", label: "Overdue" },
};

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: "w1", client: "Meridian Studio", avatar: "M", avatarBg: "#7c8594", open: true, lastActive: "2m ago",
    projects: [
      { id: "p1", name: "Brand Guidelines v2", status: "active", due: "2026-04-03", amount: "$2,400", progress: 65, pinned: true },
      { id: "p2", name: "Website Copy", status: "review", due: "2026-04-08", amount: "$1,800", progress: 40, pinned: false },
      { id: "p3", name: "Social Media Kit", status: "completed", due: "2026-03-20", amount: "$950", progress: 100, pinned: false },
    ],
  },
  {
    id: "w2", client: "Nora Kim \u2014 Coach", avatar: "N", avatarBg: "#a08472", open: false, lastActive: "1h ago",
    projects: [
      { id: "p4", name: "Course Landing Page", status: "active", due: "2026-04-12", amount: "$3,200", progress: 25, pinned: false },
      { id: "p5", name: "Email Sequence (6x)", status: "paused", due: "2026-04-20", amount: "$1,600", progress: 10, pinned: false },
    ],
  },
  {
    id: "w3", client: "Bolt Fitness", avatar: "B", avatarBg: "#8a7e63", open: false, lastActive: "3h ago",
    projects: [
      { id: "p6", name: "App Onboarding UX", status: "overdue", due: "2026-03-25", amount: "$4,000", progress: 70, pinned: false },
      { id: "p7", name: "Monthly Blog Posts", status: "active", due: "2026-04-01", amount: "$800", progress: 15, pinned: false },
    ],
  },
  {
    id: "w4", client: "Personal", avatar: "\u2726", avatarBg: "#5c5c53", open: false, lastActive: "5h ago", personal: true,
    projects: [
      { id: "p8", name: "Portfolio Updates", status: "active", due: null, amount: "\u2014", progress: 50, pinned: false },
      { id: "p9", name: "Invoice Template", status: "completed", due: null, amount: "\u2014", progress: 100, pinned: false },
    ],
  },
];
