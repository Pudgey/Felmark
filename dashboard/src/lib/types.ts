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
  | "money"
  | "table"
  | "accordion"
  | "math"
  | "gallery"
  | "swatches"
  | "beforeafter"
  | "bookmark"
  | "deadline";

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

export interface TableBlockData {
  rows: string[][];
}

export interface AccordionItem {
  title: string;
  content: string;
}

export interface AccordionBlockData {
  items: AccordionItem[];
}

export interface MathVariable {
  name: string;
  value: string;
}

export interface MathBlockData {
  formula: string;
  variables: MathVariable[];
  result: string;
}

export interface GalleryImage {
  icon: string;
  caption: string;
  meta: string;
}

export interface GalleryBlockData {
  images: GalleryImage[];
}

export interface SwatchColor {
  name: string;
  hex: string;
}

export interface SwatchesBlockData {
  colors: SwatchColor[];
}

export interface BeforeAfterBlockData {
  beforeLabel: string;
  afterLabel: string;
}

export interface BookmarkBlockData {
  url: string;
  title: string;
  description: string;
  source: string;
  favicon: string;
}

export interface DeadlineBlockData {
  title: string;
  due: string | null;
  assignee: string;
  completed: boolean;
}

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  checked: boolean;
  graphData?: GraphBlockData;
  deliverableData?: DeliverableData;
  moneyData?: MoneyBlockData;
  tableData?: TableBlockData;
  accordionData?: AccordionBlockData;
  mathData?: MathBlockData;
  galleryData?: GalleryBlockData;
  swatchesData?: SwatchesBlockData;
  beforeAfterData?: BeforeAfterBlockData;
  bookmarkData?: BookmarkBlockData;
  deadlineData?: DeadlineBlockData;
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
  due: string | null;        // ISO date string (e.g. "2026-04-03") or null
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
