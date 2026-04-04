# workstation/

The Workstation is Felmark's flagship product surface — the full-featured freelancer command center. Everything a power user needs to manage clients, projects, documents, and business operations lives here.

## Core Features

| Folder | Feature | Description |
|--------|---------|-------------|
| `editor/` | **Block Editor** | Notion-style document editor with slash commands, format bar, drag-and-drop, 40+ block types, split pane, and command palette |
| `calendar/` | **Calendar** | Full calendar view with project deadlines, timeline visualization |
| `search/` | **Search** | Cross-workstation search across projects and documents |
| `pipeline/` | **Pipeline** | Kanban-style project pipeline board |
| `finance/` | **Finance** | Revenue tracking, invoicing, and financial overview |
| `wire/` | **The Wire** | Activity feed and communication stream |
| `services/` | **Services** | Service offerings and pricing management |
| `templates/` | **Templates** | Document and project templates (SaveTemplateModal, TemplatePicker, TemplatesPage) |
| `terminal-welcome/` | **Terminal Welcome** | First-run / empty-state welcome screen with stats |

## Imported By

| Consumer | What |
|----------|------|
| `views/ViewRouter.tsx` | Routes `railActive` to the correct feature view |
| `views/*.tsx` | Individual view wrappers import their feature component |
| `app/page.tsx` | Templates (SaveTemplateModal, TemplatePicker) |

## Shared Dependencies (top-level components used by workstation features)

- `components/comments/` — comment threads
- `components/activity/` — activity margin
- `components/history/` — version history modal
- `components/terminal/` — embedded terminal
- `components/notifications/` — notification panel
- `components/shared/` — hooks, primitives, utilities
