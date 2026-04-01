# Organization Standard

> Organization and scale are more important than velocity. A well-structured codebase at 10K lines stays manageable at 100K. A messy one at 10K becomes unmaintainable at 20K.

**Last Reviewed**: 2026-04-01
**Next Review**: 2026-05-01

## Why This Exists

Felmark hit its first major reorganization at 3 days old. Editor.tsx was routing 12 unrelated views. Block types were split across 4 bundle files and 14 individual folders with no consistent pattern. Features that belonged to Workstation were scattered as top-level siblings. This standard exists to prevent that from happening again.

## Hard Thresholds

### File Size
| Lines | Status | Action |
|-------|--------|--------|
| < 500 | Green | Proceed normally |
| 500–800 | Yellow | Flag to user: "This file is at X lines. Want me to split before adding more?" |
| > 800 | Red | Do NOT add code. Propose a refactor plan first. Get approval. |
| > 1000 | Hard stop | This file must be split before any further work. No exceptions. |

### Folder Size
| Siblings | Status | Action |
|----------|--------|--------|
| < 10 | Green | Proceed normally |
| 10–15 | Yellow | Flag to user: "This folder has X items. Should we organize into sub-folders?" |
| > 15 | Red | Propose restructuring. Group by concern, category, or domain. |

### Component Responsibility
A component should do ONE thing:
- Render a view OR manage state OR handle routing — not all three
- A component rendering views it doesn't own is a structural bug
- If you're adding a third concern to a component, it needs splitting

### Import Depth
| Levels | Status | Action |
|--------|--------|--------|
| 1–3 | Green | Normal |
| 4 | Yellow | Consider if the file is in the wrong folder |
| 5+ | Red | The file is in the wrong place. Move it closer to its consumers. |

## Canonical Architecture

### Product Surfaces
```
components/
├── workstation/     ← Flagship product. ALL workstation features nest here.
└── workspace/       ← Separate product surface. Independent.
```

Everything that belongs to the workstation experience lives under `workstation/`. This includes the editor, calendar, search, pipeline, finance, wire, team, services, templates, forge-paper, dashboard, and terminal-welcome.

### Editor Structure
```
workstation/editor/
├── blocks/          ← One folder per block type. No bundle files.
│   ├── <block>/     ← BlockName.tsx + BlockName.module.css + MANIFEST.md
│   └── shared/      ← Shared block utilities (useInView, etc.)
├── chrome/          ← Editor UI that isn't a block (slash-menu, format-bar, etc.)
├── panels/          ← Slide-out panels (conversation, cat, share-modal)
├── Editor.tsx       ← The editor component. Renders blocks. Nothing else.
└── Editor.module.css
```

### View Routing
```
app/page.tsx          ← State + layout. Passes props to ViewRouter.
views/ViewRouter.tsx  ← railActive → component mapping. One switch.
views/<name>.tsx      ← Thin wrapper. Wires props to one component. 15-50 lines.
```

**Routing lives in views/, not in components.** A component should never contain `if (railActive === "X")` logic.

### Cross-Cutting Components
These live at the top level of `components/` because they're shared across product surfaces:
- `shared/` — hooks, primitives, utilities
- `comments/`, `activity/`, `history/`, `notifications/`, `terminal/`
- `rail/`, `sidebar/`, `launchpad/`, `onboarding/`

### New Block Type Checklist
1. Create `workstation/editor/blocks/<name>/`
2. Add `BlockName.tsx` (default export for component, named export for getDefault)
3. Add `BlockName.module.css`
4. Add `MANIFEST.md`
5. Import in `Editor.tsx` from `./blocks/<name>/BlockName`
6. Add to the block rendering switch in Editor.tsx
7. Register in `lib/constants.ts` (CONTENT_DEFAULTS, slash menu category)
8. Update `blocks/MANIFEST.md`

### New Rail View Checklist
1. Create the feature component in `workstation/<feature>/`
2. Create `views/<feature>.tsx` view wrapper
3. Add a `case` in `ViewRouter.tsx`
4. Add any new props to `ViewRouterProps`
5. Pass those props from `page.tsx`
6. Update `views/MANIFEST.md`

## When to Refactor

Refactoring is not a nice-to-have. It's a prerequisite for sustainable velocity. Propose refactoring when:

- A file crosses a yellow threshold and you're about to add to it
- A component is doing 2+ unrelated things
- A folder has become a flat dumping ground
- You notice routing logic inside a non-router component
- Import paths are 4+ levels deep
- You're about to create a new feature and the target area is disorganized

**Frame it as a question, not a demand**: "Editor.tsx is at 700 lines and I'm about to add block rendering for the new type. Want me to extract the block registry into its own file first?"

## Anti-Patterns

| Anti-Pattern | Why It's Bad | What To Do Instead |
|---|---|---|
| Bundle files (5+ components in one file) | Can't find anything, merge conflicts, CSS bleed | One folder per component |
| God components (renders 10+ views) | Impossible to reason about, every change risks breaking something | Extract into ViewRouter + view wrappers |
| Flat folders (20+ siblings) | No hierarchy = no navigability | Group by concern into sub-folders |
| Routing in components | Components shouldn't know about app navigation | Move to views/ViewRouter |
| "I'll refactor later" | You won't. And the next person won't know it needs it. | Refactor now or flag it explicitly |
