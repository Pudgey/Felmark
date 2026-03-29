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
  | "divider";

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  checked: boolean;
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
