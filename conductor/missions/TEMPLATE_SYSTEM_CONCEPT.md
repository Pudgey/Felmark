# Template System — Saved Blocks & Layouts

**Created**: 2026-03-29
**Type**: Concept / Pre-Mission
**Milestone**: M1 (basic) → M2 (variables, versions) → M3 (linked, shared)

---

## Concept

Like Elementor's saved widgets, but for freelancer documents. Build a block (or group of blocks), save it as a template, recall it instantly with `/` anywhere.

---

## How It Works

**Save**: Select one or more blocks → right-click or `⌘⇧S` → "Save as template" → name it. Done.

**Recall**: Type `/` in any block → templates appear in a "My Templates" section at the top of the slash menu, above the standard block types (H1, bullet, etc.). Type to fuzzy-filter. Hit enter and the blocks drop in.

**Manage**: A templates drawer in the sidebar (under a new Rail icon) shows all saved templates with preview, edit, delete, and duplicate.

---

## Template Types

| Type | What It Saves | Use Case |
|------|--------------|----------|
| **Block template** | Single block with formatting | A styled callout you reuse ("Client: ___ — Due: ___ — Budget: ___") |
| **Group template** | Multiple blocks as a unit | Meeting notes structure (H1 + date callout + agenda bullets + action items section) |
| **Page template** | Entire document skeleton | Project kickoff doc, proposal template, weekly report |

---

## Where They Live

- **Personal templates** — yours, available across all workspaces
- **Workspace templates** — scoped to a client workspace, shared with collaborators (Pro/Team tier)
- **Felmark templates** — curated starter set shipped with the product (meeting notes, project brief, invoice draft, weekly standup, client feedback form)

---

## Slash Menu Integration

```
/                          ← triggers menu
┌─────────────────────────┐
│ my templates             │  ← saved templates first
│  ◆ Meeting Notes         │
│  ◆ Project Brief         │
│  ◆ Client Callout        │
│                          │
│ workspace templates      │  ← shared with this workspace
│  ◆ Meridian Feedback     │
│                          │
│ blocks                   │  ← existing block types
│  T  Text                 │
│  H1 Heading 1            │
│  ...                     │
└─────────────────────────┘
```

Typing after `/` filters across both templates and block types. Templates show a small preview tooltip on hover.

---

## Power Features (Progressive)

### Variables / Placeholders
Templates can have `{{client_name}}`, `{{date}}`, `{{project}}` that auto-fill from the active workspace context. The "Client Callout" template becomes:

```
◆ Client: Meridian Studio — Due: Apr 3 — Budget: $2,400
```

...without the freelancer typing any of it.

### Version Snapshots
Each time you update a template, the previous version is kept. You can roll back. Prevents the "I accidentally broke my proposal template" problem.

### Usage Stats
Track which templates you actually use. Surface the top 3 in a "quick insert" row at the very top of the slash menu — zero scrolling for your most common workflows.

### Keyboard Shortcut Binding
Pin your top template to `⌘⇧1` through `⌘⇧9` for instant insert without even opening the slash menu.

---

## The Elementor Parallel

| Elementor | Felmark |
|-----------|---------|
| Saved widget | Block template |
| Saved section | Group template |
| Saved page | Page template |
| Global widget (edit once, updates everywhere) | **Linked template** — edit the source, all instances update |
| Template library | Felmark starter templates + community marketplace (M4+) |

The "linked template" concept is the big unlock for freelancers who reuse contract clauses, terms & conditions, or brand guidelines across clients. Edit once, propagates everywhere. M3+ feature but worth designing the data model for now.

---

## Monetization Angle

- **Free**: 5 templates, block templates only
- **Pro**: Unlimited templates, all types, variables, version history
- **Team**: Workspace templates, linked templates, usage analytics

---

## Data Model (Lightweight)

```
Template {
  id, name, type (block | group | page),
  scope (personal | workspace:<id>),
  blocks: Block[],       // the saved content
  variables: string[],   // placeholder keys
  tags: string[],
  usageCount, lastUsed,
  createdAt, updatedAt,
  versions: Block[][]    // previous snapshots
}
```

---

## What Makes This Different From Notion

Notion has templates but they're page-level and clunky. Felmark's version is:

1. **Block-level granular** — save a single callout, not a whole page
2. **Slash-first** — templates are a first-class citizen in the `/` menu, not buried in a sidebar
3. **Context-aware** — variables auto-fill from the workspace (client name, project, due date)
4. **Freelancer-shaped** — starter templates are for proposals, invoices, meeting notes, not generic "to-do list" or "reading list"

---

## Implementation Phases

### Phase 1 (M1) — Basic Templates
- Save single/multi block as template
- Templates section in slash menu
- Template manager in sidebar
- 3-5 Felmark starter templates
- Local storage

### Phase 2 (M2) — Variables & Versioning
- `{{variable}}` placeholders with auto-fill
- Version history on template edits
- Usage stats + quick insert row
- Cloud sync (Supabase)

### Phase 3 (M3) — Shared & Linked
- Workspace-scoped templates
- Linked templates (edit once, update everywhere)
- Keyboard shortcut binding (`⌘⇧1-9`)

### Phase 4 (M4+) — Marketplace
- Community template marketplace
- Template ratings and installs
- Revenue share for template creators
