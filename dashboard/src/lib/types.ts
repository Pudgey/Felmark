export type BlockType =
  | "paragraph"
  | "h1"
  | "h2"
  | "h3"
  | "bullet"
  | "numbered"
  | "todo"
  | "quote"
  | "code"
  | "callout"
  | "divider"
  | "graph"
  | "deliverable"
  | "money";

export type GraphType = "bar" | "line" | "donut" | "hbar" | "sparkline" | "area" | "metrics";

export interface GraphBlockData {
  graphType: GraphType;
  title: string;
  data: unknown;
  height?: number;
}

export type DeliverableStatus = "todo" | "in-progress" | "review" | "changes" | "approved";

export interface DeliverableFile {
  id: string;
  name: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface DeliverableComment {
  id: string;
  user: string;
  avatar: string;
  color: string;
  text: string;
  time: string;
}

export interface DeliverableApproval {
  user: string;
  avatar: string;
  color: string;
  status: "approved" | "pending";
  time: string | null;
}

export interface DeliverableData {
  title: string;
  description: string;
  status: DeliverableStatus;
  assignee: string;
  assigneeAvatar: string;
  assigneeColor: string;
  dueDate: string;
  files: DeliverableFile[];
  comments: DeliverableComment[];
  approvals: DeliverableApproval[];
}

export type MoneyBlockType = "rate-calc" | "pay-schedule" | "expense" | "milestone" | "tax" | "payment";

export interface MoneyBlockData {
  moneyType: MoneyBlockType;
  data: unknown;
}

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  checked: boolean;
  graphData?: GraphBlockData;
  deliverableData?: DeliverableData;
  moneyData?: MoneyBlockData;
}

export interface BlockTypeInfo {
  type: BlockType;
  label: string;
  icon: string;
  desc: string;
  section: "Basic" | "Blocks";
  shortcut: string;
}

export type ProjectStatus = "active" | "review" | "completed" | "paused" | "overdue";

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  due: string;
  daysLeft: number | null;
  amount: string;
  progress: number;
  pinned: boolean;
}

export interface Workspace {
  id: string;
  client: string;
  avatar: string;
  avatarBg: string;
  open: boolean;
  lastActive: string;
  contact?: string;
  rate?: string;
  personal?: boolean;
  projects: Project[];
}

export type WorkspaceTemplate = "blank" | "proposal" | "meeting" | "brief" | "retainer" | "invoice";

export interface Tab {
  id: string;
  name: string;
  client: string;
  active: boolean;
}

export interface ArchivedProject {
  project: Project;
  workspaceId: string;
  workspaceName: string;
  archivedAt: string;
}

export interface StatusInfo {
  color: string;
  label: string;
}
