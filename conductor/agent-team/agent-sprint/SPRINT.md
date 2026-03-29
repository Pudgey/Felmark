# Sprint: Wire Workspace Home into Dashboard

**Created**: 2026-03-29
**Goal**: When a freelancer clicks a workspace header, show the Workspace Home dashboard. Clicking a project card from the Workspace Home opens that project in the editor.
**Status**: Complete

---

## Context

The Workspace Home prototype lives in `conductor/missions/WORKSPACE_HOME_CONCEPT.md` as a standalone component with inline styles. The current behavior: clicking a workspace header in the sidebar just toggles its project list open/closed. We want to add a third view mode to the editor area:

1. **No active tab** → TerminalWelcome (already exists)
2. **Workspace selected, no project** → WorkspaceHome (NEW)
3. **Project selected** → Block editor (already exists)

---

## Tasks

### T-001: Create WorkspaceHome component + CSS module
**Files**: New `dashboard/src/components/workspace/WorkspaceHome.tsx` + `WorkspaceHome.module.css`
**What**:
- Convert prototype inline styles → CSS module
- Remove `<link>` font imports and duplicate `:root` vars
- Accept props: `workspace: Workspace`, `onSelectProject: (project, client) => void`, `onNewTab: () => void`
- Wire project card clicks to `onSelectProject`
- Wire "Quick note" action to `onNewTab`
- Use `requestAnimationFrame` ref cleanup for revenue animation
- Workspace notes as controlled `useState` (local, not persisted)
**Estimate**: Medium

### T-002: Add view mode state to page.tsx
**Files**: Modify `dashboard/src/app/page.tsx`
**What**:
- Add `activeWorkspaceId` state (string | null)
- When `toggleWorkspace` is called AND workspace is being opened (not collapsed), set `activeWorkspaceId` to that workspace ID and clear `activeProject` / deactivate all tabs
- When `selectProject` is called, clear `activeWorkspaceId` (project takes over)
- When a tab is clicked, clear `activeWorkspaceId`
- Pass `activeWorkspaceId` and `onSelectWorkspace` to Editor
**Estimate**: Small

### T-003: Wire Editor to render WorkspaceHome
**Files**: Modify `dashboard/src/components/editor/Editor.tsx`
**What**:
- Import `WorkspaceHome`
- Add `activeWorkspaceId?: string` and `onSelectProject` to EditorProps
- Update render logic:
  - If `activeWorkspaceId` is set → render `<WorkspaceHome>` with that workspace's data
  - Else if no active tab → render `<TerminalWelcome>`
  - Else → render block editor
- Pass `onSelectProject` through so project cards open the doc
**Estimate**: Small

### T-004: Update sidebar workspace click behavior
**Files**: Modify `dashboard/src/components/sidebar/Sidebar.tsx`, `dashboard/src/app/page.tsx`
**What**:
- Add `onSelectWorkspace: (wsId: string) => void` prop to Sidebar
- Clicking workspace header: if closed → open it AND call `onSelectWorkspace(ws.id)`. If already open → just toggle closed.
- Visual: highlight the active workspace header when its home is shown (new `.wsHeadActive` style)
**Estimate**: Small

### T-005: Build + lint verification
**Files**: None (verification only)
**What**:
- `npm run build` passes
- `npm run lint` has no new errors
- Test flow: click workspace → see home → click project card → editor opens → click workspace header again → back to home
**Estimate**: Small

---

## Execution Order

```
T-001 (component)
  ↓
T-002 (state) + T-004 (sidebar) — can run in parallel
  ↓
T-003 (editor wiring) — depends on T-001 + T-002
  ↓
T-005 (verify)
```

---

## Files Touched

| File | Action |
|------|--------|
| `src/components/workspace/WorkspaceHome.tsx` | NEW |
| `src/components/workspace/WorkspaceHome.module.css` | NEW |
| `src/app/page.tsx` | MODIFY — add activeWorkspaceId state + handlers |
| `src/components/editor/Editor.tsx` | MODIFY — add WorkspaceHome render path |
| `src/components/sidebar/Sidebar.tsx` | MODIFY — add onSelectWorkspace + active style |
| `src/components/sidebar/Sidebar.module.css` | MODIFY — add .wsHeadActive style |

**Total**: 2 new + 4 modified = 6 files (at limit — no scope creep)

---

## Out of Scope
- Activity feed with real data (hardcoded seed for now)
- Workspace notes persistence (local state only)
- Client details editing
- Revenue from Stripe/invoices (computed from project amounts)
- Quick action buttons beyond "Quick note" (others are placeholder)
