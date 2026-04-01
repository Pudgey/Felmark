import type { Workstation, Project, Block, Tab, ArchivedProject } from "@/lib/types";
import type { Comment } from "@/components/comments/CommentPanel";
import type { BlockActivity } from "@/components/activity/ActivityMargin";

// ── Forge state shape ──
export interface ForgeState {
  workstations: Workstation[];
  tabs: Tab[];
  activeProject: string;
  blocksMap: Record<string, Block[]>;
  archived: ArchivedProject[];
  comments: Comment[];
  activitiesMap: Record<string, BlockActivity[]>;
}

// ── Forge context — who's calling and from where ──
export type ForgeSource = "dashboard" | "terminal" | "portal" | "api" | "ai";

export interface ForgeContext {
  source: ForgeSource;
  userId?: string;
}

// ── Forge result ──
export type ForgeResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ── State updater — forge services call this to mutate state ──
// This abstracts over React setState today, Supabase tomorrow
export type StateUpdater = {
  getState: () => ForgeState;
  setWorkstations: (fn: (prev: Workstation[]) => Workstation[]) => void;
  setTabs: (fn: (prev: Tab[]) => Tab[]) => void;
  setActiveProject: (id: string) => void;
  setBlocksMap: (fn: (prev: Record<string, Block[]>) => Record<string, Block[]>) => void;
  setArchived: (fn: (prev: ArchivedProject[]) => ArchivedProject[]) => void;
  setComments: (fn: (prev: Comment[]) => Comment[]) => void;
  setActivitiesMap: (fn: (prev: Record<string, BlockActivity[]>) => Record<string, BlockActivity[]>) => void;
};
