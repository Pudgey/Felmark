# Mission: Workspace — The 95% Surface

> **Status**: Planning
> **Goal**: Make Workspace a fully self-sufficient freelancer operating surface. 95% of freelancers never need to leave it. The top 5% who want deep client editing, block editor, Forge Paper — that's Workstation.

## The Split

| | Workspace | Workstation |
|---|---|---|
| **Who** | 95% of freelancers | Top 5% power users |
| **Vibe** | ClickUp meets Wave | Obsidian meets Warp |
| **Core job** | Get stuff done | Go deep on a client |
| **Layout** | Own surface, own sidebar, own chrome | Sidebar + tabs + block editor |
| **Task mgmt** | Native — list, board, timeline | None (tasks live in Workspace) |
| **Invoicing** | Quick Invoice inline | Full invoice in Finance rail |
| **Messaging** | Quick Message drawer | Full Conversation panel |
| **Time tracking** | Floating timer bar | Per-block time tracking |
| **Client view** | Client Pulse panel (summary) | Full Workstation deep dive |
| **Command palette** | Action Bar (⌘K) | Shared |

## Architecture

Workspace lives at `workspace-page/`. It is NOT a child of Editor. It renders directly from `page.tsx` when `railActive === "workspace"`. No sidebar, no tab bar, no editor chrome.

```
Rail → "workspace" click
  └── page.tsx renders <WorkspacePage /> (no Sidebar, no Editor)
       ├── WorkspaceSidebar (clients + projects — its own sidebar)
       ├── WorkspaceMain
       │   ├── ProjectHeader (stats, actions)
       │   ├── Toolbar (views, filters, grouping)
       │   └── View area
       │       ├── ListView (grouped tasks with subtasks)
       │       ├── BoardView (kanban columns)
       │       └── TimelineView (gantt — future)
       ├── DetailPanel OR ClientPulse (right side)
       ├── FloatingTimer (bottom bar, persists across views)
       ├── QuickInvoice (slides over detail panel)
       └── MessageDrawer (slides in from right)
```

## Implementation Phases

### Phase 1: Core Shell (DONE)
- [x] WorkspacePage component with sidebar, task list, board view, detail panel
- [x] Rail icon + routing (bypasses Editor entirely)
- [x] CSS modules

### Phase 2: Floating Timer
**Source**: `Prototype/WorkspaceUIKit1.jsx` → FloatingTimer
**Target**: `workspace-page/timer/FloatingTimer.tsx`

- Timer bar docked to bottom of WorkspacePage (above footer)
- States: idle, running (pulse + counter), paused (resume/discard/log)
- Minimize to floating pill (fixed position, bottom-right)
- Attached to active task — shows task name + client
- "Stop & Log" records hours to the task's `logged` field
- Timer persists across view switches (list → board → timeline)
- Timer state lives in WorkspacePage (not in each view)

### Phase 3: Client Pulse Panel
**Source**: `Prototype/WorkspaceUIKit1.jsx` → ClientPulse
**Target**: `workspace-page/pulse/ClientPulse.tsx`

- Replaces detail panel when no task is selected
- Shows: health ring, earned/owed/projects/response time, revenue bar, key dates, notes
- Tabs: Overview, Activity, Deadlines
- Quick actions: Message, Invoice, + Project
- Reads from the active client in the sidebar

### Phase 4: Quick Message Drawer
**Source**: `Prototype/WorkspaceUIKit1.jsx` → MessageDrawer
**Target**: `workspace-page/messages/MessageDrawer.tsx`

- Slides in from right edge (overlays detail panel)
- Triggered by: "Messages" button in project header, or ✉ in Client Pulse
- Shows conversation with active client's contact
- Inline send, online status, unread indicators
- "↗" button opens full conversation (navigates to Workstation conversation panel — future)

### Phase 5: Quick Invoice
**Source**: `Prototype/WorkspaceUIKit1.jsx` → QuickInvoice
**Target**: `workspace-page/invoice/QuickInvoice.tsx`

- Slides over detail panel (same slot as Client Pulse)
- Pre-filled: client from sidebar, project from header, hours from logged time
- Editable line items, auto-calculated totals + Felmark fee
- Settings: due date (Net 15/30), payment method
- Send → success state → done
- "Save Draft" keeps it in Finance rail for later

### Phase 6: Action Bar (⌘K)
**Source**: `Prototype/WorkspaceUIKit1.jsx` → ActionBar
**Target**: `workspace-page/action-bar/ActionBar.tsx`

- Full-screen overlay triggered by ⌘K
- Categories: Actions, Clients, Projects, Invoices
- Natural language: "create invoice for Meridian", "log 2 hours", "send message to Sarah"
- Arrow key navigation, Enter to execute
- ESC to close
- Shared between Workspace and Workstation (future: mount at page.tsx level)

### Phase 7: Polish & Interactivity
- Task drag-and-drop (list reorder + board column move)
- Inline task creation (click "+ Task" → new row appears inline)
- Status/priority dropdowns on task cells
- Due date picker on task cells
- Assignee picker (future: multi-user)
- Keyboard shortcuts (n = new task, / = filter, g+l = list, g+b = board)

### Phase 8: Real Data Integration (Post-MVP)
- Connect to Supabase for persistent tasks
- Sync client data between Workspace and Workstation
- Timer logs write to time_entries table
- Invoice data flows to Finance surface
- Messages connect to real messaging backend

## File Structure (Target)

```
workspace-page/
├── WorkspacePage.tsx           ← Shell: sidebar + main + panels
├── WorkspacePage.module.css    ← All base styles
├── MANIFEST.md
├── timer/
│   ├── FloatingTimer.tsx
│   └── FloatingTimer.module.css
├── pulse/
│   ├── ClientPulse.tsx
│   └── ClientPulse.module.css
├── messages/
│   ├── MessageDrawer.tsx
│   └── MessageDrawer.module.css
├── invoice/
│   ├── QuickInvoice.tsx
│   └── QuickInvoice.module.css
└── action-bar/
    ├── ActionBar.tsx
    └── ActionBar.module.css
```

## Success Criteria

A freelancer opens Felmark, lands on Workspace, and can:
1. See all clients and projects at a glance (sidebar)
2. View tasks in list or board mode, grouped by status or priority
3. Click a task → see detail panel with properties, time, subtasks, comments
4. Start a timer on any task, minimize it, keep working
5. Click a client → see their pulse (earnings, deadlines, health)
6. Send a quick message to any client without leaving
7. Create and send an invoice without leaving
8. Use ⌘K to do anything by typing

No rail switching. No mode switching. No "let me go to the other screen." Everything a freelancer needs, in one place.

## What Workspace Does NOT Do

- Block editor (that's Workstation)
- Forge Paper (that's its own rail)
- Deep document editing (Workstation)
- Template management (Templates rail)
- Finance dashboard with charts (Finance rail)
- The Wire intelligence (Wire rail)

Workspace is the cockpit. Workstation is the engine room.
