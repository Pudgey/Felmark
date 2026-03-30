# Launchpad — App Navigation Hub

**Created**: 2026-03-29
**Type**: Concept / Pre-Mission
**Milestone**: M1

---

## Concept

The Launchpad is a Spotlight-style overlay triggered by the grid icon in the Rail (or `⌘⇧Space`). It's the central navigation hub — jump to any screen, recent document, workspace, pinned item, or tool from one place. Replaces the redundant workspaces grid icon with something distinctly useful.

**Logo** = Dashboard Home (navigate to business overview)
**Grid icon** = Launchpad (overlay to jump anywhere)

---

## Layout

```
┌──────────────────────────────────────────┐
│ [🔍] Jump to anything...          [esc]  │
├──────────────────────────────────────────┤
│ SCREENS                                  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │⊞Dashboard│ │◆Pipeline │ │◇Calendar │ │
│ │Overview  │ │Deals     │ │Schedule  │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │$Services │ │§Templates│ │↗The Wire │ │
│ │Offerings │ │Contracts │ │Signals ᴾᴿᴼ│ │
│ └──────────┘ └──────────┘ └──────────┘ │
│                                          │
│ TOOLS                                    │
│ [◎ Search ⌘/] [❯ Command ⌘K] [⚙ ⌘,]   │
│                                          │
│ WORKSPACES                               │
│ [M Meridian •2] [N Nora] [B Bolt •1] [L]│
│                                          │
│ RECENT                                   │
│ ☰ Brand Guidelines v2 — Meridian  2m ██ │
│ ◆ Course Landing Page — Nora      1h    │
│ $ Invoice #047 — Meridian         3h    │
│ ☰ App Onboarding UX — Bolt   Yest ██░  │
│                                          │
│ PINNED                                   │
│ [§ Service Agreement] [⊗ Rate Calc] [$] │
│                                          │
│ ◇ Felmark            ↑↓ ⏎ esc          │
└──────────────────────────────────────────┘
```

---

## Sections

### Search
- "Jump to anything..." — filters all sections simultaneously
- Escape clears search, then closes overlay
- Auto-focused on open

### Screens (3-column grid)
- Dashboard, Pipeline, Calendar, Services, Templates, The Wire
- Each: icon tile, name, description, keyboard shortcut (shown on hover)
- PRO badge on premium features
- Ember highlight on hover

### Tools (compact row)
- Search, Command Palette, Settings
- Each: icon, name, shortcut
- Clicking Search opens full search page, Command opens ⌘K palette

### Workspaces (quick switch row)
- All workspaces as compact avatars with name + unread badge
- Click → navigate to workspace home

### Recent (list)
- Last 5 opened documents/proposals/invoices
- Each: type icon (colored), name, workspace, type tag, progress bar (if applicable), status, relative timestamp
- Searchable by name or workspace

### Pinned (card row)
- User-pinned items: templates, tools, services
- Quick access to frequently used items

---

## Integration

### Trigger
- Grid icon in Rail → opens Launchpad overlay
- `⌘⇧Space` keyboard shortcut (future)
- Clicking outside or pressing Escape closes it

### Actions
- Screen tile click → `onItemClick(screenId)` → navigates to that view, closes launchpad
- Workspace click → `onSelectWorkspaceHome(wsId)` → opens workspace home
- Recent item click → opens that document/project tab
- Tool click → opens search page, command palette, or settings
- Pinned item click → navigates to the pinned resource

### What It Replaces
The grid icon currently fires `onItemClick("workspaces")` which is the same as the sidebar. Now:
- **Logo** = home (Dashboard Home view)
- **Grid** = launchpad (overlay navigation hub)

---

## Review Notes

### Must Fix Before Integration
- Inline styles → CSS modules
- Remove duplicate `:root` vars and `<link>` font imports
- TypeScript types
- Keyboard navigation (↑↓ across sections, Enter to select)
- No focus trap on overlay
- `WORKSPACES` data should come from props, not hardcoded

### Design Decisions
- Overlay (not full page) — appears on top of current context, closes fast
- 3-column tile grid for screens — visual, scannable, discoverable
- Workspaces as compact avatars — this isn't the workspace list (sidebar does that), it's a quick-switch
- Recents are searchable — "jump to anything" means everything is findable
- Pinned section is user-customizable (future)

---

## Prototype Code

### Data

```jsx
const SCREENS = [
  { id: "dashboard", name: "Dashboard", icon: "⊞", shortcut: "⌘1", desc: "Overview & stats", section: "core" },
  { id: "pipeline", name: "Pipeline", icon: "◆", shortcut: "⌘2", desc: "Deals & opportunities", section: "core" },
  { id: "calendar", name: "Calendar", icon: "◇", shortcut: "⌘3", desc: "Schedule & events", section: "core" },
  { id: "services", name: "Services", icon: "$", shortcut: "⌘4", desc: "Your offerings", section: "core" },
  { id: "templates", name: "Templates", icon: "§", shortcut: "⌘5", desc: "Contracts & proposals", section: "core" },
  { id: "wire", name: "The Wire", icon: "↗", shortcut: "⌘6", desc: "Industry signals", section: "core", pro: true },
  { id: "search", name: "Search", icon: "◎", shortcut: "⌘/", desc: "Find anything", section: "tools" },
  { id: "command", name: "Command Palette", icon: "❯", shortcut: "⌘K", desc: "Quick actions", section: "tools" },
  { id: "settings", name: "Settings", icon: "⚙", shortcut: "⌘,", desc: "Preferences", section: "tools" },
];

const RECENTS = [
  { id: "r1", name: "Brand Guidelines v2", workspace: "Meridian Studio", type: "doc", icon: "☰", color: "#7c8594", time: "2m ago", progress: 65 },
  { id: "r2", name: "Course Landing Page Proposal", workspace: "Nora Kim", type: "proposal", icon: "◆", color: "#a08472", time: "1h ago", progress: null },
  { id: "r3", name: "Invoice #047", workspace: "Meridian Studio", type: "invoice", icon: "$", color: "#7c8594", time: "3h ago", progress: null, status: "sent" },
  { id: "r4", name: "App Onboarding UX", workspace: "Bolt Fitness", type: "doc", icon: "☰", color: "#8a7e63", time: "Yesterday", progress: 70 },
  { id: "r5", name: "Typography Scale v3", workspace: "Meridian Studio", type: "doc", icon: "☰", color: "#7c8594", time: "Yesterday", progress: 45 },
];

const PINNED = [
  { id: "p1", name: "Freelance Service Agreement", type: "template", icon: "§", color: "#b07d4f" },
  { id: "p2", name: "Rate Calculator", type: "tool", icon: "⊗", color: "#5a9a3c" },
  { id: "p3", name: "Brand Identity — Pricing", type: "service", icon: "$", color: "#b07d4f" },
];

const WORKSPACES = [
  { id: "w1", name: "Meridian Studio", avatar: "M", color: "#7c8594", unread: 2 },
  { id: "w2", name: "Nora Kim", avatar: "N", color: "#a08472", unread: 0 },
  { id: "w3", name: "Bolt Fitness", avatar: "B", color: "#8a7e63", unread: 1 },
  { id: "w4", name: "Luna Boutique", avatar: "L", color: "#7c6b9e", unread: 0 },
];
```

### Component

```jsx
export default function Launchpad() {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [hoveredScreen, setHoveredScreen] = useState(null);
  const [hoveredRecent, setHoveredRecent] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const filteredScreens = search
    ? SCREENS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase()))
    : SCREENS;

  const filteredRecents = search
    ? RECENTS.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.workspace.toLowerCase().includes(search.toLowerCase()))
    : RECENTS;

  // Full render: overlay backdrop, modal with search, screen tiles (3-col grid),
  // tools row, workspace quick-switch, recent items, pinned cards, footer with hints
}
```

### Prototype Styles

```css
/* Overlay — blurred backdrop */
.lp-overlay { position: fixed; inset: 0; background: rgba(44,42,37,0.4); backdrop-filter: blur(6px); z-index: 200; }

/* Modal — centered, rounded, shadowed */
.lp { width: 680px; background: var(--parchment); border-radius: 16px; box-shadow: 0 16px 64px rgba(0,0,0,0.15); max-height: calc(100vh - 120px); }

/* Screen tiles — 3-column grid */
.lp-tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.lp-tile { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; border: 1px solid transparent; }
.lp-tile:hover { background: var(--warm-50); border-color: var(--warm-200); }
.lp-tile.hovered { background: var(--ember-bg); border-color: rgba(176,125,79,0.1); }

/* Tools — compact row */
.lp-tools { display: flex; gap: 4px; }
.lp-tool { flex: 1; display: flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 6px; }

/* Workspace quick-switch — avatar row */
.lp-ws-row { display: flex; gap: 4px; }
.lp-ws { flex: 1; display: flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 6px; }

/* Recent items — list with type icons, progress, timestamps */
.lp-recent { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 7px; }

/* Pinned — card row */
.lp-pinned { display: flex; gap: 6px; }
.lp-pin { flex: 1; display: flex; align-items: center; gap: 7px; padding: 7px 12px; border-radius: 6px; border: 1px solid var(--warm-200); background: #fff; }
```
